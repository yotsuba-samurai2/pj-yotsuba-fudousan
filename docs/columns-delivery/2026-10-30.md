# コラム生成・レビュー・公開判定（2026-10-30）

- 生成・機械検証：成功 6本
- レビュー処理：success ／ 判定：true
- レビュー指摘：blocker 0／major 0／minor 0
- 今回の候補指紋に対応する公開証跡登録：3本
- 自動公開の品質候補：3本
- 品質保留：3本 ／ 公開日待ち：0本
- 未確認の一次資料：1件
- 本番公開：この処理では実行していません。公開済み件数は未照会です。

3本は品質確認済み候補です。手動保留・既存DB・公開日・有効期限を公開実行時に再判定します。公開完了は実行結果で確認してください。
未確認記事の品質保留はforceでも解除しません。

## 記事別の判定

- デリバリー専門（ゴーストキッチン）の店舗物件を選ぶ前に確認する用途地域・排水・保健所の条件：quality-eligible（realestate:delivery-senmon-ghost-kitchen-bukken-youto-haisui-grease）
- 相続した実家が特定空家の勧告を受けると固定資産税が上がる—住宅用地特例が外れる前の動き方：held（realestate:souzoku-tokutei-akiya-kankoku-jutakuyochi-tokurei-baikyaku）
  - 公開レビュー記録が未登録です
  - 確認済みの公的な一次根拠が不足しています
- ゲームセンターの風営法5号許可—構造設備・距離制限と申請の流れ：held（legal:fuzoku-eigyo-5go-game-center-amusement-kyoka-youken-nagare）
  - enの内部リンクに言語不一致があります
  - zh-twの内部リンクに言語不一致があります
  - zhの内部リンクに言語不一致があります
  - 公開レビュー記録が未登録です
  - 確認済みの公的な一次根拠が不足しています
- 相続分を第三者に譲渡されたら—民法905条の取戻権と1か月の期限：held（legal:souzokubun-torimodoshiken-minpo-905jo-daisansha-joto）
  - enの内部リンクに言語不一致があります
  - zh-twの内部リンクに言語不一致があります
  - zhの内部リンクに言語不一致があります
  - 公開レビュー記録が未登録です
  - 記事別の一次根拠・重複・法的事項・翻訳整合が未完了
  - 未確認一次資料：https://laws.e-gov.go.jp/law/129AC0000000089 — 民法第905条第1項(相続分の取戻権・価額及び費用の償還)・第2項(一箇月の期間制限)・第909条の2(遺産分割前の預貯金債権の行使)。本文の引用はいずれも周知の条文内容と一致するが、e-Gov法令検索がクライアント描画のSPAのため条文テキストをgo.jpで直接読取れず、go.jp一次ページでの直接確認は未達(法務省・裁判所サイトも第905条を直接掲載せず)。
- ネットカフェ・漫画喫茶の24時間運営の労務—仮眠時間は労働時間か、深夜割増と一人勤務の設計：quality-eligible（labor:net-cafe-manga-kissa-24ji-kamin-shinya-warimashi-hitori-roumu）
- 個人事業を法人成りしたときの社会保険・労働保険の切替—強制適用への移行と従業員の手続：quality-eligible（labor:kojin-jigyo-hojinnari-shakaihoken-roudouhoken-kirikae-tetsuzuki）

実行証跡：https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/40929412093
