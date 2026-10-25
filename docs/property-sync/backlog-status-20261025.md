# 現行コードと設計バックログの対応

2026-10-26照合。設計正本は復旧済み `yotsuba-design-review-pack-2026-10-22.md`。現行作業は `62c26de` 基点、unit1〜45のローカル差分。専用Postgresの実2接続/SQL復旧に加え、unit41まで物件/receipt/予定の原子保存と管理部品の照合・整理を検証・清掃済み。旧条件の賃料・借家種別・報酬閾値を既定値へ戻さない。以下は実装の到達点であり、本番稼働や全受入合格の宣言ではない。

| 項目 | 現在の到達点 | 残る作業 |
|---|---|---|
| B00 環境・基点 | remote/commit/元13変更を確認し段階別に保存 | PR公開・適用時に最新mainとの差を再照合 |
| B01 読取り診断 | 旧ソースhash一致で復旧。ルール選択、full source hash、計画、CLI、明示意味設定による限定4条件判定を追加 | 旧固定条件との統合、現行値、間取り/報酬の評価仕様、実reader（受領file実体/長さ/hash/形式入口はunit22で追加） |
| B02 部屋・募集回・媒体状態 | 明示binding、掲載/観測分離、監査、ローカル/注入DB adapter、広告/素材許諾の照合契約 | 実物の名寄せ・再募集承認・許諾根拠の真正性/素材集合の完全性・移行 |
| B03 認可・権限 | #492相当の現行管理認可を保持。権限metadata読取りとTRUNCATE是正SQL案・ローカル試験 | 本番権限変更の個別承認。Data API設定とアプリDB roleは未確定 |
| B04 通知・job | 通知schema修復案、媒体state/audit、plan registry。物件/receipt/公開予定のtransactionと復旧を隔離SQLで検証 | 本番schema/権限/配線、既存queue切替、実cache/通知の確定照合契約 |
| B05 サイトadapter | 公開allowlist、検査順、旧CLI、下書き削除CASを修正。計画/source/許諾/素材/容量の再読取り結合診断、管理CRUD/取込後の依存page失効 | 本番writer/fencing、実公開の依存更新・画面検証。隔離Prisma競合/依存更新契約は検証済み |
| B06 学区・記事・CTA | 元13変更を保持。学区年度/住所体系/source版/構造化境界/完全性の独立照合契約 | 実学区根拠/正規化の真正性、既存公開判定・記事との関係更新の統合 |
| B07 受付・受任入口 | #493相当の受付ID/重複防止/配信失敗処理を保持、全回帰を実行 | 実送信/CRM照合・受任との連結は別範囲 |
| B08 ATBB正規経路・実績 | mock/手動/公式export/APIの入力種別、端末別観測と会社先頭充足率、独立pool予約のローカル契約 | 契約・公式経路・現行枠・実績辞書・先頭の実観測 |
| B09 ATBB実行 | 未実装。計画/照合の結果は常に保留 | 対象・操作・件数の承認、正規writer・再読取り・部分成功復旧 |
| B10 夜間runner | ローカル検査/監査保存・読取retry提案とCAS開始/完了台帳。自動再開登録は環境制約で失敗 | 実runner/fencing/旧routine切替・scheduleは未設定 |
| B11 効果・採算 | 区間集計/欠測/定義・端末分離、明示pairと設定閾値の率計算、予定slotと会社先頭観測の分母 | 実計測adapter/真正性・attribution、現行閾値、受任遅れ、採算、公開日数・個人情報分離 |
| B12 改善評価 | 障害を回帰試験へ追加、段階patchで戻し先を保持、期待値/policy/harnessの独立pin照合 | 別保管holdout、改善案評価・採用/rollback、実canary。自動本番改変なし |

## 71受入仕様の追跡

[acceptance-status.json](acceptance-status.json) にT01〜27、M01〜08、R01〜08、RF01〜28の71件を重複なく収録し、元文書のSHA-256を固定した。56件には関連するローカル試験があり、15件は未検証。全体受入合格は0件として扱う。ローカル試験の一部が通っていても、実媒体/実DB/画像/運用の残条件を満たしたことにはしない。

