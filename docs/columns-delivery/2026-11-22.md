# コラム生成・レビュー・公開判定（2026-11-22）

- 生成・機械検証：成功 6本
- レビュー処理：success ／ 判定：true
- レビュー指摘：blocker 0／major 0／minor 2
- 今回の候補指紋に対応する公開証跡登録：2本
- 自動公開の品質候補：2本
- 品質保留：4本 ／ 公開日待ち：0本
- 未確認の一次資料：2件
- 本番公開：この処理では実行していません。公開済み件数は未照会です。

2本は品質確認済み候補です。手動保留・既存DB・公開日・有効期限を公開実行時に再判定します。公開完了は実行結果で確認してください。
未確認記事の品質保留はforceでも解除しません。

## 記事別の判定

- データセンター・サーバー室に使える物件はどう見極める？用途地域・受電容量・消防の三点：held（realestate:data-center-server-room-bukken-youto-juden-shobo）
  - 公開レビュー記録が未登録です
  - 確認済みの公的な一次根拠が不足しています
- 相続した「農地付き空き家」は売れる？下限面積要件が廃止された2023年以降の実務：held（realestate:souzoku-nochi-tsuki-akiya-kagen-menseki-haishi-2023-baikyaku）
  - 公開レビュー記録が未登録です
  - 確認済みの公的な一次根拠が不足しています
- レベル4の自動運転（特定自動運行）を始めるには？2023年施行の許可申請の流れ：held（legal:tokutei-jido-unko-level4-kyoka-doukouhou-2023-shinsei）
  - 公開レビュー記録が未登録です
  - 確認済みの公的な一次根拠が不足しています
- 在留資格認定証明書が不交付になったら？理由の確認と再申請の実務（中国語実務者向け）：held（legal:zairyu-shikaku-nintei-shomeisho-fukoufu-saishinsei-chuka-taiwan）
  - 公開レビュー記録が未登録です
  - 記事別の一次根拠・重複・法的事項・翻訳整合が未完了
  - 未確認一次資料：https://www.moj.go.jp/isa/applications/procedures/16-1.html — 在留資格認定証明書交付申請の根拠＝入管法第7条の2、手数料不要、オンライン申請可、標準処理1〜3か月、『不服申立方法：なし』。手数料無料・オンライン可は検索で確認したが、ページ自体がHTTP 403で直読不可。『不服申立方法：なし』は一次ページ直読での確認ができていない。
  - 未確認一次資料：https://www.investtokyo.metro.tokyo.lg.jp/jp/about/data-conference/012_006.pdf — 在留資格認定証明書交付申請の標準処理期間は1か月〜3か月（東京都資料での言及。出入国在留管理庁の公式表そのものは未直読）。
- 「柔軟な働き方を実現するための措置」とは。2025年10月施行の選択的措置義務で何をするのか：quality-eligible（labor:ikuji-kaigo-juunan-na-hatarakikata-sochi-gimu-2025-10）
- 男性の育児休業取得率の公表義務はどこから。2025年4月に常時300人超へ拡大：quality-eligible（labor:dansei-ikukyu-shutoku-jokyo-kouhyo-gimu-300nin-2025-04）

## レビューの指摘

- [minor] scripts/legal-columns/184-zairyu-shikaku-nintei-shomeisho-fukoufu-saishinsei-chuka-taiwan.md：中心的な出典である出入国在留管理庁の交付申請案内（moj.go.jp/isa/applications/procedures/16-1.html）がHTTP 403で一次ページを直読できず、「不服申立方法：なし」は二次的な検索断片でのみ裏取り。記事の論旨（再申請中心・争訟は弁護士）はこの記述に依存する。 ／ 修正案：資格者が moj.go.jp の交付申請案内表の『不服申立方法』欄を直接確認し、『なし』の記載を裏取りする。記事本文は争訟可否を弁護士に留保しており断定はしていないため、文面修正は不要（ファイル変更は本審査の対象外）。
- [minor] scripts/realestate-columns/188-souzoku-nochi-tsuki-akiya-kagen-menseki-haishi-2023-baikyaku.md：表の『根拠』行が「令和4年法律第56号第5号の削除」と表記され、本文（令和4年法律第56号『第5条』による農地法改正＝農地法第3条第2項第5号の削除）と号/条の表記が不整合。事実関係（下限面積要件廃止・2023年4月1日施行）は正しい。 ／ 修正案：表記を本文に揃え『令和4年法律第56号第5条による農地法第3条第2項第5号の削除』とする（軽微・本審査ではファイル変更しない）。

実行証跡：https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/44938212138
