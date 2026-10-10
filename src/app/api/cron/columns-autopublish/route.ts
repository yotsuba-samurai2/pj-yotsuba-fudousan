import { NextRequest, NextResponse } from "next/server";
import { isAuthorizedBearer } from "@/lib/cron-auth";
import { publishPendingColumns } from "@/lib/columns-autopublish";

/**
 * 正午の自動公開（.github/workflows/columns-autopublish.yml が毎日 12:00 JST に呼ぶ）。
 *
 * 認証：`Authorization: Bearer <COLUMNS_AUTOPUBLISH_SECRET>`（Vercel の環境変数と GitHub の Secrets に同じ値）
 * - `?dryRun=1`：対象を返すだけで、DBは変えない
 * - `?force=1`：上限（AUTOPUBLISH_MAX_PER_RUN）を超えても公開する
 *
 * 応答：200＝成功（対象0本を含む）／409＝上限超えまたは品質確認待ち／500＝一部または全部が失敗。
 * 同じ記事を二重に公開することはない（公開済みの記事は次の呼び出しで対象から外れる）ので、
 * 失敗したときは、そのまま呼び直してよい。
 */
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  if (!isAuthorizedBearer(req.headers.get("authorization"), process.env.COLUMNS_AUTOPUBLISH_SECRET)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const params = req.nextUrl.searchParams;
  try {
    const result = await publishPendingColumns({
      dryRun: params.get("dryRun") === "1",
      force: params.get("force") === "1",
    });
    const status = result.blocked ? 409 : result.ok ? 200 : 500;
    return NextResponse.json(result, { status });
  } catch (err) {
    console.error("Columns autopublish failed:", err);
    return NextResponse.json({ error: "自動公開に失敗しました" }, { status: 500 });
  }
}
