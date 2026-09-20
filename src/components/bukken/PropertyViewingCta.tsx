"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type Props = { propertyTitle: string; propertyUrl: string };

const inputClass =
  "mt-1 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

export function PropertyViewingCta({ propertyTitle, propertyUrl }: Props) {
  const [foreign, setForeign] = useState("");
  const [pet, setPet] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", contractType: "", residents: "", residenceStatus: "", petDetails: "", date1: "", date2: "", date3: "", message: "" });
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("sending");
    const details = [
      `物件: ${propertyTitle}`,
      `物件URL: ${propertyUrl}`,
      `契約主体: ${form.contractType}`,
      `入居予定人数: ${form.residents}名`,
      `外国籍: ${foreign === "yes" ? `はい（在留資格: ${form.residenceStatus}）` : "いいえ"}`,
      `ペット: ${pet === "yes" ? form.petDetails : "なし"}`,
      `内見希望: ${[form.date1, form.date2, form.date3].filter(Boolean).join(" / ")}`,
      form.message ? `質問・連絡事項: ${form.message}` : "",
    ].filter(Boolean).join("\n");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, category: "rental", source: "", message: details, business: "realestate" }),
      });
      if (!response.ok) throw new Error("send failed");
      setState("sent");
    } catch {
      setState("error");
    }
  };

  if (state === "sent") {
    return <section className="mt-10 rounded-2xl border border-primary/30 bg-primary-tint p-6" aria-live="polite"><h2 className="font-serif text-xl font-semibold text-ink">内見希望を受け付けました</h2><p className="mt-2 text-sm leading-6 text-text">募集状況と内見可能日を確認し、メールと電話でご連絡します。</p></section>;
  }

  return (
    <section className="mt-10 rounded-2xl border border-primary/30 bg-primary-tint p-5 sm:p-7" aria-labelledby="viewing-cta-title">
      <p className="text-xs font-semibold tracking-wide text-primary">内見・ご質問</p>
      <h2 id="viewing-cta-title" className="mt-1 font-serif text-2xl font-semibold text-ink">内見可能日をお知らせください</h2>
      <p className="mt-2 text-sm leading-6 text-text-muted">ご希望の日程と契約条件をお送りください。募集状況を確認して担当者からご連絡します。</p>
      {state === "error" && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">送信できませんでした。時間をおいて再度お試しください。</p>}
      <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={submit}>
        <label className="text-sm font-medium">お名前<span className="text-red-600"> *</span><input required value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass} /></label>
        <label className="text-sm font-medium">メールアドレス<span className="text-red-600"> *</span><input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} /></label>
        <label className="text-sm font-medium">電話番号<span className="text-red-600"> *</span><input required type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} /></label>
        <label className="text-sm font-medium">契約主体<span className="text-red-600"> *</span><select required value={form.contractType} onChange={(e) => update("contractType", e.target.value)} className={inputClass}><option value="">選択してください</option><option value="個人">個人</option><option value="法人">法人</option></select></label>
        <label className="text-sm font-medium">入居予定人数<span className="text-red-600"> *</span><input required min="1" type="number" inputMode="numeric" value={form.residents} onChange={(e) => update("residents", e.target.value)} className={inputClass} /></label>
        <label className="text-sm font-medium">外国籍の方ですか<span className="text-red-600"> *</span><select required value={foreign} onChange={(e) => setForeign(e.target.value)} className={inputClass}><option value="">選択してください</option><option value="no">いいえ</option><option value="yes">はい</option></select></label>
        {foreign === "yes" && <label className="text-sm font-medium sm:col-span-2">在留資格の種類<span className="text-red-600"> *</span><input required value={form.residenceStatus} onChange={(e) => update("residenceStatus", e.target.value)} placeholder="例：技術・人文知識・国際業務" className={inputClass} /></label>}
        <label className="text-sm font-medium">ペット<span className="text-red-600"> *</span><select required value={pet} onChange={(e) => setPet(e.target.value)} className={inputClass}><option value="">選択してください</option><option value="no">なし</option><option value="yes">あり</option></select></label>
        {pet === "yes" && <label className="text-sm font-medium">種類・頭数<span className="text-red-600"> *</span><input required value={form.petDetails} onChange={(e) => update("petDetails", e.target.value)} placeholder="例：小型犬1匹" className={inputClass} /></label>}
        <fieldset className="sm:col-span-2"><legend className="text-sm font-medium">内見希望日時（第1希望は必須）</legend><div className="mt-1 grid gap-2 sm:grid-cols-3"><input required type="datetime-local" value={form.date1} onChange={(e) => update("date1", e.target.value)} className={inputClass} aria-label="内見第1希望" /><input type="datetime-local" value={form.date2} onChange={(e) => update("date2", e.target.value)} className={inputClass} aria-label="内見第2希望" /><input type="datetime-local" value={form.date3} onChange={(e) => update("date3", e.target.value)} className={inputClass} aria-label="内見第3希望" /></div></fieldset>
        <label className="text-sm font-medium sm:col-span-2">質問・連絡事項（任意）<textarea rows={3} value={form.message} onChange={(e) => update("message", e.target.value)} className={inputClass} /></label>
        <button type="submit" disabled={state === "sending"} className="sm:col-span-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-50">{state === "sending" ? "送信中…" : "内見希望を送る"}</button>
      </form>
    </section>
  );
}
