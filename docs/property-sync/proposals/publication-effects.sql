-- PROPOSAL ONLY: isolated local tests; no production migration/grants.
BEGIN;
CREATE TABLE public.property_publication_effects (
  request_id UUID PRIMARY KEY REFERENCES public.property_write_receipts(request_id) ON DELETE RESTRICT,
  plan JSONB NOT NULL CHECK (jsonb_typeof(plan)='object'),
  plan_hash TEXT NOT NULL CHECK (plan_hash ~ '^[a-f0-9]{64}$'),
  state JSONB NOT NULL CHECK (jsonb_typeof(state)='object'),
  revision INTEGER NOT NULL DEFAULT 0 CHECK (revision>=0)
);
ALTER TABLE public.property_publication_effects ENABLE ROW LEVEL SECURITY;
REVOKE ALL PRIVILEGES ON TABLE public.property_publication_effects FROM PUBLIC;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='anon') THEN REVOKE ALL ON public.property_publication_effects FROM anon; END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='authenticated') THEN REVOKE ALL ON public.property_publication_effects FROM authenticated; END IF;
END $$;
COMMIT;
-- Grants/policies are separately scoped in the synthetic harness. Runtime can update state/revision only.
-- Plan contains reviewed public paths and IDs, never raw property data or notification recipients.
