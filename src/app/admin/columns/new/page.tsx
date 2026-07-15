"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ColumnForm from "@/components/admin/ColumnForm";
import { createColumn, getAccessToken } from "@/lib/admin-api";

async function revalidateColumn(business: string, slug: string) {
  try {
    const token = await getAccessToken();
    const businessPath = business === "realestate" ? "" : `/${business}`;
    await fetch("/api/admin/revalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        paths: [
          `${businessPath}/column`,
          `${businessPath}/column/${slug}`,
          `${businessPath}/sitemap.xml`,
        ],
      }),
    });
  } catch (err) {
    console.error("Revalidation failed:", err);
  }
}

export default function NewColumnPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/admin/columns"
          className="text-sm text-text-muted hover:text-text"
        >
          コラム管理
        </Link>
        <span className="text-text-muted">/</span>
        <span className="text-sm font-medium text-text">新規作成</span>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <ColumnForm
        onSubmit={async (data) => {
          setError("");
          try {
            await createColumn(data);
            await revalidateColumn(data.business, data.slug);
            router.push("/admin/columns");
          } catch (err) {
            console.error("Failed to create column:", err);
            setError("作成に失敗しました");
            throw err;
          }
        }}
      />
    </div>
  );
}
