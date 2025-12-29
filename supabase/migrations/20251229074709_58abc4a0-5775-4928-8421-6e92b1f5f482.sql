-- Update RLS policies to allow anonymous inserts for QR code scanning
-- Drop existing insert policy
DROP POLICY IF EXISTS "Authenticated users can insert ERP batches" ON public.erp_batches;

-- Create new policy that allows anyone to insert (for QR scanning)
CREATE POLICY "Anyone can insert ERP batches" 
ON public.erp_batches 
FOR INSERT 
WITH CHECK (true);

-- Update select policy to allow anyone to view
DROP POLICY IF EXISTS "Authenticated users can view ERP batches" ON public.erp_batches;

CREATE POLICY "Anyone can view ERP batches" 
ON public.erp_batches 
FOR SELECT 
USING (true);