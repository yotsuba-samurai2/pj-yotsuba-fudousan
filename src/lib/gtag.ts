// GA4イベント送信ヘルパー（2026-07-24 CTA刷新v2）。
// gtag.js は src/components/GoogleAnalytics.tsx が NEXT_PUBLIC_GA_ID 設定時のみロードする。
// 未ロード環境（ローカル・GA未設定）では何もしない（no-op）＝呼び出し側の分岐不要。
// ⚠️ 個人情報・自由記述をパラメータに入れない。
//    可：位置（location）、事業（business）、固定選択肢の値（category / source）。
//    不可：氏名・メール・電話番号・相談本文など、本人に結びつく情報および自由入力欄の中身。
//    2026-08-14に category / source を許可対象へ明文化した（いずれも閉じた選択肢で
//    個人に結びつかず、どの分野・どの経路から問い合わせが来たかの把握に必要なため）。
type GtagParams = Record<string, string | number | boolean>;

export function gaEvent(name: string, params?: GtagParams): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  try {
    // transport_type: "beacon" ＝ 送信直後に画面が遷移しても計測を落としにくくする。
    // 2026-08-14：tel: リンクは同一タブで電話アプリへ移るため、通常のリクエストだと
    // 送信前に破棄されうる。呼び出し側が上書きできるよう先に置く。
    w.gtag?.("event", name, { transport_type: "beacon", ...(params ?? {}) });
  } catch {
    // 計測失敗はユーザー体験に影響させない
  }
}
