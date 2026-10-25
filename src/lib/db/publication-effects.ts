import { Prisma, type PrismaClient } from "@prisma/client";
import type { AdminProperty } from "../property-shared";
import { planPublicationEffects, verifyEffectRecord, type EffectRecord, type PublicationEffectStore } from "../property-publication-effects";

/** Called inside the same transaction as the property and immutable write receipt. */
export async function enqueuePublicationEffects(tx: Prisma.TransactionClient, requestId: string, before: AdminProperty, after: AdminProperty, actorRef: string) {
  const record = planPublicationEffects(requestId, before, after, new Date(), actorRef);
  await tx.$executeRaw(Prisma.sql`INSERT INTO public.property_publication_effects (request_id,plan,plan_hash,state,revision)
    VALUES (${requestId}::uuid,${JSON.stringify(record.plan)}::jsonb,${record.planHash},${JSON.stringify(record.state)}::jsonb,0)`);
}

/** No production singleton. Only effect state/revision is writable; properties and receipt history are read-only here. */
export function createPublicationEffectStore(prisma: Pick<PrismaClient, "$transaction">): PublicationEffectStore {
  return { async change(ref, run) {
    return prisma.$transaction(async tx => {
      const rows = await tx.$queryRaw<Array<{ plan: EffectRecord["plan"]; plan_hash: string; state: EffectRecord["state"]; revision: number; result_version: Date; outcome: string }>>(
        Prisma.sql`SELECT e.plan,e.plan_hash,e.state,e.revision,r.result_version,r.outcome
          FROM public.property_publication_effects e JOIN public.property_write_receipts r ON r.request_id=e.request_id
          WHERE e.request_id=${ref.requestId}::uuid AND r.property_id=${ref.propertyId} FOR UPDATE OF e`);
      if (rows.length > 1) throw new Error("INVALID_EFFECT_ROWS");
      let record: EffectRecord | null = null;
      if (rows.length) {
        const row = rows[0]; record = verifyEffectRecord({ plan: row.plan, planHash: row.plan_hash, state: row.state, revision: row.revision });
        if (!record || row.outcome !== "applied" || !(row.result_version instanceof Date) || row.result_version.toISOString() !== record.plan.resultVersion ||
          record.plan.requestId !== ref.requestId || record.plan.propertyId !== ref.propertyId) throw new Error("INVALID_EFFECT_BINDING");
      }
      const result = run(record);
      if (result.state) {
        if (!record || !verifyEffectRecord({ ...record, state: result.state, revision: record.revision + 1 })) throw new Error("INVALID_EFFECT_TRANSITION");
        const changed = await tx.$executeRaw(Prisma.sql`UPDATE public.property_publication_effects SET state=${JSON.stringify(result.state)}::jsonb,revision=revision+1
          WHERE request_id=${ref.requestId}::uuid AND revision=${record.revision}`);
        if (changed !== 1) throw new Error("EFFECT_VERSION_CONFLICT");
      }
      return result.value;
    }, { maxWait: 3000, timeout: 8000 });
  } };
}
