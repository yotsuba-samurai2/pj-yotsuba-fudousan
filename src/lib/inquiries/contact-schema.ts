import { z } from "zod";

export const businessLabels: Record<string, string> = {
  realestate: "四葉不動産",
  legal: "四葉行政書士事務所",
  labor: "四葉社会保険労務士事務所",
};

export const categoryLabels: Record<string, string> = {
  // 2026-07-24 CTA刷新v2：物件条件インテーク（CTA帯 ?intent=bukken の受け皿）
  bukken: "物件を探してほしい（希望条件）",
  rental: "賃貸のご相談",
  sale: "売買のご相談",
  management: "管理のご相談",
  subsidy: "補助金・助成金",
  visa: "ビザ・在留資格",
  labor: "社会保険・労務",
  // 2026-07-27：相談カテゴリの拡充（表示ラベルの正本は src/lib/shared/contact-intake.ts）
  souzoku: "相続した不動産のこと（貸す・売る・活用する）",
  akiya: "空き家のこと",
  // 2026-09-23：売りにくい土地・建物の出口相談（/wakeari）。通知メールに生の値が出ないよう表示名を持つ
  wakeari: "売りにくい土地・建物（再建築不可・共有・借地・狭小地）",
  // 2026-09-24：大家募集ページ（/group-home/ooya）の専用フォーム（物件項目は message に整形済み）
  "gh-owner": "グループホーム向けに物件を貸したい（大家・オーナー）",
  "foreign-housing": "外国人のお部屋探し・多言語対応",
  "souzoku-legal": "相続・遺言・信託",
  oyanakiato: "親なき後の備え",
  "shogai-fukushi": "障害福祉サービスの許認可（事業者）",
  "gaikokujin-shain": "外国人社員の受け入れ（企業）",
  "kikoku-funin": "帰国・赴任の手続き",
  kyoninka: "会社設立・各種許認可",
  other: "その他",
};

// 2026-07-27：流入元（任意）。AI検索→受任の接続を測る結果指標。
// 「AIに聞いて」と「検索結果」は必ず分ける（一括りにすると測定にならない）。
export const sourceLabels: Record<string, string> = {
  ai: "ChatGPT・Claude などのAIに聞いて",
  search: "Googleなどの検索結果",
  map: "Googleマップ",
  samurai: "士業ドットコム",
  referral: "知人・お客様のご紹介",
  sns: "SNS・note",
  known: "以前から知っていた",
  other: "その他",
};

const EMAIL_MESSAGE = "有効なメールアドレスを入力してください";
const emailField = z.string().email(EMAIL_MESSAGE);

/**
 * 2026-09-24：大家募集ページ（/group-home/ooya）の専用フォームは「メールまたは電話のどちらか必須」
 * （指示書 v1.0 第6章 6-1＝入力のハードルを下げる）。この category のときだけ、電話があればメール未入力を許す。
 * それ以外の category は従来どおりメール必須＝既存フォームの挙動は変えない。
 */
const EMAIL_OPTIONAL_CATEGORY = "gh-owner";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "お名前を入力してください").max(200),
  email: z.string().trim().max(320).optional().default(""),
  phone: z.string().trim().max(80).optional().default(""),
  category: z.string().min(1, "ご相談内容を選択してください").max(40).refine(v => Object.hasOwn(categoryLabels, v), "ご相談内容を確認してください"),
  // 2026-07-27：流入元は任意（未選択でも送信できる）
  source: z.string().max(40).refine(v => !v || Object.hasOwn(sourceLabels, v), "きっかけを確認してください").optional().default(""),
  message: z.string().trim().min(1, "お問い合わせ内容を入力してください").max(12000),
  business: z.enum(["realestate", "legal", "labor"]).optional().default("realestate"),
}).superRefine((value, ctx) => {
  if (value.email.trim()) {
    if (!emailField.safeParse(value.email).success) {
      ctx.addIssue({ code: "custom", path: ["email"], message: EMAIL_MESSAGE });
    }
  } else if (value.category === EMAIL_OPTIONAL_CATEGORY) {
    if (!value.phone.trim()) {
      ctx.addIssue({ code: "custom", path: ["email"], message: "メールアドレスまたは電話番号を入力してください" });
    }
  } else {
    ctx.addIssue({ code: "custom", path: ["email"], message: EMAIL_MESSAGE });
  }
  // 物件ページの内見CTAは、日程調整に必要な電話番号を必須にする。
  if (value.category === "rental" && !value.phone.trim()) {
    ctx.addIssue({ code: "custom", path: ["phone"], message: "電話番号を入力してください" });
  }
});


export type ContactFields = z.infer<typeof contactSchema>;
