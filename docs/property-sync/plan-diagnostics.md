# 計画・許諾・素材・掲載枠の結合診断

`plan-diagnostics.ts` は既存の計画事前検査、素材/広告根拠照合、容量台帳を同じ計画参照へ結び付ける。DBや媒体のclientを生成せず、呼出元が許可した読取り関数を注入する。診断だけを行い、保存・予約・公開・削除・通知を実行しない。

## 読取り順序

1. 要求scopeを検証し、capacityのmedia/market不一致は読取り前に拒否。account/category/poolは明示指定し、推測で埋めない。
2. `preflightStoredPlan`で計画台帳→独立source→台帳再読取り。identity一致時だけ許諾/容量へ進み、初期planId/jobVersion/hashと台帳tokenを固定する。
3. 許諾manifest/historyとcapacity journalを読み、受領直後に複製・schema検証。許諾履歴に他物件/媒体/顧客scopeが混ざれば拒否。readerは指定scopeに必要なデータだけを返す契約とする。
4. 許諾・容量をもう一度読み、履歴hash・journal head/sequenceの変化を検出する。古い入力を後の時刻で評価するだけでは取消・他予約を検出できないため、実際に再読取りを要求する。
5. stored preflightを再実行し、初期と同じ計画参照/台帳tokenか検査。新計画のidentity検査が通っても旧許諾と組み合わせない。最終時刻で許諾・予約・容量の期限を再評価する。

全読取り段階の時計逆行、reader例外、途中変更は固定reasonで保留。受領済みの共有objectを後続readerが変更しても、初期観測を差し替えられない。

## 結果の意味

`diagnosticComplete:true`はこの読取り診断が終了したことだけを示す。各検査の一致・不一致とは別。identity一致、許諾の申告根拠一致、容量の未予約/予約一致/保留を個別に返す。空き枠は予約ではない。自予約で残枠0でも追加枠を二重加算しない。予約IDは計画参照/phase/期限/設定版に一致する必要がある。update/replace/unknownはnew_listingへ読み替えない。

返却はallowlistで固定reason・hash・検査時刻・pending gatesだけを構成。原物件、内部報酬、許諾本文、素材manifest、容量journal、reader例外をspread/返却しない。

## 未解決境界

複数storeの読取りは原子的ではない。最終再読取りの後や他store読取り中の変更を防ぐ最終writer fenceは未実装。真正性・素材一覧の完全性・画像画素の検査・実契約とpoolの対応・適格性・実行承認を証明しない。既存8gateにこれらのpendingを残し、全結果`executable:false`。実reader/CLIへの接続は別単位であり、本番接続を追加したものではない。
