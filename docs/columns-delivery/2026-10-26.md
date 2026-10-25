# コラム生成・レビュー・公開判定（2026-10-26）

- 生成・機械検証：成功 5本
- レビュー処理：success ／ 判定：true
- レビュー指摘：blocker 0／major 0／minor 1
- 今回の候補指紋に対応する公開証跡登録：2本
- 自動公開の品質候補：2本
- 品質保留：3本 ／ 公開日待ち：0本
- 未確認の一次資料：1件
- 本番公開：この処理では実行していません。公開済み件数は未照会です。

2本は品質確認済み候補です。手動保留・既存DB・公開日・有効期限を公開実行時に再判定します。公開完了は実行結果で確認してください。
未確認記事の品質保留はforceでも解除しません。

## 記事別の判定

- 認定こども園（幼保連携型）の物件要件｜用途地域・園舎園庭の面積・自園調理の設備：held（realestate:ninteikodomoen-bukken-youto-engei-jien-chori）
  - 公開レビュー記録が未登録です
  - 確認済みの公的な一次根拠が不足しています
- 相続した不動産の越境（塀・樹木・庇）｜改正民法233条の覚書と売却の進め方：held（realestate:souzoku-fudosan-ekkyo-oboegaki-233jo-baikyaku）
  - 公開レビュー記録が未登録です
  - 確認済みの公的な一次根拠が不足しています
  - 未確認一次資料：https://www.moj.go.jp/MINJI/minji07_00343.html — 本文が『法務省・民法等の一部を改正する法律(令和3年)の解説』として掲げる一次根拠。URLはHTTP 404で取得不能。相隣関係改正の実体は上記e-Gov民法233条で裏取り済みのため重要事項の根拠欠落には当たらないが、当該リンクは辿れない(全4言語に同一の死リンク)。
- 認定こども園の認定・認可申請の流れと必要書類｜幼保連携型の基準：quality-eligible（legal:ninteikodomoen-ninka-nintei-shinsei-nagare-youken）
- 再転相続（民法916条）の熟慮期間｜相続人が承認・放棄前に亡くなったとき：held（legal:saiten-souzoku-916jo-jukuryo-kikan-houki）
  - 公開レビュー記録が未登録です
  - 確認済みの公的な一次根拠が不足しています
- 旅行会社の添乗員に、事業場外みなし労働時間は使えますか？（阪急トラベル最高裁後の実務）：quality-eligible（labor:ryokogyo-tenjoin-jigyojogai-minashi-roudoujikan-roumu）

## レビューの指摘

- [minor] scripts/realestate-columns/141-souzoku-fudosan-ekkyo-oboegaki-233jo-baikyaku.md：出典に挙げた法務省ページ https://www.moj.go.jp/MINJI/minji07_00343.html が HTTP 404（4回確認・site:moj.go.jp 検索でも当該パスは出ず）。4言語すべてに同一の死リンクが含まれる。民法233条改正の実体はe-Gov民法で裏取り済みのため法的正確性には影響しないが、一次根拠として掲げたリンクが辿れない。 ／ 修正案：法務省の相隣関係改正（令和3年法律第24号）の現行公表URLに差し替えるか、当該リンクを削除してe-Gov民法233条の引用に一本化する。参照日の明示は維持。

実行証跡：https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/40208963917
