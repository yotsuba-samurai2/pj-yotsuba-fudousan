"use client";

import Image from "next/image";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { ArrowRight, MapPin } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

// 社労士カードは開業（SR_LAUNCHED=true・2026-09-01）まで非表示。
// 翻訳DB側の realestate.aboutPage.groupBusinesses は3件あり、開業前は
// [locale]/layout.tsx の stripSrEntities が社労士エントリを落とす（法27条）。
// カードの描画は groupBusinesses.slice(0, groupLogos.length) なので、
// この配列の長さが「出す枚数」になる＝ここも同じ条件で出し分ける。
const groupLogos = [
  "/yotsuba/realestate-square.png",
  "/yotsuba/legal-square.png",
  ...(process.env.NEXT_PUBLIC_SR_LAUNCHED === "true"
    ? ["/yotsuba/labor-square.png"]
    : []),
];

// 代表プロフィール導線のロケール別ラベル（翻訳チェック§J1・2026-07-20）。
// Firestoreに新キーを増やさずコード内直書き（B-1フッター「料金」等と同方式）。
const PROFILE_LINK_LABEL: Record<string, string> = {
  ja: "代表プロフィールを見る",
  en: "View Representative Profile",
  "zh-tw": "查看代表簡介",
  zh: "查看代表简介",
};

// 所属団体の可視表示（2026-08-01 新設）。
// これまで所属団体は /llms.txt（機械可読層）にしか書いておらず、人が読むHTMLに存在しなかった。
// 団体名は日本語の正式名称のまま全ロケール共通で出す。各団体の公式な英訳・中文表記は
// 裏取りできていないため訳さない（監査原則）。見出しと注記のみロケール別。
// リンク先は「当社の掲載を実際に確認できたページ」だけを指す（2026-08-01 現物確認）。
// seo.ts の REALESTATE_MEMBER_OF と対で管理すること。
const AFFILIATION_TITLE: Record<string, string> = {
  ja: "所属団体",
  en: "Affiliations",
  "zh-tw": "所屬團體",
  zh: "所属团体",
};

const AFFILIATION_NOTE: Record<string, string> = {
  ja: "各団体の会員名簿で当社の掲載をご確認いただけます。",
  en: "Our membership can be verified in each association's member directory.",
  "zh-tw": "可於各團體的會員名冊確認本公司的登載。",
  zh: "可在各团体的会员名册确认本公司的登载。",
};

const AFFILIATIONS: { href: string; name: string }[] = [
  {
    // 当社の会員詳細ページ（免許番号・商号・住所・HP欄が一致・2026-07-10確認）
    href: "https://www.tokyo-takken.or.jp/search-member/detail/31253",
    name: "公益社団法人 東京都宅地建物取引業協会",
  },
  {
    href: "https://www.zentaku.or.jp/",
    name: "公益社団法人 全国宅地建物取引業保証協会",
  },
  {
    // 東京都支部 正会員一覧の全件版。当社は全件版にのみ掲載される（list.php には出ない）
    href: "https://www.jpm.jp/branch/all.php?cid=14",
    name: "公益財団法人 日本賃貸住宅管理協会 東京都支部（正会員）",
  },
];

