# コラム挿絵プール レビューパケット（第4段）

- 作成日: 2026-09-24
- 対象PR: https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/pull/428
- 先行してマージ済み: #386（挿絵表示の実装）/ #385（診断書・生成プロンプト集）

## レビューをお願いする方へ

**気づいた点をすべて挙げ、それぞれに重要度を付けてください。**
「重大なものだけ」ではなく、些細に思えるものも含めて全部書いてください。
重要度の目安は、致命（公開できない）／高（公開前に直す）／中（次の改修で直す）／低（好みの範囲）。

このパケットは、別セッションの Claude か人が、実装を知らない状態からレビューできるように書いています。

---

## 1. 何をしたか

3事業（不動産・行政書士・社労士）のコラム詳細ページに挿絵を表示する機能です。
着手前は、本文1,200字以上の記事に著者写真（48px）以外の画像が1枚もありませんでした。

原因はテンプレート側の未実装でした。3つのコラム詳細テンプレートは Tailwind クラスまでほぼ同一で、
描画していたのは日付・カテゴリpill・H1だけです（画像404ではありません）。

### 3本のPRの関係

| PR | 内容 | 状態 |
|---|---|---|
| #385 | 診断書 `illustration-pool-plan.md` ＋ 生成プロンプト集 `illustration-prompts.md` | マージ済み |
| #386 | 共通ヒーロー `ColumnArticleHero` ＋ 選択ロジック ＋ 3テンプレート改修 ＋ JSON-LD の image 整合 | マージ済み |
| **#428** | **追加した34点が1点も表示されていなかった問題の是正**（本パケットの主対象） | レビュー待ち |

#428 で直した内容が最も重要なので、次節で単独に説明します。

## 2. #428 で直したこと（最重要）

2026-09-23 に新規34点の画像が追加されましたが、**その34点は1枚も表示されていませんでした。**

原因は2つです。

1. 34点が `ILLUSTRATIONS`（リゾルバが参照する唯一の定義）ではなく、
   **どこからも参照されていない別の配列 `COLUMN_ILLUSTRATIONS`** に登録されていた
2. `THEME_RULES`（記事→テーマの振り分け）が更新されず、21本すべてが既存画像向けのままだった

`getColumnIllustrationAssetPaths()` は `ILLUSTRATIONS` を見るため、**ファイル存在テストは通り続けます。**
「登録したのに表示されない」を検出する手段がありませんでした。

### 実データ269件での改善

| | #428 の前 | #428 の後 |
|---|---:|---:|
| 実際に使われる画像 | 15点 | **46点** |
| 1画像あたりの最大割当 | 67件 | **26件** |
| フォールバック適用 | 17件（6.3%） | **2件（0.7%）** |

母数は `REALESTATE_COLUMNS_DAILY_SEED` ＋ `SOUZOKU_LEGAL_COLUMNS_SEED` ＋ `LABOR_COLUMNS_SEED`。

### 変更点

- 34点を `ILLUSTRATIONS` へ統合し、日本語のみだった alt を4言語に拡張
- 未参照の `COLUMN_ILLUSTRATIONS` と型 `ColumnIllustration` を削除
- `THEME_RULES` を21本→52本。全テーマに経路を与え、狭いテーマを広いテーマより前に並べた
- **キーワード一致を2段階にした。** タイトル・カテゴリ・slug を先に見て、そこで決まらないときだけタグを見る
- 社労士の既定を `labor-jinin-kijun-roumu`（シフト表＝人員基準の専用画像）から汎用の `labor-top` へ
- `getUnreachableIllustrationThemes()` を追加。どのルールからも到達できないテーマがあればテストが落ちる

2段階一致は、タグに偶然入っていた語が主題を上書きしていたためです。実例：

| 記事 | 是正前 | 是正後 |
|---|---|---|
| 就業規則 10人の義務 | ハラスメント相談窓口の絵（タグの「ハラスメント」に一致） | 就業規則の冊子 |
| 助成金は誰に頼むか | 労働保険の絵（タグの「雇用保険」に一致） | 握手（助成金） |
| 自動車特定整備の認証申請 | 公証・認証の絵（「認証」に一致） | 建設・運送の絵 |

## 3. 画像一覧と確認方法

**54点**（realestate 17 / legal 18 / labor 18 / 共通1）。指示書の「最低48点・各事業15点以上」を満たします。

