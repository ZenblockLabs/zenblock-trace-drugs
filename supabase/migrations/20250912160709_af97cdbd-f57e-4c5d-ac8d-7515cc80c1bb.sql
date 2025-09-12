-- Fix contact information exposure issue

-- Update the organizations_public view to exclude sensitive contact information
DROP VIEW IF EXISTS public.organizations_public;

-- Recreate the view without sensitive contact information
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
    -- Explicitly exclude: contact_email, assigned_user_id, assigned_user_email
FROM organizations o
WHERE o.status = 'active'
  AND EXISTS (
      SELECT 1 FROM batches b 
      WHERE b.organization_id = o.id 
        AND b.status = 'active'
  );

-- Grant necessary permissions
GRANT SELECT ON public.organizations_public TO anon;
GRANT SELECT ON public.organizations_public TO authenticated;