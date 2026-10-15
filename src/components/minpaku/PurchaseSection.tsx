import Image from "next/image";
import Link from "next/link";
import { PurchaseCta } from "./PurchaseCta";
import styles from "./PurchaseSection.module.css";
import { MINPAKU_LISTINGS, MINPAKU_MATERIAL_CHECKED, hasCurrentListingPrice } from "@/lib/shared/minpaku-listings";

export function PurchaseHero() {
  return (
    <header id="purchase" className={styles.hero}>
      <div className={styles.heroText}>
        <p className="text-sm font-semibold text-primary-dark">民泊対応マンションの購入・投資相談</p>
        <h1 className={styles.headline}>観光地に、<br className="sm:hidden" />もうひとつの資産を。</h1>
        <p className="mt-4 text-sm leading-relaxed sm:text-base">民泊・宿泊運用を検討できる<br className="sm:hidden" />分譲マンションの購入をサポートします。</p>
      </div>
      <figure className={styles.figure}>
        <Image src="/hero/minpaku-purchase-concept.webp" alt="都市型マンションと、海や緑に囲まれたリゾートのイメージイラスト" width={1672} height={941} sizes="(max-width: 768px) calc(100vw - 32px), 992px" preload className="h-auto w-full" />
        <figcaption className="px-3 text-right text-xs text-text-muted">イメージイラスト（実在の販売物件ではありません）</figcaption>
      </figure>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <PurchaseCta location="hero" />
        <PurchaseCta location="hero" secondary />
      </div>
      <p className="mt-3 text-center text-sm leading-relaxed text-text-muted">ご希望の地域・予算をお知らせください。<br />物件の詳細と最新の販売状況を、個別にご案内します。</p>
      <nav aria-label="民泊相談の目的" className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-3 border-y border-border py-4 text-sm text-primary-dark">
        <a href="#purchase-regions" className="underline underline-offset-4">購入・投資の地域別相談</a>
        <a href="#opening" className="underline underline-offset-4">賃貸・開業の相談</a>
      </nav>
    </header>
  );
}

const checks = [
  ["地域のルール・営業日数", "地域の条例や制度により、営業できる区域・期間・必要な手続きが異なります。"],
  ["対象住戸・管理規約", "同じ建物でも対象階・住戸が異なる場合があります。管理規約・使用細則とあわせて確認します。"],
  ["運営委託・自己利用", "運営委託の契約条件や、ご自身・ご家族で利用できる期間と手続きを確認します。"],
  ["購入後にかかる費用", "管理費・修繕積立金に加え、運営・管理委託、設備維持などの費用を整理します。"],
];

