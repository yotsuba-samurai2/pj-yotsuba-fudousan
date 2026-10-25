# 問い合わせ元custom intentの許可リスト（unit27）

既存の`contactIntentParam`はURL queryを英数字/ハイフンの形だけで検査しており、氏名のローマ字表記・電話番号・顧客ID等も`contact_submit`のcustom intentへ通った。既知の相談カテゴリ/静的CTA、20学区の特集・賃貸・売買導線だけを明示した許可リストへ変更した。未指定はnone、未知はother。フォームのカテゴリ選択・本文プリセット・受付処理には変更を加えていない。

20学区のcatalogと相談カテゴリとの整合、未知suffix/個人識別子/余白/大文字・制御文字、gtagに渡すcustom parameterを合成試験で照合。address境界データをclient bundleへ入れないため、学区slugの許可リストは小さい独立定義とし、catalogと照合する試験を置く。新しい学校/CTAを追加した場合は明示レビューが必要で、未知の値が自動でanalytics dimensionへ追加されることはない。

今回の独立レビューは対象8試験を成功。ブラウザ操作やGA4への実送信ではない。URLSearchParamsによってdecodeされた既知値は従来通り既知値として扱う。

## 効果測定の残条件

これはM03のevent辞書・CRM連結を実装したものではない。現行ContactFormの`contact_submit`は正常な受付番号の応答を確認した後の**ブラウザ側イベント**であり、永続受付数・CRM受信数・受任数の正本とは別。再送/二重観測や計測拒否による差を推定で埋めない。受付番号やidempotency keyをanalyticsへ送って連結しない。

コードから確認できた意味を以下に固定し、実績件数の読取りは行っていない。

| 現行の根拠 | 確認できる段階 | これだけでは確認できないこと |
|---|---|---|
| `LineLink`のcta_line_click、ContactCtaの各line click | LINE導線のクリック（LineLinkは/lineへの入口） | LINEのメッセージ送信・受付・受任 |
| `TelLink`のcta_tel_click、各phone click | 電話リンクのクリック | 通話成立・相談受付・受任 |
| `ContactForm`のcontact_submit_error | クライアントが認識したvalidation/server/networkエラー | 通信切断時のDB保存の有無 |
| `ContactForm`のcontact_submit | 正常な受付番号の応答をブラウザが確認 | 独立した受付の増分。冪等再送でも同じ受付番号を返し得る |
| `api/contact`と既存contact-receipt試験 | 保存後に受付番号を返す契約、冪等keyによる再照合 | 実DBの件数・CRM受信・別物件成約の帰属 |
| 通知のsent/failed | 通知送信処理の結果 | CRMの受信・担当者確認・契約成立 |

したがって、上記段階を一つの「反響数」へ合算する仕様は追加しない。受任の定義、別物件成約の扱い、CRM側の正式event、観察期間/最低分母は引き続き確認待ち。

GoogleAnalyticsの自動page_view/履歴計測、page_location/page_referrer等のURL全体、他custom parameter、外部tag設定は今回の保護範囲外。queryに自由入力を含めない導線設計と計測全体の照合は別作業。今回の変更だけでGA4全体の機密保護完了と呼ばない。旧regexで集計されていた未登録campaign intentはotherになるため、導入時に指標定義の変更として記録する。

GA4・DB・CRM・媒体には接続せず、設定や本番の計測値は変更していない。受入追跡55部分/16未検証は変更しない。
