# ペット調査の開始：許諾台帳の記載・取込画面・件数の公表（独自集計）

作成日：2026-09-24／指示書：`00_pet_ecosystem_master_revised_2026-09-24.md`（版2.0）第4〜9章
前提の判断（浦松・2026-09-24）：
- 「ペット調査はやってください」
- 許諾台帳の根拠：**浦松判断として記載**（媒体の書面回答は取っていない）
- REINS：調査に含める（**同席時のみ**）。scope は版1（REINS・ATBB・ITANJI・いい生活）のまま
- 「LPへの件数表示＝集計公表はおこなってください。REINSなどとはかかず、独自集計」
- 実装計画はプランモードで承認済み

## 0. 結論（先に要点）

- 許諾台帳 `DATA_USE_LEDGER` に8行を記載した。
  - 対象は4媒体それぞれの **内部保存・加工（store）** と **集計公表（aggregate）**。
  - 効力は 2026-09-24（日本時間0時）から。
  - 個別広告・画像転載・SNS は記載なしで、拒否のまま。
- `/pet-housing` の件数枠は **「当社が独自に集計したもの」** と明記し、媒体名は出さない（`attribution` は null）。4言語とも同じ扱い。
- 取込画面 `/admin/bukken/rental-survey` を作った。
  - バッチの投入：登録前チェック → 保存
  - 確定：確定前チェック → 分類の確認 → 確定
  - 巻き戻し
- 確定・巻き戻しに成功したら、その場で `/ja/pet-housing` を再生成する（ふだんは1時間ごと）。
- 管理APIの入出力と DB は変えていない。**本番DBの作業は不要**。
- 件数枠を出すには、Vercel の Production に `RENTAL_SURVEY_PUBLIC_SCOPES=bunkyo-rent-pet:1` が要る（浦松が設定する）。設定が無い間、件数枠は出ない。

## 1. 判断の記録（第7章との関係）

- 指示書 第7章は「媒体名の省略・独自集計の表記は、許諾確認の代わりにならない」としている。
- 今回の記載の根拠は、媒体の書面回答ではなく、**浦松（宅地建物取引業者の代表者）の判断**である。台帳の `evidenceRef` に「書面回答なし」と明記した。
  - store：「会員として、媒介目的（ペット住宅の相談者への物件提案）の内部利用」
  - aggregate：「媒体名を出さない当社の独自集計として、件数のみを /pet-housing に公表」
  - `termsVersion`：「会員規約（版は未確認・書面回答なし）」
- 公表するのは件数（X・Y・Z）と観測期間だけ。個別の物件、住所、媒体名は公表しない。
- 媒体から異議・撤回・規約の変更があった場合
  - 台帳に `revoked` の行を足す PR を出す。その日時から保存・確定・公表が止まる。
  - 急ぐ場合は、先に公開フラグを外して再デプロイする（件数枠が hidden になる）。

## 2. 作ったもの・変えたもの

| ファイル | 内容 |
|---|---|
| `src/lib/rental-survey/permissions.ts` | 台帳8行（上記）。冒頭のコメントに判断の経緯を記録 |
| `src/components/rental-survey/SurveyCountsPanel.tsx` | 注記を「…当社が独自に集計したものです」に（4言語）。媒体名は書かない |
| `src/app/api/admin/rental-survey/route.ts` | 確定・巻き戻しの成功時に `/ja/pet-housing` を再生成。失敗しても確定は成功のまま（記録だけ） |
| `src/lib/rental-survey/review.ts`（新規） | 取込画面の確認用の純関数：`summarizeBatch`（対象の数え方）・`pickFinalizationBatches`（確定に使うバッチ） |
| `src/app/admin/bukken/rental-survey/page.tsx`（新規） | 取込画面 |
| `src/app/admin/bukken/page.tsx` | 「学区別の募集一覧」の隣に「ペット調査」へのリンク |
| `scripts/rental-survey/verify-local.ts` | `exercise-api`：実際の管理API・実際の台帳をローカルの使い捨てDBで通す |
| テスト | `rental-survey-permissions`（台帳の記載）・`rental-survey-panel`（独自集計の文言）・`rental-survey-api`（再生成）・`rental-survey-review`（新規）・`rental-survey-admin-page`（新規） |

