// Isolated in-memory PostgreSQL + synthetic data only. No environment credentials or DB URL.
// node --import tsx scripts/property-sync/check-media-store.mjs /absolute/path/to/pglite-runtime
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { test } from "node:test";
if (!process.argv[2]) throw new Error("Isolated PGlite runtime required");
const { PGlite } = createRequire(resolve(process.argv[2], "package.json"))("@electric-sql/pglite");
const require = createRequire(import.meta.url);
const { createDbMediaStore, mediaSql, RolledBackTransaction } = require("../../src/lib/property-sync/db-media-store.ts");
const { createMediaJournal } = require("../../src/lib/property-sync/audit.ts");
const { mediaState, request, observe } = require("../../src/lib/property-sync/__tests__/fixtures.ts");
const sql = await readFile(new URL("../../docs/property-sync/proposals/media-audit-schema.sql", import.meta.url), "utf8");
const db = new PGlite();
try {
  await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE guest;
    GRANT USAGE ON SCHEMA public TO anon, authenticated, guest;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon,authenticated,PUBLIC;
    CREATE TABLE public.properties (id TEXT PRIMARY KEY, updated_at TEXT NOT NULL);`);
  await db.exec(sql);
  const j = createMediaJournal(mediaState()), key = { propertyId: j.state.propertyId, episodeId: j.state.episodeId, media: j.state.media }, params = Object.values(key);
  await db.query("INSERT INTO public.properties VALUES ($1,$2)", [key.propertyId, "unchanged-synthetic"]);
  await db.query("INSERT INTO public.property_sync_media_state (property_id,episode_id,media,genesis,state,head_hash) VALUES ($1,$2,$3,$4::jsonb,$4::jsonb,$5)", [...params, JSON.stringify(j.genesis), j.headHash]);
  let failUpdate = false;
  const store = createDbMediaStore({ async transaction(run) {
    try { return await db.transaction(tx => run({ query: async (statement, parameters) => {
      if (failUpdate && statement === mediaSql.update) throw new Error("synthetic failure after audit insert");
      return tx.query(statement, [...parameters]);
    } })); } catch { throw new RolledBackTransaction(); }
  } });
  const r = request();
  await test("実SQLで状態・監査を同時保存し、requestId再送を重複させない", async () => {
    assert.equal((await store.apply(key, r)).status, "applied");
    assert.equal((await store.apply(key, r)).replayed, true);
    assert.equal((await db.query("SELECT * FROM public.property_sync_media_audit")).rows.length, 1);
    assert.equal((await db.query("SELECT version FROM public.property_sync_media_state")).rows[0].version, 1);
  });
  await test("INSERT後の障害で状態と監査を両方rollback", async () => {
    failUpdate = true;
    assert.equal((await store.apply(key, request(observe(1)))).reason, "TRANSACTION_ROLLED_BACK");
    failUpdate = false;
    assert.equal((await db.query("SELECT * FROM public.property_sync_media_audit")).rows.length, 1);
    assert.equal((await db.query("SELECT version FROM public.property_sync_media_state")).rows[0].version, 1);
  });
  await test("保留の監査も保存し、物件本体を変更しない", async () => {
    const command = observe(1); command.expectedListingRevision = 999;
    assert.equal((await store.apply(key, request(command))).reason, "LISTING_VERSION_CONFLICT");
    assert.equal((await db.query("SELECT * FROM public.property_sync_media_audit")).rows.length, 2);
    assert.deepEqual((await db.query("SELECT * FROM public.properties")).rows, [{ id: key.propertyId, updated_at: "unchanged-synthetic" }]);
  });
  await test("SQL制約がrequestIdとsequenceの重複を拒否", async () => {
    const event = (await db.query("SELECT event FROM public.property_sync_media_audit WHERE sequence=1")).rows[0].event;
    await assert.rejects(db.query(mediaSql.append, [...params, 3, r.requestId, JSON.stringify(event)]), { code: "23505" });
  });
  await test("両tableで匿名・一般利用者・PUBLIC経由のアクセスを拒否", async () => {
    for (const role of ["anon", "authenticated", "guest"]) {
      await db.exec(`SET ROLE ${role}`);
      try {
        for (const table of ["property_sync_media_state", "property_sync_media_audit"]) {
          const column = table === "property_sync_media_state" ? "version" : "sequence";
          for (const statement of [`SELECT * FROM public.${table}`, `INSERT INTO public.${table} DEFAULT VALUES`, `UPDATE public.${table} SET ${column}=${column}`, `DELETE FROM public.${table}`, `TRUNCATE public.${table}`]) await assert.rejects(db.query(statement), { code: "42501" });
        }
      } finally { await db.exec("RESET ROLE"); }
    }
  });
} finally { await db.close(); }
