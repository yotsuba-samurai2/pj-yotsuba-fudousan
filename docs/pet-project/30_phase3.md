# ペット横断 Phase 3：住宅LP（/pet-housing）と借り手・大家の受付

作成日：2026-09-24／指示書：`00_pet_ecosystem_master_revised_2026-09-24.md`（版2.0）第10〜13・15〜18章
前提の判断（浦松・2026-09-24）：
- D-1 受付テーブルを新設（まずペットの2フォーム）
- 受付データの保存期間は **1年**
- 閲覧できるのは **uramatsujoji@luck428.com の所有者だけ**
- D-3 `/services`＋メニューに掲載（トップの3本柱には足さない）
- 実装計画はプランモードで承認済み

## 0. 結論（先に要点）

- `/pet-housing`（日本語のみ）に、借り手の入口と大家の入口を分けたLPを作った。専用フォームは2つ（借り手・買い手／大家）。
- **マージしても公開されない**。公開フラグ `NEXT_PUBLIC_PET_HOUSING_PUBLISHED`（既定 off）が off の間は：
  - `/pet-housing` は全言語で 404
  - メニュー・`/services`・sitemap・llms.txt にも出ない
- 受付は新テーブル `inquiries` に保存し、**保存できた時点で受付成功**とする。
  - 受付番号はその場の完了表示に出し、URL には載せない。
  - 通知メールの失敗では受付を失敗に戻さず、失敗を記録して管理画面から再送できる。
  - 二重押し・再送は、同じ `idempotencyKey` で1件にまとめる。
- 受付の閲覧・再送は、確認済みの uramatsujoji@luck428.com でログインした人だけ。1年を過ぎた受付は、保存時と一覧表示時に削除する。
- 本番DBへの `inquiries` の作成、公開フラグの設定、GSC への登録は、**いずれも別承認**。

## 1. 作ったもの・変えたもの

**新規**

| ファイル | 役割 |
|---|---|
| `prisma/migrations/20260924060000_add_inquiries/migration.sql` | `inquiries` を作成。RLS 有効、PUBLIC・anon・authenticated の権限を剥奪 |
| 同 `down.sql` | テーブルと適用記録だけを消す取り消し用SQL（手動） |
| `src/lib/shared/inquiry-intake.ts` | 保存期間（365日・「1年」）、隠し欄の名前、連絡先の共通検証（メールか電話のどちらか） |
| `src/lib/shared/pet-intake.ts` | 借り手・大家フォームの項目・選択肢・Zod スキーマ・表示用の行・GA のパラメータ |
| `src/lib/inquiries/categories.ts` | 受付の種類の登録簿。事業者と共有の同意はサーバーが種類から決める |
| `src/lib/inquiries/receipt.ts` | 受付番号（`Y{日本時間の yymmdd}-{4文字}`。0・1・I・O は使わない） |
| `src/lib/inquiries/store.ts` | 保存・重複の扱い・通知結果の記録・1年超の削除・一覧 |
| `src/lib/inquiries/mail.ts` | 事務所宛の通知と自動返信（Resend の `error` を確認、`idempotencyKey` を付与） |
| `src/lib/contact-mail.ts` | 宛先・差出人・`escapeHtml` を既存の `/api/contact` と共用（中身は変えていない） |
| `src/app/api/inquiries/route.ts` | 受付API（`POST`） |
| `src/app/api/admin/inquiries/route.ts` | 受付の管理API（一覧・詳細・通知の再送） |
| `src/app/admin/inquiries/page.tsx` | 管理画面「受付」 |
| `src/components/pet/*` | 借り手フォーム・大家フォーム・入口の CTA・共通部品・送信フック |
| `src/lib/pet-housing.ts` | 公開フラグ・最終更新日・メニュー名・`/services` の1行の単一ソース |
| `src/app/[locale]/(realestate)/pet-housing/page.tsx` | LP 本体 |
| `scripts/inquiries/verify-local.ts` | ローカルの使い捨てDBでの検証（localhost 以外は中止） |

**変更**（いずれも追記のみ）
- `prisma/schema.prisma`：`Inquiry` モデル。
- `src/lib/api-auth.ts`：`verifyInquiryOwner` を追加。既存の `verifyAdminRequest` の挙動は変えていない。
- `src/app/api/contact/route.ts`：定数を共有モジュールから読むだけ。
- `src/components/admin/AdminLayout.tsx`：左メニューに「受付」。
- 掲載先（いずれも公開フラグ on のときだけ）：
  - `src/config/services-nav.ts`：メニュー。ja のみ
  - `src/app/[locale]/(realestate)/services/page.tsx`：4領域の下に1行。ja のみ
  - `src/app/sitemap.ts`：ja のみ。lastmod は最終更新日
  - `src/app/llms.txt/route.ts`：事業一覧に1行
