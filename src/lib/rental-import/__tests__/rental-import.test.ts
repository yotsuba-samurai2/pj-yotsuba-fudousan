import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { extractAdEvidence, isRecentMail, monthWindowStart, selectMailCandidates } from "../candidates";
import { rentalIdentity, validateRentalImport } from "../validation";
import { closeRental, importRental, type RentalStore } from "../lifecycle";
import { isOwnedImage, inspectImage } from "../media";
import { rentalPublicationError } from "../publication";
import { formatPropertyPrice, buildRequiredDisplayRows, toPublicProperty, type AdminProperty } from "../../property-shared";
import { fixture, NOW } from "./fixtures";
beforeEach(() => vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://demo.supabase.co"));
afterEach(() => vi.unstubAllEnvs());

function memoryStore() {
  const rows = new Map<string, AdminProperty>(); let version = 0;
  const store: RentalStore = {
    async get(slug) { return rows.get(slug) ? structuredClone(rows.get(slug)!) : null; },
    async create(p) { if (rows.has(p.slug)) throw new Error("duplicate"); rows.set(p.slug, { ...structuredClone(p), id: p.slug, updatedAt: String(++version) }); },
    async update(slug, expected, p) { const old = rows.get(slug); if (!old || old.updatedAt !== expected) return false; rows.set(slug, { ...old, ...structuredClone(p), updatedAt: String(++version) }); return true; },
  };
  return { store, rows };
}

describe("ADと受信期間", () => {
  it.each([["AD2ヶ月", 2], ["ＡＤ２．５か月", 2.5], ["広告料：賃料の200％", 2], ["AD 300%", 3], ["AD1ヶ月", 1], ["業務委託料 2月分", 2]])("%s", (text, months) => expect(extractAdEvidence(text)[0].months).toBe(months));
  it.each(["最大AD3ヶ月", "AD2ヶ月〜3ヶ月", "AD2ヶ月（今月限定）", "AD200", "AD2ヶ月に変更", "AD2ヶ月終了"])('曖昧な表記は確定しない: %s', (text) => expect(extractAdEvidence(text)[0].ambiguous).toBe(true));
  it("敷金やフリーレントをADと誤認しない", () => expect(extractAdEvidence("敷金2ヶ月 フリーレント3ヶ月 ADSL無料")).toEqual([]));
  it("月末を丸めて1暦月前にする", () => expect(monthWindowStart(new Date("2026-03-31T01:00:00Z")).toISOString()).toBe("2026-02-28T01:00:00.000Z"));
  it("日本時間の月跨ぎ", () => expect(monthWindowStart(new Date("2026-02-28T23:00:00Z")).toISOString()).toBe("2026-01-31T23:00:00.000Z"));
  it("境界・未来・不正日付", () => { expect(isRecentMail("2026-08-20T01:00:00Z", NOW)).toBe(true); expect(isRecentMail("2026-08-20T00:59:59Z", NOW)).toBe(false); expect(isRecentMail("2026-09-21T01:00:00Z", NOW)).toBe(false); expect(isRecentMail("bad", NOW)).toBe(false); });
  it("メールを重複除去し、複数AD額を保留", () => { const m = { id: "a", receivedAt: NOW.toISOString(), subject: "A物件AD2ヶ月 B物件AD1ヶ月", text: "" }; expect(selectMailCandidates([m, m], NOW)).toMatchObject([{ decision: "review" }]); });
});

describe("公開ゲート", () => {
  it.each(["closed", "removed", "unknown"] as const)("どちらかの元サイトが%sなら掲載しない", (status) => {
    const v = fixture(); v.reins.availability = status; expect(validateRentalImport(v, NOW).ok).toBe(false);
    v.reins.availability = "available"; v.source.availability = status; expect(validateRentalImport(v, NOW).ok).toBe(false);
  });
  it.each(["authenticated", "siteOperational", "exactRoomMatched"] as const)("両サイトの%s確認が必須", (key) => {
    const v = fixture(); v.reins.listingEvidence[key] = false; expect(validateRentalImport(v, NOW).ok).toBe(false);
    v.reins.listingEvidence[key] = true; v.source.listingEvidence[key] = false; expect(validateRentalImport(v, NOW).ok).toBe(false);
  });
  it("REINSの確認が古い場合・ポータルURLの代用を認めず、有効期限は古い側に合わせる", () => {
    const v = fixture(); v.reins.listingEvidence.checkedAt = "2020-01-01T00:00:00Z"; expect(validateRentalImport(v, NOW).ok).toBe(false);
    v.reins.listingEvidence.checkedAt = new Date(NOW.getTime() - 3600_000).toISOString();
    const result = validateRentalImport(v, NOW); expect(result.ok).toBe(true);
    if (result.ok) expect(result.property.spec).toHaveProperty("availabilityExpiresAt", new Date(NOW.getTime() + 25 * 3600_000).toISOString());
    v.reins.listingEvidence.reference = "https://www.homes.co.jp/"; expect(validateRentalImport(v, NOW).ok).toBe(false);
  });
  it("REINS照合済み・写真間取りありを登録可能", () => expect(validateRentalImport(fixture(), NOW).ok).toBe(true));
  it.each(["denied", "unknown"] as const)("REINS広告可以外を保留 %s", (status) => { const v = fixture(); v.reins.advertising = status; expect(validateRentalImport(v, NOW).ok).toBe(false); });
  it("いい生活は文京区・申込なし・25万円以上ならADなしでも登録できる", () => {
    const v = fixture();
    v.source.provider = "eslife";
    v.source.roomId = "es-001";
    v.source.url = "https://rent.es-square.net/bukken/chintai/es-001";
    v.source.address = "東京都文京区小石川1-1-1";
    v.source.building = "いい生活テストマンション";
    v.source.unit = "101";
    v.source.availability = "available";
    v.source.checkedAt = NOW.toISOString();
    v.source.listingEvidence = { ...v.source.listingEvidence, reference: v.source.url, quote: "募集中・広告可" };
    v.source.rent = { yen: 250000, evidence: { ...v.source.rent.evidence, reference: v.source.url, quote: "賃料250,000円" } };
    v.source.adQuote = "ADなし";
    v.source.applicationStatus = "not-applied";
    v.source.advertising = { status: "allowed", evidence: { ...v.source.listingEvidence, quote: "広告可" } };
    v.property.title = "いい生活テストマンション 101";
    v.property.locationText = v.source.address;
    v.property.priceYen = 250000;
    Reflect.deleteProperty(v, "reins");
    expect(validateRentalImport(v, NOW).ok).toBe(true);
  });
  it.each(["広告可否 未確認", "広告不可", "広告可 広告不可"])("文字列の誤認防止 %s", (quote) => { const v = fixture(); v.reins.evidence.quote = quote; expect(validateRentalImport(v, NOW).ok).toBe(false); });
  it("部屋が違えば広告許可を流用しない", () => { const v = fixture(); v.reins.unit = "002"; expect(validateRentalImport(v, NOW).ok).toBe(false); });
  it("公開タイトルと部屋を照合", () => { const v = fixture(); v.property.title = "別マンション 001"; expect(validateRentalImport(v, NOW).ok).toBe(false); });
  it("画像はユーザーの包括許可で転載可とする", () => { const v = fixture(); v.photoPermission.status = "unknown"; const result = validateRentalImport(v, NOW); expect(result.ok).toBe(true); if (result.ok) expect(result.property.internal?.rentalImport).toMatchObject({ policy: { images: "operator-blanket-allow" }, photoPermission: { status: "unknown" } }); });
  it("間取りなしを保留", () => { const v = fixture(); v.property.images.pop(); expect(validateRentalImport(v, NOW).ok).toBe(false); });
  it("期限切れ・古い確認・未来の確認を保留", () => { for (const checkedAt of ["2026-09-18T01:00:00Z", "2026-09-21T01:00:00Z"]) { const v = fixture(); v.source.checkedAt = checkedAt; expect(validateRentalImport(v, NOW).ok).toBe(false); } const v = fixture(); v.source.adValidUntil = "2026-09-19T01:00:00Z"; expect(validateRentalImport(v, NOW).ok).toBe(false); });
  it("ADの最新情報が基準未満なら保留", () => { const v = fixture(); v.source.adQuote = "AD1ヶ月"; expect(validateRentalImport(v, NOW).ok).toBe(false); });
  it("入力なしをゼロ扱いしない", () => { const v = fixture(); if (v.property.spec.dealType !== "rental") throw new Error(); v.property.spec.guarantor = "入力なし"; expect(validateRentalImport(v, NOW).ok).toBe(false); });
  it("altや翻訳の内部情報も拒否", () => { const v = fixture(); v.property.images[0].alt = "AD 200%"; expect(validateRentalImport(v, NOW).ok).toBe(false); v.property.images[0].alt = "外観"; v.property.translations = { en: { title: "REINS", description: "Rental" } }; expect(validateRentalImport(v, NOW).ok).toBe(false); });
  it("公開ビューにはメール・REINS・AD根拠が出ない", () => { const result = validateRentalImport(fixture(), NOW, "published"); expect(result.ok).toBe(true); if (!result.ok) return; const pub = JSON.stringify(toPublicProperty(result.property)); expect(pub).not.toMatch(/mail-1|REINS|200%|test-100|rentalImport/); expect(rentalPublicationError(result.property, NOW)).toBeNull(); });
  it("手動APIから証拠なしの賃貸公開を拒否", () => { const v = fixture().property; v.status = "published"; expect(rentalPublicationError(v, NOW)).not.toBeNull(); });
  it("月額の端数を落とさない", () => { const p = fixture().property; expect(formatPropertyPrice(p)).toBe("85,500円／月"); expect(buildRequiredDisplayRows(toPublicProperty(p)).find(r => r.key === "price")?.label).toBe("賃料"); });
});

describe("再実行と掲載終了", () => {
  it("ITANJIの終了はAD・賃料の証拠がなくても反映", async () => {
    const { store, rows } = memoryStore(); const v = fixture(); const created = await importRental(v, store, NOW, "published");
    const identity = { provider: "itandi", roomId: v.source.roomId, building: v.source.building, address: v.source.address, unit: v.source.unit };
    const minimal = { source: { ...identity, availability: "closed", listingEvidence: v.source.listingEvidence, adQuote: "", rent: null } };
    expect((await importRental(minimal, store, NOW, "published", true)).action).toBe("closed");
    expect(rows.get(created.slug!)!.status).toBe("closed");
  });
  it("ITANDIの終了確認でも掲載を止め、認証切れでは止めない", async () => {
    const { store, rows } = memoryStore(); const v = fixture(); const created = await importRental(v, store, NOW, "published");
    v.source.availability = "closed"; v.source.listingEvidence.quote = "募集終了"; v.source.listingEvidence.authenticated = false;
    expect((await importRental(v, store, NOW, "published", true)).action).toBe("held"); expect(rows.get(created.slug!)!.status).toBe("published");
    v.source.listingEvidence.authenticated = true; expect((await importRental(v, store, NOW, "published", true)).action).toBe("closed");
  });
  it("ポータルだけの掲載終了では両サイト掲載中の物件を止めない", async () => {
    const { store, rows } = memoryStore(); const v = fixture(); const created = await importRental(v, store, NOW, "published");
    v.portalChecks![2].listings.push({ listingId: "ended", url: "https://www.homes.co.jp/chintai/b-ended/", company: "匿名", match: "confirmed", status: "ended", evidence: "同じ001号室の広告掲載終了" });
    expect((await importRental(v, store, NOW, "published", true)).action).toBe("updated"); expect(rows.get(created.slug!)!.status).toBe("published");
  });
  it("別のREINS物件番号の終了は登録済み物件へ適用しない", async () => {
    const { store, rows } = memoryStore(); const v = fixture(); const created = await importRental(v, store, NOW, "published");
    v.reins.propertyId = "another-id"; v.reins.availability = "closed";
    expect((await importRental(v, store, NOW, "published", true)).action).toBe("held"); expect(rows.get(created.slug!)!.status).toBe("published");
  });
  it("終了を含む再確認は、手動編集・無効な賃料より優先して公開を停止", async () => {
    const { store, rows } = memoryStore(); const v = fixture(); const created = await importRental(v, store, NOW, "published");
    rows.get(created.slug!)!.description = "管理者による編集";
    v.property.priceYen = -1;
    v.source.availability = "closed"; v.source.listingEvidence.quote = "同一物件・001号室の掲載終了を確認";
    expect((await importRental(v, store, NOW, "published", true)).action).toBe("closed");
    expect(rows.get(created.slug!)!.status).toBe("closed");
  });
  it("新規候補として既登録の同一号室を再実行すると重複登録を止める", async () => { const {store,rows} = memoryStore(); expect((await importRental(fixture(), store, NOW, "published")).action).toBe("created"); const result = await importRental(fixture(), store, NOW, "published"); expect(result).toMatchObject({ action: "held", reasons: [expect.stringContaining("同一号室が既に登録されています")] }); expect(rows.size).toBe(1); });
  it("既登録の同一号室は再確認モードだけ更新できる", async () => { const {store,rows} = memoryStore(); expect((await importRental(fixture(), store, NOW, "published")).action).toBe("created"); expect((await importRental(fixture(), store, NOW, "published", true)).action).toBe("updated"); expect(rows.size).toBe(1); });
  it("同時更新時は上書きしない", async () => { const {store} = memoryStore(); await importRental(fixture(), store, NOW, "published"); store.update = async () => false; expect((await importRental(fixture(), store, NOW, "published")).action).toBe("held"); });
  it("手動編集を保護", async () => { const {store,rows} = memoryStore(); const result = await importRental(fixture(), store, NOW, "published"); rows.get(result.slug!)!.description = "管理者が修正"; expect((await importRental(fixture(), store, NOW, "published")).action).toBe("held"); });
  it("最新の再確認で手動編集済み下書きを公開できる", async () => {
    const { store, rows } = memoryStore();
    const created = await importRental(fixture(), store, NOW, "published");
    rows.get(created.slug!)!.status = "draft";
    const result = await importRental(fixture(), store, NOW, "published", true);
    expect(result).toMatchObject({ action: "updated", slug: created.slug });
    expect(rows.get(created.slug!)!.status).toBe("published");
  });
  it("掲載終了・削除は非公開化し再取込で復活させない", async () => { const {store,rows} = memoryStore(); await importRental(fixture(), store, NOW, "published"); const v = fixture(); const event = { source: v.source, status: "removed", confirmedBy: { provider: "itandi", listingId: "123" }, checkedAt: NOW.toISOString(), reference: v.source.url, quote: "物件番号で検索結果なし", authenticated: true, siteOperational: true, exactRoomMatched: true }; const result = await closeRental(event, store, NOW); expect(result.action).toBe("closed"); expect(rows.get(result.slug!)!.status).toBe("closed"); expect((await importRental(v, store, NOW, "published")).action).toBe("held"); });
  it("認証切れ・障害は終了としない", async () => { const {store,rows} = memoryStore(); await importRental(fixture(), store, NOW, "published"); const result = await closeRental({ source: fixture().source, status: "removed", confirmedBy: { provider: "itandi", listingId: "123" }, checkedAt: NOW.toISOString(), reference: "page", quote: "ログイン画面", authenticated: false, siteOperational: true, exactRoomMatched: true }, store, NOW); expect(result.action).toBe("held"); expect([...rows.values()][0].status).toBe("published"); });
  it("公開ポータルの終了だけでは手動編集済み物件も公開停止しない", async () => {
    const { store, rows } = memoryStore(); const created = await importRental(fixture(), store, NOW, "published");
    rows.get(created.slug!)!.description = "管理者が編集";
    const result = await closeRental({ source: fixture().source, status: "closed", portal: "homes", checkedAt: NOW.toISOString(), reference: "https://www.homes.co.jp/chintai/b-test/", quote: "現在、この物件情報は掲載終了しています", authenticated: false, siteOperational: true, exactRoomMatched: true }, store, NOW);
    expect(result.action).toBe("held"); expect(rows.get(created.slug!)!.status).toBe("published");
  });
  it.each([
    { status: "removed", reference: "https://www.homes.co.jp/search", quote: "検索結果なし" },
    { status: "closed", reference: "https://homes.co.jp.example.test/", quote: "掲載終了" },
    { status: "closed", reference: "https://www.homes.co.jp/chintai/b-test/", quote: "アクセスできません" },
  ])("検索結果なし・別サイト・障害を公開ポータルの終了証拠としない", async (event) => {
    const { store, rows } = memoryStore(); await importRental(fixture(), store, NOW, "published");
    const result = await closeRental({ source: fixture().source, portal: "homes", checkedAt: NOW.toISOString(), authenticated: false, siteOperational: true, exactRoomMatched: true, ...event }, store, NOW);
    expect(result.action).toBe("held"); expect([...rows.values()][0].status).toBe("published");
  });
  it("受信から1か月後も既登録物件を再確認できる", async () => { const {store} = memoryStore(); await importRental(fixture(), store, NOW, "published"); const v = fixture(); v.email.receivedAt = "2026-07-01T00:00:00Z"; expect((await importRental(v, store, NOW, "published")).action).toBe("held"); expect((await importRental(v, store, NOW, "published", true)).action).toBe("updated"); });
  it("保守モードで古いメールから新規登録しない", async () => { const {store} = memoryStore(); expect((await importRental(fixture(), store, NOW, "published", true)).action).toBe("held"); });
  it("正規化した同一物件と異なる部屋を区別", () => { const s = fixture().source; expect(rentalIdentity(s)).toBe(rentalIdentity({...s,unit:"００１"})); expect(rentalIdentity(s)).not.toBe(rentalIdentity({...s,unit:"002"})); });
});

describe("画像入力", () => {
  it("PDF/HTML/SVGを画像として公開しない", () => { expect(() => inspectImage(Buffer.from("<svg>not-an-image</svg>"))).toThrow(); });
  it("自社ストレージ以外を直リンクしない", () => { const base = "https://demo.supabase.co"; expect(isOwnedImage(`${base}/storage/v1/object/public/column-images/bukken/auto/a.jpg`, base)).toBe(true); expect(isOwnedImage("https://itandibb.com/photo.jpg", base)).toBe(false); expect(isOwnedImage(`${base}/storage/v1/object/public/column-images/bukken/a.jpg?token=secret`, base)).toBe(false); });
});
