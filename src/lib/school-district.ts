/**
 * 住所から文京区立小学校の通学区域を引く。
 *
 * 方針（2026-09-22 浦松決定）：区の公表データと住所の照合のみで判定し、
 * 番地によって学校が分かれる区域・番や号が特定できない住所は確定させず、
 * 「お問い合わせ」に寄せる。推測で学校名を表示しない。
 *
 * 入学時点の通学区域は区が決定する。本モジュールの結果は参考であり、
 * 表示する画面には必ずその旨と出典・更新日を併記すること。
 */
import {
  BUNKYO_SCHOOL_DISTRICT_SOURCE,
  BUNKYO_SCHOOL_DISTRICT_TSV,
} from "./data/bunkyo-school-districts";

export interface SchoolInfo {
  /** URLに使うスラッグ */
  slug: string;
  /** 区の表での表記（例：窪町小） */
  name: string;
  /** 読み */
  kana: string;
  /** 正式名称 */
  formalName: string;
}

export interface DistrictRow {
  school: string;
  /** 例：小日向4丁目 */
  chome: string;
  /** 区の表の「番」欄の原文 */
  ban: string;
  /** 区の表の「号」欄の原文 */
  go: string;
  /** 区の表の「備考」欄の原文（例：一部、青柳小） */
  note: string;
}

export type DistrictLookupReason =
  | "ban-unknown"
  | "go-unknown"
  | "split-by-note"
  | "multiple-schools";

export type DistrictLookupResult =
  | { status: "determined"; school: SchoolInfo; rows: DistrictRow[] }
  | {
      status: "needs-inquiry";
      reason: DistrictLookupReason;
      candidates: SchoolInfo[];
      rows: DistrictRow[];
    }
  | { status: "not-found" };

export interface BunkyoAddressParts {
  /** 町名（丁目を除く。例：小日向） */
  town: string;
  /** 丁目 */
  chome: number;
  ban?: number;
  go?: number;
}

const SCHOOLS: readonly SchoolInfo[] = [
  { slug: "rekisen", name: "礫川小", kana: "れきせんしょう", formalName: "文京区立礫川小学校" },
  { slug: "yanagicho", name: "柳町小", kana: "やなぎちょうしょう", formalName: "文京区立柳町小学校" },
  { slug: "sasugaya", name: "指ケ谷小", kana: "さすがやしょう", formalName: "文京区立指ケ谷小学校" },
  { slug: "hayashicho", name: "林町小", kana: "はやしちょうしょう", formalName: "文京区立林町小学校" },
  { slug: "meika", name: "明化小", kana: "めいかしょう", formalName: "文京区立明化小学校" },
  { slug: "aoyagi", name: "青柳小", kana: "あおやぎしょう", formalName: "文京区立青柳小学校" },
  { slug: "sekiguchidaimachi", name: "関口台町小", kana: "せきぐちだいまちしょう", formalName: "文京区立関口台町小学校" },
  { slug: "kohinatadaimachi", name: "小日向台町小", kana: "こひなただいまちしょう", formalName: "文京区立小日向台町小学校" },
  { slug: "kanatomi", name: "金富小", kana: "かなとみしょう", formalName: "文京区立金富小学校" },
  { slug: "kubomachi", name: "窪町小", kana: "くぼまちしょう", formalName: "文京区立窪町小学校" },
  { slug: "otsuka", name: "大塚小", kana: "おおつかしょう", formalName: "文京区立大塚小学校" },
  { slug: "yushima", name: "湯島小", kana: "ゆしましょう", formalName: "文京区立湯島小学校" },
  { slug: "seishi", name: "誠之小", kana: "せいししょう", formalName: "文京区立誠之小学校" },
  { slug: "nezu", name: "根津小", kana: "ねづしょう", formalName: "文京区立根津小学校" },
  { slug: "sendagi", name: "千駄木小", kana: "せんだぎしょう", formalName: "文京区立千駄木小学校" },
  { slug: "shiomi", name: "汐見小", kana: "しおみしょう", formalName: "文京区立汐見小学校" },
  { slug: "showa", name: "昭和小", kana: "しょうわしょう", formalName: "文京区立昭和小学校" },
  { slug: "komamoto", name: "駒本小", kana: "こまもとしょう", formalName: "文京区立駒本小学校" },
  { slug: "kagomachi", name: "駕籠町小", kana: "かごまちしょう", formalName: "文京区立駕籠町小学校" },
  { slug: "hongo", name: "本郷小", kana: "ほんごうしょう", formalName: "文京区立本郷小学校" },
] as const;

const SCHOOL_BY_NAME = new Map(SCHOOLS.map((s) => [s.name, s]));
const SCHOOL_BY_SLUG = new Map(SCHOOLS.map((s) => [s.slug, s]));

export function listSchools(): readonly SchoolInfo[] {
  return SCHOOLS;
}

export function findSchoolBySlug(slug: string): SchoolInfo | undefined {
  return SCHOOL_BY_SLUG.get(slug);
}

export const DISTRICT_SOURCE = BUNKYO_SCHOOL_DISTRICT_SOURCE;

let cachedRows: DistrictRow[] | null = null;

export function listDistrictRows(): DistrictRow[] {
  if (cachedRows) return cachedRows;
  const rows: DistrictRow[] = [];
  for (const line of BUNKYO_SCHOOL_DISTRICT_TSV.split("\n")) {
    if (line.trim() === "") continue;
    const [school, chome, ban, go, note] = line.split("\t");
    rows.push({
      school: school ?? "",
      chome: chome ?? "",
      ban: ban ?? "",
      go: go ?? "",
      note: note ?? "",
    });
  }
  cachedRows = rows;
  return rows;
}

