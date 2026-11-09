# コラム生成・レビュー・公開判定（2026-11-10）

- 生成・機械検証：成功 6本
- レビュー処理：success ／ 判定：true
- レビュー指摘：blocker 0／major 0／minor 0
- 今回の候補指紋に対応する公開証跡登録：4本
- 自動公開の品質候補：4本
- 品質保留：2本 ／ 公開日待ち：0本
- 未確認の一次資料：0件
- 本番公開：この処理では実行していません。公開済み件数は未照会です。

4本は品質確認済み候補です。手動保留・既存DB・公開日・有効期限を公開実行時に再判定します。公開完了は実行結果で確認してください。
未確認記事の品質保留はforceでも解除しません。

## 記事別の判定

- 障害福祉の短期入所（ショートステイ）を始める物件は？併設型・単独型・空床利用型と指定基準：quality-eligible（realestate:shogai-tanki-nyusho-shortstay-bukken-shitei-kijun）
- 相続した農地で納税猶予を受けている——売るとどうなる？打切りと不動産の出口：quality-eligible（realestate:souzoku-nochi-nozei-yuyo-uchikiri-baikyaku）
- 建設業許可を取った後の『決算変更届（事業年度終了届）』は毎年いる？出し忘れの影響と各種変更届：held（legal:kensetsugyo-kessan-henko-todoke-jigyo-nendo-shuryo）
  - enの内部リンクに言語不一致があります
  - zh-twの内部リンクに言語不一致があります
  - zhの内部リンクに言語不一致があります
  - 公開レビュー記録が未登録です
  - 確認済みの公的な一次根拠が不足しています
- 『包括遺贈』と『特定遺贈』はどう違う？受遺者の権利義務と放棄の仕方：held（legal:houkatsu-tokutei-izo-chigai-juisha-hoki）
  - enの内部リンクに言語不一致があります
  - zh-twの内部リンクに言語不一致があります
  - zhの内部リンクに言語不一致があります
  - 公開レビュー記録が未登録です
  - 確認済みの公的な一次根拠が不足しています
- コンビニ（フランチャイズ加盟店）を開く労務——24時間シフト・深夜割増・留学生アルバイト：quality-eligible（labor:konbini-fc-kaigyo-roumu-shinya-ryugakusei-shift）
- 外国人を雇う前の在留カード確認——不法就労助長罪を避けるために雇用主がやること：quality-eligible（labor:zairyu-card-kakunin-fuho-shuro-josei-koyonushi-gimu）

実行証跡：https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/42709135682
