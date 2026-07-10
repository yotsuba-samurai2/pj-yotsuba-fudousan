// /labor/nagare（型D・受任フロー/HowTo）＝原稿_社労士 #6（開業後公開・SR_LAUNCHED=falseの間は404）
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
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
  { name: "ご相談", text: "現状とお困りごとを伺い、論点を整理します。" },
  { name: "現状整理・お見積り", text: "労務の現状を確認し、業務範囲と料金を書面でご提示します。" },
  { name: "ご契約（顧問／スポット）", text: "内容にご納得いただいてから契約します。" },
  { name: "着手", text: "必要書類の収集・規程の整備・手続きの準備を進めます。" },
  { name: "手続き・届出", text: "行政機関への手続き・届出を行い、照会に対応します。" },
  { name: "報告・フォロー", text: "完了のご報告と、必要に応じて事後のフォローを行います。" },
];

export default function Page() {
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
            ご依頼は{" "}
            <strong>
              ①ご相談 → ②現状整理・お見積り → ③ご契約（顧問／スポット） → ④着手 → ⑤手続き・届出 → ⑥報告・フォロー
            </strong>{" "}
            の順に進みます。オンライン相談にも対応します。
            <Placeholder reason="浦松＝各ステップの実運用・相談料・標準期間" />
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

        <p className="mt-8 text-sm text-text-muted">
          ※所要期間・準備物・費用発生のタイミングは業務により異なります。各業務ページ（
          <Link href="/labor/services/shogu-kaizen" className="text-primary underline">処遇改善加算</Link>／
          <Link href="/labor/services/kaigo-roumu" className="text-primary underline">介護・障害福祉の労務</Link>／
          <Link href="/labor/services/joseikin" className="text-primary underline">雇用関係助成金</Link>／
          <Link href="/labor/services/gaikokujin-koyo" className="text-primary underline">外国人雇用</Link>
          ）と<Link href="/labor/ryokin" className="text-primary underline">料金</Link>もあわせてご覧ください。
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
