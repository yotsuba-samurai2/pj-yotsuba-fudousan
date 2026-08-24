import type { Metadata } from "next";
import NotFoundContent from "./not-found-content";

export const metadata: Metadata = {
  title: "ページが見つかりません",
  description: "お探しのページは見つかりませんでした。",
  robots: { index: false, follow: false },
};

/**
 * グローバル 404 ページ
 *
 * - 不動産ドメイン: 不動産向けの404
 * - 行政書士ドメイン: TODO 社労士開業（2026年9月）後に専用デザイン
 *
 * 旧実装は headers() でホストを判定していたが、リクエストAPIは404レンダーを
 * 動的化し、notFound() でゲートしている labor 配下等の静的生成を壊す
 * （SEO監査2026-08-24 P0-1・ISR化）。ホスト分岐はクライアント側
 * （not-found-content.tsx の window.location.hostname）で行う。
 */
export default function NotFound() {
  return <NotFoundContent />;
}
