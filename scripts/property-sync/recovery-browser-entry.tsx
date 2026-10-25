// Synthetic DOM harness for the real React components, bundled locally without a server.
import React from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import PropertyRequestEditor from "../../src/components/admin/PropertyRequestEditor";
import type { AdminProperty } from "../../src/lib/property-shared";
import type { PropertyRecoveryCommand, PropertyRecoverySummary } from "../../src/lib/property-recovery-contract";
import type { PropertyWriteCommand } from "../../src/lib/property-write-contract";

const propertyId = "00000000-0000-4000-8000-000000000001", operatorId = "00000000-0000-4000-8000-00000000000a", requestId = "00000000-0000-4000-8000-000000000002";
const property: AdminProperty = { id: propertyId, slug: "synthetic-browser", title: "Synthetic property", status: "draft", dealType: "land", category: "other", tradeMode: "broker", priceYen: 10000000,
  locationText: "Synthetic location", description: "Synthetic description", access: [], images: [], locales: ["ja"], spec: { dealType: "land", landAreaSqm: 60, privateRoadAreaSqm: 0, landCategory: "宅地", zoning: "住居地域", buildingCoverage: "60%", floorAreaRatio: "200%", legalRestrictions: "なし" },
  infoUpdatedAt: "2026-10-25", nextUpdateAt: "2026-10-26", updatedAt: "2026-10-25T00:00:00.000Z", createdAt: "2026-10-25T00:00:00.000Z" };
