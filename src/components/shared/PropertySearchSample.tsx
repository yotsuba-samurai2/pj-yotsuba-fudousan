"use client";

import Image from "next/image";
import Link from "next/link";
import type { LangCode } from "@/config/languages";
import { gaEvent } from "@/lib/gtag";

export type PropertySearchSampleKind = "welfare" | "group-home" | "office" | "restaurant" | "investment";

type SampleCopy = { tag: string; title: string; body: string; link: string; note: string; alt: string };

const ASSETS: Record<PropertySearchSampleKind, Record<LangCode, { pdf: string; preview: string }>> = {
  welfare: {
    ja: { pdf: "/samples/property-search/property-search-sample.pdf", preview: "/samples/property-search/preview.webp" },
    en: { pdf: "/samples/property-search/property-search-sample-en.pdf", preview: "/samples/property-search/property-search-preview-en.webp" },
    "zh-tw": { pdf: "/samples/property-search/property-search-sample-zh-tw.pdf", preview: "/samples/property-search/property-search-preview-zh-tw.webp" },
    zh: { pdf: "/samples/property-search/property-search-sample-zh.pdf", preview: "/samples/property-search/property-search-preview-zh.webp" },
  },
  "group-home": {
    ja: { pdf: "/samples/property-search/group-home-sample-ja.pdf", preview: "/samples/property-search/group-home-preview-ja.webp" },
    en: { pdf: "/samples/property-search/group-home-sample-en.pdf", preview: "/samples/property-search/group-home-preview-en.webp" },
    "zh-tw": { pdf: "/samples/property-search/group-home-sample-zh-tw.pdf", preview: "/samples/property-search/group-home-preview-zh-tw.webp" },
    zh: { pdf: "/samples/property-search/group-home-sample-zh.pdf", preview: "/samples/property-search/group-home-preview-zh.webp" },
  },
  office: {
    ja: { pdf: "/samples/property-search/office-sample-ja.pdf", preview: "/samples/property-search/office-preview-ja.webp" },
    en: { pdf: "/samples/property-search/office-sample-en.pdf", preview: "/samples/property-search/office-preview-en.webp" },
    "zh-tw": { pdf: "/samples/property-search/office-sample-zh-tw.pdf", preview: "/samples/property-search/office-preview-zh-tw.webp" },
    zh: { pdf: "/samples/property-search/office-sample-zh.pdf", preview: "/samples/property-search/office-preview-zh.webp" },
  },
  restaurant: {
    ja: { pdf: "/samples/property-search/restaurant-sample-ja.pdf", preview: "/samples/property-search/restaurant-preview-ja.webp" },
    en: { pdf: "/samples/property-search/restaurant-sample-en.pdf", preview: "/samples/property-search/restaurant-preview-en.webp" },
    "zh-tw": { pdf: "/samples/property-search/restaurant-sample-zh-tw.pdf", preview: "/samples/property-search/restaurant-preview-zh-tw.webp" },
    zh: { pdf: "/samples/property-search/restaurant-sample-zh.pdf", preview: "/samples/property-search/restaurant-preview-zh.webp" },
  },
  investment: {
    ja: { pdf: "/samples/property-search/investment-sample-ja.pdf", preview: "/samples/property-search/investment-preview-ja.webp" },
    en: { pdf: "/samples/property-search/investment-sample-en.pdf", preview: "/samples/property-search/investment-preview-en.webp" },
    "zh-tw": { pdf: "/samples/property-search/investment-sample-zh-tw.pdf", preview: "/samples/property-search/investment-preview-zh-tw.webp" },
    zh: { pdf: "/samples/property-search/investment-sample-zh.pdf", preview: "/samples/property-search/investment-preview-zh.webp" },
  },
};

