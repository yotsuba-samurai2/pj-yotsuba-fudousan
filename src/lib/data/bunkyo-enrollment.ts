// 文京区立小学校 児童数（各年5月1日現在）。3S1K の4校だけを持つ。
// 出典：文京区「区立小・中学校 児童・生徒数」令和3年度・令和8年度（PDF）。
// 2026-09-23 浦松がPDFを提供し、文字データと画像の両方で照合して転記した。
// 4校とも両年度に特別支援学級の行はなく、「合計・計」の欄をそのまま使う。
export const ENROLLMENT_SOURCE = {
  /** 各年度のPDFが並ぶ区のページ */
  url: "https://www.city.bunkyo.lg.jp/b048/p007694.html",
  title: "文京区「区立小・中学校 児童・生徒数」",
  publisher: "文京区",
  baseYear: 2021,
  latestYear: 2026,
  asOf: "05-01",
} as const;

/** 学校 slug → 年 → 児童数 */
export const ENROLLMENT: Record<string, { 2021: number; 2026: number }> = {
  seishi: { 2021: 766, 2026: 941 },
  showa: { 2021: 766, 2026: 792 },
  sendagi: { 2021: 788, 2026: 773 },
  kubomachi: { 2021: 886, 2026: 994 },
};

export function enrollmentChange(slug: string) {
  const e = ENROLLMENT[slug];
  if (!e) return undefined;
  const diff = e[2026] - e[2021];
  return { latest: e[2026], base: e[2021], diff, rate: Math.round((diff / e[2021]) * 1000) / 10 };
}
