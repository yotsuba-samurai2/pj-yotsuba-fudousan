import { JsonLd } from "./JsonLd";
import { PERSON_JSONLD } from "@/lib/seo";

/**
 * /about 専用の AboutPage＋ProfilePage JSON-LD。
 * 代表・浦松丈二のPersonフルノード（@id: PERSON_ID）はサイト全体でここだけが定義し、
 * 各記事のauthor・各組織のfounderは @id 参照でこのノードに解決される
 * （エンティティ外部シグナル強化仕様_v1 §1-1「ハブ&スポーク」）。
 */
export function ProfilePageJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": ["AboutPage", "ProfilePage"],
        "@id": "https://luck428.com/about#profilepage",
        url: "https://luck428.com/about",
        name: "会社概要 | 四葉不動産",
        inLanguage: "ja",
        mainEntity: PERSON_JSONLD,
      }}
    />
  );
}
