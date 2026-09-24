# 四葉ペット横断プロジェクト Phase 1 調査・設計報告書

作成日：2026-09-24／対象指示書：`00_pet_ecosystem_master_revised_2026-09-24.md`（版2.0）
対象リポジトリ：`yotsuba-samurai2/pj-yotsuba-fudousan`／ブランチ：`claude/zealous-fermat-t7x0f2`（基点 `e1d692c` ＝ 2026-09-24 時点の `origin/main` と同一）

> **本書の範囲**：指示書第0章・第20章・第25章に従い、Phase 1（調査・設計・報告書作成）のみを実施した。
> アプリコード、DBスキーマ、実データ、ジョブ、公開サイトは**一切変更していない**。本番DB・会員画面・外部送信には触れていない。
> 追加したのは本書と `01_handoff-for-verification.md`（別セッション検証用）の2ファイルのみ。**Phase 2 の実施指示を待って停止する。**

---

## 0. 結論（先に要点）

1. **4サイト別リポジトリではなく、1つの Next.js アプリ**が不動産（`/`）・行政書士（`/legal`）・社労士（`/labor`）を配信している。`luck428gyosei.com` はホスト名で `/legal` を前置する書き換えで同一アプリへ入る。監査の「同一アプリ内のルートグループ」という記述が現物と一致する。統合・移転は不要で、既存基盤を再利用できる（第1章）。
2. **学区比較フィードは監査の記述どおり実在**する（4媒体・scope リテラル・175,000円／48㎡・学区確定・楽観ロック）。ただし **scope は検証用のリテラルにすぎず、保存キーは `provider` 単独**（`school_rental_feeds.provider @id`）。ペット scope をこのテーブルへ入れると学区データを上書きする。**新テーブルで scope を分離する設計を推奨**（第3章）。
3. **最大の差分は受付基盤**。`POST /api/contact` は**問い合わせをDBに保存せず、Resend のメールだけが唯一の記録**になっている。指示書第12章の「保存成功＝受付成功」「通知失敗でも受付を維持」「重複保存・重複通知の防止」「受付番号」は、**現状のままでは実現できない**。迷惑投稿対策（honeypot・レート制限）も無い。受付の保存テーブル新設は全フォームに関わる設計判断のため、**浦松の判断事項**とした（第6章・第10章 D-1）。
4. **既存学区ページに、指示書に反する既存表示が2点ある**。① 空表示「現在、この学区で**ご紹介できる**賃貸物件はありません」（4言語）は第8.2章の「断定しない」に反する。② 比較表の相談枠「この一覧の掲載件数の**平均2倍以上**の物件をご提案できます」（ja・zh-tw・zh）は、根拠のない数値表現の禁止（第13章）に抵触するおそれがある。Phase 5 で直す候補とし、②は根拠の有無を浦松に確認する（D-4）。
5. **公開統計（X/Y/Z）は既定で無効のまま設計する**。媒体ごとの集計公表・広告・画像転載の許諾は**リポジトリからは1件も確認できない**（第7章）。許諾台帳が埋まるまで、LP は「サービス説明＋相談フォーム」で成立させ、統計枠は非表示にする。
6. `/pet-housing`・`/legal/services/pet-travel` は**どちらも未存在で、カニバリの相手もいない**。検疫・狂犬病・マイクロチップの既存記事は0本。既存のペット関連は動物取扱業の2本（事業用物件／登録手続）だけで、主題が異なる（第8章）。

---

## 1. 作業場所・Git・リポジトリ構成の現物確認（第0・2章／未確認事項1）

| 項目 | 確認結果 |
|---|---|
| 作業場所 | `/home/user/pj-yotsuba-fudousan`（クラウドセッション。ASCIIパス） |
| Git 状態 | working tree clean。未コミット変更なし。`origin/main` を fetch 済みで HEAD と差分 0/0 |
| 直近の変更 | `e1d692c` #423 wakeari コラム、`dc85011` #422 GH大家フォーム、`7b7a32a` #420 `/group-home/ooya`、`5b079aa` #416 学区一覧の件数・重複照合 |
| 並行作業（オープンPR） | #424（wakeari 文言）、#419（社労士翻訳の「連携」是正）。**本件の対象ファイルとは重ならない** |
| リモート | `origin = github.com/yotsuba-samurai2/pj-yotsuba-fudousan` のみ |
| アプリ構成 | `src/app/[locale]/(realestate)`・`(legal)/legal`・`(labor)/labor` の3ルートグループ＋`admin`・`api`。事業体の定義は `src/config/group.ts:8-77` |
| ホスト | 正規は `https://luck428.com`。`luck428gyosei.com`／`legal.` サブドメインは `src/proxy.ts:45-57` で `/legal` を前置。`yotsuba-labor.com` はコメントアウト（未使用） |
| デプロイ | Vercel。`vercel.json` は `regions: ["hnd1"]`（関数を東京に固定。2026-08-24 監査 P0-1c）。CLAUDE.md の「ビルドは iad1」は**ビルド**の記述で、関数リージョンとは別。矛盾ではないが、CLAUDE.md の書き方は誤読されやすい |

