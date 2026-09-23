import sharp from "sharp";
import { createHash } from "node:crypto";
import { inspectImage } from "./media";

export class ImageQualityError extends Error {}

/** Decode the entire image; headers alone cannot detect truncation or thumbnails. */
export async function inspectOriginalImage(bytes: Uint8Array) {
  try {
    const file = inspectImage(bytes);
    const image = sharp(bytes, { failOn: "warning", limitInputPixels: 40_000_000 });
    const meta = await image.metadata();
    if ((meta.pages ?? 1) !== 1) throw new Error("アニメーション画像は使用できません");
    const { data, info } = await image.rotate().toColourspace("srgb").ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    if (Math.min(info.width, info.height) < 400 || Math.max(info.width, info.height) < 640) {
      throw new Error(`画像が小さすぎます（${info.width}×${info.height}）。一覧のサムネイルではなく拡大画像を取得してください`);
    }
    const pixelHash = createHash("sha256").update(`${info.width}:${info.height}:`).update(data).digest("hex");
    return { ...file, width: info.width, height: info.height, pixelHash };
  } catch (error) {
    throw new ImageQualityError(error instanceof Error ? error.message : "画像を読み取れません");
  }
}
