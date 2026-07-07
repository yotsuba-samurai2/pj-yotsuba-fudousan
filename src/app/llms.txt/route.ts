import { headers } from "next/headers";
import { BUSINESS_URLS } from "@/lib/seo";

export const revalidate = 3600;

function realestateLlmsTxt(): string {
  const base = BUSINESS_URLS.realestate;
  return `# 四葉不動産株式会社 (Yotsuba Real Estate)

> 東京都文京区にある不動産会社。元新聞記者として5カ国で取材経験を積んだ代表・浦松丈二が行政書士資格を取得し、賃貸・売買・管理から相続不動産、外国人向け住居サポートまでを多言語（日本語・英語・中国語）でワンストップ対応する。

四葉不動産は、東京都内の住まい探しから契約・法務・相続までを一貫して支援します。行政書士と連携し、外国籍の方の住居確保や在留資格対応、オーナー様の物件管理、相続不動産の整理まで、専門家ネットワークで解決します。初回相談は無料です。

## 基本情報

- 法人名: 四葉不動産株式会社
- 所在地: 〒112-0006 東京都文京区小日向４丁目２−５ 小日向安田ビル２０３
- 電話: 03-6161-9428
- 営業時間: 10:00-18:00（火・水定休）
- 代表者: 浦松 丈二（元新聞記者 / 行政書士）
- 対応言語: 日本語 / English / 中文（繁体字・簡体字）
- 対応エリア: 東京都および近郊

## 主要サービス

- [賃貸仲介](${base}/services): 賃貸物件紹介・内見手配・契約サポート
- [売買仲介](${base}/services): マンション・戸建ての売買仲介
- [物件管理](${base}/services): オーナー様向けの入居者管理・トラブル対応
- [相続不動産コンサルティング](${base}/services): 相続税・遺産分割・売却まで行政書士と連携して支援
- [外国人向け住居サポート](${base}/services): 在留資格対応・多言語での契約支援

## コアページ

- [トップページ](${base}/): 四葉不動産のサービス概要と強み
- [会社概要](${base}/about): 代表・浦松丈二の経歴と事業理念
- [サービス一覧](${base}/services): 全サービスの詳細
- [お問い合わせ](${base}/contact): 初回相談無料の問い合わせ窓口

## コラム（お役立ち情報）

- [コラム一覧](${base}/column): 不動産・暮らし・相続・契約に関する解説記事
- sitemap: [${base}/sitemap.xml](${base}/sitemap.xml)

## 差別化ポイント（他社との違い）

- 元新聞記者の取材力と文章力で、契約書・申請書類を分かりやすく説明
- 行政書士資格を保有し、契約書類・相続・在留資格まで自社で対応
- 多言語対応（日本語・英語・中国語）により、外国籍の入居者・オーナーにも同一品質のサービスを提供

## Optional

- [プライバシーポリシー](${base}/privacy-policy)
- [利用規約](${base}/terms)
- [法的表示](${base}/legal-notice)
`;
}

function legalLlmsTxt(): string {
  const base = BUSINESS_URLS.legal;
  return `# 四葉行政書士事務所 (Yotsuba Gyoseishoshi)

> 東京の行政書士事務所。元新聞記者の文章力で「通る申請書」を作成し、補助金・助成金、ビザ・在留資格、会社設立、各種許認可をワンストップ支援する。

## コアページ

- [トップページ](${base}/)
- [会社概要](${base}/about)
- [コラム](${base}/column)
- [お問い合わせ](${base}/contact)

## Optional

- sitemap: [${base}/sitemap.xml](${base}/sitemap.xml)
`;
}

export async function GET() {
  const h = await headers();
  const host = h.get("host") || "";

  const body = host.includes("luck428gyosei.com")
    ? legalLlmsTxt()
    : realestateLlmsTxt();

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
