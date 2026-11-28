import type { LangCode } from "@/config/languages";

type Reference = { source: string; title: string; href: string; note?: string };

const hk = "kaigai-honkon-singapore-souzokunin-isanbunkatsu-shomei";
const abroad = "souzoku-kaigai-gaikokuseki";
const taiwan = "taiwan-inkan-shomei-isan-bunkatsu";

const references: Record<string, Partial<Record<LangCode, readonly Reference[]>>> = {
  [hk]: {
    en: [
      {
        source: "Robert Lee Law Offices",
        title: "Cross Border Estate Administration",
        href: "https://www.robertleelawoffices.com/services/wealth-estate-planning/cross-border-estate-administration",
      },
    ],
    ja: [
      {
        source: "Katherine Chan Law Office（Katherine Chan）",
        title: "家族が死亡した際の香港における資産の取得方法",
        href: "https://www.chankatherine.com/post/%E5%AE%B6%E6%97%8F%E3%81%8C%E6%AD%BB%E4%BA%A1%E3%81%97%E3%81%9F%E9%9A%9B%E3%81%AE%E9%A6%99%E6%B8%AF%E3%81%AB%E3%81%8A%E3%81%91%E3%82%8B%E8%B3%87%E7%94%A3%E3%81%AE%E5%8F%96%E5%BE%97%E6%96%B9%E6%B3%95?lang=ja",
      },
      {
        source: "絹川恭久 弁護士",
        title: "香港の相続手続（プロベート）の概要（全体）",
        href: "https://silk-stream.com/contents/contents-inheritance/outline-of-hkprobate-for-japanese/",
      },
      {
        source: "Hong Kong LEI（りんみゆき）",
        title: "香港から親の介護 第5回 オンラインお墓探しと遺産相続のあれこれ",
        href: "https://hongkonglei.com/parentalcare05/",
        note: "香港から日本の家族を支え、相続の書類を準備した方の体験記です。",
      },
    ],
  },
  [abroad]: {
    en: [
      {
        source: "C. P. Lin & Co.",
        title: "Wills, Estates & Wealth Planning",
        href: "https://www.cplin.com.hk/wills-estates-wealth-planning",
      },
    ],
    ja: [
      {
        source: "スペクト＆プライヤー法律事務所",
        title: "バンクーバー遺言書・遺産弁護士",
        href: "https://spechtandpryer.com/ja/wills-and-estate-lawyer-vancouver/",
        note: "カナダ・ブリティッシュコロンビア州の検認に関する日本語の案内です。",
      },
      {
        source: "H & H Lawyers（上田大介・林由紀夫）",
        title: "日本人によるオーストラリアの遺産の相続",
        href: "https://hhlaw.com.au/ja/insights/263",
      },
      {
        source: "雨宮奈穂子 弁護士",
        title: "相続",
        href: "https://nahokoamemiya.com/service/heritage/",
        note: "フランス側での相続の流れを調べる際の参考です。",
      },
    ],
  },
  [taiwan]: {
    "zh-tw": [
      {
        source: "立行會計師事務所",
        title: "遺產稅、贈與稅與跨境財富傳承規劃",
        href: "https://lytax.com.tw/services/estate-tax-consulting/",
        note: "想了解台灣端有哪些稅務諮詢項目，可參考這份公開服務說明。",
      },
      {
        source: "國際華人傳承協會",
        title: "日本華人家族傳承的重要性",
        href: "https://icia-tw.org/2026/11/19/importance-of-family-succession-chinese-families-japan/",
        note: "可作為家人開始討論如何整理資產、分工及保存重要文件的參考。",
      },
      {
        source: "富達法律事務所（李育昇律師）",
        title: "海外遺產如何繼承？跨境繼承、外國遺囑、海外不動產與遺產稅解析",
        href: "https://fdlaw.com.tw/blog/cross-border-inheritance-overseas-assets/",
      },
    ],
  },
};

const labels = {
  ja: { title: "あわせて読みたい外部資料", intro: "各掲載元が公開している参考資料です。日本の提出先が求める書類や、個別案件の要件は、提出先や担当の専門家にご確認ください。" },
  en: { title: "Further reading", intro: "These external resources are for general information. Check the requirements for your case with the receiving institution or a qualified adviser." },
  "zh-tw": { title: "延伸閱讀", intro: "以下為各單位公開的參考資料。個案所需文件與適用規定，請向受理機關或相關專業人士確認。" },
};

export function getInheritanceExternalReading(slug: string, locale: LangCode) {
  return Object.hasOwn(references, slug) ? references[slug][locale] ?? [] : [];
}

export function InheritanceExternalReading({ slug, locale }: { slug: string; locale: LangCode }) {
  const items = getInheritanceExternalReading(slug, locale);
  if (!items.length || locale === "zh") return null;
  const label = labels[locale];
  return (
    <section id="further-reading" aria-labelledby="inheritance-further-reading" className="my-8 rounded-xl border border-border px-5 py-5">
      <h2 id="inheritance-further-reading" className="font-serif text-xl font-semibold text-ink">{label.title}</h2>
      <p className="mt-2 text-sm text-text-muted">{label.intro}</p>
      <ul className="mt-4 space-y-3 text-sm">
        {items.map(({ source, title, href, note }) => (
          <li key={href}>
            <span className="font-medium">{source}</span>{" · "}
            <a href={href} className="text-primary underline underline-offset-4">{title}</a>
            {note && <p className="mt-1 text-text-muted">{note}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
