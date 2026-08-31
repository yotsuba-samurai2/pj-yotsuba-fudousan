import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, AuthError } from "@/lib/api-auth";
import {
  getProperties,
  createProperty,
  upsertPropertyBySlug,
  type PropertyStatus,
} from "@/lib/db/properties";
import { parsePropertyInput, bannedTermsError } from "@/lib/property-validation";

const STATUSES: PropertyStatus[] = ["draft", "published", "closed"];

function handleError(err: unknown) {
  if (err instanceof AuthError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  console.error("Admin bukken API error:", err);
  return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
}

/** 物件一覧（?status=） */
export async function GET(req: NextRequest) {
  try {
    await verifyAdminRequest(req);
    const statusParam = req.nextUrl.searchParams.get("status");
    const status =
      statusParam && STATUSES.includes(statusParam as PropertyStatus)
        ? (statusParam as PropertyStatus)
        : undefined;
    const properties = await getProperties(status);
    return NextResponse.json({ properties });
  } catch (err) {
    return handleError(err);
  }
}

/** 物件作成。?upsert=1 で slug 基準の冪等upsert */
export async function POST(req: NextRequest) {
  try {
    await verifyAdminRequest(req);
    const body = await req.json();
    const parsed = parsePropertyInput(body);
    if (!parsed.ok) {
      return NextResponse.json(
        { error: `入力に不備があります: ${parsed.errors.join(" / ")}` },
        { status: 400 },
      );
    }
    const banned = bannedTermsError(parsed.data);
    if (banned) {
      return NextResponse.json({ error: banned }, { status: 400 });
    }
    if (req.nextUrl.searchParams.get("upsert")) {
      const result = await upsertPropertyBySlug(parsed.data.slug, parsed.data);
      return NextResponse.json(result);
    }
    const id = await createProperty(parsed.data);
    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
