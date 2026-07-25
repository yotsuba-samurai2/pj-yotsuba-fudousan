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
    // description：本文の実セクション（第1条 適用／第2条 禁止事項／第3条 免責事項／第4条 変更の全4条）に
    // 合わせて是正（2026-07-25）。旧文の「知的財産権の取り扱い」「準拠法」は本文に該当条項が無いため削除。
    // 運営主体も本文第1条の表記（四葉不動産株式会社）に合わせる（旧「四葉グループ」は本文と不一致）。
    description: "四葉不動産株式会社が運営する本サイトの利用規約です。第1条 適用、第2条 禁止事項（法令・公序良俗違反、権利侵害、運営妨害）、第3条 免責事項、第4条 変更の全4条を掲載しています。ご利用の前にご確認ください。",
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
