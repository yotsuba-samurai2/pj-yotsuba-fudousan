import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { fixture, NOW } from "./fixtures";
import { validateRentalImport } from "../validation";

/**
 * 賃貸取込APIが公開変更通知を「実際に保存できたときだけ」呼ぶことの検証。
 * check/check-close（create/updateをスタブ化した検証専用呼び出し）では絶対に呼ばれない
 * こと（実際に保存していない変更を通知してしまわないこと）を確認する。
 */
const deps = vi.hoisted(() => ({ auth: vi.fn(), get: vi.fn(), create: vi.fn(), update: vi.fn(), revalidate: vi.fn(), list: vi.fn(), record: vi.fn(), schedule: vi.fn() }));
vi.mock("@/lib/api-auth", () => ({ verifyAdminRequest: deps.auth, AuthError: class AuthError extends Error { constructor(message: string, public status: number) { super(message); } } }));
vi.mock("@/lib/rental-import/db-store", () => ({ rentalStore: { get: deps.get, create: deps.create, update: deps.update } }));
vi.mock("@/lib/db/properties", () => ({ getProperties: deps.list }));
vi.mock("next/cache", () => ({ revalidatePath: deps.revalidate }));
vi.mock("@/lib/property-publication-notify", () => ({ recordPropertyPublicationChange: deps.record, scheduleDuePropertyNotifications: deps.schedule }));
import { POST } from "@/app/api/admin/bukken/import/route";
function req(action: string, record: unknown) { return new NextRequest("https://example.test/api/admin/bukken/import", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, mode: "published", maintenance: false, record }) }); }

beforeEach(() => { vi.clearAllMocks(); vi.useFakeTimers(); vi.setSystemTime(NOW); deps.auth.mockResolvedValue({ uid: "admin" }); deps.get.mockResolvedValue(null); deps.create.mockResolvedValue(undefined); deps.list.mockResolvedValue([]); vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://demo.supabase.co"); });
afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs(); });

describe("賃貸取込APIの公開変更通知", () => {
  it("check（検証専用）では絶対に呼ばれない", async () => {
    await POST(req("check", fixture()));
    expect(deps.record).not.toHaveBeenCalled();
    expect(deps.schedule).not.toHaveBeenCalled();
  });
  it("check-close（検証専用）では絶対に呼ばれない", async () => {
    // closureSchemaの形式チェックで弾かれる入力でもよい：check-closeがrecordを呼ばないことだけを見る
    await POST(req("check-close", { invalid: "shape" }));
    expect(deps.record).not.toHaveBeenCalled();
  });
  it("実際の新規作成（apply→created）では before=null・after=保存した物件で呼ばれる", async () => {
    const v = fixture();
    v.property.images.forEach((i: { url: string }, n: number) => { i.url = `https://demo.supabase.co/storage/v1/object/public/column-images/bukken/auto/${n}.jpg`; });
    const res = await POST(req("apply", v));
    expect((await res.json()).action).toBe("created");
    expect(deps.record).toHaveBeenCalledTimes(1);
    expect(deps.record.mock.calls[0][0]).toBeNull();
    expect(deps.record.mock.calls[0][1]).toMatchObject({ slug: expect.stringMatching(/^rent-/) });
    expect(deps.schedule).toHaveBeenCalledTimes(1);
  });
  it("held（保存されない）では呼ばれない", async () => {
    const v = fixture(); v.reins.advertising = "unknown";
    const res = await POST(req("apply", v));
    expect((await res.json()).action).toBe("held");
    expect(deps.record).not.toHaveBeenCalled();
  });
  it("掲載終了（apply経由・importRental内部のclosure分岐）で before=既存・after.status=closed", async () => {
    const initial = validateRentalImport(fixture(), NOW, "published"); if (!initial.ok) throw new Error();
    deps.get.mockResolvedValue({ ...initial.property, id: "existing", updatedAt: "version1" }); deps.update.mockResolvedValue(true);
    const v = fixture(); v.reins.availability = "closed"; v.reins.listingEvidence.quote = "同一物件・001号室の掲載終了を確認";
    v.property.images = []; v.property.priceYen = -1; // apply時のimages再検証（held化）を避ける＝lifecycle.tsのclosure分岐を先に通す
    const res = await POST(req("apply", v));
    expect((await res.json()).action).toBe("closed");
    expect(deps.record).toHaveBeenCalledTimes(1);
    expect(deps.record.mock.calls[0][0]).toMatchObject({ id: "existing" });
    expect(deps.record.mock.calls[0][1]).toMatchObject({ status: "closed" });
    expect(deps.schedule).toHaveBeenCalledTimes(1);
  });
});
