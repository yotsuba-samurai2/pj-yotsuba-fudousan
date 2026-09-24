import { lookupDistrictByAddress } from "./school-district";

type ReviewedPetListing = {
  sourceId: string;
  building: string;
  unit: string;
  address: string;
  advertising: "allowed" | "contact-required" | "not-allowed" | "unknown";
  availability: "active" | "closed" | "unknown";
  application: "none" | "present" | "unknown";
  exactRoomMatched: boolean;
  checkedAt: string;
};

export type PublicPetSchoolListing = {
  school: string;
  property: string;
  href: string;
};

/**
 * 媒体横断の件数調査とは分けて、住戸ごとに広告可・募集中・同一号室を
 * 人が確認した記録だけを置く。公開面へ渡すのは学区・物件名・学区導線だけ。
 */
const REVIEWED_LISTINGS: readonly ReviewedPetListing[] = [
  {
    sourceId: "100139619172",
    building: "フレンシア文京関口",
    unit: "1105",
    address: "東京都文京区関口1丁目28-6",
    advertising: "allowed",
    availability: "active",
    // REINS は「申込あり」の表示がある場合だけ present とする運用。
    application: "unknown",
    exactRoomMatched: true,
    checkedAt: "2026-09-24T20:30:00+09:00",
  },
] as const;

export function compilePublicPetSchoolListings(
  records: readonly ReviewedPetListing[] = REVIEWED_LISTINGS,
): PublicPetSchoolListing[] {
  return records.flatMap((record) => {
    if (record.advertising !== "allowed" || record.availability !== "active" || record.application === "present" || !record.exactRoomMatched) return [];
    const district = lookupDistrictByAddress(record.address);
    if (district.status !== "determined") return [];
    return [{
      school: district.school.formalName,
      property: `${record.building} ${record.unit}号室`,
      href: `/gakku/${district.school.slug}/rentals`,
    }];
  });
}
