# コラム生成・レビュー・公開判定（2026-11-27）

- 生成・機械検証：成功 6本
- レビュー処理：success ／ 判定：false
- レビュー指摘：blocker 0／major 1／minor 0
- 今回の候補指紋に対応する公開証跡登録：0本
- 自動公開の品質候補：0本
- 品質保留：6本 ／ 公開日待ち：0本
- 未確認の一次資料：1件
- 本番公開：この処理では実行していません。公開済み件数は未照会です。

正午の自動公開に渡せる品質候補は0本です。6本は保留、0本は公開日待ちです。
未確認記事の品質保留はforceでも解除しません。

## 記事別の判定

- 医療モール（複数クリニック）の物件をつくる──用途地域・バリアフリー・消防と各科の開設届：held（realestate:iryo-mall-fukusu-clinic-bukken-youken-barrier-free）
  - 公開レビュー記録が未登録です
  - 候補指紋と修正後原稿が一致しません
  - 独立レビューの証跡不足、重複、またはレビュー後の原稿変更
  - 未確認一次資料：https://www.fdma.go.jp/singi_kento/kento/items/kento140_59_shiryo4-6.pdf — 消防法施行令別表第一(6)項イは病院・有床診療所・有床助産所に限られ、無床診療所は(6)項ハに分類される。本文の『病院・診療所・助産所は(6)項イ』は無床診療所について不正確。
- 相続した二世帯住宅を売る──区分登記か共有か、小規模宅地の特例と合併登記：held（realestate:souzoku-nisetai-jutaku-kubun-toki-kyoyu-baikyaku）
  - 公開レビュー記録が未登録です
  - 独立レビューに未解決の重大な指摘があります
- まつげエクステ・ネイルサロンの開業：美容所の届出が要る業態・要らない業態：held（legal:matsuge-ext-nail-salon-biyoujo-todokede-youhi）
  - 公開レビュー記録が未登録です
  - 独立レビューに未解決の重大な指摘があります
- 技人国ビザの立証：学歴・職歴と職務内容の関連性をどう示すか（中国・台湾人材）：held（legal:gijinkoku-zairyu-rissho-gakureki-shokumu-kanren-chuka-taiwan）
  - 公開レビュー記録が未登録です
  - 独立レビューに未解決の重大な指摘があります
- 労働者派遣事業の許可を取る──資産要件・派遣元責任者・マージン率の情報公開：held（labor:rodosha-haken-jigyo-kyoka-shisan-youken-hakenmoto-sekininsha-roumu）
  - 公開レビュー記録が未登録です
  - 独立レビューに未解決の重大な指摘があります
- 受託開発・SESの偽装請負と労働者性──発注者・受注者が整えるべき線引き：held（labor:ses-jutaku-kaihatsu-gisou-ukeoi-roudoushasei-roumu）
  - 公開レビュー記録が未登録です
  - 独立レビューに未解決の重大な指摘があります

## レビューの指摘

- [major] scripts/realestate-columns/198-iryo-mall-fukusu-clinic-bukken-youken-barrier-free.md：消防法施行令別表第一の分類が不正確。本文「防火対象物の用途区分は消防法施行令別表第1で定められ、病院・診療所・助産所は（6）項イに当たります」および出典節の「別表第1（（6）項イ＝病院・診療所・助産所…）」が、無床診療所について誤り。2016年（平成28年）改正後、(6)項イは病院・有床診療所・有床助産所に限られ、無床診療所（患者を入院させる施設を有しない診療所）・無床助産所は(6)項ハに分類される。本稿は無床診療所を医療モールの『標準的なテナント』と位置づけており、この一次資料の条項号の不正確さが本文の整合性と直接矛盾する。FDMA・自治体資料で確認（2026-11-26）。同じ記述が生成物 src/lib/data/realestate-columns-daily-seed.ts と4言語訳にも波及。 ／ 修正案：該当箇所を『(6)項イ＝病院・有床診療所・有床助産所、無床診療所・無床助産所は(6)項ハ』と区分して記述し直す（出典節・各言語訳も同様に修正）。有床/無床で消防基準が分かれるという本文の既存の主旨に合致させる。

実行証跡：https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/45896688157
