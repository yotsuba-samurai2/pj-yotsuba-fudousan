import type { AdminProperty } from "./property-shared";

/** Same identity rules for all statuses: a draft/closed unit must not reappear via a feed. */
export function registeredRentalIdentity(p: Pick<AdminProperty, "dealType" | "internal" | "title" | "locationText">) {
  if (p.dealType !== "rental") return null;
  const source = (p.internal?.rentalImport as { source?: { building?: string; address?: string; unit?: string } } | undefined)?.source;
  if (source?.building && source.address && source.unit) return { building: source.building, address: source.address, unit: source.unit };
  // Manual titles commonly use "建物名 205", without a 号室 suffix.
  // Do not read a floor, an embedded building number, or an unspecified unit as a room.
  const match = p.title.normalize("NFKC").trim().match(/^(.+?)\s+(\d+[A-EG-Za-eg-z]?)(?:号室)?$/);
  return match ? { building: match[1], unit: match[2], address: p.locationText } : null;
}
