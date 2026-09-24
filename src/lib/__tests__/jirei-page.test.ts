// /jirei（相談事例＝モデルケース）の番人（2026-09-24・モデルケース⑥の追加時に新設）。
// 本ページは実績紹介ではない。事例を足したときに、回答ブロック・description の件数や、
// 実績と誤読させない書き方の約束（ページ冒頭のコメント）がずれないよう機械で固定する。
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const SRC = fs.readFileSync(path.join(process.cwd(), "src/app/[locale]/(realestate)/jirei/page.tsx"), "utf8");
// コメント行（禁止語の一覧そのものを含む）を除いた、画面・メタデータに出る側
const CODE = SRC.split("\n")
  .filter((l) => !/^\s*(\/\/|\{\/\*)/.test(l))
  .join("\n");
const caseIds = [...CODE.matchAll(/\bid: "(case-[a-z0-9-]+)"/g)].map((m) => m[1]);
const titles = [...CODE.matchAll(/\btitle: "(モデルケース[^"]+)"/g)].map((m) => m[1]);
const bodies = [...CODE.matchAll(/\bbody: "([^"]+)"/g)].map((m) => m[1]);
const CIRCLED = "①②③④⑤⑥⑦⑧⑨";

describe("/jirei モデルケース", () => {
  it("事例の数と、回答ブロック・description に書いた件数が一致する", () => {
    const n = caseIds.length;
    expect(n).toBe(6);
    expect(new Set(caseIds).size).toBe(n);
    expect([...CODE.matchAll(/の([0-9]+)つについて/g)].map((m) => Number(m[1]))).toEqual([n]);
    expect([...CODE.matchAll(/の([0-9]+)例。/g)].map((m) => Number(m[1]))).toEqual([n]);
  });

  it("見出しは「モデルケース」＋丸数字の連番で始まる（実績と誤読させない）", () => {
    expect(titles).toHaveLength(caseIds.length);
    titles.forEach((t, i) => expect(t.startsWith(`モデルケース${CIRCLED[i]}`)).toBe(true));
  });

  it("冒頭注記と各事例末尾の注記は確定文言のまま", () => {
    expect(CODE).toContain(
      "本ページの事例は、実際のご相談を想定したモデルケース（想定される相談の流れ）です。特定の実在のお客様・取引を紹介するものではありません。",
    );
    expect(CODE).toContain('const CASE_NOTE = "※モデルケースです";');
  });

  it("本文は想定形（完了形の事例談を書かない）で、どの事例にも分離受任と紹介料の明示がある", () => {
    expect(bodies.length).toBeGreaterThan(0);
    for (const b of bodies) expect(b).not.toMatch(/ました/);
    expect(CODE.split("当社が紹介料を受け取ることはありません").length - 1).toBe(caseIds.length);
  });

  it("業務の一体提供を示唆する語を、本文・メタデータに使わない", () => {
    expect(CODE).not.toMatch(/ワンストップ|一体で|一括|まとめて|一気通貫|シームレス/);
  });
});
