import { z } from "zod";

const hash = z.string().regex(/^[a-f0-9]{64}$/), ref = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$/);
const common = { requestId: z.uuid().transform(v => v.toLowerCase()), propertyId: z.uuid().transform(v => v.toLowerCase()), reviewRef: ref, reviewHash: hash };
export const mailReviewReferenceSchema = z.object({ propertyId: common.propertyId, reviewRef: ref, reviewHash: hash }).strict();
export type MailReviewReference = z.infer<typeof mailReviewReferenceSchema>;
export const mailReviewCommandSchema = z.discriminatedUnion("operation", [
  z.object({ ...common, operation: z.literal("register"), expectedRevision: z.literal(0) }).strict(),
  z.object({ ...common, operation: z.literal("revoke"), expectedRevision: z.number().int().positive().max(2147483646), expectedHeadHash: hash }).strict(),
]);
export type MailReviewCommand = z.infer<typeof mailReviewCommandSchema>;
export const mailReviewResultSchema = z.discriminatedUnion("status", [
  z.object({ status: z.literal("recorded"), requestId: z.uuid(), event: z.enum(["registered", "revoked", "already_revoked"]),
    revision: z.number().int().positive(), headHash: hash, replayed: z.boolean(), current: z.enum(["matches", "changed", "missing"]) }).strict(),
  z.object({ status: z.literal("held"), reason: z.enum(["INVALID_REQUEST", "PREPARED_REVIEW_UNAVAILABLE", "REVIEW_NOT_AUTHORIZED", "REVIEW_NOT_ELIGIBLE",
    "REVIEW_REFERENCE_EXISTS", "REVIEW_HEAD_CONFLICT", "REQUEST_CONFLICT", "RECEIPT_NOT_FOUND", "PROPERTY_NOT_FOUND", "AUTHORITY_EXPIRED"]) }).strict(),
  z.object({ status: z.literal("unknown"), reason: z.literal("STORE_OUTCOME_UNKNOWN") }).strict(),
]);
export type MailReviewResult = z.infer<typeof mailReviewResultSchema>;
export const mailReviewResponseSchema = mailReviewReferenceSchema.pick({ propertyId: true }).extend({ requestId: z.uuid(), result: mailReviewResultSchema }).strict();
export const mailReviewInspectionSchema = z.discriminatedUnion("status", [
  z.object({ status: z.literal("present"), revision: z.number().int().positive().max(2147483647), headHash: hash,
    reviewStatus: z.enum(["active", "revoked"]), expiresAt: z.iso.datetime({ precision: 3 }) }).strict(),
  z.object({ status: z.literal("unavailable") }).strict(),
]);
export type MailReviewInspection = z.infer<typeof mailReviewInspectionSchema>;
export const mailReviewInspectionResponseSchema = mailReviewReferenceSchema.extend({ result: mailReviewInspectionSchema }).strict();
