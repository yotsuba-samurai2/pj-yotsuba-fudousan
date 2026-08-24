# Lessons

## 2026-07-08 B-1 canonical是正

- **metadataの二重export禁止**: ページを静的 `export const metadata` から `generateMetadata()` に変換するときは、旧ブロックを必ず**丸ごと削除して置き換える**（両方が同居するとNext.jsはビルドエラー）。変換後は `grep` で全対象ファイルの共存ゼロを機械的に確認する。grepはコメントブロック内のテキストも数えるため、ヒットしたら実コードかコメントかを目視確認する。
- **代表経歴の駐在表記は「中国総局長として中国や台湾、タイに駐在しました」が正**（2026-07-19 C-1で浦松更新。「4カ国」「5カ国」等の国数表記は一切使用しない＝旧ルール「4カ国が正」は廃止）。zh-tw/zh のCOPY（「旅居海外4國/4国」等）に残存があるため、多言語文面を触るとき見つけ次第修正する。
- **このリポジトリはローカルでnext buildが落ちる**: プロジェクトパスのマルチバイト文字（四葉基幹CRM）でTurbopackがpanicする既存バグ（mainでも再現）。ビルド検証はASCIIパスへ `rsync`＋`cp -Rc`（APFS clone）でコピーして行う。node_modulesのsymlinkはTurbopackが拒否するので実体コピーが必要。
- **Vercel PreviewはSSO保護でcurl不可**（302 → vercel.com/sso-api）。curl実測はローカル本番ビルド（`npm run build`→`PORT=xxxx npm start`をバックグラウンド起動）で行い、Previewはブラウザ確認用とする。
- **ロケール検出はレスポンスCookieだけでは初回アクセス（クローラー）に効かない**: middlewareで `x-locale` をリクエストヘッダーとして転送し（`NextResponse.rewrite(url, {request:{headers}})`）、Server Component側は headers() 優先・Cookieフォールバックで読む（`src/lib/getRequestLocale.ts`）。

## 2026-07-14 コラム内部リンク欠落の修正

- **貼られたタスクが「別リポジトリ／別サイト」を指していることがある**: 監査レポート（luck428.com対象）を samurai-app（samurai.co.jp）のセッションで受領した。実装前に、タスクが述べるURL・ルート（`/column`・`/souzoku`等）と開いているリポジトリの実ルート・`NEXT_PUBLIC_SITE_URL` を突き合わせ、同一物件か検証する。四葉グループは samurai.co.jp（`~/samurai-app`）と luck428.com（`~/pj-yotsuba-fudousan`）の**別リポジトリ2つ**。
- **「SSRにリンクが出ない」報告はまずライブHTMLで再現する**: `curl -s <url> | grep -o 'href="/column/[^"]*"' | wc -l`。推測せず実測してから原因（client `useEffect` 取得 vs 空クエリ vs フィルタ全落ち）を切り分ける。
- **`"use client"` でもSSRはされる＝データを props で渡せば初期HTMLにリンクが載る**: 一覧が孤児化していた真因は「client描画」ではなく「clientでデータ取得」。データ層（Firebase client SDK + React `cache()`）は isomorphic で server 実行可能なので、取得を server の page.tsx に移し props で渡すだけで直る。同型の詳細ページ（既に server fetch）が手本。
- **関連リンク節は1コンポーネントを全ページに強制しない**: full幅セクション（一覧/詳細/souzoku）と prose内カード（RealestateServicePage=toushi/global）とトップのカードで意匠が違う。各ページの既存デザイントークンに合わせて出し分ける方が「新しいスタイル体系を持ち込まない」原則に合う。
- **該当データが無いテーマは偽リンクを作らず「不足」を報告する**: souzoku（相続）に張れる ja コラムが0本＝相続コラム未執筆。`filterColumnsByTheme` は0件なら節ごと非表示にし、不足は tasks/todo.md に記録して執筆計画へ回す。

## 2026-07-14 sitemapロケール展開＋エンティティ識別子

