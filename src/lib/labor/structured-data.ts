import type { LangCode } from "@/config/languages";
import { addLocalePrefix } from "@/lib/locale";
import { LABOR_PRICING, getLaborMonthlyFee } from "./pricing";
import { LABOR_PLAN_COPY } from "./plan-copy";
import { LABOR_ANCILLARY_FEES } from "./ancillary-fees";

export function getLaborPriceStructuredData(locale: LangCode) {
  const c = LABOR_PLAN_COPY[locale];
  const fixedOffer = (name: string, price: number) => ({
    "@type": "Offer", name,
    priceSpecification: { "@type": "PriceSpecification", price, priceCurrency: LABOR_PRICING.currency, valueAddedTaxIncluded: LABOR_PRICING.taxIncluded },
  });
  const recurring = Array.from({ length: 30 }, (_, i) => {
    const people = i + 1;
    return fixedOffer(`${c.name} / ${c.people}: ${people} / ${c.monthly}`, getLaborMonthlyFee(people));
  });
  // Representative exact monthly fees, not a headcount limit.
  // Conditional setup tiers and optional services are described on-page, not as unconditional fixed offers.
  const ancillary = LABOR_ANCILLARY_FEES[locale].sections.flatMap(section => section.rows.flatMap(row =>
    "value" in row && typeof row.value === "number" ? [fixedOffer(`${section.title} / ${row.name}`, row.value)] : [],
  ));
  return {
    "@context": "https://schema.org", "@type": "Service",
    "@id": `https://luck428.com${addLocalePrefix("/labor/ryokin", locale)}#service`,
    name: c.name,
    provider: { "@id": "https://luck428.com/labor/#organization" },
    offers: [...recurring, ...ancillary],
  };
}
