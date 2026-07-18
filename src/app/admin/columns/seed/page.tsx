"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createColumn } from "@/lib/admin-api";

const testColumn = {
  business: "realestate" as const,
  slug: "foreigners-guide-renting-tokyo",
  status: "draft" as const,
  title: "外国人が東京で部屋を借りるための完全ガイド",
  date: "2026-04-05",
  category: "賃貸",
  excerpt:
    "外国人が東京で賃貸物件を借りる際に知っておきたいポイントを、中国や台湾、タイでの駐在経験を持つ代表が解説します。",
  content: `東京で部屋を借りるのは、日本人にとっても大変なことです。外国人の方にとっては、言葉の壁や独特の商慣習が加わり、さらにハードルが高くなります。

まず知っておいていただきたいのは、日本の賃貸契約には「敷金」「礼金」「仲介手数料」「保証会社利用料」など、初期費用が家賃の4〜6ヶ月分かかるケースが多いということです。

四葉不動産では、外国人の方の住まい探しを専門的にサポートしています。代表自身が中国や台湾、タイでの海外生活を経験しており、外国人として家を探す大変さを身をもって知っています。

お部屋探しでお困りの方は、ぜひお気軽にご相談ください。日本語・英語・中国語（繁体/簡体）で対応いたします。`,
  keywords: ["外国人", "賃貸", "東京", "部屋探し", "多言語対応"],
  tags: ["外国人向け", "賃貸"],
  author: { name: "浦松 丈二", title: "代表取締役" },
  translations: {
    en: {
      title: "Complete Guide to Renting in Tokyo for Foreigners",
      excerpt:
        "Key points foreigners should know when renting in Tokyo, explained by our representative with experience living in 5 countries.",
      content: `Renting an apartment in Tokyo can be challenging even for Japanese people. For foreigners, the language barrier and unique business customs make it even more difficult.

First, you should know that Japanese rental contracts often require initial costs of 4-6 months' rent, including deposit, key money, agency fees, and guarantor company fees.

At Yotsuba Real Estate, we specialize in supporting foreigners in finding housing. Our representative has lived in 5 countries and personally understands the challenges of finding a home as a foreigner.

If you need help finding a place to live, please don't hesitate to contact us. We offer support in Japanese, English, and Chinese (Traditional/Simplified).`,
      category: "Rental",
      keywords: ["foreigner", "rental", "Tokyo", "apartment", "multilingual"],
    },
  },
};

export default function SeedPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [result, setResult] = useState("");
  const router = useRouter();

  const handleSeed = async () => {
    setStatus("loading");
    try {
      const id = await createColumn(testColumn);
      setResult(`作成完了: ${id}`);
      setStatus("done");
    } catch (err) {
      console.error(err);
      setResult(`エラー: ${err}`);
      setStatus("error");
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-lg font-bold">テストデータ投入</h1>
      <div className="max-w-lg rounded-xl border border-border bg-surface p-6">
        <p className="mb-2 text-sm text-text-muted">
          以下のテストコラムを1件作成します:
        </p>
        <div className="mb-4 space-y-1 rounded-lg bg-surface-dim p-4 text-xs">
          <p>
            <span className="font-medium text-text">事業:</span> 不動産
          </p>
          <p>
            <span className="font-medium text-text">タイトル:</span>{" "}
            {testColumn.title}
          </p>
          <p>
            <span className="font-medium text-text">スラッグ:</span>{" "}
            {testColumn.slug}
          </p>
          <p>
            <span className="font-medium text-text">カテゴリ:</span>{" "}
            {testColumn.category}
          </p>
          <p>
            <span className="font-medium text-text">日付:</span>{" "}
            {testColumn.date}
          </p>
          <p>
            <span className="font-medium text-text">翻訳:</span> en あり
          </p>
        </div>

        {status === "done" ? (
          <div className="space-y-3">
            <p className="text-sm font-medium text-green-600">{result}</p>
            <button
              onClick={() => router.push("/admin/columns")}
              className="relative overflow-hidden rounded-lg px-5 py-2 text-sm font-semibold text-text"
            >
              <span
                className="pointer-events-none absolute inset-0 rounded-lg gradient-btn"
                aria-hidden="true"
              />
              <span className="relative">コラム一覧へ</span>
            </button>
          </div>
        ) : status === "error" ? (
          <div className="space-y-3">
            <p className="text-sm text-red-600">{result}</p>
            <button
              onClick={handleSeed}
              className="rounded-lg border border-border bg-surface px-5 py-2 text-sm font-medium text-text hover:bg-surface-dim"
            >
              再試行
            </button>
          </div>
        ) : (
          <button
            onClick={handleSeed}
            disabled={status === "loading"}
            className="relative overflow-hidden rounded-lg px-5 py-2 text-sm font-semibold text-text disabled:opacity-50"
          >
            <span
              className="pointer-events-none absolute inset-0 rounded-lg gradient-btn"
              aria-hidden="true"
            />
            <span className="relative">
              {status === "loading" ? "作成中..." : "テストデータを作成"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
