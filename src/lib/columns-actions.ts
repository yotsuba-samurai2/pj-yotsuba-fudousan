"use server";

/**
 * クライアントコンポーネント（コラム一覧）から呼ぶ公開読み取り用 Server Actions。
 * 旧実装はブラウザから Firestore SDK を直接叩いていたが、Prisma化に伴い
 * サーバー経由（Server Action）に置き換える。返すのは published のみ＝公開データ。
 * 関数名・シグネチャは旧 src/lib/columns.ts のエクスポートと同一。
 */

import type { LangCode } from "@/config/languages";
import type { ColumnSummary } from "@/lib/column-shared";
import {
  getLatestColumns as fetchLatestRealestate,
  getLatestLegalColumns as fetchLatestLegal,
  getLatestLaborColumns as fetchLatestLabor,
} from "@/lib/columns";

export async function getLatestColumns(n: number, locale: LangCode): Promise<ColumnSummary[]> {
  return fetchLatestRealestate(n, locale);
}

export async function getLatestLegalColumns(n: number, locale: LangCode): Promise<ColumnSummary[]> {
  return fetchLatestLegal(n, locale);
}

export async function getLatestLaborColumns(n: number, locale: LangCode): Promise<ColumnSummary[]> {
  return fetchLatestLabor(n, locale);
}
