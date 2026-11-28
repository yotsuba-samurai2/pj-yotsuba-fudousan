import { SR_LAUNCHED } from "./office";
import { SR_REGISTRATION_NUMBER, srCredentialLabel } from "./sr-registration";

const QUALIFICATION_NAME: Record<string, RegExp> = {
  ja: /社会保険労務士/u,
  en: /(?:Certified )?Social Insurance and Labou?r Consultant(?: \(Sharoushi\))?/iu,
  "zh-tw": /社會保險勞務士/u,
  zh: /社会保险劳务士/u,
};

const FALLBACK_TITLES: Record<string, string> = {
  ja: "資格",
  en: "Qualifications",
  "zh-tw": "資格",
  zh: "资格",
};

export function srProfileQualificationHighlight(locale: string) {
  return { label: FALLBACK_TITLES[locale] ?? FALLBACK_TITLES.ja, value: srCredentialLabel(locale) };
}

export function withSrProfileRegistration(value: string, locale: string): string {
  if (!SR_LAUNCHED) return value;
  const name = QUALIFICATION_NAME[locale] ?? QUALIFICATION_NAME.ja;
  const label = srCredentialLabel(locale);
  if (value.includes(SR_REGISTRATION_NUMBER)) return value;
  if (name.test(value)) return value.replace(name, label);
  return [value, label].filter(Boolean).join(locale === "en" ? " / " : "・");
}
