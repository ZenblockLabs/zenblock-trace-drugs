-- Fix security issue: Restrict public access to sensitive location data in event_images

-- Drop the existing public policy that exposes location data
DROP POLICY IF EXISTS "Public can view event images for active batches" ON public.event_images;

-- Create a secure view for public access that excludes sensitive location data
CREATE OR REPLACE VIEW public.event_images_public AS 
SELECT 
  id,
  batch_id,
  event_id,
  step_name,
  image_url,
  image_path,
  note,
  timestamp,
  created_at,
  -- Exclude sensitive fields: latitude, longitude, metadata, uploaded_by, file_size, mime_type, image_hash
  NULL::numeric as latitude,  -- Return NULL instead of actual coordinates
  NULL::numeric as longitude, -- Return NULL instead of actual coordinates
  '{}'::jsonb as metadata     -- Return empty object instead of actual metadata
FROM public.event_images
WHERE batch_id IN (
  SELECT id FROM public.batches WHERE status = 'active'
);

-- Enable RLS on the view (inherited from base table)
ALTER VIEW public.event_images_public SET (security_barrier = true);

-- Create policy for public access to the sanitized view
CREATE POLICY "Public can view sanitized event images for active batches" 
ON public.event_images 
FOR SELECT 
USING (
  -- Only allow public access to basic image info, no location data
  batch_id IN (SELECT id FROM public.batches WHERE status = 'active')
  AND NOT (latitude IS NOT NULL OR longitude IS NOT NULL OR metadata != '{}'::jsonb)
);

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
  timestamp timestamp with time zone,
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
    ei.timestamp,
    ei.created_at
  FROM public.event_images ei
  JOIN public.batches b ON ei.batch_id = b.id
  WHERE b.status = 'active'
    AND (p_batch_id IS NULL OR ei.batch_id = p_batch_id);
END;
$$;

-- Grant execute permission to anonymous users for the public function
GRANT EXECUTE ON FUNCTION public.get_public_event_images(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.get_public_event_images(uuid) TO authenticated;