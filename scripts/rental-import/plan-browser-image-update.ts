import { readFile, writeFile } from "node:fs/promises";
import { prepareImages, assertImageTarget } from "../../src/lib/rental-import/image-repair";
import { isOwnedImage } from "../../src/lib/rental-import/media";

// Connector fallback: a full row snapshot is the backup; never copy browser credentials.
async function main() {
  const [manifestPath, snapshotPath, uploadedPath, supabaseUrl, output] = process.argv.slice(2);
  if (!output) throw new Error("Usage: plan-browser-image-update.ts manifest.json before.json uploaded.json SUPABASE_URL output.sql");
  const prepared = await prepareImages(JSON.parse(await readFile(manifestPath, "utf8")), readFile);
  const row = JSON.parse(await readFile(snapshotPath, "utf8"));
  const uploaded = JSON.parse(await readFile(uploadedPath, "utf8")) as { index: number; file: string; url: string }[];
  const target = { id: row.id, slug: row.slug, updatedAt: row.updated_at, status: row.status, images: row.images, provider: row.internal?.rentalImport?.source?.provider, roomId: row.internal?.rentalImport?.source?.roomId };
  assertImageTarget(target, prepared.manifest);
  if (uploaded.length !== prepared.images.length || new Set(uploaded.map(i => i.index)).size !== uploaded.length || new Set(uploaded.map(i => i.url)).size !== uploaded.length) throw new Error("アップロード件数か番号が一致しません");
  const images = prepared.images.map(i => {
    const saved = uploaded.find(u => u.index === i.index);
    const source = prepared.manifest.entries.find(e => e.index === i.index)!;
    if (!saved || saved.file !== source.file || !isOwnedImage(saved.url, supabaseUrl)) throw new Error("アップロード画像の対応が一致しません");
    return { url: saved.url, alt: i.alt, kind: i.kind };
  });
  const literal = (s: string) => `'${s.replaceAll("'", "''")}'`;
  const sql = `UPDATE public.properties SET images=${literal(JSON.stringify(images))}::jsonb, updated_at=clock_timestamp()
WHERE id=${literal(target.id)} AND slug=${literal(target.slug)} AND updated_at=${literal(target.updatedAt)}::timestamp
AND internal->'rentalImport'->'source'->>'provider'=${literal(prepared.manifest.provider)}
AND internal->'rentalImport'->'source'->>'roomId'=${literal(prepared.manifest.roomId)}
RETURNING id, slug, status, images, updated_at;\n`;
  await writeFile(output, sql, { mode: 0o600 });
  console.log(JSON.stringify({ action: "planned", count: images.length, output, note: "Execute with the project-bound Supabase connector; require exactly one returned row, then verify public images and unchanged non-image fields." }));
}
main().catch(e => { console.error(e instanceof Error ? e.message : "Failed"); process.exitCode = 1; });
