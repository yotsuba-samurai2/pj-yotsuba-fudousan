import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { getRewrittenUrl, isRewrite } from "next/experimental/testing/server";
import { proxy } from "@/proxy";

const article = "/labor/column/shogaisha-koyoritsu-2.7-kakunin-jiko";
const request = (path: string, host = "luck428.com") =>
  new NextRequest(`https://${host}${path}`, { headers: { host } });

describe("public locale routing", () => {
  it("rewrites a Japanese article containing a decimal without changing its public URL", () => {
    const response = proxy(request(`${article}?source=test`));
    expect(isRewrite(response)).toBe(true);
    expect(getRewrittenUrl(response)).toBe(`https://luck428.com/ja${article}?source=test`);
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it.each(["en", "zh-tw", "zh"])("keeps the dotted article in %s", locale => {
    expect(getRewrittenUrl(proxy(request(`/${locale}${article}`))))
      .toBe(`https://luck428.com/${locale}${article}`);
  });

  it("canonicalizes direct /ja access even when a slug contains a dot", () => {
    const response = proxy(request(`/ja${article}`));
    expect(response.status).toBe(301);
    expect(response.headers.get("location")).toBe(`https://luck428.com${article}`);
  });

  it.each([
    "/robots.txt", "/sitemap.xml", "/icon-192.png", "/hero/photo.webp",
    "/images/photo.jpg", "/images/photo.jpeg", "/logo.svg", "/document.pdf",
    "/google-site-verification.html", "/downloads/list.csv", "/archive.zip", "/manual.docx",
    "/.well-known/example.bin", "/assets.v2/resource",
    "/_next/static/media/font.woff2?dpl=example", "/_next/image?url=example",
    "/api/admin/revalidate", "/admin/columns", "/facilitator",
  ])("preserves resources and non-public routes: %s", path => {
    expect(proxy(request(path)).headers.get("x-middleware-next")).toBe("1");
  });

  it("keeps nonexistent articles in the normal page router for a real 404", () => {
    expect(getRewrittenUrl(proxy(request("/column/missing-2.7"))))
      .toBe("https://luck428.com/ja/column/missing-2.7");
  });

  it.each(["/column/article.json", "/legal/column/article.html", "/labor/column/article.csv"])("treats a file-like article slug as a page: %s", path => {
    expect(getRewrittenUrl(proxy(request(path)))).toBe(`https://luck428.com/ja${path}`);
  });

  it.each(["/test1", "/en/comments/feed", "/en/comments/feed/"])("preserves 410 for %s", path => {
    expect(proxy(request(path)).status).toBe(410);
  });

  it("preserves tenant routing", () => {
    expect(getRewrittenUrl(proxy(request("/column/article-2.7", "luck428gyosei.com"))))
      .toBe("https://luck428gyosei.com/ja/legal/column/article-2.7");
  });
});
