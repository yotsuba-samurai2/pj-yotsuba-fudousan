import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BlogPostingJsonLd } from "@/components/seo/BlogPostingJsonLd";
import type { Column } from "@/lib/column-shared";

const column: Column = {
  business: "realestate",
  slug: "jsonld-image-test",
  title: "画像の確認記事",
  date: "2026-09-22",
  category: "確認",
  excerpt: "画像URLの確認です。",
  content: "本文",
};

function renderData(image: string): Record<string, unknown> {
  const html = renderToStaticMarkup(
    BlogPostingJsonLd({
      businessKey: "realestate",
      column,
      image,
      locale: "ja",
    }),
  );
  const json = html.match(/<script[^>]*>(.*)<\/script>/)?.[1];
  if (!json) throw new Error("BlogPosting JSON-LD was not rendered");
  return JSON.parse(json) as Record<string, unknown>;
}

describe("BlogPostingJsonLd image override", () => {
  it("ルート相対画像を正規ホストの絶対URLにする", () => {
    expect(renderData("/hero/legal-inheritance-16x9.webp").image)
      .toBe("https://luck428.com/hero/legal-inheritance-16x9.webp");
  });

  it("既存の絶対URLへSITE_URLを二重連結しない", () => {
    expect(renderData("https://cdn.example.com/article.webp").image)
      .toBe("https://cdn.example.com/article.webp");
  });
});
