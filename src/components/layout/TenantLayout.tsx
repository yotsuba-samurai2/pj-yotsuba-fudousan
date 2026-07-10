"use client";

import Image from "next/image";
import { LocaleLink as Link } from "@/components/ui/LocaleLink";
import { useState, useEffect, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, CalendarDays } from "lucide-react";
import { groupBusinesses } from "@/config/group";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { GroupSwitcher } from "@/components/ui/GroupSwitcher";
import { useTranslation } from "@/hooks/useTranslation";
import { tenantThemeVars } from "@/lib/tenant-theme";
import { normalizePath } from "@/lib/normalize-path"; // cross-links直importはC7文言のクライアント同梱を招くため禁止
import { MobileStickyBar } from "@/components/shared/MobileStickyBar";
import { LinkaFab } from "@/components/shared/LinkaFab";
import type { BusinessKey } from "@/lib/shared/office";

type NavItem = { href: string; label: string };
type FooterSection = { title: string; links: NavItem[] };

/** テナントごとのナビ href 定義（言語に依存しない） */
const NAV_HREFS: Record<string, { href: string; key: string }[]> = {
  realestate: [
    { href: "/services", key: "services" },
    { href: "/about", key: "about" },
    { href: "/column", key: "column" },
    { href: "/contact", key: "contact" },
  ],
  legal: [
    // TODO: 社労士開業（2026年9月）後に復活
    // { href: "/legal", key: "home" },
    { href: "/legal", key: "services" },
    { href: "/legal/about", key: "about" },
    { href: "/legal/column", key: "column" },
    { href: "/contact", key: "contact" },
  ],
  // 社労士：ページ自体が SR_LAUNCHED=false の間は404（(labor)/layout.tsx）＝ここは labor ページ表示時のみ使われる
  labor: [
    { href: "/labor/services", key: "services" },
    { href: "/labor/about", key: "about" },
    { href: "/labor/column", key: "column" },
    { href: "/contact", key: "contact" },
  ],
};

/** テナントごとのフッターナビ href 定義 */
const FOOTER_NAV_HREFS: Record<
  string,
  { sectionKey: string; items: { href: string; key: string }[] }[]
> = {
  realestate: [
    {
      sectionKey: "services",
      items: [
        { href: "/services#rental", key: "rental" },
        { href: "/services#sale", key: "sale" },
        { href: "/services#management", key: "management" },
        { href: "/services#foreign-residents", key: "foreignResidents" },
      ],
    },
    {
      sectionKey: "company",
      items: [
        { href: "/about", key: "about" },
        { href: "/column", key: "column" },
      ],
    },
    {
      sectionKey: "other",
      items: [
        { href: "/contact", key: "contact" },
        { href: "/legal-notice", key: "legalNotice" },
      ],
    },
  ],
  legal: [
    {
      sectionKey: "services",
      items: [
        { href: "/legal", key: "subsidy" },
        { href: "/legal", key: "visa" },
        { href: "/legal", key: "incorporation" },
        { href: "/legal", key: "permits" },
      ],
    },
    {
      sectionKey: "office",
      items: [
        { href: "/legal/about", key: "about" },
        { href: "/legal/column", key: "column" },
      ],
    },
    {
      sectionKey: "other",
      items: [{ href: "/contact", key: "contact" }],
    },
  ],
  // 社労士：ページ自体が SR_LAUNCHED=false の間は404＝laborページ表示時のみ使われる
  labor: [
    {
      sectionKey: "services",
      items: [
        { href: "/labor/services", key: "socialInsurance" },
        { href: "/labor/services", key: "subsidy" },
        { href: "/labor/services", key: "rules" },
        { href: "/labor/services", key: "payroll" },
      ],
    },
    {
      sectionKey: "office",
      items: [
        { href: "/labor/about", key: "about" },
        { href: "/labor/column", key: "column" },
      ],
    },
    {
      sectionKey: "other",
      items: [{ href: "/contact", key: "contact" }],
    },
  ],
};

