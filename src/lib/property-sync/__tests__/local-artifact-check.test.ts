import { createHash } from "node:crypto";
import { mkdtemp, open, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, expect, it, vi } from "vitest";
import { inspectLocalArtifact, type LocalArtifactManifest } from "../local-artifact-check";
import { contentHash } from "../rules";

const fault = vi.hoisted(() => ({ grow: false, read: false }));
vi.mock("node:fs/promises", async importOriginal => {
  const fs = await importOriginal<typeof import("node:fs/promises")>();
  return { ...fs, open: async (...args: Parameters<typeof fs.open>) => {
    const handle = await fs.open(...args);
    return new Proxy(handle, { get(target, key) {
      if (String(args[0]).endsWith("artifact.bin")) {
        if (key === "stat") return async (...params: Parameters<typeof handle.stat>) => {
          const stat = await target.stat(...params); if (fault.grow) await fs.appendFile(String(args[0]), "EXTRA"); return stat;
        };
        if (key === "read" && fault.read) return async () => { throw new Error("PRIVATE_READ_ERROR"); };
      }
      const value = Reflect.get(target, key, target); return typeof value === "function" ? value.bind(target) : value;
    } });
  } };
});
const dirs: string[] = [];
afterEach(async () => { fault.grow = false; fault.read = false; await Promise.all(dirs.splice(0).map(d => rm(d, { recursive: true, force: true }))); });
function manifest(bytes: Buffer, format: LocalArtifactManifest["format"] = "pdf"): LocalArtifactManifest {
  return { artifactId: "synthetic-artifact", version: 1, byteLength: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex"), format,
    completion: "complete", acquisition: "local_generated", authorization: "confirmed", authorizationRef: "PRIVATE_AUTHORIZATION" };
}
async function fixture(bytes = Buffer.from("%PDF-1.7\nsynthetic shape only, not a valid parsed document\n%%EOF\n"), format: LocalArtifactManifest["format"] = "pdf") {
  const dir = await mkdtemp(join(tmpdir(), "yotsuba-artifact-")); dirs.push(dir); const path = join(dir, "artifact.bin"); await writeFile(path, bytes);
  return { dir, path, bytes, manifest: manifest(bytes, format) };
}
const run = (f: Awaited<ReturnType<typeof fixture>>) => inspectLocalArtifact(f.path, f.manifest, contentHash(f.manifest));

