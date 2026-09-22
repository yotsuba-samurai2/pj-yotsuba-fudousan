import type { LangCode } from "@/config/languages";

/**
 * /labor/services/joseikin（雇用関係助成金の申請）の4ロケール文言。
 *
 * 方式＝手本B（COPY を src/lib/labor/ に切り出す。既存＝kaigo-service-copy.ts・shogai-nenkin-copy.ts）。
 * 日本語（JA）は 2026-09-22 時点のJSX直書きを**1字も変えずに**移しただけ。
 * 文中に現れる半角スペースは、移行前のJSXがソース改行で出していた空白をそのまま保存したもので、
 * 日本語版の出力を1字も変えないために意図的に残している。訳文には対応する空白を入れない。
 *
 * 【翻訳の規律】指示書 2026-09-22 §2／`luck428-column-seo` 第5条の3／`shigyo-compliance-gate`
 *   ・日本語版にない事実・数値を訳で足さない。構成・見出し数・段落数・表の行数を同じにする
 *   ・助成金（厚生労働省・雇用関係）と補助金（経済産業省・事業）は日本の別制度のため、
 *     訳でも日本語の原名を残して併記する（英語の subsidy / grant だけにすると分界が消える）
 *   ・事務所名は全ロケールで日本語表記のまま
 *   ・一体提供を示唆する語を全ロケールで使わない（婉曲表現を含む）
 *   ・成功報酬20%・顧問契約限定は日本語版にある事実なので訳でも落とさない。数値は半角・税込の表記も揃える
 *   ・簡体字の条項号は「项」
 *
 * 【申し送り・浦松判断】日本語版のリードは「社会保険労務士の独占業務です」と業務独占を断定している。
 *   同種のページ /labor/services/shogai-nenkin は、石井弁護士の確認前であることを理由に
 *   意図的に「社会保険労務士の業務です」へ弱めている（同ファイル冒頭コメント）。
 *   ここでは日本語を書き換えない方針（指示書§4）に従って**日本語のまま忠実に訳している**。
 *   2ページの強さを揃えるかどうかは浦松の判断。
 */
export type JoseikinCopy = {
  metaTitle: string;
  metaDescription: string;
  crumbLabel: string;
  serviceName: string;
  heroAlt: string;
  h1: string;
  /** リード第1段落＝[前, 強調1, 中1, 強調2, 中2, 強調3, 後] */
  lead1: readonly [string, string, string, string, string, string, string];
  /** リード第2段落＝[強調1, 中, 強調2] */
  lead2: readonly [string, string, string];
  internalLinks: readonly { href: string; label: string }[];
  crossLinkLead: string;
  s1H2: string;
  /** 表の見出し（1列目は空セル） */
  s1TableHead: readonly [string, string];
  s1Rows: readonly { label: string; aStrong?: string; a: string; bStrong?: string; b: string }[];
  s1LinkLead: string;
  s1LinkLabel: string;
  s1Note: string;
  s2H2: string;
  /** [強調, 後] */
  s2P1: readonly [string, string];
  /** [前, 強調, 後] */
  s2P2: readonly [string, string, string];
  /** [前, 強調1, 中, 強調2] */
  s2P3: readonly [string, string, string, string];
  s3H2: string;
  s3P1: string;
  s3Items: readonly { strong: string; mid: string; strong2?: string; rest?: string }[];
  s3Note: string;
  s4H2: string;
  /** [強調, 後] */
  s4P1: readonly [string, string];
  s4FeeLink: string;
  s4FlowLink: string;
};

