import "server-only";
import { lstat } from "node:fs/promises";
import { isAbsolute, join, normalize } from "node:path";
import { z } from "zod";
import { contentHash } from "./rules";
import { inspectLocalArtifact, type LocalArtifactManifest } from "./local-artifact-check";

const id = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/), hash = z.string().regex(/^[a-f0-9]{64}$/);
const instant = z.iso.datetime({ precision: 3 });
const path = z.string().min(1).max(500).regex(/^[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)*$/)
  .refine(value => value.split("/").every(part => part !== "." && part !== ".."));
export const evaluationLockSchema = z.object({
  id, version: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
  status: z.enum(["pending", "approved", "revoked"]), approvalRef: id.nullable(), approvedAt: instant.nullable(),
  validFrom: instant, validUntil: instant,
  files: z.array(z.object({ id, role: z.enum(["expected_results", "evaluation_policy", "test_harness"]),
    path, byteLength: z.number().int().min(1).max(8_000_000), sha256: hash }).strict()).min(3).max(200),
}).strict().superRefine((lock, ctx) => {
  const paths = lock.files.map(file => file.path.toLowerCase());
  if (lock.validUntil <= lock.validFrom || new Set(paths).size !== paths.length || new Set(lock.files.map(file => file.id)).size !== lock.files.length
    || new Set(lock.files.map(file => file.role)).size !== 3 || lock.files.reduce((total, file) => total + file.byteLength, 0) > 8_000_000) {
    ctx.addIssue({ code: "custom", message: "INVALID_EVALUATION_LOCK" });
  }
});
export type EvaluationLock = z.infer<typeof evaluationLockSchema>;
const invalid = (reason: string, fileId?: string) => ({ status: "evaluation_invalid" as const, executable: false as const, comparisonValid: false as const,
  reason, ...(fileId ? { fileId } : {}) });

/** Compare explicitly locked local files; never run candidate code, adapters, tests or model calls. */
export async function checkEvaluationIntegrity(root: unknown, rawLock: unknown, expectedLockHash: unknown, asOf: unknown) {
  try {
    const lock = evaluationLockSchema.safeParse(rawLock);
    if (!lock.success || !hash.safeParse(expectedLockHash).success || !instant.safeParse(asOf).success) return invalid("INVALID_EVALUATION_INPUT");
    const l = lock.data, now = asOf as string;
    if (contentHash(l) !== expectedLockHash) return invalid("EVALUATION_BASELINE_CHANGED");
    if (l.status !== "approved" || !l.approvalRef || !l.approvedAt || l.approvedAt > now) return invalid("EVALUATION_BASELINE_UNAPPROVED");
    if (now < l.validFrom || now >= l.validUntil) return invalid("EVALUATION_BASELINE_OUTSIDE_VALIDITY");
    if (typeof root !== "string" || !isAbsolute(root) || root.includes("\0")) return invalid("ABSOLUTE_CANDIDATE_ROOT_REQUIRED");
    // A trailing slash or dot can make lstat follow a symlink as a directory.
    if (normalize(root) !== root || (root.length > 1 && root.endsWith("/"))) return invalid("CANONICAL_CANDIDATE_ROOT_REQUIRED");
    const rootStat = await lstat(root);
    if (!rootStat.isDirectory() || rootStat.isSymbolicLink()) return invalid("CANDIDATE_ROOT_NOT_DIRECTORY");
    for (const file of [...l.files].sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0)) {
      let current = root;
      const parts = file.path.split("/");
      // Do not follow a manifest entry through a symlink into another tree or a holdout location.
      for (const part of parts.slice(0, -1)) {
        current = join(current, part);
        const stat = await lstat(current);
        if (!stat.isDirectory() || stat.isSymbolicLink()) return invalid("EVALUATION_FILE_PARENT_UNSAFE", file.id);
      }
      const manifest: LocalArtifactManifest = { artifactId: file.id, version: l.version, byteLength: file.byteLength, sha256: file.sha256,
        format: "utf8_text", completion: "complete", acquisition: "local_generated", authorization: "confirmed", authorizationRef: l.approvalRef };
      const result = await inspectLocalArtifact(join(root, file.path), manifest, contentHash(manifest));
      if (result.status !== "matched") return invalid("EVALUATION_LOCKED_FILE_CHANGED_OR_UNREADABLE", file.id);
    }
    return { status: "locked_files_matched" as const, executable: false as const, comparisonValid: false as const,
      reference: { id: l.id, version: l.version, lockHash: expectedLockHash as string, checkedAt: now, fileCount: l.files.length },
      pendingGates: ["INDEPENDENT_CURRENT_BASELINE", "COMPLETE_HARNESS_COVERAGE", "HOLDOUT_ISOLATION_AND_ACCESS_AUDIT", "TRUSTED_EVALUATION_EXECUTION", "HUMAN_ADOPTION_REVIEW"] as const };
  } catch { return invalid("EVALUATION_INTEGRITY_CHECK_FAILED"); }
}
