import { rentalPublicationError } from "@/lib/rental-import/publication";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, AuthError } from "@/lib/api-auth";
import {
  getProperties,
  createProperty,
  updatePropertyIfUnchanged,
  getPropertyBySlugAdmin,
  type PropertyStatus,
} from "@/lib/db/properties";
import { parsePropertyInput, bannedTermsError } from "@/lib/property-validation";
import {
  recordPropertyPublicationChange,
  scheduleDuePropertyNotifications,
} from "@/lib/property-publication-notify";

const STATUSES: PropertyStatus[] = ["draft", "published", "closed"];

function handleError(err: unknown) {
  if (err instanceof AuthError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  if (err && typeof err === "object" && "code" in err && err.code === "P2002") return NextResponse.json({ error: "同じ物件が登録されています。再確認してください" }, { status: 409 });
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
    const existing = req.nextUrl.searchParams.get("upsert") ? await getPropertyBySlugAdmin(parsed.data.slug) : undefined;
    const rentalError = rentalPublicationError(parsed.data, new Date(), existing ?? undefined);
    if (rentalError) return NextResponse.json({ error: rentalError }, { status: 400 });
    const banned = bannedTermsError(parsed.data);
    if (banned) {
      return NextResponse.json({ error: banned }, { status: 400 });
    }
    const now = new Date();
    if (req.nextUrl.searchParams.get("upsert")) {
      // Never use an unguarded upsert: an import may close/create this slug
      // between our read and write, including a competing sale/rental create.
      if (existing) {
        if (!existing.updatedAt || typeof body.expectedUpdatedAt !== "string" || body.expectedUpdatedAt !== existing.updatedAt) return NextResponse.json({ error: "物件が更新されています。最新の画面を開き直してください" }, { status: 409 });
        if (!existing.updatedAt || !await updatePropertyIfUnchanged(existing.slug, existing.updatedAt, parsed.data)) return NextResponse.json({ error: "同時更新を検出しました。再確認してください" }, { status: 409 });
        await recordPropertyPublicationChange(existing, parsed.data, now);
        scheduleDuePropertyNotifications(now);
        return NextResponse.json({ id: existing.id, created: false });
      }
      const id = await createProperty(parsed.data);
      await recordPropertyPublicationChange(null, parsed.data, now);
      scheduleDuePropertyNotifications(now);
      return NextResponse.json({ id, created: true });
    }
    const id = await createProperty(parsed.data);
    await recordPropertyPublicationChange(null, parsed.data, now);
    scheduleDuePropertyNotifications(now);
    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
