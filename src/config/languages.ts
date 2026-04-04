export const languages = [
  { code: "ja", label: "日本語", native: "日本語" },
  { code: "en", label: "EN", native: "English" },
  { code: "zh-tw", label: "繁體", native: "繁體中文" },
  { code: "zh", label: "简体", native: "简体中文" },
] as const;

export type LangCode = (typeof languages)[number]["code"];
