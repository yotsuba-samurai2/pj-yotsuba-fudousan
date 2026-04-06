"use client";

import { useState, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link as LinkIcon,
  Quote,
  Minus,
  Eye,
  Pencil,
} from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  label: string;
  rows?: number;
  required?: boolean;
  placeholder?: string;
};

type ToolbarAction = {
  icon: React.ComponentType<{ size?: number }>;
  title: string;
  action: (
    textarea: HTMLTextAreaElement,
    value: string,
  ) => { value: string; selectionStart: number; selectionEnd: number };
};

function wrapSelection(
  textarea: HTMLTextAreaElement,
  value: string,
  before: string,
  after: string,
  placeholder: string,
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = value.slice(start, end) || placeholder;
  const newValue = value.slice(0, start) + before + selected + after + value.slice(end);
  return {
    value: newValue,
    selectionStart: start + before.length,
    selectionEnd: start + before.length + selected.length,
  };
}

function prefixLine(
  textarea: HTMLTextAreaElement,
  value: string,
  prefix: string,
) {
  const start = textarea.selectionStart;
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const newValue = value.slice(0, lineStart) + prefix + value.slice(lineStart);
  const cursor = start + prefix.length;
  return { value: newValue, selectionStart: cursor, selectionEnd: cursor };
}

const toolbarActions: ToolbarAction[] = [
  {
    icon: Bold,
    title: "太字",
    action: (ta, v) => wrapSelection(ta, v, "**", "**", "太字"),
  },
  {
    icon: Italic,
    title: "斜体",
    action: (ta, v) => wrapSelection(ta, v, "*", "*", "斜体"),
  },
  {
    icon: Heading2,
    title: "見出し2",
    action: (ta, v) => prefixLine(ta, v, "## "),
  },
  {
    icon: Heading3,
    title: "見出し3",
    action: (ta, v) => prefixLine(ta, v, "### "),
  },
  {
    icon: List,
    title: "箇条書き",
    action: (ta, v) => prefixLine(ta, v, "- "),
  },
  {
    icon: ListOrdered,
    title: "番号付きリスト",
    action: (ta, v) => prefixLine(ta, v, "1. "),
  },
  {
    icon: Quote,
    title: "引用",
    action: (ta, v) => prefixLine(ta, v, "> "),
  },
  {
    icon: LinkIcon,
    title: "リンク",
    action: (ta, v) => wrapSelection(ta, v, "[", "](https://)", "テキスト"),
  },
  {
    icon: Minus,
    title: "区切り線",
    action: (ta, v) => {
      const start = ta.selectionStart;
      const before = start > 0 && v[start - 1] !== "\n" ? "\n" : "";
      const insert = before + "---\n";
      const newValue = v.slice(0, start) + insert + v.slice(start);
      const cursor = start + insert.length;
      return { value: newValue, selectionStart: cursor, selectionEnd: cursor };
    },
  },
];

export default function MarkdownEditor({
  value,
  onChange,
  label,
  rows = 16,
  required,
  placeholder,
}: Props) {
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleToolbar = useCallback(
    (action: ToolbarAction["action"]) => {
      const ta = textareaRef.current;
      if (!ta) return;
      const result = action(ta, value);
      onChange(result.value);
      requestAnimationFrame(() => {
        ta.focus();
        ta.setSelectionRange(result.selectionStart, result.selectionEnd);
      });
    },
    [value, onChange],
  );

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-text">{label}</label>
      <div className="overflow-hidden rounded-lg border border-border bg-white">
        {/* Toolbar + tabs */}
        <div className="flex items-center gap-1 border-b border-border bg-surface-dim px-2 py-1.5">
          {/* Edit / Preview toggle */}
          <button
            type="button"
            onClick={() => setTab("edit")}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              tab === "edit"
                ? "bg-white text-text shadow-sm"
                : "text-text-muted hover:text-text"
            }`}
          >
            <Pencil size={12} />
            編集
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              tab === "preview"
                ? "bg-white text-text shadow-sm"
                : "text-text-muted hover:text-text"
            }`}
          >
            <Eye size={12} />
            プレビュー
          </button>

          {/* Divider */}
          {tab === "edit" && (
            <>
              <div className="mx-1 h-4 w-px bg-border" />
              {toolbarActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.title}
                    type="button"
                    title={action.title}
                    onClick={() => handleToolbar(action.action)}
                    className="rounded p-1.5 text-text-muted transition-colors hover:bg-white hover:text-text"
                  >
                    <Icon size={14} />
                  </button>
                );
              })}
            </>
          )}
        </div>

        {/* Content area */}
        {tab === "edit" ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            required={required}
            placeholder={placeholder}
            className="w-full resize-y bg-white px-4 py-3 font-mono text-sm text-text outline-none placeholder:text-text-muted/50"
          />
        ) : (
          <div
            className="prose prose-sm max-w-none px-4 py-3 text-text"
            style={{ minHeight: `${rows * 1.5}rem` }}
          >
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                {value}
              </ReactMarkdown>
            ) : (
              <p className="text-text-muted">プレビューするコンテンツがありません</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
