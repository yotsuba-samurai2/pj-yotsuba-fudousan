# 監査・ルール選択・DBアダプターのローカル基盤

2026-10-24。実DB接続、DDL適用、媒体操作、ルール有効化、公開・送信を含まない。

## ルール履歴

`rules.ts` は設定ファイル/JSONを厳格に解析する。登録済みの業務ルールや既定の金額は出荷しない。試験値は合成値のみ。

- scopeは居住用賃貸/売買/事業用と全体/個別顧客、個別顧客のopaque参照IDを完全一致で比較。全体の不足を顧客条件で埋めず、顧客間も継承しない。
- `id` はscope内で固定する**ルールfamily ID**。変更はversionを増やす。別familyへの移行は未実装で、旧familyが期限終了済みでも複数familyが開始した履歴は保留する。黙ってどちらかを選ばない。
- effectiveFromを過ぎた最新versionを選び、未承認・撤回・失効・承認根拠不足・必須条件nullなら保留。旧版へフォールバックしない。未来の開始版はまだ選ばない。
- 入力順、重複version、時刻順序、範囲矛盾、税区分や鮮度の未確定を試験する。preferredAreaSqmは選好なのでnullでも必須条件を緩めたことにはしない。
- 選択結果も計画参照も常に `executable:false`。公開ゲート・writer・現行B01への接続はない。承認IDの真正性確認や実行直前の再照合は後続。入力のapprovedという文字だけで本番権限を得られる設計ではない。

## 監査とファイル保存

`audit.ts` はgenesis、状態、全イベントのhash chainを持つ。イベントにはrequestId・actorRef・時刻・許可済みcommand・連番・前後の状態hash・結果を保存する。未知キーを含むcommandは値を残さず、INVALID_COMMANDとして記録する。不正requestId/actor/時刻、破損済み履歴、容量超過は安全に監査を追加できないため書込み自体を保留する。

読み込み時は全イベントを再生して結果とsnapshotを照合する。同一requestIdの再送は履歴を増やさず、現在のsnapshotとreplayed=trueを返す。後続イベントがあっても過去snapshotへ戻さない。requestIdを再利用して内容・actor・時刻を変更した場合は競合となる。

根拠IDはbinding＋端末で全履歴を照合し、最新観測から消えたIDも内容違いで使い直せない。genesisは観測なし・明示された掲載成立時刻が必須。既存の観測入りsnapshotや前回のplain JSONファイルは、自動で履歴の正本へ昇格しない。承認された明示移行が別途必要。

掲載希望を更新するとchangedAtを処理時刻で記録する。物件版の逆行・同一ミリ秒で異なるhashを拒否。観測時刻が物件版または掲載成立時刻より古ければ、最新revisionを指定していても現状確認に使わない。

`local-media-store.ts` は状態と監査を一つのJSONに格納する。unit28で他のローカル台帳と同じ `private-journal-store.ts` に保存処理を統一し、排他lock→再読取り→全履歴検査→一時ファイルsync→rename→directory syncを行う。初期作成でもdirectoryを同期し、同一requestの再送では履歴を増やさずfile/directoryの同期を再確認する。保持上限は1,000イベント・実読取8MB。最終fileのsymlink/非通常file/他ユーザーに権限があるfileは保留し、権限の自動変更はしない。超過時は停止し、自動削除・切捨て・無検証checkpointを行わない。rename/directory sync/cleanup後の結果が不明なら `STORE_OUTCOME_UNKNOWN`。残留lockは手動で状態を確認するまで解除しない。時刻・requestId・actorRefを持つAuditRequestを必須とし、request.atは再送時にも同じ値を使う。アプリからの既存呼出しはなく、ローカル試験だけが利用している。

unit28は既存JSON形式、applyのstate/replayed/auditSequenceとcreateのvoid/throw契約を保持する。無効なstateと成立時刻不明のgenesisは従来の例外、既存fileはEEXIST、作成後の同期結果不明はSTORE_OUTCOME_UNKNOWN。作成fileを開く段階のその他I/O失敗は生のOS情報を返さずLOCAL_IO_ERRORに固定し、open後のwrite/sync/close失敗はSTORE_OUTCOME_UNKNOWNにする。合成fileでdirectory同期失敗・再送・権限・stat後のサイズ増加・API互換を検査した。実機の電源断や異なるfilesystemの耐久性は未検証。

hash chainは破損・順序・再生整合性の検査であり、署名や外部固定点はない。全履歴を再計算できる管理者に対する改変不能性、末尾を過去の完全な状態へ戻す攻撃の検出は未実装。保存先directoryとその祖先、協調しない別writerの操作に対する隔離もこのfile lockでは保証しない。正式な監査保管には別権限の保管先/固定点と復旧手順が必要。

## DBアダプター

`db-media-store.ts` はSqlPortを注入するfactoryだけを提供する。Prisma/Supabase client、環境変数、接続URL、schedulerを読まない。稼働コードへ配線していない。

対象は既存propertiesのIDに関連する独立したstate/audit案。properties.idの実型に合わせTEXTを使い、requestIdのみUUID。状態行をFOR UPDATEし、最大1,001イベントを取得して検証し、監査INSERTとstateの版/hash条件付きUPDATEを同一transactionで行う。properties本体は更新しない。初期化済み行がなければ保留し、暗黙の新規登録は行わない。

- driverはcommit/rollbackを担当し、rollbackを確認した場合だけRolledBackTransactionを返す契約。その他の例外はcommit結果不明として扱う。
- 結果不明時は同じrequestIdと元の時刻・内容を保持し、状態を再確認する。新IDを発行して処理をやり直さない。
- SQL値はすべてパラメーター。table名は固定。snapshot/hash/binding不一致は書込み前に拒否。
- proposal SQLはBEGIN/COMMIT内にCREATE・RLS・REVOKEを含む。既存roleの変更はここでは行わず、実runtime roleの最小権限とauditのUPDATE/DELETE制限は適用前の別レビュー事項。

モックではCAS失敗、INSERT失敗、同時要求、commit結果不明、再送、別binding、破損を検査した。PGlite 0.5.11のメモリ内PostgreSQLでは、実パラメーターSQL・transaction rollback・unique制約・role拒否・物件本体不変を検査した。実Postgresへの並列接続、実runtime role、Data API、既存データ移行は未検証。

## 次の段階

ルール履歴の人による確定、B01診断との接続、ルール版を固定した変更計画と監査の接続、媒体許諾・asset確認・writer lease/fencing・transactional outbox・公開readbackが後続。今回のappliedはローカル状態/監査の保存を意味し、媒体の公開成功ではない。自己改善による条件/評価基準/権限の変更機能は追加していない。
