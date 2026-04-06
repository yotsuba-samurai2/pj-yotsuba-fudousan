"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export function LaborAboutPageContent() {
  const { t, tArray } = useTranslation();

  const highlights = [
    { label: t("labor.aboutPage.highlights.previousJob.label"), value: t("labor.aboutPage.highlights.previousJob.value") },
    { label: t("labor.aboutPage.highlights.overseas.label"), value: t("labor.aboutPage.highlights.overseas.value") },
    { label: t("labor.aboutPage.highlights.qualifications.label"), value: t("labor.aboutPage.highlights.qualifications.value") },
    { label: t("labor.aboutPage.highlights.status.label"), value: t("labor.aboutPage.highlights.status.value") },
  ];

  const officeInfo = tArray<{ label: string; value: string }>("labor.aboutPage.officeInfo");

  return (
    <>
      <section className="relative grid min-h-[40vh] place-content-center overflow-hidden border-b border-border pt-24 pb-16 sm:pt-32 sm:pb-32 md:pt-40 md:pb-40">
        <div className="pointer-events-none absolute inset-0 bg-green-gradient" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">ABOUT</p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl">{t("labor.aboutPage.title")}</h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-muted sm:text-base">
              {t("labor.aboutPage.heroDescription1")}
              <br />
              {t("labor.aboutPage.heroDescription2")}
            </p>
        </div>
      </section>

      <section className="py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8 sm:gap-12 lg:flex-row lg:gap-20">
            <div className="w-full shrink-0 lg:w-[38%]">
              <div className="gradient-border mx-auto aspect-[3/4] max-w-[280px] overflow-hidden rounded-2xl sm:max-w-sm">
                <Image src="/uramatsu.png" alt={t("representative.name")} width={400} height={533} className="h-full w-full object-cover" />
              </div>
            </div>
            <div className="w-full lg:w-[62%]">
              <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">REPRESENTATIVE</p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">{t("labor.aboutPage.representativeTitle")}</h2>
              <p className="mt-1 text-sm text-text-muted">{t("representative.nameEn")}</p>
              <div className="mt-8 space-y-4 text-sm leading-[1.9] text-text-muted">
                <p>{t("labor.aboutPage.representativeBio1")}</p>
                <p>{t("labor.aboutPage.representativeBio2")}</p>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {highlights.map(({ label, value }) => (
                  <div key={label} className="rounded-lg border border-border bg-surface-dim p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-md">
                    <p className="text-[10px] font-medium tracking-wider text-text-muted">{label}</p>
                    <p className="mt-1 text-sm font-bold">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface-dim py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">OFFICE</p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">{t("labor.aboutPage.officeInfoTitle")}</h2>
          </div>
          <div className="mt-10 overflow-hidden rounded-xl border border-border bg-surface sm:mt-12">
            {officeInfo.map(({ label, value }, i) => (
              <div key={label} className={`flex flex-col gap-1 px-4 py-4 sm:flex-row sm:gap-0 sm:px-6 sm:py-5 ${i !== officeInfo.length - 1 ? "border-b border-border" : ""}`}>
                <dt className="w-full shrink-0 text-sm font-bold sm:w-44">{label}</dt>
                <dd className="whitespace-pre-line text-sm text-text-muted">{value}</dd>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-green-gradient py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">{t("common.cta.feelFreeToContact")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-muted">{t("labor.aboutPage.ctaDescription")}</p>
          <div className="mt-10">
            <Link href="/labor/contact" className="gradient-line inline-flex items-center gap-2 rounded-md px-10 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:brightness-110">
              {t("common.cta.contactUs")}<ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
