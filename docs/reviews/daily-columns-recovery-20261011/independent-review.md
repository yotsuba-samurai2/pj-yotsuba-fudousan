# Daily Columns 復旧独立レビュー（2026-10-11）

**結論：content pass=false。6記事すべてを公開保留する。** コード変更については、検証した範囲で修正必須の blocker／major／minor を認めなかった。本文の未確認一次根拠を承認に変えず、Draft PRに保留理由を残す。

独立レビュアーは編集者と別のコンテキストで、Issue 479、run 38070703682、main `8571b0eeab9b501f35b090b5805a1e8b5a8e50c9` を基準に確認した。リポジトリは編集せず、本JSONと本Markdownのみ作成した。ブラウザー操作、マージ、公開、秘密設定、課金追加、認証変更は行っていない。

## 記事・指紋・確認範囲

`.tmp/quality-candidates.json` の6件と各 `.tmp/quality-review-input/<business>-<slug>.json` の全24言語版（タイトル・導入・本文・FAQ各4問）を読んだ。本文の固有論点、業際、分離受任、内部リンクの言語、法令・数値、既存記事との意図を比較した。企画理由は `../evidence/plan-approved/plan.json` を読んだ。

実装の `columnQualityFingerprint` で再計算し、6件すべて「candidate=完全入力=実原稿」の指紋一致を確認した。18翻訳の `mismatchedTranslationLinks` は全件0。legal2記事×3翻訳の内部リンクは各7本、計42本でlocale prefixが一致する。日本語6本・その他の翻訳12本は復旧承認範囲に従い内容維持。リンク修正を法令承認と同一視しない。

| 記事key | primarySources | duplicateIntent | legalClaims | translationAlignment | 資格者確認 |
|---|---|---|---|---|---|
| `realestate:net-cafe-manga-kissa-koshitsu-bukken-fuei-shinya` | hold | pass | hold | hold | true |
| `realestate:souzoku-akiya-bank-touroku-baikyaku-nochi-mitouki` | hold | pass | hold | hold | true |
| `legal:shurui-seizo-menkyo-craft-beer-doburoku-shinsei` | hold | pass | hold | hold | true |
| `legal:seisangata-izo-yuigon-kanka-baikyaku-shikkosha` | hold | pass | hold | hold | true |
| `labor:shurui-jozosho-kaigyo-roumu-henkei-anzeneisei` | hold | pass | hold | pass | true |
| `labor:tokutei-ginou-jidosha-unso-driver-ukeire-kaizenkijun-roumu` | hold | pass | hold | pass | true |

translationAlignmentのholdは不動産・法務4本の組織固有名の表記、および清算型遺贈英訳の期限起算の脱落による。その他の主要な本文・FAQの意味対応は確認できた。清算型遺贈の売買／登記の矛盾は日本語を含む4言語共通でlegalClaimsのmajor。6件とも重大な根拠不足があるためrequiresQualifiedReview=trueとした。資格者確認を取得した証跡はなく、AIの判断で置換しない。

- `realestate:net-cafe-manga-kissa-koshitsu-bukken-fuei-shinya`: `7cfcb4c2d014e2d883b6792315f7e1089af912514c1fe086ad9f4be6cafb9256`
- `realestate:souzoku-akiya-bank-touroku-baikyaku-nochi-mitouki`: `f3ea7db94ab2c9d3dcc9bdbfc6b3d241d961a627f9103c74d30f3fd4505907f0`
- `legal:shurui-seizo-menkyo-craft-beer-doburoku-shinsei`: `7ae7c5b39fbea99e9fa34003bf5098959bf66cf9195401d39472352afbfda1c0`
- `legal:seisangata-izo-yuigon-kanka-baikyaku-shikkosha`: `3e9d6652c42e940e8537a29bf29a5f9c2bc5fd73bc52e1622ce7d306a9f94b78`
- `labor:shurui-jozosho-kaigyo-roumu-henkei-anzeneisei`: `7778b25db90bef0dbc06c684beed1a96afdfb1e5287cf16c5a52334a98cd409c`
- `labor:tokutei-ginou-jidosha-unso-driver-ukeire-kaizenkijun-roumu`: `dcb1da6029235b1b17e33a4e076e199e09f4d1bb7822a99be85d757237e05268`