すべて `public/hero/{theme}-16x9.webp`、1600×900。`bunkyo-sakura`（実写写真・437KB）以外は120KB以下の水彩シリーズです。

### サムネイル一覧の作り方

```bash
cd public/hero
# 一覧をHTMLで見る
{ echo '<style>img{width:240px;margin:4px}</style>';
  for f in *-16x9.webp; do echo "<figure><img src=\"$f\"><figcaption>$f</figcaption></figure>"; done; } > /tmp/hero.html
open /tmp/hero.html
```

マニフェスト（点数・生成経路・権利確認メモ）は `docs/columns/illustration-pool-manifest.md`。
34点の生成プロンプト全文は `docs/columns/illustration-prompts.md`。

## 4. 選択ルール

`src/lib/column-illustrations.ts` の1か所で決まります。3事業のテンプレートに個別の分岐はありません。

```
1. 記事固有の ogImage（"//" 始まりと javascript:/data: は弾く）
2. SLUG_OVERRIDES の明示指定
3. タイトル・カテゴリ・slug のキーワード一致（THEME_RULES を先頭から。最初に一致したものが勝つ）
4. タグのキーワード一致（同上）
5. 事業別のフォールバック（DEFAULT_THEME）
```

**★判定は `getLocalizedColumn` 前の ja 正本で行います。** `col` は category・tags が翻訳版に
差し替わるため、`col` で判定すると4言語で別々の画像になります。
同じ罠と対処が `resolveRealestateColumnCta` にあり、その作法に揃えています。

`Math.random()`・現在時刻・オブジェクトのキー順には依存しません。同じ slug なら常に同じ画像です。

### 明示指定（SLUG_OVERRIDES）

| slug | テーマ | 理由 |
|---|---|---|
| `souzoku-kigen-matome` | `legal-inheritance` | タイトルが「相続放棄・準確定申告・相続税・相続登記・遺留分」と小見出しを列挙しており、キーワード一致では必ず先頭の語に引っ張られる |

## 5. 代表確認URL

プレビュー: https://pj-yotsuba-fudousan-git-claude-focused-5838ab-yotsuba-samurai2.vercel.app

ロケールは先頭に付けます（`/en/...`・`/zh-tw/...`・`/zh/...`）。

### 必ず見てほしい3本（3事業 × 主要テーマ）

| 事業 | パス | 期待する画像 |
|---|---|---|
| 不動産 | `/column/souzoku-shakuchi-jinushi-shodaku-baikyaku` | 相続した実家と二人の後ろ姿 |
| 行政書士 | `/legal/column/souzoku-kigen-matome` | 家系図と日本家屋（明示指定が効いているか） |
| 社労士 | `/labor/column/106man-no-kabe-teppai-jigyousha-yaru-koto` | 人々を覆う淡い半円（社会保険） |

**社労士レーンは `NEXT_PUBLIC_SR_LAUNCHED=true` でないと `(labor)/layout.tsx` が404にします**（既存仕様）。
プレビューでフラグが立っていない場合、社労士コラムは確認できません。実装の不具合ではありません。

### フォールバックで決まる記事（2件のみ）

- `/labor/column/ai-jugyoin-joho-nyuryoku-yoihi`
- `/labor/column/shogaisha-koyoritsu-2.7-kakunin-jiko`

どちらも `labor-top`（事務所と書類）になります。

### 4言語の確認

同じ slug で **src が同一・alt だけ各言語**になることを見てください。例：

```
src: /hero/labor-shakai-hoken-16x9.webp
ja   : 淡い半円が人々を覆う社会保険の仕組みを表した水彩イラスト
en   : Watercolor illustration of a soft arc sheltering people, representing social insurance
zh-tw: 淡色半圓覆蓋人們、象徵社會保險的水彩插畫
zh   : 淡色半圆覆盖人们、象征社会保险的水彩插画
```

### テーマ別の割当と代表記事（実データ269件）

