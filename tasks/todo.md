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
- [x] Resolved in PR5: production-mode build passed with a disposable local DB; current production translations still require release-time verification.
- [x] PR5 proceeded after direct user approval; external-model review is not claimed. Final five-article implementation and checks are recorded below.
- [ ] Confirm V10 PART L and perform the separate-session primary review before release.

No commit, push, PR, merge, deployment or DB writes were performed. Worktrees are based on e7e952316403f954c6eb82f39dac43e01718ce13. Existing unrelated working files are preserved. Detailed final verification and resume instructions are in the calling task outputs; raw logs and environment settings are not part of the distribution.

## 2026-09-09 V10 PR5 — columns and local verification

- [x] User directly approved the three presented Japanese revisions (04, 16, 37). No external-model review result is claimed.
- [x] Final consistency scan found two further old-price references (03, 38); align only the affected office-service passages with the already approved V10 terms.
- [x] Preserve article identity, original publication dates and topics; do not change unrelated articles.
- [x] Use the repository's disposable local DB workflow to validate page generation without accessing production data.
- [x] Final: 5 articles × 4 locales; 607 tests passed; typecheck/build passed; lint 0 errors; 120 public/private URL checks passed.
- [x] Generated seed changes only 5 of 90 articles; 85 remain unchanged. CJK emphasis rendering corrected and tested.
- [ ] Separate-session primary review, PART L confirmation and production-data comparison before publication.

Only a task-owned loopback database receives fixture writes. No production DB writes, commits, PRs or deployments. Final evidence is saved in the calling task outputs.


## 問い合わせCTA v2 統合検証（2026-09-12）

- [x] 最新 main 7c92bfb へ同期し、既存作業とパッチの一致を確認
- [x] 同梱 v2 の10ファイルを適用
- [x] 実依存で型検査・変更対象lint・全671テスト（40ファイル）を通過
- [x] 同梱テストのreact/no-children-propを修正し、ColumnBodyと既存言語リンク補正の結合確認を追加
- [ ] SR_LAUNCHED=false / true の本番ビルド完了（両方コンパイル・型検査成功、DB認証でページ生成停止）
- [x] 3事業×4言語×9サイズのCTA配置108ケース、動作・遷移等84項目、追加表示条件21項目を検証
- [x] SR_LAUNCHED=falseの社労士経路4言語が404・noindex・CTA非表示
- [x] 横幅比較108ケースでCTA・LINKA非表示時と同幅（ページ全体のはみ出し48ケースは翻訳復旧後に再確認）
- [ ] 実データでの不動産トップ・コラム詳細・共通翻訳の画面確認（有効なDATABASE_URL待ち）
- [x] 差分・検証結果・未検証事項を別セッションレビュー用に整理

### 統合検証のレビュー記録

- ソース10ファイルを未コミット状態で適用済み。実装8ファイルは同梱v2と一致、テスト2ファイルのみ追加修正。
- 不動産の配置・遷移確認はトップのDB認証エラーにより固定のアクセスページで代替。共通DB翻訳はフォールバック状態なので、本番文面の幅・全体レイアウトは未確定。
- 既存.env.localのDATABASE_URL/DIRECT_URLのパスワードがテンプレート値。Vercelのpreview/productionにはDATABASE_URLが登録済み（前回のenv runによる不存在判定を訂正）。取得値が伏せ字になるため、Vercelクラウド内の設定で全体ビルドを行う。秘密値・環境変数ファイルは変更していない。
- ブラウザの電話/LINE外部遷移、フォーム等POST、GA4外部送信は抑止してローカルイベントを検証。
- 公開前のiOS実機・GA4受信・独立した別セッションレビュー、commit/push/PR/merge・本番反映・DB投入は未実施。


### 本番反映（2026-09-12 利用者承認）

- [x] 利用者から全体ビルド・コミット・本番反映を承認済み
- [x] 最終ソース10ファイルが型検査・lint・671テスト通過時と同一であることを確認
- [ ] 作業ブランチのコミット・PRとVercelプレビュービルド
- [ ] 本番ブランチへ統合し、本番ビルドと公開URLを確認

ローカルで秘密値を読み出せないため、既存Vercel環境内でのフルビルドで検証する。

