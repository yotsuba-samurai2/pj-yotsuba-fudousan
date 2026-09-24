"use client";
// PetRenterForm — /pet-housing の借り手・買い手フォーム（ペット横断 指示書 版2.0 第12章）。
// 必須：受付名・連絡先（メールか電話）・賃貸／購入・希望エリア・動物の種類・頭数（未定も選べる）。
// 四葉行政書士事務所（別事業者）への共有は、来日予定が「ある」ときだけ尋ね、既定は同意しない（第11章）。
// クライアント安全：pet-intake / inquiry-intake / contact-intake のみ参照。
import { useState } from "react";
import type { FormEvent } from "react";
import { SOURCE_OPTIONS } from "@/lib/shared/contact-intake";
import {
  ARRIVAL_LABELS, COUNT_LABELS, DEAL_LABELS, DOG_SIZE_LABELS, PET_RENTER_CATEGORY, SPECIES_LABELS,
  petRenterSchema, type PetRenterFields,
} from "@/lib/shared/pet-intake";
import { Done, Field, Honeypot, inputClass, PrivacyNote, Select, ServerError, submitClass, toOptions } from "./PetFormParts";
import { usePetInquiry } from "./usePetInquiry";

const INITIAL: PetRenterFields = {
  name: "", email: "", phone: "", source: "", deal: "" as PetRenterFields["deal"], area: "", species: "" as PetRenterFields["species"],
  count: "" as PetRenterFields["count"], dogSize: "", budget: "", layout: "", timing: "", schoolDistrict: "", arrival: "",
  consentShare: false, note: "",
};

