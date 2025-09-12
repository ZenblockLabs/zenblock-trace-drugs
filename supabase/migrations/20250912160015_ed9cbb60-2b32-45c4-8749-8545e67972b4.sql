-- Fix security issue: Replace organizations_public view with secure function

-- Drop the existing insecure view
DROP VIEW IF EXISTS public.organizations_public;

-- Create a secure function to provide public organization data
CREATE OR REPLACE FUNCTION public.get_public_organizations()
RETURNS TABLE (
    id uuid,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    organization_type organization_type,
    name text,
    slug text,
    description text,
    logo_url text,
    industry text,
    status text
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    -- Only return basic info for organizations with active batches
    -- Exclude sensitive contact information and internal details
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
$$;

-- Grant execute access to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION public.get_public_organizations() TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_organizations() TO authenticated;

-- Create a replacement view that uses the secure function
CREATE VIEW public.organizations_public AS
SELECT * FROM public.get_public_organizations();

-- Grant SELECT access to the view
GRANT SELECT ON public.organizations_public TO anon;
GRANT SELECT ON public.organizations_public TO authenticated;