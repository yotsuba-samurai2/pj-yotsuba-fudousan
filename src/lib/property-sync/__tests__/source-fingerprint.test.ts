import { expect, it, vi } from "vitest";
import { fingerprintPropertySnapshot } from "../source-fingerprint";
import { mediaState, now } from "./fixtures";

function fixture() {
  const state = mediaState();
  return {
    record: { id: state.propertyId, slug: "synthetic", status: "published", dealType: "rental", category: "other", tradeMode: "broker",
      updatedAt: state.listing.propertyVersion.updatedAt, createdAt: state.listing.propertyVersion.updatedAt, title: "synthetic",
      priceYen: 123, priceNote: null, locationText: "synthetic", access: [], spec: { area: 50.5 },
      internal: { adNote: "PRIVATE_CANARY" }, images: ["a", "b"], description: "synthetic", publishedAt: null,
      infoUpdatedAt: "2026-10-24", nextUpdateAt: "2026-10-25", locales: ["ja"], translations: null },
    meta: { propertyId: state.propertyId, episodeId: state.episodeId, market: "residential_rental",
      snapshotRef: "synthetic-read", capturedAt: now },
  };
}
const json = (value: unknown) => JSON.stringify(value);
function check(record: unknown, meta = fixture().meta, at = now) {
  // Fixtures explicitly serialize reviewed JSON data; the production function never does this coercion.
  return fingerprintPropertySnapshot(json(record), json(meta), at);
}
function hashText(recordJson: string) {
  const result = fingerprintPropertySnapshot(recordJson, json(fixture().meta), now);
  if (result.status !== "fingerprinted") throw new Error(result.reason);
  return result.snapshot.version.fullHash;
}
const hash = (record: unknown) => hashText(json(record));

