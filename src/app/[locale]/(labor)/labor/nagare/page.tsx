// /labor/nagare（型D・受任フロー/HowTo）＝原稿_社労士 #6（開業後公開・SR_LAUNCHED=falseの間は404）
// ★2026-08-13 全面改稿：このページを「どう進めるか」の主力ページにする。
//   軸は3つ ── ①freee人事労務で同じ画面を見る ②料金は着手前に書面 ③AIの線引きを明示。
//   /labor/ryokin（いくらか）・/labor/about（誰が）とは主語が違うのでカニバらない。
//   ★AIは「軸」として大きく出さず、「任せていないこと」を書く節に限定している。
//   shigyo-compliance-gate 第1条（AIは論点整理まで／法的判断は出力しない）と、
//   社会保険労務士法第21条（秘密を守る義務）に照らすと、
//   「AIで安く速く」と読ませる書き方は、事故が起きたときに不利に働くため。
// 2026-09-01 多言語化（第1波）：COPY: Record<LangCode,…>＋getRequestLocale。
//   HowToJsonLd もロケールの文言で出力する。法令名は「（日本語：…）」注記の慣行に従う。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { CtaBand } from "@/components/shared/CtaBand";
import { HowToJsonLd } from "@/components/seo/HowToJsonLd";
import type { LangCode } from "@/config/languages";
import { srRegParen } from "@/lib/shared/sr-registration";

type Step = { name: string; text: string };
type QA = { q: string; a: string };
type Copy = {
  metaTitle: string;
  metaDescription: string;
  howToName: string;
  howToDescription: string;
  bcHome: string;
  bcHere: string;
  h1: string;
  leadStrong: string;
  leadRest: string;
  orderPre: string;
  orderStrong: string;
  orderPost: string;
  steps: Step[];
  sameH2: string;
  same1: string;
  same2: string;
  same3: string;
  feeH2: string;
  feePoints: QA[];
  feeNote1: string;
  feeNoteLink: string;
  feeNote2: string;
  aiH2: string;
  ai1: string;
  aiBox1Strong: string;
  aiBox1Rest: string;
  aiBox2Strong: string;
  aiBox2Rest: string;
  ai2Pre: string;
  ai2Link: string;
  ai2Post: string;
  noteServices: string;
  authorTitle: string;
  authorBody1: string;
  authorBody2: string;
};

