"use client";

import Image from "next/image";
import Link from "next/link";
import type { LangCode } from "@/config/languages";
import { gaEvent } from "@/lib/gtag";

const PDF = "/samples/property-search/property-search-sample.pdf";
const COPY: Record<LangCode, { tag: string; title: string; body: string; link: string; note: string; alt: string }> = {
  ja: { tag: "物件探しの進め方", title: "候補を、比べやすい一冊に。", body: "賃料だけでなく、初期費用・アクセス・間取り・確認事項まで。どんな資料を受け取り、どう絞り込むのかをご覧いただけます。", link: "探し方と9ページのサンプルを見る", note: "架空の物件による説明用サンプルです。募集中の物件ではありません。", alt: "架空の候補8件を比較する一覧表のサンプル" },
  en: { tag: "How your property search works", title: "Compare your options in one clear guide.", body: "See how we organize rent, estimated upfront costs, access, layouts and points to verify before narrowing down your options.", link: "View the process and 9-page sample (Japanese)", note: "All properties in the sample are fictional. These are not available listings.", alt: "Sample comparison table of eight fictional properties" },
  "zh-tw": { tag: "找物件的流程", title: "把候選物件，整理成好比較的一冊。", body: "從租金、預估初期費用、交通到格局與待確認事項，看看您會收到什麼資料，以及如何逐步篩選。", link: "查看流程與9頁範例（日文）", note: "範例中的物件皆為虛構，並非招租資訊。", alt: "八個虛構物件的比較表範例" },
  zh: { tag: "找房流程", title: "把候选房源，整理成便于比较的一册。", body: "从租金、预估前期费用、交通到户型与待确认事项，了解您会收到哪些资料，以及如何逐步筛选。", link: "查看流程与9页示例（日文）", note: "示例中的房源均为虚构，并非在租房源。", alt: "八个虚构房源的对比表示例" },
};

export function PropertySearchSampleTeaser({ locale = "ja", page }: { locale?: LangCode; page: string }) {
  const t = COPY[locale];
  return (
    <section aria-label={t.tag} className="my-10 grid overflow-hidden rounded-2xl border border-primary/20 bg-primary-tint md:grid-cols-[1fr_230px]">
      <div className="p-6 sm:p-8">
        <p className="text-xs font-bold tracking-widest text-primary-dark">{t.tag}</p>
        <h2 className="mt-3 font-serif text-2xl font-semibold leading-snug text-ink sm:text-3xl">{t.title}</h2>
        <p className="mt-4 max-w-xl text-sm leading-7 text-text">{t.body}</p>
        <Link href="/nagare#property-search" onClick={() => gaEvent("property_search_sample_click", { page, location: "teaser" })} className="mt-5 inline-flex min-h-12 items-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
          {t.link}<span aria-hidden="true" className="ml-3">→</span>
        </Link>
        <p className="mt-3 text-xs leading-5 text-text-muted">{t.note}</p>
      </div>
      <div className="flex items-center justify-center bg-white/50 p-6">
        <Image src="/samples/property-search/preview.webp" alt={t.alt} width={707} height={1000} sizes="(min-width: 768px) 190px, 200px" className="h-auto w-44 rounded-sm border border-border shadow-md" />
      </div>
    </section>
  );
}

const STEPS = [
  ["01", "ご希望と、開設の計画を伺います", "エリア・賃料・面積・階数・開設時期に加え、利用人数・時間帯・送迎などを整理します。法人や資金計画の準備状況も、必要に応じて確認します。"],
  ["02", "候補を一覧と詳細資料でご提案", "賃料、契約初期費用の概算、アクセスを一覧に。候補ごとの詳細には、取得できた写真・間取りと確認事項をまとめます。掲載枚数や内容は候補・資料の取得状況によって変わります。"],
  ["03", "気になる物件の条件を確認します", "ご関心のある候補をお知らせください。募集状況、オーナーの用途承諾、改装・送迎条件を確認します。福祉施設等は、指定担当・建築・消防の窓口や専門家への事前相談も進めます。"],
  ["04", "内見と、必要な工事・費用の確認", "写真では分からない段差・動線・周辺環境を確認します。必要に応じて設備業者等に調査・見積もりを依頼し、賃料以外の費用も検討します。"],
  ["05", "申込み・審査・契約へ", "法人資料、事業計画、資金を確認できる資料など、貸主・保証会社が求める書類を準備します。事業利用の条件や工事負担を確認し、重要事項説明・契約・引渡しへ進みます。"],
];

