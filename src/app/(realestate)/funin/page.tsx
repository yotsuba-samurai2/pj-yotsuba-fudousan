// /funin（中華圏から東京へ赴任する方の住まい）＝ピラーC（2026-07-25・ja＋zh-tw の2ロケール）
// 方式＝RealestateServicePage＋pickPageLocale（手本=/souzoku/taiwan）。en/zh は ja へフォールバック。
//
// 【役割分担（設計_赴任・本帰国レーン_v0.2 §2）】主語をずらしてカニバリを防ぐ。
//   ・/global ＝主語は「在留資格」。日本で暮らす外国人一般（#6で引用〇・名指し〇の勝ちページ）
//   ・/kikoku ＝主語は「帰国というライフイベント」。海外駐在から戻る日本人
//   ・本ページ＝主語は「時間と距離」。会社の辞令で東京へ赴任する本人（中華圏・繁体字が主読者）
//   **本ページに在留資格の解説を書かない**（赴任者の在留資格は会社が手配するのが大半＝読者の関心が薄い）。
//   **「外国人だから借りにくい」も書かない**（それは /global の役割）。日程・距離・言語・法人契約に絞る。
//
// 【コンプライアンス】shigyo-compliance-gate 準拠
//   ・禁止語「ワンストップ」。zh-twでも「一站式」「單一窗口」等の業務一体提供を示唆する語を使わない。
//   ・賃貸仲介＝宅建業（四葉不動産）。書類作成・認証手続きの代行＝行政書士（併設・別契約）。分離受任を明記。
//   ・IT重説・電子書面交付は制度の存在のみ（賃貸のIT重説2017年10月本格運用、書面の電子交付は
//     2022年5月18日施行の宅建業法改正。2026-07-25裏取り）。物件・貸主により可否が分かれる旨を併記し断定しない。
//   ・審査の可否を断定しない。
//   ・実績の記述は匿名化（企業名・個人名・時期を書かない）。
// hero＝realestate-global-16x9.webp を暫定共用（専用画像TODO）。
import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import { RealestateServicePage, ReH2 } from "@/components/shared/RealestateServicePage";
import { CannotHandle } from "@/components/shared/CannotHandle";
import type { LangCode } from "@/config/languages";

type PageLocale = "ja" | "zh-tw";
const pickPageLocale = (locale: LangCode): PageLocale => (locale === "zh-tw" ? "zh-tw" : "ja");

type Copy = {
  answerBlock: string;
  crumb: string;
  serviceName: string;
  heroAlt: string;
  h1: string;
  lead: React.ReactNode;
  links: { href: string; label: string }[];
  crossLead: string;
  h2Online: string;
  onlineIntro: string;
  onlineCan: { can: string; note: string }[];
  onlineLocal: string;
  onlineLocalItems: string[];
  h2Keiyaku: string;
  keiyakuIntro: string;
  keiyaku: { item: string; corp: string; ind: string }[];
  keiyakuNote: string;
  h2Schedule: string;
  scheduleIntro: string;
  schedule: { when: string; what: string }[];
  scheduleNote: string;
  h2Lang: string;
  langBody: React.ReactNode;
  h2Docs: string;
  docsBody: React.ReactNode;
  h2Jikkan: string;
  jikkanBody: string[];
};

