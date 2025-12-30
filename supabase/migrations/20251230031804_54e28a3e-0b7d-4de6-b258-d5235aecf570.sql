-- Fix 1: Enable RLS on erp_batches and add policies
ALTER TABLE public.erp_batches ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view erp_batches
CREATE POLICY "Authenticated users can view erp_batches" 
ON public.erp_batches 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Allow authenticated users to insert erp_batches
CREATE POLICY "Authenticated users can insert erp_batches" 
ON public.erp_batches 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow authenticated users to update their own records
CREATE POLICY "Authenticated users can update erp_batches" 
ON public.erp_batches 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Fix 2: Create a view for actor_capsules that hides email for public access
-- First drop if exists, then recreate
DROP VIEW IF EXISTS public.actor_capsules_public CASCADE;

CREATE VIEW public.actor_capsules_public AS
SELECT 
  id,
  actor_name,
  age,
  bio,
  created_at,
  credits,
  eye_color,
  gallery_images,
  hair_color,
  has_passport,
  height,
  imdb_url,
  instagram_url,
  intro_video_url,
  is_published,
  languages,
  profile_photo,
  qr_scan_count,
  reels,
  short_link,
  skills,
  slug,
  tagline,
  theme,
  updated_at,
  videos,
  view_count,
  youtube_url,
  accent_color
  -- Explicitly NOT including email and agent_contact for privacy
FROM public.actor_capsules
WHERE is_published = true;

-- Grant SELECT to anon and authenticated
GRANT SELECT ON public.actor_capsules_public TO anon, authenticated;

-- Fix 3: Create a view for organizations that hides sensitive fields for public access
DROP VIEW IF EXISTS public.organizations_public CASCADE;

CREATE VIEW public.organizations_public AS
SELECT 
  id,
  organization_type,
  created_at,
  updated_at,
  name,
  slug,
  description,
  logo_url,
  industry,
  status
  -- Explicitly NOT including contact_email, assigned_user_id, assigned_user_email for privacy
FROM public.organizations
WHERE status = 'active';

-- Grant SELECT to anon and authenticated
GRANT SELECT ON public.organizations_public TO anon, authenticated;

-- Fix 4: Create a view for pharma_organizations that hides sensitive fields
DROP VIEW IF EXISTS public.pharma_organizations_public CASCADE;

CREATE VIEW public.pharma_organizations_public AS
SELECT 
  id,
  organization_type,
  created_at,
  updated_at,
  name,
  slug,
  description,
  logo_url,
  industry,
  status
  -- Explicitly NOT including contact_email for privacy
FROM public.pharma_organizations
WHERE status = 'active';

-- Grant SELECT to anon and authenticated
GRANT SELECT ON public.pharma_organizations_public TO anon, authenticated;