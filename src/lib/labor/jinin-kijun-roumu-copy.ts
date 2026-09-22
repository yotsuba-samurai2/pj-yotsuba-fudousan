import type { LangCode } from "@/config/languages";

/**
 * /labor/services/jinin-kijun-roumu（障害福祉事業所の人員基準と労務）の4ロケール文言。
 *
 * 方式＝手本B（COPY を src/lib/labor/ に切り出す。既存＝kaigo-service-copy.ts）。
 * 日本語（JA）は 2026-09-22 時点のJSX直書きを**1字も変えずに**移しただけ。
 *
 * 【翻訳の規律】指示書 2026-09-22 §2／`luck428-column-seo` 第5条の3／`shigyo-compliance-gate`
 *   ・日本語版にない事実・数値を訳で足さない。構成・見出し数・段落数・表の行数を同じにする
 *   ・法令名・制度名は日本語の原名を残し、各言語の説明を併記する
 *   ・事務所名は全ロケールで日本語表記のまま
 *   ・分離受任は既存表記に統一（另行簽訂契約承辦／另行签订合同承办）
 *   ・断定的な法的判断を書かない。「判断材料」「一般的な取り扱い」の形を日本語版どおりに保つ
 *   ・報酬額を書かない（別契約・別料金／要見積り）
 *
 * 【日本語のみのリンク先】本ページは日本語版にしか存在しない2つのページへリンクしている。
 *   ・/legal/column/group-home-sewanin-seikatsushienin-haichi … コラムの locales は ["ja"]。
 *     `[slug]/page.tsx` が `isLocaleAllowed` で弾くため、ロケール接頭辞つきURLは**404になる**
 *   ・/reasons … availableLocales:["ja"] のページ（接頭辞つきでも日本語本文を返す）
 *   そのため訳文ではこの2本だけ接頭辞を付けず日本語版URLへ送り、ラベルに「日文」を添える
 *   （既存の表記＝setup-copy.ts の「（限法人・日文）」に揃えた）。
 *   ja では `addLocalePrefix(path, "ja") === path` なので日本語版の出力は変わらない。
 */
export type JininKijunRoumuCopy = {
  metaTitle: string;
  metaDescription: string;
  crumbLabel: string;
  serviceName: string;
  heroAlt: string;
  h1: string;
  /** リード＝[前, 強調1, 中1, 強調2, 中2, 強調3, 中3, 強調4, 後] */
  lead: readonly [string, string, string, string, string, string, string, string, string];
  internalLinks: readonly { href: string; label: string }[];
  crossLinkLead: string;
  s1H2: string;
  /** [前, 強調1, 中, 強調2, 後] */
  s1P1: readonly [string, string, string, string, string];
  /** [前, 強調, 後] */
  s1P2: readonly [string, string, string];
  /** [前, 日本語コラムへのリンク文言, 後] */
  s1Note: readonly [string, string, string];
  s2H2: string;
  s2P1: string;
  s2Items: readonly { strong: string; rest: string }[];
  s2P2: string;
  s3H2: string;
  /** [前, 強調, 後] */
  s3P1: readonly [string, string, string];
  s3Items: readonly string[];
  s3Note: string;
  s4H2: string;
  /** [前, 強調, 後] */
  s4P1: readonly [string, string, string];
  s4TableHead: readonly [string, string, string];
  s4Rows: readonly { when: string; shitei: string; roumu: string }[];
  s4Note: string;
  s5H2: string;
  s5P1: string;
  s5Items: readonly { strong: string; rest: string }[];
  /** [前, 強調, 後] */
  s5P2: readonly [string, string, string];
  /** /reasons（日本語のみ）へのリンク文言 */
  s5LinkLabel: string;
  s6H2: string;
  /** [前, 強調, 後] */
  s6P1: readonly [string, string, string];
  s6LinkLabel: string;
  s7H2: string;
  s7Items: readonly string[];
  /** [前, 強調（未検証）, 後] */
  s7Note: readonly [string, string, string];
  disclaimer: string;
  lastUpdatedLabel: string;
  lastUpdated: string;
};

