import { z } from "zod";
import { mailReviewCommandSchema, mailReviewReferenceSchema, mailReviewResponseSchema, mailReviewInspectionResponseSchema,
  type MailReviewCommand, type MailReviewReference, type MailReviewResult, type MailReviewInspection } from "./mail-review-contract";
import type { RecoveryStorage } from "./property-recovery-session";

export type MailReviewTransport = (action: "apply" | "reconcile" | "inspect", input: Readonly<MailReviewCommand | MailReviewReference>) => Promise<Response>;
type Head = Extract<MailReviewInspection, { status: "present" }>;
type State = Readonly<{ phase: "idle" | "busy" | "unknown" | "not_observed" | "recorded" | "held" | "forbidden" | "blocked";
  command: Readonly<MailReviewCommand> | null; result: MailReviewResult | null; head: Head | null; message: string; storageReady: boolean }>;
const savedSchema = z.object({ schemaVersion: z.literal(1), command: mailReviewCommandSchema }).strict();
const uncertain = "結果を確認できません。新しい要求を作らず、保存した要求の結果を照合してください。";

/** One tab/operator/property/review. Only immutable request references are retained; no token, patch or source text. */
export function createMailReviewSession(options: { reference: MailReviewReference; operatorId: string; storage?: RecoveryStorage;
  send: MailReviewTransport; newRequestId?: () => string }) {
  const reference = mailReviewReferenceSchema.parse(options.reference), operatorId = z.uuid().parse(options.operatorId).toLowerCase();
  const key = `yotsuba:mail-review:v1:${operatorId}:${reference.propertyId}:${reference.reviewRef}:${reference.reviewHash}`;
  const sameReference = (r: MailReviewReference) => r.propertyId === reference.propertyId && r.reviewRef === reference.reviewRef && r.reviewHash === reference.reviewHash;
  let saved: string | null = null, command: MailReviewCommand | null = null, storageReady = false, inFlight = false;
  try {
    if (!options.storage) throw new Error("STORAGE_UNAVAILABLE");
    saved = options.storage.getItem(key);
    if (saved !== null) {
      if (saved.length > 4096) throw new Error("INVALID_REFERENCE");
      command = savedSchema.parse(JSON.parse(saved)).command;
      if (!sameReference(command)) throw new Error("REFERENCE_MISMATCH");
    }
    storageReady = true;
  } catch { command = null; }
  let state: State = Object.freeze({ phase: storageReady ? command ? "unknown" : "idle" : "blocked", command, result: null, head: null, storageReady,
    message: storageReady ? command ? "保存した要求の結果を照合します。" : "準備済みの確認記録を登録できます。" : "要求を保持できないため、登録・撤回を開始できません。" });
  const listeners = new Set<() => void>();
  const emit = (patch: Partial<State>) => { state = Object.freeze({ ...state, ...patch }); for (const fn of listeners) fn(); return state; };
  const unchangedStorage = () => options.storage && options.storage.getItem(key) === saved;
  function remember(next: MailReviewCommand) {
    try {
      if (!state.storageReady || !unchangedStorage()) throw new Error("REFERENCE_CHANGED");
      const raw = JSON.stringify({ schemaVersion: 1, command: next }); options.storage!.setItem(key, raw);
      if (options.storage!.getItem(key) !== raw) throw new Error("REFERENCE_NOT_PERSISTED");
      saved = raw; command = Object.freeze(next); emit({ command, result: null, head: null }); return true;
    } catch { emit({ phase: "blocked", storageReady: false, head: null, message: "要求の保存状態が変わりました。画面を開き直し、結果を照合してください。" }); return false; }
  }
  async function exclusive(fn: () => Promise<void>) {
    if (inFlight) return state;
    inFlight = true;
    try { await fn(); }
    catch { emit({ phase: "unknown", head: null, result: null, message: uncertain }); }
    finally { inFlight = false; }
    return state;
  }
  async function inspect() {
    const response = await options.send("inspect", Object.freeze({ ...reference }));
    if ([401, 403].includes(response.status)) {
      emit({ phase: "forbidden", head: null, message: "権限を確認できません。再ログイン後に結果を照合してください。" }); return;
    }
    const parsed = mailReviewInspectionResponseSchema.safeParse(await response.json());
    if (!parsed.success || !sameReference(parsed.data) || parsed.data.result.status !== "present" || response.status !== 200) {
      emit({ head: null, message: state.command ? state.message + " 現在の確認記録は未確認です。" : "現在の確認記録は未確認です。登録時にサーバーで根拠を再検査します。" }); return;
    }
    emit({ head: Object.freeze(parsed.data.result) });
  }
  async function perform(action: "apply" | "reconcile") {
    if (!command) return;
    if (action === "apply" && !unchangedStorage()) {
      emit({ phase: "blocked", storageReady: false, head: null, message: "保存した要求が変わりました。画面を開き直して結果を照合してください。" }); return;
    }
    const sent = command;
    emit({ phase: "busy", result: null, head: null, message: "要求の結果を照合しています。" });
    const response = await options.send(action, sent);
    if ([401, 403].includes(response.status)) {
      emit({ phase: "forbidden", head: null, message: "権限を確認できません。再ログイン後に結果を照合してください。" }); return;
    }
    const parsed = mailReviewResponseSchema.safeParse(await response.json());
    if (!parsed.success || parsed.data.propertyId !== reference.propertyId || parsed.data.requestId !== sent.requestId) throw new Error("UNKNOWN_RESPONSE");
    const result = parsed.data.result;
    if (response.status !== (result.status === "recorded" ? 200 : result.status === "held" ? 409 : 503)) throw new Error("UNKNOWN_RESPONSE");
    if (result.status === "recorded") {
      if (result.requestId !== sent.requestId || (sent.operation === "register" ? result.event !== "registered" || result.revision !== 1
        : result.event === "registered" || result.revision !== sent.expectedRevision + (result.event === "revoked" ? 1 : 0)
          || result.event === "already_revoked" && result.headHash !== sent.expectedHeadHash)) throw new Error("UNEXPECTED_RECEIPT");
      emit({ phase: "recorded", result, message: result.event === "registered" ? "確認記録の登録を受領しました。物件への反映・掲載許可は別に検査します。"
        : "確認記録の撤回を受領しました。既に反映された物件は自動では戻りません。" });
    } else if (result.status === "held") {
      const notObserved = action === "reconcile" && result.reason === "RECEIPT_NOT_FOUND";
      emit({ phase: notObserved ? "not_observed" : "held", result, message: notObserved
        ? "受領記録はまだ見つかりません。未実行とは確定していません。同じ要求IDで再送できます。"
        : "操作は保留されました。現在の確認記録と権限・根拠を確認してください。" });
    } else emit({ phase: "unknown", result, message: uncertain });
    // Read current state; receipt.current is only the historic head/hash comparison, never an approval flag.
    if (result.status !== "unknown") await inspect();
  }
  const canRegister = () => state.storageReady && !command && !["busy", "forbidden"].includes(state.phase) && !state.head;
  const canRevoke = () => state.storageReady && !["busy", "forbidden"].includes(state.phase) && state.head?.reviewStatus === "active"
    && state.head.revision < 2147483647 && (!command || state.result?.status === "recorded"
      || state.result?.status === "held" && ["REVIEW_HEAD_CONFLICT", "REVIEW_REFERENCE_EXISTS"].includes(state.result.reason));
  async function start(operation: "register" | "revoke") {
    if (inFlight) return state;
    if (operation === "register" ? !canRegister() : !canRevoke()) return state;
    const head = state.head;
    return exclusive(async () => {
      const parsed = mailReviewCommandSchema.safeParse({ ...reference, requestId: (options.newRequestId ?? (() => crypto.randomUUID()))(), operation,
        ...(operation === "register" ? { expectedRevision: 0 } : { expectedRevision: head!.revision, expectedHeadHash: head!.headHash }) });
      if (!parsed.success || !remember(parsed.data)) return;
      await perform("apply");
    });
  }
  return { getSnapshot: () => state, subscribe: (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; },
    canRegister, canRevoke, register: () => start("register"), revoke: () => start("revoke"),
    refresh: () => exclusive(async () => {
      if (command && !["recorded", "held"].includes(state.phase)) await perform("reconcile");
      else { const phase = state.phase; emit({ phase: "busy", head: null }); await inspect(); if (state.phase === "busy") emit({ phase: phase === "forbidden" ? "idle" : phase }); }
    }),
    reconcile: () => exclusive(async () => { if (command) await perform("reconcile"); else await inspect(); }),
    retry: () => state.phase === "not_observed" ? exclusive(() => perform("apply")) : Promise.resolve(state),
  };
}
export type MailReviewSession = ReturnType<typeof createMailReviewSession>;
