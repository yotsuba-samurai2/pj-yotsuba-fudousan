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
    // description：本文の実セクションに合わせる（2026-07-25 更新）。7.〜11.（保有期間・廃棄／開示・訂正・
    // 利用停止等の請求／守秘義務／個人情報保護管理者／本ポリシーの改定）の追加に伴い更新。
    // 主体は本文1.の表記（四葉不動産株式会社）に合わせる（旧「四葉グループ」は本文と不一致）。
    description: "四葉不動産株式会社のプライバシーポリシー。個人情報の取得、利用目的、第三者提供、安全管理措置、Googleアナリティクス（Cookie）に加え、保有期間・廃棄、開示・訂正・利用停止等の請求、法令上の守秘義務、個人情報保護管理者について掲載しています。",
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
