import type { LangCode } from "@/config/languages";

export const INHERITANCE_CORRECTION_API = "/api/admin/columns/reviewed-inheritance-20261123";
export type InheritanceCorrectionBusiness = "legal" | "realestate";
export type CorrectionFaq = { question: string; answer: string }[];
export type CorrectionField = "excerpt" | "content" | "faq";
export type CorrectionDiff = {
  lang: LangCode;
  field: CorrectionField;
  before: string | CorrectionFaq;
  after: string | CorrectionFaq;
};
export type CorrectionInput = {
  business: InheritanceCorrectionBusiness;
  slug: string;
  expectedUpdatedAt: string;
  originalFingerprint: string;
  revisedFingerprint: string;
};
export type CorrectionPreview = {
  business: InheritanceCorrectionBusiness;
  slug: string;
  title: string;
  locales: readonly LangCode[];
  date: string;
  state: "ready" | "unchanged" | "blocked";
  reason: string;
  changes: CorrectionDiff[];
  confirmation?: CorrectionInput;
};
