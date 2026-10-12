# PR481 本番反映と6記事の追加確認（2026-10-12）

PR [#481](https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/pull/481) は、本人承認のhead `429c157427943a29022d5a25457469a2f036c394` を照合して2026-10-12 15:13:14 JSTにsquash mergeした。マージSHAは `1e389cf27b38a9b9369b746ab2427ee78950fa21`。GitHubの当該SHAのVercel通知はSUCCESS / Deployment has completed。

本番 <https://luck428.com> はHTTP200。取得HTMLの `dpl_9NnQpghMS5dzygavFquzS2KJ9dC6` がGitHub当該SHAの[Vercelデプロイ](https://vercel.com/yotsuba-samurai2/pj-yotsuba-fudousan/9NnQpghMS5dzygavFquzS2KJ9dC6)と一致した。既存Vercel CLI認証は使えたが、現在のcontextではデプロイを解決できず、team一覧はCLI内部TypeError。設定・認証・権限は変更せず、GitHub通知と本番の公開応答で確認した。

## 公開結果

既存の `Columns Autopublish` をmainの当該SHAに対し `dry_run=true` / `force=false` で1回実行した。[run 38212525701](https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/38212525701) のAPIは既存認証を受け付けてHTTP409、公開候補0本、品質保留6本、公開0本を返した。品質確認待ちが理由でworkflowはfailureとなり、通常処理が [Issue #482](https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/issues/482) を作成した。認証失敗やデプロイ失敗とは区別する。

記事のDB公開とGSC送信は実行していない。6記事×4言語の予定URLをGETして全24件404を確認した。実際に公開したURLは0件。実応答・照合根拠・時刻・原本ハッシュは `production-verification.json` を参照。

追加修正Draft PR：[#483](https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/pull/483)。このDraftは未マージ。

## 追加修正

元原稿の再生成はしていない。労務149/150の日本語・英語・繁体字・簡体字、計8MDとlabor seedを変更した。

- 150の報酬表から時間給を除外する誤った表現を除き、厚生労働省1985年報告の「時間給等も労務対償性の判断材料」という限定説明に整合した。
- 150の最低賃金説明・手順・FAQを、除外賃金と時間給/日給/月給/出来高/併給の別に応じた換算へ修正。一律の総支給額÷総工時とは扱わず、コマ給分類・分母は資格者確認を要すると明記した。
- 裁判所の正規詳細ページと全文を取得して事件の同一性を確認し、一般判断枠組みの取得済み範囲だけを出典に追加した。塾講師の在宅業務への個別適用は未検証のまま。
- 149の42/320時間の短縮表示にも対象期間3か月超の条件を保持し、規則12条の4第3項の旧協定比較による280日未満の制限を資格者・所管確認事項として補足した。
- 取得済み資料、全改正/施行履歴、個別適用を分けた。品質ゲート・承認要件・ `force` の作用・Secrets・モデル起動・公開時刻を変更していない。

不動産115/116・法務109/110の本文はPR481から変更せず、追加取得したAPI指定条文の照合結果を `root-source-feasibility.md/json` に記録した。法務省の正規URLは1回の取得で403を返し、再試行・別経路迂回はしていない。

## 残る6保留

| 記事 | 公開前に解消を要する重要未確認 |
|---|---|
| 不動産115・産後ケア | 改正/施行履歴、建築用途・消防区分/設備・自治体基準、人員/施設への適用 |
| 不動産116・残債ある相続物件 | 改正/施行履歴、取得拒否された法務省案内、団信/残債・相続放棄・税制/登記の個別適用 |
| 法務109・医療機器販売 | 構造設備規則・改正履歴、予定品目・管理者経験/資格・施設適合、申請先案内 |
| 法務110・清算型遺言 | 改正/施行履歴、清算型固有の登記・譲渡所得帰属/申告、権限と遺留分等 |
| 労務149・教習所 | 改正/施行履歴、運転業務特例、協定・制度導入/届出、休憩/振替・割増算定への適用 |
| 労務150・塾講師 | 改正/施行履歴、労働者性・授業外労働、固定残業代の有効性、コマ給分類と最低賃金算定への適用 |

資料が取得できたことを資格者による最終確認に置き換えない。全6記事の `requiresQualifiedReview=true` を維持し、公開承認は0本。最終6指紋は `final-candidates.json`、編集ファイル指紋は `final-edit-manifest.json`、最終独立レビューは `independent-review.md/json` に保存した（pass=false / major6、一般主張32件確認・17件未確認）。正規recordの結果も登録0本・保留6本。旧レビューを新日時や新原稿へ流用しない。

## 検証と運用上の残件

最終コードで147ファイル1996テスト成功、lint 0エラー/既存警告23件、型検査成功、3seed dry-run NG0。詳細とログハッシュは `validation.json`。既存DB認証拒否後のローカルfull buildは再試行していない。PR481の本番デプロイ成功と追加修正DraftのCIは別の結果として扱う。

PR [#480](https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/pull/480) は別原稿で、head `ae08f4f04869a21b5319680b5e24efbf574c724e`、Draft / OPEN / CONFLICTINGを確認し未変更。物件検索ブラウザー作業・物件/問い合わせの未コミット変更へ触れていない。

Claude朝7時タスクのライブ設定は未更新。署名付き追跡管理リンクは自動承認審査が拒否済みで、今回も再試行していない。具体的な修正案は既存 `docs/columns-delivery/claude-morning-task-patch.md` に保存済み。これをライブ適用済みとは報告しない。

[コンプライアンス自己点検] 判断留保:有／匿名化:不要（実案件なし）／法令引用:取得日・対象条文・確認範囲を明記、全履歴は未検証／未検証事項:上表6区分、資格者・所管確認待ち
