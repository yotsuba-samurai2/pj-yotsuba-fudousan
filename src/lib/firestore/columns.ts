import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const COLLECTION = "columns";

export type ColumnTranslation = {
  title: string;
  excerpt: string;
  content: string;
  category?: string;
  keywords?: string[];
  tags?: string[];
  faq?: Array<{ question: string; answer: string }>;
};

export type ColumnStatus = "draft" | "published" | "deleted";

export type FirestoreColumn = {
  id: string;
  business: "realestate" | "legal" | "labor";
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  status: ColumnStatus;
  modifiedDate?: string;
  ogImage?: string;
  author?: { name: string; title: string };
  keywords?: string[];
  faq?: Array<{ question: string; answer: string }>;
  tags?: string[];
  translations?: {
    en?: ColumnTranslation;
    "zh-tw"?: ColumnTranslation;
    zh?: ColumnTranslation;
  };
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

/** 全コラム取得（ビジネス別、ステータス別） */
export async function getColumns(business?: string, status?: ColumnStatus): Promise<FirestoreColumn[]> {
  const ref = collection(db, COLLECTION);
  const constraints = [];
  if (business) constraints.push(where("business", "==", business));
  if (status) constraints.push(where("status", "==", status));
  constraints.push(orderBy("date", "desc"));
  const q = query(ref, ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return { id: d.id, status: "draft", ...data } as FirestoreColumn;
  });
}

/** 公開コラムのみ取得（フロントエンド用） */
export async function getPublishedColumns(business?: string): Promise<FirestoreColumn[]> {
  return getColumns(business, "published");
}

/** slug でコラム取得 */
export async function getColumnBySlug(business: string, slug: string): Promise<FirestoreColumn | null> {
  const ref = collection(db, COLLECTION);
  const q = query(ref, where("business", "==", business), where("slug", "==", slug));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as FirestoreColumn;
}

/** コラム作成 */
export async function createColumn(
  data: Omit<FirestoreColumn, "id" | "createdAt" | "updatedAt">,
): Promise<string> {
  const ref = collection(db, COLLECTION);
  const docRef = await addDoc(ref, {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

/** コラム更新 */
export async function updateColumn(id: string, data: Partial<FirestoreColumn>): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, { ...data, updatedAt: Timestamp.now() });
}

/** コラム削除 */
export async function deleteColumn(id: string): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
}

/** ID でコラム取得 */
export async function getColumnById(id: string): Promise<FirestoreColumn | null> {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as FirestoreColumn;
}
