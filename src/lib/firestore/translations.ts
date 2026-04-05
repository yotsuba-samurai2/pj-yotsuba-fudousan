import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { LangCode } from "@/config/languages";

const COLLECTION = "translations";

/** Firestoreから翻訳データを取得 */
export async function getTranslations(
  locale: LangCode,
): Promise<Record<string, unknown> | null> {
  const ref = doc(db, COLLECTION, locale);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as Record<string, unknown>;
}

/** Firestoreに翻訳データを保存（全体上書き） */
export async function saveTranslations(
  locale: LangCode,
  data: Record<string, unknown>,
): Promise<void> {
  const ref = doc(db, COLLECTION, locale);
  await setDoc(ref, data);
}
