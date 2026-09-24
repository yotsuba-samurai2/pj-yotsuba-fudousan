/**
 * ペット調査テーブル（rental_survey_*）の追加が学区データを変えないことを、ローカルの使い捨てDBで確かめる。
 * ペット横断 指示書 版2.0 第4.2章・受入テスト T01・T03。本番 Supabase には接続しない。
 *
 *   npx prisma dev --name pet-survey --detach           # 使い捨てDBを起動（接続文字列が表示される）
 *   URL='postgres://postgres:postgres@localhost:<port>/template1?sslmode=disable&connection_limit=1&pgbouncer=true'
 *   （pgbouncer=true が無いと prisma dev で `prepared statement "s0" already exists` になる：tasks/lessons.md）
 *   DATABASE_URL="$URL" DIRECT_URL="$URL" npx prisma migrate deploy
 *   DATABASE_URL="$URL" DIRECT_URL="$URL" npx tsx scripts/rental-survey/verify-local.ts seed-school
 *   DATABASE_URL="$URL" DIRECT_URL="$URL" npx tsx scripts/rental-survey/verify-local.ts exercise
 *   DATABASE_URL="$URL" DIRECT_URL="$URL" npx tsx scripts/rental-survey/verify-local.ts exercise-api  # 実際の管理API・実際の台帳で（2026-09-24〜）
 *   DATABASE_URL="$URL" DIRECT_URL="$URL" npx tsx scripts/rental-survey/verify-local.ts checksum   # down.sql の前後で比べる
 *
 * 使うのは合成データだけ。実在の物件・顧客・会員データは入れない。
 * exercise-api の認証は、この手元で立てる偽の認証サーバーが答える（Supabase には接続しない）。
 */
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { GET, POST } from "@/app/api/admin/rental-survey/route";
import { prisma } from "@/lib/prisma";
import { saveSchoolRentalFeed } from "@/lib/school-rental-feed-store";
import type { RentalFeed } from "@/lib/school-rental-feed";
import { surveyBatchSchema, type SurveyBatch, type SurveyRecord } from "@/lib/rental-survey/batch";
import { planFinalization, planRollback } from "@/lib/rental-survey/finalize";
import type { LedgerEntry } from "@/lib/rental-survey/permissions";
import { pickFinalizationBatches, summarizeBatch, type BatchMeta } from "@/lib/rental-survey/review";
import { currentSurveyScope } from "@/lib/rental-survey/scope";
import { findLatestFinalization, getPublicSurveySummary, insertBatch, insertFinalization, readBatches } from "@/lib/rental-survey/store";

function assertLocal() {
  for (const name of ["DATABASE_URL", "DIRECT_URL"]) {
    const value = process.env[name];
    if (!value) throw new Error(`${name} が未設定です`);
    const host = new URL(value.replace(/^postgres(ql)?:/, "http:")).hostname;
    if (host !== "localhost" && host !== "127.0.0.1") throw new Error(`${name} がローカルではありません（${host}）。本番DBには接続しません`);
  }
}

async function schoolChecksum() {
  const rows = await prisma.$queryRaw<{ n: bigint; digest: string | null }[]>`
    SELECT count(*) AS n, md5(string_agg(t::text, '|' ORDER BY provider)) AS digest FROM school_rental_feeds t`;
  return `${rows[0].n}:${rows[0].digest}`;
}

const schoolFeed: RentalFeed = {
  version: 1, provider: "reins", scope: "bunkyo-rent-175000-area-48", checkedAt: "2026-09-23T04:00:00Z", complete: true, expectedCount: 1,
  records: [{
    sourceId: "synthetic-1", advertising: "allowed", advertisingQuote: "広告可（合成）", availability: "active", application: "none",
    applicationQuote: "申込数空欄（合成）", adQuote: "", adStatus: "none",
    summary: {
      building: "合成マンション", unit: "205", address: "東京都文京区千石１丁目２０－２０", rentYen: 250000, managementYen: 10000, commonYen: 0,
      deposit: "1ヶ月", keyMoney: "1ヶ月", layout: "2LDK", areaSqm: 60, availabilityText: "相談", pets: "consult", foreignNationals: "unknown",
      corporate: "unknown", companyHousing: "unknown", companyHousingTerms: "", petTerms: "ペット相談（合成）", foreignTerms: "", corporateTerms: "",
      buildingType: "マンション", access: "合成線 徒歩5分", built: "2000年1月", structure: "RC", floors: "3階", contractType: "普通借家",
      contractPeriod: "2年", guaranteeDeposit: "", renewalFee: "", insurance: "", guarantor: "", otherFees: "",
    },
  }],
};

