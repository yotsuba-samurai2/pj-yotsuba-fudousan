# 保管済み計画と独立sourceの事前照合

unit10。`preflightStoredPlan(binding, scope, readers)` は読取り専用の接続基盤。readRegistry/readInputsは注入される契約だけを定義し、実DB・媒体・資格情報・writerを実装しない。今回は合成fixtureで検証する。

処理順は、入力の厳格検査→registry全履歴検査と現行参照→binding/scope照合→source読取り→全項目fingerprint→registry再読取り→計画/物件/掲載/ルールの版照合。scopeや募集回が違う、計画が無い/撤回済み/期限切れの場合はsource readerを呼ばない。

sourceはJSON文字列の完全recordとmetadata、媒体状態、ルール履歴を分ける。sourceのcapturedAtが読取り開始より前ならキャッシュ済みsnapshotとして保留する。readerに渡すbinding/scopeはcloneする。例外のメッセージやsource本文・金額・社内情報は返さず、固定理由のみを返す。

入力読取り中にregistryが変わった場合は、置換・撤回だけでなく保留イベントの追加でも停止する。保管側clockの逆行、読取り中の計画失効も保留。観測だけの更新は掲載版に含めず、掲載計画を失効させない。

版の照合が全て通っても、適格性・許諾・画像確認・媒体能力/容量・実行承認・writer fencingの8gateは未実装のまま。`identityChecksPassed:true` とregistry tokenを返す場合も、statusはheld、executableはfalse。照合結果を媒体操作の許可に読み替えない。

## 保証の範囲

readerのcapturedAtや値の真正性は、信頼できるadapterで別途保証する必要がある。古いsnapshotに新しい時刻を付けた入力を関数だけでは見分けられない。registry再読取りの前後で物件/ルールがさらに変更される可能性もあり、最終writerのCAS/transactionを代替しない。古いregistry全体の復元も外部の信頼基点なしには検出できない。

合成24試験は全項目hashから計画・保管・照合までをつなぎ、社内情報だけの変更、公開値変更、媒体観測、途中の台帳変更、reader例外、時刻/期限、scope/募集回、未承認ルール、欠測を確認した。実DBの一貫読取りや外部公開の実証ではない。
