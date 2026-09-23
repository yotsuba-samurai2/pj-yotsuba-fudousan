# 内部リンク（Step 3・第7章）。すべて相対パス。

## 7-1 既存ページ → 大家募集ページ（リンク行の追加のみ）

| リンク元 | 置き場所 | アンカー文 | 実装 |
|---|---|---|---|
| `/toushi/group-home` | §3「賃貸契約の注意点」の `</ul>` 直後 | 物件をお持ちの方（貸したい大家さん）はこちら | ja 分岐内＝ja のみ |
| `/group-home` | `COPY.ja.internalLinks`「あわせてご覧いただきたいページ」 | グループホーム向けに物件を貸したい大家さんへ（募集条件と相談の流れ） | description：「戸建て・空き家・アパートを共同生活援助の事業者に貸したい所有者向け。募集条件・契約前の論点・相談の流れと専用フォーム。」 |
| `/souzoku/akiya` | §5「グループホーム等への転用という選択肢」の既存リンク直後 | 空き家をグループホーム向けに貸す（大家募集ページ） | `locale === "ja" &&` |
| `/legal/services/shogai-fukushi` | 「物件：…四葉不動産株式会社が扱います」の直後 | 物件をお持ちの方（大家）の相談窓口はこちら | `COPY.ja.sec2Body` 内 |
| フッター | 「相続・グループホーム開設」の `/group-home` の隣 | グループホーム向け物件を貸したい方へ | `locales: ["ja"]` |
| `/wakeari` | 未公開のため対象外 | — | 姉妹文書側で追加 |

## 7-2 既存コラム → 大家募集ページ（対応表コンポーネント）

`src/lib/column-consult-windows.ts` の `COLUMN_CONSULT_WINDOWS` に行を持ち、`src/components/column/RelatedConsultWindows.tsx` が「この記事に関係する相談窓口」として描画する。ja のみ・対応表に slug があるときだけ。DB の本文は触らない。

| slug | テンプレート |
|---|---|
| `kodate-akiya-group-home-ni-kasu` | `/column/` |
| `group-home-owner-shodaku` | `/column/` |
| `kensazumisho-nashi-bukken-fukushi-youto-henko` | `/column/` |
| `group-home-shobo-setsubi-sprinkler` | `/legal/column/` |
| `group-home-kenchikukijunho-youto-henko` | `/legal/column/` |
| `group-home-kinrin-setsumei` | `/legal/column/` |
| `group-home-keiyakumae-jizen-kyogi` | `/legal/column/` |
| `group-home-shitei-kijun-bukken-menseki` | `/legal/column/` |
| `group-home-bukken-sagashikata-youto-chiiki` | `/legal/column/` |
| `group-home-kodate-apart-satellite-chigai` | `/legal/column/` |

窓口の文言（10 本共通）：

- 見出し：この記事に関係する相談窓口
- リンク：**グループホーム向けに物件を貸したい大家さんへ**（`/group-home/ooya`）— 戸建て・空き家・アパートを貸す側の相談窓口。募集条件・契約前の論点・相談の流れと専用フォーム（四葉不動産株式会社）
- `/legal/column/` の 7 本には、事業者向けの窓口も並べる：**グループホームに使える物件の探し方**（`/toushi/group-home`）— 開設する事業者向けの物件探し（四葉不動産株式会社）
- 注記：四葉不動産株式会社・四葉行政書士事務所は、それぞれ独立した事業体として受任し、別々にご契約いただきます。当社は紹介料を受け取りません。

## 7-3 大家募集ページ → 既存ページ（深掘り先）

| 論点 | リンク先 | 置き場所 |
|---|---|---|
| 貸す仕組み・3 大不安・契約書で決める 5 点 | `/column/kodate-akiya-group-home-ni-kasu` | 比較表の直後・FAQ1・7・8 |
| 事業者が承諾を得るまでの準備 | `/column/group-home-owner-shodaku` | 比較表の直後 |
| 消防設備 | `/legal/column/group-home-shobo-setsubi-sprinkler` | FAQ4 |
| 用途変更 | `/legal/column/group-home-kenchikukijunho-youto-henko` | FAQ5 |
| 検査済証が無い建物 | `/column/kensazumisho-nashi-bukken-fukushi-youto-henko` | FAQ3 |
| 近隣説明 | `/legal/column/group-home-kinrin-setsumei` | FAQ6 |
| 契約前の事前協議（区・消防・建築） | `/legal/column/group-home-keiyakumae-jizen-kyogi` | 流れ（4 段階目） |
| 3 つの型（戸建て・アパート・サテライト） | `/legal/column/group-home-kodate-apart-satellite-chigai` | FAQ2 |
| 指定申請（行政手続） | `/legal/services/shogai-fukushi` | 役割表 |
| 開設の全体像／事業者向け物件探し | `/group-home`／`/toushi/group-home` | 関連リンク |
| 空き家の出口（貸す・売る・持つ） | `/souzoku/akiya` | FAQ9・関連リンク |
| お客様の声 | `/voices#realestate-2`・`/voices#realestate-6` | 信頼性ブロック |
| 会社概要・代表 | `/about`・`/about/uramatsu` | 信頼性ブロック・文責 |
| 問い合わせ（フォーム以外） | `/contact?intent=gh-owner` | 関連リンク・FAQ10 |
| 料金 | `/ryokin` | FAQ10 |
