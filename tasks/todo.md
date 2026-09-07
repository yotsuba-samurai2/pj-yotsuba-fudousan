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
