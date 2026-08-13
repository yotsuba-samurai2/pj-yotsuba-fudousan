// labor.aboutPage.officeInfo（事務所情報の表）の4言語データ。
//
// 2026-08-13 新設。管理画面（/admin/translations）は `{label,value}` の配列を
// 「配列データは直接編集できません」として読み取り専用にしているため、
// この表だけは画面から直せない。パッチ＋専用ページで当てる。
//
// ★このデータで既存の officeInfo を「置き換える」。追記ではない。
//
// 入れる意図
//  - ★登録番号の行を先に作る。9月1日の登録後に番号を埋める（行政書士側は既に第25087022号が入っている）
//  - ★使用システム（freee人事労務）を出す。どの仕組みで回すかが最初に分かるほうが、
//    乗り換えを検討している会社に実利がある
//  - ★受任の前提（顧問契約が前提。障害年金と外部監査人は例外）を表に置く。
//    問い合わせの空振りを減らす
//
// 表記の決まり（luck428-column-seo 第9条）
//  - 事務所名・会社名は繁体字版・簡体字版でも日本語表記のまま
//  - 一般名詞としての資格名は各言語に訳す（社會保險勞務士／社会保险劳务士）
//  - 国数の表記（4カ国等）は使わない
//  - 法人ではないので「社会保険労務士法人」と書かない
//
// ★営業時間は行政書士事務所と同じ。宅地建物取引業法上の専任の宅地建物取引士の
//   専従性のため、四葉不動産（10:00〜18:00・火水定休）と時間を重ねられない。
//   正は src/lib/shared/office.ts の TENANT.labor.hours。ここはその表示用。
//   ★変更するときは office.ts・legal と3か所を必ず揃える。

import type { LangCode } from "@/config/languages";

export type OfficeInfoRow = { label: string; value: string };

/**
 * 登録番号の欄に入れる暫定値。
 *
 * 2026-08-13 訂正：新規登録入会研修会は8月4日に受講済みで、9月1日の登録は自動。
 * ★番号の交付は9月下旬の見込みのため、登録日と交付時期を分けて書く。
 * 「登録予定」だと9月1日を過ぎた時点で事実と合わなくなる。
 *
 * 番号が交付されたら、ここを実番号（例：社会保険労務士 第◯◯号／東京都社会保険労務士会）へ
 * 差し替えて /admin/translations/fix-labor-office-info を再実行する。
 */
export const REGISTRATION_PENDING: Record<LangCode, string> = {
  ja: "2026年9月1日 登録（番号は9月下旬に交付予定）",
  en: "Registered 1 September 2026 (number to be issued in late September)",
  "zh-tw": "2026年9月1日登錄（號碼預定於9月下旬核發）",
  zh: "2026年9月1日登录（号码预定于9月下旬核发）",
};

