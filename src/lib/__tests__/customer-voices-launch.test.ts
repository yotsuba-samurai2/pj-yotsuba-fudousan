import { describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ launched: false, readLocale: vi.fn(async () => "ja" as const) }));
vi.mock("@/lib/shared/office", async (importOriginal) => ({
  ...await importOriginal<typeof import("@/lib/shared/office")>(),
  get SR_LAUNCHED() { return state.launched; },
}));
vi.mock("@/lib/getRequestLocale", () => ({ getRequestLocale: state.readLocale }));
vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("NEXT_NOT_FOUND"); } }));

import { CustomerVoicesPage, customerVoicesMetadata } from "@/components/shared/CustomerVoicesPage";
import { CustomerVoicesPreview } from "@/components/shared/CustomerVoices";

describe("unpublished labor testimonials", () => {
  it("stops page rendering before reading locale or serializing customer text", async () => {
    await expect(CustomerVoicesPage({ businessKey: "labor" })).rejects.toThrow("NEXT_NOT_FOUND");
    expect(state.readLocale).not.toHaveBeenCalled();
  });

  it("does not generate public metadata when the launch flag is off", async () => {
    await expect(customerVoicesMetadata("labor")).rejects.toThrow("NEXT_NOT_FOUND");
    expect(state.readLocale).not.toHaveBeenCalled();
  });

  it("omits the home-page preview even when the child renders before its layout", () => {
    expect(CustomerVoicesPreview({ businessKey: "labor", locale: "ja" })).toBeNull();
  });
});
