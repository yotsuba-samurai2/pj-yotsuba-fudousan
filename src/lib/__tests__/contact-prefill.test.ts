import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  CONTACT_PREFILL_STORAGE_KEY,
  CONTACT_PREFILL_TTL_MS,
  takeContactPrefill,
  writeContactPrefill,
  type PrefillStore,
} from "@/lib/shared/contact-prefill";
import {
  WAKEARI_CHECKLIST,
  WAKEARI_CHECKLIST_MESSAGE_FOOTER,
  WAKEARI_CHECKLIST_NONE,
  WAKEARI_CHECKLIST_RESERVATION,
  WAKEARI_CONTACT_INTENT,
  buildWakeariChecklistMessage,
  computeWakeariChecklistResult,
} from "@/lib/wakeari";

/**
 * 2026-09-24 不具合：/wakeari の出口チェックリストで6問に答えて「この内容で相談する（無料）」を押すと、
 * 問い合わせフォームの「ご相談内容」が空のまま（カテゴリだけ入る）＝回答がすべて消えていた。
 * 回答の要約をフォームへ1回だけ渡す仕組み（contact-prefill）と、その本文の番人。
 */
function memoryStore(): PrefillStore & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (k) => (data.has(k) ? data.get(k)! : null),
    setItem: (k, v) => void data.set(k, String(v)),
    removeItem: (k) => void data.delete(k),
  };
}

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), "utf8");

describe("contact-prefill（フォームへの本文の受け渡し）", () => {
  it("書いた本文を、同じ intent で1回だけ受け取れる（読んだら消える）", () => {
    const store = memoryStore();
    expect(writeContactPrefill("wakeari", "本文", store, 1000)).toBe(true);
    expect(takeContactPrefill("wakeari", store, 2000)).toBe("本文");
    expect(store.data.has(CONTACT_PREFILL_STORAGE_KEY)).toBe(false);
    expect(takeContactPrefill("wakeari", store, 3000)).toBeNull();
  });

  it("intent が違えば渡さず、下書きも残す（別の送り元の下書きを横取りしない）", () => {
    const store = memoryStore();
    writeContactPrefill("wakeari", "本文", store, 1000);
    expect(takeContactPrefill("akiya", store, 2000)).toBeNull();
    expect(takeContactPrefill("wakeari", store, 2000)).toBe("本文");
  });

  it("期限切れ・壊れた値は渡さずに消す", () => {
    const store = memoryStore();
    writeContactPrefill("wakeari", "本文", store, 0);
    expect(takeContactPrefill("wakeari", store, CONTACT_PREFILL_TTL_MS + 1)).toBeNull();
    expect(store.data.size).toBe(0);
    store.setItem(CONTACT_PREFILL_STORAGE_KEY, "{壊れた");
    expect(takeContactPrefill("wakeari", store, 0)).toBeNull();
    expect(store.data.size).toBe(0);
  });

  it("ストレージが使えないとき（プライベートブラウズ等）は何もしない", () => {
    expect(writeContactPrefill("wakeari", "本文", null)).toBe(false);
    expect(takeContactPrefill("wakeari", null)).toBeNull();
    const throwing: PrefillStore = {
      getItem: () => {
        throw new Error("denied");
      },
      setItem: () => {
        throw new Error("denied");
      },
      removeItem: () => {
        throw new Error("denied");
      },
    };
    expect(writeContactPrefill("wakeari", "本文", throwing)).toBe(false);
    expect(takeContactPrefill("wakeari", throwing)).toBeNull();
  });
});

describe("出口チェックリスト → フォームの本文", () => {
  const allFirst = Object.fromEntries(WAKEARI_CHECKLIST.map((q) => [q.id, q.options[0].value]));

  it("6問の設問と選んだ答え・画面の出口と書類・留保文（固定）・記入欄の案内がそのまま入る", () => {
    const msg = buildWakeariChecklistMessage(allFirst);
    const r = computeWakeariChecklistResult(allFirst);
    WAKEARI_CHECKLIST.forEach((q, i) => expect(msg).toContain(`Q${i + 1}. ${q.question}：${q.options[0].label}`));
    for (const e of r.exits) expect(msg).toContain(`・${e}`);
    for (const d of r.docs) expect(msg).toContain(`・${d}`);
    expect(msg).toContain(`※${WAKEARI_CHECKLIST_RESERVATION}`);
    expect(msg.endsWith(WAKEARI_CHECKLIST_MESSAGE_FOOTER)).toBe(true);
    expect(msg).toContain(`（${WAKEARI_CHECKLIST.length}／${WAKEARI_CHECKLIST.length}問）`);
  });

  it("未回答の設問は「未回答」、1問も答えていなければ本文なし（カテゴリだけ渡す）", () => {
    const one = { [WAKEARI_CHECKLIST[0].id]: WAKEARI_CHECKLIST[0].options[0].value };
    const msg = buildWakeariChecklistMessage(one);
    expect(msg).toContain(`Q2. ${WAKEARI_CHECKLIST[1].question}：未回答`);
    expect(buildWakeariChecklistMessage({})).toBe("");
  });

  it("どの条件にも当たらなければ、画面と同じ「該当なし」の文言が入る", () => {
    // 各設問で出口を増やさない選択肢を探して全問に答える（無ければこの検査は成り立たないので失敗させる）
    const quiet = Object.fromEntries(
      WAKEARI_CHECKLIST.map((q) => [q.id, (q.options.find((o) => !o.exits?.length) ?? q.options[0]).value]),
    );
    const r = computeWakeariChecklistResult(quiet);
    expect(r.none).toBe(true);
    expect(r.exits).toEqual(WAKEARI_CHECKLIST_NONE.exits);
    const msg = buildWakeariChecklistMessage(quiet);
    for (const e of WAKEARI_CHECKLIST_NONE.exits) expect(msg).toContain(`・${e}`);
  });

  it("本文に判断・禁止語を足さない", () => {
    const msg = buildWakeariChecklistMessage(allFirst);
    expect(msg).not.toMatch(/ワンストップ|一括|一気通貫|高価買取|必ず売れ|提携/);
  });

  it("配線：CTA を押した時だけ要約を渡し、回答を URL に載せない。フォームは intent 一致で受け取る", () => {
    const checklist = read("src/components/wakeari/WakeariExitChecklist.tsx");
    expect(checklist).toContain("writeContactPrefill(WAKEARI_CONTACT_INTENT, buildWakeariChecklistMessage(answers))");
    expect(checklist).toContain("onClick={onConsult}");
    expect(checklist).toContain("href={WAKEARI_CONTACT_HREF}");
    expect(WAKEARI_CONTACT_INTENT).toBe("wakeari");
    const form = read("src/components/ui/ContactForm.tsx");
    expect(form).toContain("const prefill = takeContactPrefill(intent);");
    expect(form).toContain("setMessage((m) => m || prefill)");
  });
});
