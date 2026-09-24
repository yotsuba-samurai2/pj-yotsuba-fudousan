# ペット横断 Phase 2：調査データの保存分離・許諾ゲート・公開集計・共通表示部品

作成日：2026-09-24／指示書：`00_pet_ecosystem_master_revised_2026-09-24.md`（版2.0）第4〜9・20章
前提の判断（浦松・2026-09-24）：
- D-1 受付テーブル新設（Phase 3 で実装）
- D-2 ペット調査は学区と別の保存先
- D-3 `/services`＋メニュー（Phase 3/5）
- D-4 「平均2倍以上」を削除（本 Phase で実施）
- D-5 指示書どおり Phase 2 から

## 0. 結論（先に要点）

- ペット調査は**新テーブル2つ**に保存する。学区の `school_rental_feeds` と、その読み書き経路は一切変えていない。ローカルの実DBで、保存・確定・同時確定・巻き戻し・`down.sql`・当て直しの前後とも、学区の行が完全一致することを確認した。
- **既定では何も保存・表示されない**。許諾台帳は空（＝全媒体・全用途を拒否）で、公開フラグも既定は空。確認済みの媒体許諾がまだ無いため（Phase 1 報告書 第7章）。
- 表示部品 `SurveyCountsPanel` は作ったが、**どのページにも組み込んでいない**（Phase 3・5 で組み込む）。公開ページで変わったのは、学区の比較一覧の相談枠の文言（D-4）だけ。
- 本番DBへのマイグレーション適用・許諾台帳への記載・公開フラグの設定は、**いずれも別承認**。マージしただけでは本番DBは変わらない（ビルドは `prisma generate && next build` のみ）。

## 1. 作ったもの

| ファイル | 役割 |
|---|---|
| `prisma/schema.prisma`（モデル追加のみ） | `RentalSurveyBatch`（取得バッチ・追記のみ）、`RentalSurveyFinalization`（確定ログ・追記のみ） |
| `prisma/migrations/20260924030000_add_rental_survey/migration.sql` | 2テーブル作成＋RLS 有効＋anon/authenticated の権限剥奪（学区の migration と同じ形） |
| 同 `down.sql` | 2テーブルと適用記録だけを消す取り消し用SQL（手動） |
| `src/lib/rental-survey/scope.ts` | scope の登録簿（`bunkyo-rent-pet` 版1）。未知・現行でない版・学区 scope は拒否 |
| `src/lib/rental-survey/pet-terms.ts` | ペット条件の型（複数飼育・動物種・頭数・大型犬・条件・根拠原文）と対象判定 |
| `src/lib/rental-survey/batch.ts` | バッチと観測行の検証（最小項目・strict・件数突合・重複ID・上限3,000行／5MB） |
| `src/lib/rental-survey/permissions.ts` | 許諾台帳（コード内の定数・空＝全拒否）と判定 |
| `src/lib/rental-survey/units.ts` | 住戸の同一性・矛盾・募集状態・ペット対象 → 確定用 snapshot |
| `src/lib/rental-survey/finalize.ts` | 確定・巻き戻しの可否（DBに触れない純粋関数） |
| `src/lib/rental-survey/summary.ts` | 公開用の集計（X／Y／Z）と公開条件 |
| `src/lib/rental-survey/store.ts` | 保存層（scope・版で必ず絞る。テーブル未作成時の扱い） |
| `src/app/api/admin/rental-survey/route.ts` | 管理API（`save-batch`／`finalize`／`rollback`、各 `dryRun`、GET はメタ情報のみ） |
| `src/components/rental-survey/SurveyCountsPanel.tsx` | 「今回の調査で確認した対象物件」の表示部品（4言語・未組込み） |
| `scripts/rental-survey/verify-local.ts` | ローカルの使い捨てDBでの検証（localhost 以外は中止） |
| `src/components/gakku/RentalComparison.tsx` | D-4：相談枠から「平均2倍以上」を4言語とも削除 |

## 2. 設計の要点

**保存（第4章）**
- バッチは「1 scope × 1 媒体 × 1 回の取得」で、追記のみ。
  - `verified` は宣言した検索条件の全ページの結果で、`expectedCount` と件数を突き合わせる。ペット対象での絞り込みはしない。
  - `incomplete`／`failed` は状態と理由だけを残し、観測行は持たない。確定には使えない。
