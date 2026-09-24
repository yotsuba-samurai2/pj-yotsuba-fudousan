"use client";
// ペット住宅フォームの部品（入力欄・隠し欄・完了表示・プライバシー表示）。見た目は GH 大家フォームにそろえる。
// クライアント安全：office 系を参照しない。
import type { ReactNode, RefObject } from "react";
import { LineLink } from "@/components/shared/LineLink";
import { LocaleLink } from "@/components/ui/LocaleLink";
import { HONEYPOT_FIELD, INQUIRY_RETENTION_LABEL_JA } from "@/lib/shared/inquiry-intake";

export const inputClass =
  "mt-1 w-full rounded-lg bg-surface px-4 py-3 text-sm outline-none transition-all duration-300 gradient-border-input";
const errorClass = "mt-1 text-xs text-red-500";
const labelClass = "block text-sm font-medium";

type FieldProps = { id: string; label: string; required?: boolean; hint?: string; error?: string; children: ReactNode };
export function Field({ id, label, required, hint, error, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label} {required && <span className="text-red-500">*</span>}
        {hint && <span className="ml-1 text-xs text-text-muted">{hint}</span>}
      </label>
      {children}
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}

type Option = { value: string; label: string };
export function Select({ id, value, onChange, options, placeholder = "選択してください" }: {
  id: string; value: string; onChange: (v: string) => void; options: Option[]; placeholder?: string;
}) {
  return (
    <select id={id} value={value} onChange={e => onChange(e.target.value)} className={inputClass}>
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

export const toOptions = <K extends string>(labels: Record<K, string>): Option[] =>
  (Object.entries(labels) as [K, string][]).map(([value, label]) => ({ value, label }));

/** 迷惑投稿よけの隠し欄（人には見えず、読み上げもしない）。 */
export function Honeypot({ inputRef }: { inputRef: RefObject<HTMLInputElement | null> }) {
  return (
    <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
      <label>
        この欄は空のままにしてください
        <input ref={inputRef} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}

export function ServerError({ message }: { message: string }) {
  if (!message) return null;
  return <div role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{message}</div>;
}

export function PrivacyNote({ fee }: { fee: string }) {
  return (
    <p className="text-xs leading-relaxed text-text-muted">
      送信いただいた情報は、ご相談への回答・対応のために利用し、当社のシステムに保存します。保存期間は受付から{INQUIRY_RETENTION_LABEL_JA}で、その後削除します（
      <LocaleLink href="/privacy-policy" className="text-primary underline">プライバシーポリシー</LocaleLink>
      ）。{fee}
    </p>
  );
}

export const submitClass =
  "gradient-line inline-flex min-h-[44px] items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50";

/** 完了表示（受付番号・この後の流れ）。URL は変えない。 */
export function Done({ receiptNo, next, lineLocation }: { receiptNo: string; next: string; lineLocation: string }) {
  return (
    <div role="status" className="mt-4 rounded-xl border border-primary/30 bg-primary-tint p-5">
      <p className="font-semibold text-ink">ご相談を受け付けました。</p>
      <p className="mt-2 text-sm">受付番号：<span className="font-mono font-bold">{receiptNo}</span></p>
      <p className="mt-2 text-sm leading-relaxed">{next} お問い合わせの際は、受付番号をお知らせください。</p>
      <LineLink
        location={lineLocation}
        page="pet_housing"
        className="mt-4 inline-flex min-h-[44px] items-center rounded-lg border border-primary px-5 py-3 text-sm font-semibold text-primary-dark transition-colors hover:bg-primary-dark hover:text-white"
      >
        LINEで連絡する
      </LineLink>
    </div>
  );
}
