import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type { LangCode } from "@/config/languages";

/** UI翻訳データ（1行＝1ロケール全体）のサーバー専用データ層 */

/** 翻訳データを取得 */
export async function getTranslations(
  locale: LangCode,
): Promise<Record<string, unknown> | null> {
  const row = await prisma.translation.findUnique({ where: { locale } });
  if (!row) return null;
  return row.data as Record<string, unknown>;
}

/** 翻訳データを保存（ロケール全体を丸ごと上書き＝旧setDocと同義） */
export async function saveTranslations(
  locale: LangCode,
  data: Record<string, unknown>,
): Promise<void> {
  const json = JSON.parse(JSON.stringify(data)) as Prisma.InputJsonValue;
  await prisma.translation.upsert({
    where: { locale },
    create: { locale, data: json },
    update: { data: json },
  });
}
