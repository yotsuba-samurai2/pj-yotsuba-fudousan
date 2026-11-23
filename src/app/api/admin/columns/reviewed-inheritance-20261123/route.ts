import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { AuthError, verifyAdminRequest } from "@/lib/api-auth";
import { getColumnBySlug, updateColumn } from "@/lib/db/columns";
import { ColumnUpdateConflictError, isColumnUpdateTimestamp } from "@/lib/column-update-conflict";
import { ColumnPublicationRefreshError, refreshColumnPublication } from "@/lib/column-publication-cache";
import { inspectInheritanceCorrection, type InheritanceTarget } from "@/lib/inheritance-correction";
import manifest from "@/lib/data/reviewed-inheritance-20261123.json";

const ALLOW = [
  ["legal", "souzoku-kaigai-gaikokuseki"],
  ["legal", "kaigai-honkon-singapore-souzokunin-isanbunkatsu-shomei"],
  ["legal", "chugoku-tairiku-souzokunin-shinzoku-koshosho-ryoji-ninsho"],
  ["realestate", "taiwan-souzoku-kanri-katsuyo"],
  ["realestate", "taiwan-souzoku-japan-fudosan"],
] as const;

const targets = manifest as InheritanceTarget[];
const digest = z.string().regex(/^[0-9a-f]{64}$/);
const requestSchema = z.strictObject({
  business: z.enum(["legal", "realestate"]),
  slug: z.string().max(100),
  expectedUpdatedAt: z.string().refine(isColumnUpdateTimestamp),
  originalFingerprint: digest,
  revisedFingerprint: digest,
});

function getTargets() {
  const selected = ALLOW.map(([business, slug]) =>
    targets.filter(target => target.business === business && target.slug === slug));
  if (targets.length !== ALLOW.length || selected.some(rows => rows.length !== 1))
    throw new Error("Invalid fixed inheritance correction manifest");
  return selected.map(([target]) => target);
}

const respond = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } });
const fail = (error: string, status: number) => respond({ error }, status);

function handle(err: unknown) {
  if (err instanceof AuthError) return fail(err.message, err.status);
  if (err instanceof ColumnUpdateConflictError) return fail(err.message, 409);
  if (err instanceof ColumnPublicationRefreshError)
    return respond({ error: err.message, mutationSucceeded: true }, 503);
  console.error("Fixed inheritance correction failed", err);
  return fail("訂正を処理できません。対象原稿を再確認してください。", 500);
}

export async function GET(req: NextRequest) {
  try {
    await verifyAdminRequest(req);
    const rows = await Promise.all(getTargets().map(async target => {
      const current = await getColumnBySlug(target.business, target.slug);
      return (await inspectInheritanceCorrection(current, target)).preview;
    }));
    return respond({ rows });
  } catch (err) {
    return handle(err);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await verifyAdminRequest(req);
    if (req.headers.get("origin") !== req.nextUrl.origin)
      return fail("訂正は同じサイトの管理画面から行ってください。", 403);
    const parsed = requestSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return fail("訂正確認の入力が正しくありません。", 400);
    const input = parsed.data;
    const target = getTargets().find(row => row.business === input.business && row.slug === input.slug);
    if (!target) return fail("今回の訂正対象ではありません。", 404);
    if (target.originalFingerprint !== input.originalFingerprint || target.revisedFingerprint !== input.revisedFingerprint)
      return fail("一覧で確認した指紋が一致しません。再取得してください。", 409);

    const current = await getColumnBySlug(target.business, target.slug);
    const { preview, patch } = await inspectInheritanceCorrection(current, target);
    if (preview.state === "unchanged") return respond({ outcome: "unchanged" });
    if (preview.state !== "ready" || !current || !patch) return fail(preview.reason, 409);
    if (preview.confirmation?.expectedUpdatedAt !== input.expectedUpdatedAt)
      return fail("確認後に記事が更新されました。差分を取り直してください。", 409);

    // No create/upsert/publish path. Immutable server material only; the version is also enforced in Prisma.
    await updateColumn(current.id, patch, input.expectedUpdatedAt);
    await refreshColumnPublication([current]);
    return respond({ outcome: "saved" });
  } catch (err) {
    return handle(err);
  }
}
