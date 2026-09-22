# コラム挿絵プール 設計・診断書（第1段）

- 作成日: 2026-09-22
- ブランチ: `claude/focused-pasteur-z3s2gp`
- 状態: **第1段（診断のみ）完了 / 第2段（浦松の承認）待ち**
- 画像生成・コード実装は未着手（指示書の指定どおり、この時点で停止）

---

## 0. 前提の訂正（重要）

指示書は対象リポジトリを `pj-yotsuba-fudousan`（luck428.com）と指定しているが、
本セッションは `yotsuba-samurai2/samurai-app`（**samurai.co.jp / 士業ドットコムSAMURAI**）に
接続された状態で開始された。

| | samurai-app | pj-yotsuba-fudousan |
|---|---|---|
| サイト | samurai.co.jp | **luck428.com**（`src/lib/seo.ts:15`） |
| `[locale]` ルーティング | 無し | 有り |
| 指示書が挙げた5ファイル | **0/5 存在** | **5/5 存在** |
| `public/hero/` | 無し | 42点 |

`tasks/lessons.md`（2026-07-14）に同一の事故が記録されている
（「監査レポート（luck428.com対象）を samurai-app のセッションで受領した。四葉グループは別リポジトリ2つ」）。
`list_repos` で確認のうえ `pj-yotsuba-fudousan` をセッションに追加・clone し、以降の調査は全てこちらで実施した。

---

## 1. 現状の診断

### 1-1. コラム詳細テンプレート3種（挿絵が0枚である真因）

| テンプレート | 行数 | 冒頭の描画内容 |
|---|---|---|
| `src/app/[locale]/(realestate)/column/[slug]/ColumnDetailContent.tsx` | 150 | 日付・カテゴリpill・H1のみ |
| `src/app/[locale]/(legal)/legal/column/[slug]/LegalColumnDetailContent.tsx` | 70 | 同上 |
| `src/app/[locale]/(labor)/labor/column/[slug]/PageContent.tsx` | 101 | 同上 |

3ファイルのヒーロー領域は **Tailwindクラスまで含めてほぼ同一**:

```
relative grid min-h-[40vh] place-content-center overflow-hidden border-b border-border
pt-24 pb-16 sm:pt-32 sm:pb-32 md:pt-40 md:pb-40
```

**指示書の記述を1点訂正する。** 指示書は「大きなグラデーション領域」と書いているが、
`bg-green-gradient` は `src/app/globals.css:173-176` で
`background: var(--color-bg)` の**単色**に改修済み（クラス名だけが旧称のまま残っている）。
実際には「高さ40vhの無地の生成り帯」である。原因の所在（テンプレートが画像を一切描画しない）は指示書のとおり。

各テンプレートが描画する唯一の `<Image>` はヘッダーの**下**にある48pxの著者写真 `/uramatsu.png` のみ。
コラム一覧・関連記事コンポーネントにもサムネイルは存在しない（`src/components/column/` 配下に `<img>`/`<Image>` なし）。

→ **画像404ではなくテンプレート側の未実装**という指示書の診断を、ソースコード上で確認した。

### 1-2. コラムデータの分布（実測）

seedソース320件（`scripts/*-columns/`・`src/lib/data/`）を機械集計した。

| 事業 | 記事数 | 異なりcategory | 異なりtag | tag未設定 |
|---|---:|---:|---:|---:|
| realestate | 101 | 17 | 205 | 0 |
| legal | 105 | 11 | 347 | 2 |
| labor | 114 | 15 | 320 | 0 |
| **合計** | **320** | | | |

**公開状態の内訳**（`status`）:

| 事業 | published | draft |
|---|---:|---:|
| realestate | 74 | 27 |
| legal | 105 | 0 |
| labor | 114 | 0 |
| **合計** | **293** | **27** |

realestateのdraft 27件は `LEAVING_JAPAN_COLUMNS_SEED` 17件・`TAIWAN_COLUMNS_SEED` 9件・`yosekiritsu-hosei-tochine` 1件。

指示書の監査値（104 / 111 / 114 = 329）とは差がある。こちらはseedソース基準の本数であり、
本番DBのみに存在する記事の差分と考えられる（本番DBには接続していない＝未検証）。
挿絵を必要とする母数は**公開中の293件**が下限、本番DB実測値が上限になる。

