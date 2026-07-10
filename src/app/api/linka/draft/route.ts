// フェーズK-1｜POST /api/linka/draft — 会員（士業ドットコム）向け照会文の下書き
// ルール（指示書§4）：敬体200字以内・固有名詞を入れない・「ご返答は任意で、お断りいただいても差し支えありません」を必ず含む・受任/報酬に触れない。
// 失敗・検証NGは localDraft（デモ）へフォールバック。相談本文は扱わない（summaryの分野/地域/時期のみ）。
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getMember } from "@/lib/linka/directory";
import { localDraft, NAMEISH } from "@/lib/linka/demo";
import type { LinkaDraftResult, Summary } from "@/lib/linka/types";

export const runtime = "nodejs";
// /api/linka と同じくAI呼び出しのタイムアウト余裕（Vercel既定10sより延長）
export const maxDuration = 30;

const MODEL = process.env.LINKA_MODEL_MEMBER || "claude-haiku-4-5-20251001";
const REQUIRED_PHRASE = "ご返答は任意で、お断りいただいても差し支えありません";
const FIELD_MAX = 60;

const clean = (v: unknown): string => {
  const s = typeof v === "string" ? v.slice(0, FIELD_MAX) : "";
  // 固有名詞らしき断片は捨てて既定値へ（機微を通さない）
  return !s || NAMEISH.test(s) ? "未指定" : s;
};

export async function POST(req: Request) {
  let body: { memberId?: string; inqType?: string; summary?: Summary };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }
  const inqType = body.inqType === "b" || body.inqType === "c" ? body.inqType : "a";
  const member = body.memberId ? getMember(body.memberId) : undefined;
  if (!member) {
    return NextResponse.json({ error: "bad-request" }, { status: 400 });
  }
  const summary: Summary = {
    bunya: clean(body.summary?.bunya),
    chiiki: clean(body.summary?.chiiki),
    jiki: clean(body.summary?.jiki),
  };
  const fallback = (): LinkaDraftResult => ({ draft: localDraft(member.name, inqType, summary), demo: true });

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(fallback());
  }
  try {
    const typeLabel = inqType === "b" ? "空き確認(受任余力を聞く)" : inqType === "c" ? "分野確認(取扱の有無を聞く)" : "協力打診(関心の有無を聞く)";
    const client = new Anthropic();
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content:
            "士業ドットコムの照会文を1通だけ作成してください。種別:" + typeLabel +
            "。宛先:" + member.name + "先生。差出人は[あなたのお名前]のまま。案件情報:分野=" + (summary.bunya || "未指定") +
            "、地域=" + (summary.chiiki || "未指定") + "、時期=" + (summary.jiki || "未指定") +
            "。ルール:敬体・200字以内・固有名詞や顧客情報を入れない・「" + REQUIRED_PHRASE + "」を必ず含める・受任や報酬に触れない。本文のみ出力。",
        },
      ],
    });
    const text = res.content.map((b) => (b.type === "text" ? b.text : "")).join("").trim();
    // サーバ検証：必須文言・長さ・固有名詞（宛先名は除いて判定）
    const bodyOnly = text.replaceAll(member.name, "");
    if (!text || !text.includes(REQUIRED_PHRASE) || text.length > 400 || NAMEISH.test(bodyOnly)) {
      return NextResponse.json(fallback());
    }
    const result: LinkaDraftResult = { draft: text };
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(fallback());
  }
}
