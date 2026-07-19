// ★参考ページ（flagship・型A）＝ /legal/services/shogai-fukushi
// 正本＝原稿_行政書士サイト_v1.0.md #1（本文はここから転記）／見た目＝wireframe_legal_shogai-fukushi.html。
// これを"型Aの雛形"として visa / inheritance / company / subsidy へ横展開する。
// 横展開時に差し替えるのは：①ヒーロー画像 /hero/legal-<slug>-16x9.webp ②meta ③本文(原稿#2-5) ④QA配列 ⑤クロスリンク(getCrossLinksがpathnameで自動) ⑥JSON-LDのname/@id。
// 本番配置＝src/app/(legal)/legal/services/shogai-fukushi/page.tsx。import 先はA統合後のパス。
// 依存：A-1トークン（bg-primary等）・A-2（(legal)=濃紺）・A-3部品（Breadcrumb/CtaBand/CrossLinkBanner/Placeholder）・cross-links.ts。
// LinkaFab / MobileStickyBar / RelatedBusinessFooter は TenantLayoutShell（layout）側。
// フェーズI多言語化（2026-07-10）：COPY: Record<LangCode,…>＋getRequestLocale 方式（手本＝/legal/page.tsx）。
// en/zh-tw/zh=監修前ドラフト（フェーズI・2026-07-10）。jaは原稿#1から一字一句不変。
// JSON-LD（Service）はja固定＝変更しない。Placeholderのreasonは内部メモ＝全ロケールja。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { CtaBand } from "@/components/shared/CtaBand";
import { CrossLinkBanner } from "@/components/shared/CrossLinkBanner";
import { Placeholder } from "@/components/shared/Placeholder";
import { getCrossLinks } from "@/lib/cross-links";
import { SR_LAUNCHED } from "@/lib/shared/office";
import type { LangCode } from "@/config/languages";

const PATH = "/legal/services/shogai-fukushi";
const PAGE_URL = "https://luck428.com" + PATH;

type ShogaiFukushiCopy = {
  metaTitle: string;
  metaDesc: string;
  crumbHome: string;
  crumbServices: string;
  crumbCurrent: string;
  heroAlt: string;
  h1: string;
  lead: React.ReactNode;
  /** 疑問文H2（表示見出しの元データ。FAQPageは出力しない＝/legal/faq 専用） */
  qa: { q: string; a: string }[];
  sec1Body: React.ReactNode;
  sec2Body: (locale: LangCode) => React.ReactNode;
  sec3Body: React.ReactNode;
  feeH2: string;
  feeBody: (locale: LangCode) => React.ReactNode;
  flowH2: string;
  flowBody: (locale: LangCode) => React.ReactNode;
  meritH2: string;
  meritBody: React.ReactNode;
  relatedHeading: string;
  relatedLinks: { href: string; label: string }[];
  authorBody: React.ReactNode;
};