const JA: JoseikinCopy = {
  metaTitle: "雇用関係助成金の申請｜四葉社会保険労務士事務所",
  metaDescription:
    "雇用関係の助成金（キャリアアップ助成金等）の申請を、文京区の四葉社会保険労務士事務所が支援します。要件確認から計画届、支給申請まで。事業の補助金（経済産業省系）は行政書士の領域のため、範囲の違いからご案内します。",
  crumbLabel: "雇用関係助成金の申請",
  serviceName: "雇用関係助成金の申請支援",
  heroAlt: "雇用関係助成金の申請のイメージ（申請書類）",
  h1: "雇用関係助成金の申請",
  lead1: [
    "雇用関係の",
    "助成金",
    "（キャリアアップ助成金など）の申請代行は、",
    "社会保険労務士の独占業務",
    "です。四葉社会保険労務士事務所が、要件確認から計画届・支給申請までを支援します。助成金は「後から要件を満たす」ことができない制度が多く、",
    "雇い入れや制度変更の前に",
    "相談いただくのが鉄則です。",
  ],
  lead2: [
    "着手金はいただきません。",
    "受給できたときだけ、支給額の20%を成功報酬として申し受けます。不支給だった場合、費用は発生しません。",
    "顧問契約を結んでいる会社さまに限ってお受けします。",
  ],
  internalLinks: [
    { href: "/labor/ryokin", label: "助成金申請の料金" },
    { href: "/labor/nagare", label: "ご相談から契約までの流れ" },
    { href: "/labor/services/kaigo-roumu", label: "介護・障害福祉の労務管理" },
  ],
  crossLinkLead: "事業の補助金（経済産業省系）をお考えの場合は、行政書士の領域です。",
  s1H2: "助成金と補助金は、何が違いますか？",
  s1TableHead: ["助成金", "補助金"],
  s1Rows: [
    { label: "所管", a: "主に厚生労働省（雇用関係）", b: "主に経済産業省（事業）" },
    { label: "性質", a: "要件を満たせば受給できるものが中心", b: "審査で採択・不採択が分かれる" },
    {
      label: "依頼先",
      aStrong: "社会保険労務士",
      a: "（当事務所）",
      bStrong: "行政書士",
      b: "（四葉行政書士事務所・別事業体）",
    },
  ],
  s1LinkLead: "事業の補助金をお考えの場合は →",
  s1LinkLabel: "補助金申請サポート（四葉行政書士事務所）",
  s1Note:
    "※四葉行政書士事務所・四葉社会保険労務士事務所は、それぞれ別の事業体として独立してご依頼をお受けします（紹介料等の授受はありません）。",
  s2H2: "いつ相談すればいいですか？",
  s2P1: [
    "人を雇う前、制度を変える前です。",
    "助成金は、先に計画を出しておかないと受け取れないものが多いためです。",
  ],
  s2P2: [
    "たとえばキャリアアップ助成金の正社員化コースは、",
    "キャリアアップ計画を、転換の実施日の前日までに労働局へ提出",
    "していないと、 それだけで不支給になります。転換したあとで気づいても、遡って出すことはできません。 計画の期間は3年以上5年以内で設定します。",
  ],
  s2P3: [
    "また、",
    "正社員にする前の契約が有期か無期かで、支給額が変わります。",
    "パートやアルバイトを迎える時点でどちらにするかが、1年後の金額を決めます。",
    "採用の入り口からご相談ください。",
  ],
  s3H2: "受け取れないことがあるのは、どんな場合ですか？",
  s3P1: "先にお伝えしておきます。",
  s3Items: [
    {
      strong: "労働関係法令の違反があると不支給です。",
      mid: "実態が雇用なのに業務委託のままになっている、残業代が支払われていない—— こうした状態のまま申請すると、審査でそこが出ます。",
      strong2: "是正が先、申請が後",
      rest: "という順序は崩せません。",
    },
    {
      strong: "事業主や取締役の3親等以内の親族は、対象労働者になりません。",
      mid: "ご家族を雇う場合は、この点を先に確認します。",
    },
    {
      strong: "不正受給は、返還・違約金・事業主名の公表に加え、申請に関与した社会保険労務士も 連帯して返還債務を負い、氏名が公表されます。",
      mid: "当事務所が要件を満たさない申請をお受けしないのは、このためです。",
    },
  ],
  s3Note:
    "※支給額・要件は年度ごとに改定されます。金額はお見積りの際に、 申請時点の最新の支給要領で確認したうえでお伝えします。",
  s4H2: "費用・受任の流れ",
  s4P1: [
    "着手金なし ＋ 成功報酬 支給額の20%",
    "（税込）です。顧問契約とセットでお受けします。 助成金が受け取れなかった場合、成功報酬は発生しません。",
  ],
  s4FeeLink: "報酬額表",
  s4FlowLink: "ご相談から契約までの流れ",
};

