import { Phone, MapPin, Clock, CalendarDays } from "lucide-react";
import { ContactForm } from "@/components/ui/ContactForm";
import { buildPageMetadata } from "@/lib/seo";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";

export const metadata = buildPageMetadata({
  businessKey: "labor",
  title: "お問い合わせ | 四葉社会保険労務士法人",
  description: "四葉社会保険労務士法人へのお問い合わせ。社会保険・労務管理・助成金申請など、どんなご相談でもお気軽にどうぞ。",
  path: "/labor/contact",
});

export default function LaborContactPage() {
  return (
    <div>
      <BreadcrumbJsonLd businessKey="labor" items={[
        { name: "ホーム", href: "/labor" },
        { name: "お問い合わせ", href: "/labor/contact" },
      ]} />
      <section className="relative grid min-h-[40vh] place-content-center overflow-hidden border-b border-border pt-24 pb-16 sm:pt-32 sm:pb-32 md:pt-40 md:pb-40">
        <div className="pointer-events-none absolute inset-0 bg-green-gradient" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="cta-gradient-text text-sm font-medium tracking-[0.2em]">CONTACT</p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl">お問い合わせ</h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-muted">
              社会保険・労務管理・助成金申請など、どんなご相談でもお気軽にどうぞ。
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
                    <p className="mt-1 text-sm text-text-muted">9:00〜18:00（平日・土日）</p>
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
                      小日向安田ビル 2F
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <ContactForm thanksPath="/labor/thanks" />
          </div>
        </div>
      </section>
    </div>
  );
}
