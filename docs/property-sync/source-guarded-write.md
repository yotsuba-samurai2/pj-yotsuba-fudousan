# 保存前の物件source照合（unit51）

四葉サイトの既存 `properties` を正本として維持する。unit49の照合で確認した `updatedAt + fullHash` を、既存writerの保存直前にも検査するための最小接続。

## 契約

- `createPropertyWriteRequests` のサーバー側入力に任意 `expectedSourceHash`（64桁小文字hex）を追加。省略した既存要求のhash計算・receipt・HTTP/ブラウザ契約は変更しない。
- 指定したhashは要求hashにも含む。同一requestIdで変更・省略した再送は競合。空文字・nullを省略扱いにしない。
- 既存の要求lock→物件行lock→receipt照合の順序を維持。既存receiptの復旧を優先し、新規書込みだけsourceを再読取り。更新日時またはsourceが違えば既存の `VERSION_CONFLICT` として受付を保存する。
- 保存・receipt・既存の模擬後処理は同じtransaction内。外部取得・通知・モデル判断をlock中に追加しない。
- `resultHash` と復旧結果の `current` は既存のAdminProperty投影に対する判定。新しいsource hashによる現在DBの再証明ではない。

## DB読取りの正規化

`readPropertySourceRecord` は明示されたID1件だけを、注入されたDB client/transactionの権限内で読む。接続情報・全件取得・別DBへのfallbackは持たない。

既存22列をSQL内でcamelCase JSONテキストへ変換し、DBのNULLを明示、日時は既存のUTC `timestamp(3) without time zone` 契約でISOミリ秒表記にする。未知列・日時型/精度の変更・紀元前/10000年以上は保留。SQL NULLとJSON nullはいずれも従来source正規化のJSON nullであり、ストレージの物理的同一性を保証するものではない。

JSONBの小数やBigIntをPrisma/JavaScriptで丸める前に文字列として取得し、既存のbounded JSON scannerで非可逆数値・大きすぎる入力等を拒否する。`fingerprintPropertySource` をsnapshot生成とwriterで共用し、hashのために架空の募集回や媒体を生成しない。原文JSONは社内限定の一時値で、公開API・ログ・証跡へ出さない。

## 検証と接続境界

既存の隔離Postgres harnessに `--source-guards` を追加。合成1物件・媒体2行・媒体監査3行＋受付最大7行だけで、メール候補→unit49名寄せ→**合成fixtureで明示した下書き価格変更**→保存/復旧を検証する。掲載済み物件の採用、実メールの自動書込み、媒体反映の成功を意味しない。

同一日時の社内編集、source条件の差替え、JSONB高精度値、安全整数超過、NULL/空object、日時境界、保存途中失敗、応答喪失、新接続からの復旧、同一要求/競合要求の実DB lock、媒体状態非干渉と公開投影を対象にする。

**本番メール保存ルートは未接続。** `expectedSourceHash` は同一正本の競合検出であり、候補/名寄せ根拠の権限・現在の募集回・項目確認・採用条件・広告/素材許諾を代替しない。未確認の候補は依然として `executable:false`。本番接続時はこれらを検査する入口でhash必須とし、既存の手動編集互換用の省略を自動取込へ転用しない。

新規DB・schema migration・権限変更・外部送信は本番へ追加しない。既存13変更と単位別差分を保持する。

## 結合で見つかった互換性修正

unit49の住所/建物/号室の検査が、passthroughで保持する既存sourceの賃料・募集確認objectやnullまで文字列として処理していた。実際の既存source構造を持つ合成入力で失敗を再現し、対象3項目だけの検査へ修正した。非公開の根拠は引き続き結果へ返さない。
