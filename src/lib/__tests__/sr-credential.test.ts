import { describe, it, expect } from "vitest";
import { PERSON_JSONLD } from "@/lib/seo";

/**
 * 社会保険労務士の hasCredential の整合ガード。
 *
 * 【前提】2026-08-09 浦松判断により、社労士の hasCredential は**外さない**。
 * 「社会保険労務士試験合格」として出力し続ける。
 *
 * 【守るもの】9月1日の差し替えで credentialCategory と identifier が
 * ちぐはぐになるのを防ぐ。
 *
 *   第202500525号は **試験合格番号であって登録番号ではない**。
 *   登録番号と同じ形の欄に同じ形の番号が入っているため取り違えやすい。
 *
 * 片方だけ変えると次の不整合が生まれる。どちらもこのテストで落ちる。
 *   ✗ 社会保険労務士        ／ 令和7年 第202500525号（試験合格番号のまま）
 *   ✗ 社会保険労務士試験合格 ／ 第【登録番号】号（登録番号なのに試験合格と表示）
 */

const EXAM_NUMBER = "第202500525号";
const EXAM_CATEGORY = "社会保険労務士試験合格";
const REGISTERED_CATEGORY = "社会保険労務士";

type Credential = {
  "@type": string;
  credentialCategory: string;
  identifier?: string;
  recognizedBy?: { "@type": string; name: string; url?: string };
};

const CREDENTIALS = PERSON_JSONLD.hasCredential as readonly Credential[];
const sr = CREDENTIALS.find((c) => c.credentialCategory.includes("社会保険労務士"));

describe("社労士 hasCredential：試験合格と登録の取り違えを防ぐ", () => {
  it("社労士のエントリが1件だけ存在する（2026-08-09 浦松判断で残す）", () => {
    const all = CREDENTIALS.filter((c) =>
      c.credentialCategory.includes("社会保険労務士"),
    );
    expect(all).toHaveLength(1);
  });

  it("試験合格番号を出すなら credentialCategory は「試験合格」でなければならない", () => {
    if (sr?.identifier?.includes(EXAM_NUMBER)) {
      expect(sr.credentialCategory).toBe(EXAM_CATEGORY);
    }
  });

  it("credentialCategory が「社会保険労務士」（登録済み）なら、識別子に試験合格番号を使わない", () => {
    if (sr?.credentialCategory === REGISTERED_CATEGORY) {
      expect(sr.identifier ?? "").not.toContain(EXAM_NUMBER);
    }
  });

  it("登録済みとして出すなら recognizedBy に全国社会保険労務士会連合会を付ける", () => {
    if (sr?.credentialCategory === REGISTERED_CATEGORY) {
      expect(sr.recognizedBy?.name).toBe("全国社会保険労務士会連合会");
    }
  });

  it("試験合格の段階では recognizedBy を付けない（登録資格と区別する）", () => {
    if (sr?.credentialCategory === EXAM_CATEGORY) {
      expect(sr.recognizedBy).toBeUndefined();
    }
  });

  it("プレースホルダーが本番に残っていない", () => {
    expect(sr?.identifier ?? "").not.toContain("【登録番号】");
  });
});

describe("他2資格は登録済みとして正しく出ている", () => {
  it("行政書士＝第25087022号・日本行政書士会連合会", () => {
    const c = CREDENTIALS.find((x) => x.credentialCategory === "行政書士");
    expect(c?.identifier).toBe("第25087022号");
    expect(c?.recognizedBy?.name).toBe("日本行政書士会連合会");
  });

  it("宅地建物取引士＝（東京）第293544号", () => {
    const c = CREDENTIALS.find((x) => x.credentialCategory === "宅地建物取引士");
    expect(c?.identifier).toBe("（東京）第293544号");
  });
});

describe("jobTitle には社労士を入れない（開業まで役職として名乗らない）", () => {
  it("jobTitle に社会保険労務士が含まれない", () => {
    const titles = PERSON_JSONLD.jobTitle as readonly string[];
    expect(titles.some((t) => t.includes("社会保険労務士"))).toBe(false);
  });
});
