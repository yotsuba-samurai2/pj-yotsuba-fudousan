// /labor/ryokin（型C・料金）＝開業後公開
// 2026-08-11 全面改訂：報酬額表 v18 → 2026-08-13 v26（手続きをおおむね3割引き下げ）。
//   ・顧問料は相談料。手続はすべてスポット。手続だけの依頼は受けない
//   ・給与計算は顧問契約とセット（〜29人は1人あたり月1,100円・基本料なし／30人〜はお見積り）
//   ・人数の数え方＝役員＋従業員（アルバイト・パートを含む）。被保険者数ではない
//   ・★引下げの理由：AIの活用で手続きは安売り合戦になる。その流れを先取りする（浦松の判断）。
//     決め手は「回らなければ上げられる。顧問料は上げられない」という非対称性。
//   ・★2026-08-14：顧問料に「freeeでの内製への切替支援」を含むことを明示（社労士法2条1項3号の
//     相談・指導の範囲＝顧問料は相談の対価という設計と整合）。freeeの「認定」等は登録事実が
//     ないため書かない。「自動化できます」と成果を約束しない。比較優位の断定もしない。
//   ・★顧問料÷11,000の「ご相談時間の目安」は契約書にのみ記載。本ページには出さない（N-9）
// 2026-09-01 多言語化（第1波）：COPY: Record<LangCode,…>。SECTIONS・NOT_HANDLED・FAQSも
//   ロケールごとに持つ。価格表記＝en「¥22,000」／zh-tw「22,000日圓・含稅」／zh「22,000日元・含税」。
//   届出の様式名は日本語のまま各書体へ（資格取得届等＝コラムの慣行）。
// JSON-LD＝Service＋PriceSpecification（「〜」「お見積り」を含まない確定値のみ）＋FAQPage（ロケールの文言）。
// C8（→/legal/ryokin）はSR_LAUNCHEDで自動開通。
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { getRequestLocale } from "@/lib/getRequestLocale";
import { addLocalePrefix } from "@/lib/locale";
import Link from "next/link";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { CtaBand } from "@/components/shared/CtaBand";
import { CrossLinkBanner } from "@/components/shared/CrossLinkBanner";
import { Placeholder } from "@/components/shared/Placeholder";
import { getCrossLinks } from "@/lib/cross-links";
import { SR_LAUNCHED } from "@/lib/shared/office";
import type { LangCode } from "@/config/languages";

const SITE = "https://luck428.com";

type Row = { name: string; unit: string; price: string; value?: number };
type Section = { title: string; lead?: string; note?: string; rows: Row[] };
type Faq = { q: string; a: string; link?: { href: string; label: string } };
type Copy = {
  metaTitle: string;
  metaDescription: string;
  jsonLdServiceName: string;
  bcHome: string;
  bcHere: string;
  h1: string;
  lead1Strong: string;
  lead1Rest: string;
  lead2Strong: string;
  lead2Rest: string;
  lead2Strong2: string;
  readTitle: string;
  readItems: { strong: string; rest: string }[];
  read4Strong: string;
  read4Pre: string;
  read4Link: string;
  read4Post: string;
  tableHead: [string, string, string];
  spUnit: string;
  spPrice: string;
  sections: Section[];
  notTitle: string;
  notLead: string;
  notLeadStrong: string;
  notRows: { name: string; to: string }[];
  notNote: string;
  faqTitle: string;
  faqs: Faq[];
  taxNote: string;
  crossLead: string;
  flowPre: string;
  flowLink: string;
  authorTitle: string;
  authorBody1: string;
  authorBody2: string;
};

