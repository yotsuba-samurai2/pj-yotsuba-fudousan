// locale接頭辞（/en /zh-tw /zh）を除去してマッチ用の正規化パスを得る
// ※cross-links.tsから分離（フェーズK-4・2026-07-10）：client（TenantLayout）がcross-linksを
//   ランタイムimportするとC7〜C14のアンカー文言（社労士事務所名）がクライアントJSに同梱されるため。
export function normalizePath(pathname: string): string {
  // 【2026-09-02】ja を追加。PR#297のロケールURLセグメント化以降、サーバ描画時のパスは
  // ja でも「/ja/...」を含むため、剥がさないとフッターのいい相続バナー（ja限定表示）や
  // 不動産トップのLINKA FAB抑制（1ページ1LINKA）の判定が全て外れる（本番実測）。
  return pathname.replace(/^\/(ja|en|zh-tw|zh)(?=\/|$)/, "") || "/";
}
