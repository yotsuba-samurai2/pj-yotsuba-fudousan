// 自動生成: 社労士「試験合格」表記・5カ国是正パッチ（社労士_試験合格表記_実装指示_v1）
// 生成元: gen-sr-patches.mjs（2026-07-08時点のFirestore実値と照合済み）
import type { LangCode } from "@/config/languages";

/** 翻訳データ: キー単位の全値置換（from照合・不一致はスキップ） */
export type SrTranslationPatch = { path: string; from: string | null; to: string };
export const SR_TRANSLATION_PATCHES: Record<LangCode, SrTranslationPatch[]> =
  {
  "ja": [
    {
      "path": "representative.qualificationsRealestate",
      "from": "宅地建物取引士・行政書士・社会保険労務士",
      "to": "宅地建物取引士・行政書士"
    },
    {
      "path": "representative.qualificationsLegal",
      "from": "行政書士・宅地建物取引士・社会保険労務士",
      "to": "行政書士・宅地建物取引士"
    },
    {
      "path": "representative.qualificationsLabor",
      "from": "社会保険労務士・行政書士・宅地建物取引士",
      "to": "行政書士・宅地建物取引士"
    },
    {
      "path": "contact.metaDescription",
      "from": "四葉パートナーズへのお問い合わせ。不動産・行政書士・社労士、どんなご相談でもお気軽にどうぞ。",
      "to": "四葉パートナーズへのお問い合わせ。不動産・行政書士、どんなご相談でもお気軽にどうぞ。"
    },
    {
      "path": "brand.groupDescription",
      "from": "不動産・行政書士・社会保険労務士のワンストップグループ。",
      "to": "不動産・行政書士のワンストップグループ。"
    },
    {
      "path": "common.footer.laborRepRegistration",
      "from": "社会保険労務士合格 浦松丈二　令和7年10月1日 第202500525号",
      "to": "社会保険労務士試験合格（2026年9月開業予定）"
    },
    {
      "path": "representative.srExamNote",
      "from": null,
      "to": "社会保険労務士試験合格（2026年9月開業予定）"
    },
    {
      "path": "legal.aboutPage.representativeBio2",
      "from": "特に補助金・助成金の申請は、事業計画の「伝え方」が採択のカギ。記者経験を活かした説得力のある申請書を作成します。また、5カ国での海外経験を活かし、外国人の在留資格・ビザ申請にも強みがあります。",
      "to": "特に補助金・助成金の申請は、事業計画の「伝え方」が採択のカギ。記者経験を活かした説得力のある申請書を作成します。また、4カ国での海外経験を活かし、外国人の在留資格・ビザ申請にも強みがあります。"
    },
    {
      "path": "legal.aboutPage.representativeBio1",
      "from": "新聞記者として世界各地を飛び回り、5カ国で暮らしてきました。その中で培った情報収集力、交渉力、そして幅広い人脈——。これらは行政書士の業務でも大きな武器になっています。",
      "to": "新聞記者として世界各地を飛び回り、4カ国で暮らしてきました。その中で培った情報収集力、交渉力、そして幅広い人脈——。これらは行政書士の業務でも大きな武器になっています。"
    },
    {
      "path": "realestate.servicesPage.sections.3.description",
      "from": "代表自身が5カ国での海外生活を経験。外国人として住まいを探す大変さを知っているからこそ、きめ細やかなサポートが可能です。",
      "to": "代表自身が4カ国での海外生活を経験。外国人として住まいを探す大変さを知っているからこそ、きめ細やかなサポートが可能です。"
    },
    {
      "path": "realestate.servicesPage.faq.1.answer",
      "from": "はい、四葉不動産は5言語対応で、外国人の方の住まい探しを専門的にサポートしています。代表自身が5カ国での海外生活経験があり、外国人として家を探す大変さを理解しています。",
      "to": "はい、四葉不動産は5言語対応で、外国人の方の住まい探しを専門的にサポートしています。代表自身が4カ国での海外生活経験があり、外国人として家を探す大変さを理解しています。"
    }
  ],
  "en": [
    {
      "path": "representative.qualificationsRealestate",
      "from": "Licensed Real Estate Transaction Specialist, Administrative Scrivener (Gyoseishoshi), Certified Social Insurance and Labor Consultant (Sharoushi)",
      "to": "Licensed Real Estate Transaction Specialist, Administrative Scrivener (Gyoseishoshi)"
    },
    {
      "path": "representative.qualificationsLegal",
      "from": "Administrative Scrivener (Gyoseishoshi), Licensed Real Estate Transaction Specialist, Certified Social Insurance and Labor Consultant (Sharoushi)",
      "to": "Administrative Scrivener (Gyoseishoshi), Licensed Real Estate Transaction Specialist"
    },
    {
      "path": "representative.qualificationsLabor",
      "from": "Certified Social Insurance and Labor Consultant (Sharoushi), Administrative Scrivener (Gyoseishoshi), Licensed Real Estate Transaction Specialist",
      "to": "Administrative Scrivener (Gyoseishoshi), Licensed Real Estate Transaction Specialist"
    },
    {
      "path": "common.footer.laborRepRegistration",
      "from": "Certified Social Insurance and Labor Consultant 浦松丈二　October 1, 2025 第202500525号",
      "to": "Passed the Certified Social Insurance and Labor Consultant Examination (opening planned for September 2026)"
    },
    {
      "path": "representative.srExamNote",
      "from": null,
      "to": "Passed the Certified Social Insurance and Labor Consultant Examination (opening planned for September 2026)"
    },
    {
      "path": "labor.aboutPage.highlights.overseas.value",
      "from": "Lived and worked in 5 countries",
      "to": "Lived and worked in 4 countries"
    },
    {
      "path": "legal.homePage.representativeBio2",
      "from": "Additionally, with experience living in 5 countries and multilingual capabilities, I have particular strength in residence status and visa applications for foreign nationals. The ability to provide a one-stop solution combining real estate (四葉不動産) and legal services is our office's greatest advantage.",
      "to": "Additionally, with experience living in 4 countries and multilingual capabilities, I have particular strength in residence status and visa applications for foreign nationals. The ability to provide a one-stop solution combining real estate (四葉不動産) and legal services is our office's greatest advantage."
    },
    {
      "path": "legal.aboutPage.representativeBio1",
      "from": "As a newspaper journalist, I traveled the world and lived in 5 countries. The information-gathering skills, negotiation expertise, and broad network I built along the way — these have proven to be great assets in administrative scrivener work as well.",
      "to": "As a newspaper journalist, I traveled the world and lived in 4 countries. The information-gathering skills, negotiation expertise, and broad network I built along the way — these have proven to be great assets in administrative scrivener work as well."
    },
    {
      "path": "legal.aboutPage.representativeBio2",
      "from": "Subsidy and grant applications in particular depend on how well you convey your business plan — and my journalism background produces persuasive applications. Additionally, with experience living in 5 countries, I have particular strength in residence status and visa applications for foreign nationals.",
      "to": "Subsidy and grant applications in particular depend on how well you convey your business plan — and my journalism background produces persuasive applications. Additionally, with experience living in 4 countries, I have particular strength in residence status and visa applications for foreign nationals."
    },
    {
      "path": "legal.aboutPage.highlights.overseas.value",
      "from": "Lived and worked in 5 countries",
      "to": "Lived and worked in 4 countries"
    },
    {
      "path": "realestate.servicesPage.sections.3.description",
      "from": "Our representative has lived in 5 countries. Because he knows firsthand the challenges of searching for a home as a foreigner, he can provide detailed and attentive support.",
      "to": "Our representative has lived in 4 countries. Because he knows firsthand the challenges of searching for a home as a foreigner, he can provide detailed and attentive support."
    },
    {
      "path": "realestate.servicesPage.faq.1.answer",
      "from": "Yes. 四葉不動産 provides specialized support for international residents in 5 languages. Our representative has lived in 5 countries and understands the challenges of finding housing as a foreigner.",
      "to": "Yes. 四葉不動産 provides specialized support for international residents in 5 languages. Our representative has lived in 4 countries and understands the challenges of finding housing as a foreigner."
    },
    {
      "path": "realestate.home.message.paragraph1",
      "from": "As a newspaper journalist, I traveled the world and lived in 5 countries. The information-gathering skills, negotiation expertise, and broad network I built along the way — I am convinced these are powerful assets in the real estate world as well.",
      "to": "As a newspaper journalist, I traveled the world and lived in 4 countries. The information-gathering skills, negotiation expertise, and broad network I built along the way — I am convinced these are powerful assets in the real estate world as well."
    },
    {
      "path": "realestate.aboutPage.representativeBio1",
      "from": "As a newspaper journalist, I traveled the world and lived in 5 countries. The information-gathering skills, negotiation expertise, and broad network I built along the way — I am convinced these are powerful assets in the real estate world as well.",
      "to": "As a newspaper journalist, I traveled the world and lived in 4 countries. The information-gathering skills, negotiation expertise, and broad network I built along the way — I am convinced these are powerful assets in the real estate world as well."
    }
  ],
  "zh-tw": [
    {
      "path": "representative.qualificationsRealestate",
      "from": "不動產交易士・行政書士・社會保險勞務士",
      "to": "不動產交易士・行政書士"
    },
    {
      "path": "representative.qualificationsLegal",
      "from": "行政書士・不動產交易士・社會保險勞務士",
      "to": "行政書士・不動產交易士"
    },
    {
      "path": "representative.qualificationsLabor",
      "from": "社會保險勞務士・行政書士・不動產交易士",
      "to": "行政書士・不動產交易士"
    },
    {
      "path": "contact.metaDescription",
      "from": "聯絡四葉パートナーズ。不動產・行政書士・社會保險勞務士，任何諮詢都歡迎。",
      "to": "聯絡四葉パートナーズ。不動產・行政書士，任何諮詢都歡迎。"
    },
    {
      "path": "brand.groupDescription",
      "from": "不動產・行政書士・社會保險勞務士一站式集團。",
      "to": "不動產・行政書士一站式集團。"
    },
    {
      "path": "common.footer.laborRepRegistration",
      "from": "社會保險勞務士合格 浦松丈二　令和7年10月1日 第202500525號",
      "to": "社會保險勞務士考試合格（預定2026年9月開業）"
    },
    {
      "path": "representative.srExamNote",
      "from": null,
      "to": "社會保險勞務士考試合格（預定2026年9月開業）"
    },
    {
      "path": "realestate.servicesPage.faq.1.answer",
      "from": "是的，四葉不動産支援5種語言，專業服務於外國人的住房搜尋。代表本人擁有5個國家的海外生活經驗，深刻理解外國人在異國找房的困難。",
      "to": "是的，四葉不動産支援5種語言，專業服務於外國人的住房搜尋。代表本人擁有4個國家的海外生活經驗，深刻理解外國人在異國找房的困難。"
    },
    {
      "path": "realestate.servicesPage.sections.3.description",
      "from": "代表本人擁有5個國家的海外生活經驗。正因為了解外國人找房的艱辛，才能提供細緻入微的支援。",
      "to": "代表本人擁有4個國家的海外生活經驗。正因為了解外國人找房的艱辛，才能提供細緻入微的支援。"
    },
    {
      "path": "realestate.aboutPage.representativeBio1",
      "from": "作為新聞記者在世界各地奔波，曾在5個國家生活。在此過程中培養的資訊收集能力、談判能力以及廣泛的人脈——我堅信這些在不動產領域也能成為強大的武器。",
      "to": "作為新聞記者在世界各地奔波，曾在4個國家生活。在此過程中培養的資訊收集能力、談判能力以及廣泛的人脈——我堅信這些在不動產領域也能成為強大的武器。"
    },
    {
      "path": "realestate.home.message.paragraph1",
      "from": "作為新聞記者在世界各地奔波，曾在5個國家生活。在此過程中培養的資訊收集能力、談判能力以及廣泛的人脈——我堅信這些在不動產領域也能成為強大的武器。",
      "to": "作為新聞記者在世界各地奔波，曾在4個國家生活。在此過程中培養的資訊收集能力、談判能力以及廣泛的人脈——我堅信這些在不動產領域也能成為強大的武器。"
    },
    {
      "path": "legal.homePage.representativeBio2",
      "from": "此外，憑藉5個國家的海外經驗和多語言能力，在外國人的在留資格・簽證申請方面也具有優勢。能夠將不動產（四葉不動産）與法務一站式解決，是本事務所的最大特色。",
      "to": "此外，憑藉4個國家的海外經驗和多語言能力，在外國人的在留資格・簽證申請方面也具有優勢。能夠將不動產（四葉不動産）與法務一站式解決，是本事務所的最大特色。"
    },
    {
      "path": "labor.aboutPage.highlights.overseas.value",
      "from": "5個國家的駐外經驗",
      "to": "4個國家的駐外經驗"
    }
  ],
  "zh": [
    {
      "path": "representative.qualificationsRealestate",
      "from": "不动产交易士・行政书士・社会保险劳务士",
      "to": "不动产交易士・行政书士"
    },
    {
      "path": "representative.qualificationsLegal",
      "from": "行政书士・不动产交易士・社会保险劳务士",
      "to": "行政书士・不动产交易士"
    },
    {
      "path": "representative.qualificationsLabor",
      "from": "社会保险劳务士・行政书士・不动产交易士",
      "to": "行政书士・不动产交易士"
    },
    {
      "path": "contact.metaDescription",
      "from": "联系四葉パートナーズ。不动产・行政书士・社会保险劳务士，任何咨询都欢迎。",
      "to": "联系四葉パートナーズ。不动产・行政书士，任何咨询都欢迎。"
    },
    {
      "path": "brand.groupDescription",
      "from": "不动产・行政书士・社会保险劳务士一站式集团。",
      "to": "不动产・行政书士一站式集团。"
    },
    {
      "path": "common.footer.laborRepRegistration",
      "from": "社会保险劳务士合格 浦松丈二　令和7年10月1日 第202500525号",
      "to": "社会保险劳务士考试合格（预定2026年9月开业）"
    },
    {
      "path": "representative.srExamNote",
      "from": null,
      "to": "社会保险劳务士考试合格（预定2026年9月开业）"
    },
    {
      "path": "realestate.servicesPage.sections.3.description",
      "from": "代表本人拥有5个国家的海外生活经验。正因为了解外国人找房的艰辛，才能提供细致入微的支持。",
      "to": "代表本人拥有4个国家的海外生活经验。正因为了解外国人找房的艰辛，才能提供细致入微的支持。"
    },
    {
      "path": "realestate.servicesPage.faq.1.answer",
      "from": "是的，四葉不動産支持5种语言，专业服务于外国人的住房搜寻。代表本人拥有5个国家的海外生活经验，深刻理解外国人在异国找房的困难。",
      "to": "是的，四葉不動産支持5种语言，专业服务于外国人的住房搜寻。代表本人拥有4个国家的海外生活经验，深刻理解外国人在异国找房的困难。"
    },
    {
      "path": "realestate.home.message.paragraph1",
      "from": "作为新闻记者在世界各地奔波，曾在5个国家生活。在此过程中培养的信息收集能力、谈判能力以及广泛的人脉——我坚信这些在不动产领域也能成为强大的武器。",
      "to": "作为新闻记者在世界各地奔波，曾在4个国家生活。在此过程中培养的信息收集能力、谈判能力以及广泛的人脉——我坚信这些在不动产领域也能成为强大的武器。"
    },
    {
      "path": "legal.aboutPage.highlights.overseas.value",
      "from": "5个国家的驻外经验",
      "to": "4个国家的驻外经验"
    },
    {
      "path": "legal.aboutPage.representativeBio1",
      "from": "作为新闻记者在世界各地奔波，曾在5个国家生活。在此过程中培养的信息收集能力、谈判能力以及广泛的人脉——这些在行政书士的业务中也成为了强大的武器。",
      "to": "作为新闻记者在世界各地奔波，曾在4个国家生活。在此过程中培养的信息收集能力、谈判能力以及广泛的人脉——这些在行政书士的业务中也成为了强大的武器。"
    }
  ]
};

