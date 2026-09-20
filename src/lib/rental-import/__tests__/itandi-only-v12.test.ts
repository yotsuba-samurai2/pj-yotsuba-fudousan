/* eslint-disable @typescript-eslint/no-explicit-any -- fixture migration deliberately removes legacy fields. */
import { describe, expect, it } from "vitest";
import { fixture, NOW } from "./fixtures";
import { validateRentalImport } from "../validation";
import { canSendInquiry, classifyReply, createInquiry } from "../inquiries";

describe("v1.2 ITANJI単独ゲート", () => {
  it("REINS・3ポータルなしでもITANJI根拠だけで判定する", () => {
    const value: any = fixture();
    delete value.reins;
    delete value.portalChecks;
    value.source.advertising = { status: "allowed", evidence: { ...value.source.listingEvidence, quote: "広告可" } };
    const result = validateRentalImport(value, NOW);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.property.priceYen).toBe(value.source.rent.yen);
  });

  it("旧REINS賃料を採用額へ混ぜない", () => {
    const value: any = fixture();
    value.source.advertising = { status: "allowed", evidence: { ...value.source.listingEvidence, quote: "広告可" } };
    value.reins.rent.yen = 999999;
    delete value.portalChecks;
    delete value.reins;
    const result = validateRentalImport(value, NOW);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.property.priceYen).toBe(85500);
  });
});

describe("担当者照会の冪等性と号室照合", () => {
  const inquiry = createInquiry({ building: "検証用マンション", address: "東京都検証町1-2-3", unit: "001", itandiRoomId: "123", recipient: "agent@example.com", questions: ["fees", "availability"], createdAt: NOW.toISOString() }, [{ email: "agent@example.com" }]);
  it("送信済み照会を再送しない", () => expect(canSendInquiry(inquiry, [inquiry.id]).ok).toBe(false));
  it("別号室の返信と自動返信を採用しない", () => {
    expect(classifyReply({ from: "agent@example.com", subject: "001", text: "自動返信です" }, inquiry, [{ email: "agent@example.com" }]).accepted).toBe(false);
    expect(classifyReply({ from: "agent@example.com", subject: "002", text: "保証会社費用 50%" }, inquiry, [{ email: "agent@example.com" }]).reason).toBe("wrong-room");
  });
  it("同一号室の明確な回答だけ採用する", () => expect(classifyReply({ from: "agent@example.com", subject: "001", text: "保証会社費用 初回50%" }, inquiry, [{ email: "agent@example.com" }]).accepted).toBe(true));
});