const JA: Copy = {
  metaTitle: "料金｜四葉社会保険労務士事務所",
  metaDescription:
    "四葉社会保険労務士事務所の料金です。顧問料は労務のご相談に対する対価で、ご相談は回数・時間の制限なく承ります。労働社会保険の手続は届出ごとの料金を都度申し受けます。給与計算は代行（29人まで1人あたり月1,100円）のほか、freeeで自社計算（内製）に切り替える体制づくりの支援を顧問料に含めて承ります。文京区小日向・茗荷谷駅徒歩5分。",
  jsonLdServiceName: "四葉社会保険労務士事務所 料金",
  bcHome: "ホーム",
  bcHere: "料金",
  h1: "料金",
  lead1Strong: "顧問料は、労務のご相談に対する対価です。",
  lead1Rest:
    "ご相談は回数・時間の制限なく承ります。労働社会保険の手続は、顧問先の方も届出ごとの料金を都度申し受けます。給与計算などの毎月の作業をfreeeで自社処理（内製）に切り替える体制づくりの支援は、顧問料に含みます。",
  lead2Strong: "手続だけのご依頼は承っておりません。",
  lead2Rest:
    "ご相談を伴わずに手続だけをお受けすると、実情を把握しないまま誤った前提で処理してしまうおそれがあるためです。法人・個人事業主のお客さまは顧問契約を前提としてお受けします。",
  lead2Strong2: "障害年金（個人のお客さま）と外部監査人（監理支援機関のお客さま）は、顧問契約を前提としません。",
  readTitle: "この表の読み方",
  readItems: [
    { strong: "「含まないもの」も書いています。", rest: "当事務所が取り扱わない業務は、おつなぎ先を明示しています。紹介料の授受は行いません。" },
    { strong: "お見積りの項目は5つです。", rest: "募集・採用コンサルタント／処遇改善加算の設計／外部監査人／顧問料の30人〜／給与計算の30人〜。作業量が案件ごとに大きく変わるためで、隠しているわけではありません。" },
    { strong: "金額は着手前に書面でお出しします。", rest: "この表の単価から積み上げるので、内訳がそのまま見えます。作業を始めてから金額が決まることはありません。" },
  ],
  read4Strong: "2026年8月、手続きの料金をおおむね3割引き下げました。",
  read4Pre:
    "freee人事労務と生成AIの活用で、手続きの作業は軽くなります。そのぶんをお返しする趣旨です。給与計算を当事務所に頼まず、freeeで内製する体制づくりを顧問契約の範囲で支援する形も選べます。",
  read4Link: "進め方のページ",
  read4Post: "に、AIをどこまで使うか（と、使わないところ）を書いています。",
  tableHead: ["サービス", "単位", "税込"],
  spUnit: "単位：",
  spPrice: "税込：",
  sections: [
    {
      title: "顧問（ご相談）",
      lead: "顧問料は、労務のご相談に対する対価です。ご相談は回数・時間の制限なく承ります。給与計算などの毎月の作業をfreeeで自社処理（内製）に切り替える体制づくりの支援も、ご相談の一部として顧問料に含みます。",
      note: "人数帯は目安です。顧問料はご相談の対価のため、ご相談の内容と量に応じた帯でお見積りします。人数は、役員と従業員の合計です（アルバイト・パートの方を含みます。社会保険の被保険者数ではありません）。手続・給与計算・規程の作成は顧問料に含まれません（下記のとおり別途申し受けます）。30人以上の会社は、就業実態と規程の本数を伺ったうえで個別にお見積りします。",
      rows: [
        { name: "〜4人", unit: "月額", price: "22,000円", value: 22000 },
        { name: "5〜9人", unit: "月額", price: "33,000円", value: 33000 },
        { name: "10〜14人", unit: "月額", price: "44,000円", value: 44000 },
        { name: "15〜19人", unit: "月額", price: "55,000円", value: 55000 },
        { name: "20〜24人", unit: "月額", price: "66,000円", value: 66000 },
        { name: "25〜29人", unit: "月額", price: "77,000円", value: 77000 },
        { name: "30人〜", unit: "月額", price: "お見積り" },
      ],
    },
    {
      title: "ご相談（顧問契約前）",
      note: "顧問契約に至らない場合の2回目以降に申し受けます。顧問契約後のご相談は顧問料に含まれます。",
      rows: [
        { name: "初めてのご相談", unit: "60分まで", price: "無料" },
        { name: "2回目以降のご相談", unit: "1時間", price: "11,000円", value: 11000 },
      ],
    },
    {
      title: "給与計算",
      lead: "顧問先を対象に、2つの形でお受けします。当事務所が代行する形（下記の料金）と、freeeで自社計算（内製）に切り替える支援を受ける形（顧問料に含みます）です。給与計算だけのご依頼は承っておりません。",
      note: "基本料はありません。賞与の計算は含みます（賞与支払届の提出は別途申し受けます）。勤怠の打刻管理と年末調整は含みません（年末調整は税理士の業務です）。内製に切り替えたあとの毎月の締めや保険料率改定時のご相談も、顧問料に含まれます。30人以上の会社は、入退社の頻度と勤怠の運用を伺ったうえで個別にお見積りします。",
      rows: [
        { name: "給与計算（〜29人）", unit: "1名／月", price: "1,100円", value: 1100 },
        { name: "給与計算（30人〜）", unit: "月額", price: "お見積り" },
        { name: "freeeでの自社計算（内製）への切替・定着支援", unit: "—", price: "顧問料に含む" },
        { name: "住民税 特別徴収税額の年度更新", unit: "1名／年", price: "550円", value: 550 },
        { name: "住民税 特別徴収の異動届", unit: "1件", price: "お見積り" },
      ],
    },
    {
      title: "手続代行（適用）",
      note: "労働保険の概算保険料申告書は、保険関係成立の日から50日以内に提出が必要です。新規適用と合わせてお引き受けする場合は25,300円になります。事業を閉じるときの手続きも承ります。被保険者の資格喪失届は1名ごとに別途申し受けます。",
      rows: [
        { name: "社会保険 新規適用", unit: "1件", price: "20,900円", value: 20900 },
        { name: "労働保険 新規適用", unit: "1件", price: "13,750円", value: 13750 },
        { name: "労働保険 概算保険料申告書", unit: "1件", price: "11,550円", value: 11550 },
        { name: "事業所 各種変更届", unit: "1件", price: "6,050円", value: 6050 },
        { name: "社会保険 適用事業所全喪届", unit: "1件", price: "11,550円", value: 11550 },
        { name: "雇用保険 適用事業所廃止届", unit: "1件", price: "6,050円", value: 6050 },
        { name: "労働保険 確定保険料申告・保険関係消滅", unit: "一式", price: "15,400円〜" },
      ],
    },
    {
      title: "手続代行（入退社・扶養）",
      note: "届出ごとの料金です。入社1名を社会保険・雇用保険の両方で承る場合は5,500円になります。",
      rows: [
        { name: "社会保険 資格取得届", unit: "1名", price: "2,750円", value: 2750 },
        { name: "雇用保険 資格取得届", unit: "1名", price: "2,750円", value: 2750 },
        { name: "社会保険 資格喪失届", unit: "1名", price: "2,750円", value: 2750 },
        { name: "雇用保険 資格喪失届", unit: "1名", price: "2,750円", value: 2750 },
        { name: "被扶養者（異動）届", unit: "1名", price: "2,750円", value: 2750 },
        { name: "月額変更届", unit: "1件", price: "3,850円", value: 3850 },
      ],
    },
    {
      title: "手続代行（年次・給付）",
      note: "算定基礎届・年度更新は10名を超える場合、10名ごとに加算します。",
      rows: [
        { name: "社会保険 算定基礎届", unit: "一式", price: "16,500円〜" },
        { name: "労働保険 年度更新", unit: "一式", price: "16,500円〜" },
        { name: "賞与支払届", unit: "1回", price: "4,400円〜" },
        { name: "傷病手当金 申請", unit: "1件", price: "15,400円", value: 15400 },
        { name: "出産手当金 申請", unit: "1件", price: "15,400円", value: 15400 },
        { name: "育児休業給付金", unit: "1件", price: "初回 27,500円／2回目以降 6,600円〜" },
      ],
    },
    {
      title: "36協定",
      note: "料金は1事業場あたりの作成・届出です。",
      rows: [
        { name: "36協定 新規作成・届出", unit: "1事業場", price: "22,000円", value: 22000 },
        { name: "特別条項付き36協定 新規作成・届出", unit: "1事業場", price: "27,500円", value: 27500 },
        { name: "36協定 翌年度更新", unit: "1事業場", price: "11,000円", value: 11000 },
        { name: "特別条項付き36協定 翌年度更新", unit: "1事業場", price: "16,500円", value: 16500 },
      ],
    },
    {
      title: "規程",
      note: "当事務所が作成した規程の法改正対応（該当条文の改定と届出）は、顧問料に含まれます。回数の制限はありません。会社の都合による改定は「就業規則 変更」の料金を申し受けます。",
      rows: [
        { name: "就業規則 新規作成", unit: "一式", price: "88,000〜220,000円（規模・規程の本数で変動）" },
        { name: "就業規則 変更", unit: "一式", price: "44,000円〜" },
        { name: "賃金規程 作成", unit: "1件", price: "49,800円", value: 49800 },
        { name: "育児介護休業規程 作成", unit: "1件", price: "79,800円", value: 79800 },
        { name: "ハラスメント防止規程 作成", unit: "1件", price: "11,000円", value: 11000 },
        { name: "社宅規程 作成", unit: "1件", price: "38,500円", value: 38500 },
        { name: "出張旅費規程 作成", unit: "1件", price: "59,800円", value: 59800 },
      ],
    },
    {
      title: "加算・募集・調査",
      rows: [
        { name: "処遇改善加算 賃金要件の設計・算定支援", unit: "1件", price: "お見積り" },
        { name: "募集・採用コンサルタント", unit: "一式", price: "お見積り" },
        { name: "労基署調査・是正対応", unit: "1件", price: "55,000〜110,000円" },
        { name: "従業員説明会の開催", unit: "1回", price: "55,000円", value: 55000 },
        { name: "労働者代表の選出支援", unit: "—", price: "無料" },
        { name: "外国人雇用のご相談（中国語対応）", unit: "—", price: "顧問料に含む" },
      ],
    },
    {
      title: "助成金",
      note: "着手金はいただきません。紹介料の授受も行いません。",
      rows: [{ name: "助成金 申請代行（顧問先限定）", unit: "一式", price: "着手金なし ＋ 成功報酬 支給額の20%" }],
    },
    {
      title: "外部監査人（監理支援機関のお客さま）",
      lead: "顧問契約は不要です。監理支援機関から直接お受けします。",
      note: "外部監査人をお引き受けした監理支援機関の関係先とは、労務の顧問契約を結びません。既存の顧問先が加入している監理支援機関の外部監査人も、お引き受けしません。",
      rows: [
        { name: "外部監査人 就任・定期監査", unit: "1回", price: "お見積り" },
        { name: "実地確認への同行", unit: "1回", price: "上記のお見積りに含みます" },
      ],
    },
    {
      title: "障害年金（個人のお客さま）",
      lead: "顧問契約は不要です。ご本人・ご家族から直接お受けします。",
      note: "着手金・成功報酬の額は税込です。診断書料等の実費は別途申し受けます。障害年金の裁定請求の代理は社会保険労務士の業務です。",
      rows: [
        { name: "障害年金 裁定請求（新規）", unit: "1件", price: "着手金 30,000円 ＋ 成功報酬 年金3ヶ月分" },
        { name: "障害年金 裁定請求（遡及請求あり）", unit: "1件", price: "上記 ＋ 遡及額の15%" },
        { name: "事務手数料・実費", unit: "—", price: "郵送・診断書料・書類取得等の実費は別途" },
      ],
    },
  ],
  notTitle: "当事務所では取り扱わない業務",
  notLead: "次の業務は当事務所では承っておりません。その資格をお持ちの方におつなぎします。",
  notLeadStrong: "ご紹介にあたって紹介料の授受は一切行いません。",
  notRows: [
    { name: "年末調整、扶養控除・賃貸料相当額・非課税限度額などの税務判断", to: "税理士" },
    { name: "法人登記の変更", to: "司法書士" },
    { name: "離職理由をめぐる争いなど、紛争性が生じた事案", to: "弁護士" },
    { name: "在留資格の申請書類の作成・申請取次", to: "四葉行政書士事務所（別事業体・別々にご契約いただきます）" },
    { name: "処遇改善加算の計画書・実績報告書の作成と指定権者への提出", to: "四葉行政書士事務所（同上）" },
    { name: "補助金の申請", to: "四葉行政書士事務所（同上）" },
    { name: "監理支援機関の許可申請書類の作成", to: "四葉行政書士事務所（同上）" },
    { name: "求職者の紹介・あっせん、応募者の面接代行、求人媒体の運用代行", to: "取り扱っておりません" },
  ],
  notNote:
    "※四葉不動産株式会社・四葉行政書士事務所・四葉社会保険労務士事務所は、それぞれ別の事業体として独立してご依頼をお受けします。ご依頼いただく場合は事務所ごとに別々にご契約いただき、料金・請求も分かれます。当事務所へのご依頼が、他の事務所へのご依頼の条件になることはありません。",
  faqTitle: "料金についてよくある質問",
  faqs: [
    {
      q: "顧問料には何が含まれますか？",
      a: "労務のご相談（回数・時間の制限なし）、給与計算などをfreeeで自社処理（内製）に切り替える体制づくりの支援、当事務所が作成した規程の法改正対応が含まれます。労働社会保険の手続、給与計算の代行、規程の新規作成は含まれず、この表の料金を都度申し受けます。",
    },
    {
      q: "freeeでの内製化支援では、何をしてもらえますか？",
      a: "初期設定の設計（給与項目・手当・控除の整理と根拠づけ）、賃金控除の労使協定の整備、移行時の数か月の並走、毎月の締めや保険料率改定時のご相談です。すべて顧問料に含みます。画面操作の細部はfreeeの公式ヘルプ・サポートの領域と切り分けています。",
      link: { href: "/labor/column/kyuyo-keisan-freee-naisei", label: "内製という選択肢の中身（解説記事）" },
    },
    {
      q: "freeeのサポートだけで、内製化はできませんか？",
      a: "できる会社もあります。freeeの公式ヘルプ・サポートは、機能の使い方（操作）について頼れる窓口です。ただし、報酬を得て手続を代わりに行うことは社会保険労務士の独占業務であり（社会保険労務士法第27条）、また「この方は被保険者になるのか」「この手当は社会保険の報酬に入るのか」といった個別の事情への判断は、操作の説明の外側にあります。当事務所の内製化支援が受け持つのは、この外側——設定の設計と個別の判断——です。freeeのサポートと当事務所の支援は、置き換えではなく組み合わせるものとお考えください。",
    },
    {
      q: "給与計算を内製に切り替えると、支払いはどう変わりますか？",
      a: "代行をやめた月から、1人あたり月1,100円の代行料はかからなくなり、顧問料とfreeeの利用料（額はプランによります）になります。顧問料はご相談の対価のため変わりません。資格取得届などの手続を代行でご依頼いただく場合は、この表の料金を都度申し受けます。",
    },
    {
      q: "代行と内製は、途中で切り替えられますか？",
      a: "切り替えられます。内製から代行に戻すことも可能です。担当者の入退社などで状況が変わったら切り替えればよい設計にしており、どちらでも顧問料は変わりません。どちらが向いているかの整理からご相談いただけます。",
    },
    {
      q: "なぜ内製化支援は顧問料に含まれるのですか？",
      a: "当事務所の顧問料はご相談に対する対価で、手続や給与計算を含んでいません。内製の支援——設定の設計や毎月の判断のご相談——は、社会保険労務士法第2条第1項第3号が定める相談・指導そのもので、顧問契約でお受けしている相談の一場面だからです。別のサービスとして料金を立てていません。",
    },
    {
      q: "給与計算や手続だけをお願いできますか？",
      a: "承っておりません。ご相談を伴わずにお受けすると、実情を把握しないまま誤った前提で処理してしまうおそれがあるためです。障害年金（個人のお客さま）と外部監査人（監理支援機関のお客さま）は、顧問契約を前提とせずお受けします。",
    },
  ],
  taxNote:
    "※金額はすべて税込です。「〜」「お見積り」としている項目は、事案により作業量が変わるため、ご契約前に個別のお見積りを書面でご提示します。確定額のみ構造化データ（PriceSpecification）として出力しています。",
  crossLead: "行政書士業務（指定申請・在留資格・補助金等）の報酬は、四葉行政書士事務所（別事業体・独立受任）のページへ。",
  flowPre: "ご依頼の手順 → ",
  flowLink: "ご相談から契約までの流れ",
  authorTitle: "この記事の著者",
  authorBody1: " 浦松 丈二｜四葉社会保険労務士事務所 代表 社会保険労務士",
  authorBody2: "・行政書士（登録番号 第25087022号）・宅地建物取引士。元毎日新聞中国総局長（記者歴34年）。",
};

