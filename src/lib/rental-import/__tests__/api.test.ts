import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { fixture, NOW } from "./fixtures";
import { validateRentalImport } from "../validation";

const deps = vi.hoisted(() => ({ auth: vi.fn(), get: vi.fn(), create: vi.fn(), update: vi.fn(), revalidate: vi.fn(), list: vi.fn() }));
vi.mock("@/lib/api-auth", () => ({ verifyAdminRequest: deps.auth, AuthError: class AuthError extends Error { constructor(message: string, public status: number) { super(message); } } }));
vi.mock("@/lib/rental-import/db-store", () => ({ rentalStore: { get: deps.get, create: deps.create, update: deps.update } }));
vi.mock("@/lib/db/properties", () => ({ getProperties: deps.list }));
vi.mock("next/cache", () => ({ revalidatePath: deps.revalidate }));
import { GET, POST } from "@/app/api/admin/bukken/import/route";
import { AuthError } from "@/lib/api-auth";
function req(action: string, record: unknown) { return new NextRequest("https://example.test/api/admin/bukken/import", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, mode: "published", maintenance: false, record }) }); }

beforeEach(() => { vi.clearAllMocks(); vi.useFakeTimers(); vi.setSystemTime(NOW); deps.auth.mockResolvedValue({ uid: "admin" }); deps.get.mockResolvedValue(null); deps.create.mockResolvedValue(undefined); deps.list.mockResolvedValue([]); vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://demo.supabase.co"); });
afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs(); });
describe("賃貸取込API", () => {
  it("未認証の読み書きを拒否", async () => { deps.auth.mockRejectedValue(new AuthError("認証が必要です", 401)); expect((await POST(req("apply", fixture()))).status).toBe(401); expect((await GET(new NextRequest("https://example.test/api/admin/bukken/import"))).status).toBe(401); expect(deps.create).not.toHaveBeenCalled(); expect(deps.list).not.toHaveBeenCalled(); });
  it("登録前チェックはDBに書き込まない", async () => { expect(await (await POST(req("check", fixture()))).json()).toMatchObject({ action: "ready" }); expect(deps.create).not.toHaveBeenCalled(); });
  it("終了を含む再確認はチェックで予告し実行時に画像なしで停止", async () => {
    const v = fixture(); const initial = validateRentalImport(v, NOW, "published"); if (!initial.ok) throw new Error();
    deps.get.mockResolvedValue({ ...initial.property, id: "existing", updatedAt: "version1" }); deps.update.mockResolvedValue(true);
    v.source.availability = "closed"; v.source.listingEvidence.quote = "同一物件・001号室の掲載終了を確認";
    v.property.images = []; v.property.priceYen = -1;
    expect(await (await POST(req("check", v))).json()).toMatchObject({ action: "ready-close" }); expect(deps.update).not.toHaveBeenCalled();
    expect(await (await POST(req("apply", v))).json()).toMatchObject({ action: "closed" });
    expect(deps.update).toHaveBeenCalledWith(initial.property.slug, "version1", expect.objectContaining({ status: "closed" })); expect(deps.create).not.toHaveBeenCalled(); expect(deps.revalidate).toHaveBeenCalledWith("/sitemap.xml");
  });
  it("広告許可が不明なら保留", async () => { const v = fixture(); v.reins.advertising = "unknown"; expect(await (await POST(req("apply", v))).json()).toMatchObject({ action: "held" }); expect(deps.create).not.toHaveBeenCalled(); });
  it("画像の外部直リンクを拒否", async () => { const v = fixture(); v.property.images[0].url = "https://evil.example/image.jpg"; expect(await (await POST(req("apply", v))).json()).toMatchObject({ action: "held" }); expect(deps.create).not.toHaveBeenCalled(); });
  it("自社画像を使う登録は保存・全言語キャッシュ更新", async () => { const v = fixture(); v.property.images.forEach((i, n) => { i.url = `https://demo.supabase.co/storage/v1/object/public/column-images/bukken/auto/${n}.jpg`; }); expect(await (await POST(req("apply", v))).json()).toMatchObject({ action: "created" }); expect(deps.create).toHaveBeenCalledTimes(1); expect(deps.revalidate).toHaveBeenCalledWith("/sitemap.xml"); expect(deps.revalidate).toHaveBeenCalledTimes(9); });
  it("監視対象は自動取込した賃貸に限定", async () => { deps.list.mockResolvedValue([{ ...fixture().property, internal: { rentalImport: { source: "proof" } } }, { dealType: "land" }, { dealType: "rental" }]); const response = await GET(new NextRequest("https://example.test/api/admin/bukken/import")); expect((await response.json()).listings).toHaveLength(1); expect(response.headers.get("cache-control")).toBe("no-store"); });
  it("不正JSONを拒否", async () => { const response = await POST(new NextRequest("https://example.test/api/admin/bukken/import", { method: "POST", body: "{" })); expect(response.status).toBe(400); });
});
