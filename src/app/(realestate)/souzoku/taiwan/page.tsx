// /souzoku/taiwan（台湾越境相続）＝地域階層#19（2026-07-22・日本語版のみ・監修前ドラフト実装）
// 2026-07-22 zh-tw追加（浦松指示・台湾華語）：COPY: Record方式で ja＋zh-tw の2ロケール化。
//   ja本文は従前と一字一句同一（回帰ゼロ）。en/zh は従前どおり ja へフォールバック。
//   zh-tw訳語は既存確定訳に統一＝CannotHandle zh-tw（司法書士〔…〕・稅理士〔…〕・分離受任・個別簽約・介紹費）
//   ／著者行は翻訳チェック§6の正形「曾派駐（旅居4國の誤りを再生産しない）」。
// 方式＝RealestateServicePage（手本=/toushi/shitei-shinsei C-2）。ja先行公開・/souzoku 配下（勝ちクラスタの子＝権威継承）。
// 表示コンプライアンス（C-2検収準拠＋国際私法の特則）：
//   ・業務一体提供を示唆する語（ワンストップ等）は全文で使用禁止（zh-twでも一站式・單一窗口等を書かない）。
//   ・独占業務の表現＝「作成」が行政書士の独占業務。「作成・提出は独占業務」とまとめない（zh-tw＝「製作」のみ）。
//   ・【最重要】準拠法（どの国の法律で相続するか）は一切断定しない＝個別判断は提携弁護士へ（AI判断禁止の中核）。
//     通則法の条番号・台湾民法の期限等の数値は書かない。認証手続きは機関名を書かず一般形＋提出先確認へ誘導。
//   ・顧問等の人物名への言及はしない（2026-07-22 浦松判断・確定）。
// FAQPage JSON-LD＝ja は faqJa（souzoku/foreign新設2問＋既存2問）を参照（文字列コピー禁止）。
//   zh-tw はロケール済み items を直接渡す（Faq部品の規約＝HTMLとJSON-LDが同一itemsから生成・inLanguage=zh-Hant）。
// hero＝bunkyo-sakura-16x9.webp（ブランド汎用）を暫定使用（専用画像TODO）。
import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import { RealestateServicePage, ReH2 } from "@/components/shared/RealestateServicePage";
import { CannotHandle } from "@/components/shared/CannotHandle";
import { Faq, type FaqItem } from "@/components/shared/Faq";
import { pickFaqJa } from "@/data/faqJa";
import type { LangCode } from "@/config/languages";

// 本ページの提供ロケール（en/zh は ja へフォールバック＝従前挙動）
type PageLocale = "ja" | "zh-tw";
const pickPageLocale = (locale: LangCode): PageLocale => (locale === "zh-tw" ? "zh-tw" : "ja");

// 冒頭の回答ブロック（H1直下）。分離受任＋弁護士連携の型（監修前ドラフト）
const JA_ANSWER_BLOCK =
  "台湾籍の方が日本の不動産を相続するとき、また相続人の中に台湾在住の方がいるときは、日本と台湾の両方で戸籍関係の書類を集め、翻訳・認証を経て、遺産分割と不動産の手続きを進めることになります。台湾は日本と同じく戸籍制度のある数少ない地域のため、相続関係の証明は比較的整理しやすい一方、書類のやり取り・認証・言語の壁が実務のハードルになります。四葉不動産株式会社が相続不動産の管理・活用・売却を担当し、遺産分割協議書の作成など書類の作成は併設の四葉行政書士事務所が別契約で受任します。どの国の法律が適用されるかなど法的判断が必要な場合は提携弁護士に、登記は提携司法書士に、税務は提携税理士におつなぎします。日本語・中国語（繁体字）で対応します。";

const TW_ANSWER_BLOCK =
  "台灣籍人士繼承日本的不動產，或繼承人之中有人居住在台灣時，需要在日本與台灣兩地蒐集戶籍相關文件，經過翻譯・認證，再推進遺產分割與不動產的手續。台灣與日本同樣是少數採用戶籍制度的地區，繼承關係的證明相對容易整理；另一方面，文件往來・認證・語言的隔閡，則是實務上的門檻。由四葉不動産株式会社負責繼承不動產的管理・活用・出售；遺產分割協議書等文件的製作，由附設的四葉行政書士事務所另行簽約受任。需要判斷適用哪一國法律等法律判斷時，將為您轉介合作律師；登記轉介合作司法書士〔日本的登記申請代理專業資格〕；稅務轉介合作稅理士〔日本的稅務專業資格〕。以日語・中文（繁體字）提供服務。";

