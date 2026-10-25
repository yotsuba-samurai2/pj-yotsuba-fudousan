import { expect, it } from "vitest";
import { contentHash, type SyncRule } from "../rules";
import { evaluateRentalFields, type RentalEvaluationPolicy, type RentalFieldEvidence } from "../rental-field-evaluation";
import { schoolDatasetReference, type SchoolDataset, type SchoolEvidenceRequest, type NormalizedSchoolAddress } from "../school-evidence";

const now = "2026-10-25T00:30:00.000Z";
function fixture() {
  const scope = { market: "residential_rental" as const, audience: "global" as const, clientRef: null };
  const rule: SyncRule = { id: "synthetic-rule", version: 1, scope, effectiveFrom: "2026-10-25T00:00:00.000Z", effectiveUntil: null,
    status: "approved", approvedAt: "2026-10-25T00:00:00.000Z", approvalRef: "PRIVATE_APPROVAL",
    criteria: { market: "residential_rental", rentMinYen: 100, rentMaxYen: 200, minLayoutRooms: 2, preferredAreaSqm: 54.5,
      leaseTypes: ["ordinary"], schoolScopeRef: "PRIVATE_SCHOOL", companyIncomeMinYen: 12345, incomeTaxBasis: "included", maxEvidenceAgeHours: 1 } };
  const policy: RentalEvaluationPolicy = { id: "synthetic-policy", version: 1, scope, ruleHash: contentHash(rule), effectiveFrom: rule.effectiveFrom,
    effectiveUntil: null, status: "approved", approvedAt: rule.approvedAt, approvalRef: "PRIVATE_POLICY_APPROVAL",
    rentBasis: "rent_only", minimumInclusive: true, maximumInclusive: true, roomCountBasis: "main_rooms_excluding_service_rooms",
    allowedKitchens: ["DK", "LDK"], normalizationContractRef: "PRIVATE_NORMALIZATION" };
  const evidence: RentalFieldEvidence = { binding: { propertyId: "9fc8c3fc-d047-4520-b5d5-1b6b5c70ba71", episodeId: "synthetic-episode" }, sourceHash: "a".repeat(64),
    observedAt: "2026-10-25T00:00:00.000Z", normalization: "confirmed", normalizationContractRef: policy.normalizationContractRef,
    rentYen: 150, managementYen: null, mainRooms: 2, kitchen: "DK", areaSqm: 54.5, leaseType: "ordinary" };
  return { rule, policy, evidence };
}
function request(f: ReturnType<typeof fixture>) { return { scope: f.rule.scope, binding: f.evidence.binding, sourceHash: f.evidence.sourceHash,
  expectedRuleHash: contentHash(f.rule), expectedPolicyHash: contentHash(f.policy), expectedEvidenceHash: contentHash(f.evidence), asOf: now }; }
function run(f: ReturnType<typeof fixture>) { return evaluateRentalFields(request(f), [f.rule], [f.policy], f.evidence); }