- **検証前に古いローカルサーバを必ず殺す**: `PORT=3100 npm start` を起動しても既存プロセスがポート占有中だと新プロセスはbindできず、curlは**古いコード**を返す（sitemap修正が「27本のまま」と誤判定した）。検証前に `lsof -ti tcp:3100 | xargs kill -9` でポートを空けてから起動する。「up after 1s」は再ビルド後には速すぎ＝占有の兆候。
- **Next.jsのsitemapは配列1要素=<url>1件・<loc>=urlのみ**: `alternates.languages` は `xhtml:link hreflang` にしかならず `<loc>` にはならない。ロケール別URLを `<loc>` として出すには**ロケールごとに配列要素を分ける**。hreflang生成は既存 `canonicalUrl()` を単一情報源に再利用する（sitemap専用の別ロジックを作らない）。
- **法人番号の取り違えは致命的**: 四葉不動産は同名他社が複数（特に文京区本駒込の別法人 1010001172596）。当社は **7010001259396**（小日向）のみ。実装前後に `grep -rn '1010001172596' src public` で誤番号がコードに入っていないことを機械確認する。JSON-LDには当社番号のみ、llms.txtの「区別」節でのみ他社番号を他社として明記。
- **既存 sameAs は順序含め不変を厳守**: エンティティ強化で識別子を足すときも `REALESTATE_SAME_AS`/`LEGAL_SAME_AS`（Wikidata・cid・宅建協会・KG MID）は触らない。追加は Person 側 sameAs や新規 identifier/alternateName で行い、検証で既存値の欠落0を確認する。

## 2026-07-15 GSCインデックス改善①（トップのメタ・ロケール別化）

- **`buildPageMetadata` に固定文言を渡すとロケール横断で複製メタになる**: トップ `page.tsx` だけが title/description を日本語ハードコードしており、/en・/zh・/zh-tw が「日本語トップと同一の薄い複製」＝GSC「クロール済み・未登録」化していた（子ページは `META: Record<LangCode,…>`＋`getRequestLocale` で正しく出し分け済み）。**新規ページ／トップは必ず子ページと同じ META 方式に乗せる**。`buildPageMetadata` は locale から og:locale/twitter/canonical/hreflang を自動生成するので、直すのは title/description だけでよい（og:locale は元々 `ja_JP` 固定ではない＝`OG_LOCALES[locale]`）。
- **多言語 title は H1（本文COPY）を単一情報源に再利用する**: 社名保護（全ロケール先頭に「四葉不動産」）と新規ハードコード増加防止を両立するため、メタ title は `HomePageContent` の各ロケール H1 と同一表記にする。en/zh-tw/zh の description は本文intro準拠の監修前ドラフトとしてコメントで明示（フェーズI監修対象）。
- **メタ検証はユニークポートのdevで実測する**: `next dev -p 3111` で `/`・`/en`・`/zh`・`/zh-tw` の `<title>`・`og:locale`・`og:title` が各言語で出し分けられ、canonical・hreflang（ja/en/zh-Hant/zh-Hans/x-default）が不変であることを curl で確認してから完了扱いにする。ページの `generateMetadata` は Firestore を叩かない（inline META）ため、秘密情報なしでも title は正しく出る。

## 2026-07-15 GSC 404/403 対応（②③）

- **404の出力元はsitemapとは限らない＝hreflangを疑う**: sitemap 81本は全200でも、一部ロケールのみ公開のコラム（zh-tw専用のtaiwan系）の詳細ページが hreflang を全4ロケール分出していたため、存在しない ja/en/zh 版URLをGoogleが辿って404化していた。`buildPageMetadata` の `alternates.languages` は**実在ロケールに限定**する（`availableLocales` を追加＝未指定は従来の全ロケールで後方互換）。判定は既存の `Column.locales`／`isLocaleAllowed` を単一情報源に再利用する。
- **ロケール構造は「/{locale}/legal/...」（locale先頭）が正**: 旧構造「/legal/{locale}/...」のGoogle保持URLは `next.config` の `redirects()` で 301。locale セグメントは `(en|zh-tw|zh)` に限定し ja 素パス（/legal/about 等の現行ページ）に一致させない。`zh-tw` は `zh` より前に並べる（セグメント最長一致）。
- **Next.jsの `permanent:true` は308＝301が要るなら `statusCode:301` を明示**: 308もSEO等価だがGSCレポート整合と互換性のため 301 を使うなら明示する。検証では移転先が200で解決すること（リダイレクト先404の不在）まで確認する。
- **410はproxy(middleware)で完全一致・早期return**: `next.config` は 301/rewrite/headers しか返せず 410 は出せない。恒久廃止の旧WP URL（/en/comments/feed・/test1）は proxy 先頭で 410 Gone。末尾スラッシュは正規化して判定し、ロケール/テナント判定には干渉させない（rootファイルへの追加は完全一致・早期returnに限る）。
- **www 403 の主因はドメイン未設定（証明書欠落）でコードでは直せない**: `www.luck428.com` は TLS 証明書が www を含まず（`no alternative certificate subject name`）、http→https 308 後にハンドシェイク失敗でアプリに到達しない。Vercel の Domains に www を追加し apex への 301 リダイレクトを設定する（ダッシュボード操作）。コード側の middleware/WAF を疑う前に `curl -v https://www...` で証明書とサーバ応答元を確認する。