const JA: JininKijunRoumuCopy = {
  metaTitle: "障害福祉事業所の人員基準と労務｜四葉社会保険労務士事務所",
  metaDescription:
    "指定基準の「常勤換算」と、就業規則で定める所定労働時間は別の話です。基準を満たす体制を、雇用として成立させる側の論点を整理しました。文京区の四葉社会保険労務士事務所。指定申請の書類作成は四葉行政書士事務所が別契約で受任します。",
  crumbLabel: "人員基準と労務",
  serviceName: "障害福祉事業所の人員基準に対応する労務体制の整備",
  heroAlt: "障害福祉事業所の人員基準と労務のイメージ（勤務体制一覧表）",
  h1: "障害福祉事業所の人員基準と労務",
  lead: [
    "指定基準でいう",
    "「常勤換算」",
    "と、就業規則で定める",
    "所定労働時間",
    "は、別の話です。基準を満たす人数を並べても、雇用契約・就業規則・勤怠の実態がそれに伴っていなければ、体制として成り立ちません。このページでは、",
    "基準を満たす体制を「雇用として」成立させる側",
    "の論点を整理します。指定基準そのものの要件解説と申請書類の作成は、四葉行政書士事務所が",
    "別の契約で",
    "受任します。",
  ],
  internalLinks: [
    { href: "/labor/services/kaigo-roumu", label: "介護・障害福祉の労務管理" },
    { href: "/labor/services/shogu-kaizen", label: "処遇改善加算のサポート" },
    { href: "/labor/ryokin", label: "料金のご案内" },
    { href: "/labor/nagare", label: "ご相談から契約までの流れ" },
  ],
  crossLinkLead:
    "指定申請の書類作成は四葉行政書士事務所、物件は四葉不動産株式会社が、それぞれ別の契約で受任します。",
  s1H2: "「常勤換算」と就業規則の所定労働時間は、どう関係しますか？",
  s1P1: [
    "常勤換算は、非常勤職員の勤務時間を「常勤職員なら何人分にあたるか」に置き換える考え方です。その分母になるのが、",
    "その事業所で定めた常勤職員の所定労働時間",
    "です。所定労働時間は就業規則や雇用契約で定めるものなので、",
    "就業規則の内容が変われば、同じ勤務実態でも常勤換算の数値が変わります",
    "。",
  ],
  s1P2: [
    "そのため、申請書類の上で人数が足りていても、就業規則の定めや実際の勤務実態とずれていれば、後の実地指導で説明を求められる場面があります。基準の充足を「書類の数字」だけで考えず、",
    "就業規則・雇用契約・勤怠記録の3つが同じ前提で書かれているか",
    "を確認しておくのが要点です。",
  ],
  s1Note: [
    "常勤換算の計算方法や必要な配置人数そのものは、指定基準の側の論点です。",
    "世話人・生活支援員の人員配置基準（四葉行政書士事務所のコラム）",
    "をご覧ください。",
  ],
  s2H2: "人員配置基準を満たすことと、労働法上きちんと雇うことは何が違いますか？",
  s2P1:
    "見ている法律が違います。人員配置基準は、障害者総合支援法にもとづく指定の基準として「どういう職種を何人置くか」を定めます。一方で、その人をどう雇うかは労働基準法などの労働関係法令が、社会保険への加入は健康保険法・厚生年金保険法などが定めます。",
  s2Items: [
    { strong: "指定基準の側", rest: "：職種、必要人数、常勤と非常勤の別、資格の要件" },
    { strong: "労働関係法令の側", rest: "：労働条件の明示、労働時間・休憩・休日、割増賃金、年次有給休暇" },
    { strong: "社会保険の側", rest: "：適用事業所の要件、被保険者となる人の範囲、届出の期限" },
  ],
  s2P2:
    "「基準を満たす人を確保する」ことと「その人を適法に雇う」ことは、どちらか一方だけでは足りません。開設の準備では、両方を並べて確認しておくことをお勧めします。",
  s3H2: "管理者とサービス管理責任者を兼務させる場合、労務上の注意点はありますか？",
  s3P1: [
    "兼務が指定基準上認められるかどうかは、サービス種別・事業所の規模・指定権者の取り扱いによって異なります。ここでは、兼務が認められる前提で",
    "労務の側で確認しておく点",
    "を挙げます。",
  ],
  s3Items: [
    "雇用契約書・労働条件通知書に、担う職務の範囲がどう書かれているか",
    "就業規則上の職位・役職手当と、実際の職務内容が対応しているか",
    "労働時間の管理を、兼務する職務ごとに分けて記録する必要があるか",
    "管理監督者にあたるかどうかの判断（労働基準法第41条第2号）を、役職名ではなく実態で確認しているか",
  ],
  s3Note:
    "管理監督者にあたるかどうかは、役職の名称ではなく職務内容・権限・待遇の実態で判断されるとされています。個別の判断は、面談のうえ資格者が行います。",
  s4H2: "申請書に書いた人員体制と、実際の勤務シフトがずれたらどうなりますか？",
  s4P1: [
    "指定を受けた後も、体制に変更があれば指定権者への届出が必要になる場合があります。これは指定基準の側の手続きです。あわせて、労務の側でも社会保険・雇用保険の届出が必要になることがあります。",
    "この2つは提出先も期限も別",
    "なので、どちらか一方だけを出して終わりにしないことが要点です。",
  ],
  s4TableHead: [
    "こういうとき",
    "指定基準の側（四葉行政書士事務所が別契約で受任）",
    "労務の側（当事務所が承ります）",
  ],
  s4Rows: [
    {
      when: "職員を採用したとき",
      shitei: "体制に変更があれば変更届（指定権者へ）",
      roumu: "健康保険・厚生年金の資格取得届、雇用保険の資格取得届",
    },
    { when: "職員が退職したとき", shitei: "同上", roumu: "資格喪失届、離職票の交付" },
    {
      when: "管理者・サービス管理責任者が交代したとき",
      shitei: "変更届（指定権者へ）",
      roumu: "雇用契約・職務内容の変更、就業規則上の位置づけの確認",
    },
    {
      when: "勤務形態を変えたとき（常勤と非常勤の別・時間数の変更）",
      shitei: "常勤換算に影響する場合は体制の見直し",
      roumu: "労働条件通知書の再交付、社会保険の被保険者区分の確認",
    },
  ],
  s4Note:
    "届出の要否・期限・様式は、サービス種別と指定権者によって異なります。上表は担当が分かれることを示すための整理で、個別の事案の判断材料としてそのまま用いるものではありません。",
  s5H2: "人員基準の相談は、行政書士と社労士のどちらにすればいいですか？",
  s5P1: "聞きたいことによって分かれます。",
  s5Items: [
    {
      strong: "「何人配置すればいいか」「申請書にどう書くか」",
      rest: "——指定基準の側。四葉行政書士事務所が別の契約で受任します",
    },
    {
      strong: "「その人をどう雇えばいいか」「就業規則をどう直すか」",
      rest: "——労務の側。当事務所が承ります",
    },
  ],
  s5P2: [
    "どちらか判断がつかない段階でも差し支えありません。ご相談の内容を伺って、どの部分をどの事務所が担うかを最初にお示しします。",
    "2つの事務所は同一の所在地にありますが、それぞれ独立した事業体です。",
    "契約・請求・お振込先も分かれます。必要な部分だけをご依頼いただけます。",
  ],
  s5LinkLabel: "四葉が選ばれる理由（契約が分かれる理由）",
  s6H2: "料金はいくらですか？",
  s6P1: [
    "業務の範囲と事業所の規模により異なるため、お見積りをお示しします。四葉不動産株式会社・四葉行政書士事務所の料金とは",
    "別建て",
    "です。",
  ],
  s6LinkLabel: "料金のご案内",
  s7H2: "このページの根拠",
  s7Items: [
    "人員配置基準＝障害者の日常生活及び社会生活を総合的に支援するための法律（平成17年法律第123号）にもとづく指定基準（サービス種別ごとの省令）",
    "管理監督者の範囲＝労働基準法（昭和22年法律第49号）第41条第2号",
    "労働条件の明示＝労働基準法第15条第1項",
    "社会保険の適用・届出＝健康保険法（大正11年法律第70号）、厚生年金保険法（昭和29年法律第115号）",
    "雇用保険の届出＝雇用保険法（昭和49年法律第116号）",
  ],
  s7Note: [
    "※各法令の最終改正日および省令の条項番号は、本ページ作成時点で個別に一次確認していません（",
    "未検証",
    "）。常勤換算の算定方法・届出の期限・様式はサービス種別と指定権者により異なります。最新の取り扱いは指定権者の要綱をご確認いただくか、面談のうえご案内します。",
  ],
  disclaimer:
    "本ページは一般的な情報提供です。個別の事案については、資格者による確認を経てご案内します。指定申請の書類作成は四葉行政書士事務所、不動産の取引は四葉不動産株式会社が、それぞれ別の契約で受任します。税務の申告と代理は税理士、登記は司法書士、紛争性のある事案は弁護士の業務です。",
  lastUpdatedLabel: "最終更新：",
  lastUpdated: "2026年7月29日",
};

