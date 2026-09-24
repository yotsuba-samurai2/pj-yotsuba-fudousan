// 問い合わせフォームへの「ご相談内容」の受け渡し（2026-09-24 新設）。
//
// 送り元のページ（例：/wakeari の出口チェックリスト）が、利用者の操作（「この内容で相談する」）で
// フォームへ遷移する直前に sessionStorage へ本文を書き、ContactForm が ?intent= と一致するときだけ
// 1回読んで消す。
//
// 【なぜ URL に載せないか】?intent= 以外のクエリに回答を載せると、GA4 の page_location やサーバーの
// アクセスログに回答が残る（gtag.ts の規約＝自由記述・回答内容は送らない）。sessionStorage はタブ単位で、
// タブを閉じれば消える。フォームで利用者が送信するまで、外部には一切送られない。
//
// ⚠️ クライアント安全（ContactForm・WakeariExitChecklist から import する）。サーバ専用の値を置かない。

export const CONTACT_PREFILL_STORAGE_KEY = "luck428:contact-prefill";

/** 受け渡しの有効期限。遷移の直後に読む前提なので短くする（古い下書きを別の相談に混ぜない） */
export const CONTACT_PREFILL_TTL_MS = 30 * 60 * 1000;

type StoredPrefill = { intent: string; message: string; savedAt: number };

export type PrefillStore = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function sessionStore(): PrefillStore | null {
  try {
    return typeof window === "undefined" ? null : window.sessionStorage;
  } catch {
    // プライベートブラウズ・ストレージ無効化では例外になる＝受け渡しなし（カテゴリのプリセットだけ働く）
    return null;
  }
}

/** フォームへ遷移する直前に呼ぶ。書けなかったとき（ストレージ無効など）は false */
export function writeContactPrefill(
  intent: string,
  message: string,
  store: PrefillStore | null = sessionStore(),
  now: number = Date.now(),
): boolean {
  if (!store || !intent || !message) return false;
  try {
    const value: StoredPrefill = { intent, message, savedAt: now };
    store.setItem(CONTACT_PREFILL_STORAGE_KEY, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * ContactForm の初回表示で呼ぶ。intent が一致し期限内のときだけ本文を返し、読んだら消す（1回きり）。
 * intent が違う下書きは残す（別の送り元の下書きを横取りしない）。期限切れ・壊れた値は消す。
 */
export function takeContactPrefill(
  intent: string,
  store: PrefillStore | null = sessionStore(),
  now: number = Date.now(),
): string | null {
  if (!store || !intent) return null;
  try {
    const raw = store.getItem(CONTACT_PREFILL_STORAGE_KEY);
    if (!raw) return null;
    let parsed: Partial<StoredPrefill>;
    try {
      parsed = JSON.parse(raw) as Partial<StoredPrefill>;
    } catch {
      store.removeItem(CONTACT_PREFILL_STORAGE_KEY);
      return null;
    }
    const fresh =
      typeof parsed.savedAt === "number" && now - parsed.savedAt <= CONTACT_PREFILL_TTL_MS && parsed.savedAt <= now + 60_000;
    if (!fresh || typeof parsed.message !== "string" || typeof parsed.intent !== "string") {
      store.removeItem(CONTACT_PREFILL_STORAGE_KEY);
      return null;
    }
    if (parsed.intent !== intent) return null;
    store.removeItem(CONTACT_PREFILL_STORAGE_KEY);
    return parsed.message;
  } catch {
    return null;
  }
}
