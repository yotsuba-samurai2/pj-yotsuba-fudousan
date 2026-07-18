// 表示コンプライアンス是正パッチ（DB翻訳値編・2026-07-19 浦松指示）
// 対象：DB内の翻訳値に残る (1)「ワンストップ」「一站式」「one-stop」等の業務混合表現
//       (2)「4カ国」「4個國家」「4 countries」等の国数表記（→ 中国・台湾・タイの具体列挙）
// from値の由来：適用済みパッチ（sr-notation / josei / brand-langs / partners-brand）のto値
//   ＝現在のDB想定値。適用順の不確実性に備え、同一キーに複数候補fromを併記できる
//   （先に一致した方が適用され、他方は「既適用」または「不一致スキップ」になる＝安全）。
// 適用ページ：/admin/translations/fix-compliance（from照合・不一致スキップ・残存スキャン付き）
import type { LangCode } from "@/config/languages";

export type CompliancePatch = { path: string; from: string; to: string };

export const COMPLIANCE_TRANSLATION_PATCHES: Record<LangCode, CompliancePatch[]> = {
  ja: [
    {
      path: "brand.groupDescription",
      from: "不動産・行政書士のワンストップグループ。",
      to: "不動産・行政書士の専門家グループ。",
    },
    {
      path: "legal.aboutPage.representativeBio1",
      from: "新聞記者として世界各地を飛び回り、4カ国で暮らしてきました。その中で培った情報収集力、交渉力、そして幅広い人脈——。これらは行政書士の業務でも大きな武器になっています。",
      to: "新聞記者として世界各地を飛び回り、中国や台湾、タイで暮らしてきました。その中で培った情報収集力、交渉力、そして幅広い人脈——。これらは行政書士の業務でも大きな武器になっています。",
    },
    // representativeBio2：josei適用後（補助金のみ）が本命。未適用環境向けに助成金入りもfrom候補に併記
    {
      path: "legal.aboutPage.representativeBio2",
      from: "特に補助金の申請は、事業計画の「伝え方」が採択のカギ。記者経験を活かした説得力のある申請書を作成します。また、4カ国での海外経験を活かし、外国人の在留資格・ビザ申請にも強みがあります。",
      to: "特に補助金の申請は、事業計画の「伝え方」が採択のカギ。記者経験を活かした説得力のある申請書を作成します。また、中国や台湾、タイでの駐在経験を活かし、外国人の在留資格・ビザ申請にも強みがあります。",
    },
    {
      path: "legal.aboutPage.representativeBio2",
      from: "特に補助金・助成金の申請は、事業計画の「伝え方」が採択のカギ。記者経験を活かした説得力のある申請書を作成します。また、4カ国での海外経験を活かし、外国人の在留資格・ビザ申請にも強みがあります。",
      to: "特に補助金の申請は、事業計画の「伝え方」が採択のカギ。記者経験を活かした説得力のある申請書を作成します。また、中国や台湾、タイでの駐在経験を活かし、外国人の在留資格・ビザ申請にも強みがあります。",
    },
    {
      path: "realestate.servicesPage.sections.3.description",
      from: "代表自身が4カ国での海外生活を経験。外国人として住まいを探す大変さを知っているからこそ、きめ細やかなサポートが可能です。",
      to: "代表自身が中国や台湾、タイでの海外生活を経験。外国人として住まいを探す大変さを知っているからこそ、きめ細やかなサポートが可能です。",
    },
    // faq.1.answer：brand-langs適用後（4言語）が本命。未適用（5言語）もfrom候補に併記
    {
      path: "realestate.servicesPage.faq.1.answer",
      from: "はい、四葉不動産は4言語対応で、外国人の方の住まい探しを専門的にサポートしています。代表自身が4カ国での海外生活経験があり、外国人として家を探す大変さを理解しています。",
      to: "はい、四葉不動産は4言語対応で、外国人の方の住まい探しを専門的にサポートしています。代表自身が中国や台湾、タイでの海外生活経験があり、外国人として家を探す大変さを理解しています。",
    },
    {
      path: "realestate.servicesPage.faq.1.answer",
      from: "はい、四葉不動産は5言語対応で、外国人の方の住まい探しを専門的にサポートしています。代表自身が4カ国での海外生活経験があり、外国人として家を探す大変さを理解しています。",
      to: "はい、四葉不動産は4言語対応で、外国人の方の住まい探しを専門的にサポートしています。代表自身が中国や台湾、タイでの海外生活経験があり、外国人として家を探す大変さを理解しています。",
    },
    {
      path: "legal.homePage.metaDescription",
      from: "補助金申請、在留資格・ビザ申請、会社設立、各種許認可。四葉グループの行政書士事務所が、法務手続きをワンストップでサポートします。",
      to: "補助金申請、在留資格・ビザ申請、会社設立、各種許認可。四葉グループの行政書士事務所が、法務手続きをサポートします。",
    },
    {
      path: "legal.meta.description",
      from: "補助金申請、在留資格・ビザ申請、会社設立、各種許認可。四葉グループの行政書士事務所が法務手続きをワンストップでサポートします。",
      to: "補助金申請、在留資格・ビザ申請、会社設立、各種許認可。四葉グループの行政書士事務所が法務手続きをサポートします。",
    },
    {
      path: "realestate.meta.description",
      from: "元新聞記者×行政書士の不動産屋。4言語対応（日本語・英語・中国語繁体字・中国語簡体字）と専門家ネットワークで、住まい探しから法務までワンストップでサポートします。",
      to: "元新聞記者×行政書士の不動産屋。4言語対応（日本語・英語・中国語繁体字・中国語簡体字）と専門家ネットワークで、住まい探しから契約までサポートします。相続書類・許認可は併設の四葉行政書士事務所が別契約で受任します。",
    },
    {
      path: "legal.homePage.faq.2.answer",
      from: "はい、四葉不動産では、四葉行政書士事務所と連携し、事務所の賃貸契約と会社設立手続きなどをワンストップで対応できます。",
      to: "はい。オフィスの賃貸契約は四葉不動産が対応します。会社設立などの法務手続きは、併設の四葉行政書士事務所が別契約で受任します。",
    },
  ],
  en: [
    {
      path: "legal.homePage.representativeBio2",
      from: "Additionally, with experience living in 4 countries and multilingual capabilities, I have particular strength in residence status and visa applications for foreign nationals. The ability to provide a one-stop solution combining real estate (四葉不動産) and legal services is our office's greatest advantage.",
      to: "Additionally, having been stationed in China, Taiwan, and Thailand, and with multilingual capabilities, I have particular strength in residence status and visa applications for foreign nationals.",
    },
    {
      path: "legal.aboutPage.representativeBio1",
      from: "As a newspaper journalist, I traveled the world and lived in 4 countries. The information-gathering skills, negotiation expertise, and broad network I built along the way — these have proven to be great assets in administrative scrivener work as well.",
      to: "As a newspaper journalist, I traveled the world and lived in China, Taiwan, and Thailand. The information-gathering skills, negotiation expertise, and broad network I built along the way — these have proven to be great assets in administrative scrivener work as well.",
    },
    // 「grant（助成金）」は業際（社労士領域）のため同時に除去（ja josei是正のen追随）
    {
      path: "legal.aboutPage.representativeBio2",
      from: "Subsidy and grant applications in particular depend on how well you convey your business plan — and my journalism background produces persuasive applications. Additionally, with experience living in 4 countries, I have particular strength in residence status and visa applications for foreign nationals.",
      to: "Subsidy applications in particular depend on how well you convey your business plan — and my journalism background produces persuasive applications. Additionally, with experience living in China, Taiwan, and Thailand, I have particular strength in residence status and visa applications for foreign nationals.",
    },
    {
      path: "legal.aboutPage.highlights.overseas.value",
      from: "Lived and worked in 4 countries",
      to: "Lived and worked in China, Taiwan, and Thailand",
    },
    {
      path: "labor.aboutPage.highlights.overseas.value",
      from: "Lived and worked in 4 countries",
      to: "Lived and worked in China, Taiwan, and Thailand",
    },
    {
      path: "realestate.servicesPage.sections.3.description",
      from: "Our representative has lived in 4 countries. Because he knows firsthand the challenges of searching for a home as a foreigner, he can provide detailed and attentive support.",
      to: "Our representative has lived in China, Taiwan, and Thailand. Because he knows firsthand the challenges of searching for a home as a foreigner, he can provide detailed and attentive support.",
    },
    {
      path: "realestate.servicesPage.faq.1.answer",
      from: "Yes. 四葉不動産 provides specialized support for international residents in 4 languages. Our representative has lived in 4 countries and understands the challenges of finding housing as a foreigner.",
      to: "Yes. 四葉不動産 provides specialized support for international residents in 4 languages. Our representative has lived in China, Taiwan, and Thailand and understands the challenges of finding housing as a foreigner.",
    },
    {
      path: "realestate.servicesPage.faq.1.answer",
      from: "Yes. 四葉不動産 provides specialized support for international residents in 5 languages. Our representative has lived in 4 countries and understands the challenges of finding housing as a foreigner.",
      to: "Yes. 四葉不動産 provides specialized support for international residents in 4 languages. Our representative has lived in China, Taiwan, and Thailand and understands the challenges of finding housing as a foreigner.",
    },
    {
      path: "realestate.home.message.paragraph1",
      from: "As a newspaper journalist, I traveled the world and lived in 4 countries. The information-gathering skills, negotiation expertise, and broad network I built along the way — I am convinced these are powerful assets in the real estate world as well.",
      to: "As a newspaper journalist, I traveled the world and lived in China, Taiwan, and Thailand. The information-gathering skills, negotiation expertise, and broad network I built along the way — I am convinced these are powerful assets in the real estate world as well.",
    },
    {
      path: "realestate.aboutPage.representativeBio1",
      from: "As a newspaper journalist, I traveled the world and lived in 4 countries. The information-gathering skills, negotiation expertise, and broad network I built along the way — I am convinced these are powerful assets in the real estate world as well.",
      to: "As a newspaper journalist, I traveled the world and lived in China, Taiwan, and Thailand. The information-gathering skills, negotiation expertise, and broad network I built along the way — I am convinced these are powerful assets in the real estate world as well.",
    },
    {
      path: "realestate.meta.description",
      from: "A real estate agency led by a former journalist and licensed scrivener. With 4-language support and a professional network of legal and labor experts, we provide one-stop service from housing to legal matters.",
      to: "A real estate agency led by a former journalist and licensed scrivener. With 4-language support and a professional network, we support you from housing search through contract. Legal paperwork such as inheritance documents and licensing is handled by the adjoining Yotsuba Gyoseishoshi Office under a separate engagement.",
    },
    {
      path: "legal.homePage.faq.2.answer",
      from: "Yes. 四葉不動産 (Yotsuba Real Estate) works together with 四葉行政書士事務所 (our administrative scrivener office), so matters spanning real estate and legal—such as office lease contracts and company formation—can be handled in one place.",
      to: "Yes. 四葉不動産 (Yotsuba Real Estate) handles the office lease contract. Legal procedures such as company formation are handled by the adjoining 四葉行政書士事務所 (Yotsuba Gyoseishoshi Office) under a separate engagement.",
    },
  ],
  "zh-tw": [
    {
      path: "brand.groupDescription",
      from: "不動產・行政書士一站式集團。",
      to: "不動產・行政書士的專家集團。",
    },
    {
      path: "realestate.servicesPage.faq.1.answer",
      from: "是的，四葉不動産支援4種語言，專業服務於外國人的住房搜尋。代表本人擁有4個國家的海外生活經驗，深刻理解外國人在異國找房的困難。",
      to: "是的，四葉不動産支援4種語言，專業服務於外國人的住房搜尋。代表本人擁有中國、台灣、泰國的海外生活經驗，深刻理解外國人在異國找房的困難。",
    },
    {
      path: "realestate.servicesPage.faq.1.answer",
      from: "是的，四葉不動産支援5種語言，專業服務於外國人的住房搜尋。代表本人擁有4個國家的海外生活經驗，深刻理解外國人在異國找房的困難。",
      to: "是的，四葉不動産支援4種語言，專業服務於外國人的住房搜尋。代表本人擁有中國、台灣、泰國的海外生活經驗，深刻理解外國人在異國找房的困難。",
    },
    {
      path: "realestate.servicesPage.sections.3.description",
      from: "代表本人擁有4個國家的海外生活經驗。正因為了解外國人找房的艱辛，才能提供細緻入微的支援。",
      to: "代表本人擁有中國、台灣、泰國的海外生活經驗。正因為了解外國人找房的艱辛，才能提供細緻入微的支援。",
    },
    {
      path: "realestate.aboutPage.representativeBio1",
      from: "作為新聞記者在世界各地奔波，曾在4個國家生活。在此過程中培養的資訊收集能力、談判能力以及廣泛的人脈——我堅信這些在不動產領域也能成為強大的武器。",
      to: "作為新聞記者在世界各地奔波，曾在中國、台灣、泰國生活。在此過程中培養的資訊收集能力、談判能力以及廣泛的人脈——我堅信這些在不動產領域也能成為強大的武器。",
    },
    {
      path: "realestate.home.message.paragraph1",
      from: "作為新聞記者在世界各地奔波，曾在4個國家生活。在此過程中培養的資訊收集能力、談判能力以及廣泛的人脈——我堅信這些在不動產領域也能成為強大的武器。",
      to: "作為新聞記者在世界各地奔波，曾在中國、台灣、泰國生活。在此過程中培養的資訊收集能力、談判能力以及廣泛的人脈——我堅信這些在不動產領域也能成為強大的武器。",
    },
    {
      path: "legal.homePage.representativeBio2",
      from: "此外，憑藉4個國家的海外經驗和多語言能力，在外國人的在留資格・簽證申請方面也具有優勢。能夠將不動產（四葉不動産）與法務一站式解決，是本事務所的最大特色。",
      to: "此外，憑藉中國、台灣、泰國的駐在經驗和多語言能力，在外國人的在留資格・簽證申請方面也具有優勢。",
    },
    {
      path: "labor.aboutPage.highlights.overseas.value",
      from: "4個國家的駐外經驗",
      to: "中國、台灣、泰國的駐外經驗",
    },
    {
      path: "legal.meta.description",
      from: "補助金申請、在留資格・簽證申請、公司設立、各類許可證。四葉グループ的行政書士事務所為您提供法務手續的一站式支援。",
      to: "補助金申請、在留資格・簽證申請、公司設立、各類許可證。四葉グループ的行政書士事務所為您提供法務手續的支援。",
    },
    {
      path: "legal.homePage.metaDescription",
      from: "補助金申請、在留資格・簽證申請、公司設立、各類許可證。四葉グループ的行政書士事務所為您提供法務手續的一站式支援。",
      to: "補助金申請、在留資格・簽證申請、公司設立、各類許可證。四葉グループ的行政書士事務所為您提供法務手續的支援。",
    },
    {
      path: "legal.aboutPage.representativeBio2",
      from: "尤其在補助金申請方面，事業計畫的「表達方式」是獲批的關鍵。運用記者經驗編製有說服力的申請書。此外，憑藉4個國家的海外經驗，在外國人的在留資格・簽證申請方面也具有優勢。",
      to: "尤其在補助金申請方面，事業計畫的「表達方式」是獲批的關鍵。運用記者經驗編製有說服力的申請書。此外，憑藉中國、台灣、泰國的駐在經驗，在外國人的在留資格・簽證申請方面也具有優勢。",
    },
    {
      path: "realestate.meta.description",
      from: "前新聞記者×行政書士的不動產公司。透過4種語言（日・英・中文繁體・中文簡體）服務和專家網路，從找房到法務提供一站式支援。",
      to: "前新聞記者×行政書士的不動產公司。透過4種語言（日・英・中文繁體・中文簡體）服務和專家網路，提供從找房到簽約的支援。繼承文件・許認可由併設的四葉行政書士事務所另行簽約受任。",
    },
    {
      path: "legal.homePage.faq.2.answer",
      from: "是的。四葉不動産與四葉行政書士事務所聯動，辦公室租賃合約與公司設立手續等不動產・法務事宜可一站式辦理。",
      to: "可以。辦公室的租賃合約由四葉不動産承辦；公司設立等法務手續，由併設的四葉行政書士事務所另行簽約受任。",
    },
  ],
  zh: [
    {
      path: "brand.groupDescription",
      from: "不动产・行政书士一站式集团。",
      to: "不动产・行政书士的专家集团。",
    },
    {
      path: "realestate.servicesPage.sections.3.description",
      from: "代表本人拥有4个国家的海外生活经验。正因为了解外国人找房的艰辛，才能提供细致入微的支持。",
      to: "代表本人拥有中国、台湾、泰国的海外生活经验。正因为了解外国人找房的艰辛，才能提供细致入微的支持。",
    },
    {
      path: "realestate.servicesPage.faq.1.answer",
      from: "是的，四葉不動産支持4种语言，专业服务于外国人的住房搜寻。代表本人拥有4个国家的海外生活经验，深刻理解外国人在异国找房的困难。",
      to: "是的，四葉不動産支持4种语言，专业服务于外国人的住房搜寻。代表本人拥有中国、台湾、泰国的海外生活经验，深刻理解外国人在异国找房的困难。",
    },
    {
      path: "realestate.servicesPage.faq.1.answer",
      from: "是的，四葉不動産支持5种语言，专业服务于外国人的住房搜寻。代表本人拥有4个国家的海外生活经验，深刻理解外国人在异国找房的困难。",
      to: "是的，四葉不動産支持4种语言，专业服务于外国人的住房搜寻。代表本人拥有中国、台湾、泰国的海外生活经验，深刻理解外国人在异国找房的困难。",
    },
    {
      path: "realestate.home.message.paragraph1",
      from: "作为新闻记者在世界各地奔波，曾在4个国家生活。在此过程中培养的信息收集能力、谈判能力以及广泛的人脉——我坚信这些在不动产领域也能成为强大的武器。",
      to: "作为新闻记者在世界各地奔波，曾在中国、台湾、泰国生活。在此过程中培养的信息收集能力、谈判能力以及广泛的人脉——我坚信这些在不动产领域也能成为强大的武器。",
    },
    {
      path: "legal.aboutPage.highlights.overseas.value",
      from: "4个国家的驻外经验",
      to: "中国、台湾、泰国的驻外经验",
    },
    {
      path: "legal.aboutPage.representativeBio1",
      from: "作为新闻记者在世界各地奔波，曾在4个国家生活。在此过程中培养的信息收集能力、谈判能力以及广泛的人脉——这些在行政书士的业务中也成为了强大的武器。",
      to: "作为新闻记者在世界各地奔波，曾在中国、台湾、泰国生活。在此过程中培养的信息收集能力、谈判能力以及广泛的人脉——这些在行政书士的业务中也成为了强大的武器。",
    },
    {
      path: "legal.aboutPage.representativeBio2",
      from: '尤其在补助金申请方面，事业计划的"表达方式"是获批的关键。运用记者经验编制有说服力的申请书。此外，凭借4个国家的海外经验，在外国人的在留资格・签证申请方面也具有优势。',
      to: '尤其在补助金申请方面，事业计划的"表达方式"是获批的关键。运用记者经验编制有说服力的申请书。此外，凭借中国、台湾、泰国的驻在经验，在外国人的在留资格・签证申请方面也具有优势。',
    },
    {
      path: "legal.homePage.metaDescription",
      from: "补助金申请、在留资格・签证申请、公司设立、各类许可证。四葉グループ的行政书士事务所为您提供法务手续的一站式支持。",
      to: "补助金申请、在留资格・签证申请、公司设立、各类许可证。四葉グループ的行政书士事务所为您提供法务手续的支持。",
    },
    {
      path: "legal.meta.description",
      from: "补助金申请、在留资格・签证申请、公司设立、各类许可证。四葉グループ的行政书士事务所为您提供法务手续的一站式支持。",
      to: "补助金申请、在留资格・签证申请、公司设立、各类许可证。四葉グループ的行政书士事务所为您提供法务手续的支持。",
    },
    {
      path: "realestate.meta.description",
      from: "前新闻记者×行政书士的不动产公司。通过4种语言（日・英・中文繁体・中文简体）服务和专家网络，从找房到法务提供一站式支持。",
      to: "前新闻记者×行政书士的不动产公司。通过4种语言（日・英・中文繁体・中文简体）服务和专家网络，提供从找房到签约的支持。继承文件・许认可由并设的四葉行政書士事務所另行签约受任。",
    },
    {
      path: "legal.homePage.faq.2.answer",
      from: "是的。四葉不動産与四葉行政书士事务所联动，办公室租赁合同与公司设立手续等不动产・法务事宜可一站式办理。",
      to: "可以。办公室的租赁合同由四葉不動産承办；公司设立等法务手续，由并设的四葉行政書士事務所另行签约受任。",
    },
  ],
};

