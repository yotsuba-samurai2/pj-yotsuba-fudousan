# /souzoku 実装ガイド（下準備・2026-07-07 Sonnet 5作成）

`/souzoku`（相続不動産ピラー）の本文実装をFable 5が進めるための土台。このガイドは**本文の中身を含まない**。既存パターンの要約・スケルトンの現状・引き継ぎTODOのみ。

## 1. ページの作り方（既存パターン要約）

`src/app/(realestate)/` 配下は「`page.tsx` = metadata専任」「`XxxPageContent.tsx` = 本文」の分担。

- **`page.tsx`**: `buildPageMetadata()`（`@/lib/seo`）でmetadataを生成し、対応する `XxxPageContent` を返すだけ。ロジックを持たない。
  - 例: `services/page.tsx` — `businessKey: "realestate"`, `title`, `description`, `path`, `keywords` を渡すだけ。
  - `column/[slug]/page.tsx` は動的ルートの例。`generateStaticParams` + `generateMetadata`（非同期・Firestoreからカラム取得）のパターン。
- **`XxxPageContent.tsx`**: 本文実装。代表例3つ:
  - `HomePageContent.tsx` — Hero（ロゴ＋見出し＋CTA2つ）→ 強み3カラム→ サービス概要カード→ 代表メッセージ→ アクセス→ CTA、の縦積みセクション構成。`"use client"` + `useTranslation()`。
  - `ServicesPageContent.tsx` — Hero → `tArray()` で取得したセクション配列を `.map()` して交互レイアウト（画像左右反転）→ CTA。JSON-LD（FAQ/Service/Breadcrumb）をコンポーネント先頭で並べて配置。
  - `column/[slug]/ColumnDetailContent.tsx`（呼び出し元は`page.tsx`側でJSON-LD組立） — 記事詳細。JSON-LDはpage.tsx側でまとめて呼び出し、Content側はJSON-LDを持たない構成（Home/Servicesとは逆）。**新規ページではpage.tsx側かContent側かどちらかに統一し、混在させない**。
- 共通スタイルクラス: `bg-green-gradient`（Heroの背景）, `cta-gradient-text` / `cta-gradient-outline`（強調テキスト・ボタン）, `gradient-line`（CTAボタン背景・区切り線）, `gradient-border`（カード枠）, `text-text-muted` / `bg-surface-dim`（サブテキスト・帯背景）。新規セクションはこれらを流用すれば既存デザインと統一できる。
- 内部リンクは `LocaleLink`（`@/components/ui/LocaleLink`。`import { LocaleLink as Link } from "..."` のエイリアスが慣例）を使う。`next/link` の素の `Link` は使わない（ロケールプレフィックスが付かない）。

## 2. JSON-LDの使い方

`src/components/seo/` に型ごとのコンポーネントが分かれている。呼び出し側（page.tsxまたはContent.tsx）でJSXとして並べるだけで `<script type="application/ld+json">` が出力される（共通基盤は `JsonLd.tsx`）。

- **`BreadcrumbJsonLd`**: `{ businessKey, items: {name, href}[] }`。JSON-LD出力に加えて**見た目のパンくずUIも同時に描画する**（他のJSON-LDコンポーネントと違いUIを持つ）。ページ内で1回だけ呼ぶ。
- **`FAQJsonLd`**: `{ items: {question, answer}[] }`。`items.length === 0` の場合は何も描画しない（＝空配列を渡しておけばプレースホルダ時にエラーにならない）。
- **`BlogPostingJsonLd`**: コラム記事（`Column`型）専用。`Article` の具体型として使われている。**静的ページ（/souzokuのような一覧性ピラーページ）用の型は既存になかったため、今回`ArticleJsonLd.tsx`を新規追加した**（`src/components/seo/ArticleJsonLd.tsx`）。`Column`型に依存せず `{ businessKey, title, description, path }` を受け取る軽量版。
- **`ServiceJsonLd`**: サービス紹介用（`Service`型）。souzokuでは今回未使用（3出口カードは本文/内部リンクのみで、Serviceとしての構造化は本文実装時にFableが要否判断）。

`canonicalUrl(businessKey, path)`（`@/lib/seo`）でJSON-LD内のURLを生成する。手書きでURLを組み立てない。

## 3. i18n・翻訳の仕組み

