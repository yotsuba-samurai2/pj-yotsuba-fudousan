import { after } from "next/server";
import type { AdminProperty, PropertyInput } from "@/lib/property-shared";
import { publicationEventStore } from "@/lib/db/publication-events";
import { submitToIndexNow } from "@/lib/indexnow";
import {
  recordPublicationChange,
  processPendingNotifications,
} from "@/lib/property-publication";

/**
 * 物件の保存経路（管理API・賃貸自動取込）から呼ぶ、公開変更通知の安全なラッパー。
 * IndexNow（src/lib/indexnow.ts）・コラムの column-publication-cache.ts と同じ設計：
 * - ここから外に例外を投げない。呼び出し元（物件の保存）を通知の失敗で止めない。
 * - 「記録」は保存の直後に同期・awaitで行う＝プロセス終了で失われない（永続キューへの1行）。
 * - 「送信」は after() でレスポンスをブロックしない。失敗は再試行（processPendingNotifications）。
 */

/** 保存成功の直後に呼ぶ。DB挿入のみ（外部送信はしない）。await して呼び出し元で完了を待つ */
export async function recordPropertyPublicationChange(
  before: AdminProperty | PropertyInput | null | undefined,
  after: AdminProperty | PropertyInput | null | undefined,
  now: Date,
): Promise<void> {
  try {
    await recordPublicationChange(publicationEventStore, before, after, now);
  } catch (error) {
    console.error("Property publication change could not be recorded:", error);
  }
}

async function flushDuePropertyNotifications(now: Date): Promise<void> {
  await processPendingNotifications(publicationEventStore, submitToIndexNow, now);
}

/** レスポンスを待たせない通知送信（after()）。request scope外（テスト等）での呼び出しも安全 */
export function scheduleDuePropertyNotifications(now: Date): void {
  try {
    after(async () => {
      try {
        await flushDuePropertyNotifications(now);
      } catch (error) {
        console.error("Property search notification failed:", error);
      }
    });
  } catch (error) {
    console.error("Property search notification could not be scheduled:", error);
  }
}

/** 日次の定期実行末尾で呼ぶ想定（after()に頼らず、その場で待つ） */
export async function flushDuePropertyNotificationsNow(now: Date): Promise<void> {
  try {
    await flushDuePropertyNotifications(now);
  } catch (error) {
    console.error("Property search notification failed:", error);
  }
}