export function PetRenterForm() {
  const [f, setF] = useState<PetRenterFields>(INITIAL);
  const { errors, serverError, submitting, receiptNo, honeypot, onFirstFocus, submit } = usePetInquiry(PET_RENTER_CATEGORY);
  const set = <K extends keyof PetRenterFields>(k: K) => (v: PetRenterFields[K]) => setF(prev => ({ ...prev, [k]: v }));
  const text = (k: "name" | "email" | "phone" | "area" | "budget" | "layout" | "timing" | "schoolDistrict") =>
    ({ id: `pet-renter-${k}`, value: f[k], onChange: (e: { target: { value: string } }) => set(k)(e.target.value), className: inputClass });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    // 来日予定が「ある」以外では共有の同意を送らない（欄を閉じたあとに残った値で共有しない）
    submit({ ...f, consentShare: f.arrival === "yes" && f.consentShare }, petRenterSchema);
  }

  return (
    <section id="renter-form" aria-labelledby="pet-renter-form-title" className="gradient-border scroll-mt-24 overflow-hidden rounded-2xl bg-surface p-5 sm:p-8">
      <h2 id="pet-renter-form-title" className="font-serif text-xl font-semibold text-ink">多頭飼いできる家を探す（借り手・買い手のご相談）</h2>
      <p className="mt-2 text-sm text-text-muted">必須は6項目です。決まっていない項目は「未定」を選べます。</p>
      {receiptNo ? (
        <Done receiptNo={receiptNo} lineLocation="pet_housing_renter_done" next="担当者から、ご入力の連絡先へ順次ご連絡します。条件に合う物件の有無や、所有者への確認の進め方をご案内します。" />
      ) : (
        <>
          <ServerError message={serverError} />
          <form onSubmit={onSubmit} onFocusCapture={onFirstFocus} noValidate className="relative mt-6 space-y-5">
            <Honeypot inputRef={honeypot} />
            <Field id="pet-renter-name" label="お名前（受付名）" required error={errors.name}><input type="text" autoComplete="name" {...text("name")} /></Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="pet-renter-email" label="メールアドレス" hint="（メールか電話のどちらか必須）" error={errors.email}><input type="email" autoComplete="email" {...text("email")} /></Field>
              <Field id="pet-renter-phone" label="電話番号" error={errors.phone}><input type="tel" autoComplete="tel" {...text("phone")} /></Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="pet-renter-deal" label="賃貸／購入" required error={errors.deal}><Select id="pet-renter-deal" value={f.deal} onChange={v => set("deal")(v as PetRenterFields["deal"])} options={toOptions(DEAL_LABELS)} /></Field>
              <Field id="pet-renter-area" label="希望エリア" required error={errors.area}><input type="text" placeholder="例：文京区、茗荷谷駅の周辺" {...text("area")} /></Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field id="pet-renter-species" label="動物の種類" required error={errors.species}><Select id="pet-renter-species" value={f.species} onChange={v => set("species")(v as PetRenterFields["species"])} options={toOptions(SPECIES_LABELS)} /></Field>
              <Field id="pet-renter-count" label="頭数" required error={errors.count}><Select id="pet-renter-count" value={f.count} onChange={v => set("count")(v as PetRenterFields["count"])} options={toOptions(COUNT_LABELS)} /></Field>
              <Field id="pet-renter-dogSize" label="犬の大きさ" error={errors.dogSize}><Select id="pet-renter-dogSize" value={f.dogSize} onChange={v => set("dogSize")(v as PetRenterFields["dogSize"])} options={toOptions(DOG_SIZE_LABELS)} placeholder="選択してください（任意）" /></Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="pet-renter-budget" label="予算" error={errors.budget}><input type="text" placeholder="例：賃料25万円まで" {...text("budget")} /></Field>
              <Field id="pet-renter-layout" label="間取り" error={errors.layout}><input type="text" placeholder="例：2LDK以上" {...text("layout")} /></Field>
              <Field id="pet-renter-timing" label="希望時期" error={errors.timing}><input type="text" placeholder="例：2027年3月までに入居" {...text("timing")} /></Field>
              <Field id="pet-renter-schoolDistrict" label="学区" error={errors.schoolDistrict}><input type="text" placeholder="例：〇〇小学校の学区" {...text("schoolDistrict")} /></Field>
            </div>
            <Field id="pet-renter-arrival" label="海外から犬・猫と日本へ来る予定" error={errors.arrival}>
              <Select id="pet-renter-arrival" value={f.arrival} onChange={v => set("arrival")(v as PetRenterFields["arrival"])} options={toOptions(ARRIVAL_LABELS)} placeholder="選択してください（任意）" />
            </Field>
            {f.arrival === "yes" && (
              <div className="rounded-lg border border-border bg-surface-dim p-4 text-sm">
                <label className="flex items-start gap-2">
                  <input type="checkbox" checked={f.consentShare} onChange={e => set("consentShare")(e.target.checked)} className="mt-1" />
                  <span className="leading-relaxed">
                    犬・猫の日本入国の手続についても相談したいので、このご相談の内容（お名前・連絡先・入力内容）を、四葉不動産株式会社とは別の事業者である四葉行政書士事務所に伝えることに同意します（任意）。
                  </span>
                </label>
                <p className="mt-2 text-xs leading-relaxed text-text-muted">
                  同意しなくても、住まいのご相談はできます。手続のご依頼は四葉行政書士事務所との別のご契約になり、当社は紹介料を受け取りません。
                </p>
              </div>
            )}
            <Field id="pet-renter-note" label="その他（飼育の状況・ご希望など）" error={errors.note}>
              <textarea id="pet-renter-note" rows={4} value={f.note} onChange={e => set("note")(e.target.value)} className={inputClass} />
            </Field>
            <Field id="pet-renter-source" label="どちらで四葉グループをお知りになりましたか（任意）" error={errors.source}>
              <Select id="pet-renter-source" value={f.source} onChange={set("source")} options={SOURCE_OPTIONS.map(o => ({ value: o.value, label: o.label.ja }))} placeholder="選択してください（任意）" />
            </Field>
            <button type="submit" disabled={submitting} className={submitClass}>{submitting ? "送信中…" : "この内容で相談する（無料）"}</button>
            <PrivacyNote fee="ご相談は無料です。仲介手数料は、契約が成立したときにだけ発生します。" />
          </form>
        </>
      )}
    </section>
  );
}
