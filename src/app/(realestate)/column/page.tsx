import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import ColumnListPageContent from "./ColumnListPageContent";

export const dynamic = "force-dynamic";

const META_BY_LOCALE: Record<string, { title: string; description: string }> = {
  ja: {
    title: "コラム | 不動産・暮らし・相続のお役立ち情報",
    description:
      "東京の部屋探しのコツ、敷金・礼金の仕組み、契約書の読み方、暮らし情報、相続不動産の基礎知識まで。元新聞記者としての取材経験と行政書士の専門知識を活かし、四葉不動産が実体験を交えてわかりやすく解説するお役立ちコラムです。",
  },
  en: {
    title: "Column｜Real Estate, Living & Inheritance Tips",
    description:
      "Tips for apartment hunting in Tokyo, how deposits and key money work, reading contracts, living info, and the basics of inherited real estate. Yotsuba Real Estate explains clearly, drawing on a former journalist's reporting experience and administrative-scrivener expertise.",
  },
  "zh-tw": {
    title: "專欄｜不動產・生活・繼承的實用資訊",
    description:
      "從東京找房訣竅、押金禮金機制、合約閱讀方式、生活資訊，到繼承不動產的基礎知識。四葉不動產結合前新聞記者的採訪經驗與行政書士的專業，以實際經驗淺顯易懂地解說。",
  },
  zh: {
    title: "专栏｜房产・生活・继承实用资讯",
    description:
      "从东京找房窍门、押金礼金机制、合同阅读方式、生活资讯，到继承房产的基础知识。四叶不动产结合前新闻记者的采访经验与行政书士的专业，以实际经验通俗易懂地讲解。",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const m = META_BY_LOCALE[locale] ?? META_BY_LOCALE.ja;
  return buildPageMetadata({
    businessKey: "realestate",
    title: m.title,
    description: m.description,
    path: "/column",
    keywords: [
      "不動産 コラム",
      "部屋探し コツ",
      "敷金 礼金",
      "不動産契約書 読み方",
      "相続不動産 基礎知識",
    ],
    locale,
  });
}

export default function ColumnListPage() {
  return <ColumnListPageContent />;
}
