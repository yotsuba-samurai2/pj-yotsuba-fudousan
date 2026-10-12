# コラム生成・レビュー・公開判定（2026-10-12）

- 生成・機械検証：成功 6本
- レビュー処理：success ／ 判定：false
- レビュー指摘：blocker 0／major 6／minor 0
- 今回の候補指紋に対応する公開証跡登録：0本
- 自動公開の品質候補：0本
- 品質保留：6本 ／ 公開日待ち：0本
- 未確認の一次資料：12件
- 本番公開：この処理では実行していません。公開済み件数は未照会です。

正午の自動公開に渡せる品質候補は0本です。6本は保留、0本は公開日待ちです。
未確認記事の品質保留はforceでも解除しません。

## 記事別の判定

- 産後ケア（宿泊型）を始めるときの物件・施設基準は？母子保健法の実施基準と内見のチェックポイント：held（realestate:sango-care-shukuhakugata-bukken-shisetsu-kijun-boshihokenho）
  - 公開レビュー記録が未登録または重複しています
  - 独立レビューに未解決の重大な指摘があります
  - 未確認一次資料：https://laws.e-gov.go.jp/law/340AC0000000141 — 母子保健法17条の2の統合条文・最終改正／施行履歴
  - 未確認一次資料：https://laws.e-gov.go.jp/law/325AC0000000201 — 用途変更の200平方メートル基準・2019-06-25施行と現在の用途規制
  - 未確認一次資料：https://laws.e-gov.go.jp/law/323AC0000000205 — 医療法2条の助産所の定義・9人以下
  - 未確認一次資料：https://laws.e-gov.go.jp/law/336CO0000000037 — 消防法施行令の現在の区分・設備条件
- 相続した実家に住宅ローンが残っていたら？抵当権の抹消と残債・団信・売却の進め方：held（realestate:souzoku-jikka-juutaku-loan-zansai-teitouken-massho-baikyaku）
  - 公開レビュー記録が未登録または重複しています
  - 独立レビューに未解決の重大な指摘があります
  - 未確認一次資料：https://laws.e-gov.go.jp/law/129AC0000000089 — 896条・915条・921条・939条の権利義務承継・熟慮期間・単純承認・放棄
  - 未確認一次資料：https://www.moj.go.jp/MINJI/minji05_00565.html — 相続登記の施行日・3年期限・過料の代替一次資料
  - 未確認一次資料：https://laws.e-gov.go.jp/law/416AC0000000123 — 修正済み不動産登記法60条・76条の2の現行統合条文・施行履歴。正しい法令IDを再取得した応答も本文0行であり、取得済みとして承認しない。
- 高度管理医療機器の販売・貸与許可｜店舗要件と営業所管理者：held（legal:kodo-kanri-iryokiki-hanbai-kashidashi-kyoka-tenpo-kanrisha）
  - 公開レビュー記録が未登録または重複しています
  - 独立レビューに未解決の重大な指摘があります
  - 未確認一次資料：https://laws.e-gov.go.jp/law/335AC0000000145 — 薬機法39条・39条の2・39条の3と6年更新の現行条文
  - 未確認一次資料：https://laws.e-gov.go.jp/law/336M50000100001 — 施行規則162条・168条の現在の条文
- 清算型遺言で不動産を売って分ける｜書き方と遺言執行の流れ：held（legal:seisan-gata-yuigon-fudosan-kanka-bunpai-yuigon-shikkou）
  - 公開レビュー記録が未登録または重複しています
  - 独立レビューに未解決の重大な指摘があります
  - 未確認一次資料：https://laws.e-gov.go.jp/law/129AC0000000089 — 民法1012～1015条、共有251／252条、遺留分等の現在の統合条文と2019年改正施行履歴。取得応答は本文0行、全員同意の一律断定は4言語で限定済みだが最新要件は未照合。
- 自動車教習所の指導員・検定員の労働時間は。繁忙期の36協定と変形労働時間制：held（labor:jidosha-kyoshujo-shidouin-kenteiin-roudoujikan-hanbokibi-36kyotei-henkei）
  - 公開レビュー記録が未登録または重複しています
  - 独立レビューに未解決の重大な指摘があります
  - 未確認一次資料：https://laws.e-gov.go.jp/law/322AC0000000049 — 労基法の現在の統合条文
- 学習塾・予備校講師のコマ給は要注意。授業外労働の労働時間管理：held（labor:gakushujuku-yobiko-koshi-koma-kyu-jugyogai-roudoujikan-kanri）
  - 公開レビュー記録が未登録または重複しています
  - 独立レビューに未解決の重大な指摘があります
  - 未確認一次資料：https://laws.e-gov.go.jp/law/322AC0000000049 — 労基法32・34・37・24条の現在の統合条文

