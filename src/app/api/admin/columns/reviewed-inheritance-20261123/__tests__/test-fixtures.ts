import type { AdminColumn, ColumnTranslation } from "@/lib/column-shared";

const faq = [{ question: "旧Q", answer: "旧A" }];
const translation = (content: string): ColumnTranslation => ({
  title: "Same title", excerpt: "Same excerpt", content, faq,
  category: "CMS translation category", tags: ["keep"], keywords: ["keep"],
  author: { name: "Test author", title: "Test credit" },
});
export function fakeOriginal(business: "legal" | "realestate", slug: string): AdminColumn {
  const admin: AdminColumn = {
    id: "test:" + slug, business, slug, date: "2026-07-07", status: "published",
    locales: business === "legal" ? ["ja", "en", "zh-tw", "zh"] : ["zh-tw"],
    ...translation("Old " + slug), category: "Live CMS category",
    updatedAt: "2026-11-23T00:00:00.000Z", createdAt: "2026-07-07T00:00:00.000Z",
    modifiedDate: "2026-10-07", ogImage: "https://example.test/image.png",
  };
  admin.translations = business === "legal"
    ? { en: translation("Old English"), "zh-tw": translation("Old Taiwan"), zh: translation("Old mainland") }
    : { "zh-tw": translation(admin.content) };
  return admin;
}

export function fakeRevised(original: AdminColumn): AdminColumn {
  const result = structuredClone(original);
  result.content = "New " + original.slug;
  if (result.business === "realestate") result.faq = [{ question: "新Q", answer: "新A" }];
  for (const lang of ["en", "zh-tw", "zh"] as const) {
    const before = result.translations?.[lang];
    if (!before) continue;
    before.content = result.business === "realestate" ? result.content : "New " + lang;
    if (result.business === "realestate") before.faq = result.faq;
  }
  return result;
}
