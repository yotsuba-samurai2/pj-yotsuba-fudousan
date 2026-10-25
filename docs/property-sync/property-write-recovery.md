# 物件更新の版チェックと要求ID復旧（unit34）

対象は承認済みローカル実装・合成検証。既存本番/クラウドDB、媒体、権限への操作はない。新しい要求ID adapterは本番APIへ配線しておらず、schema.prismaや本番migrationも変更していない。

## 既存更新経路

`updateProperty(id, data, expectedUpdatedAt)`は呼出側が確認した版を必須にし、同じUPDATEでid/版を照合する。無効/未指定/古い版は固定`PROPERTY_VERSION_CONFLICT`。`updatePropertyIfUnchanged`も同じ単調版生成を使う。更新版は現在時刻と期待版+1msの大きい方で、同一ms/後退時計で以前の版へ戻らない。

`upsertPropertyBySlug(slug, data, expectedUpdatedAt)`は明示nullだけがcreate-only。既存slugは先に拒否し、その確認直後の並行作成もDBのunique制約で拒否。既存更新に自動fallbackしない。文字列版を指定した更新はid/slug/期待版を同じUPDATEで照合する。

sample seedの直接Prisma upsertを除去した。`--write`だけでは新規作成のみで、既存更新には`--expected-updated-at=<確認済みISO日時>`が必要。未指定を最新読取り版で埋めない。今回seedはdry-runと型検査のみで、本来のDBへ`--write`は実行していない。

画像差替え用SQL proposalにも版の後退経路があったため、構築関数を既存image-repairへ抽出。UTCの現在時刻（ミリ秒）と現在版+1msのGREATESTを使い、元のid/slug/版/provider/room条件を保持した。TIMESTAMP(3) snapshotのT/space・zone無し形式は厳密に検査してUTCとして扱い、offset付き形式も同じSQLへ正規化。実生成SQLで時計後退時の+1ms、旧版再送0行、画像以外不変を確認した。画像取得/アップロードはしていない。

## 要求ID付き更新

`createPropertyWriteRequests`は明示注入されたPrisma clientだけを使う更新adapter。入力はrequestId、propertyId、認証主体に由来するactorRef、期待版、patchJson。生成API・削除APIの要求ID処理は対象外。

- UUIDを小文字へ正規化。変更可能なslugから対象を解決せず、不変propertyIdに結び付ける。
- patchJsonを所有snapshotとして解析。既知のroot項目、形式、数値、サイズ/深さを検査。任意4項目のnullは明示clear。正規化した変更内容とproperty/actor/操作/期待版をhash化する。
- 同じtransactionでrequest advisory lock→property row lockの順に取得。保存済み要求の照合をCASより先に行い、同IDの内容/主体/対象/期待版の変更を拒否。
- 初回は最新行へ既存の入力/公開前検査を適用し、物件CAS更新後のDB読戻しをhash化する。物件更新とreceipt INSERTを一緒にcommitする。
- receiptは要求ID、物件ID、要求hash、期待/結果版、結果hash、結果分類だけ。本文・画像・翻訳・AD・報酬・raw patch・actor文字列を保存しない。VERSION_CONFLICTや公開前拒否も記録し、同IDの結果が後から変わらない。
- 途中失敗時は両方がrollback。アプリ側で確実なrollbackと判定できない例外は`STORE_OUTCOME_UNKNOWN`で、自動再送しない。`reconcile`で同ID/hashを照合する。記録が未観測なら`REQUEST_NOT_OBSERVED`であり未実行の断定ではない。
- 保存済み要求の再送は書込みなし。後続編集があれば過去の結果と`current: changed`を併記し、昔の物件状態を復元しない。現在行がなければ`missing`として区別する。
- RLSで見えない既存要求IDとのunique衝突は、transaction全体をrollbackした後に固定競合を返す。abort済みtransactionで追加SQLを続けない。

## schema/権限境界

`proposals/property-write-receipts.sql`はproposal。CREATE/RLS/REVOKEをatomicにし、PUBLIC/anon/authenticatedの権限を外す。現行の本番ACLやroleは変更しない。

隔離検証だけで固定合成propertyIdのRLS、物件writerのreceipt SELECT/INSERTを付与。UPDATE/DELETE/TRUNCATEなし、媒体runnerもreceipt書込不可。ownerは合成データ清掃にだけ使用。hashは機密情報の公開許可を意味しない。

FK RESTRICTによりreceipt付き物件の物理削除を防ぐ。保持期間・tombstone・削除契約は未確定のため、このproposalを本番へ適用すると既存DELETEへ影響することに注意。全体APIへの有効化には認証主体の由来、取得/広告承諾・容量・実行承認、公開後cache/通知の扱いも必要。本adapterの公開前検査はこれらの運用ゲートを代替しない。

## 検証証跡

新モード`--property-requests`で最終実SQL11項目成功。1物件/2媒体/媒体監査3＋物件receipt6＝9行、上限10。Prisma独立接続で同IDのadvisory待ち、別IDのproperty行待ちを観測。同IDは1保存/1receipt、別ID同版は一方だけ採用し他方は版競合を記録。実commit後の返答破棄→新接続照合、INSERT後の故障注入rollback、同ID再試行、後続編集、再起動、公開前拒否を確認した。

初回実SQLはcreate-only拒否検査で停止、全清掃成功。既存slug先行拒否へ修正して第2回で成功。旧`--full-property`の変数scopeが独立レビューで指摘され、共通scopeへ修正した後、既存SQL18項目も別実行で成功。独立担当は証跡/コード/清掃パスを読取り確認しDBを再実行していない。

