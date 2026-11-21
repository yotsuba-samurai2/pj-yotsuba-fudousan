/** Staff UI only. No provider access, no publishing authority, no public-display verification. */
export type BatchResult = { action: string; slug?: string; reasons?: string[]; receiptIntent?: string };
export type ReceiptStore = Pick<Storage, "getItem" | "setItem" | "removeItem">;
type Finished = { intent: string; state: "saved" | "reviewed" };
type Receipt = { intent: string; state: "sending" | "saved" | "refresh_pending" | "reviewed"; recent?: Finished[] };
const historyLimit = 32;
/** A second signed-in operator does not inherit this operator's write markers. */
export function operatorReceipts(raw: ReceiptStore, uid: string): ReceiptStore {
  if (!/^[a-z0-9-]{1,128}$/i.test(uid)) throw Error("操作者を識別できません。");
  const prefix = "yotsuba:operator:"+uid+":";
  return { getItem:k=>raw.getItem(prefix+k), setItem:(k,v)=>raw.setItem(prefix+k,v), removeItem:k=>raw.removeItem(prefix+k) };
}
type Reply = { ok: boolean; status: number; body: unknown };
const safeSlug = /^rent-[a-f0-9]{24}$/;
const safeDigest = /^[a-f0-9]{64}$/;
const key = (slug: string) => "yotsuba:rental-write:v1:" + slug;
const isObject = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
export const isReady = (r?: BatchResult) => r?.action === "ready" || r?.action === "ready-close";
const held = (message: string, slug?: string): BatchResult => ({ action: "held", slug, reasons: [message] });

