// /about/uramatsu（代表者プロフィール）＝タスクB-2（2026-07-19）／多言語化＝タスクC-6-3（2026-07-19）
// 方式＝COPY: Record<LangCode,…>＋getRequestLocale（手本=/ryokin タスクB-1）。C-6-3 で en/zh-tw/zh を追加＝全4ロケール公開：
//   availableLocales は既定（全4ロケール）＝hreflang4本相互設定。sitemap側も locales 指定を外して全4ロケール出力。
//   経歴の駐在歴は全ロケールで国名を具体列挙し、国数表記（「4カ国」「four countries」「四個國家」等）は使用しない。
//   Person は言語版をまたいで同一 @id＝KG上マージ。name は Wikidata Q139738129 の各言語ラベル実測値に一致させる
//   （en=Joji Uramatsu／zh-hant・zh-hans=浦松丈二＝スペースなし／ja=浦松 丈二）。
//   hasCredential の identifier（登録番号）と sameAs は全ロケールで日本語版と完全同一値。
// 経歴事実の一次資料＝リポジトリ内の既存記載（llms.txt route・/global・/ryokin authorBio）に限定：
//   記者34年／中国総局長として中国や台湾、タイに駐在（中華圏に12年）／国立台湾師範大学に留学／2025年設立。
//   受賞歴・著書・講演実績などリポジトリで確認できない事実は書かない。国数表記（「4カ国」等）は使用禁止（タスクA-1で全廃済み）。
// 表示コンプライアンス（宅建業法・分離受任）：業務一体提供を示唆する語（ワンストップ等）は全文で使用禁止。
//   行政書士業務は「併設の四葉行政書士事務所が別契約で受任」の形でのみ記載。
// 社労士＝「2026年9月開業予定・現時点では未開業」の注記を維持（登録済み資格と横並びにしない）。
// JSON-LD：
//   - ProfilePage＋Person（mainEntity）。Personは既存founderと同一 @id（PERSON_ID）のサブセットノード
//     ＝B-2指定フィールドのみ（hasCredential=宅建士・行政書士の2件。社労士試験合格は本文注記のみで出力しない）。
//     Personフルノードの正は従来どおり /about の ProfilePageJsonLd（seo.ts PERSON_JSONLD）＝@id同一でKG上マージ。
//   - FAQPage（3問）＝Faq部品 withJsonLd。※既存規則「FAQPage は各サイト1本＝/faq のみ」（委任§4-6）の
//     例外＝タスクB-2指示による（B-1 /ryokin と同じ扱い）。
//   - BreadcrumbList＝Breadcrumb部品（ホーム＞会社概要＞代表プロフィール）。
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buildPageMetadata, BCP47_BY_LOCALE, PERSON_ID, SAMURAI_URAMATSU_URL, SITE_URL } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { Faq, type FaqItem } from "@/components/shared/Faq";
import { CtaBand } from "@/components/shared/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import type { LangCode } from "@/config/languages";

type Section = { h2: string; body: React.ReactNode };
type ProfileCopy = {
  metaTitle: string;
  metaDesc: string;
  breadcrumbHome: string;
  breadcrumbAbout: string;
  breadcrumbCurrent: string;
  h1: string;
  /** 冒頭の回答ブロック（タスクB-2確定文言＝一字一句不変） */
  answerBlock: string;
  portraitAlt: string;
  sections: Section[];
  faqHeading: string;
  faqItems: FaqItem[];
  relatedAria: string;
  relatedHeading: string;
  relatedLinks: { href: string; label: string }[];
};

