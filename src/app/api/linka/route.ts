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
  ANONYMIZATION_MESSAGE,
  ESCALATION_MESSAGE,
  localConcierge,
  localSearch,
  localTriage,
  NAMEISH,
  URGENT,
} from "@/lib/linka/demo";
import { resolveResult, validateResolved, type RawResult } from "@/lib/linka/resolve";
import { SKILL_CUSTOMER, SKILL_MEMBER, skillConcierge } from "@/lib/linka/skills";
import type { LinkaResult, LinkaSite } from "@/lib/linka/types";

export const runtime = "nodejs";
// AI応答が6〜8秒かかるためVercel既定(10s)では混雑時にタイムアウト→デモ退避してしまう（2026-07-10実測6.7s）
export const maxDuration = 30;

const SITE_LABELS: Record<LinkaSite, string> = {
  samurai: "士業ドットコム SAMURAI",
  realestate: "四葉不動産",
  legal: "四葉行政書士事務所",
  labor: "四葉社会保険労務士事務所",
};

const MODEL_MEMBER = process.env.LINKA_MODEL_MEMBER || "claude-haiku-4-5-20251001";
const MODEL_TRIAGE = process.env.LINKA_MODEL_TRIAGE || "claude-sonnet-5";

const MAX_MESSAGE_LEN = 2000;

function parseJsonBlock(text: string): RawResult {
  const s = text.indexOf("{");
  const e = text.lastIndexOf("}");
  if (s === -1 || e <= s) throw new Error("no-json");
  const parsed = JSON.parse(text.slice(s, e + 1));
  if (!parsed || typeof parsed.type !== "string") throw new Error("bad-shape");
  return parsed as RawResult;
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

export async function POST(req: Request) {
  let body: { site?: string; mode?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }
  const site = body.site as LinkaSite;
  const mode = body.mode;
  const message = typeof body.message === "string" ? body.message.slice(0, MAX_MESSAGE_LEN) : "";

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
  if (URGENT.some((k) => message.includes(k))) {
    const r: LinkaResult = { type: "escalation", message: ESCALATION_MESSAGE };
    return NextResponse.json(r);
  }
  if (NAMEISH.test(message)) {
    const r: LinkaResult = { type: "anonymization_request", message: ANONYMIZATION_MESSAGE };
    return NextResponse.json(r);
  }

  const demoFallback = (): LinkaResult =>
    site === "samurai"
      ? mode === "customer"
        ? localTriage(message)
        : localSearch(message)
      : localConcierge(message, site as "realestate" | "legal" | "labor");

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
    // 業際（指示書§9-4）：行政書士サイトのAI出力に「助成金」が混入したらデモへ（分界説明はデモ側の定型のみ許可）
    if (!violation && site === "legal" && resolved.type === "concierge") {
      const visible = JSON.stringify({ kento: resolved.kento, message: resolved.message, services: resolved.services });
      if (visible.includes("助成金")) violation = "業際: legal出力に助成金";
    }
    if (violation) {
      // 三禁則違反はAI出力を破棄してデモへ（相談本文はログしない＝違反種別のみ）
      console.warn("[linka] validation fallback:", violation);
      return NextResponse.json(demoFallback());
    }
    return NextResponse.json(resolved);
  } catch {
    // 例外内容に相談本文が混ざり得るため、詳細はログしない
    console.warn("[linka] ai error fallback");
    return NextResponse.json(demoFallback());
  }
}
