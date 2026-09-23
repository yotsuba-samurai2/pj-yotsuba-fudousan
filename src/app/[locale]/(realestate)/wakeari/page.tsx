// /wakeari（売りにくい土地・建物の出口相談＝ハブ）＝2026-09-23 新設・日本語版のみ・監修前ドラフト
// 企画書：難あり土地（狭小地・再建築不可・共有・借地）出口相談コーナー AIO/LLMO/SEO 実装プラン v1.0（2026-09-24）Phase 1
// ／Cowork 実装指示書 v2.0（2026-09-24）。決定欄は既定値（/wakeari・買取は B・文京区を中心に東京23区・ja のみ・定点と /jirei は Phase 3）。
// 方式＝RealestateServicePage（手本=/souzoku/akiya・/souzoku/akiya/koishikawa）。ja先行公開：availableLocales:["ja"]・sitemap側も locales:["ja"]。
//
// 【役割（カニバリ防止・企画書 3-1）】受け皿＝「誰に頼めるか・四葉は何をするか・費用・流れ」。
//   制度・手続の深掘りは既存コラム（/column）へ送る。タイトル・H1に条文名や制度名の解説を入れない。
//   相続クラスタ（/souzoku）とは主語で分ける：/souzoku＝「相続した」不動産の入口、本ページ＝所有者一般（買った・生前にもらった・長く住んだ借地）。
//
// 【ページの型（指示書 第5章 5-1・10要素・順序固定）】
//   1 直答ブロック（.wakeari-answer）→ 留保1行 → 2 事業者主語の一文 → 3 見分け方の表 → 4 出口の比較表 → 5 四葉が行うこと →
//   出口チェックリスト・種類別ページ → 6 H2「誰に相談すればよいですか」（.wakeari-who）→ 7 FAQ（FAQPage）→ 8 この記事の根拠 →
//   9 署名（/about/uramatsu）＋dateModified の可視表示 → 10 CTA（CtaBand sale・/contact?intent=wakeari）
//   ※2 の事業者主語の一文は 6 の役割表の直前に置く（同じ節で「誰が何を担うか」を一度に示す）。
//
// 【JSON-LD（指示書 第6章 6-1）】WebPage+SpeakableSpecification（.wakeari-answer／.wakeari-who・dateModified）／
//   BreadcrumbList（shell の Breadcrumb 部品）／FAQPage（Faq withJsonLd＝本文と同一配列）／Service（shell＝ハブ自身の1件＋種類別4件を @graph で）／
//   ItemList（種類別4枚）／Article（ArticleJsonLd・dateModified）。
//   GeoCircle には既存 @id が無いため、areaServed は shell と同じ文字列で揃える（PR 本文に記載）。
//
// 【コンプライアンス】shigyo-compliance-gate 準拠。可否・価格の断定なし。買取は「提携する買取業者を買主とする媒介」に固定。
//   一つの窓口＝可。同ページに分離受任（独立した事業体・別々にご契約）を併記（WakeariRoleTable）。法令の一次確認は src/lib/wakeari.ts 冒頭。
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buildPageMetadata, canonicalUrl, SITE_URL } from "@/lib/seo";
import { RealestateServicePage, ReH2 } from "@/components/shared/RealestateServicePage";
import { CannotHandle } from "@/components/shared/CannotHandle";
import { Faq } from "@/components/shared/Faq";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { SpeakableJsonLd } from "@/components/seo/SpeakableJsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import { getColumns, getLocalizedColumn } from "@/lib/columns";
import { SR_BIO } from "@/lib/shared/sr-label";
import { WakeariRoleTable } from "@/components/wakeari/WakeariRoleTable";
import { WakeariSources, type WakeariSource } from "@/components/wakeari/WakeariSources";
import { WakeariExitChecklist } from "@/components/wakeari/WakeariExitChecklist";
import {
  WAKEARI_ANSWER,
  WAKEARI_ANSWER_RESERVATION,
  WAKEARI_AREA,
  WAKEARI_COLUMN_SLUGS,
  WAKEARI_CONTACT_HREF,
  WAKEARI_CONTACT_INTENT,
  WAKEARI_FAQ,
  WAKEARI_LAST_UPDATED_ISO,
  WAKEARI_LAST_UPDATED_JA,
  WAKEARI_PAGES,
  WAKEARI_SERVICE_OFFER,
  WAKEARI_TYPE_KEYS,
  WAKEARI_TYPE_PAGES,
} from "@/lib/wakeari";

const PAGE = WAKEARI_PAGES.hub;
const ANSWER = WAKEARI_ANSWER.hub;

