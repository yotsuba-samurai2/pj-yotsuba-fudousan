"use client";
// LinkaFab — LINKA 追従FAB（assistant-ui風・軽量）。A-3では「開閉UIのシェル」まで。
// AI接続（/api/linka）と結果カード描画はフェーズK。ここでは:
//   - 折りたたみ＝右下52px小円（実写LINKA）＋「AIに相談」チップ
//   - 展開＝コンパクトパネル（LINKAヘッダー／3出口チップ／入力プレースホルダ／フッターに代表LINE内包）
// 【1ページ1LINKA】不動産トップは本文の60秒診断がLINKA＝FABを出さない → suppressed で null。
// LINE専用の別FABは置かない（代表LINEはパネル内包）。意匠正本＝wireframe_linka-floating.html。
import { useState } from "react";
import Image from "next/image";
import { LINE_URL, type BusinessKey } from "@/lib/shared/office";

type Props = {
  businessKey: BusinessKey;
  /** true のページ（不動産トップ）ではFABを出さない */
  suppressed?: boolean;
  /** 3出口チップ（本番は t()／サイト別に差し替え） */
  exits?: string[];
  /** 実写LINKA画像（/public/linka 配下） */
  linkaImg?: string;
};

const DEFAULT_EXITS: Record<BusinessKey, string[]> = {
  realestate: ["相続の相談", "投資・事業用を探す", "お部屋探し"],
  legal: ["障害福祉（指定/GH）", "在留資格・ビザ", "相続・会社設立・補助金"],
  labor: ["処遇改善加算", "雇用助成金・外国人雇用", "労務のご相談"],
};

export function LinkaFab({ businessKey, suppressed = false, exits, linkaImg = "/linka/linka-512.webp" }: Props) {
  const [open, setOpen] = useState(false);
  if (suppressed) return null;
  const chips = exits ?? DEFAULT_EXITS[businessKey];

  return (
    <div className="fixed bottom-4 right-4 z-50 md:bottom-6 md:right-6 max-md:bottom-[72px]">
      {open ? (
        <div className="w-[min(20rem,90vw)] overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">
          {/* ヘッダー */}
          <div className="flex items-center gap-2 bg-primary px-3 py-2.5 text-white">
            <Image
              src={linkaImg}
              alt="LINKA"
              width={28}
              height={28}
              className="h-7 w-7 rounded-full object-cover"
            />
            <span className="text-sm font-semibold">LINKA｜四葉のAIコンシェルジュ</span>
            <button
              type="button"
              aria-label="閉じる"
              onClick={() => setOpen(false)}
              className="ml-auto rounded p-1 text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              ✕
            </button>
          </div>
          {/* 本文（AIはフェーズK。現状は起点チップ＋LINE誘導のプレースホルダ） */}
          <div className="space-y-3 p-3">
            <p className="rounded-lg bg-primary-tint p-2.5 text-xs text-ink">
              こんにちは、LINKAです。まず、どれに近いですか？
            </p>
            <div className="flex flex-wrap gap-1.5">
              {chips.map((c, i) => (
                <span
                  key={i}
                  className="cursor-default rounded-full border border-primary/40 bg-primary-tint px-2.5 py-1 text-xs text-primary-dark"
                >
                  {c}
                </span>
              ))}
            </div>
            {/* 入力プレースホルダ（本番は /api/linka に接続＝フェーズK） */}
            <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-xs text-text-muted">
              <span>メッセージを入力…（準備中）</span>
              <span aria-hidden className="text-primary">▷</span>
            </div>
          </div>
          {/* フッター＝代表LINEを内包（LINE専用の別FABは置かない） */}
          <div className="border-t border-border p-2.5">
            <a
              href={LINE_URL}
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg bg-primary py-2 text-center text-xs font-semibold text-white hover:bg-primary-dark"
            >
              代表LINEで相談（無料）
            </a>
            <p className="mt-1 text-center text-[10px] text-text-muted">AIで整理→必要なら代表に直接つなぐ</p>
          </div>
        </div>
      ) : (
        /* 折りたたみ＝52px小円＋「AIに相談」チップ */
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="LINKA・AIに相談"
          className="flex items-center gap-2 focus:outline-none"
        >
          <span className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text-muted shadow-sm">
            AIに相談
          </span>
          <span className="grid h-[52px] w-[52px] place-items-center overflow-hidden rounded-full bg-primary shadow-lg ring-2 ring-primary">
            <Image
              src={linkaImg}
              alt="LINKA"
              width={52}
              height={52}
              className="h-full w-full object-cover"
            />
          </span>
        </button>
      )}
    </div>
  );
}
