// Only imported by the owned, socket-only, synthetic Postgres harness. No production configuration.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { createMailReviewCommands } = require("../../src/lib/db/mail-review-commands.ts");
const { createMailReviewHttpHandler } = require("../../src/lib/mail-review-http.ts");
const { createMailReviewSession } = require("../../src/lib/mail-review-session.ts");
const { createMailReviewTransport } = require("../../src/lib/mail-review-transport.ts");
const { createReviewedMailImport } = require("../../src/lib/db/reviewed-mail-import.ts");
const { createDbReviewedMailStore } = require("../../src/lib/db/reviewed-mail-store.ts");
const { readPropertySourceRecord } = require("../../src/lib/db/property-source-record.ts");
const { reviewedMailFixture } = require("../../src/lib/property-sync/__tests__/reviewed-mail-fixture.ts");
const { reviewedMailAuthorityFixture } = require("../../src/lib/property-sync/__tests__/reviewed-mail-authority-fixture.ts");
const { parsePropertyInput } = require("../../src/lib/property-validation.ts");
const { contentHash } = require("../../src/lib/property-sync/rules.ts");
const { toPublicProperty } = require("../../src/lib/property-shared.ts");
const uid = "00000000-0000-4000-8000-000000000056", actor = `admin:${uid}`, origin = "https://demo.supabase.co";
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };
const pause = ms => new Promise(r => setTimeout(r, ms));
export async function runReviewCommandChecks({ db, key, current, connect, disconnect, check: executeCheck, counts, build, schemaColumns, schemaHash, reviewUi = false }) {
  const check = (name, run) => executeCheck(name, async () => { try { await run(); } catch (e) {
    const line = String(e.stack).match(/review-commands-postgres\.mjs:(\d+):\d+/)?.[1] ?? "UNKNOWN";
    throw Object.assign(new Error("REVIEW_COMMAND_CHECK_FAILED"), { code: `REVIEW_LINE_${line}` });
  } });
  const source = () => readPropertySourceRecord(current.client, key.propertyId);
  const read = () => current.repo.getPropertyById(key.propertyId);
  const media = async () => (await db.query("SELECT * FROM public.property_sync_media_state ORDER BY media")).rows;
  const mediaAudit = async () => (await db.query("SELECT * FROM public.property_sync_media_audit ORDER BY sequence")).rows;
  const initialMedia = await media(), initialAudit = await mediaAudit();
  const privateState = async () => ({ records: (await db.query("SELECT * FROM property_sync_private.mail_review_records ORDER BY review_ref")).rows,
    heads: (await db.query("SELECT * FROM property_sync_private.mail_authority_heads ORDER BY kind,scope_key")).rows,
    events: (await db.query("SELECT * FROM property_sync_private.mail_review_events ORDER BY request_id")).rows });
  let fixture, authority, command, registered, beforeProperty;
  const uiStorage = new Map(), uiCalls = [];
  let uiForbidden = false;
  function ui(requestId = randomUUID(), fault = {}) {
    const handler = createMailReviewHttpHandler({ authorize: async request => uiForbidden || request.headers.get("authorization") !== "Bearer synthetic-ui-token"
      ? { status: 403 } : { uid }, store: { apply: (c, id) => service(current.client, fault).apply(c, id),
      reconcile: (c, id) => service().reconcile(c, id), inspect: (r, id) => service().inspect(r, id) } });
    const send = createMailReviewTransport({ propertyId: key.propertyId, operatorId: uid,
      readSession: async () => ({ uid, accessToken: "synthetic-ui-token" }), fetch: async (url, init) => {
        const action = url.split("/").at(-1); uiCalls.push(action);
        return handler(new Request(`https://example.test${url}`, init), key.propertyId, action);
      } });
    return createMailReviewSession({ reference: { propertyId: key.propertyId, reviewRef: command.reviewRef, reviewHash: command.reviewHash }, operatorId: uid,
      storage: { getItem: k => uiStorage.get(k) ?? null, setItem: (k, v) => uiStorage.set(k, v) }, send, newRequestId: () => requestId });
  }
  function service(client = current.client, fault = {}) {
    return createMailReviewCommands({ $transaction: async (run, options) => {
      const result = await client.$transaction(async tx => run({ property: tx.property, $queryRaw: async q => {
        const rows = await tx.$queryRaw(q);
        if (q.sql.includes("FROM public.properties") && q.sql.includes("FOR UPDATE") && fault.hold) { fault.hold.locked.resolve(); await fault.hold.release.promise; }
        return rows;
      }, $executeRaw: async q => {
        const n = await tx.$executeRaw(q);
        if (q.sql.includes("INSERT INTO property_sync_private.mail_review_events") && fault.afterAudit) throw new Error("SYNTHETIC_AUDIT_ROLLBACK");
        return n;
      } }), options);
      if (fault.lostReply) throw new Error("SYNTHETIC_REPLY_LOSS");
      return result;
    } }, { readPrepared: async () => fault.noPrepared ? null : JSON.stringify(fixture.review), ownedStorageOrigin: origin });
  }
  async function editHead(kind, edit) {
    const row = (await db.query("SELECT * FROM property_sync_private.mail_authority_heads WHERE kind=$1", [kind])).rows[0];
    const payload = JSON.parse(row.payload_json); edit(payload);
    await db.query("UPDATE property_sync_private.mail_authority_heads SET revision=revision+1,payload_json=$2,payload_hash=$3 WHERE kind=$1", [kind, JSON.stringify(payload), contentHash(payload)]);
    return { revision: row.revision + 1, headHash: contentHash(payload) };
  }
  const revoke = (r, requestId = randomUUID()) => ({ ...command, requestId, operation: "revoke", expectedRevision: r.revision, expectedHeadHash: r.headHash });
  await check("review_producer_requires_separate_scoped_grants_and_existing_seven_heads", async () => {
    const f = reviewedMailFixture(new Date().toISOString()), parsed = parsePropertyInput({ ...f.base, priceNote: undefined, publishedAt: undefined, translations: undefined });
    assert.equal(parsed.ok, true); await current.repo.updateProperty(key.propertyId, parsed.data, (await read()).updatedAt);
    fixture = reviewedMailFixture(new Date().toISOString(), await source(), "", { operatorRef: actor, reviewerRef: uid });
    authority = reviewedMailAuthorityFixture(fixture.review); beforeProperty = await source();
    command = { operation: "register", requestId: randomUUID(), propertyId: key.propertyId, reviewRef: fixture.review.reviewRef, reviewHash: contentHash(fixture.review), expectedRevision: 0 };
    assert.equal((await service().apply(command, uid)).status, "unknown");
    await db.query(`GRANT USAGE ON SCHEMA property_sync_private TO sync_property_writer;
      GRANT SELECT,INSERT ON property_sync_private.mail_review_records,property_sync_private.mail_review_events TO sync_property_writer;
      GRANT SELECT,INSERT,UPDATE(revision,payload_hash,payload_json,lock_token) ON property_sync_private.mail_authority_heads TO sync_property_writer;
      CREATE POLICY synthetic_record_scope ON property_sync_private.mail_review_records TO sync_property_writer USING (property_id='${key.propertyId}' AND operator_ref='${actor}') WITH CHECK (property_id='${key.propertyId}' AND operator_ref='${actor}');
      CREATE POLICY synthetic_event_scope ON property_sync_private.mail_review_events TO sync_property_writer USING (property_id='${key.propertyId}' AND actor_ref='${actor}') WITH CHECK (property_id='${key.propertyId}' AND actor_ref='${actor}');
      CREATE POLICY synthetic_head_read ON property_sync_private.mail_authority_heads FOR SELECT TO sync_property_writer USING (true);
      CREATE POLICY synthetic_head_lock_update ON property_sync_private.mail_authority_heads FOR UPDATE TO sync_property_writer USING (true) WITH CHECK (kind='review');
      CREATE POLICY synthetic_head_insert ON property_sync_private.mail_authority_heads FOR INSERT TO sync_property_writer WITH CHECK (kind='review')`);
    assert.equal((await service().apply(command, uid)).reason, "REVIEW_NOT_AUTHORIZED");
    assert.deepEqual(await privateState(), { records: [], heads: [], events: [] });
    for (const h of authority.headRows.filter(h => h.kind !== "review")) await db.query("INSERT INTO property_sync_private.mail_authority_heads (kind,scope_key,revision,payload_hash,payload_json) VALUES ($1,$2,$3,$4,$5)", [h.kind,h.scope_key,h.revision,h.payload_hash,h.payload_json]);
    assert.equal((await service().apply(command, randomUUID())).reason, "PREPARED_REVIEW_UNAVAILABLE");
  });
  await check("registration_audit_failure_rolls_back_record_head_and_event", async () => {
    const before = await privateState();
    assert.equal((await service(current.client, { afterAudit: true }).apply(command, uid)).status, "unknown");
    assert.deepEqual(await privateState(), before); assert.equal(await source(), beforeProperty);
    assert.equal((await service().reconcile(command, uid)).reason, "RECEIPT_NOT_FOUND");
  });
  let duplicateWait = false;
  await check("concurrent_registration_and_commit_reply_loss_have_one_receipt", async () => {
    const other = await connect(), hold = { locked: deferred(), release: deferred() };
    const view = reviewUi ? ui(command.requestId, { hold, lostReply: true }) : undefined;
    const first = view ? view.register() : service(current.client, { hold, lostReply: true }).apply(command, uid); let second;
    if (view) { await view.register(); assert.equal(uiCalls.filter(v => v === "apply").length, 1); }
    try {
      await Promise.race([hold.locked.promise, pause(2000).then(() => { throw new Error("LOCAL_LOCK_TIMEOUT"); })]);
      second = service(other.client).apply(command, uid);
      for (let i = 0; i < 60; i++) {
        const blockers = (await db.query("SELECT pg_blocking_pids($1) AS blockers", [other.pid])).rows[0].blockers;
        if (blockers.includes(current.pid)) { duplicateWait = true; break; } await pause(20);
      }
      assert.equal(duplicateWait, true);
    } finally { hold.release.resolve(); await first; if (second) registered = await second; await disconnect(other.client); }
    assert.equal(view ? (await first).phase : (await first).status, "unknown"); assert.equal(registered.event, "registered"); assert.equal(registered.replayed, true);
    await disconnect(current.client); current = await connect();
    assert.deepEqual(await service(current.client, { noPrepared: true }).reconcile(command, uid), registered);
    if (view) {
      const reopened = ui(); await reopened.refresh(); assert.equal(reopened.getSnapshot().result.replayed, true); assert.equal(reopened.canRevoke(), true);
      assert.equal(uiCalls.filter(v => v === "apply").length, 1); assert.doesNotMatch([...uiStorage.values()].join(), /token|PRIVATE_|patchJson/);
    }
    const state = await privateState(); assert.equal(state.records.length, 1); assert.equal(state.heads.length, 8); assert.equal(state.events.length, 1);
    assert.equal(await source(), beforeProperty);
    assert.equal((await service().apply({ ...command, requestId: randomUUID() }, uid)).reason, "REVIEW_REFERENCE_EXISTS");
  });
  let importRequest;
  await check("registered_review_connects_to_existing_import_writer_and_preserves_media", async () => {
    const importer = createReviewedMailImport(current.client, createDbReviewedMailStore(current.client), origin);
    importRequest = { requestId: randomUUID(), reviewRef: command.reviewRef, reviewHash: command.reviewHash };
    const saved = await importer.apply(importRequest, key.propertyId, actor); assert.equal(saved.status, "applied");
    assert.equal((await read()).id, key.propertyId); assert.equal((await read()).priceYen, 120000);
    assert.deepEqual(await media(), initialMedia); assert.deepEqual(await mediaAudit(), initialAudit);
    assert.equal((await db.query("SELECT count(*)::int AS count FROM public.property_write_receipts")).rows[0].count, 1);
    assert.equal((await db.query("SELECT count(*)::int AS count FROM public.property_publication_effects")).rows[0].count, 1);
  });
  let revoked;
  await check("expired_head_and_changed_source_can_revoke_with_cas_and_rollback", async () => {
    const expired = await editHead("review", p => { p.validUntil = new Date(Date.parse(p.validFrom) + 1).toISOString(); });
    const c = revoke(expired), before = await privateState();
    assert.equal((await service().apply(revoke(registered), uid)).reason, "REVIEW_HEAD_CONFLICT");
    assert.equal((await service(current.client, { afterAudit: true }).apply(c, uid)).status, "unknown"); assert.deepEqual(await privateState(), before);
    if (reviewUi) {
      const view = ui(c.requestId, { lostReply: true }); await view.refresh(); assert.equal(view.canRevoke(), true);
      await view.revoke(); assert.equal(view.getSnapshot().phase, "unknown");
      assert.equal(view.getSnapshot().command.requestId, c.requestId);
      const reopened = ui(); await reopened.refresh(); assert.equal(reopened.getSnapshot().head.reviewStatus, "revoked");
      assert.equal(reopened.canRevoke(), false); const calls = uiCalls.length; await reopened.revoke(); assert.equal(uiCalls.length, calls);
    } else assert.equal((await service(current.client, { lostReply: true }).apply(c, uid)).status, "unknown");
    revoked = await service().reconcile(c, uid); assert.equal(revoked.event, "revoked"); assert.equal(revoked.replayed, true);
    assert.equal((await service().reconcile(command, uid)).current, "changed");
    assert.equal((await service().apply(revoke(revoked), uid)).event, "already_revoked");
    assert.equal((await service().apply({ ...command, requestId: randomUUID() }, uid)).reason, "REVIEW_REFERENCE_EXISTS");
    await assert.rejects(editHead("review", p => { p.status = "active"; }), e => e.code === "23000");
    const importer = createReviewedMailImport(current.client, createDbReviewedMailStore(current.client), origin);
    assert.equal((await importer.reconcile(importRequest, key.propertyId, actor)).status, "applied");
    assert.equal((await importer.apply({ ...importRequest, requestId: randomUUID() }, key.propertyId, actor)).status, "held");
  });
  if (reviewUi) await check("ui_permission_loss_and_current_head_inspection_do_not_mutate_records", async () => {
    const before = await privateState(), view = ui();
    uiForbidden = true; await view.refresh(); assert.equal(view.getSnapshot().phase, "forbidden"); assert.equal(view.canRevoke(), false);
    uiForbidden = false; await view.refresh(); assert.equal(view.getSnapshot().head.reviewStatus, "revoked");
    assert.deepEqual(await privateState(), before);
    assert.equal((await service().inspect({ propertyId: key.propertyId, reviewRef: command.reviewRef, reviewHash: command.reviewHash }, randomUUID())).status, "unavailable");
  });
  await check("private_events_are_append_only_and_public_roles_have_no_privileges", async () => {
    for (const role of ["anon", "authenticated"]) for (const table of ["mail_review_records", "mail_authority_heads", "mail_review_events"]) {
      for (const privilege of ["SELECT", "INSERT", "UPDATE", "DELETE", "TRUNCATE", "REFERENCES", "TRIGGER"]) {
        assert.equal((await db.query("SELECT has_table_privilege($1,$2,$3) AS allowed", [role, `property_sync_private.${table}`, privilege])).rows[0].allowed, false);
      }
    }
    for (const sql of ["UPDATE property_sync_private.mail_review_events SET actor_ref=actor_ref", "DELETE FROM property_sync_private.mail_review_events", "TRUNCATE property_sync_private.mail_review_events",
      "UPDATE property_sync_private.mail_authority_heads SET revision=revision+1 WHERE kind='operator'", "DELETE FROM property_sync_private.mail_review_records"])
      await assert.rejects(current.client.$executeRawUnsafe(sql));
    for (const sql of ["UPDATE property_sync_private.mail_review_events SET actor_ref=actor_ref", "DELETE FROM property_sync_private.mail_review_events"])
      await assert.rejects(db.query(sql), e => e.code === "23000");
    const baseline = authority.headRows.filter(h => h.kind !== "review");
    for (const h of baseline) {
      const actual = (await privateState()).heads.find(v => v.kind === h.kind); assert.equal(actual.revision, h.revision); assert.equal(actual.payload_hash, h.payload_hash);
    }
  });
  let buildResult;
  await check("http_recovery_no_private_payload_and_isolated_build", async () => {
    const handler = createMailReviewHttpHandler({ authorize: async () => ({ uid }), store: service() });
    const response = await handler(new Request("https://example.test/reconcile", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(command) }), key.propertyId, "reconcile");
    assert.equal(response.status, 200); const payload = await response.json(); assert.equal(payload.result.current, "changed");
    const events = (await privateState()).events;
    assert.equal(events.length, 3); assert.doesNotMatch(JSON.stringify([events, payload, toPublicProperty(await read())]), /PRIVATE_|companyIncome|patchJson|payload_json/);
    const totals = (await db.query("SELECT (SELECT count(*)::int FROM public.property_write_receipts) AS receipts, (SELECT count(*)::int FROM public.property_publication_effects) AS effects")).rows[0];
    assert.deepEqual(totals, { receipts: 2, effects: 1 });
    assert.equal(events.length + initialAudit.length + totals.receipts + totals.effects, 9);
    assert.deepEqual(await media(), initialMedia); assert.deepEqual(await mediaAudit(), initialAudit); assert.deepEqual(await counts(), { properties: 1, media: 2, audit: 3 });
    await editHead("operator", p => { p.data.canRead = false; }); assert.equal((await service().reconcile(command, uid)).reason, "REVIEW_NOT_AUTHORIZED");
    buildResult = await build(db); assert.equal(buildResult.fullBuildPassed, true);
  });
  return { schemaColumns, schemaHash, reviewCommandAdapter: "private_sql_registration_revocation", properties: 1, media: 2, mediaAudit: 3,
    privateReviewRecords: 1, authorityHeads: 8, reviewEvents: 3, propertyReceipts: 2, pendingEffects: 1, combinedAuditAndEffectRows: 9,
    duplicateRequestLockWaitObserved: duplicateWait, rollbackAndReplyLossVerified: true, expiredHeadRevocationVerified: true,
    publicPrivilegesDenied: true, eventsAppendOnly: true, syntheticAuthorityAssertionsOnly: true, realMaterialAuthorizationVerified: false,
    productionSchemaApplied: false, productionMailWriteRouteConnected: false, trustedPreparationSourceConnected: false,
    uiSessionThroughHttpToRealSql: reviewUi, browserInThisHarness: false, authenticationProviderMocked: true,
    effectsExecuted: 0, sourceRowsPersistedAsEvidence: false, build: buildResult };
}
