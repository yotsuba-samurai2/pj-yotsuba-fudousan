import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { tmpdir } from "node:os";
import { execFileSync, spawnSync } from "node:child_process";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { qualityArticle, qualityReview } from "./fixtures/column-quality";
import { todayInJst } from "@/lib/columns-autopublish-shared";

const daily = readFileSync(".github/workflows/daily-columns.yml", "utf8");
const independent = daily.split("\n  review:\n")[1].split("\n  fix:\n")[0];
const gate = independent.split("      - id: gate\n")[1].split("\n      - ")[0];
const gateScript = gate.split("        run: |\n")[1].split("\n").map((line) => line.replace(/^          /, "")).join("\n");

function reviewGate(findings: unknown[], pass: boolean) {
  const dir = mkdtempSync(path.join(tmpdir(), "review-proof-fixture-"));
  try {
    const output = path.join(dir, "output");
    writeFileSync(output, "");
    const result = spawnSync("bash", ["-c", gateScript.replaceAll("/tmp/review.json", path.join(dir, "review.json"))], {
      env: { NODE_ENV: "test", PATH: process.env.PATH, OUT: JSON.stringify({ pass, findings }), GITHUB_OUTPUT: output }, encoding: "utf8",
    });
    expect(result.status, result.stderr).toBe(0);
    return readFileSync(output, "utf8");
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

describe("existing Daily independent review connection", () => {
  it("checks draft, validated and fixed artifacts before executing any inherited code", () => {
    for (const job of ["validate", "validate-repair", "review", "fix", "open-pr"]) {
      const section = daily.split(`\n  ${job}:\n`)[1].split(/\n  [a-z][a-z-]*:\n/)[0];
      const extraction = section.indexOf("tar -xzf");
      const protection = section.indexOf("name: 原稿artifactの制御コード改変を拒否", extraction);
      const nextExecution = section.indexOf("actions/setup-node", extraction);
      expect(protection, job).toBeGreaterThan(extraction);
      if (nextExecution >= 0) expect(protection, job).toBeLessThan(nextExecution);
    }
    const write = daily.split("\n  write:\n")[1].split("\n  validate:\n")[0];
    expect(write.indexOf("name: 原稿artifactの制御コード改変を拒否")).toBeLessThan(write.indexOf("name: 変更ファイルだけを集める"));
  });
  it("rejects a one-character control-code edit or new runtime while allowing article data", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "review-guard-fixture-"));
    const env: NodeJS.ProcessEnv = { NODE_ENV: "test", PATH: process.env.PATH, GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: "/dev/null" };
    try {
      const sha = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8", env }).trim();
      execFileSync("git", ["clone", "--quiet", "--shared", "--no-checkout", process.cwd(), dir], { env });
      execFileSync("git", ["-C", dir, "-c", "core.hooksPath=/dev/null", "checkout", sha, "--", ".github", "scripts", "src", "prisma", "package.json", "package-lock.json"], { env });
      const guard = daily.split("      - name: 原稿artifactの制御コード改変を拒否（凍結checkout比較）\n")[1]
        .split("\n      - ")[0].split("        run: |\n")[1].split("\n").map((line) => line.replace(/^          /, "")).join("\n")
        .replaceAll("${{ github.sha }}", sha);
      const run = () => spawnSync("bash", ["-c", guard], { cwd: dir, env, encoding: "utf8" });
      expect(run().status).toBe(0);
      writeFileSync(path.join(dir, "scripts/legal-columns/9999-anonymous-fixture.md"), "anonymous article changes\n");
      expect(run().status).toBe(0);
      const control = path.join(dir, "src/lib/columns-autopublish-shared.ts");
      const approved = readFileSync(control, "utf8");
      writeFileSync(control, approved + " ");
      expect(run().status).not.toBe(0);
      writeFileSync(control, approved);
      writeFileSync(path.join(dir, "src/lib/columns-autopublish-runtime.ts"), "export const bypass = true;\n");
      expect(run().status).not.toBe(0);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
  it("rejects major and blocker reports even with pass=true", () => {
    for (const severity of ["major", "blocker"]) {
      expect(reviewGate([{ file: "anonymous.md", severity, issue: "fixture", fix: "fixture" }], true)).toContain("pass=false");
    }
    expect(reviewGate([], true)).toContain("pass=true");
  });
  it("keeps the same paid model call count and existing schedule", () => {
    expect(independent.match(/uses: anthropics\/claude-code-action@v1/g)).toHaveLength(1);
    expect(daily).toContain('cron: "0 12 * * *"');
    expect(readFileSync(".github/workflows/columns-autopublish.yml", "utf8")).toContain('cron: "0 3 * * *"');
    expect(independent).toContain("scripts/columns-review-proof.ts prepare");
    expect(independent).toContain("COLUMNS_REVIEW_BASE_REF: ${{ github.sha }}");
    expect(daily.split("\n  open-pr:\n")[1]).toContain("scripts/columns-review-proof.ts record");
    const artifact = independent.split("          name: quality-candidates\n")[1].split("\n      - ")[0];
    expect(artifact).toContain("include-hidden-files: true");
    expect(artifact).toContain("if-no-files-found: error");
    expect(artifact).toContain(".tmp/quality-candidates.json");
    expect(artifact).toContain(".tmp/quality-baseline-reviews.json");
    expect(artifact).toContain(".tmp/quality-review-input/");
  });
  it("requires per-article evidence in the existing review output schema", () => {
    const schema = JSON.parse(independent.match(/--json-schema '([^']+)'/)![1]);
    expect(schema.required).toContain("articles");
    expect(schema.properties.articles.items.required).toEqual(expect.arrayContaining([
      "key", "fingerprint", "checks", "sources", "requiresQualifiedReview", "blockingFindings",
    ]));
  });
  it("prepares complete changed-article inputs without depending on tracked Markdown diffs", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "review-input-cli-"));
    const env: NodeJS.ProcessEnv = { PATH: process.env.PATH, NODE_ENV: "test", GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: "/dev/null" };
    try {
      mkdirSync(path.join(dir, "src/lib/data"), { recursive: true });
      const names = ["realestate-columns-daily", "souzoku-legal-columns", "labor-columns"];
      for (const name of names) writeFileSync(path.join(dir, `src/lib/data/${name}-seed.ts`), "export const FIXTURE = [];\n");
      execFileSync("git", ["init", "--quiet"], { cwd: dir, env });
      execFileSync("git", ["add", "."], { cwd: dir, env });
      execFileSync("git", ["-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid", "commit", "--quiet", "-m", "baseline"], { cwd: dir, env });
      const article = qualityArticle();
      writeFileSync(path.join(dir, "src/lib/data/souzoku-legal-columns-seed.ts"), `export const FIXTURE = ${JSON.stringify([article])};\n`);
      const result = spawnSync(process.execPath, ["--import", path.resolve("node_modules/tsx/dist/loader.mjs"),
        path.resolve("scripts/columns-review-proof.ts"), "prepare"], {
        cwd: dir, env: { ...env, TSX_TSCONFIG_PATH: path.resolve("tsconfig.json"), COLUMNS_REVIEW_BASE_REF: "HEAD" }, encoding: "utf8",
      });
      expect(result.status, result.stderr).toBe(0);
      const candidates = JSON.parse(readFileSync(path.join(dir, ".tmp/quality-candidates.json"), "utf8"));
      expect(candidates).toHaveLength(1);
      const packet = JSON.parse(readFileSync(path.join(dir, `.tmp/quality-review-input/legal-${article.slug}.json`), "utf8"));
      expect(packet).toEqual({ ...candidates[0], article });
      expect(independent).toContain(".tmp/quality-review-input/<business>-<slug>.json");
      expect(independent).toContain("--max-turns 80");
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
  it("keeps failed, unknown or cancelled reviews from entering fix", () => {
    const condition = daily.split("\n  fix:\n")[1].match(/    if: \$\{\{ (.*) \}\}/)![1]
      .replaceAll("cancelled()", "cancelled");
    for (const [result, pass, cancelled, expected] of [
      ["success", "false", false, true], ["failure", "false", false, false],
      ["success", "unknown", false, false], ["success", "true", false, false],
      ["success", "false", true, false],
    ]) {
      expect(runInNewContext(condition, { cancelled, needs: { review: { result, outputs: { pass } } } })).toBe(expected);
    }
  });
  it("records the proof through the actual offline CLI into an isolated fixture directory", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "review-proof-cli-"));
    try {
      const article = qualityArticle();
      const review = qualityReview(article);
      review.sources[0].checkedAt = todayInJst(new Date());
      mkdirSync(path.join(dir, ".tmp"));
      mkdirSync(path.join(dir, "src/lib/data"), { recursive: true });
      for (const seed of ["realestate-columns-daily", "souzoku-legal-columns", "labor-columns"]) {
        writeFileSync(path.join(dir, `src/lib/data/${seed}-seed.ts`), `export const FIXTURE = ${JSON.stringify(seed === "souzoku-legal-columns" ? [article] : [])};\n`);
      }
      writeFileSync(path.join(dir, ".tmp/quality-candidates.json"), JSON.stringify([{ key: review.key, fingerprint: review.fingerprint }]));
      writeFileSync(path.join(dir, ".tmp/quality-baseline-reviews.json"), "[]");
      const result = spawnSync(process.execPath, ["--import", path.resolve("node_modules/tsx/dist/loader.mjs"),
        path.resolve("scripts/columns-review-proof.ts"), "record"], {
        cwd: dir, env: { PATH: process.env.PATH, NODE_ENV: "test", TSX_TSCONFIG_PATH: path.resolve("tsconfig.json"), REVIEW: JSON.stringify({ pass: true, findings: [], articles: [review] }),
          RUN_URL: review.reviewer.evidenceUrl }, encoding: "utf8",
      });
      expect(result.status, result.stderr).toBe(0);
      expect(JSON.parse(readFileSync(path.join(dir, ".tmp/quality-holds.json"), "utf8"))).toEqual([]);
      expect(readFileSync(path.join(dir, "src/lib/data/columns-autopublish-reviews.ts"), "utf8")).toContain(review.fingerprint);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
});

describe("future real-estate translation FAQ output", () => {
  const source = readFileSync("scripts/seed-realestate-columns-daily.ts", "utf8");
  const readTranslation = source.slice(source.indexOf("function readTranslation("), source.indexOf("function buildColumn("));
  function parse(meta: Record<string, string>, date: string, count: number) {
    const context = {
      process: { cwd: () => "/anonymous" }, resolve: (...args: string[]) => args.join("/"), readFileSync: () => "anonymous fixture",
      parseFrontmatter: () => ({ meta: { title: "fixture", excerpt: "fixture", category: "fixture", ...meta }, body: "fixture" }),
      parseFaq: () => Array.from({ length: count }, (_, i) => ({ question: `Q${i}`, answer: `A${i}` })),
      REVIEWED_COLUMNS_20261010: new Set<string>(),
    };
    return runInNewContext(ts.transpile(readTranslation) + `\nreadTranslation({slug:'anonymous',file:'anonymous.md',publishedAt:'${date}'},'en')`, context);
  }
  it("requires explicit translated headings and four FAQ items for future drafts", () => {
    expect(() => parse({}, "2026-10-10", 4)).toThrow("faqHeading");
    expect(parse({ faqHeading: "FAQ" }, "2026-10-10", 4).faq).toHaveLength(4);
    expect(() => parse({ faqHeading: "FAQ" }, "2026-10-10", 3)).toThrow("4問");
  });
  it("preserves legacy data shape without headings", () => {
    expect(parse({}, "2026-10-09", 4).faq).toBeUndefined();
  });
});