const EN: JoseikinCopy = {
  metaTitle: "Employment-related subsidy applications｜四葉社会保険労務士事務所",
  metaDescription:
    "四葉社会保険労務士事務所 in Bunkyo City, Tokyo supports applications for employment-related subsidies (助成金, such as the Career-Up Subsidy) — from checking eligibility through the plan notification to the payment application. Business grants (補助金, administered mainly by the Ministry of Economy, Trade and Industry) fall within the scope of an administrative scrivener, so we explain the difference in scope.",
  crumbLabel: "Employment-related subsidy applications",
  serviceName: "Support with employment-related subsidy applications",
  heroAlt: "Application documents, representing an employment-related subsidy application",
  h1: "Employment-related subsidy applications",
  lead1: [
    "Applying on your behalf for employment-related ",
    "助成金 (subsidies administered mainly by the Ministry of Health, Labour and Welfare)",
    ", such as the Career-Up Subsidy, is ",
    "work reserved exclusively to Certified Social Insurance and Labor Consultants",
    ". 四葉社会保険労務士事務所 supports you from checking eligibility through the plan notification and the payment application. With many of these schemes you cannot satisfy the requirements after the fact, so the rule is to consult us ",
    "before you hire or change a system",
    ".",
  ],
  lead2: [
    "We charge no upfront fee.",
    " We receive a success fee of 20% of the amount awarded, and only when it is awarded. If the subsidy is refused, no fee arises. ",
    "We accept this work only from companies with an advisory contract.",
  ],
  internalLinks: [
    { href: "/labor/ryokin", label: "Fees for subsidy applications" },
    { href: "/labor/nagare", label: "From consultation to contract" },
    { href: "/labor/services/kaigo-roumu", label: "Labor management for care & disability welfare" },
  ],
  crossLinkLead:
    "If you are considering a business 補助金 (grant, administered mainly by the Ministry of Economy, Trade and Industry), that falls within the scope of an administrative scrivener.",
  s1H2: "What is the difference between 助成金 and 補助金?",
  s1TableHead: ["助成金 (employment-related subsidy)", "補助金 (business grant)"],
  s1Rows: [
    {
      label: "Administered by",
      a: "Mainly the Ministry of Health, Labour and Welfare (employment)",
      b: "Mainly the Ministry of Economy, Trade and Industry (business)",
    },
    {
      label: "Nature",
      a: "Mostly awarded where the requirements are met",
      b: "Selected or rejected through screening",
    },
    {
      label: "Who to instruct",
      aStrong: "Certified Social Insurance and Labor Consultant",
      a: " (this office)",
      bStrong: "Administrative scrivener",
      b: " (四葉行政書士事務所, a separate business)",
    },
  ],
  s1LinkLead: "If you are considering a business 補助金 →",
  s1LinkLabel: "Subsidy Application Support (四葉行政書士事務所)",
  s1Note:
    "* 四葉行政書士事務所 and 四葉社会保険労務士事務所 accept instructions independently, as separate businesses (no referral fees are exchanged).",
  s2H2: "When should I consult you?",
  s2P1: [
    "Before you hire anyone, and before you change a system.",
    " With many subsidies you cannot receive the award unless the plan was filed first.",
  ],
  s2P2: [
    "Take the regular-employee conversion course (正社員化コース) of the Career-Up Subsidy. Unless the ",
    "キャリアアップ計画 (career-up plan) has been filed with the Labour Bureau by the day before the conversion takes effect",
    ", that alone means the subsidy is refused. Noticing after the conversion does not allow you to file retroactively. The plan period is set at no less than three and no more than five years.",
  ],
  s2P3: [
    "Also, ",
    "whether the contract before conversion to regular employment was for a fixed or an indefinite term changes the amount awarded.",
    " Which of the two you choose when you take on a part-time or casual worker determines the amount a year later. ",
    "Please consult us from the point of hiring onward.",
  ],
  s3H2: "In what cases can the subsidy not be received?",
  s3P1: "We tell you these things first.",
  s3Items: [
    {
      strong: "A breach of labor-related legislation means the subsidy is refused.",
      mid: " Work that is employment in substance but left as an outsourcing arrangement, or overtime pay that has not been paid — apply while matters stand like that and the screening will surface it. ",
      strong2: "Rectification first, application second",
      rest: " — that order cannot be reversed.",
    },
    {
      strong: "Relatives of the business owner or a director within the third degree of kinship are not eligible workers.",
      mid: " If you are employing family members, we check this point first.",
    },
    {
      strong: "For fraudulent receipt, besides repayment, a penalty and publication of the employer's name, a Certified Social Insurance and Labor Consultant involved in the application also becomes jointly and severally liable for repayment and has their name published.",
      mid: " This is why this office does not accept applications that do not meet the requirements.",
    },
  ],
  s3Note:
    "* Amounts and requirements are revised each fiscal year. When we quote, we confirm the amount against the payment guidelines in force at the time of application and tell you then.",
  s4H2: "Fees and how the engagement works",
  s4P1: [
    "No upfront fee + a success fee of 20% of the amount awarded",
    " (tax-inclusive). We accept this work together with an advisory contract. If the subsidy is not awarded, no success fee arises.",
  ],
  s4FeeLink: "fee schedule",
  s4FlowLink: "From consultation to contract",
};

