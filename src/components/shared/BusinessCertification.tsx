import type { LangCode } from "@/config/languages";
import { CERTIFICATION_COPY, formatCertificationDate, REALESTATE_CERTIFICATION } from "@/lib/certification";

export function BusinessCertification({ locale, compact = false }: {
  locale: LangCode;
  compact?: boolean;
}) {
  const copy = CERTIFICATION_COPY[locale];
  const record = REALESTATE_CERTIFICATION;

  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-5 sm:px-6">
      {!compact && <h3 className="text-sm font-bold">{copy.title}</h3>}
      <p className={`${compact ? "" : "mt-3 "}text-sm leading-relaxed text-text-muted`}>
        {copy.summary}
      </p>
      {!compact && (
        <dl className="mt-4 space-y-2 text-sm">
          {[
            [copy.designationLabel, record.designation],
            [copy.institutionIdLabel, record.institutionId],
            [copy.validUntilLabel, <time key="valid-until" dateTime={record.validUntil}>{formatCertificationDate(record.validUntil, locale)}</time>],
          ].map(([label, value]) => (
            <div key={String(label)} className="flex flex-col gap-1 sm:flex-row sm:gap-4">
              <dt className="font-medium sm:w-48 sm:shrink-0">{label}</dt>
              <dd className="text-text-muted">{value}</dd>
            </div>
          ))}
        </dl>
      )}
      <a
        href={record.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-sm text-primary-dark underline underline-offset-4 transition-colors hover:text-primary"
      >
        {copy.linkLabel}
      </a>
    </div>
  );
}
