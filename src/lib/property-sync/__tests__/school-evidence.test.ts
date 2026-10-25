import { expect, it } from "vitest";
import { matchSchoolEvidence, schoolDatasetReference, type SchoolDataset, type SchoolEvidenceRequest, type NormalizedSchoolAddress } from "../school-evidence";

const now = "2026-10-24T12:00:00.000Z";
function fixture() {
  const request: SchoolEvidenceRequest = { binding: { propertyId: "00000000-0000-4000-8000-000000000001", episodeId: "episode-1",
    sourceVersion: { updatedAt: "2026-10-24T10:00:00.000Z", fullHash: "a".repeat(64) } }, municipalityRef: "synthetic-city",
    schoolType: "elementary", academicYear: 2027, applicableOn: "2027-04-01" };
  const address: NormalizedSchoolAddress = { binding: structuredClone(request.binding), municipalityRef: request.municipalityRef, townRef: "PRIVATE_TOWN", chome: 2, ban: 3, go: 4,
    addressType: "residential_display", normalizedAt: "2026-10-24T11:00:00.000Z", normalization: { version: 1, sourceAddressHash: "b".repeat(64), confirmation: "confirmed", confirmationRef: "PRIVATE_ADDRESS" } };
  const dataset: SchoolDataset = { id: "synthetic-dataset", version: 1,
    coverage: { municipalityRef: request.municipalityRef, townRef: address.townRef, chome: 2, schoolType: "elementary", academicYear: 2027, completeness: "confirmed", confirmationRef: "PRIVATE_COVERAGE" },
    effectiveFrom: "2027-04-01", effectiveUntil: "2028-04-01",
    source: { publisherRef: "synthetic-city", sourceRef: "PRIVATE_SOURCE", contentHash: "c".repeat(64), publicationDate: "2026-10-01", publicationTimeZone: "Asia/Tokyo",
      observedAt: "2026-10-23T00:00:00.000Z", authority: "municipal_official", acquisition: "manual_confirmed" },
    confirmation: "confirmed", confirmationRef: "PRIVATE_CONFIRMATION", confirmedAt: "2026-10-23T01:00:00.000Z",
    rows: [{ id: "row-1", schoolRef: "synthetic-school", ban: { kind: "range", from: 1, to: 5 }, go: { kind: "set", values: [4, 6] }, boundary: "complete" },
      { id: "row-2", schoolRef: "synthetic-other", ban: { kind: "range", from: 1, to: 5 }, go: { kind: "except", values: [4, 6] }, boundary: "complete" }] };
  return { request, address, dataset, expected: schoolDatasetReference(dataset) };
}
type Fixture = ReturnType<typeof fixture>;
const run = (f = fixture(), at = now) => matchSchoolEvidence(f.request, f.address, f.dataset, f.expected, at);
const rebind = (f: Fixture) => { f.expected = schoolDatasetReference(f.dataset); };

it("適用年度/日・学校種別・正規化住所・完全な範囲表を照合、公開/入学保証をしない", () => {
  const f = fixture(), before = structuredClone(f), result = run(f);
  expect(result).toMatchObject({ status: "matched", executable: false, publicClaimAllowed: false, assignmentGuaranteed: false,
    reference: { binding: f.request.binding, academicYear: 2027, applicableOn: "2027-04-01", schoolRef: "synthetic-school", rowIds: ["row-1"], dataset: f.expected } });
  expect(JSON.stringify(result)).not.toMatch(/PRIVATE_|townRef|chome|ban|go|sourceAddressHash|confirmationRef/);
  expect(f).toEqual(before);
});
it("除外を適用して別校へ照合するが範囲外は候補なし", () => {
  const f = fixture(); f.address.go = 5; expect(run(f)).toMatchObject({ status: "matched", reference: { schoolRef: "synthetic-other", rowIds: ["row-2"] } });
  f.address.ban = 6; expect(run(f)).toMatchObject({ reason: "NO_SCHOOL_BOUNDARY_MATCH" });
});
it.each(["request-year", "request-date", "dataset-year", "effective-from", "effective-until"])("%s不明を更新日から推測しない", key => {
  const f = fixture();
  if (key === "request-year") f.request.academicYear = null;
  if (key === "request-date") f.request.applicableOn = null;
  if (key === "dataset-year") f.dataset.coverage.academicYear = null;
  if (key === "effective-from") f.dataset.effectiveFrom = null;
  if (key === "effective-until") f.dataset.effectiveUntil = null;
  rebind(f); expect(run(f)).toMatchObject({ reason: "SCHOOL_APPLICABILITY_UNRESOLVED" });
});
it.each(["year", "school-type", "before-start", "at-expiry"])("適用%sの差を許容しない", key => {
  const f = fixture();
  if (key === "year") f.request.academicYear = 2026;
  if (key === "school-type") f.request.schoolType = "junior_high";
  if (key === "before-start") f.request.applicableOn = "2027-03-31";
  if (key === "at-expiry") f.request.applicableOn = "2028-04-01";
  expect(run(f)).toMatchObject({ reason: key === "year" || key === "school-type" ? "SCHOOL_YEAR_OR_TYPE_MISMATCH" : "SCHOOL_DATE_OUTSIDE_APPLICABILITY" });
});

