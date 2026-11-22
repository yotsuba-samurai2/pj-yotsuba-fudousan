import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import type { LangCode } from "@/config/languages";
import { addLocalePrefix } from "@/lib/locale";
import { INTERNATIONAL_INHERITANCE_COPY } from "./copy";
import styles from "./guide.module.css";

export const INHERITANCE_CONTACT_INTENT = "souzoku-legal";
export const INHERITANCE_DOCUMENT_SERVICES_ID = "inheritance-document-services";

const ASSET_SOURCES = {
  deposits: "https://www.digital.go.jp/policies/mynumber_faq_09",
  securities: "https://www.jasdec.com/procedure/shareholders/disclosure/direct/index.html",
  property: "https://www.city.osaka.lg.jp/higashiyodogawa/cmsfiles/contents/0000565/565507/pannfu202404.pdf#page=5",
  insurance: "https://www.seiho.or.jp/contact/inquiry/index.html",
} as const;

const DEADLINE_SOURCES = {
  renunciation: "https://www.courts.go.jp/saiban/syurui/syurui_kazi/kazi_06_13/index.html",
  finalTax: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/2022.htm",
  inheritanceTax: "https://www.nta.go.jp/taxes/shiraberu/taxanswer/sozoku/4205.htm",
} as const;

const TAIWAN_SOURCES = [
  "https://www.ris.gov.tw/documents/html/8/7/1/741_Q01.html",
  "https://www.ris.gov.tw/documents/data/2/1/dcf8c46c-da8d-417c-9a50-04aecff6a8ea.pdf#page=40",
] as const;

const TAIWAN_ARTICLES = [
  "/legal/column/taiwan-inkan-shomei-isan-bunkatsu",
  "/legal/column/taiwan-koseki-jokoseki-shutoku",
] as const;

const SALE_SOURCES = [
  "https://www.nta.go.jp/taxes/shiraberu/taxanswer/joto/3270.htm",
  "https://www.nta.go.jp/taxes/shiraberu/taxanswer/joto/3267.htm",
] as const;

const SECTIONS = {
  start: "international-inheritance-start",
  assets: "international-inheritance-assets",
  documents: "international-inheritance-documents",
  deadlines: "international-inheritance-deadlines",
  consultation: "international-inheritance-consultation",
  sale: "international-inheritance-sale",
  contact: "international-inheritance-contact",
} as const;

const TOC_SECTIONS = [
  SECTIONS.start,
  SECTIONS.assets,
  SECTIONS.documents,
  SECTIONS.deadlines,
  SECTIONS.consultation,
] as const;

type ImageName = "taiwan-coast" | "family-records" | "asset-search" | "document-purpose" | "consultation";
type DetailImageName = Exclude<ImageName, "taiwan-coast">;

function GuideImage({ name, alt }: { name: ImageName; alt: string }) {
  const isHero = name === "taiwan-coast";
  return (
    <Image
      src={`/illustrations/international-inheritance/${name}.webp`}
      alt={alt}
      width={1600}
      height={900}
      sizes={isHero ? "(min-width: 640px) 310px, calc(100vw - 64px)" : "(min-width: 640px) 208px, min(304px, calc(100vw - 32px))"}
      quality={60}
      loading="lazy"
      className={isHero ? styles.heroImage : styles.detailImage}
    />
  );
}

function SectionHeading({ id, title, lead, art }: {
  id: string;
  title: string;
  lead?: string;
  art?: { name: DetailImageName; alt: string };
}) {
  return (
    <div className={art ? styles.illustratedHeading : styles.sectionHeading}>
      <div>
        <h3 id={id} className={styles.sectionTitle}>{title}</h3>
        {lead && <p className={styles.lead}>{lead}</p>}
      </div>
      {art && <GuideImage {...art} />}
    </div>
  );
}

function Steps({ items }: { items: readonly [string, string][] }) {
  return (
    <ol className={styles.steps} role="list">
      {items.map(([title, text], i) => (
        <li key={title} className={styles.card}>
          <span aria-hidden="true" className={styles.tag}>{String(i + 1).padStart(2, "0")}</span>
          <h4 className={styles.cardTitle}>{title}</h4>
          <p>{text}</p>
        </li>
      ))}
    </ol>
  );
}

const TAIWAN_FORM_TEXT = /(金融機構存戶死亡，繼承人辦理存款繼承|不動產登記|申請目的)/g;

function WithTaiwanFormText({ text, locale }: { text: string; locale: LangCode }) {
  if (locale === "zh-tw") return text;
  return text.split(TAIWAN_FORM_TEXT).map((part, i) => (
    i % 2 === 1 && (locale !== "ja" || part !== "申請目的")
      ? <span key={i} lang="zh-Hant-TW">{part}</span>
      : <Fragment key={i}>{part}</Fragment>
  ));
}

