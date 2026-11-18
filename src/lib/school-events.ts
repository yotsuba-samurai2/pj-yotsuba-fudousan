import type { LangCode } from "@/config/languages";
import { findSchoolBySlug } from "@/lib/school-district";

export const SCHOOL_CALENDAR_PATH = "/gakku/calendar";
export const SCHOOL_EVENTS_CHECKED = "2026-11-18";
export const SCHOOL_EVENT_SOURCES = {
  admission: "https://www.city.bunkyo.lg.jp/b048/p007702.html",
  admissionPdf: "https://www.city.bunkyo.lg.jp/documents/13446/reiwa9nennsetumeikai.pdf",
} as const;
export type SchoolEvent = Readonly<{
  id: string; school: string; kind: "admission"; date: string; time: string;
  receptionTime?: string; status: "scheduled" | "cancelled" | "pending";
  checkedAt: string; entryYear: 2027; audience: "incoming-guardians";
  sourcePage: string; sourcePdf: string;
}>;
// All 20 dates/start times and 12 reception times cross-checked against both city sources.
// The HTML lead has a stale year; the PDF title and explicit dates specify 2027.
const ADMISSION_ROWS = [
  ["rekisen", "2027-01-26", "14:30"], ["yanagicho", "2027-02-09", "14:15"],
  ["sasugaya", "2027-02-13", "14:00"], ["hayashicho", "2027-02-09", "14:00"],
  ["meika", "2027-02-04", "15:00"], ["aoyagi", "2027-02-04", "15:00"],
  ["sekiguchidaimachi", "2027-02-01", "15:00"], ["kohinatadaimachi", "2027-02-01", "14:45"],
  ["kanatomi", "2027-01-29", "14:30"], ["kubomachi", "2027-02-09", "15:00"],
  ["otsuka", "2027-02-02", "14:00"], ["yushima", "2027-02-09", "14:20"],
  ["seishi", "2027-01-27", "14:00"], ["nezu", "2027-02-04", "15:00"],
  ["sendagi", "2027-01-27", "15:00"], ["shiomi", "2027-01-25", "15:00"],
  ["showa", "2027-02-02", "14:20"], ["komamoto", "2027-02-01", "14:30"],
  ["kagomachi", "2027-02-10", "14:30"], ["hongo", "2027-02-01", "14:00"],
] as const;
const RECEPTION: Readonly<Record<string, string>> = {
  yanagicho: "14:00", hayashicho: "13:30", sekiguchidaimachi: "14:30",
  kohinatadaimachi: "14:30", kanatomi: "14:10", kubomachi: "14:45",
  yushima: "14:00", seishi: "13:30", sendagi: "14:40", showa: "14:00",
  komamoto: "14:15", kagomachi: "14:15",
};
export const SCHOOL_EVENTS: readonly SchoolEvent[] = Object.freeze(ADMISSION_ROWS.map(([school, date, time]) => Object.freeze({
  id: `${school}-admission-2027`, school, kind: "admission" as const, date, time,
  ...(RECEPTION[school] ? { receptionTime: RECEPTION[school] } : {}),
  status: "scheduled" as const, checkedAt: SCHOOL_EVENTS_CHECKED, entryYear: 2027 as const,
  audience: "incoming-guardians" as const,
  sourcePage: SCHOOL_EVENT_SOURCES.admission, sourcePdf: SCHOOL_EVENT_SOURCES.admissionPdf,
})));
/** Only the reviewed public allowlist is publishable. Input flags cannot approve
 * a new event/year, alter its date/audience/source, or carry private extra fields. */
