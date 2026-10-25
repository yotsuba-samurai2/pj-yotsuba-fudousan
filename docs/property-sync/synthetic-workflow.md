# 合成1物件の接続フロー（unit29）

既存の計画・入力指紋・台帳・許諾照合・容量予約・媒体監査・公開DTOを、一つのローカルフローで動かす。自社サイトを想定した合成1物件をケースごとに独立生成する。通常CLIの実行先は関数内部のメモリだけで、外部writer/URL/DB設定/入力fileを受け付けない。unit30ではテストコードから媒体監査の保存口だけを注入できるようにし、既存PGliteでSQL保存を検証した。媒体先はmockのまま。新しい実行基盤・DB table・一般writer interfaceは追加していない。

## 実行と証跡

```sh
node --import tsx scripts/property-sync/demo-local.ts --case workflow-all --out /absolute/new/private-output
```

既存CLIの新規dir0700/file0600・排他作成・manifest/hash・file/directory sync・固定errorを再利用。従来の`--case all`は診断5ケースを維持する。`workflow-success`等の単一指定も可。成果物はreport.json/README.md/manifest.json。出力には計画hash・確認hash・監査head・件数・ステップ結果を含め、本文・住所・AD・許諾根拠の生値は含めない。出力成功はmanifest/hashとCLI正常終了で照合する。

## 接続内容

1. 合成sourceを指紋化し、createChangePlanとplan registryで変更前の版とルール版を固定。
2. diagnoseStoredPlanでsource/計画/許諾/容量を照合。未確定はmock先に送らない。
3. 既存capacity journalで1枠を予約。plan reference/binding/source/listingBefore/payloadHash/許諾hash/容量head/target listing hashを合成確認に固定。
4. 保存直前に再診断し、容量をattemptedにする。模擬先は既存media auditでCASとrequestIdの再送を検証し、公開DTOの複製をメモリに保存。ADを含むroot/ネストの内部値は既存allowlistで除く。
5. 模擬先の監査と保存済みDTOを別に読み、元requestId/command hash/actor/時刻/状態hash/版とPC・mobileWebのpayload hashを照合。一致後にだけローカル媒体状態と端末別mock観測を記録。

確認はテスト内の合成acknowledgementで、人の操作承認UIではない。全`executable:false`、既存pendingGatesを保持する。許諾・容量のconfirmed値と賃料123等は合成仮定であり、実事業値・実契約根拠ではない。画像は空のため画像画素検査を行ったことにはならない。公開DTO生成は全面的な掲載適格性判定ではない。

## ケースと期待

| ケース | 期待 |
|---|---|
| workflow-success | 模擬反映1回、PC/mobile一致、媒体監査3イベント |
| workflow-missing-permission | 許諾欠落、送信0 |
| workflow-unknown-capacity | 枠未確認、送信0 |
| workflow-unconfirmed-rule | 未承認ルール、送信0 |
| workflow-unconfirmed-review | 合成確認なし、送信0、予約を保持 |
| workflow-source-conflict | 確認後source変更、送信0 |
| workflow-writer-conflict | 再検査後に競合更新、CAS保留、相手の状態を保持 |
| workflow-duplicate | 同じrequestを2回要求しても反映/対象監査は1回 |
| workflow-request-conflict | 同じrequestIdで内容変更を拒否、初回保存を維持 |
| workflow-response-lost | 保存済みだが応答なし。要求を再送せず読戻しで確認 |
| workflow-response-unknown | 保存応答なし・readerも不通。unknown/attemptedを保持、再送なし |
| workflow-readback-mismatch | mobile内容不一致、照合保留。ローカル観測を成功で埋めない |

report内のmockMutations/mockTargetは検証用の既知の模擬先状態であり、応答不明のcontrollerが成功判定に使う値ではない。応答不明のケースはstatus:unknownのまま。`mockReadbackMatched`も実ブラウザや実公開確認ではない。観測はacquisition:mock、currentMediaObservationは必ず未確認を返す。容量のattemptedを実掲載根拠として解放/消込しない。

## 残る接続

プロセス再起動後の継続、実DB transaction/outbox、実writerのfencing、同一部屋の名寄せ、画像/募集/学区根拠の真正性、人の承認画面、実表示/cache伝播、枠の実消込は未検証/未配線。実行許可は発行しない。71受入の55部分/16未検証は据置きで、合成の結合証跡だけを追加する。

unit30のSQL接続範囲と未検証事項は[ローカルSQL結合検証](local-sql-workflow.md)を参照。
