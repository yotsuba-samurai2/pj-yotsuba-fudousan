// ペット横断 指示書 版2.0 第12・18章：ペット住宅フォームの項目定義・検証・計測パラメータ
import { describe, expect, it } from "vitest";
import { INQUIRY_RETENTION_DAYS, INQUIRY_RETENTION_LABEL_JA } from "@/lib/shared/inquiry-intake";
import {
  petFormGaParams, petOwnerRows, petOwnerSchema, petRenterRows, petRenterSchema, PET_OWNER_CATEGORY, PET_RENTER_CATEGORY,
} from "@/lib/shared/pet-intake";
import { owner, renter } from "./pet-intake-fixtures";

describe("借り手フォームの検証", () => {
  it("必須項目がそろえば通る（未定も選べる）", () => {
    expect(petRenterSchema.safeParse(renter).success).toBe(true);
    expect(petRenterSchema.safeParse({ ...renter, deal: "undecided", species: "undecided", count: "undecided" }).success).toBe(true);
  });

  it.each([["name", ""], ["area", ""], ["deal", ""], ["species", ""], ["count", ""]])("%s が空なら通らない", (key, value) => {
    const result = petRenterSchema.safeParse({ ...renter, [key]: value });
    expect(result.success).toBe(false);
  });

  it("メールと電話の両方が空なら通らない（どちらか一方でよい）", () => {
    expect(petRenterSchema.safeParse({ ...renter, email: "" }).success).toBe(false);
    expect(petRenterSchema.safeParse({ ...renter, email: "", phone: "090-0000-0000" }).success).toBe(true);
    expect(petRenterSchema.safeParse({ ...renter, email: "not-an-email" }).success).toBe(false);
  });

  it("未知の項目・長すぎる入力・選択肢外の値は受け付けない", () => {
    expect(petRenterSchema.safeParse({ ...renter, business: "legal" }).success).toBe(false);
    expect(petRenterSchema.safeParse({ ...renter, note: "あ".repeat(2001) }).success).toBe(false);
    expect(petRenterSchema.safeParse({ ...renter, species: "hamster" }).success).toBe(false);
    expect(petRenterSchema.safeParse({ ...renter, source: "unknown-source" }).success).toBe(false);
  });

  it("他事業者への共有の同意は、明示しない限り「同意なし」として扱われる", () => {
    expect(petRenterRows(renter).find(r => r.label === "四葉行政書士事務所への共有")?.value).toBe("同意なし（共有しない）");
    expect(petRenterRows({ ...renter, consentShare: true }).find(r => r.label === "四葉行政書士事務所への共有")?.value).toBe("同意あり");
  });
});

describe("大家フォームの検証", () => {
  it("電話だけでも受け付ける", () => {
    expect(petOwnerSchema.safeParse(owner).success).toBe(true);
  });

  it.each([["propertyArea", ""], ["propertyType", ""], ["consultation", ""]])("%s が空なら通らない", (key, value) => {
    expect(petOwnerSchema.safeParse({ ...owner, [key]: value }).success).toBe(false);
  });

  it("選択肢は表示用の日本語に置き換え、未入力は「未入力」と表示する", () => {
    const rows = petOwnerRows(owner);
    expect(rows.find(r => r.label === "物件の種別")?.value).toBe("戸建て");
    expect(rows.find(r => r.label === "空室状況")?.value).toBe("未入力");
  });
});

describe("計測と保存期間", () => {
  it("GA4 に送るのは固定の値だけ（入力値を含まない）", () => {
    expect(petFormGaParams(PET_RENTER_CATEGORY)).toEqual({ business: "realestate", form_id: "pet_housing_renter", page: "pet_housing" });
    expect(petFormGaParams(PET_OWNER_CATEGORY)).toEqual({ business: "realestate", form_id: "pet_housing_owner", page: "pet_housing" });
  });

  it("画面に書く保存期間（1年）と、削除に使う日数（365日）が一致する", () => {
    expect(INQUIRY_RETENTION_DAYS).toBe(365);
    expect(INQUIRY_RETENTION_LABEL_JA).toBe("1年");
  });
});
