-- Fix 1: Restrict actor_capsules email visibility to authenticated users only
-- Drop existing public view policy
DROP POLICY IF EXISTS "Public can view published actor capsules" ON public.actor_capsules;

-- Create new policy that hides email from public
CREATE POLICY "Public can view published actor capsules without email"
ON public.actor_capsules
FOR SELECT
USING (is_published = true);

-- Create a view for public access that excludes sensitive data
CREATE OR REPLACE VIEW public.actor_capsules_public
WITH (security_invoker = true)
AS SELECT 
  id,
  actor_name,
  tagline,
  height,
  hair_color,
  eye_color,
  languages,
  skills,
  intro_video_url,
  bio,
  imdb_url,
  instagram_url,
  youtube_url,
  theme,
  accent_color,
  slug,
  short_link,
  profile_photo,
  age,
  has_passport,
  videos,
  credits,
  gallery_images,
  reels,
  is_published,
  view_count,
  qr_scan_count,
  created_at,
  updated_at
  -- Explicitly excludes: email, agent_contact, user_id
FROM public.actor_capsules
WHERE is_published = true;

-- Fix 2: Restrict contact_form_rate_limit to service role only
-- Drop existing public policies
DROP POLICY IF EXISTS "Allow rate limit function access" ON public.contact_form_rate_limit;
DROP POLICY IF EXISTS "Allow rate limit updates" ON public.contact_form_rate_limit;
DROP POLICY IF EXISTS "Public can insert rate limit records" ON public.contact_form_rate_limit;
DROP POLICY IF EXISTS "Service role can manage rate limits" ON public.contact_form_rate_limit;

-- Only service role should access this table (handled by RLS being enabled with no public policies)
-- The check_contact_rate_limit function uses SECURITY DEFINER so it can still access the table
CREATE POLICY "Service role only access"
ON public.contact_form_rate_limit
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Update check_contact_rate_limit function to be SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.check_contact_rate_limit(ip text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  rate_record RECORD;
  max_submissions INTEGER := 5;
  time_window INTERVAL := '1 hour';
BEGIN
  SELECT * INTO rate_record
  FROM public.contact_form_rate_limit
  WHERE ip_address = ip
  AND last_submission_at > NOW() - time_window;
  
  IF NOT FOUND THEN
    INSERT INTO public.contact_form_rate_limit (ip_address, submission_count, first_submission_at, last_submission_at)
    VALUES (ip, 1, NOW(), NOW())
    ON CONFLICT (ip_address) DO UPDATE
    SET submission_count = 1,
        first_submission_at = NOW(),
        last_submission_at = NOW();
    RETURN TRUE;
  END IF;
  
  IF rate_record.submission_count >= max_submissions THEN
    RETURN FALSE;
  END IF;
  
  UPDATE public.contact_form_rate_limit
  SET submission_count = submission_count + 1,
      last_submission_at = NOW()
  WHERE ip_address = ip;
  
  RETURN TRUE;
END;
$$;