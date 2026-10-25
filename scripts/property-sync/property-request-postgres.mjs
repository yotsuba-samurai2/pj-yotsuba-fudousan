// Synthetic-only unit34/35 checks, invoked inside the existing owned local lifecycle.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Prisma } = require("@prisma/client");
const { createPropertyWriteRequests } = require("../../src/lib/db/property-write-requests.ts");
const { PropertyWriteConflictError } = require("../../src/lib/db/property-repository.ts");
const { buildBrowserImageUpdateSql } = require("../../src/lib/rental-import/image-repair.ts");
const { contentHash } = require("../../src/lib/property-sync/rules.ts");
const { createPropertyWriteHttpHandler } = require("../../src/lib/property-write-http.ts");
const { createPropertyEditSession } = require("../../src/lib/property-edit-session.ts");
const { parsePropertyInput } = require("../../src/lib/property-validation.ts");
const sleep = ms => new Promise(r => setTimeout(r, ms));
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };
const bounded = promise => Promise.race([promise, sleep(2000).then(() => { throw new Error("LOCAL_REQUEST_TIMEOUT"); })]);

export async function runPropertyRequestChecks({ db, key, current, connect, disconnect, check, counts, restart, schemaColumns, schemaHash }) {
  const initialMedia = (await db.query("SELECT * FROM public.property_sync_media_state ORDER BY media")).rows;
  const initialAudit = (await db.query("SELECT * FROM public.property_sync_media_audit ORDER BY sequence")).rows;
  const read = () => current.repo.getPropertyById(key.propertyId);
  const receipts = async () => (await db.query("SELECT * FROM public.property_write_receipts ORDER BY request_id")).rows;
  const snapshot = async () => ({ property: await read(), receipts: await receipts(), media: (await db.query("SELECT * FROM public.property_sync_media_state ORDER BY media")).rows,
    audit: (await db.query("SELECT * FROM public.property_sync_media_audit ORDER BY sequence")).rows });
  let maximumCombinedAuditRows = 3;
  async function boundedCounts() {
    const rows = await counts(), n = (await receipts()).length;
    assert.equal(rows.audit, 3); assert.ok(n <= 7); maximumCombinedAuditRows = Math.max(maximumCombinedAuditRows, rows.audit + n); assert.ok(maximumCombinedAuditRows <= 10);
    return { ...rows, propertyReceipts: n, combinedAuditRows: rows.audit + n };
  }
  const request = async patch => ({ requestId: randomUUID(), propertyId: key.propertyId, actorRef: "synthetic-operator", expectedUpdatedAt: (await read()).updatedAt, patchJson: JSON.stringify(patch) });
  function adapter(client, options = {}) {
    return createPropertyWriteRequests({ $transaction: async (run, config) => {
      const result = await client.$transaction(async tx => run({ property: tx.property, $queryRaw: tx.$queryRaw.bind(tx), $executeRaw: async query => {
        const changed = await tx.$executeRaw(query);
        if (query.sql.includes("INSERT INTO public.property_write_receipts")) {
          if (options.failAfterInsert) throw new Error("SYNTHETIC_AFTER_RECEIPT_FAILURE");
          if (options.hold) { options.hold.locked.resolve(); await options.hold.release.promise; }
        }
        return changed;
      } }), config);
      if (options.dropReply) throw new Error("SYNTHETIC_COMMITTED_REPLY_DISCARDED");
      return result;
    } });
  }
  async function waitForBlock(blocked, blocker) {
    assert.notEqual(blocked, blocker);
    for (let i = 0; i < 60; i++) {
      if ((await db.query("SELECT pg_blocking_pids($1) AS blockers", [blocked])).rows[0].blockers.includes(blocker)) return;
      await sleep(20);
    }
    throw new Error("EXPECTED_LOCK_WAIT_NOT_OBSERVED");
  }
  let firstRequest, firstResult, duplicateConcurrency, editConcurrency;
  await check("all_existing_property_update_helpers_require_reviewed_version", async () => {
    const before = await read();
    await assert.rejects(current.repo.updateProperty(before.id, { title: "Unsafe" }, undefined), PropertyWriteConflictError);
    await assert.rejects(current.repo.upsertPropertyBySlug(before.slug, before, undefined), PropertyWriteConflictError);
    await assert.rejects(current.repo.upsertPropertyBySlug(before.slug, before, null), PropertyWriteConflictError);
    assert.deepEqual(await read(), before);
    await current.repo.updateProperty(before.id, { title: "Explicit version edit" }, before.updatedAt);
    const edited = await read(); assert.ok(edited.updatedAt > before.updatedAt);
    await assert.rejects(current.repo.upsertPropertyBySlug(before.slug, before, before.updatedAt), PropertyWriteConflictError);
    assert.equal(await current.repo.updatePropertyIfUnchanged(before.slug, before.updatedAt, { title: "Stale" }), false);
    await current.repo.upsertPropertyBySlug(edited.slug, { ...edited, description: "Reviewed seed update" }, edited.updatedAt);
    const seeded = await read(); assert.ok(seeded.updatedAt > edited.updatedAt);
    await assert.rejects(current.repo.updateProperty(before.id, { title: "Stale before seed" }, edited.updatedAt), PropertyWriteConflictError);
    assert.equal((await read()).description, "Reviewed seed update"); assert.deepEqual(await receipts(), []);
  });
  await check("same_request_id_concurrent_saves_commit_one_receipt", async () => {
    firstRequest = await request({ title: "Request saved", slug: "synthetic-request-renamed" });
    const other = await connect(), hold = { locked: deferred(), release: deferred() };
    const first = adapter(current.client, { hold }).apply(firstRequest); first.catch(() => {}); let second;
    try {
      await bounded(hold.locked.promise); second = adapter(other.client).apply(firstRequest); second.catch(() => {});
      await waitForBlock(other.pid, current.pid); duplicateConcurrency = { backendPids: [current.pid, other.pid], lockWaitObserved: true, kind: "request_advisory_lock" };
    } finally { hold.release.resolve(); firstResult = await first; }
    assert.equal(firstResult.status, "applied"); assert.equal(firstResult.replayed, false);
    assert.deepEqual(await second, { ...firstResult, replayed: true }); await disconnect(other.client);
    assert.equal((await receipts()).length, 1); assert.equal((await read()).slug, "synthetic-request-renamed");
    assert.equal((await read()).updatedAt, firstResult.resultVersion); assert.equal(contentHash(await read()), firstResult.resultHash);
  });
  await check("reused_request_id_other_actor_or_payload_is_rejected", async () => {
    const before = await snapshot(), store = adapter(current.client);
    for (const patch of [{ actorRef: "other-operator" }, { propertyId: randomUUID() }, { patchJson: JSON.stringify({ title: "Other content" }) }, { expectedUpdatedAt: (await read()).updatedAt }]) {
      assert.equal((await store.apply({ ...firstRequest, ...patch })).reason, "REQUEST_ID_CONFLICT");
    }
    assert.deepEqual(await snapshot(), before);
  });
  await check("different_requests_same_version_only_one_applies_and_both_outcomes_persist", async () => {
    const a = await request({ description: "Accepted request" }), b = { ...a, requestId: randomUUID(), patchJson: JSON.stringify({ description: "Stale request" }) };
    const other = await connect(), hold = { locked: deferred(), release: deferred() };
    const first = adapter(current.client, { hold }).apply(a); first.catch(() => {}); let second, firstResult;
    try {
      await bounded(hold.locked.promise); second = adapter(other.client).apply(b); second.catch(() => {});
      await waitForBlock(other.pid, current.pid); editConcurrency = { backendPids: [current.pid, other.pid], lockWaitObserved: true, kind: "property_row_lock" };
    } finally { hold.release.resolve(); firstResult = await first; }
    assert.equal(firstResult.status, "applied"); const stale = await second;
    assert.equal(stale.status, "held"); assert.equal(stale.reason, "VERSION_CONFLICT"); await disconnect(other.client);
    assert.deepEqual(await adapter(current.client).apply(b), { ...stale, replayed: true }); assert.equal((await receipts()).length, 3);
    assert.equal((await read()).description, "Accepted request");
  });
  await check("property_and_receipt_insert_roll_back_together_then_same_id_retries", async () => {
    const r = await request({ priceNote: null, internal: { adNote: "PRIVATE_REQUEST_AD100_当社報酬_元付" } }), before = await snapshot();
    assert.equal((await adapter(current.client, { failAfterInsert: true }).apply(r)).reason, "STORE_OUTCOME_UNKNOWN");
    assert.deepEqual(await snapshot(), before);
    assert.equal((await adapter(current.client).reconcile(r)).reason, "REQUEST_NOT_OBSERVED");
    assert.equal((await adapter(current.client).apply(r)).status, "applied");
    assert.equal((await adapter(current.client).apply(r)).replayed, true); assert.equal((await receipts()).length, 4);
    assert.equal(JSON.stringify(await receipts()).includes("PRIVATE_REQUEST"), false);
  });
  await check("lost_save_reply_recovered_by_id_hash_and_new_connection", async () => {
    const r = await request({ locationText: "Saved before reply loss" });
    assert.equal((await adapter(current.client, { dropReply: true }).apply(r)).reason, "STORE_OUTCOME_UNKNOWN");
    await disconnect(current.client); current = await connect();
    const store = adapter(current.client), recovered = await store.reconcile(r);
    assert.equal(recovered.status, "applied"); assert.equal(recovered.replayed, true); assert.equal(recovered.current, "matches");
    assert.equal(recovered.resultHash, contentHash(await read()));
    const before = await snapshot(); assert.deepEqual(await store.apply(r), recovered); assert.deepEqual(await snapshot(), before); assert.equal((await receipts()).length, 5);
  });
  await check("replay_after_later_edit_keeps_historical_result_without_overwrite", async () => {
    const now = await read(); await current.repo.updateProperty(now.id, { title: "Later manual edit" }, now.updatedAt);
    const before = await snapshot(), restored = await adapter(current.client).reconcile(firstRequest);
    assert.deepEqual(restored, { ...firstResult, replayed: true, current: "changed" });
    assert.deepEqual(await adapter(current.client).apply(firstRequest), restored); assert.deepEqual(await snapshot(), before);
  });
  await check("publication_guard_and_append_only_receipt_privileges", async () => {
    const before = await read(), r = await request({ status: "published", description: "AD100 当社報酬 元付" });
    const held = await adapter(current.client).apply(r);
    assert.equal(held.status, "held"); assert.equal(held.reason, "PUBLICATION_GATE_REJECTED"); assert.deepEqual(await read(), before);
    assert.equal((await receipts()).length, 6); assert.doesNotMatch(JSON.stringify(await receipts()), /AD100|当社報酬|元付|patchJson/);
    const [privileges] = await current.client.$queryRaw(Prisma.sql`SELECT has_table_privilege(current_user,'public.property_write_receipts','UPDATE') AS receipt_update,
      has_table_privilege(current_user,'public.property_write_receipts','DELETE') AS receipt_delete,has_table_privilege(current_user,'public.property_write_receipts','TRUNCATE') AS receipt_truncate,
      has_table_privilege('sync_test_runner','public.property_write_receipts','INSERT') AS media_receipt_insert`);
    assert.ok(Object.values(privileges).every(v => v === false));
    assert.deepEqual((await db.query("SELECT * FROM public.property_sync_media_state ORDER BY media")).rows, initialMedia);
    assert.deepEqual((await db.query("SELECT * FROM public.property_sync_media_audit ORDER BY sequence")).rows, initialAudit);
    assert.deepEqual(await boundedCounts(), { properties: 1, media: 2, audit: 3, propertyReceipts: 6, combinedAuditRows: 9 });
  });
  await check("editor_http_sql_rollback_same_id_retry_lost_response_and_later_edit", async () => {
    const before = await snapshot(), parsed = parsePropertyInput(before.property); assert.equal(parsed.ok, true);
    let fail = true, drop = false;
    const commands = [], responses = [];
    const session = createPropertyEditSession({ propertyId: key.propertyId, expectedUpdatedAt: before.property.updatedAt, newRequestId: randomUUID, send: async command => {
      commands.push(command);
      // Real Web Request/Response in-process. No HTTP listener, port, auth service or network.
      const handle = createPropertyWriteHttpHandler({ authorize: async () => ({ uid: "00000000-0000-4000-8000-000000000035" }), store: adapter(current.client, { failAfterInsert: fail }) });
      const response = await handle(new Request("https://local.invalid/api/synthetic", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(command) }), key.propertyId);
      responses.push(await response.clone().json());
      if (drop) { drop = false; throw new Error("SYNTHETIC_HTTP_RESPONSE_DISCARDED"); }
      return response;
    } });
    const edited = { ...parsed.data, title: "HTTP synthetic edit", priceNote: undefined, internal: { adNote: "PRIVATE_HTTP_AD100_当社報酬_元付" } };
    assert.equal((await session.submit(edited)).phase, "unknown"); assert.deepEqual(await snapshot(), before);
    await session.retry(); assert.equal(commands.length, 1);
    assert.equal((await session.reconcile()).phase, "not_observed");
    fail = false; drop = true;
    assert.equal((await session.retry()).phase, "unknown");
    assert.equal((await receipts()).length, 7); assert.equal((await read()).priceNote, undefined);
    assert.equal((await read()).internal.adNote, edited.internal.adNote);
    await session.submit({ ...edited, title: "Must not overwrite" }); await session.retry(); assert.equal(commands.length, 3);
    await disconnect(current.client); current = await connect();
    assert.equal((await session.reconcile()).phase, "saved");
    const after = await read(); await current.repo.updateProperty(after.id, { title: "Later edit after HTTP save" }, after.updatedAt);
    const later = await snapshot(); assert.equal((await session.reconcile()).phase, "changed"); assert.deepEqual(await snapshot(), later);
    assert.deepEqual(commands.map(c => c.operation), ["apply", "reconcile", "apply", "reconcile", "reconcile"]);
    for (const c of commands) assert.deepEqual({ ...c, operation: "apply" }, commands[0]);
    assert.doesNotMatch(JSON.stringify(responses), /PRIVATE_HTTP|AD100|当社報酬|元付|patchJson|actorRef|HTTP synthetic/);
    assert.deepEqual((await db.query("SELECT * FROM public.property_sync_media_state ORDER BY media")).rows, initialMedia);
    assert.deepEqual((await db.query("SELECT * FROM public.property_sync_media_audit ORDER BY sequence")).rows, initialAudit);
    assert.deepEqual(await boundedCounts(), { properties: 1, media: 2, audit: 3, propertyReceipts: 7, combinedAuditRows: 10 });
  });
  await check("generated_image_sql_advances_clock_rollback_version_and_rejects_replay", async () => {
    const old = await read();
    await current.repo.updateProperty(old.id, { internal: { rentalImport: { source: { provider: "eslife", roomId: "synthetic-room" } } } }, old.updatedAt);
    // Fixture-only future timestamp models a clock rollback for the generated SQL path.
    await current.client.property.update({ where: { id: key.propertyId }, data: { updatedAt: new Date("2099-01-01T00:00:00.000Z") } });
    const before = await read(), history = await receipts();
    const target = { ...before, provider: "eslife", roomId: "synthetic-room" };
    const manifest = { slug: before.slug, provider: "eslife", roomId: "synthetic-room" };
    const images = [{ url: "https://example.test/synthetic.jpg", alt: "Synthetic ' room", kind: "photo" }];
    const sql = buildBrowserImageUpdateSql(target, manifest, images);
    for (const updatedAt of [before.updatedAt.slice(0, -1), before.updatedAt.slice(0, -1).replace("T", " ")]) {
      assert.equal(buildBrowserImageUpdateSql({ ...target, updatedAt }, manifest, images), sql);
    }
    // Actual generated SQL runs under the limited property role, with no image fetch/upload.
    assert.equal((await current.client.$queryRawUnsafe(sql)).length, 1);
    const after = await read(); assert.equal(after.updatedAt, "2099-01-01T00:00:00.001Z");
    assert.deepEqual({ ...after, images: before.images, updatedAt: before.updatedAt }, before);
    assert.deepEqual(after.images, images); assert.equal((await current.client.$queryRawUnsafe(sql)).length, 0);
    assert.deepEqual(await receipts(), history);
  });
  await check("request_history_survives_restart_and_can_be_reconciled", async () => {
    const before = await snapshot(); db = await restart(); current = await connect();
    assert.deepEqual(await snapshot(), before); assert.deepEqual(await adapter(current.client).reconcile(firstRequest), { ...firstResult, replayed: true, current: "changed" });
  });
  return { schemaColumns, schemaHash, prismaVersion: "6.19.3", duplicateConcurrency, editConcurrency, rows: await boundedCounts(), maximumCombinedAuditRows,
    allRepositoryUpdatesRequireVersion: true, seedCreateOnlyByDefault: true, propertyRequestIdentityVerified: true, receiptAndPropertyAtomic: true,
    responseLossInjection: "application_reply_discarded_after_commit", changedCurrentStateDistinguished: true, editorHttpSqlVerified: true, httpListenerOpened: false, productionRoutesWired: false,
    productionSchemaApplied: false, externalExactlyOnceClaimed: false, sourceRowsPersistedAsEvidence: false };
}
