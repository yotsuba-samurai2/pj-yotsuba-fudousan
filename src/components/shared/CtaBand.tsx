// CtaBand — 本文末CTA帯（全ページ末に1つ）
// 見出し・リード文・営業時間は「テナント別」（各原稿サイト共通より）。主CTA＝代表LINE（テナント主色の塗り）。
// お問い合わせ・電話は補助（アウトライン中立）。DESIGN.md「1ビュー1主色」を守る。
// 色は route group が割り当てる --color-primary を bg-primary / text-primary で読む（テナント非依存）。
// 2026-07-11 ロケール保持＋4ロケール化（診断_ロケール保持リンク_v1 §B-1）：
//   - server維持（client化禁止＝office.tsのSR名をクライアントJSに載せない）。async化して部品内部でlocale取得。
//   - 内部リンク（contactHref）のみ addLocalePrefix。LINE・tel: は外部＝変換しない。
//   - 呼び出し側は変更不要（hrefは接頭辞なしで受け、付与はここで1回だけ＝二重適用禁止）。
//   - 文言：共通ラベルは下のLABELS、テナント別はoffice.tsのTENANT_CTA_I18N（server専用のまま）。
//     ja正文はTENANT値の参照＝バイト不変。en/zh-tw/zh=監修前ドラフト。
import Link from "next/link";
import { LINE_URL, OFFICE, TENANT, TENANT_CTA_I18N, type BusinessKey } from "@/lib/shared/office";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import type { LangCode } from "@/config/languages";

// 部品内共通ラベル（SR名なし・汎用語のみ）。ja=現行文字列そのまま（バイト不変）。
// en=HomePageContent既存訳（Chat on LINE (free)/Contact/Call）準拠。zh系=監修前ドラフト。
const LABELS: Record<LangCode, { aria: string; line: string; contact: string; tel: string }> = {
  ja: { aria: "お問い合わせ", line: "LINEで一言相談（無料）", contact: "お問い合わせ", tel: "電話" },
  en: { aria: "Contact", line: "Chat on LINE (free)", contact: "Contact", tel: "Call" },
  "zh-tw": { aria: "聯絡我們", line: "LINE免費諮詢", contact: "聯絡我們", tel: "電話" },
  zh: { aria: "联系我们", line: "LINE免费咨询", contact: "联系我们", tel: "电话" },
};

// アクセス表記の4ロケール（ja=OFFICE.access参照＝バイト不変。en/zh系=HomePageContent accessLine準拠）
const ACCESS_I18N: Record<LangCode, string> = {
  ja: OFFICE.access,
  en: "5 min walk from Myogadani Sta. (Tokyo Metro Marunouchi Line)",
  "zh-tw": "東京Metro丸之內線「茗荷谷」站 步行5分",
  zh: "东京Metro丸之内线“茗荷谷”站 步行5分",
};

type Props = {
  businessKey: BusinessKey;
  /** 見出しの上書き（省略時はテナント既定＝原稿サイト共通のCTA帯見出し） */
  heading?: string;
  /** リード文の上書き（省略時はテナント既定） */
  subtext?: string;
};

export async function CtaBand({ businessKey, heading, subtext }: Props) {
  const locale = await getRequestLocale();
  const t = TENANT[businessKey];
  const c = TENANT_CTA_I18N[businessKey][locale] ?? TENANT_CTA_I18N[businessKey].ja;
  const l = LABELS[locale] ?? LABELS.ja;
  const lead = subtext ?? c.ctaLead;
  return (
    <section aria-label={l.aria} className="my-6 rounded-2xl bg-primary-tint px-6 py-8 text-center">
      <h2 className="font-serif text-xl font-semibold text-ink">{heading ?? c.ctaHeading}</h2>
      {lead && <p className="mx-auto mt-2 max-w-xl text-sm text-text-muted">{lead}</p>}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {/* 主CTA＝LINE（塗り・主色）＝外部URL・ロケール変換しない */}
        <a
          href={LINE_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-[44px] items-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-focus"
        >
          {l.line}
        </a>
        {/* 補助＝お問い合わせ（アウトライン中立）＝内部リンク・ここで1回だけ接頭辞付与 */}
        <Link
          href={addLocalePrefix(t.contactHref, locale)}
          className="inline-flex min-h-[44px] items-center rounded-lg border border-border px-5 py-3 text-sm font-medium text-text-muted transition-colors hover:border-primary hover:text-primary"
        >
          {l.contact}
        </Link>
        {/* 補助＝電話＝tel:・変換しない */}
        <a
          href={OFFICE.telHref}
          className="inline-flex min-h-[44px] items-center rounded-lg border border-border px-5 py-3 text-sm font-medium text-text-muted transition-colors hover:border-primary hover:text-primary"
        >
          {`${l.tel} ${OFFICE.tel}`}
        </a>
      </div>
      <p className="mt-3 text-xs text-text-muted">
        {ACCESS_I18N[locale] ?? ACCESS_I18N.ja}
        {c.hours ? `｜${c.hours}` : ""}
      </p>
    </section>
  );
}
