import { propertyWriteCommandSchema, propertyWriteResponseSchema, type PropertyWriteCommand } from "./property-write-contract";
import type { PropertyInput } from "./property-shared";

type Phase = "editing" | "busy" | "unknown" | "not_observed" | "saved" | "changed" | "missing" | "held";
export type PropertyEditState = Readonly<{ phase: Phase; requestId: string | null; message: string }>;
export type PropertyWriteTransport = (command: Readonly<PropertyWriteCommand>) => Promise<Response>;
const uncertain = "保存結果を確認できません。この画面を閉じず、同じ要求の結果を照合してください。";

/** One reviewed edit, one immutable request. Transport is injected; never reads credentials or persists raw edits. */
export function createPropertyEditSession(options: {
  propertyId: string;
  expectedUpdatedAt: string;
  send: PropertyWriteTransport;
  newRequestId?: () => string;
  rememberRequest?: (ref: { propertyId: string; requestId: string }) => boolean;
}) {
  let command: Omit<PropertyWriteCommand, "operation"> | undefined;
  let state: PropertyEditState = Object.freeze({ phase: "editing", requestId: null, message: "" });
  const listeners = new Set<() => void>();
  const emit = (phase: Phase, message: string) => {
    state = Object.freeze({ phase, requestId: command?.requestId ?? null, message });
    for (const listener of listeners) listener();
    return state;
  };
  async function run(operation: "apply" | "reconcile") {
    if (!command || state.phase === "busy") return state;
    emit("busy", operation === "apply" ? "保存結果を確認しています。" : "同じ要求の結果を照合しています。");
    try {
      const response = await options.send(Object.freeze({ ...command, operation }));
      const parsed = propertyWriteResponseSchema.safeParse(await response.json());
      if (!parsed.success || parsed.data.propertyId !== command.propertyId || parsed.data.requestId !== command.requestId ||
        ("requestId" in parsed.data.result && parsed.data.result.requestId !== command.requestId)) return emit("unknown", uncertain);
      const result = parsed.data.result;
      const status = result.status === "applied" ? 200 : result.status === "held" ? 409 : 503;
      if (response.status !== status) return emit("unknown", uncertain);
      if (result.status === "unknown") return emit(operation === "reconcile" && result.reason === "REQUEST_NOT_OBSERVED" ? "not_observed" : "unknown",
        result.reason === "REQUEST_NOT_OBSERVED" ? "保存記録はまだ見つかりません。未実行とは確定していません。同じ内容・要求IDで再送できます。" : uncertain);
      if (result.status === "held" && result.reason === "RECEIPT_INTEGRITY_ERROR") return emit("unknown", uncertain);
      if (result.status === "held") return emit("held", result.reason === "VERSION_CONFLICT"
        ? "別の編集が先に保存されています。最新の物件を開き、変更内容を確認してください。"
        : result.reason === "PUBLICATION_GATE_REJECTED" ? "公開前の検査で保存を保留しました。入力内容を確認してください。"
        : "この要求は保留されました。最新の物件と入力内容を確認してください。");
      if (result.resultVersion <= command.expectedUpdatedAt) return emit("unknown", uncertain);
      if (result.current === "changed") return emit("changed", "この要求の保存後に別の編集がありました。最新の物件を確認してください。公開反映は未確認です。");
      if (result.current === "missing") return emit("missing", "この要求の保存記録はありますが、現在の物件を確認できません。公開反映は未確認です。");
      return emit("saved", "この要求の保存と現在の内容の一致を確認しました。公開反映は未確認です。");
    } catch { return emit("unknown", uncertain); }
  }
  return {
    getSnapshot: () => state,
    subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
    async submit(input: PropertyInput) {
      if (command || state.phase !== "editing") return state;
      try {
        // PropertyForm emits a full edit; omitted optional values mean clear, not preserve.
        const patch = { ...input, priceNote: input.priceNote ?? null, publishedAt: input.publishedAt ?? null,
          translations: input.translations ?? null, internal: input.internal ?? null };
        const parsed = propertyWriteCommandSchema.safeParse({ operation: "apply", propertyId: options.propertyId, requestId: (options.newRequestId ?? (() => crypto.randomUUID()))(),
          expectedUpdatedAt: options.expectedUpdatedAt, patchJson: JSON.stringify(patch) });
        if (!parsed.success) return emit("editing", "更新情報を準備できません。最新の物件を開き直してください。");
        const { propertyId, requestId, expectedUpdatedAt, patchJson } = parsed.data;
        if (options.rememberRequest && !options.rememberRequest({ propertyId, requestId })) return emit("editing", "受付番号を保持できないため、物件の保存を開始していません。");
        command = Object.freeze({ propertyId, requestId, expectedUpdatedAt, patchJson });
      } catch { return emit("editing", "更新情報を準備できません。最新の物件を開き直してください。"); }
      return run("apply");
    },
    reconcile: () => command && state.phase !== "busy" ? run("reconcile") : Promise.resolve(state),
    retry: () => state.phase === "not_observed" ? run("apply") : Promise.resolve(state),
  };
}
