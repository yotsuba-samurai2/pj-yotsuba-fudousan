# コラム生成・レビュー・公開判定（2026-11-26）

- 生成・機械検証：成功 6本
- レビュー処理：success ／ 判定：true
- レビュー指摘：blocker 0／major 0／minor 0
- 今回の候補指紋に対応する公開証跡登録：3本
- 自動公開の品質候補：3本
- 品質保留：3本 ／ 公開日待ち：0本
- 未確認の一次資料：0件
- 本番公開：この処理では実行していません。公開済み件数は未照会です。

3本は品質確認済み候補です。手動保留・既存DB・公開日・有効期限を公開実行時に再判定します。公開完了は実行結果で確認してください。
未確認記事の品質保留はforceでも解除しません。

## 記事別の判定

- 産廃の中間処理（破砕・選別）施設を開く物件：立地と都市計画でつまずかないために：quality-eligible（realestate:sanpai-chukan-shori-hasai-shisetsu-bukken-ricchi-youken）
- 中国語で検討する日本の『再建築不可』物件：接道義務と43条の但し書きのデューデリジェンス：quality-eligible（realestate:chugokugo-buyer-saikenchiku-fuka-sesshado-43jo-dd）
- はり・きゅう・あん摩マッサージ指圧の施術所を開く：開設届と構造設備基準：held（legal:harikyu-massage-sejutsujo-kaisetsu-todokede-kozo-setsubi）
  - 公開レビュー記録が未登録です
  - 確認済みの公的な一次根拠が不足しています
- 中国・台湾の親会社から駐在員を呼ぶ：「企業内転勤」の在留資格と手続：quality-eligible（legal:kigyonai-tenkin-zairyu-chuka-taiwan-chuzaiin-yobiyose）
- パン・洋菓子の店を開く──早朝勤務・変形労働時間制・固定残業代の設計：held（labor:bakery-yougashi-seizo-soucho-henkei-roudoujikan-roumu）
  - 公開レビュー記録が未登録です
  - 確認済みの公的な一次根拠が不足しています
- 中華・台湾料理店で外国人コックを雇う──在留資格「技能」の労務・社会保険・最低賃金：held（labor:ginou-zairyu-chuka-cook-koyo-shakaihoken-saitei-chingin-roumu）
  - 公開レビュー記録が未登録です
  - 確認済みの公的な一次根拠が不足しています

実行証跡：https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/45704422511
