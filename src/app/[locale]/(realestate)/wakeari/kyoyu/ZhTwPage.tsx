// /wakeari/kyoyu の繁体字（zh-tw）版＝2026-09-24 Phase 3 で追加。page.tsx（日本語版）の逐語訳・構造も同じ。
// 訳の決まりは src/lib/wakeari-zh-tw.ts 冒頭を参照（事業体名は日本語表記・法令名は日本語の漢字・買取＝以收購業者為買方的仲介）。
// ハブ（/wakeari）・再建築不可・狭小地・/souzoku/chinese は日本語のみ＝日本語版URLへ「（日文）」と明示してリンクする。
// 遺產分割協議書＝四葉行政書士事務所（獨立的事業體・分別簽約）。登記＝司法書士。共有物分割請求・所在不明共有人的裁判＝律師。稅務＝稅理士。
// 本公司不進行共有人之間的交涉・代理。
import Link from "next/link";
import { RealestateServicePage, ReH2 } from "@/components/shared/RealestateServicePage";
import { CannotHandle } from "@/components/shared/CannotHandle";
import { Faq } from "@/components/shared/Faq";
import type { FaqItem } from "@/components/shared/Faq";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { SpeakableJsonLd } from "@/components/seo/SpeakableJsonLd";
import { getColumns, getLocalizedColumn } from "@/lib/columns";
import { addLocalePrefix } from "@/lib/locale";
import { WakeariRoleTable } from "@/components/wakeari/WakeariRoleTable";
import { WakeariSources, type WakeariSource } from "@/components/wakeari/WakeariSources";
import { WAKEARI_COLUMN_SLUGS, WAKEARI_CONTACT_HREF, WAKEARI_CONTACT_INTENT, WAKEARI_PAGES } from "@/lib/wakeari";
import {
  WAKEARI_TW_ANSWER_RESERVATION,
  WAKEARI_TW_AUTHOR_BIO,
  WAKEARI_TW_LABELS,
  WAKEARI_TW_LAST_UPDATED,
  WAKEARI_TW_LAST_UPDATED_ISO,
  WAKEARI_TW_SERVICE_OFFER,
} from "@/lib/wakeari-zh-tw";

const PATH = WAKEARI_PAGES.kyoyu.path;

/** WAKEARI_PAGES.kyoyu の繁体字訳 */
export const TW_META = {
  title: "文京區共有名義不動產的出售與整理｜持分出售・遺產分割協議書的諮詢窗口 | 四葉不動産",
  description:
    "共有名義的土地・房屋，出路有三種：全員一起出售、只出售持分、出售前先整理名義。出售的仲介由四葉不動産株式会社承辦，遺產分割協議書的製作由四葉行政書士事務所，各以獨立的事業體分別受理；登記交由司法書士，紛爭交由律師。文京區小日向。",
  h1: "共有的土地・房屋：全員一起出售、出售持分、整理名義",
  shortLabel: "共有名義",
  serviceName: "共有不動產的出售仲介・持分出售的出路諮詢",
  serviceType: "共有名義土地・建物的出售仲介與持分出售的比較",
  serviceDescription:
    "針對共有人全員一起出售、只出售持分、出售前的名義整理，備齊出售時與繼續持有時的數字加以比較，並進行出售的仲介。遺產分割協議書的製作由四葉行政書士事務所以獨立的事業體另行簽約受任，登記由司法書士、共有物分割請求由律師負責。",
  keywords: [
    "日本 共有 不動產 出售 文京區",
    "日本 共有持分 出售",
    "共有人 反對 無法出售 日本",
    "日本 共有人 下落不明 持分",
    "兄弟姊妹 共有 老家 出售 日本",
    "日本 遺產分割協議書 共有",
  ],
};

/** WAKEARI_ANSWER.kyoyu の繁体字訳 */
export const TW_ANSWER =
  "共有的土地・房屋，出路有三種：①共有人全員一起出售、②只出售自己的持分、③出售前先整理名義。四葉不動産負責出售的仲介與出路的比較；遺產分割協議書的製作，由四葉行政書士事務所以獨立的事業體受任。";