/** 見分け方の表（種類／こんなとき／確認する書類／確認先） */
const JA_MIWAKE: { type: string; when: string; docs: string; where: string; page: (typeof WAKEARI_TYPE_KEYS)[number] | null }[] = [
  {
    type: "再建築不可",
    when: "接道が2m未満／道路に接していない／接している道が建築基準法上の道路でない／私道の持分がない",
    docs: "登記事項証明書・公図・地積測量図・（あれば）確認済証",
    where: "文京区建築指導課（道路の種別・幅員）・建築士",
    page: "saikenchiku-fuka",
  },
  {
    type: "共有名義",
    when: "名義人が2人以上／亡くなった方の名義のまま／連絡の取れない共有者がいる",
    docs: "登記事項証明書（共有者と持分）・戸籍・遺言書",
    where: "司法書士（登記）・四葉行政書士事務所（遺産分割協議書・別契約）・弁護士（紛争）",
    page: "kyoyu",
  },
  {
    type: "借地権・底地",
    when: "土地が地主のもの／人に土地を貸している／契約書が見当たらない",
    docs: "借地契約書・建物の登記事項証明書・地代の記録",
    where: "地主（承諾）・弁護士（承諾に代わる許可の申立て）",
    page: "shakuchi-sokochi",
  },
  {
    type: "狭小地・旗竿地",
    when: "15坪前後／路地状部分で道路につながる／セットバックが要る",
    docs: "公図・地積測量図・用途地域と建蔽率・容積率の資料",
    where: "文京区建築指導課・建築士",
    page: "kyosho",
  },
  {
    type: "がけ・擁壁",
    when: "高さ2mを超えるがけ・擁壁が敷地の中や隣にある",
    docs: "擁壁の検査済証の有無・造成時の図面",
    where: "建築士（安全性）・文京区建築指導課（東京都建築安全条例第6条の該当）",
    page: null,
  },
];

/** 3つの出口の比較表（指示書 5-1-4。金額・割合・日数は書かない） */
const JA_DEGUCHI: { axis: string; baikai: string; kaitori: string; katsuyo: string }[] = [
  {
    axis: "価格の考え方",
    baikai: "市場の買い手が付ける価格。買い手の種類（隣地所有者・実需・投資家）で幅が出る",
    kaitori: "買取業者が再販の見込みと改修費を差し引いた価格になるのが一般的",
    katsuyo: "売らずに、賃料・使用料で時間をかけて回収する",
  },
  {
    axis: "期間の考え方",
    baikai: "買い手が決まるまで。権利の整理が要る土地は長くなる",
    kaitori: "提示から決済までは比較的短い",
    katsuyo: "準備（工事・募集）のあとは継続",
  },
  {
    axis: "契約不適合責任",
    baikai: "個人の買主には原則負う。特約で限定できるが、知りながら告げなかった事実には及ばない（民法第572条）",
    kaitori: "免責の特約が一般的。同じく民法第572条の限界がある",
    katsuyo: "貸主としての修繕義務が続く",
  },
  {
    axis: "報酬の根拠",
    baikai: "成約時に、宅地建物取引業法第46条に基づく告示の上限の範囲内の媒介報酬",
    kaitori: "同じ媒介報酬（当社は売主様との媒介契約に基づく）",
    katsuyo: "媒介報酬はなし。工事費・管理費・固定資産税等がかかる",
  },
  {
    axis: "近所に知られるか",
    baikai: "広告の範囲による。限られた相手にだけ打診する進め方もある",
    kaitori: "知られにくい",
    katsuyo: "用途による",
  },
  {
    axis: "向いている場合",
    baikai: "時間をかけられる。隣地所有者や実需の買い手が見込める",
    kaitori: "早く手放したい。手続の負担を減らしたい",
    katsuyo: "手放す時期を決めていない。次の判断まで負担を軽くしたい",
  },
];

/** 四葉が行うこと（指示書 5-1-5 の流れ） */
const JA_NAGARE: { step: string; body: string }[] = [
  {
    step: "1. 役所調査と現地確認",
    body: "登記事項証明書・公図・契約書を確認したうえで、道路の種別と幅員、用途地域と建蔽率・容積率、建築の制限、東京都建築安全条例の該当、区の制度を役所で確認し、現地を見ます。",
  },
  { step: "2. 調査報告書", body: "確認した事実と、判断を要する専門家（建築士・特定行政庁・税理士・司法書士・弁護士）の一覧を書面にしてお渡しします。" },
  { step: "3. 出口の比較表", body: "媒介で売る・提携する買取業者を買主とする媒介・貸して持つを、同じ物差し（価格の考え方・期間の考え方・責任・報酬の根拠）で並べます。売らない選択肢も含めます。" },
  { step: "4. 媒介契約", body: "書面で、価額の根拠と報酬（宅地建物取引業法第46条の上限の範囲内）を明示します（同法第34条の2）。" },
  { step: "5. 買い手探し・提携する買取業者への打診", body: "買い手の候補ごとに条件を並べ、買取をご希望なら複数の買取業者に打診して提示を並べます。買主が誰かは書面で明示します。" },
  { step: "6. 契約・決済", body: "重要事項説明、契約不適合責任の取り決め、引渡しまでを進めます。登記の申請は司法書士におつなぎします。" },
];

