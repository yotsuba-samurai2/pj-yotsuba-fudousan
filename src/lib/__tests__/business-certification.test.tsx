import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { BusinessCertification } from "@/components/shared/BusinessCertification";
import { CERTIFICATION_COPY, formatCertificationDate, REALESTATE_CERTIFICATION } from "@/lib/certification";
import { SUPPORTED_LOCALES } from "@/lib/locale";

describe("real-estate company certification", () => {
  const record = REALESTATE_CERTIFICATION;

  it("preserves the verified legal entity, designation, dates and individual record", () => {
    expect(record).toEqual({
      legalName: "四葉不動産株式会社",
      name: "認定経営革新等支援機関",
      institutionId: "110013007712",
      designation: "第100号",
      certifiedOn: "2026-10-27",
      validUntil: "2031-10-26",
      url: "https://www.ninteishien.go.jp/NSK_CertifiedRecordView?id=a0Ddc00000eJjwyEAC",
    });
  });

  it.each(SUPPORTED_LOCALES)("renders the official hyperlink and full record in %s", (locale) => {
    const html = renderToStaticMarkup(<BusinessCertification locale={locale} />);
    expect(html).toContain(`href="${record.url}"`);
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain(CERTIFICATION_COPY[locale].linkLabel);
    expect(html).toContain(record.legalName);
    expect(html).toContain(record.name);
    expect(html).toContain(record.institutionId);
    expect(html).toContain(record.designation);
    expect(html).toContain(formatCertificationDate(record.certifiedOn, locale));
    expect(html).toContain(`<time dateTime="${record.validUntil}">${formatCertificationDate(record.validUntil, locale)}</time>`);
    expect(html).not.toMatch(/浦松|Uramatsu|行政書士|社会保険労務士/);
  });

  it.each(SUPPORTED_LOCALES)("keeps the compact company statement and official hyperlink in %s", (locale) => {
    const html = renderToStaticMarkup(<BusinessCertification locale={locale} compact />);
    expect(html).toContain(record.legalName);
    expect(html).toContain(record.name);
    expect(html).toContain(`href="${record.url}"`);
    expect(html).toContain(CERTIFICATION_COPY[locale].linkLabel);
    expect(html).not.toContain("<dl");
  });

  it("wires both existing pages to the shared localized record without changing their translation storage", () => {
    const about = readFileSync(resolve("src/app/[locale]/(realestate)/about/AboutPageContent.tsx"), "utf8");
    const home = readFileSync(resolve("src/app/[locale]/(realestate)/HomePageContent.tsx"), "utf8");
    const position = about.indexOf("<BusinessCertification locale={locale} />");
    expect(position).toBeGreaterThan(about.indexOf("{companyInfo.map"));
    expect(position).toBeLessThan(about.indexOf("{AFFILIATION_TITLE[locale]"));
    expect(home).toContain("<BusinessCertification locale={locale} compact />");
    expect(home.indexOf("<BusinessCertification")).toBeGreaterThan(home.indexOf("{c.intro}"));
    expect(home.indexOf("<BusinessCertification")).toBeLessThan(home.indexOf("<RentalEntry"));
  });
});