- **4言語**: `ja`（既定・プレフィックスなし）, `en`, `zh-tw`（繁体字）, `zh`（**簡体字。`zh-cn`ではない**）。定義は `src/config/languages.ts`。
- **ルーティング方式**: パスプレフィックス方式だが、**フォルダを言語ごとに分けていない**（`src/app/[locale]/...` のような構成ではない）。`src/middleware.ts` が `/en/souzoku` → 内部的に `/souzoku` にリライトしつつ `locale=en` をCookie（`yotsuba-locale`）とヘッダー（`x-locale`）に載せる。つまり **1つの `page.tsx`／`Content.tsx` が4言語すべてを担う**。新規ページ追加時にロケール別のファイル複製は不要。
- **表示言語の切り替え**: クライアント側は `LanguageContext`（Cookie／URLから初期値を判定）→ `useTranslation()`（`t()` / `tArray()` / `tObject()`）が `TranslationContext` の辞書を参照。辞書の実体は **別Firebaseプロジェクト（`pj-yotsuba-corporate`）のFirestore `translations/{locale}` ドキュメント**から取得（`src/lib/getTranslationData.ts`、`src/lib/firestore/translations.ts`）。
- **`buildPageMetadata()`**: `alternates.languages` に `ja` / `en` / `zh-Hant`（→zh-twにマップ） / `zh-Hans`（→zhにマップ） / `x-default` のhreflangを自動生成する。**pathを渡すだけでよい**（`/souzoku` → 4パターンのURLを自動生成）。
- **今回のスケルトンでの判断（要人間承認）**: `/souzoku` のプレースホルダ本文は `useTranslation()` を使わず**プレーンな日本語プレースホルダを直書き**した。理由: (1) Firestoreの`translations`ドキュメントに新規キーを追加する作業がスコープ外（「DB呼び出しを追加しない」ガードレールに抵触しうる）、(2) 本文が未確定のプレースホルダ段階で翻訳キーを確定させると後で変更コストが増える。**Fableが本文を確定させる際に、翻訳対応が必要か（`realestate.souzokuPage.*` キーをFirestoreに追加するか）を判断してほしい**。多言語対応が必須なら、既存ページ同様 `"use client"` + `useTranslation()` に切り替える。

## 4. `/souzoku` スケルトンの現状

追加したファイル（すべてadd-only・新規）:

- `src/app/(realestate)/souzoku/page.tsx` — metadata雛形（`title`/`description`はドラフト、`path: "/souzoku"`）
- `src/app/(realestate)/souzoku/SouzokuPageContent.tsx` — セクション枠のみ。中身はすべて `{/* TODO(Fable): ... */}` プレースホルダ
- `src/components/seo/ArticleJsonLd.tsx` — 新規追加（上記2.参照）

セクション構成（枠のみ、上から順）:

1. パンくず（`BreadcrumbJsonLd`: ホーム→相続）
2. Hero／結論ブロック（H1＋一言結論のプレースホルダ）
3. H2疑問文FAQ（`FAQJsonLd` 配線済み・items は空配列のプレースホルダ）
4. 3つの出口カード（管理・活用・売却。タイトルのみ確定、説明文はプレースホルダ）
5. 内部リンク束（`/services` `/about` `/column` `/contact` への実リンク。これは既存ページなのでプレースホルダではなく実リンク）
6. 根拠欄（法令・出典プレースホルダ。**空欄のまま。裏取りできない事項は「未検証」と明記する運用**を本文執筆時も継続すること）
7. 代表者カード（`/uramatsu.png` は既存アセットを流用。氏名・肩書は実データ、紹介文はプレースホルダ）
8. CTA（既存CTA文言パターンを流用。実文言）
9. `ArticleJsonLd` + `FAQJsonLd`（items空）をページ下部で配線

Firestore等のDB呼び出しは追加していない（静的コンポーネントのみ）。

## 5. 多言語ルーティングの確認結果

**サンドボックス環境の制約により `npm run dev` を起動できなかった**（詳細は6章）。そのため代替検証を実施:

- `src/middleware.ts` のmatcher・ロケール検出ロジックを読解。`/souzoku`・`/en/souzoku`・`/zh-tw/souzoku`・`/zh/souzoku` はいずれも既存のジェネリックな正規表現（`NON_DEFAULT_LOCALES` 判定＋テナントprefix判定）にヒットする経路であり、**パス名のハードコードが必要な箇所はない**ことをコード上で確認済み。既存の `/services` 等と同じ扱いになる。
- `buildPageMetadata({ businessKey: "realestate", path: "/souzoku", ... })` を `tsx` で直接実行し、`alternates.languages` の出力を確認（未検証＝実ブラウザでの確認ではなく関数呼び出しでの検証、の意味で明記）:
  ```
  ja: https://luck428.com/souzoku
  en: https://luck428.com/en/souzoku
  zh-Hant: https://luck428.com/zh-tw/souzoku
  zh-Hans: https://luck428.com/zh/souzoku
  x-default: https://luck428.com/souzoku
  ```
  期待通りの生成を確認。
