## 目的
売りにくい土地・建物の出口相談コーナー（/wakeari、#421 でマージ済み）の Phase 2。企画書 v1.0 §3-3 の「空白の8本」を不動産コラム（/column・business=realestate）として追加する。指示書 v2.0 §11 の手順（sitemap 再取得→第7条の型で md→seed dry-run→`--emit-ts`→PR）どおり。**投入（/admin/columns/seed-realestate-daily）・GSC 登録は浦松。**

## 追加する記事（ja＋zh-tw・publishedAt 2026-09-24・category「売りにくい土地・建物」）

| # | slug | 主語・役割 | 受け皿（hubLinks） | 書かなかったこと |
|---|---|---|---|---|
| 77 | `kyosho-tochi-15tsubo-uru-ikasu-bunkyo` | 15坪前後の所有者。出口4つと買い手の種類 | /wakeari/kyosho | 建築の可否の断定 |
| 78 | `rinchi-baikyaku-kaimashi-nanari-tochi-deguchi` | 隣地への売却・買い増し。声かけは媒介として当社 | /wakeari | 紛争性のある交渉（弁護士へ） |
| 79 | `saikenchiku-fuka-43jo-2ko-nintei-kyoka-dare-ga` | 43条2項1号認定・2号許可を誰が・どこに | /wakeari/saikenchiku-fuka | 認定・許可の見込みの断定 |
| 80 | `setback-42jo-2ko-doro-tochi-baikyaku-menseki` | セットバックの面積と価格の考え方 | /wakeari/saikenchiku-fuka | 個別の面積の算定 |
| 81 | `gake-yoheki-tochi-baikyaku-bunkyo` | がけ・擁壁。都条例6条と盛土規制法 | /wakeari | 擁壁の安全性の判断 |
| 82 | `shozai-fumei-kyoyusha-mochibun-shutoku-joto` | 所在等不明共有者。改正民法262条の2・262条の3 | /wakeari/kyoyu | 裁判手続の代理 |
| 83 | `shakuchiken-sokochi-douji-baikyaku-touka-koukan` | 同時売却・等価交換 | /wakeari/shakuchi-sokochi | 税務効果（税理士へ） |
| 84 | `saikenchiku-fuka-kashite-mochitsuzukeru-reform-hani` | 貸して持つ。確認が要る工事の線（2025-04-01 改正） | /wakeari/saikenchiku-fuka | 確認要否の断定 |

着手前の既存確認：本番 sitemap（449URL・ja）に上の8テーマを扱う記事なし（2026-09-24）。

## 変更ファイル
- 新規 `scripts/realestate-columns/77〜84-*.md`（ja）／`scripts/realestate-columns/zh-tw/77〜84-*.md`（zh-tw）
- `scripts/seed-realestate-columns-daily.ts` — ARTICLES に8エントリ追記（枝番スクリプト・管理画面は増やさない）
- `src/lib/data/realestate-columns-daily-seed.ts` — `--emit-ts` の生成物（**忘れると管理画面に並ばない**）
- `src/lib/__tests__/wakeari-pages.test.ts` — 対応表の期待値 19→27
- `src/lib/wakeari.ts` — 受け皿ごとの関連コラム対応表に8 slug（投入前は DB に無いため表示されず、404 リンクは出ない）
- `docs/wakeari/01_konkyo.md`（Phase 2 の法令一次確認表を追記）／`91_pr-body-phase2.md`（本文）／`tasks/todo.md`

## 記事の型（第7条・§5-2）
「**結論（先に要点）**：」→ H2 は疑問文 → 表 → 「四葉不動産株式会社は、何を行いますか？」→「誰に相談すればよいですか？」（事業者主語の一文・役割・分離受任・紹介料）→ FAQ 4問 → 「この記事の出典（一次情報）」（条・項・号＋現行版の施行日・改正法番号＋参照日）→ ※判断留保・分離受任・紹介料 → 署名（/about/uramatsu）。買取は「提携する買取業者を買主とする媒介」で統一（「当社が買主」の文言なし）。