## 2026-07-19 B-2 代表プロフィールページ

- **外部リンクは指定URLのみ張る＝「親切心」でリンクを増やさない**: タスクが sameAs・外部リンクとして特定URL（士業ドットコム予約ページ）を指定している場合、関連するトップページ等を追加で張らない（浦松指摘＝samurai.co.jpトップは不要、予約ページ1本のみ）。リンク・sameAs・識別子は指示の集合と完全一致させ、増減は提案として分離する。

## 2026-07-19 C-2 指定申請と物件（/toushi/shitei-shinsei）

- **士業の独占業務の範囲は法律どおり正確に書く**: 行政書士法で独占業務（19条の制限対象）なのは「官公署提出書類の作成」（1条の2）のみ。提出手続の代理は1条の3の法定業務であって独占ではないため、「作成・提出は独占業務」とまとめて書かない（浦松修正指示）。正しい形＝「作成は行政書士の独占業務にあたり、書類の作成・提出は四葉行政書士事務所が別契約で受任」。B-3/C-1で入った同表現（faqJa Q19・group-home回答ブロック・分担表注記）もC-2で一括是正済み＝新規文章でも再発させない。
- **法人要件は「原則必要です」で表記統一**: 指定申請の法人要件は「必要とされています」ではなく「原則必要です」（浦松検収）。

## 2026-07-19 C-6-2 /souzoku/akiya 中国語版

- **前提タスクの実装は「未コミットの作業ツリー」に存在することがある**: C-6-1 を `git log --all --grep`・ブランチ一覧・stash で探して「未実装」と結論しかけたが、実体は作業ツリーの未コミット変更（CannotHandle/Faq/RealestateServicePage/seo.ts）にあった。**依存タスクの有無は `git status` と対象ファイルの実内容を必ず読んでから判断する**（git履歴だけで「無い」と言わない）。作業中に前提タスクがコミットされること（C-6-1＝c78074e）もあるため、実装直前に再確認する。
- **確定訳は「サイト既存訳」より「直前タスクの承認訳」が優先**: 「別契約で受任します」はサイト全体に `另行簽約受任` があったが、C-6-1 の浦松承認訳は **`另行簽訂契約承辦`／`另行签订合同承办`**。既存 grep で見つかった訳を即採用せず、直近の承認タスクのファイル冒頭コメント（訳語方針が明記されている）を先に読む。
- **部品コメントとページ実装が食い違うことがある**: `CannotHandle.tsx` は「C-6-1で中国語版でも表示＝浦松承認」と書かれているが、`/global/chinese` の実装は `{locale === "ja" && <CannotHandle bare />}`＝中国語版で非表示。**部品側コメントではなく呼び出し側の実装を正とし、食い違いは検収時に報告する**。
- **ローカルのビルド検証は prisma dev の使い捨てDB＋`pgbouncer=true`**: `DATABASE_URL` 未設定だと page data 収集で落ちる。`npx prisma dev --name xxx` → 接続文字列に **`pgbouncer=true` を付けて** `.env.local` に置く（付けないと `prepared statement "s0" already exists` で失敗）。prisma CLI は `.env.local` を読まないので `db push` は環境変数を inline で渡す。検証後は `prisma dev stop` と `.env.local` 削除まで行う。本番Supabaseには接続しない。
- **多言語ページの「日本語残留」検査は JSON-LD を除外してから行う**: 本文のかな検出をかけると `seo.ts` の Organization description（全ロケール ja 固定・構造不変）が大量にヒットして誤検知になる。比較対象として同方式の既存ページ（C-6-1 の `/zh-tw/global/chinese`）の残留プロファイルと突き合わせ、差分がゼロであることを確認する。
- **ローカル検証の前に「そのポートを誰が握っているか」を必ず確認する**: C-6-3 で `PORT=3132 npm start` が既存プロセス（前セッションのC-6-2検証サーバー、同日12:03起動）とポート衝突し、`npm start` は黙って失敗、curl は**旧ビルド**に当たり続けた。「全ロケールで日本語が出る」という偽の不具合を数十分追った。**`lsof -nP -iTCP:<port> -sTCP:LISTEN` で所有プロセスを確認し、他セッションのサーバーは落とさず別ポートを使う**。ヘッダー（canonical・og:locale は新ロケール、title・hreflang は旧挙動）のように**新旧が混在して見えたら真っ先にビルド/プロセスの同一性を疑う**。

