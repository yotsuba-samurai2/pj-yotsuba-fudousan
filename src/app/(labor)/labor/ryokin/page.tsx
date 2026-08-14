// /labor/ryokin（型C・料金）＝開業後公開（SR_LAUNCHED=falseの間は404）
// 2026-08-11 全面改訂：報酬額表 v18（決定済み30件）に差し替え。
//   ・顧問料は相談料。手続はすべてスポット。手続だけの依頼は受けない
//   ・給与計算は顧問契約とセット（〜29人は1人あたり月1,100円・基本料なし／30人〜はお見積り）
//   ・2026-08-12：給与計算も顧問料と同じく30人で区切った。入退社の日割・勤怠の修正・
//     非正規の比率で工数が人数に比例しなくなるため（外部からの指摘を受けての変更）。
//     住民税の年度更新を別建てにした（相場は1人500〜1,500円／年・別途が一般的）。
//   ・★2026-08-13：報酬額表 v26。手続きの報酬をおおむね3割引き下げた（適用・入退社・年次・給付）。
//     資格取得届3,960→2,750／算定基礎届23,100→16,500／新規適用29,700→20,900 ほか。
//     引下率28.6〜33.3%。単価はすべて550円の倍数に揃えた（住民税年度更新550円と同じ刻み）。
//     顧問料・給与計算・規程・助成金・障害年金・外部監査人は据え置き。
//     ★理由：AIの活用で給与計算は自動化が進み、他の手続きも簡単になる。手続きは安売り合戦に
//     なるため、その流れを先取りする（浦松の判断）。決め手は「回らなければ上げられる。
//     顧問料は上げられない」という非対称性。手続きは都度の取引なので次の依頼から新単価が
//     適用されるだけだが、顧問料は継続契約で上げるには全顧問先の合意が要る。
//     ★四葉は顧問（相談の対価）と手続（都度）を分離しているため、手続きの価値が下がっても
//     顧問料が値崩れしない。手続きを顧問料に包括している事務所はこれができない。
//   ・2026-08-13：報酬額表 v25（決定済み44件）に追随。
//     - 顧問料の人数を「被保険者数」から「役員＋従業員（アルバイト・パートを含む）」に変更
//     - 労働保険の概算保険料申告書を別建て（新規適用 29,700円→19,800円 ＋ 概算 16,500円）
//     - 事業を閉じるときの手続き3件を新設（全喪・雇用保険の廃止・保険関係消滅）
//     - 出張旅費規程 36,300円→59,800円（他の規程と同じく相場に揃えた）
//   ・障害福祉レーンは廃止し本体へ統合
//   ・顧問先割引という区分はない（手続のみの依頼を受けないため、対象が存在しない）
//   ・★顧問料÷11,000の「ご相談時間の目安」は契約書にのみ記載。本ページには出さない（N-9）
//   ・★2026-08-14 打ち出しの変更（浦松決定）：顧問料に「給与計算などをfreeeで自社処理（内製）に
//     切り替える体制づくりの支援」を含めることを明示した。給与計算は「当事務所が代行する」か
//     「freeeで内製する支援を受ける（顧問料に含む）」かの2択として提示する。
//     ★位置づけ：内製化支援は社労士法2条1項3号（労務管理その他の労働に関する事項の相談・指導。
//     2026-08-14 e-Gov確認）の範囲＝相談・指導そのものなので、「顧問料＝相談の対価」の設計と
//     整合する。初期設定・移行の支援も顧問料内。手続が発生すれば従来どおり都度申し受ける
//     （顧問契約を前提とする受任設計は不変）。
//     ★書き方の制約：freeeの「認定」「公認」等は登録事実がないため書かない。「自動化できます」と
//     成果を約束せず「内製する体制づくりの支援」と書く。「比較的安価」等の比較優位の断定もしない。
//     ★戦略：手続や給与計算を顧問料に包括する事務所は、顧問先の内製が進むと顧問料の根拠が揺らぐ。
//     四葉は顧問（相談）と手続（都度）を分離しているため、内製への切り替えを支援しても顧問料の
//     意味が変わらない（上の2026-08-13コメントの帰結）。freee検討層への訴求を想定。
// JSON-LD＝Service＋PriceSpecification（「〜」「お見積り」を含まない確定値のみ）。
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

