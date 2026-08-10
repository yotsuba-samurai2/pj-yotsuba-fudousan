import { describe, it, expect } from "vitest";
import {
  REGISTRATION_NUMBER,
  IS_PLACEHOLDER,
  SR_LAUNCH_TRANSLATION_PATCHES,
  SR_LAUNCH_COLUMN_PATCHES,
  SR_LAUNCH_SCAN_TERMS,
  SR_LAUNCH_KEEP_AS_IS,
} from "@/lib/data/sr-launch-patches";
import type { LangCode } from "@/config/languages";

/**
 * 開業版パッチセットのガード。
 *
 * 9月1日は「REGISTRATION_NUMBER を1つ書き換えてボタンを押す」だけにしたい。
 * そのために、パッチ側の作りが崩れていないことをここで固定する。
 */

const LOCALES: LangCode[] = ["ja", "en", "zh-tw", "zh"];
const EXAM_NUMBER = "第202500525号";

describe("登録番号のプレースホルダー", () => {
  it("IS_PLACEHOLDER が REGISTRATION_NUMBER と整合している", () => {
    expect(IS_PLACEHOLDER).toBe(REGISTRATION_NUMBER.includes("【"));
  });

  it("試験合格番号を登録番号として使っていない", () => {
    expect(REGISTRATION_NUMBER).not.toContain(EXAM_NUMBER);
  });
});

describe("翻訳パッチ：4書体すべてが揃っている", () => {
  it.each(LOCALES)("%s のパッチが存在する", (loc) => {
    expect(SR_LAUNCH_TRANSLATION_PATCHES[loc]?.length ?? 0).toBeGreaterThan(0);
  });

  it("4言語とも同じキー集合を対象にしている（言語ごとの取りこぼしを防ぐ）", () => {
    const keySets = LOCALES.map((l) =>
      [...SR_LAUNCH_TRANSLATION_PATCHES[l].map((p) => p.path)].sort().join("|"),
    );
    expect(new Set(keySets).size).toBe(1);
  });

  it("from と to が同一のパッチがない（無意味な置換を作らない）", () => {
    for (const loc of LOCALES) {
      for (const p of SR_LAUNCH_TRANSLATION_PATCHES[loc]) {
        expect(p.from).not.toBe(p.to);
      }
    }
  });

  it("同一ロケール内で path が重複していない", () => {
    for (const loc of LOCALES) {
      const paths = SR_LAUNCH_TRANSLATION_PATCHES[loc].map((p) => p.path);
      expect(new Set(paths).size).toBe(paths.length);
    }
  });

  it("srExamNote は空文字にする（描画側が truthy 判定で非表示にする）", () => {
    for (const loc of LOCALES) {
      const p = SR_LAUNCH_TRANSLATION_PATCHES[loc].find(
        (x) => x.path === "representative.srExamNote",
      );
      expect(p?.to).toBe("");
    }
  });

  it("資格表記の to に社労士が入っている", () => {
    const SR: Record<string, string> = {
      ja: "社会保険労務士",
      en: "Certified Social Insurance and Labor Consultant",
      "zh-tw": "社會保險勞務士",
      zh: "社会保险劳务士",
    };
    for (const loc of LOCALES) {
      for (const key of [
        "representative.qualificationsRealestate",
        "representative.qualificationsLegal",
        "representative.qualificationsLabor",
      ]) {
        const p = SR_LAUNCH_TRANSLATION_PATCHES[loc].find((x) => x.path === key);
        expect(p?.to).toContain(SR[loc]);
      }
    }
  });

  it("社労士サイト（Labor）は社労士を先頭に出す", () => {
    const HEAD: Record<string, string> = {
      ja: "社会保険労務士・",
      en: "Certified Social Insurance and Labor Consultant,",
      "zh-tw": "社會保險勞務士・",
      zh: "社会保险劳务士・",
    };
    for (const loc of LOCALES) {
      const p = SR_LAUNCH_TRANSLATION_PATCHES[loc].find(
        (x) => x.path === "representative.qualificationsLabor",
      );
      expect(p?.to.startsWith(HEAD[loc])).toBe(true);
    }
  });
});

describe("コラムパッチ：適用順と網羅", () => {
  it("長い from が短い from より先に置かれている（前方が後方を包含しない）", () => {
    // 後ろのパッチの from が、前のパッチの from を部分文字列として含んでいたら
    // 前が先に食ってしまい、後ろが永久に一致しない。
    for (let i = 0; i < SR_LAUNCH_COLUMN_PATCHES.length; i++) {
      for (let j = i + 1; j < SR_LAUNCH_COLUMN_PATCHES.length; j++) {
        const earlier = SR_LAUNCH_COLUMN_PATCHES[i].from;
        const later = SR_LAUNCH_COLUMN_PATCHES[j].from;
        expect(
          later.includes(earlier),
          `#${j}「${later.slice(0, 30)}…」は #${i}「${earlier.slice(0, 30)}…」を含む。順序を入れ替えること`,
        ).toBe(false);
      }
    }
  });

  it("from が重複していない", () => {
    const froms = SR_LAUNCH_COLUMN_PATCHES.map((p) => p.from);
    expect(new Set(froms).size).toBe(froms.length);
  });

  it("4書体すべての一般形が含まれている", () => {
    const froms = SR_LAUNCH_COLUMN_PATCHES.map((p) => p.from).join("\n");
    expect(froms).toContain("社会保険労務士試験合格（2026年9月開業予定）");
    expect(froms).toContain("社會保險勞務士考試合格（預定2026年9月開業）");
    expect(froms).toContain("社会保险劳务士考试合格（预定2026年9月开业）");
    expect(froms.toLowerCase()).toContain("september 2026");
  });

  it("★語順違い（2026年9月開業預定）も拾える", () => {
    const froms = SR_LAUNCH_COLUMN_PATCHES.map((p) => p.from);
    expect(froms).toContain("社會保險勞務士考試合格（2026年9月開業預定）");
  });

  it("「お受けできません」を開業後の表現に置き換えている", () => {
    const p = SR_LAUNCH_COLUMN_PATCHES.find((x) =>
      x.from.includes("開業までお受けできません"),
    );
    expect(p).toBeDefined();
    expect(p?.to).not.toContain("お受けできません");
  });
});