export function PropertySearchSampleSection() {
  return (
    <section id="property-search" aria-labelledby="property-search-heading" className="scroll-mt-28 space-y-7">
      <div>
        <p className="text-sm font-semibold text-primary-dark">借りる方へ｜事業用・福祉施設の物件探し</p>
        <h2 id="property-search-heading" className="mt-2 font-serif text-2xl font-semibold text-ink">物件探しは、どのように進みますか？</h2>
        <p className="mt-3 leading-7 text-text">希望条件を伺い、候補を比較できる資料にまとめ、ご関心のある物件から確認を進めます。放課後等デイサービスなどの福祉施設では、用途・設備の条件を契約前に確認することが大切です。</p>
      </div>
      <div className="grid gap-6 rounded-2xl border border-primary/20 bg-primary-tint p-5 sm:p-7 md:grid-cols-[200px_1fr]">
        <Image src="/samples/property-search/preview.webp" alt="架空の候補8件の賃料・初期費用・アクセスを整理した一覧表" width={707} height={1000} sizes="200px" className="mx-auto h-auto w-48 border border-border bg-white shadow-md" />
        <div className="self-center">
          <p className="text-xs font-bold tracking-widest text-primary-dark">一覧1ページ ＋ 詳細8ページ</p>
          <h3 className="mt-3 text-xl font-semibold text-ink">ご提案資料のサンプル</h3>
          <p className="mt-3 text-sm leading-7 text-text">物件情報をどのように整理するか、全9ページでご覧いただけます。図は説明用イラスト・配置イメージです。実際のご提案では、取得できた写真や間取りを使用します。</p>
          <p className="mt-3 rounded-lg bg-white p-3 text-sm font-semibold leading-6 text-primary-dark">物件・金額・アクセスはすべて架空です。募集中の物件や、開設可能と確認された物件の紹介ではありません。</p>
          <a href={PDF} onClick={() => gaEvent("property_search_sample_pdf_open", { page: "/nagare", location: "property-search" })} className="mt-5 inline-flex min-h-12 items-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">サンプルPDFを見る（9ページ・日本語）<span className="ml-2" aria-hidden="true">→</span></a>
          <p className="mt-2 text-xs text-text-muted">同じタブで開きます。ブラウザの「戻る」でこのページへ戻れます。保存・印刷もできます。</p>
        </div>
      </div>
      <ol className="space-y-4">
        {STEPS.map(([n, title, body]) => (
          <li key={n} className="flex gap-4 rounded-xl border border-border bg-surface p-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-tint text-sm font-bold text-primary-dark" aria-hidden="true">{n}</span>
            <div><h3 className="font-semibold text-ink">{title}</h3><p className="mt-2 text-sm leading-7 text-text">{body}</p></div>
          </li>
        ))}
      </ol>
      <div className="rounded-xl border-l-4 border-primary bg-primary-tint p-5 text-sm leading-7 text-text">
        <p className="font-semibold text-ink">候補をご案内した段階では、用途承諾や設備の確認が未了の場合があります。</p>
        <p className="mt-2">資料には確認状況を明記します。消防設備の対応が借りる区画だけで済むか、建物全体に及ぶかなども個別に確認します。物件のご紹介は、指定・許認可や審査通過を保証するものではありません。</p>
        <p className="mt-2">初期費用の概算には、改装・消防工事・造作代・運転資金などが含まれない場合があります。個別の判断は資格者・関係窓口への確認を踏まえて行います。</p>
      </div>
      <p className="text-sm leading-7 text-text-muted">物件の紹介・仲介は四葉不動産株式会社が担当します。指定申請書類の作成などを依頼される場合は、四葉行政書士事務所等と別契約・別料金になります。既にご依頼中の専門家がいる場合も、その体制を伺って進めます。</p>
      <div className="flex flex-wrap gap-3">
        <Link href="/line" className="inline-flex min-h-12 items-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-dark" onClick={() => gaEvent("cta_line_click", { page: "/nagare", location: "property-search" })}>LINEで希望条件を伝える</Link>
        <Link href="/contact?intent=bukken" className="inline-flex min-h-12 items-center rounded-lg border border-primary px-5 py-3 text-sm font-semibold text-primary-dark hover:bg-primary-tint">フォームで物件探しを相談する</Link>
      </div>
    </section>
  );
}
