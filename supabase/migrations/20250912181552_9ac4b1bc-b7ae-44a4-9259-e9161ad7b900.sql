-- Add Kadha Layer database schema (corrected)
-- First, add brand_manager role to user_role enum
ALTER TYPE public.user_role ADD VALUE 'brand_manager';

-- Create kadha_capsules table for story capsules
CREATE TABLE public.kadha_capsules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id uuid NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Capsule content fields
  product_name text NOT NULL,
  origin_story text NOT NULL,
  gmp_certifications jsonb DEFAULT '[]'::jsonb,
  key_ingredients text,
  brand_message text,
  supporting_images jsonb DEFAULT '[]'::jsonb,
  
  -- Publishing and versioning
  is_active boolean DEFAULT false,
  is_published boolean DEFAULT false,
  version_number integer DEFAULT 1,
  
  -- QR and analytics
  qr_code text,
  short_link text,
  scan_count integer DEFAULT 0,
  
  -- Metadata
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  published_at timestamp with time zone
);

-- Create partial unique index to ensure only one active capsule per batch
CREATE UNIQUE INDEX kadha_capsules_batch_active_unique 
ON public.kadha_capsules(batch_id) 
WHERE is_active = true;

-- Create kadha_capsule_versions for version history
CREATE TABLE public.kadha_capsule_versions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  capsule_id uuid NOT NULL REFERENCES public.kadha_capsules(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  
  -- Snapshot of content at this version
  content_snapshot jsonb NOT NULL,
  
  -- Version metadata
  created_by uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  change_notes text,
  
  UNIQUE(capsule_id, version_number)
);

-- Create kadha_analytics for tracking capsule engagement
CREATE TABLE public.kadha_analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  capsule_id uuid NOT NULL REFERENCES public.kadha_capsules(id) ON DELETE CASCADE,
  
  -- Event tracking
  event_type text NOT NULL CHECK (event_type IN ('view', 'scan', 'share')),
  session_id text,
  
  -- Location and device info (anonymized)
  location_data jsonb,
  user_agent text,
  ip_address text,
  referrer text,
  
  -- Engagement metrics
  view_duration integer, -- in seconds
  scroll_depth numeric, -- percentage
  
  -- Metadata
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.kadha_capsules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kadha_capsule_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kadha_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for kadha_capsules
-- Brand managers and admins can view capsules in their organization
CREATE POLICY "Users can view org kadha capsules"
  ON public.kadha_capsules
  FOR SELECT
  USING (
    organization_id IN (
      SELECT up.organization_id 
      FROM public.user_profiles up 
      WHERE up.user_id = auth.uid()
        AND up.role IN ('admin', 'brand_manager')
    )
    OR EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.user_id = auth.uid() AND up.role = 'admin'
    )
  );

-- Only brand managers and admins can create capsules
CREATE POLICY "Brand managers can create kadha capsules"
  ON public.kadha_capsules
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.user_id = auth.uid() 
        AND up.role IN ('admin', 'brand_manager')
        AND up.organization_id = organization_id
    )
  );

-- Only brand managers and admins can update capsules in their org
CREATE POLICY "Brand managers can update org kadha capsules"
  ON public.kadha_capsules
  FOR UPDATE
  USING (
    organization_id IN (
      SELECT up.organization_id 
      FROM public.user_profiles up 
      WHERE up.user_id = auth.uid()
        AND up.role IN ('admin', 'brand_manager')
    )
  );

-- Only brand managers and admins can delete capsules in their org
CREATE POLICY "Brand managers can delete org kadha capsules"
  ON public.kadha_capsules
  FOR DELETE
  USING (
    organization_id IN (
      SELECT up.organization_id 
      FROM public.user_profiles up 
      WHERE up.user_id = auth.uid()
        AND up.role IN ('admin', 'brand_manager')
    )
  );

-- Public can view published capsules
CREATE POLICY "Public can view published kadha capsules"
  ON public.kadha_capsules
  FOR SELECT
  USING (is_published = true AND is_active = true);