const ZH_TW: JoseikinCopy = {
  metaTitle: "僱用相關助成金的申請｜四葉社会保険労務士事務所",
  metaDescription:
    "僱用相關的助成金（キャリアアップ助成金〔職涯提升助成金〕等）的申請，由位於文京區的四葉社会保険労務士事務所提供支援。自要件確認、計畫申報至支給申請。事業的補助金（經濟產業省系統）屬行政書士的領域，將自範圍的差異為您說明。",
  crumbLabel: "僱用相關助成金的申請",
  serviceName: "僱用相關助成金的申請支援",
  heroAlt: "僱用相關助成金申請示意圖（申請書件）",
  h1: "僱用相關助成金的申請",
  lead1: [
    "僱用相關的",
    "助成金（日本厚生勞動省主管的僱用相關補助制度）",
    "（キャリアアップ助成金〔職涯提升助成金〕等）的申請代辦，為",
    "社會保險勞務士的獨占業務",
    "。四葉社会保険労務士事務所自要件確認、計畫申報至支給申請，為您提供支援。助成金多屬無法「事後補足要件」的制度，因此",
    "在僱用或變更制度之前",
    "先行諮詢是鐵則。",
  ],
  lead2: [
    "不收取著手金。",
    "僅於實際領取時，按支給額的20%申受成功報酬。未獲支給者，不產生費用。",
    "僅承接已簽訂顧問契約的公司。",
  ],
  internalLinks: [
    { href: "/labor/ryokin", label: "助成金申請的費用" },
    { href: "/labor/nagare", label: "從諮詢到簽約的流程" },
    { href: "/labor/services/kaigo-roumu", label: "介護・障害福祉的勞務管理" },
  ],
  crossLinkLead:
    "若考慮事業的補助金（經濟產業省系統），則屬行政書士的領域。",
  s1H2: "助成金與補助金，有什麼不同？",
  s1TableHead: ["助成金（僱用相關）", "補助金（事業相關）"],
  s1Rows: [
    { label: "主管", a: "主要為厚生勞動省（僱用相關）", b: "主要為經濟產業省（事業）" },
    { label: "性質", a: "以符合要件即可領取者為主", b: "經審查分為採用與不採用" },
    {
      label: "委託對象",
      aStrong: "社會保險勞務士",
      a: "（本事務所）",
      bStrong: "行政書士",
      b: "（四葉行政書士事務所・不同事業體）",
    },
  ],
  s1LinkLead: "若考慮事業的補助金 →",
  s1LinkLabel: "補助金申請支援（四葉行政書士事務所）",
  s1Note:
    "※四葉行政書士事務所與四葉社会保険労務士事務所，各為不同的事業體，獨立受理委託（不收受介紹費）。",
  s2H2: "應該在什麼時候諮詢？",
  s2P1: [
    "在僱用他人之前、變更制度之前。",
    "因為助成金多屬未先提出計畫便無法領取的制度。",
  ],
  s2P2: [
    "例如キャリアアップ助成金（職涯提升助成金）的正社員化課程，若未",
    "於轉換實施日的前一日之前，將キャリアアップ計画（職涯提升計畫）提出至勞動局",
    "，僅此一點即不予支給。於轉換之後才察覺，亦無法追溯提出。計畫的期間設定為3年以上5年以內。",
  ],
  s2P3: [
    "此外，",
    "轉為正職員工之前的契約為定期或不定期，支給額會有所不同。",
    "在接納兼職或工讀人員的時點選擇何者，將決定1年後的金額。",
    "請自錄用的入口階段即行諮詢。",
  ],
  s3H2: "哪些情形可能無法領取？",
  s3P1: "先向您說明以下幾點。",
  s3Items: [
    {
      strong: "有違反勞動相關法令者，不予支給。",
      mid: "實質上為僱用卻仍維持業務委託、未支付加班費——在此狀態下提出申請，審查時即會顯現。",
      strong2: "先改正、後申請",
      rest: "，此一順序無法變動。",
    },
    {
      strong: "事業主或董事三親等以內的親屬，不列為對象勞工。",
      mid: "僱用家屬時，會先確認此點。",
    },
    {
      strong: "不正當領取者，除返還、違約金、公布事業主名稱外，參與申請的社會保險勞務士亦須連帶負返還債務，並公布姓名。",
      mid: "本事務所不承接不符合要件的申請，即是基於此。",
    },
  ],
  s3Note:
    "※支給額與要件逐年度修訂。金額將於報價時，依申請時點最新的支給要領確認後向您說明。",
  s4H2: "費用與受任的流程",
  s4P1: [
    "無著手金 ＋ 成功報酬 支給額的20%",
    "（含稅）。與顧問契約一併承接。未能領取助成金時，不產生成功報酬。",
  ],
  s4FeeLink: "費用表",
  s4FlowLink: "從諮詢到簽約的流程",
};

