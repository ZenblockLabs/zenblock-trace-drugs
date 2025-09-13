-- Create pharma-specific organizations table
CREATE TABLE public.pharma_organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  contact_email TEXT,
  industry TEXT NOT NULL DEFAULT 'pharmaceutical',
  status TEXT NOT NULL DEFAULT 'active',
  organization_type TEXT NOT NULL DEFAULT 'pharmaceutical',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pharma-specific batches table
CREATE TABLE public.pharma_batches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.pharma_organizations(id),
  batch_number TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_type TEXT NOT NULL DEFAULT 'pharmaceutical',
  description TEXT,
  quantity INTEGER,
  unit TEXT DEFAULT 'units',
  status TEXT NOT NULL DEFAULT 'active',
  origin_location TEXT,
  harvest_date DATE,
  images JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  qr_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pharma-specific kadha capsules table
CREATE TABLE public.pharma_kadha_capsules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id UUID NOT NULL REFERENCES public.pharma_batches(id),
  organization_id UUID NOT NULL REFERENCES public.pharma_organizations(id),
  created_by UUID NOT NULL,
  product_name TEXT NOT NULL,
  origin_story TEXT NOT NULL,
  key_ingredients TEXT,
  brand_message TEXT,
  gmp_certifications JSONB DEFAULT '[]'::jsonb,
  supporting_images JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  version_number INTEGER DEFAULT 1,
  scan_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  short_link TEXT,
  qr_code TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create pharma-specific analytics table
CREATE TABLE public.pharma_kadha_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  capsule_id UUID NOT NULL REFERENCES public.pharma_kadha_capsules(id),
  event_type TEXT NOT NULL,
  session_id TEXT,
  referrer TEXT,
  location_data JSONB,
  view_duration INTEGER,
  scroll_depth NUMERIC,
  metadata JSONB DEFAULT '{}'::jsonb,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.pharma_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharma_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharma_kadha_capsules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharma_kadha_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for pharma_organizations
CREATE POLICY "Public can view active pharma organizations"
ON public.pharma_organizations FOR SELECT
USING (status = 'active');

CREATE POLICY "Authenticated users can manage pharma organizations"
ON public.pharma_organizations FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Create RLS policies for pharma_batches
CREATE POLICY "Public can view active pharma batches"
ON public.pharma_batches FOR SELECT
USING (status = 'active');

CREATE POLICY "Authenticated users can manage pharma batches"
ON public.pharma_batches FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Create RLS policies for pharma_kadha_capsules
CREATE POLICY "Public can view published pharma capsules"
ON public.pharma_kadha_capsules FOR SELECT
USING (is_published = true AND is_active = true);

CREATE POLICY "Authenticated users can manage pharma capsules"
ON public.pharma_kadha_capsules FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Create RLS policies for pharma_kadha_analytics
CREATE POLICY "Anyone can create pharma analytics events"
ON public.pharma_kadha_analytics FOR INSERT
WITH CHECK (true);

CREATE POLICY "Authenticated users can view pharma analytics"
ON public.pharma_kadha_analytics FOR SELECT
USING (auth.role() = 'authenticated');

-- Insert pharmaceutical organizations
INSERT INTO public.pharma_organizations (name, slug, description, contact_email, organization_type) VALUES
('ZenPharma Inc.', 'zenpharma-inc', 'Leading pharmaceutical manufacturer specializing in advanced drug formulations', 'contact@zenpharma.com', 'manufacturer'),
('MediDistribute LLC', 'medidistribute-llc', 'Nationwide pharmaceutical distribution network', 'info@medidistribute.com', 'distributor'),
('ZenMed Pharmacy', 'zenmed-pharmacy', 'Community pharmacy serving patients with quality medications', 'orders@zenmedpharmacy.com', 'dispenser'),
('Pharmaceutical Regulatory Authority', 'pharma-regulatory-authority', 'Government regulatory body overseeing pharmaceutical safety and compliance', 'compliance@pharmaregulatory.gov', 'regulator');

-- Insert pharmaceutical batches
INSERT INTO public.pharma_batches (
  organization_id, 
  batch_number, 
  product_name, 
  description, 
  quantity, 
  unit,
  origin_location,
  harvest_date
) VALUES
(
  (SELECT id FROM public.pharma_organizations WHERE slug = 'zenpharma-inc'),
  'BATCH-1234',
  'ZenRelief 10mg',
  'Advanced pain relief medication with controlled release formula',
  10000,
  'tablets',
  'ZenPharma Manufacturing Facility, New Jersey',
  CURRENT_DATE - INTERVAL '30 days'
),
(
  (SELECT id FROM public.pharma_organizations WHERE slug = 'zenpharma-inc'),
  'BATCH-1235',
  'CardioZen 25mg',
  'Cardiovascular medication for heart health management',
  5000,
  'tablets',
  'ZenPharma Manufacturing Facility, New Jersey',
  CURRENT_DATE - INTERVAL '25 days'
),
(
  (SELECT id FROM public.pharma_organizations WHERE slug = 'zenpharma-inc'),
  'BATCH-1236',
  'PainEase 50mg',
  'High-strength analgesic for severe pain management',
  7500,
  'capsules',
  'ZenPharma Manufacturing Facility, New Jersey',
  CURRENT_DATE - INTERVAL '20 days'
),
(
  (SELECT id FROM public.pharma_organizations WHERE slug = 'zenpharma-inc'),
  'BATCH-1237',
  'AnomalyMed 100mg',
  'Specialized medication for rare condition treatment',
  2000,
  'vials',
  'ZenPharma Manufacturing Facility, New Jersey',
  CURRENT_DATE - INTERVAL '15 days'
),
(
  (SELECT id FROM public.pharma_organizations WHERE slug = 'zenpharma-inc'),
  'BATCH-1238',
  'TimeGapMed 75mg',
  'Extended-release medication for chronic condition management',
  8000,
  'tablets',
  'ZenPharma Manufacturing Facility, New Jersey',
  CURRENT_DATE - INTERVAL '10 days'
);

-- Add triggers for updated_at
CREATE TRIGGER update_pharma_organizations_updated_at
  BEFORE UPDATE ON public.pharma_organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_pharma_batches_updated_at
  BEFORE UPDATE ON public.pharma_batches
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_pharma_kadha_capsules_updated_at
  BEFORE UPDATE ON public.pharma_kadha_capsules
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Add short link generation trigger for pharma capsules
CREATE TRIGGER generate_pharma_kadha_short_link
  BEFORE INSERT ON public.pharma_kadha_capsules
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_kadha_short_link();