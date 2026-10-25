// Explicit local-only test harness. Never accepts a database URL or reads application .env files.
import assert from "node:assert/strict";
import { mkdir, readFile, open, appendFile, lstat, realpath, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { randomBytes, randomUUID } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createFullPropertyCheck } from "./full-property-postgres.mjs";

const exec = promisify(execFile);
const scriptRoot = dirname(fileURLToPath(import.meta.url));
const expectedRuntime = resolve(scriptRoot, "../../../postgres-integration-runtime");
const socket = "/tmp/yotsuba-pg-unit31", bin = "/opt/homebrew/opt/postgresql@17/bin", port = 55432;
const database = "property_sync_local", owner = "sync_test_owner", runner = "sync_test_runner";
const require = createRequire(import.meta.url);
const { runSyntheticWorkflow } = require("../../src/lib/property-sync/synthetic-workflow.ts");
const { createDbMediaStore, mediaSql } = require("../../src/lib/property-sync/db-media-store.ts");
const { createPostgresTransactionPort } = require("../../src/lib/property-sync/postgres-transaction-port.ts");
const { createMediaJournal, verifyMediaJournal } = require("../../src/lib/property-sync/audit.ts");
const { contentHash } = require("../../src/lib/property-sync/rules.ts");
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };
const unknown = () => new Error("LOCAL_POSTGRES_CHECK_FAILED");

