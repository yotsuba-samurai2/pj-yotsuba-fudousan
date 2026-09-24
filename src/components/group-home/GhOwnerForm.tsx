"use client";
// GhOwnerForm — グループホーム向け物件・大家募集ページ（/group-home/ooya）の専用フォーム
// （2026-09-24・指示書 v1.0 第6章 6-1）。
// 送信経路は既存の /api/contact（category=gh-owner・business=realestate）を流用し、物件項目は
// buildGhOwnerMessage で本文（message）に整形する。スパム対策・送信後の /thanks 遷移も既存フォームと同じ。
// 必須は「お名前・連絡先（メールか電話のどちらか）・所在地・種別」の4つだけ（入力のハードルを下げる）。
// GA4：既存の contact_submit / contact_submit_error に form_id・property_type を足す。
//      氏名・メール・電話・所在地・自由記述はパラメータに入れない（gtag.ts の規約）。
// クライアント安全：office-public / contact-intake / gh-owner-intake のみ参照（SR名なし）。
import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { LineLink } from "@/components/shared/LineLink";
import { LocaleLink } from "@/components/ui/LocaleLink";
import { addLocalePrefix } from "@/lib/locale";
import { gaEvent } from "@/lib/gtag";
import { SOURCE_OPTIONS } from "@/lib/shared/contact-intake";
import {
  GH_OWNER_CATEGORY,
  GH_OWNER_PROPERTY_TYPES,
  GH_OWNER_USAGE_OPTIONS,
  buildGhOwnerMessage,
  propertyTypeParam,
} from "@/lib/shared/gh-owner-intake";

const inputClass =
  "mt-1 w-full rounded-lg bg-surface px-4 py-3 text-sm outline-none transition-all duration-300 gradient-border-input";
const errorClass = "mt-1 text-xs text-red-500";
const labelClass = "block text-sm font-medium";

const GA_BASE = { business: "realestate", form_id: "gh_owner" } as const;

type Errors = Partial<Record<"name" | "email" | "phone" | "address" | "propertyType", string>>;