**構造上の例外（9件）。** `src/lib/data/taiwan-columns-seed.ts` の9件（全てdraft）は、
**トップレベルの「日本語」フィールドに繁体中文が入っている**（title が `人在台灣，繼承了日本的不動產怎麼辦？…` 等）。
ja正本を前提とする title キーワード一致はこの9件で機能しない。
categoryは日本語（「相続不動産（クラスタE…）」）なので category/tags 一致は効く。
draftのため当面は影響しないが、**公開時にフォールバックへ落ちることを許容する**か、
明示slugルールを与えるかを決める必要がある。

**重複slug 1件。** `legal | group-home-kenchikukijunho-youto-henko` が
`AKIYA_GH_TENYO_SEED` と `GH_COLUMNS_SEED_P2` の両方から生成されている（CLAUDE.md §5-2 に既知として記載）。
画像の割当件数を数えるテストでは一意化して数える。

**categoryの偏りが大きい。** 上位3カテゴリだけで realestate 85% / legal 87% を占める:

| 事業 | 上位カテゴリ |
|---|---|
| realestate | 投資・事業用不動産 39 / 相続 30 / 離日・売却 17 |
| legal | 相続の手続き 39 / 許認可の手続き 28 / グループホーム開設 24 |
| labor | 労働法の基本 24 / 社会保険 18 / 手続と期限 13 / 誰に頼むか 11 |

→ **categoryだけで画像を選ぶと1枚の画像が39記事に付く。**
tag（各事業200〜350種）を第一の一致キーにし、さらに slug の安定ハッシュで分散させる必要がある。

主要タグ:

| 事業 | 上位タグ |
|---|---|
| realestate | 相続38 / 事業用不動産32 / 許認可28 / 用途地域25 / 売却23 / 非居住者15 / 文京区14 / 離日13 / 台湾10 |
| legal | 行政書士64 / 許認可27 / グループホーム24 / 相続19 / 指定申請9 / 相続登記8 / 遺言7 / 会社設立5 |
| labor | 社会保険33 / 就業規則25 / 外国人雇用20 / 業際16 / 労基法12 / 雇用保険11 / 労働時間10 / 労務管理10 |

### 1-3. `ogImage` の登録率

- **登録率 0%**（320件中 0件）。seedソースに `ogImage` を設定している記事は存在しない。
- 型としては存在する（`src/lib/column-shared.ts:38,71`、`prisma/schema.prisma` の `og_image`）。
- 現在の唯一の利用箇所は `src/components/seo/BlogPostingJsonLd.tsx:26`
  （`column.ogImage || biz.ogImage` で JSON-LD の `image` に使う）。
  結果として全コラムの JSON-LD 画像は事業既定OG（`/og.png` 等）になっている。
- 形式は未使用のため**ローカル/外部の内訳は存在しない**。
- **管理画面から設定できない。** `src/components/admin/ColumnForm.tsx` に `ogImage` の入力欄が無い
  （business / status / slug / date / category / 公開言語 / title / excerpt / content / author / keywords / tags / FAQ ＋ 各言語タブ）。
  → 優先順位1の `ogImage` を実装しても、**現状は誰も値を入れられない**。
  フォームへの入力欄追加は今回の対象外だが、浦松の判断事項として 10章に挙げる。
- **言語別に変えられない。** `ColumnTranslation`（`src/lib/column-shared.ts:13-22`）に画像フィールドが無く、
  `ogImage` はカラムレベルのスカラー。指示書の「同じslugは4言語で同じ画像」はデータ構造上も保証される。

**外部URLは next/image で描画できない。** `next.config.ts` の `images` は
`qualities: [60,75]` と `deviceSizes` のみで、`remotePatterns`・`domains` を設定していないため、
絶対URLを `next/image` に渡すと実行時エラーになる。
→ 選択ロジックは **`/` で始まるローカルパスのみ next/image に渡し、それ以外は不採用にして
テーマ一致／フォールバックへ落とす**（壊れた画像を出さない）。

### 1-4. 既存 `public/hero/` との重複

42点 / 3.82MB。実体は **20点の16:9テーマ画像**とその派生。

