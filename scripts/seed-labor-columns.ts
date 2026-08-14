/**
 * 労務コラム（4本）投入スクリプト
 *
 * 設計＝01_設計書と進行表/60_QAとコラム_設計見直し.md「4-2 決定済みから導出するコラム」（C-1・C-3・C-4・C-6）。
 * 原稿＝scripts/labor-columns/*.md。報酬額表 v18 の決定30件と相場調査から起こしている。
 * seed-office-columns.ts と同型：dry-run 既定 → preview JSON、--write で本番upsert、--emit-ts で admin 投入用データを生成。
 *
 * 使い方:
 *   npx tsx scripts/seed-labor-columns.ts            # dry-run（scripts/labor-columns.preview.json を出力・DB接続なし）
 *   npx tsx scripts/seed-labor-columns.ts --write    # DATABASE_URL/DIRECT_URL を設定して本番upsert（冪等）
 *   npx tsx scripts/seed-labor-columns.ts --emit-ts  # src/lib/data/labor-columns-seed.ts を生成（/admin/columns/seed-labor 用）
 *
 * 設計メモ:
 *   - business="labor"。SR_LAUNCHED=false の間は (labor)/layout.tsx が notFound() を返すため、
 *     status="published" で投入しても開業日（2026-09-01）まで表に出ない。sitemap にも出ない。
 *   - date="2026-09-01"＝開業日。クラスタの公開と足並みを揃える。
 *   - FAQ は本文md「## よくある質問」から自動パース＝本文が単一ソース。各記事4問。
 *   - upsert キー＝ @@unique([business, slug])。再実行しても重複しない。
 *   - locales: ["ja"]＝日本語のみ（浦松判断 2026-08-12・開業前の多言語展開は見送り）。
 *   - 表示コンプライアンス＝「ワンストップ」等の一体提供語を使わない／事業体をまたぐ記述には分離受任を明示／
 *     裏取りできない条文番号・告示番号を書かない（shigyo-compliance-gate 第4条）。
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve, join } from "path";

type Faq = { question: string; answer: string };

/** src/lib/column-shared.ts の ColumnTranslation と同形 */
type Translation = {
  title: string;
  excerpt: string;
  content: string;
  category?: string;
  keywords?: string[];
  tags?: string[];
  author?: { name: string; title: string };
  faq?: Faq[];
};

const LOCALES = ["en", "zh-tw", "zh"] as const;
type Locale = (typeof LOCALES)[number];

type SeedColumn = {
  business: "labor";
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
  translations?: Partial<Record<Locale, Translation>>;
};

const AUTHOR = {
  name: "浦松 丈二",
  title: "社会保険労務士・行政書士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）",
} as const;

