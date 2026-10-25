# 容量予約台帳のprivate file保存

unit13。`local-capacity-store.ts` はcapacity journalをローカルfileへ保存する。実際の媒体枠を確保したり、媒体に予約APIを呼んだりする機能ではない。

unit8で検証したfile処理を `private-journal-store.ts` へ抽出し、plan/capacityで共用する。journalの生成・検証・コマンド適用・業務errorは各実装が担当し、共通層は排他、サイズ、0600、NOFOLLOW/NONBLOCK、atomic rename、file/directory同期だけを担当する。既存plan wrapperの公開関数・戻り値・error codesは維持した。

作成は新規wxのみ、既存/部分fileを上書きしない。applyはlock後に再読取りして保管側clockを取得する。recordedならoutcome=heldでも監査を保存し、追記前heldは保存しない。replayedも現在file/directoryを同期してから返し、同期障害が続く間は結果不明を維持する。

capacity側の11合成試験では、予約・着手・反映対応・終端解放それぞれの保存後応答喪失を実temp fileで検証した。再読取りと同requestIdでイベント数と加算/解放状態が変わらないこと、同時writer/CAS、同期障害継続、部分書込み、残留lock、異なるjournal種別の拒否も確認した。既存plan17試験も変更せず通過し、独立側で計28試験と全体型検査に合格。

自動lock解除、破損修復、履歴切詰め、再送時の新requestId発行はしない。保存結果不明を媒体操作成功と解釈しない。現在の容量は歴史的outcomeから推測せず、読取り後の `currentCapacity` でscope/時刻を照合する。

協調lockに従わない書換え、親directoryのsymlink、同じOSユーザーによる悪意の変更、台帳全体のrollback、実電源断、別host/DB transactionは未検証。全結果executable:falseを維持し、媒体の契約・観測・終端証拠の真正性は別途確認する。
