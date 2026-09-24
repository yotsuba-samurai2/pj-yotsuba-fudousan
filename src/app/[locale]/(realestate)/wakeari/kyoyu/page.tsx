// /wakeari/kyoyu（共有名義の受け皿）＝2026-09-23 新設・監修前ドラフト。2026-09-24 繁体字版を追加（ZhTwPage.tsx・本文は日本語版の逐語訳）
// 方式・型・JSON-LD・コンプライアンスの決まりは /wakeari/page.tsx 冒頭と src/lib/wakeari.ts 冒頭を参照。
// 役割＝「誰に頼めるか・四葉は何をするか・費用・流れ」。同意・兄弟共有・中華圏相続人・換価分割の深掘りはコラムへ送る。
// 遺産分割協議書＝四葉行政書士事務所（独立した事業体・別々にご契約）。登記＝司法書士。共有物分割請求・所在等不明共有者の裁判＝弁護士。税＝税理士。
// 当社は共有者どうしの交渉・代理を行わない（指示書 5-3 の回答の規律）。
import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
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
import { KyoyuPageZhTw, TW_META } from "./ZhTwPage";

const PAGE = WAKEARI_PAGES.kyoyu;
const ANSWER = WAKEARI_ANSWER.kyoyu;

/** 見分け方（状態／確認する書類／最初に動く相手） */
const JA_MIWAKE: { state: string; docs: string; where: string }[] = [
  {
    state: "名義人が2人以上で、全員と連絡が取れる",
    docs: "登記事項証明書（共有者・持分の割合）",
    where: "四葉不動産（全員売却・持分売却の比較）",
  },
  {
    state: "亡くなった方の名義のまま（相続登記が未了）",
    docs: "戸籍・相続関係説明図・遺言書の有無",
    where: "四葉行政書士事務所（遺産分割協議書・別契約）・司法書士（相続登記）",
  },
  {
    state: "反対している共有者がいる",
    docs: "これまでのやり取りの記録",
    where: "弁護士（共有物分割請求＝民法第256条・第258条）",
  },
  {
    state: "所在や連絡先が分からない共有者がいる",
    docs: "登記上の住所・戸籍の附票",
    where: "弁護士（所在等不明共有者の持分の取得・譲渡＝民法第262条の2・第262条の3）",
  },
  {
    state: "判断能力に不安のある共有者がいる",
    docs: "成年後見の有無",
    where: "家庭裁判所の手続（弁護士・司法書士）",
  },
  {
    state: "持分に抵当権が付いている",
    docs: "登記事項証明書（権利部乙区）",
    where: "金融機関（承諾・抹消）・司法書士",
  },
];

/** 出口の比較（直答ブロックの①〜③＋売らない選択肢） */
const JA_DEGUCHI: { exit: string; need: string; ours: string }[] = [
  {
    exit: "① 共有者全員で売る",
    need: "全員の同意（民法第251条第1項）。売却代金は持分の割合で分ける",
    ours: "全員の意向を確かめたうえで媒介します。売却見込みと保有した場合の数字を並べ、話し合いの材料にします",
  },
  {
    exit: "② 自分の持分だけ売る",
    need: "他の共有者の同意は不要。買い手は他の共有者か、持分を買う業者に限られやすい",
    ours: "まず他の共有者に買い取りの意向を確かめ、難しければ持分を買う業者に打診して提示を並べます。価格は全体の按分より低くなるのが一般的であることをお伝えします",
  },
  {
    exit: "③ 売る前に名義を整理する（相続登記・持分の買い取り・代償分割）",
    need: "遺産分割の合意、持分移転登記、代償金の資金",
    ours: "売却見込みと持ち続けた場合の数字を揃えます。協議書の作成は四葉行政書士事務所（別契約）、登記は司法書士、争いがある場合は弁護士へ",
  },
  {
    exit: "（売らない）共有のまま貸す・一人が持つ",
    need: "短期の賃貸借は持分の価格の過半数で決められる（民法第252条第4項）",
    ours: "賃料見込みと維持費を並べ、売らない選択肢も同じ物差しで示します",
  },
];

