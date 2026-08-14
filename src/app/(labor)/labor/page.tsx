// /labor（型F・社労士トップ・開業版）＝原稿_社労士 #1
// ⚠️ SR_LAUNCHED=false の間は (labor)/layout.tsx が notFound()＝本番非表示（sitemap非掲載・被リンクなし）。
// JSON-LD＝layoutの OrganizationJsonLd（ProfessionalService・フラグ内のみ）＋WebSiteJsonLd が出力済み＝重複出力しない。
// 登録番号は【開業時確定】まで出力しない。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import Link from "next/link";
import { CtaBand } from "@/components/shared/CtaBand";
import { Placeholder } from "@/components/shared/Placeholder";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "labor",
    title: "四葉社会保険労務士事務所｜文京区・障害福祉に強い社労士",
    description:
      "東京都文京区小日向・茗荷谷駅徒歩5分の四葉社会保険労務士事務所。顧問料は労務相談の対価で回数無制限。給与計算をfreeeで自社処理（内製）する体制づくりの支援も顧問料に含みます。障害福祉・介護の労務、処遇改善加算、雇用関係助成金、外国人雇用に対応。元新聞記者の社労士がお手伝いします。",
    path: "/labor",
    keywords: ["社労士 文京区", "障害福祉 社労士", "介護 事業所 労務"],
    locale,
    absoluteTitle: true,
  });
}

const SERVICES = [
  { href: "/labor/services/shogu-kaizen", label: "処遇改善加算のサポート", sub: "賃金規程の整備から計画・実績報告まで" },
  { href: "/labor/services/kaigo-roumu", label: "介護・障害福祉の労務管理", sub: "人員配置基準と日々の手続き" },
  { href: "/labor/services/joseikin", label: "雇用関係助成金の申請", sub: "キャリアアップ助成金ほか" },
  { href: "/labor/services/gaikokujin-koyo", label: "外国人雇用（介護・育成就労）の労務", sub: "多言語対応" },
  { href: "/labor/services/gaibu-kansanin", label: "外部監査で見られる労務", sub: "育成就労・監理支援機関向け" },
];

