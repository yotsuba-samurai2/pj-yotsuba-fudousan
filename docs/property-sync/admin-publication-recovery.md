# 管理編集部品の保存後処理再開（unit37）

unit35の`PropertyRequestEditor`へunit36の公開処理workerを接続する、注入型のローカル構成。既存PropertyFormを再利用する。本番のNext route/page、実Auth、実cache/通知サービスへは有効化していない。管理画面の本番利用可能・実ブラウザ受入完了とはしない。

## 実装

- `PropertyPublicationRecovery`は表示時に状態だけを照合する。ページ更新・通知は明示操作、通知はページ更新の受領後に限る。処理中の二重操作を抑止し、応答不明/権限不足では操作用の古いsummaryを破棄する。完了状態は再実行しない。
- `createPropertyRecoveryHttpHandler`は認証をbodyより先に検査し、検証済みUID・pathの物件ID・受付番号を照合する。bodyは2KiB以内・strict allowlist。APIはstate/試行数/版だけを返し、本文/画像/翻訳/private/通知先/owner hash/attempt IDを返さない。
- 保存時にサーバー由来actorのpurpose付きhashをimmutable planへ入れ、plan hashにも含める。旧planは内部workerとの互換性を保つが、owner未確定なので新HTTP入口では読取り/実行とも拒否する。既存planの無断backfillはない。
- 受付番号と物件IDだけを、操作者/物件別の注入storageへ保存前に保持する。raw編集内容、token、資格情報は保持しない。複数refを最大50件保持し、別のmounted sessionが追加したrefも再読取りして残す。未観測は未実行と扱わない。保存が失敗したと推定してrefを消さない。
- 同じEditorの保存結果不明は入力/要求を固定する。最新物件を読み直したfresh Editorでは、古い未解決refを保持して新しい要求ID/最新版CASで編集できる。これは独立レビューで見つかった、held保存後の永久編集禁止を修正したもの。確定heldの照合/明示整理と上限からの回復はunit41で追加済み。不明・未観測refの整理条件は引き続き未確定。
- property/operatorが入れ替わった際は、旧Editorのフォームと再開操作を隠し再マウントを要求する。旧非同期応答で別物件を操作しない。storage書込み失敗は新しい保存を開始しない。

storageはcaller注入。sessionStorageなら同じタブの再表示に利用できるが、タブ終了・storage消去・別端末へ跨る復旧は保証しない。storageのrefは認証の代わりではなく、serverがownerを検査する。複数タブ間でlocalStorageを共有する実装はこの試験の保証外。

## 実施済みと未実施

| 層 | 結果 | 限界 |
|---|---|---|
| 全Vitest | 2,949件/201file、失敗・skipなし | session/HTTP/部品callback/静的HTMLの試験。DOM操作試験ではない |
| unit37追加 | 15件（session/HTTP12、Editor回帰1、React SSR2） | 関連最終17件は既存Editor2件を含む |
| 実Postgres | 新8項目＋旧12項目成功 | 新8は既存workflowとbuildも含む。HTTPはin-process Request/Response、通知はmock |
| 行数 | 物件1/媒体2、監査3/receipt3/予定2＝制御監査8 | 合成のみ。実データ取得なし |
| 分離 | 公開DTO検査、公開生成物3,375件canary不在 | 未知の自由文/画像画素の全面安全性ではない |
| build | 隔離SQL/読取りrole/通信禁止でexit0 | 外部Google FontsはNextの既存test hook＋同梱フォントでmock。実フォント表示未検証 |
| ブラウザ | **未実施・blocked** | Chromeが画面開始前に内部Unix socketのbindで停止。DOM6ケースの定義を成功数へ算入しない |

SQLは保存の応答喪失→元要求照合→ページ更新、二重要求/再表示中の実行中照合、不明応答、権限不足、通知返答喪失、新接続/DB再起動、完了要求、別owner/物件/body actor拒否、held→新編集、媒体/監査不変を検証する。新モードは`--publication-ui`。最大10行制限を維持し全行清掃・DB停止・一時認証削除済み。

初回buildは外部フォント禁止で停止、次はSerifのmock URL範囲が不一致で停止。正しい200..900に修正し最終成功。ソースの本番フォント定義は変更せず、通信制限を維持した。unit36のbuild成功を今回のキャッシュ無しbuild成功へ流用していない。

Chromeは既存156.0.8078.48、一時profile・file URL・OS通信禁止・ブラウザsandbox維持で試行。終了21の診断はmacOS temp内`SingletonSocket: Operation not permitted`。所有する一時ディレクトリのUnix IPCだけを許す再試行でもChromeはmacOS側にsocketを作ろうとして同じ拒否で停止した。以後は停止し、別profile/外部browser/安全制限解除へ切り替えていない。`check-recovery-browser.mjs`とentryは未完の試験準備物であり、実行結果はtask root evidence/unit37-browserに残す。既知の一時pathと作成profileは清掃済み。

