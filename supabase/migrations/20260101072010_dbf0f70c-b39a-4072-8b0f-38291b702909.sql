-- Drop the existing restrictive SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view erp_batches" ON erp_batches;

-- Create a new policy that allows anyone to view erp_batches (for demo purposes)
CREATE POLICY "Anyone can view erp_batches" 
ON erp_batches 
FOR SELECT 
USING (true);