const EN: Copy = {
  metaTitle: "Fees｜四葉社会保険労務士事務所",
  metaDescription:
    "Fees of 四葉社会保険労務士事務所. The advisory fee is consideration for labor consultations, unlimited in frequency and time; labor and social-insurance procedures are charged per filing, for advisory clients as well. Payroll can be outsourced to us (¥1,100 per person per month up to 29 people) or brought in-house on freee with our support, which is included in the advisory fee. Kohinata, Bunkyo City, Tokyo.",
  jsonLdServiceName: "四葉社会保険労務士事務所 Fees",
  bcHome: "Home",
  bcHere: "Fees",
  h1: "Fees",
  lead1Strong: "The advisory (komon) fee is consideration for labor consultations.",
  lead1Rest:
    " Consultations are unlimited in frequency and time. Labor and social-insurance procedures are charged per filing, for advisory clients as well. Support for moving monthly work such as payroll in-house on freee is included in the advisory fee.",
  lead2Strong: "We do not accept procedure-only engagements.",
  lead2Rest:
    " Handling filings without consultations risks processing them on wrong assumptions, without knowing your actual situation. Companies and sole proprietors are accepted on the premise of an advisory contract.",
  lead2Strong2: "Disability pension claims (individuals) and external auditor engagements (supervising support organizations) do not require an advisory contract.",
  readTitle: "How to read this table",
  readItems: [
    { strong: "What is not included is also listed.", rest: "For work this office does not handle, the table names whom we refer you to. No referral fees are paid or received." },
    { strong: "Only five items are individually quoted:", rest: "recruitment consulting; design of the treatment-improvement addition; external auditor; advisory for 30+ people; payroll for 30+ people. Their workload varies too much case by case — nothing is hidden." },
    { strong: "Amounts are quoted in writing before we start.", rest: "Quotes are built up from the unit prices in this table, so the breakdown is fully visible. The amount is never decided after the work has begun." },
  ],
  read4Strong: "In August 2026 we lowered procedure fees by roughly 30%.",
  read4Pre:
    " With freee人事労務 and generative AI, the work of procedures gets lighter, and we pass that on. You can also choose not to outsource payroll and instead have us support bringing it in-house on freee, within the advisory contract. ",
  read4Link: "How we work",
  read4Post: " explains how far we use AI — and where we do not.",
  tableHead: ["Service", "Unit", "Tax incl."],
  spUnit: "Unit: ",
  spPrice: "Tax incl.: ",
  sections: [
    {
      title: "Advisory (consultations)",
      lead: "The advisory fee is consideration for labor consultations, unlimited in frequency and time. Support for moving monthly work such as payroll in-house on freee is included as part of the consultations.",
      note: "Headcount bands are a guide. Because the fee is consideration for consultations, we quote the band according to the substance and volume of your consultations. Headcount is directors plus employees, including part-timers (not the number of insured persons). Procedures, payroll, and drafting of rules are not included (charged separately as below). Companies of 30 or more are quoted individually.",
      rows: [
        { name: "Up to 4 people", unit: "per month", price: "¥22,000", value: 22000 },
        { name: "5–9 people", unit: "per month", price: "¥33,000", value: 33000 },
        { name: "10–14 people", unit: "per month", price: "¥44,000", value: 44000 },
        { name: "15–19 people", unit: "per month", price: "¥55,000", value: 55000 },
        { name: "20–24 people", unit: "per month", price: "¥66,000", value: 66000 },
        { name: "25–29 people", unit: "per month", price: "¥77,000", value: 77000 },
        { name: "30 people or more", unit: "per month", price: "individual quote" },
      ],
    },
    {
      title: "Consultations (before an advisory contract)",
      note: "Charged from the second consultation onward when no advisory contract follows. After contracting, consultations are covered by the advisory fee.",
      rows: [
        { name: "First consultation", unit: "up to 60 min", price: "free" },
        { name: "Second consultation onward", unit: "per hour", price: "¥11,000", value: 11000 },
      ],
    },
    {
      title: "Payroll",
      lead: "For advisory clients, in two forms: outsourced to this office (fees below), or brought in-house on freee with our support (included in the advisory fee). Payroll-only engagements are not accepted.",
      note: "No base fee. Bonus calculation is included (filing the bonus payment report is charged separately). Time-clock management and year-end tax adjustment are not included (the latter is the work of tax accountants). After moving in-house, monthly closing questions and premium-rate updates are covered by the advisory fee. Companies of 30 or more are quoted individually.",
      rows: [
        { name: "Payroll (up to 29 people)", unit: "per person / month", price: "¥1,100", value: 1100 },
        { name: "Payroll (30 people or more)", unit: "per month", price: "individual quote" },
        { name: "Support for moving payroll in-house on freee", unit: "—", price: "included in the advisory fee" },
        { name: "Resident tax: annual update of special collection amounts", unit: "per person / year", price: "¥550", value: 550 },
        { name: "Resident tax: special-collection change report", unit: "per case", price: "individual quote" },
      ],
    },
    {
      title: "Procedures (coverage)",
      note: "The labor-insurance estimated premium declaration must be filed within 50 days of the insurance relationship being established. Taken together with new coverage, the combined fee is ¥25,300. Procedures for closing a business are also handled. Loss-of-qualification reports for insured persons are charged per person.",
      rows: [
        { name: "Social insurance: new coverage", unit: "per case", price: "¥20,900", value: 20900 },
        { name: "Labor insurance: new coverage", unit: "per case", price: "¥13,750", value: 13750 },
        { name: "Labor insurance: estimated premium declaration", unit: "per case", price: "¥11,550", value: 11550 },
        { name: "Workplace change notifications", unit: "per case", price: "¥6,050", value: 6050 },
        { name: "Social insurance: full-loss report of covered workplace", unit: "per case", price: "¥11,550", value: 11550 },
        { name: "Employment insurance: workplace closure report", unit: "per case", price: "¥6,050", value: 6050 },
        { name: "Labor insurance: final premium declaration / termination", unit: "package", price: "from ¥15,400" },
      ],
    },
    {
      title: "Procedures (joining, leaving, dependents)",
      note: "Per filing. One new hire covered for both social and employment insurance comes to ¥5,500.",
      rows: [
        { name: "Social insurance: enrollment report", unit: "per person", price: "¥2,750", value: 2750 },
        { name: "Employment insurance: enrollment report", unit: "per person", price: "¥2,750", value: 2750 },
        { name: "Social insurance: loss report", unit: "per person", price: "¥2,750", value: 2750 },
        { name: "Employment insurance: loss report", unit: "per person", price: "¥2,750", value: 2750 },
        { name: "Dependent (change) report", unit: "per person", price: "¥2,750", value: 2750 },
        { name: "Monthly-remuneration change report", unit: "per case", price: "¥3,850", value: 3850 },
      ],
    },
    {
      title: "Procedures (annual, benefits)",
      note: "For the standard-remuneration report and the annual labor-insurance update, an additional charge applies per 10 people beyond the first 10.",
      rows: [
        { name: "Social insurance: standard-remuneration report", unit: "package", price: "from ¥16,500" },
        { name: "Labor insurance: annual update", unit: "package", price: "from ¥16,500" },
        { name: "Bonus payment report", unit: "per occasion", price: "from ¥4,400" },
        { name: "Injury and sickness allowance claim", unit: "per case", price: "¥15,400", value: 15400 },
        { name: "Maternity allowance claim", unit: "per case", price: "¥15,400", value: 15400 },
        { name: "Childcare leave benefits", unit: "per case", price: "first ¥27,500 / thereafter from ¥6,600" },
      ],
    },
    {
      title: "Article 36 agreements",
      note: "Per workplace, drafting and filing.",
      rows: [
        { name: "Article 36 agreement: new drafting & filing", unit: "per workplace", price: "¥22,000", value: 22000 },
        { name: "With special clauses: new drafting & filing", unit: "per workplace", price: "¥27,500", value: 27500 },
        { name: "Article 36 agreement: annual renewal", unit: "per workplace", price: "¥11,000", value: 11000 },
        { name: "With special clauses: annual renewal", unit: "per workplace", price: "¥16,500", value: 16500 },
      ],
    },
    {
      title: "Rules and regulations",
      note: "For rules drafted by this office, amendments required by legal changes (revision of the affected articles and filing) are covered by the advisory fee, with no limit on frequency. Revisions at the company's own initiative are charged as \"work rules: revision\".",
      rows: [
        { name: "Work rules: new drafting", unit: "package", price: "¥88,000–220,000 (varies by size and number of rules)" },
        { name: "Work rules: revision", unit: "package", price: "from ¥44,000" },
        { name: "Wage rules", unit: "per set", price: "¥49,800", value: 49800 },
        { name: "Childcare/caregiver leave rules", unit: "per set", price: "¥79,800", value: 79800 },
        { name: "Harassment prevention rules", unit: "per set", price: "¥11,000", value: 11000 },
        { name: "Company-housing rules", unit: "per set", price: "¥38,500", value: 38500 },
        { name: "Business-travel expense rules", unit: "per set", price: "¥59,800", value: 59800 },
      ],
    },
    {
      title: "Additions, recruitment, inspections",
      rows: [
        { name: "Treatment-improvement addition: wage-requirement design", unit: "per case", price: "individual quote" },
        { name: "Recruitment consulting", unit: "package", price: "individual quote" },
        { name: "Labor Standards Office inspection response", unit: "per case", price: "¥55,000–110,000" },
        { name: "Employee briefing session", unit: "per session", price: "¥55,000", value: 55000 },
        { name: "Support for electing an employee representative", unit: "—", price: "free" },
        { name: "Consultations on employing foreign nationals (Chinese available)", unit: "—", price: "included in the advisory fee" },
      ],
    },
    {
      title: "Subsidies",
      note: "No upfront fee. No referral fees are paid or received.",
      rows: [{ name: "Subsidy application (advisory clients only)", unit: "package", price: "no upfront fee + success fee of 20% of the amount granted" }],
    },
    {
      title: "External auditor (for supervising support organizations)",
      lead: "No advisory contract required; engaged directly by the supervising support organization.",
      note: "We do not enter labor advisory contracts with parties related to a supervising support organization whose external auditor we serve as, and we do not serve as external auditor for an organization our existing advisory clients belong to.",
      rows: [
        { name: "External auditor: appointment & periodic audits", unit: "per audit", price: "individual quote" },
        { name: "Accompanying on-site checks", unit: "per visit", price: "included in the quote above" },
      ],
    },
    {
      title: "Disability pension (individual clients)",
      lead: "No advisory contract required; engaged directly by the person or their family.",
      note: "Upfront and success fees are tax-inclusive. Out-of-pocket costs such as medical certificates are charged separately. Representing disability pension claims is the work of Certified Social Insurance and Labor Consultants.",
      rows: [
        { name: "Disability pension claim (new)", unit: "per case", price: "¥30,000 upfront + success fee of 3 months of pension" },
        { name: "Disability pension claim (with retroactive claim)", unit: "per case", price: "the above + 15% of the retroactive amount" },
        { name: "Administrative costs", unit: "—", price: "postage, medical certificates, and document fees are charged at cost" },
      ],
    },
  ],
  notTitle: "Work this office does not handle",
  notLead: "The following is not handled by this office. We will refer you to a qualified professional.",
  notLeadStrong: " No referral fees are paid or received.",
  notRows: [
    { name: "Year-end tax adjustment and tax judgments (dependent deductions, deemed rent, non-taxable limits)", to: "a licensed tax accountant" },
    { name: "Changes to corporate registration", to: "a judicial scrivener" },
    { name: "Disputes, such as contested reasons for leaving employment", to: "an attorney" },
    { name: "Preparing residence-status application documents / application services", to: "四葉行政書士事務所 (a separate business entity; contracted separately)" },
    { name: "Preparing and filing treatment-improvement addition plans and reports", to: "四葉行政書士事務所 (same as above)" },
    { name: "Subsidy (hojokin) applications", to: "四葉行政書士事務所 (same as above)" },
    { name: "Preparing permit applications for supervising support organizations", to: "四葉行政書士事務所 (same as above)" },
    { name: "Introducing or placing job seekers, interviewing applicants, running job-ad accounts", to: "not handled" },
  ],
  notNote:
    "* Yotsuba Real Estate Co., Ltd., 四葉行政書士事務所, and 四葉社会保険労務士事務所 are independent business entities and accept engagements separately. Contracts, fees, and billing are separate for each office, and engaging this office is never a condition for engaging another.",
  faqTitle: "Frequently asked questions about fees",
  faqs: [
    {
      q: "What does the advisory fee include?",
      a: "Labor consultations (unlimited in frequency and time), support for moving payroll and similar work in-house on freee, and legally required amendments to rules this office drafted. Labor and social-insurance procedures, outsourced payroll, and new drafting of rules are not included and are charged per this table.",
    },
    {
      q: "What does the freee in-housing support cover?",
      a: "Designing the initial setup (organizing pay items, allowances, and deductions with their legal grounds), preparing the wage-deduction labor-management agreement, running alongside you for the first months, and consultations on monthly closing and premium-rate updates — all within the advisory fee. Details of screen operation belong to freee's official help and support.",
      link: { href: "/labor/column/kyuyo-keisan-freee-naisei", label: "What bringing payroll in-house involves (article)" },
    },
    {
      q: "Can't we bring payroll in-house with freee's support alone?",
      a: "Some companies can. freee's official help and support are reliable for how to operate the features. However, performing procedures for remuneration on someone's behalf is the exclusive work of Certified Social Insurance and Labor Consultants (Article 27 of the Act), and judgments on individual circumstances — whether a person must be insured, whether an allowance counts as remuneration — sit outside operating instructions. Our in-housing support covers that outside: setup design and individual judgment. Think of freee's support and ours as a combination, not a substitution.",
    },
    {
      q: "If we move payroll in-house, how does what we pay change?",
      a: "From the month you stop outsourcing, the ¥1,100 per-person monthly fee ends; you pay the advisory fee plus freee's subscription (which depends on the plan). The advisory fee, being consideration for consultations, does not change. Procedures you still outsource, such as enrollment reports, are charged per this table.",
    },
    {
      q: "Can we switch between outsourcing and in-house mid-way?",
      a: "Yes, in both directions. The design allows switching when circumstances change, such as staff turnover in the person handling payroll, and the advisory fee is the same either way. You can start by consulting us on which suits you.",
    },
    {
      q: "Why is in-housing support included in the advisory fee?",
      a: "Our advisory fee is consideration for consultations and does not include procedures or payroll. In-housing support — setup design and monthly judgment calls — is exactly the consultation and guidance defined in Article 2, Paragraph 1, Item 3 of the Certified Social Insurance and Labor Consultant Act, i.e., one scene of the consultations covered by the advisory contract. We do not price it as a separate service.",
    },
    {
      q: "Can we ask for payroll or procedures only?",
      a: "No. Accepting them without consultations risks processing on wrong assumptions, without knowing your actual situation. Disability pension claims (individuals) and external auditor engagements (supervising support organizations) are accepted without an advisory contract.",
    },
  ],
  taxNote:
    "* All amounts include tax. Items marked \"from\" or \"individual quote\" vary in workload by case; a written individual quote is presented before contracting. Only fixed amounts are output as structured data (PriceSpecification).",
  crossLead: "For fees of administrative-scrivener work (designation applications, residence status, subsidies), see 四葉行政書士事務所 — a separate business entity engaged independently.",
  flowPre: "The engagement process → ",
  flowLink: "From consultation to contract",
  authorTitle: "Author",
  authorBody1: " Joji Uramatsu | Representative, 四葉社会保険労務士事務所; Certified Social Insurance and Labor Consultant",
  authorBody2: "; Administrative Scrivener (Reg. No. 25087022); Licensed Real Estate Transaction Specialist. Former China General Bureau Chief of the Mainichi Shimbun (34 years as a journalist).",
};

