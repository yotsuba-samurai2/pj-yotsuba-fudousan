// /style-guide — A-3 共通部品の目視確認ページ（noindex・sitemap非掲載・リンクなし）
// 完成条件（phaseA README）：全部品を1ページで表示確認。本番導線からは参照しない。
import type { Metadata } from "next";
import { CtaBand } from "@/components/shared/CtaBand";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { Faq } from "@/components/shared/Faq";
import { CrossLinkBanner } from "@/components/shared/CrossLinkBanner";
import { Placeholder } from "@/components/shared/Placeholder";
import { RelatedBusinessFooter } from "@/components/shared/RelatedBusinessFooter";
import { getCrossLinks } from "@/lib/cross-links";

export const metadata: Metadata = {
  title: "スタイルガイド（内部確認用）",
  robots: { index: false, follow: false },
};

export default function StyleGuidePage() {
  // C3（/toushi向けクロスリンク）を試験表示（A-4完成条件：C1系を1本試験表示）
  const links = getCrossLinks("/toushi", false);
  return (
    <div className="mx-auto max-w-5xl px-4 pt-24 pb-16">
      <h1 className="font-serif text-3xl font-semibold text-ink">
        スタイルガイド（A-3 共通部品・内部確認用）
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        noindex。トークン＝DESIGN.md準拠（主色は route group が割当）。
      </p>

      <h2 className="mt-10 font-serif text-xl font-semibold text-ink">Breadcrumb</h2>
      <Breadcrumb
        items={[
          { name: "ホーム", href: "/" },
          { name: "投資用・事業用不動産", href: "/toushi" },
          { name: "現在ページ" },
        ]}
      />

      <h2 className="mt-10 font-serif text-xl font-semibold text-ink">ボタン類（1ビュー1主色）</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        <button className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark">
          Primary（塗り）
        </button>
        <button className="rounded-lg border border-primary px-6 py-3 text-sm font-medium text-primary">
          Secondary（アウトライン）
        </button>
        <button className="cta-gradient-outline px-6 py-3 text-sm font-semibold">
          <span className="cta-gradient-text">旧クラス互換（単色化済み）</span>
        </button>
      </div>

      <h2 className="mt-10 font-serif text-xl font-semibold text-ink">Faq（静的details・JSON-LDなし）</h2>
      <Faq
        items={[
          { q: "これは表示確認用の質問ですか？", a: "はい。表示確認用のダミーです。" },
          { q: "FAQPage JSON-LDは出ますか？", a: "このページでは出ません（withJsonLdは専用FAQページのみ）。" },
        ]}
      />

      <h2 className="mt-10 font-serif text-xl font-semibold text-ink">CrossLinkBanner（C3試験表示）</h2>
      {links.map((c) => (
        <CrossLinkBanner key={c.id} link={c} />
      ))}

      <h2 className="mt-10 font-serif text-xl font-semibold text-ink">Placeholder（本番では非表示）</h2>
      <p className="text-sm text-text-muted">
        ここに未確定情報が入る予定：
        <Placeholder reason="スタイルガイドの表示テスト" />
      </p>

      <h2 className="mt-10 font-serif text-xl font-semibold text-ink">RelatedBusinessFooter</h2>
      <RelatedBusinessFooter current="realestate" />

      <h2 className="mt-10 font-serif text-xl font-semibold text-ink">CtaBand</h2>
      <CtaBand businessKey="realestate" />
    </div>
  );
}
