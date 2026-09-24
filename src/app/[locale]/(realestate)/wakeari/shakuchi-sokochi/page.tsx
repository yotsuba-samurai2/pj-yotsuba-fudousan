// /wakeari/shakuchi-sokochi（借地権・底地の受け皿）＝2026-09-23 新設・日本語版のみ・監修前ドラフト
// 方式・型・JSON-LD・コンプライアンスの決まりは /wakeari/page.tsx 冒頭と src/lib/wakeari.ts 冒頭を参照。
// 役割＝「誰に頼めるか・四葉は何をするか・費用・流れ」。地主承諾・借地権付建物・定期借地・底地の深掘りはコラムへ送る。
// 承諾料の相場・水準は書かない（案件で異なる）。当社は承諾料の交渉・代理を行わない。承諾に代わる許可の申立て（借地非訟）＝弁護士。税務上の効果＝税理士。
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

const PAGE = WAKEARI_PAGES["shakuchi-sokochi"];
const ANSWER = WAKEARI_ANSWER["shakuchi-sokochi"];

/** 見分け方（確認すること／書類／出口にどう効くか） */
const JA_MIWAKE: { item: string; docs: string; meaning: string }[] = [
  {
    item: "借地か、底地か、所有権か",
    docs: "土地と建物それぞれの登記事項証明書",
    meaning: "土地の名義が自分でなく建物だけ自分なら借地。土地が自分で建物が他人なら底地",
  },
  {
    item: "契約の日付（1992年8月1日より前か後か）",
    docs: "借地契約書（土地賃貸借契約書）",
    meaning: "1992年8月1日の借地借家法施行より前に設定された借地権は、存続期間・更新などに旧借地法の定めが引き続き適用される（附則第4条〜第7条）",
  },
  {
    item: "契約の種類（普通借地か、定期借地か）",
    docs: "契約書の特約（更新なし・期間満了で返還の定め）",
    meaning: "一般定期借地権（50年以上）・事業用定期借地権は更新がなく、残存期間が価格に直結する",
  },
  {
    item: "地代・更新料・承諾料の取り決めと支払の記録",
    docs: "契約書・通帳・領収書",
    meaning: "承諾の段取りと、買い手に引き継ぐ条件の土台になる",
  },
  {
    item: "建物の登記が借地権者の名義になっているか",
    docs: "建物の登記事項証明書",
    meaning: "借地権者名義の登記された建物があれば、借地権を第三者に対抗できる（借地借家法第10条第1項）",
  },
  {
    item: "地主（または借地人）の意向",
    docs: "これまでのやり取り",
    meaning: "承諾の見込み、買い取りの意向、同時売却の可能性を左右する",
  },
];

/** 出口（直答ブロックの①〜③＋貸して持つ） */
const JA_DEGUCHI: { exit: string; need: string; ours: string }[] = [
  {
    exit: "① 借地権を第三者へ売る（借地権付き建物として）",
    need: "地主の承諾（民法第612条第1項）。承諾料の取り決め",
    ours: "承諾を得る段取りを整え、媒介として地主に意向と条件をお尋ねします。買い手には承諾の条件を引き継ぎます。承諾料の交渉・代理は行いません",
  },
  {
    exit: "② 地主または借地人へ売る",
    need: "相手の資金と意向",
    ours: "価格の根拠を示してお尋ねし、条件を整理して媒介します。合意に至らない場合の手続は弁護士へ",
  },
  {
    exit: "③ 借地権と底地を同時に第三者へ売る／等価交換する",
    need: "地主と借地人の合意。税務上の効果の確認",
    ours: "更地としての売却見込みと分け方の案を作ります。税の判断は税理士へ",
  },
  {
    exit: "（売らない）貸して持ち続ける",
    need: "借地上の建物の転貸には地主の承諾（民法第612条第1項）",
    ours: "賃料見込みと維持費を並べます。承諾の要否を契約書で確認します",
  },
];

