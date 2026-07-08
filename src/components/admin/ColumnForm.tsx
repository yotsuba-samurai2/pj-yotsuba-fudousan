"use client";

import { useState } from "react";
import type {
  FirestoreColumn,
  ColumnTranslation,
  ColumnStatus,
} from "@/lib/firestore/columns";
import { auth } from "@/lib/firebase";
import { languages, type LangCode } from "@/config/languages";
import MarkdownEditor from "./MarkdownEditor";
import ColumnBody from "@/components/column/ColumnBody";

type Props = {
  initialData?: FirestoreColumn;
  onSubmit: (
    data: Omit<FirestoreColumn, "id" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  loading?: boolean;
};

const translationTabs = [
  { code: "en", label: "EN" },
  { code: "zh-tw", label: "繁體" },
  { code: "zh", label: "简体" },
] as const;

type TranslationLang = (typeof translationTabs)[number]["code"];

const BUSINESS_DOMAINS: Record<string, string> = {
  realestate: "luck428.com",
  legal: "luck428gyosei.com",
  labor: "yotsuba-labor.com",
};

const BUSINESS_NAMES: Record<string, Record<string, string>> = {
  realestate: {
    ja: "四葉不動産",
    en: "Yotsuba Real Estate",
    "zh-tw": "四葉不動產",
    zh: "四叶不动产",
  },
  legal: {
    ja: "四葉行政書士事務所",
    en: "Yotsuba Administrative Scrivener Office",
    "zh-tw": "四葉行政書士事務所",
    zh: "四叶行政书士事务所",
  },
  labor: {
    ja: "四葉社会保険労務士法人",
    en: "Yotsuba Labor & Social Insurance Office",
    "zh-tw": "四葉社會保險勞務士法人",
    zh: "四叶社会保险劳务士法人",
  },
};

const COLUMN_PATHS: Record<string, string> = {
  realestate: "/column",
  legal: "/legal/column",
  labor: "/labor/column",
};

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(
      /[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\u3400-\u4dbf\s-]/g,
      "",
    )
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export default function ColumnForm({
  initialData,
  onSubmit,
  loading: externalLoading,
}: Props) {
  // Basic fields
  const [status, setStatus] = useState<ColumnStatus>(
    initialData?.status ?? "draft",
  );
  const [business, setBusiness] = useState<FirestoreColumn["business"]>(
    initialData?.business ?? "realestate",
  );
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [date, setDate] = useState(
    initialData?.date ?? new Date().toISOString().slice(0, 10),
  );
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [locales, setLocales] = useState<LangCode[]>(
    initialData?.locales ?? languages.map((l) => l.code),
  );

  // Japanese content
  const [jaTitle, setJaTitle] = useState(initialData?.title ?? "");
  const [jaExcerpt, setJaExcerpt] = useState(initialData?.excerpt ?? "");
  const [jaContent, setJaContent] = useState(initialData?.content ?? "");

  // Translations
  const [enTrans, setEnTrans] = useState<ColumnTranslation>(
    initialData?.translations?.en ?? { title: "", excerpt: "", content: "" },
  );
  const [zhTwTrans, setZhTwTrans] = useState<ColumnTranslation>(
    initialData?.translations?.["zh-tw"] ?? {
      title: "",
      excerpt: "",
      content: "",
    },
  );
  const [zhTrans, setZhTrans] = useState<ColumnTranslation>(
    initialData?.translations?.zh ?? { title: "", excerpt: "", content: "" },
  );

  const [activeTranslation, setActiveTranslation] =
    useState<TranslationLang>("en");

  // Author
  const [authorName, setAuthorName] = useState(
    initialData?.author?.name ?? "浦松 丈二",
  );
  const [authorTitle, setAuthorTitle] = useState(
    initialData?.author?.title ?? "",
  );

  // SEO
  const [keywords, setKeywords] = useState(
    initialData?.keywords?.join(", ") ?? "",
  );
  const [tags, setTags] = useState(initialData?.tags?.join(", ") ?? "");

  // SEO generation
  const [generatingSeo, setGeneratingSeo] = useState(false);
  const [seoError, setSeoError] = useState("");

  // Translation generation
  const [translating, setTranslating] = useState(false);
  const [translateError, setTranslateError] = useState("");

  // Preview modal
  const [showColumnPreview, setShowColumnPreview] = useState(false);

  // State
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isLoading = saving || externalLoading;

  const toggleLocale = (code: LangCode) => {
    setLocales((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  };

  // --- Readiness checks ---
  const isJaContentReady =
    jaTitle.trim().length > 0 &&
    jaExcerpt.trim().length > 0 &&
    jaContent.trim().length > 0;

  const isSeoGenerateReady = isJaContentReady && category.trim().length > 0;

  const isSeoReady = keywords.trim().length > 0 && tags.trim().length > 0;

  const isTranslateReady =
    isJaContentReady && isSeoReady && category.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const parsedKeywords = keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
      const parsedTags = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const data: Omit<FirestoreColumn, "id" | "createdAt" | "updatedAt"> = {
        status,
        business,
        slug: slug || toSlug(jaTitle),
        date,
        category,
        locales,
        title: jaTitle,
        excerpt: jaExcerpt,
        content: jaContent,
        author: authorName
          ? { name: authorName, title: authorTitle }
          : undefined,
        keywords: parsedKeywords.length > 0 ? parsedKeywords : undefined,
        tags: parsedTags.length > 0 ? parsedTags : undefined,
        translations: {
          en: enTrans.title ? enTrans : undefined,
          "zh-tw": zhTwTrans.title ? zhTwTrans : undefined,
          zh: zhTrans.title ? zhTrans : undefined,
        },
      };

      await onSubmit(data);
    } catch {
      setError("保存に失敗しました");
      setSaving(false);
    }
  };

  const transMap: Record<
    string,
    [ColumnTranslation, (v: ColumnTranslation) => void]
  > = {
    en: [enTrans, setEnTrans],
    "zh-tw": [zhTwTrans, setZhTwTrans],
    zh: [zhTrans, setZhTrans],
  };

  const [activeTrans, setActiveTrans] = transMap[activeTranslation];

  // --- SEO Generation ---
  const handleGenerateSeo = async () => {
    setGeneratingSeo(true);
    setSeoError("");

    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/admin/generate-seo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          title: jaTitle,
          excerpt: jaExcerpt,
          content: jaContent,
          category,
          business,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "生成に失敗しました");
      }

      const result = await res.json();
      if (result.keywords) setKeywords(result.keywords.join(", "));
      if (result.tags) setTags(result.tags.join(", "));
    } catch (err) {
      setSeoError(err instanceof Error ? err.message : "生成に失敗しました");
    } finally {
      setGeneratingSeo(false);
    }
  };

  // --- Translation ---
  const handleTranslate = async () => {
    setTranslating(true);
    setTranslateError("");

    try {
      const parsedKeywords = keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
      const parsedTags = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/admin/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          title: jaTitle,
          excerpt: jaExcerpt,
          content: jaContent,
          category,
          keywords: parsedKeywords,
          tags: parsedTags,
          author: { name: authorName, title: authorTitle },
          targetLangs: ["en", "zh-tw", "zh"],
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "翻訳に失敗しました");
      }

      const { translations } = await res.json();

      if (translations.en) {
        setEnTrans({
          title: translations.en.title ?? "",
          excerpt: translations.en.excerpt ?? "",
          content: translations.en.content ?? "",
          category: translations.en.category,
          keywords: translations.en.keywords,
          tags: translations.en.tags,
          author: translations.en.author,
        });
      }
      if (translations["zh-tw"]) {
        setZhTwTrans({
          title: translations["zh-tw"].title ?? "",
          excerpt: translations["zh-tw"].excerpt ?? "",
          content: translations["zh-tw"].content ?? "",
          category: translations["zh-tw"].category,
          keywords: translations["zh-tw"].keywords,
          tags: translations["zh-tw"].tags,
          author: translations["zh-tw"].author,
        });
      }
      if (translations.zh) {
        setZhTrans({
          title: translations.zh.title ?? "",
          excerpt: translations.zh.excerpt ?? "",
          content: translations.zh.content ?? "",
          category: translations.zh.category,
          keywords: translations.zh.keywords,
          tags: translations.zh.tags,
          author: translations.zh.author,
        });
      }
    } catch (err) {
      setTranslateError(
        err instanceof Error ? err.message : "翻訳に失敗しました",
      );
    } finally {
      setTranslating(false);
    }
  };

  // --- Preview data ---
  const previewSlug = slug || toSlug(jaTitle) || "XXXX";
  const previewDomain = BUSINESS_DOMAINS[business];
  const previewPath = COLUMN_PATHS[business];
  const bizNames = BUSINESS_NAMES[business];

  const previews = [
    {
      lang: "日本語",
      title: jaTitle,
      excerpt: jaExcerpt,
      siteName: bizNames.ja,
      url: `https://${previewDomain}${previewPath}/${previewSlug}`,
    },
    {
      lang: "EN",
      title: enTrans.title,
      excerpt: enTrans.excerpt,
      siteName: bizNames.en,
      url: `https://${previewDomain}/en${previewPath}/${previewSlug}`,
    },
    {
      lang: "繁體",
      title: zhTwTrans.title,
      excerpt: zhTwTrans.excerpt,
      siteName: bizNames["zh-tw"],
      url: `https://${previewDomain}/zh-tw${previewPath}/${previewSlug}`,
    },
    {
      lang: "简体",
      title: zhTrans.title,
      excerpt: zhTrans.excerpt,
      siteName: bizNames.zh,
      url: `https://${previewDomain}/zh${previewPath}/${previewSlug}`,
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">
      {/* Basic fields */}
      <section className="rounded-xl border border-border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-text">基本情報</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-text">
              ステータス
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ColumnStatus)}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="draft">下書き</option>
              <option value="published">公開</option>
              <option value="deleted">削除</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text">
              事業
            </label>
            <select
              value={business}
              onChange={(e) =>
                setBusiness(e.target.value as FirestoreColumn["business"])
              }
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="realestate">不動産</option>
              <option value="legal">行政書士</option>
              <option value="labor">社労士</option>
            </select>
          </div>
          <Field
            label="スラッグ"
            value={slug}
            onChange={setSlug}
            required
            placeholder="auto-generated-if-empty"
            maxLength={200}
          />
          <Field
            label="日付"
            value={date}
            onChange={setDate}
            type="date"
            required
          />
          <Field
            label="カテゴリ"
            value={category}
            onChange={setCategory}
            required
            maxLength={150}
          />
        </div>
        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between">
            <label className="block text-sm font-medium text-text">
              公開する言語
            </label>
            {locales.length === 0 && (
              <span className="text-xs text-red-500">
                最低1言語は選択してください
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {languages.map((lang) => (
              <label
                key={lang.code}
                className="flex items-center gap-1.5 text-sm text-text"
              >
                <input
                  type="checkbox"
                  checked={locales.includes(lang.code)}
                  onChange={() => toggleLocale(lang.code)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                {lang.label}
              </label>
            ))}
          </div>
          <p className="mt-1 text-xs text-text-muted">
            チェックした言語の一覧・記事詳細にのみこのコラムが表示されます（未チェックの言語では404）。
          </p>
        </div>
      </section>

      {/* Japanese content */}
      <section className="rounded-xl border border-border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-text">
          日本語コンテンツ
        </h2>
        <div className="space-y-4">
          <Field
            label="タイトル"
            value={jaTitle}
            onChange={setJaTitle}
            required
            maxLength={300}
          />
          <Field
            label="概要"
            value={jaExcerpt}
            onChange={setJaExcerpt}
            textarea
            rows={4}
            maxLength={500}
          />
          <MarkdownEditor
            label="本文（Markdown対応）"
            value={jaContent}
            onChange={setJaContent}
            rows={16}
          />
        </div>
      </section>

      {/* Author (Japanese) */}
      <section className="rounded-xl border border-border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-text">著者</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="著者名"
            value={authorName}
            onChange={setAuthorName}
            maxLength={150}
          />
          <Field
            label="著者肩書き"
            value={authorTitle}
            onChange={setAuthorTitle}
            maxLength={200}
          />
        </div>
      </section>

      {/* SEO */}
      <section className="rounded-xl border border-border bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text">SEO</h2>
          <button
            type="button"
            onClick={handleGenerateSeo}
            disabled={!isSeoGenerateReady || generatingSeo || isLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:from-emerald-600 hover:to-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generatingSeo ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                生成中...
              </>
            ) : (
              "AI生成"
            )}
          </button>
        </div>
        {!isSeoGenerateReady && (
          <p className="mb-4 text-xs text-text-muted">
            カテゴリと日本語のタイトル・概要・本文を入力するとAI生成が有効になります
          </p>
        )}
        {seoError && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {seoError}
          </p>
        )}
        <div className="space-y-4">
          <Field
            label="キーワード（カンマ区切り）"
            value={keywords}
            onChange={setKeywords}
            maxLength={500}
          />
          <Field
            label="タグ（カンマ区切り）"
            value={tags}
            onChange={setTags}
            maxLength={500}
          />
        </div>
      </section>

      {/* Translation tabs */}
      <section className="rounded-xl border border-border bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text">翻訳</h2>
          <div className="flex items-center gap-2">
            {!isTranslateReady && (
              <p className="text-xs text-text-muted">
                日本語・SEO・カテゴリを入力すると有効
              </p>
            )}
            <button
              type="button"
              onClick={handleTranslate}
              disabled={!isTranslateReady || translating || isLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:from-blue-600 hover:to-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {translating ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  AI生成中...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m5 8 6 6" />
                    <path d="m4 14 6-6 2-3" />
                    <path d="M2 5h12" />
                    <path d="M7 2h1" />
                    <path d="m22 22-5-10-5 10" />
                    <path d="M14 18h6" />
                  </svg>
                  AI翻訳を生成
                </>
              )}
            </button>
          </div>
        </div>
        {translateError && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {translateError}
          </p>
        )}
        <div className="mb-4 flex gap-1 rounded-lg bg-surface-dim p-1">
          {translationTabs.map((tab) => (
            <button
              key={tab.code}
              type="button"
              onClick={() => setActiveTranslation(tab.code)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTranslation === tab.code
                  ? "bg-white text-primary shadow-sm"
                  : "text-text-muted hover:text-text"
              }`}
            >
              {tab.label}
              {transMap[tab.code]?.[0]?.title && (
                <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
              )}
            </button>
          ))}
        </div>
        {activeTrans && setActiveTrans && (
          <div className="space-y-4">
            <Field
              label="Title"
              value={activeTrans.title}
              onChange={(v) => setActiveTrans({ ...activeTrans, title: v })}
              maxLength={300}
            />
            <Field
              label="Excerpt"
              value={activeTrans.excerpt}
              onChange={(v) => setActiveTrans({ ...activeTrans, excerpt: v })}
              textarea
              rows={2}
              maxLength={500}
            />
            <MarkdownEditor
              label="Body (Markdown)"
              value={activeTrans.content}
              onChange={(v) => setActiveTrans({ ...activeTrans, content: v })}
              rows={16}
            />
            <Field
              label="Keywords（カンマ区切り）"
              value={activeTrans.keywords?.join(", ") ?? ""}
              onChange={(v) =>
                setActiveTrans({
                  ...activeTrans,
                  keywords: v
                    .split(",")
                    .map((k) => k.trim())
                    .filter(Boolean),
                })
              }
              maxLength={500}
            />
            <Field
              label="Tags（カンマ区切り）"
              value={activeTrans.tags?.join(", ") ?? ""}
              onChange={(v) =>
                setActiveTrans({
                  ...activeTrans,
                  tags: v
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                })
              }
              maxLength={500}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Author Name"
                value={activeTrans.author?.name ?? ""}
                onChange={(v) =>
                  setActiveTrans({
                    ...activeTrans,
                    author: {
                      name: v,
                      title: activeTrans.author?.title ?? "",
                    },
                  })
                }
                maxLength={150}
              />
              <Field
                label="Author Title"
                value={activeTrans.author?.title ?? ""}
                onChange={(v) =>
                  setActiveTrans({
                    ...activeTrans,
                    author: {
                      name: activeTrans.author?.name ?? "",
                      title: v,
                    },
                  })
                }
                maxLength={200}
              />
            </div>
          </div>
        )}
      </section>

      {/* Index Preview - always visible */}
      <section className="rounded-xl border border-border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-text">
          インデックスプレビュー
        </h2>
        <div className="space-y-3" style={{ fontFamily: "arial, sans-serif" }}>
          {previews.map((p) => (
            <div
              key={p.lang}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                {p.lang}
              </p>
              <div className="flex items-center gap-2">
                <img
                  src="/icon-512.png"
                  alt=""
                  className="h-[26px] w-[26px] rounded-full"
                />
                <div className="min-w-0">
                  <p className="truncate text-[14px] leading-tight text-[#202124]">
                    {p.siteName}
                  </p>
                  <p className="truncate text-[12px] leading-tight text-[#4d5156]">
                    {p.url}
                  </p>
                </div>
              </div>
              <h3 className="mt-1 text-[20px] font-normal leading-[1.3] text-[#1a0dab]">
                {p.title ? `${p.title} | ${p.siteName}` : "XXXX"}
              </h3>
              <p className="mt-0.5 line-clamp-2 text-[14px] leading-[1.58] text-[#4d5156]">
                {date && <span className="text-[#70757a]">{date} — </span>}
                {p.excerpt || "XXXX"}
              </p>
            </div>
          ))}
        </div>
      </section>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => setShowColumnPreview(true)}
          className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-text transition-colors hover:bg-surface-dim"
        >
          プレビュー
        </button>
        <button
          type="submit"
          disabled={isLoading || locales.length === 0}
          className="relative overflow-hidden rounded-lg px-6 py-2.5 text-sm font-semibold text-text transition-all duration-200 disabled:opacity-50"
        >
          <span
            className="pointer-events-none absolute inset-0 rounded-lg gradient-btn"
            aria-hidden="true"
          />
          <span className="relative">{isLoading ? "保存中..." : "保存"}</span>
        </button>
      </div>

      {/* Column Preview Modal */}
      {showColumnPreview && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-10 pb-10">
          <div className="w-full max-w-3xl rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                コラムプレビュー
              </h2>
              <button
                type="button"
                onClick={() => setShowColumnPreview(false)}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <div className="border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white px-6 pt-10 pb-8">
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">
                  {date.replace(/-/g, ".")}
                </span>
                <span className="rounded-full bg-gray-900 px-2.5 py-0.5 text-[10px] font-medium text-white">
                  {category || "カテゴリ"}
                </span>
              </div>
              <h1 className="mt-4 text-2xl font-bold leading-relaxed text-gray-900 sm:text-3xl">
                {jaTitle || "タイトル未入力"}
              </h1>
            </div>

            <div className="px-6 py-8">
              {authorName && (
                <div className="mb-8 flex items-center gap-4 border-b border-gray-100 pb-6">
                  <img
                    src="/uramatsu.png"
                    alt={authorName}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {authorName}
                    </p>
                    {authorTitle && (
                      <p className="text-xs text-gray-500">{authorTitle}</p>
                    )}
                  </div>
                </div>
              )}
              <ColumnBody content={jaContent || "本文未入力"} />
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

/* --- Reusable field component --- */

function Field({
  label,
  value,
  onChange,
  type = "text",
  textarea,
  rows,
  required,
  placeholder,
  className,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
  rows?: number;
  required?: boolean;
  placeholder?: string;
  className?: string;
  maxLength?: number;
}) {
  const inputClasses =
    "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary";

  return (
    <div className={className}>
      <div className="mb-1 flex items-center justify-between">
        <label className="block text-sm font-medium text-text">{label}</label>
        {maxLength && (
          <span
            className={`text-xs ${value.length > maxLength ? "text-red-500" : "text-text-muted"}`}
          >
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          required={required}
          placeholder={placeholder}
          maxLength={maxLength}
          className={inputClasses}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          maxLength={maxLength}
          className={inputClasses}
        />
      )}
    </div>
  );
}