// FAQPage＝ja は faqJa参照（新設2問＋既存2問）
const JA_FAQ_QUESTIONS = [
  "台湾に相続人がいる（台湾籍の方が相続する）場合も、日本語で相談できますか？",
  "台湾の戸籍謄本などの書類は、どうやって集めればいいですか？",
  "相続した不動産は、管理・活用・売却のどれを選べばいいですか？",
  "四葉不動産と四葉行政書士事務所はどんな関係ですか？",
];

// zh-tw FAQ＝faqJa 4問の逐語訳（内容の追加・削除なし）。links はロケール済み href を渡す（Faq部品の規約）
const TW_FAQ_ITEMS: FaqItem[] = [
  {
    q: "繼承人在台灣（由台灣籍人士繼承）的情況，也可以用日語諮詢嗎？",
    a: "可以。對日本側的親屬以日語、對居住在台灣的繼承人以中文（繁體字），說明相同的內容並一起推進。台灣與日本同樣採用戶籍制度，繼承關係的證明相對容易整理；另一方面，有時需要文件的翻譯・認證。遺產分割協議書等文件的製作，由附設的四葉行政書士事務所另行簽約受任；需要法律判斷時，與合作律師協同處理。",
    links: [{ href: "/zh-tw/souzoku/taiwan", label: "涉及台灣的不動產繼承完全指南" }],
  },
  {
    q: "台灣的戶籍謄本等文件，該如何蒐集？",
    a: "向台灣的戶政機關申請核發文件，附上日語譯文後使用。申請方式（本人申請・代理申請・經由當地親屬等）與是否需要認證，依提出對象（法務局〔日本的登記機關〕・金融機構等）而異，邊確認提出對象的要求邊推進最為穩妥。我們可以從必要文件的整理開始協助，請先告訴我們繼承人的組成與不動產的所在地。",
    links: [{ href: "/zh-tw/souzoku/taiwan", label: "涉及台灣的不動產繼承完全指南" }],
  },
  {
    q: "繼承的不動產，該在管理・活用・出售之中怎麼選？",
    a: "依地點、建物狀況、所需費用、家人的意向，合適的選擇會有所不同。本公司以比較管理・活用・出售各自的前景與費用的方式提出建議，協助您建立不勉強的方針。尚未決定方針階段的諮詢也很歡迎。",
    links: [{ href: "/zh-tw/souzoku", label: "管理・活用・出售的比較指南" }],
  },
  {
    q: "四葉不動産與四葉行政書士事務所是什麼關係？",
    a: "是由同一位代表經營、彼此獨立的事業體。不動產的仲介・管理由四葉不動産株式会社承辦；製作向官公署提出之文件等行政書士業務，由四葉行政書士事務所承辦，各自與客戶另行簽約受任（分離受任）。兩者之間沒有介紹費等的收受。",
    links: [{ href: "/zh-tw/legal", label: "四葉行政書士事務所" }],
  },
];

// §1 何が違うか
const JA_DIFFS: { title: string; body: string }[] = [
  { title: "書類が二か国にまたがる", body: "相続関係を証明するために、日本の戸籍に加えて台湾側の戸籍書類（戸籍謄本など）が必要になる場面があります。" },
  { title: "翻訳・認証", body: "台湾で発行された書類は、日本の手続きで使うために日本語訳を付し、書類によっては認証手続きを経る必要があります。必要な認証の種類・手順は提出先により異なります。" },
  { title: "どの国の法律で相続するか", body: "被相続人の国籍・居住地などによって、適用される法律の整理が必要になることがあります。この判断は個別の事案によるため、必要に応じて提携弁護士と連携して進めます。" },
  { title: "距離と言語", body: "台湾在住の相続人との連絡・書類のやり取り・意思確認を、言語の壁を越えて進める必要があります。" },
];

