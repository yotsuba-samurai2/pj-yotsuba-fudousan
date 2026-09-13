"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { LangCode } from "@/config/languages";
import { gaEvent } from "@/lib/gtag";

type Props = {
  href: string;
  locale: LangCode;
  serviceType: "procedure" | "payroll_only" | "advisory";
  placement: "hero" | "standalone" | "faq_end";
  className?: string;
  children: ReactNode;
};

/** Track intent clicks separately from the existing successful contact_submit event. */
export function LaborEngagementLink({ href, locale, serviceType, placement, className, children }: Props) {
  return <Link href={href} className={className} onClick={() => gaEvent("labor_service_click", {
    business: "labor", locale, service_type: serviceType, placement,
  })}>{children}</Link>;
}
