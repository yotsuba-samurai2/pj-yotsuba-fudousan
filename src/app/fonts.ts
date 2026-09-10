import { Noto_Serif_JP, Noto_Sans_JP } from "next/font/google";

/**
 * サイト共通フォント。ルートレイアウトが3系統（公開 [locale]／admin／facilitator）に
 * 分かれたため共有モジュールに切り出した（next/font はモジュールスコープでの初期化が必須）。
 *
 * preload: false（SEO監査2026-08-24 P0-2）：日本語フォントはunicode-range分割が多く、
 * preload有効だと多数の<link rel=preload>がHTMLヘッダーを肥大化させていた。
 * display:swap のCSS @font-face 経由で必要なスライスだけがオンデマンド取得される。
 */
// ウェイトごとの重複CSSを可変フォントに統合。日本語・中国語の字種は削らない。
// DESIGN.md §3：見出し＝Noto Serif JP（editorial）／本文・UI＝Noto Sans JP
export const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  weight: "variable",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  weight: "variable",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

/** <html className> にまとめて渡すCSS変数クラス */
export const fontVariables = `${notoSerifJP.variable} ${notoSansJP.variable}`;
