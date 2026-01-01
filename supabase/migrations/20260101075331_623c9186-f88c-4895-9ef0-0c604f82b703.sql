-- Add DELETE policy for erp_batches table
CREATE POLICY "Anyone can delete erp_batches"
ON public.erp_batches
FOR DELETE
USING (true);