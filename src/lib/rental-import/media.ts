import { createHash } from "node:crypto";
export function inspectImage(bytes: Uint8Array): { ext: string; contentType: string; hash: string } {
  if (bytes.length < 12 || bytes.length > 10 * 1024 * 1024) throw new Error("画像は10MB以下のJPEG/PNG/WebPにしてください");
  const b = Buffer.from(bytes);
  const format = b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff ? ["jpg", "image/jpeg"]
    : b.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ? ["png", "image/png"]
    : b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP" ? ["webp", "image/webp"] : null;
  if (!format) throw new Error("画像の実体がJPEG/PNG/WebPではありません。図面PDFやHTMLは画像として公開できません");
  return { ext: format[0], contentType: format[1], hash: createHash("sha256").update(bytes).digest("hex") };
}
export function isOwnedImage(url: string, supabaseUrl: string): boolean {
  try { const u = new URL(url), base = new URL(supabaseUrl);
    return u.protocol === "https:" && u.origin === base.origin && !u.search && !u.hash &&
      /^\/storage\/v1\/object\/public\/column-images\/bukken\/[a-zA-Z0-9/_-]+\.(jpg|jpeg|png|webp)$/.test(u.pathname);
  } catch { return false; }
}
