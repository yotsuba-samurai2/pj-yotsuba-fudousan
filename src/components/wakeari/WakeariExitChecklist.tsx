"use client";
// WakeariExitChecklist — 出口チェックリスト（/wakeari ハブに設置・指示書 v2.0 5-5・2026-09-23）。
// 6問（すべて「分からない」を選べる）に答えると、該当した条件ごとに「考えられる出口」と「先に確認する書類」を
// 一般論として並べる（可否は書かない）。この部品は送信・外部通信を持たない。
// 留保文（WAKEARI_CHECKLIST_RESERVATION・固定）は回答の有無にかかわらず常時表示する＝shigyo-compliance-gate 第1条。
// 結果の下に /contact?intent=wakeari への CTA。
// 2026-09-24 不具合修正：CTA「この内容で相談する」を押しても回答がフォームに渡らず、空の「ご相談内容」欄に着地していた。
//   押した時だけ、回答の要約（buildWakeariChecklistMessage）を contact-prefill 経由でフォームの「ご相談内容」へ渡す。
//   URL には載せない（GA4・アクセスログに回答を残さない）。フォームは1回読んだら消す。送信するのは利用者本人。
// ⚠️ client component：office.ts（社労士事務所名）を import しない。@/lib/wakeari はクライアント安全。
import { useMemo, useState } from "react";
import Link from "next/link";
import { gaEvent } from "@/lib/gtag";
import { writeContactPrefill } from "@/lib/shared/contact-prefill";
import {
  WAKEARI_CHECKLIST,
  WAKEARI_CHECKLIST_RESERVATION,
  WAKEARI_CONTACT_HREF,
  WAKEARI_CONTACT_INTENT,
  buildWakeariChecklistMessage,
  computeWakeariChecklistResult,
} from "@/lib/wakeari";

export function WakeariExitChecklist() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const total = WAKEARI_CHECKLIST.length;

  // 結果の計算は lib 側（フォームへ渡す本文と同じ関数＝表示と本文を食い違わせない）。
  // 全問に答えてどの条件にも当たらないときは「該当なし」の文言（指示書 5-5 の表の最終行）が exits・docs に入る。
  const result = useMemo(() => computeWakeariChecklistResult(answers), [answers]);
  const { answeredCount, exits, docs } = result;

  // CTA を押した時だけ、回答の要約をフォームの「ご相談内容」へ渡す（1問も答えていなければカテゴリだけ）
  const onConsult = () => {
    if (answeredCount > 0) writeContactPrefill(WAKEARI_CONTACT_INTENT, buildWakeariChecklistMessage(answers));
    gaEvent("cta_contact_click", { location: "wakeari_checklist" });
  };

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
        6問に答えると、<strong className="text-ink">考えられる出口</strong>と<strong className="text-ink">先に確認する書類</strong>を一般論として表示します。回答は、この画面からは送信されません。
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
            onClick={onConsult}
            className="inline-flex min-h-[40px] items-center rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary-dark transition-colors hover:bg-primary-dark hover:text-white"
          >
            この内容で相談する（無料）
          </Link>
        </p>
        {answeredCount > 0 && (
          <p className="mt-2 text-xs leading-relaxed text-text-muted">
            押すと、回答と上の結果がお問い合わせフォームの「ご相談内容」欄に入ります。フォームで送信するまで、どこにも送られません。
          </p>
        )}
      </div>
    </div>
  );
}
