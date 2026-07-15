import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, AuthError } from "@/lib/api-auth";
import {
  getColumns,
  createColumn,
  upsertColumnBySlug,
  type ColumnStatus,
} from "@/lib/db/columns";
import type { ColumnInput } from "@/lib/column-shared";

const STATUSES: ColumnStatus[] = ["draft", "published", "deleted"];

function handleError(err: unknown) {
  if (err instanceof AuthError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  console.error("Admin columns API error:", err);
  return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
}

/** コラム一覧（?business=&status=） */
export async function GET(req: NextRequest) {
  try {
    await verifyAdminRequest(req);
    const sp = req.nextUrl.searchParams;
    const business = sp.get("business") ?? undefined;
    const statusParam = sp.get("status");
    const status =
      statusParam && STATUSES.includes(statusParam as ColumnStatus)
        ? (statusParam as ColumnStatus)
        : undefined;
    const columns = await getColumns(business, status);
    return NextResponse.json({ columns });
  } catch (err) {
    return handleError(err);
  }
}

/** コラム作成。?upsert=1 で (business, slug) 基準の冪等upsert */
export async function POST(req: NextRequest) {
  try {
    await verifyAdminRequest(req);
    const body = (await req.json()) as ColumnInput;
    if (!body?.business || !body?.slug || !body?.title) {
      return NextResponse.json(
        { error: "business / slug / title は必須です" },
        { status: 400 },
      );
    }
    if (req.nextUrl.searchParams.get("upsert")) {
      const result = await upsertColumnBySlug(body.business, body.slug, body);
      return NextResponse.json(result);
    }
    const id = await createColumn(body);
    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
