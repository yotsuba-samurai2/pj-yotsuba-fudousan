import Image from "next/image";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { Building2, TrendingUp, KeyRound, ArrowRight, MessageCircle } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { SHARED_ORG_INFO } from "@/lib/seo";

/**
 * /souzoku 本文（相続不動産ピラー「文京区で不動産を相続したら」）
 *
 * 実装メモ:
 * - 静的実装（useTranslation()・Firestore呼び出しなし）。文字列は直書き。
 *   4言語翻訳は後続タスク（翻訳待ち文字列は委任報告に列挙済み）。
 * - FAQは疑問文H2＋<details>アコーディオン（JS不要・SSGでも全文がDOMに載る）。
 *   faqItems は FAQJsonLd と表示の両方で使う単一ソース。
 * - 他士業をサイト前面で宣伝しない: 相続手続き・登記・税務は「提携する専門家
 *   （行政書士・司法書士・税理士等）」と一般化し、特定の事務所名は出さない。
 * - 具体的な法的判断・税額計算は書かない（最終判断は有資格者）。
 *   法令は条文番号＋項＋号・施行日を併記。最終改正日など裏取り不能は「未検証」。
 */

const exitCards = [
  {
    id: "management",
    icon: Building2,
    title: "管理",
    description:
      "すぐに売る・貸すと決められないときの選択肢が「維持・管理」です。空き家を放置すると建物の傷みが進み、管理が不十分な場合は空家法にもとづく指導等の対象になる可能性もあります。文京区の地元会社として、資産価値を保ちながら次の一手を考えるための管理の方法をご提案します。",
  },
  {
    id: "utilization",
    icon: TrendingUp,
    title: "活用",
    description:
      "駅や学校に近い文京区の不動産は、賃貸化などの活用で収益源に変わる可能性があります。リフォームの要否や想定賃料、かかる費用と手間を含めて「貸した場合」の収支を試算し、売却した場合と数字で比べながら、ご家族に合う活かし方を一緒に検討します。",
  },
  {
    id: "sale",
    icon: KeyRound,
    title: "売却",
    description:
      "住む予定がない、維持費や税負担が重い、相続人の間で分けたい——そんなときの現実的な出口が売却です。文京区の相場をふまえた査定から、売却に伴う手続きの段取りまで、提携する専門家（行政書士・司法書士・税理士等）と連携してワンストップで進めます。相続した一棟アパート・ビルなど収益不動産の売却もご相談ください。",
  },
];

// 疑問文H2のFAQ。FAQJsonLd と本文表示の単一ソース。
const faqItems: { question: string; answer: string }[] = [
  {
    question: "文京区で不動産を相続したら、まず何から始めればいいですか？",
    answer:
      "一般的な流れは、①遺言書の有無の確認、②相続人と相続財産の確定、③遺産分割協議、④相続登記、⑤管理・活用・売却の方針決定、という順です。相続の承認・放棄には3か月の熟慮期間（民法第915条第1項）があるため、早めに全体像を整理するのが安心です。手続きが必要な場面は、提携する専門家と連携してご案内します。",
  },
  {
    question: "相続登記に期限はありますか？",
    answer:
      "あります。2024年4月1日から相続登記の申請が義務化され、不動産の取得を知った日から原則3年以内の申請が必要です（不動産登記法第76条の2第1項）。それより前に相続した未登記の不動産も対象で、猶予期限は2027年3月31日です。正当な理由なく申請を怠ると10万円以下の過料の対象になり得ます（同法第164条第1項）。",
  },
  {
    question: "相続した実家を空き家のままにしておくと、どうなりますか？",
    answer:
      "建物の傷みや老朽化が進むほか、固定資産税などの維持費は毎年かかり続けます。管理が不十分な空き家は、空家等対策特別措置法にもとづき市区町村の指導・勧告等の対象となる場合があり、勧告を受けると固定資産税の住宅用地特例が解除されることがあります。「まだ決められない」場合も、管理の体制だけは早めに整えることをおすすめします。",
  },
  {
    question: "売却と賃貸（活用）、どちらが得ですか？",
    answer:
      "一概には言えません。立地・築年数・修繕の要否、まとまった資金の必要性、税負担、ご家族の思いによって最適解は変わります。四葉不動産では「売った場合」と「貸した場合」の双方を数字で比較したうえで、ご家族が納得できる出口を一緒に選びます。",
  },
  {
    question: "相続した不動産の価値はどうやって調べますか？",
    answer:
      "目安になるのは、国税庁が公表する路線価（相続税評価の基礎）や公示地価です。ただし実際に売れる価格（実勢価格）はこれらと異なるのが通常です。文京区内の取引事情をふまえた個別の査定は当社で承りますので、お問い合わせからご依頼ください。",
  },
  {
    question: "共有名義で相続した不動産でも売却できますか？",
    answer:
      "共有者全員の同意があれば売却できます。自分の持分だけを売ることも可能ですが、買い手が限られ価格面でも不利になりやすいのが実情です。遺産分割協議（民法第907条第1項）の整理が必要な場合は、提携する専門家と連携して進め方をご案内します。",
  },
  {
    question: "相続税の申告や登記の手続きも、まとめて相談できますか？",
    answer:
      "はい、窓口としてまとめてご相談いただけます。四葉不動産が担うのは不動産の管理・活用・売却です。登記・税務・相続手続きは、それぞれ提携する専門家（行政書士・司法書士・税理士等）と連携して進めます。なお、相続税の申告が必要な場合の期限は、相続の開始を知った日の翌日から10か月以内です（相続税法第27条第1項）。",
  },
  {
    question: "遠方に住んでいて、文京区の実家を見に行けません。対応できますか？",
    answer:
      "対応できます。文京区小日向に事務所を構える地元会社として、現地の状況確認とご報告、管理・売却の段取りまで、お越しいただかなくても進められる形でご相談に応じます。お電話・メール・オンラインでのやりとりも可能です。",
  },
  {
    question: "相談に費用はかかりますか？営業時間はいつですか？",
    answer:
      "ご相談は無料です。事務所は文京区小日向４丁目２−５ 小日向安田ビル２０３（茗荷谷駅から徒歩約5分）、営業時間は10:00〜18:00（火・水休）です。売却や管理を正式にご依頼いただく場合の費用は、お手続きの前に必ず明示します。",
  },
];

