# C-6-3 第1段階｜英語統一訳語＋/en/about/uramatsu 全文草稿

作成 2026-07-19。承認前の草稿であり、コード未変更。

## 0. 前提確認（実測）

- 対象リポジトリ＝`~/pj-yotsuba-fudousan`（luck428.com）。`~/samurai-app` は別サイト。
- 多言語方式＝C-6-1/C-6-2 と同一：`COPY: Record<LangCode, Copy>` ＋ `getRequestLocale()`、
  ロケール接頭辞は proxy で剥がす（`/en/...` → `/...`）。ja は接頭辞なし。
- `BCP47_BY_LOCALE`（seo.ts）= ja / en / zh-Hant / zh-Hans。hreflang と JSON-LD inLanguage の単一情報源。
- Wikidata Q139738129 のラベル実測：en=`Joji Uramatsu`、ja=`浦松 丈二`、zh-hant/zh-hans=`浦松丈二`。

## 1. 英語統一訳語（承認対象）

| 日本語 | 確定案 | 根拠 |
|---|---|---|
| 別契約で受任します | `engaged under a separate contract`（名詞句が要るとき `accepts engagements separately as a separate business entity`） | 指示の例案。既存 /en 表現 "accept engagements independently as separate business entities" と整合 |
| 行政書士 | 初出 `Gyoseishoshi (Administrative Scrivener)`、以降 `gyoseishoshi` | /legal 既訳 |
| 四葉行政書士事務所 | `Yotsuba Gyoseishoshi Office` | 既存 /en 全ページ |
| 宅地建物取引士 | `Licensed Real Estate Transaction Specialist (宅地建物取引士)` | sr-notation-patches.ts の en 是正値 |
| 宅地建物取引業免許 | `Real Estate Brokerage License (宅地建物取引業免許)` | 業法訳と整合 |
| 宅地建物取引業法 | `Real Estate Brokerage Act (宅地建物取引業法)` | /access・/faq 既訳（指示(3)の形式に合致） |
| 社会保険労務士 | `Certified Social Insurance and Labor Consultant (Sharoushi)` | sr-notation-patches.ts の en 是正値 |
| 中国総局長 | `China General Bureau Chief of the Mainichi Shimbun` | 既存 /en 全ページ・指示の例案と一致 |
| 駐在歴 | `stationed in China, Taiwan, and Thailand` | 既存 /en。国数表記なし |
| 仲介手数料／法定上限 | `brokerage commission` ／ `statutory maximum (cap)` | /access・/faq 既訳（C-6-3 の /ryokin で使用） |

### 指示の例案から変更した3点（要ご判断）

1. **社労士**：例案 `Labor and Social Security Attorney〔Sharoushi〕` → `Certified Social Insurance and Labor Consultant (Sharoushi)` を推奨。
   理由：(a) `Attorney` は英語圏で弁護士（bengoshi）を強く示唆し、業際上の誤読リスクがある。
   (b) 既存 `src/lib/data/sr-notation-patches.ts` の en 是正値が同表記であり、社内の正がすでに存在する。
   ※ `src/config/group.ts` には旧表記 `Labor and Social Security Attorney` が残存（本タスク範囲外・別途統一が必要）。
2. **`gyoseishoshi lawyer` は本タスクの新規ページで使用しない**。既存 /en 数ページで使われているが、
   `lawyer` は弁護士と誤読され、業際表示として不正確。新規ページは `gyoseishoshi (administrative scrivener)` に統一。
3. **併記の括弧**：〔〕ではなく半角 `()` を使用（既存 /en ページの表記方式に合わせる）。

### 併せて報告（本タスクでは変更しない）

既存 /en ページに、業務一体提供と誤読されうる表現が残存：
`consult through a single point of contact`（toushi）、`at one desk`（toushi/group-home）、
`at a single point of contact`（global、legal/services/inheritance）。
禁止語（one-stop / all-in-one / full-service）そのものではないが、方針2の趣旨には抵触しうる。
新規6ページでは一切使用しない。既存分の是正は別タスクとしてご指示ください。

## 2. /en/about/uramatsu 全文草稿

（構成・セクション・FAQ・回答ブロックは日本語版と同一。追加・削除なし）

### meta

- title: `Joji Uramatsu, Representative｜Former Newspaper Journalist, Real Estate Transaction Specialist and Gyoseishoshi`
- description: `Profile of Joji Uramatsu, Representative Director of Yotsuba Real Estate Co., Ltd. He spent 34 years as a journalist at the Mainichi Shimbun and was stationed in China, Taiwan, and Thailand as its China General Bureau Chief. Licensed Real Estate Transaction Specialist (Tokyo, No. 293544) and Gyoseishoshi (Administrative Scrivener) (Registration No. 25087022). Consultations on inheritance and support for non-Japanese clients in Japanese, English, and Chinese. Legal paperwork is handled by the affiliated Yotsuba Gyoseishoshi Office, engaged under a separate contract.`

### breadcrumb

`Home` ＞ `About Us` ＞ `Representative's Profile`

### h1

`Joji Uramatsu (Uramatsu Joji)`

### 冒頭の回答ブロック

> Joji Uramatsu is Representative Director of Yotsuba Real Estate Co., Ltd., a Licensed Real Estate Transaction Specialist (Tokyo, No. 293544) and a Gyoseishoshi (Administrative Scrivener) (Registration No. 25087022). He spent 34 years as a journalist at the Mainichi Shimbun and was stationed in China, Taiwan, and Thailand as its China General Bureau Chief. He plans to open a Certified Social Insurance and Labor Consultant (Sharoushi) office in September 2026. He handles consultations on inheritance and support for non-Japanese clients in Japanese, English, and Chinese. Real estate transactions are handled by Yotsuba Real Estate Co., Ltd. and legal procedures by Yotsuba Gyoseishoshi Office, each engaged under a separate contract.

