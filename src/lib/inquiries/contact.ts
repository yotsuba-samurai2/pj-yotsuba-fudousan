import type { InquiryCategoryDef } from "./categories";
import { businessLabels, categoryLabels, contactSchema, sourceLabels, type ContactFields } from "./contact-schema";

export function contactCategory(business: ContactFields["business"]): InquiryCategoryDef {
  return {
    business,
    businessLabel: businessLabels[business],
    label: `${businessLabels[business]}へのお問い合わせ`,
    schema: contactSchema.refine(f => f.business === business),
    rows: f => {
      const fields = f as ContactFields;
      return [
        { label: "ご相談内容", value: categoryLabels[fields.category] },
        { label: "きっかけ", value: fields.source ? sourceLabels[fields.source] : "未回答" },
        { label: "お問い合わせ内容", value: fields.message },
      ];
    },
    consentShare: () => "none",
  };
}
