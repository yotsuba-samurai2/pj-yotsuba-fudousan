"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Users,
  ClipboardCheck,
  Coins,
  HeartHandshake,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const icons = [
  ClipboardCheck,
  Coins,
  FileText,
  Users,
  HeartHandshake,
  ShieldCheck,
];

export function LaborPageContent() {
  const { t, tArray } = useTranslation();

  const services = tArray<{ title: string; description: string }>(
    "labor.homePage.services",
  );
  const groupBusinesses = tArray<{ name: string; description: string }>(
    "labor.homePage.groupBusinesses",
  );

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative grid min-h-[40vh] place-content-center overflow-hidden border-b border-border pt-24 pb-16 sm:pt-32 sm:pb-32 md:pt-40 md:pb-40">
        <div
          className="pointer-events-none absolute inset-0 bg-green-gradient"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:gap-16 md:text-left">
            <div className="shrink-0">
              <Image
                src="/yotsuba/labor-square.png"
                alt={t("labor.homePage.title")}
                width={180}
                height={180}
                className="h-28 w-auto sm:h-36 md:h-44"
                priority
              />
            </div>
            <div>
              <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">
                SERVICES
              </p>
              <h1 className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl">
                {t("labor.homePage.title")}
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-text-muted sm:text-base">
                {t("labor.homePage.heroDescription1")}
                <br />
                {t("labor.homePage.heroDescription2")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── サービス一覧 ─── */}
      <section className="py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">
              SERVICES
            </p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              {t("labor.homePage.servicesTitle")}
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {services.map((service, i) => {
              const Icon = icons[i] ?? ClipboardCheck;
              return (
                <div
                  key={service.title}
                  className="gradient-border group relative overflow-hidden rounded-xl bg-surface p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-lg sm:p-8"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-muted">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 代表紹介 ─── */}
      <section className="border-t border-border bg-surface-dim py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="gradient-border overflow-hidden rounded-2xl bg-surface p-5 sm:p-8 md:p-12">
            <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
              <div className="h-40 w-32 shrink-0 overflow-hidden rounded-2xl">
                <Image
                  src="/uramatsu.png"
                  alt={t("representative.name")}
                  width={128}
                  height={160}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm leading-[1.9] text-text-muted">
                  {t("labor.homePage.representativeBio1")}
                </p>
                <p className="mt-4 text-sm leading-[1.9] text-text-muted">
                  {t("labor.homePage.representativeBio2")}
                </p>
                <div className="mt-6">
                  <p className="text-base font-bold">
                    {t("representative.name")}
                  </p>
                  <p className="mt-1 text-xs text-text-muted">
                    {t("labor.homePage.representativeTitle")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 四葉グループの強み ─── */}
      <section className="py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">
            ONE-STOP
          </p>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
            {t("labor.homePage.oneStopTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-muted">
            {t("labor.homePage.oneStopDescription1")}
            {t("labor.homePage.oneStopDescription2")}
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {groupBusinesses.map((biz, i) => {
              const hrefs = ["/", "/legal", ""];
              const imgs = [
                "/yotsuba/realestate-square.png",
                "/yotsuba/legal-square.png",
                "/yotsuba/labor-square.png",
              ];
              const isCurrentPage = i === 2;

              if (isCurrentPage) {
                return (
                  <div
                    key={biz.name}
                    className="rounded-xl border border-primary/30 bg-surface p-6 shadow-md"
                  >
                    <Image
                      src={imgs[i]}
                      alt={biz.name}
                      width={56}
                      height={56}
                      className="mx-auto h-14 w-14 object-contain"
                    />
                    <p className="mt-3 text-sm font-bold">{biz.name}</p>
                    <p className="mt-1 text-xs text-primary font-medium">
                      {t("common.thisPage")}
                    </p>
                  </div>
                );
              }

              return (
                <Link
                  key={biz.name}
                  href={hrefs[i]}
                  className="rounded-xl border border-border bg-surface p-6 transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <Image
                    src={imgs[i]}
                    alt={biz.name}
                    width={56}
                    height={56}
                    className="mx-auto h-14 w-14 object-contain"
                  />
                  <p className="mt-3 text-sm font-bold">{biz.name}</p>
                  <p className="mt-1 text-xs text-text-muted">
                    {biz.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="border-t border-border bg-green-gradient py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">
            {t("common.cta.feelFreeToContact")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-muted">
            {t("labor.homePage.ctaDescription")}
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/labor/contact"
              className="gradient-line inline-flex items-center gap-2 rounded-md px-10 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:brightness-110"
            >
              {t("common.cta.contactUs")}
              <ArrowRight size={16} />
            </Link>
            <a
              href="https://www.samurai.co.jp/samurai/reserve/uramatsu-joji"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-gradient-outline inline-flex items-center gap-2 px-10 py-4 text-sm font-semibold shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <span className="cta-gradient-text">
                {t("common.onlineBooking")}
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
