# 掲載枠と予約のローカル契約

unit12、T14。`capacity-reservations.ts` は純粋な状態遷移と監査replay。実媒体の枠を取得・確保せず、DBやwriterへ接続しない。全結果 `executable:false`。数値は入力設定であり、過去の109/110等の値を出荷しない。

## 枠の分離と不明値

1系列はmedia/accountRef/market/categoryRef/capacityPoolIdに固定。居住用賃貸・売買・事業用の区分とpoolを混同しない。独立枠と確認済みのpoolのみを扱い、shared/unknownは保留。`independent`という入力の真正性や、同じpoolを二つのjournalへ誤登録した場合の全体検出はこの関数では保証しない。

設定はversion、確認状態・契約根拠・確認日時、有効期間、limit、newListingUnitsを持つ。nullは不明であり0ではない。確認済み0枠は満枠として扱う。現在は新規掲載の必要単位だけに限定し、update/replaceを0枠や1枠へ推定しない。新しい設定がunconfirmedになっても保存し、旧版の値で予約を続けない。

snapshotは完全な使用数、観測日時/有効期限、取得種別/根拠、予約包含の対応を持つ。partial/unknown/mock、未来や期限切れ、不正な版は保留。枠が減る、使用数が上限を超える場合も既存予約を自動削除しない。

## 予約と結果不明

`reserve` はplan reference・対象部屋/募集回・必要単位・期限・設定version/hashを固定する。要求はjournalのsequence/headHashをCAS照合し、同じrequestIdの再送は再適用しない。同じreservationId/planIdの再利用、同じ部屋/募集回への並行予約も拒否する。予約期限は計画・設定・観測の有効期間を超えられない。

未着手のreservedだけは期限やcancelで加算対象から外せる。外部処理を将来開始する前に `begin_attempt` でattemptId/時刻を記録する契約。これはローカルで保持状態へ移すだけで、外部処理を実行しない。attemptedは期限切れでも枠を保持し、cancelだけでは解放しない。設定が変わった古い予約は着手を保留する。

観測usedに自社予約が含まれる場合、当該snapshotのreservationId/attemptId/plan reference/listingRef/units/観測日時の対応を照合した分だけ予約加算から外す。件数の増減から推定しない。次snapshotで対応が欠けた場合は保守的に再加算し、過少利用を許容する。新規掲載限定のため、初めて確認したlistingRefは全履歴で固定し、別IDへの再束縛を拒否する。

着手済みを解放するには、同snapshot時点の不在とattemptに結び付いたfailed_final/cancelled_finalの終端・最終性の証跡が必要。「検索で見つからない」だけは認めない。過去に成功を確認したattemptのfailed_finalは矛盾として保留。取消完了が既知の成功観測より前/同時刻でも保留し、後と確認できる場合だけ解放する。

設定/snapshot/対応表/予約の変化は単一イベントで更新する。全イベントを再生し、requestId、時刻、前後state/hash、CAS、結果を検査する。履歴上の成功を再送しても現在の予約有効性は別であり、`currentCapacity`で確認する。1000イベント/500予約の上限では履歴を削除して継続しない。

## 未実装と検証

47合成試験と独立47試験に合格。独立指摘の古い取消証跡による解放、掲載IDの再束縛を修正した。3市場、設定単位、unknown/0、競合、期限/取消、二重要求、応答喪失後の同ID照合、反映対応、履歴改変を検証した。

現時点は純粋関数であり、永続化・プロセス間lock・電源断は未接続。実媒体の計数、独立pool契約の真正性、反映/取消の終端証拠、最新plan registryとの一致、外部writerのfencingは未検証。snapshotや根拠への自己申告だけで実行権限を得られない。次段階はこのjournalの排他保存と保存結果不明の実ファイル試験。
