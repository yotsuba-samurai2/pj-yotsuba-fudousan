import { expect, it } from "vitest";
import { summarizeMeasurements, type Measurement, type MeasurementSummaryRequest, type MetricDefinition } from "../measurement-summary";
import { contentHash } from "../rules";

const now = "2026-10-24T12:00:00.000Z";
const day = (n: number) => `2026-10-${String(n).padStart(2, "0")}T00:00:00.000Z`;
function fixture() {
  const definition: MetricDefinition = { id: "detail-views", version: 1, sourceRef: "synthetic-export", metric: "detail_views",
    valueKind: "interval_count", additivity: "additive", bucketKind: "interval", timeZone: "Asia/Tokyo", confirmation: "confirmed",
    confirmedAt: day(20), confirmationRef: "PRIVATE_DEFINITION" };
  const request: MeasurementSummaryRequest = { scope: { sourceRef: definition.sourceRef, media: "athome", distribution: "consumer",
    market: "residential_rental", propertyId: "00000000-0000-4000-8000-000000000001", episodeId: "episode-1", device: "pc" },
    definition: { id: definition.id, version: definition.version, hash: contentHash(definition) }, period: { start: day(21), end: day(23) } };
  const observations: Measurement[] = [21, 22].map((n, i) => ({ observationId: `00000000-0000-4000-8000-00000000000${i + 2}`,
    scope: structuredClone(request.scope), definition: structuredClone(request.definition), period: { start: day(n), end: day(n + 1) },
    observedAt: now, acquisition: "official_export", evidenceRef: "PRIVATE_OBSERVATION", scopeConfirmed: true,
    status: "observed", value: i + 3, quality: "final" }));
  return { definition, request, observations };
}
function run(f = fixture(), at = now) { return summarizeMeasurements(f.request, f.definition, f.observations, at); }
function rebind(f: ReturnType<typeof fixture>) {
  f.request.definition = { id: f.definition.id, version: f.definition.version, hash: contentHash(f.definition) };
  for (const o of f.observations) o.definition = structuredClone(f.request.definition);
}

it("同一定義・scope・連続期間の確認済み区間countのみ合算し、判断許可を返さない", () => {
  const f = fixture(), before = structuredClone(f), result = run(f);
  expect(result).toMatchObject({ status: "complete", total: 7, knownTotal: 7, coverageComplete: true, knownBuckets: 2,
    coveredDurationMs: 172800000, requestedDurationMs: 172800000, ignoredDuplicates: 0, executable: false, decisionEligible: false,
    reference: { scope: f.request.scope, definition: f.request.definition, period: f.request.period, checkedAt: now } });
  expect(run({ ...f, observations: [...f.observations].reverse() })).toEqual(result);
  expect(f).toEqual(before);
  expect(JSON.stringify(result)).not.toMatch(/PRIVATE_|evidenceRef|confirmationRef/);
});

it("確認済み0は実数0、欠測・空配列はnull", () => {
  const f = fixture();
  for (const o of f.observations) if (o.status === "observed") o.value = 0;
  expect(run(f)).toMatchObject({ status: "complete", total: 0, knownTotal: 0 });
  expect(run({ ...f, observations: [] })).toMatchObject({ status: "incomplete", total: null, knownTotal: null,
    knownBuckets: 0, uncoveredIntervals: [f.request.period] });
  const base = f.observations[0];
  f.observations[0] = { observationId: base.observationId, scope: base.scope, definition: base.definition, period: base.period,
    observedAt: base.observedAt, acquisition: base.acquisition, evidenceRef: base.evidenceRef, scopeConfirmed: base.scopeConfirmed,
    status: "missing", value: null, reason: "auth_required" };
  expect(run(f)).toMatchObject({ status: "incomplete", total: null, knownTotal: 0, knownBuckets: 1,
    unavailable: [{ reason: "auth_required" }], uncoveredIntervals: [] });
});

it("部分取得の既知小計と期間の穴を区別し、全期間合計を作らない", () => {
  const f = fixture(); f.request.period = { start: day(20), end: day(24) }; f.observations = [f.observations[0]];
  expect(run(f)).toMatchObject({ status: "incomplete", total: null, knownTotal: 3, knownBuckets: 1,
    uncoveredIntervals: [{ start: day(20), end: day(21) }, { start: day(22), end: day(24) }] });
});

