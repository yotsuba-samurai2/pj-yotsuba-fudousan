/** Offline bridge for the existing Daily independent review; never calls AI or DB. */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import type { ColumnInput } from "../src/lib/column-shared";
import { columnQualityFingerprint, type ColumnQualityReview } from "../src/lib/columns-autopublish-quality";
import { todayInJst } from "../src/lib/columns-autopublish-shared";
import { recordIndependentColumnReviews, type QualityCandidate } from "../src/lib/columns-autopublish-review-record";

const paths = ["realestate-columns-daily", "souzoku-legal-columns", "labor-columns"]
  .map((name) => `src/lib/data/${name}-seed.ts`);
function readArray<T>(source: string): T[] {
  const payload = source.match(/export const \w+[^=]*= (\[[\s\S]*\]);\s*$/)?.[1];
  if (!payload) throw new Error("Seed is not a generated JSON array");
  return JSON.parse(payload);
}
const inventory = paths.flatMap((path) => readArray<ColumnInput>(readFileSync(path, "utf8")));
mkdirSync(".tmp", { recursive: true });
if (process.argv[2] === "prepare") {
  const baseRef = process.env.COLUMNS_REVIEW_BASE_REF ?? "origin/main";
  const baseline = paths.flatMap((path) => readArray<ColumnInput>(execFileSync("git", ["show", `${baseRef}:${path}`], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 })));
  let baselineReviews: ColumnQualityReview[] = [];
  try {
    baselineReviews = readArray<ColumnQualityReview>(execFileSync("git", ["show", `${baseRef}:src/lib/data/columns-autopublish-reviews.ts`],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }));
  } catch { console.warn("No usable baseline reviews; unverified approvals will not be carried forward"); }
  const previous = new Map(baseline.map((article) => [`${article.business}:${article.slug}`, columnQualityFingerprint(article)]));
  const candidates = inventory.filter((article) => previous.get(`${article.business}:${article.slug}`) !== columnQualityFingerprint(article))
    .map((article) => ({ key: `${article.business}:${article.slug}`, fingerprint: columnQualityFingerprint(article) }));
  writeFileSync(".tmp/quality-candidates.json", JSON.stringify(candidates, null, 2) + "\n");
  // A separate non-model artifact prevents draft/fix edits from manufacturing approval.
  writeFileSync(".tmp/quality-baseline-reviews.json", JSON.stringify(baselineReviews, null, 2) + "\n");
  console.log(`Prepared ${candidates.length} content-bound review candidates`);
} else if (process.argv[2] === "record") {
  const candidates: QualityCandidate[] = JSON.parse(readFileSync(".tmp/quality-candidates.json", "utf8"));
  const baselineReviews: ColumnQualityReview[] = JSON.parse(readFileSync(".tmp/quality-baseline-reviews.json", "utf8"));
  let output: unknown;
  try { output = JSON.parse(process.env.REVIEW ?? ""); } catch { output = undefined; }
  const result = recordIndependentColumnReviews(candidates, output, inventory, baselineReviews,
    todayInJst(new Date()), process.env.RUN_URL ?? "");
  writeFileSync("src/lib/data/columns-autopublish-reviews.ts",
    'import type { ColumnQualityReview } from "@/lib/columns-autopublish-quality";\n\n' +
    '// Recorded from independent review; changed or incomplete articles remain held.\n' +
    'export const COLUMNS_AUTOPUBLISH_REVIEWS: readonly ColumnQualityReview[] = ' + JSON.stringify(result.reviews, null, 2) + ';\n');
  writeFileSync(".tmp/quality-holds.json", JSON.stringify(result.held, null, 2) + "\n");
  console.log(`Review proof: ${result.reviews.length} recorded, ${result.held.length} awaiting confirmation`);
  // Hold is a valid safe outcome, not permission to approve missing evidence.
} else throw new Error("Expected prepare or record");