/** 指定した学校の通学区域の行（区の表の並び順のまま） */
export function listDistrictRowsBySchool(slug: string): DistrictRow[] {
  const school = SCHOOL_BY_SLUG.get(slug);
  if (!school) return [];
  return listDistrictRows().filter((r) => r.school === school.name);
}

type NumberSpec =
  | { kind: "all" }
  | { kind: "all-except"; values: number[] }
  | { kind: "set"; values: number[] };

const FULLWIDTH_DIGITS = /[０-９]/g;

function toHalfWidth(input: string): string {
  return input.replace(FULLWIDTH_DIGITS, (c) =>
    String.fromCharCode(c.charCodeAt(0) - 0xfee0),
  );
}

function parseNumberList(input: string): number[] {
  const values: number[] = [];
  for (const part of toHalfWidth(input).split(/[、,]/)) {
    const piece = part.trim();
    if (piece === "") continue;
    const range = piece.match(/^(\d+)[～~－-](\d+)$/);
    if (range) {
      const from = Number(range[1]);
      const to = Number(range[2]);
      for (let n = Math.min(from, to); n <= Math.max(from, to); n += 1) {
        values.push(n);
      }
      continue;
    }
    const single = piece.match(/^(\d+)$/);
    if (single) values.push(Number(single[1]));
  }
  return values;
}

/** 区の表の「番」「号」欄の表記（全／◯を除く全域／1～9、12 など）を解釈する */
export function parseNumberSpec(input: string): NumberSpec {
  const text = input.trim();
  if (text === "" || text === "全") return { kind: "all" };
  const except = text.match(/^(.+?)を除く全(?:域)?$/);
  if (except) return { kind: "all-except", values: parseNumberList(except[1]) };
  return { kind: "set", values: parseNumberList(text) };
}

function specIncludes(spec: NumberSpec, value: number): boolean {
  if (spec.kind === "all") return true;
  if (spec.kind === "all-except") return !spec.values.includes(value);
  return spec.values.includes(value);
}

/**
 * 文京区の住所文字列を町名・丁目・番・号に分解する。
 * 「東京都文京区小日向4丁目2番5号」「文京区小日向4-2-5」「小日向4丁目2-5」などを受ける。
 * 文京区以外・解釈できない表記は undefined を返す（推測しない）。
 */
export function parseBunkyoAddress(input: string): BunkyoAddressParts | undefined {
  if (!input) return undefined;
  let text = toHalfWidth(input).replace(/[\s　]/g, "");
  if (text.includes("東京都")) text = text.slice(text.indexOf("東京都") + 3);
  if (text.startsWith("文京区")) {
    text = text.slice(3);
  } else if (text.includes("区")) {
    // 文京区以外の区が明示されている住所は対象外
    return undefined;
  }
  // 例：小日向4丁目2番5号／小日向4-2-5／小日向4丁目2-5
  const matched = text.match(
    /^([^\d]+?)(\d+)(?:丁目)?[-－ー―‐の]?(\d+)?(?:番地?)?[-－ー―‐の]?(\d+)?(?:号)?/,
  );
  if (!matched) return undefined;
  const town = matched[1].replace(/[-－ー―‐]$/, "");
  if (town === "") return undefined;
  return {
    town,
    chome: Number(matched[2]),
    ban: matched[3] ? Number(matched[3]) : undefined,
    go: matched[4] ? Number(matched[4]) : undefined,
  };
}

function uniqueSchools(rows: DistrictRow[]): SchoolInfo[] {
  const seen = new Set<string>();
  const out: SchoolInfo[] = [];
  for (const row of rows) {
    if (seen.has(row.school)) continue;
    seen.add(row.school);
    const info = SCHOOL_BY_NAME.get(row.school);
    if (info) out.push(info);
  }
  return out;
}

/**
 * 町丁目・番・号から通学区域を引く。
 * 確定できるのは、区の表で1校に定まり、かつ備考（一部、◯◯小）が無い場合だけ。
 */
export function lookupDistrict(parts: BunkyoAddressParts): DistrictLookupResult {
  const chomeLabel = `${parts.town}${parts.chome}丁目`;
  const inChome = listDistrictRows().filter((r) => r.chome === chomeLabel);
  if (inChome.length === 0) return { status: "not-found" };

  const decide = (rows: DistrictRow[], reason: DistrictLookupReason): DistrictLookupResult => {
    const candidates = uniqueSchools(rows);
    if (candidates.length === 1 && rows.every((r) => r.note === "")) {
      return { status: "determined", school: candidates[0], rows };
    }
    return { status: "needs-inquiry", reason, candidates, rows };
  };

  if (parts.ban === undefined) return decide(inChome, "ban-unknown");

  const ban = parts.ban;
  const inBan = inChome.filter((r) => specIncludes(parseNumberSpec(r.ban), ban));
  if (inBan.length === 0) return { status: "not-found" };
  if (parts.go === undefined) return decide(inBan, "go-unknown");

  const go = parts.go;
  const inGo = inBan.filter((r) => specIncludes(parseNumberSpec(r.go), go));
  if (inGo.length === 0) return { status: "not-found" };

  const candidates = uniqueSchools(inGo);
  if (inGo.some((r) => r.note !== "")) {
    return { status: "needs-inquiry", reason: "split-by-note", candidates, rows: inGo };
  }
  if (candidates.length > 1) {
    return { status: "needs-inquiry", reason: "multiple-schools", candidates, rows: inGo };
  }
  return { status: "determined", school: candidates[0], rows: inGo };
}

/** 住所文字列から直接引く簡便版 */
export function lookupDistrictByAddress(address: string): DistrictLookupResult {
  const parts = parseBunkyoAddress(address);
  if (!parts) return { status: "not-found" };
  return lookupDistrict(parts);
}
