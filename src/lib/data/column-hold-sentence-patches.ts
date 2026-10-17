// コラム本文から「公開は資格者確認待ちとして保留します」と、その訳文（en / zh-tw / zh）を取り除く（2026-10-17）。
//
// 背景：自動公開の品質確認待ちだった記事の本文に、生成時の保留メモがそのまま入っていた。
//   2026-10-17に管理画面の「今すぐ公開」で公開待ちの35本を公開したとき、
//   うち18本（2026-10-11〜10-16付。不動産12・行政書士4・社労士2）は、この一文が残ったまま公開された。
//   原稿（scripts/*-columns の日本語と訳）と3つのseedからは、同じ日の修正で削除した。
//   公開済みのDB側は /admin/columns/fix-hold-sentence で、この置換をまとめて適用する。
//
// 置換は文の完全一致だけ（正規表現は使わない）。前後に別の情報が付く文（行政書士109・110・113）は、
//   保留の部分だけを外して、残りの情報は残す。冪等：置換後の文字列は再一致しない。

export type HoldSentenceMatch = { path: string; removed: string; replacement: string };

/**
 * [置換前, 置換後]。上から順に適用する。
 * 同じ言語の中では、前後を含む長いものを先に置く（短いものが先に一致して文が崩れないように）。
 */
export const HOLD_SENTENCE_RULES: readonly (readonly [string, string])[] = [
  // 日本語
  ["取得不能を誤りの確定とせず、公開は資格者確認待ちとして保留します。", ""],
  ["取得不能を条文の誤りとは断定せず、公開は資格者確認待ちとして保留します。", ""],
  ["は未検証のため、公開は資格者確認待ちとして保留します。", "は未検証です。"],
  ["公開は資格者確認待ちとして保留し、", ""],
  ["公開は資格者確認待ちとして保留します。", ""],
  // English
  [" Retrieval failure does not prove an error; publication is held pending qualified review.", ""],
  [" Retrieval failure does not establish a legal error; publication remains held pending qualified review.", ""],
  ["remain unverified; publication is held pending qualified review.", "remain unverified."],
  ["Publication is held pending qualified review; registration,", "Registration,"],
  [" Publication is held pending qualified review.", ""],
  [" Publication remains held pending qualified review.", ""],
  // 繁體中文
  ["取得不能不等於確定錯誤，公開保留待資格者確認。", ""],
  ["取得不能不等於法令錯誤；公開仍保留待資格者確認。", ""],
  ["為未驗證，故公開以有資格者確認前保留。", "為未驗證。"],
  ["未驗證，公開保留待資格者確認。", "未驗證。"],
  ["公開保留待資格者確認；", ""],
  ["公開以有資格者確認前保留。", ""],
  ["公開保留待資格者確認。", ""],
  ["公開以資格者確認待ち保留。", ""],
  ["公開待資格者確認前暫為保留。", ""],
  ["公開以資格者確認為前提暫予保留。", ""],
  ["公開以資格者確認待命而保留。", ""],
  // 简体中文
  ["取得不能不等于确定错误，公开保留待资格者确认。", ""],
  ["取得不能不等于法令错误；公开仍保留待资格者确认。", ""],
  ["为未验证，故公开以有资格者确认前保留。", "为未验证。"],
  ["未验证，公开保留待资格者确认。", "未验证。"],
  ["公开保留待资格者确认；", ""],
  ["公开以有资格者确认前保留。", ""],
  ["公开保留待资格者确认。", ""],
  ["公开以资格者确认待ち保留。", ""],
  ["公开待资格者确认前暂为保留。", ""],
  ["公开以资格者确认为前提暂予保留。", ""],
  ["公开以资格者确认待命而保留。", ""],
];

/** 1つの文字列に置換を順に適用する。当たった置換も返す。 */
export function removeHoldSentences(text: string): {
  text: string;
  hits: { removed: string; replacement: string }[];
} {
  const hits: { removed: string; replacement: string }[] = [];
  let out = text;
  for (const [removed, replacement] of HOLD_SENTENCE_RULES) {
    if (!out.includes(removed)) continue;
    const parts = out.split(removed);
    for (let i = 1; i < parts.length; i++) hits.push({ removed, replacement });
    out = parts.join(replacement);
  }
  return { text: out, hits };
}

/** 文字列リーフを再帰的にたどって置換する。変更の有無と一致点を集める。 */
function walkPatch(
  node: unknown,
  path: string,
  matches: HoldSentenceMatch[],
): { value: unknown; changed: boolean } {
  if (typeof node === "string") {
    const { text, hits } = removeHoldSentences(node);
    if (hits.length === 0) return { value: node, changed: false };
    for (const hit of hits) matches.push({ path, ...hit });
    return { value: text, changed: true };
  }
  if (Array.isArray(node)) {
    let changed = false;
    const out = node.map((v, i) => {
      const r = walkPatch(v, `${path}.${i}`, matches);
      if (r.changed) changed = true;
      return r.value;
    });
    return { value: changed ? out : node, changed };
  }
  if (node && typeof node === "object") {
    let changed = false;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node)) {
      const r = walkPatch(v, `${path}.${k}`, matches);
      if (r.changed) changed = true;
      out[k] = r.value;
    }
    return { value: changed ? out : node, changed };
  }
  return { value: node, changed: false };
}

/**
 * 1コラムを走査し、変更が要るトップレベルの項目だけのパッチと、全一致点を返す。
 * matches が空なら該当なし。patchedFields はそのまま updateColumn に渡せる。
 * id・slug・日時などの項目は、置換の文字列を含まないので変わらない。
 */
export function patchColumnHoldSentence(col: Record<string, unknown>): {
  patchedFields: Record<string, unknown>;
  matches: HoldSentenceMatch[];
} {
  const matches: HoldSentenceMatch[] = [];
  const patchedFields: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(col)) {
    if (k === "id" || k === "createdAt" || k === "updatedAt") continue;
    const r = walkPatch(v, k, matches);
    if (r.changed) patchedFields[k] = r.value;
  }
  return { patchedFields, matches };
}