it("設定範囲のfield一致を全体適合/実行許可へ昇格せず内部値を返さない", () => {
  const result = run(fixture());
  expect(result).toMatchObject({ status: "evaluated", fieldVerdict: "matched", areaPreference: "met", executable: false, eligibilityConfirmed: false,
    checks: { rent: "matched", mainRooms: "matched", kitchen: "matched", leaseType: "matched" } });
  expect(JSON.stringify(result)).not.toMatch(/PRIVATE_|12345|rentMinYen|rentYen|companyIncome|propertyId|episodeId/);
});
it.each([{ rent: 99, expected: "outside" }, { rent: 100, expected: "matched" }, { rent: 200, expected: "matched" }, { rent: 201, expected: "outside" }])("賃料$rentを設定境界で判定", ({ rent, expected }) => {
  const f = fixture(); f.evidence.rentYen = rent; expect(run(f)).toMatchObject({ checks: { rent: expected } });
});
it("境界の包含/非包含も明示設定だけに従う", () => {
  const f = fixture(); f.evidence.rentYen = 100; f.policy.minimumInclusive = false;
  expect(run(f)).toMatchObject({ checks: { rent: "outside" } });
  f.evidence.rentYen = 200; f.policy.maximumInclusive = false;
  expect(run(f)).toMatchObject({ checks: { rent: "outside" } });
});
it("管理費別/込みの意味を固定し欠測を0にしない", () => {
  const f = fixture(); f.evidence.managementYen = 60;
  expect(run(f)).toMatchObject({ checks: { rent: "matched" } });
  f.policy.rentBasis = "rent_plus_management"; expect(run(f)).toMatchObject({ checks: { rent: "outside" } });
  f.evidence.managementYen = null; expect(run(f)).toMatchObject({ checks: { rent: "unknown" }, fieldVerdict: "unknown" });
  f.evidence.managementYen = 0; expect(run(f)).toMatchObject({ checks: { rent: "matched" } });
});
it("合算でsafe integerを越えても丸めず上限外とする", () => {
  const f = fixture(); if (f.rule.criteria.market !== "residential_rental") throw new Error();
  f.rule.criteria.rentMaxYen = Number.MAX_SAFE_INTEGER; f.policy.ruleHash = contentHash(f.rule);
  f.policy.rentBasis = "rent_plus_management"; f.evidence.rentYen = Number.MAX_SAFE_INTEGER; f.evidence.managementYen = 1;
  expect(run(f)).toMatchObject({ checks: { rent: "outside" } });
});
it.each([{ rooms: 1, kitchen: "LDK" as const, roomsExpected: "outside", kitchenExpected: "matched" },
  { rooms: 2, kitchen: "K" as const, roomsExpected: "matched", kitchenExpected: "outside" },
  { rooms: 2, kitchen: "DK" as const, roomsExpected: "matched", kitchenExpected: "matched" },
  { rooms: 2, kitchen: "LDK" as const, roomsExpected: "matched", kitchenExpected: "matched" }])("$rooms$kitchenを部屋数とkitchenで分離", ({ rooms, kitchen, roomsExpected, kitchenExpected }) => {
  const f = fixture(); f.evidence.mainRooms = rooms; f.evidence.kitchen = kitchen;
  expect(run(f)).toMatchObject({ checks: { mainRooms: roomsExpected, kitchen: kitchenExpected } });
});
it("1SLDKのservice roomをmainRoomsへ加算しない。未構造化値も受理しない", () => {
  const f = fixture(); f.evidence.mainRooms = 1; f.evidence.kitchen = "LDK";
  expect(run(f)).toMatchObject({ checks: { mainRooms: "outside" } });
  expect(evaluateRentalFields(request(f), [f.rule], [f.policy], { ...f.evidence, layout: "1SLDK" })).toMatchObject({ reason: "INVALID_RENTAL_EVALUATION_INPUT" });
});
it("可能なら面積以上という希望は未達/欠測でも必須条件へ変えない", () => {
  const f = fixture(); f.evidence.areaSqm = 54.49; expect(run(f)).toMatchObject({ fieldVerdict: "matched", areaPreference: "below_preference" });
  f.evidence.areaSqm = null; expect(run(f)).toMatchObject({ fieldVerdict: "matched", areaPreference: "unknown" });
  if (f.rule.criteria.market !== "residential_rental") throw new Error();
  f.rule.criteria.preferredAreaSqm = null; f.policy.ruleHash = contentHash(f.rule);
  expect(run(f)).toMatchObject({ fieldVerdict: "matched", areaPreference: "not_configured" });
});
it("定借は明示した現行ルールに含むときだけ一致", () => {
  const f = fixture(); f.evidence.leaseType = "fixed"; expect(run(f)).toMatchObject({ checks: { leaseType: "outside" } });
  if (f.rule.criteria.market !== "residential_rental") throw new Error();
  f.rule.criteria.leaseTypes = ["ordinary", "fixed"]; f.policy.ruleHash = contentHash(f.rule);
  expect(run(f)).toMatchObject({ checks: { leaseType: "matched" } });
});
it.each(["rentYen", "mainRooms", "kitchen", "leaseType"] as const)("必須field %s欠測はunknown", key => {
  const f = fixture(); f.evidence[key] = null; expect(run(f)).toMatchObject({ fieldVerdict: "unknown" });
});
it("明確な不適合と未知を両方残す", () => {
  const f = fixture(); f.evidence.rentYen = 99; f.evidence.leaseType = null;
  expect(run(f)).toMatchObject({ fieldVerdict: "outside", checks: { rent: "outside", leaseType: "unknown" } });
});
it.each(["rentBasis", "minimumInclusive", "maximumInclusive", "roomCountBasis", "allowedKitchens", "normalizationContractRef"] as const)("未確定意味%sを推測しない", key => {
  const f = fixture(); f.policy[key] = null; expect(run(f)).toMatchObject({ reason: "EVALUATION_SEMANTICS_UNRESOLVED" });
});
it("新pending/revoked/expired policyから古い承認版へfallbackしない", () => {
  const f = fixture();
  for (const variant of [{ status: "pending" as const }, { status: "revoked" as const }, { effectiveUntil: now }]) {
    const next = { ...f.policy, version: 2, ...variant };
    expect(evaluateRentalFields(request(f), [f.rule], [f.policy, next], f.evidence)).toMatchObject({ status: "held" });
  }
});
it("同版重複・複数family・版と時系列の逆転を保留", () => {
  const f = fixture();
  for (const next of [f.policy, { ...f.policy, id: "other" }, { ...f.policy, version: 2, effectiveFrom: "2026-10-24T23:00:00.000Z" }]) {
    expect(evaluateRentalFields(request(f), [f.rule], [f.policy, next], f.evidence)).toMatchObject({ status: "held" });
  }
});
it("個別顧客ルール/意味設定を全体へ継承せず他市場も対象外", () => {
  const f = fixture(), r = request(f), client = { ...f.rule.scope, audience: "client" as const, clientRef: "synthetic-client" };
  expect(evaluateRentalFields(r, [{ ...f.rule, scope: client }], [f.policy], f.evidence)).toMatchObject({ reason: "NO_EFFECTIVE_RULE" });
  expect(evaluateRentalFields(r, [f.rule], [{ ...f.policy, scope: client }], f.evidence)).toMatchObject({ reason: "NO_EFFECTIVE_EVALUATION_POLICY" });
  expect(evaluateRentalFields({ ...r, scope: { ...r.scope, market: "sale" } }, [f.rule], [f.policy], f.evidence)).toMatchObject({ reason: "RENTAL_EVALUATION_MARKET_UNSUPPORTED" });
});
it("ルール/意味設定/物件/募集回/source/証拠の差替えを保留", () => {
  const f = fixture(), r = request(f);
  for (const changed of [{ ...r, expectedRuleHash: "b".repeat(64) }, { ...r, expectedPolicyHash: "b".repeat(64) },
    { ...r, expectedEvidenceHash: "b".repeat(64) }, { ...r, sourceHash: "b".repeat(64) },
    { ...r, binding: { ...r.binding, episodeId: "other-episode" } },
    { ...r, binding: { ...r.binding, propertyId: "9fc8c3fc-d047-4520-b5d5-1b6b5c70ba72" } }]) {
    expect(evaluateRentalFields(changed, [f.rule], [f.policy], f.evidence)).toMatchObject({ status: "held" });
  }
});
it("最新ルール値変更と意味設定のrule pin変更漏れを保留", () => {
  const f = fixture(), r = request(f); if (f.rule.criteria.market !== "residential_rental") throw new Error();
  f.rule.criteria.rentMaxYen = 199;
  expect(evaluateRentalFields(r, [f.rule], [f.policy], f.evidence)).toMatchObject({ reason: "EVALUATION_RULE_CHANGED" });
  expect(run(f)).toMatchObject({ reason: "EVALUATION_POLICY_CHANGED" });
  f.rule.criteria.rentMaxYen = null; expect(run(f)).toMatchObject({ reason: "RULE_SETTINGS_UNRESOLVED" });
});
it("正規化未確認/別の変換契約は保留", () => {
  const f = fixture(); f.evidence.normalization = "unconfirmed"; expect(run(f)).toMatchObject({ reason: "RENTAL_NORMALIZATION_UNCONFIRMED" });
  f.evidence.normalization = "confirmed"; f.evidence.normalizationContractRef = "other";
  expect(run(f)).toMatchObject({ reason: "RENTAL_NORMALIZATION_UNCONFIRMED" });
});
it("未来の観測・鮮度期限ちょうどは保留、1ms前は評価可能", () => {
  const f = fixture(); f.evidence.observedAt = "2026-10-25T00:30:00.001Z"; expect(run(f)).toMatchObject({ reason: "RENTAL_EVIDENCE_FROM_FUTURE" });
  f.evidence.observedAt = "2026-10-24T23:30:00.000Z"; expect(run(f)).toMatchObject({ reason: "RENTAL_EVIDENCE_EXPIRED" });
  f.evidence.observedAt = "2026-10-24T23:30:00.001Z"; expect(run(f)).toMatchObject({ status: "evaluated" });
});
it("金額の小数/negative/unsafeと余剰内部情報を入力拒否", () => {
  const f = fixture();
  for (const bad of [{ ...f.evidence, rentYen: 1.1 }, { ...f.evidence, rentYen: -1 }, { ...f.evidence, rentYen: Number.MAX_SAFE_INTEGER + 1 },
    { ...f.evidence, adNote: "PRIVATE_AD" }, { ...f.evidence, areaSqm: Infinity }]) {
    expect(evaluateRentalFields(request(f), [f.rule], [f.policy], bad)).toMatchObject({ reason: "INVALID_RENTAL_EVALUATION_INPUT" });
  }
});
it("設定時間をmsへ変換してInfinity/安全な表現範囲外になったら無期限として扱わない", () => {
  const f = fixture(); if (f.rule.criteria.market !== "residential_rental") throw new Error();
  for (const hours of [Number.MAX_VALUE, Number.MAX_SAFE_INTEGER]) {
    f.rule.criteria.maxEvidenceAgeHours = hours; f.policy.ruleHash = contentHash(f.rule);
    expect(run(f)).toMatchObject({ reason: "RENTAL_EVIDENCE_AGE_UNREPRESENTABLE" });
  }
});

