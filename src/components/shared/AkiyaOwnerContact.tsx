"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { gaEvent } from "@/lib/gtag";

export function AkiyaOwnerContact({ href, placement, children }: { href: string; placement: "hero" | "footer"; children: ReactNode }) {
  return (
    <Link href={href} onClick={() => gaEvent("cta_contact_click", { location: `akiya_${placement}`, page: "akiya" })}
      className="inline-flex min-h-11 items-center rounded-lg bg-primary-dark px-4 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
      {children}
    </Link>
  );
}
