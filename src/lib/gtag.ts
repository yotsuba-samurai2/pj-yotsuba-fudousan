// GA4イベント送信ヘルパー（2026-07-24 CTA刷新v2）。
// gtag.js は src/components/GoogleAnalytics.tsx が NEXT_PUBLIC_GA_ID 設定時のみロードする。
// 未ロード環境（ローカル・GA未設定）では何もしない（no-op）＝呼び出し側の分岐不要。
// ⚠️ 相談内容・個人情報をパラメータに入れない（イベント名と位置情報のみ）。
type GtagParams = Record<string, string | number | boolean>;

export function gaEvent(name: string, params?: GtagParams): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  try {
    w.gtag?.("event", name, params ?? {});
  } catch {
    // 計測失敗はユーザー体験に影響させない
  }
}
