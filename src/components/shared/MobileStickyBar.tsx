// MobileStickyBar — SP（モバイル）画面下の固定バー：LINE ／ お問い合わせ ／ 電話 ／ 地図
// md未満のみ表示（md:hidden）。高さ≥56px・各タッチ領域≥44px（DESIGN.md）。
// LINEのみ主色、他は中立。position:fixed。ページ下部の被り回避に本文側へ pb を足す運用（TenantLayoutShell）。
// 2026-07-11 ロケール保持＋4ロケール化（診断_ロケール保持リンク_v1 §B-2）：
//   - "use client" 明示（従来もTenantLayout配下＝クライアントチャンク。境界を自己宣言に）。
//   - contactHref（内部リンク）のみ LocaleLink 化＝接頭辞はLocaleLink内部で1回だけ付与（hrefは接頭辞なしで渡す）。
//   - LINE・tel:・地図（MAP_URL=GBP直リンク等の外部URL）は変換しない。
//   - ラベルは部品内4ロケール直書き（useLanguageで分岐）。汎用語のみ＝SR名なし。en/zh-tw/zh=監修前ドラフト。
"use client";

import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { useLanguage } from "@/contexts/LanguageContext";
import type { LangCode } from "@/config/languages";
// ⚠️ office.ts（テナント名・文言入り）はimportしない＝クライアントJSへの社労士名同梱を防ぐ（office-public参照）
import { CONTACT_HREF, LINE_URL, MAP_URL, OFFICE, type BusinessKey } from "@/lib/shared/office-public";

// 4ロケールラベル（ja=現行文字列そのまま＝バイト不変。「LINE」は固有名＝全ロケール共通表記）
const LABELS: Record<LangCode, { aria: string; line: string; contact: string; tel: string; map: string }> = {
  ja: { aria: "モバイル固定メニュー", line: "LINE", contact: "お問い合わせ", tel: "電話", map: "地図" },
  en: { aria: "Mobile quick menu", line: "LINE", contact: "Contact", tel: "Call", map: "Map" },
  "zh-tw": { aria: "行動版固定選單", line: "LINE", contact: "聯絡我們", tel: "電話", map: "地圖" },
  zh: { aria: "移动版固定菜单", line: "LINE", contact: "联系我们", tel: "电话", map: "地图" },
};

type Props = { businessKey: BusinessKey };

export function MobileStickyBar({ businessKey }: Props) {
  const { locale } = useLanguage();
  const l = LABELS[locale] ?? LABELS.ja;
  const contactHref = CONTACT_HREF[businessKey];
  const item =
    "flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium min-h-[56px]";
  return (
    <nav
      aria-label={l.aria}
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-surface md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <a href={LINE_URL} target="_blank" rel="noreferrer" className={`${item} bg-primary text-white`}>
        <span aria-hidden>💬</span>
        {l.line}
      </a>
      <Link href={contactHref} className={`${item} text-text-muted`}>
        <span aria-hidden>✉️</span>
        {l.contact}
      </Link>
      <a href={OFFICE.telHref} className={`${item} text-text-muted`}>
        <span aria-hidden>📞</span>
        {l.tel}
      </a>
      {/* 地図＝事業別リンク（realestate/legal=GBP直リンク、labor=住所クエリフォールバック）。P2仕様 */}
      <a href={MAP_URL[businessKey]} target="_blank" rel="noreferrer" className={`${item} text-text-muted`}>
        <span aria-hidden>📍</span>
        {l.map}
      </a>
    </nav>
  );
}
