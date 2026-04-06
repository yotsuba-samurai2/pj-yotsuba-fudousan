"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useTranslation } from "@/hooks/useTranslation";

const inputClass =
  "mt-1 w-full rounded-lg bg-surface px-4 py-3 text-sm outline-none transition-all duration-300 gradient-border-input";
const errorClass = "mt-1 text-xs text-red-500";

type Props = {
  thanksPath?: string;
  business?: string;
};

export function ContactForm({ thanksPath = "/thanks", business = "realestate" }: Props) {
  const router = useRouter();
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setServerError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, category, message, business }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setServerError(data.error ?? t("contact.form.error"));
        }
        return;
      }

      router.push(thanksPath);
    } catch {
      setServerError(t("contact.form.error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gradient-border overflow-hidden rounded-2xl bg-surface p-5 sm:p-8">
      <h2 className="text-xl font-bold">{t("contact.form.title")}</h2>
      <p className="mt-2 text-sm text-text-muted">
        {t("contact.form.description")}
      </p>

      {serverError && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            {t("contact.form.fields.name")} <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
          {errors.name && <p className={errorClass}>{errors.name[0]}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            {t("contact.form.fields.email")} <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
          {errors.email && <p className={errorClass}>{errors.email[0]}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            {t("contact.form.fields.phone")}
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium">
            {t("contact.form.fields.category")} <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClass}
          >
            <option value="">{t("contact.form.categoryOptions.placeholder")}</option>
            <option value="rental">{t("contact.form.categoryOptions.rental")}</option>
            <option value="sale">{t("contact.form.categoryOptions.sale")}</option>
            <option value="management">{t("contact.form.categoryOptions.management")}</option>
            <option value="subsidy">{t("contact.form.categoryOptions.subsidy")}</option>
            <option value="visa">{t("contact.form.categoryOptions.visa")}</option>
            <option value="labor">{t("contact.form.categoryOptions.labor")}</option>
            <option value="other">{t("contact.form.categoryOptions.other")}</option>
          </select>
          {errors.category && <p className={errorClass}>{errors.category[0]}</p>}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium">
            {t("contact.form.fields.message")} <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            rows={5}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={inputClass}
          />
          {errors.message && <p className={errorClass}>{errors.message[0]}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="gradient-line w-full rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? t("contact.form.submitting") : t("common.submit")}
        </button>
      </form>
    </div>
  );
}