it.each(["property", "episode", "source-hash", "source-time", "city"])("住所の%s境界を越えない", key => {
  const f = fixture();
  if (key === "property") f.address.binding.propertyId = "00000000-0000-4000-8000-000000000002";
  if (key === "episode") f.address.binding.episodeId = "other";
  if (key === "source-hash") f.address.binding.sourceVersion.fullHash = "d".repeat(64);
  if (key === "source-time") f.address.binding.sourceVersion.updatedAt = "2026-10-24T09:00:00.000Z";
  if (key === "city") f.address.municipalityRef = "other-city";
  expect(run(f)).toMatchObject({ reason: "SCHOOL_ADDRESS_BINDING_MISMATCH" });
});
it.each(["before-source", "future"])("住所正規化時刻%sを拒否", key => {
  const f = fixture(); f.address.normalizedAt = key === "future" ? "2026-10-25T00:00:00.000Z" : "2026-10-24T09:00:00.000Z";
  expect(run(f)).toMatchObject({ reason: "INVALID_ADDRESS_TIME" });
});
it.each(["unconfirmed", "no-reference"])("正規化%sを受理しない", key => {
  const f = fixture(); if (key === "unconfirmed") f.address.normalization.confirmation = "unconfirmed"; else f.address.normalization.confirmationRef = null;
  expect(run(f)).toMatchObject({ reason: "ADDRESS_NORMALIZATION_UNCONFIRMED" });
});
it.each(["land_lot", "unknown"] as const)("%sを住居表示へ読み替えない", addressType => {
  const f = fixture(); f.address.addressType = addressType; expect(run(f)).toMatchObject({ reason: "UNSUPPORTED_ADDRESS_TYPE" });
});
it("丁目・番・号不足は一校しか候補がなくても必要粒度を満たさない", () => {
  const f = fixture(); f.address.chome = null; expect(run(f)).toMatchObject({ reason: "ADDRESS_CHOME_MISSING" });
  f.address.chome = 2; f.address.go = null; f.dataset.rows.pop(); rebind(f);
  expect(run(f)).toMatchObject({ reason: "ADDRESS_NUMBER_MISSING" });
  f.address.ban = null; expect(run(f)).toMatchObject({ reason: "ADDRESS_NUMBER_MISSING" });
});
it("公式に全域と明示された粒度だけは番号不要、空文字を全域にしない", () => {
  const f = fixture(); f.address.ban = null; f.address.go = null; f.dataset.rows = [{ ...f.dataset.rows[0], ban: { kind: "all" }, go: { kind: "all" } }]; rebind(f);
  expect(run(f)).toMatchObject({ status: "matched" });
  expect(matchSchoolEvidence(f.request, f.address, { ...f.dataset, rows: [{ ...f.dataset.rows[0], go: "" }] }, f.expected, now)).toMatchObject({ reason: "INVALID_SCHOOL_INPUT" });
});

