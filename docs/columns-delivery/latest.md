# コラム生成・レビュー・公開判定（2026-10-29）

- 生成・機械検証：成功 6本
- レビュー処理：success ／ 判定：true
- レビュー指摘：blocker 0／major 0／minor 2
- 今回の候補指紋に対応する公開証跡登録：3本
- 自動公開の品質候補：3本
- 品質保留：3本 ／ 公開日待ち：0本
- 未確認の一次資料：0件
- 本番公開：この処理では実行していません。公開済み件数は未照会です。

3本は品質確認済み候補です。手動保留・既存DB・公開日・有効期限を公開実行時に再判定します。公開完了は実行結果で確認してください。
未確認記事の品質保留はforceでも解除しません。

## 記事別の判定

- 児童発達支援（未就学・多機能型）の物件は用途地域と指導訓練室で決まる？：held（realestate:jido-hattatsu-shien-bukken-youto-chiiki-shidou-kunren-shitsu）
  - 公開レビュー記録が未登録です
  - 確認済みの公的な一次根拠が不足しています
- 相続した家の前面が共有私道だと、売却前に掘削承諾がいるのはなぜ？：quality-eligible（realestate:souzoku-kyoyu-shidou-kussaku-shodaku-infra-hikikomi-baikyaku）
- ゲームセンターやまあじゃん店の営業許可（風適法4号・5号）は何が要件？：held（legal:fuzoku-eigyo-4go-5go-game-center-mahjong-kyoka-youken）
  - enの内部リンクに言語不一致があります
  - zh-twの内部リンクに言語不一致があります
  - zhの内部リンクに言語不一致があります
  - 公開レビュー記録が未登録です
  - 確認済みの公的な一次根拠が不足しています
- 胎児に相続権はある？出生前の遺産分割はどう扱われるのか：held（legal:taiji-souzoku-886jo-isanbunkatsu-shussei-mae-torikai）
  - enの内部リンクに言語不一致があります
  - zh-twの内部リンクに言語不一致があります
  - zhの内部リンクに言語不一致があります
  - 公開レビュー記録が未登録です
- 認定こども園の保育教諭、シフトと社会保険の線引きはどうする？：quality-eligible（labor:ninteikodomoen-hoiku-kyoyu-shift-shakaihoken-roumu）
- 複数の会社で働く・役員を兼ねると社会保険はどうなりますか？（二以上事業所勤務届）：quality-eligible（labor:nii-ijo-jigyosho-kinmu-todoke-yakuin-tanjikan-shaho）

## レビューの指摘

- [minor] scripts/legal-columns/139-fuzoku-eigyo-4go-5go-game-center-mahjong-kyoka-youken.md：照度基準の根拠を「施行規則第7条」としているが、直接の一次読取り（e-GovはSPAで本文抽出不可）で条番号を確定できず、資料により第6条とするものもある。照度『10ルクス以下とならないための構造・設備』という実質基準自体は神奈川県警（lg.jp）および規則文言で確認済みで正しい。 ／ 修正案：公開前に現行の風営法施行規則をe-Govで直接参照し、4号・5号の構造設備技術基準（照度）の条番号が第7条で正しいか最終確認する。実質内容は正確なため本文修正は不要の可能性が高い。
- [minor] scripts/legal-columns/en/139-fuzoku-eigyo-4go-5go-game-center-mahjong-kyoka-youken.md：souzoku/legal系の翻訳（139・140の en/zh-tw/zh）は内部リンクをロケール前置なしの絶対URL（例 https://luck428.com/legal/nagare）で出力している。realestate翻訳（/en/・/zh-tw/・/zh/前置）および labor翻訳（/en/labor/…）とは規約が異なる。翻訳本文の主張一致には影響しないが、英語・中国語読者のリンク先が日本語ページ階層へ解決する懸念がある。 ／ 修正案：legalサイトのURL規約（ロケール前置の要否）を確認し、翻訳の内部リンク規約が意図どおりか seed バリデータ側で検証する。内容審査上の欠陥ではないためブロッキングではない。

実行証跡：https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/40742794028
