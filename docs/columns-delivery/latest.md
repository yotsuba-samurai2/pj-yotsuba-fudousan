# コラム生成・レビュー・公開判定（2026-10-21）

- 生成・機械検証：成功 6本
- レビュー処理：success ／ 判定：true
- レビュー指摘：blocker 0／major 0／minor 1
- 今回の候補指紋に対応する公開証跡登録：2本
- 自動公開の品質候補：2本
- 品質保留：4本 ／ 公開日待ち：0本
- 未確認の一次資料：0件
- 本番公開：この処理では実行していません。公開済み件数は未照会です。

2本は品質確認済み候補です。手動保留・既存DB・公開日・有効期限を公開実行時に再判定します。公開完了は実行結果で確認してください。
未確認記事の品質保留はforceでも解除しません。

## 記事別の判定

- ネットカフェ・個室型インターネットカフェの物件はどう選ぶ？消防区画と本人確認条例の壁：held（realestate:net-cafe-kobetsu-shitsu-bukken-shobo-honnin-kakunin）
  - enの内部リンクに言語不一致があります
  - zh-twの内部リンクに言語不一致があります
  - zhの内部リンクに言語不一致があります
  - 公開レビュー記録が未登録です
- 遺言執行者が選任された相続不動産を売る：売主は誰で、媒介・決済の当事者はどうなる？：held（realestate:yuigon-shikkosha-sentei-fudosan-baikyaku-toujisha）
  - enの内部リンクに言語不一致があります
  - zh-twの内部リンクに言語不一致があります
  - zhの内部リンクに言語不一致があります
  - 公開レビュー記録が未登録です
- 一般社団法人の設立｜非営利型と普通型の違い・定款認証から登記まで：held（legal:ippan-shadan-houjin-setsuritsu-hieiri-teikan）
  - enの内部リンクに言語不一致があります
  - zh-twの内部リンクに言語不一致があります
  - zhの内部リンクに言語不一致があります
  - 公開レビュー記録が未登録です
  - 確認済みの公的な一次根拠が不足しています
- 高度専門職1号ビザのポイント計算｜中国・台湾の高度人材が70点を積む：held（legal:kodo-senmonshoku-1go-point-keisan-chuka-taiwan）
  - enの内部リンクに言語不一致があります
  - zh-twの内部リンクに言語不一致があります
  - zhの内部リンクに言語不一致があります
  - 公開レビュー記録が未登録です
- ジムのトレーナーは雇用か業務委託か、深夜・変形労働時間はどう組みますか？：quality-eligible（labor:fitness-gym-kaigyo-trainer-gyomuitaku-roumu）
- 無人・24時間セルフ店舗の巡回スタッフの「待機・手待ち時間」は労働時間になりますか？：quality-eligible（labor:mujin-24ji-tenpo-coin-laundry-junkai-machijikan-roumu）

## レビューの指摘

- [minor] scripts/labor-columns/165-mujin-24ji-tenpo-coin-laundry-junkai-machijikan-roumu.md：本文中の内部リンク（fitness-gym 記事へのリンク）のラベルが『無人・24時間セルフ店舗の労務』となっており、リンク先であるフィットネス・ジム開業労務記事の内容と一致しない。日本語・英語・中国語すべてで同じラベル付けのため翻訳不一致ではなく、原稿段階のラベル誤り。逆向き（164→165）のラベルは正しい。 ／ 修正案：165→164 のリンクラベルを『フィットネス・パーソナルジム開業の労務』等、リンク先の内容に合わせて修正する（4言語とも）。内容・法的正確性には影響しないため公開を妨げるものではない。

実行証跡：https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/39459209613
