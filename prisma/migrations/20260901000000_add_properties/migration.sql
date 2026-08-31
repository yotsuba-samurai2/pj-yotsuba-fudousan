-- CreateEnum
CREATE TYPE "PropertyStatus" AS ENUM ('draft', 'published', 'closed');

-- CreateEnum
CREATE TYPE "PropertyDealType" AS ENUM ('land', 'house', 'condo', 'wholeBuilding', 'businessBuilding');

-- CreateEnum
CREATE TYPE "PropertyCategory" AS ENUM ('gh', 'jigyo', 'souzoku', 'toushi', 'other');

-- CreateEnum
CREATE TYPE "PropertyTradeMode" AS ENUM ('seller', 'agent', 'broker');

-- CreateTable
CREATE TABLE "properties" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "PropertyStatus" NOT NULL DEFAULT 'draft',
    "deal_type" "PropertyDealType" NOT NULL,
    "category" "PropertyCategory" NOT NULL,
    "trade_mode" "PropertyTradeMode" NOT NULL,
    "title" TEXT NOT NULL,
    "price_yen" BIGINT NOT NULL,
    "price_note" TEXT,
    "location_text" TEXT NOT NULL,
    "access" JSONB NOT NULL DEFAULT '[]',
    "spec" JSONB NOT NULL,
    "images" JSONB NOT NULL DEFAULT '[]',
    "description" TEXT NOT NULL,
    "published_at" TEXT,
    "info_updated_at" TEXT NOT NULL,
    "next_update_at" TEXT NOT NULL,
    "locales" TEXT[] DEFAULT ARRAY['ja']::TEXT[],
    "translations" JSONB,
    "internal" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "properties_slug_key" ON "properties"("slug");

-- CreateIndex
CREATE INDEX "properties_status_category_idx" ON "properties"("status", "category");

