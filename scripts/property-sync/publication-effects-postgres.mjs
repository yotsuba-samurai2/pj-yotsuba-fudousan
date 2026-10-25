// Synthetic effects only: no Next cache, IndexNow, email or customer notification adapters.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Prisma } = require("@prisma/client");
const { createPropertyWriteRequests } = require("../../src/lib/db/property-write-requests.ts");
const { createPublicationEffectStore } = require("../../src/lib/db/publication-effects.ts");
const { createPublicationEffectRunner } = require("../../src/lib/property-publication-effects.ts");
const sleep = ms => new Promise(r => setTimeout(r, ms));
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };

export async function runPublicationEffectChecks({ db, key, current, connect, connectWorker, disconnect, check, counts, restart, build, schemaColumns, schemaHash }) {
  let worker = await connectWorker();
  const read = () => current.repo.getPropertyById(key.propertyId);
  const state = async () => (await db.query("SELECT * FROM public.property_publication_effects ORDER BY request_id")).rows;
  const snapshots = async () => ({ property: await read(), effects: await state(),
    receipts: (await db.query("SELECT * FROM public.property_write_receipts ORDER BY request_id")).rows,
    media: (await db.query("SELECT * FROM public.property_sync_media_state ORDER BY media")).rows,
    audit: (await db.query("SELECT * FROM public.property_sync_media_audit ORDER BY sequence")).rows });
  const baseMedia = (await snapshots()).media, baseAudit = (await snapshots()).audit;
  const req = async patch => ({ requestId: randomUUID(), propertyId: key.propertyId, actorRef: "synthetic-effects-operator", expectedUpdatedAt: (await read()).updatedAt, patchJson: JSON.stringify(patch) });
  const proof = (t, outcome) => ({ operationId: t.operationId, attemptId: t.attemptId, targetHash: t.targetHash, outcome });
  const ledger = new Map(), calls = [];
  let failNext = false, loseNext = false, heldRun;
  const port = {
    async run(t) {
      calls.push(t);
      // Immutable terminal provider receipt also fences any late repeat of the same attempt.
      if (ledger.has(t.attemptId)) return ledger.get(t.attemptId);
      if (heldRun) { const h = heldRun; heldRun = undefined; h.started.resolve(); await h.release.promise; }
      const p = ledger.get(t.attemptId) ?? proof(t, failNext ? "not_applied_final" : "acknowledged"); failNext = false; ledger.set(t.attemptId, p);
      if (loseNext) { loseNext = false; throw new Error("SYNTHETIC_EFFECT_REPLY_LOSS"); } return p;
    },
    async reconcile(t) { return ledger.get(t.attemptId) ?? proof(t, "unknown"); },
  };
  const runner = client => createPublicationEffectRunner(createPublicationEffectStore(client), { cache: port, notification: port });
  const ref = r => ({ requestId: r.requestId, propertyId: r.propertyId });
  const save = r => createPropertyWriteRequests(current.client, { localPublicationEffects: true }).apply(r);
  let first, second, buildResult;
  await check("property_receipt_effect_plan_commit_or_rollback_together", async () => {
    first = await req({ slug: "synthetic-effect-a", status: "published", dealType: "land", title: "Synthetic public property", description: "Synthetic public description",
      spec: { dealType: "land", landAreaSqm: 60, privateRoadAreaSqm: 0, landCategory: "宅地", zoning: "住居地域", buildingCoverage: "60%", floorAreaRatio: "200%", legalRestrictions: "Synthetic" },
      internal: { memo: "PRIVATE_EFFECT_AD100_当社報酬_元付" }, priceNote: null, publishedAt: "2026-10-25" });
    const before = await snapshots();
    const broken = { $transaction: (run, opts) => current.client.$transaction(tx => run({ property: tx.property, $queryRaw: tx.$queryRaw.bind(tx),
      $executeRaw: async sql => { const result = await tx.$executeRaw(sql); if (sql.sql.includes("INSERT INTO public.property_publication_effects")) throw new Error("SYNTHETIC_AFTER_OUTBOX_INSERT"); return result; } }), opts) };
    assert.equal((await createPropertyWriteRequests(broken, { localPublicationEffects: true }).apply(first)).status, "unknown"); assert.deepEqual(await snapshots(), before);
    assert.equal((await save(first)).status, "applied"); const saved = await snapshots(); assert.equal(saved.effects.length, 1); assert.equal(saved.receipts.length, 1);
    assert.equal((await save(first)).replayed, true); assert.deepEqual(await snapshots(), saved);
    assert.doesNotMatch(JSON.stringify(saved.effects), /PRIVATE_EFFECT|AD100|当社報酬|元付|memo|description|Synthetic public/);
  });
  await check("cache_retry_and_lost_notification_reply_do_not_resave_property", async () => {
    const property = await read(), r = runner(worker.client);
    assert.equal((await r.resume(ref(first), "notification")).reason, "CACHE_NOT_ACKNOWLEDGED");
    failNext = true; assert.equal((await r.resume(ref(first), "cache")).status, "retry_ready");
    assert.equal((await r.resume(ref(first), "cache")).status, "acknowledged");
    loseNext = true; assert.equal((await r.resume(ref(first), "notification")).status, "unknown");
    const n = calls.length;
    await disconnect(worker.client); worker = await connectWorker();
    assert.equal((await runner(worker.client).resume(ref(first), "notification")).status, "acknowledged");
    await runner(worker.client).resume(ref(first), "cache"); assert.equal(calls.length, n); assert.deepEqual(await read(), property);
  });
  await check("later_edit_rename_and_parallel_workers_keep_distinct_effects", async () => {
    second = await req({ slug: "synthetic-effect-b", priceYen: 12345678 }); assert.equal((await save(second)).status, "applied");
    const property = await read(); assert.equal((await state()).length, 2);
    const other = await connectWorker(), hold = { started: deferred(), release: deferred() }; heldRun = hold;
    const run = runner(worker.client).resume(ref(second), "cache"); run.catch(() => {});
    try {
      await Promise.race([hold.started.promise, sleep(2000).then(() => { throw new Error("EFFECT_START_TIMEOUT"); })]);
      const n = calls.length; assert.equal((await runner(other.client).resume(ref(second), "cache")).status, "unknown"); assert.equal(calls.length, n);
    } finally { hold.release.resolve(); await disconnect(other.client); }
    assert.equal((await run).status, "acknowledged"); assert.deepEqual(await read(), property);
    const ticket = calls.at(-1); assert.deepEqual(ticket.targets, ["synthetic-effect-a", "synthetic-effect-b"]);
    const n = calls.length; await runner(worker.client).resume(ref(first), "notification"); assert.equal(calls.length, n);
  });
  await check("lost_claim_commit_requires_terminal_fence_before_retry", async () => {
    const before = await read(), count = calls.length;
    const lostCommit = { $transaction: async (run, opts) => { await worker.client.$transaction(run, opts); throw new Error("SYNTHETIC_CLAIM_REPLY_LOSS"); } };
    const lostRunner = createPublicationEffectRunner(createPublicationEffectStore(lostCommit), { notification: port });
    assert.equal((await lostRunner.resume(ref(second), "notification")).status, "unknown"); assert.equal(calls.length, count);
    const unresolved = await snapshots(); db = await restart(); current = await connect(); worker = await connectWorker();
    assert.deepEqual(await snapshots(), unresolved);
    const row = (await state()).find(r => r.request_id === second.requestId), attemptId = row.state.notification.attemptId;
    assert.equal((await runner(worker.client).resume(ref(second), "notification")).status, "unknown"); assert.equal(calls.length, count);
    // Only the synthetic provider can terminally cancel. A real provider without this capability stays unknown.
    const { contentHash } = require("../../src/lib/property-sync/rules.ts");
    const t = { operationId: `${second.requestId}:notification`, attemptId, targetHash: contentHash({ planHash: row.plan_hash, kind: "notification" }), kind: "notification", targets: row.plan.notificationPaths };
    ledger.set(attemptId, proof(t, "not_applied_final"));
    assert.equal((await runner(worker.client).resume(ref(second), "notification")).status, "retry_ready");
    assert.equal((await port.run(t)).outcome, "not_applied_final");
    assert.equal((await runner(worker.client).resume(ref(second), "notification")).status, "acknowledged"); assert.deepEqual(await read(), before);
  });
  await check("effect_worker_privileges_other_state_unchanged_and_restart", async () => {
    const [permissions] = await worker.client.$queryRaw(Prisma.sql`SELECT has_table_privilege(current_user,'public.properties','UPDATE') AS property_update,
      has_table_privilege(current_user,'public.property_write_receipts','INSERT') AS receipt_insert,
      has_column_privilege(current_user,'public.property_publication_effects','plan','UPDATE') AS plan_update,
      has_table_privilege(current_user,'public.property_publication_effects','DELETE') AS effect_delete,
      has_table_privilege(current_user,'public.property_publication_effects','TRUNCATE') AS effect_truncate`);
    assert.ok(Object.values(permissions).every(v => v === false));
    const before = await snapshots(), n = calls.length; db = await restart(); current = await connect(); worker = await connectWorker();
    assert.deepEqual(await snapshots(), before);
    for (const request of [first, second]) for (const kind of ["cache", "notification"]) assert.equal((await runner(worker.client).resume(ref(request), kind)).status, "acknowledged");
    assert.equal(calls.length, n); assert.deepEqual(before.media, baseMedia); assert.deepEqual(before.audit, baseAudit);
    assert.deepEqual(await counts(), { properties: 1, media: 2, audit: 3 }); assert.equal(before.receipts.length, 2); assert.equal(before.effects.length, 2);
  });
  await check("isolated_schema_readonly_build_preserves_synthetic_rows", async () => {
    const before = await snapshots(); buildResult = await build(db); assert.deepEqual(await snapshots(), before);
    // Environmental build failures are reported separately, not represented as passing the full build.
    assert.equal(buildResult.readOnlyRole, true); assert.equal(buildResult.emptyExtraTablesUnchanged, true);
  });
  return { schemaColumns, schemaHash, rows: { ...(await counts()), propertyReceipts: 2, effectPlans: 2, combinedAuditAndControlRows: 7 },
    build: buildResult, actualExternalEffects: 0, syntheticEffectCalls: calls.length, propertyNeverResavedByWorker: true, terminalFenceRequiredForRetry: true,
    restartVerified: true, productionRoutesWired: false, publicationVerified: false, sourceRowsPersistedAsEvidence: false };
}
