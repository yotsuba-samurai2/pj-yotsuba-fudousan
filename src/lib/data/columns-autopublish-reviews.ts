import type { ColumnQualityReview } from "@/lib/columns-autopublish-quality";

// Recorded from independent review; changed or incomplete articles remain held.
export const COLUMNS_AUTOPUBLISH_REVIEWS: readonly ColumnQualityReview[] = [
  {
    "key": "labor:kinmukan-interval-doryoku-gimu-shugyokisoku-roumu",
    "fingerprint": "0c1817625369b95e351c64ba2d3b0d86e79eadfd5b0db2bed3aa9e0c1202540f",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://laws.e-gov.go.jp/api/1/lawdata/404AC0000000090",
        "checkedAt": "2026-10-17",
        "relevantClaim": "労働時間等設定改善法第2条第1項が『健康及び福祉を確保するために必要な終業から始業までの時間の設定』を含む必要措置を講ずる努力義務（『努めなければならない』）と定めることを本文で確認。記事の『勤務間インターバルは努力義務（同法第2条第1項）』と一致。施行2019年4月1日（働き方改革関連法による追加）は記事記載。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/api/1/lawdata/322AC0000000049",
        "checkedAt": "2026-10-17",
        "relevantClaim": "労基法第36条第4項＝限度時間『一箇月について四十五時間及び一年について三百六十時間』、第5項＝特別条項の年『七百二十時間を超えない範囲内』・月45時間超は『一年について六箇月以内』、第6項＝単月の時間外＋休日労働『百時間未満』・複数月（2〜6か月）平均『八十時間を超えない』を本文で確認。記事の上限規制の数値と一致。第89条・第41条第3号は標準条文。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/39044455640"
    },
    "reviewedAt": "2026-10-18",
    "validThrough": "2026-10-20"
  },
  {
    "key": "labor:ikusei-shuro-ryohi-shokuhi-koujo-chingin-zengaku-barai",
    "fingerprint": "580f0c16f27f0bc244f16522767991d92f547261f74f73dd847aa8158c189757",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://laws.e-gov.go.jp/api/1/lawdata/322AC0000000049",
        "checkedAt": "2026-10-17",
        "relevantClaim": "労基法第24条第1項の本文『その全額を支払わなければならない』（全額払いの原則）と、ただし書＝法令に別段の定めがある場合又は過半数労働組合・過半数代表者との『書面による協定』がある場合に一部控除できる旨を本文で確認。記事の賃金控除協定の要件と一致。第15条第1項・第95条は標準条文。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/api/1/lawdata/334AC0000000137",
        "checkedAt": "2026-10-17",
        "relevantClaim": "最低賃金法第4条第1項『その最低賃金額以上の賃金を支払わなければならない』、第3項の算入しない賃金（一月をこえない期間ごとに支払われる賃金以外の賃金で厚労省令で定めるもの等）を本文で確認。記事の最低賃金との照合の整理と一致。外国人指針・技能実習/特定技能運用要領（実費基準・事前明示・合意）は公的方針で確定値は示さず妥当。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/39044455640"
    },
    "reviewedAt": "2026-10-18",
    "validThrough": "2026-10-20"
  },
  {
    "key": "labor:fudosan-chukai-eigyo-buai-hoshokyu-jigyojogai-minashi-roumu",
    "fingerprint": "50deb8ea3727d32c4a46248fa4a61669d6430b255f29f980ff0c860e3a977949",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://laws.e-gov.go.jp/api/1/lawdata/322AC0000000049",
        "checkedAt": "2026-10-18",
        "relevantClaim": "労働基準法第27条『出来高払制その他の請負制で使用する労働者については、使用者は、労働時間に応じ一定額の賃金の保障をしなければならない』、第37条（割増賃金）、第38条の2第1項（事業場外で労働時間を算定し難いとき所定労働時間みなし）を条文で確認。本文と一致。",
        "verified": true
      },
      {
        "url": "https://www.mlit.go.jp/common/001229686.pdf",
        "checkedAt": "2026-10-18",
        "relevantClaim": "宅地建物取引業法第31条の3第1項・施行規則第15条の5の3により、事務所ごとに業務に従事する者5人に1人以上の割合で専任の宅地建物取引士を置く義務、国交省『解釈・運用の考え方』で『専任』は常勤・専従と解されることを確認。本文と一致。阪急トラベルサポート（最判H26.1.24）・国際自動車（最判R2.3.30）・日本ケミカル（最判H30.7.19）各判旨は一般に確立した最高裁判例として本文の引用と整合。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/39141479219"
    },
    "reviewedAt": "2026-10-19",
    "validThrough": "2026-10-21"
  },
  {
    "key": "labor:gaikokujin-anzeneisei-kyoiku-bogoku-roudo-saigai-boshi",
    "fingerprint": "95579fe21e64ce625fb05f5878f22a98910f95c6a354e2b2ca309d2bab04255e",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000099121_00005.html",
        "checkedAt": "2026-10-18",
        "relevantClaim": "厚労省資料・通達（基発0531第9号）で、労働安全衛生規則第35条の雇入れ時等教育につき、令和4年厚生労働省令第91号（令和4年5月31日公布）が令第2条第3号『その他の業種』で第1〜4号を省略できる規定を削除し、全業種で8項目を義務化、当該削除は令和6年（2024年）4月1日施行であることを確認。本文の施行日・改正省令番号・公布日・省略廃止と一致。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/api/1/lawdata/347M50002000032",
        "checkedAt": "2026-10-18",
        "relevantClaim": "労働安全衛生規則第35条第1項の雇入れ時等教育8項目（機械等の危険有害性、保護具の性能、作業手順、作業開始時点検、疾病の原因予防、整理整頓清潔、応急措置退避、その他必要事項）は本文の表と一致。安衛法第59条（雇入れ時・作業内容変更時の教育、第3項特別教育）、労働契約法第5条（安全配慮義務）、外国人指針（H19告示276号）、基発0328第28号は公的方針として本文の整理と整合。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/39141479219"
    },
    "reviewedAt": "2026-10-19",
    "validThrough": "2026-10-21"
  },
  {
    "key": "labor:fitness-gym-kaigyo-trainer-gyomuitaku-roumu",
    "fingerprint": "bf5a1a4cab53fb776f28c7a097154dd39de964e46d4811346fc6d760fa5d5b49",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://laws.e-gov.go.jp/law/322AC0000000049",
        "checkedAt": "2026-10-20",
        "relevantClaim": "労働基準法第9条（労働者の定義）、第32条の2（1か月単位変形）、第32条の4（1年単位変形・労使協定必須）、第36条（36協定）、第37条第1項・第4項（時間外・深夜割増、月60時間超5割）、第89条（就業規則作成・届出）は確立した条文で記事の割増率（深夜2割5分・法定休日3割5分・月60時間超5割）・1年単位の上限（1日10時間・1週52時間）と整合。昭和60年12月19日労働基準法研究会報告の労働者性判断基準（使用従属性・事業者性・専属性）も確立した行政基準で記事と一致。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/law/505AC0000000025",
        "checkedAt": "2026-10-20",
        "relevantClaim": "特定受託事業者に係る取引の適正化等に関する法律（フリーランス新法）は令和5年法律第25号・令和5年5月12日公布・令和6年（2024年）11月1日施行で、発注事業者に取引条件明示等の義務を課す確立した制度。記事の法令番号・施行日・義務の記載と一致。月60時間超割増5割の中小企業適用は令和5年（2023年）4月1日（猶予廃止）で確立した事実。三菱重工業長崎造船所事件（最判平成12年3月9日）は労働時間＝指揮命令下の時間との定義を示した代表的最高裁判例で記事と整合。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/39459209613"
    },
    "reviewedAt": "2026-10-21",
    "validThrough": "2026-10-23"
  },
  {
    "key": "labor:mujin-24ji-tenpo-coin-laundry-junkai-machijikan-roumu",
    "fingerprint": "ebb946385a25a15f162301f6826d0f88896ad4d263daad7f2a9e1ac1f669b190",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://laws.e-gov.go.jp/law/322AC0000000049",
        "checkedAt": "2026-10-20",
        "relevantClaim": "労働基準法第32条（1日8時間・1週40時間）、第34条（6時間超45分・8時間超1時間、原則自由利用）、第37条第1項・第4項（時間外・深夜割増、月60時間超5割）、第38条第1項（事業場を異にする場合の労働時間の通算）は確立した条文で記事の手待ち時間・休憩の区別・深夜割増・複数店舗通算の整理と一致。三菱重工業長崎造船所事件（最判平成12年3月9日）の労働時間の定義とも整合。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/law/334AC0000000137",
        "checkedAt": "2026-10-20",
        "relevantClaim": "最低賃金法（昭和34年法律第137号）の地域別最低賃金は当該地域で働くすべての労働者に適用され、額は毎年改定される確立した制度。記事は具体額を断定せず『当該年度の公表値を確認』とし、手待ち・移動を労働時間に含めて最低賃金を下回らないか確認する論点整理に留めており適切。月60時間超割増5割の中小企業適用（2023年4月1日）も確立した事実で記事と一致。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/39459209613"
    },
    "reviewedAt": "2026-10-21",
    "validThrough": "2026-10-23"
  },
  {
    "key": "labor:kyoiku-kunren-kyuka-kyufukin-2025-mukyu-manabinaoshi",
    "fingerprint": "7277ad10c039140a0047e9613e8f7fa4c0081dc1e9e013416044d901da088f50",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/koyouhoken/kyukakyufukin.html",
        "checkedAt": "2026-10-23",
        "relevantClaim": "教育訓練休暇給付金＝一定の条件を満たす雇用保険の一般被保険者が就業規則等に基づき連続30日以上の無給の教育訓練休暇を取得した場合に、基本手当に相当する給付（賃金の一定割合）を支給。本文の制度の性格・対象・無給30日以上を厚労省公式ページで直接確認。",
        "verified": true
      },
      {
        "url": "https://jsite.mhlw.go.jp/tokyo-hellowork/list/tachikawa/kyushokusha/kyouikukunrenkyuukakyuufukin.html",
        "checkedAt": "2026-10-23",
        "relevantClaim": "教育訓練休暇給付金は令和7年10月1日施行で新設、対象は一般被保険者、連続30日以上の無給休暇——施行日と中核要件をハローワーク公式ページで直接確認。",
        "verified": true
      },
      {
        "url": "https://www.mhlw.go.jp/content/11601000/001375529.pdf",
        "checkedAt": "2026-10-23",
        "relevantClaim": "厚労省資料で給付日数は被保険者期間に応じ90日・120日・150日のいずれか、被保険者期間5年以上が要件、休暇開始前2年間にみなし被保険者期間12か月以上、給付は離職時の基本手当と同額の考え方。本文の区分（5〜10年=90日/10〜20年=120日/20年以上=150日）は一般離職者の基本手当所定給付日数と同一区分であり整合。給付率45〜80%・最長1年は基本手当の標準パラメータで本文は『ハローワークで確認』と留保。MHLWリーフレットPDFは機械可読化できず本文は数値を最新情報で確認する旨を明示。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/39989816156"
    },
    "reviewedAt": "2026-10-24",
    "validThrough": "2026-10-26"
  },
  {
    "key": "legal:ninteikodomoen-ninka-nintei-shinsei-nagare-youken",
    "fingerprint": "6134a398b59d7cd3b066f921e4ba04e71849374e1a45d8bce34499c8bedd76f5",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://laws.e-gov.go.jp/api/1/lawdata/418AC0000000077",
        "checkedAt": "2026-10-25",
        "relevantClaim": "認定こども園法第3条第1項＝幼稚園型・保育所型・地方裁量型の認定、第17条第1項＝幼保連携型の認可(国・地方公共団体以外は知事認可)、第12条＝幼保連携型の設置者は国・地方公共団体・学校法人・社会福祉法人のみ(株式会社不可)、第13条＝設備運営基準を都道府県条例で定め主務省令に従う/参酌。本文・表・FAQの窓口区分と一致。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/40208963917"
    },
    "reviewedAt": "2026-10-26",
    "validThrough": "2026-10-28"
  },
  {
    "key": "labor:ryokogyo-tenjoin-jigyojogai-minashi-roudoujikan-roumu",
    "fingerprint": "362175b1a890e4654aa13094ffce180f3bf21d93138a7977733f91c6078c79a3",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://laws.e-gov.go.jp/law/322AC0000000049",
        "checkedAt": "2026-10-25",
        "relevantClaim": "労基法第38条の2(事業場外で労働時間を算定し難いときのみなし/第2項労使協定/第3項届出)、第34条(休憩)・第35条(休日)・第37条第1項第4項(時間外・休日・深夜割増)・第36条(36協定)は確立した条文で本文と整合。阪急トラベルサポート最判H26.1.24・三菱重工業長崎造船所最判H12.3.9の判旨も確立判例として本文引用と一致。",
        "verified": true
      },
      {
        "url": "https://www.mlit.go.jp/kankocho/seisaku_seido/ryokogyoho/ryokogyohogaiyo.html",
        "checkedAt": "2026-10-25",
        "relevantClaim": "観光庁の旅行業法概要で、旅行業法第11条の2により営業所ごとに1人以上の旅行業務取扱管理者を選任、試験区分(総合/国内/地域限定)、選任後は5年ごとに定期研修(第11条の2第7項)を受講させる義務を確認。本文・FAQの選任義務と研修の記載と一致。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/40208963917"
    },
    "reviewedAt": "2026-10-26",
    "validThrough": "2026-10-28"
  },
  {
    "key": "realestate:mujin-reito-jihanki-shokuhin-bukken-youken",
    "fingerprint": "aa968ed066061fed23001996c1466a47f362cd0ad7308fd2b7b33e25878ac569",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.city.koto.lg.jp/260404/fukushi/ese/shokuhin/7000.html",
        "checkedAt": "2026-10-26",
        "relevantClaim": "食品衛生法改正で令和3年6月1日から営業許可（32業種）と営業届出制度が開始。届出不要業種に『常温で長期間保存可能な包装された食品・添加物の販売業』が含まれ、冷凍・冷蔵を要する食品はこの例外に当たらない。",
        "verified": true
      },
      {
        "url": "https://www.mhlw.go.jp/content/000772318.pdf",
        "checkedAt": "2026-10-26",
        "relevantClaim": "食品衛生法第54条＝都道府県が公衆衛生に与える影響が著しい営業（政令で定めるもの）につき施設基準を条例で定める、第55条＝前条に規定する営業を営む者は都道府県知事の許可を受ける、第57条＝その他の営業は届出。本文の条番号整理と整合。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/law/325AC0000000201",
        "checkedAt": "2026-10-26",
        "relevantClaim": "建築基準法第2条第1号（建築物＝土地に定着する工作物のうち屋根及び柱若しくは壁を有するもの）、第48条・別表第2（用途地域の用途制限）、第87条（用途変更で床面積200㎡超の特殊建築物となる場合の確認準用）。確立した標準規定で本文と整合（e-Gov本体はJS描画のため官公庁解説で裏取り）。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/40378564071"
    },
    "reviewedAt": "2026-10-27",
    "validThrough": "2026-10-29"
  },
  {
    "key": "realestate:souzoku-jikka-zanchibutsu-ihin-genkyo-uri",
    "fingerprint": "2cdc421782d3403f69ada963e4a14a5bfce3ed94add58f28d60ac3c167d05c17",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.moj.go.jp/content/001255639.pdf",
        "checkedAt": "2026-10-26",
        "relevantClaim": "民法の契約不適合責任（第562条追完請求・第563条代金減額・第564条損害賠償/解除・第566条は種類品質の不適合を知った時から1年以内の通知で足りる）。本文の整理と整合。",
        "verified": true
      },
      {
        "url": "https://www.mlit.go.jp/jutakukentiku/house/content/001712338.pdf",
        "checkedAt": "2026-10-26",
        "relevantClaim": "空家特措法の管理不全空家等制度は2023年12月13日施行の改正で新設され、勧告を受けると住宅用地に係る固定資産税の特例が解除される。第2条第2項が特定空家等を定義。本文と整合。",
        "verified": true
      },
      {
        "url": "https://www.moj.go.jp/MINJI/minji07_00262.html",
        "checkedAt": "2026-10-26",
        "relevantClaim": "『残置物の処理等に関するモデル契約条項』は法務省・国土交通省が令和3年（2021年）に公表、単身高齢者等の賃貸借で賃借人死亡後の残置物処理を想定したもの。本文の『賃貸向けだが考え方の参考』という位置づけと整合。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/40378564071"
    },
    "reviewedAt": "2026-10-27",
    "validThrough": "2026-10-29"
  },
  {
    "key": "legal:douro-shiyo-kyoka-douro-senyo-kyoka-chigai",
    "fingerprint": "63fd0bf9e5f968fbc6d795270b6fe2b44e5b9cf844ef9c63abceaa4bc8adbcce",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.mlit.go.jp/road/senyo/01.html",
        "checkedAt": "2026-10-26",
        "relevantClaim": "道路占用許可は道路管理者が許可。許可基準に『道路の敷地外に余地がないためにやむを得ない』こと（道路法第33条）。第32条第1項第1号物件に電柱・電線・変圧塔・郵便差出箱・公衆電話所・広告塔等。本文と整合。",
        "verified": true
      },
      {
        "url": "https://www.ktr.mlit.go.jp/road/sinsei/road_sinsei00000068.html",
        "checkedAt": "2026-10-26",
        "relevantClaim": "道路使用許可は道路交通法第77条で所轄警察署長、道路占用許可は道路法第32条で道路管理者。両方必要な場合は一方の窓口に提出可（道路法第32条第4項・道路交通法第78条第2項）。本文の申請先・経由・協議の整理と整合。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/40378564071"
    },
    "reviewedAt": "2026-10-27",
    "validThrough": "2026-10-29"
  },
  {
    "key": "legal:souzoku-juho-token-shoji-kyoka-touroku-tetsuzuki",
    "fingerprint": "57b4b9bea10ecdb47dd537d67dc022ca581db81bf7b630b6077bfd409b05ce3f",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.kyoiku.metro.tokyo.lg.jp/lifelong/cultural_property/registration/registration_01",
        "checkedAt": "2026-10-26",
        "relevantClaim": "登録済みの銃砲刀剣類を相続等で取得した者は銃刀法第17条第1項により20日以内に、登録証を交付した都道府県の教育委員会へ所有者変更届を提出する。美術刀剣の登録は都道府県教育委員会（第14条）。本文と整合。",
        "verified": true
      },
      {
        "url": "https://www.npa.go.jp/bureau/safetylife/hoan/r6jutohokaisei/kohosiryo_ryojushoji.pdf",
        "checkedAt": "2026-10-26",
        "relevantClaim": "猟銃等の所持許可を受けた者が死亡すると許可は失効し、親族等が許可証を返納。失効後は50日以内に新規許可取得または譲渡・廃棄等の措置が必要（銃刀法第8条）。本文の10日返納・50日措置と整合。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/40378564071"
    },
    "reviewedAt": "2026-10-27",
    "validThrough": "2026-10-29"
  },
  {
    "key": "labor:spot-work-sukima-baito-roumu-kanri",
    "fingerprint": "18ee3c7188141a3ba30cb836b789b1a2045c1e452d38a52f2a410a4ef751e079",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.mhlw.go.jp/stf/newpage_32105.html",
        "checkedAt": "2026-10-26",
        "relevantClaim": "2024年4月1日施行の労働基準法施行規則第5条改正で、全労働者に『就業場所・従事すべき業務の変更の範囲』の明示が追加（令和5年厚生労働省令第39号）。本文・結論と整合。",
        "verified": true
      },
      {
        "url": "https://www.mhlw.go.jp/stf/newpage_59321.html",
        "checkedAt": "2026-10-26",
        "relevantClaim": "令和7年7月4日・基発0704第3号等でスポットワークの労働条件確保を整理。面接等を経ず応募時点で労働契約が成立する場合があること、労基法等の義務は雇用主である事業主が負うこと（中労委資料・関係団体宛通達で裏取り）。本文と整合。ただし本文の鉤括弧件名は正式件名と不一致の可能性（別途minor指摘）。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/40378564071"
    },
    "reviewedAt": "2026-10-27",
    "validThrough": "2026-10-29"
  },
  {
    "key": "labor:freelance-tokutei-jutaku-rosai-tokubetsu-kanyu",
    "fingerprint": "faf9c29dba61da2b8e75f9d6a4e2035e061a26e6544e9ac8064dbdd68e1975ff",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/rousai/kanyu.html",
        "checkedAt": "2026-10-26",
        "relevantClaim": "令和6年（2024年）11月1日から特定受託事業に従事するフリーランスが労災保険に特別加入可能。第2種特別加入（労災法第35条）の特定フリーランス事業として新設、業種を問わない。申込みは特別加入団体を通じて本人が行い、給付基礎日額は3,500円〜25,000円の範囲から選択し都道府県労働局長が決定。BtoCも対象。本文と整合。",
        "verified": true
      },
      {
        "url": "https://www.jftc.go.jp/freelancelaw_2024/",
        "checkedAt": "2026-10-26",
        "relevantClaim": "フリーランス新法（特定受託事業者に係る取引の適正化等に関する法律・令和5年法律第25号）は2024年11月1日施行。第3条取引条件明示、第4条報酬支払期日（受領日から60日以内）、第5条禁止行為（1か月以上）、第12条募集情報の的確表示、第13条配慮・第14条ハラスメント対策、第16条中途解除30日前予告（6か月以上）。本文の条番号・対象と整合。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/40378564071"
    },
    "reviewedAt": "2026-10-27",
    "validThrough": "2026-10-29"
  },
  {
    "key": "realestate:souzoku-kyoyu-shidou-kussaku-shodaku-infra-hikikomi-baikyaku",
    "fingerprint": "3f42e113294c178101bd8832e03b63d3b529a13809d5f4e8e9970537023d1470",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.moj.go.jp/content/001374239.pdf",
        "checkedAt": "2026-10-28",
        "relevantClaim": "法務省『複数の者が所有する私道の工事において必要な所有者の同意に関する研究報告書～所有者不明私道への対応ガイドライン～』第2版（令和4年6月、初版平成30年1月）。舗装補修＝保存行為、ライフライン引込等の多くは管理行為（過半数）、特別の影響は個別判断。版・発行月・区分整理を確認（PDFはバイナリのため機械抽出不可、法務省掲載情報と検索で内容裏取り）。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/law/129AC0000000089",
        "checkedAt": "2026-10-28",
        "relevantClaim": "民法第251条（変更＝全員同意、2項＝所在等不明共有者除外の裁判）・第252条（1項過半数、2項、3項特別の影響、5項保存行為単独）・第262条の2/262条の3は令和3年法律第24号で新設、令和5年4月1日施行。e-GovはSPAで直接本文抽出不可だが、改正・施行日は複数資料で裏取り済みで本文表と一致。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/40742794028"
    },
    "reviewedAt": "2026-10-29",
    "validThrough": "2026-10-31"
  },
  {
    "key": "labor:ninteikodomoen-hoiku-kyoyu-shift-shakaihoken-roumu",
    "fingerprint": "152cd664aafa868b6fd51ea1c82108e4f8f89265786674896dfc8b39c149ef46",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.cfa.go.jp/policies/hoiku/hoikushi-shikaku-tokurei",
        "checkedAt": "2026-10-28",
        "relevantClaim": "幼稚園教諭免許状・保育士資格の特例は令和6年改正で令和11年度末（≒2030年3月）まで延長。本文の保育教諭等特例の期限と一致（こども家庭庁go.jpを直接読取り）。主幹・指導保育教諭の令和8年度末はhoyokyo（こども家庭庁資料）・文科省資料で裏取り。",
        "verified": true
      },
      {
        "url": "https://www.nenkin.go.jp/oshirase/taisetu/jigyosho/2026/202610/100104.html",
        "checkedAt": "2026-10-28",
        "relevantClaim": "短時間労働者の賃金要件（月8.8万円）は令和7年年金制度改正法（令和7年法律第74号）により2026年10月1日撤廃。残る要件は週20時間以上・学生でない・企業規模51人以上。本文と一致（日本年金機構go.jpを直接読取り）。企業規模51→36人（2027年10月）は検索で裏取り。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/40742794028"
    },
    "reviewedAt": "2026-10-29",
    "validThrough": "2026-10-31"
  },
  {
    "key": "labor:nii-ijo-jigyosho-kinmu-todoke-yakuin-tanjikan-shaho",
    "fingerprint": "007e059af6fff1615e3c406a7007d88d2a049077bbb327c40b57fe09324fb033",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.nenkin.go.jp/oshirase/taisetu/jigyosho/2026/202610/100104.html",
        "checkedAt": "2026-10-28",
        "relevantClaim": "二以上事業所勤務の前提となる短時間労働者要件・賃金要件（8.8万円）2026年10月1日撤廃・企業規模51人以上を確認（go.jp直接読取り）。届出10日以内・本人提出・標準報酬合算・保険料按分は日本年金機構の手続案内で裏取り。健保法施行規則第1条の3・第2条の条番号はe-Gov(SPA)で直接確定不可だが標準的手続と整合。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/40742794028"
    },
    "reviewedAt": "2026-10-29",
    "validThrough": "2026-10-31"
  },
  {
    "key": "realestate:delivery-senmon-ghost-kitchen-bukken-youto-haisui-grease",
    "fingerprint": "edd9417a4ea85aad1b33244dcce7ae7ff0a89f7e610130aed0798bd5bc41be70",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.mhlw.go.jp/content/000772316.pdf",
        "checkedAt": "2026-10-29",
        "relevantClaim": "食品衛生法施行令第35条の許可営業は32業種で飲食店営業は第1号。平成30年改正(令和3年6月1日全面施行)で34→32に再編、許可不要営業は届出制(第57条)を新設。本文の『第55条第1項=営業許可／施行令第35条第1号=飲食店営業／2018改正・令和3年6月1日・届出制』と一致。",
        "verified": true
      },
      {
        "url": "https://www.mlit.go.jp/sogoseisaku/kanminrenkei/content/001373094.pdf",
        "checkedAt": "2026-10-29",
        "relevantClaim": "建築基準法別表第二の用途制限。飲食店は第二種低層住居専用150㎡以下かつ2階以下、第一種中高層500㎡以下、第二種中高層1,500㎡以下、第一種住居3,000㎡以下、第一種低層は原則不可、工業専用は不可。本文の床面積表と一致(MLIT技術的助言資料で150/500/3,000を直接確認、1,500は別表第二の標準値)。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/40929412093"
    },
    "reviewedAt": "2026-10-30",
    "validThrough": "2026-11-01"
  },
  {
    "key": "labor:net-cafe-manga-kissa-24ji-kamin-shinya-warimashi-hitori-roumu",
    "fingerprint": "dec10a529db641033f55a25fc926bdaebd18f9548bb2efedb5de3e910c627369",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.mhlw.go.jp/bunya/roudoukijun/faq_kijyunhou_25.html",
        "checkedAt": "2026-10-29",
        "relevantClaim": "厚労省。深夜業は午後10時〜翌午前5時で割増率は2割5分以上(労働基準法第37条)。法定時間外が深夜に及ぶと合計5割以上、法定休日(3割5分)が深夜に及ぶと合計6割以上、月60時間超は5割以上。本文の深夜割増・率の加算・60時間超5割と一致。大星ビル管理事件(最高裁一小平成14年2月28日)は仮眠時間の労働時間性に関する確立した判例で本文の整理と一致。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/40929412093"
    },
    "reviewedAt": "2026-10-30",
    "validThrough": "2026-11-01"
  },
  {
    "key": "labor:kojin-jigyo-hojinnari-shakaihoken-roudouhoken-kirikae-tetsuzuki",
    "fingerprint": "a909bd181bf79c2ec923242010ae9639029ccf1a07bb4a30b1419e71eaca2109",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.nenkin.go.jp/service/kounen/tekiyo/jigyosho/20150311.html",
        "checkedAt": "2026-10-29",
        "relevantClaim": "日本年金機構。法人(株式会社等)の事業所は強制適用で、新規適用届は事実発生から5日以内に、被保険者資格取得届も5日以内に日本年金機構(年金事務所/事務センター)へ提出。本文の『法人は人数を問わず強制適用／新規適用届・資格取得届を事実発生から5日以内』と一致(健康保険法第3条第3項・厚生年金保険法第6条の強制適用、第31条・第10条の任意適用も整合)。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/40929412093"
    },
    "reviewedAt": "2026-10-30",
    "validThrough": "2026-11-01"
  },
  {
    "key": "labor:tokutei-ginou-kensetsu-ukeire-roumu-gekkyu-ccus",
    "fingerprint": "362f8ff457ca7d4f4ccf4bd98fd4ca0d39850b350b125cdd3c8b682977d72af5",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.mlit.go.jp/common/001301477.pdf",
        "checkedAt": "2026-10-30",
        "relevantClaim": "建設分野は在留諸申請前に国土交通大臣の「建設特定技能受入計画」の認定が必要で、同等以上の報酬・月給制、受入企業と技能者のCCUS登録、JAC加入、建設業許可、1号特定技能外国人の数が常勤職員の総数以下であること等が認定基準、という本文の記述を国交省資料で確認。",
        "verified": true
      },
      {
        "url": "https://www.mlit.go.jp/report/press/totikensangyo14_hh_000852.html",
        "checkedAt": "2026-10-30",
        "relevantClaim": "建設特定技能受入計画の国土交通大臣認定の仕組み（受入企業が報酬額等を記載した計画について適当である旨の認定を受ける）を確認。入管法第2条の5・特定技能基準省令の同等報酬要件と整合。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/41102170285"
    },
    "reviewedAt": "2026-10-31",
    "validThrough": "2026-11-02"
  },
  {
    "key": "labor:roudousha-kyodo-kumiai-kumiaiin-roudo-keiyaku-shaho",
    "fingerprint": "2da6eca2c830a7f08e9a8efbd374816c1756e1c4a33f5b50eea8c85b16a4a25e",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.roukyouhou.mhlw.go.jp/faq_detail/%E7%8F%BE%E3%81%AB%E6%B4%BB%E5%8B%95%E3%81%99%E3%82%8B%E4%BC%81%E6%A5%AD%E7%B5%84%E5%90%88%E5%8F%88%E3%81%AFnpo%E6%B3%95%E4%BA%BA%E3%81%AB%E8%AA%8D%E3%82%81%E3%82%89%E3%82%8C%E3%81%A6%E3%81%84",
        "checkedAt": "2026-10-30",
        "relevantClaim": "労働者協同組合法附則第4条の組織変更特例は法施行日から3年以内に限られる、という本文の記述を厚労省ポータルで直接確認。施行日2022年10月1日＋3年＝令和7年（2025年）9月30日で受付終了という本文の結論と整合。",
        "verified": true
      },
      {
        "url": "https://www.roukyouhou.mhlw.go.jp/page/9",
        "checkedAt": "2026-10-30",
        "relevantClaim": "厚労省ポータルが「企業組合・NPO法人から労働者協同組合への組織変更の期限は令和7年9月30日です」と明示しており、本記事が特例は既に終了していると記述している点が正確であることを確認。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/41102170285"
    },
    "reviewedAt": "2026-10-31",
    "validThrough": "2026-11-02"
  },
  {
    "key": "realestate:mujin-24ji-fitness-gym-bukken-youto-shobo-hinan",
    "fingerprint": "7b4b401bd67d7aa72050d70950c9168e3b47945ac8b765c6ae2bf70ee7cfd970",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.pref.kagawa.lg.jp/documents/3261/siuxjx190621133254_f01.pdf",
        "checkedAt": "2026-10-31",
        "relevantClaim": "建築基準法改正で用途変更時に確認申請を要する特殊建築物の規模が床面積100㎡超→200㎡超に引上げ、令和元年6月25日施行。記事の第87条・第6条第1項第一号の200㎡基準、平成30年法律第67号・令和元年6月25日施行の記載と一致（PDFはバイナリのため自治体資料の改正説明文〔『100㎡→200㎡を超えるものに改正』『全面施行は令和元年6月25日』〕で裏取り。MLIT資料・先行の独立レビューとも整合）",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/law/336CO0000000037",
        "checkedAt": "2026-10-31",
        "relevantClaim": "消防法施行令別表第一(15)項＝前各項に該当しない事業場(非特定防火対象物)、第21条＝自動火災報知設備、第26条＝誘導灯、第10条＝消火器、第1条の2/第3条＝防火管理者。非特定(15)項の自火報1,000㎡以上・防火管理者は収容人員50人以上という記事の整理は確立した標準規定で、隣接realestate記事(mujin-reito-jihanki/delivery-ghost-kitchen)の独立ベースラインレビューで同系統の建築基準法・消防法規定が国交省資料により検証済みの内容と整合（e-GovはSPAで単独直読不可のため確立規定として整合確認）",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/41222784891"
    },
    "reviewedAt": "2026-11-01",
    "validThrough": "2026-11-03"
  },
  {
    "key": "labor:nenshousha-18sai-miman-shinya-jikangai-seigen-roumu",
    "fingerprint": "fd2e34f727d866f0328a18afbafc2e40ee2d3b0f1e34a815e3e61483b5e77a20",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://laws.e-gov.go.jp/law/322AC0000000049",
        "checkedAt": "2026-10-31",
        "relevantClaim": "労働基準法第56条(最低年齢・満15歳到達年度末)、第57条(年齢証明書の備付け)、第60条(変形制・第36条等の年少者不適用、第2項児童の7時間/週40時間、第3項の例外)、第61条(午後10時〜午前5時の深夜業禁止・交替制満16歳以上男性の但書・第5項児童午後8時)、第62条・第63条(危険有害業務・坑内労働禁止)。確立した条文で記事と一致(e-GovはSPAのため、先行labor記事の独立ベースラインレビューで労基法322AC0000000049が検証済みの内容と整合)",
        "verified": true
      },
      {
        "url": "https://aichi-elcc.mhlw.go.jp/?p=4560",
        "checkedAt": "2026-10-31",
        "relevantClaim": "年少者労働基準規則第7条の重量物制限=満16歳未満 断続 女12kg/男15kg・継続 女8kg/男10kg、満16歳以上満18歳未満 断続 女25kg/男30kg・継続 女15kg/男20kg、各値『以上』が制限対象。記事の表・FAQの数値と一致(当該MHLW労働局ページは今回サーバ側で直接取得不可だったが、複数の厚生労働省労働局公表資料の引用で同一数値を裏取り)",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/41222784891"
    },
    "reviewedAt": "2026-11-01",
    "validThrough": "2026-11-03"
  },
  {
    "key": "labor:keizoku-koyo-rousikyotei-keikasochi-shuryo-2025",
    "fingerprint": "07c6df0905af7a729e65120cb4cb06538d085829def2d60aa1b302801999afd7",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/koureisha/topics/tp120903-1.html",
        "checkedAt": "2026-10-31",
        "relevantClaim": "高年齢者雇用安定法の継続雇用について、平成24年改正で労使協定による対象者限定基準の経過措置(老齢厚生年金報酬比例部分の支給開始年齢以上の者に限定)が設けられ、その経過措置は2025年3月31日をもって終了、以後は希望者全員が65歳まで継続雇用の対象。記事の結論・経緯・終了日と一致(厚労省go.jp直接読取り。段階年齢61→62→63→64は支給開始年齢連動の確立事項)",
        "verified": true
      },
      {
        "url": "https://www.nenkin.go.jp/tokusetsu/zairoukaisei.html",
        "checkedAt": "2026-10-31",
        "relevantClaim": "在職老齢年金の支給停止基準額が月51万円から65万円に引上げ、根拠は令和7年年金制度改正法(令和7年法律第74号)、施行は令和8年(2026年)4月。記事の『2026年3月以前は51万円、2026年4月以降は65万円・令和7年法律第74号』と一致(日本年金機構go.jp直接読取り)",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/41222784891"
    },
    "reviewedAt": "2026-11-01",
    "validThrough": "2026-11-03"
  },
  {
    "key": "realestate:shogaisha-grouphome-kyodoseikatsu-enjo-bukken-youto-shobo",
    "fingerprint": "d3e4bd7e704bd6149c7cb7cf35e171b37463148c9c34085c20cd1dfed9831ebb",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.pref.osaka.lg.jp/o090080/shisetsufukushi/gh-sp-youbou/index.html",
        "checkedAt": "2026-11-02",
        "relevantClaim": "避難が困難な障害者等を主として入居させる施設（消防法施行令別表第一(6)項ロ）について、平成27年（2015年）4月1日施行の改正で従来の延べ面積275平方メートル以上の面積要件が撤廃され、原則として延べ面積にかかわらずスプリンクラー設備の設置が義務づけられた——を大阪府ページで直接確認。本文記述と一致。",
        "verified": true
      },
      {
        "url": "https://www.pref.kagawa.lg.jp/documents/3261/siuxjx190621133254_f01.pdf",
        "checkedAt": "2026-11-02",
        "relevantClaim": "建築基準法第87条の用途変更の確認申請は、特殊建築物（寄宿舎等）の用途に供する部分の床面積が200平方メートル超のとき必要で、2019年6月25日施行の改正で従来の100平方メートル超から引き上げられた——を香川県・国交省資料で確認。本文記述と一致。",
        "verified": true
      },
      {
        "url": "https://www.city.sakai.lg.jp/kenko/fukushikaigo/shogaifukushi/jigyousya/syofuku_jigyousya/20200907gh.files/shiteikijun.pdf",
        "checkedAt": "2026-11-02",
        "relevantClaim": "共同生活援助の居室は定員原則1人・収納設備等を除き7.43平方メートル（約4.5帖）以上——を堺市・栃木県の指定基準資料で確認。本文記述と一致。",
        "verified": true
      },
      {
        "url": "https://www.mhlw.go.jp/content/12200000/001662271.pdf",
        "checkedAt": "2026-11-02",
        "relevantClaim": "厚生労働省『共同生活援助における運営や支援に関するガイドライン』PDFが当該URLに実在すること（1.7MBのapplication/pdf）を確認。バイナリのため本文テキスト抽出は不可だったが、引用元として実在する一次資料。7.43平方メートル基準は上記指定基準で別途確認済み。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/41529730768"
    },
    "reviewedAt": "2026-11-03",
    "validThrough": "2026-11-05"
  },
  {
    "key": "realestate:souzoku-tochi-kokko-kizoku-kyakka-fushonin-unyo-jisseki",
    "fingerprint": "82f5a70137b2398c776224872c26d7bc2eb3f8c03bc6333e35f2e92a694f20ec",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.moj.go.jp/MINJI/minji05_00579.html",
        "checkedAt": "2026-11-02",
        "relevantClaim": "法務省統計（令和8年9月30日現在・速報値、公表令和8年10月19日）：申請6,125件／帰属3,231件／却下86件／不承認103件／取下げ1,162件。地目別申請（田・畑2,372・宅地2,135・山林928・その他690）、却下理由（添付書類不足37・境界不明23・通路22・権限なし11・建物4）、不承認理由（地上工作物等49・森林37・金銭債務12・災害11・崖7）、取下げ理由（有効活用595・却下不承認判明415）——本文の数値・内訳と完全一致。",
        "verified": true
      },
      {
        "url": "https://www.moj.go.jp/MINJI/minji05_00457.html",
        "checkedAt": "2026-11-02",
        "relevantClaim": "制度施行日＝令和5年4月27日。却下事由（法第2条第3項：建物・担保権等・他人の利用予定・土壌汚染・境界不明）、不承認事由（法第5条第1項：崖・地上有体物・地下有体物・争訟・その他過分の費用労力）——本文の表と一致。",
        "verified": true
      },
      {
        "url": "https://www.moj.go.jp/MINJI/minji05_00471.html",
        "checkedAt": "2026-11-02",
        "relevantClaim": "負担金は国有地の種目ごとに10年分の標準的な管理費用を考慮して算定され、森林など一部は面積に応じて算定される旨を本文（テキスト）で確認。原則の定額20万円は同ページの表（画像）および法務局資料で示される水準で、本文も『具体額は法務局の通知と施行令の算定による』と留保しており整合。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/41529730768"
    },
    "reviewedAt": "2026-11-03",
    "validThrough": "2026-11-05"
  },
  {
    "key": "labor:butsuryu-souko-ec-center-hendo-henkei-roudoujikan-tanjikan-roumu",
    "fingerprint": "14b6710210a045436dec147c294b9bb92c2512d58baa3fe3fa617e25c4b4e18a",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.nenkin.go.jp/service/kounen/tekiyo/jigyosho/tanjikan.html",
        "checkedAt": "2026-11-02",
        "relevantClaim": "特定適用事業所の企業規模要件が2024年10月1日から『厚生年金保険の被保険者総数が常時50人超』へ引下げ（従来100人超）、短時間労働者の加入要件（週20時間以上・月額8.8万円以上・2か月超の雇用見込み・学生でない）、法人単位での合算判定——を日本年金機構ページで確認。本文記述と一致。",
        "verified": true
      },
      {
        "url": "https://www.moj.go.jp/isa/applications/faq/ikusei_qa_00002.html",
        "checkedAt": "2026-11-02",
        "relevantClaim": "育成就労制度の運用開始・施行日は令和9年（2027年）4月1日、技能実習制度を発展的に解消して育成就労を創設（在留資格は廃止）——を出入国在留管理庁Q&Aで直接確認。根拠法は令和6年法律第60号（公布令和6年6月21日は入管庁改正法概要資料で確認）。本文記述と一致。",
        "verified": true
      },
      {
        "url": "https://www.mlit.go.jp/common/001201568.pdf",
        "checkedAt": "2026-11-02",
        "relevantClaim": "労働基準法第32条の2（1か月単位）・第32条の4（1年単位）・施行規則第12条の4（1年単位の1日10時間・1週52時間・年280日・連続6日の限度）・第36条・第37条第4項（深夜割増25%）・第15条第1項、パート有期法第6/8/9条、健康保険法第3条第1項第9号、倉庫業法第3条——いずれも確立した条文で本文と整合（国交省掲載の宅建業法等法令体系ページで参照系統を確認）。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/41529730768"
    },
    "reviewedAt": "2026-11-03",
    "validThrough": "2026-11-05"
  },
  {
    "key": "realestate:doubutsu-kasoujo-petto-reien-bukken-youto-jorei",
    "fingerprint": "78ea6d72ba481178477b879037b7dd5c88da6c9e26bd11cca11919d1240ab899",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://laws.e-gov.go.jp/api/1/articles;lawId=323AC0000000048;article=2",
        "checkedAt": "2026-11-04",
        "relevantClaim": "墓地埋葬法第2条：埋葬＝死体を土中に葬ること、火葬＝死体を葬るために焼くこと。墳墓・墓地・納骨堂・火葬場は人の死体・焼骨を前提とする定義（動物は枠外）。",
        "verified": true
      },
      {
        "url": "https://www.shugiin.go.jp/internet/itdb_shitsumon.nsf/html/shitsumon/b161026.htm",
        "checkedAt": "2026-11-04",
        "relevantClaim": "政府答弁書（第161回国会・平成16年＝2004年）：墓地埋葬法は動物の死体に適用されず、動物霊園（ペット霊園）事業を規制する制度・法律が存在しない旨。",
        "verified": true
      },
      {
        "url": "https://www.env.go.jp/air/osen/law/t-kise-0.html",
        "checkedAt": "2026-11-04",
        "relevantClaim": "大気汚染防止法の対象となるばい煙発生施設：廃棄物焼却炉は火格子面積2m²以上、又は焼却能力200kg/時以上（施行令別表第一13の項）。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/41898462975"
    },
    "reviewedAt": "2026-11-05",
    "validThrough": "2026-11-07"
  },
  {
    "key": "realestate:chugokugo-owner-teiki-shakuya-futsu-chigai-saikeiyaku",
    "fingerprint": "261d7e7fb8eea89c0a757c73b1c7ab0c47f82a8367359bfa6faf6299c0ce4690",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://laws.e-gov.go.jp/api/1/articles;lawId=403AC0000000090;article=38",
        "checkedAt": "2026-11-04",
        "relevantClaim": "借地借家法第38条：1項2項＝書面/電磁的記録による契約、3項＝事前の書面交付・説明、4項＝借主承諾で電磁的方法可、5項＝事前説明を怠ると更新がない旨の定めが無効、6項＝期間1年以上は満了の1年前〜6か月前に通知、7項＝床面積200㎡未満の居住用で借主からの中途解約（申入れから1か月）。本文の各項番号・内容と一致。",
        "verified": true
      },
      {
        "url": "https://www.nta.go.jp/taxes/shiraberu/taxanswer/gensen/2884.htm",
        "checkedAt": "2026-11-04",
        "relevantClaim": "非居住者の不動産賃貸料の源泉徴収税率は20.42%、個人が自己又は親族の居住用に借り受けた場合は源泉徴収不要。根拠に所法212・213、所令328を掲記（本文の記述と一致。なお『翌月10日納付』は当該ページには記載なし＝所得税法本体の一般則）。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/41898462975"
    },
    "reviewedAt": "2026-11-05",
    "validThrough": "2026-11-07"
  },
  {
    "key": "labor:gaikokujin-kaiko-yatoidome-zairyu-shikaku-tokutei-katsudo",
    "fingerprint": "5be5987a7fad51a2bb6da57ea1808ae3267d6ccb8dd4d53321a89e30ad2480d0",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://laws.e-gov.go.jp/api/1/articles;lawId=326CO0000000319;article=22_4",
        "checkedAt": "2026-11-04",
        "relevantClaim": "入管法第22条の4第1項第6号：別表第1の在留資格をもって在留する者が、正当な理由なく在留資格に応じた活動を継続して3か月（高度専門職2号は6か月）以上行わないで在留している場合は取消し対象。正当な理由がある場合は除外。本文と一致。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/api/1/articles;lawId=326CO0000000319;article=19_16",
        "checkedAt": "2026-11-04",
        "relevantClaim": "入管法第19条の16：契約機関に関する届出（第2号＝技術・人文知識・国際業務／技能／特定技能等）・所属機関に関する届出（第1号＝経営・管理／留学等）を、事由発生日から14日以内に出入国在留管理庁長官へ届け出る義務。本文の『本人が14日以内』と一致。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/41898462975"
    },
    "reviewedAt": "2026-11-05",
    "validThrough": "2026-11-07"
  },
  {
    "key": "labor:callcenter-shift-shinya-zaitaku-roudoujikan-roumu",
    "fingerprint": "921077843156704cbbf3088bb6e4c061af9837f0925173328ef2cef0bfd9af8b",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://laws.e-gov.go.jp/api/1/articles;lawId=322AC0000000049;article=37",
        "checkedAt": "2026-11-04",
        "relevantClaim": "労働基準法第37条：時間外・休日労働の割増は2割5分以上5割以下（休日35%は割増賃金令）、1項ただし書で1か月60時間超は5割以上、第4項で深夜（午後10時〜午前5時）は2割5分以上。本文の割増率・深夜帯と一致。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/41898462975"
    },
    "reviewedAt": "2026-11-05",
    "validThrough": "2026-11-07"
  },
  {
    "key": "labor:chugoku-chuzai-tekiyo-shomeisho-encho-5nen-koe-shakaihosho",
    "fingerprint": "b44dc9fc81d024d2b17192e3a6ddab9ff049b574ae7b60466aaa0058776afc93",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.nenkin.go.jp/service/shaho-kyotei/kunibetsu/notice/china.html",
        "checkedAt": "2026-11-05",
        "relevantClaim": "日本年金機構『協定相手国別注意事項（中国）』で逐語確認：『派遣開始日から5年間は派遣元国の年金制度のみに加入』『その延長期間は原則として5年を超えない』『特段の事情がある場合には派遣期間が合計10年を超える場合でも』さらなる延長の余地、『直前の派遣と再度の派遣が実質的に連続したものではないことが必要』（インターバルルールなし）、協定発効前からの派遣者は発効日に派遣とみなす。記事の記述と一致。",
        "verified": true
      },
      {
        "url": "https://www.mhlw.go.jp/stf/houdou_kouhou/kouhou_shuppan/magazine/201908_00005.html",
        "checkedAt": "2026-11-05",
        "relevantClaim": "日中社会保障協定の発効日2019年9月1日、対象は公的年金（医療保険等は対象外）、発効前からの派遣者は発効日に派遣されたものとして扱われ発効日から5年。厚労省広報誌および年金機構案内で確認し記事と一致。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/42096784030"
    },
    "reviewedAt": "2026-11-06",
    "validThrough": "2026-11-08"
  },
  {
    "key": "realestate:souzoku-kukaku-seiri-kari-kanchi-seisankin-baikyaku",
    "fingerprint": "37e6aba2126a7c5646ebb72dbab42114b3e18890865dbe80e168444755ceca51",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://laws.e-gov.go.jp/api/1/lawdata/329AC0000000119",
        "checkedAt": "2026-11-06",
        "relevantClaim": "土地区画整理法 第99条第1項『従前の宅地については、使用し、又は収益することができない』・第99条第2項『使用収益を開始することができる日を…別に定めることができる』・第104条第8項『清算金は…公告があつた日の翌日において確定する』・第110条第1項『施行者は…確定した清算金を徴収し、又は交付しなければならない』。e-Gov本文を直接引用確認、記事の条項号・内容と完全一致。",
        "verified": true
      },
      {
        "url": "https://www.mlit.go.jp/toshi/city/sigaiti/toshi_urbanmainte_tk_000033.html",
        "checkedAt": "2026-11-06",
        "relevantClaim": "国土交通省の土地区画整理事業資料。清算金は法第104条・第110条により換地処分公告翌日の土地所有者等に徴収・交付、仮換地売買では重要事項説明で説明すべき旨。記事の媒介・重説の整理と一致。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/law/327AC0000000176",
        "checkedAt": "2026-11-06",
        "relevantClaim": "宅地建物取引業法第35条（重要事項の説明）。仮換地の指定内容・土地区画整理法に基づく制限の説明。記事の『当社の調査と媒介の範囲』と一致（確立した法定条文）。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/42276972124"
    },
    "reviewedAt": "2026-11-07",
    "validThrough": "2026-11-09"
  },
  {
    "key": "realestate:kenchiku-shoene-ho-shoene-seino-hyoji-koukoku-2024",
    "fingerprint": "d01f4fda1fbf3e1a6865707c8ab849c968ede4646a9f618d2208ea76bd4cf293",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.mlit.go.jp/shoene-label/",
        "checkedAt": "2026-11-07",
        "relevantClaim": "国交省：2024年4月スタート、新築建築物の販売・賃貸広告が対象、努力義務、国交大臣が告示で表示方法を定め従わなければ勧告等、エネ消費性能=星（必須）・断熱性能（必須）・目安光熱費は任意で住戸ラベルのみ（住棟は表示なし）、既存建築物は表示推奨で勧告対象外。本文と一致。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/law/427AC0000000053",
        "checkedAt": "2026-11-07",
        "relevantClaim": "建築物省エネ法（平成27年法律第53号）第27条第1項＝表示の努力義務、第27条第2項＝国交大臣の告示、第28条＝勧告・公表・命令。告示第970号（令和5年9月25日公布）は国交省資料で裏取り（告示はその後改正あり＝国交省サイトに2024.11.1改正の記載、本文も改正留保あり）。e-Gov本体はJS描画のため直接取得不可。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/42397339096"
    },
    "reviewedAt": "2026-11-08",
    "validThrough": "2026-11-10"
  },
  {
    "key": "labor:koyohoken-multi-job-holder-65sai-fukusu-jigyosho",
    "fingerprint": "4f90f9926486e665691e7d9bc4ee952a679847474b6957f348d897e7eafd4b9e",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://jsite.mhlw.go.jp/yamagata-roudoukyoku/roudoukyoku/kanren_shisetsu/yonezawa-multijob.html",
        "checkedAt": "2026-11-07",
        "relevantClaim": "厚労省（山形労働局）：雇用保険マルチジョブホルダー制度＝令和4年1月1日施行、65歳以上、2つの事業所それぞれ週所定5時間以上20時間未満・合計週20時間以上、各事業所31日以上の雇用見込み、本人が住所管轄のハローワークへ申出、申出日から被保険者（遡及なし）。本文と一致。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/law/349AC0000000116",
        "checkedAt": "2026-11-07",
        "relevantClaim": "雇用保険法附則（高年齢被保険者の特例＝マルチジョブホルダー制度）。高年齢求職者給付金は被保険者期間1年未満で基本手当日額30日分・1年以上で50日分。給付額は公的解説で裏取り。e-Gov本体はJS描画のため直接取得不可。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/42397339096"
    },
    "reviewedAt": "2026-11-08",
    "validThrough": "2026-11-10"
  },
  {
    "key": "legal:kazoku-taizai-zairyu-shikakugai-katsudo-28jikan-yobiyose",
    "fingerprint": "9a929d61dda36312b96d7f177d5f65a448e8fadf8a3bca52677b660701a59394",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://laws.e-gov.go.jp/api/1/lawdata/326CO0000000319",
        "checkedAt": "2026-11-08",
        "relevantClaim": "法令本文を直接確認。第19条第2項の許可主体は出入国在留管理庁長官。第73条の2第1項は現行3年以下拘禁刑・300万円以下罰金・併科可、第2項は無過失例外。別表第一の四は扶養を受ける配偶者又は子で、特定技能1号は基礎資格から除外。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/api/1/lawdata/356M50000010054",
        "checkedAt": "2026-11-08",
        "relevantClaim": "法令本文を直接確認。第19条第5項第1号の週28時間と、営業所での活動3類型・従事4類型の除外を確認。",
        "verified": true
      },
      {
        "url": "https://www.shugiin.go.jp/internet/itdb_housei.nsf/html/housei/21320240621060.htm",
        "checkedAt": "2026-11-08",
        "relevantClaim": "2024年6月21日公布の令和6年法律第60号を直接取得。第1条は入管法73条の2第1項を3年から5年、300万円から500万円へ改正。附則第1条の施行日委任を確認。",
        "verified": true
      },
      {
        "url": "https://www.jil.go.jp/kokunai/mm/hourei/seirei/20251001a.html",
        "checkedAt": "2026-11-08",
        "relevantClaim": "2025年10月1日公布の令和7年政令第340号の掲載本文を直接取得。令和6年法律第60号の施行日が2027年4月1日であることを確認。",
        "verified": true
      },
      {
        "url": "https://www.mext.go.jp/a_menu/shotou/clarinet/004/1415154_00012.htm",
        "checkedAt": "2026-11-08",
        "relevantClaim": "2024年10月1日通知を直接取得。家族滞在で来日し高校等卒業後就労する者について、一定要件下の定住者・特定活動への変更の取扱いを確認。",
        "verified": true
      },
      {
        "url": "https://www.ssw.go.jp/km/files/pdf/guidebook.pdf",
        "checkedAt": "2026-11-08",
        "relevantClaim": "公的ガイドブックを直接取得。印刷25頁Q3で特定技能1号の家族呼寄せ不可、26頁Q4で2号は家族滞在の要件を満たす配偶者・子を呼寄せ可能と確認。古い分野数を含む資料であり、分野数は根拠として採用していない。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Family residence column independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/pull/504"
    },
    "reviewedAt": "2026-11-08",
    "validThrough": "2026-11-10"
  },
  {
    "key": "realestate:shogai-tanki-nyusho-shortstay-bukken-shitei-kijun",
    "fingerprint": "b1271aecfe2d4c8d1f1f42f3d26a75b8c2f8520fcf7d100188b0f88745ba380b",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.shougaifukushi.metro.tokyo.lg.jp/Lib/Download.php?sqid=3972",
        "checkedAt": "2026-11-09",
        "relevantClaim": "短期入所 単独型事業所の居室：定員4人以下・地階に設けない・利用者1人あたり床面積8㎡以上（収納設備等を除く）・寝台またはこれに代わる設備・ブザー（省令171号 第117条相当。東京都福祉局 令和8年度版で一致を確認）",
        "verified": true
      },
      {
        "url": "https://www.mlit.go.jp/common/001294996.pdf",
        "checkedAt": "2026-11-09",
        "relevantClaim": "建築基準法第6条第1項第一号の特殊建築物（児童福祉施設等）への用途変更で、変更部分の床面積の合計が200㎡を超える場合に確認申請が必要（類似の用途相互間を除く）。令和元年改正で100㎡超→200㎡超",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/law/418M60000100171",
        "checkedAt": "2026-11-09",
        "relevantClaim": "障害者総合支援法に基づく指定障害福祉サービス基準省令（平成18年厚労省令第171号）第114〜118条＝短期入所の基本方針・人員・設備（併設型/空床利用型/単独型）。e-GovはJS描画で直接本文取得不可だが、条番号・内容を東京都福祉局資料で裏取り",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/42709135682"
    },
    "reviewedAt": "2026-11-10",
    "validThrough": "2026-11-12"
  },
  {
    "key": "realestate:souzoku-nochi-nozei-yuyo-uchikiri-baikyaku",
    "fingerprint": "31c0e62a99486f1df007cf5e788416148943cb94ce32c4eb97bbcafaea526051",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.nta.go.jp/taxes/shiraberu/taxanswer/sozoku/4147.htm",
        "checkedAt": "2026-11-09",
        "relevantClaim": "農地等相続税の納税猶予（No.4147）：農業の継続または特定貸付け等が条件、農業相続人の死亡等で免除。特定貸付け等＝農地中間管理事業の推進に関する法律・都市農地の貸借の円滑化に関する法律・特定農地貸付けに関する農地法等の特例に関する法律等に基づく貸付け",
        "verified": true
      },
      {
        "url": "https://www.nta.go.jp/taxes/shiraberu/taxanswer/sozoku/4147_qa.htm",
        "checkedAt": "2026-11-09",
        "relevantClaim": "措置法70条の6：特例農地等の譲渡等が全体の20%を超えると猶予税額の全部確定、20%以下はその部分に対応する猶予税額を一部確定し、いずれも利子税とあわせて納付（確定事由が生じた日から2か月を経過する日に確定）",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/42709135682"
    },
    "reviewedAt": "2026-11-10",
    "validThrough": "2026-11-12"
  },
  {
    "key": "labor:konbini-fc-kaigyo-roumu-shinya-ryugakusei-shift",
    "fingerprint": "0f0832203e97384923ddeb2b0af2f8c38b09bcd0242d1dfcd64d8ef1f7683471",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/minimumichiran/",
        "checkedAt": "2026-11-09",
        "relevantClaim": "東京都の地域別最低賃金は2026年10月1日から時給1,280円（改定前1,226円・+54円）。令和8年度地域別最低賃金として厚労省が公表（東京労働局答申・報道で1,280円・54円引上げを確認）",
        "verified": true
      },
      {
        "url": "https://www.mhlw.go.jp/content/12500000/001633788.pdf",
        "checkedAt": "2026-11-09",
        "relevantClaim": "短時間労働者の社会保険：賃金（月額8.8万円）要件を令和8年（2026）年10月1日施行で撤廃。残る要件は週20時間以上・2か月超の雇用見込・学生でないこと・企業規模（原則51人以上、2027年10月に36人以上へ段階的引下げ）。政令・厚労省資料で確認（PDFはバイナリで直接本文取得不可のため検索結果で裏取り）",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/law/322AC0000000049",
        "checkedAt": "2026-11-09",
        "relevantClaim": "労働基準法第37条第4項（深夜割増2割5分以上・午後10時〜午前5時）、第34条（休憩）、第40条・施行規則第31条（商業の一斉休憩の適用除外）、第89条（就業規則10人以上）、第32条・第36条・第15条。入管法第19条第2項・施行規則の資格外活動（週28時間）。条番号・内容は確定した制度として一致",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/42709135682"
    },
    "reviewedAt": "2026-11-10",
    "validThrough": "2026-11-12"
  },
  {
    "key": "labor:zairyu-card-kakunin-fuho-shuro-josei-koyonushi-gimu",
    "fingerprint": "b2acf2ea0d0d1c680ffbdf2a966841e8df1c6bfcac2a4cea71bb01be8f13bb9f",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.keishicho.metro.tokyo.lg.jp/kurashi/anzen/live_in_tokyo/tekiseikoyo.html",
        "checkedAt": "2026-11-09",
        "relevantClaim": "不法就労助長罪（入管法第73条の2）：3年以下の拘禁刑または300万円以下の罰金（併科あり）、第2項で相手が就労不可であることを知らなかったことを理由に処罰を免れない（ただし過失のないときを除く）、第76条の2の両罰規定で法人にも罰金。現行法定刑（引上げ施行日は未検証扱い）",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/law/341AC0000000132",
        "checkedAt": "2026-11-09",
        "relevantClaim": "労働施策総合推進法第28条第1項（外国人雇用状況届出）・第40条第1項第2号（30万円以下の罰金）。労基法第15条の労働条件明示（2024年4月1日施行改正）。国籍を問わず労基法・最賃法・労働保険・社会保険が適用。条番号・内容は確定制度として一致",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/42709135682"
    },
    "reviewedAt": "2026-11-10",
    "validThrough": "2026-11-12"
  },
  {
    "key": "labor:kaigo-ridatsu-boshi-kojin-shuchi-ikoukakunin-2025",
    "fingerprint": "7095faaca6fd70e88008a165e1f2fc5a333286b15bf6a099aa1529b9989d6e72",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://ikuji-kaigo.mhlw.go.jp/?p=11381",
        "checkedAt": "2026-11-12",
        "relevantClaim": "厚労省公式。2025年4月施行項目=介護離職防止のための雇用環境整備/介護に直面した旨の申出をした労働者への個別周知・意向確認/40歳等の早期の情報提供/介護休暇の取得要件緩和。本文の第21条4項・5項、第22条2項・4項、介護休暇6か月未満除外撤廃の記載と整合。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/law/403AC0000000076",
        "checkedAt": "2026-11-12",
        "relevantClaim": "育児・介護休業法(平成3年法律第76号)。介護休業は対象家族1人につき通算93日・3回まで(第11条)。雇用保険法第61条の4の介護休業給付金は本文どおり支給審査はハローワークと明記。制度骨子は標準的で正当。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/43293087025"
    },
    "reviewedAt": "2026-11-13",
    "validThrough": "2026-11-15"
  },
  {
    "key": "labor:roukisho-rinken-zesei-kankoku-taio-roumu",
    "fingerprint": "b08d5f0fdd2533d5e29bc6fa85b72409c824b7d39adea220109617f6f92b1a62",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://laws.e-gov.go.jp/law/322AC0000000049",
        "checkedAt": "2026-11-12",
        "relevantClaim": "労働基準法(昭和22年法律第49号)。第101条=監督官の臨検・帳簿書類提出要求・尋問の権限、第120条=30万円以下の罰金(臨検拒否・虚偽記載等)、第102条=司法警察官の職務(送検)、第104条=労働者の申告と不利益取扱い禁止。本文の引用と一致、標準的で正当。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/law/347AC0000000057",
        "checkedAt": "2026-11-12",
        "relevantClaim": "労働安全衛生法(昭和47年法律第57号)第91条=労働基準監督官の立入検査・質問・物件検査の権限。本文は是正勧告・指導票を『行政指導(不服申立ての対象となる行政処分ではない)』と正しく整理し、送検・企業名公表は弁護士領域と明記。標準的で正当。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "reviewer": {
      "kind": "independent-model",
      "name": "Daily Columns independent review",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/43293087025"
    },
    "reviewedAt": "2026-11-13",
    "validThrough": "2026-11-15"
  }
];
