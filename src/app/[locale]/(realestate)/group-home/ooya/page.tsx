// /group-home/ooya（グループホーム向け物件・大家募集ページ）＝2026-09-24新設・日本語版のみ
// 方式＝RealestateServicePage（手本=/souzoku/akiya/koishikawa）。ja先行公開：availableLocales:["ja"]・sitemap側も locales:["ja"]。
// 原稿＝docs/gh-owner/10_page.md（指示書 v1.0 第5章・12要素の順）。根拠＝docs/gh-owner/01_konkyo.md。
//
// 【役割分担（luck428-column-seo 第3条・カニバリ防止）】
//   本ページ＝貸す側の受け皿（募集条件・一般の賃貸との違い・流れ・誰がやるか・専用フォーム）。
//   /column/kodate-akiya-group-home-ni-kasu＝深掘り（仕組み・3大不安・契約書で決める5点）。
//   /toushi/group-home・/group-home＝開設する事業者向け。タイトル・H1を食い合わせない。
//
// 【コンプライアンス（shigyo-compliance-gate・指示書 第8章）】
//   ・消防設備・用途変更の要否、賃料の水準、個別物件の可否、近隣同意「不要」の言い切りを書かない。
//     要否は消防署・建築士と特定行政庁が判断し、当社は論点の整理までと明記。
//   ・分離受任の一文（独立した事業体・別々にご契約）と「当社は紹介料を受け取りません」を固定文言で置く。
//   ・将来の賃料・収益の言い切りは宅建業法第47条の2（断定的判断の提供の禁止）に触れるため書かない。
//   ・実績数字と、指示書 第8章の一覧にある禁止語（一体提供・誇大・煽り・経歴の定型句）を使わない。
//
// 【法令の一次確認（2026-09-23・e-Gov 法令API。docs/gh-owner/01_konkyo.md）】
//   ・共同生活援助の定義は障害者総合支援法第5条**第18項**（指示書付録Bの「第17項」は現行では自立生活援助）。
//   ・宅建業法第34条の2（媒介契約書面）は条文上「売買又は交換」の媒介契約が対象で貸借の媒介を含まない
//     ＝指示書 5-1・5-4 の「第34条の2」は引用せず、第34条（取引態様の明示）・第46条（報酬）に置き換えた。
//   ・消防法施行令別表第一(6)項ロ(5)の入居者の区分の数値は総務省令に委任＝本文に「区分4以上」は書かない。
//   ・文京区の近隣説明の運用は区の公開ページに記載なし＝FAQ6 は「自治体の運用による」に留める。
//
// 【固定文言】title・H1・直答ブロック・事業者主語の一文・分離受任の一文・留保1行・3点は指示書 5-2 のまま
//   （一字も変えない）。社労士事務所名だけは実行時結合（SR_OFFICE_NAME）で同じ文字列を生成する
//   （クライアント到達可能なファイルに事務所名の連続リテラルを置かない規約に合わせる）。
import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, PERSON_ID, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { RealestateServicePage, ReH2 } from "@/components/shared/RealestateServicePage";
import { Faq, type FaqItem } from "@/components/shared/Faq";
import { CannotHandle } from "@/components/shared/CannotHandle";
import { TelLink } from "@/components/shared/TelLink";
import { GhOwnerCta } from "@/components/group-home/GhOwnerCta";
import { GhOwnerForm } from "@/components/group-home/GhOwnerForm";
import { OFFICE } from "@/lib/shared/office";
import { SR_OFFICE_NAME } from "@/lib/shared/sr-name";
import { SR_BIO, SR_ENTITY_LABEL } from "@/lib/shared/sr-label";

const PATH = "/group-home/ooya";
const PAGE_URL = `${SITE_URL}${PATH}`;
const ORG_ID = `${SITE_URL}/#organization`;

/** 可視の最終更新日。WebPage JSON-LD の dateModified と必ず同じ日付にする */
const LAST_UPDATED_ISO = "2026-09-24";
const LAST_UPDATED_JA = "2026年9月24日";

// ─── 固定文言（指示書 5-2） ───
const TITLE =
  "グループホーム向けに貸したい大家さんへ｜戸建て・空き家・アパートの物件募集（文京区・東京23区） | 四葉不動産";
