// 社会保険労務士 開業版パッチ（2026年9月1日／登録日に適用する）
//
// ■ なぜ別ファイルなのか
//   /admin/fix-sr-notation（sr-notation-patches.ts）は **from → to の一方向にしか
//   適用できない**（`cur !== p.from` ならスキップする実装）。
//   したがって「7月8日のパッチを逆に流す」ことはできない。開業版は別に用意する。
//
// ■ from の出どころ
//   2026-08-09 に **本番の翻訳ペイロードとHTMLから実測した現行値**。
//   sr-notation-patches.ts の `to` は**使っていない**。同ファイルの `to` は7月8日時点の
//   値であり、その後 7/10 のブランド統一パッチ・8/9 のコンプライアンスパッチで
//   上書きされているものがあるため、`from` の根拠にできない。
//
// ■ 適用画面
//   /admin/sr-launch （ドライラン → 差分確認 → 適用 の3段）
//
// ■ 登録番号
//   REGISTRATION_NUMBER が唯一の差し替え箇所。9月1日はここだけ書き換える。
//   プレースホルダーのままでは適用画面が実行を拒否する（sr-launch-patches.test.ts でも検査）。

import type { LangCode } from "@/config/languages";

/**
 * 社会保険労務士の登録番号。
 *
 * ★ 2026年9月1日（登録日）に、登録証で確認した**実数**へ差し替える。
 *   ここ1か所だけを直せば、下の全パッチに反映される。
 *
 * ★ 登録番号であって**試験合格番号ではない**。
 *   試験合格番号は「令和7年 第202500525号」。取り違えないこと。
 */
export const REGISTRATION_NUMBER = "【登録番号】";

/** プレースホルダーのままかどうか。true の間は適用してはならない。 */
export const IS_PLACEHOLDER = REGISTRATION_NUMBER.includes("【");

const N = REGISTRATION_NUMBER;

/** 翻訳データ：キー単位の全値置換（from照合・不一致はスキップ） */
export type SrLaunchTranslationPatch = {
  path: string;
  from: string;
  to: string;
  note?: string;
};

export const SR_LAUNCH_TRANSLATION_PATCHES: Record<
  LangCode,
  SrLaunchTranslationPatch[]
