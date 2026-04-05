"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { addLocalePrefix } from "@/lib/locale";
import type { ComponentProps } from "react";

type LocaleLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

/**
 * ロケールプレフィックスを自動付与する Link コンポーネント
 * 日本語の場合はプレフィックスなし、他言語は /en/... 等を付与
 */
export function LocaleLink({ href, ...props }: LocaleLinkProps) {
  const { locale } = useLanguage();
  const localizedHref = addLocalePrefix(href, locale);

  return <Link href={localizedHref} {...props} />;
}
