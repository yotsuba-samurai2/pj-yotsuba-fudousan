"use client";

import Link from "next/link";
import { gaEvent } from "@/lib/gtag";
import { MINPAKU_PURCHASE_CONTACT, MINPAKU_PURCHASE_INTENT } from "@/lib/shared/minpaku-purchase";

export function PurchaseCta({ location, secondary = false }: { location: "hero" | "regions" | "closing" | "investment"; secondary?: boolean }) {
  return (
    <Link
      href={MINPAKU_PURCHASE_CONTACT}
      className={secondary
        ? "inline-flex min-h-12 items-center justify-center rounded-md border border-primary px-5 py-3 text-center text-sm font-semibold text-primary-dark hover:bg-primary-tint focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        : "inline-flex min-h-12 items-center justify-center rounded-md bg-primary-dark px-5 py-3 text-center text-sm font-semibold text-white hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"}
      onClick={() => gaEvent("cta_click", { business: "realestate", location: `minpaku_purchase_${location}`, intent: MINPAKU_PURCHASE_INTENT })}
    >
      {secondary ? "購入・活用について相談する" : "購入について相談する"}
    </Link>
  );
}
