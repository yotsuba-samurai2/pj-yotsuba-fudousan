// Firestore翻訳のブランド統一＋言語数統一パッチ（緊急修正E1/E3・2026-07-10浦松承認）
// - E1: 「四葉パートナーズ」→「四葉グループ」（en=「YOTSUBA GROUP」）。対象=labor.*の残存5キー×4ロケール
//   （brand.groupName等は fix-partners-brand 適用済みのため対象外。過去パッチ履歴ファイルは変更しない）
// - E3: 言語数の「4言語対応（日本語・英語・中国語繁体字・中国語簡体字）」統一（D2決定）。
//   「5言語」「5 languages」「5種語言/5种语言」および旧5言語列挙（台湾華語・タイ語等）を4言語表記へ
// 生成=_backup/20260710_translations/ の実値から機械生成。適用は現在値照合つき（不一致はスキップ）。
// 適用ページ= /admin/translations/fix-brand-and-langs
import type { LangCode } from "@/config/languages";

export type BrandLangsPatch = { path: string; from: string; to: string };

export const BRAND_LANGS_PATCHES: Record<LangCode, BrandLangsPatch[]> = {
  "ja": [
    {
      "path": "labor.meta.description",
      "from": "社会保険・労働保険の手続き、就業規則作成、助成金申請、労務相談。四葉パートナーズの社労士法人が企業の人事・労務をトータルサポートします。",
      "to": "社会保険・労働保険の手続き、就業規則作成、助成金申請、労務相談。四葉グループの社労士法人が企業の人事・労務をトータルサポートします。"
    },
    {
      "path": "labor.homePage.metaDescription",
      "from": "社会保険・労働保険の手続き、就業規則作成、助成金申請、労務相談。四葉パートナーズの社労士法人が、企業の人事・労務をトータルサポートします。",
      "to": "社会保険・労働保険の手続き、就業規則作成、助成金申請、労務相談。四葉グループの社労士法人が、企業の人事・労務をトータルサポートします。"
    },
    {
      "path": "labor.aboutPage.officeInfo.0.value",
      "from": "四葉パートナーズ（代表・浦松丈二）",
      "to": "四葉グループ（代表・浦松丈二）"
    },
    {
      "path": "labor.aboutPage.officeInfo.8.value",
      "from": "法人化は準備中です。現在は四葉パートナーズとして対応しております。",
      "to": "法人化は準備中です。現在は四葉グループとして対応しております。"
    },
    {
      "path": "labor.aboutPage.representativeBio2",
      "from": "社会保険労務士法人の設立は現在準備中ですが、四葉パートナーズとして社会保険・労務に関するご相談を承っています。行政書士事務所・不動産と連携し、外国人雇用のサポートにも力を入れています。",
      "to": "社会保険労務士法人の設立は現在準備中ですが、四葉グループとして社会保険・労務に関するご相談を承っています。行政書士事務所・不動産と連携し、外国人雇用のサポートにも力を入れています。"
    },
    {
      "path": "legal.homePage.faq.1.answer",
      "from": "はい、就労ビザ、経営・管理ビザ、配偶者ビザなど各種在留資格の取得・更新・変更に対応しています。5言語対応で外国人ご本人との直接やり取りも可能です。",
      "to": "はい、就労ビザ、経営・管理ビザ、配偶者ビザなど各種在留資格の取得・更新・変更に対応しています。4言語対応で外国人ご本人との直接やり取りも可能です。"
    },
    {
      "path": "legal.homePage.services.1.description",
      "from": "就労ビザ、経営・管理ビザ、配偶者ビザなど、在留資格の取得・更新・変更に必要な書類作成をサポート。5言語対応で外国人ご本人との直接やり取りが可能です。",
      "to": "就労ビザ、経営・管理ビザ、配偶者ビザなど、在留資格の取得・更新・変更に必要な書類作成をサポート。4言語対応で外国人ご本人との直接やり取りが可能です。"
    },
    {
      "path": "realestate.home.whyYotsuba.strengths.1.title",
      "from": "5言語対応",
      "to": "4言語対応"
    },
    {
      "path": "realestate.home.whyYotsuba.strengths.1.description",
      "from": "日本語・中国語・台湾華語・タイ語・英語。ことばの壁を気にせずご相談いただけます。",
      "to": "日本語・英語・中国語（繁体字・簡体字）。ことばの壁を気にせずご相談いただけます。"
    },
    {
      "path": "realestate.servicesPage.faq.1.answer",
      "from": "はい、四葉不動産は5言語対応で、外国人の方の住まい探しを専門的にサポートしています。代表自身が4カ国での海外生活経験があり、外国人として家を探す大変さを理解しています。",
      "to": "はい、四葉不動産は4言語対応で、外国人の方の住まい探しを専門的にサポートしています。代表自身が4カ国での海外生活経験があり、外国人として家を探す大変さを理解しています。"
    },
    {
      "path": "realestate.meta.description",
      "from": "元新聞記者×行政書士の不動産屋。４言語対応（日・英・中・華）と専門家ネットワークで、住まい探しから法務までワンストップでサポートします。",
      "to": "元新聞記者×行政書士の不動産屋。4言語対応（日本語・英語・中国語繁体字・中国語簡体字）と専門家ネットワークで、住まい探しから法務までワンストップでサポートします。"
    }
  ],
  "en": [
    {
      "path": "labor.meta.description",
      "from": "Social insurance & labor insurance procedures, work rules creation, subsidy applications, and labor consulting. 四葉パートナーズ's labor consulting firm provides comprehensive HR and labor support for businesses.",
      "to": "Social insurance & labor insurance procedures, work rules creation, subsidy applications, and labor consulting. YOTSUBA GROUP's labor consulting firm provides comprehensive HR and labor support for businesses."
    },
    {
      "path": "labor.homePage.metaDescription",
      "from": "Social insurance & labor insurance procedures, work rules creation, subsidy applications, and labor consulting. 四葉パートナーズ's labor consulting firm provides comprehensive HR and labor support for businesses.",
      "to": "Social insurance & labor insurance procedures, work rules creation, subsidy applications, and labor consulting. YOTSUBA GROUP's labor consulting firm provides comprehensive HR and labor support for businesses."
    },
    {
      "path": "labor.aboutPage.officeInfo.0.value",
      "from": "四葉パートナーズ (Representative: 浦松丈二)",
      "to": "YOTSUBA GROUP (Representative: 浦松丈二)"
    },
    {
      "path": "labor.aboutPage.officeInfo.8.value",
      "from": "Incorporation is currently in preparation. We are currently operating under 四葉パートナーズ.",
      "to": "Incorporation is currently in preparation. We are currently operating under YOTSUBA GROUP."
    },
    {
      "path": "labor.aboutPage.representativeBio2",
      "from": "The incorporation of the labor consulting firm is currently in preparation, but we are accepting social insurance and labor consultations under 四葉パートナーズ. We are also committed to supporting the employment of foreign nationals, in coordination with our administrative scrivener office and real estate division.",
      "to": "The incorporation of the labor consulting firm is currently in preparation, but we are accepting social insurance and labor consultations under YOTSUBA GROUP. We are also committed to supporting the employment of foreign nationals, in coordination with our administrative scrivener office and real estate division."
    },
    {
      "path": "realestate.meta.description",
      "from": "A real estate agency led by a former journalist and licensed scrivener. With 5-language support and a professional network of legal and labor experts, we provide one-stop service from housing to legal matters.",
      "to": "A real estate agency led by a former journalist and licensed scrivener. With 4-language support and a professional network of legal and labor experts, we provide one-stop service from housing to legal matters."
    },
    {
      "path": "realestate.servicesPage.faq.1.answer",
      "from": "Yes. 四葉不動産 provides specialized support for international residents in 5 languages. Our representative has lived in 4 countries and understands the challenges of finding housing as a foreigner.",
      "to": "Yes. 四葉不動産 provides specialized support for international residents in 4 languages. Our representative has lived in 4 countries and understands the challenges of finding housing as a foreigner."
    },
    {
      "path": "realestate.home.whyYotsuba.strengths.1.title",
      "from": "5 Languages",
      "to": "4 Languages"
    },
    {
      "path": "realestate.home.whyYotsuba.strengths.1.description",
      "from": "Japanese, Chinese, Taiwanese Mandarin, Thai, and English. Consult with us without worrying about language barriers.",
      "to": "Japanese, English, Traditional Chinese, and Simplified Chinese. Consult with us without worrying about language barriers."
    },
    {
      "path": "realestate.home.ctaSection.description2",
      "from": "No question is too small. We offer support in 5 languages.",
      "to": "No question is too small. We offer support in 4 languages."
    },
    {
      "path": "legal.homePage.services.1.description",
      "from": "We support the preparation of documents needed to obtain, renew, or change residence statuses, including work visas, business manager visas, and spouse visas. With 5-language support, we can communicate directly with foreign applicants.",
      "to": "We support the preparation of documents needed to obtain, renew, or change residence statuses, including work visas, business manager visas, and spouse visas. With 4-language support, we can communicate directly with foreign applicants."
    },
    {
      "path": "legal.homePage.faq.1.answer",
      "from": "Yes, we handle the acquisition, renewal, and change of various residence statuses including work visas, business manager visas, and spouse visas. With 5-language support, we can communicate directly with the foreign applicant.",
      "to": "Yes, we handle the acquisition, renewal, and change of various residence statuses including work visas, business manager visas, and spouse visas. With 4-language support, we can communicate directly with the foreign applicant."
    }
  ],
  "zh-tw": [
    {
      "path": "labor.meta.description",
      "from": "社會保險・勞動保險手續、就業規則編製、助成金申請、勞務諮詢。四葉パートナーズ的社會保險勞務士法人為企業的人事・勞務提供全方位支援。",
      "to": "社會保險・勞動保險手續、就業規則編製、助成金申請、勞務諮詢。四葉グループ的社會保險勞務士法人為企業的人事・勞務提供全方位支援。"
    },
    {
      "path": "labor.homePage.metaDescription",
      "from": "社會保險・勞動保險手續、就業規則編製、助成金申請、勞務諮詢。四葉パートナーズ的社會保險勞務士法人為企業的人事・勞務提供全方位支援。",
      "to": "社會保險・勞動保險手續、就業規則編製、助成金申請、勞務諮詢。四葉グループ的社會保險勞務士法人為企業的人事・勞務提供全方位支援。"
    },
    {
      "path": "labor.aboutPage.officeInfo.0.value",
      "from": "四葉パートナーズ（代表・浦松丈二）",
      "to": "四葉グループ（代表・浦松丈二）"
    },
    {
      "path": "labor.aboutPage.officeInfo.8.value",
      "from": "法人化正在籌備中。目前作為四葉パートナーズ提供服務。",
      "to": "法人化正在籌備中。目前作為四葉グループ提供服務。"
    },
    {
      "path": "labor.aboutPage.representativeBio2",
      "from": "社會保險勞務士法人目前正在籌備設立中，但作為四葉パートナーズ，我們已在受理社會保險・勞務相關諮詢。與行政書士事務所・不動產聯動，也在積極支援外國人僱用。",
      "to": "社會保險勞務士法人目前正在籌備設立中，但作為四葉グループ，我們已在受理社會保險・勞務相關諮詢。與行政書士事務所・不動產聯動，也在積極支援外國人僱用。"
    },
    {
      "path": "realestate.home.whyYotsuba.strengths.1.title",
      "from": "5種語言對應",
      "to": "4種語言對應"
    },
    {
      "path": "realestate.home.whyYotsuba.strengths.1.description",
      "from": "日語・中文・台灣華語・泰語・英語。無需擔心語言障礙，輕鬆諮詢。",
      "to": "日語・英語・中文（繁體・簡體）。無需擔心語言障礙，輕鬆諮詢。"
    },
    {
      "path": "realestate.home.ctaSection.description2",
      "from": "任何小問題都沒關係。我們提供5種語言的服務。",
      "to": "任何小問題都沒關係。我們提供4種語言的服務。"
    },
    {
      "path": "realestate.servicesPage.faq.1.answer",
      "from": "是的，四葉不動産支援5種語言，專業服務於外國人的住房搜尋。代表本人擁有4個國家的海外生活經驗，深刻理解外國人在異國找房的困難。",
      "to": "是的，四葉不動産支援4種語言，專業服務於外國人的住房搜尋。代表本人擁有4個國家的海外生活經驗，深刻理解外國人在異國找房的困難。"
    },
    {
      "path": "realestate.meta.description",
      "from": "前新聞記者×行政書士的不動產公司。透過5種語言（日・英・中・泰・越）服務和專家網路，從找房到法務提供一站式支援。",
      "to": "前新聞記者×行政書士的不動產公司。透過4種語言（日・英・中文繁體・中文簡體）服務和專家網路，從找房到法務提供一站式支援。"
    },
    {
      "path": "legal.homePage.faq.1.answer",
      "from": "是的，我們辦理就勞簽證、經營・管理簽證、配偶簽證等各類在留資格的取得・更新・變更。支援5種語言，可與外國申請人直接溝通。",
      "to": "是的，我們辦理就勞簽證、經營・管理簽證、配偶簽證等各類在留資格的取得・更新・變更。支援4種語言，可與外國申請人直接溝通。"
    },
    {
      "path": "legal.homePage.services.1.description",
      "from": "就勞簽證、經營・管理簽證、配偶簽證等，支援在留資格的取得・更新・變更所需文件編製。支援5種語言，可與外國申請人直接溝通。",
      "to": "就勞簽證、經營・管理簽證、配偶簽證等，支援在留資格的取得・更新・變更所需文件編製。支援4種語言，可與外國申請人直接溝通。"
    }
  ],
  "zh": [
    {
      "path": "labor.meta.description",
      "from": "社会保险・劳动保险手续、就业规则编制、助成金申请、劳务咨询。四葉パートナーズ的社会保险劳务士法人为企业的人事・劳务提供全方位支持。",
      "to": "社会保险・劳动保险手续、就业规则编制、助成金申请、劳务咨询。四葉グループ的社会保险劳务士法人为企业的人事・劳务提供全方位支持。"
    },
    {
      "path": "labor.homePage.metaDescription",
      "from": "社会保险・劳动保险手续、就业规则编制、助成金申请、劳务咨询。四葉パートナーズ的社会保险劳务士法人为企业的人事・劳务提供全方位支持。",
      "to": "社会保险・劳动保险手续、就业规则编制、助成金申请、劳务咨询。四葉グループ的社会保险劳务士法人为企业的人事・劳务提供全方位支持。"
    },
    {
      "path": "labor.aboutPage.officeInfo.0.value",
      "from": "四葉パートナーズ（代表・浦松丈二）",
      "to": "四葉グループ（代表・浦松丈二）"
    },
    {
      "path": "labor.aboutPage.officeInfo.8.value",
      "from": "法人化正在筹备中。目前作为四葉パートナーズ提供服务。",
      "to": "法人化正在筹备中。目前作为四葉グループ提供服务。"
    },
    {
      "path": "labor.aboutPage.representativeBio2",
      "from": "社会保险劳务士法人目前正在筹备设立中，但作为四葉パートナーズ，我们已在受理社会保险・劳务相关咨询。与行政书士事务所・不动产联动，也在积极支持外国人雇用。",
      "to": "社会保险劳务士法人目前正在筹备设立中，但作为四葉グループ，我们已在受理社会保险・劳务相关咨询。与行政书士事务所・不动产联动，也在积极支持外国人雇用。"
    },
    {
      "path": "realestate.home.whyYotsuba.strengths.1.title",
      "from": "5种语言对应",
      "to": "4种语言对应"
    },
    {
      "path": "realestate.home.whyYotsuba.strengths.1.description",
      "from": "日语・中文・台湾华语・泰语・英语。无需担心语言障碍，轻松咨询。",
      "to": "日语・英语・中文（繁体・简体）。无需担心语言障碍，轻松咨询。"
    },
    {
      "path": "realestate.home.ctaSection.description2",
      "from": "任何小问题都没关系。我们提供5种语言的服务。",
      "to": "任何小问题都没关系。我们提供4种语言的服务。"
    },
    {
      "path": "realestate.servicesPage.faq.1.answer",
      "from": "是的，四葉不動産支持5种语言，专业服务于外国人的住房搜寻。代表本人拥有4个国家的海外生活经验，深刻理解外国人在异国找房的困难。",
      "to": "是的，四葉不動産支持4种语言，专业服务于外国人的住房搜寻。代表本人拥有4个国家的海外生活经验，深刻理解外国人在异国找房的困难。"
    },
    {
      "path": "realestate.meta.description",
      "from": "前新闻记者×行政书士的不动产公司。通过4种语言（日・英・中・華）服务和专家网络，从找房到法务提供一站式支持。",
      "to": "前新闻记者×行政书士的不动产公司。通过4种语言（日・英・中文繁体・中文简体）服务和专家网络，从找房到法务提供一站式支持。"
    },
    {
      "path": "legal.homePage.faq.1.answer",
      "from": "是的，我们办理就劳签证、经营・管理签证、配偶签证等各类在留资格的取得・更新・变更。支持5种语言，可与外国申请人直接沟通。",
      "to": "是的，我们办理就劳签证、经营・管理签证、配偶签证等各类在留资格的取得・更新・变更。支持4种语言，可与外国申请人直接沟通。"
    },
    {
      "path": "legal.homePage.services.1.description",
      "from": "就劳签证、经营・管理签证、配偶签证等，支持在留资格的取得・更新・变更所需文件编制。支持5种语言，可与外国申请人直接沟通。",
      "to": "就劳签证、经营・管理签证、配偶签证等，支持在留资格的取得・更新・变更所需文件编制。支持4种语言，可与外国申请人直接沟通。"
    }
  ]
};
