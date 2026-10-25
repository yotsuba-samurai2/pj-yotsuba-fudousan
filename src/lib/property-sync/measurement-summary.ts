import { z } from "zod";
import { contentHash } from "./rules";

const id = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/);
const instant = z.iso.datetime({ precision: 3 });
const count = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
const hash = z.string().regex(/^[a-f0-9]{64}$/);
const periodSchema = z.object({ start: instant, end: instant }).strict().refine(p => p.start < p.end);
export const measurementScopeSchema = z.object({ sourceRef: id, media: z.enum(["site", "athome"]),
  distribution: z.enum(["consumer", "broker", "partner"]), market: z.enum(["residential_rental", "sale", "business"]),
  propertyId: z.uuid(), episodeId: id, device: z.enum(["pc", "mobileWeb", "mobileApp", "tablet", "unknown", "all"]) }).strict();
export const metricDefinitionSchema = z.object({ id, version: count.min(1), sourceRef: id,
  metric: z.enum(["listing_impressions", "detail_views", "pageviews", "visits", "unique_users", "line_clicks", "phone_clicks", "form_attempts", "receipts_saved", "crm_received", "active_listings"]),
  valueKind: z.enum(["interval_count", "unique_count", "point_in_time", "cumulative", "mean"]),
  additivity: z.enum(["additive", "non_additive", "unknown"]), bucketKind: z.enum(["interval", "calendar_day"]),
  timeZone: z.string().min(1).max(100), confirmation: z.enum(["confirmed", "unconfirmed"]), confirmedAt: instant.nullable(), confirmationRef: id.nullable(),
}).strict().refine(d => d.additivity !== "additive" || (d.valueKind === "interval_count" && d.metric !== "unique_users" && d.metric !== "active_listings"));
const definitionRef = z.object({ id, version: count.min(1), hash }).strict();
const common = { observationId: z.uuid(), scope: measurementScopeSchema, definition: definitionRef, period: periodSchema,
  observedAt: instant, acquisition: z.enum(["manual_confirmed", "official_export", "official_api", "mock", "unknown"]), evidenceRef: id.nullable(), scopeConfirmed: z.boolean() };
export const measurementSchema = z.discriminatedUnion("status", [
  z.object({ ...common, status: z.literal("observed"), value: count,
    quality: z.enum(["final", "provisional", "estimated", "sampled", "suppressed"]) }).strict(),
  z.object({ ...common, status: z.literal("missing"), value: z.null(),
    reason: z.enum(["not_available", "permission_denied", "auth_required", "definition_unknown", "collection_failed", "not_supported", "not_collected", "unknown"]) }).strict(),
]);
const requestSchema = z.object({ scope: measurementScopeSchema, definition: definitionRef, period: periodSchema }).strict();
export type MetricDefinition = z.infer<typeof metricDefinitionSchema>;
export type Measurement = z.infer<typeof measurementSchema>;
export type MeasurementSummaryRequest = z.infer<typeof requestSchema>;
const held = (reason: string) => ({ status: "held" as const, executable: false as const, decisionEligible: false as const, reason, total: null });
const same = (a: unknown, b: unknown) => contentHash(a) === contentHash(b);

function calendarDay(period: z.infer<typeof periodSchema>, formatter: Intl.DateTimeFormat): boolean {
  const parts = (at: string) => Object.fromEntries(formatter.formatToParts(new Date(at)).map(p => [p.type, p.value]));
  const a = parts(period.start), b = parts(period.end);
  if ([a, b].some(p => p.hour !== "00" || p.minute !== "00" || p.second !== "00") || !period.start.endsWith(".000Z") || !period.end.endsWith(".000Z")) return false;
  // Some zones repeat midnight. Only the first instant of each local date is a day boundary.
  for (const [at, local] of [[period.start, a], [period.end, b]] as const) {
    const prior = parts(new Date(Date.parse(at) - 1).toISOString());
    if (prior.year === local.year && prior.month === local.month && prior.day === local.day) return false;
  }
  const date = `${a.year.padStart(4, "0")}-${a.month}-${a.day}`;
  const next = new Date(Date.parse(date + "T00:00:00.000Z") + 86_400_000).toISOString().slice(0, 10);
  return next === `${b.year.padStart(4, "0")}-${b.month}-${b.day}`;
}

function unavailableReason(o: Measurement): string | undefined {
  if (o.status === "missing") return o.reason;
  if (o.quality !== "final") return "VALUE_NOT_FINAL";
  if (!o.scopeConfirmed || !o.evidenceRef || o.acquisition === "mock" || o.acquisition === "unknown") return "VALUE_NOT_VERIFIED";
  if (o.observedAt < o.period.end) return "OBSERVED_BEFORE_PERIOD_END";
}

