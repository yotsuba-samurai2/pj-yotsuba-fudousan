import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { submitToIndexNow, INDEXNOW_HOST } from "@/lib/indexnow";

/**
 * IndexNow 送信ユーティリティの回帰テスト。
 * 守りたい不変条件は3つ：
 *   1) 本番以外では絶対に送信しない（プレビュー・ローカルからの誤通知防止）
 *   2) luck428.com 配下の絶対URLしか送らない（IndexNowは host 一致が必須）
 *   3) 何が起きても例外を投げない（呼び出し元のコラム公開処理を止めない）
 */

type FetchMock = ReturnType<typeof vi.fn>;

function mockFetch(impl?: (...args: unknown[]) => unknown): FetchMock {
  const fn = vi.fn(impl ?? (() => Promise.resolve(new Response(null, { status: 200 }))));
  vi.stubGlobal("fetch", fn);
  return fn;
}

/** 直近のfetch呼び出しのリクエストbodyをJSONとして取り出す */
function bodyOf(fn: FetchMock, callIndex = 0) {
  const init = fn.mock.calls[callIndex][1] as RequestInit;
  return JSON.parse(init.body as string) as {
    host: string;
    key: string;
    keyLocation: string;
    urlList: string[];
  };
}

// env は vi.stubEnv で明示設定する（実行シェルが NODE_ENV=production を export している環境でも
// 結果が変わらないようにする＝ambient env への依存を排除）
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("submitToIndexNow：送信条件（本番のみ）", () => {
  it("プレビュー環境では送信せず skipped を返す", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    const fetchMock = mockFetch();

    const result = await submitToIndexNow(["https://luck428.com/column/foo"]);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result).toEqual({ ok: true, submitted: 0, skipped: "non-production" });
  });

  it("VERCEL_ENV未設定かつ NODE_ENV!=production では送信しない", async () => {
    vi.stubEnv("VERCEL_ENV", undefined);
    vi.stubEnv("NODE_ENV", "development");
    const fetchMock = mockFetch();

    const result = await submitToIndexNow(["/column/foo"]);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.skipped).toBe("non-production");
  });

  it("VERCEL_ENV未設定＋NODE_ENV=production（Vercel外の本番）では送信する", async () => {
    vi.stubEnv("VERCEL_ENV", undefined);
    vi.stubEnv("NODE_ENV", "production");
    const fetchMock = mockFetch();

    const result = await submitToIndexNow(["/column/foo"]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.skipped).toBeUndefined();
    expect(result.ok).toBe(true);
  });

  it("送信対象が空なら本番判定に関係なく何もせず ok:true", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const fetchMock = mockFetch();

    const result = await submitToIndexNow([]);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result).toEqual({ ok: true, submitted: 0, skipped: "no-eligible-urls" });
  });
});

describe("submitToIndexNow：URL正規化と送信body", () => {
  beforeEach(() => {
    vi.stubEnv("VERCEL_ENV", "production");
  });

  it("外部ドメイン・非httpsを除外し、相対パスを絶対化し、重複を除去する", async () => {
    const fetchMock = mockFetch();

    const result = await submitToIndexNow([
      "/column/foo", // 相対パス → 絶対化
      "https://luck428.com/column/foo", // 上と同一 → 重複除去
      "https://luck428.com/column/bar#section", // フラグメントは除去
      "https://example.com/evil", // 別ドメイン → 除外
      "//example.com/evil", // プロトコル相対の別ドメイン → 除外
      "http://luck428.com/insecure", // https以外 → 除外
      "", // 空文字 → 除外
    ]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(bodyOf(fetchMock).urlList).toEqual([
      "https://luck428.com/column/foo",
      "https://luck428.com/column/bar",
    ]);
    expect(result).toEqual({ ok: true, status: 200, submitted: 2 });
  });

  it("host / key / keyLocation / urlList を仕様どおり送る（keyはenv優先）", async () => {
    vi.stubEnv("INDEXNOW_KEY", "testkey123");
    const fetchMock = mockFetch();

    await submitToIndexNow(["/column/foo"]);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.indexnow.org/indexnow");
    expect(init.method).toBe("POST");
    expect(bodyOf(fetchMock)).toEqual({
      host: INDEXNOW_HOST,
      key: "testkey123",
      keyLocation: "https://luck428.com/testkey123.txt",
      urlList: ["https://luck428.com/column/foo"],
    });
  });

  it("env未設定なら public/ に置いたデフォルトキーを使う", async () => {
    vi.stubEnv("INDEXNOW_KEY", undefined);
    const fetchMock = mockFetch();

    await submitToIndexNow(["/column/foo"]);

    const body = bodyOf(fetchMock);
    expect(body.key).toBe("c0df92f43cee44448c33623a32a68d6c");
    expect(body.keyLocation).toBe(`https://${INDEXNOW_HOST}/${body.key}.txt`);
  });

  it("10,000件を超えたら分割して送信する", async () => {
    const fetchMock = mockFetch();
    const urls = Array.from({ length: 10_001 }, (_, i) => `/column/p${i}`);

    const result = await submitToIndexNow(urls);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(bodyOf(fetchMock, 0).urlList).toHaveLength(10_000);
    expect(bodyOf(fetchMock, 1).urlList).toHaveLength(1);
    expect(result.submitted).toBe(10_001);
  });
});

describe("submitToIndexNow：失敗しても例外を投げない", () => {
  beforeEach(() => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  it("fetchがrejectしても ok:false を返す", async () => {
    mockFetch(() => Promise.reject(new Error("network down")));

    const result = await submitToIndexNow(["/column/foo"]);

    expect(result.ok).toBe(false);
    expect(result.submitted).toBe(0);
  });

  it("非200応答なら ok:false とHTTPステータスを返す", async () => {
    mockFetch(() => Promise.resolve(new Response("Invalid key", { status: 403 })));

    const result = await submitToIndexNow(["/column/foo"]);

    expect(result).toEqual({ ok: false, status: 403, submitted: 0 });
  });

  it("202（キー検証は非同期）は受理として扱う", async () => {
    mockFetch(() => Promise.resolve(new Response(null, { status: 202 })));

    const result = await submitToIndexNow(["/column/foo"]);

    expect(result).toEqual({ ok: true, status: 202, submitted: 1 });
  });
});
