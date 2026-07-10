// ★参考ページ（型D・受任フロー/HowTo）＝ /legal/nagare　※原稿_行政書士 #8
// 配置＝src/app/(legal)/legal/nagare/page.tsx。JSON-LD＝HowTo＋BreadcrumbList。フロー図が主役（ヒーロー画像なし）。
// フェーズI多言語化（2026-07-10）：COPY: Record<LangCode,…>＋getRequestLocale方式（手本=/legal トップ）。
// en/zh-tw/zh=監修前ドラフト（フェーズI・2026-07-10）。HowTo JSON-LDは画面表示と同一のロケール済みsteps配列から生成（HTML＝構造化データ一致）。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { CtaBand } from "@/components/shared/CtaBand";
import type { LangCode } from "@/config/languages";

const SITE = "https://luck428.com";

type NagareStep = {
  name: string;
  text: React.ReactNode;
  // HowTo（構造化データ）用の確定文言。【要確認】相当の括弧書き（料金注記等）は含めない＝ja従来運用を全ロケールで踏襲
  howto: string;
};

type NagareCopy = {
  metaTitle: string;
  metaDesc: string;
  breadcrumbHome: string;
  breadcrumbCurrent: string;
  h1: string;
  lead: React.ReactNode;
  steps: NagareStep[];
  howtoName: string;
  note: React.ReactNode;
};

