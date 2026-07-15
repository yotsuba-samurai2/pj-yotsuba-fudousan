import { prisma } from "@/lib/prisma";
import { DEFAULT_AI_MODEL } from "@/lib/shared/ai";

export { DEFAULT_AI_MODEL };

const ROW_ID = "ai";

export type AiSettings = {
  model: string;
  updatedAt?: unknown;
  updatedBy?: string;
};

/** 現在のAIモデルを取得。未設定・エラー時はデフォルト。 */
export async function getAiModel(): Promise<string> {
  try {
    const row = await prisma.aiSetting.findUnique({ where: { id: ROW_ID } });
    return row?.model || DEFAULT_AI_MODEL;
  } catch (err) {
    console.error("Failed to load AI model from DB:", err);
    return DEFAULT_AI_MODEL;
  }
}

/** モデルを保存（単一行 id="ai"） */
export async function setAiModel(model: string, uid: string): Promise<void> {
  await prisma.aiSetting.upsert({
    where: { id: ROW_ID },
    create: { id: ROW_ID, model, updatedBy: uid },
    update: { model, updatedBy: uid },
  });
}
