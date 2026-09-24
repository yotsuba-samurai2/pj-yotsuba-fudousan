// /wakeari/shakuchi-sokochi の繁体字（zh-tw）版（2026-09-24 Phase 3・監修前ドラフト）。
// 日本語版 page.tsx の逐語訳。構成・表・段落・FAQ・根拠表は日本語版と一対一で対応させる（内容を足さない・削らない）。
// 訳語の決まりは src/lib/wakeari-zh-tw.ts 冒頭を参照（事業体名は日本語表記・法令名は日本語の漢字・買取＝以收購業者為買方的仲介）。
// 承諾料の相場・水準は書かない。当社は承諾料の交渉・代理を行わない。承諾に代わる許可の申立て（借地非訟）＝律師。税務上の効果＝稅理士。
// ハブ・再建築不可・狭小地・/souzoku/akiya/koishikawa は日本語のみ＝noLocalePrefix で日本語版URLへ「（日文）」を付けてリンクする。
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
import {
  WAKEARI_COLUMN_SLUGS,
  WAKEARI_CONTACT_HREF,
  WAKEARI_CONTACT_INTENT,
  WAKEARI_PAGES,
} from "@/lib/wakeari";
import {
  WAKEARI_TW_ANSWER_RESERVATION,
  WAKEARI_TW_AUTHOR_BIO,
  WAKEARI_TW_LABELS,
  WAKEARI_TW_LAST_UPDATED,
  WAKEARI_TW_LAST_UPDATED_ISO,
  WAKEARI_TW_SERVICE_OFFER,
} from "@/lib/wakeari-zh-tw";

const PAGE_PATH = WAKEARI_PAGES["shakuchi-sokochi"].path;

/** WAKEARI_PAGES["shakuchi-sokochi"] の繁体字訳 */
export const TW_META = {
  title: "出售文京區的借地權・底地｜地主承諾・同時出售・等價交換的諮詢窗口 | 四葉不動産",
  description:
    "出售附借地權的房屋，需要地主的承諾（民法第612條）。承諾的安排、代替承諾之許可（借地借家法第19條）的定位、底地的出路（出售給借地人・出售給第三人・同時出售・等價交換），由位於文京區小日向的四葉不動産株式会社為您整理。具爭訟性的交涉請洽律師。",
  h1: "出售借地權・底地，與地主整理權利關係",
  shortLabel: "借地權・底地",
  serviceName: "借地權・底地的出售仲介・地主承諾的安排",
  serviceType: "附借地權建物・底地出售的仲介與地主承諾的安排",
  serviceDescription:
    "針對附借地權建物的出售（地主承諾的安排與詢問）、底地的出售（借地人・第三人・同時出售・等價交換），以契約書與登記的確認為基礎比較出路，並進行出售的仲介。代替承諾之許可的聲請等具爭訟性的程序由律師負責，稅務上的效果由稅理士負責。",
  keywords: [
    "文京區 借地權 出售",
    "借地權 地主承諾 出售",
    "日本 底地 出售 諮詢",
    "借地權 底地 同時出售",
    "借地權 等價交換",
    "舊法借地權 出售",
  ],
};

/** WAKEARI_ANSWER["shakuchi-sokochi"] の繁体字訳 */
export const TW_ANSWER =
  "附借地權的房屋或底地的出路，有①將借地權出售給第三人（需要地主的承諾）、②出售給地主或借地人、③將借地權與底地同時出售・等價交換，共3種。四葉不動産進行包含承諾安排在內的仲介與出路比較。";

