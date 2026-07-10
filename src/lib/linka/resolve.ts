// フェーズK-1｜id参照の生結果（AI/デモ出力）→ サーバ解決済みカード（LinkaResult）への変換＋検証
// - クライアントに名簿JSONを配らないため、候補・コラム・動画・サービスはここで実体化する
// - 三禁則①（候補≥2）・推薦語ゼロ・カタログ外サービス排除のサーバ検証もここ（設計書§3・指示書§4）
import {
  getColumns,
  getMember,
  getVideos,
  profileUrl,
  resolveColumnCards,
  videoUrl,
} from "./directory";
import type {
  CandidateCard,
  ColumnCard,
  LinkaResult,
  Summary,
  VideoCard,
} from "./types";

/** 推薦語（三禁則①「選ばない」）。出力文字列のどこにも含めない */
export const BANNED_RECO_WORDS = ["最適", "一番", "おすすめ", "オススメ", "お勧め", "イチオシ", "ベスト", "No.1", "ナンバーワン"];

export interface RawCandidateRef { id: string; reasons?: string[] }
export interface RawColumnRef { id: string; reason?: string }
export interface RawVideoRef { id: string; reason?: string }
export interface RawServiceRef { label: string; url?: string; reason?: string }

export type RawResult = {
  type: string;
  message?: string;
  demo?: boolean;
  kento?: string[];
  candidates?: RawCandidateRef[];
  columns?: RawColumnRef[];
  videos?: RawVideoRef[];
  services?: RawServiceRef[];
  escalate?: boolean;
  escalateReason?: string;
  summary?: Summary;
  samuraiUrl?: string;
};

export function resolveCandidateCards(refs: RawCandidateRef[] | undefined): CandidateCard[] {
  if (!refs) return [];
  const columns = getColumns();
  const out: CandidateCard[] = [];
  for (const r of refs) {
    const m = getMember(r.id);
    if (!m) continue; // 名簿に無いid＝AIの捏造は返さない
    const authored = columns
      .filter((c) => c.author === m.id)
      .map((c) => ({ title: c.title, url: c.slug ? "https://www.samurai.co.jp/columns/" + c.slug : "https://www.samurai.co.jp/" }));
    out.push({
      id: m.id, name: m.name, shikaku: m.shikaku, mark: m.mark, catch: m.catch,
      bunya: m.bunya, lang: m.lang, area: m.area, taio: m.taio,
      profileUrl: profileUrl(m.id),
      reasons: r.reasons ?? [],
      optin: m.ai_shokai_ok === true ? "ok" : "unknown",
      authoredColumns: authored,
    });
  }
  return out;
}

export function resolveVideoCards(refs: RawVideoRef[] | undefined): VideoCard[] {
  if (!refs) return [];
  const out: VideoCard[] = [];
  for (const r of refs) {
    const v = getVideos().find((x) => x.id === r.id);
    if (!v) continue;
    out.push({ id: v.id, theme: v.theme, url: videoUrl(v), tags: v.tags, type: v.type, reason: r.reason ?? "" });
  }
  return out;
}

export function resolveColumns(refs: RawColumnRef[] | undefined): ColumnCard[] {
  return resolveColumnCards(refs);
}

/** 生結果→解決済みLinkaResult。型不明・検証不能はnullを返す（呼び出し側でデモへフォールバック） */
export function resolveResult(raw: RawResult): LinkaResult {
  switch (raw.type) {
    case "anonymization_request":
    case "clarify":
    case "escalation":
      return { type: raw.type, message: raw.message ?? "", demo: raw.demo } as LinkaResult;
    case "candidates":
      return {
        type: "candidates", demo: raw.demo,
        message: raw.message ?? "",
        candidates: resolveCandidateCards(raw.candidates),
        columns: resolveColumns(raw.columns),
        videos: resolveVideoCards(raw.videos),
        summary: raw.summary,
      };
    case "triage":
      return {
        type: "triage", demo: raw.demo,
        kento: raw.kento ?? [],
        message: raw.message ?? "",
        candidates: resolveCandidateCards(raw.candidates),
        columns: resolveColumns(raw.columns),
        videos: resolveVideoCards(raw.videos),
        summary: raw.summary,
      };
    case "concierge":
      return {
        type: "concierge", demo: raw.demo,
        kento: raw.kento ?? [],
        message: raw.message ?? "",
        services: (raw.services ?? []).map((s) => ({ label: s.label, url: s.url ?? "", reason: s.reason ?? "" })),
        escalate: raw.escalate === true,
        escalateReason: raw.escalateReason,
        columns: resolveColumns(raw.columns),
        summary: raw.summary,
        samuraiUrl: raw.samuraiUrl ?? "https://www.samurai.co.jp/",
      };
    default:
      // 未知typeは安全側＝clarify
      return { type: "clarify", message: "うまく読み取れませんでした。お困りごとを、もう少し詳しく（匿名で）お聞かせください。" };
  }
}

/** 三禁則のサーバ検証：違反ならエラー文字列（呼び出し側でデモへフォールバック） */
export function validateResolved(result: LinkaResult): string | null {
  const text = JSON.stringify(result);
  for (const w of BANNED_RECO_WORDS) {
    if (text.includes(w)) return `推薦語検出: ${w}`;
  }
  if (result.type === "candidates" || result.type === "triage") {
    if (!result.candidates || result.candidates.length < 2) return "候補が2件未満";
  }
  return null;
}
