import { describe, expect, it } from "vitest";
import { registeredRentalIdentity } from "../registered-rental-identity";

describe("registered rental identity", () => {
  const p = { dealType: "rental" as const, title: "試験マンション 205", locationText: "東京都文京区千石1丁目20-20" };
  it.each(["試験マンション 205", "試験マンション ２０５号室"])("recognizes manual title %s", title => {
    expect(registeredRentalIdentity({ ...p, title })).toEqual({ building: "試験マンション", unit: "205", address: p.locationText });
  });
  it.each(["試験マンション205", "試験マンション 2F", "試験マンション 2階", "試験マンション"])("does not infer a room from %s", title => {
    expect(registeredRentalIdentity({ ...p, title })).toBeNull();
  });
  it("prefers source evidence and never deduplicates a sale as a rental", () => {
    const source = { building: "元の建物名", unit: "0205", address: p.locationText };
    expect(registeredRentalIdentity({ ...p, internal: { rentalImport: { source } } })).toEqual(source);
    expect(registeredRentalIdentity({ ...p, dealType: "condo" })).toBeNull();
  });
});