## 3. 取込画面の使い方（毎週）

1. `/admin/bukken` →「ペット調査」を開く。
2. 媒体ごとの取得結果を JSON にまとめ（4章）、「調査データ」で選ぶ。
   - 画面に、対象の件数・内訳・対象外の件数と、対象の住戸ごとの**根拠の原文**が出る。ここで分類を確認する。
3. 「登録前チェック」→「保存」。
4. 4媒体の完全な取得（verified）がそろったら確定する。
   1. 媒体ごとに使うバッチを選ぶ（既定は、保存が最も新しい verified）。
   2. 「確定前チェック」を押し、X・内訳・除外の件数を確認する。
   3. 「各バッチの対象の住戸について、ペット条件の分類を根拠の原文で確認した」にチェックを入れる。
   4. 「確定」を押す。
5. 誤りに気付いたら、「確定の履歴・巻き戻し」から前の確定に戻す。戻す前に内容を確認する手順がある。

**運用の決まり**
- ペット条件は媒体の原文どおりに分類する。AI の判定だけで「可」を確定しない。
- REINS は浦松の同席時だけ扱う。
  - ログインは本人が行う。
  - 件数事前確認を先に行い、1回の検索は100件以内に分ける。
  - 詳細・図面を開くのは、その場で承諾を得てから（課金）。
- REINS を行えなかった週は、REINS を `failed`（または `incomplete`）として理由だけ保存し、その週は確定しない。
  - 件数枠には前回の確定が観測期間つきで出続ける。
  - 長く止める場合は、公開フラグを外す。

## 4. バッチ JSON の書式

1ファイル＝1媒体・1回の取得。**検索で出た全件を入れる**（対象の住戸だけに絞らない。`expectedCount` との突き合わせを意味あるものにするため）。

REINS で検索結果が100件を超えるときは、条件を分けて検索する（賃料帯など、漏れも重なりもない分け方にする）。分けた結果は1つのバッチにまとめ、`expectedCount` は各検索の総数の合計にする。

```json
{
  "version": 1,
  "scopeId": "bunkyo-rent-pet",
  "scopeVersion": 1,
  "provider": "atbb",
  "status": "verified",
  "observedFrom": "2026-09-30T10:00:00+09:00",
  "observedTo": "2026-09-30T11:30:00+09:00",
  "allPagesChecked": true,
  "expectedCount": 2,
  "records": [
    {
      "sourceId": "（媒体の物件番号）",
      "building": "（建物名）",
      "unit": "205",
      "address": "東京都文京区千石１丁目…",
      "availability": "active",
      "application": "none",
      "applicationQuote": "（申込状況の原文）",
      "pet": {
        "multi": "allowed",
        "species": "cat",
        "limits": { "cats": 2, "dogs": null, "total": 2 },
        "largeDog": "not-allowed",
        "conditions": "（敷金の追加・貸主承諾などの条件の原文）",
        "petQuote": "（分類の根拠にした原文）"
      }
    },
    {
      "sourceId": "（媒体の物件番号）",
      "building": "（建物名）",
      "unit": "301",
      "address": "東京都文京区…",
      "availability": "active",
      "application": "none",
      "applicationQuote": "（申込状況の原文）",
      "pet": {
        "multi": "unconfirmed-count",
        "species": "other-or-unconfirmed",
        "limits": { "cats": null, "dogs": null, "total": null },
        "largeDog": "unconfirmed",
        "conditions": "",
        "petQuote": "ペット相談"
      }
    }
  ]
}
```

| 項目 | 値 |
|---|---|
| `provider` | `reins`／`atbb`／`itandi`／`eslife` |
| `status` | `verified`＝全ページを確認した／`incomplete`・`failed`＝途中まで・失敗 |
| `verified` の条件 | `allPagesChecked: true`、`expectedCount`（媒体の画面に出た検索総数）＝`records` の件数、`sourceId` の重複なし |
| `incomplete`・`failed` | `records` は空、`failureReason` に理由 |
| 観測期間 | `observedFrom` ≦ `observedTo`、終了は現在より前。日本時間なら `+09:00` を付ける |
| 上限 | 3,000件・5MB |
| `availability` | `active`（募集中）／`closed`（終了）／`unknown` |
| `application` | `none`（申込なし）／`present`（申込あり）／`unknown` |

