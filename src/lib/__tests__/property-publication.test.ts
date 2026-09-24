import { describe, it, expect, vi } from "vitest";
import type { AdminProperty } from "@/lib/property-shared";
import {
  detectPublicationChange,
  recordPublicationChange,
  processPendingNotifications,
  MAX_NOTIFY_ATTEMPTS,
  type PublicationEvent,
  type PublicationEventStore,
} from "@/lib/property-publication";

const NOW = new Date("2026-09-20T03:00:00Z");

function property(over: Partial<AdminProperty> = {}): AdminProperty {
  return {
    id: "id", slug: "rent-test", status: "published", dealType: "rental", category: "other", tradeMode: "broker",
    title: "テスト荘 101", priceYen: 105_000, locationText: "東京都架空区",
    access: [], images: [],
    spec: {
      dealType: "rental", availabilityExpiresAt: "2026-09-21T03:00:00Z", buildingType: "マンション", layout: "1K",
      exclusiveAreaSqm: 20, structure: "鉄筋コンクリート造", floors: "5階建", floorLocated: "3階", builtYm: "2020-01",
      deliveryYm: "即入居可", accessText: "架空線 架空駅", managementFee: "5,000円", deposit: "1ヶ月", keyMoney: "なし",
      guaranteeDeposit: "なし", renewalFee: "なし", insurance: "加入必須", guarantor: "必須", otherFees: "なし",
      contractType: "普通借家契約", contractPeriod: "2年", conditions: "ペット不可",
    },
    description: "説明", publishedAt: "2026-09-20", infoUpdatedAt: "2026-09-20", nextUpdateAt: "2026-10-04",
    locales: ["ja"], createdAt: "2026-09-20T00:00:00.000Z", updatedAt: "2026-09-20T00:00:00.000Z",
    internal: { memo: "元付ヒミツ商事 AD100" },
    ...over,
  };
}

type FakeRow = Parameters<PublicationEventStore["insert"]>[0] & { id: string; attempts: number; notifyStatus: string; createdAt: Date };
function fakeStore(): PublicationEventStore & { rows: FakeRow[] } {
  const rows: FakeRow[] = [];
  return {
    rows,
    async insert(e) { rows.push({ ...e, id: `ev${rows.length}`, attempts: 0, notifyStatus: "pending", createdAt: new Date(rows.length) }); },
    async due(now, limit) { return rows.filter((r) => r.notifyStatus === "pending" && r.nextAttemptAt <= now).slice(0, limit) as PublicationEvent[]; },
    async mark(id, patch) { const r = rows.find((x) => x.id === id); if (!r) throw new Error(`fakeStore: unknown id ${id}`); Object.assign(r, patch); },
    async latestKind(slug) { const hits = rows.filter((r) => r.slug === slug); return hits.length ? hits[hits.length - 1].kind : null; },
  };
}

describe("detectPublicationChange（T09・T10）", () => {
  it("確認日時・情報更新日・次回更新予定日だけの変化は通知しない", () => {
    const before = property();
    const after = property({ infoUpdatedAt: "2026-09-21", nextUpdateAt: "2026-10-05" });
    expect(detectPublicationChange(before, after, NOW)).toBeNull();
  });
  it("公開値の変化（賃料）は changed。管理画面URLは含まない", () => {
    const change = detectPublicationChange(property(), property({ priceYen: 108_000 }), NOW)!;
    expect(change.kind).toBe("changed");
    expect(change.urls).toEqual(expect.arrayContaining(["/bukken/rent-test", "/bukken"]));
    expect(change.urls.some((u) => u.includes("admin"))).toBe(false);
  });
  it("新規公開は published、下書き同士は通知しない", () => {
    expect(detectPublicationChange(null, property(), NOW)!.kind).toBe("published");
    expect(detectPublicationChange(property({ status: "draft" }), property({ status: "draft", title: "変更" }), NOW)).toBeNull();
  });
  it("公開終了・削除は unpublished", () => {
    expect(detectPublicationChange(property(), property({ status: "closed" }), NOW)!.kind).toBe("unpublished");
    expect(detectPublicationChange(property(), undefined, NOW)!.kind).toBe("unpublished");
  });
  it("A→B→A は毎回別のイベント（同じ変更として握りつぶさない）", async () => {
    const store = fakeStore();
    const a = property({ priceYen: 100_000 }), b = property({ priceYen: 110_000 });
    await recordPublicationChange(store, null, a, NOW);
    await recordPublicationChange(store, a, b, NOW);
    await recordPublicationChange(store, b, a, NOW);
    expect(store.rows.map((r) => r.kind)).toEqual(["published", "changed", "changed"]);
    expect(new Set(store.rows.map((r) => r.contentHash)).size).toBe(2); // a→b→a: aのハッシュは2回出る
  });
  it("internal・元付情報はハッシュにもURLにも入らない（漏洩ゼロ）", () => {
    const change = detectPublicationChange(null, property(), NOW)!;
    expect(JSON.stringify(change)).not.toContain("元付");
    expect(JSON.stringify(change)).not.toContain("AD100");
  });
});

describe("processPendingNotifications（T11：429/5xx/タイムアウトは上限つきバックオフ）", () => {
  it("成功したイベントは sent。保存や公開停止はこの結果に依存しない", async () => {
    const store = fakeStore();
    await recordPublicationChange(store, null, property(), NOW);
    const out = await processPendingNotifications(store, async () => ({ ok: true, status: 200 }), NOW);
    expect(out).toEqual({ sent: 1, retry: 0, failed: 0, skipped: 0 });
    expect(store.rows[0].notifyStatus).toBe("sent");
  });
  it("非本番等の skipped は sent と区別する", async () => {
    const store = fakeStore();
    await recordPublicationChange(store, null, property(), NOW);
    const out = await processPendingNotifications(store, async () => ({ ok: true, submitted: 0, skipped: "non-production" }), NOW);
    expect(out.skipped).toBe(1);
    expect(store.rows[0].notifyStatus).toBe("skipped");
  });
  it("429/5xx は上限回数までバックオフ再試行し、その後 failed", async () => {
    const store = fakeStore();
    await recordPublicationChange(store, null, property(), NOW);
    let t = NOW;
    for (let i = 1; i < MAX_NOTIFY_ATTEMPTS; i++) {
      const out = await processPendingNotifications(store, async () => ({ ok: false, status: 503 }), t);
      expect(out.retry).toBe(1);
      expect(store.rows[0].attempts).toBe(i);
      t = new Date(store.rows[0].nextAttemptAt.getTime());
    }
    const last = await processPendingNotifications(store, async () => ({ ok: false, status: 503 }), t);
    expect(last.failed).toBe(1);
    expect(store.rows[0].notifyStatus).toBe("failed");
  });
  it("設定不備（400/403/422）は無限再試行せず即 failed", async () => {
    const store = fakeStore();
    await recordPublicationChange(store, null, property(), NOW);
    const out = await processPendingNotifications(store, async () => ({ ok: false, status: 400 }), NOW);
    expect(out.failed).toBe(1);
    expect(store.rows[0].attempts).toBe(1);
  });
  it("送信関数が例外を投げても呼び出し元は落ちない（次回再試行に回す）", async () => {
    const store = fakeStore();
    await recordPublicationChange(store, null, property(), NOW);
    const send = vi.fn().mockRejectedValue(new Error("network"));
    const out = await processPendingNotifications(store, send, NOW);
    expect(out.retry).toBe(1);
    expect(store.rows[0].notifyStatus).toBe("pending");
  });
});
