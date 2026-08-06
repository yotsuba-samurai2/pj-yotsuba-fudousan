// 社労士（事業体）エントリの除去（法27条・源HTML漏れ対策）。
//
// 背景：labor配下の翻訳は全ページのRSCペイロードとしてHTMLに埋め込まれるため、
// 開業（SR_LAUNCHED=true）まではクライアントに送らない。app/layout.tsx がこれを使う。
//
// ★ このファイルはサーバー専用。クライアントコンポーネントから import しないこと
//   （事務所名の判定に使う文字列がクライアントJSチャンクに載る）。
//
// 2026-08-05：**繁体字の「社會保險勞務士」が除去されず本番に漏れていた**ため、
// 判定を全書体＋英語に拡張し、テスト（sr-strip.test.ts）で固定した。
// 旧実装は /社会保険労務士|社労士/ で日本語の漢字しか見ていなかった。
//   ja     社会保険労務士 / 社労士
//   zh-tw  社會保險勞務士        ← 会→會・険→險・労→勞 が別字のため一致しなかった
//   zh     社会保险劳务士        ← 险・劳・务 が別字のため一致しなかった
//   en     Yotsuba Labor & Social Insurance Office など

/**
 * 社労士（事業体）を指す名称かどうかの判定。
 * 全書体の異体字を文字クラスで吸収し、英語表記も拾う。
 *
 * 文字の対応：
 *   会/會/会   険/險/险   労/勞/劳   務/务
 */
export const SR_ENTITY_NAME_RE =
  /社[会會]保[険險险][労勞劳][務务]士|社[労勞劳]士|Labor\s*(?:&|and)\s*Social\s*Insurance|Social\s*Insurance\s*(?:&|and)\s*Labor|Labor\s*and\s*Social\s*Security\s*Attorney/i;

/**
 * 翻訳データを再帰的に走査し、配列要素のうち `name` が社労士事業体を指すものを取り除く。
 *
 * 対象例：
 *   legal.homePage.groupBusinesses[2].name
 *   realestate.aboutPage.groupBusinesses[2].name
 *
 * 文字列だけの値（例：「社会保険労務士試験合格（2026年9月開業予定）」）は
 * `name` を持つ配列要素ではないため影響しない。**試験合格の注記は残る。**
 */
export function stripSrEntities(node: unknown): unknown {
  if (Array.isArray(node)) {
    return node
      .filter(
        (el) =>
          !(
            el &&
            typeof el === "object" &&
            SR_ENTITY_NAME_RE.test(
              String((el as Record<string, unknown>).name ?? ""),
            )
          ),
      )
      .map(stripSrEntities);
  }
  if (node && typeof node === "object") {
    const o = node as Record<string, unknown>;
    for (const k of Object.keys(o)) o[k] = stripSrEntities(o[k]);
    return o;
  }
  return node;
}
