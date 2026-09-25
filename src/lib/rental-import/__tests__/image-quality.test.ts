import { describe, expect, it, vi } from "vitest";
import sharp from "sharp";
import { inspectOriginalImage } from "../image-quality";
import { prepareImages, replaceImages, sameImages, type ImageManifest } from "../image-repair";
import { parsePropertyPatch } from "../../property-validation";

const picture = (color: string, width = 570, height = 760) => sharp({ create: { width, height, channels: 3, background: color } }).png().toBuffer();
const manifest = (): ImageManifest => ({
  slug: "rent-123", provider: "eslife", roomId: "room-1", sourceUrl: "https://rent.es-square.net/bukken/chintai/search/detail/room-1", expectedCount: 2, visualReviewComplete: true,
  entries: [{ index: 0, file: "photo", kind: "photo", alt: "外観" }, { index: 1, file: "plan", kind: "floorplan", alt: "間取り" }],
});
const read = async (path: string) => picture(path === "photo" ? "red" : "blue");
const target = { id: "target", slug: "rent-123", provider: "eslife", roomId: "room-1", updatedAt: "2026-09-23T00:00:00Z", status: "published", images: [] };

describe("画像取込の再発防止", () => {
  it("72×96サムネイルを拒否し、570×760原画像を受け入れる", async () => {
    await expect(inspectOriginalImage(await picture("red", 72, 96))).rejects.toThrow("小さすぎ");
    expect(await inspectOriginalImage(await picture("red"))).toMatchObject({ width: 570, height: 760 });
  });
  it("間取り図は318×422の原画像を受け入れ、サムネイルは拒否する", async () => {
    expect(await inspectOriginalImage(await picture("blue", 318, 422), "floorplan")).toMatchObject({ width: 318, height: 422 });
    await expect(inspectOriginalImage(await picture("blue", 318, 422))).rejects.toThrow("小さすぎ");
    await expect(inspectOriginalImage(await picture("blue", 150, 200), "floorplan")).rejects.toThrow("小さすぎ");
  });
  it("ヘッダが正常でも途中で切れたJPEGを拒否", async () => {
    const jpg = await sharp(await picture("red")).jpeg().toBuffer();
    await expect(inspectOriginalImage(jpg.subarray(0, Math.floor(jpg.length / 2)))).rejects.toThrow();
  });
  it("メタデータやファイル名が違っても同じ画素は一度だけ採用", async () => {
    const original = await picture("red"), withMetadata = await sharp(original).withMetadata().png().toBuffer();
    expect(original.equals(withMetadata)).toBe(false);
    const m = manifest(); m.expectedCount = 3; m.entries.push({ index: 2, file: "renamed", kind: "photo", alt: "重複" });
    const result = await prepareImages(m, async path => path === "photo" ? original : path === "renamed" ? withMetadata : picture("blue"));
    expect(result.images).toHaveLength(2); expect(result.omitted[0].index).toBe(2);
  });
  it("異なる写真を消さず、帯入り図面は理由付きで除外", async () => {
    const m = manifest(); m.expectedCount = 4;
    m.entries.push({ index: 2, file: "different", kind: "photo", alt: "別の写真" }, { index: 3, file: "flyer", kind: "exclude", alt: "募集図面", reason: "元付帯あり" });
    const result = await prepareImages(m, async p => p === "different" ? picture("green") : read(p));
    expect(result.images).toHaveLength(3); expect(result.omitted).toEqual([{ index: 3, reason: "元付帯あり" }]);
  });
  it("取得漏れ、番号重複、誤った号室のURLを拒否", async () => {
    const missing = manifest(); missing.expectedCount = 3;
    await expect(prepareImages(missing, read)).rejects.toThrow("取得漏れ");
    const duplicate = manifest(); duplicate.entries[1].index = 0;
    await expect(prepareImages(duplicate, read)).rejects.toThrow("重複");
    await expect(prepareImages({ ...manifest(), roomId: "other" }, read)).rejects.toThrow("物件番号");
  });
  it("写真と間取りの誤分類を検出", async () => {
    await expect(prepareImages(manifest(), () => picture("red"))).rejects.toThrow("写真と間取り");
  });
  it("違う号室にはアップロードも保存もしない", async () => {
    const prepared = await prepareImages(manifest(), read);
    const backup = vi.fn(), upload = vi.fn(), compareAndSwap = vi.fn(), verify = vi.fn();
    await expect(replaceImages(prepared, { ...target, roomId: "other" }, { backup, upload, compareAndSwap, verify })).rejects.toThrow("号室");
    expect(backup).not.toHaveBeenCalled(); expect(upload).not.toHaveBeenCalled();
  });
  it("バックアップ後に保存し、同時更新なら上書きしない", async () => {
    const prepared = await prepareImages(manifest(), read), calls: string[] = [];
    await expect(replaceImages(prepared, target, {
      backup: async () => { calls.push("backup"); },
      upload: async i => { calls.push("upload"); return `https://storage/${i.index}.png`; },
      compareAndSwap: async () => false, verify: async () => { throw Error("should not verify"); },
    })).rejects.toThrow("同時更新");
    expect(calls).toEqual(["backup", "upload", "upload"]);
  });
  it("同じ画像集合で再実行しても物件を更新しない", async () => {
    const prepared = await prepareImages(manifest(), read);
    const images = prepared.images.map(i => ({ url: `https://storage/${i.index}.png`, alt: i.alt, kind: i.kind }));
    const compareAndSwap = vi.fn(), verify = vi.fn();
    await replaceImages(prepared, { ...target, images }, { backup: async () => {}, upload: async i => `https://storage/${i.index}.png`, compareAndSwap, verify });
    expect(compareAndSwap).not.toHaveBeenCalled(); expect(verify).toHaveBeenCalledWith(images);
  });
  it("JSONBのキー順序が違っても同じ画像集合と判定", () => {
    expect(sameImages([{ url: "a", alt: "外観", kind: "photo" }], [{ kind: "photo", alt: "外観", url: "a" }])).toBe(true);
  });
  it("通常の物件保存でもURLの重複を拒否", () => {
    expect(parsePropertyPatch({ images: [{ url: "a", alt: "外観" }, { url: "a", alt: "別名" }] }).ok).toBe(false);
  });
});
