import type { LangCode } from "@/config/languages";

export type WorkflowRoleCopy = { label: string; body: string };

export type WorkflowStepCopy = {
  id: string;
  title: string;
  paragraphs: string[];
  outcome: string;
  clientAction?: string;
  items?: string[];
  roles?: WorkflowRoleCopy[];
};

export type WorkflowCaseCopy = {
  title: string;
  paragraphs: string[];
  flow?: string;
};

export type WorkflowCopy = {
  pageTitle: string;
  metaTitle: string;
  metaDescription: string;
  lead: string;
  intro: string[];
  scopeNote: string;
  scheduleNote: string;
  banner: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    note: string;
    ctaLabel: string;
    groups: { label: string; stepRange: string }[];
  };
  labels: {
    breadcrumb: string;
    toc: string;
    steps: string;
    outcome: string;
    clientAction: string;
    cases: string;
    materials: string;
    information: string;
    faq: string;
    representative: string;
    companyRole: string;
    officeRole: string;
  };
  steps: WorkflowStepCopy[];
  cases: {
    heading: string;
    intro: string;
    note: string;
    items: WorkflowCaseCopy[];
    separationNote: string;
  };
  materials: {
    heading: string;
    emphasis: string;
    paragraphs: string[];
    sharingNote: string;
    columns: [string, string, string];
    rows: { category: string; examples: string; handling: string }[];
    note: string;
  };
  information: {
    heading: string;
    paragraphs: string[];
    judgmentNote: string;
  };
  faqs: { q: string; a: string }[];
  cta: {
    primary: string;
    pricing: string;
    note: string;
    representativeLabel: string;
  };
};

