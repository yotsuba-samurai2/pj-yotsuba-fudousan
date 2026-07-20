// 方式＝COPY: Record<LangCode,…>＋getRequestLocale（手本=souzoku/page.tsx）。メタのみ本ファイル、本文COPYはGroupHomePageContent.tsx側。
// en/zh-tw/zh=監修前ドラフト（2026-07-18）。繁体=台湾定訳（障礙福祉・共同生活援助・不動產・文京區＝visa/shogai-fukushi等の既訳準拠）／zh=大陸表記（残障・无障碍系は既訳に合わせ「障礙/障碍」を統一）。
// jaの表示文言・数値（居室7.43㎡・区分4以上8割・準備3〜6か月）は全ロケールで不変（指定基準の正確性最重要）。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import type { LangCode } from "@/config/languages";
import GroupHomePageContent from "./GroupHomePageContent";

/**
 * /group-home — グループホーム開設ピラーページ「文京区でグループホームを開設するなら」
 *
 * 独自性の核＝「物件（不動産）と指定申請（行政手続）を同一窓口で見る」。
 * 既存の /toushi/group-home・/toushi/shitei-shinsei・/legal/services/shogai-fukushi は
 * サブ記事として残し、本ピラーから内部リンク（トピッククラスタ構造）。
 * 既存トップページ（HomePage）の title/H1 はここでは一切変更していない。
 */

const META: Record<LangCode, { title: string; description: string }> = {
  ja: {
    title: "文京区でグループホームを開設するなら｜物件確保から指定申請・運営までの完全ガイド",
    description:
      "障害者グループホーム（共同生活援助）の開設は、「物件（不動産）」と「指定申請（行政手続）」が同時に動きます。四葉は宅地建物取引業と行政書士業務の両方を持ち、指定基準（立地・面積・消防）を見据えた物件選びから、法人設立→指定申請→運営までを一つの窓口で伴走します。文京区小日向・茗荷谷駅徒歩5分。",
  },
  en: {
    title:
      "Opening a Group Home in Bunkyo | A Complete Guide from Securing a Property to Designation and Operation",
    description:
      "Opening a group home for people with disabilities (kyodo seikatsu enjo / shared-living support) means the property (real estate) and the designation application (administrative procedure) move at the same time. Yotsuba holds both a real estate brokerage license and gyoseishoshi (administrative scrivener) practice, walking with you in one window—from choosing a property that anticipates the designation criteria (location, floor area, fire safety) to incorporation, the designation application, and operation. In Kohinata, Bunkyo, a 5-minute walk from Myogadani Station.",
  },
  "zh-tw": {
    title: "在文京區開設身心障礙者團體家屋（Group Home）｜從確保物件到指定申請・營運的完全指南",
    description:
      "身心障礙者團體家屋（共同生活援助）的開設，「物件（不動產）」與「指定申請（行政手續）」是同時進行的。四葉同時擁有宅地建物取引業與行政書士業務，能從預先納入指定基準（立地・面積・消防）的物件挑選，到法人設立→指定申請→營運，於同一窗口陪伴您。文京區小日向・距茗荷谷站步行5分鐘。",
  },
  zh: {
    title: "在文京区开设残障者团体家屋（Group Home）｜从确保物件到指定申请・运营的完全指南",
    description:
      "残障者团体家屋（共同生活援助）的开设，“物件（不动产）”与“指定申请（行政手续）”是同时推进的。四葉同时拥有宅地建物取引业与行政书士业务，能从预先纳入指定基准（立地・面积・消防）的物件挑选，到法人设立→指定申请→运营，在同一窗口陪伴您。文京区小日向・距茗荷谷站步行5分钟。",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const m = META[locale] ?? META.ja;
  return buildPageMetadata({
    businessKey: "realestate",
    // 社名はレイアウトのtitleテンプレート（%s | 四葉不動産）が付与＝ここでは書かない（重複防止）
    title: m.title,
    description: m.description,
    path: "/group-home",
    // keywords は ja 固定（souzoku 同様、検索語は日本語主体）
    keywords: [
      "グループホーム 開設",
      "障害者グループホーム 物件",
      "共同生活援助 指定申請",
      "グループホーム 指定基準",
      "グループホーム 物件探し",
      "障害福祉サービス 開設",
      "東京 グループホーム 開設 相談",
      "文京区 グループホーム",
    ],
    locale,
  });
}

export default function GroupHomePage() {
  return <GroupHomePageContent />;
}
