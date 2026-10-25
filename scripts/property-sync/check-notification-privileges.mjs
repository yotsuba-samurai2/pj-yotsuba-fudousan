// Local in-memory PostgreSQL only. No connection strings, credentials or production adapter.
// Usage: node scripts/property-sync/check-notification-privileges.mjs /path/to/isolated-pglite-runtime
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { test } from "node:test";

if (!process.argv[2]) throw new Error("An isolated PGlite 0.5.11 runtime directory is required");
const require = createRequire(resolve(process.argv[2], "package.json"));
const { PGlite } = require("@electric-sql/pglite");
const create = await readFile(new URL("../../prisma/migrations/20260920020000_add_property_publication_events/migration.sql", import.meta.url), "utf8");
const harden = await readFile(new URL("../../docs/property-sync/proposals/notification-privileges.sql", import.meta.url), "utf8");
const setup = `CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE guest;
CREATE ROLE service_role BYPASSRLS;
GRANT USAGE ON SCHEMA public TO anon, authenticated, guest, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role, PUBLIC;`;
const seed = "INSERT INTO public.property_publication_events (id,slug,kind) VALUES ('one','synthetic','published')";
async function asRole(db, role, sql) {
  // Roles here are fixed test constants, never application/user input.
  await db.exec(`SET ROLE ${role}`);
  try { return await db.query(sql); } finally { await db.exec("RESET ROLE"); }
}
await test("通知テーブルの権限案をメモリ内PostgreSQLで検証", async t => {
  const db = new PGlite();
  try {
    await db.exec(setup); await db.exec(create); await db.exec(seed);
    await t.test("旧SQLはdefault grantを継承し匿名SELECTが通ることを再現", async () => {
      assert.equal((await asRole(db, "anon", "SELECT * FROM public.property_publication_events")).rows.length, 1);
    });
    await db.exec(harden);
    const commands = ["SELECT * FROM public.property_publication_events", "INSERT INTO public.property_publication_events (id,slug,kind) VALUES ('two','synthetic','changed')", "UPDATE public.property_publication_events SET attempts=1", "DELETE FROM public.property_publication_events", "TRUNCATE public.property_publication_events"];
    for (const role of ["anon", "authenticated", "guest"]) {
      await t.test(`${role}: SELECT/INSERT/UPDATE/DELETE/TRUNCATEは全て拒否`, async () => {
        for (const sql of commands) await assert.rejects(asRole(db, role, sql), { code: "42501" });
      });
    }
    await t.test("RLS有効・client policyなし・ownerと既存service writerは保持", async () => {
      const { rows } = await db.query("SELECT relrowsecurity FROM pg_class WHERE oid='public.property_publication_events'::regclass");
      assert.equal(rows[0].relrowsecurity, true);
      assert.equal((await db.query("SELECT * FROM pg_policy WHERE polrelid='public.property_publication_events'::regclass")).rows.length, 0);
      assert.equal((await db.query("SELECT * FROM public.property_publication_events")).rows.length, 1);
      await asRole(db, "service_role", "INSERT INTO public.property_publication_events (id,slug,kind) VALUES ('service','synthetic','changed')");
      assert.equal((await asRole(db, "service_role", "SELECT * FROM public.property_publication_events")).rows.length, 2);
    });
    await t.test("後で誤ったSELECT/INSERT grantが付いてもRLSで行を渡さない", async () => {
      await db.exec("GRANT SELECT, INSERT ON public.property_publication_events TO anon");
      assert.equal((await asRole(db, "anon", commands[0])).rows.length, 0);
      await assert.rejects(asRole(db, "anon", commands[1]), { code: "42501" });
    });
  } finally { await db.close(); }
});
await test("テーブル不在では失敗し、存在しないroleは作成しない", async () => {
  const db = new PGlite();
  try {
    await assert.rejects(db.exec(harden), { code: "42P01" });
    await db.exec(create); await db.exec(harden);
    assert.equal((await db.query("SELECT * FROM pg_roles WHERE rolname IN ('anon','authenticated')")).rows.length, 0);
  } finally { await db.close(); }
});
