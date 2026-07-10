// フェーズK-4｜/facilitator — 士業ドットコムSAMURAIのLINKA（プレビュー用・noindex）
// 公開＝段階β（石井レビュー済み設計・在留資格/相続/障害福祉から）は浦松承認後。
// 本番導線・sitemapには載せない。ai.samurai.co.jp への移設は別途（設計書§9）。
import type { Metadata } from "next";
import { FacilitatorClient } from "./FacilitatorClient";

export const metadata: Metadata = {
  title: "LINKA｜士業ドットコム SAMURAI（プレビュー）",
  robots: { index: false, follow: false },
};

export default function FacilitatorPage() {
  return <FacilitatorClient />;
}
