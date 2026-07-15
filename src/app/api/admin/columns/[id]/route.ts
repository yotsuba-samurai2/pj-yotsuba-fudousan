import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, AuthError } from "@/lib/api-auth";
import {
  getColumnById,
  updateColumn,
  deleteColumn,
  type Column,
} from "@/lib/db/columns";

type Ctx = { params: Promise<{ id: string }> };

function handleError(err: unknown) {
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
    const data = (await req.json()) as Partial<Column>;
    const existing = await getColumnById(id);
    if (!existing) {
      return NextResponse.json({ error: "コラムが見つかりません" }, { status: 404 });
    }
    await updateColumn(id, data);
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
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleError(err);
  }
}
