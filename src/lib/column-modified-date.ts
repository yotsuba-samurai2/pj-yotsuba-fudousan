/**
 * コラムの `modifiedDate`（＝sitemap の `lastmod` の元）を決めるための純関数。
 *
 * ## なぜ必要か
 * `src/app/sitemap.ts` の `lastmod` は `modifiedDate ?? date` で作られる。`date` は
 * 初回公開日で改稿しても変えない運用のため、`modifiedDate` を誰も書かないと
 * **原稿を直して再seedしても、管理画面で手直ししても、lastmod が初回公開日のまま
 * 動かない**。Google に更新が伝わらず、改稿の再クロールが遅れる。
 *
 * ## なぜ `updatedAt` を使わないか
 * `Column.updatedAt` は Prisma が update のたびに自動更新するが、
 * `/admin/columns/seed-*` は押すたびに ARTICLES 全件を再 upsert する設計なので、
 * 1本追加しただけで全記事の `updatedAt` が動く。これを lastmod に流すと
 * 「全記事が今日更新された」という嘘になり、`sitemap.ts` のコメントが
 * SEO監査2026-08-24 P1-2 として既に退けた失敗（生成時刻フォールバック）に戻る。
 *
 * そこで **読者に見える本文が実際に変わったときだけ** 日付を打つ。
 *
 * ## どこで呼ぶか
 * `src/lib/db/columns.ts` の `updateColumn`。seed の upsert・管理画面の単体編集・
 * `fix-*` 系の一括修正・`PATCH /api/admin/columns/[id]` は、いずれも最終的に
 * `updateColumn` を通る（`upsertColumnBySlug` だけに入れると、管理画面の手直しと
 * 一括修正が漏れる）。
 *
 * prisma を import しないこと（純関数として単体テストできる状態を保つため）。
 */

/**
 * 更新日を動かすべき「実質的な変更」の対象。
 *
 * `keywords` / `tags` / `category` / `locales` / `ogImage` / `status` は読者が読む
 * 本文ではなく、これらの調整で lastmod を動かすと更新日の信頼性が下がるため対象外。
 */
export type MaterialFields = {
  title: string;
  excerpt: string;
  content: string;
  faq?: unknown;
  translations?: unknown;
};

/** `updateColumn` は部分更新を受けるため、比較対象も部分的になりうる */
export type PartialMaterialFields = Partial<MaterialFields>;

const STRING_FIELDS = ["title", "excerpt", "content"] as const;
const JSON_FIELDS = ["faq", "translations"] as const;

/**
 * キー順に依存しない安定した文字列化。
 * `faq` / `translations` は DB の JSON カラムを往復するためキー順が変わりうる。
 * 素の `JSON.stringify` で比較すると、中身が同じでも「変わった」と誤判定する。
 * `undefined` の値は JSON カラムへ書く際に落ちる（`cleanJson`）ので、ここでも落とす。
 * 空のオブジェクト・空配列・null・undefined は、サイト側の扱いが同じなので同一視する。
 */
function stableStringify(value: unknown): string {
  if (value === undefined || value === null) return "null";
  if (Array.isArray(value)) {
    // 空配列は「無い」と同じ（faq: [] と faq: null をサイトは区別しない）
    if (value.length === 0) return "null";
    return `[${value.map(stableStringify).join(",")}]`;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    // 管理画面のフォームは翻訳が無い言語を undefined で送るため、翻訳なしの記事は
    // `{ en: undefined, "zh-tw": undefined, zh: undefined }` → JSON で `{}` になる。
    // DB 側は null。getLocalizedColumn はどちらも「翻訳なし」として扱うので、
    // ここでも同一視しないと、翻訳のない記事を手で保存するたびに lastmod が動く。
    if (entries.length === 0) return "null";
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

/**
 * 今回の更新が本文のいずれかに触れているか。
 * 触れていなければ（status だけ・locales だけ等）比較のための DB 読み取り自体が不要。
 *
 * 判定は `toUpdateInput` と同じ規約に揃える：
 * - 文字列項目＝ `!== undefined` なら書き込み対象
 * - JSON 項目＝ キーが存在すれば書き込み対象（`{ faq: undefined }` は「消す」の意味）
 */
export function touchesMaterialFields(incoming: PartialMaterialFields): boolean {
  return (
    STRING_FIELDS.some((k) => incoming[k] !== undefined) ||
    JSON_FIELDS.some((k) => k in incoming)
  );
}

/**
 * 読者に見える本文に差があるか。`incoming` に含まれていない項目は「変更なし」として扱う
 * （部分更新で送られてこなかった項目は `toUpdateInput` も触らないため）。
 */
export function hasMaterialChange(
  existing: MaterialFields,
  incoming: PartialMaterialFields,
): boolean {
  for (const k of STRING_FIELDS) {
    const v = incoming[k];
    if (v !== undefined && v !== existing[k]) return true;
  }
  for (const k of JSON_FIELDS) {
    if (k in incoming && stableStringify(incoming[k]) !== stableStringify(existing[k])) {
      return true;
    }
  }
  return false;
}

/**
 * JST の当日（YYYY-MM-DD）。
 * UTC のままだと 09:00 JST より前の更新が前日扱いになる。JST は夏時間がないので
 * +9時間の加算で正確に求まる（ICU／ロケールデータに依存しない）。
 */
export function todayInJst(now: Date = new Date()): string {
  const JST_OFFSET_MS = 9 * 60 * 60 * 1000;
  return new Date(now.getTime() + JST_OFFSET_MS).toISOString().slice(0, 10);
}

export type ResolveModifiedDateParams = {
  /** 既存行。見つからなければ null（その場合は何も決めない） */
  existing: MaterialFields | null;
  /** 今回書き込もうとしている内容（部分更新可） */
  incoming: PartialMaterialFields & { modifiedDate?: string };
  /** 当日（省略時は JST の今日） */
  today?: string;
};

/**
 * 書き込むべき `modifiedDate` を返す。
 *
 * `undefined` を返した場合は **触らない**（`toUpdateInput` が undefined のキーを
 * スキップするため、既存値がそのまま残る）。
 *
 * - 呼び出し側が明示的に `modifiedDate` を渡していれば、それを優先する
 *   （「軽微な修正なので lastmod を動かしたくない」等、人が決めたい場合の逃げ道）
 * - 既存行がなければ `undefined`（新規作成の lastmod は `date` で足りる）
 * - 本文が実際に変わっていれば当日
 * - 変わっていなければ `undefined`（全件再 upsert しても既存記事は動かない）
 */
export function resolveModifiedDate({
  existing,
  incoming,
  today = todayInJst(),
}: ResolveModifiedDateParams): string | undefined {
  if (incoming.modifiedDate !== undefined) return incoming.modifiedDate;
  if (existing === null) return undefined;
  return hasMaterialChange(existing, incoming) ? today : undefined;
}