it.each(["pc-to-mobile", "all", "unknown", "media", "distribution", "market", "property", "episode", "source"])("%sの混在を拒否", key => {
  const f = fixture(), scope = f.observations[0].scope;
  if (key === "pc-to-mobile") scope.device = "mobileWeb";
  if (key === "all") scope.device = "all";
  if (key === "unknown") scope.device = "unknown";
  if (key === "media") scope.media = "site";
  if (key === "distribution") scope.distribution = "broker";
  if (key === "market") scope.market = "sale";
  if (key === "property") scope.propertyId = "00000000-0000-4000-8000-000000000099";
  if (key === "episode") scope.episodeId = "episode-2";
  if (key === "source") scope.sourceRef = "other-source";
  expect(run(f)).toMatchObject({ status: "held", reason: "MEASUREMENT_SCOPE_MISMATCH", total: null });
});

it.each(["id", "version", "hash", "source"])("指標定義%sの差を同じ指標として扱わない", key => {
  const f = fixture();
  if (key === "id") f.observations[0].definition.id = "other";
  if (key === "version") f.observations[0].definition.version++;
  if (key === "hash") f.observations[0].definition.hash = "a".repeat(64);
  if (key === "source") { f.definition.sourceRef = "other-source"; rebind(f); }
  expect(run(f)).toMatchObject({ status: "held", reason: "METRIC_DEFINITION_MISMATCH" });
});

it.each(["unconfirmed", "no-reference", "no-time", "future"])("定義承認の%sを保留", key => {
  const f = fixture();
  if (key === "unconfirmed") f.definition.confirmation = "unconfirmed";
  if (key === "no-reference") f.definition.confirmationRef = null;
  if (key === "no-time") f.definition.confirmedAt = null;
  if (key === "future") f.definition.confirmedAt = day(25);
  rebind(f); expect(run(f)).toMatchObject({ reason: "METRIC_DEFINITION_UNCONFIRMED" });
});

it.each(["provisional", "estimated", "sampled", "suppressed"] as const)("%sを確定件数へ含めない", quality => {
  const f = fixture(); if (f.observations[0].status === "observed") f.observations[0].quality = quality;
  expect(run(f)).toMatchObject({ status: "incomplete", total: null, knownTotal: 4, unavailable: [{ reason: "VALUE_NOT_FINAL" }] });
});

it.each(["scope", "reference", "mock", "unknown", "before-end"])("未確認観測%sを既知小計へ含めない", key => {
  const f = fixture(), o = f.observations[0];
  if (key === "scope") o.scopeConfirmed = false;
  if (key === "reference") o.evidenceRef = null;
  if (key === "mock" || key === "unknown") o.acquisition = key;
  if (key === "before-end") o.observedAt = day(21);
  expect(run(f)).toMatchObject({ status: "incomplete", total: null, knownTotal: 4,
    unavailable: [{ reason: key === "before-end" ? "OBSERVED_BEFORE_PERIOD_END" : "VALUE_NOT_VERIFIED" }] });
});

it("同じ観測ID・内容の再送は一度だけ数える", () => {
  const f = fixture(); f.observations.push(structuredClone(f.observations[0]));
  expect(run(f)).toMatchObject({ status: "complete", total: 7, ignoredDuplicates: 1 });
});
it("同IDの修正内容を黙って最新版へ置換しない", () => {
  const f = fixture(), clone = structuredClone(f.observations[0]); clone.evidenceRef = "CORRECTION"; f.observations.push(clone);
  expect(run(f)).toMatchObject({ reason: "OBSERVATION_ID_CONFLICT" });
});
it.each(["same-bucket", "partial-overlap"])("別IDの%sを二重加算しない", key => {
  const f = fixture(); f.observations[1].period = key === "same-bucket" ? structuredClone(f.observations[0].period)
    : { start: "2026-10-21T12:00:00.000Z", end: day(23) };
  expect(run(f)).toMatchObject({ reason: "OVERLAPPING_MEASUREMENT_BUCKETS" });
});

it.each(["unique_count", "point_in_time", "cumulative", "mean"] as const)("%sを日次加算しない", valueKind => {
  const f = fixture(); f.definition.valueKind = valueKind; f.definition.additivity = "non_additive"; rebind(f);
  expect(run(f)).toMatchObject({ status: "not_aggregated", reason: "METRIC_NOT_ADDITIVE", coverageComplete: true, total: null, knownTotal: null });
  f.definition.additivity = "additive"; rebind(f); expect(run(f)).toMatchObject({ reason: "INVALID_MEASUREMENT_INPUT" });
});
it.each(["unique_users", "active_listings"] as const)("%sは加算可能との自己申告だけで通さない", metric => {
  const f = fixture(); f.definition.metric = metric; rebind(f);
  expect(run(f)).toMatchObject({ reason: "INVALID_MEASUREMENT_INPUT" });
});
it("加算性未確認も合計null", () => {
  const f = fixture(); f.definition.additivity = "unknown"; rebind(f);
  expect(run(f)).toMatchObject({ status: "not_aggregated", total: null });
});