| 事業 | 既存16:9テーマ画像 |
|---|---|
| realestate | `toushi` `group-home` `shataku` `global` |
| legal | `inheritance` `company` `subsidy` `visa` `shogai-fukushi` `top` |
| labor | `saiyo` `joseikin` `kaigo-roumu` `gaikokujin-koyo` `jinin-kijun-roumu` `shogu-kaizen` `shogai-nenkin` `gaibu-kansanin` `top` |
| 共通 | `bunkyo-sakura` |

仕様は 1600×900 / WebP / 25〜107KB。指示書の「1600×900・120KB以下」と既に一致している。

**既存画像の視覚スタイルを実物で確認した（4点を展開して目視）。**
淡い水彩・生成りの地・くすんだ緑と藍鼠のアクセント・人物の顔を描き込まない・画面内に文字なし・
主題は中央寄り・余白が広い。**指示書の視覚仕様とほぼ完全に一致している。**

→ 「ゼロから48点」ではなく、**既存20点を同一シリーズの一部として取り込み、不足分だけを新規生成する**のが正しい。

**併せて判明した既存の不具合（今回の対象外・未修正）:**

- `src/app/[locale]/(realestate)/nagare/page.tsx:214` が `/hero/realestate-souzoku-16x9.webp` を参照しているが、
  **このファイルは存在しない**。`/nagare` で画像が404になっている。
- `1x1` 派生20点と `bunkyo-sakura-16x9-sm.webp` の計21点（1.89MB＝ディレクトリの49%）が
  **どこからも参照されていない**。`legal/services/shogai-fukushi/page.tsx:824` のコメントに
  「SP は -1x1 も利用可」とあり、SP用の出し分けが実装されないまま残った資産と見られる。
- `public/yotsuba/.next/{trace,trace-build}` がビルド生成物のままコミットされている。
- `public/uramatsu.png`（741KB）が3テンプレートすべてで48pxの著者写真として使われている。
  7KBの `public/staff/uramatsu-square.webp` が未参照のまま存在する。

### 1-5. 画像生成に使えるツール・API・認証（第1段の最重要確認事項）

| 経路 | 可否 | 根拠 |
|---|---|---|
| text-to-image 生成AI | **不可** | Adobe MCP は "generative editing is not currently available" と明示。Canva は文字入りデザイン生成で用途違い |
| 生成用APIキー | **無し** | リポジトリ内の `process.env.*` は DEEPSEEK / ANTHROPIC / RESEND / SUPABASE 等のみ。画像生成系は無い（ANTHROPIC APIに画像生成は無い） |
| `sharp`（リサイズ・WebP化） | **可** | libvips 8.18.6、`npm install sharp` 成功 |
| luck428.com 本番への到達 | **不可** | egress proxy がブロック（`EGRESS_BLOCKED`） |
| 監査CSV / サマリー | **取得不可** | 浦松のMac上のパスのため本環境に存在しない |

**既存画像の生成経路はリポジトリ履歴に記録されていた。** コミット `c9c3749`:

> 浦松が **GPT Image 2** で生成した原画（1672x941）から **sharp** で 1600x900 / 1080x1080 に
> cover リサイズし、100KB以下に収まるよう webp 品質を自動調整（略）
> 既存のスタイル（淡い水彩・生成りの背景・くすんだ深緑のアクセント・人物の顔を描き込まない・
> 画面内に文字なし）に沿っている。
>
> ★申し送り：原画の右下隅に GPT Image の可視ウォーターマークとみられる淡い記号がある。

→ **確立済みの分業は「浦松が GPT Image 2 で生成 → リポジトリ側が sharp で加工・実装」。**
生成工程はこの環境の外にある。指示書の
「実画像を生成できない場合は、設計・プロンプト・マニフェスト案までを提示して停止し、必要なツールまたはAPIを明示する」
に該当する。

ウォーターマークの件は、`labor-saiyo-16x9.webp` の右下隅を高コントラストで拡大して確認したが、
1600×900版では**判別できなかった**（原画は本環境に無いため断定は不可＝未検証）。

**プログラムによるSVG生成は採らない。** sharp でSVG→WebPは技術的に可能だが、
平面ベクターは上記の水彩シリーズと並べたとき明らかに別物になり、
指示書の「シリーズとして統一感を持たせる」「低品質な代用品を勝手に量産しない」に反する。

---

## 2. 提案：最終テーマ一覧（52テーマ）

