import type { LangCode } from "@/config/languages";

// Certification belongs to this legal entity, not its representative or group offices.
export const REALESTATE_CERTIFICATION = {
  legalName: "四葉不動産株式会社",
  name: "認定経営革新等支援機関",
  institutionId: "110013007712",
  designation: "第100号",
  certifiedOn: "2026-10-27",
  validUntil: "2031-10-26",
  url: "https://www.ninteishien.go.jp/NSK_CertifiedRecordView?id=a0Ddc00000eJjwyEAC",
} as const;

export function formatCertificationDate(date: string, locale: LangCode): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

const certification = REALESTATE_CERTIFICATION;

export const CERTIFICATION_COPY: Record<LangCode, {
  title: string;
  summary: string;
  designationLabel: string;
  institutionIdLabel: string;
  validUntilLabel: string;
  linkLabel: string;
}> = {
  ja: {
    title: "認定経営革新等支援機関",
    summary: `${certification.legalName}は、中小企業庁の認定制度に基づく「${certification.name}」として、${formatCertificationDate(certification.certifiedOn, "ja")}に認定されました。`,
    designationLabel: "認定号",
    institutionIdLabel: "認定支援機関ID",
    validUntilLabel: "認定有効期限",
    linkLabel: "中小企業庁の認定情報を見る",
  },
  en: {
    title: "Certified Business Support Institution",
    summary: `${certification.legalName} was certified as a “${certification.name}” on ${formatCertificationDate(certification.certifiedOn, "en")}, under the certification scheme administered by Japan’s Small and Medium Enterprise Agency.`,
    designationLabel: "Certification designation",
    institutionIdLabel: "Certified institution ID",
    validUntilLabel: "Valid until",
    linkLabel: "View the Small and Medium Enterprise Agency’s certification record",
  },
  "zh-tw": {
    title: "認定經營革新等支援機構",
    summary: `${certification.legalName}於${formatCertificationDate(certification.certifiedOn, "zh-tw")}依日本中小企業廳的認定制度，獲認定為「${certification.name}」。`,
    designationLabel: "認定號",
    institutionIdLabel: "認定支援機構ID",
    validUntilLabel: "認定有效期限",
    linkLabel: "查看日本中小企業廳的認定資訊",
  },
  zh: {
    title: "认定经营革新等支援机构",
    summary: `${certification.legalName}于${formatCertificationDate(certification.certifiedOn, "zh")}依日本中小企业厅的认定制度，获认定为「${certification.name}」。`,
    designationLabel: "认定号",
    institutionIdLabel: "认定支援机构ID",
    validUntilLabel: "认定有效期限",
    linkLabel: "查看日本中小企业厅的认定信息",
  },
};
