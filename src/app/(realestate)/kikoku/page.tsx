// /kikoku（本帰国ピラー）＝定点#18の入れ替え先（2026-07-25・日本語版のみ・監修前ドラフト）
// 方式＝RealestateServicePage（手本=/inshokuten・/kaigo）。ja先行公開：availableLocales:["ja"]・sitemap側も locales:["ja"]。
//
// 【役割分担（設計_赴任・本帰国レーン_v0.2 §2）】カニバリ防止のため主語をずらす。
//   ・/global ＝主語は「在留資格」。日本で暮らす外国人。※本ページと読者が違う（本ページは日本人）
//   ・/kikoku ＝主語は「帰国というライフイベント」。海外駐在から戻る日本人とその家族　←本ページ
//   ・/funin  ＝主語は「時間と距離」。中華圏から東京へ赴任する本人（繁体字先行・未着手）
//   本ページに在留資格の解説を書かない（読者は日本人）。
//
// 【コンプライアンス】shigyo-compliance-gate 準拠
//   ・個別の審査可否・法的判断を断定しない（「一般に」「〜場合があります」で書く）。
//   ・賃貸仲介＝宅建業（四葉不動産）。書類作成・認証手続きの代行＝行政書士（併設・別契約）。分離受任を明記。
//   ・登記＝司法書士／税＝税理士／紛争＝弁護士。
//   ・禁止語「ワンストップ」は本文で使用しない。
//   ・IT重説・電子書面交付は制度の存在のみ記載（賃貸のIT重説＝2017年10月本格運用、書面の電子交付＝
//     2022年5月18日施行の宅建業法改正。2026-07-25裏取り）。個別物件で対応可否が分かれるため断定しない。
//   ・アポスティーユを「当社が発行」と書かない（発行は外務省）。翻訳証明を独占業務と書かない。
import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { RealestateServicePage, ReH2 } from "@/components/shared/RealestateServicePage";
import { CannotHandle } from "@/components/shared/CannotHandle";
import { InlineCtaProperty } from "@/components/shared/InlineCtaProperty";

// 冒頭の回答ブロック（H1直下・AIが最初に拾う位置）
const JA_ANSWER_BLOCK =
  "本帰国後の住まいは、帰国前に海外にいながら決めることができます。賃貸の重要事項説明はオンラインでの実施が制度上認められており、契約書類の電子交付も可能です。住民票がまだ日本になく、国内での収入実績がない状態でも、保証会社の審査で問われる点を先に整理しておけば進められる場合があります。四葉不動産株式会社が物件探しから内見・契約までを担当し、海外で作成された書類の日本語訳の作成や認証手続きの代行は、併設の四葉行政書士事務所が別契約で受任します。文京区・茗荷谷を中心に東京都内へ対応します。";

// §2 帰国からの逆算スケジュール（一次データ資産）
const JA_SCHEDULE: { when: string; what: string[] }[] = [
  {
    when: "帰国の3か月前",
    what: [
      "帰任日と、赴任先を出る日を確定する",
      "会社の住宅補助の有無・上限・社宅の可否を確認する",
      "エリアと予算の当たりをつける（学校・通勤・車の要否）",
    ],
  },
  {
    when: "帰国の2か月前",
    what: [
      "オンラインで物件を絞り込み、内見を始める",
      "保証会社の審査で説明が必要になりそうな事情を整理する（下記§3）",
      "現地で取得すべき書類を確認し、取り寄せを始める（在留証明・給与証明など）",
    ],
  },
  {
    when: "帰国の1か月前",
    what: [
      "申込み・審査・契約手続き（重要事項説明はオンラインでの実施が可能な場合があります）",
      "鍵の受け取り方法と、初期費用の海外からの送金方法を決める",
      "引越し（航空便・船便）の到着日と入居日を突き合わせる",
    ],
  },
  {
    when: "帰国後",
    what: [
      "転入届（住民票）・マイナンバー・健康保険・年金の手続き",
      "銀行口座・クレジットカード・携帯電話の再開または新規契約",
      "子どもの就学手続き",
    ],
  },
];

// §3 審査で説明が必要になりやすい項目
const JA_SHINSA: { item: string; body: string }[] = [
  {
    item: "日本国内での収入実績がない",
    body: "海外勤務中は国内での給与支払いがないため、直近の国内所得を示す資料が用意できないことがあります。帰任後の勤務先・想定年収を会社の書面で示せると、説明がしやすくなります。",
  },
  {
    item: "住民票がまだ日本にない",
    body: "転入届は帰国後の手続きです。契約の時点で住民票が出せない場合の取り扱いは、貸主・保証会社によって異なります。事前に確認して段取りを決めます。",
  },
  {
    item: "日本国内の緊急連絡先",
    body: "国内に連絡が取れる方を求められることが一般的です。ご家族・ご親族に依頼できるかを早めに確認しておくと安心です。",
  },
  {
    item: "海外で作成された書類",
    body: "在職証明・収入証明などが外国語の場合、日本語訳の添付を求められることがあります。訳文の作成は併設の四葉行政書士事務所が別契約で承ります。",
  },
];

