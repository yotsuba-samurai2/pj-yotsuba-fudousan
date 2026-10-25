# 変更計画の現行参照と監査

unit7。`plan-registry.ts` はローカルの純粋関数。1つのproperty/募集episode/mediaに対する計画の登録・置換・撤回を管理し、全結果 `executable:false`。計画の登録を業務承認や公開成功として扱わない。実DB・媒体writerには接続していない。

`createPlanRegistry(binding, createdAt)` は空の履歴から開始する。任意の現行計画や途中stateを開始点にしない。全体/個別顧客のscopeは計画内に保持するが、同じ媒体targetの計画は同じ系列を競合する。別scopeを理由に同じ部屋のjob1を並立させない。

`appendPlanRegistry(journal, request, now)` は、actorの不透明参照、request UUID、元時刻、期待するregistry revision/headHashを受け取る。nowは要求と別の保管側clockであり、eventのrecordedAtに保存する。未来の要求は追記前に拒否し、計画の期限は受信時刻で判断する。元時刻を昔にして期限切れ計画を登録することはできない。replayでもrecordedAtを使う。registerは計画そのものとexpectedActive（初回・撤回後はnull、置換時は現行reference）を照合する。登録成功時のみjobVersionが厳密に+1となる。撤回後も最後のjobVersionと過去に使ったplanIdは保持し、リセットしない。期限切れ計画も現行referenceを指定した置換は可能だが、期限切れによる自動削除・旧版への復帰はない。

revokeは対象referenceを照合する。遅れて届いた旧計画への撤回が新計画を撤回しない。計画の撤回はregistry内だけの操作で、募集終了や媒体からの取下げを意味しない。

同じrequestId・内容・actor・元時刻・CAS tokenの再送は履歴を追加せず、現在のjournalと元の歴史的outcomeを返す。元のoutcomeがregisteredでも、その計画が現在有効とは限らない。現行参照は必ず `activePlanReference(journal, expectedBinding, now)` で別に取得する。撤回済み・期限切れ・未来の履歴・別targetは保留する。

## 監査と競合

保留となった有効なcommandも記録するため、registry revisionは各イベントで進む。jobVersionは登録成功だけで進む。保留後も古いCAS tokenを使い続けず、保管側を再読取りする。不正なschema・未知ネストや時刻逆行等の入力は固定errorだけを返し、監査へ生値を複写しない。

全イベントの連番、requestId重複、時刻順、CAS、遷移結果、前後state/hashを空の開始点から再生して検証する。1000イベントを上限とし、履歴を切り捨てて継続しない。金額・本文・画像データは計画に含まず、固定schemaの計画metadataと監査だけを保持する。

## 残る境界

hash chainは署名や外部の信頼基点ではない。古い履歴の完全コピー、全体を書き換えて再hashした履歴、同じ開始点から分岐した履歴を単体では区別できない。ここでの現行とは「渡された履歴内の現行」であり、信頼できる保管先からの最新読取り・排他保存は後続adapterの責任。元時刻やactorRefも認証済みの本人性を証明しない。

最新episodeとの照合、計画前検査後のCAS、writer fencing、8つの業務/権限gate、別権限での監査保管は未実装。計画登録や参照取得だけで実行可能に昇格しない。
