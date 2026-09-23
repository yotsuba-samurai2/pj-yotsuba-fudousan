import { config } from "dotenv";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { prepareImages, replaceImages, assertImageTarget, sameImages } from "../../src/lib/rental-import/image-repair";

async function main() {
  config({ path: process.env.RENTAL_ENV_FILE ?? ".env.local", quiet: true });
  const args = process.argv.slice(2), file = args.find(a => !a.startsWith("--"));
  if (!file || args.some(a => a.startsWith("--") && a !== "--apply")) throw new Error("Usage: npm run rental:images -- manifest.json [--apply]");
  const prepared = await prepareImages(JSON.parse(await readFile(file, "utf8")), readFile);
  const root = resolve(process.env.RENTAL_IMAGE_OUTPUT ?? ".local/rental-images", `${prepared.manifest.slug}-${Date.now()}`);
  await mkdir(root, { recursive: true, mode: 0o700 });
  const report = { manifest: prepared.manifest, omitted: prepared.omitted, images: prepared.images.map(({ index, kind, alt, media }) => ({ index, kind, alt, media })) };
  await writeFile(resolve(root, "quality-report.json"), JSON.stringify(report, null, 2), { mode: 0o600 });
  console.log(JSON.stringify({ action: "checked", count: prepared.images.length, omitted: prepared.omitted, report: root }));
  if (!args.includes("--apply")) return;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Storage credentials missing");
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: row, error } = await db.from("properties").select("*").eq("slug", prepared.manifest.slug).single();
  if (error || !row) throw new Error("対象の物件を読み取れません");
  const target = { id: row.id, slug: row.slug, updatedAt: row.updated_at, status: row.status, provider: row.internal?.rentalImport?.source?.provider, roomId: row.internal?.rentalImport?.source?.roomId, images: row.images };
  assertImageTarget(target, prepared.manifest);
  const storage = db.storage.from("column-images");
  const images = await replaceImages(prepared, target, {
    backup: () => writeFile(resolve(root, "before.json"), JSON.stringify(row, null, 2), { mode: 0o600 }),
    upload: async image => {
      const path = `bukken/auto/${target.slug}/${image.media.hash}.${image.media.ext}`;
      const { error } = await storage.upload(path, image.bytes, { contentType: image.media.contentType, cacheControl: "31536000", upsert: true });
      if (error) throw new Error(`画像${image.index}の保存に失敗しました`);
      // Verify the actual stored bytes before attaching to the public listing.
      const { data, error: readError } = await storage.download(path);
      if (readError || !data || !Buffer.from(await data.arrayBuffer()).equals(Buffer.from(image.bytes))) throw new Error(`画像${image.index}の保存内容が一致しません`);
      return storage.getPublicUrl(path).data.publicUrl;
    },
    compareAndSwap: async images => {
      // Deliberately leave terms, status, translations, and source freshness untouched.
      const { data, error } = await db.from("properties").update({ images, updated_at: new Date().toISOString() }).eq("id", target.id).eq("slug", target.slug).eq("updated_at", target.updatedAt).select("id");
      if (error) throw new Error("画像の反映に失敗しました");
      return data?.length === 1;
    },
    verify: async images => {
      const { data, error } = await db.from("properties").select("*").eq("id", target.id).single();
      if (error || !data || !sameImages(data.images, images)) throw new Error("保存後の画像確認に失敗しました");
      for (const field of Object.keys(row).filter(k => !["images", "updated_at"].includes(k))) {
        if (JSON.stringify(row[field]) !== JSON.stringify(data[field])) throw new Error(`反映中に${field}が変更されました。確認してください`);
      }
      await writeFile(resolve(root, "after.json"), JSON.stringify(data, null, 2), { mode: 0o600 });
    },
  });
  console.log(JSON.stringify({ action: "verified", count: images.length, url: `https://luck428.com/bukken/${target.slug}`, report: root }));
}
main().catch(error => { console.error(error instanceof Error ? error.message : "画像更新に失敗しました"); process.exitCode = 1; });
