// ★参考ページ（flagship・型A）＝ /legal/services/shogai-fukushi
// 正本＝原稿_行政書士サイト_v1.0.md #1（本文はここから転記）／見た目＝wireframe_legal_shogai-fukushi.html。
// これを"型Aの雛形"として visa / inheritance / company / subsidy へ横展開する。
// 横展開時に差し替えるのは：①ヒーロー画像 /hero/legal-<slug>-16x9.webp ②meta ③本文(原稿#2-5) ④QA配列 ⑤クロスリンク(getCrossLinksがpathnameで自動) ⑥JSON-LDのname/@id。
// 本番配置＝src/app/(legal)/legal/services/shogai-fukushi/page.tsx。import 先はA統合後のパス。
// 依存：A-1トークン（bg-primary等）・A-2（(legal)=濃紺）・A-3部品（Breadcrumb/CtaBand/CrossLinkBanner/Placeholder）・cross-links.ts。
// LinkaFab / MobileStickyBar / RelatedBusinessFooter は TenantLayoutShell（layout）側。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { CtaBand } from "@/components/shared/CtaBand";
import { CrossLinkBanner } from "@/components/shared/CrossLinkBanner";
import { Placeholder } from "@/components/shared/Placeholder";
import { getCrossLinks } from "@/lib/cross-links";
import { SR_LAUNCHED } from "@/lib/shared/office";

const PATH = "/legal/services/shogai-fukushi";
const PAGE_URL = "https://luck428.com" + PATH;

// 本番は generateMetadata＋翻訳(t)へ。ここは原稿#1のmetaを直書き（プレースホルダ）。
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "legal",
    title: "障害福祉サービスの指定申請｜四葉行政書士事務所",
    description:
      "障害福祉サービス（グループホーム・放課後等デイサービス等）の事業者指定申請を、文京区の四葉行政書士事務所が支援します。法人設立から指定申請、加算届、運営支援までワンストップ。元新聞記者の行政書士が複雑な要件を整理します。",
    path: "/legal/services/shogai-fukushi",
    locale,
    absoluteTitle: true,
  });
}

// 疑問文H2（表示見出しの元データ。FAQPageは出力しない＝/legal/faq 専用）
const QA: { q: string; a: string }[] = [
  {
    q: "障害福祉サービスの指定申請とは何ですか？",
    a: "障害福祉サービス事業（グループホーム、放課後等デイサービス、生活介護など）を運営するには、都道府県・市区町村から事業者指定を受ける必要があります。主な条件は、法人格・人員基準・設備/運営基準の3つです。四葉行政書士事務所は要件を整理し、申請書類の作成・提出を代行します。",
  },
  {
    q: "四葉行政書士事務所は、どこまで対応できますか？",
    a: "法人設立、指定申請、加算届・変更届、指定後の運営支援まで一体で対応します。労務（就業規則・賃金等）は社会保険労務士、登記は司法書士、税務は税理士の領域です。物件は関連事業の四葉不動産が別事業体として扱います。",
  },
  {
    q: "グループホーム開設の相談は、どのタイミングがいいですか？",
    a: "物件を決める前——構想の段階が最適です。指定は物件の立地・構造・面積・消防設備が基準を満たす必要があり、契約後に基準不適合が判明する例があります。四葉不動産と連携し、指定基準を見据えた物件選びの段階からご相談を受けられます。",
  },
];

function jsonLd() {
  // BreadcrumbList は <Breadcrumb> 部品が出力（二重を避ける）。FAQPage は /legal/faq 専用
  // （疑問文H2は表示のみ＝本文とFAQPage回答文の不一致を避ける）。QA は表示見出しに使用。
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Service", "GovernmentService"],
        "@id": PAGE_URL + "#service",
        name: "障害福祉サービス事業者の指定申請 支援",
        serviceType: "障害福祉サービス指定申請の代行・支援（法人設立〜加算届〜運営支援）",
        areaServed: "東京都およびその周辺",
        provider: { "@id": "https://luck428.com/legal/#organization" },
        author: { "@id": "https://luck428.com/#uramatsu-joji" },
        url: PAGE_URL,
      },
    ],
  };
}

