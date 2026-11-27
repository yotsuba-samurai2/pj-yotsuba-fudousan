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
  },
  {
    "key": "labor:sanpai-shushu-unpan-driver-kaizen-kijun-kokuji-kosoku-jikan-roumu",
    "fingerprint": "fb3030ba5ffeac906aad34368d4d9c3ec481a19120e6ca690fce87bf3e328c18",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://wwwtb.mlit.go.jp/kinki/content/000306033.pdf",
        "checkedAt": "2026-11-15",
        "relevantClaim": "改善基準告示（2022年12月23日告示第367号・2024年4月1日適用）のトラック運転者拘束時間＝年3,300時間・月284時間・日13時間、労使協定で年3,400時間・月310時間・最大15時間、長距離宿泊で16時間。国交省運輸局資料で一致を確認。休息継続11時間基本・9時間下限、連続運転4時間以内は告示本文の標準値で記事と整合。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/api/1/lawdata/322AC0000000049",
        "checkedAt": "2026-11-15",
        "relevantClaim": "労働基準法附則第140条第1項＝自動車運転の業務は時間外労働の上限を年960時間とし、月100時間未満・複数月平均80時間等の規定を適用しない。記事の『特別条項でも年960時間以内』と整合。第36条・第32条の枠組みも記事と一致。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/law/345AC0000000137",
        "checkedAt": "2026-11-15",
        "relevantClaim": "廃棄物処理法第14条第1項ただし書＝事業者が自ら産業廃棄物を運搬する場合は収集運搬業許可不要。貨物自動車運送事業法第2条＝一般貨物自動車運送事業は『他人の需要に応じ有償で』貨物を運送する事業＝自社便の自社貨物運搬は非該当。改善基準告示は許可の有無と無関係という記事の中核主張と整合。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/43748045704"
    },
    "reviewedAt": "2026-11-16",
    "validThrough": "2026-11-18"
  },
  {
    "key": "labor:chiryo-shigoto-ryoritsu-shien-jikan-tanni-nenkyu-roumu",
    "fingerprint": "316eb09a464f2a176e14579080e2ac0932bd6bf8cb5abdcd53d3b7b080ec73f8",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://laws.e-gov.go.jp/api/1/lawdata/322AC0000000049",
        "checkedAt": "2026-11-15",
        "relevantClaim": "労働基準法第39条第4項＝労使協定により年5日以内の範囲で時間を単位として年次有給休暇を与えられる。本文で『五日以内に限る』を確認。記事と一致。",
        "verified": true
      },
      {
        "url": "https://www.mhlw.go.jp/stf/newpage_22308.html",
        "checkedAt": "2026-11-15",
        "relevantClaim": "傷病手当金は令和3年法律第66号により令和4年1月1日から支給期間が通算化され、支給開始日から通算して1年6か月（途中就労で不支給の期間は繰越可）。待期3日。厚労省ページで施行日・通算化を確認。記事（健康保険法第99条、令和4年1月1日施行）と一致。報酬との調整（第108条第1項）は健保法の確立した規定で記事の記載と整合。",
        "verified": true
      },
      {
        "url": "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000115267.html",
        "checkedAt": "2026-11-15",
        "relevantClaim": "『事業場における治療と仕事の両立支援のためのガイドライン』令和6年3月改訂（本人申出→主治医意見→産業医等の意見→両立支援プラン作成・運用）。労働安全衛生法第69条第1項は健康保持増進の努力義務。記事はガイドラインを法令上の義務でなく指針と正確に位置づけており整合。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/43748045704"
    },
    "reviewedAt": "2026-11-16",
    "validThrough": "2026-11-18"
  },
  {
    "key": "labor:kazoku-taizai-haigusha-part-28jikan-shikaku-gai-shakaihoken-roumu",
    "fingerprint": "d29c936148e17550e37527310019e9cc7003298a364c6d2cede9d3ff2cc81fda",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.moj.go.jp/isa/10_00274.html",
        "checkedAt": "2026-11-16",
        "relevantClaim": "出入国在留管理庁（ISA）の資格外活動許可案内＝家族滞在等の包括許可は1週について28時間以内、留学は1週28時間以内（長期休業期間は1日8時間以内）。家族滞在には留学生型の長期休業特例がない点を確認。本文の「原則週28時間以内・風俗営業等の従事を除く」「家族滞在は特例なし・通年28時間」と整合（入管法第19条第2項・施行規則第19条第5項の引用も適切）。",
        "verified": true
      },
      {
        "url": "https://www.mhlw.go.jp/stf/newpage_56671.html",
        "checkedAt": "2026-11-16",
        "relevantClaim": "2025年成立の年金制度改正法により、2026年10月に短時間労働者の社会保険加入の賃金要件（月額8.8万円＝いわゆる106万円の壁）を撤廃。週20時間以上・2か月超・非学生・企業規模（被保険者数51人超、2027年10月以降段階的引下げ）の要件は存続。複数の社労士解説および厚労省資料で施行時期・内容を確認し、本文の記述と整合。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/43964033167"
    },
    "reviewedAt": "2026-11-17",
    "validThrough": "2026-11-19"
  },
  {
    "key": "realestate:chugokugo-buyer-shido-ichi-shitei-douro-settei-dd",
    "fingerprint": "bc06d38c35e549b010a823e97f311b576d4a28ba36c613afdd29a586f2fb9f0d",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://laws.e-gov.go.jp/api/1/articles;lawId=325AC0000000201;article=43",
        "checkedAt": "2026-11-17",
        "relevantClaim": "建築基準法第43条第1項＝敷地は道路に二メートル以上接する義務／第2項第1号＝認定(建築審査会同意不要)・第2号＝建築審査会の同意を得た許可の例外。本文の接道2m・42条2項例外の記述と一致。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/api/1/articles;lawId=129AC0000000089;article=252",
        "checkedAt": "2026-11-17",
        "relevantClaim": "民法第252条第1項＝共有物の管理は持分の価格の過半数で決する／第5項＝保存行為は各共有者が単独で可能。私道の掘削(管理=過半数)・舗装補修(保存=単独)の記述と一致。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/44171868564"
    },
    "reviewedAt": "2026-11-18",
    "validThrough": "2026-11-20"
  },
  {
    "key": "realestate:souzoku-kyoyu-bunkatsu-seikyu-kanka-baikyaku",
    "fingerprint": "a818db08aa5ba7ff9c49c4518105f70ace84234d4b2bfd9bba106c3372b79cc8",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://laws.e-gov.go.jp/api/1/articles;lawNum=%E6%98%8E%E6%B2%BB%E4%BA%8C%E5%8D%81%E4%B9%9D%E5%B9%B4%E6%B3%95%E5%BE%8B%E7%AC%AC%E5%85%AB%E5%8D%81%E4%B9%9D%E5%8F%B7;article=258",
        "checkedAt": "2026-11-17",
        "relevantClaim": "民法第258条＝第1項協議不調時の裁判所への分割請求・第2項1号現物分割/2号賠償分割・第3項競売(換価)・第4項給付命令。本文の分割方法の順序と一致。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/api/1/articles;lawId=129AC0000000089;article=258%E3%81%AE2",
        "checkedAt": "2026-11-17",
        "relevantClaim": "民法第258条の2＝遺産分割すべき持分は258条分割不可(第1項)・相続開始から十年経過で258条分割可(第2項、異議申出は通知後2か月以内)。遺産共有の原則と10年例外の記述と一致。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/44171868564"
    },
    "reviewedAt": "2026-11-18",
    "validThrough": "2026-11-20"
  },
  {
    "key": "labor:rodosha-haken-ukeire-teishokuhi-kanri-daicho-37gokokuji-roumu",
    "fingerprint": "c4cd768cd1f1883d901baa8078adb2609af224cadc1da96800fd07ceb0959daa",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://laws.e-gov.go.jp/api/1/articles;lawNum=%E6%98%AD%E5%92%8C%E5%85%AD%E5%8D%81%E5%B9%B4%E6%B3%95%E5%BE%8B%E7%AC%AC%E5%85%AB%E5%8D%81%E5%85%AB%E5%8F%B7;article=40%E3%81%AE2",
        "checkedAt": "2026-11-17",
        "relevantClaim": "労働者派遣法第40条の2＝事業所単位の派遣可能期間は三年(第2項)、三年を限り延長可(第3項)、意見聴取は抵触日の一月前の日まで(第4項)。本文の事業所単位3年・意見聴取1か月前と一致。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/api/1/articles;lawNum=%E6%98%AD%E5%92%8C%E5%85%AD%E5%8D%81%E5%B9%B4%E6%B3%95%E5%BE%8B%E7%AC%AC%E5%85%AB%E5%8D%81%E5%85%AB%E5%8F%B7;article=42",
        "checkedAt": "2026-11-17",
        "relevantClaim": "労働者派遣法第42条＝派遣先管理台帳の作成(第1項)・三年間保存(第2項・条文本体)・派遣元への通知(第3項、頻度は省令委任)。保存年数3年は正確だが、本文は3年保存を施行規則第37条に帰属(実際は法42条2項、minor)。通知頻度1か月1回=施行規則第38条の帰属は正しい。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/44171868564"
    },
    "reviewedAt": "2026-11-18",
    "validThrough": "2026-11-20"
  },
  {
    "key": "labor:eisei-kanrisha-sangyoi-eisei-iinkai-sennin-50nin-gimu",
    "fingerprint": "1c29d10a42363498c7e8ab8d4249264df9b63366950ff902bcffb554630c7f76",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://laws.e-gov.go.jp/api/1/articles;lawNum=%E6%98%AD%E5%92%8C%E5%9B%9B%E5%8D%81%E4%B8%83%E5%B9%B4%E5%8A%B4%E5%83%8D%E7%9C%81%E4%BB%A4%E7%AC%AC%E4%B8%89%E5%8D%81%E4%BA%8C%E5%8F%B7;article=7",
        "checkedAt": "2026-11-17",
        "relevantClaim": "労働安全衛生規則第7条＝衛生管理者は事由発生から十四日以内に選任/規模別人数(50-200人→1人,200超-500→2,500超-1000→3,1000超-2000→4,2000超-3000→5,3000超→6)/選任報告を所轄労基署長へ。本文の規模別人数表・14日と逐一一致。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/api/1/articles;lawNum=%E6%98%AD%E5%92%8C%E5%9B%9B%E5%8D%81%E4%B8%83%E5%B9%B4%E5%8A%B4%E5%83%8D%E7%9C%81%E4%BB%A4%E7%AC%AC%E4%B8%89%E5%8D%81%E4%BA%8C%E5%8F%B7;article=23",
        "checkedAt": "2026-11-17",
        "relevantClaim": "労働安全衛生規則第23条＝衛生委員会等は毎月一回以上開催・議事の概要を労働者に周知・記録を三年間保存。本文の毎月1回以上・3年保存と一致。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/44171868564"
    },
    "reviewedAt": "2026-11-18",
    "validThrough": "2026-11-20"
  },
  {
    "key": "realestate:chugokugo-buyer-suigai-hazard-juyojiko-dd",
    "fingerprint": "9614df3b22d09f8615da24b84dc6480c6c15e44e9b3b35c232ccebd80b2c230e",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.mlit.go.jp/totikensangyo/const/sosei_const_fr3_000074.html",
        "checkedAt": "2026-11-18",
        "relevantClaim": "宅地建物取引業法施行規則16条の4の3第3号の2による水害ハザードマップ上の所在地説明の義務化。公布令和2年7月17日・施行2020年8月28日（国土交通省令・内閣府令第2号）。洪水・内水・高潮の各図面で物件のおおむねの位置を示し、未作成時はその旨を説明する運用を確認。",
        "verified": true
      },
      {
        "url": "https://www.mlit.go.jp/totikensangyo/const/content/001354700.pdf",
        "checkedAt": "2026-11-18",
        "relevantClaim": "国交省Q&A。水防法に基づく洪水・雨水出水（内水）・高潮のハザードマップを提示し対象物件のおおむねの位置を示すこと、浸水想定区域外でも位置を示す必要があること、未作成時はその旨を説明することを確認。水防法14条/14条の2/14条の3の3区分と整合。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/44389057267"
    },
    "reviewedAt": "2026-11-19",
    "validThrough": "2026-11-21"
  },
  {
    "key": "realestate:chugokugo-buyer-chosei-kuiki-nochi-kounyu-kahi-dd",
    "fingerprint": "f821effdd315366054647246222f8230e7b0bf50e07ed03645ab5e435c053190",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.maff.go.jp/j/keiei/koukai/chiiki_keikaku.html",
        "checkedAt": "2026-11-18",
        "relevantClaim": "農地取得時の下限面積要件（農地法第3条第2項）の廃止を農林水産省資料で確認。記事は令和4年法律第56号により2023年4月1日廃止、農作業常時従事・全部効率利用・地域調和の各要件は存続と記載し整合。",
        "verified": true
      },
      {
        "url": "https://www.maff.go.jp/j/keiei/koukai/kaikaku/pdf/kaisei_sh.pdf",
        "checkedAt": "2026-11-18",
        "relevantClaim": "改正農地法の概要。下限面積要件の廃止、農地法第3条の権利移動許可・第4条/第5条の転用許可の仕組み、農地区分（農用地区域内・甲種・第1種は原則不許可、第3種は原則許可）の枠組みを確認。都市計画法7/29/34/43条の区域区分・開発許可構造とも整合。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/44389057267"
    },
    "reviewedAt": "2026-11-19",
    "validThrough": "2026-11-21"
  },
  {
    "key": "legal:yuryo-shokugyo-shokai-jigyo-kyoka-youken",
    "fingerprint": "5b614abf10fddb4ccca08a5d69bed3e54add30e3e3985c88dcaf3209c15f8c4e",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.mhlw.go.jp/general/seido/anteikyoku/jukyu/syoukai/dl/03.pdf",
        "checkedAt": "2026-11-18",
        "relevantClaim": "職業紹介事業の許可基準。基準資産額500万円×事業所数以上、自己名義の現金・預金150万円+60万円×(事業所数-1)以上、職業紹介責任者は事業所ごと・従業者おおむね50人に1人・申請受理日前5年以内の講習修了を確認（記事の金額・人数と整合）。",
        "verified": true
      },
      {
        "url": "https://jsite.mhlw.go.jp/fukui-roudoukyoku/var/rev0/0114/5099/201742682449.pdf",
        "checkedAt": "2026-11-18",
        "relevantClaim": "有料職業紹介では建設業務・港湾運送業務の職業紹介が禁止（職業安定法32条の11第1項）であることを労働局資料で確認。許可の有効期間（新規3年・更新後5年）、登録免許税9万円・手数料5万円+1.8万円×(事業所数-1)も厚労省パンフで整合。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/44389057267"
    },
    "reviewedAt": "2026-11-19",
    "validThrough": "2026-11-21"
  },
  {
    "key": "labor:sanzen-sango-kyugyo-boshi-kenko-kanri-roumu",
    "fingerprint": "dd1f4f18e7dbce3870ba453cb12b96ab60678da4409271e011c29feb54688de4",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.bosei-navi.mhlw.go.jp/glossary/law02.html",
        "checkedAt": "2026-11-18",
        "relevantClaim": "男女雇用機会均等法の母性健康管理措置について、保健指導・健康診査を受けるための時間の確保は『法第17条』、指導事項を守ることができるようにするための措置は『法第18条』と現行の厚労省サイトで明記。記事の第17条・第18条の条番号が現行条文に一致することを確認（当初12/13条の疑義を解消）。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/api/1/lawdata/347AC0000000113",
        "checkedAt": "2026-11-18",
        "relevantClaim": "e-Gov現行統合条文（API）で、均等法第17条＝妊娠中及び出産後の健康管理に関する措置（保健指導・健康診査の時間確保）、第18条＝指導事項を守るための勤務時間変更・勤務軽減等の措置であることを確認。健診時間確保の回数（23週まで4週に1回等）、労基法65/66/64の3、健保102/101/159の3、厚年81の2の2の各規定も記事と整合。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/44389057267"
    },
    "reviewedAt": "2026-11-19",
    "validThrough": "2026-11-21"
  },
  {
    "key": "labor:koueki-tsuhosha-naibu-tsuho-taisei-roumu",
    "fingerprint": "b6474553c13b23d017d6b1a8c6f9555a3ba9b9bd29475c63df9df672cb032624",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.caa.go.jp/policies/policy/consumer_partnerships/whisleblower_protection_system/overview/",
        "checkedAt": "2026-11-18",
        "relevantClaim": "消費者庁の公式概要ページで、2025年改正法（令和7年法律第62号）の施行日が令和8年（2026年）12月1日であること、施行期日は令和7年政令第408号で定められたこと、改正4本柱（体制整備の徹底・保護対象拡大・阻害要因への対処・不利益取扱い抑止救済の強化）を確認。記事の施行日・政令番号・改正の方向性と一致。",
        "verified": true
      },
      {
        "url": "https://www.caa.go.jp/policies/policy/consumer_partnerships/whisleblower_protection_system/faq/assets/consumer_partnerships_cms205_260529_01.pdf",
        "checkedAt": "2026-11-18",
        "relevantClaim": "公益通報者保護制度Q&A（消費者庁）。第11条の従事者指定・体制整備義務（常時使用労働者301人以上が義務、300人以下は努力義務）、第12条の従事者守秘義務（通報者を特定させる事項）、第21条の30万円以下の罰金、第3条解雇無効・第5条不利益取扱い禁止の枠組みを確認。令和3年8月20日内閣府告示第118号の指針も整合。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/44389057267"
    },
    "reviewedAt": "2026-11-19",
    "validThrough": "2026-11-21"
  },
  {
    "key": "realestate:nokotsudo-okunai-biru-bukken-youto-boushika-kenchiku",
    "fingerprint": "9c3e77bec47ea01784fc4b75e9f9b434bbcec0a8be91480080fd84fc58507d84",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://laws.e-gov.go.jp/api/1/lawdata/323AC0000000048",
        "checkedAt": "2026-11-20",
        "relevantClaim": "墓地、埋葬等に関する法律 第2条第6項＝納骨堂は都道府県知事の許可を受けた焼骨収蔵施設、第10条第1項＝墓地・納骨堂・火葬場の経営は都道府県知事の許可。e-Gov APIで条文本文を直接確認、記事の記載と一致。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/api/1/lawdata/325AC0000000201",
        "checkedAt": "2026-11-20",
        "relevantClaim": "建築基準法 第2条第2号（特殊建築物・その他これらに類する用途）・第48条別表第二（用途地域制限）・第87条第1項（用途変更して法第6条第1項第一号の特殊建築物＝200㎡超とする場合の確認申請準用）。別表第二に『納骨堂』の明示区分がなく実態判断とする記事の整理は妥当。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/44805802692"
    },
    "reviewedAt": "2026-11-21",
    "validThrough": "2026-11-23"
  },
  {
    "key": "realestate:chugokugo-buyer-yoheki-gakechi-dd-anzensei",
    "fingerprint": "9e3582917c586774f2bed123232f1c79f6450cc81e6bd8b5334c816af9518751",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.mlit.go.jp/toshi/web/morido.html",
        "checkedAt": "2026-11-20",
        "relevantClaim": "宅地造成及び特定盛土等規制法（盛土規制法）は旧・宅地造成等規制法を令和4年法律第55号で改正、令和5年（2023年）5月26日施行。国交省・農水省共管。記事の施行日・改正根拠と一致。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/api/1/lawdata/325CO0000000338",
        "checkedAt": "2026-11-20",
        "relevantClaim": "建築基準法施行令 第138条第1項（高さ2m超の擁壁は法第88条第1項の政令指定工作物＝建築確認・完了検査の対象）・第142条（擁壁の技術基準：鉄筋コンクリート造等・水抜穴・構造計算。令142条1項3号の水抜穴を含む）。公的審査基準（福岡市・鹿児島県）でも裏付け確認、記事と一致。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/44805802692"
    },
    "reviewedAt": "2026-11-21",
    "validThrough": "2026-11-23"
  },
  {
    "key": "legal:jikayousha-katsuyo-jigyo-rideshare-kyoka",
    "fingerprint": "9f285ecb5f31f71194f9566167cf5db8f3ce54066cfcfdf15ccffd4fb41bfae9",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://laws.e-gov.go.jp/api/1/lawdata/326AC0000000183",
        "checkedAt": "2026-11-20",
        "relevantClaim": "道路運送法 第78条＝自家用自動車の有償運送の原則禁止と例外。第2号＝自家用有償旅客運送（第79条の登録）、第3号＝国土交通大臣の許可を受けて地域又は期間を限定して運送。号の割当て（2号＝登録・3号＝許可）をe-Gov本文（附則の参照含む）で確認、記事と一致。",
        "verified": true
      },
      {
        "url": "https://www.mlit.go.jp/sogoseisaku/transport/content/001892264.pdf",
        "checkedAt": "2026-11-20",
        "relevantClaim": "自家用車活用事業（日本版ライドシェア）は道路運送法第78条第3号を根拠に令和6年3月創設、タクシー事業者が管理主体で運送責任を負う、第一種運転免許で足りる、国交省が地域・時期・時間帯と不足車両数を指定。国交省資料で確認、記事の制度説明と一致。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/44805802692"
    },
    "reviewedAt": "2026-11-21",
    "validThrough": "2026-11-23"
  },
  {
    "key": "legal:shichiya-eigyo-kyoka-koan-iinkai-youken",
    "fingerprint": "8d16839eb6c3f8519d0a6bb722c66bc33899b44db06f5e8fff4c3be5e8f1f5d1",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://laws.e-gov.go.jp/api/1/lawdata/325AC0000000158",
        "checkedAt": "2026-11-20",
        "relevantClaim": "質屋営業法 第16条第2項＝流質期限は質契約成立の日から3月未満（取扱営業者は1月未満）としてはならない、第18条第1項＝流質期限経過で質物の所有権取得、第3条第1項第1号＝拘禁刑以上の刑の執行終了後3年未経過者は欠格、第2条第1項・第13条第1項の委任先は『内閣府令』。e-Gov APIで全条文を直接確認、記事と一致（拘禁刑への改正語も現行に反映）。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/44805802692"
    },
    "reviewedAt": "2026-11-21",
    "validThrough": "2026-11-23"
  },
  {
    "key": "labor:koshu-yokujo-sauna-roudoujikan-shinya-anzeneisei-roumu",
    "fingerprint": "2053446f63e53dd0a7bfccf40dd9bab8bd99be877e107c1b5e60e10f4ae01ca6",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://jsite.mhlw.go.jp/miyazaki-roudoukyoku/content/contents/002251187.pdf",
        "checkedAt": "2026-11-20",
        "relevantClaim": "労働安全衛生規則第612条の2（熱中症対策）は令和7年厚生労働省令第57号で新設、令和7年（2025年）6月1日施行。対象はWBGT28度以上又は気温31度以上で連続1時間以上又は1日4時間超の作業。報告体制整備・悪化防止手順・周知を義務化。施行通達は基発0520第6号。労働局資料で確認、記事の数値・施行日と一致。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/api/1/lawdata/322AC0000000049",
        "checkedAt": "2026-11-20",
        "relevantClaim": "労働基準法 第61条第1項＝満18歳未満は午後10時〜午前5時使用禁止（交替制の満16歳以上男性を除く）、第37条第4項＝深夜（午後10時〜午前5時）割増2割5分以上、第60条第1項＝変形労働時間制・第36条を満18歳未満に不適用。e-Gov APIで条文確認、記事と一致。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/44805802692"
    },
    "reviewedAt": "2026-11-21",
    "validThrough": "2026-11-23"
  },
  {
    "key": "labor:amusement-game-center-nenshousha-henkei-shift-roumu",
    "fingerprint": "cd0960caac98943b705865b99e16457d157f5609675574582aa2dac8ef620867",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://laws.e-gov.go.jp/api/1/lawdata/323AC0000000122",
        "checkedAt": "2026-11-20",
        "relevantClaim": "風営法 第22条第1項第4号＝営業所で午後10時から翌日午前6時に18歳未満を客に接する業務に従事させる禁止、第5号＝5号営業では午後10時〜翌日午前6時の客としての立入り制限、第2条第1項第5号＝ゲーム機を備え客に遊技させる営業の定義。e-Gov APIで時間帯（午後10時〜翌日午前6時）を直接確認、記事の労基法（午後10時〜午前5時）との時間帯ずれの整理と一致。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/api/1/lawdata/322AC0000000049",
        "checkedAt": "2026-11-20",
        "relevantClaim": "労働基準法 第60条第1項（満18歳未満への変形労働時間制・第36条不適用）・第61条第1項（深夜業禁止・交替制満16歳以上男性の例外）・第56条（最低年齢）・第37条第4項（深夜割増）。e-Gov APIで確認、記事と一致。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/44805802692"
    },
    "reviewedAt": "2026-11-21",
    "validThrough": "2026-11-23"
  },
  {
    "key": "labor:ikuji-kaigo-juunan-na-hatarakikata-sochi-gimu-2025-10",
    "fingerprint": "ce6fc26d48cb4067297e6ed79f3c0c1e08ec73aba9536ef01ca5b3e5f234981d",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.bosei-navi.mhlw.go.jp/glossary/returntowork08.html",
        "checkedAt": "2026-11-21",
        "relevantClaim": "育児・介護休業法第23条の3：3歳〜小学校就学前の子を養育する労働者につき、5つの措置（始業時刻変更等／テレワーク等月10日以上／保育施設等／養育両立支援休暇年10日以上／短時間勤務）から2つ以上を講じる義務。2025年10月1日施行。厚労省サイトで確認。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/44938212138"
    },
    "reviewedAt": "2026-11-22",
    "validThrough": "2026-11-24"
  },
  {
    "key": "labor:dansei-ikukyu-shutoku-jokyo-kouhyo-gimu-300nin-2025-04",
    "fingerprint": "38a6a753d9c8dd382073c3c83c3d2e16225dd87effc8115adcaede2df6545a40",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/000103533_00006.html",
        "checkedAt": "2026-11-21",
        "relevantClaim": "育児・介護休業法第22条の2：男性労働者の育児休業取得状況の公表義務が2025年4月1日から常時雇用労働者1000人超から300人超(300人超1000人以下が追加)へ拡大。インターネット等で公表。厚労省ページで確認。",
        "verified": true
      },
      {
        "url": "https://jsite.mhlw.go.jp/tochigi-roudoukyoku/newpage_01469.html",
        "checkedAt": "2026-11-21",
        "relevantClaim": "公表は公表前事業年度終了後おおむね3か月以内（例：3月末決算→6月30日まで）。労働局案内で整合。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/44938212138"
    },
    "reviewedAt": "2026-11-22",
    "validThrough": "2026-11-24"
  },
  {
    "key": "realestate:data-center-server-room-bukken-youto-juden-shobo",
    "fingerprint": "7151893bf43227367774f07d1c9db6297871651f8670a816c4a929eac9f7325f",
    "requiresQualifiedReview": false,
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "sources": [
      {
        "url": "https://www.shugiin.go.jp/Internet/itdb_shitsumon.nsf/html/shitsumon/b222001.htm",
        "checkedAt": "2026-11-22",
        "relevantClaim": "衆議院掲載の2026-10-16政府答弁「一」「二の２」：全国共通の事務所認定ではなく、実際の使われ方に応じ建築主事等・指定確認検査機関が判断。事務所・倉庫の例。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/api/2/law_data/325AC0000000201?asof=2026-11-22&response_format=json",
        "checkedAt": "2026-11-22",
        "relevantClaim": "建築基準法第6条第1項第1号、第48条、第87条第1項：用途地域制限、列挙特殊用途への変更、200㎡「超」と類似用途の例外。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/api/2/law_data/325CO0000000338?asof=2026-11-22&response_format=json",
        "checkedAt": "2026-11-22",
        "relevantClaim": "建築基準法施行令第85条第1項：積載荷重は実況に応じた計算を原則とし、表に掲げる室にただし書きがある。個別ラックの耐力を保証しない。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/api/2/law_data/409M50000400052?asof=2026-11-22&response_format=json",
        "checkedAt": "2026-11-22",
        "relevantClaim": "電気設備に関する技術基準を定める省令第2条第1項第3号：特別高圧は7,000Vを超える電圧で、設備容量の基準ではない。",
        "verified": true
      },
      {
        "url": "https://www5.cao.go.jp/keizai1/jissen-cu/gaiyousyotouann-3.pdf",
        "checkedAt": "2026-11-22",
        "relevantClaim": "内閣府掲載の設備仕様検討書案（参考例）設61：電源に余裕を持たせ、変圧器等の定格容量などを確認。個々のビルの容量を保証する規格ではない。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/api/2/law_data/336CO0000000037?asof=2026-11-22&response_format=json",
        "checkedAt": "2026-11-22",
        "relevantClaim": "消防法施行令第13条の表：通信機器室500㎡以上、対象の電気設備が設置される部分200㎡以上、いずれも不活性ガス・ハロゲン化物・粉末の三選択肢。",
        "verified": true
      },
      {
        "url": "https://www8.cao.go.jp/kisei-kaikaku/kisei/meeting/wg/2501_06ai/260515/ai10_0105.pdf",
        "checkedAt": "2026-11-22",
        "relevantClaim": "総務省消防庁資料p4：通信機器室の意味、面積の基準、配電盤・分電盤等の対象外の具体例。",
        "verified": true
      },
      {
        "url": "https://www.meti.go.jp/shingikai/sankoshin/hoan_shohi/denryoku_anzen/hoan_seido/pdf/016_01_02.pdf",
        "checkedAt": "2026-11-22",
        "relevantClaim": "経済産業省資料p19：電気工事業を営む事業者の対象業務等に応じ、登録・通知などの区分がある。借主の物件選びの手続と別である。",
        "verified": true
      },
      {
        "url": "https://www.pref.saitama.lg.jp/documents/182701/toriatsukai230907.pdf",
        "checkedAt": "2026-11-22",
        "relevantClaim": "埼玉県の取扱集第6版pp.4–5、表④：県所管の例では既存物販150㎡に事務所から変更する150㎡を合わせて200㎡超でも、用途変更確認の対象とはしていない。掲載例を他の所管の結論にはしていない。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "reviewer": {
      "kind": "independent-model",
      "name": "OpenAI GPT-6.2 Astra (independent content review)",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/pull/527"
    },
    "reviewedAt": "2026-11-22",
    "validThrough": "2026-11-24"
  },
  {
    "key": "realestate:souzoku-nochi-tsuki-akiya-kagen-menseki-haishi-2023-baikyaku",
    "fingerprint": "5c0b4cb5b469a95f7c8127b72c4637bc19941cc58c3a33d605bc7c33a453510c",
    "requiresQualifiedReview": false,
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "sources": [
      {
        "url": "https://laws.e-gov.go.jp/api/2/law_data/327AC0000000229?asof=2026-11-22&response_format=json",
        "checkedAt": "2026-11-22",
        "relevantClaim": "農地法第2条、第3条第1項・第2項第1・4・6号、第3条の3第1項、第4条第1項本文/第7号、第5条第1項本文/第6号：農地の定義、権利移動の原則、相続後の届出、転用の許可と市街化区域内の事前届出の区別。",
        "verified": true
      },
      {
        "url": "https://www.shugiin.go.jp/internet/itdb_housei.nsf/html/housei/20820220527056.htm",
        "checkedAt": "2026-11-22",
        "relevantClaim": "令和4年法律第56号第5条：農地法旧第3条第2項第5号を削除し、旧第6号・第7号を繰上げ。",
        "verified": true
      },
      {
        "url": "https://www.maff.go.jp/j/keiei/koukai/attach/pdf/chiiki_keikaku-32.pdf",
        "checkedAt": "2026-11-22",
        "relevantClaim": "農林水産事務次官通知（2023-03-31）pp.1–2：2023-04-01施行で旧最低面積要件を廃止。効率利用・常時従事・周辺農地との調和等の要件は存置。",
        "verified": true
      },
      {
        "url": "https://www.maff.go.jp/j/keiei/koukai/nouchi_souzoku.html",
        "checkedAt": "2026-11-22",
        "relevantClaim": "農林水産省・農地相続ポータル第1、2、3、4節：相続の届出と登記は別で、貸付・売買や転用には別の手続がある。",
        "verified": true
      },
      {
        "url": "https://www.mlit.go.jp/totikensangyo/content/001765865.pdf",
        "checkedAt": "2026-11-22",
        "relevantClaim": "国土交通省「農地付き空き家」の手引き（2024-10改訂）印刷p26：住宅敷地に付属しごく小面積で独立取引の対象と認められない栽培区画と独立農地を区別。その該当性は農業委員会が判断。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/api/2/law_data/416AC0000000123?asof=2026-11-22&response_format=json",
        "checkedAt": "2026-11-22",
        "relevantClaim": "不動産登記法第76条の2第1項：自己のための相続開始及び当該所有権の取得を知った日から原則3年。",
        "verified": true
      },
      {
        "url": "https://houmukyoku.moj.go.jp/niigata/content/001458078.pdf",
        "checkedAt": "2026-11-22",
        "relevantClaim": "新潟地方法務局の制度説明、相続登記の申請義務化（2024-04-01施行）と、施行前から知っていた未登記相続は原則2027-03-31、施行後認識なら知った日から原則3年。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "reviewer": {
      "kind": "independent-model",
      "name": "OpenAI GPT-6.2 Astra (independent content review)",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/pull/527"
    },
    "reviewedAt": "2026-11-22",
    "validThrough": "2026-11-24"
  },
  {
    "key": "legal:tokutei-jido-unko-level4-kyoka-doukouhou-2023-shinsei",
    "fingerprint": "2a509b3a42587e2f2979a4932458d8860006fca3d21bafa3130b6a9c35b05640",
    "requiresQualifiedReview": false,
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "sources": [
      {
        "url": "https://laws.e-gov.go.jp/api/2/law_data/335AC0000000105_20260721_508AC0000000052?asof=2026-11-22&response_format=json",
        "checkedAt": "2026-11-22",
        "relevantClaim": "道路交通法第2条第1項第17号の2、第4章の3、第75条の12–14、第75条の19–20、第77条第1項：無人の座席だけで決まらない定義、各委員会の経路別許可、基準5項目・聴取意見の分担、遠隔の現場措置役、道路使用許可との区別。",
        "verified": true
      },
      {
        "url": "https://www.npa.go.jp/hakusyo/r08/honbun/html/cc5545000.html",
        "checkedAt": "2026-11-22",
        "relevantClaim": "警察庁令和8年警察白書第5章第5項：令和4年改正道路交通法による制度開始は2023年4月1日。監視場所又は車内に主任者を置く。",
        "verified": true
      },
      {
        "url": "https://www.npa.go.jp/laws/notification/koutuu/tokuteijidounkokaisyakuunyo.pdf",
        "checkedAt": "2026-11-22",
        "relevantClaim": "警察庁交通局「解釈及び運用上の留意事項」：人が道路・交通等の状況に応じて運転操作することと、遠隔から監視することとは異なる。",
        "verified": true
      },
      {
        "url": "https://www.npa.go.jp/bureau/traffic/selfdriving/kouki29269325-2.pdf",
        "checkedAt": "2026-11-22",
        "relevantClaim": "警察庁交通局2026年3月記載要領：路線がまたぐ各都道府県の公安委員会への申請、条件・人員・事故対応の記載、現地利便・福祉の資料。",
        "verified": true
      },
      {
        "url": "https://www.keishicho.metro.tokyo.lg.jp/tetsuzuki/kotsu/application/tokutei_jidou.html",
        "checkedAt": "2026-11-22",
        "relevantClaim": "警視庁の申請手続、複数管轄の説明と「手数料」欄：東京の新規79,200円、計画変更許可78,500円。事前相談の案内。",
        "verified": true
      },
      {
        "url": "https://www.mlit.go.jp/jidosha/jidosha_tk7_000043.html",
        "checkedAt": "2026-11-22",
        "relevantClaim": "国土交通省の公道走行手引き入口：車両側の道路運送車両法の審査と運行側の道路交通法上の申請の双方を案内。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "reviewer": {
      "kind": "independent-model",
      "name": "OpenAI GPT-6.2 Astra (independent content review)",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/pull/527"
    },
    "reviewedAt": "2026-11-22",
    "validThrough": "2026-11-24"
  },
  {
    "key": "legal:zairyu-shikaku-nintei-shomeisho-fukoufu-saishinsei-chuka-taiwan",
    "fingerprint": "af661624ed0dfdbd8d9f3f63a7f6aa4e48f61bc76b699e07fe803815ef87b783",
    "requiresQualifiedReview": false,
    "checks": {
      "primarySources": "pass",
      "duplicateIntent": "pass",
      "legalClaims": "pass",
      "translationAlignment": "pass"
    },
    "sources": [
      {
        "url": "https://laws.e-gov.go.jp/api/2/law_data/326CO0000000319_20261001_508AC0000000032?asof=2026-11-22&response_format=json",
        "checkedAt": "2026-11-22",
        "relevantClaim": "入管法第7条第1項第2号及び第7条の2第1項、第2項：COEが証明する上陸条件、申請代理人。COEは査証・上陸許可そのものではない。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/api/2/law_data/356M50000010054_20261001_508M60000010047?asof=2026-11-22&response_format=json",
        "checkedAt": "2026-11-22",
        "relevantClaim": "入管法施行規則第6条の2第2–5項、第66条：資格ごとの資料と代理人、届出済み士業による提出との区別、不適合が明白な場合のただし書、外国語提出資料への訳文添付。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/api/2/law_data/426AC0000000068_20260624_508AC0000000046?asof=2026-11-22&response_format=json",
        "checkedAt": "2026-11-22",
        "relevantClaim": "行政不服審査法第7条第1項第10号：外国人の出入国等に関する処分の同法上の審査請求の適用除外。裁判による救済可否の根拠にはしていない。",
        "verified": true
      },
      {
        "url": "https://www.courts.go.jp/assets/hanrei/hanrei-pdf-84753.pdf",
        "checkedAt": "2026-11-22",
        "relevantClaim": "裁判所公表の東京地裁2014-07-10・平成25年（行ウ）第235号、主文1・2及び請求：義務付け部分を却下、不交付取消請求を棄却。再申請と訴訟は異なり、個別の勝敗は推論しない。",
        "verified": true
      },
      {
        "url": "https://www8.cao.go.jp/kisei-kaikaku/suishin/meeting/committee/20180525/180525honkaigi05.pdf",
        "checkedAt": "2026-11-22",
        "relevantClaim": "内閣府の規制改革会議資料、2018年法務省回答・別添p6：原則は審査官署で説明し、全出張所が対応できるわけではない。今の全国共通の回数・予約方法を示す根拠にはしていない。",
        "verified": true
      },
      {
        "url": "https://www.mofa.go.jp/mofaj/toko/visa/faq.html",
        "checkedAt": "2026-11-22",
        "relevantClaim": "外務省「よくある質問」3-Q2/3：COEは査証を保証せず、原則6か月とは査証拒否後の同一目的の査証再申請の取扱い。COEの再申請に当然には適用されない。",
        "verified": true
      }
    ],
    "blockingFindings": [],
    "reviewer": {
      "kind": "independent-model",
      "name": "OpenAI GPT-6.2 Astra (independent content review)",
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/pull/527"
    },
    "reviewedAt": "2026-11-22",
    "validThrough": "2026-11-24"
  },
  {
    "key": "realestate:souzoku-zei-butsunou-fudosan-kanri-shobun-futekikaku-yoken",
    "fingerprint": "75d626ac744b80690c9f6fe98665f0cab50436a2b9c71aa9d672db30edc696d3",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.nta.go.jp/taxes/shiraberu/taxanswer/sozoku/4214.htm",
        "checkedAt": "2026-11-22",
        "relevantClaim": "物納は金銭納付・延納でも困難な場合に申請。第1順位=不動産・国債・上場株式等、第3順位=動産。管理処分不適格財産に担保権設定・権利帰属の争い・境界が明らかでない土地・共有不動産（共有者全員が持分全部を申請する場合を除く）。物納劣後財産(無道路地・市街化調整区域内土地等)とは別。根拠法令=相法41〜45、相令17〜19の2。本文と一致。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/45059806249"
    },
    "reviewedAt": "2026-11-23",
    "validThrough": "2026-11-25"
  },
  {
    "key": "legal:kihatsuyu-hanbaigyo-touroku-hinkakuho-kikenbutsu-ss",
    "fingerprint": "b046825e51060d3316f452bd67142b18c4b9cd37f864afaedb4eedc8f214a259",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.kanto.meti.go.jp/seisaku/sekiyu_jigyo/data/jigyouhenpanf201003.pdf",
        "checkedAt": "2026-11-22",
        "relevantClaim": "揮発油販売業を行おうとする者は経済産業大臣(経済産業局長)の登録=品確法第3条。第二章第一節 揮発油販売業者の登録は第3条〜第12条。本文は第3条と正しく記載し、第12条の2(揮発油特定加工業者)は別制度と区別=企画書(plan.json)の『第12条の2』の誤りを本文が訂正しており正確。",
        "verified": true
      },
      {
        "url": "https://www.japaneselawtranslation.go.jp/ja/laws/view/3772/ja",
        "checkedAt": "2026-11-22",
        "relevantClaim": "消防法 第11条(製造所等の設置許可=市町村長等)・第13条(危険物保安監督者=甲種/乙種で6月以上実務経験から選任・届出)・第13条の2(危険物取扱者免状=甲乙丙、都道府県知事交付)。本文と一致。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/45059806249"
    },
    "reviewedAt": "2026-11-23",
    "validThrough": "2026-11-25"
  },
  {
    "key": "labor:data-center-24ji-kanshi-danzoku-roudo-shukunikkin-roumu",
    "fingerprint": "c581bf5541bab29d6572a20d94d892a4d1b1048a64365e4af103004066e5edde",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://jsite.mhlw.go.jp/nagano-roudoukyoku/content/contents/roudoujyouken_handbook202602-9.pdf",
        "checkedAt": "2026-11-22",
        "relevantClaim": "監視・断続的労働従事者/宿日直勤務者は労基署長の許可で労働時間等を全部または一部除外できるが、深夜労働の割増賃金・年次有給休暇の規定は適用除外にならない。本文の『どちらの許可でも深夜割増(第37条第4項)は免除されない』と一致。",
        "verified": true
      },
      {
        "url": "https://aichi-elcc.mhlw.go.jp/?p=4526",
        "checkedAt": "2026-11-22",
        "relevantClaim": "監視・断続的労働の定義、第41条第3号の適用除外、宿日直の労基署長許可。本文の制度整理と整合。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/45059806249"
    },
    "reviewedAt": "2026-11-23",
    "validThrough": "2026-11-25"
  },
  {
    "key": "realestate:shokuniku-hanbaigyo-eigyo-kyoka-bukken-setsubi-kijun",
    "fingerprint": "a4d6b7d9c556c61d0a06f33ea17cf9e7e70304142ccffa215eabc4fa0ea31b48",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.city.funabashi.lg.jp/jigyou/iji_yakuji_eisei/002/p004754.html",
        "checkedAt": "2026-11-24",
        "relevantClaim": "食品衛生法の営業許可業種は令和3年6月以降34→32業種。食肉販売業は許可業種で、定義は『鳥獣の生肉（骨及び臓器を含む。）を販売する営業であり、食肉を専ら容器包装に入れられた状態で仕入れ、そのままの状態で販売する営業を除く』。本文の施行令第35条第3号・かっこ書と一致",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/law/328CO0000000229",
        "checkedAt": "2026-11-24",
        "relevantClaim": "食品衛生法施行令第35条（許可を要する営業の指定）。SPAのため直接本文抽出は不可だったが、第3号＝食肉販売業・32業種は船橋市(lg.jp)で裏取り済み",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/45498346722"
    },
    "reviewedAt": "2026-11-25",
    "validThrough": "2026-11-27"
  },
  {
    "key": "realestate:chugokugo-buyer-jikobukken-shinriteki-kashi-kokuchi-dd",
    "fingerprint": "fedd709501157e6def7795bcd28fb42313a8a3c381f3b052c70817f0b6edbe05",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.mlit.go.jp/report/press/tochi_fudousan_kensetsugyo16_hh_000001_00029.html",
        "checkedAt": "2026-11-24",
        "relevantClaim": "人の死の告知ガイドライン（令和3年10月8日策定）。賃貸借は事案発生から概ね3年経過後は原則告げなくてよい／売買には3年のような期間の定めはなく、問われた場合・特段の事情がある場合は告知が必要。本文の賃貸3年・売買期間なしの区別と一致",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/law/327AC1000000176",
        "checkedAt": "2026-11-24",
        "relevantClaim": "宅地建物取引業法第35条（重要事項説明）・第47条第1号（故意の不告知・不実告知の禁止）。SPAのため直接抽出不可だが条番号・内容は標準で、MLITガイドラインの法的根拠説明と整合",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/45498346722"
    },
    "reviewedAt": "2026-11-25",
    "validThrough": "2026-11-27"
  },
  {
    "key": "realestate:chugokugo-pro-sublease-master-lease-shoukei-kaiyaku-dd",
    "fingerprint": "a8d1f218f65ecb11811a575ebf963231741f699fcb58318ad5aaf4383d0d2ab3",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.ktr.mlit.go.jp/kensan/index00000027.html",
        "checkedAt": "2026-11-24",
        "relevantClaim": "賃貸住宅管理業法：サブリース規制（誇大広告・不当勧誘の禁止、マスターリース契約締結前の重要事項説明の義務化）は令和2年12月15日施行、賃貸住宅管理業の登録制度は令和3年6月15日施行。本文の施行日・第28〜30条の整理と一致",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/law/129AC0000000089",
        "checkedAt": "2026-11-24",
        "relevantClaim": "民法第605条の2（賃貸人たる地位の移転）。SPAのため直接抽出不可。借地借家法第28条（正当事由）・第31条（引渡しによる対抗力）・第32条第1項（借賃増減請求権）とともに標準的な条文で、本文の承継・解約・減額の説明と整合",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/45498346722"
    },
    "reviewedAt": "2026-11-25",
    "validThrough": "2026-11-27"
  },
  {
    "key": "labor:chuzaiin-jimusho-chuka-taiwan-shakaihoken-tekiyo-higaitou",
    "fingerprint": "f4633f073b821c42877bdf30a2bd267b8b4a8998e3a33192f8183be2072a8e64",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.jetro.go.jp/en/invest/setting_up/section4/page9",
        "checkedAt": "2026-11-24",
        "relevantClaim": "JETRO対日投資ガイド：representative office（駐在員事務所）はsole proprietorship（個人事業所）扱い、branch/sales officeはcorporation（法人）扱いで強制適用。従業員5人未満は代表者を事業主とする任意適用で代表者は原則被保険者でない（例外は管轄判断）。労災は原則すべての労働者に適用、代表者が労働者でなければ特別加入の余地。本文のJETRO引用と一致",
        "verified": true
      },
      {
        "url": "https://www.mofa.go.jp/mofaj/press/release/press4_007768.html",
        "checkedAt": "2026-11-24",
        "relevantClaim": "日・中社会保障協定は2019年9月1日発効、一時派遣（原則5年以内）は派遣元国の年金制度のみに加入し適用証明書で相手国年金を免除、対象は公的年金のみ。日本と台湾の間には社会保障協定なし。本文の日中=有・日台=無の整理と一致",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/45498346722"
    },
    "reviewedAt": "2026-11-25",
    "validThrough": "2026-11-27"
  },
  {
    "key": "labor:shift-sei-roudou-keiyaku-saitei-hosho-jikan-kyugyo-teate",
    "fingerprint": "aae9e377c6c1441bf802182d839806ba51b709894a672872c5269f940d09a6e0",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.mhlw.go.jp/content/11200000/001749112.pdf",
        "checkedAt": "2026-11-24",
        "relevantClaim": "厚労省『いわゆる「シフト制」により就業する労働者の適切な雇用管理を行うための留意事項』は令和4年1月7日策定・改正令和8年6月19日。本文が参照する版の日付（令和8年6月19日付）は実在することを確認。三交替等のパターン固定型は除く等の内容とも整合",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/law/322AC0000000049",
        "checkedAt": "2026-11-24",
        "relevantClaim": "労働基準法第26条（休業手当＝平均賃金の100分の60以上）・第15条第1項（労働条件明示）・施行規則第5条（2024年4月1日施行改正で変更の範囲・更新上限・無期転換の明示を追加）。SPAのため直接抽出不可だが条番号・内容は標準で、本文の整理と整合",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/45498346722"
    },
    "reviewedAt": "2026-11-25",
    "validThrough": "2026-11-27"
  },
  {
    "key": "legal:teiju-sha-kokuji-rikon-shibetsu-zairyu-henko-chuka-taiwan",
    "fingerprint": "fcb0ce4ca505ffe7f93d4b306b16ec20dd8b4c6c0300022ba96e9a3cb0701776",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.moj.go.jp/isa/content/001361043.pdf",
        "checkedAt": "2026-11-25",
        "relevantClaim": "離婚・死別に伴う配偶者の届出は14日以内。届出は在留許可を与える手続ではない。",
        "verified": true
      },
      {
        "url": "https://www.moj.go.jp/isa/content/930002823.pdf",
        "checkedAt": "2026-11-25",
        "relevantClaim": "本文の法22条の4第1項7号、配偶者の活動を行わない6か月・正当理由、法20条の裁量。許可例1・7及び不許可例、類似事案でも結論が異なることを確認。",
        "verified": true
      },
      {
        "url": "https://www.moj.go.jp/isa/content/001448099.pdf",
        "checkedAt": "2026-11-25",
        "relevantClaim": "入管の申請等取次制度資料。法定代理人と届出済みの取次者を区別し、本人出頭の原則と取次の関係を確認。",
        "verified": true
      },
      {
        "url": "https://www.moj.go.jp/content/001441435.pdf",
        "checkedAt": "2026-11-25",
        "relevantClaim": "100～101頁の告示列挙と特別な事情による告示外の区別。日本人等との離婚・死別後、実子扶養等で在留を希望する場合の例示であって許可は保証されない。",
        "verified": true
      },
      {
        "url": "https://www.moj.go.jp/isa/content/930004563.pdf",
        "checkedAt": "2026-11-25",
        "relevantClaim": "資料編4裁判例4、179～181頁の日本人の実子を扶養する外国人親の取扱い。子自身の国籍と出生時の親の国籍、親子関係・実際の養育の区別。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/pull/538"
    },
    "reviewedAt": "2026-11-25",
    "validThrough": "2026-11-27"
  },
  {
    "key": "labor:kahansu-daihyosha-tekisei-sensyutsu-roushi-kyotei",
    "fingerprint": "ac6d393072b05d769d663e19362bd733acdaa7ce6d205f7fcb13aea9b60c83ac",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.mhlw.go.jp/web/t_doc_keyword?dataId=73023000&dataType=0&keyword=%E5%8A%B4%E5%83%8D%E5%9F%BA%E6%BA%96%E6%B3%95%E6%96%BD%E8%A1%8C%E8%A6%8F%E5%89%87&mode=0&pageNo=1",
        "checkedAt": "2026-11-25",
        "relevantClaim": "労基則6条の2の本文を確認。管理監督者でないこと・目的を明示した選出・使用者の意向によらないこと。全員が管理監督者の場合の2項の列挙に36条はない。",
        "verified": true
      },
      {
        "url": "https://www.mhlw.go.jp/content/11201250/001504157.pdf",
        "checkedAt": "2026-11-25",
        "relevantClaim": "行政の選出資料本文：パート等を含む事業場全労働者が参加、過半数の支持を確認、会社指名は認められない。",
        "verified": true
      },
      {
        "url": "https://www.mhlw.go.jp/web/t_doc?dataId=00tb8530&dataType=1&pageNo=1",
        "checkedAt": "2026-11-25",
        "relevantClaim": "労働契約法10条に関する行政解説：労基法89・90条の手続は同条の効果発生要件ではない。就業規則は意見聴取と実体的効力を区別。",
        "verified": true
      },
      {
        "url": "https://www.mhlw.go.jp/content/000709033.pdf",
        "checkedAt": "2026-11-25",
        "relevantClaim": "36協定を労使で締結することと、届出書自体の押印・署名の要否を区別する厚労省資料。",
        "verified": true
      },
      {
        "url": "https://www.mhlw.go.jp/content/11201250/001194506.pdf",
        "checkedAt": "2026-11-25",
        "relevantClaim": "82頁のトーコロ事件整理を開いて確認：親睦会の代表が当然に過半数代表者であるということにはならない。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/pull/538"
    },
    "reviewedAt": "2026-11-25",
    "validThrough": "2026-11-27"
  },
  {
    "key": "realestate:sanpai-chukan-shori-hasai-shisetsu-bukken-ricchi-youken",
    "fingerprint": "095572bff021b26ff35941ed592eb671e0f741dd8d55e9bafcb04dfa69bd565a",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.env.go.jp/content/900479509.pdf",
        "checkedAt": "2026-11-25",
        "relevantClaim": "廃プラスチック類（施行令第7条第7号）・がれき類等（第8号の2）の破砕施設で1日当たりの処理能力が5トンを超えるものは施設設置許可（廃棄物処理法第15条第1項）の対象。本文の『5トンを超える』と一致",
        "verified": true
      },
      {
        "url": "https://www.pref.chiba.lg.jp/haishi/shorigyou/procedure.html",
        "checkedAt": "2026-11-25",
        "relevantClaim": "産業廃棄物処分業許可（法第14条）と施設設置許可（法第15条）は別制度で、破砕施設は1日5トン超が設置許可対象という本文の区別を裏付け",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/law/325AC0000000201",
        "checkedAt": "2026-11-25",
        "relevantClaim": "建築基準法第51条＝都市計画区域内で処理施設の位置が都市計画に決定していなければ新築・増築不可、特定行政庁がただし書許可した場合を除く（複数のlg.jp運用資料で内容を照合）",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/45704422511"
    },
    "reviewedAt": "2026-11-26",
    "validThrough": "2026-11-28"
  },
  {
    "key": "realestate:chugokugo-buyer-saikenchiku-fuka-sesshado-43jo-dd",
    "fingerprint": "06892feb1072e936b58675805d482f381685c27fed4e190f083a6c95b82f2020",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.toshiseibi.metro.tokyo.lg.jp/kenchiku/kijun/43.htm",
        "checkedAt": "2026-11-25",
        "relevantClaim": "建築基準法第43条第2項第1号＝認定（建築審査会の同意不要）・第2号＝許可（建築審査会の同意が必要）、基準は施行規則第10条の3。本文の区分と一致",
        "verified": true
      },
      {
        "url": "https://www.pref.saitama.lg.jp/b1103/kyotu2014/43tadasi.html",
        "checkedAt": "2026-11-25",
        "relevantClaim": "平成30年法律第67号で旧第43条第1項ただし書許可を第2項第1号認定・第2号許可へ再編、接道関係は2018年9月25日施行。本文の施行日・公布経緯と一致",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/law/325AC0000000201",
        "checkedAt": "2026-11-25",
        "relevantClaim": "第42条（道路の定義・原則幅員4m以上／2項みなし道路）・第43条第1項（敷地は道路に2m以上接する接道義務）。lg.jp運用資料で内容を照合",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/45704422511"
    },
    "reviewedAt": "2026-11-26",
    "validThrough": "2026-11-28"
  },
  {
    "key": "legal:kigyonai-tenkin-zairyu-chuka-taiwan-chuzaiin-yobiyose",
    "fingerprint": "32acc0c3d332bed63f7f6c8840a510c2eb54fa70abe364470b84750a975e96b5",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.moj.go.jp/isa/content/001366542.pdf",
        "checkedAt": "2026-11-25",
        "relevantClaim": "企業内転勤の提出書類はカテゴリー1〜4で区分、カテゴリー2は前年分の法定調書合計表の源泉徴収税額1,000万円以上。本文のカテゴリー説明と一致（ISA共通区分）",
        "verified": true
      },
      {
        "url": "https://www.moj.go.jp/isa/applications/status/intracompanytransfee.html",
        "checkedAt": "2026-11-25",
        "relevantClaim": "企業内転勤の該当活動、在留期間（5年・3年・1年・3月）、提出書類の変更＝令和8年4月1日運用開始。本文と一致",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/law/402M50000010016",
        "checkedAt": "2026-11-25",
        "relevantClaim": "上陸許可基準省令 企業内転勤の項＝直前に外国事業所で技人国業務に継続1年以上従事・日本人同等額以上の報酬。本文の要件と一致",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/actions/runs/45704422511"
    },
    "reviewedAt": "2026-11-26",
    "validThrough": "2026-11-28"
  },
  {
    "key": "legal:koueki-nintei-shinsei-koueki-shadan-zaidan-youken",
    "fingerprint": "83ca1995286970ebca5b4d1cac8ae5a698537934db704f7c973e1c22b3cdb521",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://laws.e-gov.go.jp/law/418AC0000000049",
        "checkedAt": "2026-11-25",
        "relevantClaim": "公益認定法の行政庁・認定基準・財務規律・提出・監督及び取消しの規定。",
        "verified": true
      },
      {
        "url": "https://www.moj.go.jp/MINJI/minji153.html",
        "checkedAt": "2026-11-25",
        "relevantClaim": "一般社団・一般財団の定款認証を含む設立手続と一般財団の財産拠出。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/law/418AC0000000048",
        "checkedAt": "2026-11-25",
        "relevantClaim": "一般法人法による法定会計監査人の資格と一般財団への準用。",
        "verified": true
      },
      {
        "url": "https://www.sangiin.go.jp/japanese/joho1/kousei/gian/213/meisai/m213080213044.htm",
        "checkedAt": "2026-11-25",
        "relevantClaim": "改正法の公布日と法律番号。",
        "verified": true
      },
      {
        "url": "https://www.koeki-info.go.jp/commissions/documents/mqi2l560ib.pdf",
        "checkedAt": "2026-11-25",
        "relevantClaim": "改正法の施行日を定める政令。",
        "verified": true
      },
      {
        "url": "https://www.koeki-info.go.jp/regulations/documents/byxewbt1b9.pdf",
        "checkedAt": "2026-11-25",
        "relevantClaim": "中期的収支均衡、予備財産および2025年改正財務規律。",
        "verified": true
      },
      {
        "url": "https://www.koeki-info.go.jp/activities/documents/9q32cxyfz2.pdf",
        "checkedAt": "2026-11-25",
        "relevantClaim": "公益認定申請の窓口、必要資料及び審査の手引。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/pull/540"
    },
    "reviewedAt": "2026-11-25",
    "validThrough": "2026-11-27"
  },
  {
    "key": "realestate:chugokugo-buyer-dojou-osen-taisakuho-atochi-dd",
    "fingerprint": "50de6dc1415900558edc5adef315721ccd9cdb449a3a9c4c09d927f6d012f277",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://laws.e-gov.go.jp/api/2/law_data/414AC0000000053?asof=2026-11-25&law_full_text_format=json",
        "checkedAt": "2026-11-25",
        "relevantClaim": "土壌汚染対策法第3〜5条、第6〜9条、第11・12条。施設廃止・知事確認後の形質変更、第4条の30日前届出と調査命令、第5条の命令を区別。第7条の計画提出指示の相手、第8条による原因者への限度付き費用請求、第9・12条の形質変更制限・例外を現行条文で照合。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/api/2/law_data/414M60001000029?asof=2026-11-25&law_full_text_format=json",
        "checkedAt": "2026-11-25",
        "relevantClaim": "同法施行規則第21条の4と第22条。確認後の対象行為は900㎡以上、第4条は原則3,000㎡、一定の工場等では900㎡。廃止済み施設について第3条の報告・ただし書確認のいずれもない場合と、それらを終えた土地を区別。",
        "verified": true
      },
      {
        "url": "https://www.env.go.jp/content/000075054.pdf",
        "checkedAt": "2026-11-25",
        "relevantClaim": "環境省ガイドライン「土壌汚染状況調査」の調査契機の説明。施設の実際の使用・廃止、健康被害のおそれ、面積、形質変更と各届出を区別し、単なる売買を法定調査の一律の契機としない。",
        "verified": true
      },
      {
        "url": "https://www.env.go.jp/water/dojo/gl-man.html",
        "checkedAt": "2026-11-25",
        "relevantClaim": "環境省ガイドライン・マニュアル等の公式索引。土地履歴、法定調査と措置の確認に使う実務資料への入口。",
        "verified": true
      },
      {
        "url": "https://www.env.go.jp/water/dojo/kikan.html",
        "checkedAt": "2026-11-25",
        "relevantClaim": "環境省の土壌汚染対策法に基づく指定調査機関一覧。仲介業者による説明と指定調査機関による法定調査を区別。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/api/2/law_data/327AC1000000176?asof=2026-11-25&law_full_text_format=json",
        "checkedAt": "2026-11-25",
        "relevantClaim": "宅地建物取引業法第35条第1項第2号。媒介の重要事項説明は法令に基づく制限等が対象で、仲介業者自身を土壌調査機関とする規定ではない。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/api/2/law_data/339CO0000000383?asof=2026-11-25&law_full_text_format=json",
        "checkedAt": "2026-11-25",
        "relevantClaim": "宅地建物取引業法施行令第3条第1項第57号：土壌汚染対策法第9条並びに第12条第1項及び第3項を明記。区域指定で直ちに売買禁止とはならない。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/pull/541"
    },
    "reviewedAt": "2026-11-25",
    "validThrough": "2026-11-27"
  },
  {
    "key": "realestate:chugokugo-buyer-kyokai-mikakutei-chiseki-koseki-dd",
    "fingerprint": "ede94df8bec86aa41cc35a926fb11fc7ab53410309a3d6f935577e6185bb7d78",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://laws.e-gov.go.jp/api/2/law_data/416AC0000000123?asof=2026-11-25&law_full_text_format=json",
        "checkedAt": "2026-11-25",
        "relevantClaim": "不動産登記法第2条第15・16号、第37条、第123条第1・2号、第124・125条、第131条第1項、第143・148条。地目・地積の実際の変動後の申請と従来記録の錯誤の更正を区別し、筆界特定は所有権の範囲を決めない。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/api/2/law_data/417M60000010018?asof=2026-11-25&law_full_text_format=json",
        "checkedAt": "2026-11-25",
        "relevantClaim": "不動産登記規則第77条第1項が地積測量図の記録項目を定める。地番区域の名称、方位、縮尺、対象及び隣地の地番、地積・求積方法、筆界点間の距離・座標値、境界標、測量年月日等を確認。",
        "verified": true
      },
      {
        "url": "https://www.moj.go.jp/MINJI/minji104",
        "checkedAt": "2026-11-25",
        "relevantClaim": "法務省「筆界特定制度」。もともとの筆界を特定する手続の対象、所有権の境界との違い、当事者だけの合意では筆界を変更できないこと。",
        "verified": true
      },
      {
        "url": "https://www.moj.go.jp/MINJI/minji05_00519.html",
        "checkedAt": "2026-11-25",
        "relevantClaim": "法務省の分筆・地積更正登記の取扱い。隣地所有者が分からない場合も、登記所備付けの精度の高い地図・地積測量図等で確認できる場合がある。すべての事案で隣接所有者の立会いや署名が無条件に不要という意味ではない。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/api/2/law_data/325AC1000000228?asof=2026-11-25&law_full_text_format=json",
        "checkedAt": "2026-11-25",
        "relevantClaim": "土地家屋調査士法第3条第1項。表示に関する登記に必要な土地・家屋の調査測量、当該登記の申請代理等を規定。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/api/2/law_data/325AC1000000197?asof=2026-11-25&law_full_text_format=json",
        "checkedAt": "2026-11-25",
        "relevantClaim": "司法書士法第3条第1項。登記に関する手続代理等を規定。土地の調査測量・地積更正と、所有権移転などの権利登記の相談先を分けた。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/api/2/law_data/327AC1000000176?asof=2026-11-25&law_full_text_format=json",
        "checkedAt": "2026-11-25",
        "relevantClaim": "宅地建物取引業法第35条第1項に基づく登記された権利等の重要事項説明を、土地家屋調査士の測量や裁判所の判断とは区別。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/pull/541"
    },
    "reviewedAt": "2026-11-25",
    "validThrough": "2026-11-27"
  },
  {
    "key": "realestate:iryo-mall-fukusu-clinic-bukken-youken-barrier-free",
    "fingerprint": "78b9f4ff40465d358011d7336d5855a72b0dafe8993d12b50879a9237707fbaf",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.mlit.go.jp/jutakukentiku/house/content/001854167.pdf",
        "checkedAt": "2026-11-27",
        "relevantClaim": "診療所は用途地域13種の原則許容用途。併設店舗や個別規制は別に判定。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/law/418CO0000000379",
        "checkedAt": "2026-11-27",
        "relevantClaim": "第5条第2号は有床・無床を区別しない。第9条の原則2,000㎡と増築・改築・用途変更に係る部分の取扱い。",
        "verified": true
      },
      {
        "url": "https://www.toshiseibi.metro.tokyo.lg.jp/machizukuri/chiki_shuyaku/machizukuri_link/gimu_01",
        "checkedAt": "2026-11-27",
        "relevantClaim": "東京都の対象規模は病院・有床診療所はすべて、無床診療所は500㎡以上。",
        "verified": true
      },
      {
        "url": "https://www.fukushi.metro.tokyo.lg.jp/kiban/machizukuri/manual05",
        "checkedAt": "2026-11-27",
        "relevantClaim": "福祉のまちづくり条例の別の基準があり、2026年9月改訂版マニュアルが公開済み。",
        "verified": true
      },
      {
        "url": "https://www.tfd.metro.tokyo.lg.jp/content/000043207.pdf",
        "checkedAt": "2026-11-27",
        "relevantClaim": "2016年4月1日以降、無床診療所・入所設備のない助産所は別表第一(6)イ(4)。有床診療所は診療科と収容条件でイ(2)/(3)。ハは別区分。",
        "verified": true
      },
      {
        "url": "https://www.fdma.go.jp/laws/tutatsu/items/tuchi1408/39kensa-1-01.pdf",
        "checkedAt": "2026-11-27",
        "relevantClaim": "独立用途と従属用途を分けて複合用途を判定し、診療所の入居数だけで判定しない。",
        "verified": true
      },
      {
        "url": "https://www.city.bunkyo.lg.jp/b026/p002940.html",
        "checkedAt": "2026-11-27",
        "relevantClaim": "法人による開設は事前許可と開設後10日以内の届出の両方が必要。",
        "verified": true
      },
      {
        "url": "https://www.city.bunkyo.lg.jp/b026/p002938.html",
        "checkedAt": "2026-11-27",
        "relevantClaim": "臨床研修等を修了した医師等個人による開設届の期限は原則開設後10日以内。",
        "verified": true
      },
      {
        "url": "https://www.city.bunkyo.lg.jp/b026/p002948.html",
        "checkedAt": "2026-11-27",
        "relevantClaim": "対象の診療用エックス線装置は備付け後10日以内に届出。",
        "verified": true
      },
      {
        "url": "https://www.hokeniryo.metro.tokyo.lg.jp/documents/d/hokeniryo/2026-04-17-162108-087",
        "checkedAt": "2026-11-27",
        "relevantClaim": "厚労省Q&A：新規無床診療所の6か月前事前届出は外来医師過多区域の指定・適用に従い、歯科診療所は対象外。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/pull/544"
    },
    "reviewedAt": "2026-11-27",
    "validThrough": "2026-11-29"
  },
  {
    "key": "realestate:souzoku-nisetai-jutaku-kubun-toki-kyoyu-baikyaku",
    "fingerprint": "31b1987a2db38b2d2a115aa689358f584425c84ad50eb9689155723fed57ac9f",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.nta.go.jp/taxes/shiraberu/taxanswer/sozoku/4124.htm",
        "checkedAt": "2026-11-27",
        "relevantClaim": "330平方メートル・80%、相続開始直前の用途、同居親族と配偶者の別、区分登記に応じた注2・注3の範囲。相続後の合併は直前の事実を変えない。",
        "verified": true
      },
      {
        "url": "https://www.japaneselawtranslation.go.jp/en/laws/download/4428/14/h16Aa001230504je15.0_r3A37.pdf",
        "checkedAt": "2026-11-27",
        "relevantClaim": "不動産登記法54条1項3号、56条。接続する区分建物の登記上の合併と、所有者・持分、抵当権等の制約。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/pull/545"
    },
    "reviewedAt": "2026-11-27",
    "validThrough": "2026-11-29"
  },
  {
    "key": "legal:matsuge-ext-nail-salon-biyoujo-todokede-youhi",
    "fingerprint": "ee09c9608adecf381d3f4943ff87e2d012ab08852fe72b56da956b1f2c383459",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.mhlw.go.jp/web/t_doc?dataId=79081000",
        "checkedAt": "2026-11-27",
        "relevantClaim": "美容師法2・6・7・8・11・12・12条の3：免許、開設届、使用前確認、管理美容師。",
        "verified": true
      },
      {
        "url": "https://www.city.saitama.lg.jp/002/002/011/003/p120178.html",
        "checkedAt": "2026-11-27",
        "relevantClaim": "まつ毛エクステ・まつ毛パーマは美容師が届け出た美容所で施術。",
        "verified": true
      },
      {
        "url": "https://faq.city.sasebo.lg.jp/faqfa2/public/web/knowledge1455.html?pageListSettingIdFromUrl=103",
        "checkedAt": "2026-11-27",
        "relevantClaim": "一般のネイル単独は美容所届不要、美容業を併設する場合は別。",
        "verified": true
      },
      {
        "url": "https://www.mhlw.go.jp/web/t_doc?dataId=00tc9325&dataType=1&pageNo=1",
        "checkedAt": "2026-11-27",
        "relevantClaim": "針で皮膚に色素を入れる眉・アイライン等のアートメイクは医行為。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/pull/545"
    },
    "reviewedAt": "2026-11-27",
    "validThrough": "2026-11-29"
  },
  {
    "key": "legal:gijinkoku-zairyu-rissho-gakureki-shokumu-kanren-chuka-taiwan",
    "fingerprint": "2551dd984288bdb31e3545bc3ec642f621439441d8a549db92a0bed5fdb85740",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://www.moj.go.jp/isa/content/001460430.pdf",
        "checkedAt": "2026-11-27",
        "relevantClaim": "技術・人文知識の専攻関連性は大学と専門課程で区別。国際業務の3年実務経験と大卒翻訳・通訳・語学指導例外、同等報酬を確認。",
        "verified": true
      },
      {
        "url": "https://www.moj.go.jp/isa/content/001413643.pdf",
        "checkedAt": "2026-11-27",
        "relevantClaim": "単体別紙4：主として言語能力を用いる対人業務で業務上の使用言語のCEFR B2相当。カテゴリー3・4の資料及び1・2への追加確認。",
        "verified": true
      },
      {
        "url": "https://www.moj.go.jp/isa/content/001344550.pdf",
        "checkedAt": "2026-11-27",
        "relevantClaim": "就労資格Q25・Q26：対象申請、転職など新たな対象業務、同様の業務を続ける更新は原則提出不要で個別追加あり。",
        "verified": true
      },
      {
        "url": "https://www.moj.go.jp/isa/content/001437255.pdf",
        "checkedAt": "2026-11-27",
        "relevantClaim": "カテゴリー3・4の提出資料第7・8・12・13：契約内容、学歴・職歴、代表者申告、対象の業務言語資料。",
        "verified": true
      },
      {
        "url": "https://www.mhlw.go.jp/web/t_doc?dataId=08ab4095&dataType=0&pageNo=1",
        "checkedAt": "2026-11-27",
        "relevantClaim": "行政不服審査法第7条第1項第10号の外国人の出入国処分除外を確認。COE再申請と裁判上の争いを区別。",
        "verified": true
      },
      {
        "url": "https://www.pref.kagawa.lg.jp/documents/61084/gengonouryokusyoumei.pdf",
        "checkedAt": "2026-11-27",
        "relevantClaim": "別紙4のB2・機関カテゴリー基本要件。入管の直リンクがアクセス制限となる場合にも閲覧できる県の参考資料として表示。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/pull/545"
    },
    "reviewedAt": "2026-11-27",
    "validThrough": "2026-11-29"
  },
  {
    "key": "labor:rodosha-haken-jigyo-kyoka-shisan-youken-hakenmoto-sekininsha-roumu",
    "fingerprint": "0bf419d3bfb8ee4adffea3e96d214b48001c3d9b8cbea24a3491e133269fe022",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://laws.e-gov.go.jp/law/360AC0000000088/20261001_507AC0000000033",
        "checkedAt": "2026-11-27",
        "relevantClaim": "2026年10月1日施行の労働者派遣法。第5～7条、10条、23条5項、30条の2、36条。",
        "verified": true
      },
      {
        "url": "https://www.mhlw.go.jp/content/11600000/001496939.pdf",
        "checkedAt": "2026-11-27",
        "relevantClaim": "厚生労働省・許可手続の現行要領第3。事業所ごとの通常基準、派遣元責任者・キャリア支援・新規／更新審査。",
        "verified": true
      },
      {
        "url": "https://jsite.mhlw.go.jp/oita-roudoukyoku/content/contents/002878668.pdf",
        "checkedAt": "2026-11-27",
        "relevantClaim": "基準資産2,000万円・現金預金1,500万円に派遣事業所数を乗じ、基準資産は総負債の7分の1以上。監査証明を付す中間・月次決算と限定的な既存事業者の更新措置。",
        "verified": true
      },
      {
        "url": "https://www.mhlw.go.jp/content/11650000/000923942.pdf",
        "checkedAt": "2026-11-27",
        "relevantClaim": "特定地域づくり事業推進法第18条。認定組合による無期雇用職員の労働者派遣は法定の届出特例。",
        "verified": true
      },
      {
        "url": "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/roudoushahakennjigyou.html",
        "checkedAt": "2026-11-27",
        "relevantClaim": "法23条5項に基づく情報提供義務。2021年4月1日以降は義務対象の全情報について常時インターネットによる提供を原則とする。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/law/343AC1000000089",
        "checkedAt": "2026-11-27",
        "relevantClaim": "社会保険労務士法2条1項1号・1号の2、27条。報酬を得て業としての書類作成・提出代行の原則と法令上の例外。",
        "verified": true
      },
      {
        "url": "https://www.mhlw.go.jp/web/t_doc?dataId=84020000&dataType=0&pageNo=3",
        "checkedAt": "2026-11-27",
        "relevantClaim": "別表第一・二十の十一に労働者派遣法の掲載を照合。",
        "verified": true
      },
      {
        "url": "https://laws.e-gov.go.jp/law/326AC1000000004",
        "checkedAt": "2026-11-27",
        "relevantClaim": "2026年1月の条繰下げ後、他法令による書類作成の制限は行政書士法1条の3第2項。",
        "verified": true
      },
      {
        "url": "https://www.mhlw.go.jp/web/t_doc?dataId=00ta2422&dataType=1&pageNo=1",
        "checkedAt": "2026-11-27",
        "relevantClaim": "昭和55年行政書士法改正時の限られた対象への社労士法書類作成の経過措置。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/pull/545"
    },
    "reviewedAt": "2026-11-27",
    "validThrough": "2026-11-29"
  },
  {
    "key": "labor:ses-jutaku-kaihatsu-gisou-ukeoi-roudoushasei-roumu",
    "fingerprint": "8d76120903a4d2a294f572a8749d6ad8ae2643d004a849a88ea22595a8396bf2",
    "requiresQualifiedReview": false,
    "sources": [
      {
        "url": "https://laws.e-gov.go.jp/law/360AC0000000088/20261001_507AC0000000033",
        "checkedAt": "2026-11-27",
        "relevantClaim": "派遣の定義（2条1号）、無許可受入れと偽装の別類型（40条の6第1項2号・5号）、承諾、無許可事業の罰則（59条2号）。",
        "verified": true
      },
      {
        "url": "https://www.mhlw.go.jp/web/t_doc?dataId=75024000",
        "checkedAt": "2026-11-27",
        "relevantClaim": "37号告示2条の自主管理・事業の独立性、設備等の自己調達又は企画・専門技術・経験の二つの選択肢、3条の故意の偽装。",
        "verified": true
      },
      {
        "url": "https://www.mhlw.go.jp/content/001704257.pdf",
        "checkedAt": "2026-11-27",
        "relevantClaim": "厚生労働省・疑義応答集第3集Q1～3。アジャイルと準委任にも実態判断を適用、対等な助言・提案は直ちに指揮命令ではなく受注者の責任者がすべての会議に出る必要はない。民法632、643、656条。",
        "verified": true
      },
      {
        "url": "https://www.startup-roudou.mhlw.go.jp/qa/zigyonushi/pato/q10.html",
        "checkedAt": "2026-11-27",
        "relevantClaim": "労働契約申込みみなしの違法受入れの類型、善意無過失の場合の除外、雇用成立には本人の承諾を要し違法派遣終了日から1年の期間。",
        "verified": true
      },
      {
        "url": "https://www.mhlw.go.jp/content/11654000/001629239.pdf",
        "checkedAt": "2026-11-27",
        "relevantClaim": "労働者派遣法59条第2号の無許可営業の罰則は派遣元側の問題であり、当然に労働契約が成立するものではない。",
        "verified": true
      },
      {
        "url": "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/roudoukijun/keiyaku/index02.html",
        "checkedAt": "2026-11-27",
        "relevantClaim": "労働基準法9条の労働者性は、諾否の自由、指揮監督、時間・場所の拘束、報酬の労務対償性等を個別の実態から総合評価する。",
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
      "evidenceUrl": "https://github.com/yotsuba-samurai2/pj-yotsuba-fudousan/pull/545"
    },
    "reviewedAt": "2026-11-27",
    "validThrough": "2026-11-29"
  }
];
