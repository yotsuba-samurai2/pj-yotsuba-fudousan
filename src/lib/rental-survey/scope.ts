import type { FeedProvider } from "@/lib/school-rental-feed";

/**
 * 調査 scope の登録簿（ペット横断 指示書 版2.0 第4章）。
 * 学区の比較フィード（SCHOOL_SCOPE_ID）は既存テーブル school_rental_feeds 専用で、この保存先には入れない。
 * 条件・対象媒体を変えるときは版を上げる（版が違う確定どうしは比較しない）。
 */
export const SCHOOL_SCOPE_ID = "bunkyo-rent-175000-area-48";

/** 住戸の同一性判定の版。判定方法を変えたら上げる。古い版の確定は公開せず、巻き戻し先にもしない。 */
export const DEDUP_VERSION = 1;

export type SurveyScope = {
  scopeId: string;
  version: number;
  /** 住所に含まれるべき区名。学区の賃料・面積・学区確定の条件は持たない。 */
  region: string;
  /** 対象媒体。全媒体の verified バッチがそろって初めて確定できる。 */
  providers: readonly FeedProvider[];
  /** 確定に使うバッチの観測期間（最も早い開始〜最も遅い終了）の上限日数。 */
  maxWindowDays: number;
  /** 表示部品の条件文の辞書キー。 */
  conditionsKey: string;
};

const SCOPES: Record<string, { current: SurveyScope }> = {
  "bunkyo-rent-pet": {
    current: {
      scopeId: "bunkyo-rent-pet",
      version: 1,
      region: "文京区",
      providers: ["reins", "atbb", "itandi", "eslife"],
      maxWindowDays: 7,
      conditionsKey: "bunkyo-rent-pet-v1",
    },
  },
};

/**
 * scope の指定を検証して現行の定義を返す。欠落・未知の scope・現行でない版・学区 scope は null。
 * 呼び出し側は null を「全 scope」と解釈してはならない（指示書 第4.2章）。
 */
export function resolveSurveyScope(scopeId: unknown, scopeVersion: unknown): SurveyScope | null {
  if (typeof scopeId !== "string" || typeof scopeVersion !== "number") return null;
  if (!Object.hasOwn(SCOPES, scopeId)) return null;
  const scope = SCOPES[scopeId].current;
  return scope.version === scopeVersion ? scope : null;
}

/** 公開面で使う現行の定義。未知の scope・学区 scope は null。 */
export function currentSurveyScope(scopeId: string): SurveyScope | null {
  return Object.hasOwn(SCOPES, scopeId) ? SCOPES[scopeId].current : null;
}

/** 公開フラグ等で使う scope の識別子（例：bunkyo-rent-pet:1）。版を含めるので、新しい版は自動で公開されない。 */
export function scopeKey(scope: Pick<SurveyScope, "scopeId" | "version">) {
  return `${scope.scopeId}:${scope.version}`;
}
