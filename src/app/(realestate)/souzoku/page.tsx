import { buildPageMetadata } from "@/lib/seo";
import SouzokuPageContent from "./SouzokuPageContent";

/**
 * /souzoku — 相続不動産ピラーページ「文京区で不動産を相続したら」
 *
 * 既存トップページ（HomePage）の title/H1 はここでは一切変更していない。
 */
export const metadata = buildPageMetadata({
  businessKey: "realestate",
  title: "文京区で不動産を相続したら｜管理・活用・売却の完全ガイド｜四葉不動産",
  description:
    "文京区で不動産を相続したら、出口は管理・活用・売却の3つ。相続登記の義務化（2024年4月施行・原則3年以内、過去分は2027年3月31日まで）への備えから出口の選び方まで、文京区小日向の四葉不動産が提携する専門家と連携してワンストップで伴走します。",
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
  ],
});

export default function SouzokuPage() {
  return <SouzokuPageContent />;
}
