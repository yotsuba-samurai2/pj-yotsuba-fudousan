import { z } from "zod";
import { scanPropertyText, type PropertyInput } from "@/lib/property-shared";

/**
 * 物件入力の検証（API Route 用）。種別（dealType）ごとの必須項目は
 * 「不動産の表示に関する公正競争規約」別表3・5・7のインターネット広告列
 * （原本目視2026-09-01）に対応する。property-shared.ts の型と1対1。
 */

const ymOrText = z.string().min(1); // "YYYY-MM" または「即時」等
const areaSqm = z.number().nonnegative().finite();

const accessSchema = z.object({
  line: z.string().min(1),
  station: z.string().min(1),
  distanceM: z.number().positive().finite(),
});

const imageSchema = z.object({
  url: z.string().min(1),
  alt: z.string().min(1),
});

const leasehold = z.string().min(1).optional();

const landSpec = z.object({
  dealType: z.literal("land"),
  landAreaSqm: z.number().positive().finite(),
  privateRoadAreaSqm: areaSqm,
  landCategory: z.string().min(1),
  zoning: z.string().min(1),
  buildingCoverage: z.string().min(1),
  floorAreaRatio: z.string().min(1),
  legalRestrictions: z.string().min(1),
  leasehold,
});

const houseSpec = z.object({
  dealType: z.literal("house"),
  landAreaSqm: z.number().positive().finite(),
  privateRoadAreaSqm: areaSqm,
  buildingAreaSqm: z.number().positive().finite(),
  isRowHouse: z.boolean().optional(),
  builtYm: ymOrText,
  deliveryYm: ymOrText,
  leasehold,
});

const condoSpec = z.object({
  dealType: z.literal("condo"),
  floors: z.string().min(1),
  floorLocated: z.string().min(1),
  exclusiveAreaSqm: z.number().positive().finite(),
  balconyAreaSqm: areaSqm,
  builtYm: ymOrText,
  deliveryYm: ymOrText,
  managementFee: z.string().min(1),
  repairReserve: z.string().min(1),
  managementForm: z.string().min(1),
  managerWorkStyle: z.string().min(1),
  leasehold,
});

const wholeBuildingSpec = z.object({
  dealType: z.literal("wholeBuilding"),
  landAreaSqm: z.number().positive().finite(),
  privateRoadAreaSqm: areaSqm,
  buildingAreaSqm: z.number().positive().finite(),
  builtYm: ymOrText,
  deliveryYm: ymOrText,
  unitCount: z.number().int().positive(),
  unitAreaMinSqm: z.number().positive().finite(),
  unitAreaMaxSqm: z.number().positive().finite(),
  structure: z.string().min(1),
  floors: z.string().min(1),
  leasehold,
});

// 事業用建物＝別表5相当の自主基準（2026-09-01浦松承認①）
const businessBuildingSpec = z.object({
  dealType: z.literal("businessBuilding"),
  landAreaSqm: z.number().positive().finite(),
  privateRoadAreaSqm: areaSqm,
  buildingAreaSqm: z.number().positive().finite(),
  builtYm: ymOrText,
  deliveryYm: ymOrText,
  structure: z.string().min(1).optional(),
  floors: z.string().min(1).optional(),
  zoning: z.string().min(1).optional(),
  leasehold,
});

export const propertySpecSchema = z.discriminatedUnion("dealType", [
  landSpec,
  houseSpec,
  condoSpec,
  wholeBuildingSpec,
  businessBuildingSpec,
]);

const translationSchema = z.object({
  title: z.string(),
  description: z.string(),
  locationText: z.string().optional(),
});

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const propertyBaseSchema = z.object({
    slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "slugは半角英数とハイフンのみ"),
    status: z.enum(["draft", "published", "closed"]),
    dealType: z.enum(["land", "house", "condo", "wholeBuilding", "businessBuilding"]),
    category: z.enum(["gh", "jigyo", "souzoku", "toushi", "other"]),
    tradeMode: z.enum(["seller", "agent", "broker"]),
    title: z.string().min(1),
    priceYen: z.number().int().positive(),
    priceNote: z.string().optional(),
    locationText: z.string().min(1),
    access: z.array(accessSchema),
    spec: propertySpecSchema,
    images: z.array(imageSchema),
    description: z.string().min(1),
    publishedAt: isoDate.optional(),
    infoUpdatedAt: isoDate,
    nextUpdateAt: isoDate,
    locales: z.array(z.enum(["ja", "en", "zh-tw", "zh"])).optional(),
    translations: z
      .object({
        en: translationSchema.optional(),
        "zh-tw": translationSchema.optional(),
        zh: translationSchema.optional(),
      })
      .optional(),
    internal: z.record(z.string(), z.unknown()).optional(),
});

// spec の dealType と本体の dealType の食い違いを拒否（表示の取り違え防止）
function checkDealTypeMatch(
  v: { dealType?: string; spec?: { dealType?: string } },
  ctx: z.RefinementCtx,
) {
  if (v.spec && v.dealType && v.spec.dealType !== v.dealType) {
    ctx.addIssue({
      code: "custom",
      path: ["spec", "dealType"],
      message: "spec.dealType が dealType と一致していません",
    });
  }
}

export const propertyInputSchema = propertyBaseSchema.superRefine(checkDealTypeMatch);
const propertyPatchSchema = propertyBaseSchema.partial().superRefine(checkDealTypeMatch);

export type ValidatedPropertyInput = z.infer<typeof propertyInputSchema>;

/** APIの入力を検証して PropertyInput へ。失敗時はメッセージ配列を返す */
export function parsePropertyInput(
  body: unknown,
): { ok: true; data: PropertyInput } | { ok: false; errors: string[] } {
  const result = propertyInputSchema.safeParse(body);
  if (!result.success) {
    const errors = result.error.issues.map(
      (i) => `${i.path.join(".") || "(root)"}: ${i.message}`,
    );
    return { ok: false, errors };
  }
  return { ok: true, data: result.data as PropertyInput };
}

/**
 * 公開状態（published）の物件に規約の特定用語・業者間用語が含まれていたら
 * 保存を拒否するためのエラーメッセージを返す（下書きは保存可＝公開時ゲート）。
 */
export function bannedTermsError(input: {
  status?: string;
  title?: string;
  description?: string;
  priceNote?: string;
}): string | null {
  if (input.status !== "published") return null;
  const text = [input.title, input.description, input.priceNote]
    .filter(Boolean)
    .join("\n");
  const hits = scanPropertyText(text);
  if (hits.length === 0) return null;
  const terms = [...new Set(hits.map((h) => h.term))].join("・");
  return `公開できません：表示規約の特定用語または業者間用語が含まれています（${terms}）`;
}

/** PATCH 用（部分更新）。渡ってきたキーだけを検証する */
export function parsePropertyPatch(
  body: unknown,
): { ok: true; data: Partial<PropertyInput> } | { ok: false; errors: string[] } {
  const result = propertyPatchSchema.safeParse(body);
  if (!result.success) {
    const errors = result.error.issues.map(
      (i) => `${i.path.join(".") || "(root)"}: ${i.message}`,
    );
    return { ok: false, errors };
  }
  return { ok: true, data: result.data as Partial<PropertyInput> };
}
