"use client";

import SeedColumnsRunner from "@/components/admin/SeedColumnsRunner";
import { REALESTATE_COLUMNS_DAILY_SEED } from "@/lib/data/realestate-columns-daily-seed";

/**
 * 不動産コラム（追記型）のupsert投入。
 *
 * business=realestate。原稿は scripts/realestate-columns/NN-<slug>.md、
 * 登録は scripts/seed-realestate-columns-daily.ts の ARTICLES への追記、
 * 生成物は src/lib/data/realestate-columns-daily-seed.ts。
 * slug基準の冪等upsert。再実行しても重複しない。
 *
 * このページは固定。記事が増えても新しい管理画面ページを作らない
 * （枝番方式＝seed-realestate-p2 …… p6 をここで止めている）。
 *
 * 画面と投入ロジックは SeedColumnsRunner に共通化した。既定の投入範囲は
 * 「最新日のみ」で、毎朝の新着分だけが対象になる。過去記事を直したときは
 * 画面上で「全件」に切り替える。
 */
export default function SeedRealestateDailyPage() {
  return (
    <SeedColumnsRunner
      heading="不動産コラム投入（追記型）"
      articles={REALESTATE_COLUMNS_DAILY_SEED}
      description={
        <>
          business=realestate／status=published。
          <code className="mx-1">scripts/seed-realestate-columns-daily.ts</code>
          の ARTICLES に登録し
          <code className="mx-1">--emit-ts</code>
          で生成した記事を投入します。記事が増えてもこのページは固定です。
        </>
      }
    />
  );
}
