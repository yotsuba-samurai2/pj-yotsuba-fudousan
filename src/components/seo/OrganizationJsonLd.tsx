import { JsonLd } from "./JsonLd";
import {
  BUSINESS_HOURS,
  BUSINESS_SEO,
  LABOR_MEMBER_OF,
  LABOR_SAME_AS,
  LEGAL_MEMBER_OF,
  LEGAL_SAME_AS,
  PERSON_ID,
  PERSON_JSONLD,
  REALESTATE_MEMBER_OF,
  REALESTATE_SAME_AS,
  SHARED_ORG_INFO,
  SITE_URL,
} from "@/lib/seo";

type OrgRef = {
  readonly "@type": string;
  readonly name: string;
  readonly url: string;
};

/**
 * 事業体ごとの sameAs / memberOf。
 *
 * 【フォールバック禁止・2026-09-01の事故を受けて明示的な表にした】
 * 旧実装は `isRealEstate ? realestate : legal` の二分岐で、**realestate 以外はすべて
 * 行政書士事務所の識別子を受け取っていた**。社労士事務所を追加した2026-09-01、
 * /labor が Wikidata Q139738259（四葉行政書士事務所）・行政書士のGBP・
 * 東京都行政書士会を自分のものとして出力し、機械には
 * 「四葉社会保険労務士事務所＝四葉行政書士事務所」と読める状態になった。
 * 別事業体の同一視は業法分離と矛盾し、AI検索のエンティティ認識を直接壊す。
 *
 * よって既定値を持たせない。**未登録のキーは sameAs も memberOf も出力しない**。
 * 新しい事業体を足すときは、ここに1行足すまで何も出ないのが正しい挙動。
 */
const SAME_AS_BY_BUSINESS: Record<string, readonly string[]> = {
  realestate: REALESTATE_SAME_AS,
  legal: LEGAL_SAME_AS,
  labor: LABOR_SAME_AS,
};

const MEMBER_OF_BY_BUSINESS: Record<string, readonly OrgRef[]> = {
  realestate: REALESTATE_MEMBER_OF,
  legal: LEGAL_MEMBER_OF,
  labor: LABOR_MEMBER_OF,
};

