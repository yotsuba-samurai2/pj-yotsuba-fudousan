// CannotHandle — 「当社が対応できないこと」（タスクB-4・2026-07-19浦松確定文言）
// 業務ページ本文の下部、お問い合わせ導線（CtaBand・CTAセクション）の手前に置く。
// 文面は浦松確定＝一字一句変更しないこと（士業の業際・分離受任・紹介料授受なしの明示）。
// 社労士の「2026年9月の開業まで」の注記は必須（現時点では未開業）。
// 日本語版のみ（/en /zh-tw /zh では描画しない＝呼び出し側で locale を判定する）。
const TEXT =
  "当社が対応できないこと：紛争性のある相続案件の代理交渉（弁護士をご紹介します）、不動産登記の申請代理（提携司法書士が受任します）、相続税申告（提携税理士が受任します）。社会保険労務士業務は2026年9月の開業までお受けできません。各専門家とは分離受任・個別契約であり、当社が紹介料を受け取ることはありません。";

/** 余白・最大幅を親に委ねるか（既定 false＝自前で mx-auto max-w-3xl px-4 を持つ） */
type Props = { bare?: boolean };

export function CannotHandle({ bare = false }: Props) {
  return (
    <section
      aria-label="当社が対応できないこと"
      className={bare ? "" : "mx-auto max-w-3xl px-4 py-6"}
    >
      <p className="rounded-xl border border-border bg-surface p-4 text-sm leading-relaxed text-text-muted">
        {TEXT}
      </p>
    </section>
  );
}
