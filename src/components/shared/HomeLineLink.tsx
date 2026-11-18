"use client";
import Link from "next/link";
import { gaEvent } from "@/lib/gtag";
import type { HomeLineTopic } from "@/lib/home-conversion";
import type { LangCode } from "@/config/languages";

type Props = { href: string; children: React.ReactNode; className?: string; topic: HomeLineTopic; placement: "home_hero" | "home_topic"; locale: LangCode };
/** Navigation works without JS. Only fixed site values are analytics parameters. */
export function HomeLineLink({ href, children, className, topic, placement, locale }: Props) {
  return <Link href={href} prefetch={false} className={className} onClick={() => gaEvent("cta_line_click", { location: placement, topic, language: locale })}>{children}</Link>;
}