const DESCRIPTION =
  "戸建て・空き家・アパートをグループホーム（共同生活援助）の事業者に貸したい大家さんの相談窓口。文京区を中心に東京23区で募集中。用途・消防・貸主承諾の論点整理から事業者との調整、貸主側の媒介まで四葉不動産が行います。相談無料、貸すか未定でも可。";
const H1 = "戸建て・空き家・アパートを、グループホーム向けに貸しませんか——物件をお持ちの大家さんの相談窓口";
const JA_ANSWER_BLOCK =
  "四葉不動産は、障害福祉グループホーム（共同生活援助）を開設する事業者に貸す戸建て・空き家・アパートを、文京区を中心に東京23区で募集しています。貸すか未定でも、図面だけでも、無料でご相談いただけます。適合性の整理から事業者との調整、貸主側の媒介まで当社が行います。";
const JA_RESERVATION =
  "貸せるかどうか、どんな設備や手続が要るかは、物件と入居者像で変わります。可否は現地と役所・消防署の確認を経て、資格者が確認します。";
const JA_OPERATOR_SENTENCE =
  "四葉不動産株式会社（宅地建物取引業 東京都知事(1)第113304号）は、文京区小日向を拠点に、グループホーム（共同生活援助）を開設する事業者に貸す物件を募集し、用途・消防・貸主承諾など契約前に確認すべき論点の整理、事業者とのマッチング、貸主側の媒介を行っています。";
const JA_SEPARATION_SENTENCE = `指定申請の書類作成は四葉行政書士事務所が、開設後の労務は${SR_OFFICE_NAME}が、それぞれ独立した事業体として受任し、別々にご契約いただきます。消防設備の要否は管轄の消防署、用途変更や確認申請の要否は建築士と特定行政庁、登記は司法書士、税務は税理士、紛争は弁護士へ、それぞれ直接ご依頼いただく形をご案内します。当社は紹介料を受け取りません。`;

const JA_HERO_POINTS = [
  "対象：戸建て・空き家・アパート・一棟物件（相続した実家、長く空室の物件、事業利用について相談できる物件）",
  "エリア：文京区を中心に東京23区",
  "相談無料。貸すか未定でも、図面や募集図面だけでも、売却ではなく賃貸のご相談でも構いません",
];

// H2-1 こんな物件を探しています（指示書 5-5）
const JA_BUKKEN: { type: string; why: string; check: string }[] = [
  {
    type: "戸建て（部屋数の多い住宅）",
    why: "居間・食堂・浴室など共用部を確保しやすい",
    check: "用途変更の要否（延べ面積）、居室面積、消防設備、貸主承諾の範囲",
  },
  {
    type: "空き家・相続した実家",
    why: "住宅地の立地が共同生活援助の住まいと親和性がある",
    check: "登記名義、境界、残置物、耐震・劣化の状況",
  },
  {
    type: "アパート・一棟",
    why: "居室の独立性を保ちやすい。本体住居やサテライト型の候補になる",
    check: "各戸の居室面積、消防設備、既存入居者との関係",
  },
  {
    type: "事業利用について相談できる物件",
    why: "用途を住宅に限らない前提で契約できる",
    check: "転貸・用途の承諾を契約書に残す",
  },
];

// H2-2 一般の賃貸との違い（断定・数字なし。深掘りは貸し手向けコラムへ）
const JA_HIKAKU: { axis: string; general: string; gh: string }[] = [
  {
    axis: "借主",
    general: "入居する個人",
    gh: "運営する事業者（法人が多い）。住むのは障害のある方で、世話人などの職員が出入りする",
  },
  {
    axis: "使い方",
    general: "借主とその家族の住まい",
    gh: "共同生活援助の住まいとして運営する。用途の承諾を契約で明示する",
  },
  {
    axis: "改修と原状回復",
    general: "原則そのまま使う。原状回復は通常損耗を除く",
    gh: "手すり・設備など事業者側の改修が入ることがある。範囲と復旧を契約で定める",
  },
  {
    axis: "近隣",
    general: "特段の説明はないことが多い",
    gh: "事業者が説明を行うのが一般的（自治体の運用による）。開設後は地域の関係者を含む「地域連携推進会議」をおおむね年1回開く仕組みがある",
  },
  {
    axis: "賃料の決まり方",
    general: "周辺の相場",
    gh: "事業者の事業計画と物件の条件。当社は相場と事業者目線の両方を整理する",
  },
  {
    axis: "契約期間の考え方",
    general: "更新型の契約が多い",
    gh: "事業者は継続して運営する前提で考えることが多い。期間・更新・中途解約を契約で定める",
  },
];

