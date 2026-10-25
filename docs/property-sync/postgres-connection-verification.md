# Postgres実接続検証（unit32）

## unit34：全更新経路の版チェック・要求ID復旧（最新）

無条件repo更新とseedの直upsertを廃止し、確認済み版またはcreate-onlyを必須化。物件更新と要求ID/hash/outcomeの記録を同じPrisma transactionで保存する注入adapterを追加。新しい本番API配線・本番schema変更はない。

要求IDモードの最終実SQL11項目で1物件/2媒体/監査計9行（媒体3＋物件6）、同一要求の1保存、競合、rollback/失応答/後続編集/restart/公開拒否を確認。旧全Propertyモード18項目も今回のコードで回帰成功。両実行の合成行/秘密を清掃、DB停止、独立のパス不存在確認済み。全2,903試験/195file成功。

詳しい契約・未配線範囲・FK削除制限は[物件更新の要求ID復旧](property-write-recovery.md)。unit33の無条件writer制約はrepo/seedから解消したが、本番APIへの要求ID導入、新規作成/削除の復旧、外部副作用はまだ対象外。以下はunit33以前の履歴。

## unit33：実PropertyスキーマとPrisma保存処理（最新）

同じ隔離Postgres 17.11を使用し、`--full-property`モードで実schema.prismaのProperty全22列と4enumだけをPrisma 6.19.3のmigrate diffから生成した。既存unit29合成recordと完全一致する1物件をPrismaで作成し、同じpropertyId/版で媒体2行を初期化。以降の物件更新は本番コードと共通のcreatePropertyRepository/updatePropertyIfUnchangedを使用する。通常のdb/properties.tsのexport/戻り値は維持した。本番schema/migrationには変更を加えていない。

物件writerは専用role、固定IDのRLS、properties SELECT/INSERT/UPDATEだけ。媒体runnerはproperties SELECT、siteのstate3列UPDATE/audit INSERTだけで、相互の書込権限を持たない。Prismaは固定Unix socket URLをメモリ内で明示し、生成clientの.env参照なし・接続後のdatabase/user/addressを検査。DATABASE_URL/DIRECT_URL/PRISMA_*/PG*の環境混入を起動前拒否する。

SQL18項目成功（既存10＋物件8）。物件transactionを未commitで保持したまま媒体観測を保存でき、物件commit後も両方の変更が残った。Prisma2接続PID85349/85354で行ロック待ちを観測し、同じ版の編集は一方true/他方false。古い版/二重要求、時計後退、途中失敗rollback、実保存後アプリ返答破棄→新接続読戻しも確認。最終1物件/2媒体/監査9行、上限10。

物件CASのupdatedAtを壁時計任せにすると、同一msまたは時計後退で版が再利用される。固定時計の新6試験が旧実装で失敗することを記録し、期待版+1ms以上へ必ず進める修正後に合格。不正/非canonical/進められない日時はSQL前に拒否する。

JSON各階層にAD/当社報酬/元付canaryを保存し、DB読戻し→公開DTO/翻訳表示/JSON-LDで除外、通常公開値を維持することを確認。社内専用変更は公開hash不変。本文・spec・翻訳・画像altに混入した既知用語は公開前検査で拒否、scalar欄のオブジェクト丸渡しも拒否する。画像の画素や未知の自由文の意味までは確認していない。

独立レビューがスキーマコメント内のbraceで抽出が途切れる問題を実行前に発見し修正。最終追加重大指摘なし、schema hash再計算と清掃6パス不存在を独立確認。SQLの再実行はしていない。実行後は合成行0、DB停止、秘密/data/socket/logを所有確認して除去した。

保証範囲：CAS経路同士。無条件updateProperty/upsert/seedと並行する版再利用は既存の制約として残る。物件保存にはrequestId台帳がないため、応答喪失後は内容/版照合と旧版再送拒否までで、要求同一性やexactly onceを主張しない。媒体側は既存requestId台帳を照合する。応答喪失は実COMMIT後のアプリ返答破棄であり、実network packet切断ではない。実媒体・Supabase・本番・画面/cache・運用条件は未検証、executable:falseを維持。

回帰2,886試験/194file、全体/CLI型/構文/対象lint成功。全体lintは0error/23warning。資格情報を渡さず通信を遮断した全体buildはコンパイル/型まで成功し、コラム静的生成に必要なDATABASE_URLがないため未完了。物件以外のテーブルを無断追加して完了扱いにはしない。