各事業15点以上という条件を満たす。**既存18点を流用し、新規生成は34点。**

### 2-1. realestate（18テーマ / 新規13）

| # | theme | 状態 | 主な一致キー |
|---|---|---|---|
| 1 | `souzoku-fudosan` | ★新規 | 相続 / 相続不動産 / 実家 |
| 2 | `akiya` | ★新規 | 空き家 / 3000万円控除 |
| 3 | `isan-bunkatsu` | ★新規 | 遺産分割 / 共有 / 持分 |
| 4 | `baikyaku-satei` | ★新規 | 売却 / 査定 / 不動産売却 |
| 5 | `keiyaku-kessai` | ★新規 | 契約 / 決済 / 重要事項説明 |
| 6 | `jouto-shotoku` | ★新規 | 譲渡所得 / 確定申告 / 納税管理人 |
| 7 | `youto-chiiki` | ★新規 | 用途地域 / 接道 / 再建築 |
| 8 | `jigyou-fudosan` | ★新規 | 事業用不動産 / オフィス |
| 9 | `inshokuten` | ★新規 | 飲食店 / 店舗 / 消防法 |
| 10 | `toushi` | ✔既存 | 投資 / 収益 / 利回り |
| 11 | `owner-change` | ★新規 | オーナーチェンジ / 賃貸経営 |
| 12 | `yuushi-deguchi` | ★新規 | 融資 / 出口 / 収支 |
| 13 | `group-home` | ✔既存 | グループホーム / 障害福祉 |
| 14 | `shataku` | ✔既存 | 社宅 |
| 15 | `global` | ✔既存 | 非居住者 / 海外オーナー |
| 16 | `taiwan-chuuka` | ★新規 | 台湾 / 中国語圏 |
| 17 | `rinichi` | ★新規 | 離日 / 帰国 |
| 18 | `bunkyo` | ✔既存(`bunkyo-sakura`) | 文京区 / 地域 |

### 2-2. legal（17テーマ / 新規12）

| # | theme | 状態 | 主な一致キー |
|---|---|---|---|
| 1 | `souzoku-tetsuzuki` | ✔既存(`inheritance`) | 相続の手続き / 相続 |
| 2 | `koseki-ichiranzu` | ★新規 | 戸籍 / 法定相続情報一覧図 |
| 3 | `isan-bunkatsu-kyougi` | ★新規 | 遺産分割協議書 |
| 4 | `iryuubun` | ★新規 | 遺留分 |
| 5 | `yuigon` | ★新規 | 遺言 |
| 6 | `ninni-kouken` | ★新規 | 任意後見 / 死後事務 |
| 7 | `souzoku-zei` | ★新規 | 相続税 / 税理士連携 |
| 8 | `kaisha-setsuritsu` | ✔既存(`company`) | 会社設立 |
| 9 | `kyoninka` | ★新規 | 許認可 |
| 10 | `shitei-shinsei` | ★新規 | 指定申請 |
| 11 | `group-home-kaisetsu` | ✔既存(`shogai-fukushi`) | グループホーム開設 |
| 12 | `jinin-setsubi-kijun` | ★新規 | 人員基準 / 設備基準 |
| 13 | `inshoku-ryokan` | ★新規 | 飲食 / 旅館 / 民泊 / 酒類 |
| 14 | `kensetsu-unsou` | ★新規 | 建設 / 産廃 / 運送 / 自動車 |
| 15 | `zairyuu-shikaku` | ✔既存(`visa`) | 在留資格 / 外国人雇用 |
| 16 | `kousho-ninshou` | ★新規 | 公証 / 認証 / 翻訳 / 台湾 |
| 17 | `hojokin` | ✔既存(`subsidy`) | 補助金 |

### 2-3. labor（17テーマ / 新規9）