export function InternationalInheritanceGuide({ locale }: { locale: LangCode }) {
  const c = INTERNATIONAL_INHERITANCE_COPY[locale];
  const contactHref = addLocalePrefix(`/legal/contact?intent=${INHERITANCE_CONTACT_INTENT}`, locale);

  return (
    <section id="international-inheritance" aria-labelledby="international-inheritance-heading" className={styles.guide}>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>{c.hero.eyebrow}</p>
          <h2 id="international-inheritance-heading" className={styles.heroTitle}>
            {c.hero.heading[0]} <br />{c.hero.heading[1]}
          </h2>
          <p className={styles.lead}>{c.hero.lead}</p>
          <div className={styles.actions}>
            <Link className={styles.button} href={contactHref}>{c.hero.contact}</Link>
            <a href={`#${SECTIONS.start}`}>{c.hero.checklist}</a>
          </div>
          <p className={styles.small}>{c.hero.language}</p>
        </div>
        <GuideImage name="taiwan-coast" alt={c.hero.alt} />
      </header>

      <nav className={styles.navigation} aria-label={c.tocLabel}>
        <ul role="list">
          {TOC_SECTIONS.map((section, i) => (
            <li key={section}><a href={`#${section}`}>{c.toc[i]}</a></li>
          ))}
        </ul>
      </nav>

      <section id={SECTIONS.start} aria-labelledby={`${SECTIONS.start}-heading`} className={styles.section}>
        <SectionHeading id={`${SECTIONS.start}-heading`} title={c.start.heading} lead={c.start.lead} art={{ name: "family-records", alt: c.start.alt }} />
        <Steps items={c.start.steps} />
      </section>

      <section id={SECTIONS.assets} aria-labelledby={`${SECTIONS.assets}-heading`} className={styles.section}>
        <SectionHeading id={`${SECTIONS.assets}-heading`} title={c.assets.heading} lead={c.assets.lead} art={{ name: "asset-search", alt: c.assets.alt }} />
        <ul role="list" className={styles.cards}>
          {(Object.keys(ASSET_SOURCES) as (keyof typeof ASSET_SOURCES)[]).map((key) => {
            const item = c.assets.items[key];
            return (
              <li key={key} className={styles.card}>
                <span className={styles.tag}>{item.tag}</span>
                <h4 className={styles.cardTitle}>{item.title}</h4>
                <p>{item.text}</p>
                <a href={ASSET_SOURCES[key]} hrefLang="ja">{item.source}</a>
              </li>
            );
          })}
        </ul>
      </section>

      <section id={SECTIONS.documents} aria-labelledby={`${SECTIONS.documents}-heading`} className={styles.section}>
        <SectionHeading id={`${SECTIONS.documents}-heading`} title={c.documents.heading} lead={c.documents.lead} art={{ name: "document-purpose", alt: c.documents.alt }} />
        <ul role="list" className={styles.cards}>
          {c.documents.items.map(([title, text]) => (
            <li key={title} className={styles.card}>
              <h4 className={styles.cardTitle}>{title}</h4>
              <p><WithTaiwanFormText text={text} locale={locale} /></p>
            </li>
          ))}
        </ul>
        <ul role="list" className={styles.sources}>
          {TAIWAN_SOURCES.map((url, i) => (
            <li key={url}><a href={url} hrefLang="zh-Hant-TW">{c.documents.sources[i]}</a></li>
          ))}
          {TAIWAN_ARTICLES.map((path, i) => (
            <li key={path}><Link href={addLocalePrefix(path, locale)}>{c.documents.sources[i + 2]}</Link></li>
          ))}
        </ul>
        <div className={styles.callout}><p>{c.documents.callout}</p></div>
      </section>

      <section id={SECTIONS.deadlines} aria-labelledby={`${SECTIONS.deadlines}-heading`} className={styles.section}>
        <SectionHeading id={`${SECTIONS.deadlines}-heading`} title={c.deadlines.heading} lead={c.deadlines.lead} />
        <dl className={styles.timeline}>
          {(Object.keys(DEADLINE_SOURCES) as (keyof typeof DEADLINE_SOURCES)[]).map((key) => {
            const item = c.deadlines.items[key];
            return (
              <div key={key} className={styles.card}>
                <dt className={styles.duration}>{item.duration}</dt>
                <dd>
                  <h4 className={styles.cardTitle}>{item.title}</h4>
                  <p>{item.text}</p>
                  <a href={DEADLINE_SOURCES[key]} hrefLang="ja">{item.source}</a>
                </dd>
              </div>
            );
          })}
        </dl>
      </section>

      <section id={SECTIONS.consultation} aria-labelledby={`${SECTIONS.consultation}-heading`} className={styles.section}>
        <SectionHeading id={`${SECTIONS.consultation}-heading`} title={c.consultation.heading} art={{ name: "consultation", alt: c.consultation.alt }} />
        <Steps items={c.consultation.steps} />
        <dl className={styles.roles}>
          {c.consultation.roles.map(([title, text]) => (
            <div key={title}>
              <dt>{title}</dt>
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
        <p className={styles.lead}>{c.consultation.separateEngagements}</p>
      </section>

      <section id={SECTIONS.sale} aria-labelledby={`${SECTIONS.sale}-heading`} className={styles.section}>
        <SectionHeading id={`${SECTIONS.sale}-heading`} title={c.sale.heading} lead={c.sale.text} />
        <ul role="list" className={styles.sources}>
          {SALE_SOURCES.map((url, i) => (
            <li key={url}><a href={url} hrefLang="ja">{c.sale.sources[i]}</a></li>
          ))}
        </ul>
      </section>

      <section id={SECTIONS.contact} aria-labelledby={`${SECTIONS.contact}-heading`} className={styles.contact}>
        <SectionHeading id={`${SECTIONS.contact}-heading`} title={c.contact.heading} lead={c.contact.text} />
        <div className={styles.actions}>
          <Link className={styles.button} href={contactHref}>{c.contact.primary}</Link>
          <a href={`#${INHERITANCE_DOCUMENT_SERVICES_ID}`}>{c.contact.serviceOverview}</a>
        </div>
      </section>
      <footer className={styles.disclaimer}>
        <p>{c.disclaimer} <time dateTime="2026-11-22">{c.checked}</time></p>
      </footer>
    </section>
  );
}
