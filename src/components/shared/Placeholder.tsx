// Placeholder — 【要確認】箇所の部品。未検証を本番に出力しないための仕組み。
// 本番（NEXT_PUBLIC_SHOW_PLACEHOLDERS!=="true"）では null を返す＝HTMLに「【要確認」は出ない
// （手順書D 完成条件：本番 grep「【要確認」=0）。開発時のみ枠を表示して残タスクを可視化。
const SHOW = process.env.NEXT_PUBLIC_SHOW_PLACEHOLDERS === "true";

export function Placeholder({ reason }: { reason: string }) {
  if (!SHOW) return null;
  return (
    <span className="my-1 inline-block rounded border border-dashed border-[#E0A100] bg-[#FEF7E6] px-2 py-1 text-xs text-[#8a6d00]">
      【要確認】{reason}
    </span>
  );
}
