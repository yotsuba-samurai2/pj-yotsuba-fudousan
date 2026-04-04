"use client";

import { useTranslation } from "@/hooks/useTranslation";

export function PrivacyPolicyPageClient() {
  const { t, tArray } = useTranslation();

  return (
    <>
      <section className="relative grid min-h-[40vh] place-content-center overflow-hidden border-b border-border pt-32 pb-32 md:pt-40 md:pb-40">
        <div className="pointer-events-none absolute inset-0 bg-green-gradient" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold sm:text-4xl">{t("privacyPolicy.title")}</h1>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-10 text-sm leading-[1.9] text-text-muted">
            <div>
              <h2 className="text-lg font-bold text-text">{t("privacyPolicy.sections.collection.title")}</h2>
              <p className="mt-3">{t("privacyPolicy.sections.collection.content")}</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-text">{t("privacyPolicy.sections.purpose.title")}</h2>
              <p className="mt-3">{t("privacyPolicy.sections.purpose.content")}</p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                {tArray<string>("privacyPolicy.sections.purpose.items").map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-bold text-text">{t("privacyPolicy.sections.thirdParty.title")}</h2>
              <p className="mt-3">{t("privacyPolicy.sections.thirdParty.content")}</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-text">{t("privacyPolicy.sections.security.title")}</h2>
              <p className="mt-3">{t("privacyPolicy.sections.security.content")}</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-text">{t("privacyPolicy.sections.inquiry.title")}</h2>
              <p className="mt-3">{t("privacyPolicy.sections.inquiry.content")}</p>
              <p className="mt-2">{t("privacyPolicy.sections.inquiry.contactInfo")}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
