"use client";
// フェーズK-3｜結果カード（独自描画・プロトResultViewから移植）
// 三禁則の特殊表示を保持：順位なし注記・匿名化・エスカレーション・demoバナー・オプトイン未取得の明示。
// データはサーバ解決済みカード（LinkaResult）のみ＝クライアントは名簿を持たない。
// 色は --color-primary（テナント色）を参照（サイト非依存）。
// K-2b（2026-07-12）：コーポレート（concierge）側の見出し・注記を4ロケール化（正本＝lib/linka/ui-copy.ts）。
// 候補カード・参考動画（士業ドットコム専用UI）は日本語のまま＝あちらは日本語プラットフォーム。
import { LINE_URL } from "@/lib/shared/office-public";
import { useLanguage } from "@/contexts/LanguageContext";
import { addLocalePrefix } from "@/lib/locale";
import { linkaUi } from "@/lib/linka/ui-copy";
import type { CandidateCard, LinkaResult } from "@/lib/linka/types";

function Badge({ tone, children }: { tone: "amber" | "gray" | "blue" | "navy"; children: React.ReactNode }) {
  const tones: Record<string, string> = {
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    gray: "bg-stone-100 text-stone-600 border-stone-200",
    blue: "bg-sky-50 text-sky-800 border-sky-200",
    navy: "bg-white text-sky-900 border-sky-300",
  };
  return <span className={"inline-block rounded-full border px-2 py-0.5 text-xs " + tones[tone]}>{children}</span>;
}

