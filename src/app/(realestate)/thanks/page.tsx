import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { ThanksPageClient } from "./ThanksPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "realestate",
    title: "送信完了",
    description: "お問い合わせを受け付けました。",
    path: "/thanks",
    noindex: true,
    locale,
  });
}

export default function ThanksPage() {
  return (
    <div>
      <ThanksPageClient />
    </div>
  );
}
