# automation/columns-status

Columns Autopublish（.github/workflows/columns-autopublish.yml）が毎日正午に書き換える結果の置き場。手で編集しない。

- summary.md：人が読む要約（公開した記事・保留中・Search Console の状況・手でリクエストする候補）
- status.json：直近のコラムの登録状況（次回の確認と、朝7時の納品タスクが読む）
- last-publish.json：正午の自動公開APIの応答
