import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { columnQualityReasons } from "../columns-autopublish-quality";
import { qualityArticle, qualityReview } from "./fixtures/column-quality";

describe("Daily translation links", () => {
  it("verifies the writer guide's concrete examples with the production quality rules", () => {
    const guide = readFileSync("docs/daily-columns-pipeline.md", "utf8");
    const table = guide.split("\n").find(line => line.startsWith("| **翻訳の内部リンク**"))!;
    const links = [...table.matchAll(/\]\(([^)]+)\)/g)].map(m => m[1]);
    const a = qualityArticle(), langs = ["zh", "en", "zh-tw"] as const;
    links.forEach((url, i) => {
      expect(url.startsWith(i ? "https://luck428.com/" : "/")).toBe(true);
      a.translations![langs[i]]!.content += " [example](" + url + ")";
    });
    expect(columnQualityReasons(a, [a], [qualityReview(a)], "2026-10-08")).toEqual([]);
    expect(links).toHaveLength(3);
  });

  it("reports only new/changed final payloads, preserving unaffected siblings and all seed bytes", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "yotsuba-locales-"));
    const data = path.join(dir, "src/lib/data"), scripts = ["realestate-columns-daily", "souzoku-legal-columns", "labor-columns"];
    const env: NodeJS.ProcessEnv = { PATH: process.env.PATH, NODE_ENV: "test", GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: "/dev/null" };
    const git = (...args: string[]) => execFileSync("git", ["-c", "core.hooksPath=/dev/null", ...args], { cwd: dir, env, encoding: "utf8" });
    const write = (seed: string, list: ReturnType<typeof qualityArticle>[]) => writeFileSync(path.join(data, seed + "-seed.ts"), "export const ITEMS = " + JSON.stringify(list) + ";\n");
    try {
      mkdirSync(data, { recursive: true });
      const legacy = qualityArticle("unchanged"), changed = qualityArticle("edited");
      legacy.translations!.en!.content += " [old](https://luck428.com/legal/ryokin)";
      scripts.forEach(seed => write(seed, seed === scripts[1] ? [legacy, changed] : []));
      git("init", "-q"); git("add", "src"); git("-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid", "commit", "-qm", "fixture");
      const missing = qualityArticle("unprefixed"), good = qualityArticle("localized");
      changed.translations!.en!.content += " [wrong](/zh-tw/legal/ryokin)";
      for (const lang of ["en", "zh-tw", "zh"] as const) {
        missing.translations![lang]!.content += " [wrong](https://luck428.com/legal/ryokin)";
        good.translations![lang]!.content += ` [right](https://luck428.com/${lang}/legal/ryokin#fees) [section](#faq) ![image](/img.png) [primary](https://www.mhlw.go.jp/fixture)`;
      }
      write(scripts[1], [legacy, changed, missing, good]);
      const before = git("diff", "--binary");
      const output = execFileSync(process.execPath, ["--import", path.resolve("node_modules/tsx/dist/loader.mjs"), path.resolve("scripts/inspect-daily-translation-links.ts")],
        { cwd: dir, env: { ...env, COLUMN_PREFLIGHT_BASE: git("rev-parse", "HEAD").trim(), TSX_TSCONFIG_PATH: path.resolve("tsconfig.json") }, encoding: "utf8" });
      expect(JSON.parse(output.split("\n")[0])).toEqual({ changed: 3, issues: [
        { key: "legal:edited", locales: ["en"] }, { key: "legal:unprefixed", locales: ["en", "zh-tw", "zh"] },
      ] });
      expect(output).toContain("::warning::");
      expect(git("diff", "--binary")).toBe(before);
      expect(git("ls-files", "--others", "--exclude-standard")).toBe("");
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });

  it.each(["validate", "validate-repair"])("checks %s after emit and before independent review without introducing a paid action", job => {
    const yaml = readFileSync(".github/workflows/daily-columns.yml", "utf8");
    const section = yaml.split("\n  " + job + ":\n")[1].split(/\n  [a-z][a-z-]*:\n/)[0];
    const start = section.indexOf("name: 変更したseedの3翻訳");
    const step = section.slice(start).split("\n      - ")[0];
    expect(start).toBeGreaterThan(section.indexOf('npx tsx "scripts/$s.ts" --emit-ts'));
    expect(step).toContain("continue-on-error: true");
    expect(step).toContain("COLUMN_PREFLIGHT_BASE: ${{ github.sha }}");
    expect(step).toContain("node --import tsx scripts/inspect-daily-translation-links.ts");
    expect(section.match(/uses: anthropics\/claude-code-action@v1/g) ?? []).toHaveLength(job === "validate" ? 0 : 1);
  });
});