async function main() {
  // pg has implicit PGOPTIONS/PG* fallbacks; reject them before creating files or secrets.
  assert.equal(Object.keys(process.env).some(name => /^PG/i.test(name)), false);
  const publicationUi = process.argv[3] === "--publication-ui";
  const publicationEffects = publicationUi || process.argv[3] === "--publication-effects";
  const propertyRequests = publicationEffects || process.argv[3] === "--property-requests";
  const fullProperty = propertyRequests || process.argv[3] === "--full-property";
  assert.equal(process.argv.length, fullProperty ? 4 : 3);
  assert.equal(Object.keys(process.env).some(name => /^(DATABASE_URL|DIRECT_URL|PRISMA_)/i.test(name)), false);
  const unit = publicationUi ? 41 : publicationEffects ? 36 : propertyRequests ? 35 : fullProperty ? 33 : 32;
  assert.equal(process.argv[2], expectedRuntime);
  assert.equal(await realpath(expectedRuntime), expectedRuntime);
  const runtimeStat = await lstat(expectedRuntime);
  assert.equal(runtimeStat.isDirectory(), true); assert.equal(runtimeStat.mode & 0o777, 0o700);
  const pgRequire = createRequire(resolve(expectedRuntime, "package.json"));
  assert.equal(pgRequire("pg/package.json").version, "8.23.1");
  const { Client, escapeLiteral } = pgRequire("pg");
  const data = resolve(expectedRuntime, `data-unit${unit}`), secrets = resolve(expectedRuntime, `secrets-unit${unit}`);
  const log = resolve(expectedRuntime, `postgres-unit${unit}.log`), ownership = resolve(expectedRuntime, `unit${unit}-ownership.json`);
  const bindingFile = resolve(expectedRuntime, `unit${unit}-binding.json`);
  for (const path of [data, secrets, socket, log, ownership, bindingFile]) {
    await assert.rejects(lstat(path), e => e.code === "ENOENT");
  }
  const ownerPassword = randomBytes(32).toString("hex"), runnerPassword = randomBytes(32).toString("hex");
  const owned = new Map(), ownedFiles = new Map(), clients = new Set(), checks = [];
  const childEnv = { PATH: "/usr/bin:/bin:/opt/homebrew/bin", LANG: "C", LC_ALL: "C" };
  let propertyCheck;
  let db, key, schemaCreated = false, initialized = false, clusterInitialized = false;
  let failure = false, report, failureCode, commandFailure, phase = "setup", cleanup = { rowsRemoved: false, serverStopped: false, privateFilesRemoved: false };
  let lostReplies = 0, loseNextReply = true, failAfterInsert = false, inserts = 0, maxAuditRows = 0, probe;
  async function ownDirectory(path) { await mkdir(path, { mode: 0o700 }); const s = await lstat(path); owned.set(path, [s.dev, s.ino]); }
  async function ownFile(path, contents) {
    const handle = await open(path, "wx", 0o600);
    try { const s = await handle.stat(); ownedFiles.set(path, [s.dev, s.ino]); await handle.writeFile(contents); }
    finally { await handle.close(); }
  }
  async function removeOwnedFile(path) {
    if (!ownedFiles.has(path)) return;
    const s = await lstat(path); assert.equal(s.isSymbolicLink(), false);
    assert.deepEqual([s.dev, s.ino], ownedFiles.get(path)); await rm(path);
  }
  async function verifyOwned(path) {
    const s = await lstat(path); assert.equal(s.isSymbolicLink(), false);
    assert.deepEqual([s.dev, s.ino], owned.get(path)); assert.equal(s.mode & 0o777, 0o700);
  }
  async function command(name, args) {
    try { return await exec(`${bin}/${name}`, args, { env: childEnv, timeout: 15000, maxBuffer: 200000 }); }
    catch (e) {
      if (name === "initdb") commandFailure = { command: name, code: e.code,
        diagnostic: String(e.stderr || "").replaceAll(ownerPassword, "[redacted]").replaceAll(runnerPassword, "[redacted]").slice(0,2000) };
      throw e;
    }
  }
  async function close(c) { try { await c.end(); } finally { clients.delete(c); } }
  async function connect(role = owner, dbName = database) {
    await verifyOwned(socket);
    const c = new Client({ host: socket, port, database: dbName, user: role, password: role === owner ? ownerPassword : runnerPassword,
      ssl: false, application_name: `synthetic-unit${unit}`, options: "-c statement_timeout=5000 -c lock_timeout=3000 -c idle_in_transaction_session_timeout=10000",
      connectionTimeoutMillis: 3000, query_timeout: 8000 });
    clients.add(c); c.on("error", () => {});
    try {
      await c.connect();
      const row = (await c.query("SELECT current_database() AS db, current_user AS role, inet_server_addr() AS address, pg_backend_pid() AS pid")).rows[0];
      assert.equal(row.db, dbName); assert.equal(row.role, role); assert.equal(row.address, null);
      c.syntheticPid = row.pid;
      if (role === owner) {
        assert.equal((await c.query("SHOW data_directory")).rows[0].data_directory, data);
        assert.equal((await c.query("SHOW listen_addresses")).rows[0].listen_addresses, "");
        assert.equal((await c.query("SHOW log_statement")).rows[0].log_statement, "none");
        assert.equal((await c.query("SHOW log_min_error_statement")).rows[0].log_min_error_statement, "panic");
      }
      return c;
    } catch { await close(c).catch(() => {}); throw unknown(); }
  }
  async function start() { await command("pg_ctl", ["-D", data, "-l", log, "-w", "-t", "10", "start"]); }
  async function stop() {
    let status;
    try { await command("pg_ctl", ["-D", data, "status"]); status = 0; } catch (e) { status = e.code; }
    if (status === 0) await command("pg_ctl", ["-D", data, "-m", "fast", "-w", "-t", "10", "stop"]);
    else assert.equal(status, 3);
    await assert.rejects(command("pg_ctl", ["-D", data, "status"]), e => e.code === 3);
  }
  function transactionPort(hooks = false) {
    return createPostgresTransactionPort(async () => {
      const c = await connect(runner);
      const activeProbe = hooks ? probe : undefined;
      const label = activeProbe ? ++activeProbe.connections : 0;
      if (activeProbe) activeProbe.pids.push(c.syntheticPid);
      return { close: () => close(c), query: async (sql, parameters) => {
        if (hooks && sql === mediaSql.append) {
          const n = (await c.query("SELECT count(*)::int AS count FROM public.property_sync_media_audit")).rows[0].count;
          if (n >= 10) throw unknown(); inserts++;
        }
        if (hooks && sql === mediaSql.update && failAfterInsert) throw unknown();
        if (activeProbe && label === 2 && sql === mediaSql.state) activeProbe.bStarted.resolve();
        const result = await c.query(sql, [...parameters]);
        if (activeProbe && label === 1 && sql === mediaSql.state) {
          activeProbe.aLocked.resolve(); await activeProbe.releaseA.promise;
        }
        return { rows: result.rows };
      } };
    });
  }
  const writePort = transactionPort(true), readPort = transactionPort();
  const store = createDbMediaStore({ async transaction(run) {
    const result = await writePort.transaction(run);
    // The actual COMMIT and connection close succeeded; only the application reply is discarded.
    if (loseNextReply) { loseNextReply = false; lostReplies++; throw unknown(); }
    return result;
  } });
  async function journal() {
    return readPort.transaction(async tx => {
      const p = [key.propertyId, key.episodeId, key.media];
      const row = (await tx.query(mediaSql.state, p)).rows[0], events = (await tx.query(mediaSql.events, p)).rows.map(r => r.event);
      const j = verifyMediaJournal({ schemaVersion: 1, genesis: row.genesis, state: row.state, events, headHash: row.head_hash });
      assert.ok(j); assert.equal(row.version, events.length); return j;
    });
  }
  async function counts() {
    const row = (await db.query("SELECT (SELECT count(*)::int FROM public.properties) AS properties, (SELECT count(*)::int FROM public.property_sync_media_state) AS media, (SELECT count(*)::int FROM public.property_sync_media_audit) AS audit")).rows[0];
    assert.equal(row.properties, 1); assert.equal(row.media, 2); assert.ok(row.audit <= 10); maxAuditRows = Math.max(maxAuditRows, row.audit); return row;
  }
  const snapshot = async () => ({ journal: await journal(), rows: await counts() });
  async function check(name, run) { phase = name; await run(); checks.push({ name, passed: true }); }
  try {
    await ownDirectory(data); await ownDirectory(secrets); await ownDirectory(socket);
    await ownFile(ownership, JSON.stringify({ schemaVersion: 1, data, secrets, socket, database, owner, runner, directories: [...owned] }));
    await ownFile(resolve(secrets, "owner"), ownerPassword + "\n");
    await ownFile(resolve(secrets, "runner"), runnerPassword + "\n");
    await ownFile(log, "");
    phase = "initdb";
    await command("initdb", ["-D", data, "--username", owner, "--auth-local=scram-sha-256", "--auth-host=reject", "--pwfile", resolve(secrets, "owner"), "--no-locale", "-E", "UTF8"]);
    clusterInitialized = true;
    await appendFile(resolve(data, "postgresql.conf"), `\nlisten_addresses = ''\nunix_socket_directories = '${socket}'\nunix_socket_permissions = 0700\nport = ${port}\nmax_connections = 10\nshared_buffers = '32MB'\nlog_statement = 'none'\nlog_min_error_statement = 'panic'\nlog_parameter_max_length_on_error = 0\nstatement_timeout = '5s'\nlock_timeout = '3s'\nidle_in_transaction_session_timeout = '10s'\npassword_encryption = 'scram-sha-256'\n`);
    phase = "server_start"; await start();
    phase = "owner_connection";
    const admin = await connect(owner, "postgres");
    phase = "database_and_role_setup"; await admin.query(`CREATE DATABASE ${database}`);
    await admin.query(`REVOKE ALL ON DATABASE ${database} FROM PUBLIC`);
    await admin.query(`CREATE ROLE ${runner} LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION NOBYPASSRLS PASSWORD ${escapeLiteral(runnerPassword)}`);
    await admin.query(`GRANT CONNECT ON DATABASE ${database} TO ${runner}`); await close(admin);
    phase = "dedicated_database_connection"; db = await connect();
    const serverVersion = (await db.query("SHOW server_version")).rows[0].server_version;
    assert.match(serverVersion, /^17\.11(?:\D|$)/);
    phase = "schema_setup"; await db.query("REVOKE CREATE ON SCHEMA public FROM PUBLIC");
    if (fullProperty) {
      propertyCheck = await createFullPropertyCheck({ db, socket, port, database, owner, runner, runnerPassword, secrets, ownFile, childEnv, propertyRequests, publicationEffects, publicationUi });
    } else await db.query("CREATE TABLE public.properties (id TEXT PRIMARY KEY, status TEXT NOT NULL, updated_at TIMESTAMPTZ NOT NULL)");
    await db.query(await readFile(resolve(scriptRoot, "../../docs/property-sync/proposals/media-audit-schema.sql"), "utf8")); schemaCreated = true;
    let lastRequest, originalProperties, originalAthome, workflow, concurrency;
    await check("unit29_flow_and_commit_reply_readback", async () => {
      workflow = await runSyntheticWorkflow("workflow-success", {
        initialize: async (state, record) => {
          assert.equal(initialized, false); initialized = true;
          key = { propertyId: state.propertyId, episodeId: state.episodeId, media: "site" };
          await ownFile(bindingFile, JSON.stringify(key));
          if (propertyCheck) await propertyCheck.seed(record);
          else await db.query("INSERT INTO public.properties VALUES ($1,'draft',$2)", [state.propertyId, state.listing.propertyVersion.updatedAt]);
          for (const media of ["site", "athome"]) {
            const j = createMediaJournal({ ...state, media });
            await db.query("INSERT INTO public.property_sync_media_state (property_id,episode_id,media,genesis,state,head_hash) VALUES ($1,$2,$3,$4::jsonb,$4::jsonb,$5)", [state.propertyId, state.episodeId, media, JSON.stringify(j.genesis), j.headHash]);
          }
          const binding = `property_id=${escapeLiteral(key.propertyId)} AND episode_id=${escapeLiteral(key.episodeId)} AND media='site'`;
          await db.query(`GRANT USAGE ON SCHEMA public TO ${runner}; GRANT SELECT ON public.properties, public.property_sync_media_state, public.property_sync_media_audit TO ${runner};
            GRANT UPDATE(version,state,head_hash) ON public.property_sync_media_state TO ${runner}; GRANT INSERT ON public.property_sync_media_audit TO ${runner};
            CREATE POLICY test_state_read ON public.property_sync_media_state FOR SELECT TO ${runner} USING (${binding});
            CREATE POLICY test_state_update ON public.property_sync_media_state FOR UPDATE TO ${runner} USING (${binding}) WITH CHECK (${binding});
            CREATE POLICY test_audit_read ON public.property_sync_media_audit FOR SELECT TO ${runner} USING (${binding});
            CREATE POLICY test_audit_insert ON public.property_sync_media_audit FOR INSERT TO ${runner} WITH CHECK (${binding} AND sequence <= 10)`);
          originalProperties = (await db.query("SELECT * FROM public.properties")).rows;
          originalAthome = (await db.query("SELECT * FROM public.property_sync_media_state WHERE media='athome'")).rows;
        }, read: journal, apply: async r => { lastRequest = structuredClone(r); return store.apply(key, r); },
      });
      assert.equal(workflow.expectedResultMatched, true); assert.equal(workflow.result.realObservationAvailable, false);
      assert.equal(workflow.result.steps.filter(s => s.reason === "LOCAL_COMMIT_CONFIRMED_BY_READBACK").length, 1);
      assert.equal((await counts()).audit, 3); assert.equal(inserts, 3); assert.equal((await journal()).headHash, workflow.result.audit.mediaHeadHash);
    });
    const nextRequest = async () => {
      const j = await journal(), pc = j.state.observations.pc, id = randomUUID();
      const at = new Date(Math.max(Date.now(), Date.parse(j.events.at(-1).at) + 1)).toISOString();
      return { requestId: id, actorRef: "synthetic-postgres", at, command: { type: "observe", ...key, surface: "pc", expectedListingRevision: j.state.listing.revision,
        expectedObservationRevision: pc.revision, evidence: { evidenceId: `postgres-${id}`, observedAt: at, acquisition: "mock", authorizationRef: "synthetic-only", visibility: "published", exactUnitConfirmed: true, contentHash: pc.contentHash, companyFirst: "not_applicable" } } };
    };
    if (!propertyRequests) {
    await check("idempotent_request_no_new_write", async () => {
      const before = await snapshot(), n = inserts;
      assert.equal((await store.apply(key, lastRequest)).replayed, true); assert.equal(inserts, n); assert.deepEqual(await snapshot(), before);
    });
    await check("stale_version_held", async () => {
      const before = await journal(), r = await nextRequest(); r.command.expectedListingRevision = 0;
      assert.equal((await store.apply(key, r)).reason, "LISTING_VERSION_CONFLICT"); assert.deepEqual((await journal()).state, before.state); assert.equal((await counts()).audit, 4);
    });
    await check("two_backends_observed_row_lock_wait", async () => {
      const a = await nextRequest(), b = structuredClone(a); b.requestId = randomUUID(); b.command.evidence.evidenceId = `postgres-${b.requestId}`;
      const p = { connections: 0, pids: [], aLocked: deferred(), bStarted: deferred(), releaseA: deferred() }; probe = p;
      let first, second;
      try {
        first = store.apply(key, a); await Promise.race([p.aLocked.promise, sleep(2000).then(() => { throw unknown(); })]);
        second = store.apply(key, b); await Promise.race([p.bStarted.promise, sleep(1000).then(() => { throw unknown(); })]);
        assert.equal(p.pids.length, 2); assert.notEqual(p.pids[0], p.pids[1]);
        let observed = false;
        for (let n = 0; n < 40 && !observed; n++) { observed = (await db.query("SELECT pg_blocking_pids($1) AS blockers", [p.pids[1]])).rows[0].blockers.includes(p.pids[0]); if (!observed) await sleep(20); }
        assert.equal(observed, true); concurrency = { backendPids: p.pids, rowLockWaitObserved: observed };
      } finally { p.releaseA.resolve(); probe = undefined; }
      const results = await Promise.all([first, second]);
      assert.deepEqual(results.map(r => r.status).sort(), ["applied", "held"]); assert.equal(results.find(r => r.status === "held").reason, "OBSERVATION_VERSION_CONFLICT");
      assert.equal((await counts()).audit, 6);
    });
    const retry = await nextRequest();
    await check("failure_after_audit_insert_rolls_back_both", async () => {
      const before = await snapshot(); failAfterInsert = true;
      try { assert.equal((await store.apply(key, retry)).reason, "TRANSACTION_ROLLED_BACK"); } finally { failAfterInsert = false; }
      assert.deepEqual(await snapshot(), before);
    });
    await check("confirmed_rollback_retry_once", async () => {
      assert.equal((await store.apply(key, retry)).status, "applied"); assert.equal((await store.apply(key, retry)).replayed, true); assert.equal((await counts()).audit, 7);
    });
    await check("commit_reply_loss_reconciled_by_new_connection", async () => {
      const r = await nextRequest(); loseNextReply = true;
      assert.equal((await store.apply(key, r)).reason, "STORE_OUTCOME_UNKNOWN");
      const j = await journal(), events = j.events.filter(e => e.requestId === r.requestId);
      assert.equal(events.length, 1); assert.equal(events[0].commandHash, contentHash(r.command)); assert.equal(events[0].afterHash, contentHash(j.state));
      const n = inserts; assert.equal((await store.apply(key, r)).replayed, true); assert.equal(inserts, n); assert.equal((await counts()).audit, 8);
    });
    await check("disconnect_before_commit_discards_uncommitted_writes", async () => {
      const before = await snapshot(), c = await connect(runner);
      await c.query("BEGIN");
      await c.query("UPDATE public.property_sync_media_state SET version=999 WHERE property_id=$1 AND episode_id=$2 AND media='site'", [key.propertyId, key.episodeId]);
      await c.query(mediaSql.append, [key.propertyId, key.episodeId, "site", 9, randomUUID(), JSON.stringify({ syntheticUncommitted: true })]);
      await close(c); assert.deepEqual(await snapshot(), before);
    });
    await check("least_privilege_rls_and_other_media_unchanged", async () => {
      const role = (await db.query("SELECT rolsuper,rolcreatedb,rolcreaterole,rolbypassrls, pg_has_role($1,$2,'MEMBER') AS owner_member FROM pg_roles WHERE rolname=$1", [runner, owner])).rows[0];
      assert.ok(Object.values(role).every(v => v === false));
      const c = await connect(runner);
      assert.equal((await c.query("SELECT count(*)::int AS count FROM public.property_sync_media_state")).rows[0].count, 1);
      assert.equal((await c.query("SELECT count(*)::int AS count FROM public.property_sync_media_state WHERE media='athome'")).rows[0].count, 0);
      const privileges = (await c.query("SELECT has_table_privilege(current_user,'public.properties','UPDATE') AS property_update, has_table_privilege(current_user,'public.property_sync_media_state','DELETE') AS state_delete, has_table_privilege(current_user,'public.property_sync_media_audit','TRUNCATE') AS audit_truncate, has_schema_privilege(current_user,'public','CREATE') AS schema_create")).rows[0];
      assert.ok(Object.values(privileges).every(v => v === false)); await close(c);
      assert.deepEqual((await db.query("SELECT * FROM public.properties")).rows, originalProperties);
      assert.deepEqual((await db.query("SELECT * FROM public.property_sync_media_state WHERE media='athome'")).rows, originalAthome);
      assert.deepEqual(await counts(), { properties: 1, media: 2, audit: 8 });
    });
    await check("committed_journal_survives_server_restart", async () => {
      if (propertyCheck) await propertyCheck.close();
      const before = await snapshot(); await close(db); db = undefined; assert.equal(clients.size, 0);
      await stop(); await start(); db = await connect(); assert.deepEqual(await snapshot(), before);
    });
    }
    let propertyVerification;
    if (propertyCheck && propertyRequests) propertyVerification = await propertyCheck.runRequests({ db, key, store, journal, check, counts, restart: async () => { await propertyCheck.close(); await close(db); await stop(); await start(); db = await connect(); return db; } });
    else if (propertyCheck) propertyVerification = await propertyCheck.run({ db, key, store, journal, nextRequest, check, counts });
    report = { schemaVersion: 1, purpose: "local_postgres_integration", sourceOrigin: "synthetic_generated", engine: "PostgreSQL", serverVersion,
      driverVersion: "8.23.1", checks, propertyVerification, executable: false, externalConnection: false, tcpListener: false, supabaseVerified: false,
      realPostgresMultiConnectionVerified: true, concurrency, rows: await counts(), maximumObservedAuditRows: maxAuditRows, simulatedApplicationReplyLosses: lostReplies,
      finalMediaHeadHash: (await journal()).headHash, workflow };
  } catch (e) { failure = true; failureCode = typeof e.code === "string" && /^[A-Z0-9_]{1,40}$/.test(e.code) ? e.code : "CHECK_FAILURE"; }
  finally {
    if (propertyCheck) await propertyCheck.close().catch(() => { failure = true; });
    for (const c of [...clients]) await close(c).catch(() => { failure = true; }); db = undefined;
    try {
      if (clusterInitialized) {
        await verifyOwned(data); await verifyOwned(socket);
        if (schemaCreated) {
          db = await connect();
          if (key) {
            assert.deepEqual(JSON.parse(await readFile(bindingFile, "utf8")), key);
            const scope = [key.propertyId, key.episodeId];
            const unexpected = (await db.query("SELECT (SELECT count(*)::int FROM public.properties WHERE id<>$1) + (SELECT count(*)::int FROM public.property_sync_media_state WHERE property_id<>$1 OR episode_id<>$2) + (SELECT count(*)::int FROM public.property_sync_media_audit WHERE property_id<>$1 OR episode_id<>$2) AS count", scope)).rows[0].count;
            assert.equal(unexpected, 0);
            if (propertyRequests) await propertyCheck.clearReceipts(db, key.propertyId);
            await db.query("BEGIN");
            await db.query("DELETE FROM public.property_sync_media_audit WHERE property_id=$1 AND episode_id=$2 AND media IN ('site','athome')", scope);
            await db.query("DELETE FROM public.property_sync_media_state WHERE property_id=$1 AND episode_id=$2 AND media IN ('site','athome')", scope);
            await db.query("DELETE FROM public.properties WHERE id=$1", [key.propertyId]); await db.query("COMMIT");
          }
          assert.equal((await db.query("SELECT (SELECT count(*)::int FROM public.properties)+(SELECT count(*)::int FROM public.property_sync_media_state)+(SELECT count(*)::int FROM public.property_sync_media_audit) AS count")).rows[0].count, 0);
          cleanup.rowsRemoved = true; await close(db); db = undefined;
        } else cleanup.rowsRemoved = true;
        await stop(); cleanup.serverStopped = true;
      } else { cleanup.rowsRemoved = true; cleanup.serverStopped = true; }
      const marker = JSON.parse(await readFile(ownership, "utf8"));
      assert.equal(marker.data, data); assert.equal(marker.socket, socket); assert.deepEqual(marker.directories, [...owned]);
      for (const path of [data, secrets, socket]) { await verifyOwned(path); await rm(path, { recursive: true }); }
      await removeOwnedFile(log); await removeOwnedFile(bindingFile); await removeOwnedFile(ownership);
      cleanup.privateFilesRemoved = true;
    } catch { failure = true; for (const c of [...clients]) await close(c).catch(() => {}); if (clusterInitialized) await stop().then(() => { cleanup.serverStopped = true; }).catch(() => {}); }
  }
  if (failure || !report) return { status: "failed", reason: "LOCAL_POSTGRES_CHECK_FAILED", phase, failureCode, commandFailure, completedChecks: checks, cleanup, executable: false, externalConnection: false };
  const safe = { ...report, cleanup };
  assert.doesNotMatch(JSON.stringify(safe), /SYNTHETIC_PRIVATE_|adNote|recordJson|contractRef/);
  assert.equal(JSON.stringify(safe).includes(ownerPassword), false); assert.equal(JSON.stringify(safe).includes(runnerPassword), false);
  return safe;
}
main().then(report => { process.stdout.write(JSON.stringify(report, null, 2) + "\n"); if (report.status === "failed") process.exitCode = 1; })
  .catch(() => { process.stderr.write('{"status":"failed","reason":"LOCAL_POSTGRES_SETUP_REJECTED"}\n'); process.exitCode = 1; });
