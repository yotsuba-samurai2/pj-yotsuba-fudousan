import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, AuthError } from "@/lib/api-auth";
import { getAiModel, setAiModel } from "@/lib/db/aiSettings";

function handleError(err: unknown) {
  if (err instanceof AuthError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  console.error("Admin ai-settings API error:", err);
  return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
}

export async function GET(req: NextRequest) {
  try {
    await verifyAdminRequest(req);
    const model = await getAiModel();
    return NextResponse.json({ model });
  } catch (err) {
    return handleError(err);
  }
}

/** モデル保存（updatedBy は検証済みユーザーのuid） */
export async function PUT(req: NextRequest) {
  try {
    const user = await verifyAdminRequest(req);
    const body = (await req.json()) as { model?: string };
    if (!body.model || typeof body.model !== "string") {
      return NextResponse.json({ error: "modelは必須です" }, { status: 400 });
    }
    await setAiModel(body.model, user.uid);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleError(err);
  }
}
