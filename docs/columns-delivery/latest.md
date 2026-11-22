# コラム生成・レビュー・公開判定（2026-11-23）

- 生成・機械検証：成功 6本
- レビュー処理：success ／ 判定：true
- レビュー指摘：blocker 0／major 0／minor 5
- 今回の候補指紋に対応する公開証跡登録：3本
- 自動公開の品質候補：3本
- 品質保留：3本 ／ 公開日待ち：0本
- 未確認の一次資料：3件
- 本番公開：この処理では実行していません。公開済み件数は未照会です。

3本は品質確認済み候補です。手動保留・既存DB・公開日・有効期限を公開実行時に再判定します。公開完了は実行結果で確認してください。
未確認記事の品質保留はforceでも解除しません。

## 記事別の判定

- グランピング・キャンプ場の事業用地は、市街化調整区域・農地・山林でどの許可が要る？：held（realestate:glamping-camp-jo-jigyo-yochi-chosei-kuiki-nochi-shinrin）
  - 公開レビュー記録が未登録です
  - 確認済みの公的な一次根拠が不足しています
  - 未確認一次資料：https://laws.e-gov.go.jp/law/343AC0000000100 — 都市計画法 第4条(特定工作物・開発行為の定義)・第29条(開発許可)・第34条(調整区域立地基準)・第43条。第二種特定工作物は原則1ha以上(施行令第1条)。確立した条文で本文と整合。
- 相続税を不動産で物納するには何が要件か？管理処分不適格財産と境界確定：quality-eligible（realestate:souzoku-zei-butsunou-fudosan-kanri-shobun-futekikaku-yoken）
- 電気通信事業は届出か登録か—オンラインサービス・ISP開業の手続：held（legal:denki-tsushin-jigyo-todokede-gyosha-touroku-chigai）
  - 公開レビュー記録が未登録です
  - 確認済みの公的な一次根拠が不足しています
  - 未確認一次資料：https://laws.e-gov.go.jp/law/359AC0000000086 — 電気通信事業法 第9条(登録)・第16条(届出)・第2条(定義)・第164条(第三号事業の適用除外)。本文の区分と整合（確立した条文）。
- ガソリンスタンド開業に要る揮発油販売業者登録（品確法）と危険物施設の設置許可：quality-eligible（legal:kihatsuyu-hanbaigyo-touroku-hinkakuho-kikenbutsu-ss）
- データセンターの24時間監視要員は断続的労働か。宿日直許可と労働時間をどう扱うのか：quality-eligible（labor:data-center-24ji-kanshi-danzoku-roudo-shukunikkin-roumu）
- クラフトビール醸造所・酒類製造所の労務は、繁忙期の変形労働と外国人受入でどこに注意するのか：held（labor:shurui-seizo-brewery-henkei-roudoujikan-ginoujisshu-roumu）
  - 公開レビュー記録が未登録です
  - 確認済みの公的な一次根拠が不足しています
  - 未確認一次資料：https://www.maff.go.jp/j/shokusan/sanki/soumu/tokuteiginou.html — 農林水産省 特定技能 飲食料品製造業分野FAQページ。酒類除外の根拠として引用。ただし本文が引く『令和8年3月更新版』の版名は未確認(確認できたのは令和7年2月版・2024年12月更新)。主張自体は上記ISA別表で確認済み。

## レビューの指摘

- [minor] scripts/realestate-columns/en/189-glamping-camp-jo-jigyo-yochi-chosei-kuiki-nochi-shinrin.md：英訳本文・H2見出しに日本語の「工作物」が未翻訳のまま混在（例: 'buildings or工作物?', 'specified工作物', 'type-2 specified工作物'）。意味は保たれており法的誤りではないが、英語読者向けの体裁上の欠陥。 ／ 修正案：'工作物' を 'structure'（または 'specified structure'）等へ訳出する。日中訳では問題なし。
- [minor] scripts/labor-columns/en/223-data-center-24ji-kanshi-danzoku-roudo-shukunikkin-roumu.md：出典節の見出し「## この記事の根拠」が日本語のまま（EN・zh・zh-tw の 223/224 共通）。本文は訳されており内容一致。legal 185/186 では見出しが訳出されているため不統一。 ／ 修正案：見出しを各言語へ訳出（EN: 'Sources' 等）。内容への影響なし。
- [minor] scripts/labor-columns/zh/223-data-center-24ji-kanshi-danzoku-roudo-shukunikkin-roumu.md：出典節（line 123付近）に『昭和63年3月14日发基第150号的改正＝基发第150号』という冗長で崩れた訳文の痕跡。zh-tw版は正常（昭和63年3月14日基發第150號）。意味は通じるが文として不自然。 ／ 修正案：zh-tw に合わせ『昭和63年3月14日基发第150号』へ整える。
- [minor] scripts/labor-columns/224-shurui-seizo-brewery-henkei-roudoujikan-ginoujisshu-roumu.md：引用する農林水産省FAQの版名『令和8年3月更新版』は公的検索で独立確認できなかった（確認できたのは令和7年2月更新版および2024年12月更新）。ただし中核主張（酒類製造は飲食料品製造業の対象外）は出入国在留管理庁の公式別表『飲食料品（酒類を除く。）』で確認済みのため、主張自体に誤りはない。版名の精度のみの懸念。 ／ 修正案：投入前に農水省FAQ最新版の版名・更新日を実物で再確認し、版名を現行に合わせる。
- [minor] scripts/labor-columns/223-data-center-24ji-kanshi-danzoku-roudo-shukunikkin-roumu.md：深夜割増が第41条の適用除外でも免除されない旨の行政解釈番号『昭和23年10月14日基発第1506号』を公的一次資料で直接確認できなかった。結論（監視・断続的労働/宿日直の許可を受けても深夜割増は要支払）は長野・愛知労働局資料で確認済みのため実体に誤りはない。通達番号の精度のみの懸念。 ／ 修正案：厚労省通達データベースで通達番号を実物確認するか、確認できない場合は番号を落として『行政解釈』の記載にとどめる。

実行証跡：https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/45059806249
