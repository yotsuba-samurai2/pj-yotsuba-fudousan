// ペット調査（rental-survey）のテスト用の合成データ。実在の物件・顧客・会員データは使わない。
import type { FeedProvider } from "@/lib/school-rental-feed";
import type { AdminProperty, RentalSpec } from "@/lib/property-shared";
import type { SurveyBatch, SurveyRecord } from "@/lib/rental-survey/batch";
import type { StoredBatch, StoredFinalization } from "@/lib/rental-survey/finalize";
import type { LedgerEntry, PermissionUse } from "@/lib/rental-survey/permissions";
import type { PetTerms } from "@/lib/rental-survey/pet-terms";
import type { Observation } from "@/lib/rental-survey/units";

export const NOW = new Date("2026-09-24T03:00:00Z");
export const ALL_PROVIDERS: FeedProvider[] = ["reins", "itandi", "eslife"];
export const PET_SCOPE_KEY = "bunkyo-rent-pet:2";

export function pet(over: Partial<PetTerms> = {}): PetTerms {
  return { multi: "allowed", species: "cat", limits: { cats: 2, dogs: null, total: 2 }, largeDog: "not-allowed", conditions: "", petQuote: "猫2匹まで可（試験用の記載）", ...over };
}

export function record(over: Partial<SurveyRecord> = {}): SurveyRecord {
  return {
    sourceId: "src-1", building: "試験マンション", unit: "205", address: "東京都文京区千石１丁目２０－２０",
    availability: "active", application: "none", applicationQuote: "申込なし（試験用の記載）", pet: pet(), ...over,
  };
}

export function observation(provider: FeedProvider = "reins", over: Partial<SurveyRecord> = {}): Observation {
  return { ...record(over), provider };
}

export function batch(provider: FeedProvider, records: SurveyRecord[] = [record()], over: Partial<SurveyBatch> = {}): SurveyBatch {
  return {
    version: 1, scopeId: "bunkyo-rent-pet", scopeVersion: 2, provider, status: "verified",
    observedFrom: "2026-09-22T00:00:00Z", observedTo: "2026-09-23T00:00:00Z", allPagesChecked: true,
    expectedCount: records.length, records, ...over,
  };
}

export function storedBatch(id: string, b: SurveyBatch, over: Partial<StoredBatch> = {}): StoredBatch {
  return {
    id, scopeId: b.scopeId, scopeVersion: b.scopeVersion, provider: b.provider, status: b.status,
    observedFrom: new Date(b.observedFrom), observedTo: new Date(b.observedTo), payload: b, ...over,
  };
}

/** 全媒体・全用途の verified バッチ（媒体ごとに sourceId を変える）。 */
export function storedBatches(records: SurveyRecord[] = [record()]) {
  return ALL_PROVIDERS.map(p => storedBatch(`batch-${p}`, batch(p, records.map(r => ({ ...r, sourceId: `${p}-${r.sourceId}` })))));
}

export function ledgerEntry(provider: FeedProvider, use: PermissionUse, over: Partial<LedgerEntry> = {}): LedgerEntry {
  return {
    provider, use, status: "confirmed", termsVersion: "試験用", checkedOn: "2026-09-01",
    validFrom: "2026-09-01T00:00:00Z", validUntil: null, evidenceRef: "試験用（実在の書面ではない）", attribution: null, ...over,
  };
}

export function confirmedLedger(uses: PermissionUse[] = ["store", "aggregate"], providers: FeedProvider[] = ALL_PROVIDERS): LedgerEntry[] {
  return providers.flatMap(p => uses.map(u => ledgerEntry(p, u)));
}

export function finalization(over: Partial<StoredFinalization> = {}): StoredFinalization {
  return {
    id: "fin-1", scopeId: "bunkyo-rent-pet", scopeVersion: 2, sequence: 1, batchIds: ALL_PROVIDERS.map(p => `batch-${p}`).sort(),
    providers: [...ALL_PROVIDERS].sort(), dedupVersion: 1,
    observedFrom: new Date("2026-09-22T00:00:00Z"), observedTo: new Date("2026-09-23T00:00:00Z"),
    snapshot: {
      units: [], excludedObservations: { "out-of-area": 0, "unresolved-identity": 0 },
      excludedUnits: { conflict: 0, "closed-or-applied": 0, "status-unconfirmed": 0, "not-target": 0 },
      targetBreakdown: { multiplePets: 0, largeDog: 0 },
    },
    rolledBackFrom: null, createdAt: new Date("2026-09-23T06:00:00Z"), ...over,
  };
}

const rentalSpec: RentalSpec = {
  dealType: "rental", availabilityExpiresAt: "2026-10-01T00:00:00Z", buildingType: "マンション", layout: "2LDK",
  exclusiveAreaSqm: 60, structure: "鉄筋コンクリート造", floors: "地上5階建", floorLocated: "2階", builtYm: "2000-01",
  deliveryYm: "相談", accessText: "試験線「試験」駅 徒歩5分", managementFee: "10,000円", deposit: "1ヶ月", keyMoney: "1ヶ月",
  guaranteeDeposit: "なし", renewalFee: "新賃料の1ヶ月分", insurance: "加入必須", guarantor: "加入必須",
  otherFees: "なし", contractType: "普通借家契約", contractPeriod: "2年", conditions: "ペット相談",
};

/** 自社の賃貸物件（当サイトの掲載物件）。タイトル「建物名 号室」から住戸を照合する。 */
export function ownRental(over: Partial<AdminProperty> = {}): AdminProperty {
  return {
    id: "own-1", slug: "own-rental", status: "published", dealType: "rental", category: "other", tradeMode: "broker",
    title: "試験マンション 205", priceYen: 250_000, locationText: "東京都文京区千石１丁目２０－２０", access: [], spec: rentalSpec,
    images: [], description: "試験用", publishedAt: "2026-09-20", infoUpdatedAt: "2026-09-20", nextUpdateAt: "2026-10-04",
    locales: ["ja"], ...over,
  };
}