const ZH_TW: Copy = {
  metaTitle: "費用｜四葉社會保險勞務士事務所",
  metaDescription:
    "四葉社會保險勞務士事務所的費用。顧問費是勞務諮詢的對價，諮詢不限次數與時間；勞動社會保險手續按申報件數每次另計，顧問客戶亦同。薪資計算可委託代行（29人以內每人每月1,100日圓），或在顧問費內接受改為在freee上自行計算（內製）的體制建立支援。東京都文京區小日向・茗荷谷站步行5分鐘。",
  jsonLdServiceName: "四葉社會保險勞務士事務所 費用",
  bcHome: "首頁",
  bcHere: "費用",
  h1: "費用",
  lead1Strong: "顧問費是勞務諮詢的對價。",
  lead1Rest:
    "諮詢不限次數與時間。勞動社會保險手續，顧問客戶也按申報件數每次另計。把薪資計算等每月作業改為在freee上自行處理（內製）的體制建立支援，包含在顧問費內。",
  lead2Strong: "不承接只辦手續的委託。",
  lead2Rest:
    "不伴隨諮詢而只代辦手續，可能在不了解實情的狀態下以錯誤前提處理。法人・個人事業主的客戶，以顧問契約為前提承接。",
  lead2Strong2: "障害年金（個人客戶）與外部監查人（監理支援機關客戶），不以顧問契約為前提。",
  readTitle: "這張表的讀法",
  readItems: [
    { strong: "「不包含的項目」也寫在表上。", rest: "本事務所不承辦的業務，明示轉介對象。不收取、也不支付介紹費。" },
    { strong: "採個別報價的項目有5個：", rest: "招募・錄用顧問／處遇改善加算的設計／外部監查人／30人以上的顧問費／30人以上的薪資計算。因作業量隨個案差異大，並非隱藏。" },
    { strong: "金額在著手前以書面提出。", rest: "由本表單價累加，明細一目了然。不會有開始作業後才決定金額的情況。" },
  ],
  read4Strong: "2026年8月，手續費用整體調降約3成。",
  read4Pre:
    "藉由freee人事労務與生成式AI，手續的作業變輕，因此回饋給客戶。也可選擇不委託本事務所做薪資計算，而在顧問契約範圍內接受freee內製體制的建立支援。",
  read4Link: "進行方式頁面",
  read4Post: "說明了AI用到哪裡（以及不用在哪裡）。",
  tableHead: ["服務", "單位", "含稅"],
  spUnit: "單位：",
  spPrice: "含稅：",
  sections: [
    {
      title: "顧問（諮詢）",
      lead: "顧問費是勞務諮詢的對價，諮詢不限次數與時間。把薪資計算等每月作業改為在freee上自行處理（內製）的體制建立支援，也作為諮詢的一部分包含在顧問費內。",
      note: "人數帶為參考。顧問費是諮詢的對價，將依諮詢的內容與份量報價。人數為董監事與員工的合計（含兼職人員；並非社會保險的被保險者數）。手續・薪資計算・規程製作不包含在顧問費內（如下另計）。30人以上的公司，將於了解工作實態與規程數量後個別報價。",
      rows: [
        { name: "〜4人", unit: "月額", price: "22,000日圓", value: 22000 },
        { name: "5〜9人", unit: "月額", price: "33,000日圓", value: 33000 },
        { name: "10〜14人", unit: "月額", price: "44,000日圓", value: 44000 },
        { name: "15〜19人", unit: "月額", price: "55,000日圓", value: 55000 },
        { name: "20〜24人", unit: "月額", price: "66,000日圓", value: 66000 },
        { name: "25〜29人", unit: "月額", price: "77,000日圓", value: 77000 },
        { name: "30人〜", unit: "月額", price: "個別報價" },
      ],
    },
    {
      title: "諮詢（顧問契約前）",
      note: "未簽訂顧問契約時，自第2次起收費。簽約後的諮詢包含在顧問費內。",
      rows: [
        { name: "首次諮詢", unit: "60分鐘以內", price: "免費" },
        { name: "第2次起的諮詢", unit: "每小時", price: "11,000日圓", value: 11000 },
      ],
    },
    {
      title: "薪資計算",
      lead: "以顧問客戶為對象，提供2種形式：由本事務所代行（下列費用），或接受改為在freee上自行計算（內製）的支援（包含在顧問費內）。不承接只做薪資計算的委託。",
      note: "無基本費。含獎金計算（賞与支払届的提交另計）。不含出勤打卡管理與年終調整（年終調整為稅理士的業務）。改為內製後每月結算與保險費率改定時的諮詢，也包含在顧問費內。30人以上的公司個別報價。",
      rows: [
        { name: "薪資計算（〜29人）", unit: "每人／月", price: "1,100日圓", value: 1100 },
        { name: "薪資計算（30人〜）", unit: "月額", price: "個別報價" },
        { name: "改為在freee上自行計算（內製）的支援", unit: "—", price: "包含在顧問費內" },
        { name: "住民稅 特別徵收稅額的年度更新", unit: "每人／年", price: "550日圓", value: 550 },
        { name: "住民稅 特別徵收異動届", unit: "1件", price: "個別報價" },
      ],
    },
    {
      title: "手續代行（適用）",
      note: "勞動保險的概算保險料申告書，須於保險關係成立日起50日以內提出。與新規適用一併委託時為25,300日圓。結束事業時的手續也承辦。被保險者的資格喪失届按每人另計。",
      rows: [
        { name: "社會保險 新規適用", unit: "1件", price: "20,900日圓", value: 20900 },
        { name: "勞動保險 新規適用", unit: "1件", price: "13,750日圓", value: 13750 },
        { name: "勞動保險 概算保險料申告書", unit: "1件", price: "11,550日圓", value: 11550 },
        { name: "事業所 各種變更届", unit: "1件", price: "6,050日圓", value: 6050 },
        { name: "社會保險 適用事業所全喪届", unit: "1件", price: "11,550日圓", value: 11550 },
        { name: "僱用保險 適用事業所廢止届", unit: "1件", price: "6,050日圓", value: 6050 },
        { name: "勞動保險 確定保險料申告・保險關係消滅", unit: "一式", price: "15,400日圓起" },
      ],
    },
    {
      title: "手續代行（入退社・扶養）",
      note: "按申報件數計費。入職1名同時辦理社會保險・僱用保險時為5,500日圓。",
      rows: [
        { name: "社會保險 資格取得届", unit: "每人", price: "2,750日圓", value: 2750 },
        { name: "僱用保險 資格取得届", unit: "每人", price: "2,750日圓", value: 2750 },
        { name: "社會保險 資格喪失届", unit: "每人", price: "2,750日圓", value: 2750 },
        { name: "僱用保險 資格喪失届", unit: "每人", price: "2,750日圓", value: 2750 },
        { name: "被扶養者（異動）届", unit: "每人", price: "2,750日圓", value: 2750 },
        { name: "月額變更届", unit: "1件", price: "3,850日圓", value: 3850 },
      ],
    },
    {
      title: "手續代行（年度・給付）",
      note: "算定基礎届・年度更新超過10名時，每10名加算。",
      rows: [
        { name: "社會保險 算定基礎届", unit: "一式", price: "16,500日圓起" },
        { name: "勞動保險 年度更新", unit: "一式", price: "16,500日圓起" },
        { name: "賞与支払届", unit: "1回", price: "4,400日圓起" },
        { name: "傷病手當金 申請", unit: "1件", price: "15,400日圓", value: 15400 },
        { name: "出產手當金 申請", unit: "1件", price: "15,400日圓", value: 15400 },
        { name: "育兒休業給付金", unit: "1件", price: "首次 27,500日圓／第2次起 6,600日圓起" },
      ],
    },
    {
      title: "36協定",
      note: "費用為每一事業場的製作・申報。",
      rows: [
        { name: "36協定 新規製作・申報", unit: "每一事業場", price: "22,000日圓", value: 22000 },
        { name: "附特別條款36協定 新規製作・申報", unit: "每一事業場", price: "27,500日圓", value: 27500 },
        { name: "36協定 翌年度更新", unit: "每一事業場", price: "11,000日圓", value: 11000 },
        { name: "附特別條款36協定 翌年度更新", unit: "每一事業場", price: "16,500日圓", value: 16500 },
      ],
    },
    {
      title: "規程",
      note: "本事務所製作的規程，因法令修正所需的對應（相關條文修訂與申報）包含在顧問費內，不限次數。因公司自身需要的修訂，按「工作規則 變更」收費。",
      rows: [
        { name: "工作規則 新規製作", unit: "一式", price: "88,000〜220,000日圓（依規模・規程數量而異）" },
        { name: "工作規則 變更", unit: "一式", price: "44,000日圓起" },
        { name: "薪資規程 製作", unit: "1件", price: "49,800日圓", value: 49800 },
        { name: "育兒介護休業規程 製作", unit: "1件", price: "79,800日圓", value: 79800 },
        { name: "防止騷擾規程 製作", unit: "1件", price: "11,000日圓", value: 11000 },
        { name: "員工宿舍規程 製作", unit: "1件", price: "38,500日圓", value: 38500 },
        { name: "出差旅費規程 製作", unit: "1件", price: "59,800日圓", value: 59800 },
      ],
    },
    {
      title: "加算・招募・調查",
      rows: [
        { name: "處遇改善加算 薪資要件的設計・計算支援", unit: "1件", price: "個別報價" },
        { name: "招募・錄用顧問", unit: "一式", price: "個別報價" },
        { name: "勞基署調查・改善對應", unit: "1件", price: "55,000〜110,000日圓" },
        { name: "員工說明會", unit: "1回", price: "55,000日圓", value: 55000 },
        { name: "勞工代表選出支援", unit: "—", price: "免費" },
        { name: "外國人僱用諮詢（中文對應）", unit: "—", price: "包含在顧問費內" },
      ],
    },
    {
      title: "助成金",
      note: "不收著手金。不收取、也不支付介紹費。",
      rows: [{ name: "助成金 申請代行（限顧問客戶）", unit: "一式", price: "無著手金 ＋ 成功報酬 支給額的20%" }],
    },
    {
      title: "外部監查人（監理支援機關客戶）",
      lead: "不需顧問契約。由監理支援機關直接委託。",
      note: "與本事務所擔任外部監查人之監理支援機關的關係單位，不簽訂勞務顧問契約。既有顧問客戶所加入之監理支援機關的外部監查人，亦不承接。",
      rows: [
        { name: "外部監查人 就任・定期監查", unit: "1回", price: "個別報價" },
        { name: "實地確認同行", unit: "1回", price: "包含在上述報價內" },
      ],
    },
    {
      title: "障害年金（個人客戶）",
      lead: "不需顧問契約。由本人・家屬直接委託。",
      note: "著手金・成功報酬為含稅。診斷書費等實費另計。障害年金裁定請求的代理為社會保險勞務士的業務。",
      rows: [
        { name: "障害年金 裁定請求（新規）", unit: "1件", price: "著手金 30,000日圓 ＋ 成功報酬 年金3個月分" },
        { name: "障害年金 裁定請求（含遡及請求）", unit: "1件", price: "上述 ＋ 遡及額的15%" },
        { name: "事務手續費・實費", unit: "—", price: "郵寄・診斷書費・文件取得等實費另計" },
      ],
    },
  ],
  notTitle: "本事務所不承辦的業務",
  notLead: "下列業務本事務所不承辦。我們會為您轉介具備該資格的專業人士。",
  notLeadStrong: "轉介不收取、也不支付任何介紹費。",
  notRows: [
    { name: "年終調整、扶養扣除・相當租金額・非課稅限度額等稅務判斷", to: "稅理士" },
    { name: "法人登記的變更", to: "司法書士" },
    { name: "離職理由的爭議等具紛爭性的案件", to: "律師" },
    { name: "在留資格申請文件的製作・申請取次", to: "四葉行政書士事務所（另一獨立事業體・另行簽約）" },
    { name: "處遇改善加算計畫書・實績報告書的製作與向指定權者提出", to: "四葉行政書士事務所（同上）" },
    { name: "補助金申請", to: "四葉行政書士事務所（同上）" },
    { name: "監理支援機關許可申請文件的製作", to: "四葉行政書士事務所（同上）" },
    { name: "求職者的介紹・斡旋、代辦面試、求才媒體的營運代行", to: "不承辦" },
  ],
  notNote:
    "※四葉不動產株式會社・四葉行政書士事務所・四葉社會保險勞務士事務所為各自獨立的事業體，分別承接委託。委託時依事務所分別簽約，費用・請款也分開。委託本事務所，不會成為委託其他事務所的條件。",
  faqTitle: "關於費用的常見問題",
  faqs: [
    {
      q: "顧問費包含什麼？",
      a: "勞務諮詢（不限次數・時間）、把薪資計算等改為在freee上自行處理（內製）的體制建立支援、本事務所製作之規程的法令修正對應。勞動社會保險手續、薪資計算代行、規程的新規製作不包含在內，按本表費用每次另計。",
    },
    {
      q: "freee內製化支援，具體做什麼？",
      a: "初期設定的設計（薪資項目・津貼・扣除的整理與依據）、薪資扣除勞資協定的整備、轉換期數個月的陪跑、每月結算與保險費率改定時的諮詢。全部包含在顧問費內。畫面操作的細節屬於freee官方說明・支援的範圍。",
      link: { href: "/labor/column/kyuyo-keisan-freee-naisei", label: "「內製」這個選項的內容（解說文章）" },
    },
    {
      q: "只靠freee的支援，不能內製化嗎？",
      a: "有些公司可以。freee的官方說明・支援，是功能操作方面可靠的窗口。但是，收取報酬代辦手續是社會保險勞務士的獨占業務（社會保險勞務士法第27條）；而「這個人是否成為被保險者」「這項津貼是否計入社會保險的報酬」等針對個別情況的判斷，在操作說明的範圍之外。本事務所的內製化支援承接的正是這個範圍之外——設定的設計與個別判斷。freee的支援與本事務所的支援，請視為組合，而非取代。",
    },
    {
      q: "薪資計算改為內製後，付費會怎麼變？",
      a: "自停止代行的當月起，每人每月1,100日圓的代行費不再發生，改為顧問費加freee的使用費（金額依方案而定）。顧問費是諮詢的對價，維持不變。資格取得届等手續若仍委託代行，按本表費用每次另計。",
    },
    {
      q: "代行與內製，中途可以切換嗎？",
      a: "可以，也可以從內製換回代行。設計上，負責人員入離職等狀況改變時切換即可，無論哪種形式顧問費都相同。哪種較適合，也可以從整理現況開始諮詢。",
    },
    {
      q: "為什麼內製化支援包含在顧問費內？",
      a: "本事務所的顧問費是諮詢的對價，不包含手續與薪資計算。內製的支援——設定的設計與每月判斷的諮詢——正是社會保險勞務士法第2條第1項第3號所定的諮詢・指導本身，是顧問契約中承接之諮詢的一個場景。因此不另立服務收費。",
    },
    {
      q: "可以只委託薪資計算或手續嗎？",
      a: "不承接。不伴隨諮詢而承接，可能在不了解實情的狀態下以錯誤前提處理。障害年金（個人客戶）與外部監查人（監理支援機關客戶），不以顧問契約為前提承接。",
    },
  ],
  taxNote:
    "※金額均為含稅。標示「起」「個別報價」的項目，因作業量隨個案而異，將於簽約前以書面提出個別報價。僅確定金額輸出為結構化資料（PriceSpecification）。",
  crossLead: "行政書士業務（指定申請・在留資格・補助金等）的報酬，請見四葉行政書士事務所（另一獨立事業體・獨立受任）的頁面。",
  flowPre: "委託步驟 → ",
  flowLink: "從諮詢到簽約的流程",
  authorTitle: "本文作者",
  authorBody1: " 浦松 丈二｜四葉社會保險勞務士事務所 代表 社會保險勞務士",
  authorBody2: "・行政書士（登錄號 第25087022號）・宅地建物取引士。曾任每日新聞中國總局長（記者資歷34年）。",
};

