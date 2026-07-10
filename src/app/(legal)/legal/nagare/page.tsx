// ★参考ページ（型D・受任フロー/HowTo）＝ /legal/nagare　※原稿_行政書士 #8
// 配置＝src/app/(legal)/legal/nagare/page.tsx。JSON-LD＝HowTo＋BreadcrumbList。フロー図が主役（ヒーロー画像なし）。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { CtaBand } from "@/components/shared/CtaBand";

const SITE = "https://luck428.com";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "legal",
    title: "ご相談から完了までの流れ｜四葉行政書士事務所",
    description:
      "四葉行政書士事務所にご依頼いただく流れを、相談・見積り・受任・着手・申請・完了の6段階でご説明します。オンライン相談にも対応。費用が発生するタイミングと、ご準備いただく書類の目安もあわせてご案内します。",
    path: "/legal/nagare",
    locale,
    absoluteTitle: true,
  });
}

const STEPS: { name: string; text: React.ReactNode }[] = [
  { name: "ご相談", text: <>現状とご希望を伺い、論点を整理します（初回相談は無料、以降は原則30分5,500円〈税込〉）。</> },
  { name: "お見積り", text: <>業務範囲と報酬を書面でご提示します。</> },
  { name: "ご契約（受任）", text: <>内容にご納得いただいてから契約します。</> },
  { name: "着手（書類作成）", text: <>必要書類の収集・作成を進めます。ご準備いただくものは業務ごとにご案内します。</> },
  { name: "申請・提出", text: <>行政庁へ申請・提出し、照会に対応します。標準的な所要期間は業務ごとにご案内します。</> },
  { name: "完了・フォロー", text: <>許可・指定の取得、書類の納品。必要に応じて事後の手続きもサポートします。</> },
];

// HowTo は確定文言のみ（【要確認】の括弧内は構造化データに含めない）
const HOWTO_TEXT: Record<string, string> = {
  "ご相談": "現状とご希望を伺い、論点を整理します。",
  "お見積り": "業務範囲と報酬を書面でご提示します。",
  "ご契約（受任）": "内容にご納得いただいてから契約します。",
  "着手（書類作成）": "必要書類の収集・作成を進めます。",
  "申請・提出": "行政庁へ申請・提出し、照会に対応します。",
  "完了・フォロー": "許可・指定の取得、書類の納品。必要に応じて事後の手続きもサポートします。",
};

function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HowTo",
        name: "四葉行政書士事務所 ご相談から完了までの流れ",
        step: STEPS.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: HOWTO_TEXT[s.name] })),
      },
      // BreadcrumbList は <Breadcrumb> 部品が出力（二重を避ける）
    ],
  };
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }} />
      <Breadcrumb items={[{ name: "ホーム", href: "/legal" }, { name: "受任の流れ" }]} />

      <main className="mx-auto max-w-3xl px-4 pb-16">
        <header className="pt-2">
          <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">ご相談から完了までの流れ</h1>
          <p className="mt-3 leading-relaxed text-text">
            四葉行政書士事務所へのご依頼は、<strong>①ご相談 → ②お見積り → ③ご契約（受任）→ ④着手（書類作成）→ ⑤申請・提出 → ⑥完了・フォロー</strong>の6段階で進みます。オンライン相談にも対応します。費用は、初回相談が無料（以降は原則30分5,500円〈税込〉）、業務は書面でのお見積り・ご契約後に着手します。
          </p>
        </header>

        {/* フロー図（6ステップ・縦ステッパー＝型Dの主役） */}
        <ol className="mt-6 space-y-4">
          {STEPS.map((s, i) => (
            <li key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-white">{i + 1}</span>
                {i < STEPS.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
              </div>
              <div className="pb-2">
                <div className="font-serif text-base font-semibold text-ink">{s.name}</div>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <blockquote className="mt-6 border-l-4 border-primary bg-primary-tint p-3 text-sm leading-relaxed text-text">
          ※所要期間・準備物・費用発生のタイミングは業務により異なります。各業務ページ（
          <Link href="/legal/services/shogai-fukushi" className="text-primary underline">障害福祉</Link>／
          <Link href="/legal/services/visa" className="text-primary underline">在留資格</Link>／
          <Link href="/legal/services/inheritance" className="text-primary underline">相続</Link>／
          <Link href="/legal/services/company" className="text-primary underline">会社設立</Link>／
          <Link href="/legal/services/subsidy" className="text-primary underline">補助金</Link>）と
          <Link href="/legal/ryokin" className="text-primary underline">報酬額表</Link>もあわせてご覧ください。
        </blockquote>
      </main>

      <div className="mx-auto max-w-3xl px-4">
        <CtaBand businessKey="legal" />
      </div>
    </>
  );
}
