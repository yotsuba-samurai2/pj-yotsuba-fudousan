/**
 * 相続コラム（行政書士）シリーズ（第1号〜第15号・4言語）投入スクリプト
 *
 * 対象＝luck428.com /legal/column（business=legal）。
 * 原稿＝scripts/legal-columns/NN-*.md（ja）＋{en,zh-tw,zh}/NN-*.md（翻訳）。
 * 法令・公的資料は実装時に一次確認済み（2026-08-16）：
 *   - 文京区「【受付は午後4時まで】戸籍証明書等の広域交付」（更新日 2026年4月9日）
 *   - 法務局「法定相続情報証明制度の具体的な手続について」（更新日 2024年4月1日）
 *   - 東京法務局「相続登記が義務化されました」（更新日 2024年8月7日）
 *   - 裁判所「相続の放棄の申述」（courts.go.jp）
 *   - 国税庁「No.4205 相続税の申告と納税」（令和7年4月1日現在）
 *
 * カニバリ回避＝サイトマップ・既存legalコラム照合済み。本件は「相続の入口（戸籍収集・
 * 相続人調査）」であり、既存の台湾×相続（taiwan-legal-columns）や電子契約×委任状
 * （denshi-keiyaku）とは役割分担する。遺言は本スクリプトにはまだ追加しない（別タスク）。
 *
 * seed-denshi-keiyaku-columns.ts と同型：dry-run既定 → preview JSON、--emit-ts で
 * admin投入ページ用の seed データを生成。本番投入は /admin/columns/seed-souzoku-legal
 * の管理者セッション経由を正とする（本番環境変数がSensitive設定のため）。
 *
 * 使い方:
 *   npx tsx scripts/seed-souzoku-legal-columns.ts            # dry-run（preview JSON出力・DB接続なし）
 *   npx tsx scripts/seed-souzoku-legal-columns.ts --emit-ts  # src/lib/data/souzoku-legal-columns-seed.ts を生成
 *
 * 表示コンプライアンス＝shigyo-compliance-gate / luck428-column-seo 準拠：
 *   禁止語不使用／分離受任の明示（「独立した事業体」「別事業体」）／可否の断定なし／
 *   登記=司法書士・税務=税理士・紛争性のあるもの=弁護士を明記／紹介料を受け取らない旨を明記／
 *   執筆者経歴に禁止表現を使わない。
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, join } from "path";

type Faq = { question: string; answer: string };

type Translation = {
  title: string;
  excerpt: string;
  content: string;
  category?: string;
  faq?: Faq[];
};

type SeedColumn = {
  business: "legal";
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  status: "published";
  author: { name: string; title: string };
  keywords: string[];
  tags: string[];
  locales: string[];
  faq: Faq[];
  translations: { en: Translation; "zh-tw": Translation; zh: Translation };
};

const AUTHOR = {
  name: "浦松 丈二",
  title: "行政書士・宅地建物取引士（四葉行政書士事務所／四葉不動産株式会社）",
} as const;

const DATE = "2026-08-16";

/** 各記事が評価を集約すべきハブ（本文に必須の内部リンク）。verify() で機械検査する */
const REQUIRED_HUB_LINKS: Record<string, string[]> = {
  "souzoku-hajime-koseki-chosa-bunkyo": [
    "/legal/services/inheritance",
    "/legal/nagare",
    "/legal/ryokin",
    "/souzoku",
  ],
  "isan-bunkatsu-kyougisho": [
    "/legal/services/inheritance",
    "/legal/nagare",
    "/legal/ryokin",
    "/souzoku",
    "/legal/column/souzoku-hajime-koseki-chosa-bunkyo",
  ],
  "houtei-souzoku-jouhou-ichiran-zu": [
    "/legal/services/inheritance",
    "/legal/nagare",
    "/legal/ryokin",
    "/souzoku",
    "/legal/column/souzoku-hajime-koseki-chosa-bunkyo",
    "/legal/column/isan-bunkatsu-kyougisho",
  ],
  "jihitsu-kosei-yuigon": [
    "/legal/services/inheritance",
    "/legal/nagare",
    "/legal/ryokin",
    "/souzoku",
    "/legal/column/souzoku-hajime-koseki-chosa-bunkyo",
    "/legal/column/isan-bunkatsu-kyougisho",
  ],
  "souzoku-kaigai-gaikokuseki": [
    "/legal/services/inheritance",
    "/legal/nagare",
    "/legal/ryokin",
    "/souzoku",
    "/legal/column/souzoku-hajime-koseki-chosa-bunkyo",
    "/legal/column/isan-bunkatsu-kyougisho",
    "/legal/column/houtei-souzoku-jouhou-ichiran-zu",
    "/legal/column/jihitsu-kosei-yuigon",
    "/legal/column/taiwan-koseki-jokoseki-shutoku",
    "/legal/column/taiwan-inkan-shomei-isan-bunkatsu",
    "/legal/column/denshi-keiyaku-enpo-inin-kami",
  ],
  "souzoku-zaisan-mokuroku": [
    "/legal/services/inheritance",
    "/legal/nagare",
    "/legal/ryokin",
    "/souzoku",
    "/legal/column/souzoku-hajime-koseki-chosa-bunkyo",
    "/legal/column/isan-bunkatsu-kyougisho",
    "/legal/column/houtei-souzoku-jouhou-ichiran-zu",
  ],
  "houtei-souzoku-bun": [
    "/legal/services/inheritance",
    "/legal/nagare",
    "/legal/ryokin",
    "/souzoku",
    "/legal/column/souzoku-hajime-koseki-chosa-bunkyo",
    "/legal/column/isan-bunkatsu-kyougisho",
    "/legal/column/houtei-souzoku-jouhou-ichiran-zu",
    "/legal/column/jihitsu-kosei-yuigon",
    "/legal/column/souzoku-kaigai-gaikokuseki",
  ],
  "souzoku-kigen-matome": [
    "/legal/services/inheritance",
    "/legal/nagare",
    "/legal/ryokin",
    "/souzoku",
    "/legal/column/souzoku-hajime-koseki-chosa-bunkyo",
    "/legal/column/isan-bunkatsu-kyougisho",
    "/legal/column/houtei-souzoku-jouhou-ichiran-zu",
    "/legal/column/jihitsu-kosei-yuigon",
    "/legal/column/souzoku-kaigai-gaikokuseki",
    "/legal/column/souzoku-zaisan-mokuroku",
    "/legal/column/houtei-souzoku-bun",
  ],
  "souzoku-zei-shinkoku-hitsuyo": [
    "/legal/services/inheritance",
    "/legal/nagare",
    "/legal/ryokin",
    "/souzoku",
    "/legal/column/souzoku-hajime-koseki-chosa-bunkyo",
    "/legal/column/isan-bunkatsu-kyougisho",
    "/legal/column/souzoku-zaisan-mokuroku",
    "/legal/column/houtei-souzoku-bun",
    "/legal/column/souzoku-kigen-matome",
  ],
  "souzoku-touki-nagare": [
    "/legal/services/inheritance",
    "/legal/nagare",
    "/legal/ryokin",
    "/souzoku",
    "/legal/column/souzoku-hajime-koseki-chosa-bunkyo",
    "/legal/column/isan-bunkatsu-kyougisho",
    "/legal/column/houtei-souzoku-jouhou-ichiran-zu",
    "/legal/column/souzoku-zaisan-mokuroku",
    "/legal/column/houtei-souzoku-bun",
    "/legal/column/souzoku-kigen-matome",
    "/legal/column/souzoku-zei-shinkoku-hitsuyo",
  ],
  "souzoku-hoki-gentei-shonin": [
    "/legal/services/inheritance",
    "/legal/nagare",
    "/legal/ryokin",
    "/legal/column/souzoku-zaisan-mokuroku",
    "/legal/column/houtei-souzoku-bun",
    "/legal/column/souzoku-kigen-matome",
    "/legal/column/souzoku-touki-nagare",
  ],
  "souzoku-tochi-kokko-kizoku": [
    "/legal/services/inheritance",
    "/legal/nagare",
    "/legal/ryokin",
    "/souzoku",
    "/legal/column/souzoku-zaisan-mokuroku",
    "/legal/column/souzoku-kigen-matome",
    "/legal/column/souzoku-touki-nagare",
    "/legal/column/souzoku-hoki-gentei-shonin",
  ],
  "souzoku-tochi-kokko-hiyo-kikan": [
    "/legal/services/inheritance",
    "/legal/nagare",
    "/legal/ryokin",
    "/souzoku",
    "/legal/column/souzoku-zaisan-mokuroku",
    "/legal/column/souzoku-kigen-matome",
    "/legal/column/souzoku-touki-nagare",
    "/legal/column/souzoku-tochi-kokko-kizoku",
  ],
  "souzoku-yuigon-hakken-tetsuzuki": [
    "/legal/services/inheritance",
    "/legal/nagare",
    "/legal/ryokin",
    "/souzoku",
    "/legal/column/isan-bunkatsu-kyougisho",
    "/legal/column/jihitsu-kosei-yuigon",
    "/legal/column/souzoku-touki-nagare",
  ],
  "souzoku-tejun-checklist": [
    "/legal/services/inheritance",
    "/legal/nagare",
    "/legal/ryokin",
    "/souzoku",
    "/legal/column/souzoku-hajime-koseki-chosa-bunkyo",
    "/legal/column/isan-bunkatsu-kyougisho",
    "/legal/column/souzoku-zaisan-mokuroku",
    "/legal/column/souzoku-kigen-matome",
    "/legal/column/souzoku-zei-shinkoku-hitsuyo",
    "/legal/column/souzoku-touki-nagare",
    "/legal/column/souzoku-hoki-gentei-shonin",
    "/legal/column/souzoku-tochi-kokko-kizoku",
    "/legal/column/souzoku-yuigon-hakken-tetsuzuki",
  ],
};

