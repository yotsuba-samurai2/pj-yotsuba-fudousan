import { expect, it } from "vitest";
import { resolveRule, rulePlanReference, type SyncRule, type RuleScope } from "../rules";
import { now } from "./fixtures";
const scope: RuleScope = { market: "residential_rental", audience: "global", clientRef: null };
// Synthetic test values only. No default registry or business policy is shipped.
function rule(version = 1): SyncRule { return { id: "synthetic-family", version, scope: { ...scope }, effectiveFrom: "2026-10-01T00:00:00.000Z", effectiveUntil: null,
  status: "approved", approvedAt: "2026-10-01T00:00:00.000Z", approvalRef: "synthetic-approval", criteria: { market: "residential_rental", rentMinYen: 100, rentMaxYen: 200, minLayoutRooms: 2, preferredAreaSqm: null, leaseTypes: ["ordinary"], schoolScopeRef: "synthetic-school-scope", companyIncomeMinYen: 100, incomeTaxBasis: "included", maxEvidenceAgeHours: 1 } }; }
it("報酬総額の明示版だけ賃料上下限を不要とし、他の未確定項目は残す", () => {
  const r = rule(); if (r.criteria.market !== "residential_rental") throw new Error();
  r.criteria.rentMinYen = null; r.criteria.rentMaxYen = null;
  expect(resolveRule([r], scope, now)).toMatchObject({ reason: "RULE_SETTINGS_UNRESOLVED" });
  r.criteria.rentSelectionBasis = "rent_range";
  expect(resolveRule([r], scope, now)).toMatchObject({ reason: "RULE_SETTINGS_UNRESOLVED" });
  r.criteria.rentSelectionBasis = "company_income_total";
  expect(resolveRule([r], scope, now)).toMatchObject({ status: "selected", executable: false });
  r.criteria.companyIncomeMinYen = null;
  expect(resolveRule([r], scope, now)).toMatchObject({ reason: "RULE_SETTINGS_UNRESOLVED" });
});
it("報酬総額基準と旧賃料範囲の混在を拒否し、値を黙って捨てない", () => {
  const r = rule(); if (r.criteria.market !== "residential_rental") throw new Error();
  r.criteria.rentSelectionBasis = "company_income_total";
  expect(resolveRule([r], scope, now)).toMatchObject({ reason: "INVALID_RULE_INPUT" });
});
it("最新の承認版を順序に依存せず選び、実行は許可しない", () => {
  const newer = rule(2); newer.effectiveFrom = "2026-10-20T00:00:00.000Z";
  const a = resolveRule([newer, rule()], scope, now), b = resolveRule([rule(), newer], scope, now);
  expect(a).toEqual(b); expect(a).toMatchObject({ status: "selected", executable: false, rule: { version: 2 } });
  expect(rulePlanReference(a)).toMatchObject({ executable: false, version: 2 }); expect(JSON.stringify(rulePlanReference(a))).not.toContain("companyIncomeMinYen");
});
it.each(["pending", "revoked", "expired", "unresolved", "futureApproval"])("最新版%sから旧条件に戻らない", mode => {
  const newer = rule(2);
  if (mode === "pending" || mode === "revoked") newer.status = mode;
  if (mode === "expired") newer.effectiveUntil = "2026-10-24T12:00:00.000Z";
  if (mode === "unresolved" && newer.criteria.market === "residential_rental") newer.criteria.rentMaxYen = null;
  if (mode === "futureApproval") newer.approvedAt = "2026-10-25T00:00:00.000Z";
  expect(resolveRule([rule(), newer], scope, now)).toMatchObject({ status: "held", executable: false });
});
it("個別顧客の条件を全体や別の顧客へ混ぜない", () => {
  const personal = rule(99); personal.scope = { ...scope, audience: "client", clientRef: "client-opaque-1" };
  expect(resolveRule([personal], scope, now)).toMatchObject({ reason: "NO_EFFECTIVE_RULE" });
  expect(resolveRule([rule(), personal], scope, now)).toMatchObject({ rule: { version: 1 } });
  expect(resolveRule([personal], { ...personal.scope, clientRef: "client-opaque-2" }, now)).toMatchObject({ status: "held" });
});
it.each(["sale", "business"])("%sを居住用賃貸の条件で代用しない", market => {
  expect(resolveRule([rule()], { ...scope, market }, now)).toMatchObject({ reason: "NO_EFFECTIVE_RULE" });
});
it("重複版・別family・逆順履歴は保留する", () => {
  expect(resolveRule([rule(), rule()], scope, now)).toMatchObject({ reason: "DUPLICATE_RULE_VERSION" });
  expect(resolveRule([rule(), { ...rule(2), id: "other-family" }], scope, now)).toMatchObject({ reason: "AMBIGUOUS_RULE_FAMILY" });
  const old = rule(); old.effectiveFrom = "2026-10-20T00:00:00.000Z";
  expect(resolveRule([old, rule(2)], scope, now)).toMatchObject({ reason: "RULE_HISTORY_ORDER" });
});
it("空履歴・未来の開始・不正なscope/余分な値は保留する", () => {
  expect(resolveRule([], scope, now)).toMatchObject({ reason: "NO_EFFECTIVE_RULE" });
  expect(resolveRule([{ ...rule(), effectiveFrom: "2026-10-25T00:00:00.000Z" }], scope, now)).toMatchObject({ status: "held" });
  expect(resolveRule([rule()], { ...scope, clientRef: "client-1" }, now)).toMatchObject({ reason: "INVALID_RULE_INPUT" });
  const result = resolveRule([{ ...rule(), internal: "PRIVATE_CANARY" }], scope, now);
  expect(result).toMatchObject({ reason: "INVALID_RULE_INPUT" }); expect(JSON.stringify(result)).not.toContain("PRIVATE_CANARY");
});
it("開始/終了境界と範囲矛盾を検査し、入力を変更しない", () => {
  const r = rule(); r.effectiveFrom = now; const before = structuredClone(r);
  expect(resolveRule([r], scope, now)).toMatchObject({ status: "selected" }); expect(r).toEqual(before);
  if (r.criteria.market === "residential_rental") r.criteria.rentMinYen = 500;
  expect(resolveRule([r], scope, now)).toMatchObject({ reason: "INVALID_RULE_INPUT" });
});
