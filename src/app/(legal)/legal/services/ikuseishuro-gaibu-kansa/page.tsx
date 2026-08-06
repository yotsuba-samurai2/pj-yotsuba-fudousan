// /legal/services/ikuseishuro-gaibu-kansa（育成就労・監理支援機関の外部監査人）＝定点#26・#27 対策
// 2026-08-06 新設。方式＝LegalServicePage（手本=/legal/services/gaikokujin-shain）。ja先行：availableLocales:["ja"]。
// ヒーローは専用画像が未制作のため legal-visa-16x9.webp を暫定共用（TODO）。
//
// 【なぜ新規ページか】定点#26「育成就労 外部監査人 どこに依頼」・#27「育成就労 外部監査人 要件」は
//   11測定連続で引用×・名指し×。sitemap 242URL のうち育成就労・外部監査に該当するページは0件で、
//   サイト全体の「育成就労」の言及も /legal/services/visa の1回のみだった（2026-08-06実測）。
//   強化できる既存ページが無いため新設する。visa 側の Placeholder（浦松＝育成就労対応の範囲）も本ページで解消する。
//
// 【役割分担】
//   ・/legal/services/visa ＝本人視点の在留資格。育成就労「外国人」を受け入れる側の在留資格の話はそちら
//   ・本ページ ＝**監理支援機関の側**（外部監査人を誰に頼むか・その要件）。B2B。在留資格の類型解説は書かない
//
// 【コンプライアンス】shigyo-compliance-gate 準拠
//   ・**制度は未施行**（令和9年4月1日）。「当事務所が外部監査人を務めています」と現在形で書かない
//   ・省令の資格列挙に社会保険労務士が含まれるが、**四葉が社労士として担うとは書かない**
//     （四葉社会保険労務士事務所の開業は2026年9月予定。開業前は社労士としての立場・業務に言及しない）
//   ・法令引用は法令名＋条・項・号、施行日と最終改正を併記
//   ・外部監査人になれるかどうかの**可否判断は書かない**。省令の定めの所在を示すにとどめる
//   ・分離受任・紹介料なしを明示。禁止語（ワンストップ／一括受任／一気通貫）を使わない
//
// 【一次情報の裏取り（2026-08-06・e-Gov法令API v2／出入国在留管理庁）】
//   ・育成就労法＝「外国人の育成就労の適正な実施及び育成就労外国人の保護に関する法律」
//     **平成28年法律第89号**（法令ID 428AC0000000089）。2024年制定の新法ではなく、技能実習法を
//     令和6年法律第60号が改正して題名を差し替えたもの。e-Gov上のステータスは UnEnforced
//   ・法第25条第1項第5号＝外部監査の措置が許可の基準（技能実習法のイ／ロ選択制が単一号になった）
//   ・施行規則＝令和7年法務省・厚生労働省令第4号（公布 2025-09-30／最終改正 令和8年法務省・
//     厚生労働省令第3号・公布 2026-03-31）。第1条第4号（定義）／第42条第1項第3号／第47条（要件）
//   ・第47条第2項第2号に弁護士・社会保険労務士・行政書士の明文。技能実習法施行規則第30条第5項に
//     この資格列挙は無く、育成就労で新設された条項
//   ・施行日＝令和9年4月1日（令和7年政令第340号）
//   ・講習の告示は未制定。運用要領第8章「令和8年度の養成講習機関の募集は令和8年12月1日から
//     12月28日の間で行う予定」。当分の間は監理責任者等講習の修了者をみなす（施行規則附則第4条第3項）
//   ・監理支援機関の許可申請は施行日前も可能（改正法附則第5条第3項）。受付開始時期は未公表
// 【未検証】改正法本体PDFとの条文突合／令和7年法律第32号の第25条への影響／分野別の代替要件の根拠
//   → 本文では踏み込まず、公式情報での確認へ誘導している。
import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { LegalServicePage, H2 } from "@/components/shared/LegalServicePage";

// 冒頭の回答ブロック（H1直下・AIが最初に拾う位置）＝定点#26「どこに依頼」#27「要件」への直答
const JA_LEAD =
  "育成就労制度では、監理支援機関の許可を受けるために外部監査の措置を講じることが求められます。外部監査人になれる者として、施行規則は弁護士・社会保険労務士・行政書士（およびそれぞれの法人）と、育成就労に関する知見を有する者を挙げています。要件は、講習の修了、監理支援機関や育成就労実施者から独立していること、欠格事由に当たらないこと、氏名の公表に同意することの4つです。制度の施行は2027年4月1日で、現時点では施行前にあたります。";

