import { z } from "zod";
import { addressKey, sameUnit, unitNumber, type FeedProvider } from "@/lib/school-rental-feed";
import type { SurveyRecord } from "./batch";
import { allowsLargeDog, allowsMultiplePets, isPetSurveyTarget, type PetTerms } from "./pet-terms";
import type { SurveyScope } from "./scope";

/**
 * 住戸の同一性・媒体間の矛盾・募集状態・ペット対象を判定し、確定用の snapshot を作る（ペット横断 指示書 版2.0 第5・6・8章）。
 * 処理順：地域 → 同一性 → 矛盾 → 募集状態 → ペット対象。入力の順序に結果が依存しない。
 * 住戸の同一性は学区と同じ関数（sameUnit 等）を使い、別系統の重複排除を作らない。
 */
export type Observation = SurveyRecord & { provider: FeedProvider };
export type UnitIdentity = { building: string; unit: string; address: string };

const identitySchema = z.object({ building: z.string(), unit: z.string(), address: z.string() }).strict();
export const surveySnapshotSchema = z.object({
  /** 確定対象 S の住戸。公開時に自社の掲載物件と照合するための最小項目だけを持つ。 */
  units: z.array(z.object({ identities: z.array(identitySchema).min(1) }).strict()),
  /** 住戸にまとめる前に除外した観測行の数（管理用）。 */
  excludedObservations: z.object({ "out-of-area": z.number().int(), "unresolved-identity": z.number().int() }).strict(),
  /** 住戸単位で除外した数（管理用）。広告不可の件数は数えない（Z に含まれる旨を注記するだけ）。 */
  excludedUnits: z.object({ conflict: z.number().int(), "closed-or-applied": z.number().int(), "status-unconfirmed": z.number().int(), "not-target": z.number().int() }).strict(),
  /** 確定対象の内訳（管理用）。重複し得るため、足して総数にしない。 */
  targetBreakdown: z.object({ multiplePets: z.number().int(), largeDog: z.number().int() }).strict(),
}).strict();
export type SurveySnapshot = z.infer<typeof surveySnapshotSchema>;
export type SnapshotUnit = SurveySnapshot["units"][number];
type UnitExclusion = keyof SurveySnapshot["excludedUnits"];

/**
 * 観測行を住戸にまとめる。推定で同一・別住戸を確定しないため、次は確認待ち（unresolved）にする。
 * - 号室が無い（戸建て等を含む）
 * - 同じ所在地・号室で建物名が一致しない（表記ゆれか別建物か判断できない）
 * - sameUnit の連鎖でつながるが、組の中に一致しない組合せがある（所在地の前方一致は推移的でないため）
 */
export function groupObservations(observations: Observation[]) {
  const unresolved = new Set<Observation>();
  const buckets = new Map<string, Observation[]>();
  for (const o of observations) {
    const room = o.unit ? unitNumber(o.unit) : "";
    if (!room) { unresolved.add(o); continue; }
    buckets.set(room, [...(buckets.get(room) ?? []), o]);
  }
  const groups: Observation[][] = [];
  for (const bucket of buckets.values()) {
    for (let i = 0; i < bucket.length; i++) for (let j = i + 1; j < bucket.length; j++) {
      const [a, b] = [bucket[i], bucket[j]];
      if (!sameUnit(a, b) && addressKey(a.address) === addressKey(b.address)) { unresolved.add(a); unresolved.add(b); }
    }
    const nodes = bucket.filter(o => !unresolved.has(o));
    const parent = nodes.map((_, i) => i);
    const root = (i: number): number => parent[i] === i ? i : (parent[i] = root(parent[i]));
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++)
      if (sameUnit(nodes[i], nodes[j])) parent[root(i)] = root(j);
    const components = new Map<number, Observation[]>();
    nodes.forEach((o, i) => components.set(root(i), [...(components.get(root(i)) ?? []), o]));
    for (const members of components.values()) {
      const consistent = members.every((a, i) => members.slice(i + 1).every(b => sameUnit(a, b)));
      if (consistent) groups.push(members);
      else members.forEach(o => unresolved.add(o));
    }
  }
  return { groups, unresolved: [...unresolved] };
}

