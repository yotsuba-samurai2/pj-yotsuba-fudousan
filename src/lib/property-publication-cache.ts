import "server-only";
import { revalidatePath } from "next/cache";
import { flushRevalidation } from "@/lib/flush-revalidation";
import { SUPPORTED_LOCALES } from "@/lib/locale";

export class PropertyPublicationRefreshError extends Error {
  constructor() {
    super("物件データの保存は完了しましたが、公開ページの更新要求に失敗しました。再保存せず、物件一覧を再読み込みして保存内容をご確認ください。");
  }
}

/** Successful API writes only. Requests next-visit regeneration, not proof of public propagation. */
export async function refreshPropertyPublication(slugs: readonly string[]): Promise<void> {
  try {
    if (!slugs.length || slugs.some(slug => !/^[a-z0-9-]+$/.test(slug))) throw new Error("INVALID_PROPERTY_REFRESH_TARGET");
    // Use internal locale destinations (including ja), not rewritten public URLs.
    const pages = ["/bukken", "/services", "/global/chinese", "/gakku", "/gakku/rentals", "/gakku/sales", "/bunkyo/chukai-033",
      "/gakku/seishi", "/gakku/showa", "/gakku/sendagi", "/gakku/kubomachi", ...new Set(slugs.filter(slug => slug.length <= 900).map(slug => `/bukken/${slug}`))];
    for (const locale of SUPPORTED_LOCALES) for (const page of pages) revalidatePath(`/${locale}${page}`);
    // The existing input schema has no slug length cap; preserve those records without passing >1024-character paths.
    if (slugs.some(slug => slug.length > 900)) revalidatePath("/[locale]/(realestate)/bukken/[slug]", "page");
    // Address and publication changes can affect both the old and new school's list.
    revalidatePath("/[locale]/(realestate)/gakku/[school]/rentals", "page");
    revalidatePath("/[locale]/(realestate)/gakku/[school]/sales", "page");
    // Also covers the article relation component kept separately in the original checkout.
    revalidatePath("/[locale]/(realestate)/column/[slug]", "page");
    revalidatePath("/sitemap.xml");
    await flushRevalidation();
  } catch {
    // Do not turn a completed DB write into an unknown save outcome or expose cache internals.
    throw new PropertyPublicationRefreshError();
  }
}