// H2-3 相談の流れ（6段階）
const JA_NAGARE: { step: string; body: React.ReactNode }[] = [
  { step: "物件情報の送信", body: "下のフォーム、LINE、電話のいずれかで。図面だけ、住所と種別だけでも構いません。" },
  {
    step: "概要確認",
    body: "所在地・種別・面積・利用状況から、グループホームとしての利用可能性の論点を洗い出します。",
  },
  { step: "現地確認（必要に応じて）", body: "建物の状態、共用部、避難経路、周辺環境を見ます。" },
  {
    step: "利用可能性の整理",
    body: (
      <>
        用途変更の要否、消防設備、貸主承諾の範囲、転貸の扱いを論点として整理します。可否の判断は建築士・特定行政庁・消防署が行い、その確認の段取り（
        <Link href="/legal/column/group-home-keiyakumae-jizen-kyogi" className="text-primary underline">
          契約前の事前協議
        </Link>
        ）をご案内します。
      </>
    ),
  },
  {
    step: "借主候補の事業者との調整",
    body: "事業者の計画と物件条件を突き合わせ、条件・改修・原状回復・近隣説明の考え方を整理します。",
  },
  {
    step: "条件が合えば賃貸借契約",
    body: "契約書に用途の承諾、改修と原状回復の範囲、転貸の扱い、期間・更新・中途解約を落とし込みます。",
  },
];

// H2-4 誰に相談すればよいですか（指示書 5-4）
const JA_YAKUWARI: { what: string; who: string; note: string; ours?: boolean }[] = [
  {
    what: "物件の募集、適合性の論点整理、事業者とのマッチング、貸主側の媒介",
    who: "四葉不動産株式会社",
    note: "宅地建物取引業法第34条の取引態様の明示（媒介）に基づく。報酬は成約時のみ・第46条の範囲",
    ours: true,
  },
  {
    what: "指定申請の書類作成・提出（事業者側）",
    who: "四葉行政書士事務所",
    note: "独立した事業体として受任し、別々にご契約いただく",
  },
  { what: "開設後の人事労務（事業者側）", who: SR_ENTITY_LABEL, note: "同上" },
  {
    what: "消防設備（スプリンクラー・自動火災報知設備等）の要否",
    who: "管轄の消防署、消防設備士",
    note: "当社は要否の判断をしない",
  },
  {
    what: "用途変更・確認申請の要否、建築基準法への適合",
    who: "建築士、特定行政庁（文京区等）",
    note: "同上",
  },
  { what: "賃貸借契約の紛争、近隣との紛争", who: "弁護士", note: "直接ご依頼いただく形をご案内" },
  { what: "登記、税務", who: "司法書士、税理士", note: "同上" },
];

