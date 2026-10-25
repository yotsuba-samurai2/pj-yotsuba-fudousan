"use client";

import { useState, useSyncExternalStore } from "react";
import PropertyForm from "./PropertyForm";
import { createPropertyEditSession, type PropertyWriteTransport } from "@/lib/property-edit-session";
import type { AdminProperty } from "@/lib/property-shared";
import { createPropertyRecoverySession, type RecoveryStorage, type RecoveryTransport } from "@/lib/property-recovery-session";
import PropertyPublicationRecovery from "./PropertyPublicationRecovery";

/** Local composition only. No route/default transport; production editor remains unchanged. */
export default function PropertyRequestEditor({ initialData, send, onReload, recovery }: {
  initialData: AdminProperty;
  send: PropertyWriteTransport;
  onReload: () => void;
  recovery?: { operatorId: string; storage?: RecoveryStorage; send: RecoveryTransport };
}) {
  // Keep the reviewed property + transport together throughout an uncertain save.
  // onReload must mount a fresh editor after fetching the current property.
  const [binding] = useState(() => {
    const publication = recovery && createPropertyRecoverySession({ ...recovery, propertyId: initialData.id });
    return { property: structuredClone(initialData), operatorId: recovery?.operatorId, publication,
      session: createPropertyEditSession({ propertyId: initialData.id, expectedUpdatedAt: initialData.updatedAt ?? "", send, rememberRequest: publication?.remember }) };
  });
  const state = useSyncExternalStore(binding.session.subscribe, binding.session.getSnapshot, binding.session.getSnapshot);
  const recoveryState = useSyncExternalStore(binding.publication?.subscribe ?? (() => () => {}), binding.publication?.getSnapshot ?? (() => null), binding.publication?.getSnapshot ?? (() => null));
  if (binding.property.id !== initialData.id || binding.operatorId !== recovery?.operatorId) return <section role="alert">
    <p>物件または操作者が変わりました。現在の編集画面を開き直してください。</p><button type="button" onClick={onReload}>編集画面を開き直す</button>
  </section>;
  return <section>
    {state.message && <p role="status" aria-live="polite">{state.message}</p>}
    {state.requestId && <p className="text-xs text-text-muted">要求ID: {state.requestId}</p>}
    {binding.publication && <PropertyPublicationRecovery session={binding.publication} />}
    <fieldset disabled={state.phase !== "editing" || !!recoveryState && (!recoveryState.storageReady || recoveryState.capacityReached)}>
      <PropertyForm imageNetworkEnabled={false} initialData={binding.property} onSubmit={async input => { await binding.session.submit(input); }} />
    </fieldset>
    {state.phase !== "editing" && state.phase !== "busy" && <button type="button" onClick={() => { void binding.session.reconcile(); }}>保存結果を照合</button>}
    {state.phase === "not_observed" && <button type="button" onClick={() => { void binding.session.retry(); }}>同じ要求を再送</button>}
    {["saved", "changed", "missing", "held"].includes(state.phase) && <button type="button" onClick={onReload}>最新の物件を開く</button>}
  </section>;
}