const SITE = "https://luck428.com";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return buildPageMetadata({
    businessKey: "labor",
    title: "料金｜四葉社会保険労務士事務所",
    description:
      "四葉社会保険労務士事務所の料金です。顧問料は労務のご相談に対する対価で、ご相談は回数・時間の制限なく承ります。労働社会保険の手続は届出ごとの料金を都度申し受けます。給与計算は代行（29人まで1人あたり月1,100円）のほか、freeeで自社計算（内製）に切り替える体制づくりの支援を顧問料に含めて承ります。文京区小日向・茗荷谷駅徒歩5分。",
    path: "/labor/ryokin",
    locale,
    absoluteTitle: true,
  });
}

type Row = { name: string; unit: string; price: string; value?: number };
type Section = { title: string; lead?: string; note?: string; rows: Row[] };

const SECTIONS: Section[] = [
  {
    title: "顧問（ご相談）",
    lead: "顧問料は、労務のご相談に対する対価です。ご相談は回数・時間の制限なく承ります。給与計算などの毎月の作業をfreeeで自社処理（内製）に切り替える体制づくりの支援も、ご相談の一部として顧問料に含みます。",
    // 2026-08-12：人数帯は相談量の代理指標にすぎない。顧問料＝相談料という設計上、
    // 実際のご相談の内容と量で帯を決めるのが本来の姿なので、その旨を明記した。
    // 2026-08-13：人数の数え方を「被保険者数」から「役員＋従業員（アルバイト・パートを含む）」に改めた。
    // 被保険者数で読むと、社会保険に入らない短時間パートが多い会社が実態と大きくずれるため
    // （社員2名＋アルバイト8名の会社が「〜4人 22,000円」になっていた）。
    // 役員を含めるのは、同族会社では役員の相談量のほうが多く、給与計算では1名として数えているため。
    note: "人数帯は目安です。顧問料はご相談の対価のため、ご相談の内容と量に応じた帯でお見積りします。人数は、役員と従業員の合計です（アルバイト・パートの方を含みます。社会保険の被保険者数ではありません）。手続・給与計算・規程の作成は顧問料に含まれません（下記のとおり別途申し受けます）。30人以上の会社は、就業実態と規程の本数を伺ったうえで個別にお見積りします。",
    rows: [
      { name: "〜4人", unit: "月額", price: "22,000円", value: 22000 },
      { name: "5〜9人", unit: "月額", price: "33,000円", value: 33000 },
      { name: "10〜14人", unit: "月額", price: "44,000円", value: 44000 },
      { name: "15〜19人", unit: "月額", price: "55,000円", value: 55000 },
      { name: "20〜24人", unit: "月額", price: "66,000円", value: 66000 },
      { name: "25〜29人", unit: "月額", price: "77,000円", value: 77000 },
      // 2026-08-12 浦松決定：30人以上はお見積りにする。
      // 30人を超えるあたりから、部署ごとの就業実態・非正規の類型・
      // 労使協定の本数が増え、相談1件あたりの工数が人数に比例しなくなるため。
      // 旧ラダー（30〜39人 88,000円 〜 90〜99人 154,000円）は廃止した。
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
      // 2026-08-12：顧問料と同じく30人で区切る。入退社の日割・勤怠の修正・非正規の比率で
      // 工数が人数に比例しなくなるため。基本料を置かずに済んでいた根拠（顧問契約が
      // 最低料金の役割を果たす）も、顧問料をお見積りにした30人以上では成り立たない。
      { name: "給与計算（30人〜）", unit: "月額", price: "お見積り" },
      // 2026-08-14 新設（浦松決定）：freeeでの内製への切替・定着支援＝顧問料に含む。
      // 範囲＝初期設定の設計・給与項目や控除の整理（労基法24条の賃金控除協定を含む）・
      // 保険料率改定時の確認・毎月の締めの相談。操作の細部はfreeeのサポート領域と切り分ける。
      // 社労士法2条1項3号（相談・指導）の業務なので「顧問料＝相談の対価」と整合。
      { name: "freeeでの自社計算（内製）への切替・定着支援", unit: "—", price: "顧問料に含む" },
      // 2026-08-12 新設：6月の特別徴収税額の一斉更新。全員分のバッチ作業で、
      // 人数に比例する。相場は1人500〜1,500円／年・別途が一般的。
      // 550円＝相談レート11,000円/時の3分相当（浦松決定）。
      { name: "住民税 特別徴収税額の年度更新", unit: "1名／年", price: "550円", value: 550 },
      { name: "住民税 特別徴収の異動届", unit: "1件", price: "お見積り" },
    ],
  },
  {
    title: "手続代行（適用）",
    // 2026-08-13：労働保険の概算保険料申告書を別建てにした。もともと新規適用に含めていたが、
    // 保険関係成立の日から50日以内という別の期限がある手続きなので、分けたほうが
    // 期限管理の意識づけになる。
    // あわせて、事業を閉じるときの手続き（全喪・廃止・保険関係消滅）を新設した。
    // 料金表に「閉じるとき」の項目が1つも無く、スポット社労士くん・社労士クラウドの
    // いずれにも項目がないため（＝新規開業が客層）、相談レート11,000円/時から積算した。
    // ★2026-08-13（同日・2回目）：手続きの報酬をおおむね3割引き下げた（下記の共通コメント参照）。
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
    title: "規程",
    note: "当事務所が作成した規程の法改正対応（該当条文の改定と届出）は、顧問料に含まれます。回数の制限はありません。会社の都合による改定は「就業規則 変更」の料金を申し受けます。",
    rows: [
      { name: "就業規則 新規作成", unit: "一式", price: "88,000〜220,000円（規模・規程の本数で変動）" },
      { name: "就業規則 変更", unit: "一式", price: "44,000円〜" },
      { name: "賃金規程 作成", unit: "1件", price: "49,800円", value: 49800 },
      { name: "育児介護休業規程 作成", unit: "1件", price: "79,800円", value: 79800 },
      { name: "ハラスメント防止規程 作成", unit: "1件", price: "11,000円", value: 11000 },
      { name: "社宅規程 作成", unit: "1件", price: "38,500円", value: 38500 },
      // 2026-08-13：36,300円→59,800円。賃金規程49,800円・育児介護休業規程79,800円は
      // 相場と同額なのに、出張旅費規程だけ相場（59,800円）の6割だった。
      // 規程3本の整合を優先して相場に揃えた。
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
    rows: [
      { name: "助成金 申請代行（顧問先限定）", unit: "一式", price: "着手金なし ＋ 成功報酬 支給額の20%" },
    ],
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
];

/** 当事務所では取り扱わない業務。おつなぎ先を明示する（分離受任） */
const NOT_HANDLED: { name: string; to: string }[] = [
  { name: "年末調整、扶養控除・賃貸料相当額・非課税限度額などの税務判断", to: "税理士" },
  { name: "法人登記の変更", to: "司法書士" },
  { name: "離職理由をめぐる争いなど、紛争性が生じた事案", to: "弁護士" },
  {
    name: "在留資格の申請書類の作成・申請取次",
    to: "四葉行政書士事務所（別事業体・別々にご契約いただきます）",
  },
  {
    name: "処遇改善加算の計画書・実績報告書の作成と指定権者への提出",
    to: "四葉行政書士事務所（同上）",
  },
  { name: "補助金の申請", to: "四葉行政書士事務所（同上）" },
  { name: "監理支援機関の許可申請書類の作成", to: "四葉行政書士事務所（同上）" },
  { name: "求職者の紹介・あっせん、応募者の面接代行、求人媒体の運用代行", to: "取り扱っておりません" },
];

/** 料金についてよくある質問。
 *  2026-08-14 新設（浦松指示）：内製化支援と報酬の関係をQAで説明する。
 *  第7条「報酬額表からFAQ・コラムを導出する」に沿い、FAQPage JSON-LDにも出力する。
 *  ★回答は構造の説明に徹する：成果の約束（「自動化できます」）・比較優位の断定（「安い」）は書かない。
 *  ★aはJSON-LDにそのまま出すため平文（リンク・強調なし）。リンクはlinkフィールドで別途描画。 */
const FAQS: { q: string; a: string; link?: { href: string; label: string } }[] = [
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
];

function jsonLd() {
  const offers = SECTIONS.flatMap((s) =>
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
        name: "四葉社会保険労務士事務所 料金",
        provider: { "@id": SITE + "/labor/#organization" },
        offers,
      },
      {
        "@type": "FAQPage",
        "@id": SITE + "/labor/ryokin#faq",
        mainEntity: FAQS.map((f) => ({
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
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }} />
      <Breadcrumb items={[{ name: "ホーム", href: "/labor" }, { name: "料金" }]} />

      <main className="mx-auto max-w-3xl px-4 pb-16">
        <header className="pt-2">
          <h1 className="font-serif text-2xl font-semibold text-ink sm:text-3xl">料金</h1>
          <p className="mt-3 leading-relaxed text-text">
            <strong>顧問料は、労務のご相談に対する対価です。</strong>
            ご相談は回数・時間の制限なく承ります。労働社会保険の手続は、顧問先の方も届出ごとの料金を都度申し受けます。給与計算などの毎月の作業を
            <strong>freeeで自社処理（内製）に切り替える体制づくりの支援は、顧問料に含みます</strong>。
          </p>
          <p className="mt-3 leading-relaxed text-text">
            <strong>手続だけのご依頼は承っておりません。</strong>
            ご相談を伴わずに手続だけをお受けすると、実情を把握しないまま誤った前提で処理してしまうおそれがあるためです。法人・個人事業主のお客さまは顧問契約を前提としてお受けします。
            <strong>障害年金（個人のお客さま）と外部監査人（監理支援機関のお客さま）は、顧問契約を前提としません。</strong>
          </p>

          {/* ★2026-08-13 追加：この表の読み方を先に示す。
              「安い」ではなく「あとで増えない」「理由が書いてある」を打ち出す。
              相場より安いとは言えない項目（賃金規程49,800円・育児介護79,800円は
              市場と同額）があるため、価格の安さを掲げると事実と食い違う。 */}
          <div className="mt-5 rounded-xl border border-border bg-surface p-4">
            <p className="font-medium text-ink">この表の読み方</p>
            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-text">
              <li>
                <strong>「含まないもの」も書いています。</strong>
                当事務所が取り扱わない業務は、おつなぎ先を明示しています。紹介料の授受は行いません。
              </li>
              <li>
                <strong>お見積りの項目は5つです。</strong>
                募集・採用コンサルタント／処遇改善加算の設計／外部監査人／顧問料の30人〜／給与計算の30人〜。
                作業量が案件ごとに大きく変わるためで、隠しているわけではありません。
              </li>
              <li>
                <strong>金額は着手前に書面でお出しします。</strong>
                この表の単価から積み上げるので、内訳がそのまま見えます。作業を始めてから金額が決まることはありません。
              </li>
              <li>
                <strong>2026年8月、手続きの料金をおおむね3割引き下げました。</strong>
                freee人事労務と生成AIの活用で、手続きの<em>作業</em>は軽くなります。そのぶんをお返しする趣旨です。
                給与計算を当事務所に頼まず、freeeで内製する体制づくりを顧問契約の範囲で支援する形も選べます。
                <Link href={addLocalePrefix("/labor/nagare", locale)} className="text-primary underline">
                  進め方のページ
                </Link>
                に、AIをどこまで使うか（と、使わないところ）を書いています。
              </li>
            </ul>
          </div>
        </header>

        <div className="mt-6 space-y-8">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2 className="border-l-4 border-primary pl-2 font-serif text-lg font-semibold text-ink">
                {s.title}
              </h2>
              {s.lead && <p className="mt-2 text-sm leading-relaxed text-text">{s.lead}</p>}
              {/* PC＝表 */}
              <table className="mt-3 hidden w-full border-collapse text-sm sm:table">
                <thead>
                  <tr className="bg-primary-tint text-left">
                    <th className="border border-border px-3 py-2">サービス</th>
                    <th className="border border-border px-3 py-2 whitespace-nowrap">単位</th>
                    <th className="border border-border px-3 py-2 whitespace-nowrap">税込</th>
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
                      <span>単位：{r.unit}</span>
                      <span>税込：{r.price}</span>
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
            当事務所では取り扱わない業務
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-text">
            次の業務は当事務所では承っておりません。その資格をお持ちの方におつなぎします。
            <strong>ご紹介にあたって紹介料の授受は一切行いません。</strong>
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-text">
            {NOT_HANDLED.map((n, i) => (
              <li key={i} className="rounded-lg border border-border bg-surface p-3">
                <span className="text-text">{n.name}</span>
                <span className="ml-1 text-text-muted">→ {n.to}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-text-muted">
            ※四葉不動産株式会社・四葉行政書士事務所・四葉社会保険労務士事務所は、それぞれ別の事業体として独立してご依頼をお受けします。ご依頼いただく場合は事務所ごとに別々にご契約いただき、料金・請求も分かれます。当事務所へのご依頼が、他の事務所へのご依頼の条件になることはありません。
          </p>
        </div>

        {/* 料金QA（FAQPage JSON-LDと同一ソース。内製化支援の説明＝2026-08-14） */}
        <div className="mt-10">
          <h2 className="border-l-4 border-primary pl-2 font-serif text-lg font-semibold text-ink">
            料金についてよくある質問
          </h2>
          <ul className="mt-3 space-y-3">
            {FAQS.map((f, i) => (
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
          ※金額はすべて税込です。「〜」「お見積り」としている項目は、事案により作業量が変わるため、ご契約前に個別のお見積りを書面でご提示します。確定額のみ構造化データ（PriceSpecification）として出力しています。
          <Placeholder reason="Notion＝社労士業務の料金（全業務・開業時最終確認）" />
        </p>

        {/* C8（→/legal/ryokin）＝開業日開通（SR_LAUNCHED） */}
        {getCrossLinks("/labor/ryokin", SR_LAUNCHED).map((c) => (
          <CrossLinkBanner
            key={c.id}
            link={c}
            lead="行政書士業務（指定申請・在留資格・補助金等）の報酬は、四葉行政書士事務所（別事業体・独立受任）のページへ。"
          />
        ))}

        <p className="mt-4 text-sm">
          ご依頼の手順 →{" "}
          <Link href={addLocalePrefix("/labor/nagare", locale)} className="text-primary underline">
            ご相談から契約までの流れ
          </Link>
        </p>

        {/* 署名（登録番号＝開業時確定まで非出力） */}
        <aside className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
          <img
            src="/staff/uramatsu-square.webp"
            alt="四葉社会保険労務士事務所 代表 浦松丈二"
            width={48}
            height={48}
            className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
          />
          <p className="text-xs leading-relaxed text-text-muted">
            <strong>この記事の著者</strong> 浦松 丈二｜四葉社会保険労務士事務所 代表 社会保険労務士
            <Placeholder reason="開業時確定＝社労士登録番号" />
            ・行政書士（登録番号 第25087022号）・宅地建物取引士。元毎日新聞中国総局長（記者歴34年）。
          </p>
        </aside>
      </main>

      <div className="mx-auto max-w-3xl px-4">
        <CtaBand businessKey="labor" />
      </div>
    </>
  );
}
