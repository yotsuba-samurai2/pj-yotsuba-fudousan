# 日次の住戸入れ替え：媒体別作業票（レビュー用）

**このツールは、担当者が正規画面で確認した事実を保存するだけです。** 四葉・ATBBへの接続、外部送信、広告の反映、予約、通知、REINS巡回は行いません。本番や既存07:00点検への配備はしていません。

## 初回だけ：担当端末と帳簿を固定

Mac/Linux・Python 3.9以上、追加インストール不要。承認された非共有・永続フォルダと担当端末を一つ決める。日付ごとに帳簿を作らない。

```sh
RUNNER=/path/to/scripts/property-sync/rotation-checkpoint.py
LEDGER=/path/to/approved-persistent-folder/rotation.jsonl
python3 "$RUNNER" --ledger "$LEDGER" init
# 上の初回出力の ledgerId を PINNED_LEDGER_ID に一度だけ固定
q() { python3 "$RUNNER" --ledger "$LEDGER" --ledger-id "$PINNED_LEDGER_ID" "$@"; }
```

所有者専用ファイル・固定ID・端末/OSユーザー・ファイル実体を照合する。上書き・欠落・不完全文・通常のコピー・端末移動は停止。他PCで新しい空帳簿を作らない。認証情報、氏名、住所、転載資料、原資料URL、公式IDの元値や受付番号は帳簿へ保存しない。固定種類の根拠・時刻・匿名行、ID対応のハッシュを記録。これは正本台帳や分散ロックではなく、公式画面を施錠しない。

**追記専用。** 開始を同期保存した後で公式画面を操作する。古いバックアップへの差替え、末尾削除、同じファイルを開いて上書き修復はせず、公式画面と受付履歴を読み戻すまで送信停止。切れた追記は拒否するが、境界に合わせて同一ファイルを巻き戻すとローカルだけでは検知できない。共有・別端末の書込み、無人掲載や多人数の排他として使わない。

## 毎日：既存の7時点検 → 公式画面で根拠 → 対象と操作 → 読戻し

