import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  businessKey: "legal",
  title: "送信完了 | 四葉行政書士事務所",
  description: "お問い合わせを受け付けました。",
  path: "/legal/thanks",
  noindex: true,
});

export default function LegalThanksPage() {
  return (
    <div>
      <section className="flex min-h-[70vh] items-center justify-center px-4 pt-20">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle size={40} className="text-primary" />
          </div>
          <h1 className="mt-8 text-2xl font-bold sm:text-3xl">
            お問い合わせを受け付けました
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-text-muted">
            2営業日以内にご返信いたします。
            <br />
            しばらくお待ちください。
          </p>
          <div className="mt-10">
            <Link
              href="/legal"
              className="gradient-line inline-flex items-center gap-2 rounded-md px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:brightness-110 opacity-80"
            >
              トップに戻る
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