describe("スキャン語と保護対象", () => {
  it("スキャン語に4書体が含まれている", () => {
    const t = SR_LAUNCH_SCAN_TERMS.join("\n");
    expect(t).toContain("2026年9月開業予定");
    expect(t).toContain("預定2026年9月開業");
    expect(t).toContain("预定2026年9月开业");
    expect(t.toLowerCase()).toContain("september 2026");
  });

  it("スキャン語にプレースホルダーが入っている（消し忘れ検出）", () => {
    expect(SR_LAUNCH_SCAN_TERMS).toContain("【登録番号】");
  });

  it("保護対象に経歴年表と試験合格番号が入っている", () => {
    const k = SR_LAUNCH_KEEP_AS_IS.join("\n");
    expect(k).toContain("令和7年10月 社会保険労務士試験合格");
    expect(k).toContain(EXAM_NUMBER);
  });

  it("保護対象の文字列を、コラムパッチの from が丸ごと壊さない", () => {
    // 「令和7年10月 社会保険労務士試験合格」は残す。
    // 一般形パッチ「社会保険労務士試験合格（2026年9月開業予定）」は括弧つきなので当たらない。
    const keep = "令和7年10月 社会保険労務士試験合格";
    for (const p of SR_LAUNCH_COLUMN_PATCHES) {
      expect(keep.includes(p.from)).toBe(false);
    }
  });
});

describe("labor.* の是正（2026-08-10 追加）", () => {
  const laborPatches = (loc: LangCode) =>
    SR_LAUNCH_TRANSLATION_PATCHES[loc].filter((p) => p.path.startsWith("labor."));

  it.each(LOCALES)("%s：labor.* のパッチが13件ある", (loc) => {
    expect(laborPatches(loc)).toHaveLength(13);
  });

  it.each(LOCALES)("%s：to 側に「法人」を残していない", (loc) => {
    for (const p of laborPatches(loc)) {
      for (const w of ["社会保険労務士法人", "社會保險勞務士法人", "社会保险劳务士法人", "社労士法人"]) {
        expect(p.to).not.toContain(w);
      }
    }
  });

  it.each(LOCALES)("%s：to 側に一括受任と読める語を残していない", (loc) => {
    for (const p of laborPatches(loc)) {
      for (const w of ["ワンストップ", "一括対応", "一気通貫", "一站式", "一條龍", "one-stop", "all-in-one"]) {
        expect(p.to.toLowerCase()).not.toContain(w.toLowerCase());
      }
    }
  });

  it.each(LOCALES)("%s：to 側に「法人化」「準備中」を残していない（法人化の予定はない）", (loc) => {
    for (const p of laborPatches(loc)) {
      for (const w of ["法人化", "設立準備中", "籌備中", "筹备中", "in preparation", "being established"]) {
        expect(p.to).not.toContain(w);
      }
    }
  });

  it("★ 事業体をまたぐ記述には分離受任の明示が入っている", () => {
    const MARK: Record<string, string> = {
      ja: "別の契約",
      en: "separate contract",
      "zh-tw": "另行簽約",
      zh: "另行签约",
    };
    for (const loc of LOCALES) {
      for (const key of ["labor.homePage.faq.1.answer", "labor.homePage.representativeBio2", "labor.aboutPage.representativeBio2"]) {
        const p = SR_LAUNCH_TRANSLATION_PATCHES[loc].find((x) => x.path === key);
        expect(p, `${loc} / ${key}`).toBeDefined();
        expect(p!.to, `${loc} / ${key}`).toContain(MARK[loc]);
      }
    }
  });

  it("★ 「四葉グループとして労務相談を承っている」と読める記述を残していない", () => {
    for (const loc of LOCALES) {
      for (const p of laborPatches(loc)) {
        expect(p.to).not.toContain("四葉グループとして");
        expect(p.to).not.toContain("under YOTSUBA GROUP");
        expect(p.to).not.toContain("作為四葉グループ");
        expect(p.to).not.toContain("作为四葉グループ");
      }
    }
  });

  it("meta.title / titleTemplate が事務所名になっている", () => {
    const NAME: Record<string, string> = {
      ja: "四葉社会保険労務士事務所",
      en: "四葉社会保険労務士事務所",
      "zh-tw": "四葉社會保險勞務士事務所",
      zh: "四葉社会保険労務士事務所",
    };
    for (const loc of LOCALES) {
      for (const key of ["labor.meta.title", "labor.meta.titleTemplate"]) {
        const p = SR_LAUNCH_TRANSLATION_PATCHES[loc].find((x) => x.path === key);
        expect(p?.to).toContain(NAME[loc]);
      }
    }
  });
});
