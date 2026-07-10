// /（型F・二本柱トップ）＝原稿_不動産 #1（E-1差し戻し対応・2026-07-10・単独PR）
// 【社名保護】title・H1に「四葉不動産」必須（H1は全ロケール＝HomePageContentのCOPY参照）。
// GSCベースライン退避済＝_backup/GSCベースライン_E-0_不動産トップ_2026-07-10.md。
// 本文＝HomePageContent.tsx（ja/en/zh-tw/zh の4ロケール・コード内ロケールマップ＝Firestore書き換えなし）。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import HomePageContent from "./HomePageContent";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "realestate",
    title: "四葉不動産｜文京区の相続不動産と投資・事業用不動産",
    description:
      "東京都文京区小日向・茗荷谷駅徒歩5分の四葉不動産株式会社。相続した不動産の管理・活用・売却と、投資用・事業用（グループホーム・社宅）の不動産を扱います。元新聞記者で宅建士・行政書士の代表が、多言語で最初の一歩からお手伝いします。",
    path: "/",
    keywords: ["四葉不動産", "文京区 相続 不動産", "文京区 不動産会社"],
    locale,
    absoluteTitle: true,
  });
}

export default function HomePage() {
  return <HomePageContent />;
}