## 2026-07-20 NAP住所 正式表記 統一（表示データ層）

- **「表示側の値」はソース(repo)ではなくDB(translationテーブル)にあることを最初に確認する**: 本番HTMLの変種を「i18n辞書ファイル」だと想定して着手しかけたが、UI翻訳は `getTranslationData.ts` が `translation` テーブルから読む完全DB管理。ソース(seo.ts/office.ts)は既に正式表記で JSON-LD 専用だった。**repo編集だけでは本番表示は直らない**。表示不一致を見たら、まず値の格納先（DB or source）を `getTranslationData`/`admin-api` で特定してから方式を決める。
- **DB翻訳値の一括是正は admin是正ルート（fix-compliance方式）が既定パターン**: `/admin/translations/fix-*` が `getTranslations→書換→saveTranslations` を4言語で回す。新規是正も同方式（今回 `/admin/translations/fix-nap-address` 新設）にすると本番でユーザーが実行でき、私が本番DBに直結せずに済む。
- **住所の正規化は from/to 完全一致でなく「アンカー限定の正規表現置換」が堅牢**: 現行DB値が backup(2026-07-10)と一致する保証がなく、変種も多数。`小日向◯丁目`／`小日向安田ビル`／`Kohinata Yasuda Bldg.` をアンカーにした正規化なら、未知の変種も吸収でき、かつ「小日向・茗荷谷駅…」等の**近隣地名の言及（住所でない）は不変**に保てる。idempotent なので再実行安全。
- **repo全体grepの「非正式ゼロ」判定は用途分類してから**: `小日向` 437件のうち住所は一部で大半は近隣地名の言及。残る非正式は①検出器の定義(NAP_BAD_VARIANTS＝仕様上必須) ②過去の監査/スナップショット記録(履歴・改変しない) ③seedのdry-run生成物(本番非表示) のみ。**履歴・監査記録・検出器定義を機械的に書き換えない**（履歴の改竄になる）。rendering層がゼロであることを示すのが目的。

## 2026-08-05 定点#24 空き家×グループホーム転用（/column/kodate-akiya-group-home-ni-kasu）