T01〜T03等の歴史的固定条件は参照用であり、実行ルールには採用しない。個別顧客条件も全体scopeへ継承しない。現在のルールが未確定なら保留する。

## 旧レビュー19指摘との関係

unit2時点の対応は [resumption-20261024.md](resumption-20261024.md) に履歴として保持する。後続で変わった主な項目は以下。

- F-004/F-005：schema/権限metadata読取りを追加。TRUNCATEはpostgresからanon/authenticated等への直接付与とdefault ACLを確認。是正SQLはローカル13試験まで。本番適用なし。
- F-006/F-007：独立state/audit、source全体hash、job/reference、現行参照、二重読取りを追加。同一ミリ秒CASはunit33で修正・実Prisma/SQL確認。無条件repo writer/seedの版再利用はunit34でCASへ統一。要求ID復旧はlocal adapterまでで本番API未配線、実媒体fencingは残る。
- F-008：scope/版/有効期間/承認根拠を選択する基盤を追加。旧固定ルールの実公開ゲートへの統合はしていない。
- F-009：公開ネスト分離と生値非返却を検証。画像画素・未知機密文字列の安全性を宣言しない。
- F-016：下書き削除の単一DB条件照合と409をunit9で追加。実物削除なし。
- F-017/F-018：新しい常時workflow/モデルAPI/自己採用ループは追加していない。合成テストは公開開発用でありholdoutとは呼ばない。

F-010/F-011/F-013〜F-015等の実媒体運転・名寄せ・依存更新・復旧条件を、ローカル基盤だけで解決済みにはしない。REINS無人取得経路は実装しない。

現在の未検証15件と部分証跡に残る条件の具体的な対応は[次工程の条件](remaining-acceptance-gates.md)を参照。unit26はunit24の保存済みエラー表示の欠落を修正し、GETで再取得、PATCH再送なし。

unit27：問い合わせ元custom intentを既知CTA/学区の許可リストへ限定。旧regexで通っていた任意識別子を除外し、既存category/20学区導線を維持。M03のCRM連結・受任定義は未確認のまま。詳細は[計測入口の保護](contact-intent-privacy.md)。

unit28：媒体監査fileの保存を共通private storeへ統一し、create/rename後のdirectory同期と同一request再送時の耐久性再確認、実byte上限・private権限検査を追加。形式/監査時刻/戻り値を保持。実電源断・実DB接続・外部anchorは未検証。受入件数55部分/16未検証は変更なし。

unit29：既存計画・診断・容量・監査・公開DTOを合成1物件の確認→模擬反映→PC/mobile読戻しへ接続。保留/競合/二重要求/応答喪失を含む12独立ケース。実gatefalse、mock観測は実公開根拠にしない。詳細は[接続フロー](synthetic-workflow.md)、既知事項と追加確認だけの差分は[運用確認](operating-decisions-delta.md)。未検証16件や未配線の本番writerを完了へ格上げしない。

unit30：既存PGlite 0.5.11へunit29の媒体監査保存/読取を接続し、合成1物件/2媒体/監査8行でSQL8項目を検証。物件・他媒体不変、同時要求の単一接続直列化、rollback、commit後応答喪失を確認。詳細は[ローカルSQL結合検証](local-sql-workflow.md)。実Postgres複数接続/実Supabase/本番writerの条件は未解決、受入55部分/16未検証据置き。


unit33：実Property22列/4enumとPrisma6.19.3を同じ隔離Postgresへ接続。物件CASと媒体観測の独立保存、別Prisma2接続の競合、古い版/二重要求/rollback/返答喪失、DB読戻し後の公開allowlist/既知用語拒否をSQL18項目で確認。1物件/2媒体/監査9行、清掃/停止済み。同一ms/後退時計のCAS版再利用を修正、無条件writer/seedは保証外。媒体requestId台帳と異なり物件は内容/版照合のみ。全2,886試験/194file成功、独立レビューの抽出不備1件修正・最終重大指摘なし。詳細は[Prisma/実SQL検証](postgres-connection-verification.md)。受入55部分/16未検証、全体未完成、実媒体/運用条件は未確定のまま。


