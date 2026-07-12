// フェーズK-1｜POST /api/linka — LINKAのAIはサーバでのみ呼ぶ（キー秘匿・設計書§3）
// 三禁則の実装位置：
//   1) URGENT/NAMEISH はAI呼び出しの前段で決定論的に判定（機械的担保）
//   2) AI出力はサーバで検証（type・候補≥2・推薦語ゼロ・カタログ外サービス排除）→違反はデモへフォールバック
//   3) 相談本文はログに残さない（console出力・保存をしない）
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import {
  getColumns,
  getMembers,
  getSiteServices,
  getVideos,
  SAMURAI_FACILITATOR_URL,
} from "@/lib/linka/directory";
import {
  getAnonymizationMessage,
  getEscalationMessage,
  isNameish,
  isUrgent,
  localConcierge,
  localSearch,
  localTriage,
} from "@/lib/linka/demo";
import {
  resolveResult,
  validateLegalConciergeOutput,
  validateResolved,
  validateTranslatedLegalOutput,
  type RawResult,
} from "@/lib/linka/resolve";
import { isValidLocale } from "@/lib/locale";
import { SKILL_CUSTOMER, SKILL_MEMBER, skillConcierge } from "@/lib/linka/skills";
import type { LinkaResult, LinkaSite } from "@/lib/linka/types";

export const runtime = "nodejs";
// AI応答が6〜8秒かかるためVercel既定(10s)では混雑時にタイムアウト→デモ退避してしまう（2026-07-10実測6.7s）
export const maxDuration = 30;

const SITE_LABELS: Record<LinkaSite, string> = {
  samurai: "士業ドットコム",
  realestate: "四葉不動産",
  legal: "四葉行政書士事務所",
  labor: "四葉社会保険労務士事務所",
};

const MODEL_MEMBER = process.env.LINKA_MODEL_MEMBER || "claude-haiku-4-5-20251001";
const MODEL_TRIAGE = process.env.LINKA_MODEL_TRIAGE || "claude-sonnet-5";
// K-2c：翻訳パス（安価・高速な軽量モデルで足りる）
const MODEL_TRANSLATE = process.env.LINKA_MODEL_TRANSLATE || "claude-haiku-4-5-20251001";

const MAX_MESSAGE_LEN = 2000;

// ===== K-2c（2026-07-12）｜相談者の言語で回答する（日本語で生成→全ガード通過→翻訳） =====
// 方式＝浦松承認（2026-07-12）。**生成側 skills.ts の「回答は必ず日本語」は不変**。
// 理由：英中では「補助金（行政書士OK）」と「助成金（社労士のみ）」を機械的に区別できない。
// 生成を日本語に固定したまま既存の全ガード（推薦語・業際・仮名ゲート）を通し、**合格した日本語だけ**を
// 相談者の言語へ翻訳する。翻訳は検査済みの日本語を訳すだけ＝新たな助成金言及が入り得ない。
// 失敗・タイムアウト・翻訳後の再検査で違反 → **日本語の結果をそのまま返す**（fail-safe）。
const LANG_NAMES: Record<string, string> = {
  en: "English",
  "zh-tw": "繁體中文（台灣用語）",
  zh: "简体中文",
};

const TRANSLATE_SYSTEM = `あなたは翻訳者です。与えられたJSONの値のみを、指定された言語へ翻訳します。
# 絶対規則（違反したら失敗）
- 翻訳だけを行う。内容の追加・削除・要約・補足・推測・言い換えによる意味の変更を一切しない。
- JSONのキー名・構造・配列の要素数を変えない（要素を増やしても減らしてもいけない）。
- URL・id・電話番号・数値・固有名詞（サービス名の日本語表記が固有名として自然な場合）はそのまま残してよい。
- 原文に無い「推薦・順位付け」の語（best / recommend / 最適 / 一番 / おすすめ / 推薦 / 最佳 など）を新たに使わない。
- 原文に無い制度名・給付名（助成金 / employment grant など）を新たに導入しない。
- 出力はJSONのみ。前置き・説明・コードフェンスを書かない。`;

function parseJsonBlock(text: string): RawResult {
  const s = text.indexOf("{");
  const e = text.lastIndexOf("}");
  if (s === -1 || e <= s) throw new Error("no-json");
  const parsed = JSON.parse(text.slice(s, e + 1));
  if (!parsed || typeof parsed.type !== "string") throw new Error("bad-shape");
  return parsed as RawResult;
}

/** 翻訳ペイロード用の素直なJSONパース（typeフィールドを持たないため parseJsonBlock は使えない） */
function parseJsonObject(text: string): Record<string, unknown> {
  const s = text.indexOf("{");
  const e = text.lastIndexOf("}");
  if (s === -1 || e <= s) throw new Error("no-json");
  const parsed = JSON.parse(text.slice(s, e + 1));
  if (!parsed || typeof parsed !== "object") throw new Error("bad-shape");
  return parsed as Record<string, unknown>;
}

