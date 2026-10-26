// Real SQL persistence; review authority/material verification remains an explicitly synthetic injected store.
// Called only inside the owned, Unix-socket-only lifecycle. Never reads application credentials or live mail.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { readPropertySourceRecord } = require("../../src/lib/db/property-source-record.ts");
const { createReviewedMailImport } = require("../../src/lib/db/reviewed-mail-import.ts");
const { reviewedMailFixture } = require("../../src/lib/property-sync/__tests__/reviewed-mail-fixture.ts");
const { contentHash } = require("../../src/lib/property-sync/rules.ts");
const { parsePropertyInput } = require("../../src/lib/property-validation.ts");
const { toPublicProperty } = require("../../src/lib/property-shared.ts");
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

export async function runReviewedMailChecks({ db, key, current, connect, disconnect, check: executeCheck, counts, build, schemaColumns, schemaHash }) {
  const check = (name, run) => executeCheck(name, async () => { try { await run(); } catch (e) {
    const line = String(e.stack).match(/reviewed-mail-postgres\.mjs:(\d+):\d+/)?.[1] ?? "UNKNOWN";
    throw Object.assign(new Error("REVIEWED_MAIL_CHECK_FAILED"), { code: `REVIEWED_LINE_${line}` });
  } });
  const read = () => current.repo.getPropertyById(key.propertyId);
  const source = () => readPropertySourceRecord(current.client, key.propertyId);
  const media = async () => (await db.query("SELECT * FROM public.property_sync_media_state ORDER BY media")).rows;
  const audit = async () => (await db.query("SELECT * FROM public.property_sync_media_audit ORDER BY sequence")).rows;
  const receipts = async () => (await db.query("SELECT * FROM public.property_write_receipts ORDER BY request_id")).rows;
  const effects = async () => (await db.query("SELECT * FROM public.property_publication_effects ORDER BY request_id")).rows;
  const snapshot = async () => ({ source: await source(), receipts: await receipts(), effects: await effects(), media: await media(), audit: await audit() });
  const initialMedia = await media(), initialAudit = await audit();
  const at = () => new Date().toISOString();
  function bundle(f) {
    assert.equal(f.review.match.target.propertyId, key.propertyId); assert.equal(f.review.match.target.episodeId, key.episodeId);
    const active = { record: structuredClone(f.review), locks: 0 };
    const request = { requestId: randomUUID(), reviewRef: f.review.reviewRef, reviewHash: contentHash(f.review) };
    function service(client = current.client, fault = {}) {
      const store = {
        readImmutable: async reference => { assert.equal(reference.operatorRef, f.review.operatorRef); assert.equal(reference.propertyId, key.propertyId); return structuredClone(f.review); },
        lockCurrent: async () => { active.locks++; return structuredClone(active.record); },
      };
      return createReviewedMailImport({ $transaction: async (run, options) => {
        const result = await client.$transaction(async tx => run({ property: tx.property, $queryRaw: tx.$queryRaw.bind(tx), $executeRaw: async query => {
          const n = await tx.$executeRaw(query);
          if (query.sql.includes("INSERT INTO public.property_publication_effects") && fault.rollback) throw new Error("SYNTHETIC_EFFECT_ROLLBACK");
          if (query.sql.includes("INSERT INTO public.property_write_receipts") && fault.hold) { fault.hold.locked.resolve(); await fault.hold.release.promise; }
          return n;
        } }), options);
        if (fault.lostReply) throw new Error("SYNTHETIC_COMMIT_REPLY_LOST");
        return result;
      } }, store, "https://demo.supabase.co");
    }
    return { request, active, service, apply: (s = service(), r = request) => s.apply(r, key.propertyId, f.review.operatorRef),
      reconcile: (s = service()) => s.reconcile(request, key.propertyId, f.review.operatorRef) };
  }
  async function fresh() { return bundle(reviewedMailFixture(at(), await source())); }
  let first, second, blocked = false;
  await check("review_revocation_blocks_save_before_sql_mutation", async () => {
    const fixture = reviewedMailFixture(at()), parsed = parsePropertyInput({ ...fixture.base, priceNote: undefined, publishedAt: undefined, translations: undefined }); assert.equal(parsed.ok, true);
    const original = await read(); await current.repo.updateProperty(key.propertyId, parsed.data, original.updatedAt);
    first = await fresh(); const before = await source(); first.active.record.status = "revoked";
    assert.equal((await first.apply()).reason, "PUBLICATION_GATE_REJECTED"); assert.equal(await source(), before);
    assert.equal((await receipts()).length, 1); assert.equal((await effects()).length, 0);
  });
  await check("reviewed_save_and_duplicate_serialize_on_real_backend_locks", async () => {
    first = await fresh(); const other = await connect(), hold = { locked: deferred(), release: deferred() };
    const a = first.apply(first.service(current.client, { hold })); a.catch(() => {});
    let b;
    try {
      await Promise.race([hold.locked.promise, pause(2000).then(() => { throw new Error("LOCAL_REVIEW_LOCK_TIMEOUT"); })]);
      b = first.apply(first.service(other.client)); b.catch(() => {});
      for (let i = 0; i < 60; i++) {
        if ((await db.query("SELECT pg_blocking_pids($1) AS blockers", [other.pid])).rows[0].blockers.includes(current.pid)) { blocked = true; break; }
        await pause(20);
      }
      assert.equal(blocked, true);
    } finally { hold.release.resolve(); await a; if (b) await b; await disconnect(other.client); }
    assert.equal((await a).status, "applied"); assert.deepEqual(await b, { ...await a, replayed: true });
    assert.equal(first.active.locks, 1); assert.equal((await receipts()).length, 2); assert.equal((await effects()).length, 1);
    const saved = await read(); assert.equal(saved.id, key.propertyId); assert.equal(saved.priceYen, 120000); assert.equal(saved.status, "draft");
    assert.equal(saved.internal.operatorMemo, "PRIVATE_ORIGINAL_MEMO");
  });
  await check("stale_review_version_cannot_overwrite_saved_property", async () => {
    const before = await source();
    assert.equal((await first.apply(first.service(), { ...first.request, requestId: randomUUID() })).reason, "VERSION_CONFLICT");
    assert.equal(await source(), before); assert.equal((await receipts()).length, 3);
  });
  await check("property_receipt_effects_rollback_and_commit_reply_recovery", async () => {
    second = await fresh(); const before = await snapshot();
    assert.equal((await second.apply(second.service(current.client, { rollback: true }))).status, "unknown");
    assert.deepEqual(await snapshot(), before); assert.equal((await second.reconcile()).reason, "REQUEST_NOT_OBSERVED");
    assert.equal((await second.apply(second.service(current.client, { lostReply: true }))).status, "unknown");
    await disconnect(current.client); current = await connect(); second.active.record.status = "revoked";
    const locks = second.active.locks, recovered = await second.reconcile();
    assert.equal(recovered.status, "applied"); assert.equal(recovered.current, "matches");
    const committed = await snapshot(); assert.deepEqual(await second.apply(), recovered); assert.deepEqual(await snapshot(), committed);
    assert.equal(second.active.locks, locks); assert.equal((await receipts()).length, 4); assert.equal((await effects()).length, 2);
  });
  await check("same_timestamp_manual_edit_is_preserved", async () => {
    const next = await fresh(), before = await read();
    await db.query("UPDATE public.properties SET description=$2 WHERE id=$1", [key.propertyId, "合成の手動編集を保持"]);
    assert.equal((await read()).updatedAt, before.updatedAt);
    assert.equal((await next.apply()).reason, "VERSION_CONFLICT"); assert.equal((await read()).description, "合成の手動編集を保持");
    assert.equal((await receipts()).length, 5); assert.equal((await effects()).length, 2);
  });
  let buildResult;
  await check("separate_media_audit_private_projection_and_isolated_build", async () => {
    assert.deepEqual(await media(), initialMedia); assert.deepEqual(await audit(), initialAudit);
    assert.deepEqual(await counts(), { properties: 1, media: 2, audit: 3 });
    assert.equal((await receipts()).length + (await effects()).length + (await audit()).length, 10);
    assert.doesNotMatch(JSON.stringify([await receipts(), await effects(), toPublicProperty(await read())]), /PRIVATE_|companyIncome|reviewerRef/);
    buildResult = await build(db); assert.equal(buildResult.fullBuildPassed, true);
  });
  return { schemaColumns, schemaHash, reviewedMailCompositionVerified: true, reviewAuthorityAdapter: "synthetic_injected_only",
    productionMailWriteRouteConnected: false, realMaterialAuthorizationVerified: false, concurrentDuplicateSqlLockObserved: blocked,
    rollbackAndReplyRecoveryVerified: true, properties: 1, media: 2, mediaAudit: 3, propertyReceipts: 5, pendingEffects: 2, combinedAuditAndEffectRows: 10,
    effectsExecuted: 0, sourceRowsPersistedAsEvidence: false, productionSchemaApplied: false, build: buildResult };
}
