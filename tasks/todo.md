# タスクB-2：代表者プロフィールページ /about/uramatsu 新設（ja先行公開）

## 方針（B-1 /ryokin と同方式）
- `src/app/(realestate)/about/uramatsu/page.tsx` 新規（COPY: Record<LangCode,…>＋getRequestLocale、現フェーズja のみ）
- `availableLocales:["ja"]` で hreflang を実在ロケールに限定／sitemap も `locales:["ja"]`
- JSON-LD：ProfilePage＋Person（@id=PERSON_ID・B-2指定のサブセット：jobTitle=代表取締役／worksFor=四葉不動産／knowsLanguage 4値／hasCredential=宅建士・行政書士の2件／sameAs=Wikidata・ORCID・士業ドットコム予約ページの3本）
  ※Personフルノードの正は /about の ProfilePageJsonLd（seo.ts PERSON_JSONLD）のまま。@id同一のためKG上でマージされる
- FAQPage（3問）＝Faq部品 withJsonLd（「FAQPageは/faqのみ」規則のB-2指示による例外＝B-1と同じ扱い）
- BreadcrumbList＝Breadcrumb部品（ホーム＞会社概要＞代表プロフィール）
- 経歴事実の一次資料：llms.txt route・/global・/ryokin authorBio（記者34年／中国総局長として中国や台湾、タイに駐在／中華圏12年／国立台湾師範大学留学／2025年設立）。国数表記は不使用
- 社労士＝「2026年9月開業予定・現時点では未開業」注記を維持

## チェックリスト
- [x] リポジトリ構成確認（App Router／locale接頭辞方式／JSON-LD記述場所／既存/about構成）
- [x] /about/uramatsu ページ新規作成
- [x] sitemap.ts に /about/uramatsu（locales:["ja"]）追加
- [x] /about（AboutPageContent）に「代表プロフィールを見る」リンク追加（最小差分。経歴本文はDB翻訳値のため今回不変）
- [x] `npm run build` 通過＋ローカル実測（title/H1/回答ブロック/JSON-LD/内部リンク/sitemap反映）
- [x] 禁止語チェック（ワンストップ・一体・一括・まとめて・国数表記）出力HTML実測0件
- [ ] 差分提示 → 浦松承認待ち（承認までcommit/push/デプロイしない）

## レビュー（2026-07-19 実装完了・承認待ち）

### 変更ファイル
- `src/app/(realestate)/about/uramatsu/page.tsx` — 新規（COPY方式・ja先行。ProfilePage＋Person／FAQPage 3問／BreadcrumbList／内部リンク5本／CtaBand）
- `src/app/sitemap.ts` — /about/uramatsu を locales:["ja"] で追加
- `src/app/(realestate)/about/AboutPageContent.tsx` — 代表紹介セクション末尾に「代表プロフィールを見る」リンク追加（それ以外不変）

### 検証結果（ローカル本番ビルド PORT=3122 実測）
- `tsc --noEmit` exit 0／`npm run build` exit 0（prisma dev 使い捨てDB＋pgbouncer=true・本番DB非接続）
- title＝「代表・浦松丈二プロフィール｜元新聞記者の宅建士・行政書士 | 四葉不動産」／H1・冒頭回答ブロック＝指定文言と完全一致（grep 1件）
- JSON-LD：ProfilePage（@id=…/about/uramatsu#profilepage）＋Person（@id=PERSON_ID・hasCredential 2件・knowsLanguage 4値・sameAs 3本）／FAQPage 3問／BreadcrumbList 3階層＝すべてパース確認
- hreflang＝ja＋x-default のみ（/ryokin と同形）／canonical=https://luck428.com/about/uramatsu
- sitemap.xml に https://luck428.com/about/uramatsu（ja のみ・1件）出力確認
- 禁止語（ワンストップ・一体で・一括対応・まとめて対応・カ国/ヵ国/か国/ヶ国）＝出力HTML実測0件
- /about 回帰なし（200・AboutPage+ProfilePage JSON-LD 不変・新リンク表示確認）

### ビルド検証の補足（lessons更新候補）
- build には DATABASE_URL に加え **DIRECT_URL** も必要（schema.prisma が directUrl 参照）。db push は素URL、next build は pgbouncer=true 付きURLで実行

---

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


---

# タスクC-3：/global/chinese 新設（中国語圏特化ハブ・ja先行公開）

## チェックリスト
- [x] リポジトリ構成確認（/global現行実装・overseas-owners-guideコラムslug・B-4 CannotHandle・B-3 faqJa）
- [x] 第1段階：本文5セクション草稿の提示 → 浦松検収（2026-07-19承認・Q3はB-3既存文言「海外在住のまま〜」を採用）
- [x] /global/chinese ページ新規作成（RealestateServicePage方式・手本=C-2 shitei-shinsei）
- [x] faqJa.ts に新規2問追加（「中国語で相続不動産の相談ができますか？」「相続登記まで頼めますか？」）＝46問
- [x] /global（ja）に内部リンク追加・sitemap.ts に locales:["ja"] で追加
- [x] `tsc --noEmit` exit 0／`npm run build` exit 0（prisma dev 使い捨てDB＋pgbouncer=true・本番DB非接続）
- [x] 差分提示 → 浦松承認（2026-07-19第2段階承認済み・コミット実施）

## レビュー（2026-07-19 実装完了・浦松承認済み）

### 変更ファイル
- `src/app/(realestate)/global/chinese/page.tsx` — 新規（ja先行。回答ブロック確定文言／本文5セクション／FAQPage 4問／Service＋BreadcrumbList／CannotHandle／内部リンク6本）
- `src/data/faqJa.ts` — 外国人・中国語対応分野に2問追加（44→46問）
- `src/app/(realestate)/global/page.tsx` — ja internalLinks に /global/chinese を追加（それ以外不変）
- `src/app/sitemap.ts` — /global/chinese を locales:["ja"] で追加

### 検証結果（ローカル本番ビルド PORT=3123 実測）
- title＝「中国語で相談できる不動産・相続｜繁体字・簡体字対応 | 四葉不動産」／H1・冒頭回答ブロック＝指定文言と完全一致（grep 1件）
- JSON-LD：Service（@id=…/global/chinese#service）／FAQPage 4問／BreadcrumbList 3階層（ホーム＞外国人・多言語のお部屋探し＞中国語対応）＝すべてパース確認
- hreflang＝ja＋x-default のみ／canonical=https://luck428.com/global/chinese
- sitemap.xml に https://luck428.com/global/chinese（ja のみ）出力確認
- 禁止語（ワンストップ・一体で・一括対応・まとめて対応・カ国/ヵ国/か国/ヶ国/ケ国）＝出力HTML実測0件
- 準拠法（通則法36条）＝一般的枠組みのみ・「専門家にご相談ください」注記1件／CannotHandle（社労士未開業注記）1件
- /global 回帰なし（200・新リンク1件のみ追加）／/faq に新規2問表示確認／vitest 30件 pass