export function OrganizationJsonLd({ businessKey }: { businessKey: string }) {
  const biz = BUSINESS_SEO[businessKey];
  if (!biz) return null;

  const isRealEstate = businessKey === "realestate";
  const sameAs = SAME_AS_BY_BUSINESS[businessKey] ?? [];
  const memberOf = MEMBER_OF_BY_BUSINESS[businessKey] ?? [];

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": biz.schemaType,
        "@id": `${biz.url}/#organization`,
        name: biz.legalName,
        legalName: biz.legalName,
        // 同名他社との識別：別名（配列）・法人番号（taxID）・公的識別子（identifier）
        alternateName: biz.alternateNames ?? biz.name,
        ...(biz.taxID ? { taxID: biz.taxID } : {}),
        ...(biz.identifiers
          ? {
              identifier: biz.identifiers.map((i) => ({
                "@type": "PropertyValue",
                propertyID: i.propertyID,
                value: i.value,
              })),
            }
          : {}),
        url: biz.url,
        // アセットはルート配信のみ（実測2026-07-11：/legal/yotsuba/*.png=404、/yotsuba/*.png=200）
        // ＝結合ベースはbiz.urlでなくSITE_URL（realestateは出力同一）。logo=正方形ロゴ／image=OG優先で分離（P2仕様）
        logo: `${SITE_URL}${biz.squareLogo ?? biz.ogImage}`,
        image: `${SITE_URL}${biz.ogImage || biz.squareLogo || ""}`,
        description: biz.description,
        telephone: SHARED_ORG_INFO.telephone,
        faxNumber: SHARED_ORG_INFO.faxNumber,
        priceRange: "¥¥",
        // 事業体ごとの開設日。未設定はグループ共通値へフォールバック（社労士＝2026-09-01）
        foundingDate: biz.foundingDate ?? SHARED_ORG_INFO.foundingDate,
        ...(isRealEstate
          ? { slogan: "元新聞記者×行政書士がつくる、東京都文京区の不動産屋" }
          : {}),
        // 空配列のときはキーごと出さない（空の sameAs / memberOf を出力しない）
        ...(sameAs.length > 0 ? { sameAs } : {}),
        ...(memberOf.length > 0 ? { memberOf } : {}),
        address: {
          "@type": "PostalAddress",
          postalCode: SHARED_ORG_INFO.postalCode,
          addressRegion: SHARED_ORG_INFO.addressRegion,
          addressLocality: SHARED_ORG_INFO.addressLocality,
          streetAddress: SHARED_ORG_INFO.streetAddress,
          addressCountry: SHARED_ORG_INFO.addressCountry,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: SHARED_ORG_INFO.geo.latitude,
          longitude: SHARED_ORG_INFO.geo.longitude,
        },
        // GBP直リンク優先（P2仕様）。labor＝gbpUrl無し→geoからの自動生成へフォールバック
        hasMap:
          biz.gbpUrl ??
          `https://www.google.com/maps/search/?api=1&query=${SHARED_ORG_INFO.geo.latitude},${SHARED_ORG_INFO.geo.longitude}`,
        openingHoursSpecification: (
          BUSINESS_HOURS[businessKey] ?? BUSINESS_HOURS.realestate
        ).specs.map((s) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: s.dayOfWeek,
          opens: s.opens,
          closes: s.closes,
        })),
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: SHARED_ORG_INFO.telephone,
            contactType: "customer service",
            areaServed: "JP",
            availableLanguage: ["Japanese", "English", "Chinese"],
          },
        ],
        // parentOrganization（「四葉パートナーズ」）は削除（2026-07-10浦松確認＝登記実体ではない。
        // 各事業は別事業体・独立受任＝親子関係を構造化データで主張しない。関係はfounder共通@idで表現）
        founder: {
          "@type": "Person",
          "@id": PERSON_ID,
          name: SHARED_ORG_INFO.representative,
          // 資格は seo.ts の PERSON_JSONLD.hasCredential を**そのまま**使う（2026-09-01）。
          //
          // 旧実装はここに2件を独自の形で持っていた（credentialCategory="国家資格"＋name=資格名、
          // identifier に「登録番号」の語を含める）。PERSON_JSONLD は別の形（credentialCategory=資格名、
          // identifier は番号のみ）で、**同一 @id の Person が出力するページによって違う中身になっていた**
          //   - 全ページ（このfounder）＝国家資格2件
          //   - /about/uramatsu（ページ内定義）＝2件
          //   - /about（PERSON_JSONLD）＝3件
          // さらに旧コメント「社会保険労務士は登録未了（2026年9月開業予定）」は開業日（2026-09-01）に
          // 事実でなくなった。値を二重管理せず正本1本を指すことで、この2つを同時に解消する。
          hasCredential: PERSON_JSONLD.hasCredential,
          sameAs: [
            "https://www.wikidata.org/wiki/Q139738129",
            "https://orcid.org/0009-0007-0460-3473",
            "https://www.samurai.co.jp/samurai/reserve/uramatsu-joji",
          ],
          knowsAbout: [
            {
              "@type": "Thing",
              name: "相続",
              sameAs: "https://www.wikidata.org/wiki/Q200303",
            },
            {
              "@type": "Thing",
              name: "不動産",
              sameAs: "https://www.wikidata.org/wiki/Q684740",
            },
            {
              "@type": "Thing",
              name: "障害者福祉",
              sameAs: "https://www.wikidata.org/wiki/Q11658995",
            },
            {
              "@type": "Thing",
              name: "児童発達支援",
              sameAs: "https://www.wikidata.org/wiki/Q120340950",
            },
            {
              "@type": "Thing",
              name: "放課後等デイサービス",
              sameAs: "https://www.wikidata.org/wiki/Q11499003",
            },
            {
              "@type": "Thing",
              name: "人的資源管理",
              sameAs: "https://www.wikidata.org/wiki/Q1056396",
            },
            {
              "@type": "Thing",
              name: "人工知能",
              sameAs: "https://www.wikidata.org/wiki/Q11660",
            },
          ],
        },
        areaServed: {
          "@type": "GeoCircle",
          geoMidpoint: {
            "@type": "GeoCoordinates",
            latitude: SHARED_ORG_INFO.geo.latitude,
            longitude: SHARED_ORG_INFO.geo.longitude,
          },
          geoRadius: "50000",
        },
        knowsLanguage: ["ja", "en", "zh-Hant", "zh-Hans"],
        ...(isRealEstate
          ? {
              makesOffer: [
                {
                  "@type": "Offer",
                  itemOffered: { "@type": "Service", name: "賃貸仲介" },
                },
                {
                  "@type": "Offer",
                  itemOffered: { "@type": "Service", name: "売買仲介" },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "相続不動産コンサルティング",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "外国人向け住居サポート（日本語・英語・中国語繁体字・中国語簡体字対応）",
                  },
                },
              ],
            }
          : {}),
      }}
    />
  );
}