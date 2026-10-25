import { z } from "zod";

// Browser/server boundary only. No database, credentials or environment defaults.
export const propertyWriteCommandSchema = z.object({
  operation: z.enum(["apply", "reconcile"]),
  propertyId: z.uuid().transform(v => v.toLowerCase()),
  requestId: z.uuid().transform(v => v.toLowerCase()),
  expectedUpdatedAt: z.iso.datetime({ precision: 3 }),
  patchJson: z.string().min(2).max(1_000_000),
}).strict();
export type PropertyWriteCommand = z.infer<typeof propertyWriteCommandSchema>;

const receipt = {
  requestId: z.uuid(), replayed: z.boolean(), resultVersion: z.iso.datetime({ precision: 3 }),
  resultHash: z.string().regex(/^[a-f0-9]{64}$/), current: z.enum(["matches", "changed", "missing"]),
};
export const propertyWriteResultSchema = z.union([
  z.object({ ...receipt, status: z.literal("applied"), reason: z.literal("SAVED") }).strict(),
  z.object({ ...receipt, status: z.literal("held"), reason: z.enum(["VERSION_CONFLICT", "INVALID_PROPERTY", "PUBLICATION_GATE_REJECTED"]) }).strict(),
  z.object({ status: z.literal("held"), reason: z.enum(["INVALID_REQUEST", "PROPERTY_NOT_FOUND", "REQUEST_ID_CONFLICT", "RECEIPT_INTEGRITY_ERROR"]) }).strict(),
  z.object({ status: z.literal("unknown"), reason: z.enum(["REQUEST_NOT_OBSERVED", "STORE_OUTCOME_UNKNOWN"]) }).strict(),
]);
export const propertyWriteResponseSchema = z.object({
  propertyId: z.uuid(), requestId: z.uuid(), result: propertyWriteResultSchema, publication: z.literal("not_checked"),
}).strict();
export type PropertyWriteResponse = z.infer<typeof propertyWriteResponseSchema>;

// Only an immutable held receipt is evidence that this request did not update the property.
// Missing/conflicting requests and effect-level holds are deliberately excluded.
export const propertyHeldReceiptSchema = z.object({
  propertyId: z.uuid(), requestId: z.uuid(), resultVersion: z.iso.datetime({ precision: 3 }),
  reason: z.enum(["VERSION_CONFLICT", "INVALID_PROPERTY", "PUBLICATION_GATE_REJECTED"]),
}).strict();
export type PropertyHeldReceipt = z.infer<typeof propertyHeldReceiptSchema>;
