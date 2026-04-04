"use client";

import { useTranslation } from "@/hooks/useTranslation";

export function TermsPageClient() {
  const { t, tArray } = useTranslation();

  return (
    <>
      <section className="relative grid min-h-[40vh] place-content-center overflow-hidden border-b border-border pt-32 pb-32 md:pt-40 md:pb-40">
        <div className="pointer-events-none absolute inset-0 bg-green-gradient" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold sm:text-4xl">{t("terms.title")}</h1>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-10 text-sm leading-[1.9] text-text-muted">
            <div>
              <h2 className="text-lg font-bold text-text">{t("terms.sections.application.title")}</h2>
              <p className="mt-3">{t("terms.sections.application.content")}</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-text">{t("terms.sections.prohibited.title")}</h2>
              <p className="mt-3">{t("terms.sections.prohibited.content")}</p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                {tArray<string>("terms.sections.prohibited.items").map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-bold text-text">{t("terms.sections.disclaimer.title")}</h2>
              <p className="mt-3">{t("terms.sections.disclaimer.content")}</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-text">{t("terms.sections.changes.title")}</h2>
              <p className="mt-3">{t("terms.sections.changes.content")}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
