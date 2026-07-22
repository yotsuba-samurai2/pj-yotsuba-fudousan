// 方式＝COPY: Record<LangCode,…>＋getRequestLocale（手本=access/page.tsx）。メタのみ本ファイル、本文COPYはSouzokuPageContent.tsx側。
// en/zh-tw/zh=監修前ドラフト（2026-07-11）。繁体=台湾定訳（繼承・遺囑・不動產・文京區・遺產稅＝inheritanceページ既訳準拠）／zh=大陸表記。
// jaの表示文言・金額・年数・数値は全ロケールで不変（法制度の正確性最重要：相続登記=inheritance registration／司法書士・税理士の区分は原文どおり）。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import type { LangCode } from "@/config/languages";
import SouzokuPageContent from "./SouzokuPageContent";

/**
 * /souzoku — 相続不動産ピラーページ「文京区で不動産を相続したら」
 *
 * 既存トップページ（HomePage）の title/H1 はここでは一切変更していない。
 */

const META: Record<LangCode, { title: string; description: string }> = {
  ja: {
    title: "文京区で不動産を相続したら｜管理・活用・売却の完全ガイド",
    description:
      "文京区で不動産を相続したら、出口は管理・活用・売却の3つ。相続登記の義務化（2024年4月施行・原則3年以内、過去分は2027年3月31日まで）への備えから出口の選び方まで、文京区小日向の四葉不動産が提携する専門家と連携して伴走します。",
  },
  en: {
    title: "Inheriting Property in Bunkyo | A Complete Guide to Managing, Utilizing, or Selling",
    description:
      "When you inherit real estate in Bunkyo, Tokyo, there are three exits: manage, utilize, or sell. From preparing for the mandatory inheritance registration (in force April 2024; within three years in principle, and by March 31, 2027 for past inheritances) to choosing your exit, Yotsuba Real Estate in Kohinata, Bunkyo walks with you in coordination with partner professionals.",
  },
  "zh-tw": {
    title: "在文京區繼承不動產｜管理・活用・出售完全指南",
    description:
      "在文京區繼承不動產後，出口有管理・活用・出售3種。從因應繼承登記的義務化（2024年4月施行・原則3年以內，過去部分至2027年3月31日），到出口的選法，文京區小日向的四葉不動産與合作的專業人士聯手陪伴您。",
  },
  zh: {
    title: "在文京区继承不动产｜管理・活用・出售完全指南",
    description:
      "在文京区继承不动产后，出口有管理・活用・出售3种。从应对继承登记的义务化（2024年4月施行・原则3年以内，过去部分至2027年3月31日），到出口的选法，文京区小日向的四葉不動産与合作的专业人士协作陪伴您。",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const m = META[locale] ?? META.ja;
  return buildPageMetadata({
    businessKey: "realestate",
    // B2：社名はレイアウトのtitleテンプレート（%s | 四葉不動産）が付与＝ここでは書かない（重複防止）
    title: m.title,
    description: m.description,
    path: "/souzoku",
    keywords: [
      "文京区 相続 不動産",
      "相続不動産",
      "実家 相続 どうする",
      "空き家 相続",
      "相続 不動産 売却",
      "相続 不動産 活用",
      "相続登記 義務化 期限",
      "茗荷谷 不動産 相続",
      // 2026-07-22：隣接区の商圏明示（定点#3対応）
      "豊島区 相続 不動産 売却",
      "大塚 巣鴨 駒込 相続 相談",
    ],
    locale,
  });
}

export default function SouzokuPage() {
  return <SouzokuPageContent />;
}
