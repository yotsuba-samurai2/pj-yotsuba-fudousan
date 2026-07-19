# NAP住所 正式表記 統一（表示データ層）— 2026-07-20

## 正式表記
`小日向４丁目２－５ 小日向安田ビル ２０３`（全角－ U+FF0D／番地・ビル名・部屋番号の間に半角スペース）
street単独=`小日向４丁目２－５`／building単独=`小日向安田ビル ２０３`

## 決定（浦松承認）
1. DB翻訳値はadmin是正ルート新設（fix-compliance方式）＋backup JSON同時是正。本番実行はユーザー。
2. 英語=ローマ字維持・整形のみ。
3. labor `2F`→`203` に統一。

## 実装
- [x] `src/lib/data/nap-address-patches.ts`：`normalizeNapAddress`（アンカー限定・idempotent）＋`NAP_OFFICIAL`＋`NAP_BAD_VARIANTS`。単体テスト10/10・近隣地名の言及は不変を確認。
- [x] `src/app/admin/translations/fix-nap-address/page.tsx`：4言語の全文字列リーフを正規化→保存→残存スキャン報告。→**本番でユーザーが実行する**。
- [x] ソース：`office.ts`／`office-public.ts` の Google Maps mapUrl を正式表記へ。
- [x] backup JSON是正（生テキスト正規化で差分最小）：`scripts/backup/translations-*.json`・`_backup/20260710_translations/*.json`（8ファイル）＋補助スクリプト `scripts/fix-nap-backups.ts`。
- [x] `docs/spec.md` 所在地（2F・旧ダッシュ）を正式表記へ。
- [x] 検証：`tsc --noEmit` 0 errors／eslint 0／repo grep 分類済み。

## 未実施（ユーザー作業）
- 本番で `/admin/translations/fix-nap-address` を実行しDB翻訳(ja/en/zh-tw/zh)を是正 → 残存スキャン0件を確認。

## repo grep 結果（小日向 総437件）
- NAP正式表記：street 77／building 67（rendering・source）
- 近隣地名の言及（住所でない・対象外）：219
- 非正式の残存 74件＝**すべて本番非表示**：
  - 過去の監査/スナップショット記録 46（reconciliation-report.json・columns-backup-*.json：履歴のため改変しない）
  - seedのdry-run生成物 18（taiwan-columns.preview.json：本番seed `taiwan-columns-seed.ts` に住所は0件＝非表示）
  - 検出器の定義 9（nap-address-patches.ts の NAP_BAD_VARIANTS：仕様上必須）
  - タスクメモ 1（entity-disambiguation-wikidata.md：gBizINFO登録形の引用・別タスク）
