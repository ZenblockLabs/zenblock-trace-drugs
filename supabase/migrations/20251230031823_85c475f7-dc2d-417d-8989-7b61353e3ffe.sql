-- Fix Security Definer View issues by recreating views with SECURITY INVOKER
-- Drop and recreate actor_capsules_public with SECURITY INVOKER
DROP VIEW IF EXISTS public.actor_capsules_public CASCADE;

CREATE VIEW public.actor_capsules_public 
WITH (security_invoker = true) AS
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
FROM public.actor_capsules
WHERE is_published = true;

GRANT SELECT ON public.actor_capsules_public TO anon, authenticated;

-- Drop and recreate organizations_public with SECURITY INVOKER
DROP VIEW IF EXISTS public.organizations_public CASCADE;

CREATE VIEW public.organizations_public 
WITH (security_invoker = true) AS
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
FROM public.organizations
WHERE status = 'active';

GRANT SELECT ON public.organizations_public TO anon, authenticated;

-- Drop and recreate pharma_organizations_public with SECURITY INVOKER
DROP VIEW IF EXISTS public.pharma_organizations_public CASCADE;

CREATE VIEW public.pharma_organizations_public 
WITH (security_invoker = true) AS
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
FROM public.pharma_organizations
WHERE status = 'active';

GRANT SELECT ON public.pharma_organizations_public TO anon, authenticated;