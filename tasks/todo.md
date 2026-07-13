# コラム内部リンク欠落の修正（feat/column-internal-links）

## 背景
`/column` 一覧が `ColumnListPageContent`（`"use client"`）の `useEffect` で記事を
クライアント取得しているため、SSR HTML に記事リンクが 0 本。
実測（2026-07-14）: `curl https://luck428.com/column | grep 'href="/column/'` → 0 件。
詳細ページは server fetch 済みで prev/next リンクが SSR されている（9件確認）。

## 根本原因
一覧ページだけが server-fetch パターンに従っていない（技術的制約ではなく実装漏れ）。
データ層 `lib/columns.ts` は isomorphic Firebase SDK + React `cache()` で server 実行可能。

## 計画（論理コミット4分割）

### ① 一覧ページの SSR 修正
- [ ] `column/page.tsx` を async 化し `getRequestLocale()` + `getColumns(locale)` で server fetch
- [ ] `ColumnListPageContent` を props 受け取りに変更（useEffect/spinner 削除）
- [ ] 英語（記事0本）は既存 empty-state を維持（他言語記事の混入はしない＝hreflang汚染回避）

### ② 一覧ページの構造化データ
- [ ] `ColumnCollectionJsonLd`（CollectionPage + 入れ子 ItemList）を新規作成し `column/page.tsx` で出力
- [ ] BreadcrumbList は既存（据え置き）

### ③ 詳細ページの関連記事
- [ ] `pickRelatedColumns()` ヘルパ（同一ロケール・タグ一致→カテゴリ一致→新着、自身除外、最大3）
- [ ] `RelatedColumnsSection` 新規プレゼンテーション（server/client 両用・next/link + addLocalePrefix）
- [ ] `column/[slug]/page.tsx` で related を算出し prop 渡し／`ColumnDetailContent` に節を追加

### ④ ハブページからの文脈リンク
- [ ] `filterColumnsByTheme()` ヘルパ（相続/投資/global をキーワードで横断マッチ）
- [ ] `/souzoku`・`/toushi`・`/global`・トップに RelatedColumnsSection を設置
- [ ] 該当コラムが無いテーマは「不足コラム」として報告

## 検証
- [ ] `npm run build` 通過
- [ ] local `npm run dev` → `curl /column | grep -o 'href="/column/[^"]*"' | sort -u | wc -l` = 公開記事数
- [ ] 各ロケール一覧でも同様
- [ ] `/column` の JSON-LD がパース可能・ItemList 要素数 = 記事数
- [ ] 詳細ページに関連記事3本
- [ ] 既存ページの JSON-LD/meta/hreflang 不変（差分確認）

## レビュー（2026-07-14 実装完了）

### 根本原因
`column/page.tsx` が薄い server shell → 本体 `ColumnListPageContent`（`"use client"`）が
`useEffect` で `getLatestColumns` をクライアント取得。SSR HTML には spinner のみ・記事リンク0。
データ層は isomorphic Firebase SDK + `cache()` で server 実行可能＝実装漏れだった。

### 変更ファイル
- `src/lib/columns.ts` — `pickRelatedColumns()` / `filterColumnsByTheme()` 追加
- `src/components/column/RelatedColumnsSection.tsx` — 新規（server/client 両用の関連リンク節）
- `src/components/seo/ColumnCollectionJsonLd.tsx` — 新規（CollectionPage + 入れ子 ItemList）
- `src/app/(realestate)/column/page.tsx` — async 化・server fetch・JSON-LD 出力
- `src/app/(realestate)/column/ColumnListPageContent.tsx` — props 化・useEffect 削除
- `src/app/(realestate)/column/[slug]/page.tsx` — related 算出・prop 渡し
- `src/app/(realestate)/column/[slug]/ColumnDetailContent.tsx` — 関連記事節を追加
- `src/components/shared/RealestateServicePage.tsx` — `relatedColumns` prop（compact nav card）
- `src/app/(realestate)/souzoku/SouzokuPageContent.tsx` — 相続テーマ関連コラム
- `src/app/(realestate)/toushi/page.tsx` — 投資テーマ
- `src/app/(realestate)/global/page.tsx` — 外国人向けテーマ
- `src/app/(realestate)/HomePageContent.tsx` — 最新コラム3本

### 検証結果（`npm run start` 実測）
- `npm run build` exit 0 / `tsc --noEmit` exit 0
- `/column` SSR 記事リンク: ja=2, en=2, zh=2, zh-tw=11（旧=0）。ロケール接頭辞も正しい
- `/column` JSON-LD: CollectionPage + ItemList、`numberOfItems` = 表示リンク数（ja=2 / zh-tw=11）で一致
- 詳細（zh-tw）: 関連記事セクションにちょうど3本
- ハブ: toushi=1・global=2・home=2・souzoku=0
- 既存の canonical・hreflang(5言語)・RealEstateAgent/WebSite/BreadcrumbList/Article/FAQPage/Service JSON-LD すべて不変

### 不足コラム（後続の執筆計画用）
- **相続（souzoku）テーマの ja コラムが0本**。既存 ja コラムは `お知らせ`・`海外オーナー向け` のみ。
  `/souzoku`（相続ピラー）に張れる関連コラムが無い＝「文京区×相続」「相続登記の義務化」等の執筆が必要。
- en/zh は多言語対応済みの2本のみ＝英語独自コラムは依然不足（レポートP1-2どおり）。

