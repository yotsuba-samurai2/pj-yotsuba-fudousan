import { buildPageMetadata } from "@/lib/seo";
import { PrivacyPolicyPageClient } from "./PrivacyPolicyPageClient";

export const metadata = buildPageMetadata({
  businessKey: "realestate",
  title: "プライバシーポリシー | 四葉パートナーズ",
  description: "四葉パートナーズのプライバシーポリシー。",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <div>
      <PrivacyPolicyPageClient />
    </div>
  );
}