const JA: Copy = {
  metaTitle: "ご相談から契約までの流れ｜四葉社会保険労務士事務所",
  metaDescription:
    "四葉社会保険労務士事務所にご依頼いただく流れを、相談・現状整理・契約・着手・手続き・報告の6段階でご説明します。顧問契約とスポット依頼のどちらにも対応。オンライン相談にも対応します。",
  howToName: "四葉社会保険労務士事務所へのご依頼の流れ",
  howToDescription: "ご相談から契約・手続き完了までの6段階の流れです。",
  bcHome: "ホーム",
  bcHere: "受任の流れ",
  h1: "ご相談から契約までの流れ",
  leadStrong: "料金は着手前に書面でお出しします。",
  leadRest: "手続きは freee人事労務 で行い、顧問先と同じデータを見ながら進めます。オンラインでのご相談にも対応します。",
  orderPre: "ご依頼は ",
  orderStrong: "①ご相談 → ②現状整理・お見積り → ③ご契約 → ④freee人事労務の準備 → ⑤着手・手続き → ⑥報告・記録",
  orderPost: " の順に進みます。",
  steps: [
    { name: "ご相談（60分まで無料）", text: "現状とお困りごとを伺い、論点を整理します。この段階で費用はいただきません。顧問契約に至らなかった場合の2回目以降は、1時間11,000円（税込）です。" },
    { name: "現状整理・お見積り", text: "従業員数・就業実態・既存の規程を確認し、業務範囲と料金を書面でご提示します。料金は報酬額表の単価から積み上げるので、内訳がそのまま見えます。" },
    { name: "ご契約（顧問／スポット）", text: "内容にご納得いただいてから契約します。顧問料に含むもの・含まないものを契約書に明記します。" },
    { name: "freee人事労務の準備", text: "顧問先のfreee人事労務に、当事務所がアドバイザーとして参加します。以後、同じデータを見ながら進めます。" },
    { name: "着手・手続き・届出", text: "規程の整備、資格取得届などの手続きを進めます。電子申請の状況は、freee上でいつでもご確認いただけます。" },
    { name: "報告・記録", text: "完了のご報告をします。受任日・内容・報酬額は、社会保険労務士法第19条の帳簿に記録し、2年間保存します。" },
  ],
  sameH2: "なぜ、同じ画面を見るのですか？",
  same1:
    "当事務所は、給与計算も労働社会保険の手続きも freee人事労務 で行います。顧問先のfreee人事労務に当事務所がアドバイザーとして参加するため、従業員の情報も、給与の計算結果も、申請の状況も、同じデータをご覧いただけます。「いま何が終わっていて、何が残っているか」を、お問い合わせいただかなくても確認できます。",
  same2:
    "もう一つ、先にお伝えしておくことがあります。freee人事労務は、社会保険労務士が自分の資格情報で申請する形（代理申請）に対応していません。電子申請は顧問先のアカウントから行われます。当事務所は、受任日・内容・報酬額を社会保険労務士法第19条の帳簿に記録し、帳簿閉鎖の時から2年間保存します。",
  same3:
    "※freee人事労務をお使いでない場合や、他のシステムをご利用の場合は、移行の要否も含めてご相談ください。システムの利用料は顧問先のご負担になります。",
  feeH2: "料金は、どう決まるのですか？",
  feePoints: [
    { q: "料金は、いつ分かるのですか？", a: "着手前です。報酬額表の単価から積み上げた見積書を書面でお出しします。作業を始めてから金額が決まることはありません。" },
    { q: "顧問料には、何が含まれるのですか？", a: "労務のご相談だけです。ご相談は回数・時間の制限なく承ります。手続・給与計算・規程の作成は、顧問先の方にも都度申し受けます。含まないものを料金表に書いているのは、そのためです。" },
    { q: "あとから金額が増えることはありますか？", a: "お見積りの範囲を超える作業が必要になったときは、着手前にあらためてお見積りします。先に金額をお伝えせずに進めることはありません。" },
    { q: "金額が決まっていない項目はありますか？", a: "あります。募集・採用コンサルタント、処遇改善加算の設計、外部監査人、顧問料と給与計算の30人以上は、作業量が案件ごとに大きく変わるためお見積りとしています。隠しているわけではなく、決められないものを決められないと書いています。" },
  ],
  feeNote1: "単価は",
  feeNoteLink: "報酬額表",
  feeNote2: "にすべて掲載しています。含まないものと、その場合のおつなぎ先も同じ表に書いています。",
  aiH2: "AIは、どこまで使うのですか？",
  ai1: "調べものと下書きには生成AIを使います。法改正の調査、規程の素案、ご説明資料の作成などです。そのぶん作業の時間は短くなります。",
  aiBox1Strong: "ただし、判断はAIに任せません。",
  aiBox1Rest:
    "労働者にあたるかどうか、社会保険に加入するかどうか、助成金の要件を満たすかどうか——こうした判断は、資料を確認したうえで社会保険労務士が行います。提出する書類も、すべて目を通してからお出しします。",
  aiBox2Strong: "顧問先の個人情報を、生成AIに入力することはしません。",
  aiBox2Rest:
    "社会保険労務士には秘密を守る義務があります（社会保険労務士法第21条）。マイナンバー・在留カード番号・給与の明細といった情報は、AIに渡さない運用にしています。",
  ai2Pre: "AIで安くできるのは作業であって、責任ではありません。間違えたときに向き合うのは資格者です。当事務所が",
  ai2Link: "手続きの料金",
  ai2Post: "を下げているのは、作業が軽くなるぶんをお返しする趣旨です。責任の部分まで安くしているわけではありません。",
  noteServices: "※所要期間・準備物・費用発生のタイミングは業務により異なります。各業務ページと料金もあわせてご覧ください。",
  authorTitle: "この記事の著者",
  authorBody1: " 浦松 丈二｜四葉社会保険労務士事務所 代表 社会保険労務士",
  authorBody2: "・行政書士（登録番号 第25087022号）・宅地建物取引士。元毎日新聞中国総局長（記者歴34年）。",
};

