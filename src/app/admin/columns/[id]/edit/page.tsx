"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ColumnForm from "@/components/admin/ColumnForm";
import {
  getColumnById,
  updateColumn,
  type FirestoreColumn,
} from "@/lib/firestore/columns";

export default function EditColumnPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [column, setColumn] = useState<FirestoreColumn | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getColumnById(id);
        if (!data) {
          setNotFound(true);
        } else {
          setColumn(data);
        }
      } catch (err) {
        console.error("Failed to fetch column:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="py-12 text-center">
        <p className="mb-4 text-text-muted">コラムが見つかりませんでした</p>
        <Link
          href="/admin/columns"
          className="text-sm text-primary hover:underline"
        >
          コラム一覧に戻る
        </Link>
      </div>
    );
  }

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
        <span className="text-sm font-medium text-text">編集</span>
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <ColumnForm
        initialData={column!}
        onSubmit={async (data) => {
          setError("");
          try {
            await updateColumn(id, data);
            router.push("/admin/columns");
          } catch (err) {
            console.error("Failed to update column:", err);
            setError("更新に失敗しました");
            throw err;
          }
        }}
      />
    </div>
  );
}
