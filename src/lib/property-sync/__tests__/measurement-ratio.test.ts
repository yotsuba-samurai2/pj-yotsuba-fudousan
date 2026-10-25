import { expect, it } from "vitest";
import { calculateMeasurementRatio, type RatioPair, type RatioRequest, type RatioThreshold } from "../measurement-ratio";
import type { Measurement, MetricDefinition } from "../measurement-summary";
import { contentHash } from "../rules";

const now = "2026-10-24T12:00:00.000Z", start = "2026-10-21T00:00:00.000Z", middle = "2026-10-22T00:00:00.000Z", end = "2026-10-23T00:00:00.000Z";
const ref = (v: { id: string; version: number }) => ({ id: v.id, version: v.version, hash: contentHash(v) });
function fixture() {
  const scope: RatioPair["scope"] = { sourceRef: "synthetic-counter", media: "site", distribution: "consumer", market: "residential_rental",
    propertyId: "00000000-0000-4000-8000-000000000001", episodeId: "episode-1", device: "mobileWeb" };
  const definition = (id: string, metric: MetricDefinition["metric"]): MetricDefinition => ({ id, version: 1, sourceRef: scope.sourceRef,
    metric, valueKind: "interval_count", additivity: "additive", bucketKind: "interval", timeZone: "UTC",
    confirmation: "confirmed", confirmedAt: start, confirmationRef: "PRIVATE_DEFINITION" });
  const numeratorDefinition = definition("receipt", "receipts_saved"), denominatorDefinition = definition("attempt", "form_attempts");
  const validity = { confirmation: "confirmed" as const, confirmedAt: start, confirmationRef: "PRIVATE_CONFIRMATION", effectiveFrom: start, effectiveUntil: "2026-10-25T00:00:00.000Z" };
  const pair: RatioPair = { id: "synthetic-pair", version: 1, scope, numerator: ref(numeratorDefinition), denominator: ref(denominatorDefinition),
    ratioKind: "subset_rate", numeratorUnit: "events", denominatorUnit: "events", populationRef: "PRIVATE_POPULATION",
    countingPeriodRef: "PRIVATE_PERIOD", semanticsRef: "PRIVATE_SEMANTICS", ...validity };
  const threshold: RatioThreshold = { id: "synthetic-threshold", version: 1, pair: ref(pair), minimumDenominator: 1,
    durationBasis: "elapsed_time_ms", minimumDuration: 172800000, ...validity };
  const request: RatioRequest = { scope: structuredClone(scope), pair: ref(pair), threshold: ref(threshold), period: { start, end } };
  const observations = (d: MetricDefinition, values: number[], ids: number[]): Measurement[] => [start, middle].map((s, i) => ({
    observationId: `00000000-0000-4000-8000-00000000000${ids[i]}`, scope: structuredClone(scope), definition: ref(d), period: { start: s, end: i === 0 ? middle : end },
    observedAt: now, acquisition: "official_export", scopeConfirmed: true, evidenceRef: "PRIVATE_OBSERVATION", status: "observed", quality: "final", value: values[i] }));
  return { pair, threshold, request, numeratorDefinition, denominatorDefinition,
    numeratorObservations: observations(numeratorDefinition, [1, 9], [2, 3]), denominatorObservations: observations(denominatorDefinition, [1, 99], [4, 5]) };
}
type Fixture = ReturnType<typeof fixture>;
const run = (f = fixture()) => calculateMeasurementRatio(f.request, f.pair, f.threshold, f.numeratorDefinition, f.numeratorObservations, f.denominatorDefinition, f.denominatorObservations, now);
function rebind(f: Fixture) {
  f.pair.numerator = ref(f.numeratorDefinition); f.pair.denominator = ref(f.denominatorDefinition);
  for (const o of f.numeratorObservations) o.definition = ref(f.numeratorDefinition);
  for (const o of f.denominatorObservations) o.definition = ref(f.denominatorDefinition);
  f.request.pair = ref(f.pair); f.threshold.pair = ref(f.pair); f.request.threshold = ref(f.threshold);
}
function setValues(observations: Measurement[], values: number[]) {
  for (const [i, o] of observations.entries()) if (o.status === "observed") o.value = values[i];
}

