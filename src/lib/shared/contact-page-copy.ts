import type { LangCode } from "@/config/languages";
import type { BusinessKey } from "@/lib/shared/office-public";

// Server page copy: keep metadata, headings and contact details in the URL's locale.
// The existing ContactForm remains responsible for translated fields and submission.
export const CONTACT_LABELS: Record<LangCode, {
  home: string;
  title: string;
  methods: string;
  phone: string;
  fax: string;
  location: string;
  address: string;
  building: string;
  booking: string;
  bookingLink: string;
  hoursLabel: string;
  hours: string;
}> = {
  ja: {
    home: "ホーム", title: "お問い合わせ", methods: "お問い合わせ方法",
    phone: "お電話", fax: "FAX", location: "所在地",
    address: "東京都文京区小日向４丁目２－５", building: "小日向安田ビル ２０３",
    booking: "オンライン予約", bookingLink: "士業ドットコム予約ページへ →",
    hoursLabel: "営業時間", hours: "火・水 10:00〜19:00 ／ 月・木・金・土・日 18:00〜19:00",
  },
  en: {
    home: "Home", title: "Contact", methods: "How to Contact Us",
    phone: "Phone", fax: "Fax", location: "Address",
    address: "4-2-5 Kohinata, Bunkyo-ku, Tokyo", building: "Kohinata Yasuda Building, Room 203",
    booking: "Online Booking", bookingLink: "Book through Samurai →",
    hoursLabel: "Office Hours", hours: "Tue–Wed 10:00–19:00 / Mon, Thu–Sun 18:00–19:00 (Japan time)",
  },
  "zh-tw": {
    home: "首頁", title: "聯絡我們", methods: "聯絡方式",
    phone: "電話", fax: "傳真", location: "地址",
    address: "東京都文京區小日向4-2-5", building: "小日向安田大樓203室",
    booking: "線上預約", bookingLink: "前往士業ドットコム預約頁面 →",
    hoursLabel: "營業時間", hours: "週二、週三 10:00–19:00 ／ 週一、週四至週日 18:00–19:00（日本時間）",
  },
  zh: {
    home: "首页", title: "联系我们", methods: "联系方式",
    phone: "电话", fax: "传真", location: "地址",
    address: "东京都文京区小日向4-2-5", building: "小日向安田大楼203室",
    booking: "在线预约", bookingLink: "前往士業ドットコム预约页面 →",
    hoursLabel: "营业时间", hours: "周二、周三 10:00–19:00 ／ 周一、周四至周日 18:00–19:00（日本时间）",
  },
};

type ContactMetadata = { title: string; description: string; keywords?: string[] };

