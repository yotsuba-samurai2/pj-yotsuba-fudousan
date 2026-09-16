import type { LangCode } from "@/config/languages";
import { SR_OFFICE_NAME } from "./sr-name";
import { SR_REGISTRATION_ID, SR_REGISTRATION_NUMBER } from "./sr-registration";

// 事務所名は4言語とも正式な日本語表記。氏名は既存フッターの資格表示に合わせる。
// 登録番号は代表個人の資格情報。事業会社・士業ドットコムの番号ではない。
const copy: Record<LangCode, { representative: string; registration: string }> = {
  ja: { representative: "代表社会保険労務士", registration: `登録番号：${SR_REGISTRATION_ID}` },
  en: { representative: "Principal Social Insurance and Labor Consultant", registration: `Registration No.: ${SR_REGISTRATION_NUMBER}` },
  "zh-tw": { representative: "代表社會保險勞務士", registration: `登錄號：第${SR_REGISTRATION_NUMBER}號` },
  zh: { representative: "代表社会保险劳务士", registration: `登录号：第${SR_REGISTRATION_NUMBER}号` },
};

export function footerSrRegistration(locale: LangCode): string {
  const text = copy[locale];
  return `${SR_OFFICE_NAME} ${text.representative} 浦松丈二　${text.registration}`;
}
