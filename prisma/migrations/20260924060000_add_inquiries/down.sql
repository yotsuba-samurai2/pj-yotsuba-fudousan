-- 20260924060000_add_inquiries の取り消し（手動実行用。Prisma は down.sql を自動では実行しない）。
-- 受付データ（個人情報）ごと削除される。inquiries と、この migration の適用記録だけを消す。
-- 適用に成功した migration には prisma migrate resolve --rolled-back が使えないため（P3012）、適用記録の削除も含める。
-- 実行例：npx prisma db execute --file prisma/migrations/20260924060000_add_inquiries/down.sql --schema prisma/schema.prisma
BEGIN;
DROP TABLE IF EXISTS "inquiries";
DELETE FROM "_prisma_migrations" WHERE "migration_name" = '20260924060000_add_inquiries';
COMMIT;