const JA: WorkflowCopy = {
  pageTitle: "問い合わせ・受任の流れ",
  metaTitle: "問い合わせ・受任の流れ｜四葉社会保険労務士事務所",
  metaDescription: "ご相談から代表のヒアリング、お見積もり、担当決定、資料共有、freee人事労務・LINE打刻の設定、テスト、本番運用、改善までをご案内。会社設立や店舗探しからつながるご相談にも、事情を踏まえて対応します。",
  lead: "ご相談から、日々の運用・改善まで。",
  intro: [
    "四葉社会保険労務士事務所では、最初に代表がお話を伺い、事業の内容や採用の予定、現在のお困りごとを整理します。お見積もりと担当体制を確認したうえで、資料共有、運用の準備、テストを経て、実際の業務を始めます。",
    "始めて終わりではなく、運用して分かった課題を振り返り、会社の状況に合わせて進め方を見直します。",
  ],
  scopeNote: "以下は、給与計算や労務の継続支援を始める場合の標準的な流れです。入退社の手続きだけなどのご依頼は、内容に応じて必要な工程に絞ります。単発のご依頼に、顧問契約やfreee・LINE打刻の導入を一律に求めるものではありません。",
  scheduleNote: "具体的な日程や進め方は、ご依頼内容と資料の準備状況等を確認してご案内します。特定の完了日や成果を保証するものではありません。",
  banner: {
    eyebrow: "はじめてご相談される方へ",
    heading: "問い合わせ・受任の流れ",
    paragraphs: [
      "ご相談から、日々の運用・改善まで。代表が事業の状況を伺い、担当スタッフとともに、書類の整理、freee人事労務・LINE打刻の設定、テスト、本番運用を進めます。",
      "会社設立や店舗探しからつながるご相談にも対応。これまでの経緯や共通する基本資料を踏まえ、必要な準備を整理します。",
    ],
    note: "手続きだけのご依頼は、必要な工程に絞って進めます。ソフト等の導入・設定は、ご依頼内容に応じてご案内します。",
    ctaLabel: "相談から運用開始までの8ステップを見る",
    groups: [
      { label: "相談・お見積もり", stepRange: "STEP 1〜3" },
      { label: "資料共有・初期設定", stepRange: "STEP 4〜5" },
      { label: "テスト・本番運用", stepRange: "STEP 6〜7" },
      { label: "振り返り・改善", stepRange: "STEP 8" },
    ],
  },
  labels: {
    breadcrumb: "社労士トップ",
    toc: "このページの目次",
    steps: "ご相談から始まる8ステップ",
    outcome: "この段階で決まること",
    clientAction: "お客様にお願いすること",
    cases: "ご相談の入口の例",
    materials: "共通資料と背景の理解",
    information: "役割分担・資料の取り扱い",
    faq: "よくあるご質問",
    representative: "代表について",
    companyRole: "会社の役割",
    officeRole: "四葉の役割",
  },
  steps: [
    {
      id: "step-1",
      title: "お問い合わせ",
      paragraphs: [
        "ご紹介、ホームページのお問い合わせフォーム、LINE・お電話、ミツモアやゼヒトモなどのマッチングサイトからご相談いただけます。",
        "「初めて社員を採用する」「給与計算だけをお願いしたい」「会社をつくった後の手続きが分からない」など、今の状況をお聞かせください。最初から書類をすべてそろえる必要はありません。採用日や初回の給与支払日など、予定が決まっている場合は、あわせてお知らせください。",
      ],
      outcome: "相談したい内容と、ヒアリングの日程。",
      clientAction: "お困りごと、ご希望の連絡方法、分かる範囲での予定・期限を伝えること。",
    },
    {
      id: "step-2",
      title: "代表によるヒアリング",
      paragraphs: [
        "代表の浦松丈二が、事業の内容、現在の体制、これからの採用や出店の予定、給与・勤怠の管理方法などを伺います。",
        "依頼された手続きだけを見るのではなく、何のために必要なのか、ほかの準備とどう関係するのかを確認します。会社設立や店舗探しからご相談いただいている場合も、これまでの経緯を踏まえ、必要な確認を行います。",
      ],
      outcome: "課題の整理、優先順位、依頼範囲のたたき台。",
      clientAction: "現在の業務の進め方と、変えたい点・変えたくない点を伝えること。",
    },
    {
      id: "step-3",
      title: "お見積もり・ご提案・担当者の決定",
      paragraphs: [
        "必要な業務と進め方をご提案し、初期費用、継続して発生する費用、別途お見積もりとなる業務を、着手前に書面でご案内します。お客様に行っていただく作業と、四葉が担当する作業も明確にします。",
        "通常は、担当スタッフ1名と代表が対応する体制です。日々の連絡窓口と、確認・判断を担当する者をお伝えします。ご依頼内容によって体制が変わる場合も、事前にご案内します。",
        "内容にご納得いただき、ご契約を確認した後に準備を始めます。",
      ],
      outcome: "お見積書、契約内容、担当体制、役割分担。",
    },
    {
      id: "step-4",
      title: "クラウド上の共有フォルダを作成",
      paragraphs: [
        "必要書類や手続きの控えを整理するため、クラウド上に共有フォルダを用意します。提出済みの資料、これから必要な資料、確認中の事項を分かりやすくし、資料を探したり送り直したりする負担を減らします。",
        "閲覧・編集できる方を限定し、給与や従業員情報などは内容に応じて保存場所と権限を分けます。使い方もご案内し、誰が何を確認するかを決めます。",
      ],
      outcome: "資料の置き場所、提出状況の管理方法、閲覧・編集の権限。",
      clientAction: "会社側の連絡担当者と、資料を閲覧できる方を確認すること。",
    },
    {
      id: "step-5",
      title: "スケジュール・必要書類を確定し、運用の基盤を整える",
      paragraphs: [
        "採用日、必要な手続き、勤怠の締日、給与の支払日などを確認し、「いつまでに、誰が、何を用意するか」を決めます。会社や従業員の状況に応じて必要書類を整理し、不足している情報を確認します。",
        "継続支援で導入するfreee人事労務では、会社・従業員情報、給与体系、勤務時間、手当、承認の流れなどを設定します。LINE打刻も、実際の勤務方法に合わせて準備します。",
        "ソフトを使える状態にするだけでなく、情報の提出、確認、修正、承認まで、日々の業務が回る進め方を整えます。",
      ],
      outcome: "導入スケジュール、必要書類一覧、設定内容、毎月の役割分担。",
      clientAction: "必要な会社・従業員情報の提供、勤務条件・給与条件・承認者の確認。",
      items: ["採用・手続きの予定", "必要書類", "給与の締日・支払日", "freee人事労務", "LINE打刻", "確認・承認の方法"],
    },
    {
      id: "step-6",
      title: "テスト実施・調整",
      paragraphs: [
        "本番の前に、打刻から勤怠の確認、給与計算、承認までの流れを試します。勤務時間や手当が想定どおり反映されるか、担当者が必要な画面・資料を確認できるか、情報の受け渡しに無理がないかを確かめます。",
        "分かりにくい操作や設定のずれがあれば調整し、お客様と運用開始の条件を確認します。",
      ],
      outcome: "テスト結果、修正事項、本番開始前の確認。",
      clientAction: "会社側で行う操作・確認・承認を試し、気づいた点を伝えること。",
    },
    {
      id: "step-7",
      title: "本番運用",
      paragraphs: [
        "確認したスケジュールに沿って、本番の業務を始めます。従業員の打刻や人事情報をもとに、会社側で勤怠を確認・確定し、四葉が給与計算の内容を確認します。給与計算結果は、会社側の最終承認を経て確定します。",
        "入退社などの手続きは、契約した範囲に応じて進め、手続きの控えや進捗を共有します。初回の運用で生じた疑問や変更点も、その都度確認します。",
      ],
      outcome: "初回業務の完了確認、毎月の連絡・確認のリズム、手続きの控えの共有。",
      roles: [
        { label: "会社の役割", body: "人事情報の提供、勤怠の確認・修正・確定、給与計算結果の最終承認。" },
        { label: "四葉の役割", body: "必要情報の確認、契約範囲内の給与計算・手続き、控え・状況の共有。" },
      ],
    },
    {
      id: "step-8",
      title: "振り返り・改善（PDCA）",
      paragraphs: [
        "運用して初めて分かる課題もあります。打刻漏れが起きやすい、資料がそろう時期が遅い、採用が増えて今の進め方では難しいなど、現場で生じたことを振り返ります。",
        "計画し、実行し、結果を確認して、改善する。この繰り返しを通じて、会社の状況に合う人事労務の運用へ見直していきます。見直しの範囲や相談の方法は、ご契約内容に応じてご案内します。",
      ],
      outcome: "改善点、見直す手順、次に対応する課題。",
    },
  ],
  cases: {
    heading: "ご相談の入口は、会社設立や店舗探しからでも。",
    intro: "最初のご相談が、社労士の業務とは限りません。会社をつくる、店舗を借りる、初めて人を雇う。事業の準備が進む中で、新たに人事労務の課題が見えてくることがあります。",
    note: "以下はご相談の入口と進め方を説明する一般化した例です。特定のお客様の事例・成果を示すものではありません。",
    items: [
      {
        title: "会社設立の相談から、採用・社会保険・給与の準備へ",
        paragraphs: [
          "四葉行政書士事務所への会社設立支援のご相談をきっかけに、事業開始後の採用や社会保険、給与計算の準備へつながることがあります。",
          "会社の事業目的や体制、今後の計画を踏まえ、必要な労務の準備を整理します。行政書士が行う定款作成等の支援と、社労士が行う労務の支援は、それぞれの業務として進めます。設立登記が必要な場合は、司法書士等の担当領域を区分してご案内します。",
        ],
        flow: "会社設立の相談 → 事業・採用計画の確認 → 労務の受任・導入準備。",
      },
      {
        title: "店舗物件の紹介から、開店に向けた雇用の準備へ",
        paragraphs: [
          "四葉不動産株式会社への店舗探しのご相談から、開店時の採用、労働条件、勤怠管理、給与計算へと相談が広がることもあります。",
          "開店予定日、営業時間、予定する人員などの事情を踏まえ、物件の準備と人を迎える準備の予定を整理します。物件の媒介は不動産会社、人事労務は社労士事務所が、それぞれ担当します。",
        ],
        flow: "店舗物件の相談 → 開店・採用予定の確認 → 労務の受任・導入準備。",
      },
      {
        title: "入退社の手続きだけ・給与計算だけの相談から",
        paragraphs: [
          "会社設立や物件探しのご依頼がなくても、もちろんご相談いただけます。「入社1名の手続きだけ」「給与計算だけを毎月お願いしたい」など、必要な業務から進められます。",
          "まずは依頼する範囲を決め、必要書類と確認方法を整理します。継続的な労務相談などを追加する場合も、内容と費用を改めてご案内します。",
        ],
      },
    ],
    separationNote: "四葉不動産株式会社、四葉行政書士事務所、四葉社会保険労務士事務所は、それぞれ別の事業体として、業務・契約・費用を分けて受任します。必要な部分だけをご依頼いただけます。他の専門家・事業者と併用される場合も、役割分担を確認します。",
  },
  materials: {
    heading: "書類だけでなく、その背景も理解する。",
    emphasis: "同じ説明や資料の提出を、できるだけ繰り返さずに。",
    paragraphs: [
      "会社設立、店舗の契約、人事労務には、会社概要、事業内容、事業所の所在地、代表者情報、定款や設立後の登記事項など、共通して確認する基本資料・情報があります。",
      "すでに整理した内容を確認し、必要な資料を適切に活用することで、同じ説明や資料の出し直しをできるだけ減らします。情報が変わっている場合や、改めて確認が必要な書類は、その都度ご案内します。",
      "さらに大切なのは、お客様がどのような事業を目指し、いつ、どこで、どのように人を迎えようとしているのかを理解することです。書類の背景にある事情を把握することで、必要な確認や準備を先回りして整理し、スムーズで的確な対応につなげます。",
    ],
    sharingNote: "資料の利用・共有は、利用目的、共有先、必要な同意等を確認したうえで、業務上必要な範囲に限ります。すべての資料をグループ内で自由に共有するものではありません。",
    columns: ["区分", "資料・情報の例", "取り扱い"],
    rows: [
      { category: "共通して確認する基本資料・情報", examples: "会社概要、事業内容、所在地、定款、設立後の登記事項", handling: "必要性・最新性・利用目的等を確認して活用" },
      { category: "労務のために確認する資料", examples: "労働条件、従業員情報、勤怠、給与情報", handling: "担当者と利用範囲を限定" },
      { category: "特に慎重に扱う情報", examples: "マイナンバー、健康に関する情報等", handling: "情報の種類に応じた別の保管・提供方法を案内" },
    ],
    note: "資料の例は、すべてのご依頼で全件の提出をお願いするものではありません。マイナンバー・健康情報・給与データ一式は、通常のお問い合わせフォームやLINEへ送らず、ご案内する受け渡し方法をご利用ください。",
  },
  information: {
    heading: "資料の取り扱いと確認体制",
    paragraphs: [
      "資料を扱う担当者と閲覧権限を決め、情報の種類に応じて受け渡し方法を分けます。給与・社会保険等の確認や判断は、代表社会保険労務士が責任を持って行います。お客様の個人情報を生成AIに入力することはしません。",
    ],
    judgmentNote: "本ページは一般的な進め方のご案内です。個別の法的判断は、資格者による確認を要します。",
  },
  faqs: [
    { q: "問い合わせの前に、すべての書類をそろえる必要はありますか？", a: "いいえ。まずは現在の状況と、依頼したいことをお聞かせください。お話を伺ったうえで必要書類を整理し、提出方法をご案内します。採用日や給与支払日など、予定が決まっている場合はあわせてお知らせください。" },
    { q: "問い合わせをすると、そのまま契約になりますか？", a: "お問い合わせだけで受任することはありません。業務範囲、費用、担当体制をご案内し、契約内容を確認したうえで準備を始めます。有料の調査・作業が必要な場合も、着手前にご案内します。" },
    { q: "代表と担当スタッフは、どのように対応しますか？", a: "最初のヒアリングは代表が行い、通常は担当スタッフ1名と代表が対応します。日々の連絡窓口と確認・判断の担当をお伝えし、ご依頼内容に応じた体制をご案内します。" },
    { q: "手続きだけの依頼でも、freeeやLINE打刻の導入が必要ですか？", a: "一律に必要ということではありません。手続きだけのご依頼は、必要な書類の確認・受け渡しを中心に進めます。給与計算などを継続してご依頼いただく場合は、契約範囲と現在の運用を確認して、導入・設定の進め方をご案内します。" },
    { q: "会社設立や物件の相談で提出した書類は、また提出しますか？", a: "利用目的や共有範囲等を確認し、必要な基本資料を適切に活用して、重複した提出をできるだけ減らします。ただし、内容の変更、書類の有効性、手続きごとの要件などにより、再確認や追加資料をお願いする場合があります。" },
    { q: "行政書士・不動産の業務も、同じ契約・料金に含まれますか？", a: "いいえ。各事業体が業務・契約・費用を分けて受任します。必要な部分だけをご依頼いただけます。登記や税務など、別の専門家が担当する業務がある場合も、役割分担をご案内します。" },
  ],
  cta: {
    primary: "ご相談・お見積もりのお問い合わせ",
    pricing: "料金・依頼範囲を確認する",
    note: "会社設立や店舗探しの段階でも、必要な手続きがまだ分からなくても、ご相談いただけます。",
    representativeLabel: "代表 浦松丈二について",
  },
};