const JA_KONKYO: WakeariSource[] = [
  { what: "建築物の敷地は道路に2m以上接すること（接道義務）", source: "建築基準法（昭和25年法律第201号）第43条第1項" },
  { what: "接道義務の例外（特定行政庁の認定・建築審査会の同意を得た許可）", source: "建築基準法第43条第2項第1号・第2号" },
  { what: "共有物の売却（変更）には共有者全員の同意が要ること", source: "民法（明治29年法律第89号）第251条第1項" },
  {
    what: "借地権の譲渡に地主の承諾が要ること／承諾に代わる裁判所の許可",
    source: "民法第612条第1項・第2項／借地借家法（平成3年法律第90号）第19条第1項",
  },
  { what: "契約不適合責任を負わない特約をしても、知りながら告げなかった事実には責任が及ぶこと", source: "民法第572条" },
  { what: "取引態様（当事者・代理・媒介の別）の明示", source: "宅地建物取引業法（昭和27年法律第176号）第34条第1項・第2項" },
  { what: "媒介契約の書面交付と、価額について意見を述べるときの根拠の明示", source: "宅地建物取引業法第34条の2第1項・第2項" },
  {
    what: "媒介報酬の上限",
    source:
      "宅地建物取引業法第46条第1項・第2項／昭和45年建設省告示第1552号（最終改正 令和6年国土交通省告示第949号・2024年7月1日施行。売買価格800万円以下の低廉な空家等の特例を含む）",
  },
  { what: "誇大広告等の禁止／利益が確実と誤解させる断定的判断の提供の禁止", source: "宅地建物取引業法第32条・第47条の2第1項" },
  {
    what: "相続登記の申請義務（相続を知り、かつ所有権の取得を知った日から3年以内）",
    source: "不動産登記法（平成16年法律第123号）第76条の2第1項（令和3年法律第24号・2024年4月1日施行）",
  },
  { what: "がけに近接する建築物の制限", source: "東京都建築安全条例（昭和25年東京都条例第89号・最終改正 令和7年3月31日条例第53号）第6条" },
];

/** 種類別4枚の ItemList（ハブのみ）。URL は canonicalUrl＝canonical・sitemap と同形 */
const ITEM_LIST_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${SITE_URL}${PAGE.path}#types`,
  name: "売りにくい土地・建物の出口相談：種類別のページ",
  numberOfItems: WAKEARI_TYPE_PAGES.length,
  itemListElement: WAKEARI_TYPE_PAGES.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: p.shortLabel,
    url: canonicalUrl("realestate", p.path, "ja"),
  })),
};

/**
 * 種類別 Service 4件（指示書 6-1「ハブには 4 件すべて」）。@id は各ページの shell が出す Service と同じ `<url>#service`。
 * provider＝既存 RealEstateAgent の @id。areaServed は shell の Service と同じ文字列（GeoCircle に @id が無いため参照できない）。
 * Offer は価格を書かず description のみ（OrganizationJsonLd の makesOffer と同じ書き方）。
 */