## 本番移行の残件

1. **まずローカルUI受入**：通信を遮断した既存ブラウザの許可された実行環境を確定し、未実施の二重クリック・離脱/再表示・不明応答・完了・物件切替・権限不足のDOM6ケースを完了する。現在の隔離では起動できないため勝手に制限を解除しない。
2. **本番配線/DB案のレビュー**：実Auth/操作者権限を注入するrouteとEditor、既存通知queueとの重複停止/引継ぎ、receipt/公開処理tableのDDL・RLS・権限・保持削除・rollbackを確定する。本番DDL/権限変更/公開は別承認。旧planへownerを推定して補わない。
3. **実cache/通知の契約**：受領照合と遅延実行を防ぐ確定取消が提供できるかを確認する。提供不能な結果はunknown保持。公開ページPC/スマホ照合は受領成功と別に実施する。実通知/実顧客宛送信は今回0件。
4. **事業運用の未確定差分**：現行賃料/借家/採算条件と適用日、周辺学区、区分別の実契約枠、媒体ごとの許可取得/更新経路と運用主体。既知条件は`operating-decisions-delta.md`を引き継ぐ。ATBB109など過去値・個別顧客条件を全体値へ置かない。REINS無人取得は対象外。

受入55部分/16未検証・実行gate falseは据置き。本単位はローカル実装/SQL/ロジック検証の保存地点であり、本番移行完了・UI受入完了ではない。

## unit41 確定保留の照合と端末一覧の整理

従来は保存前に保持した受付番号について、確定heldでも副作用planがないため再表示時は404/unknownとなり、50件上限で新しい保存が止まる残件があった。新しいreceiptは認証由来actorの用途別hashを同じtransactionで保存する。読取りadapterは物件ID・要求ID・認証ownerの一致とreceipt形式を確認し、VERSION_CONFLICT / INVALID_PROPERTY / PUBLICATION_GATE_REJECTEDのimmutable heldだけ返す。物件本体・receipt・planを更新しない。

HTTPの追加分岐confirmed_heldはstatus操作だけに対応し、既存の副作用outcome:heldとは区別する。旧応答の形は変更しない。旧クライアントは新分岐を解釈できなければunknownとなるため、安全な整理には新クライアントも必要。hash・actor・編集本文・画像・ADは返さない。依存receipt readerを注入しなければ従来どおり404で停止する。

管理部品は確認後の明示ボタンで該当番号だけを端末一覧から外す。未観測・結果不明・applied・別owner・旧ownerなし・不正receiptは削除根拠としない。保留の整理は自動取消や要求の再送ではない。DBの監査記録は保持する。複数sessionのrefは直前に読み直し、他の未解決refを残す。

容量超過はstorage故障と分離した。50件に達したら新しい保存を止め、確定したrefを整理して上限を下回ると保存できる。保存領域への書込みが失敗したときは引き続き停止する。raw編集値やreasonを永続保存せず、端末へ保持するのは引き続き物件ID/要求IDのみ。

### schema互換と戻し方

新adapterはnullableのinitiator_hash列が必要。互換性は列追加後のNULL旧receiptを含むものであり、列がない旧schemaの無変更互換ではない。旧receiptへownerを推定して埋めない。新規の隔離DBには提案DDLで作成し、既存schemaへの適用は以下の追加案を別途レビューする。

```sql
-- 提案のみ。今回、本番・外部DBへ適用しない。
ALTER TABLE public.property_write_receipts
  ADD COLUMN initiator_hash TEXT CHECK (initiator_hash ~ '^[a-f0-9]{64}$');
```

ロールバックは新しい受付整理入口を外し、前段階のコードへ戻す。追加列とreceiptは保持する（削除/再帰属しない）。旧writerが作るNULL行は新しいID-only整理の対象外となる。receiptの削除・保存期間・本番RLSの変更はこの端末整理機能に含めない。

実DOMはunit40のChrome sandbox初期化拒否により未検証のまま。ロジック・HTTP・SSR・実SQLとブラウザ操作の検証を混同しない。今回の結果はtask root REPORT-unit41.md / unit41-validation.jsonへ記録する。

## unit42 復旧状態の因果整合

通知のattemptが1回以上ある記録は、先行するcacheがacknowledgedであることを共通verifierで必須にした。cacheの受領は正常遷移では巻き戻らないため、通知受領済み/cache未受領という組合せは破損・不整合として扱う。初期状態、通知不要、cache受領後の通知再試行は有効なまま。

不整合を検出した場合は副作用を呼ばず、完了を主張せず、端末refも整理しない。物件・receiptを自動修復/巻戻しする処理ではない。
