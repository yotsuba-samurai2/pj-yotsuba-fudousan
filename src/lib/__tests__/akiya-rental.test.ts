import { describe, expect, it } from "vitest";
import { contactIntentPreset } from "@/lib/shared/contact-intent-preset";
import { contactSchema } from "@/lib/inquiries/contact-schema";
import { AKIYA_RENTAL } from "@/lib/shared/akiya-rental-copy";
import { pickFaqJa } from "@/data/faqJa";

describe("vacant-home rental enquiry", () => {
  for (const locale of ["ja", "en", "zh-tw", "zh"] as const) {
    it(`has rental copy, translated FAQ and a non-submittable hint in ${locale}`, () => {
      expect(AKIYA_RENTAL[locale].rows).toHaveLength(4);
      expect(AKIYA_RENTAL[locale].faq).toHaveLength(3);
      const preset = contactIntentPreset("akiya", "realestate", locale);
      expect(preset?.category).toBe("akiya");
      expect(preset?.message).toBe("");
      expect(preset?.placeholder).toBeTruthy();
      const fields = { name: "Example", email: "test@example.com", phone: "", business: "realestate", category: "akiya", message: preset?.message, source: "" };
      expect(contactSchema.safeParse(fields).success).toBe(false);
      expect(contactSchema.safeParse({ ...fields, message: "Bunkyo, with belongings" }).success).toBe(true);
    });
  }
  it("uses the shared Japanese answers rather than a second copy", () => {
    expect(pickFaqJa(AKIYA_RENTAL.ja.faq.map(({ q }) => q))).toEqual(AKIYA_RENTAL.ja.faq);
  });
  it("does not enable vacant-home intake for legal or labor forms", () => {
    expect(contactIntentPreset("akiya", "legal", "ja")).toBeNull();
    expect(contactIntentPreset("akiya", "labor", "ja")).toBeNull();
  });
});
