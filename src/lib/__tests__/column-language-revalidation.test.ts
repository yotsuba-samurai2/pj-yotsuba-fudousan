import { beforeEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const mocks = vi.hoisted(() => ({
  revalidatePath: vi.fn(), revalidateTag: vi.fn(), verifyAdminRequest: vi.fn(),
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath, revalidateTag: mocks.revalidateTag }));
vi.mock("@/lib/api-auth", () => ({ verifyAdminRequest: mocks.verifyAdminRequest, AuthError: class extends Error {} }));
vi.mock("@/lib/indexnow", () => ({ submitToIndexNow: vi.fn().mockResolvedValue({}) }));
import { POST } from "@/app/api/admin/revalidate/route";
import { COLUMN_LOCALE_CACHE_TAG } from "@/lib/column-language-links";

beforeEach(() => vi.clearAllMocks());
const request = (paths: string[]) => new NextRequest("https://luck428.com/api/admin/revalidate", {
  method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ paths }),
});

it.each(["/column/new", "/legal/column/changing", "/labor/column/changing"])(
  "expires published language data and regenerates each locale on %s", async path => {
    expect((await POST(request([path]))).status).toBe(200);
    expect(mocks.revalidateTag).toHaveBeenCalledWith(COLUMN_LOCALE_CACHE_TAG, { expire: 0 });
    for (const locale of ["ja", "en", "zh-tw", "zh"]) {
      expect(mocks.revalidatePath).toHaveBeenCalledWith(`/${locale}${path}`);
    }
  },
);
it("does not invalidate the article index for an unrelated page update", async () => {
  await POST(request(["/contact"]));
  expect(mocks.revalidateTag).not.toHaveBeenCalled();
});