**運用規程（4サイト別リポジトリ）との差異**：少なくとも不動産・行政書士・社労士は本リポジトリ内の同一アプリ。4つ目のサイト（士業ドットコム等）は本リポジトリに存在せず、本件の対象外。**monorepo 化・統合・移転は行わない。** 両LPとも本リポジトリの既存基盤（`RealestateServicePage`／`LegalServicePage`／`/api/contact`／`gaEvent`）の上に作る。

---

## 2. 再利用する既存部品

| 用途 | 既存部品（パス） | 使い方 |
|---|---|---|
| 不動産LPの外枠 | `src/components/shared/RealestateServicePage.tsx` | `answerBlock`・`ctaContactHref`・`serviceExtra`・`authorBio` を使う。**既定の authorBio には禁止語があるため必ず上書き**（lessons 09-23） |
| 行政書士LPの外枠 | `src/components/shared/LegalServicePage.tsx` | `slug` から `/legal/services/${slug}`・Service JSON-LD（provider＝`/legal/#organization`）・パンくずを自動生成 |
| 見出し・FAQ・CTA | `ReH2`、`Faq`（`withJsonLd`/`bare`/`openFirst`）、`CtaBand`/`CtaBandActions`、`CannotHandle`、`LineLink`、`TelLink`、`Breadcrumb`、`CrossLinkBanner`、`RelatedConsultWindows` | GH大家LPと同じ組み方 |
| 専用フォームの手本 | `src/components/group-home/GhOwnerForm.tsx`＋`src/lib/shared/gh-owner-intake.ts` | 項目を `message` へ畳み込み `POST /api/contact` へ送る方式。`contact_form_start`・`contact_submit`・`contact_submit_error` を送出 |
| 受付・通知 | `src/app/api/contact/route.ts`（Resend） | 第6章の改修が前提 |
| カテゴリ表示 | `src/lib/shared/contact-intake.ts`（4言語ラベル・`CATEGORY_ORDER_BY_BUSINESS`）、route の `categoryLabels` | 新カテゴリはこの2か所＋`labor-contact-order.test.ts` の固定順を更新（lessons 09-23・09-24） |
| 計測 | `src/lib/gtag.ts`（`gaEvent`・`contactIntentParam`）、`src/lib/shared/contact-cta.ts`（query/hash を除去） | 既存イベント名に `form_id`/`location`/`page` を足す方式を踏襲 |
| SEO | `buildPageMetadata`（`src/lib/seo.ts:619-726`）、`canonicalUrl`、`buildHreflang(…, availableLocales)` | ja 先行は `locale:"ja"`＋`availableLocales:["ja"]`＋sitemap の `locales:["ja"]`（`sitemap-static-locales.test.ts` が突合） |
| 住戸同一性 | `school-rental-feed.ts:59-86`（`unitKey`・`sameUnit`）、`registered-rental-identity.ts` | ペット scope でも同じ関数を使う。別系統の重複排除は作らない |
| ペット条件の既存判定 | `scripts/rental-import/reins-school-feed.ts:36-40,55`、`src/lib/rental-import/policy.ts:11,59-75,111-133` | 4状態（allowed/consult/not-allowed/unknown）のみ。**多頭・大型犬の軸は無い**ため第6.3節で拡張 |

**GH専用の本文・受付種別（`gh-owner`）・イベント値はコピーしない**（第2章）。

---

## 3. 学区比較フィードの現状と scope 分離設計（第4章）

### 3.1 現状（2026-09-24・`e1d692c`）

| 項目 | 現状 | 根拠 |
|---|---|---|
| 媒体 | `reins / itandi / eslife / atbb`。変換スクリプトは REINS のみ（保存済みページのスナップショットをオフライン変換）。ATBB は取得不完全で未保存 | `school-rental-feed.ts:4`、`docs/school-rental-comparison.md:11,84-86` |
| scope | `z.literal("bunkyo-rent-175000-area-48")` の**スキーマ検査のみ**。保存キーではない | `school-rental-feed.ts:32` |
| 条件 | 住所に「文京区」・賃料 ≥175,000・面積 ≥48㎡・学区 `determined` | `school-rental-feed.ts:94-95` |
| 保存 | `school_rental_feeds`（Prisma `SchoolRentalFeed`）。**`provider @id`＝媒体ごとに1行**、フィード全体を `payload` JSONB に格納。RLS 有効・anon/authenticated 剥奪。履歴・バッチ・削除経路なし | `prisma/schema.prisma:164-171`、migration `20260923070000` |
| 楽観ロック | `updateMany where { provider, updatedAt: expectedUpdatedAt, checkedAt ≤ 新 }` が1行でなければ 409 | `school-rental-feed-store.ts:36-47`、`api/admin/bukken/school-rentals/route.ts:41` |
| 全件確認 | `complete: z.literal(true)` と `expectedCount === records.length`（保存時必須） | `school-rental-feed.ts:35,38-43`、route `:32` |
| キャッシュ | React `cache()` のみ。ページは `force-dynamic`。タグ・revalidate なし | store `:8,26,31` |
| 週次 | `nextWeeklyReviewAt`＝checkedAt の次の水曜 12:00 JST（表示用。自動非掲載には使っていない）。**自動ジョブは存在せず、管理画面からの手動アップロード** | `school-rental-feed.ts:49-57`、`vercel.json`・`.github/workflows` にcronなし |