const ZH: Copy = {
  metaTitle: "费用｜四葉社会保険労務士事務所",
  metaDescription:
    "四葉社会保険労務士事務所的费用。顾问费是劳务咨询的对价，咨询不限次数与时间；劳动社会保险手续按申报件数每次另计，顾问客户亦同。工资计算可委托代行（29人以内每人每月1,100日元），或在顾问费内接受改为在freee上自行计算（内制）的体制建立支援。东京都文京区小日向・茗荷谷站步行5分钟。",
  jsonLdServiceName: "四葉社会保険労務士事務所 费用",
  bcHome: "首页",
  bcHere: "费用",
  h1: "费用",
  lead1Strong: "顾问费是劳务咨询的对价。",
  lead1Rest:
    "咨询不限次数与时间。劳动社会保险手续，顾问客户也按申报件数每次另计。把工资计算等每月作业改为在freee上自行处理（内制）的体制建立支援，包含在顾问费内。",
  lead2Strong: "不承接只办手续的委托。",
  lead2Rest:
    "不伴随咨询而只代办手续，可能在不了解实情的状态下以错误前提处理。法人・个体经营者客户，以顾问合同为前提承接。",
  lead2Strong2: "障害年金（个人客户）与外部监查人（监理支援机关客户），不以顾问合同为前提。",
  readTitle: "这张表的读法",
  readItems: [
    { strong: "「不包含的项目」也写在表上。", rest: "本事务所不承办的业务，明示介绍对象。不收取、也不支付介绍费。" },
    { strong: "采用个别报价的项目有5个：", rest: "招聘・录用顾问／处遇改善加算的设计／外部监查人／30人以上的顾问费／30人以上的工资计算。因作业量随个案差异大，并非隐藏。" },
    { strong: "金额在着手前以书面提出。", rest: "由本表单价累加，明细一目了然。不会有开始作业后才决定金额的情况。" },
  ],
  read4Strong: "2026年8月，手续费用整体下调约3成。",
  read4Pre:
    "借助freee人事労務与生成式AI，手续的作业变轻，因此回馈给客户。也可选择不委托本事务所做工资计算，而在顾问合同范围内接受freee内制体制的建立支援。",
  read4Link: "进行方式页面",
  read4Post: "说明了AI用到哪里（以及不用在哪里）。",
  tableHead: ["服务", "单位", "含税"],
  spUnit: "单位：",
  spPrice: "含税：",
  sections: [
    {
      title: "顾问（咨询）",
      lead: "顾问费是劳务咨询的对价，咨询不限次数与时间。把工资计算等每月作业改为在freee上自行处理（内制）的体制建立支援，也作为咨询的一部分包含在顾问费内。",
      note: "人数带为参考。顾问费是咨询的对价，将按咨询的内容与份量报价。人数为董事与员工的合计（含兼职人员；并非社会保险的被保险者数）。手续・工资计算・规程制作不包含在顾问费内（如下另计）。30人以上的公司，将在了解工作实态与规程数量后个别报价。",
      rows: [
        { name: "〜4人", unit: "月额", price: "22,000日元", value: 22000 },
        { name: "5〜9人", unit: "月额", price: "33,000日元", value: 33000 },
        { name: "10〜14人", unit: "月额", price: "44,000日元", value: 44000 },
        { name: "15〜19人", unit: "月额", price: "55,000日元", value: 55000 },
        { name: "20〜24人", unit: "月额", price: "66,000日元", value: 66000 },
        { name: "25〜29人", unit: "月额", price: "77,000日元", value: 77000 },
        { name: "30人〜", unit: "月额", price: "个别报价" },
      ],
    },
    {
      title: "咨询（顾问合同前）",
      note: "未签订顾问合同时，自第2次起收费。签约后的咨询包含在顾问费内。",
      rows: [
        { name: "首次咨询", unit: "60分钟以内", price: "免费" },
        { name: "第2次起的咨询", unit: "每小时", price: "11,000日元", value: 11000 },
      ],
    },
    {
      title: "工资计算",
      lead: "以顾问客户为对象，提供2种形式：由本事务所代行（下列费用），或接受改为在freee上自行计算（内制）的支援（包含在顾问费内）。不承接只做工资计算的委托。",
      note: "无基本费。含奖金计算（賞与支払届的提交另计）。不含考勤打卡管理与年终调整（年终调整为税理士的业务）。改为内制后每月结算与保险费率改定时的咨询，也包含在顾问费内。30人以上的公司个别报价。",
      rows: [
        { name: "工资计算（〜29人）", unit: "每人／月", price: "1,100日元", value: 1100 },
        { name: "工资计算（30人〜）", unit: "月额", price: "个别报价" },
        { name: "改为在freee上自行计算（内制）的支援", unit: "—", price: "包含在顾问费内" },
        { name: "住民税 特别征收税额的年度更新", unit: "每人／年", price: "550日元", value: 550 },
        { name: "住民税 特别征收异动届", unit: "1件", price: "个别报价" },
      ],
    },
    {
      title: "手续代行（适用）",
      note: "劳动保险的概算保险料申告书，须于保险关系成立日起50日以内提出。与新规适用一并委托时为25,300日元。结束事业时的手续也承办。被保险者的资格丧失届按每人另计。",
      rows: [
        { name: "社会保险 新规适用", unit: "1件", price: "20,900日元", value: 20900 },
        { name: "劳动保险 新规适用", unit: "1件", price: "13,750日元", value: 13750 },
        { name: "劳动保险 概算保险料申告书", unit: "1件", price: "11,550日元", value: 11550 },
        { name: "事业所 各种变更届", unit: "1件", price: "6,050日元", value: 6050 },
        { name: "社会保险 适用事业所全丧届", unit: "1件", price: "11,550日元", value: 11550 },
        { name: "雇用保险 适用事业所废止届", unit: "1件", price: "6,050日元", value: 6050 },
        { name: "劳动保险 确定保险料申告・保险关系消灭", unit: "一式", price: "15,400日元起" },
      ],
    },
    {
      title: "手续代行（入退社・抚养）",
      note: "按申报件数计费。入职1名同时办理社会保险・雇用保险时为5,500日元。",
      rows: [
        { name: "社会保险 资格取得届", unit: "每人", price: "2,750日元", value: 2750 },
        { name: "雇用保险 资格取得届", unit: "每人", price: "2,750日元", value: 2750 },
        { name: "社会保险 资格丧失届", unit: "每人", price: "2,750日元", value: 2750 },
        { name: "雇用保险 资格丧失届", unit: "每人", price: "2,750日元", value: 2750 },
        { name: "被抚养者（异动）届", unit: "每人", price: "2,750日元", value: 2750 },
        { name: "月额变更届", unit: "1件", price: "3,850日元", value: 3850 },
      ],
    },
    {
      title: "手续代行（年度・给付）",
      note: "算定基础届・年度更新超过10名时，每10名加算。",
      rows: [
        { name: "社会保险 算定基础届", unit: "一式", price: "16,500日元起" },
        { name: "劳动保险 年度更新", unit: "一式", price: "16,500日元起" },
        { name: "賞与支払届", unit: "1回", price: "4,400日元起" },
        { name: "伤病津贴金 申请", unit: "1件", price: "15,400日元", value: 15400 },
        { name: "生育津贴金 申请", unit: "1件", price: "15,400日元", value: 15400 },
        { name: "育儿休业给付金", unit: "1件", price: "首次 27,500日元／第2次起 6,600日元起" },
      ],
    },
    {
      title: "36协定",
      note: "费用为每一事业场的制作・申报。",
      rows: [
        { name: "36协定 新规制作・申报", unit: "每一事业场", price: "22,000日元", value: 22000 },
        { name: "附特别条款36协定 新规制作・申报", unit: "每一事业场", price: "27,500日元", value: 27500 },
        { name: "36协定 翌年度更新", unit: "每一事业场", price: "11,000日元", value: 11000 },
        { name: "附特别条款36协定 翌年度更新", unit: "每一事业场", price: "16,500日元", value: 16500 },
      ],
    },
    {
      title: "规程",
      note: "本事务所制作的规程，因法令修订所需的对应（相关条文修订与申报）包含在顾问费内，不限次数。因公司自身需要的修订，按「就业规则 变更」收费。",
      rows: [
        { name: "就业规则 新规制作", unit: "一式", price: "88,000〜220,000日元（按规模・规程数量而异）" },
        { name: "就业规则 变更", unit: "一式", price: "44,000日元起" },
        { name: "工资规程 制作", unit: "1件", price: "49,800日元", value: 49800 },
        { name: "育儿介护休业规程 制作", unit: "1件", price: "79,800日元", value: 79800 },
        { name: "防止骚扰规程 制作", unit: "1件", price: "11,000日元", value: 11000 },
        { name: "员工宿舍规程 制作", unit: "1件", price: "38,500日元", value: 38500 },
        { name: "出差旅费规程 制作", unit: "1件", price: "59,800日元", value: 59800 },
      ],
    },
    {
      title: "加算・招聘・调查",
      rows: [
        { name: "处遇改善加算 工资要件的设计・计算支援", unit: "1件", price: "个别报价" },
        { name: "招聘・录用顾问", unit: "一式", price: "个别报价" },
        { name: "劳基署调查・改善对应", unit: "1件", price: "55,000〜110,000日元" },
        { name: "员工说明会", unit: "1回", price: "55,000日元", value: 55000 },
        { name: "劳动者代表选出支援", unit: "—", price: "免费" },
        { name: "外国人雇用咨询（中文对应）", unit: "—", price: "包含在顾问费内" },
      ],
    },
    {
      title: "助成金",
      note: "不收着手金。不收取、也不支付介绍费。",
      rows: [{ name: "助成金 申请代行（限顾问客户）", unit: "一式", price: "无着手金 ＋ 成功报酬 支给额的20%" }],
    },
    {
      title: "外部监查人（监理支援机关客户）",
      lead: "不需顾问合同。由监理支援机关直接委托。",
      note: "与本事务所担任外部监查人之监理支援机关的关系单位，不签订劳务顾问合同。既有顾问客户所加入之监理支援机关的外部监查人，亦不承接。",
      rows: [
        { name: "外部监查人 就任・定期监查", unit: "1回", price: "个别报价" },
        { name: "实地确认同行", unit: "1回", price: "包含在上述报价内" },
      ],
    },
    {
      title: "障害年金（个人客户）",
      lead: "不需顾问合同。由本人・家属直接委托。",
      note: "着手金・成功报酬为含税。诊断书费等实费另计。障害年金裁定请求的代理为社会保险劳务士的业务。",
      rows: [
        { name: "障害年金 裁定请求（新规）", unit: "1件", price: "着手金 30,000日元 ＋ 成功报酬 年金3个月分" },
        { name: "障害年金 裁定请求（含追溯请求）", unit: "1件", price: "上述 ＋ 追溯额的15%" },
        { name: "事务手续费・实费", unit: "—", price: "邮寄・诊断书费・文件取得等实费另计" },
      ],
    },
  ],
  notTitle: "本事务所不承办的业务",
  notLead: "下列业务本事务所不承办。我们会为您介绍具备该资格的专业人士。",
  notLeadStrong: "介绍不收取、也不支付任何介绍费。",
  notRows: [
    { name: "年终调整、抚养扣除・相当租金额・非课税限度额等税务判断", to: "税理士" },
    { name: "法人登记的变更", to: "司法书士" },
    { name: "离职理由的争议等具纠纷性的案件", to: "律师" },
    { name: "在留资格申请文件的制作・申请取次", to: "四葉行政書士事務所（另一独立事业体・分别签约）" },
    { name: "处遇改善加算计划书・实绩报告书的制作与向指定权者提出", to: "四葉行政書士事務所（同上）" },
    { name: "补助金申请", to: "四葉行政書士事務所（同上）" },
    { name: "监理支援机关许可申请文件的制作", to: "四葉行政書士事務所（同上）" },
    { name: "求职者的介绍・斡旋、代办面试、招聘媒体的运营代行", to: "不承办" },
  ],
  notNote:
    "※四葉不動産株式会社・四葉行政書士事務所・四葉社会保険労務士事務所为各自独立的事业体，分别承接委托。委托时按事务所分别签约，费用・请款也分开。委托本事务所，不会成为委托其他事务所的条件。",
  faqTitle: "关于费用的常见问题",
  faqs: [
    {
      q: "顾问费包含什么？",
      a: "劳务咨询（不限次数・时间）、把工资计算等改为在freee上自行处理（内制）的体制建立支援、本事务所制作之规程的法令修订对应。劳动社会保险手续、工资计算代行、规程的新规制作不包含在内，按本表费用每次另计。",
    },
    {
      q: "freee内制化支援，具体做什么？",
      a: "初期设定的设计（工资项目・津贴・扣除的整理与依据）、工资扣除劳资协定的整备、转换期数个月的陪跑、每月结算与保险费率改定时的咨询。全部包含在顾问费内。画面操作的细节属于freee官方帮助・支援的范围。",
      link: { href: "/labor/column/kyuyo-keisan-freee-naisei", label: "「内制」这个选项的内容（解说文章）" },
    },
    {
      q: "只靠freee的支援，不能内制化吗？",
      a: "有些公司可以。freee的官方帮助・支援，是功能操作方面可靠的窗口。但是，收取报酬代办手续是社会保险劳务士的独占业务（社会保险劳务士法第27条）；而「这个人是否成为被保险者」「这项津贴是否计入社会保险的报酬」等针对个别情况的判断，在操作说明的范围之外。本事务所的内制化支援承接的正是这个范围之外——设定的设计与个别判断。freee的支援与本事务所的支援，请视为组合，而非取代。",
    },
    {
      q: "工资计算改为内制后，付费会怎么变？",
      a: "自停止代行的当月起，每人每月1,100日元的代行费不再发生，改为顾问费加freee的使用费（金额按方案而定）。顾问费是咨询的对价，维持不变。资格取得届等手续若仍委托代行，按本表费用每次另计。",
    },
    {
      q: "代行与内制，中途可以切换吗？",
      a: "可以，也可以从内制换回代行。设计上，负责人员入离职等状况改变时切换即可，无论哪种形式顾问费都相同。哪种更适合，也可以从整理现状开始咨询。",
    },
    {
      q: "为什么内制化支援包含在顾问费内？",
      a: "本事务所的顾问费是咨询的对价，不包含手续与工资计算。内制的支援——设定的设计与每月判断的咨询——正是社会保险劳务士法第2条第1项第3号所定的咨询・指导本身，是顾问合同中承接之咨询的一个场景。因此不另立服务收费。",
    },
    {
      q: "可以只委托工资计算或手续吗？",
      a: "不承接。不伴随咨询而承接，可能在不了解实情的状态下以错误前提处理。障害年金（个人客户）与外部监查人（监理支援机关客户），不以顾问合同为前提承接。",
    },
  ],
  taxNote:
    "※金额均为含税。标示「起」「个别报价」的项目，因作业量随个案而异，将于签约前以书面提出个别报价。仅确定金额输出为结构化数据（PriceSpecification）。",
  crossLead: "行政书士业务（指定申请・在留资格・补助金等）的报酬，请见四葉行政書士事務所（另一独立事业体・独立受任）的页面。",
  flowPre: "委托步骤 → ",
  flowLink: "从咨询到签约的流程",
  authorTitle: "本文作者",
  authorBody1: " 浦松 丈二｜四葉社会保険労務士事務所 代表 社会保险劳务士",
  authorBody2: "・行政书士（登录号 第25087022号）・宅地建物取引士。曾任每日新闻中国总局长（记者经历34年）。",
};

