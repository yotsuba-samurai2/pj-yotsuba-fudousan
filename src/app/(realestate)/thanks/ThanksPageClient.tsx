"use client";

import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export function ThanksPageClient() {
  const { t } = useTranslation();

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 pt-20">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle size={40} className="text-primary" />
        </div>
        <h1 className="mt-8 text-2xl font-bold sm:text-3xl">
          {t("thanks.title")}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-text-muted">
          {t("thanks.description1")}
          <br />
          {t("thanks.description2")}
        </p>
        <div className="mt-10">
          <Link
            href="/"
            className="gradient-line inline-flex items-center gap-2 rounded-md px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:brightness-110 opacity-80"
          >
            {t("common.backToTop")}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
