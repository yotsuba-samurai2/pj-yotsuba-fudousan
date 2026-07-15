# Lessons

## 2026-07-08 B-1 canonical是正

- **metadataの二重export禁止**: ページを静的 `export const metadata` から `generateMetadata()` に変換するときは、旧ブロックを必ず**丸ごと削除して置き換える**（両方が同居するとNext.jsはビルドエラー）。変換後は `grep` で全対象ファイルの共存ゼロを機械的に確認する。grepはコメントブロック内のテキストも数えるため、ヒットしたら実コードかコメントかを目視確認する。
- **代表経歴は「4カ国」が正**（浦松確定済み）。「5カ国」表記はコード内に残存があるため、descriptionや本文を触るとき見つけ次第修正する（未修正の残存: llms.txt route、admin/columns/seed、OrganizationJsonLd、seo.ts BUSINESS_SEO、UnifiedTopContent、labor/about）。
- **このリポジトリはローカルでnext buildが落ちる**: プロジェクトパスのマルチバイト文字（四葉基幹CRM）でTurbopackがpanicする既存バグ（mainでも再現）。ビルド検証はASCIIパスへ `rsync`＋`cp -Rc`（APFS clone）でコピーして行う。node_modulesのsymlinkはTurbopackが拒否するので実体コピーが必要。
- **Vercel PreviewはSSO保護でcurl不可**（302 → vercel.com/sso-api）。curl実測はローカル本番ビルド（`npm run build`→`PORT=xxxx npm start`をバックグラウンド起動）で行い、Previewはブラウザ確認用とする。
- **ロケール検出はレスポンスCookieだけでは初回アクセス（クローラー）に効かない**: middlewareで `x-locale` をリクエストヘッダーとして転送し（`NextResponse.rewrite(url, {request:{headers}})`）、Server Component側は headers() 優先・Cookieフォールバックで読む（`src/lib/getRequestLocale.ts`）。

## 2026-07-14 コラム内部リンク欠落の修正

- **貼られたタスクが「別リポジトリ／別サイト」を指していることがある**: 監査レポート（luck428.com対象）を samurai-app（samurai.co.jp）のセッションで受領した。実装前に、タスクが述べるURL・ルート（`/column`・`/souzoku`等）と開いているリポジトリの実ルート・`NEXT_PUBLIC_SITE_URL` を突き合わせ、同一物件か検証する。四葉グループは samurai.co.jp（`~/samurai-app`）と luck428.com（`~/pj-yotsuba-fudousan`）の**別リポジトリ2つ**。
- **「SSRにリンクが出ない」報告はまずライブHTMLで再現する**: `curl -s <url> | grep -o 'href="/column/[^"]*"' | wc -l`。推測せず実測してから原因（client `useEffect` 取得 vs 空クエリ vs フィルタ全落ち）を切り分ける。
- **`"use client"` でもSSRはされる＝データを props で渡せば初期HTMLにリンクが載る**: 一覧が孤児化していた真因は「client描画」ではなく「clientでデータ取得」。データ層（Firebase client SDK + React `cache()`）は isomorphic で server 実行可能なので、取得を server の page.tsx に移し props で渡すだけで直る。同型の詳細ページ（既に server fetch）が手本。
- **関連リンク節は1コンポーネントを全ページに強制しない**: full幅セクション（一覧/詳細/souzoku）と prose内カード（RealestateServicePage=toushi/global）とトップのカードで意匠が違う。各ページの既存デザイントークンに合わせて出し分ける方が「新しいスタイル体系を持ち込まない」原則に合う。
- **該当データが無いテーマは偽リンクを作らず「不足」を報告する**: souzoku（相続）に張れる ja コラムが0本＝相続コラム未執筆。`filterColumnsByTheme` は0件なら節ごと非表示にし、不足は tasks/todo.md に記録して執筆計画へ回す。

## 2026-07-14 sitemapロケール展開＋エンティティ識別子

- **検証前に古いローカルサーバを必ず殺す**: `PORT=3100 npm start` を起動しても既存プロセスがポート占有中だと新プロセスはbindできず、curlは**古いコード**を返す（sitemap修正が「27本のまま」と誤判定した）。検証前に `lsof -ti tcp:3100 | xargs kill -9` でポートを空けてから起動する。「up after 1s」は再ビルド後には速すぎ＝占有の兆候。
- **Next.jsのsitemapは配列1要素=<url>1件・<loc>=urlのみ**: `alternates.languages` は `xhtml:link hreflang` にしかならず `<loc>` にはならない。ロケール別URLを `<loc>` として出すには**ロケールごとに配列要素を分ける**。hreflang生成は既存 `canonicalUrl()` を単一情報源に再利用する（sitemap専用の別ロジックを作らない）。
- **法人番号の取り違えは致命的**: 四葉不動産は同名他社が複数（特に文京区本駒込の別法人 1010001172596）。当社は **7010001259396**（小日向）のみ。実装前後に `grep -rn '1010001172596' src public` で誤番号がコードに入っていないことを機械確認する。JSON-LDには当社番号のみ、llms.txtの「区別」節でのみ他社番号を他社として明記。
- **既存 sameAs は順序含め不変を厳守**: エンティティ強化で識別子を足すときも `REALESTATE_SAME_AS`/`LEGAL_SAME_AS`（Wikidata・cid・宅建協会・KG MID）は触らない。追加は Person 側 sameAs や新規 identifier/alternateName で行い、検証で既存値の欠落0を確認する。

## 2026-07-15 GSCインデックス改善①（トップのメタ・ロケール別化）

- **`buildPageMetadata` に固定文言を渡すとロケール横断で複製メタになる**: トップ `page.tsx` だけが title/description を日本語ハードコードしており、/en・/zh・/zh-tw が「日本語トップと同一の薄い複製」＝GSC「クロール済み・未登録」化していた（子ページは `META: Record<LangCode,…>`＋`getRequestLocale` で正しく出し分け済み）。**新規ページ／トップは必ず子ページと同じ META 方式に乗せる**。`buildPageMetadata` は locale から og:locale/twitter/canonical/hreflang を自動生成するので、直すのは title/description だけでよい（og:locale は元々 `ja_JP` 固定ではない＝`OG_LOCALES[locale]`）。
- **多言語 title は H1（本文COPY）を単一情報源に再利用する**: 社名保護（全ロケール先頭に「四葉不動産」）と新規ハードコード増加防止を両立するため、メタ title は `HomePageContent` の各ロケール H1 と同一表記にする。en/zh-tw/zh の description は本文intro準拠の監修前ドラフトとしてコメントで明示（フェーズI監修対象）。
- **メタ検証はユニークポートのdevで実測する**: `next dev -p 3111` で `/`・`/en`・`/zh`・`/zh-tw` の `<title>`・`og:locale`・`og:title` が各言語で出し分けられ、canonical・hreflang（ja/en/zh-Hant/zh-Hans/x-default）が不変であることを curl で確認してから完了扱いにする。ページの `generateMetadata` は Firestore を叩かない（inline META）ため、秘密情報なしでも title は正しく出る。