// §2 誰に依頼できるか（施行規則第47条第2項第2号の列挙）
const JA_WHO: { who: string; note: string }[] = [
  { who: "弁護士・弁護士法人", note: "省令に明文で列挙されています" },
  { who: "社会保険労務士・社会保険労務士法人", note: "省令に明文で列挙されています" },
  { who: "行政書士・行政書士法人", note: "省令に明文で列挙されています" },
  { who: "その他育成就労に関する知見を有する者", note: "運用要領は、出入国・労働法令について高度な知識経験を有する者（大学教授等）や、外部監査人に係る講習の実施機関として告示された機関のうち一定の実施実績があるものを挙げています" },
];

// §3 要件の一覧（施行規則第47条）
const JA_REQ: { no: string; what: string; detail: string }[] = [
  {
    no: "第2項第1号",
    what: "講習の修了",
    detail: "過去3年以内に、外部監査人に対する講習として法務大臣および厚生労働大臣が告示で定めるものを修了していること。この告示は未制定で、運用要領は令和8年度の養成講習機関の募集を令和8年12月に行う予定としています。当分の間は、技能実習制度の監理責任者等講習の修了者を修了者とみなす経過措置があります（施行規則附則第4条第3項）",
  },
  {
    no: "第2項第2号",
    what: "資格・知見",
    detail: "弁護士・社会保険労務士・行政書士（それぞれの法人を含む）、その他育成就労に関する知見を有する者であること",
  },
  {
    no: "第1項・第2項第3号",
    what: "独立していること",
    detail: "監理支援を行う育成就労実施者（過去5年以内を含む）やその役職員でないこと、その配偶者・二親等以内の親族でないこと、申請者である監理支援機関の役職員でないこと、他の監理支援機関や送出機関の関係者でないこと、欠格事由に当たらないこと",
  },
  {
    no: "第2項第4号",
    what: "氏名の公表への同意",
    detail: "氏名が機構によってインターネットで公表されることに同意していること",
  },
];

// §4 時点の整理
const JA_WHEN: { item: string; state: string }[] = [
  { item: "制度の施行", state: "2027年（令和9年）4月1日。現時点では施行前です" },
  { item: "監理支援機関の許可申請", state: "施行日前でも申請できる旨が改正法の附則に定められています。ただし受付の開始時期は公表されていません" },
  { item: "外部監査人の講習の告示", state: "未制定。運用要領は令和8年12月に養成講習機関の募集を行う予定としています" },
  { item: "経過措置", state: "当分の間、技能実習制度の監理責任者等講習の修了者が要件を満たすものとして扱われます" },
];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "legal",
    path: "/legal/services/ikuseishuro-gaibu-kansa",
    title: "育成就労の外部監査人は誰に依頼するか｜要件と2027年4月の施行",
    description:
      "育成就労制度で監理支援機関に求められる外部監査。誰が外部監査人になれるか（弁護士・社会保険労務士・行政書士ほか）、4つの要件、講習の告示の状況、2027年4月の施行までの時点整理を、法令の条・項・号とあわせて解説します。",
    keywords: [
      "育成就労 外部監査人 どこに依頼",
      "育成就労 外部監査人 要件",
      "監理支援機関 外部監査",
      "育成就労法 施行規則 第47条",
      "育成就労 2027年4月 施行",
    ],
    locale,
    absoluteTitle: true,
    availableLocales: ["ja"],
  });
}

