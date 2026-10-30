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
  }
];
