// A-2 テナント色切替 — route group で --color-primary 群を割り当てる
// @theme（A-1）で定義した --brand-<tenant>(-dark/-tint) を、テナントに応じて --color-primary(-dark/-tint) に流し込む。
// 共通部品は色分岐を持たず --color-primary を読むだけ＝この1枚でサイト全体の主色が切り替わる。
// CSSカスタムプロパティはDOMを継承するので、fixed/absolute な子（LinkaFab・MobileStickyBar）にも効く。
import type { CSSProperties } from "react";
import type { BusinessKey } from "@/lib/shared/office";

/** テナント→CSS変数（style に spread して使う） */
export function tenantThemeVars(businessKey: BusinessKey): CSSProperties {
  return {
    ["--color-primary" as string]: `var(--brand-${businessKey})`,
    ["--color-primary-dark" as string]: `var(--brand-${businessKey}-dark)`,
    ["--color-primary-tint" as string]: `var(--brand-${businessKey}-tint)`,
  } as CSSProperties;
}

/** ブランド色を直接参照したい時（クロスリンクの相手先カード等）用のヘルパ */
export function brandVar(businessKey: BusinessKey): string {
  return `var(--brand-${businessKey})`;
}
export function brandTintVar(businessKey: BusinessKey): string {
  return `var(--brand-${businessKey}-tint)`;
}