> = {
  ja: [
    {
      path: "representative.qualificationsRealestate",
      from: "宅地建物取引士・行政書士",
      to: "宅地建物取引士・行政書士・社会保険労務士",
      note: "不動産サイトの代表資格。宅建士を先頭に保つ",
    },
    {
      path: "representative.qualificationsLegal",
      from: "行政書士・宅地建物取引士",
      to: "行政書士・社会保険労務士・宅地建物取引士",
      note: "行政書士サイト。行政書士を先頭に保つ",
    },
    {
      path: "representative.qualificationsLabor",
      from: "行政書士・宅地建物取引士",
      to: "社会保険労務士・行政書士・宅地建物取引士",
      note: "社労士サイト。社労士を先頭に出す",
    },
    {
      path: "common.footer.laborRepRegistration",
      from: "社会保険労務士試験合格（2026年9月開業予定）",
      to: `社会保険労務士 登録番号第${N}号`,
    },
    {
      path: "representative.srExamNote",
      from: "社会保険労務士試験合格（2026年9月開業予定）",
      to: "",
      note: "未開業の注記。開業後は役目を終える。描画側は空文字なら非表示（TenantLayout・AboutPageContent とも `t(...) && (...)`）",
    },
    // ── labor.* の是正（2026-08-10 追加）。ja ──
    {
      path: "labor.meta.title",
      from: "四葉社会保険労務士法人 | 社会保険・労務・助成金",
      to: "四葉社会保険労務士事務所 | 社会保険・労務・助成金",
      note: "サイト全体のページタイトル。法人→事務所",
    },
    {
      path: "labor.meta.titleTemplate",
      from: "%s | 四葉社会保険労務士法人",
      to: "%s | 四葉社会保険労務士事務所",
      note: "同上（テンプレート）",
    },
    {
      path: "labor.meta.description",
      from: "社会保険・労働保険の手続き、就業規則作成、助成金申請、労務相談。四葉グループの社労士法人が企業の人事・労務をトータルサポートします。",
      to: "社会保険・労働保険の手続き、就業規則作成、助成金申請、労務相談。四葉社会保険労務士事務所が企業の人事・労務をサポートします。",
      note: "法人→事務所。「全方位／トータルサポート」も落とす",
    },
    {
      path: "labor.homePage.metaDescription",
      from: "社会保険・労働保険の手続き、就業規則作成、助成金申請、労務相談。四葉グループの社労士法人が、企業の人事・労務をトータルサポートします。",
      to: "社会保険・労働保険の手続き、就業規則作成、助成金申請、労務相談。四葉社会保険労務士事務所が、企業の人事・労務をサポートします。",
      note: "同上",
    },
    {
      path: "labor.homePage.faq.1.answer",
      from: "はい、外国人従業員の社会保険手続きや労務管理に対応しています。グループの行政書士事務所（在留資格）・不動産（社宅探し）と連携し、採用から定着までワンストップで支援します。",
      to: "はい、外国人従業員の社会保険手続きや労務管理に対応しています。在留資格の申請書類の作成は四葉行政書士事務所が、社宅の物件探しは四葉不動産株式会社が、それぞれ別の契約で承ります。紹介料の授受はありません。",
      note: "★事業体をまたぐ「ワンストップ」＝一括受任の示唆。分離受任の明示に置き換え",
    },
    {
      path: "labor.homePage.representativeBio2",
      from: "外国人従業員の雇用に関するご相談も多くいただいています。行政書士事務所（在留資格）・不動産（社宅探し）と連携し、採用から定着までをワンストップで支援できるのが四葉グループの強みです。",
      to: "外国人従業員の雇用に関するご相談も多くいただいています。在留資格の申請書類の作成は四葉行政書士事務所、社宅の物件探しは四葉不動産株式会社が、それぞれ別の契約で承ります。同じ窓口でご相談いただけます。",
      note: "★同上。「同じ窓口」は可（2026-07-29 石井弁護士確認）だが分離受任を併記する",
    },
    {
      path: "labor.aboutPage.highlights.status.value",
      from: "法人化 準備中",
      to: "個人事務所",
      note: "「法人化 準備中」→ 個人事務所。法人化の予定はない",
    },
    {
      path: "labor.aboutPage.officeInfo.1.value",
      from: "四葉社会保険労務士法人（設立準備中）",
      to: "四葉社会保険労務士事務所",
      note: "事業体名。法人→事務所",
    },
    {
      path: "labor.aboutPage.officeInfo.8.value",
      from: "法人化は準備中です。現在は四葉グループとして対応しております。",
      to: "四葉不動産株式会社・四葉行政書士事務所とは、それぞれ独立した事業体です。業務は別の契約で受任します。",
      note: "★「四葉グループとして対応」＝グループが労務を受けていると読める。分離受任の明示に置き換え",
    },
    {
      path: "labor.aboutPage.metaDescription",
      from: "四葉社会保険労務士事務所（設立準備中）の事務所概要・代表紹介。",
      to: "四葉社会保険労務士事務所の事務所概要・代表紹介。",
      note: "（設立準備中）を落とす",
    },
    {
      path: "labor.aboutPage.heroDescription1",
      from: "四葉社会保険労務士法人の事務所情報と代表紹介。",
      to: "四葉社会保険労務士事務所の事務所情報と代表紹介。",
      note: "法人→事務所",
    },
    {
      path: "labor.aboutPage.representativeBio2",
      from: "社会保険労務士法人の設立は現在準備中ですが、四葉グループとして社会保険・労務に関するご相談を承っています。行政書士事務所・不動産と連携し、外国人雇用のサポートにも力を入れています。",
      to: "四葉社会保険労務士事務所として、社会保険・労務に関するご相談を承ります。在留資格の申請書類の作成は四葉行政書士事務所、社宅の物件探しは四葉不動産株式会社が、それぞれ別の契約で承ります。外国人雇用の支援にも力を入れています。",
      note: "★「法人の設立は準備中だが四葉グループとして労務相談を承っている」＝法27条の観点で最も危険。主語を事務所にし分離受任を明示",
    },
    {
      path: "labor.columnPage.metaDescription",
      from: "四葉社会保険労務士法人のコラム。社会保険、助成金、労務管理など、人事・労務にまつわるお役立ち情報をお届けします。",
      to: "四葉社会保険労務士事務所のコラム。社会保険、助成金、労務管理など、人事・労務にまつわるお役立ち情報をお届けします。",
      note: "法人→事務所",
    },
  ],
  en: [
    {
      path: "representative.qualificationsRealestate",
      from: "Licensed Real Estate Transaction Specialist, Administrative Scrivener (Gyoseishoshi)",
      to: "Licensed Real Estate Transaction Specialist, Administrative Scrivener (Gyoseishoshi), Certified Social Insurance and Labor Consultant",
    },
    {
      path: "representative.qualificationsLegal",
      from: "Administrative Scrivener (Gyoseishoshi), Licensed Real Estate Transaction Specialist",
      to: "Administrative Scrivener (Gyoseishoshi), Certified Social Insurance and Labor Consultant, Licensed Real Estate Transaction Specialist",
    },
    {
      path: "representative.qualificationsLabor",
      from: "Administrative Scrivener (Gyoseishoshi), Licensed Real Estate Transaction Specialist",
      to: "Certified Social Insurance and Labor Consultant, Administrative Scrivener (Gyoseishoshi), Licensed Real Estate Transaction Specialist",
    },
    {
      path: "common.footer.laborRepRegistration",
      from: "Passed the Certified Social Insurance and Labor Consultant Examination (opening planned for September 2026)",
      to: `Certified Social Insurance and Labor Consultant, Registration No. ${N}`,
    },
    {
      path: "representative.srExamNote",
      from: "Passed the Certified Social Insurance and Labor Consultant Examination (opening planned for September 2026)",
      to: "",
    },
    // ── labor.* の是正（2026-08-10 追加）。en ──
    {
      path: "labor.meta.title",
      from: "四葉社会保険労務士法人 | Social Insurance, Labor & Subsidies",
      to: "四葉社会保険労務士事務所 | Social Insurance, Labor & Subsidies",
      note: "サイト全体のページタイトル。法人→事務所",
    },
    {
      path: "labor.meta.titleTemplate",
      from: "%s | 四葉社会保険労務士法人",
      to: "%s | 四葉社会保険労務士事務所",
      note: "同上（テンプレート）",
    },
    {
      path: "labor.meta.description",
      from: "Social insurance & labor insurance procedures, work rules creation, subsidy applications, and labor consulting. YOTSUBA GROUP's labor consulting firm provides comprehensive HR and labor support for businesses.",
      to: "Social insurance and labor insurance procedures, drafting of work rules, subsidy applications, and labor consulting. 四葉社会保険労務士事務所 supports the HR and labor needs of businesses.",
      note: "法人→事務所。「全方位／トータルサポート」も落とす",
    },
    {
      path: "labor.homePage.metaDescription",
      from: "Social insurance & labor insurance procedures, work rules creation, subsidy applications, and labor consulting. YOTSUBA GROUP's labor consulting firm provides comprehensive HR and labor support for businesses.",
      to: "Social insurance and labor insurance procedures, drafting of work rules, subsidy applications, and labor consulting. 四葉社会保険労務士事務所 supports the HR and labor needs of businesses.",
      note: "同上",
    },
    {
      path: "labor.homePage.faq.1.answer",
      from: "Yes, we handle social insurance procedures and labor management for foreign employees. In coordination with our group's administrative scrivener office (residence status) and real estate division (company housing search), we provide one-stop support from hiring to retention.",
      to: "Yes, we handle social insurance procedures and labor management for foreign employees. Preparation of residence-status application documents is undertaken by 四葉行政書士事務所, and the search for company housing by 四葉不動産株式会社, each under a separate contract. No referral fees are exchanged.",
      note: "★事業体をまたぐ「ワンストップ」＝一括受任の示唆。分離受任の明示に置き換え",
    },
    {
      path: "labor.homePage.representativeBio2",
      from: "We receive many inquiries about employing foreign nationals. By coordinating with our administrative scrivener office (residence status) and real estate division (company housing search), we can provide one-stop support from hiring to retention — a key strength of the 四葉 group.",
      to: "We receive many inquiries about employing foreign nationals. Preparation of residence-status application documents is undertaken by 四葉行政書士事務所, and the search for company housing by 四葉不動産株式会社, each under a separate contract. You can consult us through a single point of contact.",
      note: "★同上。「同じ窓口」は可（2026-07-29 石井弁護士確認）だが分離受任を併記する",
    },
    {
      path: "labor.aboutPage.highlights.status.value",
      from: "Incorporation in preparation",
      to: "Sole proprietorship",
      note: "「法人化 準備中」→ 個人事務所。法人化の予定はない",
    },
    {
      path: "labor.aboutPage.officeInfo.1.value",
      from: "四葉社会保険労務士法人 (incorporation in preparation)",
      to: "四葉社会保険労務士事務所",
      note: "事業体名。法人→事務所",
    },
    {
      path: "labor.aboutPage.officeInfo.8.value",
      from: "Incorporation is currently in preparation. We are currently operating under YOTSUBA GROUP.",
      to: "四葉不動産株式会社 and 四葉行政書士事務所 are independent entities. Each accepts work under a separate contract.",
      note: "★「四葉グループとして対応」＝グループが労務を受けていると読める。分離受任の明示に置き換え",
    },
    {
      path: "labor.aboutPage.metaDescription",
      from: "About 四葉社会保険労務士法人 (currently being established) — office overview and representative profile.",
      to: "About 四葉社会保険労務士事務所 — office overview and representative profile.",
      note: "（設立準備中）を落とす",
    },
    {
      path: "labor.aboutPage.heroDescription1",
      from: "Office information and representative profile of 四葉社会保険労務士法人.",
      to: "Office information and representative profile of 四葉社会保険労務士事務所.",
      note: "法人→事務所",
    },
    {
      path: "labor.aboutPage.representativeBio2",
      from: "The incorporation of the labor consulting firm is currently in preparation, but we are accepting social insurance and labor consultations under YOTSUBA GROUP. We are also committed to supporting the employment of foreign nationals, in coordination with our administrative scrivener office and real estate division.",
      to: "四葉社会保険労務士事務所 accepts consultations on social insurance and labor matters. Preparation of residence-status application documents is undertaken by 四葉行政書士事務所, and the search for company housing by 四葉不動産株式会社, each under a separate contract. We are also committed to supporting the employment of foreign nationals.",
      note: "★「法人の設立は準備中だが四葉グループとして労務相談を承っている」＝法27条の観点で最も危険。主語を事務所にし分離受任を明示",
    },
    {
      path: "labor.columnPage.metaDescription",
      from: "Columns from 四葉社会保険労務士法人. Useful information on social insurance, subsidies, labor management, and other HR & labor topics.",
      to: "Columns from 四葉社会保険労務士事務所. Useful information on social insurance, subsidies, labor management, and other HR & labor topics.",
      note: "法人→事務所",
    },
  ],
  "zh-tw": [
    {
      path: "representative.qualificationsRealestate",
      from: "不動產交易士・行政書士",
      to: "不動產交易士・行政書士・社會保險勞務士",
    },
    {
      path: "representative.qualificationsLegal",
      from: "行政書士・不動產交易士",
      to: "行政書士・社會保險勞務士・不動產交易士",
    },
    {
      path: "representative.qualificationsLabor",
      from: "行政書士・不動產交易士",
      to: "社會保險勞務士・行政書士・不動產交易士",
    },
    {
      path: "common.footer.laborRepRegistration",
      from: "社會保險勞務士考試合格（預定2026年9月開業）",
      to: `社會保險勞務士 登錄號第${N}號`,
    },
    {
      path: "representative.srExamNote",
      from: "社會保險勞務士考試合格（預定2026年9月開業）",
      to: "",
    },
    // ── labor.* の是正（2026-08-10 追加）。zh-tw ──
    {
      path: "labor.meta.title",
      from: "四葉社會保險勞務士法人 | 社會保險・勞務・助成金",
      to: "四葉社會保險勞務士事務所 | 社會保險・勞務・助成金",
      note: "サイト全体のページタイトル。法人→事務所",
    },
    {
      path: "labor.meta.titleTemplate",
      from: "%s | 四葉社會保險勞務士法人",
      to: "%s | 四葉社會保險勞務士事務所",
      note: "同上（テンプレート）",
    },
    {
      path: "labor.meta.description",
      from: "社會保險・勞動保險手續、就業規則編製、助成金申請、勞務諮詢。四葉グループ的社會保險勞務士法人為企業的人事・勞務提供全方位支援。",
      to: "社會保險・勞動保險手續、就業規則編製、助成金申請、勞務諮詢。四葉社會保險勞務士事務所為企業的人事・勞務提供支援。",
      note: "法人→事務所。「全方位／トータルサポート」も落とす",
    },
    {
      path: "labor.homePage.metaDescription",
      from: "社會保險・勞動保險手續、就業規則編製、助成金申請、勞務諮詢。四葉グループ的社會保險勞務士法人為企業的人事・勞務提供全方位支援。",
      to: "社會保險・勞動保險手續、就業規則編製、助成金申請、勞務諮詢。四葉社會保險勞務士事務所為企業的人事・勞務提供支援。",
      note: "同上",
    },
    {
      path: "labor.homePage.faq.1.answer",
      from: "是的，我們支援外國人員工的社會保險手續和勞務管理。透過集團行政書士事務所（在留資格）・不動產（員工宿舍搜尋）的聯動，從招聘到定著提供一站式支援。",
      to: "是的，我們支援外國人員工的社會保險手續和勞務管理。在留資格的申請文件製作由四葉行政書士事務所承辦，員工宿舍的物件搜尋由四葉不動產株式會社承辦，各自另行簽約。不收取介紹費。",
      note: "★事業体をまたぐ「ワンストップ」＝一括受任の示唆。分離受任の明示に置き換え",
    },
    {
      path: "labor.homePage.representativeBio2",
      from: "關於外國人員工僱用的諮詢也很多。透過與行政書士事務所（在留資格）・不動產（員工宿舍搜尋）的聯動，從招聘到定著實現一站式支援，這是四葉集團的優勢。",
      to: "關於外國人員工僱用的諮詢也很多。在留資格的申請文件製作由四葉行政書士事務所，員工宿舍的物件搜尋由四葉不動產株式會社，各自另行簽約承辦。您可以透過單一窗口諮詢。",
      note: "★同上。「同じ窓口」は可（2026-07-29 石井弁護士確認）だが分離受任を併記する",
    },
    {
      path: "labor.aboutPage.highlights.status.value",
      from: "法人化 籌備中",
      to: "個人事務所",
      note: "「法人化 準備中」→ 個人事務所。法人化の予定はない",
    },
    {
      path: "labor.aboutPage.officeInfo.1.value",
      from: "四葉社會保險勞務士法人（籌備中）",
      to: "四葉社會保險勞務士事務所",
      note: "事業体名。法人→事務所",
    },
    {
      path: "labor.aboutPage.officeInfo.8.value",
      from: "法人化正在籌備中。目前作為四葉グループ提供服務。",
      to: "與四葉不動產株式會社・四葉行政書士事務所為各自獨立的事業體。業務以個別契約承接。",
      note: "★「四葉グループとして対応」＝グループが労務を受けていると読める。分離受任の明示に置き換え",
    },
    {
      path: "labor.aboutPage.metaDescription",
      from: "四葉社會保險勞務士法人（籌備中）的事務所概況與代表介紹。",
      to: "四葉社會保險勞務士事務所的事務所概況與代表介紹。",
      note: "（設立準備中）を落とす",
    },
    {
      path: "labor.aboutPage.heroDescription1",
      from: "四葉社會保險勞務士法人的事務所資訊與代表介紹。",
      to: "四葉社會保險勞務士事務所的事務所資訊與代表介紹。",
      note: "法人→事務所",
    },
    {
      path: "labor.aboutPage.representativeBio2",
      from: "社會保險勞務士法人目前正在籌備設立中，但作為四葉グループ，我們已在受理社會保險・勞務相關諮詢。與行政書士事務所・不動產聯動，也在積極支援外國人僱用。",
      to: "四葉社會保險勞務士事務所受理社會保險・勞務相關諮詢。在留資格的申請文件製作由四葉行政書士事務所，員工宿舍的物件搜尋由四葉不動產株式會社，各自另行簽約承辦。也積極支援外國人僱用。",
      note: "★「法人の設立は準備中だが四葉グループとして労務相談を承っている」＝法27条の観点で最も危険。主語を事務所にし分離受任を明示",
    },
    {
      path: "labor.columnPage.metaDescription",
      from: "四葉社會保險勞務士法人的專欄。社會保險、助成金、勞務管理等，為您提供人事・勞務相關的實用資訊。",
      to: "四葉社會保險勞務士事務所的專欄。社會保險、助成金、勞務管理等，為您提供人事・勞務相關的實用資訊。",
      note: "法人→事務所",
    },
  ],
  zh: [
    {
      path: "representative.qualificationsRealestate",
      from: "不动产交易士・行政书士",
      to: "不动产交易士・行政书士・社会保险劳务士",
    },
    {
      path: "representative.qualificationsLegal",
      from: "行政书士・不动产交易士",
      to: "行政书士・社会保险劳务士・不动产交易士",
    },
    {
      path: "representative.qualificationsLabor",
      from: "行政书士・不动产交易士",
      to: "社会保险劳务士・行政书士・不动产交易士",
    },
    {
      path: "common.footer.laborRepRegistration",
      from: "社会保险劳务士考试合格（预定2026年9月开业）",
      to: `社会保险劳务士 登录号第${N}号`,
    },
    {
      path: "representative.srExamNote",
      from: "社会保险劳务士考试合格（预定2026年9月开业）",
      to: "",
    },
    // ── labor.* の是正（2026-08-10 追加）。zh ──
    {
      path: "labor.meta.title",
      from: "四葉社会保険労務士法人 | 社会保险・劳务・助成金",
      to: "四葉社会保険労務士事務所 | 社会保险・劳务・助成金",
      note: "サイト全体のページタイトル。法人→事務所",
    },
    {
      path: "labor.meta.titleTemplate",
      from: "%s | 四葉社会保険労務士法人",
      to: "%s | 四葉社会保険労務士事務所",
      note: "同上（テンプレート）",
    },
    {
      path: "labor.meta.description",
      from: "社会保险・劳动保险手续、就业规则编制、助成金申请、劳务咨询。四葉グループ的社会保险劳务士法人为企业的人事・劳务提供全方位支持。",
      to: "社会保险・劳动保险手续、就业规则编制、助成金申请、劳务咨询。四葉社会保険労務士事務所为企业的人事・劳务提供支持。",
      note: "法人→事務所。「全方位／トータルサポート」も落とす",
    },
    {
      path: "labor.homePage.metaDescription",
      from: "社会保险・劳动保险手续、就业规则编制、助成金申请、劳务咨询。四葉グループ的社会保险劳务士法人为企业的人事・劳务提供全方位支持。",
      to: "社会保险・劳动保险手续、就业规则编制、助成金申请、劳务咨询。四葉社会保険労務士事務所为企业的人事・劳务提供支持。",
      note: "同上",
    },
    {
      path: "labor.homePage.faq.1.answer",
      from: "是的，我们支持外国人员工的社会保险手续和劳务管理。通过集团行政书士事务所（在留资格）・不动产（员工宿舍搜寻）的联动，从招聘到定着提供一站式支援。",
      to: "是的，我们支持外国人员工的社会保险手续和劳务管理。在留资格的申请文件制作由四葉行政書士事務所承办，员工宿舍的物件搜寻由四葉不動産株式会社承办，各自另行签约。不收取介绍费。",
      note: "★事業体をまたぐ「ワンストップ」＝一括受任の示唆。分離受任の明示に置き換え",
    },
    {
      path: "labor.homePage.representativeBio2",
      from: "关于外国人员工雇用的咨询也很多。通过与行政书士事务所（在留资格）・不动产（员工宿舍搜寻）的联动，从招聘到定着实现一站式支援，这是四葉集团的优势。",
      to: "关于外国人员工雇用的咨询也很多。在留资格的申请文件制作由四葉行政書士事務所，员工宿舍的物件搜寻由四葉不動産株式会社，各自另行签约承办。您可以通过单一窗口咨询。",
      note: "★同上。「同じ窓口」は可（2026-07-29 石井弁護士確認）だが分離受任を併記する",
    },
    {
      path: "labor.aboutPage.highlights.status.value",
      from: "法人化 筹备中",
      to: "个人事务所",
      note: "「法人化 準備中」→ 個人事務所。法人化の予定はない",
    },
    {
      path: "labor.aboutPage.officeInfo.1.value",
      from: "四葉社会保険労務士法人（筹备中）",
      to: "四葉社会保険労務士事務所",
      note: "事業体名。法人→事務所",
    },
    {
      path: "labor.aboutPage.officeInfo.8.value",
      from: "法人化正在筹备中。目前作为四葉グループ提供服务。",
      to: "与四葉不動産株式会社・四葉行政書士事務所为各自独立的事业体。业务以单独合同承接。",
      note: "★「四葉グループとして対応」＝グループが労務を受けていると読める。分離受任の明示に置き換え",
    },
    {
      path: "labor.aboutPage.metaDescription",
      from: "四葉社会保険労務士法人（筹备中）的事务所概况与代表介绍。",
      to: "四葉社会保険労務士事務所的事务所概况与代表介绍。",
      note: "（設立準備中）を落とす",
    },
    {
      path: "labor.aboutPage.heroDescription1",
      from: "四葉社会保険労務士法人的事务所信息与代表介绍。",
      to: "四葉社会保険労務士事務所的事务所信息与代表介绍。",
      note: "法人→事務所",
    },
    {
      path: "labor.aboutPage.representativeBio2",
      from: "社会保险劳务士法人目前正在筹备设立中，但作为四葉グループ，我们已在受理社会保险・劳务相关咨询。与行政书士事务所・不动产联动，也在积极支持外国人雇用。",
      to: "四葉社会保険労務士事務所受理社会保险・劳务相关咨询。在留资格的申请文件制作由四葉行政書士事務所，员工宿舍的物件搜寻由四葉不動産株式会社，各自另行签约承办。也积极支持外国人雇用。",
      note: "★「法人の設立は準備中だが四葉グループとして労務相談を承っている」＝法27条の観点で最も危険。主語を事務所にし分離受任を明示",
    },
    {
      path: "labor.columnPage.metaDescription",
      from: "四葉社会保険労務士法人的专栏。社会保险、助成金、劳务管理等，为您提供人事・劳务相关的实用资讯。",
      to: "四葉社会保険労務士事務所的专栏。社会保险、助成金、劳务管理等，为您提供人事・劳务相关的实用资讯。",
      note: "法人→事務所",
    },
  ],
};