const COPY: Record<PageLocale, Copy> = {
  ja: {
    answerBlock:
      "海外にいるまま、東京の住まいを決めることができます。物件の絞り込み、オンラインでの内見、重要事項説明、契約書類の電子交付まで、来日前に進められます。着任日が決まっている赴任では、逆算して動くことが要点です。物件探しと契約は四葉不動産株式会社が担当し、会社に提出する書類の日本語訳や認証手続きの代行は、併設の四葉行政書士事務所が別契約で受任します。中国語（繁体字・簡体字）・英語で対応します。",
    crumb: "東京赴任の住まい探し",
    serviceName: "海外赴任者向けの賃貸物件の紹介・仲介",
    heroAlt: "東京へ赴任する方の住まい探しのイメージ",
    h1: "中華圏から東京へ赴任する方の住まい探し",
    lead: (
      <p>
        辞令が出てから着任まで、時間はいつも足りません。しかも本人はまだ海外にいる。<strong>日程と距離</strong>——赴任の住まい探しで効いてくるのはこの二つです。このページでは、<strong>台湾にいるまま決めきる方法</strong>と、<strong>法人契約と個人契約の違い</strong>を解説します。
      </p>
    ),
    links: [
      { href: "/shataku", label: "借り上げ社宅の導入（企業の方へ）" },
      { href: "/legal/services/gaikokujin-shain", label: "外国人社員の受け入れ（企業向け手続き）" },
      { href: "/global", label: "外国人・多言語のお部屋探し" },
      { href: "/access", label: "アクセス・ご相談" },
      { href: "/contact", label: "お問い合わせ" },
    ],
    crossLead: "会社に提出する書類の日本語訳や、アポスティーユ・領事認証の手続きは、関連事業の四葉行政書士事務所のページで解説しています。",
    h2Online: "台湾にいるまま、東京の部屋を決められますか？",
    onlineIntro: "決められます。契約手続きまでオンラインで進められます。ただし、映像で分かることと分からないことがあります。両方を正直にお伝えします。",
    onlineCan: [
      { can: "物件の絞り込み・図面と写真の確認", note: "ご希望の条件をお預かりして、当社が候補を用意します" },
      { can: "オンライン内見（動画通話での室内案内）", note: "時差に合わせて時間を調整します" },
      { can: "重要事項説明（IT重説）", note: "賃貸では制度上可能です。ただし対応の可否は物件・貸主により分かれます" },
      { can: "契約書類の電子交付・電子契約", note: "2022年5月施行の宅建業法改正で可能になりました。こちらも物件により異なります" },
    ],
    onlineLocal: "映像では分かりにくいこと（当社が現地で確認します）",
    onlineLocalItems: [
      "周辺の音・においなど、映像では伝わらない環境",
      "日当たりと風通しの実際（時間帯による変化）",
      "駅までの実際の歩行時間と、夜間の道の様子",
      "通勤経路の混雑と、乗り換えの実感",
    ],
    h2Keiyaku: "会社契約（法人契約）と個人契約は何が違いますか？",
    keiyakuIntro: "赴任では、会社が借りて社宅として貸与する形と、本人が自分で借りて住宅手当を受ける形があります。手続きの重さと、退去時の扱いが変わります。",
    keiyaku: [
      { item: "契約の名義", corp: "会社", ind: "本人" },
      { item: "審査の対象", corp: "主に会社の信用。本人の国内実績が問われにくい", ind: "本人の収入・在留状況など" },
      { item: "初期費用の負担", corp: "会社が支払い、社内規程で処理", ind: "本人が立て替え、手当で調整することが多い" },
      { item: "更新・解約の判断", corp: "会社（人事・総務）", ind: "本人" },
      { item: "帰任時の扱い", corp: "会社が解約。次の赴任者へ引き継ぐ選択もある", ind: "本人が解約。原状回復の負担も本人" },
      { item: "手続きの速さ", corp: "社内決裁の分だけ時間がかかることがある", ind: "本人の判断で早く動ける" },
    ],
    keiyakuNote: "着任日が迫っている場合、社内決裁にかかる日数が最大の制約になります。会社契約で進めるなら、物件を探し始める前に社内の決裁ルートと必要日数を確認しておくと、良い物件を逃しにくくなります。",
    h2Schedule: "着任日から逆算すると、いつ動き出せばいいですか？",
    scheduleIntro: "目安です。会社の事情により前後します。",
    schedule: [
      { when: "着任の2か月前", what: "エリアと予算を決める（通勤・お子さんの学校・生活圏）。会社契約か個人契約かを確認する" },
      { when: "1〜1.5か月前", what: "オンラインで候補を絞り、内見を始める。会社契約なら社内決裁を並行して進める" },
      { when: "3〜4週間前", what: "申込み・審査・契約手続き。鍵の受け取り方法と初期費用の送金方法を決める" },
      { when: "着任後すぐ", what: "住居地の届出、ライフラインの開通、銀行口座・携帯電話" },
    ],
    scheduleNote: "いちばん詰まりやすいのは1〜1.5か月前です。良い部屋ほど1か月以上先の入居を待ってもらえません。逆に早すぎると空家賃が出ます。この見極めは、そのエリアの動きを見ている業者でないと難しいところです。",
    h2Lang: "契約書と重要事項説明は、繁体字で説明してもらえますか？",
    langBody: (
      <>
        <p className="mt-3 leading-relaxed text-text">
          対応します。代表の浦松丈二は元毎日新聞中国総局長で、台湾師範大学で学び、中国や台湾に駐在しました。<strong className="text-ink">翻訳者を介さずに直接お話しします。</strong>台湾華語と大陸の表現の違いにも配慮します。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          重要事項説明は専門用語のかたまりです。母語で内容を確認しないまま署名するのは避けたほうがよい場面です。日本語・英語・中国語（繁体字・簡体字）で、内容を確認しながら進めます。
        </p>
      </>
    ),
    h2Docs: "会社に出す書類の日本語訳はどうすればいいですか？",
    docsBody: (
      <>
        <p className="mt-3 leading-relaxed text-text">
          外国語の在職証明や収入証明は、日本語訳の添付を求められることがあります。逆に、日本の書類を台湾や中国に出すときは認証が必要になることがあり、<strong className="text-ink">台湾と中国では手続きが正反対</strong>です。詳しくは
          <Link href="/legal/services/gaikokujin-shain" className="text-primary underline">外国人社員の受け入れ（企業向け）</Link>
          をご覧ください。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          訳文の作成と認証手続きの代行は、併設の四葉行政書士事務所が別契約で承ります。翻訳と翻訳証明は資格を要する業務ではありませんが、代表が中国語・英語に対応するため、外部の翻訳会社を挟まずに進められます。
        </p>
      </>
    ),
    h2Jikkan: "現場の実感",
    jikkanBody: [
      "台湾から東京へ赴任される駐在員の方の住まい探しを、完全に台湾華語で対応し、オンライン内見でお決めいただいたことがあります。大変ご満足いただけました。",
      "あのとき効いたのは、物件情報の量ではありませんでした。時差に合わせて時間を取り、こちらが現地で見て、聞かれたことに率直に答える——それだけです。遠くにいる方ほど、情報の多さより、答えの正確さを必要とされます。",
      "「実際どうですか」と聞かれたら、良いことも良くないことも申し上げます。それが、見に行けない方に対して私たちができる唯一のことだと思っています。",
    ],
  },
  "zh-tw": {
    answerBlock:
      "人在海外，也能決定東京的住處。從篩選物件、線上看房、重要事項說明，到契約文件的電子交付，都可以在來日本之前完成。外派的到任日已經確定，因此關鍵在於「往回推算」。物件的尋找與簽約由四葉不動産株式会社負責；要交給公司的文件的日文翻譯與認證手續代辦，由附設的四葉行政書士事務所另行簽約受任。可用中文（繁體字・簡體字）與英文對應。",
    crumb: "外派東京的找房",
    serviceName: "海外外派人士的租賃物件介紹・仲介",
    heroAlt: "外派東京者尋找住處的意象",
    h1: "外派東京——從台灣線上找房、線上看房，到簽約",
    lead: (
      <p>
        從人事命令下來到到任，時間永遠不夠。而且本人還在海外。<strong>日程與距離</strong>——外派找房時，真正起作用的就是這兩件事。本頁說明<strong>人在台灣就把住處定下來的做法</strong>，以及<strong>公司簽約與個人簽約的差別</strong>。
      </p>
    ),
    links: [
      { href: "/shataku", label: "承租型員工宿舍・法人租賃（給企業）" },
      { href: "/legal/services/gaikokujin-shain", label: "外籍員工的接收（企業端手續）" },
      { href: "/global", label: "外國人・多語言的找房" },
      { href: "/access", label: "交通・諮詢" },
      { href: "/contact", label: "聯絡我們" },
    ],
    crossLead: "要交給公司的文件的日文翻譯，以及海牙認證（Apostille）・領事認證的手續，請參閱關係事業四葉行政書士事務所的頁面。",
    h2Online: "人在台灣，可以決定東京的房子嗎？",
    onlineIntro: "可以。到簽約手續為止，都能線上進行。不過，影像看得出來的事和看不出來的事都存在。這兩面我們都會誠實告訴您。",
    onlineCan: [
      { can: "篩選物件・確認平面圖與照片", note: "把您的條件交給我們，由我們準備候選物件" },
      { can: "線上看房（視訊通話的室內導覽）", note: "會配合時差安排時間" },
      { can: "重要事項說明（IT重説）", note: "租賃在制度上可行。但能否對應會因物件與房東而異" },
      { can: "契約文件的電子交付・電子簽約", note: "2022年5月施行的宅地建物取引業法修正後成為可能。同樣因物件而異" },
    ],
    onlineLocal: "影像不易傳達的部分（由我們在現場確認）",
    onlineLocalItems: [
      "周邊的聲音與氣味等，影像傳達不了的環境",
      "採光與通風的實際狀況（隨時段變化）",
      "到車站的實際步行時間，以及夜間路況",
      "通勤路線的擁擠程度與轉乘的實際感受",
    ],
    h2Keiyaku: "公司簽約（法人契約）與個人簽約有什麼不同？",
    keiyakuIntro: "外派時，有「公司承租後作為員工宿舍提供」與「本人自行承租、領取住房補貼」兩種形式。手續的繁重程度與退租時的處理都不同。",
    keiyaku: [
      { item: "契約名義", corp: "公司", ind: "本人" },
      { item: "審查對象", corp: "主要看公司的信用，較不會追問本人在日本的紀錄", ind: "本人的收入與在留狀況等" },
      { item: "初期費用的負擔", corp: "由公司支付，依內部規程處理", ind: "多由本人先墊付，再以補貼調整" },
      { item: "續約・解約的決定", corp: "公司（人事・總務）", ind: "本人" },
      { item: "返任時的處理", corp: "由公司解約。也可選擇交接給下一位外派人員", ind: "由本人解約，回復原狀的費用也由本人負擔" },
      { item: "手續的速度", corp: "會因內部核決而多花時間", ind: "本人可自行判斷，動作較快" },
    ],
    keiyakuNote: "當到任日已經逼近時，內部核決所需的天數往往是最大的限制。若以公司簽約進行，建議在開始找房之前，先確認公司內部的核決流程與所需天數，比較不會錯過好物件。",
    h2Schedule: "從到任日往回推算，什麼時候開始動比較好？",
    scheduleIntro: "以下為概略時程，會因公司狀況而前後調整。",
    schedule: [
      { when: "到任前2個月", what: "決定區域與預算（通勤、子女的學校、生活圈）。確認採公司簽約或個人簽約" },
      { when: "前1〜1.5個月", what: "線上縮小候選範圍並開始看房。若為公司簽約，同時推進內部核決" },
      { when: "前3〜4週", what: "申請・審查・簽約手續。決定鑰匙的交付方式與初期費用的匯款方式" },
      { when: "到任後隨即", what: "居住地申報、水電瓦斯開通、銀行帳戶與手機門號" },
    ],
    scheduleNote: "最容易卡住的是前1〜1.5個月。越好的房子，房東越不會等超過一個月才入住；但太早決定又會產生空租金。這個拿捏，若不是長期在看該區域動態的業者，其實不容易。",
    h2Lang: "契約書與重要事項說明，可以用繁體中文說明嗎？",
    langBody: (
      <>
        <p className="mt-3 leading-relaxed text-text">
          可以。代表浦松丈二曾任每日新聞中國總局長，於台灣師範大學求學，並曾派駐中國與台灣。<strong className="text-ink">不透過翻譯人員，直接與您溝通。</strong>對於台灣華語與大陸用語的差異也會留意。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          重要事項說明充滿專業術語。在沒有用母語確認內容的情況下簽名，是應該避免的。我們會以日文、英文、中文（繁體字・簡體字）一邊確認內容一邊進行。
        </p>
      </>
    ),
    h2Docs: "要交給公司的文件，日文翻譯該怎麼辦？",
    docsBody: (
      <>
        <p className="mt-3 leading-relaxed text-text">
          外文的在職證明或收入證明，可能會被要求附上日文譯本。反過來，把日本的文件送到台灣或中國時可能需要認證，而<strong className="text-ink">台灣與中國的手續幾乎相反</strong>。詳情請參閱
          <Link href="/legal/services/gaikokujin-shain" className="text-primary underline">外籍員工的接收（企業端）</Link>
          。
        </p>
        <p className="mt-3 leading-relaxed text-text">
          譯本的製作與認證手續的代辦，由附設的四葉行政書士事務所另行簽約受任。翻譯與翻譯證明並非需要資格的業務，不過因為代表本身可用中文與英文對應，所以不必經過外部翻譯公司即可往下進行。
        </p>
      </>
    ),
    h2Jikkan: "現場的體會",
    jikkanBody: [
      "我們曾經協助一位從台灣外派到東京的駐在人員找房，全程以台灣華語對應，並以線上看房完成決定，獲得對方相當高的滿意。",
      "那一次真正起作用的，並不是物件資訊的數量。配合時差撥出時間、由我們到現場親自查看、對於被問到的事情坦白回答——就只是這樣而已。人在越遠的地方，需要的往往不是更多的資訊，而是更準確的答案。",
      "如果您問「實際上到底如何」，好的地方與不那麼好的地方，我們都會說。我們認為，這是對於無法親自看房的人，我們唯一能做的事。",
    ],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  if (pickPageLocale(locale) === "zh-tw") {
    return buildPageMetadata({
      businessKey: "realestate",
      title: "外派東京的找房｜從台灣線上看房到簽約的完全指南 | 四葉不動産",
      description:
        "從台灣外派到東京，人還在海外就能決定住處。線上看房、IT重説、契約文件的電子交付都可在來日本前完成。公司簽約與個人簽約的差別、從到任日往回推算的時程，由可用台灣華語直接對應的宅地建物取引士整理。文京區小日向・茗荷谷站步行5分。",
      path: "/funin",
      keywords: ["外派東京 租屋", "台灣 外派 日本 找房", "線上看房 東京", "法人契約 租屋 日本", "東京 租屋 繁體中文"],
      locale,
      absoluteTitle: true,
      availableLocales: ["ja", "zh-tw"],
    });
  }
  return buildPageMetadata({
    businessKey: "realestate",
    title: "東京赴任の住まい探し｜海外にいるままオンラインで決める完全ガイド | 四葉不動産",
    description:
      "中華圏から東京へ赴任する方向けに、海外にいるまま住まいを決める方法をまとめました。オンライン内見・IT重説・電子契約、会社契約と個人契約の違い、着任日からの逆算スケジュール。台湾華語で直接対応する宅地建物取引士が解説します。文京区小日向・茗荷谷駅徒歩5分。",
    path: "/funin",
    keywords: ["東京 赴任 住まい 探し", "駐在員 東京 賃貸", "オンライン内見 海外から", "法人契約 賃貸 赴任", "台湾 東京 赴任 部屋探し"],
    locale,
    absoluteTitle: true,
    availableLocales: ["ja", "zh-tw"],
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  const l = pickPageLocale(locale);
  const c = COPY[l];
  const home = l === "zh-tw" ? "首頁" : "ホーム";

  return (
    <RealestateServicePage
      path="/funin"
      answerBlock={c.answerBlock}
      crumbs={[{ name: home, href: "/" }, { name: c.crumb }]}
      serviceName={c.serviceName}
      heroSrc="/hero/realestate-global-16x9.webp"
      heroAlt={c.heroAlt}
      h1={c.h1}
      // 2026-07-27：property（事業用寄り）から property-general へ。
      // 赴任者の住まい探しに「居抜きかスケルトンか・業種（飲食など）」を聞くのは筋が違う。
      // property-general は4ロケールあり、ja＋zh-twの本ページをそのまま賄える。
      ctaVariant="property-general"
      lead={c.lead}
      internalLinks={c.links.map((x) => ({ href: addLocalePrefix(x.href, locale), label: x.label, noLocalePrefix: true }))}
      crossLinkLead={c.crossLead}
    >
      {/* §1 オンラインで決められるか */}
      <div>
        <ReH2>{c.h2Online}</ReH2>
        <p className="mt-3 leading-relaxed text-text">{c.onlineIntro}</p>
        <ul className="mt-4 space-y-2">
          {c.onlineCan.map((o) => (
            <li key={o.can} className="rounded-lg border border-border bg-surface p-3 text-sm leading-relaxed text-text">
              <strong className="text-ink">{o.can}</strong>
              <span className="mt-1 block text-text-muted">{o.note}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 font-medium text-ink">{c.onlineLocal}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-text">
          {c.onlineLocalItems.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </div>

      {/* §2 法人契約と個人契約（一次データ） */}
      <div>
        <ReH2>{c.h2Keiyaku}</ReH2>
        <p className="mt-3 leading-relaxed text-text">{c.keiyakuIntro}</p>
        <ul className="mt-4 space-y-3">
          {c.keiyaku.map((k) => (
            <li key={k.item} className="rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text">
              <strong className="text-ink">{k.item}</strong>
              <span className="mt-1 block">{l === "zh-tw" ? "公司簽約" : "会社契約"}：{k.corp}</span>
              <span className="mt-1 block text-text-muted">{l === "zh-tw" ? "個人簽約" : "個人契約"}：{k.ind}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 leading-relaxed text-text">{c.keiyakuNote}</p>
      </div>

      {/* §3 逆算スケジュール（一次データ） */}
      <div>
        <ReH2>{c.h2Schedule}</ReH2>
        <p className="mt-3 leading-relaxed text-text">{c.scheduleIntro}</p>
        <ul className="mt-4 space-y-2">
          {c.schedule.map((s) => (
            <li key={s.when} className="rounded-lg border border-border bg-surface p-3 text-sm leading-relaxed text-text">
              <strong className="text-ink">{s.when}</strong>
              <span className="mt-1 block">{s.what}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 leading-relaxed text-text">{c.scheduleNote}</p>
      </div>

      {/* §4 言語 */}
      <div>
        <ReH2>{c.h2Lang}</ReH2>
        {c.langBody}
      </div>

      {/* §5 書類 → 行政書士側へ */}
      <div>
        <ReH2>{c.h2Docs}</ReH2>
        {c.docsBody}
      </div>

      {/* §6 現場の実感（匿名化） */}
      <div>
        <ReH2>{c.h2Jikkan}</ReH2>
        {c.jikkanBody.map((p) => (
          <p key={p} className="mt-3 leading-relaxed text-text">
            {p}
          </p>
        ))}
      </div>

      <CannotHandle bare locale={locale} />
    </RealestateServicePage>
  );
}