const COPY: Record<PropertySearchSampleKind, Record<LangCode, SampleCopy>> = {
  welfare: {
    ja: { tag: "通所系福祉施設の物件探し", title: "候補を、開設条件で比べる。", body: "活動室、相談・事務スペース、送迎動線、貸主承諾、建築・消防の確認状況まで整理した資料です。", link: "通所系福祉施設版を見る（9ページ）", note: "物件・金額・配置はすべて架空です。募集中物件の広告ではありません。", alt: "通所系福祉施設向けの架空候補8件を比較する一覧表" },
    en: { tag: "Sites for day-care welfare services", title: "Compare options against your opening requirements.", body: "The sample organizes activity, consultation and admin space, pick-up flow, owner consent, building-use and fire-safety checks.", link: "View the 9-page welfare sample", note: "All properties, figures and layouts are fictional. This is not an available listing.", alt: "Comparison of eight fictional sites for day-care welfare services" },
    "zh-tw": { tag: "通所型福祉設施找物件", title: "依開設條件比較候選物件。", body: "整理活動室、諮詢與辦公空間、接送動線、屋主同意、建築用途及消防確認狀況。", link: "查看通所型福祉設施版（9頁）", note: "物件、金額與配置均為虛構，並非招租廣告。", alt: "通所型福祉設施用八個虛構候選物件比較表" },
    zh: { tag: "日间照护型福利设施找物件", title: "按开设条件对比候选物件。", body: "整理活动室、咨询与办公空间、接送动线、业主同意、建筑用途及消防确认情况。", link: "查看日间照护型福利设施版（9页）", note: "物件、金额与布局均为虚构，并非招租广告。", alt: "日间照护型福利设施八个虚构候选物件对比表" },
  },
  "group-home": {
    ja: { tag: "障害者グループホームの物件探し", title: "居室と共用部を、運営の目線で比べる。", body: "居室数・有効面積、食堂・居間、浴室・便所、夜間支援の動線、貸主承諾と消防確認を一冊にまとめます。", link: "グループホーム版を見る（9ページ）", note: "物件・金額・配置はすべて架空です。指定や開設を保証する資料ではありません。", alt: "障害者グループホーム向けの架空候補8件を比較する一覧表" },
    en: { tag: "Finding a disability group home", title: "Compare bedrooms and shared spaces through an operator’s lens.", body: "Review room count and usable area, shared living space, baths and toilets, night-support flow, owner consent and fire-safety checks.", link: "View the 9-page group-home sample", note: "All properties, figures and layouts are fictional. Designation or opening is not guaranteed.", alt: "Comparison of eight fictional disability group-home properties" },
    "zh-tw": { tag: "身心障礙者團體家屋找物件", title: "從營運角度比較居室與共用空間。", body: "比較居室數與有效面積、餐廳與起居室、浴廁、夜間支援動線、屋主同意及消防確認。", link: "查看團體家屋版（9頁）", note: "物件、金額與配置均為虛構，不保證取得指定或開設。", alt: "身心障礙者團體家屋用八個虛構候選物件比較表" },
    zh: { tag: "残障者团体家屋找物件", title: "从运营角度对比卧室与共用空间。", body: "对比卧室数量与有效面积、餐厅与起居室、浴厕、夜间支援动线、业主同意及消防确认。", link: "查看团体家屋版（9页）", note: "物件、金额与布局均为虚构，不保证取得指定或开设。", alt: "残障者团体家屋八个虚构候选物件对比表" },
  },
  office: {
    ja: { tag: "オフィス移転の物件探し", title: "賃料の先まで、働き方で比べる。", body: "法人登記、光回線、電源、会議室、個別空調、利用時間、来客・搬出入ルールまで比較します。", link: "オフィス版を見る（9ページ）", note: "物件・金額・配置はすべて架空です。募集中物件の広告ではありません。", alt: "オフィス向けの架空候補8件を比較する一覧表" },
    en: { tag: "Finding your next office", title: "Compare more than rent: compare how you work.", body: "Review company registration, fiber, power, meeting rooms, HVAC, access hours, visitors and delivery rules.", link: "View the 9-page office sample", note: "All properties, figures and layouts are fictional. This is not an available listing.", alt: "Comparison of eight fictional office properties" },
    "zh-tw": { tag: "辦公室搬遷找物件", title: "不只看租金，也比較工作方式。", body: "比較公司登記、光纖、電力、會議室、獨立空調、使用時間及訪客與搬運規則。", link: "查看辦公室版（9頁）", note: "物件、金額與配置均為虛構，並非招租廣告。", alt: "辦公室用八個虛構候選物件比較表" },
    zh: { tag: "办公室搬迁找物件", title: "不只看租金，也对比办公方式。", body: "对比公司登记、光纤、电力、会议室、独立空调、使用时间及访客与搬运规则。", link: "查看办公室版（9页）", note: "物件、金额与布局均为虚构，并非招租广告。", alt: "办公室八个虚构候选物件对比表" },
  },
  restaurant: {
    ja: { tag: "飲食店出店の物件探し", title: "厨房と設備条件から、候補を絞る。", body: "飲食用途の承諾、排気・ダクト、給排水、グリストラップ、電気・ガス、営業時間と造作条件を比べます。", link: "飲食店版を見る（9ページ）", note: "物件・金額・配置はすべて架空です。営業許可や出店を保証する資料ではありません。", alt: "飲食店向けの架空候補8件を比較する一覧表" },
    en: { tag: "Finding a restaurant site", title: "Narrow options through kitchen and utility requirements.", body: "Compare restaurant-use consent, exhaust routes, water, grease traps, power, gas, operating hours and fixtures.", link: "View the 9-page restaurant sample", note: "All properties, figures and layouts are fictional. Permits or opening are not guaranteed.", alt: "Comparison of eight fictional restaurant properties" },
    "zh-tw": { tag: "餐飲店展店找物件", title: "從廚房與設備條件篩選候選物件。", body: "比較餐飲用途同意、排氣風管、給排水、截油槽、電力瓦斯、營業時間與設備讓渡。", link: "查看餐飲店版（9頁）", note: "物件、金額與配置均為虛構，不保證取得營業許可或順利開店。", alt: "餐飲店用八個虛構候選物件比較表" },
    zh: { tag: "餐饮店开店找物件", title: "从厨房与设备条件筛选候选物件。", body: "对比餐饮用途同意、排烟风管、给排水、隔油池、电力燃气、营业时间与设备转让。", link: "查看餐饮店版（9页）", note: "物件、金额与布局均为虚构，不保证取得营业许可或顺利开店。", alt: "餐饮店八个虚构候选物件对比表" },
  },
  investment: {
    ja: { tag: "投資用不動産の物件選び", title: "利回りの内側まで、並べて比べる。", body: "価格・表面利回りに加え、稼働、運営費、NOI、修繕、遵法性、融資と出口の想定を整理します。", link: "投資物件版を見る（9ページ）", note: "物件・価格・収支はすべて架空です。将来の収益や融資を保証する資料ではありません。", alt: "投資用不動産の架空候補8件を比較する一覧表" },
    en: { tag: "Choosing an investment property", title: "Compare what sits behind the headline yield.", body: "Review price and gross yield alongside occupancy, opex, NOI, repairs, compliance, financing and exit assumptions.", link: "View the 9-page investment sample", note: "All properties, prices and figures are fictional. Returns or financing are not guaranteed.", alt: "Comparison of eight fictional investment properties" },
    "zh-tw": { tag: "選擇投資用不動產", title: "比較表面報酬率背後的內容。", body: "除價格與表面報酬率外，也整理稼動、營運費、NOI、修繕、法規、融資與退出假設。", link: "查看投資物件版（9頁）", note: "物件、價格與收支均為虛構，不保證未來收益或融資。", alt: "投資用不動產八個虛構候選物件比較表" },
    zh: { tag: "选择投资用不动产", title: "对比表面收益率背后的内容。", body: "除价格与表面收益率外，也整理出租率、运营费、NOI、修缮、法规、融资与退出假设。", link: "查看投资物件版（9页）", note: "物件、价格与收支均为虚构，不保证未来收益或融资。", alt: "投资用不动产八个虚构候选物件对比表" },
  },
};

