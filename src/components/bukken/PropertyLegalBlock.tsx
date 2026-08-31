// PropertyLegalBlock — 物件詳細の「広告主に関する事項」＋情報鮮度の自動表示ブロック。
// 不動産の表示に関する公正競争規約 別表3・5・7（インターネット広告列・原本目視2026-09-01）の
// 広告主関連の必須表示（商号・事務所所在地・電話番号・免許証番号・所属団体名及び
// 公正取引協議会加盟事業者である旨）と、情報公開日（又は直前の更新日）及び次回の更新予定日を
// 物件ごとの入力なしで自動表示する。値の正本は BUSINESS_SEO / SHARED_ORG_INFO（seo.ts）。
import { BUSINESS_SEO, SHARED_ORG_INFO } from "@/lib/seo";
import type { PublicProperty } from "@/lib/property-shared";

/**
 * 所属団体名及び公正取引協議会加盟事業者である旨（別表の必須表示・項番5）。
 * 宅建協会・全宅保証＝会員検索詳細ページで裏取り済み（seo.ts REALESTATE_MEMBER_OF と同値）。
 * 首都圏不動産公正取引協議会の加盟＝所属団体（東京都宅建協会）経由の加盟事業者であることの
 * 表示。文言は浦松確認事項（2026-09-01診断②）＝初回公開前に確定させること。
 */
export const PROPERTY_MEMBERSHIP_LINES = [
  "公益社団法人 東京都宅地建物取引業協会 会員",
  "公益社団法人 全国宅地建物取引業保証協会 会員",
  "首都圏不動産公正取引協議会 加盟",
] as const;

export function PropertyLegalBlock({ property }: { property: PublicProperty }) {
  const biz = BUSINESS_SEO.realestate;
  const license = biz.identifiers?.find(
    (i) => i.propertyID === "宅地建物取引業免許番号",
  )?.value;

  return (
    <section
      aria-label="広告主に関する事項"
      className="mt-8 rounded-xl border border-border bg-surface p-4 text-xs leading-relaxed text-text-muted"
    >
      <dl className="grid gap-x-6 gap-y-1 sm:grid-cols-[auto_1fr]">
        <dt className="font-medium">商号</dt>
        <dd>{biz.legalName}</dd>
        <dt className="font-medium">事務所所在地</dt>
        <dd>
          〒{SHARED_ORG_INFO.postalCode} {SHARED_ORG_INFO.addressRegion}
          {SHARED_ORG_INFO.addressLocality}
          {SHARED_ORG_INFO.streetAddress}
        </dd>
        <dt className="font-medium">電話番号</dt>
        <dd>{SHARED_ORG_INFO.telephone}</dd>
        <dt className="font-medium">免許番号</dt>
        <dd>宅地建物取引業 {license}</dd>
        <dt className="font-medium">所属団体</dt>
        <dd>
          {PROPERTY_MEMBERSHIP_LINES.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </dd>
        <dt className="font-medium">情報公開日</dt>
        <dd>{property.publishedAt ?? property.infoUpdatedAt}</dd>
        <dt className="font-medium">情報更新日</dt>
        <dd>{property.infoUpdatedAt}</dd>
        <dt className="font-medium">次回更新予定日</dt>
        <dd>{property.nextUpdateAt}</dd>
      </dl>
    </section>
  );
}