- 観測行は最小項目だけを持つ：物件ID、建物・号室・所在地、募集・申込とその原文、ペット条件。賃料・広告可否・画像は持たない（未知の項目は拒否）。
- 確定は、対象媒体すべての `verified` バッチが1つずつそろい、観測期間の幅が7日以内で、現在の確定より古くないときだけ行う。
  - 確定時に対象住戸 S を計算し、照合用の最小項目と除外理由別の件数を snapshot として確定ログに1行足す。
  - 公開時はバッチを読まず、この snapshot だけを使う。
- **楽観ロック**：確定・巻き戻しは `sequence = expectedSequence + 1` で追記し、`(scopeId, scopeVersion, sequence)` の一意制約で同時確定を検出する（409）。
- **巻き戻し**：同じ scope・版の過去の確定を写した行を足す。同一性判定の版が古い確定、許諾を失った確定には戻さない。
- バッチの削除は作っていない（巻き戻しが参照するため）。保存期間（U-4）を決めてから作る。

**住戸（第5章）**
- 学区と同じ関数（`sameUnit` 等）を使う。
- 号室ごとに分けて総当たりで照合する。次のものは**確認待ち**として件数に入れない：
  - 号室が無い
  - 同じ所在地・号室で建物名が違う
  - 所在地の前方一致が推移的でない連鎖
- 媒体間で確定的な値（募集・申込・複数飼育・大型犬・動物種・頭数）が食い違えば、その住戸は除外する。未確認の値は矛盾として扱わない。
- 申込状態は学区と同じルールで、緩和しない。

**ペット条件（第6章）**
- 対象は「複数飼育 可・相談」または「大型犬 可・相談」の和集合。
- 「ペット相談」だけでは対象にしない。可・相談・不可を確定するには根拠の原文が要る。

**許諾（第7章）**
- 用途は `store`（内部保存・加工）／`aggregate`（集計公表）／`ad`／`image`／`sns` に分け、別々に確認する。
- 保存と確定には `store`、公開には全媒体の `store` と `aggregate` の両方が必要。
- 許諾が一部の媒体だけに欠けても、許諾のある部分だけを出すことはしない。全体を hidden にする（差分から推測させないため）。
- 撤回は、新しい `validFrom` を持つ `revoked` の行を足して表す。同じ時刻に確認済みと撤回があれば拒否側を採る。

**公開（第8・9章）**
- 定義：X＝|S|、Y_l＝S のうち言語 l で当サイトに詳細掲載中、Z_l＝X−Y_l。
- V_l は公開面と同じ判定で作る（`toPublicProperty` → `isPubliclyVisible`：公開中・確認期限内・その言語）。
- 住戸と掲載物件の対応が1対1で決まらなければ、Y・Z は出さず X だけを出す。
- 次のどれかに当たれば数値枠を出さない（hidden）：未確定、テーブル未作成、フラグなし、許諾不足、同一性判定の版の不一致。確定済みの0件は「0件」と出し、調査範囲での結果であることを添える。
- 募集終了で自社物件を非公開にすれば、次の確定を待たずに Y から外れる。X は確定した観測期間の値のまま。

## 3. 指示書どおりにしていない点（理由）

| 点 | 扱い | 理由 |
|---|---|---|
| 少数抑制（第7章・Phase 1 報告書 第7章の閾値案） | 区全体の X／Y／Z には掛けない | 内訳（町別・動物種別）を出さず、許諾が一部欠ければ全体を hidden にするので、差分から推測される情報がない。Y=0 を隠すと「詳細非掲載も含めて相談」という導線そのものが消える。閾値（U-4）は、内訳を出す将来の Phase で適用する |
| 広告不可の件数（第8.1章） | 算出も表示もしない | Z に含まれる旨を注記するだけにした。観測行に広告可否を持たない（データ最小化）ので、`excluded.length` の流用も起こらない |
| 前週比（第9章） | 作らない | 表示しないため。版が違う確定どうしは比較しない前提で、scope に版を持たせてある |

## 4. 本番に反映する手順（すべて別承認）

1. **マージ**：コードだけが入る。本番DBは変わらない。
   - テーブルが無い間、公開面は hidden、管理APIは 503「保存先が未作成」を返す。
   - 表示部品はページに組み込まれていないので、公開ページの変化は D-4 の文言だけ。
2. **マイグレーションの適用**（承認後）：学区の migration（20260923070000）と同じ手順で、`20260924030000_add_rental_survey` だけを当てる。
   - `prisma migrate diff`／`migrate dev` が出す `DROP INDEX "columns_locales_gin"` は既存のずれ（手書きの GIN インデックスが `schema.prisma` に未宣言）で、この変更とは無関係。**含めない・実行しない**（本番の検索用インデックスが消える）。
   - 取り消しは `npx prisma db execute --file prisma/migrations/20260924030000_add_rental_survey/down.sql --schema prisma/schema.prisma`。2テーブルと適用記録だけを1トランザクションで消す。
     - 適用に成功した migration には `prisma migrate resolve --rolled-back` が使えない（P3012）ため、適用記録の削除を down.sql に含めた。
