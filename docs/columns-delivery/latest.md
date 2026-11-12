# コラム生成・レビュー・公開判定（2026-11-13）

- 生成・機械検証：成功 6本
- レビュー処理：success ／ 判定：true
- レビュー指摘：blocker 0／major 0／minor 0
- 今回の候補指紋に対応する公開証跡登録：2本
- 自動公開の品質候補：2本
- 品質保留：4本 ／ 公開日待ち：0本
- 未確認の一次資料：2件
- 本番公開：この処理では実行していません。公開済み件数は未照会です。

2本は品質確認済み候補です。手動保留・既存DB・公開日・有効期限を公開実行時に再判定します。公開完了は実行結果で確認してください。
未確認記事の品質保留はforceでも解除しません。

## 記事別の判定

- 2025年4月から全建築物に省エネ基準適合義務——賃貸アパート・小規模テナントを新築するオーナーが物件計画で変わること：held（realestate:shoene-tekigo-gimuka-2025-chintai-shinchiku-bukken）
  - 公開レビュー記録が未登録です
  - 確認済みの公的な一次根拠が不足しています
  - 未確認一次資料：https://www.mlit.go.jp/report/press/content/001841001.pdf — 国交省の省エネ義務化広報資料。WebFetchではバイナリPDFのため本文テキスト抽出不可。施行日・対象拡大の骨子はlg.jp(札幌市)official及び他の公的案内で裏取り済み。
- 中国・台湾の不動産プロが日本の旧耐震区分マンションを評価する——耐震診断・建替え決議・修繕積立金のデューデリ：held（realestate:chuka-pro-kyutaishin-kubun-mansion-dd）
  - 公開レビュー記録が未登録です
  - 確認済みの公的な一次根拠が不足しています
  - 未確認一次資料：https://www.moj.go.jp/content/001460460.pdf — 改正区分所有法の詳細(建替え緩和事由5類型・取壊し決議の全員同意→5分の4等)。WebFetchではバイナリPDFのため本文抽出不可。緩和の枠組み自体は複数の公的・専門解説で整合を確認。細目はe-Gov最新条文で要確認(本文も参照日付きで要確認を明記)。
- クラフトビールや発泡酒の『酒類製造免許』をとる——最低製造数量基準・設備・特区と、申請の流れ：held（legal:shurui-seizo-menkyo-craft-beer-happosyu-youken）
  - enの内部リンクに言語不一致があります
  - zh-twの内部リンクに言語不一致があります
  - zhの内部リンクに言語不一致があります
  - 公開レビュー記録が未登録です
- 日本に住む中国籍・台湾籍の人が日本で遺言を作る——方式の準拠法・公正証書遺言の通訳・本国での効力：held（legal:gaikokuseki-nihon-zaiju-yuigon-houshiki-junkyoho-chuka-taiwan）
  - enの内部リンクに言語不一致があります
  - zh-twの内部リンクに言語不一致があります
  - zhの内部リンクに言語不一致があります
  - 公開レビュー記録が未登録です
- 介護離職を防ぐために会社がやること——2025年4月から義務化された個別の周知・意向確認と両立支援：quality-eligible（labor:kaigo-ridatsu-boshi-kojin-shuchi-ikoukakunin-2025）
- 労働基準監督署の調査（臨検）が入ったら——是正勧告・指導票への対応と、ふだんの備え：quality-eligible（labor:roukisho-rinken-zesei-kankoku-taio-roumu）

実行証跡：https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/43293087025
