-- CreateEnum
CREATE TYPE "Business" AS ENUM ('realestate', 'legal', 'labor');

-- CreateEnum
CREATE TYPE "ColumnStatus" AS ENUM ('draft', 'published', 'deleted');

-- CreateTable
CREATE TABLE "columns" (
    "id" TEXT NOT NULL,
    "business" "Business" NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "ColumnStatus" NOT NULL DEFAULT 'draft',
    "modified_date" TEXT,
    "og_image" TEXT,
    "author" JSONB,
    "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "faq" JSONB,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "locales" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "translations" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "columns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translations" (
    "locale" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "translations_pkey" PRIMARY KEY ("locale")
);

-- CreateTable
CREATE TABLE "ai_settings" (
    "id" TEXT NOT NULL DEFAULT 'ai',
    "model" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,

    CONSTRAINT "ai_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "columns_business_status_date_idx" ON "columns"("business", "status", "date" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "columns_business_slug_key" ON "columns"("business", "slug");