function extendedFixture() {
  const f = fixture();
  f.policy.additionalChecks = {
    minimumArea: { mainRoomsAtLeast: 2, kitchens: ["DK", "LDK"], sqm: 54.5 },
    propertyUpdateWindow: { maxAgeHours: 336, boundary: "inclusive", basis: "elapsed_time" },
    incomeBasis: "company_total_including_ad",
  };
  f.evidence.sourcePropertyUpdate = { updatedAt: "2026-10-11T00:30:00.000Z", evidenceRef: "PRIVATE_UPDATE", basis: "source_listing_update" };
  const income = { binding: f.evidence.binding, sourceHash: f.evidence.sourceHash, observedAt: f.evidence.observedAt,
    normalization: "confirmed", normalizationContractRef: f.policy.normalizationContractRef, evidenceRef: "PRIVATE_INCOME",
    totalYen: 12345 as number | null, basis: "company_total_including_ad", taxBasis: "included", certainty: "confirmed" };
  return { f, income };
}
function runExtended(x: ReturnType<typeof extendedFixture>) {
  return evaluateRentalFields({ ...request(x.f), expectedIncomeEvidenceHash: contentHash(x.income) }, [x.f.rule], [x.f.policy], x.f.evidence, x.income);
}

function incomeSelectionFixture() {
  const x = extendedFixture(), c = x.f.rule.criteria;
  if (c.market !== "residential_rental") throw new Error();
  c.rentSelectionBasis = "company_income_total"; c.rentMinYen = null; c.rentMaxYen = null; c.minLayoutRooms = 1;
  x.f.policy.ruleHash = contentHash(x.f.rule);
  x.f.policy.layoutAlternatives = [
    { minimumMainRooms: 1, maximumMainRooms: 1, kitchens: ["LDK"] },
    { minimumMainRooms: 2, maximumMainRooms: null, kitchens: ["DK", "LDK"] },
  ];
  return x;
}