const EN: WorkflowCopy = {
  pageTitle: "From inquiry to ongoing support",
  metaTitle: "From inquiry to ongoing support | 四葉社会保険労務士事務所",
  metaDescription: "Our eight steps cover your inquiry, a meeting with our representative, quotation, team assignment, document sharing, freee HR and LINE time-clock setup, testing, live operation and improvement. We also help prepare for employment when your first inquiry concerns company formation or premises.",
  lead: "From your first conversation to day-to-day operations and improvement.",
  intro: [
    "At 四葉社会保険労務士事務所, our representative first listens to you and clarifies your business, hiring plans and current concerns. After confirming the quotation and support team, we share documents, prepare your operations and test the process before starting the actual work.",
    "Our involvement continues beyond the launch. We review issues that emerge in practice and adjust the process to your company's circumstances.",
  ],
  scopeNote: "The following is a standard example for starting ongoing payroll or labor support. For a standalone request, such as employee onboarding or offboarding filings, we use only the steps needed for that work. A standalone engagement does not automatically require an advisory retainer or the introduction of freee or a LINE time clock.",
  scheduleNote: "We explain the specific schedule and process after checking your requested scope and document readiness. We do not guarantee a particular completion date or outcome.",
  banner: {
    eyebrow: "For your first consultation",
    heading: "From inquiry to ongoing support",
    paragraphs: [
      "From your first conversation to day-to-day operations and improvement. Our representative learns about your business and works with the assigned staff member on document organization, freee HR and LINE time-clock setup, testing and live operation.",
      "Your inquiry can also begin with company formation or a search for premises. We take account of the background and relevant basic documents to organize the preparation needed.",
    ],
    note: "For filings-only requests, we use only the necessary steps. Software introduction and setup depend on the work you commission.",
    ctaLabel: "See the 8 steps from consultation to launch",
    groups: [
      { label: "Consultation & quotation", stepRange: "STEP 1–3" },
      { label: "Documents & initial setup", stepRange: "STEP 4–5" },
      { label: "Testing & live operation", stepRange: "STEP 6–7" },
      { label: "Review & improvement", stepRange: "STEP 8" },
    ],
  },
  labels: {
    breadcrumb: "Labor services home",
    toc: "On this page",
    steps: "8 steps, starting with your inquiry",
    outcome: "What we establish at this stage",
    clientAction: "What we ask you to do",
    cases: "Examples of how an inquiry can begin",
    materials: "Shared basic documents and business context",
    information: "Responsibilities and information handling",
    faq: "Frequently asked questions",
    representative: "Our representative",
    companyRole: "Your company's role",
    officeRole: "Yotsuba's role",
  },
  steps: [
    {
      id: "step-1",
      title: "Get in touch",
      paragraphs: [
        "You can contact us through a referral, our website inquiry form, LINE, telephone, or matching platforms such as Mitsumoa and Zehitomo.",
        "Tell us about your current situation: perhaps you are hiring your first employee, want to outsource payroll only, or are unsure which procedures follow company formation. You do not need to have every document ready at the outset. If dates such as the first working day or first payroll payment have already been decided, please let us know.",
      ],
      outcome: "The matters you would like to discuss and a date for the initial meeting.",
      clientAction: "Tell us your concerns, preferred contact method, and any known plans or deadlines.",
    },
    {
      id: "step-2",
      title: "Meet with our representative",
      paragraphs: [
        "Our representative, 浦松丈二 (Joji Uramatsu), asks about your business, current team, future hiring or premises plans, and how you manage payroll and attendance.",
        "We consider why the requested procedure is needed and how it relates to other preparations. If your inquiry began with company formation or a search for premises, we take account of that background when making the necessary checks.",
      ],
      outcome: "A clearer picture of the issues, their priorities and an initial outline of the scope.",
      clientAction: "Explain your current way of working, what you would like to change and what you would like to keep.",
    },
    {
      id: "step-3",
      title: "Quotation, proposal and team assignment",
      paragraphs: [
        "We propose the work and approach, then provide a written explanation of initial fees, recurring fees and any work requiring a separate quotation before starting. We also clarify which tasks your company performs and which Yotsuba handles.",
        "Normally, one assigned staff member and our representative support you. We identify your day-to-day contact and the person responsible for checks and professional judgments. If the team arrangement differs because of the requested work, we explain it in advance.",
        "Preparation starts after you agree to the proposal and we confirm the contract.",
      ],
      outcome: "The written quotation, contract terms, support team and division of responsibilities.",
    },
    {
      id: "step-4",
      title: "Create a shared cloud folder",
      paragraphs: [
        "We prepare a shared cloud folder to organize required documents and copies of filings. It makes submitted documents, outstanding items and matters under review easier to identify, reducing time spent searching for or resending materials.",
        "Access to view or edit is restricted. Payroll and employee information are separated by storage location and permissions as appropriate to the content. We explain how to use the folder and agree who checks what.",
      ],
      outcome: "Where documents are kept, how submission status is tracked, and viewing and editing permissions.",
      clientAction: "Confirm your company's contact person and who may access the documents.",
    },
    {
      id: "step-5",
      title: "Confirm the schedule and documents, then prepare the operating process",
      paragraphs: [
        "We check hiring dates, required filings, attendance cutoff dates and payroll payment dates, then agree who prepares each item and by when. We organize the documents needed for the company and employees and identify missing information.",
        "When introducing freee HR for ongoing support, we configure company and employee information, pay arrangements, working hours, allowances and approval flows. We also prepare the LINE time clock to fit the actual working arrangements.",
        "Beyond making the software ready to use, we establish how information is submitted, checked, corrected and approved so that daily operations can run.",
      ],
      outcome: "The implementation schedule, document checklist, settings and monthly responsibilities.",
      clientAction: "Provide the required company and employee information and confirm working conditions, pay conditions and approvers.",
      items: ["Hiring and filing schedule", "Required documents", "Payroll cutoff and payment dates", "freee HR", "LINE time clock", "Checks and approvals"],
    },
    {
      id: "step-6",
      title: "Test and adjust",
      paragraphs: [
        "Before live operation, we test the flow from clocking in and reviewing attendance through payroll calculation and approval. We check whether hours and allowances are reflected as expected, whether the people responsible can access the screens and documents they need, and whether information can be handed over practically.",
        "We adjust unclear operations or settings that do not match the intended process, then confirm the conditions for starting with you.",
      ],
      outcome: "Test results, items to correct and the checks needed before launch.",
      clientAction: "Try the operations, checks and approvals your company will perform, and tell us what you notice.",
    },
    {
      id: "step-7",
      title: "Begin live operation",
      paragraphs: [
        "We start the actual work according to the agreed schedule. Using employee time records and personnel information, your company reviews and finalizes attendance, and Yotsuba checks the payroll calculations. Payroll results are finalized only after your company's final approval.",
        "Onboarding, offboarding and other filings are handled within the contracted scope, with copies and progress shared. We also check questions and changes as they arise during the first cycle.",
      ],
      outcome: "Confirmation that the first cycle is complete, a monthly rhythm for communication and checks, and shared copies of filings.",
      roles: [
        { label: "Your company's role", body: "Provide personnel information; review, correct and finalize attendance; give final approval of payroll results." },
        { label: "Yotsuba's role", body: "Check required information, calculate payroll and handle filings within the contract, and share copies and status updates." },
      ],
    },
    {
      id: "step-8",
      title: "Review and improve (PDCA)",
      paragraphs: [
        "Some issues become clear only in practice: time records may often be missing, documents may arrive late, or increased hiring may put pressure on the current process. We review what has happened in daily operations.",
        "We plan, carry out the work, check the results and improve. Repeating this cycle helps us adjust HR and labor operations to your company's circumstances. The scope of review and consultation arrangements depend on your contract.",
      ],
      outcome: "Improvements to make, procedures to revise and the next issues to address.",
    },
  ],
  cases: {
    heading: "Your inquiry may begin with company formation or a search for premises.",
    intro: "Your first question may concern something other than labor services. Forming a company, renting premises or hiring for the first time can reveal new HR and labor questions as business preparations progress.",
    note: "These are generalized examples explaining how an inquiry and the process may develop. They do not describe a particular client or a client's results.",
    items: [
      {
        title: "From company formation to hiring, social insurance and payroll preparation",
        paragraphs: [
          "An inquiry to 四葉行政書士事務所 about company formation support may lead to preparations for hiring, social insurance and payroll after the business starts.",
          "We organize the labor preparations needed in light of your business objectives, structure and future plans. Administrative scrivener support, such as drafting articles of incorporation, and labor consultant support proceed as separate professional services. If incorporation registration is needed, we explain the separate responsibilities of a judicial scrivener or other appropriate professional.",
        ],
        flow: "Company formation inquiry → Business and hiring plans confirmed → Labor engagement and implementation preparation.",
      },
      {
        title: "From finding premises to preparing employment for opening day",
        paragraphs: [
          "An inquiry to 四葉不動産株式会社 about premises may expand to hiring for opening day, working conditions, attendance management and payroll.",
          "We organize the schedules for preparing the premises and welcoming employees, considering the planned opening date, operating hours and staffing. The real estate company handles property brokerage, and the labor consultant office handles HR and labor matters.",
        ],
        flow: "Premises inquiry → Opening and hiring plans confirmed → Labor engagement and implementation preparation.",
      },
      {
        title: "Start directly with employee filings only or payroll only",
        paragraphs: [
          "You are equally welcome to contact us without commissioning company formation or a property search. You can begin with the work you need, such as filings for one new employee or monthly payroll alone.",
          "We first agree the scope, required documents and checking process. If you later add ongoing labor advice or other work, we explain the additional scope and fees separately.",
        ],
      },
    ],
    separationNote: "四葉不動産株式会社, 四葉行政書士事務所 and 四葉社会保険労務士事務所 are separate business entities, accepting work under separate scopes, contracts and fees. You may commission only the services you need. If you also use other professionals or providers, we confirm the division of responsibilities.",
  },
  materials: {
    heading: "Understanding the background, as well as the documents.",
    emphasis: "Less repetition of the same explanations and document submissions.",
    paragraphs: [
      "Company formation, premises contracts and HR and labor work can involve the same basic documents and information: company profiles, business activities, workplace addresses, representative details, articles of incorporation and registration details after incorporation.",
      "We review information already organized and appropriately use the documents needed to reduce repeated explanations and resubmissions where possible. If information has changed or a document needs to be checked again, we let you know.",
      "It is also essential to understand the business you want to build and when, where and how you plan to welcome employees. Understanding the circumstances behind the documents helps us anticipate the checks and preparations needed and respond smoothly and appropriately.",
    ],
    sharingNote: "Documents are used and shared only as needed for the work, after checking the purpose, recipients and any necessary consent. Documents are not freely shared throughout the group.",
    columns: ["Category", "Examples", "Handling"],
    rows: [
      { category: "Basic documents and information checked across services", examples: "Company profile, business activities, address, articles of incorporation and post-incorporation registration details", handling: "Used after checking necessity, currency and purpose" },
      { category: "Documents checked for labor services", examples: "Working conditions, employee information, attendance and payroll information", handling: "Restricted to the people responsible and the required scope of use" },
      { category: "Information requiring particular care", examples: "My Number identification numbers, health information and similar information", handling: "Separate storage and transfer arrangements appropriate to the type of information" },
    ],
    note: "These examples do not mean that every engagement requires every document. Do not send My Number identification numbers, health information or complete payroll datasets through the ordinary inquiry form or LINE; use the transfer method we provide.",
  },
  information: {
    heading: "Information handling and professional review",
    paragraphs: [
      "We identify the people who handle documents, set access permissions and use different transfer methods according to the information type. Our representative certified social insurance and labor consultant takes responsibility for checks and professional judgments concerning payroll, social insurance and related matters. We do not enter clients' personal information into generative AI.",
    ],
    judgmentNote: "This page explains a general process. Legal judgments about individual circumstances require review by a qualified professional.",
  },
  faqs: [
    { q: "Do I need to prepare every document before contacting you?", a: "No. First tell us about your situation and the work you would like to commission. After speaking with you, we organize the required documents and explain how to submit them. Please also tell us any dates already decided, such as the first working day or payroll payment date." },
    { q: "Does making an inquiry automatically create a contract?", a: "No. An inquiry alone does not establish an engagement. We explain the scope, fees and support team, then confirm the contract before starting preparation. If paid research or other work is needed, we explain it before beginning." },
    { q: "How do the representative and assigned staff support us?", a: "Our representative conducts the first meeting. Normally, one assigned staff member and the representative support you. We identify your day-to-day contact and the person responsible for checks and professional judgments, and explain the team arrangement for your requested work." },
    { q: "Do filings-only requests also require freee or a LINE time clock?", a: "Not automatically. For filings-only work, we focus on checking and exchanging the necessary documents. For ongoing payroll or similar work, we check the contracted scope and current operations before explaining software introduction and setup." },
    { q: "Do we need to resubmit documents already provided for company formation or premises?", a: "After checking the purpose and permitted sharing scope, we appropriately use necessary basic documents to reduce duplicate submissions where possible. Changes in content, document validity or the requirements of a particular procedure may mean that we need to check again or request additional documents." },
    { q: "Are administrative scrivener and real estate services included in the same contract and fee?", a: "No. Each business entity accepts work with separate scopes, contracts and fees. You can commission only the parts you need. Where another professional handles matters such as registration or tax, we also explain the division of responsibilities." },
  ],
  cta: {
    primary: "Ask about a consultation or quotation",
    pricing: "Check fees and scope of work",
    note: "You can contact us while forming a company or looking for premises, even if you are not yet sure which procedures are needed.",
    representativeLabel: "About our representative, 浦松丈二",
  },
};