**指示書との差分**
- 指示書第9章「既存の毎週水曜更新等の運用とFAQを確認し、実際に稼働する頻度に表示を合わせる」：FAQ は「毎週水曜日に更新します」（`rental-school-district.ts:92` ほか3言語）だが、**実態は手動**。実際に毎週更新しているかは運用側の確認事項（U-2）。
- 第4.2章「途中取得・失敗・媒体欠落のバッチは確定データを置換しない」：現状は媒体ごとの1行置換で、**「全対象媒体の検証後に組合せを確定」という段階が無い**。

### 3.2 設計方針：学区テーブルは触らず、新テーブルで scope を分離する（推奨案A）

| 案 | 内容 | 評価 |
|---|---|---|
| **A（推奨）** | 既存 `school_rental_feeds` と既存読取経路は**そのまま**残し、旧経路を「学区 scope 専用」とコードで明示。ペット（と将来の scope）は新テーブル `rental_survey_batches`＋`rental_survey_current` に保存 | 学区の回帰リスクが最小（T01・T02 を構造で満たす）。移行は後で任意 |
| B | 既存データを新テーブルへ移行し、学区も新経路へ | 指示書の「一元化」には近いが、本番データ移行と読取互換の検証が必要。Phase 2 の範囲を超えやすい |

**案Aの新テーブル（Phase 2 で Prisma migration をローカル作成・本番適用は別承認）**

```prisma
// 1バッチ＝1 scope × 1 条件版 × 1 媒体 × 1 回の取得。追記のみ（上書きしない）
model RentalSurveyBatch {
  id              String   @id @default(cuid())      // batchId
  scopeId         String   @map("scope_id")          // 例: "bunkyo-rent-pet"
  scopeVersion    Int      @map("scope_version")     // 条件を変えたら +1（前週比の可否判定に使う）
  provider        String                             // reins / itandi / eslife / atbb
  status          String                             // fetching | failed | incomplete | verified | superseded
  observedFrom    DateTime @map("observed_from")
  observedTo      DateTime @map("observed_to")
  expectedCount   Int      @map("expected_count")
  recordCount     Int      @map("record_count")
  allPagesChecked Boolean  @map("all_pages_checked")
  dedupVersion    Int      @map("dedup_version")
  payload         Json                                // 媒体の観測行（第5章の項目）
  createdAt       DateTime @default(now()) @map("created_at")
  @@index([scopeId, scopeVersion, provider, status])
  @@map("rental_survey_batches")
}

// 確定済みの組合せ（scope × 条件版ごとに1行）。公開計算はここだけを読む
model RentalSurveyCurrent {
  scopeId      String   @map("scope_id")
  scopeVersion Int      @map("scope_version")
  batchIds     String[] @map("batch_ids")            // 全対象媒体の verified バッチ
  finalizedAt  DateTime @map("finalized_at")
  updatedAt    DateTime @updatedAt @map("updated_at") // expectedUpdatedAt の対象
  @@id([scopeId, scopeVersion])
  @@map("rental_survey_current")
}
```

- **読取・保存・確定・巻き戻し・キャッシュキーの全経路で `scopeId`＋`scopeVersion` を必須引数にする**。欠落・未知 scope は型と Zod で拒否（T02）。
- 保存は「バッチを `verified` で追記」→「全対象媒体がそろったら `RentalSurveyCurrent` を `expectedUpdatedAt` 付きで更新」の2段階。`failed`/`incomplete`/媒体欠落のままでは確定行を書き換えない（T11）。
- 巻き戻しは `RentalSurveyCurrent.batchIds` を前の組合せへ戻すだけ（バッチは消さない）。対象 scope 以外には触れない（T03）。
- 住戸同一性・正規化・許諾判定・集計は既存関数を共通モジュールへ切り出して両 scope で共有する。**学区の `compileSchoolRentalFeeds` の出力は変えない**（既存テストで回帰を確認）。
- 移行・ロールバック：新テーブル追加のみなので、ロールバックは「テーブルを使うコードを戻す」→「テーブル削除 migration」。既存データへの影響はない。

### 3.3 ペット scope の条件（案。確定は浦松・U-4）

| 項目 | 案 |
|---|---|
| scopeId / 版 | `bunkyo-rent-pet` / 1 |
| 地域・用途 | 文京区・居住用賃貸（売買・区外は**受付は可だが件数に入れない**） |
| 金額・面積 | 制限なし（学区の 175,000円・48㎡・学区確定を**流用しない**） |
| 対象 | 根拠付きで「複数飼育可」「複数飼育相談可」「大型犬可」「大型犬相談可」のいずれかを確認した住戸の和集合（第6章） |
| 募集状態 | 募集中かつ申込なし（学区の既存除外条件と同じ。緩和しない）。「申込あり」は確定対象外 |
| 媒体 | **許諾台帳（第7章）で集計利用が確認できた媒体のみ**。現時点で該当なし |
| 観測期間 | 1回の取得ごとに observedFrom/To を保持 |
| 件数単位 | 1住戸 |