- **`--emit-ts` の再生成が「無害な再生成」とは限らない＝実行前に no-op か確かめる**: `seed-gh-columns.ts --emit-ts` を回したところ、#165（定点#22対策）で**生成物 `gh-columns-seed.ts` に直接足した東京都の補助制度の記述が丸ごと巻き戻った**。ファイル冒頭には「原稿の正本＝`scripts/gh-columns/*.md`」と書かれているが、#165 はその不変条件を破って生成物側だけを編集していたため、mdが古いまま取り残されていた。**生成スクリプトを流す前に一度流して `git diff` が空（no-op）であることを確認し、空でなければ md と生成物のどちらが新しいかを判定してから進める。** 今回は `seed-gh-columns-p2.ts` は no-op（md＝正本が生きている）と確認できたので、そちらだけ md 起点で更新した。
- **DBのみに存在するコラムの本文は、RSCペイロードから生Markdownを復元できる**: 管理画面から直接作られたコラムはリポジトリに無く、レンダリング済みHTMLから本文を起こすと表記が壊れる。`self.__next_f.push([1,"…"])` の各チャンクを `JSON.parse` で復号して連結し、`"slug":"…"` のレコードを取り出すと `content` は `"$2b"` のような参照になっている。参照先の行は `2b:T<hex>,` 形式で、**この長さはJS文字数ではなくUTF-8バイト長**（日本語は3バイト）。文字数で切ると次の記事に食い込むので `Buffer.subarray` でバイト単位に切る。
- **upsert は「未指定は不変・指定は上書き」＝写し取るメタデータを取り違えない**: `toUpdateInput` は `undefined` のフィールドを触らない一方、seedが渡した `title`/`excerpt`/`author`/`keywords`/`tags` はDB値を上書きする。既存コラムをシード化するときは、**退避したスナップショットと機械照合して「意図した変更以外がゼロ」を確認する**。既存の `AUTHOR` 定数を流用すると著者表記が黙って変わる（本件の現行値は realestate seed の定数と別物だった）。
- **既存コラムのシード化は専用の投入ページに分ける**: `seed-realestate`（3本）や `seed-gh-p2`（5本）に相乗りさせると、投入ボタンを押した時点で**対象外のコラムまでリポジトリの内容で一括上書き**される。管理画面で後から手直しされている可能性がある以上、触る本数だけを upsert する増分ページを作る（`seed-gh-p2/p3/p3b` と同じ考え方）。
- **原稿の案は自サイトの姉妹コラムと突き合わせてから採用する**: 差し込み原稿は「用途地域によっては建てられない」「消防は自動火災報知設備等で足りるのが通常」としていたが、自サイトの出典付きの記述は「寄宿舎は**工業専用地域を除くほぼ全ての用途地域で可**」「平成27年4月1日施行の消防法施行令改正で面積要件が撤廃され**原則設置義務**、区分4以上8割以下等で緩和され得る」。**クラスタ内で同じ論点の記述がぶつかると、両方の信頼度が下がる**（luck428-column-seo 第2条の2と同じ構図）。新しい本文を書く前に、その論点を既に扱っている姉妹コラムを読む。
- **FAQは本文に書いただけでは構造化データにならない**: `(realestate)/column/[slug]/page.tsx` は `col.faq` が空だと `FAQJsonLd` を描画しない。本コラムは本文に「## よくある質問（FAQ）」節がありながら `faq` フィールドが未設定で、**FAQPage が1件も出ていなかった**。本文にFAQ節がある既存コラムは `faq` フィールドの有無を確認する。なお見出しは「よくある質問」と「よくある質問（FAQ）」、Q-A間の空行の有無がコラムごとに揃っていないため、パーサは両方を受ける必要がある。

## 2026-08-05 指示書11B `/reasons` `/network` v1.3改訂

- **指示書が「新設」と書いていても、まず sitemap とコード両方で既存を洗う**: 11B は「`/reasons` `/network` を新設」「2026-07-28の実測では両方とも不存在」としていたが、実際は **PR #146・#147 で公開済み**だった。新設ではなく改訂として着手した。yotsuba-sharoushi-kaigyo 第8条・第3条が同じ罠（指示書11の「4ページ新設」が実際は「新設1＋改修3」だった）を既に記録している。**指示書の日付が古いほど、記載された実測値は信用しない。**
- **指示書と正本スキルが食い違ったら、実サイトの現状を第三の証拠にする**: 11B は「社労士事務所を可視表示せよ」、コードは `SR_LAUNCHED` で全非表示。決め手になったのは **footer・`CannotHandle`・`/about/uramatsu`・`/toushi/shitei-shinsei` が既に「2026年9月開業予定（現時点では未開業）」を可視表示していた**という実測。サイトが実際に引いている線は「未開業注記付きの言及＝可視／受任できると読める現在形＝ゲート内」であり、11B はこれと整合していた。**規程の条文だけで判断せず、本番HTMLを見る。**
- **指示書は自分自身と矛盾することがある**: 11B の H2-6 直答案は「**提携の**社会保険労務士をご紹介します」だったが、同じ11Bの「重要な制約」欄と正本6-4-5（U12＝書面での提携が未確認）が「提携◯◯」を禁じている。**貼り付け用の文案をそのまま採用せず、同じ文書内の制約欄と突き合わせる。**
- **数を数える表現は消すのではなくゲートで出し分ける**: 11B の「窓口は一つ、契約は三つ」は開業前に事務所を3つと数え、6-4-8「開業前に事務所数を数えない」（＝PR #147 が是正した内容）に反する。第4条の「数えるならゲートで出し分ける」に従い、開業前「契約は分かれます」／開業後「契約は三つ」を `SR_LAUNCHED` で切り替えた。**9月1日の作業は env 1行のままに保つ。**
- **⚠️ 行政書士法の条番号がずれている（令和8年1月1日施行の改正）**: 改正で **第1条の2（職責）が新設**され、旧「第1条の2＝業務（書類作成）」は現行 **第1条の3**、旧「第1条の3」は現行 **第1条の4** に繰り下がった。第19条（業務の制限）も「第一条の三に規定する業務」を参照している（e-Gov API `326AC1000000004` で2026-08-05確認）。**リポジトリには旧番号のまま「第1条の2＝書類作成」と書いた箇所が7ファイル残っている**（本PRで `/reasons` のみ是正済み）。
- **e-Gov は SPA なので WebFetch では条文が取れない**: `https://laws.e-gov.go.jp/law/<id>` はタイトルだけ返る。**API v1 `https://laws.e-gov.go.jp/api/1/lawdata/<lawId>` を curl して XML を読む**。法令ID例＝行政書士法 `326AC1000000004`／社会保険労務士法 `343AC1000000089`（`343AC0000000089` は404。AC0/AC1 を取り違えない）／司法書士法 `325AC1000000197`／税理士法 `326AC1000000237`／弁護士法 `324AC1000000205`／宅地建物取引業法 `327AC1000000176`。
- **`SR_LAUNCHED` の両状態検証は `.claude/launch.json` に一時的な第2構成を足すのが速い**: `next dev` は同一ディレクトリで2つ起動できないため、既存サーバーを `preview_stop` してから `sh -c "NEXT_PUBLIC_SR_LAUNCHED=true npm --prefix … run dev -- -p 3001"` の構成で起動する。検証後は構成を戻す。