const DATE = "2026-09-01"; // 開業日＝クラスタ公開日

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
    file: "01-shogu-kaizen-dochira.md",
    slug: "shogu-kaizen-sharoushi-gyoseishoshi-dochira",
    title: "処遇改善加算は、社会保険労務士と行政書士のどちらに頼むのか",
    category: "誰に頼むか",
    excerpt:
      "処遇改善加算は工程で担当が分かれます。賃金制度の設計と賃金改善額の算定は社会保険労務士、指定権者へ提出する計画書・実績報告書の作成は行政書士です。根拠となる法律が違うため、ひとつの事務所が両方を名乗ることはできません。四葉での分担と料金もあわせて示します。",
    keywords: [
      "処遇改善加算 社労士 行政書士 どちら",
      "処遇改善加算 誰に頼む",
      "処遇改善加算 計画書 代行",
      "処遇改善加算 賃金改善額 算定",
      "障害福祉 処遇改善加算 相談",
      "処遇改善加算 業際",
    ],
    tags: ["処遇改善加算", "障害福祉", "介護", "業際", "社会保険労務士", "行政書士"],
  },
  {
    file: "02-joseikin-hojokin-dochira.md",
    slug: "joseikin-hojokin-dochira-ni-tanomu",
    title: "助成金と補助金は、どちらに頼めばいいのか",
    category: "誰に頼むか",
    excerpt:
      "「人を雇う・働き方を変える」お金が助成金で社会保険労務士の領域、「事業を興す・設備を入れる」お金が補助金で行政書士の領域です。原資も審査の考え方も違います。雇用保険法第62条という根拠から、なぜ頼む相手が分かれるのかを整理します。",
    keywords: [
      "助成金 補助金 違い",
      "助成金 社労士 行政書士 どちら",
      "雇用関係助成金 誰に頼む",
      "助成金 申請代行 資格",
      "補助金 行政書士",
      "助成金 コンサル 社労士",
    ],
    tags: ["助成金", "補助金", "雇用保険", "業際", "社会保険労務士", "行政書士"],
  },
  {
    file: "03-kyuyo-keisan-soba.md",
    slug: "kyuyo-keisan-soba-sharoushi",
    title: "給与計算を社会保険労務士に頼むと、いくらかかるのか",
    category: "料金の考え方",
    excerpt:
      "給与計算の代行は「基本料金＋従業員1人あたりいくら」が一般的で、1人あたりは月200〜500円（税別）と説明されることが多い形です。なぜ基本料金があるのか、代行と伴走支援をどう見分けるのか、比べるときに揃えるべき4点を整理します。四葉は基本料金なし・1人1,100円（税込）です。",
    keywords: [
      "給与計算 社労士 相場",
      "給与計算 代行 費用",
      "給与計算 アウトソーシング 料金",
      "給与計算 基本料金 人数",
      "給与計算 社労士 独占業務",
      "給与計算 年末調整 税理士",
    ],
    tags: ["給与計算", "料金", "相場", "アウトソーシング", "社会保険労務士"],
  },
  {
    file: "04-komonryo-nan-no-taika.md",
    slug: "sharoushi-komonryo-nan-no-taika",
    title: "社会保険労務士の顧問料は、何の対価なのか",
    category: "料金の考え方",
    excerpt:
      "顧問料は事務所によって中身が違います。多くは「相談＋基本的な手続」を含む包括料金ですが、四葉は相談だけの対価にし、手続は顧問先でも都度いただく形をとりました。なぜその設計にしたのか、包括型と比べて何が変わるのかを、隠さずに書きます。",
    keywords: [
      "社労士 顧問料 相場",
      "社労士 顧問料 何が含まれる",
      "社労士 顧問契約 内容",
      "社労士 手続だけ 依頼",
      "社労士 顧問料 従業員数",
      "社労士 相談 回数制限",
    ],
    tags: ["顧問料", "料金", "受任方針", "就業規則", "社会保険労務士"],
  },
  {
    file: "05-gaichu-koyo-sakaime.md",
    slug: "gaichu-koyo-sakaime-roudoushasei",
    title: "外注と雇用の境目は、契約書では決まらない",
    category: "労働法の基本",
    excerpt:
      "業務委託契約書があっても、実態が雇用なら雇用として扱われます。判断は契約書の題名ではなく、仕事の依頼を断れるか、指揮監督を受けているか、時間や場所の拘束があるか——という実態で行われます。労働基準法研究会報告（昭和60年12月19日）の判断項目と、遡って求められる範囲・時効を表で整理しました。",
    keywords: [
      "業務委託 雇用 違い",
      "労働者性 判断基準",
      "業務委託 実態は雇用",
      "業務委託 社会保険 遡及",
      "労働基準法 第9条 労働者",
      "偽装請負 残業代 遡り",
    ],
    tags: ["労働者性", "業務委託", "労働基準法", "社会保険", "時効"],
  },
  {
    file: "06-shacho-rosai-tokubetsu-kanyu.md",
    slug: "shacho-rosai-tokubetsu-kanyu-hitori",
    title: "社長には労災が出ない。そして1人だと特別加入もできない",
    category: "労働保険",
    excerpt:
      "役員は労災保険の給付を受けられません。中小事業主等の特別加入という制度がありますが、労働者を1人も雇っていない会社は加入できません。労働者について労災保険の保険関係が成立していることが条件だからです。業種別の規模要件と、加入までの順序をまとめました。",
    keywords: [
      "社長 労災 出ない",
      "労災保険 特別加入 中小事業主",
      "一人社長 労災 特別加入",
      "特別加入 労働保険事務組合",
      "特別加入 業種 規模要件",
      "役員 労災 けが",
    ],
    tags: ["労災保険", "特別加入", "役員", "労働保険事務組合", "中小企業"],
  },
  {
    file: "07-kazoku-shain-tsumazuku-3tsu.md",
    slug: "kazoku-shain-koyohoken-yakuin-joseikin",
    title: "家族を社員にするとき、つまずく3つのところ",
    category: "採用と雇用",
    excerpt:
      "家族を社員にするときは、同居しているか、取締役にするか、助成金を考えているか——の3つを確かめてください。同居の親族は原則として雇用保険の被保険者になりませんが、要件を示せば被保険者として取り扱われます。立場ごとの雇用保険・社会保険の可否を表にしました。",
    keywords: [
      "家族 従業員 雇用保険",
      "同居の親族 雇用保険 被保険者",
      "取締役 雇用保険 入れない",
      "family 助成金 3親等以内の親族",
      "同族会社 家族 社会保険",
      "使用人兼務役員 雇用保険",
    ],
    tags: ["雇用保険", "同居の親族", "役員", "同族会社", "助成金"],
  },
  {
    file: "08-tanjikan-koyo-shakaihoken.md",
    slug: "tanjikan-koyo-shakaihoken-4bunno3",
    title: "短い時間で雇うと、社会保険はどうなるか",
    category: "社会保険",
    excerpt:
      "従業員51人未満の会社では、社会保険に入るかどうかは4分の3基準だけで決まります。1週の所定労働時間と1月の所定労働日数の両方が通常の労働者の4分の3未満なら入りません。雇用保険は週20時間が分かれ目です。企業規模要件が2035年10月までに撤廃される日程も表にしました。",
    keywords: [
      "パート 社会保険 何時間から",
      "社会保険 4分の3基準",
      "106万円の壁 撤廃",
      "社会保険 適用拡大 51人",
      "雇用保険 週20時間",
      "短時間労働者 社会保険 企業規模要件",
    ],
    tags: ["社会保険", "雇用保険", "パート", "適用拡大", "年金制度改正"],
  },
  {
    file: "09-kaisha-tatamu-zenso.md",
    slug: "kaisha-tatamu-shakaihoken-zenso-tetsuzuki",
    title: "会社をたたむとき、社会保険と労働保険はどうするか",
    category: "手続と期限",
    excerpt:
      "会社をたたむときは、社会保険の適用事業所全喪届、雇用保険の適用事業所廃止届、労働保険の確定保険料申告書の3つが必要です。被保険者の資格喪失届は別に人数分出します。「労働保険 保険関係消滅届」という届出は存在しません。届出の名称・提出先・期限を一覧にしました。",
    keywords: [
      "会社 廃業 社会保険 手続き",
      "適用事業所全喪届 期限",
      "雇用保険 適用事業所廃止届",
      "労働保険 確定保険料 廃業",
      "廃業 社会保険 資格喪失届",
      "会社 解散 労働保険",
    ],
    tags: ["廃業", "全喪届", "労働保険", "社会保険", "手続"],
  },
  {
    file: "10-nenkin-jukyuchu-koyo.md",
    slug: "nenkin-jukyuchu-koyo-zaishoku-rorei",
    title: "年金をもらいながら働く人を雇うとき",
    category: "社会保険",
    excerpt:
      "老齢厚生年金は、給与と合わせて一定額を超えると一部が止まります。令和8年4月以降の支給停止調整額は65万円です。65万円までは、いくら払っても年金は減りません。繰下げ待機中に在職老齢年金で止まった額は増額の対象にならない点も、あわせて整理します。",
    keywords: [
      "在職老齢年金 65万円",
      "支給停止調整額 令和8年度",
      "年金 もらいながら 働く 上限",
      "70歳以上被用者該当届",
      "繰下げ 在職老齢年金 増額されない",
      "高齢者 雇用 社会保険 何歳まで",
    ],
    tags: ["在職老齢年金", "高年齢者雇用", "厚生年金保険", "繰下げ受給", "賃金設計"],
  },
  {
    file: "11-kaigai-shucho-haken-rosai.md",
    slug: "kaigai-shucho-haken-rosai-chigai",
    title: "海外出張と海外派遣は、労災でまったく違う",
    category: "労働保険",
    excerpt:
      "労災保険は属地主義です。海外出張なら国内の事業場の労災保険から給付されますが、海外派遣には適用がなく、特別加入の手続をしていなければ給付を受けられません。分かれ目は滞在期間ではなく指揮命令の所在です。日中社会保障協定の適用証明書についても整理します。",
    keywords: [
      "海外出張 海外派遣 労災 違い",
      "海外派遣 労災 特別加入",
      "日中社会保障協定 適用証明書",
      "中国 駐在 社会保険 免除",
      "海外赴任 健康保険 厚生年金",
      "海外勤務 介護保険 適用除外",
    ],
    tags: ["労災保険", "特別加入", "海外派遣", "社会保障協定", "中国"],
  },
  {
    file: "12-shugyokisoku-10nin-gimu.md",
    slug: "shugyokisoku-10nin-gimu-nani-ga-hitsuyo",
    title: "就業規則は何人から義務か。義務でないものは何か",
    category: "労働法の基本",
    excerpt:
      "就業規則の作成と届出が義務になるのは常時10人以上からです。ただしハラスメント防止の措置と育児・介護休業法上の措置は人数に関係なく義務で、労働条件の明示も1人目から必要です。令和8年10月からはカスタマーハラスメントへの対応も義務になります。",
    keywords: [
      "就業規則 何人から 義務",
      "10人未満 就業規則 不要",
      "パワハラ防止措置 中小企業 義務",
      "カスタマーハラスメント 義務化 令和8年10月",
      "労働条件通知書 明示事項",
      "36協定 届出 人数",
    ],
    tags: ["就業規則", "ハラスメント", "労働条件明示", "36協定", "育児介護休業法"],
  },
  {
    file: "13-kaisha-setsuritsu-kigen.md",
    slug: "kaisha-setsuritsu-shakaihoken-roudouhoken-kigen",
    title: "会社をつくったら、いつまでに何を出すのか",
    category: "手続と期限",
    excerpt:
      "法人は代表者1人でも社会保険の適用事業所になります。人を雇えば労働保険も要ります。見落としやすいのが労働保険の概算保険料申告書で、保険関係が成立した日から50日以内という別の期限があります。届出の名称・提出先・期限を一覧にしました。",
    keywords: [
      "会社設立 社会保険 手続き 期限",
      "新規適用届 5日以内",
      "労働保険 保険関係成立届 10日",
      "概算保険料申告書 50日以内",
      "雇用保険 適用事業所設置届",
      "設立直後 労働保険 何を出す",
    ],
    tags: ["会社設立", "新規適用届", "労働保険", "概算保険料", "手続"],
  },
  {
    file: "14-joseikin-yuki-muki-keiyaku.md",
    slug: "joseikin-yuki-muki-keiyaku-katachi",
    title: "助成金を狙うなら、最初の契約形態で決まる",
    category: "助成金",
    excerpt:
      "キャリアアップ助成金の正社員化コースは、有期契約から正社員にしたか、無期契約から正社員にしたかで額が変わります。パートを迎える時点でどちらにするかが、1年後の金額を決めます。キャリアアップ計画は転換の実施日の前日までに提出しないと不支給になります。",
    keywords: [
      "キャリアアップ助成金 有期 無期 違い",
      "正社員化コース 金額",
      "キャリアアップ計画 提出期限",
      "パート 正社員 助成金",
      "重点支援対象者 キャリアアップ助成金",
      "助成金 家族 3親等以内の親族",
    ],
    tags: ["助成金", "キャリアアップ助成金", "正社員化", "有期契約", "無期転換"],
  },
  {
    // 2026-08-13 追加。freeeの公式プレスリリース2本（2025-05-14 AIコンセプト／
    // 2026-03-02 freee-mcp のOSS公開）を一次資料にしている。
    // ★機能名・提供時期は変わるため、本文に「最新はfreee公式で確認」と明記済み。
    file: "15-freee-jinji-kaikei-ai.md",
    slug: "freee-jinji-kaikei-ai",
    title: "freee人事労務とfreee会計のAI連携は、どこまで進んでいるのか",
    category: "労務のしくみ",
    excerpt:
      "freeeは会計・人事労務など5領域でAPIを公開し、2026年3月にはAIエージェントから直接操作できる「freee-mcp」をOSSとして公開しました。人事労務ではAI年末調整アシストとAI勤怠チェッカーが先行しています。公式発表をもとに、何が自動になり、何が判断として残るのかを整理します。",
    keywords: [
      "freee人事労務 freee会計 連携",
      "freee AI 年末調整",
      "freee AI 勤怠チェッカー",
      "freee-mcp",
      "給与仕訳 自動化 freee",
      "社労士 AI 自動化 どこまで",
    ],
    tags: ["freee", "AI", "給与計算", "年末調整", "勤怠管理", "バックオフィス"],
  },
  {
    // 2026-08-14 追加。原稿は浦松のGoogleドキュメント校正版が正本。
    // 社労士法・同施行令は 2026-08-14 に e-Gov 法令検索API（343AC1000000089／343CO0000000327）で一次確認。
    // freeeの電子申請範囲・gBizID要否・「社労士による代理人申請には現在対応しておりません」は
    // freeeヘルプ（2026-04-10更新・2026-08-14参照）による。★機能は改定されるため本文に参照日を明記済み。
    // 15（freee AI連携＝機能の解説）との役割分担＝本記事は「誰に頼むか」（業際）。相互リンクあり。
    file: "16-freee-jinji-roumu-sharoushi.md",
    slug: "freee-jinji-roumu-sharoushi-doko-made",
    title: "freee人事労務を入れました。顧問社労士は何をしてくれるのですか",
    category: "誰に頼むか",
    excerpt:
      "freee人事労務は書類を作り、マイナポータルやe-Govを通じて電子申請まで出せます。自社の手続を自社で行う限り、資格は要りません。社会保険労務士が必要になるのは、報酬を得て他人の手続を代わりに行うときです。条文に沿って、ソフトと社労士の線の引き方を整理します。",
    keywords: [
      "freee人事労務 社労士 何を頼む",
      "freee 電子申請 gBizID",
      "顧問社労士 何をしてくれる",
      "社会保険労務士 独占業務 電磁的記録",
      "freee 年末調整 誰に頼む",
      "クラウド労務 社労士 必要か",
    ],
    tags: ["freee", "電子申請", "社会保険労務士", "業際", "顧問契約", "gBizID"],
  },
  {
    // 2026-08-14 追加。原稿は浦松のGoogleドキュメント校正版が正本。
    // 実例4件はすべて一次確認済み（雇用保険法第6条・労基法第115条＋附則第143条第3項・
    // 徴収法第5条＝e-Gov API、日中社会保障協定＝日本年金機構の中国ページ 2026-08-14参照）。
    // shigyo-compliance-gate 第1条（AI判断禁止）がそのまま主題。「AIが判断する」と読める表現は書かない。
    file: "17-ai-de-shirabete-kara-soudan.md",
    slug: "ai-de-shirabete-kara-soudan-shite-yoika",
    title: "AIに労務を聞いてから、社労士に相談してよいか",
    category: "誰に頼むか",
    excerpt:
      "かまいません。むしろ調べてからお越しいただくほうが、相談は速く進みます。ただしAIの答えは、条文の番号と施行日でずれることがあります。当事務所が一次資料で実際に見つけた誤りの実例とともに、AIで調べた結果の持ち込み方をご案内します。",
    keywords: [
      "AI 労務 相談 してよいか",
      "生成AI 労務 答え合わせ",
      "AI 調べた 社労士 相談",
      "AI 条文 間違い 確認",
      "労務 AI 正しいか 不安",
      "社労士 AI どう使う",
    ],
    tags: ["AI", "生成AI", "労務相談", "条文確認", "相談の仕方"],
  },
  {
    // 2026-08-14 追加（テーマ3）。浦松承認済みドラフトが正本。
    // 所得税法第190条・税理士法第2条第1項（第2号にも「電磁的記録を含む」）は e-Gov で一次確認。
    // freeeヘルプ「freee人事労務での年末調整の流れ」（2026-07-21更新・2026-08-14参照）＝プラン別範囲の根拠。
    // 03（給与計算相場＝「年末調整は税理士」の1行）を記事に展開。15・16と相互リンク。
    file: "18-freee-nenmatsu-chosei.md",
    slug: "freee-nenmatsu-chosei-dare-no-shigoto",
    title: "freeeの年末調整は、誰の仕事か",
    category: "誰に頼むか",
    excerpt:
      "freee人事労務には年末調整の機能があり、自社で行う分には資格は要りません。ただし年末調整は所得税の過不足を精算する税務の手続で、報酬を得て代わりに行うのは税理士の業務です。給与計算を社会保険労務士に頼んでいても年末調整は含まれません。プラン別の機能範囲とあわせて整理します。",
    keywords: [
      "freee 年末調整 誰に頼む",
      "年末調整 社労士 頼めない",
      "年末調整 税理士 業務",
      "freee 年末調整 プラン 違い",
      "給与計算 年末調整 含まれない",
      "年末調整 電子申告 freee",
    ],
    tags: ["freee", "年末調整", "税理士", "業際", "給与計算", "電子申告"],
  },
  {
    // 2026-08-14 追加（テーマ4）。浦松承認済みドラフトが正本。
    // 労基法第89条・第90条・第106条は e-Gov で一次確認（322AC0000000049）。
    // 12（何人から義務か）とは冒頭で相互リンクし役割分担＝本記事はAI生成原案の扱い。
    // 規程の効力は断定せず「事情によって判断が分かれる」と留保（shigyo-compliance-gate 第1条）。
    file: "19-ai-shugyokisoku.md",
    slug: "ai-shugyokisoku-todokede-dekiruka",
    title: "AIがつくった就業規則は、届け出られるか",
    category: "誰に頼むか",
    excerpt:
      "届け出られます。就業規則に様式の指定はなく、誰が作ったかも問われません。問題は中身と手続のほうです。意見書の添付（労働基準法第90条）と周知（第106条）が必要で、実態と合わない規程は争いのときに機能しません。AI原案の直しどころと頼み方まで整理します。",
    keywords: [
      "AI 就業規則 届け出",
      "就業規則 AI 原案 チェック",
      "就業規則 意見書 過半数代表",
      "就業規則 周知 義務",
      "AI 就業規則 有効性",
      "就業規則 原案 持ち込み 社労士",
    ],
    tags: ["AI", "就業規則", "労働基準法", "意見聴取", "周知", "届出"],
  },
  {
    // 2026-08-14 追加（テーマ5・新規はこれが最後）。浦松承認済みドラフトが正本。
    // 個情法第23〜25条・第27条、社労士法第21条は e-Gov で一次確認。
    // 個情委「生成AIサービスの利用に関する注意喚起等」（令和5年6月2日）は ppc.go.jp で確認。
    // ★個人情報保護法の解釈には踏み込まない（枠組みの紹介＋当事務所の運用の開示のみ）。
    // ★「学習しない」設定の節＝各社の公表資料（2026-08-14参照）。名称・既定値は変わる旨を本文に明記済み。
    file: "20-ai-jugyoin-joho.md",
    slug: "ai-jugyoin-joho-nyuryoku-yoihi",
    title: "AIに従業員の情報を入れてよいか",
    category: "労務のしくみ",
    excerpt:
      "一律には決まりません。従業員の情報は個人データで、生成AIへの入力には個人情報保護法の枠組みがかかり、個人情報保護委員会も注意喚起を出しています。「学習しない」設定の型と限界、社内で決めておく4項目、当事務所自身のデータの扱いまで開示して整理します。",
    keywords: [
      "AI 従業員 情報 入力",
      "生成AI 個人情報 会社 ルール",
      "AI 学習しない 設定",
      "生成AI 社内ルール 就業規則",
      "個人情報保護委員会 生成AI 注意喚起",
      "社労士 守秘義務 個人データ",
    ],
    tags: ["AI", "生成AI", "個人情報", "学習しない設定", "社内ルール", "守秘義務"],
  },
];