| # | theme | 状態 | 主な一致キー |
|---|---|---|---|
| 1 | `shugyo-kisoku` | ★新規 | 就業規則 / 労使協定 |
| 2 | `roudou-jikan` | ★新規 | 労働時間 / 36協定 |
| 3 | `roudou-jouken` | ★新規 | 労働条件明示 / 雇用契約 |
| 4 | `kyuyo-keisan` | ★新規 | 給与計算 / 標準報酬月額 |
| 5 | `shakai-hoken` | ★新規 | 社会保険 / 適用拡大 |
| 6 | `koyou-hoken` | ★新規 | 雇用保険 / 労働保険 / 労災 |
| 7 | `nenkin` | ✔既存(`shogai-nenkin`) | 年金 |
| 8 | `saiyo` | ✔既存 | 採用 / 面接 |
| 9 | `taishoku-kaiko` | ★新規 | 退職 / 解雇 |
| 10 | `harassment` | ★新規 | ハラスメント / 相談窓口 |
| 11 | `mental-health` | ★新規 | メンタルヘルス / 休職 / 復職 |
| 12 | `gaikokujin-koyo` | ✔既存 | 外国人雇用 / 育成就労 / 特定技能 |
| 13 | `kaigo-roumu` | ✔既存 | 介護 / 障害福祉の労務 |
| 14 | `jinin-kijun-roumu` | ✔既存 | 人員基準 / 常勤換算 |
| 15 | `joseikin` | ⏸保留 | 助成金 ※天秤の件で今回のプールからは外す。該当記事はフォールバックへ |
| 16 | `shogu-kaizen` | ✔既存 | 処遇改善 / 賃金制度 |
| 17 | `gaibu-kansanin` | ✔既存 | 労務監査 / 帳簿 / 勤怠 |

### 2-4. 合計とフォールバック

| 事業 | テーマ数 | 既存流用 | 新規生成 |
|---|---:|---:|---:|
| realestate | 18 | 5 | **13** |
| legal | 17 | 5 | **12** |
| labor | 16 | 7 | **9** |
| **合計** | **51** | **17** | **34** |

labor が17→16テーマなのは、`labor-joseikin-16x9.webp` を天秤の件（§10・`illustration-prompts.md` §5）で
**今回のプールから外した**ため。各事業15点以上の条件は維持している。
助成金テーマの記事（category「助成金」2件ほか）は事業別フォールバックへ落ちる。

**なお `labor-joseikin-16x9.webp` のファイル自体は削除しない。**
`/labor/services/joseikin`（`LaborServicePage.tsx:115` のslug補間）が現に使用しており、
今回の変更はコラム挿絵マニフェストに載せないというだけ。
サービスページ側の天秤の是非は保留＝別途検討とする。

事業別フォールバック（いずれも既存画像・新規生成不要）:
`realestate → bunkyo-sakura` / `legal → legal-top` / `labor → labor-top`
（`labor-top-16x9.webp` は現在オーファン。フォールバックに使うと死蔵資産が復活する）

テーマ #1 `souzoku-fudosan` を `realestate-souzoku-16x9.webp` の名前で作れば、
1-4 で挙げた `/nagare` の404も同時に解消する（**承認があれば**）。

### 2-5. 配置と命名（指示書からの逸脱提案）

指示書は `public/illustrations/columns/{business}/` を候補としているが、
**既存の `public/hero/{business}-{theme}-16x9.webp` に揃えることを提案する。**

理由: 既存18点を流用する以上、2つのディレクトリに同一シリーズが分散するのは避けたい。
`LegalServicePage.tsx:94` / `LaborServicePage.tsx:115` が既に
`` `/hero/{business}-${slug}-16x9.webp` `` のテンプレート補間規約を持っており、同じ規約に乗る方が整合する。

**この逸脱は浦松の承認事項とする。**

---

## 3. 画像選択ルールの優先順位（案）

`src/lib/column-illustrations.ts` に純関数として実装する。3テンプレートに個別のif文は書かない。

```
1. column.ogImage が "/" で始まるローカルパス      → それを使う（記事固有指定が最優先）
   （絶対URL・空文字は next/image で描画不可のため採用せず 2 へ落とす）
2. slugPatterns の明示ルールに完全一致            → 指定画像
3. ja正本 tags のキーワード一致（重み2）          → テーマ画像
4. ja正本 category のキーワード一致（重み1）      → テーマ画像
5. ja正本 title のキーワード一致（重み1）         → テーマ画像
6. 事業別フォールバック群から slug の安定ハッシュ → 必ず1枚返る（画像0枚を発生させない）
```

