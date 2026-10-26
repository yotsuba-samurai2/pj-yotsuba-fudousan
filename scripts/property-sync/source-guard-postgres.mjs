// Synthetic-only checks inside the existing owned, Unix-socket-only Postgres lifecycle.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { readPropertySourceRecord } = require("../../src/lib/db/property-source-record.ts");
const { fingerprintPropertySource } = require("../../src/lib/property-sync/source-fingerprint.ts");
const { createPropertyWriteRequests } = require("../../src/lib/db/property-write-requests.ts");
const { createMailInbox, appendMailInbox } = require("../../src/lib/property-sync/local-mail-inbox.ts");
const { matchMailToCanonicalProperty } = require("../../src/lib/property-sync/mail-canonical-match.ts");
const { contentHash } = require("../../src/lib/property-sync/rules.ts");
const { rentalIdentity } = require("../../src/lib/rental-import/validation.ts");
const { fixture: rentalFixture } = require("../../src/lib/rental-import/__tests__/fixtures.ts");
const { toPublicProperty } = require("../../src/lib/property-shared.ts");
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

export async function runSourceGuardChecks({ db, key, current, connect, disconnect, check: executeCheck, counts, build, schemaColumns, schemaHash }) {
  // Report only this synthetic script's line number; assertion payloads can contain private fixture fields.
  const check = (name, run) => executeCheck(name, async () => { try { await run(); } catch (e) {
    const line = String(e.stack).match(/source-guard-postgres\.mjs:(\d+):\d+/)?.[1] ?? "UNKNOWN";
    const reason = typeof e.code === "string" && /^[A-Z0-9_]{1,20}$/.test(e.code) ? `_${e.code}` : "";
    throw Object.assign(new Error("SOURCE_GUARD_CHECK_FAILED"), { code: `SOURCE_LINE_${line}${reason}` });
  } });
  const read = () => current.repo.getPropertyById(key.propertyId);
  const sourceText = () => readPropertySourceRecord(current.client, key.propertyId);
  const source = async () => { const s = fingerprintPropertySource(await sourceText()); assert.equal(s.status, "fingerprinted"); return s; };
  const media = async () => (await db.query("SELECT * FROM public.property_sync_media_state ORDER BY media")).rows;
  const audit = async () => (await db.query("SELECT * FROM public.property_sync_media_audit ORDER BY sequence")).rows;
  const receipts = async () => (await db.query("SELECT * FROM public.property_write_receipts ORDER BY request_id")).rows;
  const snapshot = async () => ({ source: await sourceText(), receipts: await receipts(), media: await media(), audit: await audit() });
  const initialMedia = await media(), initialAudit = await audit();
  const request = async patch => ({ requestId: randomUUID(), propertyId: key.propertyId, actorRef: "synthetic-reviewed-mail",
    expectedUpdatedAt: (await source()).version.updatedAt, expectedSourceHash: (await source()).version.fullHash, patchJson: JSON.stringify(patch) });
  function writer(client = current.client, fault = {}) {
    return createPropertyWriteRequests({ $transaction: async (run, options) => {
      const result = await client.$transaction(async tx => run({ property: tx.property, $queryRaw: tx.$queryRaw.bind(tx), $executeRaw: async query => {
        const n = await tx.$executeRaw(query);
        if (query.sql.includes("INSERT INTO public.property_write_receipts")) {
          if (fault.rollback) throw new Error("SYNTHETIC_RECEIPT_ROLLBACK");
          if (fault.hold) { fault.hold.locked.resolve(); await fault.hold.release.promise; }
        }
        return n;
      } }), options);
      if (fault.lostReply) throw new Error("SYNTHETIC_COMMIT_REPLY_LOST");
      return result;
    } });
  }
  async function race(a, b) {
    const other = await connect(), hold = { locked: deferred(), release: deferred() };
    const first = writer(current.client, { hold }).apply(a); first.catch(() => {});
    let second, blocked = false;
    try {
      await Promise.race([hold.locked.promise, pause(2000).then(() => { throw new Error("LOCAL_SOURCE_LOCK_TIMEOUT"); })]);
      second = writer(other.client).apply(b); second.catch(() => {});
      for (let i = 0; i < 60; i++) {
        if ((await db.query("SELECT pg_blocking_pids($1) AS blockers", [other.pid])).rows[0].blockers.includes(current.pid)) { blocked = true; break; }
        await pause(20);
      }
      assert.equal(blocked, true);
    } finally { hold.release.resolve(); await first; if (second) await second; await disconnect(other.client); }
    return [await first, await second];
  }
  let mailRequest, replyLossReconciled = false;
  await check("mail_match_source_guard_synthetic_draft_save_and_lost_reply", async () => {
    const source = rentalFixture().source;
    await current.client.property.update({ where: { id: key.propertyId }, data: { slug: `rent-${rentalIdentity(source)}`, priceYen: 130000n,
      internal: { adNote: "PRIVATE_SOURCE_GUARD_CANARY", rentalImport: { source } } } });
    const at = new Date().toISOString(), inbox = createMailInbox({ mailboxRef: "synthetic-mailbox" }, at);
    const appended = appendMailInbox(inbox, { expectedHeadHash: inbox.headHash, mail: { schemaVersion: 1, mailboxRef: "synthetic-mailbox", messageId: "synthetic-message",
      receivedAt: at, receivedAtBasis: "provider_internal_date", folder: "incoming", subject: "合成物件", attachmentsPresent: false,
      parts: [{ mimeType: "text/plain", decoding: "confirmed", decodedText: "物件名: 合成物件\n取引種別: 賃貸\n用途: 居住用\n賃料: 120000円\n間取り: 2DK\n専有面積: 47㎡" }] } }, at);
    assert.equal(appended.status, "recorded");
    const candidate = appended.journal.entries[0].candidate, fp = fingerprintPropertySource(await sourceText()); assert.equal(fp.status, "fingerprinted");
    const target = { propertyId: key.propertyId, episodeId: key.episodeId, version: fp.version };
    const evidence = { evidenceRef: "synthetic-identity-review", messageKey: candidate.messageKey, candidateHash: contentHash(candidate), target,
      status: "confirmed", method: "manual_exact_room", confirmedAt: at, reviewerRef: "synthetic-reviewer", sourceRef: "synthetic-only",
      identity: { building: source.building, address: source.address, unit: source.unit } };
    const matched = await matchMailToCanonicalProperty({ mailboxRef: "synthetic-mailbox", messageKey: candidate.messageKey, candidateHash: contentHash(candidate),
      target, identityEvidenceRef: evidence.evidenceRef, identityEvidenceHash: contentHash(evidence) }, {
      readInbox: async () => appended.journal, readIdentityEvidence: async () => evidence, clock: () => new Date().toISOString(),
      readTarget: async binding => {
        assert.deepEqual(binding, { propertyId: key.propertyId, episodeId: key.episodeId });
        const recordJson = await sourceText();
        return { recordJson, metadataJson: JSON.stringify({ ...binding, market: "residential_rental", snapshotRef: "synthetic-sql", capturedAt: new Date().toISOString() }) };
      },
    });
    assert.equal(matched.status, "matched_proposal"); assert.equal(matched.executable, false);
    // Explicit fixture-only field review. A match/unconfirmed field proposal is NOT production write authorization.
    mailRequest = { ...await request({ priceYen: 120000 }), expectedUpdatedAt: matched.canonicalTarget.version.updatedAt,
      expectedSourceHash: matched.canonicalTarget.version.fullHash };
    assert.equal((await writer(current.client, { lostReply: true }).apply(mailRequest)).status, "unknown");
    await disconnect(current.client); current = await connect();
    const result = await writer().reconcile(mailRequest); assert.equal(result.status, "applied"); assert.equal(result.current, "matches"); replyLossReconciled = true;
    assert.equal((await read()).priceYen, 120000); assert.equal((await read()).id, target.propertyId); assert.equal((await read()).status, "draft");
    assert.equal((await read()).slug, `rent-${rentalIdentity(source)}`);
    const saved = await snapshot(); assert.deepEqual(await writer().apply(mailRequest), result); assert.deepEqual(await snapshot(), saved);
    assert.equal((await writer().apply({ ...mailRequest, expectedSourceHash: undefined })).reason, "REQUEST_ID_CONFLICT");
  });
  await check("same_timestamp_internal_edit_is_held_and_receipt_still_recovers", async () => {
    const r = await request({ title: "Must not replace manual edit" }), before = await read();
    await db.query("UPDATE public.properties SET internal=jsonb_set(internal,'{adNote}',to_jsonb($2::text)) WHERE id=$1", [key.propertyId, "PRIVATE_SOURCE_LATER_EDIT"]);
    assert.equal((await read()).updatedAt, before.updatedAt);
    assert.equal((await writer().apply(r)).reason, "VERSION_CONFLICT");
    assert.equal((await read()).title, before.title); assert.equal((await writer().reconcile(mailRequest)).current, "changed");
    assert.equal((await receipts()).length, 2);
  });
  await check("raw_jsonb_precision_bigint_nulls_and_timezone_normalization", async () => {
    const valid = await sourceText(), record = JSON.parse(valid), r = await request({ title: "Reject lossy source" });
    assert.equal(Object.keys(record).length, 22); assert.equal(record.priceNote, null); assert.equal(record.translations, null);
    const zoneText = await current.client.$transaction(async tx => { await tx.$executeRawUnsafe("SET LOCAL TIME ZONE 'Asia/Tokyo'"); return readPropertySourceRecord(tx, key.propertyId); });
    assert.equal(zoneText, valid);
    await db.query("UPDATE public.properties SET spec=jsonb_set(spec,'{exclusiveAreaSqm}','0.100000000000000000001'::jsonb) WHERE id=$1", [key.propertyId]);
    const lossy = await sourceText(); assert.match(lossy, /0\.100000000000000000001/);
    assert.equal(fingerprintPropertySource(lossy).status, "held"); assert.equal((await writer().apply(r)).reason, "VERSION_CONFLICT");
    await db.query("UPDATE public.properties SET spec=$2::jsonb,price_yen=9007199254740993 WHERE id=$1", [key.propertyId, JSON.stringify(record.spec)]);
    const large = await sourceText(); assert.match(large, /9007199254740993/); assert.equal(fingerprintPropertySource(large).status, "held");
    await db.query("UPDATE public.properties SET price_yen=$2,translations='{}'::jsonb WHERE id=$1", [key.propertyId, record.priceYen]);
    assert.notEqual((await source()).version.fullHash, fingerprintPropertySource(valid).version.fullHash);
    await db.query("UPDATE public.properties SET translations=NULL WHERE id=$1", [key.propertyId]);
    assert.equal(await sourceText(), valid); assert.equal((await receipts()).length, 3);
    // Era-less ISO formatting must never alias BC to AD, or silently widen its four-digit year contract.
    for (const date of ["0001-01-01 BC", "10000-01-01"]) {
      await db.query("UPDATE public.properties SET created_at=$2::timestamp WHERE id=$1", [key.propertyId, date]);
      assert.equal(await sourceText(), null);
    }
    await db.query("UPDATE public.properties SET created_at=$2::timestamp WHERE id=$1", [key.propertyId, record.createdAt]);
    assert.equal(await sourceText(), valid);
  });
  await check("source_guard_receipt_and_property_roll_back_together", async () => {
    const r = await request({ priceNote: "Synthetic reviewed amount" }), before = await snapshot();
    assert.equal((await writer(current.client, { rollback: true }).apply(r)).reason, "STORE_OUTCOME_UNKNOWN"); assert.deepEqual(await snapshot(), before);
    assert.equal((await writer().reconcile(r)).reason, "REQUEST_NOT_OBSERVED");
    assert.equal((await writer().apply(r)).status, "applied"); assert.equal((await receipts()).length, 4);
  });
  await check("guarded_duplicate_and_competing_requests_use_real_database_locks", async () => {
    const r = await request({ priceNote: "Concurrent reviewed amount" }), [a, b] = await race(r, r);
    assert.equal(a.status, "applied"); assert.deepEqual(b, { ...a, replayed: true }); assert.equal((await receipts()).length, 5);
    const first = await request({ priceNote: "Winning reviewed amount" }), second = { ...first, requestId: randomUUID(), patchJson: JSON.stringify({ priceNote: "Losing amount" }) };
    const [winner, loser] = await race(first, second); assert.equal(winner.status, "applied"); assert.equal(loser.reason, "VERSION_CONFLICT");
    assert.equal((await receipts()).length, 7); assert.equal((await read()).priceNote, "Winning reviewed amount");
  });
  let buildResult;
  await check("media_audit_and_private_projection_unchanged_with_isolated_build", async () => {
    assert.deepEqual(await media(), initialMedia); assert.deepEqual(await audit(), initialAudit);
    assert.doesNotMatch(JSON.stringify([await receipts(), toPublicProperty(await read())]), /PRIVATE_SOURCE|adNote|rentalImport|expectedSourceHash/);
    assert.deepEqual(await counts(), { properties: 1, media: 2, audit: 3 }); assert.equal((await receipts()).length + (await audit()).length, 10);
    buildResult = await build(db);
    assert.equal(buildResult.fullBuildPassed, true);
  });
  return { schemaColumns, schemaHash, sourceHashGuard: true, mailMatchAndSyntheticDraftWrite: true, productionMailWriteRouteConnected: false,
    publicationOrAdoptionAuthorizedByMatch: false, rawJsonbPrecisionPreserved: true, replyLossReconciled, guardedConcurrentRequestsVerified: true,
    properties: 1, media: 2, propertyReceipts: 7, combinedAuditRows: 10, build: buildResult, sourceRowsPersistedAsEvidence: false, productionSchemaApplied: false };
}
