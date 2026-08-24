// /（型F・二本柱トップ）＝原稿_不動産 #1（E-1差し戻し対応・2026-07-10・単独PR）
// 【社名保護】title・H1に「四葉不動産」必須（H1は全ロケール＝HomePageContentのCOPY参照）。
// GSCベースライン退避済＝_backup/GSCベースライン_E-0_不動産トップ_2026-07-10.md。
// 本文＝HomePageContent.tsx（ja/en/zh-tw/zh の4ロケール・コード内ロケールマップ＝Firestore書き換えなし）。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import type { LangCode } from "@/config/languages";
import HomePageContent from "./HomePageContent";

// 【GSC E-2】トップのメタをロケール別に出し分ける（方式＝子ページ souzoku/access と同じ
// META: Record<LangCode,…> ＋ getRequestLocale）。従来は title/description が日本語ハードコードで、
// /en・/zh・/zh-tw が「日本語トップと同一の薄い複製」に見え GSC「クロール済み・未登録」化していた。
// buildPageMetadata が locale から og:locale/twitter/canonical/hreflang を自動生成するため、
// ここで title/description を locale 別にするだけで全メタが連動する。
// 【社名保護】title は全ロケール先頭に「四葉不動産」（HomePageContent の H1 と同一表記）。
//   en/zh-tw/zh の title は HomePageContent COPY の H1 を再利用（＝既存の監修対象コピー・新規ハードコードを増やさない）、
//   ja は既存の本番 title を維持（変更しない）。description は本文 intro 準拠＝en/zh-tw/zh は監修前ドラフト（フェーズI監修対象）。
// absoluteTitle=true 維持：title に社名を含むためレイアウトの「%s | 四葉不動産」テンプレートは付与しない（社名重複防止）。
const META: Record<LangCode, { title: string; description: string }> = {
  ja: {
    title: "四葉不動産｜文京区の相続不動産と投資・事業用不動産",
    description:
      "東京都文京区小日向・茗荷谷駅徒歩5分の四葉不動産株式会社。相続した不動産の管理・活用・売却と、投資用・事業用（グループホーム・社宅）の不動産を扱います。元新聞記者で宅建士・行政書士の代表が、多言語で最初の一歩からお手伝いします。",
  },
  en: {
    title:
      "四葉不動産｜Inherited Property & Investment / Business-Use Real Estate in Bunkyo, Tokyo",
    description:
      "Yotsuba Real Estate Co., Ltd. (四葉不動産株式会社), a 5-minute walk from Myogadani Station in Kohinata, Bunkyo-ku, Tokyo. We handle inherited real estate—managing, utilizing, and selling—plus investment and business-use properties (group homes, company housing). Our representative, a former newspaper journalist, Licensed Real Estate Transaction Specialist and Gyoseishoshi (Administrative Scrivener), supports you from the very first step in Japanese, English, and Chinese.",
  },
  "zh-tw": {
    title: "四葉不動産｜文京區的繼承不動產與投資・事業用不動產",
    description:
      "位於東京都文京區小日向、茗荷谷站步行5分鐘的四葉不動産株式会社。承辦繼承不動產的管理・活用・出售，以及投資用・事業用（團體家屋・員工宿舍）不動產。曾任報社記者、具宅建士與行政書士資格的代表，以日文・英文・中文，從第一步開始為您服務。",
  },
  zh: {
    title: "四葉不動産｜文京区的继承不动产与投资・事业用不动产",
    description:
      "位于东京都文京区小日向、茗荷谷站步行5分钟的四葉不動産株式会社。承办继承不动产的管理・活用・出售，以及投资用・事业用（团体家屋・员工宿舍）不动产。曾任报社记者、持宅建士与行政书士资格的代表，以日语・英语・中文，从第一步开始为您服务。",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const m = META[locale] ?? META.ja;
  return buildPageMetadata({
    businessKey: "realestate",
    title: m.title,
    description: m.description,
    path: "/",
    keywords: ["四葉不動産", "文京区 相続 不動産", "文京区 不動産会社"],
    locale,
    absoluteTitle: true,
  });
}

export default function HomePage() {
  return <HomePageContent />;
}