const ZH_TW: WorkflowCopy = {
  pageTitle: "諮詢與委託流程",
  metaTitle: "諮詢與委託流程｜四葉社会保険労務士事務所",
  metaDescription: "說明從諮詢、代表訪談、報價、負責人確認、資料共享、freee人事勞務與LINE打卡設定，到測試、正式運作及改善的8個步驟。從公司設立或尋找店面開始的諮詢，也會依事業背景整理所需準備。",
  lead: "從初次諮詢，到日常運作與持續改善。",
  intro: [
    "四葉社会保険労務士事務所由代表先聆聽您的說明，整理事業內容、招募計畫與目前遇到的問題。確認報價與服務人員安排後，透過資料共享、運作準備及測試，再開始實際業務。",
    "服務不止於啟動。我們會回顧實際運作中發現的問題，依公司的情況調整工作方式。",
  ],
  scopeNote: "以下為開始持續委託薪資計算或勞務支援時的標準流程。僅委託入離職手續等單次業務時，會依內容採取必要步驟。單次委託並非一律需要簽訂顧問契約，或導入freee與LINE打卡。",
  scheduleNote: "具體時程與進行方式，會在確認委託內容及資料準備情況等事項後說明，不保證特定完成日期或成果。",
  banner: {
    eyebrow: "給初次諮詢的您",
    heading: "諮詢與委託流程",
    paragraphs: [
      "從初次諮詢，到日常運作與持續改善。代表了解事業情況後，與負責人員共同進行文件整理、freee人事勞務與LINE打卡設定、測試及正式運作。",
      "也接受從公司設立或尋找店面延伸的諮詢。依據過往經過與共通的基本資料，整理所需準備。",
    ],
    note: "僅委託手續時，會採取必要步驟。軟體等的導入與設定，依委託內容另行說明。",
    ctaLabel: "查看從諮詢到啟動運作的8個步驟",
    groups: [
      { label: "諮詢與報價", stepRange: "STEP 1–3" },
      { label: "資料共享與初期設定", stepRange: "STEP 4–5" },
      { label: "測試與正式運作", stepRange: "STEP 6–7" },
      { label: "回顧與改善", stepRange: "STEP 8" },
    ],
  },
  labels: {
    breadcrumb: "社勞士服務首頁",
    toc: "本頁目錄",
    steps: "從諮詢開始的8個步驟",
    outcome: "本階段確認的事項",
    clientAction: "需要您協助的事項",
    cases: "諮詢起點的例子",
    materials: "共通資料與事業背景",
    information: "職責分工與資料處理",
    faq: "常見問題",
    representative: "代表介紹",
    companyRole: "公司的職責",
    officeRole: "四葉的職責",
  },
  steps: [
    {
      id: "step-1",
      title: "聯絡諮詢",
      paragraphs: [
        "您可透過介紹、網站諮詢表單、LINE、電話，或ミツモア、ゼヒトモ等媒合平台聯絡我們。",
        "請告訴我們目前的情況，例如「首次聘用員工」「只想委託薪資計算」「不清楚公司設立後需要辦理哪些手續」。初次聯絡時不必備齊所有文件。若已確定到職日、首次發薪日等時程，也請一併告知。",
      ],
      outcome: "希望諮詢的內容，以及初次訪談的日期。",
      clientAction: "告知目前的困擾、希望的聯絡方式，以及已知的計畫與期限。",
    },
    {
      id: "step-2",
      title: "由代表進行訪談",
      paragraphs: [
        "代表浦松丈二會了解事業內容、目前的人員配置、未來招募或開店計畫，以及薪資與出勤的管理方式。",
        "除了確認所委託的手續，也會了解其目的及與其他準備工作的關係。若諮詢始於公司設立或尋找店面，亦會依據過往經過，進行必要確認。",
      ],
      outcome: "問題整理、優先順序，以及委託範圍的初步方案。",
      clientAction: "說明目前的工作方式，以及希望調整與希望保留的部分。",
    },
    {
      id: "step-3",
      title: "報價、提案與負責人確認",
      paragraphs: [
        "我們會提出所需業務及進行方式，並在開始工作前，以書面說明初期費用、持續發生的費用，以及需要另行報價的業務。同時明確區分由公司執行及由四葉負責的工作。",
        "通常由1名負責人員與代表共同服務。我們會告知日常聯絡窗口，以及負責確認與專業判斷的人員。若委託內容需要不同的服務安排，也會事先說明。",
        "在您同意內容並確認契約後，才開始準備。",
      ],
      outcome: "報價單、契約內容、服務人員安排及職責分工。",
    },
    {
      id: "step-4",
      title: "建立雲端共享資料夾",
      paragraphs: [
        "為整理必要文件及申報副本，我們會建立雲端共享資料夾。清楚標示已提交資料、後續所需資料及確認中的事項，減少尋找或重複寄送資料的負擔。",
        "限制可閱覽與編輯的人員，並依薪資、員工資料等內容，分開設定儲存位置與權限。我們也會說明使用方式，並確認各項資料由誰負責檢查。",
      ],
      outcome: "資料存放位置、提交狀態的管理方式，以及閱覽與編輯權限。",
      clientAction: "確認公司端的聯絡人，以及可閱覽資料的人員。",
    },
    {
      id: "step-5",
      title: "確認時程與必要文件，建立日常運作基礎",
      paragraphs: [
        "確認到職日、必要手續、出勤結算日及發薪日等事項，決定「由誰、在何時之前、準備什麼」。依公司與員工的情況整理必要文件，確認尚缺的資料。",
        "持續支援中導入的freee人事勞務，會設定公司與員工資料、薪資制度、工作時間、津貼及核准流程等。LINE打卡也會配合實際工作方式準備。",
        "不只是讓軟體可以使用，也會安排資料提交、確認、修正到核准的流程，讓日常業務能夠運作。",
      ],
      outcome: "導入時程、必要文件清單、設定內容，以及每月職責分工。",
      clientAction: "提供必要的公司與員工資料，確認工作條件、薪資條件及核准人。",
      items: ["招募與手續時程", "必要文件", "薪資結算日與發薪日", "freee人事勞務", "LINE打卡", "確認與核准方式"],
    },
    {
      id: "step-6",
      title: "測試與調整",
      paragraphs: [
        "正式啟用前，先測試從打卡、出勤確認、薪資計算到核准的流程。確認工作時間及津貼是否如預期反映、負責人能否查看必要畫面與資料，以及資料交接方式是否可行。",
        "若有難以理解的操作或不符預期的設定，會進行調整，並與您確認正式啟動的條件。",
      ],
      outcome: "測試結果、修正事項，以及正式啟動前的確認。",
      clientAction: "試行公司端負責的操作、確認及核准，並告知發現的問題。",
    },
    {
      id: "step-7",
      title: "正式運作",
      paragraphs: [
        "依已確認的時程開始實際業務。公司根據員工打卡紀錄及人事資料，確認並確定出勤資料，四葉則確認薪資計算內容。薪資計算結果經公司最終核准後才予以確定。",
        "入離職等手續依契約範圍辦理，並共享申報副本及進度。首次運作中出現的疑問或變更，也會逐一確認。",
      ],
      outcome: "首次業務完成確認、每月聯絡與確認的節奏，以及申報副本的共享。",
      roles: [
        { label: "公司的職責", body: "提供人事資料，確認、修正及確定出勤資料，並最終核准薪資計算結果。" },
        { label: "四葉的職責", body: "確認必要資料，辦理契約範圍內的薪資計算與手續，共享副本及進度。" },
      ],
    },
    {
      id: "step-8",
      title: "回顧與改善（PDCA）",
      paragraphs: [
        "有些問題只有實際運作後才會發現。例如容易漏打卡、資料備齊時間較晚，或招募增加使目前的方式難以應付。我們會回顧工作現場發生的情況。",
        "規劃、執行、檢查結果，再進行改善。透過反覆調整，讓人事勞務運作更符合公司的情況。檢討範圍與諮詢方式，依契約內容說明。",
      ],
      outcome: "改善項目、需要調整的步驟，以及接下來處理的問題。",
    },
  ],
  cases: {
    heading: "也可以從公司設立或尋找店面開始諮詢。",
    intro: "最初的諮詢不一定屬於社勞士業務。設立公司、租用店面、首次聘用員工，在事業準備推進的過程中，可能逐漸出現新的人事勞務問題。",
    note: "以下為說明諮詢起點與進行方式的一般化例子，並非特定客戶的案例或成果。",
    items: [
      {
        title: "從公司設立諮詢，延伸至招募、社會保險與薪資準備",
        paragraphs: [
          "向四葉行政書士事務所諮詢公司設立支援後，可能進一步需要準備事業開始後的招募、社會保險及薪資計算。",
          "我們會依公司營業目的、組織與未來計畫，整理必要的勞務準備。行政書士的章程製作等支援，與社會保險勞務士的勞務支援，分別作為各自的業務進行。若需要設立登記，會另行說明司法書士等專業人員的負責範圍。",
        ],
        flow: "公司設立諮詢 → 確認事業與招募計畫 → 勞務委託與導入準備。",
      },
      {
        title: "從店面介紹，延伸至開店前的僱用準備",
        paragraphs: [
          "向四葉不動産株式会社諮詢尋找店面後，也可能延伸至開店時的招募、勞動條件、出勤管理與薪資計算。",
          "考量預定開店日、營業時間及人員計畫等情況，整理店面準備與迎接員工的時程。不動產仲介由不動產公司負責，人事勞務則由社勞士事務所負責。",
        ],
        flow: "店面諮詢 → 確認開店與招募計畫 → 勞務委託與導入準備。",
      },
      {
        title: "直接諮詢入離職手續或薪資計算單項委託",
        paragraphs: [
          "即使未委託公司設立或尋找店面，也歡迎直接諮詢。您可從需要的業務開始，例如「只辦1名員工的入職手續」或「每月只委託薪資計算」。",
          "先決定委託範圍，整理必要文件及確認方式。若另行增加持續勞務諮詢等業務，也會重新說明內容與費用。",
        ],
      },
    ],
    separationNote: "四葉不動産株式会社、四葉行政書士事務所、四葉社会保険労務士事務所為各自獨立的事業主體，分別承接業務、簽訂契約並計費。您可以只委託所需部分。若同時使用其他專業人員或業者的服務，也會確認職責分工。",
  },
  materials: {
    heading: "不只看文件，也理解背後的情況。",
    emphasis: "盡量減少重複說明與提交相同資料。",
    paragraphs: [
      "公司設立、店面契約與人事勞務，會共通確認公司概要、事業內容、營業場所地址、代表人資料、章程及設立後的登記事項等基本文件與資訊。",
      "確認已整理的內容，並適當運用必要資料，有助於盡量減少重複說明與重新提交。若資料已變更，或文件需要再次確認，會逐次告知。",
      "更重要的是，了解您希望經營什麼樣的事業，以及準備在何時、何地、以何種方式迎接員工。掌握文件背後的情況，能提前整理必要確認與準備，讓服務更順暢、準確。",
    ],
    sharingNote: "資料的使用與共享，須先確認使用目的、共享對象及必要同意等事項，並限於業務所需範圍。並非所有資料都可在集團內自由共享。",
    columns: ["類別", "文件與資訊例子", "處理方式"],
    rows: [
      { category: "共通確認的基本文件與資訊", examples: "公司概要、事業內容、地址、章程、設立後的登記事項", handling: "確認必要性、最新狀態與使用目的等後運用" },
      { category: "勞務業務所需資料", examples: "勞動條件、員工資料、出勤、薪資資料", handling: "限制負責人員與使用範圍" },
      { category: "需要特別謹慎處理的資訊", examples: "My Number個人編號、健康資訊等", handling: "依資訊種類另行說明保管與提供方式" },
    ],
    note: "上述例子不代表每項委託都須提交所有資料。My Number個人編號、健康資訊及整套薪資資料，請勿透過一般諮詢表單或LINE傳送，請使用我們另行說明的交接方式。",
  },
  information: {
    heading: "資料處理與專業確認體制",
    paragraphs: [
      "我們會指定資料負責人與閱覽權限，並依資訊種類區分交接方式。薪資、社會保險等確認與判斷，由代表社會保險勞務士負責。我們不會將客戶個人資訊輸入生成式AI。",
    ],
    judgmentNote: "本頁提供一般流程說明。個別情況的法律判斷，需要具備相應資格的專業人員確認。",
  },
  faqs: [
    { q: "諮詢前需要備齊所有文件嗎？", a: "不需要。請先告訴我們目前的情況及希望委託的業務。訪談後會整理必要文件，說明提交方式。若已確定到職日或發薪日等時程，也請一併告知。" },
    { q: "提出諮詢就等於簽約嗎？", a: "不會只因諮詢就成立委託。我們會說明業務範圍、費用與服務人員安排，確認契約內容後才開始準備。若需要付費調查或作業，也會在開始前說明。" },
    { q: "代表與負責人員如何提供服務？", a: "初次訪談由代表進行，通常由1名負責人員與代表共同服務。我們會告知日常聯絡窗口，以及負責確認與專業判斷的人員，並依委託內容說明服務安排。" },
    { q: "只委託手續，也需要導入freee或LINE打卡嗎？", a: "並非一律需要。僅委託手續時，主要進行必要文件的確認與交接。若持續委託薪資計算等業務，會確認契約範圍與目前運作方式，再說明導入及設定安排。" },
    { q: "公司設立或店面諮詢時已提交的文件，需要再交一次嗎？", a: "會先確認使用目的與共享範圍等事項，適當運用必要的基本資料，盡量減少重複提交。但因內容變更、文件有效性或各項手續的要求，仍可能需要再次確認或補充資料。" },
    { q: "行政書士與不動產業務也包含在同一契約與費用中嗎？", a: "不包含。各事業主體分別承接業務、簽訂契約並計費，您可只委託所需部分。若登記、稅務等業務由其他專業人員負責，也會說明職責分工。" },
  ],
  cta: {
    primary: "聯絡諮詢與報價",
    pricing: "查看費用與委託範圍",
    note: "即使還在公司設立或尋找店面的階段，或尚不清楚需要哪些手續，也歡迎諮詢。",
    representativeLabel: "認識代表 浦松丈二",
  },
};

