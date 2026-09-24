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
 *   DATABASE_URL="$URL" DIRECT_URL="$URL" npx tsx scripts/rental-survey/verify-local.ts checksum   # down.sql の前後で比べる
 *
 * 使うのは合成データだけ。実在の物件・顧客・会員データは入れない。
 */
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { saveSchoolRentalFeed } from "@/lib/school-rental-feed-store";
import type { RentalFeed } from "@/lib/school-rental-feed";
import type { SurveyBatch } from "@/lib/rental-survey/batch";
import { planFinalization, planRollback } from "@/lib/rental-survey/finalize";
import type { LedgerEntry } from "@/lib/rental-survey/permissions";
import { currentSurveyScope } from "@/lib/rental-survey/scope";
import { findLatestFinalization, insertBatch, insertFinalization, readBatches } from "@/lib/rental-survey/store";

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
// 検証用の台帳（本番の台帳 DATA_USE_LEDGER は空のまま）
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
  } else {
    throw new Error("使い方：verify-local.ts seed-school | checksum | exercise");
  }
}

main().finally(() => prisma.$disconnect()).catch(error => { console.error(error); process.exit(1); });
