import { z } from "zod";
import { sameUnit } from "@/lib/school-rental-feed";
import { aggregateAttribution, isPermitted, type LedgerEntry } from "./permissions";
import { DEDUP_VERSION, scopeKey, type SurveyScope } from "./scope";
import { surveySnapshotSchema, type SnapshotUnit, type UnitIdentity } from "./units";

/**
 * 公開用の集計（ペット横断 指示書 版2.0 第8章）。
 * X＝確定対象 S の住戸数、Y_l＝S のうち言語 l で当サイトに詳細掲載中、Z_l＝X−Y_l。
 * 画面へは集計済みの値だけを渡す。住戸・原文・媒体ID・バッチIDは型にも入れない（strict で拒否）。
 * 未確定・許諾未確認・フラグなしは hidden（数値枠を出さない）。確定済みの0件は shown で「0件」。
 */
const iso = z.iso.datetime({ offset: true });
const count = z.number().int().nonnegative();

export const publicSurveySummarySchema = z.discriminatedUnion("state", [
  z.object({ state: z.literal("hidden") }).strict(),
  z.object({
    state: z.literal("shown"),
    conditionsKey: z.string().min(1),
    observedFrom: iso,
    observedTo: iso,
    finalizedAt: iso,
    sourceKind: z.enum(["single", "multiple"]),
    /** 媒体名の表記許可が全媒体にある場合だけ入る。 */
    attribution: z.string().nullable(),
    x: count,
    /** 住戸と掲載物件の対応が1対1で決まらないときは null（Y・Z を出さない）。 */
    breakdown: z.object({ y: count, z: count }).strict().nullable(),
  }).strict(),
]);
export type PublicSurveySummary = z.infer<typeof publicSurveySummarySchema>;
export const HIDDEN_SURVEY_SUMMARY: PublicSurveySummary = { state: "hidden" };

/** 公開する scope（例：RENTAL_SURVEY_PUBLIC_SCOPES="bunkyo-rent-pet:1"）。既定は空＝どれも公開しない。 */
export function publicSurveyScopes(env: Record<string, string | undefined>) {
  return new Set((env.RENTAL_SURVEY_PUBLIC_SCOPES ?? "").split(",").map(s => s.trim()).filter(Boolean));
}

/** 集計の公表に必要な許諾：保存・加工（store）と集計公表（aggregate）の両方が、評価時点で有効であること。 */
export function canPublishAggregate(ledger: readonly LedgerEntry[], providers: readonly string[], now: Date) {
  return providers.length > 0 && providers.every(p => isPermitted(ledger, p, "store", now) && isPermitted(ledger, p, "aggregate", now));
}

/** S と V_l の照合。1住戸が複数の掲載物件に、または1掲載物件が複数の住戸に当たるときは内訳を決めない（null）。 */
export function countListed(units: SnapshotUnit[], visible: UnitIdentity[]) {
  const used = new Set<number>();
  let y = 0;
  for (const unit of units) {
    const matches = visible.flatMap((listing, i) => unit.identities.some(identity => sameUnit(identity, listing)) ? [i] : []);
    if (matches.length > 1) return null;
    if (matches.length === 1) {
      if (used.has(matches[0])) return null;
      used.add(matches[0]);
      y++;
    }
  }
  return { y, z: units.length - y };
}

export type FinalizationView = {
  scopeId: string; scopeVersion: number; providers: string[]; dedupVersion: number;
  observedFrom: Date; observedTo: Date; snapshot: unknown; createdAt: Date;
};

export function buildPublicSurveySummary(input: {
  scope: SurveyScope;
  finalization: FinalizationView | null;
  /** 言語 l で当サイトに公開中の自社賃貸物件の住戸（isPubliclyVisible を通したもの）。 */
  visible: UnitIdentity[];
  ledger: readonly LedgerEntry[];
  publicScopes: Set<string>;
  now: Date;
}): PublicSurveySummary {
  const { scope, finalization: f, ledger, now } = input;
  if (!input.publicScopes.has(scopeKey(scope)) || !f) return HIDDEN_SURVEY_SUMMARY;
  if (f.scopeId !== scope.scopeId || f.scopeVersion !== scope.version || f.dedupVersion !== DEDUP_VERSION) return HIDDEN_SURVEY_SUMMARY;
  // 許諾の範囲が混在する確定は全体を出さない（許諾のある部分だけ出すと、差分から許諾のない情報を推測できる）。
  if (!canPublishAggregate(ledger, f.providers, now)) return HIDDEN_SURVEY_SUMMARY;
  const snapshot = surveySnapshotSchema.safeParse(f.snapshot);
  if (!snapshot.success) return HIDDEN_SURVEY_SUMMARY;
  const attributions = f.providers.map(p => aggregateAttribution(ledger, p, now));
  return publicSurveySummarySchema.parse({
    state: "shown",
    conditionsKey: scope.conditionsKey,
    observedFrom: f.observedFrom.toISOString(),
    observedTo: f.observedTo.toISOString(),
    finalizedAt: f.createdAt.toISOString(),
    sourceKind: f.providers.length > 1 ? "multiple" : "single",
    attribution: attributions.every((a): a is string => Boolean(a)) ? attributions.join("・") : null,
    x: snapshot.data.units.length,
    breakdown: countListed(snapshot.data.units, input.visible),
  });
}
