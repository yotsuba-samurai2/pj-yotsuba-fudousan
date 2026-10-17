# コラム生成・レビュー・公開判定（2026-10-18）

- 生成・機械検証：成功 6本
- レビュー処理：success ／ 判定：true
- レビュー指摘：blocker 0／major 0／minor 2
- 今回の候補指紋に対応する公開証跡登録：2本
- 自動公開の品質候補：2本
- 品質保留：4本 ／ 公開日待ち：0本
- 未確認の一次資料：1件
- 本番公開：この処理では実行していません。公開済み件数は未照会です。

2本は品質確認済み候補です。手動保留・既存DB・公開日・有効期限を公開実行時に再判定します。公開完了は実行結果で確認してください。
未確認記事の品質保留はforceでも解除しません。

## 記事別の判定

- 葬儀式場（セレモニーホール）はどんな物件なら開ける？用途地域・駐車場・近隣対応：held（realestate:sogi-ceremony-hall-bukken-youto-chusha-kinrin）
  - enの内部リンクに言語不一致があります
  - zh-twの内部リンクに言語不一致があります
  - zhの内部リンクに言語不一致があります
  - 公開レビュー記録が未登録または重複しています
  - 確認済みの公的な一次根拠が不足しています
  - 未確認一次資料：https://www.mlit.go.jp/toshi/city_plan/toshi_city_plan_tk_000043.html — 用途地域と建築制限（建基法第48条・別表第二）の枠組み。都計法第8/9条（用途地域）・第29/34/43条（開発許可・市街化調整区域の建築等）、建基法第87条（用途変更）、消防法施行令別表第一の各引用は標準的条文で記事内および4言語間で整合。第48/87条・都計法・消防令は本セッションでは直接全文取得していないため、国交省の用途地域概要ページを一次確認の出発点として併記。
- 相続した共有不動産の持分を他の相続人が買取業者へ売ったら？見知らぬ共有者への対応と出口：held（realestate:souzoku-kyoyu-mochibun-dai3sha-baikyaku-bunkatsu）
  - enの内部リンクに言語不一致があります
  - zh-twの内部リンクに言語不一致があります
  - zhの内部リンクに言語不一致があります
  - 公開レビュー記録が未登録または重複しています
- 探偵業を始めるには？探偵業法の届出・営業所の要件・欠格事由を行政書士が解説：held（legal:tantei-gyo-todokede-eigyosho-youken-koan）
  - enの内部リンクに言語不一致があります
  - zh-twの内部リンクに言語不一致があります
  - zhの内部リンクに言語不一致があります
  - 公開レビュー記録が未登録または重複しています
  - 確認済みの公的な一次根拠が不足しています
- 残されるペットのために遺せる？負担付遺贈・ペット信託の遺言文案を行政書士が整理：held（legal:petto-shintaku-futankitsuki-izo-yuigon）
  - enの内部リンクに言語不一致があります
  - zh-twの内部リンクに言語不一致があります
  - zhの内部リンクに言語不一致があります
  - 公開レビュー記録が未登録または重複しています
- 勤務間インターバル制度は義務？努力義務の中身と就業規則への入れ方：quality-eligible（labor:kinmukan-interval-doryoku-gimu-shugyokisoku-roumu）
- 外国人材の寮費・食費は給料から引ける？賃金全額払いの原則と控除の実務：quality-eligible（labor:ikusei-shuro-ryohi-shokuhi-koujo-chingin-zengaku-barai）

## レビューの指摘

- [minor] scripts/legal-columns/en/121-tantei-gyo-todokede-eigyosho-youken-koan.md：拘禁刑のローマ字表記が「kinkinkei」となっているが、正しくは「kōkinkei（koukinkei）」。法的内容・条項の誤りではなく表記上の軽微な誤り。 ／ 修正案：参考のため指摘（本レビューではファイルを変更しない）。将来の修正時に「koukinkei」等へ。pass判定に影響なし。
- [minor] scripts/realestate-columns/en/129-souzoku-kyoyu-mochibun-dai3sha-baikyaku-bunkatsu.md：相続不動産相談窓口へのリンクが「(Japanese)／（日文）」と注記されつつ、URLはロケール前置の /en/souzoku・/zh-tw/souzoku・/zh/souzoku を指す。注記とURLの整合が取れていない。legal系EN記事では /souzoku（注記なし）と扱いが異なり、記事セット間で不統一。 ／ 修正案：参考のため指摘（本レビューではファイルを変更しない）。注記とリンク先ロケールを一致させると丁寧。法的内容・翻訳一致には影響せずpass判定に影響なし。

実行証跡：https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/39044455640
