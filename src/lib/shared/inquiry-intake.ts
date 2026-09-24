// クライアント安全：受付フォーム共通の定義（フォームとサーバーの両方が使う）。事務所名・宛先は置かない。
import { z } from "zod";
import { SOURCE_OPTIONS } from "./contact-intake";

/** 受付データの保存期間（浦松判断 2026-09-24）。サーバーは受付の保存時と管理画面の一覧表示時に、これを過ぎた受付を削除する。 */
export const INQUIRY_RETENTION_DAYS = 365;
/** 画面・自動返信に書く保存期間（INQUIRY_RETENTION_DAYS と一致させる。テストで確認）。 */
export const INQUIRY_RETENTION_LABEL_JA = "1年";
/** 迷惑投稿よけの隠し欄。人には見えない。値が入っていれば受け付けない。 */
export const HONEYPOT_FIELD = "hp_field";

const SOURCE_VALUES = new Set(SOURCE_OPTIONS.map(o => o.value));
export const text = (max: number) => z.string().trim().max(max, `${max}文字以内で入力してください`);

/** 連絡先（受付名・メール・電話）と、任意の「どこで知ったか」。メールか電話のどちらかは必須。 */
export const contactFieldsShape = {
  name: text(100).min(1, "お名前（受付名）を入力してください"),
  email: text(254),
  phone: text(30),
  source: text(20).refine(v => v === "" || SOURCE_VALUES.has(v), "選択肢から選んでください"),
};

const PHONE_PATTERN = /^[0-9０-９+＋\-－ー()（）\s]{6,30}$/;

/** 連絡先の組合せの検査。superRefine から呼ぶ（Zod のコンテキスト型に依存しないよう、指摘の一覧を返す）。 */
export function contactIssues(v: { email: string; phone: string }): { path: "email" | "phone"; message: string }[] {
  const issues: { path: "email" | "phone"; message: string }[] = [];
  if (!v.email && !v.phone) issues.push({ path: "email", message: "メールアドレスまたは電話番号を入力してください" });
  if (v.email && !z.email().safeParse(v.email).success) issues.push({ path: "email", message: "メールアドレスの形式を確認してください" });
  if (v.phone && !PHONE_PATTERN.test(v.phone)) issues.push({ path: "phone", message: "電話番号を確認してください" });
  return issues;
}
