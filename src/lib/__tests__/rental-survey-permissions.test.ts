// ペット横断 指示書 版2.0 第7章・受入テスト T12・T13（データ利用許諾ゲート）
import { describe, expect, it, vi } from "vitest";
import { aggregateAttribution, DATA_USE_LEDGER, isPermitted, permissionUses } from "@/lib/rental-survey/permissions";
import { planFinalization } from "@/lib/rental-survey/finalize";
import { currentSurveyScope } from "@/lib/rental-survey/scope";
import { getPublicSurveySummary } from "@/lib/rental-survey/store";
import { buildPublicSurveySummary } from "@/lib/rental-survey/summary";
import { compileSurveySnapshot } from "@/lib/rental-survey/units";
import { ALL_PROVIDERS, confirmedLedger, finalization, ledgerEntry, NOW, observation, PET_SCOPE_KEY, storedBatches } from "./rental-survey-fixtures";

// 公開面の判定が DB に触れたら失敗させる（フラグ・許諾が無ければ読まないこと）
vi.mock("@/lib/prisma", () => ({ prisma: new Proxy({}, { get: () => { throw new Error("DB must not be read"); } }) }));
vi.mock("@/lib/db/properties", () => ({ getProperties: () => { throw new Error("DB must not be read"); } }));

const scope = currentSurveyScope("bunkyo-rent-pet")!;
// 台帳（2026-09-24 浦松判断）は4媒体に記載したまま。版2で ATBB を対象媒体から外したが、ATBB の記載は残る（使われないだけ）。
const LEDGER_PROVIDERS = [...ALL_PROVIDERS, "atbb"] as const;

describe("許諾台帳の記載（T12・2026-09-24 浦松判断）", () => {
  it("内部保存・加工と集計公表だけを4媒体に記載し、個別広告・画像転載・SNS は拒否のまま", () => {
    expect(DATA_USE_LEDGER).toHaveLength(LEDGER_PROVIDERS.length * 2);
    expect(new Set(DATA_USE_LEDGER.map(e => e.provider))).toEqual(new Set(LEDGER_PROVIDERS));
    for (const provider of LEDGER_PROVIDERS) for (const use of permissionUses)
      expect(isPermitted(DATA_USE_LEDGER, provider, use, NOW), `${provider}/${use}`).toBe(use === "store" || use === "aggregate");
  });

  it("判断の根拠（浦松判断・書面回答なし）を残し、公表では媒体名を出さない", () => {
    for (const entry of DATA_USE_LEDGER) {
      expect(entry.evidenceRef).toMatch(/^2026-09-24 浦松判断：.*書面回答なし$/);
      expect(entry.attribution).toBeNull();
    }
    for (const provider of LEDGER_PROVIDERS) expect(aggregateAttribution(DATA_USE_LEDGER, provider, NOW)).toBeNull();
  });

  it("記載の効力は 2026-09-24（日本時間）から。それより前の時点では拒否する", () => {
    const before = new Date("2026-09-23T14:59:59Z");
    for (const provider of LEDGER_PROVIDERS) for (const use of permissionUses)
      expect(isPermitted(DATA_USE_LEDGER, provider, use, before)).toBe(false);
  });

  it("効力の前なら、公開フラグを立てても hidden で DB も読まない", async () => {
    const env = { RENTAL_SURVEY_PUBLIC_SCOPES: PET_SCOPE_KEY };
    await expect(getPublicSurveySummary("bunkyo-rent-pet", "ja", { env, now: new Date("2026-09-23T12:00:00Z") })).resolves.toEqual({ state: "hidden" });
  });

  it("記載後も、公開フラグが無ければ hidden で DB も読まない", async () => {
    await expect(getPublicSurveySummary("bunkyo-rent-pet", "ja", { env: {}, now: NOW })).resolves.toEqual({ state: "hidden" });
  });

  it("許諾があってもフラグが無ければ hidden で DB も読まない", async () => {
    await expect(getPublicSurveySummary("bunkyo-rent-pet", "ja", { env: {}, ledger: confirmedLedger(), now: NOW })).resolves.toEqual({ state: "hidden" });
  });

  it.each([
    ["確認済み", {}, true],
    ["要連絡未了", { status: "contact-pending" as const }, false],
    ["失効（期限切れ）", { validUntil: "2026-09-01T00:00:00Z" }, false],
    ["効力前", { validFrom: "2026-10-01T00:00:00Z" }, false],
    ["撤回", { status: "revoked" as const }, false],
  ])("%s の記載", (_, over, expected) => {
    expect(isPermitted([ledgerEntry("reins", "aggregate", over)], "reins", "aggregate", NOW)).toBe(expected);
  });

  it("後から撤回の記載を足せば、その日時から拒否に変わる", () => {
    const ledger = [ledgerEntry("reins", "aggregate"), ledgerEntry("reins", "aggregate", { status: "revoked", validFrom: "2026-09-20T00:00:00Z" })];
    expect(isPermitted(ledger, "reins", "aggregate", new Date("2026-09-10T00:00:00Z"))).toBe(true);
    expect(isPermitted(ledger, "reins", "aggregate", NOW)).toBe(false);
  });

  it("同じ時刻に確認済みと撤回の記載があれば、記載の順番によらず拒否", () => {
    const confirmed = ledgerEntry("reins", "aggregate");
    const revoked = ledgerEntry("reins", "aggregate", { status: "revoked" });
    expect(isPermitted([confirmed, revoked], "reins", "aggregate", NOW)).toBe(false);
    expect(isPermitted([revoked, confirmed], "reins", "aggregate", NOW)).toBe(false);
  });

  it("用途は別々に確認する（保存の許諾で集計公表・広告・画像を代用しない）", () => {
    const ledger = [ledgerEntry("reins", "store")];
    expect(isPermitted(ledger, "reins", "store", NOW)).toBe(true);
    for (const use of ["aggregate", "ad", "image", "sns"] as const) expect(isPermitted(ledger, "reins", use, NOW)).toBe(false);
  });

  it("別媒体の許諾で代用しない", () => {
    expect(isPermitted([ledgerEntry("reins", "aggregate")], "itandi", "aggregate", NOW)).toBe(false);
  });
});

