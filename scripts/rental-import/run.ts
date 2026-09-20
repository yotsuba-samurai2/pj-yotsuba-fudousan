import { readFile, writeFile, realpath, stat } from "node:fs/promises";
import { resolve, relative, isAbsolute } from "node:path";
import { config } from "dotenv";
import { portalCheckSchema, summarizePortalChecks } from "../../src/lib/rental-import/portal-counts";
import { selectMailCandidates, type MailInput } from "../../src/lib/rental-import/candidates";
import { validateRentalImport } from "../../src/lib/rental-import/validation";
import { inspectImage, isOwnedImage } from "../../src/lib/rental-import/media";
import { closeRental, importRental, type ImportResult } from "../../src/lib/rental-import/lifecycle";

async function main() {
  const args = process.argv.slice(2), command = args[0];
  const arg = (name: string) => args.find((s) => s.startsWith(`--${name}=`))?.slice(name.length + 3);
  const write = args.includes("--write"), inputPath = arg("input"), reportPath = arg("report");
  if (!command || !["scan", "import", "close", "list", "portal-counts"].includes(command)) throw new Error("使用法: rental:run scan|import|close|list|portal-counts --input=JSON --report=JSON [--write] [--mode=draft|published] [--assets=DIR] [--maintenance]");
  const now = new Date();
  if (command === "portal-counts") {
    if (!inputPath) throw new Error("--input が必要です");
    const checks = portalCheckSchema.array().parse(JSON.parse(await readFile(inputPath, "utf8")));
    await output({ portalCounts: summarizePortalChecks(checks) }); return;
  }
  if (command === "scan") {
    if (!inputPath) throw new Error("--input が必要です");
    const mails = JSON.parse(await readFile(inputPath, "utf8")) as MailInput[];
    if (!Array.isArray(mails) || mails.some((m) => !m.id || !m.receivedAt || typeof m.subject !== "string" || typeof m.text !== "string")) throw new Error("メールJSONの形式が不正です");
    await output({ checkedAt: now.toISOString(), candidates: selectMailCandidates(mails, now) }); return;
  }
  config({ path: arg("env") ?? ".env.local", quiet: true });
  if (command === "list") {
    const { getProperties } = await import("../../src/lib/db/properties");
    const { prisma } = await import("../../src/lib/prisma");
    try { await output({ checkedAt: now.toISOString(), listings: (await getProperties()).filter((p) => p.dealType === "rental" && p.internal?.rentalImport).map((p) => ({ slug: p.slug, status: p.status, updatedAt: p.updatedAt, source: (p.internal!.rentalImport as Record<string, unknown>).source, evidence: p.internal!.rentalImport, property: p })) }); }
    finally { await prisma.$disconnect(); } return;
  }
  if (!inputPath) throw new Error("--input が必要です");
  const records = JSON.parse(await readFile(inputPath, "utf8"));
  if (!Array.isArray(records)) throw new Error("入力は物件の配列にしてください");
  const mode = arg("mode") ?? "draft";
  if (mode !== "draft" && mode !== "published") throw new Error("modeはdraftまたはpublishedです");
  const maintenance = args.includes("--maintenance");
  if (write && process.env.RENTAL_IMPORT_ENABLED !== "true") throw new Error("本番反映後にRENTAL_IMPORT_ENABLED=trueを設定してください");
  const results: ImportResult[] = [];
  // Dry runs neither open the DB nor upload images. Closure dry runs use schema validation only.
  if (!write) {
    const { closureSchema } = await import("../../src/lib/rental-import/lifecycle");
    for (const record of records) {
      if (command === "close") {
        const result = closureSchema.safeParse(record);
        results.push({ action: "held", reasons: result.success ? ["dry-run: 掲載終了の形式確認済み。DB未変更"] : ["掲載終了確認の形式が不正です"] });
      } else {
        const result = validateRentalImport(record, now, mode, maintenance);
        results.push(result.ok ? { action: "unchanged", slug: result.property.slug, reasons: ["dry-run: 登録条件通過。画像・DB書込みは未実施"] } : { action: "held", reasons: result.reasons });
      }
    }
    await output({ checkedAt: now.toISOString(), dryRun: true, results }); return;
  }
  const { rentalStore } = await import("../../src/lib/rental-import/db-store");
  const { prisma } = await import("../../src/lib/prisma");
  try {
    for (const record of records) {
      try {
        if (command === "close") { results.push(await closeRental(record, rentalStore, now)); continue; }
        const gate = validateRentalImport(record, now, mode, maintenance);
        if (!gate.ok) { results.push({ action: "held", reasons: gate.reasons }); continue; }
        const preflight = await importRental(gate.value, { ...rentalStore, create: async () => {}, update: async () => true }, now, mode, maintenance);
        if (preflight.action === "held") { results.push(preflight); continue; }
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!supabaseUrl || !key) throw new Error("画像ストレージの設定が不足しています");
        const { createClient } = await import("@supabase/supabase-js");
        const storage = createClient(supabaseUrl, key, { auth: { persistSession: false, autoRefreshToken: false } }).storage.from("column-images");
        for (const image of gate.value.property.images) {
          if (isOwnedImage(image.url, supabaseUrl)) continue;
          if (!image.url.startsWith("asset:") || !arg("assets")) throw new Error("画像は取得済みローカルasset:か自社ストレージURLにしてください");
          const root = await realpath(resolve(arg("assets")!));
          const file = await realpath(resolve(root, image.url.slice(6)));
          const rel = relative(root, file);
          if (rel === ".." || rel.startsWith("../") || isAbsolute(rel)) throw new Error("画像パスが取得済みフォルダ外です");
          if ((await stat(file)).size > 10 * 1024 * 1024) throw new Error("画像は10MB以下にしてください");
          const bytes = await readFile(file), checked = inspectImage(bytes);
          const path = `bukken/auto/${gate.property.slug}/${checked.hash}.${checked.ext}`;
          const { error } = await storage.upload(path, bytes, { contentType: checked.contentType, cacheControl: "31536000", upsert: true });
          if (error) throw new Error("物件画像の保存に失敗しました");
          image.url = storage.getPublicUrl(path).data.publicUrl;
        }
        results.push(await importRental(gate.value, rentalStore, now, mode, maintenance));
      } catch (err) {
        // Avoid connection strings/tokens in logs. Unique conflicts are safe to retry.
        const duplicate = err && typeof err === "object" && "code" in err && err.code === "P2002";
        results.push({ action: "held", reasons: [duplicate ? "同時登録を検出しました。次回再確認します" : "処理エラー。設定・画像・DB接続を確認してください（認証情報はログに出力しません）"] });
      }
    }
  } finally { await prisma.$disconnect(); }
  await output({ checkedAt: now.toISOString(), dryRun: false, results });
  async function output(value: unknown) {
    const text = JSON.stringify(value, null, 2) + "\n";
    if (reportPath) await writeFile(reportPath, text, { mode: 0o600 });
    else console.log(text);
  }
}
main().catch((err) => { console.error(err instanceof Error && !/postgres|password|secret|token/i.test(err.message) ? err.message : "実行に失敗しました。設定を確認してください"); process.exitCode = 1; });