const ZH: JoseikinCopy = {
  metaTitle: "雇用相关助成金的申请｜四葉社会保険労務士事務所",
  metaDescription:
    "雇用相关的助成金（キャリアアップ助成金〔职业提升助成金〕等）的申请，由位于文京区的四葉社会保険労務士事務所提供支援。自要件确认、计划申报至支给申请。事业的补助金（经济产业省系统）属行政书士的领域，将自范围的差异为您说明。",
  crumbLabel: "雇用相关助成金的申请",
  serviceName: "雇用相关助成金的申请支援",
  heroAlt: "雇用相关助成金申请示意图（申请文件）",
  h1: "雇用相关助成金的申请",
  lead1: [
    "雇用相关的",
    "助成金（日本厚生劳动省主管的雇用相关补助制度）",
    "（キャリアアップ助成金〔职业提升助成金〕等）的申请代办，为",
    "社会保险劳务士的独占业务",
    "。四葉社会保険労務士事務所自要件确认、计划申报至支给申请，为您提供支援。助成金多属无法「事后补足要件」的制度，因此",
    "在雇用或变更制度之前",
    "先行咨询是铁则。",
  ],
  lead2: [
    "不收取着手金。",
    "仅于实际领取时，按支给额的20%申受成功报酬。未获支给者，不产生费用。",
    "仅承接已签订顾问合同的公司。",
  ],
  internalLinks: [
    { href: "/labor/ryokin", label: "助成金申请的费用" },
    { href: "/labor/nagare", label: "从咨询到签约的流程" },
    { href: "/labor/services/kaigo-roumu", label: "介护・残障福祉的劳务管理" },
  ],
  crossLinkLead:
    "若考虑事业的补助金（经济产业省系统），则属行政书士的领域。",
  s1H2: "助成金与补助金，有什么不同？",
  s1TableHead: ["助成金（雇用相关）", "补助金（事业相关）"],
  s1Rows: [
    { label: "主管", a: "主要为厚生劳动省（雇用相关）", b: "主要为经济产业省（事业）" },
    { label: "性质", a: "以符合要件即可领取者为主", b: "经审查分为采用与不采用" },
    {
      label: "委托对象",
      aStrong: "社会保险劳务士",
      a: "（本事务所）",
      bStrong: "行政书士",
      b: "（四葉行政書士事務所・不同事业体）",
    },
  ],
  s1LinkLead: "若考虑事业的补助金 →",
  s1LinkLabel: "补助金申请支援（四葉行政書士事務所）",
  s1Note:
    "※四葉行政書士事務所与四葉社会保険労務士事務所，各为不同的事业体，独立受理委托（不收受介绍费）。",
  s2H2: "应该在什么时候咨询？",
  s2P1: [
    "在雇用他人之前、变更制度之前。",
    "因为助成金多属未先提出计划便无法领取的制度。",
  ],
  s2P2: [
    "例如キャリアアップ助成金（职业提升助成金）的正社员化课程，若未",
    "于转换实施日的前一日之前，将キャリアアップ計画（职业提升计划）提出至劳动局",
    "，仅此一点即不予支给。于转换之后才察觉，亦无法追溯提出。计划的期间设定为3年以上5年以内。",
  ],
  s2P3: [
    "此外，",
    "转为正式员工之前的合同为定期或不定期，支给额会有所不同。",
    "在接纳兼职或打工人员的时点选择何者，将决定1年后的金额。",
    "请自录用的入口阶段即行咨询。",
  ],
  s3H2: "哪些情形可能无法领取？",
  s3P1: "先向您说明以下几点。",
  s3Items: [
    {
      strong: "有违反劳动相关法令者，不予支给。",
      mid: "实质上为雇用却仍维持业务委托、未支付加班费——在此状态下提出申请，审查时即会显现。",
      strong2: "先改正、后申请",
      rest: "，此一顺序无法变动。",
    },
    {
      strong: "事业主或董事三亲等以内的亲属，不列为对象劳工。",
      mid: "雇用家属时，会先确认此点。",
    },
    {
      strong: "不正当领取者，除返还、违约金、公布事业主名称外，参与申请的社会保险劳务士亦须连带负返还债务，并公布姓名。",
      mid: "本事务所不承接不符合要件的申请，即是基于此。",
    },
  ],
  s3Note:
    "※支给额与要件逐年度修订。金额将于报价时，依申请时点最新的支给要领确认后向您说明。",
  s4H2: "费用与受任的流程",
  s4P1: [
    "无着手金 ＋ 成功报酬 支给额的20%",
    "（含税）。与顾问合同一并承接。未能领取助成金时，不产生成功报酬。",
  ],
  s4FeeLink: "费用表",
  s4FlowLink: "从咨询到签约的流程",
};

export const JOSEIKIN_COPY: Record<LangCode, JoseikinCopy> = {
  ja: JA,
  en: EN,
  "zh-tw": ZH_TW,
  zh: ZH,
};
