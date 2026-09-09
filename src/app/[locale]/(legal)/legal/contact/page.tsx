import { Phone, Printer, MapPin } from "lucide-react";
import { TelLink } from "@/components/shared/TelLink";
import type { Metadata } from "next";
import { ContactForm } from "@/components/ui/ContactForm";
import { OFFICE } from "@/lib/shared/office-public";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { CONTACT_INTRO, CONTACT_LABELS, CONTACT_METADATA } from "@/lib/shared/contact-page-copy";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "legal",
    ...CONTACT_METADATA.legal[locale],
    path: "/legal/contact",
    locale,
  });
}

export default async function LegalContactPage() {
  const locale = await getRequestLocale();
  const copy = CONTACT_LABELS[locale];
  const intro = CONTACT_INTRO.legal[locale];
  return (
    <div>
      <BreadcrumbJsonLd businessKey="legal" locale={locale} items={[
        { name: copy.home, href: "/legal" },
        { name: copy.title, href: "/legal/contact" },
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
                      location="contact_page_legal"
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

            <ContactForm thanksPath="/legal/thanks" business="legal" />
          </div>
        </div>
      </section>
    </div>
  );
}
