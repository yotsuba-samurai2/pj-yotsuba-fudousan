"use client";

import { useTranslation } from "@/hooks/useTranslation";
import type { LegalSection } from "@/lib/data/legal-pages-sections";

/**
 * 利用規約・プライバシーポリシーの条項リスト（既存条項と同じマークアップで描画）。
 *
 * 表示値は DB（translation テーブル）の `${namespace}.sections.${key}.*` を優先し、
 * DB に該当キーが無い場合はコード側の既定値（LegalSection）を表示する。
 * useTranslation の t() は未定義キーに対してキー文字列をそのまま返すため、
 * それを「DB 未投入」の判定に使う（生キーが本番に露出するのを防ぐ）。
 */
export function LegalSectionList({
  namespace,
  sections,
}: {
  namespace: "terms" | "privacyPolicy";
  sections: readonly LegalSection[];
}) {
  const { t, tArray } = useTranslation();

  const text = (key: string, fallback: string) => {
    const value = t(key);
    return value === key ? fallback : value;
  };

  return (
    <>
      {sections.map((section) => {
        const base = `${namespace}.sections.${section.key}`;
        const dbItems = tArray<string>(`${base}.items`);
        const items = dbItems.length > 0 ? dbItems : (section.items ?? []);

        return (
          <div key={section.key}>
            <h2 className="text-lg font-bold text-text">
              {text(`${base}.title`, section.title)}
            </h2>
            <p className="mt-3">{text(`${base}.content`, section.content)}</p>
            {items.length > 0 && (
              <ul className="mt-2 list-disc pl-5 space-y-1">
                {items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </>
  );
}
