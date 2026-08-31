"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PropertyForm from "@/components/admin/PropertyForm";
import { createBukken, getAccessToken } from "@/lib/admin-api";

async function revalidateBukken(slug: string) {
  try {
    const token = await getAccessToken();
    await fetch("/api/admin/revalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        paths: ["/bukken", `/bukken/${slug}`, "/sitemap.xml"],
      }),
    });
  } catch (err) {
    console.error("Revalidation failed:", err);
  }
}

export default function NewBukkenPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/bukken" className="text-sm text-text-muted hover:text-text">
          物件管理
        </Link>
        <span className="text-text-muted">/</span>
        <span className="text-sm font-medium text-text">新規登録</span>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <PropertyForm
        onSubmit={async (data) => {
          setError("");
          try {
            await createBukken(data);
            await revalidateBukken(data.slug);
            router.push("/admin/bukken");
          } catch (err) {
            console.error("Failed to create property:", err);
            setError(err instanceof Error ? err.message : "登録に失敗しました");
            throw err;
          }
        }}
      />
    </div>
  );
}
