"use client";
// PetHousingCta — /pet-housing の入口（借り手と大家を分ける。ペット横断 指示書 版2.0 第10章）。
// 主CTA＝ページ内の各フォーム、副CTA＝LINE（/line 中継）。
// GA4：cta_contact_click（location=pet_housing_{hero|mid}_{renter|owner}・page=pet_housing）。入力値は送らない。
import { LineLink } from "@/components/shared/LineLink";
import { gaEvent } from "@/lib/gtag";

const primary =
  "inline-flex min-h-[44px] items-center rounded-lg bg-primary-dark px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary focus:outline-none focus:ring-2 focus:ring-focus";
const secondary =
  "inline-flex min-h-[44px] items-center rounded-lg border border-primary px-5 py-3 text-sm font-semibold text-primary-dark transition-colors hover:bg-primary-dark hover:text-white focus:outline-none focus:ring-2 focus:ring-focus";

export function PetHousingCta({ location }: { location: "hero" | "mid" }) {
  const click = (who: "renter" | "owner") => () => gaEvent("cta_contact_click", { location: `pet_housing_${location}_${who}`, page: "pet_housing" });
  return (
    <aside aria-label="ご相談の入口" className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-border bg-primary-tint p-4 sm:p-5">
        <p className="font-semibold text-ink">多頭飼い・大型犬でも、住まいを諦めない。</p>
        <p className="mt-1 text-sm text-text-muted">借りたい方・買いたい方</p>
        <a href="#renter-form" onClick={click("renter")} className={`${primary} mt-3`}>多頭飼いできる家を探す</a>
      </div>
      <div className="rounded-xl border border-border bg-surface p-4 sm:p-5">
        <p className="font-semibold text-ink">その空室を、ペットと暮らす人の住まいに。</p>
        <p className="mt-1 text-sm text-text-muted">大家さん・所有者の方</p>
        <a href="#owner-form" onClick={click("owner")} className={`${primary} mt-3`}>ペット飼育者に貸せるか相談する</a>
      </div>
      <div className="sm:col-span-2">
        <LineLink location={`pet_housing_${location}`} page="pet_housing" className={secondary}>LINEで相談する</LineLink>
      </div>
    </aside>
  );
}