const EN: JininKijunRoumuCopy = {
  metaTitle: "Staffing standards and labor for disability-welfare providers｜四葉社会保険労務士事務所",
  metaDescription:
    "The 常勤換算 (full-time-equivalent conversion) used in the designation standards and the prescribed working hours set in your work rules are two different things. We set out the issues involved in making a compliant staffing arrangement work as employment. 四葉社会保険労務士事務所 in Bunkyo City, Tokyo. Preparing the designation application documents is handled by 四葉行政書士事務所 under a separate contract.",
  crumbLabel: "Staffing standards and labor",
  serviceName: "Building labor arrangements that match staffing standards for disability-welfare providers",
  heroAlt: "A staffing roster, representing staffing standards and labor at a disability-welfare provider",
  h1: "Staffing standards and labor for disability-welfare providers",
  lead: [
    "The ",
    "常勤換算 (full-time-equivalent conversion)",
    " used in the designation standards and the ",
    "prescribed working hours",
    " set in your work rules are two different things. Lining up enough people to meet the standard does not make the arrangement stand up if the employment contracts, work rules and actual attendance do not follow. This page sets out the issues on the side that makes ",
    "a compliant staffing arrangement work as employment",
    ". Explaining the designation requirements themselves and preparing the application documents are handled by 四葉行政書士事務所 ",
    "under a separate contract",
    ".",
  ],
  internalLinks: [
    { href: "/labor/services/kaigo-roumu", label: "Labor management for care & disability welfare" },
    { href: "/labor/services/shogu-kaizen", label: "Treatment-improvement addition support" },
    { href: "/labor/ryokin", label: "Fees" },
    { href: "/labor/nagare", label: "From consultation to contract" },
  ],
  crossLinkLead:
    "Preparing the designation application documents is handled by 四葉行政書士事務所 and property by Yotsuba Real Estate Co., Ltd., each under a separate contract.",
  s1H2: "How does 常勤換算 relate to the prescribed working hours in the work rules?",
  s1P1: [
    "常勤換算 is the idea of converting part-time staff hours into “how many full-time staff this amounts to.” The denominator of that calculation is ",
    "the prescribed working hours set for full-time staff at that provider",
    ". Because prescribed working hours are set in the work rules and employment contracts, ",
    "a change to the work rules changes the full-time-equivalent figure even where the actual pattern of work is the same",
    ".",
  ],
  s1P2: [
    "So even where the application documents show enough people, a gap between what the work rules provide and how work is actually performed can lead to questions at a later on-site inspection. Rather than treating compliance as a matter of the figures on the form, the point is to check that ",
    "the work rules, the employment contracts and the attendance records are all written on the same assumptions",
    ".",
  ],
  s1Note: [
    "How 常勤換算 is calculated, and how many staff must be placed, are issues on the designation-standards side. Please see ",
    "Staffing standards for support workers and daily-living support staff (a column by 四葉行政書士事務所, in Japanese)",
    ".",
  ],
  s2H2: "What is the difference between meeting the staffing standards and employing people properly under labor law?",
  s2P1:
    "They look to different laws. The staffing standards, as designation criteria under 障害者総合支援法 (the Act on Comprehensive Support for Persons with Disabilities), set out which roles must be filled and by how many people. How you employ those people is governed by the Labor Standards Act and other labor legislation, and coverage by social insurance by the Health Insurance Act, the Employees' Pension Insurance Act and others.",
  s2Items: [
    { strong: "Designation-standards side", rest: ": roles, required numbers, full-time or part-time, qualification requirements" },
    { strong: "Labor-legislation side", rest: ": stating working conditions, working hours, breaks and days off, premium wages, annual paid leave" },
    { strong: "Social-insurance side", rest: ": criteria for a covered workplace, who becomes an insured person, filing deadlines" },
  ],
  s2P2:
    "“Securing people who meet the standard” and “employing those people lawfully” are not enough on their own. When preparing to open, we recommend checking both side by side.",
  s3H2: "If the administrator also serves as サービス管理責任者, what should be watched on the labor side?",
  s3P1: [
    "Whether concurrent service is permitted under the designation standards varies with the service category, the size of the provider and the practice of the designating authority. Here we list the ",
    "points to check on the labor side",
    " on the assumption that concurrent service is permitted.",
  ],
  s3Items: [
    "How the scope of the duties undertaken is written in the employment contract and the notice of working conditions",
    "Whether the position and position allowance under the work rules correspond to the duties actually performed",
    "Whether working hours need to be recorded separately for each of the concurrent roles",
    "Whether the question of supervisory or managerial status (Labor Standards Act, Article 41, item 2) is being checked against the substance rather than the job title",
  ],
  s3Note:
    "Whether someone holds supervisory or managerial status is said to be judged on the substance of duties, authority and treatment rather than on the title of the position. Individual determinations are made by a qualified professional following consultation.",
  s4H2: "What happens if the staffing arrangement stated on the application and the actual shift roster diverge?",
  s4P1: [
    "Even after designation, a change to the arrangement may require notification to the designating authority. That is a procedure on the designation-standards side. Alongside it, notifications for social insurance and employment insurance may also be required on the labor side. ",
    "The two go to different places and have different deadlines,",
    " so the point is not to file one and consider the matter closed.",
  ],
  s4TableHead: [
    "When this happens",
    "Designation-standards side (handled by 四葉行政書士事務所 under a separate contract)",
    "Labor side (handled by this office)",
  ],
  s4Rows: [
    {
      when: "A staff member is hired",
      shitei: "Notification of change to the designating authority, if the arrangement changes",
      roumu: "Notification of acquisition of insured status for health insurance and employees' pension, and for employment insurance",
    },
    { when: "A staff member leaves", shitei: "As above", roumu: "Notification of loss of insured status, and issuing the separation certificate" },
    {
      when: "The administrator or サービス管理責任者 changes",
      shitei: "Notification of change to the designating authority",
      roumu: "Changes to the employment contract and duties, and checking the position under the work rules",
    },
    {
      when: "Working patterns change (full-time or part-time status, or number of hours)",
      shitei: "Review of the arrangement where the full-time-equivalent figure is affected",
      roumu: "Reissuing the notice of working conditions, and checking the social-insurance category of the insured person",
    },
  ],
  s4Note:
    "Whether a notification is required, and its deadline and form, vary with the service category and the designating authority. The table above is set out to show how responsibilities divide, and is not to be used as it stands to decide an individual case.",
  s5H2: "For staffing standards, should I consult an administrative scrivener or a Certified Social Insurance and Labor Consultant?",
  s5P1: "It divides according to what you want to ask.",
  s5Items: [
    {
      strong: "“How many people must be placed?” “How should the application be written?”",
      rest: " — the designation-standards side. 四葉行政書士事務所 handles this under a separate contract",
    },
    {
      strong: "“How should those people be employed?” “How should the work rules be revised?”",
      rest: " — the labor side. This office handles this",
    },
  ],
  s5P2: [
    "It is quite all right if you cannot yet tell which it is. We listen to what you want to discuss and show you at the outset which office handles which part. ",
    "The two offices are at the same address but are independent businesses.",
    " Contracts, invoices and payment details are also separate. You can engage only the part you need.",
  ],
  s5LinkLabel: "Why clients choose Yotsuba — and why the contracts are separate (in Japanese)",
  s6H2: "How much does it cost?",
  s6P1: [
    "Because it varies with the scope of work and the size of the provider, we give you a quotation. It is ",
    "billed separately",
    " from the fees of Yotsuba Real Estate Co., Ltd. and 四葉行政書士事務所.",
  ],
  s6LinkLabel: "Fees",
  s7H2: "The basis for this page",
  s7Items: [
    "Staffing standards = the designation standards (ministerial ordinances for each service category) under 障害者の日常生活及び社会生活を総合的に支援するための法律 (the Act on Comprehensive Support for the Daily and Social Life of Persons with Disabilities, Act No. 123 of 2005)",
    "Scope of supervisory and managerial status = Labor Standards Act (Act No. 49 of 1947), Article 41, item 2",
    "Stating working conditions = Labor Standards Act, Article 15, paragraph 1",
    "Social-insurance coverage and notifications = Health Insurance Act (Act No. 70 of 1922) and Employees' Pension Insurance Act (Act No. 115 of 1954)",
    "Employment-insurance notifications = Employment Insurance Act (Act No. 116 of 1974)",
  ],
  s7Note: [
    "* The dates of last amendment of each statute, and the article numbers of the ministerial ordinances, have not been individually verified against primary sources as at the time this page was written (",
    "not verified",
    "). How 常勤換算 is calculated, and the deadlines and forms for notifications, vary with the service category and the designating authority. Please check the current treatment in the designating authority's guidelines, or we will explain it at a consultation.",
  ],
  disclaimer:
    "This page is general information. Individual cases are explained after confirmation by a qualified professional. Preparing the designation application documents is handled by 四葉行政書士事務所 and real-estate transactions by Yotsuba Real Estate Co., Ltd., each under a separate contract. Tax filing and representation are the work of a tax accountant, registration that of a judicial scrivener, and contentious matters that of an attorney.",
  lastUpdatedLabel: "Last updated: ",
  lastUpdated: "29 July 2026",
};

