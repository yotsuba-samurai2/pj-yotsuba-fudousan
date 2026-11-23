import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { InheritanceCorrectionPreview } from "../InheritanceCorrectionPreview";

it("renders both values and localized field names, without interpreting article markup or leaking base duplication", () => {
  const html = renderToStaticMarkup(<InheritanceCorrectionPreview row={{
    state: "ready", slug: "taiwan-souzoku-kanri-katsuyo", business: "realestate", title: "台灣",
    date: "2026-07-07", locales: ["zh-tw"], reason: "一致",
    changes: [
      { lang: "zh-tw", field: "content", before: "舊 <script>", after: "現行確認稿" },
      { lang: "zh-tw", field: "faq", before: [{ question: "舊Q", answer: "舊A" }], after: [{ question: "新Q", answer: "新A" }] },
    ],
  }} />);
  expect(html).toContain("繁體中文：本文");
  expect(html).toContain("FAQ（構造化データを含む）");
  expect(html).toContain("変更前");
  expect(html).toContain("確認稿");
  expect(html).toContain("舊 &lt;script&gt;");
  expect(html).not.toContain("<script>");
  expect(html).toContain("新A");
  expect(html).not.toContain("日本語：");
});
