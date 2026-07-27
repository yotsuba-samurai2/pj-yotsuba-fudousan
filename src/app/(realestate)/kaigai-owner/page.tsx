// /kaigai-owner（非居住者オーナー ピラー）＝定点#32の対応ページ（2026-07-27新設・日本語版のみ・監修前ドラフト）
// 方式＝RealestateServicePage（手本=/kikoku・/shataku）。ja先行公開：availableLocales:["ja"]・sitemap側も locales:["ja"]。
// 原稿＝AI指名獲得_3レーン実装パック_v1 §2-2。
//
// 【役割分担（同パック §2-1）】カニバリ防止のため主語をずらす。
//   ・/kaigai-owner ＝主語は「非居住者であること」。海外に住んだまま日本の不動産を持つ人　←本ページ
//   ・/column/overseas-owners-guide-japan-real-estate-sale ＝主語は「売却という出口」
//   ・/kikoku ＝主語は「帰国というライフイベント」／・/funin ＝主語は「時間と距離」
//   本ページに売却5手法の詳細を書かない（既存コラムの役割）。在留資格も書かない（/global）。
//   「納税管理人」はタイトル・H1に立てるのは本ページのみ（既存売却コラム側には立てない）。
//
// 【コンプライアンス】shigyo-compliance-gate 準拠
//   ・納税管理人は「選択肢と論点」で提示し、当方が引き受ける形で書かない（2026-07-27 浦松確定）。
//   ・税務書類の作成・税務代理＝税理士（税理士法2条1項1号・2号、52条）／登記＝司法書士／紛争＝弁護士。
//   ・分離受任・紹介料なしを明記。禁止語「ワンストップ」「街の不動産屋」不使用。実績数字なし。
//   ・社会保険労務士・労務・助成金に言及しない（2026年9月開業まで）。「補助金」のみ可。
//
// 【法令・数値の裏取り（2026-07-27 実施。出典は本文末「この記事の根拠」に併記）】
//   ・20.42% ＝ 所得税20%（所得税法213条1項1号「百分の二十」）× 復興特別所得税2.1%（復興財源確保法28条2項）
//     ＝ 20 × 1.021。国税庁タックスアンサー No.2880 で税率・免除・翌月10日納付を確認済み。
//   ・免除 ＝ 所得税法施行令328条2号「当該土地家屋等を自己又はその親族の居住の用に供するために
//     借り受けた個人から支払われるもの」（e-Gov条文で原文確認済み）。
//   ・納税管理人 ＝ 国税通則法117条（1項＝選任・2項＝届出。3〜6項＝令和3年度改正で創設された
//     特定納税管理人制度）。資格制限の定めはなく「便宜を有する者」から選任する建て付け。
//   ・管理不全空家等 ＝ 空家法改正（令和5年法律第50号）令和5年12月13日施行。勧告で住宅用地特例
//     （小規模住宅用地200㎡以下＝課税標準1/6）が適用除外（国交省資料 001712029.pdf）。
//   ・2027年1月〜 ＝ 防衛特別所得税1%創設・復興特別所得税2.1%→1.1%（令和8年度税制改正大綱）。
//     付加税の合計は2.1%のまま＝**20.42%は変わらない**（内訳の呼称のみ変わる）。§2-2原稿は
//     「合計税率が変わる可能性」としていたが、裏取りの結果と異なるため確定事実として記述した。
import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { RealestateServicePage, ReH2 } from "@/components/shared/RealestateServicePage";
import { CannotHandle } from "@/components/shared/CannotHandle";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
// 中間CTA（InlineCtaProperty）は本ページでは使わない：同部品のコピーは2種とも
// 「条件をお預けいただければ物件をお探しします」＝これから借りる／買う人向けで、
// 本ページの読者（すでに日本の物件を所有している非居住者）と噛み合わないため。
// 末尾の CtaBand（variant="property-general" / intent="management"）で受ける。

/** 可視の最終更新日（型・第7条6）。ArticleJsonLd の dateModified と必ず同じ日付にする */
const LAST_UPDATED_ISO = "2026-07-27";
const LAST_UPDATED = "2026年7月27日";

