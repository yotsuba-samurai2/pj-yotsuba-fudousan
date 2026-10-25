# 版を固定した媒体掲載希望の変更計画

2026-10-24 unit4。ローカルの純粋関数のみ。物件本文・価格を更新したり、媒体へ反映したりする機能ではない。

`createChangePlan(request, context, now)` は、scope、ルールfamily/id/version/hash、物件sourceのupdatedAt/fullHash、property/episode/media、媒体掲載revisionと掲載内容hash、掲載希望・媒体ID、作成/失効時刻、planId/jobVersionを固定する。ルールの金額や社内報酬の値、物件本文は計画へ複写しない。適格性判定・広告承諾・公開成功を意味しないため、作成結果も `executable:false`。

`preflightChangePlan(plan, freshContext, expectedReference, now)` は最新の履歴でルールを再選択し、全scope・変更前の版・期限を照合する。最新版の未承認/撤回/失効/必須値未確定から旧版へ戻らない。`expectedReference` は保管側のplanId/jobVersion/hashであり、計画JSONに同梱された自己申告hashで代用しない。新しいjobが発行されたら保管側参照を更新することが必要で、古い参照を呼出し側が使い続ける場合に旧jobを自動判定する仕組みではない。

## 読取りと信頼境界

媒体側の `listing.propertyVersion` は参照であり、手動変更の検出には独立した物件source snapshotが必要。同日時でもfullHashが変われば競合とする。fullHashは許可された元snapshot全体から正規化adapterが計算する前提で、IndexNow用の公開内容hashを流用しない。

この関数がDBへ読みに行くことはない。`capturedAt >= createdAt` を要求するが、同時刻のcontextを後で再利用しても関数だけでは新しい読取りを証明できない。信頼できる読取りadapterと、将来の保存直前CAS/transactionが必要。照合と保存の間の競合を解消したものではない。

観測は掲載計画のhashに含めない。観測追記だけで計画が失効することを避ける。現在の計画は観測を適格性判断に使わないため、mock/unknown/staleの観測があっても公開成功へ昇格しない。将来、観測や承諾を判断に使う段階では、その根拠のID・版・期限も個別に固定する。

## 保留と残件

版照合が全て通った場合も `status:held` / `identityChecksPassed:true` を返す。以下8gateは未実装として残す。

- 物件のルール適格性（学区、間取り、報酬税区分等）
- 取得元の許可
- 広告承諾
- 画像・本文素材の公開確認
- 媒体の正規連携能力
- 掲載枠
- 実行の承認
- writer lease/fencing

取下げ希望もこの保留を免れない。単なる条件外、情報欠落、確認期限超過を募集終了や停止許可に変換しない。家賃等の有効な業務値は今回も出荷しない。既存 `minLayoutRooms` だけでは「2DK以上」のDK/K等の区別を表現できないため、適格性gateの実装前に条件モデルと評価仕様を確定する必要がある。

計画保存・保管側参照の永続化・監査への接続は後続。現行media auditは計画を受け付けず、今回の事前照合を監査記録済みとは呼ばない。未知キーや不正入力は一般化した理由だけを返し、生値をエラーへ含めない。

合成試験42件で、計画変更/再hash、旧job、手動物件変更、掲載変更、観測追記、ルール変更/失効/期限境界、顧客/媒体/募集回の混入、未知ネストの非流出を検証。独立レビューも42件合格、重大な未解消指摘なし。これらは本番の実行・公開成功・承認ID真正性の検証ではない。
