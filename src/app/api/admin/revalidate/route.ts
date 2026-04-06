import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdminRequest, AuthError } from "@/lib/api-auth";

export async function POST(req: NextRequest) {
  try {
    await verifyAdminRequest(req);
    const { paths } = (await req.json()) as { paths: string[] };
    if (!Array.isArray(paths)) {
      return NextResponse.json({ error: "paths must be an array" }, { status: 400 });
    }
    for (const p of paths) {
      revalidatePath(p);
    }
    return NextResponse.json({ revalidated: paths });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Revalidate error:", err);
    return NextResponse.json({ error: "失敗しました" }, { status: 500 });
  }
}
