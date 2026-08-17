-- Migration: Add registered_date (DATE) and source_of_lead (TEXT) to public.clients
-- Created: 2026-08-17
-- Purpose: Fix frontend errors where `registered_date` and `source_of_lead` are expected by the UI.
--
-- Safe approach taken here:
-- 1) Add columns if they do not exist (nullable).
-- 2) Backfill registered_date from created_at (date-only) for existing rows where possible.
-- 3) Provide optional next-step SQL (commented) to set a DEFAULT or NOT NULL constraint after verification.
--
-- Usage notes:
-- - Run this file in the Supabase SQL editor or via psql against the same database used by the app.
-- - After running, open the table in the Supabase UI or run a simple SELECT to refresh PostgREST schema cache.
-- - If you have Row-Level Security (RLS) policies, review them to ensure INSERT/UPDATE/SELECT continue to work for authenticated roles.

BEGIN;

-- 1) Add columns (idempotent when using IF NOT EXISTS)
ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS registered_date DATE,
  ADD COLUMN IF NOT EXISTS source_of_lead TEXT;

-- 2) Backfill registered_date from created_at (date-only) for existing rows
--    This is safe: only sets registered_date where it is currently NULL and created_at is present.
UPDATE public.clients
SET registered_date = (created_at::date)
WHERE registered_date IS NULL AND created_at IS NOT NULL;

COMMIT;

-- === Optional next step ===
-- After running the migration above and verifying the application behaves as expected, you may
-- want to enforce that new rows always have registered_date populated. Do this in a separate
-- migration after validating existing data and application behavior.
--
-- Example: set a default to today's date (for new inserts) but keep existing rows intact:
-- ALTER TABLE public.clients
--   ALTER COLUMN registered_date SET DEFAULT (now()::date);
--
-- Make the column NOT NULL only after you're confident all existing rows have a valid value:
-- ALTER TABLE public.clients
--   ALTER COLUMN registered_date SET NOT NULL;

-- === RLS / Policy guidance (example) ===
-- If your table uses RLS and you rely on the 'authenticated' role to insert rows, ensure a policy
-- permits INSERT. Adjust policy expressions to account for the new columns if your policies
-- explicitly check column values using WITH CHECK / USING clauses.
-- Example: (only run if you need a simple allow-for-authenticated policy)
--
-- -- Allow authenticated users to insert rows (review before enabling in production):
-- CREATE POLICY allow_authenticated_insert_on_clients
--   ON public.clients
--   FOR INSERT
--   TO authenticated
--   WITH CHECK ( true );
--
-- -- Allow authenticated users to select their rows (example using created_by)
-- CREATE POLICY allow_select_own_clients
--   ON public.clients
--   FOR SELECT
--   TO authenticated
--   USING ( created_by = auth.uid() );
--
-- NOTE: Do not apply the example RLS policies blindly — adapt them to your security model.
-- Review existing policies first (SELECT * FROM pg_policies or check Supabase UI).

-- End of migration
