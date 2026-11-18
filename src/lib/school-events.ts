import type { LangCode } from "@/config/languages";
import { findSchoolBySlug } from "@/lib/school-district";

export const SCHOOL_CALENDAR_PATH = "/gakku/calendar";
export const SCHOOL_EVENTS_CHECKED = "2026-11-18";
export const SCHOOL_EVENT_SOURCES = {
  admission: "https://www.city.bunkyo.lg.jp/b048/p007702.html",
  admissionPdf: "https://www.city.bunkyo.lg.jp/documents/13446/reiwa9nennsetumeikai.pdf",
  open: "https://www.city.bunkyo.lg.jp/b049/p002090.html",
  openPdf: "https://www.city.bunkyo.lg.jp/documents/2068/r8gyouzi_shou-2.pdf",
} as const;
export type SchoolEvent = { id: string; school: string; kind: "admission" | "open" | "presentation" | "exhibition"; date: string; endDate?: string; time?: string; status: "scheduled" | "cancelled" | "pending"; checkedAt: string };
// 2027 entry briefings: all 20 rows cross-checked between city HTML and official PDF.
// Source HTML contains an old year in its lead; use the PDF's 令和9年度 and explicit dates.
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
// Selected school-open days from the FY2026 annual schedule. No attendance eligibility
// or time is inferred. School-specific changes must be checked before participation.
const OPEN_ROWS = [
  ["otsuka", "2026-12-19"], ["otsuka", "2027-01-23"],
  ["hayashicho", "2026-12-05"], ["hayashicho", "2027-01-30"], ["hayashicho", "2027-03-06"],
  ["kubomachi", "2027-02-06"], ["sendagi", "2026-12-05"], ["sendagi", "2027-02-13"],
  ["seishi", "2027-02-20"], ["showa", "2027-02-06"],
] as const;
// These are school activities, not invitations to public open classes. The revised
// city PDF (-2) lists them under 展覧会・学芸会等; times/visitor eligibility are unknown.
const ACTIVITY_ROWS = [
  ["sekiguchidaimachi", "presentation", "2026-11-19", "2026-11-21"],
  ["kohinatadaimachi", "exhibition", "2026-11-27", "2026-11-28"],
  ["kubomachi", "exhibition", "2026-12-04", "2026-12-05"],
] as const;
export const SCHOOL_EVENTS: readonly SchoolEvent[] = [
  ...ADMISSION_ROWS.map(([school, date, time]) => ({ id: `${school}-admission-2027`, school, kind: "admission" as const, date, time, status: "scheduled" as const, checkedAt: SCHOOL_EVENTS_CHECKED })),
  ...ACTIVITY_ROWS.map(([school, kind, date, endDate]) => ({ id: `${school}-${kind}-${date}`, school, kind, date, endDate, status: "scheduled" as const, checkedAt: SCHOOL_EVENTS_CHECKED })),
  ...OPEN_ROWS.map(([school, date]) => ({ id: `${school}-open-${date}`, school, kind: "open" as const, date, status: "scheduled" as const, checkedAt: SCHOOL_EVENTS_CHECKED })),
];
/** Date-only school notices are day-based: retain today's notice until midnight JST.
 * Never invent an end time. Host TZ (including UTC Vercel hosts) cannot change this. */
export function jstDate(now: Date): string {
  return new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}
