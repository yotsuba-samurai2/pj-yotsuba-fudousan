// Next.js 16.2.10のRoute Handlerは失効をpendingWaitUntilへ送るため、
// next/cacheを呼ぶだけでは失効ストレージの障害をHTTPレスポンスに反映できない。
// 公開APIにはflushがないので内部依存をここに限定し、Nextのバージョンを固定する。
import { workAsyncStorage } from "next/dist/server/app-render/work-async-storage.external";
import { executeRevalidates } from "next/dist/server/revalidation-utils";

/** 失効の実行完了前にはmutation APIを成功にしない。失敗は呼び出し元へ伝播する。 */
export async function flushRevalidation(): Promise<void> {
  const store = workAsyncStorage.getStore();
  if (!store) throw new Error("Revalidation requires a Next.js request context");
  const pending = {
    pendingRevalidatedTags: store.pendingRevalidatedTags ?? [],
    pendingRevalidates: store.pendingRevalidates ?? {},
    pendingRevalidateWrites: store.pendingRevalidateWrites ?? [],
  };
  // Route Handler終了時の二重実行（成功応答後の失敗）を避ける。
  store.pendingRevalidatedTags = [];
  store.pendingRevalidates = {};
  store.pendingRevalidateWrites = [];
  await executeRevalidates(store, pending);
}
