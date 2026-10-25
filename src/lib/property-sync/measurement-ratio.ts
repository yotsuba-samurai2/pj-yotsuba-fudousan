import { z } from "zod";
import { measurementScopeSchema, summarizeMeasurements } from "./measurement-summary";
import { contentHash } from "./rules";

const id = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/);
const instant = z.iso.datetime({ precision: 3 });
const count = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
const reference = z.object({ id, version: count.min(1), hash: z.string().regex(/^[a-f0-9]{64}$/) }).strict();
const validity = { effectiveFrom: instant, effectiveUntil: instant, confirmation: z.enum(["confirmed", "unconfirmed"]),
  confirmedAt: instant.nullable(), confirmationRef: id.nullable() };
const validRange = (v: { effectiveFrom: string; effectiveUntil: string }) => v.effectiveFrom < v.effectiveUntil;
export const ratioPairSchema = z.object({ id, version: count.min(1), scope: measurementScopeSchema,
  numerator: reference, denominator: reference, ratioKind: z.enum(["subset_rate", "event_ratio"]),
  numeratorUnit: z.enum(["events", "people", "sessions"]), denominatorUnit: z.enum(["events", "people", "sessions"]),
  populationRef: id.nullable(), countingPeriodRef: id.nullable(), semanticsRef: id.nullable(), ...validity,
}).strict().refine(validRange).refine(p => p.ratioKind !== "subset_rate" || p.numeratorUnit === p.denominatorUnit);
export const ratioThresholdSchema = z.object({ id, version: count.min(1), pair: reference,
  minimumDenominator: count.min(1).nullable(), durationBasis: z.enum(["elapsed_time_ms", "unknown"]), minimumDuration: count.min(1).nullable(),
  ...validity }).strict().refine(validRange);
const requestSchema = z.object({ scope: measurementScopeSchema, pair: reference, threshold: reference,
  period: z.object({ start: instant, end: instant }).strict().refine(p => p.start < p.end) }).strict();
export type RatioPair = z.infer<typeof ratioPairSchema>;
export type RatioThreshold = z.infer<typeof ratioThresholdSchema>;
export type RatioRequest = z.infer<typeof requestSchema>;
const held = (reason: string) => ({ status: "held" as const, executable: false as const, decisionEligible: false as const,
  reason, exactFraction: null, approximate: null });
const ref = (v: { id: string; version: number }) => ({ id: v.id, version: v.version, hash: contentHash(v) });
const same = (a: unknown, b: unknown) => contentHash(a) === contentHash(b);
const confirmed = (v: z.infer<typeof ratioThresholdSchema> | RatioPair, now: string) => v.confirmation === "confirmed" && !!v.confirmationRef && !!v.confirmedAt
  && v.confirmedAt <= now && v.effectiveFrom <= now && now < v.effectiveUntil;

/** Recomputes both private summaries. This does not prove attribution, authorize decisions or send analytics. */
export function calculateMeasurementRatio(rawRequest: unknown, rawPair: unknown, rawThreshold: unknown,
  numeratorDefinition: unknown, numeratorObservations: unknown, denominatorDefinition: unknown, denominatorObservations: unknown, now: string) {
  try {
    const request = requestSchema.safeParse(rawRequest), pair = ratioPairSchema.safeParse(rawPair), threshold = ratioThresholdSchema.safeParse(rawThreshold);
    if (!request.success || !pair.success || !threshold.success || !instant.safeParse(now).success) return held("INVALID_RATIO_INPUT");
    const q = request.data, p = pair.data, t = threshold.data;
    if (!same(q.pair, ref(p)) || !same(t.pair, q.pair) || !same(q.threshold, ref(t))) return held("RATIO_REFERENCE_MISMATCH");
    if (!same(q.scope, p.scope)) return held("RATIO_SCOPE_MISMATCH");
    if (!confirmed(p, now) || !p.populationRef || !p.countingPeriodRef || !p.semanticsRef) return held("RATIO_PAIR_UNCONFIRMED");
    if (!confirmed(t, now) || t.minimumDenominator === null || t.minimumDuration === null || t.durationBasis !== "elapsed_time_ms") return held("RATIO_THRESHOLD_UNCONFIRMED");
    const numerator = summarizeMeasurements({ scope: q.scope, definition: p.numerator, period: q.period }, numeratorDefinition, numeratorObservations, now);
    const denominator = summarizeMeasurements({ scope: q.scope, definition: p.denominator, period: q.period }, denominatorDefinition, denominatorObservations, now);
    if (numerator.status !== "complete" || numerator.total === null) return held("NUMERATOR_INCOMPLETE");
    if (denominator.status !== "complete" || denominator.total === null) return held("DENOMINATOR_INCOMPLETE");
    if (numerator.reference.timeZone !== denominator.reference.timeZone) return held("RATIO_TIMEZONE_MISMATCH");
    const n = numerator.total, d = denominator.total;
    if (d === 0) return held("ZERO_DENOMINATOR");
    if (p.ratioKind === "subset_rate" && n > d) return held("SUBSET_EXCEEDS_DENOMINATOR");
    if (d < t.minimumDenominator) return held("DENOMINATOR_BELOW_THRESHOLD");
    if (numerator.requestedDurationMs < t.minimumDuration) return held("DURATION_BELOW_THRESHOLD");
    const body = { scope: q.scope, pair: q.pair, threshold: q.threshold, period: q.period,
      numeratorSummary: numerator.reference.hash, denominatorSummary: denominator.reference.hash, checkedAt: now };
    return { status: "calculated" as const, executable: false as const, decisionEligible: false as const, reason: "DESCRIPTIVE_RATIO_ONLY",
      exactFraction: { numerator: String(n), denominator: String(d) },
      approximate: { ratio: n / d, percentage: p.ratioKind === "subset_rate" ? n / d * 100 : null,
        arithmetic: "IEEE754" as const, displayRoundingDigits: null }, reference: { ...body, hash: contentHash(body) } };
  } catch { return held("INVALID_RATIO_INPUT"); }
}
