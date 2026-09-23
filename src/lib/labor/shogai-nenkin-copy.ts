import type { LangCode } from "@/config/languages";

/**
 * /labor/services/shogai-nenkin（障害年金の裁定請求）の4ロケール文言。
 *
 * 方式＝手本B（本文が長いページは COPY を src/lib/labor/ に切り出す。既存＝kaigo-service-copy.ts）。
 * 日本語（JA）は 2026-09-22 時点のJSX直書きを**1字も変えずに**移しただけで、新規の加筆はしていない。
 *
 * 【翻訳の規律】指示書 2026-09-22 §2／`luck428-column-seo` 第5条の3／`shigyo-compliance-gate`
 *   ・日本語版にない事実・数値を訳で足さない。構成・見出し数・段落数を日本語版と同じにする
 *   ・法令名・制度名は日本語の原名を残し、初出に各言語の説明を併記する
 *     （日本の制度であることが伝わる形にし、中国・台湾の類似制度と混同させない）
 *   ・事務所名は全ロケールで日本語表記のまま（四葉社会保険労務士事務所／四葉行政書士事務所）
 *   ・分離受任は既存表記に統一（繁体字＝另行簽訂契約承辦／簡体字＝另行签订合同承办）
 *   ・一体提供を示唆する語を全ロケールで使わない（婉曲表現を含む）
 *   ・社労士法第27条の業務独占を断定する語を使わない。日本語版の「社会保険労務士の業務です」と同じ強さに揃える
 *   ・報酬額・年金額・等級表・時効は書かない（日本語版が意図的に書いていないため訳でも足さない）
 *   ・簡体字の条項号は「项」（「款」にしない）
 */
export type ShogaiNenkinCopy = {
  metaTitle: string;
  metaDescription: string;
  crumbLabel: string;
  serviceName: string;
  heroAlt: string;
  h1: string;
  /**
   * 注記：JA の s1Note と s5P1 に含まれる文中の半角スペースは、
   * 移行前のJSXがソース改行で出していた空白をそのまま保存したもの（日本語版の出力を1字も変えないため）。
   * 訳文（en / zh-tw / zh）には対応する空白を入れない。
   */
  /** リード文＝[前半, 強調1, 中間, 強調2, 後半] */
  lead: readonly [string, string, string, string, string];
  internalLinks: readonly { href: string; label: string }[];
  crossLinkLead: string;
  s1H2: string;
  s1P1: string;
  s1TableHead: readonly [string, string];
  s1Rows: readonly { name: string; val: string }[];
  s1Note: string;
  s2H2: string;
  s2P1: string;
  s2Items: readonly { strong: string; rest: string }[];
  /** 末尾の注記＝[前半, 強調, 後半] */
  s2Note: readonly [string, string, string];
  s3H2: string;
  /** [前半, 強調, 後半] */
  s3P1: readonly [string, string, string];
  /** [前半, 料金ページへのリンク文言, 後半] */
  s3Note: readonly [string, string, string];
  s4H2: string;
  s4P1: string;
  s4Items: readonly { strong: string; rest: string }[];
  s4Note: string;
  s5H2: string;
  s5P1: string;
  s6H2: string;
  /** 番号は描画側で付ける（`{i + 1}. `）。訳文に番号を書かない */
  s6Steps: readonly string[];
  /** [前半, 流れページへのリンク文言, 後半] */
  s6Note: readonly [string, string, string];
};

