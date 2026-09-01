import { describe, it, expect } from "vitest";
import { PERSON_JSONLD } from "@/lib/seo";

/**
 * 社会保険労務士の hasCredential の整合ガード。
 *
 * 【前提】2026-09-01 に登録（日付到来による自動登録）。同日「社会保険労務士試験合格」から
 * 「社会保険労務士」へ差し替えた。**登録番号の交付は9月下旬**のため、第1波では
 * identifier を出さない（プレースホルダーを本番に出さないことが優先）。
 *
 * 【守るもの】credentialCategory と identifier がちぐはぐになるのを防ぐ。
 * あわせて、資格（hasCredential）と役職（jobTitle）の**状態が食い違わない**ことを検査する。
 * 開業日には両方を同時に動かす必要があり、片方だけ動かすと
 * 「社労士として登録済みだが役職としては名乗っていない」中途半端な出力になる。
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

/**
 * 2026-09-01 反転。旧テストは「jobTitle に社会保険労務士が含まれない（開業まで役職として
 * 名乗らない）」を検査していた。開業日をもって前提が逆になったため、逆向きに検査する。
 * 開業前の状態へ戻すときは、hasCredential の credentialCategory も同時に戻すこと
 * （下の整合テストが片側だけの変更を落とす）。
 */
describe("開業後は jobTitle でも社労士を名乗る", () => {
  it("jobTitle に「四葉社会保険労務士事務所 代表社会保険労務士」が含まれる", () => {
    const titles = PERSON_JSONLD.jobTitle as readonly string[];
    expect(titles).toContain("四葉社会保険労務士事務所 代表社会保険労務士");
  });

  it("資格と役職の状態が一致している（登録済みなら役職でも名乗る／逆も同じ）", () => {
    const titles = PERSON_JSONLD.jobTitle as readonly string[];
    const registeredCredential = sr?.credentialCategory === REGISTERED_CATEGORY;
    const namedInJobTitle = titles.some((t) => t.includes("社会保険労務士"));
    expect(namedInJobTitle).toBe(registeredCredential);
  });
});

/**
 * 第1波（2026-09-01）＝資格名だけを出し、identifier は出さない。
 * 登録番号の交付は9月下旬。第2波でここに実数が入るまで、identifier は未設定が正。
 */
describe("登録番号の第1波／第2波", () => {
  it("identifier を出すなら、それは登録番号であって試験合格番号でもプレースホルダーでもない", () => {
    const id = sr?.identifier;
    if (id !== undefined) {
      expect(id).not.toContain(EXAM_NUMBER);
      expect(id).not.toContain("【登録番号】");
    }
  });
});
