"use client";

import { Phone, Printer, MapPin } from "lucide-react";
import { TelLink } from "@/components/shared/TelLink";
import { ContactForm } from "@/components/ui/ContactForm";
import { OFFICE } from "@/lib/shared/office-public";
import { useTranslation } from "@/hooks/useTranslation";

// FAXのラベルのみロケール別に持つ。値（番号）は OFFICE.fax が正本。
// 翻訳DB（Firestore）に新キーを増やさない方針のため、コード側の定数で持つ（office.ts 冒頭のB1教訓）。
const FAX_LABEL: Record<string, string> = {
  ja: "FAX",
  en: "Fax",
  "zh-tw": "傳真",
  zh: "传真",
};

export function ContactPageClient() {
  const { t, locale } = useTranslation();

  return (
    <>
      <section className="relative grid min-h-[40vh] place-content-center overflow-hidden border-b border-border pt-24 pb-16 sm:pt-32 sm:pb-32 md:pt-40 md:pb-40">
        <div className="pointer-events-none absolute inset-0 bg-green-gradient" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">CONTACT</p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl">{t("contact.title")}</h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-muted">
              {t("contact.heroDescription1")}
              <br />
              {t("contact.heroDescription2")}
            </p>
        </div>
      </section>

      <section className="py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2 md:gap-12">
            {/* Contact info */}
            <div>
              <h2 className="text-xl font-bold">{t("contact.methods.title")}</h2>
              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Phone size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{t("contact.methods.phone.label")}</p>
                    <TelLink
                      phone={t("contact.methods.phone.number")}
                      location="contact_page_realestate"
                      className="mt-1 text-lg font-bold text-primary hover:text-primary-dark"
                    >
                      {t("contact.methods.phone.number")}
                    </TelLink>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Printer size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{FAX_LABEL[locale] ?? "FAX"}</p>
                    <p className="mt-1 text-lg font-bold text-text">{OFFICE.fax}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{t("contact.methods.location.label")}</p>
                    {/* 住所の語順：日本語圏は「都道府県→市区→番地」、英語は「番地, 市区, 都道府県」に反転
                        （§J2・2026-07-20。en で "TokyoBunkyo-kuKohinata 4-2-5" と連結されていた不具合の是正）。 */}
                    <p className="mt-1 text-sm text-text-muted">
                      {t("address.postalCode")}<br />
                      {locale === "en"
                        ? `${t("address.street")}, ${t("address.city")}, ${t("address.prefecture")}`
                        : `${t("address.prefecture")}${t("address.city")}${t("address.street")}`}<br />
                      {t("address.building")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <ContactForm business="realestate" />
          </div>
        </div>
      </section>
    </>
  );
}
