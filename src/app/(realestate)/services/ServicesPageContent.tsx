"use client";

import Image from "next/image";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import {
  Home,
  KeyRound,
  Building2,
  Users,
  ArrowRight,
  CheckCircle2,
  Search,
  FileText,
  Handshake,
  TrendingUp,
  Shield,
  Wrench,
  Phone,
  Languages,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { ServiceJsonLd } from "@/components/seo/ServiceJsonLd";

const sectionIcons: Record<string, LucideIcon> = {
  rental: Home,
  sale: KeyRound,
  management: Building2,
  "foreign-residents": Languages,
};

const sectionImages: Record<string, string> = {
  rental: "/assets/images/illust-apartment.svg",
  sale: "/assets/images/illust-house.svg",
  management: "/assets/images/illust-office-building.svg",
  "foreign-residents": "/assets/images/illust-shop.svg",
};

const pointIcons: LucideIcon[][] = [
  [Search, FileText, Handshake, CheckCircle2],
  [Search, TrendingUp, FileText, Handshake],
  [Users, Phone, Wrench, Shield],
  [Languages, FileText, CheckCircle2, Handshake],
];

export default function ServicesPageContent() {
  const { t, tArray } = useTranslation();

  const sections = tArray<{
    id: string;
    title: string;
    subtitle: string;
    lead: string;
    description: string;
    points: string[];
  }>("realestate.servicesPage.sections");

  const faqItems = tArray<{ question: string; answer: string }>(
    "realestate.servicesPage.faq",
  );

  return (
    <div>
      <FAQJsonLd items={faqItems} />
      <ServiceJsonLd
        businessKey="realestate"
        services={[
          {
            name: "賃貸仲介",
            description:
              "外国人の方にも対応した賃貸物件のご紹介。多言語（日本語・英語・中国語繁体字・中国語簡体字）対応で安心の住まい探しをサポートします。",
          },
          {
            name: "売買仲介",
            description:
              "マイホーム購入から投資物件まで、不動産売買をトータルサポートします。",
          },
          {
            name: "物件管理",
            description:
              "オーナー様向けの賃貸管理サービス。入居者対応から建物管理まで対応します。",
          },
          {
            name: "外国人サポート",
            description:
              "在留資格に関わる住居相談、多言語での契約サポート、生活支援まで対応します。",
          },
        ]}
      />
      <BreadcrumbJsonLd
        businessKey="realestate"
        items={[
          { name: t("realestate.nav.services"), href: "/" },
          { name: t("realestate.servicesPage.metaTitle"), href: "/services" },
        ]}
      />
      {/* ─── Hero ─── */}
      <section className="relative grid min-h-[40vh] place-content-center overflow-hidden border-b border-border pt-24 pb-16 sm:pt-32 sm:pb-32 md:pt-40 md:pb-40">
        <div
          className="pointer-events-none absolute inset-0 bg-green-gradient"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">
            SERVICES
          </p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl">
            {t("realestate.servicesPage.title")}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-muted sm:text-base">
            {t("realestate.servicesPage.heroDescription1")}
            <br />
            {t("realestate.servicesPage.heroDescription2")}
          </p>
        </div>
      </section>

      {/* ─── Service Sections ─── */}
      {sections.map((section, i) => {
        const Icon = sectionIcons[section.id];
        const isEven = i % 2 === 0;
        const icons = pointIcons[i] ?? [];

        return (
          <section
            key={section.id}
            id={section.id}
            className={`scroll-mt-24 py-14 sm:py-20 md:py-28 ${
              isEven ? "" : "bg-surface-dim"
            }`}
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div
                className={`flex flex-col items-center gap-12 lg:gap-20 ${
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Image */}
                <div className="flex w-full max-w-[240px] shrink-0 items-center justify-center sm:max-w-none lg:w-[40%]">
                  <Image
                    src={sectionImages[section.id]}
                    alt={section.title}
                    width={320}
                    height={280}
                    className="h-auto w-full max-w-xs"
                  />
                </div>

                {/* Content */}
                <div className="w-full lg:w-[60%]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      {Icon && <Icon size={24} className="text-primary" />}
                    </div>
                    <div>
                      <p className="text-[10px] font-medium tracking-wider text-text-muted">
                        {section.subtitle}
                      </p>
                      <h2 className="text-2xl font-bold sm:text-3xl">
                        {section.title}
                      </h2>
                    </div>
                  </div>

                  <p className="mt-6 text-lg font-bold leading-relaxed">
                    {section.lead}
                  </p>

                  <p className="mt-3 text-sm leading-[1.9] text-text-muted">
                    {section.description}
                  </p>

                  {/* Points */}
                  <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4">
                    {section.points.map((text, j) => {
                      const PointIcon = icons[j] ?? CheckCircle2;
                      return (
                        <div
                          key={j}
                          className="flex items-start gap-3 rounded-lg border border-border bg-surface p-3 transition-all duration-200 hover:border-primary/30 hover:shadow-md sm:p-4"
                        >
                          <PointIcon
                            size={18}
                            className="mt-0.5 shrink-0 text-primary"
                          />
                          <p className="text-sm leading-relaxed">{text}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-8">
                    <Link
                      href="/contact"
                      className="gradient-line inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:brightness-110"
                    >
                      {t("common.cta.consultAboutService")}
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* ─── CTA ─── */}
      <section className="border-t border-border bg-green-gradient py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">
            {t("common.cta.feelFreeToContact")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-muted">
            {t("realestate.servicesPage.ctaDescription1")}
            <br />
            {t("realestate.servicesPage.ctaDescription2")}
          </p>
          <div className="mt-10">
            <Link
              href="/contact"
              className="gradient-line inline-flex items-center gap-2 rounded-md px-10 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:brightness-110"
            >
              {t("common.cta.contactUs")}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