---

## 4. 住戸同一性・ペット条件の分類（第5・6章）

### 4.1 既存の重複排除で足りる点と足りない点

| 指示書の要件 | 現状 | 対応 |
|---|---|---|
| 同一住戸の複数媒体＝1住戸 | `unitKey = addressKey|buildingKey|unitNumber` | 再利用 |
| 賃料変更で別物件にしない | 賃料は同一性キーに含まれていない | 維持（T05） |
| 号室不足は推定しない | `unitKey` が `null` → `sameUnit` は常に false で**別住戸として両方残る** | **要修正**。ペット scope では `identity: "unresolved"` とし、確定件数 X から除外して管理画面の確認待ちへ（T06） |
| 媒体間の条件矛盾を記録 | 先勝ち（checkedAt 新しい順）で1件採用し、条件は突き合わせない | ペット scope では観測行を全部保持し、ペット条件・募集・賃料が食い違えば `conflict` として確定対象から外す |
| 媒体ごとの根拠・許諾 | `advertisingQuote`・`applicationQuote` はあるが許諾範囲は無い | 観測行に `permissionRefs`（第7章の台帳ID）を追加 |

### 4.2 ペット条件の型（案）

```ts
type Evidence = { provider: Provider; sourceId: string; quote: string; checkedAt: string };
type Axis<S> = { state: S; evidence: Evidence[] };

type PetTerms = {
  multi: Axis<"allowed" | "consult" | "unconfirmed-count" | "single-only" | "not-allowed">;
  species: Axis<"cat" | "dog" | "cat-and-dog" | "other-or-unconfirmed">;
  limits: { cats?: number; dogs?: number; total?: number; evidence: Evidence[] };
  largeDog: Axis<"allowed" | "consult" | "not-allowed" | "unconfirmed">;
  extra: { landlordApproval?: boolean; bylaws?: string; deposit?: string; checkedAt: string };
};
```

- 「ペット相談」だけでは `multi = "unconfirmed-count"`（複数飼育相談可にしない）。猫2頭可を猫3頭可に含めない。大型犬1頭可を複数飼育可に含めない（T07）。
- 確定対象＝`multi ∈ {allowed, consult}` または `largeDog ∈ {allowed, consult}`。内訳は重複し得るので、総数は和集合の件数だけを使う。
- 分類器は REINS の備考文から**候補**を作るだけで、確定は管理画面での確認を経る（AI・正規表現で「可」を確定しない）。

---

## 5. 件数の定義（第8章）と既存表示の差分

### 5.1 算出

```text
S   = 同一 scope・条件版・確定バッチ組合せ・評価時点で、重複解消済み、募集中・申込なし、
      ペット条件（または学区条件）を根拠付きで満たし、集計公表の許諾がある住戸
V_l = 言語 l で実際に公開一覧・詳細に出ている住戸
X = |S|、Y_l = |S ∩ V_l|、Z_l = |S \ V_l|（X = Y_l + Z_l）
広告不可 = S のうち、広告不可が確認済み（全媒体で一致）の住戸だけ
```

- 集計は純関数 `computeSurveyCounts(S, V_l)` として実装し、公開用の集計結果（数値・条件文・期間・状態）だけを画面部品へ渡す。画面は原本を受け取らない。
- 状態は `not-fetched | failed | incomplete | permission-unconfirmed | finalized` を区別し、`finalized` 以外では数値枠を出さない（0件と未取得を混同しない。T11）。

### 5.2 既存コードとの差分

| 指示書 | 現状 | 判定 |
|---|---|---|
| `excluded.length` を広告不可件数にしない | 管理画面で「除外 N件」として使うだけ。公開ページには出ない | **適合**。除外理由（10種）は混在したまま。広告不可の内訳を出すなら理由別に数える |
| 既存一覧件数 `|V_l|` を X に置き換えない | 学区ページの件数は「自社物件＋比較フィード行」 | 維持する。調査集計は**別枠**で追加 |
| ItemList は画面の一覧と一致 | `numberOfItems: items.length`（`property-jsonld.ts:139`）＝画面と一致 | **適合**。調査総数 X を ItemList に入れない |
| 空表示で「紹介できない」と断定しない | ja「現在、この学区で**ご紹介できる**賃貸物件はありません」ほか en/zh-tw/zh も同趣旨（`rental-school-district.ts:40,51,62,73`） | **不適合**。Phase 5 で4言語同時に「現在、当サイトで詳細掲載中の物件はありません」へ |
| 根拠のない数値表現をしない | 相談枠「この一覧の掲載件数の**平均2倍以上**の物件をご提案できます」（`RentalComparison.tsx:21,33,39`。ja・zh-tw・zh） | **要確認（D-4）**。社内実績の根拠資料が無ければ削除または言い換え |

---

## 6. 受付フォーム・通知の現状と設計（第12章）

### 6.1 現状

