import type { PropertyInput } from "@/lib/property-shared";
import { isRentalExpired } from "@/lib/property-shared";
import { validateRentalImport } from "./validation";
/** Also enforce the import checks when the normal admin screen publishes a saved draft. */
export function rentalPublicationError(p: PropertyInput, now = new Date()): string | null {
  if (p.status !== "published" || p.dealType !== "rental") return null;
  if (isRentalExpired(p, now)) return "賃貸物件の募集状況を再確認してください（公開期限切れ）";
  const proof = p.internal?.rentalImport;
  if (!proof || typeof proof !== "object") return "賃貸物件の広告可・募集状況の確認記録がありません";
  const result = validateRentalImport({ ...proof, conflicts: [], property: p }, now, "published", true);
  if (!result.ok) return result.reasons.join(" / ");
  if (p.spec.dealType === "rental" && result.property.spec.dealType === "rental") {
    for (const choice of result.value.conditionChoices ?? []) if (p.spec[choice.field] !== result.property.spec[choice.field]) return "公開条件を採用ルールで選択した原文と一致させてください";
  }
  if (p.spec.dealType === "rental" && result.property.spec.dealType === "rental" && Date.parse(p.spec.availabilityExpiresAt!) > Date.parse(result.property.spec.availabilityExpiresAt!)) return "公開期限が確認記録と一致しません";
  return null;
}
