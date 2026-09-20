import type { PropertyInput } from "@/lib/property-shared";
import { isRentalExpired } from "@/lib/property-shared";
import { isOwnedImage } from "./media";
import { rentalIdentity, rentalImportSchema, validateRentalImport } from "./validation";
/** Also enforce the import checks when the normal admin screen publishes a saved draft. */
export function rentalPublicationError(p: PropertyInput, now = new Date(), existing?: PropertyInput): string | null {
  const proof = p.internal?.rentalImport, oldProof = existing?.internal?.rentalImport;
  if (oldProof) {
    if (existing?.status === "closed" && p.status !== "closed") return "募集終了済み物件は通常の編集画面から再公開できません";
    if (!proof || p.dealType !== "rental" || p.slug !== existing?.slug) return "自動取込物件の識別情報・賃貸種別・確認記録は変更できません";
    const oldSource = rentalImportSchema.shape.source.safeParse((oldProof as Record<string, unknown>).source);
    const newSource = rentalImportSchema.shape.source.safeParse((proof as Record<string, unknown>).source);
    if (!oldSource.success || !newSource.success || rentalIdentity(oldSource.data) !== rentalIdentity(newSource.data)
      || oldSource.data.provider !== newSource.data.provider || oldSource.data.roomId !== newSource.data.roomId) return "自動取込物件の取得元・住所・建物・号室は変更できません";
  }
  if (proof) {
    const source = rentalImportSchema.shape.source.safeParse((proof as Record<string, unknown>).source);
    if (!source.success || p.dealType !== "rental" || p.slug !== `rent-${rentalIdentity(source.data)}`) return "自動取込物件のslugを確認記録の識別キーと一致させてください";
  }
  if (p.status !== "published" || p.dealType !== "rental") return null;
  if (isRentalExpired(p, now)) return "賃貸物件の募集状況を再確認してください（公開期限切れ）";
  if (!proof || typeof proof !== "object") return "賃貸物件の広告可・募集状況の確認記録がありません";
  const result = validateRentalImport({ ...proof, conflicts: [], property: p }, now, "published", !!oldProof);
  if (!result.ok) return result.reasons.join(" / ");
  if (p.priceYen !== result.property.priceYen) return "公開賃料をITANDI・REINSの高い方と一致させてください";
  if (p.spec.dealType === "rental" && result.property.spec.dealType === "rental") {
    for (const choice of result.value.conditionChoices ?? []) if (p.spec[choice.field] !== result.property.spec[choice.field]) return "公開条件を採用ルールで選択した原文と一致させてください";
  }
  if (p.spec.dealType === "rental" && result.property.spec.dealType === "rental" && Date.parse(p.spec.availabilityExpiresAt!) > Date.parse(result.property.spec.availabilityExpiresAt!)) return "公開期限が確認記録と一致しません";
  if (p.images.some((image) => !isOwnedImage(image.url, process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""))) return "写真と間取りを自社ストレージに保存してください";
  return null;
}
