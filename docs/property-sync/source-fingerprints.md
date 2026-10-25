# 完全なsource snapshotのハッシュ境界

unit6。`fingerprintPropertySnapshot(recordJson, metadataJson, now)` は、許可されたsourceのJSON文字列と読取りmetadataのJSON文字列から、変更計画用の物件版を作る純粋関数。DB・媒体を読み取らず、返却値は常に `executable:false`。

現行Propertyの22項目をcamelCaseで全て要求し、任意項目も省略せずnullを明示する。internal、翻訳、画像情報を含む全項目と未知の追加項目をhash対象にする。id/updatedAtだけの部分取得を完全なsnapshotとして扱わない。objectのkey順は正規化し、array順・null・追加項目の違いは保持する。hashはSHA-256、入力prefixは `yotsuba-property-source:v1\n`。

任意のJavaScript objectは受け付けない。Proxy、getter、toJSON、Date/Map等の暗黙変換で項目を落とす経路を作らないため、recordとmetadataとも文字列だけを処理する。JSON内の重複keyはescaped表記も含めて拒否する。数値はparse前の10進値と再serialize値が一致することを要求し、桁落ち・overflow・underflow・負の0・安全な整数範囲を超える値を保留する。100と1e2など値が等しい表記は同じhashになる。

1入力8MB、深さ32、走査token/展開node各100,000を上限とする。巨大・深い入力は全体JSON.parseの前にも検査する。エラーは固定理由だけを返し、元の住所・説明・画像・翻訳・社内情報を返却しない。正常時もproperty/episode/market、source参照、読取り時刻、updatedAt/fullHashだけを返す。

## 未解決の信頼境界

この関数は入力の真正性、取得許可、広告承諾、業務適格性、最新読取りを証明しない。22keyが存在しても、呼出し元が値を落としてnullや空objectへ置換した場合を判別できない。入力前のJSON.stringifyでDate/BigInt/高精度数値を変換・喪失した結果も復元できない。将来のDB adapterは、許可された取得範囲、全列の明示対応、Date/BigInt等の正規化と精度、読取り時刻を別途検証する必要がある。

既存hashからこのprefix付きhashへの置換や本番backfillは行わない。異なる正規化版のhashを比較すると同じupdatedAtでも競合になるため、移行は別のレビュー・承認・再検証の対象とする。既存の公開内容hashや媒体観測hashとも混用しない。現在の変更計画、CLI、DB adapterへの自動接続は未実装。

合成fixture49試験で差分、重複key、数値精度、JS trap無実行、入力上限、時刻・ID・必須項目を検証した。実データの追加取得や実DB変更は行っていない。