// FAQ（指示書 5-3・10問固定）。表示と FAQPage JSON-LD を同じ配列から生成（Faq 部品）。links は Answer に含めない。
const JA_FAQ: FaqItem[] = [
  {
    q: "グループホームに貸す場合、通常の賃貸と何が違いますか。",
    a: "借主が個人ではなく事業者（法人）で、建物を障害のある方の住まいとして運営する点が違います。改修と原状回復の範囲、近隣への説明、契約期間の考え方を、契約前に取り決めておくことが要点です。",
    links: [{ href: "/column/kodate-akiya-group-home-ni-kasu", label: "貸す仕組みと契約書で決める5点" }],
  },
  {
    q: "どんな物件が向いていますか。",
    a: "居室を複数確保でき、居間・食堂・浴室などの共用部をとれる戸建てや、アパート一棟が候補になります。相続した実家や長く空室の物件も対象です。向き不向きは物件ごとに現地で確認します。",
    links: [
      { href: "/legal/column/group-home-kodate-apart-satellite-chigai", label: "戸建て型・アパート型・サテライト型の違い" },
    ],
  },
  {
    q: "古い戸建てでも相談できますか。",
    a: "相談できます。築年数だけで判断せず、耐震・劣化の状況、検査済証の有無、用途変更の要否などを整理したうえで、事業者側の計画と合うかを検討します。検査済証が無い建物の考え方は下の記事にまとめています。",
    links: [
      { href: "/column/kensazumisho-nashi-bukken-fukushi-youto-henko", label: "検査済証が無い建物を福祉用途に使うには" },
    ],
  },
  {
    q: "消防設備は必要ですか。費用は誰が負担しますか。",
    a: "必要な設備は物件の規模・構造と入居者像で変わり、要否は管轄の消防署が判断します。費用の負担は契約で決めます。一般に借主（事業者）の負担とする例が多いものの、契約によります。当社は要否の判断をしません。",
    links: [{ href: "/legal/column/group-home-shobo-setsubi-sprinkler", label: "消防設備の要否（スプリンクラー・(6)項ロ／ハ）" }],
  },
  {
    q: "用途変更の手続は必要ですか。",
    a: "建物の延べ面積や現在の用途によって、建築基準法の用途変更の確認申請が要る場合と要らない場合があります。要否は建築士と特定行政庁（文京区など）が判断します。当社は論点の整理までを行います。",
    links: [{ href: "/legal/column/group-home-kenchikukijunho-youto-henko", label: "建築基準法と用途変更の要否" }],
  },
  {
    q: "近隣への説明はどうなりますか。",
    a: "開設にあたって近隣の同意は法令上の指定要件ではありませんが、事業者が近隣へ説明を行うのが一般的で、自治体の運用によります。説明は事業者が行うものとして、その手順と貸主の関わり方を契約前に整理します。",
    links: [{ href: "/legal/column/group-home-kinrin-setsumei", label: "近隣説明の進め方" }],
  },
  {
    q: "原状回復や契約条件は、どう考えればよいですか。",
    a: "手すりや設備の設置など事業者が行う改修の範囲と、退去時に元に戻す範囲を、契約書に具体的に書いておくことが基本です。用途（共同生活援助）の承諾、転貸の可否、中途解約の条件もあわせて取り決めます。",
    links: [{ href: "/column/kodate-akiya-group-home-ni-kasu", label: "契約書で決めておくこと" }],
  },
  {
    q: "家賃はどう決まりますか。",
    a: "事業者の事業計画と物件の条件（広さ・部屋数・改修の要否・立地）で決まります。当社は近隣の賃料事例と事業者側の目線の両方を整理してお示しし、貸主様が判断できる材料をそろえます。将来の賃料や収益の約束はしません。",
    links: [{ href: "/column/kodate-akiya-group-home-ni-kasu", label: "家賃の考え方（貸し手向けコラム）" }],
  },
  {
    q: "まだ貸すか決めていなくても相談できますか。",
    a: "相談できます。貸すか売るか、そのまま持つかを含めて、選択肢と論点を整理するところから始められます。図面や募集図面だけでも、物件の概要を伺うところからお受けします。",
    links: [{ href: "/souzoku/akiya", label: "相続した空き家の管理・活用・売却" }],
  },
  {
    q: "相談や物件の登録に費用はかかりますか。",
    a: "相談・物件の登録は無料です。報酬は賃貸借契約が成立したときのみ、宅地建物取引業法第46条に基づく告示の範囲内でいただきます。契約に至らなければ費用は発生しません。",
    links: [{ href: "/ryokin", label: "不動産の料金" }],
  },
];

/**
 * 匿名事例の枠（指示書 決定6）。空なら節ごと非表示。成約後に浦松が PR で追加する。
 * 書式は /jirei と同じ（実在の取引ではない・「※モデルケースです」を各事例に添える）。
 */
type ModelCase = { id: string; title: string; body: string };
const CASES: ModelCase[] = [];
const CASE_NOTICE =
  "本節の事例は、実際のご相談を想定したモデルケースです。特定の実在のお客様・取引を紹介するものではありません。";

