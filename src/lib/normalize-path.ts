// locale接頭辞（/en /zh-tw /zh）を除去してマッチ用の正規化パスを得る
// ※cross-links.tsから分離（フェーズK-4・2026-07-10）：client（TenantLayout）がcross-linksを
//   ランタイムimportするとC7〜C14のアンカー文言（社労士事務所名）がクライアントJSに同梱されるため。
export function normalizePath(pathname: string): string {
  return pathname.replace(/^\/(en|zh-tw|zh)(?=\/|$)/, "") || "/";
}
