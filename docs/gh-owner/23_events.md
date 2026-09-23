# GA4 イベント一覧（Step 3・第6章 6-2）

指示書 6-2 は「既存のイベント名の規約があればそれに合わせる」としている。既存の規約（`src/lib/gtag.ts`・`CtaBandActions`・`LineLink`・`TelLink`・`ContactForm`）に合わせ、**イベント名は既存のものを使い、ページ固有の識別はパラメータで行う**。既存のキーイベント（`contact_submit`・`cta_line_click`）の集計を分断しない。

| 指示書のイベント | 実装するイベント名 | 送るとき | パラメータ |
|---|---|---|---|
| `cta_click`（→ `#form`） | `cta_contact_click` | CTA①②③の「物件情報を送って相談する」クリック | `location: "gh_owner_hero" \| "gh_owner_mid" \| "gh_owner_footer"`, `page: "gh_owner"` |
| `line_click` | `cta_line_click` | `/line` へのクリック（CTA①②・フォーム内「LINE で図面を送る」・CTA③） | `location: "gh_owner_hero" \| "gh_owner_mid" \| "gh_owner_form" \| "cta_band"`, `page: "gh_owner"`（`cta_band` は既存部品のまま） |
| `tel_click` | `cta_tel_click` | `tel:` のクリック（信頼性ブロック・CTA③） | `location: "gh_owner_trust" \| "cta_band"` |
| `form_start` | `contact_form_start` | フォームの最初のフォーカス（1 回だけ）。GA4 の自動収集イベント `form_start` と名前を分ける | `business: "realestate"`, `form_id: "gh_owner"` |
| `form_submit` | `contact_submit` | 送信成功 | `business: "realestate"`, `category: "gh-owner"`, `source`（未回答は `"unanswered"`）, `intent: "gh-owner-page"`, `form_id: "gh_owner"`, `property_type`（種別のキー：`kodate` / `apart` / `mansion` / `akiya` / `tochi` / `other`） |
| `form_error` | `contact_submit_error` | 送信失敗 | `business: "realestate"`, `form_id: "gh_owner"`, `kind: "validation" \| "server" \| "network"` |
| `file_upload` | （Phase 2） | — | — |

規約（`gtag.ts`）：氏名・メール・電話・所在地・自由記述はパラメータに入れない。`property_type` は閉じた選択肢のキーのみ。

## 浦松の作業（GA4 管理画面）

- キーイベント：`contact_submit`（既に登録済みなら追加不要。`category = gh-owner` で絞る）・`cta_line_click`（`page = gh_owner` で絞る）。
- 探索レポート：`page = gh_owner` のイベントを `location` 別に並べると、ヒーロー・中間・末尾のどの CTA が押されているかが分かる。
- Search Console はコードでは何もしない（公開後の登録とクエリの確認）。