詳細・実行証跡はtask rootのREPORT-unit33.mdとevidence/unit33-postgres。以下はunit32以前の履歴。

2026-10-25、追加の既存3パッケージ更新を本人承認後、PostgreSQL 17.11（Homebrew）/pg 8.23.1を導入し、実SQL10項目が成功した。以下のunit31節は停止時点の履歴として保持する。既存クラウド2件/本番/外部媒体へは接続していない。

## unit32で確認したこと

`node --import tsx scripts/property-sync/check-workflow-postgres.mjs /absolute/task-root/postgres-integration-runtime`

CLIはこの作業コピー直下の専用runtime絶対パスだけを受け付ける。任意URL/host/.envは使わない。PG系環境変数、既存data/秘密/log/所有marker/binding/socketを起動前に拒否する。PostgresはUnix socket `/tmp/yotsuba-pg-unit31` だけで待受し、TCP待受は空。専用DB/owner/runner、一時SCRAM資格情報、3表は1回の検証で作成して清掃する。pgは公式8.23.1を専用runtimeへexact/lock/integrity付きで導入し、install scriptsとoptional dependencyを無効化した。

propertiesはid/status/updated_atだけの合成draft1行。site/athome状態2行。runtime roleは非superuser/非owner/非owner member、properties SELECT、state SELECTとversion/state/head_hashのUPDATE、audit SELECT/INSERTだけ。媒体2表RLSは固定合成ID/episode/siteへ限定。監査のINSERT上限も設けた。全件数/他媒体不変はRLSで行が隠れないowner接続で確認した。

SQL10項目：unit29の計画→合成確認→媒体mock→SQL保存→結果照合、二重要求、古い版、実2backendのrow lock待ちと片側採用、監査INSERT後失敗のrollback、取消確認後の同ID再実行、commit後のアプリ応答喪失から新接続で照合、未commit接続終了による取消、最小権限/他媒体不変、実サーバ停止・再起動後の監査保存維持。最終1物件/2媒体/監査8行。未commit切断試験中は9行目をtransaction内へINSERTして破棄、上限10行を超えていない。

並行試験は別backend PIDを取得し、Aがstate行をlockした後Bを開始。ownerからpg_blocking_pids(B)にAが含まれることを観測してからAを解放した。保存後の応答喪失は実COMMIT+接続終了の成功後にアプリ応答を破棄する注入であり、ネットワークpacket障害の試験ではない。

終了時は所有marker/inode/専用DB/固定bindingを照合し、audit→state→propertiesをID限定DELETE、0行を確認。全client終了、pg_ctl停止とstatus非稼働を確認後、今回のdata/秘密/log/marker/binding/socketだけを除去。独立レビューも6対象パスの不存在を読取り確認した。導入ソフトと専用Node依存は保持するがDB常駐/自動起動は設定していない。

## 導入時の調整とレビュー

Homebrewがopenssl@4導入時に旧openssl@3の共通リンク6,560本を外したため、すぐにopenssl@4共通リンクを外し、元のopenssl@3 3.6.2へ同数を復元。既存openssl本体の更新はない。指定の既存3更新以外にCellar既存版の変更がないことも照合した。CA bundleは本人承認範囲で190→188 PEM blocksへ再生成された。OSキーチェーンの変更や秘密鍵取得は行っていない。

Postgresのpost-installを省略すると既定DB初期化に加えinclude/lib/shareの参照も省略され、初回initdbがpostgres.bki不存在で失敗した。失敗時清掃を確認した後、公式定義の3参照だけを不存在パスへ補完。既定DB `/opt/homebrew/var/postgresql@17` は作成せず、次の実行で全SQL項目が通った。失敗証跡も隠さず保存した。

独立実行前レビューでPGOPTIONS継承と既存log清掃を修正。環境設定混入/既存logの2負試験で起動前拒否・inode/内容不変を確認。最終独立レビューは追加指摘なし。SQLは主担当が実行し、独立担当は再実行せずコード/証跡/清掃実体を照合した。

証跡はtask rootのevidence/unit32-postgres、結果はREPORT-unit32.md。全properties22列/Prisma保存・Supabase Auth/Data API・媒体writer・画面/cache・電源断・全deadlock経路・運用ルール確定は未検証。全executable:falseと媒体mockを保持し、受入55部分/16未検証は全体合格へ格上げしない。

