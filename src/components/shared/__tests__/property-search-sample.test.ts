import { createElement, type ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { PropertySearchSampleSection } from "../PropertySearchSample";

vi.mock("next/image", () => ({
  default: ({ alt, src, ...props }: ComponentProps<"img">) =>
    createElement("img", { ...props, alt, src: String(src) }),
}));
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: ComponentProps<"a">) =>
    createElement("a", { ...props, href }, children),
}));
vi.mock("@/lib/gtag", () => ({ gaEvent: vi.fn() }));

describe("PropertySearchSampleSection", () => {
  it("opens the PDF in the current tab so browser back returns to the source page", () => {
    const html = renderToStaticMarkup(createElement(PropertySearchSampleSection));

    expect(html).toContain('href="/samples/property-search/property-search-sample.pdf"');
    expect(html).not.toContain('target="_blank"');
    expect(html).toContain("ブラウザの「戻る」でこのページへ戻れます");
  });
});
