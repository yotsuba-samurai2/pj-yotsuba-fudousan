import { createHash } from "node:crypto";

/**
 * Pure, provider-agnostic state machine for the v1.2 contact-person email
 * workflow. The Gmail/会社メール connector owns transport; this module owns
 * recipient checks, idempotency, room matching, and safe answer extraction.
 */
export type Contact = { email: string; name?: string; company?: string };
export type InquiryQuestion = "availability" | "advertising" | "fees" | "conditions" | "correction";
export type Inquiry = {
  id: string;
  messageId?: string;
  building: string;
  address: string;
  unit: string;
  itandiRoomId: string;
  recipient: string;
  questions: InquiryQuestion[];
  createdAt: string;
  status: "draft" | "sent" | "answered" | "held";
};
export type ReplyClassification = {
  accepted: boolean;
  reason: "accepted" | "unknown-sender" | "wrong-room" | "ambiguous" | "contradiction" | "auto-reply";
  answers: Partial<Record<InquiryQuestion, string>>;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(value: string) {
  const email = value.trim().toLowerCase();
  return emailPattern.test(email) ? email : null;
}

export function isKnownRecipient(value: string, contacts: readonly Contact[]) {
  const email = normalizeEmail(value);
  return !!email && contacts.some((c) => normalizeEmail(c.email) === email);
}

export function inquiryId(input: Pick<Inquiry, "building" | "address" | "unit" | "itandiRoomId" | "recipient" | "questions">) {
  return createHash("sha256").update(JSON.stringify({ ...input, recipient: normalizeEmail(input.recipient), questions: [...input.questions].sort() })).digest("hex").slice(0, 32);
}

export function createInquiry(input: Omit<Inquiry, "id" | "status">, contacts: readonly Contact[]): Inquiry {
  const recipient = normalizeEmail(input.recipient);
  if (!recipient || !isKnownRecipient(recipient, contacts)) throw new Error("既知の担当者メールアドレス以外には照会できません");
  if (!input.questions.length) throw new Error("照会項目がありません");
  const base = { ...input, recipient };
  return { ...base, id: inquiryId(base), status: "draft" };
}

/** Do not send a duplicate when the provider timed out after accepting it. */
export function canSendInquiry(inquiry: Inquiry, sentIds: readonly string[]) {
  if (inquiry.status !== "draft") return { ok: false as const, reason: "既に送信済み・回答済み・保留です" };
  if (sentIds.includes(inquiry.id)) return { ok: false as const, reason: "同じ照会IDの送信履歴があります" };
  return { ok: true as const };
}

function containsAutoReply(text: string) {
  return /自動返信|auto\s*reply|out\s*of\s*office|不在通知/i.test(text);
}
function answerFor(text: string, question: InquiryQuestion) {
  const lines = text.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
  const hit = lines.find((line) => {
    if (question === "availability") return /募集中|募集終了|掲載中|終了/.test(line);
    if (question === "advertising") return /広告(?:掲載|転載)?\s*[可不可]|広告可否/.test(line);
    if (question === "fees") return /保証|保険|保証金|違約金|費用/.test(line);
    if (question === "conditions") return /外国人|法人|ペット|条件/.test(line);
    return /訂正|正しくは|変更/.test(line);
  });
  return hit;
}

export function classifyReply(reply: { from: string; to?: string; subject?: string; text: string }, inquiry: Inquiry, contacts: readonly Contact[]): ReplyClassification {
  if (!isKnownRecipient(reply.from, contacts)) return { accepted: false, reason: "unknown-sender", answers: {} };
  if (containsAutoReply(`${reply.subject ?? ""}\n${reply.text}`)) return { accepted: false, reason: "auto-reply", answers: {} };
  const idOrRoom = new RegExp(`(?:${inquiry.itandiRoomId}|${inquiry.unit.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`);
  if (!idOrRoom.test(reply.subject ?? "") && !idOrRoom.test(reply.text)) return { accepted: false, reason: "wrong-room", answers: {} };
  const answers: Partial<Record<InquiryQuestion, string>> = {};
  for (const question of inquiry.questions) {
    const answer = answerFor(reply.text, question);
    if (answer) answers[question] = answer;
  }
  if (!Object.keys(answers).length) return { accepted: false, reason: "ambiguous", answers };
  if (/一方では|旧情報|どちらが正しいか不明|確認できません/.test(reply.text)) return { accepted: false, reason: "contradiction", answers };
  return { accepted: true, reason: "accepted", answers };
}
