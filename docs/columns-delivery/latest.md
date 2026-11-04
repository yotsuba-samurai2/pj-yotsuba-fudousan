# コラム生成・レビュー・公開判定（2026-11-05）

- 生成・機械検証：成功 6本
- レビュー処理：success ／ 判定：true
- レビュー指摘：blocker 0／major 0／minor 2
- 今回の候補指紋に対応する公開証跡登録：4本
- 自動公開の品質候補：4本
- 品質保留：2本 ／ 公開日待ち：0本
- 未確認の一次資料：0件
- 本番公開：この処理では実行していません。公開済み件数は未照会です。

4本は品質確認済み候補です。手動保留・既存DB・公開日・有効期限を公開実行時に再判定します。公開完了は実行結果で確認してください。
未確認記事の品質保留はforceでも解除しません。

## 記事別の判定

- ペット火葬場・動物霊園を開くための物件—用途地域と自治体条例の設置許可：quality-eligible（realestate:doubutsu-kasoujo-petto-reien-bukken-youto-jorei）
- 中国・台湾のオーナー向け—日本の収益物件を「定期借家」で貸す：普通借家との違いと再契約：quality-eligible（realestate:chugokugo-owner-teiki-shakuya-futsu-chigai-saikeiyaku）
- 風俗営業2号・3号（低照度飲食店・区画席飲食店）の許可—要件と物件の距離制限：held（legal:fuzoku-eigyo-2go-3go-teishoudo-kukakuseki-kyoka）
  - enの内部リンクに言語不一致があります
  - zh-twの内部リンクに言語不一致があります
  - zhの内部リンクに言語不一致があります
  - 公開レビュー記録が未登録です
- 相続人に外国籍の人がいるとき—法定相続情報一覧図は使えるのか：held（legal:gaikokuseki-souzokunin-houtei-souzoku-ichiran-zu-kahi）
  - enの内部リンクに言語不一致があります
  - zh-twの内部リンクに言語不一致があります
  - zhの内部リンクに言語不一致があります
  - 公開レビュー記録が未登録です
- 外国人を解雇・雇止めするとき——在留資格と「特定活動（出国準備・就職活動）」への移行：quality-eligible（labor:gaikokujin-kaiko-yatoidome-zairyu-shikaku-tokutei-katsudo）
- コールセンターの労務——シフト制・深夜割増・在宅混在の労働時間管理：quality-eligible（labor:callcenter-shift-shinya-zaitaku-roudoujikan-roumu）

## レビューの指摘

- [minor] scripts/realestate-columns/161-chugokugo-owner-teiki-shakuya-futsu-chigai-saikeiyaku.md：本文・FAQ・出典が「賃料を支払う借主が原則20.42%を源泉徴収して翌月10日までに納付」と述べ、国税庁No.2884を根拠に挙げるが、同ページ（直接確認済み）に『翌月10日』の納付期限は記載がない。20.42%・個人居住用の非課税・所法212/213・所令328は同ページで確認できたが、納付期限は所得税法本体の一般則。 ／ 修正案：納付期限の根拠として所得税法第212条（源泉徴収義務・翌月10日納付）を明示するか、No.2884に限定した記述に整える。法的には正しいため公開可否には影響しない。
- [minor] scripts/legal-columns/en/153-fuzoku-eigyo-2go-3go-teishoudo-kukakuseki-kyoka.md：行政書士（legal）系の翻訳記事（153・154の en/zh-tw/zh）は内部リンク・著者リンクをロケール前置なし（例 https://luck428.com/legal/column/... , https://luck428.com/about/uramatsu）で出力している。不動産（/en/,/zh-tw/,/zh/）・社労士（/en/labor/ 等）の翻訳はロケール前置があり、方針が記事種別で不一致。legal セクションにロケール別ルートが存在する場合、英語・中国語読者が日本語ページに着地する。 ／ 修正案：legal セクションの i18n ルーティングを確認し、ロケール別ページが存在するなら翻訳の内部リンク・著者リンクにロケール前置を付す。存在しないなら現状で正しい（内容・法的正確性には影響しない）。

実行証跡：https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/41898462975
