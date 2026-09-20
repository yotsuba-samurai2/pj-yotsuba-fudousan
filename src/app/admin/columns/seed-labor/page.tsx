"use client";

import SeedColumnsRunner from "@/components/admin/SeedColumnsRunner";
import { LABOR_COLUMNS_SEED } from "@/lib/data/labor-columns-seed";

/**
 * 労務コラムのupsert投入。
 *
 * scripts/labor-columns/*.md（日本語原稿）と en/ zh-tw/ zh/ の翻訳から
 * `npm run column:emit`（= npx tsx scripts/seed-labor-columns.ts --emit-ts）で焼き込んだ
 * src/lib/data/labor-columns-seed.ts を、ブラウザの管理者セッション経由で
 * slug基準の冪等upsertで投入する（再実行しても重複しない）。
 * status="published" / business=labor。locales は4言語が揃っていれば [] ＝全言語公開、
 * 揃っていなければ ["ja"]（seed-labor-columns.ts 側で判定）。
 *
 * 件数は LABOR_COLUMNS_SEED.length に追随させ、画面に固定値を書かない
 * （4本時代の「（4本）」が52本になっても残っていたため）。
 *
 * 画面と投入ロジックは SeedColumnsRunner に共通化した。既定の投入範囲は
 * 「最新日のみ」で、毎朝の新着分だけが対象になる。過去記事を直したときは
 * 画面上で「全件」に切り替える。
 */
export default function SeedLaborPage() {
  return (
    <SeedColumnsRunner
      heading={`労務コラム（全${LABOR_COLUMNS_SEED.length}本）投入`}
      articles={LABOR_COLUMNS_SEED}
      description={
        <>
          business=labor／status=published でupsert投入します（slug基準・冪等）。再実行しても重複しません。
          locales は4言語が揃っていれば []（＝全言語公開）、揃っていなければ [&quot;ja&quot;] で入ります。
          原稿の正本＝scripts/labor-columns/*.md。
        </>
      }
    />
  );
}