/**
 * 値ベースの是正パッチ（パス非依存・文字列リーフの完全一致で置換）。
 * 2026-07-19 本番ページのRSCペイロード実測から抽出した「DBに現存する禁止語入りの値」が対象。
 * パスが特定できない・複数箇所に重複するキー（tagline / heroDescription2 / servicesPage配下等）を
 * 漏れなく是正するため、値そのものを照合キーにする（完全一致のみ＝部分一致では書き換えない）。
 * 全ロケールのツリーに適用（値は言語固有なので誤爆しない）。
 */
export const COMPLIANCE_VALUE_PATCHES: { from: string; to: string }[] = [
  // ── ja ──
  {
    from: "2つの事業が連携し、お客さまの課題をワンストップで解決します。",
    to: "2つの事業がそれぞれ別契約で受任し、お客さまの課題を解決します。",
  },
  { from: "4カ国での赴任経験", to: "中国・台湾・タイでの赴任経験" },
  {
    from: "お部屋探しから審査・契約まで、ワンストップでサポートします",
    to: "お部屋探しから審査・契約まで、各ステップをサポートします",
  },
  {
    from: "また、4カ国での海外経験と多言語対応を活かし、外国人の在留資格・ビザ申請にも強みがあります。不動産（四葉不動産）と法務をワンストップで解決できるのが、当事務所の最大の特長です。",
    to: "また、中国や台湾、タイでの駐在経験と多言語対応を活かし、外国人の在留資格・ビザ申請にも強みがあります。",
  },
  {
    from: "ビザ・在留資格の手続きも社内で対応。不動産と法務をワンストップで解決します。",
    to: "ビザ・在留資格の手続きは、併設の四葉行政書士事務所が別契約で受任します。",
  },
  {
    from: "不動産×法務のワンストップ対応で、あなたのビジネスと暮らしを支えます。",
    to: "不動産と法務、2つの専門事業があなたのビジネスと暮らしを支えます。",
  },
  {
    from: "文京区小日向から、法務手続きをワンストップでサポートします。",
    to: "文京区小日向から、法務手続きをサポートします。",
  },
  {
    from: "新聞記者として世界各地を飛び回り、4カ国で暮らしてきました。その中で培った情報収集力、交渉力、そして幅広い人脈——。これらは不動産の世界でも、大きな武器になると確信しています。",
    to: "新聞記者として世界各地を飛び回り、中国や台湾、タイで暮らしてきました。その中で培った情報収集力、交渉力、そして幅広い人脈——。これらは不動産の世界でも、大きな武器になると確信しています。",
  },
  {
    from: "株式会社・合同会社の設立手続きをサポート。定款作成から設立手続きまで、不動産（事務所探し）と合わせてワンストップ対応。登記は提携司法書士が対応します。",
    to: "株式会社・合同会社の設立手続きをサポート。定款作成から申請書類までを支援します。事務所探しは四葉不動産が別契約で受任し、登記は提携司法書士が対応します。",
  },
  { from: "補助金・ビザ・会社設立をワンストップで。", to: "補助金・ビザ・会社設立の申請を支援。" },
  // ── en ──
  {
    from: "A one-stop group covering real estate, administrative scrivener, and social insurance & labor consulting.",
    to: "A professional group of real estate and administrative-scrivener practices.",
  },
  {
    from: "From apartment hunting to screening and contracts — one-stop support",
    to: "From apartment hunting to screening and contracts — support at every step",
  },
  {
    from: "Providing one-stop legal procedure support from Kohinata, Bunkyo-ku.",
    to: "Providing legal procedure support from Kohinata, Bunkyo-ku.",
  },
  {
    from: "Subsidies & grants, residence status & visa applications, company formation, and various permits. 四葉グループ's administrative scrivener office provides one-stop legal procedure support.",
    to: "Subsidies, residence status & visa applications, company formation, and various permits. 四葉グループ's administrative scrivener office provides legal procedure support.",
  },
  {
    from: "Subsidies, visas, and company formation — all in one place.",
    to: "Support for subsidies, visas, and company formation.",
  },
  {
    from: "Two businesses working together to solve your challenges in one place.",
    to: "Two businesses, each engaged under a separate contract, working to solve your challenges.",
  },
  {
    from: "Visa and residence status procedures are handled in-house. We provide a one-stop solution for real estate and legal matters.",
    to: "Visa and residence status procedures are handled by the adjoining gyoseishoshi office under a separate engagement.",
  },
  {
    from: "We support incorporation procedures for stock companies (KK) and limited liability companies (GK). From articles of incorporation to registration procedures, we offer a one-stop service combined with real estate (office search). Registration is handled by our partner judicial scrivener.",
    to: "We support incorporation procedures for stock companies (KK) and limited liability companies (GK), from articles of incorporation through the application paperwork. Office search is handled by 四葉不動産 under a separate engagement, and registration by our partner judicial scrivener.",
  },
  {
    from: "With our one-stop real estate and legal services, we support your business and daily life.",
    to: "Our real estate and legal practices, each engaged separately, support your business and daily life.",
  },
  // ── zh-tw ──
  { from: "4個國家的駐外經驗", to: "中國、台灣、泰國的駐外經驗" },
  {
    from: "二大業務聯動，為客戶的問題提供一站式解決方案。",
    to: "兩大業務各自另行簽約受任，為客戶解決問題。",
  },
  { from: "從找房到審查・簽約，一站式全程支援", to: "從找房到審查・簽約，逐步支援" },
  {
    from: "從文京區小日向為您提供法務手續的一站式支援。",
    to: "從文京區小日向為您提供法務手續的支援。",
  },
  {
    from: "作為新聞記者在世界各地奔波，曾在4個國家生活。在此過程中培養的資訊收集能力、談判能力以及廣泛的人脈——這些在行政書士的業務中也成為了強大的武器。",
    to: "作為新聞記者在世界各地奔波，曾在中國、台灣、泰國生活。在此過程中培養的資訊收集能力、談判能力以及廣泛的人脈——這些在行政書士的業務中也成為了強大的武器。",
  },
  {
    from: "支援股份有限公司・合同公司的設立手續。從章程編製到設立手續，結合不動產（辦公室選址）提供一站式服務。登記由合作司法書士辦理。",
    to: "支援股份有限公司・合同公司的設立手續，從章程編製到申請文件。辦公室選址由四葉不動産另行簽約承辦，登記由合作司法書士辦理。",
  },
  {
    from: "簽證・在留資格的手續也可在公司內部辦理。不動產與法務一站式解決。",
    to: "簽證・在留資格的手續由併設的四葉行政書士事務所另行簽約受任。",
  },
  { from: "補助金・簽證・公司設立一站式服務。", to: "補助金・簽證・公司設立的申請支援。" },
  {
    from: "透過不動產與法務的一站式服務，支援您的商業與生活。",
    to: "不動產與法務兩項專業事業，支援您的商業與生活。",
  },
  // ── zh ──
  { from: "4个国家的驻外经验", to: "中国、台湾、泰国的驻外经验" },
  {
    from: "二大业务联动，为客户的问题提供一站式解决方案。",
    to: "两大业务各自另行签约受任，为客户解决问题。",
  },
  { from: "从找房到审查・签约，一站式全程支持", to: "从找房到审查・签约，逐步支持" },
  {
    from: "从文京区小日向为您提供法务手续的一站式支持。",
    to: "从文京区小日向为您提供法务手续的支持。",
  },
  {
    from: "支持股份有限公司・合同公司的设立手续。从章程编制到设立手续，结合不动产（办公室选址）提供一站式服务。登记由合作司法书士办理。",
    to: "支持股份有限公司・合同公司的设立手续，从章程编制到申请文件。办公室选址由四葉不動産另行签约承办，登记由合作司法书士办理。",
  },
  {
    from: "此外，凭借4个国家的海外经验和多语言能力，在外国人的在留资格・签证申请方面也具有优势。能够将不动产（四葉不動産）与法务一站式解决，是本事务所的最大特色。",
    to: "此外，凭借中国、台湾、泰国的驻在经验和多语言能力，在外国人的在留资格・签证申请方面也具有优势。",
  },
  {
    from: "签证・在留资格的手续也可在公司内部办理。不动产与法务一站式解决。",
    to: "签证・在留资格的手续由并设的四葉行政書士事務所另行签约受任。",
  },
  { from: "补助金・签证・公司设立一站式服务。", to: "补助金・签证・公司设立的申请支持。" },
  {
    from: "通过不动产与法务的一站式服务，支持您的商业与生活。",
    to: "不动产与法务两项专业事业，支持您的商业与生活。",
  },
];

/**
 * 残存スキャン用の禁止語・国数表記リスト（適用後にDB全体を走査して残りを報告する）。
 * ヒット＝即NGではなく人間判断用のレポート（例：コラム本文の文脈語）。
 */
export const COMPLIANCE_SCAN_TERMS: string[] = [
  "ワンストップ",
  "一体で対応",
  "一括対応",
  "まとめて対応",
  "一站式",
  "一條龍",
  "一条龙",
  "one-stop",
  "One-stop",
  "in one place",
  "4カ国",
  "４カ国",
  "5カ国",
  "4個國家",
  "4个国家",
  "4 countries",
  "four countries",
  "5 countries",
];
