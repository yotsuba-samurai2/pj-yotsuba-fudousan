import type { LangCode } from "@/config/languages";

const COPY = {
  ja: "非公開物件も多数ご案内",
  en: "We can also introduce you to many properties that are not publicly listed.",
  "zh-tw": "也可為您介紹許多未公開刊登的物件。",
  zh: "也可为您介绍许多未公开发布的房源。",
} satisfies Record<LangCode, string>;

/** Owner-confirmed qualitative service copy. No inventory count, source details,
 * exclusivity or availability guarantee is exposed to the public. */
export function HomeOffMarketNote({ locale }: { locale: LangCode }) {
  return <p lang={locale === "zh-tw" ? "zh-Hant" : locale === "zh" ? "zh-Hans" : locale}
    className="my-4 rounded-xl border-l-4 border-primary bg-surface-dim px-4 py-3 text-sm leading-relaxed text-ink sm:text-base">
    <strong className="font-semibold">{COPY[locale]}</strong>
  </p>;
}
