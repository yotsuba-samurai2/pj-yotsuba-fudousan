import { z } from "zod";
import { contentHash } from "./rules";

const id = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/), hash = z.string().regex(/^[a-f0-9]{64}$/);
const instant = z.iso.datetime({ precision: 3 }), date = z.iso.date();
const integer = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER), number = integer.min(1);
const year = z.number().int().min(1900).max(2200), schoolType = z.enum(["elementary", "junior_high"]);
const version = z.object({ updatedAt: instant, fullHash: hash }).strict();
const binding = z.object({ propertyId: z.uuid(), episodeId: id, sourceVersion: version }).strict();
const reference = z.object({ id, version: number, hash }).strict();
const requestSchema = z.object({ binding, municipalityRef: id, schoolType, academicYear: year.nullable(), applicableOn: date.nullable() }).strict();
export const normalizedSchoolAddressSchema = z.object({ binding, municipalityRef: id, townRef: id, chome: number.nullable(), ban: number.nullable(), go: number.nullable(),
  addressType: z.enum(["residential_display", "land_lot", "unknown"]), normalizedAt: instant,
  normalization: z.object({ version: z.literal(1), sourceAddressHash: hash, confirmation: z.enum(["confirmed", "unconfirmed"]), confirmationRef: id.nullable() }).strict(),
}).strict().refine(a => a.go === null || a.ban !== null);
const values = z.array(number).min(1).max(256).refine(v => new Set(v).size === v.length);
export const schoolNumberSelectorSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("all") }).strict(),
  z.object({ kind: z.literal("set"), values }).strict(),
  z.object({ kind: z.literal("except"), values }).strict(),
  z.object({ kind: z.literal("range"), from: number, to: number }).strict().refine(r => r.from <= r.to),
  z.object({ kind: z.literal("unresolved") }).strict(),
]);
export const schoolDatasetSchema = z.object({ id, version: number,
  coverage: z.object({ municipalityRef: id, townRef: id, chome: number, schoolType, academicYear: year.nullable(),
    completeness: z.enum(["confirmed", "unknown"]), confirmationRef: id.nullable() }).strict(),
  effectiveFrom: date.nullable(), effectiveUntil: date.nullable(),
  source: z.object({ publisherRef: id, sourceRef: id, contentHash: hash, publicationDate: date, publicationTimeZone: z.string().min(1).max(100), observedAt: instant,
    authority: z.enum(["municipal_official", "unknown"]), acquisition: z.enum(["manual_confirmed", "official_export", "official_api", "mock", "unknown"]) }).strict(),
  confirmation: z.enum(["confirmed", "unconfirmed"]), confirmationRef: id.nullable(), confirmedAt: instant.nullable(),
  rows: z.array(z.object({ id, schoolRef: id, ban: schoolNumberSelectorSchema, go: schoolNumberSelectorSchema,
    boundary: z.enum(["complete", "partial_unresolved", "exception_unresolved", "legacy_address_unresolved"]) }).strict()).min(1).max(2000),
}).strict().refine(d => d.effectiveFrom === null || d.effectiveUntil === null || d.effectiveFrom < d.effectiveUntil);
export type SchoolEvidenceRequest = z.infer<typeof requestSchema>;
export type NormalizedSchoolAddress = z.infer<typeof normalizedSchoolAddressSchema>;
export type SchoolDataset = z.infer<typeof schoolDatasetSchema>;
export const schoolDatasetReference = (d: { id: string; version: number }) => ({ id: d.id, version: d.version, hash: contentHash(d) });
const held = (reason: string) => ({ status: "held" as const, executable: false as const, publicClaimAllowed: false as const, assignmentGuaranteed: false as const, reason });
const same = (a: unknown, b: unknown) => contentHash(a) === contentHash(b);

function includes(selector: z.infer<typeof schoolNumberSelectorSchema>, value: number | null): boolean | "unresolved" | "missing" {
  if (selector.kind === "unresolved") return "unresolved";
  if (selector.kind === "all") return true;
  if (value === null) return "missing";
  if (selector.kind === "set") return selector.values.includes(value);
  if (selector.kind === "except") return !selector.values.includes(value);
  return selector.from <= value && value <= selector.to;
}

