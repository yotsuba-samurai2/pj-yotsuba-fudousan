# 物件画像の取得・品質確認・差し替え

対象は既存の同一号室。写真修正のために物件を再登録したり、募集確認時刻・賃料・契約条件・公開言語を更新しない。
全ページ生成や Vercel のビルドは不要。物件ページは DB を参照する動的ページ。

## Codexで一括実行する手順

1. Browserスキルを読み、ログイン済みの掲載元詳細画面で物件名・号室・募集状態を確認。終了は公開しない。ログイン切れを募集終了と解釈しない。
2. ギャラリーの総数を記録し、拡大表示を開く。現在のDOMで `.css-1sucic7 .swiper-slide`、`data-swiper-slide-index`、`keyboardArrowRight` が有効か確認する。サイト変更時は停止して再調査。
3. Browserの `node_repl` 内から `scripts/rental-import/browser-images.mjs` の `collectEsSquareGallery(tab, {expectedCount, downloadDir, outputFile})` を呼ぶ。拡大画像の正確なsrcを一意に指定して取得する。単なる `nth()` と `downloadMedia()` の組合せや、ダウンロード名の推測で進めない。
4. 全原画像のコンタクトシートを作り、エージェントが実際に目視する。写真・独立した間取り・元付帯入り募集図面を分類する。帯入り募集図面は除外理由を記録して除外。似た別角度の写真は残す。原画像のピンぼけ・文字の可読性は解像度だけでは保証できない。
5. 下記manifestを生成。`visualReviewComplete` は目視前にtrueにしない。全スロットを含め、除外も記録する。外観、間取り、室内等の表示順で並べる。
6. `npm run rental:images -- /absolute/manifest.json` で全件検査。全画像をデコードし、短辺400px・長辺640px未満、破損、取得漏れ、番号重複、写真/間取りの誤分類を拒否。画素が同一なら重複を除外する。拡大加工で検査を通さない。
7. `npm run rental:images -- /absolute/manifest.json --apply` でバックアップ→保存→保存したバイト列の照合→同一号室への画像だけの更新→DB再照合を実行する。`RENTAL_ENV_FILE` で既存の環境ファイル、`RENTAL_IMAGE_OUTPUT` で監査ファイルの保存先を指定できる。APIキーはログに出さない。
8. 公開ページの「写真をもっと見る」で画像数・全画像の読込・サイズ・内容・間取りを確認する。先頭数枚だけで完了にしない。報告は公開URL・採用点数・除外理由・実際の検証結果のみ。

## 接続設定が古い場合の実証済み代替経路

利用者に何度もJSON/ファイル選択を依頼しない。ログイン済み管理画面とSupabaseコネクターが使える場合は以下を自動実行する。

1. Supabaseコネクターで正しいプロジェクトの対象行を読み、非公開の `before.json` に保存する。
2. `prepareImages()` を通った採用画像だけを、Browserの `node_repl` で `uploadThroughAdmin(tab, entries, uploadedFile)` に渡す。この処理はストレージへのアップロードのみで、物件編集フォームの「保存する」は押さない。
3. 管理画面の追加画像がすべて読込済みで、自然サイズが原画像と一致することを確認する。
4. `node --import tsx scripts/rental-import/plan-browser-image-update.ts manifest.json before.json uploaded.json https://PROJECT.supabase.co update.sql` を実行。生成されたSQLを対象プロジェクトのSupabaseコネクターで実行する。更新対象は images と updated_at だけ。updated_at が一致しない場合は停止し、直前の変更を取り直す。
5. 返却行が1件であること、再取得したDB行の画像以外がバックアップと同一であること、公開ギャラリーの全点を確認する。未保存の管理フォームは再読込して古い状態で保存しない。

上記は通常の認証済み操作を利用する。Cookieやトークンの抽出、認証回避、ログイン状態の偽装を行わない。

## manifest例

```json
{
  "slug": "rent-EXISTING_ID",
  "provider": "eslife",
  "roomId": "SOURCE_ROOM_ID",
  "sourceUrl": "https://rent.es-square.net/bukken/chintai/search/detail/SOURCE_ROOM_ID",
  "expectedCount": 3,
  "visualReviewComplete": true,
  "entries": [
    {"index": 0, "file": "/absolute/exterior.jpg", "kind": "photo", "alt": "物件名・号室 建物外観"},
    {"index": 1, "file": "/absolute/plan.jpg", "kind": "floorplan", "alt": "物件名・号室 間取り"},
    {"index": 2, "file": "/absolute/flyer.jpg", "kind": "exclude", "alt": "募集図面", "reason": "元付帯入り"}
  ]
}
```

`EXISTING_ID` 等は実際の既存値に置換する。画像・監査JSON・SQL・認証設定はgitに含めない。
同一URLの重複は物件保存APIでも拒否する。管理画面のアップロードにも原画像検査を適用する。
自動判定は同一画素を対象とし、JPEG再圧縮や類似構図の判定には目視確認を併用する。