## レビューの指摘

- [major] scripts/realestate-columns/115-sango-care-shukuhakugata-bukken-shisetsu-kijun-boshihokenho.md：PA-10：産後ケアの確認表示は実取得範囲へ限定されたが、用途変更・医療法・消防・自治体追加条件の重要未確認が残る。原稿誤りの確定とは別に公開を保留する。 母子保健法17条の2・建築基準法87条・医療法2条・消防法施行令の現行統合条文、最終改正番号・全施行履歴は未取得／未照合。国ガイドライン・2020年事務連絡で確認できた範囲と分けて保留する。 ／ 修正案：重要な主張を現在の一次本文と所管・資格者で照合し、面積・用途・消防・医療の適用を確定するまでprimarySources／legalClaims=holdを維持する。
- [major] scripts/realestate-columns/116-souzoku-jikka-juutaku-loan-zansai-teitouken-massho-baikyaku.md：PA-11：空き家控除上限と法令IDは修正されたが、民法・相続登記・団信約款・任意売却の現在の条件と個別適用は確認未完了。 民法896・915・921・939条と正しい不動産登記法ID416AC0000000123の現行統合条文・全改正施行履歴は未取得／未照合。取得失敗を法的誤りと断定しない。 ／ 修正案：司法書士・弁護士・金融機関・税理士が現在の原資料と事案を確認し、登記・承認／放棄・約款・税特例を検証するまでholdを維持する。
- [major] scripts/legal-columns/109-kodo-kanri-iryokiki-hanbai-kashidashi-kyoka-tenpo-kanrisha.md：PA-12：品目別の管理者資格は本文・FAQ・導入に修正されたが、現行薬機法等の統合条文、許可更新・設備・個人適格の確認は未完了。 薬機法39条等・施行規則162／168条・薬局等構造設備規則4条の現行統合条文と全改正施行履歴は未取得／未照合。許可更新6年等の条文主張を取得済みとして承認しない。 ／ 修正案：現行薬機法・規則と申請先基準を所管／行政書士等が確認し、資格・設備・更新・費用を検証するまでholdを維持する。
- [major] scripts/legal-columns/110-seisan-gata-yuigon-fudosan-kanka-bunpai-yuigon-shikkou.md：PA-13：契約と登記の順序、共有同意の限定、税FAQの留保は整合したが、清算型固有の登記・課税と現行民法／施行履歴は確認未完了。 民法1012～1015条、共有・遺留分等の現行統合条文と2019年改正の施行履歴は未取得／未照合。権限・遺言の効力・行為別同意要件は資格者確認待ち。 ／ 修正案：現在の民法と固有の登記／課税一次資料を司法書士・税理士・弁護士が照合し、確認済みの一般NTA資料を超えた断定を承認しない。
- [major] scripts/labor-columns/149-jidosha-kyoshujo-shidouin-kenteiin-roudoujikan-hanbokibi-36kyotei-henkei.md：PA-14：刑名・休憩英訳、特別条項とFAQ2は修正されたが、現行施行規則／全改正履歴と事業場別の制度・割増・休日適用は確認未完了。 厚労省掲載の労基法本文・栃木労働局の説明・2010年改正説明・2017年ガイドラインで記載範囲を確認したが、e-Gov統合条文との全件照合、施行規則12条の4の現在の全文と全改正施行履歴は未検証。 ／ 修正案：現行施行規則・施行履歴と事業場の予定／実績を社会保険労務士・所管で照合し、制度選択と割増／休日算定を確認するまでholdを維持する。
- [major] scripts/labor-columns/150-gakushujuku-yobiko-koshi-koma-kyu-jugyogai-roudoujikan-kanri.md：PA-15：404リンクと取得済み表示は修正されたが、1985年報告・判決本文・固定残業代・最低賃金算入と労働者性の説明には重要未確認が残る。 厚労省の2017年ガイドライン本文で一般的な指揮命令下・準備／待機等と記録原則を確認したが、1985年労働基準法研究会報告と最高裁判決の実本文は未取得／未照合。現行統合条文・全改正施行履歴の全件照合も未了。 ／ 修正案：報告・判決の一次本文と現行規定を資格者が確認し、固定残業代／最低賃金計算と報酬の労働者性指標を検証または限定するまでholdを維持する。

実行証跡：https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/pull/481