/** WAKEARI_FAQ.kyoyu（8問）の逐語訳・順番も同じ */
export const TW_FAQ: FaqItem[] = [
  {
    q: "共有人之一反對出售。還能賣嗎？",
    a: "要將共有物整體出售，需要共有人全員的同意（民法第251條第1項），只要有一人反對，整體就無法出售。只出售自己的持分，不需同意即可進行，但買方與價格會受到限制。經協商仍無法解決時的共有物分割請求（民法第256條・第258條）是法院的程序，其代理屬於律師的業務。本公司會備齊出售時與繼續持有時的數字，提供協商的材料。",
  },
  {
    q: "可以只出售自己的持分嗎？",
    a: "可以。不需要其他共有人的同意。但買方容易限於其他共有人，或專門收購持分的業者，價格一般會低於整體出售時依比例分配的金額。本公司會先向其他共有人確認收購的意願，若有困難，再向收購持分的業者詢價，並列各方的報價。",
  },
  {
    q: "有人只買持分嗎？價格怎麼思考？",
    a: "除了其他共有人之外，也有專門收購持分的業者。只有持分無法使用建物，且需要與其他共有人協調，因此一般會低於將整體價格依持分比例分配的金額。具體水準依物件與共有人的狀況而異，本公司會以書面說明估價的依據（宅地建物取引業法第34條之2第2項）。",
  },
  {
    q: "遺產分割協議書由誰製作？費用是分開的嗎？",
    a: "遺產分割協議書與繼承關係說明圖的製作，由四葉行政書士事務所以獨立的事業體受任，請分別簽約。費用也與不動產的仲介報酬分開。繼承登記的申請請直接委託司法書士，遺產稅請直接委託稅理士，我們會說明直接委託的方式。繼承人之間有紛爭時，屬於律師的業務。",
  },
  {
    q: "有下落不明的共有人時，該怎麼辦？",
    a: "依2023年4月1日施行的修正民法，新設了以法院裁判取得所在不明等共有人之持分的制度（第262條之2），以及取得由其他共有人全員向第三人讓渡之權限的制度（第262條之3）。因繼承而產生的持分，以繼承開始後已經過10年為要件。由於是法院的程序，將為您轉介律師，本公司則備齊不動產方面的數字。",
  },
  {
    q: "尚未完成繼承登記的共有不動產，能出售嗎？",
    a: "維持現狀無法出售。需先完成繼承登記、確定賣方後再出售。繼承登記自2024年4月1日起義務化，須於知悉繼承、且知悉取得所有權之日起3年以內申請（不動產登記法第76條之2第1項）。遺產分割協議書的製作由四葉行政書士事務所（另行簽約）、登記的申請由司法書士負責。",
  },
  {
    q: "共有人之間的協商，可以由貴公司代為進行嗎？",
    a: "本公司不進行代理・交涉。共有人之間的協商由當事人彼此進行；有對立、有不願協商的共有人等具爭訟性的情況，將為您轉介律師。本公司所做的，是以同一把尺備齊出售時・繼續持有時・出售持分時的數字，將協商的材料整理成書面。",
  },
  {
    q: "諮詢之後，會調查什麼、報告什麼？",
    a: "以登記事項證明書確認共有人・持分比例・抵押權，並在公所確認用途地域・接道・建築限制，再察看現場。結果會整理成並列出售預估・租金預估・維持費用的報告書，以及需要判斷的專業人士（四葉行政書士事務所・司法書士・稅理士・律師）一覽交給您。諮詢與估價免費。",
  },
];

/** 見分け方（狀態／要確認的文件／最先聯繫的對象） */
const TW_MIWAKE: { state: string; docs: string; where: string }[] = [
  {
    state: "名義人有2人以上，且全員都聯絡得上",
    docs: "登記事項證明書（共有人・持分比例）",
    where: "四葉不動産（全員出售・持分出售的比較）",
  },
  {
    state: "仍維持已故者的名義（繼承登記尚未完成）",
    docs: "戶籍・繼承關係說明圖・有無遺囑",
    where: "四葉行政書士事務所（遺產分割協議書・另行簽約）・司法書士（繼承登記）",
  },
  {
    state: "有反對的共有人",
    docs: "至今往來的紀錄",
    where: "律師（共有物分割請求＝民法第256條・第258條）",
  },
  {
    state: "有所在或聯絡方式不明的共有人",
    docs: "登記上的住所・戶籍附票",
    where: "律師（所在不明等共有人之持分的取得・讓渡＝民法第262條之2・第262條之3）",
  },
  {
    state: "有判斷能力令人擔心的共有人",
    docs: "有無成年監護",
    where: "家庭裁判所的程序（律師・司法書士）",
  },
  {
    state: "持分設有抵押權",
    docs: "登記事項證明書（權利部乙區）",
    where: "金融機構（同意・塗銷）・司法書士",
  },
];

