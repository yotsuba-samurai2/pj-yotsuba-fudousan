import { buildPageMetadata } from "@/lib/seo";
import AboutPageContent from "./AboutPageContent";

export const metadata = buildPageMetadata({
  businessKey: "realestate",
  title: "会社概要",
  description: "四葉不動産の会社概要・代表紹介。文京区小日向の不動産会社です。",
  path: "/about",
});

export default function AboutPage() {
  return <AboutPageContent />;
}
