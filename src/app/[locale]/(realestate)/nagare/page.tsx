// /nagare（不動産・ご依頼から引渡しまでの流れ）＝2026-08-11 新設（浦松指示）
//
// 【なぜ作ったか】4週間のレビューで、転換側（見つけた人が電話をかけるか）のページが最も薄いと分かった。
//   /ryokin 2,331字・表0本、/legal/nagare 1,544字・h2 1本、そして不動産の「流れ」ページは 404 だった。
//   「頼んだら次に何が起きるか」が読めない状態を解消する。
//
// 【役割分担（luck428-column-seo 第2条・第6条に基づき既存を洗ったうえで決めた）】
//   /nagare（本ページ）  主語＝手続きと時間の実務。契約後に何が起き、いつ何を用意し、いつ払うか。
//                        売却（仲介・買取）と賃貸で流れが違うことを並べる。相続に限らない。
//   /souzoku/nagare      主語＝相続という入口。3つの出口（管理・活用・売却）の選び方の6ステップ概観。
//                        ※同ページは「実行・引渡し」を1行で終えており中身が無い＝そこが本ページの担当。
//   /legal/nagare        主語＝行政書士業務の受任。書類作成を頼むときの流れ。
//   /leaving-japan       主語＝出国までの日数。30日で売り切る場合の段取り。
//   本ページからは、相続が絡む場合は /souzoku/nagare、出国期限がある場合は /leaving-japan へ送る。
//
// 【ロケール】ja 固定（availableLocales: ["ja"]／locale: "ja"）。PR#210 で確立した型に従い
//   canonical を ja に正規化する。多言語版は本文が固まってからの別対応（未着手）。
//
// 【表示コンプライアンス】
//   ・業務一体提供を示唆する語（ワンストップ・一括受任・まとめて契約・一括サポート・一気通貫）は使用禁止。
//   ・登記は司法書士、税務の申告・代理は税理士、紛争性のある事案は弁護士の業務。当社は行わず、
//     おつなぎするのみ。ご本人と直接ご契約いただき、当社は紹介料を受け取らない。
//   ・行政書士業務は併設の四葉行政書士事務所が別契約・別料金で受任する。
//   ・具体的な法的判断は書かない。個別の可否は書類を確認のうえ担当が説明する旨を残す。
//
// 【数値・法令の出どころ】新規の主張を足していない。すべて既存ページに記載のあるもの。
//   ・相談無料／査定無料／賃貸管理は月額賃料の3〜5%（消費税込み）＝/ryokin（2026-08-11 浦松確認）
//   ・売買の媒介報酬の上限＝宅建業法46条1項／昭和45年建設省告示第1552号
//     （最終改正 令和6年国土交通省告示第949号・2024年7月1日施行）＝/ryokin・/access
//   ・抵当権抹消に要する金融機関の事務日数（通常2週間〜1か月）＝/leaving-japan
//   ・固定資産税等の日割り精算は法律上の義務ではなく当事者間の合意＝離日売却クラスタのコラム
//     （東京都主税局「地方税法上で規定されているものではありません」）
import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { RealestateServicePage, ReH2 } from "@/components/shared/RealestateServicePage";
import { HowToJsonLd, type HowToStep } from "@/components/seo/HowToJsonLd";
import { Faq, buildFaqJsonLd, type FaqItem } from "@/components/shared/Faq";

const ANSWER_BLOCK =
  "ご相談は無料です（初回・2回目以降とも）。売却の査定も無料で、査定を見てからご依頼をお決めいただけます。売却は、買主を探す「仲介」と、当社が直接買い取る「買取」で流れが変わります。仲介はご相談から引渡しまでおおむね3〜6か月、買取は買主を探す期間がない分だけ短くなります。仲介手数料をお支払いいただくのは売買契約と引渡しの時で、ご相談や査定の段階では費用はかかりません。登記は司法書士、税務の申告は税理士の業務のため、おつなぎしたうえでご本人と直接ご契約いただきます。当社が紹介料を受け取ることはありません。";