const COPY: Record<LangCode, NagareCopy> = {
  ja: {
    metaTitle: "ご相談から完了までの流れ｜四葉行政書士事務所",
    metaDesc:
      "四葉行政書士事務所にご依頼いただく流れを、相談・見積り・受任・着手・申請・完了の6段階でご説明します。オンライン相談にも対応。費用が発生するタイミングと、ご準備いただく書類の目安もあわせてご案内します。",
    breadcrumbHome: "ホーム",
    breadcrumbCurrent: "受任の流れ",
    h1: "ご相談から完了までの流れ",
    lead: (
      <>
        四葉行政書士事務所へのご依頼は、<strong>①ご相談 → ②お見積り → ③ご契約（受任）→ ④着手（書類作成）→ ⑤申請・提出 → ⑥完了・フォロー</strong>の6段階で進みます。オンライン相談にも対応します。費用は、初回相談が無料（以降は原則30分5,500円〈税込〉）、業務は書面でのお見積り・ご契約後に着手します。
      </>
    ),
    steps: [
      { name: "ご相談", text: <>現状とご希望を伺い、論点を整理します（初回相談は無料、以降は原則30分5,500円〈税込〉）。</>, howto: "現状とご希望を伺い、論点を整理します。" },
      { name: "お見積り", text: <>業務範囲と報酬を書面でご提示します。</>, howto: "業務範囲と報酬を書面でご提示します。" },
      { name: "ご契約（受任）", text: <>内容にご納得いただいてから契約します。</>, howto: "内容にご納得いただいてから契約します。" },
      { name: "着手（書類作成）", text: <>必要書類の収集・作成を進めます。ご準備いただくものは業務ごとにご案内します。</>, howto: "必要書類の収集・作成を進めます。" },
      { name: "申請・提出", text: <>行政庁へ申請・提出し、照会に対応します。標準的な所要期間は業務ごとにご案内します。</>, howto: "行政庁へ申請・提出し、照会に対応します。" },
      { name: "完了・フォロー", text: <>許可・指定の取得、書類の納品。必要に応じて事後の手続きもサポートします。</>, howto: "許可・指定の取得、書類の納品。必要に応じて事後の手続きもサポートします。" },
    ],
    howtoName: "四葉行政書士事務所 ご相談から完了までの流れ",
    note: (
      <>
        ※所要期間・準備物・費用発生のタイミングは業務により異なります。各業務ページ（
        <Link href="/legal/services/shogai-fukushi" className="text-primary underline">障害福祉</Link>／
        <Link href="/legal/services/visa" className="text-primary underline">在留資格</Link>／
        <Link href="/legal/services/inheritance" className="text-primary underline">相続</Link>／
        <Link href="/legal/services/company" className="text-primary underline">会社設立</Link>／
        <Link href="/legal/services/subsidy" className="text-primary underline">補助金</Link>）と
        <Link href="/legal/ryokin" className="text-primary underline">報酬額表</Link>もあわせてご覧ください。
      </>
    ),
  },
  en: {
    metaTitle: "How Engagement Works: From Consultation to Completion｜四葉行政書士事務所",
    metaDesc:
      "How an engagement with Yotsuba Gyoseishoshi (administrative scrivener) Office proceeds, explained in six stages: consultation, quotation, engagement, document preparation, filing, and completion. Online consultations available. We also outline when fees arise and roughly which documents you will need to prepare.",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "How Engagement Works",
    h1: "From Consultation to Completion: How Engagement Works",
    lead: (
      <>
        An engagement with Yotsuba Gyoseishoshi (administrative scrivener) Office proceeds in six stages: <strong>(1) Consultation → (2) Quotation → (3) Agreement (Engagement) → (4) Commencement (Document Preparation) → (5) Filing & Submission → (6) Completion & Follow-up</strong>. Online consultations are also available. The first consultation is free (thereafter, in principle, 5,500 yen per 30 minutes, tax included), and work begins only after a written quotation and a signed agreement.
      </>
    ),
    steps: [
      { name: "Consultation", text: <>We listen to your situation and goals and organize the issues (the first consultation is free; thereafter, in principle, 5,500 yen per 30 minutes, tax included).</>, howto: "We listen to your situation and goals and organize the issues." },
      { name: "Quotation", text: <>We present the scope of work and fees in writing.</>, howto: "We present the scope of work and fees in writing." },
      { name: "Agreement (Engagement)", text: <>The agreement is signed only once you are fully satisfied with the terms.</>, howto: "The agreement is signed only once you are fully satisfied with the terms." },
      { name: "Commencement (Document Preparation)", text: <>We collect and prepare the required documents. What you need to provide is explained for each service.</>, howto: "We collect and prepare the required documents." },
      { name: "Filing & Submission", text: <>We file with the relevant government agencies and respond to their inquiries. Standard processing times are explained for each service.</>, howto: "We file with the relevant government agencies and respond to their inquiries." },
      { name: "Completion & Follow-up", text: <>Permits or designations are obtained and the documents delivered. We also support any follow-up procedures as needed.</>, howto: "Permits or designations are obtained and the documents delivered. We also support any follow-up procedures as needed." },
    ],
    howtoName: "四葉行政書士事務所 — How Engagement Works: From Consultation to Completion",
    note: (
      <>
        Note: Processing times, required documents, and the point at which fees arise vary by service. Please also see each service page (
        <Link href="/legal/services/shogai-fukushi" className="text-primary underline">Disability-Welfare Services</Link> /{" "}
        <Link href="/legal/services/visa" className="text-primary underline">Visa & Residence Status</Link> /{" "}
        <Link href="/legal/services/inheritance" className="text-primary underline">Inheritance</Link> /{" "}
        <Link href="/legal/services/company" className="text-primary underline">Company Formation</Link> /{" "}
        <Link href="/legal/services/subsidy" className="text-primary underline">Subsidies</Link>) and the{" "}
        <Link href="/legal/ryokin" className="text-primary underline">Fees</Link> page.
      </>
    ),
  },
  "zh-tw": {
    metaTitle: "從諮詢到完成的流程｜四葉行政書士事務所",
    metaDesc:
      "為您說明委託四葉行政書士事務所的流程，分為諮詢、報價、受任、著手、申請、完成六個階段。亦提供線上諮詢。同時說明費用產生的時點，以及需準備文件的大致內容。",
    breadcrumbHome: "首頁",
    breadcrumbCurrent: "受任流程",
    h1: "從諮詢到完成的流程",
    lead: (
      <>
        委託四葉行政書士事務所的流程，依<strong>①諮詢 → ②報價 → ③簽約（受任）→ ④著手（文件製作）→ ⑤申請・提交 → ⑥完成・後續支援</strong>六個階段進行。亦提供線上諮詢。費用方面，首次諮詢免費（之後原則上每30分鐘5,500日圓〈含稅〉），業務於書面報價並簽約後才會著手。
      </>
    ),
    steps: [
      { name: "諮詢", text: <>聆聽您的現況與需求，並梳理問題重點（首次諮詢免費，之後原則上每30分鐘5,500日圓〈含稅〉）。</>, howto: "聆聽您的現況與需求，並梳理問題重點。" },
      { name: "報價", text: <>以書面提示業務範圍與報酬。</>, howto: "以書面提示業務範圍與報酬。" },
      { name: "簽約（受任）", text: <>在您對內容充分理解並認可後，才簽訂契約。</>, howto: "在您對內容充分理解並認可後，才簽訂契約。" },
      { name: "著手（文件製作）", text: <>進行必要文件的蒐集與製作。需準備的資料將依業務別逐一說明。</>, howto: "進行必要文件的蒐集與製作。" },
      { name: "申請・提交", text: <>向行政機關提出申請・提交文件，並回應主管機關的詢問。標準所需期間依業務別另行說明。</>, howto: "向行政機關提出申請・提交文件，並回應主管機關的詢問。" },
      { name: "完成・後續支援", text: <>取得許可・指定並交付文件。如有需要，亦協助辦理後續手續。</>, howto: "取得許可・指定並交付文件。如有需要，亦協助辦理後續手續。" },
    ],
    howtoName: "四葉行政書士事務所 從諮詢到完成的流程",
    note: (
      <>
        ※所需期間、應備文件與費用產生的時點依業務而異。請一併參閱各業務頁面（
        <Link href="/legal/services/shogai-fukushi" className="text-primary underline">障礙福祉</Link>／
        <Link href="/legal/services/visa" className="text-primary underline">在留資格（簽證）</Link>／
        <Link href="/legal/services/inheritance" className="text-primary underline">繼承</Link>／
        <Link href="/legal/services/company" className="text-primary underline">公司設立</Link>／
        <Link href="/legal/services/subsidy" className="text-primary underline">補助金</Link>）與
        <Link href="/legal/ryokin" className="text-primary underline">報酬額表</Link>。
      </>
    ),
  },
  zh: {
    metaTitle: "从咨询到完成的流程｜四葉行政書士事務所",
    metaDesc:
      "为您介绍委托四葉行政書士事務所办理业务的流程，分为咨询、报价、受任、着手、申请、完成六个阶段。支持在线咨询。同时说明费用产生的时点，以及需准备资料的大致内容。",
    breadcrumbHome: "首页",
    breadcrumbCurrent: "受任流程",
    h1: "从咨询到完成的流程",
    lead: (
      <>
        委托四葉行政書士事務所办理业务，按<strong>①咨询 → ②报价 → ③签约（受任）→ ④着手（文件制作）→ ⑤申请・提交 → ⑥完成・后续支持</strong>六个阶段进行。支持在线咨询。费用方面，首次咨询免费（此后原则上每30分钟5,500日元〈含税〉），业务在书面报价并签约后方才着手。
      </>
    ),
    steps: [
      { name: "咨询", text: <>了解您的现状与期望，梳理问题重点（首次咨询免费，此后原则上每30分钟5,500日元〈含税〉）。</>, howto: "了解您的现状与期望，梳理问题重点。" },
      { name: "报价", text: <>以书面形式提示业务范围与报酬。</>, howto: "以书面形式提示业务范围与报酬。" },
      { name: "签约（受任）", text: <>在您对内容充分理解并认可后，再签订合同。</>, howto: "在您对内容充分理解并认可后，再签订合同。" },
      { name: "着手（文件制作）", text: <>推进必要文件的收集与制作。需准备的资料将按业务分别说明。</>, howto: "推进必要文件的收集与制作。" },
      { name: "申请・提交", text: <>向行政机关提出申请・提交文件，并回应主管机关的询问。标准办理周期按业务分别说明。</>, howto: "向行政机关提出申请・提交文件，并回应主管机关的询问。" },
      { name: "完成・后续支持", text: <>取得许可・指定并交付文件。如有需要，也可协助办理后续手续。</>, howto: "取得许可・指定并交付文件。如有需要，也可协助办理后续手续。" },
    ],
    howtoName: "四葉行政書士事務所 从咨询到完成的流程",
    note: (
      <>
        ※所需时间、应备资料及费用产生的时点因业务而异。请一并参阅各业务页面（
        <Link href="/legal/services/shogai-fukushi" className="text-primary underline">残障福祉</Link>／
        <Link href="/legal/services/visa" className="text-primary underline">在留资格（签证）</Link>／
        <Link href="/legal/services/inheritance" className="text-primary underline">继承</Link>／
        <Link href="/legal/services/company" className="text-primary underline">公司设立</Link>／
        <Link href="/legal/services/subsidy" className="text-primary underline">补助金</Link>）与
        <Link href="/legal/ryokin" className="text-primary underline">报酬额表</Link>。
      </>
    ),
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;
  return buildPageMetadata({
    businessKey: "legal",
    title: c.metaTitle,
    description: c.metaDesc,
    path: "/legal/nagare",
    locale,
    absoluteTitle: true,
  });
}

// HowTo は確定文言のみ（【要確認】の括弧内は構造化データに含めない）＝各ロケールの steps[].howto を使用
// 画面表示と同一のロケール済み steps 配列から生成（HTMLと構造化データの一致を維持）。@id・型・構造は従来どおり
function jsonLd(c: NagareCopy) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HowTo",
        name: c.howtoName,
        step: c.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.howto })),
      },
      // BreadcrumbList は <Breadcrumb> 部品が出力（二重を避ける）
    ],
  };
}

export default async function Page() {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(c)) }} />
      <Breadcrumb items={[{ name: c.breadcrumbHome, href: "/legal" }, { name: c.breadcrumbCurrent }]} />

      <main className="mx-auto max-w-3xl px-4 pb-16">
        <header className="pt-2">
          <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">{c.h1}</h1>
          <p className="mt-3 leading-relaxed text-text">
            {c.lead}
          </p>
        </header>

        {/* フロー図（6ステップ・縦ステッパー＝型Dの主役） */}
        <ol className="mt-6 space-y-4">
          {c.steps.map((s, i) => (
            <li key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-white">{i + 1}</span>
                {i < c.steps.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
              </div>
              <div className="pb-2">
                <div className="font-serif text-base font-semibold text-ink">{s.name}</div>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <blockquote className="mt-6 border-l-4 border-primary bg-primary-tint p-3 text-sm leading-relaxed text-text">
          {c.note}
        </blockquote>
      </main>

      <div className="mx-auto max-w-3xl px-4">
        <CtaBand businessKey="legal" />
      </div>
    </>
  );
}
