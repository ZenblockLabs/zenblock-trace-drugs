-- Drop the view and recreate with SECURITY INVOKER (the default and safe option)
DROP VIEW IF EXISTS public.organizations_public;

-- Recreate view with explicit SECURITY INVOKER to prevent security definer issues
CREATE VIEW public.organizations_public
WITH (security_invoker = true)
AS
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