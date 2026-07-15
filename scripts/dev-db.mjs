#!/usr/bin/env node
/**
 * ローカル検証用の埋め込みPostgres起動スクリプト（root・Docker不要）。
 *
 * 前提: npm i --no-save embedded-postgres （package.jsonには追加しない）
 * 使い方:
 *   PGDATA_DIR=/path/to/pgdata PGPORT=54329 node scripts/dev-db.mjs
 * 接続文字列:
 *   postgresql://postgres:postgres@127.0.0.1:54329/luck428
 *
 * データディレクトリはリポジトリ外を指定すること（コミット禁止）。
 * 停止: SIGINT/SIGTERM（Ctrl+C）でPostgresも一緒に停止する。
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import EmbeddedPostgres from "embedded-postgres";

const dataDir = process.env.PGDATA_DIR ?? path.join(os.tmpdir(), "luck428-pgdata");
const port = Number(process.env.PGPORT ?? 54329);
const dbName = process.env.PGDATABASE ?? "luck428";

const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user: "postgres",
  password: "postgres",
  port,
  persistent: true,
});

if (!fs.existsSync(path.join(dataDir, "PG_VERSION"))) {
  await pg.initialise();
}
await pg.start();
try {
  await pg.createDatabase(dbName);
} catch {
  // 既に存在する場合はOK（再実行安全）
}
console.log(
  `embedded-postgres ready: postgresql://postgres:postgres@127.0.0.1:${port}/${dbName} (data: ${dataDir})`,
);

const shutdown = async () => {
  try {
    await pg.stop();
  } finally {
    process.exit(0);
  }
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
// フォアグラウンドで待機
setInterval(() => {}, 1 << 30);
