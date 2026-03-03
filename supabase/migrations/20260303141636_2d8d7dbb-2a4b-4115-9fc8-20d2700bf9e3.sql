-- Allow anonymous users to insert into erp_batches (for mock auth users)
CREATE POLICY "Allow anon inserts to erp_batches"
ON public.erp_batches
FOR INSERT TO anon
WITH CHECK (true);

-- Allow anonymous users to read erp_batches
CREATE POLICY "Allow anon select erp_batches"
ON public.erp_batches
FOR SELECT TO anon
USING (true);