## 2026-09-13 社労士トップの依頼方法・料金比較
- [x] 最新mainから作業を分離し、公開ページ・現行料金・実装指示を照合
- [x] 4言語のトップ、標準料金モデル、単独依頼、共有フォルダの説明を実装
- [x] 料金・FAQ・業務案内と構造化データの整合を確認
- [x] 型・lint・テスト・build、4言語とスマートフォンの実表示を検証
- [x] 差分とローカルプレビューを提出（マージ・本番公開は別途）

検証：689テスト、変更箇所lint、型チェック、本番ビルド（387ページ）、4言語20ページのHTTP検証を通過。390px幅でも横溢れなし。非公開フラグは独立チェックで404ガード・4言語メタデータ非表示を確認（5件）。非公開設定のdev HTTP検証は既存Googleフォント取得失敗で未完了。ローカルプレビューのみ、マージ・公開・本番DB変更なし。

### 2026-09-13 追加修正
- [x] 標準導入55,000円に、一定期間の顧問契約で無料になる場合がある旨を4言語で追加。比較表・内訳・プラン料金・FAQを共通文言で統一。
- [x] キャッチコピー「小さな会社にも、人事部を」をロゴのピンクと同系統の濃色にし、文字を拡大。
- [x] 給与計算の包含範囲を「給与計算対象３名まで含む（1〜3名の人数帯）」に4言語で変更。
- [x] 初期費用を191,700円（136,700円）と併記し、括弧内の適用条件を近接表示。

追加修正後も対象35テスト・対象6ファイルのlint・型検査を含む本番形式ビルド・20ページのHTTP検証を通過。PCと390px幅で実表示を確認。

### マージ承認と最終検証（2026-09-13）

利用者が最終画面を確認し、コミット・PR作成・マージまで明示承認。最新origin/main（3373fa8）との差分に競合なし。最終版で689テスト、変更15ファイルのlint、本番形式ビルド（387ページ）、20ページHTTP確認、4言語の確定文言・料金・FAQの照合を通過。承認された差分をsquashマージする。


## 2026-09-13 トップ公開後レビューの追補
- [x] 相談例の給与計算文・外国人雇用カードを4言語で簡潔にし、冒頭の「まとめて」を「含めて」に変更
- [x] 冒頭CTA直下に初回60分無料を4言語で明記
- [x] 利用者の判断に従い、在留資格の基本相談無料と既存の受任条件を維持
- [x] lint・型・既存689テスト・387ページの本番形式ビルド・4言語20ページのHTTP確認・日本語390px幅の実表示を確認
- [x] 既存の公開承認に基づきPR #344を作成。統合・本番公開の最終状態はPRと公開検証記録を参照。


## 2026-09-13 スマホ冒頭の表示速度・文字色
- [x] PageSpeedの診断内訳を確認（スマホLCP4.3秒、Style/Layout1.8秒、淡色背景上の主色文字）
- [x] 社労士のスマホ表示で、装飾用フォントを主要画像の読み込み・初回描画後に読み込む
- [x] 冒頭画像の画質・表示幅指定と、社労士ヘッダーロゴの寸法指定を適正化
- [x] 社労士の依頼導線・比較表・手順の緑文字を濃色に変更
- [x] スケジューラ7テストを含む696テスト、型検査、変更箇所lint、本番形式ビルド387ページ、4言語20ページのHTTP検証を通過
- [x] 日本語・英語の390px幅と日本語PCの実表示を確認。緑文字のコントラスト比4.40→6.37、冒頭画像750pxのWebP容量23,850→19,726 bytes（17.3%削減）
- [ ] 本番へ反映し、同条件のPageSpeed測定で効果を確認

改善前の同一URL再測定は20:08が78点・LCP4.3秒、20:40が98点・LCP1.8秒。測定の変動が大きいため、初回との単純比較を今回の速度改善効果とは扱わない。既存の料金・相談条件・ピンクのキャッチコピーを維持。公開・公開後測定の結果はPRと検証記録を参照。

### 小型スマホ幅の補正
- [x] 320px幅でヘッダーロゴがメニューボタンを圧迫する問題を修正。狭い画面では縦横比を保ってロゴを縮小
- [x] 型・変更箇所lint・387ページビルド通過。4言語320pxでヘッダー右端289pxが表示領域305pxに収まり、日本語のメニュー開閉も確認。390px幅でも横溢れなし

