-- Update RLS policies for demo access to batches
DROP POLICY IF EXISTS "Producer users can only view their org batches" ON public.batches;

CREATE POLICY "Demo access to active batches" 
ON public.batches 
FOR SELECT 
USING (
  status = 'active' OR 
  (organization_id IN (
    SELECT up.organization_id 
    FROM user_profiles up 
    WHERE up.user_id = auth.uid()
  )) OR 
  (EXISTS (
    SELECT 1 FROM user_profiles up 
    WHERE up.user_id = auth.uid() AND up.role = 'admin'
  ))
);

-- Update RLS policies for demo access to kadha_capsules
DROP POLICY IF EXISTS "Users can view org kadha capsules" ON public.kadha_capsules;
DROP POLICY IF EXISTS "Public can view published kadha capsules" ON public.kadha_capsules;

CREATE POLICY "Demo access to kadha capsules" 
ON public.kadha_capsules 
FOR SELECT 
USING (
  (is_published = true AND is_active = true) OR
  (organization_id IN (
    SELECT up.organization_id 
    FROM user_profiles up 
    WHERE up.user_id = auth.uid() AND up.role = ANY(ARRAY['admin', 'brand_manager'])
  )) OR 
  (EXISTS (
    SELECT 1 FROM user_profiles up 
    WHERE up.user_id = auth.uid() AND up.role = 'admin'
  ))
);