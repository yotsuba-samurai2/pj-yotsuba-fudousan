import Link from "next/link";
import type { LangCode } from "@/config/languages";
import { addLocalePrefix } from "@/lib/locale";
import { LABOR_WORKFLOW_COPY } from "@/lib/labor/workflow-copy";
import { OFFICE, CONTACT_HREF } from "@/lib/shared/office-public";
import { LaborWorkflowImpression, LaborWorkflowLink } from "./LaborWorkflowTracking";
import styles from "./LaborWarm.module.css";

export function LaborWorkflowBanner({ locale }: { locale: LangCode }) {
  const c = LABOR_WORKFLOW_COPY[locale].banner;
  return <LaborWorkflowImpression key={locale} locale={locale}>
    <section className={styles.banner} aria-labelledby="workflow-banner-title">
      <div>
        <p className={styles.eyebrow}>{c.eyebrow}</p>
        <h2 id="workflow-banner-title" className={styles.sectionTitle}>{c.heading}</h2>
        {c.paragraphs.map(p => <p key={p}>{p}</p>)}
        <p>{c.note}</p>
      </div>
      <ol className={styles.bannerGroups}>
        {c.groups.map((group, i) => <li key={group.stepRange}>
          <span aria-hidden="true" className={styles.number}>{String(i + 1).padStart(2, "0")}</span>
          <div><strong>{group.label}</strong><small>{group.stepRange}</small></div>
        </li>)}
      </ol>
      <div className={styles.bannerLink}>
        <LaborWorkflowLink href={addLocalePrefix("/labor/nagare", locale)} locale={locale} event="workflow_banner_click" placement="top_banner" className={styles.textLink}>{c.ctaLabel}</LaborWorkflowLink>
      </div>
    </section>
  </LaborWorkflowImpression>;
}

const CHANNEL_LABELS: Record<LangCode, { line: string; phone: string }> = {
  ja: { line: "LINEで相談する", phone: "電話" },
  en: { line: "Contact us on LINE", phone: "Call" },
  "zh-tw": { line: "透過LINE諮詢", phone: "電話" },
  zh: { line: "通过LINE咨询", phone: "电话" },
};

/** Page-specific CTA avoids nesting existing analytics wrappers. */
export function LaborWorkflowCta({ locale, placement, channels = false }: {
  locale: LangCode; placement: "detail_intro" | "detail_steps" | "detail_end"; channels?: boolean;
}) {
  const c = LABOR_WORKFLOW_COPY[locale].cta;
  const labels = CHANNEL_LABELS[locale];
  return <div className={styles.detailCta}>
    <div className={styles.actions}>
      <LaborWorkflowLink href={`${addLocalePrefix(CONTACT_HREF.labor, locale)}?intent=labor`} locale={locale} event="workflow_cta_click" placement={placement} channel="form" className={styles.primary}>{c.primary}</LaborWorkflowLink>
      <Link href={addLocalePrefix("/labor/ryokin", locale)} className={styles.secondary}>{c.pricing}</Link>
    </div>
    {channels && <div className={styles.contactLinks}>
      <LaborWorkflowLink href={addLocalePrefix("/line", locale)} locale={locale} event="workflow_cta_click" placement={placement} channel="line" className={styles.textLink}>{labels.line}</LaborWorkflowLink>
      <LaborWorkflowLink href={OFFICE.telHref} locale={locale} event="workflow_cta_click" placement={placement} channel="phone" className={styles.textLink}>{labels.phone} {OFFICE.tel}</LaborWorkflowLink>
    </div>}
    {placement !== "detail_steps" && <p>{c.note}</p>}
  </div>;
}
