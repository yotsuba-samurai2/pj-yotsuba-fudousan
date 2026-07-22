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

/** 推薦語（三禁則①「選ばない」）。出力文字列のどこにも含めない
 *  K-2a（2026-07-12）4言語化：既存ja9語は不変＝中文（簡繁）を追加のみ。enは下のBANNED_RECO_PATTERNS_EN（単語境界＋小文字化）で照合 */
// 2026-07-22（浦松決定・samurai-app PR#63/2026-07-17と同一標準へ統一）：「おすすめ・オススメ・お勧め」の3語を検証対象から除外。
//   理由＝日常語として頻出しAI応答が回らないため（本番実測）。順位・優劣語（最適・一番・ベスト等）は維持。
//   代償措置＝結果カードに「順位・推薦ではありません」注記を常時表示（ResultView.tsx:184）。
//   正本＝linka-bot-complianceスキル第3条。⚠️ 石井弁護士への事後確認を残タスクとする（免責文言との整合）。
export const BANNED_RECO_WORDS = [
  "最適", "一番", "イチオシ", "ベスト", "No.1", "ナンバーワン",
  // 中文（簡繁両表記・字面includes・診断書E-1）
  "推薦", "推荐", "首選", "首选", "最好", "最佳", "最合適", "最适合",
];
/** en推薦語（K-2a 2026-07-12）：小文字化した出力全文に対し単語境界で照合（"best"⊂"asbestos"型の誤検知防止・診断書E-1） */
export const BANNED_RECO_PATTERNS_EN: RegExp[] = [
  /\bbest\b/,
  /\brecommend/, // recommend/recommends/recommended/recommendation
  /\btop choice\b/,
  /\bno\.\s?1\b/,
  /\bnumber one\b/,
];

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
  // K-2a（2026-07-12）：en推薦語は小文字化＋単語境界で照合（機構は言語非依存のまま語彙を拡張＝強化のみ）
  const lower = text.toLowerCase();
  for (const re of BANNED_RECO_PATTERNS_EN) {
    if (re.test(lower)) return `推薦語検出(en): ${re.source}`;
  }
  if (result.type === "candidates" || result.type === "triage") {
    if (!result.candidates || result.candidates.length < 2) return "候補が2件未満";
  }
  return null;
}

// ===== K-2a 業際チェック（2026-07-12・(c)併用方式＝浦松承認済）=====
// legalサイトのAI出力（concierge）の画面表示され得る全フィールドを検査する。
// ①既存includes("助成金")維持 ②多言語文脈語（雇用関係助成金の文脈のみ・「補助金」単独は行政書士OKのため対象外）
// ③言語ゲート＝仮名（ひらがな・カタカナ）が1文字も無ければ「非日本語出力の疑い」（skills.tsのja固定指示のプロンプト遵守失敗を決定論で塞ぐ）
// 違反はデモ退避（迷ったら通さない）。デモ側定型（escalateNoteの分界説明）はここを通らない＝従来どおり許可。
// escalateReasonを検査対象に含める＝診断書(A-3)の既存穴の修正。
/** 雇用関係助成金の文脈語（ja／zh-tw／zh・字面includes。診断書(C)語彙案。中文は雇用・就業との複合語のみ＝「補助/补助」単独は登録しない） */
export const GYOSAI_CONTEXT_WORDS = [
  // ja（「助成金」は既存チェックとして先に単独判定）
  "雇用保険", "労働保険", "社会保険", "労務", "キャリアアップ", "雇用調整", "処遇改善",
  // zh-tw
  "僱用補助", "就業補助金", "僱用保險", "勞動保險", "社會保險", "勞務", "就業保險",
  // zh
  "雇用补助", "就业补助金", "雇用保险", "劳动保险", "社会保险", "劳务", "就业保险",
];
/** 同・en（小文字化includes・必ず2語連結＝"labor"/"grant"単独は過広のため登録しない。診断書(C)注意点） */
export const GYOSAI_CONTEXT_EN = [
  "employment grant", "hiring subsidy", "employment subsidy", "wage subsidy", "payroll subsidy",
  "employment insurance", "labor insurance", "labour insurance", "social insurance",
];
/** 仮名（ひらがな・カタカナ）1文字以上 */
const KANA_RE = /[ぁ-ゟァ-ヿ]/;

/** legalサイトのAI出力（concierge）の業際検証。違反なら種別のみの文字列（相談本文・出力本文は含めない） */
export function validateLegalConciergeOutput(result: LinkaResult): string | null {
  if (result.type !== "concierge") return null;
  // 画面表示され得る全フィールド（escalateReason含む＝既存穴A-3の修正）
  const visible = JSON.stringify({
    kento: result.kento,
    message: result.message,
    services: result.services,
    escalateReason: result.escalateReason ?? "",
  });
  if (visible.includes("助成金")) return "業際: legal出力に助成金";
  for (const w of GYOSAI_CONTEXT_WORDS) {
    if (visible.includes(w)) return "業際: legal出力に雇用助成金の文脈語";
  }
  const lower = visible.toLowerCase();
  for (const p of GYOSAI_CONTEXT_EN) {
    if (lower.includes(p)) return "業際: legal出力に雇用助成金の文脈語(en)";
  }
  if (!KANA_RE.test(visible)) return "業際: legal出力が非日本語の疑い(仮名ゼロ)";
  return null;
}

/**
 * K-2c（2026-07-12）｜**翻訳後**（非日本語）出力の業際検証。
 *
 * 設計の前提：生成は日本語のまま（skills.tsのja固定は不変）＝AI出力は上の
 * validateLegalConciergeOutput（仮名ゲート含む全ガード）に**合格済み**。ここはその
 * 合格した日本語を訳した結果に、翻訳が新たな違反語を持ち込んでいないかの**二重確認**。
 *
 * ⚠️ 仮名ゲートは適用しない（翻訳後は非日本語であることが正常なため）。語彙照合のみ。
 * 違反時の退避先は「デモ」ではなく「**検査済みの日本語結果**」＝安全かつ内容も正しい。
 */
export function validateTranslatedLegalOutput(result: LinkaResult): string | null {
  if (result.type !== "concierge") return null;
  const visible = JSON.stringify({
    kento: result.kento,
    message: result.message,
    services: result.services,
    escalateReason: result.escalateReason ?? "",
  });
  if (visible.includes("助成金")) return "業際(翻訳後): 助成金";
  for (const w of GYOSAI_CONTEXT_WORDS) {
    if (visible.includes(w)) return "業際(翻訳後): 雇用助成金の文脈語";
  }
  const lower = visible.toLowerCase();
  for (const p of GYOSAI_CONTEXT_EN) {
    if (lower.includes(p)) return "業際(翻訳後): 雇用助成金の文脈語(en)";
  }
  return null;
}
