// /labor/faq（型B・FAQPage）＝原稿_社労士 #6（開業後公開・SR_LAUNCHED=falseの間は404）
// FAQPage JSON-LDはこの専用ページのみ。【要確認】の項目は断定しない安全文（未検証を出力しない原則）。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { Faq, type FaqItem } from "@/components/shared/Faq";
import { CtaBand } from "@/components/shared/CtaBand";
import { Placeholder } from "@/components/shared/Placeholder";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "labor",
    title: "よくある質問｜四葉社会保険労務士事務所",
    description:
      "四葉社会保険労務士事務所への「顧問契約とスポット依頼の違い」「障害福祉事業所の労務では何を頼めるか」「助成金と補助金はどちらに頼むか」などのよくある質問に、一問一答でお答えします。文京区小日向・茗荷谷駅徒歩5分。",
    path: "/labor/faq",
    locale,
    absoluteTitle: true,
  });
}

const ITEMS: FaqItem[] = [
  {
    q: "顧問契約とスポット依頼の違いは？",
    a: "当事務所の顧問料は、労務のご相談に対する対価です。労働社会保険の手続は、顧問先の方も報酬額表の料金を都度申し受けます。なお、手続だけのご依頼は承っておりません。ご相談を伴わずに手続だけをお受けすると、実情を把握しないまま誤った前提で処理してしまうおそれがあるためです。法人・個人事業主のお客さまは顧問契約を前提としてお受けします。障害年金のご相談（個人のお客さま）は、顧問契約を前提としません。",
  },
  {
    q: "障害福祉事業所の労務では何を頼めますか？",
    a: "人員配置基準を踏まえた就業規則・シフトの設計、労働社会保険の手続、処遇改善加算の賃金要件の設計と賃金改善額の算定を承ります。加算の計画書・実績報告書の作成と指定権者への提出は、当事務所では取り扱いません。四葉行政書士事務所で承ることも可能です（それぞれ別々にご契約いただきます）。",
  },
  {
    q: "助成金と補助金はどちらに頼めばいい？",
    a: "雇用関係の助成金は当事務所（社会保険労務士）、事業の補助金は四葉行政書士事務所（行政書士・別事業体）です。窓口でご事情を伺い、適切な資格者をご案内します。",
  },
  {
    q: "外国人スタッフの労務も見てもらえますか。中国語でも相談できますか。",
    a: "承ります。代表は元毎日新聞中国総局長で、中国語（繁体字・簡体字）と英語に対応します。受入れ後の労務に関するご相談は顧問料に含みます。募集・採用の設計は「募集・採用コンサルタント」として別途お見積りいたします。在留資格の申請書類の作成・申請取次は、四葉行政書士事務所で承ることも可能です（それぞれ別々にご契約いただきます）。",
  },
  {
    q: "文京区以外も対応していますか？",
    a: "文京区・茗荷谷を中心に対応します。エリア外については個別にご相談ください。",
  },
];

export default function Page() {
  return (
    <>
      <Breadcrumb items={[{ name: "ホーム", href: "/labor" }, { name: "よくある質問" }]} />
      {/* FAQPage JSON-LD はこの専用ページのみ出力 */}
      <Faq items={ITEMS} heading="よくある質問" withJsonLd />
      <div className="mx-auto max-w-3xl px-4 pb-8">
        {/* 署名（登録番号＝開業時確定まで非出力） */}
        <aside className="mt-2 flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
          <img
            src="/staff/uramatsu-square.webp"
            alt="四葉社会保険労務士事務所 代表 浦松丈二"
            width={48}
            height={48}
            className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
          />
          <p className="text-xs leading-relaxed text-text-muted">
            <strong>この記事の著者</strong> 浦松 丈二｜四葉社会保険労務士事務所 代表 社会保険労務士
            <Placeholder reason="開業時確定＝社労士登録番号" />
            ・行政書士（登録番号 第25087022号）・宅地建物取引士。元毎日新聞中国総局長（記者歴34年）。
          </p>
        </aside>
        <CtaBand businessKey="labor" />
      </div>
    </>
  );
}
