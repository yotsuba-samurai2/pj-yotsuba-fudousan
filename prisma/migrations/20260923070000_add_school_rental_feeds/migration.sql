-- CreateTable
CREATE TABLE "school_rental_feeds" (
    "provider" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "checked_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "school_rental_feeds_pkey" PRIMARY KEY ("provider")
);

-- Only the server-side Prisma connection reads this private feed. No Data API policies.
ALTER TABLE "school_rental_feeds" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "school_rental_feeds" FROM PUBLIC;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON TABLE "school_rental_feeds" FROM anon;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL ON TABLE "school_rental_feeds" FROM authenticated;
  END IF;
END $$;
