/** node --import tsx scripts/gakku/build-map-data.ts /path/to/A27-23_13.geojson
 * Download: https://nlftp.mlit.go.jp/ksj/gml/data/A27/A27-23/A27-23_13_GML.zip
 * All 20 polygons use one vintage to avoid overlaps from mixing boundary sources.
 * These polygons are for orientation ONLY. Property assignments use school-district.ts.
 */
import fs from "node:fs";
import { listSchools } from "../../src/lib/school-district";
import { SCHOOL_PROFILES } from "../../src/lib/gakku";

type Point = [number, number];
type Polygon = Point[][];
type Feature = { properties: Record<string, string>; geometry: { type: string; coordinates: Polygon } };
const path = process.argv[2];
if (!path) throw new Error("Pass the extracted A27-23_13.geojson file");
const input = JSON.parse(fs.readFileSync(path, "utf8")) as { features: Feature[] };
const normalize = (s: string) => s.replaceAll("ヶ", "ケ").replace(/^文京区立/, "");
const round = (n: number) => Math.round(n * 1e6) / 1e6;
function inside([x, y]: Point, ring: Point[]) {
  let found = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) found = !found;
  }
  return found;
}
// Choose a point inside the area, not a fictitious school-building coordinate.
function labelPoint(polygon: Polygon): Point {
  const ring = polygon[0];
  const xs = ring.map(p => p[0]), ys = ring.map(p => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  let best: Point | undefined, bestDistance = -1;
  for (let i = 1; i < 40; i++) for (let j = 1; j < 40; j++) {
    const p: Point = [minX + (maxX - minX) * i / 40, minY + (maxY - minY) * j / 40];
    if (!inside(p, ring) || polygon.slice(1).some(h => inside(p, h))) continue;
    let distance = Infinity;
    for (const boundary of polygon) for (let k = 1; k < boundary.length; k++) {
      const a = boundary[k - 1], b = boundary[k];
      const dx = (b[0] - a[0]) * 0.81, dy = b[1] - a[1];
      const px = (p[0] - a[0]) * 0.81, py = p[1] - a[1];
      const t = Math.max(0, Math.min(1, (px * dx + py * dy) / (dx * dx + dy * dy || 1)));
      distance = Math.min(distance, (px - t * dx) ** 2 + (py - t * dy) ** 2);
    }
    if (distance > bestDistance) { best = p; bestDistance = distance; }
  }
  if (!best) throw new Error("No interior label point");
  return best.map(round) as Point;
}
const features = listSchools().map(school => {
  const matches = input.features.filter(f => f.properties.A27_001 === "13105" && normalize(f.properties.A27_004) === normalize(school.formalName));
  if (matches.length !== 1 || matches[0].geometry.type !== "Polygon") throw new Error(`Missing/duplicate/unexpected geometry: ${school.slug}`);
  const feature = matches[0];
  const coordinates = feature.geometry.coordinates.map(ring => ring.map(p => p.map(round) as Point));
  return { type: "Feature", properties: {
    school: school.slug, name: school.formalName.replace(/^文京区立/, ""), short: school.name,
    address: SCHOOL_PROFILES[school.slug].address, schoolCode: feature.properties.A27_003,
    labelPoint: labelPoint(coordinates),
  }, geometry: { type: "Polygon", coordinates } };
});
const data = { type: "FeatureCollection", source: {
  title: "国土交通省 国土数値情報 小学校区データ（2023年度）を加工", year: 2023,
  url: "https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A27-2023.html",
  downloadUrl: "https://nlftp.mlit.go.jp/ksj/gml/data/A27/A27-23/A27-23_13_GML.zip",
  license: "CC BY 4.0", termsUrl: "https://nlftp.mlit.go.jp/ksj/gml/codelist/R5_Terms_of_use_municipality_data.xlsx",
  retrievedAt: "2026-09-23", municipalityCode: "13105", purpose: "approximate-map-only",
}, features };
fs.writeFileSync("public/gakku/bunkyo-school-areas.json", JSON.stringify(data) + "\n");
console.log(`Generated ${features.length} school areas`);
