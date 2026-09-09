import { Phone, Printer, MapPin, Clock, CalendarDays } from "lucide-react";
import { TelLink } from "@/components/shared/TelLink";
import { ContactForm } from "@/components/ui/ContactForm";
import { OFFICE } from "@/lib/shared/office-public";
import { buildPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import type { Metadata } from "next";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { CONTACT_INTRO, CONTACT_LABELS, CONTACT_METADATA } from "@/lib/shared/contact-page-copy";

// 2026-09-05 月次点検（NEW-TECH-1）: (labor)/layout.tsx の template `%s｜事務所名` が事務所名を付けるため、
// ここで事務所名を足すと <title> が二重になっていた（本番実測）。legal/contact・labor/about と同じく見出しだけ渡す。
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "labor",
    ...CONTACT_METADATA.labor[locale],
    path: "/labor/contact",
    locale,
  });
}

export default async function LaborContactPage() {
  const locale = await getRequestLocale();
  const copy = CONTACT_LABELS[locale];
  const intro = CONTACT_INTRO.labor[locale];
  return (
    <div>
      <BreadcrumbJsonLd businessKey="labor" locale={locale} items={[
        { name: copy.home, href: "/labor" },
        { name: copy.title, href: "/labor/contact" },
      ]} />
      <section className="relative grid min-h-[40vh] place-content-center overflow-hidden border-b border-border pt-24 pb-16 sm:pt-32 sm:pb-32 md:pt-40 md:pb-40">
        <div className="pointer-events-none absolute inset-0 bg-green-gradient" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">CONTACT</p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl">{copy.title}</h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-muted">
              {intro[0]}
              <br />
              {intro[1]}
            </p>
        </div>
      </section>

      <section className="py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2 md:gap-12">
            {/* Contact info */}
            <div>
              <h2 className="text-xl font-bold">{copy.methods}</h2>
              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Phone size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{copy.phone}</p>
                    <TelLink
                      phone="03-6161-9428"
                      location="contact_page_labor"
                      className="mt-1 text-lg font-bold text-primary hover:text-primary-dark"
                    >
                      03-6161-9428
                    </TelLink>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Printer size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{copy.fax}</p>
                    <p className="mt-1 text-lg font-bold text-text">{OFFICE.fax}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <CalendarDays size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{copy.booking}</p>
                    <a
                      href="https://www.samurai.co.jp/samurai/reserve/uramatsu-joji"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center text-sm text-primary hover:text-primary-dark"
                    >
                      {copy.bookingLink}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Clock size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{copy.hoursLabel}</p>
                    <p className="mt-1 text-sm text-text-muted">{copy.hours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{copy.location}</p>
                    <p className="mt-1 text-sm text-text-muted">
                      〒112-0006<br />
                      {copy.address}<br />
                      {copy.building}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <ContactForm thanksPath="/labor/thanks" business="labor" />
          </div>
        </div>
      </section>
    </div>
  );
}
