# luck428.com（pj-yotsuba-fudousan）

- **Framework**: Next.js 16 (App Router) + TypeScript
- **CSS**: Tailwind CSS v4 + shadcn/ui (New York)
- **ORM**: Prisma (PostgreSQL)
- **BaaS**: Supabase (Auth + DB)
- **Validation**: Zod
- **Package Manager**: npm
- **Hosting**: Firebase App Hosting（`apphosting.yaml`）

---

# ★このリポジトリの運用ルール【2026-08-14 統一】

## 1. 作業場所は `~/pj-yotsuba-fudousan` だけ

**`~/Documents/…/四葉基幹CRM/pj-yotsuba-fudousan` は使わない。** 2026-08-14に統一した。理由は2つとも実測で確認している。

| 問題 | 原因 |
|---|---|
| `next build` が `TurbopackInternalError: char boundary` で落ちる | パスに**日本語**（`四葉基幹CRM`）が含まれる。Turbopackがマルチバイト境界でpanicする |
| 「◯◯ 2.md」という重複ファイルが繰り返し生まれる | `~/Documents` が**同期対象**。書き込みと同期が競合して複製ができる |

`~/pj-yotsuba-fudousan` は**同期対象外・ASCIIパス**なので、どちらも起きない。**同じリポジトリのクローンを2つ持たない。**

## 2. 環境変数は `.env.local`

`.env.example` をコピーして値を入れる。`.gitignore` の `.env*` に該当するためコミットされない。

```bash
cp .env.example .env.local   # 値は Supabase のダッシュボードから
```

**これが無いと動かないもの**：`npx tsx scripts/seed-*.ts --write`（DB投入）／`npm run dev`／`npx next build`（`/column/[slug]` のデータ取得で落ちる）。

## 3. 着手前に必ずやること

```bash
cd ~/pj-yotsuba-fudousan && git pull --ff-only origin main
```

**企画書・TODOに書かれた「未着手」を信じない。** 2026-08-14、企画書が「未着手」としていた作業が、実際には別セッションで完了・本番反映済みだった（`/legal/services/ikuseishuro-gaibu-kansa` の参考様式2-5号追記）。**着手直前に `git log -- <該当ファイル>` とファイル実体を見る。**

同じ理由で、**スキルのキャッシュも信じない**。セッション開始時に配布された SKILL.md は同日中に更新されていることがある。

## 4. `/labor`（社労士サイト）の扱い

`SR_LAUNCHED=false` の間は `(labor)/layout.tsx` が `notFound()` を返す。**本番404・sitemap未収載**。

- 既存確認は**サイトマップではなくリポジトリ**で行う（`scripts/labor-columns/`、`scripts/seed-labor-columns.ts` の ARTICLES）
- 表示確認は `NEXT_PUBLIC_SR_LAUNCHED=true npm run dev`
- **検証は `SR_LAUNCHED` の両状態で行う**（`yotsuba-sharoushi-kaigyo` 第4条）

## 5. コラムを追加する手順

1. 原稿 `scripts/labor-columns/NN-slug.md` を書く（H1なし・「**結論（先に要点）**：」開始・H2は疑問文・FAQ4問・「この記事の根拠」・末尾に判断留保と著者リンク）
2. 翻訳 `scripts/labor-columns/{en,zh-tw,zh}/NN-slug.md`（フロントマター付き・内部リンクにロケール前置）
3. `scripts/seed-labor-columns.ts` の ARTICLES に登録
4. `npx tsx scripts/seed-labor-columns.ts` → **「OK: 全チェック通過」を確認**
5. `npx tsx scripts/seed-labor-columns.ts --emit-ts` → **忘れると管理画面に並ばない**
6. PRを出す（マージは指示を受けてから）
7. マージ・デプロイ後に DB 投入（`--write` か `/admin/columns/seed-labor`）

