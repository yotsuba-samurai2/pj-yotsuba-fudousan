import type { CorrectionDiff, CorrectionField, CorrectionPreview } from "@/lib/inheritance-correction-types";

const languages = { ja: "日本語", en: "English", "zh-tw": "繁體中文", zh: "简体中文" } as const;
const fields: Record<CorrectionField, string> = { excerpt: "要約", content: "本文", faq: "FAQ（構造化データを含む）" };

function PreviewValue({ value }: { value: CorrectionDiff["before"] }) {
  return typeof value === "string"
    ? <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-words text-sm">{value}</pre>
    : <dl className="max-h-80 space-y-3 overflow-auto text-sm">
        {value.map((item, index) => <div key={index}><dt className="font-semibold">{item.question}</dt><dd>{item.answer}</dd></div>)}
      </dl>;
}

export function InheritanceCorrectionPreview({ row }: { row: CorrectionPreview }) {
  return (
    <div className="space-y-2">
      <p>{row.reason}</p>
      {row.changes.map(({ lang, field, before, after }) => (
        <details key={lang + ":" + field} className="rounded border p-2">
          <summary className="cursor-pointer font-medium">{languages[lang]}：{fields[field]}</summary>
          <div className="grid gap-3 pt-2 md:grid-cols-2">
            <div><h3 className="font-semibold">変更前</h3><PreviewValue value={before} /></div>
            <div><h3 className="font-semibold">確認稿</h3><PreviewValue value={after} /></div>
          </div>
        </details>
      ))}
    </div>
  );
}
