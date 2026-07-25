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
    // description：本文の実セクション（1.取得／2.利用目的／3.第三者提供／4.安全管理／
    // 5.アクセス解析ツール〔Googleアナリティクス〕／6.お問い合わせ）に合わせて是正（2026-07-25）。
    // 旧文の「お問い合わせデータの保管期間」は本文に該当記載が無いため削除。Cookieは5.に実在するため維持。
    // 主体も本文1.の表記（四葉不動産株式会社）に合わせる（旧「四葉グループ」は本文と不一致）。
    description: "四葉不動産株式会社のプライバシーポリシー。個人情報の取得、利用目的、第三者提供、安全管理措置、Googleアナリティクス（Cookie）によるアクセス解析とオプトアウト方法、お問い合わせ窓口について掲載しています。",
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