| 要件（第12章） | 現状 | 根拠 |
|---|---|---|
| 保存成功で受付成功 | **保存先なし**。Resend で事務所宛にメールを送れたら `{ok:true}` | `api/contact/route.ts:293-324`、Prisma に受付モデルなし |
| 通知失敗でも受付を維持 | 事務所宛メールの失敗で 500＝**問い合わせが消える**。自動返信の失敗でも 500＝利用者が再送して**重複通知** | 同上（2通を同じ try で順に await） |
| 重複保存・重複通知の防止 | 送信ボタンの `disabled` だけ。冪等キーなし | `ContactForm.tsx`、`GhOwnerForm.tsx` |
| 受付番号 | なし | — |
| 担当の振り分けをサーバー側で決める | `business`・`category` は**クライアントの値をそのまま**使う（Zod は任意文字列） | route `:67-92,287-288` |
| 迷惑投稿対策 | honeypot・レート制限・Turnstile いずれもなし（`docs/gh-owner/20_form.md` にも明記） | `src/lib/rate-limit.ts` は admin 専用 |
| 流入ページ・言語・UTM | 送っていない。自己申告の `source` プルダウンのみ | `contact-intake.ts:177` |
| 完了計測 | クライアントで `res.ok` の後に `contact_submit`→`/thanks` | `ContactForm.tsx:133`、`GhOwnerForm.tsx:124` |
| 添付 | なし（図面は受付後に LINE・メールで） | 指示書第11章と適合 |
| 自動返信の言語 | 日本語固定 | route `:310-324` |

### 6.2 設計案（D-1 の判断が必要）

**案1（推奨）：受付テーブルを新設し、保存→通知の順にする**

```prisma
model Inquiry {
  id              String   @id @default(cuid())
  receiptNo       String   @unique @map("receipt_no")       // 例: Y260924-XXXX
  idempotencyKey  String   @unique @map("idempotency_key")  // クライアント生成UUID
  business        String   // サーバー側で category から決定（realestate / legal）
  category        String   // pet-housing-renter / pet-housing-owner / pet-travel ほか既存
  locale          String
  sourcePath      String   @map("source_path")              // クエリなし
  utm             Json?                                     // 許可キー・長さ制限済み
  payload         Json                                      // 入力内容（PII）
  consentShare    String   @map("consent_share")            // none / declined / granted:<連携先>
  notifyStatus    String   @map("notify_status")            // pending / sent / failed
  autoReplyStatus String   @map("auto_reply_status")        // skipped / sent / failed
  createdAt       DateTime @default(now()) @map("created_at")
  @@map("inquiries")
}
```

- 流れ：Zod 検証 → `idempotencyKey` で既存行があればその受付番号を返す（重複保存・重複通知なし）→ 保存（失敗なら 500。完了表示・計測なし）→ 通知・自動返信（失敗は `notify_status=failed` に記録して**受付は成功**で返す）→ 管理画面に「通知失敗の再送」一覧。
- PII を持つ新テーブルになるため、RLS 有効・anon/authenticated 剥奪（学区テーブルと同じ）、閲覧は admin 認証のみ、**保存期間と削除手順を決めてから本番適用**（U-5）。
- 既存フォーム（一般問い合わせ・GH大家・物件見学）も同じ経路に乗せるかは別判断。**本件の3フォームだけを先に新経路にし、既存フォームは現状維持**でも成立する。

**案2：保存なしのまま、通知だけ改善する**
- 事務所宛メールの成功を受付成功とし、自動返信の失敗は 200 で返す（重複を減らす）。冪等キーはメモリでしか持てないため**重複防止は不完全**。指示書第12章は満たせない。

いずれの案でも、次の3点は共通で入れる。
- `category` → `business` の対応をサーバー側の許可リストで決める。
- 本件3フォームに honeypot と IP 単位のレート制限を付ける。
- 完了計測は「サーバーが受付番号を返した後に1回だけ」にし、`/thanks` の再読み込みでは送らない。

### 6.3 3フォームの項目（第12章。既存 GH フォームと照合した最小案）

| フォーム | category / business | 必須（初回） | 任意 |
|---|---|---|---|
| 借り手 | `pet-housing-renter` / realestate | 受付名、連絡手段（メールか電話のどちらか）、賃貸／購入、希望エリア、動物種・頭数（「未定」可） | 予算、間取り、犬のサイズ、時期、学区、来日予定、渡航手続の相談希望（ニーズ確認のみ） |
| 大家 | `pet-housing-owner` / realestate | 受付名、連絡手段、物件エリア・種別、相談内容 | 詳細所在地、築年、間取り、延床、賃料、空室状況、現在のペット可否、受け入れ可能な動物（写真・図面は受付後） |
| 渡航 | `pet-travel` / legal | 受付名、連絡手段、渡航方向、出発地・到着地、犬／猫・頭数 | 渡航予定日、経由地、帰国予定、現在地、チップ・接種・抗体価の状況（「不明」可）、住宅探しの相談希望 |

- **他事業者への情報連携**：選択肢は「希望しない（既定）／四葉不動産にこの相談内容を伝えることに同意する」。同意なしなら他事業者へは送らず、LP のリンク案内だけにする（T22）。同意文は連携先・目的・項目を明示する。**文面は資格者確認の対象**（U-5）。
- 既存カテゴリ `kikoku-funin`（帰国・赴任の手続き・legal）とは分ける。渡航は `pet-travel` を新設する。

---

## 7. データ利用許諾（第7章）