async function callAi(system: string, user: string, model: string): Promise<string> {
  const client = new Anthropic(); // ANTHROPIC_API_KEY はサーバ環境変数から
  const res = await client.messages.create({
    model,
    max_tokens: 1400,
    system: [
      // system＋名簿コンテキストは prompt caching（設計書§3）
      { type: "text", text: system, cache_control: { type: "ephemeral" } },
    ],
    messages: [{ role: "user", content: user }],
  });
  const text = res.content
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("");
  if (!text) throw new Error("empty");
  return text;
}

/**
 * K-2c｜検査済みの日本語結果を、相談者の言語へ翻訳して返す。
 * - 翻訳対象は**画面に出る自由文のみ**（message / kento / services.label / services.reason / escalateReason）。
 *   url・id・type・samuraiUrl・columns（実在記事のタイトル）は**触らない**＝リンク解決を壊さない。
 * - 翻訳後に ①三禁則の再検査（推薦語・4言語） ②legalは業際の語彙再検査（仮名ゲート除く）を通す。
 * - どこかで失敗したら **null** を返し、呼び出し側は**日本語の結果をそのまま返す**（fail-safe）。
 * - 相談本文はここに渡さない。ログにも出さない（違反種別のみ）。
 */
async function translateResolved(
  resolved: LinkaResult,
  locale: string,
  site: LinkaSite,
): Promise<LinkaResult | null> {
  const langName = LANG_NAMES[locale];
  if (!langName) return null;

  const payload: {
    message?: string;
    kento?: string[];
    services?: { label: string; reason?: string }[];
    escalateReason?: string;
  } = {};
  if ("message" in resolved && typeof resolved.message === "string" && resolved.message) {
    payload.message = resolved.message;
  }
  if (resolved.type === "concierge") {
    if (resolved.kento?.length) payload.kento = [...resolved.kento];
    if (resolved.services?.length) {
      payload.services = resolved.services.map((s) => ({ label: s.label, reason: s.reason }));
    }
    if (resolved.escalateReason) payload.escalateReason = resolved.escalateReason;
  }
  if (Object.keys(payload).length === 0) return null;

  try {
    const raw = await callAi(
      TRANSLATE_SYSTEM,
      `# 翻訳先の言語\n${langName}\n\n# 翻訳対象JSON（値のみ翻訳・構造は不変）\n${JSON.stringify(payload)}`,
      MODEL_TRANSLATE,
    );
    const t = parseJsonObject(raw);

    const out = { ...resolved } as LinkaResult;
    if (typeof t.message === "string" && t.message.trim()) {
      (out as { message?: string }).message = t.message;
    }
    if (out.type === "concierge" && resolved.type === "concierge") {
      // 要素数が一致する場合のみ採用（AIが増減させたら翻訳を捨てる＝改変の混入を防ぐ）
      if (Array.isArray(t.kento) && payload.kento && t.kento.length === payload.kento.length) {
        out.kento = t.kento.map((k) => String(k));
      }
      if (
        Array.isArray(t.services) &&
        payload.services &&
        t.services.length === payload.services.length
      ) {
        const ts = t.services as { label?: unknown; reason?: unknown }[];
        // url は**必ず元の解決済み値を保持**（翻訳させない＝リンクが壊れない）
        out.services = resolved.services.map((s, i) => ({
          label: typeof ts[i]?.label === "string" && ts[i].label ? (ts[i].label as string) : s.label,
          url: s.url,
          reason:
            typeof ts[i]?.reason === "string" && ts[i].reason ? (ts[i].reason as string) : s.reason,
        }));
      }
      if (typeof t.escalateReason === "string" && t.escalateReason.trim()) {
        out.escalateReason = t.escalateReason;
      }
    }

    // 翻訳後の再検査（防御の多層化）。違反なら翻訳を捨てて日本語を返す。
    const v = validateResolved(out) ?? (site === "legal" ? validateTranslatedLegalOutput(out) : null);
    if (v) {
      console.warn("[linka] translate post-validate fallback:", v);
      return null;
    }
    return out;
  } catch {
    console.warn("[linka] translate error fallback");
    return null;
  }
}

