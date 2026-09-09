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
import { LaborPlanPriceSummary } from "@/components/labor/LaborPlanPricing";
import { getLaborPlanFaqs } from "@/lib/labor/service-copy";
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
  "metaTitle": "導入と毎月の進め方｜四葉社会保険労務士事務所",
  "metaDescription": "給与計算・通常手続・労務相談をまとめて任せられる外部人事部サービスです。freee人事労務・LINE打刻を使い、会社側と役割を分けて毎月の人事労務を支援します。",
  "howToName": "導入と毎月の進め方",
  "howToDescription": "給与計算・通常手続・労務相談をまとめて任せられる外部人事部サービスです。freee人事労務・LINE打刻を使い、会社側と役割を分けて毎月の人事労務を支援します。",
  "bcHome": "ホーム",
  "bcHere": "受任の流れ",
  "h1": "導入と毎月の進め方",
  "leadStrong": "給与計算・通常手続・労務相談をまとめて任せられる外部人事部サービスです。freee人事労務・LINE打刻を使い、会社側と役割を分けて毎月の人事労務を支援します。",
  "leadRest": "",
  "orderPre": "ご依頼は ",
  "orderStrong": "ご相談 → 業務範囲とお見積り → ご契約 → 初期導入・運用設計 → 毎月の給与・通常手続 → 会社側の最終承認・報告",
  "orderPost": " の順に進みます。",
  "steps": [
    {
      "name": "ご相談",
      "text": "給与計算対象人数、現状の勤怠運用、給与体系、外国人雇用、業種を伺います。"
    },
    {
      "name": "業務範囲とお見積り",
      "text": "月額・初期導入費・別料金の業務を同時に書面でご案内します。会社側で行う作業も確認します。"
    },
    {
      "name": "ご契約",
      "text": "含む業務・含まない業務・会社側の責任を明記します。在留資格申請などは資格業務ごとに別契約です。"
    },
    {
      "name": "初期導入・運用設計",
      "text": "freee・LINE打刻・給与体系・従業員・社会保険情報・権限を設定し、初回給与テストと基本操作説明、運用フロー設計を行います。"
    },
    {
      "name": "毎月の給与・通常手続",
      "text": "従業員がLINE打刻し、会社側が勤怠を確認・修正・確定。freeeの給与計算内容を四葉が確認します。"
    },
    {
      "name": "会社側の最終承認・報告",
      "text": "給与計算結果を会社側が最終承認し、確認結果を共有します。人事変更情報は会社側からご提供いただきます。"
    }
  ],
  "sameH2": "なぜ、同じ画面を見るのですか？",
  "same1": "従業員がLINE打刻を行い、会社側が確認・修正・確定。freeeの給与計算結果を四葉が確認し、会社側が最終承認します。",
  "same2": "代表社会保険労務士は、申請取次行政書士でもあります。外国人雇用について、在留資格から入社後の給与・社会保険・労務まで一連の流れを見通してご相談いただけます。",
  "same3": "権限設定と基本操作説明も含みます。移行や複雑な給与体系など、作業範囲に応じて事前にお見積りします。新規適用の申請は初期設定に含まれません。",
  "feeH2": "料金は、どう決まるのですか？",
  "feePoints": [],
  "feeNote1": "",
  "feeNoteLink": "報酬額表",
  "feeNote2": "",
  "aiH2": "AIは、どこまで使うのですか？",
  "ai1": "freee人事労務とAIを活用して定型確認や情報整理を効率化し、最終的な確認・判断は社会保険労務士が行います。",
  "aiBox1Strong": "ただし、判断はAIに任せません。",
  "aiBox1Rest": "労働者にあたるかどうか、社会保険に加入するかどうか、助成金の要件を満たすかどうか——こうした判断は、資料を確認したうえで社会保険労務士が行います。提出する書類も、すべて目を通してからお出しします。",
  "aiBox2Strong": "顧問先の個人情報を、生成AIに入力することはしません。",
  "aiBox2Rest": "社会保険労務士には秘密を守る義務があります（社会保険労務士法第21条）。マイナンバー・在留カード番号・給与の明細といった情報は、AIに渡さない運用にしています。",
  "ai2Pre": "AIで安くできるのは作業であって、責任ではありません。間違えたときに向き合うのは資格者です。当事務所が",
  "ai2Link": "手続きの料金",
  "ai2Post": "を下げているのは、作業が軽くなるぶんをお返しする趣旨です。責任の部分まで安くしているわけではありません。",
  "noteServices": "※所要期間・準備物・費用発生のタイミングは業務により異なります。各業務ページと料金もあわせてご覧ください。",
  "authorTitle": "この記事の著者",
  "authorBody1": " 浦松 丈二｜四葉社会保険労務士事務所 代表 社会保険労務士",
  "authorBody2": "・行政書士（登録番号 第25087022号）・宅地建物取引士。元毎日新聞中国総局長（記者歴34年）。"
};

