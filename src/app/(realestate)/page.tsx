"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Globe,
  Home,
  KeyRound,
  Building2,
  Languages,
  Newspaper,
  Users,
  ArrowRight,
  ChevronDown,
  Scale,
  Heart,
  Handshake,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const strengthIcons = [Heart, Languages, Globe, Scale, Handshake, Newspaper];

const serviceIcons = [Home, KeyRound, Building2, Users];
const serviceHrefs = [
  "/services#rental",
  "/services#sale",
  "/services#management",
  "/services#foreign-residents",
];

export default function HomePage() {
  const { t, tArray } = useTranslation();

  const strengths = tArray<{
    title: string;
    subtitle: string;
    description: string;
  }>("realestate.home.whyYotsuba.strengths");
  const services = tArray<{
    title: string;
    subtitle: string;
    description: string;
  }>("realestate.home.services.items");

  return (
    <div className="relative">
      {/* ─── Hero ─── */}
      <section className="relative z-[1] min-h-[80vh] overflow-hidden md:min-h-screen">
        {/* Full-width: left text + right image */}
        <div className="relative flex min-h-[80vh] w-full flex-col md:min-h-screen md:flex-row md:items-stretch">
          {/* Left: text content */}
          <div className="relative z-10 flex w-full flex-col justify-center px-5 pt-24 pb-8 sm:px-10 sm:pt-28 sm:pb-12 md:w-[42%] md:py-0 md:pl-[10%] md:pr-8 lg:pl-[12%] lg:pr-12">
            {/* Subtle BG accent */}
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-accent/[0.03]"
              aria-hidden="true"
            />

            <div className="relative">
              {/* Logo */}
              <div className="hero-fade-in">
                <Image
                  src="/yotsuba/realestate-square.png"
                  alt={t("realestate.name")}
                  width={180}
                  height={158}
                  className="h-16 w-auto sm:h-20 md:h-24"
                  priority
                />
              </div>

              {/* Main copy */}
              <h1 className="hero-fade-in-delay-1 mt-6 text-2xl font-bold leading-[1.3] tracking-tight sm:mt-8 sm:text-4xl md:text-[2.5rem] lg:text-5xl">
                {t("realestate.home.heroTitle1")}
                <br />
                <span className="whitespace-nowrap">
                  <span className="cta-gradient-text">
                    {t("realestate.home.heroTitle2")}
                  </span>
                  {t("realestate.home.heroTitle3")}
                </span>
              </h1>

              {/* Gradient divider */}
              <div className="hero-fade-in-delay-2 mt-4 h-0.5 w-16 rounded-full gradient-line sm:mt-6" />

              {/* Sub copy */}
              <p className="hero-fade-in-delay-2 mt-4 text-sm leading-[1.8] text-text-muted sm:mt-5 sm:text-[0.95rem]">
                {t("realestate.home.heroSubtitle1")}
                <br />
                {t("realestate.home.heroSubtitle2")}
              </p>

              {/* CTA buttons */}
              <div className="hero-fade-in-delay-3 mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row">
                <Link
                  href="/contact"
                  className="gradient-line inline-flex items-center justify-center gap-2 rounded-md px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:brightness-110 sm:py-3.5"
                >
                  {t("common.cta.consultFirst")}
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/services"
                  className="cta-gradient-outline inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold shadow-sm transition-all duration-200 hover:shadow-md sm:py-3.5"
                >
                  <span className="cta-gradient-text">
                    {t("common.cta.viewServices")}
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right: hero photo (55%, rounded top-left, soft shadow inset) */}
          <div className="hero-fade-in relative w-full md:ml-auto md:w-[55%]">
            <div
              className="relative h-48 w-full sm:h-64 md:h-full md:rounded-tl-[3rem]"
              style={{ overflow: "hidden" }}
            >
              <Image
                src="/assets/images/hero-clover-hand.jpeg"
                alt={t("realestate.home.heroImageAlt")}
                fill
                className="object-cover object-[55%_center] opacity-90"
                priority
              />
              {/* Soft gradient overlay on left edge for blend */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-surface/40 to-transparent sm:w-24 md:w-32" />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero-fade-in-delay-3 absolute bottom-6 left-[21%] hero-scroll-mobile hidden md:block">
          <ChevronDown size={20} className="text-text-muted/40" />
        </div>
      </section>

      {/* ─── 3つの強み ─── */}
      <section className="border-t border-border py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">
              WHY YOTSUBA
            </p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              {t("realestate.home.whyYotsuba.sectionTitle")}
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            {strengths.map((strength, i) => {
              const Icon = strengthIcons[i];
              return (
                <div
                  key={i}
                  className="gradient-border group relative overflow-hidden rounded-xl bg-surface p-5 transition-shadow duration-300 hover:shadow-lg sm:p-8"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <p className="mt-2 text-xs font-medium tracking-wider text-text-muted">
                    {strength.subtitle}
                  </p>
                  <h3 className="mt-3 text-lg font-bold">{strength.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-muted">
                    {strength.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── サービス概要 ─── */}
      <section className="bg-green-gradient py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">
              SERVICES
            </p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              {t("realestate.home.services.sectionTitle")}
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-6">
            {services.map((service, i) => {
              const Icon = serviceIcons[i];
              const href = serviceHrefs[i];
              return (
                <Link
                  key={i}
                  href={href}
                  className="group relative overflow-hidden rounded-xl border border-border bg-surface p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg sm:p-8"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                      <Icon
                        size={24}
                        className="text-primary transition-colors duration-300"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium tracking-wider text-text-muted">
                        {service.subtitle}
                      </p>
                      <h3 className="mt-1 text-lg font-bold">
                        {service.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-text-muted">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-end text-xs font-medium text-primary">
                    {t("common.learnMore")}
                    <ArrowRight
                      size={14}
                      className="ml-1 transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 代表メッセージ ─── */}
      <section className="py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">
              MESSAGE
            </p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              {t("realestate.home.message.sectionTitle")}
            </h2>
          </div>

          <div className="mx-auto mt-10 max-w-3xl sm:mt-14">
            <div className="gradient-border overflow-hidden rounded-2xl bg-surface p-5 sm:p-8 md:p-12">
              <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
                <div className="h-40 w-32 shrink-0 overflow-hidden rounded-2xl">
                  <Image
                    src="/uramatsu.png"
                    alt={t("representative.name")}
                    width={128}
                    height={128}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <p className="text-sm leading-[1.9] text-text-muted">
                    {t("realestate.home.message.paragraph1")}
                  </p>
                  <p className="mt-4 text-sm leading-[1.9] text-text-muted">
                    {t("realestate.home.message.paragraph2")}
                  </p>
                  <div className="mt-6">
                    <p className="text-base font-bold">
                      {t("representative.name")}
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                      {t("realestate.home.message.title")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-dark"
                >
                  {t("common.cta.viewCompanyInfo")}
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── アクセス ─── */}
      <section className="border-t border-border py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">
              ACCESS
            </p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              {t("realestate.home.access.sectionTitle")}
            </h2>
          </div>

          <div className="mx-auto mt-10 max-w-4xl sm:mt-14">
            <div className="grid gap-6 md:grid-cols-2 md:gap-8">
              {/* Map */}
              <div className="overflow-hidden rounded-xl border border-border">
                <iframe
                  src="https://maps.google.com/maps?q=%E5%9B%9B%E8%91%89%E4%B8%8D%E5%8B%95%E7%94%A3%E6%A0%AA%E5%BC%8F%E4%BC%9A%E7%A4%BE+%2F+%E5%9B%9B%E8%91%89%E8%A1%8C%E6%94%BF%E6%9B%B8%E5%A3%AB%E4%BA%8B%E5%8B%99%E6%89%80&z=18&output=embed&hl=ja"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: 280 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t("realestate.home.access.mapTitle")}
                />
              </div>

              {/* Info */}
              <div className="flex flex-col justify-center">
                <h3 className="text-lg font-bold">
                  {t("realestate.home.access.name")}
                </h3>
                <address className="mt-4 text-sm not-italic leading-relaxed text-text-muted">
                  {t("address.postalCode")}
                  <br />
                  {t("address.prefecture")}
                  {t("address.city")}
                  {t("address.street")}
                  <br />
                  {t("address.building")}
                </address>
                <div className="mt-6 space-y-2 text-sm text-text-muted">
                  <p>
                    <span className="font-medium text-text">
                      {t("realestate.home.access.nearestStation.label")}
                    </span>
                    <br />
                    {t("realestate.home.access.nearestStation.value")}
                  </p>
                  <p>
                    <span className="font-medium text-text">
                      {t("realestate.home.access.businessHours.label")}
                    </span>
                    <br />
                    {t("realestate.home.access.businessHours.value")}
                  </p>
                </div>
                <div className="mt-6">
                  <a
                    href="https://maps.google.com/maps?q=四葉不動産株式会社+/+四葉行政書士事務所"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-dark"
                  >
                    {t("common.openInGoogleMaps")}
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="border-t border-border bg-surface-dim py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">
            {t("realestate.home.ctaSection.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-muted">
            {t("realestate.home.ctaSection.description1")}
            <br className="hidden sm:inline" />
            {t("realestate.home.ctaSection.description2")}
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:mt-10 sm:flex-row sm:justify-center">
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