- **未検証（人間が確認要）**: 実際にブラウザ／`curl`で `/souzoku` `/en/souzoku` `/zh-tw/souzoku` `/zh/souzoku` にアクセスし、200が返ること・`<link rel="alternate" hreflang="...">` がHTMLに実際に出力されること。ローカル環境かVercel Previewで `npm run dev` または実デプロイ後に確認してほしい。

## 6. 既知の制約（人間TODO・重要）

**このサンドボックス環境では `next build` / `next dev` がSWCネイティブバイナリの読み込み時に Bus error（core dumped）でクラッシュする**。これは今回のsouzoku変更とは無関係の環境依存の問題であることを確認済み（変更前のまっさらな状態でも同じ場所（`node_modules/@next/swc-linux-arm64-*/*.node` の `require()` 単体）で再現）。原因はサンドボックスのARM64コンテナとNext.js 16のSWCネイティブアドオンの相性（サンドボックス側のsyscall制限等）の可能性が高いが、**未検証**。

代替として実施した検証:

- `npx tsc --noEmit`: **成功**（エラー0件。新規追加ファイルによる型エラーなし）
- `next build` / `next dev`: **サンドボックスでは実行不可**（上記Bus error）。**人間がローカルまたはVercel Previewで実行して確認する必要がある**。

**人間TODO**:
1. ローカル環境（またはVercelのPreviewデプロイ）で `npm run build` が通ることを確認する
2. `npm run dev` で `/souzoku` 系4言語URLの実表示・hreflangを確認する（5章参照）
3. Vercelの環境変数（Preview環境）が今回の変更で新規に必要になるものはない（Firestore呼び出しを追加していないため）ことの再確認
4. **`git commit` が未実行**（下記参照）。ローカルのターミナルで `git add` / `git commit` を実行してほしい

### git commit が未完了（重要）

作業ブランチ `feat/souzoku-pillar` の作成・ファイル追加（`git add` 相当の状態）までは完了しているが、**このセッションのサンドボックスからは `git commit` が実行できなかった**。原因は `.git/index.lock` が `Operation not permitted` で削除できないこと（クラウド同期マウント越しの権限制約と見られる。未検証）。

作業ツリーには以下がadd-only・未コミットの状態で存在する:
- `docs/souzoku-impl-guide.md`
- `src/app/(realestate)/souzoku/page.tsx`
- `src/app/(realestate)/souzoku/SouzokuPageContent.tsx`
- `src/components/seo/ArticleJsonLd.tsx`

ローカルのターミナル（Mac側）で以下を実行してコミットしてほしい:
```
cd pj-yotsuba-fudousan
git status   # feat/souzoku-pillar ブランチ・上記4ファイルがuntrackedのはず
rm -f .git/index.lock   # もし残っていれば
git add docs/souzoku-impl-guide.md "src/app/(realestate)/souzoku/" src/components/seo/ArticleJsonLd.tsx
git commit -m "feat(souzoku): add skeleton for /souzoku pillar page"
```
（mainへのpushは不要。ブランチのpushはVercel Previewを見たい場合のみ、任意で。)

## 7. Fableへの引き継ぎポイント（本文実装で判断してほしいこと）

- `SouzokuPageContent.tsx` 内の全 `{/* TODO(Fable): ... */}` を実文章に置き換える
- 翻訳対応の要否判断（3章参照）。対応する場合は `useTranslation()` へ切り替え＋Firestore `translations` への新規キー追加（四葉本人の承認を得た上で）
- FAQの質問文（H2疑問文形式）・回答文の作成、`FAQJsonLd` へのitems投入
- 3出口カード（管理・活用・売却）の説明文（各カードから遷移する詳細ページが将来必要か、それとも本ページ内アンカーで完結させるかの構成判断も含む）
- 根拠欄：条文番号＋項・号、施行日・最終改正日を併記（四葉士業コンプライアンス規程準拠）。裏取り不能な事項は「未検証」と明記
- `ArticleJsonLd` のdescription/image等の最終値
- 「提携する専門家」表現の徹底（相続手続き・登記・税務については特定士業・事務所名を出さず一般化する。四葉行政書士事務所・浦松個人の実務範囲を超える記述をしない）
- 既存トップページの `title`/`H1` は変更していない（変更不可のガードレール順守を確認済み）
