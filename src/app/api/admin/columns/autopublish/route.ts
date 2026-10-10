import { NextRequest, NextResponse } from "next/server";
import { AuthError, verifyAdminRequest } from "@/lib/api-auth";
import {
  getAutopublishOverview,
  holdColumnsByKey,
  publishColumnsByKey,
} from "@/lib/columns-autopublish";

/**
 * 管理画面 /admin/columns/autopublish 用（ログインで認証）。
 * - GET：公開待ち・保留中・日付待ちの一覧
 * - POST { action: "hold", keys }：保留（下書きとしてDBに入れる。正午に公開されなくなる）
 * - POST { action: "publish", keys }：今すぐ公開（公開待ち・保留中のどちらでも）
 * - POST { action: "publishAllPending" }：公開待ちを今すぐ全部公開（保留中は除く）
 *
 * keys は `${business}:${slug}`。処理した結果は成否にかかわらず 200 で返し、
 * 記事ごとの失敗は `errors` に入れる（画面に理由を出すため）。
 */
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_KEYS = 100;

function handleError(err: unknown) {
  if (err instanceof AuthError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  console.error("Admin autopublish API error:", err);
  return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
}

export async function GET(req: NextRequest) {
  try {
    await verifyAdminRequest(req);
    return NextResponse.json(await getAutopublishOverview());
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await verifyAdminRequest(req);
    const body = (await req.json().catch(() => ({}))) as { action?: unknown; keys?: unknown };
    const keys = Array.isArray(body.keys)
      ? body.keys.filter((key): key is string => typeof key === "string" && key.includes(":"))
      : [];
    if (keys.length > MAX_KEYS) {
      return NextResponse.json({ error: `一度に指定できるのは${MAX_KEYS}本までです` }, { status: 400 });
    }
    switch (body.action) {
      case "hold":
      case "publish":
        if (keys.length === 0) {
          return NextResponse.json({ error: "keys（business:slug の配列）が必要です" }, { status: 400 });
        }
        return NextResponse.json(
          body.action === "hold" ? await holdColumnsByKey(keys) : await publishColumnsByKey(keys),
        );
      case "publishAllPending": {
        // Authenticated explicit publication is separate from cron/force's quality gate.
        // Drafts, already-published articles and scheduled articles are excluded.
        const overview = await getAutopublishOverview();
        return NextResponse.json(await publishColumnsByKey(overview.pending.map((item) => item.key)));
      }
      default:
        return NextResponse.json(
          { error: "action は hold / publish / publishAllPending のいずれかです" },
          { status: 400 },
        );
    }
  } catch (err) {
    return handleError(err);
  }
}
