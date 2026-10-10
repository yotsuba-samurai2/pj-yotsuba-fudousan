/** Optional CAS guard for admin corrections; ordinary editors keep their existing API. */
export class ColumnUpdateConflictError extends Error {
  constructor() {
    super("取得後に記事が変更されました。一覧を再取得して内容を確認してください。");
    this.name = "ColumnUpdateConflictError";
  }
}

export function isColumnUpdateTimestamp(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)
    && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
}
