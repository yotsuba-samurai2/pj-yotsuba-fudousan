# コラム生成・レビュー・公開判定（2026-11-02）

- 生成・機械検証：成功 6本
- レビュー処理：success ／ 判定：false
- レビュー指摘：blocker 0／major 4／minor 2
- 今回の候補指紋に対応する公開証跡登録：0本
- 自動公開の品質候補：0本
- 品質保留：6本 ／ 公開日待ち：0本
- 未確認の一次資料：1件
- 本番公開：この処理では実行していません。公開済み件数は未照会です。

正午の自動公開に渡せる品質候補は0本です。6本は保留、0本は公開日待ちです。
未確認記事の品質保留はforceでも解除しません。

## 記事別の判定

- レンタカー（自家用自動車有償貸渡）を始めるとき、車庫と事務所の物件は何が要るか：held（realestate:rentacar-jikayou-shako-jimusho-bukken-youken）
  - 公開レビュー記録が未登録です
  - 候補指紋と修正後原稿が一致しません
  - 独立レビューの証跡不足、重複、またはレビュー後の原稿変更
  - 未確認一次資料：https://laws.e-gov.go.jp/law/337CO0000000340 — 本文が保管場所法施行令として引用するe-Gov ID。HTTP 404で到達不能。政令番号『昭和37年政令第340号』も誤り。
- 相続した土地が都市計画道路の予定地にかかっていたら、どう売るか：held（realestate:souzoku-toshikeikaku-douro-yoteichi-seigen-baikyaku）
  - 公開レビュー記録が未登録です
  - 独立レビューに未解決の重大な指摘があります
- キッチンカー（移動販売）の食品営業許可と「仕込み場所」の要件は何か：held（legal:kitchen-car-shokuhin-eigyo-kyoka-shikomi-basho-yoken）
  - enの内部リンクに言語不一致があります
  - zh-twの内部リンクに言語不一致があります
  - zhの内部リンクに言語不一致があります
  - 公開レビュー記録が未登録です
  - 独立レビューに未解決の重大な指摘があります
- 共有者の一人が所在不明のとき、その持分を取得・処分する2023年の新制度（民法262条の2・262条の3）：held（legal:shozaitou-fumei-kyoyusha-mochibun-shutoku-262jo2）
  - enの内部リンクに言語不一致があります
  - zh-twの内部リンクに言語不一致があります
  - zhの内部リンクに言語不一致があります
  - 公開レビュー記録が未登録です
  - 独立レビューに未解決の重大な指摘があります
- 製造業の2交替・3交替勤務、変形労働時間制と深夜・交替手当はどう設計するか：held（labor:seizogyo-kotai-kinmu-henkei-roudoujikan-shinya-roumu）
  - 公開レビュー記録が未登録です
  - 独立レビューに未解決の重大な指摘があります
- 海外で採用した外国人の『入社前』の労務──在留資格認定証明書の交付待ちと渡航遅延：held（labor:kaigai-saiyo-nyukoku-mae-naitei-coe-machi-roumu）
  - 公開レビュー記録が未登録です
  - 独立レビューに未解決の重大な指摘があります

## レビューの指摘

- [major] scripts/realestate-columns/154-rentacar-jikayou-shako-jimusho-bukken-youken.md：出典節で『自動車の保管場所の確保等に関する法律施行令』を『昭和37年政令第340号』と誤記し、e-Govリンクを https://laws.e-gov.go.jp/law/337CO0000000340 としている。このIDは404で、正しい施行令は昭和37年政令第329号（337CO0000000329）。第1条の要件内容（本拠位置から直線2km以内・出入りと収容・使用権原）自体は正しいが、一次資料の政令番号とリンク先が誤っており、読者が一次情報に到達できない。 ／ 修正案：政令番号を『昭和37年政令第329号』に、URLを https://laws.e-gov.go.jp/law/337CO0000000329 に修正する。
- [major] scripts/realestate-columns/en/154-rentacar-jikayou-shako-jimusho-bukken-youken.md：Sources節で保管場所法施行令のe-Govリンクが日本語版と同じ誤ID(...337CO0000000340, 404)。括弧内に政令番号の表記はないがリンクが死んでおり一次資料に到達できない。 ／ 修正案：URLを https://laws.e-gov.go.jp/law/337CO0000000329 に修正する。
- [major] scripts/realestate-columns/zh-tw/154-rentacar-jikayou-shako-jimusho-bukken-youken.md：出處節で施行令を『昭和37年政令第340號』とし、リンクも ...337CO0000000340（404）。正しくは政令第329號。 ／ 修正案：『昭和37年政令第329號』に、URLを ...337CO0000000329 に修正する。
- [major] scripts/realestate-columns/zh/154-rentacar-jikayou-shako-jimusho-bukken-youken.md：出处节で施行令を『昭和37年政令第340号』とし、リンクも ...337CO0000000340（404）。正しくは政令第329号。 ／ 修正案：『昭和37年政令第329号』に、URLを ...337CO0000000329 に修正する。
- [minor] scripts/labor-columns/zh-tw/187-seizogyo-kotai-kinmu-henkei-roudoujikan-shinya-roumu.md：原文の『労働基準法第41条第2号』(管理監督者) を『第41條第2項』と表記（号→項の誤り）。意味は管理監督者で保持されており主張の相違ではないが、条項号の表記が不正確。 ／ 修正案：『第41條第2款』または『第41條第2號』相当の表記に統一する（英語版は正しく item 2 としている）。
- [minor] scripts/labor-columns/zh/187-seizogyo-kotai-kinmu-henkei-roudoujikan-shinya-roumu.md：原文の『労働基準法第41条第2号』(管理監督者) を『第41条第2项』と表記（号→項の誤り）。意味は保持。 ／ 修正案：『第41条第2款』相当の表記に修正する。

実行証跡：https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/41333347997
