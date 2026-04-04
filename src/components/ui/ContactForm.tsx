"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useTranslation } from "@/hooks/useTranslation";

const inputClass =
  "mt-1 w-full rounded-lg bg-surface px-4 py-3 text-sm outline-none transition-all duration-300 gradient-border-input";

export function ContactForm({ thanksPath = "/thanks" }: { thanksPath?: string }) {
  const router = useRouter();
  const { t } = useTranslation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: メール送信API連携
    router.push(thanksPath);
  };

  return (
    <div className="gradient-border overflow-hidden rounded-2xl bg-surface p-5 sm:p-8">
      <h2 className="text-xl font-bold">{t("contact.form.title")}</h2>
      <p className="mt-2 text-sm text-text-muted">
        {t("contact.form.description")}
      </p>
      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            {t("contact.form.fields.name")} <span className="text-red-500">*</span>
          </label>
          <input id="name" type="text" className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            {t("contact.form.fields.email")} <span className="text-red-500">*</span>
          </label>
          <input id="email" type="email" className={inputClass} />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            {t("contact.form.fields.phone")}
          </label>
          <input id="phone" type="tel" className={inputClass} />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium">
            {t("contact.form.fields.category")} <span className="text-red-500">*</span>
          </label>
          <select id="category" className={inputClass}>
            <option value="">{t("contact.form.categoryOptions.placeholder")}</option>
            <option value="rental">{t("contact.form.categoryOptions.rental")}</option>
            <option value="sale">{t("contact.form.categoryOptions.sale")}</option>
            <option value="management">{t("contact.form.categoryOptions.management")}</option>
            <option value="subsidy">{t("contact.form.categoryOptions.subsidy")}</option>
            <option value="visa">{t("contact.form.categoryOptions.visa")}</option>
            <option value="labor">{t("contact.form.categoryOptions.labor")}</option>
            <option value="other">{t("contact.form.categoryOptions.other")}</option>
          </select>
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium">
            {t("contact.form.fields.message")} <span className="text-red-500">*</span>
          </label>
          <textarea id="message" rows={5} className={inputClass} />
        </div>
        <button
          type="submit"
          className="gradient-line w-full rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110"
        >
          {t("common.submit")}
        </button>
      </form>
    </div>
  );
}