#### realestate（73記事 / 12テーマ）
| テーマ | 件 | 代表記事（確認用パス） |
|---|---:|---|
| `realestate-jigyou-fudosan` | 26 | `/column/clinic-bukken-youto-chiiki-kaisetsu-todokede`<br>`/column/unsou-eigyosho-shako-bukken-yoken` |
| `realestate-souzoku` | 22 | `/column/souzoku-shakuchi-jinushi-shodaku-baikyaku`<br>`/column/souzoku-nochi-baikyaku-kashidashi-nagare` |
| `realestate-taiwan-chuuka` | 5 | `/column/chugokugo-buyer-juyojiko-check-toushi-bukken`<br>`/column/baibai-keiyaku-teppukin-loan-tokuyaku-chugokugo-buyer` |
| `realestate-isan-bunkatsu` | 4 | `/column/souzoku-kyoyu-fudosan-uru-doui`<br>`/column/souzoku-shido-mochibun-ichitei-doro-baikyaku` |
| `realestate-baikyaku-satei` | 4 | `/column/rinchi-baikyaku-kaimashi-nanari-tochi-deguchi`<br>`/column/setback-42jo-2ko-doro-tochi-baikyaku-menseki` |
| `realestate-akiya` | 3 | `/column/chuka-souzoku-akiya-shodo-genchi`<br>`/column/souzoku-akiya-kaitai-koyatsuki-dochira` |
| `realestate-group-home` | 2 | `/column/kensazumisho-nashi-bukken-fukushi-youto-henko`<br>`/column/ninchisho-taiogata-grouphome-bukken-youken` |
| `realestate-global` | 2 | `/column/hikyojusha-buyer-apart-loan-yushi-kanou`<br>`/column/tokku-minpaku-bukken-youken-nintei` |
| `realestate-youto-chiiki` | 2 | `/column/saikenchiku-fuka-43jo-2ko-nintei-kyoka-dare-ga`<br>`/column/saikenchiku-fuka-kashite-mochitsuzukeru-reform-hani` |
| `realestate-inshokuten` | 1 | `/column/inshokuten-skeleton-bukken-haiki-grease` |
| `realestate-jouto-shotoku` | 1 | `/column/kaigai-souzokunin-owner-change-baikyaku-gensen` |
| `realestate-yuushi-deguchi` | 1 | `/column/kyosho-tochi-15tsubo-uru-ikasu-bunkyo` |

#### legal（78記事 / 16テーマ）
| テーマ | 件 | 代表記事（確認用パス） |
|---|---:|---|
| `legal-inheritance` | 18 | `/legal/column/souzoku-kaigai-gaikokuseki`<br>`/legal/column/souzoku-zaisan-mokuroku` |
| `legal-isan-bunkatsu-kyougi` | 10 | `/legal/column/isan-bunkatsu-kyougisho`<br>`/legal/column/souzoku-isanbunkatsu-chotei-shinpan` |
| `legal-kensetsu-unsou` | 9 | `/legal/column/sanpai-shushu-unpan-kyoka-torikata`<br>`/legal/column/ippan-kamotsu-unso-kyoka-eigyosho-shako-yoken` |
| `legal-kyoninka` | 8 | `/legal/column/kobutsusho-kyoka-eigyosho-yoken`<br>`/legal/column/nochi-tenyo-4jo-5jo-kyoka-nagare` |
| `legal-yuigon` | 6 | `/legal/column/jihitsu-kosei-yuigon`<br>`/legal/column/souzoku-yuigon-hakken-tetsuzuki` |
| `legal-inshoku-ryokan` | 6 | `/legal/column/shinya-shurui-teikyo-todokede-yoken`<br>`/legal/column/minpaku-jutaku-shukuhaku-todokede-yoken` |
| `legal-jinin-setsubi-kijun` | 6 | `/legal/column/homon-kango-station-shitei-shinsei-jinin`<br>`/legal/column/inshokuten-eigyo-kyoka-hokenjo-setsubi-kijun-shokuhin-eisei` |
| `legal-koseki-ichiranzu` | 3 | `/legal/column/souzoku-hajime-koseki-chosa-bunkyo`<br>`/legal/column/houtei-souzoku-jouhou-ichiran-zu` |
| `legal-visa` | 3 | `/legal/column/toroku-shien-kikan-touroku-shien-keikaku`<br>`/legal/column/keieikanri-zairyu-chuka-kigyousha-kaisha-setsuritsu` |
| `legal-ninni-kouken` | 2 | `/legal/column/souzoku-ninchisho-yukuefumei-miseinen`<br>`/legal/column/nini-koken-keiyaku-ikogata` |
| `legal-shitei-shinsei` | 2 | `/legal/column/houkago-day-jido-hattatsu-shitei-shinsei-nagare`<br>`/legal/column/shuro-keizoku-shien-ab-shitei-shinsei-youken` |
| `legal-souzoku-zei` | 1 | `/legal/column/souzoku-zei-shinkoku-hitsuyo` |
| `legal-iryuubun` | 1 | `/legal/column/souzoku-iryubun-kiso` |
| `legal-shogai-fukushi` | 1 | `/legal/column/seikatsu-kaigo-shitei-bukken-yoken` |
| `legal-company` | 1 | `/legal/column/iryohojin-setsuritsu-ninka-nagare-shorui` |
| `legal-kousho-ninshou` | 1 | `/legal/column/gaikoku-kankei-shomen-ninsho-apostille-koushou-tsukaiwake` |

