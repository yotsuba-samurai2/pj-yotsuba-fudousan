# Daily Columns 修復ジョブの停止修正（2026-09-15）

## 確認した事実

- 対象: https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/34877853793
- 基点main: `489fd2c6244ff9da3433acea082d9cceb8b697d8`。
- validateは行政書士記事の必須表現「民法第899条」不一致で失敗。原稿には「民法第898条・第899条」がある。これは連続文字列の表記差であり、本文に条文番号が無いという意味ではない。
- upload-artifactは`.ng/`を隠しディレクトリとして除外し、`No files were found`で保存をスキップ。続くvalidate-repairは`Artifact not found for name: validate-ng`でモデル実行前に失敗した。
- 原稿3分野のartifactは残っている。全文ファイルをローカル退避し、tarの安全な展開と対象行を確認した。原稿を本PRに取り込まない。
- PR #353はOPEN・未マージ。前日6本の復旧原稿とfix条件の修正を含む。朝の要約の「PR未作成」は古い。

## 変更

- validate-ngの保存を`.ng/ng.txt`と3分野のログに限定し、`include-hidden-files: true`を指定。保存対象ゼロはエラーにする。
- PR #353のワークフロー差分のみを先行反映。fixはキャンセルされておらず、reviewが成功して明示的な不合格を返した場合だけ動く。通知文も同PRと一致させた。
- 原稿、seed、公開DB、モデル、検証基準は変更しない。PR #353とは同一のworkflow修正なので、後から原稿側をマージしてもこの条件を巻き戻さない。

## 検証

- actions/upload-artifact v4が使用する`@actions/glob` 0.5.0で再現: 旧設定は0ファイル。修正後は指定した4ファイル。`.env`と無関係なファイルは除外。
- `@actions/expressions` 0.3.61で7ケース: 検証成功経路・修復成功経路のreview不合格ではfixが動き、review合格・unknown・failure・skipped・cancelledでは動かない。旧条件に暗黙のsuccess()を付けると前2ケースで動かないことも再現。
- `actionlint -shellcheck='' .github/workflows/daily-columns.yml`: 成功。
- YAMLパース、`git diff --check`: 成功。
- アプリコード変更がないため、サイト全体のbuild・DB接続テストは対象外。

## 残る確認

- mainへの反映後にworkflowを実行し、実際のartifact受け渡しと修復後の検証・レビューを確認する必要がある。旧実行の単なる再実行は旧YAMLを使うため修正確認にならない。
- PR #353の原稿レビューと公開承認は別途必要。本PRをマージしても前日原稿は自動公開されない。
- 当日6本の復旧では前日分と原稿番号が重複する（不動産55/56、行政書士62/63、社労士99/100）。両バッチのseed配列を丸ごと上書きせず、個別に統合してレビューする。

## 参考

- https://github.com/actions/upload-artifact/tree/v4 （隠しファイルは既定で除外）
- https://github.com/actions/upload-artifact/blob/v4/src/shared/search.ts
- https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/pull/353