/** Sort keys for the fingerprint only. The actual JSON sent to the server is not rewritten. */
export async function intentDigest(record: unknown, mode: string, operation: string): Promise<string> {
  function canonical(v: unknown): unknown {
    if (Array.isArray(v)) return v.map(canonical);
    if (!isObject(v)) return v;
    return Object.fromEntries(Object.keys(v).sort().map(k => [k, canonical(v[k])]));
  }
  const bytes = new TextEncoder().encode(JSON.stringify([mode, operation, canonical(record)]));
  return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)), x => x.toString(16).padStart(2, "0")).join("");
}
type SelectedFile = Pick<File,"name"|"size"|"arrayBuffer">;
export function batchAssets<T extends SelectedFile>(files: readonly T[]) {
  const cache = new Map<T, Promise<string>>();
  function file(ref: string): T {
    const found = files.filter(f => f.name === ref.slice(6));
    if (found.length !== 1) throw Error("各写真・間取りに一致するファイルを1点ずつ選択してください。同名ファイルは使用できません。");
    if (found[0].size > 10*1024*1024) throw Error("画像は10MB以下にしてください。");
    return found[0];
  }
  async function signature(raw: unknown, mode: string, op: string, closing: boolean) {
    const refs = !closing && isObject(raw) && isObject(raw.property) && Array.isArray(raw.property.images)
      ? [...new Set(raw.property.images.flatMap((image:unknown) => isObject(image) && typeof image.url === "string" && image.url.startsWith("asset:") ? [image.url] : []))].sort() : [];
    if (!closing && isObject(raw) && isObject(raw.property) && Array.isArray(raw.property.images)) {
      const roles = new Map<string,unknown>();
      for (const i of raw.property.images) if (isObject(i) && typeof i.url === "string" && i.url.startsWith("asset:")) {
        if (roles.has(i.url) && roles.get(i.url) !== i.kind) throw Error("同じファイルを写真と間取りに兼用できません。");
        roles.set(i.url,i.kind);
      }
    }
    const assets: [string,string][] = [];
    // Sequential reads cap peak memory use; cache digests, not the bytes.
    for (const ref of refs) {
      const f = file(ref);
      if (!cache.has(f)) cache.set(f, f.arrayBuffer().then(bytes=>crypto.subtle.digest("SHA-256",bytes)).then(hash=>Array.from(new Uint8Array(hash), x=>x.toString(16).padStart(2,"0")).join("")));
      assets.push([ref, await cache.get(f)!]);
    }
    return intentDigest([raw,assets], mode, op);
  }
  return {file,signature};
}
function load(store: ReceiptStore, slug: string): Receipt | null {
  const raw = store.getItem(key(slug));
  if (raw === null) return null;
  const v: unknown = JSON.parse(raw);
  if (!isObject(v) || !safeDigest.test(String(v.intent)) ||
      !["sending","saved","refresh_pending","reviewed"].includes(String(v.state))) throw Error("INVALID_CHECKPOINT");
  if (v.recent !== undefined && (!Array.isArray(v.recent) || v.recent.length > historyLimit ||
      v.recent.some(p => !isObject(p) || typeof p.intent !== "string" || !safeDigest.test(p.intent) || (p.state !== "saved" && p.state !== "reviewed")))) throw Error("INVALID_CHECKPOINT");
  return v as Receipt;
}
function fromReceipt(r: Receipt | null, slug: string, intent: string): BatchResult | null {
  if (!r) return null;
  if (r.state === "sending" || r.state === "refresh_pending") {
    return { action: r.state === "sending" ? "readback_required" : "saved_refresh_pending", slug, receiptIntent: r.intent };
  }
  const seen = r.intent === intent ? r : r.recent?.find(p => p.intent === intent);
  if (!seen) return null;
  return { action: seen.state === "saved" ? "previously_saved" : "already_reviewed", slug };
}
const storageHeld = (slug: string) => held("このタブの送信記録を確認・保存できません。再送せず、管理画面を読み戻してください。", slug);
export function inspectReceipt(store: ReceiptStore, slug: string, intent: string): BatchResult | null {
  if (!safeSlug.test(slug) || !safeDigest.test(intent)) return held("対象を識別できないため送信しません。");
  try { return fromReceipt(load(store, slug), slug, intent); } catch { return storageHeld(slug); }
}
/** Called only after the operator has compared a fresh inventory and explicitly acknowledged. Never a write authorization. */
export function acknowledgeReadback(store: ReceiptStore, slug: string, seenIntent: string, finding: "reconciled"|"confirmed_not_saved" = "reconciled"): boolean {
  if (!safeSlug.test(slug) || !safeDigest.test(seenIntent)) return false;
  try {
    const r = load(store, slug);
    if (!r || r.intent !== seenIntent || (r.state !== "sending" && r.state !== "refresh_pending") ||
        (finding === "confirmed_not_saved" && r.state === "refresh_pending")) return false;
    store.setItem(key(slug), JSON.stringify({ ...r, state:"reviewed" })); return true;
  } catch { return false; }
}