#### labor（118記事 / 18テーマ）
| テーマ | 件 | 代表記事（確認用パス） |
|---|---:|---|
| `labor-gaikokujin-koyo` | 21 | `/labor/column/gaikokujin-koyo-madoguchi-wakekata`<br>`/labor/column/gaikokujin-koyo-jokyo-todokede` |
| `labor-koyou-hoken` | 15 | `/labor/column/shacho-rosai-tokubetsu-kanyu-hitori`<br>`/labor/column/kazoku-shain-koyohoken-yakuin-joseikin` |
| `labor-kyuyo-keisan` | 13 | `/labor/column/kyuyo-keisan-soba-sharoushi`<br>`/labor/column/freee-jinji-kaikei-ai` |
| `labor-shakai-hoken` | 13 | `/labor/column/sharoushi-komonryo-nan-no-taika`<br>`/labor/column/gaichu-koyo-sakaime-roudoushasei` |
| `labor-shugyo-kisoku` | 11 | `/labor/column/shugyokisoku-10nin-gimu-nani-ga-hitsuyo`<br>`/labor/column/ai-shugyokisoku-todokede-dekiruka` |
| `labor-roudou-jikan` | 11 | `/labor/column/36-kyotei-zangyo-sharoushi-doko-made`<br>`/labor/column/nenji-yukyu-5nichi-torikirenai` |
| `labor-roudou-jouken` | 5 | `/labor/column/zairyu-kigen-koyo-keiyaku-kikan`<br>`/labor/column/kyujin-hyo-meiji-jiko-roudou-joken` |
| `labor-shogu-kaizen` | 4 | `/labor/column/shogu-kaizen-sharoushi-gyoseishoshi-dochira`<br>`/labor/column/jido-hattatsu-houkago-day-jinin-kijun-roumu` |
| `labor-saiyo` | 4 | `/labor/column/saiyo-sharoushi-doko-made-tanomeru`<br>`/labor/column/naitei-torikeshi-dekiruka` |
| `labor-kaigo-roumu` | 4 | `/labor/column/shogai-fukushi-kaigo-jokin-kansan-keisan-jinin`<br>`/labor/column/iryo-kaigo-shukujitchoku-kyoka-kijun` |
| `labor-joseikin` | 3 | `/labor/column/joseikin-hojokin-dochira-ni-tanomu`<br>`/labor/column/joseikin-yuki-muki-keiyaku-katachi` |
| `labor-harassment` | 3 | `/labor/column/kasuhara-taisaku-2026-10-gimu`<br>`/labor/column/pawahara-boshi-sochi-chusho-kigyo-gimu` |
| `labor-taishoku-kaiko` | 3 | `/labor/column/kaiko-sharoushi-bengoshi-dochira`<br>`/labor/column/taishoku-daiko-kaisha-taio-nenkyu-kashiyohin` |
| `labor-top` | 2 | `/labor/column/ai-jugyoin-joho-nyuryoku-yoihi`<br>`/labor/column/shogaisha-koyoritsu-2.7-kakunin-jiko` |
| `labor-mental-health` | 2 | `/labor/column/stress-check-50nin-miman-2028`<br>`/labor/column/mental-fucho-kyushoku-fukushoku` |
| `labor-jinin-kijun-roumu` | 2 | `/labor/column/shuro-shien-ab-jinin-kijun-roumu`<br>`/labor/column/shuro-sentaku-shien-jinin-haichi-roumu` |
| `labor-shogai-nenkin` | 1 | `/labor/column/nenkin-jukyuchu-koyo-zaishoku-rorei` |
| `labor-gaibu-kansanin` | 1 | `/labor/column/hotei-san-choubo-seibi-hozon` |