/** WAKEARI_FAQ["shakuchi-sokochi"] の繁体字訳（順番・件数とも一対一） */
export const TW_FAQ: FaqItem[] = [
  {
    q: "出售附借地權的房屋，需要地主的承諾嗎？",
    a: "需要。將土地的租賃權讓與第三人，需要出租人（地主）的承諾（民法第612條第1項），未經承諾而讓與時，契約可能被解除（同條第2項）。在開始尋找買方之前，先向地主確認承諾的可能性與條件，才是正確的順序。本公司以仲介的立場，受理該項詢問與書面的整理。",
  },
  {
    q: "承諾料的行情與交涉，由誰進行？",
    a: "承諾料的金額取決於契約與地區的慣例，因此本頁不寫出其水準。本公司不進行代理・交涉。向地主詢問承諾的意向與條件，並將合意的內容整理成書面，是仲介的範圍。對金額或條件有對立、具爭訟性的情形，將為您引介律師。",
  },
  {
    q: "地主不承諾的話，會怎麼樣？",
    a: "在對地主並無不利之虞卻不承諾時，有由法院給予代替承諾之許可的制度（借地借家法第19條第1項）。這是稱為借地非訟的法院程序，聲請的代理是律師的業務。本公司無法判斷是否會獲得許可。請地主收購建物與借地權的方向，也會一併比較。",
  },
  {
    q: "底地（出租中的土地）賣得出去嗎？由誰購買？",
    a: "可以出售。買方主要為借地人、經手底地的業者等第三人，以及與借地權同時出售時的第三人。一般而言，出售給借地人的形式最容易取得價格，但取決於借地人的資金與意向。地租・契約的內容・剩餘期間會改變價格的思考方式，因此本公司會以書面說明估價的依據。",
  },
  {
    q: "將借地權與底地同時出售，或是交換，是什麼意思？",
    a: "同時出售，是借地人與地主同時出售給第三人，將作為空地的價格依約定的比例分配的方法。等價交換，是將借地權與底地交換，讓雙方各自持有完整所有權之土地的方法。一般而言比分別出售更容易取得較高的合計價格，但比例與比率因個案而異，稅務上的效果由稅理士判斷。",
  },
  {
    q: "定期借地權的情形有什麼不同？",
    a: "一般定期借地權（借地借家法第22條・存續期間50年以上）與事業用定期借地權（第23條），沒有契約的更新，以期間屆滿時返還土地為前提。剩餘期間直接影響價格，期間越短，買方越有限。會先以契約書確認種類與期間、建物的處理方式，再比較出路。",
  },
  {
    q: "找不到借地契約書的話，該怎麼辦？",
    a: "可以從地租的支付紀錄（存摺・收據），以及土地・建物的登記事項證明書出發。也可能請地主提供其手邊契約書的影本。契約的日期若在1992年8月1日之前，存續期間與更新仍繼續適用舊借地法的規定（借地借家法附則第4條〜第7條），處理方式有所不同。對契約內容的確定有爭議時，將為您引介律師。",
  },
  {
    q: "諮詢之後，會調查什麼、報告什麼？",
    a: "以借地契約書與土地・建物的登記事項證明書，確認契約的種類・期間・地租・承諾的規定・建物的登記名義，並在公所確認用途地域・接道・建築的限制，再查看現場。結果會整理成並列附借地權建物・底地・空地各自的出售預估與租金預估的報告書交給您。諮詢與估價免費。",
  },
];

/** 見分け方（確認すること／書類／出口にどう効くか）＝JA_MIWAKE の繁体字訳 */
const TW_MIWAKE: { item: string; docs: string; meaning: string }[] = [
  {
    item: "是借地、底地，還是所有權",
    docs: "土地與建物各自的登記事項證明書",
    meaning: "土地的名義不是自己、只有建物是自己的，就是借地。土地是自己的、建物是他人的，就是底地",
  },
  {
    item: "契約的日期（在1992年8月1日之前或之後）",
    docs: "借地契約書（土地租賃契約書）",
    meaning:
      "在1992年8月1日借地借家法施行之前設定的借地權，存續期間・更新等仍繼續適用舊借地法的規定（附則第4條〜第7條）",
  },
  {
    item: "契約的種類（普通借地或定期借地）",
    docs: "契約書的特約（無更新・期間屆滿即返還的規定）",
    meaning: "一般定期借地權（50年以上）・事業用定期借地權沒有更新，剩餘期間直接影響價格",
  },
  {
    item: "地租・更新費・承諾料的約定與支付紀錄",
    docs: "契約書・存摺・收據",
    meaning: "是承諾的安排，以及移交給買方之條件的基礎",
  },
  {
    item: "建物的登記是否為借地權人的名義",
    docs: "建物的登記事項證明書",
    meaning: "若有以借地權人名義登記的建物，即可以借地權對抗第三人（借地借家法第10條第1項）",
  },
  {
    item: "地主（或借地人）的意向",
    docs: "至今的往來紀錄",
    meaning: "左右承諾的可能性、收購的意向，以及同時出售的可能性",
  },
];

