import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { PrivacyPolicyPageClient } from "./PrivacyPolicyPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "realestate",
    // title：Bing Webmaster Tools「タイトルが短すぎる」対応（2026-07-25）＝掲載内容（個人情報の
    // 取扱い・利用目的）を足して最終表示30〜40字に。社名はレイアウトのtitleテンプレート
    // （%s | 四葉不動産）が付与＝ここでは書かない（重複防止）。
    title: "プライバシーポリシー｜個人情報の取扱いと利用目的について",
    description: "四葉グループが取り扱う個人情報の利用目的、第三者提供の有無、Cookie使用方針、お問い合わせデータの保管期間、情報管理体制など、プライバシー保護に関する取り扱いを詳しく明記しています。安心してご利用いただくためにご確認ください。",
    path: "/privacy-policy",
    locale,
  });
}

export default function PrivacyPolicyPage() {
  return (
    <div>
      <PrivacyPolicyPageClient />
    </div>
  );
}
