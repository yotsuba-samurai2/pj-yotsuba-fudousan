/**
 * translations コレクションの読み取り専用バックアップ＋監査スクリプト
 *
 * タスク0（社労士全非表示・/about実体情報修正・士業ドットコム表記）の
 * Firestore編集対象を特定するための「退避（バックアップ）→診断」ステップ。
 *
 * - 書き込みは一切行わない（Firestore REST APIの GET のみ。firestore.rules 上
 *   `allow read: if true` のため認証情報不要）。
 * - 各ロケールの translations/{locale} ドキュメントを丸ごと
 *   scripts/backup/translations-{locale}.json へ保存。
 * - 保存したJSON全体から、社労士関連・SAMURAI・旧住所表記・旧営業時間表記を
 *   含むキーをフラット化して抽出し、一覧をコンソールに出力する（変更対象の特定用）。
 *
 * 使い方: npx tsx scripts/backup-translations.ts
 */

import { writeFileSync, mkdirSync } from "fs";
import { resolve } from "path";

const PROJECT_ID = "pj-yotsuba-corporate";
const LOCALES = ["ja", "en", "zh-tw", "zh"] as const;

const AUDIT_PATTERNS: { label: string; re: RegExp }[] = [
  { label: "社会保険労務士/社労士", re: /社会保険労務士|社労士/ },
  { label: "SAMURAI", re: /SAMURAI/ },
  { label: "旧住所(2F)", re: /2F/ },
  { label: "旧営業時間(9:00〜18:00 / 9:00-18:00)", re: /9:00[〜\-–]18:00/ },
];

function decodeValue(value: Record<string, unknown>): unknown {
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("nullValue" in value) return null;
  if ("mapValue" in value) {
    const map =
      (value.mapValue as { fields?: Record<string, Record<string, unknown>> })
        .fields ?? {};
    return decodeFields(map);
  }
  if ("arrayValue" in value) {
    const arr =
      (value.arrayValue as { values?: Record<string, unknown>[] }).values ??
      [];
    return arr.map((v) => decodeValue(v));
  }
  return null;
}

function decodeFields(
  fields: Record<string, Record<string, unknown>>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields)) {
    result[key] = decodeValue(value);
  }
  return result;
}

async function fetchTranslations(
  locale: string,
): Promise<Record<string, unknown>> {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/translations/${locale}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`GET translations/${locale} failed: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as {
    fields?: Record<string, Record<string, unknown>>;
  };
  if (!data.fields) return {};
  return decodeFields(data.fields);
}

/** ネストされたオブジェクト/配列を "a.b.0.c" 形式のキーへフラット化 */
function flatten(
  obj: unknown,
  prefix: string,
  out: Record<string, string>,
): void {
  if (obj === null || obj === undefined) return;
  if (typeof obj === "string") {
    out[prefix] = obj;
    return;
  }
  if (typeof obj === "number" || typeof obj === "boolean") {
    out[prefix] = String(obj);
    return;
  }
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => flatten(v, `${prefix}.${i}`, out));
    return;
  }
  if (typeof obj === "object") {
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      flatten(v, prefix ? `${prefix}.${k}` : k, out);
    }
  }
}

async function main() {
  const backupDir = resolve(__dirname, "backup");
  mkdirSync(backupDir, { recursive: true });

  const all: Record<string, Record<string, unknown>> = {};

  for (const locale of LOCALES) {
    console.log(`── translations/${locale} 取得中 ──`);
    try {
      const data = await fetchTranslations(locale);
      all[locale] = data;
      const outPath = resolve(backupDir, `translations-${locale}.json`);
      writeFileSync(outPath, JSON.stringify(data, null, 2), "utf-8");
      console.log(`  ✓ 保存: ${outPath}`);
    } catch (e) {
      console.error(`  ✗ 取得失敗:`, e);
    }
  }

  console.log("\n" + "─".repeat(70));
  console.log("監査: 社労士関連・SAMURAI・旧住所・旧営業時間 を含むキー");
  console.log("─".repeat(70));

  for (const locale of LOCALES) {
    const data = all[locale];
    if (!data) continue;
    const flat: Record<string, string> = {};
    flatten(data, "", flat);

    const hits: { key: string; value: string; label: string }[] = [];
    for (const [key, value] of Object.entries(flat)) {
      for (const pat of AUDIT_PATTERNS) {
        if (pat.re.test(value)) {
          hits.push({ key, value, label: pat.label });
        }
      }
    }

    console.log(`\n[${locale}] ヒット ${hits.length} 件`);
    for (const h of hits) {
      console.log(`  ● ${h.key}  [${h.label}]`);
      console.log(`      現在値: ${JSON.stringify(h.value)}`);
    }
  }

  console.log("\n完了。書き込みは行っていません。");
}

main();
