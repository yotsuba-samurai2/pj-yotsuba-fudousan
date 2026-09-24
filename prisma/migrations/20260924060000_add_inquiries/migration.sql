-- 問い合わせの受付（まずペット住宅の借り手・大家フォーム）。個人情報を含む。既存テーブルは変更しない。
-- 本番への適用は別承認（指示書 版2.0 第0章）。ビルドは migrate deploy を実行しない。
-- ※ prisma migrate diff が出す DROP INDEX "columns_locales_gin" は既存のずれ（手書きの GIN インデックスが
--   schema.prisma に未宣言）であり、この変更とは無関係。消すと本番のインデックスが失われるため含めない。

-- CreateTable
CREATE TABLE "inquiries" (
    "id" TEXT NOT NULL,
    "receipt_no" TEXT NOT NULL,
    "idempotency_key" TEXT NOT NULL,
    "business" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "source_path" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "consent_share" TEXT NOT NULL,
    "notify_status" TEXT NOT NULL,
    "auto_reply_status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "inquiries_receipt_no_key" ON "inquiries"("receipt_no");

-- CreateIndex
CREATE UNIQUE INDEX "inquiries_idempotency_key_key" ON "inquiries"("idempotency_key");

-- CreateIndex
CREATE INDEX "inquiries_created_at_idx" ON "inquiries"("created_at");

-- サーバー側の Prisma 接続だけが読み書きする非公開データ。Data API のポリシーは作らない（学区・調査テーブルと同じ）。
ALTER TABLE "inquiries" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "inquiries" FROM PUBLIC;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON TABLE "inquiries" FROM anon;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL ON TABLE "inquiries" FROM authenticated;
  END IF;
END $$;
