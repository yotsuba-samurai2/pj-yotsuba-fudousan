/**
 * 受付テーブル（inquiries）の保存・二重送信・保存期間（1年）の削除を、ローカルの使い捨てDBで確かめる。
 * ペット横断 指示書 版2.0 第11・12章・受入テスト T19・T20・T26。本番 Supabase には接続しない。
 *
 *   npx prisma dev --name pet-inquiries --detach        # 使い捨てDBを起動（接続文字列が表示される）
 *   URL='postgres://postgres:postgres@localhost:<port>/template1?sslmode=disable&connection_limit=1&pgbouncer=true'
 *   （pgbouncer=true が無いと prisma dev で `prepared statement "s0" already exists` になる：tasks/lessons.md）
 *   DATABASE_URL="$URL" DIRECT_URL="$URL" npx prisma migrate deploy
 *   DATABASE_URL="$URL" DIRECT_URL="$URL" npx tsx scripts/inquiries/verify-local.ts exercise
 *   DATABASE_URL="$URL" DIRECT_URL="$URL" npx tsx scripts/inquiries/verify-local.ts checksum   # down.sql の前後で他テーブルを比べる
 *
 * 使うのは合成データだけ。実在の顧客・物件のデータは入れない。
 */
import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { RECEIPT_NO_PATTERN } from "@/lib/inquiries/receipt";
import { createInquiry, getInquiry, listInquiries, markNotification, purgeExpiredInquiries, type NewInquiry } from "@/lib/inquiries/store";

function assertLocal() {
  for (const name of ["DATABASE_URL", "DIRECT_URL"]) {
    const value = process.env[name];
    if (!value) throw new Error(`${name} が未設定です`);
    const host = new URL(value.replace(/^postgres(ql)?:/, "http:")).hostname;
    if (host !== "localhost" && host !== "127.0.0.1") throw new Error(`${name} がローカルではありません（${host}）。本番DBには接続しません`);
  }
}

function check(ok: boolean, label: string) {
  if (!ok) throw new Error(`NG: ${label}`);
  console.log(`OK: ${label}`);
}

const DAY_MS = 86_400_000;
const synthetic = (key = randomUUID()): NewInquiry => ({
  idempotencyKey: key,
  business: "realestate",
  category: "pet-housing-renter",
  locale: "ja",
  sourcePath: "/pet-housing",
  payload: { name: "合成 太郎", email: "", phone: "03-0000-0000", deal: "rent", area: "合成エリア", species: "cat", count: "3", consentShare: false },
  consentShare: "none",
  autoReplyStatus: "skipped",
});

/** 合成データ（前回の途中終了で残ったものを含む） */
const SYNTHETIC_ROWS: Prisma.InquiryWhereInput = { OR: [{ receiptNo: { startsWith: "Y000000-" } }, { payload: { path: ["name"], equals: "合成 太郎" } }] };

