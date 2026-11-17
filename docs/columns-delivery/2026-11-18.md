# コラム生成・レビュー・公開判定（2026-11-18）

- 生成・機械検証：成功 6本
- レビュー処理：success ／ 判定：true
- レビュー指摘：blocker 0／major 0／minor 2
- 今回の候補指紋に対応する公開証跡登録：4本
- 自動公開の品質候補：4本
- 品質保留：2本 ／ 公開日待ち：0本
- 未確認の一次資料：0件
- 本番公開：この処理では実行していません。公開済み件数は未照会です。

4本は品質確認済み候補です。手動保留・既存DB・公開日・有効期限を公開実行時に再判定します。公開完了は実行結果で確認してください。
未確認記事の品質保留はforceでも解除しません。

## 記事別の判定

- 中国語バイヤー向け：私道・位置指定道路の接道を買う前に確認する（再建築可否と持分の罠）：quality-eligible（realestate:chugokugo-buyer-shido-ichi-shitei-douro-settei-dd）
- 相続した共有不動産で話がまとまらない――共有物分割請求に至ったときの換価（任意売却・形式競売）の実務：quality-eligible（realestate:souzoku-kyoyu-bunkatsu-seikyu-kanka-baikyaku）
- 貸金業の登録を受けるには――純資産5000万円・貸金業務取扱主任者・営業所要件の全体像：held（legal:kashikin-gyo-touroku-yoken-shunin-junshisan）
  - enの内部リンクに言語不一致があります
  - zh-twの内部リンクに言語不一致があります
  - zhの内部リンクに言語不一致があります
  - 公開レビュー記録が未登録です
- 相続人の中に生死不明の人がいる――不在者財産管理人と失踪宣告、どちらを選ぶか：held（legal:souzoku-fuzaisha-zaisan-kanrinin-shisso-senkoku-erabikata）
  - enの内部リンクに言語不一致があります
  - zh-twの内部リンクに言語不一致があります
  - zhの内部リンクに言語不一致があります
  - 公開レビュー記録が未登録です
- 派遣社員を受け入れる会社の労務――抵触日（個人・事業所単位）、派遣先管理台帳、偽装請負（37号告示）：quality-eligible（labor:rodosha-haken-ukeire-teishokuhi-kanri-daicho-37gokokuji-roumu）
- 常時50人になったら――衛生管理者・産業医・衛生委員会の選任と届出：quality-eligible（labor:eisei-kanrisha-sangyoi-eisei-iinkai-sennin-50nin-gimu）

## レビューの指摘

- [minor] scripts/legal-columns/174-kashikin-gyo-touroku-yoken-shunin-junshisan.md：本文「割合が50分の1以上になる数…（貸金業法第12条の3）」は、第12条の3本体が『内閣府令で定める数』と委任しているのみで、『50分の1（端数切上げ）』の具体値は貸金業法施行規則（第10条の8）にある。数値自体は正確だが、根拠条文の帰属がやや不正確。 ／ 修正案：根拠条文を『第12条の3の委任を受けた施行規則』と明示できれば、より厳密（事実の修正は不要）。
- [minor] scripts/labor-columns/213-rodosha-haken-ukeire-teishokuhi-kanri-daicho-37gokokuji-roumu.md：本文「台帳は3年間保存し（労働者派遣法施行規則第37条）」とあるが、派遣先管理台帳の3年間保存は法第42条第2項（条文本体）に定めがある。保存年数(3年)自体は正確だが、根拠の帰属が不正確（通知頻度『1か月に1回以上＝施行規則第38条』の帰属は正しい）。 ／ 修正案：保存の根拠を『法第42条第2項』と記すのが正確（事実の修正は不要）。

実行証跡：https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/44171868564