const ZH_TW: JininKijunRoumuCopy = {
  metaTitle: "障害福祉事業所的人員基準與勞務｜四葉社会保険労務士事務所",
  metaDescription:
    "指定基準所稱的「常勤換算」，與就業規則所定的所定工時，是兩回事。本頁整理了讓符合基準的體制「在雇用上」得以成立的一側論點。文京區的四葉社会保険労務士事務所。指定申請的書件製作由四葉行政書士事務所另行簽訂契約承辦。",
  crumbLabel: "人員基準與勞務",
  serviceName: "因應障害福祉事業所人員基準的勞務體制整備",
  heroAlt: "障害福祉事業所人員基準與勞務示意圖（勤務體制一覽表）",
  h1: "障害福祉事業所的人員基準與勞務",
  lead: [
    "指定基準所稱的",
    "「常勤換算」（換算為全職人力的計算方式）",
    "，與就業規則所定的",
    "所定工時",
    "，是兩回事。即使排出符合基準的人數，若雇用契約・就業規則・出勤的實際情形未能相符，體制仍無法成立。本頁整理的是",
    "讓符合基準的體制「在雇用上」得以成立",
    "的一側論點。指定基準本身的要件解說與申請書件的製作，由四葉行政書士事務所",
    "另行簽訂契約",
    "承辦。",
  ],
  internalLinks: [
    { href: "/labor/services/kaigo-roumu", label: "介護・障害福祉的勞務管理" },
    { href: "/labor/services/shogu-kaizen", label: "處遇改善加算的支援" },
    { href: "/labor/ryokin", label: "費用說明" },
    { href: "/labor/nagare", label: "從諮詢到簽約的流程" },
  ],
  crossLinkLead:
    "指定申請的書件製作由四葉行政書士事務所、物件由四葉不動産株式会社，各自另行簽訂契約承辦。",
  s1H2: "「常勤換算」與就業規則的所定工時，有何關係？",
  s1P1: [
    "常勤換算，是將非全職職員的工作時間換算為「相當於幾位全職職員」的計算方式。作為其分母的，是",
    "該事業所所定的全職職員所定工時",
    "。所定工時是由就業規則或雇用契約所定，因此",
    "就業規則的內容一有變動，即使實際的工作情形相同，常勤換算的數值也會改變",
    "。",
  ],
  s1P2: [
    "因此，即使申請書件上的人數足夠，若與就業規則的規定或實際的工作情形有落差，日後的實地指導可能會要求說明。不要僅以「書件上的數字」判斷是否符合基準，重點在於先確認",
    "就業規則・雇用契約・出勤紀錄三者是否以相同的前提書寫",
    "。",
  ],
  s1Note: [
    "常勤換算的計算方法與所需配置人數本身，屬指定基準一側的論點。請參閱",
    "世話人・生活支援員的人員配置基準（四葉行政書士事務所的專欄・日文）",
    "。",
  ],
  s2H2: "符合人員配置基準，與在勞動法上妥適地雇用，有什麼不同？",
  s2P1:
    "所依據的法律不同。人員配置基準，是依障害者総合支援法（日本的身心障礙者綜合支援法）所定的指定基準，規範「配置哪些職種、各幾人」。另一方面，如何雇用這些人由勞動基準法等勞動相關法令規範，加入社會保險則由健康保險法・厚生年金保險法等規範。",
  s2Items: [
    { strong: "指定基準一側", rest: "：職種、必要人數、全職與非全職之別、資格要件" },
    { strong: "勞動相關法令一側", rest: "：勞動條件的明示、工作時間・休息・休假、加成工資、年度有薪假" },
    { strong: "社會保險一側", rest: "：適用事業所的要件、成為被保險人者的範圍、申報的期限" },
  ],
  s2P2:
    "「確保符合基準的人」與「合法地雇用該人」，僅具其一並不足夠。在開設的準備階段，建議將兩者並列確認。",
  s3H2: "讓管理者兼任サービス管理責任者（服務管理負責人）時，勞務上有哪些注意事項？",
  s3P1: [
    "兼任在指定基準上是否獲准，依服務類別・事業所規模・指定權者的處理方式而異。此處以兼任獲准為前提，列出",
    "勞務一側應先確認的事項",
    "。",
  ],
  s3Items: [
    "雇用契約書・勞動條件通知書中，所承擔職務的範圍如何記載",
    "就業規則上的職位・職務加給，與實際的職務內容是否相符",
    "工作時間的管理，是否需依兼任的各項職務分別記錄",
    "是否屬管理監督者的判斷（勞動基準法第41條第2號），是否依實際情形而非職稱確認",
  ],
  s3Note:
    "是否屬管理監督者，一般認為是依職務內容・權限・待遇的實際情形判斷，而非依職位的名稱。個別的判斷，將於面談後由有資格者進行。",
  s4H2: "申請書上記載的人員體制，與實際的排班有落差時會如何？",
  s4P1: [
    "取得指定之後，體制若有變更，仍可能需向指定權者申報。這是指定基準一側的手續。同時，勞務一側也可能需辦理社會保險・雇用保險的申報。",
    "這兩者的提出對象與期限都不同",
    "，因此重點在於不要只提出其中一方便視為完成。",
  ],
  s4TableHead: [
    "這種情形",
    "指定基準一側（四葉行政書士事務所另行簽訂契約承辦）",
    "勞務一側（由本事務所承辦）",
  ],
  s4Rows: [
    {
      when: "錄用職員時",
      shitei: "體制若有變更則提出變更申報（向指定權者）",
      roumu: "健康保險・厚生年金的資格取得申報、雇用保險的資格取得申報",
    },
    { when: "職員離職時", shitei: "同上", roumu: "資格喪失申報、離職票的交付" },
    {
      when: "管理者・サービス管理責任者更換時",
      shitei: "變更申報（向指定權者）",
      roumu: "雇用契約・職務內容的變更、就業規則上定位的確認",
    },
    {
      when: "變更工作型態時（全職與非全職之別・時數的變更）",
      shitei: "若影響常勤換算則重新檢視體制",
      roumu: "勞動條件通知書的重新交付、社會保險被保險人類別的確認",
    },
  ],
  s4Note:
    "申報的要否・期限・格式，依服務類別與指定權者而異。上表是為顯示分工而作的整理，並非可逕行作為個別案件判斷材料之用。",
  s5H2: "人員基準的諮詢，該找行政書士還是社會保險勞務士？",
  s5P1: "依想詢問的內容而分。",
  s5Items: [
    {
      strong: "「應配置幾人」「申請書該如何記載」",
      rest: "——屬指定基準一側。由四葉行政書士事務所另行簽訂契約承辦",
    },
    {
      strong: "「該如何雇用該人」「就業規則該如何修改」",
      rest: "——屬勞務一側。由本事務所承辦",
    },
  ],
  s5P2: [
    "即使尚無法判斷屬於何者，亦無妨。聽取您欲諮詢的內容後，會先說明哪一部分由哪一事務所負責。",
    "兩間事務所雖位於相同所在地，但各為獨立的事業體。",
    "契約・請款・匯款帳戶亦各自分開。您可以僅委託所需的部分。",
  ],
  s5LinkLabel: "四葉被選擇的理由（契約分開的理由・日文）",
  s6H2: "費用是多少？",
  s6P1: [
    "因業務範圍與事業所規模而異，故將向您提出報價。與四葉不動産株式会社・四葉行政書士事務所的費用",
    "分開計算",
    "。",
  ],
  s6LinkLabel: "費用說明",
  s7H2: "本頁的依據",
  s7Items: [
    "人員配置基準＝依障害者の日常生活及び社会生活を総合的に支援するための法律（日本的身心障礙者日常生活及社會生活綜合支援法・平成17年法律第123號）所定的指定基準（各服務類別的省令）",
    "管理監督者的範圍＝勞動基準法（昭和22年法律第49號）第41條第2號",
    "勞動條件的明示＝勞動基準法第15條第1項",
    "社會保險的適用・申報＝健康保險法（大正11年法律第70號）、厚生年金保險法（昭和29年法律第115號）",
    "雇用保險的申報＝雇用保險法（昭和49年法律第116號）",
  ],
  s7Note: [
    "※各法令的最終修正日及省令的條項號碼，於本頁製作時點尚未逐一向一次資料確認（",
    "未驗證",
    "）。常勤換算的計算方法・申報的期限・格式，依服務類別與指定權者而異。最新的處理方式，請確認指定權者的要綱，或於面談時為您說明。",
  ],
  disclaimer:
    "本頁為一般性的資訊提供。個別案件將經有資格者確認後為您說明。指定申請的書件製作由四葉行政書士事務所、不動產的交易由四葉不動産株式会社，各自另行簽訂契約承辦。稅務的申報與代理為稅理士、登記為司法書士、具爭議性的案件為律師的業務。",
  lastUpdatedLabel: "最終更新：",
  lastUpdated: "2026年7月29日",
};

