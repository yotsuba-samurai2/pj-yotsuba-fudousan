import { describe, expect, it } from "vitest";
import { compilePublicPetSchoolListings } from "@/lib/pet-school-listings";

const base = {
  sourceId: "private-source-id",
  building: "確認済みマンション",
  unit: "101",
  address: "東京都文京区関口1丁目28-6",
  advertising: "allowed" as const,
  availability: "active" as const,
  application: "unknown" as const,
  exactRoomMatched: true,
  checkedAt: "2026-09-24T20:30:00+09:00",
};

describe("広告可を個別確認したペット物件の最小公開一覧", () => {
  it("公開面には学区・物件名・学区ページへの導線だけを渡す", () => {
    expect(compilePublicPetSchoolListings([base])).toEqual([{
      school: "文京区立関口台町小学校",
      property: "確認済みマンション 101号室",
      href: "/gakku/sekiguchidaimachi/rentals",
    }]);
    expect(JSON.stringify(compilePublicPetSchoolListings([base]))).not.toMatch(/private-source-id|東京都文京区|2026-09-24|allowed/);
  });

  it.each([
    { advertising: "contact-required" as const },
    { advertising: "not-allowed" as const },
    { advertising: "unknown" as const },
    { availability: "closed" as const },
    { availability: "unknown" as const },
    { application: "present" as const },
    { exactRoomMatched: false },
    { address: "東京都文京区関口1丁目" },
  ])("未確認・要連絡・広告不可・募集終了・申込あり・学区未確定を除外する %#", (override) => {
    expect(compilePublicPetSchoolListings([{ ...base, ...override }])).toEqual([]);
  });
});
