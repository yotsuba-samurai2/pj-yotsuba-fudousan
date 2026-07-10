// CtaBand — 本文末CTA帯（全ページ末に1つ）
// 見出し・リード文・営業時間は「テナント別」（各原稿サイト共通より）。主CTA＝代表LINE（テナント主色の塗り）。
// お問い合わせ・電話は補助（アウトライン中立）。DESIGN.md「1ビュー1主色」を守る。
// 色は route group が割り当てる --color-primary を bg-primary / text-primary で読む（テナント非依存）。
import Link from "next/link";
import { LINE_URL, OFFICE, TENANT, type BusinessKey } from "@/lib/shared/office";

type Props = {
  businessKey: BusinessKey;
  /** 見出しの上書き（省略時はテナント既定＝原稿サイト共通のCTA帯見出し） */
  heading?: string;
  /** リード文の上書き（省略時はテナント既定） */
  subtext?: string;
};

export function CtaBand({ businessKey, heading, subtext }: Props) {
  const t = TENANT[businessKey];
  const lead = subtext ?? t.ctaLead;
  return (
    <section aria-label="お問い合わせ" className="my-6 rounded-2xl bg-primary-tint px-6 py-8 text-center">
      <h2 className="font-serif text-xl font-semibold text-ink">{heading ?? t.ctaHeading}</h2>
      {lead && <p className="mx-auto mt-2 max-w-xl text-sm text-text-muted">{lead}</p>}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {/* 主CTA＝LINE（塗り・主色） */}
        <a
          href={LINE_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-[44px] items-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-focus"
        >
          LINEで一言相談（無料）
        </a>
        {/* 補助＝お問い合わせ（アウトライン中立） */}
        <Link
          href={t.contactHref}
          className="inline-flex min-h-[44px] items-center rounded-lg border border-border px-5 py-3 text-sm font-medium text-text-muted transition-colors hover:border-primary hover:text-primary"
        >
          お問い合わせ
        </Link>
        {/* 補助＝電話 */}
        <a
          href={OFFICE.telHref}
          className="inline-flex min-h-[44px] items-center rounded-lg border border-border px-5 py-3 text-sm font-medium text-text-muted transition-colors hover:border-primary hover:text-primary"
        >
          電話 {OFFICE.tel}
        </a>
      </div>
      <p className="mt-3 text-xs text-text-muted">
        {OFFICE.access}
        {t.hours ? `｜${t.hours}` : ""}
      </p>
    </section>
  );
}
