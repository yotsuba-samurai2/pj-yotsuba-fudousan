// A-4 cross-links.ts — 事業間クロスリンクの一元定義（正本＝内部リンク一覧と要確認集約_3サイト_v1.md §2）
// 実装時はこの表のとおりに a タグを張る（曖昧アンカー「こちら」禁止）。将来 Firestore へ。
// 開業日開通(C7〜C14)は launchFlag:"SR_LAUNCHED" ＝ フラグ false の間は描画しない（社労士の露出防止）。
// 全リンクに「独立受任注記」を添付（別事業体・紹介料等の授受なし＝非弁・業際配慮）。
import type { BusinessKey } from "@/lib/shared/office";

export type CrossTarget = { href: string; anchor: string; business: BusinessKey };
export type CrossLink = {
  id: string;
  from: string[]; // このパスのページに表示（末尾一致で判定・locale接頭辞は判定側で除去）
  targets: CrossTarget[];
  launchFlag?: "SR_LAUNCHED";
};

// 他事業体リンク直下に一字一句同一で添える（原稿サイト共通・正本）
export const INDEPENDENT_NOTE =
  "※四葉不動産株式会社・四葉行政書士事務所は、それぞれ別の事業体として独立してご依頼をお受けします（紹介料等の授受はありません）。";

// 社労士が関与するリンク用（開業後のみ表示される文脈・原稿_社労士v1.0サイト共通）
export const INDEPENDENT_NOTE_TRIPLE =
  "※四葉不動産株式会社・四葉行政書士事務所・四葉社会保険労務士事務所は、それぞれ別の事業体として独立してご依頼をお受けします（紹介料等の授受はありません）。";

export const CROSS_LINKS: CrossLink[] = [
  // ── 即時開通（C1〜C6） ──
  { id: "C1", from: ["/legal/services/inheritance"], targets: [{ href: "/souzoku", anchor: "文京区で不動産を相続したら——管理・活用・売却の完全ガイド（四葉不動産）", business: "realestate" }] },
  { id: "C2", from: ["/legal/services/shogai-fukushi"], targets: [{ href: "/toushi/group-home", anchor: "グループホームに使える物件探し（四葉不動産）", business: "realestate" }] },
  { id: "C3", from: ["/toushi", "/toushi/group-home"], targets: [{ href: "/legal/services/shogai-fukushi", anchor: "障害福祉サービスの指定申請（四葉行政書士事務所）", business: "legal" }] },
  { id: "C4", from: ["/legal/services/visa"], targets: [{ href: "/toushi/shataku", anchor: "社宅・法人賃貸のサポート（四葉不動産）", business: "realestate" }] },
  { id: "C5", from: ["/legal/services/visa"], targets: [{ href: "/global", anchor: "外国人・多言語のお部屋探し（四葉不動産）", business: "realestate" }] },
  { id: "C6", from: ["/toushi/shataku", "/global"], targets: [{ href: "/legal/services/visa", anchor: "在留資格・ビザ申請（四葉行政書士事務所）", business: "legal" }] },

  // ── 開業日開通（C7〜C14・SR_LAUNCHED） ──
  { id: "C7", from: ["/legal/ryokin"], launchFlag: "SR_LAUNCHED", targets: [{ href: "/labor/ryokin", anchor: "労務・処遇改善加算・雇用関係助成金の料金（四葉社会保険労務士事務所）", business: "labor" }] },
  { id: "C8", from: ["/labor/ryokin"], launchFlag: "SR_LAUNCHED", targets: [{ href: "/legal/ryokin", anchor: "四葉行政書士事務所の報酬額表", business: "legal" }] },
  { id: "C9", from: ["/legal/services/shogai-fukushi"], launchFlag: "SR_LAUNCHED", targets: [
      { href: "/labor/services/shogu-kaizen", anchor: "処遇改善加算のサポート（四葉社会保険労務士事務所）", business: "labor" },
      { href: "/labor/services/kaigo-roumu", anchor: "介護・障害福祉の労務管理（四葉社会保険労務士事務所）", business: "labor" },
    ] },
  { id: "C10", from: ["/labor/services/shogu-kaizen", "/labor/services/kaigo-roumu"], launchFlag: "SR_LAUNCHED", targets: [{ href: "/legal/services/shogai-fukushi", anchor: "障害福祉サービスの指定申請（四葉行政書士事務所）", business: "legal" }] },
  { id: "C11", from: ["/legal/services/subsidy"], launchFlag: "SR_LAUNCHED", targets: [{ href: "/labor/services/joseikin", anchor: "雇用関係助成金の申請（四葉社会保険労務士事務所）", business: "labor" }] },
  { id: "C12", from: ["/labor/services/joseikin"], launchFlag: "SR_LAUNCHED", targets: [{ href: "/legal/services/subsidy", anchor: "補助金申請サポート（四葉行政書士事務所）", business: "legal" }] },
  { id: "C13", from: ["/labor/services/kaigo-roumu", "/labor"], launchFlag: "SR_LAUNCHED", targets: [{ href: "/toushi/group-home", anchor: "グループホームに使える物件探し（四葉不動産）", business: "realestate" }] },
  { id: "C14", from: ["/labor/services/gaikokujin-koyo"], launchFlag: "SR_LAUNCHED", targets: [
      { href: "/legal/services/visa", anchor: "在留資格・ビザ申請（四葉行政書士事務所）", business: "legal" },
      { href: "/toushi/shataku", anchor: "社宅・法人賃貸（四葉不動産）", business: "realestate" },
    ] },
];

/** locale接頭辞（/en /zh-tw /zh）を除去してマッチ用の正規化パスを得る */
export function normalizePath(pathname: string): string {
  return pathname.replace(/^\/(en|zh-tw|zh)(?=\/|$)/, "") || "/";
}

/** リンクが社労士に関与するか（注記の3者版を使うか） */
export function involvesLabor(link: CrossLink): boolean {
  return (
    link.targets.some((t) => t.business === "labor") ||
    link.from.some((f) => f.startsWith("/labor"))
  );
}

/** 指定ページに表示すべきクロスリンクを返す（SR_LAUNCHED未開通は除外） */
export function getCrossLinks(pathname: string, srLaunched: boolean): CrossLink[] {
  const p = normalizePath(pathname).replace(/\/$/, "") || "/";
  return CROSS_LINKS.filter((c) => (c.launchFlag === "SR_LAUNCHED" ? srLaunched : true)).filter((c) =>
    c.from.some((f) => (f.replace(/\/$/, "") || "/") === p),
  );
}
