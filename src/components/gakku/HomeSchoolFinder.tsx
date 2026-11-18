"use client";

import { useId, useState } from "react";
import Link from "next/link";
import type { LangCode } from "@/config/languages";
import { addLocalePrefix } from "@/lib/locale";
import { DISTRICT_SOURCE, findSchoolBySlug, listSchools } from "@/lib/school-district";
import { isFeaturedSchoolSlug } from "@/lib/gakku";

const COPY = {
  ja: { title: "希望の学区から、住まいを探す。", lead: "小学校を選ぶと、賃貸・購入・通学区域と、入学予定児の保護者向け新入学説明会へ進めます。", label: "小学校を選ぶ", rent: "この学区の賃貸", sale: "この学区の売買", zone: "この学校の通学区域", zones: "20校の通学区域", calendar: "この学校の新入学説明会", all: "20校の学区から探す", note: "通学区域は町丁目だけでなく番・号で分かれる場合があります。入学時点の指定校は文京区が決定します。", source: "文京区公式の通学区域", names: "学校名は公式の日本語表記です。" },
  en: { title: "Find a home by school district.", lead: "Choose an elementary school to explore rentals, homes for sale, district boundaries and entry briefings for parents and guardians of incoming pupils.", label: "Choose an elementary school", rent: "Rent in this district", sale: "Buy in this district", zone: "This school's district", zones: "All 20 school districts", calendar: "This school's entry briefing", all: "Explore all 20 school districts", note: "District boundaries may depend on the block and building number, not just the neighborhood. Bunkyo City determines the assigned school at enrollment.", source: "Bunkyo City's official district boundaries", names: "School names use their official Japanese spelling." },
  "zh-tw": { title: "從理想學區，找到全家的住處。", lead: "選擇小學，即可查看租屋、購屋、通學區域，以及供預計入學兒童家長參加的新生入學說明會。", label: "選擇小學", rent: "查看此學區租屋", sale: "查看此學區購屋", zone: "查看這所學校的通學區域", zones: "查看20校通學區域", calendar: "查看這所學校的新生入學說明會", all: "從20校學區找房", note: "通學區域可能依地址的番、號劃分，不只取決於町丁目。入學時的指定學校由文京區決定。", source: "文京區官方通學區域", names: "校名沿用官方日文名稱。" },
  zh: { title: "从理想学区，找到全家的住处。", lead: "选择小学，即可查看租房、购房、通学区域，以及面向拟入学儿童家长的新生入学说明会。", label: "选择小学", rent: "查看此学区租房", sale: "查看此学区购房", zone: "查看这所学校的通学区域", zones: "查看20校通学区域", calendar: "查看这所学校的新生入学说明会", all: "从20校学区找房", note: "通学区域可能依地址的番、号划分，不只取决于町丁目。入学时的指定学校由文京区决定。", source: "文京区官方通学区域", names: "校名沿用官方日文名称。" },
} satisfies Record<LangCode, Record<string, string>>;

/** Only canonical school slugs can become paths; unknown values fall back safely. */
export function homeSchoolFinderRoutes(value: string, locale: LangCode) {
  const school = findSchoolBySlug(value) ?? findSchoolBySlug("kubomachi")!;
  const detail = isFeaturedSchoolSlug(school.slug);
  return {
    school, detail,
    rent: addLocalePrefix(`/gakku/${school.slug}/rentals`, locale),
    sale: addLocalePrefix(`/gakku/${school.slug}/sales`, locale),
    zone: addLocalePrefix(detail ? `/gakku/${school.slug}` : "/gakku", locale),
    calendar: addLocalePrefix("/gakku/calendar", locale) + `#${school.slug}`,
  };
}

const action = "inline-flex min-h-12 items-center justify-center rounded-lg border border-primary/25 px-4 py-3 text-center text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";

export function HomeSchoolFinder({ locale }: { locale: LangCode }) {
  const id = useId();
  const [slug, setSlug] = useState("kubomachi");
  const c = COPY[locale];
  const routes = homeSchoolFinderRoutes(slug, locale);
  return <section aria-labelledby={`${id}-title`} className="rounded-2xl border border-primary/20 bg-[#FAF9F6] p-5 text-[#1B4332] sm:p-8">
    <h2 id={`${id}-title`} className="font-serif text-2xl font-semibold leading-snug sm:text-3xl">{c.title}</h2>
    <p className="mt-3 text-sm leading-7">{c.lead}</p>
    <label htmlFor={`${id}-school`} className="mt-6 block text-sm font-semibold">{c.label}</label>
    <select id={`${id}-school`} value={routes.school.slug} onChange={event => setSlug(homeSchoolFinderRoutes(event.target.value, locale).school.slug)} aria-describedby={`${id}-names`} className="mt-2 min-h-12 w-full min-w-0 rounded-lg border border-primary/30 bg-white px-3 py-3 text-base focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
      {listSchools().map(school => <option key={school.slug} value={school.slug}>{school.formalName}</option>)}
    </select>
    <p id={`${id}-names`} className="mt-2 text-xs leading-6">{c.names}</p>
    <p className="sr-only" aria-live="polite" aria-atomic="true">{routes.school.formalName}</p>
    <nav aria-label={routes.school.formalName} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Link prefetch={false} href={routes.rent} className={`${action} bg-[#1B4332] text-white hover:bg-[#2D6A4F]`}>{c.rent} →</Link>
      <Link prefetch={false} href={routes.sale} className={`${action} bg-white hover:bg-[#edf3ee]`}>{c.sale} →</Link>
      <Link prefetch={false} href={routes.zone} className={`${action} bg-white hover:bg-[#edf3ee]`}>{routes.detail ? c.zone : c.zones} →</Link>
      <Link prefetch={false} href={routes.calendar} className={`${action} bg-white hover:bg-[#edf3ee]`}>{c.calendar} →</Link>
    </nav>
    <Link prefetch={false} href={addLocalePrefix("/gakku", locale)} className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">{c.all} →</Link>
    <p className="mt-4 border-t border-primary/15 pt-4 text-xs leading-6">{c.note} <a href={DISTRICT_SOURCE.url} className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">{c.source}</a></p>
  </section>;
}
