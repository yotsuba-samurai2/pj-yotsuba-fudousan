import { revalidatePath, revalidateTag } from "next/cache";
import { after } from "next/server";
import type { AdminColumn } from "@/lib/column-shared";
import { COLUMN_LOCALE_CACHE_TAG } from "@/lib/column-language-links";
import { SUPPORTED_LOCALES, addLocalePrefix } from "@/lib/locale";
import { submitToIndexNow } from "@/lib/indexnow";

type ColumnLocation = Pick<AdminColumn, "business" | "slug">;

export class ColumnPublicationRefreshError extends Error {
  constructor() {
    super("記事データの保存・削除は完了しましたが、公開ページの更新に失敗しました。再保存せず、記事一覧を再読み込みして保存内容をご確認ください。");
  }
}

/** DB更新に成功した管理APIから呼ぶ。ブラウザの追加リクエストに依存しない。 */
export function refreshColumnPublication(locations: readonly ColumnLocation[]) {
  const paths = [...new Set(locations.map(({ business, slug }) =>
    `${business === "realestate" ? "" : `/${business}`}/column/${slug}`,
  ))];
  try {
    revalidateTag(COLUMN_LOCALE_CACHE_TAG, { expire: 0 });
    // 変更前・変更後の詳細URLを全言語で失効。公開取り下げや移動元の200を残さない。
    for (const path of paths) {
      for (const locale of SUPPORTED_LOCALES) revalidatePath(`/${locale}${path}`);
    }
    // 一覧の全ページ・新着欄も対象。ルートグループを含む実際のlayoutパスを指定。
    for (const business of new Set(locations.map(location => location.business))) {
      revalidatePath(`/[locale]/(${business})`, "layout");
    }
    // サイトマップはapp/[locale]外にある。
    revalidatePath("/sitemap.xml");
  } catch (error) {
    console.error("Column publication refresh failed after database mutation:", error);
    throw new ColumnPublicationRefreshError();
  }
  // 既存の検索エンジン通知を維持。外部サービスの応答を保存完了の条件にしない。
  try {
    after(async () => {
      try {
        await submitToIndexNow(paths.flatMap(path =>
          SUPPORTED_LOCALES.map(locale => addLocalePrefix(path, locale)),
        ));
      } catch (error) {
        console.error("Column search notification failed:", error);
      }
    });
  } catch (error) {
    console.error("Column search notification could not be scheduled:", error);
  }
}
