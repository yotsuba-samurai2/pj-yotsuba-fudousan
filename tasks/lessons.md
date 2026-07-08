# Lessons

## 2026-07-08 B-1 canonical是正

- **metadataの二重export禁止**: ページを静的 `export const metadata` から `generateMetadata()` に変換するときは、旧ブロックを必ず**丸ごと削除して置き換える**（両方が同居するとNext.jsはビルドエラー）。変換後は `grep` で全対象ファイルの共存ゼロを機械的に確認する。grepはコメントブロック内のテキストも数えるため、ヒットしたら実コードかコメントかを目視確認する。
- **代表経歴は「4カ国」が正**（浦松確定済み）。「5カ国」表記はコード内に残存があるため、descriptionや本文を触るとき見つけ次第修正する（未修正の残存: llms.txt route、admin/columns/seed、OrganizationJsonLd、seo.ts BUSINESS_SEO、UnifiedTopContent、labor/about）。
- **このリポジトリはローカルでnext buildが落ちる**: プロジェクトパスのマルチバイト文字（四葉基幹CRM）でTurbopackがpanicする既存バグ（mainでも再現）。ビルド検証はASCIIパスへ `rsync`＋`cp -Rc`（APFS clone）でコピーして行う。node_modulesのsymlinkはTurbopackが拒否するので実体コピーが必要。
- **Vercel PreviewはSSO保護でcurl不可**（302 → vercel.com/sso-api）。curl実測はローカル本番ビルド（`npm run build`→`PORT=xxxx npm start`をバックグラウンド起動）で行い、Previewはブラウザ確認用とする。
- **ロケール検出はレスポンスCookieだけでは初回アクセス（クローラー）に効かない**: middlewareで `x-locale` をリクエストヘッダーとして転送し（`NextResponse.rewrite(url, {request:{headers}})`）、Server Component側は headers() 優先・Cookieフォールバックで読む（`src/lib/getRequestLocale.ts`）。
