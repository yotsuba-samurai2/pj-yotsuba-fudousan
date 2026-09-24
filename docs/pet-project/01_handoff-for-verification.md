# Phase 1 設計の一次検証依頼（別セッション用）

`00_phase1-report.md` の事実記述と設計を、**このセッションとは別のセッション**で検証するための資料。指示書第20章に基づき、サブエージェントの検証では代替しない。

## 検証セッションへの開始文

```text
リポジトリ yotsuba-samurai2/pj-yotsuba-fudousan の docs/pet-project/00_phase1-report.md を読み、
下の「検証項目」を現物（main の最新コミット）で1つずつ確認してください。
コード・DB・公開サイトは変更しないでください（読取のみ）。
各項目について「一致／不一致（正しい内容と file:line）／確認不能（理由）」を表で返してください。
設計（第3.2・4.2・6.2・7章）については、指示書 00_pet_ecosystem_master_revised_2026-09-24.md の
第4〜8・12章の要件を満たさない点、学区の既存挙動を壊す点を指摘してください。
```

## 検証項目（事実）

| # | 主張 | 確認方法 |
|---|---|---|
| F1 | `school_rental_feeds` の主キーは `provider` 単独で、scope を含まない | `prisma/schema.prisma` の `SchoolRentalFeed` |
| F2 | scope は `z.literal("bunkyo-rent-175000-area-48")` の検査だけ | `src/lib/school-rental-feed.ts:32` |
| F3 | 175,000円・48㎡・学区確定は `rejectionReason` で判定 | 同 `:94-95` |
| F4 | 号室が無いと `unitKey` は null、`sameUnit` は false（両方残る） | 同 `:59-86` |
| F5 | 週次更新の自動ジョブは存在しない | `vercel.json`、`.github/workflows/*` |
| F6 | `/api/contact` は受付を保存せず、Resend 失敗で 500 | `src/app/api/contact/route.ts` |
| F7 | `/api/contact` に迷惑投稿対策が無い | 同上、`src/proxy.ts` |
| F8 | `business`・`category` はクライアントの値をそのまま使う | 同 `:67-92` |
| F9 | 学区の空表示は4言語とも「紹介できる物件はない」趣旨 | `src/lib/rental-school-district.ts:40,51,62,73` |
| F10 | 「平均2倍以上」の表示が ja・zh-tw・zh にある | `src/components/gakku/RentalComparison.tsx:21,33,39` |
| F11 | 行政書士の Organization 型は `LegalService`（`ProfessionalService` ではない） | `src/lib/seo.ts:460` 付近 |
| F12 | ja 専用固定ページは `/en/...` でも 200 で日本語本文を返す | `src/app/[locale]/(realestate)/group-home/ooya/page.tsx`、`[locale]/layout.tsx`。可能なら `next dev` で `curl -I` |
| F13 | GA4 に Consent Mode が無い／UTM を保存していない | `src/components/GoogleAnalytics.tsx`、`grep -ri utm src` |
| F14 | `/pet-housing`・`/legal/services/pet-travel`・検疫系の記事が存在しない | `find src -ipath '*pet*'`、`grep -rl 検疫 scripts src` |

## 検証項目（設計）

| # | 論点 |
|---|---|
| S1 | 案A（新テーブル・学区据え置き）で T01〜T03 を構造的に満たせるか。`RentalSurveyCurrent` の楽観ロックで、同じ scope の同時確定を検知できるか |
| S2 | `RentalSurveyBatch` の状態遷移（fetching→verified→superseded）で、不完全バッチが確定を置換しないことを保証できるか |
| S3 | 集計の入口に置く許諾フィルターと機能フラグの二重化で、フラグの誤設定時にも非許諾データが出ないか |
| S4 | `inquiries` テーブル案（D-1 案1）の冪等キー・通知失敗の記録で T19・T20 を満たせるか。PII テーブルとして RLS・閲覧権限・保存期間の論点に漏れがないか |
| S5 | 同意の既定値「希望しない」と、同意なし時の送信遮断で T22 を満たせるか |
| S6 | 新LPを非 ja で `notFound()` にする方針が、既存の ja 専用ページの扱い・言語切替・sitemap テストと矛盾しないか |
