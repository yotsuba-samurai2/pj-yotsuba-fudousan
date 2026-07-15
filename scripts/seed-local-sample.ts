/**
 * ローカル検証用サンプルデータ投入（架空データのみ・実在の人名/案件は含めない）。
 * 本番投入禁止。P1のローカル検証（ビルド・スモークテスト）専用。
 *
 * 使い方: DATABASE_URL/DIRECT_URL を設定して npx tsx scripts/seed-local-sample.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const columns = [
  {
    business: "realestate",
    slug: "sample-mansion-kanri-guide",
    title: "サンプル記事：マンション管理の基礎ガイド",
    date: "2026-07-01",
    category: "サンプル",
    excerpt: "ローカル検証用の架空記事です。マンション管理の一般的な流れを紹介します。",
    content:
      "これはローカル検証用の架空コンテンツです。\n\n## 管理の基本\n\n本文サンプル。実在の物件・人物とは関係ありません。",
    status: "published",
    author: { name: "検証 太郎", title: "サンプル執筆者" },
    keywords: ["サンプル", "検証"],
    tags: ["テスト"],
    locales: [] as string[], // 空配列＝全言語公開
    translations: {
      "zh-tw": {
        title: "範例文章：公寓管理基礎指南",
        excerpt: "這是本地驗證用的虛構文章。",
        content: "這是本地驗證用的虛構內容。\n\n## 管理基礎\n\n內文範例。",
        category: "範例",
      },
    },
  },
  {
    business: "realestate",
    slug: "sample-ja-only-oshirase",
    title: "サンプル記事：日本語限定のお知らせ",
    date: "2026-07-02",
    category: "サンプル",
    excerpt: "locales=[ja] の出し分け検証用の架空記事です。",
    content: "この記事は日本語ロケール限定で表示されるはずです（zh-tw一覧に出ないこと）。",
    status: "published",
    keywords: [],
    tags: [],
    locales: ["ja"], // ja限定＝zh-twの一覧・詳細に出ないこと
    translations: undefined,
  },
  {
    business: "legal",
    slug: "sample-kensetsu-kyoka-flow",
    title: "サンプル記事：許認可申請の一般的な流れ",
    date: "2026-07-03",
    category: "サンプル",
    excerpt: "ローカル検証用の架空記事（行政書士サイト）です。",
    content: "これはローカル検証用の架空コンテンツです。特定の案件・法的判断を含みません。",
    status: "published",
    keywords: [],
    tags: [],
    locales: ["ja", "en"],
    translations: {
      en: {
        title: "Sample: General Flow of License Applications",
        excerpt: "A fictional article for local verification.",
        content: "This is fictional content for local verification only.",
      },
    },
  },
  {
    business: "labor",
    slug: "sample-roumu-checklist",
    title: "サンプル記事：労務手続きチェックリスト",
    date: "2026-07-04",
    category: "サンプル",
    excerpt: "ローカル検証用の架空記事（社労士サイト）です。",
    content: "これはローカル検証用の架空コンテンツです。",
    status: "published",
    keywords: [],
    tags: [],
    locales: [] as string[],
    translations: undefined,
  },
  {
    business: "realestate",
    slug: "sample-draft-shitagaki",
    title: "サンプル記事：下書き（公開されないこと）",
    date: "2026-07-05",
    category: "サンプル",
    excerpt: "draft状態の検証用。公開ページに出ないこと。",
    content: "draftの本文。",
    status: "draft",
    keywords: [],
    tags: [],
    locales: [] as string[],
    translations: undefined,
  },
] as const;

async function main() {
  for (const c of columns) {
    const { business, slug, translations, author, ...rest } = c as (typeof columns)[number] & {
      author?: { name: string; title: string };
    };
    await prisma.column.upsert({
      where: { business_slug: { business, slug } },
      create: {
        business,
        slug,
        ...rest,
        author: author ?? undefined,
        translations: translations ?? undefined,
      },
      update: {
        ...rest,
        author: author ?? undefined,
        translations: translations ?? undefined,
      },
    });
    console.log(`upsert: ${business}/${slug}`);
  }

  await prisma.translation.upsert({
    where: { locale: "zh-tw" },
    create: {
      locale: "zh-tw",
      data: { common: { sampleGreeting: "本地驗證用範例翻譯" } },
    },
    update: { data: { common: { sampleGreeting: "本地驗證用範例翻譯" } } },
  });
  console.log("upsert: translations/zh-tw");

  await prisma.aiSetting.upsert({
    where: { id: "ai" },
    create: { id: "ai", model: "claude-haiku-4-5-20251001", updatedBy: "local-seed" },
    update: { model: "claude-haiku-4-5-20251001", updatedBy: "local-seed" },
  });
  console.log("upsert: ai_settings/ai");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
