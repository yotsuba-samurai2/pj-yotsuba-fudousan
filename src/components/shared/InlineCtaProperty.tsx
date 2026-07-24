"use client";
// InlineCtaProperty — 長尺ピラーの中間ミニCTA（2026-07-24 CTA刷新v2）。
// 「契約前チェック」等の高意欲セクション直後に1か所だけ挿入する（本文末CtaBandの複製ではなく軽量帯）。
// ja固定コピー＝挿入先ピラーはja先行公開（他ロケールもja本文表示）のため既存方針に整合。
// クライアント安全：office-public のみ参照（SR名なし）。
import { LINE_URL } from "@/lib/shared/office-public";
import { gaEvent } from "@/lib/gtag";

type Props = {
  /** グループホーム系＝指定基準寄りの文言（居抜き/スケルトン等の店舗系の語を使わない） */
  gh?: boolean;
  /** GA計測用のページ識別子（例 "/inshokuten"） */
  page: string;
};

export function InlineCtaProperty({ gh = false, page }: Props) {
  const text = gh
    ? "エリア・賃料の目安など、わかる範囲の条件で大丈夫です。条件をお預けいただければ、指定基準を見据えて四葉不動産が全力で物件をお探しします。"
    : "駅・賃料・坪数・居抜きかスケルトンか・業種——わかる範囲の条件で大丈夫です。条件をお預けいただければ、四葉不動産が全力で物件をお探しします。";
  return (
    <aside
      aria-label="物件のご相談"
      className="flex flex-col items-start justify-between gap-3 rounded-xl border border-border bg-primary-tint p-4 sm:flex-row sm:items-center"
    >
      <p className="text-sm leading-relaxed text-text">{text}</p>
      <a
        href={LINE_URL}
        target="_blank"
        rel="noreferrer"
        onClick={() => gaEvent("cta_line_click", { location: "inline", page })}
        className="inline-flex min-h-[40px] flex-shrink-0 items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-focus"
      >
        LINEで希望条件を送る（無料）
      </a>
    </aside>
  );
}
