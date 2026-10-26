# 確認記録の管理画面接続（unit57）

## 実装した接続

既存のローカル編集部品 `PropertyRequestEditor` に、任意の `mailReview` 設定で
`PropertyMailReview` を表示する接続を追加した。設定を渡さない既存の呼出しは従来のまま。
画面に渡すのは、サーバーで準備済みの物件ID・確認参照/hash・現在の操作者IDだけ。
本文・住所・画像・報酬や、クライアントの承認flagを確認記録として送らない。

クライアント側は `admin-api.ts` の `createBukkenMailReviewTransport` が既存Supabase `getSession` に接続し、
操作ごとに現在のUID/tokenを取得する。画面を開いた本人とUIDが異なる場合は送信を止める。
固定された同一originの対象物件pathへPOSTし、redirectは禁止。tokenは端末保存しない。
サーバー側の `createAdminMailReviewHandler` は既存 `verifyAdminRequest` を使い、
確認済みメールと既存管理者allowlistを検査してから本文を読む。DBサービスは明示的注入が必須。

`inspect` は本人の現在のread権限を検査し、物件lock内で確認記録と現在headを照合する。
応答は版/hash・active/revoked・期限のみ。record本文を返さず、期限切れ記録も読取り可能。
activeは現在の掲載許可を意味しない。物件反映時の採用・許諾・素材検査は既存writerに残る。

## 操作と再開

1. 画面の初回表示では現在headの読取りだけを行う。未解決要求が保存されている場合は、その要求の照合を優先する。
2. 登録・撤回の前に、要求ID・物件/確認参照/hash・操作・期待版/hashを端末のセッション保存へ書き、読戻しで確認する。
   保存不可・破損・別対象の混入なら処理を始めない。保存するのは要求参照だけで、patch・token・メール本文は含めない。
3. 二重クリックを同一sessionで抑止。不明な応答は元の要求を保持し、勝手に新要求や自動再送を作らない。
   サーバーが `RECEIPT_NOT_FOUND` を返した後だけ、本人の明示操作で同じ要求を再送できる。
4. 再表示では保存した要求を照合し、現在headも再読取りする。過去の登録receiptだけで「現在も利用可能」と表示しない。
5. 撤回は現在headの版/hashを要求へ固定する。古い版なら保留し、再読取り後の別の明示操作で新要求を作る。
   期限切れの記録も撤回できる。撤回済みでは撤回ボタンを出さない。
6. 物件・操作者・確認参照/hashが変わった画面は旧操作を隠し、開き直しを案内する。
   遅れて届いた旧要求の応答で、別物件の操作を再表示しない。

端末保存はタブごとのsessionStorageを想定した注入境界。試験ではメモリ内の同じget/set契約を使用。
別タブを横断する排他をこの保存領域で保証するものではなく、サーバーの要求ID・参照lock・CASが重複を防ぐ。
端末保存が失われた場合でもDBの監査は残る。別端末からの履歴検索や管理者代行撤回は未実装。

## 検証と未検証

- session・transport・認証境界と、React要素/callbackの試験で、二重操作、失応答、部品/状態の再生成、
  保存障害、古い版、権限不足、対象/本人切替、私有情報を含む不正応答を検証。
- 既存の管理者認証処理を実行する試験は、Supabase providerの応答だけを合成stubにしている。
- `--review-ui` は画面session→実transport→プロセス内Request/Response→既存HTTP handler→Prisma→隔離Postgresを通す。
  合成1物件、媒体2行、監査/受領/effect計9行。登録/撤回の失応答から新sessionで照合、同時要求のlock待機を確認。
- SQL harnessはHTTPサーバーやTCPポートを作らない。画面sessionの状態再生成は実ブラウザの離脱/再読込みの代替証明ではない。
- Chromeはunit40で `sandbox initialization failed: Operation not permitted` により停止したまま。
  今回はChrome起動、ウィンドウ作成、制限変更、別ブラウザへの切替を行わない。
  実DOMクリック・実sessionStorage・ブラウザ再読込み・見た目/アクセシビリティの実機確認は未実施。

## 本番との境界・次の作業

本番の `/admin/bukken/[id]/edit` は従来の `PropertyForm` のままで、今回のローカル編集部品へ切り替えていない。
transportの送信先に対応する `app/api/.../mail-review/*/route.ts` も未登録。DB接続の既定値や本番DDLの自動適用はない。
unit55の本番掲載や、実メール・ATBB・REINS・顧客通知を今回の検証で変更していない。

次に必要なのは、7根拠と準備記録の実際の確認・保存元を確定し、本人に見せる準備参照を安全に取得すること。
その後、専用role/RLSを含む本番DB案と対象1物件の限定試験を具体化し、本番route/画面を接続する。
本番schema/権限変更・実物件更新は具体的な対象SQL/保存範囲/復旧方法を提示して別承認。
実UIは、外部通信遮断とChrome自身の安全機構を両立できる正式な検証環境で行う必要がある。

関連：[登録・撤回の設計](mail-review-commands.md)、[ブラウザ隔離の拒否・診断履歴](ui-browser-isolation-proposal.md)。
