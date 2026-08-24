// /labor/nagare（型D・受任フロー/HowTo）＝原稿_社労士 #6（開業後公開・SR_LAUNCHED=falseの間は404）
// ★2026-08-13 全面改稿：このページを「どう進めるか」の主力ページにする。
//   軸は3つ ── ①freee人事労務で同じ画面を見る ②料金は着手前に書面 ③AIの線引きを明示。
//   /labor/ryokin（いくらか）・/labor/about（誰が）とは主語が違うのでカニバらない。
//   ★AIは「軸」として大きく出さず、「任せていないこと」を書く節に限定している。
//   shigyo-compliance-gate 第1条（AIは論点整理まで／法的判断は出力しない）と、
//   社会保険労務士法第21条（秘密を守る義務）に照らすと、
//   「AIで安く速く」と読ませる書き方は、事故が起きたときに不利に働くため。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { CtaBand } from "@/components/shared/CtaBand";
import { Placeholder } from "@/components/shared/Placeholder";
import { HowToJsonLd } from "@/components/seo/HowToJsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "labor",
    title: "ご相談から契約までの流れ｜四葉社会保険労務士事務所",
    description:
      "四葉社会保険労務士事務所にご依頼いただく流れを、相談・現状整理・契約・着手・手続き・報告の6段階でご説明します。顧問契約とスポット依頼のどちらにも対応。オンライン相談にも対応します。",
    path: "/labor/nagare",
    locale,
    absoluteTitle: true,
  });
}

const STEPS = [
  {
    name: "ご相談（60分まで無料）",
    text: "現状とお困りごとを伺い、論点を整理します。この段階で費用はいただきません。顧問契約に至らなかった場合の2回目以降は、1時間11,000円（税込）です。",
  },
  {
    name: "現状整理・お見積り",
    text: "従業員数・就業実態・既存の規程を確認し、業務範囲と料金を書面でご提示します。料金は報酬額表の単価から積み上げるので、内訳がそのまま見えます。",
  },
  {
    name: "ご契約（顧問／スポット）",
    text: "内容にご納得いただいてから契約します。顧問料に含むもの・含まないものを契約書に明記します。",
  },
  {
    name: "freee人事労務の準備",
    text: "顧問先のfreee人事労務に、当事務所がアドバイザーとして参加します。以後、同じデータを見ながら進めます。",
  },
  {
    name: "着手・手続き・届出",
    text: "規程の整備、資格取得届などの手続きを進めます。電子申請の状況は、freee上でいつでもご確認いただけます。",
  },
  {
    name: "報告・記録",
    text: "完了のご報告をします。受任日・内容・報酬額は、社会保険労務士法第19条の帳簿に記録し、2年間保存します。",
  },
];

/** 料金の出し方を先に示す。「お見積り」の項目がどれかも隠さない */
const RYOKIN_POINTS: { q: string; a: string }[] = [
  {
    q: "料金は、いつ分かるのですか？",
    a: "着手前です。報酬額表の単価から積み上げた見積書を書面でお出しします。作業を始めてから金額が決まることはありません。",
  },
  {
    q: "顧問料には、何が含まれるのですか？",
    a: "労務のご相談だけです。ご相談は回数・時間の制限なく承ります。手続・給与計算・規程の作成は、顧問先の方にも都度申し受けます。含まないものを料金表に書いているのは、そのためです。",
  },
  {
    q: "あとから金額が増えることはありますか？",
    a: "お見積りの範囲を超える作業が必要になったときは、着手前にあらためてお見積りします。先に金額をお伝えせずに進めることはありません。",
  },
  {
    q: "金額が決まっていない項目はありますか？",
    a: "あります。募集・採用コンサルタント、処遇改善加算の設計、外部監査人、顧問料と給与計算の30人以上は、作業量が案件ごとに大きく変わるためお見積りとしています。隠しているわけではなく、決められないものを決められないと書いています。",
  },
];

