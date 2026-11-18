import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ColumnTopicGuides } from "@/components/column/ColumnTopicGuides";
import { COLUMN_TOPICS, columnTopicLinks, resolveColumnTopics } from "@/lib/column-topic-routes";
import type { LangCode } from "@/config/languages";

describe("existing columns route back to relevant service hubs", () => {
  it("does not assign a service to unrelated living articles", () => {
    expect(resolveColumnTopics({ slug: "garbage-rules", category: "暮らし", tags: ["分別"] })).toEqual([]);
  });
  it("uses canonical inheritance category before incidental business keywords", () => {
    expect(resolveColumnTopics({ slug: "inherited-school-property", category: "相続", title: "学区の家を相続して事業用に" })).toEqual(["inheritance"]);
  });
  it("only routes specifically school-related metadata to school guides", () => {
    expect(resolveColumnTopics({ slug: "family-home", category: "暮らし", tags: ["学区"] })).toEqual(["school"]);
    expect(resolveColumnTopics({ slug: "family-home", category: "暮らし", tags: ["家族"] })).toEqual([]);
  });
  it("routes business and multilingual housing to their existing hubs", () => {
    expect(resolveColumnTopics({ slug: "office-opening", category: "投資・事業用不動産" })).toEqual(["business"]);
    expect(resolveColumnTopics({ slug: "housing", category: "外国人の住まい" })).toEqual(["multilingual"]);
  });
  it.each<LangCode>(["ja", "en", "zh-tw", "zh"])("renders localized HTML links in %s", locale => {
    const html = renderToStaticMarkup(<ColumnTopicGuides locale={locale} />);
    const prefix = locale === "ja" ? "" : `/${locale}`;
    for (const link of columnTopicLinks(COLUMN_TOPICS, locale)) {
      expect(html).toContain(`href="${prefix}${link.href}"`);
      expect(link.label.length).toBeGreaterThan(0);
    }
    expect(html).not.toContain("/contact");
  });
  it("does not render an unrelated article's guide block", () => {
    expect(renderToStaticMarkup(<ColumnTopicGuides locale="ja" topics={[]} related />)).toBe("");
  });
  it("keeps one existing list CTA while preserving article URLs and pagination", () => {
    const content = readFileSync("src/app/[locale]/(realestate)/column/ColumnListPageContent.tsx", "utf8");
    const server = readFileSync("src/app/[locale]/(realestate)/column/ColumnListPage.tsx", "utf8");
    expect(content).not.toContain('href="/contact"');
    expect(content).toContain("/column/${col.slug}");
    expect(content).toContain('<ColumnPagination path="/column"');
    expect(server.match(/<CtaBand\b/g)).toHaveLength(1);
  });
});