// 冒頭の回答ブロック（H1直下・AIが最初に拾う位置）
const JA_ANSWER_BLOCK =
  "海外赴任や海外移住で日本を離れ、日本の不動産を持ち続ける場合、決めることは3つです。①貸すのか空けておくのか ②誰が日本側の窓口になるのか ③納税管理人を誰にするのか。非居住者が日本国内の不動産を貸すと、借主が法人の場合などは家賃から20.42%が源泉徴収されます。四葉不動産株式会社（文京区小日向・茗荷谷駅徒歩5分）は①②を宅地建物取引業として、③の届出書の作成と確定申告は提携税理士に分けてお受けします。契約はそれぞれ直接結んでいただきます。";

// §2 源泉徴収の要否（借主と使いみちで決まる）
const JA_GENSEN: { who: string; use: string; need: string }[] = [
  { who: "法人（社宅として借り上げるなど）", use: "用途を問わない", need: "必要（20.42%）" },
  { who: "個人", use: "本人またはその親族の住まい", need: "不要" },
  { who: "個人", use: "セカンドハウス、事務所、店舗など上記以外", need: "必要（20.42%）" },
];

// §3 納税管理人の選択肢（断定せず「向いている状況」と「論点」で並べる）
const JA_NOUZEI: { option: string; when: string; point: string }[] = [
  {
    option: "税理士に依頼",
    when: "第三者に賃貸する／売却予定がある／源泉徴収の精算が必要",
    point:
      "顧問料と申告報酬がかかります。物件そのものの管理（入居者対応・修繕）は範囲外です。",
  },
  {
    option: "日本国内の親族",
    when: "貸さずに空けておき、固定資産税の納付書を受け取るだけ",
    point:
      "資格の制限はありませんが、申告書の作成は親族でも代われません（税理士法）。期限管理の負担がご親族に乗ります。",
  },
  {
    option: "不動産管理会社に任せる",
    when: "賃貸に出し、入居者対応も含めて任せたい",
    point:
      "「納税管理人も引き受ける」とうたう場合、税務書類の作成まで含むのかは要確認です。含むなら税理士の関与が要ります。",
  },
  {
    option: "四葉不動産＋提携税理士",
    when: "文京区・近隣に物件があり、貸すか空けておくかの判断からしたい",
    point:
      "賃貸募集・管理・書類の受け渡しは四葉不動産株式会社が、届出と申告は提携税理士と直接ご契約いただきます。紹介料のやりとりはありません。",
  },
];

// §5 海外にいたまま進む範囲
const JA_ONLINE: { step: string; what: string }[] = [
  {
    step: "査定・方針決め",
    what: "オンライン面談（時差に合わせて設定します。日本語・英語・中国語）",
  },
  { step: "室内の確認", what: "動画・写真での現況報告" },
  { step: "募集条件の決定", what: "源泉徴収あり／なしの2本立て試算を見て判断" },
  { step: "賃貸借契約", what: "電子契約、または国際郵便での書類往復" },
  { step: "入居後", what: "家賃送金、修繕対応、年次の状況報告" },
];

// この記事の根拠（型・第7条4）
const JA_KONKYO: { what: string; source: string }[] = [
  {
    what: "非居住者への不動産賃貸料の源泉徴収（20.42%）",
    source:
      "所得税法第161条第1項第7号、第212条第1項、第213条第1項第1号／復興財源確保法第28条／国税庁タックスアンサー No.2880",
  },
  {
    what: "個人が自己または親族の居住用に借りる場合の免除",
    source: "所得税法施行令第328条第2号",
  },
  {
    what: "納税管理人の選任と届出",
    source: "国税通則法第117条第1項・第2項（第3項以下は令和3年度税制改正で拡充）",
  },
  {
    what: "税務書類の作成・税務代理が税理士の業務であること",
    source: "税理士法第2条第1項第1号・第2号、第52条",
  },
  {
    what: "管理不全空家等・住宅用地特例の解除",
    source:
      "空家等対策の推進に関する特別措置法（令和5年法律第50号・2023年12月13日施行）／国土交通省「固定資産税等の住宅用地特例に係る空き家対策上の措置」",
  },
  {
    what: "海外居住者の登記で印鑑証明書に代わる書面（署名証明）",
    source: "法務省「外国に居住しているため印鑑証明書を取得することができない場合の取扱いについて」",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    businessKey: "realestate",
    title:
      "海外に住んだまま日本の家を貸す・管理する｜納税管理人と20.42%の源泉徴収 | 四葉不動産",
    description:
      "海外赴任・海外移住で日本を離れたあと、日本の不動産を貸す・管理する・納税管理人を決めるまでの判断材料。家賃から20.42%が源泉徴収される条件を早見表で整理します。文京区小日向・茗荷谷駅徒歩5分。",
    path: "/kaigai-owner",
    keywords: [
      "非居住者 不動産 納税管理人",
      "海外転勤 持ち家 賃貸に出す",
      "非居住者 家賃 源泉徴収 20.42%",
      "海外在住 日本の不動産 管理",
      "海外赴任 家 貸す 手続き",
    ],
    locale: "ja",
    absoluteTitle: true,
    availableLocales: ["ja"],
  });
}

