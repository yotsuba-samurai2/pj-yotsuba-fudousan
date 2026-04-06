import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { verifyAdminRequest, AuthError } from "@/lib/api-auth";
import { rateLimit } from "@/lib/rate-limit";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

type CachedModels = {
  data: { id: string; display_name: string }[];
  fetchedAt: number;
};

let cache: CachedModels | null = null;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1時間

export async function GET(req: NextRequest) {
  try {
    const { success: withinLimit } = rateLimit(req);
    if (!withinLimit) {
      return NextResponse.json(
        { error: "リクエスト数が上限を超えました" },
        { status: 429 },
      );
    }

    await verifyAdminRequest(req);

    if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
      return NextResponse.json({ models: cache.data });
    }

    const list = await anthropic.models.list({ limit: 100 });
    const models = list.data
      .filter((m) => m.id.includes("claude"))
      .map((m) => ({
        id: m.id,
        display_name: m.display_name ?? m.id,
      }));

    cache = { data: models, fetchedAt: Date.now() };

    return NextResponse.json({ models });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("AI models list error:", err);
    return NextResponse.json(
      { error: "モデル一覧の取得に失敗しました" },
      { status: 500 },
    );
  }
}