/** 出口（直答ブロックの①〜③＋貸して持つ）＝JA_DEGUCHI の繁体字訳 */
const TW_DEGUCHI: { exit: string; need: string; ours: string }[] = [
  {
    exit: "① 將借地權出售給第三人（作為附借地權建物）",
    need: "地主的承諾（民法第612條第1項）。承諾料的約定",
    ours: "安排取得承諾的程序，以仲介的立場向地主詢問意向與條件。將承諾的條件移交給買方。不進行承諾料的交涉・代理",
  },
  {
    exit: "② 出售給地主或借地人",
    need: "對方的資金與意向",
    ours: "提出價格的依據進行詢問，整理條件並進行仲介。未能達成合意時的程序請洽律師",
  },
  {
    exit: "③ 將借地權與底地同時出售給第三人／等價交換",
    need: "地主與借地人的合意。稅務上效果的確認",
    ours: "製作作為空地的出售預估與分配方式的方案。稅的判斷請洽稅理士",
  },
  {
    exit: "（不出售）出租並繼續持有",
    need: "轉租借地上的建物，需要地主的承諾（民法第612條第1項）",
    ours: "並列租金預估與維持費。以契約書確認是否需要承諾",
  },
];

/** 根拠表＝JA_KONKYO の繁体字訳（行の順番も同じ） */
const TW_KONKYO: WakeariSource[] = [
  {
    what: "租賃權的讓與・轉租需要出租人的承諾／擅自讓與為解除事由",
    source: "民法（明治29年法律第89號）第612條第1項・第2項",
  },
  {
    what: "地主不承諾時，法院可給予代替承諾之許可（借地非訟）",
    source: "借地借家法（平成3年法律第90號）第19條第1項",
  },
  { what: "借地權的存續期間（30年。契約約定更長期間時，為該期間）", source: "借地借家法第3條" },
  { what: "若有以借地權人名義登記的建物，即可以借地權對抗第三人", source: "借地借家法第10條第1項" },
  { what: "期間屆滿而無更新時的建物收購請求權", source: "借地借家法第13條第1項" },
  { what: "一般定期借地權（存續期間50年以上・無更新・以書面等所為的特約）", source: "借地借家法第22條第1項" },
  {
    what: "事業用定期借地權等（30年以上未滿50年・10年以上未滿30年・公證書）",
    source: "借地借家法第23條第1項〜第3項",
  },
  {
    what: "在借地借家法施行（1992年8月1日）之前設定之借地權的存續期間・更新等，適用舊借地法的規定",
    source: "借地借家法附則第4條〜第7條（過渡措施）",
  },
  { what: "交易型態的明示", source: "宅地建物取引業法（昭和27年法律第176號）第34條第1項・第2項" },
  { what: "仲介契約的書面交付與價額依據的明示", source: "宅地建物取引業法第34條之2第1項・第2項" },
  {
    what: "仲介報酬的上限",
    source:
      "宅地建物取引業法第46條第1項・第2項／昭和45年建設省告示第1552號（最終修正 令和6年國土交通省告示第949號・2024年7月1日施行）",
  },
];

