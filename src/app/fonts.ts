import { Zen_Kaku_Gothic_New, Noto_Serif_JP, Noto_Sans_JP } from "next/font/google";

/**
 * サイト共通フォント。ルートレイアウトが3系統（公開 [locale]／admin／facilitator）に
 * 分かれたため共有モジュールに切り出した（next/font はモジュールスコープでの初期化が必須）。
 *
 * preload: false（SEO監査2026-08-24 P0-2）：日本語フォントはunicode-range分割が多く、
 * preload有効だと3書体×8ウェイトで204件の<link rel=preload>がHTMLヘッダーを肥大化させていた。
 * display:swap のCSS @font-face 経由で必要なスライスだけがオンデマンド取得される。
 */
export const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku-gothic-new",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

// DESIGN.md §3：見出し＝Noto Serif JP（editorial）／本文・UI＝Noto Sans JP
export const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  weight: ["600", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

/** <html className> にまとめて渡すCSS変数クラス */
export const fontVariables = `${zenKaku.variable} ${notoSerifJP.variable} ${notoSansJP.variable}`;
