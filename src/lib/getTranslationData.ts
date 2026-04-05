import type { LangCode } from "@/config/languages";

// 静的 JSON フォールバック
import jaFallback from "@/locales/ja.json";
import enFallback from "@/locales/en.json";
import zhTwFallback from "@/locales/zh-tw.json";
import zhFallback from "@/locales/zh.json";

const fallbacks: Record<LangCode, Record<string, unknown>> = {
  ja: jaFallback,
  en: enFallback,
  "zh-tw": zhTwFallback,
  zh: zhFallback,
};

/**
 * 翻訳データを取得する
 * Firestore が利用可能なら Firestore から、そうでなければ静的 JSON にフォールバック
 *
 * NOTE: Firestore からの取得はクライアントサイドで行う（Firebase client SDK のため）
 * サーバーコンポーネントでは常に静的 JSON を使用
 */
export function getStaticTranslationData(locale: LangCode): Record<string, unknown> {
  return fallbacks[locale] ?? fallbacks.ja;
}

export function getAllStaticTranslations(): Record<LangCode, Record<string, unknown>> {
  return fallbacks;
}
