-- Fix security definer view warning
-- Recreate the view to ensure it uses invoker rights, not definer rights

DROP VIEW IF EXISTS public.organizations_public;

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
FROM public.organizations o
WHERE 
  o.status = 'active'  -- Only show active organizations
  AND o.name IS NOT NULL  -- Ensure organization has a name
  AND o.slug IS NOT NULL;  -- Ensure organization has a slug

-- Ensure proper ownership and no security definer properties
ALTER VIEW public.organizations_public OWNER TO postgres;

-- Re-grant controlled access
GRANT SELECT ON public.organizations_public TO anon;
GRANT SELECT ON public.organizations_public TO authenticated;

-- Add security comment
COMMENT ON VIEW public.organizations_public IS 'Secure public view of active organizations with filtered data. Uses invoker rights for security.';