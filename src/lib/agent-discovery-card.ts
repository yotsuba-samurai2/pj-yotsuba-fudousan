import template from "./data/agent-discovery-card.json";
import { REALESTATE_CERTIFICATION } from "./certification";
import { SR_REGISTRATION_ID } from "./shared/sr-registration";

/**
 * Custom public directory, not an A2A task server. Regenerate both compatibility
 * paths with: npx tsx scripts/generate-agent-discovery-card.ts
 * Tests reject stale generated files. No request data or credentials enter it.
 */
export function buildAgentDiscoveryCard() {
  const cert = REALESTATE_CERTIFICATION;
  return {
    ...template,
    entities: {
      ...template.entities,
      organizations: template.entities.organizations.map((org) =>
        org["@id"] === "https://luck428.com/#organization"
          ? {
              ...org,
              identifier: [{ propertyID: "認定支援機関ID", value: cert.institutionId }],
              hasCertification: {
                "@type": "Certification",
                name: cert.name,
                certificationIdentification: cert.institutionId,
                designation: cert.designation,
                validFrom: cert.certifiedOn,
                expires: cert.validUntil,
                url: cert.url,
                about: { "@id": org["@id"] },
              },
            }
          : org,
      ),
    },
    credentials: [
      ...template.credentials,
      {
        credential: "社会保険労務士",
        credentialEn: "Labor and Social Security Attorney",
        registrationNumber: SR_REGISTRATION_ID,
        holder: { "@id": template.entities.person["@id"], name: template.entities.person.name },
        practicedAt: "四葉社会保険労務士事務所",
      },
    ],
  };
}

export function serializeAgentDiscoveryCard(): string {
  return JSON.stringify(buildAgentDiscoveryCard(), null, 2) + "\n";
}
