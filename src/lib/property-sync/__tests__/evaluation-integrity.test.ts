import { createHash } from "node:crypto";
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, expect, it } from "vitest";
import { checkEvaluationIntegrity, type EvaluationLock } from "../evaluation-integrity";
import { contentHash } from "../rules";

const dirs: string[] = [], now = "2026-10-25T00:30:00.000Z";
afterEach(async () => { await Promise.all(dirs.splice(0).map(dir => rm(dir, { recursive: true, force: true }))); });
async function fixture() {
  const root = await mkdtemp(join(tmpdir(), "yotsuba-eval-")); dirs.push(root);
  await mkdir(join(root, "test"));
  const values = [
    { id: "expected", role: "expected_results" as const, path: "test/expected.json", text: '{"PRIVATE_EXPECTATION":"deny"}' },
    { id: "policy", role: "evaluation_policy" as const, path: "policy.json", text: '{"PRIVATE_POLICY":"fixed"}' },
    { id: "harness", role: "test_harness" as const, path: "harness.ts", text: 'throw new Error("CANDIDATE_CODE_MUST_NOT_EXECUTE");' },
  ];
  for (const file of values) await writeFile(join(root, file.path), file.text);
  const lock: EvaluationLock = { id: "synthetic-lock", version: 1, status: "approved", approvalRef: "PRIVATE_APPROVAL", approvedAt: "2026-10-25T00:00:00.000Z",
    validFrom: "2026-10-25T00:00:00.000Z", validUntil: "2026-10-25T01:00:00.000Z",
    files: values.map(file => ({ id: file.id, role: file.role, path: file.path, byteLength: Buffer.byteLength(file.text), sha256: createHash("sha256").update(file.text).digest("hex") })) };
  return { root, lock };
}
const run = (f: Awaited<ReturnType<typeof fixture>>) => checkEvaluationIntegrity(f.root, f.lock, contentHash(f.lock), now);
it("locked files一致でもholdout隔離/実行/採用を確認済みにしない。候補codeは実行しない", async () => {
  const f = await fixture(), result = await run(f);
  expect(result).toMatchObject({ status: "locked_files_matched", executable: false, comparisonValid: false, reference: { fileCount: 3 } });
  expect(JSON.stringify(result)).not.toMatch(/PRIVATE_|CANDIDATE_CODE|harness.ts|expected.json/);
  expect(JSON.stringify(result)).not.toContain(f.root);
  expect(await readFile(join(f.root, "harness.ts"), "utf8")).toContain("CANDIDATE_CODE_MUST_NOT_EXECUTE");
});
it.each(["expected", "policy", "harness"])("%s書換えを比較無効として検出", async id => {
  const f = await fixture(), file = f.lock.files.find(file => file.id === id)!;
  const bytes = await readFile(join(f.root, file.path)); bytes[0] ^= 1; await writeFile(join(f.root, file.path), bytes);
  expect(await run(f)).toMatchObject({ status: "evaluation_invalid", reason: "EVALUATION_LOCKED_FILE_CHANGED_OR_UNREADABLE", fileId: id });
});
it("候補側が期待値とlock hashを更新しても独立pinが変わらなければ拒否", async () => {
  const f = await fixture(), expectedHash = contentHash(f.lock), file = f.lock.files[0];
  await writeFile(join(f.root, file.path), "changed"); file.byteLength = 7; file.sha256 = createHash("sha256").update("changed").digest("hex");
  expect(await checkEvaluationIntegrity(f.root, f.lock, expectedHash, now)).toMatchObject({ reason: "EVALUATION_BASELINE_CHANGED" });
});
it("lock自体の版や承認状態を書き換えてもpin不一致", async () => {
  const f = await fixture(), expectedHash = contentHash(f.lock); f.lock.version++;
  expect(await checkEvaluationIntegrity(f.root, f.lock, expectedHash, now)).toMatchObject({ reason: "EVALUATION_BASELINE_CHANGED" });
});
it.each(["pending", "revoked"] as const)("承認状態%sは無効", async status => {
  const f = await fixture(); f.lock.status = status; expect(await run(f)).toMatchObject({ reason: "EVALUATION_BASELINE_UNAPPROVED" });
});
it("期限/未来承認/開始前を保留し適当な旧版へfallbackしない", async () => {
  const f = await fixture(); f.lock.validUntil = now; expect(await run(f)).toMatchObject({ reason: "EVALUATION_BASELINE_OUTSIDE_VALIDITY" });
  f.lock.validUntil = "2026-10-25T01:00:00.000Z"; f.lock.validFrom = "2026-10-25T00:31:00.000Z";
  expect(await run(f)).toMatchObject({ reason: "EVALUATION_BASELINE_OUTSIDE_VALIDITY" });
  f.lock.validFrom = "2026-10-25T00:00:00.000Z"; f.lock.approvedAt = "2026-10-25T00:31:00.000Z";
  expect(await run(f)).toMatchObject({ reason: "EVALUATION_BASELINE_UNAPPROVED" });
});
it("expected/policy/harnessのいずれかがlockにない、ID/path重複、総量上限超は入力拒否", async () => {
  const f = await fixture();
  const variants = [
    { ...f.lock, files: f.lock.files.slice(1) },
    { ...f.lock, files: [f.lock.files[0], ...f.lock.files.slice(1).map(file => ({ ...file, role: "expected_results" }))] },
    { ...f.lock, files: f.lock.files.map(file => ({ ...file, id: "same" })) },
    { ...f.lock, files: f.lock.files.map(file => ({ ...file, path: "same.ts" })) },
    { ...f.lock, files: f.lock.files.map(file => ({ ...file, byteLength: 8_000_000 })) },
  ];
  for (const lock of variants) expect(await checkEvaluationIntegrity(f.root, lock, contentHash(lock), now)).toMatchObject({ reason: "INVALID_EVALUATION_INPUT" });
});
it("case違いの同名pathも別の保護fileと数えない", async () => {
  const f = await fixture(); f.lock.files[0].path = "Policy.json";
  expect(await run(f)).toMatchObject({ reason: "INVALID_EVALUATION_INPUT" });
});
it.each(["../secret.json", "test/../secret.json", "/absolute/file.json", "test//file.json", "test/./file.json", "test\\file.json"])("不正path %sを読取前に拒否", async path => {
  const f = await fixture(); f.lock.files[0].path = path;
  expect(await run(f)).toMatchObject({ reason: "INVALID_EVALUATION_INPUT" });
});
it("cloud/URL/相対rootをローカル実体としない", async () => {
  const f = await fixture();
  for (const root of ["library-file:synthetic", "https://example.invalid/", "relative"]) expect(await checkEvaluationIntegrity(root, f.lock, contentHash(f.lock), now)).toMatchObject({ reason: "ABSOLUTE_CANDIDATE_ROOT_REQUIRED" });
});
it("消えたfile・途中fileを既存の結果で代用しない", async () => {
  const f = await fixture(); await rm(join(f.root, f.lock.files[0].path));
  expect(await run(f)).toMatchObject({ status: "evaluation_invalid" });
  await writeFile(join(f.root, f.lock.files[0].path), "partial"); expect(await run(f)).toMatchObject({ status: "evaluation_invalid" });
});
it("root/途中directory/leafのsymlinkを別の木へ追跡しない", async () => {
  const f = await fixture(), outside = await fixture();
  const rootLink = join(f.root, "alias"); await symlink(outside.root, rootLink);
  expect(await checkEvaluationIntegrity(rootLink, f.lock, contentHash(f.lock), now)).toMatchObject({ reason: "CANDIDATE_ROOT_NOT_DIRECTORY" });
  for (const root of [rootLink + "/", rootLink + "/.", rootLink + "/../alias"])
    expect(await checkEvaluationIntegrity(root, f.lock, contentHash(f.lock), now)).toMatchObject({ reason: "CANONICAL_CANDIDATE_ROOT_REQUIRED" });
  await rm(join(f.root, "test"), { recursive: true }); await symlink(join(outside.root, "test"), join(f.root, "test"));
  expect(await run(f)).toMatchObject({ reason: "EVALUATION_FILE_PARENT_UNSAFE" });
  await rm(join(f.root, "test")); await mkdir(join(f.root, "test")); await symlink(join(outside.root, "test/expected.json"), join(f.root, "test/expected.json"));
  expect(await run(f)).toMatchObject({ reason: "EVALUATION_LOCKED_FILE_CHANGED_OR_UNREADABLE" });
});