const JA: ShogaiNenkinCopy = {
  metaTitle: "障害年金の裁定請求｜四葉社会保険労務士事務所",
  metaDescription:
    "障害年金（障害基礎年金・障害厚生年金）の裁定請求を、文京区の四葉社会保険労務士事務所が承ります。請求書類の作成・提出代行は社会保険労務士の業務です。ご本人・ご家族から直接お受けし、顧問契約は必要ありません。初診日の証明から請求・結果確認までお手伝いします。中国語・英語に対応します。",
  crumbLabel: "障害年金の裁定請求",
  serviceName: "障害年金の裁定請求のサポート",
  heroAlt: "障害年金の裁定請求のイメージ（年金請求の書類）",
  h1: "障害年金の裁定請求",
  lead: [
    "障害年金の",
    "裁定請求（年金を受け取るための請求手続き）の書類作成・提出代行は、社会保険労務士の業務です",
    "（社会保険労務士法第2条第1項第1号・第1号の2、第27条）。四葉社会保険労務士事務所（東京都文京区小日向）は、障害のあるご本人と、そのご家族からのご依頼を",
    "直接お受けします。顧問契約は必要ありません。",
    "必要書類の整理から請求、結果の確認までお手伝いします。",
  ],
  internalLinks: [
    { href: "/labor/ryokin", label: "障害年金の料金" },
    { href: "/labor/nagare", label: "ご相談から契約までの流れ" },
    { href: "/labor/faq", label: "よくある質問" },
    { href: "/labor/services/kaigo-roumu", label: "介護・障害福祉の労務管理" },
  ],
  crossLinkLead:
    "ご家族の備えは、年金のほかに法的な手続きと住まいが関わります。それぞれ四葉行政書士事務所・四葉不動産株式会社が別の契約で受任します。",
  s1H2: "障害年金とは、どんな制度ですか？",
  s1P1: "病気やけがで生活や仕事に支障がある方が受け取れる公的年金です。加入していた制度によって2種類に分かれます。",
  s1TableHead: ["種類", "対象となる方の目安"],
  s1Rows: [
    { name: "障害基礎年金（国民年金）", val: "初診日に国民年金に加入していた方、20歳前に初診日がある方 など" },
    { name: "障害厚生年金（厚生年金）", val: "初診日に厚生年金に加入していた（会社員等の）方" },
  ],
  s1Note:
    "受給には、初診日の特定、保険料の納付要件、障害の状態が認定基準に該当すること——の確認が必要です。知的障害・発達障害・精神障害も対象になり得ます。 等級・年金額・認定基準は日本年金機構の最新の取り扱いによります。年度により改定されるため本ページには金額を記載していません。個別の受給可否は、ご相談のうえ資格者が整理します。",
  s2H2: "申請は誰に頼めますか？",
  s2P1:
    "社会保険労務士でない者は、報酬を得て、労働社会保険諸法令に基づく申請書等の作成と提出手続の代行を業として行うことができません（社会保険労務士法第27条）。関わる専門家の役割は次のとおりです。",
  s2Items: [
    { strong: "請求手続きの書類作成・提出代行", rest: "＝社会保険労務士（当事務所）" },
    { strong: "診断書の作成", rest: "＝医師（当事務所は、日常生活の状況を医師にお伝えいただく形に整理するお手伝いをします）" },
    { strong: "遺言・任意後見・各種契約", rest: "＝行政書士（四葉行政書士事務所・別事業体・別契約）" },
    { strong: "争いのある事案・訴訟", rest: "＝弁護士（おつなぎします。紹介料の授受は行いません）" },
  ],
  s2Note: [
    "障害年金の請求は、書類を提出すれば終わりという手続きではありません。",
    "初診日の証明と、障害の状態を書面で正確に伝えること",
    "が要になります。元新聞記者として34年、事実を整理して伝わる形にする仕事をしてきた代表が、この書類づくりを担います。",
  ],
  s3H2: "顧問契約がなくても頼めますか？",
  s3P1: [
    "はい。",
    "障害年金は個人のお客さま向けのため、顧問契約は不要です",
    "。ご本人・ご家族から直接お受けします。初回のご相談は無料です。",
  ],
  s3Note: [
    "料金は",
    "料金ページ",
    "の「障害年金（個人のお客さま）」に掲載しています。着手金と成功報酬の額は税込です。診断書料等の実費は別途申し受けます。",
  ],
  s4H2: "「親なき後」の備えとして、何ができますか？",
  s4P1:
    "障害のあるお子さまの将来を考えるとき、お金・法的な備え・住まいは切り離せません。四葉グループは、この3つを別々の事業体が担当します。",
  s4Items: [
    { strong: "障害年金の請求", rest: "＝四葉社会保険労務士事務所（当事務所）" },
    { strong: "遺言・任意後見・各種契約", rest: "＝四葉行政書士事務所" },
    { strong: "グループホーム等の住まい", rest: "＝四葉不動産株式会社" },
  ],
  s4Note:
    "3つはそれぞれ独立した事業体として、別々にご契約いただきます。料金・請求・お振込先も事務所ごとに分かれます。事業体の間で紹介料の授受は行いません。",
  s5H2: "中国語や英語でも相談できますか？",
  s5P1:
    "はい。代表は元毎日新聞中国総局長として中国や台湾、タイに駐在し、中国語（繁体字・簡体字）と英語に対応します。 日本の年金制度に加入していた外国籍の方や、ご家族が日本語での書類のやり取りに不安をお持ちの場合も、同じ窓口でご相談を承ります。",
  s6H2: "依頼するとき、どんな流れになりますか？",
  s6Steps: [
    "ご相談（初回無料・オンライン可）",
    "受給の可能性の整理とお見積り",
    "ご契約",
    "書類の収集・作成（初診日の証明、病歴・就労状況等の整理、診断書の依頼のお手伝い）",
    "裁定請求（提出代行）",
    "結果の確認とその後のご相談",
  ],
  s6Note: ["詳しくは", "ご相談から契約までの流れ", "をご覧ください。"],
};

