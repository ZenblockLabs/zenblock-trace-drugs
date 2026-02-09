
-- Fix overly permissive RLS policies on batch_events
-- DROP the permissive INSERT/UPDATE/DELETE policies
DROP POLICY IF EXISTS "Authenticated users can insert events" ON public.batch_events;
DROP POLICY IF EXISTS "Authenticated users can update events" ON public.batch_events;
DROP POLICY IF EXISTS "Authenticated users can delete events" ON public.batch_events;

-- Replace with org-scoped policies
CREATE POLICY "Users can insert events for their org batches"
ON public.batch_events
FOR INSERT
TO authenticated
WITH CHECK (
  batch_id IN (
    SELECT b.id FROM public.batches b
    JOIN public.user_profiles up ON b.organization_id = up.organization_id
    WHERE up.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_id = auth.uid() AND role = 'admin'::user_role
  )
);

CREATE POLICY "Users can update events for their org batches"
ON public.batch_events
FOR UPDATE
TO authenticated
USING (
  batch_id IN (
    SELECT b.id FROM public.batches b
    JOIN public.user_profiles up ON b.organization_id = up.organization_id
    WHERE up.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_id = auth.uid() AND role = 'admin'::user_role
  )
)
WITH CHECK (
  batch_id IN (
    SELECT b.id FROM public.batches b
    JOIN public.user_profiles up ON b.organization_id = up.organization_id
    WHERE up.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_id = auth.uid() AND role = 'admin'::user_role
  )
);

CREATE POLICY "Users can delete events for their org batches"
ON public.batch_events
FOR DELETE
TO authenticated
USING (
  batch_id IN (
    SELECT b.id FROM public.batches b
    JOIN public.user_profiles up ON b.organization_id = up.organization_id
    WHERE up.user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_id = auth.uid() AND role = 'admin'::user_role
  )
);

-- Fix overly permissive RLS policies on organizations
DROP POLICY IF EXISTS "Authenticated users can create organizations" ON public.organizations;
DROP POLICY IF EXISTS "Authenticated users can update organizations" ON public.organizations;

-- Only admins can create organizations
CREATE POLICY "Admins can create organizations"
ON public.organizations
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_id = auth.uid() AND role = 'admin'::user_role
  )
);

-- Users can update their own org, admins can update any
CREATE POLICY "Users can update their own organization"
ON public.organizations
FOR UPDATE
TO authenticated
USING (
  id IN (
    SELECT organization_id FROM public.user_profiles
    WHERE user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_id = auth.uid() AND role = 'admin'::user_role
  )
)
WITH CHECK (
  id IN (
    SELECT organization_id FROM public.user_profiles
    WHERE user_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_id = auth.uid() AND role = 'admin'::user_role
  )
);