/**
 * コラム本文の部分置換パッチ（slug "*" ＝全コラム）。
 *
 * ★ 適用は配列順。**長い語句を先に置くこと。**
 *   先に「社会保険労務士試験合格」を処理すると、
 *   「社会保険労務士試験合格・2026年9月開業予定」のような複合形を拾えなくなる。
 *
 * ★ 4書体すべてを列挙すること。日本語だけを見ると必ず取りこぼす
 *   （2026年8月に同じ失敗を3回している。正本スキル 第13条）。
 */
export type SrLaunchColumnPatch = { from: string; to: string; note?: string };

export const SR_LAUNCH_COLUMN_PATCHES: SrLaunchColumnPatch[] = [
  // ── 長い複合形を先に ──────────────────────────────
  {
    from: "四葉社会保険労務士事務所は2026年9月開業予定・現時点では未開業",
    to: `四葉社会保険労務士事務所（登録番号第${N}号）`,
    note: "/column/kikoku-karikage-shataku-shain 等の本文",
  },
  {
    from: "四葉社会保険労務士事務所（預定2026年9月開業・現階段尚未開業）",
    to: `四葉社会保険労務士事務所（登錄號第${N}號）`,
    note: "zh-tw。事務所名が日本語表記のままである点は現状維持",
  },
  {
    from: "四葉社会保険労務士事務所（预定2026年9月开业・现阶段尚未开业）",
    to: `四葉社会保険労務士事務所（登录号第${N}号）`,
  },
  {
    from: "社会保険労務士業務は2026年9月の開業までお受けできません",
    to: "社会保険労務士業務は四葉社会保険労務士事務所が別契約で承ります",
    note: "「お受けできません」は開業後は誤り。CannotHandle 相当の文言がコラムにも入っている",
  },
  {
    from: "社會保險勞務士（日本語：社会保険労務士）業務在2026年9月開業之前無法受理",
    to: "社會保險勞務士（日本語：社会保険労務士）業務由四葉社会保険労務士事務所另行簽約承辦",
  },
  {
    from: "社会保险劳务士（日本語：社会保険労務士）业务在2026年9月开业之前无法受理",
    to: "社会保险劳务士（日本語：社会保険労務士）业务由四葉社会保険労務士事務所另行签约承办",
  },
  {
    from: "社会保険労務士試験合格・2026年9月開業予定",
    to: `社会保険労務士・登録番号第${N}号`,
    note: "著者紹介の中黒つなぎ形",
  },
  {
    from: "社會保險勞務士考試合格・預定2026年9月開業",
    to: `社會保險勞務士・登錄號第${N}號`,
  },
  {
    from: "社会保险劳务士考试合格・预定2026年9月开业",
    to: `社会保险劳务士・登录号第${N}号`,
  },
  {
    from: "登録番号 第25087022号、社会保険労務士試験合格（2026年9月開業予定）",
    to: `登録番号 第25087022号、社会保険労務士 登録番号第${N}号`,
  },
  {
    from: "登錄號　第25087022號、社會保險勞務士考試合格（預定2026年9月開業）",
    to: `登錄號　第25087022號、社會保險勞務士 登錄號第${N}號`,
  },
  {
    from: "登录号 第25087022号、社会保险劳务士考试合格（预定2026年9月开业）",
    to: `登录号 第25087022号、社会保险劳务士 登录号第${N}号`,
  },
  {
    from: "已通過社會保險勞務士考試（預定2026年9月開業）",
    to: `社會保險勞務士（登錄號第${N}號）`,
  },
  {
    from: "已通过社会保险劳务士考试（预定2026年9月开业）",
    to: `社会保险劳务士（登录号第${N}号）`,
  },
  {
    from: "Passed the Certified Social Insurance and Labor Consultant Examination (office opening September 2026)",
    to: `Certified Social Insurance and Labor Consultant (Registration No. ${N})`,
  },
  {
    from: "Certified Social Insurance and Labor Consultant Examination (office opening September 2026)",
    to: `Certified Social Insurance and Labor Consultant (Registration No. ${N})`,
  },
  // ── ★ 語順違い。完全一致だと落とすため個別に置く ──────────
  {
    from: "社會保險勞務士考試合格（2026年9月開業預定）",
    to: `社會保險勞務士（登錄號第${N}號）`,
    note: "★ /zh-tw/leaving-japan だけ語順が違う（他は「預定2026年9月開業」）。2026-08-09 実測",
  },
  // ── 一般形（最後に置く）─────────────────────────────
  {
    from: "社会保険労務士試験合格（2026年9月開業予定）",
    to: `社会保険労務士（登録番号第${N}号）`,
  },
  {
    from: "社會保險勞務士考試合格（預定2026年9月開業）",
    to: `社會保險勞務士（登錄號第${N}號）`,
  },
  {
    from: "社会保险劳务士考试合格（预定2026年9月开业）",
    to: `社会保险劳务士（登录号第${N}号）`,
  },
];

/**
 * 適用後スキャン用。**0件になること**を確認する。
 * 4書体すべてを入れる（正本スキル 第13条）。
 */
export const SR_LAUNCH_SCAN_TERMS: string[] = [
  // ja
  "2026年9月開業予定",
  "2026年9月開業",
  "開業までお受け",
  "社会保険労務士試験合格",
  // zh-tw
  "預定2026年9月開業",
  "2026年9月開業預定",
  "社會保險勞務士考試合格",
  "尚未開業",
  "無法受理",
  // zh
  "预定2026年9月开业",
  "社会保险劳务士考试合格",
  "尚未开业",
  "无法受理",
  // en
  "opening September 2026",
  "opening planned for September 2026",
  "scheduled to open",
  // プレースホルダー
  "【登録番号】",
];

/**
 * ★ 残すもの（**置換してはいけない**）。
 * ドライラン画面でも警告として表示する。
 */
export const SR_LAUNCH_KEEP_AS_IS: string[] = [
  "令和7年10月 社会保険労務士試験合格", // /about/uramatsu の経歴年表＝事実の記録
  "令和7年 第202500525号", // 試験合格番号。hasCredential は 9/1 に別途差し替える
];
