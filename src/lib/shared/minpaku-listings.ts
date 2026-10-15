/** Customer-facing, permission-scoped summary only. No original prices, unit IDs or source PDFs. */
export type MinpakuListing = {
  id: string;
  region: string;
  price: string | null;
  taxNote: string | null;
  area: string;
  scope: string;
  usage: string;
  priceBasis: string;
  validUntil: string | null;
  validThrough: string | null;
};

export const MINPAKU_MATERIAL_CHECKED = "2026年10月16日";

export const MINPAKU_LISTINGS: readonly MinpakuListing[] = [
  {
    id: "chitose", region: "北海道・千歳",
    price: "約5,000万〜7,000万円", taxNote: "税込・概算",
    area: "約40〜55㎡",
    scope: "2〜9階の対象住戸（民泊対応予定）",
    usage: "自己利用・宿泊運用の併用条件を物件ごとにご案内します。",
    priceBasis: "2026年10月受領価格表のうち、対象階で価格の掲載がある住戸",
    validUntil: "2026年10月31日", validThrough: "2026-10-31",
  },
  {
    id: "sapporo", region: "北海道・札幌",
    price: null, taxNote: null,
    area: "ご希望に合わせて個別にご案内",
    scope: "対象住戸・利用条件を個別にご案内します。",
    usage: "購入目的に合う住戸の条件からご相談いただけます。",
    priceBasis: "最新の価格・販売状況はお問い合わせください。",
    validUntil: null, validThrough: null,
  },
  {
    id: "fukuoka", region: "福岡",
    price: null, taxNote: null,
    area: "約45〜85㎡（資料掲載の対象住戸）",
    scope: "2〜7階の対象住戸（民泊対応予定）",
    usage: "運営委託・自己利用の条件は、ご相談内容に合わせてご案内します。",
    priceBasis: "最新の価格・販売条件はお問い合わせください。",
    validUntil: null, validThrough: null,
  },
  {
    id: "okinawa", region: "沖縄",
    price: "約9,000万〜1億6,000万円", taxNote: "税込・概算",
    area: "約60〜75㎡",
    scope: "5〜9階の対象住戸（民泊対応予定）",
    usage: "ご自身・ご家族での利用と宿泊運用の両立条件を確認します。",
    priceBasis: "2026年10月10日付価格表のうち、対象階で価格の掲載がある住戸",
    validUntil: "2026年10月31日", validThrough: "2026-10-31",
  },
];

/** The price expires at the end of the source's valid-through date in Japan. */
export function hasCurrentListingPrice(listing: MinpakuListing, now = new Date()): boolean {
  return Boolean(listing.price && listing.validThrough && now.getTime() <= Date.parse(`${listing.validThrough}T23:59:59.999+09:00`));
}
