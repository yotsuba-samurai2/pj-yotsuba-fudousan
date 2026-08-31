"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PropertyForm from "@/components/admin/PropertyForm";
import { getBukkenById, updateBukken, getAccessToken } from "@/lib/admin-api";
import type { AdminProperty } from "@/lib/property-shared";

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

export default function EditBukkenPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [property, setProperty] = useState<AdminProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getBukkenById(params.id);
        if (!data) {
          setError("物件が見つかりません");
        } else {
          setProperty(data);
        }
      } catch (err) {
        console.error("Failed to load property:", err);
        setError("物件の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    })();
  }, [params.id]);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/bukken" className="text-sm text-text-muted hover:text-text">
          物件管理
        </Link>
        <span className="text-text-muted">/</span>
        <span className="text-sm font-medium text-text">編集</span>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      {loading ? (
        <div className="py-12 text-center">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        property && (
          <PropertyForm
            initialData={property}
            onSubmit={async (data) => {
              setError("");
              try {
                await updateBukken(property.id, data);
                await revalidateBukken(data.slug);
                router.push("/admin/bukken");
              } catch (err) {
                console.error("Failed to update property:", err);
                setError(err instanceof Error ? err.message : "更新に失敗しました");
                throw err;
              }
            }}
          />
        )
      )}
    </div>
  );
}
