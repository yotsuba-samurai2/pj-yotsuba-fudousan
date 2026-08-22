// このファイルは自動生成（npx tsx scripts/seed-realestate-columns-daily.ts --emit-ts）。直接編集しない。
// 原稿の正本＝scripts/realestate-columns/NN-<slug>.md（ja）＋{en,zh,zh-tw}/NN-<slug>.md（翻訳）。
// 修正はmd側→再生成で行う。用途＝/admin/columns/seed-realestate-daily からの管理者セッション経由upsert。
// 追記型。記事が増えてもこのファイルと管理画面ページは増やさない（枝番スクリプトを新設しないこと）。

export type RealestateSeedColumnDaily = {
  business: "realestate";
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  status: "published";
  author: { name: string; title: string };
  keywords: string[];
  tags: string[];
  locales: ("ja" | "en" | "zh-tw" | "zh")[];
  faq: { question: string; answer: string }[];
  translations?: {
    en?: { title: string; excerpt: string; content: string; category?: string };
    "zh-tw"?: { title: string; excerpt: string; content: string; category?: string };
    zh?: { title: string; excerpt: string; content: string; category?: string };
  };
};

export const REALESTATE_COLUMNS_DAILY_SEED: RealestateSeedColumnDaily[] = [];
