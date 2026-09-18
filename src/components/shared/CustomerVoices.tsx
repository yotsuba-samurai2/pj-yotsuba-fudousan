import Link from "next/link";
import { SR_LAUNCHED } from "@/lib/shared/office";
import { addLocalePrefix } from "@/lib/locale";
import type { LangCode } from "@/config/languages";
import {
  CUSTOMER_VOICES, VOICE_BUSINESSES, VOICE_COPY, VOICE_SERVICE_PATHS,
  localizeVoice, type CustomerVoice, type VoiceBusiness,
} from "@/lib/customer-voices";

const focus = "rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-dark";

export function CustomerVoiceCard({ voice, locale, headingLevel = 3, servicePath }: {
  voice: CustomerVoice;
  locale: LangCode;
  headingLevel?: 2 | 3;
  servicePath?: string;
}) {
  const copy = VOICE_COPY[locale];
  const text = localizeVoice(voice, locale);
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article id={voice.id} aria-labelledby={`${voice.id}-title`} className="min-w-0 scroll-mt-28 rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <Heading id={`${voice.id}-title`} className="font-serif text-lg font-semibold leading-relaxed text-ink">{text.service}</Heading>
      <figure className="mt-4">
        <figcaption lang="ja" className="mb-4 border-l-2 border-primary pl-3 text-sm font-medium leading-relaxed text-text">{voice.name}</figcaption>
        {locale !== "ja" && <p className="mb-2 text-xs font-medium text-text-muted">{copy.translation}</p>}
        <blockquote className="text-sm leading-7 text-text [overflow-wrap:anywhere]">
          <p>{text.body}</p>
        </blockquote>
      </figure>
      {locale !== "ja" && (
        <details className="mt-5 border-t border-border pt-3">
          <summary className={`cursor-pointer py-2 text-sm font-medium text-primary-dark ${focus}`}>{copy.original}</summary>
          <div lang="ja" className="mt-3 text-sm leading-7 text-text [overflow-wrap:anywhere]">
            <p className="font-medium">{voice.service}</p>
            <blockquote className="mt-2"><p>{voice.body}</p></blockquote>
          </div>
        </details>
      )}
      {servicePath && <Link href={addLocalePrefix(servicePath, locale)} className={`mt-5 inline-flex min-h-11 items-center text-sm text-primary-dark underline underline-offset-4 ${focus}`}>{copy.related}</Link>}
    </article>
  );
}

export function CustomerVoicesPreview({ businessKey, locale }: { businessKey: VoiceBusiness; locale: LangCode }) {
  if (businessKey === "labor" && !SR_LAUNCHED) return null;
  const business = VOICE_BUSINESSES[businessKey];
  const copy = VOICE_COPY[locale];
  return (
    <section aria-labelledby={`${businessKey}-voices-heading`} className="mt-12 border-t border-border pt-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id={`${businessKey}-voices-heading`} className="font-serif text-2xl font-semibold text-ink">{copy.title}</h2>
        <Link href={addLocalePrefix(business.path, locale)} className={`inline-flex min-h-11 items-center text-sm font-medium text-primary-dark underline underline-offset-4 ${focus}`}>{copy.all}</Link>
      </div>
      <p className="mt-3 text-sm leading-7 text-text">{copy.intro}</p>
      <p className="mt-3 text-sm leading-7 text-text-muted">{copy.disclaimer[businessKey]}</p>
      {locale !== "ja" && <p className="mt-2 text-sm leading-7 text-text-muted">{copy.translatedNote}</p>}
      <div className="mt-6 grid items-start gap-4 lg:grid-cols-3">
        {business.featured.map(index => <CustomerVoiceCard key={index} voice={CUSTOMER_VOICES[businessKey][index]} locale={locale} />)}
      </div>
      <div className="mt-5 text-right">
        <Link href={addLocalePrefix(business.path, locale)} className={`inline-flex min-h-11 items-center text-sm font-medium text-primary-dark underline underline-offset-4 ${focus}`}>{copy.all}<span aria-hidden="true" className="ml-2">→</span></Link>
      </div>
    </section>
  );
}

export function CustomerVoicesList({ businessKey, locale }: { businessKey: VoiceBusiness; locale: LangCode }) {
  return <div className="mt-8 grid items-start gap-5 md:grid-cols-2">{CUSTOMER_VOICES[businessKey].map((voice, index) => <CustomerVoiceCard key={voice.id} voice={voice} locale={locale} headingLevel={2} servicePath={VOICE_SERVICE_PATHS[businessKey][index]} />)}</div>;
}
