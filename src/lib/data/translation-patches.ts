/**
 * タスク0: 社労士全非表示・住所(2F→203)・営業時間統一・士業ドットコム表記 の
 * Firestore translations パッチ一覧（キックオフ タスク0）。
 *
 * scripts/backup-translations.ts で退避したバックアップ
 * （scripts/backup/translations-{locale}.json）から算出した「現在値→変更後の値」。
 * 現在値は安全確認用（適用直前に実際のFirestore値と一致するか照合し、
 * 一致しない場合はその項目だけスキップする）。
 *
 * 参照元: /admin/translations/fix-labor-mentions（ブラウザ管理画面からの一括適用）。
 */

export type TranslationPatch = { path: string; from: string; to: string };

export const TRANSLATION_PATCHES: Record<string, TranslationPatch[]> = {
  "ja": [
    {
      "path": "realestate.aboutPage.companyInfo.10.value",
      "from": "四葉行政書士事務所（代表行政書士 浦松丈二　登録番号：第25087022号）\n四葉社会保険労務士法人（浦松丈二　第202500525号）",
      "to": "四葉行政書士事務所（代表行政書士 浦松丈二　登録番号：第25087022号）"
    },
    {
      "path": "realestate.aboutPage.companyInfo.3.value",
      "from": "〒112-0006\n東京都文京区小日向4丁目2−5 小日向安田ビル 2F",
      "to": "〒112-0006\n東京都文京区小日向4丁目2−5 小日向安田ビル 203"
    },
    {
      "path": "realestate.aboutPage.companyInfo.7.value",
      "from": "9:00〜18:00（平日・土日）",
      "to": "10:00〜18:00（定休日：火曜、水曜）"
    },
    {
      "path": "realestate.aboutPage.highlights.qualifications.value",
      "from": "宅地建物取引士・行政書士・社会保険労務士",
      "to": "宅地建物取引士・行政書士"
    },
    {
      "path": "legal.aboutPage.highlights.qualifications.value",
      "from": "行政書士・宅地建物取引士・社会保険労務士",
      "to": "行政書士・宅地建物取引士"
    },
    {
      "path": "realestate.aboutPage.partnersDescription1",
      "from": "不動産・行政書士・社会保険労務士。",
      "to": "不動産・行政書士。"
    },
    {
      "path": "realestate.aboutPage.partnersDescription2",
      "from": "3つの事業が連携し、お客さまの課題をワンストップで解決します。",
      "to": "2つの事業が連携し、お客さまの課題をワンストップで解決します。"
    },
    {
      "path": "realestate.home.whyYotsuba.strengths.4.description",
      "from": "税理士・司法書士・社労士など、各分野の専門家と連携。複雑な案件もチームで対応します。",
      "to": "税理士・司法書士など、各分野の専門家と連携。複雑な案件もチームで対応します。"
    },
    {
      "path": "common.footer.samuraiName",
      "from": "士業ドットコム SAMURAI",
      "to": "士業ドットコム"
    },
    {
      "path": "legalNotice.items.2.value",
      "from": "〒112-0006 東京都文京区小日向4丁目2−5 小日向安田ビル 2F",
      "to": "〒112-0006 東京都文京区小日向4丁目2−5 小日向安田ビル 203"
    },
    {
      "path": "legalNotice.items.6.value",
      "from": "9:00〜18:00（平日・土日）",
      "to": "10:00〜18:00（定休日：火曜、水曜）"
    }
  ],
  "en": [
    {
      "path": "realestate.aboutPage.companyInfo.10.value",
      "from": "四葉行政書士事務所 (Chief Administrative Scrivener 浦松丈二　Registration No.: 第25087022号)\n四葉社会保険労務士法人 (浦松丈二　第202500525号)",
      "to": "四葉行政書士事務所 (Chief Administrative Scrivener 浦松丈二　Registration No.: 第25087022号)"
    },
    {
      "path": "realestate.aboutPage.companyInfo.3.value",
      "from": "〒112-0006\nKohinata 4-2-5, Bunkyo-ku, Tokyo, Kohinata Yasuda Bldg. 2F",
      "to": "〒112-0006\nKohinata 4-2-5, Bunkyo-ku, Tokyo, Kohinata Yasuda Bldg. 203"
    },
    {
      "path": "realestate.aboutPage.companyInfo.7.value",
      "from": "9:00 - 18:00 (Weekdays & Weekends)",
      "to": "10:00 - 18:00 (Regular Holidays: Tue & Wed)"
    },
    {
      "path": "realestate.aboutPage.highlights.qualifications.value",
      "from": "Licensed Real Estate Transaction Specialist, Administrative Scrivener (Gyoseishoshi), Certified Social Insurance and Labor Consultant (Sharoushi)",
      "to": "Licensed Real Estate Transaction Specialist, Administrative Scrivener (Gyoseishoshi)"
    },
    {
      "path": "legal.aboutPage.highlights.qualifications.value",
      "from": "Administrative Scrivener (Gyoseishoshi), Licensed Real Estate Transaction Specialist, Certified Social Insurance and Labor Consultant (Sharoushi)",
      "to": "Administrative Scrivener (Gyoseishoshi), Licensed Real Estate Transaction Specialist"
    },
    {
      "path": "realestate.aboutPage.partnersDescription1",
      "from": "Real estate, administrative scrivener, and social insurance & labor consulting.",
      "to": "Real estate and administrative scrivener."
    },
    {
      "path": "realestate.aboutPage.partnersDescription2",
      "from": "Three businesses working together to solve your challenges in one place.",
      "to": "Two businesses working together to solve your challenges in one place."
    },
    {
      "path": "realestate.home.whyYotsuba.strengths.4.description",
      "from": "We collaborate with tax accountants, judicial scriveners, labor consultants, and other specialists. Complex cases are handled as a team.",
      "to": "We collaborate with tax accountants, judicial scriveners, and other specialists. Complex cases are handled as a team."
    },
    {
      "path": "legalNotice.items.2.value",
      "from": "〒112-0006 Kohinata 4-2-5, Bunkyo-ku, Tokyo, Kohinata Yasuda Bldg. 2F",
      "to": "〒112-0006 Kohinata 4-2-5, Bunkyo-ku, Tokyo, Kohinata Yasuda Bldg. 203"
    },
    {
      "path": "legalNotice.items.6.value",
      "from": "9:00 - 18:00 (Weekdays & Weekends)",
      "to": "10:00 - 18:00 (Regular Holidays: Tue & Wed)"
    }
  ],
  "zh-tw": [
    {
      "path": "realestate.aboutPage.companyInfo.10.value",
      "from": "四葉行政書士事務所（代表行政書士 浦松丈二　登記號：第25087022號）\n四葉社會保險勞務士法人（浦松丈二　第202500525號）",
      "to": "四葉行政書士事務所（代表行政書士 浦松丈二　登記號：第25087022號）"
    },
    {
      "path": "realestate.aboutPage.companyInfo.3.value",
      "from": "〒112-0006\n東京都文京區小日向4丁目2−5 小日向安田ビル 2F",
      "to": "〒112-0006\n東京都文京區小日向4丁目2−5 小日向安田ビル 203"
    },
    {
      "path": "realestate.aboutPage.companyInfo.7.value",
      "from": "9:00〜18:00（工作日及週末）",
      "to": "10:00〜18:00（定休日：每周二、周三）"
    },
    {
      "path": "realestate.aboutPage.highlights.qualifications.value",
      "from": "不動產交易士・行政書士・社會保險勞務士",
      "to": "不動產交易士・行政書士"
    },
    {
      "path": "legal.aboutPage.highlights.qualifications.value",
      "from": "行政書士・不動產交易士・社會保險勞務士",
      "to": "行政書士・不動產交易士"
    },
    {
      "path": "realestate.aboutPage.partnersDescription1",
      "from": "不動產・行政書士・社會保險勞務士。",
      "to": "不動產・行政書士。"
    },
    {
      "path": "realestate.aboutPage.partnersDescription2",
      "from": "三大業務聯動，為客戶的問題提供一站式解決方案。",
      "to": "二大業務聯動，為客戶的問題提供一站式解決方案。"
    },
    {
      "path": "realestate.home.whyYotsuba.strengths.4.description",
      "from": "與稅理士・司法書士・社會保險勞務士等各領域專家協作。複雜案件也能團隊應對。",
      "to": "與稅理士・司法書士等各領域專家協作。複雜案件也能團隊應對。"
    },
    {
      "path": "common.footer.samuraiName",
      "from": "士業ドットコム SAMURAI",
      "to": "士業ドットコム"
    },
    {
      "path": "legalNotice.items.2.value",
      "from": "〒112-0006 東京都文京區小日向4丁目2−5 小日向安田ビル 2F",
      "to": "〒112-0006 東京都文京區小日向4丁目2−5 小日向安田ビル 203"
    },
    {
      "path": "legalNotice.items.6.value",
      "from": "9:00〜18:00（工作日及週末）",
      "to": "10:00〜18:00（定休日：每周二、周三）"
    }
  ],
  "zh": [
    {
      "path": "realestate.aboutPage.companyInfo.10.value",
      "from": "四葉行政書士事務所（代表行政书士 浦松丈二　登记号：第25087022号）\n四葉社会保険労務士法人（浦松丈二　第202500525号）",
      "to": "四葉行政書士事務所（代表行政书士 浦松丈二　登记号：第25087022号）"
    },
    {
      "path": "realestate.aboutPage.companyInfo.3.value",
      "from": "〒112-0006\n東京都文京区小日向4丁目2−5 小日向安田ビル 2F",
      "to": "〒112-0006\n東京都文京区小日向4丁目2−5 小日向安田ビル 203"
    },
    {
      "path": "realestate.aboutPage.companyInfo.7.value",
      "from": "9:00〜18:00（工作日及周末）",
      "to": "10:00〜18:00（公休日：星期二、星期三）"
    },
    {
      "path": "realestate.aboutPage.highlights.qualifications.value",
      "from": "不动产交易士・行政书士・社会保险劳务士",
      "to": "不动产交易士・行政书士"
    },
    {
      "path": "legal.aboutPage.highlights.qualifications.value",
      "from": "行政书士・不动产交易士・社会保险劳务士",
      "to": "行政书士・不动产交易士"
    },
    {
      "path": "realestate.aboutPage.partnersDescription1",
      "from": "不动产・行政书士・社会保险劳务士。",
      "to": "不动产・行政书士。"
    },
    {
      "path": "realestate.aboutPage.partnersDescription2",
      "from": "三大业务联动，为客户的问题提供一站式解决方案。",
      "to": "二大业务联动，为客户的问题提供一站式解决方案。"
    },
    {
      "path": "realestate.home.whyYotsuba.strengths.4.description",
      "from": "与税理士・司法书士・社会保险劳务士等各领域专家协作。复杂案件也能团队应对。",
      "to": "与税理士・司法书士等各领域专家协作。复杂案件也能团队应对。"
    },
    {
      "path": "common.footer.samuraiName",
      "from": "士业ドットコム SAMURAI",
      "to": "士业ドットコム"
    },
    {
      "path": "legalNotice.items.2.value",
      "from": "〒112-0006 東京都文京区小日向4丁目2−5 小日向安田ビル 2F",
      "to": "〒112-0006 東京都文京区小日向4丁目2−5 小日向安田ビル 203"
    },
    {
      "path": "legalNotice.items.6.value",
      "from": "9:00〜18:00（工作日及周末）",
      "to": "10:00〜18:00（公休日：星期二、星期三）"
    }
  ]
};