## unit31時点の履歴（下記の「未実施」は当時の状態）

2026-10-25、専用ローカルPostgresの導入/起動/合成検証/清掃が承認された。既存パッケージの更新は対象外である。

Homebrew dry-runで、PostgreSQL 17.11 revision 1の導入には新規6依存（icu4c@79/openssl@4/krb5/json-c/libunistring/gettext）に加えて、既存ca-certificates 2026-03-19→2026-10-20、readline 8.3.3→8.3.6、xz 5.8.3→5.8.4の更新が必要と判明。NO_INSTALL_UPGRADE等を指定しても依存更新の計画が出たため、実インストールへ進んでいない。依存を無視する非対応オプションや別の取得経路で回避しない。

この3更新は既存Homebrew利用ソフトのCA信頼ストア、対話入力ライブラリ、圧縮ツール/ライブラリへ影響し得る。OSキーチェーンや本番DBの変更ではないが、他ソフトの互換性が不変とは未検証。限定追加承認が必要。詳細・公式資料はtask rootのDB-ENVIRONMENT-PROPOSAL.md、版の取得証跡はevidence/unit31-postgres/dependency-plan.json。

## 実装した最小単位

postgres-transaction-port.tsは既存SqlPortを実装する未配線の接続境界。pg packageや環境変数/URLを読み込まず、呼出側が専有clientを明示注入する。1 transactionの全SQLに同じclientを使い、同時要求には別connectionを用いる。closeは物理接続を終了する契約で、結果不明のclientをpoolへ戻さない。

callback失敗後のROLLBACK応答が確認できた場合のみRolledBackTransactionを返す。COMMIT送信/応答の例外はrollback経路へ入れずunknownとする。接続/BEGIN/ROLLBACK/close失敗も固定errorにし、driverの秘密を含み得るメッセージを公開しない。自動再接続・再送はしない。createDbMediaStoreが既存のSTORE_OUTCOME_UNKNOWN/TRANSACTION_ROLLED_BACKへ変換する。

擬似client8試験と既存DB adapter7試験で、同一接続、明示rollback、各段階の応答喪失、偽の取消例外、並行時の別clientを確認。独立レビューも関連15試験成功。これは実SQLや実Postgresの並行接続を検証したものではない。

## 未実施

- Postgres/pg/新規依存の導入、DBプロセス起動、socket作成、DB/role/資格情報生成、GRANT/RLS適用、合成行のSQL投入・清掃。
- 独立backend PIDとpg_blocking_pidsによるrow lock待ちの証明、実commit/切断/再起動復旧。
- Supabase接続・Data API・本番・媒体操作。既存2クラウドprojectは対象外のまま。

task rootにprivateな空runtime/package.jsonと証跡ディレクトリだけを作成した。Homebrewは承認済みdry-runのため公式API/manifest取得とcacheへの保存を行った。導入物・DB・秘密情報・試験行はないため、DB削除や停止操作の対象もない。unit30のPGlite成功を実接続成功へ格上げしない。受入55部分/16未検証は変更しない。


### unit35 追記（2026-10-25 JST）

管理編集の要求固定→認証由来actor/対象ID照合HTTP→Prisma保存/復旧をローカル結合。実SQL12項目、1物件/2媒体/監査計10行で成功。新規21/全2924試験198file成功。独立3指摘修正、清掃済み。本番route/pageは未配線、全体受入55部分/16未検証・executable:falseを維持。ブラウザ実操作、画面再読込後の復旧、実Auth/本番DB、receipt保持/削除、cache/通知の再開は未検証/未実装。詳細はproperty-write-recovery.md unit35節とtask root REPORT-unit35.md。


## unit36 追記（2026-10-25 JST）

物件/receipt/公開処理予定を同一transactionへ保存するopt-in local構成と、保存後のcache/通知だけを再開するworkerを追加。未実行確定には遅延実行も止めるterminal receiptが必要で、単なる未観測は保留する。実SQL7項目、全2934試験199file成功。隔離DBの空8テーブル/読取りrole/OS通信制限で全体buildも成功し、以前のDB不足はこの合成条件では解消。本番route/実送信未配線・受入55部分/16未検証と実行ゲートfalseを維持。詳細はpublication-effects-recovery.mdとtask root REPORT-unit36.md。
