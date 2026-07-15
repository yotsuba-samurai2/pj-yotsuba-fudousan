/**
 * P2用: FirestoreエクスポートJSON → Supabase Postgres（Prisma経由）投入スクリプト。
 *
 * 使い方（tsxで実行。DATABASE_URL / DIRECT_URL を環境変数で指定）:
 *   npx tsx scripts/import-firestore.ts \
 *     --columns <columns.json> \
 *     [--translations <translations.json>] \
 *     [--ai-settings <settings.json>] \
 *     [--dry-run]
 *
 * 対応フォーマット（コレクションごとに自動判別）:
 *   1. ドキュメント配列:            [{ id?, ...fields }, ...]
 *   2. {docId: doc} マップ:        { "<docId>": { ...fields }, ... }
 *      - translations はロケールコード（ja/en/zh-tw/zh）キーのマップ
 *      - ai_settings は { "ai": {...} } または {...} 単体
 *
 * 変換規則（設計書§5）:
 *   - columns は (business, slug) で冪等upsert（再実行安全）
 *   - Firestore Timestamp（{_seconds}/{seconds}/ISO文字列）→ created_at/updated_at
 *   - locales 未設定 → []（空配列＝全言語公開）
 *   - status 未設定 → "draft"（旧getColumnsのデフォルト補完をロード時に解消）
 */
import fs from "node:fs";
import { PrismaClient, Prisma, type Business, type ColumnStatus } from "@prisma/client";

const prisma = new PrismaClient();

const BUSINESSES = new Set(["realestate", "legal", "labor"]);
const STATUSES = new Set(["draft", "published", "deleted"]);
const LOCALES = new Set(["ja", "en", "zh-tw", "zh"]);

type Doc = Record<string, unknown>;

// ── CLI ──

function parseArgs(argv: string[]) {
  const args: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") args.dryRun = true;
    else if (a.startsWith("--")) {
      args[a.slice(2)] = argv[++i];
    }
  }
  return args as {
    columns?: string;
    translations?: string;
    "ai-settings"?: string;
    dryRun?: boolean;
  };
}

// ── フォーマット判別 ──

/** 配列 or {docId: doc} マップ → [docId | undefined, doc][] に正規化 */
function normalizeDocs(raw: unknown): Array<[string | undefined, Doc]> {
  if (Array.isArray(raw)) {
    return raw.map((d) => {
      const doc = d as Doc;
      const id = typeof doc.id === "string" ? doc.id : undefined;
      return [id, doc];
    });
  }
  if (raw && typeof raw === "object") {
    return Object.entries(raw as Record<string, Doc>).map(([id, doc]) => [id, doc]);
  }
  throw new Error("エクスポートJSONは配列または {docId: doc} マップである必要があります");
}

// ── Timestamp変換 ──

function toDate(v: unknown): Date | undefined {
  if (!v) return undefined;
  if (typeof v === "string") {
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? undefined : d;
  }
  if (typeof v === "object") {
    const o = v as { _seconds?: number; seconds?: number };
    const sec = o._seconds ?? o.seconds;
    if (typeof sec === "number") return new Date(sec * 1000);
  }
  return undefined;
}

function asStringArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

function toJsonOrNull(v: unknown): Prisma.InputJsonValue | typeof Prisma.JsonNull {
  if (v === undefined || v === null) return Prisma.JsonNull;
  return JSON.parse(JSON.stringify(v)) as Prisma.InputJsonValue;
}

// ── columns ──

