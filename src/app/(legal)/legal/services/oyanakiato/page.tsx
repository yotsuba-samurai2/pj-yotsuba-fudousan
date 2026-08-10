// /legal/services/oyanakiato（親なき後の備え）＝定点#23の空白を埋める相談先型ページ（2026-07-25・日本語版のみ・監修前ドラフト）
// 方式＝LegalServicePage（手本=/legal/services/inheritance）。ja先行公開：availableLocales:["ja"]・sitemap側も locales:["ja"]。
// ヒーローは専用画像が未制作のため legal-shogai-fukushi-16x9.webp を暫定共用（heroSrc・TODO＝専用画像の制作）。
//
// 【編集方針・浦松指示 2026-07-25】
//   ・公的制度と当事者団体を「先に」案内し、四葉の役割は最後に小さく置く。
//   ・不安を煽らない／金額で威さない。「今すぐ全部やらないと手遅れ」という趣旨を書かない。
//   ・表記は「親なき後」に統一（「親亡き後」は使わない＝定点#23・署名エッセイ・URLと一致）。
//
// 【コンプライアンス】shigyo-compliance-gate 準拠
//   ・具体的な法的判断を出力しない（「判断は面談のうえ資格者が行う」を明記）。
//   ・独占業務の境界：登記＝司法書士／税務＝税理士／家裁への申立て代理・法的紛争＝弁護士。
//   ・行政書士の独占業務は書類の「作成」（行政書士法1条の3・19条1項）。「作成・提出は独占業務」とまとめて書かない。
//     ※令和8年（2026年）1月1日施行の改正で1条の2（職責）が新設され条番号が繰り下がった。旧1条の2＝現1条の3。
//   ・分離受任・紹介料なしを明記。
//   ・禁止語「ワンストップ」は全文で使用しない。
//   ・制度の数値は一次情報で裏取り済み（しょうがい共済＝厚労省/WAM、特定贈与信託＝信託協会・相続税法21条の4）。
//     条文の施行日・最終改正は未取得のため条番号のみ記載し、断定的な適用可否は書かない。
//   ・自治体差の大きい窓口名（基幹相談支援センター等）は名称を断定せず「自治体により異なる」と明示。
//
// FAQPage JSON-LD は出力しない（legal側の規約＝FAQPageは /legal/faq 専用。疑問文H2は表示のみ）。
import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { LegalServicePage, H2 } from "@/components/shared/LegalServicePage";

// 冒頭の回答ブロック（H1直下・AIが最初に拾う位置）
const JA_LEAD =
  "親なき後の備えは、まずお住まいの市区町村の障害福祉の相談窓口と、地域の育成会（親の会）に相談するところから始まります。そのうえで、暮らしの場、お金の管理、生活資金、そして実家をどうするかを順番に決めていきます。";

// §2 公的な窓口・当事者団体（四葉より先に案内する）
const JA_MADOGUCHI: { name: string; body: string; where: string }[] = [
  {
    name: "市区町村の障害福祉の相談窓口",
    body: "障害福祉全般の総合相談。暮らしの場、サービスの利用、地域にどんな資源があるか。",
    where: "市区町村の障害福祉担当課、相談支援事業所（基幹相談支援センター等）。名称・設置状況は自治体により異なります。",
  },
  {
    name: "地域生活支援拠点等",
    body: "緊急時の受け入れ、体験の機会・場、専門的人材の確保など、親なき後を見据えた地域の仕組み。",
    where: "市区町村（障害者総合支援法に基づく整備）。",
  },
  {
    name: "成年後見の中核機関・権利擁護センター",
    body: "成年後見制度の入口相談、申立ての進め方。",
    where: "市区町村、社会福祉協議会。",
  },
  {
    name: "社会福祉協議会",
    body: "日常生活自立支援事業（福祉サービス利用援助事業）。日常的な金銭管理、書類等の預かり。",
    where: "市区町村社会福祉協議会。",
  },
  {
    name: "育成会（親の会）",
    body: "同じ立場のご家族の経験。制度を調べても分からない「実際に使ってみてどうだったか」が聞けます。",
    where: "全国手をつなぐ育成会連合会、都道府県・市区町村の育成会。",
  },
];

