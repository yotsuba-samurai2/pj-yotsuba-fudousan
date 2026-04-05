"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getTranslations,
  saveTranslations,
} from "@/lib/firestore/translations";
import type { LangCode } from "@/config/languages";

import jaData from "@/locales/ja.json";
import enData from "@/locales/en.json";
import zhTwData from "@/locales/zh-tw.json";
import zhData from "@/locales/zh.json";

/* ─── Constants ─── */

const staticFallbacks: Record<LangCode, Record<string, unknown>> = {
  ja: jaData as Record<string, unknown>,
  en: enData as Record<string, unknown>,
  "zh-tw": zhTwData as Record<string, unknown>,
  zh: zhData as Record<string, unknown>,
};

const locales: { code: LangCode; label: string }[] = [
  { code: "ja", label: "ja" },
  { code: "en", label: "en" },
  { code: "zh-tw", label: "zh-tw" },
  { code: "zh", label: "zh" },
];

const sections = [
  { key: "common", label: "共通（ナビ・フッター等）" },
  { key: "brand", label: "ブランド情報" },
  { key: "address", label: "住所・所在地" },
  { key: "representative", label: "代表者情報" },
  { key: "languages", label: "言語名" },
  { key: "realestate", label: "不動産ページ" },
  { key: "legal", label: "行政書士ページ" },
  { key: "labor", label: "社労士ページ" },
  { key: "contact", label: "お問い合わせページ" },
  { key: "thanks", label: "送信完了ページ" },
  { key: "privacyPolicy", label: "プライバシーポリシー" },
  { key: "terms", label: "利用規約" },
  { key: "legalNotice", label: "特定商取引法" },
  { key: "breadcrumbs", label: "パンくずリスト" },
] as const;

type SectionKey = (typeof sections)[number]["key"];

/* ─── Helpers ─── */

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function setNestedValue(
  obj: Record<string, unknown>,
  path: string,
  value: unknown,
): Record<string, unknown> {
  const clone = deepClone(obj);
  const keys = path.split(".");
  let current: Record<string, unknown> = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    if (
      current[keys[i]] === undefined ||
      typeof current[keys[i]] !== "object" ||
      current[keys[i]] === null
    ) {
      current[keys[i]] = {};
    }
    current = current[keys[i]] as Record<string, unknown>;
  }
  current[keys[keys.length - 1]] = value;
  return clone;
}

/* ─── Page Component ─── */

