// RelatedBusinessFooter — 関連事業フッター（グループ内の別事業への導線）
// 独立受任注記を必ず添える（紹介料等の授受なし＝非弁・業際配慮）。
// 社労士行は SR_LAUNCHED=false の間は非表示（開業=2026年9月まで露出しない）。
// ※既存 TenantLayout のフッターにグループ事業グリッドが既にあるため、Shellへの二重組み込みはしない。
//   ページ単位で明示的に使いたい場合の部品として提供（委任§3「共通部品を追加」）。
// 2026-07-11 ロケール保持（診断_ロケール保持リンク_v1 §B-5）：server維持（office.tsのSR名を含むためclient化しない）。
//   async化して t.home のみ addLocalePrefix（ここで1回だけ付与）。見出し・blurb・注記の文言はja固定（スコープ外＝診断§E-6）。
import Link from "next/link";
import { TENANT, SR_LAUNCHED, type BusinessKey } from "@/lib/shared/office";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";

type Props = {
  /** 現在のサイト（自分自身は出さない） */
  current: BusinessKey;
  /** テスト用に上書き可（既定は env） */
  srLaunched?: boolean;
};

const ALL: { key: BusinessKey; blurb: string }[] = [
  { key: "realestate", blurb: "相続・投資・お部屋探し（宅建業）" },
  { key: "legal", blurb: "障害福祉・ビザ・相続・会社設立・補助金" },
  { key: "labor", blurb: "労務・処遇改善・助成金・障害年金" },
];

export async function RelatedBusinessFooter({ current, srLaunched = SR_LAUNCHED }: Props) {
  const locale = await getRequestLocale();
  const items = ALL.filter((b) => b.key !== current).filter((b) => b.key !== "labor" || srLaunched);
  if (items.length === 0) return null;
  return (
    <section aria-label="関連事業" className="mx-auto max-w-5xl px-4 py-6">
      <h2 className="mb-3 text-sm font-semibold text-text-muted">四葉グループの関連事業</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((b) => {
          const t = TENANT[b.key];
          return (
            <Link
              key={b.key}
              href={addLocalePrefix(t.home, locale)}
              className="block rounded-xl border border-border bg-surface p-4 transition-shadow hover:shadow-sm"
            >
              <div className="font-medium text-ink">{t.name}</div>
              <div className="mt-0.5 text-xs text-text-muted">{b.blurb}</div>
            </Link>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-text-muted">
        ※各事業は別の事業体として独立してご依頼をお受けします（紹介料等の授受はありません）。
      </p>
    </section>
  );
}
