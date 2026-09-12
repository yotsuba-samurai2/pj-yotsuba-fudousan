import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { describe, expect, it } from "vitest";
import { CONTACT_CTA_SLOT_ID, remarkContactCta } from "../remark-contact-cta";

// 実依存でMarkdown→HTMLまで検証する。Next/DB/ネットワークは使わない。
const paragraph = "This is an original explanation with important details. ".repeat(12);
function render(source: string, withCta: boolean): string {
  return renderToStaticMarkup(createElement(Markdown, {
    remarkPlugins: withCta ? [remarkGfm, remarkBreaks, remarkContactCta] : [remarkGfm, remarkBreaks],
  }, source));
}
const samples = [
  ["headings", `## First question\n\n${paragraph}\n\n${paragraph}\n\n## Next question\n\n${paragraph}\n\n${paragraph}`],
  ["table", `${paragraph}\n\n${paragraph}\n\n| A | B |\n| --- | --- |\n| One | Two |\n\n${paragraph}\n\n${paragraph}`],
  ["list and quotation", `${paragraph}\n\n- first\n  - nested\n- second\n\n> A quoted explanation.\n\n${paragraph}\n\n${paragraph}`],
  ["reference links and footnotes", `${paragraph}\n\n[Official material][source] and a note[^1].\n\n${paragraph}\n\n${paragraph}\n\n[source]: https://example.test/source\n\n[^1]: Keep this exact footnote.`],
  ["code fence", `${paragraph}\n\n\`\`\`ts\nconst marker = "do not split me";\n\`\`\`\n\n${paragraph}\n\n${paragraph}`],
] as const;

describe("remarkContactCta actual ReactMarkdown rendering", () => {
  for (const [name, source] of samples) {
    it(`adds one slot without altering ${name}`, () => {
      const before = render(source, false);
      const after = render(source, true);
      const slot = `<div id="${CONTACT_CTA_SLOT_ID}"></div>`;
      expect(after.split(slot)).toHaveLength(2);
      const withoutSlot = after.replace(`${slot}\n`, "").replace(slot, "");
      expect(withoutSlot).toBe(before);
    });
  }
  it("does not insert into short content", () => {
    expect(render("## Short\n\nA short answer.", true)).toBe(render("## Short\n\nA short answer.", false));
  });
  it("does not split a single long paragraph", () => {
    expect(render(paragraph.repeat(3), true)).toBe(render(paragraph.repeat(3), false));
  });
  it("retains the default raw HTML safety boundary", () => {
    const source = `${paragraph}\n\n<script>alert('no')</script>\n\n${paragraph}\n\n${paragraph}`;
    expect(render(source, true)).not.toContain("<script>");
  });
});