it("総額基準を明示した版は例示賃料を上限にせず、面積小の1LDKも報酬等で照合", () => {
  const x = incomeSelectionFixture(); x.f.evidence.mainRooms = 1; x.f.evidence.kitchen = "LDK"; x.f.evidence.areaSqm = 19;
  for (const rent of [1, 201, 900000]) {
    x.f.evidence.rentYen = rent; x.f.evidence.managementYen = null;
    expect(runExtended(x)).toMatchObject({ fieldVerdict: "matched", checks: { rent: "not_applicable", layoutAlternative: "matched", minimumArea: "not_applicable", internalIncome: "matched" } });
  }
  x.income.totalYen = 12344;
  expect(runExtended(x)).toMatchObject({ fieldVerdict: "outside", checks: { internalIncome: "outside" } });
  x.income.totalYen = null;
  expect(runExtended(x)).toMatchObject({ fieldVerdict: "unknown", checks: { internalIncome: "unknown" } });
});
it("総額基準は欠測賃料を既知扱いせず、報酬チェック未設定・旧範囲の残存も拒否", () => {
  const x = incomeSelectionFixture(); x.f.evidence.rentYen = null;
  expect(runExtended(x)).toMatchObject({ checks: { rent: "unknown" }, fieldVerdict: "unknown" });
  x.f.policy.additionalChecks = undefined;
  expect(runExtended(x)).toMatchObject({ reason: "INCOME_SELECTION_NOT_CONFIGURED" });
  if (x.f.rule.criteria.market !== "residential_rental") throw new Error();
  x.f.rule.criteria.rentMinYen = 100;
  expect(runExtended(x)).toMatchObject({ reason: "INVALID_RULE_INPUT" });
});
it("1LDK追加で1DK/3Kを採用せず、2DK以上の最低面積と欠測を維持", () => {
  const x = incomeSelectionFixture();
  for (const [rooms, kitchen] of [[1, "DK"], [3, "K"]] as const) {
    x.f.evidence.mainRooms = rooms; x.f.evidence.kitchen = kitchen;
    expect(runExtended(x)).toMatchObject({ fieldVerdict: "outside", checks: { layoutAlternative: "outside" } });
  }
  x.f.evidence.mainRooms = 2; x.f.evidence.kitchen = "DK";
  for (const [area, expected] of [[54.49, "outside"], [54.5, "matched"], [null, "unknown"]] as const) {
    x.f.evidence.areaSqm = area;
    expect(runExtended(x)).toMatchObject({ fieldVerdict: expected, checks: { minimumArea: expected } });
  }
  x.f.evidence.mainRooms = null;
  expect(runExtended(x)).toMatchObject({ checks: { layoutAlternative: "unknown" } });
});
it("間取りの代替集合は旧下限を免除せず、不正な範囲/重複kitchenを拒否", () => {
  const x = incomeSelectionFixture(); x.f.evidence.mainRooms = 1; x.f.evidence.kitchen = "LDK";
  if (x.f.rule.criteria.market !== "residential_rental") throw new Error();
  x.f.rule.criteria.minLayoutRooms = 2; x.f.policy.ruleHash = contentHash(x.f.rule);
  expect(runExtended(x)).toMatchObject({ checks: { mainRooms: "outside", layoutAlternative: "matched" }, fieldVerdict: "outside" });
  x.f.policy.layoutAlternatives![0].maximumMainRooms = 0;
  expect(runExtended(x)).toMatchObject({ reason: "INVALID_RENTAL_EVALUATION_INPUT" });
  x.f.policy.layoutAlternatives![0] = { minimumMainRooms: 2, maximumMainRooms: 1, kitchens: ["LDK"] };
  expect(runExtended(x)).toMatchObject({ reason: "INVALID_RENTAL_EVALUATION_INPUT" });
});