const ZH: JininKijunRoumuCopy = {
  metaTitle: "障害福祉事業所的人员基准与劳务｜四葉社会保険労務士事務所",
  metaDescription:
    "指定基准所称的「常勤换算」，与就业规则所定的所定工时，是两回事。本页整理了让符合基准的体制「在雇用上」得以成立的一侧论点。文京区的四葉社会保険労務士事務所。指定申请的文件制作由四葉行政書士事務所另行签订合同承办。",
  crumbLabel: "人员基准与劳务",
  serviceName: "因应障害福祉事業所人员基准的劳务体制整备",
  heroAlt: "障害福祉事業所人员基准与劳务示意图（勤务体制一览表）",
  h1: "障害福祉事業所的人员基准与劳务",
  lead: [
    "指定基准所称的",
    "「常勤换算」（换算为全职人力的计算方式）",
    "，与就业规则所定的",
    "所定工时",
    "，是两回事。即使排出符合基准的人数，若雇用合同・就业规则・出勤的实际情形未能相符，体制仍无法成立。本页整理的是",
    "让符合基准的体制「在雇用上」得以成立",
    "的一侧论点。指定基准本身的要件解说与申请文件的制作，由四葉行政書士事務所",
    "另行签订合同",
    "承办。",
  ],
  internalLinks: [
    { href: "/labor/services/kaigo-roumu", label: "介护・残障福祉的劳务管理" },
    { href: "/labor/services/shogu-kaizen", label: "处遇改善加算的支援" },
    { href: "/labor/ryokin", label: "费用说明" },
    { href: "/labor/nagare", label: "从咨询到签约的流程" },
  ],
  crossLinkLead:
    "指定申请的文件制作由四葉行政書士事務所、物件由四葉不動産株式会社，各自另行签订合同承办。",
  s1H2: "「常勤换算」与就业规则的所定工时，有何关系？",
  s1P1: [
    "常勤换算，是将非全职职员的工作时间换算为「相当于几位全职职员」的计算方式。作为其分母的，是",
    "该事业所所定的全职职员所定工时",
    "。所定工时是由就业规则或雇用合同所定，因此",
    "就业规则的内容一有变动，即使实际的工作情形相同，常勤换算的数值也会改变",
    "。",
  ],
  s1P2: [
    "因此，即使申请文件上的人数足够，若与就业规则的规定或实际的工作情形有落差，日后的实地指导可能会要求说明。不要仅以「文件上的数字」判断是否符合基准，重点在于先确认",
    "就业规则・雇用合同・出勤记录三者是否以相同的前提书写",
    "。",
  ],
  s1Note: [
    "常勤换算的计算方法与所需配置人数本身，属指定基准一侧的论点。请参阅",
    "世話人・生活支援員的人员配置基准（四葉行政書士事務所的专栏・日文）",
    "。",
  ],
  s2H2: "符合人员配置基准，与在劳动法上妥适地雇用，有什么不同？",
  s2P1:
    "所依据的法律不同。人员配置基准，是依障害者総合支援法（日本的残障者综合支援法）所定的指定基准，规范「配置哪些职种、各几人」。另一方面，如何雇用这些人由劳动基准法等劳动相关法令规范，加入社会保险则由健康保险法・厚生年金保险法等规范。",
  s2Items: [
    { strong: "指定基准一侧", rest: "：职种、必要人数、全职与非全职之别、资格要件" },
    { strong: "劳动相关法令一侧", rest: "：劳动条件的明示、工作时间・休息・休假、加成工资、年度带薪假" },
    { strong: "社会保险一侧", rest: "：适用事业所的要件、成为被保险人者的范围、申报的期限" },
  ],
  s2P2:
    "「确保符合基准的人」与「合法地雇用该人」，仅具其一并不足够。在开设的准备阶段，建议将两者并列确认。",
  s3H2: "让管理者兼任サービス管理責任者（服务管理负责人）时，劳务上有哪些注意事项？",
  s3P1: [
    "兼任在指定基准上是否获准，依服务类别・事业所规模・指定权者的处理方式而异。此处以兼任获准为前提，列出",
    "劳务一侧应先确认的事项",
    "。",
  ],
  s3Items: [
    "雇用合同书・劳动条件通知书中，所承担职务的范围如何记载",
    "就业规则上的职位・职务加给，与实际的职务内容是否相符",
    "工作时间的管理，是否需依兼任的各项职务分别记录",
    "是否属管理监督者的判断（劳动基准法第41条第2号），是否依实际情形而非职称确认",
  ],
  s3Note:
    "是否属管理监督者，一般认为是依职务内容・权限・待遇的实际情形判断，而非依职位的名称。个别的判断，将于面谈后由有资格者进行。",
  s4H2: "申请文件上记载的人员体制，与实际的排班有落差时会如何？",
  s4P1: [
    "取得指定之后，体制若有变更，仍可能需向指定权者申报。这是指定基准一侧的手续。同时，劳务一侧也可能需办理社会保险・雇用保险的申报。",
    "这两者的提出对象与期限都不同",
    "，因此重点在于不要只提出其中一方便视为完成。",
  ],
  s4TableHead: [
    "这种情形",
    "指定基准一侧（四葉行政書士事務所另行签订合同承办）",
    "劳务一侧（由本事务所承办）",
  ],
  s4Rows: [
    {
      when: "录用职员时",
      shitei: "体制若有变更则提出变更申报（向指定权者）",
      roumu: "健康保险・厚生年金的资格取得申报、雇用保险的资格取得申报",
    },
    { when: "职员离职时", shitei: "同上", roumu: "资格丧失申报、离职票的交付" },
    {
      when: "管理者・サービス管理責任者更换时",
      shitei: "变更申报（向指定权者）",
      roumu: "雇用合同・职务内容的变更、就业规则上定位的确认",
    },
    {
      when: "变更工作型态时（全职与非全职之别・时数的变更）",
      shitei: "若影响常勤换算则重新检视体制",
      roumu: "劳动条件通知书的重新交付、社会保险被保险人类别的确认",
    },
  ],
  s4Note:
    "申报的要否・期限・格式，依服务类别与指定权者而异。上表是为显示分工而作的整理，并非可迳行作为个别案件判断材料之用。",
  s5H2: "人员基准的咨询，该找行政书士还是社会保险劳务士？",
  s5P1: "依想询问的内容而分。",
  s5Items: [
    {
      strong: "「应配置几人」「申请文件该如何记载」",
      rest: "——属指定基准一侧。由四葉行政書士事務所另行签订合同承办",
    },
    {
      strong: "「该如何雇用该人」「就业规则该如何修改」",
      rest: "——属劳务一侧。由本事务所承办",
    },
  ],
  s5P2: [
    "即使尚无法判断属于何者，亦无妨。听取您欲咨询的内容后，会先说明哪一部分由哪一事务所负责。",
    "两间事务所虽位于相同所在地，但各为独立的事业体。",
    "合同・请款・汇款账户亦各自分开。您可以仅委托所需的部分。",
  ],
  s5LinkLabel: "四葉被选择的理由（合同分开的理由・日文）",
  s6H2: "费用是多少？",
  s6P1: [
    "因业务范围与事业所规模而异，故将向您提出报价。与四葉不動産株式会社・四葉行政書士事務所的费用",
    "分开计算",
    "。",
  ],
  s6LinkLabel: "费用说明",
  s7H2: "本页的依据",
  s7Items: [
    "人员配置基准＝依障害者の日常生活及び社会生活を総合的に支援するための法律（日本的残障者日常生活及社会生活综合支援法・平成17年法律第123号）所定的指定基准（各服务类别的省令）",
    "管理监督者的范围＝劳动基准法（昭和22年法律第49号）第41条第2号",
    "劳动条件的明示＝劳动基准法第15条第1项",
    "社会保险的适用・申报＝健康保险法（大正11年法律第70号）、厚生年金保险法（昭和29年法律第115号）",
    "雇用保险的申报＝雇用保险法（昭和49年法律第116号）",
  ],
  s7Note: [
    "※各法令的最终修正日及省令的条项号码，于本页制作时点尚未逐一向一次资料确认（",
    "未验证",
    "）。常勤换算的计算方法・申报的期限・格式，依服务类别与指定权者而异。最新的处理方式，请确认指定权者的要纲，或于面谈时为您说明。",
  ],
  disclaimer:
    "本页为一般性的信息提供。个别案件将经有资格者确认后为您说明。指定申请的文件制作由四葉行政書士事務所、不动产的交易由四葉不動産株式会社，各自另行签订合同承办。税务的申报与代理为税理士、登记为司法书士、具争议性的案件为律师的业务。",
  lastUpdatedLabel: "最后更新：",
  lastUpdated: "2026年7月29日",
};

export const JININ_KIJUN_ROUMU_COPY: Record<LangCode, JininKijunRoumuCopy> = {
  ja: JA,
  en: EN,
  "zh-tw": ZH_TW,
  zh: ZH,
};
