-- Allow public inserts to erp_batches for barcode scanning (no auth required)
DROP POLICY IF EXISTS "Authenticated users can insert erp_batches" ON public.erp_batches;

-- Create permissive insert policy for all users
CREATE POLICY "Anyone can insert erp_batches"
ON public.erp_batches
FOR INSERT
WITH CHECK (true);

-- Keep SELECT restricted to authenticated users for security
-- (existing policy is fine)