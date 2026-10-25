import { expect, it } from "vitest";
import { placementReference, summarizePlacementCoverage, type PlacementPlan, type PlacementObservation } from "../placement-coverage";

const now = "2026-10-24T12:00:00.000Z";
const at = (hour: number) => `2026-10-24T${String(hour).padStart(2, "0")}:00:00.000Z`;
function fixture() {
  const plan: PlacementPlan = { id: "synthetic-plan", version: 1, createdAt: at(1), confirmedAt: at(1), confirmationRef: "PRIVATE_PLAN",
    target: { propertyId: "00000000-0000-4000-8000-000000000001", episodeId: "episode-1", media: "athome", listingRevision: 2,
      listingHash: "a".repeat(64), companyRef: "synthetic-company", officeRef: "synthetic-office", surface: "mobileWeb" },
    context: { id: "synthetic-context", version: 1, distribution: "consumer", loginState: "anonymous", regionRef: "synthetic-region",
      filtersRef: "no-filter", sortRef: "synthetic-sort", queryRef: "same-unit-query", confirmation: "confirmed", confirmedAt: at(0), confirmationRef: "PRIVATE_CONTEXT" },
    period: { start: at(2), end: at(8) }, slots: [2, 4, 6].map(n => ({ id: `slot-${n}`, period: { start: at(n), end: at(n + 1) } })) };
  const expected = placementReference(plan);
  const observations: PlacementObservation[] = plan.slots.slice(0, 2).map((slot, i) => ({ id: `observation-${i}`, evidenceRef: `PRIVATE_EVIDENCE_${i}`, slotId: slot.id,
    scope: { target: structuredClone(plan.target), context: placementReference(plan.context) }, observedAt: slot.period.start, receivedAt: at(9),
    acquisition: "manual_confirmed", authorizationRef: "PRIVATE_AUTHORIZATION", outcome: "read", visibility: "published", exactUnitConfirmed: true,
    targetCompanyConfirmed: true, contentHash: "b".repeat(64), listKind: "same_unit_company_list", companyFirst: i === 0 ? "yes" : "no" }));
  return { plan, expected, observations };
}
const run = (f = fixture(), clock = now) => summarizePlacementCoverage(f.plan, f.expected, f.observations, clock);
function rebind(f: ReturnType<typeof fixture>) {
  f.expected = placementReference(f.plan);
  for (const o of f.observations) o.scope = { target: structuredClone(f.plan.target), context: placementReference(f.plan.context) };
}

it("予定3・有効2・先頭1を分け、欠測を非先頭にしない", () => {
  const f = fixture(), before = structuredClone(f), result = run(f);
  expect(result).toMatchObject({ status: "summarized", executable: false, decisionEligible: false, periodEnded: true,
    expectedSlots: 3, validObservedSlots: 2, firstSlots: 1, notFirstSlots: 1, missing: [{ slotId: "slot-6", reason: "NOT_OBSERVED" }],
    observationCoverage: { numerator: "2", denominator: "3", approximate: 2 / 3 }, firstShareAmongValid: { numerator: "1", denominator: "2", approximate: 0.5 },
    reference: { plan: f.expected, scope: f.observations[0].scope, period: f.plan.period } });
  expect(f).toEqual(before); expect(run({ ...f, observations: [...f.observations].reverse() })).toEqual(result);
  expect(JSON.stringify(result)).not.toMatch(/PRIVATE_|evidenceRef|authorizationRef|confirmationRef/);
});
it("全欠測は有効観測0・先頭割合null、充足率0を保持", () => {
  const f = fixture(); f.observations = [];
  expect(run(f)).toMatchObject({ validObservedSlots: 0, firstSlots: 0, notFirstSlots: 0,
    observationCoverage: { numerator: "0", denominator: "3", approximate: 0 }, firstShareAmongValid: null });
});

it.each(["late-plan", "late-confirmation", "no-confirmation", "before-create", "open-period"])("観測計画の%sを保留", key => {
  const f = fixture();
  if (key === "late-plan") f.plan.createdAt = at(3);
  if (key === "late-confirmation") f.plan.confirmedAt = at(3);
  if (key === "no-confirmation") f.plan.confirmationRef = null;
  if (key === "before-create") f.plan.confirmedAt = at(0);
  if (key === "open-period") f.plan.period.end = at(13);
  rebind(f); expect(run(f)).toMatchObject({ reason: key === "open-period" ? "PLACEMENT_PERIOD_NOT_ENDED" : "PLAN_NOT_CONFIRMED_BEFORE_START" });
});
it("結果を見てslotを減らした計画は元hashと一致しない", () => {
  const f = fixture(); f.plan.slots.pop(); expect(run(f)).toMatchObject({ reason: "PLACEMENT_PLAN_MISMATCH" });
});
it.each(["duplicate-id", "overlap", "outside", "empty"])("予定slotの%sを許さない", key => {
  const f = fixture();
  if (key === "duplicate-id") f.plan.slots[1].id = f.plan.slots[0].id;
  if (key === "overlap") f.plan.slots[1].period.start = at(2);
  if (key === "outside") f.plan.slots[2].period.end = at(9);
  if (key === "empty") f.plan.slots = [];
  rebind(f); expect(run(f)).toMatchObject({ status: "held" });
});