- `src/lib/column-language-links.ts`：言語切替で `/pet-housing` は日本語だけ（翻訳の404を出さない）。

## 2. 設計の要点

**受付API（第12章）**
1. 入口で順に確かめる：本文のサイズ（2万字）→ IP ごとの回数制限（10分に5回）→ JSON の形（strict）→ 受付の種類 → 隠し欄 → 項目の検証（strict・長さ上限）。
2. 同じ `idempotencyKey` の受付があれば、その受付番号を返す（保存・送信をやり直さない）。
3. 1年を過ぎた受付を削除してから保存する。
   - 保存に失敗したら 500（テーブル未作成は 503）。完了表示も完了の計測も出さない。
   - 同時の二重送信は一意制約（P2002）で検出し、先に保存された受付を返す。
4. 通知と自動返信を送り、結果（sent／failed／skipped）を記録する。失敗しても応答は受付成功のまま。
   - 自動返信はメールがあるときだけ送る。受付番号と保存期間を書き、入力内容は繰り返さない。
5. ログには入力内容と Error の本文を出さない（コードと種類だけ）。

**フォーム（第11・12章）**
- 必須：
  - 借り手：受付名、メールか電話、賃貸／購入、希望エリア、動物の種類、頭数（「未定」可）
  - 大家：受付名、メールか電話、物件のエリア、種別、相談内容
- 添付は受けない（図面・写真は受付後に LINE かメール）。
- 四葉行政書士事務所への共有：
  - 来日予定が「ある」ときだけ同意欄を出す。既定は同意しない。
  - 同意なしでは共有しない（欄を閉じた後に残った値でも送らない）。
- 完了はフォームの場所にその場で出す（受付番号・この後の流れ・LINE）。`/thanks` へは移動しない（受付番号を URL に載せない・再読み込みで二重計測しない）。
- GA4：`contact_form_start`／`contact_submit`（サーバーが受付番号を返したときに1回だけ）／`contact_submit_error`。パラメータは `business`・`form_id`・`page` と失敗の種類だけ（入力値は送らない）。入口の CTA は既存の `cta_contact_click`、LINE は既存の `LineLink` を使う。

**閲覧者の限定と保存期間**
- `verifyInquiryOwner`：メールが uramatsujoji@luck428.com と一致し、確認済み（`email_confirmed_at` あり）のときだけ通す。それ以外は 403。
- 一覧を開くたびに1年超を削除。応答は `private, no-store`。通知に失敗した受付は一覧で目立たせ、詳細から再送できる（受付時とは別のキーで送る）。

**LP（第10・13・15〜17章）**
- 指示書 第10章の順：
  1. 入口（借り手／大家）
  2. 見つかりにくい理由と対応範囲
  3. 借り手向けの調査・貸主側への確認・条件の調整
  4. 調査の件数枠
  5. 流れ
  6. 大家向け
  7. 契約上の論点
  8. 手順
  9. FAQ（10問）
  10. フォーム
  11. 会社・担当
  12. 根拠・文責・最終更新
- 第10章の「5 詳細掲載中の物件」「6 現在探している方」は作っていない。対象住戸の確定データと、公開の同意の仕組みがないため（データ・許諾がない節は非表示にする＝第10章）。
- 調査の件数枠（`SurveyCountsPanel`）は `getPublicSurveySummary("bunkyo-rent-pet","ja")` につないだ。公開フラグと媒体の許諾がそろうまでは何も出さない（Phase 2 のゲート）。
- 表現の規律：
  - 入居・飼育を約束する語を使わない。
  - 「ペット相談」を複数飼育可・大型犬可と書かない。
  - 敷金・原状回復を全物件共通の決まりとして書かない。
  - 賃料・入居の見通しを約束しない。
  - 分離受任（独立した事業体・別々にご契約）と「当社は紹介料を受け取りません」を明記する。
  - 判断留保「本ページは一般的な情報提供であり、個別の法的判断は資格者による確認を要します」を置く。
- 渡航手続LP（`/legal/services/pet-travel`）は未公開なので、リンクしていない。渡航手続の業務範囲（Phase 1 報告 U-5）は資格者の確認前のため、具体的には書いていない。
- 構造化データ：
  - WebPage（speakable）・Service（相談無料のみ。価格は書かない）・BreadcrumbList・FAQPage（表示と同じ配列から生成）。
  - 著者欄は、経歴の定型句を含まない版を渡した。
- 法令・公的資料は 2026-09-24 に一次確認（e-Gov 法令API v2／国土交通省の公式PDF）：
  - 宅地建物取引業法 第32条・第34条・第35条第1項・第46条・第47条の2第1項（2026-04-01 施行版）
  - 民法 第601条・第621条・第622条の2（2026-06-24 施行版）
  - 動物愛護管理法 第7条第1項（2026-06-05 施行版）
  - 国土交通省「原状回復をめぐるトラブルとガイドライン（再改訂版）」別表1・本文（「例外としての特約」の例）

