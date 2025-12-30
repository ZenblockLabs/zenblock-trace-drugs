-- Fix 1: Remove overly permissive erp_batches policies and keep only authenticated ones
DROP POLICY IF EXISTS "Anyone can insert ERP batches" ON public.erp_batches;
DROP POLICY IF EXISTS "Anyone can view ERP batches" ON public.erp_batches;

-- Fix 2: Update actor_capsules policy to not expose email to public
-- Drop existing public policy
DROP POLICY IF EXISTS "Public can view published actor capsules without email" ON public.actor_capsules;

-- Create a new policy that only allows public to see non-sensitive fields via the view
-- The base table should only be accessible to the owner
CREATE POLICY "Public can view published actor capsules via public view" 
ON public.actor_capsules 
FOR SELECT 
USING (
  (auth.uid() = user_id) OR 
  (is_published = true AND auth.role() = 'authenticated')
);

-- Fix 3: Update organizations policies to restrict contact_email access
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Public can view active organizations via public view only" ON public.organizations;

-- Create a more restrictive policy - authenticated users can view, anon users should use the public view
CREATE POLICY "Authenticated users can view organizations" 
ON public.organizations 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Fix 4: Restrict pharma_organizations contact_email exposure
-- Update policy to only allow authenticated access
DROP POLICY IF EXISTS "Public can view active pharma organizations" ON public.pharma_organizations;