function TenantHeader({ businessKey }: { businessKey: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();

  const biz = groupBusinesses.find((b) => b.key === businessKey)!;

  const allNav = useMemo(() => {
    const hrefs = NAV_HREFS[businessKey] ?? [];
    return hrefs.map((h) => ({
      href: h.href,
      label: t(`${businessKey}.nav.${h.key}`),
    }));
  }, [businessKey, t]);

  const navItems = allNav.filter((n) => n.href !== "/contact");
  const contactItem = allNav.find((n) => n.href === "/contact");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const isActive = useCallback(
    (href: string) => {
      if (href === "/") return pathname === "/";
      const hasChildNavItem = navItems.some(
        (n) => n.href !== href && n.href.startsWith(href + "/"),
      );
      if (hasChildNavItem) return pathname === href;
      return pathname === href || pathname.startsWith(href + "/");
    },
    [pathname, navItems],
  );

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "header-border-gradient bg-surface/50 backdrop-blur-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
          <div className="relative z-50 flex shrink-0 items-center gap-2">
            <div className="hidden md:block">
              <GroupSwitcher />
            </div>
            <Link href={biz.href} className="flex items-center">
              <Image
                src={biz.logo.horizontal}
                alt={t(`${businessKey}.name`)}
                width={260}
                height={72}
                className="h-10 w-auto sm:h-14"
                priority
              />
            </Link>
          </div>

          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label={t("common.navigation.mainNav")}
          >
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`header-nav-link relative px-4 py-2 text-base font-medium transition-colors duration-200 ${
                  isActive(href) ? "header-nav-active" : "text-text-muted"
                }`}
              >
                {label}
                <span
                  className={`gradient-line absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 rounded-full transition-all duration-300 ${
                    isActive(href) ? "w-4/5" : "w-0"
                  }`}
                />
              </Link>
            ))}

            <div className="ml-2 border-l border-border pl-3">
              <LanguageSwitcher />
            </div>

            {contactItem && (
              <Link
                href={contactItem.href}
                className="cta-gradient-outline ml-3 px-5 py-2 text-base font-semibold shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <span className="cta-gradient-text">{contactItem.label}</span>
              </Link>
            )}
          </nav>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative z-50 flex h-10 w-10 items-center justify-center rounded-lg text-text transition-colors hover:bg-surface-dim md:hidden"
            aria-label={
              isOpen
                ? t("common.navigation.closeMenu")
                : t("common.navigation.openMenu")
            }
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <nav
        aria-label={t("common.navigation.mobileMenu")}
        className={`fixed right-0 top-0 z-40 flex h-full w-[min(18rem,85vw)] flex-col bg-surface pt-16 shadow-2xl transition-transform duration-300 ease-out sm:pt-20 md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-1 flex-col gap-1 px-4 py-4">
          {navItems.map(({ href, label }, i) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className={`header-nav-link flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive(href)
                  ? "bg-primary/5 header-nav-active"
                  : "text-text-muted hover:bg-surface-dim"
              }`}
              style={{ transitionDelay: isOpen ? `${i * 50}ms` : "0ms" }}
            >
              {isActive(href) && (
                <span className="gradient-line mr-2 h-4 w-0.5 rounded-full" />
              )}
              {label}
            </Link>
          ))}
        </div>
        {/* 下部固定バー(64px・z-40)に隠れないよう底上げ（言語切替＋お問い合わせを可視域に） */}
        <div className="border-t border-border px-4 py-4 pb-[88px]">
          <div className="mb-4 flex justify-center">
            <LanguageSwitcher />
          </div>
          {contactItem && (
            <Link
              href={contactItem.href}
              onClick={() => setIsOpen(false)}
              className="cta-gradient-outline flex w-full items-center justify-center px-5 py-3 text-sm font-semibold shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <span className="cta-gradient-text">{contactItem.label}</span>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}

function TenantFooter({ businessKey }: { businessKey: string }) {
  const currentYear = new Date().getFullYear();
  const biz = groupBusinesses.find((b) => b.key === businessKey)!;
  const { t } = useTranslation();

  const footerSections: FooterSection[] = useMemo(() => {
    const defs = FOOTER_NAV_HREFS[businessKey] ?? [];
    return defs.map((section) => ({
      title: t(`${businessKey}.footerNav.${section.sectionKey}.title`),
      links: section.items.map((item) => ({
        href: item.href,
        label: t(`${businessKey}.footerNav.${section.sectionKey}.${item.key}`),
      })),
    }));
  }, [businessKey, t]);

  return (
    <footer className="text-text">
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-10 sm:px-6 sm:pt-16 sm:pb-12 lg:px-8">
        <div className="flex flex-col gap-8 sm:gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="shrink-0">
            <Link href={biz.href} className="inline-block">
              <Image
                src={biz.logo.square}
                alt={t(`${businessKey}.name`)}
                width={160}
                height={140}
                className="h-28 w-auto"
              />
            </Link>
            <p className="cta-gradient-text mt-1 text-xs font-medium tracking-[0.15em]">
              {t(`${businessKey}.tagline`)}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-text/50">
              {t(`${businessKey}.footerDescription1`)}
              <br />
              {t(`${businessKey}.footerDescription2`)}
            </p>
            <address className="mt-4 text-xs not-italic leading-relaxed text-text/50">
              {t("address.postalCode")}
              <br />
              {t("address.full")}
            </address>
            <div className="mt-3 text-xs text-text/50">
              <a href={`tel:${t("address.phone")}`} className="hover:text-text">
                TEL: {t("address.phone")}
              </a>
            </div>

            {/* SNS + Booking */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://www.facebook.com/uramatsujoji"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text/40 transition-colors hover:border-primary/30 hover:text-primary"
                aria-label="Facebook"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/uramatsu_joji/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text/40 transition-colors hover:border-primary/30 hover:text-primary"
                aria-label="Instagram"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C16.67.014 16.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://note.com/luck428"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-text/40 transition-colors hover:border-primary/30 hover:text-primary"
                aria-label="note"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.195 2.641c-1.2-.499-4.063-.46-6.309.122-2.274.588-4.208 1.66-4.208 1.66s-.09-.2-.539-.408c-.449-.207-1.382-.525-2.792-.37-1.41.156-3.143.922-4.49 2.34C2.51 7.402 1.744 9.899 1.57 11.562c-.175 1.664-.07 3.463.384 5.105.455 1.643 1.34 3.296 2.782 4.348 1.443 1.053 3.092 1.186 4.544.922 1.452-.264 2.78-.886 3.812-1.584 1.032-.698 1.827-1.335 2.272-1.776l.145-.148c.184.24.414.46.694.64.96.617 2.12.563 2.963.32.843-.243 1.53-.65 2.083-1.095.553-.446.963-.916 1.248-1.29.284-.374.4-.605.4-.605l-1.462-.8s-.085.15-.306.43a5.831 5.831 0 01-.927.891c-.372.284-.817.533-1.322.662-.505.129-1.122.126-1.53-.137-.188-.122-.33-.287-.445-.504l7.395-3.62s.16-.7.108-1.874c-.054-1.175-.302-2.764-1.188-4.186-.887-1.423-2.188-2.18-3.35-2.577-1.163-.397-2.166-.517-2.902-.524-.737-.008-1.21.065-1.21.065s1.17-.713 2.872-1.196c1.702-.483 3.954-.56 5.26-.2l-.194-1.671zm-7.597 7.106c.485.033.937.12 1.312.275.75.308 1.278.828 1.636 1.418.358.59.55 1.247.652 1.835l-6.543 3.202c-.098-.39-.16-.8-.175-1.252-.028-.831.1-1.83.448-2.73.348-.9.876-1.72 1.575-2.254.485-.37 1.095-.494 1.095-.494z" />
                </svg>
              </a>
              <a
                href="https://www.samurai.co.jp/samurai/reserve/uramatsu-joji"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-text/40 transition-colors hover:border-primary/30 hover:text-primary"
                aria-label={t("common.footer.samuraiName")}
              >
                <CalendarDays size={16} />
                <span className="text-xs font-medium">
                  {t("common.booking")}
                </span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-12">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-bold tracking-wide text-text">
                  {section.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {section.links.map(({ href, label }, i) => (
                    <li key={`${href}-${i}`}>
                      <Link
                        href={href}
                        className="group inline-flex items-center text-sm text-text/50 transition-colors duration-200"
                      >
                        <span className="gradient-line mr-2 inline-block h-px w-0 transition-all duration-200 group-hover:w-3" />
                        <span className="footer-link-text">{label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Group businesses */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <p className="text-center text-[10px] font-medium tracking-[0.3em] text-text-muted">
            {t("brand.groupNameEn")}
          </p>
          <p className="mt-1 text-center text-sm font-bold">
            {t("brand.groupName")}
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {groupBusinesses.map((b) => {
              const isCurrent = b.key === businessKey;
              const inner = (
                <div
                  className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                    isCurrent
                      ? "border-primary/30 bg-primary/5"
                      : "border-border bg-surface hover:border-primary/30 hover:bg-surface-dim"
                  }`}
                >
                  <Image
                    src={b.logo.square}
                    alt={t(`${b.key}.name`)}
                    width={48}
                    height={48}
                    className="h-12 w-12 shrink-0 object-contain"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold">
                      {t(`${b.key}.name`)}
                    </p>
                    <p className="text-[10px] text-text-muted">
                      {isCurrent
                        ? t("common.currentSite")
                        : t(`${b.key}.description`)}
                    </p>
                  </div>
                </div>
              );
              if (isCurrent) return <div key={b.key}>{inner}</div>;
              return (
                <Link key={b.key} href={b.href}>
                  {inner}
                </Link>
              );
            })}
          </div>
          {/* 独立受任注記（業法分離・紹介料なし＝ページ割v2 §3-3。翻訳キー未投入時は日本語で表示） */}
          <p className="mt-4 text-center text-[10px] leading-relaxed text-text-muted">
            {t("common.footer.independentNote") ||
              "※各事業は別の事業体として独立してご依頼をお受けします（紹介料等の授受はありません）。"}
          </p>
        </div>
      </div>

      {/* SAMURAI */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-[10px] font-medium tracking-[0.2em] text-text-muted">
            {t("common.footer.managedServices")}
          </p>
          <div className="mx-auto mt-4 max-w-xs">
            <a
              href="https://www.samurai.co.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-text/5 text-lg font-bold text-text/60">
                S
              </div>
              <div>
                <p className="text-sm font-bold">
                  {t("common.footer.samuraiName")}
                </p>
                <p className="mt-0.5 text-[10px] text-text-muted">
                  {t("common.footer.samuraiDescription")}
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Legal */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-[11px] font-medium text-text/40">
            {t("common.footer.legalHeadquartersLine")}
          </p>
          <div className="mt-3 space-y-1 text-[10px] leading-relaxed text-text/30">
            <p>{t("common.footer.realestateRegistration")}</p>
            <p>{t("common.footer.realestateRepRegistration")}</p>
            <p>{t("common.footer.legalRepRegistration")}</p>
            {/* 個人の"試験合格"は表示可・事務所は開業まで非表示（社労士_試験合格表記_実装指示_v1）。
                representative.srExamNote は /admin/fix-sr-notation 適用後に値が入る（未投入時は非表示） */}
            {t("representative.srExamNote") && (
              <p>{t("representative.srExamNote")}</p>
            )}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-text/30">
            &copy; {currentYear} {t("common.footer.copyright")}
          </p>
          <div className="flex items-center gap-6 text-xs text-text/30">
            <Link
              href="/privacy-policy"
              className="group/legal transition-colors duration-200"
            >
              <span className="footer-link-text">
                {t("common.footer.privacyPolicy")}
              </span>
            </Link>
            <Link
              href="/terms"
              className="group/legal transition-colors duration-200"
            >
              <span className="footer-link-text">
                {t("common.footer.terms")}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function TenantLayoutShell({
  businessKey,
  children,
}: {
  businessKey: BusinessKey;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // 【1ページ1LINKA】不動産トップ（各locale含む）は本文の60秒診断がLINKA＝FABを出さない
  const isRealestateTop =
    businessKey === "realestate" && normalizePath(pathname ?? "/") === "/";
  return (
    // A-2: テナント主色を route group 単位で --color-primary に割当（fixed子要素にも継承）
    <div style={tenantThemeVars(businessKey)}>
      <TenantHeader businessKey={businessKey} />
      {/* pb: SPの固定バー（MobileStickyBar）に本文が隠れないための余白 */}
      <main id="main-content" className="relative z-[1] pt-16 pb-[64px] sm:pt-20 md:pb-0">
        {children}
      </main>
      <TenantFooter businessKey={businessKey} />
      <MobileStickyBar businessKey={businessKey} />
      <LinkaFab businessKey={businessKey} suppressed={isRealestateTop} />
    </div>
  );
}