async function importColumns(file: string, dryRun: boolean) {
  const docs = normalizeDocs(JSON.parse(fs.readFileSync(file, "utf8")));
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const [docId, doc] of docs) {
    const business = doc.business as string;
    const slug = doc.slug as string;
    if (!BUSINESSES.has(business) || typeof slug !== "string" || !slug) {
      console.warn(`  skip: business/slug不正 (docId=${docId ?? "?"})`);
      skipped++;
      continue;
    }
    const status = STATUSES.has(doc.status as string)
      ? (doc.status as ColumnStatus)
      : "draft"; // status欠損 → draft（旧アプリのデフォルト補完と同義）
    const createdAt = toDate(doc.createdAt);
    const updatedAt = toDate(doc.updatedAt);

    const common = {
      title: String(doc.title ?? ""),
      date: String(doc.date ?? ""),
      category: String(doc.category ?? ""),
      excerpt: String(doc.excerpt ?? ""),
      content: String(doc.content ?? ""),
      status,
      modifiedDate: (doc.modifiedDate as string | undefined) ?? null,
      ogImage: (doc.ogImage as string | undefined) ?? null,
      author: toJsonOrNull(doc.author),
      keywords: asStringArray(doc.keywords),
      faq: toJsonOrNull(doc.faq),
      tags: asStringArray(doc.tags),
      locales: asStringArray(doc.locales), // 未設定 → []（＝全言語公開）
      translations: toJsonOrNull(doc.translations),
      ...(createdAt ? { createdAt } : {}),
      ...(updatedAt ? { updatedAt } : {}),
    };

    if (dryRun) {
      console.log(`  [dry-run] upsert ${business}/${slug} (status=${status})`);
      continue;
    }

    const existing = await prisma.column.findUnique({
      where: { business_slug: { business: business as Business, slug } },
      select: { id: true },
    });
    if (existing) {
      await prisma.column.update({ where: { id: existing.id }, data: common });
      updated++;
    } else {
      await prisma.column.create({
        data: { business: business as Business, slug, ...common },
      });
      created++;
    }
  }
  console.log(
    `columns: ${docs.length}件読込 → created=${created} updated=${updated} skipped=${skipped}`,
  );
}

// ── translations ──

async function importTranslations(file: string, dryRun: boolean) {
  const raw = JSON.parse(fs.readFileSync(file, "utf8")) as unknown;
  let entries: Array<[string, Doc]>;
  if (Array.isArray(raw)) {
    entries = raw.map((d) => {
      const doc = d as Doc;
      const locale = (doc.locale ?? doc.id) as string;
      const { locale: _l, id: _i, ...data } = doc;
      return [locale, data];
    });
  } else {
    entries = Object.entries(raw as Record<string, Doc>);
  }
  let count = 0;
  for (const [locale, data] of entries) {
    if (!LOCALES.has(locale)) {
      console.warn(`  skip: 不明なlocale "${locale}"`);
      continue;
    }
    if (dryRun) {
      console.log(`  [dry-run] upsert translations/${locale} (${Object.keys(data).length} keys)`);
      continue;
    }
    const json = toJsonOrNull(data);
    if (json === Prisma.JsonNull) continue;
    await prisma.translation.upsert({
      where: { locale },
      create: { locale, data: json },
      update: { data: json },
    });
    count++;
  }
  console.log(`translations: ${count}ロケール投入`);
}

// ── ai_settings ──

async function importAiSettings(file: string, dryRun: boolean) {
  const raw = JSON.parse(fs.readFileSync(file, "utf8")) as Doc;
  // {"ai": {...}} マップ / [{id:"ai",...}] 配列 / {...} 単体 に対応
  let doc: Doc | undefined;
  if (Array.isArray(raw)) doc = raw[0] as Doc | undefined;
  else if (raw.ai && typeof raw.ai === "object") doc = raw.ai as Doc;
  else doc = raw;
  const model = doc?.model as string | undefined;
  if (!model) {
    console.warn("ai_settings: model が見つからないためスキップ");
    return;
  }
  const updatedBy = (doc?.updatedBy as string | undefined) ?? null;
  if (dryRun) {
    console.log(`  [dry-run] upsert ai_settings/ai (model=${model})`);
    return;
  }
  await prisma.aiSetting.upsert({
    where: { id: "ai" },
    create: { id: "ai", model, updatedBy },
    update: { model, updatedBy },
  });
  console.log(`ai_settings: model=${model} 投入`);
}

// ── main ──

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const dryRun = !!args.dryRun;
  if (!args.columns && !args.translations && !args["ai-settings"]) {
    console.error(
      "使い方: npx tsx scripts/import-firestore.ts --columns <file> [--translations <file>] [--ai-settings <file>] [--dry-run]",
    );
    process.exit(1);
  }
  if (args.columns) await importColumns(args.columns, dryRun);
  if (args.translations) await importTranslations(args.translations, dryRun);
  if (args["ai-settings"]) await importAiSettings(args["ai-settings"], dryRun);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
