import { getProperties } from "@/lib/db/properties";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { verifyAdminRequest, AuthError } from "@/lib/api-auth";
import { closeRental, closureSchema, importRental } from "@/lib/rental-import/lifecycle";
import { validateRentalImport } from "@/lib/rental-import/validation";
import { rentalStore } from "@/lib/rental-import/db-store";
import { inspectImage, isOwnedImage } from "@/lib/rental-import/media";

export const runtime = "nodejs";
export async function POST(req: NextRequest) {
  try {
    await verifyAdminRequest(req);
    const now = new Date();
    if (req.headers.get("content-type")?.startsWith("multipart/form-data")) {
      const form = await req.formData(), file = form.get("file");
      if (!(file instanceof File) || file.size > 10 * 1024 * 1024) return NextResponse.json({ error: "画像は10MB以下にしてください" }, { status: 400 });
      const record = JSON.parse(String(form.get("record")));
      const mode = form.get("mode") === "published" ? "published" : "draft";
      const maintenance = form.get("maintenance") === "true";
      const gate = validateRentalImport(record, now, mode, maintenance);
      if (!gate.ok) return NextResponse.json({ error: gate.reasons.join(" / ") }, { status: 422 });
      const allowed = await importRental(record, { ...rentalStore, create: async () => {}, update: async () => true }, now, mode, maintenance);
      if (allowed.action === "held") return NextResponse.json({ error: allowed.reasons?.join(" / ") }, { status: 409 });
      const bytes = new Uint8Array(await file.arrayBuffer()), media = inspectImage(bytes);
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!url || !key) return NextResponse.json({ error: "ストレージの設定が不足しています" }, { status: 503 });
      const storage = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }).storage.from("column-images");
      const path = `bukken/auto/${gate.property.slug}/${media.hash}.${media.ext}`;
      const { error } = await storage.upload(path, bytes, { contentType: media.contentType, cacheControl: "31536000", upsert: true });
      if (error) return NextResponse.json({ error: "画像保存に失敗しました" }, { status: 502 });
      return NextResponse.json({ url: storage.getPublicUrl(path).data.publicUrl });
    }
    const raw = await req.text();
    if (raw.length > 2_000_000) return NextResponse.json({ error: "取込データが大きすぎます" }, { status: 413 });
    const body = JSON.parse(raw);
    if (!["check", "apply", "close", "check-close"].includes(body.action) || !["draft", "published"].includes(body.mode) || typeof body.maintenance !== "boolean") return NextResponse.json({ error: "取込方法が不正です" }, { status: 400 });
    if (body.action === "check-close") {
      const parsed = closureSchema.safeParse(body.record);
      if (!parsed.success) return NextResponse.json({ action: "held", reasons: ["掲載終了確認の形式が不正です"] });
      const result = await closeRental(body.record, { ...rentalStore, update: async () => true }, now);
      return NextResponse.json({ ...result, action: result.action === "closed" ? "ready" : result.action });
    }
    if (body.action === "check") {
      const result = await importRental(body.record, { ...rentalStore, create: async () => {}, update: async () => true }, now, body.mode, body.maintenance);
      return NextResponse.json({ ...result, action: ["created", "updated"].includes(result.action) ? "ready" : result.action });
    }
    if (body.action === "apply") {
      const gate = validateRentalImport(body.record, now, body.mode, body.maintenance);
      if (!gate.ok) return NextResponse.json({ action: "held", reasons: gate.reasons });
      if (gate.property.images.some((i) => !isOwnedImage(i.url, process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""))) return NextResponse.json({ action: "held", reasons: ["写真と間取りを自社ストレージに保存してください"] });
    }
    const result = body.action === "close" ? await closeRental(body.record, rentalStore, now) : await importRental(body.record, rentalStore, now, body.mode, body.maintenance);
    if (result.slug && ["created", "updated", "closed"].includes(result.action)) {
      for (const locale of ["ja", "en", "zh-tw", "zh"]) {
        revalidatePath(`/${locale}/bukken`);
        revalidatePath(`/${locale}/bukken/${result.slug}`);
      }
      revalidatePath("/sitemap.xml");
    }
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    if (err instanceof SyntaxError) return NextResponse.json({ error: "JSONの形式が不正です" }, { status: 400 });
    // Do not leak source documents, credentials or database internals in errors.
    return NextResponse.json({ error: "処理に失敗しました。入力・画像・接続設定を確認してください" }, { status: 500 });
  }
}

/** Export managed records for rechecking, including emails outside the current intake window. */
export async function GET(req: NextRequest) {
  try {
    await verifyAdminRequest(req);
    const properties = await getProperties();
    return NextResponse.json({ listings: properties.filter((p) => p.dealType === "rental" && p.internal?.rentalImport).map((p) => ({ slug: p.slug, status: p.status, evidence: p.internal!.rentalImport, property: p })) }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    if (err instanceof AuthError) return NextResponse.json({ error: err.message }, { status: err.status });
    return NextResponse.json({ error: "監視対象を取得できませんでした" }, { status: 500 });
  }
}
