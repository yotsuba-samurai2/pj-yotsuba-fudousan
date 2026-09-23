## 目的
luck428.com に、グループホーム向けに物件を貸したい大家・空き家所有者の受け皿ページ（/group-home/ooya、ja のみ）と専用フォームを追加する。指示書 v1.0（2026-09-24）。決定欄は全項目既定値。無人実行のため、実査表・原稿の停止点では止まらず続行した（指示書 Step 1・Step 3 の但し書き）。実査表＝`docs/gh-owner/00_jissa.md`、法令＝`01_konkyo.md`、原稿＝`10_page.md`〜`23_events.md`。

## 役割分担（カニバリ防止）
新ページ＝受け皿（募集条件・一般の賃貸との違い・流れ・誰がやるか・専用フォーム）。/column/kodate-akiya-group-home-ni-kasu＝深掘り（仕組み・3大不安・契約書5点）。タイトル・H1 を食い合わせていないことを確認済み（既存コラム＝「戸建て・空き家を『グループホームに貸す』という選択——大家さんが最初に知りたいこと」、新ページ＝「…グループホーム向けに貸しませんか——物件をお持ちの大家さんの相談窓口」）。luck428-column-seo 第3条の表への追記案は末尾。

## 変更ファイル
- 新規：`src/app/[locale]/(realestate)/group-home/ooya/page.tsx`（ページ本体・12要素・FAQ 10問・JSON-LD）／`src/components/group-home/GhOwnerForm.tsx`（専用フォーム）／`GhOwnerCta.tsx`（CTA①②）／`src/lib/shared/gh-owner-intake.ts`（種別・利用状況・送信本文の整形）／`src/lib/column-consult-windows.ts`＋`src/components/column/RelatedConsultWindows.tsx`（コラム→受け皿の対応表と表示）／テスト `gh-owner-intake.test.ts`・`gh-owner-page.test.ts`／`docs/gh-owner/*`
- 既存（リンク行の追加のみ・削除行なし）：`/toushi/group-home`（§3 の直後）、`/group-home`（`COPY.ja.internalLinks`）、`/souzoku/akiya`（§5・ja のみ）、`/legal/services/shogai-fukushi`（「物件」li 内）、フッター（`TenantLayout.tsx`・`locales:["ja"]`）、`llms.txt`（不動産の箇条書きに1行）、`sitemap.ts`（1行・ja のみ）
- 共通部品（任意 props の追加・省略時の出力は不変）：`RealestateServicePage`（`serviceExtra`・`ctaContactHref`）、`CtaBand`（`contactHref`）、`ColumnDetailContent`／`LegalColumnDetailContent`（`afterBody`）、両コラム `page.tsx`（ja・対応表の slug のときだけ描画）
- 問い合わせ：`contact-intake.ts`（`gh-owner` のラベル4ロケール・realestate の並びに追加）、`api/contact/route.ts`（ラベル＋下記の最小変更）、`labor-contact-order.test.ts`・`contact-api-routing.test.ts`

## フォーム
- 送信経路：既存 `POST /api/contact`（Resend の通知＋自動返信）。`category=gh-owner`・`business=realestate`。物件項目は `buildGhOwnerMessage()` で本文に整形（例は `docs/gh-owner/20_form.md`。テストで期待出力と照合）
- 必須4項目：お名前／連絡先（メールか電話のどちらか）／所在地／種別。任意：間取り・延床面積・利用状況・希望賃料・図面チェック・備考・流入元（既存と同じ選択肢）
- **既存 API への最小変更**：`category === "gh-owner"` のときだけ「電話があればメール任意」。他カテゴリは従来どおりメール必須（テストで固定）。メール無しのときは自動返信を送らず、通知の replyTo を付けない（通知メールは「未入力（電話でご連絡ください）」）
- スパム対策：既存と同じ（＝現状なし。本 PR で新設せず。未検証事項へ）。送信後は既存の `/thanks`（`?from=` は Phase 2）。同意チェックは既存フォームに無いため置かず、プライバシーポリシーへのリンク1行を置いた
- アップロード：Phase 1 では含めない（公開用のアップロード基盤なし。管理者用の Supabase Storage のみ）。チェックボックス＋「送信後に LINE またはメールで」の案内

## GA4
既存の名前の規約に合わせた（`docs/gh-owner/23_events.md`）。`cta_contact_click`／`cta_line_click`／`cta_tel_click`（`location: gh_owner_hero|gh_owner_mid|gh_owner_form|gh_owner_trust`、`page: gh_owner`）、`contact_form_start`（初回フォーカス1回・GA4 自動収集の `form_start` と名前を分けた）、`contact_submit`（`category=gh-owner`・`form_id=gh_owner`・`property_type`＝種別のキーのみ・`intent=gh-owner-page`）、`contact_submit_error`（`kind`）。個人情報・自由記述は送らない。キーイベント登録（`contact_submit` を `category=gh-owner` で、`cta_line_click` を `page=gh_owner` で絞る）は浦松（GA4 管理画面）。