### portrait alt

`Joji Uramatsu, Representative Director of Yotsuba Real Estate Co., Ltd.`

### H2: Career

> He spent 34 years as a journalist at the Mainichi Shimbun and was stationed in China, Taiwan, and Thailand as its China General Bureau Chief (12 years in Chinese-speaking regions). He studied at National Taiwan Normal University and has built up experience reporting and negotiating in Chinese, both Traditional and Simplified.

> In 2025 he founded Yotsuba Real Estate Co., Ltd. in Kohinata, Bunkyo-ku, Tokyo, and took office as its Representative Director. At the same time he opened Yotsuba Gyoseishoshi Office, where he serves as representative gyoseishoshi. Real estate transactions are undertaken by Yotsuba Real Estate Co., Ltd., and legal procedures such as inheritance documents and permits and licenses by the affiliated Yotsuba Gyoseishoshi Office — each engaged under a separate contract.

### H2: Qualifications

- `Licensed Real Estate Transaction Specialist (宅地建物取引士), Tokyo, No. 293544`
- `Gyoseishoshi (Administrative Scrivener) (行政書士), Registration No. 25087022`

注記ブロック（枠内・小さめ）：

> Passed the Certified Social Insurance and Labor Consultant (Sharoushi, 社会保険労務士) examination (Reiwa 7 [2025], No. 202500525). He plans to open a Certified Social Insurance and Labor Consultant office in September 2026 and has not opened one at this time.

### H2: Background to our multilingual support

> Drawing on his experience being stationed in China, Taiwan, and Thailand as China General Bureau Chief, and on his studies at National Taiwan Normal University, he offers consultations in Japanese, English, and Chinese (Traditional and Simplified). The experience he built up reporting and negotiating in Chinese goes into supporting international clients as they look for a home and enter into contracts.

### H2: Operating 士業ドットコム (Shigyo Dot Com)

> He operates 士業ドットコム (Shigyo Dot Com, samurai.co.jp), a site for searching and booking licensed professionals. The site also publishes his profile and a consultation booking page.

リンク（外部・1本のみ）：
`Profile and booking page for our representative on 士業ドットコム (Shigyo Dot Com) (Japanese)`

### FAQ（3問）

heading: `Frequently asked questions about Joji Uramatsu, our representative`

1. Q `What is Joji Uramatsu's background?`
   A `He spent 34 years as a journalist at the Mainichi Shimbun and was stationed in China, Taiwan, and Thailand as its China General Bureau Chief. In 2025 he founded Yotsuba Real Estate Co., Ltd. in Kohinata, Bunkyo-ku, Tokyo, where he serves as Representative Director. At the same time he opened Yotsuba Gyoseishoshi Office, where he serves as representative gyoseishoshi.`
2. Q `What qualifications does he hold?`
   A `He is a Licensed Real Estate Transaction Specialist (Tokyo, No. 293544) and a Gyoseishoshi (Administrative Scrivener) (Registration No. 25087022). He has passed the Certified Social Insurance and Labor Consultant examination (Reiwa 7 [2025], No. 202500525) and plans to open an office in September 2026 (not yet open at this time).`
3. Q `What is the background to your Chinese-language support?`
   A `It comes from his experience being stationed in China, Taiwan, and Thailand as China General Bureau Chief, and from his studies at National Taiwan Normal University. Consultations are available in Japanese, English, and Chinese (Traditional and Simplified).`

### 関連リンク

heading: `Related pages`

- `/en/about` → `About Us`
- `/en/legal` → `Yotsuba Gyoseishoshi Office`
- `/en/souzoku` → `Inheriting real estate in Bunkyo`
- `/en/global` → `Room-hunting and multilingual support for international residents`
- `/en/contact` → `Contact`

※ 各リンク先に en 版 COPY が存在することを実装時に個別確認し、無い場合は日本語版URLへ固定（コード内コメントを残す）。

## 3. 構造化データ（英語版）

- ProfilePage `@id` = `https://luck428.com/en/about/uramatsu#profilepage`、`url` 同URL、`inLanguage: "en"`。
- Person `@id` = `PERSON_ID`（全言語共通＝KG上マージ）。`name: "Joji Uramatsu"`（Wikidata en ラベル一致）。
- `jobTitle: "Representative Director"`、`worksFor.name: "Yotsuba Real Estate Co., Ltd."`。
- `hasCredential` の `identifier` は**日本語版と完全同一値**（`（東京）第293544号` / `第25087022号`）。
  `credentialCategory` のみ英語併記形式（`Licensed Real Estate Transaction Specialist (宅地建物取引士)` /
  `Gyoseishoshi (Administrative Scrivener) (行政書士)`）。`recognizedBy.name` も同様に英語＋日本語原名。
- `sameAs` は日本語版と同一3本（Wikidata Q139738129 / ORCID / 士業ドットコム予約URL）。
- FAQPage は Faq 部品の `withJsonLd`＋`inLanguage="en"`。

## 4. 未確定・要ご判断

1. 社労士訳（上記 §1 の変更点1）。
2. `令和7年` の英訳を `Reiwa 7 [2025]` としてよいか（西暦併記は事実の追加ではなく元号の等価表記という判断）。
3. 士業ドットコム外部リンクへの `(Japanese)` 注記付与（指示(4)は /ryokin の /legal/ryokin リンク対象だが、
   同趣旨で外部リンクにも付すのが親切と判断）。
4. `credentialCategory` の英語併記形式（identifier は完全一致で固定）。