it.each(["municipality", "town", "chome"])("範囲表%sの違いを拒否", key => {
  const f = fixture();
  if (key === "municipality") f.dataset.coverage.municipalityRef = "other";
  if (key === "town") f.dataset.coverage.townRef = "other";
  if (key === "chome") f.dataset.coverage.chome++;
  rebind(f); expect(run(f)).toMatchObject({ reason: "SCHOOL_COVERAGE_MISMATCH" });
});
it.each(["unknown", "no-reference"])("区域表の完全性%sを候補一校だけで通さない", key => {
  const f = fixture(); f.dataset.rows.pop();
  if (key === "unknown") f.dataset.coverage.completeness = "unknown"; else f.dataset.coverage.confirmationRef = null;
  rebind(f); expect(run(f)).toMatchObject({ reason: "SCHOOL_TABLE_COMPLETENESS_UNCONFIRMED" });
});
it.each(["partial_unresolved", "exception_unresolved", "legacy_address_unresolved", "unknown-selector"])("可能性が重なる%s行を落として一校に絞らない", boundary => {
  const f = fixture();
  f.dataset.rows[1] = { ...f.dataset.rows[1], ban: { kind: "all" }, go: { kind: "all" },
    boundary: boundary === "unknown-selector" ? "complete" : boundary as SchoolDataset["rows"][number]["boundary"] };
  if (boundary === "unknown-selector") f.dataset.rows[1].go = { kind: "unresolved" };
  rebind(f); expect(run(f)).toMatchObject({ reason: "SCHOOL_BOUNDARY_UNRESOLVED" });
});
it("住所と確実に重ならない曖昧行は当該照合を妨げない", () => {
  const f = fixture(); f.dataset.rows[1].ban = { kind: "set", values: [99] }; f.dataset.rows[1].go = { kind: "unresolved" }; f.dataset.rows[1].boundary = "partial_unresolved"; rebind(f);
  expect(run(f)).toMatchObject({ status: "matched", reference: { rowIds: ["row-1"] } });
});
it("完全行が二校に重なるなら確定しない", () => {
  const f = fixture(); f.dataset.rows[1].go = { kind: "all" }; rebind(f); expect(run(f)).toMatchObject({ reason: "MULTIPLE_SCHOOL_BOUNDARIES" });
});

it.each(["unconfirmed", "unofficial", "mock", "future", "before-capture", "publication-after-capture"])("根拠の%sを受理しない", key => {
  const f = fixture();
  if (key === "unconfirmed") f.dataset.confirmation = "unconfirmed";
  if (key === "unofficial") f.dataset.source.authority = "unknown";
  if (key === "mock") f.dataset.source.acquisition = "mock";
  if (key === "future") f.dataset.confirmedAt = "2026-10-25T00:00:00.000Z";
  if (key === "before-capture") f.dataset.confirmedAt = "2026-10-22T00:00:00.000Z";
  if (key === "publication-after-capture") f.dataset.source.publicationDate = "2026-10-24";
  rebind(f); expect(run(f)).toMatchObject({ reason: "SCHOOL_SOURCE_UNCONFIRMED" });
});
it("固定参照と異なる表内容・版を採用しない", () => {
  const f = fixture(); f.dataset.version++; expect(run(f)).toMatchObject({ reason: "SCHOOL_DATASET_REFERENCE_MISMATCH" });
});
it("公表日のtimezoneを明示し、JST公表当日のUTC前日取得を誤保留しない", () => {
  const f = fixture(); f.dataset.source.publicationDate = "2026-10-23"; f.dataset.source.observedAt = "2026-10-22T15:01:00.000Z"; rebind(f);
  expect(run(f)).toMatchObject({ status: "matched" });
  f.dataset.source.publicationTimeZone = "UTC"; rebind(f); expect(run(f)).toMatchObject({ reason: "SCHOOL_SOURCE_UNCONFIRMED" });
  f.dataset.source.publicationTimeZone = "INVALID/ZONE"; rebind(f); expect(run(f)).toMatchObject({ reason: "INVALID_SCHOOL_SOURCE_TIMEZONE" });
});
it.each(["reverse-range", "empty-set", "duplicate-values", "unsafe-number", "duplicate-row"])("不正な構造化範囲%s", key => {
  const f = fixture();
  if (key === "reverse-range") f.dataset.rows[0].ban = { kind: "range", from: 5, to: 1 };
  if (key === "empty-set") f.dataset.rows[0].ban = { kind: "set", values: [] };
  if (key === "duplicate-values") f.dataset.rows[0].ban = { kind: "set", values: [1, 1] };
  if (key === "unsafe-number") f.dataset.rows[0].ban = { kind: "range", from: 1, to: Number.MAX_SAFE_INTEGER + 1 };
  if (key === "duplicate-row") f.dataset.rows[1].id = f.dataset.rows[0].id;
  rebind(f); expect(run(f)).toMatchObject({ reason: key === "duplicate-row" ? "DUPLICATE_SCHOOL_ROW" : "INVALID_SCHOOL_INPUT" });
});
it("生住所や部屋番号を未知fieldとして入れても公開返却しない", () => {
  const f = fixture();
  expect(matchSchoolEvidence(f.request, { ...f.address, roomNumber: 404, rawAddress: "PRIVATE_RAW_ADDRESS" }, f.dataset, f.expected, now)).toEqual({
    status: "held", executable: false, publicClaimAllowed: false, assignmentGuaranteed: false, reason: "INVALID_SCHOOL_INPUT" });
});
