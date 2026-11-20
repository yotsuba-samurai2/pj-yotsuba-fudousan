# コラム生成・レビュー・公開判定（2026-11-21）

- 生成・機械検証：成功 6本
- レビュー処理：success ／ 判定：true
- レビュー指摘：blocker 0／major 0／minor 1
- 今回の候補指紋に対応する公開証跡登録：6本
- 自動公開の品質候補：6本
- 品質保留：0本 ／ 公開日待ち：0本
- 未確認の一次資料：0件
- 本番公開：この処理では実行していません。公開済み件数は未照会です。

6本は品質確認済み候補です。手動保留・既存DB・公開日・有効期限を公開実行時に再判定します。公開完了は実行結果で確認してください。
未確認記事の品質保留はforceでも解除しません。

## 記事別の判定

- 屋内納骨堂（ビル型）の物件は、用途地域・建築・消防で何を確認するのか？：quality-eligible（realestate:nokotsudo-okunai-biru-bukken-youto-boushika-kenchiku）
- 中国語圏の買主が崖地・擁壁付き物件を買うとき、安全性のデューデリで何を確認するのか？：quality-eligible（realestate:chugokugo-buyer-yoheki-gakechi-dd-anzensei）
- 日本版ライドシェア（自家用車活用事業）を始めるには、どんな許可が要るのか？：quality-eligible（legal:jikayousha-katsuyo-jigyo-rideshare-kyoka）
- 質屋を開業するには、公安委員会の許可で何が要るのか？：quality-eligible（legal:shichiya-eigyo-kyoka-koan-iinkai-youken）
- サウナ・公衆浴場を開業するとき、深夜営業と長時間の労務はどう設計するのか：quality-eligible（labor:koshu-yokujo-sauna-roudoujikan-shinya-anzeneisei-roumu）
- ゲームセンター（アミューズメント施設）の労務は、年少者とシフトでどこに注意するのか：quality-eligible（labor:amusement-game-center-nenshousha-henkei-shift-roumu）

## レビューの指摘

- [minor] scripts/realestate-columns/en/186-chugokugo-buyer-yoheki-gakechi-dd-anzensei.md：本文冒頭の関連記事リンクで、日本語原稿・zh-tw版にある売主向け記事 /column/gake-yoheki-tochi-baikyaku-bunkyo への内部リンクが en 版・zh 版で欠落している。カニバリ回避の説明で区別対象としている記事への導線が2言語で失われており、4言語間で内部リンク構成が不一致。内容・法的主張の相違ではなく導線の欠落。 ／ 修正案：en/186 と zh/186 の導入段落に、他2言語と同じく gake-yoheki-tochi-baikyaku-bunkyo への絶対URL内部リンク（/en/・/zh/ 前置）を追加して4言語で揃える。

実行証跡：https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/44805802692
