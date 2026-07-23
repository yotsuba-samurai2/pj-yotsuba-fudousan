import Image from "next/image";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import {
  Home,
  Building2,
  Layers,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { SHARED_ORG_INFO } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { getColumns, getLocalizedColumn, filterColumnsByTheme } from "@/lib/columns";
import { RelatedColumnsSection } from "@/components/column/RelatedColumnsSection";
import { CannotHandle } from "@/components/shared/CannotHandle";
import type { LangCode } from "@/config/languages";

/**
 * /group-home 本文（グループホーム開設ピラー「文京区でグループホームを開設するなら」）
 *
 * 実装メモ:
 * - 静的実装（useTranslation()・Firestore呼び出しなし）。
 *   方式＝COPY: Record<LangCode,…>＋getRequestLocale（手本=souzoku/SouzokuPageContent.tsx）。server componentのまま。
 * - en/zh-tw/zh=監修前ドラフト（2026-07-18）。jaの表示文言・数値は正本（居室7.43㎡・障害支援区分4以上8割以下・準備3〜6か月）。
 *   繁体=台湾定訳（障礙福祉・共同生活援助・不動產・文京區＝(legal)/legal/services/shogai-fukushi・visa 既訳準拠）／zh=大陸表記。
 *   法令名・制度名（共同生活援助・障害支援区分・消防法施行令・建築基準法・障害者グループホーム整備費等補助）は既訳にならい字体変換。
 * - FAQは疑問文H2＋<details>アコーディオン（JS不要・SSGでも全文がDOMに載る）。
 *   faqItems（COPY[locale].faqItems）は FAQJsonLd と表示の両方で使う単一ソース＝ロケールごとに一致を維持。
 * - JSON-LDは既存3種（Article・FAQPage・Breadcrumb）のみ＝新規出力しない。構造・日付は不変、文字列のみロケール別。
 * - 独自性の核＝「物件（不動産）×指定申請（行政手続）を同一窓口」。他士業をサイト前面で宣伝せず、
 *   労務・雇用助成金（社労士の業務範囲）は「連携する専門家」と一般化。特定事務所名は出さない。
 * - 断定・効果保証はしない。数値・法令は「2026年7月時点の一般情報・最新は自治体窓口で確認」を注記。
 */

type TypeCardId = "detached" | "apartment" | "satellite";
type TypeCard = { id: TypeCardId; title: string; description: string };
type FaqItem = { question: string; answer: string };
type TermItem = { term: string; desc: string };
type FlowStep = { title: string; desc: string };
type ReasonItem = { title: string; body: string };
type PitfallRow = { fail: string; happens: string; avoid: string };
type ContrastCard = { title: string; body: string };
type InternalLink = { href: string; label: string; description: string };

type GroupHomeCopy = {
  articleTitle: string;
  articleDesc: string;
  breadcrumbHome: string;
  breadcrumbCurrent: string;
  heroLabel: string;
  h1Top: string;
  h1Sub: string;
  heroLead: string;

  whyLabel: string;
  whyHeading: string;
  whyLead: string;
  whyBody: string[];
  whyContrast: ContrastCard[];

  typesLabel: string;
  typesHeading: string;
  typesLead: string;
  typeCards: TypeCard[];

  criteriaLabel: string;
  criteriaHeading: string;
  criteriaLead: string;
  criteriaItems: TermItem[];
  criteriaNote: string;

  flowLabel: string;
  flowHeading: string;
  flowLead: string;
  flowSteps: FlowStep[];
  flowNote: string;

  fieldLabel: string;
  fieldHeading: string;
  fieldLead: string;
  fieldReasons: ReasonItem[];
  bunkyoTitle: string;
  bunkyoBody: string;
  bunkyoNote: string;
  fieldClosing: string;
  fieldQuote: string;

  checklistHeading: string;
  checklistLead: string;
  checklistItems: TermItem[];
  checklistNote: string;

  pitfallHeading: string;
  pitfallLead: string;
  pitfallColFail: string;
  pitfallColHappens: string;
  pitfallColAvoid: string;
  pitfallRows: PitfallRow[];

  subsidyLabel: string;
  subsidyHeading: string;
  subsidyBody: string[];
  subsidyNote: string;

  meritLabel: string;
  meritHeading: string;
  meritLead: string;
  meritItems: string[];

  faqLabel: string;
  faqHeading: string;
  faqItems: FaqItem[];

  internalHeading: string;
  internalLinks: InternalLink[];

  sourcesHeading: string;
  sources: string[];
  sourcesNote: string;

  repBio: string;
  repRole: string;

  ctaHeading: string;
  ctaLead: string;
  ctaLine: string;
  ctaContact: string;
  ctaLineNote: string;
};

// アイコンは構造（不変）＝COPY外でidに紐付け
const TYPE_ICONS: Record<TypeCardId, typeof Home> = {
  detached: Home,
  apartment: Building2,
  satellite: Layers,
};

const COPY: Record<LangCode, GroupHomeCopy> = {
  ja: {
    articleTitle:
      "文京区でグループホームを開設するなら——物件確保から指定申請・運営まで",
    articleDesc:
      "障害者グループホーム（共同生活援助）の開設を、物件（不動産）と指定申請（行政手続）を同時に見る視点で一つに整理した完全ガイド。3つの型、物件の指定基準（居室7.43㎡・スプリンクラー・建築基準法）、開設までの流れ、事前相談のコツまで、宅地建物取引業と行政書士業務の両方を持つ文京区小日向の四葉が解説します。",
    breadcrumbHome: "ホーム",
    breadcrumbCurrent: "グループホーム開設",
    heroLabel: "グループホーム開設ガイド",
    h1Top: "文京区でグループホームを開設するなら——",
    h1Sub: "物件確保から指定申請・運営まで",
    heroLead:
      "障害者グループホーム（共同生活援助）の開設でつまずく最大の理由は、「良い物件を見つけてから指定申請の要件に合わず、契約をやり直す」ことです。物件（不動産）と指定申請（行政手続）は、本来同時に見なければなりません。四葉は、宅地建物取引業（四葉不動産）と行政書士業務（四葉行政書士事務所）の両方を持つ数少ない事務所です。指定基準を見据えた物件選びから、法人設立・指定申請・開設後の運営まで、一つの窓口で整理します。",

    whyLabel: "独自性の核",
    whyHeading: "なぜ「物件」と「指定申請」を同時に見るのか",
    whyLead:
      "結論から言えば、グループホーム開設で最も多い失敗は、物件契約が先行し、指定基準（立地・構造・面積・消防）に合わずに解約・再工事になることです。だからこそ物件探しの段階から指定申請を織り込むのが、手戻りを防ぐ最短ルートです。",
    whyBody: [
      "グループホームは、一般の賃貸物件を借りるのとは違います。用途地域・居室面積・消防設備・建築基準法など、障害福祉サービスの指定基準に関わる確認を挟みながら物件を選ぶ必要があります。ここを飛ばして「気に入った物件を先に契約」すると、指定基準に不適合で解約や大規模改修、最悪は事業所として使えないという事態が起こり得ます。",
      "鉄則は、契約前に、区の障害福祉担当課へ図面・写真で事前相談し、関係法令への適合を確認することです。四葉は、物件探しの段階から指定基準を織り込んで進めるため、この手戻りを構造的に防げます。物件（不動産）と指定申請（行政手続）を一つの窓口で見られるからこそ、片方で得た情報がもう片方に即座に反映されます。",
    ],
    whyContrast: [
      {
        title: "物件先行の失敗ルート",
        body:
          "気に入った物件を先に契約 → 後から指定基準を確認 → 用途・面積・消防が不適合 → 解約・違約金、または大規模改修で予算とスケジュールが崩れる。",
      },
      {
        title: "四葉の同時進行ルート",
        body:
          "事業構想の段階で指定基準を共有 → 基準を織り込んで物件を選定 → 契約前に区へ事前相談 → 適合を確認してから契約 → 手戻りなく指定申請へ。",
      },
    ],

    typesLabel: "3つの型",
    typesHeading: "グループホームの3つの型",
    typesLead:
      "共同生活援助の住まいの形は、大きく3つに分けられます。どの型が合うかは、入居者像・物件・地域によって変わります。物件選びの勘所（四葉不動産の視点）とあわせて検討します。",
    typeCards: [
      {
        id: "detached",
        title: "戸建て型",
        description:
          "一軒家を活用する形です。共用のリビングや食堂を確保しやすく、家庭的な雰囲気を作りやすいのが特徴です。用途変更や消防設備の要否は、建物の規模・入居者像によって変わるため、契約前の確認が欠かせません。",
      },
      {
        id: "apartment",
        title: "アパート型（本体住居）",
        description:
          "アパートやマンションの複数戸・一棟を本体住居として使う形です。居室の独立性を保ちやすい一方、居室面積（原則7.43㎡以上）や消防設備の要件を各戸で満たす必要があります。既存の集合住宅を転用する際は用途・構造の適合確認が要点です。",
      },
      {
        id: "satellite",
        title: "サテライト型",
        description:
          "本体住居に付随する形で、近隣アパートの一室などを使う型です。一人暮らしに近い環境を段階的に整えたい場合の選択肢になります。本体との距離・支援体制の要件があり、物件選びは本体住居とセットで考えます。",
      },
    ],

    criteriaLabel: "契約前チェック",
    criteriaHeading: "物件の指定基準（契約前に確認したいこと）",
    criteriaLead:
      "物件が指定基準に合うかは、契約前に確認するのが鉄則です。代表的な確認項目は次のとおりです（いずれも2026年7月時点の一般情報。基準は改正され、自治体・事業類型により運用が異なります）。",
    criteriaItems: [
      {
        term: "居室面積",
        desc:
          "入居者一人あたり原則7.43㎡以上（収納部分を除く）とされています。都道府県・指定権者が別途定める場合があるため、指定を受ける自治体での確認が必要です。",
      },
      {
        term: "立地",
        desc:
          "住宅地として利用される地域にあること等が求められます。用途地域の確認も含め、区の窓口で候補物件が適合するかを事前に相談します。",
      },
      {
        term: "消防設備",
        desc:
          "原則としてスプリンクラーの設置義務があります（平成27年4月の消防法施行令改正で面積要件が撤廃）。ただし、避難が困難な入居者（障害支援区分4以上）の割合が全体の8割以下等の条件で緩和される場合があります。自動火災報知設備・消防機関への通報装置も要件です。入居者像で変わるため管轄消防署への事前相談が要点です。",
      },
      {
        term: "建築基準法",
        desc:
          "建物の用途・構造の適合が前提です。既存建物を転用する場合、用途変更や確認申請が必要になることがあります。区の建築部署への事前相談で確認します。",
      },
    ],
    criteriaNote:
      "※基準は改正されます。着手前に必ず管轄自治体・消防署・建築部署で最新の内容をご確認ください。本ガイドは2026年7月時点の一般的な情報であり、個別の可否を判断・保証するものではありません。",

    flowLabel: "開設までの流れ",
    flowHeading: "開設までの流れ（法人設立→指定申請→運営）",
    flowLead:
      "一般的な準備期間は3〜6か月が目安です。物件と指定申請を同時に見ることで、この期間の手戻りを減らせます。",
    flowSteps: [
      {
        title: "事業構想・法人設立",
        desc: "会社・NPO・社会福祉法人等の法人格を用意します。法人設立の手続きは連携する専門家と進めます。",
      },
      {
        title: "東京都の説明会参加",
        desc: "指定の前提となる説明会に参加します。日程は早めに把握し、開設希望日から逆算します。",
      },
      {
        title: "物件確保（指定基準を織り込んで）",
        desc: "四葉不動産が、指定基準（立地・面積・消防）を見据えて物件を選定します。ここが独自性の核です。",
      },
      {
        title: "区・消防・建築部署への事前相談",
        desc: "候補物件の図面・写真をもとに、用途・構造・面積・消防の適合を契約前に確認します。",
      },
      {
        title: "人員配置の準備",
        desc: "サービス管理責任者・世話人・生活支援員など、必要な人員体制を整えます。",
      },
      {
        title: "指定申請書類の作成・提出",
        desc: "四葉行政書士事務所が、指定申請の書類作成・提出をサポートします。",
      },
      {
        title: "指定・開設・運営",
        desc: "指定を受けて開設。開設後の変更届・更新なども継続してご相談いただけます。",
      },
    ],
    flowNote:
      "※手続きの詳細・順序は、指定権者や事業類型により異なります。最新の運用は開設地の自治体窓口でご確認ください。",

    fieldLabel: "現場の実感",
    fieldHeading:
      "自治体との「対話」が、実は開設の最短ルート",
    fieldLead:
      "グループホーム開設で、書類の作り方より大切なことがあります。自治体の担当者と、一つひとつ丁寧にコミュニケーションを続けることです。遠回りに見えて、これが結局いちばんの早道です。その理由は3つあります。",
    fieldReasons: [
      {
        title: "1. 自治体によって、対応は微妙に違う。",
        body:
          "同じ「共同生活援助」でも、指定権者（都道府県・市・特別区）によって、求められる書類の細かさ、事前相談のタイミング、物件要件の運用が少しずつ異なります。国の基準は共通でも、その運用の「幅」の中で担当自治体が何を重視するかは、実際に聞いてみないと分かりません。「よそではこう言われた」が通じないことがあるのです。だからこそ、開設地を決めたら、まずその自治体の担当課と関係を作ることから始めます。",
      },
      {
        title: "2. メールは記録に残る。でも、重要なニュアンスは電話か対面で。",
        body:
          "担当者とのやりとりは、メールが中心になります。言った言わないを避け、確認事項を記録に残せるからです。ただし、判断の分かれる論点、物件が要件に合うかどうかの微妙なライン、「これは大丈夫でしょうか」と一言確認したい場面——こうした重要なニュアンスは、電話か対面でなければ伝わりません。文字だけでは、相手も断定を避けて慎重な回答になりがちです。顔が見える関係の中でこそ、一歩踏み込んだ言葉が返ってきます。",
      },
      {
        title: "3. 記者時代に学んだこと。",
        body:
          "代表の浦松は、元・新聞記者です。取材とは、相手の懐に入り、事実を一つずつ確かめ、机上の想定が現場で裏返る瞬間に立ち会う仕事でした。行政手続きも、実は同じです。要綱を読むだけでは分からない「その自治体の実務」を、担当者との対話から引き出す。この姿勢が、手戻りのない開設につながります。",
      },
    ],
    bunkyoTitle:
      "実例：文京区には、区独自の基準・補助制度がある。だから事前確認が欠かせない。",
    bunkyoBody:
      "これは抽象論ではありません。四葉の地元・文京区が、まさにその実例です。文京区は、国の共同生活援助の枠組みに加えて、区独自の補助制度（障害者グループホーム整備費等補助、精神障害者グループホーム運営費補助金交付要綱など）を持っています。区独自の制度がある以上、その適用要件・対象・手続きは、区の窓口で事前に確認しなければ分かりません。相談は、福祉部障害福祉課の障害者施設担当（施設・整備担当／文京シビックセンター9階）が窓口です。市区町村との相談は「関係機関相談状況確認書及び議事録」として記録され、後の東京都への指定申請の添付書類になります——つまり、事前相談そのものが手続きの一部です。「東京都の基準を満たせばよい」ではなく、「文京区では、文京区の運用と補助制度を、早い段階で確認する」。これが手戻りを防ぐ出発点です。",
    bunkyoNote:
      "※区の制度・要件は改正されます。最新の適用可否は必ず区窓口でご確認ください。本ガイドは2026年7月時点の一般的な情報です。",
    fieldClosing:
      "四葉は、物件探しの段階から、この自治体との対話を織り込んで進めます。「物件を押さえてから相談」ではなく、「相談しながら物件を選ぶ」。だから、契約のやり直しや、指定申請の差し戻しを構造的に減らせるのです。",
    fieldQuote:
      "補足：この「丁寧な対話」の姿勢は、物件（不動産）と指定申請（行政手続）を一つの窓口で見る四葉の強みと、そのまま噛み合います。窓口が分かれていると、自治体から得た微妙なニュアンスが、不動産側と行政書士側で共有されません。一つの窓口だからこそ、担当者との一回の電話が、物件選びにも申請書類にも同時に反映されます。",

    checklistHeading: "事前相談で確認しておきたいこと（実務チェックリスト）",
    checklistLead:
      "物件を契約する前、そして指定申請に入る前に、自治体の窓口で確認しておくと手戻りが減る項目です。四葉は、この確認を代表が同席・代行しながら進めます。",
    checklistItems: [
      {
        term: "区独自の基準・補助制度",
        desc: "文京区の整備費補助・運営費補助の対象・要件・締切（区独自制度は年度で変わります）。",
      },
      {
        term: "物件の適合性",
        desc: "候補物件の図面・写真を見せ、用途・構造・面積・立地が要件に合うか（契約前が鉄則）。",
      },
      {
        term: "消防",
        desc: "スプリンクラー・自動火災報知設備・通報装置の要否（入居者の障害支援区分の見込みで変わります）。管轄消防署への事前相談のタイミング。",
      },
      {
        term: "建築",
        desc: "用途変更の要否、確認申請の要否（区の建築部署へ）。",
      },
      {
        term: "記録の残し方",
        desc: "相談内容が「関係機関相談状況確認書及び議事録」としてどう残るか（後の指定申請の添付書類になります）。",
      },
      {
        term: "スケジュール",
        desc: "東京都の説明会の日程、指定申請の受付時期、開設希望日から逆算した提出期限。",
      },
    ],
    checklistNote:
      "これらは「メールで一度に全部聞く」より、要点を電話・対面で確認し、結論をメールで残すのが確実です。担当者も、対面のほうが踏み込んだ回答をくれます。",

    pitfallHeading: "よくある手戻りと、その回避",
    pitfallLead:
      "実際に起きやすい手戻りと、四葉の回避法を対比で整理しました。",
    pitfallColFail: "よくある失敗",
    pitfallColHappens: "何が起きるか",
    pitfallColAvoid: "四葉の回避法",
    pitfallRows: [
      {
        fail: "良い物件を見つけて即契約",
        happens: "指定基準に不適合で解約・違約金、または大規模改修",
        avoid: "契約前に区へ図面確認。指定基準を織り込んで物件選定",
      },
      {
        fail: "「他区ではOKだった」で進める",
        happens: "文京区の運用・独自制度に合わず差し戻し",
        avoid: "開設地の区で必ず事前確認。区独自制度を早期に把握",
      },
      {
        fail: "メールだけで判断を仰ぐ",
        happens: "慎重な回答しか得られず、可否が曖昧なまま進行",
        avoid: "重要論点は電話・対面で確認し、結論を記録に残す",
      },
      {
        fail: "物件担当と申請担当が別",
        happens: "窓口で得たニュアンスが共有されず二度手間",
        avoid: "物件×指定申請を同一窓口（四葉）で一元管理",
      },
    ],

    subsidyLabel: "補助金・資金",
    subsidyHeading: "補助金・資金の全体像",
    subsidyBody: [
      "文京区には、区独自の整備費補助・運営費補助の制度があり、対象・要件・締切は年度で変わります。まずは区窓口で最新の適用可否を確認します。事業計画書の作成は、元記者の「伝わる書き方」でサポートします。",
      "なお、補助金（行政書士の業務範囲）と、雇用に関わる助成金（社会保険労務士の業務範囲）は別物です。労務・雇用助成金については、連携する専門家をご案内します。",
    ],
    subsidyNote:
      "※補助金・助成金の制度内容・適用可否は年度や状況で変わります。最新は各窓口でご確認ください。本ガイドは2026年7月時点の一般的な情報です。",

    meritLabel: "四葉のメリット",
    meritHeading: "四葉に相談するメリット",
    meritLead:
      "グループホーム開設を、物件と手続きの両面から一つの窓口で整理できるのが四葉の特徴です。",
    meritItems: [
      "物件（不動産）と許認可（指定申請）を同一窓口で一元管理できる",
      "宅地建物取引業と行政書士業務の「二枚看板」——基準を織り込んだ物件選びと申請支援を両立",
      "中国語・英語に対応——外国人の福祉起業のご相談にも応じます",
      "文京区小日向・茗荷谷駅から徒歩約5分の地元事務所。区の運用・独自制度に近い距離で伴走",
    ],

    faqLabel: "FAQ",
    faqHeading: "グループホーム開設、よくある疑問",
    faqItems: [
      {
        question: "物件を先に契約してしまいました。大丈夫ですか？",
        answer:
          "まずは慌てずご相談ください。ただし、指定基準（立地・構造・面積・消防）に合わない物件だと、大規模な改修が必要になったり、最悪は事業所として使えず解約、ということもあり得ます。だからこそ契約前の確認が鉄則です。すでに契約済みでも、現状を区の窓口で確認し、使える方向を一緒に探します。",
      },
      {
        question: "マンションの一室でも開設できますか？",
        answer:
          "型によります。戸建て型・アパート型（本体住居）のほか、本体住居に付随する「サテライト型」としてアパートの一室を使う形もあります。ただし用途・構造・面積・消防・建築基準法の適合が前提です。区の障害福祉担当課と建築・消防に事前相談して、その物件で可能かを確認します。",
      },
      {
        question: "スプリンクラーは必ず要りますか？",
        answer:
          "原則は設置義務です（平成27年4月の消防法施行令改正で面積要件が撤廃されました）。ただし、避難が困難な入居者（障害支援区分4以上）の割合が全体の8割以下等の条件では、設置せずに開設できる場合があります。入居者像によって変わるため、管轄消防署への事前相談で確認します。",
      },
      {
        question: "開設までどのくらいかかりますか？",
        answer:
          "一般的に3〜6か月が目安です。法人設立、東京都の説明会参加、物件確保、区・消防・建築への事前相談、人員確保、指定申請と、順に進めます。物件と指定申請を同時に見ると、この期間の手戻りを減らせます。",
      },
      {
        question: "外国人でもグループホーム事業を始められますか？",
        answer:
          "可能です。法人設立・在留資格（経営管理ビザ等）・指定申請が絡む場合も、四葉は行政書士業務と不動産の両面で対応し、中国語・英語での相談にも応じます。要件は個別に整理が必要なので、まずはご相談ください。",
      },
      {
        question: "補助金は使えますか？",
        answer:
          "文京区には区独自の整備費補助・運営費補助の制度があり、対象・要件・締切は年度で変わります。まず区窓口で最新の適用可否を確認します。事業計画書の作成は、元記者の「伝わる書き方」でサポートします。なお、雇用に関わる助成金（社会保険労務士の業務範囲）は補助金とは別で、連携する専門家をご案内します。",
      },
      {
        question: "自治体によって手続きは違いますか？",
        answer:
          "はい、微妙に違います。国の基準は共通でも、指定権者（都・市・特別区）によって、求められる書類の細かさや物件要件の運用に幅があります。文京区のように区独自の補助制度を持つ自治体もあります。だからこそ、開設地を決めたら早い段階でその自治体の担当課に相談し、対話を重ねることが最短ルートになります。",
      },
      {
        question: "自治体の担当者とは、どうやりとりすればいいですか？",
        answer:
          "記録が残るメールを基本にしつつ、判断が分かれる論点や物件の適合性など重要なニュアンスは電話・対面で確認するのが確実です。文字だけだと相手も断定を避けた慎重な回答になりがちで、踏み込んだ確認が得にくいためです。丁寧な対話を重ねることが、結局いちばんの早道になります。",
      },
    ],

    internalHeading: "あわせてご覧いただきたいページ",
    internalLinks: [
      {
        href: "/toushi/group-home",
        label: "グループホームに使える物件の探し方",
        description:
          "物件視点でのグループホーム物件探しを解説。用途・立地・消防など、指定基準を見据えた探し方をご紹介します。",
      },
      {
        href: "/toushi/shitei-shinsei",
        label: "指定申請の物件要件",
        description:
          "指定申請で問われる物件要件（面積・消防・建築）を、物件確保の観点から整理しています。",
      },
      {
        href: "/legal/services/shogai-fukushi",
        label: "障害福祉サービスの指定申請（手続き詳細）",
        description:
          "四葉行政書士事務所による、共同生活援助などの指定申請手続きの詳細はこちら。",
      },
      {
        href: "/souzoku",
        label: "文京区で不動産を相続したら",
        description:
          "相続した不動産の管理・活用・売却の完全ガイド。空き家のグループホーム活用の入口にもなります。",
      },
      // ── 開設コラム（GHクラスタP1・2026-07-23公開・ja限定＝jaのCOPYのみに追加） ──
      // ハブ→スポーク導線。設計＝samurai-app/tasks/gh-column-cluster-placement-plan.md §3
      {
        href: "/legal/column/group-home-kaisetsu-nagare-tokyo-bunkyo",
        label: "コラム：開設の流れ【東京都・文京区版】",
        description:
          "法人準備から指定・開設までの7ステップと準備期間（3〜6か月）。物件と指定申請を同時に進める順番を整理しています。",
      },
      {
        href: "/legal/column/group-home-bukken-shitei-onestop",
        label: "コラム：物件と指定申請を一つの窓口で",
        description:
          "物件と手続きを別々に頼むと何が起きるか。契約前チェックの要点と、一つの窓口で進める流れを解説します。",
      },
      {
        href: "/legal/column/group-home-shobo-setsubi-sprinkler",
        label: "コラム：消防設備の要否（スプリンクラー）",
        description:
          "障害支援区分4以上の割合で変わるスプリンクラー・自動火災報知設備・通報装置の基準を、物件選びの視点で整理。",
      },
      {
        href: "/legal/column/group-home-bunkyo-ku-kaisetsu",
        label: "コラム：文京区で開設するには",
        description:
          "区の相談窓口（障害福祉課）・区独自の整備費補助・事前相談と指定申請の関係を、地元の視点でまとめています。",
      },
      {
        href: "/legal/column/group-home-kaisetsu-hiyo-zentaizo",
        label: "コラム：開設費用の全体像",
        description:
          "初期費用の内訳（法人・物件・改修/消防・什器・運転資金）と、物件条件で費用が動く理由を幅と出典で示します。",
      },
      // ── 開設コラム（GHクラスタP2・B物件系★5本・2026-07-24公開・ja限定＝jaのCOPYのみに追加） ──
      // ハブ→スポーク導線。設計＝samurai-app/tasks/gh-column-cluster-placement-plan.md §3
      {
        href: "/legal/column/group-home-bukken-sagashikata-youto-chiiki",
        label: "コラム：物件の探し方（用途地域・立地）",
        description:
          "建築基準法上「寄宿舎」として扱われる用途地域の基本と、駅距離・近隣環境など契約前に見るべき立地の確認ポイントを整理しています。",
      },
      {
        href: "/legal/column/group-home-shitei-kijun-bukken-menseki",
        label: "コラム：指定基準を満たす物件条件",
        description:
          "居室7.43㎡・入居定員・共用設備など、東京都条例に基づく数値基準を表で整理しています。",
      },
      {
        href: "/legal/column/group-home-kenchikukijunho-youto-henko",
        label: "コラム：建築基準法と用途変更の要否",
        description:
          "既存建物を転用する際に用途変更確認申請が必要になるライン（200㎡）と、確認申請が不要でも残る法適合義務を解説します。",
      },
      {
        href: "/legal/column/group-home-keiyakumae-jizen-kyogi",
        label: "コラム：契約前にやる事前協議",
        description:
          "区市町村・消防・建築部署という3つの窓口に、契約前に図面を持ち込んで確認する進め方をまとめています。",
      },
      {
        href: "/legal/column/group-home-kodate-apart-satellite-chigai",
        label: "コラム：戸建て型・アパート型・サテライト型の違い",
        description:
          "3つの住居類型の特徴と、サテライト型特有の要件（本体住居との距離・部屋数上限）を整理しています。",
      },
    ],

    sourcesHeading: "根拠・出典",
    sources: [
      "障害者の日常生活及び社会生活を総合的に支援するための法律（平成17年法律第123号）——共同生活援助（グループホーム）の位置づけ。指定基準は同法に基づく指定障害福祉サービスの事業等の人員、設備及び運営に関する基準（平成18年厚生労働省令第171号）等による。",
      "共同生活援助の居室面積は入居者一人あたり原則7.43㎡以上（収納を除く）とされる。都道府県・指定権者の条例・運用により異なる場合がある（指定を受ける自治体で要確認）。",
      "消防法施行令の改正（平成27年4月1日施行）——グループホーム等（社会福祉施設）へのスプリンクラー設備の設置に関する面積要件の撤廃。避難が困難な障害者（障害支援区分4以上）の割合等による緩和規定がある（管轄消防署で要確認）。",
      "建築基準法（昭和25年法律第201号）——建物の用途・構造の適合。既存建物の転用時は用途変更・確認申請が必要になる場合がある。",
      "文京区の区独自制度（障害者グループホーム整備費等補助、精神障害者グループホーム運営費補助金交付要綱等）——対象・要件・締切は年度により変わる（文京区福祉部障害福祉課で要確認）。",
    ],
    sourcesNote:
      "※各法令・制度の最新の内容・最終改正日は本ページ作成時点で個別に裏取りしていません（未検証）。数値・法制度は2026年7月時点の一般的な情報であり、最新は必ず管轄自治体・消防署・建築部署の窓口でご確認ください。本ページは一般的な情報の提供を目的とするもので、個別の可否判断・効果の保証を行うものではありません。",

    repBio:
      "元毎日新聞記者として国内外の現場を歩き、中国総局長を務めたのち、地元・文京区小日向で四葉不動産と四葉行政書士事務所を営んでいます。グループホーム開設のご相談は、物件（不動産）と指定申請（行政手続）、そして自治体との対話が絡み合った「整理」から始まります。取材で培った、聞いて・整理して・分かりやすく伝える力と、宅地建物取引士・行政書士としての知識を土台に、物件探しから開設後の運営まで一つの窓口で伴走します。労務・雇用助成金など専門外の場面では、連携する専門家をご案内します。",
    repRole: "代表",
    ctaHeading: "まずはお気軽にご相談ください",
    ctaLead:
      "グループホーム開設のこと、「この物件、使えますか？」の一言からで構いません。文京区小日向の事務所（茗荷谷駅から徒歩約5分・10:00〜18:00・火・水休）でも、オンラインでもご相談いただけます。",
    ctaLine: "代表のLINEで相談する",
    ctaContact: "お問い合わせ",
    ctaLineNote:
      "LINEは代表・浦松 丈二の個人アカウントに直接つながります。「この物件、グループホームに使える？」の一言からお気軽にどうぞ。",
  },

  en: {
    articleTitle:
      "Opening a Group Home in Bunkyo: From Securing a Property to Designation and Operation",
    articleDesc:
      "A complete guide that brings together how to open a group home for people with disabilities (kyodo seikatsu enjo / shared-living support), viewing the property (real estate) and the designation application (administrative procedure) at the same time. From the three home types, the designation criteria for a property (7.43 m² per room, sprinklers, the Building Standards Act), and the flow to opening, to tips for prior consultation—explained by Yotsuba in Kohinata, Bunkyo, which holds both a real estate brokerage license and gyoseishoshi practice.",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "Opening a Group Home",
    heroLabel: "Group Home Opening Guide",
    h1Top: "If you open a group home in Bunkyo, Tokyo—",
    h1Sub: "from securing a property to designation and operation",
    heroLead:
      "The single biggest reason people stumble when opening a group home for persons with disabilities (shared-living support) is 'finding a good property first, then having to redo the contract because it does not meet the designation requirements.' The property (real estate) and the designation application (administrative procedure) must, by nature, be viewed at the same time. Yotsuba is one of the few offices that holds both a real estate brokerage license (Yotsuba Real Estate) and gyoseishoshi (administrative scrivener) practice (Yotsuba Gyoseishoshi Office). From choosing a property with the designation criteria in mind, through incorporation, the designation application, and post-opening operation, we organize it all in one window.",

    whyLabel: "Our core distinction",
    whyHeading: "Why view the 'property' and the 'designation application' together",
    whyLead:
      "Put simply, the most common failure in opening a group home is signing the property contract first and then finding it does not meet the designation criteria (location, structure, floor area, fire safety), leading to cancellation or rework. That is exactly why weaving the designation application into the property search from the start is the shortest route to avoiding rework.",
    whyBody: [
      "A group home is not the same as renting an ordinary residential unit. You need to choose a property while checking matters tied to the designation criteria for welfare services for persons with disabilities—zoning, room floor area, fire-safety equipment, the Building Standards Act, and more. If you skip this and 'sign a contract for a property you like first,' you may face cancellation, large-scale renovation because it fails the criteria, or—worst case—a property that cannot be used as a business site at all.",
      "The ironclad rule is to consult the ward's disability-welfare division in advance, before signing, using drawings and photos, and confirm conformity with the relevant laws. Because Yotsuba weaves the designation criteria in from the property-search stage, we can structurally prevent this rework. Precisely because the property (real estate) and the designation application (administrative procedure) can be seen in one window, information gained on one side is immediately reflected on the other.",
    ],
    whyContrast: [
      {
        title: "The property-first failure route",
        body:
          "Sign for a property you like first → check the designation criteria later → the use, floor area, or fire safety does not conform → cancellation and penalty, or large-scale renovation that breaks the budget and schedule.",
      },
      {
        title: "Yotsuba's simultaneous route",
        body:
          "Share the designation criteria at the concept stage → select the property with the criteria built in → consult the ward before signing → confirm conformity, then sign → proceed to the designation application without rework.",
      },
    ],

    typesLabel: "Three types",
    typesHeading: "The three types of group home",
    typesLead:
      "The forms of housing for shared-living support fall broadly into three types. Which type fits depends on the residents, the property, and the area. We consider them together with the key points of property selection (Yotsuba Real Estate's perspective).",
    typeCards: [
      {
        id: "detached",
        title: "Detached-house type",
        description:
          "Using a single detached house. It is easy to secure a shared living/dining room and to create a homelike atmosphere. Whether a change of use or fire-safety equipment is required varies with the building's scale and the residents, so confirmation before signing is essential.",
      },
      {
        id: "apartment",
        title: "Apartment type (main residence)",
        description:
          "Using several units or a whole building of an apartment/condominium as the main residence. It is easier to keep each room independent, but each unit must meet the room floor-area requirement (7.43 m² or more in principle) and the fire-safety requirements. When converting an existing multi-unit building, confirming conformity of use and structure is the key point.",
      },
      {
        id: "satellite",
        title: "Satellite type",
        description:
          "A type that uses a room in a nearby apartment, attached to the main residence. It is an option when you want to build, step by step, an environment closer to living alone. There are requirements on distance from the main residence and the support structure, so the property is chosen together with the main residence.",
      },
    ],

    criteriaLabel: "Pre-contract check",
    criteriaHeading: "Designation criteria for a property (to confirm before signing)",
    criteriaLead:
      "Whether a property meets the designation criteria should, as an ironclad rule, be confirmed before signing. The representative items to check are as follows (all are general information as of July 2026; the criteria are amended, and operation differs by municipality and service type).",
    criteriaItems: [
      {
        term: "Room floor area",
        desc:
          "In principle, 7.43 m² or more per resident (excluding storage). Prefectures or designating authorities may set their own standards, so confirmation with the municipality granting the designation is necessary.",
      },
      {
        term: "Location",
        desc:
          "The property is expected to be in an area used as a residential district, among other conditions. Including a check of the zoning, we consult the ward's window in advance on whether a candidate property conforms.",
      },
      {
        term: "Fire-safety equipment",
        desc:
          "In principle there is a duty to install sprinklers (the floor-area requirement was abolished by the April 2015 amendment to the Fire Service Act Enforcement Order). However, relaxation may apply on conditions such as residents who would find evacuation difficult (disability support category 4 or higher) making up 80% or less of the total. Automatic fire alarms and a device for reporting to the fire authorities are also required. As this varies with the residents, prior consultation with the fire station having jurisdiction is the key point.",
      },
      {
        term: "Building Standards Act",
        desc:
          "Conformity of the building's use and structure is a prerequisite. When converting an existing building, a change of use or a confirmation application may be required. Confirm this through prior consultation with the ward's building division.",
      },
    ],
    criteriaNote:
      "Note: The criteria are amended. Before starting, always confirm the latest details with the municipality, fire station, and building division having jurisdiction. This guide is general information as of July 2026 and does not judge or guarantee any individual case.",

    flowLabel: "The flow to opening",
    flowHeading: "The flow to opening (incorporation → designation application → operation)",
    flowLead:
      "A typical preparation period is a rough guide of 3–6 months. By viewing the property and the designation application at the same time, you can reduce rework during this period.",
    flowSteps: [
      {
        title: "Business concept and incorporation",
        desc: "Prepare a corporate form such as a company, NPO, or social welfare corporation. Incorporation procedures are handled with our partner professionals.",
      },
      {
        title: "Attending the Tokyo Metropolitan briefing",
        desc: "Attend the briefing that is a prerequisite for designation. Grasp the schedule early and work backward from your desired opening date.",
      },
      {
        title: "Securing the property (with the criteria built in)",
        desc: "Yotsuba Real Estate selects the property with the designation criteria (location, floor area, fire safety) in mind. This is the core of our distinction.",
      },
      {
        title: "Prior consultation with the ward, fire, and building divisions",
        desc: "Based on the candidate property's drawings and photos, confirm conformity of use, structure, floor area, and fire safety before signing.",
      },
      {
        title: "Preparing the staffing",
        desc: "Put in place the necessary staffing, such as a service manager, live-in helpers, and life-support workers.",
      },
      {
        title: "Preparing and submitting the designation application",
        desc: "Yotsuba Gyoseishoshi Office supports the preparation and submission of the designation application documents.",
      },
      {
        title: "Designation, opening, and operation",
        desc: "Receive the designation and open. You can continue to consult us on post-opening change notifications, renewals, and more.",
      },
    ],
    flowNote:
      "Note: The details and order of procedures differ by designating authority and service type. Confirm the latest operation with the municipal window at the opening location.",

    fieldLabel: "From the field",
    fieldHeading: "'Dialogue' with the municipality is, in fact, the shortest route to opening",
    fieldLead:
      "In opening a group home, there is something more important than how you draw up the documents: continuing careful, one-by-one communication with the municipal staff in charge. It may look like a detour, but in the end it is the fastest way. There are three reasons.",
    fieldReasons: [
      {
        title: "1. The response differs subtly by municipality.",
        body:
          "Even for the same 'shared-living support,' the level of detail required in documents, the timing of prior consultation, and the operation of property requirements differ slightly depending on the designating authority (prefecture, city, or special ward). Even though the national criteria are common, what the responsible municipality emphasizes within the 'range' of that operation cannot be known without actually asking. 'They said this elsewhere' sometimes does not apply. That is why, once the opening location is decided, we start by building a relationship with that municipality's division in charge.",
      },
      {
        title: "2. Email leaves a record. But important nuances, by phone or in person.",
        body:
          "Exchanges with the person in charge center on email, because it avoids 'he said, she said' and leaves confirmed items on record. However, points where judgment is divided, the delicate line of whether a property meets the requirements, a moment when you want to check 'is this all right?'—such important nuances only come across by phone or in person. With text alone, the other side, too, tends to give a cautious answer that avoids being definitive. It is within a face-to-face relationship that a more committed word comes back.",
      },
      {
        title: "3. What I learned as a reporter.",
        body:
          "Our representative, Uramatsu, is a former newspaper reporter. Reporting was the work of getting close to the other person, verifying facts one by one, and being present at the moment a desk-bound assumption is overturned in the field. Administrative procedures are, in fact, the same. Drawing out 'that municipality's practice'—which you cannot grasp just by reading the guidelines—from dialogue with the person in charge: this stance leads to an opening without rework.",
      },
    ],
    bunkyoTitle:
      "Example: Bunkyo has its own ward criteria and subsidy schemes. That is why prior confirmation is indispensable.",
    bunkyoBody:
      "This is not an abstract argument. Yotsuba's home ground, Bunkyo Ward, is precisely such an example. In addition to the national framework of shared-living support, Bunkyo has its own ward subsidy schemes (such as the subsidy for the development costs of group homes for persons with disabilities, and the grant guidelines for the operating-cost subsidy for group homes for persons with mental disabilities). Because such ward-specific schemes exist, their eligibility conditions, targets, and procedures cannot be known unless confirmed in advance at the ward window. The point of contact is the facilities and development staff of the Disability Welfare Section, Welfare Department (facilities/development, 9th floor of the Bunkyo Civic Center). Consultations with the municipality are recorded as a 'confirmation of consultation status with relevant agencies and minutes' and become attachments to the later designation application to the Tokyo Metropolitan Government—in other words, the prior consultation itself is part of the procedure. It is not 'just meet the Tokyo Metropolitan criteria,' but 'in Bunkyo, confirm Bunkyo's operation and subsidy schemes at an early stage.' This is the starting point for preventing rework.",
    bunkyoNote:
      "Note: The ward's schemes and requirements are amended. Always confirm the latest eligibility at the ward window. This guide is general information as of July 2026.",
    fieldClosing:
      "Yotsuba weaves this dialogue with the municipality into the process from the property-search stage. Not 'secure the property, then consult,' but 'choose the property while consulting.' That is how we can structurally reduce redone contracts and rejected designation applications.",
    fieldQuote:
      "Note: This stance of 'careful dialogue' meshes directly with Yotsuba's strength of viewing the property (real estate) and the designation application (administrative procedure) in one window. When the windows are separate, the subtle nuances gained from the municipality are not shared between the real estate side and the gyoseishoshi side. Precisely because there is one window, a single phone call with the person in charge is reflected at the same time in both property selection and the application documents.",

    checklistHeading: "What to confirm in prior consultation (a practical checklist)",
    checklistLead:
      "These are items that, confirmed at the municipal window before you sign a property contract and before you enter the designation application, reduce rework. Yotsuba proceeds with the representative attending or acting on your behalf for these confirmations.",
    checklistItems: [
      {
        term: "Ward-specific criteria and subsidy schemes",
        desc: "The targets, requirements, and deadlines of Bunkyo's development-cost and operating-cost subsidies (ward-specific schemes change by fiscal year).",
      },
      {
        term: "Property conformity",
        desc: "Show the candidate property's drawings and photos and check whether the use, structure, floor area, and location meet the requirements (before signing is the ironclad rule).",
      },
      {
        term: "Fire safety",
        desc: "Whether sprinklers, automatic fire alarms, and a reporting device are required (this varies with the expected disability support category of residents). The timing of prior consultation with the fire station having jurisdiction.",
      },
      {
        term: "Building",
        desc: "Whether a change of use or a confirmation application is required (to the ward's building division).",
      },
      {
        term: "How the record is kept",
        desc: "How the consultation is recorded as a 'confirmation of consultation status with relevant agencies and minutes' (it becomes an attachment to the later designation application).",
      },
      {
        term: "Schedule",
        desc: "The date of the Tokyo Metropolitan briefing, the reception period for the designation application, and the submission deadline working backward from your desired opening date.",
      },
    ],
    checklistNote:
      "Rather than 'asking everything at once by email,' it is more reliable to confirm the key points by phone or in person and leave the conclusions on record by email. The person in charge, too, gives a more committed answer in person.",

    pitfallHeading: "Common rework, and how to avoid it",
    pitfallLead:
      "We have organized, side by side, the rework that tends to happen in practice and Yotsuba's way of avoiding it.",
    pitfallColFail: "Common failure",
    pitfallColHappens: "What happens",
    pitfallColAvoid: "Yotsuba's avoidance",
    pitfallRows: [
      {
        fail: "Sign immediately on finding a good property",
        happens: "Cancellation and penalty for failing the criteria, or large-scale renovation",
        avoid: "Check drawings with the ward before signing; select the property with the criteria built in",
      },
      {
        fail: "Proceed on 'it was OK in another ward'",
        happens: "Rejected for not matching Bunkyo's operation and ward-specific schemes",
        avoid: "Always confirm in advance in the opening ward; grasp ward-specific schemes early",
      },
      {
        fail: "Seek a decision by email alone",
        happens: "Only cautious answers, and you proceed with the yes/no left ambiguous",
        avoid: "Confirm key points by phone or in person and leave the conclusion on record",
      },
      {
        fail: "Property contact and application contact are separate",
        happens: "The nuance gained at the window is not shared, causing duplicate work",
        avoid: "Manage property × designation application centrally in one window (Yotsuba)",
      },
    ],

    subsidyLabel: "Subsidies and funding",
    subsidyHeading: "The big picture of subsidies and funding",
    subsidyBody: [
      "Bunkyo has its own ward development-cost and operating-cost subsidy schemes, and the targets, requirements, and deadlines change by fiscal year. First, confirm the latest eligibility at the ward window. We support the preparation of the business plan with a former reporter's 'writing that gets through.'",
      "Note that a subsidy (hojokin; within the scope of gyoseishoshi practice) and an employment-related grant (joseikin; within the scope of a certified social insurance labor consultant) are different things. For labor matters and employment grants, we introduce a partner professional.",
    ],
    subsidyNote:
      "Note: The content and eligibility of subsidies and grants change with the fiscal year and circumstances. Confirm the latest at each window. This guide is general information as of July 2026.",

    meritLabel: "Why Yotsuba",
    meritHeading: "The advantages of consulting Yotsuba",
    meritLead:
      "Yotsuba's distinction is that you can organize the opening of a group home from both the property and the procedure sides in one window.",
    meritItems: [
      "You can centrally manage the property (real estate) and the licensing (designation application) in one window.",
      "A 'twin signboard' of real estate brokerage and gyoseishoshi practice—combining property selection with the criteria built in and support for the application.",
      "Chinese and English supported—we also handle consultations on welfare entrepreneurship by non-Japanese founders.",
      "A local office in Kohinata, Bunkyo, about a 5-minute walk from Myogadani Station. We walk with you close to the ward's operation and its own schemes.",
    ],

    faqLabel: "FAQ",
    faqHeading: "Opening a group home: frequently asked questions",
    faqItems: [
      {
        question: "I have already signed for a property. Is that all right?",
        answer:
          "First, please consult us without panicking. That said, if the property does not meet the designation criteria (location, structure, floor area, fire safety), it may require large-scale renovation or—worst case—be unusable as a business site and lead to cancellation. That is exactly why confirmation before signing is the ironclad rule. Even if you have already signed, we will confirm the current situation at the ward window and look together for a workable direction.",
      },
      {
        question: "Can I open one in a single condominium unit?",
        answer:
          "It depends on the type. In addition to the detached-house type and the apartment type (main residence), there is a 'satellite type' that uses a room in an apartment attached to the main residence. However, conformity with use, structure, floor area, fire safety, and the Building Standards Act is a prerequisite. We consult the ward's disability-welfare division and the building and fire authorities in advance to confirm whether it is possible with that property.",
      },
      {
        question: "Are sprinklers always required?",
        answer:
          "In principle there is a duty to install them (the floor-area requirement was abolished by the April 2015 amendment to the Fire Service Act Enforcement Order). However, on conditions such as residents who would find evacuation difficult (disability support category 4 or higher) making up 80% or less of the total, you may be able to open without installing them. Because this varies with the residents, confirm it through prior consultation with the fire station having jurisdiction.",
      },
      {
        question: "How long does it take to open?",
        answer:
          "As a general guide, 3–6 months. You proceed in order through incorporation, attending the Tokyo Metropolitan briefing, securing the property, prior consultation with the ward/fire/building divisions, securing staff, and the designation application. Viewing the property and the designation application at the same time reduces rework during this period.",
      },
      {
        question: "Can a non-Japanese person start a group home business?",
        answer:
          "Yes. Even where incorporation, residence status (such as the Business Manager visa), and the designation application are involved, Yotsuba handles both the gyoseishoshi and real estate sides and responds to consultations in Chinese and English. Because the requirements need to be sorted out individually, please consult us first.",
      },
      {
        question: "Can I use a subsidy?",
        answer:
          "Bunkyo has its own ward development-cost and operating-cost subsidy schemes, and the targets, requirements, and deadlines change by fiscal year. First, confirm the latest eligibility at the ward window. We support the preparation of the business plan with a former reporter's 'writing that gets through.' Note that an employment-related grant (within the scope of a certified social insurance labor consultant) is separate from a subsidy, and we introduce a partner professional.",
      },
      {
        question: "Do the procedures differ by municipality?",
        answer:
          "Yes, subtly. Even though the national criteria are common, there is a range in the level of detail required in documents and the operation of property requirements depending on the designating authority (metropolis, city, or special ward). Some municipalities, like Bunkyo, have their own subsidy schemes. That is why, once the opening location is decided, consulting that municipality's division in charge early and building up dialogue is the shortest route.",
      },
      {
        question: "How should I communicate with the municipal staff in charge?",
        answer:
          "It is most reliable to base things on email, which leaves a record, while confirming important nuances—such as points where judgment is divided and a property's conformity—by phone or in person. With text alone, the other side, too, tends to give a cautious answer that avoids being definitive, making it hard to obtain a committed confirmation. Building up careful dialogue is, in the end, the fastest way.",
      },
    ],

    internalHeading: "Pages you may also want to see",
    internalLinks: [
      {
        href: "/toushi/group-home",
        label: "How to find a property usable for a group home",
        description:
          "Explains the group-home property search from the property side, introducing how to search with the designation criteria—use, location, fire safety—in mind.",
      },
      {
        href: "/toushi/shitei-shinsei",
        label: "Property requirements for the designation application",
        description:
          "Organizes the property requirements asked about in the designation application (floor area, fire safety, building) from the standpoint of securing a property.",
      },
      {
        href: "/legal/services/shogai-fukushi",
        label: "Designation application for welfare services (procedure details)",
        description:
          "Details of the designation application procedures for shared-living support and more, by Yotsuba Gyoseishoshi Office.",
      },
      {
        href: "/souzoku",
        label: "If you inherit real estate in Bunkyo",
        description:
          "A complete guide to managing, utilizing, or selling inherited real estate. It can also be an entry point to using a vacant house as a group home.",
      },
    ],

    sourcesHeading: "Legal Basis & Sources",
    sources: [
      "Act on Comprehensive Support for the Daily and Social Life of Persons with Disabilities (Act No. 123 of 2005)—the positioning of shared-living support (group homes). The designation criteria are set by, among others, the standards on personnel, equipment, and operation for the businesses of designated welfare services for persons with disabilities under the same Act (Ordinance of the Ministry of Health, Labour and Welfare No. 171 of 2006).",
      "The room floor area for shared-living support is, in principle, 7.43 m² or more per resident (excluding storage). It may differ by the ordinances and operation of prefectures and designating authorities (confirm with the municipality granting the designation).",
      "Amendment to the Fire Service Act Enforcement Order (in force April 1, 2015)—the abolition of the floor-area requirement for installing sprinkler equipment in group homes and other (social welfare) facilities. There are relaxation provisions based on the proportion of persons with disabilities who would find evacuation difficult (disability support category 4 or higher) (confirm with the fire station having jurisdiction).",
      "Building Standards Act (Act No. 201 of 1950)—conformity of the building's use and structure. When converting an existing building, a change of use or a confirmation application may be required.",
      "Bunkyo's ward-specific schemes (the subsidy for the development costs of group homes for persons with disabilities, the grant guidelines for the operating-cost subsidy for group homes for persons with mental disabilities, and others)—the targets, requirements, and deadlines change by fiscal year (confirm with the Disability Welfare Section, Welfare Department, Bunkyo Ward).",
    ],
    sourcesNote:
      "Note: The latest content and dates of the most recent amendments to each law and scheme have not been individually verified as of the time this page was prepared (unverified). The figures and legal systems are general information as of July 2026; always confirm the latest at the window of the municipality, fire station, and building division having jurisdiction. This page is intended to provide general information and does not make individual eligibility judgments or guarantee outcomes.",

    repBio:
      "After walking the field in Japan and abroad as a reporter for the Mainichi Shimbun and serving as its China General Bureau Chief, I now run Yotsuba Real Estate and Yotsuba Gyoseishoshi Office in my home neighborhood of Kohinata, Bunkyo. Consultations about opening a group home begin with 'untangling' the property (real estate), the designation application (administrative procedure), and the dialogue with the municipality that are intertwined in it. Building on the listening, organizing, and plain-spoken communication skills honed through reporting, and on my knowledge as a Licensed Real Estate Transaction Specialist and Gyoseishoshi (Administrative Scrivener), I walk with you in one window from the property search to post-opening operation. Where matters fall outside my scope, such as labor and employment grants, I introduce a partner professional.",
    repRole: "Representative",
    ctaHeading: "Feel free to consult us first",
    ctaLead:
      "About opening a group home, a single line like 'Can I use this property?' is a perfectly fine place to start. You can consult us at our office in Kohinata, Bunkyo (about a 5-minute walk from Myogadani Station; 10:00–18:00; closed Tuesdays and Wednesdays) or online.",
    ctaLine: "Consult via the representative's LINE",
    ctaContact: "Contact",
    ctaLineNote:
      "The LINE button connects you directly to the personal account of our representative, Joji Uramatsu. Feel free to start with a single line like 'Can this property be used for a group home?'",
  },

  "zh-tw": {
    articleTitle:
      "在文京區開設身心障礙者團體家屋——從確保物件到指定申請・營運",
    articleDesc:
      "以「物件（不動產）與指定申請（行政手續）同時檢視」的視角，將身心障礙者團體家屋（共同生活援助）的開設整理為一的完全指南。從3種型態、物件的指定基準（居室7.43㎡・撒水設備・建築基準法）、到開設的流程與事前諮詢的訣竅，由同時擁有宅地建物取引業與行政書士業務、位於文京區小日向的四葉為您解說。",
    breadcrumbHome: "首頁",
    breadcrumbCurrent: "團體家屋開設",
    heroLabel: "團體家屋開設指南",
    h1Top: "在文京區開設身心障礙者團體家屋——",
    h1Sub: "從確保物件到指定申請・營運",
    heroLead:
      "身心障礙者團體家屋（共同生活援助）開設最容易受挫的原因，就是「先找到好物件，之後卻不符指定申請的要件，只好重簽契約」。物件（不動產）與指定申請（行政手續），本應同時檢視。四葉是同時擁有宅地建物取引業（四葉不動産）與行政書士業務（四葉行政書士事務所）的少數事務所。從預先納入指定基準的物件挑選，到法人設立・指定申請・開設後的營運，皆於同一窗口為您整理。",

    whyLabel: "獨特性的核心",
    whyHeading: "為什麼要同時檢視「物件」與「指定申請」",
    whyLead:
      "先說結論：團體家屋開設最常見的失敗，是先簽了物件契約，之後才發現不符指定基準（立地・構造・面積・消防），導致解約或重新施工。正因如此，從物件挑選階段就把指定申請一併納入，才是避免手戻（重工）的最短路徑。",
    whyBody: [
      "團體家屋與租一般住宅不同。必須一邊確認用途地域・居室面積・消防設備・建築基準法等與身心障礙福祉服務指定基準相關的事項，一邊挑選物件。若略過這一步、「先簽下喜歡的物件」，就可能因不符基準而面臨解約、大規模改修，最壞的情況甚至無法作為事業所使用。",
      "鐵則是：在簽約前，帶著圖面・照片向區的障礙福祉主管課事前諮詢，確認符合相關法令。四葉從物件挑選階段就把指定基準納入，因此能在結構上防止這類手戻。正因為物件（不動產）與指定申請（行政手續）能在同一窗口檢視，一方取得的資訊會立即反映到另一方。",
    ],
    whyContrast: [
      {
        title: "物件先行的失敗路徑",
        body:
          "先簽下喜歡的物件 → 事後才確認指定基準 → 用途・面積・消防不符 → 解約・違約金，或大規模改修，導致預算與時程崩壞。",
      },
      {
        title: "四葉的同步進行路徑",
        body:
          "在事業構想階段共享指定基準 → 納入基準挑選物件 → 簽約前向區事前諮詢 → 確認符合後再簽約 → 無手戻地進入指定申請。",
      },
    ],

    typesLabel: "3種型態",
    typesHeading: "團體家屋的3種型態",
    typesLead:
      "共同生活援助的居住形式大致可分為3種。哪一種合適，會因入居者樣貌・物件・地區而不同。我們會連同物件挑選的要點（四葉不動産的觀點）一併檢視。",
    typeCards: [
      {
        id: "detached",
        title: "獨棟型",
        description:
          "活用一棟獨立住宅的形式。較容易確保共用的客廳與餐廳，也較能營造居家氛圍。是否需要用途變更或消防設備，會因建物規模與入居者樣貌而不同，簽約前的確認不可或缺。",
      },
      {
        id: "apartment",
        title: "公寓型（本體住居）",
        description:
          "以公寓・大樓的數戶或整棟作為本體住居的形式。較容易保持居室的獨立性，但每戶都須滿足居室面積（原則7.43㎡以上）與消防設備的要件。轉用既有集合住宅時，確認用途・構造是否符合是重點。",
      },
      {
        id: "satellite",
        title: "衛星型（Satellite）",
        description:
          "以附屬於本體住居的形式，使用鄰近公寓的一室等。適合想逐步打造接近獨居環境的情形。與本體的距離及支援體制有其要件，物件挑選須與本體住居成套考量。",
      },
    ],

    criteriaLabel: "簽約前確認",
    criteriaHeading: "物件的指定基準（簽約前想先確認的事項）",
    criteriaLead:
      "物件是否符合指定基準，鐵則是在簽約前確認。代表性的確認項目如下（皆為2026年7月時點的一般資訊。基準會修正，且運用因自治體・事業類型而異）。",
    criteriaItems: [
      {
        term: "居室面積",
        desc:
          "原則上每位入居者7.43㎡以上（不含收納部分）。都道府縣・指定權者可能另行規定，因此須在取得指定的自治體確認。",
      },
      {
        term: "立地",
        desc:
          "要求須位於作為住宅地使用的地區等。包含用途地域的確認在內，於區的窗口事前諮詢候選物件是否符合。",
      },
      {
        term: "消防設備",
        desc:
          "原則上有設置撒水設備（sprinkler）的義務（平成27年〔2015年〕4月消防法施行令修正，面積要件已撤銷）。但在避難困難的入居者（障礙支援區分4以上）占整體8成以下等條件下，可能獲得緩和。自動火災通報設備・向消防機關通報的裝置也是要件。因入居者樣貌而異，向管轄消防署事前諮詢是重點。",
      },
      {
        term: "建築基準法",
        desc:
          "以建物用途・構造符合為前提。轉用既有建物時，可能需要用途變更或建築確認申請。透過向區的建築部署事前諮詢加以確認。",
      },
    ],
    criteriaNote:
      "※基準會修正。著手前請務必向管轄自治體・消防署・建築部署確認最新內容。本指南為2026年7月時點的一般性資訊，不對個別可否進行判斷或保證。",

    flowLabel: "開設的流程",
    flowHeading: "開設的流程（法人設立→指定申請→營運）",
    flowLead:
      "一般的準備期間約為3〜6個月。透過同時檢視物件與指定申請，可減少這段期間的手戻。",
    flowSteps: [
      {
        title: "事業構想・法人設立",
        desc: "準備公司・NPO・社會福祉法人等法人資格。法人設立手續與合作的專業人士一同進行。",
      },
      {
        title: "參加東京都的說明會",
        desc: "參加作為指定前提的說明會。及早掌握日程，並從開設希望日往回推算。",
      },
      {
        title: "確保物件（納入指定基準）",
        desc: "四葉不動産預先納入指定基準（立地・面積・消防）挑選物件。這正是獨特性的核心。",
      },
      {
        title: "向區・消防・建築部署事前諮詢",
        desc: "依候選物件的圖面・照片，於簽約前確認用途・構造・面積・消防是否符合。",
      },
      {
        title: "人員配置的準備",
        desc: "備妥服務管理責任者・世話人・生活支援員等必要的人員體制。",
      },
      {
        title: "指定申請文件的製作・提出",
        desc: "四葉行政書士事務所協助指定申請文件的製作與提出。",
      },
      {
        title: "指定・開設・營運",
        desc: "取得指定後開設。開設後的變更申報・更新等亦可持續諮詢。",
      },
    ],
    flowNote:
      "※手續的細節・順序因指定權者與事業類型而異。最新運用請向開設地的自治體窗口確認。",

    fieldLabel: "現場的實感",
    fieldHeading: "與自治體的「對話」，其實是開設的最短路徑",
    fieldLead:
      "在團體家屋開設中，有比製作文件更重要的事：與自治體的承辦人員，一件一件地持續細心溝通。看似繞遠路，結果卻是最快的路。原因有3個。",
    fieldReasons: [
      {
        title: "1. 各自治體的對應，會有微妙差異。",
        body:
          "即使同為「共同生活援助」，所要求文件的細緻程度、事前諮詢的時機、物件要件的運用，也會因指定權者（都道府縣・市・特別區）而略有不同。國家基準雖然共通，但在該運用的「幅度」中，承辦自治體重視什麼，不實際詢問就無法得知。「別處是這麼說的」有時並不適用。正因如此，一旦決定開設地點，我們會先從與該自治體主管課建立關係開始。",
      },
      {
        title: "2. 電子郵件會留下紀錄。但重要的細微之處，要靠電話或當面。",
        body:
          "與承辦人員的往來以電子郵件為主，因為能避免各說各話，並將確認事項留下紀錄。不過——判斷有所分歧的論點、物件是否符合要件的微妙界線、想一句確認「這樣可以嗎」的場面——這類重要的細微之處，非電話或當面無法傳達。僅靠文字，對方也容易給出避免斷定的謹慎回覆。唯有在看得見面孔的關係中，才能得到更進一步的回應。",
      },
      {
        title: "3. 記者時代學到的事。",
        body:
          "代表浦松是前報社記者。採訪是深入對方、逐一查證事實、在案頭假設於現場被推翻的瞬間到場的工作。行政手續其實也一樣。從與承辦人員的對話中，引出僅讀要綱無法得知的「該自治體的實務」。這樣的態度，能通往無手戻的開設。",
      },
    ],
    bunkyoTitle:
      "實例：文京區有區獨自的基準・補助制度。因此事前確認不可或缺。",
    bunkyoBody:
      "這並非抽象論。四葉的在地・文京區正是這樣的實例。文京區在國家的共同生活援助框架之外，另有區獨自的補助制度（身心障礙者團體家屋整備費等補助、精神障礙者團體家屋營運費補助金交付要綱等）。既然有區獨自的制度，其適用要件・對象・手續，非在區的窗口事前確認就無法得知。諮詢窗口為福祉部障礙福祉課的障礙者設施擔當（設施・整備擔當／文京市民中心9樓）。與市區町村的諮詢會以「關係機關諮詢狀況確認書及議事錄」記錄，並成為日後向東京都提出指定申請的附件——也就是說，事前諮詢本身就是手續的一部分。並非「滿足東京都的基準即可」，而是「在文京區，就要及早確認文京區的運用與補助制度」。這正是防止手戻的起點。",
    bunkyoNote:
      "※區的制度・要件會修正。最新適用可否請務必向區窗口確認。本指南為2026年7月時點的一般性資訊。",
    fieldClosing:
      "四葉從物件挑選階段，就把這種與自治體的對話納入進行。不是「先押下物件再諮詢」，而是「一邊諮詢一邊挑物件」。因此能在結構上減少重簽契約與指定申請被退回的情形。",
    fieldQuote:
      "補充：這種「細心對話」的態度，正好與四葉在同一窗口檢視物件（不動產）與指定申請（行政手續）的強項相互契合。窗口分開時，從自治體得到的微妙細節，就無法在不動產側與行政書士側之間共享。正因為是同一窗口，與承辦人員的一通電話，能同時反映到物件挑選與申請文件上。",

    checklistHeading: "事前諮詢時想先確認的事（實務檢核清單）",
    checklistLead:
      "以下是在簽物件契約前、以及進入指定申請前，於自治體窗口先確認就能減少手戻的項目。四葉會由代表陪同・代辦，一同推進這些確認。",
    checklistItems: [
      {
        term: "區獨自的基準・補助制度",
        desc: "文京區的整備費補助・營運費補助的對象・要件・截止日（區獨自制度會逐年度變動）。",
      },
      {
        term: "物件的適合性",
        desc: "出示候選物件的圖面・照片，確認用途・構造・面積・立地是否符合要件（簽約前為鐵則）。",
      },
      {
        term: "消防",
        desc: "撒水設備・自動火災通報設備・通報裝置的需否（依入居者障礙支援區分的預估而變動）。向管轄消防署事前諮詢的時機。",
      },
      {
        term: "建築",
        desc: "用途變更的需否、建築確認申請的需否（向區的建築部署）。",
      },
      {
        term: "紀錄的留存方式",
        desc: "諮詢內容如何以「關係機關諮詢狀況確認書及議事錄」留存（會成為日後指定申請的附件）。",
      },
      {
        term: "時程",
        desc: "東京都說明會的日程、指定申請的受理時期、從開設希望日往回推算的提出期限。",
      },
    ],
    checklistNote:
      "與其「用電子郵件一次全部問完」，更確實的做法是以電話・當面確認要點，再以電子郵件留下結論。承辦人員也會在當面時給出更進一步的回覆。",

    pitfallHeading: "常見的手戻，及其迴避",
    pitfallLead:
      "我們將實務上容易發生的手戻，與四葉的迴避法以對比方式整理。",
    pitfallColFail: "常見的失敗",
    pitfallColHappens: "會發生什麼",
    pitfallColAvoid: "四葉的迴避法",
    pitfallRows: [
      {
        fail: "找到好物件就立刻簽約",
        happens: "因不符指定基準而解約・違約金，或大規模改修",
        avoid: "簽約前向區確認圖面。納入指定基準挑選物件",
      },
      {
        fail: "以「別區是OK的」為由推進",
        happens: "不符文京區的運用・獨自制度而被退回",
        avoid: "務必在開設地的區事前確認。及早掌握區獨自制度",
      },
      {
        fail: "僅以電子郵件請求判斷",
        happens: "只能得到謹慎回覆，在可否不明的情況下推進",
        avoid: "重要論點以電話・當面確認，並將結論留下紀錄",
      },
      {
        fail: "物件承辦與申請承辦分屬不同人",
        happens: "在窗口得到的細節未被共享，造成二度工",
        avoid: "以同一窗口（四葉）一元管理物件×指定申請",
      },
    ],

    subsidyLabel: "補助金・資金",
    subsidyHeading: "補助金・資金的全貌",
    subsidyBody: [
      "文京區有區獨自的整備費補助・營運費補助制度，對象・要件・截止日會逐年度變動。首先在區窗口確認最新的適用可否。事業計畫書的製作，以前記者「能傳達的寫法」為您支援。",
      "另外，補助金（行政書士的業務範圍）與雇用相關的助成金（社會保險勞務士的業務範圍）是不同的事物。關於勞務・雇用助成金，將為您介紹合作的專業人士。",
    ],
    subsidyNote:
      "※補助金・助成金的制度內容・適用可否會因年度與情況而變。最新請向各窗口確認。本指南為2026年7月時點的一般性資訊。",

    meritLabel: "四葉的優勢",
    meritHeading: "向四葉諮詢的優勢",
    meritLead:
      "能從物件與手續兩面，在同一窗口整理團體家屋的開設，正是四葉的特色。",
    meritItems: [
      "可在同一窗口一元管理物件（不動產）與許認可（指定申請）",
      "宅地建物取引業與行政書士業務的「雙招牌」——兼顧納入基準的物件挑選與申請支援",
      "支援中文・英文——外國人的福祉創業諮詢亦可對應",
      "文京區小日向・距茗荷谷站步行約5分鐘的在地事務所。以貼近區的運用・獨自制度的距離陪伴您",
    ],

    faqLabel: "FAQ",
    faqHeading: "團體家屋開設，常見疑問",
    faqItems: [
      {
        question: "我已經先簽了物件契約。沒問題嗎？",
        answer:
          "首先請別慌張，先來諮詢。不過，若物件不符指定基準（立地・構造・面積・消防），可能需要大規模改修，最壞的情況甚至無法作為事業所使用而須解約。正因如此，簽約前的確認才是鐵則。即使已經簽約，也會在區窗口確認現狀，與您一起尋找可行的方向。",
      },
      {
        question: "大樓的一室也能開設嗎？",
        answer:
          "視型態而定。除獨棟型・公寓型（本體住居）外，也有以附屬於本體住居的「衛星型」使用公寓一室的形式。但仍以用途・構造・面積・消防・建築基準法符合為前提。會向區的障礙福祉主管課與建築・消防事前諮詢，確認該物件是否可行。",
      },
      {
        question: "一定需要撒水設備嗎？",
        answer:
          "原則上有設置義務（平成27年〔2015年〕4月消防法施行令修正，面積要件已撤銷）。但在避難困難的入居者（障礙支援區分4以上）占整體8成以下等條件下，有可能不設置也能開設。因入居者樣貌而異，請向管轄消防署事前諮詢確認。",
      },
      {
        question: "開設要花多久時間？",
        answer:
          "一般約以3〜6個月為目安。依序進行法人設立、參加東京都說明會、確保物件、向區・消防・建築事前諮詢、確保人員、指定申請。同時檢視物件與指定申請，可減少這段期間的手戻。",
      },
      {
        question: "外國人也能開始團體家屋事業嗎？",
        answer:
          "可以。即使涉及法人設立・在留資格（經營管理簽證等）・指定申請，四葉也能從行政書士業務與不動產兩面對應，並以中文・英文提供諮詢。要件需個別整理，請先來諮詢。",
      },
      {
        question: "可以使用補助金嗎？",
        answer:
          "文京區有區獨自的整備費補助・營運費補助制度，對象・要件・截止日會逐年度變動。首先在區窗口確認最新的適用可否。事業計畫書的製作，以前記者「能傳達的寫法」為您支援。另外，雇用相關的助成金（社會保險勞務士的業務範圍）與補助金不同，將為您介紹合作的專業人士。",
      },
      {
        question: "手續會因自治體而不同嗎？",
        answer:
          "是的，會有微妙差異。國家基準雖然共通，但所要求文件的細緻程度與物件要件的運用，會因指定權者（都・市・特別區）而有幅度。也有像文京區這樣擁有區獨自補助制度的自治體。正因如此，一旦決定開設地點，及早向該自治體主管課諮詢、反覆對話，就是最短路徑。",
      },
      {
        question: "該如何與自治體的承辦人員往來？",
        answer:
          "以能留下紀錄的電子郵件為基本，同時將判斷分歧的論點與物件適合性等重要細節，以電話・當面確認較為確實。因為僅靠文字，對方也容易給出避免斷定的謹慎回覆，難以取得更進一步的確認。反覆進行細心的對話，結果就是最快的路。",
      },
    ],

    internalHeading: "建議一併閱覽的頁面",
    internalLinks: [
      {
        href: "/toushi/group-home",
        label: "可用於團體家屋的物件找法",
        description:
          "以物件視角解說團體家屋的物件尋找，介紹納入用途・立地・消防等指定基準的找法。",
      },
      {
        href: "/toushi/shitei-shinsei",
        label: "指定申請的物件要件",
        description:
          "從確保物件的觀點，整理指定申請所詢問的物件要件（面積・消防・建築）。",
      },
      {
        href: "/legal/services/shogai-fukushi",
        label: "身心障礙福祉服務的指定申請（手續詳情）",
        description:
          "四葉行政書士事務所辦理的共同生活援助等指定申請手續詳情請見此處。",
      },
      {
        href: "/souzoku",
        label: "在文京區繼承不動產",
        description:
          "繼承不動產的管理・活用・出售完全指南。也可作為將空屋活用為團體家屋的入口。",
      },
    ],

    sourcesHeading: "依據・出處",
    sources: [
      "身心障礙者日常生活及社會生活綜合支援法（平成17年法律第123號）——共同生活援助（團體家屋）的定位。指定基準依同法之指定障礙福祉服務事業等的人員、設備及營運相關基準（平成18年厚生勞動省令第171號）等。",
      "共同生活援助的居室面積原則上每位入居者7.43㎡以上（不含收納）。可能因都道府縣・指定權者的條例・運用而異（請向取得指定的自治體確認）。",
      "消防法施行令的修正（平成27年〔2015年〕4月1日施行）——撤銷團體家屋等（社會福祉設施）撒水設備設置的面積要件。並有依避難困難身心障礙者（障礙支援區分4以上）比例等的緩和規定（請向管轄消防署確認）。",
      "建築基準法（昭和25年法律第201號）——建物用途・構造的符合。轉用既有建物時，可能需要用途變更・建築確認申請。",
      "文京區的區獨自制度（身心障礙者團體家屋整備費等補助、精神障礙者團體家屋營運費補助金交付要綱等）——對象・要件・截止日會逐年度變動（請向文京區福祉部障礙福祉課確認）。",
    ],
    sourcesNote:
      "※各法令・制度的最新內容・最終修正日期，於本頁製作時點未逐一查證（未經查證）。數值・法制度為2026年7月時點的一般性資訊，最新請務必向管轄自治體・消防署・建築部署的窗口確認。本頁以提供一般資訊為目的，不進行個別可否判斷或效果保證。",

    repBio:
      "曾以每日新聞記者的身分走訪國內外現場，並擔任中國總局長，之後在家鄉・文京區小日向經營四葉不動産與四葉行政書士事務所。團體家屋開設的諮詢，往往從整理物件（不動產）・指定申請（行政手續）以及與自治體的對話相互交織的狀態開始。以採訪培養出的傾聽・整理・淺白傳達的能力，加上宅地建物取引士・行政書士的知識為基礎，於同一窗口從物件挑選陪伴到開設後的營運。在勞務・雇用助成金等專業以外的場面，將為您介紹合作的專業人士。",
    repRole: "代表",
    ctaHeading: "歡迎先輕鬆諮詢",
    ctaLead:
      "關於團體家屋開設，從一句「這個物件能用嗎？」開始就可以。歡迎至文京區小日向的事務所（距茗荷谷站步行約5分鐘・10:00〜18:00・週二・週三公休）洽詢，也可線上諮詢。",
    ctaLine: "透過代表的LINE諮詢",
    ctaContact: "聯絡我們",
    ctaLineNote:
      "LINE將直接連到代表・浦松 丈二的個人帳號。從一句「這個物件能用來開團體家屋嗎？」開始，歡迎隨時聯繫。",
  },

  zh: {
    articleTitle:
      "在文京区开设残障者团体家屋——从确保物件到指定申请・运营",
    articleDesc:
      "以“物件（不动产）与指定申请（行政手续）同时检视”的视角，将残障者团体家屋（共同生活援助）的开设整理为一的完全指南。从3种型态、物件的指定基准（居室7.43㎡・喷淋设备・建筑基准法）、到开设的流程与事前咨询的诀窍，由同时拥有宅地建物取引业与行政书士业务、位于文京区小日向的四葉为您解说。",
    breadcrumbHome: "首页",
    breadcrumbCurrent: "团体家屋开设",
    heroLabel: "团体家屋开设指南",
    h1Top: "在文京区开设残障者团体家屋——",
    h1Sub: "从确保物件到指定申请・运营",
    heroLead:
      "残障者团体家屋（共同生活援助）开设最容易受挫的原因，就是“先找到好物件，之后却不符指定申请的要件，只好重签合同”。物件（不动产）与指定申请（行政手续），本应同时检视。四葉是同时拥有宅地建物取引业（四葉不動産）与行政书士业务（四葉行政書士事務所）的少数事务所。从预先纳入指定基准的物件挑选，到法人设立・指定申请・开设后的运营，均在同一窗口为您整理。",

    whyLabel: "独特性的核心",
    whyHeading: "为什么要同时检视“物件”与“指定申请”",
    whyLead:
      "先说结论：团体家屋开设最常见的失败，是先签了物件合同，之后才发现不符指定基准（立地・构造・面积・消防），导致解约或重新施工。正因如此，从物件挑选阶段就把指定申请一并纳入，才是避免返工的最短路径。",
    whyBody: [
      "团体家屋与租一般住宅不同。必须一边确认用途地域・居室面积・消防设备・建筑基准法等与残障福祉服务指定基准相关的事项，一边挑选物件。若略过这一步、“先签下喜欢的物件”，就可能因不符基准而面临解约、大规模改造，最坏的情况甚至无法作为事业所使用。",
      "铁则是：在签约前，带着图纸・照片向区的残障福祉主管科事前咨询，确认符合相关法令。四葉从物件挑选阶段就把指定基准纳入，因此能在结构上防止这类返工。正因为物件（不动产）与指定申请（行政手续）能在同一窗口检视，一方取得的信息会立即反映到另一方。",
    ],
    whyContrast: [
      {
        title: "物件先行的失败路径",
        body:
          "先签下喜欢的物件 → 事后才确认指定基准 → 用途・面积・消防不符 → 解约・违约金，或大规模改造，导致预算与进度崩坏。",
      },
      {
        title: "四葉的同步进行路径",
        body:
          "在事业构想阶段共享指定基准 → 纳入基准挑选物件 → 签约前向区事前咨询 → 确认符合后再签约 → 无返工地进入指定申请。",
      },
    ],

    typesLabel: "3种型态",
    typesHeading: "团体家屋的3种型态",
    typesLead:
      "共同生活援助的居住形式大致可分为3种。哪一种合适，会因入住者情况・物件・地区而不同。我们会连同物件挑选的要点（四葉不動産的观点）一并检视。",
    typeCards: [
      {
        id: "detached",
        title: "独栋型",
        description:
          "活用一栋独立住宅的形式。较容易确保共用的客厅与餐厅，也较能营造居家氛围。是否需要用途变更或消防设备，会因建筑规模与入住者情况而不同，签约前的确认不可或缺。",
      },
      {
        id: "apartment",
        title: "公寓型（本体住居）",
        description:
          "以公寓・大楼的数户或整栋作为本体住居的形式。较容易保持居室的独立性，但每户都须满足居室面积（原则7.43㎡以上）与消防设备的要件。转用既有集合住宅时，确认用途・构造是否符合是重点。",
      },
      {
        id: "satellite",
        title: "卫星型（Satellite）",
        description:
          "以附属于本体住居的形式，使用邻近公寓的一室等。适合想逐步打造接近独居环境的情形。与本体的距离及支援体制有其要件，物件挑选须与本体住居成套考量。",
      },
    ],

    criteriaLabel: "签约前确认",
    criteriaHeading: "物件的指定基准（签约前想先确认的事项）",
    criteriaLead:
      "物件是否符合指定基准，铁则是在签约前确认。代表性的确认项目如下（均为2026年7月时点的一般信息。基准会修订，且运用因自治体・事业类型而异）。",
    criteriaItems: [
      {
        term: "居室面积",
        desc:
          "原则上每位入住者7.43㎡以上（不含收纳部分）。都道府县・指定权者可能另行规定，因此须在取得指定的自治体确认。",
      },
      {
        term: "立地",
        desc:
          "要求须位于作为住宅地使用的地区等。包含用途地域的确认在内，于区的窗口事前咨询候选物件是否符合。",
      },
      {
        term: "消防设备",
        desc:
          "原则上有设置喷淋设备（sprinkler）的义务（平成27年〔2015年〕4月消防法施行令修订，面积要件已撤销）。但在避难困难的入住者（残障支援区分4以上）占整体8成以下等条件下，可能获得放宽。自动火灾报警设备・向消防机关报警的装置也是要件。因入住者情况而异，向管辖消防署事前咨询是重点。",
      },
      {
        term: "建筑基准法",
        desc:
          "以建筑用途・构造符合为前提。转用既有建筑时，可能需要用途变更或建筑确认申请。通过向区的建筑部门事前咨询加以确认。",
      },
    ],
    criteriaNote:
      "※基准会修订。着手前请务必向管辖自治体・消防署・建筑部门确认最新内容。本指南为2026年7月时点的一般性信息，不对个别可否进行判断或保证。",

    flowLabel: "开设的流程",
    flowHeading: "开设的流程（法人设立→指定申请→运营）",
    flowLead:
      "一般的准备期间约为3〜6个月。通过同时检视物件与指定申请，可减少这段期间的返工。",
    flowSteps: [
      {
        title: "事业构想・法人设立",
        desc: "准备公司・NPO・社会福祉法人等法人资格。法人设立手续与合作的专业人士一同进行。",
      },
      {
        title: "参加东京都的说明会",
        desc: "参加作为指定前提的说明会。及早掌握日程，并从开设希望日往回推算。",
      },
      {
        title: "确保物件（纳入指定基准）",
        desc: "四葉不動産预先纳入指定基准（立地・面积・消防）挑选物件。这正是独特性的核心。",
      },
      {
        title: "向区・消防・建筑部门事前咨询",
        desc: "依候选物件的图纸・照片，于签约前确认用途・构造・面积・消防是否符合。",
      },
      {
        title: "人员配置的准备",
        desc: "备妥服务管理责任者・世话人・生活支援员等必要的人员体制。",
      },
      {
        title: "指定申请文件的制作・提交",
        desc: "四葉行政書士事務所协助指定申请文件的制作与提交。",
      },
      {
        title: "指定・开设・运营",
        desc: "取得指定后开设。开设后的变更申报・更新等亦可持续咨询。",
      },
    ],
    flowNote:
      "※手续的细节・顺序因指定权者与事业类型而异。最新运用请向开设地的自治体窗口确认。",

    fieldLabel: "现场的实感",
    fieldHeading: "与自治体的“对话”，其实是开设的最短路径",
    fieldLead:
      "在团体家屋开设中，有比制作文件更重要的事：与自治体的经办人员，一件一件地持续细心沟通。看似绕远路，结果却是最快的路。原因有3个。",
    fieldReasons: [
      {
        title: "1. 各自治体的对应，会有微妙差异。",
        body:
          "即使同为“共同生活援助”，所要求文件的细致程度、事前咨询的时机、物件要件的运用，也会因指定权者（都道府县・市・特别区）而略有不同。国家基准虽然共通，但在该运用的“幅度”中，经办自治体重视什么，不实际询问就无法得知。“别处是这么说的”有时并不适用。正因如此，一旦决定开设地点，我们会先从与该自治体主管科建立关系开始。",
      },
      {
        title: "2. 电子邮件会留下记录。但重要的细微之处，要靠电话或当面。",
        body:
          "与经办人员的往来以电子邮件为主，因为能避免各说各话，并将确认事项留下记录。不过——判断有所分歧的论点、物件是否符合要件的微妙界线、想一句确认“这样可以吗”的场面——这类重要的细微之处，非电话或当面无法传达。仅靠文字，对方也容易给出避免断定的谨慎答复。唯有在看得见面孔的关系中，才能得到更进一步的回应。",
      },
      {
        title: "3. 记者时代学到的事。",
        body:
          "代表浦松是前报社记者。采访是深入对方、逐一查证事实、在案头假设于现场被推翻的瞬间到场的工作。行政手续其实也一样。从与经办人员的对话中，引出仅读要纲无法得知的“该自治体的实务”。这样的态度，能通往无返工的开设。",
      },
    ],
    bunkyoTitle:
      "实例：文京区有区独自的基准・补助制度。因此事前确认不可或缺。",
    bunkyoBody:
      "这并非抽象论。四葉的本地・文京区正是这样的实例。文京区在国家的共同生活援助框架之外，另有区独自的补助制度（残障者团体家屋整备费等补助、精神残障者团体家屋运营费补助金交付要纲等）。既然有区独自的制度，其适用要件・对象・手续，非在区的窗口事前确认就无法得知。咨询窗口为福祉部残障福祉科的残障者设施担当（设施・整备担当／文京市民中心9楼）。与市区町村的咨询会以“关系机关咨询状况确认书及议事录”记录，并成为日后向东京都提出指定申请的附件——也就是说，事前咨询本身就是手续的一部分。并非“满足东京都的基准即可”，而是“在文京区，就要及早确认文京区的运用与补助制度”。这正是防止返工的起点。",
    bunkyoNote:
      "※区的制度・要件会修订。最新适用可否请务必向区窗口确认。本指南为2026年7月时点的一般性信息。",
    fieldClosing:
      "四葉从物件挑选阶段，就把这种与自治体的对话纳入推进。不是“先押下物件再咨询”，而是“一边咨询一边挑物件”。因此能在结构上减少重签合同与指定申请被退回的情形。",
    fieldQuote:
      "补充：这种“细心对话”的态度，正好与四葉在同一窗口检视物件（不动产）与指定申请（行政手续）的强项相互契合。窗口分开时，从自治体得到的微妙细节，就无法在不动产侧与行政书士侧之间共享。正因为是同一窗口，与经办人员的一通电话，能同时反映到物件挑选与申请文件上。",

    checklistHeading: "事前咨询时想先确认的事（实务核对清单）",
    checklistLead:
      "以下是在签物件合同前、以及进入指定申请前，于自治体窗口先确认就能减少返工的项目。四葉会由代表陪同・代办，一同推进这些确认。",
    checklistItems: [
      {
        term: "区独自的基准・补助制度",
        desc: "文京区的整备费补助・运营费补助的对象・要件・截止日（区独自制度会逐年度变动）。",
      },
      {
        term: "物件的适合性",
        desc: "出示候选物件的图纸・照片，确认用途・构造・面积・立地是否符合要件（签约前为铁则）。",
      },
      {
        term: "消防",
        desc: "喷淋设备・自动火灾报警设备・报警装置的需否（依入住者残障支援区分的预估而变动）。向管辖消防署事前咨询的时机。",
      },
      {
        term: "建筑",
        desc: "用途变更的需否、建筑确认申请的需否（向区的建筑部门）。",
      },
      {
        term: "记录的留存方式",
        desc: "咨询内容如何以“关系机关咨询状况确认书及议事录”留存（会成为日后指定申请的附件）。",
      },
      {
        term: "进度安排",
        desc: "东京都说明会的日程、指定申请的受理时期、从开设希望日往回推算的提交期限。",
      },
    ],
    checklistNote:
      "与其“用电子邮件一次全部问完”，更确实的做法是以电话・当面确认要点，再以电子邮件留下结论。经办人员也会在当面时给出更进一步的答复。",

    pitfallHeading: "常见的返工，及其规避",
    pitfallLead:
      "我们将实务上容易发生的返工，与四葉的规避法以对比方式整理。",
    pitfallColFail: "常见的失败",
    pitfallColHappens: "会发生什么",
    pitfallColAvoid: "四葉的规避法",
    pitfallRows: [
      {
        fail: "找到好物件就立刻签约",
        happens: "因不符指定基准而解约・违约金，或大规模改造",
        avoid: "签约前向区确认图纸。纳入指定基准挑选物件",
      },
      {
        fail: "以“别区是OK的”为由推进",
        happens: "不符文京区的运用・独自制度而被退回",
        avoid: "务必在开设地的区事前确认。及早掌握区独自制度",
      },
      {
        fail: "仅以电子邮件请求判断",
        happens: "只能得到谨慎答复，在可否不明的情况下推进",
        avoid: "重要论点以电话・当面确认，并将结论留下记录",
      },
      {
        fail: "物件经办与申请经办分属不同人",
        happens: "在窗口得到的细节未被共享，造成二次返工",
        avoid: "以同一窗口（四葉）一元管理物件×指定申请",
      },
    ],

    subsidyLabel: "补助金・资金",
    subsidyHeading: "补助金・资金的全貌",
    subsidyBody: [
      "文京区有区独自的整备费补助・运营费补助制度，对象・要件・截止日会逐年度变动。首先在区窗口确认最新的适用可否。事业计划书的制作，以前记者“能传达的写法”为您支援。",
      "另外，补助金（行政书士的业务范围）与雇用相关的助成金（社会保险劳务士的业务范围）是不同的事物。关于劳务・雇用助成金，将为您介绍合作的专业人士。",
    ],
    subsidyNote:
      "※补助金・助成金的制度内容・适用可否会因年度与情况而变。最新请向各窗口确认。本指南为2026年7月时点的一般性信息。",

    meritLabel: "四葉的优势",
    meritHeading: "向四葉咨询的优势",
    meritLead:
      "能从物件与手续两面，在同一窗口整理团体家屋的开设，正是四葉的特色。",
    meritItems: [
      "可在同一窗口一元管理物件（不动产）与许认可（指定申请）",
      "宅地建物取引业与行政书士业务的“双招牌”——兼顾纳入基准的物件挑选与申请支援",
      "支援中文・英文——外国人的福祉创业咨询亦可对应",
      "文京区小日向・距茗荷谷站步行约5分钟的本地事务所。以贴近区的运用・独自制度的距离陪伴您",
    ],

    faqLabel: "FAQ",
    faqHeading: "团体家屋开设，常见疑问",
    faqItems: [
      {
        question: "我已经先签了物件合同。没问题吗？",
        answer:
          "首先请别慌张，先来咨询。不过，若物件不符指定基准（立地・构造・面积・消防），可能需要大规模改造，最坏的情况甚至无法作为事业所使用而须解约。正因如此，签约前的确认才是铁则。即使已经签约，也会在区窗口确认现状，与您一起寻找可行的方向。",
      },
      {
        question: "大楼的一室也能开设吗？",
        answer:
          "视型态而定。除独栋型・公寓型（本体住居）外，也有以附属于本体住居的“卫星型”使用公寓一室的形式。但仍以用途・构造・面积・消防・建筑基准法符合为前提。会向区的残障福祉主管科与建筑・消防事前咨询，确认该物件是否可行。",
      },
      {
        question: "一定需要喷淋设备吗？",
        answer:
          "原则上有设置义务（平成27年〔2015年〕4月消防法施行令修订，面积要件已撤销）。但在避难困难的入住者（残障支援区分4以上）占整体8成以下等条件下，有可能不设置也能开设。因入住者情况而异，请向管辖消防署事前咨询确认。",
      },
      {
        question: "开设要花多久时间？",
        answer:
          "一般约以3〜6个月为目安。依序进行法人设立、参加东京都说明会、确保物件、向区・消防・建筑事前咨询、确保人员、指定申请。同时检视物件与指定申请，可减少这段期间的返工。",
      },
      {
        question: "外国人也能开始团体家屋事业吗？",
        answer:
          "可以。即使涉及法人设立・在留资格（经营管理签证等）・指定申请，四葉也能从行政书士业务与不动产两面对应，并以中文・英文提供咨询。要件需个别整理，请先来咨询。",
      },
      {
        question: "可以使用补助金吗？",
        answer:
          "文京区有区独自的整备费补助・运营费补助制度，对象・要件・截止日会逐年度变动。首先在区窗口确认最新的适用可否。事业计划书的制作，以前记者“能传达的写法”为您支援。另外，雇用相关的助成金（社会保险劳务士的业务范围）与补助金不同，将为您介绍合作的专业人士。",
      },
      {
        question: "手续会因自治体而不同吗？",
        answer:
          "是的，会有微妙差异。国家基准虽然共通，但所要求文件的细致程度与物件要件的运用，会因指定权者（都・市・特别区）而有幅度。也有像文京区这样拥有区独自补助制度的自治体。正因如此，一旦决定开设地点，及早向该自治体主管科咨询、反复对话，就是最短路径。",
      },
      {
        question: "该如何与自治体的经办人员往来？",
        answer:
          "以能留下记录的电子邮件为基本，同时将判断分歧的论点与物件适合性等重要细节，以电话・当面确认较为确实。因为仅靠文字，对方也容易给出避免断定的谨慎答复，难以取得更进一步的确认。反复进行细心的对话，结果就是最快的路。",
      },
    ],

    internalHeading: "建议一并浏览的页面",
    internalLinks: [
      {
        href: "/toushi/group-home",
        label: "可用于团体家屋的物件找法",
        description:
          "以物件视角解说团体家屋的物件寻找，介绍纳入用途・立地・消防等指定基准的找法。",
      },
      {
        href: "/toushi/shitei-shinsei",
        label: "指定申请的物件要件",
        description:
          "从确保物件的观点，整理指定申请所询问的物件要件（面积・消防・建筑）。",
      },
      {
        href: "/legal/services/shogai-fukushi",
        label: "残障福祉服务的指定申请（手续详情）",
        description:
          "四葉行政書士事務所办理的共同生活援助等指定申请手续详情请见此处。",
      },
      {
        href: "/souzoku",
        label: "在文京区继承不动产",
        description:
          "继承不动产的管理・活用・出售完全指南。也可作为将空置房屋活用为团体家屋的入口。",
      },
    ],

    sourcesHeading: "依据・出处",
    sources: [
      "残障者日常生活及社会生活综合支援法（平成17年法律第123号）——共同生活援助（团体家屋）的定位。指定基准依同法之指定残障福祉服务事业等的人员、设备及运营相关基准（平成18年厚生劳动省令第171号）等。",
      "共同生活援助的居室面积原则上每位入住者7.43㎡以上（不含收纳）。可能因都道府县・指定权者的条例・运用而异（请向取得指定的自治体确认）。",
      "消防法施行令的修订（平成27年〔2015年〕4月1日施行）——撤销团体家屋等（社会福祉设施）喷淋设备设置的面积要件。并有依避难困难残障者（残障支援区分4以上）比例等的放宽规定（请向管辖消防署确认）。",
      "建筑基准法（昭和25年法律第201号）——建筑用途・构造的符合。转用既有建筑时，可能需要用途变更・建筑确认申请。",
      "文京区的区独自制度（残障者团体家屋整备费等补助、精神残障者团体家屋运营费补助金交付要纲等）——对象・要件・截止日会逐年度变动（请向文京区福祉部残障福祉科确认）。",
    ],
    sourcesNote:
      "※各法令・制度的最新内容・最终修订日期，在本页制作时点未逐一核实（未经核实）。数值・法制度为2026年7月时点的一般性信息，最新请务必向管辖自治体・消防署・建筑部门的窗口确认。本页以提供一般信息为目的，不进行个别可否判断或效果保证。",

    repBio:
      "曾以每日新闻记者的身份走访国内外现场，并担任中国总局长，之后在家乡・文京区小日向经营四葉不動産与四葉行政書士事務所。团体家屋开设的咨询，往往从整理物件（不动产）・指定申请（行政手续）以及与自治体的对话相互交织的状态开始。以采访培养出的倾听・梳理・浅显传达的能力，加上宅地建物取引士・行政书士的知识为基础，在同一窗口从物件挑选陪伴到开设后的运营。在劳务・雇用助成金等专业以外的场面，将为您介绍合作的专业人士。",
    repRole: "代表",
    ctaHeading: "欢迎先轻松咨询",
    ctaLead:
      "关于团体家屋开设，从一句“这个物件能用吗？”开始就可以。欢迎到文京区小日向的事务所（距茗荷谷站步行约5分钟・10:00〜18:00・周二・周三休息）咨询，也可在线咨询。",
    ctaLine: "通过代表的LINE咨询",
    ctaContact: "联系我们",
    ctaLineNote:
      "LINE将直接连接到代表・浦松 丈二的个人账号。从一句“这个物件能用来开团体家屋吗？”开始，欢迎随时联系。",
  },
};

export default async function GroupHomePageContent() {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;

  // グループホームは事業用途＝toushi（投資・事業）テーマの関連コラム。該当が無ければ節ごと非表示。
  const relatedColumns = filterColumnsByTheme(
    (await getColumns(locale)).map((col) => getLocalizedColumn(col, locale)),
    "toushi",
  );

  return (
    <div>
      {/* ─── JSON-LD（既存3種＝Article・FAQPage・Breadcrumb のみ） ─── */}
      <ArticleJsonLd
        businessKey="realestate"
        title={c.articleTitle}
        description={c.articleDesc}
        path="/group-home"
        datePublished="2026-07-18"
        dateModified="2026-07-18"
      />
      <FAQJsonLd items={c.faqItems} />
      <BreadcrumbJsonLd
        businessKey="realestate"
        items={[
          { name: c.breadcrumbHome, href: "/" },
          { name: c.breadcrumbCurrent, href: "/group-home" },
        ]}
      />

      {/* ─── Hero／結論ブロック ─── */}
      <section className="relative grid min-h-[40vh] place-content-center overflow-hidden border-b border-border pt-24 pb-16 sm:pt-32 sm:pb-32 md:pt-40 md:pb-40">
        <div
          className="pointer-events-none absolute inset-0 bg-green-gradient"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">
            {c.heroLabel}
          </p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl">
            {c.h1Top}
            <span className="mt-3 block text-xl sm:text-2xl md:text-3xl">
              {c.h1Sub}
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base">
            {c.heroLead}
          </p>
        </div>
      </section>

      {/* ─── なぜ物件と指定申請を同時に見るのか（独自性の核） ─── */}
      <section className="py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">
              {c.whyLabel}
            </p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              {c.whyHeading}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-text-muted">
              {c.whyLead}
            </p>
          </div>
          <div className="mt-8 space-y-4">
            {c.whyBody.map((p) => (
              <p key={p} className="text-sm leading-[1.9] text-text-muted">
                {p}
              </p>
            ))}
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-6">
            {c.whyContrast.map((card) => (
              <div
                key={card.title}
                className="gradient-border rounded-xl bg-surface p-5 sm:p-6"
              >
                <h3 className="text-base font-bold">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3つの型 ─── */}
      <section className="bg-surface-dim py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">
              {c.typesLabel}
            </p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              {c.typesHeading}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-text-muted">
              {c.typesLead}
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-3 sm:gap-6">
            {c.typeCards.map((card) => {
              const Icon = TYPE_ICONS[card.id];
              return (
                <div
                  key={card.id}
                  id={card.id}
                  className="gradient-border rounded-xl bg-surface p-5 sm:p-8"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{card.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-muted">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 物件の指定基準 ─── */}
      <section className="py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">
              {c.criteriaLabel}
            </p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              {c.criteriaHeading}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-text-muted">
              {c.criteriaLead}
            </p>
          </div>
          <dl className="mt-10 space-y-4">
            {c.criteriaItems.map((item) => (
              <div
                key={item.term}
                className="gradient-border rounded-xl bg-surface p-5 sm:p-6"
              >
                <dt className="text-base font-bold">{item.term}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-text-muted">
                  {item.desc}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-xs leading-relaxed text-text-muted">
            {c.criteriaNote}
          </p>
        </div>
      </section>

      {/* ─── 開設までの流れ（7ステップ） ─── */}
      <section className="bg-surface-dim py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">
              {c.flowLabel}
            </p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              {c.flowHeading}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-text-muted">
              {c.flowLead}
            </p>
          </div>
          <ol className="mt-10 space-y-4">
            {c.flowSteps.map((step, i) => (
              <li
                key={step.title}
                className="flex gap-4 rounded-xl bg-surface p-5 sm:p-6"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-base font-bold">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-text-muted">
                    {step.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-xs leading-relaxed text-text-muted">
            {c.flowNote}
          </p>
        </div>
      </section>

      {/* ─── 現場の実感（自治体との対話） ─── */}
      <section className="py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">
              {c.fieldLabel}
            </p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              {c.fieldHeading}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-text-muted">
              {c.fieldLead}
            </p>
          </div>
          <div className="mt-10 space-y-6">
            {c.fieldReasons.map((reason) => (
              <div key={reason.title}>
                <h3 className="text-base font-bold">{reason.title}</h3>
                <p className="mt-2 text-sm leading-[1.9] text-text-muted">
                  {reason.body}
                </p>
              </div>
            ))}
          </div>

          {/* ▼ 文京区の実例 */}
          <div className="mt-10 gradient-border rounded-xl bg-surface p-5 sm:p-8">
            <h3 className="text-base font-bold sm:text-lg">{c.bunkyoTitle}</h3>
            <p className="mt-3 text-sm leading-[1.9] text-text-muted">
              {c.bunkyoBody}
            </p>
            <p className="mt-4 text-xs leading-relaxed text-text-muted">
              {c.bunkyoNote}
            </p>
          </div>

          <p className="mt-8 text-sm leading-[1.9] text-text-muted">
            {c.fieldClosing}
          </p>
          <blockquote className="mt-6 border-l-2 border-primary/40 pl-4 text-sm leading-[1.9] text-text-muted">
            {c.fieldQuote}
          </blockquote>

          {/* ▸ 事前相談チェックリスト */}
          <div className="mt-12">
            <h3 className="text-lg font-bold sm:text-xl">
              {c.checklistHeading}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              {c.checklistLead}
            </p>
            <dl className="mt-6 space-y-3">
              {c.checklistItems.map((item) => (
                <div
                  key={item.term}
                  className="rounded-lg border border-border bg-surface p-4"
                >
                  <dt className="text-sm font-bold">{item.term}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-text-muted">
                    {item.desc}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-text-muted">
              {c.checklistNote}
            </p>
          </div>

          {/* ▸ よくある手戻りと回避（表） */}
          <div className="mt-12">
            <h3 className="text-lg font-bold sm:text-xl">
              {c.pitfallHeading}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              {c.pitfallLead}
            </p>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[36rem] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="py-3 pr-4 font-bold">{c.pitfallColFail}</th>
                    <th className="py-3 pr-4 font-bold">
                      {c.pitfallColHappens}
                    </th>
                    <th className="py-3 font-bold">{c.pitfallColAvoid}</th>
                  </tr>
                </thead>
                <tbody>
                  {c.pitfallRows.map((row) => (
                    <tr key={row.fail} className="border-b border-border">
                      <td className="py-3 pr-4 align-top font-medium">
                        {row.fail}
                      </td>
                      <td className="py-3 pr-4 align-top text-text-muted">
                        {row.happens}
                      </td>
                      <td className="py-3 align-top text-text-muted">
                        {row.avoid}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 補助金・資金の全体像 ─── */}
      <section className="bg-surface-dim py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">
              {c.subsidyLabel}
            </p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              {c.subsidyHeading}
            </h2>
          </div>
          <div className="mt-8 space-y-4">
            {c.subsidyBody.map((p) => (
              <p key={p} className="text-sm leading-[1.9] text-text-muted">
                {p}
              </p>
            ))}
          </div>
          <p className="mt-6 text-xs leading-relaxed text-text-muted">
            {c.subsidyNote}
          </p>
        </div>
      </section>

      {/* ─── 四葉のメリット ─── */}
      <section className="py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">
              {c.meritLabel}
            </p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              {c.meritHeading}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-text-muted">
              {c.meritLead}
            </p>
          </div>
          <ul className="mx-auto mt-10 max-w-2xl space-y-3">
            {c.meritItems.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text-muted"
              >
                <ArrowRight
                  size={16}
                  className="mt-1 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── H2疑問文FAQ（一問一答） ─── */}
      <section className="bg-surface-dim py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">
              {c.faqLabel}
            </p>
            {/* AIO設計上、各質問文をH2にするため、セクション見出しは装飾テキスト（p）に留める */}
            <p className="mt-3 text-2xl font-bold sm:text-3xl">
              {c.faqHeading}
            </p>
          </div>
          <div className="mt-10 space-y-4 sm:mt-14">
            {c.faqItems.map((item) => (
              <details
                key={item.question}
                className="group rounded-lg border border-border bg-surface p-4 sm:p-6"
              >
                <summary className="cursor-pointer list-none">
                  <h2 className="inline text-base font-bold leading-relaxed sm:text-lg">
                    {item.question}
                  </h2>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 内部リンク束 ─── */}
      <section className="py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            {c.internalHeading}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {c.internalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="gradient-border block rounded-xl bg-surface p-5 transition-colors hover:text-primary"
              >
                <span className="inline-flex items-center gap-1 text-sm font-bold">
                  {link.label}
                  <ArrowRight size={14} />
                </span>
                <span className="mt-2 block text-xs leading-relaxed text-text-muted">
                  {link.description}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 根拠欄 ─── */}
      <section className="border-t border-border py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold">{c.sourcesHeading}</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text-muted">
            {c.sources.map((source) => (
              <li key={source}>{source}</li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-text-muted">
            {c.sourcesNote}
          </p>
        </div>
      </section>

      {/* ─── 代表者カード ─── */}
      <section className="bg-surface-dim py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="gradient-border overflow-hidden rounded-2xl bg-surface p-5 sm:p-8 md:p-12">
            <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
              <div className="h-40 w-32 shrink-0 overflow-hidden rounded-2xl">
                <Image
                  src="/uramatsu.png"
                  alt={SHARED_ORG_INFO.representative}
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm leading-[1.9] text-text-muted">
                  {c.repBio}
                </p>
                <div className="mt-6">
                  <p className="text-base font-bold">
                    {SHARED_ORG_INFO.representative}
                  </p>
                  <p className="mt-1 text-xs text-text-muted">{c.repRole}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 関連コラム ─── */}
      <RelatedColumnsSection columns={relatedColumns} locale={locale} />

      {/* ─── 当社が対応できないこと（日本語版のみ・お問い合わせ導線の手前） ─── */}
      {locale === "ja" && (
        <div className="pb-14 sm:pb-20 md:pb-28">
          <CannotHandle />
        </div>
      )}

      {/* ─── CTA ─── */}
      <section className="border-t border-border bg-green-gradient py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">
            {c.ctaHeading}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-muted">
            {c.ctaLead}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://line.me/ti/p/EF5782JXqJ"
              target="_blank"
              rel="noopener noreferrer"
              className="gradient-line inline-flex items-center gap-2 rounded-md px-10 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:brightness-110"
            >
              <MessageCircle size={16} />
              {c.ctaLine}
            </a>
            <Link
              href="/contact"
              className="cta-gradient-outline inline-flex items-center gap-2 rounded-md px-10 py-4 text-sm font-semibold transition-all duration-200 hover:brightness-110"
            >
              {c.ctaContact}
              <ArrowRight size={16} />
            </Link>
          </div>
          <p className="mx-auto mt-5 max-w-xl text-xs leading-relaxed text-text-muted">
            {c.ctaLineNote}
          </p>
        </div>
      </section>
    </div>
  );
}
