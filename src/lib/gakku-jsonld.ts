// /gakku（学区ハブ）の構造化データ。画面に出している事実だけで組む（2026-09-23）。
// ページ本体（CollectionPage）・20校の一覧（ItemList）・区の通学区域表（Dataset）・学区参考図（Map）を
// 1つの @graph で渡し、AI・検索エンジンが「誰が・何を元に・どの範囲を」載せたページかを読めるようにする。
// 学校の評判・人気・進学実績は入れない（表示規約。学区ハブの方針と同じ）。
import type { LangCode } from "@/config/languages";
import { gakkuCopy, SCHOOL_LIST_SOURCE, SCHOOL_PROFILES } from "@/lib/gakku";
import { schoolRentalPath } from "@/lib/rental-school-district";
import { DISTRICT_SOURCE, listSchools } from "@/lib/school-district";
import { BCP47_BY_LOCALE, canonicalUrl, SITE_URL } from "@/lib/seo";

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const BUNKYO = { "@type": "AdministrativeArea", name: "文京区", containedInPlace: { "@type": "AdministrativeArea", name: "東京都" } };
/** 学区参考図の元データ（public/gakku/bunkyo-school-areas.json の source と同じ） */
const MAP_SOURCE = {
  url: "https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A27-2023.html",
  license: "https://creativecommons.org/licenses/by/4.0/",
  retrievedAt: "2026-09-23",
};

export function buildGakkuHubJsonLd(locale: LangCode) {
  const c = gakkuCopy(locale);
  const pageUrl = canonicalUrl("realestate", "/gakku", locale);
  const inLanguage = BCP47_BY_LOCALE[locale];
  const schools = listSchools();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: c.hub.h1,
        description: c.hub.description,
        inLanguage,
        about: BUNKYO,
        publisher: { "@id": ORGANIZATION_ID },
        mainEntity: { "@id": `${pageUrl}#schools` },
        hasPart: [{ "@id": `${pageUrl}#district-table` }, { "@id": `${pageUrl}#map` }],
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#schools`,
        name: c.hub.allSchoolsH2,
        numberOfItems: schools.length,
        itemListElement: schools.map((school, i) => ({
          "@type": "ListItem",
          position: i + 1,
          // 各校の「学区別の賃貸一覧」（当社ページ）。学校そのものは item で表す
          url: canonicalUrl("realestate", schoolRentalPath(school.slug), locale),
          item: {
            "@type": "ElementarySchool",
            name: school.formalName,
            ...(SCHOOL_PROFILES[school.slug]
              ? {
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: SCHOOL_PROFILES[school.slug].address.replace(/^文京区/, ""),
                    addressLocality: "文京区",
                    addressRegion: "東京都",
                    addressCountry: "JP",
                  },
                  sameAs: SCHOOL_PROFILES[school.slug].siteUrl,
                }
              : {}),
          },
        })),
      },
      {
        "@type": "Dataset",
        "@id": `${pageUrl}#district-table`,
        name: "文京区立小学校 通学区域（町丁目・番・号）",
        description: `文京区が公表する小学校通学区域の表（${DISTRICT_SOURCE.updatedAt}更新・${DISTRICT_SOURCE.rowCount}行）を、町丁目・番・号のまま掲載したもの。`,
        url: pageUrl,
        inLanguage: "ja",
        spatialCoverage: BUNKYO,
        dateModified: DISTRICT_SOURCE.updatedAt,
        isBasedOn: [DISTRICT_SOURCE.url, SCHOOL_LIST_SOURCE.url],
        creator: { "@type": "GovernmentOrganization", name: DISTRICT_SOURCE.publisher },
        publisher: { "@id": ORGANIZATION_ID },
      },
      {
        "@type": "Map",
        "@id": `${pageUrl}#map`,
        name: "文京区20小学校の学区参考図",
        url: `${SITE_URL}/gakku/3s1k-map.html`,
        description: "国土交通省「国土数値情報 小学校区データ（2023年度）」を加工した、学区のおおよその範囲を示す参考図。物件の学区判定には区の通学区域表を用いる。",
        spatialCoverage: BUNKYO,
        isBasedOn: MAP_SOURCE.url,
        license: MAP_SOURCE.license,
        dateModified: MAP_SOURCE.retrievedAt,
        publisher: { "@id": ORGANIZATION_ID },
      },
    ],
  };
}
