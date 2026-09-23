import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { listSchools } from "@/lib/school-district";
import { SCHOOL_PROFILES } from "@/lib/gakku";

type Point = [number, number];
type Feature = { properties: { school: string; name: string; schoolCode: string; address: string; labelPoint: Point }; geometry: { type: string; coordinates: Point[][] } };
const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../../public/gakku/bunkyo-school-areas.json"), "utf8")) as {
  source: { year: number; purpose: string; license: string; url: string }; features: Feature[];
};
// Winding-angle check is independent of the generator's ray-crossing method.
function contains(point: Point, ring: Point[]) {
  let angle = 0;
  for (let i = 1; i < ring.length; i++) {
    const a = [ring[i - 1][0] - point[0], ring[i - 1][1] - point[1]];
    const b = [ring[i][0] - point[0], ring[i][1] - point[1]];
    angle += Math.atan2(a[0] * b[1] - a[1] * b[0], a[0] * b[0] + a[1] * b[1]);
  }
  return Math.abs(angle) > Math.PI;
}
describe("20校の参考地図データ", () => {
  it("学区別賃貸ページと同じ20校を重複なく収録する", () => {
    expect(data.features.map(f => f.properties.school).sort()).toEqual(listSchools().map(s => s.slug).sort());
    expect(new Set(data.features.map(f => f.properties.schoolCode)).size).toBe(20);
    for (const f of data.features) {
      const school = listSchools().find(s => s.slug === f.properties.school)!;
      expect(f.properties.name).toBe(school.formalName.replace(/^文京区立/, ""));
      expect(f.properties.address).toBe(SCHOOL_PROFILES[school.slug].address);
    }
  });
  it("全境界が閉じており、座標が文京区周辺に収まる", () => {
    for (const f of data.features) {
      expect(f.geometry.type).toBe("Polygon");
      for (const ring of f.geometry.coordinates) {
        expect(ring.length).toBeGreaterThan(3);
        expect(ring[0]).toEqual(ring.at(-1));
        for (const [lng, lat] of ring) {
          expect(lng).toBeGreaterThan(139.71); expect(lng).toBeLessThan(139.78);
          expect(lat).toBeGreaterThan(35.69); expect(lat).toBeLessThan(35.74);
        }
      }
    }
  });
  it("学校名の目印は対応する学区の内部にある", () => {
    for (const f of data.features) {
      expect(contains(f.properties.labelPoint, f.geometry.coordinates[0]), f.properties.school).toBe(true);
      for (const hole of f.geometry.coordinates.slice(1)) expect(contains(f.properties.labelPoint, hole)).toBe(false);
    }
  });
  it("2023年度の参考図として出典とライセンスを保持する", () => {
    expect(data.source.year).toBe(2023);
    expect(data.source.purpose).toBe("approximate-map-only");
    expect(data.source.license).toBe("CC BY 4.0");
    expect(data.source.url).toBe("https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A27-2023.html");
  });
});
