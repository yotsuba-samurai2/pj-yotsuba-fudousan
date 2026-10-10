import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

/**
 * 正午の自動公開（2026-10-08〜）。
 * - DBに無い記事だけを公開し、DBにある記事（公開・下書き＝保留・削除）には触れない
 * - 保留＝下書きとしてDBに入れる。保留中の記事を公開するときは本文を seed で上書きしない
 * - 上限を超える本数は止める（DBの取り違えで大量公開しない）
 * - cron の入口は合言葉で守る（未設定・短い合言葉は常に拒否）
 */

const mocks = vi.hoisted(() => ({
  findMany: vi.fn(),
  upsert: vi.fn(),
  update: vi.fn(),
  refresh: vi.fn(),
  auth: vi.fn(),
  seeds: {
    realestate: [] as unknown[],
    legal: [] as unknown[],
    labor: [] as unknown[],
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma: { column: { findMany: mocks.findMany } } }));
vi.mock("@/lib/db/columns", () => ({ upsertColumnBySlug: mocks.upsert, updateColumn: mocks.update }));
vi.mock("@/lib/column-publication-cache", () => ({ refreshColumnPublication: mocks.refresh }));
vi.mock("@/lib/api-auth", () => ({
  verifyAdminRequest: mocks.auth,
  AuthError: class extends Error {
    constructor(message: string, public status: number) {
      super(message);
    }
  },
}));
vi.mock("@/lib/data/realestate-columns-daily-seed", () => ({
  get REALESTATE_COLUMNS_DAILY_SEED() {
    return mocks.seeds.realestate;
  },
}));
vi.mock("@/lib/data/souzoku-legal-columns-seed", () => ({
  get SOUZOKU_LEGAL_COLUMNS_SEED() {
    return mocks.seeds.legal;
  },
}));
vi.mock("@/lib/data/labor-columns-seed", () => ({
  get LABOR_COLUMNS_SEED() {
    return mocks.seeds.labor;
  },
}));

import {
  AUTOPUBLISH_MAX_PER_RUN,
  classifyAutopublish,
  todayInJst,
} from "@/lib/columns-autopublish-shared";
import { CRON_SECRET_MIN_LENGTH, isAuthorizedBearer } from "@/lib/cron-auth";
import {
  holdColumnsByKey,
  publishColumnsByKey,
  publishPendingColumns,
} from "@/lib/columns-autopublish";
import { POST as cronPost } from "@/app/api/cron/columns-autopublish/route";
import { POST as adminPost } from "@/app/api/admin/columns/autopublish/route";
import { AuthError } from "@/lib/api-auth";

const NOW = new Date("2026-10-08T03:00:00Z"); // 12:00 JST
const SECRET = "x".repeat(CRON_SECRET_MIN_LENGTH);

function article(business: string, slug: string, date: string) {
  return {
    business,
    slug,
    title: `title-${slug}`,
    date,
    category: "cat",
    excerpt: "ex",
    content: "body",
    status: "published",
  };
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
  mocks.seeds.realestate = [article("realestate", "r-new", "2026-10-07")];
  mocks.seeds.legal = [article("legal", "l-old", "2026-10-06"), article("legal", "l-held", "2026-10-07")];
  mocks.seeds.labor = [article("labor", "b-pub", "2026-10-01"), article("labor", "b-future", "2026-10-09")];
  mocks.findMany.mockResolvedValue([
    { id: "id-held", business: "legal", slug: "l-held", status: "draft" },
    { id: "id-pub", business: "labor", slug: "b-pub", status: "published" },
  ]);
  mocks.upsert.mockImplementation(async (_b: string, slug: string) => ({ id: `id-${slug}`, action: "created" }));
  mocks.update.mockResolvedValue(undefined);
  mocks.refresh.mockResolvedValue(undefined);
});
afterEach(() => vi.restoreAllMocks());

describe("classifyAutopublish", () => {
  it("DBの状態で振り分け、日付の古い順に並べ、重複は最初の1件だけを使う", () => {
    const a = [
      article("realestate", "x", "2026-10-07"),
      article("legal", "y", "2026-10-05"),
      article("legal", "y", "2026-10-05"),
      article("labor", "z", "2026-10-09"),
      article("labor", "d", "2026-10-01"),
    ] as never[];
    const rows = [{ id: "1", business: "labor", slug: "d", status: "deleted" }] as never[];
    const c = classifyAutopublish(a, rows, "2026-10-08");
    expect(c.pending.map((x: { slug: string }) => x.slug)).toEqual(["y", "x"]);
    expect(c.scheduled.map((x: { slug: string }) => x.slug)).toEqual(["z"]);
    expect(c.deleted.map((x: { slug: string }) => x.slug)).toEqual(["d"]);
    expect(c.held).toEqual([]);
  });

  it("JSTの日付で今日を決める", () => {
    expect(todayInJst(new Date("2026-10-07T14:59:00Z"))).toBe("2026-10-07");
    expect(todayInJst(new Date("2026-10-07T15:00:00Z"))).toBe("2026-10-08");
  });
});

