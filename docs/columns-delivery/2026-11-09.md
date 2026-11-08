# コラム生成・レビュー・公開判定（2026-11-09）

- 生成・機械検証：成功 3本
- レビュー処理：success ／ 判定：false
- レビュー指摘：blocker 0／major 1／minor 1
- 今回の候補指紋に対応する公開証跡登録：0本
- 自動公開の品質候補：0本
- 品質保留：3本 ／ 公開日待ち：0本
- 未確認の一次資料：1件
- 本番公開：この処理では実行していません。公開済み件数は未照会です。

正午の自動公開に渡せる品質候補は0本です。3本は保留、0本は公開日待ちです。
未確認記事の品質保留はforceでも解除しません。

## 記事別の判定

- 繁体字・簡体字対応｜中国・台湾の投資家が日本の土地を買うとき必要な国土利用計画法の事後届出：held（realestate:chugokugo-kokudo-riyo-keikaku-ho-jigo-todokede-menseki）
  - enの内部リンクに言語不一致があります
  - zh-twの内部リンクに言語不一致があります
  - zhの内部リンクに言語不一致があります
  - 公開レビュー記録が未登録です
  - 候補指紋と修正後原稿が一致しません
  - 独立レビューの証跡不足、重複、またはレビュー後の原稿変更
  - 未確認一次資料：https://www.mlit.go.jp/totikensangyo/totikensangyo_tk2_000018.html — 記事が『国土交通省「土地取引規制制度（国土利用計画法）」』として引用したURL。実際の表示内容は『土地問題に関する国民の意識調査』で、事後届出制度の解説ではない（引用先不一致）。
- 経営・管理ビザ2025年10月改正｜資本金3,000万円・常勤職員・経過措置の要点（中国・台湾の起業家向け）：held（legal:keiei-kanri-zairyu-2025-kaisei-shihonkin-joukin-shokuin-chuka-taiwan）
  - enの内部リンクに言語不一致があります
  - zh-twの内部リンクに言語不一致があります
  - zhの内部リンクに言語不一致があります
  - 公開レビュー記録が未登録です
  - 独立レビューに未解決の重大な指摘があります
- 印刷会社の開業・労務——有機溶剤や深夜勤務の安全衛生と労働時間管理：held（labor:insatsu-gyo-kaigyo-roumu-yuuki-youzai-shinya-anzen-eisei）
  - 公開レビュー記録が未登録です
  - 独立レビューに未解決の重大な指摘があります

## レビューの指摘

- [major] scripts/realestate-columns/100-chugokugo-kokudo-riyo-keikaku-ho-jigo-todokede-menseki.md：「この記事の出典（一次情報）」節で https://www.mlit.go.jp/totikensangyo/totikensangyo_tk2_000018.html を「国土交通省『土地取引規制制度（国土利用計画法）』」として引用しているが、このURLは実際には『土地問題に関する国民の意識調査』という無関係のページを表示する（2026-11-08に2回取得して確認）。4言語（ja/en/zh-tw/zh）すべてに同一の誤URLが入る。法令内容自体はe-Gov法令検索・内閣府ページ・国交省PDF・複数のlg.jpで独立に裏取りでき読者を誤導しないが、一次情報の出典URLが称する内容と別ページを指す欠陥。 ／ 修正案：当該URLを実際の国交省『土地取引規制制度（国土利用計画法）』の正しいページ、または国交省の土地取引規制PDF（例: tochi_fudousan_kensetsugyo配下の該当資料）やe-Gov法令本文へ差し替える。4言語すべてを同時に修正する。
- [minor] scripts/legal-columns/161-keiei-kanri-zairyu-2025-kaisei-shihonkin-joukin-shokuin-chuka-taiwan.md：日本語能力基準を『CEFRのB2相当以上』と表記しているが、出入国在留管理庁の公式表記は『日本語教育の参照枠』におけるB2相当以上。参照枠はCEFRを基に作られた国内の枠組みで近接するが、公式の呼称とは厳密には一致しない。 ／ 修正案：『「日本語教育の参照枠」のB2相当以上（CEFRのB2に相当）』のように公式呼称を主にして補足する形へ調整（任意。事実関係に誤りはない）。

実行証跡：https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/42506786823
