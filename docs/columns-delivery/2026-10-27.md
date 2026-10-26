# コラム生成・レビュー・公開判定（2026-10-27）

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

- 無人の冷凍自販機（冷凍食品）の店舗にできる物件｜用途地域・食品衛生法の許可と届出・電源と防犯：quality-eligible（realestate:mujin-reito-jihanki-shokuhin-bukken-youken）
- 相続した実家の残置物・遺品を片付けずに現況有姿で売れるか｜所有権・費用・契約不適合の整理：quality-eligible（realestate:souzoku-jikka-zanchibutsu-ihin-genkyo-uri）
- 道路使用許可と道路占用許可の違い｜申請先・根拠法・手続：quality-eligible（legal:douro-shiyo-kyoka-douro-senyo-kyoka-chigai）
- 猟銃・刀剣を相続したら｜所持許可（公安委員会）と登録証（教育委員会）：quality-eligible（legal:souzoku-juho-token-shoji-kyoka-touroku-tetsuzuki）
- スポットワーク（スキマバイト）で人を雇うときの労務とは——労働条件明示・労災・雇用保険・36協定：quality-eligible（labor:spot-work-sukima-baito-roumu-kanri）
- フリーランス（特定受託事業者）も労災に入れるか——2024年11月拡大後の特別加入の要件と手続：quality-eligible（labor:freelance-tokutei-jutaku-rosai-tokubetsu-kanyu）

## レビューの指摘

- [minor] scripts/labor-columns/175-spot-work-sukima-baito-roumu-kanri.md：「この記事の根拠」で通達を『雇用仲介事業者を利用したスポットワークにおける労働条件の確保について』という件名で鉤括弧付き引用しているが、令和7年7月4日・基発0704第3号の正式件名は『いわゆる「スポットワーク」を利用する労働者の労働条件の確保について』とされ、件名表記が一致しない可能性がある。通達番号・日付・内容（応募時点での労働契約成立、労基法義務は雇用主が負う）は厚労省資料で確認済みで正確。日英中繁中簡の4言語とも同じ表記。 ／ 修正案：厚労省の原通達で正式件名を確認して合わせるか、件名を鉤括弧で断定せず内容説明にとどめる（4言語同時に修正）。本文の法的主張には影響しないため公開可否には関わらない。

実行証跡：https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/40378564071
