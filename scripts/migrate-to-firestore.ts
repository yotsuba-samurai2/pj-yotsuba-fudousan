/**
 * 既存の JSON データを Firestore に移行するスクリプト
 *
 * 使い方:
 *   npx tsx scripts/migrate-to-firestore.ts
 *
 * 必要: .env.local に Firebase 設定が必要
 */

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection, addDoc, Timestamp } from "firebase/firestore";
import { readFileSync } from "fs";
import { resolve } from "path";

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

async function migrateTranslations() {
  console.log("── 翻訳データの移行 ──");

  const locales = ["ja", "en", "zh-tw", "zh"];
  for (const locale of locales) {
    const filePath = resolve(__dirname, `../src/locales/${locale}.json`);
    try {
      const data = JSON.parse(readFileSync(filePath, "utf-8"));
      await setDoc(doc(db, "translations", locale), data);
      console.log(`  ✓ ${locale}.json → translations/${locale}`);
    } catch (e) {
      console.error(`  ✗ ${locale}.json 移行失敗:`, e);
    }
  }
}

async function migrateColumns() {
  console.log("── コラムデータの移行 ──");

  const filePath = resolve(__dirname, "../src/lib/data/columns.json");
  try {
    const columns = JSON.parse(readFileSync(filePath, "utf-8"));
    const ref = collection(db, "columns");

    for (const col of columns) {
      await addDoc(ref, {
        ...col,
        translations: {},
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      console.log(`  ✓ ${col.business}/${col.slug}`);
    }
    console.log(`  合計 ${columns.length} 件移行完了`);
  } catch (e) {
    console.error("  ✗ コラム移行失敗:", e);
  }
}

async function main() {
  console.log("Firestore 移行開始\n");
  await migrateTranslations();
  console.log();
  await migrateColumns();
  console.log("\n移行完了");
  process.exit(0);
}

main();
