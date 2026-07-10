// ★参考ページ（型A）＝ /legal/services/inheritance　※原稿_行政書士 #3・共通シェル使用
// 配置＝src/app/(legal)/legal/services/inheritance/page.tsx。クロスリンク＝C1(→/souzoku)がpathで自動表示。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import Link from "next/link";
import { LegalServicePage, H2 } from "@/components/shared/LegalServicePage";
import { Placeholder } from "@/components/shared/Placeholder";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "legal",
    title: "相続・遺言の書類作成｜四葉行政書士事務所",
    description:
      "遺産分割協議書・遺言書の作成、戸籍等の相続関係書類の収集を、文京区の四葉行政書士事務所が支援します。相続した不動産の管理・活用・売却は関連事業の四葉不動産と連携。登記・税務は専門家におつなぎし、相続の全体を整理してお手伝いします。",
    path: "/legal/services/inheritance",
    locale,
    absoluteTitle: true,
  });
}

export default function Page() {
  return (
    <LegalServicePage
      slug="inheritance"
      crumbLabel="相続・遺言・信託"
      serviceName="相続関係書類の作成・収集の支援"
      heroAlt="相続の手続きのイメージ（家系図・和風家屋・書類）"
      h1="相続・遺言・信託"
      lead={
        <p>
          相続に伴う書類の作成——遺産分割協議書、遺言書の起案、戸籍等の収集——は、<strong>行政書士に依頼できます</strong>。四葉行政書士事務所は相続関係書類の作成・収集を担い、<strong>相続した不動産の「売る・貸す・持ち続ける」は関連事業の四葉不動産株式会社</strong>が対応します。相続登記は司法書士、相続税の申告は税理士の領域であり、それぞれ連携する専門家におつなぎします。
          <Placeholder reason="石井弁護士＝業際表現の最終確認" />
        </p>
      }
      internalLinks={[
        { href: "/legal/ryokin", label: "報酬額表" },
        { href: "/legal/nagare", label: "受任の流れ" },
        { href: "/legal/faq", label: "よくある質問" },
      ]}
    >
      <div>
        <H2>行政書士は相続で何をしてくれますか？</H2>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          四葉行政書士事務所が対応する相続業務は次のとおりです。
          <Placeholder reason="浦松＝対応範囲の確定" />
        </p>
        <ul className="mt-2 space-y-1 text-sm text-text">
          <li>遺産分割協議書の作成</li>
          <li>遺言書（自筆証書・公正証書）の起案サポート</li>
          <li>相続関係説明図の作成・戸籍等必要書類の収集</li>
          <li className="text-text-muted">（相続登記＝司法書士／相続税申告＝税理士／争いがある場合＝弁護士、へ連携しておつなぎします）</li>
        </ul>
      </div>

      <div>
        <H2>相続した不動産も相談できますか？</H2>
        <p className="mt-3 leading-relaxed text-text">
          できます。相続した不動産の管理・活用・売却は、関連事業の<strong>四葉不動産株式会社</strong>（宅地建物取引業）が扱います。<strong>書類（行政書士）と不動産（宅建業）を同じ窓口で相談できる</strong>のが四葉の特長です。相続不動産の進め方は、四葉不動産の完全ガイドにまとまっています。
        </p>
        <p className="mt-2 text-sm">
          → <Link href="/souzoku" className="text-primary underline">文京区で不動産を相続したら——管理・活用・売却の完全ガイド（四葉不動産）</Link>
        </p>
        <p className="mt-1 text-xs text-text-muted">
          ※四葉不動産株式会社・四葉行政書士事務所は、それぞれ別の事業体として独立してご依頼をお受けします（紹介料等の授受はありません）。
        </p>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          なお、相続登記は2024年4月1日から申請が義務化されています（不動産登記法第76条の2第1項・原則3年以内。2024年3月31日以前の相続分は2027年3月31日まで）。期限の観点でも、早めの着手をおすすめします。
        </p>
      </div>

      <div>
        <H2>費用・受任の流れ</H2>
        <p className="mt-2 text-sm">
          → <Link href="/legal/ryokin" className="text-primary underline">相続関連書類作成の報酬額（報酬額表）</Link>
          <Placeholder reason="Notion＝料金体系・金額（報酬額表_HP公開用が正）" />
        </p>
        <p className="mt-1 text-sm">
          → <Link href="/legal/nagare" className="text-primary underline">ご相談から完了までの受任の流れ</Link>
          <Placeholder reason="浦松＝各ステップの実運用・標準期間" />
        </p>
      </div>
    </LegalServicePage>
  );
}