/** 売却（仲介）の流れ。HowTo JSON-LD と画面表示は同じ配列から生成する＝完全一致 */
const STEPS_BAIKYAKU: HowToStep[] = [
  {
    name: "1. ご相談（無料）",
    text: "電話・LINE・オンラインで承ります。「売るかどうか決めていない」段階で構いません。物件の場所と種類、いつまでにどうしたいかを伺います。",
  },
  {
    name: "2. 査定（無料）",
    text: "登記や図面を確認し、周辺の成約事例から価格の見通しをお出しします。査定は無料で、ここでお断りいただいても費用はかかりません。住宅ローンが残っている場合は、残債と抵当権の状況もこの段階で確認します。",
  },
  {
    name: "3. 媒介契約",
    text: "売却をご依頼いただく場合に締結します。一般媒介・専任媒介・専属専任媒介の3種類があり、他社にも重ねて依頼できるか、ご自身で買主を見つけられるかが違います（宅地建物取引業法第34条の2）。仲介手数料の上限は、この時点で書面でご確認いただきます。",
  },
  {
    name: "4. 販売活動",
    text: "指定流通機構（レインズ）への登録、図面の作成、内覧の調整を行います。問い合わせと内覧の状況は定期的にご報告します。価格を見直す場合も、ご相談のうえで決めます。",
  },
  {
    name: "5. 売買契約",
    text: "買主が決まったら、重要事項の説明（宅地建物取引業法第35条）を行ったうえで売買契約を締結します。手付金を受け取り、仲介手数料の半額をお支払いいただくのが一般的です。",
  },
  {
    name: "6. 決済・引渡し",
    text: "残代金の受領、抵当権の抹消、所有権移転登記を同じ日に行います。司法書士が立ち会い、登記の申請を担当します。ここで残りの仲介手数料をお支払いいただきます。固定資産税等の精算は、法律上の義務ではなく当事者間の合意によるものです。",
  },
];

const STEPS_CHINTAI: HowToStep[] = [
  {
    name: "1. ご相談・賃料の査定（無料）",
    text: "貸せる状態か、いくらで募集できるかを確認します。管理までご依頼いただくか、募集だけかもここで決めます。",
  },
  {
    name: "2. 管理委託契約または媒介契約",
    text: "管理までご依頼いただく場合は管理委託契約を、募集だけの場合は媒介契約を締結します。管理料は月額賃料の3〜5%（消費税込み）で、管理の範囲により決まります。",
  },
  {
    name: "3. 募集・入居審査",
    text: "募集条件を決めて広告を出し、申込みがあれば入居審査を行います。保証会社を利用するかもこの段階で決めます。",
  },
  {
    name: "4. 賃貸借契約・引渡し",
    text: "契約を締結し、鍵をお渡しします。以降、集金・入居者対応・退去時の原状回復の手配などを、ご契約の範囲で行います。",
  },
];

const SHORUI: { a: string; b: string }[] = [
  { a: "登記識別情報（権利証）", b: "ご売却の場合。紛失していても手続きの方法があります" },
  { a: "本人確認書類", b: "運転免許証・マイナンバーカード等（犯罪収益移転防止法第4条による確認）" },
  { a: "固定資産税の納税通知書", b: "税額と評価額の確認に使います" },
  { a: "購入時の売買契約書・領収書", b: "譲渡所得の計算に必要です。見つからない場合は税理士にご相談いただきます" },
  { a: "管理規約・維持費のわかるもの", b: "マンションの場合。管理費と修繕積立金の額を確認します" },
  { a: "住宅ローンの残高がわかるもの", b: "残債がある場合。抵当権の抹消に必要です" },
];

const HIYOU: { a: string; b: string }[] = [
  { a: "ご相談", b: "無料（初回・2回目以降とも）" },
  { a: "査定", b: "無料" },
  { a: "媒介契約の締結時", b: "費用はかかりません" },
  { a: "売買契約時", b: "仲介手数料の半額をお支払いいただくのが一般的です" },
  { a: "決済・引渡し時", b: "仲介手数料の残額、登記費用と司法書士の報酬、印紙代など" },
  { a: "引渡し後", b: "譲渡所得が出た場合、翌年の2月16日〜3月15日に確定申告と納税" },
];

