type ServiceCopy = { label: string; name: string; description: string; action: string };
type AboutCopy = {
  title: string; intro: string; investmentTitle: string; investmentCopy: string;
  investmentAction: string; emailAction: string; groupTitle: string; groupNote: string; groupNoteBeforeLaborLaunch: string; directoryNote: string;
  services: [ServiceCopy, ServiceCopy, ServiceCopy];
  realestateBio: string[]; legalBio: string[]; laborBio: string[];
};

const copy: Record<"ja" | "en" | "zh-tw" | "zh", AboutCopy> = {
  ja: {
    title: "四葉不動産の主なサービス",
    intro: "都心の住まいから、大型の収益・事業用不動産まで。",
    investmentTitle: "不動産の購入・売却、賃貸・管理。",
    investmentCopy: "都心の高額住宅、一棟収益物件、大型事業用不動産のご相談を承ります。新聞記者時代に築いた人脈と調査力を活かし、ご希望に合う物件を探します。現地と資料を確かめ、判断に必要な情報をお伝えします。",
    investmentAction: "投資用・事業用不動産を見る",
    emailAction: "浦松にメールで相談する",
    groupTitle: "事務所・運営サービス",
    groupNote: "不動産・行政手続き・労務について、一つの窓口でご相談を承ります。四葉の3事業体は、それぞれ独立した事業体として受任します。契約・請求・お支払いは担当する会社・事務所ごとに分かれます。",
    groupNoteBeforeLaborLaunch: "不動産と行政手続きについて、一つの窓口でご相談を承ります。四葉不動産株式会社と四葉行政書士事務所は、それぞれ独立した事業体として受任します。",
    directoryNote: "士業ドットコムは四葉不動産株式会社が運営する情報サービスです。",
    services: [
      { label: "ADMINISTRATIVE SERVICES", name: "四葉行政書士事務所", description: "会社設立に向けた書類、許認可、在留資格、相続・遺言の書類を整えます。", action: "事務所を見る" },
      { label: "PEOPLE & LABOR", name: "四葉社会保険労務士事務所", description: "雇用・勤怠・給与、社会保険・労働保険。事業を運営するうえでの人と労務を支えます。", action: "事務所を見る" },
      { label: "PROFESSIONAL DIRECTORY", name: "士業ドットコム", description: "弁護士や司法書士など、掲載されている専門家の得意分野と対応言語を見比べられます。契約・登記・税務など、必要な相談先を考える手がかりに。", action: "士業ドットコムを見る" },
    ],
    realestateBio: [
      "京都大学農学部で農林経済を学びました。学生時代にアジアや中東、アフリカを旅し、自分の足で現地を訪ね、そこで暮らす人に話を聞く面白さを知りました。",
      "毎日新聞社に入社後は、長崎、福岡を経て東京本社外信部へ。バンコクや北京で取材に携わり、北京では中国総局長を務めました。中国の政治や経済の動きを取材してきました。",
      "新聞記者のころから大切にしてきたのは、最初に聞いた話だけで結論を出さないことです。不動産でも、現地と資料を照らし合わせ、確認できた事実と、まだ確かめるべき点を分けてお伝えします。買う理由だけでなく、見送る理由も分かる提案を心がけています。",
    ],
    legalBio: [
      "京都大学農学部を卒業後、毎日新聞社で記者を務めました。アジアで取材するなかで、同じ言葉でも、国や制度によって前提が違うことを何度も経験しました。",
      "日本で事業を始める方や、国をまたいで相続などの手続きを進める方に、まず状況を伺い、必要な書類と確認事項を順にお伝えします。日本語・英語・中国語でご相談いただけます。",
      "税務、登記、紛争に関するご相談は、内容に応じ、税理士・司法書士・弁護士へそれぞれ直接ご依頼いただく形をご案内します。",
    ],
    laborBio: [
      "京都大学農学部を卒業後、毎日新聞社で国内外の取材に携わりました。現場の話を聞き、決まりと実際の運用を照らし合わせる。その姿勢は労務のご相談でも変わりません。",
      "2026年9月に社会保険労務士として登録し、文京区小日向で開業しました。日本で事業を立ち上げる企業や、外国人を雇用する企業に、雇用・勤怠・給与・社会保険などの準備を、事業の実態に合わせて整理します。日本語・英語・中国語で対応します。",
    ],
  },
  en: {
    title: "Real estate and related services",
    intro: "From homes in central Tokyo to large income-producing and commercial properties.",
    investmentTitle: "Buying, selling, leasing and managing property",
    investmentCopy: "We assist with prime homes, entire income-producing buildings and large commercial properties. Drawing on the contacts and research skills I developed as a journalist, I look for properties that fit your plans. We check the site and documentation and explain what matters for your decision.",
    investmentAction: "Explore investment and commercial property",
    emailAction: "Email Joji Uramatsu",
    groupTitle: "Our offices and directory",
    groupNote: "You can start with one point of contact for property, administrative procedures and employment matters. The three Yotsuba entities accept engagements independently. Contracts, invoices and payments are handled separately by the relevant company or office.",
    groupNoteBeforeLaborLaunch: "You can start with one point of contact for property and administrative procedures. The real estate company and administrative scrivener office accept engagements independently.",
    directoryNote: "士業ドットコム is an information service operated by 四葉不動産株式会社.",
    services: [
      { label: "ADMINISTRATIVE SERVICES", name: "四葉行政書士事務所", description: "Documents for starting a company, permits, residence status, inheritance and wills.", action: "About the office" },
      { label: "PEOPLE & LABOR", name: "四葉社会保険労務士事務所", description: "Support with employment, timekeeping, payroll, social insurance and labor insurance.", action: "About the office" },
      { label: "PROFESSIONAL DIRECTORY", name: "士業ドットコム", description: "Compare the specialties and languages of listed professionals, including attorneys and judicial scriveners. A starting point for deciding whom to consult about contracts, registration or tax.", action: "Explore the directory" },
    ],
    realestateBio: [
      "I studied agricultural and forestry economics at Kyoto University. As a student I traveled through Asia, the Middle East and Africa, where I learned the value of seeing places for myself and listening to the people who live there.",
      "I joined the Mainichi Shimbun and worked in Nagasaki and Fukuoka before moving to its foreign news desk in Tokyo. I reported from Bangkok and Beijing and served as China bureau chief in Beijing, covering Chinese politics and the economy.",
      "Reporting taught me not to draw conclusions from the first account I hear. In real estate, I check the site against the documents and distinguish verified facts from open questions. I want clients to see the case for walking away as clearly as the case for buying.",
    ],
    legalBio: [
      "After graduating from Kyoto University’s Faculty of Agriculture, I worked as a reporter at the Mainichi Shimbun. Reporting across Asia taught me how easily the same words can carry different assumptions from one country or system to another.",
      "If you are starting a business in Japan or preparing cross-border inheritance documents, we first listen to your circumstances, then set out what to prepare and what needs checking. Consultations are available in Japanese, English and Chinese.",
      "For tax, registration or disputes, we explain when to consult a tax accountant, judicial scrivener or attorney directly.",
    ],
    laborBio: [
      "After graduating from Kyoto University’s Faculty of Agriculture, I reported in Japan and abroad for the Mainichi Shimbun. I bring the same habit of listening to people on the ground and checking how rules work in practice to employment consultations.",
      "I registered as a labor and social security attorney in September 2026 and opened my office in Kohinata, Bunkyo. We help businesses starting operations in Japan or hiring foreign staff prepare for employment, timekeeping, payroll and social insurance. Consultations are available in Japanese, English and Chinese.",
    ],
  },
  "zh-tw": {
    title: "四葉不動產的主要服務",
    intro: "從東京都心住宅，到整棟收益型物件與大型商用不動產。",
    investmentTitle: "不動產買賣、租賃與管理",
    investmentCopy: "我們受理東京都心高端住宅、整棟收益型物件及大型商用不動產的諮詢。運用新聞記者時期累積的人脈與調查能力，為您尋找符合需求的物件；透過現勘與資料查核，整理購置決策所需的資訊。",
    investmentAction: "查看投資與商用不動產",
    emailAction: "以電子郵件聯絡浦松",
    groupTitle: "事務所與營運服務",
    groupNote: "不動產、行政手續及勞務問題，可先透過單一窗口諮詢。四葉的三個事業體各自獨立受任，契約、請款與付款由負責的公司或事務所分別辦理。",
    groupNoteBeforeLaborLaunch: "不動產與行政手續可先透過單一窗口諮詢。不動產公司與行政書士事務所為獨立的事業體，各自受任。",
    directoryNote: "士業ドットコム是由四葉不動産株式会社營運的專業人士資訊服務。",
    services: [
      { label: "ADMINISTRATIVE SERVICES", name: "四葉行政書士事務所", description: "協助準備公司設立、許認可、在留資格，以及繼承與遺囑所需的文件。", action: "認識事務所" },
      { label: "PEOPLE & LABOR", name: "四葉社会保険労務士事務所", description: "協助企業處理僱用、出勤、薪資及社會保險、勞動保險事務。", action: "認識事務所" },
      { label: "PROFESSIONAL DIRECTORY", name: "士業ドットコム", description: "比較已刊登的律師、司法書士等專業人士的專長與服務語言，做為尋找契約、登記或稅務諮詢窗口的起點。", action: "查看士業ドットコム" },
    ],
    realestateBio: [
      "我在京都大學農學部研習農林經濟。求學時曾走訪亞洲、中東和非洲，體會到親自到現場、聆聽當地人說法的價值。",
      "進入每日新聞社後，先在長崎、福岡工作，之後調任東京總公司的國際新聞部門。我曾在曼谷和北京採訪，並在北京擔任中國總局長，報導中國的政治與經濟。",
      "當記者時，我不會只憑第一個說法就下結論。做不動產也一樣：比對現場與資料，說明哪些事實已查證、哪些仍須確認，讓您看清值得買入與適合暫緩的理由。",
    ],
    legalBio: [
      "我自京都大學農學部畢業後，在每日新聞社擔任記者。在亞洲各地採訪時，我多次遇到同一句話在不同國家或制度下有不同的前提。",
      "無論您計畫在日本創業，還是要處理跨境繼承等手續，我們會先了解您的情況，再依順序說明所需的文件及待確認事項。可使用日文、英文及中文諮詢。",
      "如涉及稅務、登記或爭議，我們會依內容說明如何直接委託稅務、登記或法律專業人士。",
    ],
    laborBio: [
      "我自京都大學農學部畢業後，在每日新聞社從事國內外採訪。做勞務諮詢時，我也會先聽現場的說法，再核對制度與實務運作。",
      "我於2026年9月登錄為日本的社会保険労務士，並在文京區小日向開業。我們依企業實際情況，協助在日本創業或聘僱外籍員工的企業準備僱用、出勤、薪資與社會保險事務。可使用日文、英文及中文諮詢。",
    ],
  },
  zh: {
    title: "四叶不动产的主要服务",
    intro: "从东京都心住宅，到整栋收益型物业与大型商业不动产。",
    investmentTitle: "不动产买卖、租赁与管理",
    investmentCopy: "我们接受东京都心高端住宅、整栋收益型物业及大型商业不动产的咨询。凭借新闻记者时期积累的人脉与调查能力，为您寻找符合需求的物业；通过实地查看和资料核实，整理购置决策所需的信息。",
    investmentAction: "查看投资与商业不动产",
    emailAction: "通过电子邮件联系浦松",
    groupTitle: "事务所与运营服务",
    groupNote: "不动产、行政手续及劳动用工问题可先通过统一窗口咨询。四叶的三个业务主体分别独立接受委托，由相关公司或事务所分别办理合同、账单及付款事项。",
    groupNoteBeforeLaborLaunch: "不动产与行政手续可先通过统一窗口咨询。不动产公司与行政书士事务所分别独立接受委托。",
    directoryNote: "士業ドットコム是由四葉不動産株式会社运营的专业人士信息服务。",
    services: [
      { label: "ADMINISTRATIVE SERVICES", name: "四葉行政書士事務所", description: "协助准备公司设立、行政许可、在留资格以及继承与遗嘱所需的文件。", action: "了解事务所" },
      { label: "PEOPLE & LABOR", name: "四葉社会保険労務士事務所", description: "协助企业处理用工、考勤、工资、社会保险及劳动保险事务。", action: "了解事务所" },
      { label: "PROFESSIONAL DIRECTORY", name: "士業ドットコム", description: "比较已刊登的律师、司法书士等专业人士的业务专长和服务语言，为合同、登记或税务咨询寻找合适的入口。", action: "查看士業ドットコム" },
    ],
    realestateBio: [
      "我在京都大学农学部学习农业与林业经济。求学时曾走访亚洲、中东和非洲，从中体会到亲自走访现场、聆听当地人意见的重要性。",
      "进入每日新闻社后，我先后在长崎和福冈工作，之后调至东京总部国际新闻部门。我曾在曼谷和北京采访，并在北京担任中国总局长，报道中国的政治与经济。",
      "做记者时，我不只凭最初听到的说法下结论。做不动产也一样：将现场与资料相互核对，说明哪些事实已经查证、哪些仍待确认，让您看清买入与暂缓的理由。",
    ],
    legalBio: [
      "我从京都大学农学部毕业后，在每日新闻社担任记者。采访亚洲各地时，我多次发现同样的说法在不同国家或制度下有不同的前提。",
      "无论是准备在日本创业，还是办理跨境继承等手续，我们会先了解您的情况，再按顺序说明所需文件和需要核实的事项。可使用日语、英语和中文咨询。",
      "涉及税务、登记或争议时，我们会视情况说明如何直接委托相应的专业人士。",
    ],
    laborBio: [
      "我从京都大学农学部毕业后，在每日新闻社从事国内外采访。从事用工咨询时，我也会先听一线人员的实际情况，再核对制度与执行方式。",
      "我于2026年9月登记为日本的社会保険労務士，在文京区小日向开业。我们根据企业实际情况，为在日本创业或聘用外籍员工的企业梳理用工、考勤、工资及社会保险的准备事项。可使用日语、英语和中文咨询。",
    ],
  },
};

export function getAboutBrandContent(locale: string): AboutCopy {
  return locale === "en" || locale === "zh-tw" || locale === "zh" ? copy[locale] : copy.ja;
}