export function GhOwnerForm() {
  const router = useRouter();
  const { locale } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [layout, setLayout] = useState("");
  const [floorArea, setFloorArea] = useState("");
  const [usage, setUsage] = useState("");
  const [rent, setRent] = useState("");
  const [hasDrawings, setHasDrawings] = useState(false);
  const [note, setNote] = useState("");
  const [source, setSource] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // フォームの最初のフォーカスを1回だけ送る（GA4 自動収集の form_start と名前を分ける）
  const started = useRef(false);

  const onFirstFocus = () => {
    if (started.current) return;
    started.current = true;
    gaEvent("contact_form_start", { ...GA_BASE });
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!name.trim()) e.name = "お名前を入力してください";
    if (!email.trim() && !phone.trim()) e.email = "メールアドレスまたは電話番号を入力してください";
    else if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      e.email = "有効なメールアドレスを入力してください";
    }
    if (!address.trim()) e.address = "物件の所在地を入力してください";
    if (!propertyType) e.propertyType = "物件の種別を選択してください";
    return e;
  };

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setServerError("");
    const clientErrors = validate();
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) {
      gaEvent("contact_submit_error", { ...GA_BASE, kind: "validation" });
      return;
    }
    setSubmitting(true);
    try {
      const message = buildGhOwnerMessage({
        address,
        propertyType,
        layout,
        floorArea,
        usage,
        rent,
        hasDrawings,
        note,
      });
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          category: GH_OWNER_CATEGORY,
          source,
          message,
          business: "realestate",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.errors) {
          const first = (key: string) => (data.errors[key] as string[] | undefined)?.[0];
          setErrors({ name: first("name"), email: first("email"), phone: first("phone") });
          gaEvent("contact_submit_error", { ...GA_BASE, kind: "validation" });
        } else {
          setServerError(data.error ?? "送信に失敗しました。しばらく経ってからお試しください。");
          gaEvent("contact_submit_error", { ...GA_BASE, kind: "server" });
        }
        return;
      }
      // 送信成功＝唯一の成果地点。パラメータは閉じた選択肢のみ。
      gaEvent("contact_submit", {
        ...GA_BASE,
        category: GH_OWNER_CATEGORY,
        source: source || "unanswered",
        intent: "gh-owner-page",
        property_type: propertyTypeParam(propertyType),
      });
      router.push(addLocalePrefix("/thanks", locale));
    } catch {
      setServerError("送信に失敗しました。しばらく経ってからお試しください。");
      gaEvent("contact_submit_error", { ...GA_BASE, kind: "network" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="form"
      aria-labelledby="gh-owner-form-title"
      className="gradient-border scroll-mt-24 overflow-hidden rounded-2xl bg-surface p-5 sm:p-8"
    >
      <h2 id="gh-owner-form-title" className="font-serif text-xl font-semibold text-ink">
        物件情報を送って相談する
      </h2>
      <p className="mt-2 text-sm text-text-muted">
        必須は4項目だけです。分かる範囲で構いません。図面・写真は送信後に LINE またはメールでお送りください。
      </p>

      {serverError && (
        <div role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} onFocusCapture={onFirstFocus} noValidate className="mt-6 space-y-5">
        <div>
          <label htmlFor="gh-owner-name" className={labelClass}>
            お名前 <span className="text-red-500">*</span>
          </label>
          <input
            id="gh-owner-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
          {errors.name && <p className={errorClass}>{errors.name}</p>}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="gh-owner-email" className={labelClass}>
              メールアドレス <span className="text-xs text-text-muted">（メールか電話のどちらか必須）</span>
            </label>
            <input
              id="gh-owner-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
            {errors.email && <p className={errorClass}>{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="gh-owner-phone" className={labelClass}>
              電話番号
            </label>
            <input
              id="gh-owner-phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
            />
            {errors.phone && <p className={errorClass}>{errors.phone}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="gh-owner-address" className={labelClass}>
            物件の所在地 <span className="text-red-500">*</span>
          </label>
          <input
            id="gh-owner-address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="区市町村と町名まで（番地は任意）。例：文京区小日向"
            className={inputClass}
          />
          {errors.address && <p className={errorClass}>{errors.address}</p>}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="gh-owner-type" className={labelClass}>
              物件の種別 <span className="text-red-500">*</span>
            </label>
            <select
              id="gh-owner-type"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className={inputClass}
            >
              <option value="">選択してください</option>
              {GH_OWNER_PROPERTY_TYPES.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors.propertyType && <p className={errorClass}>{errors.propertyType}</p>}
          </div>
          <div>
            <label htmlFor="gh-owner-usage" className={labelClass}>
              現在の利用状況
            </label>
            <select id="gh-owner-usage" value={usage} onChange={(e) => setUsage(e.target.value)} className={inputClass}>
              <option value="">選択してください（任意）</option>
              {GH_OWNER_USAGE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="gh-owner-layout" className={labelClass}>
              間取り・部屋数
            </label>
            <input
              id="gh-owner-layout"
              type="text"
              value={layout}
              onChange={(e) => setLayout(e.target.value)}
              placeholder="例：4LDK（居室4）"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="gh-owner-area" className={labelClass}>
              延床面積（㎡）
            </label>
            <input
              id="gh-owner-area"
              type="text"
              inputMode="decimal"
              value={floorArea}
              onChange={(e) => setFloorArea(e.target.value)}
              placeholder="例：110"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="gh-owner-rent" className={labelClass}>
              希望賃料
            </label>
            <input
              id="gh-owner-rent"
              type="text"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
              placeholder="例：月額21万円（未定で構いません）"
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex items-start gap-2">
          <input
            id="gh-owner-drawings"
            type="checkbox"
            checked={hasDrawings}
            onChange={(e) => setHasDrawings(e.target.checked)}
            className="mt-1 h-4 w-4"
          />
          <label htmlFor="gh-owner-drawings" className="text-sm text-text">
            図面・写真があります（送信後に LINE またはメールでお送りください）
          </label>
        </div>

        <div>
          <label htmlFor="gh-owner-note" className={labelClass}>
            備考
          </label>
          <textarea
            id="gh-owner-note"
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="相続した実家、長く空室、賃貸中の入居者との関係など、気になることがあればご記入ください"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="gh-owner-source" className={labelClass}>
            どちらで四葉グループをお知りになりましたか（任意）
          </label>
          <select id="gh-owner-source" value={source} onChange={(e) => setSource(e.target.value)} className={inputClass}>
            <option value="">選択してください（任意）</option>
            {SOURCE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label.ja}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={submitting}
            className="gradient-line inline-flex min-h-[44px] items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "送信中…" : "この内容で相談する（無料）"}
          </button>
          <LineLink
            location="gh_owner_form"
            page="gh_owner"
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-primary px-5 py-3 text-sm font-semibold text-primary-dark transition-colors hover:bg-primary-dark hover:text-white"
          >
            LINE で図面を送る
          </LineLink>
        </div>
        <p className="text-xs leading-relaxed text-text-muted">
          送信いただいた情報は、お問い合わせへの回答・対応のために利用します（
          <LocaleLink href="/privacy-policy" className="text-primary underline">
            プライバシーポリシー
          </LocaleLink>
          ）。相談・物件の登録は無料で、報酬は賃貸借契約が成立したときのみ発生します。
        </p>
      </form>
    </section>
  );
}