**バリデータに引っかかったら、まずバリデータ側を疑う。** 2026-08-14、社労士法第27条の条文（「社会保険労務士**又は社会保険労務士法人**でない者は」）の訳出が誤検知でNGになった。**記事を歪めて検査を通さない。**

## 5-2. 不動産コラムを追加する手順（追記型・2026-08-22〜）

不動産コラム（`/column`・business=`realestate`）は **`scripts/seed-realestate-columns-daily.ts` の ARTICLES に追記する**。
**枝番スクリプト（`-p7`・`-p8` …）と専用の管理画面ページを新規に作らない。** 枝番方式は1本あたり seed 約294行＋管理画面 約121行＝**約415行の新規作成**が必要で、毎日2本なら1か月で `-p66` まで増える。追記型では**1本あたり約17行**で済む。

1. 原稿 `scripts/realestate-columns/NN-slug.md` を書く（H1なし・「**結論（先に要点）**：」開始・H2は疑問文・FAQ4問以上・「## この記事の出典（一次情報）」節・末尾に「一般的な情報提供」の判断留保・分離受任の明示・紹介料の扱い）
2. 翻訳する言語だけ `scripts/realestate-columns/{en,zh-tw,zh}/NN-slug.md`（フロントマターに title / excerpt / category。**内部リンクは絶対URL**。相対パスはNG）
3. `scripts/seed-realestate-columns-daily.ts` の ARTICLES に1エントリ追記（**`publishedAt` と `category` は記事ごとに持つ**。バッチ共通の定数にしない）
4. `npx tsx scripts/seed-realestate-columns-daily.ts` → **「OK: 全チェック通過」を確認**
5. `npx tsx scripts/seed-realestate-columns-daily.ts --emit-ts` → **忘れると管理画面に並ばない**
6. PRを出す（マージは指示を受けてから）
7. マージ・デプロイ後に `/admin/columns/seed-realestate-daily` から投入（`--write` は用意していない・拒否される）

**既存記事をこのスクリプトへ移管しない。** `scripts/gh-columns/06-youto-henko.md` は2つのスクリプトから同一slugを生成しており、片方だけ再emitすると本文が巻き戻る。既存の枝番スクリプトと生成物（`realestate-columns{,-p2〜-p6}-seed.ts`）は触らない。ARTICLES に入れるのは**このスクリプトで新規に足した記事だけ**。

内部リンク先の許可リスト（`EXISTING_COLUMN_SLUGS`）は**手で維持しない**。`src/lib/data/` の realestate 系シード生成物から実行時に集めている（`/column` は business=`realestate` 専用ルート＝社労士は `/labor/column`、行政書士は `/legal/column` なので business で絞る）。**記事を1本足すときにこのリストを触る必要はない。**

## 6. 出す前の検証

```bash
npx tsc --noEmit -p tsconfig.json      # 本PRのファイルにエラーが無いこと
npx eslint <変更ファイル>               # error 0
npx vitest run                          # 231件（2026-08-14時点）
npx tsx scripts/seed-labor-columns.ts   # OK: 全チェック通過
```

**既存のエラーと自分が出したエラーを混ぜない。** `@prisma/client`・`@supabase/supabase-js` 由来の型エラーは `.env.local` と `prisma generate` の有無による既存事象。

## 7. PR運用

squash マージ。コミット件名は `type(scope): 要約 (#PR番号)`。**マージと本番反映は浦松の指示を受けてから。**

## 8. 開業日（2026-09-01）にやること

`NEXT_PUBLIC_SR_LAUNCHED=true` → 再デプロイ → 152URL（38本×4言語）が一斉公開。**その後**にGSCのインデックス登録（1日10〜12件・13〜15日／`luck428-column-seo` 第10条）。**公開前にリクエストすると404のURLを出して枠を捨てる。**

## 9. 併用する規程

