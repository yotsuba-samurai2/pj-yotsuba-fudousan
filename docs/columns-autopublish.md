# コラムの正午の自動公開と、Search Console の自動確認（2026-10-08〜）

毎朝の「読む → 3つの管理画面から投入する → GSCで1本ずつリクエストする」を、
**「読む（止めたいときだけ保留を押す）」と「本当に必要なURLだけをGSCでリクエストする」** に減らす仕組み。

- ワークフロー：`.github/workflows/columns-autopublish.yml`（毎日 12:00 JST ＝ `0 3 * * *` UTC）
- 自動公開API：`POST /api/cron/columns-autopublish`（`src/lib/columns-autopublish.ts`）
- 保留の画面：https://luck428.com/admin/columns/autopublish
- Search Console：`scripts/gsc-autopilot.ts`（判定は `src/lib/gsc/autopilot-core.ts`）
- 結果の置き場：`automation/columns-status` ブランチ（`summary.md`・`status.json`・`last-publish.json`）

---

## 1. 1日の流れ

```
21:00頃  Daily Columns が6本を書き、ゲートを通ったものを main へ（従来どおり）
 7:00    納品タスクが「四葉コラム YYYY-MM-DD」ドキュメントを届ける（従来どおり）
         → 浦松さんが読む。止めたい記事だけ、保留の画面で「保留」を押す
12:00台  Columns Autopublish が、まだDBに無い記事を公開する（保留した記事は出ない）
         → 公開した記事が200を返すかを確かめる
         → Search Console にサイトマップを送り直し、直近のコラムの登録状況を確かめる
         → 結果を automation/columns-status ブランチに保存。失敗したら Issue
翌7:00   納品タスクが status.json を読み、公開から3日以上たっても未登録のURLだけを渡す
```

## 2. 保留のしくみ

- **自動公開の対象は「3つの追記型seed（不動産daily・行政書士・社労士）にあって、DBにまだ無い記事」だけ。**
  DBにある記事（公開・下書き・削除）には一切触れない。手で非公開にした記事が翌日の正午に戻ることはない
- **保留＝その記事を下書き（status=draft）としてDBに入れること。** DBに入るので自動公開の対象から外れ、
  下書きなので公開ページにも出ない。保留した記事は、コラム一覧の「下書き」から編集もできる
- 保留を解く操作は「公開する」だけ。保留中の記事を公開するときは**本文を seed で上書きしない**
  （管理画面で手直ししていても、その内容のまま公開する）
- 1回に公開する本数が24本を超えたら、公開せずに止めて Issue を立てる（DBの取り違えなどで大量公開しないため）。
  確かめたうえで、保留の画面の「今すぐ公開」か、ワークフローの手動実行（force）で出す
- 注意：**従来の投入画面（seed-…）から投入すると、範囲に入った保留中の記事も公開される**（「最新日のみ」でも、保留したのが最新日の記事なら公開される）。
  毎日の運用では従来の投入画面は使わない。過去記事を直して入れ直すときだけ使い、その前に保留の画面で保留中の記事が無いかを確かめる

## 3. Search Console でできること・できないこと

| やること | 自動か | 根拠 |
|---|---|---|
| サイトマップの送り直し | 自動（毎日） | Search Console API `sitemaps.submit` |
| 直近45日の日本語コラムの登録状況の確認 | 自動（毎日・最大150件） | URL検査API `urlInspection.index.inspect`（上限 1サイト1日2,000件・1分600件） |
| Bing への通知（IndexNow） | 自動（従来どおり・公開時） | `src/lib/column-publication-cache.ts` |
| **インデックス登録のリクエスト** | **手作業のまま** | Googleは一般の記事向けにこのAPIを出していない |

- **Indexing API は使わない。** 求人（JobPosting）とライブ配信（BroadcastEvent）のページ専用で、
  記事に使うと Google にアクセスを取り消されることがある（2026-10-08 公式ドキュメントで確認）
- **GSCの画面をブラウザ操作で自動で押すこともしない。** Googleの画面を機械で操作することになり規約上グレーで、
  1日に送れる本数の上限も変わらない
- 手で送るのは、**公開から3日以上たっても登録されていない（URL検査の verdict が PASS でない）URLだけ。**
  朝の納品タスクが `status.json` から拾い、GSC送信記録（Googleドキュメントの台帳）と突き合わせて渡す