// この記事の根拠（docs/gh-owner/01_konkyo.md から転記・参照日 2026年9月23日）
const JA_KONKYO: { what: string; source: string }[] = [
  {
    what: "共同生活援助（グループホーム）の定義",
    source: "障害者総合支援法（平成17年法律第123号）第5条第18項（現行版 2026年9月3日施行）",
  },
  {
    what: "共同生活住居の立地（住宅地等）・入居定員・居室面積（収納設備等を除き7.43㎡以上）",
    source:
      "指定障害福祉サービス基準（平成18年厚生労働省令第171号）第210条第1項・第4項・第8項第1号・第2号（現行版 2025年10月1日施行）",
  },
  { what: "消防用設備等の設置・維持義務", source: "消防法（昭和23年法律第186号）第17条第1項（現行版 2025年6月1日施行）" },
  {
    what: "グループホームの防火対象物の区分（(6)項ロ／ハ）、スプリンクラー設備・自動火災報知設備の設置対象",
    source:
      "消防法施行令（昭和36年政令第37号）別表第一(6)項ロ(5)・ハ(5)、第12条第1項第1号ハ、第21条第1項第1号イ・ロ（現行版 2025年10月1日施行）。(6)項ロに当たる入居者の区分は総務省令の定めによる（本ページでは数値を書かない）",
  },
  {
    what: "用途変更の確認申請（特殊建築物・用途部分200㎡超）",
    source: "建築基準法（昭和25年法律第201号）第6条第1項第1号・第87条第1項（現行版 2026年5月27日施行）",
  },
  {
    what: "賃貸借、転貸の承諾、原状回復",
    source: "民法（明治29年法律第89号）第601条・第612条第1項・第2項・第621条（現行版 2026年6月24日施行）",
  },
  {
    what: "建物賃貸借の更新・更新拒絶の正当事由・定期建物賃貸借",
    source: "借地借家法（平成3年法律第90号）第26条第1項・第28条・第38条第1項（現行版 2026年5月21日施行）",
  },
  {
    what: "取引態様の明示、報酬、断定的判断の提供の禁止",
    source:
      "宅地建物取引業法（昭和27年法律第176号）第34条第1項・第2項、第46条第1項・第2項、第47条の2第1項（現行版 2026年4月1日施行）",
  },
  {
    what: "指定申請前の区市町村との事前相談",
    source:
      "東京都福祉局「令和8年度障害福祉サービス等事業者の指定に関する区市町村協議等について」（2026年1月13日更新・2026年9月23日取得）",
  },
  {
    what: "消防署への届出（工事等計画届・使用開始届は7日前まで）",
    source: "東京消防庁「新たにテナントを使用する皆様へ」ほか（火災予防条例第56条・第56条の2の引用・2026年9月23日取得）",
  },
  {
    what: "文京区の運用（補助金の事前相談、地域連携推進会議）",
    source:
      "文京区「文京区障害者グループホーム等整備費等補助金」「地域連携推進会議について」（2026年9月23日取得）。近隣説明の運用は区の公開ページに記載がなく未検証",
  },
];

/** WebPage（指示書 6-3）。組織・人物は既存 @id の参照にとどめる。speakable＝直答ブロックと「誰に相談」節 */
const WEBPAGE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${PAGE_URL}#webpage`,
  url: PAGE_URL,
  name: TITLE,
  description: DESCRIPTION,
  inLanguage: "ja",
  datePublished: LAST_UPDATED_ISO,
  dateModified: LAST_UPDATED_ISO,
  about: [{ "@id": ORG_ID }],
  mentions: [{ "@id": PERSON_ID }],
  publisher: { "@id": ORG_ID },
  mainEntity: { "@id": `${PAGE_URL}#service` },
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: [".gh-owner-answer", ".gh-owner-who"],
  },
};

