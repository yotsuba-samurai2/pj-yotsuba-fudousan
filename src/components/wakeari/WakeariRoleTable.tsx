// WakeariRoleTable — 「誰に相談すればよいですか」の役割表（/wakeari 配下5ページ共通・指示書 v2.0 5-4）。
// 型B（引用〇・名指し×）対策として、事業者主語の一文（WAKEARI_PROVIDER_SENTENCE・固定文言）を表の直前に置き、
// 表の直下に分離受任の一文（WAKEARI_SEPARATION_NOTE・固定文言）を必ず添える。
// section の class="wakeari-who" は SpeakableJsonLd の cssSelector と対にする（変更時は両方）。
import Link from "next/link";
import { ReH2 } from "@/components/shared/RealestateServicePage";
import {
  WAKEARI_PROVIDER_SENTENCE,
  WAKEARI_ROLE_ROWS,
  WAKEARI_SEPARATION_NOTE,
} from "@/lib/wakeari";

export function WakeariRoleTable() {
  return (
    <section className="wakeari-who" aria-label="誰に相談すればよいですか">
      <ReH2>誰に相談すればよいですか？</ReH2>
      <p className="mt-3 leading-relaxed text-text">{WAKEARI_PROVIDER_SENTENCE}</p>
      <p className="mt-3 leading-relaxed text-text">
        ご相談は一つの窓口でお受けしますが、業務は資格ごとに分かれます。<strong className="text-ink">どの作業を誰が担うか</strong>を先に示します。
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-primary-tint text-left">
              <th className="border border-border px-3 py-2">すること</th>
              <th className="border border-border px-3 py-2">誰が</th>
              <th className="border border-border px-3 py-2">備考</th>
            </tr>
          </thead>
          <tbody className="text-text">
            {WAKEARI_ROLE_ROWS.map((r) => (
              <tr key={r.what}>
                <td className="border border-border px-3 py-2">
                  {r.ours ? <strong className="text-ink">{r.what}</strong> : r.what}
                </td>
                <td className="border border-border px-3 py-2">
                  {r.ours ? <strong className="text-ink">{r.who}</strong> : r.who}
                </td>
                <td className="border border-border px-3 py-2">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-text">{WAKEARI_SEPARATION_NOTE}</p>
      <p className="mt-3 text-sm leading-relaxed text-text-muted">
        代表・浦松丈二の経歴と資格は
        <Link href="/about/uramatsu" className="text-primary underline">
          代表プロフィール
        </Link>
        に、費用の考え方は
        <Link href="/ryokin" className="text-primary underline">
          料金のご案内
        </Link>
        にまとめています。
      </p>
    </section>
  );
}