const JA_KONKYO: WakeariSource[] = [
  { what: "共有物の変更（売却を含む）には他の共有者全員の同意が要ること", source: "民法（明治29年法律第89号）第251条第1項" },
  {
    what: "所在等不明の共有者がいる場合に、裁判所の裁判で変更を加えられること",
    source: "民法第251条第2項（令和3年法律第24号・2023年4月1日施行）",
  },
  {
    what: "共有物の管理は持分の価格の過半数で決めること／短期の賃貸借（土地5年・建物3年）の設定",
    source: "民法第252条第1項・第4項",
  },
  { what: "各共有者はいつでも共有物の分割を請求できること（5年以内の不分割特約は可）", source: "民法第256条第1項" },
  {
    what: "協議が調わないときの裁判による分割（現物分割・代償分割・競売）",
    source: "民法第258条第1項〜第3項",
  },
  {
    what: "所在等不明共有者の持分の取得（相続開始から10年を経過していないときは不可）",
    source: "民法第262条の2（令和3年法律第24号・2023年4月1日施行）",
  },
  {
    what: "所在等不明共有者の持分の譲渡（他の共有者全員が特定の者に持分の全部を譲渡することが条件）",
    source: "民法第262条の3（令和3年法律第24号・2023年4月1日施行）",
  },
  {
    what: "相続登記の申請義務（相続を知り、かつ所有権の取得を知った日から3年以内）",
    source: "不動産登記法（平成16年法律第123号）第76条の2第1項（令和3年法律第24号・2024年4月1日施行）",
  },
  { what: "媒介契約の書面交付と価額の根拠の明示", source: "宅地建物取引業法（昭和27年法律第176号）第34条の2第1項・第2項" },
  {
    what: "媒介報酬の上限",
    source: "宅地建物取引業法第46条第1項・第2項／昭和45年建設省告示第1552号（最終改正 令和6年国土交通省告示第949号・2024年7月1日施行）",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  // 2026-09-24 Phase 3：繁体字版あり（ZhTwPage.tsx）。en・zh は日本語本文のフォールバック＝canonical は ja（/souzoku/taiwan と同じ型）
  if (locale === "zh-tw") {
    return buildPageMetadata({
      businessKey: "realestate",
      title: TW_META.title,
      description: TW_META.description,
      path: PAGE.path,
      keywords: TW_META.keywords,
      locale,
      absoluteTitle: true,
      availableLocales: ["ja", "zh-tw"],
    });
  }
  return buildPageMetadata({
    businessKey: "realestate",
    title: PAGE.title,
    description: PAGE.description,
    path: PAGE.path,
    keywords: PAGE.keywords,
    locale: "ja",
    absoluteTitle: true,
    availableLocales: ["ja", "zh-tw"],
  });
}

export default async function Page() {
  if ((await getRequestLocale()) === "zh-tw") return <KyoyuPageZhTw />;
  const all = (await getColumns("ja")).map((c) => getLocalizedColumn(c, "ja"));
  const relatedColumns = WAKEARI_COLUMN_SLUGS.kyoyu.flatMap((slug) => all.filter((c) => c.slug === slug));

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
        heroSrc="/hero/realestate-isan-bunkatsu-16x9.webp"
        heroAlt="共有名義の不動産を整理するイメージ（書類と話し合い）"
        h1={PAGE.h1}
        ctaVariant="sale"
        ctaIntent={WAKEARI_CONTACT_INTENT}
        lead={
          <>
            <p className="text-sm text-text-muted">{WAKEARI_ANSWER_RESERVATION}</p>
            <p className="mt-3">
              共有名義の不動産で止まるのは、建物の状態ではなく<strong>「誰が売主になれるか」</strong>です。このページでは、状態の見分け方、3つの出口と売らない選択肢、四葉不動産が行うこと、誰に相談するかを整理します。相続した実家にかぎらず、生前に持分をもらった方、共同で買った方も対象です。
            </p>
            <p className="mt-3">
              種類を問わない全体像は
              <Link href={WAKEARI_PAGES.hub.path} className="text-primary underline">
                売りにくい土地・建物の出口相談
              </Link>
              に、相続の手続全体は
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
          { href: WAKEARI_PAGES["shakuchi-sokochi"].path, label: WAKEARI_PAGES["shakuchi-sokochi"].h1 },
          { href: WAKEARI_PAGES["saikenchiku-fuka"].path, label: WAKEARI_PAGES["saikenchiku-fuka"].h1 },
          { href: "/souzoku", label: "文京区で不動産を相続したら｜完全ガイド" },
          { href: "/souzoku/chinese", label: "中国語で相談できる不動産相続" },
          { href: "/legal/services/inheritance", label: "相続・遺言の書類作成（四葉行政書士事務所・別契約）" },
          { href: "/ryokin", label: "料金のご案内" },
          { href: WAKEARI_CONTACT_HREF, label: "お問い合わせ" },
        ]}
        relatedColumns={relatedColumns}
        crossLinkLead="遺産分割協議書・相続関係説明図などの書類の作成は、併設の四葉行政書士事務所が独立した事業体として別契約で受任します。"
        authorBio={`浦松 丈二｜四葉不動産株式会社 代表取締役・専任宅地建物取引士（東京）第293544号。行政書士（第25087022号）。元毎日新聞中国総局長。${SR_BIO.ja}。`}
      >
        {/* 3 見分け方 */}
        <div>
          <ReH2>共有の状態は、どうやって見分けますか？</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            出発点は<strong className="text-ink">登記事項証明書の権利部（甲区）</strong>です。名義人が何人か、持分の割合、亡くなった方の名義が残っていないか、抵当権（乙区）の有無を確かめます。状態ごとに、最初に動く相手が違います。
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-sm">
              <thead>
                <tr className="bg-primary-tint text-left">
                  <th className="border border-border px-3 py-2">状態</th>
                  <th className="border border-border px-3 py-2">確認する書類</th>
                  <th className="border border-border px-3 py-2">最初に動く相手</th>
                </tr>
              </thead>
              <tbody className="text-text">
                {JA_MIWAKE.map((r) => (
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
            亡くなった方の名義のままの場合、相続登記を済ませて売主を確定させるのが先です。相続登記は2024年4月1日から申請が義務化され、相続を知り、かつ所有権の取得を知った日から3年以内の申請が必要です（不動産登記法第76条の2第1項）。
          </p>
        </div>

        {/* 4 出口の比較 */}
        <div>
          <ReH2>共有の土地・家には、どんな出口がありますか？</ReH2>
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
            共有物を丸ごと売ることは「変更」にあたり、<strong className="text-ink">共有者全員の同意</strong>が要ります（民法第251条第1項）。一人でも反対すれば全体は売れません。反対する共有者と話し合いがつかないときの共有物分割請求（民法第256条・第258条）は裁判所の手続で、その代理は弁護士の業務です。<strong className="text-ink">当社は共有者どうしの交渉や代理を行いません。</strong>売った場合と持ち続けた場合の数字を揃えて、話し合いの材料を出すところまでを担います。
          </p>
          <p className="mt-3 leading-relaxed text-text">
            所在の分からない共有者がいる場合、2023年4月1日施行の改正民法で、裁判所の裁判によりその持分を取得する制度（第262条の2）と、他の共有者全員で第三者に譲渡する権限を得る制度（第262条の3）ができました。相続で生じた持分は、相続開始から10年を経過していることが要件です。詳しい手続は弁護士へおつなぎします。
          </p>
        </div>

        {/* 売らずに整理する */}
        <div>
          <ReH2>売らずに整理する方法はありますか？</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            あります。一人が取得して他の相続人に代償金を払う<strong className="text-ink">代償分割</strong>、共有のまま貸して賃料を分ける方法などです。当社は「売った場合」と「持ち続けた場合」の数字を同じ物差しで並べ、<strong className="text-ink">売らない選択肢も含めて</strong>お示しします。売ることを前提にした相談ではありません。
          </p>
          <p className="mt-3 leading-relaxed text-text">
            遺産分割協議書や相続関係説明図の作成は、四葉行政書士事務所が<strong className="text-ink">独立した事業体として受任し、別々にご契約</strong>いただきます。相続登記・持分移転登記の申請は司法書士、相続税・譲渡所得の判断は税理士へ、それぞれ直接ご依頼いただく形をご案内します。台湾・中国大陸に相続人がいる場合の書類は
            <Link href="/souzoku/chinese" className="text-primary underline">
              中国語で相談できる不動産相続
            </Link>
            にまとめています。
          </p>
        </div>

        {/* 5 四葉が行うこと */}
        <div>
          <ReH2>四葉不動産は、何をどこまで行いますか？</ReH2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-text">
            <li>登記事項証明書で共有者・持分・抵当権を確認し、現地を見ます。</li>
            <li>用途地域・接道・建築の制限を役所で確認し、売却見込み・賃料見込み・維持費を並べた報告書にします。</li>
            <li>全員売却・持分売却・名義の整理・売らない選択肢を、同じ物差しで比べます。</li>
            <li>全員売却なら共有者全員と媒介契約を結び（書面・価額の根拠・報酬の明示）、買い手を探します。持分売却なら他の共有者の意向を確かめ、持分を買う業者に打診して提示を並べます。</li>
            <li>契約・決済まで進め、登記の申請は司法書士におつなぎします。</li>
          </ol>
          <p className="mt-3 leading-relaxed text-text">
            ご相談と査定は無料です。<strong className="text-ink">共有者間の交渉や代理、裁判の手続、登記の申請、税額の計算は行いません。</strong>
          </p>
        </div>

        <WakeariRoleTable />

        <Faq items={WAKEARI_FAQ.kyoyu} heading="よくある質問" ariaLabel="よくある質問" withJsonLd inLanguage="ja" bare openFirst={false} />

        <WakeariSources rows={JA_KONKYO} />

        <CannotHandle bare />
      </RealestateServicePage>
    </>
  );
}