export function PropertySearchSampleTeaser({ kind, locale = "ja", page }: { kind: PropertySearchSampleKind; locale?: LangCode; page: string }) {
  const t = COPY[kind][locale];
  const asset = ASSETS[kind][locale];
  return (
    <section aria-label={t.tag} className="my-10 grid overflow-hidden rounded-2xl border border-primary/20 bg-primary-tint md:grid-cols-[1fr_230px]">
      <div className="p-6 sm:p-8">
        <p className="text-xs font-bold tracking-widest text-primary-dark">{t.tag}</p>
        <h2 className="mt-3 font-serif text-2xl font-semibold leading-snug text-ink sm:text-3xl">{t.title}</h2>
        <p className="mt-4 max-w-xl text-sm leading-7 text-text">{t.body}</p>
        <a href={asset.pdf} onClick={() => gaEvent("property_search_sample_pdf_open", { page, location: "teaser", kind, locale })} className="mt-5 inline-flex min-h-12 items-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
          {t.link}<span aria-hidden="true" className="ml-3">→</span>
        </a>
        <p className="mt-3 text-xs leading-5 text-text-muted">{t.note}</p>
      </div>
      <div className="flex items-center justify-center bg-white/50 p-6">
        <Image src={asset.preview} alt={t.alt} width={707} height={1000} sizes="(min-width: 768px) 190px, 200px" className="h-auto w-44 rounded-sm border border-border shadow-md" />
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
          <a href={ASSETS.welfare.ja.pdf} onClick={() => gaEvent("property_search_sample_pdf_open", { page: "/nagare", location: "property-search", kind: "welfare", locale: "ja" })} className="mt-5 inline-flex min-h-12 items-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">通所系福祉施設版PDFを見る（9ページ）<span className="ml-2" aria-hidden="true">→</span></a>
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