const ZH: WorkflowCopy = {
  pageTitle: "咨询与委托流程",
  metaTitle: "咨询与委托流程｜四葉社会保険労務士事務所",
  metaDescription: "介绍从咨询、代表访谈、报价、负责人确认、资料共享、freee人事劳务与LINE打卡设置，到测试、正式运行及改善的8个步骤。从公司设立或寻找店铺开始的咨询，也会结合业务背景整理所需准备。",
  lead: "从初次咨询，到日常运行与持续改善。",
  intro: [
    "四葉社会保険労務士事務所由代表先听取您的说明，梳理业务内容、招聘计划与目前遇到的问题。确认报价与服务人员安排后，经过资料共享、运行准备及测试，再开始实际业务。",
    "服务不止于启动。我们会回顾实际运行中发现的问题，根据公司的情况调整工作方式。",
  ],
  scopeNote: "以下为开始持续委托薪资计算或劳务支持时的标准流程。仅委托入离职手续等单次业务时，会根据内容采用必要步骤。单次委托并非一律需要签订顾问合同，或引入freee与LINE打卡。",
  scheduleNote: "具体时间安排与进行方式，会在确认委托内容及资料准备情况等事项后说明，不保证特定完成日期或成果。",
  banner: {
    eyebrow: "致初次咨询的您",
    heading: "咨询与委托流程",
    paragraphs: [
      "从初次咨询，到日常运行与持续改善。代表了解业务情况后，与负责人员共同进行文件整理、freee人事劳务与LINE打卡设置、测试及正式运行。",
      "也接受从公司设立或寻找店铺延伸的咨询。结合此前的情况与共通的基础资料，整理所需准备。",
    ],
    note: "仅委托手续时，会采用必要步骤。软件等的引入与设置，根据委托内容另行说明。",
    ctaLabel: "查看从咨询到启动运行的8个步骤",
    groups: [
      { label: "咨询与报价", stepRange: "STEP 1–3" },
      { label: "资料共享与初期设置", stepRange: "STEP 4–5" },
      { label: "测试与正式运行", stepRange: "STEP 6–7" },
      { label: "回顾与改善", stepRange: "STEP 8" },
    ],
  },
  labels: {
    breadcrumb: "社劳士服务首页",
    toc: "本页目录",
    steps: "从咨询开始的8个步骤",
    outcome: "本阶段确认的事项",
    clientAction: "需要您协助的事项",
    cases: "咨询起点的例子",
    materials: "共通资料与业务背景",
    information: "职责分工与资料处理",
    faq: "常见问题",
    representative: "代表介绍",
    companyRole: "公司的职责",
    officeRole: "四叶的职责",
  },
  steps: [
    {
      id: "step-1",
      title: "联系咨询",
      paragraphs: [
        "您可通过介绍、网站咨询表单、LINE、电话，或ミツモア、ゼヒトモ等服务匹配平台联系我们。",
        "请告诉我们目前的情况，例如“首次招聘员工”“只想委托薪资计算”“不清楚公司设立后需要办理哪些手续”。初次联系时不必备齐所有文件。如果已确定入职日、首次发薪日等时间，也请一并告知。",
      ],
      outcome: "希望咨询的内容，以及初次访谈的日期。",
      clientAction: "告知目前的困扰、希望的联系方式，以及已知的计划与期限。",
    },
    {
      id: "step-2",
      title: "由代表进行访谈",
      paragraphs: [
        "代表浦松丈二会了解业务内容、目前的人员配置、未来招聘或开店计划，以及薪资与考勤的管理方式。",
        "除了确认所委托的手续，也会了解其目的及与其他准备工作的关系。如果咨询始于公司设立或寻找店铺，也会结合此前的情况，进行必要确认。",
      ],
      outcome: "问题梳理、优先顺序，以及委托范围的初步方案。",
      clientAction: "说明目前的工作方式，以及希望调整与希望保留的部分。",
    },
    {
      id: "step-3",
      title: "报价、方案与负责人确认",
      paragraphs: [
        "我们会提出所需业务及进行方式，并在开始工作前，以书面说明初期费用、持续产生的费用，以及需要另行报价的业务。同时明确区分由公司执行及由四叶负责的工作。",
        "通常由1名负责人员与代表共同服务。我们会告知日常联系窗口，以及负责确认与专业判断的人员。如果委托内容需要不同的服务安排，也会事先说明。",
        "在您同意内容并确认合同后，才开始准备。",
      ],
      outcome: "报价单、合同内容、服务人员安排及职责分工。",
    },
    {
      id: "step-4",
      title: "建立云端共享文件夹",
      paragraphs: [
        "为整理必要文件及申报副本，我们会建立云端共享文件夹。清楚标示已提交资料、后续所需资料及确认中的事项，减少查找或重复发送资料的负担。",
        "限制可查看与编辑的人员，并根据薪资、员工资料等内容，分别设置存储位置与权限。我们也会说明使用方式，并确认各项资料由谁负责检查。",
      ],
      outcome: "资料存放位置、提交状态的管理方式，以及查看与编辑权限。",
      clientAction: "确认公司端的联系人，以及可查看资料的人员。",
    },
    {
      id: "step-5",
      title: "确认时间安排与必要文件，建立日常运行基础",
      paragraphs: [
        "确认入职日、必要手续、考勤结算日及发薪日等事项，决定“由谁、在何时之前、准备什么”。根据公司与员工的情况整理必要文件，确认尚缺的资料。",
        "持续支持中引入的freee人事劳务，会设置公司与员工资料、薪资制度、工作时间、津贴及审批流程等。LINE打卡也会配合实际工作方式准备。",
        "不只是让软件可以使用，也会安排资料提交、确认、修正到审批的流程，让日常业务能够运行。",
      ],
      outcome: "引入时间表、必要文件清单、设置内容，以及每月职责分工。",
      clientAction: "提供必要的公司与员工资料，确认工作条件、薪资条件及审批人。",
      items: ["招聘与手续时间安排", "必要文件", "薪资结算日与发薪日", "freee人事劳务", "LINE打卡", "确认与审批方式"],
    },
    {
      id: "step-6",
      title: "测试与调整",
      paragraphs: [
        "正式启用前，先测试从打卡、考勤确认、薪资计算到审批的流程。确认工作时间及津贴是否按预期反映、负责人能否查看必要界面与资料，以及资料交接方式是否可行。",
        "如果有难以理解的操作或不符合预期的设置，会进行调整，并与您确认正式启动的条件。",
      ],
      outcome: "测试结果、修正事项，以及正式启动前的确认。",
      clientAction: "试行公司端负责的操作、确认及审批，并告知发现的问题。",
    },
    {
      id: "step-7",
      title: "正式运行",
      paragraphs: [
        "按已确认的时间安排开始实际业务。公司根据员工打卡记录及人事资料，核对并确认考勤数据，四叶则确认薪资计算内容。薪资计算结果经公司最终审批后才予以确定。",
        "入离职等手续按合同范围办理，并共享申报副本及进度。首次运行中出现的疑问或变更，也会逐一确认。",
      ],
      outcome: "首次业务完成确认、每月联系与确认的节奏，以及申报副本的共享。",
      roles: [
        { label: "公司的职责", body: "提供人事资料，核对、修正并最终确认考勤数据，最终审批薪资计算结果。" },
        { label: "四叶的职责", body: "确认必要资料，办理合同范围内的薪资计算与手续，共享副本及进度。" },
      ],
    },
    {
      id: "step-8",
      title: "回顾与改善（PDCA）",
      paragraphs: [
        "有些问题只有实际运行后才会发现。例如容易漏打卡、资料备齐时间较晚，或招聘增加使目前的方式难以应对。我们会回顾工作现场发生的情况。",
        "规划、执行、检查结果，再进行改善。通过反复调整，让人事劳务运行更符合公司的情况。回顾范围与咨询方式，按合同内容说明。",
      ],
      outcome: "改善项目、需要调整的步骤，以及接下来处理的问题。",
    },
  ],
  cases: {
    heading: "也可以从公司设立或寻找店铺开始咨询。",
    intro: "最初的咨询不一定属于社劳士业务。设立公司、租用店铺、首次招聘员工，在业务准备推进的过程中，可能逐渐出现新的人事劳务问题。",
    note: "以下为说明咨询起点与进行方式的一般化例子，并非特定客户的案例或成果。",
    items: [
      {
        title: "从公司设立咨询，延伸至招聘、社会保险与薪资准备",
        paragraphs: [
          "向四葉行政書士事務所咨询公司设立支持后，可能进一步需要准备业务开始后的招聘、社会保险及薪资计算。",
          "我们会根据公司的经营目的、组织与未来计划，整理必要的劳务准备。行政书士的章程制作等支持，与社会保险劳务士的劳务支持，分别作为各自的业务进行。如需设立登记，会另行说明司法书士等专业人员的负责范围。",
        ],
        flow: "公司设立咨询 → 确认业务与招聘计划 → 劳务委托与引入准备。",
      },
      {
        title: "从店铺介绍，延伸至开店前的雇用准备",
        paragraphs: [
          "向四葉不動産株式会社咨询寻找店铺后，也可能延伸至开店时的招聘、劳动条件、考勤管理与薪资计算。",
          "结合预定开店日、营业时间及人员计划等情况，整理店铺准备与迎接员工的时间安排。不动产中介由不动产公司负责，人事劳务则由社劳士事务所负责。",
        ],
        flow: "店铺咨询 → 确认开店与招聘计划 → 劳务委托与引入准备。",
      },
      {
        title: "直接咨询入离职手续或薪资计算单项委托",
        paragraphs: [
          "即使未委托公司设立或寻找店铺，也欢迎直接咨询。您可从需要的业务开始，例如“只办1名员工的入职手续”或“每月只委托薪资计算”。",
          "先确定委托范围，整理必要文件及确认方式。如另行增加持续劳务咨询等业务，也会重新说明内容与费用。",
        ],
      },
    ],
    separationNote: "四葉不動産株式会社、四葉行政書士事務所、四葉社会保険労務士事務所为各自独立的经营主体，分别承接业务、签订合同并计费。您可以只委托所需部分。如果同时使用其他专业人员或服务商，也会确认职责分工。",
  },
  materials: {
    heading: "不只看文件，也理解背后的情况。",
    emphasis: "尽量减少重复说明与提交相同资料。",
    paragraphs: [
      "公司设立、店铺合同与人事劳务，会共同确认公司概况、业务内容、营业场所地址、代表人资料、章程及设立后的登记事项等基础文件与信息。",
      "确认已整理的内容，并适当使用必要资料，有助于尽量减少重复说明与重新提交。如果信息已变更，或文件需要再次确认，会逐次告知。",
      "更重要的是，了解您希望经营什么样的业务，以及准备在何时、何地、以何种方式迎接员工。掌握文件背后的情况，能提前梳理必要确认与准备，让服务更顺畅、准确。",
    ],
    sharingNote: "资料的使用与共享，须先确认使用目的、共享对象及必要同意等事项，并限于业务所需范围。并非所有资料都可在集团内自由共享。",
    columns: ["类别", "文件与信息例子", "处理方式"],
    rows: [
      { category: "共同确认的基础文件与信息", examples: "公司概况、业务内容、地址、章程、设立后的登记事项", handling: "确认必要性、最新状态与使用目的等后使用" },
      { category: "劳务业务所需资料", examples: "劳动条件、员工资料、考勤、薪资资料", handling: "限制负责人员与使用范围" },
      { category: "需要特别谨慎处理的信息", examples: "My Number个人编号、健康信息等", handling: "根据信息种类另行说明保管与提供方式" },
    ],
    note: "上述例子不代表每项委托都须提交所有资料。My Number个人编号、健康信息及整套薪资资料，请勿通过一般咨询表单或LINE发送，请使用我们另行说明的交接方式。",
  },
  information: {
    heading: "资料处理与专业确认机制",
    paragraphs: [
      "我们会指定资料负责人与查看权限，并根据信息种类区分交接方式。薪资、社会保险等确认与判断，由代表社会保险劳务士负责。我们不会将客户个人信息输入生成式AI。",
    ],
    judgmentNote: "本页提供一般流程说明。个别情况的法律判断，需要具备相应资格的专业人员确认。",
  },
  faqs: [
    { q: "咨询前需要备齐所有文件吗？", a: "不需要。请先告诉我们目前的情况及希望委托的业务。访谈后会整理必要文件，说明提交方式。如果已确定入职日或发薪日等时间，也请一并告知。" },
    { q: "提出咨询就等于签约吗？", a: "不会仅因咨询就成立委托。我们会说明业务范围、费用与服务人员安排，确认合同内容后才开始准备。如果需要付费调查或作业，也会在开始前说明。" },
    { q: "代表与负责人员如何提供服务？", a: "初次访谈由代表进行，通常由1名负责人员与代表共同服务。我们会告知日常联系窗口，以及负责确认与专业判断的人员，并根据委托内容说明服务安排。" },
    { q: "只委托手续，也需要引入freee或LINE打卡吗？", a: "并非一律需要。仅委托手续时，主要进行必要文件的确认与交接。如果持续委托薪资计算等业务，会确认合同范围与目前运行方式，再说明引入及设置安排。" },
    { q: "公司设立或店铺咨询时已提交的文件，需要再交一次吗？", a: "会先确认使用目的与共享范围等事项，适当使用必要的基础资料，尽量减少重复提交。但因内容变更、文件有效性或各项手续的要求，仍可能需要再次确认或补充资料。" },
    { q: "行政书士与不动产业务也包含在同一合同与费用中吗？", a: "不包含。各经营主体分别承接业务、签订合同并计费，您可只委托所需部分。如果登记、税务等业务由其他专业人员负责，也会说明职责分工。" },
  ],
  cta: {
    primary: "联系咨询与报价",
    pricing: "查看费用与委托范围",
    note: "即使还在公司设立或寻找店铺的阶段，或尚不清楚需要哪些手续，也欢迎咨询。",
    representativeLabel: "了解代表 浦松丈二",
  },
};

export const LABOR_WORKFLOW_COPY: Record<LangCode, WorkflowCopy> = {
  ja: JA,
  en: EN,
  "zh-tw": ZH_TW,
  zh: ZH,
};
