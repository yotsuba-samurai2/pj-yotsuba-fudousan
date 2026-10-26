// Only called by the fixed, owned, socket-only local Postgres harness.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { randomBytes, createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const require = createRequire(import.meta.url), root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
import { runPropertyRequestChecks } from "./property-request-postgres.mjs";
import { runPublicationEffectChecks } from "./publication-effects-postgres.mjs";
import { runPublicationUiChecks } from "./publication-ui-postgres.mjs";
import { runSourceGuardChecks } from "./source-guard-postgres.mjs";
import { runReviewedMailChecks } from "./reviewed-mail-postgres.mjs";
import { runReviewAuthorityChecks } from "./review-authority-postgres.mjs";
import { runIsolatedBuild } from "./isolated-build.mjs";
const { PrismaClient, Prisma } = require("@prisma/client");
const { createPropertyRepository } = require("../../src/lib/db/property-repository.ts");
const { toPublicProperty } = require("../../src/lib/property-shared.ts");
const { bannedTermsError } = require("../../src/lib/property-validation.ts");
const { publicContentHash } = require("../../src/lib/property-publication.ts");
const { buildLocalizedDisplayRows } = require("../../src/lib/property-i18n.ts");
const { buildRealEstateListingJsonLd } = require("../../src/lib/property-jsonld.ts");
const exec = promisify(execFile), sleep = ms => new Promise(r => setTimeout(r, ms));
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };
const bounded = promise => Promise.race([promise, sleep(2000).then(() => { throw new Error("LOCAL_PROPERTY_TIMEOUT"); })]);
const digest = value => createHash("sha256").update(value).digest("hex");
const canary = "PRIVATE_CANARY_AD100_当社報酬_元付";