const COPY: Record<LangCode, ShogaiFukushiCopy> = {
  ja: {
    metaTitle: "障害福祉サービスの指定申請｜四葉行政書士事務所",
    metaDesc:
      "障害福祉サービス（グループホーム・放課後等デイサービス等）の事業者指定申請を、文京区の四葉行政書士事務所が支援します。法人設立から指定申請、加算届、運営支援まで対応。元新聞記者の行政書士が複雑な要件を整理します。",
    crumbHome: "ホーム",
    crumbServices: "業務案内",
    crumbCurrent: "障害福祉サービスの指定申請",
    heroAlt: "障害福祉サービスの指定申請のイメージ（グループホームと申請書類）",
    h1: "障害福祉サービス事業者の指定申請",
    lead: (
      <>
        障害福祉サービス事業者の指定申請は、<strong>行政書士に依頼できます</strong>。四葉行政書士事務所（東京都文京区小日向）は、グループホーム（共同生活援助）・放課後等デイサービス・児童発達支援などの
        <strong>指定申請を中心に、前提となる法人設立から、指定後の加算届・変更届・運営支援までを一体</strong>
        で扱います。指定の要件は自治体ごとに細部が異なり、人員基準・設備基準・運営規程の整合が問われます。四葉行政書士事務所は、この「要件の整理」から書類作成・申請までを一貫してお手伝いします。
      </>
    ),
    qa: [
      {
        q: "障害福祉サービスの指定申請とは何ですか？",
        a: "障害福祉サービス事業（グループホーム、放課後等デイサービス、生活介護など）を運営するには、都道府県・市区町村から事業者指定を受ける必要があります。主な条件は、法人格・人員基準・設備/運営基準の3つです。四葉行政書士事務所は要件を整理し、申請書類の作成・提出を代行します。",
      },
      {
        q: "四葉行政書士事務所は、どこまで対応できますか？",
        a: "法人設立、指定申請、加算届・変更届、指定後の運営支援まで対応します。労務（就業規則・賃金等）は社会保険労務士、登記は司法書士、税務は税理士の領域です。物件は関連事業の四葉不動産が別事業体として扱います。",
      },
      {
        q: "グループホーム開設の相談は、どのタイミングがいいですか？",
        a: "物件を決める前——構想の段階が最適です。指定は物件の立地・構造・面積・消防設備が基準を満たす必要があり、契約後に基準不適合が判明する例があります。四葉不動産と連携し、指定基準を見据えた物件選びの段階からご相談を受けられます。",
      },
    ],
    sec1Body: (
      <>
        <p className="mt-3 leading-relaxed text-text">
          障害福祉サービス事業（グループホーム、放課後等デイサービス、生活介護など）を運営するには、
          <strong>都道府県・市区町村から「事業者指定」を受ける</strong>必要があります。指定を受けるための主な条件は、次の3つに集約されます。
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-primary-tint text-left">
                <th className="border border-border px-3 py-2">条件</th>
                <th className="border border-border px-3 py-2">中身</th>
                <th className="border border-border px-3 py-2">つまずきやすい点</th>
              </tr>
            </thead>
            <tbody className="text-text-muted">
              <tr>
                <td className="border border-border px-3 py-2">法人格</td>
                <td className="border border-border px-3 py-2">株式会社・合同会社・NPO法人等であること</td>
                <td className="border border-border px-3 py-2">定款の事業目的に福祉事業の記載が要る</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">人員基準</td>
                <td className="border border-border px-3 py-2">管理者・サービス管理責任者等の配置</td>
                <td className="border border-border px-3 py-2">資格・経験年数の要件確認</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">設備・運営基準</td>
                <td className="border border-border px-3 py-2">物件の構造・面積・消防等＋運営規程の整備</td>
                <td className="border border-border px-3 py-2">物件契約後に基準不適合が判明する例がある</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          根拠は障害者総合支援法・児童福祉法にもとづく指定基準（自治体の条例・要綱を含む）です。書類の不備や基準解釈の誤りは、指定の遅れや申請のやり直しに直結します。四葉行政書士事務所は、要件を事前に整理し、申請書類の作成・提出を代行します。
        </p>
        <p className="mt-2 text-sm text-text-muted">
          対象サービスの例：共同生活援助（グループホーム）、放課後等デイサービス、児童発達支援、生活介護 ほか
          <Placeholder reason="浦松＝実際に対応するサービス種別の確定" />
        </p>
      </>
    ),
    sec2Body: (locale) => (
      <>
        <p className="mt-3 leading-relaxed text-text">四葉行政書士事務所は、指定申請の前後まで含めて、次の範囲に対応します。</p>
        <ul className="mt-3 space-y-2 text-sm text-text">
          <li>
            <strong>法人設立</strong>：指定の前提となる法人の設立書類作成（株式会社・合同会社・NPO法人等）
            <Placeholder reason="浦松＝対応する法人形態" />
            　→ 詳細：<Link href={addLocalePrefix("/legal/services/company", locale)} className="text-primary underline">会社設立・各種許認可の業務内容</Link>
          </li>
          <li>
            <strong>指定申請</strong>：人員・設備・運営基準の事前確認、申請書類一式の作成・提出、自治体との協議対応
          </li>
          <li>
            <strong>加算届・変更届</strong>：体制加算等の届出、事業所の変更手続き
            <Placeholder reason="浦松＝加算届の対応範囲。処遇改善加算の扱いは石井弁護士確認（下記注記）" />
          </li>
          <li>
            <strong>運営支援</strong>：指定後の書類整備、実地指導（監査）対応の準備（助言・立会は非独占。
            <strong>労務＝就業規則・賃金等は含みません＝社会保険労務士へ</strong>）
            <Placeholder reason="浦松＝運営支援の具体範囲" />
          </li>
          <li>
            <strong>物件</strong>：グループホーム・事業所に使える物件は、関連事業の四葉不動産株式会社（宅地建物取引業）が扱います →{" "}
            <Link href={addLocalePrefix("/toushi/group-home", locale)} className="text-primary underline">グループホームに使える物件探し</Link>
            <br />
            <span className="text-xs text-text-muted">
              ※四葉不動産株式会社・四葉行政書士事務所は、それぞれ別の事業体として独立してご依頼をお受けします（紹介料等の授受はありません）。
            </span>
          </li>
        </ul>

        {/* 業際の注記（区分表準拠・断定回避） */}
        <blockquote className="mt-4 border-l-4 border-primary bg-primary-tint p-3 text-xs leading-relaxed text-text">
          <strong>業際の注記</strong>：登記申請は司法書士、税務申告は税理士、労務・社会保険手続きは社会保険労務士の領域です。
          <strong>
            処遇改善加算は工程で分かれます——加算体制届・計画書・実績報告など指定権者（自治体）への提出書類の作成＝行政書士／就業規則・賃金規程・キャリアパス要件など賃金制度の設計＝社会保険労務士
          </strong>
          。四葉では両事務所が<strong>分離受任</strong>で担当します（社労士は2026年9月開業後）。四葉行政書士事務所は行政書士業務の範囲で対応し、それ以外は連携する専門家におつなぎします。
          <Placeholder reason="石井弁護士＝業際表現の最終確認（両サイトで断定しない）" />
        </blockquote>
      </>
    ),
    sec3Body: (
      <>
        <p className="mt-3 leading-relaxed text-text">
          <strong>物件を決める前——構想の段階が最適</strong>
          です。障害福祉サービスの指定は、物件の立地・構造・面積・消防設備が基準を満たしている必要があり、賃貸借契約の後に「この物件では指定が取れない」と判明する事例が実際にあります。四葉行政書士事務所は、関連事業の四葉不動産株式会社と連携し、
          <strong>指定基準を見据えた物件選びの段階から</strong>ご相談を受けられます（不動産取引は四葉不動産が別事業体として受任します）。
        </p>
        <p className="mt-3 text-sm text-text-muted">
          順序はこうです：<strong>①構想の相談（当事務所）→ ②物件探し（四葉不動産）→ ③指定基準の適合確認（当事務所）→ ④法人設立・指定申請（当事務所）→ ⑤開設</strong>。
        </p>
      </>
    ),
    feeH2: "費用・料金はいくらですか？",
    feeBody: (locale) => (
      <>
        <p className="mt-3 leading-relaxed text-text">
          障害福祉サービス指定申請の報酬は、サービス種別・法人設立の有無・自治体によって異なります。業務ごとの金額は報酬額表に掲載し、個別の事情によるお見積りにも対応します。
        </p>
        <p className="mt-2 text-sm">
          →{" "}
          <Link href={addLocalePrefix("/legal/ryokin", locale)} className="text-primary underline">障害福祉サービス指定申請の報酬額（報酬額表）</Link>
          <Placeholder reason="Notion＝料金体系・金額（報酬額表_HP公開用が正）" />
        </p>
      </>
    ),
    flowH2: "受任の流れを教えてください",
    flowBody: (locale) => (
      <>
        <p className="mt-3 leading-relaxed text-text">
          ご相談から指定取得までは、<strong>①ご相談 → ②お見積り・受任 → ③要件整理・書類作成 → ④申請・自治体対応 → ⑤指定取得・運営開始のサポート</strong>、の順で進みます。
        </p>
        <p className="mt-2 text-sm">
          →{" "}
          <Link href={addLocalePrefix("/legal/nagare", locale)} className="text-primary underline">ご相談から完了までの受任の流れ</Link>
          <Placeholder reason="浦松＝各ステップの実運用・標準期間" />
        </p>
      </>
    ),
    meritH2: "この分野を四葉行政書士事務所に頼むメリットは何ですか？",
    meritBody: (
      <p className="mt-3 leading-relaxed text-text">
        代表の浦松 丈二は、元毎日新聞中国総局長として<strong>34年間「複雑な事実を整理して伝える」仕事</strong>
        をしてきた行政書士です。障害福祉の指定申請は要件が多く、自治体ごとに解釈が分かれます。論点を整理し、根拠を押さえた申請書に落とす——記者の技術がそのまま活きる分野です。加えて、関連事業の四葉不動産株式会社との連携により、
        <strong>物件確保は四葉不動産株式会社、指定申請は当事務所が、それぞれ別契約で受任します。</strong>ご相談の入口は共通です。この組み合わせを持つ事務所は多くありません。
        <Placeholder reason="浦松＝公開可能な実績・件数（確定分のみ。無ければ数値は書かない）" />
      </p>
    ),
    relatedHeading: "このページの関連リンク",
    relatedLinks: [
      { href: "/legal/ryokin", label: "報酬額表" },
      { href: "/legal/nagare", label: "受任の流れ" },
      { href: "/legal/services/company", label: "会社設立・各種許認可" },
      { href: "/legal/faq", label: "よくある質問" },
    ],
    authorBody: (
      <>
        <strong>この記事の著者</strong> 浦松 丈二｜四葉行政書士事務所 代表行政書士（登録番号 第25087022号）・宅地建物取引士。元毎日新聞中国総局長（記者歴34年）。社会保険労務士試験合格（2026年9月開業予定）。
      </>
    ),
  },
  en: {
    metaTitle: "Disability-Welfare Service Designation｜四葉行政書士事務所 (Gyoseishoshi Office in Bunkyo, Tokyo)",
    metaDesc:
      "Support for provider designation of disability-welfare services (group homes, after-school day services, and more) by 四葉行政書士事務所, a gyoseishoshi (administrative scrivener) office in Bunkyo, Tokyo. Support from incorporation to the designation application, add-on notifications, and operations. A former newspaper journalist untangles the complex requirements.",
    crumbHome: "Home",
    crumbServices: "Services",
    crumbCurrent: "Disability-Welfare Service Designation",
    heroAlt: "Disability-welfare service designation—a group home and application documents",
    h1: "Provider Designation for Disability-Welfare Services",
    lead: (
      <>
        Provider designation for disability-welfare services is <strong>work you can entrust to a gyoseishoshi (administrative scrivener)</strong>. 四葉行政書士事務所 (Yotsuba Gyoseishoshi Office; Kohinata, Bunkyo-ku, Tokyo) handles{" "}
        <strong>designation applications for group homes (shared-living support), after-school day services, child development support, and more—together with the incorporation that precedes them and the add-on notifications, change notifications, and operational support that follow, all as one engagement</strong>
        . The requirements differ in detail from one municipality to another, and consistency across staffing standards, facility standards, and operational rules is closely examined. We support the entire process, from sorting out these requirements to preparing the documents and filing the application.
      </>
    ),
    qa: [
      {
        q: "What is provider designation for disability-welfare services?",
        a: "To operate a disability-welfare service business (group homes, after-school day services, daily-life care, and so on), you must obtain provider designation from the prefectural or municipal government. The main conditions come down to three: corporate status, staffing standards, and facility/operational standards. 四葉行政書士事務所 sorts out the requirements and prepares and files the application documents on your behalf.",
      },
      {
        q: "How far can 四葉行政書士事務所 take the work?",
        a: "We handle incorporation, the designation application, add-on and change notifications, and post-designation operational support as one engagement. Labor matters (work rules, wages, etc.) belong to licensed social insurance and labor consultants, registrations to judicial scriveners, and tax to licensed tax accountants. Property is handled by our affiliated company Yotsuba Fudosan as a separate business entity.",
      },
      {
        q: "When is the best time to talk about opening a group home?",
        a: "Before you commit to a property—at the concept stage. Designation requires the property's location, structure, floor area, and fire-safety equipment to meet the standards, and there are cases where non-compliance comes to light only after the contract is signed. Working with Yotsuba Fudosan, we can advise from the property-search stage with the designation standards in view.",
      },
    ],
    sec1Body: (
      <>
        <p className="mt-3 leading-relaxed text-text">
          To operate a disability-welfare service business (group homes, after-school day services, daily-life care, and so on), you must obtain{" "}
          <strong>provider designation from the prefectural or municipal government</strong>. The main conditions for designation come down to the following three.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-primary-tint text-left">
                <th className="border border-border px-3 py-2">Condition</th>
                <th className="border border-border px-3 py-2">What it means</th>
                <th className="border border-border px-3 py-2">Where applicants stumble</th>
              </tr>
            </thead>
            <tbody className="text-text-muted">
              <tr>
                <td className="border border-border px-3 py-2">Corporate status</td>
                <td className="border border-border px-3 py-2">Being a kabushiki kaisha (stock company), godo kaisha (LLC), NPO corporation, or similar</td>
                <td className="border border-border px-3 py-2">The articles of incorporation must list welfare services among the business purposes</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Staffing standards</td>
                <td className="border border-border px-3 py-2">Assigning a manager, a service management supervisor, and other required staff</td>
                <td className="border border-border px-3 py-2">Verifying qualification and years-of-experience requirements</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Facility and operational standards</td>
                <td className="border border-border px-3 py-2">The property's structure, floor area, fire safety, etc., plus well-drafted operational rules</td>
                <td className="border border-border px-3 py-2">Non-compliance sometimes comes to light after the property contract is signed</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          The legal basis is the designation standards under the Act on Comprehensive Support for Persons with Disabilities and the Child Welfare Act (including each municipality's ordinances and guidelines). Missing documents or a misreading of the standards leads directly to delayed designation or a re-filed application. 四葉行政書士事務所 sorts out the requirements in advance and prepares and files the application documents on your behalf.
        </p>
        <p className="mt-2 text-sm text-text-muted">
          Examples of covered services: shared-living support (group homes), after-school day services, child development support, daily-life care, and more
          <Placeholder reason="浦松＝実際に対応するサービス種別の確定" />
        </p>
      </>
    ),
    sec2Body: (locale) => (
      <>
        <p className="mt-3 leading-relaxed text-text">四葉行政書士事務所 covers the following as one engagement, including the stages before and after the designation application itself.</p>
        <ul className="mt-3 space-y-2 text-sm text-text">
          <li>
            <strong>Incorporation</strong>: preparing the formation documents for the corporation that designation presupposes (stock company, LLC, NPO corporation, etc.)
            <Placeholder reason="浦松＝対応する法人形態" />
            　→ Details: <Link href={addLocalePrefix("/legal/services/company", locale)} className="text-primary underline">Company Formation & Licensing</Link>
          </li>
          <li>
            <strong>Designation application</strong>: advance checks against the staffing, facility, and operational standards; preparation and filing of the complete application package; consultations with the municipality
          </li>
          <li>
            <strong>Add-on and change notifications</strong>: notifications for staffing-structure add-ons and the like, and procedures for changes to the business site
            <Placeholder reason="浦松＝加算届の対応範囲。処遇改善加算の扱いは石井弁護士確認（下記注記）" />
          </li>
          <li>
            <strong>Operational support</strong>: keeping documents in order after designation and preparing for on-site guidance (audits) (advice and attendance are non-exclusive work.{" "}
            <strong>Labor matters—work rules, wages, and the like—are not included; they belong to licensed social insurance and labor consultants</strong>)
            <Placeholder reason="浦松＝運営支援の具体範囲" />
          </li>
          <li>
            <strong>Property</strong>: properties usable for group homes and service sites are handled by our affiliated company 四葉不動産株式会社 (Yotsuba Fudosan Co., Ltd.; licensed real estate brokerage) →{" "}
            <Link href={addLocalePrefix("/toushi/group-home", locale)} className="text-primary underline">Finding a property for a group home</Link>
            <br />
            <span className="text-xs text-text-muted">
              * 四葉不動産株式会社 and 四葉行政書士事務所 each accept engagements independently as separate business entities (no referral fees are exchanged).
            </span>
          </li>
        </ul>

        {/* 業際の注記（区分表準拠・断定回避） */}
        <blockquote className="mt-4 border-l-4 border-primary bg-primary-tint p-3 text-xs leading-relaxed text-text">
          <strong>A note on professional boundaries</strong>: Registration filings belong to judicial scriveners, tax filings to licensed tax accountants, and labor and social insurance procedures to licensed social insurance and labor consultants.{" "}
          <strong>
            The treatment-improvement add-on splits by stage—preparing documents filed with the designating authority (the municipality), such as the add-on structure notification, plans, and performance reports, is gyoseishoshi work, while designing the wage system itself (work rules, wage regulations, career-path requirements) is work for a licensed social insurance and labor consultant
          </strong>
          . At Yotsuba, the two offices take these on under <strong>separate engagements</strong> (the labor-consultant office opens in September 2026). 四葉行政書士事務所 acts within the scope of gyoseishoshi work and connects you with partner professionals for everything else.
          <Placeholder reason="石井弁護士＝業際表現の最終確認（両サイトで断定しない）" />
        </blockquote>
      </>
    ),
    sec3Body: (
      <>
        <p className="mt-3 leading-relaxed text-text">
          <strong>Before you commit to a property—the concept stage—is best</strong>
          . Designation for disability-welfare services requires the property's location, structure, floor area, and fire-safety equipment to meet the standards, and there are real cases where it turns out, only after the lease is signed, that designation cannot be obtained for that property. Working with our affiliated company 四葉不動産株式会社 (Yotsuba Fudosan), we can take consultations{" "}
          <strong>from the property-search stage, with the designation standards in view</strong> (the real estate transaction itself is accepted by Yotsuba Fudosan as a separate business entity).
        </p>
        <p className="mt-3 text-sm text-text-muted">
          The sequence looks like this: <strong>(1) concept consultation (our office) → (2) property search (Yotsuba Fudosan) → (3) checking the property against the designation standards (our office) → (4) incorporation and designation application (our office) → (5) opening</strong>.
        </p>
      </>
    ),
    feeH2: "What are the fees?",
    feeBody: (locale) => (
      <>
        <p className="mt-3 leading-relaxed text-text">
          Fees for a disability-welfare service designation application vary with the service type, whether incorporation is needed, and the municipality. Per-service amounts are listed in our fee schedule, and we also prepare individual quotes for your specific circumstances.
        </p>
        <p className="mt-2 text-sm">
          →{" "}
          <Link href={addLocalePrefix("/legal/ryokin", locale)} className="text-primary underline">Fees for disability-welfare service designation applications (fee schedule)</Link>
          <Placeholder reason="Notion＝料金体系・金額（報酬額表_HP公開用が正）" />
        </p>
      </>
    ),
    flowH2: "How does an engagement proceed?",
    flowBody: (locale) => (
      <>
        <p className="mt-3 leading-relaxed text-text">
          From first consultation to designation, the steps are: <strong>(1) consultation → (2) quote and engagement → (3) sorting requirements and preparing documents → (4) filing and dealing with the municipality → (5) designation obtained, with support for the start of operations</strong>.
        </p>
        <p className="mt-2 text-sm">
          →{" "}
          <Link href={addLocalePrefix("/legal/nagare", locale)} className="text-primary underline">How an engagement works, from consultation to completion</Link>
          <Placeholder reason="浦松＝各ステップの実運用・標準期間" />
        </p>
      </>
    ),
    meritH2: "Why entrust this field to 四葉行政書士事務所?",
    meritBody: (
      <p className="mt-3 leading-relaxed text-text">
        Our representative, 浦松 丈二 (Joji Uramatsu), is a gyoseishoshi who spent <strong>34 years organizing complex facts and making them understood</strong>—most recently as China General Bureau Chief of the Mainichi Shimbun. Disability-welfare designation involves many requirements, and interpretations differ from one municipality to the next. Sorting out the issues and turning them into a well-grounded application—this is exactly where a reporter's craft pays off. On top of that, our tie-up with the affiliated 四葉不動産株式会社 lets you consult{" "}
        <strong>one desk from securing a property through the designation application</strong>. Few offices offer this combination.
        <Placeholder reason="浦松＝公開可能な実績・件数（確定分のみ。無ければ数値は書かない）" />
      </p>
    ),
    relatedHeading: "Related links for this page",
    relatedLinks: [
      { href: "/legal/ryokin", label: "Fees" },
      { href: "/legal/nagare", label: "How Engagement Works" },
      { href: "/legal/services/company", label: "Company Formation & Licensing" },
      { href: "/legal/faq", label: "FAQ" },
    ],
    authorBody: (
      <>
        <strong>About the author</strong> 浦松 丈二 (Joji Uramatsu)｜Representative gyoseishoshi (administrative scrivener), 四葉行政書士事務所 (Reg. No. 25087022); Licensed Real Estate Transaction Specialist. Former China General Bureau Chief of the Mainichi Shimbun (34 years as a journalist). Passed the national exam for licensed social insurance and labor consultant (office opening scheduled for September 2026).
      </>
    ),
  },
  "zh-tw": {
    metaTitle: "障礙福祉服務指定申請｜四葉行政書士事務所",
    metaDesc:
      "文京區的四葉行政書士事務所，協助障礙福祉服務（團體家屋・放學後等日間服務等）的事業者指定申請。從法人設立到指定申請、加算申報、營運支援均可對應。由曾任新聞記者的行政書士，為您整理複雜的要件。",
    crumbHome: "首頁",
    crumbServices: "業務介紹",
    crumbCurrent: "障礙福祉服務指定申請",
    heroAlt: "障礙福祉服務指定申請的示意圖（團體家屋與申請文件）",
    h1: "障礙福祉服務事業者的指定申請",
    lead: (
      <>
        障礙福祉服務事業者的指定申請，<strong>可以委託行政書士辦理</strong>。四葉行政書士事務所（東京都文京區小日向）以團體家屋（共同生活援助）、放學後等日間服務、兒童發展支援等的
        <strong>指定申請為中心，從作為前提的法人設立，到指定後的加算申報・變更申報・營運支援，一體承辦</strong>
        。指定要件依自治體而在細節上有所不同，人員基準、設備基準、營運規程之間的一致性都會受到審查。四葉行政書士事務所從「整理要件」開始，到文件製作、提出申請，全程協助。
      </>
    ),
    qa: [
      {
        q: "什麼是障礙福祉服務的指定申請？",
        a: "要經營障礙福祉服務事業（團體家屋、放學後等日間服務、生活照護等），必須取得都道府縣・市區町村的事業者指定。主要條件可歸納為法人資格、人員基準、設備／營運基準三項。四葉行政書士事務所為您整理要件，並代為製作、提出申請文件。",
      },
      {
        q: "四葉行政書士事務所可以協助到什麼範圍？",
        a: "從法人設立、指定申請、加算申報・變更申報，到指定後的營運支援，一體對應。勞務（就業規則・薪資等）屬社會保險勞務士、登記屬司法書士、稅務屬稅理士的執業範圍。物件由關係企業四葉不動産作為另一事業體承辦。",
      },
      {
        q: "團體家屋的開設諮詢，什麼時機最合適？",
        a: "在決定物件之前——構想階段最為合適。指定要求物件的地點、結構、面積、消防設備符合基準，實務上曾有簽約後才發現不符基準的案例。我們與四葉不動産合作，從著眼指定基準的選擇物件階段起，即可接受諮詢。",
      },
    ],
    sec1Body: (
      <>
        <p className="mt-3 leading-relaxed text-text">
          要經營障礙福祉服務事業（團體家屋、放學後等日間服務、生活照護等），必須
          <strong>取得都道府縣・市區町村的「事業者指定」</strong>。取得指定的主要條件，可歸納為以下三項。
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-primary-tint text-left">
                <th className="border border-border px-3 py-2">條件</th>
                <th className="border border-border px-3 py-2">內容</th>
                <th className="border border-border px-3 py-2">容易受挫之處</th>
              </tr>
            </thead>
            <tbody className="text-text-muted">
              <tr>
                <td className="border border-border px-3 py-2">法人資格</td>
                <td className="border border-border px-3 py-2">須為株式會社、合同會社、NPO法人等</td>
                <td className="border border-border px-3 py-2">章程（定款）的事業目的須載明福祉事業</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">人員基準</td>
                <td className="border border-border px-3 py-2">配置管理者、服務管理責任者等</td>
                <td className="border border-border px-3 py-2">須確認資格與經驗年數的要件</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">設備・營運基準</td>
                <td className="border border-border px-3 py-2">物件的結構・面積・消防等＋營運規程的整備</td>
                <td className="border border-border px-3 py-2">曾有簽訂物件契約後才發現不符基準的案例</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          依據為障礙者綜合支援法及兒童福祉法所定的指定基準（含自治體的條例、要綱）。文件不備或對基準的解釋錯誤，將直接導致指定延遲或重新申請。四葉行政書士事務所事先為您整理要件，並代為製作、提出申請文件。
        </p>
        <p className="mt-2 text-sm text-text-muted">
          對象服務範例：共同生活援助（團體家屋）、放學後等日間服務、兒童發展支援、生活照護等
          <Placeholder reason="浦松＝実際に対応するサービス種別の確定" />
        </p>
      </>
    ),
    sec2Body: (locale) => (
      <>
        <p className="mt-3 leading-relaxed text-text">四葉行政書士事務所連同指定申請的前後階段，一體對應以下範圍。</p>
        <ul className="mt-3 space-y-2 text-sm text-text">
          <li>
            <strong>法人設立</strong>：製作作為指定前提的法人設立文件（株式會社・合同會社・NPO法人等）
            <Placeholder reason="浦松＝対応する法人形態" />
            　→ 詳情：<Link href={addLocalePrefix("/legal/services/company", locale)} className="text-primary underline">公司設立・各類許可的業務內容</Link>
          </li>
          <li>
            <strong>指定申請</strong>：人員・設備・營運基準的事前確認、申請文件全套的製作與提出、與自治體的協商對應
          </li>
          <li>
            <strong>加算申報・變更申報</strong>：體制加算等的申報、事業所的變更手續
            <Placeholder reason="浦松＝加算届の対応範囲。処遇改善加算の扱いは石井弁護士確認（下記注記）" />
          </li>
          <li>
            <strong>營運支援</strong>：指定後的文件整備、實地指導（稽核）對應的準備（建議・陪同屬非獨占業務。
            <strong>勞務＝就業規則・薪資等不包含在內＝請洽社會保險勞務士</strong>）
            <Placeholder reason="浦松＝運営支援の具体範囲" />
          </li>
          <li>
            <strong>物件</strong>：可用於團體家屋・事業所的物件，由關係企業四葉不動産株式会社（宅地建物取引業）承辦 →{" "}
            <Link href={addLocalePrefix("/toushi/group-home", locale)} className="text-primary underline">尋找可作團體家屋的物件</Link>
            <br />
            <span className="text-xs text-text-muted">
              ※四葉不動産株式会社與四葉行政書士事務所是各自獨立的事業體，分別接受委託（不收受介紹費等）。
            </span>
          </li>
        </ul>

        {/* 業際の注記（区分表準拠・断定回避） */}
        <blockquote className="mt-4 border-l-4 border-primary bg-primary-tint p-3 text-xs leading-relaxed text-text">
          <strong>執業範圍的注記</strong>：登記申請屬司法書士、稅務申報屬稅理士、勞務・社會保險手續屬社會保險勞務士的執業範圍。
          <strong>
            處遇改善加算依工序劃分——加算體制申報、計畫書、實績報告等向指定權者（自治體）提出之文件的製作＝行政書士／就業規則、薪資規程、職涯路徑要件等薪資制度的設計＝社會保險勞務士
          </strong>
          。在四葉，由兩事務所以<strong>分別受任</strong>的方式承辦（社會保險勞務士為2026年9月開業後）。四葉行政書士事務所在行政書士業務範圍內對應，其餘部分將為您轉介合作的專業人士。
          <Placeholder reason="石井弁護士＝業際表現の最終確認（両サイトで断定しない）" />
        </blockquote>
      </>
    ),
    sec3Body: (
      <>
        <p className="mt-3 leading-relaxed text-text">
          <strong>在決定物件之前——構想階段最為合適</strong>
          。障礙福祉服務的指定，要求物件的地點、結構、面積、消防設備符合基準，實務上確實發生過簽訂租賃契約後才發現「這個物件無法取得指定」的案例。四葉行政書士事務所與關係企業四葉不動産株式会社合作，
          <strong>從著眼指定基準的選擇物件階段起</strong>即可接受諮詢（不動產交易由四葉不動産作為另一事業體受任）。
        </p>
        <p className="mt-3 text-sm text-text-muted">
          順序如下：<strong>①構想諮詢（本事務所）→ ②尋找物件（四葉不動産）→ ③確認是否符合指定基準（本事務所）→ ④法人設立・指定申請（本事務所）→ ⑤開設</strong>。
        </p>
      </>
    ),
    feeH2: "費用・收費是多少？",
    feeBody: (locale) => (
      <>
        <p className="mt-3 leading-relaxed text-text">
          障礙福祉服務指定申請的報酬，依服務類別、是否需要法人設立、自治體而異。各項業務的金額刊載於報酬額表，也可依個別情況提供估價。
        </p>
        <p className="mt-2 text-sm">
          →{" "}
          <Link href={addLocalePrefix("/legal/ryokin", locale)} className="text-primary underline">障礙福祉服務指定申請的報酬額（報酬額表）</Link>
          <Placeholder reason="Notion＝料金体系・金額（報酬額表_HP公開用が正）" />
        </p>
      </>
    ),
    flowH2: "受任的流程為何？",
    flowBody: (locale) => (
      <>
        <p className="mt-3 leading-relaxed text-text">
          從諮詢到取得指定，依<strong>①諮詢 → ②估價・受任 → ③整理要件・製作文件 → ④申請・對應自治體 → ⑤取得指定・開始營運的支援</strong>的順序進行。
        </p>
        <p className="mt-2 text-sm">
          →{" "}
          <Link href={addLocalePrefix("/legal/nagare", locale)} className="text-primary underline">從諮詢到完成的受任流程</Link>
          <Placeholder reason="浦松＝各ステップの実運用・標準期間" />
        </p>
      </>
    ),
    meritH2: "把這個領域委託四葉行政書士事務所，有什麼優勢？",
    meritBody: (
      <p className="mt-3 leading-relaxed text-text">
        代表浦松 丈二曾任每日新聞中國總局長，<strong>34年來從事「整理複雜事實並加以傳達」的工作</strong>
        ，現為行政書士。障礙福祉的指定申請要件繁多，各自治體的解釋也不盡相同。整理論點、落實為有憑有據的申請文件——正是記者的功夫可以直接發揮的領域。加上與關係企業四葉不動産株式会社的合作，
        <strong>確保物件由四葉不動産株式会社、指定申請由本事務所，各自另行簽訂契約承辦。</strong>諮詢的入口是共同的。同時具備這種組合的事務所並不多。
        <Placeholder reason="浦松＝公開可能な実績・件数（確定分のみ。無ければ数値は書かない）" />
      </p>
    ),
    relatedHeading: "本頁相關連結",
    relatedLinks: [
      { href: "/legal/ryokin", label: "報酬額表" },
      { href: "/legal/nagare", label: "受任流程" },
      { href: "/legal/services/company", label: "公司設立・各類許可" },
      { href: "/legal/faq", label: "常見問題" },
    ],
    authorBody: (
      <>
        <strong>本文作者</strong> 浦松 丈二｜四葉行政書士事務所 代表行政書士（登錄編號 第25087022號）・宅地建物取引士。曾任每日新聞中國總局長（記者資歷34年）。已通過社會保險勞務士考試（預定2026年9月開業）。
      </>
    ),
  },
  zh: {
    metaTitle: "残障福祉服务指定申请｜四葉行政書士事務所",
    metaDesc:
      "文京区的四葉行政書士事務所，协助残障福祉服务（团体家屋・放学后等日间服务等）的事业者指定申请。从法人设立到指定申请、加算申报、运营支援均可对应。由曾任新闻记者的行政书士，为您梳理复杂的要件。",
    crumbHome: "首页",
    crumbServices: "业务介绍",
    crumbCurrent: "残障福祉服务指定申请",
    heroAlt: "残障福祉服务指定申请的示意图（团体家屋与申请文件）",
    h1: "残障福祉服务事业者的指定申请",
    lead: (
      <>
        残障福祉服务事业者的指定申请，<strong>可以委托行政书士办理</strong>。四葉行政書士事務所（东京都文京区小日向）以团体家屋（共同生活援助）、放学后等日间服务、儿童发展支援等的
        <strong>指定申请为中心，从作为前提的法人设立，到指定后的加算申报・变更申报・运营支援，一体承办</strong>
        。指定要件因自治体而在细节上有所不同，人员基准、设备基准、运营规程之间的一致性都会受到审查。四葉行政書士事務所从“梳理要件”开始，到文件制作、提交申请，全程协助。
      </>
    ),
    qa: [
      {
        q: "什么是残障福祉服务的指定申请？",
        a: "要运营残障福祉服务事业（团体家屋、放学后等日间服务、生活照护等），必须取得都道府县・市区町村的事业者指定。主要条件可归纳为法人资格、人员基准、设备／运营基准三项。四葉行政書士事務所为您梳理要件，并代为制作、提交申请文件。",
      },
      {
        q: "四葉行政書士事務所可以协助到什么范围？",
        a: "从法人设立、指定申请、加算申报・变更申报，到指定后的运营支援，一体对应。劳务（就业规则・工资等）属社会保险劳务士、登记属司法书士、税务属税理士的执业范围。物件由关联企业四葉不動産作为另一事业体承办。",
      },
      {
        q: "团体家屋的开设咨询，什么时机最合适？",
        a: "在确定物件之前——构想阶段最为合适。指定要求物件的地点、结构、面积、消防设备符合基准，实务中曾有签约后才发现不符基准的案例。我们与四葉不動産合作，从着眼指定基准的选择物件阶段起，即可接受咨询。",
      },
    ],
    sec1Body: (
      <>
        <p className="mt-3 leading-relaxed text-text">
          要运营残障福祉服务事业（团体家屋、放学后等日间服务、生活照护等），必须
          <strong>取得都道府县・市区町村的“事业者指定”</strong>。取得指定的主要条件，可归纳为以下三项。
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-primary-tint text-left">
                <th className="border border-border px-3 py-2">条件</th>
                <th className="border border-border px-3 py-2">内容</th>
                <th className="border border-border px-3 py-2">容易受挫之处</th>
              </tr>
            </thead>
            <tbody className="text-text-muted">
              <tr>
                <td className="border border-border px-3 py-2">法人资格</td>
                <td className="border border-border px-3 py-2">须为株式会社、合同会社、NPO法人等</td>
                <td className="border border-border px-3 py-2">章程（定款）的事业目的须载明福祉事业</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">人员基准</td>
                <td className="border border-border px-3 py-2">配置管理者、服务管理责任者等</td>
                <td className="border border-border px-3 py-2">须确认资格与经验年数的要件</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">设备・运营基准</td>
                <td className="border border-border px-3 py-2">物件的结构・面积・消防等＋运营规程的完备</td>
                <td className="border border-border px-3 py-2">曾有签订物件合同后才发现不符基准的案例</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          依据是基于残障者综合支援法及儿童福祉法的指定基准（含自治体的条例、要纲）。文件不齐或对基准的解释偏差，会直接导致指定延迟或重新申请。四葉行政書士事務所事先为您梳理要件，并代为制作、提交申请文件。
        </p>
        <p className="mt-2 text-sm text-text-muted">
          对象服务示例：共同生活援助（团体家屋）、放学后等日间服务、儿童发展支援、生活照护等
          <Placeholder reason="浦松＝実際に対応するサービス種別の確定" />
        </p>
      </>
    ),
    sec2Body: (locale) => (
      <>
        <p className="mt-3 leading-relaxed text-text">四葉行政書士事務所连同指定申请的前后阶段，一体对应以下范围。</p>
        <ul className="mt-3 space-y-2 text-sm text-text">
          <li>
            <strong>法人设立</strong>：制作作为指定前提的法人设立文件（株式会社・合同会社・NPO法人等）
            <Placeholder reason="浦松＝対応する法人形態" />
            　→ 详情：<Link href={addLocalePrefix("/legal/services/company", locale)} className="text-primary underline">公司设立・各类许可的业务内容</Link>
          </li>
          <li>
            <strong>指定申请</strong>：人员・设备・运营基准的事前确认、申请文件全套的制作与提交、与自治体的协商对应
          </li>
          <li>
            <strong>加算申报・变更申报</strong>：体制加算等的申报、事业所的变更手续
            <Placeholder reason="浦松＝加算届の対応範囲。処遇改善加算の扱いは石井弁護士確認（下記注記）" />
          </li>
          <li>
            <strong>运营支援</strong>：指定后的文件完备、实地指导（稽查）应对的准备（建议・陪同属非独占业务。
            <strong>劳务＝就业规则・工资等不包含在内＝请洽社会保险劳务士</strong>）
            <Placeholder reason="浦松＝運営支援の具体範囲" />
          </li>
          <li>
            <strong>物件</strong>：可用于团体家屋・事业所的物件，由关联企业四葉不動産株式会社（宅地建物取引業）承办 →{" "}
            <Link href={addLocalePrefix("/toushi/group-home", locale)} className="text-primary underline">寻找可作团体家屋的物件</Link>
            <br />
            <span className="text-xs text-text-muted">
              ※四葉不動産株式会社与四葉行政書士事務所是各自独立的事业体，分别接受委托（不收取介绍费等）。
            </span>
          </li>
        </ul>

        {/* 業際の注記（区分表準拠・断定回避） */}
        <blockquote className="mt-4 border-l-4 border-primary bg-primary-tint p-3 text-xs leading-relaxed text-text">
          <strong>执业范围的注记</strong>：登记申请属司法书士、税务申报属税理士、劳务・社会保险手续属社会保险劳务士的执业范围。
          <strong>
            处遇改善加算按工序划分——加算体制申报、计划书、实绩报告等向指定权者（自治体）提交之文件的制作＝行政书士／就业规则、工资规程、职业发展路径要件等工资制度的设计＝社会保险劳务士
          </strong>
          。在四葉，由两家事务所以<strong>分别受任</strong>的方式承办（社会保险劳务士为2026年9月开业后）。四葉行政書士事務所在行政书士业务范围内对应，其余部分将为您转介合作的专业人士。
          <Placeholder reason="石井弁護士＝業際表現の最終確認（両サイトで断定しない）" />
        </blockquote>
      </>
    ),
    sec3Body: (
      <>
        <p className="mt-3 leading-relaxed text-text">
          <strong>在确定物件之前——构想阶段最为合适</strong>
          。残障福祉服务的指定，要求物件的地点、结构、面积、消防设备符合基准，实务中确实发生过签订租赁合同后才发现“该物件无法取得指定”的案例。四葉行政書士事務所与关联企业四葉不動産株式会社合作，
          <strong>从着眼指定基准的选择物件阶段起</strong>即可接受咨询（不动产交易由四葉不動産作为另一事业体受任）。
        </p>
        <p className="mt-3 text-sm text-text-muted">
          顺序如下：<strong>①构想咨询（本事务所）→ ②寻找物件（四葉不動産）→ ③确认是否符合指定基准（本事务所）→ ④法人设立・指定申请（本事务所）→ ⑤开设</strong>。
        </p>
      </>
    ),
    feeH2: "费用・收费是多少？",
    feeBody: (locale) => (
      <>
        <p className="mt-3 leading-relaxed text-text">
          残障福祉服务指定申请的报酬，因服务类别、是否需要法人设立、自治体而异。各项业务的金额载于报酬额表，也可根据个别情况提供报价。
        </p>
        <p className="mt-2 text-sm">
          →{" "}
          <Link href={addLocalePrefix("/legal/ryokin", locale)} className="text-primary underline">残障福祉服务指定申请的报酬额（报酬额表）</Link>
          <Placeholder reason="Notion＝料金体系・金額（報酬額表_HP公開用が正）" />
        </p>
      </>
    ),
    flowH2: "受任的流程是怎样的？",
    flowBody: (locale) => (
      <>
        <p className="mt-3 leading-relaxed text-text">
          从咨询到取得指定，按<strong>①咨询 → ②报价・受任 → ③梳理要件・制作文件 → ④申请・对应自治体 → ⑤取得指定・开始运营的支援</strong>的顺序进行。
        </p>
        <p className="mt-2 text-sm">
          →{" "}
          <Link href={addLocalePrefix("/legal/nagare", locale)} className="text-primary underline">从咨询到完成的受任流程</Link>
          <Placeholder reason="浦松＝各ステップの実運用・標準期間" />
        </p>
      </>
    ),
    meritH2: "把这个领域委托四葉行政書士事務所，有什么优势？",
    meritBody: (
      <p className="mt-3 leading-relaxed text-text">
        代表浦松 丈二曾任每日新闻中国总局长，<strong>34年来从事“整理复杂事实并加以传达”的工作</strong>
        ，现为行政书士。残障福祉的指定申请要件繁多，各自治体的解释也不尽相同。梳理论点、落实为有据可依的申请文件——正是记者的功夫可以直接发挥的领域。加上与关联企业四葉不動産株式会社的合作，
        <strong>确保物件由四葉不動産株式会社、指定申请由本事务所，各自另行签订合同承办。</strong>咨询的入口是共同的。同时具备这种组合的事务所并不多。
        <Placeholder reason="浦松＝公開可能な実績・件数（確定分のみ。無ければ数値は書かない）" />
      </p>
    ),
    relatedHeading: "本页相关链接",
    relatedLinks: [
      { href: "/legal/ryokin", label: "报酬额表" },
      { href: "/legal/nagare", label: "受任流程" },
      { href: "/legal/services/company", label: "公司设立・各类许可" },
      { href: "/legal/faq", label: "常见问题" },
    ],
    authorBody: (
      <>
        <strong>本文作者</strong> 浦松 丈二｜四葉行政書士事務所 代表行政书士（登录编号 第25087022号）・宅地建物取引士。曾任每日新闻中国总局长（记者经历34年）。已通过社会保险劳务士考试（预定2026年9月开业）。
      </>
    ),
  },
};

// generateMetadata＝ロケール別title/desc（COPYから）。path・businessKey・absoluteTitleは不変。
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;
  return buildPageMetadata({
    businessKey: "legal",
    title: c.metaTitle,
    description: c.metaDesc,
    path: "/legal/services/shogai-fukushi",
    locale,
    absoluteTitle: true,
  });
}

