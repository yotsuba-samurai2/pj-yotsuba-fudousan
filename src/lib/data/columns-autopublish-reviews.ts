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
  }
];
