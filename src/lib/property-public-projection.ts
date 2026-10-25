import type { PropertySpec, PropertyTranslation } from "@/lib/property-shared";

// Exhaustive per type: adding a spec field requires an explicit public-boundary decision.
// Private evidence belongs in internal, never in these public contracts.
const SPEC_FIELDS = {
  land: { dealType: true, landAreaSqm: true, privateRoadAreaSqm: true, landCategory: true, zoning: true, buildingCoverage: true, floorAreaRatio: true, legalRestrictions: true, leasehold: true },
  house: { dealType: true, landAreaSqm: true, privateRoadAreaSqm: true, buildingAreaSqm: true, isRowHouse: true, builtYm: true, deliveryYm: true, leasehold: true },
  condo: { dealType: true, floors: true, floorLocated: true, exclusiveAreaSqm: true, balconyAreaSqm: true, builtYm: true, deliveryYm: true, managementFee: true, repairReserve: true, managementForm: true, managerWorkStyle: true, leasehold: true },
  wholeBuilding: { dealType: true, landAreaSqm: true, privateRoadAreaSqm: true, buildingAreaSqm: true, builtYm: true, deliveryYm: true, unitCount: true, unitAreaMinSqm: true, unitAreaMaxSqm: true, structure: true, floors: true, leasehold: true },
  businessBuilding: { dealType: true, landAreaSqm: true, privateRoadAreaSqm: true, buildingAreaSqm: true, builtYm: true, deliveryYm: true, structure: true, floors: true, zoning: true, leasehold: true },
  rental: { dealType: true, availabilityExpiresAt: true, buildingType: true, layout: true, exclusiveAreaSqm: true, structure: true, floors: true, floorLocated: true, builtYm: true, deliveryYm: true, accessText: true, managementFee: true, deposit: true, keyMoney: true, guaranteeDeposit: true, renewalFee: true, insurance: true, guarantor: true, otherFees: true, contractType: true, contractPeriod: true, conditions: true, brokerFee: true },
} satisfies { [D in PropertySpec["dealType"]]: Record<keyof Extract<PropertySpec, { dealType: D }>, true> };

/** DB JSON is runtime data despite its TypeScript cast. Never pass objects in scalar fields. */
export function publicScalars<T extends object, K extends keyof T>(source: T, keys: readonly K[]): Pick<T, K> {
  const result: Partial<Pick<T, K>> = {};
  if (!source || typeof source !== "object" || Array.isArray(source)) throw new Error("公開物件のデータ形式が不正です");
  for (const key of keys) {
    if (!Object.prototype.hasOwnProperty.call(source, key)) continue;
    const value = source[key];
    if (value === undefined) continue;
    if (!(typeof value === "string" || typeof value === "boolean" || (typeof value === "number" && Number.isFinite(value)))) {
      // Do not include the offending data in the error/log.
      throw new Error("公開物件のデータ形式が不正です");
    }
    result[key] = value;
  }
  return result as Pick<T, K>;
}

export function publicSpec(spec: PropertySpec): PropertySpec {
  if (!spec || !Object.prototype.hasOwnProperty.call(SPEC_FIELDS, spec.dealType)) throw new Error("公開物件のデータ形式が不正です");
  return publicScalars(spec, Object.keys(SPEC_FIELDS[spec.dealType]) as (keyof PropertySpec)[]) as PropertySpec;
}

export function publicTranslation(translation: PropertyTranslation, displayKeys: readonly string[]): PropertyTranslation {
  const spec = translation.spec ? publicScalars(translation.spec, displayKeys) : undefined;
  return {
    ...publicScalars(translation, ["title", "description", "locationText", "priceNote"]),
    ...(spec && Object.keys(spec).length > 0 ? { spec } : {}),
  };
}
