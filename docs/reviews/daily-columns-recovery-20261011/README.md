# Daily Columns recovery — 2026-10-11

Issue [#479](https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/issues/479) / [run 38070703682](https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/38070703682)。基準mainは `8571b0eeab9b501f35b090b5805a1e8b5a8e50c9`。本人の2026-10-11 08:02 JST承認に従い、既存の未コミット変更に触れず、隔離worktreeで修正・再検証・Draft PRを作成する。

## 停止原因と修正

review job `114281710482` は構造化結果を返した後、53 turnsがmaximum 50を超えたとしてActionが失敗した。結果自体も `pass=false` / major 1で、法務109・110の3翻訳ずつに内部リンク言語プレフィックスが無かった。review成功時のみfixに進む条件により、後続も停止した。

対象発見の `git diff --name-only` は未追跡の新規原稿を列挙できず、ログには許可外Bashの試行が繰り返されていた。prepareが固定基準の生成seedとの差分から記事別の4言語完全入力JSONを作り、候補・入力を既存quality artifactへ保存するよう変更した。レビューはこの入力をReadし、必要な既存原稿だけを参照する。同じ一次資料はまとめて読み、取得不能ならholdにする。Bashの許可範囲をプロンプトにも明示した。

max-turnsは50から80へ変更した。モデル呼出し数は増やさず、review失敗・不明・キャンセル時の後続停止と公開承認ゲートを維持した。上限変更だけで復旧済みとするものではなく、自然実行はmainへの反映後に確認が必要。

## 原稿の保存と修正範囲

正規GitHub取得の[validated artifact 11677654259](https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/38070703682/artifacts/11677654259)のZIP SHA256は `f433eed89e18ad66404f670c4b8dce748702339a2a7e1e1f6cb6fd33ecb62d4c`。GitHub digestと一致し、ZIP内validated.tar.gzのパス・ファイル種別を検査して隔離展開した。main未反映の日本語6本・翻訳18本と関連seedを回収した。

日本語6本と翻訳12本はartifactからバイト単位で維持。法務109・110のen / zh-tw / zh計6ファイルは各7リンク、計42か所の自サイト言語プレフィックスのみ修正。3seedを再生成し、不動産・労務の生成seedはartifactと同一、法務seedは修正を反映した。[保存manifest](preservation-manifest.json) / [リンク修正](link-fixes.json)。

法務seed検証に2026-10-10以降の新規翻訳の言語リンク検査を追加した。既存公開ゲートの検査を共通関数として再利用し、過去原稿の表記を一括変更していない。修正前は6件NGを再現し、修正後は0件。

## 最終コードの検証

- 3seedのdry-run / emit：NG 0。
- 回帰：4ファイル39件成功。最終workflow検査10件も成功。
- 全体：147ファイル・1990テスト成功。停止前の146ファイル・1982テストから8件追加。
- 全体TypeScript：成功。変更コードlint：0警告。全体lint：0 errors、変更範囲外の既存23 warnings。
- actionlint構文：成功。ShellCheckの既存メッセージは基準mainと同一。`git diff --check`：成功。
- 本番ビルド：専用localhost DBとダミー公開設定で成功、475静的ページ生成。本番DB・秘密設定は使用しない。
- 追加のHTTP表示確認は未完了。日本語記事は `/ja` rewrite後に同じ公開パスへ301となり、翻訳の応答確認も完了せず中断した。proxy / Next設定は今回変更していない。HTTP成功や公開確認の証拠として扱わない。専用ローカルサーバー・DBは検証後停止した。

[検証結果・ログdigest](validation.json) / [全体テストログ](vitest-final.log) / [回帰ログ](regression.log) / [最終コードSHA256](final-code-manifest.json)。

## 独立レビューと公開保留

編集担当とは別コンテキストのレビュアーが、修正後の6指紋と24言語版の全文・FAQ、既存記事の検索意図、最終コードを照合した。[構造化証跡](independent-review.json) / [詳細](independent-review.md) / [候補指紋](quality-candidates.json)。コード修正必須の指摘0、独立回帰39件成功、翻訳内部リンク不一致0。

**内容はpass=false、6件すべて公開保留。** 7 major（6件の現行一次根拠不足と、清算型遺贈の4言語本文・FAQで売買契約と移転登記が混同）および6 minor（組織固有名、清算型遺贈英訳の期限起算、農地FAQの区別不足）を記録した。一次資料の取得失敗や0行応答を確認済みと扱わず、資格者確認を必要とする。生成済み原稿維持の承認範囲で本文を書き換えず、公開前の解消事項として残す。

旧レビューを修正後の候補に渡した結果は[承認0・保留6](original-proof-rejection.json)。新しい独立証跡も実装のrecorderで[承認0・保留6](independent-proof-holds.json)。公開承認seedには承認を追加していない。レビュー失敗時の後続停止を緩めていない。

今回の成果物は修正と内容をまとめた[Draft PR #480](https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/pull/480)。マージ・公開・秘密設定変更・有料追加は実施しない。head CIの実際の状態はPRチェックと委任元への完了報告に記録する。