`shigyo-compliance-gate`（最優先）／`luck428-column-seo`（カニバリ防止・記事の型）／`yotsuba-sharoushi-kaigyo`（開業の順序）／`yotsuba-ledger-gate`／`yotsuba-model-routing`。

---

## コア原則

- **シンプルさ最優先**: 変更は可能な限りシンプルに。影響範囲は最小限にする
- **怠らない**: 根本原因を見つける。一時しのぎの修正はしない。シニア開発者基準で考える
- **最小インパクト**: 必要な部分だけを変更する。バグを新たに生まない

## ワークフロー・オーケストレーション

### 1. プランモードをデフォルトにする

- 些細でないタスク（3ステップ以上、またはアーキテクチャ上の判断を含むもの）は必ずプランモードに入る
- 何かがうまくいかなくなったら、無理に進めず即座に停止して再計画する
- プランモードは実装だけでなく、検証工程にも使う
- 曖昧さを減らすため、最初に詳細な仕様を書く

### 2. サブエージェント戦略

- メインのコンテキストをクリーンに保つため、サブエージェントを積極的に使う
- 調査・探索・並列分析はサブエージェントに任せる
- 複雑な問題には、サブエージェントを使って計算資源を多く投入する
- 1サブエージェントにつき1タスクで、集中実行する

### 3. 自己改善ループ

- ユーザーから何らかの修正を受けたら、必ず `tasks/lessons.md` にそのパターンを記録する
- 同じミスを防ぐためのルールを自分用に書く
- ミスの発生率が下がるまで、これらの学びを徹底的に改善し続ける
- セッション開始時に、関連プロジェクトの学びを見直す

### 4. 完了前の検証

- 動作を証明するまでは、決してタスクを完了扱いにしない
- 必要に応じて、メインと変更後の挙動を比較（差分確認）する
- 「スタッフエンジニアがこれを承認するか？」と自問する
- テスト実行、ログ確認、正しさの実証を行う

### 5. エレガンスを求める（バランス重視）

- 些細でない変更では、「もっとエレガントな方法はないか？」と一度立ち止まる
- 修正がハック的に感じるなら、「今知っていることを踏まえ、最もエレガントな解決策を実装する」
- 単純で明白な修正には適用しない（過剰設計しない）
- 提出前に、自分の成果物を厳しく見直す

### 6. 自律的なバグ修正

- バグ報告を受けたら、説明を求めずすぐ修正する
- ログ・エラー・失敗テストを特定し、それを解決する
- ユーザーにコンテキスト切り替えを求めない
- 指示されなくても、失敗しているCIテストを修正する

## タスク管理

1. まず計画: `tasks/todo.md` にチェック可能な項目として計画を書く
2. 計画の確認: 実装開始前に確認する
3. 進捗管理: 進行に合わせて項目を完了済みにする
4. 変更の説明: 各ステップでハイレベルな要約を行う
5. 結果の記録: `tasks/todo.md` にレビューセクションを追加する
6. 学びの蓄積: 修正後は `tasks/lessons.md` を更新する

## 開発ワークフロー

Spec.md（`docs/spec-template.md` 準拠）を起点に以下のフローで実装する:

1. **ヒアリング**: requirements-consultant で全不明点を解消（AskUserQuestion で4問以上/回）
2. **実装計画**: EnterPlanMode で計画作成 → ユーザー承認
3. **TDD**: RED → GREEN → REFACTOR（ONE test → ONE implementation）
4. **検証**: `npx turbo typecheck` + `npm test` 通過 → サマリー報告

## コンテキスト管理

- ライブラリ API を書く前に Context7 MCP で最新ドキュメントを確認
- タスク完了ごとに `/compact`、無関係タスク間は `/clear`
- 調査はサブエージェントに委任（メインコンテキストを守る）

## コンパクション時の保持事項

- 変更済みファイルの完全なリスト
- テストコマンドとその結果
- 現在の実装計画のステータス
- 発見したバグや問題点
