import type { LangCode } from "@/config/languages";

export const MAINLAND_INHERITANCE_COLUMN_PATH =
  "/legal/column/chugoku-tairiku-souzokunin-shinzoku-koshosho-ryoji-ninsho";
const CONTACT_PATH = "/legal/contact?intent=souzoku-legal";

const COPY = {
  ja: {
    heading: "日本側の相続書類についてのご相談",
    details: "お問い合わせフォームで「相続・遺言・信託」を選び、どの書類の準備でお困りかお知らせください。",
    label: "相続書類の問い合わせ",
  },
  en: {
    heading: "Questions about inheritance documents for use in Japan?",
    details: "Choose “Inheritance, wills and trusts” on the contact form and tell us which documents you need help preparing.",
    label: "Ask about inheritance documents",
  },
  zh: {
    heading: "咨询日本端的继承文件准备",
    details: "请在联系表单中选择“继承・遗嘱・信托”，并说明需要准备哪些文件。",
    label: "咨询继承文件",
  },
} as const;

/** Exact public article only. The Taiwan reader's edition keeps the normal contact options. */
export function getMainlandInheritanceContact(basePath: string, locale: LangCode) {
  if (basePath !== MAINLAND_INHERITANCE_COLUMN_PATH || locale === "zh-tw") return null;
  return { ...COPY[locale], href: CONTACT_PATH };
}