export function upcomingSchoolEvents(now: Date, school?: string, events: readonly SchoolEvent[] = SCHOOL_EVENTS) {
  const today = jstDate(now);
  return events.filter(e => e.status === "scheduled" && (e.endDate ?? e.date) >= today && (!school || e.school === school))
    .slice().sort((a, b) => (a.date + (a.time ?? "00:00")).localeCompare(b.date + (b.time ?? "00:00")) || a.id.localeCompare(b.id));
}
export function schoolEventName(event: SchoolEvent) { return findSchoolBySlug(event.school)?.formalName ?? event.school; }
export function schoolEventSources(event: SchoolEvent) {
  return event.kind === "admission"
    ? { page: SCHOOL_EVENT_SOURCES.admission, pdf: SCHOOL_EVENT_SOURCES.admissionPdf }
    : { page: SCHOOL_EVENT_SOURCES.open, pdf: SCHOOL_EVENT_SOURCES.openPdf };
}
export function formatSchoolDate(event: SchoolEvent, locale: LangCode) {
  const lang = { ja: "ja-JP", en: "en-GB", "zh-tw": "zh-TW", zh: "zh-CN" }[locale];
  const formatter = new Intl.DateTimeFormat(lang, { timeZone: "Asia/Tokyo", year: "numeric", month: "long", day: "numeric", weekday: "short" });
  const start = formatter.format(new Date(event.date + "T12:00:00+09:00"));
  return event.endDate && event.endDate !== event.date
    ? `${start} – ${formatter.format(new Date(event.endDate + "T12:00:00+09:00"))}`
    : start;
}
export const SCHOOL_EVENT_COPY = {
  ja: { presentation: "学習発表会", exhibition: "展覧会", activityAudience: "時間・一般来校者の参加可否は未確認。学校の最新案内をご確認ください", title: "文京区の学校説明会・行事・公開予定", lead: "2027年4月入学向けの小学校説明会と、2026年度の学校行事・授業公開の一部をまとめました。文京区の公表資料に基づく参考情報です。", admission: "2027年度 新入学説明会", open: "2026年度 土曜授業公開（年間予定）", audience: "入学予定者の保護者のみ", openAudience: "参加対象・予約・時間は学校の最新案内で確認", note: "主催は各学校です。四葉は申込窓口ではありません。日程変更や参加条件は公式案内をご確認ください。見学参加によって入学先が決まるものではありません。学校名は公式の日本語表記です。", checked: "出典確認日", source: "文京区の公式案内", pdf: "公式日程PDF", all: "学校別の予定を見る", empty: "確認済みの今後の日程はありません。新年度の予定は公式案内をご確認ください。", district: "学区・住まいの情報", rent: "この学区の賃貸", sale: "この学区の購入", consult: "学区の住まいをLINEで相談", home: "ホーム", overview: "学区一覧", timezone: "時刻は日本時間（JST）。複数日の行事は最終日の終わりまで表示します。", heading: "学校ごとの予定", sources: "出典・更新について", update: "2026年11月18日に区の資料を確認。新入学説明会は公式PDFと照合済みです。学校行事・授業公開は改訂版の年間予定PDFからの抜粋で、11月を含む全行事の一覧ではありません。学校別の直前変更、行事の時間や一般来校者の参加可否は未確認です。未確認・矛盾のある日程は掲載せず、終了日を過ぎた予定は表示しません。" },
  en: { presentation: "Student learning showcase", exhibition: "Student exhibition", activityAudience: "Times and eligibility for outside visitors are unverified. Check the school’s latest notice.", title: "Bunkyo school briefings, activities and open days", lead: "Elementary school briefings for April 2027 entry and selected school activities and open classes in school year 2026–27, based on Bunkyo City's published notices.", admission: "Briefing for April 2027 entry", open: "School year 2026–27 Saturday open classes (annual plan)", audience: "Parents/guardians of incoming pupils only", openAudience: "Check the school's current notice for eligibility, booking and time", note: "Events are hosted by the schools. Yotsuba does not accept event registrations. Check official notices for changes and attendance requirements. Attending does not determine enrollment eligibility. School names retain their official Japanese spelling.", checked: "Source checked", source: "Official Bunkyo City notice", pdf: "Official schedule PDF", all: "See schedules by school", empty: "No verified upcoming dates are listed. Check official notices for the next school year.", district: "District and housing information", rent: "Rent in this district", sale: "Buy in this district", consult: "Ask about school-district housing on LINE", home: "Home", overview: "School districts", timezone: "All times are Japan Standard Time (JST). Multi-day activities remain until the end of the final day.", heading: "Schedules by school", sources: "Sources and updates", update: "City sources checked on 18 November 2026. Entry briefings were cross-checked with the official PDF. Activities and open classes are excerpts from the revised annual-plan PDF, not a complete list including November. Last-minute changes, activity times and eligibility for outside visitors have not been verified. Unverified or conflicting dates are withheld; past dates are hidden." },
  "zh-tw": { presentation: "學習成果發表會", exhibition: "作品展覽會", activityAudience: "活動時間及校外人士能否參加尚未確認，請查閱學校最新公告。", title: "文京區學校說明會、活動與開放日", lead: "整理2027年4月入學的小學說明會及2026學年度部分學校活動與公開授課日，供參考。資料來自文京區官方公告。", admission: "2027學年度新生入學說明會", open: "2026學年度週六公開授課（年度預定）", audience: "僅限預定入學兒童的家長", openAudience: "參加對象、預約及時間請確認學校最新公告", note: "活動由各校主辦，四葉不受理活動報名。日期變更與參加條件請以官方公告為準，參觀不代表取得入學資格。校名沿用官方日文名稱。", checked: "資料確認日", source: "文京區官方公告", pdf: "官方日程PDF", all: "查看各校日程", empty: "目前無已確認的後續日程。新學年度安排請參閱官方公告。", district: "學區與住宅資訊", rent: "此學區租屋", sale: "此學區購屋", consult: "透過LINE諮詢學區住宅", home: "首頁", overview: "學區一覽", timezone: "時間均為日本時間（JST），連續多日的活動顯示至最後一天結束。", heading: "各校日程", sources: "資料來源與更新", update: "2026年11月18日確認區官方資料。入學說明會已與官方PDF核對；學校活動與公開授課節錄自修訂版年度日程PDF，並非包含11月在內的完整日程。各校臨時變更、活動時間及校外人士能否參加尚未確認。未確認或有矛盾的日期不刊載，過期日程自動隱藏。" },
  zh: { presentation: "学习成果发表会", exhibition: "作品展览会", activityAudience: "活动时间及校外人士能否参加尚未确认，请查阅学校最新公告。", title: "文京区学校说明会、活动与开放日", lead: "整理2027年4月入学的小学说明会及2026学年度部分学校活动与公开授课日，供参考。资料来自文京区官方公告。", admission: "2027学年度新生入学说明会", open: "2026学年度周六公开授课（年度预定）", audience: "仅限预定入学儿童的家长", openAudience: "参加对象、预约及时间请确认学校最新公告", note: "活动由各校主办，四叶不受理活动报名。日期变更与参加条件请以官方公告为准，参观不代表取得入学资格。校名沿用官方日文名称。", checked: "资料确认日", source: "文京区官方公告", pdf: "官方日程PDF", all: "查看各校日程", empty: "目前无已确认的后续日程。新学年度安排请参阅官方公告。", district: "学区与住宅信息", rent: "此学区租房", sale: "此学区购房", consult: "通过LINE咨询学区住宅", home: "首页", overview: "学区一览", timezone: "时间均为日本时间（JST），连续多日的活动显示至最后一天结束。", heading: "各校日程", sources: "资料来源与更新", update: "2026年11月18日确认区官方资料。入学说明会已与官方PDF核对；学校活动与公开授课节录自修订版年度日程PDF，并非包含11月在内的完整日程。各校临时变更、活动时间及校外人士能否参加尚未确认。未确认或有矛盾的日期不刊载，过期日程自动隐藏。" },
} satisfies Record<LangCode, Record<string, string>>;
