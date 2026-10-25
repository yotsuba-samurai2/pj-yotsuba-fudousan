import { z } from "zod";
import { propertyRecoveryRefSchema, propertyRecoveryResponseSchema, type PropertyRecoveryCommand, type PropertyRecoveryRef, type PropertyRecoverySummary } from "./property-recovery-contract";
import type { PropertyHeldReceipt } from "./property-write-contract";

export type RecoveryStorage = Pick<Storage, "getItem" | "setItem">;
export type RecoveryTransport = (command: Readonly<PropertyRecoveryCommand>) => Promise<Response>;
type State = Readonly<{ refs: readonly PropertyRecoveryRef[]; selected: string | null; phase: "idle" | "busy" | "ready" | "unknown" | "forbidden";
  summary: PropertyRecoverySummary | null; heldReceipt: PropertyHeldReceipt | null; message: string; storageReady: boolean; capacityReached: boolean }>;
const storedSchema = z.array(propertyRecoveryRefSchema).max(50);
const resolved = (s: PropertyRecoverySummary | null) => !!s && s.cache.status === "acknowledged" && ["acknowledged", "not_required"].includes(s.notification.status);

/** Persists identifiers only, in the current operator/property namespace. Never saves patch/token/private fields. */
export function createPropertyRecoverySession(options: { propertyId: string; operatorId: string; storage?: RecoveryStorage; send: RecoveryTransport }) {
  const propertyId = z.uuid().parse(options.propertyId).toLowerCase(), operatorId = z.uuid().parse(options.operatorId).toLowerCase();
  const key = `yotsuba:property-recovery:v1:${operatorId}:${propertyId}`;
  const readRefs = () => {
    if (!options.storage) throw new Error("STORAGE_UNAVAILABLE");
    const raw = options.storage.getItem(key), saved = storedSchema.parse(raw === null ? [] : JSON.parse(raw));
    if (saved.some(r => r.propertyId !== propertyId) || new Set(saved.map(r => r.requestId)).size !== saved.length) throw new Error("INVALID_REFS");
    return saved;
  };
  let refs: PropertyRecoveryRef[] = [], storageReady = false;
  try {
    refs = readRefs();
    storageReady = true;
  } catch { refs = []; }
  const listeners = new Set<() => void>();
  let state: State = Object.freeze({ refs, selected: refs.at(-1)?.requestId ?? null, phase: "idle", summary: null, heldReceipt: null, storageReady, capacityReached: refs.length >= 50,
    message: storageReady ? "" : "受付番号を保持できません。画面を開き直してから保存してください。" });
  const emit = (patch: Partial<State>) => { state = Object.freeze({ ...state, ...patch }); for (const listener of listeners) listener(); return state; };
  async function run(operation: PropertyRecoveryCommand["operation"]) {
    if (!state.selected || state.phase === "busy") return state;
    if (operation !== "status") {
      if (state.phase !== "ready" || !state.summary || !["pending", "running"].includes(state.summary[operation].status)) return state;
      if (operation === "notification" && state.summary.cache.status !== "acknowledged") return state;
    }
    const requestId = state.selected;
    emit({ phase: "busy", heldReceipt: null, message: "受付記録の状態を確認しています。" });
    try {
      const response = await options.send(Object.freeze({ propertyId, requestId, operation }));
      if (response.status === 401 || response.status === 403) return emit({ phase: "forbidden", summary: null, heldReceipt: null, message: "この操作の権限を確認できません。再ログイン後に状態を照合してください。" });
      const result = propertyRecoveryResponseSchema.safeParse(await response.json());
      if (response.status !== 200 || !result.success || result.data.propertyId !== propertyId || result.data.requestId !== requestId) throw new Error("UNKNOWN_RESULT");
      if (result.data.outcome === "confirmed_held") {
        if (operation !== "status") throw new Error("UNEXPECTED_HELD_RECEIPT");
        const { propertyId, requestId, reason, resultVersion } = result.data;
        return emit({ phase: "ready", summary: null, heldReceipt: { propertyId, requestId, reason, resultVersion },
          message: "この要求は保存を保留した記録を確認しました。この要求による物件更新はありません。受付番号を一覧から外してもサーバーの記録は残ります。" });
      }
      if (result.data.outcome === "unknown") throw new Error("UNKNOWN_EFFECT_OUTCOME");
      return emit({ phase: "ready", summary: result.data.summary, heldReceipt: null, message: result.data.outcome === "held" ? "処理は保留されています。状態を確認してください。"
        : resolved(result.data.summary) ? "保存後の処理の受領を確認しました。公開画面への反映は未確認です。"
        : "保存済みの要求を確認しました。未完了の処理だけを再開できます。公開反映は未確認です。" });
    } catch { return emit({ phase: "unknown", summary: null, heldReceipt: null, message: "受付記録または処理結果を確認できません。保存失敗とは確定していません。状態を照合してください。" }); }
  }
  function removeSelected(message: string) {
    try {
      const next = readRefs().filter(r => r.requestId !== state.selected); options.storage!.setItem(key, JSON.stringify(next));
      if (options.storage!.getItem(key) !== JSON.stringify(next)) throw new Error("REFERENCE_NOT_PERSISTED");
      emit({ refs: next, selected: next.at(-1)?.requestId ?? null, phase: "idle", summary: null, heldReceipt: null, storageReady: true, capacityReached: next.length >= 50, message }); return true;
    } catch { emit({ storageReady: false, message: "受付番号の一覧を更新できませんでした。" }); return false; }
  }
  return {
    getSnapshot: () => state,
    subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
    remember(raw: PropertyRecoveryRef) {
      const ref = propertyRecoveryRefSchema.safeParse(raw);
      if (!state.storageReady || !ref.success || ref.data.propertyId !== propertyId || state.phase === "busy") return false;
      try {
        const saved = readRefs(), known = saved.some(r => r.requestId === ref.data.requestId);
        if (!known && saved.length >= 50) { emit({ refs: saved, capacityReached: true, message: "受付番号の一覧が上限です。状態を照合し、完了または保留が確定した番号を整理してから保存してください。" }); return false; }
        const next = known ? saved : [...saved, ref.data];
        storedSchema.parse(next); options.storage!.setItem(key, JSON.stringify(next));
        if (options.storage!.getItem(key) !== JSON.stringify(next)) throw new Error("REFERENCE_NOT_PERSISTED");
        emit({ refs: next, selected: ref.data.requestId, phase: "idle", summary: null, heldReceipt: null, capacityReached: next.length >= 50, message: "保存結果を確認してから公開処理を再開します。" }); return true;
      } catch { emit({ storageReady: false, message: "受付番号を保持できないため、物件の保存を開始していません。" }); return false; }
    },
    select(requestId: string) { if (state.phase !== "busy" && state.refs.some(r => r.requestId === requestId)) emit({ selected: requestId, phase: "idle", summary: null, heldReceipt: null, message: "状態を照合してください。" }); },
    inspect: () => run("status"),
    resume: (kind: "cache" | "notification") => run(kind),
    forgetCompleted() {
      if (state.phase !== "ready" || !resolved(state.summary)) return false;
      return removeSelected("完了した受付番号をこの画面の一覧から外しました。");
    },
    forgetConfirmedHeld() {
      if (state.phase !== "ready" || !state.heldReceipt || state.heldReceipt.propertyId !== propertyId || state.heldReceipt.requestId !== state.selected) return false;
      return removeSelected("保留が確定した受付番号をこの画面の一覧から外しました。サーバーの記録は残っています。");
    },
  };
}
export type PropertyRecoverySession = ReturnType<typeof createPropertyRecoverySession>;