/** 表示コンプライアンス上の禁止語 */
const FORBIDDEN_WORDS = ["ワンストップ", "一括対応", "一体で", "one-stop", "一気通貫"];

/** 記事ごとに必ず含めるべき表現（機械ゲート。最低限の合否判定） */
const REQUIRED_PHRASES: Record<string, string[]> = {
  "souzoku-hajime-koseki-chosa-bunkyo": [
    "courts.go.jp/saiban/syurui/syurui_kazi/kazi_06_13",
    "nta.go.jp/taxes/shiraberu/taxanswer/sozoku/4205",
    "必要な戸籍の範囲、請求先の数、手続にかけられる時間",
  ],
  "isan-bunkatsu-kyougisho": [
    "10年",
    "法定相続情報一覧図",
    "実印",
    "印鑑証明書",
    "houmukyoku.moj.go.jp/homu/page7_000014",
    "houmukyoku.moj.go.jp/sapporo/page000236",
  ],
  "houtei-souzoku-jouhou-ichiran-zu": [
    "法定相続情報証明制度",
    "相続関係説明図",
    "認証文",
    "5年",
    "遺産分割の内容",
    "法定相続情報番号",
    "法定相続情報を識別するために登記官が付す",
    "住所を証する書面",
    "被相続人の相続人（又はその相続人）",
    "自らの資格では再交付を受けることができません",
    "提出の手間を減らせるのがこの制度の利用目的",
    "houmukyoku.moj.go.jp/homu/page7_000014",
    "houmukyoku.moj.go.jp/sapporo/page000236",
  ],
  "jihitsu-kosei-yuigon": [
    "自筆証書遺言",
    "公正証書遺言",
    "押印",
    "保管証書遺言",
    "民法第968条の2",
    "未施行",
    "指定者通知",
    "関係遺言書保管通知",
    "外形的に確認",
    "2025年10月1日",
    "電磁的記録",
    "法務大臣が指定する公証人",
    "民法第1022条",
    "民法第1023条",
    "遺留分",
    "公証人手数料令",
    "50万円以下",
  ],
  "souzoku-kaigai-gaikokuseki": [
    "海外在住",
    "外国籍",
    "被相続人の本国法",
    "反致",
    "通則法第41条",
    "通則法第38条",
    "第31条",
    "第9条",
    "第58条",
    "第6条",
    "涉外民事关系法律适用法",
    "涉外民事法律適用法",
    "法定相続情報一覧図",
    "在外公館",
    "納税管理人",
    "遺言の方式の準拠法に関する法律",
    "本国官憲",
    "司法書士・管轄登記所",
  ],
  "souzoku-zaisan-mokuroku": [
    "財産目録",
    "所有不動産記録証明制度",
    "2026年2月2日",
    "登記事項証明書",
    "固定資産税納税通知書",
    "固定資産評価証明書",
    "名寄帳",
    "JICC",
    "CIC",
    "全国銀行個人信用情報センター",
    "法定相続分に応じて当然に分割",
    "売却査定・媒介",
    "都税事務所",
    "日本行政書士会連合会",
    "3か月の熟慮期間",
  ],
  "houtei-souzoku-bun": [
    "法定相続人",
    "法定相続分",
    "代襲相続",
    "再代襲",
    "半血兄弟姉妹",
    "内縁",
    "相続欠格",
    "廃除",
    "相続放棄",
    "配偶者",
    "共同相続人の相続割合について民法が定める基準",
    "相続債務",
    "法定相続分に応じて承継",
    "第887条",
    "第889条",
    "第890条",
    "第900条",
    "第901条",
  ],
  "souzoku-kigen-matome": [
    "相続人申告登記",
    "基本的な相続登記申請義務を簡易に履行する制度",
    "法定相続人全員・法定相続分を確定",
    "遺産分割成立の日から3年以内",
    "2027年3月31日",
    "相続税法第27条",
    "相続税法第33条",
    "相続の開始があったことを知った日の翌日から4か月以内",
    "遺留分侵害額請求",
    "民法第1048条",
    "民法第904条の3",
    "相続開始から10年",
    "2023年4月1日",
    "2028年4月1日",
    "10万円以下の過料",
    "独立した事業体",
  ],
  "souzoku-zei-shinkoku-hitsuyo": [
    "相続税の申告は、相続が発生した方全員に必要なわけではありません",
    "3,000万円＋600万円×法定相続人の数",
    "相続放棄をした人がいても",
    "実子がいる場合は1人まで",
    "実子がいない場合は2人まで",
    "みなし相続財産",
    "死亡保険金",
    "死亡退職金",
    "500万円×法定相続人の数",
    "暦年課税に係る贈与",
    "相続開始日によって加算対象期間が異なる",
    "2027年1月2日",
    "100万円",
    "相続時精算課税",
    "税額が0円でも申告が必要",
    "配偶者の税額軽減",
    "小規模宅地等の特例",
    "相続税の申告が必要となるケースでは",
    "申告期限後3年以内の分割見込書",
    "相続税の申告要否判定コーナー",
    "税務相談を行いません",
    "独立した事業体",
  ],
  "souzoku-touki-nagare": [
    "相続人本人が申請することもできます",
    "司法書士又は弁護士の業務",
    "相続登記申請の代理、登記申請書の作成、個別の登記申請に関する法律相談を行いません",
    "2024年4月1日",
    "3年以内",
    "遺産分割成立の日から3年以内",
    "2027年3月31日",
    "10万円以下の過料",
    "法定相続分による相続",
    "遺産分割協議による相続",
    "遺言による相続",
    "相続人申告登記",
    "法定相続分による所有権移転登記ではありません",
    "登記官の認証文が付された法定相続情報一覧図の写し",
    "法定相続情報番号",
    "所有不動産記録証明制度",
    "100％判明するわけではありません",
    "すべてオンラインで完結する",
    "不動産価額の0.4％",
    "対象は**土地**",
    "対象不動産の所在地",
    "独立した事業体",
  ],
  "souzoku-hoki-gentei-shonin": [
    "単純承認",
    "相続放棄",
    "限定承認",
    "自己のために相続の開始があったことを知った時から3か月",
    "相続によって得た財産の限度",
    "被相続人の債務及び遺贈を弁済することを留保",
    "共同相続人全員が共同して",
    "限定承認後5日以内",
    "選任後10日以内",
    "公告",
    "家庭裁判所",
    "収入印紙800円",
    "熟慮期間の伸長",
    "相当な理由がある場合",
    "司法書士又は弁護士",
    "相続財産目録",
    "譲渡があったものとみなされる",
    "独立した事業体",
  ],
  "souzoku-tochi-kokko-kizoku": [
    "相続土地国庫帰属制度",
    "相続又は相続人に対する遺贈",
    "共有者全員で共同申請する必要があります",
    "2023年4月27日",
    "戸籍事項証明書等",
    "却下事由",
    "不承認事由",
    "建物が存在する土地",
    "14,000円",
    "20万円",
    "30日以内",
    "納付した時点",
    "土地家屋調査士",
    "申請者本人が申請主体",
    "代理申請」とは表現しません",
    "国が土地を買い取る制度ではありません",
    "別事業体",
    "独立した事業体",
  ],
  "souzoku-tochi-kokko-hiyo-kikan": [
    "審査手数料",
    "負担金",
    "土地1筆につき14,000円",
    "14,000円×10＝140,000円",
    "20万円が基本",
    "10年分の標準的管理費用",
    "登記記録上の地積",
    "地積更正又は地積変更",
    "同じ種目",
    "申出により",
    "承認申請書の提出時から承認されるまで",
    "承認申請後の審査の標準処理期間は8か月",
    "8か月を超えることがあります",
    "負担金の通知が到達した日の翌日から30日以内",
    "納付した時点で土地所有権が国庫へ帰属します",
    "承認は失効します",
    "土地家屋調査士",
    "申請者本人名義の申請書・添付書類作成",
    "別事業体",
    "独立した事業体",
  ],
  "souzoku-yuigon-hakken-tetsuzuki": [
    "封印のある遺言書",
    "遅滞なく家庭裁判所へ提出し、検認を請求します",
    "5万円以下の過料",
    "検認は、遺言の有効・無効を判断する手続ではありません",
    "公正証書遺言",
    "法務局保管の自筆証書遺言",
    "秘密証書遺言",
    "遺言書保管事実証明書",
    "遺言書情報証明書",
    "民法第1022条・第1023条",
    "遺言執行者が就任した場合",
    "未成年者・破産者は遺言執行者になれません",
    "民法第1013条",
    "民法第1014条第2項",
    "検認済証明書",
    "収入印紙150円",
    "相続登記",
    "遺贈登記",
    "別事業体",
    "独立した事業体",
  ],
  "souzoku-tejun-checklist": [
    "相続が発生したらやることチェックリスト",
    "相続放棄・限定承認",
    "法定単純承認",
    "死亡の事実を知った日から7日以内",
    "自己のために相続開始があったことを知った時から原則3か月",
    "相続開始を知った日の翌日から4か月以内",
    "相続開始を知った日の翌日から10か月以内",
    "所有権を取得したことを知った日から3年以内",
    "おくやみハンドブック",
    "おくやみコーナー",
    "生命保険",
    "証券",
    "道路運送車両法第13条",
    "本人申請",
    "司法書士又は弁護士",
    "合意済み内容に基づく遺産分割協議書",
    "別事業体",
    "独立した事業体",
  ],
};

