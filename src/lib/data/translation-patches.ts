/**
 * タスク0: legal.aboutPage.officeInfo[6]（士業の営業時間）の再適用パッチ。
 *
 * 経緯: 旧版のパッチ（不動産の営業時間を誤って流用）が一度適用され、Firestoreの
 * 実値がその誤った中間値になっていた。以後のバージョンで to は正しい値に修正したが、
 * from（適用前の想定値）が古いままだったため safety check に弾かれ再適用できずにいた。
 * 2026-07-08、本番Firestoreの実値を全項目読み直し、既に正しい最終値になっている58項目
 * （住所の全角２０３・社労士言及の削除・士業ドットコム表記 等）は対象から除外し、
 * ズレが残っていたこの1項目（4ロケール）のみを対象に、from を実際の現在値へ更新した。
 *
 * 参照元: /admin/translations/fix-labor-mentions（ブラウザ管理画面からの一括適用）。
 */

export type TranslationPatch = { path: string; from: string; to: string };

export const TRANSLATION_PATCHES: Record<string, TranslationPatch[]> = {
  "ja": [
    {
      "path": "legal.aboutPage.officeInfo.6.value",
      "from": "10:00〜18:00（定休日：火曜、水曜）",
      "to": "火・水 10:00〜19:00 ／ 月・木・金・土・日 18:00〜19:00"
    }
  ],
  "en": [
    {
      "path": "legal.aboutPage.officeInfo.6.value",
      "from": "10:00 - 18:00 (Regular Holidays: Tue & Wed)",
      "to": "Tue & Wed 10:00 - 19:00 / Mon, Thu, Fri, Sat & Sun 18:00 - 19:00"
    }
  ],
  "zh-tw": [
    {
      "path": "legal.aboutPage.officeInfo.6.value",
      "from": "10:00〜18:00（定休日：每周二、周三）",
      "to": "周二・周三 10:00〜19:00／周一・周四・周五・周六・周日 18:00〜19:00"
    }
  ],
  "zh": [
    {
      "path": "legal.aboutPage.officeInfo.6.value",
      "from": "10:00〜18:00（公休日：星期二、星期三）",
      "to": "周二・周三 10:00〜19:00／周一・周四・周五・周六・周日 18:00〜19:00"
    }
  ]
};