- 3〜5は加点方式で最高得点のテーマを採る。同点は**テーマ定義順**で決める（配列の取得順序に依存しない明示的な順序）。
- 同一テーマに複数variantがある場合は **slugのFNV-1a安定ハッシュ** で分散。`Math.random()`・現在時刻・オブジェクトキー順は使わない。

### 3-1. 4言語で同じ画像になるための必須条件

`getLocalizedColumn()`（`src/lib/column-shared.ts`）は **`category` と `tags` をローカライズ版に差し替える**。
en では `"Inheritance"`、zh では `"继承"` になるため、ローカライズ後の値で判定すると
**4言語で別画像になる**。

同じ罠を踏んだ前例がリポジトリ内にある。`resolveRealestateColumnCta()` のコメント:

> ★呼び出し側は getLocalizedColumn 前の base（ja）を渡すこと。
> en/zh の category は "Inheritance"／"继承" 等に差し替わるため一致しない＝既定CTAに落ちる。

3つの `page.tsx` はいずれも `base`（ja正本）と `col`（ローカライズ後）の**両方を保持している**
（例: `(realestate)/column/[slug]/page.tsx:52,57`）。
→ **`page.tsx` 側で `base` から画像を解決し、結果を props で Content に渡す。**
既存 `resolveRealestateColumnCta` と同じ作法に揃えるのが最もエレガントで、新しい規約を持ち込まない。

altのみ locale で出し分ける（画像srcは4言語共通）。

---

## 4. 表示設計（案）

3テンプレートのヒーローは実質同一コードなので、共通部品
`src/components/column/ColumnArticleHero.tsx` に集約する。配色・リンク・事業差異はpropsで維持する。

- **文字を画像に重ねない。** 52点すべてで十分なコントラストを保証できないため、
  指示書の条件（「全画像でコントラストを保証できる設計に限る」）を満たせない。
  テキストと画像を明確に分ける構成にする。
- **PC（1440px）**: 現行の `min-h-[40vh]` 無地帯を活かし、左に日付・カテゴリpill・H1、右に16:9挿絵の2カラム。
- **タブレット（768px）/ スマホ（390px）**: 縦並び。H1が先、その下に16:9挿絵。タイトルは切らない。
- **CLS対策**: `aspect-ratio: 16/9` と明示的 `width/height` で領域を確保。
- **LCP対策**: `next/image` + `priority` + `quality={60}`
  （`next.config.ts` の `qualities:[60,75]` で許可されている値のみ使用可）。
  `sizes` は PC で約576px、SPで100vw を想定して設定し、過大配信を避ける。
- 画像の上下に大きな余白を残さない（現行 `pt-40 pb-40` は画像追加に合わせて調整）。
- 既存の著者欄・本文・前後記事・関連記事・CTAの順序は変更しない。
- 本文内に固有の画像を持つ記事があっても、それらは削除・置換しない。

`1x1` 派生20点をSP用アートディレクションに使う案もあるが、
新規34点にも1x1が必要になり生成コストが倍になるため、**今回は16:9のみとする**（既存画像は中央寄せ構図で
390px幅でも主題が欠けない）。

---

## 5. 変更対象ファイル（第3段で触る想定）

**新規**
- `src/lib/column-illustrations.ts` … マニフェスト＋純粋な選択関数
- `src/lib/__tests__/column-illustrations.test.ts` … テスト（vitestの `include` は `src/**/__tests__/**/*.test.ts`）
- `src/components/column/ColumnArticleHero.tsx` … 3事業共通ヒーロー
- `public/hero/{business}-{theme}-16x9.webp` … 新規34点
- `docs/columns/illustration-manifest.md` … 生成日・使用モデル・プロンプト・権利確認メモ
- `docs/columns/illustration-pool-review-packet.md` … 第4段用

**編集**
- `src/app/[locale]/(realestate)/column/[slug]/page.tsx` … `base` から解決してprops付与
- `src/app/[locale]/(legal)/legal/column/[slug]/page.tsx` … 同上
- `src/app/[locale]/(labor)/labor/column/[slug]/page.tsx` … 同上
- `ColumnDetailContent.tsx` / `LegalColumnDetailContent.tsx` / `PageContent.tsx` … ヒーロー部を共通部品へ差し替え

**触らない**
- `prisma/schema.prisma`（スキーマ変更・migrationなし）
- 本文コンテンツ、物件写真、管理画面、CTA、既存JSON-LDの構造