// §3 お金と財産の備え（制度の一覧。適用可否は断定しない）
const JA_SEIDO: { name: string; body: string; source: string }[] = [
  {
    name: "成年後見制度（法定後見・任意後見）",
    body: "判断能力が十分でない方に代わって、家庭裁判所が選んだ人が財産管理や契約を行います。後見・保佐・補助の3類型があります。",
    source: "民法／家庭裁判所",
  },
  {
    name: "日常生活自立支援事業",
    body: "福祉サービスの利用援助、日常的な金銭管理、書類等の預かり。成年後見より軽い支援です。",
    source: "社会福祉法に基づく福祉サービス利用援助事業／市区町村社会福祉協議会",
  },
  {
    name: "障害者扶養共済制度（しょうがい共済）",
    body: "保護者が加入し、保護者が亡くなるか重度障害となった場合に、1口あたり月額2万円の年金が障害のある方へ終身支給されます（2口まで加入できます）。",
    source: "都道府県・指定都市の条例／独立行政法人福祉医療機構（WAM）",
  },
  {
    name: "特定贈与信託",
    body: "ご親族等が信託銀行等に財産を信託し、障害のある方の生活を支える仕組みです。特別障害者の方は6,000万円、特別障害者以外の特定障害者の方は3,000万円を限度に贈与税が非課税となります。",
    source: "相続税法第21条の4／信託銀行等",
  },
  {
    name: "民事信託（家族信託）",
    body: "ご家族の間の契約で、財産の管理と承継を設計します。",
    source: "信託法",
  },
  {
    name: "遺言",
    body: "誰に何を遺すかを定めます。付言事項でお気持ちを伝えることもできます。",
    source: "民法",
  },
];

// §4 実家の4択（不動産×福祉の交差点＝四葉の固有領域）
const JA_JIKKA: { plan: string; fit: string; caution: string }[] = [
  {
    plan: "① ご本人が住み続ける",
    fit: "住み慣れた家で暮らせる。ヘルパーや見守りなど、地域の支援体制がある。",
    caution: "一人暮らしを支える体制が要ります。修繕・固定資産税・各種契約を誰が担うかを決めておく必要があります。",
  },
  {
    plan: "② 賃貸に出して収益にする",
    fit: "ご本人が別の場所（グループホーム等）で暮らし、家賃を生活資金に充てたい。",
    caution: "管理の担い手が要ります。空室・修繕のリスク。収入があることで各種制度に影響が出る場合があります。",
  },
  {
    plan: "③ 売却して現金化する",
    fit: "管理の担い手がいない。現金のほうが管理・分割をしやすい。",
    caution: "一度手放すと戻せません。売却の時期・価格のほか、税の扱いは税理士にご確認いただきます。",
  },
  {
    plan: "④ グループホーム等に活用する",
    fit: "立地・間取りが適していて、運営を担う事業者がいる。",
    caution: "用途地域・建築基準・消防への適合が必要です。指定基準を満たせるかは契約前の確認が要点になります。",
  },
];

// §5 準備の順序
const JA_JUNJO: string[] = [
  "相談窓口・育成会に相談する（現状の整理。ここが最初です）",
  "暮らしの場を考える（ご本人の希望、体験利用、待機の状況）",
  "お金の管理の方法を決める（後見か、日常生活自立支援事業か、まだ不要か）",
  "生活資金を手当てする（扶養共済・信託・保険）",
  "実家の方針を決める（住み続ける／貸す／売る／活用する）",
  "遺言・信託で形にする",
];

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    businessKey: "legal",
    title: "親なき後の備え｜障害のある子と実家をどうするか | 四葉行政書士事務所",
    description:
      "親御さんが亡くなった後、障害のあるお子さんの暮らしと実家をどう備えるか。公的な相談窓口と制度を先に整理し、実家を住み続ける・貸す・売る・活用するの判断材料を、文京区の行政書士・宅地建物取引士がまとめました。",
    path: "/legal/services/oyanakiato",
    keywords: [
      "親なき後 備え",
      "親なき後 実家",
      "障害のある子 相続 相談",
      "成年後見 障害者 相談 東京",
      "障害者扶養共済制度",
    ],
    // 【2026-08-10 canonical是正】availableLocales:["ja"] のページはロケール接頭辞つきURLでも
    // 同じ日本語本文を返すため、canonical は常に ja を指す（手本＝/office・/kikoku・/reasons）。
    // リクエストロケールを渡すと /en/・/zh/・/zh-tw/ が自己canonicalの重複URLになる。
    locale: "ja",
    absoluteTitle: true,
    availableLocales: ["ja"],
  });
}

