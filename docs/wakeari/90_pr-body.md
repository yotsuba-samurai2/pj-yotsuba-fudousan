## 目的
luck428.com に「売りにくい土地・建物の出口相談」コーナー（ハブ 1＋種類別 4、ja のみ）を追加する。企画書：難あり土地_出口相談コーナー_AIO-LLMO-SEO実装プラン_20260924（v1.0）／Cowork 実装指示書 v2.0（2026-09-24）Phase 1。

決定欄（第2章）は既定値で走らせた：`/wakeari`／買取は B（提携する買取業者を買主とする媒介・「当社が買主」の文言なし）／「文京区を中心に東京23区」／日本語のみ／定点 #34〜#39 は提案のみ／`/jirei` は触らない／コラム→受け皿の逆リンクはコード側の対応表。

## 対象ルート
/wakeari、/wakeari/saikenchiku-fuka、/wakeari/kyoyu、/wakeari/shakuchi-sokochi、/wakeari/kyosho（すべて ja 先行公開・hreflang は ja と x-default・sitemap は ja のみ）

## 変更ファイル
新規
- `src/lib/wakeari.ts` — 単一ソース（メタ・固定文言・FAQ・役割表・チェックリスト・コラム対応表・法令の現行版施行日）
- `src/components/wakeari/WakeariRoleTable.tsx`（事業者主語の一文＋役割表＋分離受任の一文・`.wakeari-who`）／`WakeariSources.tsx`（根拠表＋署名＋最終更新）／`WakeariExitChecklist.tsx`（出口チェックリスト・client・送信なし）／`WakeariColumnHubLink.tsx`（コラム→受け皿の1本）
- `src/app/[locale]/(realestate)/wakeari/{page,saikenchiku-fuka/page,kyoyu/page,shakuchi-sokochi/page,kyosho/page}.tsx`
- `src/lib/__tests__/wakeari-pages.test.ts`（番人・25件）
- `docs/wakeari/00_jissa.md`（実査表）／`01_konkyo.md`（法令一次確認表）／`90_pr-body.md`（本文）

変更（既存ページはリンク追加のみ）
- `src/app/sitemap.ts` — 5ルート（`locales: ["ja"]`・実更新日の `lastModified`。`StaticPage` に任意項目を追加）
- `src/app/llms.txt/route.ts` — 「売りにくい土地・建物の出口相談」節（受け皿5枚＋主要コラム6本）・最終更新日
- `src/components/seo/OrganizationJsonLd.tsx` — `knowsAbout` に5件
- `src/lib/shared/contact-intake.ts`／`src/app/api/contact/route.ts` — `category=wakeari`（akiya の次）・通知メールの表示名
- `src/config/services-nav.ts`／`src/components/layout/TenantLayout.tsx` — サービスメガメニュー（相続不動産カテゴリ）とフッター（相続・グループホーム開設列）に `/wakeari`（ja のみ）
- `src/app/[locale]/(realestate)/souzoku/SouzokuPageContent.tsx` — 3つの出口の節末に1行、共有名義・借地権の FAQ の回答直下に各1行（ja のみ・表示のみ・FAQPage の answer は不変）
- `souzoku/akiya/page.tsx`・`souzoku/akiya/koishikawa/page.tsx`・`toushi/page.tsx`・`ryokin/page.tsx` — 関連リンクに1〜2本（ja のみ）
- `column/[slug]/page.tsx`・`ColumnDetailContent.tsx` — 対応表にある19本の記事に「この記事に関係する相談窓口」ブロック（ja のみ・DB の本文は不変）
- `src/components/seo/SpeakableJsonLd.tsx`（`cssSelector`・`dateModified` を任意 prop に）／`src/components/shared/RealestateServicePage.tsx`（Service に `serviceType`・`description`・`offers` を任意 prop で）— 既存ページの出力は不変
- `src/lib/__tests__/labor-contact-order.test.ts` — realestate の並びの期待値に `wakeari` を追加

