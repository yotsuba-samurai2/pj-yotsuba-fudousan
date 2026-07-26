import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const NOTIFY_TO = "uramatsujoji@luck428.com";
const FROM_EMAIL = "noreply@samurai.co.jp";

const businessLabels: Record<string, string> = {
  realestate: "四葉不動産",
  legal: "四葉行政書士事務所",
  labor: "四葉社会保険労務士事務所",
};

const categoryLabels: Record<string, string> = {
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
const sourceLabels: Record<string, string> = {
  ai: "ChatGPT・Claude などのAIに聞いて",
  search: "Googleなどの検索結果",
  map: "Googleマップ",
  samurai: "士業ドットコム",
  referral: "知人・お客様のご紹介",
  sns: "SNS・note",
  known: "以前から知っていた",
  other: "その他",
};

const contactSchema = z.object({
  name: z.string().min(1, "お名前を入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  phone: z.string().optional().default(""),
  category: z.string().min(1, "ご相談内容を選択してください"),
  // 2026-07-27：流入元は任意（未選択でも送信できる）
  source: z.string().optional().default(""),
  message: z.string().min(1, "お問い合わせ内容を入力してください"),
  business: z.string().optional().default("realestate"),
});

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br />");
}

function adminEmailHtml({
  name,
  email,
  phone,
  categoryLabel,
  sourceLabel,
  message,
  businessLabel,
}: {
  name: string;
  email: string;
  phone: string;
  categoryLabel: string;
  sourceLabel: string;
  message: string;
  businessLabel: string;
}) {
  return `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width" /></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Helvetica Neue',Arial,'Hiragino Sans',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <!-- Header -->
        <tr>
          <td style="padding:28px 32px;border-bottom:1px solid #e5e7eb;">
            <h1 style="margin:0;color:#1f2937;font-size:18px;font-weight:700;">新しいお問い合わせ</h1>
            <p style="margin:6px 0 0;color:#6b7280;font-size:13px;">${escapeHtml(businessLabel)} 経由</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:28px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#1f2937;">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#6b7280;width:120px;vertical-align:top;">お名前</td>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-weight:600;">${escapeHtml(name)}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#6b7280;vertical-align:top;">メール</td>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;"><a href="mailto:${escapeHtml(email)}" style="color:#16a34a;text-decoration:none;">${escapeHtml(email)}</a></td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#6b7280;vertical-align:top;">電話番号</td>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;">${phone ? escapeHtml(phone) : '<span style="color:#9ca3af;">未入力</span>'}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#6b7280;vertical-align:top;">ご相談内容</td>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;">${escapeHtml(categoryLabel)}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#6b7280;vertical-align:top;">きっかけ</td>
                <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;">${escapeHtml(sourceLabel)}</td>
              </tr>
            </table>
            <!-- Message -->
            <div style="margin-top:20px;padding:16px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;">
              <p style="margin:0 0 8px;font-size:12px;color:#6b7280;font-weight:600;">メッセージ</p>
              <p style="margin:0;font-size:14px;color:#1f2937;line-height:1.7;">${escapeHtml(message)}</p>
            </div>
            <!-- Reply button -->
            <div style="margin-top:24px;text-align:center;">
              <a href="mailto:${escapeHtml(email)}?subject=Re: お問い合わせありがとうございます" style="display:inline-block;background:#16a34a;color:#ffffff;padding:12px 32px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">返信する</a>
            </div>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:16px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:11px;color:#9ca3af;text-align:center;">このメールはお問い合わせフォームから自動送信されています。</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function autoReplyHtml({
  name,
  email,
  phone,
  categoryLabel,
  message,
  businessLabel,
}: {
  name: string;
  email: string;
  phone: string;
  categoryLabel: string;
  message: string;
  businessLabel: string;
}) {
  return `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width" /></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Helvetica Neue',Arial,'Hiragino Sans',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <!-- Header -->
        <tr>
          <td style="padding:28px 32px;border-bottom:1px solid #e5e7eb;text-align:center;">
            <h1 style="margin:0;color:#1f2937;font-size:18px;font-weight:700;">お問い合わせありがとうございます</h1>
            <p style="margin:6px 0 0;color:#6b7280;font-size:13px;">${escapeHtml(businessLabel)}</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:28px 32px;">
            <p style="margin:0 0 16px;font-size:15px;color:#1f2937;line-height:1.8;">
              ${escapeHtml(name)} 様
            </p>
            <p style="margin:0 0 24px;font-size:14px;color:#374151;line-height:1.8;">
              この度はお問い合わせいただき、誠にありがとうございます。<br />
              以下の内容でお問い合わせを受け付けました。<br />
              <strong>2営業日以内</strong>にご返信いたしますので、しばらくお待ちください。
            </p>
            <!-- Inquiry details -->
            <div style="padding:20px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;">
              <p style="margin:0 0 12px;font-size:13px;color:#374151;font-weight:700;">お問い合わせ内容</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;color:#1f2937;">
                <tr>
                  <td style="padding:6px 0;color:#6b7280;width:110px;vertical-align:top;">お名前</td>
                  <td style="padding:6px 0;">${escapeHtml(name)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#6b7280;vertical-align:top;">メール</td>
                  <td style="padding:6px 0;">${escapeHtml(email)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#6b7280;vertical-align:top;">電話番号</td>
                  <td style="padding:6px 0;">${phone ? escapeHtml(phone) : "未入力"}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#6b7280;vertical-align:top;">ご相談内容</td>
                  <td style="padding:6px 0;">${escapeHtml(categoryLabel)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#6b7280;vertical-align:top;">メッセージ</td>
                  <td style="padding:6px 0;line-height:1.7;">${escapeHtml(message)}</td>
                </tr>
              </table>
            </div>
            <!-- Note -->
            <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;line-height:1.7;">
              ※ このメールはお問い合わせの確認として自動送信されています。<br />
              ※ お心当たりのない場合はお手数ですが本メールを破棄してください。
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;">
            <p style="margin:0 0 4px;font-size:13px;color:#374151;font-weight:600;">${escapeHtml(businessLabel)}</p>
            <p style="margin:0;font-size:12px;color:#9ca3af;">
              〒112-0006 東京都文京区小日向４丁目２－５ 小日向安田ビル ２０３<br />
              TEL: 03-6161-9428
            </p>
            <div style="margin-top:12px;">
              <a href="https://luck428.com" style="font-size:12px;color:#16a34a;text-decoration:none;">luck428.com</a>
            </div>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return NextResponse.json({ errors }, { status: 400 });
    }

    const { name, email, phone, category, source, message, business } = result.data;
    const categoryLabel = categoryLabels[category] ?? category;
    const businessLabel = businessLabels[business] ?? business;
    // 任意項目のため未選択があり得る。集計時に「未回答」を分母から外せるよう明示する。
    const sourceLabel = source ? (sourceLabels[source] ?? source) : "未回答";

    // 管理者への通知メール
    await getResend().emails.send({
      from: `${businessLabel} <${FROM_EMAIL}>`,
      to: NOTIFY_TO,
      subject: `【お問い合わせ】${categoryLabel} - ${name}様`,
      replyTo: email,
      html: adminEmailHtml({
        name,
        email,
        phone,
        categoryLabel,
        sourceLabel,
        message,
        businessLabel,
      }),
    });

    // お客様への自動返信メール
    await getResend().emails.send({
      from: `${businessLabel} <${FROM_EMAIL}>`,
      to: email,
      subject: `【${businessLabel}】お問い合わせありがとうございます`,
      html: autoReplyHtml({
        name,
        email,
        phone,
        categoryLabel,
        message,
        businessLabel,
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "送信に失敗しました。しばらく経ってからお試しください。" },
      { status: 500 },
    );
  }
}
