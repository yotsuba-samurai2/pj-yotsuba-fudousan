-- PROPOSAL ONLY. Not a Prisma migration. Never apply automatically.
-- Run in the same reviewed transaction as the original CREATE TABLE when absent.
-- Missing or drifted tables require reconciliation, not silent IF NOT EXISTS.
ALTER TABLE public.property_publication_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL PRIVILEGES ON TABLE public.property_publication_events FROM PUBLIC;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL PRIVILEGES ON TABLE public.property_publication_events FROM anon;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL PRIVILEGES ON TABLE public.property_publication_events FROM authenticated;
  END IF;
END $$;
-- No client policy, SECURITY DEFINER function, role creation or new grant.
-- Existing privileged writer identity/grants must be verified before approval.