const checks: { name: string; passed: boolean }[] = [], root = createRoot(document.getElementById("root")!);
const tick = () => new Promise<void>(r => setTimeout(r, 10));
const assert = (ok: unknown, reason: string) => { if (!ok) throw new Error(reason); };
const button = (label: string) => Array.from(document.querySelectorAll("button")).find(b => b.textContent === label);
const wait = async (ok: () => unknown) => { for (let i = 0; i < 100; i++) { if (ok()) return; await tick(); } throw new Error("DOM_CONDITION_TIMEOUT"); };
const click = (label: string) => { const b = button(label); assert(b && !b.disabled, `BUTTON_UNAVAILABLE:${label}`); b!.click(); };
const storage = window.sessionStorage; // Runs only in the fresh synthetic browser profile.
const storageKey = `yotsuba:property-recovery:v1:${operatorId}:${propertyId}`;
const fresh = (): PropertyRecoverySummary => ({ cache: { status: "pending", attempts: 0 }, notification: { status: "pending", attempts: 0 }, revision: 0, resultVersion: "2026-10-25T00:00:00.001Z" });
const runs = { cache: 0, notification: 0 };
let summary = fresh(), release: (() => void) | undefined, held = false, lost = false, forbidden = false, missing = false;
const send = async (c: Readonly<PropertyRecoveryCommand>) => {
  if (forbidden) return Response.json({ error: "FORBIDDEN" }, { status: 403 });
  if (missing) return Response.json({ error: "REQUEST_NOT_AVAILABLE" }, { status: 404 });
  let outcome = "status";
  if (c.operation !== "status") {
    const stage = summary[c.operation];
    if (stage.status === "running") outcome = "unknown";
    else if (stage.status === "pending") {
      runs[c.operation]++; stage.status = "running"; stage.attempts++;
      if (held) { held = false; await new Promise<void>(r => { release = r; }); }
      stage.status = "acknowledged"; summary.revision++; outcome = "acknowledged";
      if (lost) { lost = false; throw new Error("SYNTHETIC_HTTP_REPLY_LOST"); }
    } else outcome = "acknowledged";
  }
  return Response.json({ propertyId: c.propertyId, requestId: c.requestId, summary, outcome, publication: "not_checked" });
};
let writes = 0, heldSave = false;
const write = async (c: Readonly<PropertyWriteCommand>) => {
  writes++; missing = heldSave; summary = fresh();
  const result = heldSave ? { status: "held", reason: "VERSION_CONFLICT", requestId: c.requestId, replayed: false, resultVersion: summary.resultVersion, resultHash: "a".repeat(64), current: "changed" }
    : { status: "applied", reason: "SAVED", requestId: c.requestId, replayed: false, resultVersion: "2026-10-25T00:00:00.003Z", resultHash: "b".repeat(64), current: "matches" };
  return Response.json({ propertyId: c.propertyId, requestId: c.requestId, result, publication: "not_checked" }, { status: heldSave ? 409 : 200 });
};
let key = 0;
const render = (p = property) => flushSync(() => root.render(<PropertyRequestEditor key={key} initialData={p} send={write} onReload={() => { key++; render({ ...property, updatedAt: "2026-10-25T00:00:00.002Z" }); }} recovery={{ operatorId, storage, send }} />));
const check = async (name: string, run: () => Promise<void>) => { await run(); checks.push({ name, passed: true }); };
async function main() {
  storage.setItem(storageKey, JSON.stringify([{ propertyId, requestId }])); render();
  await check("reopen_only_inspects_and_preserves_editability", async () => {
    await wait(() => button("ページ更新を再開")); assert(runs.cache + runs.notification === 0, "OPEN_EXECUTED_EFFECT");
    assert(!document.querySelector("fieldset")!.disabled, "REF_BLOCKED_FRESH_EDIT"); assert(button("通知を再開")!.disabled, "NOTIFICATION_BEFORE_CACHE");
  });
  await check("double_click_leave_reopen_and_unknown_result", async () => {
    held = true; const b = button("ページ更新を再開")!; b.click(); b.click(); await wait(() => release);
    flushSync(() => root.render(null)); key++; render(); await wait(() => button("ページ更新の結果を照合"));
    click("ページ更新の結果を照合"); await wait(() => !button("ページ更新の結果を照合"));
    assert(runs.cache === 1, "DUPLICATE_CACHE_RUN"); assert(document.body.textContent!.includes("確認できません"), "UNKNOWN_NOT_SHOWN");
    release!(); await tick(); click("状態を照合"); await wait(() => button("通知を再開") && !button("通知を再開")!.disabled);
  });
  await check("lost_notification_reply_and_completed_request_do_not_resend", async () => {
    lost = true; click("通知を再開"); await wait(() => !button("通知を再開"));
    assert(runs.notification === 1, "NOTIFICATION_COUNT"); click("状態を照合"); await wait(() => button("完了した受付番号を一覧から外す"));
    assert(!button("ページ更新を再開") && !button("通知を再開"), "COMPLETED_HAS_RUN_ACTION");
    key++; render(); await wait(() => button("完了した受付番号を一覧から外す")); assert(runs.notification === 1, "REOPEN_RESENT_NOTIFICATION");
    click("完了した受付番号を一覧から外す"); await wait(() => !document.querySelector('select[aria-label="受付番号"]'));
  });
  await check("permission_loss_clears_actions_until_reinspection", async () => {
    storage.setItem(storageKey, JSON.stringify([{ propertyId, requestId }])); summary = fresh(); key++; render(); await wait(() => button("ページ更新を再開"));
    forbidden = true; click("ページ更新を再開"); await wait(() => !button("ページ更新を再開"));
    assert(document.body.textContent!.includes("権限を確認できません"), "PERMISSION_NOT_SHOWN"); assert(runs.cache === 1, "FORBIDDEN_EXECUTED");
    forbidden = false; click("状態を照合"); await wait(() => button("ページ更新を再開"));
  });
  await check("property_switch_hides_old_actions_even_when_reply_arrives", async () => {
    held = true; release = undefined; click("ページ更新を再開"); await wait(() => release);
    render({ ...property, id: "00000000-0000-4000-8000-000000000099" });
    assert(!document.querySelector("form"), "OLD_FORM_VISIBLE"); assert(!button("状態を照合"), "OLD_ACTION_VISIBLE");
    release!(); await tick(); assert(!document.querySelector("form"), "LATE_REPLY_RESTORED_OLD_FORM");
  });
  await check("confirmed_held_save_can_reopen_and_save_without_dropping_reference", async () => {
    storage.removeItem(storageKey); missing = false; heldSave = true; key++; render();
    document.querySelector("form")!.requestSubmit(); await wait(() => button("最新の物件を開く")); assert(writes === 1, "SAVE_NOT_SENT");
    click("最新の物件を開く"); await wait(() => document.querySelector("fieldset") && !document.querySelector("fieldset")!.disabled);
    await wait(() => document.body.textContent!.includes("保存失敗とは確定していません"));
    heldSave = false; document.querySelector("form")!.requestSubmit(); await wait(() => writes === 2 && !!button("最新の物件を開く"));
    const refs = JSON.parse(storage.getItem(storageKey)!); assert(refs.length === 2, "HELD_REF_DROPPED"); assert(refs[0].requestId !== refs[1].requestId, "REQUEST_REUSED");
    assert(Object.keys(refs[0]).sort().join(",") === "propertyId,requestId", "RAW_EDIT_PERSISTED");
  });
}
main().then(() => finish(true)).catch(error => finish(false, String(error.message)));
function finish(success: boolean, reason?: string) {
  flushSync(() => root.unmount()); document.getElementById("result")!.textContent = JSON.stringify({ success, checks, reason, writes, mockRuns: runs,
    actualDom: true, realSessionStorage: true, componentRemountVerified: success, fullPageReloadVerified: false, realHttpServer: false, realSqlInBrowser: false, externalEffects: 0, browser: navigator.userAgent });
}
