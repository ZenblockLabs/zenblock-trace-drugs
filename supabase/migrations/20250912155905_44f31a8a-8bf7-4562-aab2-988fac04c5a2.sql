-- Fix security issue: Enable RLS and create policies for organizations_public

-- Enable Row Level Security on organizations_public view/table
ALTER TABLE public.organizations_public ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access only to active organizations
-- This maintains the "public" nature while adding basic security controls
CREATE POLICY "Allow public read access to active organizations" 
ON public.organizations_public 
FOR SELECT 
USING (
  status = 'active' OR status IS NULL  -- Allow access to active orgs or when status is not set
);

-- Create policy to prevent any modifications to the public view
-- Only authenticated admin users should be able to make changes indirectly through the main organizations table
CREATE POLICY "Prevent direct modifications to public view" 
ON public.organizations_public 
FOR ALL 
USING (false)
WITH CHECK (false);

-- Grant SELECT access to anonymous users for the public view
GRANT SELECT ON public.organizations_public TO anon;
GRANT SELECT ON public.organizations_public TO authenticated;