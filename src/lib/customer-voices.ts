import type { LangCode } from "@/config/languages";
import voices from "@/lib/data/customer-voices.json";
import { SR_OFFICE_NAME } from "@/lib/shared/sr-name";

export type VoiceBusiness = "realestate" | "legal" | "labor";
export type CustomerVoice = {
  id: string;
  name: string;
  service: string;
  body: string;
  translations: Record<Exclude<LangCode, "ja">, { service: string; body: string }>;
};

// Japanese text and anonymous attribution are preserved as supplied via LINE.
// Translations are reference translations, never additional testimonials.
export const CUSTOMER_VOICES: Record<VoiceBusiness, CustomerVoice[]> = voices;
export const VOICE_BUSINESSES = {
  realestate: { name: "四葉不動産", home: "/", path: "/voices", featured: [0, 3, 5] },
  legal: { name: "四葉行政書士事務所", home: "/legal", path: "/legal/voices", featured: [0, 2, 3] },
  labor: { name: SR_OFFICE_NAME, home: "/labor", path: "/labor/voices", featured: [0, 1, 3] },
} as const;

export const VOICE_SERVICE_PATHS: Record<VoiceBusiness, readonly string[]> = {
  realestate: ["/souzoku", "/group-home", "/services", "/souzoku", "/shataku", "/souzoku/akiya", "/services"],
  legal: ["/legal/services/inheritance", "/legal/services/inheritance", "/legal/services/shogai-fukushi", "/legal/services/visa", "/legal/services/company", "/legal/services/company", "/legal/services/inheritance"],
  labor: ["/labor/services/shogai-nenkin", "/labor/ryokin#work-rules", "/labor/services#standalone-services", "/labor/services#payroll", "/labor/services/shogu-kaizen", "/labor/services/gaikokujin-koyo", "/labor/ryokin"],
};

type VoiceCopy = {
  title: string;
  intro: string;
  all: string;
  original: string;
  translation: string;
  translatedNote: string;
  related: string;
  back: string;
  contents: string;
  count: string;
  disclaimer: Record<VoiceBusiness, string>;
};

export const VOICE_COPY: Record<LangCode, VoiceCopy> = {
  ja: {
    title: "お客様の声",
    intro: "ご相談・ご依頼いただいたお客様から、LINEでお寄せいただいた声をご紹介します。",
    all: "お客様の声をすべて読む（7件）",
    original: "日本語原文を読む",
    translation: "参考訳",
    translatedNote: "",
    related: "関連するサービスを見る",
    back: "トップページに戻る",
    contents: "ご相談内容から読む",
    count: "7件のお客様の声",
    disclaimer: {
      realestate: "掲載内容はお客様個人の感想です。物件の状況や契約条件等により対応は異なり、売却・賃貸の成立、審査通過や同様の結果を保証するものではありません。",
      legal: "掲載内容はお客様個人の感想です。許認可・在留資格等の審査結果や同様の成果を保証するものではありません。個別の法的判断は、資格者が事情を確認したうえで行います。",
      labor: "掲載内容はお客様個人の感想です。障害年金の受給・等級・支給額、加算の算定、審査結果や同様の成果を保証するものではありません。制度の適用や個別の法的判断は、資格者が事情と最新の要件を確認したうえで行います。",
    },
  },
  en: {
    title: "Client testimonials",
    intro: "Experiences shared via LINE by clients who consulted us or used our services.",
    all: "Read all 7 testimonials",
    original: "Read the Japanese original",
    translation: "Reference translation",
    translatedNote: "Translations are provided for reference. The Japanese originals and the anonymous names supplied by clients are retained.",
    related: "View the related service",
    back: "Back to the home page",
    contents: "Browse by consultation topic",
    count: "7 client testimonials",
    disclaimer: {
      realestate: "These are individual clients’ impressions. Support varies with property circumstances and contract terms. Sales, leases, screening approval and similar outcomes are not guaranteed.",
      legal: "These are individual clients’ impressions. Approval of licences, permits or residence status, and similar outcomes, are not guaranteed. A qualified professional assesses the circumstances before making any legal judgment in an individual case.",
      labor: "These are individual clients’ impressions. Disability pension eligibility, grade or benefit amount, payment supplements, application decisions and similar outcomes are not guaranteed. A qualified professional checks individual circumstances and current requirements before assessing eligibility or making legal judgments.",
    },
  },
  "zh-tw": {
    title: "客戶心聲",
    intro: "以下介紹曾向我們諮詢或委託服務的客戶透過LINE寄來的心得。",
    all: "閱讀全部7則客戶心聲",
    original: "閱讀日文原文",
    translation: "參考譯文",
    translatedNote: "譯文僅供參考。保留日文原文及客戶提供的匿名表記。",
    related: "查看相關服務",
    back: "返回首頁",
    contents: "依諮詢內容閱讀",
    count: "7則客戶心聲",
    disclaimer: {
      realestate: "刊載內容為客戶個人的感想。服務依物件狀況、契約條件等而異，不保證買賣或租賃成交、審查通過或取得相同結果。",
      legal: "刊載內容為客戶個人的感想，不保證許可、在留資格等的審查結果或取得相同成果。個別案件的法律判斷，由具資格的專業人員確認具體情況後作出。",
      labor: "刊載內容為客戶個人的感想，不保證障礙年金的受給、等級、給付金額、加算的核算、審查結果或取得相同成果。制度適用及個別法律判斷，由具資格的專業人員確認具體情況與最新要件後作出。",
    },
  },
  zh: {
    title: "客户心声",
    intro: "以下介绍曾向我们咨询或委托服务的客户通过LINE发来的心得。",
    all: "阅读全部7则客户心声",
    original: "阅读日文原文",
    translation: "参考译文",
    translatedNote: "译文仅供参考。保留日文原文及客户提供的匿名表记。",
    related: "查看相关服务",
    back: "返回首页",
    contents: "按咨询内容阅读",
    count: "7则客户心声",
    disclaimer: {
      realestate: "刊载内容为客户个人的感想。服务因物件情况、合同条件等而异，不保证买卖或租赁成交、审查通过或取得相同结果。",
      legal: "刊载内容为客户个人的感想，不保证许可、在留资格等的审查结果或取得相同成果。个别案件的法律判断，由具资格的专业人员确认具体情况后作出。",
      labor: "刊载内容为客户个人的感想，不保证残障年金的领取、等级、给付金额、加算的核算、审查结果或取得相同成果。制度适用及个别法律判断，由具资格的专业人员确认具体情况与最新要求后作出。",
    },
  },
};

export function localizeVoice(voice: CustomerVoice, locale: LangCode) {
  return locale === "ja" ? voice : voice.translations[locale];
}
