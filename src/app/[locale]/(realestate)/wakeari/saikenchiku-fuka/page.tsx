// /wakeari/saikenchiku-fuka（再建築不可の受け皿）＝2026-09-23 新設・日本語版のみ・監修前ドラフト
// 方式・型・JSON-LD・コンプライアンスの決まりは /wakeari/page.tsx 冒頭と src/lib/wakeari.ts 冒頭を参照。
// 役割＝「誰に頼めるか・四葉は何をするか・費用・流れ」。43条2項の深掘り・旗竿地・私道持分はコラム（relatedColumns）へ送る。
// 建築の可否・認定/許可の見込み・擁壁の安全性は建築士と特定行政庁（文京区）が判断する＝当社は可否を書かない。
import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { RealestateServicePage, ReH2 } from "@/components/shared/RealestateServicePage";
import { CannotHandle } from "@/components/shared/CannotHandle";
import { Faq } from "@/components/shared/Faq";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { SpeakableJsonLd } from "@/components/seo/SpeakableJsonLd";
import { getColumns, getLocalizedColumn } from "@/lib/columns";
import { SR_BIO } from "@/lib/shared/sr-label";
import { WakeariRoleTable } from "@/components/wakeari/WakeariRoleTable";
import { WakeariSources, type WakeariSource } from "@/components/wakeari/WakeariSources";
import {
  WAKEARI_ANSWER,
  WAKEARI_ANSWER_RESERVATION,
  WAKEARI_COLUMN_SLUGS,
  WAKEARI_CONTACT_HREF,
  WAKEARI_CONTACT_INTENT,
  WAKEARI_FAQ,
  WAKEARI_LAST_UPDATED_ISO,
  WAKEARI_LAST_UPDATED_JA,
  WAKEARI_PAGES,
  WAKEARI_SERVICE_OFFER,
} from "@/lib/wakeari";

const PAGE = WAKEARI_PAGES["saikenchiku-fuka"];
const ANSWER = WAKEARI_ANSWER["saikenchiku-fuka"];

/** 原因の見分け方（原因／確認する書類／確認先） */
const JA_GENIN: { cause: string; docs: string; where: string }[] = [
  {
    cause: "接道の幅が2m未満（旗竿地の路地状部分が狭い、など）",
    docs: "地積測量図・公図・現地の実測",
    where: "文京区建築指導課（道路の境界）・建築士",
  },
  {
    cause: "道路に接していない（無道路地・袋地）",
    docs: "公図・登記事項証明書（隣地の名義）",
    where: "文京区建築指導課・隣地所有者（通行の状況）",
  },
  {
    cause: "接している道が建築基準法上の道路でない（通路・私道で42条の指定がない）",
    docs: "道路の種別（42条第1項第1号〜第5号・第2項のどれか）",
    where: "文京区建築指導課（道路台帳・位置指定図）",
  },
  {
    cause: "私道の持分がない、または通行・掘削の承諾が取れていない",
    docs: "私道部分の登記事項証明書・承諾書の有無",
    where: "私道の所有者・司法書士",
  },
  {
    cause: "42条2項道路でセットバック未了（建て替えは可能だが、後退分だけ敷地が減る）",
    docs: "道路の中心線の位置・後退距離",
    where: "文京区建築指導課",
  },
  {
    cause: "がけ・高さ2mを超える擁壁で建築に制限がある",
    docs: "擁壁の検査済証の有無・造成時の図面",
    where: "建築士（安全性）・文京区建築指導課（東京都建築安全条例第6条）",
  },
];

/** 出口4つ＋接道を直す手（誰が動くか・当社の役割） */
const JA_DEGUCHI: { exit: string; who: string; ours: string }[] = [
  {
    exit: "① 接道を直して普通に売る（隣地の一部を買い増す／43条2項の認定・許可を探る）",
    who: "隣地所有者との合意。認定・許可は建築主が申請し、特定行政庁（文京区）が判断。許可には文京区建築審査会の同意",
    ours: "隣地所有者への打診と条件の整理を媒介として行い、道路の種別など役所で確認した事実を建築士へ。見込みの判断はしません",
  },
  {
    exit: "② そのまま媒介で売る（隣地所有者・リフォームして住む個人・投資家）",
    who: "買主と売主（当社が媒介）",
    ours: "再建築不可であることを重要事項として説明したうえで、買い手の候補ごとに条件を並べます",
  },
  {
    exit: "③ 買取業者を買主とする媒介",
    who: "買主は買取業者。当社は売主様との媒介契約に基づく",
    ours: "複数の買取業者に打診し、提示を並べます。買主が誰かは書面で明示します",
  },
  {
    exit: "④ 貸して持つ（リフォームして貸す・持ち続ける）",
    who: "所有者",
    ours: "賃料見込みと工事費を並べます。確認申請の要否と工事の範囲は建築士へ",
  },
];

