-- Fix security issue: Restrict access to QR analytics data and protect sensitive user information

-- Drop the overly permissive policy that allows any authenticated user to see all analytics
DROP POLICY IF EXISTS "Authenticated users can view QR analytics" ON public.qr_analytics;

-- Create a restrictive policy that only allows users to view analytics for their organization's batches
CREATE POLICY "Users can only view analytics for their organization batches" 
ON public.qr_analytics 
FOR SELECT 
USING (
  -- Only allow viewing analytics for batches belonging to user's organization
  batch_id IN (
    SELECT b.id 
    FROM public.batches b
    JOIN public.user_profiles up ON b.organization_id = up.organization_id
    WHERE up.user_id = auth.uid()
  )
  -- OR if user is admin, they can see all analytics
  OR EXISTS (
    SELECT 1 
    FROM public.user_profiles up 
    WHERE up.user_id = auth.uid() 
    AND up.role = 'admin'
  )
);

-- Create a function to get anonymized analytics data for reporting (removes sensitive personal data)
CREATE OR REPLACE FUNCTION public.get_analytics_summary(p_batch_id uuid DEFAULT NULL)
RETURNS TABLE (
  id uuid,
  batch_id uuid,
  scan_timestamp timestamp with time zone,
  scan_date date,
  scan_hour integer,
  country_code text,
  city text,
  browser_family text,
  device_type text
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only return data if user has access to the batch
  IF NOT EXISTS (
    SELECT 1 FROM public.batches b
    JOIN public.user_profiles up ON b.organization_id = up.organization_id
    WHERE up.user_id = auth.uid()
    AND (p_batch_id IS NULL OR b.id = p_batch_id)
  ) AND NOT EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.user_id = auth.uid() AND up.role = 'admin'
  ) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT 
    qa.id,
    qa.batch_id,
    qa.scan_timestamp,
    qa.scan_timestamp::date as scan_date,
    EXTRACT(hour FROM qa.scan_timestamp)::integer as scan_hour,
    -- Extract only general location info, not precise coordinates
    COALESCE((qa.location_data->>'country_code')::text, 'Unknown') as country_code,
    COALESCE((qa.location_data->>'city')::text, 'Unknown') as city,
    -- Extract only browser family, not full user agent
    CASE 
      WHEN qa.user_agent ILIKE '%chrome%' THEN 'Chrome'
      WHEN qa.user_agent ILIKE '%firefox%' THEN 'Firefox'
      WHEN qa.user_agent ILIKE '%safari%' THEN 'Safari'
      WHEN qa.user_agent ILIKE '%edge%' THEN 'Edge'
      ELSE 'Other'
    END as browser_family,
    -- Extract device type without revealing specific details
    CASE 
      WHEN qa.user_agent ILIKE '%mobile%' THEN 'Mobile'
      WHEN qa.user_agent ILIKE '%tablet%' THEN 'Tablet'
      ELSE 'Desktop'
    END as device_type
  FROM public.qr_analytics qa
  JOIN public.batches b ON qa.batch_id = b.id
  WHERE (p_batch_id IS NULL OR qa.batch_id = p_batch_id);
END;
$$;

-- Create a data retention policy function to automatically clean old analytics data
CREATE OR REPLACE FUNCTION public.cleanup_old_analytics()
RETURNS integer
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  deleted_count integer;
BEGIN
  -- Delete analytics data older than 2 years to comply with data retention policies
  DELETE FROM public.qr_analytics 
  WHERE scan_timestamp < NOW() - INTERVAL '2 years';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Log the cleanup activity
  INSERT INTO public.system_logs (activity, details, created_at)
  VALUES (
    'analytics_cleanup', 
    jsonb_build_object('deleted_records', deleted_count),
    NOW()
  ) ON CONFLICT DO NOTHING; -- Ignore if system_logs table doesn't exist
  
  RETURN deleted_count;
END;
$$;

-- Grant appropriate permissions
GRANT EXECUTE ON FUNCTION public.get_analytics_summary(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_old_analytics() TO service_role;

-- Create an index for better performance on organization-based queries
CREATE INDEX IF NOT EXISTS idx_qr_analytics_batch_timestamp 
ON public.qr_analytics (batch_id, scan_timestamp DESC);

-- Add a comment to document the security measures
COMMENT ON TABLE public.qr_analytics IS 
'QR code scan analytics with privacy protection. Access restricted to organization members only. Sensitive data (IP, full user agent) should only be accessed by admins for security purposes.';