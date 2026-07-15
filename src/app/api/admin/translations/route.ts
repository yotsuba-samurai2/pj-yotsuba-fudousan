import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, AuthError } from "@/lib/api-auth";
import { getTranslations, saveTranslations } from "@/lib/db/translations";
import { isValidLocale } from "@/lib/locale";

function handleError(err: unknown) {
  if (err instanceof AuthError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  console.error("Admin translations API error:", err);
  return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
}

/** UI翻訳の取得（?locale=） */
export async function GET(req: NextRequest) {
  try {
    await verifyAdminRequest(req);
    const locale = req.nextUrl.searchParams.get("locale");
    if (!locale || !isValidLocale(locale)) {
      return NextResponse.json({ error: "不正なlocaleです" }, { status: 400 });
    }
    const data = await getTranslations(locale);
    return NextResponse.json({ data });
  } catch (err) {
    return handleError(err);
  }
}

/** UI翻訳の保存（ロケール全体を丸ごと上書き） */
export async function PUT(req: NextRequest) {
  try {
    await verifyAdminRequest(req);
    const body = (await req.json()) as {
      locale?: string;
      data?: Record<string, unknown>;
    };
    if (!body.locale || !isValidLocale(body.locale)) {
      return NextResponse.json({ error: "不正なlocaleです" }, { status: 400 });
    }
    if (!body.data || typeof body.data !== "object" || Array.isArray(body.data)) {
      return NextResponse.json({ error: "dataが不正です" }, { status: 400 });
    }
    await saveTranslations(body.locale, body.data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleError(err);
  }
}
