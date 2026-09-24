"use client";
// PetOwnerForm — /pet-housing の大家さんフォーム（ペット横断 指示書 版2.0 第12章）。
// 必須：受付名・連絡先（メールか電話）・物件のエリア・種別・相談内容。写真・図面は受付後に LINE かメールで受け取る（添付は受けない）。
// クライアント安全：pet-intake / inquiry-intake / contact-intake のみ参照。
import { useState } from "react";
import type { FormEvent } from "react";
import { SOURCE_OPTIONS } from "@/lib/shared/contact-intake";
import {
  PET_OWNER_CATEGORY, PET_POLICY_LABELS, PROPERTY_TYPE_LABELS, VACANCY_LABELS, petOwnerSchema, type PetOwnerFields,
} from "@/lib/shared/pet-intake";
import { Done, Field, Honeypot, inputClass, PrivacyNote, Select, ServerError, submitClass, toOptions } from "./PetFormParts";
import { usePetInquiry } from "./usePetInquiry";

const INITIAL: PetOwnerFields = {
  name: "", email: "", phone: "", source: "", propertyArea: "", propertyType: "" as PetOwnerFields["propertyType"], consultation: "",
  address: "", builtYear: "", layout: "", floorArea: "", rent: "", vacancy: "", currentPolicy: "", acceptableAnimals: "",
};

export function PetOwnerForm() {
  const [f, setF] = useState<PetOwnerFields>(INITIAL);
  const { errors, serverError, submitting, receiptNo, honeypot, onFirstFocus, submit } = usePetInquiry(PET_OWNER_CATEGORY);
  const set = <K extends keyof PetOwnerFields>(k: K) => (v: PetOwnerFields[K]) => setF(prev => ({ ...prev, [k]: v }));
  const text = (k: "name" | "email" | "phone" | "propertyArea" | "address" | "builtYear" | "layout" | "floorArea" | "rent" | "acceptableAnimals") =>
    ({ id: `pet-owner-${k}`, value: f[k], onChange: (e: { target: { value: string } }) => set(k)(e.target.value), className: inputClass });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    submit({ ...f }, petOwnerSchema);
  }

  return (
    <section id="owner-form" aria-labelledby="pet-owner-form-title" className="gradient-border scroll-mt-24 overflow-hidden rounded-2xl bg-surface p-5 sm:p-8">
      <h2 id="pet-owner-form-title" className="font-serif text-xl font-semibold text-ink">ペット飼育者に貸せるか相談する（大家さん）</h2>
      <p className="mt-2 text-sm text-text-muted">まだペット可にすると決めていなくても相談できます。必須は5項目です。図面・写真は送信後に LINE かメールでお送りください。</p>
      {receiptNo ? (
        <Done receiptNo={receiptNo} lineLocation="pet_housing_owner_done" next="担当者から、ご入力の連絡先へ順次ご連絡します。図面・写真がお手元にあれば、LINE かメールでお送りください。" />
      ) : (
        <>
          <ServerError message={serverError} />
          <form onSubmit={onSubmit} onFocusCapture={onFirstFocus} noValidate className="relative mt-6 space-y-5">
            <Honeypot inputRef={honeypot} />
            <Field id="pet-owner-name" label="お名前（受付名）" required error={errors.name}><input type="text" autoComplete="name" {...text("name")} /></Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="pet-owner-email" label="メールアドレス" hint="（メールか電話のどちらか必須）" error={errors.email}><input type="email" autoComplete="email" {...text("email")} /></Field>
              <Field id="pet-owner-phone" label="電話番号" error={errors.phone}><input type="tel" autoComplete="tel" {...text("phone")} /></Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="pet-owner-propertyArea" label="物件のエリア" required error={errors.propertyArea}><input type="text" placeholder="例：文京区小日向" {...text("propertyArea")} /></Field>
              <Field id="pet-owner-propertyType" label="物件の種別" required error={errors.propertyType}><Select id="pet-owner-propertyType" value={f.propertyType} onChange={v => set("propertyType")(v as PetOwnerFields["propertyType"])} options={toOptions(PROPERTY_TYPE_LABELS)} /></Field>
            </div>
            <Field id="pet-owner-consultation" label="ご相談内容" required error={errors.consultation}>
              <textarea id="pet-owner-consultation" rows={4} placeholder="例：空室が続いている。犬猫の飼育を認めた場合の条件の考え方を知りたい" value={f.consultation} onChange={e => set("consultation")(e.target.value)} className={inputClass} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="pet-owner-address" label="所在地（詳細）" error={errors.address}><input type="text" {...text("address")} /></Field>
              <Field id="pet-owner-builtYear" label="築年" error={errors.builtYear}><input type="text" placeholder="例：1995年" {...text("builtYear")} /></Field>
              <Field id="pet-owner-layout" label="間取り" error={errors.layout}><input type="text" {...text("layout")} /></Field>
              <Field id="pet-owner-floorArea" label="面積" error={errors.floorArea}><input type="text" placeholder="例：70㎡" {...text("floorArea")} /></Field>
              <Field id="pet-owner-rent" label="賃料" error={errors.rent}><input type="text" {...text("rent")} /></Field>
              <Field id="pet-owner-vacancy" label="空室状況" error={errors.vacancy}><Select id="pet-owner-vacancy" value={f.vacancy} onChange={v => set("vacancy")(v as PetOwnerFields["vacancy"])} options={toOptions(VACANCY_LABELS)} placeholder="選択してください（任意）" /></Field>
              <Field id="pet-owner-currentPolicy" label="現在のペットの扱い" error={errors.currentPolicy}><Select id="pet-owner-currentPolicy" value={f.currentPolicy} onChange={v => set("currentPolicy")(v as PetOwnerFields["currentPolicy"])} options={toOptions(PET_POLICY_LABELS)} placeholder="選択してください（任意）" /></Field>
              <Field id="pet-owner-acceptableAnimals" label="受け入れられそうな動物" error={errors.acceptableAnimals}><input type="text" placeholder="例：猫なら2匹まで、など" {...text("acceptableAnimals")} /></Field>
            </div>
            <Field id="pet-owner-source" label="どちらで四葉グループをお知りになりましたか（任意）" error={errors.source}>
              <Select id="pet-owner-source" value={f.source} onChange={set("source")} options={SOURCE_OPTIONS.map(o => ({ value: o.value, label: o.label.ja }))} placeholder="選択してください（任意）" />
            </Field>
            <button type="submit" disabled={submitting} className={submitClass}>{submitting ? "送信中…" : "この内容で相談する（無料）"}</button>
            <PrivacyNote fee="ご相談は無料です。報酬は、賃貸借契約が成立したときにだけ発生します。" />
          </form>
        </>
      )}
    </section>
  );
}
