/**
 * 通学区域の図と表。
 *
 * 図は「町丁目ごとの範囲」を示すブロック図で、地理的な位置・縮尺・境界は表さない
 * （正確な境界を描けないものを地図として出さないため）。図の直下に同じ内容の表を必ず置く。
 * 表は区の公表データ（番・号・備考）をそのまま出す。
 */
import type { DistrictRow } from "@/lib/school-district";
import type { GakkuCopy } from "@/lib/gakku";

export interface ChomeSummary {
  chome: string;
  /** その町丁目の全域がこの学校の区域か */
  whole: boolean;
  rowCount: number;
}

export function summarizeByChome(rows: DistrictRow[]): ChomeSummary[] {
  const order: string[] = [];
  const byChome = new Map<string, DistrictRow[]>();
  for (const row of rows) {
    if (!byChome.has(row.chome)) {
      byChome.set(row.chome, []);
      order.push(row.chome);
    }
    byChome.get(row.chome)!.push(row);
  }
  return order.map((chome) => {
    const list = byChome.get(chome)!;
    const whole =
      list.length === 1 && list[0].ban === "全" && list[0].go === "全" && list[0].note === "";
    return { chome, whole, rowCount: list.length };
  });
}

export function DistrictBlocks({
  rows,
  copy,
  schoolName,
}: {
  rows: DistrictRow[];
  copy: GakkuCopy;
  schoolName: string;
}) {
  const items = summarizeByChome(rows);
  const cols = 3;
  const boxW = 210;
  const boxH = 62;
  const gapX = 12;
  const gapY = 12;
  const rowCount = Math.ceil(items.length / cols) || 1;
  const width = cols * boxW + (cols - 1) * gapX;
  const height = rowCount * boxH + (rowCount - 1) * gapY;

  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        role="img"
        aria-label={`${schoolName}：${copy.school.mapH2}`}
      >
        <title>{schoolName}</title>
        <desc>{copy.school.mapNote}</desc>
        {items.map((item, i) => {
          const x = (i % cols) * (boxW + gapX);
          const y = Math.floor(i / cols) * (boxH + gapY);
          return (
            <g key={item.chome}>
              <rect
                x={x}
                y={y}
                width={boxW}
                height={boxH}
                rx={6}
                fill={item.whole ? "#e1f5ee" : "#faeeda"}
                stroke={item.whole ? "#0f6e56" : "#854f0b"}
                strokeWidth={1}
              />
              <text x={x + 12} y={y + 26} fontSize={15} fill={item.whole ? "#04342c" : "#412402"}>
                {item.chome}
              </text>
              <text x={x + 12} y={y + 46} fontSize={12} fill={item.whole ? "#0f6e56" : "#854f0b"}>
                {item.whole ? copy.table.wholeArea : copy.table.partial}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 text-xs leading-relaxed text-text-muted">
        {copy.school.mapNote}
      </figcaption>
    </figure>
  );
}

export function DistrictTable({ rows, copy }: { rows: DistrictRow[]; copy: GakkuCopy }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-text-muted">
            <th scope="col" className="py-2 pr-3 font-medium">
              {copy.table.chome}
            </th>
            <th scope="col" className="py-2 pr-3 font-medium">
              {copy.table.ban}
            </th>
            <th scope="col" className="py-2 pr-3 font-medium">
              {copy.table.go}
            </th>
            <th scope="col" className="py-2 font-medium">
              {copy.table.note}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={`${row.chome}-${row.ban}-${row.go}-${i}`} className="border-b border-border">
              <td className="py-2 pr-3 align-top text-text">{row.chome}</td>
              <td className="py-2 pr-3 align-top text-text">{row.ban}</td>
              <td className="py-2 pr-3 align-top text-text">{row.go}</td>
              <td className="py-2 align-top text-text-muted">{row.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
