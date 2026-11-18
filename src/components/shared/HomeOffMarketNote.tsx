import type { LangCode } from "@/config/languages";

const COPY = {
  ja: "サイト未掲載の物件も個別にお探しします。",
  en: "We can also look for properties not listed on our website, based on your needs.",
  "zh-tw": "我們也會依您的需求，個別尋找網站上尚未刊登的物件。",
  zh: "我们也会根据您的需求，单独寻找网站上尚未刊登的房源。",
} satisfies Record<LangCode, string>;

/** Safe public-copy boundary only: no inventory, approval switch or data access.
 * A future integration must verify the original v4 evidence/expiry gate before
 * introducing any quantity claim. This component cannot enable such a claim. */
export function HomeOffMarketNote({ locale }: { locale: LangCode }) {
  return <p lang={locale === "zh-tw" ? "zh-Hant" : locale === "zh" ? "zh-Hans" : locale}
    className="my-4 rounded-xl border-l-4 border-primary bg-surface-dim px-4 py-3 text-sm leading-relaxed text-ink sm:text-base">
    <strong className="font-semibold">{COPY[locale]}</strong>
  </p>;
}