/** Markdownリンク・強調を平文化（FAQ JSON-LD用。本文には適用しない） */
function toPlainText(md: string): string {
  return md
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .trim();
}

/** 「## よくある質問」節（翻訳版は heading 引数）から **Q. …** / A. … の組をパースする */
function parseFaq(content: string, file: string, heading = "よくある質問"): Faq[] {
  const esc = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const m = content.match(new RegExp(`## ${esc}\\n([\\s\\S]*?)(?=\\n## |$)`));
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

/** 各言語の著者表記（第9条：事務所名は日本語表記のまま。資格名は各言語に訳す） */
const AUTHOR_BY_LOCALE: Record<Locale, { name: string; title: string }> = {
  en: {
    name: "Joji Uramatsu",
    title:
      "Shakai Hoken Roumushi (Certified Social Insurance and Labor Consultant), Gyoseishoshi (Certified Administrative Procedures Legal Specialist), Registered Real Estate Transaction Specialist — 四葉社会保険労務士事務所／四葉行政書士事務所",
  },
  "zh-tw": {
    name: "浦松 丈二",
    title: "社會保險勞務士・行政書士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）",
  },
  zh: {
    name: "浦松 丈二",
    title: "社会保险劳务士・行政书士・宅地建物取引士（四葉社会保険労務士事務所／四葉行政書士事務所）",
  },
};

/**
 * 翻訳md（scripts/labor-columns/<locale>/<file>）を読む。無ければ undefined。
 * 形式＝フロントマター（title / excerpt / category / faqHeading / keywords / tags）＋本文。
 * FAQは本文の faqHeading 節から `**Q. …**` / `A. …` をパースする（日本語版と同じ型）。
 */
function readTranslation(locale: Locale, file: string): Translation | undefined {
  const p = resolve(__dirname, "labor-columns", locale, file);
  if (!existsSync(p)) return undefined;
  const raw = readFileSync(p, "utf-8");
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) throw new Error(`${locale}/${file}: フロントマターがありません`);
  const meta: Record<string, string> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z]+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].trim();
  }
  for (const k of ["title", "excerpt", "faqHeading"]) {
    if (!meta[k]) throw new Error(`${locale}/${file}: フロントマターに ${k} がありません`);
  }
  const content = m[2].trim();
  const list = (v?: string) =>
    v
      ? v
          .split("|")
          .map((s) => s.trim())
          .filter(Boolean)
      : undefined;
  return {
    title: meta.title,
    excerpt: meta.excerpt,
    content,
    category: meta.category || undefined,
    keywords: list(meta.keywords),
    tags: list(meta.tags),
    author: { ...AUTHOR_BY_LOCALE[locale] },
    faq: parseFaq(content, `${locale}/${file}`, meta.faqHeading),
  };
}

