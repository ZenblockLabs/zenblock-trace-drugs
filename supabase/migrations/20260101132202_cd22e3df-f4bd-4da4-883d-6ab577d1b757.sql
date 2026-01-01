-- Add drug_id column to erp_batches table
ALTER TABLE public.erp_batches ADD COLUMN drug_id text;

-- Create index for faster lookups
CREATE INDEX idx_erp_batches_drug_id ON public.erp_batches(drug_id);