unit34：全repo更新/seedの確認済み版必須化、create-onlyのunique競合拒否、物件更新と要求ID receiptのatomic保存を追加。新SQL11＋旧モード回帰SQL18成功、新モード監査計9行（媒体3/物件6）。新規17/全2,903試験/195file。独立レビューの旧モードscope不備とUUID正規化を修正、最終重大指摘なし。詳細は[物件要求ID復旧](property-write-recovery.md)。本番schema/API未変更、外部副作用・生成/削除request/保持方針・運用条件は残るため55部分/16未検証を維持。


### unit35 追記（2026-10-25 JST）

管理編集の要求固定→認証由来actor/対象ID照合HTTP→Prisma保存/復旧をローカル結合。実SQL12項目、1物件/2媒体/監査計10行で成功。新規21/全2924試験198file成功。独立3指摘修正、清掃済み。本番route/pageは未配線、全体受入55部分/16未検証・executable:falseを維持。ブラウザ実操作、画面再読込後の復旧、実Auth/本番DB、receipt保持/削除、cache/通知の再開は未検証/未実装。詳細はproperty-write-recovery.md unit35節とtask root REPORT-unit35.md。


## unit36 追記（2026-10-25 JST）

物件/receipt/公開処理予定を同一transactionへ保存するopt-in local構成と、保存後のcache/通知だけを再開するworkerを追加。未実行確定には遅延実行も止めるterminal receiptが必要で、単なる未観測は保留する。実SQL7項目、全2934試験199file成功。隔離DBの空8テーブル/読取りrole/OS通信制限で全体buildも成功し、以前のDB不足はこの合成条件では解消。本番route/実送信未配線・受入55部分/16未検証と実行ゲートfalseを維持。詳細はpublication-effects-recovery.mdとtask root REPORT-unit36.md。


## unit37 追記（2026-10-25 JST）

保存後処理の認証付きHTTPと管理編集部品を接続し、受付refだけの保持と明示再開を追加。held後の再編集不能を独立レビューで修正。新SQL8＋旧12、全2949試験201file、隔離build（font mock）成功。ブラウザはOSによる内部socket拒否で試験前に停止し、DOM6ケースは未実施。元13保持/清掃/段階保存済み。本番routeや実通知は未配線。受入55部分/16未検証・gate falseを維持。詳細は[管理画面の復旧](admin-publication-recovery.md)。

## unit40〜42 追記

unit40はChrome内部socket表記不一致を修正し、通信隔離7項目成功後、Chrome自身のsandbox初期化EPERMで停止した。UI6ケース未検証は維持。unit41は確定heldの所有者付き読取り照合・明示的な端末ref整理・容量回復を追加し、全2957試験/SQL9/隔離buildまで検証・清掃。unit42は通知開始とcache受領の因果が矛盾する復旧記録の誤受理を修正した。受入55部分/16未検証・実行gatefalseを変更しない。最新結果はtask root REPORT-unit42.mdを参照。

## unit45 追記（2026-10-26 JST）

本人の追加条件を私有入力に保存し、既存賃貸評価policyへ間取り別必須面積・元掲載更新期間・AD込み当社総額の判定を追加。閾値/期間/税は設定から取得し、生の報酬証拠を賃貸公開fieldと分離、AD再加算/税換算/再取得による鮮度更新を禁止。旧契約互換を維持。関連45/全2969試験、型/lint成功、独立レビュー重大残件なし。T03の部分証跡を追加して56部分/15未検証・全体受入0。1LDK配分は初期目標として記録し、実データに基づく自動採用は未配線。詳細は[rental-field-evaluation.md](rental-field-evaluation.md)。

## unit46 追記（2026-10-26 JST）

最新回答と自社学区ページを照合。報酬総額基準を明示したruleだけ賃料帯を不要とし、1LDK/2DK以上の別集合・定借の指定学区例外を既存評価へ追加。生の学区証拠は既存matcherで再照合し、scope/版/年度/住所境界を維持。新規13/関連119/全2982試験成功、型/変更lint成功。独立レビュー重大指摘なし。本番履歴未適用、56部分/15未検証・全体受入0。私有入力v2と段階差分に保存。
