-- 20260924030000_add_rental_survey の取り消し（手動実行用。Prisma は down.sql を自動では実行しない）。
-- この2テーブルと、この migration の適用記録だけを消す。school_rental_feeds を含む既存テーブルには触れない。
-- 適用記録も消すのは、適用に成功した migration には prisma migrate resolve --rolled-back が使えないため（P3012）。
-- 実行例：npx prisma db execute --file prisma/migrations/20260924030000_add_rental_survey/down.sql --schema prisma/schema.prisma
BEGIN;
DROP TABLE IF EXISTS "rental_survey_finalizations";
DROP TABLE IF EXISTS "rental_survey_batches";
DELETE FROM "_prisma_migrations" WHERE "migration_name" = '20260924030000_add_rental_survey';
COMMIT;
