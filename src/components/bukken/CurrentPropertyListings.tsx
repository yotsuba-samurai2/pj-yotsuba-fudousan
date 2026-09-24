// CurrentPropertyListings — 解説ページに置く「現在掲載中の物件」ブロック（逆方向リンク）。
// 物件URLを本文・DB・seedに手書きしない。表示時に共通の公開判定（getPublishedProperties）で絞るため、
// 募集終了・ロケール非公開の物件は自動的に消える。確認時刻の経過だけでは消さない。0件ならブロックごと出さない。
// 特定の事業用途や入居資格への適合を示す文言は置かず、留保文を同じブロック内に必ず出す。
//
// 設置先（/services・/global/chinese）は revalidate=3600 のISR配下＝物件の公開・非公開の切替が
// 最大1時間このブロックに反映されないことがある（物件詳細ページ自体は成約・掲載終了時に
// revalidatePathで即時反映される。ここは「解説ページからの一覧リンク」という位置づけのため、
// 数十分の遅延は許容範囲とした＝仕様上の意図的な選択であり不具合ではない）。
import Link from "next/link";
import { getPublishedProperties, getLocalizedProperty } from "@/lib/properties";
import { formatPropertyPriceL, propertyUi } from "@/lib/property-i18n";
import { addLocalePrefix } from "@/lib/locale";
import type { LangCode } from "@/config/languages";

const MAX_ITEMS = 3;

/**
 * requireAnyLocale：指定時は、そのいずれかのロケール版が実際に公開されている物件だけを出す
 * （中国語案内ページ＝中国語版のある物件に限る。入居資格の可否を示すものではない）。
 */
export async function CurrentPropertyListings({ locale, requireAnyLocale }: { locale: LangCode; requireAnyLocale?: readonly LangCode[] }) {
  // getPublishedProperties は infoUpdatedAt 降順。同日の並びを slug で固定して順序を安定させる
  const items = (await getPublishedProperties(locale))
    .filter((p) => !requireAnyLocale || p.locales.some((l) => requireAnyLocale.includes(l)))
    .sort((a, b) => b.infoUpdatedAt.localeCompare(a.infoUpdatedAt) || a.slug.localeCompare(b.slug))
    .slice(0, MAX_ITEMS)
    .map((p) => getLocalizedProperty(p, locale));
  if (items.length === 0) return null;
  const ui = propertyUi(locale);
  return (
    <section className="mt-12">
      <h2 className="font-serif text-xl font-semibold text-ink">{ui.reverseHeading}</h2>
      <ul className="mt-3 space-y-2">
        {items.map((p) => (
          <li key={p.slug} className="rounded-xl border border-border bg-surface p-3 text-sm">
            <Link href={addLocalePrefix(`/bukken/${p.slug}`, locale)} className="font-semibold text-ink underline-offset-2 hover:underline">
              {p.title}
            </Link>
            <span className="ml-2 text-xs text-text-muted">
              {ui.dealType[p.dealType]}・{formatPropertyPriceL(p, locale)}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs leading-relaxed text-text-muted">{ui.reverseNote}</p>
      <p className="mt-2 text-sm">
        <Link href={addLocalePrefix("/bukken", locale)} className="text-primary underline">
          {ui.reverseAll}
        </Link>
      </p>
    </section>
  );
}
