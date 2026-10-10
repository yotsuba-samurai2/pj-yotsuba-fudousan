import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

// Run the actual workflow shell with fixture commands. No request can reach a network.
const workflow = readFileSync(process.env.COLUMNS_WORKFLOW_TEST_FILE ?? ".github/workflows/columns-autopublish.yml", "utf8");
function stepScript(id: string) {
  const step = workflow.split(`        id: ${id}\n`)[1]?.split("\n      - ")[0];
  const script = step?.split("        run: |\n")[1];
  if (!script) throw new Error(`Missing workflow step: ${id}`);
  return script.split("\n").map((line) => line.replace(/^          /, "")).join("\n");
}

function runPublish(responses: { code: number; body: unknown }[], secret = "fixture-only-secret", dryRun = false) {
  const dir = mkdtempSync(path.join(tmpdir(), "columns-workflow-"));
  const bin = path.join(dir, "bin");
  mkdirSync(bin);
  writeFileSync(path.join(dir, "responses.json"), JSON.stringify(responses));
  writeFileSync(path.join(bin, "curl"), `#!/usr/bin/env node
const fs = require('node:fs');
const args = process.argv.slice(2);
const url = args.at(-1);
if (!url.startsWith('https://example.invalid/')) process.exit(90);
const n = fs.existsSync('attempts') ? Number(fs.readFileSync('attempts', 'utf8')) : 0;
const r = JSON.parse(fs.readFileSync('responses.json', 'utf8'))[n];
if (!r) process.exit(91);
fs.writeFileSync('attempts', String(n + 1));
fs.appendFileSync('urls', url + '\\n');
fs.writeFileSync(args[args.indexOf('-o') + 1], typeof r.body === 'string' ? r.body : JSON.stringify(r.body));
process.stdout.write(String(r.code));
`, { mode: 0o755 });
  writeFileSync(path.join(bin, "sleep"), "#!/bin/sh\nexit 0\n", { mode: 0o755 });
  try {
    const result = spawnSync("bash", ["-c", stepScript("publish")], {
      cwd: dir,
      env: { NODE_ENV: "test", PATH: `${bin}:${process.env.PATH}`, SITE: "https://example.invalid", SECRET: secret,
        DRY_RUN: String(dryRun), GITHUB_OUTPUT: path.join(dir, "output") },
      encoding: "utf8",
    });
    return {
      code: result.status,
      publish: JSON.parse(readFileSync(path.join(dir, ".tmp/publish.json"), "utf8")),
      output: readFileSync(path.join(dir, "output"), { encoding: "utf8", flag: "a+" }),
      attempts: Number(readFileSync(path.join(dir, "attempts"), { encoding: "utf8", flag: "a+" })),
      urls: readFileSync(path.join(dir, "urls"), { encoding: "utf8", flag: "a+" }),
    };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

describe("Columns Autopublish workflow", () => {
  it("fails visibly without a secret and makes no HTTP request", () => {
    const result = runPublish([], "");
    expect(result.code).toBe(1);
    expect(result.publish.error).toContain("COLUMNS_AUTOPUBLISH_SECRET");
    expect(result.output).toContain("SUMMARY=");
    expect(result.attempts).toBe(0);
  });

  it.each([401, 409])("does not retry HTTP %s", (code) => {
    const result = runPublish([{ code, body: { ok: false } }]);
    expect(result.code).toBe(1);
    expect(result.attempts).toBe(1);
  });

  it("sends only the dry-run query for a dry run", () => {
    const result = runPublish([{ code: 200, body: { ok: true, dryRun: true, published: [] } }], undefined, true);
    expect(result.code).toBe(0);
    expect(result.urls).toBe("https://example.invalid/api/cron/columns-autopublish?dryRun=1\n");
    expect(result.publish.published).toEqual([]);
  });

  it("keeps publications from a partial failure for HTTP verification after retry", () => {
    const a = { key: "legal:a", path: "/legal/column/a" };
    const b = { key: "labor:b", path: "/labor/column/b" };
    const result = runPublish([
      { code: 500, body: { ok: false, published: [a], errors: [{ key: "labor:b", message: "temporary failure" }] } },
      { code: 200, body: { ok: true, published: [b], errors: [] } },
    ]);
    expect(result.code).toBe(0);
    expect(result.attempts).toBe(2);
    expect(result.publish.published).toEqual([b, a].sort((x, y) => x.key.localeCompare(y.key)));
  });

  it("does not hide a refresh failure by retrying already-published articles", () => {
    const result = runPublish([
      { code: 500, body: { ok: false, published: [{ key: "legal:a", path: "/legal/column/a" }], refreshError: "refresh failed" } },
      { code: 200, body: { ok: true, published: [], errors: [] } },
    ]);
    expect(result.code).toBe(1);
    expect(result.attempts).toBe(1);
    expect(result.publish.refreshError).toBe("refresh failed");
  });

  it("dry-run reports targets without any Google request, even with a configured key", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "columns-gsc-dry-"));
    try {
      const preload = path.join(dir, "fixture-fetch.mjs");
      writeFileSync(preload, `
        import { appendFileSync } from 'node:fs';
        globalThis.fetch = async (url, options) => {
          appendFileSync(${JSON.stringify(path.join(dir, "requests"))}, String(url) + '\\n');
          if (!String(url).startsWith('https://luck428.com/sitemap.xml?') || options?.method) {
            throw new Error('Unexpected external operation in dry run');
          }
          return new Response('<urlset><url><loc>https://luck428.com/column/fixture</loc><lastmod>' + new Date().toISOString() + '</lastmod></url></urlset>');
        };
      `);
      const publish = path.join(dir, "publish.json");
      writeFileSync(publish, JSON.stringify({ dryRun: true, published: [], targets: [
        { title: "Anonymous fixture", path: "/column/fixture" },
      ] }));
      const summary = path.join(dir, "summary.md");
      const result = spawnSync(process.execPath, ["--import", "tsx", "--import", preload,
        "scripts/gsc-autopilot.ts", "--dry-run", "--publish", publish,
        "--summary", summary, "--out", path.join(dir, "status.json")], {
        env: { NODE_ENV: "test", PATH: process.env.PATH, GSC_SERVICE_ACCOUNT_JSON: "fixture-not-a-real-key" },
        encoding: "utf8",
      });
      expect(result.status, result.stderr).toBe(0);
      const text = readFileSync(summary, "utf8");
      expect(text).toContain("公開予定 1本");
      expect(text).toContain("Anonymous fixture");
      expect(text).toContain("URL検査を行っていません");
      expect(readFileSync(path.join(dir, "requests"), "utf8").trim().split("\n")).toHaveLength(1);
      expect(stepScript("gsc")).toContain("ARGS+=(--dry-run)");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
