import type { LangCode } from "@/config/languages";
import { CATEGORY_ORDER_BY_BUSINESS, CATEGORY_ORDER_DEFAULT } from "./contact-intake";
import { COMPANY_CONTACT_INTENT, COMPANY_TEMPLATE } from "./company-intake";
import { PROPERTY_TEMPLATE, PROPERTY_TEMPLATE_GENERAL, PROPERTY_TEMPLATE_GH_JA } from "./property-intake";

const AKIYA_EXAMPLE: Record<LangCode, string> = {
  ja: "例：文京区小石川。家具や荷物が残っています。",
  en: "Example: Koishikawa, Bunkyo. Furniture and belongings are still in the house.",
  "zh-tw": "例如：文京區小石川，屋內還留有家具或物品。",
  zh: "例如：文京区小石川，房屋内仍有家具或物品。",
};

/** Resolve only categories shown by the destination form; preserve each property's template. */
export function contactIntentPreset(intent: string, business: string, locale: LangCode) {
  const keys = CATEGORY_ORDER_BY_BUSINESS[business] ?? CATEGORY_ORDER_DEFAULT;
  const propertyIntent = ["bukken", "bukken-general", "bukken-gh"].includes(intent);
  const category = propertyIntent ? "bukken" : intent;
  if (!keys.includes(category)) return null;
  let message = "";
  if (propertyIntent) {
    message = intent === "bukken-gh"
      ? PROPERTY_TEMPLATE_GH_JA
      : intent === "bukken-general" ? PROPERTY_TEMPLATE_GENERAL[locale] : PROPERTY_TEMPLATE[locale];
  } else if (business === "legal" && intent === COMPANY_CONTACT_INTENT) {
    message = COMPANY_TEMPLATE[locale];
  }
  return business === "realestate" && category === "akiya"
    ? { category, message, placeholder: AKIYA_EXAMPLE[locale] }
    : { category, message, placeholder: undefined };
}
