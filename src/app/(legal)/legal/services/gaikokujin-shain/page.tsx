// /legal/services/gaikokujin-shain（外国人社員の受け入れ・企業向け）＝ピラーB（2026-07-25・日本語版のみ・監修前ドラフト）
// 方式＝LegalServicePage（手本=/legal/services/oyanakiato）。ja先行公開：availableLocales:["ja"]・sitemap側も locales:["ja"]。
// ヒーローは専用画像が未制作のため legal-visa-16x9.webp を暫定共用（heroSrc・TODO）。
//
// 【役割分担（設計_赴任・本帰国レーン_v0.2 §2・§4）】
//   ・/legal/services/visa ＝**本人視点**の在留資格（実測で「赴任」4回・「駐在」12回が既出）
//   ・本ページ ＝**企業視点**（誰が費用を持つか／社内の期限管理／帯同家族／書類の認証）
//     → 在留資格の類型解説は書かず visa へ送る。
//   ・/global（不動産側）＝外国人本人の住まい。/toushi/shataku＝社宅・法人賃貸。相互リンクで組む。
//
// 【コンプライアンス】shigyo-compliance-gate 準拠
//   ・アポスティーユ／公印確認を**発行するのは外務省**。「当事務所が発行」と書かない。
//   ・提出先の受理可否は保証できない。「提出先への事前確認が要ります」を必ず添える。
//   ・**翻訳・翻訳証明は行政書士の独占業務ではない**（2026-07-25浦松指示）。優位は
//     「代表が中国語（繁体字・簡体字）・英語に対応するため外部の翻訳会社を挟まない」こと。
//   ・独占業務の境界：登記＝司法書士／税＝税理士／紛争・法的判断＝弁護士。分離受任・紹介料なし。
//   ・禁止語「ワンストップ」は本文で使用しない。
//   ・入管実務は個別性が高いため断定せず「一般に」「〜場合があります」で書く。
//
// 【一次情報の裏取り（2026-07-25）】
//   ・アポスティーユ／公印確認の使い分け＝法務局「公印確認・アポスティーユについて」
//   ・中国＝2023年3月8日加入、日中間は**2023年11月7日発効**。以後アポスティーユのみで可、
//     中国大使館の領事認証業務は同日停止（ジェトロ 2023年11月）
//   ・台湾＝ハーグ非締約。日本が国として承認していないため公印確認は発給されず、
//     台北駐日経済文化代表処が直接認証（同代表処「個人名義の認証」）
//   ・私文書は外務省が直接扱わず、事前に公証役場の認証が必要。外務省窓口は東京・大阪の2か所
//   ・家族滞在＝就労系在留資格（経営・管理、技術・人文知識・国際業務、技能、特定技能2号等）の
//     配偶者・子が対象。研修・技能実習・**特定技能1号は原則対象外**（出入国在留管理庁）
// 【未検証】締約国の最新リスト／外務省の手数料・所要日数／代表処の必要書類の細目
//   → 本文では数値を書かず、公式窓口での確認へ誘導している。
import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { LegalServicePage, H2 } from "@/components/shared/LegalServicePage";

// 冒頭の回答ブロック（H1直下・AIが最初に拾う位置）
const JA_LEAD =
  "海外にいる社員を日本に迎える場合、在留資格認定証明書の交付申請から始まり、査証の取得、入国、住居地の届出まで、企業側にも期限のある手続きが続きます。ご家族が一緒に来られる場合は、その方の在留資格が別に必要です。あわせて、海外で作られた書類を日本に出すとき、日本の書類を海外に出すときには、翻訳や認証の手当てが要ります。住まいの手配は、これらと同時並行で進めます。";

// §2 認証の3ルート（一次データ資産の中核）
const JA_ROUTE: { to: string; how: string; consul: string }[] = [
  { to: "ハーグ条約の締約国", how: "外務省のアポスティーユ", consul: "不要" },
  { to: "ハーグ条約の非締約国", how: "外務省の公印確認 → 駐日大使館・領事館の領事認証", consul: "必要" },
  { to: "台湾", how: "台北駐日経済文化代表処が直接認証", consul: "―（下記のとおり別扱い）" },
];

