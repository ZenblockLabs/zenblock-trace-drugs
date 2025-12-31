-- Fix 1: Restrict qr_analytics to only allow authorized users to view IP/user agent data
-- Drop the overly permissive SELECT policies
DROP POLICY IF EXISTS "Users can only view analytics for their organization batches" ON public.qr_analytics;
DROP POLICY IF EXISTS "Restrict QR analytics to authorized users only" ON public.qr_analytics;

-- Create a more restrictive policy - only admins and users from the same organization can view
CREATE POLICY "Authorized users can view their org analytics"
ON public.qr_analytics
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_profiles up
    WHERE up.user_id = auth.uid()
    AND (
      up.role = 'admin'::user_role
      OR qr_analytics.batch_id IN (
        SELECT b.id FROM batches b WHERE b.organization_id = up.organization_id
      )
    )
  )
);

-- Fix 2: Restrict organizations table - remove policy that exposes contact_email to all authenticated users
DROP POLICY IF EXISTS "Authenticated users can view organizations" ON public.organizations;

-- Keep only the policies that properly restrict access
-- Users can view their own org or admins can view all (these already exist)