## 2026-08-05 定点#25 相続した空き家 賃貸に出すか売るか（/column/souzoku-jikka-uru-nokosu）

- **⚠️ RSCの本文参照行は「改行の直後」とは限らない**: 上のGH転用の学びは `2b:T<hex>,` の行を `\n` 起点で探す前提だったが、本コラムでは直前が `"}` で、`indexOf("\n2b:T")` が空振りした。**`(?:^|[\n}])<id>:T([0-9a-f]+),` の正規表現で探す**。バイト長で `Buffer.subarray` する点は同じ。
- **既存コラムのシード化は「退避JSONとの機械照合」を verify() に入れる**: 写し取りの過程で公開中の記事を劣化させないため、`title/date/category/excerpt/status/author/tags/locales` が退避値と完全一致すること、既存キーワードが全件残っていること、**改稿前の本文の各行が新本文にすべて含まれること**を検査する。段落単位で照合すると出典の箇条書きに1行足しただけでNGになるため、**行単位で照合する**。
- **「設問に答えていない」の実測は生Markdownと描画済みHTMLを使い分ける**: 本文の語数はRSCから復元した生Markdownで数え、`<table>` と FAQPage はレンダリング後のHTMLで数える（faqフィールド未設定だと本文にFAQ節があってもFAQPageは出ない＝#24と同じ構図）。本コラムは設問語「判断基準」0回・「どちらが」0回・`<table>` 0個だった。
- **税の特例は「貸すか売るか」の判断に直接効く**: 措置法35条3項（空き家の3,000万円特別控除）は「相続の時から譲渡の時まで事業の用・貸付けの用または居住の用に供されていたことがない」ことが要件（国税庁 No.3306）。**「とりあえず貸す」を選ぶと要件から外れる**ため、貸す／売るの比較表を書くときはこの軸を先頭に置く。適用可否・税額の判断は税理士の業務なので断定せず送る。
- **⚠️ 同じチェックアウトで別エージェントが並行作業していると、コミットが他人のブランチに乗る**: 本作業中に指示書11Bの作業が `feat/souzoku-jikka-hantei-hyo`（本作業のブランチ）へコミットされた（`c87110c`）。`feat/reasons-network-v13` は作られていたが切り替えられていなかった。**コミット直前に `git branch --show-current` と `git log --oneline -1` を必ず確認し、身に覚えのないコミットが乗っていたら `git branch -f <相手のブランチ> <そのSHA>` で退避してから `git rebase --onto origin/main` で自分の1コミットだけにする。**

## 2026-08-24 SEO監査対応（PR #296）キャッシュ・リージョンの実測学

