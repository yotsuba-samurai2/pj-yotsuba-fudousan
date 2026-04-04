"use client";

import { useTranslation } from "@/hooks/useTranslation";

export function SkipToContent() {
  const { t } = useTranslation();
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
    >
      {t("common.skipToContent")}
    </a>
  );
}