const EN: Copy = {
  metaTitle: "From consultation to contract｜四葉社会保険労務士事務所",
  metaDescription:
    "How to engage 四葉社会保険労務士事務所, in six steps: consultation, fact-finding, contract, setup on freee人事労務, procedures, and reporting. Both advisory (komon) contracts and one-off engagements are available. Online consultations welcome.",
  howToName: "How to engage 四葉社会保険労務士事務所",
  howToDescription: "The six steps from first consultation to contract and completed procedures.",
  bcHome: "Home",
  bcHere: "How we work",
  h1: "From consultation to contract",
  leadStrong: "Fees are quoted in writing before we start.",
  leadRest:
    " Procedures run on freee人事労務 (freee's HR & payroll software), working from the same data as the client. Online consultations are available.",
  orderPre: "An engagement proceeds in this order: ",
  orderStrong:
    "1. Consultation → 2. Fact-finding & written quote → 3. Contract → 4. Setup on freee人事労務 → 5. Work & filings → 6. Report & records",
  orderPost: ".",
  steps: [
    { name: "Consultation (first 60 minutes free)", text: "We listen to your situation and sort out the issues. Nothing is charged at this stage. If no advisory contract follows, consultations from the second time onward are ¥11,000 per hour (tax incl.)." },
    { name: "Fact-finding & written quote", text: "We review headcount, actual working arrangements, and existing rules, then present the scope and fee in writing. The quote is built up from the unit prices in our fee table, so the breakdown is fully visible." },
    { name: "Contract (advisory or one-off)", text: "We sign only after you are satisfied. What the advisory fee does and does not include is stated in the contract." },
    { name: "Setup on freee人事労務", text: "Our office joins your freee人事労務 as an advisor. From then on, we work from the same data." },
    { name: "Work, procedures, and filings", text: "We prepare rules and file notifications such as insurance enrollment reports. You can check the status of electronic applications on freee at any time." },
    { name: "Report & records", text: "We report on completion. The engagement date, scope, and fee are recorded in the ledger required by Article 19 of the Certified Social Insurance and Labor Consultant Act and kept for two years." },
  ],
  sameH2: "Why do we look at the same screen?",
  same1:
    "This office runs both payroll and labor/social-insurance procedures on freee人事労務. Because we join the client's freee人事労務 as an advisor, you see the same data we do — employee records, payroll results, and application status. You can see what is done and what remains without having to ask.",
  same2:
    "One more thing we tell clients up front: freee人事労務 does not support filings made under the consultant's own credentials (dairi shinsei). Electronic applications are submitted from the client's account. This office records the engagement date, scope, and fee in the ledger required by Article 19 of the Certified Social Insurance and Labor Consultant Act, and keeps it for two years after the ledger is closed.",
  same3:
    "* If you do not use freee人事労務, or use another system, please consult us — including whether migration makes sense. System usage fees are borne by the client.",
  feeH2: "How are fees decided?",
  feePoints: [
    { q: "When do I know the fee?", a: "Before we start. We present a written quote built up from the unit prices in our fee table. The amount is never decided after the work has begun." },
    { q: "What does the advisory fee include?", a: "Labor consultations only — with no limit on frequency or time. Procedures, payroll, and drafting of rules are charged per item, for advisory clients as well. That is why the fee table also lists what is not included." },
    { q: "Can the amount increase later?", a: "If work beyond the quoted scope becomes necessary, we quote again before starting it. We never proceed without telling you the amount first." },
    { q: "Are there items without a fixed price?", a: "Yes: recruitment consulting, design of the treatment-improvement addition, external auditor engagements, and advisory or payroll for 30 or more people. The workload varies too much case by case, so these are quoted individually — not hidden, just honestly marked as not fixable in advance." },
  ],
  feeNote1: "All unit prices are published in the ",
  feeNoteLink: "fee table",
  feeNote2: ". The same table lists what is not included and whom we refer you to in those cases.",
  aiH2: "How far do we use AI?",
  ai1: "We use generative AI for research and drafting — checking legal amendments, first drafts of rules, and explanatory materials. That shortens working time.",
  aiBox1Strong: "But we do not leave judgment to AI.",
  aiBox1Rest:
    " Whether someone is legally an employee, whether they must be enrolled in social insurance, whether subsidy requirements are met — these judgments are made by the Certified Social Insurance and Labor Consultant after reviewing the documents. Every document we submit is checked by the consultant first.",
  aiBox2Strong: "We do not enter clients' personal information into generative AI.",
  aiBox2Rest:
    " Consultants are bound by confidentiality (Article 21 of the Certified Social Insurance and Labor Consultant Act). My Number, residence-card numbers, and payroll details are kept out of AI as a matter of practice.",
  ai2Pre: "What AI makes cheaper is the work, not the responsibility. When something goes wrong, it is the licensed professional who answers for it. We have lowered our ",
  ai2Link: "procedure fees",
  ai2Post: " to pass on the lighter workload — not to discount the responsibility.",
  noteServices: "* Timeframes, required documents, and when costs arise differ by service. Please also see the individual service pages and the fee table.",
  authorTitle: "Author",
  authorBody1: " Joji Uramatsu | Representative, 四葉社会保険労務士事務所; Certified Social Insurance and Labor Consultant",
  authorBody2: "; Administrative Scrivener (Reg. No. 25087022); Licensed Real Estate Transaction Specialist. Former China General Bureau Chief of the Mainichi Shimbun (34 years as a journalist).",
};