const FAQS: FaqItem[] = [
  {
    q: "相談したら、必ず依頼しないといけませんか？",
    a: "そういうことはありません。ご相談も査定も無料で、査定額をご覧になってからお決めいただけます。売らないという結論になっても費用はかかりません。",
  },
  {
    q: "売却にはどのくらい時間がかかりますか？",
    a: "仲介の場合、ご相談から引渡しまでおおむね3〜6か月です。物件の種類・価格・時期によって変わります。買主を探す期間が読めないのが仲介の性質なので、期限が決まっている場合は、当社が直接買い取る買取もご相談ください。",
    links: [{ href: "/leaving-japan", label: "出国の期限がある場合の段取り" }],
  },
  {
    q: "住宅ローンが残っていても売れますか？",
    a: "売れます。売却代金でローンを完済し、抵当権を抹消する形が一般的です。ただし完済と抹消には金融機関側の事務日数（通常2週間〜1か月）が必要なので、引渡し日から逆算して段取りします。売却代金で完済できない場合は、金融機関との調整が別途必要になります。",
  },
  {
    q: "登記や税金の手続きも、四葉不動産がやってくれますか？",
    a: "いいえ。所有権移転登記や抵当権抹消の申請は司法書士の業務、譲渡所得の申告と納税は税理士の業務です。当社は行いません。決済の日程に合わせておつなぎしますが、ご本人と司法書士・税理士が直接ご契約いただく形です。当社が紹介料を受け取ることはありません。",
  },
  {
    q: "相続した不動産の場合は、流れが違いますか？",
    a: "相続登記が済んでいるかどうかで、始め方が変わります。名義がご本人に移っていない状態では売却の手続きに進めないため、まず現状の整理からになります。相続を入口とする場合の流れは別のページにまとめています。",
    links: [{ href: "/souzoku/nagare", label: "相続した不動産の相談から売却・活用までの流れ" }],
  },
  {
    q: "仲介手数料はいつ払いますか？",
    a: "売買契約時に半額、決済・引渡し時に残額をお支払いいただくのが一般的です。ご相談や査定の段階では費用はかかりません。上限は宅地建物取引業法により定められており、媒介契約の締結時に書面でご確認いただきます。",
    links: [{ href: "/ryokin", label: "料金のご案内" }],
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    businessKey: "realestate",
    title: "ご依頼から引渡しまでの流れ｜不動産の売却・賃貸",
    description:
      "四葉不動産にご依頼いただいた場合、何がどの順番で進むかをまとめました。ご相談も査定も無料です。売却（仲介）は6段階、賃貸は4段階。ご用意いただく書類と、費用をいつお支払いいただくかも一覧にしています。登記は司法書士、税務は税理士の業務のため、おつなぎしたうえでご本人と直接ご契約いただきます。文京区小日向・茗荷谷駅から徒歩5分。",
    path: "/nagare",
    keywords: [
      "不動産 売却 流れ",
      "不動産 売却 必要書類",
      "仲介手数料 いつ払う",
      "不動産 査定 無料",
      "文京区 不動産 相談",
    ],
    locale: "ja",
    availableLocales: ["ja"],
    absoluteTitle: true,
  });
}

const TD = "border border-border px-3 py-2";

