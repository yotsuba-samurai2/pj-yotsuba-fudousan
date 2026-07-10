"use client";

import Image from "next/image";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import {
  ArrowRight,
  Scale,
  Users,
  Newspaper,
  Handshake,
  Building2,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";


const strengthItems = [
  {
    icon: Newspaper,
    title: "元新聞記者の情報力",
    description:
      "取材力と文章力を活かした「通る申請書」を作成。補助金採択率を高めます。",
    subtitle: "JOURNALISM",
  },
  {
    icon: Handshake,
    title: "ワンストップ対応",
    description:
      "行政書士と社労士が同一法人内で連携。ビザ取得から雇用手続きまで一括対応。",
    subtitle: "ONE-STOP",
  },
  {
    icon: Building2,
    title: "不動産との連携",
    description:
      "グループの四葉不動産と連携し、事業用物件の確保から開業手続きまでトータル支援。",
    subtitle: "REAL ESTATE",
  },
];

export default function UnifiedTopContent() {
  const { t } = useTranslation();

  return (
    <div className="relative">
      {/* ─── Hero ─── */}
      <section className="relative grid min-h-screen place-content-center overflow-hidden border-b border-border pt-24 pb-16 sm:pt-32 sm:pb-32 md:pt-40 md:pb-40">
        <div
          className="pointer-events-none absolute inset-0 bg-primary/[0.03]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl font-bold leading-[1.3] tracking-tight sm:text-4xl md:text-5xl lg:text-[3.5rem]">
              行政書士×社労士
              <br />
              <span className="cta-gradient-text">
                ワンストップ士業事務所
              </span>
            </h1>

            <div className="mt-4 h-0.5 w-16 rounded-full gradient-line sm:mt-6" />

            <p className="mt-4 max-w-2xl text-sm leading-[1.8] text-text-muted sm:mt-5 sm:text-[0.95rem]">
              元新聞記者の代表が、補助金・ビザ・会社設立から社会保険・労務管理まで、まとめてサポートします。
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row">
              <Link
                href="/contact"
                className="gradient-line inline-flex items-center justify-center gap-2 rounded-md px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:brightness-110 sm:py-3.5 opacity-80"
              >
                {t("common.cta.consultFirst")}
                <ArrowRight size={16} />
              </Link>
              <a
                href="#departments"
                className="cta-gradient-outline inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold shadow-sm transition-all duration-200 hover:shadow-md sm:py-3.5"
              >
                <span className="cta-gradient-text">
                  {t("common.cta.viewServices")}
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2つの専門部門 ─── */}
      <section
        id="departments"
        className="py-14 sm:py-20 md:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">
              DEPARTMENTS
            </p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              2つの専門部門
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-6">
            {/* 行政書士 */}
            <Link
              href="/legal/services"
              className="group relative overflow-hidden rounded-xl border border-border bg-surface p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-md sm:p-8"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                  <Scale
                    size={24}
                    className="text-primary transition-colors duration-300"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-medium tracking-wider text-text-muted">
                    ADMINISTRATIVE SCRIVENER
                  </p>
                  <h3 className="mt-1 text-lg font-bold">
                    四葉行政書士事務所
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">
                    補助金・助成金申請、ビザ・在留資格、会社設立、各種許認可
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

            {/* 社労士 */}
            <Link
              href="/labor"
              className="group relative overflow-hidden rounded-xl border border-border bg-surface p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-md sm:p-8"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                  <Users
                    size={24}
                    className="text-primary transition-colors duration-300"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-medium tracking-wider text-text-muted">
                    SOCIAL INSURANCE & LABOR
                  </p>
                  <h3 className="mt-1 text-lg font-bold">
                    四葉社会保険労務士事務所
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">
                    社会保険手続き、就業規則作成、助成金申請、労務相談
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
          </div>
        </div>
      </section>

      {/* ─── 強み ─── */}
      <section className="border-t border-border py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">
              STRENGTHS
            </p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              四葉パートナーズ 士業部門の強み
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-3 sm:gap-8">
            {strengthItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="gradient-border group relative overflow-hidden rounded-xl bg-surface p-5 transition-shadow duration-300 hover:shadow-lg sm:p-8"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <p className="mt-2 text-xs font-medium tracking-wider text-text-muted">
                    {item.subtitle}
                  </p>
                  <h3 className="mt-3 text-lg font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-muted">
                    {item.description}
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
          <div className="mx-auto max-w-3xl text-center">
            <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">
              REPRESENTATIVE
            </p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              代表紹介
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
                    height={160}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <p className="text-sm leading-[1.9] text-text-muted">
                    元新聞記者。4カ国での在住経験を活かし、多角的な視点で法務・労務をサポートします。
                  </p>
                  <div className="mt-6">
                    <p className="text-base font-bold">
                      {t("representative.name")}
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                      行政書士 / 代表
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="border-t border-border bg-green-gradient py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">
            まずはお気軽にご相談ください
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-muted">
            補助金・ビザ・会社設立・社会保険・労務管理、どんなご相談でもお気軽にどうぞ。
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:mt-10 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
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
    </div>
  );
}
