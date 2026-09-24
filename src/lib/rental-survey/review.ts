import type { FeedProvider } from "@/lib/school-rental-feed";
import type { SurveyBatch, SurveyRecord } from "./batch";
import { allowsLargeDog, allowsMultiplePets, isPetSurveyTarget } from "./pet-terms";
import type { SurveyScope } from "./scope";

/**
 * 取込画面で浦松が確認するための整理（ブラウザでも動く純関数。ペット横断 指示書 版2.0 第5・6章）。
 * - 対象は「複数飼育 可・相談」または「大型犬 可・相談」の和集合。内訳は重複し得るので、足して総数にしない。
 * - 「ペット相談」だけ（頭数未確認）・1頭限定・不可は対象外として数だけ出す。
 * - 猫3頭以上は、頭数の上限が3以上と書かれているものだけ（猫2頭可や、頭数の書かれていない多頭可は含めない）。
 * - 募集終了・申込ありは、確定時に除外される（ここでは件数を示すだけ）。
 */
export type ReviewTarget = Pick<SurveyRecord, "sourceId" | "building" | "unit" | "address" | "availability" | "application"> & {
  multi: SurveyRecord["pet"]["multi"];
  largeDog: SurveyRecord["pet"]["largeDog"];
  species: SurveyRecord["pet"]["species"];
  limits: SurveyRecord["pet"]["limits"];
  petQuote: string;
  conditions: string;
};

export type BatchReview = {
  provider: FeedProvider;
  status: SurveyBatch["status"];
  expectedCount: number | null;
  recordCount: number;
  targets: ReviewTarget[];
  counts: {
    /** 対象（和集合） */
    target: number;
    /** 内訳（重複し得る） */
    multiplePets: number;
    largeDog: number;
    catsThreeOrMore: number;
    /** 対象のうち、募集終了・申込あり・状態不明（確定時に除外される） */
    targetNotActive: number;
    /** 対象外 */
    unconfirmedCount: number;
    singleOnly: number;
    notAllowed: number;
  };
};

function catsThreeOrMore(r: SurveyRecord) {
  const { species, limits } = r.pet;
  if (!allowsMultiplePets(r.pet) || (species !== "cat" && species !== "cat-and-dog")) return false;
  const cats = limits.cats ?? (species === "cat" ? limits.total : null);
  return cats !== null && cats >= 3;
}

export function summarizeBatch(batch: SurveyBatch): BatchReview {
  const targets = batch.records.filter(r => isPetSurveyTarget(r.pet));
  const others = batch.records.filter(r => !isPetSurveyTarget(r.pet));
  return {
    provider: batch.provider,
    status: batch.status,
    expectedCount: batch.expectedCount ?? null,
    recordCount: batch.records.length,
    targets: targets.map(r => ({
      sourceId: r.sourceId, building: r.building, unit: r.unit, address: r.address, availability: r.availability, application: r.application,
      multi: r.pet.multi, largeDog: r.pet.largeDog, species: r.pet.species, limits: r.pet.limits, petQuote: r.pet.petQuote, conditions: r.pet.conditions,
    })),
    counts: {
      target: targets.length,
      multiplePets: targets.filter(r => allowsMultiplePets(r.pet)).length,
      largeDog: targets.filter(r => allowsLargeDog(r.pet)).length,
      catsThreeOrMore: targets.filter(catsThreeOrMore).length,
      targetNotActive: targets.filter(r => r.availability !== "active" || r.application !== "none").length,
      unconfirmedCount: others.filter(r => r.pet.multi === "unconfirmed-count").length,
      singleOnly: others.filter(r => r.pet.multi === "single-only").length,
      notAllowed: others.filter(r => r.pet.multi === "not-allowed").length,
    },
  };
}

/** 管理API（GET）が返すバッチのメタ情報。 */
export type BatchMeta = { id: string; provider: string; status: string; observedFrom: string; observedTo: string; createdAt: string };

const DAY_MS = 86_400_000;

/**
 * 確定に使うバッチの候補：媒体ごとに、最も新しく保存された verified のバッチ。
 * 足りない媒体と観測期間の幅も返す（確定できるかの最終判断はサーバーの finalize が行う）。
 */
export function pickFinalizationBatches(batches: readonly BatchMeta[], scope: Pick<SurveyScope, "providers" | "maxWindowDays">) {
  const picked = new Map<string, BatchMeta>();
  for (const b of batches) {
    if (b.status !== "verified" || !(scope.providers as readonly string[]).includes(b.provider)) continue;
    const current = picked.get(b.provider);
    if (!current || Date.parse(b.createdAt) > Date.parse(current.createdAt)) picked.set(b.provider, b);
  }
  const chosen = scope.providers.flatMap(p => picked.get(p) ?? []);
  const missing = scope.providers.filter(p => !picked.has(p));
  const from = chosen.length ? Math.min(...chosen.map(b => Date.parse(b.observedFrom))) : null;
  const to = chosen.length ? Math.max(...chosen.map(b => Date.parse(b.observedTo))) : null;
  const windowDays = from !== null && to !== null ? (to - from) / DAY_MS : null;
  return {
    batchIds: chosen.map(b => b.id),
    missing,
    windowDays,
    withinWindow: windowDays !== null && windowDays <= scope.maxWindowDays,
  };
}