export default function AboutPageContent() {
  const { t, tArray, tObject, locale } = useTranslation();

  const companyInfo = tArray<{ label: string; value: string }>(
    "realestate.aboutPage.companyInfo"
  );

  const highlights = tObject<
    Record<string, { label: string; value: string }>
  >("realestate.aboutPage.highlights");
  const highlightEntries = Object.values(highlights);

  const groupBusinesses = tArray<{ name: string; description: string }>(
    "realestate.aboutPage.groupBusinesses"
  );

  return (
    <div>
      <BreadcrumbJsonLd
        businessKey="realestate"
        items={[
          { name: t("realestate.nav.about"), href: "/" },
          { name: t("realestate.aboutPage.title"), href: "/about" },
        ]}
      />
      {/* ─── Hero ─── */}
      <section className="relative grid min-h-[40vh] place-content-center overflow-hidden border-b border-border pt-24 pb-16 sm:pt-32 sm:pb-32 md:pt-40 md:pb-40">
        <div
          className="pointer-events-none absolute inset-0 bg-green-gradient"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">
            ABOUT
          </p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl">
            {t("realestate.aboutPage.title")}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-muted sm:text-base">
            {t("realestate.aboutPage.heroDescription1")}
            <br />
            {t("realestate.aboutPage.heroDescription2")}
          </p>
        </div>
      </section>

      {/* ─── 代表紹介 ─── */}
      <section className="py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8 sm:gap-12 lg:flex-row lg:gap-20">
            {/* Photo */}
            <div className="w-full shrink-0 lg:w-[38%]">
              <div className="gradient-border mx-auto aspect-[3/4] max-w-[280px] overflow-hidden rounded-2xl sm:max-w-sm">
                <Image
                  src="/uramatsu.png"
                  alt={t("representative.name")}
                  width={400}
                  height={533}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Profile */}
            <div className="w-full lg:w-[62%]">
              <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">
                REPRESENTATIVE
              </p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                {t("realestate.aboutPage.representativeTitle")}
              </h2>
              <p className="mt-1 text-sm text-text-muted">
                {t("representative.nameEn")}
              </p>

              <div className="mt-8 space-y-4 text-sm leading-[1.9] text-text-muted">
                <p>
                  {t("realestate.aboutPage.representativeBio1")}
                </p>
                <p>
                  {t("realestate.aboutPage.representativeBio2")}
                </p>
              </div>

              {/* Highlights */}
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {highlightEntries.map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-lg border border-border bg-surface-dim p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-md"
                  >
                    <p className="text-[10px] font-medium tracking-wider text-text-muted">
                      {label}
                    </p>
                    <p className="mt-1 text-sm font-bold">{value}</p>
                  </div>
                ))}
              </div>

              {/* 社労士は"試験合格"のみ別立て表記（登録済み資格と横並びにしない・
                  社労士_試験合格表記_実装指示_v1 §0）。データ未投入時は非表示 */}
              {t("representative.srExamNote") && (
                <p className="mt-3 text-xs text-text-muted">
                  {t("representative.srExamNote")}
                </p>
              )}

              {/* タスクB-2（2026-07-19）：代表プロフィール専用ページ（/about/uramatsu）への導線。
                  ラベルは2026-07-20（翻訳チェック§J1）で4ロケール直書き化。 */}
              <div className="mt-6">
                <Link
                  href="/about/uramatsu"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-opacity hover:opacity-80"
                >
                  {PROFILE_LINK_LABEL[locale] ?? PROFILE_LINK_LABEL.ja}
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 会社情報テーブル ─── */}
      <section className="border-t border-border bg-surface-dim py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">
              COMPANY
            </p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              {t("realestate.aboutPage.companyInfoTitle")}
            </h2>
          </div>

          <div className="mt-12 overflow-hidden rounded-xl border border-border bg-surface">
            {companyInfo.map(({ label, value }, i) => (
              <div
                key={label}
                className={`flex flex-col gap-1 px-4 py-4 sm:flex-row sm:gap-0 sm:px-6 sm:py-5 ${
                  i !== companyInfo.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <dt className="w-full shrink-0 text-sm font-bold sm:w-40">
                  {label}
                </dt>
                <dd className="whitespace-pre-line text-sm text-text-muted">
                  {value}
                </dd>
              </div>
            ))}
          </div>

          {/* 所属団体（2026-08-01 新設）＝実在性の裏付け。各団体の会員名簿へ直接リンクする */}
          <div className="mt-8 overflow-hidden rounded-xl border border-border bg-surface px-4 py-5 sm:px-6 sm:py-6">
            <h3 className="text-sm font-bold">
              {AFFILIATION_TITLE[locale] ?? AFFILIATION_TITLE.ja}
            </h3>
            <ul className="mt-3 space-y-2">
              {AFFILIATIONS.map(({ href, name }) => (
                <li key={href} className="text-sm leading-relaxed">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted underline decoration-border underline-offset-4 transition-colors hover:text-primary"
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-text-muted">
              {AFFILIATION_NOTE[locale] ?? AFFILIATION_NOTE.ja}
            </p>
          </div>
        </div>
      </section>

      {/* ─── アクセス ─── */}
      <section className="py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">
              ACCESS
            </p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              {t("realestate.aboutPage.accessTitle")}
            </h2>
          </div>

          <div className="mx-auto mt-12 max-w-4xl">
            <div className="overflow-hidden rounded-xl border border-border bg-surface">
              <iframe
                src="https://maps.google.com/maps?q=35.7150431,139.7396698&z=17&output=embed&hl=ja"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={t("realestate.home.access.mapTitle")}
              />
            </div>
            <div className="mt-6 flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-bold">{t("realestate.name")}</p>
                <p className="mt-1 text-sm text-text-muted">
                  {t("address.postalCode")} {t("address.full")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── グループ事業 ─── */}
      <section className="border-t border-border bg-surface-dim py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">
            {t("brand.groupNameEn")}
          </p>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
            {t("realestate.aboutPage.partnersTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-muted">
            {t("realestate.aboutPage.partnersDescription1")}
            <br />
            {t("realestate.aboutPage.partnersDescription2")}
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {groupBusinesses.slice(0, groupLogos.length).map((biz, i) => {
              const isCurrent = i === 0;
              return (
                <div
                  key={biz.name}
                  className={`relative overflow-hidden rounded-xl border bg-surface p-6 ${
                    isCurrent
                      ? "border-primary/30 shadow-md"
                      : "border-border"
                  }`}
                >
                  {isCurrent && (
                    <span className="absolute right-3 top-3 rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-medium text-primary">
                      {t("common.thisSite")}
                    </span>
                  )}
                  <Image
                    src={groupLogos[i]}
                    alt={biz.name}
                    width={64}
                    height={64}
                    className="mx-auto h-16 w-16 object-contain"
                  />
                  <p className="mt-4 text-sm font-bold">{biz.name}</p>
                  <p className="mt-1 text-xs text-text-muted">{biz.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="border-t border-border bg-green-gradient py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">
            {t("common.cta.feelFreeToContact")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-muted">
            {t("realestate.aboutPage.ctaDescription")}
          </p>
          <div className="mt-10">
            <Link
              href="/contact"
              className="gradient-line inline-flex items-center gap-2 rounded-md px-10 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:brightness-110"
            >
              {t("common.cta.contactUs")}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