const EN: Copy = {
  "metaTitle": "Setup and monthly workflow｜四葉社会保険労務士事務所",
  "metaDescription": "An external HR service covering payroll, routine procedures and labor advice. We use freee HR and LINE clock-in, with clearly defined responsibilities for your company and our office.",
  "howToName": "Setup and monthly workflow",
  "howToDescription": "An external HR service covering payroll, routine procedures and labor advice. We use freee HR and LINE clock-in, with clearly defined responsibilities for your company and our office.",
  "bcHome": "Home",
  "bcHere": "How we work",
  "h1": "Setup and monthly workflow",
  "leadStrong": "An external HR service covering payroll, routine procedures and labor advice. We use freee HR and LINE clock-in, with clearly defined responsibilities for your company and our office.",
  "leadRest": "",
  "orderPre": "An engagement proceeds in this order: ",
  "orderStrong": "Consultation → Scope and quotation → Contract → Initial setup and workflow design → Monthly payroll and routine procedures → Company approval and reporting",
  "orderPost": ".",
  "steps": [
    {
      "name": "Consultation",
      "text": "We ask about payroll headcount, attendance processes, pay structure, foreign employment and your industry."
    },
    {
      "name": "Scope and quotation",
      "text": "Monthly fees, initial setup and separate services are quoted together in writing. Your company's responsibilities are also confirmed."
    },
    {
      "name": "Contract",
      "text": "Included and excluded work and company responsibilities are recorded. Residence status applications require a separate contract for the relevant profession."
    },
    {
      "name": "Initial setup and workflow design",
      "text": "We configure freee, LINE clock-in, pay structure, employees, insurance information and permissions, then run the initial payroll test and explain the workflow."
    },
    {
      "name": "Monthly payroll and routine procedures",
      "text": "Employees clock in through LINE; your company checks, corrects and finalizes attendance. We review payroll calculated in freee."
    },
    {
      "name": "Company approval and reporting",
      "text": "Your company gives final approval of payroll results. We share the review results, and your company provides personnel changes."
    }
  ],
  "sameH2": "Why do we look at the same screen?",
  "same1": "Employees clock in through LINE. Your company reviews, corrects and finalizes attendance. We review the payroll calculated in freee, and your company gives final approval.",
  "same2": "Our representative labor consultant is also an administrative scrivener authorized for immigration application intermediation, helping you consider residence status together with payroll, social insurance and labor matters after hiring.",
  "same3": "Permission settings and basic operation guidance are included. Migration and complex pay structures are quoted in advance according to scope. Initial insurance registration applications are not part of system setup.",
  "feeH2": "How are fees decided?",
  "feePoints": [],
  "feeNote1": "",
  "feeNoteLink": "fee table",
  "feeNote2": "",
  "aiH2": "How far do we use AI?",
  "ai1": "freee HR and AI help streamline routine checks and information organization. Final professional checks and judgments are made by the labor consultant.",
  "aiBox1Strong": "But we do not leave judgment to AI.",
  "aiBox1Rest": " Whether someone is legally an employee, whether they must be enrolled in social insurance, whether subsidy requirements are met — these judgments are made by the Certified Social Insurance and Labor Consultant after reviewing the documents. Every document we submit is checked by the consultant first.",
  "aiBox2Strong": "We do not enter clients' personal information into generative AI.",
  "aiBox2Rest": " Consultants are bound by confidentiality (Article 21 of the Certified Social Insurance and Labor Consultant Act). My Number, residence-card numbers, and payroll details are kept out of AI as a matter of practice.",
  "ai2Pre": "What AI makes cheaper is the work, not the responsibility. When something goes wrong, it is the licensed professional who answers for it. We have lowered our ",
  "ai2Link": "procedure fees",
  "ai2Post": " to pass on the lighter workload — not to discount the responsibility.",
  "noteServices": "* Timeframes, required documents, and when costs arise differ by service. Please also see the individual service pages and the fee table.",
  "authorTitle": "Author",
  "authorBody1": " Joji Uramatsu | Representative, 四葉社会保険労務士事務所; Certified Social Insurance and Labor Consultant",
  "authorBody2": "; Administrative Scrivener (Reg. No. 25087022); Licensed Real Estate Transaction Specialist. Former China General Bureau Chief of the Mainichi Shimbun (34 years as a journalist)."
};