// §2 中国と台湾の対比（四葉の中核論点）
const JA_CN_TW: { item: string; cn: string; tw: string }[] = [
  { item: "ハーグ条約", cn: "締約国（2023年3月8日加入・日中間は2023年11月7日発効）", tw: "非締約" },
  { item: "必要な手続き", cn: "アポスティーユのみで中国本土に提出できます", tw: "台北駐日経済文化代表処の認証" },
  { item: "外務省の公印確認", cn: "不要（アポスティーユに一本化）", tw: "発給されません" },
  { item: "駐日公館の認証", cn: "中国大使館の領事認証業務は2023年11月7日で停止。以後は取得できません", tw: "代表処が直接行います" },
  { item: "公文書の場合", cn: "アポスティーユ", tw: "外務省を経由せず、代表処へ直接" },
  { item: "私文書の場合", cn: "公証役場の認証 → アポスティーユ", tw: "公証役場の認証が必要（外務省の証明は不要）" },
];

// §3 企業向け逆算スケジュール（一次データ資産）
const JA_SCHEDULE: { when: string; who: string; what: string[] }[] = [
  {
    when: "内定〜着任の3〜4か月前",
    who: "企業",
    what: ["従事する業務内容を固める（在留資格の該当性はここで決まります）", "雇用条件・報酬を確定する", "本人・家族の旅券の残存期間を確認する"],
  },
  {
    when: "3か月前",
    who: "企業＋行政書士",
    what: ["在留資格認定証明書の交付申請", "本人に用意してもらう書類（学歴・職歴の証明等）を依頼する。外国語のものは日本語訳が要ります"],
  },
  {
    when: "交付後〜1〜2か月前",
    who: "本人",
    what: ["現地の日本大使館・総領事館で査証を申請する", "住まいを決める（社宅・法人契約は同時並行で）"],
  },
  {
    when: "入国後14日以内",
    who: "本人",
    what: ["市区町村で住居地の届出", "マイナンバー・健康保険・年金・銀行口座"],
  },
];

// §4 帯同家族
const JA_KAZOKU: { type: string; can: string }[] = [
  { type: "経営・管理／技術・人文知識・国際業務／技能／特定技能2号 など就労系", can: "配偶者・子は「家族滞在」の対象になるのが一般的です" },
  { type: "研修／技能実習", can: "原則として「家族滞在」による帯同はできません" },
  { type: "特定技能1号", can: "原則として帯同できません（在留資格「留学」から移行する場合など、例外的な取り扱いが設けられている場合があります）" },
];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "legal",
    title: "外国人社員を海外から迎えるとき｜企業が押さえる手続きと期限 | 四葉行政書士事務所",
    description:
      "海外にいる社員を日本へ迎える企業向けに、在留資格認定証明書から入国後14日の届出までの逆算スケジュール、帯同家族の扱い、そしてアポスティーユ・領事認証の使い分けを整理しました。中国は2023年11月に運用が変わり、台湾は別ルートです。文京区小日向・茗荷谷駅徒歩5分。",
    path: "/legal/services/gaikokujin-shain",
    keywords: [
      "外国人社員 受け入れ 手続き",
      "在留資格認定証明書 企業",
      "帯同家族 家族滞在",
      "アポスティーユ 企業 手続き",
      "台湾 領事認証 書類",
    ],
    locale,
    absoluteTitle: true,
    availableLocales: ["ja"],
  });
}