/** 出路的比較（直答區塊的①〜③＋不出售的選項） */
const TW_DEGUCHI: { exit: string; need: string; ours: string }[] = [
  {
    exit: "① 共有人全員一起出售",
    need: "全員的同意（民法第251條第1項）。出售價款依持分比例分配",
    ours: "在確認全員的意向後進行仲介。並列出售預估與持有時的數字，作為協商的材料",
  },
  {
    exit: "② 只出售自己的持分",
    need: "不需要其他共有人的同意。買方容易限於其他共有人，或收購持分的業者",
    ours: "先向其他共有人確認收購的意願，若有困難，再向收購持分的業者詢價並列各方的報價。並告知價格一般會低於整體的比例分配",
  },
  {
    exit: "③ 出售前先整理名義（繼承登記・收購持分・代償分割）",
    need: "遺產分割的合意、持分移轉登記、代償金的資金",
    ours: "備齊出售預估與繼續持有時的數字。協議書的製作由四葉行政書士事務所（另行簽約）、登記由司法書士、有紛爭時由律師負責",
  },
  {
    exit: "（不出售）維持共有出租・由一人持有",
    need: "短期的租賃可由持分價格的過半數決定（民法第252條第4項）",
    ours: "並列租金預估與維持費用，以同一把尺呈現不出售的選項",
  },
];

/** JA_KONKYO（10列）の繁体字訳 */
const TW_KONKYO: WakeariSource[] = [
  { what: "共有物的變更（包含出售）需要其他共有人全員的同意", source: "民法（明治29年法律第89號）第251條第1項" },
  {
    what: "有所在不明等的共有人時，可經法院裁判加以變更",
    source: "民法第251條第2項（令和3年法律第24號・2023年4月1日施行）",
  },
  {
    what: "共有物的管理由持分價格的過半數決定／短期租賃（土地5年・建物3年）的設定",
    source: "民法第252條第1項・第4項",
  },
  { what: "各共有人得隨時請求分割共有物（5年以內的不分割特約可行）", source: "民法第256條第1項" },
  {
    what: "協議不成時的裁判分割（現物分割・代償分割・拍賣）",
    source: "民法第258條第1項〜第3項",
  },
  {
    what: "所在不明等共有人之持分的取得（繼承開始後未經過10年時不可）",
    source: "民法第262條之2（令和3年法律第24號・2023年4月1日施行）",
  },
  {
    what: "所在不明等共有人之持分的讓渡（以其他共有人全員將持分全部讓渡給特定人為條件）",
    source: "民法第262條之3（令和3年法律第24號・2023年4月1日施行）",
  },
  {
    what: "繼承登記的申請義務（自知悉繼承、且知悉取得所有權之日起3年以內）",
    source: "不動產登記法（平成16年法律第123號）第76條之2第1項（令和3年法律第24號・2024年4月1日施行）",
  },
  { what: "仲介契約的書面交付與價額依據的明示", source: "宅地建物取引業法（昭和27年法律第176號）第34條之2第1項・第2項" },
  {
    what: "仲介報酬的上限",
    source: "宅地建物取引業法第46條第1項・第2項／昭和45年建設省告示第1552號（最終修正 令和6年國土交通省告示第949號・2024年7月1日施行）",
  },
];

