import type { LangCode } from "@/config/languages";
import type { Column } from "@/lib/column-shared";

const MAINLAND_INHERITANCE_SLUG = "chugoku-tairiku-souzokunin-shinzoku-koshosho-ryoji-ninsho";
const TAIWAN_LINKS = [
  ["台湾户籍、除籍的取得", "/legal/column/taiwan-koseki-jokoseki-shutoku"],
  ["台湾的印鉴证明与遗产分割", "/legal/column/taiwan-inkan-shomei-isan-bunkatsu"],
] as const;

/**
 * 公開済みDB原稿の简体リンクだけを補正する。通常のCMS保存は全言語をIndexNowへ通知するため、
 * ここでは表示に限定する。将来、実データを対象言語だけ安全に修正できたらこの補正は不要になる。
 */
export function fixMainlandInheritanceLinks(
  column: Pick<Column, "slug" | "translations">,
  locale: LangCode,
  content: string,
): string {
  const zhContent = column.translations?.zh?.content;
  if (column.slug !== MAINLAND_INHERITANCE_SLUG || locale !== "zh" || !zhContent || zhContent !== content) {
    return content;
  }

  return TAIWAN_LINKS.reduce<string>((body, [label, path]) => {
    const original = `[${label}](https://luck428.com${path})`;
    const first = body.indexOf(original);
    // CMS上で一意と照合した箇所のみ。将来重複・別表記が生じても他のリンクは変更しない。
    if (first === -1 || body.indexOf(original, first + original.length) !== -1) return body;
    return body.replace(original, `[${label}](/zh${path})`);
  }, content);
}
