import { ColumnUpdateConflictError, isColumnUpdateTimestamp } from "@/lib/column-update-conflict";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, AuthError } from "@/lib/api-auth";
import {
  getColumnById,
  updateColumn,
  deleteColumn,
  type Column,
} from "@/lib/db/columns";
import { refreshColumnPublication, ColumnPublicationRefreshError } from "@/lib/column-publication-cache";

type Ctx = { params: Promise<{ id: string }> };

function handleError(err: unknown) {
  if (err instanceof ColumnUpdateConflictError) {
    return NextResponse.json({ error: err.message }, { status: 409 });
  }
  if (err instanceof ColumnPublicationRefreshError) {
    return NextResponse.json({ error: err.message, mutationSucceeded: true }, { status: 503 });
  }
  if (err instanceof AuthError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  console.error("Admin column API error:", err);
  return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
}

export async function GET(req: NextRequest, ctx: Ctx) {
  try {
    await verifyAdminRequest(req);
    const { id } = await ctx.params;
    const column = await getColumnById(id);
    if (!column) {
      return NextResponse.json({ error: "コラムが見つかりません" }, { status: 404 });
    }
    return NextResponse.json({ column });
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    await verifyAdminRequest(req);
    const { id } = await ctx.params;
    const expectedUpdatedAt = req.headers.get("X-Column-Updated-At");
    if (expectedUpdatedAt !== null && !isColumnUpdateTimestamp(expectedUpdatedAt)) {
      return NextResponse.json({ error: "更新日時の形式が正しくありません" }, { status: 400 });
    }
    const data = (await req.json()) as Partial<Column>;
    const existing = await getColumnById(id);
    if (!existing) {
      return NextResponse.json({ error: "コラムが見つかりません" }, { status: 404 });
    }
    if (expectedUpdatedAt !== null) await updateColumn(id, data, expectedUpdatedAt);
    else await updateColumn(id, data);
    await refreshColumnPublication([existing, {
      business: data.business ?? existing.business,
      slug: data.slug ?? existing.slug,
    }]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  try {
    await verifyAdminRequest(req);
    const { id } = await ctx.params;
    const existing = await getColumnById(id);
    if (!existing) {
      return NextResponse.json({ error: "コラムが見つかりません" }, { status: 404 });
    }
    await deleteColumn(id);
    await refreshColumnPublication([existing]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleError(err);
  }
}
