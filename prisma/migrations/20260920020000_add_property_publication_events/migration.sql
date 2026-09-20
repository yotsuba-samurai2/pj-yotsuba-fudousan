-- Persistent queue for IndexNow notifications of property publication changes.
-- No existing table is modified; safe to apply independently.
CREATE TABLE "property_publication_events" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "urls" TEXT[],
    "content_hash" TEXT,
    "notify_status" TEXT NOT NULL DEFAULT 'pending',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "last_status" INTEGER,
    "next_attempt_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_publication_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "property_publication_events_notify_status_next_attempt_at_idx" ON "property_publication_events"("notify_status", "next_attempt_at");

CREATE INDEX "property_publication_events_slug_idx" ON "property_publication_events"("slug");