function definiteValues<T>(values: T[], unknown: readonly T[]) {
  return [...new Set(values.filter(v => !unknown.includes(v)))];
}

/** 学区の既存ルールと同じ（緩和しない）：REINS は「申込あり」の記載が無いこと、他媒体は「申込なし」とその原文が必要。 */
function applicationClear(o: Observation) {
  return o.provider === "reins" ? o.application !== "present" : o.application === "none" && Boolean(o.applicationQuote);
}

/** 1住戸の判定。確定的な値が観測行の間で食い違えば矛盾として除外する（都合のよい値を寄せ集めない）。 */
export function assessUnit(members: Observation[]): { reason: UnitExclusion } | { reason: null; pet: Pick<PetTerms, "multi" | "largeDog"> } {
  const multi = definiteValues<PetTerms["multi"]>(members.map(m => m.pet.multi), ["unconfirmed-count"]);
  const largeDog = definiteValues<PetTerms["largeDog"]>(members.map(m => m.pet.largeDog), ["unconfirmed"]);
  const checks = [
    definiteValues(members.map(m => m.availability), ["unknown"]),
    definiteValues(members.map(m => m.application), ["unknown"]),
    multi,
    largeDog,
    definiteValues(members.map(m => m.pet.species), ["other-or-unconfirmed"]),
    ...(["cats", "dogs", "total"] as const).map(k => definiteValues(members.map(m => m.pet.limits[k]), [null])),
  ];
  if (checks.some(values => values.length > 1)) return { reason: "conflict" };
  if (members.some(m => m.availability === "closed" || m.application === "present")) return { reason: "closed-or-applied" };
  if (!members.every(m => m.availability === "active" && applicationClear(m))) return { reason: "status-unconfirmed" };
  const pet = { multi: multi[0] ?? "unconfirmed-count", largeDog: largeDog[0] ?? "unconfirmed" };
  return isPetSurveyTarget(pet) ? { reason: null, pet } : { reason: "not-target" };
}

const identityKey = (i: UnitIdentity) => `${i.address}\u0000${i.building}\u0000${i.unit}`;

export function compileSurveySnapshot(observations: Observation[], scope: Pick<SurveyScope, "region">): SurveySnapshot {
  const excludedObservations = { "out-of-area": 0, "unresolved-identity": 0 };
  const excludedUnits: SurveySnapshot["excludedUnits"] = { conflict: 0, "closed-or-applied": 0, "status-unconfirmed": 0, "not-target": 0 };
  const targetBreakdown = { multiplePets: 0, largeDog: 0 };
  const inArea = observations.filter(o => o.address.includes(scope.region));
  excludedObservations["out-of-area"] = observations.length - inArea.length;
  const { groups, unresolved } = groupObservations(inArea);
  excludedObservations["unresolved-identity"] = unresolved.length;
  const units: SnapshotUnit[] = [];
  for (const members of groups) {
    const result = assessUnit(members);
    if (result.reason) { excludedUnits[result.reason]++; continue; }
    if (allowsMultiplePets(result.pet)) targetBreakdown.multiplePets++;
    if (allowsLargeDog(result.pet)) targetBreakdown.largeDog++;
    const identities = new Map(members.map(m => {
      const identity = { building: m.building, unit: m.unit, address: m.address };
      return [identityKey(identity), identity] as const;
    }));
    units.push({ identities: [...identities.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, identity]) => identity) });
  }
  units.sort((a, b) => identityKey(a.identities[0]).localeCompare(identityKey(b.identities[0])));
  return { units, excludedObservations, excludedUnits, targetBreakdown };
}