const JA_KONKYO: WakeariSource[] = [
  { what: "賃借権の譲渡・転貸に賃貸人の承諾が要ること／無断譲渡は解除事由", source: "民法（明治29年法律第89号）第612条第1項・第2項" },
  {
    what: "地主が承諾しないとき、裁判所が承諾に代わる許可を与えられること（借地非訟）",
    source: "借地借家法（平成3年法律第90号）第19条第1項",
  },
  { what: "借地権の存続期間（30年。契約でより長い期間を定めたときはその期間）", source: "借地借家法第3条" },
  { what: "借地権者名義で登記された建物があれば借地権を第三者に対抗できること", source: "借地借家法第10条第1項" },
  { what: "期間満了で更新がないときの建物買取請求権", source: "借地借家法第13条第1項" },
  { what: "一般定期借地権（存続期間50年以上・更新なし・書面等による特約）", source: "借地借家法第22条第1項" },
  { what: "事業用定期借地権等（30年以上50年未満・10年以上30年未満・公正証書）", source: "借地借家法第23条第1項〜第3項" },
  {
    what: "借地借家法の施行（1992年8月1日）より前に設定された借地権の存続期間・更新等には旧借地法の定めが適用されること",
    source: "借地借家法附則第4条〜第7条（経過措置）",
  },
  { what: "取引態様の明示", source: "宅地建物取引業法（昭和27年法律第176号）第34条第1項・第2項" },
  { what: "媒介契約の書面交付と価額の根拠の明示", source: "宅地建物取引業法第34条の2第1項・第2項" },
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
  const relatedColumns = WAKEARI_COLUMN_SLUGS["shakuchi-sokochi"].flatMap((slug) => all.filter((c) => c.slug === slug));

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
        heroSrc="/hero/realestate-jigyou-fudosan-16x9.webp"
        heroAlt="借地権・底地の整理のイメージ（土地と建物の権利関係）"
        h1={PAGE.h1}
        ctaVariant="sale"
        ctaIntent={WAKEARI_CONTACT_INTENT}
        lead={
          <>
            <p className="text-sm text-text-muted">{WAKEARI_ANSWER_RESERVATION}</p>
            <p className="mt-3">
              借地の家も、貸している土地（底地）も、<strong>相手（地主・借地人）がいる不動産</strong>です。出口は相手の承諾と意向で決まるため、順番を誤ると白紙に戻ります。このページでは、契約書の見方、3つの出口、四葉不動産が行うこと、誰に相談するかを整理します。相続した借地にかぎらず、長く住んだ借地、代々貸している底地も対象です。
            </p>
            <p className="mt-3">
              種類を問わない全体像は
              <Link href={WAKEARI_PAGES.hub.path} className="text-primary underline">
                売りにくい土地・建物の出口相談
              </Link>
              に、相続した借地の手続全体は
              <Link href="/souzoku" className="text-primary underline">
                文京区で不動産を相続したら（完全ガイド）
              </Link>
              にまとめています。
            </p>
            <p className="mt-3 text-sm text-text-muted">最終更新：{WAKEARI_LAST_UPDATED_JA}</p>
          </>
        }
        internalLinks={[
          { href: WAKEARI_PAGES.hub.path, label: WAKEARI_PAGES.hub.shortLabel },
          { href: WAKEARI_PAGES.kyoyu.path, label: WAKEARI_PAGES.kyoyu.h1 },
          { href: WAKEARI_PAGES["saikenchiku-fuka"].path, label: WAKEARI_PAGES["saikenchiku-fuka"].h1 },
          { href: "/souzoku", label: "文京区で不動産を相続したら｜完全ガイド" },
          { href: "/souzoku/akiya/koishikawa", label: "小石川の空き家（借地・共有で動かなくなる理由）" },
          { href: "/ryokin", label: "料金のご案内" },
          { href: WAKEARI_CONTACT_HREF, label: "お問い合わせ" },
        ]}
        relatedColumns={relatedColumns}
        crossLinkLead="相続に伴う書類の作成は併設の四葉行政書士事務所が別契約で受任します。"
        authorBio={`浦松 丈二｜四葉不動産株式会社 代表取締役・専任宅地建物取引士（東京）第293544号。行政書士（第25087022号）。元毎日新聞中国総局長。${SR_BIO.ja}。`}
      >
        {/* 3 見分け方 */}
        <div>
          <ReH2>借地権・底地の条件は、どこで見分けますか？</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            出発点は<strong className="text-ink">借地契約書と、土地・建物それぞれの登記事項証明書</strong>です。契約書が見当たらない場合も、地代の支払記録と登記から出発できます。
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-sm">
              <thead>
                <tr className="bg-primary-tint text-left">
                  <th className="border border-border px-3 py-2">確認すること</th>
                  <th className="border border-border px-3 py-2">書類</th>
                  <th className="border border-border px-3 py-2">出口にどう効くか</th>
                </tr>
              </thead>
              <tbody className="text-text">
                {JA_MIWAKE.map((r) => (
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
          <ReH2>借地権・底地には、どんな出口がありますか？</ReH2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-sm">
              <thead>
                <tr className="bg-primary-tint text-left">
                  <th className="border border-border px-3 py-2">出口</th>
                  <th className="border border-border px-3 py-2">必要なこと</th>
                  <th className="border border-border px-3 py-2">四葉不動産が行うこと</th>
                </tr>
              </thead>
              <tbody className="text-text">
                {JA_DEGUCHI.map((r) => (
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
            借地上の建物を第三者に売るには、土地の賃借権の譲渡について<strong className="text-ink">地主の承諾</strong>が必要です（民法第612条第1項）。承諾なく譲渡すると契約を解除されることがあります（同条第2項）。地主に不利となるおそれがないのに承諾が得られないときは、裁判所が承諾に代わる許可を与える制度があります（借地借家法第19条第1項）。<strong className="text-ink">この申立ては裁判所の手続で、代理は弁護士の業務です。</strong>承諾料の額は契約と地域の慣行によるため、このページには書きません。
          </p>
          <p className="mt-3 leading-relaxed text-text">
            買い手を探し始める前に、承諾の見込みと条件を地主に確かめる——この順番が、借地の売却で最も大切です。当社は媒介として、地主に意向と条件をお尋ねし、合意した内容を書面に整えます。<strong className="text-ink">承諾料の額の交渉や代理は行いません。</strong>対立がある場合は弁護士へご案内します。
          </p>
        </div>

        {/* 同時売却・等価交換 */}
        <div>
          <ReH2>地主と借地人が、一緒に出口を探す方法はありますか？</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            あります。<strong className="text-ink">同時売却</strong>は、借地人と地主が同時に第三者へ売り、更地としての価格を取り決めた割合で分ける方法です。<strong className="text-ink">等価交換</strong>は、借地権と底地を交換して、それぞれが完全な所有権の土地を持つ方法です。どちらも、借地権付き建物と底地を別々に売るより、合計の価格が付きやすいのが一般的です。
          </p>
          <p className="mt-3 leading-relaxed text-text">
            分け方の割合、交換の比率、譲渡所得の扱いと特例の適用可否は、案件ごとに違います。当社は更地としての売却見込みと分け方の案を作り、<strong className="text-ink">税務上の効果は税理士に</strong>確認していただきます。地主と借地人の利害が対立している場合の交渉の代理は弁護士の業務です。
          </p>
        </div>

        {/* 5 四葉が行うこと */}
        <div>
          <ReH2>四葉不動産は、何をどこまで行いますか？</ReH2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-text">
            <li>借地契約書と土地・建物の登記事項証明書を確認し、契約の種類・期間・地代・承諾の定めを整理します。</li>
            <li>用途地域・接道・建築の制限を役所で確認し、現地を見ます。</li>
            <li>借地権付き建物としての売却見込み、底地としての売却見込み、更地としての売却見込み、賃料見込みを並べた報告書にします。</li>
            <li>地主（または借地人）に意向と条件をお尋ねし、承諾の見込みを確かめます。</li>
            <li>媒介契約は書面で、価額の根拠と報酬（宅地建物取引業法第46条の上限の範囲内）を明示し、買い手を探します。買取をご希望なら買取業者に打診して提示を並べます。</li>
            <li>契約・決済まで進めます。建物の登記は司法書士・土地家屋調査士におつなぎします。</li>
          </ol>
          <p className="mt-3 leading-relaxed text-text">
            ご相談と査定は無料です。<strong className="text-ink">承諾に代わる許可の申立て、承諾料の交渉、地主・借地人との紛争性のある手続の代理、税額の計算は行いません。</strong>
          </p>
        </div>

        <WakeariRoleTable />

        <Faq
          items={WAKEARI_FAQ["shakuchi-sokochi"]}
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
