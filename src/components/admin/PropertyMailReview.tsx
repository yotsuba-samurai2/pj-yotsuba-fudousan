"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createMailReviewSession, type MailReviewTransport } from "@/lib/mail-review-session";
import type { MailReviewReference } from "@/lib/mail-review-contract";
import type { RecoveryStorage } from "@/lib/property-recovery-session";

export type PropertyMailReviewOptions = { operatorId: string; reference: MailReviewReference; storage?: RecoveryStorage; send: MailReviewTransport };
export default function PropertyMailReview({ propertyId, options, onReload }: { propertyId: string; options: PropertyMailReviewOptions; onReload: () => void }) {
  const [binding] = useState(() => {
    try { return { propertyId, operatorId: options.operatorId, reference: { ...options.reference }, session: createMailReviewSession(options) }; }
    catch { return null; }
  });
  const state = useSyncExternalStore(binding?.session.subscribe ?? (() => () => {}), binding?.session.getSnapshot ?? (() => null), binding?.session.getSnapshot ?? (() => null));
  const matches = !!binding && binding.propertyId === propertyId && binding.reference.propertyId === propertyId && options.reference.propertyId === propertyId && binding.operatorId === options.operatorId
    && binding.reference.reviewRef === options.reference.reviewRef && binding.reference.reviewHash === options.reference.reviewHash;
  // Reopening only reads; an in-flight request is recovered using its original identifier.
  useEffect(() => { if (matches) void binding.session.refresh(); }, [binding, matches]);
  if (!matches || !state) return <section role="alert"><p>物件・操作者・確認記録が変わりました。最新の画面を開き直してください。</p>
    <button type="button" onClick={onReload}>確認画面を開き直す</button></section>;
  const session = binding.session, busy = state.phase === "busy", head = state.head;
  return <section aria-label="物件取込の確認記録" className="my-4 rounded border p-4">
    <h2>物件取込の確認記録</h2>
    <p role="status" aria-live="polite">{state.message}</p>
    <p>確認番号：{binding.reference.reviewRef}</p>
    {state.command && <p className="text-xs text-text-muted">要求ID：{state.command.requestId}</p>}
    {head && <p>{head.reviewStatus === "revoked" ? "確認記録は撤回済みです。" : "登録済みの確認記録があります。"} 有効期限：{head.expiresAt}</p>}
    <button type="button" disabled={busy} onClick={() => { void session.refresh(); }}>確認記録の状態を照合</button>
    {session.canRegister() && <button type="button" onClick={() => { void session.register(); }}>準備済みの確認記録を登録</button>}
    {session.canRevoke() && <button type="button" onClick={() => { void session.revoke(); }}>この確認記録を撤回</button>}
    {state.phase === "not_observed" && <button type="button" onClick={() => { void session.retry(); }}>同じ確認要求を再送</button>}
    <p className="text-sm">この操作では物件を掲載しません。登録済みでも、実際の保存時に採用条件・許諾・素材を再検査します。</p>
    {state.phase === "held" && <button type="button" onClick={onReload}>最新の確認画面を開く</button>}
  </section>;
}