/** 記事ごとに含めてはならない表現 */
const FORBIDDEN_PHRASES: Record<string, string[]> = {
  "souzoku-hajime-koseki-chosa-bunkyo": ["トレードオフ"],
  "isan-bunkatsu-kyougisho": ["独占業務"],
  "houtei-souzoku-jouhou-ichiran-zu": [
    "戸籍の束を1枚",
    "唯一の番号",
    "印鑑登録証明書",
    "手間と取得費用",
    "相続登記は司法書士",
  ],
  "jihitsu-kosei-yuigon": [
    "いわゆるデジタル遺言",
    "順次利用可能",
    "すべての公証役場で同時に",
    "11,000円",
  ],
  "souzoku-kaigai-gaikokuseki": [
    "日本領事の署名証明",
    "台湾にも独自の反致規定",
    "台湾籍なら必ず台湾法",
  ],
  "souzoku-zaisan-mokuroku": ["売却判断"],
  "houtei-souzoku-bun": [
    "相続人の範囲・相続分の法的確定",
    "各2分の1",
  ],
  "souzoku-kigen-matome": [
    "10年を過ぎたら遺産分割できない",
    "単純にまとめないでください",
    "断定しないでください",
  ],
  "souzoku-zei-shinkoku-hitsuyo": [
    "一律7年前まで加算",
    "税金が0円＝申告不要",
    "遺産総額が基礎控除以下なら必ず申告不要",
    "借金なら全部控除",
    "葬儀関連費用なら全部控除",
    "この人は申告不要",
    "税務評価額は○円",
  ],
  "souzoku-touki-nagare": [
    "相続登記は司法書士しかできない",
    "戸籍・協議書・印鑑証明書を全部そろえればどの相続登記でも足りる",
    "すべての100万円以下の不動産が免税",
  ],
  "souzoku-hoki-gentei-shonin": [],
  "souzoku-tochi-kokko-kizoku": [],
  "souzoku-tochi-kokko-hiyo-kikan": [],
  "souzoku-yuigon-hakken-tetsuzuki": [],
  "souzoku-tejun-checklist": [],
};