/** Private deterministic summary only. No ingestion, analytics API, customer text or allocation decisions. */
export function summarizeMeasurements(rawRequest: unknown, rawDefinition: unknown, rawObservations: unknown, now: string) {
  try {
    // Reject oversized collections before schema parsing walks them.
    if (!Array.isArray(rawObservations) || rawObservations.length > 4000) return held("OBSERVATION_LIMIT");
    const request = requestSchema.safeParse(rawRequest), definition = metricDefinitionSchema.safeParse(rawDefinition), observations = z.array(measurementSchema).safeParse(rawObservations);
    if (!request.success || !definition.success || !observations.success || !instant.safeParse(now).success) return held("INVALID_MEASUREMENT_INPUT");
    const q = request.data, d = definition.data;
    if (d.confirmation !== "confirmed" || !d.confirmationRef || !d.confirmedAt || d.confirmedAt > now) return held("METRIC_DEFINITION_UNCONFIRMED");
    if (q.scope.sourceRef !== d.sourceRef || !same(q.definition, { id: d.id, version: d.version, hash: contentHash(d) })) return held("METRIC_DEFINITION_MISMATCH");
    const duration = Date.parse(q.period.end) - Date.parse(q.period.start);
    if (duration > 370 * 86_400_000) return held("PERIOD_LIMIT");
    if (q.period.end > now) return held("PERIOD_NOT_ENDED");
    let formatter: Intl.DateTimeFormat;
    try { formatter = new Intl.DateTimeFormat("en-US", { timeZone: d.timeZone, calendar: "iso8601", numberingSystem: "latn", hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }); }
    catch { return held("INVALID_METRIC_TIMEZONE"); }
    const unique = new Map<string, Measurement>();
    let ignoredDuplicates = 0;
    for (const o of observations.data) {
      if (!same(o.scope, q.scope)) return held("MEASUREMENT_SCOPE_MISMATCH");
      if (!same(o.definition, q.definition)) return held("METRIC_DEFINITION_MISMATCH");
      if (o.observedAt > now) return held("OBSERVATION_FROM_FUTURE");
      if (o.period.start < q.period.start || o.period.end > q.period.end) return held("BUCKET_OUTSIDE_PERIOD");
      if (d.bucketKind === "calendar_day" && !calendarDay(o.period, formatter)) return held("CALENDAR_BUCKET_MISMATCH");
      const prior = unique.get(o.observationId);
      if (prior) { if (!same(prior, o)) return held("OBSERVATION_ID_CONFLICT"); ignoredDuplicates++; }
      else unique.set(o.observationId, o);
    }
    const sorted = [...unique.values()].sort((a, b) => a.period.start < b.period.start ? -1 : a.period.start > b.period.start ? 1 : a.period.end < b.period.end ? -1 : 1);
    let cursor = q.period.start, known = BigInt(0), knownBuckets = 0, coveredDurationMs = 0;
    const gaps: z.infer<typeof periodSchema>[] = [];
    const unavailable: { observationId: string; period: z.infer<typeof periodSchema>; reason: string }[] = [];
    for (const o of sorted) {
      if (o.period.start < cursor) return held("OVERLAPPING_MEASUREMENT_BUCKETS");
      if (o.period.start > cursor) gaps.push({ start: cursor, end: o.period.start });
      cursor = o.period.end;
      const issue = unavailableReason(o);
      if (issue) unavailable.push({ observationId: o.observationId, period: o.period, reason: issue });
      else if (o.status === "observed") { known += BigInt(o.value); knownBuckets++; coveredDurationMs += Date.parse(o.period.end) - Date.parse(o.period.start); }
    }
    if (cursor < q.period.end) gaps.push({ start: cursor, end: q.period.end });
    const coverageComplete = gaps.length === 0 && unavailable.length === 0;
    const additive = d.additivity === "additive";
    if (additive && known > BigInt(Number.MAX_SAFE_INTEGER)) return held("MEASUREMENT_TOTAL_OVERFLOW");
    const body = { scope: q.scope, definition: q.definition, period: q.period, timeZone: d.timeZone,
      observationsHash: contentHash(sorted), checkedAt: now };
    return { status: !additive ? "not_aggregated" as const : coverageComplete ? "complete" as const : "incomplete" as const,
      executable: false as const, decisionEligible: false as const,
      reason: !additive ? "METRIC_NOT_ADDITIVE" : coverageComplete ? "COMPLETE_VERIFIED_BUCKETS" : "MEASUREMENT_COVERAGE_INCOMPLETE",
      total: additive && coverageComplete ? Number(known) : null,
      knownTotal: additive && knownBuckets > 0 ? Number(known) : null,
      coverageComplete, knownBuckets, coveredDurationMs, requestedDurationMs: duration,
      unavailable, uncoveredIntervals: gaps, ignoredDuplicates, reference: { ...body, hash: contentHash(body) } };
  } catch { return held("INVALID_MEASUREMENT_INPUT"); }
}
