-- PROPOSAL ONLY: local synthetic tests; never automatically applied.
-- properties.id is TEXT in the existing Prisma schema, not a PostgreSQL UUID column.
-- Keep CREATE/RLS/REVOKE atomic; never run individual statements in autocommit mode.
BEGIN;
CREATE TABLE public.property_sync_media_state (
  property_id TEXT NOT NULL REFERENCES public.properties(id) ON DELETE RESTRICT,
  episode_id TEXT NOT NULL,
  media TEXT NOT NULL CHECK (media IN ('site','athome')),
  version INTEGER NOT NULL DEFAULT 0 CHECK (version BETWEEN 0 AND 1000),
  genesis JSONB NOT NULL,
  state JSONB NOT NULL,
  head_hash TEXT NOT NULL CHECK (head_hash ~ '^[a-f0-9]{64}$'),
  PRIMARY KEY (property_id, episode_id, media)
);
CREATE TABLE public.property_sync_media_audit (
  property_id TEXT NOT NULL,
  episode_id TEXT NOT NULL,
  media TEXT NOT NULL,
  sequence INTEGER NOT NULL CHECK (sequence BETWEEN 1 AND 1000),
  request_id UUID NOT NULL,
  event JSONB NOT NULL,
  PRIMARY KEY (property_id, episode_id, media, sequence),
  UNIQUE (property_id, episode_id, media, request_id),
  FOREIGN KEY (property_id, episode_id, media) REFERENCES public.property_sync_media_state ON DELETE RESTRICT
);
ALTER TABLE public.property_sync_media_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_sync_media_audit ENABLE ROW LEVEL SECURITY;
REVOKE ALL PRIVILEGES ON TABLE public.property_sync_media_state, public.property_sync_media_audit FROM PUBLIC;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='anon') THEN
    REVOKE ALL PRIVILEGES ON TABLE public.property_sync_media_state, public.property_sync_media_audit FROM anon;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='authenticated') THEN
    REVOKE ALL PRIVILEGES ON TABLE public.property_sync_media_state, public.property_sync_media_audit FROM authenticated;
  END IF;
END $$;
COMMIT;
-- Runtime role/grants, archival beyond 1000 events and audit ownership require separate review.
-- No trigger updates properties; audit changes cannot advance the property's updated_at.