const TW_DIFFS: { title: string; body: string }[] = [
  { title: "文件橫跨兩國", body: "為了證明繼承關係，除了日本的戶籍之外，有時也需要台灣方面的戶籍文件（戶籍謄本等）。" },
  { title: "翻譯・認證", body: "台灣核發的文件，要在日本的手續中使用，需附上日語譯文；部分文件並須經過認證手續。所需認證的種類・程序，依提出對象而異。" },
  { title: "以哪一國的法律進行繼承", body: "依被繼承人的國籍・居住地等，有時需要整理適用的法律。此判斷因個案而異，必要時將與合作律師協同進行。" },
  { title: "距離與語言", body: "與居住在台灣的繼承人之間的聯繫・文件往來・意思確認，需要跨越語言的隔閡來進行。" },
];

// §5 役割分担表
const JA_ROLES: { work: string; who: string }[] = [
  { work: "相続不動産の管理・活用・売却（宅地建物取引業）", who: "四葉不動産株式会社" },
  { work: "遺産分割協議書・官公署提出書類の作成（作成は行政書士の独占業務・別契約）", who: "併設の四葉行政書士事務所（中国語対応）" },
  { work: "準拠法の判断・紛争性のある事案", who: "提携弁護士をご紹介" },
  { work: "相続登記", who: "提携司法書士をご紹介" },
  { work: "税務（非居住者の源泉・申告等）", who: "提携税理士をご紹介" },
];