it.each(["future-observation", "future-period", "outside", "overlong", "empty-period"])("期間制約%s", key => {
  const f = fixture();
  if (key === "future-observation") f.observations[0].observedAt = day(25);
  if (key === "future-period") f.request.period.end = day(25);
  if (key === "outside") f.observations[0].period.start = day(20);
  if (key === "overlong") f.request.period.start = "2025-01-01T00:00:00.000Z";
  if (key === "empty-period") f.request.period.end = f.request.period.start;
  expect(run(f)).toMatchObject({ status: "held", reason: { "future-observation": "OBSERVATION_FROM_FUTURE", "future-period": "PERIOD_NOT_ENDED",
    outside: "BUCKET_OUTSIDE_PERIOD", overlong: "PERIOD_LIMIT", "empty-period": "INVALID_MEASUREMENT_INPUT" }[key] });
});
it("安全整数の合計overflowと入力件数超過を拒否", () => {
  const f = fixture(); if (f.observations[0].status === "observed") f.observations[0].value = Number.MAX_SAFE_INTEGER;
  expect(run(f)).toMatchObject({ reason: "MEASUREMENT_TOTAL_OVERFLOW" });
  expect(run({ ...f, observations: Array(4001).fill(f.observations[0]) })).toMatchObject({ reason: "OBSERVATION_LIMIT" });
});

it.each([
  ["Asia/Tokyo", "2026-10-20T15:00:00.000Z", "2026-10-21T15:00:00.000Z", 24],
  ["America/New_York", "2026-03-08T05:00:00.000Z", "2026-03-09T04:00:00.000Z", 23],
  ["America/New_York", "2025-11-02T04:00:00.000Z", "2025-11-03T05:00:00.000Z", 25],
] as const)("%sの暦日 %s〜%s は%s時間でも一日", (zone, start, end, hours) => {
  const f = fixture(); f.definition.timeZone = zone; f.definition.bucketKind = "calendar_day"; rebind(f);
  f.request.period = { start, end }; f.observations = [{ ...f.observations[0], period: { start, end } }];
  expect(run(f)).toMatchObject({ status: "complete", total: 3, coveredDurationMs: hours * 3600000 });
});
it("暦日のtimezone不一致・不正timezoneを保留", () => {
  const f = fixture(); f.definition.bucketKind = "calendar_day"; rebind(f);
  expect(run(f)).toMatchObject({ reason: "CALENDAR_BUCKET_MISMATCH" });
  f.definition.timeZone = "INVALID/ZONE"; rebind(f);
  expect(run(f)).toMatchObject({ reason: "INVALID_METRIC_TIMEZONE" });
});
it.each(["first-midnight", "second-start", "second-end"])("午夜を繰り返す暦日 %s", key => {
  const f = fixture(); f.definition.bucketKind = "calendar_day"; f.definition.timeZone = "America/Havana"; rebind(f);
  const period = key === "second-end" ? { start: "2026-10-31T04:00:00.000Z", end: "2026-11-01T05:00:00.000Z" }
    : { start: key === "second-start" ? "2026-11-01T05:00:00.000Z" : "2026-11-01T04:00:00.000Z", end: "2026-11-02T05:00:00.000Z" };
  f.request.period = period; f.observations = [{ ...f.observations[0], period, observedAt: "2026-11-03T00:00:00.000Z" }];
  const result = run(f, "2026-11-03T00:00:00.000Z");
  expect(result).toMatchObject(key === "first-midnight" ? { status: "complete", total: 3, coveredDurationMs: 25 * 3600000 }
    : { status: "held", reason: "CALENDAR_BUCKET_MISMATCH" });
});
it("未知の生データ項目を受け入れず固定errorだけ返す", () => {
  const f = fixture();
  const result = summarizeMeasurements(f.request, f.definition, [{ ...f.observations[0], raw: "PRIVATE_CUSTOMER_DATA" }], now);
  expect(result).toEqual({ status: "held", executable: false, decisionEligible: false, reason: "INVALID_MEASUREMENT_INPUT", total: null });
});
