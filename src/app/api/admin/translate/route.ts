import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { verifyAdminRequest, AuthError } from "@/lib/api-auth";
import { rateLimit } from "@/lib/rate-limit";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

type TranslateRequest = {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  keywords: string[];
  tags: string[];
  targetLangs: string[];
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
    const body = (await req.json()) as TranslateRequest;
    const { title, excerpt, content, category, keywords, tags, targetLangs } =
      body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "タイトルと本文は必須です" },
        { status: 400 },
      );
    }

    const langNames: Record<string, string> = {
      en: "English",
      "zh-tw": "Traditional Chinese (繁體中文)",
      zh: "Simplified Chinese (简体中文)",
    };

    const langList = targetLangs
      .map((l) => `"${l}" (${langNames[l] ?? l})`)
      .join(", ");

    const prompt = `You are a professional translator specializing in SEO-optimized content for a Japanese real estate / legal / labor consulting company website.

Translate the following Japanese article into these languages: ${langList}

IMPORTANT RULES:
- Preserve ALL markdown formatting exactly (headings, lists, bold, links, etc.)
- Translate naturally for each target audience — not word-for-word
- Keep SEO keywords relevant to each language/locale market
- For zh-tw: use Traditional Chinese characters and Taiwan terminology
- For zh: use Simplified Chinese characters and mainland China terminology
- Keep proper nouns (company names, place names) in their commonly used form for each locale
- Do NOT add or remove content — translate faithfully

SOURCE CONTENT:
---
Title: ${title}
Excerpt: ${excerpt}
Category: ${category}
Keywords: ${JSON.stringify(keywords)}
Tags: ${JSON.stringify(tags)}

Body (Markdown):
${content}
---

Respond ONLY with a valid JSON object, no markdown code fence. The structure must be:
{
  "en": { "title": "...", "excerpt": "...", "content": "...", "category": "...", "keywords": [...], "tags": [...] },
  "zh-tw": { "title": "...", "excerpt": "...", "content": "...", "category": "...", "keywords": [...], "tags": [...] },
  "zh": { "title": "...", "excerpt": "...", "content": "...", "category": "...", "keywords": [...], "tags": [...] }
}

Only include the languages requested: ${targetLangs.join(", ")}`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response from Claude");
    }

    const text = textBlock.text.trim();
    const jsonStr = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");

    const translations = JSON.parse(jsonStr) as Record<
      string,
      {
        title: string;
        excerpt: string;
        content: string;
        category?: string;
        keywords?: string[];
        tags?: string[];
      }
    >;

    return NextResponse.json({ translations });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("Translation API error:", err);
    return NextResponse.json(
      { error: "翻訳の生成に失敗しました" },
      { status: 500 },
    );
  }
}
