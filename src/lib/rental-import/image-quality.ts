import sharp from "sharp";
import { createHash } from "node:crypto";
import { inspectImage } from "./media";

export class ImageQualityError extends Error {}

/** Decode the entire image; headers alone cannot detect truncation or thumbnails. */
/** 写真は短辺400px・長辺640px以上。間取り図は取得元の原画像が小さいことが多いため短辺300px・長辺420px以上（2026-09-25）。 */
export const MIN_IMAGE_SIZE = { photo: { short: 400, long: 640 }, floorplan: { short: 300, long: 420 } } as const;
export async function inspectOriginalImage(bytes: Uint8Array, kind: "photo" | "floorplan" = "photo") {
  try {
    const file = inspectImage(bytes);
    const image = sharp(bytes, { failOn: "warning", limitInputPixels: 40_000_000 });
    const meta = await image.metadata();
    if ((meta.pages ?? 1) !== 1) throw new Error("アニメーション画像は使用できません");
    const { data, info } = await image.rotate().toColourspace("srgb").ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const min = MIN_IMAGE_SIZE[kind];
    if (Math.min(info.width, info.height) < min.short || Math.max(info.width, info.height) < min.long) {
      throw new Error(`画像が小さすぎます（${info.width}×${info.height}）。一覧のサムネイルではなく拡大画像を取得してください`);
    }
    const pixelHash = createHash("sha256").update(`${info.width}:${info.height}:`).update(data).digest("hex");
    return { ...file, width: info.width, height: info.height, pixelHash };
  } catch (error) {
    throw new ImageQualityError(error instanceof Error ? error.message : "画像を読み取れません");
  }
}
