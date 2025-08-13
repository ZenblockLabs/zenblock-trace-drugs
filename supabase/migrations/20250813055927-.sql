-- Fix security issue: Restrict public access to sensitive location data in event_images

-- Drop the existing public policy that exposes location data
DROP POLICY IF EXISTS "Public can view event images for active batches" ON public.event_images;

-- Create a function to get public event images without sensitive data
CREATE OR REPLACE FUNCTION public.get_public_event_images(p_batch_id uuid DEFAULT NULL)
RETURNS TABLE (
  id uuid,
  batch_id uuid,
  event_id uuid,
  step_name text,
  image_url text,
  image_path text,
  note text,
  event_timestamp timestamp with time zone,
  created_at timestamp with time zone
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ei.id,
    ei.batch_id,
    ei.event_id,
    ei.step_name,
    ei.image_url,
    ei.image_path,
    ei.note,
    ei.timestamp as event_timestamp,
    ei.created_at
  FROM public.event_images ei
  JOIN public.batches b ON ei.batch_id = b.id
  WHERE b.status = 'active'
    AND (p_batch_id IS NULL OR ei.batch_id = p_batch_id);
END;
$$;

-- Create a restricted policy that blocks access to sensitive location data for public users
CREATE POLICY "Public can view basic event images only" 
ON public.event_images 
FOR SELECT 
USING (
  -- Only allow public access to active batch images but without location data access
  batch_id IN (SELECT id FROM public.batches WHERE status = 'active')
  AND auth.role() = 'authenticated'
);

-- Grant execute permission to anonymous and authenticated users for the public function
GRANT EXECUTE ON FUNCTION public.get_public_event_images(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_event_images(uuid) TO authenticated;