export async function createFullPropertyCheck({ db, socket, port, database, owner, runner, runnerPassword, secrets, ownFile, childEnv, propertyRequests = false, publicationEffects = false, publicationUi = false, sourceGuards = false, reviewedMail = false, reviewAuthority = false }) {
  assert.equal(Prisma.prismaVersion.client, "6.19.3");
  // The installed generated client has no .env paths. Refuse if regenerated otherwise.
  const generated = await readFile(resolve(root, "node_modules/.prisma/client/index.js"), "utf8");
  const envPaths = JSON.parse(generated.match(/"relativeEnvPaths":\s*(\{[^}]*\})/)[1]);
  assert.ok(Object.values(envPaths).every(v => v === null));
  const source = await readFile(resolve(root, "prisma/schema.prisma"), "utf8");
  const names = ["PropertyStatus", "PropertyDealType", "PropertyCategory", "PropertyTradeMode"];
  const blocks = names.map(name => { const m = source.match(new RegExp(`^enum ${name} \\{[\\s\\S]*?^\\}`, "m")); assert.ok(m); return m[0]; });
  // Only the top-level closing line ends a block; field comments contain JSON braces.
  const model = source.match(/^model Property \{[\s\S]*?^\}/m); assert.ok(model);
  const schema = 'datasource db {\n provider = "postgresql"\n url = env("DATABASE_URL")\n}\n' + [...blocks, model[0]].join("\n");
  const schemaPath = resolve(secrets, "property-only.prisma"); await ownFile(schemaPath, schema);
  const result = await exec(process.execPath, [resolve(root, "node_modules/prisma/build/index.js"), "migrate", "diff", "--from-empty", "--to-schema-datamodel", schemaPath, "--script"],
    { cwd: secrets, env: { ...childEnv, CHECKPOINT_DISABLE: "1" }, timeout: 15000, maxBuffer: 200000 });
  assert.equal((result.stdout.match(/CREATE TABLE/g) || []).length, 1);
  assert.match(result.stdout, /CREATE TABLE "properties"/);
  await db.query(result.stdout);
  const columns = (await db.query("SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='properties' ORDER BY ordinal_position")).rows.map(r => r.column_name);
  const fields = Prisma.dmmf.datamodel.models.find(m => m.name === "Property").fields.map(f => f.dbName || f.name);
  assert.equal(columns.length, 22); assert.deepEqual(columns, fields);
  if (propertyRequests) await db.query(await readFile(resolve(root, "docs/property-sync/proposals/property-write-receipts.sql"), "utf8"));
  if (publicationEffects) await db.query(await readFile(resolve(root, "docs/property-sync/proposals/publication-effects.sql"), "utf8"));
  if (reviewAuthority) {
    // Synthetic NOLOGIN roles exercise inherited default grants, including the previously observed TRUNCATE risk.
    await db.query("CREATE ROLE anon NOLOGIN; CREATE ROLE authenticated NOLOGIN; ALTER DEFAULT PRIVILEGES GRANT ALL ON TABLES TO anon,authenticated");
    await db.query(await readFile(resolve(root, "docs/property-sync/proposals/mail-review-store.sql"), "utf8"));
  }
  const writer = "sync_property_writer", password = randomBytes(32).toString("hex"), clients = new Set();
  // Hex-only password never appears in arguments, environment, reports or persisted evidence.
  await ownFile(resolve(secrets, "property-writer"), password + "\n");
  await db.query(`CREATE ROLE ${writer} LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION NOBYPASSRLS PASSWORD '${password}'`);
  await db.query(`GRANT CONNECT ON DATABASE ${database} TO ${writer}; GRANT USAGE ON SCHEMA public TO ${writer}; GRANT SELECT,INSERT,UPDATE ON public.properties TO ${writer}; ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY`);
  const url = new URL(`postgresql://${writer}:${password}@localhost:${port}/${database}`);
  url.searchParams.set("host", socket); url.searchParams.set("connection_limit", "1"); url.searchParams.set("connect_timeout", "3"); url.searchParams.set("pool_timeout", "3");
  async function disconnect(client) { try { await client.$disconnect(); } finally { clients.delete(client); } }
  async function connect(effectWorker = false) {
    const connectionUrl = new URL(url.href);
    if (effectWorker) { connectionUrl.username = runner; connectionUrl.password = runnerPassword; }
    const client = new PrismaClient({ datasourceUrl: connectionUrl.href, log: [], errorFormat: "minimal" }); clients.add(client);
    try {
      const [row] = await client.$queryRawUnsafe("SELECT current_database() AS db,current_user AS role,inet_server_addr()::text AS address,pg_backend_pid() AS pid");
      assert.equal(row.db, database); assert.equal(row.role, effectWorker ? runner : writer); assert.equal(row.address, null);
      return { client, repo: createPropertyRepository(client), pid: row.pid };
    } catch { await disconnect(client); throw new Error("LOCAL_PRISMA_CONNECTION_FAILED"); }
  }
  let current, propertyId;
  const read = () => current.repo.getPropertyById(propertyId);
  return {
    async seed(record) {
      propertyId = record.id; assert.match(propertyId, /^[0-9a-f-]{36}$/);
      await db.query(`CREATE POLICY test_property_writer ON public.properties TO ${writer} USING (id='${propertyId}') WITH CHECK (id='${propertyId}'); CREATE POLICY test_property_media_reader ON public.properties FOR SELECT TO ${runner} USING (id='${propertyId}')`);
      if (propertyRequests) await db.query(`GRANT SELECT,INSERT ON public.property_write_receipts TO ${writer}; CREATE POLICY test_property_receipts ON public.property_write_receipts TO ${writer} USING (property_id='${propertyId}') WITH CHECK (property_id='${propertyId}')`);
      if (publicationEffects) await db.query(`GRANT SELECT,INSERT ON public.property_publication_effects TO ${writer};
        GRANT SELECT ON public.property_write_receipts, public.property_publication_effects TO ${runner};
        GRANT UPDATE(state,revision) ON public.property_publication_effects TO ${runner};
        CREATE POLICY test_effect_writer ON public.property_publication_effects TO ${writer} USING (plan->>'propertyId'='${propertyId}') WITH CHECK (plan->>'propertyId'='${propertyId}');
        CREATE POLICY test_effect_worker ON public.property_publication_effects TO ${runner} USING (plan->>'propertyId'='${propertyId}') WITH CHECK (plan->>'propertyId'='${propertyId}');
        CREATE POLICY test_effect_receipt_reader ON public.property_write_receipts FOR SELECT TO ${runner} USING (property_id='${propertyId}')`);
      current = await connect();
      // Seed exact generated workflow identity/version through Prisma. Production save mapping is exercised below.
      await current.client.property.create({ data: { ...record, priceYen: BigInt(record.priceYen), createdAt: new Date(record.createdAt), updatedAt: new Date(record.updatedAt), translations: Prisma.JsonNull } });
      assert.equal((await read()).updatedAt, record.updatedAt);
      const raw = await current.client.property.findUniqueOrThrow({ where: { id: propertyId } });
      assert.deepEqual({ ...raw, priceYen: Number(raw.priceYen), createdAt: raw.createdAt.toISOString(), updatedAt: raw.updatedAt.toISOString() }, record);
    },
    async clearReceipts(ownerDb, id) {
      if (reviewAuthority) {
        assert.equal((await ownerDb.query("SELECT count(*)::int AS count FROM property_sync_private.mail_review_records WHERE property_id<>$1", [id])).rows[0].count, 0);
        assert.ok((await ownerDb.query("SELECT count(*)::int AS count FROM property_sync_private.mail_authority_heads")).rows[0].count <= 8);
        await ownerDb.query("DELETE FROM property_sync_private.mail_review_records WHERE property_id=$1", [id]);
        await ownerDb.query("DELETE FROM property_sync_private.mail_authority_heads");
        assert.equal((await ownerDb.query("SELECT (SELECT count(*) FROM property_sync_private.mail_review_records)+(SELECT count(*) FROM property_sync_private.mail_authority_heads) AS count")).rows[0].count, '0');
      }
      if (publicationEffects) {
        assert.equal((await ownerDb.query("SELECT count(*)::int AS count FROM public.property_publication_effects WHERE plan->>'propertyId'<>$1", [id])).rows[0].count, 0);
        await ownerDb.query("DELETE FROM public.property_publication_effects WHERE plan->>'propertyId'=$1", [id]);
        assert.equal((await ownerDb.query("SELECT count(*)::int AS count FROM public.property_publication_effects")).rows[0].count, 0);
      }
      assert.equal((await ownerDb.query("SELECT count(*)::int AS count FROM public.property_write_receipts WHERE property_id<>$1", [id])).rows[0].count, 0);
      await ownerDb.query("DELETE FROM public.property_write_receipts WHERE property_id=$1", [id]);
      assert.equal((await ownerDb.query("SELECT count(*)::int AS count FROM public.property_write_receipts")).rows[0].count, 0);
    },
    async runRequests(context) {
      if (reviewAuthority) return runReviewAuthorityChecks({ ...context, current, connect, disconnect, schemaColumns: columns.length, schemaHash: digest(schema),
        build: ownerDb => runIsolatedBuild({ db: ownerDb, root, secrets, ownFile, childEnv, socket, port, database, password: runnerPassword, propertyId, unit: 53,
          privateCanaries: ["PRIVATE_ORIGINAL_MEMO", "PRIVATE_AD_EVIDENCE", "PRIVATE_REVIEWED_MAIL_INCOME"] }) });
      if (reviewedMail) return runReviewedMailChecks({ ...context, current, connect, disconnect, schemaColumns: columns.length, schemaHash: digest(schema),
        build: ownerDb => runIsolatedBuild({ db: ownerDb, root, secrets, ownFile, childEnv, socket, port, database, password: runnerPassword, propertyId, unit: 52,
          privateCanaries: ["PRIVATE_ORIGINAL_MEMO", "PRIVATE_AD_EVIDENCE", "PRIVATE_REVIEWED_MAIL_INCOME"] }) });
      if (sourceGuards) return runSourceGuardChecks({ ...context, current, connect, disconnect, schemaColumns: columns.length, schemaHash: digest(schema),
        build: ownerDb => runIsolatedBuild({ db: ownerDb, root, secrets, ownFile, childEnv, socket, port, database, password: runnerPassword, propertyId, unit: 51,
          privateCanaries: ["PRIVATE_EFFECT_AD100", "PRIVATE_SOURCE_GUARD_CANARY", "PRIVATE_SOURCE_LATER_EDIT"] }) });
      if (publicationEffects) return (publicationUi ? runPublicationUiChecks : runPublicationEffectChecks)({ ...context, current, connect, connectWorker: () => connect(true), disconnect,
        schemaColumns: columns.length, schemaHash: digest(schema), build: ownerDb => runIsolatedBuild({ db: ownerDb, root, secrets, ownFile, childEnv, socket, port, database, password: runnerPassword, propertyId, unit: publicationUi ? 41 : 36 }) });
      return runPropertyRequestChecks({ ...context, current, connect, disconnect, schemaColumns: columns.length, schemaHash: digest(schema) });
    },
    async close() { for (const c of [...clients]) await disconnect(c); },
    async run({ db: liveDb, key, store, journal, nextRequest, check, counts }) {
      // The lifecycle may have restarted the server; use the renewed owner connection.
      db = liveDb;
      current = await connect();
      const mediaSnapshot = async () => (await db.query("SELECT * FROM public.property_sync_media_state ORDER BY media")).rows;
      const auditSnapshot = async () => (await db.query("SELECT * FROM public.property_sync_media_audit ORDER BY sequence")).rows;
      const all = async () => ({ property: await read(), media: await mediaSnapshot(), audit: await auditSnapshot() });
      const write = async patch => { const before = await read(); assert.equal(await current.repo.updatePropertyIfUnchanged(before.slug, before.updatedAt, patch), true); return read(); };
      let concurrency;
      await check("prisma_full_schema_roundtrip_and_public_projection", async () => {
        const before = await read(), media = await mediaSnapshot(), audit = await auditSnapshot();
        const hidden = { internal: { ad: canary }, commission: canary, sourceEvidence: canary };
        const patch = { title: "Synthetic family property", priceYen: 3_000_000_123, priceNote: "Synthetic monthly price", locationText: "Synthetic location",
          description: "Synthetic description", access: [{ line: "Synthetic line", station: "Synthetic station", distanceM: 400, ...hidden }],
          spec: { ...before.spec, internal: hidden, brokerFee: "p033" }, images: [{ url: "https://example.test/synthetic.jpg", alt: "Synthetic room", kind: "interior", ...hidden }],
          publishedAt: "2026-10-25", locales: ["ja", "en", "zh-tw", "zh"], translations: { en: { title: "Synthetic title", description: "Synthetic text", spec: { deliveryYm: "Negotiable", commission: canary }, ...hidden }, "zh-tw": { title: "合成住宅", description: "合成資料", ...hidden }, zh: { title: "合成住宅", description: "合成资料", ...hidden }, internal: hidden }, internal: { adNote: canary, companyFee: canary, sourceEvidence: canary } };
        const saved = await write(patch);
        for (const [k, v] of Object.entries(patch)) assert.deepEqual(saved[k], v);
        assert.equal(saved.createdAt, before.createdAt); assert.ok(Date.parse(saved.updatedAt) > Date.parse(before.updatedAt));
        assert.deepEqual(await mediaSnapshot(), media); assert.deepEqual(await auditSnapshot(), audit);
        const pub = toPublicProperty(saved);
        const output = [pub, buildLocalizedDisplayRows(pub, "en"), buildRealEstateListingJsonLd(pub, "en", { url: "https://example.test/property", siteUrl: "https://example.test", inLanguage: "en", images: pub.images.map(i => i.url) })];
        assert.equal(JSON.stringify(output).includes(canary), false); assert.equal(JSON.stringify(output).includes('"internal"'), false);
        assert.equal(pub.priceYen, patch.priceYen); assert.equal(pub.images[0].alt, "Synthetic room"); assert.equal(pub.translations.en.spec.deliveryYm, "Negotiable");
        const hash = publicContentHash(saved); await write({ internal: { adNote: "PRIVATE_CANARY_CHANGED" } }); assert.equal(publicContentHash(await read()), hash);
      });
      await check("property_row_lock_does_not_overwrite_or_block_media_observation", async () => {
        const before = await read(), beforeJournal = await journal(); const release = deferred(), locked = deferred();
        const tx = current.client.$transaction(async client => {
          assert.equal(await createPropertyRepository(client).updatePropertyIfUnchanged(before.slug, before.updatedAt, { description: "Concurrent property edit" }), true);
          locked.resolve(); await release.promise;
        }, { timeout: 8000 });
        const observedTx = tx.catch(e => { locked.resolve(); throw e; }); observedTx.catch(() => {});
        try {
          await bounded(locked.promise);
          assert.equal((await bounded(store.apply(key, await nextRequest()))).status, "applied");
          const afterJournal = await journal(); assert.equal(afterJournal.events.length, beforeJournal.events.length + 1);
          assert.deepEqual(afterJournal.state.listing.propertyVersion, beforeJournal.state.listing.propertyVersion);
        } finally { release.resolve(); await observedTx; }
        assert.equal((await read()).description, "Concurrent property edit"); assert.ok(Date.parse((await read()).updatedAt) > Date.parse(before.updatedAt));
      });
      await check("prisma_two_backends_only_one_same_version_save", async () => {
        const before = await read(), media = await mediaSnapshot(), audit = await auditSnapshot(), other = await connect();
        const release = deferred(), locked = deferred();
        const first = current.client.$transaction(async client => {
          const changed = await createPropertyRepository(client).updatePropertyIfUnchanged(before.slug, before.updatedAt, { title: "First edit" });
          assert.equal(changed, true); locked.resolve(); await release.promise; return changed;
        }, { timeout: 8000 });
        const observedFirst = first.catch(e => { locked.resolve(); throw e; }); observedFirst.catch(() => {});
        let second;
        try {
          await bounded(locked.promise); assert.notEqual(current.pid, other.pid);
          second = other.repo.updatePropertyIfUnchanged(before.slug, before.updatedAt, { title: "Stale edit" }); second.catch(() => {});
          let waiting = false;
          for (let i = 0; i < 60 && !waiting; i++) { waiting = (await db.query("SELECT pg_blocking_pids($1) AS blockers", [other.pid])).rows[0].blockers.includes(current.pid); if (!waiting) await sleep(20); }
          assert.equal(waiting, true); concurrency = { backendPids: [current.pid, other.pid], rowLockWaitObserved: true };
        } finally { release.resolve(); await observedFirst; }
        assert.equal(await second, false); await disconnect(other.client);
        assert.equal((await read()).title, "First edit"); assert.deepEqual(await mediaSnapshot(), media); assert.deepEqual(await auditSnapshot(), audit);
        const saved = await all(); assert.equal(await current.repo.updatePropertyIfUnchanged(before.slug, before.updatedAt, { title: "First edit" }), false); assert.deepEqual(await all(), saved);
      });
      await check("prisma_clock_rollback_version_advances", async () => {
        // Existing future version models clock rollback. Restore only by an actual CAS write.
        const future = new Date("2099-01-01T00:00:00.000Z");
        await current.client.property.update({ where: { id: propertyId }, data: { updatedAt: future } });
        const saved = await write({ title: "Version advance" }); assert.equal(saved.updatedAt, "2099-01-01T00:00:00.001Z");
        assert.equal(await current.repo.updatePropertyIfUnchanged(saved.slug, future.toISOString(), { title: "Replay" }), false);
      });
      await check("prisma_mid_transaction_failure_rolls_back_property", async () => {
        const before = await all(), aborted = new Error("SYNTHETIC_ABORT");
        await assert.rejects(current.client.$transaction(async client => {
          assert.equal(await createPropertyRepository(client).updatePropertyIfUnchanged(before.property.slug, before.property.updatedAt, { priceYen: 9 }), true);
          throw aborted;
        }), e => e === aborted);
        assert.deepEqual(await all(), before);
      });
      await check("prisma_commit_reply_discard_readback_and_no_blind_retry", async () => {
        const before = await all(), patch = { locationText: "Saved with reply discarded" };
        await current.repo.updatePropertyIfUnchanged(before.property.slug, before.property.updatedAt, patch); // Intentionally discard result after real completion.
        await disconnect(current.client); current = await connect();
        const saved = await read(); assert.ok(Date.parse(saved.updatedAt) > Date.parse(before.property.updatedAt));
        assert.deepEqual({ ...saved, updatedAt: before.property.updatedAt }, { ...before.property, ...patch });
        assert.equal(await current.repo.updatePropertyIfUnchanged(saved.slug, before.property.updatedAt, patch), false);
        assert.deepEqual(await read(), saved); assert.deepEqual(await mediaSnapshot(), before.media); assert.deepEqual(await auditSnapshot(), before.audit);
      });
      await check("persisted_text_and_nested_scalar_publication_guards", async () => {
        const clean = await read();
        for (const field of ["description", "imageAlt", "translation", "spec", "nestedScalar"]) {
          const patch = field === "description" ? { description: canary } : field === "imageAlt" ? { images: [{ ...clean.images[0], alt: canary }] }
            : field === "translation" ? { translations: { en: { title: "Synthetic", description: canary } } }
            : field === "spec" ? { spec: { ...clean.spec, conditions: canary } } : { images: [{ ...clean.images[0], alt: { internal: canary } }] };
          const saved = await write(patch); assert.equal(saved.status, "draft");
          if (field === "nestedScalar") assert.throws(() => toPublicProperty(saved), /公開物件のデータ形式が不正です/);
          else assert.notEqual(bannedTermsError({ ...saved, status: "published" }), null);
          await write({ description: clean.description, images: clean.images, spec: clean.spec, translations: clean.translations });
        }
        await write({ priceNote: undefined, publishedAt: undefined, translations: undefined, internal: undefined });
        const saved = await read(); assert.equal(saved.priceNote, undefined); assert.equal(saved.translations, undefined); assert.equal(saved.internal, undefined);
        assert.equal((await current.client.property.findUniqueOrThrow({ where: { id: propertyId } })).priceNote, null);
      });
      await check("property_and_media_roles_remain_separate", async () => {
        const [role] = await current.client.$queryRawUnsafe("SELECT rolsuper,rolcreatedb,rolcreaterole,rolbypassrls FROM pg_roles WHERE rolname=current_user");
        assert.ok(Object.values(role).every(v => v === false));
        const [privs] = await current.client.$queryRawUnsafe("SELECT has_table_privilege(current_user,'public.property_sync_media_state','UPDATE') AS media_update,has_table_privilege(current_user,'public.property_sync_media_audit','INSERT') AS audit_insert,has_table_privilege(current_user,'public.properties','DELETE') AS property_delete,has_schema_privilege(current_user,'public','CREATE') AS schema_create");
        assert.ok(Object.values(privs).every(v => v === false));
        assert.equal((await db.query("SELECT pg_has_role($1,$2,'MEMBER') OR pg_has_role($1,$3,'MEMBER') AS member", [writer, owner, runner])).rows[0].member, false);
        assert.deepEqual(await counts(), { properties: 1, media: 2, audit: 9 });
      });
      return { schemaColumns: columns.length, schemaHash: digest(schema), prismaVersion: Prisma.prismaVersion.client, propertyConcurrency: concurrency,
        sameWorkflowSourceSeedVerified: true, publicProjectionCanariesExcluded: true, publicTextGuardsVerified: true, imagePixelsVerified: false,
        propertyReplyLoss: "application_reply_discarded_after_save", propertyReadback: "content_and_version_match_without_request_identity", propertyExactlyOnceClaimed: false,
        requestJournalScope: "media_only", productionConnection: false, sourceRowsPersistedAsEvidence: false };
    },
  };
}
