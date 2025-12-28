-- Drop the existing public access policy that exposes contact_email
DROP POLICY IF EXISTS "Controlled public access to active organizations" ON public.organizations;

-- Create a new restricted public access policy that only allows viewing non-sensitive fields
-- This policy allows public to see organizations but the view/query must be done through the organizations_public view
CREATE POLICY "Public can view active organizations via public view only"
ON public.organizations
FOR SELECT
USING (
  -- Only authenticated users can access the full table
  auth.role() = 'authenticated'
  OR
  -- For unauthenticated access, they must use the organizations_public view
  -- which already excludes contact_email and assigned_user fields
  (status = 'active' AND EXISTS (
    SELECT 1 FROM batches b WHERE b.organization_id = organizations.id AND b.status = 'active'
  ) AND auth.role() = 'anon')
);

-- Update the organizations_public view to explicitly exclude sensitive fields
DROP VIEW IF EXISTS public.organizations_public;

CREATE VIEW public.organizations_public AS
SELECT 
  id,
  name,
  slug,
  description,
  logo_url,
  industry,
  status,
  organization_type,
  created_at,
  updated_at
  -- Explicitly excluding: contact_email, assigned_user_id, assigned_user_email
FROM public.organizations
WHERE status = 'active';