import type { LangCode } from "@/config/languages";
import ja from "@/lib/data/layout-translations/ja.json";
import en from "@/lib/data/layout-translations/en.json";
import zhTw from "@/lib/data/layout-translations/zh-tw.json";
import zh from "@/lib/data/layout-translations/zh.json";

type Dictionary = Record<string, unknown>;
const layouts: Record<LangCode, Dictionary> = { ja, en, "zh-tw": zhTw, zh };

function isDictionary(value: unknown): value is Dictionary {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * Server payload preparation only: do not import into client components.
 * Public header/footer copy captured on 2026-09-13 is a small fallback, not a
 * replacement for DB translations. Keep it in sync when changing layout copy.
 * A failed DB read currently returns {}, which must never expose navigation keys.
 */
export function withLayoutTranslations(locale: LangCode, source: Dictionary): Dictionary {
  function fill(defaults: Dictionary, input: unknown, prefix = ""): Dictionary {
    const result: Dictionary = isDictionary(input) ? { ...input } : {};
    for (const [key, fallback] of Object.entries(defaults)) {
      const path = prefix ? `${prefix}.${key}` : key;
      const current = result[key];
      if (isDictionary(fallback)) {
        result[key] = fill(fallback, current, path);
      } else if (typeof current !== "string" || current === path) {
        // Empty strings are intentional for optional notices; retain them.
        result[key] = fallback;
      }
    }
    return result;
  }
  return fill(layouts[locale], source);
}