export default async function Page() {
  return (
    <LegalServicePage
      slug="gaikokujin-shain"
      crumbLabel="外国人社員の受け入れ（企業向け）"
      serviceName="外国人社員の受け入れに関する書類作成および認証手続きの代行"
      heroSrc="/hero/legal-visa-16x9.webp"
      heroAlt="海外から社員を迎える企業のイメージ"
      h1="外国人社員を海外から迎えるとき —— 企業が押さえる手続きと期限"
      lead={<p>{JA_LEAD}</p>}
      governmentService
      internalLinks={[
        { href: "/legal/services/visa", label: "在留資格・ビザ申請（本人向けの詳細）" },
        { href: "/toushi/shataku", label: "借り上げ社宅・法人賃貸" },
        { href: "/global", label: "外国人・多言語のお部屋探し" },
        { href: "/legal/ryokin", label: "料金のご案内" },
        { href: "/legal/contact", label: "お問い合わせ" },
      ]}
    >
      {/* §1 全体像 */}
      <div>
        <H2>海外にいる社員を日本に呼ぶには、何から始めますか？</H2>
        <p className="mt-3 leading-relaxed text-text">
          最初に決めるのは<strong className="text-ink">従事する業務の内容</strong>です。どの在留資格に当てはまるかは、職務内容と本人の学歴・職歴の組み合わせで決まります。ここが固まらないと、その後の申請が進みません。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          そのうえで、在留資格認定証明書の交付申請 → 現地での査証申請 → 入国 → 住居地の届出、という順に進みます。在留資格の類型ごとの要件は
          <Link href="/legal/services/visa" className="text-primary underline">在留資格・ビザ申請のページ</Link>
          をご覧ください。本ページは<strong className="text-ink">企業側で管理すべきこと</strong>に絞ります。
        </p>
      </div>

      {/* §2 逆算スケジュール */}
      <div>
        <H2>着任日から逆算して、いつ動き出せばいいですか？</H2>
        <p className="mt-3 leading-relaxed text-text">
          審査期間は案件により幅があるため、下表は目安です。<strong className="text-ink">誰が動くか</strong>を分けて示します。
        </p>
        <ul className="mt-4 space-y-3">
          {JA_SCHEDULE.map((s) => (
            <li key={s.when} className="rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text">
              <strong className="text-ink">{s.when}</strong>
              <span className="mt-1 block text-text-muted">主に動くのは：{s.who}</span>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {s.what.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <p className="mt-3 leading-relaxed text-text">
          社内で見落とされやすいのが<strong className="text-ink">入国後14日以内の住居地の届出</strong>です。住まいが決まっていないと届出ができないため、住居の手配は在留手続きと同時並行で進めます。
        </p>
      </div>

      {/* §3 帯同家族 */}
      <div>
        <H2>家族も一緒に来る場合、手続きは変わりますか？</H2>
        <p className="mt-3 leading-relaxed text-text">
          変わります。ご家族には<strong className="text-ink">別の在留資格</strong>が必要で、本人の在留資格の種類によって、帯同できるかどうかが分かれます。
        </p>
        <ul className="mt-4 space-y-3">
          {JA_KAZOKU.map((k) => (
            <li key={k.type} className="rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text">
              <strong className="text-ink">{k.type}</strong>
              <span className="mt-1 block">{k.can}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 leading-relaxed text-text">
          採用の段階で帯同の可否が分かっていないと、着任後にご家族の予定が立たず、本人の定着にも影響します。<strong className="text-ink">条件提示の前に確認しておくこと</strong>をお勧めします。個別の可否は、ご本人の在留状況により異なります。
        </p>
      </div>

      {/* §4 認証（一次データ資産の中核） */}
      <div>
        <H2>日本の書類を海外に出すときは、どうすればいいですか？</H2>
        <p className="mt-3 leading-relaxed text-text">
          在職証明、登記事項証明書、卒業証明——海外の官公署や学校に日本の書類を出す場面は、赴任の前後で必ず出てきます。そのとき必要になるのが<strong className="text-ink">認証</strong>です。提出先の国によって、通る道が3つに分かれます。
        </p>
        <ul className="mt-4 space-y-3">
          {JA_ROUTE.map((r) => (
            <li key={r.to} className="rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text">
              <strong className="text-ink">{r.to}</strong>
              <span className="mt-1 block">{r.how}</span>
              <span className="mt-1 block text-text-muted">駐日大使館の領事認証：{r.consul}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 leading-relaxed text-text">
          あわせて2点。<strong className="text-ink">私文書</strong>（会社が作成した証明書・委任状など）は外務省が直接扱わないため、<strong className="text-ink">事前に公証役場の認証</strong>が必要です。また、外務省の申請窓口は<strong className="text-ink">東京・大阪の2か所</strong>で、郵送申請も受け付けています。
        </p>
      </div>

      {/* §5 中国と台湾の対比＝最重要の差別化 */}
      <div>
        <H2>中国と台湾では、何が違いますか？</H2>
        <p className="mt-3 leading-relaxed text-text">
          <strong className="text-ink">手続きがほぼ正反対になります。</strong>中華圏に社員を送る、あるいは中華圏から迎える企業にとって、ここが最も間違えやすいところです。
        </p>
        <ul className="mt-4 space-y-3">
          {JA_CN_TW.map((r) => (
            <li key={r.item} className="rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text">
              <strong className="text-ink">{r.item}</strong>
              <span className="mt-1 block">中国（大陸）：{r.cn}</span>
              <span className="mt-1 block text-text-muted">台湾：{r.tw}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 leading-relaxed text-text">
          台湾で公印確認が発給されないのは、日本の外務省が台湾を国として承認していないためです。その代わりに、台北駐日経済文化代表処が認証を行います。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          <strong className="text-ink">中国向けは2023年11月に運用が変わりました。</strong>それ以前の情報のまま「中国大使館で領事認証を受ける」と案内している資料がまだ流通しています。現在、中国大使館では領事認証を取得できません。
        </p>
      </div>

      {/* §6 翻訳 */}
      <div>
        <H2>海外で作られた書類は、そのまま提出できますか？</H2>
        <p className="mt-3 leading-relaxed text-text">
          外国語の証明書は、<strong className="text-ink">日本語訳の添付</strong>を求められるのが一般的です。逆に、日本の書類を海外に出すときは現地語への訳が要ります。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          翻訳と翻訳証明は資格を要する業務ではありません。ただ当事務所の場合、代表が<strong className="text-ink">中国語（繁体字・簡体字）・英語に対応する</strong>ため、外部の翻訳会社を挟まずに、訳文の作成から認証手続きの代行までを続けて進められます。窓口が分かれないぶん、やり取りの往復が減ります。
        </p>
      </div>

      {/* §7 住まい（不動産側へ） */}
      <div>
        <H2>住まい（社宅・法人契約）はどう進めますか？</H2>
        <p className="mt-3 leading-relaxed text-text">
          在留手続きと<strong className="text-ink">同時並行</strong>で進めます。入国後14日以内の住居地の届出があるため、住まいが決まっていないと後の手続きが止まります。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          社宅の導入や法人契約は
          <Link href="/toushi/shataku" className="text-primary underline">借り上げ社宅・法人賃貸のご案内</Link>
          を、本人が自分で借りる場合は
          <Link href="/global" className="text-primary underline">外国人・多言語のお部屋探し</Link>
          をご覧ください。いずれも四葉不動産株式会社（宅地建物取引業）が<strong className="text-ink">別契約で</strong>承ります。
        </p>
      </div>

      {/* §8 できること・できないこと */}
      <div>
        <H2>四葉行政書士事務所は、何ができますか？</H2>
        <p className="mt-3 leading-relaxed text-text">当事務所がお引き受けできるのは、次の範囲です。</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text">
          <li>在留資格認定証明書の交付申請など、官公署に提出する書類の作成（行政書士法第1条の2・第19条）と申請の取次</li>
          <li>外国語書類の日本語訳、日本語書類の外国語訳の作成</li>
          <li>公証役場・外務省・各駐日公館への申請の代行（委任状による）</li>
          <li>提出先の国と書類の性質から、どの認証ルートに乗るかの整理</li>
          <li>社内の期限管理に使えるスケジュールの作成</li>
        </ul>
        <p className="mt-5 leading-relaxed text-text">一方、次は当事務所の業務ではありません。</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text">
          <li><strong className="text-ink">アポスティーユ・公印確認を発行すること</strong>：発行するのは<strong className="text-ink">外務省</strong>です。当事務所が行うのは申請の代行までです</li>
          <li><strong className="text-ink">提出先に受理されることの保証</strong>：提出先が求める要件は個別に異なります。<strong className="text-ink">提出先への事前確認</strong>が要ります</li>
          <li>会社の<strong className="text-ink">登記</strong>：司法書士／<strong className="text-ink">税務</strong>：税理士／<strong className="text-ink">法的紛争・法律判断</strong>：弁護士</li>
          <li><strong className="text-ink">雇用にともなう労務・社会保険</strong>：社会保険労務士業務は代表の開業（2026年9月予定）前のため、現時点ではお受けできません</li>
        </ul>
        <p className="mt-3 leading-relaxed text-text">
          必要な場合は提携する専門家をご紹介します。<strong className="text-ink">紹介料の授受は一切ありません。</strong>各専門家と貴社に直接ご契約いただく形をとっています。
        </p>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          このページは一般的な情報提供です。入管の実務は個別性が高く、同じ職務内容でも本人の学歴・職歴により結論が変わります。個別のご事情に応じた判断は、面談のうえ資格者が行います。
        </p>
      </div>

      {/* §9 根拠 */}
      <div>
        <H2>このページの根拠</H2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text-muted">
          <li>公印確認・アポスティーユの使い分け＝法務局「公印確認・アポスティーユについて」（2026年7月25日確認）</li>
          <li>中国＝2023年3月8日にハーグ条約へ加入し、日中間は2023年11月7日発効。以後は日本発行の条約範囲内の公文書はアポスティーユのみで中国本土に提出でき、中国大使館の領事認証業務は同日停止（ジェトロ「中国向け公文書、11月7日から中国大使館などの領事認証が不要に」2023年11月）</li>
          <li>台湾＝台北駐日経済文化代表処「個人名義の認証」</li>
          <li>家族滞在＝出入国在留管理庁。就労系の在留資格の配偶者・子が対象で、研修・技能実習・特定技能1号は原則として対象外</li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          ハーグ条約の締約国は追加されることがあります。外務省の手数料・所要日数、各駐日公館の必要書類も変わります。手続きの前に、外務省および提出先の公式情報でご確認ください。
        </p>
      </div>
    </LegalServicePage>
  );
}
