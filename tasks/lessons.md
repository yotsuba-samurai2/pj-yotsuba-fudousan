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
