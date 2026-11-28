export type RecheckPriority = "promotion" | "due" | "unknown" | "current";
export type RecheckRow = {
  slug: string; title: string; priority: RecheckPriority; nextUpdateAt: string|null;
  promotionEnds: string[]; sourceUrl: string|null; sourceLabel: string|null;
};
const object = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" && !Array.isArray(v) ? v as Record<string, unknown> : {};
const string = (v: unknown) => typeof v === "string" ? v.trim() : "";
const DAY = 86_400_000;
const day = (value: string): number => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
  const date = Date.parse(value + "T00:00:00Z");
  return Number.isFinite(date) && new Date(date).toISOString().startsWith(value + "T") ? date : NaN;
};
const pickDay = (value: unknown) => {
  const s = string(value);
  return Number.isFinite(day(s)) ? s : null;
};
function promotionDates(text: string) {
  const found = new Set<string>();
  // Only explicit dated pricing mentions. These are staff reminders, not
  // evidence that a promotion has ended, a room has closed, or a price changed.
  for (const clause of text.normalize("NFKC").split(/[。\n!?！？]/)) {
    if (/(?:終了済み|適用終了|実施終了)/.test(clause)) continue;
    if (!/(?:無料|フリーレント|キャンペーン|割引|免除)/.test(clause)) continue;
    for (const match of clause.matchAll(/(20\d{2})\s*年\s*(\d{1,2})\s*月\s*(?:(\d{1,2})\s*日|末)\s*(?:まで|締切)/g)) {
      const y = Number(match[1]), m = Number(match[2]);
      if (m < 1 || m > 12) continue;
      const d = match[3] === undefined ? new Date(Date.UTC(y, m, 0)).getUTCDate() : Number(match[3]);
      const iso = String(y) + "-" + String(m).padStart(2,"0") + "-" + String(d).padStart(2,"0");
      if (Number.isFinite(day(iso))) found.add(iso);
    }
  }
  return [...found].sort();
}

function sourceLink(evidence: unknown) {
  const source = object(object(evidence).source);
  if (source.provider === "itandi") {
    const id = string(source.roomId);
    return {sourceUrl: /^\d{1,20}$/.test(id) ? `https://itandibb.com/rent_rooms/${id}` : null, sourceLabel: "ITANDI BB"};
  }
  if (source.provider === "eslife") {
    const raw = string(object(source.listingEvidence).reference);
    let sourceUrl: string|null = null;
    try {
      const u = new URL(raw);
      if (u.origin === "https://rent.es-square.net" && !u.username && !u.password) sourceUrl = u.href;
    } catch { /* unverified link omitted */ }
    return {sourceUrl, sourceLabel: "いい生活Square"};
  }
  return {sourceUrl:null, sourceLabel:null};
}
export function buildRecheckQueue(listings: unknown[], now: Date): RecheckRow[] {
  const today = day(new Date(now.getTime() + 9 * 3_600_000).toISOString().slice(0,10));
  const promotedUntil = today + 2 * DAY;
  const order: Record<RecheckPriority, number> = {promotion:0,due:1,unknown:2,current:3};
  return listings.flatMap((entry): RecheckRow[] => {
    const row = object(entry), property = object(row.property), spec = object(property.spec);
    const slug = string(row.slug);
    if (row.status !== "published" || property.status !== "published" || spec.dealType !== "rental" || !/^[a-z0-9][a-z0-9-]{0,159}$/.test(slug)) return [];
    const nextUpdateAt = pickDay(property.nextUpdateAt);
    const promotionEnds = [...new Set([spec.guarantor,spec.conditions,spec.otherFees,property.priceNote,property.description]
      .flatMap(v=>promotionDates(string(v))))].sort().filter(value=>day(value)<=promotedUntil);
    const priority = promotionEnds.length ? "promotion" : !nextUpdateAt ? "unknown" : day(nextUpdateAt)<=today ? "due" : "current";
    return [{slug,title:string(property.title)||slug,priority,nextUpdateAt,promotionEnds,...sourceLink(row.evidence)}];
  }).sort((a,b) => order[a.priority]-order[b.priority]
    || (a.promotionEnds[0]??a.nextUpdateAt??"").localeCompare(b.promotionEnds[0]??b.nextUpdateAt??"")
    || a.slug.localeCompare(b.slug));
}

export function parseVerificationBatch(raw: string): unknown[] {
  if (new TextEncoder().encode(raw).length > 2_000_000) throw new Error("2MB以下のデータを選択してください");
  let data: unknown;
  try { data = JSON.parse(raw.replace(/^\uFEFF/,"")); } catch { throw new Error("確認データのJSON形式が不正です"); }
  if (!Array.isArray(data) || data.length < 1 || data.length > 50)
    throw new Error("1〜50件の確認データ配列を読み込んでください。監視用一覧はそのまま取込できません。");
  return data;
}
