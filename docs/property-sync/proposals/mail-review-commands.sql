-- PROPOSAL ONLY: depends on mail-review-store.sql; apply only to the owned synthetic test DB.
-- No runtime grants/policies or public API. Production role assignment requires separate review.
BEGIN;
CREATE TABLE property_sync_private.mail_review_events (
  request_id UUID PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES public.properties(id) ON DELETE RESTRICT,
  review_ref TEXT NOT NULL REFERENCES property_sync_private.mail_review_records(review_ref) ON DELETE RESTRICT,
  actor_ref TEXT NOT NULL CHECK (actor_ref ~ '^admin:[a-f0-9-]{36}$'),
  review_hash TEXT NOT NULL CHECK (review_hash ~ '^[a-f0-9]{64}$'),
  request_hash TEXT NOT NULL CHECK (request_hash ~ '^[a-f0-9]{64}$'),
  operation TEXT NOT NULL CHECK (operation IN ('register','revoke')),
  event TEXT NOT NULL CHECK (event IN ('registered','revoked','already_revoked')),
  before_revision INTEGER NOT NULL CHECK (before_revision >= 0),
  before_hash TEXT CHECK (before_hash ~ '^[a-f0-9]{64}$'),
  head_revision INTEGER NOT NULL CHECK (head_revision >= 1),
  head_hash TEXT NOT NULL CHECK (head_hash ~ '^[a-f0-9]{64}$'),
  created_at TIMESTAMPTZ NOT NULL,
  CHECK ((operation='register' AND event='registered' AND before_revision=0 AND before_hash IS NULL AND head_revision=1)
    OR (operation='revoke' AND before_revision>=1 AND before_hash IS NOT NULL
      AND ((event='revoked' AND head_revision::bigint=before_revision::bigint+1)
        OR (event='already_revoked' AND head_revision=before_revision AND head_hash=before_hash))))
);
CREATE TRIGGER mail_event_immutable BEFORE UPDATE OR DELETE ON property_sync_private.mail_review_events
FOR EACH ROW EXECUTE FUNCTION property_sync_private.mail_record_immutable();
ALTER TABLE property_sync_private.mail_review_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON property_sync_private.mail_review_events FROM PUBLIC;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='anon') THEN REVOKE ALL ON property_sync_private.mail_review_events FROM anon; END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='authenticated') THEN REVOKE ALL ON property_sync_private.mail_review_events FROM authenticated; END IF;
END $$;
COMMIT;
-- Runtime: SELECT/INSERT only on events/records; no DELETE/TRUNCATE, no schema/function/role ownership.
-- Only kind='review' may be INSERTed/UPDATEd by this producer; seven other heads are independently maintained.
-- Record, head and event are one transaction. Failed preflight has no partial registration/audit event.
-- Lock order: request advisory -> review-ref advisory -> property row -> authority rows (kind/scope sorted).
-- Owner-only audit retention/archival and disaster recovery are separate approved operations.
