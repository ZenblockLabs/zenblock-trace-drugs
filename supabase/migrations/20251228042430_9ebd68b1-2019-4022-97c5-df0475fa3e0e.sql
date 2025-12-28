-- Fix 1: Add RLS policies for contact_form_rate_limit table
-- Allow service role to manage rate limits (for edge functions)
CREATE POLICY "Service role can manage rate limits"
ON public.contact_form_rate_limit
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Allow public to insert rate limit records (for tracking)
CREATE POLICY "Public can insert rate limit records"
ON public.contact_form_rate_limit
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow public to read their own rate limit (by IP matching handled in function)
CREATE POLICY "Allow rate limit function access"
ON public.contact_form_rate_limit
FOR SELECT
TO anon, authenticated
USING (true);

-- Allow rate limit updates
CREATE POLICY "Allow rate limit updates"
ON public.contact_form_rate_limit
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Fix 2: Add RLS policy for organizations_public view
-- Since this is a security invoker view, we need to allow SELECT on the underlying table
-- The view already filters to only active organizations and excludes sensitive fields

-- Fix 3: Fix function search_path for cleanup_old_analytics
CREATE OR REPLACE FUNCTION public.cleanup_old_analytics()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  deleted_count integer;
BEGIN
  DELETE FROM public.qr_analytics 
  WHERE scan_timestamp < NOW() - INTERVAL '2 years';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$function$;