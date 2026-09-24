// ペット横断 指示書 版2.0 第4〜9章：ペット調査の取込画面（2026-09-24 浦松指示「ペット調査はやってください」）
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

// 初期描画では通信しない（読み込みは描画後の useEffect）。Supabase のクライアントを読み込まないよう差し替える
vi.mock("@/lib/admin-api", () => ({ getAccessToken: vi.fn(async () => "test-token") }));

import RentalSurveyAdmin from "@/app/admin/bukken/rental-survey/page";

const appDir = resolve(__dirname, "../../app");
const source = (path: string) => readFileSync(resolve(appDir, path), "utf8");

describe("ペット調査の取込画面", () => {
  const html = renderToStaticMarkup(createElement(RentalSurveyAdmin));

  it("見出しと4つの操作（現状・投入・確定・巻き戻し）を出す", () => {
    for (const text of ["ペット調査（文京区・居住用賃貸・多頭飼育／大型犬）", "現在の状態", "バッチの投入（1媒体・1回の取得）", "確定（4媒体がそろった週）", "確定の履歴・巻き戻し"])
      expect(html).toContain(text);
    expect(html).toMatch(/<input[^>]*type="file"[^>]*accept="\.json,application\/json"/);
  });

  it("注記：対象の定義・AI で「可」を確定しない・独自集計として公表・REINS は同席時のみ・4媒体7日", () => {
    for (const text of [
      "「ペット相談」だけの記載は対象にしません",
      "学区のデータには触れません",
      "AI の判定だけで「可」を確定しません",
      "媒体名を出さない当社の独自集計として /pet-housing に表示されます",
      "個別の物件はここから公開されません",
      "観測期間7日以内にそろう必要があります",
      "REINS は浦松が同席したときだけ操作します",
    ]) expect(html).toContain(text);
  });

  it("物件管理の一覧から、学区別の募集一覧の隣にリンクする", () => {
    const list = source("admin/bukken/page.tsx");
    const school = list.indexOf('href="/admin/bukken/school-rentals"');
    const pet = list.indexOf('href="/admin/bukken/rental-survey"');
    expect(school).toBeGreaterThan(-1);
    expect(pet).toBeGreaterThan(school);
    expect(list.slice(school, pet).split("\n")).toHaveLength(2);
  });

  it("ブラウザ側で許諾台帳・DB を読まない（保存・確定・許諾の判定は管理APIだけが行う）", () => {
    const page = source("admin/bukken/rental-survey/page.tsx");
    expect(page).toMatch(/^"use client";/);
    expect(page).not.toMatch(/rental-survey\/(permissions|store|finalize)|@\/lib\/prisma|DATA_USE_LEDGER/);
  });
});