export default function TranslationsPage() {
  const [selectedLocale, setSelectedLocale] = useState<LangCode>("ja");
  const [selectedSection, setSelectedSection] = useState<SectionKey>("common");
  const [translationData, setTranslationData] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const result = await getTranslations(selectedLocale);
      if (result) {
        setTranslationData(result);
      } else {
        // Fallback to static JSON
        setTranslationData(deepClone(staticFallbacks[selectedLocale]));
      }
    } catch (err) {
      console.error("Failed to fetch translations:", err);
      // Fallback to static JSON on error
      setTranslationData(deepClone(staticFallbacks[selectedLocale]));
    } finally {
      setLoading(false);
    }
  }, [selectedLocale]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSave = async () => {
    if (!translationData) return;
    setSaving(true);
    setMessage(null);
    try {
      await saveTranslations(selectedLocale, translationData);
      setMessage({ type: "success", text: "翻訳を保存しました" });
    } catch (err) {
      console.error("Failed to save translations:", err);
      setMessage({ type: "error", text: "保存に失敗しました" });
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (path: string, value: string) => {
    if (!translationData) return;
    setTranslationData(setNestedValue(translationData, path, value));
  };

  const handleStringArrayChange = (path: string, value: string) => {
    if (!translationData) return;
    const arr = value.split(",").map((s) => s.trim());
    setTranslationData(setNestedValue(translationData, path, arr));
  };

  const sectionData =
    translationData && typeof translationData[selectedSection] === "object"
      ? (translationData[selectedSection] as Record<string, unknown>)
      : typeof translationData?.[selectedSection] === "string"
        ? ({ [selectedSection]: translationData[selectedSection] } as Record<
            string,
            unknown
          >)
        : null;

  return (
    <div className="mx-auto max-w-5xl p-6">
      {/* Locale tabs + Save */}
      <div className="mb-4 flex items-center gap-2">
        {locales.map((l) => (
          <button
            key={l.code}
            onClick={() => setSelectedLocale(l.code)}
            className={`relative overflow-hidden rounded-full px-5 py-1.5 text-sm font-medium transition-colors ${
              selectedLocale === l.code
                ? "text-text"
                : "border border-border bg-surface text-text-muted hover:text-text"
            }`}
          >
            {selectedLocale === l.code && (
              <span className="pointer-events-none absolute inset-0 rounded-full gradient-btn" aria-hidden="true" />
            )}
            <span className="relative">{l.label}</span>
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3">
          {message && (
            <span
              className={`text-sm font-medium ${
                message.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message.text}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="relative overflow-hidden rounded-lg px-6 py-1.5 text-sm font-semibold text-text disabled:opacity-50"
          >
            <span className="pointer-events-none absolute inset-0 rounded-lg gradient-btn" aria-hidden="true" />
            <span className="relative">{saving ? "保存中..." : "保存"}</span>
          </button>
        </div>
      </div>

      {/* Section navigation */}
      <div className="mb-6 flex flex-wrap gap-1.5 border-b border-border pb-4">
        {sections.map((s) => (
          <button
            key={s.key}
            onClick={() => setSelectedSection(s.key)}
            className={`relative overflow-hidden rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedSection === s.key
                ? "text-text"
                : "bg-surface-dim text-text-muted hover:text-text"
            }`}
          >
            {selectedSection === s.key && (
              <span className="pointer-events-none absolute inset-0 rounded-md gradient-btn" aria-hidden="true" />
            )}
            <span className="relative">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Main editor area */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="ml-3 text-sm text-text-muted">読み込み中...</span>
        </div>
      ) : sectionData ? (
        <div className="space-y-1">
          <FieldRenderer
            obj={sectionData}
            parentPath={selectedSection}
            onStringChange={handleFieldChange}
            onStringArrayChange={handleStringArrayChange}
          />
        </div>
      ) : (
        <p className="py-12 text-center text-sm text-text-muted">
          このセクションにはデータがありません
        </p>
      )}
    </div>
  );
}

/* ─── Recursive Field Renderer ─── */

function FieldRenderer({
  obj,
  parentPath,
  onStringChange,
  onStringArrayChange,
}: {
  obj: Record<string, unknown>;
  parentPath: string;
  onStringChange: (path: string, value: string) => void;
  onStringArrayChange: (path: string, value: string) => void;
}) {
  const entries = Object.entries(obj);

  return (
    <>
      {entries.map(([key, value]) => {
        const fullPath = parentPath ? `${parentPath}.${key}` : key;

        // String value: editable input
        if (typeof value === "string") {
          return (
            <div
              key={fullPath}
              className="flex flex-col gap-1 py-2 sm:flex-row sm:items-start sm:gap-4"
            >
              <label
                className="shrink-0 pt-2 text-xs font-mono text-text-muted sm:w-56 sm:text-right"
                title={fullPath}
              >
                {fullPath}
              </label>
              {value.length > 80 ? (
                <textarea
                  value={value}
                  onChange={(e) => onStringChange(fullPath, e.target.value)}
                  rows={3}
                  className="flex-1 border border-border bg-surface-dim rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"
                />
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onStringChange(fullPath, e.target.value)}
                  className="flex-1 border border-border bg-surface-dim rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              )}
            </div>
          );
        }

        // Array value
        if (Array.isArray(value)) {
          // Simple string array: comma-separated editable
          if (
            value.length > 0 &&
            value.every((item) => typeof item === "string")
          ) {
            return (
              <div
                key={fullPath}
                className="flex flex-col gap-1 py-2 sm:flex-row sm:items-start sm:gap-4"
              >
                <label
                  className="shrink-0 pt-2 text-xs font-mono text-text-muted sm:w-56 sm:text-right"
                  title={fullPath}
                >
                  {fullPath}
                </label>
                <input
                  type="text"
                  value={(value as string[]).join(", ")}
                  onChange={(e) =>
                    onStringArrayChange(fullPath, e.target.value)
                  }
                  className="flex-1 border border-border bg-surface-dim rounded-lg px-3 py-2 text-sm text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            );
          }

          // Complex array: read-only note
          return (
            <div
              key={fullPath}
              className="flex flex-col gap-1 py-2 sm:flex-row sm:items-start sm:gap-4"
            >
              <span
                className="shrink-0 pt-2 text-xs font-mono text-text-muted sm:w-56 sm:text-right"
                title={fullPath}
              >
                {fullPath}
              </span>
              <span className="flex-1 rounded-lg border border-border bg-surface-dim px-3 py-2 text-xs text-text-muted">
                配列データは直接編集できません (Array[{value.length}])
              </span>
            </div>
          );
        }

        // Nested object: section header + recurse
        if (value !== null && typeof value === "object") {
          return (
            <div key={fullPath} className="mt-4 first:mt-0">
              <div className="mb-2 border-b border-border pb-1">
                <span className="text-sm font-bold text-text">{fullPath}</span>
              </div>
              <div className="pl-0 sm:pl-2">
                <FieldRenderer
                  obj={value as Record<string, unknown>}
                  parentPath={fullPath}
                  onStringChange={onStringChange}
                  onStringArrayChange={onStringArrayChange}
                />
              </div>
            </div>
          );
        }

        // Other primitives: read-only
        return (
          <div
            key={fullPath}
            className="flex flex-col gap-1 py-2 sm:flex-row sm:items-center sm:gap-4"
          >
            <span className="shrink-0 text-xs font-mono text-text-muted sm:w-56 sm:text-right">
              {fullPath}
            </span>
            <span className="text-sm text-text">{String(value)}</span>
          </div>
        );
      })}
    </>
  );
}
