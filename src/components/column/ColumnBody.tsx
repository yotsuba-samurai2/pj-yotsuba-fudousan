"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

type Props = {
  content: string;
};

export default function ColumnBody({ content }: Props) {
  return (
    <div className="prose prose-sm sm:prose-base max-w-none prose-headings:text-text prose-p:text-text-muted prose-p:leading-[2] prose-a:text-primary prose-strong:text-text prose-blockquote:text-text-muted prose-li:text-text-muted">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