export function verifiedSchoolEvent(value: unknown): SchoolEvent | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  const row = value as Record<string, unknown>;
  const known = SCHOOL_EVENTS.find(e => e.id === row.id);
  if (!known || row.status !== "scheduled") return;
  const keys = Object.keys(known) as (keyof SchoolEvent)[];
  if (keys.some(key => row[key] !== known[key]) || row.receptionTime !== known.receptionTime) return;
  // Reject unknown keys instead of treating a superficially matching record as verified.
  if (Object.keys(row).some(key => !keys.includes(key as keyof SchoolEvent))) return;
  return known;
}
export function jstDate(now: Date): string {
  return Number.isFinite(now.getTime()) ? new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10) : "";
}
export function schoolBriefingStartMs(event: { date: string; time: string }): number {
  return Date.parse(`${event.date}T${event.time}:00+09:00`);
}
export function upcomingSchoolEvents(now: Date, school?: string, events: readonly unknown[] = SCHOOL_EVENTS) {
  const today = jstDate(now);
  if (!today) return [];
  const unique = new Map<string, SchoolEvent>();
  for (const candidate of events) {
    const event = verifiedSchoolEvent(candidate);
    if (event && now.getTime() < schoolBriefingStartMs(event) && (!school || event.school === school)) unique.set(event.id, event);
  }
  return [...unique.values()].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time) || a.id.localeCompare(b.id));
}
export function schoolEventName(event: SchoolEvent) { return findSchoolBySlug(event.school)?.formalName ?? event.school; }
export function schoolEventSources(event: SchoolEvent) {
  const verified = verifiedSchoolEvent(event);
  return verified ? { page: verified.sourcePage, pdf: verified.sourcePdf } : undefined;
}
export function formatSchoolDate(event: SchoolEvent, locale: LangCode) {
  const lang = { ja: "ja-JP", en: "en-GB", "zh-tw": "zh-TW", zh: "zh-CN" }[locale];
  return new Intl.DateTimeFormat(lang, { timeZone: "Asia/Tokyo", year: "numeric", month: "long", day: "numeric", weekday: "short" }).format(new Date(event.date + "T12:00:00+09:00"));
}
export const SCHOOL_EVENT_COPY = {
  "ja": {
    "title": "文京区の新入学説明会",
    "lead": "2027年4月に小学校へ入学するお子さまの保護者向け説明会です。文京区が公表した20校の日程を掲載しています。",
    "admission": "2027年度 新入学説明会",
    "audience": "対象：入学予定児の保護者のみ",
    "note": "入学予定の小学校の説明会です。四葉は申込窓口ではありません。",
    "checked": "出典確認日",
    "source": "文京区の公式案内",
    "pdf": "公式日程PDF",
    "all": "学校別の新入学説明会を見る",
    "empty": "現在掲載中の新入学説明会はありません。",
    "district": "学区・住まいの情報",
    "rent": "この学区の賃貸",
    "sale": "この学区の購入",
    "consult": "学区の住まいをLINEで相談",
    "home": "ホーム",
    "overview": "学区一覧",
    "timezone": "時刻は日本時間（JST）。開始と受付を分けて表示しています。",
    "heading": "学校ごとの新入学説明会",
    "sources": "公式の開催案内",
    "update": "2027年4月入学向けの日程です。対象は入学予定児の保護者のみです。",
    "start": "開始",
    "reception": "受付"
  },
  "en": {
    "title": "Bunkyo elementary school entry briefings",
    "lead": "Briefings for parents and guardians of children entering elementary school in April 2027. Dates for all 20 schools are published by Bunkyo City.",
    "admission": "Briefing for April 2027 entry",
    "audience": "For parents/guardians of incoming pupils only",
    "note": "Attend the briefing at the school your child is due to enter. Yotsuba does not accept registrations.",
    "checked": "Source checked",
    "source": "Official Bunkyo City notice",
    "pdf": "Official schedule PDF",
    "all": "See entry briefings by school",
    "empty": "No upcoming entry briefings are currently listed.",
    "district": "District and housing information",
    "rent": "Rent in this district",
    "sale": "Buy in this district",
    "consult": "Ask about school-district housing on LINE",
    "home": "Home",
    "overview": "School districts",
    "timezone": "All times are Japan Standard Time (JST). Start and reception times are shown separately.",
    "heading": "Entry briefings by school",
    "sources": "Official briefing notices",
    "update": "These dates are for April 2027 entry and for parents/guardians of incoming pupils only.",
    "start": "Start",
    "reception": "Reception"
  },
  "zh-tw": {
    "title": "文京區小學新生入學說明會",
    "lead": "供2027年4月入讀小學的兒童家長參考，刊載文京區公布的20所小學說明會日程。",
    "admission": "2027學年度新生入學說明會",
    "audience": "對象：僅限預定入學兒童的家長",
    "note": "請參加孩子預定入學學校的說明會。四葉不受理報名。",
    "checked": "資料確認日",
    "source": "文京區官方公告",
    "pdf": "官方日程PDF",
    "all": "查看各校入學說明會",
    "empty": "目前沒有刊載即將舉行的入學說明會。",
    "district": "學區與住宅資訊",
    "rent": "此學區租屋",
    "sale": "此學區購屋",
    "consult": "透過LINE諮詢學區住宅",
    "home": "首頁",
    "overview": "學區一覽",
    "timezone": "時間均為日本時間（JST），開始與報到時間分別標示。",
    "heading": "各校新生入學說明會",
    "sources": "官方說明會公告",
    "update": "日程適用於2027年4月入學，僅供預定入學兒童的家長參加。",
    "start": "開始",
    "reception": "報到"
  },
  "zh": {
    "title": "文京区小学新生入学说明会",
    "lead": "供2027年4月入读小学的儿童家长参考，刊载文京区公布的20所小学说明会日程。",
    "admission": "2027学年度新生入学说明会",
    "audience": "对象：仅限预定入学儿童的家长",
    "note": "请参加孩子预定入学学校的说明会。四叶不受理报名。",
    "checked": "资料确认日",
    "source": "文京区官方公告",
    "pdf": "官方日程PDF",
    "all": "查看各校入学说明会",
    "empty": "目前没有刊载即将举行的入学说明会。",
    "district": "学区与住宅信息",
    "rent": "此学区租房",
    "sale": "此学区购房",
    "consult": "通过LINE咨询学区住宅",
    "home": "首页",
    "overview": "学区一览",
    "timezone": "时间均为日本时间（JST），开始与报到时间分别标示。",
    "heading": "各校新生入学说明会",
    "sources": "官方说明会公告",
    "update": "日程适用于2027年4月入学，仅供预定入学儿童的家长参加。",
    "start": "开始",
    "reception": "报到"
  }
} satisfies Record<LangCode, Record<string, string>>;
