-- =========================================================
-- Supabase RLS audit + fixes for AM Travel & Tours CRM
-- =========================================================
-- Purpose:
-- - Use auth.uid() as the source of truth
-- - Respect the profiles."Roles" column (capital R)
-- - Enforce created_by rules for workers vs admin-level users
-- - Prevent non-Super Admin users from changing roles
-- =========================================================

-- 1) Helper function: admin-level access
CREATE OR REPLACE FUNCTION public.is_admin_level(p_user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = COALESCE(p_user_id, auth.uid())
      AND p."Roles" IN ('Super Admin', 'Admin', 'Accounts')
  );
$$;

-- 2) Helper function: create profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, "Roles")
  VALUES (NEW.id, 'Employee / Worker')
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- 3) Helper function: prevent non-Super Admin role changes
CREATE OR REPLACE FUNCTION public.prevent_non_superadmin_role_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE'
     AND NEW."Roles" IS DISTINCT FROM OLD."Roles" THEN
    IF NOT EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p."Roles" = 'Super Admin'
    ) THEN
      RAISE EXCEPTION 'Only Super Admin can change roles';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- 4) Drop existing policies before creating new ones
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('profiles', 'clients', 'quotes', 'invoices', 'activity_log')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I',
      r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

-- 5) Enable RLS on target tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- 6) Create trigger to protect role changes
DROP TRIGGER IF EXISTS trg_profiles_role_guard ON public.profiles;
CREATE TRIGGER trg_profiles_role_guard
BEFORE UPDATE OF "Roles"
ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_non_superadmin_role_changes();

-- 7) Create trigger for auth signup profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- 8) Create indexes for created_by
CREATE INDEX IF NOT EXISTS clients_created_by_idx ON public.clients(created_by);
CREATE INDEX IF NOT EXISTS quotes_created_by_idx ON public.quotes(created_by);
CREATE INDEX IF NOT EXISTS invoices_created_by_idx ON public.invoices(created_by);

-- 9) Profiles policies
-- All authenticated roles can read profiles.
CREATE POLICY "profiles_select_all_authenticated"
ON public.profiles
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Users can update their own profile, but role changes are restricted by trigger.
CREATE POLICY "profiles_update_own_or_superadmin"
ON public.profiles
FOR UPDATE
USING (
  id = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p."Roles" = 'Super Admin'
  )
)
WITH CHECK (
  id = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p."Roles" = 'Super Admin'
  )
);

-- 10) Clients policies
-- Workers see only their own records. Admin-level users see all records.
CREATE POLICY "clients_select_own_or_admin"
ON public.clients
FOR SELECT
USING (
  auth.uid() IS NOT NULL
  AND (
    public.is_admin_level(auth.uid())
    OR created_by = auth.uid()
  )
);

CREATE POLICY "clients_insert_own_only"
ON public.clients
FOR INSERT
WITH CHECK (created_by = auth.uid());

CREATE POLICY "clients_update_own_or_admin"
ON public.clients
FOR UPDATE
USING (
  public.is_admin_level(auth.uid())
  OR created_by = auth.uid()
)
WITH CHECK (
  public.is_admin_level(auth.uid())
  OR created_by = auth.uid()
);

-- 11) Quotes policies
CREATE POLICY "quotes_select_own_or_admin"
ON public.quotes
FOR SELECT
USING (
  auth.uid() IS NOT NULL
  AND (
    public.is_admin_level(auth.uid())
    OR created_by = auth.uid()
  )
);

CREATE POLICY "quotes_insert_own_only"
ON public.quotes
FOR INSERT
WITH CHECK (created_by = auth.uid());

CREATE POLICY "quotes_update_own_or_admin"
ON public.quotes
FOR UPDATE
USING (
  public.is_admin_level(auth.uid())
  OR created_by = auth.uid()
)
WITH CHECK (
  public.is_admin_level(auth.uid())
  OR created_by = auth.uid()
);

-- 12) Invoices policies
CREATE POLICY "invoices_select_own_or_admin"
ON public.invoices
FOR SELECT
USING (
  auth.uid() IS NOT NULL
  AND (
    public.is_admin_level(auth.uid())
    OR created_by = auth.uid()
  )
);

CREATE POLICY "invoices_insert_own_only"
ON public.invoices
FOR INSERT
WITH CHECK (created_by = auth.uid());

CREATE POLICY "invoices_update_own_or_admin"
ON public.invoices
FOR UPDATE
USING (
  public.is_admin_level(auth.uid())
  OR created_by = auth.uid()
)
WITH CHECK (
  public.is_admin_level(auth.uid())
  OR created_by = auth.uid()
);

-- Only Admin/Super Admin can delete invoices.
CREATE POLICY "invoices_delete_admin_only"
ON public.invoices
FOR DELETE
USING (
  auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p."Roles" IN ('Super Admin', 'Admin')
  )
);

-- 13) Activity log policies
CREATE POLICY "activity_log_insert_authenticated"
ON public.activity_log
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "activity_log_select_admin_only"
ON public.activity_log
FOR SELECT
USING (
  auth.uid() IS NOT NULL
  AND EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p."Roles" IN ('Super Admin', 'Admin', 'Accounts')
  )
);
