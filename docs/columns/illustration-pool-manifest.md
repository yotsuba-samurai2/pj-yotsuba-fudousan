# コラム挿絵プール実装マニフェスト

原画PNGはリポジトリ外で保管し、配信物は `public/hero/` の 1600×900 WebP とする。

## 収録点数

| 事業 | 点数 | フォールバック |
|---|---:|---|
| realestate | 17 | `realestate-toushi` |
| legal | 18 | `legal-top` |
| labor | 18 | `labor-top` |
| 共通（実写） | 1（`bunkyo-sakura`） | — |
| **合計** | **54** | |

指示書の完成条件「最低48点・各事業15点以上」を満たす。
`bunkyo-sakura` だけは実写写真（437KB）で、文京区タグの記事にのみ使う。
他53点は淡い水彩のシリーズで、いずれも1600×900・120KB以下。

## 生成と変換

- 2026-09-23 納品の新規34点は浦松が **GPT Image 2.5** で生成した原画を sharp で 1600×900 WebP 化したもの。
  プロンプトは `illustration-prompts.md`。
- 既存20点は `c9c3749` の記録どおり **GPT Image 2** 生成＋sharp 加工。
- 変換時の確認事項：16:9、文字・数字・ロゴ・透かし・法廷・木槌・官公署紋章なし。
  圧縮・リサイズ・WebP化は配信物に対してのみ行い、原画PNGは加工しない。
- 既存3点（`labor-joseikin` / `labor-shogu-kaizen` / `legal-top`）には天秤が描かれている。
  弁護士・裁判の記号だが、2026-09-22 に浦松の判断で当面そのまま使う。

## 実装の構造

`src/lib/column-illustrations.ts` の1か所で決まる。3事業のテンプレートに個別の分岐は書かない。

1. `ILLUSTRATIONS` … 54点の `src` と4言語 alt。**リゾルバが参照する唯一の定義**
2. `THEME_RULES` … 事業ごとの振り分け。**先頭から見て最初に一致したルールが勝つ**ため、
   狭いテーマを広いテーマより前に置く（例：「空き家」は「相続」より前）
3. `DEFAULT_THEME` … どのルールにも一致しなかったときの受け皿

判定は `getLocalizedColumn` 前の **ja 正本**で行う。`col` は category・tags が翻訳版に
差し替わるため、`col` で判定すると4言語で別々の画像になる。

## 2026-09-24 の是正

34点を追加した際、画像が `ILLUSTRATIONS` とは別の未参照の配列に登録され、
`THEME_RULES` も更新されていなかった。画像・alt・ファイルは揃っているのに
**1点も表示されない**状態だった。

| | 是正前 | 是正後 |
|---|---:|---:|
| 実際に使われる画像 | 15点 | **41点** |
| 1画像あたりの最大割当 | 67件 | **28件** |
| フォールバック適用 | 17件（6.3%） | **2件（0.7%）** |

（実データ269件での実測。`REALESTATE_COLUMNS_DAILY_SEED` ＋
`SOUZOKU_LEGAL_COLUMNS_SEED` ＋ `LABOR_COLUMNS_SEED`）

社労士の既定を `labor-jinin-kijun-roumu`（シフト表＝人員基準の専用画像）から
汎用の `labor-top` へ変更した。一致しなかった記事にシフト表が付いていたため。

**同じ事故を防ぐため `getUnreachableIllustrationThemes()` を追加し、
どのルールからも到達できないテーマが1つでもあればテストが落ちるようにした。**
ファイルの存在確認だけでは「登録したのに表示されない」は検出できない。

## 画像を追加するとき

1. `public/hero/{business}-{theme}-16x9.webp` を置く
2. `ILLUSTRATIONS` に `src` と4言語 alt を追加する
3. **`THEME_RULES` にルールを追加する**（狭いテーマほど前に置く）
4. `npx vitest run src/lib/__tests__/column-illustrations.test.ts` で到達可能性と実在を確認
