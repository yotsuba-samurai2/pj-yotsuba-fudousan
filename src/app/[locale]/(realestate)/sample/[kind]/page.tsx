// /sample/[kind]＝物件比較資料サンプルのサイト内ビューア（2026-09-23）。
//
// なぜ作ったか：スマートフォンでPDFへ直接リンクすると、元のページへ戻れなくなる。
//   Android Chrome はPDFを表示できず外部アプリへ渡し、LINE等のアプリ内ブラウザは全画面表示で
//   戻る操作が見つからず、iOS Safari はPDF表示中にツールバーが隠れる。PR #382 で同じタブ表示に
//   したが、ブラウザの戻る操作に頼る限り解消しなかった。
// 方式：PDFを書き出したページ画像（scripts/render-sample-pages.py）をこのページで縦に並べ、
//   上下に「元のページに戻る」を置く。PDFは download 属性つきで保存・印刷用に残す（遷移しない）。
// 索引：画像だけの薄いページのため noindex。sitemap にも載せない。
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { LangCode } from "@/config/languages";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import { SampleBackButton } from "@/components/shared/SampleBackButton";
import {
  SAMPLE_ASSETS,
  SAMPLE_COPY,
  SAMPLE_FALLBACK_RETURN,
  SAMPLE_KINDS,
  SAMPLE_VIEWER_COPY,
  isSampleKind,
  samplePages,
} from "@/lib/property-search-samples";

/** 4ロケールとも資料が存在する */
const PAGE_LOCALES: LangCode[] = ["ja", "en", "zh-tw", "zh"];

// 用途は5種類で固定。未知の値は404（ページ単位の指定。レイアウトには置かない）
export const dynamicParams = false;

export function generateStaticParams() {
  return SAMPLE_KINDS.map((kind) => ({ kind }));
}

type Props = { params: Promise<{ kind: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kind } = await params;
  const locale = await getRequestLocale();
  if (!isSampleKind(kind)) return { robots: { index: false, follow: false } };
  const t = SAMPLE_COPY[kind][locale] ?? SAMPLE_COPY[kind].ja;
  return buildPageMetadata({
    businessKey: "realestate",
    title: t.tag,
    description: t.body,
    path: `/sample/${kind}`,
    locale,
    noindex: true,
    availableLocales: PAGE_LOCALES,
  });
}

const BUTTON_PRIMARY =
  "inline-flex min-h-12 items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";
const BUTTON_SECONDARY =
  "inline-flex min-h-12 items-center rounded-lg border border-primary px-5 py-3 text-sm font-semibold text-primary-dark hover:bg-primary-tint";

export default async function SampleViewerPage({ params }: Props) {
  const { kind } = await params;
  if (!isSampleKind(kind)) notFound();
  const locale = await getRequestLocale();
  const t = SAMPLE_COPY[kind][locale] ?? SAMPLE_COPY[kind].ja;
  const v = SAMPLE_VIEWER_COPY[locale] ?? SAMPLE_VIEWER_COPY.ja;
  const pdf = SAMPLE_ASSETS[kind][locale].pdf;
  const pages = samplePages(kind, locale);
  const fallbackHref = addLocalePrefix(SAMPLE_FALLBACK_RETURN[kind], locale);

  return (
    <article className="mx-auto max-w-3xl pb-16">
      {/* 固定ヘッダー（h-16 / sm:h-20）の直下に張り付く戻るバー */}
      <div className="sticky top-16 z-30 border-b border-border bg-surface/95 px-4 py-3 backdrop-blur sm:top-20">
        <SampleBackButton fallbackHref={fallbackHref} label={v.back} className={BUTTON_PRIMARY} />
      </div>

      <header className="px-4 pt-6">
        <p className="text-xs font-bold tracking-widest text-primary-dark">{t.tag}</p>
        <h1 className="mt-2 font-serif text-2xl font-semibold leading-snug text-ink">{t.title}</h1>
        <p className="mt-3 text-sm leading-7 text-text">{t.body}</p>
        <p className="mt-3 rounded-lg bg-primary-tint p-3 text-sm font-semibold leading-6 text-primary-dark">
          {t.note}
        </p>
        <p className="mt-3 text-xs text-text-muted">{v.pinchNote}</p>
      </header>

      <ol className="mt-6 space-y-4 px-2 sm:px-4">
        {pages.map((page) => (
          <li key={page.src}>
            {/* 事前に1100px幅へ書き出したwebp（1枚約40KB）。Vercel画像最適化は使わない */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={page.src}
              alt={`${t.alt}（${page.number}/${pages.length}${v.pageLabel}）`}
              width={page.width}
              height={page.height}
              loading={page.number === 1 ? "eager" : "lazy"}
              decoding="async"
              className="h-auto w-full rounded border border-border bg-white shadow-sm"
            />
          </li>
        ))}
      </ol>

      <footer className="mt-8 space-y-3 px-4">
        <div className="flex flex-wrap gap-3">
          <SampleBackButton fallbackHref={fallbackHref} label={v.back} className={BUTTON_PRIMARY} />
          <a href={pdf} download className={BUTTON_SECONDARY}>
            {v.download}
          </a>
        </div>
        <p className="text-xs leading-6 text-text-muted">{v.downloadNote}</p>
      </footer>
    </article>
  );
}
