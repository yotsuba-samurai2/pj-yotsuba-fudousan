/** Read-only diagnostic on emitted editorial payloads. No review records, model, DB or network. */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import type { ColumnInput } from "../src/lib/column-shared";
import { columnQualityFingerprint, columnQualityReasons } from "../src/lib/columns-autopublish-quality";

const base = process.env.COLUMN_PREFLIGHT_BASE;
if (!base || !/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(base)) throw new Error("A frozen workflow commit SHA is required");
const seeds = ["realestate-columns-daily", "souzoku-legal-columns", "labor-columns"].map(s => `src/lib/data/${s}-seed.ts`);

// Parse generated JSON as data. Do not import or execute code from a draft artifact.
function articles(text: string): ColumnInput[] {
  const match = /export const \w+[^=]*= (\[[\s\S]*\]);\s*$/.exec(text);
  if (!match) throw new Error("Expected a generated seed JSON array");
  return JSON.parse(match[1]) as ColumnInput[];
}
const keyOf = (a: ColumnInput) => a.business + ":" + a.slug;
const old = new Map(seeds.flatMap(seed => articles(execFileSync("git", ["show", base + ":" + seed],
  { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }))).map(a => [keyOf(a), columnQualityFingerprint(a)]));
const inventory = seeds.flatMap(seed => articles(readFileSync(seed, "utf8")));
const changes = inventory.filter(a => columnQualityFingerprint(a) !== old.get(keyOf(a)));
const issues = changes.flatMap(a => {
  // Ask the unchanged publication checker about the actual emitted text. No fabricated independent review.
  const reasons = columnQualityReasons(a, inventory, [], a.date);
  const locales = (["en", "zh-tw", "zh"] as const).filter(lang => reasons.includes(lang + "の内部リンクに言語不一致があります"));
  return locales.length ? [{ key: keyOf(a), locales }] : [];
});
console.log(JSON.stringify({ changed: changes.length, issues }));
if (issues.length) console.log(`::warning::${issues.length}本に訳文と内部リンク先の言語不一致があります。該当キーと言語は直前のJSONを確認してください。これは公開承認ではありません。`);