// §4 オンラインでできること／現地確認が要ること
const JA_ONLINE: { can: string; note: string }[] = [
  { can: "物件の絞り込み・図面と写真の確認", note: "希望条件をお預かりして、当社が候補を用意します" },
  { can: "オンライン内見（動画通話での室内案内）", note: "時差に合わせて時間を調整します" },
  { can: "重要事項説明（IT重説）", note: "賃貸では制度上可能です。ただし対応の可否は物件・貸主によって分かれます" },
  { can: "契約書類の電子交付・電子契約", note: "2022年5月施行の宅建業法改正で可能になりました。こちらも物件により異なります" },
];

const JA_GENCHI: string[] = [
  "周辺の音・においなど、映像では伝わらない環境",
  "日当たりと風通しの実際（時間帯による変化）",
  "駅までの実際の歩行時間と、夜間の道の様子",
  "設備の細かな不具合や、収納の使い勝手",
];

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    businessKey: "realestate",
    title: "海外赴任からの本帰国｜東京の住まいを帰国前にオンラインで決める | 四葉不動産",
    description:
      "本帰国後の住まいは、海外にいるうちに決められます。住民票がなく国内の収入実績もない状態での賃貸審査、オンライン内見とIT重説、帰国日からの逆算スケジュールを、元駐在員の宅地建物取引士がまとめました。文京区小日向・茗荷谷駅徒歩5分。",
    path: "/kikoku",
    keywords: [
      "本帰国 賃貸 東京",
      "本帰国 家探し オンライン",
      "海外赴任 帰国 住まい",
      "オンライン内見 海外から",
      "帰国 住民票 賃貸 審査",
    ],
    locale: "ja",
    absoluteTitle: true,
    availableLocales: ["ja"],
  });
}