/** Service（指示書 6-3）。@id・name・provider・author・url はシェルが出力。ここは追加項目と areaServed の上書き */
const SERVICE_EXTRA = {
  serviceType:
    "障害福祉グループホーム（共同生活援助）に貸す戸建て・空き家・アパートの募集、適合性の論点整理、事業者とのマッチング、貸主側の媒介",
  areaServed: "東京都文京区を中心とする東京23区",
  audience: { "@type": "Audience", audienceType: "戸建て・空き家・アパートの所有者（大家）" },
  // Offer は既存（OrganizationJsonLd の makesOffer）に合わせて価格を書かず description のみ
  offers: {
    "@type": "Offer",
    description: "相談・物件の登録は無料。報酬は賃貸借契約の成立時のみ（宅地建物取引業法第46条の告示の範囲内）",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    businessKey: "realestate",
    title: TITLE,
    description: DESCRIPTION,
    path: PATH,
    keywords: [
      "グループホーム 貸したい",
      "空き家 グループホーム 貸す",
      "戸建て グループホーム 賃貸 大家",
      "障害者グループホーム 物件 募集 東京",
      "文京区 空き家 グループホーム",
    ],
    locale: "ja",
    absoluteTitle: true,
    availableLocales: ["ja"],
  });
}

const th = "border border-border px-3 py-2";
const td = "border border-border px-3 py-2";