const EN: ShogaiNenkinCopy = {
  metaTitle: "Disability pension claims｜四葉社会保険労務士事務所",
  metaDescription:
    "四葉社会保険労務士事務所 in Bunkyo City, Tokyo handles claims for the Japanese disability pension (障害基礎年金 and 障害厚生年金). Preparing and filing the claim documents is the work of a Certified Social Insurance and Labor Consultant. We accept instructions directly from the person concerned and their family, with no advisory contract required. We help from evidencing the date of first medical examination through filing and confirming the outcome. Available in Chinese and English.",
  crumbLabel: "Disability pension claims",
  serviceName: "Support with disability pension claims",
  heroAlt: "Pension claim documents, representing a disability pension claim",
  h1: "Disability pension claims",
  lead: [
    "For the Japanese disability pension (障害年金), ",
    "preparing and filing the documents for the 裁定請求 — the claim procedure through which the pension is awarded — is the work of a Certified Social Insurance and Labor Consultant",
    " (社会保険労務士法, the Certified Social Insurance and Labor Consultant Act, Article 2(1)(i) and (i)-2, and Article 27). 四葉社会保険労務士事務所 (Koishikawa, Bunkyo City, Tokyo) ",
    "accepts instructions directly from the person with a disability and their family. No advisory contract is required.",
    " We help from organizing the required documents through filing the claim and confirming the outcome.",
  ],
  internalLinks: [
    { href: "/labor/ryokin", label: "Fees for disability pension claims" },
    { href: "/labor/nagare", label: "From consultation to contract" },
    { href: "/labor/faq", label: "Frequently asked questions" },
    { href: "/labor/services/kaigo-roumu", label: "Labor management for care & disability welfare" },
  ],
  crossLinkLead:
    "Preparing for a family's future involves legal procedures and housing as well as the pension. These are handled by 四葉行政書士事務所 and Yotsuba Real Estate Co., Ltd. respectively, each under a separate contract.",
  s1H2: "What kind of scheme is the disability pension?",
  s1P1:
    "It is a public pension for people whose daily life or work is affected by illness or injury. It divides into two types according to the scheme the person was enrolled in.",
  s1TableHead: ["Type", "Who it is generally for"],
  s1Rows: [
    {
      name: "障害基礎年金 (Basic Disability Pension, under the National Pension)",
      val: "People enrolled in the National Pension on the date of first medical examination, people whose first examination was before age 20, and others",
    },
    {
      name: "障害厚生年金 (Employees' Disability Pension, under Employees' Pension Insurance)",
      val: "People enrolled in Employees' Pension Insurance on the date of first medical examination, such as company employees",
    },
  ],
  s1Note:
    "Receiving the pension requires confirming the date of first medical examination, the contribution payment requirements, and that the condition falls within the certification criteria. Intellectual disabilities, developmental disabilities and mental disorders may also be covered. Grades, pension amounts and certification criteria follow the current treatment by the Japan Pension Service. Because they are revised from year to year, no amounts are stated on this page. Whether an individual case qualifies is something a qualified professional will organize with you in consultation.",
  s2H2: "Who may be asked to handle the claim?",
  s2P1:
    "A person who is not a Certified Social Insurance and Labor Consultant may not, for remuneration and as a business, prepare applications under the labor and social insurance laws or act as agent for filing them (社会保険労務士法, Article 27). The roles of the professionals involved are as follows.",
  s2Items: [
    { strong: "Preparing and filing the claim documents", rest: " = Certified Social Insurance and Labor Consultant (this office)" },
    { strong: "Writing the medical certificate", rest: " = the physician (we help you organize your daily-life circumstances into a form you can convey to the physician)" },
    { strong: "Wills, voluntary guardianship and contracts", rest: " = administrative scrivener (四葉行政書士事務所, a separate business under a separate contract)" },
    { strong: "Disputed cases and litigation", rest: " = attorney (we will put you in touch; no referral fees are exchanged)" },
  ],
  s2Note: [
    "A disability pension claim is not a procedure that ends once the documents are filed. ",
    "Evidencing the date of first medical examination, and conveying the state of the disability accurately in writing,",
    " are the crux of it. Our representative, who spent 34 years as a newspaper journalist organizing facts into a form that gets through, takes charge of preparing these documents.",
  ],
  s3H2: "Can I instruct you without an advisory contract?",
  s3P1: [
    "Yes. ",
    "The disability pension is a service for individual clients, so no advisory contract is required",
    ". We accept instructions directly from the person concerned and their family. The first consultation is free.",
  ],
  s3Note: [
    "Fees are listed under “障害年金 (individual clients)” on the ",
    "fees page",
    ". The upfront fee and success fee are tax-inclusive. Out-of-pocket costs such as the medical certificate fee are charged separately.",
  ],
  s4H2: "What can be prepared for the time after the parents are gone?",
  s4P1:
    "When thinking about the future of a child with a disability, money, legal preparations and housing cannot be separated from one another. Within the Yotsuba group, these three are handled by different businesses.",
  s4Items: [
    { strong: "Disability pension claims", rest: " = 四葉社会保険労務士事務所 (this office)" },
    { strong: "Wills, voluntary guardianship and contracts", rest: " = 四葉行政書士事務所" },
    { strong: "Housing such as a group home", rest: " = Yotsuba Real Estate Co., Ltd." },
  ],
  s4Note:
    "The three are independent businesses and are engaged under separate contracts. Fees, invoices and payment details are also separate for each office. No referral fees are exchanged between the businesses.",
  s5H2: "Can I consult you in Chinese or English?",
  s5P1:
    "Yes. Our representative was posted to China, Taiwan and Thailand as China General Bureau Chief of the Mainichi Shimbun, and works in Chinese (both traditional and simplified) and English. If you are a foreign national who was enrolled in the Japanese pension system, or if your family is uneasy about exchanging documents in Japanese, this office will take your consultation just the same.",
  s6H2: "What does the process look like?",
  s6Steps: [
    "Consultation (first one free, online available)",
    "Organizing the likelihood of an award, and a quotation",
    "Engagement",
    "Collecting and preparing documents (evidencing the date of first medical examination, organizing medical and work history, and helping you request the medical certificate)",
    "Filing the 裁定請求 claim on your behalf",
    "Confirming the outcome and further consultation",
  ],
  s6Note: ["For details, please see ", "From consultation to contract", "."],
};