export async function KyoyuPageZhTw() {
  const all = (await getColumns("zh-tw")).map((c) => getLocalizedColumn(c, "zh-tw"));
  const relatedColumns = WAKEARI_COLUMN_SLUGS.kyoyu.flatMap((slug) => all.filter((c) => c.slug === slug));

  return (
    <>
      <ArticleJsonLd
        businessKey="realestate"
        title={TW_META.h1}
        description={TW_META.description}
        path={PATH}
        datePublished={WAKEARI_TW_LAST_UPDATED_ISO}
        dateModified={WAKEARI_TW_LAST_UPDATED_ISO}
      />
      <SpeakableJsonLd
        businessKey="realestate"
        path={PATH}
        headline={TW_META.h1}
        summary={TW_ANSWER}
        cssSelector={[".wakeari-answer", ".wakeari-who"]}
        dateModified={WAKEARI_TW_LAST_UPDATED_ISO}
      />
      <RealestateServicePage
        path={PATH}
        answerBlock={<span className="wakeari-answer">{TW_ANSWER}</span>}
        crumbs={[{ name: WAKEARI_TW_LABELS.home, href: "/" }, { name: TW_META.shortLabel }]}
        serviceName={TW_META.serviceName}
        serviceType={TW_META.serviceType}
        serviceDescription={TW_META.serviceDescription}
        serviceOffer={WAKEARI_TW_SERVICE_OFFER}
        heroSrc="/hero/realestate-isan-bunkatsu-16x9.webp"
        heroAlt="整理共有名義不動產的示意圖（文件與協商）"
        h1={TW_META.h1}
        ctaVariant="sale"
        ctaIntent={WAKEARI_CONTACT_INTENT}
        lead={
          <>
            <p className="text-sm text-text-muted">{WAKEARI_TW_ANSWER_RESERVATION}</p>
            <p className="mt-3">
              共有名義的不動產會卡住，原因不在建物的狀態，而在<strong>「誰能成為賣方」</strong>。本頁將整理狀態的判斷方式、三種出路與不出售的選項、四葉不動産所做的事，以及該找誰諮詢。不限於繼承的老家，生前受贈持分的人、共同購買的人也適用。
            </p>
            <p className="mt-3">
              不分種類的整體概況請見
              <Link href={WAKEARI_PAGES.hub.path} className="text-primary underline">
                {WAKEARI_TW_LABELS.hubJaOnly}
              </Link>
              ，繼承手續的全貌請見
              <Link href={addLocalePrefix("/souzoku", "zh-tw")} className="text-primary underline">
                在文京區繼承不動產時（完全指南）
              </Link>
              。
            </p>
            <p className="mt-3 text-sm text-text-muted">最終更新：{WAKEARI_TW_LAST_UPDATED}</p>
          </>
        }
        internalLinks={[
          { href: WAKEARI_PAGES.hub.path, label: WAKEARI_TW_LABELS.hubJaOnly, noLocalePrefix: true },
          { href: WAKEARI_PAGES["shakuchi-sokochi"].path, label: "出售借地權・底地，與地主整理權利關係" },
          {
            href: WAKEARI_PAGES["saikenchiku-fuka"].path,
            label: WAKEARI_TW_LABELS.saikenchikuJaOnly,
            noLocalePrefix: true,
          },
          { href: "/souzoku", label: "在文京區繼承不動產時｜完全指南" },
          { href: "/souzoku/chinese", label: "可用中文諮詢的不動產繼承（日文）", noLocalePrefix: true },
          { href: "/legal/services/inheritance", label: "繼承・遺囑的文件製作（四葉行政書士事務所・另行簽約）" },
          { href: "/ryokin", label: WAKEARI_TW_LABELS.ryokin },
          { href: WAKEARI_CONTACT_HREF, label: WAKEARI_TW_LABELS.contact },
        ]}
        relatedColumns={relatedColumns}
        crossLinkLead="遺產分割協議書・繼承關係說明圖等文件的製作，由附設的四葉行政書士事務所以獨立的事業體另行簽約受任。"
        authorBio={WAKEARI_TW_AUTHOR_BIO}
      >
        {/* 3 見分け方 */}
        <div>
          <ReH2>如何判斷共有的狀態？</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            出發點是<strong className="text-ink">登記事項證明書的權利部（甲區）</strong>。確認名義人有幾位、持分比例、是否仍留有已故者的名義，以及有無抵押權（乙區）。依狀態不同，最先聯繫的對象也不同。
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-sm">
              <thead>
                <tr className="bg-primary-tint text-left">
                  <th className="border border-border px-3 py-2">狀態</th>
                  <th className="border border-border px-3 py-2">要確認的文件</th>
                  <th className="border border-border px-3 py-2">最先聯繫的對象</th>
                </tr>
              </thead>
              <tbody className="text-text">
                {TW_MIWAKE.map((r) => (
                  <tr key={r.state}>
                    <td className="border border-border px-3 py-2">{r.state}</td>
                    <td className="border border-border px-3 py-2">{r.docs}</td>
                    <td className="border border-border px-3 py-2">{r.where}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 leading-relaxed text-text">
            仍維持已故者名義時，應先完成繼承登記、確定賣方。繼承登記自2024年4月1日起義務化，須於知悉繼承、且知悉取得所有權之日起3年以內申請（不動產登記法第76條之2第1項）。
          </p>
        </div>

        {/* 4 出口の比較 */}
        <div>
          <ReH2>共有的土地・房屋，有哪些出路？</ReH2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-sm">
              <thead>
                <tr className="bg-primary-tint text-left">
                  <th className="border border-border px-3 py-2">出路</th>
                  <th className="border border-border px-3 py-2">需要的條件</th>
                  <th className="border border-border px-3 py-2">四葉不動産所做的事</th>
                </tr>
              </thead>
              <tbody className="text-text">
                {TW_DEGUCHI.map((r) => (
                  <tr key={r.exit}>
                    <td className="border border-border px-3 py-2 font-medium text-ink">{r.exit}</td>
                    <td className="border border-border px-3 py-2">{r.need}</td>
                    <td className="border border-border px-3 py-2">{r.ours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 leading-relaxed text-text">
            將共有物整體出售屬於「變更」，需要<strong className="text-ink">共有人全員的同意</strong>（民法第251條第1項）。只要有一人反對，整體就無法出售。與反對的共有人協商不成時的共有物分割請求（民法第256條・第258條）是法院的程序，其代理屬於律師的業務。<strong className="text-ink">本公司不進行共有人之間的交涉或代理。</strong>本公司負責的範圍，是備齊出售時與繼續持有時的數字，提供協商的材料。
          </p>
          <p className="mt-3 leading-relaxed text-text">
            有所在不明的共有人時，依2023年4月1日施行的修正民法，新設了以法院裁判取得其持分的制度（第262條之2），以及取得由其他共有人全員向第三人讓渡之權限的制度（第262條之3）。因繼承而產生的持分，以繼承開始後已經過10年為要件。詳細的程序將為您轉介律師。
          </p>
        </div>

        {/* 売らずに整理する */}
        <div>
          <ReH2>有不出售也能整理的方法嗎？</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            有。例如由一人取得、向其他繼承人支付代償金的<strong className="text-ink">代償分割</strong>，以及維持共有出租、分配租金的方法等。本公司會以同一把尺並列「出售時」與「繼續持有時」的數字，<strong className="text-ink">連同不出售的選項</strong>一併呈現。這並不是以出售為前提的諮詢。
          </p>
          <p className="mt-3 leading-relaxed text-text">
            遺產分割協議書與繼承關係說明圖的製作，由四葉行政書士事務所<strong className="text-ink">以獨立的事業體受任，請分別簽約</strong>。繼承登記・持分移轉登記的申請請直接委託司法書士，遺產稅・讓渡所得的判斷請直接委託稅理士，我們會說明各自直接委託的方式。繼承人在台灣・中國大陸時的文件，整理於
            <Link href="/souzoku/chinese" className="text-primary underline">
              可用中文諮詢的不動產繼承（日文）
            </Link>
            。
          </p>
        </div>

        {/* 5 四葉が行うこと */}
        <div>
          <ReH2>四葉不動産做什麼、做到哪裡？</ReH2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-text">
            <li>以登記事項證明書確認共有人・持分・抵押權，並察看現場。</li>
            <li>在公所確認用途地域・接道・建築的限制，整理成並列出售預估・租金預估・維持費用的報告書。</li>
            <li>以同一把尺比較全員出售・持分出售・名義整理・不出售的選項。</li>
            <li>
              全員出售時，與共有人全員簽訂仲介契約（書面・價額依據・報酬的明示），尋找買方。持分出售時，確認其他共有人的意向，並向收購持分的業者詢價、並列各方的報價。
            </li>
            <li>推進至簽約・交割，登記的申請則為您轉介司法書士。</li>
          </ol>
          <p className="mt-3 leading-relaxed text-text">
            諮詢與估價免費。<strong className="text-ink">本公司不進行共有人之間的交涉或代理、法院的程序、登記的申請、稅額的計算。</strong>
          </p>
        </div>

        <WakeariRoleTable locale="zh-tw" />

        <Faq
          items={TW_FAQ}
          heading={WAKEARI_TW_LABELS.faqHeading}
          ariaLabel={WAKEARI_TW_LABELS.faqHeading}
          withJsonLd
          inLanguage="zh-Hant"
          bare
          openFirst={false}
        />

        <WakeariSources rows={TW_KONKYO} locale="zh-tw" />

        <CannotHandle bare locale="zh-tw" />
      </RealestateServicePage>
    </>
  );
}
