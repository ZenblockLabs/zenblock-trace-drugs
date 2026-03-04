
-- Drop the conflicting RESTRICTIVE policies for erp_batches inserts
DROP POLICY IF EXISTS "Allow anon inserts to erp_batches" ON public.erp_batches;
DROP POLICY IF EXISTS "Authenticated users can insert erp_batches" ON public.erp_batches;
DROP POLICY IF EXISTS "Allow anon select erp_batches" ON public.erp_batches;

-- Create a single PERMISSIVE policy that allows anyone to insert
CREATE POLICY "Anyone can insert erp_batches"
ON public.erp_batches
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create a single PERMISSIVE policy that allows anyone to select
CREATE POLICY "Anyone can select erp_batches"
ON public.erp_batches
FOR SELECT
TO anon, authenticated
USING (true);
