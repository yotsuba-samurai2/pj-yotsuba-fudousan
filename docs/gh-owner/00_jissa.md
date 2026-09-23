# 大家募集ページ Phase 1 — リポジトリ実査表（Step 1）

実施：2026-09-24（基点 `origin/main` c36a605）。指示書 v1.0 第4章 Step 1 の項目順。実査は読み取りのみ。

## 前提の確認（Step 0）

| 項目 | 結果 |
|---|---|
| 作業ツリー | 清浄（`git status --porcelain` 出力なし） |
| sitemap（ja 450 URL） | `/group-home/ooya`・`/group-home/oya`・`/gh-*` なし → 新設で進む |
| 7-2 の既存コラム 10 本 | すべて sitemap に存在（`/column/` 3本・`/legal/column/` 7本） |
| `/wakeari`（姉妹文書） | sitemap になし・リポジトリに対応表コンポーネントなし → 本 PR で新設 |
| `/line`・`/thanks` | 実体あり（200）。sitemap 未収載は仕様（`/line` は noindex、`/thanks` は robots Disallow） |

## 実査表

| 確認項目 | 実査結果 | 本 PR での扱い |
|---|---|---|
| ページ実体 | `/toushi/group-home`＝`src/app/[locale]/(realestate)/toushi/group-home/page.tsx`（COPY 辞書＋ja 本文は JSX 直書き、4 ロケール）。`/group-home`＝`group-home/page.tsx`＋`GroupHomePageContent.tsx`（COPY 辞書・4 ロケール・シェル不使用）。`/souzoku/akiya/koishikawa`＝`souzoku/akiya/koishikawa/page.tsx`（**ja のみ**。`RealestateServicePage` シェル＋JSX 直書き＋定数配列。`buildPageMetadata({ locale:"ja", absoluteTitle:true, availableLocales:["ja"] })`＝hreflang は ja＋x-default、他ロケールは日本語本文で 200） | koishikawa 型を踏襲。置き場所は `src/app/[locale]/(realestate)/group-home/ooya/page.tsx`（`/group-home` は page.tsx のみのディレクトリで入れ子可） |
| ja のみページの番人 | `src/lib/__tests__/sitemap-static-locales.test.ts`：sitemap の `locales:["ja"]` と、ルート直下 .tsx の**リテラル** `availableLocales: ["ja"]`・`locale: "ja"` を突合 | 両方をリテラルで書く |
| `[locale]/layout.tsx` | `dynamic = "error"`（L38）＝`headers()`・`searchParams` 不可 | クエリはクライアントで `window.location.search` を読む（ContactForm と同じ） |
| JSON-LD 生成 | Service＝`RealestateServicePage` が出力（`@id` `<url>#service`、`provider {"@id":"https://luck428.com/#organization"}`、`author {"@id": PERSON_ID}`、`areaServed "東京都文京区およびその周辺"`）。WebPage＋dateModified＝`/reasons` の `WEBPAGE_JSONLD`＋`JsonLd`。BreadcrumbList＝`Breadcrumb` 部品。FAQPage＝`Faq` 部品（`withJsonLd`。表示と JSON-LD を同じ `items` から生成、`links` は Answer に含めない）。speakable は `SpeakableJsonLd`（コラム専用・固定セレクタ）。`Offer` の既存例＝`OrganizationJsonLd`（`hasOfferCatalog`）・`/legal/ryokin`・`property-jsonld.ts`。Organization `@id` は `https://luck428.com/#organization`（`OrganizationJsonLd.tsx` L62）、Person は `PERSON_ID = "https://luck428.com/#uramatsu-joji"`（`seo.ts` L95）。`knowsAbout` は `OrganizationJsonLd.tsx` L150-186（founder Person 内・7 件・Wikidata `sameAs`） | シェルの Service に任意 `serviceExtra`（serviceType・areaServed・audience・offers）を足せるようにする（既存ページの出力は不変）。WebPage は `/reasons` の型＋`speakable`（`.gh-owner-answer`・`.gh-owner-who`）。`knowsAbout` は Wikidata の照合が 429（レート制限）で未完のため保留（第9章「未検証」） |
| 問い合わせフォームと送信経路 | `src/components/ui/ContactForm.tsx`（client）→ `POST /api/contact`（`src/app/api/contact/route.ts`）。zod：`name` 必須・`email` 必須（email 形式）・`phone` 任意・`category` 必須（自由文字列）・`source` 任意・`message` 必須（上限なし）・`business`。`.strict()` ではない＝未知キーは黙って捨てられる。送信＝Resend で通知（宛先固定 `uramatsujoji@luck428.com`・件名 `【お問い合わせ】<categoryLabel> - <name>様`）＋自動返信の 2 通。**保存なし・Notion 連携なし・スパム対策なし**（honeypot・Turnstile・rate limit いずれも無し）。成功後は `router.push(addLocalePrefix("/thanks", locale))`。`/thanks` はクエリを読まない。`category` の選択肢＝`CATEGORY_ORDER_BY_BUSINESS.realestate`（`src/lib/shared/contact-intake.ts`）、ラベル＝`EXTRA_CATEGORY_LABELS`（4 ロケール直書き・DB辞書に新キーを増やさない規約）、通知メールのラベル＝`route.ts` の `categoryLabels`。`?intent=` の対応＝`bukken*` は本文テンプレ挿入、それ以外はカテゴリキー一致でプリセット（`gh-owner` を realestate の並びに入れれば `/contact?intent=gh-owner` で選択済みになる）。物件項目は `PropertyViewingCta` と同じく `message` に整形して入れる | `category=gh-owner` を 3 か所（並び・ラベル・メールラベル）＋既存テスト `labor-contact-order.test.ts` の期待配列に追加。**指示書の「メールまたは電話のどちらか必須」は API の `email` 必須と衝突**するため、`category === "gh-owner"` のときだけ「電話があればメール任意」にする最小変更を `route.ts` に入れる（他カテゴリの挙動は不変。メール無しのときは自動返信を送らず、通知の replyTo を省く）。`/thanks` の `?from=` は Phase 2 |
| アップロード基盤 | `api/admin/upload`・`api/admin/bukken/import`（Supabase Storage `column-images`）は**管理者認証必須**。公開フォームから使える基盤は無し。`@vercel/blob` 無し | 決定 3 の既定どおり Phase 1 では実装しない（チェックボックス＋LINE 案内） |
| GA4 | `src/components/GoogleAnalytics.tsx`（`NEXT_PUBLIC_GA_ID` 設定時のみ gtag 読込。`G-DKFGP8LKNJ` は本番の env 値）。ヘルパ `gaEvent(name, params)`（`src/lib/gtag.ts`・個人情報／自由記述禁止）。既存のイベント名＝`contact_submit`（business・category・source・intent）・`contact_submit_error`（kind）・`cta_line_click`（location・page）・`cta_tel_click`（location）・`cta_contact_click`（location）。部品＝`LineLink`・`TelLink`（計測付き） | **既存の名前の規約に合わせる**（指示書 6-2 の `line_click`・`tel_click` 等は使わず、`cta_line_click` 等に `location: "gh_owner_*"` を付ける。詳細は `23_events.md`） |
| llms.txt | `public/` ではなく `src/app/llms.txt/route.ts`（テンプレートリテラル）。「四葉不動産株式会社が扱うこと」は L45-51（`- **見出し**：説明` 形式） | L49 の直後に 1 行追記 |
| sitemap | `src/app/sitemap.ts` の `STATIC_REALESTATE`。ja のみは `{ path, changeFrequency, priority, locales: ["ja"] }` の 1 行。**固定ページは lastmod を出さない設計**（SEO 監査 2026-08-24 P1-2・コード内コメント） | 1 行追加。lastmod は既存設計に従い出さない（指示書 Step 4-10 からの意図的な逸脱。dateModified は WebPage JSON-LD と可視表示で持つ） |
| フッター | `src/components/layout/TenantLayout.tsx` `FOOTER_NAV_HREFS.realestate[0]`（相続・グループホーム開設）。ja のみは `locales: ["ja"]`（sitemap の locales と一致させる規約）。ヘッダーは `NAV_HREFS`・`services-nav.ts`＝触らない | `/group-home` の直後に 1 行 |
| コラムのテンプレート | `/column/[slug]`＝`page.tsx`（server）＋`ColumnDetailContent.tsx`（client。本文の直後に Prev/Next、その後に関連記事）。`/legal/column/[slug]`＝`page.tsx`＋`LegalColumnDetailContent.tsx`（関連記事ブロックなし）。本文は Prisma `Column.content`（Markdown）。関連記事は「日付順の自動3本」ではなく、タグ一致 2 点＋カテゴリ一致 1 点＋日付の順（`pickRelatedColumns`）。slug 判定の先例＝labor の `ZehitomoLinks`（`locale === "ja" && slug === …`） | 対応表コンポーネント `RelatedConsultWindows`（server 安全・Prisma 非依存）を新設し、両 page.tsx で `locale === "ja"` かつ対応表に slug があるときだけ本文直後に描画（client 部品へ `afterBody` として渡す）。DB の本文は触らない |
| `/voices` | `src/lib/data/customer-voices.json`。`id` が `<article id>` になる。`realestate-2`＝S 社（グループホーム用の物件探し）、`realestate-6`＝H さん（空き家を貸すか売るか）。本番 HTML でも両アンカーを確認 | そのままリンク |
| 姉妹文書の対応表コンポーネント | なし（`consult-window`・`wakeari` 等の検索 0 件） | 本 PR で新設。行は配列に足すだけの構造にする |
| プライバシーポリシー | DB 辞書。本番ページ（2026-09-23 取得）の「2. 利用目的」に「お問い合わせへの回答・対応」あり | 停止条件に該当しない。フォーム下にポリシーへのリンクを 1 行置く（同意チェックは既存フォームに無いため置かない） |
| 既存ページのリンク挿入点 | `/toushi/group-home`＝ja 分岐内 §3 の `</ul>` 直後（L326）。`/group-home`＝`COPY.ja.internalLinks`（`{href,label,description}`、ja のみに追加）。`/souzoku/akiya`＝§5「グループホーム等への転用という選択肢」の既存リンク直後（共通 JSX のため `locale === "ja" &&` で囲む）。`/legal/services/shogai-fukushi`＝`COPY.ja.sec2Body` の「物件」li 内（`gh-v10-pages.test.ts` が 4 ロケール描画・`/toushi/group-home` リンク必須） | いずれもリンク行の追加のみ・削除行なし |
| CTA 部品 | `CtaBand`（server）の contact ボタンは `/contact?intent=` 固定。`RealestateServicePage` はシェル末尾で `CtaBand` を描画 | CTA③を `#form` に向けるため、`CtaBand` に任意の `contactHref` 上書き、シェルに `ctaContactHref` を通す（省略時の出力は不変） |
| 著者署名 | シェルの既定 `authorBio` に「元毎日新聞中国総局長（記者歴34年）。中国や台湾、タイに駐在。」が含まれる（`luck428-column-seo` 第9条の禁止表現。既存の共通文言のため本 PR では触らない） | 本ページは `authorBio` を明示して禁止表現を出さない。`/about/uramatsu` へのリンクは `/reasons` の「文責」行の型で本文末に置く |

## 止まる条件（第9章）の判定

| ケース | 該当 |
|---|---|
| 作業ツリーに未コミット変更 | なし |
| 同じ役割のページが既にある | なし |
| 送信 API に物件項目を入れる場所が無い | なし（`message` に整形） |
| プライバシーポリシーに問い合わせ対応が無い | なし（あり） |
| コラムのテンプレートがコードに無い | なし（あり） |
| GA4 の送信ヘルパが無い | なし（`gaEvent`） |
| 法令の一次確認ができない条文 | `01_konkyo.md` に記載 |

**無人実行のため、実査表・原稿の各停止点では止まらず続行し、PR 本文に明記する（指示書 Step 1・Step 3 の但し書き）。**
