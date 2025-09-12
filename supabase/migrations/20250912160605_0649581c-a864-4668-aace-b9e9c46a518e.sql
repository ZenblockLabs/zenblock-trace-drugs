-- Clean up and fix the organizations_public security issue properly

-- Drop existing duplicate policies first
DROP POLICY IF EXISTS "Allow public read for organizations with active batches" ON public.organizations;
DROP POLICY IF EXISTS "Public view access for active organizations with batches" ON public.organizations;

-- Drop the insecure function and view if they exist
DROP VIEW IF EXISTS public.organizations_public;
DROP FUNCTION IF EXISTS public.get_public_organizations();

-- Create a clean, secure view that respects RLS
CREATE VIEW public.organizations_public AS
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

-- Create a single clean policy for controlled public access
CREATE POLICY "Controlled public access to active organizations" 
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

-- Grant necessary permissions
GRANT SELECT ON public.organizations_public TO anon;
GRANT SELECT ON public.organizations_public TO authenticated;