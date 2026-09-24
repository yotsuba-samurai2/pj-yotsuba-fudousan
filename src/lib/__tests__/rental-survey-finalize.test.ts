// ペット横断 指示書 版2.0 第4.2章・受入テスト T03・T11（確定・巻き戻しの条件）
import { describe, expect, it } from "vitest";
import { planFinalization, planRollback } from "@/lib/rental-survey/finalize";
import { currentSurveyScope } from "@/lib/rental-survey/scope";
import { batch, confirmedLedger, finalization, ledgerEntry, NOW, storedBatch, storedBatches } from "./rental-survey-fixtures";

const scope = currentSurveyScope("bunkyo-rent-pet")!;
const ledger = confirmedLedger(["store"]);

describe("確定の条件（T11）", () => {
  it("対象媒体すべての verified バッチがそろえば確定できる（住戸は媒体をまたいで1件）", () => {
    const plan = planFinalization({ scope, batches: storedBatches(), latest: null, ledger, now: NOW });
    expect(plan.ok).toBe(true);
    if (!plan.ok) return;
    expect(plan.data.snapshot.units).toHaveLength(1);
    expect(plan.data.providers).toEqual(["eslife", "itandi", "reins"]);
    expect(plan.data.rolledBackFrom).toBeNull();
  });

  it("媒体が欠けていれば確定しない", () => {
    const plan = planFinalization({ scope, batches: storedBatches().slice(1), latest: null, ledger, now: NOW });
    expect(plan).toMatchObject({ ok: false, status: 400 });
  });

  it.each(["incomplete", "failed"])("%s のバッチでは確定を置き換えない", status => {
    const batches = storedBatches();
    batches[0] = storedBatch("batch-reins", batch("reins", [], { status: status as "incomplete", allPagesChecked: false, expectedCount: undefined, failureReason: "途中で中断" }), { status });
    expect(planFinalization({ scope, batches, latest: null, ledger, now: NOW })).toMatchObject({ ok: false, status: 400 });
  });

  it("別の scope・版のバッチは使えない", () => {
    const batches = storedBatches();
    batches[0] = { ...batches[0], scopeVersion: 1 };
    expect(planFinalization({ scope, batches, latest: null, ledger, now: NOW })).toMatchObject({ ok: false, status: 400 });
  });

  it("保存内容が壊れている・件数が合わないバッチは使えない", () => {
    const batches = storedBatches();
    batches[1] = { ...batches[1], payload: { ...(batches[1].payload as object), expectedCount: 99 } };
    expect(planFinalization({ scope, batches, latest: null, ledger, now: NOW })).toMatchObject({ ok: false, status: 400 });
  });

  it("観測期間の幅が上限（7日）を超えれば確定しない", () => {
    const batches = storedBatches();
    batches[0] = storedBatch("batch-reins", batch("reins", undefined, { observedFrom: "2026-09-10T00:00:00Z", observedTo: "2026-09-11T00:00:00Z" }));
    expect(planFinalization({ scope, batches, latest: null, ledger, now: NOW })).toMatchObject({ ok: false, status: 400 });
  });

  it("現在の確定より古い観測では置き換えない（戻すのは巻き戻しだけ）", () => {
    const latest = finalization({ observedTo: new Date("2026-09-23T12:00:00Z") });
    expect(planFinalization({ scope, batches: storedBatches(), latest, ledger, now: NOW })).toMatchObject({ ok: false, status: 409 });
  });

  it("内部保存・加工の許諾が無い媒体を含むと確定しない（既定の台帳では常に拒否）", () => {
    expect(planFinalization({ scope, batches: storedBatches(), latest: null, ledger: [], now: NOW })).toMatchObject({ ok: false, status: 403 });
    const partial = confirmedLedger(["store"], ["reins", "itandi"]);
    expect(planFinalization({ scope, batches: storedBatches(), latest: null, ledger: partial, now: NOW })).toMatchObject({ ok: false, status: 403 });
  });
});

describe("巻き戻し（T03）", () => {
  const target = finalization({ id: "fin-old", sequence: 1 });
  const latest = finalization({ id: "fin-new", sequence: 2 });

  it("同じ scope・版の過去の確定を写す", () => {
    const plan = planRollback({ scope, target, latest, ledger, now: NOW });
    expect(plan).toMatchObject({ ok: true, data: { rolledBackFrom: "fin-old", batchIds: target.batchIds } });
  });

  it("別の scope・版の確定には戻さない", () => {
    expect(planRollback({ scope, target: { ...target, scopeId: "other" }, latest, ledger, now: NOW })).toMatchObject({ ok: false, status: 400 });
    expect(planRollback({ scope, target: { ...target, scopeVersion: 1 }, latest, ledger, now: NOW })).toMatchObject({ ok: false, status: 400 });
    expect(planRollback({ scope, target: null, latest, ledger, now: NOW })).toMatchObject({ ok: false, status: 400 });
  });

  it("同一性判定の版が古い確定・許諾を失った媒体を含む確定には戻さない", () => {
    expect(planRollback({ scope, target: { ...target, dedupVersion: 0 }, latest, ledger, now: NOW })).toMatchObject({ ok: false, status: 400 });
    const revoked = [...ledger, ledgerEntry("itandi", "store", { status: "revoked", validFrom: "2026-09-20T00:00:00Z" })];
    expect(planRollback({ scope, target, latest, ledger: revoked, now: NOW })).toMatchObject({ ok: false, status: 403 });
  });

  it("現在の確定そのものへの巻き戻しは受け付けない", () => {
    expect(planRollback({ scope, target: latest, latest, ledger, now: NOW })).toMatchObject({ ok: false, status: 400 });
  });
});