## 6. PC・スマホで人が見るべき点

**390px / 768px / 1440px の3幅**で、上の代表3本を開いてください。

1. **タイトルと挿絵の間隔** — 詰まりすぎ・空きすぎがないか
2. **スマホで挿絵の主題が欠けていないか** — 16:9を横幅いっぱいに出しています
3. **記事内容と画像テーマの食い違い** — ここが一番の見どころです
4. **読み込み時に本文が下にずれないか**（CLS）— `width`/`height` を実寸で渡して領域を確保しています
5. **著者欄・本文・前後記事・関連記事・CTAの順序が変わっていないか**

## 7. こちらで気づいている弱い点（要判断）

直せる範囲で直しましたが、判断が分かれるものを残しています。**これらも含めて意見をください。**

| # | 事象 | 重要度の私見 |
|---|---|---|
| 1 | `/labor/column/sharoushi-komonryo-nan-no-taika`（社労士顧問料）が `labor-shakai-hoken`（社会保険）になる。「誰に頼むか」系なので `labor-joseikin`（握手）の方が近い | 中 |
| 2 | `/column/clinic-bukken-youto-chiiki-kaisetsu-todokede`（診療所物件）が `realestate-jigyou-fudosan`（オフィスビル）になる。診療所の専用画像は無い | 低〜中 |
| 3 | `realestate-jigyou-fudosan` が26件と最多。事業用物件の記事が多いため。専用画像を足せば分散する | 低 |
| 4 | 既存3点（`labor-joseikin`・`labor-shogu-kaizen`・`legal-top`）に**天秤**が描かれている。弁護士・裁判の記号で、行政書士・社労士の記事に載る。2026-09-22 に浦松の判断で当面そのまま | 中（要再判断） |
| 5 | `bunkyo-sakura` だけ実写写真（437KB）。他53点は水彩。文京区タグの記事にのみ使う設計 | 低 |
| 6 | `(realestate)/nagare/page.tsx:214` が参照していた `/hero/realestate-souzoku-16x9.webp` は**今回の34点で実体ができたため解消済み** | 解消 |
| 7 | `public/hero/` の `1x1` 派生20点＋`-sm` 1点（計1.89MB）が未参照のまま | 低 |
| 8 | `ColumnForm` に `ogImage` の入力欄が無く、記事固有画像を管理画面から設定できない（優先順位1が実質使えない） | 中（未承認事項） |
| 9 | 台湾draft 9件はトップレベルのタイトルが繁体中文で、ja正本前提の判定が効かない。現在draftのため未影響 | 低（未承認事項） |

## 8. 未検証（証拠を示せない事項）

- **390px / 768px / 1440px の実機確認は未実施。** 作業セッションの egress proxy が
  Vercel プレビューURLと luck428.com の両方をブロックしており、Claude 側から開けません。
- **本番ページの再監査は未実施。** 同じ理由です。「挿絵0枚のページを0件にする」の最終確認は、
  プレビューか本番で人が行う必要があります。
- `npx tsc --noEmit` は `api/admin/bukken/school-rentals` 等で既存エラーが出ます。
  いずれも本PRが触っていないファイルで main 由来です。

## 9. 検証済み

| 項目 | 結果 |
|---|---|
| `npx vitest run` | 105ファイル・**1544ケース通過** |
| `npx eslint`（変更ファイル） | 通過 |
| `npx tsc --noEmit` | 変更ファイルにエラーなし |
| Vercel ビルド | success |
| 4言語の一貫性 | 同一 slug で src 同一・alt のみ各言語（実HTMLで確認済み・#386 時点） |
| 全テーマの到達可能性 | `getUnreachableIllustrationThemes()` が空配列 |
| 全画像の実在 | 54点すべて `public/` 配下に存在・サイズ>0 |

## 10. 変更ファイル（#428）

- `src/lib/column-illustrations.ts` … マニフェスト54点・ルール52本・2段階一致・到達可能性チェック
- `src/lib/__tests__/column-illustrations.test.ts` … 10ケース
- `docs/columns/illustration-pool-manifest.md` … 点数・生成経路・追加手順