const petRecord = {
  sourceId: "p-1", building: "合成マンション", unit: "205", address: "東京都文京区千石１丁目２０－２０", availability: "active" as const,
  application: "none" as const, applicationQuote: "申込なし（合成）",
  pet: { multi: "allowed" as const, species: "cat" as const, limits: { cats: 2, dogs: null, total: 2 }, largeDog: "not-allowed" as const, conditions: "", petQuote: "猫2匹まで可（合成）" },
};
const petBatch = (provider: SurveyBatch["provider"], observedTo: string): SurveyBatch => ({
  version: 1, scopeId: "bunkyo-rent-pet", scopeVersion: 1, provider, status: "verified", observedFrom: "2026-09-22T00:00:00Z", observedTo,
  allPagesChecked: true, expectedCount: 1, records: [{ ...petRecord, sourceId: `${provider}-1` }],
});
// exercise 用の台帳（確定の仕組みだけを見るため、台帳の内容に依存させない）。exercise-api は実際の台帳 DATA_USE_LEDGER を使う
const ledger: LedgerEntry[] = (["reins", "atbb", "itandi", "eslife"] as const).map(provider => ({
  provider, use: "store", status: "confirmed", termsVersion: "検証用", checkedOn: "2026-09-24", validFrom: "2026-09-01T00:00:00Z",
  validUntil: null, evidenceRef: "ローカル検証用（実在の許諾ではない）", attribution: null,
}));

function check(condition: unknown, message: string) {
  if (!condition) throw new Error(`NG: ${message}`);
  console.log(`OK: ${message}`);
}

async function exercise() {
  const scope = currentSurveyScope("bunkyo-rent-pet")!;
  const before = await schoolChecksum();
  check(!before.startsWith("0:"), `学区の行がある状態で始める（${before}）`);
  const rls = await prisma.$queryRaw<{ relname: string; relrowsecurity: boolean }[]>`
    SELECT relname, relrowsecurity FROM pg_class WHERE relname IN ('rental_survey_batches', 'rental_survey_finalizations')`;
  check(rls.length === 2 && rls.every(r => r.relrowsecurity), "調査テーブル2つとも RLS 有効");

  const now = new Date("2026-09-24T03:00:00Z");
  const round = async (observedTo: string) => {
    const ids = [];
    for (const provider of scope.providers) ids.push(await insertBatch(scope, petBatch(provider, observedTo)));
    return readBatches(scope, ids);
  };
  const failedId = await insertBatch(scope, { ...petBatch("reins", "2026-09-23T00:00:00Z"), status: "failed", allPagesChecked: false, expectedCount: undefined, records: [], failureReason: "合成の失敗" });
  const failed = await prisma.rentalSurveyBatch.findUnique({ where: { id: failedId } });
  check(failed?.payload === null && failed.status === "failed", "失敗バッチは状態だけを記録し、観測行を持たない");

  const first = planFinalization({ scope, batches: await round("2026-09-23T00:00:00Z"), latest: null, ledger, now });
  if (!first.ok) throw new Error(first.error);
  const race = await Promise.all([insertFinalization(scope, first.data, 0), insertFinalization(scope, first.data, 0)]);
  check(race.filter(Boolean).length === 1, "同じ番号での同時確定は1件だけ成功し、もう1件は検出される（T03）");
  const v1 = await findLatestFinalization(scope);
  check(v1?.sequence === 1, "確定 #1");

  const second = planFinalization({ scope, batches: await round("2026-09-23T12:00:00Z"), latest: v1, ledger, now });
  if (!second.ok) throw new Error(second.error);
  check(await insertFinalization(scope, second.data, 1), "確定 #2");
  check(!(await insertFinalization(scope, second.data, 1)), "古い番号（1）での再確定は拒否（T03）");

  const rollback = planRollback({ scope, target: v1, latest: await findLatestFinalization(scope), ledger, now });
  if (!rollback.ok) throw new Error(rollback.error);
  check(await insertFinalization(scope, rollback.data, 2), "確定 #1 への巻き戻し（#3 として追記）");
  const latest = await findLatestFinalization(scope);
  check(latest?.sequence === 3 && latest.rolledBackFrom === v1!.id && latest.batchIds.join() === v1!.batchIds.join(), "巻き戻し後の現在の確定は #1 の写し");
  check((await prisma.rentalSurveyFinalization.count()) === 3, "確定ログは追記のみ（3行）");

  const after = await schoolChecksum();
  check(after === before, `学区の行は完全に同じ（T01・${after}）`);
}

