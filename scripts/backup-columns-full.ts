/**
 * columns コレクション全件のバックアップ（読み取りのみ）。
 * 出力: scripts/backup/columns-backup-<date>.json
 *
 * 使い方: npx tsx scripts/backup-columns-full.ts <date>
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

async function main() {
  const date = process.argv[2] || "unknown-date";
  const snap = await getDocs(collection(db, "columns"));
  const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const outPath = resolve(__dirname, "backup", `columns-backup-${date}.json`);
  writeFileSync(outPath, JSON.stringify(all, null, 2), "utf-8");
  console.log(`✅ バックアップ保存: ${outPath} (${all.length}件)`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