export default async function Page() {
  return (
    <LegalServicePage
      slug="ikuseishuro-gaibu-kansa"
      crumbLabel="育成就労の外部監査人"
      ctaIntent="ikuseishuro-gaibu-kansa"
      serviceName="育成就労制度における外部監査に関する相談および書類作成の支援"
      heroSrc="/hero/legal-visa-16x9.webp"
      heroAlt="外国人材の受け入れと監査のイメージ"
      h1="育成就労の外部監査人は、誰に依頼するのか —— 要件と2027年4月の施行"
      lead={<p>{JA_LEAD}</p>}
      governmentService
      internalLinks={[
        { href: "/legal/services/visa", label: "在留資格・ビザ申請" },
        { href: "/legal/services/gaikokujin-shain", label: "外国人社員の受け入れ（企業向け）" },
        { href: "/legal/services/company", label: "会社設立・許認可" },
        { href: "/legal/ryokin", label: "料金のご案内" },
        { href: "/legal/contact", label: "お問い合わせ" },
      ]}
    >
      {/* §1 外部監査人とは何か */}
      <div>
        <H2>育成就労の「外部監査人」とは何ですか？</H2>
        <p className="mt-3 leading-relaxed text-text">
          育成就労制度では、外国人の受け入れを監理する<strong className="text-ink">監理支援機関</strong>が許可制になります。その許可の基準のひとつとして、監事などの内部監査とは別に、
          <strong className="text-ink">外部の者による監査の措置を講じていること</strong>が求められます（育成就労法第25条第1項第5号）。この監査を行う者が、施行規則で
          <strong className="text-ink">外部監査人</strong>と呼ばれています（施行規則第42条第1項第3号）。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          技能実習制度では、法人内に指定外部役員を置くか、外部監査を入れるかの<strong className="text-ink">選択制</strong>でした。育成就労法の第25条第1項第5号にはこの選択の枝がなく、
          <strong className="text-ink">外部監査の措置が単一の基準として書かれています</strong>。育成就労法施行規則には「外部役員」の規定も置かれていません。
        </p>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          運用要領は、この仕組みの趣旨を「外部の視点を加えることにより、監理支援機関の業務の中立的な運営を担保しようとするもの」と説明しています。
        </p>
      </div>

      {/* §2 誰に依頼できるか＝#26への直答 */}
      <div>
        <H2>外部監査人は、誰に依頼できますか？</H2>
        <p className="mt-3 leading-relaxed text-text">
          施行規則第47条第2項第2号が、次のとおり列挙しています。
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="py-2 pr-4 font-medium text-ink">依頼先</th>
                <th className="py-2 font-medium text-ink">省令上の位置づけ</th>
              </tr>
            </thead>
            <tbody>
              {JA_WHO.map((r) => (
                <tr key={r.who} className="border-b border-line align-top">
                  <td className="py-2 pr-4 font-medium text-ink">{r.who}</td>
                  <td className="py-2 leading-relaxed text-text">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 leading-relaxed text-text">
          技能実習制度の施行規則（第30条第5項）には、この<strong className="text-ink">資格の列挙はありませんでした</strong>。育成就労で新しく置かれた条項です。
        </p>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          法人が外部監査人になる場合は、実地監査を指揮担当する監査実施責任者が講習を受講する必要があるとされています。また運用要領は、監理支援機関そのものと顧問契約を結んでいる弁護士等は直ちに「密接な関係」には当たらないとする一方、その監理支援機関が監理支援を行う<strong className="text-ink">育成就労実施者と</strong>顧問契約を結んでいる場合を密接な関係の例として挙げています。
        </p>
      </div>

      {/* §3 要件＝#27への直答 */}
      <div>
        <H2>外部監査人の要件は、何ですか？</H2>
        <p className="mt-3 leading-relaxed text-text">
          施行規則第47条が定めるのは、次の4つです。いずれも、申請の時点から監理支援機関が許可を受けている間を通じて満たしている必要があるとされています。
        </p>
        <div className="mt-4 space-y-4">
          {JA_REQ.map((r) => (
            <div key={r.no} className="border-l-2 border-line pl-4">
              <p className="text-sm font-medium text-ink">
                {r.what}
                <span className="ml-2 text-xs font-normal text-text-muted">（施行規則第47条{r.no}）</span>
              </p>
              <p className="mt-1 text-sm leading-relaxed text-text">{r.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* §4 いつから */}
      <div>
        <H2>いつから始まりますか？</H2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                <th className="py-2 pr-4 font-medium text-ink">項目</th>
                <th className="py-2 font-medium text-ink">現在の状況</th>
              </tr>
            </thead>
            <tbody>
              {JA_WHEN.map((r) => (
                <tr key={r.item} className="border-b border-line align-top">
                  <td className="py-2 pr-4 font-medium text-ink">{r.item}</td>
                  <td className="py-2 leading-relaxed text-text">{r.state}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 leading-relaxed text-text">
          制度は<strong className="text-ink">まだ施行されていません</strong>。監理支援機関の許可を検討されている場合、外部監査の体制は許可の基準に関わるため、施行日から逆算した準備の時期を早めに置いておくことをおすすめします。
        </p>
      </div>

      {/* §5 担当する事業者（三人称の事実） */}
      <div>
        <H2>このページの内容を担当する事業者</H2>
        <p className="mt-3 leading-relaxed text-text">
          四葉行政書士事務所（行政書士 登録番号 第25087022号）は、東京都文京区小日向（茗荷谷駅から徒歩約5分）にあり、浦松丈二が代表を務めます。浦松は行政書士の登録に加え、宅地建物取引士（東京都知事登録 第293544号）の登録を持ち、
          <strong className="text-ink">外部監査人の要件のうち講習にあたるもの（経過措置の対象となる監理責任者等講習）を修了しています</strong>。元毎日新聞記者・中国総局長として中国や台湾、タイに駐在した経歴があり、送出国側の事情もふまえた確認ができます。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          2027年4月の施行に向けて、監理支援機関の許可を検討される事業者からの<strong className="text-ink">外部監査の体制についてのご相談</strong>を承っています。制度が施行されていないため、現時点でお引き受けできるのは相談と準備の支援であり、外部監査そのものの実施は施行後になります。
        </p>
      </div>

      {/* §6 できること・できないこと */}
      <div>
        <H2>四葉行政書士事務所は、何ができますか？</H2>
        <p className="mt-3 leading-relaxed text-text">当事務所がお引き受けできるのは、次の範囲です。</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text">
          <li>監理支援機関の許可申請について、官公署に提出する書類の作成（行政書士法第1条の3・第19条第1項）</li>
          <li>外部監査の体制を整えるにあたっての、制度上の要件の整理</li>
          <li>施行日から逆算した準備スケジュールの作成</li>
          <li>送出国側の書類について、中国語（繁体字・簡体字）・英語の読み取りと日本語訳の作成</li>
        </ul>
        <p className="mt-5 leading-relaxed text-text">一方、次は当事務所の業務ではありません。</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text">
          <li><strong className="text-ink">許可されることの保証</strong>：許可の判断を行うのは主務大臣です。要件の充足は個別に判断されます</li>
          <li><strong className="text-ink">労務管理・社会保険の手続き</strong>：社会保険労務士業務は代表の開業（2026年9月予定）前のため、現時点ではお受けできません</li>
          <li>法人の<strong className="text-ink">登記</strong>：司法書士／<strong className="text-ink">税務</strong>：税理士／<strong className="text-ink">法的紛争・法律判断</strong>：弁護士</li>
        </ul>
        <p className="mt-3 leading-relaxed text-text">
          必要な場合は提携する専門家をご紹介します。<strong className="text-ink">紹介料の授受は一切ありません。</strong>各専門家と貴社に直接ご契約いただく形をとっています。
        </p>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          このページは一般的な情報提供です。育成就労制度は施行前で、下位の告示や運用の細目がこれから示される部分があります。個別のご事情に応じた判断は、面談のうえ資格者が行います。
        </p>
      </div>

      {/* §7 根拠 */}
      <div>
        <H2>このページの根拠</H2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text-muted">
          <li>
            外国人の育成就労の適正な実施及び育成就労外国人の保護に関する法律（<strong className="text-ink">平成28年法律第89号</strong>）第25条第1項第5号／施行日 令和9年4月1日／最終改正 令和6年法律第60号（公布 令和6年6月21日）。
            なお本法は2024年に新たに制定されたものではなく、外国人の技能実習の適正な実施及び技能実習生の保護に関する法律を令和6年法律第60号が改正して題名を改めたものです
          </li>
          <li>
            同法施行規則（<strong className="text-ink">令和7年法務省・厚生労働省令第4号</strong>・公布 令和7年9月30日）第1条第4号、第42条第1項第3号、第43条第1項第9号、第47条、附則第4条第3項／施行日 令和9年4月1日／最終改正 令和8年法務省・厚生労働省令第3号（公布 令和8年3月31日）。
            本規則は技能実習法施行規則（平成28年法務省・厚生労働省令第3号）の全部改正として置かれたものです
          </li>
          <li>施行期日＝出入国管理及び難民認定法及び外国人の技能実習の適正な実施及び技能実習生の保護に関する法律の一部を改正する法律の施行期日を定める政令（令和7年政令第340号）</li>
          <li>施行日前の許可申請＝令和6年法律第60号 附則第5条第3項・第4項</li>
          <li>外部監査の方法・確認対象書類・講習の取り扱い＝出入国在留管理庁「育成就労制度運用要領」第5章および第8章（令和8年8月5日更新版・2026年8月6日確認）</li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          外部監査人に対する講習を定める告示は、2026年8月6日時点で確認できていません。運用要領が示す募集の予定時期にもとづく記載であり、告示の内容によって要件の細目が変わる可能性があります。分野別に代替の要件が設けられる場合があるとされていますが、その根拠となる条文は特定できていません。手続きの前に、出入国在留管理庁の最新の公表資料でご確認ください。
        </p>
      </div>
    </LegalServicePage>
  );
}
