# SEO・LLMO・AIO監査(2026-08-24)対応 — fix/seo-audit-2026-08-24

監査指示書: ~/Downloads/luck428-seo-llmo-aio-audit-2026-08-24.md

## P0 技術修正

- [x] P0-1a proxy.ts: set-cookieを「既存Cookieの値がURLとズレたときだけ」に限定(初回Cookie付与はLanguageContextのクライアントeffectへ移設＝クローラーにset-cookieが一切出ない)
- [x] P0-1b proxy.ts: 公開GETページに `s-maxage=3600, stale-while-revalidate=86400` を付与(ローカルnext startでmiddlewareヘッダーがNextのno-storeを上書きすることを実測確認)
- [x] P0-1c vercel.json: 関数リージョンをhnd1(東京)に固定(現状iad1・DBはap-northeast-1で毎クエリ太平洋往復)
- [x] P0-2 layout.tsx: 3フォントすべて `preload: false`(204件→0件・実測0)
- [x] P0-3a BlogPostingJsonLd: Blog @id/url を canonicalUrl で生成(/legal/legal/column解消・実測0件)
- [x] P0-3b BlogPostingJsonLd: image を実在画像URL(文字列)に(legalコラム実測=legal-og.png・200/image/png)
- [x] P0-3c GovernmentService 削除(LegalServicePage + shogai-fukushi/visa/company/gaikokujin-shain/ikuseishuro-gaibu-kansa・実測0件)

## P1 構造整理

- [x] P1-1 WebSite name を「四葉グループ」単一ノードに(realestate layoutのみ出力・legal/laborから削除・ColumnCollectionのisPartOfも統一)
- [x] P1-2 sitemap.ts: 固定ページのlastmod省略・コラムはdateModified/dateのみ(フォールバックnow廃止)
- [x] P1-4 legal用OG画像(1200×630)生成 → BUSINESS_SEO.legal.ogImage設定・twitter card=summary_large_image(og:imageは正規ホスト絶対URLで出力)

## 判断メモ

- robots.txt の `/_next/static/media/` ブロックは**維持**(2026-07-30浦松承認・GSC woff2問題対策。preload削減後に再評価)
- ISR/SSG全面化は今回見送り(全ページがheaders()依存＝ロケール設計の大改修が必要)。CDNキャッシュ(s-maxage)で受け入れ基準を満たす

## 検証

- [x] npm test(231件) / tsc --noEmit / npx next build 通過(prisma dev使い捨てDB＋pgbouncer=true＋seed-local-sample)
- [x] next start + curl: cache-control / set-cookie / preload件数 / schema出力 / canonical・hreflang・lang属性・410 をすべて実測確認

## レビュー

- 全ロケールの公開GETページ: `cache-control: public, s-maxage=3600, stale-while-revalidate=86400`・set-cookieなし。
  set-cookieが出るのは「既存Cookieの値とURLロケールがズレた同期時」のみ(このときはno-store維持=正しい)
- /admin・/api・/thanks等の動的ルートはno-storeのまま
- sitemap: lastmodはコラム(dateModified/date保持分)のみ。固定ページから消え、連続取得で不変
- 残タスク(監査書のうち今回未実施): §4コンテンツ・内部リンク改善(inheritance/souzoku強化・CTA整理)、§6ローカルSEO(GBP・外部NAP統一=サイト外作業)、§7翻訳品質、robots.txtのmedia解除判断(preload削減後のGSC推移を見て再評価)
- デプロイ後確認: x-vercel-cache=HIT/STALE、x-vercel-id がhnd1実行になること、GSC URL検査、Rich Results Test


## 2026-09-07 コラム一覧Egress削減
- [x] 接続ref・適用規程・AI共有メモリを確認
- [x] SQL投影・20件ページ分割・翻訳フォールバックを実装
- [x] SQL・データ量・4言語一覧/詳細/移動を検証
- [x] lint/typecheck/test/build、レビュー用差分を出力

### レビュー記録
- 接続確認: luck428-corporate / lxsnklqwysakhnmvdivh。基点 origin/main 3f7c969。
- 20件/ページ。本文・全翻訳JSONをSQLから除外。補助インデックスは100件/SQLで全候補を維持。
- 369テスト・型チェック・本番build成功。lint error 0（既存warning 38）。
- 本番読取SQLで先頭一覧のJSON換算値2.95〜5.31MB→13.1〜22.0KB。課金Egressの実測ではない。
- ローカルPostgresで3事業×4言語、ページ境界・公開条件・翻訳欠損・詳細・SEOを検証。
- 実機ブラウザのページ移動・言語切替確認。SR_LAUNCHED=falseの8ルート404確認。
- 本番接続のローカル資格情報は認証拒否。本番SQLは認証済みSupabaseコネクタ、ビルド/表示はローカルfixture DBで検証。
- commit/push/deploy未実施。別セッションレビュー用のpatch・SQL・検証報告を本タスクoutputsに保存。


## 2026-09-08 緊急対応 第1回（404・言語切替）