describe("許諾の範囲が混在しても推測させない（T13）", () => {
  const snapshot = compileSurveySnapshot([observation("reins"), observation("reins", { sourceId: "b", unit: "301" })], scope);
  const build = (ledger = confirmedLedger()) => buildPublicSurveySummary({
    scope, finalization: finalization({ snapshot }), visible: [], ledger, publicScopes: new Set([PET_SCOPE_KEY]), now: NOW,
  });

  it("全媒体に保存・集計公表の許諾があれば出す", () => {
    expect(build()).toMatchObject({ state: "shown", x: 2 });
  });

  it.each(ALL_PROVIDERS)("%s の集計公表の許諾が欠けたら、許諾のある部分だけを出さずに全体を hidden", provider => {
    const ledger = confirmedLedger().filter(e => !(e.provider === provider && e.use === "aggregate"));
    expect(build(ledger)).toEqual({ state: "hidden" });
  });

  it("保存・加工の許諾が撤回されたら、確定済みの集計も出さない", () => {
    const ledger = [...confirmedLedger(), ledgerEntry("eslife", "store", { status: "revoked", validFrom: "2026-09-23T00:00:00Z" })];
    expect(build(ledger)).toEqual({ state: "hidden" });
  });

  it("許諾の無い媒体のデータは確定の計算に入らない（確定そのものを拒否する）", () => {
    const ledger = confirmedLedger(["store"], ["reins", "itandi"]);
    const plan = planFinalization({ scope, batches: storedBatches(), latest: null, ledger, now: NOW });
    expect(plan).toMatchObject({ ok: false, status: 403 });
    expect(JSON.stringify(plan)).not.toMatch(/units/);
  });

  it("出典表記は全媒体に表記の許可がある場合だけ", () => {
    const named = ALL_PROVIDERS.flatMap(p => [ledgerEntry(p, "store"), ledgerEntry(p, "aggregate", { attribution: `${p}（試験）` })]);
    expect(build(named)).toMatchObject({ attribution: "eslife（試験）・itandi（試験）・reins（試験）", sourceKind: "multiple" });
    const partlyNamed = named.map(e => e.provider === "reins" && e.use === "aggregate" ? { ...e, attribution: null } : e);
    expect(build(partlyNamed)).toMatchObject({ attribution: null });
    expect(aggregateAttribution([], "reins", NOW)).toBeNull();
  });
});