export function PurchaseSection() {
  const asOf = new Date();
  return (
    <section aria-label="民泊対応マンションの購入相談" className={styles.purchase}>
      <div className="max-w-3xl space-y-4 leading-loose">
        <h2 className={styles.heading}>購入から、使い方まで。</h2>
        <p>宿泊運用を目的とする方も、ご自身やご家族での利用を組み合わせたい方も。四葉不動産株式会社が、ご希望の地域・予算・利用目的を伺い、購入のご相談から売買仲介まで対応します。</p>
        <p>自己利用と宿泊運用を両立できる条件は、物件ごとに異なります。ご紹介できる物件や地域も含めて、個別に確認してご案内します。</p>
      </div>

      <div id="purchase-regions" className={styles.block}>
        <h2 className={styles.heading}>どの地域で、検討しますか？</h2>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">北海道・福岡・沖縄の民泊対応予定マンションをご紹介します。対象住戸の価格・広さの目安から、ご希望に合う使い方をご相談ください。</p>
        <div className={styles.regions}>
          {MINPAKU_LISTINGS.map((listing) => (
            <article key={listing.id} className={styles.region} data-listing={listing.id}>
              <h3 className="font-serif text-2xl font-semibold text-ink">{listing.region}</h3>
              <dl className="mt-6 space-y-4 text-sm">
                <div><dt className="font-semibold">ご紹介物件の価格帯</dt>
                  <dd className="mt-2 font-serif text-xl font-semibold leading-relaxed text-primary-dark">{hasCurrentListingPrice(listing, asOf) ? listing.price : "個別にご案内"}</dd>
                  {hasCurrentListingPrice(listing, asOf) && listing.taxNote && <dd className="mt-1 text-xs text-text-muted">{listing.taxNote}</dd>}
                </div>
                <div><dt className="font-semibold">専有面積の目安</dt><dd className="mt-1 text-text-muted">{listing.area}</dd></div>
                <div><dt className="font-semibold">民泊の対象住戸</dt><dd className="mt-1 leading-relaxed text-text-muted">{listing.scope}</dd></div>
                <div><dt className="font-semibold">購入後の使い方</dt><dd className="mt-1 leading-relaxed text-text-muted">{listing.usage}</dd></div>
              </dl>
              <div className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-text-muted">
                <p>{hasCurrentListingPrice(listing, asOf) ? listing.priceBasis : "最新の価格・販売条件はお問い合わせください。"}</p>
                {hasCurrentListingPrice(listing, asOf) && listing.validUntil && <p className="mt-2">価格表の有効期限：{listing.validUntil}</p>}
                <p className="mt-2">資料確認：{MINPAKU_MATERIAL_CHECKED}</p>
                <p className="mt-2">最新の販売状況は個別にご案内します。</p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-5 text-xs leading-loose text-text-muted">価格は、民泊対応予定の対象住戸に限り、資料上で価格が確認できる住戸の範囲を千万円単位で端数切り上げした概算です。実際の最低購入価格・最高価格や、全住戸の販売状況を示すものではありません。専有面積も同じ対象住戸の概数です。諸費用は別途必要です。</p>
        <p className="mt-2 text-xs leading-loose text-text-muted">「民泊対応予定」は、すべての住戸が許可・届出済みであることを意味しません。営業条件・運営委託・自己利用の条件は、個別物件についてご案内します。</p>
        <div className="mt-6"><PurchaseCta location="regions" /></div>
      </div>

      <div className={styles.block}>
        <h2 className={styles.heading}>購入前に、何を確認しますか？</h2>
        <p className="mt-4 leading-loose">民泊の営業条件は、地域の条例や建物の管理規約によって異なります。購入前に、希望する運用ができるかを確認することが大切です。</p>
        <dl className={styles.checks}>{checks.map(([title, body]) => <div key={title} className="border-t border-border py-5"><dt className="font-semibold text-primary-dark">{title}</dt><dd className="mt-2 text-sm leading-loose text-text-muted">{body}</dd></div>)}</dl>
      </div>

      <div className={`${styles.block} rounded-xl bg-bg p-5 sm:p-8`}>
        <h2 className={styles.heading}>地域の需要と、営業条件の両面から。</h2>
        <p className="mt-4 leading-loose">都市部では、住環境への配慮から民泊の営業区域や日数を見直す自治体があります。観光地での物件選びも、宿泊需要だけでなく、地域ごとの季節性と営業条件をあわせて検討します。</p>
        <p className="mt-3 text-xs leading-relaxed text-text-muted">参照（2026年10月15日確認）：<a href="https://www.city.taito.lg.jp/kenchiku/jutaku/eisei/jutakulaw/minpanku20180613_003.html" className="underline">台東区の条例改正案内</a>、<a href="https://www.mlit.go.jp/kankocho/minpaku/faq.html" className="underline">観光庁・民泊制度FAQ</a>、<a href="https://www.kyokanko.or.jp/report/hotel202608" className="underline">京都市観光協会データ月報</a>。これらは各地域・調査対象の情報であり、紹介予定物件の稼働・収益を示すものではありません。</p>
      </div>

      <div className={styles.block}>
        <h2 className={styles.heading}>許可申請・届出のご相談は？</h2>
        <p className="mt-4 leading-loose">許可申請・届出については、四葉行政書士事務所でもご相談を承ります。四葉不動産株式会社と四葉行政書士事務所は、それぞれ独立した事業体です。不動産の売買仲介と行政書士業務は、それぞれ個別にご依頼いただけます。</p>
        <p className="mt-3 text-sm leading-loose text-text-muted">購入相談は、行政書士業務の委任ではありません。許可取得・届出受理を保証するものではなく、個別の法的判断は資格者による確認を要します。</p>
        <Link href="/legal/column/minpaku-jutaku-shukuhaku-todokede-yoken" className="mt-3 inline-block text-sm text-primary-dark underline underline-offset-4">四葉行政書士事務所：民泊の届出要件について</Link>
      </div>

      <aside className={`${styles.block} border-y border-border py-8`}>
        <h2 className={styles.heading}>ご希望から、お聞かせください。</h2>
        <p className="mt-3 text-sm leading-loose">地域・予算・使い方がまだ決まっていない段階でも、ご相談いただけます。</p>
        <div className="mt-5 flex flex-wrap gap-3"><PurchaseCta location="closing" /><PurchaseCta location="closing" secondary /></div>
        <Link href="/line" className="mt-4 inline-block text-sm text-primary-dark underline underline-offset-4">LINEで購入について相談する</Link>
        <p className="mt-6 text-xs leading-loose text-text-muted">民泊利用の可否、営業日数、必要な手続きは、地域や物件によって異なります。販売状況・価格等は変更される場合があります。宿泊需要や将来の収益を保証するものではありません。</p>
      </aside>
    </section>
  );
}

export function MinpakuInvestmentCard() {
  return <aside className="rounded-xl border border-primary/25 bg-primary-tint p-6 sm:p-8">
    <h2 className="mt-2 font-serif text-2xl font-semibold text-ink">民泊対応マンション</h2>
    <p className="mt-3 text-sm leading-loose">北海道・福岡・沖縄などで、宿泊運用を検討できる分譲マンションの購入相談を承ります。対象住戸の条件と最新の販売状況は、購入相談ページからお問い合わせください。</p>
    <Link href="/minpaku#purchase" className="mt-5 inline-flex min-h-11 items-center font-semibold text-primary-dark underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-primary">民泊対応マンションの購入相談へ</Link>
  </aside>;
}