export default async function Page() {
  return (
    <LegalServicePage
      slug="oyanakiato"
      crumbLabel="親なき後の備え"
      // CTA（2026-07-27）：全ページ共通の定型文をやめ、本文で述べている
      // 「実家がいくらで貸せるのか、いくらで売れるのか」をそのまま第一歩として出す。
      // 公的窓口や他の専門家では代替できない申し出＝宅建業併設だから出せる。
      // 不動産の実務は併設の四葉不動産が別契約で承る（分離受任）ことを明示する。
      ctaIntent="oyanakiato"
      ctaHeading="実家をどうするかは、数字が出てから決められます。"
      ctaSubtext="住み続ける・貸す・売る・活用するの判断には、いま実家がいくらで貸せるのか、いくらで売れるのかという実勢の数字が要ります。まずはその調査からお引き受けします。書類の作成は四葉行政書士事務所、実勢の調査と売買・賃貸の実務は併設の四葉不動産株式会社（宅地建物取引業）が、それぞれ別契約で承ります。"
      serviceName="親なき後の備えに関する書類作成および相談"
      heroSrc="/hero/legal-shogai-fukushi-16x9.webp"
      heroAlt="穏やかな住宅街のイメージ"
      h1="親なき後の備え —— 障害のある子と、実家をどうするか"
      lead={<p>{JA_LEAD}</p>}
      internalLinks={[
        { href: "/legal/services/shogai-fukushi", label: "障害福祉サービスの許認可（事業者の方へ）" },
        { href: "/toushi/group-home", label: "グループホーム開設と物件（事業者の方へ）" },
        { href: "/souzoku", label: "文京区で不動産を相続したら｜完全ガイド" },
        { href: "/legal/column/naze-oyanakiato-ni-torikumu", label: "なぜ、親なき後に取り組むのか（代表の署名記事）" },
        { href: "/legal/ryokin", label: "料金のご案内" },
        { href: "/legal/contact", label: "お問い合わせ" },
      ]}
    >
      {/* §1 定義 */}
      <div>
        <H2>親なき後とは、何を指しますか？</H2>
        <p className="mt-3 leading-relaxed text-text">
          親御さんが亡くなったり、介護が必要になったりして、これまでのように障害のあるお子さんを支えられなくなった後の暮らしを指します。備えの中身は、大きく4つに分かれます。
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text">
          <li><strong className="text-ink">暮らしの場</strong>：どこで、誰と暮らすか</li>
          <li><strong className="text-ink">お金の管理</strong>：ご本人に代わって誰が財産を管理し、契約するか</li>
          <li><strong className="text-ink">生活資金</strong>：日々の暮らしを支えるお金をどう確保するか</li>
          <li><strong className="text-ink">実家（不動産）</strong>：住み続けるのか、貸すのか、売るのか、別の使い方をするのか</li>
        </ul>
        <p className="mt-3 leading-relaxed text-text">
          このうち最初の3つには、公的な制度と相談窓口があります。4つ目の実家については、制度ではなく個別の判断になります。
        </p>
      </div>

      {/* §2 公的窓口・当事者団体を「先に」案内する（浦松指示） */}
      <div>
        <H2>まず相談できる公的な窓口・当事者団体はどこですか？</H2>
        <p className="mt-3 leading-relaxed text-text">
          専門家に依頼する前に、まずこちらにご相談ください。いずれも公的機関または当事者団体で、相談は無料または低額です。
        </p>
        <ul className="mt-4 space-y-3">
          {JA_MADOGUCHI.map((m) => (
            <li key={m.name} className="rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text">
              <strong className="text-ink">{m.name}</strong>
              <span className="mt-1 block">{m.body}</span>
              <span className="mt-1 block text-text-muted">窓口：{m.where}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 leading-relaxed text-text">
          制度は調べれば分かりますが、「実際に使ってみてどうだったか」は、同じ立場のご家族の話にしかありません。専門家へのご相談は、その後で十分に間に合います。
        </p>
      </div>

      {/* §3 制度一覧 */}
      <div>
        <H2>お金と財産の備えには、どんな制度がありますか？</H2>
        <ul className="mt-4 space-y-3">
          {JA_SEIDO.map((s) => (
            <li key={s.name} className="rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text">
              <strong className="text-ink">{s.name}</strong>
              <span className="mt-1 block">{s.body}</span>
              <span className="mt-1 block text-text-muted">根拠・運営：{s.source}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 leading-relaxed text-text">
          これらは組み合わせて使うものです。どれか一つで完結するものではなく、お子さんの状況、ご家族の構成、財産の中身によって必要な組み合わせは変わります。<strong className="text-ink">どれを選ぶかの判断は、面談のうえ資格者が行います。</strong>
        </p>
      </div>

      {/* §4 実家の4択（不動産×福祉の交差点） */}
      <div>
        <H2>実家（不動産）は、どう考えればいいですか？</H2>
        <p className="mt-3 leading-relaxed text-text">
          ここが最も個別性の高いところです。正解は一つではありません。判断の材料として、4つの選択肢を並べます。
        </p>
        <ul className="mt-4 space-y-3">
          {JA_JIKKA.map((j) => (
            <li key={j.plan} className="rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text">
              <strong className="text-ink">{j.plan}</strong>
              <span className="mt-1 block">向いているとき：{j.fit}</span>
              <span className="mt-1 block text-text-muted">注意する点：{j.caution}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 leading-relaxed text-text">
          ④について、戸建てや空き家をグループホームに活用できるかは、契約前に指定基準（面積・設備・消防・用途）との適合を確認することが要点です。詳しくは
          <Link href="/toushi/group-home" className="text-primary underline">グループホーム開設と物件のご案内</Link>
          をご覧ください。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          ①〜③の判断には、いま実家がいくらで貸せるのか、いくらで売れるのかという実勢の数字が要ります。数字が分からないまま「残す／手放す」を決めると、後から選び直すことができません。実勢の調査と賃貸・売却・活用の実務は、併設の四葉不動産株式会社（宅地建物取引業）が別契約で承ります。
        </p>
      </div>

      {/* §5 順序 */}
      <div>
        <H2>いつから、どの順番で準備すればいいですか？</H2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-text">
          {JA_JUNJO.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className="mt-3 leading-relaxed text-text">
          今すぐ全部を決めなければならない、ということはありません。1から順に、親御さんがお元気なうちに少しずつ決めていけるものです。ただし、暮らしの場と生活資金は、決めてから実際に動き出すまでに時間がかかります。
        </p>
      </div>

      {/* §6 できること・できないこと（独占業務の境界・分離受任） */}
      <div>
        <H2>四葉行政書士事務所は、何ができますか？</H2>
        <p className="mt-3 leading-relaxed text-text">当事務所がお引き受けできるのは、次の範囲です。</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text">
          <li>親なき後に関わる選択肢と論点の整理（面談による）</li>
          <li>遺言書・民事信託契約書など、書類の作成</li>
          <li>成年後見の申立てに必要な書類の作成</li>
          <li>障害福祉サービスや制度についての情報提供と、窓口のご案内</li>
        </ul>
        <p className="mt-3 leading-relaxed text-text">
          官公署に提出する書類の作成は、行政書士の独占業務にあたります（行政書士法第1条の3・第19条第1項）。
        </p>
        <p className="mt-5 leading-relaxed text-text">一方、次の業務は他の資格者が担当します。</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text">
          <li><strong className="text-ink">不動産・法人の登記</strong>：司法書士</li>
          <li><strong className="text-ink">相続税・贈与税の申告と税務相談</strong>：税理士</li>
          <li><strong className="text-ink">家庭裁判所への申立ての代理、法的紛争の解決、法律判断</strong>：弁護士</li>
        </ul>
        <p className="mt-3 leading-relaxed text-text">
          必要な場合は提携する専門家をご紹介します。<strong className="text-ink">紹介料の授受は一切ありません。</strong>各専門家とお客様に直接ご契約いただく形をとっています。
        </p>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          このページは一般的な情報提供です。個別のご事情に応じた判断は、面談のうえ資格者が行います。ここに記した制度の適用可否も、ご本人の障害の種別・程度、お住まいの自治体、財産の状況によって変わります。
        </p>
        <p className="mt-5 leading-relaxed text-text">
          なぜ当事務所がこの分野に取り組んでいるのかは、代表の署名記事に書きました。
          <Link href="/legal/column/naze-oyanakiato-ni-torikumu" className="text-primary underline">なぜ、親なき後に取り組むのか</Link>
        </p>
      </div>

      {/* §7 根拠（一次情報） */}
      <div>
        <H2>このページの根拠</H2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text-muted">
          <li>障害者扶養共済制度（しょうがい共済）＝厚生労働省「障害者扶養共済制度 案内の手引き」、独立行政法人福祉医療機構（WAM）「しょうがい共済制度のごあんない」。1口あたり月額2万円・終身支給の記載を確認（2026年7月25日時点）</li>
          <li>特定贈与信託＝一般社団法人信託協会「特定贈与信託」。特別障害者6,000万円／特別障害者以外の特定障害者3,000万円を限度に贈与税非課税。根拠＝相続税法第21条の4</li>
          <li>成年後見制度＝厚生労働省「成年後見はやわかり」</li>
          <li>日常生活自立支援事業＝社会福祉法に基づく福祉サービス利用援助事業</li>
          <li>全国手をつなぐ育成会連合会</li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          制度の運用は自治体により異なります。最新の取り扱いは、お住まいの市区町村の窓口でご確認ください。
        </p>
      </div>
    </LegalServicePage>
  );
}
