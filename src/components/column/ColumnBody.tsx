"use client";

import { usePathname } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { InlineContactCta } from "@/components/shared/ContactCta";
import { columnBusinessFromPath } from "@/lib/shared/contact-cta";
import { CONTACT_CTA_SLOT_ID, remarkContactCta } from "@/lib/markdown/remark-contact-cta";
import type { ColumnLinkOverrides } from "@/lib/column-language-links";

type Props = {
  content: string;
  linkOverrides?: ColumnLinkOverrides;
};

export default function ColumnBody({ content, linkOverrides = {} }: Props) {
  const businessKey = columnBusinessFromPath(usePathname());
  return (
    <div className="prose prose-sm sm:prose-base max-w-none prose-headings:text-text prose-p:text-text-muted prose-p:leading-[2] prose-a:text-primary prose-strong:text-text prose-blockquote:text-text-muted prose-li:text-text-muted">
      <ReactMarkdown remarkPlugins={businessKey ? [remarkGfm, remarkBreaks, remarkContactCta] : [remarkGfm, remarkBreaks]} components={{
        a: ({ href, children, title }) => {
          const replacement = href ? linkOverrides[href] : undefined;
          return <a href={replacement?.href ?? href} title={title}>{children}{replacement && ` (${replacement.language})`}</a>;
        },
        div: ({ node, children, ...props }) => {
          if (businessKey && node?.properties?.id === CONTACT_CTA_SLOT_ID) {
            return <InlineContactCta businessKey={businessKey} />;
          }
          return <div {...props}>{children}</div>;
        },
      }}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
