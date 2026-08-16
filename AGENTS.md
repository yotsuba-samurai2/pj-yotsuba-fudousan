<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# 社労士コラム 半自動ワークフロー（オーケストレーション層）

本節は、社労士コラムの「企画〜実装」を半自動で回すための **Codex 用オーケストレーション層** です。
既存の `CLAUDE.md`・`shigyo-compliance-gate`・`luck428-column-seo`・`yotsuba-sharoushi-kaigyo`・
`yotsuba-ledger-gate`・`yotsuba-model-routing` を**置き換えず・緩和せず**、これらを確実に実行するために置きます。

## 0. 優先順位（衝突したら上を優先）

1. `shigyo-compliance-gate`（士業コンプライアンス。AI判断禁止／分離受任／法令引用）＝最優先
2. `luck428-column-seo`（記事の型・カニバリ防止・内部リンク・多言語表記）
3. `yotsuba-sharoushi-kaigyo`（開業順序・禁止語・事務所名表記）
4. `yotsuba-ledger-gate`（Notion・台帳に触れる場合のみ）
5. `yotsuba-model-routing`（モデル・effort・顧客データ投入可否）
6. `CLAUDE.md`（本リポジトリの運用ルール・原稿形式・検証コマンド）
7. 本ファイル（上記を確実に回すための手順固定）

> 本ファイルは上記ルールの「上位互換」ではありません。あくまで実行手順の固定です。

## 1. 編集境界 COLUMN_BRIEF.md

repo 直下の `COLUMN_BRIEF.md` が人間と Codex の編集境界です。

- `STATUS: NEW` … 企画未着手
- `STATUS: WAITING_FOR_USER` … 企画候補を提示済み・人間の選定待ち
- `STATUS: APPROVED` … 人間が企画番号とメモを記入済み・実行可
- `STATUS: COMPLETED` … 完了

`SELECTED_PLAN:` は企画番号、`USER_MEMO:` は人間の編集意図（自由記述）です。
**`SELECTED_PLAN` と `USER_MEMO` は人間だけが書きます。** Codex は `STATUS` と実行ログのみ書き換えます。

## 2. フェーズ判定

毎ターン冒頭で `COLUMN_BRIEF.md` の `STATUS` を確認します。

- `NEW` または `WAITING_FOR_USER` → **フェーズ1（企画モード）**。本文を書かない。
- `APPROVED` かつ `SELECTED_PLAN` に番号あり → **フェーズ2（本番モード）**。ユーザー確認を挟まず完成まで進む。

**「企画選定以外では原則ユーザー確認を行わない」** を厳守します。
曖昧な点は `CLAUDE.md`・既存記事・コンプライアンス規程・既存実装から合理的に判断して進めます。

## 3. フェーズ1（企画モード）

以下を調査し、`COLUMN_BRIEF.md` に企画候補 **5〜10本** を書き、`STATUS: WAITING_FOR_USER` にして停止します。

- `scripts/labor-columns/` の既存コラム全件（slug・タイトル・カテゴリ・キーワード・内部リンク）
- 社労士サービスページ（`src/app/(labor)/labor/services/`）・既存 FAQ・既存カテゴリ
- 既存記事とのカニバリ／弱いテーマ／サービスへの自然な導線／時事性／検索需要

各候補に最低限：企画番号／仮タイトル／想定読者／検索意図／primary keyword／secondary keywords／
記事を書く理由／既存記事との差別化／関連する既存記事／関連サービス／想定内部リンク／
法改正・最新情報確認の必要性／SEO期待度★／AIO・LLMO期待度★／問い合わせ寄与★。

必要なら Web 検索で、厚生労働省・日本年金機構・e-Gov・都道府県労働局・ハローワークの一次情報を優先します。

**この段階では記事本文・翻訳・seed は書きません。**

## 4. フェーズ2（本番モード）実行順序

`USER_MEMO` を最優先し、以下を原則ノンストップで実行します。

