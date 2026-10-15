// Public-safe review copy only. Never add property-specific source material here.
export const MINPAKU_PURCHASE_INTENT = "minpaku-purchase";
export const MINPAKU_PURCHASE_CONTACT = `/contact?intent=${MINPAKU_PURCHASE_INTENT}`;
export const MINPAKU_REGIONS = ["北海道", "福岡", "沖縄", "未定"] as const;
export const MINPAKU_BUDGETS = ["未定", "3,000万円未満", "3,000万〜5,000万円未満", "5,000万〜1億円未満", "1億円以上"] as const;
export const MINPAKU_PURPOSES = ["まだ検討中", "宿泊運用", "自己利用との併用"] as const;
export type MinpakuPurchasePreferences = {
  regions: string[];
  budget: string;
  purpose: string;
};

export function minpakuPurchaseMessage(preferences: MinpakuPurchasePreferences, message: string): string {
  return [
    "民泊対応マンションの購入・投資相談",
    `希望地域：${preferences.regions.join("・") || "未定"}`,
    `予算：${preferences.budget}`,
    `利用目的：${preferences.purpose}`,
    "",
    message,
  ].join("\n");
}
