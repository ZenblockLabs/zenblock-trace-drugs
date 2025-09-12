-- Fix security definer view issue by implementing proper RLS approach

-- Drop the insecure function and view
DROP VIEW IF EXISTS public.organizations_public;
DROP FUNCTION IF EXISTS public.get_public_organizations();

-- Create a secure view without SECURITY DEFINER that respects RLS
CREATE VIEW public.organizations_public 
WITH (security_barrier = true) AS
SELECT 
    o.id,
    o.created_at,
    o.updated_at,
    o.organization_type,
    o.name,
    o.slug,
    o.description,
    o.logo_url,
    o.industry,
    o.status
FROM organizations o
WHERE o.status = 'active'
  AND EXISTS (
      SELECT 1 FROM batches b 
      WHERE b.organization_id = o.id 
        AND b.status = 'active'
  );

-- Enable RLS on the view (this will work now because it's a simple view)
ALTER VIEW public.organizations_public SET (security_barrier = true);

-- Create specific RLS policy for public access to this view data
-- Since this is organization data that should be publicly visible (like company profiles)
-- we'll create a policy on the underlying organizations table that allows public read
-- for active organizations with active batches
CREATE POLICY "Allow public read for organizations with active batches" 
ON public.organizations 
FOR SELECT 
TO anon
USING (
  status = 'active' 
  AND EXISTS (
    SELECT 1 FROM batches b 
    WHERE b.organization_id = organizations.id 
      AND b.status = 'active'
  )
);

-- Grant SELECT access to the view
GRANT SELECT ON public.organizations_public TO anon;
GRANT SELECT ON public.organizations_public TO authenticated;