import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { srCredentialLabel } from "../shared/sr-registration";

beforeEach(() => vi.resetModules());
afterEach(() => vi.unstubAllEnvs());

describe("representative qualifications", () => {
  it.each([
    ["ja", "宅地建物取引士・行政書士・社会保険労務士", "宅地建物取引士・行政書士・"],
    ["en", "Gyoseishoshi / Certified Social Insurance and Labour Consultant", "Gyoseishoshi / "],
    ["zh-tw", "行政書士・社會保險勞務士", "行政書士・"],
    ["zh", "行政书士・社会保险劳务士", "行政书士・"],
  ])("shows one localized registration in %s", async (locale, current, prefix) => {
    vi.stubEnv("NEXT_PUBLIC_SR_LAUNCHED", "true");
    const { withSrProfileRegistration } = await import("../shared/about-qualification-label");
    const formatted = prefix + srCredentialLabel(locale);
    expect(withSrProfileRegistration(current, locale)).toBe(formatted);
    expect(withSrProfileRegistration(formatted, locale)).toBe(formatted);
    expect(withSrProfileRegistration(prefix.replace(/(?:・| \/ )$/, ""), locale)).toBe(formatted);
  });

  it("does not advertise the qualification before launch", async () => {
    vi.stubEnv("NEXT_PUBLIC_SR_LAUNCHED", "false");
    const { withSrProfileRegistration } = await import("../shared/about-qualification-label");
    expect(withSrProfileRegistration("宅地建物取引士・行政書士", "ja")).toBe("宅地建物取引士・行政書士");
  });
});
