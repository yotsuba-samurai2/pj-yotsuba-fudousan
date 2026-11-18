// Preserve the localized canonical, alternate links, and exact company name in every title.
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { HOME_ENTRIES } from "@/lib/home-conversion";
import HomePageContent from "./HomePageContent";

// School dates remain crawlable; the client island handles JST midnight expiry.
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const m = HOME_ENTRIES[locale];
  return buildPageMetadata({
    businessKey: "realestate",
    title: m.meta,
    description: m.desc,
    path: "/",
    keywords: ["四葉不動産", "文京区 学区 賃貸", "文京区 事業用物件", "相続不動産"],
    locale,
    absoluteTitle: true,
  });
}

export default function HomePage() {
  return <HomePageContent />;
}