function buildColumns(): SeedColumn[] {
  const dir = resolve(__dirname, "labor-columns");
  return ARTICLES.map((a) => {
    const content = readFileSync(join(dir, a.file), "utf-8").trim();
    const faq = parseFaq(content, a.file);

    const translations: Partial<Record<Locale, Translation>> = {};
    for (const l of LOCALES) {
      const t = readTranslation(l, a.file);
      if (t) translations[l] = t;
    }
    const complete = LOCALES.every((l) => translations[l]);

    return {
      business: "labor" as const,
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
      // 空配列＝全言語公開（schema.prisma の Column.locales）。
      // 4言語が揃っていない記事は ["ja"] のままにして、非日本語URLをsitemapに出さない
      // （luck428-column-seo 第10条：翻訳未投入のまま提出すると登録リクエストの枠を捨てる）。
      locales: complete ? [] : ["ja"],
      faq,
      ...(Object.keys(translations).length ? { translations } : {}),
    };
  });
}

/** 開業前に書いてはいけない語・撤回済みの誤り（yotsuba-sharoushi-kaigyo 第6条／2026-08-11 の撤回） */
const BANNED = [
  "ワンストップ",
  "一気通貫",
  "シームレス",
  "一括対応",
  "第25条第1項第5号ロ",
  "2026年4月15日",
  "推奨申請期限",
];

