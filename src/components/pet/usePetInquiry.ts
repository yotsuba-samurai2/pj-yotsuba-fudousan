"use client";
// ペット住宅フォームの送信処理（借り手・大家で共通）。ペット横断 指示書 版2.0 第12・18章。
// - 1回の相談ごとに UUID（idempotencyKey）を作り、通信が途切れて再送しても同じキーを使う（重複受付を防ぐ）。
// - 完了はサーバーが受付番号を返したときだけ。完了表示はその場に出し、/thanks へ移動しない
//   （受付番号を URL に載せない＝GA4 の page_location に送らない／再読み込みで完了計測が二重にならない）。
// - GA4 には固定の値（petFormGaParams）だけを送り、入力値は送らない。
// クライアント安全：pet-intake / inquiry-intake / gtag のみ参照。
import { useRef, useState } from "react";
import { z } from "zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { gaEvent } from "@/lib/gtag";
import { HONEYPOT_FIELD } from "@/lib/shared/inquiry-intake";
import { petFormGaParams, type PetCategory } from "@/lib/shared/pet-intake";

const SERVER_ERROR = "送信できませんでした。時間をおいて再度お試しいただくか、お電話・LINEでご連絡ください。";
const NETWORK_ERROR = "通信が途切れました。もう一度「送信」を押してください（同じ内容を二重に受け付けることはありません）。";

function newIdempotencyKey() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map(x => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

function firstMessages(fieldErrors: Record<string, string[] | undefined>) {
  return Object.fromEntries(Object.entries(fieldErrors).flatMap(([k, v]) => (v?.[0] ? [[k, v[0]]] : [])));
}

export function usePetInquiry(category: PetCategory) {
  const { locale } = useLanguage();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [receiptNo, setReceiptNo] = useState("");
  const key = useRef<string | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const started = useRef(false);
  const ga = petFormGaParams(category);

  const onFirstFocus = () => {
    if (started.current) return;
    started.current = true;
    gaEvent("contact_form_start", { ...ga });
  };

  async function submit(fields: Record<string, unknown>, schema: z.ZodType) {
    if (submitting || receiptNo) return;
    const parsed = schema.safeParse(fields);
    if (!parsed.success) {
      setErrors(firstMessages(z.flattenError(parsed.error).fieldErrors as Record<string, string[] | undefined>));
      gaEvent("contact_submit_error", { ...ga, kind: "validation" });
      return;
    }
    setErrors({});
    setServerError("");
    setSubmitting(true);
    key.current ??= newIdempotencyKey();
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category, idempotencyKey: key.current, locale, sourcePath: window.location.pathname,
          [HONEYPOT_FIELD]: honeypot.current?.value ?? "", fields: parsed.data,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && typeof data.receiptNo === "string") {
        setReceiptNo(data.receiptNo);
        gaEvent("contact_submit", { ...ga });
        return; // 完了後は送信ボタンを戻さない（二重送信の防止）
      }
      if (res.status === 400 && data.errors) {
        setErrors(firstMessages(data.errors));
        gaEvent("contact_submit_error", { ...ga, kind: "validation" });
      } else {
        setServerError(typeof data.error === "string" ? data.error : SERVER_ERROR);
        gaEvent("contact_submit_error", { ...ga, kind: "server" });
      }
    } catch {
      setServerError(NETWORK_ERROR);
      gaEvent("contact_submit_error", { ...ga, kind: "network" });
    }
    setSubmitting(false);
  }

  return { errors, serverError, submitting, receiptNo, honeypot, onFirstFocus, submit };
}
