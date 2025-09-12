-- Fix security issue: Control access to organizations_public view

-- First, revoke all existing permissions to start fresh
REVOKE ALL ON public.organizations_public FROM anon;
REVOKE ALL ON public.organizations_public FROM authenticated;
REVOKE ALL ON public.organizations_public FROM public;

-- Recreate the view with security filtering built-in
-- This ensures only active, non-sensitive organization data is exposed
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

-- Grant controlled SELECT access
-- Anonymous users can read public organization info
GRANT SELECT ON public.organizations_public TO anon;
-- Authenticated users can also read public organization info  
GRANT SELECT ON public.organizations_public TO authenticated;

-- Add comment explaining security model
COMMENT ON VIEW public.organizations_public IS 'Public view of organizations showing only active organizations with basic, non-sensitive information. Access is controlled through view definition filtering rather than RLS.';