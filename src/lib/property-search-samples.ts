/**
 * 物件比較資料サンプル（5用途×4言語＝20本）のデータ。
 *
 * 2026-09-23：スマートフォンでPDFへ直接リンクすると元のページへ戻れなくなるため、
 * 閲覧はサイト内ビューア（/sample/[kind]）で行い、PDFはダウンロード用に残す。
 * クライアント部品（PropertySearchSample）とサーバーのビューアページの両方から使うため、
 * "use client" のファイルから切り出した（client モジュールの定数はサーバー側で値として読めない）。
 */
import type { LangCode } from "@/config/languages";
import pageManifest from "../../public/samples/property-search/pages/manifest.json";

export type PropertySearchSampleKind = "welfare" | "group-home" | "office" | "restaurant" | "investment";

export type SampleCopy = { tag: string; title: string; body: string; link: string; note: string; alt: string };

export const SAMPLE_ASSETS: Record<PropertySearchSampleKind, Record<LangCode, { pdf: string; preview: string }>> = {
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

export const SAMPLE_COPY: Record<PropertySearchSampleKind, Record<LangCode, SampleCopy>> = {
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

export const SAMPLE_KINDS = Object.keys(SAMPLE_ASSETS) as PropertySearchSampleKind[];

export function isSampleKind(value: string): value is PropertySearchSampleKind {
  return (SAMPLE_KINDS as string[]).includes(value);
}

/** ビューアのURL（ロケール接頭辞なし。呼び出し側で addLocalePrefix する） */
export function sampleViewerPath(kind: PropertySearchSampleKind): string {
  return `/sample/${kind}`;
}

/**
 * 直前のページが分からないとき（共有リンクから直接開いた等）の戻り先。
 * 各用途のサンプルを載せている主なページ。
 */
export const SAMPLE_FALLBACK_RETURN: Record<PropertySearchSampleKind, string> = {
  welfare: "/nagare#property-search",
  "group-home": "/group-home",
  office: "/office",
  restaurant: "/inshokuten",
  investment: "/toushi",
};

type ManifestEntry = { pages: number; width: number; height: number };
const MANIFEST = pageManifest as Record<string, ManifestEntry>;

export interface SamplePage {
  src: string;
  width: number;
  height: number;
  number: number;
}

/** PDFを書き出したページ画像の一覧（scripts/render-sample-pages.py の出力） */
export function samplePages(kind: PropertySearchSampleKind, locale: LangCode): SamplePage[] {
  const pdf = SAMPLE_ASSETS[kind][locale].pdf;
  const stem = pdf.replace(/^.*\//, "").replace(/\.pdf$/, "");
  const entry = MANIFEST[stem];
  if (!entry) return [];
  return Array.from({ length: entry.pages }, (_, i) => ({
    src: `/samples/property-search/pages/${stem}/${String(i + 1).padStart(2, "0")}.webp`,
    width: entry.width,
    height: entry.height,
    number: i + 1,
  }));
}

/** 戻り先を覚えておくキー（sessionStorage）。タブ単位で、共有リンク経由では空になる */
export const SAMPLE_RETURN_KEY = "yotsuba:sample-return";

export const SAMPLE_VIEWER_COPY: Record<
  LangCode,
  { back: string; download: string; pageLabel: string; downloadNote: string; pinchNote: string }
> = {
  ja: {
    back: "元のページに戻る",
    download: "PDFをダウンロード（保存・印刷用）",
    pageLabel: "ページ",
    downloadNote: "PDFはお使いの端末に保存されます。このページはそのまま表示されています。",
    pinchNote: "画像は指で拡大できます。",
  },
  en: {
    back: "Back to the previous page",
    download: "Download the PDF (to save or print)",
    pageLabel: "Page",
    downloadNote: "The PDF is saved to your device. This page stays open.",
    pinchNote: "Pinch to zoom into each page.",
  },
  "zh-tw": {
    back: "返回上一頁",
    download: "下載PDF（保存・列印用）",
    pageLabel: "頁",
    downloadNote: "PDF將儲存至您的裝置，本頁面仍會保持顯示。",
    pinchNote: "可用手指放大圖片。",
  },
  zh: {
    back: "返回上一页",
    download: "下载PDF（保存・打印用）",
    pageLabel: "页",
    downloadNote: "PDF将保存至您的设备，本页面仍会保持显示。",
    pinchNote: "可用手指放大图片。",
  },
};