/** 本セット外へ張る既存legalコラムslug（リポジトリの他シードで実在確認済み） */
const KNOWN_EXISTING_LEGAL_SLUGS = new Set([
  "taiwan-koseki-jokoseki-shutoku",
  "taiwan-inkan-shomei-isan-bunkatsu",
  "denshi-keiyaku-enpo-inin-kami",
]);

const ARTICLES: Array<{
  file: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  keywords: string[];
  tags: string[];
}> = [
  {
    file: "02-souzoku-hajime-koseki-chosa-bunkyo.md",
    slug: "souzoku-hajime-koseki-chosa-bunkyo",
    title: "相続は何から始める？文京区で進める戸籍収集・相続人調査と行政書士に頼めること",
    category: "相続の手続き（行政書士の実務から）",
    excerpt:
      "相続手続の初期段階で重要なのが、「誰が相続人か」「どんな財産があるか」を確認することです。戸籍収集と相続人調査の進め方、2024年開始の戸籍の広域交付、相続関係説明図と法定相続情報一覧図の違い、行政書士に依頼できる範囲を文京区の実務に沿って整理しました。",
    keywords: [
      "相続 戸籍 収集 行政書士",
      "相続人調査 文京区",
      "相続関係説明図 法定相続情報一覧図 違い",
      "戸籍 広域交付 代理人 対象外",
      "相続 何から始める 文京区",
      "行政書士 相続 文京区 相談",
    ],
    tags: ["相続", "戸籍", "相続人調査", "広域交付", "相続関係説明図", "法定相続情報一覧図"],
  },
  {
    file: "03-isan-bunkatsu-kyougisho.md",
    slug: "isan-bunkatsu-kyougisho",
    title: "遺産分割協議書は自分で作れる？必要書類・書き方のポイントと行政書士に頼めること",
    category: "相続の手続き（行政書士の実務から）",
    excerpt:
      "遺産分割協議書は、相続人全員が遺産の分け方について合意した内容を文書にしたものです。法定相続情報一覧図との違い、実印・印鑑証明書の使い分け、行政書士に頼める範囲と頼めないことを文京区の実務に沿って整理しました。",
    keywords: [
      "遺産分割協議書 作り方",
      "遺産分割協議書 必要書類",
      "遺産分割協議書 行政書士",
      "遺産分割協議書 印鑑証明書",
      "遺産分割協議書 相続登記",
      "遺産分割協議書 法定相続情報一覧図 違い",
    ],
    tags: ["遺産分割協議書", "相続", "印鑑証明書", "法定相続情報一覧図", "相続登記", "行政書士"],
  },
  {
    file: "04-houtei-souzoku-jouhou-ichiran-zu.md",
    slug: "houtei-souzoku-jouhou-ichiran-zu",
    title: "法定相続情報一覧図とは？戸籍一式の代わりに利用できる制度と申出のしかた",
    category: "相続の手続き（行政書士の実務から）",
    excerpt:
      "法定相続情報一覧図は、戸籍から判明する法定相続人を一覧にした図で、法定相続情報証明制度として法務局へ申出ると登記官の認証文付きの写しを交付してもらえます。相続関係説明図との違い、申出方法、5年保存・再交付、行政書士に頼める範囲を整理しました。",
    keywords: [
      "法定相続情報一覧図 とは",
      "法定相続情報証明制度",
      "法定相続情報一覧図 作り方",
      "法定相続情報一覧図 申出",
      "法定相続情報一覧図 相続関係説明図 違い",
      "法定相続情報一覧図 再交付",
    ],
    tags: ["法定相続情報一覧図", "法定相続情報証明制度", "相続", "戸籍", "相続関係説明図", "行政書士"],
  },
  {
    file: "05-jihitsu-kosei-yuigon.md",
    slug: "jihitsu-kosei-yuigon",
    title: "自筆証書遺言と公正証書遺言の違いとは？文京区で作る遺言と行政書士に頼めること",
    category: "相続の手続き（行政書士の実務から）",
    excerpt:
      "自筆証書遺言と公正証書遺言は、方式・検認の要否・費用が異なります。現行の自筆証書遺言では押印が必須であること、2020年開始の法務局保管制度、2025年の公証実務デジタル化、2026年公布で未施行の押印任意化・保管証書遺言までを文京区の実務に沿って整理しました。",
    keywords: [
      "自筆証書遺言 公正証書遺言 違い",
      "遺言 行政書士 文京区",
      "自筆証書遺言書保管制度",
      "公正証書遺言 費用",
      "保管証書遺言 未施行",
      "遺留分 遺言 無効",
    ],
    tags: ["遺言", "自筆証書遺言", "公正証書遺言", "保管証書遺言", "検認", "行政書士"],
  },
  {
    file: "06-souzoku-kaigai-gaikokuseki.md",
    slug: "souzoku-kaigai-gaikokuseki",
    title: "相続人が海外在住・外国籍の場合は？必要書類・署名証明と行政書士に頼めること",
    category: "相続の手続き（行政書士の実務から）",
    excerpt:
      "海外在住と外国籍は同じ問題ではありません。印鑑証明・署名証明・住所証明に加え、被相続人が外国籍の場合は本国法と反致が関係します。中国大陸と台湾の準拠法の違い、行政書士に頼める範囲を文京区の実務に沿って整理しました。",
    keywords: [
      "相続 海外在住 外国籍",
      "相続 本国法 反致",
      "中国 台湾 相続 準拠法 違い",
      "海外在住 相続 印鑑証明 署名証明",
      "納税管理人 海外 相続",
      "行政書士 海外相続 文京区",
    ],
    tags: ["相続", "海外在住", "外国籍", "本国法", "反致", "署名証明"],
  },
  {
    file: "07-souzoku-zaisan-mokuroku.md",
    slug: "souzoku-zaisan-mokuroku",
    title: "相続財産の調査と財産目録の作り方──何を・どう調べる？行政書士に頼めること",
    category: "相続の手続き（行政書士の実務から）",
    excerpt:
      "相続財産にはプラスとマイナスがあります。遺産分割・相続放棄・相続税の前提として、財産と債務の全体像を整理することが重要です。所有不動産記録証明制度、預貯金・借金の調べ方、財産目録の作り方と行政書士に頼める範囲を文京区の実務に沿って整理しました。",
    keywords: [
      "相続財産 調査 財産目録",
      "所有不動産記録証明制度",
      "相続 借金 調べ方 信用情報",
      "相続 財産目録 作り方",
      "行政書士 相続財産調査 文京区",
      "相続 債務 調査",
    ],
    tags: ["相続財産", "財産目録", "所有不動産記録証明制度", "相続債務", "行政書士"],
  },
  {
    file: "08-houtei-souzoku-bun.md",
    slug: "houtei-souzoku-bun",
    title: "法定相続人と相続分の基本──相続順位・代襲相続・法定相続分を整理",
    category: "相続の手続き（行政書士の実務から）",
    excerpt:
      "相続人になれる範囲と優先順位は民法で決まっています。相続順位の早見表、代襲相続・再代襲、半血兄弟姉妹の相続分、配偶者・内縁、法定相続分の基本を文京区の行政書士が整理しました。",
    keywords: [
      "法定相続人 相続順位",
      "法定相続分 計算",
      "代襲相続 再代襲",
      "半血兄弟姉妹 相続分",
      "配偶者 相続分",
      "相続 行政書士 文京区",
    ],
    tags: ["法定相続人", "法定相続分", "相続順位", "代襲相続", "行政書士"],
  },
  {
    file: "09-souzoku-kigen-matome.md",
    slug: "souzoku-kigen-matome",
    title: "相続手続きの期限まとめ──相続放棄・準確定申告・相続税・相続登記・遺留分",
    category: "相続の手続き（行政書士の実務から）",
    excerpt:
      "相続手続きには相続放棄・限定承認、準確定申告、相続税、相続登記、遺留分侵害額請求など複数の期限があります。起算点は制度ごとに異なるため、死亡日から一律には数えられません。3か月・4か月・10か月・3年・10年を軸に、各期限と行政書士に頼める範囲を文京区の実務に沿って整理しました。",
    keywords: [
      "相続 手続き 期限 まとめ",
      "相続放棄 3か月 期限",
      "準確定申告 4か月",
      "相続税 申告 期限 10か月",
      "相続登記 3年 期限",
      "遺留分侵害額請求 期限",
    ],
    tags: ["相続", "期限", "相続放棄", "準確定申告", "相続税", "相続登記", "遺留分"],
  },
  {
    file: "10-souzoku-zei-shinkoku-hitsuyo.md",
    slug: "souzoku-zei-shinkoku-hitsuyo",
    title: "相続税の申告は必要？基礎控除・10か月の期限と申告要否の考え方",
    category: "相続の手続き（行政書士の実務から）",
    excerpt:
      "相続税の申告は、相続が発生した方全員に必要なわけではありません。基礎控除「3,000万円＋600万円×法定相続人の数」を踏まえた申告要否、課税対象財産・非課税財産・債務・葬式費用・みなし相続財産・生前贈与の論点を、税理士へ相談する前に整理します。税額計算や申告要否の最終判断は税理士の領域です。",
    keywords: [
      "相続税 申告 必要か",
      "相続税 基礎控除",
      "相続税 申告 期限 10か月",
      "相続税 申告不要 税額0円",
      "相続税 配偶者 税額軽減",
      "相続税 小規模宅地等の特例",
    ],
    tags: ["相続税", "基礎控除", "申告要否", "相続税申告", "税理士", "相続"],
  },
  {
    file: "11-souzoku-touki-nagare.md",
    slug: "souzoku-touki-nagare",
    title: "相続登記はどう進める？3年ルール・必要書類・自分で申請する場合と司法書士に頼む場合",
    category: "相続の手続き（行政書士の実務から）",
    excerpt:
      "相続登記は相続人本人も申請できますが、他人から依頼を受けて行う申請代理・登記申請書等の作成・登記相談は司法書士又は弁護士の業務です。2024年開始の義務化、3年ルール、必要書類、相続人申告登記、法定相続情報一覧図の利用、申請の流れを文京区の実務に沿って整理しました。",
    keywords: [
      "相続登記 申請 流れ",
      "相続登記 必要書類",
      "相続登記 義務化 3年",
      "相続人申告登記",
      "相続登記 登録免許税",
      "相続登記 法定相続情報一覧図",
    ],
    tags: ["相続登記", "相続人申告登記", "登記申請", "法定相続情報一覧図", "司法書士", "相続"],
  },
  {
    file: "12-souzoku-hoki-gentei-shonin.md",
    slug: "souzoku-hoki-gentei-shonin",
    title: "相続放棄・限定承認を検討する前に知っておきたいこと──3か月・財産調査・手続きの流れ",
    category: "相続の手続き（行政書士の実務から）",
    excerpt:
      "相続の承認・放棄には、単純承認、相続放棄、限定承認の3つがあります。3か月の熟慮期間、相続財産の処分による単純承認、相続放棄の効果、限定承認の方式と清算手続、家庭裁判所への申述、行政書士・司法書士・弁護士・税理士の担当範囲を文京区の実務に沿って整理しました。",
    keywords: [
      "相続放棄 限定承認 違い",
      "相続放棄 3か月",
      "相続放棄 手続き 必要書類",
      "相続放棄 撤回 代襲",
      "限定承認 共同相続人",
      "相続放棄 行政書士",
    ],
    tags: ["相続放棄", "限定承認", "単純承認", "熟慮期間", "家庭裁判所", "相続"],
  },
  {
    file: "13-souzoku-tochi-kokko-kizoku.md",
    slug: "souzoku-tochi-kokko-kizoku",
    title: "不要な土地を相続したらどうする？相続土地国庫帰属制度と相続放棄の違い",
    category: "相続の手続き（行政書士の実務から）",
    excerpt:
      "相続土地国庫帰属制度は、相続等で取得した一定の土地を要件を満たしたうえで国庫へ帰属させる制度です。一方、相続放棄はその相続について初めから相続人でなかったものとされる制度です。申請できる人、引き取れない土地、費用、相続登記・売却との違い、行政書士に頼める範囲を文京区の実務に沿って整理しました。",
    keywords: [
      "相続土地国庫帰属制度",
      "相続 不要な土地",
      "相続放棄 国庫帰属 違い",
      "相続 土地 いらない",
      "国庫帰属 申請 費用",
      "相続土地国庫帰属 行政書士",
    ],
    tags: ["相続土地国庫帰属", "相続放棄", "不要な土地", "国庫帰属", "土地", "相続"],
  },
  {
    file: "14-souzoku-tochi-kokko-hiyo-kikan.md",
    slug: "souzoku-tochi-kokko-hiyo-kikan",
    title: "相続土地国庫帰属にかかる費用と期間──審査手数料・負担金・標準処理期間8か月",
    category: "相続の手続き（行政書士の実務から）",
    excerpt:
      "相続土地国庫帰属には、申請時の審査手数料と承認後の負担金があります。審査手数料は土地1筆14,000円、負担金は20万円が基本ですが土地の種目・面積で増える場合があります。標準処理期間8か月、30日以内の負担金納付、隣接土地の合算特例、申請中・承認後の土地管理までを文京区の実務に沿って整理しました。",
    keywords: [
      "相続土地国庫帰属 費用",
      "国庫帰属 審査手数料",
      "国庫帰属 負担金",
      "国庫帰属 期間 8か月",
      "国庫帰属 隣接土地 負担金",
      "国庫帰属 固定資産税",
    ],
    tags: ["相続土地国庫帰属", "国庫帰属", "費用", "期間", "負担金", "審査手数料"],
  },
  {
    file: "15-souzoku-yuigon-hakken-tetsuzuki.md",
    slug: "souzoku-yuigon-hakken-tetsuzuki",
    title: "遺言書が見つかったら？検認・遺言執行・不動産登記の流れと行政書士に頼めること",
    category: "相続の手続き（行政書士の実務から）",
    excerpt:
      "遺言書が見つかったら、まず封印の有無と種類を確認します。封印のある遺言書は家庭裁判所外で開封してはいけません。自宅保管の自筆証書遺言は原則検認が必要ですが、公正証書遺言・法務局保管の自筆証書遺言は不要です。遺言執行、遺贈登記、遺留分、行政書士に頼める範囲を文京区の実務に沿って整理しました。",
    keywords: [
      "遺言書 見つかった どうする",
      "遺言 検認 手続き",
      "自筆証書遺言 検認 必要",
      "遺言執行者 行政書士",
      "遺言 相続登記 遺贈登記",
      "法務局保管 自筆証書遺言",
    ],
    tags: ["遺言", "検認", "遺言執行者", "遺贈登記", "相続登記", "行政書士"],
  },
  {
    file: "16-souzoku-tejun-checklist.md",
    slug: "souzoku-tejun-checklist",
    title: "相続が発生したらやることチェックリスト──期限・名義変更・解約・届出を順番に整理",
    category: "相続の手続き（行政書士の実務から）",
    excerpt:
      "相続手続きは、死亡後の行政手続と相続財産の手続を分けて進めます。期限の早見表、戸籍・遺言・財産調査、銀行・保険・証券、自動車・不動産、税務、公共料金等を順番に整理し、第1号〜第14号の各論と専門家の分担へつなぐハブ記事です。",
    keywords: [
      "相続 やること チェックリスト",
      "相続 名義変更 手続き",
      "相続 銀行口座 解約",
      "相続 届出 期限",
      "相続 行政書士 司法書士 税理士",
    ],
    tags: ["相続", "チェックリスト", "名義変更", "届出", "期限", "行政書士"],
  },
];

