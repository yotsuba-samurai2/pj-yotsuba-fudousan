// /gakku＝文京区の小学校 通学区域のハブ。
// 区の公表データ（町丁目・番・号）をそのまま持つ一次データ層の入口で、
// 誠之・昭和・千駄木・窪町の4校は個別ページへ送る（2026-09-22 浦松決定）。
//
// 表示規約：学校の評判・人気・進学実績には触れない。「3S1K」は世間の通称である旨を明示する。
import type { Metadata } from "next";
import Link from "next/link";
import type { LangCode } from "@/config/languages";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { CtaBand } from "@/components/shared/CtaBand";
import {
  DISTRICT_SOURCE,
  listDistrictRowsBySchool,
  listSchools,
} from "@/lib/school-district";
import { gakkuCopy, getFeaturedSchools, SCHOOL_LIST_SOURCE, SCHOOL_PROFILES } from "@/lib/gakku";
import { summarizeByChome } from "@/components/gakku/DistrictSection";
import GakkuMapEmbed from "@/components/gakku/GakkuMapEmbed";
import { SCHOOL_RENTAL_COPY, SCHOOL_RENTAL_INDEX_PATH, schoolRentalPath } from "@/lib/rental-school-district";
import { propertyUi } from "@/lib/property-i18n";

/** 本ページを公開するロケール（hreflang・sitemap と一致させる） */
const PAGE_LOCALES: LangCode[] = ["ja", "en", "zh-tw", "zh"];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = gakkuCopy(locale);
  return buildPageMetadata({
    businessKey: "realestate",
    title: c.hub.title,
    description: c.hub.description,
    path: "/gakku",
    locale,
    availableLocales: PAGE_LOCALES,
  });
}

export default async function GakkuHubPage() {
  const locale = await getRequestLocale();
  const c = gakkuCopy(locale);
  const ui = propertyUi(locale);
  const featured = getFeaturedSchools();

  return (
    <>
      <Breadcrumb items={[{ name: ui.home, href: "/" }, { name: c.hub.h1 }]} />
      <article className="mx-auto max-w-3xl px-4 pb-16">
        <header className="pt-4">
          <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">{c.hub.h1}</h1>
          <p className="mt-4 rounded-xl border border-border bg-surface-dim p-4 text-sm leading-relaxed text-text">
            {c.hub.answer}
          </p>
          <p className="mt-4 leading-relaxed text-text">{c.hub.lead}</p>
        </header>

        <Link href={addLocalePrefix(SCHOOL_RENTAL_INDEX_PATH, locale)} className="mt-6 block rounded-xl border border-primary/25 bg-primary-tint p-5 font-semibold text-primary">{SCHOOL_RENTAL_COPY[locale].indexTitle} →</Link>

        {/* 学区参考図（日本語のみ）。地図の注記・学校名が日本語のため、
            en / zh-tw / zh では出さない（区域の表・一覧は4ロケールとも下に出る）。 */}
        {locale === "ja" && (
          <section
            aria-labelledby="gakku-map-heading"
            className="mt-10 rounded-xl border border-border bg-surface-dim p-4 sm:p-6"
          >
            <h2 id="gakku-map-heading" className="font-serif text-xl font-semibold text-ink">
              文京区20小学校の学区を地図で見る
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text">
              誠之・千駄木・昭和・窪町の4校はカラー、その他の16校は白黒で表示しています。地図下の学校一覧や地図上の学校名を押すと、その学区が拡大します。国土交通省の2023年度データによる参考図です。
            </p>
            <div className="mt-4">
              <GakkuMapEmbed />
            </div>
          </section>
        )}

        <h2 className="mt-10 font-serif text-xl font-semibold text-ink">{c.hub.nicknameH2}</h2>
        <p className="mt-4 leading-relaxed text-text">{c.hub.nickname}</p>

        <h2 className="mt-10 font-serif text-xl font-semibold text-ink">{c.hub.featuredH2}</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {featured.map((school) => {
            const rows = listDistrictRowsBySchool(school.slug);
            const chome = summarizeByChome(rows);
            return (
              <li key={school.slug}>
                <Link
                  href={addLocalePrefix(`/gakku/${school.slug}`, locale)}
                  className="block h-full rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/40"
                >
                  <span className="block font-semibold text-ink">{school.formalName}</span>
                  <span className="mt-1 block text-xs text-text-muted">
                    {SCHOOL_PROFILES[school.slug]?.address}
                  </span>
                  <span className="mt-2 block text-xs text-text-muted">
                    {chome.map((x) => x.chome).join("・")}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <h2 className="mt-10 font-serif text-xl font-semibold text-ink">{c.hub.allSchoolsH2}</h2>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">{c.hub.allSchoolsLead}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-text-muted">
                <th scope="col" className="py-2 pr-3 font-medium">
                  {locale === "ja" ? "学校" : "School"}
                </th>
                <th scope="col" className="py-2 pr-3 font-medium">
                  {c.school.addressLabel}
                </th>
                <th scope="col" className="py-2 font-medium">
                  {c.table.chome}
                </th>
              </tr>
            </thead>
            <tbody>
              {listSchools().map((school) => {
                const rows = listDistrictRowsBySchool(school.slug);
                const chome = summarizeByChome(rows);
                const featuredSchool = featured.some((f) => f.slug === school.slug);
                return (
                  <tr key={school.slug} className="border-b border-border align-top">
                    <td className="py-2 pr-3 text-text">
                      {featuredSchool ? (
                        <Link
                          href={addLocalePrefix(`/gakku/${school.slug}`, locale)}
                          className="underline"
                        >
                          {school.formalName}
                        </Link>
                      ) : (
                        school.formalName
                      )}
                      <Link href={addLocalePrefix(schoolRentalPath(school.slug), locale)} className="mt-2 block text-xs font-semibold text-primary underline">{SCHOOL_RENTAL_COPY[locale].view} →</Link>
                    </td>
                    <td className="py-2 pr-3 text-text-muted">
                      {SCHOOL_PROFILES[school.slug]?.address}
                    </td>
                    <td className="py-2 text-text-muted">
                      {chome.map((x) => x.chome).join("・")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-text-muted">
          {c.sourceLabel}：
          <a
            href={DISTRICT_SOURCE.url}
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            文京区「小学校 通学区域」
          </a>
          （{c.updatedLabel} {DISTRICT_SOURCE.updatedAt}）／
          <a
            href={SCHOOL_LIST_SOURCE.url}
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            文京区「区立小学校一覧」
          </a>
          （{c.updatedLabel} {SCHOOL_LIST_SOURCE.updatedAt}）　{c.fetchedLabel}{" "}
          {DISTRICT_SOURCE.fetchedAt}
          {c.placeNamesInJa ? ` ${c.placeNamesInJa}` : ""}
        </p>

        <p className="mt-10 text-xs leading-relaxed text-text-muted">{c.disclaimer}</p>
      </article>

      <div className="mx-auto max-w-3xl px-4">
        <CtaBand businessKey="realestate" variant="property" intent="gakku" />
      </div>
    </>
  );
}
