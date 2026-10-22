# サイト安全性調査（2026-10-22）— 浦松が行う設定作業の手順

PHP の重大脆弱性（php2shell / CVE-2026-109618・109619）を契機に、四葉不動産・行政書士・社労士（luck428.com）と士業ドットコム（www.samurai.co.jp）を調べた結果の、**コード以外**の対処手順。コード側（管理APIの許可リスト・Next.js 更新・AI相談APIのレート制限）は同日の PR で対応済み。

結論：4サイトとも Vercel＋Next.js で PHP を使っておらず、php2shell の直接の対象ではない。PHP に触れるのは **Xserver の契約**（3ドメインの DNS と luck428gyosei.com）だけ。一方で、PHP と無関係に**管理画面を第三者が使える設定**（下記1）があり、これを最初に塞ぐ。

## 1. 【今日】Supabase：新規登録を止める

状況：Supabase Auth が「メールで誰でも登録できる」設定（`disable_signup: false`）。管理API側の修正（PR）が入るまでは、登録した第三者がコラム・物件・AI設定・画像の管理APIを呼べる。

1. https://supabase.com/dashboard → プロジェクト `lxsnklqwysakhnmvdivh` → **Authentication** → **Sign In / Providers**
2. **「Allow new users to sign up」をオフ**にして Save
3. **Authentication → Users** を開き、浦松のメール以外のアカウントが無いか確認。見知らぬものがあれば **Delete user**（削除前にメールと作成日時をメモ）
4. 念のため **Project Settings → API** で `service_role` キーの漏えいが疑われる状況なら Rotate（通常は不要）

管理者を増やすときは Vercel の環境変数 `ADMIN_EMAILS`（カンマ区切り）に追加し、Supabase の Users で手動招待（Invite user）する。

## 2. 【今日〜明日】Xserver：アカウント防御と PHP の確認

状況：luck428.com・luck428gyosei.com・samurai.co.jp の **ネームサーバーはすべて Xserver**（ns1〜ns5.xserver.jp）。Xserver のアカウントが取られると Vercel が無事でも全サイトの行き先を書き換えられる。luck428gyosei.com は Xserver のサーバー sv16605 を向いていて 403 を返している（アプリは置かれていない）。Xserver は 10/22 早朝までに PHP 8.2〜8.5 の修正パッチ適用を完了したと告知（公式ページは調査時 503 のため二次情報）。

1. **Xserver アカウント**（https://secure.xserver.ne.jp/）でパスワードを長いものに変更し、**2段階認証**（ログイン時の認証コード）を有効化。サーバーパネルのログイン制限（国外IPアクセス制限）も確認
2. **サーバーパネル → ファイルマネージャ**で `luck428gyosei.com/public_html` と、旧 luck428.com（WordPress 時代）の残骸ディレクトリを確認。**使っていない PHP / WordPress ファイルは削除**（削除前に一度ダウンロードして保管）
3. **サーバーパネル → PHP Ver.切替**で、ドメインごとの PHP が **8.3.36 以上**（8.2.35 / 8.4.27 / 8.5.12 も可）か確認。8.1 以前が残っていれば切り替える
4. **WordPress 簡単インストール**の一覧に使っていないインストールが残っていれば削除
5. **サーバーパネル → ドメイン設定**：luck428gyosei.com を使うなら Vercel に接続（下記4）。使わないなら「ドメイン設定の削除」で止める（メールを使っている場合は先にメールの行き先を決める）

## 3. 【今週】メールの偽装対策（DMARC・DKIM）

状況：3ドメインとも **DMARC 未設定**。四葉・士業ドットコムの名前で偽メールを送られても受信側が弾けない。MX は luck428.com と samurai.co.jp が Google Workspace、luck428gyosei.com は Xserver 自身。

Xserver の **DNS レコード設定**（サーバーパネル）で、3ドメインに次を追加する。

| ホスト名 | 種別 | 内容 |
|---|---|---|
| `_dmarc` | TXT | `v=DMARC1; p=quarantine; rua=mailto:uramatsujoji@luck428.com; adkim=r; aspf=r` |

- Google Workspace 管理コンソール → **アプリ → Google Workspace → Gmail → メールの認証**で luck428.com と samurai.co.jp の **DKIM を生成**し、表示された `google._domainkey` の TXT を Xserver の DNS に追加して「認証を開始」
- 1〜2週間 rua の集計レポートを見て問題なければ `p=reject` に上げる
- SPF の `include:spf.sender.xserver.jp` と `+a:sv16605.xserver.jp` は **Xserver からメールを送るドメインだけ**残す（luck428.com・samurai.co.jp が Google だけなら外す）。luck428gyosei.com のメールを Xserver で受けていないなら MX も整理する

## 4. 【任意】luck428gyosei.com の扱いを決める

コード上は行政書士テナント用ドメイン（`src/proxy.ts`）として定義済みだが、DNS が Vercel を向いていないため死んでいる。

- 使う：Vercel の該当プロジェクト → **Settings → Domains** で `luck428gyosei.com` と `www` を追加し、表示される A / CNAME を Xserver の DNS に設定（ワイルドカード `*` の A レコードは削除）
- 使わない：Xserver 側でドメイン設定を削除し、DNS の `*` ワイルドカードを消す

## 5. 【任意】アカウント全般

- Vercel（dev@samurai.co.jp・Hobby）：**Settings → Authentication** で 2段階認証。可能なら Pro の「Deployment Protection」「Web Application Firewall」のルールを確認
- GitHub（yotsuba-samurai2）：2段階認証・リポジトリの Collaborators を棚卸し
- Google Workspace：全ユーザーに 2段階認証を強制

## 調査の根拠（実測）

- 配信元：`server: Vercel` / `x-powered-by: Next.js`（luck428.com・www.samurai.co.jp）。luck428gyosei.com は `server: nginx`・Xserver の 403 ページ・IP 85.131.209.146 = sv16605.xserver.jp
- DNS：Cloudflare DoH で NS / MX / TXT / `_dmarc` を取得。`_dmarc` は3ドメインとも応答なし
- Supabase：公開バンドルに含まれる公開 URL と publishable key で `GET /auth/v1/settings` を取得（`disable_signup: false`・`external.email: true`）。PostgREST の公開テーブルは 0（Prisma のテーブルは anon から読めない）。**アカウントは作っていない**
- 依存：`npm audit --omit=dev` で Next.js 16.3.5 に Critical（next/og ImageResponse の RCE・CVE-2026-94545・16.3.6 修正）。本リポジトリは next/og 未使用のため悪用不可だが 16.3.8 へ更新。sharp 0.35.4 → 0.35.5
