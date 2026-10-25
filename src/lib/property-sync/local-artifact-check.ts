import "server-only";
import { constants } from "node:fs";
import { open } from "node:fs/promises";
import { isAbsolute } from "node:path";
import { createHash } from "node:crypto";
import { z } from "zod";
import { contentHash } from "./rules";

const MAX_BYTES = 8_000_000;
const id = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/), hash = z.string().regex(/^[a-f0-9]{64}$/);
export const localArtifactManifestSchema = z.object({ artifactId: id, version: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
  byteLength: z.number().int().min(1).max(MAX_BYTES), sha256: hash, format: z.enum(["pdf", "json", "utf8_text"]),
  completion: z.enum(["complete", "in_progress", "unknown"]),
  acquisition: z.enum(["library_materialized", "official_export", "local_generated", "unknown"]),
  authorization: z.enum(["confirmed", "unconfirmed"]), authorizationRef: id.nullable() }).strict();
export type LocalArtifactManifest = z.infer<typeof localArtifactManifestSchema>;
const held = (reason: string) => ({ status: "held" as const, executable: false as const, contentSafe: false as const, reason });

/** Bounded local-file identity check. No download, parser execution, URL resolution, transformation or publication. */
export async function inspectLocalArtifact(path: unknown, rawManifest: unknown, expectedManifestHash: unknown) {
  try {
    if (typeof path !== "string" || !isAbsolute(path) || path.includes("\0")) return held("ABSOLUTE_LOCAL_PATH_REQUIRED");
    const manifest = localArtifactManifestSchema.safeParse(rawManifest);
    if (!manifest.success || !hash.safeParse(expectedManifestHash).success) return held("INVALID_ARTIFACT_MANIFEST");
    const m = manifest.data;
    if (contentHash(m) !== expectedManifestHash) return held("ARTIFACT_MANIFEST_MISMATCH");
    if (m.authorization !== "confirmed" || !m.authorizationRef || m.acquisition === "unknown") return held("ARTIFACT_AUTHORIZATION_UNCONFIRMED");
    if (m.completion !== "complete") return held("ARTIFACT_COMPLETION_UNCONFIRMED");
    let handle;
    try { handle = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK); }
    catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      return held(code === "ENOENT" ? "LOCAL_ARTIFACT_NOT_FOUND" : code === "ELOOP" ? "ARTIFACT_SYMLINK_NOT_ALLOWED" : "LOCAL_ARTIFACT_READ_FAILED");
    }
    let bytes: Buffer;
    try {
      const stat = await handle.stat();
      if (!stat.isFile()) return held("ARTIFACT_NOT_REGULAR_FILE");
      if (stat.size > MAX_BYTES) return held("ARTIFACT_SIZE_LIMIT");
      if (stat.size !== m.byteLength) return held("ARTIFACT_LENGTH_MISMATCH");
      const buffer = Buffer.alloc(m.byteLength + 1);
      let length = 0;
      while (length < buffer.length) {
        const result = await handle.read(buffer, length, buffer.length - length, null);
        if (!result.bytesRead) break;
        length += result.bytesRead;
      }
      if (length !== m.byteLength) return held("ARTIFACT_LENGTH_MISMATCH");
      bytes = buffer.subarray(0, length);
    } finally { await handle.close(); }
    const actualHash = createHash("sha256").update(bytes).digest("hex");
    if (actualHash !== m.sha256) return held("ARTIFACT_HASH_MISMATCH");
    if (m.format === "pdf") {
      if (!bytes.subarray(0, 5).equals(Buffer.from("%PDF-", "ascii"))) return held("ARTIFACT_PDF_HEADER_MISMATCH");
      if (!bytes.subarray(-64).toString("latin1").replace(/[ \t\r\n\f]+$/, "").endsWith("%%EOF")) return held("ARTIFACT_PDF_TERMINATOR_MISSING");
    } else {
      let text: string;
      try { text = new TextDecoder("utf-8", { fatal: true }).decode(bytes); } catch { return held("ARTIFACT_UTF8_INVALID"); }
      if (m.format === "json") { try { JSON.parse(text); } catch { return held("ARTIFACT_JSON_SYNTAX_INVALID"); } }
    }
    const body = { artifactId: m.artifactId, version: m.version, manifestHash: expectedManifestHash as string, sha256: actualHash,
      byteLength: bytes.length, format: m.format, checkedAt: new Date().toISOString() };
    return { status: "matched" as const, executable: false as const, contentSafe: false as const, reason: "LOCAL_ARTIFACT_BYTES_MATCHED",
      reference: { ...body, hash: contentHash(body) },
      pendingGates: ["SOURCE_AUTHENTICITY", "FORMAT_SEMANTICS_AND_PARSER_VALIDATION", "PUBLIC_CONTENT_REVIEW"] as const };
  } catch { return held("LOCAL_ARTIFACT_CHECK_FAILED"); }
}
