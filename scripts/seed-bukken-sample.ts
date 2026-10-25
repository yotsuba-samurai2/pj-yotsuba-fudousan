/**
 * 物件紹介（/bukken）サンプルseed
 *
 * 【サンプル】明記の draft 1件のみを投入する。
 * published のダミー物件は作らない（架空物件の広告＝おとり広告になるため厳禁。
 * 委任プロンプト_物件紹介bukken_v0.2 確定仕様）。
 *
 * 使い方:
 *   npx tsx scripts/seed-bukken-sample.ts          # dry-run（verify＋preview表示・DB接続なし）
 *   npx tsx scripts/seed-bukken-sample.ts --write  # 新規作成のみ。既存更新には --expected-updated-at=<確認済みISO日時> も必要
 *
 * verify() は seed-labor-columns.ts と同型の内蔵方式：
 *   - status が draft であること（published のサンプルを作らせない）
 *   - タイトルに【サンプル】が明記されていること
 *   - 表示規約の特定用語・業者間用語（property-shared.ts の PROPERTY_BANNED_TERMS）を含まないこと
 *   - 種別（dealType）と spec.dealType の一致・必須項目の存在
 */

import type { HouseSpec } from "../src/lib/property-shared";
import { scanPropertyText } from "../src/lib/property-shared";

type SeedProperty = {
  slug: string;
  status: "draft";
  dealType: "house";
  category: "gh";
  tradeMode: "broker";
  title: string;
  priceYen: number;
  priceNote?: string;
  locationText: string;
  access: { line: string; station: string; distanceM: number }[];
  spec: HouseSpec;
  images: { url: string; alt: string }[];
  description: string;
  infoUpdatedAt: string;
  nextUpdateAt: string;
  locales: ("ja" | "en" | "zh-tw" | "zh")[];
  internal: Record<string, unknown>;
};

const TODAY = new Date().toISOString().slice(0, 10);

const SAMPLE: SeedProperty = {
  slug: "sample-kohinata-house",
  status: "draft",
  dealType: "house",
  category: "gh",
  tradeMode: "broker",
  title: "【サンプル】小日向の中古戸建（表示確認用・実在しません）",
  priceYen: 58_000_000,
  priceNote: "個人間売買のため建物に消費税はかかりません（サンプル表記）",
  locationText: "東京都文京区小日向",
  access: [
    { line: "東京メトロ丸ノ内線", station: "茗荷谷", distanceM: 400 },
  ],
  spec: {
    dealType: "house",
    landAreaSqm: 85.12,
    privateRoadAreaSqm: 0,
    buildingAreaSqm: 92.34,
    builtYm: "2005-03",
    deliveryYm: "即時（相談）",
  },
  images: [],
  description: [
    "※本物件は管理画面・表示確認用の【サンプル】です。実在せず、公開しないでください。",
    "",
    "閑静な住宅街の中古戸建です。障害福祉サービスでのご利用可否は、所管行政庁の指定基準等の確認が必要です。個別にご相談ください。",
  ].join("\n"),
  infoUpdatedAt: TODAY,
  nextUpdateAt: TODAY,
  locales: ["ja"],
  internal: {
    sourceType: "own",
    memo: "サンプルデータ（seed-bukken-sample.ts で投入）。公開禁止。",
  },
};

function verify(p: SeedProperty): string[] {
  const errors: string[] = [];
  if (p.status !== "draft") {
    errors.push("status は draft のみ（published のサンプル物件は厳禁）");
  }
  if (!p.title.includes("【サンプル】")) {
    errors.push("タイトルに【サンプル】の明記が必要");
  }
  if (p.spec.dealType !== p.dealType) {
    errors.push("spec.dealType が dealType と一致していない");
  }
  if (!/^[a-z0-9-]+$/.test(p.slug)) {
    errors.push("slug は半角英数とハイフンのみ");
  }
  if (!Number.isInteger(p.priceYen) || p.priceYen <= 0) {
    errors.push("priceYen は正の整数（円）");
  }
  for (const a of p.access) {
    if (!(a.distanceM > 0)) errors.push(`access(${a.station}): distanceM は正の数`);
  }
  const hits = scanPropertyText([p.title, p.description, p.priceNote ?? ""].join("\n"));
  for (const h of hits) {
    errors.push(`禁止語（規約特定用語・業者間用語）: ${h.term}`);
  }
  const required = ["landAreaSqm", "privateRoadAreaSqm", "buildingAreaSqm", "builtYm", "deliveryYm"] as const;
  for (const key of required) {
    if (p.spec[key] === undefined || p.spec[key] === "") {
      errors.push(`spec.${key} が未入力（別表5のインターネット広告必須項目）`);
    }
  }
  return errors;
}

async function main() {
  const write = process.argv.includes("--write");
  const errors = verify(SAMPLE);
  if (errors.length > 0) {
    console.error("verify NG:");
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }
  console.log("verify OK");

  if (!write) {
    console.log("[dry-run] 投入内容のプレビュー（--write は新規のみ、既存更新は確認済み版も必要）:");
    console.log(JSON.stringify(SAMPLE, null, 2));
    return;
  }

  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  try {
    const { createPropertyRepository } = await import("../src/lib/db/property-repository");
    const expectedFlags = process.argv.filter(arg => arg.startsWith("--expected-updated-at="));
    if (expectedFlags.length > 1) throw new Error("EXPECTED_VERSION_ARGUMENT_INVALID");
    const expected = expectedFlags.length ? expectedFlags[0].slice("--expected-updated-at=".length) : null;
    const r = await createPropertyRepository(prisma).upsertPropertyBySlug(SAMPLE.slug, SAMPLE, expected);
    console.log(`seed ${r.action}: ${r.id}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
