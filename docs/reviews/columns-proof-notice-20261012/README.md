# Daily Columns：原稿訂正と公開判定通知（2026-10-12）

朝の納品通知は「レビュー指摘なし・未検証なし・正午に自動公開」と案内したが、対象runはminor2件があり、公開証跡の登録結果は0本・6本保留だった。原稿保存の成功、レビュー指摘、指紋に対応する証跡、自動公開の品質候補、本番公開の実績を分ける。

本日分Draft PR：[#481](https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/pull/481)。

対象run：<https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/38160195514>。base main：`d0dce295189e9458f5de08ceaddf24e5d44bc875`。元のrunのsource headは`8571b0eeab9b501f35b090b5805a1e8b5a8e50c9`。同runの生成物24原稿は既にmainに保存されていたため、再生成せず既存原稿を訂正した。`article-edit-manifest.json`のoriginalSha256はbase mainと一致を確認してから編集した値。原稿の公開日`2026-10-11`は元データどおり維持し、本文の追加確認日は`2026-10-12`と明示した。

## 対象と修正

| 分野・番号 | 本日のslug | 主な訂正 |
|---|---|---|
| 不動産115 | sango-care-shukuhakugata-bukken-shisetsu-kijun-boshihokenho | 国指針の看護職24時間配置、対象施設の2020年通知、面積等の未確認区分、4言語抜粋 |
| 不動産116 | souzoku-jikka-juutaku-loan-zansai-teitouken-massho-baikyaku | 2024年以後・対象家屋等の取得相続人3人以上の2000万円上限、法令ID、契約・決済・登記の区分 |
| 行政書士109 | kodo-kanri-iryokiki-hanbai-kashidashi-kyoka-tenpo-kanrisha | 一般品目と指定コンタクトレンズのみの資格区分、FAQ・抜粋、取得済み表示 |
| 行政書士110 | seisan-gata-yuigon-fudosan-kanka-bunpai-yuigon-shikkou | 買主契約と移転登記の順序、共有の一律全員同意表現、清算型固有の課税断定とFAQ |
| 社労士149 | jidosha-kyoshujo-shidouin-kenteiin-roudoujikan-hanbokibi-36kyotei-henkei | 拘禁刑、一斉休憩の英訳、特別条項の臨時事情、所定超と法定時間外のFAQ、直接請求の訳 |
| 社労士150 | gakushujuku-yobiko-koshi-koma-kyu-jugyogai-roudoujikan-kanri | 厚労省2017年指針の正規本文PDF、判例等の未取得表示、直接請求の訳 |

法務翻訳6ファイルの39リンクへ言語prefixを補正し、事務所名を日本語の正式名称に統一した。3seedを再生成し、本文・4言語のFAQを同じ根拠と留保に整合した。

前日のDraft PR [#480](https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/pull/480)は別のrun・別slugの24原稿。番号が同じでも本日の原稿で置換しない。#480のhead `ae08f4f04869a21b5319680b5e24efbf574c724e`、Draft・OPEN・CONFLICTING状態を確認し、そのブランチを変更していない。本Draftは#480の原稿・上限変更に依存しない。

## 訂正と確認待ちを分ける

`original-review.json`は元runのpass=true・minor2件を保持する。一次資料の初期独立監査は`primary-audit.md/json`、訂正後の独立レビューは`independent-review.md/json`。

最終レビューは初期23指摘の17件を修正確認。6件の重要未確認は各記事のmajor/holdとして維持した。これは取得不能を法令の誤りと確定したものではない。現行統合条文・最終改正番号と全施行履歴、個別の施設適合・登記・課税・制度適用等について資格者の確認を要する。取得した公的本文の確認対象だけverified=trueとし、23件true・12件falseを保持した。

全6記事はrequiresQualifiedReview=true、primarySources/legalClaims=hold、duplicateIntent/translationAlignment=pass、全体pass=false。最終6指紋を実装で再計算し、24MD・96FAQ、全144内部リンクを照合済み。指紋は`final-candidates.json`を参照。

最終recordの結果：生成・機械検証6本／公開証跡登録0本／自動公開の品質候補0本／品質保留6本／公開日待ち0本。公開ゲートを変更していない。`force`でも未確認記事を公開しない。本番公開処理とDB書き込みはこの修正では実行していない。公開済み件数はDB未照会のためnull。

## 通知の実装と残る運用作業

`columns-review-proof.ts record`がレビュー処理のsuccessを必須とし、処理失敗・未取得・形式不正のJSONを公開証跡に変換しない。候補のkey・fingerprintと現在の原稿を照合し、`docs/columns-delivery/YYYY-MM-DD.{json,md}`とlatestへ生成・指摘・証跡・品質候補・保留を別の数として保存する。workflow summary・コミット文・原稿保存通知・失敗Issueの本文に同じ区分を使う。元の品質ゲート、モデル呼び出し数、定期実行時刻を変更していない。

朝メールの実際の生成元は既存Claudeタスク「コラム6本をGoogleドキュメントで届ける（朝7:00）」。ライブ設定は未更新。署名付き追跡管理リンクを開く操作は自動承認審査に拒否されたため、再試行・別経路実行はしていない。通常のタスク編集機能が現在の実行環境で提供されていない。適用する具体文面は`docs/columns-delivery/claude-morning-task-patch.md`に保存した。修正案の作成をライブ反映とみなさない。メール再送は行わない。既存Google Docsには最終独立レビューの重要未確認6件・公開証跡0本・6本保留・正午公開予定なしを追記して確認済み。

## 検証

最終結果とログのSHA256は`validation.json`を参照。主要ケースは0承認、部分承認、minorを伴うpass、一次資料false、JSON不正、原稿指紋変更、レビューfailure/cancelled/skipped/unknown。実offline CLIと実失敗通知shellも実行し、下流の公開処理は無証跡ならforceでもDBを書かないことを既存テストで確認する。

Turbopackはローカル環境でCSS処理のport bindingがEPERMとなり、拒否操作は再試行していない。公式Webpackビルドを別の検証経路として使用する。Vercelの最終head CIも確認し、ローカルの制約を成功と書き換えない。

[コンプライアンス自己点検] 判断留保:有／匿名化:不要（実案件なし）／法令引用:取得範囲・参照日明記、未照合の施行履歴は明示／未検証事項:6区分（各記事の重要未確認、詳細は独立レビューと12参照）、資格者確認待ち