## 4. 初期設定（浦松さんの作業・最初に1回だけ）

### 4-1. 自動公開の合言葉

1. Mac のターミナルで `openssl rand -hex 32` を実行し、出た64文字をコピーする（**チャットに貼らない**）
2. Vercel：プロジェクト → Settings → Environment Variables に
   `COLUMNS_AUTOPUBLISH_SECRET` を追加（Environment は **Production**）→ 本番を再デプロイ
3. GitHub：リポジトリ → Settings → Secrets and variables → Actions → New repository secret に
   同じ値で `COLUMNS_AUTOPUBLISH_SECRET` を追加

2と3の値が違うと、正午の実行が 401 で失敗して Issue が立つ。

3を忘れる（または GitHub の **Variables** タブ・**Environment secrets** に入れる）と、ワークフローから合言葉が読めない。
このときも正午の実行は赤になり Issue が立つ（2026-10-09 までは警告だけで緑のまま終わり、公開もされず、気づけなかった）。

### 4-2. Search Console の鍵

1. Google Cloud Console でプロジェクトを選ぶ（なければ作る）→ 「APIとサービス」→ **Google Search Console API** を有効にする
2. 「IAMと管理」→ サービスアカウント → 作成（名前は例：`luck428-gsc`。ロールは付けなくてよい）
3. 作ったサービスアカウント → 鍵 → 鍵を追加 → JSON。ダウンロードされたJSONファイルの**中身全体**を
   GitHub の Secrets に `GSC_SERVICE_ACCOUNT_JSON` として登録する（ファイルはその後削除してよい）
4. Search Console → 設定 → ユーザーと権限 → ユーザーを追加 → サービスアカウントのメールアドレス
   （`…@….iam.gserviceaccount.com`）を、権限 **「フル」** で追加する（「制限付き」ではサイトマップを送れない）
5. GitHub：Settings → Secrets and variables → Actions → **Variables** タブ → `GSC_SITE_URL` を追加
   - ドメインプロパティなら `sc-domain:luck428.com`（未設定のときの既定値）
   - URLプレフィックスのプロパティなら `https://luck428.com/`（末尾の `/` が要る）

### 4-3. 動作確認

GitHub → Actions → **Columns Autopublish** → Run workflow で `dry_run` に✓を付けて実行する。
実行結果の Summary に、公開予定の記事と Search Console の状況が出れば完了。
`dry_run` では公開せず、Search Console への接続・サイトマップ送信・URL検査も行わない。
本番サイトマップの読み取りと結果ブランチへの保存は行う。Summaryには公開予定のタイトルとURLを出す。

## 5. 困ったとき

| 症状 | 原因と対処 |
|---|---|
| Issue「…確認が失敗」で、1. 自動公開が「COLUMNS_AUTOPUBLISH_SECRET が未設定」 | GitHub の Secrets タブの Repository secrets に登録されていない（4-1 の3）。Variables タブ・Environment secrets では読まれない |
| Issue「…確認が失敗」で、1. 自動公開が 401 | 合言葉が Vercel と GitHub で違う、または Vercel を再デプロイしていない |
| 1. 自動公開が 409 | 公開待ちが24本を超えた。保留の画面で対象を確かめ「今すぐ公開」 |
| 2. 200確認が失敗 | 公開ページの再生成の失敗。コラム一覧からその記事を開いて保存し直す |
| 4. Search Console が失敗 | 鍵・`GSC_SITE_URL`・Search Console 側の権限（フル）を確かめる |
| 正午を過ぎても公開されない | Actions の実行履歴を見る。GitHub の予約実行は遅れることがある（2026-10-09 の初回は約7時間遅れた）。待てないときは保留の画面の「今すぐ公開」。ただし公開待ちを**全部**出すので、まだ読んでいない日の記事があれば先に「保留」する |

直したら Actions から手動実行する。公開済みの記事は対象から外れるので、何度実行しても二重には公開されない。

HTTP 500などの部分失敗を再試行した場合、各試行で公開した記事をまとめて200確認する。
DB更新後のページ再生成に失敗した場合は、再試行して成功に見せずに停止する。
公開済みの記事は次のAPI呼び出しで対象から外れるため、再生成の修復は上表の手順で別に行う。