## 内容上の指摘

### major：清算型遺贈の契約成立と移転登記の混同

`scripts/legal-columns/110-seisangata-izo-yuigon-kanka-baikyaku-shikkosha.md` の換価節（22行）、登記節（33行）とFAQ2（68行）が矛盾する。4言語の同じ箇所に残っている。

| 言語 | 換価節 | 次の登記節 | FAQ2 |
|---|---|---|---|
| ja | 死者名義のままでは第三者へ売ることはできません。 | 売買契約自体は、相続登記の完了を待たずに遺言執行者と買主の間で結べるのが通常 | 死者名義のままでは第三者へ売れないため |
| en | property cannot be sold to a third party while registered in the deceased's name. | The sale contract itself can usually be concluded between the executor and buyer without waiting for the inheritance registration to complete | Property cannot be sold to a third party while in the deceased's name |
| zh-tw | 惟以死者名義不得向第三人出售。 | 買賣契約本身通常不待繼承登記完成即可於執行者與買方間締結 | 以死者名義不得向第三人出售 |
| zh | 惟以死者名义不得向第三人出售。 | 买卖契约本身通常不待继承登记完成即可于执行者与买方间缔结 | 以死者名义不得向第三人出售 |

「売れない」が契約の成立を指すのか、買主への移転登記を指すのかが一致しない。現行法の当てはめをAIで確定した指摘ではなく、原稿内部で確認できる混同である。司法書士／弁護士に前提を確認して、本文・FAQを4言語同時に整理する必要がある。原稿維持という今回の承認範囲に従い修正は行わず、公開前のDraft PR保留事項とする。

### major：6本の現行一次根拠不足

- ネットカフェ：旅館業法・風営法の現行条文を取得できず、10ルクス／5平方メートル、東京都条例の本人確認・記録保存、消防基準は未完了。警視庁の10日前届出・図面案内と厚労省の2021年調査による総合判断の説明は実際に読めた範囲だけ確認済み。
- 空き家バンク：国交省の全国版案内は確認できたが、空家法・登記法・農地法の現在の要件と自治体ごとの登録要件は未完了。追加で国税庁No.3306を取得して最大3000万円等の一般説明は確認できた。個別適用は税理士へ留保される。
- 製造免許：国税庁免許入口が404。特区手引は取得できたが2016年4月版で旧条番号・旧刑名を含む。現行の第25条、60／6kL、拘禁刑を含む拒否要件を承認できない。
- 清算型遺贈：国税庁No.2022で準確定申告の所得範囲と翌日起算4か月は確認できた。執行権限・相続人全員を経る登記と死亡後換価の所得帰属には別の現行一次根拠が必要。
- 醸造所労務：年間変形10／52／280・月42／年320、36協定、社会保険人数要件と安全衛生職種の選任・報告要件が未完了。特に本文・FAQ3は安全衛生推進者を含め一律に「14日以内に選任・監督署報告」と記載する。現行一次根拠を取得できていないため、誤りの確定ではなく職種別の報告義務を資格者が確認すべき保留事項とする。
- 自動車運送特定技能：分野別要件と改善基準告示の資料が取得不能。一般の外国人雇用届出の総合案内が読めても、3300／284／13・11／9時間、免許・日本語・試験の根拠確認に代用しない。

上記はJSONにも記事別majorとして記録した。e-Govの各取得応答は本文0行で、URLが存在することを法令本文の取得と扱わなかった。最終改正番号・施行日履歴の網羅照合は未完了。元runの「確認済み」表現や未確認sourcesを自動追認していない。

### minor：翻訳と農地FAQの精度

