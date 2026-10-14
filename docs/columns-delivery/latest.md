# コラム生成・レビュー・公開判定（2026-10-15）

- 生成・機械検証：成功 6本
- レビュー処理：success ／ 判定：true
- レビュー指摘：blocker 0／major 0／minor 2
- 今回の候補指紋に対応する公開証跡登録：0本
- 自動公開の品質候補：0本
- 品質保留：6本 ／ 公開日待ち：0本
- 未確認の一次資料：1件
- 本番公開：この処理では実行していません。公開済み件数は未照会です。

正午の自動公開に渡せる品質候補は0本です。6本は保留、0本は公開日待ちです。
未確認記事の品質保留はforceでも解除しません。

## 記事別の判定

- コンテナ・トレーラーハウスで店舗や事務所を開くとき、物件・土地選びで何を確認すればよいですか：held（realestate:container-trailer-house-tenpo-bukken-kenchiku-kakunin-youto）
  - 公開レビュー記録が未登録または重複しています
  - 担当分野の資格者確認が不足しています
  - 確認済みの公的な一次根拠が不足しています
- 被相続人が老人ホームに入所していた実家でも、相続空き家の3000万円特別控除は使えますか：held（realestate:souzoku-akiya-3000man-roujin-home-nyusho-kyojuyoken）
  - 公開レビュー記録が未登録または重複しています
  - 担当分野の資格者確認が不足しています
- 「相続させる」遺言で受益相続人が先に死亡｜代襲は原則なし・予備的遺言で備える：held（legal:tokutei-zaisan-shokei-yuigon-jueki-sakibashi-daishu-fuka）
  - enの内部リンクに言語不一致があります
  - zh-twの内部リンクに言語不一致があります
  - zhの内部リンクに言語不一致があります
  - 公開レビュー記録が未登録または重複しています
  - 担当分野の資格者確認が不足しています
- 技能実習から育成就労へ｜監理支援機関の許可の取り直しと受入れ計画の認定：held（legal:ginou-jisshu-ikusei-shuro-ikou-kanri-shien-kikan-kyoka）
  - enの内部リンクに言語不一致があります
  - zh-twの内部リンクに言語不一致があります
  - zhの内部リンクに言語不一致があります
  - 公開レビュー記録が未登録または重複しています
  - 担当分野の資格者確認が不足しています
  - 確認済みの公的な一次根拠が不足しています
  - 未確認一次資料：https://www.moj.go.jp/isa/applications/faq/ikusei_qa_00002.html — 申請先『外国人技能実習機構 本部審査課分室』という部署名は公的一次資料で確認できず。根拠法＝令和6年法律第60号（令和6年6月21日公布）は改正法として正しいが、部署名の細部のみ未確認。
- 葬儀社の開業と労務｜宿直・呼出待機・繁閑の労働時間と賃金設計：held（labor:sougisha-sousaigyo-kaigyo-roumu-shukuchoku-yobidashi-henkei）
  - 公開レビュー記録が未登録または重複しています
  - 担当分野の資格者確認が不足しています
- 精神障害の労災認定基準（令和5年改正）｜企業の予防と是正：held（labor:seishin-shougai-rosai-nintei-kijun-2023-yobo-zesei）
  - 公開レビュー記録が未登録または重複しています
  - 担当分野の資格者確認が不足しています

## レビューの指摘

- [minor] scripts/legal-columns/116-ginou-jisshu-ikusei-shuro-ikou-kanri-shien-kikan-kyoka.md：申請先を「外国人技能実習機構 本部審査課分室」と具体名で断定しているが、出入国在留管理庁の公式Q&A（moj.go.jp）には受付機関が外国人技能実習機構である旨までしか記載がなく、『本部審査課分室』という部署名は公的一次資料で確認できなかった。施行日・施行日前申請開始日（令和8年4月15日／9月1日）・Q33/Q39の核心事実は確認済みで、本件は行政上の受付窓口名という軽微な細部。 ／ 修正案：外国人技能実習機構（OTIT）の施行日前申請案内ページで部署名を直接確認するか、確認できない場合は『外国人技能実習機構が受け付ける（詳細は機構HPで確認）』に留める。
- [minor] scripts/legal-columns/en/115-tokutei-zaisan-shokei-yuigon-jueki-sakibashi-daishu-fuka.md：英訳・繁体字・簡体字の法務サイト内部リンクがロケール区切り（/en 等）を含まず https://luck428.com/legal/column/… の形になっている（不動産コラムの英訳が /en/column/… を用いるのと非対称）。法務サイト既存の導線規約に沿った意図的構成の可能性が高く断定できないが、訳文読者が日本語ページへ着地しうる点は人手確認が望ましい。116も同様。 ／ 修正案：法務サイトの多言語ルーティング規約を確認し、ロケール前置が必要なら /en/legal/column/… 等へ統一。既存規約どおりなら対応不要。

実行証跡：https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/38602086814