## 3. 計画から変えた点（理由）

| 点 | 計画 | 実装 | 理由 |
|---|---|---|---|
| 隠し欄に値がある送信 | 保存せず、成功と同じ応答 | 保存せず、400（一般的な文言） | 成功と同じ応答にすると、偽の受付番号を返し、クライアントが完了の計測（`contact_submit`）を送ってしまう（T19「成功時のみ1回」に反する）。理由は返さない |
| 共有モジュールの場所 | `src/lib/shared/contact-mail.ts` | `src/lib/contact-mail.ts` | `src/lib/shared/` はクライアントから読むファイルの置き場。宛先のメールアドレスをクライアントのバンドルに入れないため、サーバー側に置いた |
| LP の「誰が何をするか」 | 計画の節の一覧になし | 第2節に「対応範囲（誰が何をするか）」の表を追加 | 指示書 第10章 2 の「対応範囲」と第13章の「必要なサービスだけ選べることを示す」を1つの表で満たす。AI の引用で分離受任が落ちにくい |

## 4. 本番に反映する手順（すべて別承認）

1. **マージ**：コードだけが入る。本番DBは変わらない（ビルドは `prisma generate && next build` のみ）。
   - 公開フラグ off のため、公開ページの変化はない（`/pet-housing` は 404、掲載先にも出ない）。
   - 管理画面に「受付」が増える。テーブルが無い間、一覧は 503「保存先が未作成」を返す。
2. **本番DBに `inquiries` を作成**：`rental_survey` と同じ手順で、`20260924060000_add_inquiries` だけを当てる。
   - `DROP INDEX "columns_locales_gin"` は既存のずれで、この変更とは無関係。**含めない・実行しない**。
   - 当てた後に、RLS 有効と、anon・authenticated に権限が無いことを確かめる。
   - 取り消しは `npx prisma db execute --file prisma/migrations/20260924060000_add_inquiries/down.sql --schema prisma/schema.prisma`（受付データごと消える）。
3. **公開**：Vercel の環境変数 `NEXT_PUBLIC_PET_HOUSING_PUBLISHED=true` を設定して再デプロイする（ビルド時に埋め込まれるため、再デプロイが要る）。
   - 公開後に、`/pet-housing` が 200、`/en/pet-housing` が 404、sitemap に ja の1件だけがあることを確かめる。
   - 次に、テスト送信で受付番号・通知・自動返信・管理画面の表示を確かめる。
4. **GSC**：公開と 200 を確かめてから、`https://luck428.com/pet-housing` の1件を登録する（404 の間に出さない）。

## 5. 検証（2026-09-24）

| 確認 | 結果 |
|---|---|
| 変更前の基準（main `2b80c41`） | vitest・tsc とも通過（Phase 3 着手時） |
| 変更後 | vitest 112ファイル・1,628件 通過、`tsc --noEmit` 0件、変更ファイル34本の eslint error 0 |
| 新しいテストが守りを外すと失敗すること | ページの言語判定を外す → 非日本語の404テスト3件が失敗／FAQ に「必ず」を入れる → 表現のテスト2件が失敗／メニュー・sitemap のフラグ判定、言語切替の表を外す → 各テストが失敗。いずれも元に戻して通過 |
| ローカル実DB（`npx prisma dev`・合成データのみ・`verify-local.ts`） | 保存と受付番号の形式、同じキーの再送は同じ受付番号、**同時の二重送信でも保存は1件**、受付番号の一意制約（P2002）、通知失敗の記録、**365日超だけを削除**（364日前は残る）、一覧は新しい順、RLS 有効・PUBLIC に権限なし |
| migration の取り消しと当て直し | `down.sql` → `inquiries` と適用記録だけが消え、ほかのテーブル（学区・調査の合成行を含む）は件数・内容のハッシュとも一致 → `migrate deploy` で再適用 → 再検証も全項目 OK |
| ローカルの `next build`（使い捨てDB・Supabase はダミー値） | フラグ on／off の2回とも成功。`/[locale]/pet-housing` は4言語とも静的生成（日本語以外は生成時点で404） |
| `next start` での実測（フラグ on） | `/pet-housing` 200（title・canonical＝`https://luck428.com/pet-housing`・hreflang は ja と x-default・`<html lang="ja">`・JSON-LD は WebPage／Service／BreadcrumbList／FAQPage、FAQ 10問は表示と同文）。`/en`・`/zh-tw`・`/zh/pet-housing` は 404（404 の title・head にペットの語なし・noindex）。`/services` に1行。言語切替は「日本語」だけ。メニューの項目はクライアントのバンドルに入っていることを確認（メニューは開いたときに描画するため HTML には出ない）。`/api/admin/inquiries` は未ログインで 401 |
| 送信の実測（フラグ on・合成データ・メールのキーなし） | 受付番号を返す → 同じキーの再送は同じ受付番号 → 隠し欄に値があると 400 → 必須不足は項目ごとのエラーで 400。DB には1件だけ保存され、事業者はサーバーが決めた `realestate`、流入ページはクエリ・ハッシュを落とした `/pet-housing`、共有の同意は none、通知・自動返信は failed を記録。ログは「Inquiry notification failed ＜受付番号＞」だけ（入力内容なし）。外部へのメール送信は発生していない（T20・T26） |
| `next start` での実測（フラグ off） | `/pet-housing` 404（head にペットの語なし）。`/services`・sitemap・llms.txt に出ない。llms.txt は変更前と同じ本文（空行の位置も同じ） |

