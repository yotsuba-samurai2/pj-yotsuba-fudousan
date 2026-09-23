"use client";
// WakeariExitChecklist — 出口チェックリスト（/wakeari ハブに設置・指示書 v2.0 5-5・2026-09-23）。
// 6問（すべて「分からない」を選べる）に答えると、該当した条件ごとに「考えられる出口」と「先に確認する書類」を
// 一般論として並べる（可否は書かない）。フォーム送信なし・外部通信なし・保存なし（回答は端末のメモリ上だけ）。
// 留保文（WAKEARI_CHECKLIST_RESERVATION・固定）は回答の有無にかかわらず常時表示する＝shigyo-compliance-gate 第1条。
// 結果の下に /contact?intent=wakeari への CTA（フォーム側で相談内容をプリセット）。
// ⚠️ client component：office.ts（社労士事務所名）を import しない。@/lib/wakeari はクライアント安全。
import { useMemo, useState } from "react";
import Link from "next/link";
import { gaEvent } from "@/lib/gtag";
import {
  WAKEARI_CHECKLIST,
  WAKEARI_CHECKLIST_NONE,
  WAKEARI_CHECKLIST_RESERVATION,
  WAKEARI_CONTACT_HREF,
  WAKEARI_PAGES,
  WAKEARI_TYPE_KEYS,
  type WakeariPageKey,
} from "@/lib/wakeari";

function uniq(items: string[]): string[] {
  return [...new Set(items)];
}

export function WakeariExitChecklist() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const answeredCount = Object.keys(answers).length;
  const total = WAKEARI_CHECKLIST.length;
  const complete = answeredCount === total;

  const result = useMemo(() => {
    const exits: string[] = [];
    const docs: string[] = [];
    const pages = new Set<WakeariPageKey>();
    const links: { href: string; label: string }[] = [];
    for (const q of WAKEARI_CHECKLIST) {
      const opt = q.options.find((o) => o.value === answers[q.id]);
      if (!opt) continue;
      exits.push(...(opt.exits ?? []));
      docs.push(...(opt.docs ?? []));
      if (opt.page) pages.add(opt.page);
      if (opt.link && !links.some((l) => l.href === opt.link!.href)) links.push(opt.link);
    }
    return {
      exits: uniq(exits),
      docs: uniq(docs),
      // 表示順は種類別ページの固定順（回答順に左右されない）
      pages: WAKEARI_TYPE_KEYS.filter((k) => pages.has(k)).map((k) => WAKEARI_PAGES[k]),
      links,
    };
  }, [answers]);

  // 全問に答えて、どの条件にも当たらないとき＝「該当なし」の文言（指示書 5-5 の表の最終行）
  const none = complete && result.exits.length === 0;
  const exits = none ? WAKEARI_CHECKLIST_NONE.exits : result.exits;
  const docs = none ? WAKEARI_CHECKLIST_NONE.docs : result.docs;

  const onAnswer = (id: string, value: string) => {
    setAnswers((prev) => {
      const next = { ...prev, [id]: value };
      // 最後の1問に答えたときだけ計測（回答内容は送らない＝gtag.ts の規約）
      if (Object.keys(next).length === total && Object.keys(prev).length < total) {
        gaEvent("wakeari_checklist_complete", { location: "wakeari_hub" });
      }
      return next;
    });
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-4 sm:p-6" aria-label="出口チェックリスト">
      <p className="text-sm leading-relaxed text-text">
        6問に答えると、<strong className="text-ink">考えられる出口</strong>と<strong className="text-ink">先に確認する書類</strong>を一般論として表示します。回答は送信・保存されません。
      </p>
      <ol className="mt-4 space-y-4">
        {WAKEARI_CHECKLIST.map((q, i) => (
          <li key={q.id}>
            <fieldset>
              <legend className="text-sm font-medium text-ink">
                Q{i + 1}. {q.question}
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {q.options.map((o) => {
                  const checked = answers[q.id] === o.value;
                  return (
                    <label
                      key={o.value}
                      className={`inline-flex min-h-[36px] cursor-pointer items-center rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                        checked
                          ? "border-primary bg-primary-tint text-ink"
                          : "border-border bg-surface text-text hover:border-primary/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`wakeari-${q.id}`}
                        value={o.value}
                        checked={checked}
                        onChange={() => onAnswer(q.id, o.value)}
                        className="sr-only"
                      />
                      {o.label}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </li>
        ))}
      </ol>

      <div className="mt-6 rounded-lg border border-border bg-primary-tint/40 p-4" aria-live="polite">
        <p className="text-sm font-medium text-ink">
          結果（{answeredCount}／{total}問に回答）
        </p>
        {answeredCount === 0 ? (
          <p className="mt-2 text-sm text-text-muted">上の質問に答えると、ここに表示されます。</p>
        ) : (
          <>
            <p className="mt-3 text-sm font-medium text-ink">考えられる出口（一般論）</p>
            {exits.length > 0 ? (
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-text">
                {exits.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm leading-relaxed text-text">いまの回答では、出口を分ける条件は出ていません。残りの質問にも答えてください。</p>
            )}
            <p className="mt-3 text-sm font-medium text-ink">先に確認する書類</p>
            {docs.length > 0 ? (
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm leading-relaxed text-text">
                {docs.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm leading-relaxed text-text">登記事項証明書と公図から確認を始めます。</p>
            )}
            {(result.pages.length > 0 || result.links.length > 0) && (
              <p className="mt-3 text-sm leading-relaxed text-text">
                詳しくは
                {result.pages.map((p, i) => (
                  <span key={p.key}>
                    {i > 0 && "・"}
                    <Link href={p.path} className="text-primary underline">
                      {p.shortLabel}のページ
                    </Link>
                  </span>
                ))}
                {result.links.map((l, i) => (
                  <span key={l.href}>
                    {(i > 0 || result.pages.length > 0) && "・"}
                    <Link href={l.href} className="text-primary underline">
                      {l.label}
                    </Link>
                  </span>
                ))}
                をご覧ください。
              </p>
            )}
          </>
        )}
        {/* 留保文は回答の有無にかかわらず常に表示する（固定文言） */}
        <p className="mt-3 text-sm font-medium leading-relaxed text-ink">{WAKEARI_CHECKLIST_RESERVATION}</p>
        <p className="mt-3 text-sm">
          <Link
            href={WAKEARI_CONTACT_HREF}
            onClick={() => gaEvent("cta_contact_click", { location: "wakeari_checklist" })}
            className="inline-flex min-h-[40px] items-center rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary-dark transition-colors hover:bg-primary-dark hover:text-white"
          >
            この内容で相談する（無料）
          </Link>
        </p>
      </div>
    </div>
  );
}
