import "@fontsource-variable/noto-serif-jp";
import "@fontsource-variable/noto-sans-jp";
import styles from "./fonts.module.css";

/**
 * サイト共通フォント。ルートレイアウトが3系統（公開 [locale]／admin／facilitator）に
 * 分かれたため共有モジュールに切り出した。
 *
 * npmに同梱された全unicode-range分割・可変ウェイトを自己配信し、ビルド時の
 * Google Fonts接続を不要にする。preloadせず、display:swapのCSS @font-face経由で
 * 必要なスライスだけ取得する。公開ページはDeferredBrandFontsから遅延importする。
 * OFLライセンス: /fonts/OFL-Noto-JP.txt
 */
// ウェイトごとの重複CSSを可変フォントに統合。日本語・中国語の字種は削らない。
// DESIGN.md §3：見出し＝Noto Serif JP（editorial）／本文・UI＝Noto Sans JP
export const notoSerifJP = {
  variable: styles.serif,
  style: { fontFamily: '"Noto Serif JP Variable", "Yotsuba Serif Fallback", serif' },
};

export const notoSansJP = {
  variable: styles.sans,
  style: { fontFamily: '"Noto Sans JP Variable", "Yotsuba Sans Fallback", sans-serif' },
};

/** <html className> にまとめて渡すCSS変数クラス */
export const fontVariables = `${notoSerifJP.variable} ${notoSansJP.variable}`;
