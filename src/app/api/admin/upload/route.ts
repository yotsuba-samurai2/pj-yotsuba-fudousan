import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdminRequest, AuthError } from "@/lib/api-auth";

/**
 * コラム画像アップロード（設計書§4.5）。
 * service role クライアントで Supabase Storage の公開バケット
 * "column-images" へ保存し、公開URLを返す。
 */

const BUCKET = "column-images";

const EXT_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

function handleError(err: unknown) {
  if (err instanceof AuthError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  console.error("Admin upload API error:", err);
  return NextResponse.json({ error: "アップロードに失敗しました" }, { status: 500 });
}

export async function POST(req: NextRequest) {
  try {
    await verifyAdminRequest(req);

    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "fileは必須です" }, { status: 400 });
    }

    const ext = EXT_MAP[file.type];
    if (!ext) {
      return NextResponse.json(
        { error: "対応していない画像形式です (jpg/png/webp/gif/svg)" },
        { status: 400 },
      );
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "ファイルサイズは10MB以下にしてください" },
        { status: 400 },
      );
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceRoleKey) {
      return NextResponse.json(
        { error: "ストレージ設定が不足しています" },
        { status: 500 },
      );
    }

    const supabase = createClient(url, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const yyyymm = new Date().toISOString().slice(0, 7).replace("-", "");
    const path = `columns/${yyyymm}/${crypto.randomUUID()}.${ext}`;
    const bytes = new Uint8Array(await file.arrayBuffer());

    const { error } = await supabase.storage.from(BUCKET).upload(path, bytes, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });
    if (error) {
      console.error("Supabase Storage upload error:", error);
      return NextResponse.json({ error: "アップロードに失敗しました" }, { status: 500 });
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl });
  } catch (err) {
    return handleError(err);
  }
}