- [x] 最新mainと現行ルーティング・公開言語の判定を確認
- [x] ドットを含む記事URLのルーティングを修正
- [x] 公開済み記事の言語だけを初期HTMLに出力
- [x] 管理画面の再検証に言語一覧のキャッシュ失効を連動
- [x] 回帰テスト・型検査・変更箇所の静的検査
- [x] ローカル本番ビルド、社労士公開フラグ両状態の確認
- [x] 57参照元ページの再検査、4言語のブラウザ操作確認
- [x] 差分・検証結果をレビュー用にまとめる

公開サイトの診断で検出したリンク先140件が対象。内訳を再確認し、言語切替のリンク先139件（49参照元ページ）、同じリンク先に向かう社労士記事本文内の3参照、ドットを含む日本語記事1件に分けた。本文リンク3件は表示時に公開言語へ解決し、移動先言語を明示する。記事の公開データや翻訳本文は変更しない。速度改善・robots.txt・GSC整理は計画書の次段階で扱う。

### 第1回の検証結果

- vitest: 26ファイル・418テスト成功。型検査成功。変更ファイルのESLint: エラー0、既存のimg警告1。
- ローカル本番ビルド: 1,411ページ生成成功。公開ページはSSG/ISRを維持。
- 57参照元を含む66パスの検査成功。対象の日本語記事は200・自己参照canonical・H1が1件・キャッシュHIT。
- 390px表示で日本語→英語→繁体字→簡体字の切替とcanonical更新を確認。未公開翻訳リンク0、横はみ出し0、ブラウザ実行エラー0。
- 社労士フラグfalseの開発環境で対象記事404、サイトマップにlaborのURLなし。
- 本番DB接続は手元の設定では成功しなかった。検証には公開HTMLの言語情報260記事と既存原稿を使ったローカルDBを使用（220記事は原稿あり、40記事は検査用本文）。本番DBへの書込みは行っていない。本番反映後の実測は別途必要。


### 独立レビュー後の追加検証（2026-09-09）

- [x] コラム詳細だけを静的ファイル判定の例外とし、他の拡張子・ドット付きディレクトリの従来配信を維持
- [x] POST/upsert/PATCH/DELETEのサーバー側で公開言語・旧新URL・事業配下・サイトマップのキャッシュを失効
- [x] 新規・編集画面の重複する再検証リクエストを削除。公開更新に失敗した場合は保存済みの旨を表示
- [x] 回帰テスト448項目成功
- [x] 実HTTPによる公開変更・削除・slug/事業移動・サイトマップ整合性の確認
- [ ] 最終差分の別セッションレビュー、プレビューで再検証

既知制限: 公開状態の変更前から開いている第三者ブラウザのlayoutは、通常のSPA遷移では古い言語一覧を保持し得る。新規アクセス・ハードリロード・次回サーバー取得を今回の対象とし、リアルタイム更新は別途扱う。DB更新とNextキャッシュは分散トランザクションではないため、キャッシュ失効の失敗はAPIの503とmutationSucceeded=trueで明示し、成功表示にしない。

- ローカル実HTTP検証: 28確認成功。DBはローカル専用、認証はループバックfixture、IndexNowは非本番として送信抑止。検証記事は最後に削除済み。
- 別セッション再レビュー: 公開阻害の指摘なし。after通知の登録失敗も保存結果に影響しない防御と3テストを追加。

## 2026-09-09 PR #326/#327 統合検証
- [x] #326成功・#327キャンセルを確認
- [x] 既存の検証済み統合候補を#327へ反映
- [ ] テスト・型検査・Preview build・公開URL確認
- [ ] 重複PR整理（本番マージは別途）

## 2026-09-09 V10 implementation — PR1 through PR4

- [x] Centralize HR plan fees, setup costs and responsibility boundaries in four locales.
- [x] Rebuild labor home, pricing, FAQ and workflow pages; keep unrelated existing fees.
- [x] Rebuild legal home and qualification-gated foreign-employer/GH links.
- [x] Align foreign-employment and visa LPs; correct language-support claims in the existing Japanese employer guide.
- [x] Translate care/GH and treatment-improvement LPs; separate wage work from administrative submissions.
- [x] Align the FAQ and two translated GH routes with sitemap hreflang entries.
- [x] Integrated unit/regression tests: 587 passed; typecheck passed; full lint: 0 errors, 36 warnings.
- [x] Public HTTP checks: 40 URLs (10 pages × 4 locales), all 200 with one H1 and matching canonical/hreflang.
- [x] Private HTTP checks: 28 labor URLs return 404/noindex; 12 legal URLs return 200 with no labor links.
- [x] Final build compilation and TypeScript passed; DB authentication blocked page-data collection (exit 1, not build success).
- [x] Mobile and desktop checks of plan fees, responsibility boundaries, controlled table scrolling and reciprocal links.
- [ ] Finish production build with valid DB configuration; placeholder credentials currently block column pre-rendering and shared translations.
- [ ] PR5: three Japanese revisions and review input prepared in the calling task outputs; await human-mediated ARTICLE_REVIEW_OUTPUT before translation/seed.
- [ ] Confirm V10 PART L and perform the separate-session primary review before release.

No commit, push, PR, merge, deployment or DB writes were performed. Worktrees are based on e7e952316403f954c6eb82f39dac43e01718ce13. Existing unrelated working files are preserved. Detailed final verification and resume instructions are in the calling task outputs; raw logs and environment settings are not part of the distribution.