export default async function Page() {
  return (
    <>
      <JsonLd data={WEBPAGE_JSONLD} />
      <RealestateServicePage
        path={PATH}
        answerBlock={<span className="gh-owner-answer">{JA_ANSWER_BLOCK}</span>}
        crumbs={[
          { name: "ホーム", href: "/" },
          { name: "グループホーム開設", href: "/group-home" },
          { name: "大家募集" },
        ]}
        serviceName="グループホーム向け物件の募集・貸主側の媒介"
        serviceExtra={SERVICE_EXTRA}
        heroSrc="/hero/realestate-akiya-16x9.webp"
        heroAlt="戸建て・空き家のイメージ（グループホーム向けに貸す物件のご相談）"
        h1={H1}
        ctaContactHref="#form"
        authorBio={`浦松 丈二｜四葉不動産株式会社 代表取締役・専任宅地建物取引士。四葉行政書士事務所 代表行政書士。${SR_BIO.ja}。`}
        lead={
          <>
            <p className="text-sm text-text-muted">{JA_RESERVATION}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-relaxed">
              {JA_HERO_POINTS.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <div className="mt-5">
              <GhOwnerCta location="hero" />
            </div>
            <p className="mt-3 text-sm text-text-muted">最終更新：{LAST_UPDATED_JA}</p>
          </>
        }
        internalLinks={[
          { href: "/column/kodate-akiya-group-home-ni-kasu", label: "戸建て・空き家をグループホームに貸すという選択（貸し手向けコラム）" },
          { href: "/column/group-home-owner-shodaku", label: "オーナーの4つの懸念と、承諾までの準備" },
          { href: "/group-home", label: "グループホーム開設の完全ガイド（事業者向け）" },
          { href: "/toushi/group-home", label: "グループホームに使える物件の探し方（事業者向け）" },
          { href: "/souzoku/akiya", label: "相続した空き家｜管理・活用・売却" },
          { href: "/legal/services/shogai-fukushi", label: "指定申請（四葉行政書士事務所・別契約）" },
          { href: "/voices", label: "お客様の声" },
          { href: "/contact?intent=gh-owner", label: "お問い合わせ（フォーム以外）" },
        ]}
        crossLinkLead="指定申請の書類作成は併設の四葉行政書士事務所が別契約で受任します。"
      >
        {/* 2. 事業者主語の一文＋分離受任の一文（固定文言） */}
        <div className="rounded-xl border border-border bg-surface p-4 text-sm leading-relaxed text-text">
          <p>{JA_OPERATOR_SENTENCE}</p>
          <p className="mt-3 text-text-muted">{JA_SEPARATION_SENTENCE}</p>
        </div>

        {/* 3. こんな物件を探しています */}
        <div>
          <ReH2>こんな物件を探しています</ReH2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-primary-tint text-left">
                  <th className={th}>種別</th>
                  <th className={th}>向く理由（一般論）</th>
                  <th className={th}>契約前に確認すること</th>
                </tr>
              </thead>
              <tbody className="text-text">
                {JA_BUKKEN.map((b) => (
                  <tr key={b.type}>
                    <td className={`${td} font-medium text-ink`}>{b.type}</td>
                    <td className={td}>{b.why}</td>
                    <td className={td}>{b.check}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 leading-relaxed text-text">
            <strong className="text-ink">条件に合わないように見えても、まずご相談ください。</strong>
            表の「確認すること」は、当社が契約前に一つずつ整理します。
          </p>
        </div>

        {/* 4. 一般の賃貸との違い（断定・数字なし） */}
        <div>
          <ReH2>グループホームに貸すと、一般の賃貸と何が違いますか</ReH2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-primary-tint text-left">
                  <th className={th}> </th>
                  <th className={th}>一般の賃貸（住居）</th>
                  <th className={th}>グループホームに貸す場合</th>
                </tr>
              </thead>
              <tbody className="text-text">
                {JA_HIKAKU.map((h) => (
                  <tr key={h.axis}>
                    <td className={`${td} whitespace-nowrap font-medium text-ink`}>{h.axis}</td>
                    <td className={td}>{h.general}</td>
                    <td className={td}>{h.gh}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 leading-relaxed text-text">
            金額や期間の目安は、物件と事業者で変わるためここには書きません。貸す仕組み、大家さんが不安に思う点、契約書で決めておくことの詳しい解説は、貸し手向けのコラムにまとめています。
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            <li>
              <Link href="/column/kodate-akiya-group-home-ni-kasu" className="text-primary underline">
                戸建て・空き家を「グループホームに貸す」という選択——大家さんが最初に知りたいこと
              </Link>
            </li>
            <li>
              <Link href="/column/group-home-owner-shodaku" className="text-primary underline">
                「グループホームには貸せない」と断られたら——オーナーの4つの懸念と、承諾までの準備
              </Link>
              （事業者側が貸主に何を説明するかが分かります）
            </li>
          </ul>
        </div>

        {/* 5. 四葉が行うこと（相談の流れ） */}
        <div>
          <ReH2>四葉が行うこと（相談の流れ）</ReH2>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-text">
            {JA_NAGARE.map((n) => (
              <li key={n.step}>
                <strong className="text-ink">{n.step}</strong>：{n.body}
              </li>
            ))}
          </ol>
          <p className="mt-4 rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text">
            <strong className="text-ink">当社の立場</strong>：貸主様側の媒介です。取引態様は媒介であることを明示します（宅地建物取引業法第34条）。報酬は賃貸借契約が成立したときのみで、同法第46条に基づく告示の範囲内です。借主側（事業者）の媒介を当社が兼ねる場合は、その旨を事前にお伝えします。
          </p>
        </div>

        {/* 6. CTA②（流れの直後） */}
        <GhOwnerCta
          location="mid"
          lead="まだ貸すか決めていなくても、図面だけでも構いません。物件の概要を伺うところから始めます。"
          lineLabel="LINEで図面を送る"
        />

        {/* 7. 誰に相談すればよいですか（speakable: .gh-owner-who） */}
        <div className="gh-owner-who">
          <ReH2>誰に相談すればよいですか</ReH2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-primary-tint text-left">
                  <th className={th}>すること</th>
                  <th className={th}>誰が</th>
                  <th className={th}>備考</th>
                </tr>
              </thead>
              <tbody className="text-text">
                {JA_YAKUWARI.map((y) => (
                  <tr key={y.what}>
                    <td className={td}>{y.ours ? <strong className="text-ink">{y.what}</strong> : y.what}</td>
                    <td className={td}>{y.ours ? <strong className="text-ink">{y.who}</strong> : y.who}</td>
                    <td className={td}>{y.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">{JA_SEPARATION_SENTENCE}</p>
          <p className="mt-2 text-sm leading-relaxed text-text">
            ご相談の入口は一つの窓口で構いません。どの専門家に何を頼むかは、当社が論点を整理したうえでご案内します。
          </p>
        </div>

        {/* 8. FAQ（FAQPage JSON-LD＝同じ配列から生成。日本語版のみのページのため常に出力） */}
        <Faq items={JA_FAQ} heading="よくある質問" withJsonLd bare openFirst={false} />

        {/* 9. 専用フォーム（#form） */}
        <GhOwnerForm />

        {/* 10. 信頼性ブロック（会社情報・継続受付の一文・お客様の声・匿名事例の枠） */}
        <div>
          <ReH2>四葉不動産株式会社について</ReH2>
          <dl className="mt-3 grid gap-x-4 gap-y-2 text-sm text-text sm:grid-cols-[8rem_1fr]">
            <dt className="font-medium text-ink">商号</dt>
            <dd>四葉不動産株式会社</dd>
            <dt className="font-medium text-ink">免許</dt>
            <dd>宅地建物取引業 東京都知事(1)第113304号</dd>
            <dt className="font-medium text-ink">代表</dt>
            <dd>代表取締役 浦松丈二（宅地建物取引士・行政書士・{SR_BIO.ja}）</dd>
            <dt className="font-medium text-ink">所在地</dt>
            <dd>〒112-0006 {OFFICE.address}（{OFFICE.access}）</dd>
            <dt className="font-medium text-ink">電話</dt>
            <dd>
              <TelLink phone={OFFICE.tel} location="gh_owner_trust" className="text-primary underline">
                {OFFICE.tel}
              </TelLink>
            </dd>
          </dl>
          <p className="mt-4 leading-relaxed text-text">
            グループホームを開設する事業者からの物件相談を継続的に受けています。事業者側がどこで困り、貸主側に何を求めるかを把握したうえで、貸主様の側に立って整理します。
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
            <li>
              <Link href="/voices#realestate-2" className="text-primary underline">
                事業者側の声（S社・グループホーム用の物件探し）
              </Link>
            </li>
            <li>
              <Link href="/voices#realestate-6" className="text-primary underline">
                貸主側の声（Hさん・空き家を貸すか売るか）
              </Link>
            </li>
          </ul>
          {CASES.length > 0 && (
            <div className="mt-6">
              <h3 className="font-serif text-lg font-semibold text-ink">ご相談の例（モデルケース）</h3>
              <p className="mt-2 text-xs leading-relaxed text-text-muted">{CASE_NOTICE}</p>
              {CASES.map((c) => (
                <div key={c.id} id={c.id} className="mt-4 scroll-mt-24 rounded-xl border border-border bg-surface p-4">
                  <p className="font-medium text-ink">{c.title}</p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-text">{c.body}</p>
                  <p className="mt-3 text-xs text-text-muted">※モデルケースです</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 11. この記事の根拠＋留保＋文責＋最終更新 */}
        <div>
          <ReH2>この記事の根拠</ReH2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-primary-tint text-left">
                  <th className={th}>内容</th>
                  <th className={th}>根拠</th>
                </tr>
              </thead>
              <tbody className="text-text">
                {JA_KONKYO.map((k) => (
                  <tr key={k.what}>
                    <td className={td}>{k.what}</td>
                    <td className={td}>{k.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-text-muted">法令は e-Gov 法令検索で 2026年9月23日に現行条文を確認。行政の運用は各公式ページの取得日を併記。</p>
          <p className="mt-3 leading-relaxed text-text">
            本ページは一般的な情報提供です。個別の物件について貸せるかどうか、どの設備や手続が要るかは、現地と役所・消防署の確認を経て、それぞれの資格者が判断します。当社は貸主側の媒介として論点の整理と事業者との調整を行い、消防・建築・登記・税務・紛争は、消防署・建築士と特定行政庁・司法書士・税理士・弁護士へ直接ご依頼いただく形をご案内します。
          </p>
          <p className="mt-3 text-xs leading-relaxed text-text-muted">
            文責：浦松丈二（四葉不動産株式会社 代表取締役・宅地建物取引士（東京）第293544号／四葉行政書士事務所 代表行政書士・登録番号第25087022号）。
            <Link href="/about/uramatsu" className="text-primary underline">
              執筆者について
            </Link>
          </p>
          <p className="mt-2 text-xs text-text-muted">最終更新：{LAST_UPDATED_JA}</p>
        </div>

        <CannotHandle bare />
      </RealestateServicePage>
    </>
  );
}
