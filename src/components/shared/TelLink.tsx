// TelLink — 計測付きの電話リンク（2026-08-14 新設）
//
// 背景：GA4の cta_tel_click が28日間で0件だった（2026-08-13実測）。原因は
// サイト内の tel: リンク7か所のうち、イベントが付いていたのが CtaBandActions と
// MobileStickyBar の2か所だけだったこと。全ページに出るフッターと、各事業の
// お問い合わせページの電話番号が未計測のまま運用されていた。
//
// お問い合わせページはサーバーコンポーネントのため onClick を直接書けない。
// そこでクライアント部品として切り出し、どこからでも計測付きで置けるようにする。
// 以後、新しく tel: を置くときは素の <a> ではなく必ずこの部品を使うこと。
"use client";

import type { ReactNode } from "react";
import { gaEvent } from "@/lib/gtag";

type Props = {
  /** 表示・発信に使う電話番号。ハイフンの有無は呼び出し側の表記に合わせる */
  phone: string;
  /** GA4で押された場所を区別するための識別子（footer / contact_page など） */
  location: string;
  className?: string;
  children: ReactNode;
};

export function TelLink({ phone, location, className, children }: Props) {
  return (
    <a
      href={`tel:${phone}`}
      onClick={() => gaEvent("cta_tel_click", { location })}
      className={className}
    >
      {children}
    </a>
  );
}