**リポジトリ内で確認できた許諾の根拠はゼロ**。`advertising`（広告転載区分）は物件ごとの広告可否であって、独自集計の公表・保存・画像転載の許諾ではない。

| 媒体 | 閲覧 | 内部保存・加工 | 集計公表 | 個別広告（自社HP） | 画像・図面転載 | SNS・広告 |
|---|---|---|---|---|---|---|
| REINS | 会員として可（前提） | **未確認** | **未確認** | 物件ごと（広告転載区分） | **未確認** | **未確認** |
| ATBB | 同上 | **未確認** | **未確認**（監査で参照された資料は包括許可の証拠にしない） | 物件ごと | **未確認** | **未確認** |
| itandi | 未確認 | **未確認** | **未確認** | 物件ごと（`application` 根拠必須） | **未確認** | **未確認** |
| いい生活（eslife） | 未確認 | **未確認** | **未確認** | 物件ごと | **未確認** | **未確認** |

**設計**
- 許諾台帳 `data_use_permissions`（媒体・規約の版・確認日・対象データ・用途＝store/aggregate/ad/image/sns・書面回答の所在・期間・出典表記条件・状態＝confirmed/unconfirmed/contact-pending/expired/revoked）を追加する（Phase 2）。
- 公開計算の入口で `permission.aggregate === "confirmed"` の観測行だけを通すサーバー側フィルターをかける。機能フラグ `PET_SURVEY_STATS_ENABLED`（既定 false）はその**上に**重ねる。フラグを立てても台帳が未確認なら出ない（T12・T13）。
- 少数抑制：内訳が閾値（案：5件）未満なら、その内訳と合計との差分から復元できる内訳をまとめて非表示にする。閾値は U-4。

**帰結**：現時点では**第10章の LP 第4節（調査集計）と第6節（現在探している方）は非表示**で実装・公開することになる。本文と相談フォームだけで LP は成立する。

---

## 8. URL・既存記事・内部リンクマップ（第3・15章）

### 8.1 新規URL（確定案）

| URL | ルートファイル | 外枠 | 言語 | JSON-LD |
|---|---|---|---|---|
| `/pet-housing` | `src/app/[locale]/(realestate)/pet-housing/page.tsx` | `RealestateServicePage` | ja 先行 | Service（provider＝`https://luck428.com/#organization` の RealEstateAgent）＋BreadcrumbList |
| `/legal/services/pet-travel` | `src/app/[locale]/(legal)/legal/services/pet-travel/page.tsx` | `LegalServicePage` | ja 先行 | Service（provider＝`https://luck428.com/legal/#organization`）＋BreadcrumbList |

- **指示書との差分**：第17章は行政書士の事業者型を「ProfessionalService」としているが、現物は `LegalService`（`seo.ts:460`）。`ProfessionalService` は社労士（`/labor/#organization`）。**既存IDに接続し、型は変えない**。
- **ja 先行ページの非日本語URL**：現行の ja 専用ページ（`/group-home/ooya` 等）は `/en/...` でも 200 を返し、日本語本文を `<html lang="en">` で出している（canonical は ja）。これは第16章「未公開言語へ日本語本文を流し込まない」に反する。**新LP2本は非 ja で `notFound()` を返す**（列・物件詳細と同じ扱い）。既存の ja 専用ページの扱いは本件の範囲外として別タスクに切り出す。
- 言語切替（`getColumnSwitchLocales`）は固定ページでは4言語すべてを出すため、新LPでも切替先が 404 にならないよう、固定ページ用の許可言語の指定を足す（T18）。

### 8.2 既存記事の棚卸し（カニバリ判定）

| 既存ページ | 主題 | 新LPとの関係 |
|---|---|---|
| `/column/doubutsu-toriatsukai-bukken-youken`（4言語） | トリミング・ペットショップの**事業用物件** | 競合しない。FAQ に「ペット可マンション」の語がある。**住居探しは `/pet-housing` へ**という1文リンクを追加する候補 |
| `/legal/column/dai-isshu-doubutsu-toriatsukai-touroku-youken`（4言語） | 第一種動物取扱業の**登録** | 競合しない（登録と輸出入は別手続） |
| `/kikoku`（ja） | 海外赴任からの本帰国・住まい | **両LPへの最有力リンク元** |
| `/kaigai-owner`（ja）・`/leaving-japan`（4言語） | 海外転勤・出国 | 渡航LPへのリンク元 |
| `/global`（4言語） | 外国人の住まい探し | 住宅LPへのリンク元 |
| `/gakku/*/rentals`（4言語） | 学区の賃貸 | 住宅LPと相互リンク（比較表にはすでにペット可否の列がある） |
| `/column/chintaishaku-keiyakusho-doko-wo-yomu` | 賃貸借契約書の読み方（ペット条項に言及） | 住宅LPへのリンク元 |
| `/legal/services/visa`・`gaikokujin-shain` | 在留資格・外国人社員の受け入れ（帯同家族） | 渡航LPと相互リンク |
| `/group-home/ooya`・`/column/kodate-akiya-group-home-ni-kasu` | 大家向け（GH用途） | 用途が違うので競合は小さい。リンクしない |

