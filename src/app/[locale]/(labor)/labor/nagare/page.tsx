import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import { srRegParen } from "@/lib/shared/sr-registration";
import { LABOR_WORKFLOW_COPY } from "@/lib/labor/workflow-copy";
import { LABOR_TOP_COPY } from "@/lib/labor/top-copy";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { LaborWorkflowCta } from "@/components/labor/LaborWorkflow";
import styles from "@/components/labor/LaborWarm.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = LABOR_WORKFLOW_COPY[locale];
  return buildPageMetadata({ businessKey: "labor", title: c.metaTitle, description: c.metaDescription, path: "/labor/nagare", locale, absoluteTitle: true });
}

export default async function Page() {
  const locale = await getRequestLocale();
  const c = LABOR_WORKFLOW_COPY[locale];
  const top = LABOR_TOP_COPY[locale];
  return <>
    {/* This is an engagement guide, not a standalone HowTo. Breadcrumb/Organization remain in their existing owners. */}
    <Breadcrumb items={[{ name: c.labels.breadcrumb, href: "/labor" }, { name: c.pageTitle }]} />
    <article className={styles.detail}>
      <header className={styles.detailHeader}>
        <h1>{c.pageTitle}</h1>
        <p>{c.lead}</p>
        {c.intro.map(p => <p key={p}>{p}</p>)}
        <p className={styles.scopeNote}>{c.scopeNote}</p>
        <LaborWorkflowCta locale={locale} placement="detail_intro" />
      </header>
      <nav aria-label={c.labels.toc} className={styles.toc}>
        <h2>{c.labels.toc}</h2>
        <ol>
          {c.steps.map((step, i) => <li key={step.id}><a href={`#${step.id}`}><span aria-hidden="true">{i + 1}.</span>{step.title}</a></li>)}
        </ol>
        <div className={styles.contactLinks}>
          <a href="#consultation-examples" className={styles.textLink}>{c.labels.cases}</a>
          <a href="#shared-materials" className={styles.textLink}>{c.labels.materials}</a>
          <a href="#information-handling" className={styles.textLink}>{c.labels.information}</a>
          <a href="#workflow-faq" className={styles.textLink}>{c.labels.faq}</a>
        </div>
      </nav>
      <section aria-labelledby="workflow-steps-title">
        <h2 id="workflow-steps-title">{c.labels.steps}</h2>
        <ol className={styles.steps}>
          {c.steps.map((step, i) => <li key={step.id} id={step.id} className={styles.step}>
            <span aria-hidden="true" className={styles.stepNumber}>{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3>{step.title}</h3>
              {step.paragraphs.map(p => <p key={p}>{p}</p>)}
              {step.items && <ul className={styles.stepItems}>{step.items.map(item => <li key={item}>{item}</li>)}</ul>}
              {step.roles && <dl className={styles.roles}>{step.roles.map(role => <div key={role.label}><dt>{role.label}</dt><dd>{role.body}</dd></div>)}</dl>}
              {step.clientAction && <p><strong>{c.labels.clientAction}: </strong>{step.clientAction}</p>}
              <dl className={styles.outcome}><dt>{c.labels.outcome}</dt><dd>{step.outcome}</dd></dl>
            </div>
          </li>)}
        </ol>
        <p className="mt-6">{c.scheduleNote}</p>
        <LaborWorkflowCta locale={locale} placement="detail_steps" />
      </section>
      <section id="consultation-examples" className={styles.detailSection}>
        <h2>{c.cases.heading}</h2>
        <p>{c.cases.intro}</p>
        <p className={styles.scopeNote}>{c.cases.note}</p>
        <div className={styles.cases}>{c.cases.items.map(item => <section key={item.title} className={styles.case}>
          <h3>{item.title}</h3>
          {item.paragraphs.map(p => <p key={p}>{p}</p>)}
          {item.flow && <p>{item.flow}</p>}
        </section>)}</div>
        <p>{c.cases.separationNote}</p>
      </section>
      <section id="shared-materials" className={styles.detailSection}>
        <h2>{c.materials.heading}</h2>
        <p><strong>{c.materials.emphasis}</strong></p>
        {c.materials.paragraphs.map(p => <p key={p}>{p}</p>)}
        <p>{c.materials.sharingNote}</p>
        <table role="table" className={styles.materials}>
          <caption className="sr-only">{c.materials.heading}</caption>
          <thead role="rowgroup"><tr role="row">{c.materials.columns.map(column => <th key={column} role="columnheader" scope="col">{column}</th>)}</tr></thead>
          <tbody role="rowgroup">{c.materials.rows.map(row => <tr key={row.category} role="row"><th role="rowheader" scope="row">{row.category}</th><td role="cell" data-label={c.materials.columns[1]}>{row.examples}</td><td role="cell" data-label={c.materials.columns[2]}>{row.handling}</td></tr>)}</tbody>
        </table>
        <p>{c.materials.note}</p>
      </section>
      <section id="information-handling" className={styles.detailSection}>
        <h2>{c.information.heading}</h2>
        {c.information.paragraphs.map(p => <p key={p}>{p}</p>)}
        <p className={styles.scopeNote}>{c.information.judgmentNote}</p>
      </section>
      <section id="workflow-faq" className={styles.detailSection}>
        <h2>{c.labels.faq}</h2>
        <div className={styles.faq}>{c.faqs.map(qa => <details key={qa.q}><summary>{qa.q}</summary><p>{qa.a}</p></details>)}</div>
      </section>
      <aside className={styles.author}>
        <Image src="/staff/uramatsu-square.webp" alt={top.portraitAlt} width={80} height={80} sizes="80px" />
        <div><p>{top.office}</p><p><strong>{top.name}</strong> · {top.representative}{srRegParen(locale)}</p>
          <Link href={addLocalePrefix("/labor/about", locale)} className={styles.textLink}>{c.cta.representativeLabel}</Link>
        </div>
      </aside>
      <LaborWorkflowCta locale={locale} placement="detail_end" channels />
    </article>
  </>;
}
