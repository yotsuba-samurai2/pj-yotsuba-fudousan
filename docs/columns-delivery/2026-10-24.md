# コラム生成・レビュー・公開判定（2026-10-24）

- 生成・機械検証：成功 6本
- レビュー処理：success ／ 判定：true
- レビュー指摘：blocker 0／major 0／minor 1
- 今回の候補指紋に対応する公開証跡登録：1本
- 自動公開の品質候補：1本
- 品質保留：5本 ／ 公開日待ち：0本
- 未確認の一次資料：1件
- 本番公開：この処理では実行していません。公開済み件数は未照会です。

1本は品質確認済み候補です。手動保留・既存DB・公開日・有効期限を公開実行時に再判定します。公開完了は実行結果で確認してください。
未確認記事の品質保留はforceでも解除しません。

## 記事別の判定

- 就労移行支援の事業所にできる物件は——用途地域・バリアフリー・消防の確認点：held（realestate:shuro-ikou-shien-bukken-youto-chiiki-youken）
  - 公開レビュー記録が未登録です
  - 確認済みの公的な一次根拠が不足しています
- 相続した土地が『盛土規制区域』に入っていたら売れるのか——2023年施行の規制と売却の段取り：held（realestate:souzoku-morido-kisei-kuiki-takuchi-baikyaku）
  - 公開レビュー記録が未登録です
  - 確認済みの公的な一次根拠が不足しています
  - 未確認一次資料：https://www.mlit.go.jp/toshi/web/toshi_tobou_tk_000064.html — 本文が出典に掲げる国交省解説ページURL。現在HTTP 404で到達不能（minor指摘）。支える事実は morido.html とe-Govで裏取り済み。
- 毒物劇物販売業の登録｜店舗の設備基準・登録区分と毒物劇物取扱責任者：held（legal:dokugekibutsu-hanbaigyo-touroku-kozo-setsubi-kijun）
  - 公開レビュー記録が未登録です
  - 確認済みの公的な一次根拠が不足しています
- 相続放棄の熟慮期間3か月｜起算点と伸長申立て、過ぎた後に借金が判明したとき：held（legal:souzoku-hoki-jukuryo-kikan-shincho-kisanten）
  - 公開レビュー記録が未登録です
  - 担当分野の資格者確認が不足しています
- 一人親方や業務委託を使う事業者の新しい安全衛生義務とは——個人事業者等の保護（2025〜2027年施行）：held（labor:kojin-jigyosha-anzen-eisei-2026-sochi-gimu）
  - 公開レビュー記録が未登録です
  - 確認済みの公的な一次根拠が不足しています
- 2025年10月新設『教育訓練休暇給付金』とは——無給で学び直す従業員への給付と事業主の手続：quality-eligible（labor:kyoiku-kunren-kyuka-kyufukin-2025-mukyu-manabinaoshi）

## レビューの指摘

- [minor] scripts/realestate-columns/137-souzoku-morido-kisei-kuiki-takuchi-baikyaku.md (および en/zh-tw/zh の各翻訳)：出典として挙げる国土交通省『盛土規制法』解説ページのURL https://www.mlit.go.jp/toshi/web/toshi_tobou_tk_000064.html が現在404（WebFetchで2回とも Not Found）。国交省のページ再編で退避済みと見られる。参照日2026-10-23に閲覧した旨の記載と実際の到達性が食い違う。ただし当該URLが支える事実（令和5年5月26日施行・2規制区域・工事規制）は現行の国交省ページ https://www.mlit.go.jp/toshi/web/morido.html およびe-Gov法令で独立に裏取り済みで、法的主張の誤りはない。 ／ 修正案：リンク先を現行の https://www.mlit.go.jp/toshi/web/morido.html に差し替える（本審査ではファイルは変更しない）。

実行証跡：https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/39989816156
