/**
 * 相続コラム（行政書士）シリーズ（第1号〜第19号・原稿ファイル 02〜20・4言語）投入スクリプト
 *
 * 対象＝luck428.com /legal/column（business=legal）。
 * 原稿＝scripts/legal-columns/NN-*.md（ja）＋{en,zh-tw,zh}/NN-*.md（翻訳）。
 * 2026-08-22追加分（19・20）の一次確認：
 *   - e-Gov 民法第4条・第7条・第10条・第11条・第15条・第25条第1項・第28条・第30条・第31条・
 *     第826条・第851条第4号・第860条・第907条第1項・第909条の2・第915条第1項・第921条第1号・第951条
 *   - e-Gov 家事事件手続法第200条第3項／民法第909条の2に規定する法務省令で定める額を定める省令
 *     （平成30年法務省令第29号＝150万円）
 *   - 法務省「民法及び家事事件手続法の一部を改正する法律について（相続法の改正）」
 *   - 裁判所「後見開始」「特別代理人選任（親権者とその子との利益相反の場合）」
 *     「成年被後見人（被保佐人、被補助人）に関する特別代理人（臨時保佐人・臨時補助人）の選任」
 *     「不在者財産管理人選任」「失踪宣告」「相続財産清算人の選任」
 *   - 一般社団法人全国銀行協会「預金相続の手続に必要な書類」ほか（いずれも参照日 2026-08-22）
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
  "sougi-go-tetsuzuki-dare-ni-soudan": [
    "/legal/services/inheritance",
    "/legal/nagare",
    "/legal/ryokin",
    "/souzoku",
    "/legal/column/souzoku-tejun-checklist",
    "/legal/column/souzoku-kigen-matome",
  ],
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
  "souzoku-iryubun-kiso": [
    "/legal/services/inheritance",
    "/legal/nagare",
    "/legal/ryokin",
    "/legal/column/jihitsu-kosei-yuigon",
    "/legal/column/houtei-souzoku-bun",
    "/legal/column/souzoku-kigen-matome",
    "/legal/column/souzoku-yuigon-hakken-tetsuzuki",
    "/legal/column/isan-bunkatsu-kyougisho",
    "/legal/column/souzoku-hoki-gentei-shonin",
    "/legal/column/souzoku-zei-shinkoku-hitsuyo",
  ],
  "souzoku-isanbunkatsu-chotei-shinpan": [
    "/legal/services/inheritance",
    "/legal/nagare",
    "/legal/ryokin",
    "/legal/column/isan-bunkatsu-kyougisho",
    "/legal/column/souzoku-iryubun-kiso",
    "/legal/column/houtei-souzoku-bun",
    "/legal/column/souzoku-kigen-matome",
    "/legal/column/souzoku-zaisan-mokuroku",
    "/legal/column/souzoku-hoki-gentei-shonin",
    "/legal/column/souzoku-touki-nagare",
  ],
  "souzoku-yochokin-karibarai": [
    "/legal/services/inheritance",
    "/legal/nagare",
    "/legal/ryokin",
    "/souzoku",
    "/legal/column/souzoku-tejun-checklist",
    "/legal/column/houtei-souzoku-bun",
    "/legal/column/isan-bunkatsu-kyougisho",
    "/legal/column/souzoku-isanbunkatsu-chotei-shinpan",
    "/legal/column/souzoku-hoki-gentei-shonin",
    "/legal/column/houtei-souzoku-jouhou-ichiran-zu",
    "/legal/column/souzoku-zaisan-mokuroku",
    "/legal/column/souzoku-zei-shinkoku-hitsuyo",
    "/legal/column/souzoku-kigen-matome",
    "/legal/column/souzoku-touki-nagare",
  ],
  "souzoku-ninchisho-yukuefumei-miseinen": [
    "/legal/services/inheritance",
    "/legal/nagare",
    "/legal/ryokin",
    "/souzoku",
    "/legal/column/souzoku-hajime-koseki-chosa-bunkyo",
    "/legal/column/houtei-souzoku-bun",
    "/legal/column/souzoku-isanbunkatsu-chotei-shinpan",
    "/legal/column/souzoku-hoki-gentei-shonin",
    "/legal/column/souzoku-kigen-matome",
    "/legal/column/souzoku-zei-shinkoku-hitsuyo",
    "/legal/column/souzoku-touki-nagare",
    "/legal/column/souzoku-yochokin-karibarai",
    "/legal/column/souzoku-zaisan-mokuroku",
  ],
  "houkago-day-jido-hattatsu-shitei-shinsei-nagare": [
    "/legal/services/shogai-fukushi",
    "/legal/nagare",
    "/legal/ryokin",
  ],
  "seikatsu-kaigo-shitei-bukken-yoken": [
    "/legal/services/shogai-fukushi",
    "/legal/nagare",
    "/legal/ryokin",
    "/legal/column/houkago-day-jido-hattatsu-shitei-shinsei-nagare",
  ],
  "souzoku-nochi-noringyoiinkai-todoke-3jo3": [
    "/legal/services/inheritance",
    "/legal/nagare",
    "/legal/ryokin",
    "/souzoku",
    "/legal/column/souzoku-touki-nagare",
    "/legal/column/souzoku-kigen-matome",
    "/legal/column/souzoku-tochi-kokko-kizoku",
    "/legal/column/souzoku-hoki-gentei-shonin",
  ],
  "sanpai-shushu-unpan-kyoka-torikata": [
    "/legal/services",
    "/legal/nagare",
    "/legal/ryokin",
  ],
  "suuji-souzoku-isanbunkatsu-kyogisho": [
    "/legal/services/inheritance",
    "/legal/nagare",
    "/legal/ryokin",
    "/souzoku",
    "/legal/column/souzoku-hajime-koseki-chosa-bunkyo",
    "/legal/column/isan-bunkatsu-kyougisho",
    "/legal/column/souzoku-touki-nagare",
    "/legal/column/souzoku-kigen-matome",
  ],
  "shinya-shurui-teikyo-todokede-yoken": [
    "/legal/services",
    "/legal/nagare",
    "/legal/ryokin",
  ],
  "kobutsusho-kyoka-eigyosho-yoken": [
    "/legal/services",
    "/legal/nagare",
    "/legal/ryokin",
  ],
  "minpaku-jutaku-shukuhaku-todokede-yoken": [
    "/legal/services",
    "/legal/nagare",
    "/legal/ryokin",
  ],
  "shigojimu-inin-keiyaku-ohitorisama": [
    "/legal/services/inheritance",
    "/legal/nagare",
    "/legal/ryokin",
    "/souzoku",
  ],
  "nochi-tenyo-4jo-5jo-kyoka-nagare": [
    "/legal/services",
    "/legal/nagare",
    "/legal/ryokin",
    "/souzoku",
    "/legal/column/souzoku-nochi-noringyoiinkai-todoke-3jo3",
    "/legal/column/souzoku-kigen-matome",
    "/legal/column/souzoku-touki-nagare",
  ],
  "kazoku-shintaku-gyosei-yakuwari-kumisei": [
    "/legal/services/inheritance",
    "/legal/nagare",
    "/legal/ryokin",
    "/souzoku",
    "/legal/column/jihitsu-kosei-yuigon",
    "/legal/column/souzoku-ninchisho-yukuefumei-miseinen",
    "/legal/column/shigojimu-inin-keiyaku-ohitorisama",
  ],
  "ippan-kamotsu-unso-kyoka-eigyosho-shako-yoken": [
    "/legal/services",
    "/legal/nagare",
    "/legal/ryokin",
  ],
  "yuigon-shikkosha-shokumu-sennin-dare": [
    "/legal/services/inheritance",
    "/legal/nagare",
    "/legal/ryokin",
    "/souzoku",
    "/legal/column/jihitsu-kosei-yuigon",
    "/legal/column/souzoku-yuigon-hakken-tetsuzuki",
  ],
};

/** 表示コンプライアンス上の禁止語 */
const FORBIDDEN_WORDS = ["ワンストップ", "一括対応", "一体で", "one-stop", "一気通貫"];

