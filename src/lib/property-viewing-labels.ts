import type { LangCode } from "@/config/languages";

const ja = {
  eyebrow: "内見・ご質問", heading: "内見可能日をお知らせください", intro: "ご希望の日程と契約条件をお送りください。募集状況を確認して担当者からご連絡します。",
  successHeading: "内見希望を受け付けました", success: "募集状況と内見可能日を確認し、メールと電話でご連絡します。", error: "送信できませんでした。時間をおいて再度お試しください。",
  name: "お名前", email: "メールアドレス", phone: "電話番号", contract: "契約主体", select: "選択してください", individual: "個人", company: "法人", residents: "入居予定人数", foreign: "外国籍の方ですか", yes: "はい", no: "いいえ", residence: "在留資格の種類", residenceExample: "例：技術・人文知識・国際業務", pets: "ペット", petNo: "なし", petYes: "あり", petDetails: "種類・頭数", petExample: "例：小型犬1匹", dates: "内見希望日時（第1希望は必須）", date1: "内見第1希望", date2: "内見第2希望", date3: "内見第3希望", message: "質問・連絡事項（任意）", sending: "送信中…", send: "内見希望を送る",
};
export const propertyViewingLabels = {
  ja,
  en: {
    eyebrow: "Viewings and questions", heading: "Tell us your preferred viewing dates", intro: "Send us your preferred dates and contract requirements. Our team will check availability and contact you.",
    successHeading: "Viewing request received", success: "We will check availability and viewing dates, then contact you by email and phone.", error: "Your request could not be sent. Please try again later.",
    name: "Name", email: "Email address", phone: "Phone number", contract: "Contracting party", select: "Please select", individual: "Individual", company: "Company", residents: "Number of intended occupants", foreign: "Are you a non-Japanese national?", yes: "Yes", no: "No", residence: "Status of residence", residenceExample: "e.g. Engineer / Specialist in Humanities / International Services", pets: "Pets", petNo: "None", petYes: "Yes", petDetails: "Type and number of pets", petExample: "e.g. one small dog", dates: "Preferred viewing dates (first choice required)", date1: "First viewing choice", date2: "Second viewing choice", date3: "Third viewing choice", message: "Questions or comments (optional)", sending: "Sending…", send: "Send viewing request",
  },
  "zh-tw": {
    eyebrow: "看屋・問題諮詢", heading: "請告知您方便看屋的日期", intro: "請提供希望的看屋時間與契約條件。我們確認物件供應狀況後，將由專人與您聯絡。",
    successHeading: "已收到您的看屋申請", success: "確認物件供應狀況及可看屋日期後，我們將以電子郵件及電話與您聯絡。", error: "未能送出申請，請稍後再試。",
    name: "姓名", email: "電子郵件", phone: "電話號碼", contract: "簽約主體", select: "請選擇", individual: "個人", company: "法人", residents: "預計入住人數", foreign: "您是否為非日本籍人士？", yes: "是", no: "否", residence: "在留資格種類", residenceExample: "例：技術・人文知識・國際業務", pets: "寵物", petNo: "無", petYes: "有", petDetails: "種類及數量", petExample: "例：1隻小型犬", dates: "希望的看屋日期與時間（第一志願必填）", date1: "看屋第一志願", date2: "看屋第二志願", date3: "看屋第三志願", message: "問題或備註（選填）", sending: "傳送中…", send: "送出看屋申請",
  },
  zh: {
    eyebrow: "看房・问题咨询", heading: "请告知您方便看房的日期", intro: "请提供希望的看房时间与合同条件。我们确认房源供应情况后，将由专人与您联系。",
    successHeading: "已收到您的看房申请", success: "确认房源供应情况及可看房日期后，我们将通过电子邮件及电话与您联系。", error: "未能发送申请，请稍后再试。",
    name: "姓名", email: "电子邮件", phone: "电话号码", contract: "签约主体", select: "请选择", individual: "个人", company: "法人", residents: "预计入住人数", foreign: "您是否为非日本籍人士？", yes: "是", no: "否", residence: "在留资格类型", residenceExample: "例：技术・人文知识・国际业务", pets: "宠物", petNo: "无", petYes: "有", petDetails: "种类及数量", petExample: "例：1只小型犬", dates: "希望的看房日期与时间（第一意向必填）", date1: "看房第一意向", date2: "看房第二意向", date3: "看房第三意向", message: "问题或备注（选填）", sending: "发送中…", send: "发送看房申请",
  },
} satisfies Record<LangCode, Record<keyof typeof ja, string>>;
