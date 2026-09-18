import Link from "next/link";
import { notFound } from "next/navigation";
import { SR_LAUNCHED } from "@/lib/shared/office";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import { BCP47_BY_LOCALE, buildPageMetadata, canonicalUrl } from "@/lib/seo";
import { CUSTOMER_VOICES, VOICE_BUSINESSES, VOICE_COPY, localizeVoice, type VoiceBusiness } from "@/lib/customer-voices";
import { JsonLd } from "@/components/seo/JsonLd";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { CtaBand } from "@/components/shared/CtaBand";
import { CustomerVoicesList } from "./CustomerVoices";

export async function customerVoicesMetadata(businessKey: VoiceBusiness) {
  if (businessKey === "labor" && !SR_LAUNCHED) notFound();
  const locale = await getRequestLocale();
  const business = VOICE_BUSINESSES[businessKey];
  const copy = VOICE_COPY[locale];
  return buildPageMetadata({
    businessKey,
    path: business.path,
    title: `${copy.title}｜${business.name}`,
    description: `${business.name} — ${copy.count}。${copy.intro} ${copy.disclaimer[businessKey]}`,
    absoluteTitle: true,
    locale,
  });
}

export async function CustomerVoicesPage({ businessKey }: { businessKey: VoiceBusiness }) {
  // Layouts and pages may render in parallel. Guard here too so an unpublished
  // page cannot serialize testimonials into the 404 response's RSC payload.
  if (businessKey === "labor" && !SR_LAUNCHED) notFound();
  const locale = await getRequestLocale();
  const business = VOICE_BUSINESSES[businessKey];
  const copy = VOICE_COPY[locale];
  const voices = CUSTOMER_VOICES[businessKey];
  const url = canonicalUrl(businessKey, business.path, locale);
  return (
    <>
      <BreadcrumbJsonLd businessKey={businessKey} locale={locale} items={[{ name: business.name, href: business.home }, { name: copy.title, href: business.path }]} />
      {/* Own-site testimonials are a collection, not rated third-party reviews. */}
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${url}#webpage`,
        url,
        name: `${copy.title}｜${business.name}`,
        description: `${copy.intro} ${copy.disclaimer[businessKey]}`,
        inLanguage: BCP47_BY_LOCALE[locale],
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: voices.length,
          itemListElement: voices.map((voice, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: `${localizeVoice(voice, locale).service} — ${voice.name}`,
            url: `${url}#${voice.id}`,
          })),
        },
      }} />
      <div className="mx-auto max-w-5xl px-4 pb-12 sm:px-6">
        <header className="rounded-2xl bg-primary-tint p-6 sm:p-8">
          <p lang="ja" className="text-sm font-semibold text-primary-dark">{business.name}</p>
          <h1 className="mt-3 font-serif text-3xl font-bold text-ink sm:text-4xl">{copy.title}</h1>
          <p className="mt-5 text-base leading-8 text-text">{copy.intro}</p>
          <p className="mt-3 text-sm font-medium text-text">{copy.count}</p>
          <p className="mt-4 text-sm leading-7 text-text">{copy.disclaimer[businessKey]}</p>
          {locale !== "ja" && <p className="mt-3 text-sm leading-7 text-text">{copy.translatedNote}</p>}
        </header>
        <nav aria-label={copy.contents} className="mt-6 rounded-2xl border border-border p-5">
          <p className="text-sm font-semibold text-ink">{copy.contents}</p>
          <ol className="mt-3 grid gap-x-6 sm:grid-cols-2">
            {voices.map((voice, index) => <li key={voice.id} className="min-w-0"><a href={`#${voice.id}`} className="inline-flex min-h-11 items-center gap-2 py-2 text-sm leading-relaxed text-primary-dark underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-dark"><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{localizeVoice(voice, locale).service}</a></li>)}
          </ol>
        </nav>
        <CustomerVoicesList businessKey={businessKey} locale={locale} />
        <p className="mt-8 text-sm leading-7 text-text-muted">{copy.disclaimer[businessKey]}</p>
        <Link href={addLocalePrefix(business.home, locale)} className="mt-6 inline-flex min-h-11 items-center text-sm text-primary-dark underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-dark">{copy.back}</Link>
        <CtaBand businessKey={businessKey} />
      </div>
    </>
  );
}