## 法令の一次確認
`docs/wakeari/01_konkyo.md` の「Phase 2 追加」参照。**Phase 1 で未検証だった 2025-04-01 施行の建築基準法改正の法律番号は、e-Gov 法令API v2 の改正履歴で「令和4年法律第69号」と確定。** 新たに確認：建築基準法2条13〜15号・6条1項2項（**改正前の条文も API v2 の `asof=2025-03-31` で取得し、木造2階建て住宅が旧第4号＝大規模修繕は確認の対象外だったことを原文で確認**）・6条の4・19条4項・44条1項、施行規則10条の3、民法25・30・209・252・262条の2・262条の3・264条の2・264条の3、不動産登記法41条、借地借家法38条、宅建業法35条1項2号、盛土規制法（令和4年法律第55号・2023-05-26 施行）、文京区の規制区域指定（2024-07-31・区全域）、東京都例規集の条例本文 URL。

## 検証
- `npx tsx scripts/seed-realestate-columns-daily.ts`：73本・**NG 0**。新規8本には NG/WARN なし（WARN 6件は既存2記事のブランド表記＝本 PR の対象外）。sitemap 由来の許可リスト 115件で内部リンクの実在を確認
- `npx tsx scripts/seed-realestate-columns-daily.ts --emit-ts`：`src/lib/data/realestate-columns-daily-seed.ts` を再生成（73本・8 slug を確認）
- `npx tsc --noEmit`：エラー 0
- `npx eslint`（seed 生成物・スクリプト・wakeari.ts・テスト）：エラー 0
- `npx vitest run`：94ファイル・1,389件通過（`wakeari-pages.test.ts` の対応表の期待値を19→27に更新）
- 禁止語 grep（ja 8本＋zh-tw 8本・企画書§8＋seed の FORBIDDEN_WORDS＋zh-tw 相当語）：0件／「当社が買主」：0件／必須語（独立した事業体・別々にご契約・紹介料・一般的な情報提供）：8本すべて有
- zh-tw：frontmatter・絶対URL（相対 `](/` 0件）・`四葉不動產株式會社` あり・H2 数／FAQ 数／表の行数が ja と全8本で一致。表記ゆれ「土地家屋調査士／調查士」は既存コーパス（16ファイル）に合わせて「調查士」に統一
- 本文の文字数：ja 5,600〜6,800字、zh-tw 5,100〜6,100字（各記事 FAQ 4問）
- 描画確認：投入前は DB に無いため未実施。投入後に `/column/<slug>`（ja・zh-tw）の 200 と受け皿ブロック、受け皿5枚の関連コラム欄に並ぶことを確認する

## 未検証事項
- 施行令第144条の4第1項各号の本文（記事では条番号の引用にとどめた）
- 各区の後退部分の整備・寄付の制度の内容（区の窓口で確認と記載）
- zh-tw 訳文の法律用語の最終確認（台湾側の読者向けの語彙は浦松の判断）

## 浦松未確認の工程（無人実行）
原稿8本（ja・zh-tw）＝停止点で止まらず続行した。投入前に本文の確認をお願いしたい箇所：77（駐車場の固定資産税の一般論）、81（盛土規制法の許可対象規模＝区の公表資料の転記）。

## luck428-column-seo 第8条への追記案（スキルは本 PR で触らない）
「売りにくい土地・建物クラスタ」：受け皿＝/wakeari（ハブ）・/wakeari/{saikenchiku-fuka,kyoyu,shakuchi-sokochi,kyosho}＝「誰に頼めるか・四葉が行うこと・費用・流れ」／コラム＝制度・手続の深掘り（既存19本＋77〜84）。受け皿のタイトルに条文名・制度名の解説を入れない。買取の表記は「提携する買取業者を買主とする媒介」に固定。

## 台帳に貼る1行
`2026-09-24｜/column 8本 新設（/wakeari の「答え」層。担当設問＝定点#34〜#39 提案）｜PR未マージ｜再着手可能日＝投入日＋14日｜PR #423`

## マージ・投入・GSC は浦松が行う
マージ・デプロイ後：`/admin/columns/seed-realestate-daily` から投入 → 8URL（ja）の到達性チェック → GSC 登録は日本語→繁体字の順に1日10〜12件。
