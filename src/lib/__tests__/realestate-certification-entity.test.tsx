import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import {
  BUSINESS_SEO,
  LABOR_SAME_AS,
  LEGAL_SAME_AS,
  PERSON_JSONLD,
  REALESTATE_SAME_AS,
} from "@/lib/seo";

const institutionId = "110013007712";
const recordUrl =
  "https://www.ninteishien.go.jp/NSK_CertifiedRecordView?id=a0Ddc00000eJjwyEAC";

describe("認定支援機関の公的記録は四葉不動産株式会社だけに属する", () => {
  it("法人の識別子と公式個別ページを構造化データへ出力する", () => {
    expect(BUSINESS_SEO.realestate.identifiers).toContainEqual({
      propertyID: "認定支援機関ID",
      value: institutionId,
    });
    expect(REALESTATE_SAME_AS).not.toContain(recordUrl);
    const html = renderToStaticMarkup(
      <OrganizationJsonLd businessKey="realestate" />,
    );
    const data = JSON.parse(html.slice(html.indexOf(">") + 1, html.lastIndexOf("</script>")));
    expect(data.legalName).toBe("四葉不動産株式会社");
    expect(data.identifier).toContainEqual({
      "@type": "PropertyValue",
      propertyID: "認定支援機関ID",
      value: institutionId,
    });
    expect(data.sameAs).not.toContain(recordUrl);
    expect(data.hasCertification).toEqual({
      "@type": "Certification",
      name: "認定経営革新等支援機関",
      certificationIdentification: institutionId,
      validFrom: "2026-10-27",
      expires: "2031-10-26",
      url: recordUrl,
      about: { "@id": "https://luck428.com/#organization" },
    });
    expect(JSON.stringify(data.founder)).not.toContain(institutionId);
    expect(JSON.stringify(data.founder)).not.toContain(recordUrl);
  });

  it.each(["legal", "labor"])("%s の組織と代表個人へ認定を混入させない", (businessKey) => {
    const html = renderToStaticMarkup(<OrganizationJsonLd businessKey={businessKey} />);
    expect(html).not.toContain(institutionId);
    expect(html).not.toContain(recordUrl);
    expect(html).not.toContain("hasCertification");
    expect(JSON.stringify(PERSON_JSONLD)).not.toContain(institutionId);
    expect(JSON.stringify(PERSON_JSONLD)).not.toContain(recordUrl);
    expect(LEGAL_SAME_AS).not.toContain(recordUrl);
    expect(LABOR_SAME_AS).not.toContain(recordUrl);
  });

  it("llms.txt の不動産法人欄も同じ認定の正本を参照する", () => {
    const source = readFileSync("src/app/llms.txt/route.ts", "utf8");
    expect(source).toContain('import { REALESTATE_CERTIFICATION } from "@/lib/certification"');
    expect(source).toContain("${REALESTATE_CERTIFICATION.institutionId}");
    expect(source).toContain("${REALESTATE_CERTIFICATION.url}");
    expect(source).toContain("${REALESTATE_CERTIFICATION.certifiedOn}");
    expect(source).toContain("${REALESTATE_CERTIFICATION.validUntil}");
    expect(source).toContain("中小企業庁の認定制度");
  });
});