/**
 * 一体提供・提携・国数表記の禁止語を4書体で列挙する（yotsuba-sharoushi-kaigyo 第6条6-2/6-4/6-5、第13条）。
 * ★日本語だけのリストを作らない。2026年8月に同種の取りこぼしを3回繰り返している。
 * 異体字はコードポイントが違うため、日本語の文字列では一致しない（会/會、険/險/险、労/勞/劳、務/务）。
 */
const BANNED_ALL_SCRIPTS = [
  ...BANNED,
  // ja 6-2
  "一括して受任", "まとめて契約", "まとめてお任せ", "一体で受任",
  // zh-tw / zh 6-2
  "一站式", "一條龍", "一条龙", "一站到底", "整合承辦", "整合承办",
  // en 6-2
  "one-stop", "all-in-one", "end-to-end", "under one roof",
  // 6-4 提携・連携
  "提携税理士", "提携司法書士", "提携弁護士", "提携社会保険労務士", "連携して対応", "連携して進め",
  "合作稅理士", "合作司法書士", "合作律師", "合作税理士", "合作司法书士", "合作律师",
  "協同處理", "协同处理",
  "partner tax accountant", "affiliated tax accountant", "partner judicial scrivener",
  "affiliated judicial scrivener", "partner attorney", "affiliated attorney",
  // 6-5 国数表記
  "4カ国", "４カ国", "四カ国", "four countries", "4個國家", "4个国家",
];

