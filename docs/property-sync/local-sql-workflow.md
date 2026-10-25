# PGliteを使う合成フロー結合検証（unit30）

既存PGlite 0.5.11とcreateDbMediaStoreを使い、unit29の媒体状態・監査の保存/読取りをSQLへ接続する。new PGlite()のメモリ内DBだけを使用する。クラウド2プロジェクト（luck428-corporate/lxsnklqwysakhnmvdivh、samurai-yotsuba's Project/mezrqeydgqrepvbxdncf）は対象外。後者も既存データがあるため検証用へ転用しない。

## 再現コマンド

```sh
node --import tsx scripts/property-sync/check-workflow-db.mjs /absolute/path/to/sql-test-runtime
```

インストール済みpackageのname/versionを確認して読み込む。runtimeの絶対パス1個だけを受け付け、接続URL・資格情報・data directory・実データ・外部通信・port・インストール機能はない。Nodeと既存packageを使用し、終了時にはfinallyでDBをcloseする。成功stdoutは生値を除いたJSON報告、失敗stderrは固定error。テストが破棄したDBの後片付けに実DBのDELETEを使うことはない。

## 既存フローとの接続

synthetic-workflow.tsにinitialize/read/applyの小さな合成テスト用保存口を追加。通常CLIは従来どおり注入なしのメモリ内フロー。DB検証スクリプトだけが既存DBアダプターを渡す。媒体先の公開DTOとPC/mobile表示は引き続きメモリ内mockで、実媒体writerは追加していない。

媒体状態の入力は保存先から再読取りし、書込み正常応答後も監査のrequestId/actor/時刻/command hash/after hashと実保存stateを照合する。不明応答なら同じrequestの記録を読み、存在して一致したときだけ続行する。読戻し失敗・不一致ではunknownを保持し、予測したstateへフォールバックせず再保存しない。確認済みrollbackは保留として返す。これらの経路にも全executable:false・mock観測・未確認の実行gateを維持する。

## データと検査範囲

DBは1回だけ生成し、次の合成行だけを使用する。

- properties：1行。FK/不変性確認用の最小3列（id/status/updated_at）、draftのまま。実properties全22列やPrisma互換の検証ではない。
- property_sync_media_state：site/athomeの2行。既存schema提案をそのまま実行し、siteのみ操作、athomeの行全体は不変。
- property_sync_media_audit：最大10行。INSERT直前にもtransaction内で上限を確認する。正常終了時は8行、athome側0行。

SQL8項目：①unit29成功フローと初回commit応答喪失の読戻し ②同一要求の重複防止 ③古い掲載版の保留 ④同時要求の片側採用 ⑤INSERT後失敗のrollback ⑥rollback済み同一要求の再実行 ⑦commit後応答喪失と同ID照合 ⑧物件/他媒体不変と件数上限。

同時要求はPromise.allで2要求を重ね、PGliteの単一接続がtransactionを直列化する。独立したPostgres接続間のrow lock/deadlock/isolation挙動を証明しない。rollbackはtransaction callback内でtx.rollback()の成功を確認した場合のみRolledBackTransactionにし、commit後の応答喪失はcatchの外で注入してSTORE_OUTCOME_UNKNOWNと区別する。

## 成果物と限界

SQL検証報告とmanifest/hashはevidence/unit30-sql-workflow-finalへ保存。アプリ回帰とは別のSQL8項目として数える。新しい保存口の故障6試験はVitestで検証。報告の氏名/住所/本文/AD/SQL接続情報は保存しない。

未検証：実Postgresの複数接続、実Supabase認証/role/Data API、実properties全列、実source reader、実サイトwriter、実cache/ブラウザ/画像、プロセス再起動後の復旧。現行ルール・契約枠・媒体経路・旧routine停止等の未確定条件も据置き。本番やクラウド権限を変更せず、受入55部分/16未検証を全体完了へ格上げしない。
