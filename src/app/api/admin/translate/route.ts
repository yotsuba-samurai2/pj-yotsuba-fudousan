import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { verifyAdminRequest, AuthError } from "@/lib/api-auth";
import { rateLimit } from "@/lib/rate-limit";
import { getAiModel } from "@/lib/db/aiSettings";

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
  author?: { name: string; title: string };
  targetLangs: string[];
};

export async function POST(req: NextRequest) {
  try {
    // Rate limit check
    const { success: withinLimit } = rateLimit(req);
    if (!withinLimit) {
      return NextResponse.json(
        {
          error:
            "リクエスト数が上限を超えました。しばらく待ってから再試行してください",
        },
        { status: 429 },
      );
    }

    // Auth verification
    await verifyAdminRequest(req);
    const body = (await req.json()) as TranslateRequest;
    const {
      title,
      excerpt,
      content,
      category,
      keywords,
      tags,
      author,
      targetLangs,
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "タイトルと本文は必須です" },
        { status: 400 },
      );
    }

    const langNames: Record<string, string> = {
      en: "English",
      "zh-tw": "Traditional Chinese (繁體中文, Taiwan terminology)",
      zh: "Simplified Chinese (简体中文, mainland China terminology)",
    };

    type Translation = {
      title: string;
      excerpt: string;
      content: string;
      category?: string;
      keywords?: string[];
      tags?: string[];
      author?: { name: string; title: string };
    };

    const model = await getAiModel();

    const translateOne = async (lang: string): Promise<Translation> => {
      const langName = langNames[lang] ?? lang;

      const prompt = `You are a professional translator specializing in SEO-optimized content for a Japanese real estate company website.

Translate the following Japanese article into ${langName}.

RULES:
- Preserve ALL markdown formatting exactly in the body (headings, lists, bold, links, code blocks, tables, etc.)
- Translate naturally for the target audience — not word-for-word
- Keep SEO keywords relevant to the target language/locale market
- Keep proper nouns (company names, place names) in their commonly used form for the locale
- For the author name: transliterate Japanese personal names into the commonly used form for the target language (e.g. romaji for English, the standard Chinese rendering for zh / zh-tw). Do NOT translate it word-by-word.
- For the author title (job title / role): translate naturally into the target language.
- Do NOT add or remove content — translate faithfully

SOURCE (Japanese):
<TITLE>${title}</TITLE>
<EXCERPT>${excerpt}</EXCERPT>
<CATEGORY>${category}</CATEGORY>
<KEYWORDS>${keywords.join(", ")}</KEYWORDS>
<TAGS>${tags.join(", ")}</TAGS>
<AUTHOR_NAME>${author?.name ?? ""}</AUTHOR_NAME>
<AUTHOR_TITLE>${author?.title ?? ""}</AUTHOR_TITLE>
<BODY>
${content}
</BODY>

OUTPUT FORMAT — respond EXACTLY in this structure, no extra commentary, no code fences:

<TITLE>translated title</TITLE>
<EXCERPT>translated excerpt</EXCERPT>
<CATEGORY>translated category</CATEGORY>
<KEYWORDS>kw1, kw2, kw3</KEYWORDS>
<TAGS>tag1, tag2, tag3</TAGS>
<AUTHOR_NAME>translated author name</AUTHOR_NAME>
<AUTHOR_TITLE>translated author title</AUTHOR_TITLE>
<BODY>
translated markdown body (preserve all markdown syntax exactly)
</BODY>`;

      const message = await anthropic.messages.create({
        model,
        max_tokens: 8192,
        messages: [{ role: "user", content: prompt }],
      });

      const textBlock = message.content.find((b) => b.type === "text");
      if (!textBlock || textBlock.type !== "text") {
        throw new Error(`No text response from Claude for ${lang}`);
      }

      const text = textBlock.text;

      const pick = (tag: string): string => {
        const re = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i");
        const m = text.match(re);
        return m ? m[1].trim() : "";
      };

      const parseList = (s: string): string[] =>
        s
          .split(/[,、]/)
          .map((x) => x.trim())
          .filter(Boolean);

      const bodyRaw = pick("BODY");
      if (!bodyRaw) {
        throw new Error(`Empty body in ${lang} translation response`);
      }

      const authorName = pick("AUTHOR_NAME");
      const authorTitle = pick("AUTHOR_TITLE");

      return {
        title: pick("TITLE"),
        excerpt: pick("EXCERPT"),
        content: bodyRaw,
        category: pick("CATEGORY") || undefined,
        keywords: parseList(pick("KEYWORDS")),
        tags: parseList(pick("TAGS")),
        author:
          authorName || authorTitle
            ? { name: authorName, title: authorTitle }
            : undefined,
      };
    };

    const results = await Promise.all(
      targetLangs.map(
        async (lang) => [lang, await translateOne(lang)] as const,
      ),
    );

    const translations: Record<string, Translation> = {};
    for (const [lang, t] of results) translations[lang] = t;

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