const ZH_TW: Copy = {
  "metaTitle": "導入與每月作業流程｜四葉社会保険労務士事務所",
  "metaDescription": "整合薪資計算、一般手續與勞務諮詢的外部人事部服務。透過freee人事勞務與LINE打卡，明確區分公司與事務所的責任，支援每月的人事作業。",
  "howToName": "導入與每月作業流程",
  "howToDescription": "整合薪資計算、一般手續與勞務諮詢的外部人事部服務。透過freee人事勞務與LINE打卡，明確區分公司與事務所的責任，支援每月的人事作業。",
  "bcHome": "首頁",
  "bcHere": "受任流程",
  "h1": "導入與每月作業流程",
  "leadStrong": "整合薪資計算、一般手續與勞務諮詢的外部人事部服務。透過freee人事勞務與LINE打卡，明確區分公司與事務所的責任，支援每月的人事作業。",
  "leadRest": "",
  "orderPre": "委託依 ",
  "orderStrong": "諮詢 → 範圍與報價 → 簽約 → 初期導入與流程設計 → 每月薪資與一般手續 → 公司核准與報告",
  "orderPost": " 的順序進行。",
  "steps": [
    {
      "name": "諮詢",
      "text": "了解薪資計算人數、出勤運作、薪資制度、外國人雇用與業種。"
    },
    {
      "name": "範圍與報價",
      "text": "同時以書面說明月費、初期費用與另計業務，確認公司負責的工作。"
    },
    {
      "name": "簽約",
      "text": "明定包含及不包含的工作與公司責任。在留資格申請等依資格業務另行簽約。"
    },
    {
      "name": "初期導入與流程設計",
      "text": "設定freee、LINE打卡、薪資制度、員工、社保資料與權限，進行首次薪資測試、基本操作說明及流程設計。"
    },
    {
      "name": "每月薪資與一般手續",
      "text": "員工以LINE打卡，公司確認、修正並確定出勤，四葉確認freee的薪資計算內容。"
    },
    {
      "name": "公司核准與報告",
      "text": "由公司最終核准薪資結果，分享確認結果，人事異動資訊由公司提供。"
    }
  ],
  "sameH2": "為什麼要看同一個畫面？",
  "same1": "員工以LINE打卡，公司確認、修正並確定出勤。四葉確認freee計算的薪資內容，由公司最終核准。",
  "same2": "代表社會保險勞務士亦為可辦理申請取次的行政書士，可從在留資格到入職後的薪資、社會保險與勞務，綜觀流程提供諮詢。",
  "same3": "亦包含權限設定及基本操作說明。資料移轉或複雜薪資制度等依工作範圍事前報價。新規適用申請不包含於系統設定。",
  "feeH2": "費用是怎麼決定的？",
  "feePoints": [],
  "feeNote1": "",
  "feeNoteLink": "報酬額表",
  "feeNote2": "",
  "aiH2": "AI用到哪裡？",
  "ai1": "運用freee人事勞務與AI提高例行確認及資訊整理的效率，最終的專業確認與判斷由社會保險勞務士負責。",
  "aiBox1Strong": "但是，判斷不交給AI。",
  "aiBox1Rest": "是否屬於勞工、是否應加入社會保險、是否符合助成金要件——這些判斷由社會保險勞務士確認資料後進行。提交的文件也全數過目後才送出。",
  "aiBox2Strong": "不將顧問客戶的個人資料輸入生成式AI。",
  "aiBox2Rest": "社會保險勞務士負有保密義務（社會保險勞務士法第21條）。My Number、在留卡號碼、薪資明細等資訊，一律不交給AI。",
  "ai2Pre": "AI能降低的是作業成本，不是責任。出錯時面對的仍是有資格者。本事務所調降",
  "ai2Link": "手續費用",
  "ai2Post": "，是把作業變輕的部分回饋給客戶，並非連責任的部分也打折。",
  "noteServices": "※所需期間、準備文件、費用發生的時點依業務而異。請一併參閱各業務頁面與費用。",
  "authorTitle": "本文作者",
  "authorBody1": " 浦松 丈二｜四葉社會保險勞務士事務所 代表 社會保險勞務士",
  "authorBody2": "・行政書士（登錄號 第25087022號）・宅地建物取引士。曾任每日新聞中國總局長（記者資歷34年）。"
};

