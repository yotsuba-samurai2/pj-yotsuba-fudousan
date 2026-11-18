import type { LangCode } from "@/config/languages";

export type ColumnTopic = "school" | "business" | "inheritance" | "multilingual";
export const COLUMN_TOPICS: readonly ColumnTopic[] = ["school", "business", "inheritance", "multilingual"];
const PATHS: Record<ColumnTopic, readonly string[]> = {
  school: ["/gakku/rentals", "/gakku"],
  business: ["/toushi"],
  inheritance: ["/souzoku"],
  multilingual: ["/global"],
};
const COPY: Record<LangCode, { heading: string; related: string; intro: string; topics: Record<ColumnTopic, readonly string[]> }> = {
  ja: { heading: "目的に合うガイドから", related: "この記事から、次の一歩へ", intro: "コラムを読む前でも、読んだあとでも。住まい・事業・相続の詳しい案内へ進めます。", topics: { school: ["学区別の賃貸を見る", "文京区の通学区域を調べる"], business: ["投資・事業用の物件探し"], inheritance: ["相続した不動産の管理・活用・売却"], multilingual: ["外国人・多言語の住まい相談"] } },
  en: { heading: "Start with a guide for your needs", related: "Your next step after this article", intro: "Explore practical guides to housing, business premises and inherited property, before or after reading.", topics: { school: ["Rentals by school district", "Check Bunkyo school attendance areas"], business: ["Investment and business premises"], inheritance: ["Managing, using or selling inherited property"], multilingual: ["Multilingual housing support"] } },
  "zh-tw": { heading: "依需求閱讀指南", related: "閱讀後的下一步", intro: "無論是在閱讀專欄之前或之後，都可進一步了解住家、事業用物件與繼承不動產。", topics: { school: ["依學區查看租屋", "查詢文京區就學區域"], business: ["投資與事業用物件指南"], inheritance: ["繼承不動產的管理、活用與出售"], multilingual: ["外國人與多語言找房諮詢"] } },
  zh: { heading: "按需求阅读指南", related: "阅读后的下一步", intro: "无论是在阅读专栏之前或之后，都可进一步了解住房、事业用房源与继承不动产。", topics: { school: ["按学区查看租房", "查询文京区入学区域"], business: ["投资与事业用房源指南"], inheritance: ["继承不动产的管理、利用与出售"], multilingual: ["外国人与多语言找房咨询"] } },
};
export function columnTopicCopy(locale: LangCode) { return COPY[locale]; }
export function columnTopicLinks(topics: readonly ColumnTopic[], locale: LangCode) {
  return topics.flatMap(topic => PATHS[topic].map((href, i) => ({ href, label: COPY[locale].topics[topic][i] })));
}

/** Classify Japanese canonical metadata only, never article text or translated labels. */
export function resolveColumnTopics(column: { slug: string; title?: string; category: string; tags?: readonly string[] }): ColumnTopic[] {
  const metadata = [column.title ?? "", ...(column.tags ?? [])].join(" ");
  // A specific inheritance question keeps its primary hub even when it mentions a business use.
  if (column.category === "相続" || /^souzoku(?:-|$)/.test(column.slug)) return ["inheritance"];
  if (/学区|通学区域/.test(metadata) || /^bunkyo-.*(?:gakku|school)|^gakku-/.test(column.slug)) return ["school"];
  if (["投資・事業用不動産", "物件・許認可"].includes(column.category)) return ["business"];
  if (column.category === "外国人の住まい") return ["multilingual"];
  return [];
}