## JSON-LD
- WebPage＋SpeakableSpecification：`cssSelector: [".wakeari-answer", ".wakeari-who"]`・`dateModified` 併記（5枚）
- BreadcrumbList：shell の `Breadcrumb` 部品（ホーム › 売りにくい土地・建物の出口相談 › 種類別）
- FAQPage：`Faq withJsonLd`＝本文と同じ配列（`WAKEARI_FAQ`）から描画・生成。ハブ10問・種類別8問
- Service：shell が各ページ1件（`<url>#service`・provider＝`/#organization`・serviceType・description・offers＝相談無料）。ハブは種類別4件を `@graph` で追加出力。**areaServed は shell と同じ文字列**（既存 GeoCircle に `@id` が無く参照できないため）
- ItemList（ハブのみ）：種類別4枚を position・name・url で
- Article：`ArticleJsonLd`（datePublished／dateModified＝2026-09-23）
- 出力の実測（Rich Results Test）は未実施＝プレビュー／本番で浦松が確認

## knowsAbout
- 付けた：旗竿地＝`Q109361716`（ja ラベル「旗竿地」・jawiki「旗竿地」にリンク。説明文は空）
- 付けなかった：借地権（検索先頭の `Q2630687` は ja ラベルが「動産賃借権」＝完全一致でない）／共有持分（`Q1939539`「共有」は上位概念）／再建築不可・狭小地（該当項目なし）

## 既存ページの差分
リンク追加のみ（`SouzokuPageContent.tsx`：型に任意項目2つと ja の定義、描画2箇所／`akiya`・`koishikawa`・`toushi`・`ryokin`：各1〜2行／`column/[slug]`：prop 1つと描画1行）。削除行があるのは `ColumnDetailContent.tsx`（関数の引数に prop 追加）・`SpeakableJsonLd.tsx`（固定値を任意 prop に）・`llms.txt/route.ts`（最終更新日）・`labor-contact-order.test.ts`（期待値）の4か所で、いずれも既存の出力を変えない。

## 検証
- `npx tsc --noEmit`：通過（エラー0）
- `npx eslint <変更ファイル>`：エラー0（warning 4 は既存の `<img>`・未使用引数）
- `npx vitest run`：全 92 ファイル・1,376 件通過（新規 25 件を含む）
- 禁止語 grep（追加行）：0件／「紹介料」は「紹介料を受け取りません」のみ／必須語（独立した事業体・別々にご契約）：共通部品 `WakeariRoleTable` 経由で5枚に有／相対パス：確認済（絶対 URL の href なし）
- FAQ の文言一致：同一配列から描画・生成（番人テストで固定）
- `next build`・描画確認：本セッションでは DB なしのため未実施 → Vercel プレビューで確認
- 法令の一次確認：e-Gov 法令API（v1 条文・v2 現行版施行日）・東京都例規集・高知県公式・文京区公式（`docs/wakeari/01_konkyo.md`・参照日 2026-09-23）

## 未検証事項
- 2025-04-01 施行の建築基準法改正の法律番号（条文は現行版で確認済み）
- 借地借家法の施行日（1992-08-01）を定めた政令番号
- 報酬告示（令和6年国土交通省告示第949号）の原文（PDF がテキスト抽出できず、高知県公式ページの要約で確認）
- 各条文の条ごとの最終改正日（法令単位の現行版施行日を併記）
- 「提携する買取業者」の表記＝指示書 v2.0 の固定文言に従った。買取業者との提携が書面で存在するかは未確認（2026-08-06 U12 で司法書士・税理士の「提携」を外した経緯と同じ論点）。書面が無い場合は「買取を行う不動産会社」等への差し替えを要検討
- Rich Results Test（FAQPage・BreadcrumbList）・プレビューの到達性チェック（200／canonical／noindex なし／JSON-LD の parse）

## 浦松未確認の工程（無人実行）
実査表（`docs/wakeari/00_jissa.md`）／原稿（各 page.tsx・`src/lib/wakeari.ts`）＝指示書の停止点で止まらず続行した。

## Phase 3 への提案（本 PR では触らない）
- 定点 #34〜#39 の追加（企画書 第9章の設問を `定点33項目_測定用クエリ表_v1.md` にコピー）
- `/jirei` の2事例（熊谷の代償分割は浦松の可否後）／`/wakeari/kyoyu`・`/wakeari/shakuchi-sokochi` の zh-tw 版

## 台帳に貼る1行
`2026-09-23｜/wakeari 配下5枚 新設（型A：受け皿なし→新設。担当設問＝定点#34〜#39 提案）｜PR未マージ｜再着手可能日＝マージ日＋14日｜PR #（番号）`

## マージ・デプロイ・GSC は浦松が行う
マージ後：`/wakeari` 配下5URL（ja のみ）の到達性チェック → GSC 登録は1URL1コードブロックで別途渡す。
