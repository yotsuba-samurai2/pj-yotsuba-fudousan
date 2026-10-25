# 読取り試行の開始予約・完了台帳（ローカル）

`read-attempt-registry.ts` はunit18の提案と単一共有fileをつなぐ監査台帳。`local-read-attempt-store.ts` は既存のprivate journal保存処理を利用する。外部reader/SDKは未接続で、全結果`executable:false`。

## 状態と排他

genesisに不変のpolicy/runを保存し、開始予約は現在のrevision/headとのCASで行う。lockを取得し読取りを終えた後の保管側時刻で提案を再計算、`notBefore <= now`と期限・残予算を再検査する。成功すると`started`を先に保存して予算を消費。これは送信前の予約であり、実送信済みや実行許可を意味しない。

開始済みで未完了の試行は、timeout/deadline/プロセス停止だけでは解放しない。送信前に停止した可能性がある場合も保持する。別のstart、開始ID/transport request ID再利用を拒否。

completionは同じrun内の未完了attemptとそのhash（番号・request fingerprint・開始時刻を含む）、記録したactorに一致した場合だけ一度保存。success/failureの競合や他要求の二度目完了は保留。同requestId/同内容の再送は元の結果と**最新**journalを返すが、歴史的なstart成功を外部処理の再送許可に使わない。actorRefはローカルの所有識別子であり利用者認証そのものではない。

## 耐障害と監査

既存private-journal-storeの0600、新規作成のみ、NOFOLLOW/NONBLOCK・8MB制限、cooperative lock、temp/file fsync→rename→directory fsyncを再利用。保存結果不明、同request再照合、fsync障害継続、部分書込み、残留lockを区別。残留lockは自動解除しない。

開始・完了・業務上の保留をhash chainとともに全履歴再生し、当時の保管時刻で待機・予算・期限を検証する。監査最大1,000event、試行最大10。最後の1eventは有効completion専用とし、不正な完了要求や別startで使い切らない。この最終枠に達した保留要求は追記せず容量理由を返す。記録を切り詰めて再開しない。

## 残る接続条件

同じfile/lockを使う協調processのローカル競合を検証した範囲。fileをコピーして別々に使う場合の共通予算、DB/複数hostの排他、最新の許可・SDK設定・分類根拠、実通信、保存と外部送信のexactly-onceは未検証/未実装。hashは署名ではなく、古い完全な台帳の差し戻しを外部anchorなしに検知できない。

結果不明の完了を推測したり、予算を戻したり、新runを自動生成して停止条件を回避する経路はない。新run/方針変更は別の承認済み管理工程に留める。
