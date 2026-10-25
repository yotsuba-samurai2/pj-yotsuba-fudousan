# ローカル変更計画・検査証跡の受け口

unit5。許可されたローカルJSONだけを使うdry-run CLI。DB/媒体adapter・資格情報・schedulerをimportしない。create/check以外のmodeを受け付けず、全結果が `executable:false`。

```sh
node --import tsx scripts/property-sync/plan-local.ts create \
  --request /private/input/request.json --context /private/input/context.json \
  --out /private/new-plan-directory

node --import tsx scripts/property-sync/plan-local.ts check \
  --plan /private/new-plan-directory/plan.json \
  --reference /private/trusted-copy/reference.json \
  --context /private/input/fresh-context.json --out /private/new-check-directory
```

request/contextは `change-plan.ts` の厳格なschemaに従う。JSONを読んだ後のローカル時計を検査時刻とし、時刻を偽装するCLI flagは設けていない。inputは各8MBまでの通常ファイルのみ。最終path要素のsymlinkを拒否し、FIFO等を読んで待ち続けない。親directoryまで含めたsymlink sandboxや所有者認証を実装したものではない。

作成結果ではplan.jsonとreference.json、全処理でreport.jsonとmanifest.jsonを新規directoryへ保存する。directory 0700 / files 0600。既存directoryは再利用・上書きしない。報告には入力ファイルのSHA-256を記録するが、source本文・住所・画像・ルールの金額・社内報酬を複写しない。入力が不正な場合も元の値やparser詳細を出さず、一般化した保留理由または固定errorを返す。

出力完了のmanifestは最後に書く。途中障害ではOUTPUT_INCOMPLETEとして証跡を残し、自動削除や続きを上書きする再試行をしない。manifestの存在だけを信じず、JSONの完全性と全ファイルhashを確認する。書込み応答の不確実性や電源断時のdirectory fsync保証まで解決したものではない。

終了コード0はローカル出力処理の完了だけを表す。事前照合が通ってもresultはheldであり、媒体操作、募集終了、広告承諾、掲載成功を意味しない。manifestやreportのhashも署名ではない。

plan/referenceを別ファイルへ出すことは、独立した信頼できるplan storeの実装ではない。同じ所有者は両方を書き換えられる。検査時には保管側で保持した参照を渡す契約を維持し、このCLIを本番writerの認可手段として使わない。reportは個別runの検査証跡であり、追記専用監査台帳へ保存済みとは扱わない。

実CLIの7試験に加えて、report/plan/reference/manifestそれぞれの部分書込み障害4試験を実施。障害時に成功を返さず、不完全な証跡を再実行で上書きしないことを検証した。
