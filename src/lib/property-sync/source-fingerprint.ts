import { createHash } from "node:crypto";
import { z } from "zod";
import { canonicalJson } from "./rules";
import { planContextSchema, type PlanContext } from "./change-plan";

const MAX_BYTES = 8_000_000, MAX_NODES = 100_000, MAX_DEPTH = 32;
const instant = z.iso.datetime({ precision: 3 });
const metadataSchema = planContextSchema.shape.snapshot.omit({ version: true });
const sourceIdentity = z.object({ id: z.uuid(), updatedAt: instant }).strict();
// Current Property DB row, in camelCase. Optional DB values must be explicit nulls, not omitted.
const requiredSourceFields = ["id", "slug", "status", "dealType", "category", "tradeMode", "title",
  "priceYen", "priceNote", "locationText", "access", "spec", "images", "description", "publishedAt",
  "infoUpdatedAt", "nextUpdateAt", "locales", "translations", "internal", "createdAt", "updatedAt"] as const;
type Held = { status: "held"; executable: false; reason: string };
const held = (reason: string): Held => ({ status: "held", executable: false, reason });

function decimalIdentity(text: string): string | undefined {
  if (text.length > 512) return undefined;
  const match = /^(-?)(\d+)(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/.exec(text);
  if (!match) return undefined;
  const exponent = Number(match[4] ?? "0"), fraction = match[3] ?? "";
  if (!Number.isSafeInteger(exponent) || Math.abs(exponent) > 10_000) return undefined;
  const digits = (match[2] + fraction).replace(/^0+/, "");
  if (!digits) return "0";
  const coefficient = digits.replace(/0+$/, "");
  return `${match[1]}${coefficient}e${exponent - fraction.length + digits.length - coefficient.length}`;
}

/** Scan before JSON.parse can discard duplicate keys or allocate a deep/large object tree. */
export function parseBoundedJson(input: unknown): unknown {
  if (typeof input !== "string" || Buffer.byteLength(input, "utf8") > MAX_BYTES) throw new Error("INVALID_JSON_SOURCE");
  const stack: { object: boolean; expectingKey: boolean; keys: Set<string> }[] = [];
  const numberToken = /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/y;
  let tokens = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char === '"') {
      let end = i + 1;
      for (; end < input.length; end++) {
        if (input[end] === "\\") { end++; continue; }
        if (input[end] === '"') break;
      }
      if (end >= input.length) throw new Error("INVALID_JSON_SOURCE");
      const parent = stack.at(-1);
      if (parent?.object && parent.expectingKey) {
        const key = JSON.parse(input.slice(i, end + 1)) as unknown;
        if (typeof key !== "string" || parent.keys.has(key)) throw new Error("DUPLICATE_JSON_KEY");
        parent.keys.add(key); parent.expectingKey = false;
      }
      i = end;
    } else if (char === "-" || (char >= "0" && char <= "9")) {
      numberToken.lastIndex = i;
      const match = numberToken.exec(input);
      if (!match || ++tokens > MAX_NODES) throw new Error("INVALID_JSON_SOURCE");
      const exact = decimalIdentity(match[0]), number = Number(match[0]);
      if (exact === undefined || !Number.isFinite(number) || Object.is(number, -0)
        || Math.abs(number) > Number.MAX_SAFE_INTEGER || exact !== decimalIdentity(JSON.stringify(number))) {
        throw new Error("LOSSY_JSON_NUMBER");
      }
      i = numberToken.lastIndex - 1;
    } else if (char === "{" || char === "[") {
      if (++tokens > MAX_NODES || stack.length >= MAX_DEPTH) throw new Error("SOURCE_LIMIT");
      stack.push({ object: char === "{", expectingKey: char === "{", keys: new Set() });
    } else if (char === "}" || char === "]") {
      const parent = stack.pop();
      if (!parent || parent.object !== (char === "}")) throw new Error("INVALID_JSON_SOURCE");
    } else if (char === ",") {
      if (++tokens > MAX_NODES) throw new Error("SOURCE_LIMIT");
      const parent = stack.at(-1);
      if (parent?.object) parent.expectingKey = true;
    }
  }
  if (stack.length) throw new Error("INVALID_JSON_SOURCE");
  // Native parse validates the entire grammar. No reviver or arbitrary JS object is accepted.
  const value: unknown = JSON.parse(input);
  let nodes = 0;
  function validNumbers(item: unknown): boolean {
    if (++nodes > MAX_NODES) return false;
    if (typeof item === "number") return Number.isFinite(item) && !Object.is(item, -0) && Math.abs(item) <= Number.MAX_SAFE_INTEGER;
    if (item && typeof item === "object") return Object.values(item).every(validNumbers);
    return true;
  }
  if (!validNumbers(value)) throw new Error("INVALID_JSON_SOURCE");
  return value;
}

/**
 * Fingerprint serialized JSON text only. This is not a DB reader or permission check.
 * Date/BigInt/undefined must be explicitly normalized by a separately reviewed source adapter.
 * No source payload or source validation detail is returned.
 */
export function fingerprintPropertySource(recordJson: unknown): Held | {
  status: "fingerprinted"; executable: false; normalizationVersion: 1; propertyId: string; version: PlanContext["snapshot"]["version"];
} {
  try {
    const record = parseBoundedJson(recordJson);
    if (!record || typeof record !== "object" || Array.isArray(record)) return held("INVALID_PROPERTY_SOURCE");
    const source = record as Record<string, unknown>;
    if (requiredSourceFields.some(key => !Object.hasOwn(source, key))) return held("SOURCE_FIELDS_MISSING");
    const identity = sourceIdentity.safeParse({ id: source.id, updatedAt: source.updatedAt });
    if (!identity.success) return held("INVALID_PROPERTY_SOURCE");
    const canonical = canonicalJson(record);
    if (Buffer.byteLength(canonical, "utf8") > MAX_BYTES) return held("SOURCE_SIZE_LIMIT");
    const fullHash = createHash("sha256").update("yotsuba-property-source:v1\n").update(canonical).digest("hex");
    return { status: "fingerprinted", executable: false, normalizationVersion: 1,
      propertyId: identity.data.id, version: { updatedAt: identity.data.updatedAt, fullHash } };
  } catch { return held("INVALID_PROPERTY_SOURCE"); }
}

/** Add a separately authenticated episode/market binding; a source hash alone grants neither. */
export function fingerprintPropertySnapshot(recordJson: unknown, metadataJson: unknown, now: string): Held | {
  status: "fingerprinted"; executable: false; normalizationVersion: 1; snapshot: PlanContext["snapshot"];
} {
  let metadata: unknown;
  try { metadata = parseBoundedJson(metadataJson); } catch { return held("INVALID_SNAPSHOT_METADATA"); }
  const meta = metadataSchema.safeParse(metadata);
  if (!meta.success || !instant.safeParse(now).success) return held("INVALID_SNAPSHOT_METADATA");
  const source = fingerprintPropertySource(recordJson);
  if (source.status !== "fingerprinted") return source;
  if (source.propertyId !== meta.data.propertyId) return held("SOURCE_BINDING_MISMATCH");
  if (source.version.updatedAt > meta.data.capturedAt || meta.data.capturedAt > now) return held("INVALID_SNAPSHOT_TIME");
  return { status: "fingerprinted", executable: false, normalizationVersion: 1, snapshot: { ...meta.data, version: source.version } };
}
