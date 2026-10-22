"use client";
import { useEffect, useState } from "react";
import type { LangCode } from "@/config/languages";
import { CONTACT_RECEIPT_COPY, readContactReceipt } from "@/lib/shared/contact-submission";

export function ContactReceipt({ business, locale }: { business: string; locale: LangCode }) {
  const [receiptNo, setReceiptNo] = useState<string | null>(null);
  useEffect(() => { setReceiptNo(readContactReceipt(business)); }, [business]);
  if (!receiptNo) return null;
  return <p className="mt-4 text-sm font-medium" aria-live="polite">{CONTACT_RECEIPT_COPY[locale].label}: <span className="font-mono">{receiptNo}</span></p>;
}
