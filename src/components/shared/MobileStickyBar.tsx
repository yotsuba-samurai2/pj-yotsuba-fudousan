// MobileStickyBar — SP（モバイル）画面下の固定バー：LINE ／ お問い合わせ ／ 電話 ／ 地図
// md未満のみ表示（md:hidden）。高さ≥56px・各タッチ領域≥44px（DESIGN.md）。
// LINEのみ主色、他は中立。position:fixed。ページ下部の被り回避に本文側へ pb を足す運用（TenantLayoutShell）。
import Link from "next/link";
// ⚠️ office.ts（テナント名・文言入り）はimportしない＝クライアントJSへの社労士名同梱を防ぐ（office-public参照）
import { CONTACT_HREF, LINE_URL, MAP_URL, OFFICE, type BusinessKey } from "@/lib/shared/office-public";

type Props = { businessKey: BusinessKey };

export function MobileStickyBar({ businessKey }: Props) {
  const contactHref = CONTACT_HREF[businessKey];
  const item =
    "flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium min-h-[56px]";
  return (
    <nav
      aria-label="モバイル固定メニュー"
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-surface md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <a href={LINE_URL} target="_blank" rel="noreferrer" className={`${item} bg-primary text-white`}>
        <span aria-hidden>💬</span>
        LINE
      </a>
      <Link href={contactHref} className={`${item} text-text-muted`}>
        <span aria-hidden>✉️</span>
        お問い合わせ
      </Link>
      <a href={OFFICE.telHref} className={`${item} text-text-muted`}>
        <span aria-hidden>📞</span>
        電話
      </a>
      {/* 地図＝事業別リンク（realestate/legal=GBP直リンク、labor=住所クエリフォールバック）。P2仕様 */}
      <a href={MAP_URL[businessKey]} target="_blank" rel="noreferrer" className={`${item} text-text-muted`}>
        <span aria-hidden>📍</span>
        地図
      </a>
    </nav>
  );
}