const COPY: Record<LangCode, Copy> = { ja: JA, en: EN, "zh-tw": ZH_TW, zh: ZH };

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? JA;
  return buildPageMetadata({
    businessKey: "labor",
    title: c.metaTitle,
    description: c.metaDescription,
    path: "/labor/ryokin",
    locale,
    absoluteTitle: true,
  });
}

function jsonLd(c: Copy) {
  const offers = c.sections.flatMap((s) =>
    s.rows
      .filter((r) => typeof r.value === "number")
      .map((r) => ({
        "@type": "Offer",
        name: `${s.title}／${r.name}`,
        priceSpecification: {
          "@type": "PriceSpecification",
          price: r.value,
          priceCurrency: "JPY",
          valueAddedTaxIncluded: true,
        },
      })),
  );
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": SITE + "/labor/ryokin#service",
        name: c.jsonLdServiceName,
        provider: { "@id": SITE + "/labor/#organization" },
        offers,
      },
      {
        "@type": "FAQPage",
        "@id": SITE + "/labor/ryokin#faq",
        mainEntity: c.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}

export default async function Page() {
  const locale = await getRequestLocale();
  const c = COPY[locale] ?? JA;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(c)) }} />
      <Breadcrumb items={[{ name: c.bcHome, href: "/labor" }, { name: c.bcHere }]} />

      <main className="mx-auto max-w-3xl px-4 pb-16">
        <header className="pt-2">
          <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">{c.h1}</h1>
          <p className="mt-3 leading-relaxed text-text">
            <strong>{c.lead1Strong}</strong>
            {c.lead1Rest}
          </p>
          <p className="mt-3 leading-relaxed text-text">
            <strong>{c.lead2Strong}</strong>
            {c.lead2Rest}
            <strong>{c.lead2Strong2}</strong>
          </p>

          <div className="mt-5 rounded-xl border border-border bg-surface p-4">
            <p className="font-medium text-ink">{c.readTitle}</p>
            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-text">
              {c.readItems.map((r) => (
                <li key={r.strong}>
                  <strong>{r.strong}</strong>
                  {r.rest}
                </li>
              ))}
              <li>
                <strong>{c.read4Strong}</strong>
                {c.read4Pre}
                <Link href={addLocalePrefix("/labor/nagare", locale)} className="text-primary underline">
                  {c.read4Link}
                </Link>
                {c.read4Post}
              </li>
            </ul>
          </div>
        </header>

        <div className="mt-6 space-y-8">
          {c.sections.map((s) => (
            <div key={s.title}>
              <h2 className="border-l-4 border-primary pl-2 font-serif text-lg font-semibold text-ink">
                {s.title}
              </h2>
              {s.lead && <p className="mt-2 text-sm leading-relaxed text-text">{s.lead}</p>}
              {/* PC＝表 */}
              <table className="mt-3 hidden w-full border-collapse text-sm sm:table">
                <thead>
                  <tr className="bg-primary-tint text-left">
                    <th className="border border-border px-3 py-2">{c.tableHead[0]}</th>
                    <th className="border border-border px-3 py-2 whitespace-nowrap">{c.tableHead[1]}</th>
                    <th className="border border-border px-3 py-2 whitespace-nowrap">{c.tableHead[2]}</th>
                  </tr>
                </thead>
                <tbody className="text-text-muted">
                  {s.rows.map((r, i) => (
                    <tr key={i}>
                      <td className="border border-border px-3 py-2 text-text">{r.name}</td>
                      <td className="border border-border px-3 py-2 whitespace-nowrap">{r.unit}</td>
                      <td className="border border-border px-3 py-2">{r.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* SP＝カード */}
              <ul className="mt-3 space-y-2 sm:hidden">
                {s.rows.map((r, i) => (
                  <li key={i} className="rounded-lg border border-border bg-surface p-3 text-sm">
                    <div className="font-medium text-ink">{r.name}</div>
                    <div className="mt-1 flex flex-wrap gap-x-3 text-text-muted">
                      <span>
                        {c.spUnit}
                        {r.unit}
                      </span>
                      <span>
                        {c.spPrice}
                        {r.price}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              {s.note && <p className="mt-2 text-xs leading-relaxed text-text-muted">※{s.note}</p>}
            </div>
          ))}
        </div>

        {/* 取り扱わない業務＝おつなぎ先の明示（分離受任） */}
        <div className="mt-10">
          <h2 className="border-l-4 border-primary pl-2 font-serif text-lg font-semibold text-ink">
            {c.notTitle}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-text">
            {c.notLead}
            <strong>{c.notLeadStrong}</strong>
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
            {c.notRows.map((n, i) => (
              <li key={i} className="rounded-lg border border-border bg-surface p-3">
                <span className="text-text">{n.name}</span>
                <span className="ml-1 text-text-muted">→ {n.to}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-text-muted">{c.notNote}</p>
        </div>

        {/* 料金QA（FAQPage JSON-LDと同一ソース） */}
        <div className="mt-10">
          <h2 className="border-l-4 border-primary pl-2 font-serif text-lg font-semibold text-ink">
            {c.faqTitle}
          </h2>
          <ul className="mt-3 space-y-3">
            {c.faqs.map((f, i) => (
              <li key={i} className="rounded-xl border border-border bg-surface p-4">
                <p className="font-medium text-ink">Q. {f.q}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-text">A. {f.a}</p>
                {f.link && (
                  <p className="mt-1.5 text-sm">
                    →{" "}
                    <Link href={addLocalePrefix(f.link.href, locale)} className="text-primary underline">
                      {f.link.label}
                    </Link>
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 text-xs leading-relaxed text-text-muted">
          {c.taxNote}
          <Placeholder reason="Notion＝社労士業務の料金（全業務・開業時最終確認）" />
        </p>

        {/* C8（→/legal/ryokin）＝開業日開通（SR_LAUNCHED） */}
        {getCrossLinks("/labor/ryokin", SR_LAUNCHED).map((cl) => (
          <CrossLinkBanner key={cl.id} link={cl} lead={c.crossLead} />
        ))}

        <p className="mt-4 text-sm">
          {c.flowPre}
          <Link href={addLocalePrefix("/labor/nagare", locale)} className="text-primary underline">
            {c.flowLink}
          </Link>
        </p>

        {/* 署名（登録番号＝9月下旬の交付まで非出力） */}
        <aside className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
          <img
            src="/staff/uramatsu-square.webp"
            alt="四葉社会保険労務士事務所 代表 浦松丈二"
            width={48}
            height={48}
            className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
          />
          <p className="text-xs leading-relaxed text-text-muted">
            <strong>{c.authorTitle}</strong>
            {c.authorBody1}
            <Placeholder reason="9月下旬確定＝社労士登録番号" />
            {c.authorBody2}
          </p>
        </aside>
      </main>

      <div className="mx-auto max-w-3xl px-4">
        <CtaBand businessKey="labor" />
      </div>
    </>
  );
}
