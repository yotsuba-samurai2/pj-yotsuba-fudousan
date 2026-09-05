import { describe, it, expect, vi, afterEach } from "vitest";

/**
 * sr-label（社労士の表示文言の正本）の開業前／開業後ガード。
 *
 * 2026-09-05 月次点検（INIT-02／NEW-SR-1〜4）で、社労士 2026-09-01 開業後も
 * 「開業（2026年9月予定）前」「office opening scheduled for September 2026」等が
 * 静的ページに直書きで残っていた。文言を sr-label.ts に集約したうえで、
 * 開業後（NEXT_PUBLIC_SR_LAUNCHED=true）の各文に開業前の語が残らないことをここで固定する。
 *
 * SR_LAUNCHED はモジュール読込時に env を評価する const なので、
 * vi.stubEnv ＋ vi.resetModules ＋ 動的 import で両状態を読む（indexnow.test.ts の stubEnv 流儀）。
 * vitest.config.ts は .env を読まないため、未設定＝開業前がテストの既定。
 */

type SrLabelModule = typeof import("@/lib/shared/sr-label");

async function loadSrLabel(launched: boolean): Promise<SrLabelModule> {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_SR_LAUNCHED", launched ? "true" : undefined);
  return await import("@/lib/shared/sr-label");
}

/** モジュールが公開する文字列を（ネストを含めて）すべて平坦に集める */
function collectStrings(value: unknown, path: string, out: Array<[string, string]>): void {
  if (typeof value === "string") {
    out.push([path, value]);
    return;
  }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      collectStrings(v, `${path}.${k}`, out);
    }
  }
}

function allStrings(mod: SrLabelModule): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  collectStrings(
    {
      SR_ENTITY_LABEL: mod.SR_ENTITY_LABEL,
      SR_ROLE_SENTENCE: mod.SR_ROLE_SENTENCE,
      SR_BIO: mod.SR_BIO,
      SR_ENTITY_LABEL_I18N: mod.SR_ENTITY_LABEL_I18N,
      SR_ROLE_SENTENCE_I18N: mod.SR_ROLE_SENTENCE_I18N,
    },
    "",
    out,
  );
  return out;
}

/** 開業後に残ってはいけない語（4書体） */
const PRE_LAUNCH_MARKS = ["開業予定", "2026年9月", "未開業", "September 2026", "尚未開業", "开业后", "開業後"];

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("開業後（NEXT_PUBLIC_SR_LAUNCHED=true）", () => {
  it("公開する全文字列に開業前の語が残らない", async () => {
    const mod = await loadSrLabel(true);
    const strings = allStrings(mod);
    expect(strings.length).toBeGreaterThan(10);
    for (const [path, s] of strings) {
      for (const mark of PRE_LAUNCH_MARKS) {
        expect(s, `${path} に「${mark}」が残っている`).not.toContain(mark);
      }
    }
  });

  it("gaikokujinKoyo：事務所名が入り、別契約が明示される", async () => {
    const { SR_ROLE_SENTENCE } = await loadSrLabel(true);
    expect(SR_ROLE_SENTENCE.gaikokujinKoyo).toContain("四葉社会保険労務士事務所");
    expect(SR_ROLE_SENTENCE.gaikokujinKoyo).toContain("別契約");
    // li の末尾に「（→ リンク）」が続くため句点で終えない
    expect(SR_ROLE_SENTENCE.gaikokujinKoyo.endsWith("。")).toBe(false);
  });

  it("global：4書体とも別契約（分離受任）を明示し、「提携／partner／合作」を書かない", async () => {
    const { SR_ROLE_SENTENCE_I18N } = await loadSrLabel(true);
    const g = SR_ROLE_SENTENCE_I18N.global;
    expect(g.ja).toContain("別契約");
    expect(g.en).toContain("separate contract");
    expect(g.zhTw).toContain("另行簽約");
    expect(g.zh).toContain("另行签约");
    for (const s of [g.ja, g.en, g.zhTw, g.zh]) {
      expect(s).not.toContain("提携");
      expect(s).not.toContain("partner");
      expect(s).not.toContain("合作");
    }
  });

  it("一体提供を示唆する語を含まない", async () => {
    const mod = await loadSrLabel(true);
    for (const [path, s] of allStrings(mod)) {
      for (const w of ["ワンストップ", "一括対応", "まとめて", "一気通貫", "一站式", "一條龍", "one-stop"]) {
        expect(s, `${path}`).not.toContain(w);
      }
    }
  });
});

describe("開業前（env 未設定）", () => {
  it("gaikokujinKoyo：2026-09-05 以前の直書き文と一字一句同じ（ローカル描画の退行防止）", async () => {
    const { SR_ROLE_SENTENCE } = await loadSrLabel(false);
    expect(SR_ROLE_SENTENCE.gaikokujinKoyo).toBe(
      "社会保険労務士業務は代表の開業（2026年9月予定）前のため、現時点ではお受けできません",
    );
  });

  it("global：4書体とも開業前の注記が入る", async () => {
    const { SR_ROLE_SENTENCE_I18N } = await loadSrLabel(false);
    const g = SR_ROLE_SENTENCE_I18N.global;
    expect(g.ja).toContain("開業（2026年9月予定）前");
    expect(g.en).toContain("September 2026");
    expect(g.zhTw).toContain("預定2026年9月");
    expect(g.zh).toContain("预定2026年9月");
  });

  it("既存キー（kaigo/shataku/jirei・SR_BIO）は開業前表記のまま", async () => {
    const { SR_ROLE_SENTENCE, SR_BIO } = await loadSrLabel(false);
    expect(SR_ROLE_SENTENCE.kaigo).toContain("開業後は");
    expect(SR_ROLE_SENTENCE.shataku).toContain("開業後");
    expect(SR_ROLE_SENTENCE.jirei).toContain("開業後に");
    expect(SR_BIO.en).toContain("September 2026");
  });
});
