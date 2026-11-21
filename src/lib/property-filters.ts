import type { PublicProperty } from "./property-shared";
import { brokerFeeOf, isDiscountedBrokerFee } from "./broker-fee";
import { rentalSchoolDistrict } from "./rental-school-district";
export type PropertyFilters = { fee?: string; school?: string; layout?: string; station?: string; pets?: string };

// These two recorded legacy labels include a suffix that the quoted access text puts outside
// the station name. Do not remove "駅" from arbitrary names (e.g. the tram stop "富山駅").
const STATION_FILTER_ALIASES = new Map([
  ["後楽園駅", "後楽園"],
  ["春日駅", "春日"],
]);

/** A search/selector key only: never use this to rewrite the advertised access or distance. */
export function stationFilterKey(label: string): string {
  const name = label.trim();
  return STATION_FILTER_ALIASES.get(name) ?? name;
}

export function filterProperties(properties: PublicProperty[], f: PropertyFilters) {
  const station = stationFilterKey(f.station ?? "");
  return properties.filter(p => {
    if (f.fee === "p033" && brokerFeeOf(p) !== "p033") return false;
    if (f.fee === "discount" && !isDiscountedBrokerFee(p)) return false;
    if (f.school) { const d = rentalSchoolDistrict(p); if (d?.status !== "determined" || d.school.slug !== f.school) return false; }
    if (f.layout && (p.spec.dealType !== "rental" || p.spec.layout !== f.layout)) return false;
    if (station && !rentalStations(p).includes(station)) return false;
    if (f.pets) {
      if (p.spec.dealType !== "rental") return false;
      const terms = p.spec.conditions.normalize("NFKC");
      if (!/ペット(?:飼育)?(?:可|相談)|ペット飼育相談/.test(terms)) return false;
      if (f.pets === "multiple" && !/多頭(?:飼育)?(?:可|相談)|(?:2|3|二|三)匹(?:まで|可)/.test(terms)) return false;
    }
    return true;
  });
}
export function rentalStations(p: PublicProperty): string[] {
  const structured = p.access.map(a => a.station);
  const quoted = p.spec.dealType === "rental"
    ? Array.from(p.spec.accessText.matchAll(/[「『]([^」』]+)[」』]駅/g), m => m[1])
    : [];
  return [...new Set([...structured, ...quoted].map(stationFilterKey).filter(Boolean))];
}
