import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { verifyAdminRequest, AuthError } from "@/lib/api-auth";
import { rateLimit } from "@/lib/rate-limit";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

type GenerateSeoRequest = {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  business: string;
};

export async function POST(req: NextRequest) {
  try {
    // Rate limit check
    const { success: withinLimit } = rateLimit(req);
    if (!withinLimit) {
      return NextResponse.json(
        { error: "リクエスト数が上限を超えました。しばらく待ってから再試行してください" },
        { status: 429 },
      );
    }

    // Auth verification
    await verifyAdminRequest(req);
    const body = (await req.json()) as GenerateSeoRequest;
    const { title, excerpt, content, category, business } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "タイトルと本文は必須です" },
        { status: 400 },
      );
    }

    const businessNames: Record<string, string> = {
      realestate: "不動産（外国人向け賃貸・売買）",
      legal: "行政書士（ビザ・許認可・会社設立）",
      labor: "社会保険労務士（労務・助成金）",
    };

    const prompt = `You are an SEO specialist for a Japanese ${businessNames[business] ?? "ビジネス"} company website.

Based on the following article, generate SEO keywords and tags in Japanese.

ARTICLE:
---
Title: ${title}
Excerpt: ${excerpt}
Category: ${category}
Body: ${content.slice(0, 3000)}
---

RULES:
- Keywords: 3-5 SEO keywords that users would search for. Mix of short-tail and long-tail.
- Tags: 3-5 topic tags for categorization.
- All in Japanese.
- Focus on search intent of foreigners living in Japan (or companies hiring foreigners).

Respond ONLY with a valid JSON object, no markdown code fence:
{"keywords": ["keyword1", "keyword2", ...], "tags": ["tag1", "tag2", ...]}`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response from Claude");
    }

    const text = textBlock.text.trim();
    const jsonStr = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    const result = JSON.parse(jsonStr) as {
      keywords: string[];
      tags: string[];
    };

    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("SEO generation error:", err);
    return NextResponse.json(
      { error: "SEOキーワードの生成に失敗しました" },
      { status: 500 },
    );
  }
}
