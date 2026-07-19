// /faq（型B・FAQPage）＝原稿_不動産 #8
// FAQPage JSON-LDはこの専用ページのみ（各サイト1本＝URL構造設計v1 §1）。HTMLと構造化データは同じitems配列から生成＝完全一致。
// 多言語化でもFaq部品にロケール済みitemsを渡すためHTMLとJSON-LDは自動一致（withJsonLd不変）。
// 【要確認】の項目（対応エリア・査定のみ対応）は断定しない安全文で公開可能な形にしてある（未検証を出力しない原則）。
// フェーズI多言語化（2026-07-11）：COPY: Record<LangCode,…>＋getRequestLocale 方式（手本= /legal/faq・/access）。
// en/zh-tw/zh=監修前ドラフト（2026-07-11）。繁体=台湾定訳（文京區・茗荷谷站・繼承・不動產）／zh=大陸表記。
// 相談料（Q1）＝2026-07-11浦松確定文言（改訂版）：媒介に関する相談＝仲介手数料の範囲（別途相談料なし）／
// 媒介を伴わないコンサル（媒介以外の関連業務）＝初回無料・2回目以降のみ事前同意で30分5,500円（税込）。
// ＝/access・/services・/souzoku/nagare と同一基準（国交省 解釈・運用＝媒介以外の関連業務は明確区分・事前設定・別合意）。
// ※宅建業法上の相談料の切り分けは石井弁護士の最終確認を通すこと。
// 業法訳は/access既訳と統一（仲介手数料=brokerage commission／法定上限=statutory maximum (cap) under the Real Estate Brokerage Act）。金額・率は全ロケール不変。
// 2026-07-19 B-3：ja=40問6分野（アンカーナビ＋セクション表示）。FAQPage JSON-LDは全40問を1本で出力（各サイト1本原則を維持）。
// 回答末尾の内部リンクは表示のみ（JSON-LDのAnswer text＝回答本文と完全一致）。en/zh-tw/zh＝既存8問のまま変更なし（監修後に拡充）。
// 法制度の断定は事実アンカーのみ（相続登記義務化2024年4月・原則3年以内／特定空家等・管理不全空家等の勧告で特例除外・最大6倍の場合／
// GH居室原則7.43㎡以上／指定申請書類の作成・提出＝行政書士の独占業務／仲介手数料の法定上限）。それ以外は「自治体・個別の事情により異なります」。
// 分離受任の定型＝「併設の四葉行政書士事務所が別契約で受任します」（独立事業体・紹介料等の授受なし）。一体提供を示唆する語は使用禁止。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { Faq, buildFaqJsonLd, type FaqItem } from "@/components/shared/Faq";
import { CtaBand } from "@/components/shared/CtaBand";
import type { LangCode } from "@/config/languages";

type FaqSection = { id: string; title: string; items: FaqItem[] };

type FaqPageCopy = {
  metaTitle: string;
  metaDesc: string;
  breadcrumbHome: string;
  breadcrumbCurrent: string;
  heading: string;
  items: FaqItem[];
  authorAlt: string;
  authorLabel: string;
  authorBio: string;
};