## JSON-LD
`gh-owner-page.test.ts` で描画結果から検証：FAQPage（10問・設問と回答が表示と同一配列）／WebPage（`dateModified` 2026-09-24＝可視の最終更新日、`speakable` `.gh-owner-answer`・`.gh-owner-who`、publisher＝`/#organization`）／Service（`#service`・serviceType・areaServed「東京都文京区を中心とする東京23区」・audience・Offer は既存の makesOffer に合わせ価格なし）／BreadcrumbList（ホーム › グループホーム開設 › 大家募集）。`knowsAbout` への「共同生活援助」追加は Wikidata の照合が 429 で未完のため見送り（未検証）。

## 既存ページの差分
リンク追加のみ。削除行なし（`git diff origin/main` で確認。削除行があるのは自分が拡張した共通部品・テスト・route.ts のみ）。

## 法令の一次確認で訂正した点（e-Gov 法令 API・2026-09-23）
- 共同生活援助の定義は障害者総合支援法第5条**第18項**（指示書付録Bの第17項は現行では自立生活援助）
- 宅建業法**第34条の2**（媒介契約書面）は条文上「売買又は交換」の媒介契約が対象で貸借の媒介を含まない → ページでは引用せず、第34条（取引態様の明示）・第46条（報酬）に置き換えた
- 消防法施行令別表第一(6)項ロ(5)の入居者の区分の数値は総務省令に委任 → 「区分4以上」は書かない
- 文京区の近隣説明の運用は区の公開ページに記載なし → FAQ6 は「自治体の運用による」に留める

## 指示書からの意図的な逸脱
- sitemap の lastmod：固定ページは lastmod を出さない既存設計（SEO監査 2026-08-24 P1-2）に従い出していない。PR #421 が `StaticPage.lastModified` を足しているため、同 PR が先にマージされれば `lastModified: "2026-09-24"` を1語足すだけで揃えられる
- GA4 のイベント名：指示書 6-2 の新名（`cta_click`・`line_click`・`form_submit` 等）ではなく既存名＋パラメータ

## 姉妹 PR との競合
PR #421（`/wakeari`・未マージ）と同じ共有ファイルを触っている：`ColumnDetailContent.tsx`／`column/[slug]/page.tsx`（props の追加行）、`contact-intake.ts`・`labor-contact-order.test.ts`・`route.ts`（`akiya` の次に `wakeari` と `gh-owner` を入れる同じ位置）、`TenantLayout.tsx`（同じフッター項の隣接行）、`RealestateServicePage.tsx`（Service の拡張 props：#421＝`serviceType`/`serviceDescription`/`serviceOffer`、本 PR＝`serviceExtra`）、`tasks/todo.md`（末尾）。コラム→受け皿の部品は #421 が `WakeariColumnHubLink`（1本）、本 PR が `RelatedConsultWindows`（対応表）として別々に新設しており、**後にマージする側で競合解消が要る**（いずれも数行）。`/wakeari` へのリンクは未公開のため本 PR では張っていない。

## 検証
`npx tsc --noEmit`：0件／eslint：error 0（警告は既存の `<img>` のみ）／vitest：93ファイル・1,359件通過（新規テスト含む）／禁止語 grep：0件（`origin/main` 基準）／必須語（独立した事業体・別々にご契約）：有／相対パス：確認済／整形本文の目視：テストで期待出力と照合／描画：`renderToStaticMarkup` の番人テストで H1・直答・#form・CTA③→#form・JSON-LD 4種・禁止語なしを固定。ブラウザ描画は Vercel プレビューで確認する（`next dev`／`next build` はローカル DB が無いため未実行）

## 未検証事項
1. 文京区の近隣説明の運用（区ページ・PDF に記載なし）
2. 消防法施行令(6)項ロ(5)の入居者区分の数値（消防法施行規則は未取得）
3. 建築基準法施行令第115条の3（グループホームの用途の当てはめ）
4. 東京消防庁の事前相談・消防同意の専用ページ（届出制度のページまで）
5. 既存送信経路のスパム対策（honeypot・Turnstile・レート制限なし。公開フォームが1つ増える）
6. Wikidata「共同生活援助」のラベル照合（API 429）
7. フォームの実送信（通知メールの到達・`category` 表示・GA4 リアルタイム）＝浦松がプレビューで1件
8. `NEXT_PUBLIC_SR_LAUNCHED=false` の環境では、固定文言の「開設後の労務は四葉社会保険労務士事務所が…受任し」と役割表の未開業ラベルが並ぶ（開業フラグ true が前提）

## 浦松の作業
push・PR・マージ・デプロイ／プレビューでフォーム実送信 1 件（メールのみ・電話のみ・両方の3通り推奨）／GA4 キーイベント登録／GSC 登録（ja の1本）／luck428-column-seo 第3条の表に 1 行追記：

| `/group-home/ooya` | 貸し手の受け皿（募集条件・流れ・専用フォーム） | 物件を貸したい大家・空き家所有者 |

[コンプライアンス自己点検] 判断留保:有（直答直下の留保・役割表・FAQ4〜6・8・根拠表直下）／匿名化:不要（顧客情報なし。事例枠は空）／法令引用:施行日併記済（8法令・e-Gov 2026-09-23 確認）／未検証事項:8件（上記）

**マージと本番反映は浦松が行う。**