新規17/関連23、全2,903試験/195file成功。全体lintは0error/23warning。旧単位の成功やSQLケースをアプリ試験数へ合算しない。実機network packet喪失・電源断・Supabase固有接続・外部媒体のexactly onceは主張しない。新規作成/削除の要求ID復旧、本番API配線、保持/削除方針、画像画素/運用条件は未完了。

詳細・失敗/成功を分けた実行記録はtask rootのREPORT-unit34.md、unit34-validation.json、evidence/unit34-postgres。

全体buildは資格情報なし/通信遮断で実行し、コンパイル/型後のコラム静的生成でDATABASE_URL未設定となり未完了。最後のSQL日時互換追加後は全体型・回帰を再確認し、同じ環境依存のbuild失敗は報告目的で繰り返していない。


## unit35：管理編集部品とHTTP処理のローカル結合

`PropertyRequestEditor`は既存PropertyFormを再利用し、`createPropertyEditSession`へ確認済み物件ID・期待版・明示注入sendを固定する。既存pageや本番API routeには登録しない。新しい環境flagや暗黙のDB/HTTP接続先も設けていない。

- 初回保存で要求IDと変更内容をメモリ内snapshotにする。送信後はフォームを固定、二重クリック/別内容submit/不明結果からの直接再送を止める。照合で記録未観測の場合だけ、同内容・同IDの明示再送を許す。未観測を未実行の証明とはしない。
- full formの省略された任意4項目はnullで明示clearし、旧値が意図せず残らない。DB adapterの既存patch検査・公開前検査を使う。
- HTTP handlerはadmin verifierとstoreを注入する。認証失敗時はbodyさえ読まず、未設定storeは503。actorは検証済みuidから生成し、bodyのactorを拒否。要求のpropertyIdをpathと照合してからpath由来IDで保存する。応答にも物件IDを含め、クライアントが要求IDと両方照合する。
- bodyはストリームの実byte上限で制限。応答は厳密な許可項目だけで、raw物件・AD/報酬・actor・例外詳細を出さない。不正な応答やreceipt整合性エラーは結果不明として扱う。
- 保存済み/後続編集あり/現在物件なし/保留/不明を区別し、公開反映は常に未確認と表示する。この処理はcache再検証や通知を呼ばない。保存成功から公開成功を推測しない。
- ローカル部品は画像uploadとimg/src出力を無効化。既存PropertyFormの既定動作は維持し、直接fileイベントでもローカル側のuploadを拒否する。

### 実行結果と独立レビュー

最終実SQL12項目成功。合成1物件/2媒体、媒体監査3＋物件receipt7＝10行。Web Request/Responseをプロセス内で通し、HTTP listener/TCP portなしで編集session→認証stub→既存Prisma adapterを結合した。INSERT後故障で両方rollback→未観測照合→同ID再送→commit後HTTP返答破棄→新DB接続で保存照合→後続編集changedを確認。既存の別接続lock待ち・旧版・二重要求・公開拒否・再起動も同じrunで通過。生データや秘密は証跡に保存せず、DB/秘密/socketを清掃した。

独立指摘3件（画像の別通信経路、画像試験のfixture干渉、対象物件IDの通信契約不足）を修正。最初のSQLはfixture干渉による既存gate拒否で失敗、清掃成功。HTTPケースを不完全な取得元fixtureを作る画像ケースより前へ移し、公開gateを緩めずに解消。最後の対象ID修正後にSQL/全回帰を再実行した。

新規21/関連38・全2,924試験/198file成功、失敗/skip0。全体型/CLI型/対象lint/構文/diff成功。全体lintは0error/23warning。全体buildは資格情報なし・通信遮断でコンパイル/型まで成功し、既存コラム静的生成のDATABASE_URL不足で未完了。最後のID契約/整合性表示修正後は型/回帰を実行し、同じbuild失敗の再実行はしていない。

### 有効化までの残件

- 本番page/routeは未配線。新部品は注入対象を固定したローカル結合用であり、実Supabase Auth・Data API・本番ACL・ブラウザでの画面操作は未検証。UI試験はReact要素/イベントと状態遷移の合成検証。
- 生の編集内容はメモリ内のみ。画面再読込/アンマウントをまたぐ復旧は未実装。結果不明時に画面を閉じない案内を出すが、永続保存やbeforeunloadによる離脱防止は行わない。
- receipt migration/保持・物理削除方針、実admin verifier配線、保存後のcache/通知を安全に再開する処理が必要。実DB適用・権限変更は別承認。実媒体公開、最新ルール/枠/許可、画像画素・未把握自由文の検査も未完了。

証跡はtask rootのREPORT-unit35.md、unit35-validation.json、evidence/unit35-postgres。全体受入55部分/16未検証と実行ゲートfalseは維持。


## unit36 追記（2026-10-25 JST）

物件/receipt/公開処理予定を同一transactionへ保存するopt-in local構成と、保存後のcache/通知だけを再開するworkerを追加。未実行確定には遅延実行も止めるterminal receiptが必要で、単なる未観測は保留する。実SQL7項目、全2934試験199file成功。隔離DBの空8テーブル/読取りrole/OS通信制限で全体buildも成功し、以前のDB不足はこの合成条件では解消。本番route/実送信未配線・受入55部分/16未検証と実行ゲートfalseを維持。詳細はpublication-effects-recovery.mdとtask root REPORT-unit36.md。