## 2026-09-13 ゼヒトモ公式タグ
- [x] 認証済みの公式設定画面で発行タグと同一ページURLの登録条件を確認
- [x] 指定コラムと料金ページの日本語版2ページへの設置・公開を利用者が承認
- [x] 公式ID・リンク3本・表示文・targetを維持し、問い合わせ帯の下へ限定配置
- [x] 原稿・料金・他言語・共通フッター・本番DBは変更なし
- [x] 全696テスト、型チェック、全体lint（エラー0）、コラムdry-run検査を通過
- [x] 別セッションのコードレビューで具体的な不具合指摘なし（レビュー環境でのVitestは権限制限。本セッションでは全件通過）
- [x] 本番形式ビルド763ページ、対象2ページ・対象外9ページのHTTP検査、PC・390pxの目視と320pxの部品幅を確認
- [ ] PR・squashマージ・本番の2ページを確認
- [ ] 料金ページURLのゼヒトモ登録を確認（掲載対象としての受理は未確認）

## 2026-09-13 ヘッダー・フッターの翻訳キー露出
- [x] 利用者のスクリーンショットで、文字崩れの実体が翻訳キーの露出と確認
- [x] 翻訳DB取得失敗が空辞書になり、共通レイアウトの文字列へそのまま届く経路を特定
- [x] 社労士ナビ・フッター・共有連絡先の4言語の予備辞書をサーバーで補完。正常なDB文言・意図的な空文字・現在言語と日本語だけの配信を維持
- [x] 両言語のDB取得失敗を再現し、実ヘッダー・フッターの翻訳、電話リンク、欠損・不正型・開業前ゲートを検証する9テストを追加
- [x] 効果を確認できなかった追加フォント遅延を撤回。画像圧縮・文字色・小型スマホのロゴ補正は維持
- [x] 698テスト・型・lint・本番形式387ページビルド・4言語20ページの翻訳キー検査を通過。PCの4言語切替と320px日本語メニューを実表示で確認
- [ ] 既存の公開承認に基づきマージ・本番反映、公開ヘッダー・フッターを再確認

レビュー：DBの書き換えは行わない。予備データは本日取得した公開UIから、共通レイアウトで必要な項目だけを採用。本文・料金・相談条件は変更しない。速度は変更前3回の中央値96点/LCP2.3秒に対し変更後75点/LCP4.4秒で、追加フォント遅延の効果は確認できず。原因と断定せず、未確認の最適化を撤回する。

## 2026-09-14 社労士トップ刷新・問い合わせ受任フロー

- [x] 統合指示書、共有メモリ、最新main、既存差分・共通部品・正本を確認
- [x] 4言語の変更前PC/SP画面とローカル性能を記録
- [x] 代表実写真4候補を比較し、人物画素を保持して生成背景と合成
- [x] 新ヒーロー → 3依頼方法 → 4区分フローバナー → 既存料金比較
- [x] /labor/nagareを8段階・3例・資料区分・6FAQ・相談導線へ更新
- [x] 4言語の本文・metadata・リンク、既存gaEventを利用する計測
- [x] 型検査・lint・関連テスト・build
- [x] 5幅・4言語、操作・計測・アクセシビリティ・性能検証
- [x] 独立レビュー用資料と未追跡ファイルを含む差分パック

基準HEAD: 04c28cd2e33d4fa7a0b1b484066180b1b7600d84。開始時clean。
作業場所は専用worktree。料金正本・フォーム送信処理・proxy・他事業は変更しない。
当初はローカルレビューで停止。後続の明示指示により、検証後のPR・マージまで進める（末尾参照）。本番DB更新は行わない。

### 追加修正：代表写真の選び直し・ヒーロー右余白
- [x] プロフィール撮影の「1」「2」をFinderで開く
- [x] ヒーローを本文の右280px予約領域から独立させ、写真を画面右端まで広げる
- [x] 代表名を左コピー下へ移し、追従案内との重なりを避ける。後の指定で写真加工注記・トップ上部の事務所名と地域肩書きは削除
- [x] 型検査・変更部品lint・関連36テスト
- [x] ユーザー指定0169に差し替え、ズボンを上着と同色・控えめな顔補正・靴を写さない構図・植物背景を反映
- [x] ユーザー確定コピー「仕事が楽しい。そんな職場に」を2行配置、4言語を同趣旨へ更新
- [x] 追加修正後の最終build（2ワーカー、371/371ページ）・4言語5幅の実画面・最終buildの5条件確認・レビュー一式を更新