it("区間割合の平均ではなく全期間の合計比、正確整数分数と近似を分離", () => {
  const f = fixture(), before = structuredClone(f), result = run(f);
  expect(result).toMatchObject({ status: "calculated", executable: false, decisionEligible: false, exactFraction: { numerator: "10", denominator: "100" },
    approximate: { ratio: 0.1, percentage: 10, arithmetic: "IEEE754", displayRoundingDigits: null },
    reference: { scope: f.request.scope, pair: f.request.pair, threshold: f.request.threshold, period: f.request.period,
      numeratorSummary: expect.stringMatching(/^[a-f0-9]{64}$/), denominatorSummary: expect.stringMatching(/^[a-f0-9]{64}$/) } });
  expect(f).toEqual(before); expect(JSON.stringify(result)).not.toMatch(/PRIVATE_|populationRef|semanticsRef|evidenceRef/);
});
it("0分子は有効な0、0分母は未定義", () => {
  const f = fixture(); setValues(f.numeratorObservations, [0, 0]);
  expect(run(f)).toMatchObject({ status: "calculated", exactFraction: { numerator: "0", denominator: "100" }, approximate: { ratio: 0 } });
  setValues(f.denominatorObservations, [0, 0]); expect(run(f)).toMatchObject({ status: "held", reason: "ZERO_DENOMINATOR", approximate: null });
});
it("部分集合の超過を100%に丸めず保留、一般の比率は1超を保持", () => {
  const f = fixture(); setValues(f.numeratorObservations, [2, 198]);
  expect(run(f)).toMatchObject({ reason: "SUBSET_EXCEEDS_DENOMINATOR" });
  f.pair.ratioKind = "event_ratio"; rebind(f);
  expect(run(f)).toMatchObject({ status: "calculated", approximate: { ratio: 2, percentage: null } });
});
it("部分集合には一致する単位が必要", () => {
  const f = fixture(); f.pair.numeratorUnit = "people"; rebind(f);
  expect(run(f)).toMatchObject({ reason: "INVALID_RATIO_INPUT" });
});

it.each(["pair-version", "pair-hash", "threshold-version", "threshold-pair"])("%sの取り違えを拒否", key => {
  const f = fixture();
  if (key === "pair-version") f.request.pair.version++;
  if (key === "pair-hash") f.request.pair.hash = "a".repeat(64);
  if (key === "threshold-version") f.threshold.version++;
  if (key === "threshold-pair") { f.threshold.pair.hash = "a".repeat(64); f.request.threshold = ref(f.threshold); }
  expect(run(f)).toMatchObject({ reason: "RATIO_REFERENCE_MISMATCH" });
});
it("定義が変わったら元のpairで計算しない", () => {
  const f = fixture(); f.numeratorDefinition.version++;
  expect(run(f)).toMatchObject({ reason: "NUMERATOR_INCOMPLETE" });
});
it("pairの対象端末が違えば分子分母一致でも拒否", () => {
  const f = fixture(); f.pair.scope.device = "pc"; rebind(f);
  expect(run(f)).toMatchObject({ reason: "RATIO_SCOPE_MISMATCH" });
});

it.each(["population", "period", "semantics", "unconfirmed", "no-reference", "future", "expired", "not-started"])("組合せの%sが未確定/無効なら保留", key => {
  const f = fixture();
  if (key === "population") f.pair.populationRef = null;
  if (key === "period") f.pair.countingPeriodRef = null;
  if (key === "semantics") f.pair.semanticsRef = null;
  if (key === "unconfirmed") f.pair.confirmation = "unconfirmed";
  if (key === "no-reference") f.pair.confirmationRef = null;
  if (key === "future") f.pair.confirmedAt = "2026-10-24T13:00:00.000Z";
  if (key === "expired") f.pair.effectiveUntil = now;
  if (key === "not-started") f.pair.effectiveFrom = "2026-10-24T13:00:00.000Z";
  rebind(f); expect(run(f)).toMatchObject({ reason: "RATIO_PAIR_UNCONFIRMED" });
});