const internalLinks = [
  {
    href: "/services",
    label: "サービス一覧",
    description:
      "相続した不動産の管理・活用・売却など、四葉不動産がお手伝いできることの全体像はこちら。",
  },
  {
    href: "/about",
    label: "会社概要",
    description:
      "文京区小日向の地元会社としての会社情報と、代表・浦松 丈二のプロフィールをご紹介しています。",
  },
  {
    href: "/column",
    label: "コラム",
    description:
      "相続登記・空き家・売却のタイミングなど、相続不動産にまつわる疑問を記事で解説しています。",
  },
  {
    href: "/contact",
    label: "お問い合わせ",
    description:
      "相続した不動産のご相談・査定のご依頼はこちらから。所在地・営業時間もご案内しています。",
  },
];

export default function SouzokuPageContent() {
  return (
    <div>
      {/* ─── JSON-LD ─── */}
      <ArticleJsonLd
        businessKey="realestate"
        title="文京区で不動産を相続したら——管理・活用・売却、3つの出口の選び方"
        description="文京区で不動産を相続したときの進め方を一つに整理した完全ガイド。相続登記の義務化（2024年4月1日施行・原則3年以内、過去の相続分は2027年3月31日まで）への備えから、管理・活用・売却という3つの出口の選び方まで、文京区小日向の四葉不動産が解説します。"
        path="/souzoku"
        datePublished="2026-07-07"
        dateModified="2026-07-07"
      />
      <FAQJsonLd items={faqItems} />
      <BreadcrumbJsonLd
        businessKey="realestate"
        items={[
          { name: "ホーム", href: "/" },
          { name: "相続不動産", href: "/souzoku" },
        ]}
      />

      {/* ─── Hero／結論ブロック ─── */}
      <section className="relative grid min-h-[40vh] place-content-center overflow-hidden border-b border-border pt-24 pb-16 sm:pt-32 sm:pb-32 md:pt-40 md:pb-40">
        <div
          className="pointer-events-none absolute inset-0 bg-green-gradient"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">
            相続不動産
          </p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl">
            文京区で不動産を相続したら。
            <span className="mt-3 block text-xl sm:text-2xl md:text-3xl">
              出口は「管理・活用・売却」の3つです
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-muted sm:text-base">
            文京区で不動産を相続したら、まず相続登記の期限を確認——2024年4月から申請が義務化され、原則3年以内です。そのうえで管理・活用・売却の3つから出口を選ぶ。この順番で進めれば迷いません。四葉不動産が最初の一歩から伴走します。
          </p>
        </div>
      </section>

      {/* ─── H2疑問文FAQ（一問一答） ─── */}
      <section className="py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">
              FAQ
            </p>
            {/* AIO設計上、各質問文をH2にするため、セクション見出しは装飾テキスト（p）に留める */}
            <p className="mt-3 text-2xl font-bold sm:text-3xl">
              文京区の相続不動産、よくある疑問
            </p>
          </div>
          <div className="mt-10 space-y-4 sm:mt-14">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="group rounded-lg border border-border bg-surface p-4 sm:p-6"
              >
                <summary className="cursor-pointer list-none">
                  <h2 className="inline text-base font-bold leading-relaxed sm:text-lg">
                    {item.question}
                  </h2>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3つの出口カード（管理・活用・売却） ─── */}
      <section className="bg-surface-dim py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">
              3つの選択肢
            </p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              相続した不動産の3つの出口——管理・活用・売却
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-text-muted">
              どれか一つに今すぐ決める必要はありません。3つを並べて比較し、ご家族の事情に合う出口を選ぶところからお手伝いします。
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-3 sm:gap-6">
            {exitCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  id={card.id}
                  className="gradient-border rounded-xl bg-surface p-5 sm:p-8"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{card.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-muted">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 内部リンク束 ─── */}
      <section className="py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-xl font-bold sm:text-2xl">
            あわせてご覧いただきたいページ
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {internalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="gradient-border block rounded-xl bg-surface p-5 transition-colors hover:text-primary"
              >
                <span className="inline-flex items-center gap-1 text-sm font-bold">
                  {link.label}
                  <ArrowRight size={14} />
                </span>
                <span className="mt-2 block text-xs leading-relaxed text-text-muted">
                  {link.description}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 根拠欄 ─── */}
      <section className="border-t border-border py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold">根拠・出典</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text-muted">
            <li>
              不動産登記法（平成16年法律第123号）第76条の2第1項——相続による所有権取得を知った日から3年以内の相続登記申請義務。令和3年法律第24号による改正で新設、2024年（令和6年）4月1日施行。
            </li>
            <li>
              不動産登記法第164条第1項——正当な理由なく申請を怠った場合、10万円以下の過料。
            </li>
            <li>
              施行日（2024年4月1日）より前に相続した未登記不動産の申請期限は2027年（令和9年）3月31日まで（改正法附則の経過措置。出典：法務省「相続登記の申請義務化について」）。
            </li>
            <li>
              民法第915条第1項——相続の承認・放棄の熟慮期間（自己のために相続の開始があったことを知った時から3か月以内）。
            </li>
            <li>民法第907条第1項——共同相続人による遺産分割協議。</li>
            <li>
              相続税法第27条第1項——相続税の申告期限（相続の開始があったことを知った日の翌日から10か月以内）。
            </li>
            <li>
              空家等対策の推進に関する特別措置法（平成26年法律第127号）——「管理不全空家等」に対する指導・勧告等は令和5年法律第50号による改正で導入、2023年（令和5年）12月13日施行（出典：国土交通省）。
            </li>
            <li>国税庁「路線価図・評価倍率表」（相続税評価の基礎資料）。</li>
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-text-muted">
            ※各法令の最終改正日は本ページ作成時点で個別に裏取りしていません（未検証）。本ページは一般的な情報の提供を目的とするもので、個別の法的判断・税額計算を行うものではありません。最終的な判断は有資格者（提携する専門家）にご確認ください。
          </p>
        </div>
      </section>

      {/* ─── 代表者カード ─── */}
      <section className="bg-surface-dim py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="gradient-border overflow-hidden rounded-2xl bg-surface p-5 sm:p-8 md:p-12">
            <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
              <div className="h-40 w-32 shrink-0 overflow-hidden rounded-2xl">
                <Image
                  src="/uramatsu.png"
                  alt={SHARED_ORG_INFO.representative}
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm leading-[1.9] text-text-muted">
                  元毎日新聞記者として国内外の現場を歩き、中国総局長を務めたのち、地元・文京区小日向で四葉不動産を営んでいます。相続した不動産のご相談は、不動産・手続き・ご家族の事情が絡み合った「整理」から始まります。取材で培った、聞いて・整理して・分かりやすく伝える力と、宅地建物取引士・行政書士としての知識を土台に、最初の一歩から出口まで伴走します。手続きが必要な場面では、提携する専門家と連携してワンストップでお手伝いします。
                </p>
                <div className="mt-6">
                  <p className="text-base font-bold">
                    {SHARED_ORG_INFO.representative}
                  </p>
                  <p className="mt-1 text-xs text-text-muted">代表</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="border-t border-border bg-green-gradient py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">
            まずはお気軽にご相談ください
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-muted">
            相続した不動産のこと、「これ、どうしたらいい？」の一言からで構いません。文京区小日向の事務所（茗荷谷駅から徒歩約5分・10:00〜18:00・火・水休）でも、オンラインでもご相談いただけます。
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://line.me/ti/p/EF5782JXqJ"
              target="_blank"
              rel="noopener noreferrer"
              className="gradient-line inline-flex items-center gap-2 rounded-md px-10 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:brightness-110"
            >
              <MessageCircle size={16} />
              代表のLINEで相談する
            </a>
            <Link
              href="/contact"
              className="cta-gradient-outline inline-flex items-center gap-2 rounded-md px-10 py-4 text-sm font-semibold transition-all duration-200 hover:brightness-110"
            >
              お問い合わせ
              <ArrowRight size={16} />
            </Link>
          </div>
          <p className="mx-auto mt-5 max-w-xl text-xs leading-relaxed text-text-muted">
            LINEは代表・浦松 丈二の個人アカウントに直接つながります。「この物件、どう？」の一言からお気軽にどうぞ。
          </p>
        </div>
      </section>
    </div>
  );
}
