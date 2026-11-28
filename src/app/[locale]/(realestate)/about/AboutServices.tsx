"use client";

import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { getAboutBrandContent } from "@/lib/about-brand-content";

const services = [
  { href: "/legal/about", image: "administrative", number: "01", color: "#8b4a38", line: "#c68c73" },
  { href: "/labor/about", image: "labor", number: "02", color: "#275d59", line: "#75a5a1" },
  { href: "https://www.samurai.co.jp/about", image: "directory", number: "03", color: "#644b79", line: "#a693b8" },
] as const;
const action = "inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline decoration-current underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4";

export function AboutServices({ locale }: { locale: string }) {
  const copy = getAboutBrandContent(locale);
  const laborEnabled = process.env.NEXT_PUBLIC_SR_LAUNCHED === "true";
  return (
    <section aria-labelledby="about-services-title" className="border-b border-border bg-[#faf9f6] py-12 text-[#1b4332] sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold tracking-[0.22em]" lang="en">OUR SERVICES</p>
        <h2 id="about-services-title" className="mt-3 text-3xl leading-tight font-bold sm:text-4xl">{copy.title}</h2>
        <p className="mt-3 text-sm text-[#46564c] sm:text-base">{copy.intro}</p>
        <article className="mt-7 grid overflow-hidden rounded-sm bg-[#193e31] text-white lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div className="flex flex-col justify-center px-6 py-7 sm:px-9 sm:py-9">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#d0e2d3]" lang="en">REAL ESTATE</p>
            <h3 className="mt-3 text-2xl leading-snug font-bold text-balance sm:text-3xl">{copy.investmentTitle}</h3>
            <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-[#f1f5ef] sm:text-base">{copy.investmentCopy}</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link href="/toushi" className="inline-flex min-h-11 items-center gap-2 rounded-sm bg-[#fff8eb] px-3 py-2 text-sm font-semibold text-[#193e31] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                {copy.investmentAction}<ArrowRight size={16} aria-hidden="true" />
              </Link>
              <a href="mailto:uramatsujoji@luck428.com" className={action}>{copy.emailAction}</a>
            </div>
          </div>
          <div className="relative aspect-video lg:aspect-auto">
            <Image src="/about-services/real-estate.png" alt="" fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover object-[64%_center]" />
          </div>
        </article>
        <div className="mt-10">
          <p className="text-xs font-semibold tracking-[0.2em]" lang="en">YOTSUBA GROUP</p>
          <h3 className="mt-2 text-2xl font-bold">{copy.groupTitle}</h3>
          <div className={`mt-5 grid gap-6 ${laborEnabled ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
            {services.map((item, index) => {
              if (index === 1 && !laborEnabled) return null;
              const entry = copy.services[index];
              const linkLabel = `${entry.name}：${entry.action}`;
              return (
                <article key={item.image} className="grid grid-cols-[minmax(92px,1fr)_minmax(0,2fr)] gap-x-4 border-t pt-3 sm:flex sm:flex-col sm:gap-0" style={{ borderColor: item.line, color: item.color }}>
                  <div className="relative aspect-[3/2] w-full self-start overflow-hidden rounded-sm bg-white">
                    <Image src={`/about-services/${item.image}.png`} alt="" fill sizes="(min-width: 640px) 33vw, 32vw" className="object-cover" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.14em] sm:mt-3" lang="en">{item.number} / {entry.label}</p>
                    <h4 className="mt-1 text-base leading-snug font-bold sm:text-xl">{entry.name}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-[#46564c]">{entry.description}</p>
                    {index === 2 ? (
                      <a href={item.href} aria-label={linkLabel} className={action}>{entry.action}<ArrowUpRight aria-hidden="true" size={14} /></a>
                    ) : (
                      <Link href={item.href} aria-label={linkLabel} className={action}>{entry.action}<ArrowRight aria-hidden="true" size={14} /></Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
          <div className="mt-5 space-y-1 border-t border-[#d8ded3] pt-3 text-xs leading-relaxed text-[#46564c]">
            <p>{laborEnabled ? copy.groupNote : copy.groupNoteBeforeLaborLaunch}</p>
            <p>{copy.directoryNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
