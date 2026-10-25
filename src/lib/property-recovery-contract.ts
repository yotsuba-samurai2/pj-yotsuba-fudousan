import { z } from "zod";
import { propertyHeldReceiptSchema } from "./property-write-contract";

export const propertyRecoveryRefSchema = z.object({ propertyId: z.uuid().transform(v => v.toLowerCase()), requestId: z.uuid().transform(v => v.toLowerCase()) }).strict();
export type PropertyRecoveryRef = z.infer<typeof propertyRecoveryRefSchema>;
export const propertyRecoveryCommandSchema = propertyRecoveryRefSchema.extend({ operation: z.enum(["status", "cache", "notification"]) }).strict();
export type PropertyRecoveryCommand = z.infer<typeof propertyRecoveryCommandSchema>;
const stage = z.object({ status: z.enum(["pending", "running", "acknowledged", "not_required", "blocked"]), attempts: z.number().int().min(0).max(6) }).strict();
export const propertyRecoverySummarySchema = z.object({ cache: stage, notification: stage, revision: z.number().int().nonnegative().safe(),
  resultVersion: z.iso.datetime({ precision: 3 }) }).strict();
export type PropertyRecoverySummary = z.infer<typeof propertyRecoverySummarySchema>;
export const propertyRecoveryResponseSchema = z.union([
  propertyRecoveryRefSchema.extend({ summary: propertyRecoverySummarySchema,
    outcome: z.enum(["status", "acknowledged", "not_required", "retry_ready", "unknown", "held"]), publication: z.literal("not_checked") }).strict(),
  propertyHeldReceiptSchema.extend({ outcome: z.literal("confirmed_held"), publication: z.literal("not_checked") }).strict(),
]);