const TW_ROLES: { work: string; who: string }[] = [
  { work: "繼承不動產的管理・活用・出售（宅地建物取引業〔不動產交易業〕）", who: "四葉不動産株式会社" },
  { work: "遺產分割協議書・向官公署提出文件的製作（製作為行政書士的獨占業務・另行簽約）", who: "附設的四葉行政書士事務所（中文對應）" },
  { work: "適用法律的判斷・具爭訟性的案件", who: "為您介紹合作律師" },
  { work: "繼承登記", who: "為您介紹合作司法書士" },
  { work: "稅務（非居住者的源泉扣繳・申報等）", who: "為您介紹合作稅理士" },
];

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const l = pickPageLocale(locale);
  if (l === "zh-tw") {
    return buildPageMetadata({
      businessKey: "realestate",
      title: "繼承人在台灣的不動產繼承｜文件・手續・出售完全指南 | 四葉不動産",
      description:
        "台灣籍人士繼承日本的不動產、繼承人在台灣——涉及台灣的繼承，需同時推進兩國戶籍文件的蒐集・翻譯・認證，以及不動產的出路（管理・活用・出售）。由四葉不動産株式会社負責不動產；遺產分割協議書等文件的製作，由附設的四葉行政書士事務所另行簽約受任。中文（繁體字）對應。文京區小日向・茗荷谷站步行5分。",
      path: "/souzoku/taiwan",
      keywords: [
        "台灣人 日本 不動產 繼承",
        "台灣 繼承人 手續",
        "台灣 戶籍謄本 繼承 翻譯",
        "國際繼承 台灣 諮詢",
        "台灣 繼承 不動產 出售",
      ],
      locale,
      absoluteTitle: true,
      availableLocales: ["ja", "zh-tw"],
    });
  }
  return buildPageMetadata({
    businessKey: "realestate",
    title: "台湾に相続人がいる不動産相続｜書類・手続き・売却の完全ガイド | 四葉不動産",
    description:
      "台湾籍の方が日本の不動産を相続する、台湾に相続人がいる——台湾がからむ相続は、両国の戸籍書類の収集・翻訳・認証と、不動産の出口（管理・活用・売却）を並行して進めます。四葉不動産株式会社が不動産を担当し、遺産分割協議書など書類の作成は併設の四葉行政書士事務所が別契約で受任。中国語（繁体字）対応。文京区小日向・茗荷谷駅徒歩5分。",
    path: "/souzoku/taiwan",
    keywords: [
      "台湾人 日本 不動産 相続",
      "台湾 相続人 手続き",
      "台湾 戸籍謄本 相続 翻訳",
      "国際相続 台湾 相談",
      "台湾 相続 不動産 売却",
    ],
    locale,
    absoluteTitle: true,
    availableLocales: ["ja", "zh-tw"],
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  const l = pickPageLocale(locale);
  const isTw = l === "zh-tw";

  return (
    <RealestateServicePage
      path="/souzoku/taiwan"
      answerBlock={isTw ? TW_ANSWER_BLOCK : JA_ANSWER_BLOCK}
      crumbs={
        isTw
          ? [
              { name: "首頁", href: "/" },
              { name: "繼承不動產", href: "/souzoku" },
              { name: "涉及台灣的繼承" },
            ]
          : [
              { name: "ホーム", href: "/" },
              { name: "相続不動産", href: "/souzoku" },
              { name: "台湾がからむ相続" },
            ]
      }
      serviceName={
        isTw
          ? "涉及台灣的繼承不動產之管理・活用・出售"
          : "台湾がからむ相続不動産の管理・活用・売却"
      }
      heroSrc="/hero/bunkyo-sakura-16x9.webp"
      heroAlt={isTw ? "文京區・播磨坂櫻花林蔭道的意象" : "文京区・播磨坂の桜並木のイメージ"}
      h1={
        isTw
          ? "涉及台灣的不動產繼承——從文件到出售，以日語與繁體中文支援"
          : "台湾がからむ不動産相続——書類から売却まで、日本語と繁体字で"
      }
      lead={
        isTw ? (
          <p>
            「繼承人之一在台灣」「持台灣籍的家人要繼承日本的房屋」——涉及台灣的繼承，是<strong>跨越兩國的文件與語言</strong>來推進的。所幸台灣是與日本同樣採用戶籍制度的地區。只要正確安排步驟，就能穩健地進行。本頁將說明與一般繼承的差異、文件的蒐集方式、不動產的出路，以及<strong>分工與契約的劃分</strong>。
          </p>
        ) : (
          <p>
            「相続人の一人が台湾にいる」「台湾籍の家族が日本の家を相続する」——台湾がからむ相続は、<strong>二か国の書類と言語をまたいで</strong>進みます。幸い台湾は日本と同じ戸籍制度を持つ地域。段取りを正しく組めば着実に進められます。このページでは、通常の相続との違い、書類の集め方、不動産の出口、そして<strong>担当・契約の分担</strong>を解説します。
          </p>
        )
      }
      internalLinks={
        isTw
          ? [
              { href: "/souzoku", label: "繼承不動產完全指南（管理・活用・出售）" },
              { href: "/souzoku/akiya", label: "空屋完全指南" },
              { href: "/global/chinese", label: "致中文圈人士（繁體字・簡體字）" },
              { href: "/legal", label: "四葉行政書士事務所" },
              { href: "/contact", label: "聯絡我們" },
            ]
          : [
              { href: "/souzoku", label: "相続不動産の完全ガイド（管理・活用・売却）" },
              { href: "/souzoku/akiya", label: "空き家の完全ガイド" },
              { href: "/global/chinese", label: "中国語圏の方へ（繁体字・簡体字）" },
              { href: "/legal", label: "四葉行政書士事務所" },
              { href: "/contact", label: "お問い合わせ" },
            ]
      }
      crossLinkLead={
        isTw
          ? "遺產分割協議書等繼承文件的製作，在相關事業・四葉行政書士事務所的頁面有詳細解說。"
          : "遺産分割協議書など相続書類の作成は、関連事業の四葉行政書士事務所のページで詳しく解説しています。"
      }
      relatedAria={isTw ? "相關連結" : undefined}
      relatedHeading={isTw ? "本頁的相關連結" : undefined}
      authorAlt={isTw ? "四葉不動産株式会社 代表取締役 浦松丈二" : undefined}
      authorLabel={isTw ? "本文作者" : undefined}
      authorBio={
        isTw
          ? "浦松 丈二｜四葉不動産株式会社 代表取締役・專任宅地建物取引士。行政書士。曾任每日新聞中國總局長（記者資歷34年），曾派駐中國、台灣、泰國。已通過社會保險勞務士考試（預定2026年9月開業）。"
          : undefined
      }
    >
      {/* §1 何が違うか。準拠法は断定せず弁護士連携へ */}
      <div>
        <ReH2>{isTw ? "涉及台灣的繼承，有什麼不同" : "台湾がからむ相続は、何が違うのか"}</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          {isTw
            ? "當繼承人或被繼承人與台灣有關聯時，一般的繼承之外，還會增加下列課題。"
            : "相続人や被相続人に台湾とのつながりがあると、通常の相続に次の論点が加わります。"}
        </p>
        <ul className="mt-4 space-y-3">
          {(isTw ? TW_DIFFS : JA_DIFFS).map((d) => (
            <li key={d.title} className="rounded-lg border border-border bg-surface p-4 text-sm leading-relaxed text-text">
              <strong className="text-ink">{d.title}</strong>
              <span className="mt-1 block">{d.body}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 leading-relaxed text-text">
          {isTw
            ? "所幸台灣與日本同樣採用戶籍制度，是較容易以文件證明「誰是繼承人」的地區。只要正確安排步驟，就能穩健地進行。"
            : "幸い、台湾は日本と同様の戸籍制度を持つため、「誰が相続人か」を書類で示しやすい地域です。段取りを正しく組めば、着実に進められます。"}
        </p>
      </div>

      {/* §2 書類。認証は一般形＋提出先確認 */}
      <div>
        <ReH2>{isTw ? "文件的蒐集方式——日本側與台灣側" : "書類の集め方——日本側と台湾側"}</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          {isTw
            ? "在日本側，需備齊被繼承人自出生至死亡的戶籍、繼承人的戶籍・印鑑證明等。在台灣側，則向台灣的戶政機關申請核發戶籍文件等，並附上日語譯文。申請方式（本人申請・代理申請・經由當地親屬等）以及是否需要認證，依提出對象（法務局〔日本的登記機關〕・金融機構・稅務署等）而異，因此實務上的通例，是一邊確認提出對象的要求、一邊推進。"
            : "日本側では、被相続人の出生から死亡までの戸籍、相続人の戸籍・印鑑証明などを揃えます。台湾側では、台湾の戸籍機関が発行する戸籍書類等を取り寄せ、日本語訳を付します。取り寄せの方法（本人請求・代理請求・現地のご親族経由など）や、認証の要否は、提出先（法務局・金融機関・税務署など）により異なるため、提出先の要件を確認しながら進めるのが実務の定石です。"}
        </p>
        <p className="mt-3 leading-relaxed text-text">
          {isTw
            ? "四葉行政書士事務所（行政書士・中文對應）另行簽約受任，協助整理必要文件，並製作遺產分割協議書等有關權利義務・事實證明的文件，以及向官公署提出的文件。也可以為台灣方面的繼承人準備繁體中文的說明資料。"
            : "四葉行政書士事務所（行政書士・中国語対応）が、必要書類の整理と、遺産分割協議書など権利義務・事実証明に関する書類および官公署に提出する書類の作成を別契約で受任します。台湾側の相続人への説明資料を繁体字でご用意することもできます。"}
        </p>
      </div>

      {/* §3 不動産の出口。souzoku本体・akiyaへ導線＝クラスタ内リンク */}
      <div>
        <ReH2>{isTw ? "不動產如何處理——管理・活用・出售" : "不動産をどうするか——管理・活用・売却"}</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          {isTw ? (
            <>
              文件備齊之後，接著決定不動產的出路。思考方式與日本國內的繼承相同，是「管理・活用・出售」三選一（詳見
              <Link href={addLocalePrefix("/souzoku", locale)} className="text-primary underline">繼承不動產完全指南</Link>
              ）。涉及台灣時特有的，是下列3點。
            </>
          ) : (
            <>
              書類が整ったら、不動産の出口を決めます。考え方は国内の相続と同じ「管理・活用・売却」の3択です（詳しくは
              <Link href={addLocalePrefix("/souzoku", locale)} className="text-primary underline">相続不動産の完全ガイド</Link>
              ）。台湾がからむ場合に特有なのは、次の3点です。
            </>
          )}
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text">
          {isTw ? (
            <>
              <li><strong className="text-ink">從遠地・海外做決策</strong>：與居住在台灣的繼承人，建立以線上方式推進的安排。</li>
              <li><strong className="text-ink">容易變成空屋</strong>：繼承人未居住在日本時，閒置的風險會升高（<Link href={addLocalePrefix("/souzoku/akiya", locale)} className="text-primary underline">空屋完全指南</Link>）。</li>
              <li><strong className="text-ink">非居住者的稅務</strong>：出售・出租有非居住者特有的稅務處理，因此與合作稅理士協同推進。</li>
            </>
          ) : (
            <>
              <li><strong className="text-ink">遠方・海外からの意思決定</strong>：台湾在住の相続人とオンラインで進める段取りをつくります。</li>
              <li><strong className="text-ink">空き家になりやすい</strong>：相続人が日本に住んでいない場合、放置のリスクが高まります（<Link href={addLocalePrefix("/souzoku/akiya", locale)} className="text-primary underline">空き家の完全ガイド</Link>）。</li>
              <li><strong className="text-ink">非居住者の税務</strong>：売却・賃貸には非居住者特有の税務上の取り扱いがあるため、提携税理士と連携して進めます。</li>
            </>
          )}
        </ul>
        <p className="mt-3 leading-relaxed text-text">
          {isTw
            ? "由四葉不動産株式会社（宅地建物取引業〔不動產交易業〕）負責從估價到出售・出租活用・管理。以文京區・茗荷谷為中心，也對應鄰近各區。"
            : "四葉不動産株式会社（宅地建物取引業）が、査定から売却・賃貸活用・管理までを担当します。文京区・茗荷谷を中心に、近隣区にも対応します。"}
        </p>
      </div>

      {/* §4 なぜ四葉か。名誉顧問の言及は検収確認まで見送り */}
      <div>
        <ReH2>{isTw ? "一間與台灣距離很近的事務所" : "台湾との距離が近い事務所であること"}</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          {isTw ? (
            <>
              代表浦松丈二為前每日新聞記者（記者資歷34年），曾以中國總局長的身分派駐台灣・中國，可以中文對應諮詢。我們持續以繁體中文發布資訊，也能為台灣的繼承人準備繁體中文的說明資料。給中文圈讀者的解說，請參閱
              <Link href={addLocalePrefix("/global/chinese", locale)} className="text-primary underline">致中文圈人士</Link>
              。
            </>
          ) : (
            <>
              代表の浦松丈二は元毎日新聞記者（記者歴34年）で、中国総局長として台湾・中国に駐在した経験があり、中国語での相談に対応します。繁体字での情報発信を継続しており、台湾の相続人向けの説明資料も繁体字でご用意できます。中国語圏の方向けの解説は
              <Link href={addLocalePrefix("/global/chinese", locale)} className="text-primary underline">中国語圏の方へ</Link>
              をご覧ください。
            </>
          )}
        </p>
      </div>

      {/* §5 役割分担表 */}
      <div>
        <ReH2>{isTw ? "分工與契約的劃分" : "担当・契約の分担"}</ReH2>
        <p className="mt-3 leading-relaxed text-text">
          {isTw
            ? "不動產・文件・法律判斷・登記・稅務，分別由各自獨立的事業體・專家另行簽約負責。"
            : "不動産・書類・法的判断・登記・税務は、それぞれ独立した事業体・専門家が別契約で担当します。"}
        </p>
        <table className="mt-4 w-full border-collapse text-sm">
          <thead>
            <tr className="bg-primary-tint text-left">
              <th className="border border-border px-3 py-2">{isTw ? "業務" : "業務"}</th>
              <th className="border border-border px-3 py-2">{isTw ? "負責" : "担当"}</th>
            </tr>
          </thead>
          <tbody className="text-text">
            {(isTw ? TW_ROLES : JA_ROLES).map((r) => (
              <tr key={r.work}>
                <td className="border border-border px-3 py-2">{r.work}</td>
                <td className="border border-border px-3 py-2">{r.who}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-text-muted">
          {isTw
            ? "與各事業體・專家均為分離受任・個別簽約，本公司不會收取介紹費。"
            : "各事業体・専門家とは分離受任・個別契約であり、当社が紹介料を受け取ることはありません。"}
        </p>
      </div>

      {/* 対応できないこと＝共通コンポーネント（確定文言・zh-twは既存の浦松確定逐語訳） */}
      <CannotHandle bare locale={l} />

      {/* FAQPage JSON-LD＝ja: faqJa参照（サイト内で文言一致）／zh-tw: ロケール済みitems＋inLanguage */}
      {isTw ? (
        <Faq
          items={TW_FAQ_ITEMS}
          heading="常見問題"
          ariaLabel="常見問題"
          withJsonLd
          inLanguage="zh-Hant"
          bare
          openFirst={false}
        />
      ) : (
        <Faq items={pickFaqJa(JA_FAQ_QUESTIONS)} heading="よくある質問" withJsonLd bare openFirst={false} />
      )}
    </RealestateServicePage>
  );
}