async function exercise() {
  await prisma.inquiry.deleteMany({ where: SYNTHETIC_ROWS });
  const before = await prisma.inquiry.count();

  // 1. 保存（受付番号の形式）
  const first = await createInquiry(synthetic());
  check(!first.duplicate && RECEIPT_NO_PATTERN.test(first.inquiry.receiptNo), `保存できる・受付番号の形式（${first.inquiry.receiptNo}）`);

  // 2. 同じキーの再送は同じ受付を返す（保存しない）
  const key = randomUUID();
  const a = await createInquiry(synthetic(key));
  const again = await createInquiry(synthetic(key));
  check(again.duplicate && again.inquiry.receiptNo === a.inquiry.receiptNo, "同じ idempotencyKey の再送は同じ受付番号を返す");

  // 3. 同時の二重送信（二重押し）でも1件だけ保存される（一意制約 P2002 → 先に保存された受付を返す）
  const raceKey = randomUUID();
  const [r1, r2] = await Promise.all([createInquiry(synthetic(raceKey)), createInquiry(synthetic(raceKey))]);
  const rows = await prisma.inquiry.count({ where: { idempotencyKey: raceKey } });
  check(rows === 1 && r1.inquiry.receiptNo === r2.inquiry.receiptNo && [r1.duplicate, r2.duplicate].filter(Boolean).length === 1, "同時の二重送信でも保存は1件");

  // 4. 受付番号の一意制約（作り直しの前提）
  const collision = await prisma.inquiry
    .create({ data: { ...synthetic(), receiptNo: first.inquiry.receiptNo, payload: {}, notifyStatus: "pending" } })
    .then(() => null, (e: unknown) => e);
  check(collision instanceof Prisma.PrismaClientKnownRequestError && collision.code === "P2002", "受付番号の重なりは一意制約で検出される（P2002）");

  // 5. 通知結果の記録（通知に失敗しても受付は残る）
  await markNotification(first.inquiry.id, { notifyStatus: "failed", autoReplyStatus: "skipped" });
  const stored = await getInquiry(first.inquiry.id);
  check(stored?.notifyStatus === "failed" && stored.autoReplyStatus === "skipped", "通知の失敗を記録し、受付は残る");

  // 6. 保存期間（1年）：365日を過ぎた受付だけを削除する
  const now = new Date();
  const old = await prisma.inquiry.create({ data: { ...synthetic(), receiptNo: "Y000000-ZZZZ", payload: {}, notifyStatus: "sent", createdAt: new Date(now.getTime() - 366 * DAY_MS) } });
  const recent = await prisma.inquiry.create({ data: { ...synthetic(), receiptNo: "Y000000-YYYY", payload: {}, notifyStatus: "sent", createdAt: new Date(now.getTime() - 364 * DAY_MS) } });
  const purged = await purgeExpiredInquiries(now);
  check(purged === 1 && !(await getInquiry(old.id)) && !!(await getInquiry(recent.id)), "1年を過ぎた受付だけを削除（364日前の受付は残す）");

  // 7. 一覧（新しい順）
  const list = await listInquiries();
  check(list.length === before + 4 && list[0].createdAt >= list[list.length - 1].createdAt, `一覧は新しい順（${list.length}件）`);

  // 8. RLS 有効・PUBLIC に権限なし（Supabase の anon/authenticated は本番で剥奪を確認する）
  const rls = await prisma.$queryRaw<{ relrowsecurity: boolean; acl: string | null }[]>`
    SELECT relrowsecurity, relacl::text AS acl FROM pg_class WHERE relname = 'inquiries'`;
  check(rls[0]?.relrowsecurity === true, "RLS が有効");
  // aclitem の PUBLIC は「=権限/付与者」（被付与者が空）で表れる
  check(!/(^|[{,])=[a-zA-Z]/.test(rls[0]?.acl ?? ""), `PUBLIC に権限がない（relacl=${rls[0]?.acl ?? "null"}）`);

  // 後片付け（合成データを消す）
  await prisma.inquiry.deleteMany({ where: SYNTHETIC_ROWS });
  check((await prisma.inquiry.count()) === before, "合成データを削除した");
}

/** inquiries 以外のテーブルの件数と内容のハッシュ（down.sql が他のテーブルに触れないことの確認用） */
async function checksum() {
  const tables = await prisma.$queryRaw<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename NOT IN ('inquiries', '_prisma_migrations') ORDER BY tablename`;
  for (const { tablename } of tables) {
    const rows = await prisma.$queryRawUnsafe<{ n: bigint; digest: string | null }[]>(
      `SELECT count(*) AS n, md5(string_agg(t::text, '|' ORDER BY t::text)) AS digest FROM "${tablename.replace(/"/g, "")}" t`,
    );
    console.log(`${tablename}\t${rows[0].n}\t${rows[0].digest ?? "-"}`);
  }
  const hasInquiries = await prisma.$queryRaw<{ n: bigint }[]>`SELECT count(*) AS n FROM pg_tables WHERE schemaname = 'public' AND tablename = 'inquiries'`;
  const migration = await prisma.$queryRaw<{ n: bigint }[]>`SELECT count(*) AS n FROM "_prisma_migrations" WHERE migration_name = '20260924060000_add_inquiries'`;
  console.log(`inquiries テーブル：${Number(hasInquiries[0].n) ? "あり" : "なし"}／migration の記録：${Number(migration[0].n) ? "あり" : "なし"}`);
}

async function main() {
  assertLocal();
  const mode = process.argv[2];
  if (mode === "exercise") await exercise();
  else if (mode === "checksum") await checksum();
  else throw new Error("使い方：verify-local.ts exercise | checksum");
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : "失敗しました");
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