/** Write-ahead marker in the current browser tab. No JSON payload, evidence, name, image, token or external ID in storage. */
export async function applyWithReceipt({ store, slug, intent, closing, send }: {
  store: ReceiptStore; slug: string; intent: string; closing: boolean; send: () => Promise<Reply>;
}): Promise<BatchResult> {
  if (!safeSlug.test(slug) || !safeDigest.test(intent)) return held("対象を識別できないため送信しません。");
  let past: Receipt | null;
  let recent: Finished[];
  try {
    past = load(store, slug);
    const existing = fromReceipt(past, slug, intent); if (existing) return existing;
    recent = [...(past?.recent ?? [])];
    if (past && (past.state === "saved" || past.state === "reviewed")) {
      const prior:Finished = {intent:past.intent,state:past.state};
      recent = [...recent.filter(p => p.intent !== prior.intent), prior].slice(-historyLimit);
    }
    store.setItem(key(slug), JSON.stringify({intent, state:"sending",recent}));
  } catch { return storageHeld(slug); } // Fail before the request, not after it.
  const unknown = (): BatchResult => ({action:"readback_required", slug, receiptIntent:intent});
  let response: Reply;
  try { response = await send(); } catch { return unknown(); }
  const value = response.body;
  if (!isObject(value)) return unknown();
  if (!response.ok && response.status === 503 && value.mutationSucceeded === true && value.publicationRefresh === "failed") {
    try { store.setItem(key(slug), JSON.stringify({intent, state:"refresh_pending",recent})); } catch { /* sending remains */ }
    return {action:"saved_refresh_pending", slug, receiptIntent:intent};
  }
  const a = value.action;
  const authDenied = !response.ok && [401,403].includes(response.status) && typeof value.error === "string";
  if ((response.ok && (a === "held" || a === "unchanged") && (value.slug === slug || (a === "held" && value.slug === undefined))) || authDenied) {
    // The existing import API explicitly refused the mutation, or nothing changed.
    try { if (past) store.setItem(key(slug), JSON.stringify(past)); else store.removeItem(key(slug)); }
    catch { return unknown(); }
    return authDenied ? held("ログイン又は権限を確認してください。", slug)
      : {action:String(a), slug, reasons:Array.isArray(value.reasons) ? value.reasons.filter((s): s is string => typeof s === "string") : undefined};
  }
  if (!response.ok || value.slug !== slug || !(closing ? a === "closed" : a === "created" || a === "updated")) return unknown();
  try { store.setItem(key(slug), JSON.stringify({intent, state:"saved",recent})); }
  catch { return {action:"saved_readback_required", slug, receiptIntent:intent}; }
  return {action:String(a), slug};
}

/** Only the exact target/action approved in the visible dry run can be applied; fresh preflight remains mandatory. */
export async function runReviewedBatch<T>({records, approved, check, apply, onProgress}: {
  records: readonly T[]; approved?: readonly BatchResult[]; check: (r:T) => Promise<BatchResult>;
  apply: (r:T, checked:BatchResult) => Promise<BatchResult>; onProgress?:(snapshot:BatchResult[])=>void;
}): Promise<BatchResult[]> {
  const results: BatchResult[] = [];
  const counts = new Map<string, number>();
  for (const r of approved ?? []) if (r.slug) counts.set(r.slug,(counts.get(r.slug) ?? 0)+1);
  for (const [i, record] of records.entries()) {
    let result: BatchResult;
    try {
      const prior = approved?.[i];
      if (approved && (!prior || !isReady(prior))) result = prior ?? held("この行は事前確認されていません。");
      else if (approved && (!prior?.slug || (counts.get(prior.slug) ?? 0) !== 1)) result = held("対象が不明又は同じ住戸が複数行あります。1住戸に整理して再確認してください。", prior?.slug);
      else {
        const fresh = await check(record);
        if (!approved || !isReady(fresh)) result = fresh;
        else if (!prior || fresh.action !== prior.action || fresh.slug !== prior.slug)
          result = held("事前確認した住戸又は操作と一致しません。再確認してから反映してください。", prior?.slug);
        else result = await apply(record, fresh);
      }
    } catch (e) { result = held(e instanceof Error ? e.message : "処理に失敗しました。"); }
    results.push(result); onProgress?.([...results]);
  }
  return results;
}

const reportActions = new Set(["ready","ready-close","held","created","updated","closed","unchanged","saved_refresh_pending","saved_readback_required","readback_required","previously_saved","already_reviewed","confirmed_not_saved"]);
export function summaryReport(v: { startedAt:string; mode:string; operation:string; stage:"check"|"apply"; total:number; results:readonly BatchResult[] }) {
  return { version:1, medium:"yotsuba", publicReadback:"not_verified", startedAt:v.startedAt, mode:v.mode, operation:v.operation, stage:v.stage,
    rows:Array.from({length:v.total},(_,i)=>{
      const row=v.results[i];
      return {row:i+1,slug:row?.slug && safeSlug.test(row.slug) ? row.slug : null,action:row ? (reportActions.has(row.action) ? row.action : "readback_required") : "not_observed"};
    }) };
}
