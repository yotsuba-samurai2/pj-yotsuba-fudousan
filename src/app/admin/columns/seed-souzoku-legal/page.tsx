"use client";

import SeedColumnsRunner from "@/components/admin/SeedColumnsRunner";
import { SOUZOKU_LEGAL_COLUMNS_SEED } from "@/lib/data/souzoku-legal-columns-seed";

/**
 * 相続コラム（行政書士）シリーズのupsert投入。
 *
 * scripts/legal-columns/NN-*.md から
 * `npx tsx scripts/seed-souzoku-legal-columns.ts --emit-ts` で焼き込んだ
 * src/lib/data/souzoku-legal-columns-seed.ts を、ブラウザの管理者セッション経由で
 * slug基準の冪等upsertで投入する（再実行しても重複しない）。
 * status="published"（検収済みのため公開状態で投入。business=legal）。
 *
 * 画面と投入ロジックは SeedColumnsRunner に共通化した。既定の投入範囲は
 * 「最新日のみ」で、毎朝の新着分だけが対象になる。過去記事を直したときは
 * 画面上で「全件」に切り替える。
 */
export default function SeedSouzokuLegalPage() {
  return (
    <SeedColumnsRunner
      heading="相続コラム（行政書士）投入"
      articles={SOUZOKU_LEGAL_COLUMNS_SEED}
      description={
        <>
          business=legal／locales=[&quot;ja&quot;,&quot;en&quot;,&quot;zh-tw&quot;,&quot;zh&quot;]／status=published
          でupsert投入します（slug基準・冪等）。 再実行しても重複しません。原稿の正本＝scripts/legal-columns/NN-*.md。
        </>
      }
    />
  );
}
