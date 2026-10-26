import "server-only";
import { Prisma } from "@prisma/client";
import { z } from "zod";

/**
 * Private, one-ID reader using the caller's authorized client/transaction. No default connection.
 * Keep JSONB/BigInt as SQL text until the bounded source scanner checks numeric precision.
 * Never pass through AdminProperty or return this raw record to a public response/log.
 * Timestamp(3) without time zone is the existing Prisma UTC storage contract. Schema drift holds.
 */
export async function readPropertySourceRecord(db: Pick<Prisma.TransactionClient, "$queryRaw">, propertyId: string): Promise<string | null> {
  if (!z.uuid().safeParse(propertyId).success) return null;
  const rows = await db.$queryRaw<{ record_json: string | null }[]>(Prisma.sql`
    SELECT CASE WHEN
      to_jsonb(p) - ARRAY['id','slug','status','deal_type','category','trade_mode','title','price_yen','price_note',
        'location_text','access','spec','images','description','published_at','info_updated_at','next_update_at',
        'locales','translations','internal','created_at','updated_at']::text[] = '{}'::jsonb
      AND pg_typeof(p.created_at)::text = 'timestamp without time zone'
      AND pg_typeof(p.updated_at)::text = 'timestamp without time zone'
      AND isfinite(p.created_at) AND isfinite(p.updated_at)
      AND p.created_at >= TIMESTAMP '0001-01-01' AND p.created_at < TIMESTAMP '10000-01-01'
      AND p.updated_at >= TIMESTAMP '0001-01-01' AND p.updated_at < TIMESTAMP '10000-01-01'
      AND date_trunc('milliseconds',p.created_at) = p.created_at
      AND date_trunc('milliseconds',p.updated_at) = p.updated_at
    THEN jsonb_build_object(
      'id',p.id,'slug',p.slug,'status',p.status,'dealType',p.deal_type,'category',p.category,
      'tradeMode',p.trade_mode,'title',p.title,'priceYen',p.price_yen,'priceNote',p.price_note,
      'locationText',p.location_text,'access',p.access,'spec',p.spec,'images',p.images,
      'description',p.description,'publishedAt',p.published_at,'infoUpdatedAt',p.info_updated_at,
      'nextUpdateAt',p.next_update_at,'locales',p.locales,'translations',p.translations,'internal',p.internal,
      'createdAt',to_char(p.created_at,'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
      'updatedAt',to_char(p.updated_at,'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
    )::text ELSE NULL END AS record_json
    FROM public.properties p WHERE p.id=${propertyId.toLowerCase()}`);
  return rows.length === 1 && typeof rows[0].record_json === "string" ? rows[0].record_json : null;
}
