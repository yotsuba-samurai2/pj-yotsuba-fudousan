import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { TermsPageClient } from "./TermsPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "realestate",
    // title：Bing Webmaster Tools「タイトルが短すぎる」対応（2026-07-25）＝掲載内容（利用条件・
    // 免責事項）を足して最終表示30〜40字に。社名はレイアウトのtitleテンプレート
    // （%s | 四葉不動産）が付与＝ここでは書かない（重複防止）。
    title: "利用規約｜本サイトのご利用条件と免責事項について",
    // description：本文の実セクションに合わせる（2026-07-25 更新）。第5条〜第9条（知的財産権／リンク／
    // 掲載情報の位置づけ／準拠法および管轄裁判所／お問い合わせ）の追加に伴い全9条の構成へ更新。
    // 運営主体は本文第1条の表記（四葉不動産株式会社）に合わせる（旧「四葉グループ」は本文と不一致）。
    description: "四葉不動産株式会社が運営する本サイトの利用規約です。適用、禁止事項、免責事項、変更に加え、知的財産権、リンク、掲載情報の位置づけ、準拠法および管轄裁判所、お問い合わせの全9条を掲載しています。ご利用の前にご確認ください。",
    path: "/terms",
    locale,
  });
}

export default function TermsPage() {
  return (
    <div>
      <TermsPageClient />
    </div>
  );
}