export default function Page() {
  const crossLinks = getCrossLinks(PATH, SR_LAUNCHED); // C2→/toushi/group-home（C9→laborは開業まで非表示）

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }} />

      <Breadcrumb
        items={[
          { name: "ホーム", href: "/legal" },
          { name: "業務案内", href: "/legal/services" },
          { name: "障害福祉サービスの指定申請" },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 pb-16">
        {/* 0. ヒーロービジュアル（各業務ページで slug を差し替え：/hero/legal-<slug>-16x9.webp）
             本番は next/image（priority＋sizes）に。SP は -1x1 も利用可。 */}
        <img
          src="/hero/legal-shogai-fukushi-16x9.webp"
          alt="障害福祉サービスの指定申請のイメージ（グループホームと申請書類）"
          width={1600}
          height={900}
          className="mt-3 w-full rounded-2xl object-cover"
          fetchPriority="high"
        />

        {/* 1. 結論・回答ファースト＋代表カード小 */}
        <header className="pt-4">
          <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
            障害福祉サービス事業者の指定申請
          </h1>
          <p className="mt-4 leading-relaxed text-text">
            障害福祉サービス事業者の指定申請は、<strong>行政書士に依頼できます</strong>。四葉行政書士事務所（東京都文京区小日向）は、グループホーム（共同生活援助）・放課後等デイサービス・児童発達支援などの
            <strong>指定申請を中心に、前提となる法人設立から、指定後の加算届・変更届・運営支援までを一体</strong>
            で扱います。指定の要件は自治体ごとに細部が異なり、人員基準・設備基準・運営規程の整合が問われます。四葉行政書士事務所は、この「要件の整理」から書類作成・申請までを一貫してお手伝いします。
          </p>
        </header>

        {/* 2. 疑問文H2 一問一答（表示のみ） */}
        <section className="mt-8 space-y-8">
          <div>
            <h2 className="font-serif text-xl font-semibold text-ink">{QA[0].q}</h2>
            <p className="mt-3 leading-relaxed text-text">
              障害福祉サービス事業（グループホーム、放課後等デイサービス、生活介護など）を運営するには、
              <strong>都道府県・市区町村から「事業者指定」を受ける</strong>必要があります。指定を受けるための主な条件は、次の3つに集約されます。
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-primary-tint text-left">
                    <th className="border border-border px-3 py-2">条件</th>
                    <th className="border border-border px-3 py-2">中身</th>
                    <th className="border border-border px-3 py-2">つまずきやすい点</th>
                  </tr>
                </thead>
                <tbody className="text-text-muted">
                  <tr>
                    <td className="border border-border px-3 py-2">法人格</td>
                    <td className="border border-border px-3 py-2">株式会社・合同会社・NPO法人等であること</td>
                    <td className="border border-border px-3 py-2">定款の事業目的に福祉事業の記載が要る</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-3 py-2">人員基準</td>
                    <td className="border border-border px-3 py-2">管理者・サービス管理責任者等の配置</td>
                    <td className="border border-border px-3 py-2">資格・経験年数の要件確認</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-3 py-2">設備・運営基準</td>
                    <td className="border border-border px-3 py-2">物件の構造・面積・消防等＋運営規程の整備</td>
                    <td className="border border-border px-3 py-2">物件契約後に基準不適合が判明する例がある</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              根拠は障害者総合支援法・児童福祉法にもとづく指定基準（自治体の条例・要綱を含む）です。書類の不備や基準解釈の誤りは、指定の遅れや申請のやり直しに直結します。四葉行政書士事務所は、要件を事前に整理し、申請書類の作成・提出を代行します。
            </p>
            <p className="mt-2 text-sm text-text-muted">
              対象サービスの例：共同生活援助（グループホーム）、放課後等デイサービス、児童発達支援、生活介護 ほか
              <Placeholder reason="浦松＝実際に対応するサービス種別の確定" />
            </p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-ink">{QA[1].q}</h2>
            <p className="mt-3 leading-relaxed text-text">四葉行政書士事務所は、指定申請の前後まで含めて、次の範囲を一体で対応します。</p>
            <ul className="mt-3 space-y-2 text-sm text-text">
              <li>
                <strong>法人設立</strong>：指定の前提となる法人の設立書類作成（株式会社・合同会社・NPO法人等）
                <Placeholder reason="浦松＝対応する法人形態" />
                　→ 詳細：<Link href="/legal/services/company" className="text-primary underline">会社設立・各種許認可の業務内容</Link>
              </li>
              <li>
                <strong>指定申請</strong>：人員・設備・運営基準の事前確認、申請書類一式の作成・提出、自治体との協議対応
              </li>
              <li>
                <strong>加算届・変更届</strong>：体制加算等の届出、事業所の変更手続き
                <Placeholder reason="浦松＝加算届の対応範囲。処遇改善加算の扱いは石井弁護士確認（下記注記）" />
              </li>
              <li>
                <strong>運営支援</strong>：指定後の書類整備、実地指導（監査）対応の準備（助言・立会は非独占。
                <strong>労務＝就業規則・賃金等は含みません＝社会保険労務士へ</strong>）
                <Placeholder reason="浦松＝運営支援の具体範囲" />
              </li>
              <li>
                <strong>物件</strong>：グループホーム・事業所に使える物件は、関連事業の四葉不動産株式会社（宅地建物取引業）が扱います →{" "}
                <Link href="/toushi/group-home" className="text-primary underline">グループホームに使える物件探し</Link>
                <br />
                <span className="text-xs text-text-muted">
                  ※四葉不動産株式会社・四葉行政書士事務所は、それぞれ別の事業体として独立してご依頼をお受けします（紹介料等の授受はありません）。
                </span>
              </li>
            </ul>

            {/* 業際の注記（区分表準拠・断定回避） */}
            <blockquote className="mt-4 border-l-4 border-primary bg-primary-tint p-3 text-xs leading-relaxed text-text">
              <strong>業際の注記</strong>：登記申請は司法書士、税務申告は税理士、労務・社会保険手続きは社会保険労務士の領域です。
              <strong>
                処遇改善加算は工程で分かれます——加算体制届・計画書・実績報告など指定権者（自治体）への提出書類の作成＝行政書士／就業規則・賃金規程・キャリアパス要件など賃金制度の設計＝社会保険労務士
              </strong>
              。四葉では両事務所が<strong>分離受任</strong>で担当します（社労士は2026年9月開業後）。四葉行政書士事務所は行政書士業務の範囲で対応し、それ以外は連携する専門家におつなぎします。
              <Placeholder reason="石井弁護士＝業際表現の最終確認（両サイトで断定しない）" />
            </blockquote>
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-ink">{QA[2].q}</h2>
            <p className="mt-3 leading-relaxed text-text">
              <strong>物件を決める前——構想の段階が最適</strong>
              です。障害福祉サービスの指定は、物件の立地・構造・面積・消防設備が基準を満たしている必要があり、賃貸借契約の後に「この物件では指定が取れない」と判明する事例が実際にあります。四葉行政書士事務所は、関連事業の四葉不動産株式会社と連携し、
              <strong>指定基準を見据えた物件選びの段階から</strong>ご相談を受けられます（不動産取引は四葉不動産が別事業体として受任します）。
            </p>
            <p className="mt-3 text-sm text-text-muted">
              順序はこうです：<strong>①構想の相談（当事務所）→ ②物件探し（四葉不動産）→ ③指定基準の適合確認（当事務所）→ ④法人設立・指定申請（当事務所）→ ⑤開設</strong>。
            </p>
          </div>

          {/* 費用 */}
          <div>
            <h2 className="font-serif text-xl font-semibold text-ink">費用・料金はいくらですか？</h2>
            <p className="mt-3 leading-relaxed text-text">
              障害福祉サービス指定申請の報酬は、サービス種別・法人設立の有無・自治体によって異なります。業務ごとの金額は報酬額表に掲載し、個別の事情によるお見積りにも対応します。
            </p>
            <p className="mt-2 text-sm">
              →{" "}
              <Link href="/legal/ryokin" className="text-primary underline">障害福祉サービス指定申請の報酬額（報酬額表）</Link>
              <Placeholder reason="Notion＝料金体系・金額（報酬額表_HP公開用が正）" />
            </p>
          </div>

          {/* 受任の流れ */}
          <div>
            <h2 className="font-serif text-xl font-semibold text-ink">受任の流れを教えてください</h2>
            <p className="mt-3 leading-relaxed text-text">
              ご相談から指定取得までは、<strong>①ご相談 → ②お見積り・受任 → ③要件整理・書類作成 → ④申請・自治体対応 → ⑤指定取得・運営開始のサポート</strong>、の順で進みます。
            </p>
            <p className="mt-2 text-sm">
              →{" "}
              <Link href="/legal/nagare" className="text-primary underline">ご相談から完了までの受任の流れ</Link>
              <Placeholder reason="浦松＝各ステップの実運用・標準期間" />
            </p>
          </div>

          {/* メリット */}
          <div>
            <h2 className="font-serif text-xl font-semibold text-ink">この分野を四葉行政書士事務所に頼むメリットは何ですか？</h2>
            <p className="mt-3 leading-relaxed text-text">
              代表の浦松 丈二は、元毎日新聞中国総局長として<strong>34年間「複雑な事実を整理して伝える」仕事</strong>
              をしてきた行政書士です。障害福祉の指定申請は要件が多く、自治体ごとに解釈が分かれます。論点を整理し、根拠を押さえた申請書に落とす——記者の技術がそのまま活きる分野です。加えて、関連事業の四葉不動産株式会社との連携により、
              <strong>物件確保から指定申請までを一つの窓口で</strong>相談できます。この組み合わせを持つ事務所は多くありません。
              <Placeholder reason="浦松＝公開可能な実績・件数（確定分のみ。無ければ数値は書かない）" />
            </p>
          </div>
        </section>

        {/* 内部リンク束 */}
        <nav aria-label="関連リンク" className="mt-8 rounded-xl border border-border bg-surface p-4 text-sm">
          <div className="font-medium text-ink">このページの関連リンク</div>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-primary">
            <li><Link href="/legal/ryokin" className="underline">報酬額表</Link></li>
            <li><Link href="/legal/nagare" className="underline">受任の流れ</Link></li>
            <li><Link href="/legal/services/company" className="underline">会社設立・各種許認可</Link></li>
            <li><Link href="/legal/faq" className="underline">よくある質問</Link></li>
          </ul>
        </nav>

        {/* クロスリンク（C2→/toushi/group-home・独立受任注記） */}
        {crossLinks.map((c) => (
          <CrossLinkBanner key={c.id} link={c} />
        ))}

        {/* 署名（E-E-A-T・Person @id は全事業共通 https://luck428.com/#uramatsu-joji／本体は不動産 /about） */}
        <aside className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
          <img src="/staff/uramatsu-square.webp" alt="四葉行政書士事務所 代表 浦松丈二" width={48} height={48} className="h-12 w-12 flex-shrink-0 rounded-full object-cover" />
          <p className="text-xs leading-relaxed text-text-muted">
            <strong>この記事の著者</strong> 浦松 丈二｜四葉行政書士事務所 代表行政書士（登録番号 第25087022号）・宅地建物取引士。元毎日新聞中国総局長（記者歴34年）。社会保険労務士試験合格（2026年9月開業予定）。
          </p>
        </aside>
      </article>

      {/* CTA帯（LINE主CTA） */}
      <div className="mx-auto max-w-3xl px-4">
        <CtaBand businessKey="legal" />
      </div>
    </>
  );
}