function schoolExceptionFixture() {
  const x = incomeSelectionFixture(); x.f.evidence.leaseType = "fixed";
  x.f.policy.fixedLeaseSchoolException = { municipalityRef: "synthetic-city", schoolRefs: ["school-a", "school-b", "school-c", "school-d"], academicYear: 2027, applicableOn: "2027-04-01" };
  const q: SchoolEvidenceRequest = { binding: { ...x.f.evidence.binding, sourceVersion: { fullHash: x.f.evidence.sourceHash, updatedAt: x.f.evidence.observedAt } },
    municipalityRef: "synthetic-city", schoolType: "elementary", academicYear: 2027, applicableOn: "2027-04-01" };
  const address: NormalizedSchoolAddress = { binding: structuredClone(q.binding), municipalityRef: q.municipalityRef, townRef: "PRIVATE_TOWN", chome: 2, ban: 3, go: 4,
    addressType: "residential_display", normalizedAt: x.f.evidence.observedAt,
    normalization: { version: 1, sourceAddressHash: "b".repeat(64), confirmation: "confirmed", confirmationRef: "PRIVATE_ADDRESS" } };
  const dataset: SchoolDataset = { id: "synthetic-dataset", version: 1,
    coverage: { municipalityRef: q.municipalityRef, townRef: address.townRef, chome: 2, schoolType: "elementary", academicYear: 2027, completeness: "confirmed", confirmationRef: "PRIVATE_COVERAGE" },
    effectiveFrom: "2027-04-01", effectiveUntil: "2028-04-01",
    source: { publisherRef: "synthetic-city", sourceRef: "PRIVATE_SOURCE", contentHash: "c".repeat(64), publicationDate: "2026-10-01", publicationTimeZone: "Asia/Tokyo",
      observedAt: "2026-10-23T00:00:00.000Z", authority: "municipal_official", acquisition: "manual_confirmed" },
    confirmation: "confirmed", confirmationRef: "PRIVATE_CONFIRMATION", confirmedAt: "2026-10-23T01:00:00.000Z",
    rows: [{ id: "row-1", schoolRef: "school-a", ban: { kind: "all" }, go: { kind: "all" }, boundary: "complete" }] };
  return { ...x, school: { request: q, address, dataset, expectedDataset: schoolDatasetReference(dataset) } };
}
function runSchool(x: ReturnType<typeof schoolExceptionFixture>) {
  return evaluateRentalFields({ ...request(x.f), expectedIncomeEvidenceHash: contentHash(x.income), expectedSchoolEvidenceHash: contentHash(x.school) },
    [x.f.rule], [x.f.policy], x.f.evidence, x.income, x.school);
}
it("設定4校の定借のみ既存学区照合を通し、別学区/別自治体へ拡大しない", () => {
  const x = schoolExceptionFixture();
  for (const schoolRef of x.f.policy.fixedLeaseSchoolException!.schoolRefs) {
    x.school.dataset.rows[0].schoolRef = schoolRef; x.school.expectedDataset = schoolDatasetReference(x.school.dataset);
    expect(runSchool(x)).toMatchObject({ fieldVerdict: "matched", checks: { leaseType: "matched" } });
  }
  x.school.dataset.rows[0].schoolRef = "other-school"; x.school.expectedDataset = schoolDatasetReference(x.school.dataset);
  expect(runSchool(x)).toMatchObject({ fieldVerdict: "outside", checks: { leaseType: "outside" } });
  x.school.dataset.rows[0].schoolRef = "school-a";
  x.school.request.municipalityRef = "other-city"; x.school.address.municipalityRef = "other-city"; x.school.dataset.coverage.municipalityRef = "other-city";
  x.school.expectedDataset = schoolDatasetReference(x.school.dataset);
  expect(runSchool(x)).toMatchObject({ checks: { leaseType: "outside" } });
});
it("普通借家は例外証拠なしで従来どおり、定借の証拠不足はunknown", () => {
  const x = schoolExceptionFixture();
  expect(runExtended(x)).toMatchObject({ fieldVerdict: "unknown", checks: { leaseType: "unknown" } });
  x.f.evidence.leaseType = "ordinary";
  expect(runExtended(x)).toMatchObject({ fieldVerdict: "matched", checks: { leaseType: "matched" } });
  expect(runSchool(x)).toMatchObject({ reason: "SCHOOL_EXCEPTION_EVIDENCE_NOT_APPLICABLE" });
  x.f.evidence.leaseType = "fixed"; x.f.policy.fixedLeaseSchoolException = undefined;
  expect(runSchool(x)).toMatchObject({ reason: "SCHOOL_EXCEPTION_EVIDENCE_NOT_APPLICABLE" });
  expect(runExtended(x)).toMatchObject({ checks: { leaseType: "outside" } });
});
it("全域の定借許可との競合・学校の重複設定・年度/日付未確定を保留", () => {
  const x = schoolExceptionFixture(); if (x.f.rule.criteria.market !== "residential_rental") throw new Error();
  x.f.rule.criteria.leaseTypes!.push("fixed"); x.f.policy.ruleHash = contentHash(x.f.rule);
  expect(runSchool(x)).toMatchObject({ reason: "FIXED_LEASE_SCOPE_CONFLICT" });
  x.f.rule.criteria.leaseTypes = ["ordinary"]; x.f.policy.ruleHash = contentHash(x.f.rule);
  x.f.policy.fixedLeaseSchoolException!.schoolRefs.push("school-a");
  expect(runSchool(x)).toMatchObject({ reason: "INVALID_RENTAL_EVALUATION_INPUT" });
  x.f.policy.fixedLeaseSchoolException!.schoolRefs.pop(); x.f.policy.fixedLeaseSchoolException!.academicYear = null;
  expect(runSchool(x)).toMatchObject({ reason: "SCHOOL_EXCEPTION_APPLICABILITY_UNRESOLVED" });
  x.f.policy.fixedLeaseSchoolException!.academicYear = 2027; x.f.policy.fixedLeaseSchoolException!.applicableOn = null;
  expect(runSchool(x)).toMatchObject({ reason: "SCHOOL_EXCEPTION_APPLICABILITY_UNRESOLVED" });
});
it("学区証拠の別物件/募集回/sourceを同一hashの自己申告でも受理しない", () => {
  for (const change of [{ propertyId: "9fc8c3fc-d047-4520-b5d5-1b6b5c70ba72" }, { episodeId: "other-episode" },
    { sourceVersion: { updatedAt: "2026-10-25T00:00:00.000Z", fullHash: "d".repeat(64) } }]) {
    const x = schoolExceptionFixture(); Object.assign(x.school.request.binding, change); x.school.address.binding = structuredClone(x.school.request.binding);
    expect(runSchool(x)).toMatchObject({ reason: "SCHOOL_EXCEPTION_BINDING_MISMATCH" });
  }
});
it("固定された年度/日付/学校種別が異なる学区証拠を採用しない", () => {
  for (const change of [{ academicYear: 2028 }, { applicableOn: "2027-04-02" }, { schoolType: "junior_high" as const }]) {
    const x = schoolExceptionFixture(); Object.assign(x.school.request, change); Object.assign(x.school.dataset.coverage, { academicYear: x.school.request.academicYear, schoolType: x.school.request.schoolType });
    x.school.expectedDataset = schoolDatasetReference(x.school.dataset);
    expect(runSchool(x)).toMatchObject({ reason: "SCHOOL_EXCEPTION_APPLICABILITY_MISMATCH" });
  }
});
it("学区表の曖昧境界・非公式根拠・古いhashを既存matcherで拒否", () => {
  const x = schoolExceptionFixture(); x.school.dataset.rows[0].boundary = "exception_unresolved"; x.school.expectedDataset = schoolDatasetReference(x.school.dataset);
  expect(runSchool(x)).toMatchObject({ reason: "SCHOOL_BOUNDARY_UNRESOLVED" });
  x.school.dataset.rows[0].boundary = "complete"; x.school.dataset.source.acquisition = "mock"; x.school.expectedDataset = schoolDatasetReference(x.school.dataset);
  expect(runSchool(x)).toMatchObject({ reason: "SCHOOL_SOURCE_UNCONFIRMED" });
  x.school.dataset.source.acquisition = "manual_confirmed";
  expect(runSchool(x)).toMatchObject({ reason: "SCHOOL_DATASET_REFERENCE_MISMATCH" });
});
it("学校証拠のpin欠落/差替え/完成結果の持込を拒否し、生住所/報酬を出力しない", () => {
  const x = schoolExceptionFixture(), before = structuredClone(x), result = runSchool(x);
  expect(result).toMatchObject({ fieldVerdict: "matched", executable: false, eligibilityConfirmed: false, reference: { schoolEvidenceHash: contentHash(x.school) } });
  expect(JSON.stringify(result)).not.toMatch(/PRIVATE_|12345|townRef|school-a|propertyId|episodeId|totalYen|sourceAddressHash/); expect(x).toEqual(before);
  const r = { ...request(x.f), expectedIncomeEvidenceHash: contentHash(x.income) };
  expect(evaluateRentalFields(r, [x.f.rule], [x.f.policy], x.f.evidence, x.income, x.school)).toMatchObject({ reason: "INVALID_SCHOOL_EXCEPTION_EVIDENCE" });
  expect(evaluateRentalFields({ ...r, expectedSchoolEvidenceHash: "f".repeat(64) }, [x.f.rule], [x.f.policy], x.f.evidence, x.income, x.school)).toMatchObject({ reason: "SCHOOL_EXCEPTION_EVIDENCE_MISMATCH" });
  expect(evaluateRentalFields({ ...r, expectedSchoolEvidenceHash: contentHash(result) }, [x.f.rule], [x.f.policy], x.f.evidence, x.income, result)).toMatchObject({ reason: "INVALID_SCHOOL_EXCEPTION_EVIDENCE" });
});

