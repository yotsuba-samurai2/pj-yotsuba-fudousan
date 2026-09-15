# 2026-09-14 日次コラムの復旧・レビュー記録

対象は [Issue #350](https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/issues/350) で停止した6本・4言語（24原稿）。元の生成コミットは `83113ac839532354adc8d43ad7c9087ce52bb150`、復旧の基点は main `489fd2c6244ff9da3433acea082d9cceb8b697d8`。

## 停止状態と修正

[実行 #29](https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/34767133840) は、全体の表示が success でも、レビューは `pass=false`、修正ジョブは skipped、自動マージは no だった。実行終了は2026-09-14 02:15頃（日本時間）。調査時点で対象24URLは404、前回分24URLは200だった。

`fix.if` に状態関数がなく、暗黙の `success()` が適用されていた。レビューの祖先には、スキップされた検証修復ジョブ、または修復済みの検証失敗が存在するため、レビュー不合格でも修正ジョブがスキップされる条件になっていた。

`!cancelled() && needs.review.result == 'success' && needs.review.outputs.pass == 'false'` に変更した。判定不明、レビュー失敗、レビューのスキップ、キャンセルでは修正しない。レビュー不合格を「判定が取れない」と一律表示していたIssue件名・本文も、レビューと修正の結果を確認できる表現に改めた。

根拠：[GitHub Actionsの状態チェック関数](https://docs.github.com/en/actions/reference/workflows-and-actions/expressions#status-check-functions)、[依存ジョブの実行条件](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-jobs#defining-prerequisite-jobs)。実際のActionsでの次回実行は未確認。

## 原稿への対応

| 対象 | 対応 |
|---|---|
| 行政書士63・英語 | 対抗要件の改正施行日を2019-07-01に統一し、2023-04-01の別改正との混同を修正 |
| 社労士100・4言語 | 発効済24か国（2026-06-02現在）を厚労省PDFで確認し、直接の出典リンクを追加 |
| 不動産56・4言語 | 令和8年法律第45号の2026-06-24を施行日としていた注記を、公布日と附則第1条による施行日の区別に修正 |
| 行政書士62・日本語 | 「書く前に」を「着手前に」に修正 |
| 社労士100・4言語 | 中国との協定には年金加入期間の通算規定がない点、外国人雇用状況届出の対象外（外交・公用・特別永住者）を補正。抜粋・FAQにも反映 |
| 今回の新規原稿 | 翻訳されていた事業体名を日本語の正式名称に統一。不動産・行政書士の著者肩書きをProject指示書B付則Bに統一 |

公開用seedは3分野とも正本から再生成した。既存のseedレコードに変更はなく、各分野2本の追加のみ。各記事には日本語・英語・繁体字・簡体字がそろっている。記事の日付は元バッチの2026-09-13を維持する。

### 確認した一次情報

- [厚生労働省「社会保障協定の締結状況」](https://www.mhlw.go.jp/content/12500000/shakaihoshou-gaiyou02.pdf)：PDF本文と画像で24か国・2026-06-02を確認。
- [日本年金機構「協定発効時期および対象制度」](https://www.nenkin.go.jp/service/shaho-kyotei/kunibetsu/kyoteitimesystem.html)：中国の期間通算不可、台湾が協定相手国に含まれないことを確認。
- [厚生労働省「外国人雇用状況の届出について」](https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/gaikokujin/todokede/index.html)：外交・公用・特別永住者の除外を確認。
- [e-Gov 民法XML](https://laws.e-gov.go.jp/api/1/lawdata/129AC0000000089)：第899条の2、平成30年法律第72号の附則、令和8年法律第45号の公布日と附則第1条を確認。
- [法務省・令和元年6月27日民二第68号通知](https://www.moj.go.jp/content/001378574.pdf)：公式資料の検索表示で2019-07-01を照合。ただし、この環境ではPDF本文の取得が403となったため、資格者レビュー時に本文を再確認する。

参照日：2026-09-14。本対応は元レビューの指摘と、その修正中に見つかった誤記の補正であり、6本の全記述を新たに独立レビューしたという意味ではない。

## 検証結果

| 検証 | 結果 |
|---|---|
| 3分野のseed dry-run | 全て exit 0、NG行0 |
| 3分野の `--emit-ts` | 全て exit 0 |
| ESLint | exit 0、エラー0、既存警告26 |
| TypeScript | `tsc --noEmit` 成功 |
| Vitest | 47ファイル・730テスト成功 |
| Actions条件 | `@actions/expressions` 0.3.61で7ケース成功。従来条件で不合格レビュー後にfalseとなることも再現 |
| YAML・シェル構文 | YAML読み込み成功、36個のrunブロックを `bash -n` で検査 |
| seedの差分 | 既存レコードの変更0、新規6本・全4言語を確認 |
| git diff | 空白エラーなし |
| 本番ビルド | コンパイルとビルド内TypeScriptは成功。`DATABASE_URL` 未設定により記事のページデータ収集で終了コード1 |

通常の `tsx` CLI は、この環境のIPCソケット制限で起動できなかったため、同じスクリプトを `node --import tsx scripts/<seed名>.ts` で実行した。検査ロジックは変更していない。

ビルド用の使い捨てPrisma DBも試したが、ネットワークインターフェース取得の環境制限（`uv_interface_addresses`）で起動できなかった。本番資格情報の取得・本番DB投入は行っていない。

## 公開までに残る工程

1. 資格者が原稿の変更と上記法務省通知を確認する。
2. DB接続が設定された検証環境で `NEXT_BUILD_WORKERS=2 npm run build` を完了する。
3. PRを確認してマージし、デプロイ完了を確認する。
4. 浦松が管理画面から不動産・行政書士・社労士をそれぞれ投入する。
5. 対象24URLの200、各言語の本文・canonical・sitemapを確認してからIssue #350を閉じる。

投入先：[/admin/columns/seed-realestate-daily](https://luck428.com/admin/columns/seed-realestate-daily)、[/admin/columns/seed-souzoku-legal](https://luck428.com/admin/columns/seed-souzoku-legal)、[/admin/columns/seed-labor](https://luck428.com/admin/columns/seed-labor)。

調査で見つかった9月6日生成分の1本不足は別件であり、本PRには補充分の新規企画を含めない。

[コンプライアンス自己点検] 判断留保:有／匿名化:不要／法令引用:公布日・施行日の混同を補正／再確認事項:1件（法務省通知PDF本文の再取得）。原稿全体の資格者レビューは未完了。

## Claude Code 側での照合・追加検証（2026-09-14）

引継ぎパック（`changes.patch`。SHA-256 を `SHA256SUMS.txt` と照合済み）を最新 main `489fd2c6` に適用した。パッチ基点と main は一致し、`git apply --index` 後のツリーは引継ぎ書記載の `e5e9f80a4544e3295669fa1e2e447a40b1c46dc2` と一致した。Issue #350 は未更新、対象を扱うオープンPRは無く、他セッションによる復旧は行われていなかった。

### 追加で直した点

- 英語版3か所（不動産55のFAQ、行政書士62・63の分離受任の段落）で、事業体名を日本語表記へ統一した際に文末のピリオドが落ちていた（`…四葉不動産株式会社 The preparation…`）。ピリオドを補い、不動産・行政書士の seed を再生成した。

### 検証結果（この環境）

| 検証 | 結果 |
|---|---|
| 3分野の seed dry-run | すべて exit 0・NG行0。不動産は本番 sitemap の取得が実行環境の制限で403となり、リポジトリ由来の許可リストだけ（より厳しい条件）で通過 |
| 3分野の `--emit-ts` | すべて exit 0。生成物はパッチの内容と一致（no-op）。英語3か所の補正後に不動産・行政書士を再生成 |
| ESLint | error 0、既存 warning 26（本PRのファイルに指摘なし） |
| TypeScript `tsc --noEmit` | 成功 |
| Vitest | 47ファイル・730テスト成功 |
| 本番ビルド | 使い捨てのローカル PostgreSQL 16（`prisma migrate deploy` で3マイグレーションを適用、レコードは空）に接続し、`NEXT_BUILD_WORKERS=2 NEXT_PUBLIC_SR_LAUNCHED=true npm run build` が成功。371/371ページを生成 |
| Actions 条件 | `@actions/expressions` 0.3.61 で7ケースを再現（従来条件は不合格レビュー後に false、新条件は true。判定不明・レビュー失敗・スキップ・キャンセルは false）。YAML 解析成功、`open-pr` の run ブロック2個は `bash -n` 通過 |
| `git diff --check` | 空白エラーなし |

### この環境で確認できなかったこと

- 法務省・厚生労働省・日本年金機構・e-Gov の各ドメインは実行環境のネットワーク制限で到達できず、一次資料の再確認（特に法務省・令和元年6月27日民二第68号通知の本文）は引き続き未実施。資格者レビュー時に確認する。
- Actions の実走は未確認。ローカルの式評価は本番ジョブの成功を意味しない。
- 記事を DB へ投入した状態での表示（24URL・言語・canonical・sitemap）は、マージ・デプロイ・管理画面投入後に確認する。

## 追記（2026-09-15）：ワークフロー修正は PR #356 で先行反映

- `fix` ジョブの条件修正と Issue 通知文の変更は、[PR #356](https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/pull/356)（2026-09-15 00:02 UTC マージ）が本PRの差分をそのまま先行して main に取り込んだ。あわせて、validate-ng artifact が隠しディレクトリ除外で保存されず修復ジョブが起動できなかった不具合も #356 で修正されている。
- 本ブランチに main をマージした結果、`.github/workflows/daily-columns.yml` は main と同一になり、本PRの実質的な差分は原稿24本・seed・記録のみとなった。
- #356 の記録によれば、2026-09-15 の日次実行（34877853793）は前日分と同じ記事番号（不動産55/56、行政書士62/63、社労士99/100）で原稿を生成している。その日の原稿を復旧する際は、本PRの番号と重複しないよう個別に統合する。