1. 調査（一次情報優先）
2. 日本語本文執筆（`scripts/labor-columns/NN-slug.md`）
3. ファクトチェック（§6）
4. SEO / AIO / LLMO 最適化（§8）
5. 内部リンク（§9）
6. FAQ（4問）
7. 多言語版生成（§10）
8. seed 登録（`scripts/seed-labor-columns.ts` の ARTICLES）
9. dry-run 検証（§11）
10. emit-ts（§11）
11. lint / typecheck / test / build（§12）
12. エラー修正（自分が原因のもののみ）
13. git diff 確認

## 5. 絶対に自動実行しない（ハード禁止）

`git commit` / `git push` / PR作成 / merge / 本番 deploy / 本番DBへの `--write` は、
**ユーザーの明示指示があるまで実行しません**。

以下も禁止：`git reset --hard` / `git clean -fd` / force push / rebase による既存作業破壊 / 他人の変更の削除。
開始時は必ず `git status` を確認し、既存の未コミット変更を破壊しません。

## 6. 法令・制度のファクトチェック

優先順位：1. e-Gov 2. 厚生労働省 3. 日本年金機構 4. 都道府県労働局 5. ハローワーク 6. その他公的機関。
2026年時点で変更可能性のある内容は必ず現在の一次情報を確認します。
法令上明確な事項と実務上の一般的提案を区別し、断定できない事項は判断留保を入れます。
**架空の制度・助成金・判例・通達・統計・URL を生成しません。** 裏取りできないものは「未検証」と明記します（`shigyo-compliance-gate` 第4条）。

## 7. 日本語原稿の形式（CLAUDE.md §5 を厳守）

- H1 は入れない。冒頭は「**結論（先に要点）**：」から始める
- H2 は原則疑問文（「この記事の根拠」「よくある質問」を除く）
- FAQ は4問。「この記事の根拠」を末尾に入れる
- 判断留保（「個別の判断は資格者が行います」等）と正しい著者リンク（`/about/uramatsu`）を入れる
- 既存記事の文体に合わせる。AI 特有の冗長表現・「徹底解説します」「いかがでしたでしょうか」等の定型文は使わない
- 記事番号は `scripts/labor-columns/` の既存最大番号＋1。slug は既存と重複させない
- 受任主体（社会保険労務士／行政書士／宅建／不動産）を混同しない

## 8. SEO / AIO / LLMO（luck428-column-seo 優先）

検索エンジン向けだけにせず、冒頭で結論／明確な定義／具体的条件／比較／数値／FAQ／一次資料／実務例／
関連制度／内部リンクで、Google 検索と AI 検索の双方から参照しやすくします。
キーワードの不自然な詰め込みは禁止。カニバリを避けるため、既存記事との役割分担を崩しません。

## 9. 内部リンク

新記事から既存記事へのリンクに加え、関連性が非常に高い場合は既存記事から新記事への逆リンクも検討します。
ただし既存記事は大幅に書き換えず、変更は最小限にします。

## 10. 多言語

`scripts/labor-columns/{en,zh-tw,zh}/` に、単純な逐語訳でなく自然な専門文書として生成します。
URL・内部リンク・frontmatter は既存 locale ルールを厳守します（内部リンクはロケール前置、
事務所名は各言語でも日本語表記、簡体字の条項号は「项」等）。

## 11. seed と検証

- `scripts/seed-labor-columns.ts` の ARTICLES に登録
- `npm run column:check`（＝ `npx tsx scripts/seed-labor-columns.ts`）で dry-run → **「OK: 全チェック通過」** まで自分が原因のエラーを修正
- `npm run column:emit`（＝ `npx tsx scripts/seed-labor-columns.ts --emit-ts`）で `src/lib/data/labor-columns-seed.ts` を生成（忘れると管理画面に並ばない）
- `verify()` は人間チェックの代替ではなく「最低限通過すべき機械的ゲート」として扱う

## 12. テスト

`npm run lint` / `npx tsc --noEmit` / `npm test`（vitest）/ `npm run build` を実行します。
今回の変更が原因のエラーは自律修正。既存の無関係なエラーは勝手に広範囲修正せず最終報告に記載します。

## 13. 補助コマンド

`npm run column:check`（dry-run 検証）と `npm run column:emit`（seed TS 生成）を package.json に追加済み。
企画（フェーズ1）は AI の調査・提案工程のため CLI にはせず、ユーザーの「企画開始コマンド」で起動します。
