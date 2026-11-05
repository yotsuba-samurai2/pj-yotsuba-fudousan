# コラム生成・レビュー・公開判定（2026-11-06）

- 生成・機械検証：成功 6本
- レビュー処理：success ／ 判定：true
- レビュー指摘：blocker 0／major 0／minor 1
- 今回の候補指紋に対応する公開証跡登録：1本
- 自動公開の品質候補：1本
- 品質保留：5本 ／ 公開日待ち：0本
- 未確認の一次資料：4件
- 本番公開：この処理では実行していません。公開済み件数は未照会です。

1本は品質確認済み候補です。手動保留・既存DB・公開日・有効期限を公開実行時に再判定します。公開完了は実行結果で確認してください。
未確認記事の品質保留はforceでも解除しません。

## 記事別の判定

- 歯科診療所を開くための物件要件とは？エックス線室の防護構造と開設届の流れ：held（realestate:shika-shinryojo-bukken-x-sen-boigo-kaisetsu-todokede）
  - 公開レビュー記録が未登録です
  - 確認済みの公的な一次根拠が不足しています
  - 未確認一次資料：https://laws.e-gov.go.jp/law/325AC0000000201 — 建築基準法別表第二＝用途地域内の建築物制限（無床診療所は全用途地域で建築可、病院は低層住専・工専等で制限）。確立した内容で記事と整合するが、本審査セッションで条文本体の直接取得は未実施。
- 相続した工場・倉庫にアスベストがあるかも？現況のまま売るか除去してから売るか：held（realestate:souzoku-koujou-asbestos-kaitai-genjo-baikyaku）
  - 公開レビュー記録が未登録です
  - 確認済みの公的な一次根拠が不足しています
  - 未確認一次資料：https://laws.e-gov.go.jp/law/343AC0000000097 — 大気汚染防止法第18条の15＝解体等工事の石綿事前調査結果報告（令和4年4月1日以降着工が対象、報告義務は元請業者・自主施工者＝施工者）。報告規模の目安（解体80㎡以上・改修/工作物100万円以上）、令和5年10月1日以降の有資格者調査も含め、確立した運用内容で記事と整合するが本セッションでの条文本体の直接取得は未実施。
  - 未確認一次資料：https://laws.e-gov.go.jp/law/129AC0000000089 — 民法第562条以下＝契約不適合責任、第572条＝担保責任を負わない特約でも知りながら告げなかった事実は免責されない。確立した条文で記事と整合するが本セッションでの直接取得は未実施。
- 風俗営業の許可は相続できるのか—60日以内の承継承認とみなし営業：held（legal:souzoku-fuzoku-eigyo-kyoka-shoukei-minashi-todokede）
  - enの内部リンクに言語不一致があります
  - zh-twの内部リンクに言語不一致があります
  - zhの内部リンクに言語不一致があります
  - 公開レビュー記録が未登録です
- 盛土規制法の許可はいつ必要になるのか—宅地造成・特定盛土等の区域と申請の流れ：held（legal:moritsuchi-kisei-ho-takuchi-zosei-tokutei-moritsuchi-kyoka）
  - enの内部リンクに言語不一致があります
  - zh-twの内部リンクに言語不一致があります
  - zhの内部リンクに言語不一致があります
  - 公開レビュー記録が未登録です
- 中国駐在が5年を超えたら社会保険はどうなるのか？適用証明書の延長と二重加入の回避：quality-eligible（labor:chugoku-chuzai-tekiyo-shomeisho-encho-5nen-koe-shakaihosho）
- 通勤中の交通事故は労災か自賠責か？第三者行為災害の届出と求償：held（labor:tsukin-saigai-daisansha-koui-saigai-jibaiseki-rosai）
  - 公開レビュー記録が未登録です
  - 確認済みの公的な一次根拠が不足しています
  - 未確認一次資料：https://www.mhlw.go.jp/bunya/roudoukijun/rousaihoken06/dl/06a.pdf — 厚生労働省・労働局『第三者行為災害のしおり』：第三者行為災害届を遅滞なく提出、自賠責先行/労災先行は被災者が選択（同一事由で重複受給不可）、全部示談で示談額以外の請求権を放棄すると原則として示談成立後の労災給付は行われない、示談後は速やかに示談書写しを提出。記事の記述と整合（しおりの一般的運用として確認。参照URLは代表例であり本セッションでの当該PDF本体の直接取得は未実施）。

## レビューの指摘

- [minor] scripts/legal-columns/en/155-souzoku-fuzoku-eigyo-kyoka-shoukei-minashi-todokede.md：legal系の翻訳（en/zh/zh-tw）の内部リンクがロケール前置なしの絶対URL（https://luck428.com/legal/... ・ /souzoku）で、realestate・labor翻訳の /en/・/zh/・/zh-tw/ 前置と不統一。英語・中文の読者が日本語ページに着地する可能性がある（155・156の全訳文で同様）。 ／ 修正案：legalサイトのロケールルーティングを確認し、/en/legal/... 等のロケール前置が必要なら統一する。本文・法的正確性には影響しないため公開可否は左右しない。

実行証跡：https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/42096784030