0169の人物補正はユーザーの明示的な追加依頼による。初回0079の画素保持の検証を0169に流用しない。

- [x] 追加指定のトップ説明文を4言語に反映し、STEP 5の未装飾リストをPC2列・狭幅1列の箇条書きへ修正（4言語5幅確認）。

### 追加指示：実装完了後のマージ
- ユーザーの「全部終わったら実装してマージしてください」により、当初のローカル停止指定を更新。検証完了後はcommit・push・PR・squash mergeまで進める。
- [x] 最新mainとの競合なし、変更全体の型検査・lint・706テストを確認
- [x] 最新コピー・肩書き・STEP 5の修正を含む最終build（371ページ）と4言語40条件の実表示・操作を確認
- [x] 変更差分を確認し、PR #349 のチェック成功後にマージ（f028b56）

## 2026-09-14 社労士フッターのサービスリンク修正

- [x] 公開フッターの4リンクがすべて業務案内ページを指し、同ページでは移動しないことを再現
- [x] 助成金は専用ページ、保険手続き・給与計算・就業規則は対応する説明箇所へ接続
- [x] 4言語共通のアンカーと固定ヘッダー用の移動余白を設定
- [x] 型検査・lint（既存warning 1件・error 0）・710テスト・ローカル本番形式ビルド（371ページ）・4言語のクリック動作を確認
- [x] 同じアンカーを再度押しても目的箇所へ戻るよう、社労士フッターのアンカー3件はブラウザ標準のリンクを使用
- [ ] 既存の実装・マージ指示に従いPR・マージ、公開リンクを確認

## 2026-09-14 三本線メニューからグループサイトへ移動

- [x] 3サイト共通のメニューと正式なリンク先・4言語表示を確認
- [x] 他の2サイトと士業ドットコムを三本線メニューに追加
- [x] 小型画面でメニュー内スクロールと下部の言語切替・お問い合わせの表示、開閉時のスクロール制御を確認
- [x] 3サイト×4言語の実表示、公開フラグの両状態の回帰テスト、型検査・lint（error 0、既存warning 1）・730テスト・build（371ページ）を確認
- [x] 三本線メニューから4つの公式サイトへ実際に移動できることを確認
- [ ] 検証資料を保存し、既存の指示に従ってPR・マージ

## 2026-09-14 日次コラム6本（Issue #350）の復旧

- [x] 引継ぎパックのハッシュ照合、最新 main（489fd2c）とパッチ基点の一致確認、パッチ適用（適用後ツリー e5e9f80a 一致）
- [x] 原稿6本×4言語の修正点（対抗要件の施行日、協定24か国の出典、令和8年法律第45号の公布日、着手前に、事業体名の日本語統一、日付2026-09-13）を確認
- [x] 英語版3か所の文末ピリオド欠落を補正し、不動産・行政書士の seed を再生成
- [x] seed dry-run／emit-ts（3分野、NG 0・no-op）、lint（error 0）、tsc、730テスト、使い捨てDBでの本番ビルド（371ページ）、Actions 条件7ケースを確認
- [x] `recover/columns-20260914` で draft PR を作成（マージ・デプロイ・DB投入は浦松の指示待ち）
- [ ] 資格者レビュー（法務省通知の本文確認を含む）→ マージ → デプロイ → 管理画面から3分野を投入 → 24URLの200・言語・canonical・sitemap を確認 → Issue #350 を閉じる


## 2026-09-15 Daily Columns 修復経路
- [x] 実行34877853793・PR #353・原稿artifactを照合
- [x] 検証ログが隠しディレクトリ除外で消える不具合を修正
- [x] PR #353のfix条件修正を先行して適用（原稿は含めない）
- [x] GitHub公式glob・式評価器で旧動作と修正後を検証
- [x] actionlint・差分検査
- [ ] mainへのマージと修正後workflowの実走（承認後）