/** Markdownリンク・強調を平文化（FAQ JSON-LD用。本文には適用しない） */
function toPlainText(md: string): string {
  return md
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .trim();
}

const FAQ_HEADINGS: Record<string, string> = {
  ja: "よくある質問",
  en: "FAQ",
  "zh-tw": "常見問題",
  zh: "常见问题",
};

/** FAQ節から **Q. …** / A. … の組をパースする（見出しはロケール別） */
function parseFaq(content: string, file: string, heading = "よくある質問"): Faq[] {
  const m = content.match(new RegExp(`## ${heading}\\n([\\s\\S]*?)(?=\\n## |$)`));
  if (!m) throw new Error(`${file}: 「## ${heading}」節が見つかりません`);
  const block = m[1];
  const faqs: Faq[] = [];
  const re = /\*\*Q\.\s*([\s\S]*?)\*\*\n(A\.\s*[\s\S]*?)(?=\n\*\*Q\.|\s*$)/g;
  let q: RegExpExecArray | null;
  while ((q = re.exec(block)) !== null) {
    faqs.push({
      question: toPlainText(q[1]),
      answer: toPlainText(q[2].replace(/^A\.\s*/, "")),
    });
  }
  if (faqs.length === 0) throw new Error(`${file}: FAQを1件もパースできません`);
  return faqs;
}

