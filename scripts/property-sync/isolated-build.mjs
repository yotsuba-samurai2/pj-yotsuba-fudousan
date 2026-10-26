// Used only by the owned, synthetic, Unix-socket Postgres lifecycle. No URL argument or .env loading.
import assert from "node:assert/strict";
import { readFile, lstat, writeFile, realpath, readdir, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
const exec = promisify(execFile);

export async function runIsolatedBuild({ db, root, secrets, ownFile, childEnv, socket, port, database, password, propertyId, unit = 36, privateCanaries = ["PRIVATE_EFFECT_AD100"] }) {
  assert.ok([36, 37, 41, 51].includes(unit));
  assert.ok(privateCanaries.length > 0 && privateCanaries.length <= 20 && privateCanaries.every(v => /^PRIVATE_[A-Z0-9_]{1,100}$/.test(v)));
  for (const dir of [root, resolve(root, "prisma")]) for (const name of [".env", ".env.local", ".env.production", ".env.production.local", ".env.development", ".env.development.local", ".env.test", ".env.test.local"]) {
    await assert.rejects(lstat(resolve(dir, name)), e => e.code === "ENOENT");
  }
  const profilePath = resolve(secrets, "build-network.sb");
  const allowedSocket = resolve(await realpath(socket), `.s.PGSQL.${port}`);
  await ownFile(profilePath, `(version 1)\n(allow default)\n(deny network*)\n(allow network-outbound (remote unix-socket (path-literal ${JSON.stringify(allowedSocket)})))\n`);
  // Native probe verifies inherited OS-level denial too; no internet destination or listener is used.
  let nativeDenied = false;
  try { await exec("/usr/bin/sandbox-exec", ["-f", profilePath, "/usr/bin/nc", "-v", "-z", "-w", "1", "127.0.0.1", "9"], { env: childEnv, timeout: 3000 }); }
  catch (error) { nativeDenied = /Operation not permitted/.test(error.stderr ?? ""); }
  assert.equal(nativeDenied, true);
  const source = await readFile(resolve(root, "prisma/schema.prisma"), "utf8");
  const blocks = [...source.matchAll(/^(?:model|enum) (\w+) \{[\s\S]*?^\}/gm)]
    .filter(m => !["Property", "PropertyStatus", "PropertyDealType", "PropertyCategory", "PropertyTradeMode"].includes(m[1]));
  assert.equal(blocks.filter(m => m[0].startsWith("model ")).length, 8);
  const schemaPath = resolve(secrets, "build-extra.prisma");
  await ownFile(schemaPath, 'datasource db {\n provider = "postgresql"\n url = env("DATABASE_URL")\n}\n' + blocks.map(m => m[0]).join("\n"));
  const ddl = await exec("/usr/bin/sandbox-exec", ["-f", profilePath, process.execPath, resolve(root, "node_modules/prisma/build/index.js"), "migrate", "diff", "--from-empty", "--to-schema-datamodel", schemaPath, "--script"],
    { cwd: secrets, env: { ...childEnv, CHECKPOINT_DISABLE: "1" }, timeout: 15000, maxBuffer: 500000 });
  assert.equal((ddl.stdout.match(/CREATE TABLE/g) || []).length, 8); await db.query(ddl.stdout);
  const role = "sync_build_reader"; assert.match(password, /^[a-f0-9]{64}$/); assert.match(propertyId, /^[a-f0-9-]{36}$/);
  // Reuses an existing ephemeral harness password; no persistent credentials or authentication configuration.
  await db.query(`CREATE ROLE ${role} LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION NOBYPASSRLS PASSWORD '${password}';
    GRANT CONNECT ON DATABASE ${database} TO ${role}; GRANT USAGE ON SCHEMA public TO ${role}; GRANT SELECT ON ALL TABLES IN SCHEMA public TO ${role};
    CREATE POLICY synthetic_build_read ON public.properties FOR SELECT TO ${role} USING (id='${propertyId}')`);
  const privileges = (await db.query(`SELECT has_table_privilege('${role}','public.properties','UPDATE') AS property_update,
    has_table_privilege('${role}','public.columns','INSERT') AS column_insert,has_schema_privilege('${role}','public','CREATE') AS ddl,
    has_table_privilege('${role}','public.property_publication_effects','UPDATE') AS effects_update`)).rows[0];
  assert.ok(Object.values(privileges).every(v => v === false));
  const tables = blocks.filter(m => m[0].startsWith("model ")).map(m => m[0].match(/@@map\("([a-z_]+)"\)/)[1]);
  const counts = async () => { const result = {}; for (const t of tables) result[t] = (await db.query(`SELECT count(*)::int AS count FROM public.${t}`)).rows[0].count; return result; };
  assert.ok(Object.values(await counts()).every(n => n === 0));
  const guardPath = resolve(secrets, "build-network-guard.cjs");
  await ownFile(guardPath, `const deny=()=>{throw new Error('LOCAL_BUILD_NETWORK_DISABLED')};require('node:net').Socket.prototype.connect=deny;require('node:tls').connect=deny;require('node:dns').lookup=deny;globalThis.fetch=async()=>deny();\n`);
  // Installed Next's documented test hook. No Google request; this checks compilation, not production font rendering.
  const fontMockPath = resolve(secrets, "font-mock.cjs");
  const localFont = resolve(root, "node_modules/next/dist/next-devtools/server/font/geist-latin.woff2");
  assert.equal((await lstat(localFont)).isFile(), true);
  const fontMocks = Object.fromEntries(["Sans", "Serif"].map(kind => [`https://fonts.googleapis.com/css2?family=Noto+${kind}+JP:wght@${kind === "Serif" ? "200" : "100"}..900&display=swap`,
    `/* latin */\n@font-face {font-family: 'Noto ${kind} JP';font-style:normal;font-weight:100 900;font-display:swap;src:url(${localFont}) format('woff2');}`]));
  await ownFile(fontMockPath, "module.exports = " + JSON.stringify(fontMocks) + ";\n");
  const url = new URL(`postgresql://${role}:${password}@localhost:${port}/${database}`);
  url.searchParams.set("host", socket); url.searchParams.set("connection_limit", "1"); url.searchParams.set("connect_timeout", "3");
  const env = { ...childEnv, DATABASE_URL: url.href, DIRECT_URL: url.href, NODE_OPTIONS: `--require=${guardPath}`, NEXT_BUILD_WORKERS: "2",
    NEXT_TELEMETRY_DISABLED: "1", CHECKPOINT_DISABLE: "1", CI: "1", NEXT_FONT_GOOGLE_MOCKED_RESPONSES: fontMockPath };
  let stdout = "", stderr = "", exitCode = 0;
  try {
    const result = await exec("/usr/bin/sandbox-exec", ["-f", profilePath, "/opt/homebrew/bin/npm", "run", "build", "--", "--webpack"], { cwd: root, env, timeout: 120000, maxBuffer: 3000000 });
    stdout = result.stdout; stderr = result.stderr;
  } catch (error) { exitCode = typeof error.code === "number" ? error.code : 1; stdout = error.stdout ?? ""; stderr = error.stderr ?? ""; }
  const log = (stdout + "\n" + stderr).replaceAll(url.href, "[LOCAL_DATABASE_URL]").replaceAll(password, "[REDACTED]");
  const logName = `evidence/unit${unit}-postgres/isolated-build-${Date.now()}.log`;
  await mkdir(resolve(root, "..", `evidence/unit${unit}-postgres`), { recursive: true, mode: 0o700 });
  await writeFile(resolve(root, "..", logName), log, { flag: "wx", mode: 0o600 });
  assert.ok(Object.values(await counts()).every(n => n === 0));
  let checkedPublicFiles = 0;
  async function checkPublicArtifacts(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const file = resolve(dir, entry.name);
      if (entry.isDirectory()) await checkPublicArtifacts(file);
      else if (/\.(html|rsc|body|meta|json)$/.test(entry.name)) {
        const text = await readFile(file, "utf8");
        assert.equal(privateCanaries.some(canary => text.includes(canary)), false); checkedPublicFiles++;
      }
    }
  }
  await checkPublicArtifacts(resolve(root, ".next/server/app"));
  return { exitCode, compiled: log.includes("Compiled successfully"), typescript: log.includes("Finished TypeScript"),
    extraSchemaTables: tables.length, emptyExtraTablesUnchanged: true, readOnlyRole: true, applicationCredentialsPassed: false, tcpListener: false,
    jsNetworkBlocked: true, osNetworkDeniedExceptExactUnixSocket: true, nativeLoopbackDenied: nativeDenied, checkedPublicFiles, googleFontsMocked: true, productionFontRenderingVerified: false,
    privateCanaryAbsentFromPublicBuildArtifacts: true, checkedPrivateCanaries: privateCanaries.length, log: logName, fullBuildPassed: exitCode === 0 };
}
