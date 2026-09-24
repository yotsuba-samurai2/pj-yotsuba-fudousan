-- ペット等の調査 scope の保存先（学区の school_rental_feeds とは別テーブル。既存テーブルは変更しない）。
-- 本番への適用は別承認（指示書 版2.0 第0章）。ビルドは migrate deploy を実行しない。
-- ※ prisma migrate diff が出す DROP INDEX "columns_locales_gin" は既存のずれ（手書きの GIN インデックスが
--   schema.prisma に未宣言）であり、この変更とは無関係。消すと本番のインデックスが失われるため含めない。

-- CreateTable
CREATE TABLE "rental_survey_batches" (
    "id" TEXT NOT NULL,
    "scope_id" TEXT NOT NULL,
    "scope_version" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "failure_reason" TEXT,
    "observed_from" TIMESTAMP(3) NOT NULL,
    "observed_to" TIMESTAMP(3) NOT NULL,
    "expected_count" INTEGER,
    "record_count" INTEGER NOT NULL,
    "all_pages_checked" BOOLEAN NOT NULL,
    "payload" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rental_survey_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rental_survey_finalizations" (
    "id" TEXT NOT NULL,
    "scope_id" TEXT NOT NULL,
    "scope_version" INTEGER NOT NULL,
    "sequence" INTEGER NOT NULL,
    "batch_ids" TEXT[],
    "providers" TEXT[],
    "dedup_version" INTEGER NOT NULL,
    "observed_from" TIMESTAMP(3) NOT NULL,
    "observed_to" TIMESTAMP(3) NOT NULL,
    "snapshot" JSONB NOT NULL,
    "rolled_back_from" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rental_survey_finalizations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "rental_survey_batches_scope_id_scope_version_provider_creat_idx" ON "rental_survey_batches"("scope_id", "scope_version", "provider", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "rental_survey_finalizations_scope_id_scope_version_sequence_key" ON "rental_survey_finalizations"("scope_id", "scope_version", "sequence");

-- サーバー側の Prisma 接続だけが読み書きする非公開データ。Data API のポリシーは作らない（学区の migration と同じ）。
ALTER TABLE "rental_survey_batches" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "rental_survey_finalizations" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "rental_survey_batches" FROM PUBLIC;
REVOKE ALL ON TABLE "rental_survey_finalizations" FROM PUBLIC;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON TABLE "rental_survey_batches" FROM anon;
    REVOKE ALL ON TABLE "rental_survey_finalizations" FROM anon;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL ON TABLE "rental_survey_batches" FROM authenticated;
    REVOKE ALL ON TABLE "rental_survey_finalizations" FROM authenticated;
  END IF;
END $$;
