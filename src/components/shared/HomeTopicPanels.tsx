import Link from "next/link";
import { Building2, House } from "lucide-react";
import { addLocalePrefix } from "@/lib/locale";
import { HOME_ENTRIES, homeLineHref } from "@/lib/home-conversion";
import { HOME_TOPIC_COPY } from "@/lib/home-topic-copy";
import type { LangCode } from "@/config/languages";
import { HomeLineLink } from "./HomeLineLink";
import { BusinessCertification } from "./BusinessCertification";

const navLink = "inline-flex min-h-11 items-center text-sm font-semibold text-primary-dark underline decoration-primary/40 underline-offset-4 hover:decoration-primary-dark focus-visible:outline-2 focus-visible:outline-offset-4";
const card = "flex scroll-mt-24 flex-col rounded-2xl border border-primary/20 bg-[#FAF9F6] p-5 sm:p-7";
const cardTitle = "mt-4 font-serif text-2xl font-semibold leading-snug text-[#1B4332]";
const cardBody = "mt-3 text-sm leading-7 text-text";
const lineButton = "inline-flex min-h-12 items-center justify-center rounded-lg bg-[#1B4332] px-4 py-3 text-center text-sm font-semibold text-white hover:bg-[#2D6A4F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";
const businessArticle = "/column/shuro-ikou-shien-bukken-youto-chiiki-youken";
const inheritanceArticle = "/column/souzoku-jikka-uru-nokosu";

export function HomeTopicPanels({locale}: {locale: LangCode}) {
  const c = HOME_ENTRIES[locale];
  const t = HOME_TOPIC_COPY[locale];
  const l = (path: string) => addLocalePrefix(path,locale);
  return <section aria-labelledby="home-topics" className="mt-12 sm:mt-16">
    <h2 id="home-topics" className="font-serif text-2xl font-semibold leading-snug text-ink sm:text-3xl">{t.title}</h2>
    <p className="mb-6 mt-3 text-sm leading-7 text-text-muted">{t.lead}</p>
    <div className="grid items-start gap-5 lg:grid-cols-2">
      <article id="home-business" aria-labelledby="home-business-title" className={card}>
        <div className="flex items-center justify-between text-primary-dark"><span aria-hidden="true" className="text-xs font-semibold tracking-widest">02</span><Building2 aria-hidden="true" size={30} strokeWidth={1.4}/></div>
        <h3 id="home-business-title" className={cardTitle}>{t.businessTitle}</h3>
        <p className={cardBody}>{t.businessBody}</p>
        <div className="mt-5 flex flex-col items-stretch gap-2">
          <HomeLineLink href={homeLineHref("business",locale)} className={lineButton} topic="business" placement="home_topic" locale={locale}>{c.bline}</HomeLineLink>
          <Link className={navLink} href={l("/toushi")}>{c.bguide} →</Link>
          <Link className={navLink} href={l(businessArticle)}>{t.businessArticle} →</Link>
        </div>
        <div className="mt-6 border-t border-primary/20 pt-6">
          <BusinessCertification locale={locale} compact />
          <h4 className="mt-5 font-semibold leading-7 text-[#1B4332]">{t.benefitsTitle}</h4>
          <p className={cardBody}>{t.benefitsLead}</p>
          <details className="mt-3 rounded-lg border border-primary/15 bg-white px-4">
            <summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold leading-6 text-primary-dark focus-visible:outline-2 focus-visible:outline-offset-4">{t.benefitsDetails}</summary>
            <div className="space-y-4 border-t border-primary/15 py-4 text-sm leading-7">
              <div><a className={navLink} href="https://www.jfc.go.jp/n/finance/search/01_sinkikaigyou_m.html">{t.jfc} ↗</a><p>{t.jfcBody}</p></div>
              <div><a className={navLink} href="https://kyoujinnka.smrj.go.jp/">{t.bcp} ↗</a><p>{t.bcpBody}</p></div>
              <p className="text-xs text-text-muted">{t.checked}</p>
            </div>
          </details>
        </div>
      </article>
      <article id="home-inheritance" aria-labelledby="home-inheritance-title" className={card}>
        <div className="flex items-center justify-between text-primary-dark"><span aria-hidden="true" className="text-xs font-semibold tracking-widest">03</span><House aria-hidden="true" size={30} strokeWidth={1.4}/></div>
        <h3 id="home-inheritance-title" className={cardTitle}>{t.inheritanceTitle}</h3>
        <p className={cardBody}>{t.inheritanceBody}</p>
        <div className="mt-5 flex flex-col items-stretch gap-2">
          <HomeLineLink href={homeLineHref("inheritance",locale)} className={lineButton} topic="inheritance" placement="home_topic" locale={locale}>{c.iline}</HomeLineLink>
          <Link className={navLink} href={l("/souzoku")}>{c.iguide} →</Link>
          <Link className={navLink} href={inheritanceArticle}>{t.inheritanceArticle}{locale !== "ja" && ` (${t.japaneseArticle})`} →</Link>
        </div>
        <div className="mt-6 border-t border-primary/20 pt-4">
          <p className={cardBody}>{t.legalBody}</p>
          <Link href={l("/legal")} className={`${navLink} mt-3 flex-col items-start justify-center py-2`}><span>{t.legalLink} →</span><span className="mt-1 break-all text-xs font-normal">https://luck428.com{l("/legal")}</span></Link>
          <p className="mt-3 text-xs leading-6 text-text-muted">{t.legalScope}</p>
        </div>
      </article>
    </div>
    <p className="mt-5 text-xs leading-6 text-text-muted">{t.separation}</p>
    <nav aria-label={c.directions} className="mt-5 flex flex-wrap gap-x-6 border-t border-border pt-3">
      <Link className={navLink} href={l("/gakku")}>{c.zone}</Link>
      <Link className={navLink} href={l("/gakku/sales")}>{c.sale}</Link>
      <Link className={navLink} href={l("/global")}>{c.global}</Link>
    </nav>
  </section>;
}