export async function POST(req: Request) {
  let body: { site?: string; mode?: string; message?: string; locale?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }
  const site = body.site as LinkaSite;
  const mode = body.mode;
  const message = typeof body.message === "string" ? body.message.slice(0, MAX_MESSAGE_LEN) : "";
  // K-2a（2026-07-12）：安全メッセージのロケール選択用。不正値・未指定はja（判定ロジック自体はlocale非依存＝常時4言語）
  const locale = typeof body.locale === "string" && isValidLocale(body.locale) ? body.locale : "ja";

  // サイト×モードの許可表（コーポレートはconciergeのみ＝名簿を出さない）
  const allowed =
    (site === "samurai" && (mode === "member" || mode === "customer")) ||
    ((site === "realestate" || site === "legal" || site === "labor") && mode === "concierge");
  if (!allowed || !message.trim()) {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }

  // 社労士ガード：開業（SR_LAUNCHED=true）まで site=labor を受けない（指示書§7）
  if (site === "labor" && process.env.NEXT_PUBLIC_SR_LAUNCHED !== "true") {
    return NextResponse.json({ error: "not-found" }, { status: 404 });
  }

  // 前段の決定論的ガード（AIより先・全モード共通）
  // K-2a（2026-07-12）：4言語判定（既存jaパターン不変＝isUrgent/isNameishが内包）＋locale別安全メッセージ
  if (isUrgent(message)) {
    const r: LinkaResult = { type: "escalation", message: getEscalationMessage(locale) };
    return NextResponse.json(r);
  }
  if (isNameish(message)) {
    const r: LinkaResult = { type: "anonymization_request", message: getAnonymizationMessage(locale) };
    return NextResponse.json(r);
  }

  const demoFallback = (): LinkaResult =>
    site === "samurai"
      ? mode === "customer"
        ? localTriage(message, locale)
        : localSearch(message, locale)
      : localConcierge(message, site as "realestate" | "legal" | "labor", locale);

  // APIキー未設定環境＝デモで応答（ローカル・プレビュー用）
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(demoFallback());
  }

  try {
    let raw: RawResult;
    if (site === "samurai") {
      const skill = mode === "customer" ? SKILL_CUSTOMER : SKILL_MEMBER;
      const db = getMembers().map(({ id, shikaku, bunya, lang, area, taio, catch: c }) => ({ id, shikaku, bunya, lang, area, taio, catch: c }));
      const cols = getColumns().map(({ id, title, author, tags }) => ({ id, title, author, tags }));
      const vids = getVideos().map(({ id, theme, tags, type }) => ({ id, theme, tags, type }));
      const system =
        skill +
        "\n\n# 名簿(samurai.co.jp掲載・公開情報)\n" + JSON.stringify(db) +
        "\n\n# 公開コラム\n" + JSON.stringify(cols) +
        "\n\n# 公式YouTube動画(テーマ)\n" + JSON.stringify(vids);
      const model = mode === "customer" ? MODEL_TRIAGE : MODEL_MEMBER;
      raw = parseJsonBlock(await callAi(system, "# 相談\n" + message, model));
    } else {
      const conf = getSiteServices(site);
      const skill = skillConcierge(SITE_LABELS[site], conf.services);
      const cols = getColumns().map(({ id, title, author, tags }) => ({ id, title, author, tags }));
      const system = skill + "\n\n# 参考コラム(士業ドットコム)\n" + JSON.stringify(cols);
      raw = parseJsonBlock(await callAi(system, "# 相談\n" + message, MODEL_MEMBER));
      raw.samuraiUrl = SAMURAI_FACILITATOR_URL;
      // conciergeのservicesは自社カタログlabelのみ許可（url解決＝カタログ外は落ちる）
      if (raw.services) {
        const resolvedServices: { label: string; url: string; reason?: string }[] = [];
        for (const sv of raw.services) {
          const m = conf.services.find((x) => x.label === sv.label);
          if (m) resolvedServices.push({ label: m.label, url: m.url, reason: sv.reason });
        }
        raw.services = resolvedServices;
      }
    }
    const resolved = resolveResult(raw);
    let violation = validateResolved(resolved);
    // 業際（指示書§9-4・K-2a多言語化 2026-07-12＝(c)併用方式）：行政書士サイトのAI出力を検査（分界説明はデモ側の定型のみ許可）。
    // ①既存includes("助成金")維持 ②多言語文脈語 ③言語ゲート（仮名ゼロ→デモ退避）＋escalateReasonも検査対象（既存穴A-3の修正）。
    if (!violation && site === "legal" && resolved.type === "concierge") {
      violation = validateLegalConciergeOutput(resolved);
    }
    if (violation) {
      // 三禁則違反はAI出力を破棄してデモへ（相談本文はログしない＝違反種別のみ）
      console.warn("[linka] validation fallback:", violation);
      return NextResponse.json(demoFallback());
    }

    // K-2c（2026-07-12）：ここに来た時点で resolved は**日本語かつ全ガード合格**。
    // 相談者が日本語以外なら、その言語へ翻訳して返す（翻訳失敗・再検査違反なら日本語のまま）。
    // ※escalation・anonymization はAI呼び出し前に locale 別メッセージで返却済み＝ここには来ない。
    // ※デモ退避（demoFallback）は既に locale 別＝翻訳不要。
    if (locale !== "ja") {
      const translated = await translateResolved(resolved, locale, site);
      if (translated) return NextResponse.json(translated);
    }
    return NextResponse.json(resolved);
  } catch {
    // 例外内容に相談本文が混ざり得るため、詳細はログしない
    console.warn("[linka] ai error fallback");
    return NextResponse.json(demoFallback());
  }
}