export async function ShakuchiSokochiPageZhTw() {
  const all = (await getColumns("zh-tw")).map((c) => getLocalizedColumn(c, "zh-tw"));
  const relatedColumns = WAKEARI_COLUMN_SLUGS["shakuchi-sokochi"].flatMap((slug) => all.filter((c) => c.slug === slug));

  return (
    <>
      <ArticleJsonLd
        businessKey="realestate"
        title={TW_META.h1}
        description={TW_META.description}
        path={PAGE_PATH}
        datePublished={WAKEARI_TW_LAST_UPDATED_ISO}
        dateModified={WAKEARI_TW_LAST_UPDATED_ISO}
      />
      <SpeakableJsonLd
        businessKey="realestate"
        path={PAGE_PATH}
        headline={TW_META.h1}
        summary={TW_ANSWER}
        cssSelector={[".wakeari-answer", ".wakeari-who"]}
        dateModified={WAKEARI_TW_LAST_UPDATED_ISO}
      />
      <RealestateServicePage
        path={PAGE_PATH}
        answerBlock={<span className="wakeari-answer">{TW_ANSWER}</span>}
        crumbs={[{ name: WAKEARI_TW_LABELS.home, href: "/" }, { name: TW_META.shortLabel }]}
        serviceName={TW_META.serviceName}
        serviceType={TW_META.serviceType}
        serviceDescription={TW_META.serviceDescription}
        serviceOffer={WAKEARI_TW_SERVICE_OFFER}
        heroSrc="/hero/realestate-jigyou-fudosan-16x9.webp"
        heroAlt="借地權・底地整理的示意圖（土地與建物的權利關係）"
        h1={TW_META.h1}
        ctaVariant="sale"
        ctaIntent={WAKEARI_CONTACT_INTENT}
        lead={
          <>
            <p className="text-sm text-text-muted">{WAKEARI_TW_ANSWER_RESERVATION}</p>
            <p className="mt-3">
              無論是借地上的房屋，還是出租中的土地（底地），都是<strong>有相對方（地主・借地人）的不動產</strong>。出路取決於相對方的承諾與意向，順序一旦弄錯，就會回到原點。本頁整理契約書的看法、3種出路、四葉不動産所做的事，以及該找誰諮詢。不限於繼承的借地，長年居住的借地、代代出租的底地也都是對象。
            </p>
            <p className="mt-3">
              不分種類的整體概況請見
              <Link href={WAKEARI_PAGES.hub.path} className="text-primary underline">
                {WAKEARI_TW_LABELS.hubJaOnly}
              </Link>
              ，繼承之借地的整體手續則整理於
              <Link href={addLocalePrefix("/souzoku", "zh-tw")} className="text-primary underline">
                在文京區繼承不動產（完全指南）
              </Link>
              。
            </p>
            <p className="mt-3 text-sm text-text-muted">最終更新：{WAKEARI_TW_LAST_UPDATED}</p>
          </>
        }
        internalLinks={[
          { href: WAKEARI_PAGES.hub.path, label: WAKEARI_TW_LABELS.hubJaOnly, noLocalePrefix: true },
          { href: WAKEARI_PAGES.kyoyu.path, label: "共有的土地・房屋：全員一起出售、出售持分、整理名義" },
          {
            href: WAKEARI_PAGES["saikenchiku-fuka"].path,
            label: WAKEARI_TW_LABELS.saikenchikuJaOnly,
            noLocalePrefix: true,
          },
          { href: "/souzoku", label: "在文京區繼承不動產｜完全指南" },
          {
            href: "/souzoku/akiya/koishikawa",
            label: "小石川的空屋（因借地・共有而無法處理的原因）（日文）",
            noLocalePrefix: true,
          },
          { href: "/ryokin", label: WAKEARI_TW_LABELS.ryokin },
          { href: WAKEARI_CONTACT_HREF, label: WAKEARI_TW_LABELS.contact },
        ]}
        relatedColumns={relatedColumns}
        crossLinkLead="伴隨繼承的文件製作，由併設的四葉行政書士事務所以個別簽約受任。"
        authorBio={WAKEARI_TW_AUTHOR_BIO}
      >
        {/* 3 見分け方 */}
        <div>
          <ReH2>借地權・底地的條件，要從哪裡分辨？</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            出發點是<strong className="text-ink">借地契約書，以及土地・建物各自的登記事項證明書</strong>。即使找不到契約書，也可以從地租的支付紀錄與登記出發。
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-sm">
              <thead>
                <tr className="bg-primary-tint text-left">
                  <th className="border border-border px-3 py-2">要確認的事</th>
                  <th className="border border-border px-3 py-2">文件</th>
                  <th className="border border-border px-3 py-2">對出路有何影響</th>
                </tr>
              </thead>
              <tbody className="text-text">
                {TW_MIWAKE.map((r) => (
                  <tr key={r.item}>
                    <td className="border border-border px-3 py-2 font-medium text-ink">{r.item}</td>
                    <td className="border border-border px-3 py-2">{r.docs}</td>
                    <td className="border border-border px-3 py-2">{r.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4 出口の比較 */}
        <div>
          <ReH2>借地權・底地有哪些出路？</ReH2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-sm">
              <thead>
                <tr className="bg-primary-tint text-left">
                  <th className="border border-border px-3 py-2">出路</th>
                  <th className="border border-border px-3 py-2">需要的事</th>
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
            要將借地上的建物出售給第三人，關於土地租賃權的讓與，需要<strong className="text-ink">地主的承諾</strong>（民法第612條第1項）。未經承諾而讓與時，契約可能被解除（同條第2項）。在對地主並無不利之虞卻無法取得承諾時，有由法院給予代替承諾之許可的制度（借地借家法第19條第1項）。<strong className="text-ink">此項聲請是法院的程序，代理是律師的業務。</strong>承諾料的金額取決於契約與地區的慣例，因此本頁不寫出。
          </p>
          <p className="mt-3 leading-relaxed text-text">
            在開始尋找買方之前，先向地主確認承諾的可能性與條件——這個順序，是借地出售中最重要的事。本公司以仲介的立場，向地主詢問意向與條件，並將合意的內容整理成書面。<strong className="text-ink">不進行承諾料金額的交涉或代理。</strong>有對立時，將為您引介律師。
          </p>
        </div>

        {/* 同時売却・等価交換 */}
        <div>
          <ReH2>地主與借地人，有沒有一起尋找出路的方法？</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            有。<strong className="text-ink">同時出售</strong>，是借地人與地主同時出售給第三人，將作為空地的價格依約定的比例分配的方法。<strong className="text-ink">等價交換</strong>，是將借地權與底地交換，讓雙方各自持有完整所有權之土地的方法。一般而言，兩者都比將附借地權建物與底地分別出售，更容易取得較高的合計價格。
          </p>
          <p className="mt-3 leading-relaxed text-text">
            分配的比例、交換的比率、讓渡所得的處理與特例能否適用，因個案而異。本公司製作作為空地的出售預估與分配方式的方案，<strong className="text-ink">稅務上的效果請向稅理士</strong>確認。地主與借地人利害對立時的交涉代理，是律師的業務。
          </p>
        </div>

        {/* 5 四葉が行うこと */}
        <div>
          <ReH2>四葉不動産會做哪些事、做到什麼程度？</ReH2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-text">
            <li>確認借地契約書與土地・建物的登記事項證明書，整理契約的種類・期間・地租・承諾的規定。</li>
            <li>在公所確認用途地域・接道・建築的限制，並查看現場。</li>
            <li>製作並列作為附借地權建物的出售預估、作為底地的出售預估、作為空地的出售預估，以及租金預估的報告書。</li>
            <li>向地主（或借地人）詢問意向與條件，確認承諾的可能性。</li>
            <li>
              仲介契約以書面簽訂，明示價額的依據與報酬（宅地建物取引業法第46條上限的範圍內），並尋找買方。希望由業者收購時，會向收購業者詢問，並列其報價。
            </li>
            <li>進行至簽約・交割為止。建物的登記會為您引介司法書士・土地家屋調查士。</li>
          </ol>
          <p className="mt-3 leading-relaxed text-text">
            諮詢與估價免費。<strong className="text-ink">本公司不進行代替承諾之許可的聲請、承諾料的交涉、與地主・借地人之間具爭訟性程序的代理，以及稅額的計算。</strong>
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