const ZH_TW: ShogaiNenkinCopy = {
  metaTitle: "障害年金的裁定請求｜四葉社会保険労務士事務所",
  metaDescription:
    "障害年金（日本的障礙年金制度，分為障害基礎年金與障害厚生年金）的裁定請求，由位於文京區的四葉社会保険労務士事務所承辦。請求書件的製作與提出代辦為社會保險勞務士的業務。由本人與家屬直接委託，無須顧問契約。自初診日的證明至請求、結果確認，均可提供協助。並可以中文、英文對應。",
  crumbLabel: "障害年金的裁定請求",
  serviceName: "障害年金裁定請求的協助",
  heroAlt: "障害年金裁定請求示意圖（年金請求的書件）",
  h1: "障害年金的裁定請求",
  lead: [
    "障害年金（日本的障礙年金制度）的",
    "裁定請求（為領取年金而進行的請求手續）之書件製作與提出代辦，為社會保險勞務士的業務",
    "（社会保険労務士法〔日本的社會保險勞務士法〕第2條第1項第1號・第1號之2、第27條）。四葉社会保険労務士事務所（東京都文京區小日向）",
    "直接受理身心障礙的本人及其家屬的委託。無須顧問契約。",
    "自必要書件的整理至請求、結果的確認，均可提供協助。",
  ],
  internalLinks: [
    { href: "/labor/ryokin", label: "障害年金的費用" },
    { href: "/labor/nagare", label: "從諮詢到簽約的流程" },
    { href: "/labor/faq", label: "常見問題" },
    { href: "/labor/services/kaigo-roumu", label: "介護・障害福祉的勞務管理" },
  ],
  crossLinkLead:
    "家屬的準備，除年金外還牽涉法律手續與住居。各由四葉行政書士事務所、四葉不動産株式会社另行簽訂契約承辦。",
  s1H2: "障害年金是什麼樣的制度？",
  s1P1:
    "這是提供給因疾病或受傷而在生活或工作上有障礙者的公共年金。依所加入的制度分為兩種。",
  s1TableHead: ["種類", "對象者的參考"],
  s1Rows: [
    { name: "障害基礎年金（國民年金）", val: "初診日時加入國民年金者、初診日在20歲之前者 等" },
    { name: "障害厚生年金（厚生年金）", val: "初診日時加入厚生年金者（公司員工等）" },
  ],
  s1Note:
    "領取須確認初診日的特定、保險費的繳納要件，以及障礙狀態符合認定基準。智能障礙・發展障礙・精神障礙亦可能為對象。等級・年金額・認定基準，依日本年金機構最新的處理方式。因逐年度修訂，本頁不記載金額。個別是否可領取，將於諮詢後由有資格者整理說明。",
  s2H2: "申請可以委託給誰？",
  s2P1:
    "非社會保險勞務士者，不得以取得報酬並作為業務的方式，製作依勞動社會保險各法令所為的申請書等，或代辦其提出手續（社会保険労務士法第27條）。相關專業人員的分工如下。",
  s2Items: [
    { strong: "請求手續的書件製作・提出代辦", rest: "＝社會保險勞務士（本事務所）" },
    { strong: "診斷書的製作", rest: "＝醫師（本事務所協助將日常生活的狀況整理成便於向醫師說明的形式）" },
    { strong: "遺囑・任意監護・各種契約", rest: "＝行政書士（四葉行政書士事務所・不同事業體・另行簽訂契約）" },
    { strong: "有爭議的案件・訴訟", rest: "＝律師（由本事務所為您引介。不收受介紹費）" },
  ],
  s2Note: [
    "障害年金的請求，並非提出書件即告結束的手續。",
    "初診日的證明，以及以書面正確傳達障礙的狀態",
    "，才是關鍵。曾任新聞記者34年、長年從事將事實整理成能夠傳達之形式的代表，負責這些書件的製作。",
  ],
  s3H2: "沒有顧問契約也能委託嗎？",
  s3P1: [
    "可以。",
    "障害年金為個人客戶的服務，無須顧問契約",
    "。由本人・家屬直接委託。首次諮詢免費。",
  ],
  s3Note: [
    "費用刊載於",
    "費用頁面",
    "的「障害年金（個人客戶）」。著手金與成功報酬的金額為含稅。診斷書費等實費另行申受。",
  ],
  s4H2: "作為「親なき後」（父母離世之後）的準備，能做些什麼？",
  s4P1:
    "思考身心障礙子女的將來時，金錢・法律上的準備・住居是無法切割的。四葉集團由不同的事業體分別負責這三項。",
  s4Items: [
    { strong: "障害年金的請求", rest: "＝四葉社会保険労務士事務所（本事務所）" },
    { strong: "遺囑・任意監護・各種契約", rest: "＝四葉行政書士事務所" },
    { strong: "團體家屋等住居", rest: "＝四葉不動産株式会社" },
  ],
  s4Note:
    "三者各為獨立的事業體，須分別簽約。費用・請款・匯款帳戶亦依事務所各自分開。事業體之間不收受介紹費。",
  s5H2: "可以用中文或英文諮詢嗎？",
  s5P1:
    "可以。代表曾任每日新聞中國總局長，駐在中國、台灣與泰國，可以中文（繁體字・簡體字）與英文對應。曾加入日本年金制度的外國籍人士，或家屬對於以日文往來書件感到不安時，同樣由本事務所受理諮詢。",
  s6H2: "委託時的流程為何？",
  s6Steps: [
    "諮詢（首次免費・可線上進行）",
    "整理領取的可能性並提出報價",
    "簽約",
    "書件的蒐集・製作（初診日的證明，病歷・就業狀況等的整理，協助向醫師申請診斷書）",
    "裁定請求（提出代辦）",
    "結果的確認及後續諮詢",
  ],
  s6Note: ["詳情請參閱", "從諮詢到簽約的流程", "。"],
};