describe("isAuthorizedBearer", () => {
  it("合言葉が未設定・短いときは、正しいヘッダでも拒否する", () => {
    expect(isAuthorizedBearer("Bearer ", undefined)).toBe(false);
    expect(isAuthorizedBearer("Bearer short", "short")).toBe(false);
  });
  it("一致したときだけ通す", () => {
    expect(isAuthorizedBearer(`Bearer ${SECRET}`, SECRET)).toBe(true);
    expect(isAuthorizedBearer(`Bearer ${SECRET}y`, SECRET)).toBe(false);
    expect(isAuthorizedBearer(SECRET, SECRET)).toBe(false);
    expect(isAuthorizedBearer(null, SECRET)).toBe(false);
  });
});

describe("publishPendingColumns", () => {
  it("DBに無い記事だけを古い順に公開し、保留中・公開済み・日付待ちには触れない", async () => {
    const r = await publishPendingColumns({ now: NOW });
    expect(r.ok).toBe(true);
    expect(mocks.upsert.mock.calls.map((c) => [c[0], c[1], c[2].status])).toEqual([
      ["legal", "l-old", "published"],
      ["realestate", "r-new", "published"],
    ]);
    expect(mocks.update).not.toHaveBeenCalled();
    expect(r.published.map((x) => x.path)).toEqual(["/legal/column/l-old", "/column/r-new"]);
    expect(r.held.map((x) => x.key)).toEqual(["legal:l-held"]);
    expect(r.scheduled.map((x) => x.key)).toEqual(["labor:b-future"]);
    expect(mocks.refresh).toHaveBeenCalledTimes(1);
    expect(mocks.refresh.mock.calls[0][0].map((x: { slug: string }) => x.slug)).toEqual(["l-old", "r-new"]);
  });

  it("dryRun ではDBを変えずに対象だけを返す", async () => {
    const r = await publishPendingColumns({ now: NOW, dryRun: true });
    expect(r.targets.map((x) => x.key)).toEqual(["legal:l-old", "realestate:r-new"]);
    expect(r.published).toEqual([]);
    expect(mocks.upsert).not.toHaveBeenCalled();
    expect(mocks.refresh).not.toHaveBeenCalled();
  });

  it("上限を超えたら止める。force なら公開する", async () => {
    mocks.seeds.realestate = Array.from({ length: AUTOPUBLISH_MAX_PER_RUN + 1 }, (_, i) =>
      article("realestate", `r${i}`, "2026-10-07"),
    );
    const blocked = await publishPendingColumns({ now: NOW });
    expect(blocked.ok).toBe(false);
    expect(blocked.blocked).toContain("上限");
    expect(mocks.upsert).not.toHaveBeenCalled();
    const forced = await publishPendingColumns({ now: NOW, force: true });
    expect(forced.published).toHaveLength(AUTOPUBLISH_MAX_PER_RUN + 2);
  });

  it("1本の失敗で残りを止めず、失敗は errors に出す", async () => {
    mocks.upsert.mockImplementation(async (_b: string, slug: string) => {
      if (slug === "l-old") throw new Error("db down");
      return { id: `id-${slug}`, action: "created" };
    });
    const r = await publishPendingColumns({ now: NOW });
    expect(r.ok).toBe(false);
    expect(r.errors).toEqual([{ key: "legal:l-old", message: "db down" }]);
    expect(r.published.map((x) => x.key)).toEqual(["realestate:r-new"]);
  });

  it("部分失敗を再実行すると成功済みを重複公開せず、未完了だけを処理する", async () => {
    const rows = await mocks.findMany();
    mocks.findMany.mockImplementation(async () => [...rows]);
    let failOnce = true;
    mocks.upsert.mockImplementation(async (business: string, slug: string) => {
      if (slug === "l-old" && failOnce) {
        failOnce = false;
        throw new Error("temporary failure");
      }
      rows.push({ id: `id-${slug}`, business, slug, status: "published" });
      return { id: `id-${slug}`, action: "created" };
    });
    expect((await publishPendingColumns({ now: NOW })).ok).toBe(false);
    const retry = await publishPendingColumns({ now: NOW });
    expect(retry.ok).toBe(true);
    expect(retry.published.map((x) => x.key)).toEqual(["legal:l-old"]);
    expect(mocks.upsert.mock.calls.filter((call) => call[1] === "r-new")).toHaveLength(1);
    expect(mocks.update).not.toHaveBeenCalled();
  });

  it("公開ページの更新に失敗したら refreshError を返す（DBの更新は済んでいる）", async () => {
    mocks.refresh.mockRejectedValue(new Error("revalidate failed"));
    const r = await publishPendingColumns({ now: NOW });
    expect(r.ok).toBe(false);
    expect(r.refreshError).toBe("revalidate failed");
    expect(r.published).toHaveLength(2);
  });
});

