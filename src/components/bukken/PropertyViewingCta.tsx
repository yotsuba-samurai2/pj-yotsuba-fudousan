"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { LangCode } from "@/config/languages";
import { propertyViewingLabels } from "@/lib/property-viewing-labels";

type Props = { propertyTitle: string; propertyUrl: string; locale: LangCode };

const inputClass =
  "mt-1 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

export function PropertyViewingCta({ propertyTitle, propertyUrl, locale }: Props) {
  const text = propertyViewingLabels[locale];
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
    return <section className="mt-10 rounded-2xl border border-primary/30 bg-primary-tint p-6" aria-live="polite"><h2 className="font-serif text-xl font-semibold text-ink">{text.successHeading}</h2><p className="mt-2 text-sm leading-6 text-text">{text.success}</p></section>;
  }

  return (
    <section className="mt-10 rounded-2xl border border-primary/30 bg-primary-tint p-5 sm:p-7" aria-labelledby="viewing-cta-title">
      <p className="text-xs font-semibold tracking-wide text-primary">{text.eyebrow}</p>
      <h2 id="viewing-cta-title" className="mt-1 font-serif text-2xl font-semibold text-ink">{text.heading}</h2>
      <p className="mt-2 text-sm leading-6 text-text-muted">{text.intro}</p>
      {state === "error" && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{text.error}</p>}
      <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={submit}>
        <label className="text-sm font-medium">{text.name}<span className="text-red-600"> *</span><input required value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass} /></label>
        <label className="text-sm font-medium">{text.email}<span className="text-red-600"> *</span><input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} /></label>
        <label className="text-sm font-medium">{text.phone}<span className="text-red-600"> *</span><input required type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} /></label>
        <label className="text-sm font-medium">{text.contract}<span className="text-red-600"> *</span><select required value={form.contractType} onChange={(e) => update("contractType", e.target.value)} className={inputClass}><option value="">{text.select}</option><option value="個人">{text.individual}</option><option value="法人">{text.company}</option></select></label>
        <label className="text-sm font-medium">{text.residents}<span className="text-red-600"> *</span><input required min="1" type="number" inputMode="numeric" value={form.residents} onChange={(e) => update("residents", e.target.value)} className={inputClass} /></label>
        <label className="text-sm font-medium">{text.foreign}<span className="text-red-600"> *</span><select required value={foreign} onChange={(e) => setForeign(e.target.value)} className={inputClass}><option value="">{text.select}</option><option value="no">{text.no}</option><option value="yes">{text.yes}</option></select></label>
        {foreign === "yes" && <label className="text-sm font-medium sm:col-span-2">{text.residence}<span className="text-red-600"> *</span><input required value={form.residenceStatus} onChange={(e) => update("residenceStatus", e.target.value)} placeholder={text.residenceExample} className={inputClass} /></label>}
        <label className="text-sm font-medium">{text.pets}<span className="text-red-600"> *</span><select required value={pet} onChange={(e) => setPet(e.target.value)} className={inputClass}><option value="">{text.select}</option><option value="no">{text.petNo}</option><option value="yes">{text.petYes}</option></select></label>
        {pet === "yes" && <label className="text-sm font-medium">{text.petDetails}<span className="text-red-600"> *</span><input required value={form.petDetails} onChange={(e) => update("petDetails", e.target.value)} placeholder={text.petExample} className={inputClass} /></label>}
        <fieldset className="sm:col-span-2"><legend className="text-sm font-medium">{text.dates}</legend><div className="mt-1 grid gap-2 sm:grid-cols-3"><input required type="datetime-local" value={form.date1} onChange={(e) => update("date1", e.target.value)} className={inputClass} aria-label={text.date1} /><input type="datetime-local" value={form.date2} onChange={(e) => update("date2", e.target.value)} className={inputClass} aria-label={text.date2} /><input type="datetime-local" value={form.date3} onChange={(e) => update("date3", e.target.value)} className={inputClass} aria-label={text.date3} /></div></fieldset>
        <label className="text-sm font-medium sm:col-span-2">{text.message}<textarea rows={3} value={form.message} onChange={(e) => update("message", e.target.value)} className={inputClass} /></label>
        <button type="submit" disabled={state === "sending"} className="sm:col-span-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-50">{state === "sending" ? text.sending : text.send}</button>
      </form>
    </section>
  );
}
