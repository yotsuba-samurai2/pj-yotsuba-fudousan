# 合成データの結合診断デモ

このCLIは架空の物件・ルール・許諾・掲載枠をメモリ内に生成し、unit20の診断coordinatorへ渡す。外部入力ファイル、実DB、媒体、認証情報、環境のDB接続設定を読まない。実連携が動作した証拠や、現行の業務ルールとして使用しない。

```sh
node --import tsx scripts/property-sync/demo-local.ts --case all --out /absolute/new/private-output
```

出力先は既存でないディレクトリを指定。`all`のほか下表の単一ケースを指定できる。プロセスの実時計で合成snapshotを生成し、その時刻を記録する。実DBの取得時刻をローカルfile読取り時刻へ置き換える機能はない。

| ケース | 合成操作 | 期待結果 |
|---|---|---|
| baseline | 条件を申告済みと仮定 | 診断完了・未予約・全実行gate保留 |
| missing-permission | 許諾履歴を空にする | `PERMISSION_MISSING`、根拠一致false |
| unknown-capacity | 枠数と確認状態を未確定にする | `CAPACITY_CONFIG_UNCONFIRMED` |
| changed-source | 初期検査後に合成物件を変更 | `SAME_TIMESTAMP_HASH_CONFLICT` |
| changed-plan | 初期検査後に合成計画を差替え | `PLAN_CHANGED_DURING_DIAGNOSTIC` |

## 成果物と完了の意味

- `report.json`：各ケースの期待reason/checks、実際の診断、期待一致。全件に`sourceOrigin: synthetic_generated`、`purpose: diagnostic_demo`と実設定/実許諾/実接続未検証を記録。
- `README.md`：合成である旨とケース結果の短い説明。
- `manifest.json`：最後に作成し、report/READMEのSHA-256を記録。`outputComplete`はファイル生成の意味だけ。directory fsync失敗ならCLIは失敗するため、manifest存在だけでは永続化成功を認めず、成功終了とhash照合も確認する。

`expectedResultMatched`、`diagnosticComplete`、`outputComplete`を混同しない。どのケースも`executable:false`。期待一致はこの公開された合成デモの一致であり、独立holdout/全受入合格/本番での効果を意味しない。

新規dir0700/file0600で保存。既存出力は拒否し、部分書込みや同期結果不明を自動削除・上書きしない。終了コード0は出力成功かつ合成期待一致、1は入力/実行/保存エラー、2は出力済みだが期待不一致。未知case・不要引数を拒否し、生の引数や例外本文をstderrへ出さない。