export default async function Page() {
  return (
    <RealestateServicePage
      path="/kikoku"
      answerBlock={JA_ANSWER_BLOCK}
      crumbs={[{ name: "ホーム", href: "/" }, { name: "本帰国後の住まい探し" }]}
      serviceName="本帰国者向けの賃貸物件の紹介・仲介"
      heroSrc="/hero/realestate-global-16x9.webp"
      heroAlt="日本へ戻る住まい探しのイメージ"
      h1="海外赴任からの本帰国 —— 東京の住まいを、帰国前に決める"
      ctaVariant="property"
      lead={
        <p>
          「帰任の内示が出たが、日本に行けるのは着任の直前」——本帰国の住まい探しは、<strong>まだ海外にいるうちに、日本の物件を決めきる</strong>必要があります。しかも住民票はまだなく、国内での収入実績も示せない。このページでは、<strong>帰国日からの逆算</strong>と、<strong>審査で先に整理しておくこと</strong>を解説します。
        </p>
      }
      internalLinks={[
        { href: "/services", label: "賃貸・売買・管理" },
        { href: "/access", label: "アクセス・ご相談" },
        { href: "/souzoku", label: "文京区で不動産を相続したら｜完全ガイド" },
        { href: "/ryokin", label: "料金のご案内" },
        { href: "/contact", label: "お問い合わせ" },
      ]}
      crossLinkLead="海外で作成された書類の日本語訳や、アポスティーユ・領事認証の手続きは、関連事業の四葉行政書士事務所のページで解説しています。"
    >
      {/* §1 なぜ本帰国の家探しは難しいか */}
      <div>
        <ReH2>本帰国の住まい探しは、なぜ普通の引っ越しと違うのですか？</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          三つの条件が同時に重なるからです。<strong className="text-ink">物件を見に行けない</strong>、<strong className="text-ink">住民票がまだ日本にない</strong>、<strong className="text-ink">国内での収入実績を示せない</strong>——このうち一つだけなら珍しくありませんが、本帰国では三つが重なります。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          しかも帰任日は会社の都合で決まり、動かせないことがほとんどです。日本に着いてから探し始めると、仮住まいの費用と時間が余分にかかります。だからこそ、<strong className="text-ink">まだ海外にいるうちに決めきる</strong>のが現実的な選択になります。
        </p>
      </div>

      {/* §2 逆算スケジュール（一次データ資産） */}
      <div>
        <ReH2>帰国日から逆算すると、いつ何をすればいいですか？</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          目安の順序です。会社の異動時期やご家族の事情によって前後します。
        </p>
        <ul className="mt-4 space-y-3">
          {JA_SCHEDULE.map((s) => (
            <li key={s.when} className="rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text">
              <strong className="text-ink">{s.when}</strong>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {s.what.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <p className="mt-3 leading-relaxed text-text">
          いちばん詰まりやすいのは<strong className="text-ink">2か月前</strong>です。物件は動きが早く、良い部屋ほど1か月以上先の入居を待ってもらえません。逆に早すぎると、入居日までの空家賃が発生します。この見極めは、エリアの動きを見ている業者でないと難しいところです。
        </p>
      </div>

      {/* 中間CTA（高意欲の瞬間） */}
      <InlineCtaProperty page="/kikoku" />

      {/* §3 審査 */}
      <div>
        <ReH2>住民票がなく、国内の収入実績もない状態で審査は通りますか？</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          一般に、事情を整理して説明できれば進められる場合があります。審査の基準は貸主と保証会社によって異なるため、可否をあらかじめ断言することはできませんが、<strong className="text-ink">何を聞かれるかは事前に分かります</strong>。先に用意しておけば、やり取りの往復が減ります。
        </p>
        <ul className="mt-4 space-y-3">
          {JA_SHINSA.map((s) => (
            <li key={s.item} className="rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text">
              <strong className="text-ink">{s.item}</strong>
              <span className="mt-1 block">{s.body}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 leading-relaxed text-text">
          四葉不動産株式会社は、これらを先に整理したうえで、貸主・保証会社への説明まで一緒に準備します。
        </p>
      </div>

      {/* §4 オンラインでできること／できないこと */}
      <div>
        <ReH2>オンライン内見だけで決めて大丈夫ですか？</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          契約手続きまではオンラインで進められます。ただし、映像で分かることと分からないことがあります。両方を正直にお伝えします。
        </p>
        <p className="mt-4 font-medium text-ink">オンラインでできること</p>
        <ul className="mt-2 space-y-2">
          {JA_ONLINE.map((o) => (
            <li key={o.can} className="rounded-lg border border-border bg-surface p-3 text-sm leading-relaxed text-text">
              <strong className="text-ink">{o.can}</strong>
              <span className="mt-1 block text-text-muted">{o.note}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 font-medium text-ink">映像では分かりにくいこと（当社が現地で確認します）</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-text">
          {JA_GENCHI.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
        <p className="mt-3 leading-relaxed text-text">
          <strong className="text-ink">見に行けない分は、当社が代わりに見ます。</strong>気になる点は、その場で動画や写真を追加してお送りします。「実際どうですか」と聞いていただければ、忖度なくお答えします。
        </p>
      </div>

      {/* §5 海外で作った書類 → 行政書士側へ（分離受任） */}
      <div>
        <ReH2>海外で作った書類は、日本でそのまま使えますか？</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          外国語の在職証明や収入証明は、提出先から<strong className="text-ink">日本語訳の添付</strong>を求められることがあります。訳文の作成は、併設の四葉行政書士事務所が別契約で承ります。翻訳証明は資格を要する業務ではありませんが、代表が中国語（繁体字・簡体字）・英語に対応するため、外部の翻訳会社を挟まずに進められます。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          逆に、<strong className="text-ink">日本の書類を海外に提出する</strong>場面——赴任先の残務、海外の口座解約、お子さんの現地校への提出など——では、外務省の<strong className="text-ink">アポスティーユ</strong>または<strong className="text-ink">公印確認と領事認証</strong>が必要になることがあります。どちらになるかは提出先の国によって決まります。証明を発行するのは外務省であり、当社ではありません。申請の代行と書類の整理を、四葉行政書士事務所が別契約で承ります。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          手続きの詳細は
          <Link href="/legal/services/visa" className="text-primary underline">四葉行政書士事務所のページ</Link>
          をご覧ください。
        </p>
      </div>

      {/* §6 四葉の視点 */}
      <div>
        <ReH2>四葉に相談する意味はどこにありますか？</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          代表の浦松丈二は、元毎日新聞の記者として中国総局長を務め、中国や台湾、タイに駐在しました。<strong className="text-ink">海外から日本に戻る側の当事者</strong>だったということです。時差のある連絡の面倒さ、現地でしか取れない書類、日本の常識が通じない感覚——そのどれもが、経験として分かります。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          そのうえで、住まいは四葉不動産株式会社（宅地建物取引業）が、書類と認証の手続きは併設の四葉行政書士事務所が、それぞれ<strong className="text-ink">別契約で</strong>担当します。窓口はひとつでも、契約と責任は分けています。
        </p>
      </div>

      {/* 対応できないこと＝共通コンポーネント（確定文言） */}
      <CannotHandle bare />
    </RealestateServicePage>
  );
}