it("実在regular fileの全bytes/sha/形式入口を照合してもPDF妥当性や公開安全を主張しない", async () => {
  const f = await fixture(), result = await run(f);
  expect(result).toMatchObject({ status: "matched", executable: false, contentSafe: false, reference: { artifactId: f.manifest.artifactId, byteLength: f.bytes.length, sha256: f.manifest.sha256 },
    pendingGates: ["SOURCE_AUTHENTICITY", "FORMAT_SEMANTICS_AND_PARSER_VALIDATION", "PUBLIC_CONTENT_REVIEW"] });
  expect(JSON.stringify(result)).not.toContain(f.path); expect(JSON.stringify(result)).not.toMatch(/PRIVATE_|synthetic shape/);
  expect(await readFile(f.path)).toEqual(f.bytes);
});
it.each(["library-file:synthetic", "project-file:synthetic", "https://example.invalid/file.pdf", "relative/file.pdf"])("%sをMac実体pathとして扱わない", async path => {
  const f = await fixture(); expect(await inspectLocalArtifact(path, f.manifest, contentHash(f.manifest))).toMatchObject({ reason: "ABSOLUTE_LOCAL_PATH_REQUIRED" });
});
it("存在しないローカルpathの代替を推測しない", async () => {
  const f = await fixture(); f.path = join(f.dir, "missing"); expect(await run(f)).toMatchObject({ reason: "LOCAL_ARTIFACT_NOT_FOUND" });
});
it.each(["in_progress", "unknown"] as const)("manifest完成状態%sは取得済みとしない", async completion => {
  const f = await fixture(); f.manifest.completion = completion; expect(await run(f)).toMatchObject({ reason: "ARTIFACT_COMPLETION_UNCONFIRMED" });
});
it.each(["unconfirmed", "unknown-method", "no-reference"])("取得許可%sを補完しない", async key => {
  const f = await fixture();
  if (key === "unconfirmed") f.manifest.authorization = "unconfirmed";
  if (key === "unknown-method") f.manifest.acquisition = "unknown";
  if (key === "no-reference") f.manifest.authorizationRef = null;
  expect(await run(f)).toMatchObject({ reason: "ARTIFACT_AUTHORIZATION_UNCONFIRMED" });
});
it("manifest版/hash差替え・同長さの別内容・途中長さを拒否", async () => {
  const f = await fixture(); expect(await inspectLocalArtifact(f.path, f.manifest, "d".repeat(64))).toMatchObject({ reason: "ARTIFACT_MANIFEST_MISMATCH" });
  const changed = Buffer.from(f.bytes); changed[10] ^= 1; await writeFile(f.path, changed); expect(await run(f)).toMatchObject({ reason: "ARTIFACT_HASH_MISMATCH" });
  await writeFile(f.path, f.bytes.subarray(0, 10)); expect(await run(f)).toMatchObject({ reason: "ARTIFACT_LENGTH_MISMATCH" });
});
it("PDF名/宣言でもログインHTMLを受理しない", async () => {
  const f = await fixture(Buffer.from("<!doctype html><html><form>PRIVATE_LOGIN</form></html>"));
  expect(await run(f)).toEqual({ status: "held", executable: false, contentSafe: false, reason: "ARTIFACT_PDF_HEADER_MISMATCH" });
});
it("PDF headerだけの途中fileは自己申告hash一致でも保留", async () => {
  const f = await fixture(Buffer.from("%PDF-1.7\npartial")); expect(await run(f)).toMatchObject({ reason: "ARTIFACT_PDF_TERMINATOR_MISSING" });
});
it.each(["header", "terminator"])("%sの上位bitを落としてASCII signatureへ変換しない", async part => {
  const bytes = Buffer.from("%PDF-1.7\nsynthetic\n%%EOF"); bytes[part === "header" ? 0 : bytes.length - 1] |= 0x80;
  const f = await fixture(bytes); expect(await run(f)).toMatchObject({ reason: part === "header" ? "ARTIFACT_PDF_HEADER_MISMATCH" : "ARTIFACT_PDF_TERMINATOR_MISSING" });
});
it("JSONはUTF8と構文だけを検査し業務schemaはpending", async () => {
  const f = await fixture(Buffer.from('{"synthetic":true}'), "json"); expect(await run(f)).toMatchObject({ status: "matched", contentSafe: false });
  const broken = await fixture(Buffer.from('{"partial":'), "json"); expect(await run(broken)).toMatchObject({ reason: "ARTIFACT_JSON_SYNTAX_INVALID" });
});
it("UTF8文字化けを置換して受理しない", async () => {
  const f = await fixture(Buffer.from([0xff, 0xfe]), "utf8_text"); expect(await run(f)).toMatchObject({ reason: "ARTIFACT_UTF8_INVALID" });
});
it("leaf symlink・directory・FIFOを読取り対象にしない", async () => {
  const f = await fixture(), link = join(f.dir, "link"), fifo = join(f.dir, "fifo"); await symlink(f.path, link); execFileSync("mkfifo", [fifo]);
  expect(await inspectLocalArtifact(link, f.manifest, contentHash(f.manifest))).toMatchObject({ status: "held" });
  expect(await inspectLocalArtifact(f.dir, f.manifest, contentHash(f.manifest))).toMatchObject({ reason: "ARTIFACT_NOT_REGULAR_FILE" });
  expect(await inspectLocalArtifact(fifo, f.manifest, contentHash(f.manifest))).toMatchObject({ reason: "ARTIFACT_NOT_REGULAR_FILE" });
});
it("stat後のfile増大も実読取り上限で拒否", async () => {
  const f = await fixture(); fault.grow = true; expect(await run(f)).toMatchObject({ reason: "ARTIFACT_LENGTH_MISMATCH" });
});
it("8MBを越える実fileを読み込まず保留", async () => {
  const f = await fixture(), handle = await open(f.path, "r+"); try { await handle.truncate(8000001); } finally { await handle.close(); }
  expect(await run(f)).toMatchObject({ reason: "ARTIFACT_SIZE_LIMIT" });
});
it("読取り例外のpath/本文を返さない", async () => {
  const f = await fixture(); fault.read = true; expect(await run(f)).toEqual({ status: "held", executable: false, contentSafe: false, reason: "LOCAL_ARTIFACT_CHECK_FAILED" });
});
