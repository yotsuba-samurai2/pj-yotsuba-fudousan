"use client";
// フェーズK-4｜士業ドットコム SAMURAI フル・ファシリテーター（会員/一般βタブ）
// noindex・本番導線に未リンク（浦松プレビュー用）。ai.samurai.co.jp への移設は別途。
// 主色＝士業ドットコム紺（#1E3A5F）をこのページ配下の --color-primary に割当（設計書§1）。
import { useState } from "react";
import { LinkaWidget } from "@/components/linka/LinkaWidget";
import { LinkaAvatar } from "@/components/linka/LinkaAvatar";

const SAMURAI_NAVY = "#1E3A5F";

export function FacilitatorClient() {
  const [mode, setMode] = useState<"member" | "customer">("member");
  return (
    <div
      className="flex h-dvh flex-col"
      style={
        {
          "--color-primary": SAMURAI_NAVY,
          "--color-primary-dark": "#16283F",
          "--color-primary-tint": "#E9EDF3",
        } as React.CSSProperties
      }
    >
      {/* ヘッダー（LINKA＋モードタブ） */}
      <section className="bg-gradient-to-br from-[#1E3A5F] to-[#16283F]">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-5 pb-2 pt-4">
          <LinkaAvatar size={48} />
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-widest text-white/50">AI Facilitator · LINKA</div>
            <div className="text-sm font-semibold text-white">士業ドットコム</div>
          </div>
        </div>
        <div className="mx-auto max-w-2xl px-5">
          <div className="flex gap-1 border-t border-white/10 pt-2">
            {(
              [
                ["member", "会員(協力者を探す)"],
                ["customer", "一般相談窓口 β"],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => setMode(k)}
                className={
                  "rounded-t-lg px-4 py-2 text-sm font-semibold transition-colors " +
                  (mode === k ? "bg-white text-[#1E3A5F]" : "text-sky-200")
                }
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 会話（mode切替でスレッドを作り直す＝key） */}
      <div className="mx-auto min-h-0 w-full max-w-2xl flex-1">
        <LinkaWidget key={mode} site="samurai" mode={mode} className="h-full" />
      </div>
    </div>
  );
}
