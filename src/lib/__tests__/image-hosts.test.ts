import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { isOptimizableImageUrl, OPTIMIZABLE_REMOTE_PATTERNS } from "@/lib/shared/image-hosts";

const HOST = OPTIMIZABLE_REMOTE_PATTERNS[0].hostname;

describe("isOptimizableImageUrl（next/image に渡してよい URL）", () => {
  it("自社 Storage の公開バケットは可", () => {
    expect(isOptimizableImageUrl(`https://${HOST}/storage/v1/object/public/column-images/bukken/202609/a.jpg`)).toBe(true);
  });

  it("サイト内の相対パスは可", () => {
    expect(isOptimizableImageUrl("/hero/bunkyo-sakura-16x9.webp")).toBe(true);
  });

  it("他人の Supabase・非公開パス・http・プロトコル相対は不可（素の img に戻す）", () => {
    expect(isOptimizableImageUrl("https://other.supabase.co/storage/v1/object/public/x.jpg")).toBe(false);
    expect(isOptimizableImageUrl(`https://${HOST}/storage/v1/object/sign/x.jpg`)).toBe(false);
    expect(isOptimizableImageUrl(`http://${HOST}/storage/v1/object/public/x.jpg`)).toBe(false);
    expect(isOptimizableImageUrl(`//${HOST}/storage/v1/object/public/x.jpg`)).toBe(false);
    expect(isOptimizableImageUrl("not a url")).toBe(false);
  });

  it("remotePatterns は自社ホストの公開パスだけ（ワイルドカードのホストを使わない）", () => {
    for (const p of OPTIMIZABLE_REMOTE_PATTERNS) {
      expect(p.hostname).not.toContain("*");
      expect(p.pathname).toBe("/storage/v1/object/public/**");
    }
  });
});

describe("ヒーロー画像は next/image で配信する（2026-09-23 LCP是正の退行防止）", () => {
  const files = [
    "src/components/shared/LaborServicePage.tsx",
    "src/components/shared/LegalServicePage.tsx",
    "src/components/shared/RealestateServicePage.tsx",
    "src/components/bukken/PropertyCard.tsx",
    "src/components/bukken/PropertyPhotoGallery.tsx",
  ];
  for (const f of files) {
    it(`${f} に素の <img を置かない`, () => {
      const src = readFileSync(join(process.cwd(), f), "utf8");
      // 署名の小さな顔写真（48px）だけは対象外
      const imgs = [...src.matchAll(/<img\b[\s\S]*?\/>/g)].map((m) => m[0]).filter((t) => !t.includes("/staff/uramatsu-square.webp"));
      expect(imgs).toEqual([]);
    });
  }
});