/** 分離受任を明示していると認める語（4書体。第6条6-3の併記条件） */
const SEPARATE_ENGAGEMENT = [
  "独立した事業体", "別々にご契約", "それぞれ別の事業体",
  "另行簽約", "各自獨立", "分別承接",
  "另行签约", "各自独立", "分别承接",
  "separate contract", "separately",
];

/** 事業体をまたぐ言及（4書体） */
const CROSSES_ENTITY = ["四葉行政書士事務所", "四葉不動産"];

function verify(cols: SeedColumn[]): string[] {
  const notes: string[] = [];
  const slugs = new Set(cols.map((c) => c.slug));
  if (slugs.size !== cols.length) notes.push("NG: slug重複あり");
  for (const c of cols) {
    if (c.faq.length !== 4) notes.push(`WARN: ${c.slug} のFAQが${c.faq.length}件（想定4件）`);
    if (c.content.length < 2000) notes.push(`WARN: ${c.slug} の本文が短い（${c.content.length}字）`);
    // 評価集約＝労務クラスタ内への発リンクが最低1本（luck428-column-seo 第6条5）
    if (!/\]\(\/labor\//.test(c.content)) notes.push(`NG: ${c.slug} に /labor 配下へのリンクなし`);
    // 表示コンプライアンス
    for (const w of BANNED) if (c.content.includes(w)) notes.push(`NG: ${c.slug} に禁止語「${w}」`);
    // 事業体をまたぐ記述には分離受任の明示（shigyo-compliance-gate 第2条）
    const crosses = c.content.includes("四葉行政書士事務所") || c.content.includes("四葉不動産");
    const declared =
      c.content.includes("独立した事業体") ||
      c.content.includes("別々にご契約") ||
      c.content.includes("それぞれ別の事業体");
    if (crosses && !declared) notes.push(`NG: ${c.slug} 事業体をまたぐが分離受任の明示なし`);
    // 姉妹コラム・既存コラムへのリンク先slugの実在（労務クラスタ内のみ検査）
    const links = [...c.content.matchAll(/\]\(\/labor\/column\/([a-z0-9-]+)\)/g)].map((x) => x[1]);
    for (const l of links) if (!slugs.has(l)) notes.push(`NG: ${c.slug} → 不明slug ${l}`);
    // 第7条：H2は疑問文（「この記事の根拠」「よくある質問」は除く）
    const h2 = [...c.content.matchAll(/^## (.+)$/gm)].map((x) => x[1]);
    const body = h2.filter((h) => h !== "よくある質問" && h !== "この記事の根拠");
    const q = body.filter((h) => h.endsWith("？"));
    if (q.length < Math.ceil(body.length / 2))
      notes.push(`WARN: ${c.slug} の疑問文H2が${q.length}/${body.length}本（第7条2）`);
    // 第7条4：末尾に根拠
    if (!c.content.includes("## この記事の根拠")) notes.push(`NG: ${c.slug} に「この記事の根拠」なし`);
    // 第1条：判断留保
    if (!c.content.includes("資格者が行います")) notes.push(`WARN: ${c.slug} に判断留保の一文なし`);
    // 第7条5：著者ページリンク
    if (!c.content.includes("/about/uramatsu"))
      notes.push(`WARN: ${c.slug} に著者ページ（/about/uramatsu）へのリンクなし`);

    // ── 多言語版の検査（第13条：日本語だけ見て判定しない）────────────────
    const locs = Object.keys(c.translations ?? {}) as Locale[];
    if (locs.length && locs.length !== LOCALES.length)
      notes.push(`WARN: ${c.slug} の翻訳が${locs.length}/${LOCALES.length}言語（locales は ["ja"] のまま）`);
    for (const l of locs) {
      const t = c.translations![l]!;
      const hay = `${t.title}\n${t.excerpt}\n${t.content}`;
      for (const w of BANNED_ALL_SCRIPTS)
        if (hay.toLowerCase().includes(w.toLowerCase()))
          notes.push(`NG: ${c.slug}[${l}] に禁止語「${w}」`);
      if (CROSSES_ENTITY.some((w) => hay.includes(w)) && !SEPARATE_ENGAGEMENT.some((w) => hay.includes(w)))
        notes.push(`NG: ${c.slug}[${l}] 事業体をまたぐが分離受任の明示なし`);
      // 第9条：多言語版の条項号は「项／項」。簡体字で「款」を使わない
      if ((l === "zh" || l === "zh-tw") && /第[一二三四五六七八九十百千0-9０-９]+款/.test(hay))
        notes.push(`NG: ${c.slug}[${l}] 条項号に「款」を使用（第9条：既存は「项／項」で統一）`);
      // 事務所名は各言語でも日本語表記のまま
      for (const bad of ["四葉社會保險勞務士", "四葉社会保险劳务士", "四葉行政書士事務所法人", "社會保險勞務士法人", "社会保险劳务士法人"])
        if (hay.includes(bad)) notes.push(`NG: ${c.slug}[${l}] 事務所名の表記「${bad}」`);
      if (t.faq && t.faq.length !== c.faq.length)
        notes.push(`WARN: ${c.slug}[${l}] のFAQが${t.faq.length}件（日本語版は${c.faq.length}件）`);
      if (t.content.length < 1500) notes.push(`WARN: ${c.slug}[${l}] の本文が短い（${t.content.length}字）`);
      // 労務クラスタ内への発リンクは翻訳版でもロケール付きで維持する
      const re = new RegExp(`\\]\\(/${l}/labor/`);
      if (!re.test(t.content) && !/\]\(\/labor\//.test(t.content))
        notes.push(`WARN: ${c.slug}[${l}] に /labor 配下へのリンクなし`);
    }
  }
  return notes;
}

async function main() {
  const write = process.argv.includes("--write");
  const emitTs = process.argv.includes("--emit-ts");
  const cols = buildColumns();
  const notes = verify(cols);

  if (emitTs) {
    if (notes.some((n) => n.startsWith("NG"))) {
      console.error(notes.join("\n"));
      console.error("NGがあるため中断します。");
      process.exit(1);
    }
    const out = resolve(__dirname, "../src/lib/data/labor-columns-seed.ts");
    const header = `// このファイルは自動生成（npx tsx scripts/seed-labor-columns.ts --emit-ts）。直接編集しない。\n// 原稿の正本＝scripts/labor-columns/*.md。修正はmd側→再生成で行う。\n// 用途＝/admin/columns/seed-labor からの管理者セッション経由バルクupsert（seed-office と同型）。\n\nexport type LaborSeedColumn = {\n  business: "labor";\n  slug: string;\n  title: string;\n  date: string;\n  category: string;\n  excerpt: string;\n  content: string;\n  status: "published";\n  author: { name: string; title: string };\n  keywords: string[];\n  tags: string[];\n  locales: ("ja" | "en" | "zh-tw" | "zh")[];\n  faq: { question: string; answer: string }[];\n  translations?: Partial<\n    Record<\n      "en" | "zh-tw" | "zh",\n      {\n        title: string;\n        excerpt: string;\n        content: string;\n        category?: string;\n        keywords?: string[];\n        tags?: string[];\n        author?: { name: string; title: string };\n        faq?: { question: string; answer: string }[];\n      }\n    >\n  >;\n};\n\nexport const LABOR_COLUMNS_SEED: LaborSeedColumn[] = `;
    writeFileSync(out, header + JSON.stringify(cols, null, 2) + ";\n");
    console.log(`emit-ts → ${out}（${cols.length}本）`);
    return;
  }

  const preview = {
    generatedAt: new Date().toISOString(),
    note: "労務コラム（4本）。報酬額表 v18 の決定と相場調査から起こした原稿md（scripts/labor-columns/）から生成。--write でupsert。",
    articleCount: cols.length,
    verification: notes.length ? notes : ["OK: 全チェック通過"],
    articles: cols.map((c) => ({
      ...c,
      content: `${c.content.slice(0, 200)}…（全${c.content.length}字）`,
    })),
  };
  writeFileSync(resolve(__dirname, "labor-columns.preview.json"), JSON.stringify(preview, null, 2));
  console.log(`preview → scripts/labor-columns.preview.json（${cols.length}本）`);
  for (const n of notes) console.log("  " + n);
  if (notes.some((n) => n.startsWith("NG"))) {
    console.error("NGがあるため中断します。");
    process.exit(1);
  }
  if (!write) {
    console.log("\ndry-run です。本番投入は --write（DATABASE_URL/DIRECT_URL が必要）、");
    console.log("または --emit-ts のうえ /admin/columns/seed-labor から投入してください。");
    return;
  }

  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  try {
    for (const c of cols) {
      const r = await prisma.column.upsert({
        where: { business_slug: { business: c.business, slug: c.slug } },
        create: c as never,
        update: c as never,
      });
      console.log(`  upsert ${c.slug} → ${r.id}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
