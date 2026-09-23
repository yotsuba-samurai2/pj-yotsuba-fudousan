// RelatedConsultWindows — コラム本文直後の「この記事に関係する相談窓口」（2026-09-24 新設）。
// 対応表＝src/lib/column-consult-windows.ts。ja のみ・対応表に slug があるときだけ page.tsx から渡す。
// server / client どちらからでも描画できるよう、Prisma・getRequestLocale・office.ts を参照しない。
// リンクは相対パス（ja のみ表示のため接頭辞なし）。分離受任の明示を必ず添える。
import Link from "next/link";
import type { ConsultWindow } from "@/lib/column-consult-windows";

type Props = { windows: ConsultWindow[] };

export function RelatedConsultWindows({ windows }: Props) {
  if (windows.length === 0) return null;
  return (
    <aside
      aria-label="この記事に関係する相談窓口"
      className="mt-10 rounded-xl border border-border bg-surface p-4 text-sm"
    >
      <p className="font-medium text-ink">この記事に関係する相談窓口</p>
      <ul className="mt-2 space-y-2">
        {windows.map((w) => (
          <li key={w.href}>
            <Link href={w.href} className="font-medium text-primary underline">
              {w.label}
            </Link>
            <span className="mt-0.5 block text-xs leading-relaxed text-text-muted">{w.description}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs leading-relaxed text-text-muted">
        四葉不動産株式会社・四葉行政書士事務所は、それぞれ独立した事業体として受任し、別々にご契約いただきます。事業体間で紹介料の授受はありません。
      </p>
    </aside>
  );
}