const JA_KONKYO: WakeariSource[] = [
  { what: "建築基準法上の道路の定義（位置指定道路を含む）", source: "建築基準法（昭和25年法律第201号）第42条第1項（第5号）" },
  {
    what: "幅4m未満の道で特定行政庁が指定したものは道路とみなし、中心線から2m（がけ・川沿いは4m）の線を境界とみなすこと（セットバック）",
    source: "建築基準法第42条第2項",
  },
  { what: "後退部分を敷地面積に算入しないこと", source: "建築基準法施行令（昭和25年政令第338号）第2条第1項第1号" },
  { what: "敷地は道路に2m以上接すること（接道義務）", source: "建築基準法第43条第1項" },
  {
    what: "接道義務の例外（特定行政庁の認定・建築審査会の同意を得た許可）",
    source: "建築基準法第43条第2項第1号・第2号",
  },
  {
    what: "階数2以上または延べ面積200㎡超の建築物は、大規模の修繕・模様替にも建築確認が要ること",
    source: "建築基準法第6条第1項第2号（2025年4月1日施行の改正後の条文）",
  },
  { what: "高さ2mを超える擁壁は工作物として確認の対象になること", source: "建築基準法第88条第1項・同法施行令第138条第1項第5号" },
  {
    what: "高さ2mを超えるがけの下端から、がけ高の2倍以内に建築する場合の擁壁の要件",
    source: "東京都建築安全条例（昭和25年東京都条例第89号・最終改正 令和7年3月31日条例第53号）第6条",
  },
  { what: "文京区建築審査会（特定行政庁である区長の許可への同意）", source: "文京区公式サイト「建築審査会」（2026年9月23日確認）" },
  { what: "媒介契約の書面交付と価額の根拠の明示", source: "宅地建物取引業法（昭和27年法律第176号）第34条の2第1項・第2項" },
  {
    what: "媒介報酬の上限",
    source: "宅地建物取引業法第46条第1項・第2項／昭和45年建設省告示第1552号（最終改正 令和6年国土交通省告示第949号・2024年7月1日施行）",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    businessKey: "realestate",
    title: PAGE.title,
    description: PAGE.description,
    path: PAGE.path,
    keywords: PAGE.keywords,
    locale: "ja",
    absoluteTitle: true,
    availableLocales: ["ja"],
  });
}