受入テストとの対応：

| 受入テスト | 確認した場所 |
|---|---|
| T12（許諾なしは件数枠を出さない） | `pet-housing-page.test.ts`（既定では件数枠なし・shown のときだけ出る） |
| T15（個人情報を公開面に出さない） | `inquiries-api.test.ts`（ログは文字列だけ）・`inquiries-admin.test.ts`（所有者以外は 403・`no-store`） |
| T16（学区の一覧・ItemList は変えない） | `rental-survey-panel.test.ts`（件数枠を組み込むのは `/pet-housing` だけ） |
| T18（翻訳の無い URL を出さない） | `pet-housing-page.test.ts`（非日本語とフラグ off は metadata・本文とも 404、hreflang は ja と x-default、sitemap は ja のみ、言語切替は ja のみ、渡航LPへのリンクなし）・`sitemap-static-locales.test.ts` |
| T19（成功時のみ1回・重複させない） | `inquiries-api.test.ts`・`inquiries-store.test.ts`・`pet-forms.test.ts`・`verify-local.ts` |
| T20（通知失敗でも受付を維持・再送できる） | `inquiries-api.test.ts`・`inquiries-mail.test.ts`・`inquiries-admin.test.ts` |
| T22（同意なしで共有しない） | `pet-intake.test.ts`・`inquiries-api.test.ts`・`pet-forms.test.ts` |
| T24（GA4 に個人情報を送らない） | `pet-forms.test.ts`（イベントのパラメータは固定値だけ） |
| T26（本番に接続しない） | `verify-local.ts`（localhost 以外は中止）、テストはメール・DB をモック |
| T27（品質・既存ページの回帰） | 全テスト、tsc、eslint、ビルド（下の追記） |

## 6. 残件（浦松の確認事項）

1. **UTM の受付への引き継ぎ（第18章・T21）**：今回の受付テーブルには流入元の列を持たせていない（承認済みの計画の範囲外）。受付に流入元を残すかどうか、残すならどの値を許すかを決めてから追加する。
2. **回数制限はサーバーのインスタンスごと**（既存の `rate-limit.ts` をそのまま使った）。Vercel では複数のインスタンスで数えるため、強い防御ではない。迷惑投稿が増えたら、DB やKVで数える方式を検討する。
3. **渡航手続の業務範囲（U-5）**：LP・フォームは「四葉行政書士事務所がご相談をお受けする」までにとどめた。手続ごとの代理の可否は、Phase 4（渡航LP）で資格者の確認とあわせて決める。
4. **ほかのページからのリンク**（Phase 1 報告 8.3：`/kikoku`・`/global`・学区の賃貸・既存コラム → `/pet-housing`）は Phase 5 で行う。公開前にリンクを張ると 404 へのリンクになるため。

## 7. 範囲外で見つけたこと（別途、判断をお願いする）

1. **既存の問い合わせフォーム（`/api/contact`）は、Resend の送信失敗を見ていない**。Resend は失敗を例外ではなく戻り値の `error` で返すが、`src/app/api/contact/route.ts` は戻り値を確かめずに成功を返す。送信に失敗すると、問い合わせは保存されないまま「送信完了」になり、消える。修正は小さく、別の PR を提案する。
2. **管理APIは「Supabase にログインできる人なら誰でも」通す**（`verifyAdminRequest`）。Supabase の Auth 設定で新規登録が許可されていると、第三者が自分でアカウントを作って管理APIを使える可能性がある。新規登録を無効にすることを勧める。受付（個人情報）だけは今回、所有者のメールに限定した。
3. 本番DBに `property_publication_events` テーブルが無い（IndexNow の通知が止まっている可能性）。
4. 本番の `_prisma_migrations` に、リポジトリに無い `20260715225604_enable_rls` がある。
5. 既存の ja 先行ページ（`/group-home/ooya` 等）は、`/en/...` でも日本語本文を 200 で返す（Phase 1 報告 8.1）。新しい `/pet-housing` は 404 にしたが、既存ページの扱いは別タスク。
