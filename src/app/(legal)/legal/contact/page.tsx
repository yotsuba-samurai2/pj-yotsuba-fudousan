import { Phone, MapPin, Clock, CalendarDays } from "lucide-react";
import { ContactForm } from "@/components/ui/ContactForm";
import { buildPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

export const metadata = buildPageMetadata({
  businessKey: "legal",
  title: "お問い合わせ",
  description: "補助金・助成金の申請書作成、ビザ・在留資格、会社設立、各種許認可のご相談はこちら。初回相談無料、電話・お問い合わせフォーム・オンライン予約で受付。文京区の四葉行政書士事務所が迅速・丁寧にお答えします。お気軽にどうぞ。",
  path: "/legal/contact",
});

export default function LegalContactPage() {
  return (
    <div>
      <BreadcrumbJsonLd businessKey="legal" items={[
        { name: "ホーム", href: "/legal" },
        { name: "お問い合わせ", href: "/legal/contact" },
      ]} />
      <section className="relative grid min-h-[40vh] place-content-center overflow-hidden border-b border-border pt-24 pb-16 sm:pt-32 sm:pb-32 md:pt-40 md:pb-40">
        <div className="pointer-events-none absolute inset-0 bg-green-gradient" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">CONTACT</p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl">お問い合わせ</h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-muted">
              補助金・助成金、ビザ申請、会社設立など、どんなご相談でもお気軽にどうぞ。
              <br />
              お電話・オンライン予約・フォームからお問い合わせいただけます。
            </p>
        </div>
      </section>

      <section className="py-14 sm:py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2 md:gap-12">
            {/* Contact info */}
            <div>
              <h2 className="text-xl font-bold">お問い合わせ方法</h2>
              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Phone size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">お電話</p>
                    <a href="tel:03-6161-9428" className="mt-1 text-lg font-bold text-primary hover:text-primary-dark">
                      03-6161-9428
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <CalendarDays size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">オンライン予約</p>
                    <a
                      href="https://www.samurai.co.jp/samurai/reserve/uramatsu-joji"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center text-sm text-primary hover:text-primary-dark"
                    >
                      SAMURAI予約ページへ →
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Clock size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">営業時間</p>
                    <p className="mt-1 text-sm text-text-muted">火・水 10:00〜19:00 ／ 月・木・金・土・日 18:00〜19:00</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">所在地</p>
                    <p className="mt-1 text-sm text-text-muted">
                      〒112-0006<br />
                      東京都文京区小日向４丁目２−５<br />
                      小日向安田ビル２０３
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <ContactForm thanksPath="/legal/thanks" business="legal" />
          </div>
        </div>
      </section>
    </div>
  );
}
