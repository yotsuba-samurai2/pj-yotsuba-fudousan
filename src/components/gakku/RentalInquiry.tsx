"use client";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { LangCode } from "@/config/languages";
import { PropertyViewingCta } from "@/components/bukken/PropertyViewingCta";

type Target = { title: string; url: string };
const InquiryContext = createContext<((target: Target) => void) | null>(null);

/** One selected form per list preserves unique IDs and keeps all other rows lightweight. */
export function RentalInquiryProvider({ children, locale }: { children: ReactNode; locale: LangCode }) {
  const [selected, setSelected] = useState<Target | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => { if (selected) { panel.current?.scrollIntoView({ behavior: "smooth", block: "start" }); panel.current?.focus({ preventScroll: true }); } }, [selected]);
  const close = { ja: "フォームを閉じる", en: "Close form", "zh-tw": "關閉表單", zh: "关闭表单" }[locale];
  return <InquiryContext.Provider value={setSelected}>
    {children}
    {selected && <div ref={panel} tabIndex={-1} className="mt-6 scroll-mt-24 rounded-xl border border-primary/30 p-4">
      <button type="button" onClick={() => setSelected(null)} className="text-sm text-primary underline">{close}</button>
      <PropertyViewingCta key={selected.url} propertyTitle={selected.title} propertyUrl={selected.url} locale={locale} />
    </div>}
  </InquiryContext.Provider>;
}

export function RentalInquiryButton({ target, children }: { target: Target; children: ReactNode }) {
  const open = useContext(InquiryContext);
  return <button type="button" className="mt-3 inline-block rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary" onClick={() => open?.(target)}>{children}</button>;
}
