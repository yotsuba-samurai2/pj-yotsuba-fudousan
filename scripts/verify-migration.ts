/**
 * P2用: 移行照合スクリプト（設計書§5・移行計画P2の完了条件）。
 * FirestoreエクスポートJSONとDB（Prisma）を突き合わせ、
 * 件数・slug・locales・status・公開/非公開を機械照合して差分を表形式で出力する。
 *
 * 使い方:
 *   npx tsx scripts/verify-migration.ts --columns <columns.json> [--translations <translations.json>]
 *
 * 終了コード: 差分ゼロ=0 / 差分あり=1
 */
import fs from "node:fs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Doc = Record<string, unknown>;
type Diff = { key: string; field: string; expected: string; actual: string };

function parseArgs(argv: string[]) {
  const args: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) args[argv[i].slice(2)] = argv[++i];
  }
  return args as { columns?: string; translations?: string };
}

function normalizeDocs(raw: unknown): Doc[] {
  if (Array.isArray(raw)) return raw as Doc[];
  if (raw && typeof raw === "object") return Object.values(raw as Record<string, Doc>);
  throw new Error("エクスポートJSONは配列または {docId: doc} マップである必要があります");
}

function fmtLocales(v: unknown): string {
  const arr = Array.isArray(v) ? (v as string[]) : [];
  return `[${[...arr].sort().join(",")}]`; // 未設定＝[]（全言語公開）に正規化
}

function printTable(rows: Diff[]) {
  const headers = ["key", "field", "expected(export)", "actual(db)"];
  const data = rows.map((r) => [r.key, r.field, r.expected, r.actual]);
  const widths = headers.map((h, i) =>
    Math.max(h.length, ...data.map((row) => String(row[i]).length)),
  );
  const line = (cols: string[]) =>
    "| " + cols.map((c, i) => String(c).padEnd(widths[i])).join(" | ") + " |";
  console.log(line(headers));
  console.log("|" + widths.map((w) => "-".repeat(w + 2)).join("|") + "|");
  for (const row of data) console.log(line(row));
}

async function verifyColumns(file: string): Promise<Diff[]> {
  const docs = normalizeDocs(JSON.parse(fs.readFileSync(file, "utf8")));
  const rows = await prisma.column.findMany();
  const diffs: Diff[] = [];

  // 件数
  if (docs.length !== rows.length) {
    diffs.push({
      key: "(columns)",
      field: "count",
      expected: String(docs.length),
      actual: String(rows.length),
    });
  }

  const dbByKey = new Map(rows.map((r) => [`${r.business}/${r.slug}`, r]));
  const exportKeys = new Set<string>();

  for (const doc of docs) {
    const key = `${doc.business}/${doc.slug}`;
    exportKeys.add(key);
    const row = dbByKey.get(key);
    if (!row) {
      diffs.push({ key, field: "存在", expected: "あり", actual: "DBに無し" });
      continue;
    }
    const expStatus = (doc.status as string) || "draft";
    if (expStatus !== row.status) {
      diffs.push({ key, field: "status", expected: expStatus, actual: row.status });
    }
    const expLocales = fmtLocales(doc.locales);
    const actLocales = fmtLocales(row.locales);
    if (expLocales !== actLocales) {
      diffs.push({ key, field: "locales", expected: expLocales, actual: actLocales });
    }
  }
  for (const [key] of dbByKey) {
    if (!exportKeys.has(key)) {
      diffs.push({ key, field: "存在", expected: "エクスポートに無し", actual: "あり" });
    }
  }

  // 公開/非公開の集計照合
  const count = (list: string[], v: string) => list.filter((s) => s === v).length;
  const expStatuses = docs.map((d) => ((d.status as string) || "draft"));
  const actStatuses = rows.map((r) => r.status as string);
  for (const st of ["published", "draft", "deleted"]) {
    const e = count(expStatuses, st);
    const a = count(actStatuses, st);
    if (e !== a) {
      diffs.push({
        key: "(columns)",
        field: `count:${st}`,
        expected: String(e),
        actual: String(a),
      });
    }
  }
  console.log(
    `columns: export=${docs.length}件 db=${rows.length}件 ` +
      `(published: export=${count(expStatuses, "published")} db=${count(actStatuses, "published")})`,
  );
  return diffs;
}

async function verifyTranslations(file: string): Promise<Diff[]> {
  const raw = JSON.parse(fs.readFileSync(file, "utf8")) as unknown;
  const entries: Array<[string, Doc]> = Array.isArray(raw)
    ? (raw as Doc[]).map((d) => {
        const { locale, id, ...data } = d as Doc & { locale?: string; id?: string };
        return [String(locale ?? id), data];
      })
    : Object.entries(raw as Record<string, Doc>);
  const rows = await prisma.translation.findMany();
  const dbByLocale = new Map(rows.map((r) => [r.locale, r]));
  const diffs: Diff[] = [];

  for (const [locale, data] of entries) {
    const row = dbByLocale.get(locale);
    if (!row) {
      diffs.push({ key: `translations/${locale}`, field: "存在", expected: "あり", actual: "DBに無し" });
      continue;
    }
    const expKeys = Object.keys(data).sort().join(",");
    const actKeys = Object.keys(row.data as Record<string, unknown>).sort().join(",");
    if (expKeys !== actKeys) {
      diffs.push({
        key: `translations/${locale}`,
        field: "トップレベルキー",
        expected: expKeys,
        actual: actKeys,
      });
    }
  }
  console.log(`translations: export=${entries.length}ロケール db=${rows.length}ロケール`);
  return diffs;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.columns && !args.translations) {
    console.error(
      "使い方: npx tsx scripts/verify-migration.ts --columns <file> [--translations <file>]",
    );
    process.exit(1);
  }
  const diffs: Diff[] = [];
  if (args.columns) diffs.push(...(await verifyColumns(args.columns)));
  if (args.translations) diffs.push(...(await verifyTranslations(args.translations)));

  if (diffs.length === 0) {
    console.log("\n照合OK: 差分なし");
  } else {
    console.log(`\n差分 ${diffs.length}件:`);
    printTable(diffs);
    process.exitCode = 1;
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