const ZH: Copy = {
  "metaTitle": "导入与每月工作流程｜四葉社会保険労務士事務所",
  "metaDescription": "整合工资计算、一般手续与劳务咨询的外部人事部服务。通过freee人事劳务与LINE打卡，明确区分公司与事务所的责任，支持每月的人事工作。",
  "howToName": "导入与每月工作流程",
  "howToDescription": "整合工资计算、一般手续与劳务咨询的外部人事部服务。通过freee人事劳务与LINE打卡，明确区分公司与事务所的责任，支持每月的人事工作。",
  "bcHome": "首页",
  "bcHere": "受任流程",
  "h1": "导入与每月工作流程",
  "leadStrong": "整合工资计算、一般手续与劳务咨询的外部人事部服务。通过freee人事劳务与LINE打卡，明确区分公司与事务所的责任，支持每月的人事工作。",
  "leadRest": "",
  "orderPre": "委托按 ",
  "orderStrong": "咨询 → 范围与报价 → 签约 → 初期导入与流程设计 → 每月工资与一般手续 → 公司批准与报告",
  "orderPost": " 的顺序进行。",
  "steps": [
    {
      "name": "咨询",
      "text": "了解工资计算人数、出勤运作、工资制度、外国人雇用与行业。"
    },
    {
      "name": "范围与报价",
      "text": "同时以书面说明月费、初期费用与另计业务，确认公司负责的工作。"
    },
    {
      "name": "签约",
      "text": "明确包含及不包含的工作与公司责任。在留资格申请等按资格业务另行签约。"
    },
    {
      "name": "初期导入与流程设计",
      "text": "设置freee、LINE打卡、工资制度、员工、社保资料与权限，进行首次工资测试、基本操作说明及流程设计。"
    },
    {
      "name": "每月工资与一般手续",
      "text": "员工以LINE打卡，公司确认、修正并确定出勤，四叶确认freee的工资计算内容。"
    },
    {
      "name": "公司批准与报告",
      "text": "由公司最终批准工资结果，分享确认结果，人事变动信息由公司提供。"
    }
  ],
  "sameH2": "为什么要看同一个画面？",
  "same1": "员工以LINE打卡，公司确认、修正并确定出勤。四叶确认freee计算的工资内容，由公司最终批准。",
  "same2": "代表社会保险劳务士亦为可办理申请取次的行政书士，可从在留资格到入职后的工资、社会保险与劳务，综观流程提供咨询。",
  "same3": "亦包含权限设置及基本操作说明。资料迁移或复杂工资制度等依工作范围事前报价。新规适用申请不包含于系统设置。",
  "feeH2": "费用是怎么决定的？",
  "feePoints": [],
  "feeNote1": "",
  "feeNoteLink": "报酬额表",
  "feeNote2": "",
  "aiH2": "AI用到哪里？",
  "ai1": "运用freee人事劳务与AI提高例行确认及信息整理的效率，最终的专业确认与判断由社会保险劳务士负责。",
  "aiBox1Strong": "但是，判断不交给AI。",
  "aiBox1Rest": "是否属于劳动者、是否应加入社会保险、是否符合助成金要件——这些判断由社会保险劳务士确认资料后进行。提交的文件也全部过目后才送出。",
  "aiBox2Strong": "不将顾问客户的个人信息输入生成式AI。",
  "aiBox2Rest": "社会保险劳务士负有保密义务（社会保险劳务士法第21条）。My Number、在留卡号码、工资明细等信息，一律不交给AI。",
  "ai2Pre": "AI能降低的是作业成本，不是责任。出错时面对的仍是有资格者。本事务所调低",
  "ai2Link": "手续费用",
  "ai2Post": "，是把作业变轻的部分回馈给客户，并非连责任的部分也打折。",
  "noteServices": "※所需期间、准备文件、费用发生的时点因业务而异。请一并参阅各业务页面与费用。",
  "authorTitle": "本文作者",
  "authorBody1": " 浦松 丈二｜四葉社会保険労務士事務所 代表 社会保险劳务士",
  "authorBody2": "・行政书士（登录号 第25087022号）・宅地建物取引士。曾任每日新闻中国总局长（记者经历34年）。"
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

        <div className="mt-6"><LaborPlanPriceSummary locale={locale} /></div>
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
            {getLaborPlanFaqs(locale).slice(0, 4).map((p) => (
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