function parseFrontmatter(raw: string, label: string): { meta: Record<string, string>; body: string } {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`${label}: frontmatterが見つかりません`);
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([a-zA-Z-]+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].replace(/^"(.*)"$/, "$1").trim();
  }
  for (const key of ["title", "excerpt", "category"]) {
    if (!meta[key]) throw new Error(`${label}: frontmatterに ${key} がありません`);
  }
  return { meta, body: m[2].trim() };
}

function readTranslation(locale: "en" | "zh-tw" | "zh", file: string): Translation {
  const p = resolve(process.cwd(), "scripts", "legal-columns", locale, file);
  const { meta, body } = parseFrontmatter(readFileSync(p, "utf-8"), `${locale}/${file}`);
  return {
    title: meta.title,
    excerpt: meta.excerpt,
    category: meta.category,
    content: body,
    faq: parseFaq(body, `${locale}/${file}`, FAQ_HEADINGS[locale]),
  };
}

function buildColumns(): SeedColumn[] {
  const dir = resolve(process.cwd(), "scripts", "legal-columns");
  return ARTICLES.map((a) => {
    const content = readFileSync(join(dir, a.file), "utf-8").trim();
    const faq = parseFaq(content, a.file);
    return {
      business: "legal" as const,
      slug: a.slug,
      title: a.title,
      date: DATE,
      category: a.category,
      excerpt: a.excerpt,
      content,
      status: "published" as const,
      author: { ...AUTHOR },
      keywords: a.keywords,
      tags: a.tags,
      locales: ["ja", "en", "zh-tw", "zh"],
      faq,
      translations: {
        en: readTranslation("en", a.file),
        "zh-tw": readTranslation("zh-tw", a.file),
        zh: readTranslation("zh", a.file),
      },
    };
  });
}