const ZH_TW: Copy = {
  metaTitle: "從諮詢到簽約的流程｜四葉社會保險勞務士事務所",
  metaDescription:
    "說明委託四葉社會保險勞務士事務所的流程：諮詢、現況整理、簽約、freee人事労務的準備、著手手續、報告記錄的6個階段。顧問契約與單次委託皆可，並提供線上諮詢。",
  howToName: "委託四葉社會保險勞務士事務所的流程",
  howToDescription: "從諮詢到簽約、手續完成的6個階段。",
  bcHome: "首頁",
  bcHere: "受任流程",
  h1: "從諮詢到簽約的流程",
  leadStrong: "費用在著手前以書面提出。",
  leadRest: "手續在 freee人事労務 上進行，與顧問客戶看著同一份資料推進。也提供線上諮詢。",
  orderPre: "委託依 ",
  orderStrong: "①諮詢 → ②現況整理・報價 → ③簽約 → ④freee人事労務的準備 → ⑤著手・手續 → ⑥報告・記錄",
  orderPost: " 的順序進行。",
  steps: [
    { name: "諮詢（60分鐘以內免費）", text: "了解現況與困擾，整理爭點。此階段不收費。若未簽訂顧問契約，第2次起的諮詢為每小時11,000日圓（含稅）。" },
    { name: "現況整理・報價", text: "確認員工人數、實際工作狀況與既有規程後，以書面提出業務範圍與費用。費用由報酬額表的單價累加而成，明細一目了然。" },
    { name: "簽約（顧問／單次）", text: "在您確認內容後才簽約。顧問費包含與不包含的項目，都會載明於契約書。" },
    { name: "freee人事労務的準備", text: "本事務所以顧問（advisor）身分加入貴公司的freee人事労務。此後看著同一份資料推進。" },
    { name: "著手・手續・申報", text: "整備規程、辦理資格取得届等手續。電子申請的進度可隨時在freee上確認。" },
    { name: "報告・記錄", text: "完成後向您報告。受任日期、內容、報酬額依社會保險勞務士法第19條記入帳簿，保存2年。" },
  ],
  sameH2: "為什麼要看同一個畫面？",
  same1:
    "本事務所的薪資計算與勞動社會保險手續，都在 freee人事労務 上進行。因為本事務所以顧問身分加入貴公司的freee人事労務，員工資料、薪資計算結果、申請進度，您看到的都是同一份資料。「現在完成了什麼、還剩下什麼」，不必詢問也能確認。",
  same2:
    "另有一件事先向您說明。freee人事労務不支援社會保險勞務士以自己的資格資訊申請的形式（代理申請）。電子申請由顧問客戶的帳號送出。本事務所將受任日期、內容、報酬額記入社會保險勞務士法第19條的帳簿，自帳簿關閉時起保存2年。",
  same3: "※若貴公司未使用freee人事労務、或使用其他系統，包含是否需要轉換在內，歡迎諮詢。系統使用費由顧問客戶負擔。",
  feeH2: "費用是怎麼決定的？",
  feePoints: [
    { q: "什麼時候知道費用？", a: "著手之前。我們以書面提出由報酬額表單價累加的報價單。不會有開始作業後才決定金額的情況。" },
    { q: "顧問費包含什麼？", a: "只有勞務諮詢。諮詢不限次數與時間。手續、薪資計算、規程製作，顧問客戶也是每件另計。費用表寫明「不包含的項目」，正是這個原因。" },
    { q: "之後金額會增加嗎？", a: "若需要報價範圍以外的作業，會在著手前重新報價。不會有未事先告知金額就進行的情況。" },
    { q: "有金額未定的項目嗎？", a: "有。招募・錄用顧問、處遇改善加算的設計、外部監查人，以及30人以上的顧問費與薪資計算，因作業量隨個案差異大而採個別報價。不是隱藏，而是把無法事先定價的項目如實寫成報價。" },
  ],
  feeNote1: "單價全數刊載於",
  feeNoteLink: "報酬額表",
  feeNote2: "。不包含的項目與該情況下的轉介對象，也寫在同一張表上。",
  aiH2: "AI用到哪裡？",
  ai1: "查找資料與草稿使用生成式AI：法令修正的調查、規程草案、說明資料的製作等。作業時間因此縮短。",
  aiBox1Strong: "但是，判斷不交給AI。",
  aiBox1Rest:
    "是否屬於勞工、是否應加入社會保險、是否符合助成金要件——這些判斷由社會保險勞務士確認資料後進行。提交的文件也全數過目後才送出。",
  aiBox2Strong: "不將顧問客戶的個人資料輸入生成式AI。",
  aiBox2Rest:
    "社會保險勞務士負有保密義務（社會保險勞務士法第21條）。My Number、在留卡號碼、薪資明細等資訊，一律不交給AI。",
  ai2Pre: "AI能降低的是作業成本，不是責任。出錯時面對的仍是有資格者。本事務所調降",
  ai2Link: "手續費用",
  ai2Post: "，是把作業變輕的部分回饋給客戶，並非連責任的部分也打折。",
  noteServices: "※所需期間、準備文件、費用發生的時點依業務而異。請一併參閱各業務頁面與費用。",
  authorTitle: "本文作者",
  authorBody1: " 浦松 丈二｜四葉社會保險勞務士事務所 代表 社會保險勞務士",
  authorBody2: "・行政書士（登錄號 第25087022號）・宅地建物取引士。曾任每日新聞中國總局長（記者資歷34年）。",
};