it.each(["denominator", "duration", "basis", "unconfirmed", "expired", "future"])("最低条件の%sが未確定/無効なら推定値を使わない", key => {
  const f = fixture();
  if (key === "denominator") f.threshold.minimumDenominator = null;
  if (key === "duration") f.threshold.minimumDuration = null;
  if (key === "basis") f.threshold.durationBasis = "unknown";
  if (key === "unconfirmed") f.threshold.confirmation = "unconfirmed";
  if (key === "expired") f.threshold.effectiveUntil = now;
  if (key === "future") f.threshold.confirmedAt = "2026-10-24T13:00:00.000Z";
  rebind(f); expect(run(f)).toMatchObject({ reason: "RATIO_THRESHOLD_UNCONFIRMED" });
});
it("最低分母・経過時間の境界は設定を用い、未達を保留", () => {
  const f = fixture(); f.threshold.minimumDenominator = 100; rebind(f); expect(run(f)).toMatchObject({ status: "calculated" });
  f.threshold.minimumDenominator = 101; rebind(f); expect(run(f)).toMatchObject({ reason: "DENOMINATOR_BELOW_THRESHOLD" });
  f.threshold.minimumDenominator = 100; f.threshold.minimumDuration = 172800001; rebind(f);
  expect(run(f)).toMatchObject({ reason: "DURATION_BELOW_THRESHOLD" });
});

it.each(["numerator", "denominator"])("%sの欠測を既知小計で補わない", key => {
  const f = fixture(); if (key === "numerator") f.numeratorObservations.pop(); else f.denominatorObservations.pop();
  expect(run(f)).toMatchObject({ reason: key === "numerator" ? "NUMERATOR_INCOMPLETE" : "DENOMINATOR_INCOMPLETE", exactFraction: null });
});
it.each(["device", "source", "episode", "distribution", "period", "provisional", "non-additive"])("分子の%s不整合を推測配賦しない", key => {
  const f = fixture(), o = f.numeratorObservations[0];
  if (key === "device") o.scope.device = "unknown";
  if (key === "source") o.scope.sourceRef = "crm";
  if (key === "episode") o.scope.episodeId = "other-episode";
  if (key === "distribution") o.scope.distribution = "broker";
  if (key === "period") o.period.start = "2026-10-21T01:00:00.000Z";
  if (key === "provisional" && o.status === "observed") o.quality = "provisional";
  if (key === "non-additive") { f.numeratorDefinition.additivity = "non_additive"; rebind(f); }
  expect(run(f)).toMatchObject({ reason: "NUMERATOR_INCOMPLETE" });
});
it("同じUTC区間でも暦の定義timezoneが異なるなら比率にしない", () => {
  const f = fixture(); f.denominatorDefinition.timeZone = "Asia/Tokyo"; rebind(f);
  expect(run(f)).toMatchObject({ reason: "RATIO_TIMEZONE_MISMATCH" });
});
it("summaryのcomplete自己申告を観測入力として受け入れない", () => {
  const f = fixture();
  expect(calculateMeasurementRatio(f.request, f.pair, f.threshold, f.numeratorDefinition, { status: "complete", total: 10 },
    f.denominatorDefinition, f.denominatorObservations, now)).toMatchObject({ reason: "NUMERATOR_INCOMPLETE" });
});
it("1/3の正確分数は近似表示に置換せず保持", () => {
  const f = fixture(); setValues(f.numeratorObservations, [1, 0]); setValues(f.denominatorObservations, [1, 2]);
  expect(run(f)).toMatchObject({ status: "calculated", exactFraction: { numerator: "1", denominator: "3" }, approximate: { ratio: 1 / 3 } });
});
