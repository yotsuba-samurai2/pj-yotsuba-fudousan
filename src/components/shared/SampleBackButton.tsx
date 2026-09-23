"use client";

// サンプル資料ビューアの「元のページに戻る」。
// - 案内部品から来た場合（sessionStorage に戻り先がある）は history.back() で戻す＝元のスクロール位置に戻れる。
//   アプリ内ブラウザ等で back が効かなかったときに備え、600ms 後もこのページにいれば記録した戻り先へ移動する。
// - 共有リンク等で直接開いた場合は href（用途ごとの既定の戻り先）へ通常遷移する。
// - JavaScript が動かない環境でも href で戻れるよう、素の <a> にしている。
import { SAMPLE_RETURN_KEY } from "@/lib/property-search-samples";

export function SampleBackButton({
  fallbackHref,
  label,
  className,
}: {
  fallbackHref: string;
  label: string;
  className?: string;
}) {
  return (
    <a
      href={fallbackHref}
      className={className}
      onClick={(event) => {
        let stored: string | null = null;
        try {
          stored = window.sessionStorage.getItem(SAMPLE_RETURN_KEY);
        } catch {
          stored = null;
        }
        // 記録は自サイトのパスのみ（"/..." で始まり "//" ではない）。それ以外は使わない
        const safeStored = stored && stored.startsWith("/") && !stored.startsWith("//") ? stored : null;
        if (!safeStored || window.history.length <= 1) return; // 既定の href で遷移

        event.preventDefault();
        const here = window.location.href;
        window.history.back();
        window.setTimeout(() => {
          if (window.location.href === here) window.location.assign(safeStored);
        }, 600);
      }}
    >
      <span aria-hidden="true">←</span> {label}
    </a>
  );
}
