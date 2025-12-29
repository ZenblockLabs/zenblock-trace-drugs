-- Create ERP batches table to store scanned QR code data
CREATE TABLE public.erp_batches (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id text NOT NULL,
    drug_name text NOT NULL,
    quantity integer NOT NULL,
    facility text,
    scanned_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    original_created_at timestamp with time zone,
    metadata jsonb DEFAULT '{}'::jsonb,
    scanned_by uuid REFERENCES auth.users(id),
    status text DEFAULT 'scanned'::text
);

-- Enable RLS
ALTER TABLE public.erp_batches ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can view ERP batches"
ON public.erp_batches
FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert ERP batches"
ON public.erp_batches
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update ERP batches"
ON public.erp_batches
FOR UPDATE
USING (auth.role() = 'authenticated');

-- Create index for faster lookups
CREATE INDEX idx_erp_batches_batch_id ON public.erp_batches(batch_id);
CREATE INDEX idx_erp_batches_scanned_at ON public.erp_batches(scanned_at DESC);