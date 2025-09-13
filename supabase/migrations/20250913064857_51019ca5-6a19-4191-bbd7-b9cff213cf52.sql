-- First check and drop all existing batch policies
DROP POLICY IF EXISTS "Demo access to active batches" ON public.batches;
DROP POLICY IF EXISTS "Authenticated users can insert batches" ON public.batches;
DROP POLICY IF EXISTS "Authenticated users can update batches" ON public.batches;
DROP POLICY IF EXISTS "Authenticated users can delete batches" ON public.batches;

-- Create single comprehensive policy for batches
CREATE POLICY "Allow batch access for demo" 
ON public.batches 
FOR ALL
USING (
  status = 'active' OR 
  auth.role() = 'authenticated'
)
WITH CHECK (
  auth.role() = 'authenticated'
);

-- Update kadha_capsules policies
DROP POLICY IF EXISTS "Demo access to kadha capsules" ON public.kadha_capsules;
DROP POLICY IF EXISTS "Brand managers can create kadha capsules" ON public.kadha_capsules;
DROP POLICY IF EXISTS "Brand managers can update org kadha capsules" ON public.kadha_capsules;
DROP POLICY IF EXISTS "Brand managers can delete org kadha capsules" ON public.kadha_capsules;

-- Create comprehensive policies for kadha_capsules
CREATE POLICY "Allow kadha capsule access for demo" 
ON public.kadha_capsules 
FOR ALL
USING (
  auth.role() = 'authenticated'
)
WITH CHECK (
  auth.role() = 'authenticated'
);