**検疫・狂犬病・マイクロチップの既存記事は0本**。

### 8.3 リンクマップ（公開状態に連動）

```
/pet-housing ──「海外から犬・猫と日本へ来る方へ」──▶ /legal/services/pet-travel   （pet-travel 公開後のみ）
/legal/services/pet-travel ──「日本でペットと住める住宅もお探しですか？」──▶ /pet-housing（pet-housing 公開後のみ）
/kikoku ──▶ 両LP     /global ──▶ /pet-housing     /gakku/rentals ⇄ /pet-housing
/kaigai-owner・/leaving-japan・/legal/services/visa・gaikokujin-shain ──▶ /legal/services/pet-travel
トップ：不動産 → SERVICE_NAV_CATEGORIES（src/config/services-nav.ts）に住宅LPを追加
        行政書士 → legal/page.tsx の COPY.services と legal/services/page.tsx の SERVICES に渡航LPを追加
```

- 不動産トップ（`HomePageContent.tsx`）は3本柱（`/souzoku`・`/toushi`・`/global`）だけで、サービスカードの一覧は無い。指示書第15章の「トップのサービス一覧」は、**不動産では `/services` とメガメニュー（`SERVICE_NAV_CATEGORIES`）**が相当する。トップの3本柱には足さない案とする（D-3）。
- 片方のLPだけ公開する段階ではリンクを出さない。そのため `src/lib/cross-links.ts` の `launchFlag` と同じ仕組みで、ページごとの公開フラグ（`PET_HOUSING_PUBLISHED`・`PET_TRAVEL_PUBLISHED`）を持たせる。

---

## 9. 計測（第18章）

| 候補イベント（指示書） | 既存への統合案 | パラメータ（許可リスト） |
|---|---|---|
| `pet_housing_view` / `pet_travel_view` | **追加しない**。GA4 の `page_view`（パス）で足りる | — |
| `renter_cta_click` / `owner_cta_click` | 既存 `cta_contact_click` に `location`（`pet_housing_hero_renter` 等）と `page:"pet_housing"` | location, page |
| フォーム開始 | 既存 `contact_form_start`（`form_start` は GA4 自動収集と衝突するため使わない） | form_id |
| 受付成功 | 既存 `contact_submit`（`form_id`＝`pet_housing_renter`／`pet_housing_owner`／`pet_travel`） | form_id, intent, locale |
| `property_detail_click` | 新設（詳細掲載物件がある場合のみ） | location |
| `line_click` | 既存 `cta_line_click`（`/line` 中継）。**友だち追加・受付とは数えない** | location, page |
| 相互リンク | 新設 `cross_service_click` | from, to |

- 現状 **UTM は保存していない**。指示書第18章の「UTM を受付まで引き継ぐ」は、第6.2節の受付テーブルができてから（`utm` 列）。先に計測だけ入れる場合は `sessionStorage` に初回流入だけを保存し、内部遷移で上書きしない。
- **同意モード（Consent Mode）が無い**。「既存の保存・同意方針に従う」とあるが、既存方針そのものが未整備（U-5）。本件では UTM の保存範囲をブラウザ内の first-party に限り、PII は一切載せない。
- `page_location` は `gtag('config')` の既定でクエリ込みで送られる。本件のフォームは URL に PII を載せないので現状リスクはないが、検証（T24）では `/thanks` と各LPの URL を確認する。

---

## 10. 浦松の判断が必要な事項（Phase 2 着手前）

| ID | 論点 | 選択肢 | 推奨 |
|---|---|---|---|
| D-1 | 受付の保存先 | 案1：`inquiries` テーブル新設（本件3フォームのみ先行）／案2：保存なしで通知改善のみ | **案1**。第12章を満たす唯一の案。PII テーブルなので保存期間・閲覧権限を同時に決める |
| D-2 | 調査 scope の保存 | 案A：新テーブル・学区は据え置き／案B：学区も移行 | **案A** |
| D-3 | 不動産トップへの住宅LPの追加位置 | `/services`＋メガメニューのみ／トップ3本柱にも追加 | **前者** |
| D-4 | 学区ページ「平均2倍以上」の表示 | 根拠資料あり→出典を明記して維持／無し→削除 | 根拠を確認のうえ判断（Phase 5） |
| D-5 | Phase 2 の範囲 | 保存分離＋許諾台帳＋集計関数（統計は無効）まで／LP を先に | 指示書どおり Phase 2 から。ただし**統計が当面無効なら Phase 3（住宅LP・受付）を先行**させても効果は同じ |

## 11. 未確認事項の台帳（第23章）