const SERVICES_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": WAKEARI_TYPE_PAGES.map((p) => ({
    "@type": "Service",
    "@id": `${SITE_URL}${p.path}#service`,
    name: p.serviceName,
    serviceType: p.serviceType,
    description: p.serviceDescription,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: "東京都文京区およびその周辺",
    offers: { "@type": "Offer", description: WAKEARI_SERVICE_OFFER },
    url: canonicalUrl("realestate", p.path, "ja"),
  })),
};

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
  // 関連コラム＝既存コラムの束ね直し（企画書 3-2）。ハブは全部を「もっと詳しく」で一覧。DB に公開中のものだけをリンクする（404 を作らない）。
  const all = (await getColumns("ja")).map((c) => getLocalizedColumn(c, "ja"));
  const slugs = [...WAKEARI_COLUMN_SLUGS.hub, ...WAKEARI_TYPE_KEYS.flatMap((k) => WAKEARI_COLUMN_SLUGS[k])];
  const relatedColumns = slugs.flatMap((slug) => all.filter((c) => c.slug === slug));

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
      <JsonLd data={ITEM_LIST_JSON_LD} />
      <JsonLd data={SERVICES_JSON_LD} />
      <RealestateServicePage
        path={PAGE.path}
        answerBlock={<span className="wakeari-answer">{ANSWER}</span>}
        crumbs={[{ name: "ホーム", href: "/" }, { name: PAGE.shortLabel }]}
        serviceName={PAGE.serviceName}
        serviceType={PAGE.serviceType}
        serviceDescription={PAGE.serviceDescription}
        serviceOffer={WAKEARI_SERVICE_OFFER}
        heroSrc="/hero/realestate-baikyaku-satei-16x9.webp"
        heroAlt="売りにくい土地・建物の出口相談のイメージ（査定と役所調査）"
        h1={PAGE.h1}
        ctaVariant="sale"
        ctaIntent={WAKEARI_CONTACT_INTENT}
        lead={
          <>
            <p className="text-sm text-text-muted">{WAKEARI_ANSWER_RESERVATION}</p>
            <p className="mt-3">
              「再建築不可と言われた」「名義が兄弟の共有のまま」「土地は借地」「15坪しかない」——買い手が限られる土地・建物には、<strong>売る前に整理すること</strong>と、<strong>売る以外の出口</strong>があります。このページは、相続した方にかぎらず、買った・親から生前にもらった・長く住んだ借地など、所有者の方全般の入口です。
            </p>
            <p className="mt-3">
              相続で引き継いだ不動産の全体像は
              <Link href="/souzoku" className="text-primary underline">
                文京区で不動産を相続したら（完全ガイド）
              </Link>
              に、種類ごとの詳しい話は下の4つのページにまとめています。対象は{WAKEARI_AREA}です。
            </p>
            <p className="mt-3 text-sm text-text-muted">最終更新：{WAKEARI_LAST_UPDATED_JA}</p>
          </>
        }
        internalLinks={[
          ...WAKEARI_TYPE_PAGES.map((p) => ({ href: p.path, label: p.h1 })),
          { href: "/souzoku", label: "文京区で不動産を相続したら｜完全ガイド" },
          { href: "/souzoku/akiya", label: "相続した空き家｜管理・活用・売却" },
          { href: "/nagare", label: "ご依頼から引渡しまでの流れ（書類・費用の時期）" },
          { href: "/ryokin", label: "料金のご案内" },
          { href: "/about/uramatsu", label: "代表・浦松丈二のプロフィール" },
          { href: WAKEARI_CONTACT_HREF, label: "お問い合わせ" },
        ]}
        relatedColumns={relatedColumns}
        relatedColumnsHeading="もっと詳しく（関連コラム）"
        crossLinkLead="遺産分割協議書など、相続に伴う書類の作成は併設の四葉行政書士事務所が別契約で受任します。"
        authorBio={`浦松 丈二｜四葉不動産株式会社 代表取締役・専任宅地建物取引士（東京）第293544号。行政書士（第25087022号）。元毎日新聞中国総局長。${SR_BIO.ja}。`}
      >
        {/* 3 見分け方 */}
        <div>
          <ReH2>うちの土地は、どの種類にあたりますか？</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            売りにくさの原因は<strong className="text-ink">建物の古さより権利と接道</strong>にあることがほとんどです。まず、どの種類にあたるかを書類で確かめます。複数にまたがることも珍しくありません。
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-sm">
              <thead>
                <tr className="bg-primary-tint text-left">
                  <th className="border border-border px-3 py-2">種類</th>
                  <th className="border border-border px-3 py-2">こんなとき</th>
                  <th className="border border-border px-3 py-2">確認する書類</th>
                  <th className="border border-border px-3 py-2">確認先</th>
                </tr>
              </thead>
              <tbody className="text-text">
                {JA_MIWAKE.map((r) => (
                  <tr key={r.type}>
                    <td className="border border-border px-3 py-2 font-medium text-ink whitespace-nowrap">
                      {r.page ? (
                        <Link href={WAKEARI_PAGES[r.page].path} className="text-primary underline">
                          {r.type}
                        </Link>
                      ) : (
                        r.type
                      )}
                    </td>
                    <td className="border border-border px-3 py-2">{r.when}</td>
                    <td className="border border-border px-3 py-2">{r.docs}</td>
                    <td className="border border-border px-3 py-2">{r.where}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            未登記の建物、境界が未確定の土地、長屋・連棟の切り離しが重なる場合は、売る前に登記・測量の手続が必要になることがあります（表題登記は土地家屋調査士、所有権の登記は司法書士の業務です）。
          </p>
        </div>

        {/* 4 3つの出口の比較表 */}
        <div>
          <ReH2>媒介で売る・買取・貸して持つは、何が違いますか？</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            3つの出口を、同じ物差しで並べます。<strong className="text-ink">相場・割合・日数は案件ごとに違うため、ここには書きません。</strong>個別の見込みは、調査のあとに書面でお示しします。
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-sm">
              <thead>
                <tr className="bg-primary-tint text-left">
                  <th className="border border-border px-3 py-2"> </th>
                  <th className="border border-border px-3 py-2">媒介で売る</th>
                  <th className="border border-border px-3 py-2">提携する買取業者を買主とする媒介</th>
                  <th className="border border-border px-3 py-2">貸す・活用して持つ</th>
                </tr>
              </thead>
              <tbody className="text-text">
                {JA_DEGUCHI.map((d) => (
                  <tr key={d.axis}>
                    <td className="border border-border px-3 py-2 font-medium text-ink whitespace-nowrap">{d.axis}</td>
                    <td className="border border-border px-3 py-2">{d.baikai}</td>
                    <td className="border border-border px-3 py-2">{d.kaitori}</td>
                    <td className="border border-border px-3 py-2">{d.katsuyo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 leading-relaxed text-text">
            <strong className="text-ink">買取の建て付けについて。</strong>買取をご希望の場合、買主は提携する買取業者です。当社は売主様との媒介契約に基づいて複数の買取業者に打診し、提示を並べてお示しします。報酬は、宅地建物取引業法第46条に基づく告示の上限の範囲内の媒介報酬で、買主が誰かは媒介契約と重要事項説明の書面で明示します（同法第34条の取引態様の明示）。日数や金額を競う買取はしません。当社が出す差は、<strong className="text-ink">調べた結果を報告書にして、選択肢を並べること</strong>です。
          </p>
          <p className="mt-3 leading-relaxed text-text">
            売却した場合の税金（譲渡所得）や、相続がからむ場合の相続税・特例の適用可否は<strong className="text-ink">税理士の業務</strong>です。当社は、税理士が判断に使う不動産側の数字（売却見込み・賃料見込み・維持費）を揃えてお渡しします。
          </p>
        </div>

        {/* 5 四葉が行うこと */}
        <div>
          <ReH2>四葉不動産に相談すると、何をしてもらえますか？</ReH2>
          <ol className="mt-3 space-y-3">
            {JA_NAGARE.map((s) => (
              <li key={s.step} className="rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text">
                <strong className="text-ink">{s.step}</strong>
                <span className="mt-1 block">{s.body}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 leading-relaxed text-text">
            ご相談と査定は無料です。<strong className="text-ink">建築の可否、認定・許可の見込み、擁壁の安全性は建築士と特定行政庁（文京区）が、登記は司法書士が、税は税理士が、紛争は弁護士が判断します。</strong>当社はそれぞれの専門家に、役所で確認した事実を整理してつなぎます。
          </p>
        </div>

        {/* 出口チェックリスト（静的JS・送信なし） */}
        <div>
          <ReH2>まず、何から確認すればよいですか？</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            6つの質問に答えると、考えられる出口と、先に確認する書類を一般論として表示します。結果は診断ではなく、<strong className="text-ink">ご相談のときに話を早く進めるための整理</strong>です。
          </p>
          <div className="mt-4">
            <WakeariExitChecklist />
          </div>
        </div>

        {/* 種類別ページ */}
        <div>
          <ReH2>種類ごとの詳しいページ</ReH2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {WAKEARI_TYPE_PAGES.map((p) => (
              <Link
                key={p.key}
                href={p.path}
                className="group block rounded-xl border border-border bg-surface p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-md"
              >
                <p className="text-sm font-bold leading-relaxed text-ink group-hover:text-primary">{p.h1}</p>
                <p className="mt-1 text-xs leading-relaxed text-text-muted">{p.summary}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary">
                  ページを見る
                  <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* 2＋6 事業者主語の一文・誰に相談すればよいですか（役割表＋分離受任の一文） */}
        <WakeariRoleTable />

        {/* 7 FAQ（FAQPage JSON-LD＝本文と同一配列・ハブは10問） */}
        <Faq items={WAKEARI_FAQ.hub} heading="よくある質問" ariaLabel="よくある質問" withJsonLd inLanguage="ja" bare openFirst={false} />

        {/* 8＋9 この記事の根拠・署名・最終更新 */}
        <WakeariSources rows={JA_KONKYO} />

        <CannotHandle bare />
      </RealestateServicePage>
    </>
  );
}