export default async function Page() {
  return (
    <>
      {/* 型・第7条6：dateModified を出力し、本文冒頭の「最終更新」と同じ日付を持たせる。
          Person は @id 参照1つのみ（ArticleJsonLd の author）＝Personノードを増やさない。 */}
      <ArticleJsonLd
        businessKey="realestate"
        title="海外に住んだまま、日本の家をどうするか｜納税管理人と20.42%の源泉徴収"
        description="海外赴任・海外移住で日本を離れたあと、日本の不動産を貸す・管理する・納税管理人を決めるまでの判断材料。家賃から20.42%が源泉徴収される条件を早見表で整理します。"
        path="/kaigai-owner"
        datePublished={LAST_UPDATED_ISO}
        dateModified={LAST_UPDATED_ISO}
      />
    <RealestateServicePage
      path="/kaigai-owner"
      answerBlock={JA_ANSWER_BLOCK}
      crumbs={[{ name: "ホーム", href: "/" }, { name: "海外に住んだまま日本の家を持つ" }]}
      serviceName="非居住者オーナー向けの賃貸募集・管理"
      heroSrc="/hero/realestate-global-16x9.webp"
      heroAlt="海外から日本の住まいを管理するイメージ"
      h1="海外に住んだまま、日本の家をどうするか —— 貸す・管理する・納税管理人を決める"
      ctaVariant="property-general"
      ctaIntent="management"
      lead={
        <>
          <p>
            海外赴任や海外移住で日本を離れ、日本の不動産を持ち続ける場合、決めることは3つです。<strong>①貸すのか空けておくのか ②誰が日本側の窓口になるのか ③納税管理人を誰にするのか。</strong>
          </p>
          <p className="mt-3">
            <Link href="/column/overseas-owners-guide-japan-real-estate-sale" className="text-primary underline">
              売却を検討している方は「海外オーナーのための日本不動産売却ガイド」へ
            </Link>
            。このページは、<strong>売らずに貸す・持ち続ける</strong>場合の話です。
          </p>
          <p className="mt-3 text-sm text-text-muted">最終更新：{LAST_UPDATED}</p>
        </>
      }
      internalLinks={[
        { href: "/column/overseas-owners-guide-japan-real-estate-sale", label: "海外オーナーのための日本不動産売却ガイド" },
        { href: "/kikoku", label: "海外赴任からの本帰国｜帰国前に住まいを決める" },
        { href: "/souzoku/akiya", label: "文京区の相続空き家" },
        { href: "/toushi", label: "不動産投資・賃貸経営" },
        { href: "/services", label: "賃貸・売買・管理" },
        { href: "/contact", label: "お問い合わせ" },
      ]}
      crossLinkLead="海外で作成された書類の日本語訳や、アポスティーユ・領事認証の手続きは、関連事業の四葉行政書士事務所のページで解説しています。"
    >
      {/* §1 何が違うか */}
      <div>
        <ReH2>海外に住んだまま日本の家を貸すと、普通の賃貸と何が違うのですか？</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          いちばん大きい違いは、<strong className="text-ink">借りる人があなたに払う家賃から、税金が先に差し引かれる場合がある</strong>ことです。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          税法上、日本を離れて一定期間が経つと「非居住者」という扱いになります。非居住者が日本国内の不動産を貸したときの賃料は、<strong className="text-ink">支払う側（借主）に源泉徴収の義務が生じます</strong>。税率は<strong className="text-ink">20.42%</strong>（所得税20%＋復興特別所得税0.42%。2026年7月時点）。借主は差し引いた分を、支払った月の翌月10日までに税務署へ納めます。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          つまり、<strong className="text-ink">月20万円で貸したつもりでも、条件によっては口座に入るのは月15万9,160円</strong>です。差し引かれた分は翌年の確定申告で経費（管理費、ローン利息、固定資産税など）を差し引いて精算し、払いすぎがあれば還付されます。損をするわけではありませんが、<strong className="text-ink">毎月の手残りの計算を間違えると、ローン返済とのバランスが崩れます。</strong>
        </p>
      </div>

      {/* §2 源泉徴収の要否 */}
      <div>
        <ReH2>家賃から20.42%が引かれるのは、どんなときですか？</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          <strong className="text-ink">借りる人が誰で、何に使うか</strong>で決まります。あなたの物件の種類ではありません。
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-primary-tint text-left">
                <th className="border border-border px-3 py-2">借主</th>
                <th className="border border-border px-3 py-2">使いみち</th>
                <th className="border border-border px-3 py-2">家賃からの源泉徴収</th>
              </tr>
            </thead>
            <tbody className="text-text">
              {JA_GENSEN.map((g) => (
                <tr key={g.who + g.use}>
                  <td className="border border-border px-3 py-2">{g.who}</td>
                  <td className="border border-border px-3 py-2">{g.use}</td>
                  <td className="border border-border px-3 py-2">{g.need}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 leading-relaxed text-text">
          免除されるのは「自己またはその親族の居住の用に供するために借り受けた個人」が払う場合だけです（所得税法施行令第328条第2号）。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          <strong className="text-ink">実務上ここがいちばん揺れます。</strong>募集の段階では借主が個人か法人か決まっていません。「個人の方に住まいとして借りていただければ源泉徴収なし、企業の社宅として決まれば20.42%が引かれる」という<strong className="text-ink">2通りの手残りを最初から並べて</strong>、どちらでも成り立つ賃料設定にしておく必要があります。四葉不動産株式会社ではこの2本立ての試算をお出しします。
        </p>
        <blockquote className="mt-4 rounded-lg border-l-4 border-primary bg-surface p-4 text-sm leading-relaxed text-text">
          借主が源泉徴収を忘れると、<strong className="text-ink">追徴されるのは借主（支払者）</strong>です。海外オーナーの物件だと知らずに契約した法人が、後から負担を負うという事故が起きます。募集図面と契約書の段階で明示しておくのが、貸主・借主双方を守ります。
        </blockquote>
      </div>

      {/* §3 納税管理人 */}
      <div>
        <ReH2>納税管理人は、誰に頼めばいいのですか？</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          日本に住所も居所もない人が、日本の税務署とやりとりする必要があるときは、<strong className="text-ink">納税管理人</strong>を定めて届け出ます（国税通則法第117条）。納税管理人は、税務署からの書類を受け取り、申告書を提出し、納付を代行する「日本側の窓口」です。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          <strong className="text-ink">納税管理人になること自体に資格の制限はありません。</strong>ただし、<strong className="text-ink">確定申告書や納税管理人届出書といった税務書類を作成して提出することは、税理士の独占業務</strong>です（税理士法第2条第1項第2号、第52条）。ここを曖昧にしている案内が世に多く出回っていますが、区別しておいたほうが安全です。
        </p>
        <p className="mt-3 leading-relaxed text-text">選択肢を並べると、こうなります。</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-primary-tint text-left">
                <th className="border border-border px-3 py-2">選択肢</th>
                <th className="border border-border px-3 py-2">向いている状況</th>
                <th className="border border-border px-3 py-2">論点</th>
              </tr>
            </thead>
            <tbody className="text-text">
              {JA_NOUZEI.map((n) => (
                <tr key={n.option}>
                  <td className="border border-border px-3 py-2 font-medium text-ink">{n.option}</td>
                  <td className="border border-border px-3 py-2">{n.when}</td>
                  <td className="border border-border px-3 py-2">{n.point}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 leading-relaxed text-text">
          どれが最適かは、<strong className="text-ink">貸すのか空けておくのか／借主が法人になりうるか／出国までの残り時間</strong>で変わります。個別の判断は資格者が確認したうえでお示ししますので、まずは現況をお聞かせください。
        </p>
      </div>

      {/* §4 空けておく場合 */}
      <div>
        <ReH2>貸さずに空けておく場合は、何をしておけばいいですか？</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          <strong className="text-ink">空けておく選択にも、放置とは別の手当てが要ります。</strong>
        </p>
        <p className="mt-3 leading-relaxed text-text">
          2023年12月13日に施行された改正空家法（空家等対策の推進に関する特別措置法／令和5年法律第50号）で、「<strong className="text-ink">管理不全空家等</strong>」という区分が新設されました。特定空家になるおそれがある状態と判断されて<strong className="text-ink">勧告を受けると、土地の固定資産税の住宅用地特例（課税標準を最大6分の1に軽減）が外れます</strong>。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          海外にいると、庭木の越境や郵便物の滞留といった初期のサインが届きません。四葉不動産株式会社では、月1回の外観点検・郵便物の確認・写真報告といった保有中の管理からお受けしています。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          相続した空き家として持っている場合は
          <Link href="/souzoku/akiya" className="text-primary underline">文京区の相続空き家のページ</Link>
          もあわせてご覧ください。
        </p>
      </div>

      {/* §5 海外からどこまで進むか */}
      <div>
        <ReH2>海外にいたまま、契約や手続きはどこまで進みますか？</ReH2>
        <p className="mt-3 leading-relaxed text-text">賃貸の募集から契約までは、オンラインで完結できます。</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-primary-tint text-left">
                <th className="border border-border px-3 py-2">段階</th>
                <th className="border border-border px-3 py-2">海外からできること</th>
              </tr>
            </thead>
            <tbody className="text-text">
              {JA_ONLINE.map((o) => (
                <tr key={o.step}>
                  <td className="border border-border px-3 py-2 font-medium text-ink">{o.step}</td>
                  <td className="border border-border px-3 py-2">{o.what}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 leading-relaxed text-text">
          <strong className="text-ink">売却の場合は登記が伴うため、印鑑証明書に代わる在外公館の署名証明などが必要になります。</strong>登記手続きそのものは司法書士の業務ですので、提携司法書士へおつなぎします。※必要書類は国・地域と管轄法務局によって異なるため、個別に確認します。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          帰国してご自分で住む予定がある場合は
          <Link href="/kikoku" className="text-primary underline">海外赴任からの本帰国のページ</Link>
          へ。
        </p>
      </div>

      {/* §6 四葉の視点 */}
      <div>
        <ReH2>四葉に相談する意味はどこにありますか？</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          代表の浦松丈二は、<strong className="text-ink">宅地建物取引士と行政書士</strong>を兼ねています。毎日新聞社で記者を34年務め、中国総局長として中国や台湾、タイに駐在しました。<strong className="text-ink">自分が海外にいる側で日本の住まいを動かした経験</strong>があります。
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-text">
          <li>
            <strong className="text-ink">貸す／空けておく／売るの判断材料づくりから、契約・書類作成まで、続けてお受けします</strong>（相談のたびに一から説明し直す必要がありません）
          </li>
          <li>
            <strong className="text-ink">時差前提のやりとり。</strong>日本語・英語・中国語（簡体字・繁体字）で対応します
          </li>
          <li>
            <strong className="text-ink">税務は提携税理士、登記は提携司法書士と、それぞれ直接ご契約いただきます。</strong>四葉が間に立って報酬を受け取ることはありません
          </li>
        </ul>
      </div>

      {/* §7 この記事の根拠（型・第7条4） */}
      <div>
        <ReH2>この記事の根拠</ReH2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-primary-tint text-left">
                <th className="border border-border px-3 py-2">内容</th>
                <th className="border border-border px-3 py-2">根拠</th>
              </tr>
            </thead>
            <tbody className="text-text">
              {JA_KONKYO.map((k) => (
                <tr key={k.what}>
                  <td className="border border-border px-3 py-2">{k.what}</td>
                  <td className="border border-border px-3 py-2">{k.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 leading-relaxed text-text">
          <strong className="text-ink">2027年1月以後の税率について：</strong>令和8年度税制改正により、2027年（令和9年）1月1日以後に生ずる所得から<strong className="text-ink">防衛特別所得税（所得税額の1%）</strong>が創設され、<strong className="text-ink">復興特別所得税は2.1%から1.1%に引き下げ</strong>られます。付加される税の合計は2.1%のまま変わらないため、<strong className="text-ink">賃料に対する合計税率20.42%そのものは変わりません</strong>。内訳の呼び方が変わります。本ページの数値は2026年7月時点のものです。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          本ページは一般的な情報提供です。個別の税務判断は税理士、登記は司法書士が行います。不動産の媒介・管理は四葉不動産株式会社（宅地建物取引業 東京都知事(1)第113304号）、許認可申請書類の作成は四葉行政書士事務所が、<strong className="text-ink">それぞれ別の契約</strong>としてお受けします。
        </p>
      </div>

      {/* 対応できないこと＝共通コンポーネント（確定文言） */}
      <CannotHandle bare />
    </RealestateServicePage>
    </>
  );
}
