-- PROPOSAL ONLY. Apply only to the owned synthetic database for tests.
-- No production migration, public API, runtime grants or automatic approval producer.
BEGIN;
CREATE SCHEMA property_sync_private;
REVOKE ALL ON SCHEMA property_sync_private FROM PUBLIC;
CREATE TABLE property_sync_private.mail_review_records (
  review_ref TEXT PRIMARY KEY CHECK (review_ref ~ '^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$'),
  property_id TEXT NOT NULL REFERENCES public.properties(id) ON DELETE RESTRICT,
  operator_ref TEXT NOT NULL CHECK (operator_ref ~ '^[A-Za-z0-9][A-Za-z0-9:_-]{0,99}$'),
  review_hash TEXT NOT NULL CHECK (review_hash ~ '^[a-f0-9]{64}$'),
  record_json TEXT NOT NULL CHECK (octet_length(record_json) BETWEEN 2 AND 8000000)
);
CREATE TABLE property_sync_private.mail_authority_heads (
  kind TEXT NOT NULL CHECK (kind IN ('operator','reviewer','episode','review','rules','policies','permissions','materials')),
  scope_key TEXT NOT NULL CHECK (scope_key ~ '^[A-Za-z0-9][A-Za-z0-9_-]{0,99}$'),
  revision INTEGER NOT NULL CHECK (revision BETWEEN 1 AND 2147483647),
  payload_hash TEXT NOT NULL CHECK (payload_hash ~ '^[a-f0-9]{64}$'),
  payload_json TEXT NOT NULL CHECK (octet_length(payload_json) BETWEEN 2 AND 8000000),
  -- Only a locking privilege target; never meaningful state. Keep false; reader UPDATE policy must reject writes.
  lock_token BOOLEAN NOT NULL DEFAULT FALSE CHECK (lock_token = FALSE),
  PRIMARY KEY (kind, scope_key)
);
CREATE FUNCTION property_sync_private.mail_record_immutable() RETURNS trigger
LANGUAGE plpgsql SET search_path = pg_catalog AS $$ BEGIN
  RAISE EXCEPTION USING ERRCODE='23000', MESSAGE='IMMUTABLE_MAIL_REVIEW';
END $$;
CREATE TRIGGER mail_record_immutable BEFORE UPDATE ON property_sync_private.mail_review_records
FOR EACH ROW EXECUTE FUNCTION property_sync_private.mail_record_immutable();
CREATE FUNCTION property_sync_private.mail_head_revision() RETURNS trigger
LANGUAGE plpgsql SET search_path = pg_catalog AS $$ BEGIN
  IF NEW.kind <> OLD.kind OR NEW.scope_key <> OLD.scope_key OR NEW.revision::bigint <> OLD.revision::bigint + 1 THEN
    RAISE EXCEPTION USING ERRCODE='23000', MESSAGE='INVALID_MAIL_AUTHORITY_REVISION';
  END IF;
  IF OLD.kind = 'review' AND OLD.payload_json::jsonb->>'status' = 'revoked' AND (NEW.payload_json::jsonb->>'status') IS DISTINCT FROM 'revoked' THEN
    RAISE EXCEPTION USING ERRCODE='23000', MESSAGE='REVOKED_REVIEW_REQUIRES_NEW_REFERENCE';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER mail_head_revision BEFORE UPDATE ON property_sync_private.mail_authority_heads
FOR EACH ROW EXECUTE FUNCTION property_sync_private.mail_head_revision();
ALTER TABLE property_sync_private.mail_review_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_sync_private.mail_authority_heads ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON ALL TABLES IN SCHEMA property_sync_private FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA property_sync_private FROM PUBLIC;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='anon') THEN
    REVOKE ALL ON SCHEMA property_sync_private FROM anon;
    REVOKE ALL ON ALL TABLES IN SCHEMA property_sync_private FROM anon;
    REVOKE ALL ON ALL FUNCTIONS IN SCHEMA property_sync_private FROM anon;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='authenticated') THEN
    REVOKE ALL ON SCHEMA property_sync_private FROM authenticated;
    REVOKE ALL ON ALL TABLES IN SCHEMA property_sync_private FROM authenticated;
    REVOKE ALL ON ALL FUNCTIONS IN SCHEMA property_sync_private FROM authenticated;
  END IF;
END $$;
COMMIT;
-- Review records are insert-only for an eventual trusted producer; heads update the same key at revision+1.
-- No runtime DELETE/TRUNCATE/key replacement; archival/deletion is a separate authorized owner operation.
-- Lock order: request -> property -> authority heads ordered by kind/scope_key. Producers must use it too.
-- Keep the schema outside PostgREST exposure. A DB-owner bypass can always alter authority: restrict ownership.
