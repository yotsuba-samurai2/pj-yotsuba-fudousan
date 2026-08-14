// LineLink — 計測付きのLINEリンク（2026-08-14 新設）
//
// 背景：2026-08-14に TelLink を新設して tel: の未計測7か所中5か所を是正したのと
// 同じ穴が、LINE 側にも残っていた。LINE_URL を置いている箇所のうち
// cta_line_click が付いていなかったのが次の3か所。
//
//   - group-home ページ本文末CTA（素の line.me 直書き・LINE_URL定数も未使用）
//   - souzoku ページ本文末CTA（同上）
//   - LINKA ResultView の concierge 型カード
//
// 前2つは勝ち筋レーンそのもの（物件×許認可／相続）の主要入口であり、
// 受任の入口が電話とLINEである以上、ここが無計測だと経路が見えない。
//
// お問い合わせページや各ピラーはサーバーコンポーネントのため onClick を直接書けない。
// そこで TelLink と同じくクライアント部品として切り出す。
// 以後、新しく LINE リンクを置くときは素の <a> ではなく必ずこの部品を使うこと。
"use client";

import type { ReactNode } from "react";
import { LINE_URL } from "@/lib/shared/office-public";
import { gaEvent } from "@/lib/gtag";

type Props = {
  /** GA4で押された場所を区別するための識別子（page_cta / cta_band など） */
  location: string;
  /** どのページから押されたか（勝ち筋レーンの割り当てに使う。例 "souzoku"） */
  page?: string;
  className?: string;
  children: ReactNode;
};

export function LineLink({ location, page, className, children }: Props) {
  return (
    <a
      href={LINE_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        gaEvent("cta_line_click", page ? { location, page } : { location })
      }
      className={className}
    >
      {children}
    </a>
  );
}
