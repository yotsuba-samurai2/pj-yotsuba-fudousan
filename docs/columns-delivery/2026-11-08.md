# コラム生成・レビュー・公開判定（2026-11-08）

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

- 重要土地等調査法の注視区域・特別注視区域では、不動産取引で何の届出が要るか：held（realestate:juyo-tochi-chosa-ho-chushi-tokubetsu-chushi-torihiki-todokede）
  - 公開レビュー記録が未登録です
  - 確認済みの公的な一次根拠が不足しています
- 2024年4月からの省エネ性能表示制度で、不動産の売買・賃貸広告は何が変わったか：quality-eligible（realestate:kenchiku-shoene-ho-shoene-seino-hyoji-koukoku-2024）
- 農地所有適格法人として農業に参入するには、どんな要件を満たす必要があるか：held（legal:nochi-shoyu-tekikaku-hojin-setsuritsu-youken-nogyo-sannyu）
  - enの内部リンクに言語不一致があります
  - zh-twの内部リンクに言語不一致があります
  - zhの内部リンクに言語不一致があります
  - 公開レビュー記録が未登録です
  - 確認済みの公的な一次根拠が不足しています
- 家族滞在の在留資格で家族を呼び寄せ、本人が働くには何が必要か：held（legal:kazoku-taizai-zairyu-shikakugai-katsudo-28jikan-yobiyose）
  - enの内部リンクに言語不一致があります
  - zh-twの内部リンクに言語不一致があります
  - zhの内部リンクに言語不一致があります
  - 公開レビュー記録が未登録です
  - 確認済みの公的な一次根拠が不足しています
- 林業の労務――労働時間の適用除外から外れる点とチェーンソーの特別教育：held（labor:ringyo-roumu-roudoujikan-41jo-bakuboku-tokubetsu-kyoiku）
  - 公開レビュー記録が未登録です
  - 確認済みの公的な一次根拠が不足しています
- 65歳以上を複数の事業所で雇うとき、雇用保険マルチジョブホルダー制度はどう使う？：quality-eligible（labor:koyohoken-multi-job-holder-65sai-fukusu-jigyosho）

## レビューの指摘

- [minor] scripts/legal-columns/160-kazoku-taizai-zairyu-shikakugai-katsudo-28jikan-yobiyose.md：不法就労助長罪の厳罰化（令和6年法律第60号＝5年以下の拘禁刑又は500万円以下の罰金）を『引き上げられました』と完了形で記しているが、当該罰則の施行日は2027年4月1日で、本日（2026-11-07）時点では未施行（現行は3年以下／300万円以下）。本文は『施行日の詳細は官報・法務省の告示で確認してください』と留保しており虚偽ではなく、4言語で同一表現。 ／ 修正案：現行刑と改正後刑を分けて示し、改正後の5年/500万円は『改正法で定められたが未施行（施行は官報・法務省告示で確認）』である旨を明示するとより正確。ファイルは変更しない旨の指示のため指摘のみ。

実行証跡：https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/42397339096
