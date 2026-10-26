# 確認記録の登録・撤回（unit56）

## 目的と境界

既存 `properties` を正本とし、物件IDを保持する。確認記録の登録では物件本体・媒体状態を変更しない。
登録済み記録は unit52/53 の既存writer/readerへ接続できる。今回の実装はローカルの合成データで検証し、
本番route、実メール取得、ATBB操作、通知送信、権限変更、DDL適用は行っていない。

`createMailReviewCommands` と `createMailReviewHttpHandler` は注入型の接続口であり、Nextの公開routeではない。
実運用では既存 `verifyAdminRequest` による本人確認と、非公開の準備記録readerの接続が必要。
クライアントが送るのは要求ID・物件ID・review参照/hash・操作・期待版/hashのみ。rawメール・patch・承認flag・actorは受け取らない。
actorは確認済みUIDから `admin:<uid>` とし、recordのoperator/reviewerとも本人に一致させる。
他の担当者の承認や権限喪失後の管理者代行撤回は今回のAPIに含めない。

## 登録・撤回・照合

- 登録前にサーバーの準備記録を読み、完全hash・サイズ・重複JSONキー・物件/本人を検査する。
  DBの7種類の現行根拠（operator/reviewer/募集回/rule/policy/許諾/素材）が揃い、期限と内容が一致しなければ保留。
  この処理は7根拠を作成・補完・延長しない。素材の実画素確認・権利判断をhashだけで済ませない。
- 物件の行lock下で、既存writerのpatch正規化とunit52の完全source/採用/用途別許諾検査を共用。
  `mail_review_records`、kind=`review`のhead、`mail_review_events`の3点を一括保存する。
  配信元の明示したサイト再配信禁止は、普通の採用/広告/素材承認で上書きできない。
- 撤回は現在の本人読取り権限・reviewer権限とheadのCASを検査する。物件変更やreview期限切れを理由に撤回を止めない。
  同じ参照を再登録・復活させない。監査INSERT後の時刻が確認時刻より前、または権限期限以降なら全rollback。
- request advisory → review-ref advisory → property行 → kind/scope順のauthority行でlockする。
  外部readerはtransactionの外で実行する。prepared reader障害でも保存済み要求の照合はできる。
- request hashには操作・本人・対象・参照/hash・期待版/hashを含める。同一IDで変更した要求は競合。
  不明なCOMMIT結果を自動再実行せず、元の要求を `reconcile` で照合する。
  `recorded` は監査の保存結果であり、現在の掲載許可を表すものではない。
  `current` は保存されたhead版/hashとの一致のみを表し、有効期限内や広告許可を保証しない。
  後から撤回された登録の受領記録は `current: changed` となる。実保存時は既存writerが全根拠を再検査する。

## 監査・権限

新規SQL案は `proposals/mail-review-commands.sql`。unit53の2table案に依存する。
監査には要求ID、対象参照、本人、hash、操作、前後版、固定結果、時刻だけを保存し、本文・画像・AD情報は含めない。
失敗した事前検査は確定操作の監査行を作らない。拒否履歴の別保存は今回の範囲外。
監査はINSERT/SELECTのみとしUPDATE/DELETEはtriggerでも拒否。PUBLIC/anon/authenticatedへの既定権限をREVOKEする。
RLSを有効化するが、SQL案は実行role/grant/policyを自動発行しない。
実行roleは所有者・BYPASSRLS・schema作成権限を持たず、TRUNCATE/DELETEを持たせない。
headの更新はkind=`review`のみ。他の根拠は確認済みの別経路で管理する。
試験用ownerの清掃TRUNCATEは、所有確認済みの隔離DBに限定される。

## 本番接続前に具体化する事項

1. 既存四葉DBの対象プロジェクト・現行schemaを再照合し、unit53/56 SQL案と実行role/policyの差分をレビューする。
   新しい物件DBや既存の別事業DBを正本にしない。DDL・権限変更は対象SQLを示した別承認で実行する。
2. 7根拠と準備記録を誰がどの画面で確認・保存・撤回するかを確定し、サーバー専用readerを接続する。
   配信元禁止、広告、顧客転送、画像/本文の用途を区別し、期限・根拠・確認者を保持する。
3. 本人確認済み管理画面から登録/撤回/結果照合へ接続し、権限不足・画面再表示・別物件切替を実UIで試験する。
4. 本番初回は対象1物件ID/確認参照を固定し、更新列・保存する証跡・撤回方法を示す。本文や写真の一括抽出を前提にしない。
   この承認はATBB掲載や顧客への送信を含まない。

停止/復旧はまず新規登録routeの無効化。すでに保存されたreceipt/監査は保持し、結果不明の要求を照合してから判断する。
撤回は新規利用を止めるだけで、すでに反映された物件を自動で巻き戻さない。物件復旧は別のCAS付き計画で実施する。
コードのrevertをDB削除・監査削除と同一視しない。監査の保管期間やownerによる災害復旧は別運用として定める。

## 検証資料

合成1物件・媒体状態2行、媒体監査3・review監査3・property受領2・未実行effect1（計9行）。
別接続の同一要求待機、登録/撤回の監査失敗rollback、応答喪失後の再照合、期限切れhead撤回、旧版拒否、
参照再利用禁止、公開role拒否、7根拠更新禁止を実Postgresで検査する。監査と公開投影に私有canaryがないことも検査する。
実認証・実素材確認・本番Supabase/PostgREST・実UI・実媒体は未検証。

設計の参照先：
[PostgreSQL 17のロック](https://www.postgresql.org/docs/17/explicit-locking.html)、
[Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)。
