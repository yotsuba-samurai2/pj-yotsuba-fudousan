// ペット住宅フォームのテスト用の合成データ（実在の人物・連絡先ではない）。
import type { PetOwnerFields, PetRenterFields } from "@/lib/shared/pet-intake";

export const renter: PetRenterFields = {
  name: "試験 太郎", email: "renter@example.com", phone: "", source: "",
  deal: "rent", area: "文京区", species: "cat", count: "3", dogSize: "", budget: "", layout: "",
  timing: "", schoolDistrict: "", arrival: "", consentShare: false, note: "",
};
export const owner: PetOwnerFields = {
  name: "試験 花子", email: "", phone: "03-0000-0000", source: "",
  propertyArea: "文京区小日向", propertyType: "house", consultation: "空室を犬猫可にできるか相談したい",
  address: "", builtYear: "", layout: "", floorArea: "", rent: "", vacancy: "", currentPolicy: "", acceptableAnimals: "",
};
