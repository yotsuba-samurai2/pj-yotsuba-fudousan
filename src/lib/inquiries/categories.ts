import type { z } from "zod";
import {
  PET_CATEGORY_LABELS, PET_OWNER_CATEGORY, PET_RENTER_CATEGORY,
  petOwnerRows, petOwnerSchema, petRenterRows, petRenterSchema,
  type PetOwnerFields, type PetRenterFields,
} from "@/lib/shared/pet-intake";

/**
 * 受付の種類の登録簿（サーバー側の正本）。事業者（business）は画面から受け取らず、ここで category から決める。
 * 指示書 版2.0 第12章「画面の任意値だけで送信先・権限を決定しない」。
 */
export type InquiryCategoryDef = {
  business: "realestate" | "legal";
  businessLabel: string;
  label: string;
  schema: z.ZodType<Record<string, unknown>>;
  rows: (fields: Record<string, unknown>) => { label: string; value: string }[];
  consentShare: (fields: Record<string, unknown>) => "none" | "granted";
};

export const INQUIRY_CATEGORIES: Record<string, InquiryCategoryDef> = {
  [PET_RENTER_CATEGORY]: {
    business: "realestate",
    businessLabel: "四葉不動産株式会社",
    label: PET_CATEGORY_LABELS[PET_RENTER_CATEGORY],
    schema: petRenterSchema as unknown as z.ZodType<Record<string, unknown>>,
    rows: f => petRenterRows(f as PetRenterFields),
    consentShare: f => ((f as PetRenterFields).consentShare ? "granted" : "none"),
  },
  [PET_OWNER_CATEGORY]: {
    business: "realestate",
    businessLabel: "四葉不動産株式会社",
    label: PET_CATEGORY_LABELS[PET_OWNER_CATEGORY],
    schema: petOwnerSchema as unknown as z.ZodType<Record<string, unknown>>,
    rows: f => petOwnerRows(f as PetOwnerFields),
    consentShare: () => "none",
  },
};

export function inquiryCategory(category: unknown): InquiryCategoryDef | null {
  return typeof category === "string" && Object.hasOwn(INQUIRY_CATEGORIES, category) ? INQUIRY_CATEGORIES[category] : null;
}
