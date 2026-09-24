import { NextRequest, NextResponse } from "next/server";
import { AuthError, verifyAdminRequest } from "@/lib/api-auth";
import { feedSchema, compileRentalSummaries, normalizeFeedUnits } from "@/lib/school-rental-feed";
import { readSchoolRentalFeeds, registeredRentalIdentities, saveSchoolRentalFeed, previewFeedReplacement } from "@/lib/school-rental-feed-store";

function errorResponse(error: unknown) {
  if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
  if (error && typeof error === "object" && "code" in error && error.code === "P2002") return NextResponse.json({ error: "別の更新が先に保存されました。再チェックしてください" }, { status: 409 });
  console.error("School rental feed failed", error);
  return NextResponse.json({ error: "募集一覧の保存先または入力内容を確認してください" }, { status: 500 });
}
export async function GET(req: NextRequest) {
  try {
    await verifyAdminRequest(req);
    const [feeds, existing] = await Promise.all([readSchoolRentalFeeds(), registeredRentalIdentities()]);
    return NextResponse.json({ feeds: feeds.map(f => ({ provider: f.provider, updatedAt: f.updatedAt.toISOString(), checkedAt: f.checkedAt.toISOString(), count: f.feed.records.length })),
      ...compileRentalSummaries(feeds.map(f => f.feed), existing) }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) { return errorResponse(error); }
}
export async function POST(req: NextRequest) {
  try {
    await verifyAdminRequest(req);
    if (Number(req.headers.get("content-length") ?? 0) > 3000000) return NextResponse.json({ error: "ファイルが大きすぎます" }, { status: 413 });
    const raw = await req.text();
    if (raw.length > 3000000) return NextResponse.json({ error: "ファイルが大きすぎます" }, { status: 413 });
    let body;
    try { body = JSON.parse(raw); } catch { return NextResponse.json({ error: "JSONを確認してください" }, { status: 400 }); }
    if (!body || typeof body !== "object") return NextResponse.json({ error: "JSONを確認してください" }, { status: 400 });
    const parsed = feedSchema.safeParse(body.feed);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join(" / ") }, { status: 400 });
    // 号室を建物名に含めた取得元（いい生活等）でも、保存前に建物名と号室を分ける（2026-09-25 二重掲載13件の再発防止）。
    const normalizedUnits = normalizeFeedUnits(parsed.data);
    const feed = normalizedUnits.feed;
    if (feed.expectedCount === undefined) return NextResponse.json({ error: "取得元で確認した検索総登録数 expectedCount を指定してください" }, { status: 400 });
    const age = Date.now() - Date.parse(feed.checkedAt);
    if (age < 0) return NextResponse.json({ error: "確認日時に未来の日時は指定できません" }, { status: 400 });
    const [feeds, existing] = await Promise.all([readSchoolRentalFeeds(), registeredRentalIdentities()]);
    const preview = previewFeedReplacement(feeds.map(f => f.feed), feed, existing);
    const current = feeds.find(f => f.provider === feed.provider);
    if (current && Date.parse(feed.checkedAt) < current.checkedAt.getTime()) return NextResponse.json({ error: "保存済みデータより古い確認結果です" }, { status: 409 });
    const unitCheck = { splitFromBuilding: normalizedUnits.splitCount, unitMissing: normalizedUnits.unitMissing,
      duplicates: preview.excluded.filter(e => e.reason === "同一号室の重複" || e.reason === "既存物件に登録済み").length };
    if (body.action === "preview") return NextResponse.json({ ...preview, unitCheck, expectedUpdatedAt: current?.updatedAt.toISOString() ?? null });
    if (body.action !== "save" || !(body.expectedUpdatedAt === null || typeof body.expectedUpdatedAt === "string" && Number.isFinite(Date.parse(body.expectedUpdatedAt)))) return NextResponse.json({ error: "先に登録前チェックを実行してください" }, { status: 400 });
    if (!await saveSchoolRentalFeed(feed, body.expectedUpdatedAt)) return NextResponse.json({ error: "同時更新を検出しました。再チェックしてください" }, { status: 409 });
    return NextResponse.json({ ...preview, unitCheck, saved: true });
  } catch (error) { return errorResponse(error); }
}
