import type { LangCode } from "@/config/languages";
import type { PublicProperty } from "@/lib/property-shared";

/**
 * 借主の仲介手数料（2026-09-26 浦松指示「ATBB→athome 掲載の手数料判定ルール v1.1」第5節）。
 * athomeで半額・無料にした部屋は自社サイトでも同じ条件を同じ日に公表する。
 * 値引きの理由（AD等の業者間事情）は表示しない。別名目の手数料は取らない前提。
 */
export type BrokerFee = "full" | "half" | "free";
export const BROKER_FEES: readonly BrokerFee[] = ["full", "half", "free"];

const LABELS: Record<LangCode, { badge: Record<"half" | "free", string>; line: Record<BrokerFee, string>; filter: string; filterLead: string; all: string }> = {
  ja: {
    badge: { half: "仲介手数料 半額", free: "仲介手数料 無料" },
    line: { full: "仲介手数料：賃料1か月分＋消費税", half: "仲介手数料：半額（賃料0.5か月分＋消費税）", free: "仲介手数料：無料" },
    filter: "仲介手数料 無料・半額の物件",
    filterLead: "仲介手数料が無料または半額の賃貸物件です。保証会社・保険・鍵交換などの費用は各物件の記載のとおり別途かかります。",
    all: "すべての物件を見る",
  },
  en: {
    badge: { half: "Half brokerage fee", free: "No brokerage fee" },
    line: { full: "Brokerage fee: one month's rent + consumption tax", half: "Brokerage fee: half (0.5 month's rent + consumption tax)", free: "Brokerage fee: free" },
    filter: "Rentals with no or half brokerage fee",
    filterLead: "Rentals with no brokerage fee or a half fee. Guarantor, insurance, key-change and other costs apply separately as listed for each property.",
    all: "View all listings",
  },
  "zh-tw": {
    badge: { half: "仲介費 半價", free: "仲介費 免費" },
    line: { full: "仲介費：1個月租金＋消費稅", half: "仲介費：半價（0.5個月租金＋消費稅）", free: "仲介費：免費" },
    filter: "仲介費免費・半價的物件",
    filterLead: "仲介費免費或半價的出租物件。保證公司、保險、換鎖等費用依各物件記載另行支付。",
    all: "查看全部物件",
  },
  zh: {
    badge: { half: "中介费 半价", free: "中介费 免费" },
    line: { full: "中介费：1个月租金＋消费税", half: "中介费：半价（0.5个月租金＋消费税）", free: "中介费：免费" },
    filter: "中介费免费・半价的房源",
    filterLead: "中介费免费或半价的出租房源。担保公司、保险、换锁等费用依各房源记载另行支付。",
    all: "查看全部房源",
  },
};

export function brokerFeeCopy(locale: LangCode) {
  return LABELS[locale] ?? LABELS.ja;
}

export function brokerFeeOf(p: Pick<PublicProperty, "dealType" | "spec">): BrokerFee | null {
  if (p.dealType !== "rental" || p.spec.dealType !== "rental") return null;
  return p.spec.brokerFee ?? null;
}

/** 半額・無料だけバッジを出す。満額は値引き表示をしない。 */
export function brokerFeeBadge(p: Pick<PublicProperty, "dealType" | "spec">, locale: LangCode): string | null {
  const fee = brokerFeeOf(p);
  return fee === "half" || fee === "free" ? brokerFeeCopy(locale).badge[fee] : null;
}

/** 物件ページの賃料の近くに出す手数料の文言（設定がある賃貸だけ）。 */
export function brokerFeeLine(p: Pick<PublicProperty, "dealType" | "spec">, locale: LangCode): string | null {
  const fee = brokerFeeOf(p);
  return fee ? brokerFeeCopy(locale).line[fee] : null;
}

export function isDiscountedBrokerFee(p: Pick<PublicProperty, "dealType" | "spec">): boolean {
  const fee = brokerFeeOf(p);
  return fee === "half" || fee === "free";
}