function verify(cols: SeedColumn[]): string[] {
  const notes: string[] = [];
  const slugs = new Set(cols.map((c) => c.slug));
  if (slugs.size !== cols.length) notes.push("NG: slug重複あり");

  for (const c of cols) {
    if (c.faq.length !== 4) notes.push(`WARN: ${c.slug} のFAQが${c.faq.length}件（想定4件）`);
    if (c.content.length < 2000) notes.push(`WARN: ${c.slug} の本文が短い（${c.content.length}字）`);

    if (!c.content.startsWith("**結論（先に要点）**：")) {
      notes.push(`NG: ${c.slug} が「**結論（先に要点）**：」で始まっていない`);
    }

    for (const hub of REQUIRED_HUB_LINKS[c.slug] ?? []) {
      if (!c.content.includes(`](${hub})`)) notes.push(`NG: ${c.slug} に ${hub} リンクなし`);
    }

    // /legal/column/<slug> リンク＝本セット内 or 既存実在slugのみ許可
    const legalLinks = [...c.content.matchAll(/\]\(\/legal\/column\/([a-z0-9-]+)\)/g)].map((x) => x[1]);
    for (const l of legalLinks) {
      if (!slugs.has(l) && !KNOWN_EXISTING_LEGAL_SLUGS.has(l)) {
        notes.push(`NG: ${c.slug} → 不明legal slug ${l}`);
      }
    }

    for (const w of FORBIDDEN_WORDS) {
      if (c.content.includes(w)) notes.push(`NG: ${c.slug} に禁止語「${w}」あり`);
    }

    // 事業体をまたぐ言及には分離受任の明示（JA判定語）
    if (!c.content.includes("独立した事業体")) {
      notes.push(`NG: ${c.slug} に分離受任の明示（「独立した事業体」）なし`);
    }
    // 不動産側 /souzoku への導線には「別事業体」であることの明示
    if (!c.content.includes("別事業体")) {
      notes.push(`NG: ${c.slug} に /souzoku 導線の「別事業体」明示なし`);
    }
    // 各専門家は独立契約・紹介料を受け取らない旨の明示（ユーザー修正事項3）
    if (!c.content.includes("紹介料を受け取りません")) {
      notes.push(`NG: ${c.slug} に「紹介料を受け取りません」の明示なし`);
    }

    // 執筆者経歴の禁止表現（luck428-column-seo v2.9 第9条）
    if (c.content.includes("中国総局長として中国や台湾") || c.content.includes("記者歴34年")) {
      notes.push(`NG: ${c.slug} の執筆者経歴に禁止表現あり`);
    }

    if (!c.content.includes("## この記事の出典（一次情報）")) {
      notes.push(`NG: ${c.slug} に出典節なし`);
    }

    // 記事ごとの必須表現・禁止表現
    for (const phrase of REQUIRED_PHRASES[c.slug] ?? []) {
      if (!c.content.includes(phrase)) notes.push(`NG: ${c.slug} に必須表現「${phrase}」なし`);
    }
    for (const phrase of FORBIDDEN_PHRASES[c.slug] ?? []) {
      if (c.content.includes(phrase)) notes.push(`NG: ${c.slug} に禁止表現「${phrase}」あり`);
    }

    if (!c.content.includes("一般的な情報提供")) {
      notes.push(`NG: ${c.slug} に判断留保の記載なし`);
    }

    // 翻訳整合（4言語）
    const jaH2 = (c.content.match(/^## /gm) || []).length;
    for (const loc of ["en", "zh-tw", "zh"] as const) {
      const tr = c.translations[loc];
      if (!tr.title.trim() || !tr.excerpt.trim() || !tr.content.trim()) {
        notes.push(`NG: ${c.slug} ${loc} にtitle/excerpt/content欠落`);
      }
      const trH2 = (tr.content.match(/^## /gm) || []).length;
      if (trH2 !== jaH2) notes.push(`NG: ${c.slug} ${loc} のH2数不一致（${trH2}/${jaH2}）`);
      if (tr.faq && tr.faq.length !== c.faq.length) {
        notes.push(`NG: ${c.slug} ${loc} のFAQ件数不一致（${tr.faq.length}/${c.faq.length}）`);
      }
      if (/\]\(\/(?!\/)/.test(tr.content)) notes.push(`NG: ${c.slug} ${loc} に相対内部リンクあり`);
    }
    if (!c.translations.en.content.toLowerCase().includes("independent business")) {
      notes.push(`NG: ${c.slug} en に分離受任の明示なし`);
    }
    if (!c.translations["zh-tw"].content.includes("獨立的事業體")) {
      notes.push(`NG: ${c.slug} zh-tw に分離受任の明示なし`);
    }
    if (!c.translations.zh.content.includes("独立的事业体")) {
      notes.push(`NG: ${c.slug} zh に分離受任の明示なし`);
    }
  }
  return notes;
}

async function main() {
  if (process.argv.includes("--write")) {
    console.error(
      "--write は用意していません。本番投入は /admin/columns/seed-souzoku-legal（管理者セッション経由）を正とします。",
    );
    process.exit(1);
  }
  const emitTs = process.argv.includes("--emit-ts");
  const cols = buildColumns();
  const notes = verify(cols);

  if (emitTs) {
    if (notes.some((n) => n.startsWith("NG"))) {
      console.error(notes.join("\n"));
      console.error("NGがあるため中断します。");
      process.exit(1);
    }
    const out = resolve(process.cwd(), "src/lib/data/souzoku-legal-columns-seed.ts");
    const header = `// このファイルは自動生成（npx tsx scripts/seed-souzoku-legal-columns.ts --emit-ts）。直接編集しない。\n// 原稿の正本＝scripts/legal-columns/NN-*.md（ja）＋{en,zh-tw,zh}/NN-*.md（翻訳）。修正はmd側→再生成で行う。\n// 用途＝/admin/columns/seed-souzoku-legal からの管理者セッション経由バルクupsert（seed-denshi-keiyaku と同型）。\n\nexport type SouzokuLegalSeedColumn = {\n  business: "legal";\n  slug: string;\n  title: string;\n  date: string;\n  category: string;\n  excerpt: string;\n  content: string;\n  status: "published";\n  author: { name: string; title: string };\n  keywords: string[];\n  tags: string[];\n  locales: ("ja" | "en" | "zh-tw" | "zh")[];\n  faq: { question: string; answer: string }[];\n  translations: {\n    en: { title: string; excerpt: string; content: string; category?: string; faq?: { question: string; answer: string }[] };\n    "zh-tw": { title: string; excerpt: string; content: string; category?: string; faq?: { question: string; answer: string }[] };\n    zh: { title: string; excerpt: string; content: string; category?: string; faq?: { question: string; answer: string }[] };\n  };\n};\n\nexport const SOUZOKU_LEGAL_COLUMNS_SEED: SouzokuLegalSeedColumn[] = `;
    writeFileSync(out, header + JSON.stringify(cols, null, 2) + ";\n");
    console.log(`emit-ts → ${out}（${cols.length}本）`);
    return;
  }

  const preview = {
    generatedAt: new Date().toISOString(),
    note: "相続コラム（行政書士）シリーズ。原稿md（scripts/legal-columns/NN-*.md）から生成。投入は /admin/columns/seed-souzoku-legal。",
    articleCount: cols.length,
    verification: notes.length ? notes : ["OK: 全チェック通過"],
    articles: cols.map((c) => ({
      ...c,
      content: `${c.content.slice(0, 200)}…（全${c.content.length}字）`,
    })),
  };
  const out = resolve(process.cwd(), "scripts", "souzoku-legal-columns.preview.json");
  writeFileSync(out, JSON.stringify(preview, null, 2));
  console.log(`dry-run → ${out}`);
  console.log(preview.verification.join("\n"));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