| # | 区分 | 内容 | 確認者 | 影響する機能 |
|---|---|---|---|---|
| U-1 | リポジトリ | 本書で確認済み（1アプリ・3事業）。士業ドットコムは対象外 | — | — |
| U-2 | 実DB・運用 | 本番 `school_rental_feeds` の実件数・最終更新日。毎週水曜の更新が実際に行われているか | 浦松 | 学区FAQの「毎週水曜」表示 |
| U-3 | 媒体許諾 | 第7章の表の「未確認」すべて（会員規約の版・書面回答） | 浦松（媒体へ照会。**照会の送信は別承認**） | 調査集計・個別広告・画像 |
| U-4 | ペット scope | 第3.3節の条件、鮮度基準、保存期間、少数抑制の閾値、管理担当 | 浦松 | 調査集計 |
| U-5 | 受付・連携・渡航 | 受付データの保存期間と閲覧者、同意文言、同意モード方針、受付可能な地域・言語、渡航支援の手続別の代理可能範囲、国別条件、料金（未決なら「個別見積」） | 浦松（資格者確認） | フォーム・渡航LP |
| U-6 | 実装後 | 受入試験の結果、リリース対象、本番DB・マージ・デプロイの承認 | 浦松 | すべて |

## 12. 変更予定ファイル（Phase 2〜5）

| Phase | 追加 | 変更 |
|---|---|---|
| 2 | `prisma/migrations/<ts>_add_rental_survey/`、`src/lib/rental-survey/{scope,store,permissions,pet-terms,counts}.ts`、`src/lib/__tests__/rental-survey-*.test.ts`、`src/components/rental-survey/SurveyCountsPanel.tsx` | `prisma/schema.prisma`（モデル追加のみ）、`school-rental-feed.ts`（同一性関数を共通モジュールへ移すだけ・出力不変） |
| 3 | `(realestate)/pet-housing/page.tsx`、`src/components/pet/{PetRenterForm,PetOwnerForm}.tsx`、`src/lib/shared/pet-intake.ts`、`docs/pet-project/10_page.md` 等 | `api/contact/route.ts`（D-1 次第）、`contact-intake.ts`、`sitemap.ts`（ja）、`services-nav.ts`、`labor-contact-order.test.ts` の固定順 |
| 4 | `(legal)/legal/services/pet-travel/page.tsx`、`src/components/pet/PetTravelForm.tsx` | `legal/page.tsx`・`legal/services/page.tsx` のサービス一覧、`sitemap.ts` |
| 5 | — | `rental-school-district.ts`（空表示4言語・集計枠の文言）、`SchoolRentalPages.tsx`（別枠追加）、`RentalComparison.tsx`（D-4）、`/kikoku`・`/global` 等のリンク、`cross-links.ts` |

## 13. 受入テスト計画（第21章との対応）

| ID | 自動テスト（vitest） | 手動・実測 |
|---|---|---|
| T01–T03 | `rental-survey-store.test.ts`：学区行を保存したあとペット scope を保存・確定・巻き戻しし、学区の出力が完全一致すること／scope 欠落・未知 scope の拒否／古い `expectedUpdatedAt` で 409 | ローカル `prisma dev` DB で migration 適用 |
| T04 | 既存 `school-rental-feed.test.ts` を無変更で通す＋ペット scope に 175,000円条件が掛からないこと | — |
| T05–T07 | `rental-survey-identity.test.ts`、`pet-terms.test.ts`（猫2・猫3・大型犬1・「ペット相談」のみ） | — |
| T08–T11 | `rental-survey-counts.test.ts`（X=Y+Z、広告可未掲載、他言語のみ、状態の区別、不完全バッチ） | — |
| T12–T13 | `rental-survey-permissions.test.ts`（未確認・撤回・画像権利なし・少数抑制と差分復元の防止） | — |
| T14 | 募集終了の即時非掲載・前週比の比較不可判定 | — |
| T15–T16 | HTML/RSC に内部IDや原本が出ないことを `next build`＋`next start`＋`curl` で grep／ItemList と一覧の一致（既存 `gakku-itemlist.test.ts` を拡張） | 実測 |
| T17–T18 | `sitemap-static-locales.test.ts` に新LPを追加／非 ja で 404 | `curl -I /en/pet-housing` |
| T19–T22 | `contact-api-*.test.ts`：冪等キー重複・保存失敗・通知失敗（Resend モック）・同意なしで他事業者に送らない | ローカルでモック送信。**本番宛先は使わない** |
| T23 | 需要公開は無効のまま、無効状態で出力されないことを確認 | — |
| T24 | `gaEvent` の引数が許可リストのみであること | ブラウザの dataLayer を目視 |
| T25 | 渡航LPの `ReviewStatus`（資格者確認前は「確認前」表示・公開フラグ false） | — |
| T26 | テストが本番 `DATABASE_URL`・`RESEND_API_KEY` を読まないこと | — |
| T27 | `npx tsc --noEmit`、`npx eslint <変更>`、`npx vitest run`、`npx next build` | モバイル・デスクトップの表示 |

---

## 14. 実施した確認と未実施

- 実施：`git status`・`git log`・`git fetch origin main`、オープンPR一覧、ソースの静的調査（本書に file:line を付した箇所）。
- 未実施：本番DB・Supabase・会員画面・媒体サイトの閲覧（許可範囲外）、`next build`・`vitest`（コードを変更していないため）、外部送信。
- 本書は実装のための情報・論点整理であり、個別案件の法的判断、媒体契約上の許諾、国別手続の適合性は確定していない。顧客向け表示・業務範囲の最終確認は担当資格者が行う。

[コンプライアンス自己点検] 判断留保:有／匿名化:不要（顧客実データなし）／法令引用:引用なし／未検証事項:U-2〜U-6
