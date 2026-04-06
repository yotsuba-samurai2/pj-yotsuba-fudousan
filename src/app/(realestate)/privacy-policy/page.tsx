import { buildPageMetadata } from "@/lib/seo";
import { PrivacyPolicyPageClient } from "./PrivacyPolicyPageClient";

export const metadata = buildPageMetadata({
  businessKey: "realestate",
  title: "プライバシーポリシー",
  description: "四葉パートナーズの個人情報保護方針。お客様の個人情報の取り扱い、Cookie使用方針、データ管理体制について明記しています。",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <div>
      <PrivacyPolicyPageClient />
    </div>
  );
}
