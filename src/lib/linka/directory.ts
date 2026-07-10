// フェーズK-2｜LINKA データアクセス層（設計書§4）
// 実体はJSON（src/data/linka/*.json）。将来Supabaseに差し替えても呼び出し側は不変。
// 公開情報のみ・相談本文は保存しない。サーバ側でのみ使用する（クライアントに名簿を配らない）。
import type {
  ColumnCard,
  ColumnEntry,
  Member,
  SiteService,
  SiteServiceConfig,
  VideoEntry,
} from "./types";
import membersJson from "@/data/linka/members.json";
import columnsJson from "@/data/linka/columns.json";
import videosJson from "@/data/linka/videos.json";
import siteServicesJson from "@/data/linka/site-services.json";

export const PROFILE_BASE = "https://www.samurai.co.jp/samurai/reserve/";
export const COLUMN_BASE = "https://www.samurai.co.jp/columns/";
export const SAMURAI_FACILITATOR_URL = "https://www.samurai.co.jp/"; // 本番: ai.samurai.co.jp（移設時に変更）
export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@samurai0428";
export const YOUTUBE_CHANNEL_URL_TW = "https://www.youtube.com/@samurai-tw";
export const LINE_URL = "https://line.me/ti/p/EF5782JXqJ";

/** オプトイン必須運用（本番=true想定・既定false=プロトどおり「未取得」明示で全員対象） */
export const REQUIRE_OPTIN = process.env.LINKA_REQUIRE_OPTIN === "true";

const members = membersJson as Member[];
const columns = columnsJson as ColumnEntry[];
const videos = videosJson as VideoEntry[];
const siteServices = siteServicesJson as Record<
  "realestate" | "legal" | "labor",
  SiteServiceConfig
>;

/** 名簿（requireOptin=trueならai_shokai_ok!==trueを除外） */
export function getMembers(opts?: { requireOptin?: boolean }): Member[] {
  const req = opts?.requireOptin ?? REQUIRE_OPTIN;
  return req ? members.filter((m) => m.ai_shokai_ok === true) : members;
}

export function getMember(id: string): Member | undefined {
  return members.find((m) => m.id === id);
}

export function getColumns(): ColumnEntry[] {
  return columns;
}

export function getVideos(): VideoEntry[] {
  return videos;
}

/** コーポレート3サイトの自社サービス設定（laborの配信可否は呼び出し側＝APIがSR_LAUNCHEDでゲート） */
export function getSiteServices(
  site: "realestate" | "legal" | "labor",
): SiteServiceConfig {
  return siteServices[site];
}

export function columnUrl(c: ColumnEntry): string {
  return c.slug ? COLUMN_BASE + c.slug : "https://www.samurai.co.jp/";
}

export function videoUrl(v: VideoEntry): string {
  return v.url ? v.url : YOUTUBE_CHANNEL_URL;
}

export function profileUrl(memberId: string): string {
  return PROFILE_BASE + memberId;
}

/** コラムidカード解決（存在しないidは黙って落とす） */
export function resolveColumnCards(
  refs: { id: string; reason?: string }[] | undefined,
): ColumnCard[] {
  if (!refs) return [];
  const out: ColumnCard[] = [];
  for (const r of refs) {
    const c = columns.find((x) => x.id === r.id);
    if (!c) continue;
    const author = c.author ? members.find((m) => m.id === c.author) : null;
    out.push({
      id: c.id,
      title: c.title,
      url: columnUrl(c),
      tags: c.tags,
      date: c.date,
      authorName: author ? author.name : null,
      reason: r.reason ?? "",
    });
  }
  return out;
}

/** サービスlabel→自社カタログ解決（カタログ外labelは落とす＝サーバ検証を兼ねる） */
export function resolveServiceCards(
  refs: { label: string; reason?: string }[] | undefined,
  catalog: SiteService[],
): { label: string; url: string; reason: string }[] {
  if (!refs) return [];
  const out: { label: string; url: string; reason: string }[] = [];
  for (const r of refs) {
    const s = catalog.find((x) => x.label === r.label);
    if (!s) continue; // カタログ外＝AIの捏造は返さない
    out.push({ label: s.label, url: s.url, reason: r.reason ?? "" });
  }
  return out;
}