function TwoColTable({ head, rows }: { head: [string, string]; rows: { a: string; b: string }[] }) {
  return (
    <table className="mt-3 w-full border-collapse text-sm">
      <thead>
        <tr className="bg-primary-tint text-left">
          <th className={TD}>{head[0]}</th>
          <th className={TD}>{head[1]}</th>
        </tr>
      </thead>
      <tbody className="text-text">
        {rows.map((r) => (
          <tr key={r.a}>
            <td className={TD}>{r.a}</td>
            <td className={TD}>{r.b}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function StepList({ steps }: { steps: HowToStep[] }) {
  return (
    <ol className="mt-3 space-y-4">
      {steps.map((s) => (
        <li key={s.name} className="rounded-lg border border-border bg-surface p-4">
          <p className="font-semibold text-ink">{s.name}</p>
          <p className="mt-1 text-sm leading-relaxed text-text">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

export default function Page() {
  return (
    <>
      <HowToJsonLd
        name="不動産を売却するときの流れ（仲介）"
        description="四葉不動産にご相談いただいてから、売買契約・決済・引渡しまでの6段階。"
        steps={STEPS_BAIKYAKU}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(FAQS, "ja")) }}
      />
      <RealestateServicePage
        path="/nagare"
        answerBlock={ANSWER_BLOCK}
        crumbs={[{ name: "ホーム", href: "/" }, { name: "ご依頼から引渡しまでの流れ" }]}
        serviceName="不動産の売却・賃貸のご依頼から引渡しまで"
        heroSrc="/hero/realestate-souzoku-16x9.webp"
        heroAlt="四葉不動産の、ご依頼から引渡しまでの流れ"
        h1="ご依頼から引渡しまでの流れ"
        ctaVariant="property-general"
        ctaIntent="sale"
        lead="頼んだあと、何がどの順番で進むのか。いつ何を用意すればよくて、費用はどの時点で発生するのか。決める前に知っておきたいことを、順番に並べました。"
        internalLinks={[
          { href: "/ryokin", label: "料金のご案内", noLocalePrefix: true },
          { href: "/souzoku/nagare", label: "相続した不動産の場合の流れ", noLocalePrefix: true },
          { href: "/leaving-japan", label: "出国までの日数が限られている場合", noLocalePrefix: true },
          { href: "/contact", label: "ご相談・お問い合わせ", noLocalePrefix: true },
        ]}
      >
        <div>
          <ReH2>売却（仲介）は、どのように進みますか？</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            買主を探して売る方法です。ご相談から引渡しまで、おおむね3〜6か月をみていただきます。買主が現れるまでの期間が読めないのが、この方法の性質です。
          </p>
          <StepList steps={STEPS_BAIKYAKU} />
        </div>

        <div>
          <ReH2>買取は、何が違いますか？</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            当社が直接買い取る方法です。買主を探す期間がないため、上の4番（販売活動）がなくなり、その分だけ短くなります。価格は市場の相場より低くなりますが、いつ売れるかが決まっている点が違います。どちらが向いているかは、期限があるかどうかで変わります。
          </p>
          <p className="mt-3 text-sm">
            <Link href="/leaving-japan" className="text-primary underline">
              出国の期限がある場合の段取りはこちら
            </Link>
          </p>
        </div>

        <div>
          <ReH2>貸す場合は、どのように進みますか？</ReH2>
          <StepList steps={STEPS_CHINTAI} />
        </div>

        <div>
          <ReH2>何をご用意いただきますか？</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            すべてを最初に揃えていただく必要はありません。手元にあるものから拝見し、足りないものは取得の方法をご案内します。
          </p>
          <TwoColTable head={["書類", "備考"]} rows={SHORUI} />
        </div>

        <div>
          <ReH2>費用は、いつ払いますか？</ReH2>
          <TwoColTable head={["時点", "お支払いいただくもの"]} rows={HIYOU} />
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            ※仲介手数料の上限は宅地建物取引業法第46条第1項および同法に基づく告示（昭和45年建設省告示第1552号／最終改正 令和6年国土交通省告示第949号・2024年7月1日施行）により定められています。金額は
            <Link href="/ryokin" className="text-primary underline">
              料金のご案内
            </Link>
            をご覧ください。固定資産税・都市計画税の日割り精算は、地方税法上の義務ではなく当事者間の合意によるものです（東京都主税局）。
          </p>
        </div>

        <div>
          <ReH2>誰が、どこまでを担当しますか？</ReH2>
          <p className="mt-3 leading-relaxed text-text">
            不動産の売買・賃貸の媒介と、賃貸物件の管理は、四葉不動産株式会社が宅地建物取引業として行います。所有権移転登記・抵当権抹消の申請は司法書士、譲渡所得の申告と納税は税理士の業務のため、当社は行いません。決済の日程に合わせておつなぎしますが、ご本人と直接ご契約いただく形です。
            <strong>当社が紹介料を受け取ることはありません。</strong>
            相続に関する書類の作成など行政書士の業務は、併設の四葉行政書士事務所が別契約・別料金で受任します。
          </p>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            個別の可否や進め方は、物件の状況とご事情によって変わります。書類を確認したうえで、担当がご説明します。
          </p>
        </div>

        <div>
          <ReH2>よくあるご質問</ReH2>
          <Faq items={FAQS} bare openFirst={false} />
        </div>
      </RealestateServicePage>
    </>
  );
}