const ZH: Copy = {
  metaTitle: "从咨询到签约的流程｜四葉社会保険労務士事務所",
  metaDescription:
    "说明委托四葉社会保険労務士事務所的流程：咨询、现状整理、签约、freee人事労務的准备、着手手续、报告记录的6个阶段。顾问合同与单次委托均可，并提供在线咨询。",
  howToName: "委托四葉社会保険労務士事務所的流程",
  howToDescription: "从咨询到签约、手续完成的6个阶段。",
  bcHome: "首页",
  bcHere: "受任流程",
  h1: "从咨询到签约的流程",
  leadStrong: "费用在着手前以书面提出。",
  leadRest: "手续在 freee人事労務 上进行，与顾问客户看着同一份数据推进。也提供在线咨询。",
  orderPre: "委托按 ",
  orderStrong: "①咨询 → ②现状整理・报价 → ③签约 → ④freee人事労務的准备 → ⑤着手・手续 → ⑥报告・记录",
  orderPost: " 的顺序进行。",
  steps: [
    { name: "咨询（60分钟以内免费）", text: "了解现状与困扰，整理争点。此阶段不收费。若未签订顾问合同，第2次起的咨询为每小时11,000日元（含税）。" },
    { name: "现状整理・报价", text: "确认员工人数、实际工作状况与既有规程后，以书面提出业务范围与费用。费用由报酬额表的单价累加而成，明细一目了然。" },
    { name: "签约（顾问／单次）", text: "在您确认内容后才签约。顾问费包含与不包含的项目，都会载明于合同。" },
    { name: "freee人事労務的准备", text: "本事务所以顾问（advisor）身份加入贵公司的freee人事労務。此后看着同一份数据推进。" },
    { name: "着手・手续・申报", text: "整备规程、办理资格取得届等手续。电子申请的进度可随时在freee上确认。" },
    { name: "报告・记录", text: "完成后向您报告。受任日期、内容、报酬额按社会保险劳务士法第19条记入账簿，保存2年。" },
  ],
  sameH2: "为什么要看同一个画面？",
  same1:
    "本事务所的工资计算与劳动社会保险手续，都在 freee人事労務 上进行。因为本事务所以顾问身份加入贵公司的freee人事労務，员工信息、工资计算结果、申请进度，您看到的都是同一份数据。「现在完成了什么、还剩下什么」，不必询问也能确认。",
  same2:
    "另有一件事先向您说明。freee人事労務不支持社会保险劳务士以自己的资格信息申请的形式（代理申请）。电子申请由顾问客户的账号提交。本事务所将受任日期、内容、报酬额记入社会保险劳务士法第19条的账簿，自账簿关闭时起保存2年。",
  same3: "※若贵公司未使用freee人事労務、或使用其他系统，包括是否需要转换在内，欢迎咨询。系统使用费由顾问客户承担。",
  feeH2: "费用是怎么决定的？",
  feePoints: [
    { q: "什么时候知道费用？", a: "着手之前。我们以书面提出由报酬额表单价累加的报价单。不会有开始作业后才决定金额的情况。" },
    { q: "顾问费包含什么？", a: "只有劳务咨询。咨询不限次数与时间。手续、工资计算、规程制作，顾问客户也是每件另计。费用表写明「不包含的项目」，正是这个原因。" },
    { q: "之后金额会增加吗？", a: "若需要报价范围以外的作业，会在着手前重新报价。不会有未事先告知金额就进行的情况。" },
    { q: "有金额未定的项目吗？", a: "有。招聘・录用顾问、处遇改善加算的设计、外部监查人，以及30人以上的顾问费与工资计算，因作业量随个案差异大而采个别报价。不是隐藏，而是把无法事先定价的项目如实写成报价。" },
  ],
  feeNote1: "单价全部刊载于",
  feeNoteLink: "报酬额表",
  feeNote2: "。不包含的项目与该情况下的介绍对象，也写在同一张表上。",
  aiH2: "AI用到哪里？",
  ai1: "查找资料与草稿使用生成式AI：法令修订的调查、规程草案、说明资料的制作等。作业时间因此缩短。",
  aiBox1Strong: "但是，判断不交给AI。",
  aiBox1Rest:
    "是否属于劳动者、是否应加入社会保险、是否符合助成金要件——这些判断由社会保险劳务士确认资料后进行。提交的文件也全部过目后才送出。",
  aiBox2Strong: "不将顾问客户的个人信息输入生成式AI。",
  aiBox2Rest:
    "社会保险劳务士负有保密义务（社会保险劳务士法第21条）。My Number、在留卡号码、工资明细等信息，一律不交给AI。",
  ai2Pre: "AI能降低的是作业成本，不是责任。出错时面对的仍是有资格者。本事务所调低",
  ai2Link: "手续费用",
  ai2Post: "，是把作业变轻的部分回馈给客户，并非连责任的部分也打折。",
  noteServices: "※所需期间、准备文件、费用发生的时点因业务而异。请一并参阅各业务页面与费用。",
  authorTitle: "本文作者",
  authorBody1: " 浦松 丈二｜四葉社会保険労務士事務所 代表 社会保险劳务士",
  authorBody2: "・行政书士（登录号 第25087022号）・宅地建物取引士。曾任每日新闻中国总局长（记者经历34年）。",
};

