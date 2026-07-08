/**
 * columns.locales 後埋め ドライラン＋バックアップ（読み取りのみ）
 *
 * 四葉サイト_多言語コンテンツ出し分け設計_v0.2.md Part1 の移行手順用。
 * Firestoreへの書き込みは行わない（columns の write ルールは isAdmin() のみ許可のため、
 * このスクリプト＝匿名Client SDKでは元々書き込み不可）。
 * 実際の書き込みは admin 画面（ブラウザの管理者セッション）から行う。
 *
 * 出力:
 *   - scripts/backup/columns-backup-<date>.json  … 全件の現状スナップショット
 *   - コンソール … 現状値 → 提案locales の一覧（レビュー用）
 *
 * 使い方: npx tsx scripts/backfill-locales-dry-run.ts
 */

import { writeFileSync } from "fs";
import { resolve } from "path";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAQ2_xa2Nw2vB1GivwWxWaKijpDaWpHMLw",
  authDomain: "pj-yotsuba-corporate.firebaseapp.com",
  projectId: "pj-yotsuba-corporate",
  storageBucket: "pj-yotsuba-corporate.firebasestorage.app",
  messagingSenderId: "30131850297",
  appId: "1:30131850297:web:72f66776d0789b960c51e8",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 台湾コンテンツ_admin投入指示書_v1.md §1 の9本（この9本だけ locales=["zh-tw"] の特例）
const TAIWAN_SLUGS = new Set([
  "taiwan-souzoku-japan-fudosan",
  "taiwan-souzoku-baikyaku",
  "taiwan-souzoku-kanri-katsuyo",
  "taiwan-jin-souzoku-tetsuzuki",
  "taiwan-souzoku-guide",
  "taiwan-tokyo-fudosan-toshi",
  "bunkyo-shueki-bukken",
  "taiwan-tetsuzuki-onestop",
  "taiwan",
]);

// 設計書§2-6の推奨ルール: 台湾9本以外は「ja + translationsに存在する言語」
function computeDefaultLocales(business: string, slug: string, translations: Record<string, unknown> | undefined): string[] {
  if (business === "realestate" && TAIWAN_SLUGS.has(slug)) return ["zh-tw"];
  const transLangs = translations ? Object.keys(translations) : [];
  return Array.from(new Set(["ja", ...transLangs]));
}

async function main() {
  const snap = await getDocs(collection(db, "columns"));

  const all = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Array<{
    id: string;
    business: string;
    slug: string;
    status: string;
    title: string;
    locales?: string[];
    translations?: Record<string, unknown>;
  }>;

  // ── バックアップ ──
  const date = "2026-07-08"; // 実行日（本セッションのcurrentDate）
  const backupPath = resolve(__dirname, "backup", `columns-backup-${date}.json`);
  writeFileSync(backupPath, JSON.stringify(all, null, 2), "utf-8");
  console.log(`✅ バックアップ保存: ${backupPath} (${all.length}件)\n`);

  // ── ドライラン ──
  const missing = all.filter((c) => !c.locales);
  const already = all.filter((c) => !!c.locales);

  console.log(`── locales 未設定: ${missing.length}件 / 設定済み: ${already.length}件 ──\n`);

  console.log("【提案する後埋め内容】");
  console.log("business".padEnd(12) + "status".padEnd(10) + "slug".padEnd(40) + "現状locales".padEnd(14) + "→ 提案locales");
  for (const c of missing) {
    const proposed = computeDefaultLocales(c.business, c.slug, c.translations);
    console.log(
      c.business.padEnd(12) +
        c.status.padEnd(10) +
        c.slug.padEnd(40) +
        "(未設定)".padEnd(14) +
        `→ [${proposed.join(", ")}]`,
    );
  }

  if (already.length > 0) {
    console.log("\n【既にlocales設定済み・スキップ対象】");
    for (const c of already) {
      console.log(`  ${c.business}/${c.slug}: [${c.locales!.join(", ")}]`);
    }
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
