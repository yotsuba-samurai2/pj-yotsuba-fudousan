// In-process HTTP + real SQL. All transports/providers are injected; no network dispatch.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { createPropertyWriteRequests } = require("../../src/lib/db/property-write-requests.ts");
const { createPropertyWriteHttpHandler } = require("../../src/lib/property-write-http.ts");
const { createPropertyRecoveryHttpHandler } = require("../../src/lib/property-recovery-http.ts");
const { createPropertyRecoverySession } = require("../../src/lib/property-recovery-session.ts");
const { createPropertyEditSession } = require("../../src/lib/property-edit-session.ts");
const { createPublicationEffectStore } = require("../../src/lib/db/publication-effects.ts");
const { createPublicationEffectRunner } = require("../../src/lib/property-publication-effects.ts");
const { toPublicProperty } = require("../../src/lib/property-shared.ts");
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };
const bounded = async promise => { let timer; try { return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("LOCAL_UI_TIMEOUT")), 4000); })]); } finally { clearTimeout(timer); } };
export async function runPublicationUiChecks({ db, key, current, connect, connectWorker, disconnect, check, counts, restart, build, schemaColumns, schemaHash }) {
  const uid = randomUUID(), memory = new Map(), storage = { getItem: k => memory.get(k) ?? null, setItem: (k,v) => memory.set(k,v) };
  const request = body => new Request("https://local.invalid/synthetic", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const read = () => current.repo.getPropertyById(key.propertyId);
  const snap = async () => ({ property: await read(), media: (await db.query("SELECT * FROM public.property_sync_media_state ORDER BY media")).rows,
    audit: (await db.query("SELECT * FROM public.property_sync_media_audit ORDER BY sequence")).rows });
  const base = await snap(); let worker = await connectWorker(), permission = { uid }, lostHttp = false, hold;
  const ledger = new Map(), calls = [], reconciles = [];
  const proof = (t, outcome) => ({ operationId: t.operationId, attemptId: t.attemptId, targetHash: t.targetHash, outcome });
  const port = { async run(t) { calls.push(t); if (hold) { const h = hold; hold = undefined; h.started.resolve(); await h.release.promise; } const p = proof(t, "acknowledged"); ledger.set(t.attemptId, p); return p; },
    async reconcile(t) { reconciles.push(t); return ledger.get(t.attemptId) ?? proof(t, "unknown"); } };
  const handler = () => { const store = createPublicationEffectStore(worker.client); return createPropertyRecoveryHttpHandler({ authorize: async () => permission, store,
    runner: createPublicationEffectRunner(store, { cache: port, notification: port }), receipts: createPropertyWriteRequests(worker.client) }); };
  const send = async command => { const response = await handler()(request(command), key.propertyId); if (lostHttp) { lostHttp = false; throw new Error("SYNTHETIC_HTTP_LOSS"); } return response; };
  const session = () => createPropertyRecoverySession({ propertyId: key.propertyId, operatorId: uid, storage, send });
  let recovery = session(), saved, firstRef, secondRef, heldRef, buildResult;
  await check("editor_save_receipt_and_recovery_plan_use_verified_actor", async () => {
    const before = await read(), { id, createdAt, updatedAt, ...input } = before;
    assert.equal(id, key.propertyId); assert.ok(createdAt);
    const patch = { ...input, slug: "synthetic-ui-a", status: "published", dealType: "land", title: "Synthetic public property", description: "Synthetic public description",
      spec: { dealType: "land", landAreaSqm: 60, privateRoadAreaSqm: 0, landCategory: "宅地", zoning: "住居地域", buildingCoverage: "60%", floorAreaRatio: "200%", legalRestrictions: "Synthetic" },
      internal: { memo: "PRIVATE_EFFECT_AD100_当社報酬_元付" }, priceNote: undefined, publishedAt: "2026-10-25" };
    const http = createPropertyWriteHttpHandler({ authorize: async () => ({ uid }), store: createPropertyWriteRequests(current.client, { localPublicationEffects: true }) });
    let writes = 0;
    const editor = createPropertyEditSession({ propertyId: id, expectedUpdatedAt: updatedAt, rememberRequest: recovery.remember,
      send: async command => { writes++; assert.equal(recovery.getSnapshot().refs.length, 1); const response = await http(request(command), id); if (writes === 1) throw new Error("SYNTHETIC_SAVE_REPLY_LOSS"); return response; } });
    await Promise.all([editor.submit(patch), editor.submit(patch)]); assert.equal(writes, 1); assert.equal(editor.getSnapshot().phase, "unknown");
    await editor.reconcile(); assert.equal(editor.getSnapshot().phase, "saved");
    firstRef = recovery.getSnapshot().refs[0]; assert.deepEqual(Object.keys(firstRef).sort(), ["propertyId", "requestId"]);
    saved = await read(); recovery = session(); await recovery.inspect(); assert.equal(recovery.getSnapshot().summary.cache.status, "pending"); assert.equal(calls.length, 0);
    const safe = JSON.stringify(toPublicProperty(saved)); assert.doesNotMatch(safe, /PRIVATE_EFFECT|AD100|当社報酬|元付/);
  });
  await check("double_click_and_reopen_during_execution_only_reconcile", async () => {
    const h = { started: deferred(), release: deferred() }; hold = h;
    const pending = recovery.resume("cache"); pending.catch(() => {});
    try {
      await bounded(h.started.promise); await recovery.resume("cache");
      const reopened = session(); await reopened.inspect(); assert.equal(reopened.getSnapshot().summary.cache.status, "running");
      await reopened.resume("cache"); assert.equal(reopened.getSnapshot().phase, "unknown"); assert.equal(calls.length, 1); assert.equal(reconciles.length, 1);
      recovery = reopened;
    } finally { h.release.resolve(); await pending; }
    await recovery.inspect(); assert.equal(recovery.getSnapshot().summary.cache.status, "acknowledged"); assert.deepEqual(await read(), saved);
  });
  await check("permission_failure_then_lost_notification_reply_never_resends", async () => {
    permission = { status: 403 }; await recovery.resume("notification"); assert.equal(recovery.getSnapshot().phase, "forbidden"); assert.equal(calls.length, 1);
    permission = { uid }; await recovery.resume("notification"); assert.equal(calls.length, 1); await recovery.inspect();
    lostHttp = true; await recovery.resume("notification"); assert.equal(recovery.getSnapshot().phase, "unknown"); assert.equal(calls.length, 2);
    await recovery.resume("notification"); assert.equal(calls.length, 2);
    await disconnect(worker.client); worker = await connectWorker(); recovery = session(); await recovery.inspect();
    assert.equal(recovery.getSnapshot().summary.notification.status, "acknowledged"); await recovery.resume("notification"); assert.equal(calls.length, 2);
    assert.deepEqual(await read(), saved);
  });
  await check("foreign_actor_property_and_actor_body_are_not_authorized_by_ref", async () => {
    permission = { uid: randomUUID() }; assert.equal((await send({ ...firstRef, operation: "status" })).status, 404); permission = { uid };
    assert.equal((await send({ ...firstRef, propertyId: randomUUID(), operation: "cache" })).status, 409);
    assert.equal((await send({ ...firstRef, actorRef: `admin:${uid}`, operation: "cache" })).status, 400);
    assert.equal(calls.length, 2);
  });
  await check("confirmed_held_request_kept_while_fresh_edit_can_save", async () => {
    // A stale edit produces a held receipt without an effect plan. It must not erase the older ref.
    const writer = createPropertyWriteRequests(current.client, { localPublicationEffects: true });
    heldRef = { propertyId: key.propertyId, requestId: randomUUID() }; recovery.remember(heldRef);
    const lostReplyWriter = createPropertyWriteRequests({ async $transaction(run, options) { await current.client.$transaction(run, options); throw new Error("SYNTHETIC_HELD_COMMIT_REPLY_LOSS"); } }, { localPublicationEffects: true });
    const held = await lostReplyWriter.apply({ ...heldRef, actorRef: `admin:${uid}`, expectedUpdatedAt: base.property.updatedAt, patchJson: JSON.stringify({ priceYen: 1 }) });
    assert.equal(held.status, "unknown"); await recovery.inspect(); assert.equal(recovery.getSnapshot().phase, "ready");
    assert.equal(recovery.getSnapshot().heldReceipt.reason, "VERSION_CONFLICT"); assert.equal(recovery.forgetCompleted(), false);
    // Latest version, new request. No unsafe ref deletion or original patch replay.
    secondRef = { propertyId: key.propertyId, requestId: randomUUID() }; assert.equal(recovery.remember(secondRef), true);
    const second = await writer.apply({ ...secondRef, actorRef: `admin:${uid}`, expectedUpdatedAt: saved.updatedAt, patchJson: JSON.stringify({ slug: "synthetic-ui-b" }) });
    assert.equal(second.status, "applied"); assert.equal(session().getSnapshot().refs.length, 3);
    await recovery.inspect(); await recovery.resume("cache"); await recovery.resume("notification"); saved = await read();
  });
  await check("restart_restores_completed_requests_and_runtime_cannot_edit_property", async () => {
    db = await restart(); current = await connect(); worker = await connectWorker();
    recovery = session(); await recovery.inspect(); assert.equal(recovery.getSnapshot().summary.notification.status, "acknowledged");
    const n = calls.length; await recovery.resume("cache"); await recovery.resume("notification"); assert.equal(calls.length, n); assert.deepEqual(await read(), saved);
    const response = await send({ ...secondRef, operation: "status" }); assert.doesNotMatch(await response.text(), /PRIVATE_EFFECT|initiatorHash|planHash|notificationPaths|attemptId|internal/);
    const privileges = await worker.client.$queryRawUnsafe("SELECT has_table_privilege(current_user,'public.properties','UPDATE') AS write,has_table_privilege(current_user,'public.property_publication_effects','DELETE') AS delete");
    assert.ok(Object.values(privileges[0]).every(v => v === false));
    assert.equal(recovery.forgetCompleted(), true); assert.equal(session().getSnapshot().refs.length, 2);
    const final = await snap(); assert.deepEqual(final.media, base.media); assert.deepEqual(final.audit, base.audit);
  });
  await check("held_receipt_owner_scope_legacy_denial_and_readonly_removal", async () => {
    const before = await snap(), receiptsBefore = (await db.query("SELECT * FROM public.property_write_receipts ORDER BY request_id")).rows;
    recovery.select(heldRef.requestId); await recovery.inspect(); assert.equal(recovery.getSnapshot().heldReceipt.reason, "VERSION_CONFLICT");
    permission = { uid: randomUUID() }; assert.equal((await send({ ...heldRef, operation: "status" })).status, 404); permission = { uid };
    assert.equal((await send({ ...heldRef, operation: "notification" })).status, 404);
    assert.equal((await send({ propertyId: key.propertyId, requestId: randomUUID(), operation: "status" })).status, 404);
    const reader = createPropertyWriteRequests(worker.client);
    assert.equal(await reader.inspectHeld({ ...firstRef, actorRef: `admin:${uid}` }), null);
    assert.equal(await reader.inspectHeld({ ...heldRef, propertyId: randomUUID(), actorRef: `admin:${uid}` }), null);
    assert.equal(recovery.forgetConfirmedHeld(), true); assert.deepEqual(session().getSnapshot().refs, [firstRef]);
    assert.deepEqual((await db.query("SELECT * FROM public.property_write_receipts ORDER BY request_id")).rows, receiptsBefore); assert.deepEqual(await snap(), before);
    const privileges = await worker.client.$queryRawUnsafe("SELECT has_table_privilege(current_user,'public.property_write_receipts','UPDATE') AS update,has_table_privilege(current_user,'public.property_write_receipts','DELETE') AS delete,has_table_privilege(current_user,'public.property_write_receipts','TRUNCATE') AS truncate");
    assert.ok(Object.values(privileges[0]).every(v => v === false));
    const legacyId = randomUUID();
    await db.query("INSERT INTO public.property_write_receipts (request_id,property_id,request_hash,expected_version,result_version,result_hash,outcome,reason,initiator_hash) SELECT $1::uuid,property_id,request_hash,expected_version,result_version,result_hash,outcome,reason,NULL FROM public.property_write_receipts WHERE request_id=$2::uuid", [legacyId, heldRef.requestId]);
    assert.equal((await send({ propertyId: key.propertyId, requestId: legacyId, operation: "status" })).status, 404);
    const response = await send({ ...heldRef, operation: "status" }), body = await response.json();
    assert.deepEqual(Object.keys(body).sort(), ["outcome", "propertyId", "publication", "reason", "requestId", "resultVersion"]);
    assert.equal(body.outcome, "confirmed_held"); assert.doesNotMatch(JSON.stringify(body), /PRIVATE_|initiator|resultHash|patch|internal/);
    assert.equal((await db.query("SELECT initiator_hash FROM public.property_write_receipts WHERE request_id=$1::uuid", [legacyId])).rows[0].initiator_hash, null);
  });
  await check("isolated_build_and_public_artifacts", async () => { buildResult = await build(db); assert.equal(buildResult.fullBuildPassed, true); });
  const rows = { ...await counts(), propertyReceipts: (await db.query("SELECT count(*)::int AS n FROM public.property_write_receipts")).rows[0].n,
    effectPlans: (await db.query("SELECT count(*)::int AS n FROM public.property_publication_effects")).rows[0].n };
  rows.combinedAuditAndControlRows = rows.audit + rows.propertyReceipts + rows.effectPlans; assert.ok(rows.combinedAuditAndControlRows <= 10);
  return { schemaColumns, schemaHash, rows, build: buildResult, syntheticEffectCalls: calls.length, actualExternalEffects: 0,
    realSqlHttpClientFlow: true, browserInThisHarness: false, propertyNeverResavedByRecovery: true, restartVerified: true,
    sourceRowsPersistedAsEvidence: false, productionRoutesWired: false, publicationVerified: false };
}
