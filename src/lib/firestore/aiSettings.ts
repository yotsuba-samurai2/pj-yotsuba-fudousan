import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const COLLECTION = "settings";
const DOC_ID = "ai";

export const DEFAULT_AI_MODEL = "claude-haiku-4-5-20251001";

export type AiSettings = {
  model: string;
  updatedAt?: unknown;
  updatedBy?: string;
};

/** Firestoreから現在のAIモデルを取得。未設定ならデフォルト。 */
export async function getAiModel(): Promise<string> {
  try {
    const ref = doc(db, COLLECTION, DOC_ID);
    const snap = await getDoc(ref);
    if (!snap.exists()) return DEFAULT_AI_MODEL;
    const data = snap.data() as AiSettings;
    return data.model || DEFAULT_AI_MODEL;
  } catch (err) {
    console.error("Failed to load AI model from Firestore:", err);
    return DEFAULT_AI_MODEL;
  }
}

/** Firestoreにモデルを保存 */
export async function setAiModel(model: string, uid: string): Promise<void> {
  const ref = doc(db, COLLECTION, DOC_ID);
  await setDoc(ref, {
    model,
    updatedAt: serverTimestamp(),
    updatedBy: uid,
  });
}