3. **許諾台帳への記載**：媒体ごと・用途ごとに書面回答等を確認し、`permissions.ts` の `DATA_USE_LEDGER` に PR で追加する。
   - `evidenceRef` には所在だけを書き、個人名・会員ID・パスワードは書かない。
   - 媒体名の表記許可がある場合だけ `attribution` を入れる。
4. **取込**：許諾が確認できた媒体について、取得手順を決めてから管理APIに投入する（取込用の管理画面UIは未作成）。対象媒体の組み合わせを変えるときは scope の版を上げる。
5. **公開**：Vercel の環境変数 `RENTAL_SURVEY_PUBLIC_SCOPES=bunkyo-rent-pet:1` を設定して再デプロイする。表示部品のページへの組み込みは Phase 3（住宅LP）・Phase 5（学区）で行う。
- **撤回を把握したとき**：急ぐ場合は公開フラグを外して再デプロイする（数分で hidden になる）。あわせて、台帳に `revoked` の行を足す PR を出す。

## 5. 検証（2026-09-24）

| 確認 | 結果 |
|---|---|
| 変更前の基準（main `e1d692c`） | vitest 94ファイル・1,389件 通過、tsc 0件 |
| 変更後 | vitest 104ファイル・1,532件 通過、`tsc --noEmit` 0件、変更ファイルの eslint error 0 |
| D-4 の再発防止テスト | 修正前の部品では4言語とも失敗、修正後は通過 |
| 読み返しで直した2点（ログにデータを出さない／同時刻の撤回は拒否） | 修正前のコードでは新テストが失敗、修正後は通過 |
| ローカル実DB（`npx prisma dev`・合成データのみ・`verify-local.ts`） | 既存6件＋新 migration の適用、RLS 有効、失敗バッチは観測行なし、同時確定は1件だけ成功、古い番号の再確定は拒否、巻き戻しは追記、**学区の行は全工程で完全一致** |
| migration の取り消しと当て直し | `down.sql` → 2テーブルと適用記録が消え学区は不変 → `migrate deploy` で再適用 → 再検証も全項目 OK → もう一度 `down.sql` でも学区は不変 |
| スキーマと migration の差 | 残る差分は既存の `columns_locales_gin`（上記）だけ |
| 未実施 | ローカルの `next build`（Vercel のプレビュービルドで確認する）、実DB・会員画面・媒体への接続（範囲外）、表示部品を組み込んだページの描画（組み込みは Phase 3・5） |

受入テストとの対応：

| 受入テスト | テストファイル |
|---|---|
| T01 | `rental-survey-store.test.ts` と `verify-local.ts` |
| T02 | `rental-survey-scope.test.ts`・`rental-survey-api.test.ts`・`school-rental-feed-api.test.ts` |
| T03 | `rental-survey-finalize.test.ts`・`rental-survey-store.test.ts`・`verify-local.ts` |
| T04 | `rental-survey-scope.test.ts`（既存の `school-rental-feed.test.ts` は無変更で通過） |
| T05・T06 | `rental-survey-units.test.ts` |
| T07 | `rental-survey-pet-terms.test.ts` |
| T08〜T11・T14 | `rental-survey-summary.test.ts`・`rental-survey-finalize.test.ts` |
| T12・T13 | `rental-survey-permissions.test.ts` |
| T15・T16 | `rental-survey-panel.test.ts`（既存の `gakku-itemlist.test.ts` は無変更で通過） |

T17 以降は Phase 3〜6 で扱う。

## 6. 残件（浦松の確認事項）

1. **版1の対象媒体**：REINS・ATBB・itandi・いい生活の4つにしている。許諾が一部の媒体だけになったら、その組み合わせで版2を作る。
2. **戸建てなど号室の無い住戸**：指示書 第5章どおり確認待ちで除外するため、大型犬向けの件数は少なく出る。手動で同一性を確認する仕組みは、許諾が確定してから作る。
3. **保存期間**と、それに合わせたバッチの削除（U-4）。
4. **取込用の管理画面UI**：許諾が確定してから作る。
5. 既存のずれ `columns_locales_gin`（schema.prisma に未宣言）は、本件とは別に解消した方がよい（`migrate dev` を使う人が誤って消す危険がある）。