export default async function LaborTopPage() {
  const locale = await getRequestLocale();
  return (
    <>
      {/* ヒーロー（H1＝事務所名のみ） */}
      <section className="relative">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-b-3xl sm:mt-4 sm:rounded-3xl">
          <img
            src="/hero/labor-top-16x9.webp"
            alt="四葉社会保険労務士事務所のイメージ（文京区の事務所）"
            width={1600}
            height={900}
            className="h-[52vw] max-h-[440px] w-full object-cover sm:h-auto"
            fetchPriority="high"
          />
          {/* SP・小タブレット＝縦積み（クリップ/ヘッダーかぶり防止）／md+＝オーバーレイ（透明度は不動産・行政書士と統一） */}
          <div className="md:absolute md:inset-0 md:flex md:items-center">
            <div className="bg-surface p-5 md:m-8 md:max-w-xl md:rounded-2xl md:bg-white/30 md:p-7 md:backdrop-blur-sm">
              <h1 className="font-serif text-2xl font-bold text-ink sm:text-3xl">四葉社会保険労務士事務所</h1>
              {/* ★2026-08-14 リード改稿（浦松決定・案②）：キャッチを「人の手続きを、事業の力に。」から
                  「給与計算を、頼まないという頼み方も。」へ。内製化支援＝顧問料に含むを前面に出し、
                  コラム37と言葉を統一。「もちろん代行も承ります」で従来層（障害福祉・介護）を落とさない。 */}
              <p className="mt-3 text-sm leading-relaxed text-text sm:text-base">
                <strong>東京都文京区小日向の社会保険労務士事務所です。</strong>給与計算を、頼まないという頼み方も。——顧問料は労務相談の対価です。ご相談は回数・時間の制限なく、給与計算などをfreeeで自社処理（内製）する体制づくりの支援も顧問料に含みます。もちろん代行も承ります。障害福祉・介護、助成金、外国人雇用まで、元新聞記者の社労士が対応します。
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4">
        {/* ★2026-08-13 追加：直答ブロック（luck428-column-seo 第7条1）。
            トップに「この事務所は何をするのか」を80〜120字で置く。
            AI検索は冒頭の直答を拾うため、H1の直後に結論を置く。 */}
        <section className="mt-8 rounded-2xl border-l-4 border-primary bg-primary-tint p-5">
          {/* 2026-08-14 更新：給与計算を「代行」と「内製支援（顧問料に含む）」の2択表現に。ryokinと整合 */}
          <p className="leading-relaxed text-text">
            <strong>顧問料は、労務のご相談に対する対価です。</strong>
            ご相談は回数・時間の制限なく承ります。給与計算は、当事務所への<strong>代行</strong>のほか、
            <strong>freeeで自社処理（内製）に切り替える体制づくりの支援</strong>を顧問料に含めて承ります。
            手続きは顧問先と<strong>同じデータを見ながら</strong>進め、料金は<strong>着手前に書面</strong>でお出しします。
          </p>
        </section>

        {/* ★こんなときにご相談ください（読者の自分ごと化）。
            具体の状況を並べる。トップで最も効く節。各項目から対応するページへ送る。 */}
        <section className="mt-10">
          <h2 className="font-serif text-lg font-semibold text-ink">
            こんなときに、ご相談ください
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
            {/* 2026-08-14 追加：内製化支援の打ち出しに対応する具体状況を筆頭に */}
            <li>
              <strong>給与計算を外注しているが、freeeを入れて自社で回したい</strong>
              ——設定の設計と毎月の判断を、顧問料の範囲で支援します
            </li>
            <li>
              <strong>業務委託でお願いしている方が、実は雇用ではないかと気になっている</strong>
              ——契約書ではなく実態で判断されます。放っておくと遡って求められます
            </li>
            <li>
              <strong>パートやアルバイトを雇うが、社会保険に入るのかが分からない</strong>
              ——週の所定労働時間が分かれ目です
            </li>
            <li>
              <strong>家族を社員にする</strong>
              ——同居しているか、取締役にするか、助成金を考えているか。入社の日より前に決めることがあります
            </li>
            <li>
              <strong>年金を受け取りながら働く方を雇う</strong>
              ——賃金の決め方で、年金が止まる額が変わります
            </li>
            <li>
              <strong>中国など海外へ社員を出している</strong>
              ——出張か派遣かで、労災の扱いがまったく違います
            </li>
            <li>
              <strong>会社をたたむ</strong>
              ——社会保険と労働保険にも、登記より先に来る期限があります
            </li>
          </ul>
          <p className="mt-3 text-sm">
            →{" "}
            <Link href={addLocalePrefix("/labor/column", locale)} className="text-primary underline">
              労務のコラム（37本）
            </Link>{" "}
            に、それぞれの答えを書いています。
          </p>
        </section>

        {/* 取扱業務カード（具体アンカー・内部リンク一覧§1どおり） */}
        <section className="mt-10 grid gap-3 sm:grid-cols-2">
          {SERVICES.map((s) => (
            <Link
              key={s.href}
              href={addLocalePrefix(s.href, locale)}
              className="block rounded-2xl border border-border bg-surface p-4 transition-shadow hover:shadow-sm"
            >
              <div className="font-serif text-lg font-semibold text-ink">{s.label}</div>
              <div className="mt-1 text-sm text-text-muted">{s.sub}</div>
            </Link>
          ))}
        </section>

        {/* 代表紹介（E-E-A-T・登録番号は開業時確定まで非出力） */}
        <section className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-border bg-surface p-5 sm:flex-row">
          <img
            src="/staff/uramatsu.webp"
            alt="四葉社会保険労務士事務所 代表 浦松丈二"
            width={160}
            height={213}
            className="w-32 flex-shrink-0 rounded-xl object-cover sm:w-40"
          />
          <div>
            <h2 className="font-serif text-lg font-semibold text-ink">浦松 丈二（うらまつ・じょうじ）</h2>
            <p className="mt-1 text-sm leading-relaxed text-text-muted">
              元毎日新聞中国総局長（記者歴34年）。社会保険労務士
              <Placeholder reason="開業時確定＝社労士登録番号" />
              ・行政書士（登録番号 第25087022号）・宅地建物取引士。制度と現場のあいだにある「複雑さ」を整理して伝える——記者の仕事を、労務に活かします。
            </p>
            <p className="mt-2 text-xs">
              プロフィール：
              <a
                href="https://www.samurai.co.jp/samurai/reserve/uramatsu-joji"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline"
              >
                士業ドットコム
              </a>
              ／
              <a
                href="https://www.wikidata.org/wiki/Q139738129"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline"
              >
                Wikidata
              </a>
            </p>
          </div>
        </section>

        {/* 3つの事務所の役割分担（2026-07-29改訂）
            旧「四葉グループとの連携」＋「開設から運営までを見通した相談ができます」は
            業務の一体提供を示唆する（yotsuba-sharoushi-kaigyo 第6条）。
            見出しから「連携」を外し、本文を分離受任の明示に置き換えた。 */}
        <section className="mt-10 rounded-2xl border border-border bg-surface p-5">
          <h2 className="font-serif text-lg font-semibold text-ink">
            どの事務所が、何を担いますか？
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-text">
            障害福祉事業の立ち上げには、<strong>物件・指定申請・労務</strong>の3つが必要になります。物件は四葉不動産株式会社、指定申請の書類作成は四葉行政書士事務所、労務は当事務所が、<strong>それぞれ別の契約で</strong>受任します。必要な部分だけをご依頼いただけますし、他の部分を他社にご依頼いただいても差し支えありません。
          </p>
          <p className="mt-2 text-sm">
            →{" "}
            <Link href={addLocalePrefix("/toushi/group-home", locale)} className="text-primary underline">
              グループホームに使える物件探し（四葉不動産）
            </Link>
            ／
            <Link href={addLocalePrefix("/legal/services/shogai-fukushi", locale)} className="text-primary underline">
              障害福祉サービスの指定申請（四葉行政書士事務所）
            </Link>
          </p>
          <p className="mt-2 text-xs text-text-muted">
            ※四葉不動産株式会社・四葉行政書士事務所・四葉社会保険労務士事務所は、それぞれ別の事業体として独立してご依頼をお受けします（紹介料等の授受はありません）。
          </p>
        </section>

        {/* 対応できないこと（2026-07-29追加・指示書11の必須セクション）
            「税理士」等と書かない＝書面での提携の有無が未確認（U12）。「ご紹介します」にとどめる。 */}
        <section className="mt-10">
          <h2 className="font-serif text-lg font-semibold text-ink">
            当事務所が取り扱わないことは何ですか？
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
            <li>
              <strong>税務の申告・税務代理・税務相談</strong>
              （税理士の業務）——取り扱っておりません。ご希望があれば税理士をご紹介します（紹介料の授受はありません）
            </li>
            <li>
              <strong>登記</strong>
              （司法書士の業務）——取り扱っておりません。ご希望があれば司法書士をご紹介します（同上）
            </li>
            <li>
              <strong>紛争性のある事案の代理・法律相談</strong>
              （弁護士の業務）——取り扱っておりません。ご希望があれば弁護士をご紹介します（同上）
            </li>
            <li>
              <strong>在留資格の申請取次</strong>
              （行政書士の業務）——四葉行政書士事務所が別の契約で承ります
            </li>
            <li>
              <strong>不動産の媒介・賃貸管理</strong>
              （宅地建物取引業）——四葉不動産株式会社が別の契約で承ります
            </li>
          </ul>
        </section>

        {/* ★2026-08-13 全面改稿：金額を書くように改めた。
            旧文は「お見積りをお示しします」だけで金額を出していなかったが、
            報酬額表には全項目の単価を掲載している。「透明な報酬」を打ち出す以上、
            トップで金額を伏せるのは矛盾する。代表的な単価を表で出す（第7条3）。 */}
        <section className="mt-10">
          <h2 className="font-serif text-lg font-semibold text-ink">料金はどう決まりますか？</h2>
          <p className="mt-3 text-sm leading-relaxed text-text">
            <strong>顧問料は労務のご相談に対する対価で、手続は届出ごとに都度申し受けます。</strong>
            単価は<strong>すべて報酬額表に掲載</strong>しています。含まないものと、その場合のおつなぎ先も同じ表に書いています。
            <strong>お見積りは着手前に書面</strong>でお出しし、作業を始めてから金額が決まることはありません。
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-primary-tint text-left">
                  <th className="border border-border px-3 py-2">主な料金（税込）</th>
                  <th className="border border-border px-3 py-2 w-24">単位</th>
                  <th className="border border-border px-3 py-2 w-40 text-right">金額</th>
                </tr>
              </thead>
              <tbody className="text-text-muted">
                {[
                  ["顧問（ご相談）", "月額", "22,000円〜"],
                  ["給与計算（代行）", "1名／月", "1,100円"],
                  ["freeeでの内製（自社計算）への切替支援", "—", "顧問料に含む"],
                  ["社会保険・雇用保険 資格取得届", "1名", "各 2,750円"],
                  ["就業規則 新規作成", "一式", "88,000〜220,000円"],
                  ["助成金 申請代行（顧問先限定）", "一式", "着手金なし ＋ 成功報酬20%"],
                  ["障害年金 裁定請求（新規）", "1件", "着手金30,000円 ＋ 年金3ヶ月分"],
                ].map(([a, b, c]) => (
                  <tr key={a}>
                    <td className="border border-border px-3 py-2">{a}</td>
                    <td className="border border-border px-3 py-2">{b}</td>
                    <td className="border border-border px-3 py-2 text-right">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-text">
            <strong>2026年8月、手続きの料金をおおむね3割引き下げました。</strong>
            freee人事労務と生成AIの活用で、手続きの<em>作業</em>は軽くなります。そのぶんをお返しする趣旨です。
            ただし<strong>AIで安くなるのは作業であって、責任ではありません。</strong>
            判断は社会保険労務士が行います。
            給与計算を当事務所に頼まず、freeeで内製する体制づくりを顧問契約の範囲で支援する形も選べます。
          </p>
          <p className="mt-3 text-sm">
            →{" "}
            <Link href={addLocalePrefix("/labor/ryokin", locale)} className="text-primary underline">
              報酬額表（全項目）
            </Link>
            ／{" "}
            <Link href={addLocalePrefix("/labor/nagare", locale)} className="text-primary underline">
              進め方（AIをどこまで使うか）
            </Link>
          </p>
          <p className="mt-3 text-xs leading-relaxed text-text-muted">
            ※四葉不動産株式会社・四葉行政書士事務所の料金とは<strong>別建て</strong>です。合算したご請求や、複数の事務所へご依頼いただいたことによるお値引きはありません。
          </p>
        </section>

        <p className="mt-10 text-xs leading-relaxed text-text-muted">
          本ページは一般的な情報提供です。個別の事案については、資格者による確認を経てご案内します。
        </p>

        {/* 導線 */}
        <nav aria-label="サイト内導線" className="mt-10 flex flex-wrap gap-x-4 gap-y-1 text-sm text-primary">
          <Link href={addLocalePrefix("/labor/ryokin", locale)} className="underline">料金</Link>
          <Link href={addLocalePrefix("/labor/nagare", locale)} className="underline">受任の流れ</Link>
          <Link href={addLocalePrefix("/labor/faq", locale)} className="underline">よくある質問</Link>
          <Link href={addLocalePrefix("/labor/about", locale)} className="underline">事務所概要</Link>
        </nav>
      </main>

      <div className="mx-auto max-w-5xl px-4">
        <CtaBand businessKey="labor" />
      </div>
    </>
  );
}
