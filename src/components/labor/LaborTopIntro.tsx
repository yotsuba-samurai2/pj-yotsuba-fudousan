import Image from "next/image";
import Link from "next/link";
import type { LangCode } from "@/config/languages";
import { addLocalePrefix } from "@/lib/locale";
import { LABOR_TOP_COPY } from "@/lib/labor/top-copy";
import { LABOR_ENGAGEMENT_COPY } from "@/lib/labor/engagement-copy";
import { LaborEngagementLink } from "./LaborEngagementLink";
import { LaborWorkflowLink } from "./LaborWorkflowTracking";
import styles from "./LaborWarm.module.css";

export function LaborTopHero({ locale }: { locale: LangCode }) {
  const c = LABOR_TOP_COPY[locale];
  return <section className={styles.hero} aria-labelledby="labor-hero-title">
    <div className={styles.heroGrid}>
      <div className={styles.heroCopy}>
        <h1 id="labor-hero-title" className={styles.headline}>{c.headline.map(line => <span key={line}>{line}</span>)}</h1>
        <p className={styles.lead}>{c.lead}</p>
        <div className={styles.actions}>
          <LaborWorkflowLink href={`${addLocalePrefix("/labor/contact", locale)}?intent=labor`} locale={locale} event="cta_contact_click" placement="hero" channel="form" className={styles.primary}>{c.consult}</LaborWorkflowLink>
          <Link href={addLocalePrefix("/labor/ryokin", locale)} className={styles.secondary}>{c.pricing}</Link>
        </div>
        <p className={styles.consultationNote}>{LABOR_ENGAGEMENT_COPY[locale].consultationNote}</p>
        <Link href={addLocalePrefix("/labor/nagare", locale)} className={styles.textLink}>{c.workflow}</Link>
        <div className={styles.photoCaption}>
          <p className={styles.representative}>{c.representative}<strong>{c.name}</strong></p>
        </div>
      </div>
      <figure className={styles.portrait}>
        <Image src="/hero/labor-representative-0169.webp" alt={c.portraitAlt} width={1145} height={1374}
          sizes="(min-width: 1024px) 48vw, (min-width: 768px) 90vw, 100vw" quality={60} loading="eager" fetchPriority="high" preload className={styles.portraitImage} />
      </figure>
    </div>
  </section>;
}

export function LaborRequestMethods({ locale }: { locale: LangCode }) {
  const c = LABOR_TOP_COPY[locale];
  const e = LABOR_ENGAGEMENT_COPY[locale];
  return <section id="standalone-services" className={styles.methods} aria-labelledby="request-methods-title">
    <h2 id="request-methods-title" className={styles.sectionTitle}>{c.methods}</h2>
    <p className={styles.methodNote}>{c.noRetainer}</p>
    <div className={styles.methodGrid}>
      {c.services.map(service => <section key={service.service} className={styles.method}>
        <h3>{service.title}</h3>
        <p>{service.body}</p>
        {service.service === "payroll_only" && <p>{e.quoted}</p>}
        <LaborEngagementLink href={service.service === "advisory" ? "#advisory-plan" : `${addLocalePrefix("/labor/contact", locale)}?intent=labor`} locale={locale} serviceType={service.service} placement="standalone" className={styles.textLink}>{service.link}</LaborEngagementLink>
      </section>)}
    </div>
  </section>;
}
