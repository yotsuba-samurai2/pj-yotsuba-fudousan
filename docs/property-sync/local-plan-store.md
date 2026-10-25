# ローカル計画台帳の排他保存

unit8。`local-plan-store.ts` は単一のprivate fileにregistry stateと監査イベントを保存する。既存のDB・媒体・資格情報へ接続せず、アプリrouteやrunnerにも未接続。全結果 `executable:false`。

- `createPlanRegistryFile`：wx/0600で新規作成。既存fileを上書きしない。途中のfileは調査用に残し、結果不明を返す。
- `readPlanRegistryFile`：通常file、他ユーザーへのmode権限なし、最大8MB。最終要素のsymlinkを拒否し、FIFOを開いて待ち続けない。実読取りにも上限を設け、stat後の増大でも無制限に読み込まない。全履歴をreplay検査する。
- `applyPlanRegistryFile`：wxのlockを取得後に最新fileを読み、保管側の現在日時で要求を検査する。一時fileへ全state/監査を書き、file fsync→rename→親directory fsyncで置換する。読者には旧版か新版の一方だけが見える。

保存前の一時file障害では元のregistryを維持する。renameを試みた後のエラー、同期失敗、lock解放失敗は `STORE_OUTCOME_UNKNOWN`。未実行と断定せず再読取りする。同じrequestの再送は履歴を増やさず、現在fileと親directoryを再同期してから成功応答する。同期障害が継続中なら、再送も結果不明を維持する。

残留lockを期限で自動解除しない。`STORE_BUSY` は実行中か、障害後の残留かをこの関数だけでは判別できない。ファイルの所有者による確認が必要。無条件再実行・別経路への迂回は行わない。

17件の合成試験で新規作成、同時writer、古いCAS、再送、symlink、FIFO実体、mode、容量、部分書込み、rename後の応答喪失、同期障害の継続、残留lockを確認した。実DB・媒体への操作は行っていない。

## 保証の範囲

同じlock規約に従うローカルwriterの協調が前提。親directoryのsymlink制限、別ユーザー権限の保管、同一OSユーザーからの故意の書換えやlock削除、ネットワークfilesystemの保証、実際の電源断試験は含まない。保存された時刻・hashは署名ではなく、ファイル全体のrollbackは外部の信頼基点なしには検出できない。

read成功はその読取り時の整合性だけを示す。変更計画の事前検査と将来のwriterの間をatomicにする機能、DB transactionや外部媒体操作のfencing、公開/削除の承認は別途必要。