// ja専用：40問6分野（タスクB-3・2026-07-19浦松検収済み文面）。既存8問は各分野に統合（旧Q7「査定だけ」→Q6に統合）。
const JA_SECTIONS: FaqSection[] = [
  {
    id: "souzoku",
    title: "相続不動産",
    items: [
      {
        q: "文京区で不動産を相続したら、何から始めればいいですか？",
        a: "まず、登記簿で名義を確認し、遺言の有無と相続人の範囲を整理することから始めます。あわせて、権利関係や建物の状態など不動産の現状を把握すると、その後の方針が立てやすくなります。相続登記は2024年4月から義務化されており、取得を知った日から原則3年以内の申請が必要です。四葉不動産株式会社は、文京区・茗荷谷を中心に相続不動産のご相談を承ります。",
        links: [{ href: "/souzoku", label: "文京区で不動産を相続したら｜完全ガイド" }],
      },
      {
        q: "相続登記の期限はありますか？",
        a: "あります。相続登記は2024年4月から義務化され、不動産の取得を知った日から原則3年以内に申請する必要があります。登記申請の代理は司法書士の業務のため、当社は提携する司法書士をご紹介し、連携して進めます。期限や手続きの詳細は個別の事情により異なりますので、お早めにご相談ください。",
        links: [{ href: "/souzoku", label: "文京区で不動産を相続したら｜完全ガイド" }],
      },
      {
        q: "相続した不動産は、管理・活用・売却のどれを選べばいいですか？",
        a: "立地や建物の状態、必要な費用、ご家族の意向によって最適な選択は変わります。当社では、管理・活用・売却それぞれの見通しと費用を比較する形でご提案し、無理のない方針づくりをお手伝いします。方針が決まっていない段階のご相談も歓迎です。",
        links: [{ href: "/souzoku", label: "管理・活用・売却の比較ガイド" }],
      },
      {
        q: "借地権付きの実家を相続したら、どうすればいいですか？",
        a: "借地権も相続の対象となる財産で、売却・継続利用・地主への返還など複数の選択肢があります。ただし、契約内容や地主との協議状況によって取りうる選択肢が異なるため、まず借地契約の内容確認から始めることをお勧めします。個別の事情により対応が異なりますので、契約書をお手元にご相談ください。",
        links: [{ href: "/souzoku", label: "相続不動産の相談" }],
      },
      {
        q: "共有名義で相続した不動産はどう扱えばいいですか？",
        a: "一般に、共有名義の不動産全体を売却するには共有者全員の同意が必要とされます。共有のまま維持するか、話し合いで整理するか、持分をどう扱うかは個別の事情により異なりますので、専門家への確認をお勧めします。当社は不動産の面から、共有者間の方針整理に役立つ資料づくり（査定・活用見通し）をお手伝いします。",
        links: [{ href: "/souzoku", label: "相続不動産の相談" }],
      },
      {
        q: "売却にはどのくらいの期間がかかりますか？",
        a: "物件の立地・状態・価格設定によって大きく異なるため、一概には言えません。まず査定と販売方針のご相談から始め、見通しをご説明したうえで進め方を決めていきます。査定のみのご相談もお気軽にどうぞ。物件の状況を伺い、対応の可否と進め方をご案内します。",
        links: [{ href: "/souzoku/nagare", label: "相談から売却・活用までの流れ" }],
      },
      {
        q: "遺産分割協議書などの相続手続きは、誰が担当しますか？",
        a: "遺産分割協議書等の書類作成は、併設の四葉行政書士事務所が別契約で受任します。四葉不動産株式会社と四葉行政書士事務所は独立した事業体で、それぞれお客様と直接契約を結ぶ体制です（紹介料等の授受はありません）。不動産の売却・活用のご相談は当社が承ります。",
        links: [{ href: "/legal/services/inheritance", label: "四葉行政書士事務所・相続手続き" }],
      },
      {
        q: "税理士や司法書士も紹介してもらえますか？",
        a: "ご紹介できます。登記申請の代理は司法書士、税務申告は税理士、紛争の代理交渉は弁護士の業務であり、当社はこれらを直接お受けすることはできません。提携する専門家をご紹介し、不動産の面から連携して進めます。窓口を探す手間を減らしたい方もお気軽にご相談ください。",
        links: [{ href: "/souzoku", label: "相続不動産の相談" }],
      },
    ],
  },
  {
    id: "akiya",
    title: "空き家",
    items: [
      {
        q: "空き家を放置するとどうなりますか？",
        a: "老朽化や近隣への影響が進むほか、税負担が重くなる場合があります。特定空家等・管理不全空家等に指定され勧告を受けると、住宅用地特例の対象から除外され、土地の固定資産税額が最大6倍になる場合があります。運用の詳細は自治体により異なりますので、早めの管理・活用・売却のご検討をお勧めします。",
        links: [{ href: "/souzoku", label: "空き家を含む相続不動産の相談" }],
      },
      {
        q: "相続した空き家の売却で「3,000万円特別控除」は使えますか？",
        a: "相続した空き家の譲渡所得について3,000万円の特別控除という制度があります。ただし適用には要件があり、使えるかどうかの判断は税務の専門領域のため、税理士にご確認ください。当社は提携税理士のご紹介と、売却そのもののサポートを承ります。",
        links: [{ href: "/souzoku", label: "相続不動産の売却相談" }],
      },
      {
        q: "遠方に住んでいても空き家を売却できますか？",
        a: "できます。ご相談はオンラインや電話・LINEで進められ、現地の確認は当社が対応します。手続きに必要な書類やお立ち会いの要否は個別の事情により異なりますので、状況を伺ったうえでご案内します。海外在住の方のご相談にも対応しています。",
        links: [{ href: "/souzoku/nagare", label: "売却までの流れ" }],
      },
      {
        q: "再建築不可の物件でも売れますか？",
        a: "売却できる場合があります。再建築の可否や活用の選択肢は、接道の状況や隣地との関係など個別の事情により異なるため、まず現状の確認から始めます。条件が難しい物件こそ、進め方のご提案が価値を持ちますので、あきらめる前にご相談ください。",
        links: [{ href: "/souzoku", label: "相続不動産の相談" }],
      },
      {
        q: "相続した空き家をグループホームに使えますか？",
        a: "活用の選択肢の一つになり得ます。ただし、用途地域・居室面積・消防設備など障害福祉サービスの指定基準に関わる確認が必要で、基準は自治体・事業類型により異なります。当社は基準の確認を踏まえた物件活用のご相談を承ります。",
        links: [{ href: "/toushi/group-home", label: "グループホームに使える物件探し" }],
      },
    ],
  },
  {
    id: "group-home",
    title: "グループホーム・障害福祉",
    items: [
      {
        q: "グループホーム向けの物件はどう探せばいいですか？",
        a: "四葉不動産株式会社が、グループホーム（共同生活援助）等に使う物件探しをサポートします。一般の住居探しと違い、用途・立地・消防など指定基準に関わる確認を挟みながら進める必要があるため、事業計画の段階からご相談いただくとスムーズです。行政書士等の専門家と確認しながら進めます。",
        links: [{ href: "/toushi/group-home", label: "グループホームに使える物件探し" }],
      },
      {
        q: "立地（用途地域）の基準はありますか？",
        a: "その場所で福祉事業を営めるかは、用途地域や建物の用途などに関わり、自治体・個別の事情により異なります。契約後に使えないと判明することを避けるため、候補地ごとに自治体への事前確認が重要です。当社は確認のポイントを整理しながら物件探しをお手伝いします。",
        links: [{ href: "/toushi/group-home", label: "物件選びのチェックポイント" }],
      },
      {
        q: "居室面積の基準はありますか？",
        a: "グループホーム（共同生活援助）の居室は原則7.43㎡以上とされています。ただし、自治体・事業類型により基準が異なる場合があるため、指定を受ける自治体での事前確認が必要です。当社は面積基準を踏まえた物件のご提案を行います。",
        links: [{ href: "/toushi/group-home", label: "物件選びのチェックポイント" }],
      },
      {
        q: "消防設備は何が必要ですか？",
        a: "必要な消防設備は、建物の規模・構造や入居者の状況により異なり、自治体・消防署への事前確認が必要です。設置工事の要否は物件選びの費用に直結するため、契約前に確認しておくことが大切です。当社は消防面の確認を織り込んだ物件探しをサポートします。",
        links: [{ href: "/toushi/group-home", label: "物件選びのチェックポイント" }],
      },
      {
        q: "物件の契約前に確認すべき点は何ですか？",
        a: "主に、用途地域などの立地条件、居室面積、消防設備、そして貸主が福祉事業での利用を承諾しているかの4点です。いずれも契約後の変更が難しいため、指定基準との照合を済ませてから契約に進むことをお勧めします。当社はこれらの確認を挟みながら契約までサポートします。",
        links: [{ href: "/toushi/group-home", label: "物件選びのチェックポイント" }],
      },
      {
        q: "指定申請の書類は誰に頼めますか？",
        a: "指定申請書類の作成・提出は、官公署に提出する書類の作成として行政書士の独占業務です。併設の四葉行政書士事務所が別契約で受任します（当社とは独立した事業体で、紹介料等の授受はありません）。物件探しとあわせてご相談いただけます。",
        links: [{ href: "/legal/services/shogai-fukushi", label: "四葉行政書士事務所・障害福祉の指定申請" }],
      },
      {
        q: "物件探しと指定申請の担当はどう分かれますか？",
        a: "物件探し・仲介は宅建業者である四葉不動産株式会社、指定申請の書類作成・提出は併設の四葉行政書士事務所が、それぞれ別契約で受任します。両者は独立した事業体で、ご契約もご費用も別々です。役割の分担を明確にしたうえで、必要な確認は連携して進めます。",
        links: [{ href: "/toushi/group-home", label: "グループホームに使える物件探し" }],
      },
      {
        q: "文京区でもグループホーム向けの物件を探せますか？",
        a: "探せます。四葉不動産株式会社は文京区・茗荷谷を中心に対応しており、エリア外については個別にご相談ください。条件に合う物件の有無は時期により変わるため、希望条件を伺ったうえで探し方をご提案します。",
        links: [{ href: "/toushi/group-home", label: "グループホームに使える物件探し" }],
      },
    ],
  },
  {
    id: "foreign",
    title: "外国人・中国語対応",
    items: [
      {
        q: "外国人でも日本で部屋を借りられますか？",
        a: "借りられます。在留資格の確認や保証会社の利用など、日本特有の手続きがあるため、慣れた不動産会社のサポートがあるとスムーズです。四葉不動産株式会社は日本語・英語・中国語で、お部屋探しから契約・入居までサポートします。",
        links: [{ href: "/global", label: "外国人・多言語のお部屋探し" }],
      },
      {
        q: "中国語で不動産の相談ができますか？",
        a: "できます。代表の浦松丈二は元毎日新聞記者で、中国総局長として中国や台湾、タイに駐在しました。日本語・英語・中国語（繁体字・簡体字）でご相談いただけます。母語で安心してご相談ください。",
        links: [{ href: "/global", label: "外国人・多言語のお部屋探し" }],
      },
      {
        q: "繁体字と簡体字の両方に対応していますか？",
        a: "対応しています。台湾・香港の方には繁体字、中国大陸の方には簡体字でご案内でき、当サイトにも繁体字・簡体字のページがあります。文化的な背景の違いも踏まえてご対応します。",
        links: [{ href: "/global", label: "外国人・多言語のお部屋探し" }],
      },
      {
        q: "海外在住のまま日本の不動産を売却できますか？",
        a: "ご相談いただけます。オンラインでのご相談に対応しており、現地の確認は当社が行います。必要な書類や手続きはご状況（在住国・在留状況など）により異なりますので、個別に確認しながら進めます。",
        links: [{ href: "/global", label: "外国人・多言語サポート" }],
      },
      {
        q: "在日中国人の相続は、どの国の法律によりますか？",
        a: "国際相続では、どの国の法律が適用されるかが事案ごとに問題となり、一概には言えません。ご家族の国籍や資産の所在などにより扱いが異なるため、個別の事案は専門家にご確認ください。当社は不動産の面からご相談を承り、相続関係の書類作成は併設の四葉行政書士事務所が別契約で受任します。",
        links: [{ href: "/legal/services/inheritance", label: "四葉行政書士事務所・相続手続き" }],
      },
      {
        q: "海外の戸籍や公証書類の翻訳は相談できますか？",
        a: "ご相談いただけます。相続や各種手続きに必要な外国語書類の翻訳・書類作成支援は、併設の四葉行政書士事務所が別契約で受任します（当社とは独立した事業体です）。不動産のご相談とあわせて、窓口をご案内できます。",
        links: [{ href: "/legal/services/inheritance", label: "四葉行政書士事務所・相続手続き" }],
      },
      {
        q: "在留資格（ビザ）の相談もできますか？",
        a: "在留資格に関する申請書類の作成・手続きのご相談は、併設の四葉行政書士事務所が別契約で受任します（当社とは独立した事業体で、紹介料等の授受はありません）。お住まい探しは四葉不動産株式会社が承りますので、来日にともなうご相談の入口としてご利用ください。",
        links: [{ href: "/legal/services/visa", label: "四葉行政書士事務所・在留資格" }],
      },
      {
        q: "重要事項説明を外国語でサポートしてもらえますか？",
        a: "サポートします。ご契約前の重要事項説明の際、英語・中国語での補足説明に対応し、内容を十分ご理解いただいたうえで契約を進めます。専門用語が多い場面こそ、母語での確認が安心につながります。",
        links: [{ href: "/global", label: "外国人・多言語のお部屋探し" }],
      },
    ],
  },
  {
    id: "corporate",
    title: "法人・社宅",
    items: [
      {
        q: "社宅用の物件を探してもらえますか？",
        a: "探せます。四葉不動産株式会社は、企業・施設向けの社宅手配や法人賃貸に対応します。ご予算・エリア・入居時期を伺い、契約形態のご相談も含めてサポートします。",
        links: [{ href: "/toushi/shataku", label: "社宅・法人賃貸のサポート" }],
      },
      {
        q: "外国人採用にともなう社宅も相談できますか？",
        a: "できます。外国人材の住まい確保に対応しており、入居者ご本人への説明は日本語・英語・中国語でサポートできます。受け入れ準備の負担を減らしたい企業様はお気軽にご相談ください。",
        links: [{ href: "/toushi/shataku", label: "社宅・法人賃貸のサポート" }],
      },
      {
        q: "事業用物件の許認可（飲食・古物など）も相談できますか？",
        a: "物件探しは四葉不動産株式会社が承ります。営業許可など官公署への申請書類の作成・提出は、併設の四葉行政書士事務所が別契約で受任します（独立した事業体・紹介料等の授受はありません）。物件の条件が許認可に影響する場合もあるため、早めのご相談をお勧めします。",
        links: [{ href: "/legal/services", label: "四葉行政書士事務所・取扱業務" }],
      },
    ],
  },
  {
    id: "company",
    title: "会社・相談方法",
    items: [
      {
        q: "四葉不動産はどんな会社ですか？",
        a: "四葉不動産株式会社は、東京都文京区小日向４丁目２－５ 小日向安田ビル ２０３にある不動産会社です。東京メトロ丸ノ内線「茗荷谷」駅から徒歩5分で、売買・賃貸の仲介、賃貸管理、相続不動産のご相談を扱います。行政書士事務所併設で、多言語（日本語・英語・中国語）に対応します。",
        links: [{ href: "/about", label: "会社概要" }],
      },
      {
        q: "宅建業の免許番号は何ですか？",
        a: "宅地建物取引業免許は「東京都知事(1)第113304号」です。代表の浦松丈二は専任の宅地建物取引士（東京・第293544号）として業務にあたります。免許情報を含む会社の詳細は会社概要をご覧ください。",
        links: [{ href: "/about", label: "会社概要" }],
      },
      {
        q: "代表はどんな人ですか？",
        a: "代表取締役の浦松丈二は、元毎日新聞記者（記者歴34年）で、中国総局長として中国や台湾、タイに駐在しました。専任の宅地建物取引士であり、行政書士（登録番号第25087022号）でもあります。社会保険労務士試験に合格し2026年9月の開業を予定しています（現時点では未開業）。取材で培った調査力と多言語対応が強みです。",
        links: [{ href: "/about/uramatsu", label: "代表プロフィール" }],
      },
      {
        q: "対応エリアはどこですか？",
        a: "四葉不動産株式会社は文京区・茗荷谷を中心に対応します。エリア外の物件については、内容により対応の可否をご案内しますので、個別にご相談ください。オンラインでのご相談は全国・海外からも可能です。",
        links: [{ href: "/access", label: "アクセス" }],
      },
      {
        q: "相談方法にはどんなものがありますか？",
        a: "ご来店のほか、オンライン・電話・LINEでのご相談に対応します。ご来店の際は、事前にLINEか電話でご連絡いただくとスムーズです。まずは一言のお問い合わせからで大丈夫です。",
        links: [{ href: "/contact", label: "お問い合わせ" }],
      },
      {
        q: "相談や仲介の料金はいくらですか？",
        a: "初回のご相談は無料です。売買・賃貸の媒介に関するご相談は仲介手数料の範囲で承り、媒介を伴わない不動産コンサルティング（媒介以外の関連業務）は2回目以降、事前のご同意のうえ原則30分5,500円（税込）です。仲介手数料は宅地建物取引業法の法定上限の範囲（売買は400万円超で価格×3%＋6万円＋税、賃貸は借賃1か月分＋税以内）で、具体的な金額はお見積りします。行政書士業務の報酬は四葉行政書士事務所の報酬額表をご覧ください。",
        links: [
          { href: "/ryokin", label: "料金" },
          { href: "/legal/ryokin", label: "行政書士事務所・報酬額表" },
        ],
      },
      {
        q: "営業時間を教えてください。",
        a: "営業時間は10:00〜18:00、定休日は火曜・水曜です。ご来店前にLINEかお電話でご連絡いただくとスムーズにご案内できます。オンライン相談の日時はお問い合わせの際に調整します。",
        links: [{ href: "/access", label: "アクセス" }],
      },
      {
        q: "四葉不動産と四葉行政書士事務所はどんな関係ですか？",
        a: "同じ代表が運営する、それぞれ独立した事業体です。不動産の仲介・管理は四葉不動産株式会社が、官公署への書類作成などの行政書士業務は四葉行政書士事務所が、それぞれお客様と別契約で受任します（分離受任）。両者の間で紹介料等の授受はありません。",
        links: [{ href: "/legal", label: "四葉行政書士事務所" }],
      },
    ],
  },
];