const JA: ProfileCopy = {
  metaTitle: "代表・浦松丈二プロフィール｜元新聞記者の宅建士・行政書士",
  metaDesc:
    "四葉不動産株式会社 代表取締役・浦松丈二のプロフィール。毎日新聞で記者を34年務め、中国総局長として中国や台湾、タイに駐在。宅地建物取引士（東京・第293544号）・行政書士（登録番号第25087022号）。相続や外国人対応の相談に日本語・英語・中国語で応じます。法務手続きは併設の四葉行政書士事務所が別契約で受任します。",
  breadcrumbHome: "ホーム",
  breadcrumbAbout: "会社概要",
  breadcrumbCurrent: "代表プロフィール",
  h1: "浦松丈二（うらまつ・じょうじ）",
  answerBlock:
    "浦松丈二は四葉不動産株式会社の代表取締役で、宅地建物取引士（東京・第293544号）および行政書士（登録番号第25087022号）です。毎日新聞で記者を34年務め、中国総局長として中国や台湾、タイに駐在しました。2026年9月に社会保険労務士事務所の開業を予定しています。相続や外国人対応の相談に、日本語・英語・中国語で応じます。不動産取引は四葉不動産、法務手続きは四葉行政書士事務所がそれぞれ別契約で担当します。",
  portraitAlt: "四葉不動産株式会社 代表取締役 浦松丈二",
  sections: [
    {
      h2: "経歴",
      body: (
        <>
          <p className="mt-3 leading-relaxed text-text">
            毎日新聞で記者を34年務め、中国総局長として中国や台湾、タイに駐在しました（中華圏に12年）。国立台湾師範大学に留学し、中国語（繁体字・簡体字）での取材・折衝を重ねてきました。
          </p>
          <p className="mt-3 leading-relaxed text-text">
            2025年、東京都文京区小日向に四葉不動産株式会社を設立し、代表取締役に就任。あわせて四葉行政書士事務所を開設し、代表行政書士を務めています。不動産取引は四葉不動産株式会社が、相続書類・許認可などの法務手続きは併設の四葉行政書士事務所が、それぞれ別契約で受任します。
          </p>
        </>
      ),
    },
    {
      h2: "保有資格",
      body: (
        <>
          <ul className="mt-3 list-disc space-y-1 pl-5 leading-relaxed text-text">
            <li>宅地建物取引士（東京）第293544号</li>
            <li>行政書士 登録番号第25087022号</li>
          </ul>
          {/* 社労士は「試験合格」のみ別立て表記（登録済み資格と横並びにしない・社労士_試験合格表記_実装指示_v1 §0） */}
          <p className="mt-3 rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text-muted">
            社会保険労務士試験合格（令和7年 第202500525号）。2026年9月に社会保険労務士事務所の開業を予定しており、現時点では未開業です。
          </p>
        </>
      ),
    },
    {
      h2: "多言語対応の背景",
      body: (
        <p className="mt-3 leading-relaxed text-text">
          中国総局長として中国や台湾、タイに駐在した経験と、国立台湾師範大学への留学経験に基づき、日本語・英語・中国語（繁体字・簡体字）でご相談に応じています。中国語での取材・折衝を重ねてきた経験を、外国人のお客さまの住まい探しや契約のサポートに活かしています。
        </p>
      ),
    },
    {
      h2: "士業ドットコムの運営",
      body: (
        <>
          <p className="mt-3 leading-relaxed text-text">
            士業の検索・予約サイト「士業ドットコム」（samurai.co.jp）を運営しています。同サイトでは代表のプロフィール・相談予約ページも公開しています。
          </p>
          {/* 外部リンクは代表予約ページ1本のみ（浦松指示 2026-07-19＝samurai.co.jpトップへは張らない） */}
          <p className="mt-3 text-sm">
            <a
              href={SAMURAI_URAMATSU_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              士業ドットコムの代表プロフィール・予約ページ
            </a>
          </p>
        </>
      ),
    },
  ],
  faqHeading: "代表・浦松丈二についてよくあるご質問",
  faqItems: [
    {
      q: "浦松丈二はどんな経歴ですか？",
      a: "毎日新聞で記者を34年務め、中国総局長として中国や台湾、タイに駐在しました。2025年に東京都文京区小日向で四葉不動産株式会社を設立し、代表取締役を務めています。あわせて四葉行政書士事務所を開設し、代表行政書士を務めています。",
    },
    {
      q: "保有資格は何ですか？",
      a: "宅地建物取引士（東京・第293544号）と行政書士（登録番号第25087022号）です。社会保険労務士は試験に合格しており（令和7年 第202500525号）、2026年9月に事務所の開業を予定しています（現時点では未開業）。",
    },
    {
      q: "中国語対応の背景は？",
      a: "中国総局長として中国や台湾、タイに駐在した経験と、国立台湾師範大学への留学経験に基づいています。日本語・英語・中国語（繁体字・簡体字）でご相談に応じています。",
    },
  ],
  relatedAria: "関連リンク",
  relatedHeading: "このページの関連リンク",
  relatedLinks: [
    { href: "/about", label: "会社概要" },
    { href: "/legal", label: "四葉行政書士事務所" },
    { href: "/souzoku", label: "文京区で不動産を相続したら" },
    { href: "/global", label: "外国人・多言語のお部屋探し" },
    { href: "/contact", label: "お問い合わせ" },
  ],
};

// 英語（C-6-3 第1段階で浦松承認の統一訳語）。既存 /en 各ページの "gyoseishoshi lawyer" は
// 弁護士と誤読されるため本ページでは使用しない（既存分の統一は別タスク）。
const EN: ProfileCopy = {
  metaTitle:
    "Joji Uramatsu, Representative｜Former Newspaper Journalist, Real Estate Transaction Specialist and Gyoseishoshi",
  metaDesc:
    "Profile of Joji Uramatsu, Representative Director of Yotsuba Real Estate Co., Ltd. He spent 34 years as a journalist at the Mainichi Shimbun and was stationed in China, Taiwan, and Thailand as its China General Bureau Chief. Licensed Real Estate Transaction Specialist (Tokyo, No. 293544) and Gyoseishoshi (Administrative Scrivener) (Registration No. 25087022). Consultations on inheritance and support for non-Japanese clients in Japanese, English, and Chinese. Legal paperwork is handled by the affiliated Yotsuba Gyoseishoshi Office, engaged under a separate contract.",
  breadcrumbHome: "Home",
  breadcrumbAbout: "About Us",
  breadcrumbCurrent: "Representative's Profile",
  h1: "Joji Uramatsu (Uramatsu Joji)",
  answerBlock:
    "Joji Uramatsu is Representative Director of Yotsuba Real Estate Co., Ltd., a Licensed Real Estate Transaction Specialist (Tokyo, No. 293544) and a Gyoseishoshi (Administrative Scrivener) (Registration No. 25087022). He spent 34 years as a journalist at the Mainichi Shimbun and was stationed in China, Taiwan, and Thailand as its China General Bureau Chief. He plans to open a Certified Social Insurance and Labor Consultant (Sharoushi) office in September 2026. He handles consultations on inheritance and support for non-Japanese clients in Japanese, English, and Chinese. Real estate transactions are handled by Yotsuba Real Estate Co., Ltd. and legal procedures by Yotsuba Gyoseishoshi Office, each engaged under a separate contract.",
  portraitAlt: "Joji Uramatsu, Representative Director of Yotsuba Real Estate Co., Ltd.",
  sections: [
    {
      h2: "Career",
      body: (
        <>
          <p className="mt-3 leading-relaxed text-text">
            He spent 34 years as a journalist at the Mainichi Shimbun and was stationed in China, Taiwan, and Thailand as its China General Bureau Chief (12 years in Chinese-speaking regions). He studied at National Taiwan Normal University and has built up experience reporting and negotiating in Chinese, both Traditional and Simplified.
          </p>
          <p className="mt-3 leading-relaxed text-text">
            In 2025 he founded Yotsuba Real Estate Co., Ltd. in Kohinata, Bunkyo-ku, Tokyo, and took office as its Representative Director. At the same time he opened Yotsuba Gyoseishoshi Office, where he serves as representative gyoseishoshi. Real estate transactions are undertaken by Yotsuba Real Estate Co., Ltd., and legal procedures such as inheritance documents and permits and licenses by the affiliated Yotsuba Gyoseishoshi Office — each engaged under a separate contract.
          </p>
        </>
      ),
    },
    {
      h2: "Qualifications",
      body: (
        <>
          <ul className="mt-3 list-disc space-y-1 pl-5 leading-relaxed text-text">
            <li>Licensed Real Estate Transaction Specialist (宅地建物取引士), Tokyo, No. 293544</li>
            <li>Gyoseishoshi (Administrative Scrivener) (行政書士), Registration No. 25087022</li>
          </ul>
          {/* 社労士は「試験合格」のみ別立て表記（登録済み資格と横並びにしない） */}
          <p className="mt-3 rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text-muted">
            Passed the Certified Social Insurance and Labor Consultant (Sharoushi, 社会保険労務士) examination (Reiwa 7 [2025], No. 202500525). He plans to open a Certified Social Insurance and Labor Consultant office in September 2026 and has not opened one at this time.
          </p>
        </>
      ),
    },
    {
      h2: "Background to our multilingual support",
      body: (
        <p className="mt-3 leading-relaxed text-text">
          Drawing on his experience being stationed in China, Taiwan, and Thailand as China General Bureau Chief, and on his studies at National Taiwan Normal University, he offers consultations in Japanese, English, and Chinese (Traditional and Simplified). The experience he built up reporting and negotiating in Chinese goes into supporting international clients as they look for a home and enter into contracts.
        </p>
      ),
    },
    {
      h2: "Operating 士業ドットコム (Shigyo Dot Com)",
      body: (
        <>
          <p className="mt-3 leading-relaxed text-text">
            He operates 士業ドットコム (Shigyo Dot Com, samurai.co.jp), a site for searching and booking licensed professionals. The site also publishes his profile and a consultation booking page.
          </p>
          {/* 外部リンクは代表予約ページ1本のみ。リンク先は日本語のみのため (Japanese) を明記 */}
          <p className="mt-3 text-sm">
            <a
              href={SAMURAI_URAMATSU_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Profile and booking page for our representative on 士業ドットコム (Shigyo Dot Com) (Japanese)
            </a>
          </p>
        </>
      ),
    },
  ],
  faqHeading: "Frequently asked questions about Joji Uramatsu, our representative",
  faqItems: [
    {
      q: "What is Joji Uramatsu's background?",
      a: "He spent 34 years as a journalist at the Mainichi Shimbun and was stationed in China, Taiwan, and Thailand as its China General Bureau Chief. In 2025 he founded Yotsuba Real Estate Co., Ltd. in Kohinata, Bunkyo-ku, Tokyo, where he serves as Representative Director. At the same time he opened Yotsuba Gyoseishoshi Office, where he serves as representative gyoseishoshi.",
    },
    {
      q: "What qualifications does he hold?",
      a: "He is a Licensed Real Estate Transaction Specialist (Tokyo, No. 293544) and a Gyoseishoshi (Administrative Scrivener) (Registration No. 25087022). He has passed the Certified Social Insurance and Labor Consultant examination (Reiwa 7 [2025], No. 202500525) and plans to open an office in September 2026 (not yet open at this time).",
    },
    {
      q: "What is the background to your Chinese-language support?",
      a: "It comes from his experience being stationed in China, Taiwan, and Thailand as China General Bureau Chief, and from his studies at National Taiwan Normal University. Consultations are available in Japanese, English, and Chinese (Traditional and Simplified).",
    },
  ],
  relatedAria: "Related links",
  relatedHeading: "Related pages",
  relatedLinks: [
    { href: "/about", label: "About Us" },
    { href: "/legal", label: "Yotsuba Gyoseishoshi Office" },
    { href: "/souzoku", label: "Inheriting real estate in Bunkyo" },
    { href: "/global", label: "Room-hunting and multilingual support for international residents" },
    { href: "/contact", label: "Contact" },
  ],
};

// 繁体字（C-6-1・C-6-2 の確定語彙を踏襲。大学名は台湾の正式表記＝國立臺灣師範大學）
const ZH_TW: ProfileCopy = {
  metaTitle: "代表・浦松丈二簡介｜前報社記者的宅地建物交易士・行政書士",
  metaDesc:
    "四葉不動産株式会社 代表取締役・浦松丈二的簡介。在每日新聞擔任記者34年，以中國總局長身分派駐中國、台灣與泰國。宅地建物交易士（日本語：宅地建物取引士／東京・第293544號）・行政書士（登錄號碼第25087022號）。以日語・英語・中文回應繼承與外國人對應的諮詢。法務手續由併設的四葉行政書士事務所另行簽訂契約承辦。",
  breadcrumbHome: "首頁",
  breadcrumbAbout: "公司概要",
  breadcrumbCurrent: "代表簡介",
  h1: "浦松丈二（Joji Uramatsu）",
  answerBlock:
    "浦松丈二是四葉不動産株式会社的代表取締役（負責人），並具備宅地建物交易士（日本語：宅地建物取引士／東京・第293544號）及行政書士（登錄號碼第25087022號）資格。在每日新聞擔任記者34年，以中國總局長身分派駐中國、台灣與泰國。預計於2026年9月開設社會保險勞務士事務所。以日語・英語・中文回應繼承與外國人對應的諮詢。不動產交易由四葉不動産、法務手續由四葉行政書士事務所各自另行簽訂契約負責。",
  portraitAlt: "四葉不動産株式会社 代表取締役 浦松丈二",
  sections: [
    {
      h2: "經歷",
      body: (
        <>
          <p className="mt-3 leading-relaxed text-text">
            在每日新聞擔任記者34年，以中國總局長身分派駐中國、台灣與泰國（在中文圈12年）。曾留學國立臺灣師範大學，累積以中文（繁體字・簡體字）進行採訪與交涉的經驗。
          </p>
          <p className="mt-3 leading-relaxed text-text">
            2025年於東京都文京區小日向設立四葉不動産株式会社，就任代表取締役。同時開設四葉行政書士事務所，擔任代表行政書士。不動產交易由四葉不動産株式会社、繼承文件與許可認可等法務手續由併設的四葉行政書士事務所，各自另行簽訂契約承辦。
          </p>
        </>
      ),
    },
    {
      h2: "持有資格",
      body: (
        <>
          <ul className="mt-3 list-disc space-y-1 pl-5 leading-relaxed text-text">
            <li>宅地建物交易士（日本語：宅地建物取引士／東京）第293544號</li>
            <li>行政書士 登錄號碼第25087022號</li>
          </ul>
          <p className="mt-3 rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text-muted">
            社會保險勞務士（日本語：社会保険労務士）考試合格（令和7年〔2025年〕第202500525號）。預計於2026年9月開設社會保險勞務士事務所，目前尚未開業。
          </p>
        </>
      ),
    },
    {
      h2: "多語言對應的背景",
      body: (
        <p className="mt-3 leading-relaxed text-text">
          基於以中國總局長身分派駐中國、台灣與泰國的經驗，以及留學國立臺灣師範大學的經歷，我們以日語・英語・中文（繁體字・簡體字）提供諮詢。將長年以中文採訪與交涉累積的經驗，運用於協助外國客戶尋找住處與簽訂契約。
        </p>
      ),
    },
    {
      h2: "士業ドットコム的營運",
      body: (
        <>
          <p className="mt-3 leading-relaxed text-text">
            營運士業檢索・預約網站「士業ドットコム」（samurai.co.jp）。該網站亦公開代表的簡介・諮詢預約頁面。
          </p>
          <p className="mt-3 text-sm">
            <a
              href={SAMURAI_URAMATSU_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              士業ドットコム的代表簡介・預約頁面（日文頁面）
            </a>
          </p>
        </>
      ),
    },
  ],
  faqHeading: "關於代表・浦松丈二的常見問題",
  faqItems: [
    {
      q: "浦松丈二有什麼樣的經歷？",
      a: "在每日新聞擔任記者34年，以中國總局長身分派駐中國、台灣與泰國。2025年於東京都文京區小日向設立四葉不動産株式会社，擔任代表取締役。同時開設四葉行政書士事務所，擔任代表行政書士。",
    },
    {
      q: "持有哪些資格？",
      a: "宅地建物交易士（日本語：宅地建物取引士／東京・第293544號）與行政書士（登錄號碼第25087022號）。社會保險勞務士已通過考試（令和7年〔2025年〕第202500525號），預計於2026年9月開設事務所（目前尚未開業）。",
    },
    {
      q: "中文對應的背景是什麼？",
      a: "基於以中國總局長身分派駐中國、台灣與泰國的經驗，以及留學國立臺灣師範大學的經歷。以日語・英語・中文（繁體字・簡體字）提供諮詢。",
    },
  ],
  relatedAria: "相關連結",
  relatedHeading: "本頁的相關連結",
  relatedLinks: [
    { href: "/about", label: "公司概要" },
    { href: "/legal", label: "四葉行政書士事務所" },
    { href: "/souzoku", label: "在文京區繼承不動產" },
    { href: "/global", label: "外國人・多語言租屋" },
    { href: "/contact", label: "聯絡我們" },
  ],
};

// 簡体字（大陸読者に自然な語彙。大学名は簡体字表記＝国立台湾师范大学）
const ZH: ProfileCopy = {
  metaTitle: "代表・浦松丈二简介｜前报社记者的宅地建物交易士・行政书士",
  metaDesc:
    "四葉不動産株式会社 代表取締役・浦松丈二的简介。在每日新闻担任记者34年，以中国总局长身份派驻中国、台湾与泰国。宅地建物交易士（日本語：宅地建物取引士／东京・第293544号）・行政书士（登录号码第25087022号）。以日语・英语・中文回应继承与外国人对应的咨询。法务手续由并设的四葉行政书士事务所另行签订合同承办。",
  breadcrumbHome: "首页",
  breadcrumbAbout: "公司概要",
  breadcrumbCurrent: "代表简介",
  h1: "浦松丈二（Joji Uramatsu）",
  answerBlock:
    "浦松丈二是四葉不動産株式会社的代表取締役（负责人），并具备宅地建物交易士（日本語：宅地建物取引士／东京・第293544号）及行政书士（登录号码第25087022号）资格。在每日新闻担任记者34年，以中国总局长身份派驻中国、台湾与泰国。预计于2026年9月开设社会保险劳务士事务所。以日语・英语・中文回应继承与外国人对应的咨询。不动产交易由四葉不動産、法务手续由四葉行政书士事务所各自另行签订合同负责。",
  portraitAlt: "四葉不動産株式会社 代表取締役 浦松丈二",
  sections: [
    {
      h2: "经历",
      body: (
        <>
          <p className="mt-3 leading-relaxed text-text">
            在每日新闻担任记者34年，以中国总局长身份派驻中国、台湾与泰国（在中文圈12年）。曾留学国立台湾师范大学，积累以中文（繁体字・简体字）进行采访与交涉的经验。
          </p>
          <p className="mt-3 leading-relaxed text-text">
            2025年于东京都文京区小日向设立四葉不動産株式会社，就任代表取締役。同时开设四葉行政书士事务所，担任代表行政书士。不动产交易由四葉不動産株式会社、继承文件与许可认可等法务手续由并设的四葉行政书士事务所，各自另行签订合同承办。
          </p>
        </>
      ),
    },
    {
      h2: "持有资格",
      body: (
        <>
          <ul className="mt-3 list-disc space-y-1 pl-5 leading-relaxed text-text">
            <li>宅地建物交易士（日本語：宅地建物取引士／东京）第293544号</li>
            <li>行政书士 登录号码第25087022号</li>
          </ul>
          <p className="mt-3 rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text-muted">
            社会保险劳务士（日本語：社会保険労務士）考试合格（令和7年〔2025年〕第202500525号）。预计于2026年9月开设社会保险劳务士事务所，目前尚未开业。
          </p>
        </>
      ),
    },
    {
      h2: "多语言对应的背景",
      body: (
        <p className="mt-3 leading-relaxed text-text">
          基于以中国总局长身份派驻中国、台湾与泰国的经验，以及留学国立台湾师范大学的经历，我们以日语・英语・中文（繁体字・简体字）提供咨询。将长年以中文采访与交涉积累的经验，运用于协助外国客户寻找住处与签订合同。
        </p>
      ),
    },
    {
      h2: "士業ドットコム的运营",
      body: (
        <>
          <p className="mt-3 leading-relaxed text-text">
            运营士业检索・预约网站「士業ドットコム」（samurai.co.jp）。该网站亦公开代表的简介・咨询预约页面。
          </p>
          <p className="mt-3 text-sm">
            <a
              href={SAMURAI_URAMATSU_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              士業ドットコム的代表简介・预约页面（日文页面）
            </a>
          </p>
        </>
      ),
    },
  ],
  faqHeading: "关于代表・浦松丈二的常见问题",
  faqItems: [
    {
      q: "浦松丈二有什么样的经历？",
      a: "在每日新闻担任记者34年，以中国总局长身份派驻中国、台湾与泰国。2025年于东京都文京区小日向设立四葉不動産株式会社，担任代表取締役。同时开设四葉行政书士事务所，担任代表行政书士。",
    },
    {
      q: "持有哪些资格？",
      a: "宅地建物交易士（日本語：宅地建物取引士／东京・第293544号）与行政书士（登录号码第25087022号）。社会保险劳务士已通过考试（令和7年〔2025年〕第202500525号），预计于2026年9月开设事务所（目前尚未开业）。",
    },
    {
      q: "中文对应的背景是什么？",
      a: "基于以中国总局长身份派驻中国、台湾与泰国的经验，以及留学国立台湾师范大学的经历。以日语・英语・中文（繁体字・简体字）提供咨询。",
    },
  ],
  relatedAria: "相关链接",
  relatedHeading: "本页的相关链接",
  relatedLinks: [
    { href: "/about", label: "公司概要" },
    { href: "/legal", label: "四葉行政书士事务所" },
    { href: "/souzoku", label: "在文京区继承不动产" },
    { href: "/global", label: "外国人・多语言租房" },
    { href: "/contact", label: "联系我们" },
  ],
};

const COPY: Record<LangCode, ProfileCopy> = { ja: JA, en: EN, "zh-tw": ZH_TW, zh: ZH };

/**
 * ProfilePage＋Person（B-2指定のサブセットノード）のロケール別ノード。
 * hasCredential＝宅建士・行政書士の2件のみ（seo.ts PERSON_JSONLD と同一構造。
 * 社労士試験合格は本文注記のみ＝ここには含めない）。sameAs＝B-2指定の3本のみ
 * （フルセットは /about の PERSON_JSONLD.sameAs が正＝@id同一でマージされる）。
 *
 * C-6-3（多言語化）の規則：
 * - Person の @id は全ロケール共通（PERSON_ID）＝同一人物としてKG上マージされる。
 * - name は Wikidata Q139738129 の各言語ラベル実測値と一致させる。
 * - hasCredential.identifier（登録番号）と sameAs は全ロケールで日本語版と完全同一値。
 * - recognizedBy.name（登録先の都道府県知事／日本行政書士会連合会）は日本の制度上の固有名詞のため
 *   全ロケールで日本語表記のまま（訳を創作しない）。
 */
type PersonL10n = {
  /** ProfilePage の name（レイアウトの title テンプレート適用後の見え方に合わせる） */
  pageName: string;
  /** Wikidata の各言語ラベル実測値 */
  personName: string;
  jobTitle: string;
  orgName: string;
  credentialTakken: string;
  credentialGyosei: string;
};

const PERSON_L10N: Record<LangCode, PersonL10n> = {
  ja: {
    pageName: "代表・浦松丈二プロフィール｜元新聞記者の宅建士・行政書士 | 四葉不動産",
    personName: "浦松 丈二",
    jobTitle: "代表取締役",
    orgName: "四葉不動産株式会社",
    credentialTakken: "宅地建物取引士",
    credentialGyosei: "行政書士",
  },
  en: {
    pageName:
      "Joji Uramatsu, Representative｜Former Newspaper Journalist, Real Estate Transaction Specialist and Gyoseishoshi | Yotsuba Real Estate",
    personName: "Joji Uramatsu",
    jobTitle: "Representative Director",
    orgName: "Yotsuba Real Estate Co., Ltd.",
    credentialTakken: "Licensed Real Estate Transaction Specialist (宅地建物取引士)",
    credentialGyosei: "Gyoseishoshi (Administrative Scrivener) (行政書士)",
  },
  "zh-tw": {
    pageName: "代表・浦松丈二簡介｜前報社記者的宅地建物交易士・行政書士 | 四葉不動産",
    personName: "浦松丈二",
    jobTitle: "代表取締役（負責人）",
    orgName: "四葉不動産株式会社",
    credentialTakken: "宅地建物交易士（日本語：宅地建物取引士）",
    credentialGyosei: "行政書士",
  },
  zh: {
    pageName: "代表・浦松丈二简介｜前报社记者的宅地建物交易士・行政书士 | 四葉不動産",
    personName: "浦松丈二",
    jobTitle: "代表取締役（负责人）",
    orgName: "四葉不動産株式会社",
    credentialTakken: "宅地建物交易士（日本語：宅地建物取引士）",
    credentialGyosei: "行政书士（日本語：行政書士）",
  },
};

function buildProfilePageJsonLd(locale: LangCode) {
  const l = PERSON_L10N[locale];
  const url = `${SITE_URL}${addLocalePrefix("/about/uramatsu", locale)}`;
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${url}#profilepage`,
    url,
    name: l.pageName,
    inLanguage: BCP47_BY_LOCALE[locale],
    mainEntity: {
      "@type": "Person",
      "@id": PERSON_ID,
      name: l.personName,
      jobTitle: l.jobTitle,
      worksFor: {
        "@type": "Organization",
        "@id": "https://luck428.com/#organization",
        name: l.orgName,
      },
      knowsLanguage: ["ja", "en", "zh-Hant", "zh-Hans"],
      hasCredential: [
        {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: l.credentialTakken,
          // 登録番号は全ロケールで日本語版と完全同一値（翻訳・整形しない）
          identifier: "（東京）第293544号",
          recognizedBy: { "@type": "Organization", name: "登録先の都道府県知事" },
        },
        {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: l.credentialGyosei,
          identifier: "第25087022号",
          recognizedBy: {
            "@type": "Organization",
            name: "日本行政書士会連合会",
            url: "https://www.gyosei.or.jp/",
          },
        },
      ],
      sameAs: [
        "https://www.wikidata.org/wiki/Q139738129",
        "https://orcid.org/0009-0007-0460-3473",
        SAMURAI_URAMATSU_URL,
      ],
    },
  } as const;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? JA;
  return buildPageMetadata({
    businessKey: "realestate",
    // 社名はレイアウトのtitleテンプレート（%s | 四葉不動産）が付与＝ここでは書かない（重複防止）
    title: c.metaTitle,
    description: c.metaDesc,
    path: "/about/uramatsu",
    keywords: [
      "浦松丈二",
      "浦松丈二 プロフィール",
      "四葉不動産 代表",
      "元新聞記者 宅建士",
      "文京区 行政書士",
    ],
    locale,
    // C-6-3：全4ロケール公開＝availableLocales は既定（ja/en/zh-Hant/zh-Hans の hreflang 4本）
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? JA;

  return (
    <>
      <JsonLd data={buildProfilePageJsonLd(locale)} />
      <Breadcrumb
        items={[
          { name: c.breadcrumbHome, href: "/" },
          { name: c.breadcrumbAbout, href: "/about" },
          { name: c.breadcrumbCurrent },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 pb-16">
        <header className="pt-2">
          <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">{c.h1}</h1>
          {/* 冒頭の回答ブロック（タスクB-2確定文言） */}
          <p className="mt-4 rounded-xl border border-border bg-primary-tint p-4 leading-relaxed text-ink">
            {c.answerBlock}
          </p>
          <div className="mt-6 max-w-[220px] overflow-hidden rounded-xl border border-border">
            <Image
              src="/uramatsu.png"
              alt={c.portraitAlt}
              width={400}
              height={533}
              className="h-auto w-full object-cover"
            />
          </div>
        </header>

        {c.sections.map((s) => (
          <section key={s.h2} className="mt-8">
            <h2 className="font-serif text-xl font-semibold text-ink">{s.h2}</h2>
            {s.body}
          </section>
        ))}

        {/* FAQPage JSON-LD＝タスクB-2指示によりこのページで出力（ヘッダーコメント参照） */}
        <div className="-mx-4 mt-2">
          <Faq
            items={c.faqItems}
            heading={c.faqHeading}
            withJsonLd
            inLanguage={BCP47_BY_LOCALE[locale]}
            ariaLabel={c.faqHeading}
          />
        </div>

        <nav aria-label={c.relatedAria} className="mt-6 rounded-xl border border-border bg-surface p-4 text-sm">
          <div className="font-medium text-ink">{c.relatedHeading}</div>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-primary">
            {c.relatedLinks.map((l) => (
              <li key={l.href}>
                <Link href={addLocalePrefix(l.href, locale)} className="underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </article>

      <div className="mx-auto max-w-3xl px-4">
        <CtaBand businessKey="realestate" />
      </div>
    </>
  );
}
