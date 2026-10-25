# 媒体別の広告・素材許諾を照合する契約

unit11、T06のローカル部分。`matchPlanPermissionEvidence(plan, manifest, history, now)` は根拠の申告内容を照合する純粋関数であり、契約上の権限・根拠の真正性を認定するものではない。DB/媒体/画像へ接続せず、新たな許諾を発行・推定しない。

## 照合対象

property・募集episode・媒体・市場・全体/個別顧客scopeを完全一致で区別する。site許可はathomeへ、個別顧客用の許可は全体へ流用しない。広告許可、公開payloadの素材許可、各写真/間取り図の素材許可を別系列として要求する。広告許可だけでは写真・本文の利用許可にならない。

各系列は開始済みの最大versionを先に選び、状態・期限・根拠参照を検査する。最新のpending/denied/revoked/expiredが存在する場合に承認済み旧版へ戻らない。同版重複、複数family、版と開始時刻の逆転も保留する。mock/unknown取得は確認済みに昇格しない。

素材はassetId系列の最新版を選んでからkind/contentHashを照合する。最初にhashで絞って古い一致版を復活させない。公開用のレビューは内容hashに結び付いたcleared/時刻/reviewer参照が必要で、blocked/unreviewed/未来時刻は保留。これらは入力された確認記録の整合性検査であり、画像画素のAD/業者帯検査を実行したことにはならない。

許諾は `effectiveFrom <= now < effectiveUntil` で確認する。計画の失効時刻まで許諾期間が届かない場合、または計画期間内に開始する既知の後続版がある場合は保留する。計画の失効時刻と次版の開始時刻が等しい場合、計画期間は終了を含まないため旧版の期間内として扱う。実行直前の再読取りは別途必要。

## manifestと返却値

manifestはplanのbinding/scope/source versionに結び付き、公開payloadのhashと素材ID/kind/hashの集合を持つ。assetId重複や同ID別hashを拒否する。公開payloadのnormalizationVersion=1はこの新しいmanifest契約の識別子であり、既存IndexNow用hashの互換性や媒体別payload生成を実装したという意味ではない。正式なcompilerが必要。

最終payloadが参照する全素材を、この関数は独自に列挙・検証できない。したがって `inventoryVerified` はfalseのみを許容し、申告素材が空/不足していて根拠が一致しても完全性gateを通過させない。入力のtrueで確認済みにする経路はない。

全申告内容が一致した場合も `status:held / executable:false / evidenceMatched:true`。真正性、素材集合の完全性、最終payload/画像確認、writer直前再検査をpendingとして返す。plan ID/job版/hash、source版、manifest hash、checkedAt/期限、選択した根拠ID/version/hashを固定し、根拠本文・URL・報酬・個人情報を返さない。取下げ計画は別の処理として保留し、広告許可の失効から取下げ実行を推論しない。

既存plan/preflightの8gateは変更していない。この単位は許諾データを将来接続するための照合契約であり、既存writerに追加の操作権限を与えない。35合成試験でT06の境界を確認した。実根拠、画像、ATBB契約/枠、本番の挙動は未検証。