it("追加契約だけに面積/元掲載更新/内部総額チェックを追加し、生値を返さない", () => {
  const x = extendedFixture(), before = structuredClone(x), result = runExtended(x);
  expect(result).toMatchObject({ status: "evaluated", fieldVerdict: "matched", executable: false, eligibilityConfirmed: false,
    checks: { minimumArea: "matched", propertyUpdate: "matched", internalIncome: "matched" } });
  expect(JSON.stringify(result)).not.toMatch(/PRIVATE_|12345|totalYen|taxBasis|evidenceRef|sourcePropertyUpdate/);
  expect(x).toEqual(before);
});
it("設定した間取りの最低面積は境界を含み、希望面積未達とは分ける", () => {
  const x = extendedFixture();
  for (const [area, expected] of [[54.49, "outside"], [54.5, "matched"], [null, "unknown"]] as const) {
    x.f.evidence.areaSqm = area;
    expect(runExtended(x)).toMatchObject({ checks: { minimumArea: expected }, fieldVerdict: expected });
  }
  x.f.evidence.mainRooms = 1; x.f.evidence.kitchen = "LDK"; x.f.evidence.areaSqm = 19;
  expect(runExtended(x)).toMatchObject({ checks: { minimumArea: "not_applicable", mainRooms: "outside" }, fieldVerdict: "outside" });
  // The new area check cannot invent the still-unconfigured compact-property exception.
  x.f.evidence.mainRooms = 3; x.f.evidence.kitchen = "K";
  expect(runExtended(x)).toMatchObject({ checks: { minimumArea: "not_applicable", kitchen: "outside" } });
});
it("間取り欠測では最低面積を勝手に免除しない", () => {
  const x = extendedFixture(); x.f.evidence.mainRooms = null;
  expect(runExtended(x)).toMatchObject({ checks: { minimumArea: "unknown" }, fieldVerdict: "unknown" });
  x.f.evidence.mainRooms = 2; x.f.evidence.kitchen = null;
  expect(runExtended(x)).toMatchObject({ checks: { minimumArea: "unknown" }, fieldVerdict: "unknown" });
});
it("元掲載の14日境界を含み、再観測やローカル編集で若返らせない", () => {
  const x = extendedFixture();
  expect(runExtended(x)).toMatchObject({ checks: { propertyUpdate: "matched" } });
  x.f.evidence.sourcePropertyUpdate!.updatedAt = "2026-10-11T00:29:59.999Z";
  expect(runExtended(x)).toMatchObject({ checks: { propertyUpdate: "outside" } });
  for (const basis of ["local_record_update", "retrieved_at", "unknown"] as const) {
    x.f.evidence.sourcePropertyUpdate = { updatedAt: x.f.evidence.observedAt, evidenceRef: "PRIVATE_UPDATE", basis };
    expect(runExtended(x)).toMatchObject({ checks: { propertyUpdate: "unknown" } });
  }
});
it("更新日/根拠不足はunknown、日付のみと観測より未来の更新は拒否", () => {
  const x = extendedFixture();
  for (const value of [undefined, { updatedAt: null, evidenceRef: "PRIVATE_UPDATE", basis: "source_listing_update" as const },
    { updatedAt: x.f.evidence.observedAt, evidenceRef: null, basis: "source_listing_update" as const }]) {
    x.f.evidence.sourcePropertyUpdate = value;
    expect(runExtended(x)).toMatchObject({ checks: { propertyUpdate: "unknown" } });
  }
  x.f.evidence.sourcePropertyUpdate = { updatedAt: "2026-10-25", evidenceRef: "PRIVATE_UPDATE", basis: "source_listing_update" };
  expect(runExtended(x)).toMatchObject({ reason: "INVALID_RENTAL_EVALUATION_INPUT" });
  x.f.evidence.sourcePropertyUpdate.updatedAt = "2026-10-25T00:00:00.001Z";
  expect(runExtended(x)).toMatchObject({ reason: "PROPERTY_UPDATE_AFTER_OBSERVATION" });
});
it("当社AD込み総額を一度だけ閾値比較し、税込/税抜を換算しない", () => {
  const x = extendedFixture();
  x.income.totalYen = 12344; expect(runExtended(x)).toMatchObject({ checks: { internalIncome: "outside" } });
  x.income.totalYen = 12345; expect(runExtended(x)).toMatchObject({ checks: { internalIncome: "matched" } });
  x.income.taxBasis = "excluded"; expect(runExtended(x)).toMatchObject({ checks: { internalIncome: "unknown" } });
  x.income.taxBasis = "included"; x.income.basis = "other";
  expect(runExtended(x)).toMatchObject({ checks: { internalIncome: "unknown" } });
});
it("未確認/条件付き報酬を確定値とせず、別AD項目の追加も拒否", () => {
  const x = extendedFixture();
  for (const change of [{ totalYen: null }, { normalization: "unconfirmed" }, { evidenceRef: null },
    { normalizationContractRef: "OTHER" }, { certainty: "conditional" }, { basis: "unknown" }]) {
    const income = { ...x.income, ...change };
    expect(evaluateRentalFields({ ...request(x.f), expectedIncomeEvidenceHash: contentHash(income) }, [x.f.rule], [x.f.policy], x.f.evidence, income))
      .toMatchObject({ checks: { internalIncome: "unknown" } });
  }
  const income = { ...x.income, adYen: 99999 };
  expect(evaluateRentalFields({ ...request(x.f), expectedIncomeEvidenceHash: contentHash(income) }, [x.f.rule], [x.f.policy], x.f.evidence, income))
    .toMatchObject({ reason: "INVALID_INCOME_EVIDENCE" });
});
it("内部証拠の別物件/募集回/source/差替え/期限を拒否しレンタル証拠と混ぜない", () => {
  const x = extendedFixture();
  for (const change of [{ binding: { ...x.income.binding, episodeId: "other" } }, { sourceHash: "c".repeat(64) }]) {
    const altered = { ...x.income, ...change };
    expect(evaluateRentalFields({ ...request(x.f), expectedIncomeEvidenceHash: contentHash(altered) }, [x.f.rule], [x.f.policy], x.f.evidence, altered))
      .toMatchObject({ reason: "INCOME_EVIDENCE_MISMATCH" });
  }
  expect(evaluateRentalFields({ ...request(x.f), expectedIncomeEvidenceHash: "c".repeat(64) }, [x.f.rule], [x.f.policy], x.f.evidence, x.income))
    .toMatchObject({ reason: "INCOME_EVIDENCE_MISMATCH" });
  x.income.observedAt = "2026-10-24T23:30:00.000Z"; expect(runExtended(x)).toMatchObject({ reason: "INCOME_EVIDENCE_EXPIRED" });
  x.income.observedAt = "2026-10-25T00:30:00.001Z"; expect(runExtended(x)).toMatchObject({ reason: "INCOME_EVIDENCE_FROM_FUTURE" });
  expect(evaluateRentalFields(request(x.f), [x.f.rule], [x.f.policy], { ...x.f.evidence, internalIncome: x.income }))
    .toMatchObject({ reason: "INVALID_RENTAL_EVALUATION_INPUT" });
});
it("追加契約は不足値で停止し、旧契約に新証拠を黙って無視させない", () => {
  const x = extendedFixture();
  expect(evaluateRentalFields(request(x.f), [x.f.rule], [x.f.policy], x.f.evidence)).toMatchObject({ checks: { internalIncome: "unknown" } });
  x.f.policy.additionalChecks!.minimumArea = null;
  expect(runExtended(x)).toMatchObject({ reason: "EVALUATION_SEMANTICS_UNRESOLVED" });
  x.f.policy.additionalChecks = undefined;
  expect(runExtended(x)).toMatchObject({ reason: "EVALUATION_EXTENSION_NOT_CONFIGURED" });
  const legacy = fixture(); expect(run(legacy)).toMatchObject({ status: "evaluated", fieldVerdict: "matched" });
  expect(run(legacy)).not.toHaveProperty("checks.internalIncome");
});
it("新しい面積設定のhash差替えと表現不能な更新時間を拒否", () => {
  const x = extendedFixture(), r = { ...request(x.f), expectedIncomeEvidenceHash: contentHash(x.income) };
  x.f.policy.additionalChecks!.minimumArea!.sqm = 55;
  expect(evaluateRentalFields(r, [x.f.rule], [x.f.policy], x.f.evidence, x.income)).toMatchObject({ reason: "EVALUATION_POLICY_CHANGED" });
  x.f.policy.additionalChecks!.propertyUpdateWindow!.maxAgeHours = Number.MAX_VALUE;
  expect(runExtended(x)).toMatchObject({ reason: "PROPERTY_UPDATE_WINDOW_UNREPRESENTABLE" });
});