---

## 6. テスト計画

- `ogImage` 優先（ローカルパス時）／外部URL時にフォールバックへ落ちること
- slug明示ルールの優先
- category・tags・titleのテーマ一致
- フォールバック動作（全事業でnullを返さない）
- 同一slugの再実行で同一結果（決定論）
- 4言語で同一src・各言語で異なるalt
- マニフェストの全画像が `public/` に実在（ファイル存在チェック）
- id・src・altの必須値と重複なし
- 3事業すべてが最低点数とフォールバックを持つ
- 320件の実seedを流し、**全件で画像が1枚決まること**と**1枚あたりの最大割当件数**を検証
  （1枚が39記事に付く偏りを機械的に検出する）

---

## 7. 想定リスク

| リスク | 対策 |
|---|---|
| 320ページのファーストビューに画像が増えLCP悪化 | `quality=60`・適切な`sizes`・`priority`・既存同等の容量（≦120KB） |
| categoryの偏りで同一画像が多数の記事に集中 | tag優先の加点方式＋slug安定ハッシュ分散＋テストで最大割当件数を検証 |
| 4言語で別画像になる | ja正本（`base`）で解決。`resolveRealestateColumnCta` と同じ作法 |
| 3テンプレート同時改修による回帰 | 共通部品化し、3事業の代表ページで確認 |
| ローカルビルドにDATABASE_URLが必要 | `tasks/lessons.md` 記載の `prisma dev` + `pgbouncer=true` 手順（本番DBには接続しない） |
| Vercel PreviewはSSO保護でcurl不可 | ローカル本番ビルドで実測、Previewは目視用 |
| 新規画像のウォーターマーク | 納品時に右下隅を確認し、マニフェストへ記録 |

## 8. 検証できないこと（正直な申告）

- **luck428.com 本番ページの実地確認**: egress proxy がブロックしており本環境から到達不可。
  指示書の「監査ロジックを再実行して挿絵0枚を0件にする」は、本環境では実行できない。
  ソースコード上で「テンプレートが画像を描画していない」ことは確認済み。
- **監査CSV / サマリーの突合**: 浦松のMac上のパスのため未取得。
- **既存画像のウォーターマーク**: 1600×900版では判別できず、原画が無いため断定不可。
- 記事本数の僅差（seed 320件 vs 監査 329件）: 本番DBに接続していないため未確認。

---

## 9. 対象外（指示書どおり）

コラム本文の一括改稿 / 物件詳細写真の変更 / 管理画面の機能追加 /
DBスキーマ変更・migration・本番DB書込み / 固定ページへの一律画像追加 / 本番merge・本番deploy

---

## 10. 浦松への確認事項（第2段）

1. **新規34点の生成を浦松側（GPT Image 2）で実施するか。** 本環境に生成AIは無い。
   承認いただければ、テーマ別の**生成プロンプト全文**とファイル名・配置先を次に提示する。
2. **52テーマ・この内訳でよいか**（realestate 18 / legal 17 / labor 17）。
3. **配置先を `public/hero/` に揃える逸脱**（指示書は `public/illustrations/columns/`）を認めるか。
4. **文字を画像に重ねない構成**でよいか（PCは2カラム、SPは縦並び）。
5. **先行実装の可否**: 新規画像を待たず、既存18点＋フォールバックだけで
   選択ロジック・共通ヒーロー・4言語alt・テストを先に実装してよいか。
   これだけで「挿絵0枚」は全ページで解消する（画像の多様性は34点納品後に上がる）。
6. **`ColumnForm` への `ogImage` 入力欄追加**を今回の範囲に含めるか。
   含めない場合、優先順位1は将来のための空実装になる（動作はするが値が入らない）。
7. **台湾draft 9件**（トップレベルが繁体中文）の扱い。フォールバック許容か、明示slugルールを与えるか。

## Approved scope

### 2026-09-22 承認分

| # | 論点 | 決定 |
|---|---|---|
| 1 | 新規34点の生成主体 | **浦松側（GPT Image 2）で行う。** プロンプト全文・ファイル名は `docs/columns/illustration-prompts.md` に作成済み |
| 3 | 配置先 | **既存の `public/hero/` に揃える。** 指示書の `public/illustrations/columns/` は採らない |
| 5 | 先行実装 | **行わない。34点の納品を待って一度に実装する。** |
| 8 | `labor-joseikin-16x9.webp` の天秤 | **判断を保留し別途検討。** 今回のコラム挿絵プールからは外す。生成は34点のまま（35点にしない） |

