# 2026-10-12分 Daily Columns 一次資料・全文監査（第1段階）

**暫定結論：公開承認0件。初期原稿に確認できる誤り・不整合と重大な未確認があり、6記事の一次根拠／法的主張はhold。** 修正後の最終指紋レビューは未実施。本書とJSONは編集者への監査材料であり、自動公開用の承認記録ではない。

対象worktree：`/Users/uramatsujouji/Documents/Codex/2026-10-11/task/recovery-20261012`。初期原稿の基準：`d0dce295189e9458f5de08ceaddf24e5d44bc875`。2026-10-12分の別6記事を扱い、前日PR480の記事は承認も修正もしていない。初期seedの日付・本文確認日2026-10-11と、復旧対象日・独立確認日2026-10-12を区別する。原稿・コードは編集せず、本段階は `primary-audit.md/json` のみを作成した。

## 全文と企画の確認

日本語6本と翻訳18本、計24ファイルのタイトル・導入・本文・FAQ各4問を読んだ。日本語タイトル／導入はseedメタデータも読んだ。JSONに初期基準commitの24ファイルSHA256、パス、初期指摘と主張別判定を保存した。これは最終編集内容の公開用fingerprintとは別で、編集後は新しい完全入力から再レビューする。

最新cloudの[luck428-column-seo](skill://user/6aa71b2832808191811bb4d7a0fda08a/luck428-column-seo/SKILL.md) v2.9 と[shigyo-compliance-gate](skill://user/6aa71b28329081918bc0506ab9426540/shigyo-compliance-gate/SKILL.md) v1.1 を読み、業際・分離受任・固有名・locale・根拠を照合した。企画は `evidence-20261012/plan-approved/plan.json` の全文と比較した。

| 番号 | 記事 | 取得対象source数 | 限定主張のverified=true | 一次・法的主張暫定 | 重複意図 |
|---|---|---|---|---|---|
| 1 | `realestate:sango-care-shukuhakugata-bukken-shisetsu-kijun-boshihokenho` | 8 | 4 | hold | pass |
| 2 | `realestate:souzoku-jikka-juutaku-loan-zansai-teitouken-massho-baikyaku` | 5 | 2 | hold | pass |
| 3 | `legal:kodo-kanri-iryokiki-hanbai-kashidashi-kyoka-tenpo-kanrisha` | 8 | 6 | hold | pass |
| 4 | `legal:seisan-gata-yuigon-fudosan-kanka-bunpai-yuigon-shikkou` | 3 | 2 | hold | pass |
| 5 | `labor:jidosha-kyoshujo-shidouin-kenteiin-roudoujikan-hanbokibi-36kyotei-henkei` | 4 | 3 | hold | pass |
| 6 | `labor:gakushujuku-yobiko-koshi-koma-kyu-jugyogai-roudoujikan-kanri` | 6 | 2 | hold | pass |

官公庁ページの実本文を読むことで、産後ケア・医療機器・労基法・税の一般主張は一部裏付けられた。e-GovのURLから本文が返らないこと自体を条文の誤りとはしない。一方、取得した資料と明らかに違う人員基準・管理者の対象区分・旧刑名、原稿内部の登記と契約の時系列、404リンクは別に指摘する。公的総合案内だけで未取得の判例や個別税務の結論を検証済みにしない。

## 編集者へ先行報告した重点

1. 産後ケア：令和8年3月ガイドラインPDF14頁（本文11頁）に常時1名、PDF15頁（本文12頁）に短期入所の看護職1名以上・24時間配置。人員の国基準と、未確認の居室面積や自治体追加条件を分ける必要がある。
2. 同ガイドラインの入口から取得した国交省令和2年8月5日事務連絡PDF1頁は、母子保健法17条の2対象の短期入所施設（病院・診療所・助産所を除く。）を旅館業適用外・ホテル又は旅館に非該当とする。自治体事業外の私的サービスや医療法施設まで同じ扱いとせず、原稿の範囲を限定する。
3. 相続住宅ローン：4言語の登記法URL `116AC...` は平成16年の `416AC...` と一致しない。空き家控除は最高3000万円に加え、対象財産取得相続人3人以上の2000万円上限注記を揃える。
4. 医療機器：コンタクト等を主読者にしながらFAQの3年以上を一律に出さない。東京都取得本文は指定視力補正用レンズ等のみ1年＋対応講習、プログラムのみ別枠を示す。
5. 清算型遺言：今日の原稿は前日と異なり、「死者名義では売れない」対比をそのまま指摘していない。順序2に買主移転、順序3に買主探し・契約を置く今回の表の時系列を指摘。課税帰属と登記の実務は別途未検証でhold。
6. 教習所：厚労省の現行掲載法本文119条は拘禁刑。英訳の一斉休憩をall at once（分割しない）としている意味違いも指摘。
7. 塾：初回のキャッシュ表示を取得済みとせず、原稿4言語の対象リンクが追跡応答404であることを確認。代替本省PDFも取得不能のため指針・判例・1985年報告はhold。

産後ケアの限定表現の案：『母子保健法第17条の2第1項第1号に基づく短期入所施設（病院・診療所・助産所を除く。）について、国交省事務連絡は旅館業の適用外で、建築基準法のホテル又は旅館に該当しないと示す。自治体事業外のサービスや医療法施設を同じ扱いにせず、施設の実態と所管を確認する。』これは通知の範囲を明示する文案で、特定物件の法的判断ではない。

## 初期原稿の指摘一覧

以下は監査開始時の原稿に対する指摘であり、編集中に修正された箇所を未解決と断定するものではない。最終確認は第2段階で行う。

### PA-01 major / confirmed_mismatch

対象：`scripts/realestate-columns/115-sango-care-shukuhakugata-bukken-shisetsu-kijun-boshihokenho.md`

4言語の「面積・人員の具体数値は全国一律でない」「宿泊24時間は前提になりやすい」は国の人員基準を弱める。国のガイドラインは常に看護職1名以上、短期入所は1名以上を24時間体制で配置と明示。

修正・確認：人員の国基準と自治体の追加条件、未確認の居室面積を分ける。個別適合は所管・資格者へ留保。

根拠：[一次資料](https://www.cfa.go.jp/assets/contents/node/basic_page/field_ref_resources/ff38becb-bbd1-41f3-a95e-3a22ddac09d8/317bd576/20260331_policies_boshihoken_173.pdf)、[一次資料](https://www.cfa.go.jp/assets/contents/node/basic_page/field_ref_resources/ff38becb-bbd1-41f3-a95e-3a22ddac09d8/dae0454e/20230401_policies_boshihoken_73.pdf)

### PA-02 major / scope_mismatch

対象：`scripts/realestate-columns/115-sango-care-shukuhakugata-bukken-shisetsu-kijun-boshihokenho.md`

母子保健法17条の2対象施設と旅館業の関係を一般的な形態差の未確認としている。国交省通知は対象短期入所施設（病院・診療所・助産所除く）を旅館業適用外・ホテル又は旅館に非該当と明示。

修正・確認：対象を明記して国通知の扱いを示し、自治体事業外の私的サービス・医療法施設は同一扱いしない。

根拠：[一次資料](https://www.cfa.go.jp/assets/contents/node/basic_page/field_ref_resources/ff38becb-bbd1-41f3-a95e-3a22ddac09d8/cba5e460/20230401_policies_boshihoken_76.pdf)

### PA-03 major / incomplete_material_condition

対象：`scripts/realestate-columns/116-souzoku-jikka-juutaku-loan-zansai-teitouken-massho-baikyaku.md`

精算表の4言語は空き家3000万円控除を記載するが、2024年以後譲渡で対象財産を取得した相続人3人以上の2000万円上限を示していない。

修正・確認：最高額と3人以上の上限注記、個別適用は税理士という留保を4言語で揃える。

根拠：[一次資料](https://www.nta.go.jp/taxes/shiraberu/taxanswer/joto/3306.htm)

### PA-04 major / incorrect_source_identifier

対象：`scripts/realestate-columns/116-souzoku-jikka-juutaku-loan-zansai-teitouken-massho-baikyaku.md`

4言語の不動産登記法URLが116AC0000000123。平成16年法律123号の法令ID416AC0000000123と一致しない。取得不能だけでなくURL自体の誤記。

修正・確認：4言語とも正しい法令IDへ修正し、現在の本文を確認できなければverified=falseを維持。


### PA-05 major / scope_mismatch

対象：`scripts/legal-columns/109-kodo-kanri-iryokiki-hanbai-kashidashi-kyoka-tenpo-kanrisha.md`

主な読者にコンタクト店を含み、本文・導入・FAQ2は3年以上＋基礎講習の一般則を強く出すが、指定視力補正用レンズ等のみの1年以上＋対応講習、プログラムのみの別枠を具体化しない。

修正・確認：3年一般則の対象範囲とレンズ等・プログラムの例外を分けて4言語・FAQ・導入を整合。管理者個人の適格判断は所管へ。

根拠：[一次資料](https://www.hokeniryo.metro.tokyo.lg.jp/anzen/iyaku/sonota/sale_leas/kyoka)、[一次資料](https://www.city.chuo.lg.jp/documents/3219/kanrishyashikaku080629.pdf)

### PA-06 major / internal_sequence

対象：`scripts/legal-columns/110-seisan-gata-yuigon-fudosan-kanka-bunpai-yuigon-shikkou.md`

4言語の一般的流れは順序2に買主への移転登記を含め、順序3を買主探し・契約・引渡しとするため時系列が逆。前日PR480の本文／FAQ矛盾とは別の今回固有の指摘。

修正・確認：相続登記の検討／契約／決済時の買主移転を分け、事案の順序は司法書士確認とする。


### PA-07 major / outdated_penalty_name

対象：`scripts/labor-columns/149-jidosha-kyoshujo-shidouin-kenteiin-roudoujikan-hanbokibi-36kyotei-henkei.md`

日本語本文の現在の罰則説明が6か月以下の懲役のまま。厚労省現掲載の119条は拘禁刑、36条6項違反を列挙。

修正・確認：現在の刑名へ更新し、旧行為の経過扱いと混同しない。4言語の日本法刑名も確認。

根拠：[一次資料](https://www.mhlw.go.jp/web/t_doc?dataId=73022000&dataType=0&pageNo=1)、[一次資料](https://houseikyoku.sangiin.go.jp/column/column119.htm)

### PA-08 major / translation_mismatch

対象：`scripts/labor-columns/149-jidosha-kyoshujo-shidouin-kenteiin-roudoujikan-hanbokibi-36kyotei-henkei.md`

英訳は休憩の一斉付与を「given all at once」としている。労基法34条2項の一斉（労働者への同時）と、一人の休憩を分割しないことは異なる。直後のsplit記述とも噛み合わない。

修正・確認：同時付与の意味に翻訳し、分割の可否や協定例外の法的判断と分ける。

根拠：[一次資料](https://www.mhlw.go.jp/web/t_doc?dataId=73022000&dataType=0&pageNo=1)

### PA-09 major / broken_primary_link

対象：`scripts/labor-columns/150-gakushujuku-yobiko-koshi-koma-kyu-jugyogai-roudoujikan-kanri.md`

原稿4言語の本文・出典にあるガイドラインURLは追跡の取得応答で404。キャッシュに旧タイトルが表示されたことは本文の取得に当たらない。

修正・確認：取得可能な官公庁のガイドライン本文リンクへ交換し、取得できるまではverified=false／primarySources=hold。

根拠：[一次資料](https://jsite.mhlw.go.jp/tottori-roudoukyoku/news_topics/topics/_120669/_121005.html)

### PA-10 major / unverified_claims

対象：`scripts/realestate-columns/115-sango-care-shukuhakugata-bukken-shisetsu-kijun-boshihokenho.md`

claimsのunverifiedに列挙した現行法令・判例・実務判断は取得済み一次資料だけでは裏付けを完了できない。取得失敗を法的誤りと断定せず、原稿の「取得した」「確認した」を追認しない。

修正・確認：現行の代替一次本文を資格者と照合し、確認できた主張だけを残す。重要な未確認が残る限りhold。


### PA-11 major / unverified_claims

対象：`scripts/realestate-columns/116-souzoku-jikka-juutaku-loan-zansai-teitouken-massho-baikyaku.md`

claimsのunverifiedに列挙した現行法令・判例・実務判断は取得済み一次資料だけでは裏付けを完了できない。取得失敗を法的誤りと断定せず、原稿の「取得した」「確認した」を追認しない。

修正・確認：現行の代替一次本文を資格者と照合し、確認できた主張だけを残す。重要な未確認が残る限りhold。


### PA-12 major / unverified_claims

対象：`scripts/legal-columns/109-kodo-kanri-iryokiki-hanbai-kashidashi-kyoka-tenpo-kanrisha.md`

claimsのunverifiedに列挙した現行法令・判例・実務判断は取得済み一次資料だけでは裏付けを完了できない。取得失敗を法的誤りと断定せず、原稿の「取得した」「確認した」を追認しない。

修正・確認：現行の代替一次本文を資格者と照合し、確認できた主張だけを残す。重要な未確認が残る限りhold。


### PA-13 major / unverified_claims

対象：`scripts/legal-columns/110-seisan-gata-yuigon-fudosan-kanka-bunpai-yuigon-shikkou.md`

claimsのunverifiedに列挙した現行法令・判例・実務判断は取得済み一次資料だけでは裏付けを完了できない。取得失敗を法的誤りと断定せず、原稿の「取得した」「確認した」を追認しない。

修正・確認：現行の代替一次本文を資格者と照合し、確認できた主張だけを残す。重要な未確認が残る限りhold。


### PA-14 major / unverified_claims

対象：`scripts/labor-columns/149-jidosha-kyoshujo-shidouin-kenteiin-roudoujikan-hanbokibi-36kyotei-henkei.md`

claimsのunverifiedに列挙した現行法令・判例・実務判断は取得済み一次資料だけでは裏付けを完了できない。取得失敗を法的誤りと断定せず、原稿の「取得した」「確認した」を追認しない。

修正・確認：現行の代替一次本文を資格者と照合し、確認できた主張だけを残す。重要な未確認が残る限りhold。


### PA-15 major / unverified_claims

対象：`scripts/labor-columns/150-gakushujuku-yobiko-koshi-koma-kyu-jugyogai-roudoujikan-kanri.md`

claimsのunverifiedに列挙した現行法令・判例・実務判断は取得済み一次資料だけでは裏付けを完了できない。取得失敗を法的誤りと断定せず、原稿の「取得した」「確認した」を追認しない。

修正・確認：現行の代替一次本文を資格者と照合し、確認できた主張だけを残す。重要な未確認が残る限りhold。


### PA-16 minor / translation_locale

対象：`scripts/legal-columns/109-kodo-kanri-iryokiki-hanbai-kashidashi-kyoka-tenpo-kanrisha.md`

法務2本の全3翻訳が日本語への内部リンクを持つ。109は各6本、110は各7本、合計39本。

修正・確認：各/en/・/zh-tw/・/zh/へprefixを合わせ、本文・FAQや指紋を再確認。


### PA-17 minor / translation_locale

対象：`scripts/legal-columns/110-seisan-gata-yuigon-fudosan-kanka-bunpai-yuigon-shikkou.md`

法務2本の全3翻訳が日本語への内部リンクを持つ。109は各6本、110は各7本、合計39本。

修正・確認：各/en/・/zh-tw/・/zh/へprefixを合わせ、本文・FAQや指紋を再確認。


### PA-18 minor / proper_names

対象：`scripts/realestate-columns/115-sango-care-shukuhakugata-bukken-shisetsu-kijun-boshihokenho.md`

繁体／簡体の組織名が四葉不動產株式會社・四叶行政书士事务所等へ翻訳。法務英語も日本語固有名なしの箇所がある。

修正・確認：SEO skill・AGENTSに従い、日本語の正式固有名を各言語で保持。


### PA-19 minor / proper_names

対象：`scripts/realestate-columns/116-souzoku-jikka-juutaku-loan-zansai-teitouken-massho-baikyaku.md`

繁体／簡体の組織名が四葉不動產株式會社・四叶行政书士事务所等へ翻訳。法務英語も日本語固有名なしの箇所がある。

修正・確認：SEO skill・AGENTSに従い、日本語の正式固有名を各言語で保持。


### PA-20 minor / proper_names

対象：`scripts/legal-columns/109-kodo-kanri-iryokiki-hanbai-kashidashi-kyoka-tenpo-kanrisha.md`

繁体／簡体の組織名が四葉不動產株式會社・四叶行政书士事务所等へ翻訳。法務英語も日本語固有名なしの箇所がある。

修正・確認：SEO skill・AGENTSに従い、日本語の正式固有名を各言語で保持。


### PA-21 minor / proper_names

対象：`scripts/legal-columns/110-seisan-gata-yuigon-fudosan-kanka-bunpai-yuigon-shikkou.md`

繁体／簡体の組織名が四葉不動產株式會社・四叶行政书士事务所等へ翻訳。法務英語も日本語固有名なしの箇所がある。

修正・確認：SEO skill・AGENTSに従い、日本語の正式固有名を各言語で保持。


### PA-22 minor / separate_billing_translation

対象：`scripts/labor-columns/149-jidosha-kyoshujo-shidouin-kenteiin-roudoujikan-hanbokibi-36kyotei-henkei.md`

繁体・簡体は分離受任の請求を「由您直接請款／由您直接请款」とし、顧客が請求者であるように読める。日本語・英語は専門家から直接請求して顧客が払う意味。

修正・確認：各受任者から顧客への直接請求、顧客から各受任者への直接支払と主語を整合。


### PA-23 minor / separate_billing_translation

対象：`scripts/labor-columns/150-gakushujuku-yobiko-koshi-koma-kyu-jugyogai-roudoujikan-kanri.md`

繁体・簡体は分離受任の請求を「由您直接請款／由您直接请款」とし、顧客が請求者であるように読める。日本語・英語は専門家から直接請求して顧客が払う意味。

修正・確認：各受任者から顧客への直接請求、顧客から各受任者への直接支払と主語を整合。



## 主張の裏付け一覧

supported は表記された限定主張のみ。contradicted／scope_mismatch は取得資料と不一致、internally_inconsistent は原稿内部、unverified は取得不足を示す。

| 記事番号 | 主張 | 判定 |
|---|---|---|
| 1 | 短期入所の職員配置が全国一律ではない・24時間は前提になりやすい | contradicted |
| 1 | 母子保健法対象短期入所施設の旅館業扱いが形態で不明 | scope_mismatch |
| 1 | 1年対象・3類型・2021-04-01施行 | supported |
| 1 | 200平方メートル・医療法9人・消防区分 | unverified |
| 2 | 空き家控除3000万円の上限注記 | incomplete |
| 2 | 取得費加算と空き家特例の併用不可 | supported |
| 2 | 団信の一般機構・フラット35任意加入・商品別不払 | unverified |
| 2 | 民法熟慮3か月・単純承認・登記3年／10万円 | unverified |
| 3 | コンタクト等にも管理者3年を一律の目安・FAQとして示す | scope_mismatch |
| 3 | 品目ごとに許可／届出・毎年研修義務等 | supported |
| 3 | 構造設備の一般3条件 | supported |
| 3 | 6年更新・薬機法現行の正確な条項号と最終改正 | unverified |
| 4 | 順序2に買主移転登記、順序3に買主探し／契約 | internally_inconsistent |
| 4 | 準確定申告の対象と翌日から4か月 | supported |
| 4 | 死亡後換価の譲渡所得が誰に帰属するか・FAQ3いいえ | unverified |
| 4 | 執行権限・共有の管理に全員同意・登記の具体運用 | unverified |
| 5 | 刑名を懲役として現行説明 | contradicted |
| 5 | 英訳一斉付与＝given all at once | translation_mismatch |
| 5 | 36協定45／360・42／320・720・100未満・80平均 | supported |
| 5 | 年間変形10／52／280と連続週等 | supported |
| 5 | 年変形なら所定を超えた分はすべて時間外・FAQ2 | unverified |
| 5 | 繁忙見込みを特別条項理由へ一律に使えるか | unverified |
| 6 | 塾講師ガイドライン4言語リンク | broken_link |
| 6 | 労基法全額払い・8／40・割増の一般規定 | supported |
| 6 | 三菱重工2000-03-09判例、1985-12-19報告、指揮命令下の準備等 | unverified |
| 6 | コマ給固定残業代の個別要件・最低賃金換算方法 | unverified |

## SEO意図・業際・翻訳

- 記事1：母子が宿泊する産後ケアの物件選定・国基準と委託先確認。診療所開設や保育所の児童施設基準とは制度と利用者が異なる。 比較した既存MD：`scripts/realestate-columns/12-clinic-bukken-youto-chiiki-kaisetsu-todokede.md`、`scripts/realestate-columns/110-ninka-hoikusho-20nin-bukken-youto-engei.md`.

- 記事2：住宅ローン残債・団信・抵当権・任意売却が中心。換価分割の分配／譲渡税と相続登記期限一般とは異なる。 比較した既存MD：`scripts/realestate-columns/27-kanka-bunkatsu-fudosan-baikyaku-nagare.md`、`scripts/realestate-columns/06-souzoku-toki-gimuka-baikyaku.md`.

- 記事3：医療機器販売貸与と管理者・保管。調剤薬局の開設と管理薬剤師とは許可・資格が異なる。 比較した既存MD：`scripts/legal-columns/80-yakkyoku-kaisetsu-kyoka-kozo-setsubi-kanri-yakuzaishi.md`.

- 記事4：遺言者による換価／分配設計と執行。執行者一般や相続人の協議による換価分割と主語・実行根拠が異なる。 比較した既存MD：`scripts/legal-columns/34-yuigon-shikkosha-shokumu-sennin-dare.md`、`scripts/realestate-columns/27-kanka-bunkatsu-fudosan-baikyaku-nagare.md`.

- 記事5：教習・検定・合宿の業務集中と待機・休日。既存58の制度比較一般を再説明する部分はあるが、業種の予定・待機の管理が固有意図。 比較した既存MD：`scripts/labor-columns/58-henkei-roudoujikan-flextime.md`.

- 記事6：コマ給に漏れる準備・採点等の時間把握と労働者性。既存82の固定残業代有効要件一般とは主要な入口が異なる。 比較した既存MD：`scripts/labor-columns/82-kotei-zangyodai-tekiho-youken-sagaku-seisan.md`.

比較した既存記事の記述自体を新規記事の法的根拠に流用していない。重複意図は承認済みplanの軸と本文の主目的に基づきpassとした。新たなサイト全体の完全重複検索やサイトマップによる公開状態の確認は本段階の範囲外。

全24言語で媒介・申請書類・労務・登記・税務・紛争・医療・建築の各担当を分ける趣旨と判断留保を確認した。一括受任や紹介料を前提とする新しい構造は認めなかった。固有名の日本語維持、法務2本39内部リンクのlocale、労務繁簡の直接請求の主語、教習所英訳の一斉休憩には初期修正点を残した。これらを変更した後は新指紋と4言語全体の再確認が必要。

## 一次資料の取得と限界

ネットワーク・Webから読んだ根拠はgo.jp／lg.jpの一次情報に限る。検索で出た民間サイトの内容を法的根拠に使っていない。e-Govの統合条文は0行、MOJ代替は取得不能だった。厚労省法令等データベースでは労基法の本文を取得できた。CFAの現掲載PDF、東京都・中央区の本文、国税庁の令和8年4月1日現在資料は記載範囲だけ検証した。最終改正・施行履歴や個別の資格／適合判定を全件確認した意味ではない。

| 記事番号 | URL | verified | 箇所 | 確認対象 | 取得結果 |
|---|---|---|---|---|---|
| 1 | [laws.e-gov.go.jp/law/340AC0000000141](https://laws.e-gov.go.jp/law/340AC0000000141) | false |  | 母子保健法17条の2の統合条文・最終改正／施行履歴 | 取得応答の本文0行 |
| 1 | [www.cfa.go.jp/policies/boshihoken](https://www.cfa.go.jp/policies/boshihoken) | true | 143–158行 | 現掲載の令和8年3月ガイドラインと令和元年改正関係公式資料への導線 | 本文取得・記載範囲のみ確認 |
| 1 | [www.cfa.go.jp/assets/contents/node/basic_page/field_ref_resources/ff38becb-bbd1-41f3-a95e-3a22ddac09d8/317bd576/20260331_policies_boshihoken_173.pdf](https://www.cfa.go.jp/assets/contents/node/basic_page/field_ref_resources/ff38becb-bbd1-41f3-a95e-3a22ddac09d8/317bd576/20260331_policies_boshihoken_173.pdf) | true | 本文11–13頁（PDF14–16頁／ゼロ起算P13–P15）、423–484行 | 出産後1年対象、3類型、常に看護職1名以上、短期入所は1名以上の看護職を24時間配置、居室・相談・乳児保育等の設備 | 本文取得・記載範囲のみ確認 |
| 1 | [www.cfa.go.jp/assets/contents/node/basic_page/field_ref_resources/ff38becb-bbd1-41f3-a95e-3a22ddac09d8/dae0454e/20230401_policies_boshihoken_73.pdf](https://www.cfa.go.jp/assets/contents/node/basic_page/field_ref_resources/ff38becb-bbd1-41f3-a95e-3a22ddac09d8/dae0454e/20230401_policies_boshihoken_73.pdf) | true | PDF1–2頁 | 母子保健法施行規則7条の4の実施基準：常時1名以上、施設設備。令和2年省令149号の改正公布資料であり、その後の全改正履歴を確認したものではない | 本文取得・記載範囲のみ確認 |
| 1 | [www.cfa.go.jp/assets/contents/node/basic_page/field_ref_resources/ff38becb-bbd1-41f3-a95e-3a22ddac09d8/cba5e460/20230401_policies_boshihoken_76.pdf](https://www.cfa.go.jp/assets/contents/node/basic_page/field_ref_resources/ff38becb-bbd1-41f3-a95e-3a22ddac09d8/cba5e460/20230401_policies_boshihoken_76.pdf) | true | PDF1–2頁、13–19・34–39行 | 17条の2対象の短期入所施設（病院・診療所・助産所を除く）は旅館業法適用外、ホテル又は旅館に該当しないという国交省通知、施行日2021-04-01 | 本文取得・記載範囲のみ確認 |
| 1 | [laws.e-gov.go.jp/law/325AC0000000201](https://laws.e-gov.go.jp/law/325AC0000000201) | false |  | 用途変更の200平方メートル基準・2019-06-25施行と現在の用途規制 | 取得応答の本文0行 |
| 1 | [laws.e-gov.go.jp/law/323AC0000000205](https://laws.e-gov.go.jp/law/323AC0000000205) | false |  | 医療法2条の助産所の定義・9人以下 | 取得応答の本文0行 |
| 1 | [laws.e-gov.go.jp/law/336CO0000000037](https://laws.e-gov.go.jp/law/336CO0000000037) | false |  | 消防法施行令の現在の区分・設備条件 | 取得応答の本文0行 |
| 2 | [laws.e-gov.go.jp/law/129AC0000000089](https://laws.e-gov.go.jp/law/129AC0000000089) | false |  | 896条・915条・921条・939条の権利義務承継・熟慮期間・単純承認・放棄 | 取得応答の本文0行 |
| 2 | [laws.e-gov.go.jp/law/116AC0000000123](https://laws.e-gov.go.jp/law/116AC0000000123) | false |  | 原稿4言語の不動産登記法出典。平成16年法律123号のIDは416AC0000000123であり、116ACは誤記 | 取得本文0行。法令ID誤記を原稿・既存正しい法令IDと照合 |
| 2 | [www.moj.go.jp/MINJI/minji05_00565.html](https://www.moj.go.jp/MINJI/minji05_00565.html) | false |  | 相続登記の施行日・3年期限・過料の代替一次資料 | 代替の法務省Q&A本文を取得できなかった |
| 2 | [www.nta.go.jp/taxes/shiraberu/taxanswer/joto/3267.htm](https://www.nta.go.jp/taxes/shiraberu/taxanswer/joto/3267.htm) | true | 令和8年4月1日現在、12・20–29行 | 相続税課税と一定期間内譲渡等の取得費加算の要件 | 本文取得・記載範囲のみ確認 |
| 2 | [www.nta.go.jp/taxes/shiraberu/taxanswer/joto/3306.htm](https://www.nta.go.jp/taxes/shiraberu/taxanswer/joto/3306.htm) | true | 令和8年4月1日現在、12–16・78行 | 一定要件で最高3000万円、2024年以後の譲渡で対象財産取得相続人3人以上は2000万円、取得費加算と併用不可 | 本文取得・記載範囲のみ確認 |
| 3 | [laws.e-gov.go.jp/law/335AC0000000145](https://laws.e-gov.go.jp/law/335AC0000000145) | false |  | 薬機法39条・39条の2・39条の3と6年更新の現行条文 | 取得応答の本文0行 |
| 3 | [laws.e-gov.go.jp/law/336M50000100001](https://laws.e-gov.go.jp/law/336M50000100001) | false |  | 施行規則162条・168条の現在の条文 | 取得応答の本文0行 |
| 3 | [www.hokeniryo.metro.tokyo.lg.jp/anzen/iyaku/sonota/sale_leas/risk](https://www.hokeniryo.metro.tokyo.lg.jp/anzen/iyaku/sonota/sale_leas/risk) | true | 476–517行、現掲載の本文 | 高度管理・特定保守管理は許可、特定保守管理を除く管理は届出、一般は原則不要、具体品目と申請窓口 | 本文取得・記載範囲のみ確認 |
| 3 | [www.hokeniryo.metro.tokyo.lg.jp/anzen/iyaku/sonota/sale_leas/kyoka](https://www.hokeniryo.metro.tokyo.lg.jp/anzen/iyaku/sonota/sale_leas/kyoka) | true | 479–503行、現掲載の本文 | 構造設備と管理者の区分。一般の3年＋基礎講習に対し、指定視力補正用レンズ等のみは1年＋講習、プログラムのみは別枠 | 本文取得・記載範囲のみ確認 |
| 3 | [www.hokeniryo.metro.tokyo.lg.jp/anzen/iyaku/sonota/sale_leas/sonsyujikou](https://www.hokeniryo.metro.tokyo.lg.jp/anzen/iyaku/sonota/sale_leas/sonsyujikou) | true | 486–508行、現掲載の本文 | 管理者設置、継続研修の義務と特定管理の努力義務の違い | 本文取得・記載範囲のみ確認 |
| 3 | [www.city.chuo.lg.jp/a0030/kenkouiryou/iryou/iji/hanbai/koudokanriiryoukiki.html](https://www.city.chuo.lg.jp/a0030/kenkouiryou/iryou/iji/hanbai/koudokanriiryoukiki.html) | true | 50・57・127–141行 | 2026年7月6日掲載の許可・分類説明と管理者早見表の導線 | 本文取得・記載範囲のみ確認 |
| 3 | [www.city.chuo.lg.jp/documents/3219/kanrishyashikaku080629.pdf](https://www.city.chuo.lg.jp/documents/3219/kanrishyashikaku080629.pdf) | true | PDF1～4頁 | 一般・コンタクト・プログラムの基礎講習区分、実務経験1～3年の違い。個人の適格判定は行わない | 本文取得・記載範囲のみ確認 |
| 3 | [www.city.chuo.lg.jp/documents/3219/kodosinkisetumei.pdf](https://www.city.chuo.lg.jp/documents/3219/kodosinkisetumei.pdf) | true | PDF1頁、74–79行 | 採光・照明・換気・清潔、居住／不潔場所との区別と衛生安全な貯蔵設備等の申請説明 | 本文取得・記載範囲のみ確認 |
| 4 | [laws.e-gov.go.jp/law/129AC0000000089](https://laws.e-gov.go.jp/law/129AC0000000089) | false |  | 1012・1013・1014・1015条、共有物管理と2019年施行改正の現在の規定 | 取得応答の本文0行 |
| 4 | [www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2022.htm](https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2022.htm) | true | 令和8年4月1日現在、14・38行 | 死亡日までに確定した所得の準確定申告と知った日の翌日から4か月以内の期限 | 本文取得・記載範囲のみ確認 |
| 4 | [www.nta.go.jp/taxes/shiraberu/taxanswer/joto/3267.htm](https://www.nta.go.jp/taxes/shiraberu/taxanswer/joto/3267.htm) | true | 令和8年4月1日現在、12・20–29行 | 相続税額を取得費加算できる一般要件と一定期間内譲渡 | 本文取得・記載範囲のみ確認 |
| 5 | [laws.e-gov.go.jp/law/322AC0000000049](https://laws.e-gov.go.jp/law/322AC0000000049) | false |  | 労基法の現在の統合条文 | 取得応答の本文0行 |
| 5 | [www.mhlw.go.jp/web/t_doc?dataId=73022000&dataType=0&pageNo=1](https://www.mhlw.go.jp/web/t_doc?dataId=73022000&dataType=0&pageNo=1) | true | 245–407・1075–1077行 | 厚労省掲載の労基法32・32の2・32の4・34・35・36・37・119条。45／360、42／320、720／6か月、100未満／80平均、休憩6超45分・8超1時間、119条刑名は拘禁刑 | 本文取得・記載範囲のみ確認 |
| 5 | [jsite.mhlw.go.jp/tochigi-roudoukyoku/hourei_seido_tetsuzuki/roudoukijun_keiyaku/roukijou/roukihou_point/_79129/transformation32-4-2.html](https://jsite.mhlw.go.jp/tochigi-roudoukyoku/hourei_seido_tetsuzuki/roudoukijun_keiyaku/roukijou/roukihou_point/_79129/transformation32-4-2.html) | true | 109–126行 | 年間変形10時間・52時間・280日、48時間超の週数・連続労働日数と協定／規則の届出。現掲載ページは2002年例を含み、その後の最終改正履歴の確認とは区別 | 本文取得・記載範囲のみ確認 |
| 5 | [houseikyoku.sangiin.go.jp/column/column119.htm](https://houseikyoku.sangiin.go.jp/column/column119.htm) | true | 96–103行 | 2025年6月1日拘禁刑施行と施行前行為の経過扱い | 本文取得・記載範囲のみ確認 |
| 6 | [laws.e-gov.go.jp/law/322AC0000000049](https://laws.e-gov.go.jp/law/322AC0000000049) | false |  | 労基法32・34・37・24条の現在の統合条文 | 取得応答の本文0行 |
| 6 | [jsite.mhlw.go.jp/tottori-roudoukyoku/news_topics/topics/_120669/_121005.html](https://jsite.mhlw.go.jp/tottori-roudoukyoku/news_topics/topics/_120669/_121005.html) | false |  | 原稿4言語に本文・出典各1回ある2017年ガイドラインリンク | 初回はキャッシュのタイトル／321行表示、本文確認の追跡取得は404 Not Found。verifiedをtrueにしない |
| 6 | [www.mhlw.go.jp/content/000282266.pdf](https://www.mhlw.go.jp/content/000282266.pdf) | false |  | 同ガイドラインの本省PDF候補 | 代替取得を試したが本文取得不能 |
| 6 | [www.mhlw.go.jp/file/06-Seisakujouhou-11200000-Roudoukijunkyoku/0000148322.pdf](https://www.mhlw.go.jp/file/06-Seisakujouhou-11200000-Roudoukijunkyoku/0000148322.pdf) | false |  | 同ガイドラインの本省別掲載候補 | 代替取得を試したが本文取得不能 |
| 6 | [www.mhlw.go.jp/web/t_doc?dataId=73022000&dataType=0&pageNo=1](https://www.mhlw.go.jp/web/t_doc?dataId=73022000&dataType=0&pageNo=1) | true | 115・245–251・282–284・401–408行 | 厚労省掲載の労基法9条労働者定義・24条全額払い・32条8／40・37条割増の規定のみ。授業準備等の労働時間性や固定残業代の具体的有効要件の判例に代用しない | 本文取得・記載範囲のみ確認 |
| 6 | [www.check-roudou.mhlw.go.jp/parttime/](https://www.check-roudou.mhlw.go.jp/parttime/) | true | 20–40・45–52行 | アルバイトにも労基法適用、全額払い・最低賃金・割増の一般説明のみ。1985年報告／最高裁判例／労働時間把握指針の確認には代用しない | 本文取得・記載範囲のみ確認 |

[コンプライアンス自己点検] 判断留保:有／匿名化:不要（実案件情報なし）／法令引用:取得できた施行情報のみ併記、最終改正全件未検証／未検証事項:6記事に残る主張別holdをJSONへ列挙。
## 塾150の追加資料取得（2026-10-12、編集後再レビューは未開始）

厚労省の[ガイドライン正式掲載ページ](https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/roudouzikan/070614-2.html)を実取得し、策定日「平成29年1月20日」と本文PDFへの導線を確認した。掲載ページの本文リンクをたどった[正規本文PDF](https://www.mhlw.go.jp/file/06-Seisakujouhou-11200000-Roudoukijunkyoku/0000149439.pdf)は4頁・108行を取得して全文読了した。これらの取得できた資料は、確認対象を限定してverified=trueで追加した。

本文第3（PDF1–2頁）は使用者の指揮命令下という基準と、指示による準備・後始末、即応義務があり離れられない待機、義務研修・指示学習の扱いを示す。第4(1)(2)（PDF2頁）は日ごとの始業終業記録、現認または客観記録の原則を、第4(3)（PDF3頁）は自己申告と実態の乖離の調査・補正等を示す。塾150の一般的な勤怠把握の説明にはこの取得本文を根拠として使える。各講師の具体的な労働者性等の判断を代替しない。

公式掲載ページの[リーフレット](https://www.mhlw.go.jp/file/06-Seisakujouhou-11200000-Roudoukijunkyoku/0000187488.pdf)も取得し、PDF1頁の策定日とPDF11–12頁の本文掲載を確認した。2017年7月表示の資料である。別の[本省掲載本文](https://www.mhlw.go.jp/content/12602000/000336509.pdf)も4頁全文を取得した。リンク差替えには正式掲載ページまたはそこから案内される0000149439.pdfを優先する。

元の鳥取労働局URLの404と取得できなかった代替候補はfalseのまま残した。親が取得失敗を報告した000280237.pdfや、ガイドライン本体ではない働き方改革総合ページを本文確認の代わりにしていない。判決本文、1985年労働者性報告、固定残業代の個別要件、後年の法改正と現行保存年限をこの2017年資料で検証した扱いにはしない。

初期原稿の不達リンク等の指摘・初期スナップショット・記事全体のholdは維持する。編集後の4言語全文・新しい指紋の再レビューは未開始であり、この追加取得は公開承認ではない。

[コンプライアンス自己点検] 判断留保:有／匿名化:不要（実案件情報なし）／法令引用:策定日と取得本文の該当箇所を記録／未検証事項:判決本文・1985年報告・個別要件・全改正履歴等をholdとして維持。
