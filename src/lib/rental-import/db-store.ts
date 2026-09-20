import { createProperty, getPropertyBySlugAdmin, updatePropertyIfUnchanged } from "@/lib/db/properties";
import type { RentalStore } from "./lifecycle";
export const rentalStore: RentalStore = {
  get: getPropertyBySlugAdmin,
  async create(input) { await createProperty(input); },
  update: updatePropertyIfUnchanged,
};
