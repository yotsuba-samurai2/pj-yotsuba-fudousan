// Owned local Postgres only. Synthetic authority records, no production approval producer or external asset access.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { readPropertySourceRecord } = require("../../src/lib/db/property-source-record.ts");
const { createReviewedMailImport } = require("../../src/lib/db/reviewed-mail-import.ts");
const { createDbReviewedMailStore } = require("../../src/lib/db/reviewed-mail-store.ts");
const { reviewedMailFixture } = require("../../src/lib/property-sync/__tests__/reviewed-mail-fixture.ts");
const { reviewedMailAuthorityFixture } = require("../../src/lib/property-sync/__tests__/reviewed-mail-authority-fixture.ts");
const { parsePropertyInput } = require("../../src/lib/property-validation.ts");
const { contentHash } = require("../../src/lib/property-sync/rules.ts");
const { toPublicProperty } = require("../../src/lib/property-shared.ts");
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };
const pause = ms => new Promise(r => setTimeout(r, ms));
export async function runReviewAuthorityChecks({ db, key, current, connect, disconnect, check: executeCheck, counts, build, schemaColumns, schemaHash }) {
  const check = (name, run) => executeCheck(name, async () => { try { await run(); } catch (e) {
    const line = String(e.stack).match(/review-authority-postgres\.mjs:(\d+):\d+/)?.[1] ?? "UNKNOWN";
    throw Object.assign(new Error("REVIEW_AUTHORITY_CHECK_FAILED"), { code: `AUTHORITY_LINE_${line}` });
  } });
  const source = () => readPropertySourceRecord(current.client, key.propertyId);
  const read = () => current.repo.getPropertyById(key.propertyId);
  const flow = async () => ({ receipts: (await db.query("SELECT * FROM public.property_write_receipts ORDER BY request_id")).rows,
    effects: (await db.query("SELECT * FROM public.property_publication_effects ORDER BY request_id")).rows });
  const media = async () => (await db.query("SELECT * FROM public.property_sync_media_state ORDER BY media")).rows;
  const audit = async () => (await db.query("SELECT * FROM public.property_sync_media_audit ORDER BY sequence")).rows;
  const initialMedia = await media(), initialAudit = await audit();
  let fixture, authority;
  const getStore = () => createDbReviewedMailStore(current.client);
  const ownerTx = { $queryRaw: async q => (await db.query(q.text, q.values)).rows };
  async function updateHead(kind, edit) {
    const row = (await db.query("SELECT * FROM property_sync_private.mail_authority_heads WHERE kind=$1", [kind])).rows[0];
    const payload = JSON.parse(row.payload_json); edit(payload);
    await db.query("UPDATE property_sync_private.mail_authority_heads SET revision=revision+1,payload_json=$2,payload_hash=$3 WHERE kind=$1", [kind, JSON.stringify(payload), contentHash(payload)]);
  }
  const locked = () => current.client.$transaction(tx => getStore().lockCurrent(tx, authority.reference));
  const request = () => ({ requestId: randomUUID(), reviewRef: authority.reference.reviewRef, reviewHash: authority.reference.reviewHash });
  function service(fault = {}) {
    return createReviewedMailImport({ $transaction: async (run, options) => {
      const result = await current.client.$transaction(async tx => run({ property: tx.property, $queryRaw: async q => {
        const rows = await tx.$queryRaw(q);
        if (q.sql.includes("mail_authority_heads") && fault.hold) { fault.hold.locked.resolve(); await fault.hold.release.promise; }
        return rows;
      }, $executeRaw: async q => {
        const n = await tx.$executeRaw(q);
        if (q.sql.includes("INSERT INTO public.property_publication_effects") && fault.rollback) throw new Error("SYNTHETIC_AUTHORITY_ROLLBACK");
        return n;
      } }), options);
      if (fault.lostReply) throw new Error("SYNTHETIC_REPLY_LOST");
      return result;
    } }, getStore(), "https://demo.supabase.co");
  }
  const apply = (r, s = service()) => s.apply(r, key.propertyId, authority.reference.operatorRef);
  const reconcile = r => service().reconcile(r, key.propertyId, authority.reference.operatorRef);
  await check("private_review_schema_and_bounded_synthetic_records", async () => {
    const f = reviewedMailFixture(new Date().toISOString()), parsed = parsePropertyInput({ ...f.base, priceNote: undefined, publishedAt: undefined, translations: undefined }); assert.equal(parsed.ok, true);
    await current.repo.updateProperty(key.propertyId, parsed.data, (await read()).updatedAt);
    fixture = reviewedMailFixture(new Date().toISOString(), await source()); authority = reviewedMailAuthorityFixture(fixture.review);
    assert.equal(fixture.review.match.target.episodeId, key.episodeId);
    const row = authority.recordRow;
    await db.query("INSERT INTO property_sync_private.mail_review_records VALUES ($1,$2,$3,$4,$5)", [row.review_ref,row.property_id,row.operator_ref,row.review_hash,row.record_json]);
    for (const h of authority.headRows) await db.query("INSERT INTO property_sync_private.mail_authority_heads (kind,scope_key,revision,payload_hash,payload_json) VALUES ($1,$2,$3,$4,$5)", [h.kind,h.scope_key,h.revision,h.payload_hash,h.payload_json]);
    await assert.rejects(getStore().readImmutable(authority.reference)); // No implicit schema access, even for the property writer.
    await db.query("GRANT USAGE ON SCHEMA property_sync_private TO sync_property_writer; GRANT SELECT ON ALL TABLES IN SCHEMA property_sync_private TO sync_property_writer");
    await db.query("CREATE POLICY synthetic_record_read ON property_sync_private.mail_review_records FOR SELECT TO sync_property_writer USING (property_id='" + key.propertyId + "'); CREATE POLICY synthetic_head_read ON property_sync_private.mail_authority_heads FOR SELECT TO sync_property_writer USING (true)");
    await assert.rejects(getStore().readImmutable(authority.reference)); // SELECT alone cannot lock current heads.
    await db.query("GRANT UPDATE(lock_token) ON property_sync_private.mail_authority_heads TO sync_property_writer; CREATE POLICY synthetic_head_lock ON property_sync_private.mail_authority_heads FOR UPDATE TO sync_property_writer USING (true) WITH CHECK (false)");
    assert.deepEqual(await getStore().readImmutable(authority.reference), fixture.review); assert.deepEqual(await locked(), fixture.review);
  });
  await check("revoked_review_cannot_reactivate_through_missing_or_null_status", async () => {
    for (const missing of [true, false]) {
      await db.query("BEGIN");
      try {
        await updateHead("review", p => { p.status = "revoked"; });
        await assert.rejects(updateHead("review", p => { if (missing) delete p.status; else p.status = null; }), e => e.code === "23000");
      } finally { await db.query("ROLLBACK"); }
    }
  });
  await check("public_roles_and_reader_cannot_modify_private_authority", async () => {
    for (const role of ["anon", "authenticated"]) {
      assert.equal((await db.query("SELECT has_schema_privilege($1,'property_sync_private','USAGE') AS allowed", [role])).rows[0].allowed, false);
      for (const table of ["mail_review_records", "mail_authority_heads"]) for (const privilege of ["SELECT", "INSERT", "UPDATE", "DELETE", "TRUNCATE", "REFERENCES", "TRIGGER"]) {
        assert.equal((await db.query("SELECT has_table_privilege($1,$2,$3) AS allowed", [role, `property_sync_private.${table}`, privilege])).rows[0].allowed, false);
      }
    }
    for (const sql of ["UPDATE property_sync_private.mail_authority_heads SET payload_hash=repeat('f',64)",
      "UPDATE property_sync_private.mail_authority_heads SET revision=revision+1", "DELETE FROM property_sync_private.mail_authority_heads",
      "TRUNCATE property_sync_private.mail_authority_heads", "UPDATE property_sync_private.mail_authority_heads SET lock_token=FALSE",
      "UPDATE property_sync_private.mail_review_records SET record_json='{}'"]) await assert.rejects(current.client.$executeRawUnsafe(sql));
    await assert.rejects(db.query("UPDATE property_sync_private.mail_review_records SET record_json=record_json"), e => e.code === "23000");
    await assert.rejects(db.query("UPDATE property_sync_private.mail_authority_heads SET revision=revision"), e => e.code === "23000");
  });
  await check("changed_or_missing_heads_fail_inside_real_sql_transactions", async () => {
    // Fault injection is rolled back, never published as a new real approval/history.
    for (const kind of ["operator", "reviewer", "episode", "review", "rules", "policies", "permissions", "materials"]) {
      await db.query("BEGIN");
      try {
        await updateHead(kind, p => { p.data = {}; });
        assert.equal(await getStore().lockCurrent(ownerTx, authority.reference), null);
      } finally { await db.query("ROLLBACK"); }
    }
    await db.query("BEGIN");
    try { await db.query("DELETE FROM property_sync_private.mail_authority_heads WHERE kind='review'"); assert.equal(await getStore().lockCurrent(ownerTx, authority.reference), null); }
    finally { await db.query("ROLLBACK"); }
    assert.deepEqual(await locked(), fixture.review);
  });
  await check("write_revocation_blocks_new_save_but_preserves_owner_read", async () => {
    const before = await source(); await updateHead("operator", p => { p.data.canApply = false; });
    assert.deepEqual(await getStore().readImmutable(authority.reference), fixture.review);
    assert.equal((await apply(request())).reason, "PUBLICATION_GATE_REJECTED"); assert.equal(await source(), before);
    // Restore this synthetic test grant for the following independent persistence scenario.
    await updateHead("operator", p => { p.data.canApply = true; });
  });
  let savedRequest, revocationBlocked = false;
  await check("sql_rollback_retains_original_command_for_explicit_retry", async () => {
    savedRequest = request(); const before = { source: await source(), flow: await flow() };
    assert.equal((await apply(savedRequest, service({ rollback: true }))).status, "unknown");
    assert.deepEqual({ source: await source(), flow: await flow() }, before);
    assert.equal((await reconcile(savedRequest)).reason, "REQUEST_NOT_OBSERVED");
  });
  await check("authority_revocation_waits_for_save_and_lost_reply_recovers", async () => {
    const hold = { locked: deferred(), release: deferred() }, first = apply(savedRequest, service({ hold, lostReply: true })); first.catch(() => {});
    let revoke;
    try {
      await Promise.race([hold.locked.promise, pause(2000).then(() => { throw new Error("LOCAL_AUTHORITY_LOCK_TIMEOUT"); })]);
      revoke = updateHead("review", p => { p.status = "revoked"; }); revoke.catch(() => {});
      for (let i = 0; i < 60; i++) {
        const other = await connect();
        try { const [v] = await other.client.$queryRawUnsafe(`SELECT pg_blocking_pids(${db.syntheticPid}) AS blockers`); if (v.blockers.includes(current.pid)) { revocationBlocked = true; break; } }
        finally { await disconnect(other.client); }
        await pause(20);
      }
      assert.equal(revocationBlocked, true);
    } finally { hold.release.resolve(); await first; if (revoke) await revoke; }
    assert.equal((await first).status, "unknown");
    await disconnect(current.client); current = await connect();
    assert.equal(await locked(), null); const result = await reconcile(savedRequest); assert.equal(result.status, "applied"); assert.equal(result.current, "matches");
    const before = await flow(); assert.deepEqual(await apply(savedRequest), result); assert.deepEqual(await flow(), before);
    await assert.rejects(updateHead("review", p => { p.status = "active"; }), e => e.code === "23000");
    await updateHead("operator", p => { p.data.canRead = false; });
    assert.equal(await getStore().readImmutable(authority.reference), null);
  });
  let buildResult;
  await check("private_heads_and_media_are_separate_with_isolated_build", async () => {
    assert.deepEqual(await media(), initialMedia); assert.deepEqual(await audit(), initialAudit);
    assert.deepEqual(await counts(), { properties: 1, media: 2, audit: 3 });
    const events = await flow(); assert.equal(events.receipts.length, 2); assert.equal(events.effects.length, 1);
    assert.doesNotMatch(JSON.stringify([events, toPublicProperty(await read())]), /PRIVATE_|companyIncome|reviewerRef|payload_json/);
    buildResult = await build(db); assert.equal(buildResult.fullBuildPassed, true);
  });
  return { schemaColumns, schemaHash, authorityAdapter: "private_sql_store", syntheticAuthorityAssertionsOnly: true,
    privateReviewRecords: 1, authorityHeads: 8, properties: 1, media: 2, mediaAudit: 3, propertyReceipts: 2, pendingEffects: 1,
    combinedAuditAndEffectRows: 6, reviewRevocationLockWaitObserved: revocationBlocked, defaultGrantRevocationVerified: true,
    readerCannotModifyAuthority: true, rollbackAndLostReplyRecoveryVerified: true, effectsExecuted: 0,
    productionMailWriteRouteConnected: false, trustedApprovalProducerConnected: false, realMaterialAuthorizationVerified: false,
    productionSchemaApplied: false, sourceRowsPersistedAsEvidence: false, build: buildResult };
}