/** Strict private evidence match; never parses an address, guesses a year or grants a public school claim. */
export function matchSchoolEvidence(rawRequest: unknown, rawAddress: unknown, rawDataset: unknown, expectedDataset: unknown, now: string) {
  try {
    if (!rawDataset || typeof rawDataset !== "object" || !("rows" in rawDataset) || !Array.isArray(rawDataset.rows) || rawDataset.rows.length > 2000) return held("INVALID_SCHOOL_DATASET");
    const request = requestSchema.safeParse(rawRequest), address = normalizedSchoolAddressSchema.safeParse(rawAddress), dataset = schoolDatasetSchema.safeParse(rawDataset), expected = reference.safeParse(expectedDataset);
    if (!request.success || !address.success || !dataset.success || !expected.success || !instant.safeParse(now).success) return held("INVALID_SCHOOL_INPUT");
    const q = request.data, a = address.data, d = dataset.data, c = d.coverage;
    if (!same(expected.data, schoolDatasetReference(d))) return held("SCHOOL_DATASET_REFERENCE_MISMATCH");
    if (!same(q.binding, a.binding) || q.municipalityRef !== a.municipalityRef) return held("SCHOOL_ADDRESS_BINDING_MISMATCH");
    if (a.binding.sourceVersion.updatedAt > now || a.normalizedAt < a.binding.sourceVersion.updatedAt || a.normalizedAt > now) return held("INVALID_ADDRESS_TIME");
    if (a.normalization.confirmation !== "confirmed" || !a.normalization.confirmationRef) return held("ADDRESS_NORMALIZATION_UNCONFIRMED");
    if (a.addressType !== "residential_display") return held("UNSUPPORTED_ADDRESS_TYPE");
    if (a.chome === null) return held("ADDRESS_CHOME_MISSING");
    if (q.academicYear === null || q.applicableOn === null || c.academicYear === null || d.effectiveFrom === null || d.effectiveUntil === null) return held("SCHOOL_APPLICABILITY_UNRESOLVED");
    if (q.academicYear !== c.academicYear || q.schoolType !== c.schoolType) return held("SCHOOL_YEAR_OR_TYPE_MISMATCH");
    if (q.applicableOn < d.effectiveFrom || q.applicableOn >= d.effectiveUntil) return held("SCHOOL_DATE_OUTSIDE_APPLICABILITY");
    if (a.municipalityRef !== c.municipalityRef || a.townRef !== c.townRef || a.chome !== c.chome) return held("SCHOOL_COVERAGE_MISMATCH");
    if (c.completeness !== "confirmed" || !c.confirmationRef) return held("SCHOOL_TABLE_COMPLETENESS_UNCONFIRMED");
    let observedLocalDate: string;
    try {
      const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: d.source.publicationTimeZone, calendar: "iso8601", numberingSystem: "latn",
        year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(d.source.observedAt)).map(p => [p.type, p.value]));
      observedLocalDate = `${parts.year.padStart(4, "0")}-${parts.month}-${parts.day}`;
    } catch { return held("INVALID_SCHOOL_SOURCE_TIMEZONE"); }
    if (d.confirmation !== "confirmed" || !d.confirmationRef || !d.confirmedAt || d.confirmedAt > now || d.confirmedAt < d.source.observedAt
      || d.source.publicationDate > observedLocalDate || d.source.authority !== "municipal_official"
      || d.source.acquisition === "mock" || d.source.acquisition === "unknown") return held("SCHOOL_SOURCE_UNCONFIRMED");
    if (new Set(d.rows.map(r => r.id)).size !== d.rows.length) return held("DUPLICATE_SCHOOL_ROW");
    const matched: SchoolDataset["rows"] = [];
    const unresolved: { id: string; reason: string }[] = [];
    for (const row of d.rows) {
      const ban = includes(row.ban, a.ban), go = includes(row.go, a.go);
      if (ban === false || go === false) continue;
      // Do not discard possible exceptions or partial boundaries before resolving a unique school.
      if (row.boundary !== "complete" || ban === "unresolved" || go === "unresolved") unresolved.push({ id: row.id, reason: "SCHOOL_BOUNDARY_UNRESOLVED" });
      else if (ban === "missing" || go === "missing") unresolved.push({ id: row.id, reason: "ADDRESS_NUMBER_MISSING" });
      else matched.push(row);
    }
    if (unresolved.length) return held(unresolved.some(r => r.reason === "SCHOOL_BOUNDARY_UNRESOLVED") ? "SCHOOL_BOUNDARY_UNRESOLVED" : "ADDRESS_NUMBER_MISSING");
    if (!matched.length) return held("NO_SCHOOL_BOUNDARY_MATCH");
    const schools = new Set(matched.map(r => r.schoolRef));
    if (schools.size !== 1) return held("MULTIPLE_SCHOOL_BOUNDARIES");
    const body = { binding: q.binding, municipalityRef: q.municipalityRef, schoolType: q.schoolType, academicYear: q.academicYear,
      applicableOn: q.applicableOn, schoolRef: matched[0].schoolRef, rowIds: matched.map(r => r.id).sort(), dataset: expected.data,
      normalizedAddressHash: contentHash(a), checkedAt: now };
    return { status: "matched" as const, executable: false as const, publicClaimAllowed: false as const, assignmentGuaranteed: false as const,
      reason: "LOCAL_SCHOOL_EVIDENCE_MATCHED", reference: { ...body, hash: contentHash(body) } };
  } catch { return held("INVALID_SCHOOL_INPUT"); }
}