export default async function Page() {
  const locale = await getRequestLocale();
  return (
    <>
      <HowToJsonLd
        name="四葉社会保険労務士事務所へのご依頼の流れ"
        description="ご相談から契約・手続き完了までの6段階の流れです。"
        steps={STEPS}
      />
      <Breadcrumb items={[{ name: "ホーム", href: "/labor" }, { name: "受任の流れ" }]} />

      <main className="mx-auto max-w-3xl px-4 pb-16">
        <header className="pt-2">
          <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">
            ご相談から契約までの流れ
          </h1>
          <p className="mt-4 leading-relaxed text-text">
            <strong>料金は着手前に書面でお出しします。</strong>
            手続きは <strong>freee人事労務</strong> で行い、顧問先と{" "}
            <strong>同じデータを見ながら</strong>進めます。オンラインでのご相談にも対応します。
          </p>
          <p className="mt-3 leading-relaxed text-text">
            ご依頼は{" "}
            <strong>
              ①ご相談 → ②現状整理・お見積り → ③ご契約 → ④freee人事労務の準備 → ⑤着手・手続き → ⑥報告・記録
            </strong>{" "}
            の順に進みます。
          </p>
        </header>

        <ol className="mt-8 space-y-4">
          {STEPS.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-white">
                {i + 1}
              </span>
              <div>
                <div className="font-medium text-ink">{s.name}</div>
                <p className="mt-0.5 text-sm leading-relaxed text-text-muted">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* ── 軸1：同じ画面を見る ── */}
        <section className="mt-12">
          <h2 className="font-serif text-xl font-semibold text-ink">
            なぜ、同じ画面を見るのですか？
          </h2>
          <p className="mt-3 leading-relaxed text-text">
            当事務所は、給与計算も労働社会保険の手続きも <strong>freee人事労務</strong> で行います。
            顧問先のfreee人事労務に当事務所がアドバイザーとして参加するため、
            <strong>従業員の情報も、給与の計算結果も、申請の状況も、同じデータをご覧いただけます。</strong>
            「いま何が終わっていて、何が残っているか」を、お問い合わせいただかなくても確認できます。
          </p>
          <p className="mt-3 leading-relaxed text-text">
            <strong>もう一つ、先にお伝えしておくことがあります。</strong>
            freee人事労務は、社会保険労務士が自分の資格情報で申請する形（代理申請）に対応していません。
            電子申請は<strong>顧問先のアカウントから行われます</strong>。当事務所は、
            受任日・内容・報酬額を<strong>社会保険労務士法第19条の帳簿</strong>に記録し、
            帳簿閉鎖の時から2年間保存します。
          </p>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            ※freee人事労務をお使いでない場合や、他のシステムをご利用の場合は、
            移行の要否も含めてご相談ください。システムの利用料は顧問先のご負担になります。
          </p>
        </section>

        {/* ── 軸2：料金の出し方 ── */}
        <section className="mt-12">
          <h2 className="font-serif text-xl font-semibold text-ink">
            料金は、どう決まるのですか？
          </h2>
          <dl className="mt-4 space-y-4">
            {RYOKIN_POINTS.map((p) => (
              <div key={p.q} className="rounded-xl border border-border bg-surface p-4">
                <dt className="font-medium text-ink">{p.q}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-text">{p.a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm leading-relaxed text-text-muted">
            単価は{" "}
            <Link href={addLocalePrefix("/labor/ryokin", locale)} className="text-primary underline">
              報酬額表
            </Link>{" "}
            にすべて掲載しています。含まないものと、その場合のおつなぎ先も同じ表に書いています。
          </p>
        </section>

        {/* ── 軸3：AIの線引き ── */}
        <section className="mt-12">
          <h2 className="font-serif text-xl font-semibold text-ink">
            AIは、どこまで使うのですか？
          </h2>
          <p className="mt-3 leading-relaxed text-text">
            調べものと下書きには生成AIを使います。法改正の調査、規程の素案、
            ご説明資料の作成などです。そのぶん作業の時間は短くなります。
          </p>
          <div className="mt-4 rounded-xl border-l-4 border-primary bg-primary-tint p-4">
            <p className="leading-relaxed text-text">
              <strong>ただし、判断はAIに任せません。</strong>
              労働者にあたるかどうか、社会保険に加入するかどうか、助成金の要件を満たすかどうか——
              こうした判断は、資料を確認したうえで<strong>社会保険労務士が行います。</strong>
              提出する書類も、すべて目を通してからお出しします。
            </p>
            <p className="mt-3 leading-relaxed text-text">
              <strong>顧問先の個人情報を、生成AIに入力することはしません。</strong>
              社会保険労務士には秘密を守る義務があります（社会保険労務士法第21条）。
              マイナンバー・在留カード番号・給与の明細といった情報は、AIに渡さない運用にしています。
            </p>
          </div>
          <p className="mt-4 leading-relaxed text-text">
            AIで安くできるのは<strong>作業</strong>であって、<strong>責任</strong>ではありません。
            間違えたときに向き合うのは資格者です。当事務所が
            <Link href={addLocalePrefix("/labor/ryokin", locale)} className="text-primary underline">
              手続きの料金
            </Link>
            を下げているのは、作業が軽くなるぶんをお返しする趣旨です。
            責任の部分まで安くしているわけではありません。
          </p>
        </section>

        <p className="mt-12 text-sm text-text-muted">
          ※所要期間・準備物・費用発生のタイミングは業務により異なります。各業務ページ（
          <Link href={addLocalePrefix("/labor/services/shogu-kaizen", locale)} className="text-primary underline">処遇改善加算</Link>／
          <Link href={addLocalePrefix("/labor/services/kaigo-roumu", locale)} className="text-primary underline">介護・障害福祉の労務</Link>／
          <Link href={addLocalePrefix("/labor/services/joseikin", locale)} className="text-primary underline">雇用関係助成金</Link>／
          <Link href={addLocalePrefix("/labor/services/gaikokujin-koyo", locale)} className="text-primary underline">外国人雇用</Link>
          ）と<Link href={addLocalePrefix("/labor/ryokin", locale)} className="text-primary underline">料金</Link>もあわせてご覧ください。
        </p>

        {/* 署名（登録番号＝開業時確定まで非出力） */}
        <aside className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
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
      </main>

      <div className="mx-auto max-w-3xl px-4">
        <CtaBand businessKey="labor" />
      </div>
    </>
  );
}