/**
 * 実際の管理API（/api/admin/rental-survey の GET・POST）を、実際の台帳（2026-09-24 浦松判断）で通す。
 * 取込画面が送るのと同じ本文を送り、画面が使う整理（summarizeBatch・pickFinalizationBatches）も同じものを使う。
 */
const ADMIN_TOKEN = "local-admin";

async function startFakeAuth() {
  const server = createServer((req, res) => {
    const ok = req.url === "/auth/v1/user" && req.headers.authorization === `Bearer ${ADMIN_TOKEN}`;
    res.writeHead(ok ? 200 : 401, { "Content-Type": "application/json" });
    res.end(JSON.stringify(ok
      ? { id: "00000000-0000-4000-8000-000000000001", aud: "authenticated", role: "authenticated", email: "admin@example.invalid", app_metadata: {}, user_metadata: {}, created_at: "2026-09-24T00:00:00Z" }
      : { code: 401, error_code: "bad_jwt", msg: "invalid JWT" }));
  });
  await new Promise<void>(done => server.listen(0, "127.0.0.1", done));
  process.env.NEXT_PUBLIC_SUPABASE_URL = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  process.env.SUPABASE_SERVICE_ROLE_KEY = "local-fake-service-role";
  return server;
}

async function api(method: "GET" | "POST", body?: unknown, token = ADMIN_TOKEN) {
  const url = `http://localhost/api/admin/rental-survey${method === "GET" ? "?scopeId=bunkyo-rent-pet&scopeVersion=1" : ""}`;
  const req = new NextRequest(url, {
    method, headers: { Authorization: `Bearer ${token}`, ...(body ? { "Content-Type": "application/json" } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const res = method === "GET" ? await GET(req) : await POST(req);
  return { status: res.status, data: await res.json() };
}

const ADDRESS = "東京都文京区千石１丁目２０－２０";
const unitRecord = (provider: string, unit: string, pet: SurveyRecord["pet"], over: Partial<SurveyRecord> = {}): SurveyRecord => ({
  sourceId: `${provider}-${unit}`, building: "合成マンション", unit, address: ADDRESS, availability: "active", application: "none", applicationQuote: "申込なし（合成）", pet, ...over,
});
const CAT2 = { multi: "allowed", species: "cat", limits: { cats: 2, dogs: null, total: 2 }, largeDog: "not-allowed", conditions: "", petQuote: "猫2匹まで可（合成）" } as const;
const LARGE_DOG = { multi: "single-only", species: "dog", limits: { cats: null, dogs: 1, total: 1 }, largeDog: "consult", conditions: "敷金1ヶ月追加（合成）", petQuote: "大型犬1頭相談（合成）" } as const;
const CONSULT_ONLY = { multi: "unconfirmed-count", species: "other-or-unconfirmed", limits: { cats: null, dogs: null, total: null }, largeDog: "unconfirmed", conditions: "", petQuote: "ペット相談（合成）" } as const;
const DOGS2 = { multi: "allowed", species: "dog", limits: { cats: null, dogs: 2, total: 2 }, largeDog: "not-allowed", conditions: "", petQuote: "小型犬2頭まで可（合成）" } as const;

/** 取込画面と同じく、JSON ファイルの中身として検査してから使う */
function batchFile(provider: SurveyBatch["provider"], records: SurveyRecord[], observedFrom: string, observedTo: string): SurveyBatch {
  const raw = JSON.stringify({ version: 1, scopeId: "bunkyo-rent-pet", scopeVersion: 1, provider, status: "verified", observedFrom, observedTo, allPagesChecked: true, expectedCount: records.length, records });
  return surveyBatchSchema.parse(JSON.parse(raw));
}

async function exerciseApi() {
  const scope = currentSurveyScope("bunkyo-rent-pet")!;
  const server = await startFakeAuth();
  try {
    const before = await schoolChecksum();
    check(!before.startsWith("0:"), `学区の行がある状態で始める（${before}）`);
    const params = { scopeId: scope.scopeId, scopeVersion: scope.version };
    const now = Date.now();
    const iso = (hoursAgo: number) => new Date(now - hoursAgo * 3_600_000).toISOString();

    check((await api("GET", undefined, "wrong-token")).status === 401, "ログインしていなければ 401");
    const status0 = await api("GET");
    check(status0.status === 200, "GET 200");
    check(status0.data.permissions.length === 4 && status0.data.permissions.every((p: { store: boolean; aggregate: boolean }) => p.store && p.aggregate),
      "実際の台帳で、4媒体とも内部保存・加工と集計公表が「記載あり」");
    const startSequence = status0.data.finalizations.reduce((max: number, f: { sequence: number }) => Math.max(max, f.sequence), 0);

    // 1回目：4媒体。千石の205（猫2匹）は4媒体とも、402（大型犬相談）は ITANJI だけ、301（ペット相談だけ）は ATBB だけ
    const round1 = scope.providers.map(provider => batchFile(provider, [
      unitRecord(provider, "205", CAT2),
      ...(provider === "itandi" ? [unitRecord(provider, "402", LARGE_DOG)] : []),
      ...(provider === "atbb" ? [unitRecord(provider, "301", CONSULT_ONLY)] : []),
    ], iso(3), iso(2)));
    const atbbReview = summarizeBatch(round1[1]);
    check(atbbReview.counts.target === 1 && atbbReview.counts.unconfirmedCount === 1, "画面の整理：「ペット相談」だけの記載は対象外（ATBB は対象1・頭数未確認1）");

    const batchCount = () => prisma.rentalSurveyBatch.count();
    const n0 = await batchCount();
    for (const batch of round1) {
      const dry = await api("POST", { action: "save-batch", dryRun: true, ...params, batch });
      check(dry.status === 200 && dry.data.dryRun === true && dry.data.recordCount === batch.records.length, `登録前チェック ${batch.provider}（${batch.records.length}件）`);
    }
    check(await batchCount() === n0, "登録前チェックでは保存しない");
    for (const batch of round1) {
      const saved = await api("POST", { action: "save-batch", dryRun: false, ...params, batch });
      check(saved.status === 200 && typeof saved.data.id === "string", `保存 ${batch.provider}`);
    }
    const failed = await api("POST", { action: "save-batch", dryRun: false, ...params,
      batch: { version: 1, ...params, provider: "reins", status: "failed", failureReason: "同席の時間内に終わらなかった（合成）", observedFrom: iso(1), observedTo: iso(1), allPagesChecked: false, records: [] } });
    check(failed.status === 200, "失敗のバッチも状態と理由だけ保存できる");
    const future = await api("POST", { action: "save-batch", dryRun: true, ...params, batch: { ...round1[0], observedTo: new Date(now + 3_600_000).toISOString() } });
    check(future.status === 400, "観測終了が未来のバッチは 400");

    const pick1 = pickFinalizationBatches((await api("GET")).data.batches as BatchMeta[], scope);
    check(pick1.batchIds.length === 4 && pick1.missing.length === 0 && pick1.withinWindow, "画面の選択：媒体ごとに最新の verified（失敗の REINS は選ばない）");

    const dry1 = await api("POST", { action: "finalize", dryRun: true, ...params, batchIds: pick1.batchIds, expectedSequence: startSequence });
    check(dry1.status === 200 && dry1.data.x === 2 && dry1.data.targetBreakdown.multiplePets === 1 && dry1.data.targetBreakdown.largeDog === 1,
      `確定前チェック：X=2（205・402）・内訳 複数飼育1／大型犬1（${JSON.stringify(dry1.data.targetBreakdown)}）`);
    check((await prisma.rentalSurveyFinalization.count({ where: { scopeId: scope.scopeId } })) === startSequence, "確定前チェックでは保存しない");
    const fin1 = await api("POST", { action: "finalize", dryRun: false, ...params, batchIds: pick1.batchIds, expectedSequence: startSequence });
    check(fin1.status === 200 && fin1.data.sequence === startSequence + 1 && fin1.data.x === 2, `確定 #${startSequence + 1}（X=2）。公開ページの再生成に失敗しても確定は成功する`);
    const stale = await api("POST", { action: "finalize", dryRun: true, ...params, batchIds: pick1.batchIds, expectedSequence: startSequence });
    check(stale.status === 409, "古い番号での確定は 409");

    // 2回目：REINS に 503（小型犬2頭可）が加わる
    for (const provider of scope.providers) {
      const batch = batchFile(provider, [
        unitRecord(provider, "205", CAT2),
        ...(provider === "itandi" ? [unitRecord(provider, "402", LARGE_DOG)] : []),
        ...(provider === "reins" ? [unitRecord(provider, "503", DOGS2)] : []),
      ], iso(1.5), iso(0.5));
      check((await api("POST", { action: "save-batch", dryRun: false, ...params, batch })).status === 200, `2回目の保存 ${provider}`);
    }
    const pick2 = pickFinalizationBatches((await api("GET")).data.batches as BatchMeta[], scope);
    check(pick2.batchIds.every(id => !pick1.batchIds.includes(id)), "2回目は新しいバッチが選ばれる");
    const fin2 = await api("POST", { action: "finalize", dryRun: false, ...params, batchIds: pick2.batchIds, expectedSequence: startSequence + 1 });
    check(fin2.status === 200 && fin2.data.x === 3, `確定 #${startSequence + 2}（X=3）`);

    const history = (await api("GET")).data.finalizations as { id: string; sequence: number; x?: number }[];
    const first = history.find(f => f.sequence === startSequence + 1)!;
    const rbDry = await api("POST", { action: "rollback", dryRun: true, ...params, targetId: first.id, expectedSequence: startSequence + 2 });
    check(rbDry.status === 200 && rbDry.data.x === 2, "巻き戻しの確認：X=2 に戻る");
    const rb = await api("POST", { action: "rollback", dryRun: false, ...params, targetId: first.id, expectedSequence: startSequence + 2 });
    check(rb.status === 200 && rb.data.sequence === startSequence + 3, `巻き戻し（#${startSequence + 3} として追記）`);
    const latest = ((await api("GET")).data.finalizations as { sequence: number; x?: number; rolledBackFrom: string | null }[]).find(f => f.sequence === startSequence + 3);
    check(latest?.x === 2 && latest.rolledBackFrom === first.id, "履歴：現在の確定は #1 の写し（X=2）");

    const hidden = await getPublicSurveySummary("bunkyo-rent-pet", "ja", { env: {} });
    check(hidden.state === "hidden", "公開フラグが無ければ /pet-housing の件数枠は hidden");
    const shown = await getPublicSurveySummary("bunkyo-rent-pet", "ja", { env: { RENTAL_SURVEY_PUBLIC_SCOPES: "bunkyo-rent-pet:1" } });
    check(shown.state === "shown" && shown.x === 2 && shown.attribution === null && shown.sourceKind === "multiple",
      `公開フラグがあれば件数を出す（X=2・媒体名なし・複数媒体：${JSON.stringify(shown)}）`);

    const after = await schoolChecksum();
    check(after === before, `学区の行は完全に同じ（${after}）`);
  } finally {
    server.close();
  }
}

async function main() {
  assertLocal();
  const mode = process.argv[2];
  if (mode === "seed-school") {
    try { await saveSchoolRentalFeed(schoolFeed, null); console.log("学区の合成行を1件保存しました"); }
    catch (error) { if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")) throw error; console.log("学区の合成行は保存済みです"); }
  } else if (mode === "checksum") {
    console.log(`school_rental_feeds ${await schoolChecksum()}`);
  } else if (mode === "exercise") {
    await exercise();
  } else if (mode === "exercise-api") {
    await exerciseApi();
  } else {
    throw new Error("使い方：verify-local.ts seed-school | checksum | exercise | exercise-api");
  }
}

main().finally(() => prisma.$disconnect()).catch(error => { console.error(error); process.exit(1); });