export const CONTACT_METADATA: Record<BusinessKey, Record<LangCode, ContactMetadata>> = {
  realestate: {
    ja: {
      title: "お問い合わせ（相談無料）",
      description: "住まい探し・契約・相続不動産のご相談に四葉不動産が対応。ビザ・相続書類は併設の四葉行政書士事務所が別契約で受任します。多言語（日本語・英語・中国語繁体字・中国語簡体字）対応、電話・お問い合わせフォームから受付。ご相談は無料、四葉不動産までお気軽にどうぞ。",
      keywords: ["不動産 相談", "不動産屋 問い合わせ", "不動産 相談 無料", "多言語 不動産 東京", "四葉不動産 連絡先"],
    },
    en: {
      title: "Contact — Free Consultation",
      description: "Contact Yotsuba Real Estate about finding a home, property contracts or inherited property. Visa and inheritance documents are handled separately by Yotsuba Gyoseishoshi Office under a separate engagement. Free consultations by phone or form in Japanese, English, Traditional Chinese and Simplified Chinese.",
      keywords: ["real estate consultation", "contact real estate agency", "free property consultation", "multilingual real estate Tokyo", "Yotsuba Real Estate contact"],
    },
    "zh-tw": {
      title: "聯絡我們（免費諮詢）",
      description: "四葉不動産提供找房、房產契約及繼承不動產的諮詢。簽證與繼承文件由併設的四葉行政書士事務所以獨立契約承接。支援日語、英語、繁體中文及簡體中文，可透過電話或表單免費諮詢。",
      keywords: ["不動產諮詢", "聯絡不動產仲介", "免費房產諮詢", "東京多語言不動產", "四葉不動産聯絡方式"],
    },
    zh: {
      title: "联系我们（免费咨询）",
      description: "四葉不動産提供找房、房产合同及继承不动产的咨询。签证与继承文件由并设的四葉行政書士事務所以独立合同承接。支持日语、英语、繁体中文及简体中文，可通过电话或表单免费咨询。",
      keywords: ["不动产咨询", "联系房产中介", "免费房产咨询", "东京多语言不动产", "四葉不動産联系方式"],
    },
  },
  legal: {
    ja: {
      title: "お問い合わせ",
      description: "補助金の申請書作成、ビザ・在留資格、会社設立、各種許認可のご相談はこちら。相談無料、電話・お問い合わせフォームで受付。文京区の四葉行政書士事務所が迅速・丁寧にお答えします。お気軽にどうぞ。",
    },
    en: {
      title: "Contact",
      description: "Contact Yotsuba Gyoseishoshi Office in Bunkyo, Tokyo about preparing subsidy applications, visas and residence status, company formation, licences and permits. Free consultations by phone or contact form, with prompt and attentive support.",
    },
    "zh-tw": {
      title: "聯絡我們",
      description: "如需製作補助金申請文件，或諮詢簽證、在留資格、公司設立及各類許可，歡迎聯絡文京區的四葉行政書士事務所。可透過電話或表單免費諮詢，我們將迅速、細心地回覆。",
    },
    zh: {
      title: "联系我们",
      description: "如需制作补助金申请文件，或咨询签证、在留资格、公司设立及各类许可，欢迎联系文京区的四葉行政書士事務所。可通过电话或表单免费咨询，我们将及时、细致地回复。",
    },
  },
  labor: {
    ja: {
      title: "お問い合わせ",
      description: "社会保険手続き、助成金活用、就業規則の相談はこちら。電話・フォーム・オンライン予約で対応。文京区の四葉社会保険労務士事務所。",
    },
    en: {
      title: "Contact",
      description: "Contact Yotsuba Sharoushi Office in Bunkyo, Tokyo about social insurance procedures, employment subsidies and work rules. Reach us by phone, contact form or online booking.",
    },
    "zh-tw": {
      title: "聯絡我們",
      description: "歡迎向文京區的四葉社会保険労務士事務所諮詢社會保險手續、助成金運用及就業規則。可透過電話、表單或線上預約聯絡我們。",
    },
    zh: {
      title: "联系我们",
      description: "欢迎向文京区的四葉社会保険労務士事務所咨询社会保险手续、助成金运用及就业规则。可通过电话、表单或在线预约联系我们。",
    },
  },
};

export const CONTACT_INTRO: Record<"legal" | "labor", Record<LangCode, [string, string]>> = {
  legal: {
    ja: ["補助金、ビザ申請、会社設立など、どんなご相談でもお気軽にどうぞ。", "お電話・フォームからお問い合わせいただけます。"],
    en: ["Please contact us about subsidies, visa applications, company formation or other inquiries.", "You can reach us by phone or through the contact form."],
    "zh-tw": ["補助金、簽證申請、公司設立等各類問題，歡迎隨時諮詢。", "您可以透過電話或表單聯絡我們。"],
    zh: ["补助金、签证申请、公司设立等各类问题，欢迎随时咨询。", "您可以通过电话或表单联系我们。"],
  },
  labor: {
    ja: ["社会保険・労務管理・助成金申請など、どんなご相談でもお気軽にどうぞ。", "お電話・オンライン予約・フォームからお問い合わせいただけます。"],
    en: ["Please contact us about social insurance, labor management, employment subsidy applications or other inquiries.", "You can reach us by phone, online booking or through the contact form."],
    "zh-tw": ["社會保險、勞務管理、助成金申請等各類問題，歡迎隨時諮詢。", "您可以透過電話、線上預約或表單聯絡我們。"],
    zh: ["社会保险、劳务管理、助成金申请等各类问题，欢迎随时咨询。", "您可以通过电话、在线预约或表单联系我们。"],
  },
};
