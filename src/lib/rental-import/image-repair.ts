import { z } from "zod";
import type { PropertyImage } from "../property-shared";
import { inspectOriginalImage } from "./image-quality";

const entry = z.object({
  index: z.number().int().nonnegative(), file: z.string().min(1),
  kind: z.enum(["photo", "floorplan", "exclude"]), alt: z.string().min(1),
  reason: z.string().optional(),
});
export const imageManifestSchema = z.object({
  slug: z.string().regex(/^rent-[a-z0-9]+$/),
  roomId: z.string().min(1), provider: z.enum(["eslife", "itandi"]),
  sourceUrl: z.url(), expectedCount: z.number().int().min(1).max(100),
  // Set only after opening every enlarged image and inspecting a contact sheet.
  visualReviewComplete: z.literal(true), entries: z.array(entry).min(1).max(100),
});
export type ImageManifest = z.infer<typeof imageManifestSchema>;
export type CheckedImage = {
  bytes: Uint8Array; index: number; kind: "photo" | "floorplan"; alt: string;
  media: Awaited<ReturnType<typeof inspectOriginalImage>>;
};

/** Complete preflight before uploading anything. Order in entries is display order. */
export async function prepareImages(input: unknown, read: (path: string) => Promise<Uint8Array>) {
  const manifest = imageManifestSchema.parse(input);
  const source = new URL(manifest.sourceUrl);
  const host = manifest.provider === "eslife" ? "rent.es-square.net" : "itandibb.com";
  if (source.protocol !== "https:" || !(source.hostname === host || source.hostname.endsWith(`.${host}`)) || !source.pathname.split("/").includes(manifest.roomId)) throw new Error("取得元URLと物件番号が一致しません");
  const indexes = new Set(manifest.entries.map(e => e.index));
  if (indexes.size !== manifest.expectedCount || manifest.entries.length !== manifest.expectedCount || [...indexes].some(i => i >= manifest.expectedCount)) throw new Error("画像の取得漏れ、またはギャラリー番号の重複があります");
  const images: CheckedImage[] = [], omitted: { index: number; reason: string }[] = [];
  const seen = new Map<string, CheckedImage>();
  for (const item of manifest.entries) {
    if (item.kind === "exclude") {
      if (!item.reason?.trim()) throw new Error("除外理由を記録してください");
      omitted.push({ index: item.index, reason: item.reason });
      continue;
    }
    const bytes = await read(item.file), media = await inspectOriginalImage(bytes, item.kind);
    const duplicate = seen.get(media.pixelHash);
    if (duplicate) {
      if (duplicate.kind !== item.kind) throw new Error("同一画像が写真と間取りに分類されています。目視で再確認してください");
      omitted.push({ index: item.index, reason: `画像${duplicate.index}と同一の画素` });
      continue;
    }
    const checked = { bytes, media, index: item.index, kind: item.kind, alt: item.alt };
    seen.set(media.pixelHash, checked); images.push(checked);
  }
  if (!images.some(i => i.kind === "photo") || !images.some(i => i.kind === "floorplan")) throw new Error("写真と間取りの両方が必要です");
  return { manifest, images, omitted };
}

export type ImageTarget = {
  id: string; slug: string; updatedAt: string; status: string;
  provider?: string; roomId?: string; images: PropertyImage[];
};
export function assertImageTarget(target: ImageTarget, manifest: ImageManifest) {
  if (!target.id || !target.updatedAt || target.slug !== manifest.slug || target.provider !== manifest.provider || target.roomId !== manifest.roomId) throw new Error("更新対象の物件・号室が一致しません");
  if (target.status === "closed") throw new Error("募集終了の物件は更新できません");
}

export function sameImages(a: PropertyImage[], b: PropertyImage[]) {
  return a.length === b.length && a.every((image, n) => image.url === b[n].url && image.alt === b[n].alt && image.kind === b[n].kind);
}

/** Adapter keeps production write restricted to images and compare-and-swap. */
export async function replaceImages(
  prepared: Awaited<ReturnType<typeof prepareImages>>, target: ImageTarget,
  io: {
    backup: () => Promise<void>;
    upload: (image: CheckedImage) => Promise<string>;
    compareAndSwap: (images: PropertyImage[]) => Promise<boolean>;
    verify: (images: PropertyImage[]) => Promise<void>;
  },
) {
  assertImageTarget(target, prepared.manifest);
  await io.backup();
  const images: PropertyImage[] = [];
  for (const image of prepared.images) images.push({ url: await io.upload(image), alt: image.alt, kind: image.kind });
  if (new Set(images.map(i => i.url)).size !== images.length) throw new Error("保存URLが重複しています");
  if (!sameImages(images, target.images) && !await io.compareAndSwap(images)) throw new Error("同時更新を検出しました。既存データを上書きせず停止しました");
  await io.verify(images);
  return images;
}