-- RLS Policies for kadha_capsule_versions
CREATE POLICY "Users can view versions of org capsules"
  ON public.kadha_capsule_versions
  FOR SELECT
  USING (
    capsule_id IN (
      SELECT kc.id FROM public.kadha_capsules kc
      JOIN public.user_profiles up ON kc.organization_id = up.organization_id
      WHERE up.user_id = auth.uid() AND up.role IN ('admin', 'brand_manager')
    )
  );

CREATE POLICY "Brand managers can create versions"
  ON public.kadha_capsule_versions
  FOR INSERT
  WITH CHECK (
    capsule_id IN (
      SELECT kc.id FROM public.kadha_capsules kc
      JOIN public.user_profiles up ON kc.organization_id = up.organization_id
      WHERE up.user_id = auth.uid() AND up.role IN ('admin', 'brand_manager')
    )
  );

-- RLS Policies for kadha_analytics
-- Only organization members can view analytics
CREATE POLICY "Users can view org capsule analytics"
  ON public.kadha_analytics
  FOR SELECT
  USING (
    capsule_id IN (
      SELECT kc.id FROM public.kadha_capsules kc
      JOIN public.user_profiles up ON kc.organization_id = up.organization_id
      WHERE up.user_id = auth.uid() AND up.role IN ('admin', 'brand_manager')
    )
  );

-- Anyone can create analytics events (for public tracking)
CREATE POLICY "Anyone can create analytics events"
  ON public.kadha_analytics
  FOR INSERT
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX kadha_capsules_batch_id_idx ON public.kadha_capsules(batch_id);
CREATE INDEX kadha_capsules_organization_id_idx ON public.kadha_capsules(organization_id);
CREATE INDEX kadha_capsules_is_published_idx ON public.kadha_capsules(is_published, is_active) WHERE is_published = true;
CREATE INDEX kadha_capsule_versions_capsule_id_idx ON public.kadha_capsule_versions(capsule_id);
CREATE INDEX kadha_analytics_capsule_id_idx ON public.kadha_analytics(capsule_id);
CREATE INDEX kadha_analytics_event_type_idx ON public.kadha_analytics(event_type);
CREATE INDEX kadha_analytics_created_at_idx ON public.kadha_analytics(created_at);

-- Create trigger for updated_at
CREATE TRIGGER update_kadha_capsules_updated_at
  BEFORE UPDATE ON public.kadha_capsules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate unique short links for Kadha capsules
CREATE OR REPLACE FUNCTION public.generate_kadha_short_link()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Generate short link if not provided
  IF NEW.short_link IS NULL THEN
    NEW.short_link := 'zbl.to/kadha/' || LPAD(EXTRACT(epoch FROM now())::bigint::text, 10, '0');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to generate short link
CREATE TRIGGER generate_kadha_short_link_trigger
  BEFORE INSERT ON public.kadha_capsules
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_kadha_short_link();

-- Function to create version snapshot when publishing
CREATE OR REPLACE FUNCTION public.create_kadha_version_snapshot()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create version snapshot when publishing status changes
  IF NEW.is_published = true AND (OLD.is_published = false OR OLD.is_published IS NULL) THEN
    INSERT INTO public.kadha_capsule_versions (
      capsule_id,
      version_number,
      content_snapshot,
      created_by,
      change_notes
    ) VALUES (
      NEW.id,
      NEW.version_number,
      jsonb_build_object(
        'product_name', NEW.product_name,
        'origin_story', NEW.origin_story,
        'gmp_certifications', NEW.gmp_certifications,
        'key_ingredients', NEW.key_ingredients,
        'brand_message', NEW.brand_message,
        'supporting_images', NEW.supporting_images,
        'metadata', NEW.metadata
      ),
      NEW.created_by,
      'Published version ' || NEW.version_number
    );
    
    -- Update published_at timestamp
    NEW.published_at = now();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to create version snapshots
CREATE TRIGGER create_kadha_version_snapshot_trigger
  BEFORE UPDATE ON public.kadha_capsules
  FOR EACH ROW
  EXECUTE FUNCTION public.create_kadha_version_snapshot();