export const LABOR_OFFICE_INFO: Record<LangCode, OfficeInfoRow[]> = {
  ja: [
    { label: "名称", value: "四葉社会保険労務士事務所" },
    { label: "代表", value: "浦松 丈二（社会保険労務士）" },
    { label: "登録番号", value: REGISTRATION_PENDING.ja },
    { label: "所在地", value: "〒112-0006 東京都文京区小日向４丁目２－５ 小日向安田ビル ２０３" },
    { label: "最寄駅", value: "東京メトロ丸ノ内線 茗荷谷駅 徒歩5分" },
    { label: "電話番号", value: "03-6161-9428" },
    { label: "営業時間", value: "火・水 10:00〜19:00／月・木・金・土・日 18:00〜19:00" },
    { label: "対応言語", value: "日本語・英語・中国語（繁体字／簡体字）" },
    { label: "対応地域", value: "東京都および近県。オンラインでの対応も承ります" },
    { label: "使用システム", value: "freee人事労務" },
    {
      label: "受任の前提",
      value:
        "法人・個人事業主のお客さまは顧問契約を前提としてお受けします。障害年金（個人のお客さま）と外部監査人（監理支援機関のお客さま）は、顧問契約を前提としません。",
    },
  ],
  en: [
    { label: "Name", value: "四葉社会保険労務士事務所" },
    { label: "Representative", value: "Joji Uramatsu, Certified Social Insurance and Labour Consultant" },
    { label: "Registration number", value: REGISTRATION_PENDING.en },
    { label: "Address", value: "203 Kohinata Yasuda Building, 4-2-5 Kohinata, Bunkyo-ku, Tokyo 112-0006" },
    { label: "Nearest station", value: "Myogadani Station, Tokyo Metro Marunouchi Line — 5 minutes on foot" },
    { label: "Phone", value: "03-6161-9428" },
    { label: "Business hours", value: "Tue & Wed 10:00–19:00 / Mon, Thu, Fri, Sat & Sun 18:00–19:00" },
    { label: "Languages", value: "Japanese, English, Chinese (Traditional / Simplified)" },
    { label: "Area covered", value: "Tokyo and neighbouring prefectures. Online consultation is also available." },
    { label: "System used", value: "freee HR (freee人事労務)" },
    {
      label: "Terms of engagement",
      value:
        "For companies and sole proprietors, we work on a retainer basis. Disability pension claims (for individuals) and external auditor appointments (for supervising support organisations) do not require a retainer agreement.",
    },
  ],
  "zh-tw": [
    { label: "名稱", value: "四葉社会保険労務士事務所" },
    { label: "代表", value: "浦松丈二（社會保險勞務士）" },
    { label: "登錄號碼", value: REGISTRATION_PENDING["zh-tw"] },
    { label: "地址", value: "〒112-0006 東京都文京區小日向４丁目２－５ 小日向安田大樓 ２０３" },
    { label: "最近車站", value: "東京Metro丸之內線 茗荷谷站 步行5分鐘" },
    { label: "電話號碼", value: "03-6161-9428" },
    { label: "營業時間", value: "週二・週三 10:00〜19:00／週一・週四・週五・週六・週日 18:00〜19:00" },
    { label: "對應語言", value: "日文・英文・中文（繁體／簡體）" },
    { label: "服務地區", value: "東京都及鄰近縣。亦可線上對應。" },
    { label: "使用系統", value: "freee人事労務" },
    {
      label: "受任前提",
      value:
        "法人與個人事業主的客戶，以簽訂顧問契約為前提承接。障礙年金（個人客戶）與外部稽核人員（監理支援機關的客戶），則不以顧問契約為前提。",
    },
  ],
  zh: [
    { label: "名称", value: "四葉社会保険労務士事務所" },
    { label: "代表", value: "浦松丈二（社会保险劳务士）" },
    { label: "登录号码", value: REGISTRATION_PENDING.zh },
    { label: "地址", value: "〒112-0006 东京都文京区小日向４丁目２－５ 小日向安田大厦 ２０３" },
    { label: "最近车站", value: "东京Metro丸之内线 茗荷谷站 步行5分钟" },
    { label: "电话号码", value: "03-6161-9428" },
    { label: "营业时间", value: "周二・周三 10:00〜19:00／周一・周四・周五・周六・周日 18:00〜19:00" },
    { label: "对应语言", value: "日语・英语・中文（繁体／简体）" },
    { label: "服务地区", value: "东京都及邻近县。亦可线上对应。" },
    { label: "使用系统", value: "freee人事労務" },
    {
      label: "受任前提",
      value:
        "法人与个体工商户的客户，以签订顾问合同为前提承接。残障年金（个人客户）与外部审计人员（监理支援机构的客户），则不以顾问合同为前提。",
    },
  ],
};

/** 置き換え後に残ってはならない語（適用後のスキャン用） */
export const OFFICE_INFO_BAD_TERMS = [
  "労務士法人",
  "勞務士法人",
  "劳务士法人",
  "設立準備中",
  "籌備中",
  "筹备中",
  "法人化",
];