- 不動産・法務4本の繁体／簡体は組織名を翻訳している。例は「四葉不動產株式會社」「四葉社會保險勞務士事務所」「四叶行政书士事务所」。`AGENTS.md` 188行とSEO skillの日本語固有名表記要件と一致しない。労務2本は全言語で日本語名を維持する。
- 清算型遺贈英訳の準確定申告期限では「知った日の翌日」の翌日が落ちる。国税庁No.2022の14・38行と日本語／繁体／簡体は翌日起算を示す。
- 空き家バンクFAQ3の「畑をそのまま売る」という問いに対する市街化区域内の届出例外は、転用と農地のままの権利移動の区別を明示すべき。取得した[農水省の転用概要](https://www.maff.go.jp/j/nousin/noukei/totiriyo/attach/pdf/nouchi_tenyo-29.pdf)58–59行は転用についての届出を説明する。

いずれも今回の原稿維持範囲では修正せず、公開前の保留としてJSONに記録した。

## 既存記事との意図比較

比較は候補のslug一致だけでなく、次の既存日本語MDの本文を読んで行った。既存資料の本文にある法令・数値そのものを新規候補の根拠として承認してはいない。

| 新規記事 | 読んだ既存記事 | 分離できる主要意図 |
|---|---|---|
| ネットカフェ | 不動産113 `karaoke-box-tenpo-bukken-youto-shoubou-soon`、63 `ryokangyo-hotel-eigyo-bukken-youken` | 端末営業条例、個室・照度・宿泊実態。カラオケ用途・音響や通年宿泊施設を探す意図と分離 |
| 空き家バンク | 不動産25 `souzoku-akiya-kaitai-koyatsuki-dochira`、15 `souzoku-nochi-baikyaku-kashidashi-nagare` | バンク登録と媒介・農地・未登記の入口整理。解体／現況売却比較や農地制度そのものと分離 |
| 製造免許 | 法務48 `shurui-kouri-menkyo-tenpo-bukken-yoken`、27 `shinya-shurui-teikyo-todokede-yoken` | 製造場・品目別製造免許と数量基準／特区。小売・EC／深夜酒類提供の手続と分離 |
| 清算型遺贈 | 法務63 `tokutei-zaisan-shokei-yuigon-izo-chigai`、34 `yuigon-shikkosha-shokumu-sennin-dare` | 換価後の金銭分配、換価権限・売れ残り・税務の整理。現物承継比較や執行者一般と分離 |
| 醸造所労務 | 労務103 `inshokuten-kaigyo-roumu-shinya-shift-minashi` | 季節製造の年間変形と製造業の安全衛生体制。飲食の深夜割増・シフト・固定残業代と分離 |
| 自動車運送特定技能 | 労務84 `unso-2024-mondai-kaizen-kijun-kokuji`、73 `kaigo-tokutei-ginou-gaikokujin-roumu-shakaihoken` | 運送分野の特定技能受入れ・試験・運転免許と運転者労務。既存運送2024年問題一般や介護受入れと分離 |

これらの比較と承認済みplanの企画理由が対応するためduplicateIntent=pass。ただし検索意図の評価は比較対象記事の範囲に基づく。

## 業際と分離受任

全24言語版で、宅建の媒介・物件整理、行政書士の申請書類、社会保険労務士の労務、司法書士の登記、土地家屋調査士の表題登記、税理士の税務、弁護士の紛争、建築・消防等の担当を分ける記述を確認した。行政機関との相談を民間受任と分け、事業体の独立・別契約・直接請求／直接入金、紹介料なしの趣旨を保持する。一括受任を求める新規記述は認めなかった。具体的な許認可・税務・登記判断を資格者へ留保する文章はあるが、それだけで未検証の数値・法的断定をpassにはしない。

適用したskillは[shigyo-compliance-gate](skill://user/6aa71b28329081918bc0506ab9426540/shigyo-compliance-gate/SKILL.md)と[luck428-column-seo](skill://user/6aa71b2832808191811bb4d7a0fda08a/luck428-column-seo/SKILL.md)。本レビューは公開・法的判断の承認ではなく、公開前に資格者が確認すべき箇所を残す。

## コードレビュー

最終差分（完全入力artifactの追加を含む）を再読した。現在の変更範囲で、検証済みの修正必須コード指摘は **0件**。

- `.github/workflows/daily-columns.yml`：max-turnsを50から80へ拡張し、固定候補と1記事1JSONから4言語全文を読むよう指定する。未追跡の新規MDをgit diffだけで探す問題を避けられる。許可Bashをgit diff/log/statusに限定する指示はallowedToolsと整合。review入力ディレクトリも既存quality artifactへ追加され、モデル呼出しは増えない。
- `scripts/columns-review-proof.ts`：新規未追跡原稿を含む生成seed inventoryから変更候補を抽出し、同じ指紋とarticle全文のpacketをprepareで作る。公開承認の生成ではなく閲覧入力の準備。record時の完全性・指紋照合は維持される。
- `src/lib/columns-autopublish-quality.ts`：従来のlocale検証を共通関数に抽出したもので、公開ゲートの検証意味は変わらない。相対URL・luck428.comの絶対URLとURL正規化後のpathを確認し、アンカー・画像・公的一次情報の外部リンクを除外する。
- `scripts/seed-souzoku-legal-columns.ts`：2026-10-10以降の新規原稿の3翻訳にも同じlocale検証を導入する。過去原稿の従来表記は維持。新規2記事の定義・必須hub・業際定型句が準備／検証に含まれる。
- 回帰テスト2ファイル：実CLIの隔離fixtureで完全packetと指紋を確かめ、旧日付の維持、3localeの誤リンク拒否、正prefix、path traversal、外部リンク・画像・アンカーを検証する。ProcessEnv型の修正も確認した。
- 安全停止：reviewがfailure／unknown／cancelledのときfixへ進まない条件と回帰テストを確認。独立レビューのglobal pass=false／major、記事checks=hold、未確認一次資料、資格者不足は承認記録へ変換できない既存ゲートを確認した。

独立実行：`vitest run columns-daily-locale-links.test.ts columns-review-proof-workflow.test.ts columns-autopublish-quality.test.ts columns-autopublish-review-record.test.ts` の4ファイル39テストが成功。入力artifact追加後に同じ対象を再実行し、4ファイル39テスト成功（5.03秒）を確認した。親から全147ファイル1990テスト・tsc・eslint 0 error・build成功の報告あり。本レビュアーは全体テストを独立再実行していない。

JSONは実装のrecordIndependentColumnReviewsへ読み取り専用のメモリ入力として渡し、スキーマ／6指紋一致を確認した。結果はreviews=0・held=6で、既存安全停止が維持されることを確認した。

残る運用上の限界：親からローカルHTTP確認はproxyの301循環／応答待ちで成立しなかったとの報告があり、ルートのHTTP応答確認を成功扱いしない。max-turns 80は完走保証ではない。現行一次情報の取得ができない場合は今回のようにholdで終了する必要がある。元のGitHub Actionに対する新しい無人実行の成功はこのローカルレビューでは確認していない。

## 一次情報の取得記録

検証日は全件2026-10-11。verified=trueは以下に記載したrelevantClaimだけを確認済みとし、資料ページ全体の現行法への適用を承認した意味ではない。本文0行、取得失敗、404、旧版の現行根拠不足はfalseにした。検索結果の抜粋だけで承認した資料はない。

| 記事番号 | URL | 判定 | 確認対象・限界 |
|---|---|---|---|
| 1 | [laws.e-gov.go.jp/law/323AC0000000138](https://laws.e-gov.go.jp/law/323AC0000000138) | 未検証 | 旅館業法第2条による寝具・宿泊の定義とネットカフェへの適用。取得応答は本文0行で条文・現行施行履歴を確認できなかった。 |
| 1 | [laws.e-gov.go.jp/law/323AC0000000122](https://laws.e-gov.go.jp/law/323AC0000000122) | 未検証 | 風営法第2条の低照度10ルクス以下・区画席5平方メートル以下等の要件。本文0行で現行条文を確認できなかった。 |
| 1 | [www.keishicho.metro.tokyo.lg.jp/tetsuzuki/other/internetcafe/internetcafe_kaishi.html](https://www.keishicho.metro.tokyo.lg.jp/tetsuzuki/other/internetcafe/internetcafe_kaishi.html) | 確認済み（記載範囲限定） | 営業開始10日前・店舗ごとの届出と、個室・端末位置等を記載する平面図。更新2022-06-23の本文を取得して確認。本人確認・記録保存の全要件や現行条例の全施行履歴までを承認するものではない。 |
| 1 | [es.city.yokohama.lg.jp/business/bunyabetsu/shobo-kyukyu/kanri/shobo-setsubi.files/0013_20190227.pdf](https://es.city.yokohama.lg.jp/business/bunyabetsu/shobo-kyukyu/kanri/shobo-setsubi.files/0013_20190227.pdf) | 未検証 | 個室型店舗等の防火対象物区分・消防設備基準。資料本文を取得できなかった。 |
| 1 | [www.mhlw.go.jp/content/11130500/000824221.pdf](https://www.mhlw.go.jp/content/11130500/000824221.pdf) | 確認済み（記載範囲限定） | 2021年3月の自治体調査資料では、ソファ・寝具、料金、営業実態等を踏まえ宿泊該当性を総合判断する例が示される。3ページの本文を取得した。現行法令の網羅検証とは区別する。 |
| 2 | [laws.e-gov.go.jp/law/426AC1000000127](https://laws.e-gov.go.jp/law/426AC1000000127) | 未検証 | 管理不全空家等への勧告と住宅用地特例の関係、令和5年改正。本文0行で現行条文を確認できなかった。 |
| 2 | [www.mlit.go.jp/totikensangyo/const/sosei_const_tk3_000131.html](https://www.mlit.go.jp/totikensangyo/const/sosei_const_tk3_000131.html) | 確認済み（記載範囲限定） | 全国版バンクは自治体が公開する情報を横断検索し、参加・登録の扱いは自治体運用による。国の説明本文を取得した。各自治体の登録要件や媒介契約要件までは検証していない。 |
| 2 | [houmukyoku.moj.go.jp/osaka/souzokutoukigimuka.html](https://houmukyoku.moj.go.jp/osaka/souzokutoukigimuka.html) | 未検証 | 相続登記義務化・2024年4月1日施行・3年期限。資料本文を取得できなかった。 |
| 2 | [laws.e-gov.go.jp/law/327AC0000000229](https://laws.e-gov.go.jp/law/327AC0000000229) | 未検証 | 農地法第3条・第4条・第5条の権利移動と転用の許可／届出の区別。本文0行で現行条文を確認できなかった。 |
| 2 | [laws.e-gov.go.jp/law/416AC0000000123](https://laws.e-gov.go.jp/law/416AC0000000123) | 未検証 | 相続登記第76条の2・未登記建物の登記順序。本文0行で現行条文を確認できなかった。 |
| 2 | [www.nta.go.jp/taxes/shiraberu/taxanswer/joto/3306.htm](https://www.nta.go.jp/taxes/shiraberu/taxanswer/joto/3306.htm) | 確認済み（記載範囲限定） | 令和8年4月1日現在の国税庁説明：一定要件で最大3000万円、相続人3人以上は2000万円、売却期限等の条件。本文を取得した。銀行登録のみで適用される制度ではない。 |
| 2 | [www.maff.go.jp/j/nousin/noukei/totiriyo/attach/pdf/nouchi_tenyo-29.pdf](https://www.maff.go.jp/j/nousin/noukei/totiriyo/attach/pdf/nouchi_tenyo-29.pdf) | 確認済み（記載範囲限定） | 農水省現掲載の転用制度概要1ページ：市街化区域では農業委員会への届出で転用可能（58–59行）。農地のままの権利移動の許可を免除する根拠ではない。 |
| 3 | [laws.e-gov.go.jp/law/328AC0000000006](https://laws.e-gov.go.jp/law/328AC0000000006) | 未検証 | 酒税法第7条・第10条の製造場／品目別免許、ビール60kL・その他醸造酒6kL、拒否要件。本文0行で現行条文を確認できなかった。 |
| 3 | [www.nta.go.jp/taxes/sake/menkyo/index.htm](https://www.nta.go.jp/taxes/sake/menkyo/index.htm) | 未検証 | 製造免許の要件・審査・手引／様式。国税庁404ページへ転送され、本文記載の「確認」を追認できない。 |
| 3 | [laws.e-gov.go.jp/law/414AC0000000189](https://laws.e-gov.go.jp/law/414AC0000000189) | 未検証 | 構造改革特別区域法第25条、特定農業者の濁酒製造と数量基準特例。本文0行で現行条文を確認できなかった。 |
| 3 | [www.nta.go.jp/taxes/sake/menkyo/tebiki/menkyo2.pdf](https://www.nta.go.jp/taxes/sake/menkyo/tebiki/menkyo2.pdf) | 未検証 | 39ページの手引は取得できたが2016年4月版で、旧条番号第28条・旧刑名を含む。特区の対象者・自己の営業場の一般説明は一致するものの、2026年現行の第25条・拘禁刑の拒否要件を検証できないためverified=false。 |
| 4 | [laws.e-gov.go.jp/law/129AC0000000089](https://laws.e-gov.go.jp/law/129AC0000000089) | 未検証 | 民法第1012条・第1013条・第1014条・第1046条の執行権限／遺留分と2019年施行改正。本文0行で現行条文を確認できなかった。 |
| 4 | [laws.e-gov.go.jp/law/340AC0000000033](https://laws.e-gov.go.jp/law/340AC0000000033) | 未検証 | 所得税法第124条・第125条、死亡後換価による譲渡所得の帰属を含む当てはめ。本文0行で現行条文を確認できなかった。 |
| 4 | [www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2022.htm](https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2022.htm) | 確認済み（記載範囲限定） | 令和8年4月1日現在の国税庁説明：死亡日までに確定した所得を相続人等が準確定申告し、相続開始を知った日の翌日から4か月以内に申告・納税。本文14・38行で確認。死亡後換価の所得帰属や登記順序はこのページの確認範囲外。 |
| 4 | [laws.e-gov.go.jp/law/416AC0000000123](https://laws.e-gov.go.jp/law/416AC0000000123) | 未検証 | 不動産登記法第76条の2と売却前の登記順序／相続人全員を経る説明。本文0行で現行条文を確認できなかった。 |
| 5 | [laws.e-gov.go.jp/law/322AC0000000049](https://laws.e-gov.go.jp/law/322AC0000000049) | 未検証 | 労基法第32条・第32条の4と施行規則第12条の4の1日10時間・1週52時間・年280日・連続労働日数、年間変形の月42／年320時間限度。本文0行で条文・規則の現行要件を確認できなかった。 |
| 5 | [www.mhlw.go.jp/content/001309313.pdf](https://www.mhlw.go.jp/content/001309313.pdf) | 未検証 | 時間外労働の45／360時間・特別条項720時間と年間変形42／320時間。PDF本文を取得できなかった。 |
| 5 | [laws.e-gov.go.jp/law/347AC0000000057](https://laws.e-gov.go.jp/law/347AC0000000057) | 未検証 | 安全管理者・衛生管理者・安全衛生推進者の規模、14日選任と各職種の監督署報告義務。本文0行で現行条文／施行規則を確認できなかった。 |
| 6 | [www.moj.go.jp/isa/policies/ssw/index.html](https://www.moj.go.jp/isa/policies/ssw/index.html) | 未検証 | 特定技能自動車運送業の試験・運転免許・日本語・支援計画の現行要件。制度本文を取得できなかった。 |
| 6 | [www.mlit.go.jp/jidosha/jidosha_tk3_000001_00006.html](https://www.mlit.go.jp/jidosha/jidosha_tk3_000001_00006.html) | 未検証 | トラック／バス／タクシーごとの受入要件・安全教育。分野の本文を取得できなかった。 |
| 6 | [www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/kaizen/index.html](https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/kaizen/index.html) | 未検証 | 2024年4月1日適用の年3300・月284・日13時間、休息11時間基本／9時間下限と例外。本文を取得できなかった。 |
| 6 | [www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/gaikokujin/](https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/gaikokujin/) | 確認済み（記載範囲限定） | 外国人雇用施策総合ページの「外国人雇用状況の届出はすべての事業主の義務です」という案内と届出詳細へのリンクを本文で確認（288行）。労働施策総合推進法第28条の全文・適用除外・届出期限等まで確認したものではない。 |

JSONには6件すべての最新指紋、sources、checks、blockingFindingsと内容指摘を記載した。内容上の矛盾・根拠不足は今回の復旧で勝手に直さず、公開前の保留事項として保持する。
