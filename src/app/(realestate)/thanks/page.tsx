import { buildPageMetadata } from "@/lib/seo";
import { ThanksPageClient } from "./ThanksPageClient";

export const metadata = buildPageMetadata({
  businessKey: "realestate",
  title: "送信完了 | 四葉パートナーズ",
  description: "お問い合わせを受け付けました。",
  path: "/thanks",
  noindex: true,
});

export default function ThanksPage() {
  return (
    <div>
      <ThanksPageClient />
    </div>
  );
}