const ZH: ShogaiNenkinCopy = {
  metaTitle: "障害年金的裁定请求｜四葉社会保険労務士事務所",
  metaDescription:
    "障害年金（日本的残障年金制度，分为障害基础年金与障害厚生年金）的裁定请求，由位于文京区的四葉社会保険労務士事務所承办。请求文件的制作与提出代办为社会保险劳务士的业务。由本人与家属直接委托，无需顾问合同。自初诊日的证明至请求、结果确认，均可提供协助。并可以中文、英文对应。",
  crumbLabel: "障害年金的裁定请求",
  serviceName: "障害年金裁定请求的协助",
  heroAlt: "障害年金裁定请求示意图（年金请求的文件）",
  h1: "障害年金的裁定请求",
  lead: [
    "障害年金（日本的残障年金制度）的",
    "裁定请求（为领取年金而进行的请求手续）之文件制作与提出代办，为社会保险劳务士的业务",
    "（社会保険労務士法〔日本的社会保险劳务士法〕第2条第1项第1号・第1号之2、第27条）。四葉社会保険労務士事務所（东京都文京区小日向）",
    "直接受理残障本人及其家属的委托。无需顾问合同。",
    "自必要文件的整理至请求、结果的确认，均可提供协助。",
  ],
  internalLinks: [
    { href: "/labor/ryokin", label: "障害年金的费用" },
    { href: "/labor/nagare", label: "从咨询到签约的流程" },
    { href: "/labor/faq", label: "常见问题" },
    { href: "/labor/services/kaigo-roumu", label: "介护・残障福祉的劳务管理" },
  ],
  crossLinkLead:
    "家属的准备，除年金外还牵涉法律手续与住居。各由四葉行政書士事務所、四葉不動産株式会社另行签订合同承办。",
  s1H2: "障害年金是什么样的制度？",
  s1P1:
    "这是提供给因疾病或受伤而在生活或工作上有障碍者的公共年金。依所加入的制度分为两种。",
  s1TableHead: ["种类", "对象者的参考"],
  s1Rows: [
    { name: "障害基础年金（国民年金）", val: "初诊日时加入国民年金者、初诊日在20岁之前者 等" },
    { name: "障害厚生年金（厚生年金）", val: "初诊日时加入厚生年金者（公司职员等）" },
  ],
  s1Note:
    "领取须确认初诊日的特定、保险费的缴纳要件，以及残障状态符合认定基准。智力障碍・发育障碍・精神障碍亦可能为对象。等级・年金额・认定基准，依日本年金机构最新的处理方式。因逐年度修订，本页不记载金额。个别是否可领取，将于咨询后由有资格者整理说明。",
  s2H2: "申请可以委托给谁？",
  s2P1:
    "非社会保险劳务士者，不得以取得报酬并作为业务的方式，制作依劳动社会保险各法令所为的申请书等，或代办其提出手续（社会保険労務士法第27条）。相关专业人员的分工如下。",
  s2Items: [
    { strong: "请求手续的文件制作・提出代办", rest: "＝社会保险劳务士（本事务所）" },
    { strong: "诊断书的制作", rest: "＝医师（本事务所协助将日常生活的状况整理成便于向医师说明的形式）" },
    { strong: "遗嘱・任意监护・各种合同", rest: "＝行政书士（四葉行政書士事務所・不同事业体・另行签订合同）" },
    { strong: "有争议的案件・诉讼", rest: "＝律师（由本事务所为您引介。不收受介绍费）" },
  ],
  s2Note: [
    "障害年金的请求，并非提出文件即告结束的手续。",
    "初诊日的证明，以及以书面正确传达残障的状态",
    "，才是关键。曾任新闻记者34年、长年从事将事实整理成能够传达之形式的代表，负责这些文件的制作。",
  ],
  s3H2: "没有顾问合同也能委托吗？",
  s3P1: [
    "可以。",
    "障害年金为个人客户的服务，无需顾问合同",
    "。由本人・家属直接委托。首次咨询免费。",
  ],
  s3Note: [
    "费用刊载于",
    "费用页面",
    "的「障害年金（个人客户）」。着手金与成功报酬的金额为含税。诊断书费等实费另行申受。",
  ],
  s4H2: "作为「親なき後」（父母离世之后）的准备，能做些什么？",
  s4P1:
    "思考残障子女的将来时，金钱・法律上的准备・住居是无法切割的。四葉集团由不同的事业体分别负责这三项。",
  s4Items: [
    { strong: "障害年金的请求", rest: "＝四葉社会保険労務士事務所（本事务所）" },
    { strong: "遗嘱・任意监护・各种合同", rest: "＝四葉行政書士事務所" },
    { strong: "团体家屋等住居", rest: "＝四葉不動産株式会社" },
  ],
  s4Note:
    "三者各为独立的事业体，须分别签约。费用・请款・汇款账户亦依事务所各自分开。事业体之间不收受介绍费。",
  s5H2: "可以用中文或英文咨询吗？",
  s5P1:
    "可以。代表曾任每日新闻中国总局长，驻在中国、台湾与泰国，可以中文（繁体字・简体字）与英文对应。曾加入日本年金制度的外国籍人士，或家属对于以日文往来文件感到不安时，同样由本事务所受理咨询。",
  s6H2: "委托时的流程为何？",
  s6Steps: [
    "咨询（首次免费・可线上进行）",
    "整理领取的可能性并提出报价",
    "签约",
    "文件的搜集・制作（初诊日的证明，病历・就业状况等的整理，协助向医师申请诊断书）",
    "裁定请求（提出代办）",
    "结果的确认及后续咨询",
  ],
  s6Note: ["详情请参阅", "从咨询到签约的流程", "。"],
};

export const SHOGAI_NENKIN_COPY: Record<LangCode, ShogaiNenkinCopy> = {
  ja: JA,
  en: EN,
  "zh-tw": ZH_TW,
  zh: ZH,
};
