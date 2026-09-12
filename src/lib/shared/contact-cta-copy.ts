import type { LangCode } from "@/config/languages";
import type { BusinessKey } from "@/lib/shared/office-public";

/** UI文言のみ。DB翻訳・料金・事務所名・資格状態には触れない。 */
export type ContactCtaCopy = {
  nav: string;
  line: string;
  phone: string;
  contact: string;
  inlineHeading: string;
  topic: Record<BusinessKey, string>;
  inlineBody: Record<BusinessKey, string>;
};

export const CONTACT_CTA_COPY: Record<LangCode, ContactCtaCopy> = {
  ja: {
    nav: "相談・お問い合わせ",
    line: "LINEで相談",
    phone: "電話する",
    contact: "お問い合わせ",
    inlineHeading: "ご自身のケースについて相談したい方へ",
    topic: {
      realestate: "不動産のご相談",
      legal: "在留資格・許認可のご相談",
      labor: "人事・労務のご相談",
    },
    inlineBody: {
      realestate: "物件探しや売却について、状況をお聞かせください。",
      legal: "在留資格・許認可など、行政手続について状況をお聞かせください。",
      labor: "社会保険・給与・労務について、状況をお聞かせください。",
    },
  },
  en: {
    nav: "Contact options",
    line: "Chat on LINE",
    phone: "Call us",
    contact: "Contact us",
    inlineHeading: "Have a question about your situation?",
    topic: {
      realestate: "Property enquiries",
      legal: "Residency and permits",
      labor: "HR and employment enquiries",
    },
    inlineBody: {
      realestate: "Tell us about your property search or plans to sell.",
      legal: "Tell us about your residency, permit or administrative procedure enquiry.",
      labor: "Tell us about your social insurance, payroll or employment enquiry.",
    },
  },
  "zh-tw": {
    nav: "諮詢與聯絡方式",
    line: "LINE諮詢",
    phone: "電話諮詢",
    contact: "聯絡我們",
    inlineHeading: "想針對您的情況進一步諮詢？",
    topic: {
      realestate: "不動產諮詢",
      legal: "在留資格・許可申請諮詢",
      labor: "人事・勞務諮詢",
    },
    inlineBody: {
      realestate: "歡迎告訴我們您的找房需求或不動產出售計畫。",
      legal: "關於在留資格、許可申請等行政手續，歡迎告訴我們您的情況。",
      labor: "關於社會保險、薪資計算及勞務管理，歡迎告訴我們您的情況。",
    },
  },
  zh: {
    nav: "咨询与联系方式",
    line: "LINE咨询",
    phone: "电话咨询",
    contact: "联系我们",
    inlineHeading: "想针对您的情况进一步咨询？",
    topic: {
      realestate: "不动产咨询",
      legal: "在留资格・许可申请咨询",
      labor: "人事・劳务咨询",
    },
    inlineBody: {
      realestate: "欢迎告诉我们您的找房需求或不动产出售计划。",
      legal: "关于在留资格、许可申请等行政手续，欢迎告诉我们您的情况。",
      labor: "关于社会保险、工资计算及劳务管理，欢迎告诉我们您的情况。",
    },
  },
};