**現在の状態: 浦松からの原画34点の納品待ち。リポジトリ側の実装は着手しない。**

納品後の手順は `illustration-prompts.md` §4 のとおり
（変換 → `public/hero/` へ配置 → マニフェスト作成 → 選択ロジック・共通ヒーロー・テストの実装 → 第4段レビューパケット）。

### 2026-09-22 追加承認・実装済み

- **天秤の扱い**: 「見逃す」。`legal-top` / `labor-shogu-kaizen` / `labor-joseikin` の3点はプールに入れた。
  いずれも公開中のサービスページでも使われている（`/legal`・`/labor/services/shogu-kaizen`・`/labor/services/joseikin`）。
- **既存画像だけで先行実装する**（新規34点を待たない）。

## 11. 実装記録（第3段・第1弾）

新規画像を待たず、**既存20点のうち19点**でプールを構成して実装した。
`bunkyo-sakura` は実写写真（437KB）だが、文京区タグの記事に限って使う（汎用フォールバックにはしない）。

**追加ファイル**
- `src/lib/column-illustrations.ts` … マニフェスト19点＋純粋な選択関数
- `src/lib/__tests__/column-illustrations.test.ts` … 16ケース
- `src/components/column/ColumnArticleHero.tsx` … 3事業共通ヒーロー

**変更ファイル**（3事業 × page.tsx / Content の6本）
ヒーロー部を共通部品へ差し替え、`page.tsx` で **ja 正本の `base`** から挿絵を解決して props で渡す。
`resolveRealestateColumnCta` と同じ作法。既存の著者欄・本文・前後記事・関連記事・CTA・JSON-LD には触れていない。

**プール構成（19点）**

| 事業 | 点数 | フォールバック |
|---|---:|---|
| realestate | 6（うち1点は `legal-inheritance` の共用、1点は実写の `bunkyo-sakura`） | `realestate-shataku` |
| legal | 6 | `legal-top` |
| labor | 9 | `labor-top` |

**実データ249件での実測**

- フォールバック適用 **0件（0.0%）**＝全記事がテーマ一致した
- 1画像あたりの最大割当 **57件**（`legal-inheritance`。realestate 21 + legal 36 の合算）
- 事業別の上位：realestate `toushi` 34 / legal `inheritance` 36 / labor `shogai-nenkin` 34

**検証結果**

| 項目 | 結果 |
|---|---|
| `npx tsc --noEmit` | 通過 |
| `npx eslint`（変更ファイル） | 通過 |
| `npx vitest run`（全体） | 71ファイル・1034ケース通過 |
| dev サーバでの実HTML | 3事業 × 4言語 ＋ フォールバックの5パターンで挿絵の描画を確認 |
| 4言語の一貫性 | 同一 slug で src 同一・alt のみ各言語（実HTMLで確認） |

`npx next build` は `DATABASE_URL` が必要で、使い捨てDB（`prisma dev`）が
ビルド中に繰り返し落ちたため**完走できていない＝未検証**。
代わりに dev サーバで実HTMLを確認した。本番相当のビルドは Vercel プレビューで確認する。

**この実装で満たしていない完成条件（画像が増えるまで）**

- 「最低48点、各事業15点以上」… 現在19点（realestate 6 / legal 6 / labor 9）
- 「同じ画像の過度な連続使用を避ける」… 最大57記事が同一画像
- いずれも `column-illustrations.ts` に1行足すだけで改善する。テンプレート側の変更は不要。

### 未承認（納品後・実装着手前に判断が必要）

| # | 論点 | 現状 |
|---|---|---|
| 2 | 51テーマのこの内訳でよいか（realestate 18 / legal 17 / labor 16） | プロンプト集はこの内訳を前提に作成済み |
| 4 | 文字を画像に重ねない構成でよいか | 未着手 |
| 6 | `ColumnForm` への `ogImage` 入力欄追加を範囲に含めるか | 未着手 |
| 7 | 台湾draft 9件（トップレベルが繁体中文）の扱い | 未着手 |
