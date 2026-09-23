// WakeariSources — 「この記事の根拠」表（/wakeari 配下5ページ共通の体裁・型の8番目）。
// 法令名＋条＋項＋号、施行日と最終改正を併記する（shigyo-compliance-gate 第4条）。
// 最終改正は、e-Gov 法令API v2 で取得した「現行版の施行日」を法令ごとに併記する（WAKEARI_LAW_REVISIONS）。
// 署名（型の9番目）＝/about/uramatsu へのリンクと dateModified の可視表示も、この部品でページ末に置く。
import Link from "next/link";
import { ReH2 } from "@/components/shared/RealestateServicePage";
import {
  WAKEARI_ANSWER_RESERVATION,
  WAKEARI_LAST_UPDATED_JA,
  WAKEARI_LAW_REFERENCE_DATE_JA,
  WAKEARI_LAW_REVISIONS,
} from "@/lib/wakeari";

export type WakeariSource = { what: string; source: string };

export function WakeariSources({ rows }: { rows: WakeariSource[] }) {
  return (
    <div>
      <ReH2>この記事の根拠</ReH2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-primary-tint text-left">
              <th className="border border-border px-3 py-2">内容</th>
              <th className="border border-border px-3 py-2">根拠</th>
            </tr>
          </thead>
          <tbody className="text-text">
            {rows.map((r) => (
              <tr key={r.what}>
                <td className="border border-border px-3 py-2">{r.what}</td>
                <td className="border border-border px-3 py-2">{r.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-text-muted">
        条文は{WAKEARI_LAW_REFERENCE_DATE_JA}に e-Gov 法令検索（法令API）で、東京都建築安全条例は東京都例規集で取得しました。各法令の現行版の施行日（同日・法令API v2）：
        {WAKEARI_LAW_REVISIONS.map((l, i) => (
          <span key={l.law}>
            {i > 0 && "／"}
            {l.law}（{l.lawNum}）＝{l.currentRevisionDate}（{l.amendedBy}による改正）
          </span>
        ))}
        。条ごとの最終改正日は個別に裏取りしていません（未検証）。
      </p>
      <p className="mt-3 text-sm leading-relaxed text-text-muted">
        本ページは一般的な情報提供です。{WAKEARI_ANSWER_RESERVATION}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-text-muted">
        最終更新：{WAKEARI_LAST_UPDATED_JA}｜執筆：
        <Link href="/about/uramatsu" className="text-primary underline">
          浦松丈二（四葉不動産株式会社 代表取締役・宅地建物取引士・行政書士）
        </Link>
      </p>
    </div>
  );
}
