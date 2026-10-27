# コラム生成・レビュー・公開判定（2026-10-28）

- 生成・機械検証：成功 6本
- レビュー処理：success ／ 判定：false
- レビュー指摘：blocker 1／major 0／minor 0
- 今回の候補指紋に対応する公開証跡登録：0本
- 自動公開の品質候補：0本
- 品質保留：6本 ／ 公開日待ち：0本
- 未確認の一次資料：0件
- 本番公開：この処理では実行していません。公開済み件数は未照会です。

正午の自動公開に渡せる品質候補は0本です。6本は保留、0本は公開日待ちです。
未確認記事の品質保留はforceでも解除しません。

## 記事別の判定

- 非居住の中国語オーナーが保有物件を民泊にするとき、不在のまま届出と管理はどうしますか？：held（realestate:hikyojusha-chuka-owner-minpaku-jutaku-shukuhaku-kanri-itaku）
  - 公開レビュー記録が未登録です
  - 候補指紋と修正後原稿が一致しません
  - 独立レビューの証跡不足、重複、またはレビュー後の原稿変更
- 輸入した貨物を関税前に置く「保税蔵置場」にできる倉庫物件の条件は？：held（realestate:hozei-zochijo-souko-bukken-youken-yunyu）
  - 公開レビュー記録が未登録です
  - 独立レビューに未解決の重大な指摘があります
- 海外に住む相続人が日本の相続を放棄するには｜在外からの申述と3か月の起算：held（legal:zaigai-souzokunin-souzoku-houki-gentei-shonin-tetsuzuki）
  - 公開レビュー記録が未登録です
  - 独立レビューに未解決の重大な指摘があります
- 引取業・フロン類回収業の登録とは｜自動車リサイクル法の要件と流れ：held（legal:jidosha-recycle-hikitori-furon-kaishu-gyo-touroku）
  - 公開レビュー記録が未登録です
  - 独立レビューに未解決の重大な指摘があります
- 特定技能の外国人が転職するとき、社会保険と雇用保険の手続はどう引き継ぎますか？：held（labor:tokutei-ginou-tenshoku-tenseki-shakaihoken-koyohoken-hikitsugi）
  - 公開レビュー記録が未登録です
  - 独立レビューに未解決の重大な指摘があります
- ゴルフ場のキャディを業務委託にできますか？手待ち時間や季節変動はどう扱いますか？：held（labor:golf-jo-caddy-gyomuitaku-roudoushasei-henkei-roudoujikan）
  - 公開レビュー記録が未登録です
  - 独立レビューに未解決の重大な指摘があります

## レビューの指摘

- [blocker] scripts/realestate-columns/144-hikyojusha-chuka-owner-minpaku-jutaku-shukuhaku-kanri-itaku.md：住宅宿泊事業法第11条第1項第1号の委託義務の閾値を誤記。本文は『国土交通省令・厚生労働省令で定める居室数（住宅宿泊事業法施行規則で6室）を超えるとき』とするが、観光庁の公式ページ（host/entrust.html）および施行規則第9条では、省令で定める居室の数は『5』であり、委託義務は居室数が5を超える場合（＝6室以上）に生じる。本文の数字は省令値・閾値とも誤り（6室の家主居住型物件を委託不要と誤認させる）。en（『six rooms under the enforcement regulation』）・zh-tw・zh（『施行規則定為6室』）も同一の誤りを転写している。 ／ 修正案：省令の居室数は『5』、委託義務は居室数が5を超える（6室以上）ときと訂正し、4言語すべてを同期。出典としても観光庁の該当ページで数値を確認する。（審査者はファイルを変更しないため、生成担当が修正すること）

実行証跡：https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/40553875873
