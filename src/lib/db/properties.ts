import { prisma } from "@/lib/prisma";
import { createPropertyRepository } from "./property-repository";

export type { AdminProperty, PropertyInput, PropertyStatus } from "@/lib/property-shared";

export const { getProperties, getPropertyById, getPropertyBySlugAdmin, createProperty, updateProperty,
  deleteProperty, upsertPropertyBySlug, updatePropertyIfUnchanged } = createPropertyRepository(prisma);
