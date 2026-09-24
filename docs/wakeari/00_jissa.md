# 売りにくい土地・建物の出口相談 — Step 1 リポジトリ実査表（2026-09-23）

Cowork 実装指示書 v2.0 第4章 Step 1。踏襲元の実体を特定し、新しい仕組みを作らない根拠にする。作業ブランチ：`claude/pensive-babbage-x4to85`（origin/main c36a605 起点）。

| 確認項目 | 実体（パス） | 実査表に書くこと |
|---|---|---|
| `/souzoku` のページ実体 | `src/app/[locale]/(realestate)/souzoku/page.tsx`＋`SouzokuPageContent.tsx` | 本文＝コンテンツ定数 `COPY: Record<LangCode, …>`（4ロケール）。FAQ は `@/data/faqJa` の `pickFaqJa()` を `FAQJsonLd` と表示の両方で使う。JSON-LD＝Article・FAQPage・Breadcrumb（Speakable なし） |
| `/souzoku/akiya`・`/souzoku/akiya/koishikawa` | `souzoku/akiya/page.tsx`（4ロケール COPY）／`souzoku/akiya/koishikawa/page.tsx`（ja のみ） | 方式＝`RealestateServicePage` シェル（Service JSON-LD・Breadcrumb・関連リンク・クロスリンク・署名・CtaBand を一括）。**ja のみページの手本＝koishikawa**：`buildPageMetadata({ locale: "ja", availableLocales: ["ja"], absoluteTitle: true })`。他ロケール URL は ja 本文にフォールバック（200）、hreflang は ja と x-default のみ、sitemap は `locales: ["ja"]` |
| ja のみページの番人 | `src/lib/__tests__/sitemap-static-locales.test.ts` | sitemap の `locales` とページの `availableLocales` を突合。ja 限定ページは `locale: "ja"` のリテラルが必須 |
| JSON-LD の生成関数 | `src/components/seo/OrganizationJsonLd.tsx`（RealEstateAgent・@id＝`https://luck428.com/#organization`・areaServed＝GeoCircle **@id なし**・makesOffer＝価格なしの Offer×4）／`src/components/shared/RealestateServicePage.tsx`（Service・provider＝`/#organization`・areaServed＝文字列）／`FAQJsonLd`・`Faq`（`withJsonLd`）／`BreadcrumbJsonLd`・`Breadcrumb`／`ArticleJsonLd`／`SpeakableJsonLd`（既定 cssSelector＝`.article-headline`・`.article-summary`）／`JsonLd` | GeoCircle に @id が無いため Service から参照できない → areaServed はシェルと同じ文字列に揃える。Service の serviceType・description・offers はシェルに任意 prop を追加（既存ページの出力は不変） |
| `knowsAbout` | `OrganizationJsonLd.tsx` の `founder.knowsAbout`（Thing×7・すべて Wikidata sameAs） | ここに5件を追記（sameAs は旗竿地のみ） |
| Speakable | コラム3レーン（`column/[slug]/page.tsx`）で使用。固定ページでは未使用 | `cssSelector`（任意 prop・既定不変）と `dateModified` を追加して固定ページで使う |
| 問い合わせフォーム | `src/components/ui/ContactForm.tsx`（client）／`src/lib/shared/contact-intake.ts`（`EXTRA_CATEGORY_LABELS`・`CATEGORY_ORDER_BY_BUSINESS`＝4ロケール直書き）／`src/app/api/contact/route.ts`（`categoryLabels`＝通知メールの表示名） | `?intent=` は `ContactForm` の `useEffect` が `window.location.search` を読み、当該事業の選択肢に存在するキーだけ初期選択にする（**クライアント側で処理済み**＝SSR HTML に未反映なのは仕様）。`labor-contact-order.test.ts` が realestate の並びを固定しているため期待値を更新 |
| llms.txt | `src/app/llms.txt/route.ts`（route handler・`SR_LAUNCHED` で出し分け） | 「四葉不動産株式会社が扱うこと」の直後に節を追加 |
| sitemap | `src/app/sitemap.ts`（`STATIC_REALESTATE` に `{ path, changeFrequency, priority, locales? }`。固定ページは lastmod なし＝実更新日を持たないため） | `lastModified?` を任意項目として追加し、実更新日を持つ /wakeari 配下だけ出す |
| グローバルナビ・フッター | ヘッダー最上段＝`TenantLayout.tsx` の `NAV_HREFS`（サービスはメガメニュー）／メガメニュー・`/services` の4カード＝`src/config/services-nav.ts` の `SERVICE_NAV_CATEGORIES`／フッター＝`TenantLayout.tsx` の `FOOTER_NAV_HREFS.realestate[0]`（sectionKey `inheritance`＝「相続・グループホーム開設」） | 「相続した不動産」の隣＝`services-nav.ts` の souzoku カテゴリの子と、フッター inheritance 列の `/souzoku` の後ろ。`locales: ["ja"]` |
| CTA・署名・根拠・FAQ・パンくず | `CtaBand`（variant `sale`・`intent` で `/contact?intent=` を付与。LINE は `/line` 中継、電話は `tel:`）／署名＝シェルの `authorBio`／FAQ＝`Faq`／パンくず＝`Breadcrumb` | 署名の既定文言に「記者歴34年」「駐在」が含まれるため、/wakeari 配下は `authorBio` を渡して差し替える |
| コラムの本文の置き場所 | **DB（Prisma `Column`）**。seed は `scripts/seed-*.ts` → `src/lib/data/*-seed.ts` → 管理画面から投入。テンプレート＝`src/app/[locale]/(realestate)/column/[slug]/page.tsx`＋`ColumnDetailContent.tsx`（client）。関連記事欄＝`pickRelatedColumns`（タグ→カテゴリ→日付の自動3本） | 本文は触らず、`ColumnDetailContent` に「この記事に関係する相談窓口」ブロック（`WakeariColumnHubLink`・slug 対応表）を差し込む。ja のときだけ渡す |
| `/toushi`・`/ryokin` | `toushi/page.tsx`（COPY.ja の `internalLinks`）／`ryokin/page.tsx`（`JA.sections` の「相談料・査定・賃貸管理の料金」節） | それぞれリンク行を1本 |
| CI | `.github/workflows/`（`test-and-build` は tsc の OOM で落ちる既知問題＝CLAUDE.md） | ローカルの `npx tsc --noEmit`・`vitest run` を根拠にする |