1. 固定端末で `q report` を先に実行。読戻し待ちを優先。端末/帳簿が使えなければ、そこで代替送信せず正式な引継ぎ。期限切れの旧ルーチンは起動しない。日時はJSTで記録するが、期限表示だけを募集終了としない。
2. [四葉・物件管理](https://luck428.com/admin/bukken)の「掲載の再確認」→ [賃貸取込・掲載確認](https://luck428.com/admin/bukken/import)で「登録前チェック」→「今回の処理記録を保存（社内用JSON）」。監視対象JSON、取込データ本体、受付ログを入力しない。ATBBは公式「広告する」で現在の自社管理番号・送信状態・更新日と一般表示を別々に確認する。
3. **同一住戸・同一募集回を人が確かめ、公式のIDを先に紐づける。** 四葉は管理正本の `rent-…`（新規なら正規preflightの同一住戸slugを正本一覧と照合し、同一行が別名で登録されていないことを確認）。四葉のUUID単独では別行を作らない。ATBBは本人アカウントの**自社広告管理番号**（元付の物件番号・一般向けページ番号・号室・受付番号ではない）。数字の全半角・先頭ゼロは同一。別名も一つの匿名行にまとめ、明示確認のない組合せは保留する。別のslugまたは番号を発見しても新規/分割で流さず正本の照合に戻る。IDが付く前の案件や四葉の非取込物件に適合する正本キーがない場合はこの作業票で開始せず、通常の正規手順を使い二重操作を避ける。
4. 四葉の当日JSTファイルを `q seed-check "$CHECK_JSON"`。通過は未操作の候補。未紐付けの候補は `incomplete_unbound`。「以前の結果が不明」でslug無し/未紐付けならファイルの取込を失敗として止め、当該の住戸・前取引を公式画面で照合してから再開（空欄やゼロとみなさない）。専用「掲載終了・募集終了」の `ready` と通常チェックの `ready-close` は終了候補。通常の下書きチェックはファイルごと対象外。終了根拠がある行は専用「掲載終了・募集終了」で再チェックする。
5. ATBBなどの行は `queue` で記録。**これは操作許可ではない。** 同一住戸・同一募集回、募集、対象媒体への許諾、写真・間取り等の利用許諾、掲載条件・現在の管理状態を操作直前に公式情報で照合。単一の正規媒体で必要事項を満たせば重複照会しない。**鍵交換費だけ**は、他の必須項目がすべて確認済みで、媒体が金額必須でなく公開文言「確認中（別途かかる場合があります）」を認める場合に限り `terms` としてよい。賃料不明は停止、0円や「不要」で補わない。ATBBは自社の確定枠/残枠も正規画面で照合する。

### ID紐づけ（初めて確認したときだけ）

```sh
q register "$SITE_SLUG" official-site-canonical
# 片側だけのATBBは、四葉に対応行がないことを正本で確認してから
q register "$ATBB_REF" official-atbb-only-record
# 両掲載または別名が同じ募集回の場合は登録を重ねず、同一行に紐づけ
q bind "$ROW" "$ATBB_REF" same-official-episode
q bind "$ROW" "$SITE_UUID" same-official-episode
```

`$ATBB_REF` は `atbb-` に自社管理番号を付ける。双方別行へ仮登録した後の自動統合・置換は不可。関係の確証があっても進行中の履歴を自動で統合しない。既存広告に新番号を付ける運用・別の募集回（四葉の住戸slugが再利用されることがある）は同じ作業票での巻戻しで扱わず、正本での正式な手続きに戻る。無人取得によるID推測はしない。

### 操作と読戻し（実IDの例は保存しない）

```sh
q queue "$ROW" "$MEDIUM" update
q start "$ROW" "$MEDIUM" update origin same-episode admin-current available permission materials terms admin-existing-active
# 成功出力の attempt を控え、直後にその媒体の正規画面で一度だけ処理
q note "$ROW" "$MEDIUM" "$ATTEMPT" accepted receipt
q note "$ROW" "$MEDIUM" "$ATTEMPT" admin-matched same-episode admin-exact-change admin-published
q note "$ROW" "$MEDIUM" "$ATTEMPT" public-on same-episode public-exact-change
q report
```

- `add` は一度も公開されていない対象に限り、`admin-first-listing`。四葉は既存なしを確認、ATBBでは採番済みで未公開の自社掲載行に同じIDで新規公開を行う（存在不明の別行を新規に作らない）。既存・停止済みの記録を新規にしない。停止後の同一記録の更新は、正規の再掲載が可能で最新根拠を満たすときだけ、`admin-existing-active` の代わりに `admin-existing-paused resume-approved` を使用。募集終了が確認済みの募集回は再掲載しない。
- 送信受付を実見し記録できる場合だけ `accepted`。正本で該当の変更と版を特定した場合のみ `admin-matched`。以前から公開されていた別の表示や単なる送信成功を `public-on` にしない。四葉は詳細と関連一覧/学区/サイトマップの反映を、ATBBは一般表示の同一住戸・条件まで確認する。未確認は段階のまま置く。受付を推測で埋める必要はない。
- **保留・一時非公開**：未確認や媒体の広告不可の候補は `hold`。既存で申込・許諾撤回が確認済み、または期限切れ特典・重要条件矛盾で当面修正不能なら `pause`。期限切れ広告を正本で目視した例は `start … pause canonical-ad same-episode admin-current expired-promotion`。四葉は既存を保持した下書き（正規編集。取込のdraftで既存公開を降格させない）、ATBBは該当媒体を停止し、管理読戻しは `admin-draft` / `admin-stopped`。成約とは記録しない。新候補の下書き作成のみは公開件数に数えない。
- **確定した募集終了**：`start … withdraw origin same-episode admin-current ended`。四葉 `admin-ended`、ATBB `admin-stopped`。既に停止保存まで読戻し済みなら同一扱いを再送しない。いずれも一般向けの同じ掲載が実際に止まったと確かめた場合だけ、当該試行に `public-off same-episode public-stop-confirmed`。検索にないだけでは足りない。
- **結果不明を再送しない**：開始・旧送信・受付・管理だけの確認は翌日も同じ試行IDにロック。手元の記録にない送信の同一操作が明瞭な場合は `recover "$ROW" "$MEDIUM" "$OP"` で先の送信不明を記録。最新の管理/受付履歴で該当操作の結果を確定してから `note`。失敗したように見えるだけでは再送しない。正式に未適用と確認できた場合だけ `not-applied same-episode official-final-not-applied` → 改めてキュー・最新根拠。古い試行IDは新しい受付/完了に使えない。`prior-unknown` は旧操作の結果と現状を公式に特定後、`prior-reconciled same-episode official-final-outcome` と公式の現状態（`official-existing-active` / `official-existing-paused` / `official-existing-ended` / `official-never-existed`）を確認。今回の掲載完了には数えない。
- `report` は作業票で**本日JSTに観測した住戸数**。媒体全体の点検母数、残枠、公開数の代わりではない。「作業票に記録なし」を「当日掲載0件確認済み」と報告しない。前日の送信を今日読み戻した場合は、今日の表示確認とし、今日の送信に数えない。

[ATBBの登録・公開ルール](https://atbb.athome.jp/yakkan/touroku_koukai.html) ／ [一括登録サービス（適用・転送時刻は利用システム依存）](https://business.athome.jp/service/ikkatsu_system/)