export default async function Page() {
  const all = (await getColumns("ja")).map((c) => getLocalizedColumn(c, "ja"));
  const relatedColumns = WAKEARI_COLUMN_SLUGS["saikenchiku-fuka"].flatMap((slug) => all.filter((c) => c.slug === slug));

  return (
    <>
      <ArticleJsonLd
        businessKey="realestate"
        title={PAGE.h1}
        description={PAGE.description}
        path={PAGE.path}
        datePublished={WAKEARI_LAST_UPDATED_ISO}
        dateModified={WAKEARI_LAST_UPDATED_ISO}
      />
      <SpeakableJsonLd
        businessKey="realestate"
        path={PAGE.path}
        headline={PAGE.h1}
        summary={ANSWER}
        cssSelector={[".wakeari-answer", ".wakeari-who"]}
        dateModified={WAKEARI_LAST_UPDATED_ISO}
      />
      <RealestateServicePage
        path={PAGE.path}
        answerBlock={<span className="wakeari-answer">{ANSWER}</span>}
        crumbs={[
          { name: "ホーム", href: "/" },
          { name: WAKEARI_PAGES.hub.shortLabel, href: WAKEARI_PAGES.hub.path },
          { name: PAGE.shortLabel },
        ]}
        serviceName={PAGE.serviceName}
        serviceType={PAGE.serviceType}
        serviceDescription={PAGE.serviceDescription}
        serviceOffer={WAKEARI_SERVICE_OFFER}
        heroSrc="/hero/realestate-youto-chiiki-16x9.webp"
        heroAlt="道路と敷地の関係のイメージ（再建築不可の見分け方）"
        h1={PAGE.h1}
        ctaVariant="sale"
        ctaIntent={WAKEARI_CONTACT_INTENT}
        lead={
          <>
            <p className="text-sm text-text-muted">{WAKEARI_ANSWER_RESERVATION}</p>
            <p className="mt-3">
              「再建築不可」は一つの状態ではなく、<strong>原因が複数あり、原因ごとに出口が違います</strong>。このページでは、原因の見分け方、4つの出口、四葉不動産が行うこと、誰に相談するかを整理します。
            </p>
            <p className="mt-3">
              種類を問わない全体像は
              <Link href={WAKEARI_PAGES.hub.path} className="text-primary underline">
                売りにくい土地・建物の出口相談
              </Link>
              に、相続した家の場合は
              <Link href="/souzoku/akiya" className="text-primary underline">
                相続した空き家の管理・活用・売却
              </Link>
              にまとめています。
            </p>
            <p className="mt-3 text-sm text-text-muted">最終更新：{WAKEARI_LAST_UPDATED_JA}</p>
          </>
        }
        internalLinks={[
          { href: WAKEARI_PAGES.hub.path, label: WAKEARI_PAGES.hub.shortLabel },
          { href: WAKEARI_PAGES.kyosho.path, label: WAKEARI_PAGES.kyosho.h1 },
          { href: WAKEARI_PAGES.kyoyu.path, label: WAKEARI_PAGES.kyoyu.h1 },
          { href: WAKEARI_PAGES["shakuchi-sokochi"].path, label: WAKEARI_PAGES["shakuchi-sokochi"].h1 },
          { href: "/souzoku/akiya", label: "相続した空き家｜管理・活用・売却" },
          { href: "/ryokin", label: "料金のご案内" },
          { href: WAKEARI_CONTACT_HREF, label: "お問い合わせ" },
        ]}
        relatedColumns={relatedColumns}
        crossLinkLead="相続に伴う書類の作成は併設の四葉行政書士事務所が別契約で受任します。"
        authorBio={`浦松 丈二｜四葉不動産株式会社 代表取締役・専任宅地建物取引士（東京）第293544号。行政書士（第25087022号）。元毎日新聞中国総局長。${SR_BIO.ja}。`}
      >
        {/* 3 原因の見分け方 */}
        <div>
          <ReH2>再建築不可の原因は、どうやって見分けますか？</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            建築基準法第43条第1項は、<strong className="text-ink">敷地が建築基準法上の道路に2m以上接すること</strong>を求めています。「接していない」「幅が足りない」「接している道が道路ではない」のどれに当たるかで、取れる手が変わります。書類と役所で確かめる順に並べます。
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-sm">
              <thead>
                <tr className="bg-primary-tint text-left">
                  <th className="border border-border px-3 py-2">原因</th>
                  <th className="border border-border px-3 py-2">確認する書類</th>
                  <th className="border border-border px-3 py-2">確認先</th>
                </tr>
              </thead>
              <tbody className="text-text">
                {JA_GENIN.map((r) => (
                  <tr key={r.cause}>
                    <td className="border border-border px-3 py-2">{r.cause}</td>
                    <td className="border border-border px-3 py-2">{r.docs}</td>
                    <td className="border border-border px-3 py-2">{r.where}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 leading-relaxed text-text">
            道路の種別は、文京区建築指導課で<strong className="text-ink">42条第1項第1号〜第5号・第2項のどれか</strong>を確認できます。ここを飛ばして買い手を探し始めると、契約の直前で止まります。当社は媒介の前にこの確認を行い、結果を報告書にします。
          </p>
        </div>

        {/* 4 出口の比較 */}
        <div>
          <ReH2>再建築不可の土地・家には、どんな出口がありますか？</ReH2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-sm">
              <thead>
                <tr className="bg-primary-tint text-left">
                  <th className="border border-border px-3 py-2">出口</th>
                  <th className="border border-border px-3 py-2">誰が動くか・誰が判断するか</th>
                  <th className="border border-border px-3 py-2">四葉不動産が行うこと</th>
                </tr>
              </thead>
              <tbody className="text-text">
                {JA_DEGUCHI.map((r) => (
                  <tr key={r.exit}>
                    <td className="border border-border px-3 py-2 font-medium text-ink">{r.exit}</td>
                    <td className="border border-border px-3 py-2">{r.who}</td>
                    <td className="border border-border px-3 py-2">{r.ours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 leading-relaxed text-text">
            ①の認定・許可は、建築基準法第43条第2項に定められた例外です。第1号の認定は、幅4m以上の道に2m以上接する小規模な建築物などが対象で、第2号の許可は、敷地の周囲に広い空地があるなど国土交通省令の基準に適合し、特定行政庁が支障がないと認めて建築審査会の同意を得たものが対象です。<strong className="text-ink">どちらも「通るかどうか」を当社が判断することはできません。</strong>建築士が設計と申請を担い、特定行政庁（文京区）が判断します。
          </p>
          <p className="mt-3 leading-relaxed text-text">
            ④で工事をする場合、2025年4月1日施行の改正により、階数が2以上または延べ面積200㎡を超える建築物は、大規模の修繕・大規模の模様替にも建築確認が必要になりました（建築基準法第6条第1項第2号）。再建築不可の敷地では確認が下りない可能性があるため、<strong className="text-ink">工事の範囲は建築士に確認してから決めます</strong>。
          </p>
        </div>

        {/* 買取と媒介の見比べ */}
        <div>
          <ReH2>買取と媒介は、どちらが向いていますか？</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            一般的な判断軸は、手放す時期を急ぐか、時間をかけて隣地所有者や実需の買い手を探せるか、契約不適合責任の扱い（免責の特約をしても、知りながら告げなかった事実には及ばない＝民法第572条）をどうしたいか、の3つです。買取は手続が早い反面、改修費と再販の見込みを差し引いた価格になるのが一般的です。媒介は時間がかかる分、<strong className="text-ink">隣地所有者や実際に住む買い手に売れれば手取りが増える可能性</strong>があります。当社は両方の条件を表にしてお示しし、結論はお客様が決めます。数字の比べ方は、
            <Link href="/column/kaitori-chukai-tedori-hikaku" className="text-primary underline">
              買取と仲介の手取りの比較
            </Link>
            にまとめています。
          </p>
          <p className="mt-3 leading-relaxed text-text">
            買取をご希望の場合、買主は買取業者です。当社は売主様との媒介契約に基づいて複数の買取業者に打診し、提示を並べます。買主が誰かは書面で明示します（宅地建物取引業法第34条の取引態様の明示）。
          </p>
        </div>

        {/* 5 四葉が行うこと */}
        <div>
          <ReH2>四葉不動産は、何をどこまで行いますか？</ReH2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-text">
            <li>登記事項証明書・公図・地積測量図・確認済証の有無を確認し、現地を見ます。</li>
            <li>文京区建築指導課で道路の種別・幅員・位置指定の有無・後退の要否を確認し、がけ・擁壁は東京都建築安全条例第6条の該当を確認します。</li>
            <li>確認した事実と、判断を要する専門家（建築士・特定行政庁・土地家屋調査士・司法書士・税理士）の一覧を報告書にします。</li>
            <li>①〜④の出口を、価格の考え方・期間の考え方・責任・報酬の根拠で並べます。</li>
            <li>媒介契約は書面で、価額の根拠と報酬（宅地建物取引業法第46条の上限の範囲内）を明示します。買い手の候補ごとに打診し、買取をご希望なら買取業者に打診して提示を並べます。</li>
            <li>重要事項説明で再建築不可であることと道路の種別を説明し、契約・決済まで進めます。</li>
          </ol>
          <p className="mt-3 leading-relaxed text-text">
            ご相談と査定は無料です。<strong className="text-ink">建築の可否・認定や許可の見込み・擁壁の安全性の判断は行いません。</strong>
          </p>
        </div>

        <WakeariRoleTable />

        <Faq
          items={WAKEARI_FAQ["saikenchiku-fuka"]}
          heading="よくある質問"
          ariaLabel="よくある質問"
          withJsonLd
          inLanguage="ja"
          bare
          openFirst={false}
        />

        <WakeariSources rows={JA_KONKYO} />

        <CannotHandle bare />
      </RealestateServicePage>
    </>
  );
}