## Step 4 で作った・変えたファイル

新規：`src/lib/wakeari.ts`（単一ソース）／`src/components/wakeari/{WakeariRoleTable,WakeariSources,WakeariExitChecklist,WakeariColumnHubLink}.tsx`／`src/app/[locale]/(realestate)/wakeari/{page,saikenchiku-fuka/page,kyoyu/page,shakuchi-sokochi/page,kyosho/page}.tsx`／`src/lib/__tests__/wakeari-pages.test.ts`／`docs/wakeari/*`

変更：`sitemap.ts`／`llms.txt/route.ts`／`OrganizationJsonLd.tsx`／`contact-intake.ts`／`api/contact/route.ts`／`services-nav.ts`／`TenantLayout.tsx`／`SouzokuPageContent.tsx`／`souzoku/akiya/page.tsx`／`souzoku/akiya/koishikawa/page.tsx`／`toushi/page.tsx`／`ryokin/page.tsx`／`column/[slug]/{page,ColumnDetailContent}.tsx`／`SpeakableJsonLd.tsx`（任意 prop）／`RealestateServicePage.tsx`（任意 prop）／`labor-contact-order.test.ts`（期待値）

## 原稿の置き場所（指示書 Step 3 の md は作らない）

原稿は TSX／TS に直接置き、md への二重管理はしない（指示書 第1章「重複した要約・定型文で水増ししない」）。対応：`10〜14_*.md`＝各 `page.tsx`＋`src/lib/wakeari.ts`（title・description・h1・直答・FAQ・役割表）／`20_checklist.md`＝`WAKEARI_CHECKLIST`／`21_links.md`＝各ページの `internalLinks` と既存ページの差分／`22_llms.md`＝`llms.txt/route.ts` の追記節。

## 実査で分かった不明点・判断

- GeoCircle に既存の `@id` は無い → Service の `areaServed` はシェルの文字列「東京都文京区およびその周辺」に揃えた（PR 本文に記載）。
- 指示書 6-1 の Offer 例は `price: "0"` だが本文は「価格を書かない」→ 既存 makesOffer と同じく description（相談無料）のみ。
- 指示書 6-5「lastmod＝今日」と リポジトリ規約「固定ページは lastmod なし」の衝突 → 実更新日（ページの可視「最終更新」と同じ定数）を持つページだけ出す任意項目で両立。
- 「提携する買取業者」の表記は指示書 v2.0 の固定文言に従った。2026-08-06 の U12（司法書士・税理士との書面の提携なし→「提携」削除）と同じ論点があり得るため、買取業者との提携の実態は浦松確認事項として PR 本文に記載。

## 追記（2026-09-24・浦松決定）

- 「提携する買取業者」の表記は取りやめ。買取業者との提携（書面）は無いため、「買取業者を買主とする媒介」「買取業者（当社は媒介）」のように「提携する」を外して書く（zh-tw は「合作的收購業者」→「收購業者」）。対象＝`/wakeari` 5枚・`src/lib/wakeari.ts`・`/ryokin`・llms.txt・コラム 77〜84（原稿 md と seed 生成物。本番 DB は管理画面から再投入）。番人テストで「提携」の不在を固定。
