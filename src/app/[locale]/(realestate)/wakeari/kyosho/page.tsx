// /wakeari/kyosho（狭小地・旗竿地の受け皿）＝2026-09-23 新設・日本語版のみ・監修前ドラフト
// 方式・型・JSON-LD・コンプライアンスの決まりは /wakeari/page.tsx 冒頭と src/lib/wakeari.ts 冒頭を参照。
// 役割＝「誰に頼めるか・四葉は何をするか・費用・流れ」。容積率と土地値・駐車場活用・賃貸併用の深掘りはコラムへ送る。
// 建築の可否（建蔽率・容積率・敷地面積の最低限度・路地状敷地の幅員）は建築士と特定行政庁（文京区）が判断する＝当社は可否を書かない。
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

const PAGE = WAKEARI_PAGES.kyosho;
const ANSWER = WAKEARI_ANSWER.kyosho;

/** 見分け方（確認すること／根拠／どこで） */
const JA_MIWAKE: { item: string; basis: string; where: string }[] = [
  {
    item: "用途地域と建蔽率・容積率（建てられる規模の上限）",
    basis: "建築基準法第52条（容積率）・第53条（建蔽率）",
    where: "文京区の都市計画図・文京区建築指導課",
  },
  {
    item: "敷地面積の最低限度の定めがある区域か",
    basis: "建築基準法第53条の2（都市計画で定められたときは、その面積以上）",
    where: "文京区の都市計画図・文京区建築指導課",
  },
  {
    item: "路地状部分の幅と長さ（旗竿地）",
    basis: "東京都建築安全条例第3条（長さ20m以下は幅2m以上、20m超は3m以上）・第3条の2（幅4m未満は原則3階以上不可）",
    where: "地積測量図・現地の実測・建築士",
  },
  {
    item: "接道の長さ（2m以上か）",
    basis: "建築基準法第43条第1項",
    where: "文京区建築指導課・建築士",
  },
  {
    item: "セットバックの要否（前面道路の幅が4m未満か）",
    basis: "建築基準法第42条第2項・同法施行令第2条第1項第1号（後退部分は敷地面積に算入しない）",
    where: "文京区建築指導課",
  },
  {
    item: "がけ・擁壁",
    basis: "東京都建築安全条例第6条",
    where: "建築士・文京区建築指導課",
  },
];

/** 買い手の種類と価格の考え方 */
const JA_KAITE: { buyer: string; view: string; ours: string }[] = [
  {
    buyer: "隣地所有者",
    view: "自分の敷地が広がり、建てられる建物の選択肢が増える。他の買い手より高い価格を付けられることがある",
    ours: "媒介として書面でお尋ねします。声のかけ方と時期が結果を左右します",
  },
  {
    buyer: "狭小住宅を建てる個人",
    view: "建てられる規模（建蔽率・容積率・階数）と接道が価格を決める",
    ours: "建築の制限を役所で確認し、建築士の見立てを添えて情報を出します",
  },
  {
    buyer: "建売・分譲の事業者",
    view: "近隣の土地とまとめて計画できるかで見方が変わる",
    ours: "条件を整理して打診します",
  },
  {
    buyer: "駐車場などで運用する投資家",
    view: "賃料見込みと利回りで見る",
    ours: "月極・コインパーキングの見込みを並べます",
  },
  {
    buyer: "買取業者（当社は媒介）",
    view: "再販の見込みと工事費を差し引いた価格になるのが一般的",
    ours: "複数に打診し、提示を並べます。買主が誰かは書面で明示します",
  },
];

