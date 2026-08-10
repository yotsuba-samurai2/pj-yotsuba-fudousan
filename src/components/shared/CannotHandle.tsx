// CannotHandle — 「当社が対応できないこと」（タスクB-4・2026-07-19浦松確定文言）
// 業務ページ本文の下部、お問い合わせ導線（CtaBand・CTAセクション）の手前に置く。
// 文面は浦松確定＝一字一句変更しないこと（士業の業際・分離受任・紹介料授受なしの明示）。
// 社労士の「2026年9月の開業まで」の注記は必須（現時点では未開業）。
// 2026-07-19 C-6-2（浦松指示）：中国語版でも本表示を出す＝業際・分離受任・紹介料授受なし・
//   社労士2026年9月開業予定の注記は中国語圏読者にこそ必要なコンプライアンス表示。
//   訳は日本語確定文言の逐語訳＝事実の追加・削除をしない。資格名は原語を保持し役割説明を添える
//   （訳語は /global/chinese C-6-1 の確定訳に統一＝司法書士・税理士・行政書士の表記）。
//   2026-07-20（翻訳チェック§C/§E）：/en も対応＝下記 TEXT.en / ARIA.en を追加（逐語訳）。
// 既定は日本語（locale 未指定＝ja＝既存の全呼び出し元で出力は不変）。
//
// 2026-08-09：**開業（SR_LAUNCHED=true）で社労士の一文が自動的に切り替わるようにした。**
//   開業後も「2026年9月の開業までお受けできません」が残ると事実に反する。
//   本番実測（全277URL）で ja 10件・zh-tw 4件が出ていた（20B 第3-2節）。
//   env 1行の切替で、未開業版 → 開業版 に入れ替わる。
import { SR_LAUNCHED } from "@/lib/shared/office";
import type { LangCode } from "@/config/languages";

/**
 * 社労士に関する一文。開業前と開業後で入れ替える。
 * **事務所名は書かない**（法27条のソース漏れ対策＝SR_OFFICE_NAME 経由でないリテラルを置かない）。
 */
const SR_SENTENCE_BEFORE: Partial<Record<LangCode, string>> = {
  ja: "社会保険労務士業務は2026年9月の開業までお受けできません。",
  en: "Licensed social insurance and labor consultant (社会保険労務士) services cannot be accepted until our office opens in September 2026.",
  "zh-tw": "社會保險勞務士（日本語：社会保険労務士）業務在2026年9月開業之前無法受理。",
  zh: "社会保险劳务士（日本語：社会保険労務士）业务在2026年9月开业之前无法受理。",
};

const SR_SENTENCE_AFTER: Partial<Record<LangCode, string>> = {
  ja: "社会保険労務士業務は、併設の社会保険労務士事務所が別契約で承ります。",
  en: "Licensed social insurance and labor consultant (社会保険労務士) services are undertaken by the affiliated office under a separate contract.",
  "zh-tw": "社會保險勞務士（日本語：社会保険労務士）業務由附設的社會保險勞務士事務所另行簽約承辦。",
  zh: "社会保险劳务士（日本語：社会保険労務士）业务由附设的社会保险劳务士事务所另行签约承办。",
};

/** 社労士の一文を除いた本文（前半・後半で挟む） */
const HEAD: Partial<Record<LangCode, string>> = {
  // 2026-07-29 浦松指示：「受任します」→「おつなぎします」。他事務所の受任を当社が約束する形にしない。
  // あわせて「提携司法書士」「提携税理士」の「提携」を削除（U12＝2026-08-06 に「書面はない」で確定）。
  ja: "当社が対応できないこと：紛争性のある相続案件の代理交渉（弁護士におつなぎします）、不動産登記の申請代理（司法書士におつなぎします）、相続税申告（税理士におつなぎします）。",
  en: "What our company cannot handle: representation and negotiation in contested inheritance disputes (we will connect you with an attorney); filing real estate registration on your behalf (we will connect you with a Judicial Scrivener (司法書士)); and inheritance tax filing (we will connect you with a Tax Accountant (税理士)).",
  "zh-tw":
    "本公司無法承接的事項：具爭訟性之繼承案件的代理協商（將為您引介律師）、不動產登記的申請代理（將為您引介司法書士〔日本的登記申請代理專業資格〕）、遺產稅申報（將為您引介稅理士〔日本的稅務專業資格〕）。",
  zh: "本公司无法承接的事项：具争议性之继承案件的代理协商（将为您引介律师）、不动产登记的申请代理（将为您引介司法书士〔日本的登记申请代理专业资格〕）、遗产税申报（将为您引介税理士〔日本的税务专业资格〕）。",
};

const TAIL: Partial<Record<LangCode, string>> = {
  ja: "各専門家とは分離受任・個別契約であり、当社が紹介料を受け取ることはありません。",
  en: "Each specialist is engaged under a separate, individual contract, and our company does not receive any referral fee.",
  "zh-tw": "與各專家均為分離受任・個別簽約，本公司不會收取介紹費。",
  zh: "与各专家均为分离受任・个别签约，本公司不会收取介绍费。",
};

/**
 * 開業状態に応じた全文を組み立てる。
 *
 * 文の区切りは、日本語・中国語は句点で詰め、英語は半角スペースを入れる。
 * 切り出し前の確定文言と**一字一句同じ**になること（cannot-handle.test.ts が検査）。
 */
export function buildCannotHandleText(locale: LangCode, launched: boolean): string {
  const l = (m: Partial<Record<LangCode, string>>) => m[locale] ?? m.ja ?? "";
  const sep = locale === "en" ? " " : "";
  const sr = launched ? l(SR_SENTENCE_AFTER) : l(SR_SENTENCE_BEFORE);
  return [l(HEAD), sr, l(TAIL)].join(sep);
}

const ARIA: Partial<Record<LangCode, string>> = {
  ja: "当社が対応できないこと",
  en: "What our company cannot handle",
  "zh-tw": "本公司無法承接的事項",
  zh: "本公司无法承接的事项",
};

type Props = {
  /** 余白・最大幅を親に委ねるか（既定 false＝自前で mx-auto max-w-3xl px-4 を持つ） */
  bare?: boolean;
  /** 表示ロケール（既定 ja。未対応ロケール〔en〕は ja にフォールバック） */
  locale?: LangCode;
};

export function CannotHandle({ bare = false, locale = "ja" }: Props) {
  return (
    <section
      aria-label={ARIA[locale] ?? ARIA.ja}
      className={bare ? "" : "mx-auto max-w-3xl px-4 py-6"}
    >
      <p className="rounded-xl border border-border bg-surface p-4 text-sm leading-relaxed text-text-muted">
        {buildCannotHandleText(locale, SR_LAUNCHED)}
      </p>
    </section>
  );
}
