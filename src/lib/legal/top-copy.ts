import type { LangCode } from "@/config/languages";

type LegalTopV10Copy = {
  title: string; description: string; hero: string; beforeLaunchHero: string; sub: string;
  dual: string; chineseShort: string; visaCta: string; contactCta: string; foreignCta: string;
  visaTitle: string; visa: string; consistency: string;
  foreignTitle: string; foreign: string; chineseTitle: string; chinese: string;
  companyTitle: string; company: string; companyLink: string;
  industry: string; ghTitle: string; gh: string; ghLink: string; ghLabor: string;
  filingTitle: string; filing: string; dualTitle: string;
  laborTitle: string; labor: string; unavailable: string;
  otherTitle: string; faqTitle: string; faqs: { q: string; a: string }[];
  laborQuestion: string; disclaimer: string;
};

/** Server-side copy. Labor claims are rendered only behind the existing launch gate. */
export const LEGAL_TOP_V10_COPY: Record<LangCode, LegalTopV10Copy> = {
  ja: {
    title: "在留資格・外国人採用・障害福祉に強い行政書士｜中国語対応｜四葉行政書士事務所",
    description: "文京区小日向・茗荷谷の申請取次行政書士。在留資格、外国人採用前の確認、日本進出・会社設立、障害福祉・グループホームの開設を支援。中国語で直接ご相談いただけます。",
    hero: "在留資格から、入社後の労務まで。", beforeLaunchHero: "在留資格から、日本での事業と暮らしまで。",
    sub: "外国人の採用・在留資格・日本進出を支援。",
    dual: "代表行政書士は社会保険労務士でもあり、社会保険・給与・入社後の労務まで見通してご相談いただけます。社労士業務は別契約・別請求で承ります。",
    chineseShort: "中国語で直接ご相談いただけます。", visaCta: "在留資格を相談する", contactCta: "無料相談を予約する", foreignCta: "外国人採用を相談する",
    visaTitle: "在留資格・申請取次", visa: "就労、在留期間の更新、在留資格の変更など、現在の状況と日本での活動内容を伺い、必要な書類と申請の流れを整理します。",
    consistency: "在留資格の種類や申請内容によっては、雇用条件、社会保険、給与、勤務実態などの整合性が重要になる場合があります。",
    foreignTitle: "外国人を採用する前に", foreign: "予定する業務、雇用条件、入社時期、在留資格の内容を一緒に整理します。企業の人事・総務と、採用される方の双方に必要な準備をご案内します。",
    chineseTitle: "中国語で、背景まで丁寧に確認", chinese: "元毎日新聞中国総局長の代表が、中国語で直接お話を伺います。その他の外国語はAI・翻訳支援を活用した基本案内に対応し、専門翻訳・長時間通訳は別途ご案内します。",
    companyTitle: "外国人・外国企業の日本進出", company: "日本で始める事業、会社設立に必要な書類、各種許認可と在留資格の関係を整理します。会社設立登記は司法書士、税務は税理士へご案内し、それぞれ別契約で進めます。", companyLink: "日本進出・会社設立・許認可",
    industry: "重点業種・得意業種", ghTitle: "障害福祉・グループホームの開設支援", gh: "許認可・指定申請、開設準備、事業所立上げに必要な書類と行政対応を支援します。障害福祉事業者の開設を、立上げから運営まで見通してお手伝いします。", ghLink: "障害福祉・GHの開設と許認可", ghLabor: "開設前は行政書士、開設後の人事労務は社会保険労務士。採用・給与・社会保険・就業規則・処遇改善等は、業務範囲を分けてご案内します。",
    filingTitle: "申請取次行政書士が、準備から申請まで", filing: "申請内容と必要書類を整理し、準備から申請まで支援します。許可を保証するものではなく、個別の申請について資格者が確認します。", dualTitle: "申請取次行政書士 × 社会保険労務士",
    laborTitle: "採用後の社会保険・給与・労務", labor: "入社後の社会保険・給与計算・日常の労務相談は、人事部丸投げプランも含めて社労士事務所へ。在留資格申請とは別の契約・料金でご案内します。", unavailable: "社会保険・給与・労務は社会保険労務士の業務です。現在は当事務所で受任せず、必要に応じて専門家をご案内します。",
    otherTitle: "そのほかのご相談", faqTitle: "よくあるご相談",
    faqs: [{ q: "中国語で相談できますか？", a: "代表に中国語で直接ご相談いただけます。専門翻訳や長時間通訳が必要な場合は、範囲と費用を事前にご案内します。" }, { q: "外国人を採用する前から相談できますか？", a: "ご相談いただけます。予定する業務、雇用条件、入社時期と在留資格の内容を整理し、申請に向けた準備をご案内します。" }, { q: "社会保険の加入は、すべての在留資格で同じ条件ですか？", a: "一律の許可条件としてご案内するものではありません。在留資格の種類や申請内容によって、雇用条件・社会保険・給与・勤務実態等の整合性が重要になる場合があります。個別の条件は資格者が確認します。" }, { q: "グループホームの開設も相談できますか？", a: "障害福祉・グループホームは当事務所の得意業種です。許認可・指定申請と、開設に必要な書類・行政対応をご相談いただけます。" }],
    laborQuestion: "入社後の給与や労務も相談できますか？", disclaimer: "本ページは一般的な情報提供です。個別の法的判断は資格者による確認を要します。",
  },
  en: {
    title: "Residence status, international hiring and welfare｜Chinese support｜四葉行政書士事務所",
    description: "An application-intermediary administrative scrivener in Bunkyo, Tokyo. Residence status, preparations for international hiring, entering Japan's market and disability-welfare facility applications. Direct consultation in Chinese.",
    hero: "From residence status to labor matters after hiring.", beforeLaunchHero: "Residence status, business and life in Japan.", sub: "Support for international hiring, residence status and entering Japan's market.",
    dual: "Our representative administrative scrivener is also a certified social insurance and labor consultant, helping you consider insurance, payroll and labor matters after hiring. Labor services have separate contracts and invoices.",
    chineseShort: "Consult our representative directly in Chinese.", visaCta: "Discuss residence status", contactCta: "Book a free consultation", foreignCta: "Discuss international hiring",
    visaTitle: "Residence status and application support", visa: "We review your circumstances and planned activities in Japan, then organize documents and the application process for work-related status, extensions or changes.", consistency: "Depending on the residence status and application, consistency among employment terms, social insurance, pay and actual working arrangements may be important.",
    foreignTitle: "Before hiring an international employee", foreign: "We review the planned duties, employment terms, starting date and residence status, explaining the preparations for both your HR team and the person you plan to hire.",
    chineseTitle: "Discuss the context directly in Chinese", chinese: "Our representative, a former Mainichi Shimbun China Bureau Chief, consults directly in Chinese. Other languages receive basic guidance with AI and translation assistance; specialist translation and extended interpreting are arranged separately.",
    companyTitle: "Entering Japan's market", company: "We organize planned business activities, company-formation documents, permits and residence-status matters. Company registration goes to a judicial scrivener and tax matters to a tax accountant, under separate contracts.", companyLink: "Market entry, company formation and permits",
    industry: "Focus industry", ghTitle: "Disability welfare and group-home openings", gh: "We support designation and permit applications, opening preparations, required documents and communication with authorities. We help welfare providers plan openings with later operations in view.", ghLink: "Welfare facilities: opening and permits", ghLabor: "Administrative scrivener services cover opening preparations; social insurance and labor consultant services cover HR after opening. Hiring, payroll, insurance, work rules and treatment-improvement matters are separated by professional scope.",
    filingTitle: "Application support from preparation to filing", filing: "An application-intermediary administrative scrivener organizes the application and required documents. Approval is not guaranteed; a qualified professional reviews each application.", dualTitle: "Application-intermediary administrative scrivener and labor consultant",
    laborTitle: "Insurance, payroll and labor matters after hiring", labor: "For social insurance, payroll and everyday labor advice after hiring, see our labor office, including its Outsourced HR Department Service. These services have separate contracts and fees from residence-status applications.", unavailable: "Social insurance, payroll and labor services belong to the labor consultant's professional scope. This office does not currently accept those engagements and can guide you to a professional.",
    otherTitle: "Other consultations", faqTitle: "Common questions", faqs: [{q:"Can I consult in Chinese?",a:"Yes. You can consult our representative directly in Chinese. We explain the scope and cost in advance when specialist translation or extended interpreting is needed."},{q:"Can we consult before hiring?",a:"Yes. We review the proposed duties, employment terms, starting date and residence status, and explain preparations for the application."},{q:"Is social insurance enrollment a universal condition for every residence status?",a:"We do not describe it as a universal approval condition. Depending on the status and application, consistency in employment terms, insurance, pay and working arrangements may be important. A qualified professional checks the individual requirements."},{q:"Can you help open a group home?",a:"Disability welfare and group homes are a focus industry. We advise on designation and permit applications, required documents and communication with authorities."}],
    laborQuestion:"Can you help with payroll and labor matters after hiring?", disclaimer:"This page provides general information. Individual legal judgments require review by a qualified professional.",
  },
  "zh-tw": {
    title:"在留資格・外國人招聘・障礙福祉｜中文諮詢｜四葉行政書士事務所", description:"東京文京區茗荷谷的申請取次行政書士。支援在留資格、外國人招聘前確認、進軍日本與公司設立、障礙福祉及團體家屋開設。可直接用中文諮詢。",
    hero:"從在留資格，到入職後的勞務。",beforeLaunchHero:"在留資格、日本事業與生活。",sub:"支援外國人招聘、在留資格與進軍日本。",dual:"代表行政書士亦為社會保險勞務士，可綜合考慮入職後的社會保險、薪資與勞務。社勞士業務另行簽約及請款。",
    chineseShort:"可直接用中文諮詢。",visaCta:"諮詢在留資格",contactCta:"預約免費諮詢",foreignCta:"諮詢外國人招聘",
    visaTitle:"在留資格・申請取次",visa:"了解目前情況及在日本的活動內容，整理就勞、在留期間更新或在留資格變更所需的文件與申請流程。",consistency:"依在留資格種類及申請內容，雇用條件、社會保險、薪資與實際工作情況等的一致性可能相當重要。",
    foreignTitle:"招聘外國人之前",foreign:"一同整理預定工作內容、雇用條件、入職時間與在留資格，向企業人事及受聘者說明所需準備。",chineseTitle:"用中文，充分了解背景",chinese:"曾任每日新聞中國總局長的代表直接用中文了解情況。其他外語透過AI及翻譯輔助提供基本指引；專業翻譯及長時間口譯另行說明。",
    companyTitle:"外國人・外國企業進軍日本",company:"整理在日本的事業規劃、公司設立文件、各類許可與在留資格的關係。公司登記轉介司法書士，稅務轉介稅理士，分別簽約。",companyLink:"進軍日本・公司設立・許可",
    industry:"重點業種・擅長領域",ghTitle:"障礙福祉・團體家屋開設支援",gh:"支援許可與指定申請、開設準備、事業所成立所需文件及行政應對。協助障礙福祉業者籌備開設，並考量後續營運。",ghLink:"障礙福祉・團體家屋開設與許可",ghLabor:"開設前由行政書士支援，開設後的人事勞務由社會保險勞務士支援。招聘、薪資、社保、就業規則及處遇改善等，依業務範圍分別說明。",
    filingTitle:"申請取次行政書士，從準備到申請",filing:"整理申請內容及所需文件，支援準備至申請流程。不保證取得許可，個別申請由具資格的專業人士確認。",dualTitle:"申請取次行政書士 × 社會保險勞務士",
    laborTitle:"入職後的社保・薪資・勞務",labor:"入職後的社會保險、薪資計算與日常勞務諮詢，可參考社勞士事務所的人事部全包方案。與在留資格申請分別簽約、計費。",unavailable:"社保、薪資與勞務屬社會保險勞務士的業務。本事務所目前不承接此類委託，將視需要轉介專業人士。",otherTitle:"其他諮詢",faqTitle:"常見諮詢",
    faqs:[{q:"可以用中文諮詢嗎？",a:"可直接與代表用中文諮詢。如需專業翻譯或長時間口譯，會事先說明範圍及費用。"},{q:"招聘前也可以諮詢嗎？",a:"可以。我們整理工作內容、雇用條件、入職時間與在留資格，說明申請準備。"},{q:"所有在留資格都以加入社會保險為相同條件嗎？",a:"不能作為一律的許可條件說明。依資格種類與申請內容，雇用條件、社保、薪資及實際工作情況等的一致性可能很重要。個別條件由具資格的專業人士確認。"},{q:"可以諮詢團體家屋開設嗎？",a:"障礙福祉與團體家屋是擅長業種。可諮詢許可、指定申請、開設所需文件與行政應對。"}],
    laborQuestion:"入職後的薪資與勞務也可以諮詢嗎？",disclaimer:"本頁提供一般資訊。個別法律判斷須由具資格的專業人士確認。",
  },
  zh: {
    title:"在留资格・外国人招聘・残障福祉｜中文咨询｜四葉行政書士事務所",description:"东京文京区茗荷谷的申请取次行政书士。支持在留资格、外国人招聘前确认、进入日本市场与公司设立、残障福祉及团体家屋开设。可直接用中文咨询。",
    hero:"从在留资格，到入职后的劳务。",beforeLaunchHero:"在留资格、日本事业与生活。",sub:"支持外国人招聘、在留资格与进入日本市场。",dual:"代表行政书士亦为社会保险劳务士，可综合考虑入职后的社会保险、工资与劳务。社劳士业务另行签约及请款。",
    chineseShort:"可直接用中文咨询。",visaCta:"咨询在留资格",contactCta:"预约免费咨询",foreignCta:"咨询外国人招聘",
    visaTitle:"在留资格・申请取次",visa:"了解当前情况及在日本的活动内容，整理就劳、在留期间更新或在留资格变更所需的文件与申请流程。",consistency:"根据在留资格种类及申请内容，雇用条件、社会保险、工资与实际工作情况等的一致性可能十分重要。",
    foreignTitle:"招聘外国人之前",foreign:"一同整理预定工作内容、雇用条件、入职时间与在留资格，向企业人事及受聘者说明所需准备。",chineseTitle:"用中文，充分了解背景",chinese:"曾任每日新闻中国总局长的代表直接用中文了解情况。其他外语通过AI及翻译辅助提供基本指引；专业翻译及长时间口译另行说明。",
    companyTitle:"外国人・外国企业进入日本市场",company:"整理在日本的事业计划、公司设立文件、各类许可与在留资格的关系。公司登记转介司法书士，税务转介税理士，分别签约。",companyLink:"进入日本市场・公司设立・许可",
    industry:"重点行业・擅长领域",ghTitle:"残障福祉・团体家屋开设支持",gh:"支持许可与指定申请、开设准备、事业所成立所需文件及行政应对。协助残障福祉业者筹备开设，并考虑后续运营。",ghLink:"残障福祉・团体家屋开设与许可",ghLabor:"开设前由行政书士支持，开设后的人事劳务由社会保险劳务士支持。招聘、工资、社保、就业规则及处遇改善等，按业务范围分别说明。",
    filingTitle:"申请取次行政书士，从准备到申请",filing:"整理申请内容及所需文件，支持从准备到申请的流程。不保证取得许可，个别申请由具资格的专业人士确认。",dualTitle:"申请取次行政书士 × 社会保险劳务士",
    laborTitle:"入职后的社保・工资・劳务",labor:"入职后的社会保险、工资计算与日常劳务咨询，可参考社劳士事务所的人事部全包方案。与在留资格申请分别签约、计费。",unavailable:"社保、工资与劳务属于社会保险劳务士的业务。本事务所目前不承接此类委托，将按需要转介专业人士。",otherTitle:"其他咨询",faqTitle:"常见咨询",
    faqs:[{q:"可以用中文咨询吗？",a:"可直接与代表用中文咨询。如需专业翻译或长时间口译，会事先说明范围及费用。"},{q:"招聘前也可以咨询吗？",a:"可以。我们整理工作内容、雇用条件、入职时间与在留资格，说明申请准备。"},{q:"所有在留资格都以加入社会保险为相同条件吗？",a:"不能作为一律的许可条件说明。根据资格种类与申请内容，雇用条件、社保、工资及实际工作情况等的一致性可能很重要。个别条件由具资格的专业人士确认。"},{q:"可以咨询团体家屋开设吗？",a:"残障福祉与团体家屋是擅长行业。可咨询许可、指定申请、开设所需文件与行政应对。"}],
    laborQuestion:"入职后的工资与劳务也可以咨询吗？",disclaimer:"本页提供一般信息。个别法律判断须由具资格的专业人士确认。",
  },
};
