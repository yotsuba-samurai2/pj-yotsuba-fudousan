import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { verifyAdminRequest, AuthError } from "@/lib/api-auth";
import { submitToIndexNow } from "@/lib/indexnow";
import { SUPPORTED_LOCALES } from "@/lib/locale";
import { COLUMN_LOCALE_CACHE_TAG } from "@/lib/column-language-links";

export async function POST(req: NextRequest) {
  try {
    await verifyAdminRequest(req);
    const { paths } = (await req.json()) as { paths: string[] };
    if (!Array.isArray(paths)) {
      return NextResponse.json({ error: "paths must be an array" }, { status: 400 });
    }
    // 翻訳の公開・非公開をヘッダーにも反映する。旧データを再利用しない即時失効。
    if (paths.some(p => /(?:^|\/)column(?:\/|$)/.test(p))) {
      revalidateTag(COLUMN_LOCALE_CACHE_TAG, { expire: 0 });
    }
    for (const p of paths) {
      // 内部ルートは app/[locale]/... のため、外部パス（/column/x 等）を
      // 全ロケールの内部パス（/ja/column/x・/en/column/x…）に展開して再検証する
      // （翻訳は同一ページのロケール変種として同時に更新されるため全ロケール対象）
      for (const locale of SUPPORTED_LOCALES) {
        revalidatePath(`/${locale}${p === "/" ? "" : p}`);
      }
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
