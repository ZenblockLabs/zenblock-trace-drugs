-- Create cold chain events table for temperature monitoring
CREATE TABLE IF NOT EXISTS public.coldchain_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid NOT NULL,
  batch_id uuid REFERENCES public.batches(id) ON DELETE CASCADE,
  temp_min numeric NOT NULL,
  temp_max numeric NOT NULL,
  temp_avg numeric,
  humidity numeric,
  excursion_flag boolean DEFAULT false,
  excursion_details text,
  sensor_id text,
  location_gln text,
  event_hash text,
  blockchain_tx_id text,
  recorded_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create aggregations table for case/pallet hierarchies
CREATE TABLE IF NOT EXISTS public.aggregations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL,
  child_id uuid NOT NULL,
  parent_type text NOT NULL CHECK (parent_type IN ('pallet', 'case', 'container')),
  child_type text NOT NULL CHECK (child_type IN ('case', 'unit', 'pallet')),
  batch_id uuid REFERENCES public.batches(id) ON DELETE CASCADE,
  aggregation_date timestamp with time zone DEFAULT now(),
  disaggregation_date timestamp with time zone,
  status text DEFAULT 'active' CHECK (status IN ('active', 'disaggregated', 'shipped')),
  created_at timestamp with time zone DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb,
  UNIQUE(parent_id, child_id)
);

-- Create shipments table for enhanced tracking
CREATE TABLE IF NOT EXISTS public.shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid REFERENCES public.batches(id) ON DELETE CASCADE,
  shipment_number text NOT NULL UNIQUE,
  from_gln text NOT NULL,
  to_gln text NOT NULL,
  from_location text,
  to_location text,
  departure_date timestamp with time zone,
  expected_arrival timestamp with time zone,
  actual_arrival timestamp with time zone,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_transit', 'delivered', 'delayed', 'cancelled')),
  temperature_controlled boolean DEFAULT false,
  route_info jsonb DEFAULT '{}'::jsonb,
  shipment_doc_hash text,
  blockchain_tx_id text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create enhanced recalls table with affected shipments
CREATE TABLE IF NOT EXISTS public.recall_affected_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recall_id uuid NOT NULL,
  item_type text NOT NULL CHECK (item_type IN ('batch', 'unit', 'shipment')),
  item_id uuid NOT NULL,
  sgtin text,
  lot_number text,
  current_location text,
  owner_gln text,
  status text DEFAULT 'identified' CHECK (status IN ('identified', 'notified', 'quarantined', 'returned', 'disposed')),
  notification_sent_at timestamp with time zone,
  action_taken_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create recall events table
CREATE TABLE IF NOT EXISTS public.recall_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recall_id uuid NOT NULL,
  event_type text NOT NULL,
  description text,
  actor_name text,
  actor_role text,
  timestamp timestamp with time zone DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.coldchain_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aggregations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recall_affected_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recall_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for coldchain_events
CREATE POLICY "Authenticated users can view coldchain events"
  ON public.coldchain_events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert coldchain events"
  ON public.coldchain_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for aggregations
CREATE POLICY "Authenticated users can view aggregations"
  ON public.aggregations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage aggregations"
  ON public.aggregations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for shipments
CREATE POLICY "Authenticated users can view shipments"
  ON public.shipments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage shipments"
  ON public.shipments FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for recall items
CREATE POLICY "Authenticated users can view recall items"
  ON public.recall_affected_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage recall items"
  ON public.recall_affected_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for recall events
CREATE POLICY "Authenticated users can view recall events"
  ON public.recall_events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create recall events"
  ON public.recall_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_coldchain_batch ON public.coldchain_events(batch_id);
CREATE INDEX idx_coldchain_shipment ON public.coldchain_events(shipment_id);
CREATE INDEX idx_coldchain_recorded ON public.coldchain_events(recorded_at);
CREATE INDEX idx_aggregations_parent ON public.aggregations(parent_id);
CREATE INDEX idx_aggregations_child ON public.aggregations(child_id);
CREATE INDEX idx_aggregations_batch ON public.aggregations(batch_id);
CREATE INDEX idx_shipments_batch ON public.shipments(batch_id);
CREATE INDEX idx_shipments_status ON public.shipments(status);
CREATE INDEX idx_recall_items_recall ON public.recall_affected_items(recall_id);
CREATE INDEX idx_recall_events_recall ON public.recall_events(recall_id);