function CandidateItem({
  c,
  isCust,
  selected,
  onSelect,
}: {
  c: CandidateCard;
  isCust: boolean;
  selected: string | null;
  onSelect?: (id: string) => void;
}) {
  const sel = selected === c.id;
  return (
    <div
      onClick={() => onSelect?.(c.id)}
      className={
        "flex w-full cursor-pointer gap-3 rounded-xl border bg-white p-4 text-left transition-shadow " +
        (sel ? "border-2 border-primary shadow-md" : "border-stone-200 hover:shadow-sm")
      }
    >
      <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded bg-primary font-serif text-white">{c.mark}</span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-semibold text-stone-900">{c.name}</span>
          <span className="text-xs text-stone-500">{c.shikaku.join("・")}</span>
          <Badge tone="blue">samurai.co.jp掲載</Badge>
          {c.optin === "unknown" && <Badge tone="amber">オプトイン未取得</Badge>}
        </div>
        <div className="mt-0.5 text-xs italic text-stone-500">{c.catch}</div>
        <div className="mt-1 text-xs text-stone-600">{c.bunya.join(" / ")}</div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge tone="gray">{c.area}</Badge>
          {c.lang.filter((l) => l !== "日本語").map((l, i) => (
            <Badge key={i} tone="navy">{l}対応</Badge>
          ))}
          {c.taio.map((t, i) => (
            <Badge key={"t" + i} tone="gray">{t}</Badge>
          ))}
        </div>
        <ul className="mt-2 list-inside list-disc space-y-0.5 text-xs text-stone-700">
          {c.reasons.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
        <a
          href={c.profileUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-2 inline-block text-xs text-primary underline"
        >
          プロフィールを見る(samurai.co.jp)
        </a>
      </div>
    </div>
  );
}

export function ResultView({
  result,
  isCust = false,
  selected = null,
  onSelect,
}: {
  result: LinkaResult;
  isCust?: boolean;
  selected?: string | null;
  onSelect?: (id: string) => void;
}) {
  const { locale } = useLanguage();
  const t = linkaUi(locale);
  // K-2c（2026-07-12）：**内部リンクにロケール接頭辞を付ける**。
  // servicesのurlはカタログの生パス（例 /global）で、素の<a>のままだと middleware の
  // 「URLが言語の正」により**日本語ページに落ちる**（本番実測で発見）。外部URL（http〜・LINE・
  // samurai.co.jp・コラム）はそのまま。
  const localizeHref = (u: string) => (u.startsWith("/") ? addLocalePrefix(u, locale) : u);
  return (
    <div className="space-y-3">
      {result.type === "escalation" && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-900">
          <div className="mb-1 font-semibold">{t.escalationTitle}</div>
          {result.message}
        </div>
      )}
      {(result.type === "anonymization_request" || result.type === "clarify") && (
        <div className="rounded-xl border border-amber-300 bg-white p-4 text-sm text-stone-800">
          <div className="mb-1 font-semibold text-amber-800">
            {result.type === "anonymization_request" ? t.anonTitle : t.clarifyTitle}
          </div>
          {result.message}
        </div>
      )}

      {(result.type === "triage" || result.type === "concierge") && (
        <div className="space-y-2 rounded-xl border border-stone-200 bg-white p-4">
          <div className="text-xs font-semibold text-stone-500">{t.kentoLabel}</div>
          <div className="flex flex-wrap gap-2">
            {result.kento.map((k, i) => (
              <Badge key={i} tone="navy">{k}</Badge>
            ))}
          </div>
          <div className="text-sm text-stone-700">{result.message}</div>
        </div>
      )}
      {result.type === "candidates" && <div className="text-sm text-stone-700">{result.message}</div>}

      {result.demo && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          {t.demoBanner}
        </div>
      )}

      {/* コーポレート: 自社サービス案内 */}
      {result.type === "concierge" && result.services.length > 0 && (
        <div className="space-y-2 rounded-xl border border-stone-200 bg-white p-4">
          <div className="text-xs font-semibold text-stone-500">{t.servicesLabel}</div>
          {result.services.map((s, i) => (
            <a
              key={i}
              href={localizeHref(s.url)}
              className="block rounded-lg border border-stone-100 p-3 hover:shadow-sm"
            >
              <div className="text-sm text-primary underline">{s.label}</div>
              {s.reason && <div className="mt-0.5 text-xs text-stone-500">{s.reason}</div>}
            </a>
          ))}
          <a
            href={LINE_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-block rounded-md bg-primary px-3 py-1.5 text-xs text-white"
          >
            {t.lineBtn}
          </a>
        </div>
      )}

      {/* コーポレート: 範囲外→士業ドットコムへ（一般化・非名指し） */}
      {result.type === "concierge" && result.escalate && (
        <div className="space-y-2 rounded-xl border-2 border-primary bg-white p-4">
          <div className="text-xs font-semibold text-primary">{t.outOfScopeTitle}</div>
          <div className="text-sm text-stone-700">{result.escalateReason}</div>
          <a
            href={result.samuraiUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-lg px-4 py-2 text-sm text-white"
            style={{ background: "#1E3A5F" }}
          >
            {t.samuraiBtn}
          </a>
          <div className="text-xs text-stone-400">{t.samuraiNote}</div>
        </div>
      )}

      {/* 士業ドットコム: 候補カード（順位なし注記＝三禁則①の可視化） */}
      {(result.type === "candidates" || result.type === "triage") && result.candidates.length > 0 && (
        <div className="space-y-3">
          <div className="text-xs text-stone-500">
            {isCust
              ? "掲載は機械的な並びで、順位・推薦ではありません。どなたに相談するかはご自身でお選びください。"
              : "掲載は機械的な並びです(順位ではありません)。"}
          </div>
          {result.candidates.map((c) => (
            <CandidateItem key={c.id} c={c} isCust={isCust} selected={selected} onSelect={onSelect} />
          ))}
        </div>
      )}

      {/* 参考コラム */}
      {"columns" in result && result.columns && result.columns.length > 0 && (
        <div className="space-y-2 rounded-xl border border-stone-200 bg-white p-4">
          <div className="text-xs font-semibold text-stone-500">{t.columnsLabel}</div>
          {result.columns.map((c) => (
            <a key={c.id} href={c.url} target="_blank" rel="noreferrer" className="block rounded-lg border border-stone-100 p-3 hover:shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                {c.tags.map((t, i) => (
                  <Badge key={i} tone="navy">{t}</Badge>
                ))}
                <span className="text-xs text-stone-400">{c.date}</span>
              </div>
              <div className="mt-1 text-sm text-stone-800 underline">{c.title}</div>
              <div className="mt-0.5 text-xs text-stone-500">
                執筆: {c.authorName ?? "士業ドットコム"}
                {c.reason ? "|" + c.reason : ""}
              </div>
            </a>
          ))}
          <div className="text-xs text-stone-400">{t.columnsNote}</div>
        </div>
      )}

      {/* 参考動画（士業ドットコムのみ） */}
      {(result.type === "candidates" || result.type === "triage") && result.videos && result.videos.length > 0 && (
        <div className="space-y-2 rounded-xl border border-stone-200 bg-white p-4">
          <div className="text-xs font-semibold text-stone-500">参考動画(公式YouTube・ゆっくり対談形式)</div>
          {result.videos.map((v) => (
            <a key={v.id} href={v.url} target="_blank" rel="noreferrer" className="block rounded-lg border border-stone-100 p-3 hover:shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                {v.tags.map((t, i) => (
                  <Badge key={i} tone="navy">{t}</Badge>
                ))}
                <Badge tone="gray">{v.type}</Badge>
              </div>
              <div className="mt-1 text-sm text-stone-800 underline">{v.theme}</div>
              {v.reason && <div className="mt-0.5 text-xs text-stone-500">{v.reason}</div>}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
