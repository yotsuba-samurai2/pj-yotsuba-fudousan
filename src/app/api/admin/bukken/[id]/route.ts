import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest, AuthError } from "@/lib/api-auth";
import {
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "@/lib/db/properties";
import { parsePropertyPatch, bannedTermsError } from "@/lib/property-validation";

type Ctx = { params: Promise<{ id: string }> };

function handleError(err: unknown) {
  if (err instanceof AuthError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  console.error("Admin bukken API error:", err);
  return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
}

export async function GET(req: NextRequest, ctx: Ctx) {
  try {
    await verifyAdminRequest(req);
    const { id } = await ctx.params;
    const property = await getPropertyById(id);
    if (!property) {
      return NextResponse.json({ error: "物件が見つかりません" }, { status: 404 });
    }
    return NextResponse.json({ property });
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    await verifyAdminRequest(req);
    const { id } = await ctx.params;
    const body = await req.json();
    const parsed = parsePropertyPatch(body);
    if (!parsed.ok) {
      return NextResponse.json(
        { error: `入力に不備があります: ${parsed.errors.join(" / ")}` },
        { status: 400 },
      );
    }
    const existing = await getPropertyById(id);
    if (!existing) {
      return NextResponse.json({ error: "物件が見つかりません" }, { status: 404 });
    }
    // 部分更新後の姿で禁止語ゲートを通す（statusだけ・本文だけの更新でもすり抜けさせない）
    const banned = bannedTermsError({
      status: parsed.data.status ?? existing.status,
      title: parsed.data.title ?? existing.title,
      description: parsed.data.description ?? existing.description,
      priceNote: parsed.data.priceNote ?? existing.priceNote,
    });
    if (banned) {
      return NextResponse.json({ error: banned }, { status: 400 });
    }
    await updateProperty(id, parsed.data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleError(err);
  }
}

/**
 * 削除は下書きのみ（誤登録の整理用）。公開済み・成約済みは履歴として残す
 * （公開面から消すのは status=closed の役割）。
 */
export async function DELETE(req: NextRequest, ctx: Ctx) {
  try {
    await verifyAdminRequest(req);
    const { id } = await ctx.params;
    const existing = await getPropertyById(id);
    if (!existing) {
      return NextResponse.json({ error: "物件が見つかりません" }, { status: 404 });
    }
    if (existing.status !== "draft") {
      return NextResponse.json(
        { error: "削除できるのは下書きのみです（公開済みは成約処理で非公開にします）" },
        { status: 400 },
      );
    }
    await deleteProperty(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleError(err);
  }
}
