"use client";
import { useState, type ReactNode } from "react";

/**
 * 開くまで中身を描かない <details>。2026-09-24。
 *
 * 学区の募集比較一覧（/gakku/rentals）は161件すべての「条件・費用」欄を最初から描いており、
 * ページの要素が約1.6万個になっていた（Lighthouse モバイル：DOM 16,397・TBT 402ms）。
 * 閉じている欄の中身は一度開くまで描かず、以後は開閉しても保持する（再描画しない）。
 * summary（見出し）は最初から出すので、何があるかは見える。
 */
export function LazyDetails({ summary, className, summaryClassName, children }: {
  summary: ReactNode;
  className?: string;
  summaryClassName?: string;
  children: ReactNode;
}) {
  const [opened, setOpened] = useState(false);
  return (
    <details className={className} onToggle={(e) => { if ((e.currentTarget as HTMLDetailsElement).open) setOpened(true); }}>
      <summary className={summaryClassName}>{summary}</summary>
      {opened ? children : null}
    </details>
  );
}
