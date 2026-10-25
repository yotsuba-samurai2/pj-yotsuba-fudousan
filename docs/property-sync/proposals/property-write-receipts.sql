-- PROPOSAL ONLY. Apply only in an explicitly isolated synthetic test database.
-- No Prisma production migration or runtime role grants are installed by this file.
BEGIN;
CREATE TABLE public.property_write_receipts (
  request_id UUID PRIMARY KEY,
  property_id TEXT NOT NULL REFERENCES public.properties(id) ON DELETE RESTRICT,
  request_hash TEXT NOT NULL CHECK (request_hash ~ '^[a-f0-9]{64}$'),
  initiator_hash TEXT CHECK (initiator_hash ~ '^[a-f0-9]{64}$'),
  expected_version TIMESTAMPTZ(3) NOT NULL,
  result_version TIMESTAMPTZ(3) NOT NULL,
  result_hash TEXT NOT NULL CHECK (result_hash ~ '^[a-f0-9]{64}$'),
  outcome TEXT NOT NULL CHECK (outcome IN ('applied','held')),
  reason TEXT NOT NULL CHECK (reason IN ('SAVED','VERSION_CONFLICT','INVALID_PROPERTY','PUBLICATION_GATE_REJECTED')),
  CHECK ((outcome='applied' AND reason='SAVED' AND result_version>expected_version)
    OR (outcome='held' AND reason<>'SAVED'))
);
CREATE INDEX property_write_receipts_property_id ON public.property_write_receipts(property_id);
ALTER TABLE public.property_write_receipts ENABLE ROW LEVEL SECURITY;
REVOKE ALL PRIVILEGES ON TABLE public.property_write_receipts FROM PUBLIC;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='anon') THEN
    REVOKE ALL PRIVILEGES ON TABLE public.property_write_receipts FROM anon;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='authenticated') THEN
    REVOKE ALL PRIVILEGES ON TABLE public.property_write_receipts FROM authenticated;
  END IF;
END $$;
COMMIT;
-- Append-only runtime grants + scoped RLS must be reviewed separately for production.
-- Retention/tombstones are undecided: RESTRICT intentionally prevents deleting history with its property.
-- Contains hashes/versions/outcomes only, never property text, images, AD, fees or raw patch JSON.
-- Nullable owner is intentional: existing receipts must not be attributed by inference/backfill.
-- For an already-created local table, review an additive nullable column separately before using the new adapter.
