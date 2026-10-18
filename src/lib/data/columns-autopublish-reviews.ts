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
  }
];
