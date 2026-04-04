"use client";

import { useTranslation } from "@/hooks/useTranslation";

export function LegalNoticePageClient() {
  const { t, tArray } = useTranslation();

  const items = tArray<{ label: string; value: string }>("legalNotice.items");

  return (
    <>
      <section className="relative grid min-h-[40vh] place-content-center overflow-hidden border-b border-border pt-32 pb-32 md:pt-40 md:pb-40">
        <div className="pointer-events-none absolute inset-0 bg-green-gradient" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold sm:text-4xl">{t("legalNotice.title")}</h1>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            {items.map(({ label, value }, i) => (
              <div
                key={label}
                className={`flex flex-col gap-1 px-6 py-5 sm:flex-row sm:gap-0 ${
                  i !== items.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <dt className="w-full shrink-0 text-sm font-bold sm:w-48">{label}</dt>
                <dd className="text-sm text-text-muted">{value}</dd>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
