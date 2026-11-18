# 今後の原稿で同じ失敗を見つけるための自動検査

このPRで見つかった「FAQは見かけ上4問だが表示用と生成後の構造化データが一致しない」「訳文へのURLに言語コードはあるが、リンク先の当該言語の本文がない」の再発を、今後の原稿PRで検出する。

- Column content preflight はPRの基準コミットから変更された3系統の記事（本文・翻訳・生成データ）を選び、4言語の正本と生成本文・翻訳タイトル・抜粋・実際のFAQ質問文/回答文を照合する。
- 既存seedにリンク先記事があり、当該言語版が無効または空なら、URLの形が正しくても該当記事をエラーとして表示。DBにしかないかもしれない宛先や、意味のある訳者の編集差になりうるリンク集合の差は警告として分ける。外部資料のHTTP到達性や法令判断もこれだけで保証しない。
- 変更していない記事の保留を他の記事の審査証明にしたり、未検証を合格にしたりしない。CIは読み取り専用でDBや承認台帳を一切操作しない。
- ローカル再現： `node --test scripts/test-column-projection.mjs`、`node scripts/check-column-projection.mjs --base origin/main`。対象32の定点確認は `node scripts/check-column-projection.mjs --manifest docs/reviews/held-columns-20261118/review-manifest.json`。
