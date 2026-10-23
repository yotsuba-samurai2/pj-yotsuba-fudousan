// 安全性調査 2026-10-22：/api/linka と /api/linka/draft は認証なしで Anthropic API を呼ぶため、
// 同一IPからの連打は 429 で止める（画面操作の範囲＝1分10回は通す）。
import { beforeEach, describe, expect, it } from "vitest";
import { POST as linkaPost } from "@/app/api/linka/route";
import { POST as draftPost } from "@/app/api/linka/draft/route";

const call = (handler: (req: Request) => Promise<Response>, url: string, ip: string, body: unknown) =>
  handler(
    new Request(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": `${ip}, 10.0.0.1` },
      body: JSON.stringify(body),
    }),
  );

beforeEach(() => {
  delete process.env.ANTHROPIC_API_KEY; // デモ経路（AIを呼ばない）
});

describe("AI相談APIのレート制限", () => {
  it("/api/linka：同一IPは1分10回まで通り、11回目は 429", async () => {
    const body = { site: "realestate", mode: "concierge", message: "補助金について相談したい", locale: "ja" };
    for (let i = 0; i < 10; i++) {
      expect((await call(linkaPost, "http://localhost/api/linka", "203.0.113.10", body)).status).toBe(200);
    }
    const res = await call(linkaPost, "http://localhost/api/linka", "203.0.113.10", body);
    expect(res.status).toBe(429);
    expect(await res.json()).toEqual({ error: "too-many-requests" });
  });

  it("/api/linka：別のIPは影響を受けない", async () => {
    const body = { site: "realestate", mode: "concierge", message: "補助金について相談したい", locale: "ja" };
    expect((await call(linkaPost, "http://localhost/api/linka", "203.0.113.11", body)).status).toBe(200);
  });

  it("/api/linka/draft：同一IPの11回目は 429（不正な本文でも回数は数える）", async () => {
    for (let i = 0; i < 10; i++) {
      expect((await call(draftPost, "http://localhost/api/linka/draft", "203.0.113.20", {})).status).toBe(400);
    }
    expect((await call(draftPost, "http://localhost/api/linka/draft", "203.0.113.20", {})).status).toBe(429);
  });
});
