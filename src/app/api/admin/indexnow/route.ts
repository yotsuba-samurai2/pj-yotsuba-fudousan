import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, AuthError } from "@/lib/api-auth";
import { fetchSitemapUrls, submitToIndexNow, SITEMAP_URL } from "@/lib/indexnow";

/**
 * IndexNow 手動送信API。
 * - `{ urls: [...] }` 指定＝そのURLのみ通知（新着だけ通知）
 * - body なし／urls 未指定＝sitemap.xml の全URLを通知（既存ページの一括通知）
 * 送信対象の絞り込み（luck428.com 配下のみ・重複除去・本番のみ送信）は submitToIndexNow が担う。
 */
export async function POST(req: NextRequest) {
  try {
    await verifyAdminRequest(req);

    // body 省略（Content-Length: 0）でも一括送信できるようにする
    const body = (await req.json().catch(() => ({}))) as { urls?: unknown };
    if (body.urls !== undefined && !Array.isArray(body.urls)) {
      return NextResponse.json({ error: "urls must be an array" }, { status: 400 });
    }

    let urls: string[];
    let source: "request" | "sitemap";
    if (Array.isArray(body.urls)) {
      urls = body.urls.filter((u): u is string => typeof u === "string");
      source = "request";
    } else {
      try {
        urls = await fetchSitemapUrls();
      } catch (err) {
        console.error("IndexNow sitemap fetch error:", err);
        return NextResponse.json(
          { error: `sitemap の取得に失敗しました（${SITEMAP_URL}）` },
          { status: 502 },
        );
      }
      source = "sitemap";
    }

    const result = await submitToIndexNow(urls);
    return NextResponse.json({ source, requested: urls.length, ...result });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("IndexNow submit error:", err);
    return NextResponse.json({ error: "IndexNow への送信に失敗しました" }, { status: 500 });
  }
}