function jsonLd() {
  // BreadcrumbList は <Breadcrumb> 部品が出力（二重を避ける）。FAQPage は /legal/faq 専用
  // （疑問文H2は表示のみ＝本文とFAQPage回答文の不一致を避ける）。QA は表示見出しに使用。
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Service", "GovernmentService"],
        "@id": PAGE_URL + "#service",
        name: "障害福祉サービス事業者の指定申請 支援",
        serviceType: "障害福祉サービス指定申請の代行・支援（法人設立〜加算届〜運営支援）",
        areaServed: "東京都およびその周辺",
        provider: { "@id": "https://luck428.com/legal/#organization" },
        author: { "@id": "https://luck428.com/#uramatsu-joji" },
        url: PAGE_URL,
      },
    ],
  };
}

export default async function Page() {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;
  const crossLinks = getCrossLinks(PATH, SR_LAUNCHED); // C2→/toushi/group-home（C9→laborは開業まで非表示）

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }} />

      <Breadcrumb
        items={[
          { name: c.crumbHome, href: "/legal" },
          { name: c.crumbServices, href: "/legal/services" },
          { name: c.crumbCurrent },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 pb-16">
        {/* 0. ヒーロービジュアル（各業務ページで slug を差し替え：/hero/legal-<slug>-16x9.webp）
             本番は next/image（priority＋sizes）に。SP は -1x1 も利用可。 */}
        <img
          src="/hero/legal-shogai-fukushi-16x9.webp"
          alt={c.heroAlt}
          width={1600}
          height={900}
          className="mt-3 w-full rounded-2xl object-cover"
          fetchPriority="high"
        />

        {/* 1. 結論・回答ファースト＋代表カード小 */}
        <header className="pt-4">
          <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">{c.h1}</h1>
          <p className="mt-4 leading-relaxed text-text">{c.lead}</p>
        </header>

        {/* 2. 疑問文H2 一問一答（表示のみ） */}
        <section className="mt-8 space-y-8">
          <div>
            <h2 className="font-serif text-xl font-semibold text-ink">{c.qa[0].q}</h2>
            {c.sec1Body}
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-ink">{c.qa[1].q}</h2>
            {c.sec2Body(locale)}
          </div>

          <div>
            <h2 className="font-serif text-xl font-semibold text-ink">{c.qa[2].q}</h2>
            {c.sec3Body}
          </div>

          {/* 費用 */}
          <div>
            <h2 className="font-serif text-xl font-semibold text-ink">{c.feeH2}</h2>
            {c.feeBody(locale)}
          </div>

          {/* 受任の流れ */}
          <div>
            <h2 className="font-serif text-xl font-semibold text-ink">{c.flowH2}</h2>
            {c.flowBody(locale)}
          </div>

          {/* メリット */}
          <div>
            <h2 className="font-serif text-xl font-semibold text-ink">{c.meritH2}</h2>
            {c.meritBody}
          </div>
        </section>

        {/* 内部リンク束 */}
        <nav aria-label="関連リンク" className="mt-8 rounded-xl border border-border bg-surface p-4 text-sm">
          <div className="font-medium text-ink">{c.relatedHeading}</div>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-primary">
            {c.relatedLinks.map((l) => (
              <li key={l.href}><Link href={addLocalePrefix(l.href, locale)} className="underline">{l.label}</Link></li>
            ))}
          </ul>
        </nav>

        {/* クロスリンク（C2→/toushi/group-home・独立受任注記） */}
        {crossLinks.map((cl) => (
          <CrossLinkBanner key={cl.id} link={cl} />
        ))}

        {/* 署名（E-E-A-T・Person @id は全事業共通 https://luck428.com/#uramatsu-joji／本体は不動産 /about） */}
        <aside className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
          <img src="/staff/uramatsu-square.webp" alt="四葉行政書士事務所 代表 浦松丈二" width={48} height={48} className="h-12 w-12 flex-shrink-0 rounded-full object-cover" />
          <p className="text-xs leading-relaxed text-text-muted">{c.authorBody}</p>
        </aside>
      </article>

      {/* CTA帯（LINE主CTA） */}
      <div className="mx-auto max-w-3xl px-4">
        <CtaBand businessKey="legal" />
      </div>
    </>
  );
}