/** 記事ごとに必ず含めるべき表現（機械ゲート。最低限の合否判定） */
const REQUIRED_PHRASES: Record<string, string[]> = {
  "sougi-go-tetsuzuki-dare-ni-soudan": [
    "戸籍法第86条第1項",
    "戸籍法第87条第1項",
    "墓地、埋葬等に関する法律第5条第1項",
    "住民基本台帳法第25条",
    "健康保険法第193条第1項",
    "行政書士法第1条の3第1項",
    "第19条第1項",
    "弁護士法第72条",
    "法律上の期限は定められていません",
    "kansha-suginami.com/articles/tokyo-inheritance-gyoseishoshi/",
    "kansha-ohta.com",
    "kansha-suginami.com",
    "相互に紹介料その他の金銭の授受はありません",
    "別事業体",
    "独立した事業体",
  ],
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
  "souzoku-iryubun-kiso": [
    "遺留分",
    "兄弟姉妹",
    "直系尊属",
    "3分の1",
    "2分の1",
    "遺留分算定基礎財産",
    "民法第1046条第2項",
    "民法第1043条",
    "民法第1044条",
    "民法第1048条",
    "民法第1047条",
    "民法第1049条",
    "1年",
    "10年",
    "内容証明郵便",
    "調停申立て",
    "遺留分侵害額請求",
    "別事業体",
    "独立した事業体",
  ],
  "souzoku-isanbunkatsu-chotei-shinpan": [
    "遺産分割調停",
    "遺産分割審判",
    "民法第907条",
    "本人による申立ても可能です",
    "共同相続人や包括受遺者",
    "自動的に遺産分割審判手続が開始されます",
    "遺留分侵害額請求調停",
    "最初から審判を申し立てることも可能",
    "即時抗告",
    "2週間以内",
    "遺産を探し出すこと自体を目的とした手続ではありません",
    "遺産に関する紛争調整調停",
    "不動産鑑定士",
    "鑑定費用",
    "相続放棄",
    "10年",
    "別事業体",
    "独立した事業体",
  ],
  "souzoku-yochokin-karibarai": [
    "民法第909条の2",
    "相続開始の時の債権額の3分の1",
    "同一の金融機関に対する権利行使は150万円が限度",
    "預貯金債権の債務者ごとに法務省令で定める額を限度とする",
    "遺産の一部の分割によりこれを取得したものとみなす",
    "平成30年法律第72号",
    "2019年7月1日",
    "平成30年法務省令第29号",
    "家事事件手続法第200条第3項",
    "他の共同相続人の利益を害するときは、この限りでない",
    "民法第921条第1号",
    "法定単純承認",
    "民法第915条第1項",
    "金融機関ごとに必要書類が異なります",
    "当事務所は払戻しの可否を保証しません",
    "税務相談を行いません",
    "別事業体",
    "独立した事業体",
  ],
  "souzoku-ninchisho-yukuefumei-miseinen": [
    "民法第907条第1項",
    "民法第4条",
    "民法第7条",
    "民法第11条",
    "民法第15条",
    "民法第10条",
    "民法第25条第1項",
    "民法第28条",
    "民法第30条",
    "民法第31条",
    "民法第826条第1項",
    "民法第826条第2項",
    "民法第851条第4号",
    "民法第860条",
    "民法第915条第1項",
    "民法第951条",
    "権限外行為許可",
    "特別代理人",
    "不在者財産管理人",
    "失踪宣告",
    "相続財産清算人",
    "収入印紙800円分",
    "収入印紙2,600円分",
    "官報公告料5,298円",
    "官報公告料5,582円",
    "本記事では期間の目安を示しません",
    "別事業体",
    "独立した事業体",
  ],
  "houkago-day-jido-hattatsu-shitei-shinsei-nagare": [
    "児童福祉法第21条の5の3",
    "指定通所支援",
    "都道府県知事",
    "児童発達支援",
    "放課後等デイサービス",
    "平成24年厚生労働省令第15号",
    "児童発達支援管理責任者",
    "常勤換算",
    "事前協議",
    "指導訓練室",
    "紹介料を受け取りません",
    "別事業体",
    "独立した事業体",
  ],
  "seikatsu-kaigo-shitei-bukken-yoken": [
    "障害者の日常生活及び社会生活を総合的に支援するための法律",
    "第5条第7項",
    "第36条",
    "第43条",
    "平成18年厚生労働省令第171号",
    "平均障害支援区分",
    "利用者の数を6で除した数以上",
    "サービス管理責任者",
    "利用定員20人以上",
    "建築基準法第87条第1項",
    "第6条第1項第一号",
    "200㎡",
    "令和元年6月25日",
    "児童福祉施設等",
    "消防法施行令別表第一",
    "事前協議",
    "紹介料を受け取りません",
    "別事業体",
    "独立した事業体",
  ],
  "souzoku-nochi-noringyoiinkai-todoke-3jo3": [
    "農地法第3条の3",
    "農業委員会",
    "おおむね10か月以内",
    "10万円以下の過料",
    "権利取得の効力を発生させるものではありません",
    "現況で判断",
    "不動産登記法第76条の2",
    "3年以内",
    "2024年4月1日",
    "農地法第3条",
    "紹介料を受け取りません",
    "別事業体",
    "独立した事業体",
  ],
  "sanpai-shushu-unpan-kyoka-torikata": [
    "廃棄物の処理及び清掃に関する法律",
    "第14条第1項",
    "都道府県知事の許可",
    "第14条第5項",
    "第14条第5項第2号",
    "第7条第5項第4号",
    "欠格要件",
    "拘禁刑以上の刑",
    "公益財団法人日本産業廃棄物処理振興センター",
    "自社運搬",
    "積替え保管",
    "積卸しを行う区域",
    "5年ごと",
    "優良産廃処理業者認定制度",
    "紹介料を受け取りません",
    "別事業体",
    "独立した事業体",
  ],
  "suuji-souzoku-isanbunkatsu-kyogisho": [
    "数次相続",
    "代襲相続",
    "民法第887条第2項",
    "民法第896条",
    "民法第898条",
    "民法第907条",
    "相続人兼被相続人",
    "中間省略",
    "単独相続",
    "昭和30年12月16日民事甲第2670号",
    "平成29年3月30日法務省民二第237号",
    "不動産登記法第76条の2",
    "2024年4月1日",
    "3年以内",
    "相続人申告登記",
    "紹介料を受け取りません",
    "別事業体",
    "独立した事業体",
  ],
  "shinya-shurui-teikyo-todokede-yoken": [
    "風俗営業等の規制及び業務の適正化等に関する法律",
    "第33条第1項",
    "第33条第4項",
    "第2条第13項第4号",
    "午前0時から午前6時",
    "10日前",
    "公安委員会",
    "所轄警察署",
    "住居系用途地域",
    "9.5㎡以上",
    "20ルクス",
    "飲食店営業許可",
    "食品衛生法",
    "紹介料を受け取りません",
    "別事業体",
    "独立した事業体",
  ],
  "kobutsusho-kyoka-eigyosho-yoken": [
    "古物営業法",
    "第3条第1項",
    "都道府県公安委員会",
    "第4条",
    "第5条第1項第6号",
    "第13条第1項",
    "管理者",
    "使用承諾",
    "19,000円",
    "40日",
    "拘禁刑以上の刑",
    "2025年6月1日",
    "所轄警察署",
    "紹介料を受け取りません",
    "別事業体",
    "独立した事業体",
  ],
  "minpaku-jutaku-shukuhaku-todokede-yoken": [
    "住宅宿泊事業法",
    "平成29年法律第65号",
    "第3条第1項",
    "第2条第3項",
    "第13条",
    "第18条",
    "第11条",
    "旅館業法",
    "180日",
    "宿泊者名簿",
    "住宅宿泊管理業者",
    "都道府県知事",
    "消防法令適合通知書",
    "管理規約",
    "紹介料を受け取りません",
    "別事業体",
    "独立した事業体",
  ],
  "shigojimu-inin-keiyaku-ohitorisama": [
    "死後事務委任契約",
    "民法第643条",
    "民法第653条第1号",
    "最判平成4年9月22日",
    "任意規定",
    "任意後見契約に関する法律",
    "第3条",
    "公正証書",
    "遺言",
    "相続登記は司法書士又は弁護士",
    "紹介料を受け取りません",
    "別事業体",
    "独立した事業体",
  ],
  "nochi-tenyo-4jo-5jo-kyoka-nagare": [
    "農地法",
    "第4条第1項第7号",
    "第5条第1項第6号",
    "市街化区域",
    "市街化調整区域",
    "農業委員会",
    "都道府県知事",
    "農地法第2条第1項",
    "第64条",
    "第67条",
    "紹介料を受け取りません",
    "別事業体",
    "独立した事業体",
  ],
  "kazoku-shintaku-gyosei-yakuwari-kumisei": [
    "信託法",
    "平成18年法律第108号",
    "2007年9月30日",
    "信託法第3条",
    "信託法第4条第3項",
    "信託法第91条",
    "不動産登記法第98条",
    "相続税法第9条の2",
    "公正証書",
    "自益信託",
    "受益者等課税信託",
    "紹介料を受け取りません",
    "別事業体",
    "独立した事業体",
  ],
  "ippan-kamotsu-unso-kyoka-eigyosho-shako-yoken": [
    "貨物自動車運送事業法",
    "第3条",
    "第6条",
    "第5条",
    "5両",
    "50センチメートル",
    "2.5㎡",
    "標準処理期間",
    "車両制限令",
    "運輸支局",
    "緑ナンバー",
    "紹介料を受け取りません",
    "別事業体",
    "独立した事業体",
  ],
  "yuigon-shikkosha-shokumu-sennin-dare": [
    "遺言執行者",
    "民法第1006条",
    "民法第1007条",
    "民法第1010条",
    "民法第1012条",
    "民法第1013条",
    "民法第1014条",
    "民法第1016条",
    "特定財産承継遺言",
    "検認",
    "民法第1004条",
    "家事事件手続法",
    "紹介料を受け取りません",
    "別事業体",
    "独立した事業体",
  ],
};