const COPY: Record<LangCode, FaqPageCopy> = {
  ja: {
    metaTitle: "よくある質問｜文京区・茗荷谷の四葉不動産株式会社",
    metaDesc:
      "四葉不動産株式会社への「相続の相談は無料か」「中国語・英語で相談できるか」「文京区以外も対応か」「グループホーム物件や社宅を扱えるか」などのよくある質問に、一問一答でお答えします。文京区小日向・茗荷谷駅徒歩5分。まずはお気軽にご相談ください。",
    breadcrumbHome: "ホーム",
    breadcrumbCurrent: "よくある質問",
    heading: "よくある質問",
    // ja＝40問6分野（JA_SECTIONS）を平坦化。JSON-LDはこの配列から1本生成（表示HTMLと同一ソース＝完全一致）
    items: JA_SECTIONS.flatMap((s) => s.items),
    authorAlt: "四葉不動産株式会社 代表取締役 浦松丈二",
    authorLabel: "この記事の著者",
    authorBio:
      "浦松 丈二｜四葉不動産株式会社 代表取締役・専任宅地建物取引士。行政書士。元毎日新聞中国総局長（記者歴34年）。中国や台湾、タイに駐在。社会保険労務士試験合格（2026年9月開業予定）。",
  },
  en: {
    metaTitle: "FAQ | 四葉不動産株式会社 (Yotsuba Real Estate) — Bunkyo & Myogadani, Tokyo",
    metaDesc:
      "Answers to frequently asked questions about Yotsuba Real Estate Co., Ltd.: Is an inheritance consultation free? Can I consult in Chinese or English? Do you cover areas outside Bunkyo-ku? Can you handle group-home properties or company housing? Kohinata, Bunkyo-ku, Tokyo — a 5-minute walk from Myogadani Station. Feel free to contact us.",
    breadcrumbHome: "Home",
    breadcrumbCurrent: "FAQ",
    heading: "Frequently Asked Questions",
    items: [
      {
        q: "Is a consultation about inheritance or real estate free?",
        a: "Your first consultation is free of charge. From the second session onward, real-estate consulting that does not involve brokerage (a second opinion, advice on utilizing or holding your overall assets, and the like — i.e., related work other than brokerage) is, in principle, ¥5,500 (tax incl.) per 30 minutes — only with your prior consent, and online sessions are available. Consultations relating to a sale or lease we broker are covered by the brokerage commission. Feel free to start with a single line via LINE or phone.",
      },
      {
        q: "Can I consult in Chinese or English?",
        a: "Yes. 浦松丈二 (Joji Uramatsu), our representative, is a former China General Bureau Chief of the Mainichi Shimbun who was stationed in China, Taiwan, and Thailand, and handles consultations in Japanese, English, Traditional Chinese, and Simplified Chinese. If you are looking for a room as a foreign resident, please also see the “Multilingual Room-Hunting Support” page.",
      },
      {
        q: "Can I consult about properties outside Bunkyo-ku?",
        a: "Yotsuba Real Estate Co., Ltd. mainly serves Bunkyo-ku and the Myogadani area. For properties outside this area, please contact us individually.",
      },
      {
        q: "Can you find properties usable for group homes or disability-welfare services?",
        a: "Yes. Yotsuba Real Estate Co., Ltd. handles consultations on properties used for group homes (shared-living support, kyodo seikatsu enjo) and similar purposes. Points related to designation standards — such as the property's permitted use, location, and fire-safety requirements — are confirmed together with specialists such as a gyoseishoshi (administrative scrivener) as we proceed. The designation application itself is handled by 四葉行政書士事務所 (Yotsuba Gyoseishoshi Office), an affiliated but separate entity that accepts engagements independently (no referral fees are exchanged).",
      },
      {
        q: "Can you also arrange company housing and corporate leases?",
        a: "Yes. Yotsuba Real Estate Co., Ltd. arranges company housing for companies and facilities and handles corporate leases. We also help secure housing for international staff.",
      },
      {
        q: "Can you also handle inheritance registration and inheritance tax?",
        a: "Inheritance registration is the domain of a judicial scrivener (shiho-shoshi), and inheritance tax that of a licensed tax accountant. Yotsuba Real Estate Co., Ltd. handles real-estate consultation, sales, leasing, and management, and moves these procedures forward in coordination with partner specialists. Inheritance-related document preparation and permits/licenses can be handled by 四葉行政書士事務所 (Yotsuba Gyoseishoshi Office), a separate entity.",
      },
      {
        q: "Can I request just a property valuation?",
        a: "Please feel free to contact us. We will ask about the property's situation and explain whether we can assist and how we would proceed.",
      },
      {
        q: "How much is the brokerage commission?",
        a: "Brokerage commissions for sales and leasing are within the statutory maximum (cap) under the Real Estate Brokerage Act (宅地建物取引業法). The specific amount is calculated for each property. See the “Access & Fees” page for details.",
      },
    ],
    authorAlt: "Joji Uramatsu, Representative Director of Yotsuba Real Estate Co., Ltd.",
    authorLabel: "About the author",
    authorBio:
      "Joji Uramatsu | Representative Director of Yotsuba Real Estate Co., Ltd.; full-time licensed real estate broker; gyoseishoshi lawyer. Former China General Bureau Chief of the Mainichi Shimbun (34 years as a journalist), stationed in China, Taiwan, and Thailand. Passed the national exam for licensed social insurance and labor consultant (office opening scheduled for September 2026).",
  },
  "zh-tw": {
    metaTitle: "常見問題｜文京區・茗荷谷的四葉不動産株式会社",
    metaDesc:
      "關於四葉不動産株式会社的常見問題——「繼承諮詢是否免費」「可否用中文・英文諮詢」「文京區以外是否對應」「可否處理團體家屋物件或員工宿舍」等，以一問一答方式回答。文京區小日向・茗荷谷站步行5分鐘。歡迎隨時諮詢。",
    breadcrumbHome: "首頁",
    breadcrumbCurrent: "常見問題",
    heading: "常見問題",
    items: [
      {
        q: "繼承或不動產的諮詢是免費的嗎？",
        a: "初次諮詢免費。第2次起，不涉及仲介的不動產顧問服務（第二意見、整體資產的活用・持有方針建議等＝仲介以外的相關業務），經事先同意後原則上以每30分鐘5,500日圓（含稅・可線上進行）承接。與本公司承辦之買賣・租賃仲介相關的諮詢，包含於仲介手續費範圍內。歡迎先透過LINE或電話說一句話。",
      },
      {
        q: "可以用中文或英文諮詢嗎？",
        a: "可以。代表・浦松丈二曾任每日新聞中國總局長，旅居海外4國，可用日文、英文、中文（繁體・簡體）對應。外國人士找房，也請參閱「外國人・多語言找房服務」頁面。",
      },
      {
        q: "文京區以外的物件也可以諮詢嗎？",
        a: "四葉不動産株式会社以文京區・茗荷谷為中心提供服務。區域外的物件請個別洽詢。",
      },
      {
        q: "可以找適合團體家屋或障礙福祉用途的物件嗎？",
        a: "可以。四葉不動産株式会社受理團體家屋（共同生活援助）等用途物件的諮詢。物件的用途、地點、消防等與指定基準相關的事項，將與行政書士等專家確認後推進。指定申請本身由關聯事業・四葉行政書士事務所（另一事業體・獨立受任・不收受介紹費等）對應。",
      },
      {
        q: "也可以安排員工宿舍・法人租賃嗎？",
        a: "可以。四葉不動産株式会社對應企業・設施的員工宿舍（社宅）安排與法人租賃，也對應外國人才的住居確保。",
      },
      {
        q: "繼承登記或繼承稅也可以委託嗎？",
        a: "繼承登記屬司法書士、繼承稅（日本相續稅）屬稅理士的領域。四葉不動産株式会社負責不動產的諮詢・買賣・租賃・管理，這些手續將與合作的專家協同推進。與繼承相關的文件製作・許認可，可由四葉行政書士事務所（另一事業體）對應。",
      },
      {
        q: "只做估價也可以嗎？",
        a: "歡迎隨時諮詢。我們將了解物件狀況後，說明可否對應及進行方式。",
      },
      {
        q: "仲介手續費是多少？",
        a: "買賣・租賃的仲介手續費在宅地建物取引業法的法定上限範圍內。具體金額將按各物件個別計算。詳情請參閱「交通與費用」頁面。",
      },
    ],
    authorAlt: "四葉不動産株式会社 代表取締役 浦松丈二",
    authorLabel: "本文作者",
    authorBio:
      "浦松 丈二｜四葉不動産株式会社 代表取締役・專任宅地建物取引士。行政書士。曾任每日新聞中國總局長（記者資歷34年）・旅居海外4國。已通過社會保險勞務士考試（預定2026年9月開業）。",
  },
  zh: {
    metaTitle: "常见问题｜文京区・茗荷谷的四葉不動産株式会社",
    metaDesc:
      "关于四葉不動産株式会社的常见问题——「继承咨询是否免费」「可否用中文・英文咨询」「文京区以外是否对应」「可否处理团体家屋物件或员工宿舍」等，以一问一答方式回答。文京区小日向・茗荷谷站步行5分钟。欢迎随时咨询。",
    breadcrumbHome: "首页",
    breadcrumbCurrent: "常见问题",
    heading: "常见问题",
    items: [
      {
        q: "继承或不动产的咨询是免费的吗？",
        a: "初次咨询免费。第2次起，不涉及中介的不动产顾问服务（第二意见、整体资产的活用・持有方针建议等＝中介以外的相关业务），经事先同意后原则上以每30分钟5,500日元（含税・可在线进行）承接。与本公司承办之买卖・租赁中介相关的咨询，包含在中介手续费范围内。欢迎先通过LINE或电话说一句话。",
      },
      {
        q: "可以用中文或英文咨询吗？",
        a: "可以。代表・浦松丈二曾任每日新闻中国总局长，旅居海外4国，可用日语、英语、中文（繁体・简体）对应。外国人士找房，也请参阅「外国人・多语言找房服务」页面。",
      },
      {
        q: "文京区以外的物件也可以咨询吗？",
        a: "四葉不動産株式会社以文京区・茗荷谷为中心提供服务。区域外的物件请个别洽询。",
      },
      {
        q: "可以找适合团体家屋或残障福祉用途的物件吗？",
        a: "可以。四葉不動産株式会社受理团体家屋（共同生活援助）等用途物件的咨询。物件的用途、地点、消防等与指定基准相关的事项，将与行政书士等专家确认后推进。指定申请本身由关联事业・四葉行政書士事務所（另一事业体・独立受任・不收受介绍费等）对应。",
      },
      {
        q: "也可以安排员工宿舍・法人租赁吗？",
        a: "可以。四葉不動産株式会社对应企业・设施的员工宿舍（社宅）安排与法人租赁，也对应外国人才的住居确保。",
      },
      {
        q: "继承登记或继承税也可以委托吗？",
        a: "继承登记属司法书士、继承税（日本相续税）属税理士的领域。四葉不動産株式会社负责不动产的咨询・买卖・租赁・管理，这些手续将与合作的专家协同推进。与继承相关的文件制作・许认可，可由四葉行政書士事務所（另一事业体）对应。",
      },
      {
        q: "只做估价也可以吗？",
        a: "欢迎随时咨询。我们将了解物件状况后，说明可否对应及进行方式。",
      },
      {
        q: "中介手续费是多少？",
        a: "买卖・租赁的中介手续费在日本《宅地建物取引业法》的法定上限范围内。具体金额将按每个物件单独计算。详情请参阅「交通与费用」页面。",
      },
    ],
    authorAlt: "四葉不動産株式会社 代表取缔役 浦松丈二",
    authorLabel: "本文作者",
    authorBio:
      "浦松 丈二｜四葉不動産株式会社 代表取缔役・专任宅地建物取引士。行政书士。曾任每日新闻中国总局长（记者经历34年）・旅居海外4国。已通过社会保险劳务士考试（预定2026年9月开业）。",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;
  return buildPageMetadata({
    businessKey: "realestate",
    title: c.metaTitle,
    description: c.metaDesc,
    path: "/faq",
    keywords: ["四葉不動産 よくある質問", "文京区 不動産 相談 無料", "不動産 多言語 相談"],
    locale,
    absoluteTitle: true,
  });
}

export default async function Page() {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? COPY.ja;
  const isJa = c === COPY.ja;
  return (
    <>
      <Breadcrumb items={[{ name: c.breadcrumbHome, href: "/" }, { name: c.breadcrumbCurrent }]} />
      {/* FAQPage JSON-LD はこの専用ページのみ出力（ロケール済みitemsを渡す＝HTMLと構造化データは自動一致） */}
      {isJa ? (
        <>
          {/* ja＝6分野セクション＋アンカーナビ。JSON-LDは全40問を1本で出力（各サイト1本原則） */}
          <div className="mx-auto max-w-3xl px-4 pt-6">
            <h2 className="font-serif text-2xl font-semibold text-ink">{c.heading}</h2>
            <nav aria-label="分野別もくじ" className="mt-4 flex flex-wrap gap-2">
              {JA_SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="rounded-full border border-border bg-surface px-3 py-1 text-sm text-ink hover:text-primary"
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </div>
          {JA_SECTIONS.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-20">
              <Faq items={s.items} heading={s.title} openFirst={i === 0} />
            </section>
          ))}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(c.items)) }}
          />
        </>
      ) : (
        <Faq items={c.items} heading={c.heading} withJsonLd />
      )}
      <div className="mx-auto max-w-3xl px-4 pb-8">
        {/* 署名（E-E-A-T・原稿_不動産サイト共通）＝/access既訳と同一文言（社労士試験合格の表記は署名のみ可の規程どおり） */}
        <aside className="mt-2 flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
          <img
            src="/staff/uramatsu-square.webp"
            alt={c.authorAlt}
            width={48}
            height={48}
            className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
          />
          <p className="text-xs leading-relaxed text-text-muted">
            <strong>{c.authorLabel}</strong> {c.authorBio}
          </p>
        </aside>
        <CtaBand businessKey="realestate" />
      </div>
    </>
  );
}