const JA_KONKYO: WakeariSource[] = [
  { what: "容積率・建蔽率の制限", source: "建築基準法（昭和25年法律第201号）第52条・第53条" },
  {
    what: "都市計画で建築物の敷地面積の最低限度が定められたときは、その最低限度以上でなければならないこと（最低限度は200㎡を超えない）",
    source: "建築基準法第53条の2第1項・第2項",
  },
  { what: "敷地は道路に2m以上接すること", source: "建築基準法第43条第1項" },
  {
    what: "幅4m未満の道で特定行政庁が指定したものは道路とみなし、中心線から2mの線を境界とみなすこと（セットバック）",
    source: "建築基準法第42条第2項",
  },
  { what: "後退部分を敷地面積に算入しないこと", source: "建築基準法施行令（昭和25年政令第338号）第2条第1項第1号" },
  {
    what: "路地状敷地の幅員（長さ20m以下は2m以上、20m超は3m以上）",
    source: "東京都建築安全条例（昭和25年東京都条例第89号・最終改正 令和7年3月31日条例第53号）第3条",
  },
  { what: "路地状部分の幅員が4m未満の敷地には原則として階数3以上の建築物を建築できないこと", source: "東京都建築安全条例第3条の2" },
  { what: "がけに近接する建築物の制限", source: "東京都建築安全条例第6条" },
  { what: "媒介契約の書面交付と、価額について意見を述べるときの根拠の明示", source: "宅地建物取引業法（昭和27年法律第176号）第34条の2第1項・第2項" },
  {
    what: "媒介報酬の上限",
    source: "宅地建物取引業法第46条第1項・第2項／昭和45年建設省告示第1552号（最終改正 令和6年国土交通省告示第949号・2024年7月1日施行。売買価格800万円以下の低廉な空家等の特例を含む）",
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
  const relatedColumns = WAKEARI_COLUMN_SLUGS.kyosho.flatMap((slug) => all.filter((c) => c.slug === slug));

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
        heroSrc="/hero/bunkyo-sakura-16x9.webp"
        heroAlt="文京区の住宅街のイメージ（狭小地・旗竿地）"
        h1={PAGE.h1}
        ctaVariant="sale"
        ctaIntent={WAKEARI_CONTACT_INTENT}
        lead={
          <>
            <p className="text-sm text-text-muted">{WAKEARI_ANSWER_RESERVATION}</p>
            <p className="mt-3">
              15坪前後の土地は「狭いから安い」と決まっているわけではありません。<strong>誰が買うかで価格の考え方が変わる</strong>土地です。このページでは、建築の制限の確かめ方、買い手の種類、4つの出口、四葉不動産が行うこと、誰に相談するかを整理します。
            </p>
            <p className="mt-3">
              種類を問わない全体像は
              <Link href={WAKEARI_PAGES.hub.path} className="text-primary underline">
                売りにくい土地・建物の出口相談
              </Link>
              に、接道が足りない場合は
              <Link href={WAKEARI_PAGES["saikenchiku-fuka"].path} className="text-primary underline">
                再建築不可の土地・家のページ
              </Link>
              にまとめています。
            </p>
            <p className="mt-3 text-sm text-text-muted">最終更新：{WAKEARI_LAST_UPDATED_JA}</p>
          </>
        }
        internalLinks={[
          { href: WAKEARI_PAGES.hub.path, label: WAKEARI_PAGES.hub.shortLabel },
          { href: WAKEARI_PAGES["saikenchiku-fuka"].path, label: WAKEARI_PAGES["saikenchiku-fuka"].h1 },
          { href: WAKEARI_PAGES.kyoyu.path, label: WAKEARI_PAGES.kyoyu.h1 },
          { href: "/toushi", label: "投資用・事業用不動産（土地活用）" },
          { href: "/souzoku/akiya", label: "相続した空き家｜管理・活用・売却" },
          { href: "/ryokin", label: "料金のご案内" },
          { href: WAKEARI_CONTACT_HREF, label: "お問い合わせ" },
        ]}
        relatedColumns={relatedColumns}
        crossLinkLead="相続に伴う書類の作成は併設の四葉行政書士事務所が別契約で受任します。"
        authorBio={`浦松 丈二｜四葉不動産株式会社 代表取締役・専任宅地建物取引士（東京）第293544号。行政書士（第25087022号）。元毎日新聞中国総局長。${SR_BIO.ja}。`}
      >
        {/* 3 見分け方 */}
        <div>
          <ReH2>狭小地・旗竿地で、先に確かめることは何ですか？</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            狭い土地ほど、<strong className="text-ink">建てられる規模の上限と、建てられない条件</strong>が価格を左右します。役所と書類で確かめる順に並べます。
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-sm">
              <thead>
                <tr className="bg-primary-tint text-left">
                  <th className="border border-border px-3 py-2">確認すること</th>
                  <th className="border border-border px-3 py-2">根拠</th>
                  <th className="border border-border px-3 py-2">どこで</th>
                </tr>
              </thead>
              <tbody className="text-text">
                {JA_MIWAKE.map((r) => (
                  <tr key={r.item}>
                    <td className="border border-border px-3 py-2 font-medium text-ink">{r.item}</td>
                    <td className="border border-border px-3 py-2">{r.basis}</td>
                    <td className="border border-border px-3 py-2">{r.where}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 leading-relaxed text-text">
            旗竿地は、東京都建築安全条例第3条により、路地状部分の長さが20m以下なら幅2m以上、20mを超えるなら3m以上が必要です。幅が4m未満の路地状敷地には、原則として3階以上の建物を建てられません（同条例第3条の2）。前面道路の幅が4m未満なら、中心線から2mの線まで後退する必要があり、後退部分は敷地面積に算入されません（建築基準法第42条第2項・同法施行令第2条第1項第1号）。<strong className="text-ink">これらに当てはまるかどうかの最終判断は、建築士と特定行政庁（文京区）が行います。</strong>
          </p>
        </div>

        {/* 4 買い手の種類と出口 */}
        <div>
          <ReH2>狭小地の買い手には、どんな人がいますか？</ReH2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-sm">
              <thead>
                <tr className="bg-primary-tint text-left">
                  <th className="border border-border px-3 py-2">買い手</th>
                  <th className="border border-border px-3 py-2">価格の考え方</th>
                  <th className="border border-border px-3 py-2">四葉不動産が行うこと</th>
                </tr>
              </thead>
              <tbody className="text-text">
                {JA_KAITE.map((r) => (
                  <tr key={r.buyer}>
                    <td className="border border-border px-3 py-2 font-medium text-ink">{r.buyer}</td>
                    <td className="border border-border px-3 py-2">{r.view}</td>
                    <td className="border border-border px-3 py-2">{r.ours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 leading-relaxed text-text">
            同じ地域の坪単価をそのまま当てはめられないのが狭小地です。当社は、査定額の根拠を書面でご説明します（宅地建物取引業法第34条の2第2項）。査定額と実際に売れる価格の違いは、
            <Link href="/column/satei-gaku-to-fuda-chigai" className="text-primary underline">
              査定額と売値の違い
            </Link>
            にまとめています。
          </p>
        </div>

        <div>
          <ReH2>売る以外に、どんな出口がありますか？</ReH2>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-text">
            <li>
              <strong className="text-ink">① 隣地の所有者へ売る。</strong>敷地が広がることで建てられる建物の選択肢が増えるため、他の買い手より高い価格が付くことがあります。相手の事情と時期によるので、当社が媒介として書面でお尋ねします。
            </li>
            <li>
              <strong className="text-ink">② 狭小住宅の用地として売る。</strong>建築の制限を確認したうえで、建てられる規模を添えて買い手を探します。買取をご希望なら、買取業者に打診して提示を並べます。
            </li>
            <li>
              <strong className="text-ink">③ 駐車場やトランクルームとして貸す。</strong>月極駐車場・コインパーキング、トランクルーム、自動販売機の設置などがあります。収入は限られますが、固定資産税等の負担を軽くしながら次の判断を待てます。
            </li>
            <li>
              <strong className="text-ink">④ 建てて持つ。</strong>狭小住宅や賃貸併用住宅を建てて住む・貸す選択肢です。建てられる規模と可否は建築士と特定行政庁の判断になるため、当社は制限の確認と収支の見込みまでを担います。
            </li>
          </ul>
          <p className="mt-3 leading-relaxed text-text">
            隣地を買い増して敷地を広げる、逆に隣地とまとめて売る、という方向もあります。土地の値段と容積率の関係は
            <Link href="/column/yosekiritsu-hosei-tochine" className="text-primary underline">
              土地値と容積率の考え方
            </Link>
            にまとめています。
          </p>
        </div>

        {/* 5 四葉が行うこと */}
        <div>
          <ReH2>四葉不動産は、何をどこまで行いますか？</ReH2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-text">
            <li>登記事項証明書・公図・地積測量図を確認し、現地で接道の長さと路地状部分の幅を実測します。</li>
            <li>文京区建築指導課で用途地域・建蔽率・容積率・敷地面積の最低限度・道路の種別と後退の要否を確認します。</li>
            <li>確認した事実と、建築の可否の判断を要する点（建築士・特定行政庁）を報告書にします。</li>
            <li>隣地売却・媒介・賃貸・建てて持つを、価格の考え方・期間の考え方・費用で並べます。</li>
            <li>媒介契約は書面で、価額の根拠と報酬（宅地建物取引業法第46条の上限の範囲内）を明示し、買い手の候補ごとに打診します。買取をご希望なら買取業者に打診して提示を並べます。</li>
            <li>契約・決済まで進めます。境界の確定は土地家屋調査士、登記は司法書士におつなぎします。</li>
          </ol>
          <p className="mt-3 leading-relaxed text-text">
            ご相談と査定は無料です。<strong className="text-ink">建てられるかどうかの判断は行いません。</strong>
          </p>
        </div>

        <WakeariRoleTable />

        <Faq items={WAKEARI_FAQ.kyosho} heading="よくある質問" ariaLabel="よくある質問" withJsonLd inLanguage="ja" bare openFirst={false} />

        <WakeariSources rows={JA_KONKYO} />

        <CannotHandle bare />
      </RealestateServicePage>
    </>
  );
}