it("全22項目のJSONをhashし、key順序に依存せず生データを返さない", () => {
  const f = fixture(), before = structuredClone(f);
  const result = check(f.record, f.meta);
  expect(result).toMatchObject({ status: "fingerprinted", executable: false, normalizationVersion: 1 });
  expect(f).toEqual(before);
  expect(hash(Object.fromEntries(Object.entries(f.record).reverse()))).toBe(hash(f.record));
  expect(JSON.stringify(result)).not.toMatch(/PRIVATE_CANARY|adNote|priceYen|synthetic"/);
});

it.each(["private", "public", "array-order", "extra-field", "null-field"])("同一updatedAtでも%s変更を検出", change => {
  const f = fixture(), next: Record<string, unknown> = structuredClone(f.record);
  if (change === "private") next.internal = { adNote: "changed" };
  if (change === "public") next.priceYen = 124;
  if (change === "array-order") next.images = ["b", "a"];
  if (change === "extra-field") next.newSourceField = "new";
  if (change === "null-field") next.newSourceField = null;
  expect(hash(next)).not.toBe(hash(f.record));
});

it.each(["plain", "Date", "disguised-Date", "Map", "BigInt", "undefined", "function"])("任意のJS入力%sを暗黙にserializeしない", kind => {
  const f = fixture();
  const date = new Date(now); Object.setPrototypeOf(date, Object.prototype);
  const values: Record<string, unknown> = { plain: f.record, Date: new Date(now), "disguised-Date": date,
    Map: new Map([["secret", "PRIVATE_CANARY"]]), BigInt: BigInt(123), undefined, function: () => "PRIVATE_CANARY" };
  const result = fingerprintPropertySnapshot(values[kind], json(f.meta), now);
  expect(result).toMatchObject({ status: "held", reason: "INVALID_PROPERTY_SOURCE" });
  expect(JSON.stringify(result)).not.toContain("PRIVATE_CANARY");
});

it.each(["root-proxy", "nested-proxy", "metadata-proxy", "revoked-proxy", "getter", "toJSON"])("%sのtrap/getterを一切実行しない", kind => {
  const f = fixture(); let reads = 0;
  const trap = { get() { reads++; return undefined; }, ownKeys() { reads++; return []; } };
  let record: unknown = json(f.record), meta: unknown = json(f.meta);
  if (kind === "root-proxy") record = new Proxy(f.record, trap);
  if (kind === "nested-proxy") record = { ...f.record, internal: new Proxy(f.record.internal, trap) };
  if (kind === "metadata-proxy") meta = new Proxy(f.meta, trap);
  if (kind === "revoked-proxy") { const p = Proxy.revocable(f.record, trap); p.revoke(); record = p.proxy; }
  if (kind === "getter") { record = { ...f.record }; Object.defineProperty(record, "internal", { enumerable: true, get() { reads++; return undefined; } }); }
  if (kind === "toJSON") record = { ...f.record, toJSON() { reads++; return {}; } };
  expect(fingerprintPropertySnapshot(record, meta, now).status).toBe("held");
  expect(reads).toBe(0);
});

it.each(["9007199254740992", "1e1000", "-0", "1.00000000000000001", "1e-400", "NaN", "Infinity"])("数値token %sの丸め・overflow・underflowを拒否", token => {
  const f = fixture(), source = json(f.record).replace('"priceYen":123', '"priceYen":' + token);
  expect(fingerprintPropertySnapshot(source, json(f.meta), now)).toMatchObject({ status: "held", reason: "INVALID_PROPERTY_SOURCE" });
});

it.each([["100", "1e2"], ["0.1", "0.1000"], ["1.25", "125e-2"]])("値が等しい数値表記%s/%sは同じhash", (a, b) => {
  const source = json(fixture().record);
  expect(hashText(source.replace('"priceYen":123', '"priceYen":' + a)))
    .toBe(hashText(source.replace('"priceYen":123', '"priceYen":' + b)));
});

it.each([
  '"extra":{"a":1,"a":2}',
  '"extra":{"a":1,"\\u0061":2}',
  '"extra":[{"same":1,"same":2}]',
  '"internal":{"hidden":"changed"}',
])("重複keyをJSON.parseの項目落ち前に拒否: %s", extra => {
  const f = fixture(), source = json(f.record).slice(0, -1) + "," + extra + "}";
  expect(fingerprintPropertySnapshot(source, json(f.meta), now)).toMatchObject({ status: "held" });
});

it("別objectの同名key、array内object、文字列内の構造記号を混同しない", () => {
  const f = fixture();
  const extra = { left: { same: 1 }, right: { same: 2 }, array: [{ same: 1 }, { same: 2 }],
    text: '{"a":[1,2]} , : ] [ \\"quote\\"' };
  expect(check({ ...f.record, extra }).status).toBe("fingerprinted");
});

it("metadataのescaped重複keyも拒否する", () => {
  const f = fixture(), metadata = json(f.meta).slice(0, -1) + ',"\\u0070ropertyId":"' + f.meta.propertyId + '"}';
  expect(fingerprintPropertySnapshot(json(f.record), metadata, now)).toMatchObject({ reason: "INVALID_SNAPSHOT_METADATA" });
});

it.each(["depth", "nodes", "bytes"])("上限%sを超えるsourceを全体JSON.parseの前に保留", kind => {
  const f = fixture(), base = json(f.record).slice(0, -1);
  const source = kind === "depth" ? base + ',"extra":' + "[".repeat(40) + "0" + "]".repeat(40) + "}"
    : kind === "nodes" ? base + ',"extra":[' + Array(100_001).fill("null").join(",") + "]}"
    : base + ',"extra":"' + "x".repeat(8_000_001) + '"}';
  const parse = vi.spyOn(JSON, "parse");
  try {
    const result = fingerprintPropertySnapshot(source, json(f.meta), now);
    expect(result.status).toBe("held");
    expect(parse.mock.calls.some(args => args[0] === source)).toBe(false);
    expect(JSON.stringify(result).length).toBeLessThan(200);
  } finally { parse.mockRestore(); }
});

it.each(["missing-id", "missing-time", "different-id", "future-update", "future-read", "invalid-now"])("不正なsource identity/time %sを拒否", change => {
  const f = fixture(), record: Record<string, unknown> = { ...f.record };
  if (change === "missing-id") delete record.id;
  if (change === "missing-time") delete record.updatedAt;
  if (change === "different-id") record.id = "00000000-0000-4000-8000-000000000003";
  if (change === "future-update") record.updatedAt = "2026-10-25T00:00:00.000Z";
  if (change === "future-read") f.meta.capturedAt = "2026-10-25T00:00:00.000Z";
  expect(check(record, f.meta, change === "invalid-now" ? "invalid" : now).status).toBe("held");
});

it.each(["internal", "priceNote", "translations", "createdAt"])("%sを落としたrecordをfull sourceへ昇格させない", key => {
  const f = fixture(), incomplete: Record<string, unknown> = { ...f.record };
  delete incomplete[key];
  expect(check(incomplete, f.meta)).toMatchObject({ reason: "SOURCE_FIELDS_MISSING" });
});

it("id/timeだけ、未知の市場、raw metadata object、文法破損を拒否", () => {
  const f = fixture();
  expect(check({ id: f.record.id, updatedAt: f.record.updatedAt }, f.meta)).toMatchObject({ reason: "SOURCE_FIELDS_MISSING" });
  expect(check(f.record, { ...f.meta, market: "unknown" })).toMatchObject({ reason: "INVALID_SNAPSHOT_METADATA" });
  expect(fingerprintPropertySnapshot(json(f.record), f.meta, now)).toMatchObject({ reason: "INVALID_SNAPSHOT_METADATA" });
  for (const bad of ['{"x":', '{"x":"unterminated\\', '{"x":[}', '{"x":undefined}']) {
    expect(fingerprintPropertySnapshot(bad, json(f.meta), now).status).toBe("held");
  }
});