**ペット条件 `pet` の分類（第6章）**

| 項目 | 値 | 決まり |
|---|---|---|
| `multi`（2頭以上） | `allowed`／`consult`／`unconfirmed-count`／`single-only`／`not-allowed` | 「ペット相談」だけの記載は `unconfirmed-count`（対象にしない） |
| `largeDog` | `allowed`／`consult`／`not-allowed`／`unconfirmed` | 「猫のみ可」と大型犬可は両立しない |
| `species` | `cat`／`dog`／`cat-and-dog`／`other-or-unconfirmed` | |
| `limits` | 猫・犬・合計の上限（数字か `null`） | 合計1頭までと複数飼育可は両立しない |
| `petQuote` | 分類の根拠にした原文 | 可・相談・1頭限定・不可を入れるときは必須 |

対象は「`multi` が可・相談」または「`largeDog` が可・相談」の住戸（和集合・1住戸1件）。猫3頭以上は、上限が3以上と書かれているものだけを数える。

## 5. 確定の条件

- 4媒体それぞれの `verified` が1つずつそろっている。
- 観測期間の幅（最も早い開始〜最も遅い終了）が7日以内。
- 現在の確定より古い観測ではない。
- 4媒体とも、台帳の store が有効。
- 同時に確定したときは、番号の食い違い（409）で検出する。画面は「確定前チェック」からやり直す。

## 6. 公開（件数枠）

- 表示先は `/pet-housing`（日本語）だけ。学区の一覧・ItemList・JSON-LD には出さない。
- 出す条件：`RENTAL_SURVEY_PUBLIC_SCOPES` に `bunkyo-rent-pet:1` があり、4媒体とも store と aggregate が有効で、確定が1つ以上ある。
- 表示の中身
  - 重複を除いた確認件数 X
  - うち当サイトで詳細掲載中 Y・詳細非掲載 Z
  - 観測期間・集計確定の日時
  - 「当社が利用する複数の業者向け物件情報のうち…当社が独自に集計したものです」
- 止め方：公開フラグを外して再デプロイする（すぐに止める場合）、または台帳に `revoked` を足す。

## 7. 検証（2026-09-24）

- vitest 全件・tsc・変更ファイルの eslint：結果は `tasks/todo.md` に記録。
- ローカルの使い捨てDB（prisma dev）で `exercise-api` を実行した。実際の管理API・実際の台帳を使い、すべて OK。
  - 認証なしは 401。4媒体とも store・aggregate が「記載あり」。
  - 登録前チェックでは保存しない。保存・失敗バッチの保存ができる。観測終了が未来なら 400。
  - 画面と同じ選び方で、媒体ごとに最新の verified を選ぶ（失敗の REINS は選ばない）。
  - 確定前チェックで X=2・内訳を確認できる（保存はしない）。確定では、公開ページの再生成に失敗しても確定は成功する。古い番号での確定は 409。
  - 2回目の確定（X=3）→ 1回目への巻き戻し（X=2・追記）。
  - 公開フラグが無ければ hidden。あれば X=2・媒体名なし。
  - 学区の行は完全に同じ。
- `next build`（公開フラグと `RENTAL_SURVEY_PUBLIC_SCOPES` を有効にして）＋ `next start` で次を確認した。
  - `/pet-housing` に件数枠：2件・「当社が独自に集計したものです」・媒体名なし。
  - `/admin/bukken/rental-survey` は 200。
- 取込画面の操作（ログインが要る）は、本番反映後に浦松の画面で確認する。

## 8. 残件

1. Vercel の Production に `RENTAL_SURVEY_PUBLIC_SCOPES=bunkyo-rent-pet:1`（浦松）。この PR のマージより前に設定すれば、マージ時の自動デプロイで反映される。
2. 保存期間とバッチの削除（U-4）は未定のまま。
3. 号室の無い住戸（戸建てなど）は確認待ちとして除外される。そのため、大型犬の件数は少なく出る。
4. 確定が止まると、前回の件数が観測期間つきで出続ける。何週まで出すかの上限は決めていない。
