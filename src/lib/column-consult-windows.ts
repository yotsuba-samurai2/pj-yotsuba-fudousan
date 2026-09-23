// コラム → 受け皿ページの対応表（2026-09-24 新設・大家募集ページ指示書 v1.0 第7章 7-2）。
// DB の本文（Column.content）は触らず、コードの対応表で「この記事に関係する相談窓口」を
// /column/[slug]・/legal/column/[slug] の本文直後に差す（ja のみ）。
// 姉妹企画（難あり土地の出口相談 /wakeari）も同じ表に行を足す＝コンポーネントは共用、追記は配列だけ。
// 表示は src/components/column/RelatedConsultWindows.tsx。
import type { BusinessKey } from "@/lib/shared/office-public";

export type ConsultWindow = {
  /** 内部パス（相対・接頭辞なし。ja のみ表示のため接頭辞は付けない） */
  href: string;
  label: string;
  description: string;
};

type ConsultWindowSet = {
  business: Extract<BusinessKey, "realestate" | "legal">;
  slugs: readonly string[];
  windows: readonly ConsultWindow[];
};

const GH_OWNER_WINDOW: ConsultWindow = {
  href: "/group-home/ooya",
  label: "グループホーム向けに物件を貸したい大家さんへ",
  description:
    "戸建て・空き家・アパートを貸す側の相談窓口。募集条件・契約前の論点・相談の流れと専用フォーム（四葉不動産株式会社）",
};

const GH_OPERATOR_WINDOW: ConsultWindow = {
  href: "/toushi/group-home",
  label: "グループホームに使える物件の探し方",
  description: "開設する事業者向けの物件探し。指定基準を見据えた契約前の確認ポイント（四葉不動産株式会社）",
};

export const COLUMN_CONSULT_WINDOWS: readonly ConsultWindowSet[] = [
  {
    // 貸し手向けコラム（/column/）＝大家募集ページが受け皿
    business: "realestate",
    slugs: [
      "kodate-akiya-group-home-ni-kasu",
      "group-home-owner-shodaku",
      "kensazumisho-nashi-bukken-fukushi-youto-henko",
    ],
    windows: [GH_OWNER_WINDOW],
  },
  {
    // 開設コラム（/legal/column/）のうち、貸主側にも関係する論点（消防・用途変更・近隣・事前協議・面積・探し方・3類型）
    business: "legal",
    slugs: [
      "group-home-shobo-setsubi-sprinkler",
      "group-home-kenchikukijunho-youto-henko",
      "group-home-kinrin-setsumei",
      "group-home-keiyakumae-jizen-kyogi",
      "group-home-shitei-kijun-bukken-menseki",
      "group-home-bukken-sagashikata-youto-chiiki",
      "group-home-kodate-apart-satellite-chigai",
    ],
    windows: [GH_OWNER_WINDOW, GH_OPERATOR_WINDOW],
  },
];

/** 該当する窓口。無ければ null（描画しない） */
export function getColumnConsultWindows(
  business: ConsultWindowSet["business"],
  slug: string,
): ConsultWindow[] | null {
  const set = COLUMN_CONSULT_WINDOWS.find((s) => s.business === business && s.slugs.includes(slug));
  return set ? [...set.windows] : null;
}
