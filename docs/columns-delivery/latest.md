# コラム生成・レビュー・公開判定（2026-10-25）

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

- 看護小規模多機能型居宅介護（看多機）の事業所にできる物件とは——通い・泊まり・訪問看護を1棟でまかなう用途地域・消防・面積の確認点：held（realestate:kango-shoukibo-takino-bukken-youto-shobo-homon-kango）
  - 公開レビュー記録が未登録です
  - 独立レビューに未解決の重大な指摘があります
- 相続した実家が『周知の埋蔵文化財包蔵地』だったら売れるのか——文化財保護法93条の届出と発掘調査、売買での説明：held（realestate:souzoku-jikka-maizo-bunkazai-hozochi-baikyaku）
  - 公開レビュー記録が未登録です
  - 独立レビューに未解決の重大な指摘があります
- 化粧品製造販売業・製造業許可｜薬機法第12条・第13条の違いと三役・GQP/GVP：held（legal:keshohin-seizo-hanbaigyo-seizogyo-kyoka-yakkiho）
  - 公開レビュー記録が未登録です
  - 独立レビューに未解決の重大な指摘があります
- 日本人の配偶者等ビザ｜在留・更新で見られる婚姻の実体と22条の4の取消し（中国・台湾）：held（legal:nihonjin-haiguusha-biza-zairyu-koshin-henko-chuka-taiwan）
  - 公開レビュー記録が未登録です
  - 独立レビューに未解決の重大な指摘があります
  - 未確認一次資料：https://www.moj.go.jp/isa/index.html — 法務省が2012年7月にDV避難等で取消しを行わない具体例を公表（記事は一般例示として引用し個別判断は官署・弁護士に留保）
- 賞与（ボーナス）の社会保険料はどう決まるか——標準賞与額の上限と賞与支払届・不支給報告書：held（labor:shoyo-shakaihokenryo-hyojun-shoyogaku-jogen-shiharaitodoke）
  - 公開レビュー記録が未登録です
  - 独立レビューに未解決の重大な指摘があります
- 外国人を雇う事業主の『雇用管理指針』の努力義務とは——募集から雇用管理・離職まで確認する点：held（labor:gaikokujin-koyo-kanri-shishin-jigyonushi-doryoku-gimu）
  - 公開レビュー記録が未登録です
  - 候補指紋と修正後原稿が一致しません
  - 独立レビューの証跡不足、重複、またはレビュー後の原稿変更

## レビューの指摘

- [major] scripts/labor-columns/173-gaikokujin-koyo-kanri-shishin-jigyonushi-doryoku-gimu.md：外国人雇用状況の届出（労働施策総合推進法第28条）違反の罰則を「過料」と記載しているが、厚生労働省の一次情報では『30万円以下の罰金』（刑事罰）。過料（行政罰）と罰金（刑事罰）は法的性質が異なり、誤り。本文（離職・解雇の節）とFAQ Q1の2か所、および英語（civil fine）・繁体（過料）・簡体（过料）の全訳文に同じ誤りが波及している。 ／ 修正案：『過料』を『30万円以下の罰金』に修正（例：『怠ると30万円以下の罰金の対象になり得ます』）。英語は civil fine → a fine of up to 300,000 yen、中国語は『30萬日圓以下的罰金 / 30万日元以下的罚金』に統一。4言語すべてで同時に修正する。出典：厚労省『外国人雇用状況の届出』。

実行証跡：https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/40108111953