- **Vercelでは middleware から動的ページをCDNキャッシュ可能にできない**: `next start`（ローカル）ではproxy.tsで set した `Cache-Control: s-maxage=…` が最終レスポンスに乗るが、Vercel本番ではEdge Middlewareが**キャッシュ層より前段**で実行され、キャッシュ判定は**関数レスポンスのヘッダー**（動的ページ＝常にno-store）で行われる。`Vercel-CDN-Cache-Control` をmiddlewareで付けても同様に無効（プレビューデプロイ実測・2回目もMISS）。一方 `x-locale` 等の一般ヘッダーは本番でもクライアントまで届く＝「middlewareヘッダーが届く」ことと「CDNがそれを見る」ことは別。`x-vercel-cache: HIT` を実現するにはロケールをURLセグメント化して headers() 依存を外すリファクタが必要（未着手・別プロジェクト）。
- **TTFB約6秒の主因はキャッシュではなくリージョン跨ぎだった**: 関数がiad1（米国東部）・Supabaseがap-northeast-1（東京）で毎クエリ太平洋往復。`vercel.json` の `"regions": ["hnd1"]` 1行で **TTFB 6.6秒→0.19〜0.46秒**（本番実測）。遅いSSRサイトはキャッシュ談義の前に `x-vercel-id`（`<エッジ>::<関数リージョン>::…`）とDBリージョンの一致を先に見る。
- **set-cookie はCDNキャッシュの敵**: 全レスポンスへのlocale Cookie付与が no-store の一因だった。「既存Cookieの値がURLとズレた同期時のみサーバーで set、初回付与はクライアントeffect」に分離すると、クローラー（Cookie非送信）には set-cookie が一切出なくなる。

## 2026-08-24 ISR化リファクタ（PR #297）ロケールURLセグメント化の実測学

- **next/root-params の「root params」はルートレイアウトのセグメント以上の動的パラメータだけ**: `app/layout.tsx` を残したまま `app/[locale]/` を作っても root param にならず、Turbopack が「Export locale doesn't exist（module has no exports）」で落ちる。ルートレイアウト自体を `app/[locale]/layout.tsx` に移し、`[locale]` 外の `/admin`・`/facilitator` には独自のルートレイアウト（`<html>` 持ち）を与えるマルチルートレイアウト構成が必須。`experimental.rootParams: true` も必要（Next 16.2）。
- **not-found.tsx の headers() が「全laborページ動的化」の犯人だった**: SR_LAUNCHED ゲートの `notFound()` がビルド時に404をレンダーするため、404側のリクエストAPIがゲート対象ページ全部を動的に降格させる。しかも**通常ビルドはエラーも警告も出さず黙って ƒ に降格する**。`[locale]/layout.tsx` に `export const dynamic = "error"` を置くと「Route X couldn't be rendered statically because it used headers()」とルート名・API名つきでビルドが落ちる＝最強の診断法なので、恒久ガードとしても残した。
- **prerender-manifest.json が静的化の正**: ビルド表の ●/ƒ 表示や「Generating static pages (356/356)」だけでは判断できない（356全部がadmin+特殊ページだけのこともある）。`.next/prerender-manifest.json` の routes 件数と `initialRevalidateSeconds` を見る。
- **prisma dev 使い捨てDBは最大10接続＝静的生成の並列に耐えない**: 9ワーカー×プール接続で P1001/P1017 が多発する。`connection_limit=1&pool_timeout=0&connect_timeout=0`（prisma dev 推奨値+pgbouncer=true）にし、next.config の `experimental.cpus` を `NEXT_BUILD_WORKERS` 環境変数で絞るノブを追加して 2 ワーカーでビルドすると安定。Vercel 本番ビルドは Supabase pooler なので絞り不要。
- **VercelのISRページのヘッダーは `cache-control: public, max-age=0, must-revalidate` + `x-vercel-cache: PRERENDER→HIT`**: 監査指示書の受け入れ基準「s-maxage が見える」はローカル next start の挙動で、Vercel は s-maxage をCDN側で消費してクライアントには出さない。合否は x-vercel-cache と Age/TTFB で判定する。本番実測 TTFB 0.07〜0.08秒（キャッシュHIT時）。
- **`.next/dev/types` はディレクトリ移動後に腐って tsc を落とす**: ルート大移動の後は `rm -rf .next/dev` してから `tsc --noEmit`。vitest はレイアウトに依存しないので素通りする＝型エラーの検知はtscだけが頼り。
