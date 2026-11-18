import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { buildAgentDiscoveryCard, serializeAgentDiscoveryCard } from "../agent-discovery-card";
import { REALESTATE_CERTIFICATION } from "../certification";
import { BUSINESS_SEO, PERSON_ID } from "../seo";
import { SR_REGISTRATION_ID } from "../shared/sr-registration";

describe("public business discovery cards", () => {
  const card = buildAgentDiscoveryCard();

  it.each(["agent-card.json", "agent.json"])("keeps %s identical to the generated source", (name) => {
    expect(readFileSync(`public/.well-known/${name}`, "utf8")).toBe(serializeAgentDiscoveryCard());
  });

  it("links three independent entities with the HTML entity IDs", () => {
    expect(card.entities.person["@id"]).toBe(PERSON_ID);
    expect(card.entities.organizations.map((org) => org["@id"])).toEqual([
      `${BUSINESS_SEO.realestate.url}/#organization`,
      `${BUSINESS_SEO.legal.url}/#organization`,
      "https://luck428.com/labor/#organization",
    ]);
    expect(card.entities.organizations[2].type).toBe("ProfessionalService");
    expect(JSON.stringify(card)).not.toMatch(/開業予定|opening scheduled|Not yet in practice/);
    expect(card.credentials.find((c) => c.credential === "社会保険労務士")?.registrationNumber).toBe(SR_REGISTRATION_ID);
  });

  it("attaches official certification only to the real-estate corporation", () => {
    const realestate = card.entities.organizations[0];
    expect(realestate).toHaveProperty("hasCertification.certificationIdentification", REALESTATE_CERTIFICATION.institutionId);
    expect(realestate).toHaveProperty("hasCertification.url", REALESTATE_CERTIFICATION.url);
    expect(realestate).toHaveProperty("hasCertification.expires", REALESTATE_CERTIFICATION.validUntil);
    for (const org of card.entities.organizations.slice(1)) expect(org).not.toHaveProperty("hasCertification");
    expect(JSON.stringify(card.entities.person)).not.toContain(REALESTATE_CERTIFICATION.institutionId);
    expect(JSON.stringify(card.credentials)).not.toContain(REALESTATE_CERTIFICATION.institutionId);
    expect(realestate.sameAs).not.toContain(REALESTATE_CERTIFICATION.url);
  });

  it("does not invent a machine task endpoint or imply guaranteed search inclusion", () => {
    expect(card.a2a.status).toBe("discovery-only");
    for (const key of ["url", "supportedInterfaces", "capabilities", "authentication", "securitySchemes"]) {
      expect(card).not.toHaveProperty(key);
    }
    expect(card.a2a.note.en).toContain("does not claim to be a conforming A2A server");
    expect(card.contact.line).toBe("https://luck428.com/line");
    expect(card.contact.contactPages).toContain("https://luck428.com/labor/contact");
  });

  it("exposes public school-housing sources without inventory counts or promises", () => {
    const housing = card.skills.find((skill) => skill.id === "re-bunkyo-school-housing");
    expect(housing).toHaveProperty("informationUrl", "https://luck428.com/gakku");
    expect(housing).toHaveProperty("contactUrl", "https://luck428.com/line");
    for (const locale of ["ja", "en", "zh-Hant", "zh-Hans"]) {
      expect(housing?.description).toHaveProperty(locale);
      expect(card.description).toHaveProperty(locale);
    }
    expect(housing?.description.ja).toContain("現在の募集状況と紹介可否を確認");
    expect(JSON.stringify(card)).not.toMatch(/476|187|非公開物件多数|常時多数/);
    expect(card.boundaries.find((b) => b.id === "independent-entities")?.ja).toContain("別々の契約");
    expect(card.referencePages).toContain("https://luck428.com/llms.txt");
  });
});