const COPY: Record<LangCode, Copy> = { ja: JA, en: EN, "zh-tw": ZH_TW, zh: ZH };

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? JA;
  return buildPageMetadata({
    businessKey: "labor",
    title: c.metaTitle,
    description: c.metaDescription,
    path: "/labor/nagare",
    locale,
    absoluteTitle: true,
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? JA;
  return (
    <>
      <HowToJsonLd name={c.howToName} description={c.howToDescription} steps={c.steps} />
      <Breadcrumb items={[{ name: c.bcHome, href: "/labor" }, { name: c.bcHere }]} />

      <main className="mx-auto max-w-3xl px-4 pb-16">
        <header className="pt-2">
          <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">{c.h1}</h1>
          <p className="mt-4 leading-relaxed text-text">
            <strong>{c.leadStrong}</strong>
            {c.leadRest}
          </p>
          <p className="mt-3 leading-relaxed text-text">
            {c.orderPre}
            <strong>{c.orderStrong}</strong>
            {c.orderPost}
          </p>
        </header>

        <ol className="mt-8 space-y-4">
          {c.steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-white">
                {i + 1}
              </span>
              <div>
                <div className="font-medium text-ink">{s.name}</div>
                <p className="mt-0.5 text-sm leading-relaxed text-text-muted">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* ── 軸1：同じ画面を見る ── */}
        <section className="mt-12">
          <h2 className="font-serif text-xl font-semibold text-ink">{c.sameH2}</h2>
          <p className="mt-3 leading-relaxed text-text">{c.same1}</p>
          <p className="mt-3 leading-relaxed text-text">{c.same2}</p>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">{c.same3}</p>
        </section>

        {/* ── 軸2：料金の出し方 ── */}
        <section className="mt-12">
          <h2 className="font-serif text-xl font-semibold text-ink">{c.feeH2}</h2>
          <dl className="mt-4 space-y-4">
            {c.feePoints.map((p) => (
              <div key={p.q} className="rounded-xl border border-border bg-surface p-4">
                <dt className="font-medium text-ink">{p.q}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-text">{p.a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm leading-relaxed text-text-muted">
            {c.feeNote1}
            <Link href={addLocalePrefix("/labor/ryokin", locale)} className="text-primary underline">
              {c.feeNoteLink}
            </Link>
            {c.feeNote2}
          </p>
        </section>

        {/* ── 軸3：AIの線引き ── */}
        <section className="mt-12">
          <h2 className="font-serif text-xl font-semibold text-ink">{c.aiH2}</h2>
          <p className="mt-3 leading-relaxed text-text">{c.ai1}</p>
          <div className="mt-4 rounded-xl border-l-4 border-primary bg-primary-tint p-4">
            <p className="leading-relaxed text-text">
              <strong>{c.aiBox1Strong}</strong>
              {c.aiBox1Rest}
            </p>
            <p className="mt-3 leading-relaxed text-text">
              <strong>{c.aiBox2Strong}</strong>
              {c.aiBox2Rest}
            </p>
          </div>
          <p className="mt-4 leading-relaxed text-text">
            {c.ai2Pre}
            <Link href={addLocalePrefix("/labor/ryokin", locale)} className="text-primary underline">
              {c.ai2Link}
            </Link>
            {c.ai2Post}
          </p>
        </section>

        <p className="mt-12 text-sm text-text-muted">{c.noteServices}</p>

        {/* 署名（登録番号＝sr-registration.ts） */}
        <aside className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
          <img
            src="/staff/uramatsu-square.webp"
            alt="四葉社会保険労務士事務所 代表 浦松丈二"
            width={48}
            height={48}
            className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
          />
          <p className="text-xs leading-relaxed text-text-muted">
            <strong>{c.authorTitle}</strong>
            {c.authorBody1}
            {srRegParen(locale)}
            {c.authorBody2}
          </p>
        </aside>
      </main>

      <div className="mx-auto max-w-3xl px-4">
        <CtaBand businessKey="labor" />
      </div>
    </>
  );
}
