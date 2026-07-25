import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminRequest, AuthError } from "@/lib/api-auth";
import { submitToIndexNow } from "@/lib/indexnow";

export async function POST(req: NextRequest) {
  try {
    await verifyAdminRequest(req);
    const { paths } = (await req.json()) as { paths: string[] };
    if (!Array.isArray(paths)) {
      return NextResponse.json({ error: "paths must be an array" }, { status: 400 });
    }
    for (const p of paths) {
      revalidatePath(p);
    }
    // 再生成したページを IndexNow（Bing/Yandex系）へ即時通知する。
    // submitToIndexNow は例外を投げない設計＝IndexNow の失敗で revalidate の成功を壊さない。
    const indexnow = await submitToIndexNow(paths);
    return NextResponse.json({ revalidated: paths, indexnow });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Revalidate error:", err);
    return NextResponse.json({ error: "失敗しました" }, { status: 500 });
  }
}