describe("保留と今すぐ公開", () => {
  it("保留は下書きとしてDBに入れ、公開ページの更新はしない", async () => {
    const r = await holdColumnsByKey(["realestate:r-new", "legal:l-held", "labor:b-pub"], NOW);
    expect(mocks.upsert).toHaveBeenCalledTimes(1);
    expect(mocks.upsert.mock.calls[0][2].status).toBe("draft");
    expect(r.held.map((x) => x.key)).toEqual(["realestate:r-new"]);
    expect(r.errors.map((e) => e.key)).toEqual(["labor:b-pub"]);
    expect(mocks.refresh).not.toHaveBeenCalled();
  });

  it("保留中の記事を公開するときは status だけを変え、本文を seed で上書きしない", async () => {
    const r = await publishColumnsByKey(["legal:l-held"], NOW);
    expect(r.ok).toBe(true);
    expect(mocks.update).toHaveBeenCalledWith("id-held", { status: "published" });
    expect(mocks.upsert).not.toHaveBeenCalled();
    expect(mocks.refresh).toHaveBeenCalledTimes(1);
  });

  it("公開済みの記事を指定したら理由つきで返す", async () => {
    const r = await publishColumnsByKey(["labor:b-pub"], NOW);
    expect(r.ok).toBe(false);
    expect(r.errors[0].key).toBe("labor:b-pub");
    expect(mocks.update).not.toHaveBeenCalled();
  });
});

describe("API", () => {
  const cronRequest = (auth?: string, query = "") =>
    new NextRequest(`https://luck428.com/api/cron/columns-autopublish${query}`, {
      method: "POST",
      headers: auth ? { authorization: auth } : {},
    });

  it("cron：合言葉が無い・違うときは 401 で、何もしない", async () => {
    vi.stubEnv("COLUMNS_AUTOPUBLISH_SECRET", SECRET);
    expect((await cronPost(cronRequest())).status).toBe(401);
    expect((await cronPost(cronRequest("Bearer wrong-secret-wrong-secret-wrong-secret"))).status).toBe(401);
    expect(mocks.findMany).not.toHaveBeenCalled();
    vi.unstubAllEnvs();
  });

  it("cron：合言葉が未設定なら、正しそうなヘッダでも 401", async () => {
    vi.stubEnv("COLUMNS_AUTOPUBLISH_SECRET", "");
    expect((await cronPost(cronRequest(`Bearer ${SECRET}`))).status).toBe(401);
    vi.unstubAllEnvs();
  });

  it("cron：dryRun を渡し、上限超えは 409 を返す", async () => {
    vi.stubEnv("COLUMNS_AUTOPUBLISH_SECRET", SECRET);
    const dry = await cronPost(cronRequest(`Bearer ${SECRET}`, "?dryRun=1"));
    expect(dry.status).toBe(200);
    expect(mocks.upsert).not.toHaveBeenCalled();
    mocks.seeds.realestate = Array.from({ length: AUTOPUBLISH_MAX_PER_RUN + 1 }, (_, i) =>
      article("realestate", `r${i}`, "2020-01-01"),
    );
    const blocked = await cronPost(cronRequest(`Bearer ${SECRET}`));
    expect(blocked.status).toBe(409);
    vi.unstubAllEnvs();
  });

  const adminRequest = (body: unknown) =>
    new NextRequest("https://luck428.com/api/admin/columns/autopublish", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });

  it("管理API：未ログインは認証エラーをそのまま返す", async () => {
    mocks.auth.mockRejectedValue(new AuthError("認証トークンがありません", 401));
    expect((await adminPost(adminRequest({ action: "hold", keys: ["realestate:r-new"] }))).status).toBe(401);
    expect(mocks.upsert).not.toHaveBeenCalled();
  });

  it("管理API：不明な action と keys 無しは 400", async () => {
    mocks.auth.mockResolvedValue({ uid: "u" });
    expect((await adminPost(adminRequest({ action: "delete", keys: ["a:b"] }))).status).toBe(400);
    expect((await adminPost(adminRequest({ action: "hold", keys: [] }))).status).toBe(400);
  });

  it("管理API：保留を受け付ける", async () => {
    mocks.auth.mockResolvedValue({ uid: "u" });
    const res = await adminPost(adminRequest({ action: "hold", keys: ["realestate:r-new"] }));
    expect(res.status).toBe(200);
    expect((await res.json()).held[0].key).toBe("realestate:r-new");
  });
});
