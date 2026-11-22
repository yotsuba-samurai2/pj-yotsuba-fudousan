import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { rentalSchoolDistrict } from "../../rental-school-district";
import { rentalContentDigest } from "../content-review";
import { rentalPublicationError } from "../publication";
import { validateRentalImport, type RentalImport } from "../validation";
import { fixture } from "./fixtures";

const now = new Date("2026-11-22T13:00:00.000Z");
const providers = ["itandi", "eslife"] as const;
type Provider = (typeof providers)[number];

function record(provider: Provider, address: string, intake: "portal-search" | "mail" = "portal-search", checkedAt = now): RentalImport {
  const value: RentalImport = fixture();
  value.version = 2;
  delete value.reins;
  delete value.portalChecks;
  const roomId = provider === "itandi" ? "123" : "ffffffff-eeee-dddd-cccc-bbbbbbbbbbbb";
  const url = provider === "itandi"
    ? `https://itandibb.com/rent_rooms/${roomId}`
    : `https://rent.es-square.net/bukken/chintai/search/detail/${roomId}`;
  const fresh = { checkedAt: checkedAt.toISOString(), reference: url };
  value.source = {
    ...value.source, checkedAt: fresh.checkedAt, provider, roomId, url, address, applicationStatus: "not-applied",
    listingEvidence: { ...value.source.listingEvidence, ...fresh },
    rent: { ...value.source.rent, evidence: { ...value.source.rent.evidence, ...fresh } },
    advertising: { status: "allowed", evidence: { ...fresh, quote: "広告掲載可" } },
  };
  value.property.locationText = address;
  value.photoPermission = { status: "allowed", evidence: { ...fresh, quote: "同一号室の外観写真・間取りを客付会社HPに掲載可" } };
  value.contentReview = { checkedAt: fresh.checkedAt, digest: rentalContentDigest(value.property), locales: ["ja"], reference: "synthetic-review" };
  if (intake === "portal-search") {
    delete value.email;
    value.intake = { kind: "portal-search", policy: "publication-evidence-only-v2", updateEvidence: value.source.listingEvidence };
  } else {
    value.email = { messageId: "synthetic-mail-for-same-listing", receivedAt: fresh.checkedAt, adQuote: "ADなし" };
  }
  return value;
}

beforeEach(() => vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://demo.supabase.co"));
afterEach(() => vi.unstubAllEnvs());

describe.each(providers)("%s 直接検索", (provider) => {
  it.each([
    ["東京都文京区小日向4-1-1", true],
    ["東京都　豊島区南大塚３－１－１", false],
  ] as const)("根拠のそろった %s を正規公開・再確認できる", (address, bunkyo) => {
    const v = record(provider, address);
    const draft = validateRentalImport(v, now, "draft");
    const result = validateRentalImport(v, now, "published");
    expect(draft).toMatchObject({ ok: true });
    expect(result).toMatchObject({ ok: true });
    if (!result.ok) return;
    expect(result.property.locationText).toBe(address);
    expect(result.property.status).toBe("published");
    expect(rentalPublicationError(result.property, now)).toBeNull();
    expect(validateRentalImport(v, now, "published", true)).toMatchObject({ ok: true });
    expect(rentalSchoolDistrict(result.property) !== null).toBe(bunkyo);
  });

  it.each(["東京都新宿区早稲田町1-1", "東京都台東区谷中1-1", "東京都荒川区西日暮里1-1", "東京都北区田端1-1", "東京都千代田区神田1-1", "埼玉県豊島区仮町", "豊島区南大塚3-1-1"])("未指定・不完全な所在地 %s は保留する", (address) => {
    const result = validateRentalImport(record(provider, address), now, "published");
    expect(result).toEqual({ ok: false, reasons: ["直接検索の対象エリアは文京区・豊島区です"] });
  });

  it("豊島区でも最新の同一号室・許諾・費用・画像・本文照合の各要件を維持する", () => {
    const base = record(provider, "東京都豊島区南大塚3-1-1");
    const changes: [string, (entry: RentalImport) => void][] = [
      ["同一号室", (v) => { v.source.listingEvidence.exactRoomMatched = false; }],
      ["現在の掲載", (v) => { v.source.listingEvidence.checkedAt = "2026-11-20T09:00:00.000Z"; }],
      ["広告可", (v) => { v.source.advertising!.status = "denied"; }],
      ["賃料の原文", (v) => { v.source.rent.evidence.quote = "賃料999,999円"; }],
      ["賃貸条件が未確認", (v) => { if (v.property.spec.dealType === "rental") v.property.spec.insurance = "未確認"; }],
      ["写真と間取り", (v) => { v.property.images = v.property.images.filter((i) => i.kind !== "floorplan"); }],
      ["公開する各翻訳", (v) => { delete v.contentReview; }],
      ["公開所在地", (v) => { v.property.locationText = "東京都文京区小日向4-1-1"; }],
    ];
    for (const [reason, change] of changes) {
      const value = structuredClone(base);
      change(value);
      const result = validateRentalImport(value, now, "published");
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.reasons.join(" ")).toContain(reason);
    }
  });
});

it.each(["applied", "unknown"] as const)("Square豊島区でも申込状況 %s は保留する", (applicationStatus) => {
  const v = record("eslife", "東京都豊島区南大塚3-1-1");
  v.source.applicationStatus = applicationStatus;
  const result = validateRentalImport(v, now, "published");
  expect(result.ok).toBe(false);
  if (!result.ok) expect(result.reasons.join(" ")).toContain("申込");
});

it("ITANDIの実メール起点の経路と7日条件を変更しない", () => {
  const v = record("itandi", "東京都新宿区早稲田町1-1", "mail");
  expect(validateRentalImport(v, now, "published")).toMatchObject({ ok: true });
  v.email!.receivedAt = "2026-11-14T13:00:00.000Z";
  expect(validateRentalImport(v, now, "published")).toEqual({ ok: false, reasons: ["メールが受信7日以内の対象外です"] });
});

it("Squareのメール起点は従来どおり文京区に限定する", () => {
  const v = record("eslife", "東京都豊島区南大塚3-1-1", "mail");
  expect(validateRentalImport(v, now, "published")).toEqual({ ok: false, reasons: ["いい生活の対象エリアを文京区に限定してください"] });
});

it("旧時点のポリシー再現は文京区限定のまま", () => {
  const legacy = new Date("2026-09-25T09:00:00.000Z");
  const v = record("itandi", "東京都豊島区南大塚3-1-1", "portal-search", legacy);
  v.intake!.policy = "bunkyo-income800k";
  const result = validateRentalImport(v, legacy, "published");
  expect(result.ok).toBe(false);
  if (!result.ok) expect(result.reasons).toContain("直接検索の対象エリアは文京区です");
});
