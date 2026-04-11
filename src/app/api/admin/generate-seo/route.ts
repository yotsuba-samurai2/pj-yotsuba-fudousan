import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { verifyAdminRequest, AuthError } from "@/lib/api-auth";
import { rateLimit } from "@/lib/rate-limit";
import { getAiModel } from "@/lib/firestore/aiSettings";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

type GenerateSeoRequest = {
  title: string;
  excerpt: string;
  content: string;
  category: string;
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
    const { title, excerpt, content, category } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "タイトルと本文は必須です" },
        { status: 400 },
      );
    }

    const prompt = `You are an SEO specialist. This article is published by a Japanese real estate company's website.

Your task is to generate SEO keywords and tags based on the ACTUAL content of the article below. The title, category, excerpt, and body are the single source of truth — read them carefully and produce keywords that match this specific article's topic.

ARTICLE:
---
Title: ${title}
Category: ${category}
Excerpt: ${excerpt}
Body: ${content.slice(0, 3000)}
---

RULES:
- Keywords: 3-5 SEO keywords that real users would actually search for to find THIS specific article. Mix short-tail and long-tail.
- Tags: 3-5 topic tags for site-internal categorization.
- All output must be in Japanese.
- Reflect the article's actual topic and intent. Do NOT inject generic real estate terms that are not relevant to this particular article.
- Avoid keyword stuffing and avoid duplicating the same concept across keywords and tags.

Respond ONLY with a valid JSON object, no markdown code fence:
{"keywords": ["keyword1", "keyword2", ...], "tags": ["tag1", "tag2", ...]}`;

    const message = await anthropic.messages.create({
      model: await getAiModel(),
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