/** コラム: 部分文字列置換（find出現数がcountと一致する場合のみ適用） */
export type SrColumnPatch = { path: string; find: string; replace: string; count: number };
export const SR_COLUMN_PATCHES: { id: string; slug: string; patches: SrColumnPatch[] }[] =
  [
  {
    "id": "KUlOclP5IpBYLrjCHrJ8",
    "slug": "overseas-owners-guide-japan-real-estate-sale",
    "patches": [
      {
        "path": "translations.zh-tw.content",
        "find": "三師資格保有(行政書士・社會保險勞務士・宅地建物取引士均為一次合格)",
        "replace": "行政書士・宅地建物取引士資格保有(均為一次合格)\n- 社會保險勞務士考試合格（預定2026年9月開業）",
        "count": 1
      },
      {
        "path": "translations.zh-tw.content",
        "find": "行政書士・社會保險勞務士・宅地建物取引士的三師資格",
        "replace": "行政書士・宅地建物取引士資格\n- 社會保險勞務士考試合格（預定2026年9月開業）",
        "count": 1
      },
      {
        "path": "translations.zh-tw.excerpt",
        "find": "三師資格(行政書士・社勞士・宅建士)",
        "replace": "行政書士・宅建士資格（社會保險勞務士考試合格・預定2026年9月開業）",
        "count": 1
      },
      {
        "path": "translations.zh.content",
        "find": "三师资格保有(行政书士・社会保险劳务士・宅地建物取引士均为一次合格)",
        "replace": "行政书士・宅地建物取引士资格保有(均为一次合格)\n- 社会保险劳务士考试合格（预定2026年9月开业）",
        "count": 1
      },
      {
        "path": "translations.zh.content",
        "find": "行政书士·社会保险劳务士·宅地建物取引士的三师资格",
        "replace": "行政书士·宅地建物取引士资格\n- 社会保险劳务士考试合格（预定2026年9月开业）",
        "count": 1
      },
      {
        "path": "translations.zh.excerpt",
        "find": "三师资格(行政书士·社劳士·宅建士)",
        "replace": "行政书士·宅建士资格（社会保险劳务士考试合格・预定2026年9月开业）",
        "count": 1
      },
      {
        "path": "content",
        "find": "行政書士・社会保険労務士・宅地建物取引士の三資格保有(いずれも一発合格)",
        "replace": "行政書士・宅地建物取引士の資格保有(いずれも一発合格)\n- 社会保険労務士試験合格（2026年9月開業予定）",
        "count": 1
      },
      {
        // 生成時、このfindは上の長いパターンの部分文字列でもあるため出現数を2と
        // 二重カウントしていた。初回適用で長い方が先に置換され実際は1件のため修正。
        "path": "content",
        "find": "行政書士・社会保険労務士・宅地建物取引士の三資格保有",
        "replace": "行政書士・宅地建物取引士の資格保有\n- 社会保険労務士試験合格（2026年9月開業予定）",
        "count": 1
      },
      {
        "path": "excerpt",
        "find": "行政書士・社労士(合格)・宅建士の三資格を持つ専門家",
        "replace": "行政書士・宅建士の資格を持つ専門家（社会保険労務士試験合格・2026年9月開業予定）",
        "count": 1
      }
    ]
  },
  {
    "id": "mLOT6STYFRmA43DfLTvT",
    "slug": "meiyokomon-izumihiroyasu",
    "patches": [
      {
        "path": "translations.en.content",
        "find": "Social Insurance Labor Consultant Examination Passer (October 1, 2025 / No. 202500525)",
        "replace": "Passed the Social Insurance and Labor Consultant Examination (opening planned for September 2026)",
        "count": 1
      },
      {
        "path": "translations.zh-tw.content",
        "find": "社會保險勞務士試驗合格（2025年10月1日・第202500525號）",
        "replace": "社會保險勞務士考試合格（預定2026年9月開業）",
        "count": 1
      },
      {
        "path": "translations.zh.content",
        "find": "社会保险劳务士考试合格（令和7年10月1日·第202500525号）",
        "replace": "社会保险劳务士考试合格（预定2026年9月开业）",
        "count": 1
      },
      {
        "path": "content",
        "find": "社会保険労務士試験合格（令和7年10月1日・第202500525号）",
        "replace": "社会保険労務士試験合格（2026年9月開業予定）",
        "count": 1
      }
    ]
  }
];