/** 記事ごとに含めてはならない表現 */
const FORBIDDEN_PHRASES: Record<string, string[]> = {
  "sougi-go-tetsuzuki-dare-ni-soudan": [
    "期限の定められた手続き",
    "提携",
    "葬儀のご相談も承ります",
  ],
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
  "souzoku-iryubun-kiso": [],
  "souzoku-isanbunkatsu-chotei-shinpan": [],
  "souzoku-yochokin-karibarai": [],
  "souzoku-ninchisho-yukuefumei-miseinen": [],
  "houkago-day-jido-hattatsu-shitei-shinsei-nagare": [],
  "seikatsu-kaigo-shitei-bukken-yoken": [],
  "souzoku-nochi-noringyoiinkai-todoke-3jo3": [],
  "sanpai-shushu-unpan-kyoka-torikata": [],
  "suuji-souzoku-isanbunkatsu-kyogisho": [],
  "shinya-shurui-teikyo-todokede-yoken": [],
  "kobutsusho-kyoka-eigyosho-yoken": [],
  "minpaku-jutaku-shukuhaku-todokede-yoken": [],
  "shigojimu-inin-keiyaku-ohitorisama": [],
  "nochi-tenyo-4jo-5jo-kyoka-nagare": [],
  "kazoku-shintaku-gyosei-yakuwari-kumisei": [],
  "ippan-kamotsu-unso-kyoka-eigyosho-shako-yoken": [],
  "yuigon-shikkosha-shokumu-sennin-dare": [],
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
  /** 記事ごとの公開日。省略時は DATE（シリーズ既定日） */
  date?: string;
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
  {
    file: "17-souzoku-iryubun-kiso.md",
    slug: "souzoku-iryubun-kiso",
    title: "遺留分とは？対象となる相続人・割合・1年の期限と遺留分侵害額請求",
    category: "相続の手続き（行政書士の実務から）",
    excerpt:
      "遺留分は、兄弟姉妹以外の一定の相続人について法律上保障される最低限の利益です。2019年7月1日以後開始の相続では、遺留分侵害額に相当する金銭の支払を請求する制度となります。遺留分権利者、割合、算定基礎、生前贈与、1年・10年の期間、行政書士に頼める範囲を文京区の実務に沿って整理しました。",
    keywords: [
      "遺留分 とは",
      "遺留分 相続人 割合",
      "遺留分侵害額請求",
      "遺留分 期限 1年",
      "遺留分 行政書士",
      "遺留分 遺言 無効",
    ],
    tags: ["遺留分", "遺留分侵害額請求", "相続分", "遺言", "相続", "行政書士"],
  },
  {
    file: "18-souzoku-isanbunkatsu-chotei-shinpan.md",
    slug: "souzoku-isanbunkatsu-chotei-shinpan",
    title: "相続人の意見がまとまらないときは？遺産分割調停・審判の流れと弁護士に相談するタイミング",
    category: "相続の手続き（行政書士の実務から）",
    excerpt:
      "共同相続人間で遺産分割協議が調わない、又は協議できない場合、家庭裁判所の遺産分割調停又は審判を利用できます。調停は合意を目指す話合いの手続で、不成立になると自動的に遺産分割審判手続が開始されます。管轄、費用、必要書類、弁護士へ相談するタイミングと行政書士に頼める範囲を文京区の実務に沿って整理しました。",
    keywords: [
      "相続人 意見がまとまらない",
      "遺産分割調停 手続き",
      "遺産分割審判",
      "遺産分割調停 不成立",
      "相続 弁護士 相談 タイミング",
      "遺産分割 行政書士",
    ],
    tags: ["遺産分割調停", "遺産分割審判", "相続紛争", "家庭裁判所", "弁護士", "相続"],
  },
  {
    file: "19-souzoku-yochokin-karibarai.md",
    slug: "souzoku-yochokin-karibarai",
    title: "亡くなった人の預貯金はいつ引き出せる？遺産分割前の払戻し制度と銀行手続の進め方",
    category: "相続の手続き（行政書士の実務から）",
    excerpt:
      "金融機関が預金者の死亡を確認すると、その口座からの入出金は停止される取扱いが一般的です。2019年7月1日以後は、遺産分割の前でも各共同相続人が単独で払戻しを受けられる制度があります（民法第909条の2）。計算方法と150万円の限度、家庭裁判所の保全処分との違い、必要書類、相続放棄との関係、行政書士に頼める範囲を文京区の実務に沿って整理しました。",
    keywords: [
      "亡くなった人 預貯金 引き出し",
      "相続 預金 仮払い 150万円",
      "遺産分割前 払戻し制度 必要書類",
      "口座凍結 葬儀費用",
      "民法909条の2 上限",
      "相続 預金 行政書士 文京区",
    ],
    tags: ["相続預貯金", "払戻し制度", "民法第909条の2", "口座凍結", "葬儀費用", "行政書士"],
  },
  {
    file: "20-souzoku-ninchisho-yukuefumei-miseinen.md",
    slug: "souzoku-ninchisho-yukuefumei-miseinen",
    title:
      "相続人に認知症の方・行方不明の方・未成年者がいるときは？成年後見・不在者財産管理人・特別代理人の使い分け",
    category: "相続の手続き（行政書士の実務から）",
    excerpt:
      "遺産分割の協議は共同相続人が当事者となる手続です。相続人の中に判断能力が不十分な方、行方不明の方、未成年者がいる場合、その方を欠いたまま協議を進めることはできません。後見・保佐・補助、不在者財産管理人、失踪宣告、特別代理人の根拠条文と実費、期限との関係、行政書士に頼める範囲を文京区の実務に沿って整理しました。",
    keywords: [
      "相続人 認知症 遺産分割協議",
      "相続人 行方不明 遺産分割",
      "未成年 相続 特別代理人",
      "不在者財産管理人 権限外行為許可",
      "失踪宣告 7年",
      "成年後見 申立て 費用",
    ],
    tags: [
      "遺産分割協議",
      "成年後見",
      "不在者財産管理人",
      "失踪宣告",
      "特別代理人",
      "家庭裁判所",
    ],
  },
  {
    file: "21-houkago-day-jido-hattatsu-shitei-shinsei-nagare.md",
    slug: "houkago-day-jido-hattatsu-shitei-shinsei-nagare",
    title:
      "放課後等デイサービス・児童発達支援の指定申請の流れと必要書類──物件・労務・税務は誰に頼むか",
    category: "障害福祉の許認可（行政書士の実務から）",
    excerpt:
      "放課後等デイサービスと児童発達支援は、児童福祉法にもとづく障害児通所支援で、開業には指定通所支援事業者の指定（第21条の5の3）が必要です。指定権者・スケジュール・人員基準・設備基準・事前協議・必要書類の流れと、物件は不動産、労務は社会保険労務士、税務は税理士へ分離受任で振る分担を整理しました。",
    keywords: [
      "放課後等デイサービス 指定申請 流れ",
      "児童発達支援 指定申請 必要書類",
      "障害児通所支援 指定 児童福祉法",
      "児童発達支援管理責任者 人員基準",
      "指定通所支援 事前協議",
      "放課後等デイ 開業 行政書士",
    ],
    tags: [
      "放課後等デイサービス",
      "児童発達支援",
      "指定申請",
      "障害児通所支援",
      "人員基準",
      "行政書士",
    ],
  },
  {
    file: "22-souzoku-nochi-noringyoiinkai-todoke-3jo3.md",
    slug: "souzoku-nochi-noringyoiinkai-todoke-3jo3",
    title: "相続した農地は農業委員会へ届出が要る──農地法3条の3の手続きと必要書類",
    category: "相続の手続き（行政書士の実務から）",
    excerpt:
      "農地を相続したら、通常の相続手続とは別に、農業委員会への届出（農地法第3条の3）が必要です。相続・遺産分割・包括遺贈などで農地の権利を取得した人が、知った時点からおおむね10か月以内に届け出ます。期限・書類・怠った場合の過料、相続登記（不動産登記法第76条の2）・相続税・売却との順番と分離受任の分担を整理しました。",
    keywords: [
      "農地 相続 農業委員会 届出",
      "農地法 3条の3 届出",
      "相続 農地 10か月 過料",
      "農地 相続 登記 順番",
      "農地 相続 売る 貸す 転用",
      "農地 相続 行政書士",
    ],
    tags: [
      "農地相続",
      "農地法第3条の3",
      "農業委員会",
      "相続登記",
      "農地転用",
      "行政書士",
    ],
  },
  {
    file: "23-seikatsu-kaigo-shitei-bukken-yoken.md",
    slug: "seikatsu-kaigo-shitei-bukken-yoken",
    title:
      "生活介護（障害福祉）の指定を受けるとき、物件は何を満たすのか──面積・設備・用途変更・消防と分離受任",
    category: "障害福祉の許認可（行政書士の実務から）",
    excerpt:
      "生活介護は障害者総合支援法第5条第7項の障害福祉サービスで、開業には都道府県知事等からの指定（同法第36条）が必要です。人員・設備基準（平成18年厚生労働省令第171号）、用途変更確認申請が要る規模（建築基準法第87条・床面積200㎡超）、消防の区分、指定申請と事前協議の順序を整理し、用途変更・設計は建築士、消防は消防署、労務は社会保険労務士、登記は司法書士、税務は税理士へ分離受任で振る分担を示しました。",
    keywords: [
      "生活介護 指定申請 物件 要件",
      "生活介護 人員基準 設備基準",
      "生活介護 用途変更 確認申請 200㎡",
      "障害福祉サービス 指定 物件 面積",
      "生活介護 事前協議 必要書類",
      "生活介護 開業 行政書士",
    ],
    tags: [
      "生活介護",
      "障害福祉サービス",
      "指定申請",
      "用途変更",
      "設備基準",
      "行政書士",
    ],
  },
  {
    file: "24-sougi-go-tetsuzuki-dare-ni-soudan.md",
    slug: "sougi-go-tetsuzuki-dare-ni-soudan",
    date: "2026-08-25",
    title:
      "葬儀のあとの手続きは誰に相談する？──葬儀社・区役所・行政書士の役割分担と7日・14日・2年の期限",
    category: "相続の手続き（行政書士の実務から）",
    excerpt:
      "葬儀のあとの手続きは、場面ごとに窓口が分かれます。葬儀の手配は葬儀社、死亡届の受理・火葬許可証の交付・世帯変更届・葬祭費は市区町村の窓口、相続の書類作成は行政書士の領域です。死亡届7日（戸籍法第86条第1項）、世帯変更届14日（住民基本台帳法第25条）、葬祭費・埋葬料2年（健康保険法第193条第1項）という葬儀直後の期限と、遺産分割協議書の作成・預貯金の名義変更のように法律上の期限が定められていない手続きを切り分けて整理しました。",
    keywords: [
      "葬儀後 手続き 誰に相談",
      "葬儀社 相続 相談 どこまで",
      "死亡届 7日以内 届出人",
      "世帯変更届 14日 世帯主 死亡",
      "葬祭費 埋葬料 2年 期限",
      "葬儀後 相続 行政書士 文京区",
    ],
    tags: [
      "葬儀後の手続き",
      "死亡届",
      "火葬許可証",
      "世帯変更届",
      "葬祭費",
      "埋葬料",
      "行政書士",
    ],
  },
  {
    file: "25-sanpai-shushu-unpan-kyoka-torikata.md",
    slug: "sanpai-shushu-unpan-kyoka-torikata",
    date: "2026-08-25",
    title:
      "産業廃棄物収集運搬業の許可はどう取る？──欠格要件・講習・車庫の要件と分離受任",
    category: "許認可の手続き（行政書士の実務から）",
    excerpt:
      "建設・解体・運送から産廃運搬に事業を広げるには、廃棄物処理法第14条にもとづく都道府県知事の許可が必要です。施設・能力の基準と欠格要件（第14条第5項・第7条第5項第4号）、JWセンターの講習、積替え保管と車庫の要件、都道府県ごとの許可と5年ごとの更新を整理し、物件は不動産、登記は司法書士、労務は社会保険労務士へ分離受任で振る分担を示しました。",
    keywords: [
      "産業廃棄物収集運搬業 許可 取り方",
      "産廃 収集運搬業 欠格要件",
      "産廃 収集運搬 講習会 JWセンター",
      "産廃 収集運搬 積替え保管 車庫",
      "産廃 収集運搬業 許可 都道府県 更新",
      "産廃 収集運搬 許可 行政書士",
    ],
    tags: [
      "産業廃棄物収集運搬業",
      "許認可",
      "欠格要件",
      "廃棄物処理法",
      "積替え保管",
      "行政書士",
    ],
  },
  {
    file: "26-suuji-souzoku-isanbunkatsu-kyogisho.md",
    slug: "suuji-souzoku-isanbunkatsu-kyogisho",
    date: "2026-08-25",
    title:
      "祖父名義のままの不動産、遺産分割協議書はどう書く？──数次相続の実務",
    category: "相続の手続き（行政書士の実務から）",
    excerpt:
      "登記が何代も放置され、祖父名義のままの不動産は「数次相続」として扱います。代襲相続との違い、協議書に署名する当事者（相続人兼被相続人）、中間の相続を1枚にまとめられるか、中間省略登記の可否、集める戸籍の範囲、相続登記の義務化（不動産登記法第76条の2）と相続税を整理し、登記は司法書士、税務は税理士、紛争は弁護士へ分離受任で振る分担を示しました。",
    keywords: [
      "数次相続 遺産分割協議書 書き方",
      "祖父名義 不動産 相続 放置",
      "数次相続 代襲相続 違い",
      "数次相続 中間省略登記",
      "相続人兼被相続人 協議書",
      "数次相続 戸籍 どこまで",
    ],
    tags: [
      "数次相続",
      "遺産分割協議書",
      "代襲相続",
      "中間省略登記",
      "相続登記",
      "行政書士",
    ],
  },
  {
    file: "27-shinya-shurui-teikyo-todokede-yoken.md",
    slug: "shinya-shurui-teikyo-todokede-yoken",
    date: "2026-08-26",
    title:
      "深夜0時以降にお酒を出す店、届出は何がいる？──深夜酒類提供飲食店営業の届出・用途地域・営業所の要件",
    category: "許認可の手続き（行政書士の実務から）",
    excerpt:
      "バーや居酒屋を午前0時以降に営業してお酒をメインに提供するには、風営法第33条第1項にもとづく「深夜における酒類提供飲食店営業」の開始届出が必要です。届出先（公安委員会・所轄警察署）と営業開始10日前までの提出、住居系用途地域での営業制限、客室9.5㎡・照度20ルクスなどの営業所の構造設備基準、飲食店営業許可（食品衛生法）や賃貸借との役割分担を整理し、届出は行政書士、物件は不動産、飲食店営業許可は保健所へ分離受任で振る分担を示しました。",
    keywords: [
      "深夜酒類提供飲食店営業 届出",
      "深夜 0時以降 酒 届出 必要",
      "深夜酒類 営業 用途地域 制限",
      "深夜酒類提供飲食店 営業所 構造設備 平面図",
      "深夜酒類提供 飲食店営業許可 違い",
      "深夜酒類提供飲食店営業 行政書士",
    ],
    tags: [
      "深夜酒類提供飲食店営業",
      "風営法",
      "許認可",
      "用途地域",
      "飲食店営業許可",
      "行政書士",
    ],
  },
  {
    file: "28-kobutsusho-kyoka-eigyosho-yoken.md",
    slug: "kobutsusho-kyoka-eigyosho-yoken",
    date: "2026-08-26",
    title:
      "古物商許可、営業所には何が必要？──営業所要件・使用承諾・管理者・URL届出の申請実務",
    category: "許認可の手続き（行政書士の実務から）",
    excerpt:
      "中古品売買・リユース・中古車販売などで開業するには、古物営業法第3条第1項にもとづく都道府県公安委員会の古物商許可が必要です。営業所として認められる物件、賃貸物件の賃貸借契約書の写しと使用承諾、営業所ごとの管理者の選任（第13条第1項）、ホームページ利用取引のURL届出（第5条第1項第6号）、手数料19,000円・標準処理期間40日を整理し、許可申請は行政書士、物件の賃貸借・使用承諾は不動産、法人設立登記は司法書士へ分離受任で振る分担を示しました。",
    keywords: [
      "古物商許可 営業所 要件",
      "古物商許可 賃貸 使用承諾書",
      "古物商許可 管理者 選任",
      "古物商許可 URL 届出 ホームページ",
      "古物商許可 手数料 19000円 期間 40日",
      "古物商許可 申請 行政書士",
    ],
    tags: [
      "古物商許可",
      "古物営業法",
      "許認可",
      "営業所要件",
      "使用承諾",
      "行政書士",
    ],
  },
  {
    file: "29-minpaku-jutaku-shukuhaku-todokede-yoken.md",
    slug: "minpaku-jutaku-shukuhaku-todokede-yoken",
    date: "2026-08-27",
    title:
      "民泊を始めるには何が必要？──住宅宿泊事業法の届出と旅館業許可の違い・180日規制・消防・管理規約",
    category: "許認可の手続き（行政書士の実務から）",
    excerpt:
      "自宅や所有する住宅で民泊（住宅宿泊事業）を始めるには、住宅宿泊事業法第3条第1項にもとづく都道府県知事等への届出が必要です。旅館業法の許可との違い、年間180日の上限と第18条の上乗せ条例、消防法令適合通知書などの添付書類、家主不在型での住宅宿泊管理業者への委託、分譲マンションの管理規約や賃貸借の確認を整理し、届出は行政書士、物件の適合判断は不動産、消防は消防署・消防設備士、旅館業許可が要る場合の建築確認は建築士へ分離受任で振る分担を示しました。",
    keywords: [
      "民泊 始める 届出 必要",
      "住宅宿泊事業法 届出 旅館業法 違い",
      "民泊 180日 上乗せ条例",
      "民泊 消防法令適合通知書 添付書類",
      "民泊 分譲マンション 管理規約 賃貸借",
      "住宅宿泊事業 届出 行政書士",
    ],
    tags: [
      "民泊",
      "住宅宿泊事業法",
      "許認可",
      "旅館業法",
      "消防法令適合通知書",
      "行政書士",
    ],
  },
  {
    file: "30-shigojimu-inin-keiyaku-ohitorisama.md",
    slug: "shigojimu-inin-keiyaku-ohitorisama",
    date: "2026-08-27",
    title:
      "死後事務委任契約とは何を頼める契約？──おひとりさまの生前の備え・遺言・任意後見との違い",
    category: "相続の手続き（行政書士の実務から）",
    excerpt:
      "死後事務委任契約は、葬儀・納骨・行政手続・契約解約など自分の死後の事務を、生前に信頼できる相手へ委任しておく契約です。委任は委任者の死亡で終了するのが原則（民法第653条第1号）ですが、この規定は任意規定で、死亡後も終了させない特約は有効とされます（最判平成4年9月22日）。頼める事務の範囲、遺言・任意後見との違い、公正証書や費用の預託、相続登記は司法書士・税務は税理士・紛争は弁護士へ振る分離受任を整理しました。",
    keywords: [
      "死後事務委任契約 とは 何を頼める",
      "死後事務委任契約 遺言 任意後見 違い",
      "おひとりさま 死後 手続き 備え",
      "死後事務委任契約 公正証書 費用 預託",
      "死後事務委任契約 民法653条 特約 有効",
      "死後事務委任契約 行政書士",
    ],
    tags: [
      "死後事務委任契約",
      "任意後見",
      "遺言",
      "おひとりさま",
      "相続",
      "行政書士",
    ],
  },
  {
    file: "31-nochi-tenyo-4jo-5jo-kyoka-nagare.md",
    slug: "nochi-tenyo-4jo-5jo-kyoka-nagare",
    date: "2026-08-28",
    title:
      "農地を宅地に変えるには？──農地法4条・5条の転用許可の流れと必要書類・用途地域・期間",
    category: "許認可の手続き（行政書士の実務から）",
    excerpt:
      "農地を宅地・駐車場などに変える「農地転用」には、農地法にもとづく許可か届出が必要です。自己転用は第4条、権利移動を伴う転用は第5条で、市街化区域内なら農業委員会への届出で足ります（第4条第1項第7号・第5条第1項第6号）。市街化調整区域など区域外は都道府県知事等の許可が必要です。4条許可と5条許可の違い、区域による許可／届出の別、農業委員会への申請書類、期間の目安、無断転用の罰則（第64条）を整理し、許可・届出書類は行政書士、登記は司法書士・土地家屋調査士、売買は不動産、税務は税理士へ分離受任で振る分担を示しました。",
    keywords: [
      "農地転用 4条 5条 違い",
      "農地 宅地 変える 許可 届出",
      "農地転用 市街化区域 届出 農業委員会",
      "農地転用 必要書類 申請",
      "農地転用 許可 期間 どのくらい",
      "農地転用 許可 行政書士",
    ],
    tags: [
      "農地転用",
      "農地法",
      "許認可",
      "用途地域",
      "農業委員会",
      "行政書士",
    ],
  },
  {
    file: "32-kazoku-shintaku-gyosei-yakuwari-kumisei.md",
    slug: "kazoku-shintaku-gyosei-yakuwari-kumisei",
    date: "2026-08-28",
    title:
      "家族信託を組むとき行政書士は何をする？──信託契約書・公正証書・信託登記の役割分担と遺言・後見との違い",
    category: "相続の手続き（行政書士の実務から）",
    excerpt:
      "家族信託（民事信託）は、委託者が信頼できる家族（受託者）に財産の管理・処分を託し、受益者のために運用してもらう仕組みです（信託法・2007年9月30日施行）。認知症などで判断能力が下がっても受託者が契約に沿って管理できます。行政書士が関われる信託契約書作成の範囲、公正証書にする理由、信託の登記（不動産登記法第98条）、受益者課税（相続税法第9条の2）、遺言・任意後見との違いを整理し、書面作成は行政書士、公正証書化は公証人、登記は司法書士、税務は税理士、紛争は弁護士へ分離受任で振る分担を示しました。",
    keywords: [
      "家族信託 行政書士 何をする",
      "家族信託 信託契約書 作成 範囲",
      "家族信託 公正証書 信託登記 誰",
      "家族信託 遺言 任意後見 違い",
      "家族信託 課税 受益者等課税信託",
      "家族信託 民事信託 仕組み",
    ],
    tags: [
      "家族信託",
      "民事信託",
      "信託法",
      "遺言",
      "任意後見",
      "行政書士",
    ],
  },
  {
    file: "33-ippan-kamotsu-unso-kyoka-eigyosho-shako-yoken.md",
    slug: "ippan-kamotsu-unso-kyoka-eigyosho-shako-yoken",
    date: "2026-08-29",
    title:
      "一般貨物自動車運送事業の許可で、営業所と車庫はどんな要件を満たす？──5両・車庫・前面道路・標準処理期間",
    category: "許認可の手続き（行政書士の実務から）",
    excerpt:
      "トラック運送業（一般貨物自動車運送事業）を始めるには、貨物自動車運送事業法第3条にもとづく許可が必要です。許可の基準（第6条）、事業用自動車の最低5両、営業所・休憩睡眠施設・車庫の位置と広さ（睡眠1人2.5㎡以上、車両相互間・境界50センチメートル以上）、車庫と営業所の距離（原則10km以内）、前面道路の車両制限令適合と幅員証明、市街化調整区域・農地の扱い、標準処理期間（おおむね3〜5か月）を整理し、許可申請は行政書士、物件探しは不動産、労務は社労士、緑ナンバーの登録は運輸支局へ分離受任で振る分担を示しました。",
    keywords: [
      "一般貨物自動車運送事業 許可 要件",
      "運送業 許可 営業所 車庫 要件",
      "運送業 許可 5両 標準処理期間",
      "車庫 前面道路 車両制限令 幅員証明",
      "運送業 営業所 市街化調整区域 農地",
      "一般貨物 許可 行政書士",
    ],
    tags: [
      "一般貨物自動車運送事業",
      "運送業許可",
      "許認可",
      "営業所",
      "車庫",
      "行政書士",
    ],
  },
  {
    file: "34-yuigon-shikkosha-shokumu-sennin-dare.md",
    slug: "yuigon-shikkosha-shokumu-sennin-dare",
    date: "2026-08-29",
    title:
      "遺言執行者は誰にする？職務と選任の仕組みをわかりやすく──指定・家裁選任・解任と誰に振るか",
    category: "相続の手続き（行政書士の実務から）",
    excerpt:
      "遺言執行者は遺言の内容を実現する人で、相続財産の管理その他遺言の執行に必要な一切の行為をする権利義務を持ちます（民法第1012条第1項）。遺言での指定（民法第1006条第1項）と家庭裁判所による選任（民法第1010条）、就職後の相続人への通知（民法第1007条第2項）、動かないときの解任・辞任（民法第1019条）、特定財産承継遺言での対抗要件具備や預貯金の払戻し（民法第1014条）、自筆証書遺言の検認（民法第1004条）を整理し、相続登記は司法書士、相続税は税理士、争いは弁護士へ分離受任で振る分担を示しました。",
    keywords: [
      "遺言執行者 とは 職務 権限",
      "遺言執行者 指定 家庭裁判所 選任",
      "遺言執行者 行政書士 第三者",
      "遺言執行者 解任 辞任 動かない",
      "遺言執行者 相続登記 司法書士",
      "遺言執行者 選任 行政書士",
    ],
    tags: [
      "遺言執行者",
      "遺言",
      "相続",
      "検認",
      "特定財産承継遺言",
      "行政書士",
    ],
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
      date: a.date ?? DATE,
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