it.each(["unconfirmed", "login-unknown", "region", "filters", "sort", "query", "future-confirmation"])("観測contextの%sを既定値で埋めない", key => {
  const f = fixture(), c = f.plan.context;
  if (key === "unconfirmed") c.confirmation = "unconfirmed";
  if (key === "login-unknown") c.loginState = "unknown";
  if (key === "region") c.regionRef = null;
  if (key === "filters") c.filtersRef = null;
  if (key === "sort") c.sortRef = null;
  if (key === "query") c.queryRef = null;
  if (key === "future-confirmation") c.confirmedAt = at(2);
  rebind(f); expect(run(f)).toMatchObject({ reason: "PLACEMENT_CONTEXT_UNCONFIRMED" });
});
it.each(["property", "episode", "listing", "hash", "company", "office", "surface", "context"])("観測%sの不一致を拒否", key => {
  const f = fixture(), scope = f.observations[0].scope;
  if (key === "property") scope.target.propertyId = "00000000-0000-4000-8000-000000000099";
  if (key === "episode") scope.target.episodeId = "episode-2";
  if (key === "listing") scope.target.listingRevision++;
  if (key === "hash") scope.target.listingHash = "c".repeat(64);
  if (key === "company") scope.target.companyRef = "other-company";
  if (key === "office") scope.target.officeRef = "other-office";
  if (key === "surface") scope.target.surface = "pc";
  if (key === "context") scope.context.hash = "c".repeat(64);
  expect(run(f)).toMatchObject({ reason: "PLACEMENT_SCOPE_MISMATCH" });
});

it.each(["before-slot", "at-end", "receipt-before-observed", "future-receipt", "unknown-slot"])("時刻・対応%sを拒否", key => {
  const f = fixture(), o = f.observations[0];
  if (key === "before-slot") o.observedAt = at(1);
  if (key === "at-end") o.observedAt = at(3);
  if (key === "receipt-before-observed") o.receivedAt = at(1);
  if (key === "future-receipt") o.receivedAt = at(13);
  if (key === "unknown-slot") o.slotId = "not-planned";
  expect(run(f)).toMatchObject({ reason: key === "unknown-slot" ? "UNKNOWN_PLACEMENT_SLOT" : "INVALID_PLACEMENT_OBSERVATION_TIME" });
});
it("同ID・同内容の再送のみdedup", () => {
  const f = fixture(); f.observations.push(structuredClone(f.observations[0])); expect(run(f)).toMatchObject({ validObservedSlots: 2, ignoredDuplicates: 1 });
  f.observations[2].receivedAt = at(10); expect(run(f)).toMatchObject({ reason: "PLACEMENT_OBSERVATION_ID_CONFLICT" });
});
it("別slotで同一証跡を使い回さない", () => {
  const f = fixture(); f.observations[1].evidenceRef = f.observations[0].evidenceRef;
  expect(run(f)).toMatchObject({ reason: "PLACEMENT_EVIDENCE_REUSED" });
});
it("同slotの別観測を最新優先で採用しない", () => {
  const f = fixture(), clone = structuredClone(f.observations[0]); clone.id = "another"; clone.evidenceRef = "another"; f.observations.push(clone);
  expect(run(f)).toMatchObject({ reason: "PLACEMENT_SLOT_CONFLICT" });
});

it.each([
  ["mock", "UNVERIFIED_ACQUISITION"], ["authorization", "UNVERIFIED_ACQUISITION"], ["visibility", "VISIBILITY_UNKNOWN"],
  ["not-published", "NOT_PUBLISHED"], ["unit", "UNIT_UNCONFIRMED"], ["company", "TARGET_COMPANY_UNCONFIRMED"],
  ["content", "CONTENT_UNVERIFIED"], ["search-rank", "NOT_SAME_UNIT_COMPANY_LIST"], ["first-unknown", "COMPANY_FIRST_UNKNOWN"],
])( "%sを先頭/非先頭へ補完しない", (key, reason) => {
  const f = fixture(), o = f.observations[0]; if (o.outcome !== "read") throw new Error("fixture");
  if (key === "mock") o.acquisition = "mock";
  if (key === "authorization") o.authorizationRef = null;
  if (key === "visibility") o.visibility = "unknown";
  if (key === "not-published") o.visibility = "not_published";
  if (key === "unit") o.exactUnitConfirmed = false;
  if (key === "company") o.targetCompanyConfirmed = false;
  if (key === "content") o.contentHash = null;
  if (key === "search-rank") o.listKind = "search_results";
  if (key === "first-unknown") o.companyFirst = "unknown";
  expect(run(f)).toMatchObject({ validObservedSlots: 1, firstSlots: 0, notFirstSlots: 1, missing: [{ slotId: "slot-2", reason }, { slotId: "slot-6", reason: "NOT_OBSERVED" }] });
});
it.each(["failure", "not-found"])("%sの理由を保持し非先頭に数えない", kind => {
  const f = fixture(), o = f.observations[0];
  const common = { id: o.id, evidenceRef: o.evidenceRef, slotId: o.slotId, scope: o.scope, observedAt: o.observedAt,
    receivedAt: o.receivedAt, acquisition: o.acquisition, authorizationRef: o.authorizationRef };
  f.observations[0] = kind === "failure" ? { ...common, outcome: "read_failure", reason: "captcha" }
    : { ...common, outcome: "not_found", searchCoverage: "complete" };
  expect(run(f)).toMatchObject({ validObservedSlots: 1, notFirstSlots: 1,
    missing: [{ slotId: "slot-2", reason: kind === "failure" ? "READ_FAILURE_CAPTCHA" : "TARGET_NOT_FOUND_COMPLETE" }, { slotId: "slot-6", reason: "NOT_OBSERVED" }] });
});
it("過剰入力・未知の生本文を固定エラーで拒否", () => {
  const f = fixture(); expect(run({ ...f, observations: Array(4001).fill(f.observations[0]) })).toMatchObject({ reason: "OBSERVATION_LIMIT" });
  expect(summarizePlacementCoverage(f.plan, f.expected, [{ ...f.observations[0], html: "PRIVATE_RAW_HTML" }], now)).toEqual({
    status: "held", executable: false, decisionEligible: false, reason: "INVALID_PLACEMENT_INPUT" });
});
