// Local PGlite 0.5.11 only; no URL, credentials, data directory, network client or server.
// node --import tsx scripts/property-sync/check-workflow-db.mjs /absolute/path/to/sql-test-runtime
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { isAbsolute, resolve } from "node:path";
import { randomUUID } from "node:crypto";

async function checkWorkflowDb() {
  if (process.argv.length !== 3 || !isAbsolute(process.argv[2])) throw new Error("INVALID_RUNTIME_ARGUMENT");
  const runtime = resolve(process.argv[2]);
  const pkg = JSON.parse(await readFile(resolve(runtime, "node_modules/@electric-sql/pglite/package.json"), "utf8"));
  if (pkg.version !== "0.5.11" || pkg.name !== "@electric-sql/pglite") throw new Error("RUNTIME_VERSION_MISMATCH");
  const { PGlite } = createRequire(resolve(runtime, "package.json"))("@electric-sql/pglite");
  const require = createRequire(import.meta.url);
  const { runSyntheticWorkflow } = require("../../src/lib/property-sync/synthetic-workflow.ts");
  const { createDbMediaStore, mediaSql, RolledBackTransaction } = require("../../src/lib/property-sync/db-media-store.ts");
  const { createMediaJournal, verifyMediaJournal } = require("../../src/lib/property-sync/audit.ts");
  const { contentHash } = require("../../src/lib/property-sync/rules.ts");
  const schema = await readFile(new URL("../../docs/property-sync/proposals/media-audit-schema.sql", import.meta.url), "utf8");
  const db = new PGlite(), checks = [];
  const check = async (name, run) => { await run(); checks.push({ name, passed: true }); };
  let key, originalProperties, originalAthome, lastRequest, workflow, initialized = false;
  let failAfterInsert = false, loseNextReply = true, inserts = 0, confirmedRollbacks = 0, lostReplies = 0;
  let maxAuditRows = 0;
  const counts = async () => {
    const { rows } = await db.query(`SELECT (SELECT count(*)::int FROM public.properties) AS properties,
      (SELECT count(*)::int FROM public.property_sync_media_state) AS media,
      (SELECT count(*)::int FROM public.property_sync_media_audit) AS audit`);
    assert.equal(rows[0].properties, 1); assert.equal(rows[0].media, 2); assert.ok(rows[0].audit <= 10);
    maxAuditRows = Math.max(maxAuditRows, rows[0].audit); return rows[0];
  };
  const store = createDbMediaStore({ async transaction(run) {
    // Only a successful explicit ROLLBACK is reported as known rolled back.
    const result = await db.transaction(async tx => {
      try {
        return await run({ query: async (statement, parameters) => {
          if (statement === mediaSql.append) {
            const count = (await tx.query("SELECT count(*)::int AS count FROM public.property_sync_media_audit")).rows[0].count;
            if (count >= 10) throw new Error("SYNTHETIC_AUDIT_LIMIT");
            inserts++;
          }
          if (statement === mediaSql.update && failAfterInsert) throw new Error("SYNTHETIC_AFTER_INSERT_FAILURE");
          return tx.query(statement, [...parameters]);
        } });
      } catch {
        await tx.rollback(); confirmedRollbacks++;
        throw new RolledBackTransaction();
      }
    });
    // This is outside the rollback catch: COMMIT succeeded, only the reply is lost.
    if (loseNextReply) { loseNextReply = false; lostReplies++; throw new Error("SYNTHETIC_COMMIT_REPLY_LOST"); }
    return result;
  } });
  const readJournal = async () => db.transaction(async tx => {
    const parameters = [key.propertyId, key.episodeId, key.media];
    const state = (await tx.query(mediaSql.state, parameters)).rows[0];
    const events = (await tx.query(mediaSql.events, parameters)).rows.map(row => row.event);
    const journal = verifyMediaJournal({ schemaVersion: 1, genesis: state.genesis, state: state.state, events, headHash: state.head_hash });
    assert.ok(journal); assert.equal(state.version, events.length); return journal;
  });
  const snapshot = async () => ({ journal: await readJournal(), rows: await counts() });
  try {
    await db.exec("CREATE TABLE public.properties (id TEXT PRIMARY KEY, status TEXT NOT NULL, updated_at TIMESTAMPTZ NOT NULL)");
    await db.exec(schema);
    await check("unit29フローをSQL保存へ接続し、commit応答喪失を読戻しで照合", async () => {
      workflow = await runSyntheticWorkflow("workflow-success", {
        initialize: async state => {
          assert.equal(initialized, false); initialized = true;
          key = { propertyId: state.propertyId, episodeId: state.episodeId, media: "site" };
          await db.query("INSERT INTO public.properties VALUES ($1,'draft',$2)", [state.propertyId, state.listing.propertyVersion.updatedAt]);
          for (const media of ["site", "athome"]) {
            const j = createMediaJournal({ ...state, media });
            await db.query("INSERT INTO public.property_sync_media_state (property_id,episode_id,media,genesis,state,head_hash) VALUES ($1,$2,$3,$4::jsonb,$4::jsonb,$5)",
              [state.propertyId, state.episodeId, media, JSON.stringify(j.genesis), j.headHash]);
          }
          originalProperties = (await db.query("SELECT * FROM public.properties")).rows;
          originalAthome = (await db.query("SELECT * FROM public.property_sync_media_state WHERE media='athome'")).rows;
          assert.equal((await counts()).audit, 0);
        },
        read: readJournal,
        apply: async request => { lastRequest = structuredClone(request); return store.apply(key, request); },
      });
      assert.equal(workflow.expectedResultMatched, true);
      assert.equal(workflow.result.realObservationAvailable, false);
      assert.equal(workflow.result.auditPersistence, "injected_test_store");
      assert.equal(workflow.result.mockReadbackMatched, true);
      assert.equal(workflow.result.steps.filter(s => s.reason === "LOCAL_COMMIT_CONFIRMED_BY_READBACK").length, 1);
      assert.equal((await counts()).audit, 3); assert.equal(inserts, 3); assert.equal(lostReplies, 1);
      assert.equal((await readJournal()).headHash, workflow.result.audit.mediaHeadHash);
    });
    await check("同一request再送は状態・監査を追加しない", async () => {
      const before = await snapshot(), beforeInserts = inserts;
      const result = await store.apply(key, lastRequest);
      assert.equal(result.replayed, true); assert.equal(result.status, "unchanged");
      assert.deepEqual(await snapshot(), before); assert.equal(inserts, beforeInserts);
    });
    const nextRequest = async (id = randomUUID()) => {
      const journal = await readJournal(), pc = journal.state.observations.pc;
      const at = new Date(Math.max(Date.now(), Date.parse(journal.events.at(-1).at) + 1)).toISOString();
      return { requestId: id, actorRef: "synthetic-sql", at, command: { type: "observe", ...key, surface: "pc",
        expectedListingRevision: journal.state.listing.revision, expectedObservationRevision: pc.revision,
        evidence: { evidenceId: `sql-${id}`, observedAt: at, acquisition: "mock", authorizationRef: "synthetic-only", visibility: "published",
          exactUnitConfirmed: true, contentHash: pc.contentHash, companyFirst: "not_applicable" } } };
    };
    await check("古い掲載版は保留し、状態を変えず保留監査だけを追加", async () => {
      const before = await readJournal(), r = await nextRequest(); r.command.expectedListingRevision = 0;
      const result = await store.apply(key, r); assert.equal(result.reason, "LISTING_VERSION_CONFLICT");
      const after = await readJournal(); assert.deepEqual(after.state, before.state); assert.equal(after.events.length, 4);
    });
    await check("同時要求はPGlite単一接続のtransaction直列化で一方だけ採用", async () => {
      const a = await nextRequest(), b = structuredClone(a); b.requestId = randomUUID(); b.command.evidence.evidenceId = `sql-${b.requestId}`;
      const results = await Promise.all([store.apply(key, a), store.apply(key, b)]);
      assert.deepEqual(results.map(r => r.status).sort(), ["applied", "held"]);
      assert.equal(results.find(r => r.status === "held").reason, "OBSERVATION_VERSION_CONFLICT");
      const j = await readJournal(); assert.equal(j.state.observations.pc.revision, 2); assert.equal(j.events.length, 6);
    });
    const retry = await nextRequest();
    await check("監査INSERT後の障害は明示rollbackし状態・監査を両方保持", async () => {
      const before = await snapshot(), beforeInserts = inserts;
      failAfterInsert = true;
      try { assert.equal((await store.apply(key, retry)).reason, "TRANSACTION_ROLLED_BACK"); }
      finally { failAfterInsert = false; }
      assert.equal(inserts, beforeInserts + 1); assert.equal(confirmedRollbacks, 1); assert.deepEqual(await snapshot(), before);
    });
    await check("rollback確認済みの同一requestを再実行して1回だけ保存", async () => {
      assert.equal((await store.apply(key, retry)).status, "applied");
      assert.equal((await store.apply(key, retry)).replayed, true);
      assert.equal((await counts()).audit, 7);
    });
    await check("commit後応答喪失はrollback扱いせず元requestの保存を読戻し確認", async () => {
      const r = await nextRequest(), beforeRollbacks = confirmedRollbacks; loseNextReply = true;
      assert.equal((await store.apply(key, r)).reason, "STORE_OUTCOME_UNKNOWN");
      assert.equal(confirmedRollbacks, beforeRollbacks);
      const read = await readJournal(), matches = read.events.filter(e => e.requestId === r.requestId);
      assert.equal(matches.length, 1); assert.equal(matches[0].commandHash, contentHash(r.command));
      assert.equal(matches[0].afterHash, contentHash(read.state)); assert.equal(matches[0].outcome.status, "applied");
      const beforeInserts = inserts; assert.equal((await store.apply(key, r)).replayed, true);
      assert.equal(inserts, beforeInserts); assert.equal((await counts()).audit, 8);
    });
    await check("物件本体と他媒体行は不変、全件数は1物件・2媒体・監査10以下", async () => {
      assert.deepEqual((await db.query("SELECT * FROM public.properties")).rows, originalProperties);
      assert.deepEqual((await db.query("SELECT * FROM public.property_sync_media_state WHERE media='athome'")).rows, originalAthome);
      assert.equal((await db.query("SELECT count(*)::int AS count FROM public.property_sync_media_audit WHERE media='athome'")).rows[0].count, 0);
      assert.deepEqual(await counts(), { properties: 1, media: 2, audit: 8 });
    });
    const report = { schemaVersion: 1, sourceOrigin: "synthetic_generated", purpose: "workflow_db_integration", engine: "PGlite", engineVersion: pkg.version,
      memoryOnly: true, executable: false, externalConnection: false, realPostgresMultiConnectionVerified: false, supabaseVerified: false,
      expectedResultMatched: true, checks, rows: await counts(), maximumObservedAuditRows: maxAuditRows,
      confirmedRollbacks, simulatedLostReplies: lostReplies, workflow, finalMediaHeadHash: (await readJournal()).headHash };
    assert.doesNotMatch(JSON.stringify(report), /SYNTHETIC_PRIVATE_|adNote|recordJson|contractRef/);
    return report;
  } finally { await db.close(); }
}
checkWorkflowDb().then(report => process.stdout.write(JSON.stringify(report, null, 2) + "\n"))
  .catch(() => { process.stderr.write(JSON.stringify({ status: "failed", reason: "LOCAL_SQL_WORKFLOW_CHECK_FAILED", executable: false, externalConnection: false }) + "\n"); process.exitCode = 1; });
